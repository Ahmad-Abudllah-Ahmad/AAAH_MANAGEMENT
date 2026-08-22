// Supabase-backed store — Postgres is source of truth; IndexedDB is local cache.
import { createLocalStore, ANN_SCHEMA, emptyAnnotations } from "./store.js";
import { parseSheetKey } from "./sheetKey";
import {
  isSupabaseConfigured,
  getSupabaseProjectId,
  getSupabaseProjectIdFromUrl,
  setSupabaseProjectId,
} from "./supabase/client.js";
import {
  loadProjectFromSupabase,
  syncProjectToSupabase,
  createSupabaseProject,
  seedShapeSnapshot,
  clearProjectDataInSupabase,
  normalizeAiFloorShapeSheetIds,
} from "./supabase/persist.js";
import {
  listProjectFiles,
  upsertProjectFile,
  downloadProjectFile,
  deleteProjectFile,
  hydrateLocalPlansFromDb,
  uploadProjectFilesBatch,
  fileFoldersFromProjectFiles,
  sheetListNameFromRow,
  sheetRelPath,
  sheetBaseName,
} from "./supabase/projectFiles.js";
import { touchProjectOpened, openSupabaseProject } from "./supabase/projects.js";
import { createSupabaseRecents, browserStorage } from "./supabaseRecents.js";

let lastRemoteUpdatedAt = null;
/** Session cache — avoids repeated manifest queries while the gallery/sidebar refreshes. */
let cachedPlanManifest = null;
let cachedPlanManifestProjectId = null;
/** Dedupes concurrent manifest fetches (mount listSheets vs loadAnnotations). */
let manifestFetchPromise = null;
let manifestFetchProjectId = null;
/** Resolves with the manifest once the Storage walk has reconciled it. The sheet
 *  list renders from Postgres alone before this settles; only work that needs to
 *  know which rows actually have bytes (hydration) waits for it. */
let manifestReconciled = null;

function invalidatePlanManifestCache() {
  cachedPlanManifest = null;
  cachedPlanManifestProjectId = null;
  manifestFetchPromise = null;
  manifestFetchProjectId = null;
  manifestReconciled = null;
}

function mergeRemoteAndLocalSheetNames(localList, rows) {
  const names = new Set((rows || []).map((r) => sheetListNameFromRow(r)));
  for (const s of localList || []) names.add(s.name);
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((name) => ({ name }));
}

function findManifestRow(rows, name) {
  if (!rows?.length || !name) return undefined;
  return rows.find((r) => sheetListNameFromRow(r) === name)
    || rows.find((r) => r.file_name === name);
}

function notifyPlanManifestReady() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("adicc:plan-manifest-ready"));
}

async function ensurePlanManifest(projectId) {
  if (!projectId) return [];
  if (cachedPlanManifestProjectId === projectId && cachedPlanManifest) {
    return cachedPlanManifest;
  }
  if (manifestFetchProjectId === projectId && manifestFetchPromise) {
    return manifestFetchPromise;
  }
  let settleReconciled;
  manifestReconciled = new Promise((resolve) => { settleReconciled = resolve; });
  manifestFetchProjectId = projectId;
  manifestFetchPromise = listProjectFiles(projectId, {
    onReconciled: (rows) => {
      if (cachedPlanManifestProjectId === projectId) cachedPlanManifest = rows;
      settleReconciled(rows);
      notifyPlanManifestReady();
    },
  })
    .then((rows) => {
      cachedPlanManifest = rows;
      cachedPlanManifestProjectId = projectId;
      manifestFetchPromise = null;
      manifestFetchProjectId = null;
      return rows;
    })
    .catch((e) => {
      manifestFetchPromise = null;
      manifestFetchProjectId = null;
      settleReconciled([]);
      throw e;
    });
  return manifestFetchPromise;
}

/** The manifest with `in_storage` resolved — rows the walk proved have no bytes are
 *  worth skipping rather than downloading. Falls back to whatever is cached. */
async function planManifestReconciled(fallbackRows) {
  const rows = manifestReconciled ? await manifestReconciled : null;
  return rows?.length ? rows : fallbackRows;
}

async function ensureProjectId(explicitId = null) {
  const fromUrl = (() => {
    try { return new URLSearchParams(window.location.search).get("db"); }
    catch { return null; }
  })();
  if (fromUrl) {
    setSupabaseProjectId(fromUrl);
    return fromUrl;
  }
  if (explicitId) {
    setSupabaseProjectId(explicitId);
    return explicitId;
  }
  let id = getSupabaseProjectId();
  if (id) return id;
  id = await createSupabaseProject("ADICC Project");
  setSupabaseProjectId(id);
  return id;
}

