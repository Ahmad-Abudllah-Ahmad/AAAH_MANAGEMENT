import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TakeoffCanvas from '../opentakeoff/pages/TakeoffCanvas.jsx';
import SupabaseHome from '../opentakeoff/components/SupabaseHome.jsx';
import { isSupabaseConfigured } from '../opentakeoff/lib/supabase/client.js';
import { setActiveStore } from '../opentakeoff/lib/store.js';
import '../opentakeoff/styles/tokens.css';
import '../opentakeoff/styles/app.css';

const WORKSPACE_RESET_KEY = "adicc_workspace_reset_v1";

function SupabaseProjectCanvas({ projectId }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured() || !projectId) {
      setReady(true);
      return;
    }
    let live = true;
    setReady(false);
    setError("");
    (async () => {
      try {
        const { createSupabaseStore } = await import("../opentakeoff/lib/supabaseStore.js");
        if (!live) return;
        const next = createSupabaseStore(projectId);
        try {
          if (!localStorage.getItem(WORKSPACE_RESET_KEY)) {
            if (typeof next.clearProjectWorkspace === "function") {
              await next.clearProjectWorkspace();
            }
            localStorage.setItem(WORKSPACE_RESET_KEY, "1");
          }
        } catch (e) {
          console.error("[ADICC workspace reset]", e);
        }
        if (typeof next.prefetchPlanManifest === "function") {
          await next.prefetchPlanManifest();
        }
        setActiveStore(next);
        if (live) setReady(true);
      } catch (e) {
        if (live) setError(String(e?.message || e));
      }
    })();
    return () => { live = false; setActiveStore(); };
  }, [projectId]);

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 24, color: 'var(--ink)' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Database Connection Notice</h3>
        <p style={{ margin: 0, color: 'var(--ink-muted)', maxWidth: 460, textAlign: 'center' }}>{error}</p>
        <button
          type="button"
          onClick={() => { window.location.href = '/drawing-scanner/detect'; }}
          style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--cobalt)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Return to Projects
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)' }}>Loading project workspace...</p>
      </div>
    );
  }

  return <TakeoffCanvas key={projectId} />;
}

export const DrawingScanner = () => {
  const [searchParams] = useSearchParams();
  const dbParam = searchParams.get('db');
  const projectParam = searchParams.get('project');
  
  // Show TakeoffCanvas if a project DB/project param is present; otherwise start with Supabase Recent Projects
  const isCanvasView = Boolean(dbParam || projectParam);

  return (
    <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--paper-cream)' }}>
      {isCanvasView ? (
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SupabaseProjectCanvas projectId={dbParam || projectParam} />
        </div>
      ) : (
        <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
          <SupabaseHome />
        </div>
      )}
    </div>
  );
};

export default DrawingScanner;
