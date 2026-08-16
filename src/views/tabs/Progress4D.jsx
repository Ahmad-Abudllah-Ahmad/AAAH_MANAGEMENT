import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, FastForward, Rewind, Clock, 
  Eye, CheckCircle2, Box
} from 'lucide-react';

// BIM Model Elements Definition
const bimModelCatalog = [
  {
    id: 'IFC4-SLAB-L03-EAST',
    name: 'Level 03 East Deck PT Slab',
    level: 'Level 03 (+12.40m)',
    trade: 'Concrete & Post-Tensioning',
    status: 'in-progress',
    vol: '480 / 740 m³ (64.8%)',
    mix: 'C50/60 Microsilica Self-Compacting',
    qcStatus: 'Rebar Pre-Pour APPROVED • Slump: 140mm',
    contractor: 'Arabtec Concreting',
    sensorTemp: '31.2°C (Maturity 78%)',
    cameraRef: 'CAM-07 (Level 3 Deck)'
  },
  {
    id: 'IFC4-CORE-L09-L14',
    name: 'Central Shear Core Climbing Walls',
    level: 'Core L09–L14 (+45.50m)',
    trade: 'Hydraulic Climbing Formwork',
    status: 'in-progress',
    vol: '820 / 1,000 m³ (82.0%)',
    mix: 'C60/75 High-Strength Microsilica',
    qcStatus: 'Doka Rig Hydraulic Jump #11 PASSED',
    contractor: 'Doka Systems / Arabtec',
    sensorTemp: '29.8°C (Maturity 92%)',
    cameraRef: 'CAM-11 (Tower Crane 1)'
  },
  {
    id: 'IFC4-FOUND-RAFT-01',
    name: 'Foundation Raft & 128 Friction Piles',
    level: 'Substructure B3 (-14.20m)',
    trade: 'Mass Concrete Foundation',
    status: 'complete',
    vol: '4,200 / 4,200 m³ (100%)',
    mix: 'C40/50 Low-Heat Sulfate Resistant',
    qcStatus: 'Core Drill 28-Day Strength: 54.2 MPa',
    contractor: 'Solid Foundations Earthworks',
    sensorTemp: '26.4°C (Stabilized)',
    cameraRef: 'CAM-09 (Excavation Pit)'
  },
  {
    id: 'IFC4-PODIUM-STEEL-P1-3',
    name: 'Multi-Storey Parking Podium Frame',
    level: 'Podium Levels 1–3 (+3.5m to +11.0m)',
    trade: 'Structural Steel Erection',
    status: 'in-progress',
    vol: '120 / 640 MT Erected (18.7%)',
    mix: 'Grade S355 Structural Steel Sections',
    qcStatus: 'UT Weld Testing: 98.2% Compliance',
    contractor: 'Apex Structural Steel Corp',
    sensorTemp: 'Ambient 32°C',
    cameraRef: 'CAM-04 (Logistics Yard)'
  },
  {
    id: 'IFC4-FACADE-L01-L04',
    name: 'Curtain Wall Unitized Glazing',
    level: 'Envelope L01–L04 (+3.5m to +15.5m)',
    trade: 'Facade Engineering',
    status: 'in-progress',
    vol: '48 / 400 Panels Installed (12.0%)',
    mix: 'Double-Glazed Low-E Acoustic Glass',
    qcStatus: 'Water Penetration Field Test PASSED',
    contractor: 'Alumco Facades',
    sensorTemp: 'U-Value 1.4 W/m²K',
    cameraRef: 'CAM-02 (Gate 1 Security)'
  }
];

