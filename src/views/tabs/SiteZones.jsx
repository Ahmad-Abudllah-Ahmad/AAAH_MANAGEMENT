import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Users, 
  AlertTriangle, Settings, Radio, 
  Layers, Camera, Truck, ZoomIn, ZoomOut, RotateCcw, 
  CheckCircle2, 
  Volume2, X, Bell
} from 'lucide-react';

// Comprehensive, realistic construction site zones database
const initialZones = [
  { 
    id: 'Z-01', 
    name: 'TC-1 Slewing & Drop Envelope', 
    type: 'Critical Risk', 
    category: 'Restricted',
    gridRef: 'Grid D4–G8 • R=35m', 
    elevation: '+0.00m to +68.50m', 
    status: 'Active', 
    personnel: 2, 
    limit: 0, 
    violation: true, 
    violationTitle: 'CRITICAL INTRUSION: PERSONNEL UNDER SUSPENDED LOAD',
    violationDesc: '2 workers detected within 35m crane slewing radius during active 2.8T rebar lift.',
    equipment: 'Potain MDT 389 (Tower Crane 1)',
    cctv: ['CAM-11 (Aerial)', 'CAM-07 (L3 Slab)'],
    area: '3,848 m²',
    ppeRequired: ['Hard Hat with 4-pt Chin Strap', 'Class 3 High-Vis', 'Banksman Radio Clearance'],
    ptw: 'PTW-2026-0891 (Critical Lift)',
    contractors: ['Apex Structural Steel', 'Doka Formwork'],
    envSensors: { wind: '22 km/h (Safe <38)', load: '2.8 T Suspended', hookHeight: '+54.2m' },
    activePersonnel: [
      { id: 'TRK-902', name: 'Rashid Khan', trade: 'Steel Rigger', sub: 'Apex Steel', ppeStatus: 'BREACH', detail: 'Directly in drop radius', dwell: '4m 12s' },
      { id: 'TRK-533', name: 'Vikram Singh', trade: 'Formwork Carpenter', sub: 'Doka', ppeStatus: 'WARNING', detail: 'No harness tie-off', dwell: '7m 45s' }
    ],
    mapCoord: { type: 'circle', cx: 410, cy: 220, r: 88, color: '#EF4444' }
  },
  { 
    id: 'Z-02', 
    name: 'East Tower Level 3 Slab Pouring', 
    type: 'Active Work', 
    category: 'Operational',
    gridRef: 'East Tower • Grid E1–H6', 
    elevation: '+12.40m (L3 Deck)', 
    status: 'Active', 
    personnel: 45, 
    limit: 60, 
    violation: false, 
    equipment: 'Putzmeister 42m Boom Pump (BP-02)',
    cctv: ['CAM-07 (Level 3 Deck)'],
    area: '1,420 m²',
    ppeRequired: ['Hard Hat', 'Safety Goggles', 'Rubber Boots', 'Hi-Vis Vest'],
    ptw: 'PTW-2026-0842 (Concrete Pour)',
    contractors: ['Arabtec Concreting', 'Al Naboodah MEP'],
    envSensors: { concreteTemp: '28.4°C', slump: '140mm', cureHumidity: '68%' },
    activePersonnel: [
      { id: 'TRK-491', name: 'Tariq Al-Mansoor', trade: 'Lead Concreter', sub: 'Arabtec', ppeStatus: 'COMPLIANT', detail: 'Vibrator Operator', dwell: '1h 14m' },
      { id: 'TRK-502', name: 'Chen Wei', trade: 'Screeder', sub: 'Arabtec', ppeStatus: 'COMPLIANT', detail: 'Bay 3 Surface Finish', dwell: '52m' },
      { id: 'TRK-498', name: 'Amit Sharma', trade: 'Steel Fixer', sub: 'Al Naboodah', ppeStatus: 'COMPLIANT', detail: 'Edge Rebar Inspection', dwell: '28m' }
    ],
    mapCoord: { type: 'rect', x: 550, y: 130, w: 220, h: 140, color: '#00A9C5' }
  },
  { 
    id: 'Z-03', 
    name: 'South Foundation Pit & Deep Trench', 
    type: 'High Risk', 
    category: 'Restricted',
    gridRef: 'South Pit • Grid A2–C6', 
    elevation: '-8.60m to -14.20m', 
    status: 'Active', 
    personnel: 12, 
    limit: 15, 
    violation: false, 
    equipment: 'CAT 340D Hydraulic Excavator (#EXC-01)',
    cctv: ['CAM-09 (Excavation Pit)'],
    area: '980 m²',
    ppeRequired: ['Hard Hat', 'Slope Tether Harness', 'Multi-Gas Detector', 'Hi-Vis'],
    ptw: 'PTW-2026-0799 (Deep Shoring)',
    contractors: ['Bauer Ground Engineering'],
    envSensors: { o2: '20.9%', co: '2.1 ppm (Safe)', slopeTilt: '0.03°' },
    activePersonnel: [
      { id: 'TRK-911', name: 'Suleiman Farouk', trade: 'Excavation Banksman', sub: 'Bauer', ppeStatus: 'COMPLIANT', detail: 'Trench Watchman', dwell: '2h 05m' },
      { id: 'TRK-912', name: 'Kumar Patel', trade: 'Piling Rig Tech', sub: 'Bauer', ppeStatus: 'COMPLIANT', detail: 'Anchor Test', dwell: '45m' }
    ],
    mapCoord: { type: 'polygon', points: '140,300 310,290 295,440 120,430', color: '#F59E0B' }
  },
  { 
    id: 'Z-04', 
    name: 'Logistics Yard & Rebar Staging', 
    type: 'Logistics', 
    category: 'Operational',
    gridRef: 'South-West Yard • Grid J1–M4', 
    elevation: 'Ground +0.00m', 
    status: 'Active', 
    personnel: 8, 
    limit: 20, 
    violation: false, 
    equipment: 'Toyota 3.5T Forklift (#FL-02)',
    cctv: ['CAM-04 (Logistics Stockyard)'],
    area: '2,150 m²',
    ppeRequired: ['Steel Toe Boots', 'Hi-Vis Vest Class 2', 'Hard Hat'],
    ptw: 'General Yard Staging Protocol',
    contractors: ['Emirates Steel Logistics', 'Site Logistics Corp'],
    envSensors: { vehicleSpeedAvg: '5.8 km/h', stockCapacity: '76% Full' },
    activePersonnel: [
      { id: 'TRK-881', name: 'Zackariah Paul', trade: 'Logistics Lead', sub: 'Site Logistics', ppeStatus: 'COMPLIANT', detail: 'Offloading Rebar #16', dwell: '3h 10m' },
      { id: 'TRK-874', name: 'Bilal Ahmed', trade: 'Forklift Spotter', sub: 'Site Logistics', ppeStatus: 'COMPLIANT', detail: 'Aisle Traffic Control', dwell: '1h 30m' }
    ],
    mapCoord: { type: 'rect', x: 120, y: 120, w: 170, h: 140, color: '#10B981' }
  },
  { 
    id: 'Z-05', 
    name: 'West Tower Climbing Scaffolding', 
    type: 'High Risk', 
    category: 'Maintenance',
    gridRef: 'West Core • L12–L14 Perimeter', 
    elevation: '+44.00m to +52.00m', 
    status: 'Maintenance', 
    personnel: 0, 
    limit: 0, 
    violation: false, 
    equipment: 'Doka SKE 50 Automatic Formwork Jacks',
    cctv: ['CAM-07 (Level 3 Deck)'],
    area: '460 m²',
    ppeRequired: ['100% Dual Tie-Off Fall Arrest', 'Hard Hat with Chin Strap', 'Tool Lanyards'],
    ptw: 'LOCKED — Hydraulic Climbing Maintenance #PTW-0914',
    contractors: ['Doka Formwork Specialists'],
    envSensors: { windAtAltitude: '31 km/h', lockStatus: 'Hydraulics Locked' },
    activePersonnel: [],
    mapCoord: { type: 'rect', x: 550, y: 310, w: 160, h: 120, color: '#00556A' }
  },
  { 
    id: 'Z-06', 
    name: 'Gate 1 Access & Weighbridge', 
    type: 'Transit', 
    category: 'Controlled',
    gridRef: 'North Perimeter • Gate 1 Checkpoint', 
    elevation: 'Ground +0.00m', 
    status: 'Active', 
    personnel: 24, 
    limit: 50, 
    violation: false, 
    equipment: '4x Smart Turnstiles + 60T Truck Weighbridge',
    cctv: ['CAM-02 (Gate 1 Logistics)'],
    area: '620 m²',
    ppeRequired: ['RFID Badge Scan', 'Full PPE Verification at Turnstile'],
    ptw: 'Site Access Protocol Standard',
    contractors: ['G4S Security', 'All Subcontractors'],
    envSensors: { transitRate: '42 persons/hr', truckQueue: '1 Inbound Concrete Mixer' },
    activePersonnel: [
      { id: 'SEC-01', name: 'Sgt. O\'Connor', trade: 'Chief Security Officer', sub: 'G4S', ppeStatus: 'COMPLIANT', detail: 'Access Control', dwell: '4h 00m' },
      { id: 'TRK-102', name: 'Hassan Ali', trade: 'Delivery Driver', sub: 'Unimix', ppeStatus: 'COMPLIANT', detail: 'Weighbridge Ticket #491', dwell: '6m' }
    ],
    mapCoord: { type: 'rect', x: 340, y: 40, w: 140, h: 65, color: '#06B6D4' }
  },
  { 
    id: 'Z-07', 
    name: 'Chemical & Diesel Bunkering Bay', 
    type: 'Critical Risk', 
    category: 'Exclusion',
    gridRef: 'North-East Perimeter • Tank Bay 01', 
    elevation: 'Ground +0.00m', 
    status: 'Active', 
    personnel: 0, 
    limit: 0, 
    violation: false, 
    equipment: '10,000L Self-Bunded Diesel Cell + Spill Kit',
    cctv: ['CAM-04 (Logistics Stockyard)'],
    area: '180 m²',
    ppeRequired: ['Spark-Proof Boots', 'Flame Retardant Coverall', 'No Mobile Phones'],
    ptw: 'PTW-2026-0902 (Fuel Transfer Protocol)',
    contractors: ['ADNOC Fuel Logistics'],
    envSensors: { vocGas: '0.00 ppm', bundLevel: 'Dry (Normal)', grounding: '100% Active' },
    activePersonnel: [],
    mapCoord: { type: 'rect', x: 690, y: 40, w: 90, h: 65, color: '#F43F5E' }
  },
  { 
    id: 'Z-08', 
    name: 'Batching Plant & Precast Laydown', 
    type: 'Logistics', 
    category: 'Operational',
    gridRef: 'South-East Yard • Grid K5–M8', 
    elevation: 'Ground +0.00m', 
    status: 'Active', 
    personnel: 6, 
    limit: 12, 
    violation: false, 
    equipment: '5T Overhead Gantry Crane + Mixer Washout Basin',
    cctv: ['CAM-04 (Logistics Stockyard)'],
    area: '1,100 m²',
    ppeRequired: ['Hi-Vis Vest', 'Hard Hat', 'Safety Goggles'],
    ptw: 'Daily Batching & Washout Operations',
    contractors: ['Unimix Concrete Corp'],
    envSensors: { washoutPH: '7.8', moistureIndex: '4.2%' },
    activePersonnel: [
      { id: 'TRK-610', name: 'George Vance', trade: 'Batching Operator', sub: 'Unimix', ppeStatus: 'COMPLIANT', detail: 'Silo Level Check', dwell: '1h 50m' }
    ],
    mapCoord: { type: 'rect', x: 340, y: 350, w: 140, h: 100, color: '#3B82F6' }
  }
];

