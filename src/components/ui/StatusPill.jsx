import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StatusPill = ({ status, label, pulseOnChange = false }) => {
  // status: 'success', 'warning', 'danger', 'info'
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (pulseOnChange) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(timer);
    }
  }, [status, label, pulseOnChange]);

  return (
    <motion.div
      className={`status-pill status-${status}`}
      animate={pulse ? { scale: [1, 1.12, 1], boxShadow: 'var(--shadow-glow)' } : { scale: 1, boxShadow: 'none' }}
      transition={{ duration: 0.4 }}
    >
      <span className="dot" />
      <span>{label}</span>
    </motion.div>
  );
};