export const Progress4D = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(21); // Week 21 = Current W21
  const [selectedElement, setSelectedElement] = useState(bimModelCatalog[0]);
  const [viewMode, setViewMode] = useState('3d-iso'); // '3d-iso' | 'plan-deck'
  const [activeLayers, setActiveLayers] = useState({
    structure: true,
    crane: true,
    facade: true,
    core: true
  });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Playback timer for 4D simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentWeek(prev => (prev < 52 ? prev + 1 : 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 20, right: 24, zIndex: 999,
              background: '#0F172A', color: 'white', padding: '12px 20px',
              borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div style={{ background: 'white', padding: '14px 20px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Box size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                4D BIM Construction Digital Twin
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                FEDERATED IFC4 • W{currentWeek} TIMELAPSE
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12, margin: '2px 0 0 0' }}>
              Al Barsha Commercial Tower (3B+G+24F) • Synchronized with Primavera P6 Rev 03
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 8, gap: 2 }}>
            <button
              onClick={() => setViewMode('3d-iso')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                fontSize: 11.5,
                fontWeight: 700,
                background: viewMode === '3d-iso' ? 'white' : 'transparent',
                color: viewMode === '3d-iso' ? '#4F46E5' : '#64748B',
                boxShadow: viewMode === '3d-iso' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              3D Isometric Elevation
            </button>
            <button
              onClick={() => setViewMode('plan-deck')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                fontSize: 11.5,
                fontWeight: 700,
                background: viewMode === 'plan-deck' ? 'white' : 'transparent',
                color: viewMode === 'plan-deck' ? '#4F46E5' : '#64748B',
                boxShadow: viewMode === 'plan-deck' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              Level 03 Pour Plan
            </button>
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { key: 'structure', label: 'Structure' },
              { key: 'core', label: 'Core' },
              { key: 'facade', label: 'Façade' },
              { key: 'crane', label: 'Crane' },
            ].map(l => (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: activeLayers[l.key] ? '#C7D2FE' : '#E2E8F0',
                  background: activeLayers[l.key] ? '#EEF2FF' : 'white',
                  color: activeLayers[l.key] ? '#4F46E5' : '#94A3B8',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Inspector Container */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', overflow: 'hidden', minHeight: 460, flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Dark Architectural BIM Canvas */}
        <div style={{ flex: 1, background: '#0B1120', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Top Canvas HUD overlay */}
          <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: 6, color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} color="#38BDF8" />
              <span>Week {currentWeek} of 52 (May 2026)</span>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: 6, color: '#10B981', fontSize: 11, fontWeight: 800 }}>
              {currentWeek < 12 ? 'STAGE: FOUNDATION & SUBSTRUCTURE' : currentWeek < 25 ? 'STAGE: SUPERSTRUCTURE L01–L04' : currentWeek < 40 ? 'STAGE: UPPER CORE & ENVELOPE' : 'STAGE: FITOUT & HANDOVER'}
            </div>
          </div>

          {/* SVG 3D Isometric Projection */}
          {viewMode === '3d-iso' ? (
            <svg viewBox="0 0 540 350" style={{ width: '100%', height: '100%', maxHeight: 440 }}>
              <defs>
                <pattern id="isoGrid4d" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8"/>
                </pattern>
                <pattern id="activePourHatch4d" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="2.5" />
                </pattern>
                <linearGradient id="glassGrad4d" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                  <stop offset="50%" stopColor="rgba(34, 211, 238, 0.7)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
                </linearGradient>
              </defs>

              <rect width="540" height="350" fill="url(#isoGrid4d)" />

              {/* Ground Datum Line */}
              <line x1="60" y1="260" x2="490" y2="260" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" opacity="0.4" />

              {/* 1. FOUNDATION RAFT & PILES (Complete) */}
              <g 
                onClick={() => setSelectedElement(bimModelCatalog[2])}
                style={{ cursor: 'pointer' }}
              >
                <polygon points="120,260 380,260 405,290 145,290" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="1.5" />
                <polygon points="120,260 145,290 145,315 120,285" fill="rgba(5, 150, 105, 0.35)" stroke="#10B981" strokeWidth="1.2" />
                <polygon points="145,290 405,290 405,315 145,315" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.2" />
                <text x="275" y="306" fill="#A7F3D0" fontSize="9" fontWeight="800" textAnchor="middle">FOUNDATION RAFT & PILES (100% COMPLETE)</text>
              </g>

              {/* 2. PARKING PODIUM (Steel Frame) */}
              {activeLayers.structure && (
                <g 
                  onClick={() => setSelectedElement(bimModelCatalog[3])}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon points="65,195 165,195 180,220 80,220" fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2" />
                  <polygon points="80,220 180,220 180,260 80,260" fill="rgba(217, 119, 6, 0.15)" stroke="#F59E0B" strokeWidth="1" />
                  <line x1="85" y1="220" x2="85" y2="260" stroke="#F59E0B" strokeWidth="1.5" />
                  <line x1="130" y1="220" x2="130" y2="260" stroke="#F59E0B" strokeWidth="1.5" />
                  <line x1="175" y1="220" x2="175" y2="260" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="130" y="240" fill="#FDE68A" fontSize="8" fontWeight="800" textAnchor="middle">PODIUM P1–P3</text>
                  <text x="130" y="252" fill="#FCD34D" fontSize="7.5" fontWeight="700" textAnchor="middle">18% (120 MT)</text>
                </g>
              )}

              {/* 3. LEVEL 01 & LEVEL 02 DECKS */}
              {activeLayers.structure && (
                <g style={{ cursor: 'pointer' }}>
                  <polygon points="180,230 370,230 395,250 205,250" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.5" />
                  <polygon points="205,250 395,250 395,258 205,258" fill="rgba(5, 150, 105, 0.4)" stroke="#10B981" strokeWidth="1" />
                  <polygon points="180,200 370,200 395,220 205,220" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.5" />
                  <polygon points="205,220 395,220 395,228 205,228" fill="rgba(5, 150, 105, 0.4)" stroke="#10B981" strokeWidth="1" />
                  {[205, 250, 295, 345, 390].map((cx, i) => (
                    <line key={i} x1={cx} y1="228" x2={cx} y2="250" stroke="#10B981" strokeWidth="2" />
                  ))}
                  <text x="290" y="214" fill="#A7F3D0" fontSize="8" fontWeight="800" textAnchor="middle">LEVEL 01 & 02 SLABS (100% COMPLETE)</text>
                </g>
              )}

              {/* 4. LEVEL 03 ACTIVE POUR SLAB (AMBER) */}
              {activeLayers.structure && (
                <g 
                  onClick={() => setSelectedElement(bimModelCatalog[0])}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon points="180,165 370,165 395,188 205,188" fill="rgba(245, 158, 11, 0.4)" stroke="#F59E0B" strokeWidth="2.5" />
                  <polygon points="180,165 370,165 395,188 205,188" fill="url(#activePourHatch4d)" />
                  <polygon points="205,188 395,188 395,198 205,198" fill="rgba(217, 119, 6, 0.7)" stroke="#F59E0B" strokeWidth="1.5" />
                  
                  {/* Concrete Pump Line */}
                  <line x1="180" y1="260" x2="265" y2="175" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="265" cy="175" r="4" fill="#EF4444" className="animate-ping" />
                  <circle cx="265" cy="175" r="3" fill="#EF4444" />
                  <text x="300" y="180" fill="#FEF08A" fontSize="8.5" fontWeight="900" textAnchor="middle">
                    ⚡ LEVEL 03 EAST SLAB (65% ACTIVE)
                  </text>
                </g>
              )}

              {/* 5. CORE WALL & DOKA CLIMBING RIG */}
              {activeLayers.core && (
                <g 
                  onClick={() => setSelectedElement(bimModelCatalog[1])}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon points="255,65 325,65 340,85 270,85" fill="rgba(0, 169, 197, 0.3)" stroke="#00A9C5" strokeWidth="1.5" />
                  <polygon points="255,65 270,85 270,165 255,165" fill="rgba(0, 71, 83, 0.4)" stroke="#00A9C5" strokeWidth="1.2" />
                  <polygon points="270,85 340,85 340,165 270,165" fill="rgba(0, 169, 197, 0.35)" stroke="#00A9C5" strokeWidth="1.2" />
                  
                  <rect x="250" y="55" width="95" height="12" rx="2" fill="#00556A" stroke="#00A9C5" strokeWidth="1.5" />
                  <text x="297" y="64" fill="white" fontSize="7.5" fontWeight="800" textAnchor="middle">DOKA CLIMBING RIG (JUMP #11)</text>
                  <text x="305" y="125" fill="#D9EEF1" fontSize="8" fontWeight="800" textAnchor="middle">CORE L9–14 (82%)</text>
                </g>
              )}

              {/* 6. TOWER CRANE 1 (RIGHT SIDE) */}
              {activeLayers.crane && (
                <g>
                  <line x1="435" y1="20" x2="435" y2="220" stroke="#F59E0B" strokeWidth="2.5" />
                  <line x1="430" y1="20" x2="440" y2="20" stroke="#F59E0B" strokeWidth="2" />
                  <line x1="435" y1="25" x2="520" y2="25" stroke="#F59E0B" strokeWidth="2" />
                  <line x1="435" y1="25" x2="390" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
                  <line x1="410" y1="25" x2="410" y2="135" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="410" cy="137" r="3.5" fill="#EF4444" />
                  <text x="460" y="42" fill="#FCA5A5" fontSize="7.5" fontWeight="800">POTAIN TC-1 (2.8T)</text>
                </g>
              )}

              {/* 7. CURTAIN WALL FACADE */}
              {activeLayers.facade && (
                <g 
                  onClick={() => setSelectedElement(bimModelCatalog[4])}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x="182" y="165" width="8" height="65" fill="url(#glassGrad4d)" stroke="#22D3EE" strokeWidth="1" />
                  <rect x="388" y="165" width="8" height="65" fill="url(#glassGrad4d)" stroke="#22D3EE" strokeWidth="1" />
                  <text x="450" y="195" fill="#38BDF8" fontSize="7.5" fontWeight="700">FACADE L1–L4 (12%)</text>
                </g>
              )}

              {/* Scheduled Upper Levels Wireframe */}
              <polygon points="180,35 370,35 395,60 205,60" fill="none" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <text x="285" y="42" fill="#94A3B8" fontSize="7.5" fontWeight="600" textAnchor="middle">UPPER DECKS L04–L24 (SCHEDULED JUN–NOV)</text>

              {/* Elevation Height Scale (Left) */}
              <g transform="translate(18, 30)">
                <line x1="0" y1="5" x2="0" y2="280" stroke="#64748B" strokeWidth="0.8" />
                <circle cx="0" cy="5" r="2" fill="#94A3B8" />
                <text x="6" y="8" fill="#94A3B8" fontSize="7" fontWeight="700">+92m ROOF</text>
                <circle cx="0" cy="65" r="2" fill="#00A9C5" />
                <text x="6" y="68" fill="#00A9C5" fontSize="7" fontWeight="700">+50m CORE</text>
                <circle cx="0" cy="135" r="2" fill="#F59E0B" />
                <text x="6" y="138" fill="#F59E0B" fontSize="7" fontWeight="700">+12m L3</text>
                <circle cx="0" cy="230" r="2" fill="#38BDF8" />
                <text x="6" y="233" fill="#38BDF8" fontSize="7" fontWeight="700">±0.0m GRD</text>
                <circle cx="0" cy="275" r="2" fill="#10B981" />
                <text x="6" y="278" fill="#10B981" fontSize="7" fontWeight="700">-14m RAFT</text>
              </g>
            </svg>
          ) : (
            /* 2D Plan Deck View */
            <svg viewBox="0 0 520 340" style={{ width: '100%', height: '100%' }}>
              <rect x="50" y="30" width="420" height="280" rx="8" fill="rgba(30, 41, 59, 0.6)" stroke="#475569" strokeWidth="1.5" />
              <rect x="60" y="40" width="190" height="125" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="2" />
              <text x="155" y="90" fill="#6EE7B7" fontSize="12" fontWeight="800" textAnchor="middle">BAY 3A (EAST DECK)</text>
              <text x="155" y="110" fill="#A7F3D0" fontSize="10" fontWeight="700" textAnchor="middle">✓ 100% Poured (240 m³)</text>

              <rect x="270" y="40" width="190" height="125" rx="6" fill="rgba(245, 158, 11, 0.3)" stroke="#F59E0B" strokeWidth="2.5" />
              <text x="365" y="85" fill="#FCD34D" fontSize="12" fontWeight="800" textAnchor="middle">⚡ BAY 3B (CORE PERIMETER)</text>
              <text x="365" y="105" fill="#FEF08A" fontSize="10.5" fontWeight="800" textAnchor="middle">65% Active Pour (156 / 240 m³)</text>

              <rect x="60" y="175" width="190" height="125" rx="6" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="1.8" />
              <text x="155" y="225" fill="#67E8F9" fontSize="12" fontWeight="800" textAnchor="middle">BAY 3C (WEST DECK)</text>
              <text x="155" y="245" fill="#A5F3FC" fontSize="10" fontWeight="700" textAnchor="middle">30% Rebar & PT Tendons</text>

              <rect x="270" y="175" width="190" height="125" rx="6" fill="rgba(100, 116, 139, 0.15)" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="365" y="230" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">BAY 3D (BALCONIES)</text>
              <text x="365" y="250" fill="#CBD5E1" fontSize="10" textAnchor="middle">0% Formwork Table Forms</text>
            </svg>
          )}

        </div>

        {/* Right Docked IFC Element Inspector */}
        <div style={{ width: 260, minWidth: 260, background: 'rgba(15, 23, 42, 0.98)', borderLeft: '1px solid #1E293B', padding: '14px 16px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>IFC Element Specs</span>
              <span style={{ fontSize: 9, color: selectedElement.status === 'complete' ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                {selectedElement.status.toUpperCase()}
              </span>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
                {selectedElement.name}
              </div>
              <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 600, marginTop: 2 }}>
                {selectedElement.level}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ background: '#1E293B', padding: '6px 8px', borderRadius: 6 }}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>VOLUME & PROGRESS</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: selectedElement.status === 'complete' ? '#10B981' : '#F59E0B' }}>
                  {selectedElement.vol}
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: '6px 8px', borderRadius: 6 }}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>CONCRETE SPECIFICATION</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#E2E8F0' }}>
                  {selectedElement.mix}
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: '6px 8px', borderRadius: 6 }}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>THERMAL MATURITY SENSOR</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#38BDF8' }}>
                  {selectedElement.sensorTemp}
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: '6px 8px', borderRadius: 6 }}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>QC & COMPLIANCE</div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: '#A7F3D0' }}>
                  {selectedElement.qcStatus}
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: '6px 8px', borderRadius: 6 }}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>CONTRACTOR</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#E2E8F0' }}>
                  {selectedElement.contractor}
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E293B' }}>
            <button 
              onClick={() => showToast(`Opening live 4K feed for ${selectedElement.cameraRef}...`)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
            >
              <Eye size={13} /> View {selectedElement.cameraRef.split(' ')[0]} Stream
            </button>
          </div>
        </div>

      </div>

      {/* 4D Simulation Playback & Timeline Scrubber */}
      <div style={{ background: 'white', padding: '14px 20px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Playback Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              onClick={() => setCurrentWeek(1)}
              style={{ padding: 7, borderRadius: 6, background: '#F1F5F9', border: 'none', color: '#475569', cursor: 'pointer' }}
            >
              <Rewind size={15} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '7px 18px', borderRadius: 8, background: 'var(--gradient-brand)', border: 'none',
                color: 'white', fontWeight: 800, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)'
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isPlaying ? 'Pause 4D' : 'Play 4D Simulation'}</span>
            </button>
            <button 
              onClick={() => setCurrentWeek(52)}
              style={{ padding: 7, borderRadius: 6, background: '#F1F5F9', border: 'none', color: '#475569', cursor: 'pointer' }}
            >
              <FastForward size={15} />
            </button>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
            Current Simulation: <span style={{ color: '#004753', fontWeight: 800 }}>Week {currentWeek} of 52</span> ({(currentWeek / 52 * 100).toFixed(0)}% Scheduled Progress)
          </div>
        </div>

        {/* Scrubber slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B' }}>W01 (Excavation)</span>
          <input 
            type="range"
            min="1"
            max="52"
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: '#00A9C5', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B' }}>W52 (Handover)</span>
        </div>

      </div>

    </div>
  );
};