// Live simulated worker RFID/BLE locations on CAD blueprint
const liveWorkerMarkers = [
  // TC-1 radius (Violations)
  { id: 'w1', tag: '#TRK-902', name: 'Rashid Khan', x: 430, y: 240, color: '#EF4444', trade: 'Steel Rigger', zone: 'Z-01', breach: true },
  { id: 'w2', tag: '#TRK-533', name: 'Vikram Singh', x: 370, y: 200, color: '#F59E0B', trade: 'Formwork Carpenter', zone: 'Z-01', breach: true },
  // East Tower Slab
  { id: 'w3', tag: '#TRK-491', name: 'Tariq M.', x: 580, y: 160, color: '#00A9C5', trade: 'Concreter', zone: 'Z-02' },
  { id: 'w4', tag: '#TRK-502', name: 'Chen W.', x: 640, y: 180, color: '#00A9C5', trade: 'Concreter', zone: 'Z-02' },
  { id: 'w5', tag: '#TRK-498', name: 'Amit S.', x: 710, y: 150, color: '#00A9C5', trade: 'Steel Fixer', zone: 'Z-02' },
  { id: 'w6', tag: '#TRK-505', name: 'Carlos R.', x: 610, y: 220, color: '#00A9C5', trade: 'Concreter', zone: 'Z-02' },
  { id: 'w7', tag: '#TRK-509', name: 'Ali Reza', x: 670, y: 240, color: '#00A9C5', trade: 'Finisher', zone: 'Z-02' },
  { id: 'w8', tag: '#TRK-514', name: 'Dawood K.', x: 740, y: 210, color: '#00A9C5', trade: 'MEP Rough-in', zone: 'Z-02' },
  // Excavation Pit
  { id: 'w9', tag: '#TRK-911', name: 'Suleiman F.', x: 210, y: 350, color: '#F59E0B', trade: 'Excavation Banksman', zone: 'Z-03' },
  { id: 'w10', tag: '#TRK-912', name: 'Kumar P.', x: 250, y: 390, color: '#F59E0B', trade: 'Piling Tech', zone: 'Z-03' },
  { id: 'w11', tag: '#TRK-913', name: 'Marko B.', x: 170, y: 380, color: '#F59E0B', trade: 'Shoring Specialist', zone: 'Z-03' },
  // Logistics Yard
  { id: 'w12', tag: '#TRK-881', name: 'Zackariah P.', x: 160, y: 180, color: '#10B981', trade: 'Yard Lead', zone: 'Z-04' },
  { id: 'w13', tag: '#TRK-874', name: 'Bilal A.', x: 230, y: 160, color: '#10B981', trade: 'Spotter', zone: 'Z-04' },
  // Gate 1
  { id: 'w14', tag: '#SEC-01', name: 'Sgt. O\'Connor', x: 380, y: 70, color: '#06B6D4', trade: 'Security Lead', zone: 'Z-06' },
  { id: 'w15', tag: '#TRK-102', name: 'Hassan Ali', x: 420, y: 65, color: '#06B6D4', trade: 'Delivery Driver', zone: 'Z-06' },
  // Batching Plant
  { id: 'w16', tag: '#TRK-610', name: 'George V.', x: 390, y: 390, color: '#3B82F6', trade: 'Batching Tech', zone: 'Z-08' }
];

