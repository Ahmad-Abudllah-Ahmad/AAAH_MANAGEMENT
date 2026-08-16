import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronDown, Download, Layers, Info, CheckCircle2, 
  Clock, DollarSign, Activity, Eye, Box
} from 'lucide-react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// High-resolution authentic CCTV / Site inspection photos for Delay Evidence
import cam09Img from '../assets/cameras/cam-09.jpg';
import cam04Img from '../assets/cameras/cam-04.jpg';
import cam07Img from '../assets/cameras/cam-07.jpg';
import cam11Img from '../assets/cameras/cam-11.jpg';

// Comprehensive, realistic WBS construction activities database
const wbsActivities = [
  { code: '1.1.0', name: 'Substructure & Deep Piling', trade: 'Geotechnical & Earthworks', contractor: 'Bauer Ground Eng.', progress: 100, slippage: '+2d', status: 'complete', critical: false, plannedEnd: 'Feb 14, 2026', actualEnd: 'Feb 12, 2026', qty: '128 Piles (100%)', id: 'sub' },
  { code: '1.2.1', name: 'Core Shear Wall Phase 1 (L1–L8)', trade: 'Concrete Formwork', contractor: 'Doka Formwork', progress: 100, slippage: '+0d', status: 'complete', critical: false, plannedEnd: 'Apr 02, 2026', actualEnd: 'Apr 02, 2026', qty: '3,200 m³ Poured', id: 'core-a' },
  { code: '1.2.2', name: 'Core Shear Wall Phase 2 (L9–L14)', trade: 'Automatic Climbing Formwork', contractor: 'Doka Formwork', progress: 82, slippage: '-2d', status: 'progress', critical: false, plannedEnd: 'Jun 10, 2026', actualEnd: 'Jun 12, 2026', qty: 'Jump #11 of 14', id: 'core-b' },
  { code: '1.3.1', name: 'Level 03 East PT Slab Pour', trade: 'Structural Concrete', contractor: 'Arabtec Concreting', progress: 65, slippage: '-5d', status: 'progress', critical: true, plannedEnd: 'May 16, 2026', actualEnd: 'May 21, 2026', qty: '480 m³ / 740 m³', id: 'slab-l3' },
  { code: '1.3.2', name: 'Level 02–03 MEP Conduit Rough-In', trade: 'MEP Services', contractor: 'Al Naboodah MEP', progress: 40, slippage: '-7d', status: 'progress', critical: true, plannedEnd: 'May 18, 2026', actualEnd: 'May 25, 2026', qty: '2,400m Conduit', id: 'mep-l3' },
  { code: '1.4.1', name: 'Unitized Curtain Wall Facade (L1–L4)', trade: 'Glazing & Envelopes', contractor: 'Alumco Architectural', progress: 12, slippage: '-13d', status: 'progress', critical: true, plannedEnd: 'Jun 05, 2026', actualEnd: 'Jun 18, 2026', qty: '48 / 380 Panels', id: 'facade' },
  { code: '1.5.1', name: 'Multi-Storey Parking Podium Structure', trade: 'Precast & Structural Steel', contractor: 'Apex Steel Corp', progress: 18, slippage: '-10d', status: 'progress', critical: false, plannedEnd: 'Jul 15, 2026', actualEnd: 'Jul 25, 2026', qty: '120 / 640 MT', id: 'parking' },
  { code: '1.6.0', name: 'Elevator Shaft Rails (Lifts 1–4)', trade: 'Vertical Transportation', contractor: 'Otis Worldwide', progress: 35, slippage: '-4d', status: 'progress', critical: false, plannedEnd: 'Aug 20, 2026', actualEnd: 'Aug 24, 2026', qty: '14 / 48 Brackets', id: 'lift' },
  { code: '1.7.0', name: 'Roof Plant Room & BMS Integration', trade: 'Central Plant MEP', contractor: 'Al Naboodah MEP', progress: 0, slippage: '-12d', status: 'not-started', critical: true, plannedEnd: 'Oct 30, 2026', actualEnd: 'Nov 12, 2026', qty: 'Not Commenced', id: 'roof' }
];

// S-Curve Earned Value Management Data
const sCurveData = [
  { month: 'Jan 26', planned: 3.5, actual: 3.5, forecast: 3.5, pv: 0.88, ev: 0.88, ac: 0.85 },
  { month: 'Feb 26', planned: 10.2, actual: 10.8, forecast: 10.8, pv: 2.55, ev: 2.70, ac: 2.60 },
  { month: 'Mar 26', planned: 22.0, actual: 21.4, forecast: 21.4, pv: 5.50, ev: 5.35, ac: 5.42 },
  { month: 'Apr 26', planned: 41.5, actual: 36.8, forecast: 36.8, pv: 10.38, ev: 9.20, ac: 9.65 },
  { month: 'May 26', planned: 68.4, actual: 59.1, forecast: 59.1, pv: 17.10, ev: 14.78, ac: 15.68 },
  { month: 'Jun 26', planned: 82.0, actual: null, forecast: 73.5, pv: 20.50, ev: null, ac: null },
  { month: 'Jul 26', planned: 91.5, actual: null, forecast: 85.0, pv: 22.88, ev: null, ac: null },
  { month: 'Aug 26', planned: 96.0, actual: null, forecast: 92.5, pv: 24.00, ev: null, ac: null },
  { month: 'Sep 26', planned: 98.8, actual: null, forecast: 96.8, pv: 24.70, ev: null, ac: null },
  { month: 'Oct 26', planned: 100.0, actual: null, forecast: 99.0, pv: 25.00, ev: null, ac: null },
  { month: 'Nov 26', planned: 100.0, actual: null, forecast: 100.0, pv: 25.00, ev: null, ac: null }
];

