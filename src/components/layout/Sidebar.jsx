import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ items = [], title }) => {
  const [collapsed, setCollapsed] = useState(true);

  if (!items || items.length === 0) return null;

  const isHighDensity = items.length >= 8;

  return (
    <motion.div
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      initial={false}
      animate={{ width: collapsed ? 56 : 210 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      style={{
        alignSelf: 'center',
        maxHeight: 'calc(100% - 32px)',
        background: 'var(--gradient-brand)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 40,
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        boxShadow: '0 8px 32px rgba(0, 71, 83, 0.25), 0 4px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Top Header Section with smooth dynamic height & padding transitions */}
      <motion.div
        initial={false}
        animate={{
          height: collapsed ? (isHighDensity ? 10 : 14) : (isHighDensity ? 42 : 48),
          paddingLeft: collapsed ? 8 : 14,
          paddingRight: collapsed ? 8 : 16,
          paddingTop: collapsed ? 8 : (isHighDensity ? 12 : 14),
          paddingBottom: collapsed ? 2 : 6,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <AnimatePresence>
          {!collapsed && title && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              style={{
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: isHighDensity ? 14.5 : 15.5,
                letterSpacing: '-0.015em',
                paddingRight: 14
              }}
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Child Sidebar Navigation Items */}
      <div style={{ 
        padding: isHighDensity ? '2px 8px 10px 8px' : '4px 10px 12px 10px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isHighDensity ? 3 : 4, 
        overflowY: 'auto' 
      }}>
        {items.map((item, idx) => {
          return (
            <NavLink
              key={idx}
              to={item.path || '#'}
              end
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: collapsed 
                  ? (isHighDensity ? '5px 6px' : '6px 8px') 
                  : (isHighDensity ? '4.5px 10px' : '6px 10px'),
                borderRadius: 10,
                color: isActive ? '#004753' : 'rgba(255, 255, 255, 0.85)',
                background: isActive ? '#FFFFFF' : 'transparent',
                border: 'none',
                boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.18)' : 'none',
                textDecoration: 'none',
                gap: 8,
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.18s ease',
                fontWeight: isActive ? 800 : 600,
                fontSize: isHighDensity ? 12 : 12.5
              })}
            >
              <span style={{ 
                flexShrink: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transform: isHighDensity ? 'scale(0.9)' : 'scale(0.95)'
              }}>
                {item.icon}
              </span>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6, transition: { duration: 0.1 } }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    style={{ whiteSpace: 'nowrap', paddingRight: 8 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>
    </motion.div>
  );
};
