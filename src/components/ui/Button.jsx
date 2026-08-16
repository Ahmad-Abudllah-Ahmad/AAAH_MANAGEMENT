import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  onClick, 
  disabled, 
  type = 'button' 
}) => {
  const baseClass = 'btn-base';
  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-icon';
  const combinedClass = `${baseClass} ${variantClass} ${className}`;

  return (
    <motion.button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      whileHover={variant !== 'icon' ? { scale: 1.03 } : undefined}
      whileTap={{ scale: 0.97 }}
      style={{ 
        opacity: disabled ? 0.6 : 1, 
        pointerEvents: disabled ? 'none' : 'auto',
        ...(variant === 'primary' ? {
          background: 'var(--gradient-brand)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)'
        } : {})
      }}
    >
      {icon && <span style={{ marginRight: children ? 8 : 0, display: 'flex' }}>{icon}</span>}
      {children}
    </motion.button>
  );
};
