import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({ type = 'info', message, action }) => {
  const styles = {
    info: { bg: 'var(--color-info-50)', color: 'var(--color-info-600)', icon: <Info size={16} /> },
    warning: { bg: 'var(--color-warning-50)', color: 'var(--color-warning-600)', icon: <AlertTriangle size={16} /> },
    danger: { bg: 'var(--color-danger-50)', color: 'var(--color-danger-600)', icon: <AlertCircle size={16} /> },
  };

  const style = styles[type] || styles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: style.bg,
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${style.bg}`, // or slightly darker if needed
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: style.color }}>{style.icon}</div>
        <span className="text-body-m" style={{ color: 'var(--color-gray-900)' }}>{message}</span>
      </div>
      {action && (
        <div style={{ marginLeft: 16 }}>
          {action}
        </div>
      )}
    </motion.div>
  );
};
