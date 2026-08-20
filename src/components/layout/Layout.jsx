import React from 'react';
import { Rail } from './Rail';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const Layout = ({ children, sidebarItems, sidebarTitle, topbarContent }) => {
  const location = useLocation();

  const isFullBleed = location.pathname.includes('/drawing-scanner/detect') || location.pathname.includes('/drawing-scanner/ai-detect');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar>
        {topbarContent}
      </Topbar>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Rail />
        
        {sidebarItems && sidebarItems.length > 0 && (
          <Sidebar items={sidebarItems} title={sidebarTitle} />
        )}
        
        <main style={{ flex: 1, minWidth: 0, overflow: isFullBleed ? 'hidden' : 'auto', padding: isFullBleed ? 0 : '0 24px 24px 24px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
