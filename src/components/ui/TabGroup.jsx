import React from 'react';
import { motion } from 'framer-motion';

export const TabGroup = ({ tabs, activeTab, onChange }) => {
  return (
    <div style={{ display: 'flex', position: 'relative', borderBottom: '1px solid var(--color-gray-200)', gap: 16 }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-brand-700)' : 'var(--color-gray-500)',
              position: 'relative',
              transition: 'color 0.2s ease',
              outline: 'none'
            }}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                style={{
                  position: 'absolute',
                  bottom: -1, // cover the border bottom
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'var(--color-brand-600)',
                  borderRadius: '3px 3px 0 0'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
