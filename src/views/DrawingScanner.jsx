import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TakeoffCanvas from '../opentakeoff/pages/TakeoffCanvas.jsx';
import SupabaseHome from '../opentakeoff/components/SupabaseHome.jsx';
import { isSupabaseConfigured, getSupabaseProjectId } from '../opentakeoff/lib/supabase/client.js';
import { setActiveStore } from '../opentakeoff/lib/store.js';
import '../opentakeoff/styles/tokens.css';
import '../opentakeoff/styles/app.css';

export const DrawingScanner = () => {
  const [searchParams] = useSearchParams();
  // Only URL params decide routing — localStorage is for store internals only
  const urlProjectId = searchParams.get('db') || searchParams.get('project') || '';
  const dbParam = urlProjectId || getSupabaseProjectId() || '';
  const [ready, setReady] = useState(false);

  const showHome = isSupabaseConfigured() && !urlProjectId;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    if (showHome) {
      setReady(false);
      return;
    }
    let live = true;
    setReady(false);
    (async () => {
      try {
        const { createSupabaseStore } = await import('../opentakeoff/lib/supabaseStore.js');
        if (!live) return;
        const store = createSupabaseStore(dbParam || null);
        if (typeof store.prefetchPlanManifest === 'function') {
          await store.prefetchPlanManifest().catch(() => {});
        }
        if (!live) return;
        setActiveStore(store);
        setReady(true);
      } catch (err) {
        console.error('[DrawingScanner DB init]', err);
        if (live) setReady(true);
      }
    })();
    return () => {
      live = false;
      setActiveStore();
    };
  }, [dbParam, showHome]);

  // When Supabase is configured but no project is selected via URL, show the project listing page
  if (showHome) {
    return <SupabaseHome />;
  }

  return (
    <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--paper-cream)' }}>
      {ready ? (
        <TakeoffCanvas key={dbParam || 'local'} />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)', fontSize: 13 }}>
          Opening project…
        </div>
      )}
    </div>
  );
};

export default DrawingScanner;
