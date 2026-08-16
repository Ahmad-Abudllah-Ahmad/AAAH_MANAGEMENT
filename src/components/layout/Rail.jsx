import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  ScanText, 
  FileSignature, 
  BrainCircuit, 
  DraftingCompass, 
  Boxes, 
  Cctv, 
  Activity, 
  Settings2 
} from 'lucide-react';

const RAIL_ITEMS = [
  { path: '/', icon: <Compass size={22} strokeWidth={2.2} />, label: 'Home' },
  { type: 'divider' },
  { path: '/document-processing', icon: <ScanText size={22} strokeWidth={2.2} />, label: 'Document OCR' },
  { path: '/document-drafting', icon: <FileSignature size={22} strokeWidth={2.2} />, label: 'Document Drafting' },
  { path: '/knowledge-assistant', icon: <BrainCircuit size={22} strokeWidth={2.2} />, label: 'Knowledge Assistant' },
  { type: 'divider' },
  { path: '/drawing-scanner', icon: <DraftingCompass size={22} strokeWidth={2.2} />, label: 'Drawing Scanner' },
  { path: '/clash-detection', icon: <Boxes size={22} strokeWidth={2.2} />, label: 'Clash Detection' },
  { type: 'divider' },
  { path: '/site-monitoring', icon: <Cctv size={22} strokeWidth={2.2} />, label: 'Site Monitoring' },
  { path: '/progress-monitoring', icon: <Activity size={22} strokeWidth={2.2} />, label: 'Progress Monitoring' },
];

export const Rail = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      initial={false}
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      style={{
        alignSelf: 'center',
        maxHeight: 'calc(100% - 32px)',
        background: 'var(--gradient-brand)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        flexShrink: 0,
        zIndex: 50,
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '0 8px 32px rgba(0, 71, 83, 0.25), 0 4px 8px rgba(0, 0, 0, 0.08)'
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        {RAIL_ITEMS.map((item, i) => {
          if (item.type === 'divider') {
            return <div key={i} style={{ width: expanded ? '100%' : 24, alignSelf: 'center', height: 1, background: 'rgba(255, 255, 255, 0.2)', margin: '4px 0', transition: 'width 0.25s ease' }} />;
          }

          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                width: '100%',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                color: isActive ? '#004753' : 'rgba(255, 255, 255, 0.85)',
                position: 'relative',
                textDecoration: 'none',
                borderRadius: 10,
                overflow: 'hidden',
                flexShrink: 0
              }}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  transition={{ type: 'spring', stiffness: 420, damping: 26, mass: 0.7 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#FFFFFF',
                    borderRadius: 10,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                    zIndex: 0
                  }}
                />
              )}
              <span style={{ width: 40, height: 40, minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ whiteSpace: 'nowrap', position: 'relative', zIndex: 1, fontWeight: 600, fontSize: 13, paddingRight: 14, overflow: 'hidden' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, width: '100%' }}>
        <NavLink 
          to="/settings"
          style={({ isActive }) => ({
            background: isActive ? '#FFFFFF' : 'transparent',
            border: 'none',
            color: isActive ? '#004753' : 'rgba(255, 255, 255, 0.85)',
            boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.18)' : 'none',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: 40,
            borderRadius: 10,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative'
          })}
          title="Global & Module Settings"
        >
          <span style={{ width: 40, height: 40, minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Settings2 size={22} strokeWidth={2.2} />
          </span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13, paddingRight: 14, overflow: 'hidden' }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </motion.div>
  );
};
