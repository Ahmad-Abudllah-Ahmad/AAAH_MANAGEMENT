import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Box, AlertTriangle, ShieldCheck, Activity, Search, Filter, 
  Maximize2, FileText, Download, ArrowUpRight, CheckCircle2, User, ChevronRight, X
} from 'lucide-react';

const disciplines = ['Architectural', 'Structural', 'Mechanical', 'Electrical', 'Plumbing', 'Fire Life Safety'];

const clashMatrix = {
  'Architectural': { 'Architectural': 0, 'Structural': 45, 'Mechanical': 120, 'Electrical': 85, 'Plumbing': 60, 'Fire Life Safety': 20 },
  'Structural': { 'Architectural': 45, 'Structural': 0, 'Mechanical': 340, 'Electrical': 110, 'Plumbing': 180, 'Fire Life Safety': 95 },
  'Mechanical': { 'Architectural': 120, 'Structural': 340, 'Mechanical': 0, 'Electrical': 210, 'Plumbing': 450, 'Fire Life Safety': 180 },
  'Electrical': { 'Architectural': 85, 'Structural': 110, 'Mechanical': 210, 'Electrical': 0, 'Plumbing': 65, 'Fire Life Safety': 40 },
  'Plumbing': { 'Architectural': 60, 'Structural': 180, 'Mechanical': 450, 'Electrical': 65, 'Plumbing': 0, 'Fire Life Safety': 115 },
  'Fire Life Safety': { 'Architectural': 20, 'Structural': 95, 'Mechanical': 180, 'Electrical': 40, 'Plumbing': 115, 'Fire Life Safety': 0 },
};

const getIntensityBg = (val) => {
  if (val === 0) return '#F1F5F9';
  if (val > 300) return '#FEF2F2';
  if (val > 150) return '#FFFBEB';
  if (val > 50) return 'rgba(0, 71, 83, 0.08)';
  return 'rgba(0, 169, 197, 0.08)';
};

const getIntensityColor = (val) => {
  if (val === 0) return '#CBD5E1';
  if (val > 300) return '#DC2626';
  if (val > 150) return '#D97706';
  if (val > 50) return '#004753';
  return '#00A9C5';
};

export const ClashDisciplines = () => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Cross-Discipline Multi-Trade Clash Matrix
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Interactive heatmap identifying high-density physical and clearance clashes between engineering trade packages
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Exporting Cross-Discipline Clash Matrix to Excel...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export Heatmap Matrix
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 460 }}>
        
        {/* KPI Sidebar (300px) */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              Highest Clash Interaction
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={20} /> 450 Clashes
            </div>
            <div style={{ fontSize: 13.5, color: '#081E3C', marginTop: 4, fontWeight: 800 }}>Mechanical vs. Plumbing</div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>High interference at Level 03 & Basement risers</div>
          </div>
          
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              Critical Structural Clearance
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#D97706', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={20} /> 340 Clashes
            </div>
            <div style={{ fontSize: 13.5, color: '#081E3C', marginTop: 4, fontWeight: 800 }}>Mechanical vs. Structural</div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>Duct penetrations through transfer beams</div>
          </div>
          
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginTop: 'auto' }}>
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Heatmap Severity Guide
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, background: '#FEF2F2', border: '1.5px solid #DC2626', borderRadius: 4 }}></div>
                <div style={{ fontSize: 12, color: '#081E3C', fontWeight: 700 }}>Critical Density (300+ Clashes)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, background: '#FFFBEB', border: '1.5px solid #D97706', borderRadius: 4 }}></div>
                <div style={{ fontSize: 12, color: '#081E3C', fontWeight: 700 }}>High Density (100 - 300)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, background: 'rgba(0, 71, 83, 0.08)', border: '1.5px solid #004753', borderRadius: 4 }}></div>
                <div style={{ fontSize: 12, color: '#081E3C', fontWeight: 700 }}>Medium Density (50 - 100)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, background: 'rgba(0, 169, 197, 0.08)', border: '1.5px solid #00A9C5', borderRadius: 4 }}></div>
                <div style={{ fontSize: 12, color: '#081E3C', fontWeight: 700 }}>Low Density (1 - 50)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Matrix Area */}
        <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#081E3C' }}>
              Al Wasl Tower — Trade Clash Intersection Matrix
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Click any cell to filter 3D clash viewer</span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${disciplines.length}, 88px)`, gap: 6 }}>
              
              {/* Header Corner */}
              <div />
              {disciplines.map(d => (
                <div key={d} style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center', paddingBottom: 6 }}>
                  <span style={{ transform: 'rotate(-30deg)', transformOrigin: 'left bottom', display: 'inline-block', width: 90, textAlign: 'left' }}>{d}</span>
                </div>
              ))}

              {/* Matrix Rows */}
              {disciplines.map(row => (
                <React.Fragment key={row}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                    {row}
                  </div>
                  {disciplines.map(col => {
                    const val = clashMatrix[row][col];
                    const isHovered = hoveredCell === `${row}-${col}`;
                    const isDiagonal = row === col;

                    return (
                      <motion.div 
                        key={`${row}-${col}`}
                        onMouseEnter={() => setHoveredCell(`${row}-${col}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => !isDiagonal && setSelectedPair({ row, col, count: val })}
                        style={{ 
                          height: 52, 
                          background: isDiagonal ? '#F1F5F9' : getIntensityBg(val),
                          border: isDiagonal ? '1px dashed #E2E8F0' : `1.5px solid ${getIntensityColor(val)}`,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 900,
                          color: isDiagonal ? 'transparent' : getIntensityColor(val),
                          cursor: isDiagonal ? 'default' : 'pointer',
                          position: 'relative',
                          transition: 'all 0.15s'
                        }}
                        whileHover={!isDiagonal ? { scale: 1.06, zIndex: 10 } : {}}
                      >
                        {!isDiagonal ? val : '—'}
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              ))}

            </div>
          </div>
        </div>

      </div>

      {/* Trade Pair Details Modal */}
      <AnimatePresence>
        {selectedPair && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>Trade Intersection Details</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {selectedPair.row} × {selectedPair.col}
                  </h3>
                </div>
                <button onClick={() => setSelectedPair(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: '#081E3C' }}>
                <div><strong>Total Interferences:</strong> {selectedPair.count} clashes identified</div>
                <div><strong>Primary Root Cause:</strong> Ceiling void elevation deficit and duct penetration tolerances</div>
                <div><strong>Lead Resolution Subcontractor:</strong> Dutco MEP & KEO Structural</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setSelectedPair(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <a 
                  href="/clash-detection"
                  style={{ padding: '7px 18px', background: '#004753', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 800, fontSize: 12 }}
                >
                  View in 3D BIM Canvas
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