// Rich Structural BIM Elements
const bimStructureElements = [
  { 
    id: 'slab-l3', 
    guid: 'IFC4-SLAB-L03-EAST-PT',
    name: 'Level 03 East PT Slab (Active Pour)', 
    level: 'Level 03 Deck (+12.40m)', 
    status: 'progress', 
    progress: 65, 
    variance: '-5d Slippage', 
    vol: '480 / 740 m³ (64.8%)', 
    contractor: 'Arabtec Concreting LLC', 
    mix: 'C50/60 Microsilica Self-Compacting',
    postTensioning: '18 Tendons (12 Stressed, 6 Pending)',
    qcStatus: 'Rebar Pre-Pour: APPROVED • Slump: 140mm (PASS)',
    droneAudit: 'LiDAR Verified (±4mm Tolerance)',
    cameraRef: 'CAM-07 (Level 3 Deck)',
    color: '#F59E0B'
  },
  { 
    id: 'core-b', 
    guid: 'IFC4-CORE-WALL-L09-14',
    name: 'Shear Core Wall Climbing (L9–L14)', 
    level: 'Core Levels 9–14 (+32.0m to +50.0m)', 
    status: 'progress', 
    progress: 82, 
    variance: '-2d Slippage', 
    vol: 'Jump #11 of 14 Completed', 
    contractor: 'Doka Formwork Specialists', 
    mix: 'C70 High-Strength Concrete',
    postTensioning: 'Vertical Tie Rods 32mm High-Tensile',
    qcStatus: 'Hydraulic Jack Alignment: 0.02° (PASS)',
    droneAudit: 'Core Plumbness Certified',
    cameraRef: 'CAM-11 (Tower Crane 1)',
    color: '#00A9C5'
  },
  { 
    id: 'sub', 
    guid: 'IFC4-FOUNDATION-RAFT-B3',
    name: 'Deep Raft Foundation & 128 Piles', 
    level: 'Basement B3 Raft (-14.20m)', 
    status: 'complete', 
    progress: 100, 
    variance: '+2d Ahead', 
    vol: '6,400 m³ High-Density Sulfate-Resistant', 
    contractor: 'Bauer Ground Engineering', 
    mix: 'C50 SRC Waterproof Concrete',
    postTensioning: 'Heavy Welded Wire Mesh & Ground Anchors',
    qcStatus: 'Hydrostatic Pressure Test: PASSED',
    droneAudit: 'Substructure 3D Scan Signed Off',
    cameraRef: 'CAM-09 (Excavation Pit)',
    color: '#10B981'
  },
  { 
    id: 'slab-l1-l2', 
    guid: 'IFC4-SLAB-L01-L02-DECKS',
    name: 'Level 01 & Level 02 Post-Tensioned Slabs', 
    level: 'Levels 01–02 (+4.0m, +8.2m)', 
    status: 'complete', 
    progress: 100, 
    variance: '0d On Track', 
    vol: '1,480 m³ Poured & De-shored', 
    contractor: 'Arabtec Concreting LLC', 
    mix: 'C45 Ready-Mix Concrete',
    postTensioning: '100% Grouting Complete',
    qcStatus: '28-Day Cube Compressive Strength: 54.2 MPa',
    droneAudit: 'As-Built BIM Deviation: < 3mm',
    cameraRef: 'CAM-07 (Level 3 Deck)',
    color: '#10B981'
  },
  { 
    id: 'facade', 
    guid: 'IFC4-CURTAINWALL-UNITIZED-L01-04',
    name: 'Unitized Glass Curtain Wall Panels', 
    level: 'Podium & Levels 01–04 Perimeter', 
    status: 'progress', 
    progress: 12, 
    variance: '-13d Critical Delay', 
    vol: '48 / 380 Double-Glazed Panels', 
    contractor: 'Alumco Architectural Glazing', 
    mix: 'Low-E Double Laminated Acoustic Glass',
    postTensioning: 'Cast-in Anchor Channels (HALFEN)',
    qcStatus: 'Windload Mockup Test: PASSED',
    droneAudit: 'Bracket Thermal Scan: 100% Intact',
    cameraRef: 'CAM-04 (Logistics Yard)',
    color: '#06B6D4'
  },
  { 
    id: 'parking', 
    guid: 'IFC4-PODIUM-STEEL-STRUCTURE',
    name: 'Multi-Storey Parking Podium Steel Frame', 
    level: 'Podium Levels 1–3 (+3.5m to +11.0m)', 
    status: 'progress', 
    progress: 18, 
    variance: '-10d Slippage', 
    vol: '120 MT Erected / 640 MT Total', 
    contractor: 'Apex Structural Steel Corp', 
    mix: 'Grade S355 Structural Steel Sections',
    postTensioning: 'High-Strength Friction Grip Bolts',
    qcStatus: 'UT Weld Testing: 98.2% Compliance',
    droneAudit: 'Erection Alignment Verified',
    cameraRef: 'CAM-04 (Logistics Yard)',
    color: '#F59E0B'
  },
  { 
    id: 'upper-tower', 
    guid: 'IFC4-SUPERSTRUCTURE-L04-L24',
    name: 'Upper Superstructure Decks (L04–L24)', 
    level: 'Levels 04 to Roof Level (+16.5m to +92.0m)', 
    status: 'not-started', 
    progress: 0, 
    variance: '-12d Critical Path', 
    vol: 'Scheduled Post Level 3 Handover', 
    contractor: 'Arabtec / Apex Consortium', 
    mix: 'C50 High-Performance Mix',
    postTensioning: 'Scheduled Tendons',
    qcStatus: 'BIM Model Coordinated (Zero Clashes)',
    droneAudit: '4D Schedule Sequence Synced',
    cameraRef: 'CAM-11 (Tower Crane 1)',
    color: '#64748B'
  }
];



