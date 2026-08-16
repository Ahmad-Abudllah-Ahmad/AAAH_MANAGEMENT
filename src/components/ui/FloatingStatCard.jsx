import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const FloatingStatCard = ({ icon, value, label, trend, trendLabel, trendColor = 'success', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 900;
    const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''), 10) || 0;
    const format = value.toString().replace(/[0-9]/g, '#');

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * numericValue);
      
      let formatted = format;
      const currentValStr = currentVal.toString();
      let j = currentValStr.length - 1;
      
      let result = '';
      for (let i = formatted.length - 1; i >= 0; i--) {
        if (formatted[i] === '#' && j >= 0) {
          result = currentValStr[j] + result;
          j--;
        } else if (formatted[i] !== '#') {
          result = formatted[i] + result;
        }
      }
      // If original had more digits than current, result might be missing prefix numbers, simplified for demo
      setDisplayValue(currentVal);
      
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <motion.div
      className="surface-glass"
      style={{
        padding: 20,
        borderRadius: 'var(--radius-lg)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay }}
      whileHover={{ y: -4, scale: 1.015, boxShadow: 'var(--shadow-lg)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          background: 'var(--color-brand-100)', 
          color: 'var(--color-brand-600)', 
          padding: 8, 
          borderRadius: 8,
          display: 'flex'
        }}>
          {icon}
        </div>
        <span className="text-body-m" style={{ color: 'var(--color-gray-600)' }}>{label}</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="text-h1 tabular-nums">{value.toString().includes('%') ? `${displayValue}%` : displayValue}</span>
        {trend && (
          <span style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            color: `var(--color-${trendColor}-600)`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {trend} {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
};