// CCTV Camera Field of View Cones on Site
const cctvCones = [
  { id: 'CAM-02', x: 340, y: 40, angle: 110, range: 70, label: 'CAM-02 (Gate 1)', color: '#06B6D4' },
  { id: 'CAM-04', x: 120, y: 120, angle: 45, range: 110, label: 'CAM-04 (Logistics Yard)', color: '#10B981' },
  { id: 'CAM-07', x: 550, y: 130, angle: 135, range: 130, label: 'CAM-07 (L3 East Slab)', color: '#00A9C5' },
  { id: 'CAM-09', x: 140, y: 300, angle: 30, range: 95, label: 'CAM-09 (Excavation Pit)', color: '#F59E0B' },
  { id: 'CAM-11', x: 410, y: 220, angle: 0, range: 88, isCircle: true, label: 'CAM-11 (Crane 4K Top-Down)', color: '#EF4444' }
];

// Heavy machinery locations on CAD
const siteMachinery = [
  { id: 'TC-1', name: 'Tower Crane 1 (Potain MDT 389)', x: 410, y: 220, type: 'crane', status: 'Lifting 2.8T', heading: 42 },
  { id: 'EXC-01', name: 'CAT 340D Excavator', x: 230, y: 340, type: 'excavator', status: 'Excavating -12.4m' },
  { id: 'FL-02', name: 'Toyota 3.5T Forklift', x: 190, y: 200, type: 'forklift', status: 'Moving Rebar Pallet' },
  { id: 'BP-02', name: 'Putzmeister Boom Pump', x: 540, y: 200, type: 'pump', status: 'Pouring L3 Bay 2' },
  { id: 'TRK-MX1', name: 'Concrete Mixer Truck #082', x: 430, y: 70, type: 'truck', status: 'Discharging Batch' }
];