// Delay Evidence log
const delayEvidenceLog = [
  {
    id: 'EVD-01',
    date: 'Apr 28, 2026',
    time: '08:15 AM',
    title: 'Extreme Rainstorm & Pit Inundation',
    category: 'Weather Event (Force Majeure)',
    impactDays: '-3 Days',
    wbsRef: '1.1.0 Substructure Pits',
    image: cam09Img,
    cameraRef: 'CAM-09 (Excavation Pit)',
    desc: '94mm torrential rainfall in 6 hours caused deep foundation pit water ingress. Work halted for dewatering & safety recertification.',
    eotStatus: 'EOT Claim Notice #04 Submitted',
    costImpact: '$42,500'
  },
  {
    id: 'EVD-02',
    date: 'May 06, 2026',
    time: '09:30 AM',
    title: 'Rebar #16 Mill Supply Bottleneck',
    category: 'Material Logistics Delay',
    impactDays: '-5 Days',
    wbsRef: '1.3.1 Level 03 East PT Slab',
    image: cam04Img,
    cameraRef: 'CAM-04 (Stockyard Laydown)',
    desc: '42-ton shipment of #16 & #20 high-yield rebar delayed at customs. Pre-pour reinforcement inspection rescheduled by 5 days.',
    eotStatus: 'Supplier Penalty Notice Dispatched',
    costImpact: '$18,200'
  },
  {
    id: 'EVD-03',
    date: 'May 12, 2026',
    time: '10:20 AM',
    title: 'MEP Chilled Water Risers BIM Clash #482',
    category: 'Engineering / Design Clash',
    impactDays: '-7 Days',
    wbsRef: '1.3.2 MEP Rough-In Level 03',
    image: cam07Img,
    cameraRef: 'CAM-07 (Level 3 Deck)',
    desc: '300mm chilled water riser clashed with shear core transfer beam soffit. RFI #219 issued and re-routed through secondary sleeve.',
    eotStatus: 'RFI #219 Approved by Consultant',
    costImpact: '$31,000'
  },
  {
    id: 'EVD-04',
    date: 'May 18, 2026',
    time: '11:05 AM',
    title: 'Tower Crane 1 Hydraulic Clutch Outage',
    category: 'Plant & Heavy Equipment Failure',
    impactDays: '-4 Days',
    wbsRef: '1.4.1 Curtain Wall & Formwork',
    image: cam11Img,
    cameraRef: 'CAM-11 (Tower Crane 1 4K)',
    desc: 'Potain MDT-389 slewing gear hydraulic clutch overheating. Lifting operations paused 4 days until OEM factory replacement certified.',
    eotStatus: 'Third-Party Crane Recertified',
    costImpact: '$24,800'
  }
];

