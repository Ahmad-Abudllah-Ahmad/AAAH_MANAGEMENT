import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ConfidenceBadge = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Determine color based on value
  const getColor = (val) => {
    if (val >= 97) return 'var(--color-success-600)';
    if (val >= 90) return 'var(--color-warning-600)';
    return 'var(--color-danger-600)';
  };
  
  const getBgColor = (val) => {
    if (val >= 97) return 'var(--color-success-50)';
    if (val >= 90) return 'var(--color-warning-50)';
    return 'var(--color-danger-50)';
  };

  const color = getColor(value);
  const bgColor = getBgColor(value);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 800; // ms
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutDecel equivalent
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 'var(--radius-pill)',
        background: bgColor,
        color: color,
        fontSize: 12,
        fontWeight: 600,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{displayValue}%</span>
        {label && <span style={{ fontWeight: 500, fontSize: 11 }}>· {label}</span>}
      </div>
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '2px',
          background: color,
          opacity: 0.4
        }}
      />
    </div>
  );
};