export const SiteZones = () => {
  const [zonesList, setZonesList] = useState(initialZones);
  const [search, setSearch] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('Z-01');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Layer toggles
  const [showWorkers, setShowWorkers] = useState(true);
  const [showCCTVCones, setShowCCTVCones] = useState(true);
  const [showMachinery, setShowMachinery] = useState(true);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showDangerRadii, setShowDangerRadii] = useState(true);

  // Map viewport states
  const [zoomScale, setZoomScale] = useState(1);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [hoveredWorker, setHoveredWorker] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [showAlertRulesModal, setShowAlertRulesModal] = useState(false);
  const [showNewZoneModal, setShowNewZoneModal] = useState(false);
  const [newZoneForm, setNewZoneForm] = useState({
    name: '',
    type: 'High Risk',
    category: 'Restricted',
    gridRef: 'Grid B2–D4',
    limit: 10,
    ppeRequired: 'Hard Hat, High-Vis Vest, Steel Toe Boots'
  });

  const selectedZone = zonesList.find(z => z.id === selectedZoneId) || zonesList[0];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered zones
  const filteredZones = zonesList.filter(z => {
    const matchesSearch = 
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.id.toLowerCase().includes(search.toLowerCase()) ||
      z.type.toLowerCase().includes(search.toLowerCase()) ||
      z.gridRef.toLowerCase().includes(search.toLowerCase()) ||
      z.equipment?.toLowerCase().includes(search.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Critical') return matchesSearch && (z.type === 'Critical Risk' || z.violation);
    if (activeCategory === 'Operational') return matchesSearch && (z.category === 'Operational' || z.type === 'Active Work');
    if (activeCategory === 'Restricted') return matchesSearch && z.category === 'Restricted';
    if (activeCategory === 'Logistics') return matchesSearch && z.type === 'Logistics';
    return matchesSearch;
  });

  // Calculate totals
  const totalSiteWorkers = zonesList.reduce((acc, z) => acc + z.personnel, 0);
  const totalViolations = zonesList.filter(z => z.violation).length;
  const criticalZonesCount = zonesList.filter(z => z.type === 'Critical Risk' || z.type === 'High Risk').length;

  const handleCreateZone = (e) => {
    e.preventDefault();
    if (!newZoneForm.name) return;
    const newId = `Z-0${zonesList.length + 1}`;
    const created = {
      id: newId,
      name: newZoneForm.name,
      type: newZoneForm.type,
      category: newZoneForm.category,
      gridRef: newZoneForm.gridRef,
      elevation: 'Ground +0.00m',
      status: 'Active',
      personnel: 0,
      limit: parseInt(newZoneForm.limit, 10) || 0,
      violation: false,
      equipment: 'General Site Access',
      cctv: ['CAM-07 (L3 East Slab)'],
      area: '850 m²',
      ppeRequired: newZoneForm.ppeRequired.split(',').map(s => s.trim()),
      ptw: `PTW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      contractors: ['General Subcontractors'],
      envSensors: { status: 'Nominal' },
      activePersonnel: [],
      mapCoord: { type: 'rect', x: 250, y: 150, w: 120, h: 90, color: '#3B82F6' }
    };
    setZonesList(prev => [...prev, created]);
    setSelectedZoneId(newId);
    setShowNewZoneModal(false);
    triggerToast(`Geofence ${newId} (${created.name}) created and activated on site map.`);
  };

  const handleEvacuateZone = (zone) => {
    triggerToast(`🚨 Site Siren & Evacuation Alert Broadcasted for ${zone.id} (${zone.name})! Banksman and HSE notified.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
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
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-lg)', 
              border: '1px solid var(--color-brand-200)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12 
            }}
          >
            <CheckCircle2 size={20} color="var(--color-success-600)" />
            <span className="text-body-m" style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar with Live KPIs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="text-h2" style={{ fontSize: 22, color: '#0F172A', fontWeight: 800 }}>Geofencing & Site Spatial Intelligence</h1>
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px',
              borderRadius: 20, fontSize: 11, fontWeight: 700, border: '1px solid #C7D2FE'
            }}>
              <Radio size={12} className="animate-pulse" /> LIVE TELEMETRY (GRID 1:500)
            </span>
          </div>
          <p className="text-body-s" style={{ color: '#64748B', marginTop: 3 }}>
            Plot 4 Al Barsha High-Rise • Real-time BIM exclusion boundaries, crane slewing radii, & worker density tracking
          </p>
        </div>

        {/* Live Site Metrics Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: '6px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            <div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Monitored Area</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>14,850 m²</div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '6px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Users size={16} color="#4F46E5" />
            <div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Active On Site</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#4F46E5' }}>{totalSiteWorkers} Workers</div>
            </div>
          </div>

          <div style={{ 
            background: totalViolations > 0 ? '#FEF2F2' : 'white', 
            padding: '6px 14px', borderRadius: 10, 
            border: `1px solid ${totalViolations > 0 ? '#FCA5A5' : '#E2E8F0'}`, 
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <AlertTriangle size={16} color={totalViolations > 0 ? '#DC2626' : '#10B981'} />
            <div>
              <div style={{ fontSize: 10, color: totalViolations > 0 ? '#B91C1C' : '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Geofence Breaches</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: totalViolations > 0 ? '#DC2626' : '#10B981' }}>
                {totalViolations} Active Alert
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowAlertRulesModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 600, color: '#334155', cursor: 'pointer', fontSize: 13 }}
            className="hover-bg-gray-50"
          >
            <Settings size={15} /> Alert Rules
          </button>

          <button 
            onClick={() => setShowNewZoneModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Draw New Zone
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Zones List (380px) & Right Interactive CAD Blueprint + Inspector */}
      <div style={{ display: 'flex', gap: 18, flex: 1, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Left Panel: Filter & Detailed Zones Directory */}
        <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: 12, background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <Search size={15} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search zones, grid refs, machinery..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#1E293B', fontWeight: 500 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {[
              { id: 'All', label: `All (${zonesList.length})` },
              { id: 'Critical', label: `Breaches / High (${criticalZonesCount})` },
              { id: 'Operational', label: 'Operational' },
              { id: 'Logistics', label: 'Logistics' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  border: activeCategory === cat.id ? 'none' : '1px solid #E2E8F0',
                  background: activeCategory === cat.id ? 'var(--gradient-brand)' : '#F8FAFC',
                  color: activeCategory === cat.id ? 'white' : '#64748B',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === cat.id ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Zones Scrollable List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingRight: 4, flex: 1 }}>
            {filteredZones.map(zone => {
              const isSelected = selectedZoneId === zone.id;
              const isViolating = zone.violation;
              const densityPct = zone.limit > 0 ? Math.min(100, Math.round((zone.personnel / zone.limit) * 100)) : (zone.personnel > 0 ? 100 : 0);

              return (
                <motion.div 
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: 12, 
                    border: isSelected 
                      ? (isViolating ? '2px solid #DC2626' : '2px solid #00A9C5')
                      : (isViolating ? '1px solid #FECACA' : '1px solid #E2E8F0'),
                    background: isViolating 
                      ? '#FEF2F2' 
                      : (isSelected ? 'var(--color-brand-50)' : 'white'), 
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,169,197,0.18)' : 'none'
                  }}
                >
                  {/* Top Row: Zone ID, Name, Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ 
                        fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 4, 
                        background: isViolating ? '#EF4444' : '#E2E8F0', 
                        color: isViolating ? 'white' : '#334155' 
                      }}>
                        {zone.id}
                      </span>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {isViolating && <AlertTriangle size={14} color="#DC2626" className="animate-pulse" />}
                        {zone.name}
                      </h3>
                    </div>

                    <span style={{ 
                      padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                      background: zone.status === 'Active' ? '#DCFCE7' : '#F1F5F9',
                      color: zone.status === 'Active' ? '#166534' : '#475569'
                    }}>
                      {zone.status}
                    </span>
                  </div>

                  {/* Grid Ref & Equipment Subtitle */}
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 {zone.gridRef}</span>
                    <span style={{ color: '#4F46E5', fontWeight: 600 }}>{zone.area}</span>
                  </div>

                  {/* Violation Alert Banner if Active */}
                  {isViolating && (
                    <div style={{ background: '#FEE2E2', borderLeft: '3px solid #DC2626', padding: '6px 8px', borderRadius: 4, marginBottom: 8, fontSize: 11, color: '#991B1B', fontWeight: 600 }}>
                      ⚠️ {zone.violationTitle}
                    </div>
                  )}

                  {/* Capacity & Live Telemetry Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} color={isViolating ? '#DC2626' : (densityPct > 80 ? '#D97706' : '#4F46E5')} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: isViolating ? '#DC2626' : '#1E293B' }}>
                        {zone.personnel} <span style={{ color: '#94A3B8', fontWeight: 500 }}>/ {zone.limit === 0 ? 'No Entry' : `${zone.limit} max`}</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, color: '#64748B' }}>
                      <Camera size={12} />
                      <span>{zone.cctv[0].split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Mini Progress Capacity Bar if limit > 0 */}
                  {zone.limit > 0 && (
                    <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${densityPct}%`, 
                          height: '100%', 
                          background: densityPct > 85 ? '#EF4444' : (densityPct > 65 ? '#F59E0B' : '#10B981'),
                          borderRadius: 2 
                        }} 
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Panel: Interactive CAD Site Blueprint & Live Zone Inspector */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          
          {/* Map Viewport Container */}
          <div style={{ 
            flex: 1, background: '#0F172A', borderRadius: 16, border: '1px solid #1E293B', 
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
          }}>
            
            {/* Map Top Bar Controls & Layer Toggles */}
            <div style={{ 
              position: 'absolute', top: 12, left: 12, right: 12, zIndex: 20, 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' 
            }}>
              {/* Layer Toggles Pills */}
              <div style={{ display: 'flex', gap: 6, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '4px 8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'auto' }}>
                <button 
                  onClick={() => setShowWorkers(!showWorkers)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, background: showWorkers ? '#4F46E5' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  <Users size={12} /> Personnel Tags ({liveWorkerMarkers.length})
                </button>

                <button 
                  onClick={() => setShowCCTVCones(!showCCTVCones)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, background: showCCTVCones ? '#0284C7' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  <Camera size={12} /> CCTV Cones
                </button>

                <button 
                  onClick={() => setShowDangerRadii(!showDangerRadii)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, background: showDangerRadii ? '#DC2626' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  <AlertTriangle size={12} /> Hazard Radii
                </button>

                <button 
                  onClick={() => setShowMachinery(!showMachinery)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, background: showMachinery ? '#D97706' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  <Truck size={12} /> Machinery ({siteMachinery.length})
                </button>

                <button 
                  onClick={() => setShowGridLines(!showGridLines)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, background: showGridLines ? '#475569' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  <Layers size={12} /> BIM Grid
                </button>
              </div>

              {/* Viewport Nav Controls (Zoom In/Out, Reset) */}
              <div style={{ display: 'flex', gap: 6, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '4px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'auto' }}>
                <button 
                  onClick={() => setZoomScale(prev => Math.min(prev + 0.15, 1.6))} 
                  title="Zoom In" 
                  style={{ padding: 6, background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', borderRadius: 6 }}
                  className="hover-bg-gray-800"
                >
                  <ZoomIn size={15} />
                </button>
                <button 
                  onClick={() => setZoomScale(prev => Math.max(prev - 0.15, 0.75))} 
                  title="Zoom Out" 
                  style={{ padding: 6, background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', borderRadius: 6 }}
                  className="hover-bg-gray-800"
                >
                  <ZoomOut size={15} />
                </button>
                <button 
                  onClick={() => setZoomScale(1)} 
                  title="Reset View" 
                  style={{ padding: 6, background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', borderRadius: 6 }}
                  className="hover-bg-gray-800"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Architectural CAD Blueprint Vector Canvas */}
            <div style={{ 
              flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', background: '#0B1120' 
            }}>
              
              <motion.svg
                viewBox="0 0 840 500"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  transform: `scale(${zoomScale})`, 
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <defs>
                  {/* Grid pattern */}
                  <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8"/>
                    <circle cx="40" cy="40" r="1" fill="rgba(255,255,255,0.15)" />
                  </pattern>

                  {/* Danger Hatch Pattern */}
                  <pattern id="dangerHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="3" />
                  </pattern>

                  {/* Caution Hatch Pattern */}
                  <pattern id="warningHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2.5" />
                  </pattern>

                  {/* Radial gradient for Crane Slewing */}
                  <radialGradient id="craneGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
                    <stop offset="70%" stopColor="rgba(239, 68, 68, 0.18)" />
                    <stop offset="100%" stopColor="rgba(239, 68, 68, 0.02)" />
                  </radialGradient>
                </defs>

                {/* Base Background Grid */}
                <rect width="840" height="500" fill="url(#cadGrid)" />

                {/* Site Perimeter Hoarding Line */}
                <rect x="70" y="20" width="720" height="450" rx="12" fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="80" y="36" fill="rgba(148, 163, 184, 0.5)" fontSize="9" fontWeight="700" letterSpacing="1">SITE HOARDING BOUNDARY • PLOT 4 (14,850 M²)</text>

                {/* Structural BIM Grid Axes */}
                {showGridLines && (
                  <g opacity="0.45">
                    {/* Horizontal Grid Lines */}
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((axis, i) => (
                      <g key={axis}>
                        <line x1="70" y1={70 + i * 70} x2="790" y2={70 + i * 70} stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.7" strokeDasharray="3 3" />
                        <circle cx="55" cy={70 + i * 70} r="9" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <text x="55" y={73 + i * 70} fill="#38BDF8" fontSize="8.5" fontWeight="700" textAnchor="middle">{axis}</text>
                      </g>
                    ))}
                    {/* Vertical Grid Lines */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((axis, i) => (
                      <g key={axis}>
                        <line x1={110 + i * 68} y1="20" x2={110 + i * 68} y2="470" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.7" strokeDasharray="3 3" />
                        <circle cx={110 + i * 68} cy="485" r="9" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <text x={110 + i * 68} y={488} fill="#38BDF8" fontSize="8.5" fontWeight="700" textAnchor="middle">{axis}</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Construction Architectural Footprints (Underlay) */}
                {/* East Tower Core Footprint */}
                <rect x="540" y="120" width="240" height="320" rx="8" fill="rgba(30, 41, 59, 0.6)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
                <rect x="610" y="190" width="100" height="90" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#00A9C5" strokeWidth="1.5" />
                <text x="660" y="240" fill="#D9EEF1" fontSize="9" fontWeight="700" textAnchor="middle">CORE SHEAR WALL</text>

                {/* Excavation Shoring Pit Footprint */}
                <polygon points="130,290 320,280 305,450 110,440" fill="rgba(180, 83, 9, 0.12)" stroke="#D97706" strokeWidth="1" strokeDasharray="4 2" />
                <text x="215" y="420" fill="#FBBF24" fontSize="8.5" fontWeight="600" textAnchor="middle">SHORING BERM EL -14.2M</text>

                {/* CCTV Field of View Cones (Layer) */}
                {showCCTVCones && cctvCones.map(cam => {
                  if (cam.isCircle) {
                    return (
                      <circle key={cam.id} cx={cam.x} cy={cam.y} r={cam.range} fill="none" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
                    );
                  }
                  return (
                    <g key={cam.id}>
                      <path 
                        d={`M ${cam.x} ${cam.y} L ${cam.x + cam.range * Math.cos((cam.angle - 25) * Math.PI / 180)} ${cam.y + cam.range * Math.sin((cam.angle - 25) * Math.PI / 180)} A ${cam.range} ${cam.range} 0 0 1 ${cam.x + cam.range * Math.cos((cam.angle + 25) * Math.PI / 180)} ${cam.y + cam.range * Math.sin((cam.angle + 25) * Math.PI / 180)} Z`} 
                        fill="rgba(56, 189, 248, 0.08)" 
                        stroke="rgba(56, 189, 248, 0.3)" 
                        strokeWidth="1" 
                      />
                      <circle cx={cam.x} cy={cam.y} r="4" fill={cam.color} />
                      <text x={cam.x + 8} y={cam.y - 4} fill="#94A3B8" fontSize="8" fontWeight="700">{cam.id}</text>
                    </g>
                  );
                })}

                {/* GEOFENCE BOUNDARIES (Main Interactive Layer) */}
                {zonesList.map(zone => {
                  const isSelected = selectedZoneId === zone.id;
                  const isHovered = hoveredZone === zone.id;
                  const coord = zone.mapCoord;

                  if (coord.type === 'circle') {
                    return (
                      <g 
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Shaded Fill */}
                        <circle 
                          cx={coord.cx} 
                          cy={coord.cy} 
                          r={coord.r} 
                          fill={zone.violation ? "url(#craneGlow)" : "rgba(239, 68, 68, 0.15)"} 
                        />
                        {/* Hatch pattern for danger */}
                        {showDangerRadii && (
                          <circle cx={coord.cx} cy={coord.cy} r={coord.r} fill="url(#dangerHatch)" />
                        )}
                        {/* Outer Perimeter Line */}
                        <circle 
                          cx={coord.cx} 
                          cy={coord.cy} 
                          r={coord.r} 
                          fill="none" 
                          stroke={zone.violation ? '#EF4444' : coord.color} 
                          strokeWidth={isSelected ? 3 : (isHovered ? 2.5 : 1.8)} 
                          strokeDasharray={zone.violation ? "8 4" : "4 2"}
                        />
                        
                        {/* Animated Pulsing Ring if in Violation */}
                        {zone.violation && (
                          <circle 
                            cx={coord.cx} cy={coord.cy} r={coord.r} 
                            fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6"
                            className="animate-ping"
                            style={{ transformOrigin: `${coord.cx}px ${coord.cy}px` }}
                          />
                        )}

                        {/* Zone Center Label Pill */}
                        <rect 
                          x={coord.cx - 36} y={coord.cy - 12} width="72" height="24" rx="12" 
                          fill={isSelected ? '#EF4444' : '#1E293B'} 
                          stroke="#EF4444" strokeWidth="1.5" 
                        />
                        <text x={coord.cx} y={coord.cy + 4} fill="white" fontSize="10" fontWeight="800" textAnchor="middle">
                          {zone.id} {zone.violation ? '⚠️' : ''}
                        </text>
                      </g>
                    );
                  }

                  if (coord.type === 'rect') {
                    return (
                      <g 
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect 
                          x={coord.x} y={coord.y} width={coord.w} height={coord.h} rx="8"
                          fill={isSelected ? 'rgba(0, 169, 197, 0.25)' : `${coord.color}22`}
                          stroke={isSelected ? '#00A9C5' : coord.color}
                          strokeWidth={isSelected ? 3 : (isHovered ? 2.5 : 1.5)}
                          strokeDasharray={zone.status === 'Maintenance' ? "6 3" : "none"}
                        />

                        {/* Label Badge */}
                        <rect 
                          x={coord.x + 8} y={coord.y + 8} width="58" height="20" rx="4"
                          fill="#0F172A" stroke={coord.color} strokeWidth="1"
                        />
                        <text x={coord.x + 37} y={coord.y + 22} fill="white" fontSize="9.5" fontWeight="800" textAnchor="middle">
                          {zone.id}
                        </text>
                        <text x={coord.x + 72} y={coord.y + 22} fill={coord.color} fontSize="9" fontWeight="700">
                          {zone.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  }

                  if (coord.type === 'polygon') {
                    return (
                      <g 
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <polygon 
                          points={coord.points}
                          fill={isSelected ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)'}
                          stroke={isSelected ? '#FBBF24' : '#F59E0B'}
                          strokeWidth={isSelected ? 3 : 1.8}
                          strokeDasharray="5 3"
                        />
                        <rect x="180" y="350" width="56" height="20" rx="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
                        <text x="208" y="364" fill="white" fontSize="9.5" fontWeight="800" textAnchor="middle">{zone.id}</text>
                      </g>
                    );
                  }

                  return null;
                })}

                {/* Tower Crane TC-1 Realistic Vector Drawing & Slewing Jib */}
                {showMachinery && (
                  <g>
                    {/* Crane Base Mast */}
                    <rect x="404" y="214" width="12" height="12" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    {/* Crane Jib Boom Arm (Rotating vector at 42 deg) */}
                    <line x1="410" y1="220" x2="470" y2="160" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                    {/* Counter Jib */}
                    <line x1="410" y1="220" x2="385" y2="245" stroke="#94A3B8" strokeWidth="3.5" />
                    {/* Trolley Hook with suspended load symbol */}
                    <circle cx="452" cy="178" r="4.5" fill="#EF4444" stroke="white" strokeWidth="1.2" />
                    <text x="460" y="172" fill="#FCA5A5" fontSize="8" fontWeight="800">LOAD: 2.8T</text>
                  </g>
                )}

                {/* Excavator Vector Marker */}
                {showMachinery && (
                  <g transform="translate(230, 330)">
                    <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#F59E0B" stroke="#000" strokeWidth="0.8" />
                    <line x1="0" y1="0" x2="16" y2="12" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="16" cy="12" r="3" fill="#D97706" />
                    <text x="0" y="-8" fill="#FCD34D" fontSize="7.5" fontWeight="700" textAnchor="middle">CAT-340</text>
                  </g>
                )}

                {/* Forklift Marker */}
                {showMachinery && (
                  <g transform="translate(190, 195)">
                    <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#10B981" stroke="#000" strokeWidth="0.8" />
                    <line x1="6" y1="-4" x2="12" y2="-4" stroke="#E2E8F0" strokeWidth="1.5" />
                    <line x1="6" y1="4" x2="12" y2="4" stroke="#E2E8F0" strokeWidth="1.5" />
                    <text x="0" y="-8" fill="#6EE7B7" fontSize="7.5" fontWeight="700" textAnchor="middle">FL-02</text>
                  </g>
                )}

                {/* LIVE PERSONNEL RFID TAG MARKERS */}
                {showWorkers && liveWorkerMarkers.map((w) => {
                  const isHovered = hoveredWorker?.id === w.id;
                  return (
                    <g 
                      key={w.id}
                      onMouseEnter={() => setHoveredWorker(w)}
                      onMouseLeave={() => setHoveredWorker(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulse animation if in breach */}
                      {w.breach && (
                        <circle cx={w.x} cy={w.y} r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.8">
                          <animate attributeName="r" values="6;14;6" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Worker Dot */}
                      <circle 
                        cx={w.x} cy={w.y} r={isHovered ? 6.5 : 5} 
                        fill={w.breach ? '#EF4444' : w.color} 
                        stroke="white" strokeWidth="1.5" 
                      />

                      {/* Small worker tag code */}
                      <text 
                        x={w.x} y={w.y - 7} 
                        fill={w.breach ? '#FCA5A5' : '#E2E8F0'} 
                        fontSize="7.5" fontWeight="800" textAnchor="middle"
                      >
                        {w.tag}
                      </text>
                    </g>
                  );
                })}

                {/* North Arrow & Scale Bar (Bottom Right CAD element) */}
                <g transform="translate(760, 440)">
                  <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <polygon points="0,-11 -4,0 0,-2 4,0" fill="#EF4444" />
                  <polygon points="0,11 -4,0 0,2 4,0" fill="#94A3B8" />
                  <text x="0" y="-13" fill="#EF4444" fontSize="8" fontWeight="900" textAnchor="middle">N</text>
                </g>

                {/* Scale reference */}
                <g transform="translate(680, 455)">
                  <line x1="0" y1="0" x2="60" y2="0" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#94A3B8" strokeWidth="1.5" />
                  <line x1="60" y1="-3" x2="60" y2="3" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="30" y="-4" fill="#94A3B8" fontSize="8" fontWeight="600" textAnchor="middle">30 METERS</text>
                </g>
              </motion.svg>

              {/* Hover Tooltip for Worker */}
              <AnimatePresence>
                {hoveredWorker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      top: 60,
                      left: 20,
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${hoveredWorker.breach ? '#EF4444' : '#00A9C5'}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: 11,
                      zIndex: 30,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: hoveredWorker.breach ? '#EF4444' : '#00A9C5' }}>
                      {hoveredWorker.tag} — {hoveredWorker.name}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: 10 }}>Trade: {hoveredWorker.trade} • Zone: {hoveredWorker.zone}</div>
                    {hoveredWorker.breach && (
                      <div style={{ color: '#FCA5A5', fontWeight: 700, marginTop: 4 }}>
                        ⚠️ UNAUTHORIZED INTRUSION DETECTED
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom-Left Map Zone Key / Legend */}
              <div style={{ 
                position: 'absolute', bottom: 12, left: 12, zIndex: 10, 
                background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(8px)', 
                padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 6 
              }}>
                <h4 style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Spatial Legend</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#E2E8F0' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239, 68, 68, 0.3)', border: '1.5px solid #EF4444' }} /> Drop / Critical Zone
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#E2E8F0' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(245, 158, 11, 0.3)', border: '1.5px solid #F59E0B' }} /> Shoring / High Risk
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#E2E8F0' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(0, 169, 197, 0.3)', border: '1.5px solid #00A9C5' }} /> Active Work Deck
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#E2E8F0' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(16, 185, 129, 0.3)', border: '1.5px solid #10B981' }} /> Logistics & Staging
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DOCKED ZONE TELEMETRY INSPECTOR (Selected Zone Details) */}
          <div style={{ 
            height: 230, background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', 
            padding: '14px 18px', display: 'flex', gap: 20, overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            
            {/* Column 1: Zone Identity & Risk Status (30%) */}
            <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #F1F5F9', paddingRight: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                    background: selectedZone.violation ? '#FEE2E2' : '#EEF2FF',
                    color: selectedZone.violation ? '#DC2626' : '#4F46E5'
                  }}>
                    {selectedZone.id}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: selectedZone.violation ? '#DC2626' : '#64748B', textTransform: 'uppercase' }}>
                    {selectedZone.type}
                  </span>
                </div>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                  {selectedZone.name}
                </h2>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Elevation: <strong style={{ color: '#334155' }}>{selectedZone.elevation}</strong> • Area: <strong style={{ color: '#334155' }}>{selectedZone.area}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {selectedZone.violation ? (
                  <button 
                    onClick={() => handleEvacuateZone(selectedZone)}
                    style={{ 
                      flex: 1, padding: '7px 10px', background: '#DC2626', color: 'white', 
                      borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 11, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
                    }}
                  >
                    <Volume2 size={14} /> TRIGGER SIREN & EVACUATE
                  </button>
                ) : (
                  <button 
                    onClick={() => triggerToast(`Broadcasted standard safety notice to supervisor for ${selectedZone.id}.`)}
                    style={{ 
                      flex: 1, padding: '7px 10px', background: '#F1F5F9', color: '#334155', 
                      borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 600, fontSize: 11, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 
                    }}
                  >
                    <Bell size={13} /> Broadcast HSE Notice
                  </button>
                )}
                
                <button 
                  onClick={() => triggerToast(`Opening live 4K stream for ${selectedZone.cctv[0]}...`)}
                  style={{ padding: '7px 10px', background: '#EEF2FF', color: '#4F46E5', borderRadius: 8, border: '1px solid #C7D2FE', fontWeight: 600, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Camera size={13} /> CCTV Feed
                </button>
              </div>
            </div>

            {/* Column 2: Mandatory PPE & Environmental Telemetry (35%) */}
            <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', gap: 10, borderRight: '1px solid #F1F5F9', paddingRight: 16 }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                  Mandatory PPE Rules & Permits
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {selectedZone.ppeRequired.map((ppe, i) => (
                    <span key={i} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={11} color="#10B981" /> {ppe}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontWeight: 500 }}>
                  Active Permit: <strong style={{ color: '#4F46E5' }}>{selectedZone.ptw}</strong>
                </div>
              </div>

              {/* Environmental / Machine Telemetry */}
              <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                  Real-Time Sensor Feed
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 11, fontWeight: 600, color: '#1E293B' }}>
                  {Object.entries(selectedZone.envSensors).map(([k, val]) => (
                    <div key={k}>
                      <span style={{ color: '#64748B', textTransform: 'capitalize', fontWeight: 500 }}>{k}: </span>
                      <strong style={{ color: k.toLowerCase().includes('wind') || k.toLowerCase().includes('load') ? '#D97706' : '#1E293B' }}>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Active Personnel in this Zone (35%) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Active Personnel ({selectedZone.activePersonnel.length})
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: selectedZone.violation ? '#DC2626' : '#4F46E5' }}>
                  {selectedZone.personnel} / {selectedZone.limit === 0 ? 'No Entry' : `${selectedZone.limit} max`}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1 }}>
                {selectedZone.activePersonnel.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: 11, fontStyle: 'italic' }}>
                    No personnel currently inside this zone.
                  </div>
                ) : (
                  selectedZone.activePersonnel.map((person) => (
                    <div 
                      key={person.id}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '6px 10px', borderRadius: 8, 
                        background: person.ppeStatus === 'BREACH' ? '#FEF2F2' : '#F8FAFC',
                        border: `1px solid ${person.ppeStatus === 'BREACH' ? '#FECACA' : '#E2E8F0'}`
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{person.name}</span>
                          <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>({person.id})</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748B' }}>
                          {person.trade} • {person.sub} • Dwell: {person.dwell}
                        </div>
                      </div>

                      <span style={{ 
                        padding: '2px 6px', borderRadius: 4, fontSize: 9.5, fontWeight: 800,
                        background: person.ppeStatus === 'BREACH' ? '#EF4444' : (person.ppeStatus === 'WARNING' ? '#F59E0B' : '#DCFCE7'),
                        color: person.ppeStatus === 'BREACH' || person.ppeStatus === 'WARNING' ? 'white' : '#166534'
                      }}>
                        {person.ppeStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: Alert Rules Configuration */}
      <AnimatePresence>
        {showAlertRulesModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 540, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={18} color="#4F46E5" /> Geofence Alert & Dispatch Rules
                </h3>
                <button onClick={() => setShowAlertRulesModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Auto-Trigger Site Siren on Drop Zone Breach</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Sounds audio horn on Tower Crane 1 when workers enter without banksman.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>WhatsApp & MS Teams HSE Notification</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Dispatches photographic CCTV snapshot and RFID tag to Safety Officers.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Max Allowed Dwell Time in High-Risk Zones</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Triggers warning when unescorted personnel exceed 5 minutes.</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: 13 }}>5 Mins</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Auto-Lock Access Gates on Max Capacity</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Turnstiles refuse entry when zone occupancy hits 100%.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#4F46E5' }} />
                </div>
              </div>

              <div style={{ padding: '14px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  onClick={() => setShowAlertRulesModal(false)}
                  style={{ padding: '8px 16px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#334155' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { setShowAlertRulesModal(false); triggerToast('Geofence alert rules successfully saved and synced with site sensors.'); }}
                  style={{ padding: '8px 16px', background: '#4F46E5', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white' }}
                >
                  Save Rules
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Draw / Create New Zone */}
      <AnimatePresence>
        {showNewZoneModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={18} color="#4F46E5" /> Draw New Site Geofence
                </h3>
                <button onClick={() => setShowNewZoneModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateZone} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Zone Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. West Podium Rebar Bay" 
                    value={newZoneForm.name}
                    onChange={e => setNewZoneForm({ ...newZoneForm, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Zone Risk Type</label>
                    <select 
                      value={newZoneForm.type}
                      onChange={e => setNewZoneForm({ ...newZoneForm, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, background: 'white' }}
                    >
                      <option value="Critical Risk">Critical Risk (Exclusion)</option>
                      <option value="High Risk">High Risk (Permit Required)</option>
                      <option value="Active Work">Active Work Deck</option>
                      <option value="Logistics">Logistics & Storage</option>
                      <option value="Transit">Transit / Access</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Max Personnel Capacity</label>
                    <input 
                      type="number" 
                      placeholder="0 for No Entry"
                      value={newZoneForm.limit}
                      onChange={e => setNewZoneForm({ ...newZoneForm, limit: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Grid Coordinates & Level</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Grid C2-E4 • Level +0.00m" 
                    value={newZoneForm.gridRef}
                    onChange={e => setNewZoneForm({ ...newZoneForm, gridRef: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mandatory PPE (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={newZoneForm.ppeRequired}
                    onChange={e => setNewZoneForm({ ...newZoneForm, ppeRequired: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #F1F5F9' }}>
                  <button 
                    type="button"
                    onClick={() => setShowNewZoneModal(false)}
                    style={{ padding: '8px 16px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#334155' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ padding: '8px 18px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', color: 'white', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                  >
                    Create & Activate Zone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