function remoteHasData(payload) {
  return !!(payload?.shapes?.length || payload?.conditions?.length
    || payload?.markups?.length || payload?.boq_lines?.length);
}

/** @param {string|null} [projectId] Supabase project UUID — scopes local IndexedDB cache */
export function createSupabaseStore(projectId = null) {
  const scope = projectId || getSupabaseProjectIdFromUrl() || getSupabaseProjectId() || null;
  if (scope && cachedPlanManifestProjectId && cachedPlanManifestProjectId !== scope) {
    invalidatePlanManifestCache();
  }
  const local = createLocalStore(scope);

  return {
    ...local,

    /** Load plan manifest from Postgres before canvas mount (new browser / recents). */
    async prefetchPlanManifest() {
      if (!isSupabaseConfigured()) return [];
      const pid = scope || (await ensureProjectId());
      invalidatePlanManifestCache();
      return ensurePlanManifest(pid);
    },

    async listSheets() {
      const localList = await local.listSheets();
      if (!isSupabaseConfigured()) return localList;
      try {
        const pid = await ensureProjectId(scope);
        const rows = await ensurePlanManifest(pid);
        if (!rows.length) return localList;
        return mergeRemoteAndLocalSheetNames(localList, rows);
      } catch (e) {
        console.warn("[ADICC] listProjectFiles", e);
        return localList;
      }
    },

    async loadPdfData(name) {
      if (!isSupabaseConfigured()) return local.loadPdfData(name);

      const pid = await ensureProjectId(scope);
      let row = cachedPlanManifestProjectId === pid && cachedPlanManifest
        ? findManifestRow(cachedPlanManifest, name)
        : undefined;
      if (!row) {
        const rows = await ensurePlanManifest(pid);
        row = findManifestRow(rows, name);
      }

      // Try local first, but verify size matches manifest to detect wrongly cached bytes
      try {
        const localBytes = await local.loadPdfData(name);
        const expectedSize = row?.byte_size ? Number(row.byte_size) : 0;
        if (expectedSize > 0 && Math.abs(localBytes.byteLength - expectedSize) > 1024) {
          // Local cache has wrong file — remove and re-download
          console.warn("[ADICC] Local cache size mismatch for", name, "local:", localBytes.byteLength, "expected:", expectedSize);
          await local.removePdf(name).catch(() => {});
        } else {
          return localBytes;
        }
      } catch {
        // Not in local cache — will download below
      }

      const bytes = await downloadProjectFile(
        pid,
        name,
        row?.storage_path,
        row?.folder_path,
      );
      const mime = row?.content_type || "application/pdf";
      await local.addPdf(new File([bytes], sheetBaseName(name), { type: mime }), { key: name });
      return bytes;
    },

    /** @returns {Promise<{ name: string }>} name is the folder-relative sheet id */
    async addPdf(file, opts = {}) {
      const folderPath = opts.folderPath || "";
      const sheetName = isSupabaseConfigured() ? sheetRelPath(file.name, folderPath) : file.name;
      const res = await local.addPdf(file, { key: sheetName });
      if (!isSupabaseConfigured() || opts.skipRemote) return res;
      const projectId = await ensureProjectId(scope);
      const bytes = await file.arrayBuffer();
      await upsertProjectFile(projectId, file.name, bytes, {
        folderPath,
        mimeType: file.type || "application/pdf",
      });
      invalidatePlanManifestCache();
      return res;
    },

    /** Save many plans to Storage + project_files after a folder ingest (batched). */
    async persistPlansBatch(files, folderFor, onProgress) {
      if (!isSupabaseConfigured() || !files?.length) return;
      const projectId = await ensureProjectId(scope);
      await uploadProjectFilesBatch(projectId, files, { folderFor, onProgress });
      invalidatePlanManifestCache();
    },

    async removePdf(name) {
      await local.removePdf(name);
      if (!isSupabaseConfigured()) return;
      try {
        await deleteProjectFile(await ensureProjectId(scope), name);
        invalidatePlanManifestCache();
      } catch (e) {
        console.warn("[ADICC] deleteProjectFile", e);
      }
    },

    async loadAnnotations() {
      if (!isSupabaseConfigured()) return local.loadAnnotations();

      const projectId = await ensureProjectId(scope);
      const cached = await local.loadAnnotations().catch(() => null);

      let remote;
      try {
        remote = await loadProjectFromSupabase(projectId);
      } catch (e) {
        console.error("[ADICC Supabase load]", e);
        if (remoteHasData(cached)) return cached;
        throw e;
      }

      let payload = remote?.payload;
      if (!payload || !payload.shapes?.length) {
        if (cached && Array.isArray(cached.shapes) && cached.shapes.length > 0) {
          payload = { ...emptyAnnotations(), ...cached, schema: ANN_SCHEMA };
          // Immediately save existing floor masks to Supabase so they are never lost!
          await syncProjectToSupabase(projectId, payload).catch((e) => console.warn("[ADICC initial sync]", e));
        } else {
          payload = payload || { ...emptyAnnotations() };
        }
      } else if (cached?.shapes?.length) {
        const remoteShapeIds = new Set((payload.shapes || []).map((s) => s.id));
        const extraLocalShapes = (cached.shapes || []).filter((s) => !remoteShapeIds.has(s.id));
        if (extraLocalShapes.length > 0) {
          payload = {
            ...payload,
            shapes: [...payload.shapes, ...extraLocalShapes],
          };
          await syncProjectToSupabase(projectId, payload).catch((e) => console.warn("[ADICC merge sync]", e));
        }
      }

      try {
        const projectIdForPlans = projectId;
        invalidatePlanManifestCache();
        const rows = await ensurePlanManifest(projectIdForPlans);
        cachedPlanManifest = rows;
        cachedPlanManifestProjectId = projectIdForPlans;
        const fileFolders = fileFoldersFromProjectFiles(rows);
        if (fileFolders && Object.keys(fileFolders).length) {
          payload = {
            ...payload,
            file_folders: { ...fileFolders, ...(payload.file_folders || {}) },
          };
          payload.shapes = normalizeAiFloorShapeSheetIds(payload.shapes, payload.file_folders);
        }
        notifyPlanManifestReady();
        const priority = (Array.isArray(payload.sheet_tabs) ? payload.sheet_tabs : [])
          .map((key) => parseSheetKey(key).file);
        void planManifestReconciled(rows)
          .then((full) => hydrateLocalPlansFromDb(projectIdForPlans, local, { rows: full, priority }))
          .then((result) => {
            cachedPlanManifest = result.rows;
            cachedPlanManifestProjectId = projectIdForPlans;
            notifyPlanManifestReady();
          })
          .catch((e) => {
            console.warn("[ADICC] background plan hydrate", e);
          });
      } catch (e) {
        console.warn("[ADICC] hydrate plans from DB", e);
      }

      lastRemoteUpdatedAt = remote?.updated_at || new Date().toISOString();
      seedShapeSnapshot(projectId, payload.shapes || []);
      await local.saveAnnotations(payload);
      const name = payload.project_name || "ADICC Project";
      createSupabaseRecents(browserStorage()).remember({ id: projectId, name });
      touchProjectOpened(projectId).catch(() => {});
      return payload;
    },

    async saveAnnotations(payload) {
      if (!isSupabaseConfigured()) return local.saveAnnotations({ ...payload, schema: ANN_SCHEMA });

      const wrapped = { ...payload, schema: ANN_SCHEMA };
      const projectId = await ensureProjectId(scope);
      const shapes = normalizeAiFloorShapeSheetIds(wrapped.shapes || [], wrapped.file_folders || {});
      const toSave = shapes === (wrapped.shapes || []) ? wrapped : { ...wrapped, shapes };
      await syncProjectToSupabase(projectId, toSave);
      lastRemoteUpdatedAt = new Date().toISOString();
      await local.saveAnnotations(toSave);
      createSupabaseRecents(browserStorage()).remember({
        id: projectId,
        name: wrapped.project_name || "ADICC Project",
      });
    },

    /** Wipe remote + local project takeoff data; templates/libraries unchanged. */
    async resetProjectData() {
      const projectId = await ensureProjectId(scope);
      await clearProjectDataInSupabase(projectId);
      await local.clearProjectWorkspace();
      const empty = emptyAnnotations();
      await local.saveAnnotations(empty);
      lastRemoteUpdatedAt = new Date().toISOString();
      return empty;
    },

    /** Create a new empty Supabase project and navigate to it. */
    async createNewProject(name = "Untitled project") {
      const id = await createSupabaseProject(name);
      setSupabaseProjectId(id);
      createSupabaseRecents(browserStorage()).remember({ id, name });
      await touchProjectOpened(id);
      openSupabaseProject(id);
    },

    getSupabaseProjectId: () => getSupabaseProjectId(),
    getLastRemoteSync: () => lastRemoteUpdatedAt,
  };
}

export { isSupabaseConfigured };
