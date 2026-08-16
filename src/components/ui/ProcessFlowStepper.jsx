import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

export const ProcessFlowStepper = ({ steps, currentStepIndex }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4, marginBottom: 24 }}>
      {steps.map((step, index) => {
        const isDone = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <React.Fragment key={index}>
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 13,
                fontWeight: 600,
                flex: 1,
                justifyContent: 'center',
                background: isDone ? 'var(--color-brand-100)' : isCurrent ? 'var(--color-base)' : 'transparent',
                color: isDone ? 'var(--color-brand-700)' : isCurrent ? 'var(--color-brand-600)' : 'var(--color-gray-400)',
                border: isCurrent ? '2px solid var(--color-brand-500)' : '2px solid transparent',
              }}
              animate={isCurrent ? { boxShadow: ['0 0 0 0 rgba(0,169,197,0)', '0 0 0 4px rgba(0,169,197,0.2)', '0 0 0 0 rgba(0,169,197,0)'] } : {}}
              transition={isCurrent ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
              {isDone && <Check size={14} strokeWidth={3} />}
              {step}
            </motion.div>
            {index < steps.length - 1 && (
              <ChevronRight size={16} color="var(--color-gray-300)" style={{ flexShrink: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