export const ProgressMonitoring = () => {
  const [hoveredWbs, setHoveredWbs] = useState(null);
  const [selectedBimElement, setSelectedBimElement] = useState(bimStructureElements[0]);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [metricUnit, setMetricUnit] = useState('percent');
  
  // 4D View Mode: '3d-iso' | 'l3-plan'
  const [bimViewMode, setBimViewMode] = useState('3d-iso');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportReport = () => {
    triggerToast('Generating Primavera P6 & BIM 4D Progress Earned Value Report (PDF/XER)...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            style={{ 
              position: 'fixed', 
              top: 80, 
              right: 24, 
              zIndex: 100, 
              background: 'white', 
              padding: '14px 20px', 
              borderRadius: 12, 
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)', 
              border: '1px solid #C7D2FE', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12 
            }}
          >
            <CheckCircle2 size={20} color="#4F46E5" />
            <span className="text-body-m" style={{ fontWeight: 600, color: '#0F172A' }}>
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div style={{ padding: '14px 20px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Layers size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="text-h2" style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                4D Project Progress & Earned Value Monitoring
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 700, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
                CRITICAL PATH VARIANCE: -27 DAYS
              </span>
            </div>
            <p className="text-body-s" style={{ color: '#64748B', marginTop: 2 }}>
              Plot 4 Al Barsha Tower (3B+G+24F) • WBS Progress vs Baseline Rev 03 • AI Aerial LiDAR Audit
            </p>
          </div>
        </div>

        {/* Project Selectors & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: 'white', color: '#334155', cursor: 'pointer' }}>
            <Calendar size={15} color="#64748B" />
            <span>Cutoff: May 20, 2026 (W21)</span>
            <ChevronDown size={13} color="#64748B" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: 'white', color: '#334155', cursor: 'pointer' }}>
            <span>Al Barsha Tower — Plot 4</span>
            <ChevronDown size={13} color="#64748B" />
          </div>

          <button 
            onClick={handleExportReport}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export P6 / PDF
          </button>
        </div>
      </div>

      {/* Top Section: 4D BIM Spatial Progress Visualizer (60%) & S-Curve EVM Chart (40%) */}
      <div style={{ display: 'flex', gap: 18, minHeight: 450 }}>
        
        {/* Card 1: 4D BIM Construction Digital Twin (60%) */}
        <div style={{ flex: '0 0 60%', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          
          {/* Header with Mode Toggles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  4D BIM Construction Spatial Twin
                </h3>
                <span style={{ fontSize: 10, background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                  IFC4 MODEL (W21 LIVE)
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#64748B' }}>Interactive 3D structural elements • Click any element for volume, mix, & inspection</span>
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 8, gap: 2 }}>
              <button
                onClick={() => setBimViewMode('3d-iso')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 700,
                  background: bimViewMode === '3d-iso' ? 'white' : 'transparent',
                  color: bimViewMode === '3d-iso' ? '#4F46E5' : '#64748B',
                  boxShadow: bimViewMode === '3d-iso' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Box size={13} /> 3D Elevation
              </button>

              <button
                onClick={() => setBimViewMode('l3-plan')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 700,
                  background: bimViewMode === 'l3-plan' ? 'white' : 'transparent',
                  color: bimViewMode === 'l3-plan' ? '#4F46E5' : '#64748B',
                  boxShadow: bimViewMode === 'l3-plan' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Layers size={13} /> Level 03 Pour Deck
              </button>
            </div>
          </div>

          {/* Realistic High-Rise 3D Architectural / Isometric Canvas */}
          <div style={{ flex: 1, minHeight: 380, background: '#0B1120', borderRadius: 12, position: 'relative', overflow: 'hidden', display: 'flex', border: '1px solid #1E293B' }}>
            
            {/* Viewport Canvas (SVG) */}
            <div style={{ flex: 1, position: 'relative', height: '100%', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {bimViewMode === '3d-iso' ? (
                /* MODE A: Real Isometric High-Rise Structural Model */
                <svg viewBox="0 0 540 350" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <pattern id="isoGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8"/>
                    </pattern>
                    <pattern id="activePourHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="2.5" />
                    </pattern>
                    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                      <stop offset="50%" stopColor="rgba(34, 211, 238, 0.7)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
                    </linearGradient>
                  </defs>

                  <rect width="540" height="350" fill="url(#isoGrid)" />

                  {/* Ground Datum Line & Axis */}
                  <line x1="60" y1="260" x2="490" y2="260" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" opacity="0.4" />

                  {/* 1. SUBSTRUCTURE & RAFT FOUNDATION (B3–B1) - COMPLETE */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[2])}
                    style={{ cursor: 'pointer' }}
                  >
                    <polygon points="120,260 380,260 405,290 145,290" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="1.5" />
                    <polygon points="120,260 145,290 145,315 120,285" fill="rgba(5, 150, 105, 0.35)" stroke="#10B981" strokeWidth="1.2" />
                    <polygon points="145,290 405,290 405,315 145,315" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.2" />
                    <text x="275" y="306" fill="#A7F3D0" fontSize="9" fontWeight="800" textAnchor="middle">FOUNDATION RAFT & PILES (100% COMPLETE)</text>
                  </g>

                  {/* 2. PARKING PODIUM (L1–L3 Steel & Precast) - IN PROGRESS */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[5])}
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

                  {/* 3. TOWER COMPLETED DECKS: LEVEL 01 & LEVEL 02 */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[3])}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Level 1 Slab */}
                    <polygon points="180,230 370,230 395,250 205,250" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.5" />
                    <polygon points="205,250 395,250 395,258 205,258" fill="rgba(5, 150, 105, 0.4)" stroke="#10B981" strokeWidth="1" />
                    {/* Level 2 Slab */}
                    <polygon points="180,200 370,200 395,220 205,220" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="1.5" />
                    <polygon points="205,220 395,220 395,228 205,228" fill="rgba(5, 150, 105, 0.4)" stroke="#10B981" strokeWidth="1" />
                    {/* Columns between L1 and L2 */}
                    {[205, 250, 295, 345, 390].map((cx, i) => (
                      <line key={i} x1={cx} y1="228" x2={cx} y2="250" stroke="#10B981" strokeWidth="2" />
                    ))}
                    <text x="290" y="214" fill="#A7F3D0" fontSize="8" fontWeight="800" textAnchor="middle">LEVEL 01 & 02 SLABS (100% COMPLETE)</text>
                  </g>

                  {/* 4. LEVEL 03 ACTIVE POUR SLAB (AMBER PULSING DECK) */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[0])}
                    style={{ cursor: 'pointer' }}
                  >
                    <polygon points="180,165 370,165 395,188 205,188" fill="rgba(245, 158, 11, 0.4)" stroke="#F59E0B" strokeWidth="2.5" />
                    <polygon points="180,165 370,165 395,188 205,188" fill="url(#activePourHatch)" />
                    <polygon points="205,188 395,188 395,198 205,198" fill="rgba(217, 119, 6, 0.7)" stroke="#F59E0B" strokeWidth="1.5" />
                    
                    {/* Concrete Pump Line & Pulsing Nozzle */}
                    <line x1="180" y1="260" x2="265" y2="175" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="265" cy="175" r="4" fill="#EF4444" className="animate-ping" />
                    <circle cx="265" cy="175" r="3" fill="#EF4444" />
                    <text x="300" y="180" fill="#FEF08A" fontSize="8.5" fontWeight="900" textAnchor="middle">
                      ⚡ LEVEL 03 EAST SLAB (65% ACTIVE)
                    </text>
                  </g>

                  {/* 5. CENTRAL CLIMBING SHEAR CORE WALL (L9–L14) */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[1])}
                    style={{ cursor: 'pointer' }}
                  >
                    <polygon points="255,65 325,65 340,85 270,85" fill="rgba(0, 169, 197, 0.3)" stroke="#00A9C5" strokeWidth="1.5" />
                    <polygon points="255,65 270,85 270,165 255,165" fill="rgba(0, 71, 83, 0.4)" stroke="#00A9C5" strokeWidth="1.2" />
                    <polygon points="270,85 340,85 340,165 270,165" fill="rgba(0, 169, 197, 0.35)" stroke="#00A9C5" strokeWidth="1.2" />
                    
                    {/* Doka Automatic Climbing Rig */}
                    <rect x="250" y="55" width="95" height="12" rx="2" fill="#00556A" stroke="#00A9C5" strokeWidth="1.5" />
                    <text x="297" y="64" fill="white" fontSize="7.5" fontWeight="800" textAnchor="middle">DOKA CLIMBING RIG (JUMP #11)</text>
                    <text x="305" y="125" fill="#D9EEF1" fontSize="8" fontWeight="800" textAnchor="middle">CORE L9–14 (82%)</text>
                  </g>

                  {/* 6. TOWER CRANE 1 (MAST & SLEWING JIB - RIGHT SIDE) */}
                  <g>
                    <line x1="435" y1="20" x2="435" y2="220" stroke="#F59E0B" strokeWidth="2.5" />
                    <line x1="430" y1="20" x2="440" y2="20" stroke="#F59E0B" strokeWidth="2" />
                    {/* Crane Jib Boom */}
                    <line x1="435" y1="25" x2="520" y2="25" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="435" y1="25" x2="390" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
                    {/* Cable Drop & Suspended Skip */}
                    <line x1="410" y1="25" x2="410" y2="135" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="410" cy="137" r="3.5" fill="#EF4444" />
                    <text x="460" y="42" fill="#FCA5A5" fontSize="7.5" fontWeight="800">POTAIN TC-1 (2.8T)</text>
                  </g>

                  {/* 7. CURTAIN WALL FACADE PANELS (L1–L4 PERIMETER) */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[4])}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="182" y="165" width="8" height="65" fill="url(#glassGrad)" stroke="#22D3EE" strokeWidth="1" />
                    <rect x="388" y="165" width="8" height="65" fill="url(#glassGrad)" stroke="#22D3EE" strokeWidth="1" />
                    <text x="450" y="195" fill="#38BDF8" fontSize="7.5" fontWeight="700">FACADE L1–L4 (12%)</text>
                  </g>

                  {/* 8. GHOSTED UPPER LEVELS 04–24 SUPERSTRUCTURE (SCHEDULED) */}
                  <g 
                    onClick={() => setSelectedBimElement(bimStructureElements[6])}
                    style={{ cursor: 'pointer' }}
                  >
                    <polygon points="180,35 370,35 395,60 205,60" fill="none" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                    <line x1="180" y1="35" x2="180" y2="165" stroke="#64748B" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.3" />
                    <line x1="395" y1="60" x2="395" y2="188" stroke="#64748B" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.3" />
                    <text x="285" y="42" fill="#94A3B8" fontSize="7.5" fontWeight="600" textAnchor="middle">UPPER DECKS L04–L24 (SCHEDULED JUN–NOV)</text>
                  </g>

                  {/* Elevation Height Scale Marker (Left - Clean & Spaced) */}
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
                /* MODE B: 2D Level 03 Detailed Pour Deck Plan */
                <svg viewBox="0 0 520 340" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <pattern id="planGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
                    </pattern>
                  </defs>
                  <rect width="520" height="340" fill="url(#planGrid)" />

                  <rect x="50" y="30" width="420" height="280" rx="8" fill="rgba(30, 41, 59, 0.6)" stroke="#475569" strokeWidth="1.5" />
                  
                  {['1', '2', '3', '4', '5'].map((g, i) => (
                    <line key={g} x1={50 + i * 105} y1="30" x2={50 + i * 105} y2="310" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" strokeDasharray="3 3" />
                  ))}

                  {/* Bay 3A (East Deck) */}
                  <rect x="60" y="40" width="190" height="125" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="2" />
                  <text x="155" y="90" fill="#6EE7B7" fontSize="12" fontWeight="800" textAnchor="middle">BAY 3A (EAST DECK)</text>
                  <text x="155" y="110" fill="#A7F3D0" fontSize="10" fontWeight="700" textAnchor="middle">✓ 100% Poured (240 m³)</text>
                  <text x="155" y="125" fill="#6EE7B7" fontSize="8.5" textAnchor="middle">Slump: 140mm • C50 Mix</text>

                  {/* Bay 3B (Center Core Perimeter) */}
                  <rect x="270" y="40" width="190" height="125" rx="6" fill="rgba(245, 158, 11, 0.3)" stroke="#F59E0B" strokeWidth="2.5" />
                  <text x="365" y="85" fill="#FCD34D" fontSize="12" fontWeight="800" textAnchor="middle">⚡ BAY 3B (CORE PERIMETER)</text>
                  <text x="365" y="105" fill="#FEF08A" fontSize="10.5" fontWeight="800" textAnchor="middle">65% Active Pour (156 / 240 m³)</text>
                  <circle cx="365" cy="130" r="14" fill="#EF4444" opacity="0.3" className="animate-ping" />
                  <circle cx="365" cy="130" r="6" fill="#EF4444" />
                  <text x="365" y="133" fill="white" fontSize="8" fontWeight="800" textAnchor="middle">PUMP</text>

                  {/* Bay 3C (West Deck) */}
                  <rect x="60" y="175" width="190" height="125" rx="6" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="1.8" />
                  <text x="155" y="225" fill="#67E8F9" fontSize="12" fontWeight="800" textAnchor="middle">BAY 3C (WEST DECK)</text>
                  <text x="155" y="245" fill="#A5F3FC" fontSize="10" fontWeight="700" textAnchor="middle">30% Rebar & PT Tendons</text>
                  <text x="155" y="260" fill="#67E8F9" fontSize="8.5" textAnchor="middle">12 Tendons Laid • Insp. 15:00</text>

                  {/* Bay 3D (Balcony Perimeter) */}
                  <rect x="270" y="175" width="190" height="125" rx="6" fill="rgba(100, 116, 139, 0.15)" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="365" y="230" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">BAY 3D (BALCONIES)</text>
                  <text x="365" y="250" fill="#CBD5E1" fontSize="10" textAnchor="middle">0% Formwork Table Forms</text>

                  {/* Central Shear Core Cutout */}
                  <rect x="220" y="115" width="80" height="70" rx="4" fill="#0F172A" stroke="#00A9C5" strokeWidth="2" />
                  <text x="260" y="150" fill="#D9EEF1" fontSize="9" fontWeight="800" textAnchor="middle">CORE WALL</text>
                  <text x="260" y="162" fill="#00A9C5" fontSize="8" textAnchor="middle">L9-14 CLIMB</text>
                </svg>
              )}

            </div>

            {/* Right Side Docked BIM Element Inspector */}
            <div style={{ width: 230, minWidth: 230, background: 'rgba(15, 23, 42, 0.96)', borderLeft: '1px solid #1E293B', padding: '12px 14px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>IFC Element Specs</span>
                  <span style={{ fontSize: 9, color: selectedBimElement.status === 'complete' ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                    {selectedBimElement.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
                    {selectedBimElement.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: '#38BDF8', fontWeight: 600, marginTop: 1 }}>
                    {selectedBimElement.level}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ background: '#1E293B', padding: '5px 8px', borderRadius: 6 }}>
                    <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>VOLUME & PROGRESS</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: selectedBimElement.status === 'complete' ? '#10B981' : '#F59E0B' }}>
                      {selectedBimElement.vol}
                    </div>
                  </div>

                  <div style={{ background: '#1E293B', padding: '5px 8px', borderRadius: 6 }}>
                    <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>CONCRETE SPECIFICATION</div>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: '#E2E8F0' }}>
                      {selectedBimElement.mix}
                    </div>
                  </div>

                  <div style={{ background: '#1E293B', padding: '5px 8px', borderRadius: 6 }}>
                    <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>QC & COMPLIANCE</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#A7F3D0' }}>
                      {selectedBimElement.qcStatus}
                    </div>
                  </div>

                  <div style={{ background: '#1E293B', padding: '5px 8px', borderRadius: 6 }}>
                    <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700 }}>CONTRACTOR</div>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: '#E2E8F0' }}>
                      {selectedBimElement.contractor}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action button at bottom */}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #1E293B' }}>
                <button 
                  onClick={() => triggerToast(`Opening live 4K stream for ${selectedBimElement.cameraRef}...`)}
                  style={{ width: '100%', padding: '6px 10px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <Eye size={13} /> View Deck CCTV
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Card 2: Planned vs Actual S-Curve (40%) */}
        <div style={{ flex: '1', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 18, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                Planned vs Actual Progress (S-Curve)
                <Info size={14} color="#94A3B8" />
              </h3>
              <span style={{ fontSize: 11, color: '#64748B' }}>Earned Value Performance • Baseline Rev 03</span>
            </div>

            {/* Metric Mode Toggle */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 2, borderRadius: 6 }}>
              <button 
                onClick={() => setMetricUnit('percent')}
                style={{ padding: '3px 8px', borderRadius: 4, border: 'none', fontSize: 10.5, fontWeight: 600, background: metricUnit === 'percent' ? 'white' : 'transparent', color: metricUnit === 'percent' ? '#4F46E5' : '#64748B', cursor: 'pointer' }}
              >
                % Progress
              </button>
              <button 
                onClick={() => setMetricUnit('evm')}
                style={{ padding: '3px 8px', borderRadius: 4, border: 'none', fontSize: 10.5, fontWeight: 600, background: metricUnit === 'evm' ? 'white' : 'transparent', color: metricUnit === 'evm' ? '#4F46E5' : '#64748B', cursor: 'pointer' }}
              >
                $ Earned Value
              </button>
            </div>
          </div>

          {/* Current Cutoff Stat Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Planned (Target)</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5' }}>68.4% <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>($17.1M)</span></div>
            </div>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Actual (Earned)</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>59.1% <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>($14.8M)</span></div>
            </div>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Variance</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>-9.3% <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>(-27d)</span></div>
            </div>
          </div>

          {/* Recharts Area S-Curve */}
          <div style={{ flex: 1, minHeight: 210, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                <YAxis unit="%" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, color: 'white', fontSize: 11 }}
                  formatter={(val, name) => [`${val}%`, name === 'planned' ? 'Planned Baseline' : (name === 'actual' ? 'Actual Progress' : 'Forecast Recovery')]}
                />
                <Area type="monotone" dataKey="planned" stroke="#004753" strokeWidth={2.5} fillOpacity={1} fill="url(#plannedGrad)" name="planned" />
                <Line type="monotone" dataKey="forecast" stroke="#00A9C5" strokeWidth={2} strokeDasharray="4 4" dot={false} name="forecast" />
                <Area type="monotone" dataKey="actual" stroke="#0F172A" strokeWidth={2.5} fillOpacity={1} fill="url(#actualGrad)" name="actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 10.5, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 3, background: '#004753' }} /> <span>Planned Baseline</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 3, background: '#0F172A' }} /> <span>Actual Earned</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 2, background: '#00A9C5', borderBottom: '1px dashed #00A9C5' }} /> <span>Forecast Recovery</span>
            </div>
          </div>

        </div>

      </div>

      {/* Middle Section: WBS Activities Table (60%) & Key Progress Indicators (40%) */}
      <div style={{ display: 'flex', gap: 18 }}>
        
        {/* WBS Master Table (60%) */}
        <div style={{ flex: '0 0 58%', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                Work Breakdown Structure (WBS) Tracking
                <Info size={14} color="#94A3B8" />
              </h3>
              <span style={{ fontSize: 11, color: '#64748B' }}>MasterFormat standard activities • Slippage calculated against approved baseline</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '3px 8px', borderRadius: 6 }}>
              9 Active Packages
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px' }}>WBS Code</th>
                  <th style={{ padding: '8px 10px' }}>Activity & Contractor</th>
                  <th style={{ padding: '8px 10px', width: '30%' }}>% Complete</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Target Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Slippage</th>
                </tr>
              </thead>
              <tbody>
                {wbsActivities.map(wbs => {
                  const isHovered = hoveredWbs === wbs.id;
                  const isDelayed = wbs.slippage.startsWith('-');

                  return (
                    <tr 
                      key={wbs.code}
                      onMouseEnter={() => setHoveredWbs(wbs.id)}
                      onMouseLeave={() => setHoveredWbs(null)}
                      style={{ 
                        borderBottom: '1px solid #F1F5F9',
                        background: isHovered ? '#F8FAFC' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '10px', fontWeight: 700, color: '#475569', fontSize: 11 }}>
                        {wbs.code}
                      </td>

                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {wbs.name}
                          {wbs.critical && (
                            <span style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 4, background: '#FEF2F2', color: '#DC2626', fontWeight: 800, border: '1px solid #FCA5A5' }}>
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>
                          {wbs.contractor} • <span style={{ color: '#4F46E5' }}>{wbs.qty}</span>
                        </div>
                      </td>

                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, width: 34, color: '#1E293B' }}>{wbs.progress}%</span>
                          <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                width: `${wbs.progress}%`, 
                                height: '100%', 
                                background: wbs.progress === 100 ? '#10B981' : (isDelayed ? '#F59E0B' : '#4F46E5'),
                                borderRadius: 3 
                              }} 
                            />
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '10px', textAlign: 'center', fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                        {wbs.plannedEnd}
                      </td>

                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, fontSize: 12, color: isDelayed ? '#DC2626' : '#166534' }}>
                        {wbs.slippage}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Progress Indicators (40%) */}
        <div style={{ flex: '1', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
            Key Progress Indicators (EVM)
            <Info size={14} color="#94A3B8" />
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, flex: 1 }}>
            
            {/* Metric 1: Overall Physical % */}
            <motion.div whileHover={{ y: -2 }} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} color="#4F46E5" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#4F46E5' }}>59.1%</div>
                  <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>▼ -9.3% vs Plan</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Overall Cumulative Physical Progress</div>
              </div>
            </motion.div>

            {/* Metric 2: Slippage Days */}
            <motion.div whileHover={{ y: -2 }} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} color="#D97706" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706' }}>-27 Days</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Finish: Nov 18, 2026</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Critical Path Schedule Slippage vs Baseline</div>
              </div>
            </motion.div>

            {/* Metric 3: SPI Index */}
            <motion.div whileHover={{ y: -2 }} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={22} color="#DC2626" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#DC2626' }}>0.86</div>
                  <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>Unfavorable (&lt; 1.0)</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>SPI (Schedule Performance Index) • EV / PV</div>
              </div>
            </motion.div>

            {/* Metric 4: CPI & Cost Variance */}
            <motion.div whileHover={{ y: -2 }} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={22} color="#0284C7" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0284C7' }}>0.94 CPI</div>
                  <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>CV: -$900K</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Cost Performance Index • AC: $15.68M</div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Bottom Section: Delay Evidence Timeline with Authentic Photographic Proof */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
              Delay Evidence & Forensic Audit Trail
              <Info size={14} color="#94A3B8" />
            </h3>
            <span style={{ fontSize: 11, color: '#64748B' }}>
              Photographic proof linked to Extension of Time (EOT) claims and schedule impact analysis
            </span>
          </div>

          <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 6, border: '1px solid #FCA5A5' }}>
            Total Delay Impact: -19 Work Days
          </span>
        </div>

        {/* Timeline Horizontal Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {delayEvidenceLog.map((event) => (
            <motion.div 
              key={event.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedEvidence(event)}
              style={{ 
                border: '1px solid #E2E8F0', 
                borderRadius: 12, 
                overflow: 'hidden', 
                background: 'white', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Authentic Photo Container */}
              <div style={{ position: 'relative', height: 130, overflow: 'hidden', background: '#0F172A' }}>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                
                <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 4, color: 'white', fontSize: 9.5, fontWeight: 700 }}>
                  {event.cameraRef}
                </div>

                <div style={{ position: 'absolute', top: 8, right: 8, background: '#DC2626', padding: '2px 6px', borderRadius: 4, color: 'white', fontSize: 10, fontWeight: 800 }}>
                  {event.impactDays}
                </div>

                <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', color: '#E2E8F0', fontSize: 10 }}>
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
              </div>

              {/* Event Content Details */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
                    {event.category}
                  </div>
                  <h4 style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginTop: 2 }}>
                    {event.title}
                  </h4>
                  <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4, marginTop: 4 }}>
                    {event.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>
                    {event.eotStatus.split(' ')[0]} {event.eotStatus.split(' ')[1]}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                    Cost: {event.costImpact}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* MODAL: Full Delay Evidence & Forensic Inspection */}
      <AnimatePresence>
        {selectedEvidence && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 640, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', height: 260, background: '#0F172A' }}>
                <img src={selectedEvidence.image} alt={selectedEvidence.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setSelectedEvidence(null)}
                  style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(15, 23, 42, 0.8)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
                <div style={{ position: 'absolute', bottom: 12, left: 16, background: 'rgba(15, 23, 42, 0.9)', padding: '4px 10px', borderRadius: 6, color: '#38BDF8', fontSize: 11, fontWeight: 700 }}>
                  High-Resolution Evidence Capture • {selectedEvidence.cameraRef} ({selectedEvidence.date} {selectedEvidence.time})
                </div>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>{selectedEvidence.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedEvidence.title}</h3>
                  </div>
                  <span style={{ background: '#DC2626', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800 }}>
                    Impact: {selectedEvidence.impactDays}
                  </span>
                </div>

                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                  {selectedEvidence.desc}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>WBS Affected Package</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{selectedEvidence.wbsRef}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Direct Cost Incurred</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{selectedEvidence.costImpact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Contractual Status</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{selectedEvidence.eotStatus}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>AI Detection Method</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5' }}>CCTV Spatial AI Verification</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button 
                    onClick={() => setSelectedEvidence(null)}
                    style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => { setSelectedEvidence(null); triggerToast('Extension of Time (EOT) claim dossier exported to PDF.'); }}
                    style={{ padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                  >
                    Export EOT Claim Packet
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
