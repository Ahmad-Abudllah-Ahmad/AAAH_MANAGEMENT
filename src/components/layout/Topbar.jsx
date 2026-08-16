import React from 'react';
import { BellRing, HelpCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Topbar = ({ children }) => {
  return (
    <div style={{
      margin: '16px 24px',
      borderRadius: 9999,
      height: 64,
      display: 'flex',
      alignItems: 'stretch',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'var(--gradient-brand)',
      boxShadow: '0 8px 32px rgba(0, 71, 83, 0.25), 0 4px 8px rgba(0, 0, 0, 0.08)',
      position: 'relative',
      zIndex: 30,
      flexShrink: 0,
      overflow: 'hidden'
    }}>
      <div style={{ padding: '0 28px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/AAAH-Dual-Language-Logo-White.png"
          alt="AAAH Logo"
          style={{ height: 48, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, color: 'white' }}>
          {children}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
          <Search size={18} strokeWidth={2.2} />
        </button>
        <button style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', position: 'relative', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
          <BellRing size={18} strokeWidth={2.2} />
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-danger-600)',
            border: '2px solid white'
          }} />
        </button>
        <button style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
          <HelpCircle size={18} strokeWidth={2.2} />
        </button>
        
        <div style={{ width: 1, height: 24, background: 'rgba(255, 255, 255, 0.25)', margin: '0 8px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="text-body-s" style={{ fontWeight: 700, color: 'white' }}>Rashid Al Mansoori</span>
            <span className="text-caption" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Commercial / QS</span>
          </div>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14
          }}>
            RM
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
