import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer2, Hand, ZoomIn, ZoomOut, Maximize2, Edit3, Layers, 
  MessageSquare, ArrowUpRight, ArrowDownRight, CheckCircle2, Ruler, 
  Eye, EyeOff, RotateCcw, Info, Sparkles, Tag, Check, Download, Plus, FileText, X
} from 'lucide-react';
import { Button, TabGroup, ProcessFlowStepper } from '../components/ui';

// Multi-Drawing Dataset with authentic UAE engineering drawings and AI feature-aligned coordinates
const floorPlansDataset = [
  {
    id: 'A-201',
    fileName: 'A-201_LEVEL-02_GA-PLAN.pdf',
    title: 'Ground & Level 01 Architectural GA Plan',
    project: 'Al Wasl Commercial High-Rise',
    scale: 'Scale 1:100',
    image: '/cad_blueprint_floorplan.jpg',
    detectionScore: 92,
    subtotal: '441,000.00',
    layers: [
      { key: 'column', color: '#4F46E5', label: 'COLUMN — 34 DETECTED' },
      { key: 'wall', color: '#059669', label: 'WALL — 412 M LINEAR' },
      { key: 'door', color: '#D97706', label: 'DOOR — 26 UNITS' },
      { key: 'window', color: '#00A9C5', label: 'WINDOW — 41 UNITS' },
      { key: 'mep', color: '#E11D48', label: 'MEP FIXTURE — 58 UNITS' }
    ],
    elements: [
      // Ground Floor Elements (Left Plan)
      { id: 'gf-col-1', plan: 'Ground Floor', type: 'column', name: 'Column C1 (500x500mm)', grid: 'Grid A-1', top: '45.0%', left: '27.0%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete with 8T25 rebar' },
      { id: 'gf-col-2', plan: 'Ground Floor', type: 'column', name: 'Column C2 (500x500mm)', grid: 'Grid A-2', top: '45.0%', left: '34.3%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete with 8T25 rebar' },
      { id: 'gf-col-3', plan: 'Ground Floor', type: 'column', name: 'Column C3 (500x500mm)', grid: 'Grid A-3', top: '45.0%', left: '40.2%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete with 8T25 rebar' },
      { id: 'gf-col-4', plan: 'Ground Floor', type: 'column', name: 'Column C4 (500x500mm)', grid: 'Grid B-1', top: '58.8%', left: '27.0%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete with 8T25 rebar' },
      { id: 'gf-col-5', plan: 'Ground Floor', type: 'column', name: 'Column C5 (500x500mm)', grid: 'Grid C-1', top: '69.5%', left: '27.0%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete with 8T25 rebar' },
      
      { id: 'gf-wall-1', plan: 'Ground Floor', type: 'wall', name: '200mm AAC Acoustic Partition (Office 2)', grid: 'Grid A1-A2', top: '46.5%', left: '27.8%', width: '6.6%', height: '9.5%', qty: '48 m²', rate: 165, spec: '200mm AAC Block, 4hr fire rated STC 52' },
      { id: 'gf-wall-2', plan: 'Ground Floor', type: 'wall', name: '200mm AAC Acoustic Partition (Restroom)', grid: 'Grid A2-A3', top: '46.5%', left: '35.0%', width: '6.8%', height: '9.5%', qty: '42 m²', rate: 165, spec: '200mm AAC Block, 4hr fire rated STC 52' },
      
      { id: 'gf-door-1', plan: 'Ground Floor', type: 'door', name: 'Door D-08 (Single Leaf 900mm)', grid: 'Office 2 Entry', top: '56.0%', left: '30.8%', width: '2.8%', height: '2.4%', qty: 1, rate: 1250, spec: 'Solid Core Timber Door 60min fire rated' },
      { id: 'gf-door-2', plan: 'Ground Floor', type: 'door', name: 'Door D-09 (Single Leaf 900mm)', grid: 'Restroom Entry', top: '56.0%', left: '37.8%', width: '2.8%', height: '2.4%', qty: 1, rate: 1250, spec: 'Solid Core Timber Door 60min fire rated' },
      { id: 'gf-door-3', plan: 'Ground Floor', type: 'door', name: 'Elevator Core Fire Door', grid: 'Lift Core', top: '59.2%', left: '37.5%', width: '3.6%', height: '4.8%', qty: 1, rate: 2400, spec: 'Hollow Metal Door 120min fire rated with panic hardware' },

      { id: 'gf-win-1', plan: 'Ground Floor', type: 'window', name: 'Curtain Wall Glazing Module', grid: 'Entrance Lobby', top: '69.0%', left: '34.2%', width: '6.8%', height: '2.4%', qty: '18 m²', rate: 2400, spec: 'Double Glazed Low-E 8mm+16Ar+8mm Aluminum Frame' },
      
      { id: 'gf-mep-1', plan: 'Ground Floor', type: 'mep', name: 'HVAC 4-Way Supply Diffuser 600x600', grid: 'Office 2 Ceiling', top: '48.5%', left: '30.2%', width: '2.5%', height: '2.5%', qty: 2, rate: 640, spec: 'Aluminum square diffuser with OBD damper' },
      { id: 'gf-mep-2', plan: 'Ground Floor', type: 'mep', name: 'HVAC 4-Way Supply Diffuser 600x600', grid: 'Restroom Ceiling', top: '48.5%', left: '37.2%', width: '2.5%', height: '2.5%', qty: 2, rate: 640, spec: 'Aluminum square diffuser with OBD damper' },

      // First Floor Elements (Right Plan)
      { id: 'ff-col-1', plan: 'First Floor', type: 'column', name: 'Column C10 (500x500mm)', grid: 'Grid A-1 (L1)', top: '45.0%', left: '54.2%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete' },
      { id: 'ff-col-2', plan: 'First Floor', type: 'column', name: 'Column C11 (500x500mm)', grid: 'Grid A-3 (L1)', top: '45.0%', left: '68.5%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete' },
      { id: 'ff-col-3', plan: 'First Floor', type: 'column', name: 'Column C12 (500x500mm)', grid: 'Grid C-1 (L1)', top: '69.5%', left: '54.2%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete' },
      { id: 'ff-col-4', plan: 'First Floor', type: 'column', name: 'Column C13 (500x500mm)', grid: 'Grid C-3 (L1)', top: '69.5%', left: '68.5%', width: '2.2%', height: '2.2%', qty: 1, rate: 1850, spec: 'Reinforced C40/50 Concrete' },

      { id: 'ff-wall-1', plan: 'First Floor', type: 'wall', name: 'Acoustic Partition (Apartment 1A)', grid: 'North Core', top: '46.8%', left: '54.8%', width: '6.4%', height: '7.0%', qty: '36 m²', rate: 165, spec: '100mm Soundstop Drywall' },
      { id: 'ff-wall-2', plan: 'First Floor', type: 'wall', name: 'Acoustic Partition (Apartment 1B)', grid: 'North Core East', top: '46.8%', left: '67.2%', width: '6.4%', height: '7.0%', qty: '36 m²', rate: 165, spec: '100mm Soundstop Drywall' },
      { id: 'ff-wall-3', plan: 'First Floor', type: 'wall', name: 'Gym / Fitness Facility Wall', grid: 'South West', top: '56.0%', left: '54.8%', width: '6.5%', height: '7.2%', qty: '44 m²', rate: 165, spec: '150mm Soundproof Blockwork' },

      { id: 'ff-win-1', plan: 'First Floor', type: 'window', name: 'North Balcony Glazed Balustrade', grid: 'North Terrace', top: '44.0%', left: '58.2%', width: '4.8%', height: '2.4%', qty: '12 m²', rate: 2400, spec: '12mm Tempered Laminated Glass' },
      { id: 'ff-win-2', plan: 'First Floor', type: 'window', name: 'South Balcony Glazed Balustrade', grid: 'South Terrace', top: '69.5%', left: '57.0%', width: '4.5%', height: '2.4%', qty: '12 m²', rate: 2400, spec: '12mm Tempered Laminated Glass' },
      { id: 'ff-win-3', plan: 'First Floor', type: 'window', name: 'South East Balcony Glazing', grid: 'South Terrace East', top: '69.5%', left: '68.8%', width: '4.5%', height: '2.4%', qty: '12 m²', rate: 2400, spec: '12mm Tempered Laminated Glass' },

      { id: 'ff-mep-1', plan: 'First Floor', type: 'mep', name: 'Central Staircase Fire Exhaust Vent', grid: 'Main Core', top: '47.8%', left: '61.8%', width: '4.6%', height: '9.6%', qty: 1, rate: 4500, spec: 'Smoke spill fan rated 300°C for 2 hours' },
    ],
    takeoffTable: [
      { el: '1. Concrete column C40', qty: 34, unit: 'nos', rate: '1,850', total: 62900, type: 'column' },
      { el: '2. Blockwork wall 200mm', qty: 412, unit: 'm2', rate: '165', total: 67980, type: 'wall' },
      { el: '3. Door type D1 / D2', qty: 26, unit: 'nos', rate: '1,250', total: 32500, type: 'door' },
      { el: '4. Window type W2 Low-E', qty: 41, unit: 'nos', rate: '2,400', total: 98400, type: 'window' },
      { el: '5. Suspended acoustic ceiling', qty: 980, unit: 'm2', rate: '145', total: 142100, type: 'wall' },
      { el: '6. MEP fixture set (HVAC/LED)', qty: 58, unit: 'nos', rate: '640', total: 37120, type: 'mep' }
    ]
  },
  {
    id: 'S-201',
    fileName: 'S-201_LEVEL-04_REBAR-PLAN.pdf',
    title: 'Level 04 Structural Framing & Rebar Schedule',
    project: 'Al Wasl Commercial High-Rise',
    scale: 'Scale 1:50',
    image: '/cad_structural_blueprint.jpg',
    detectionScore: 96,
    subtotal: '1,284,500.00',
    layers: [
      { key: 'column', color: '#4F46E5', label: 'COLUMNS & TIES — 48 NOS' },
      { key: 'wall', color: '#059669', label: 'SHEAR WALLS — 28 BOUNDARY' },
      { key: 'mep', color: '#E11D48', label: 'TRANSFER BEAMS — 18 ELEMENTS' },
      { key: 'window', color: '#00A9C5', label: 'REBAR MESH — 142 TONS' }
    ],
    elements: [
      // Exact Feature Mapping for Structural CAD Blueprint
      { id: 's-sched-1', plan: 'Structural Framing', type: 'mep', name: 'Typical Beam Schedules & Lap Matrix', grid: 'Top Header Schedule', top: '34.0%', left: '19.0%', width: '27.5%', height: '7.5%', qty: '18 Beams', rate: 4200, spec: 'Top 3T25, Bottom 3T20 with T10-150 stirrups' },
      { id: 's-col-detail', plan: 'Structural Framing', type: 'column', name: 'Column C1 Cross-Section Detail (500x500)', grid: 'Grid Detail', top: '35.2%', left: '48.0%', width: '6.4%', height: '14.2%', qty: '48 Nos', rate: 5800, spec: '8T25 Fe500D with T12 confinement links @ 100mm' },
      { id: 's-beam-detail', plan: 'Structural Framing', type: 'mep', name: 'Beam B201 Cross-Section Detail', grid: 'Grid Detail', top: '36.0%', left: '55.8%', width: '5.2%', height: '13.5%', qty: '18 Nos', rate: 8400, spec: '6T25 Top, 4T25 Bottom, 2-legged T10 @ 100mm' },
      { id: 's-lap-detail', plan: 'Structural Framing', type: 'window', name: 'Typical Rebar Lap & Junction Details', grid: 'Detail Section', top: '54.5%', left: '47.8%', width: '13.4%', height: '16.0%', qty: '142 Tons', rate: 3850, spec: 'Development Length Ld = 50Ø, Hook Length = 12Ø' },
      
      // Framing Plan Columns C1 (Grids 1-6 / A-C)
      { id: 's-col-g1a', plan: 'Framing Plan', type: 'column', name: 'Column C1 (Grid 1-A)', grid: 'Grid 1-A', top: '47.5%', left: '22.8%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },
      { id: 's-col-g2a', plan: 'Framing Plan', type: 'column', name: 'Column C2 (Grid 2-A)', grid: 'Grid 2-A', top: '47.5%', left: '27.4%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },
      { id: 's-col-g3a', plan: 'Framing Plan', type: 'column', name: 'Column C1 (Grid 3-A)', grid: 'Grid 3-A', top: '47.5%', left: '31.8%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },
      { id: 's-col-g4a', plan: 'Framing Plan', type: 'column', name: 'Column C2 (Grid 4-A)', grid: 'Grid 4-A', top: '47.5%', left: '36.2%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },
      { id: 's-col-g5a', plan: 'Framing Plan', type: 'column', name: 'Column C1 (Grid 5-A)', grid: 'Grid 5-A', top: '47.5%', left: '40.6%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },
      { id: 's-col-g6a', plan: 'Framing Plan', type: 'column', name: 'Column C1 (Grid 6-A)', grid: 'Grid 6-A', top: '47.5%', left: '43.8%', width: '1.5%', height: '1.5%', qty: 1, rate: 1850, spec: 'C50/60 Concrete with 8T25' },

      // Structural Slab & Core Wall Elements
      { id: 's-slab-101', plan: 'Framing Plan', type: 'window', name: 'Two-Way Slab Panel S101 (200mm)', grid: 'Grid 1-2 / A-B', top: '47.8%', left: '23.0%', width: '4.5%', height: '6.2%', qty: '58.5 m²', rate: 380, spec: '200mm RC Slab with T12-150 B1 & B2 mesh' },
      { id: 's-sw-core', plan: 'Framing Plan', type: 'wall', name: 'Shear Wall SW-01 & Stair Core', grid: 'Grid 3-4 / A-B', top: '47.8%', left: '36.0%', width: '4.5%', height: '12.5%', qty: '28 sets', rate: 2100, spec: '300mm RC Core Wall with double layer T16-150' },
    ],
    takeoffTable: [
      { el: '1. High-Yield Rebar Fe500D (T25)', qty: 86, unit: 'tons', rate: '3,850', total: 331100, type: 'window' },
      { el: '2. High-Yield Rebar Fe500D (T20/T16)', qty: 56, unit: 'tons', rate: '3,750', total: 210000, type: 'window' },
      { el: '3. Structural Concrete C50/60 Post-Tension', qty: 640, unit: 'm3', rate: '480', total: 307200, type: 'column' },
      { el: '4. Shear Wall Confinement Links (T10)', qty: 28, unit: 'sets', rate: '2,100', total: 58800, type: 'wall' },
      { el: '5. Heavy Transfer Beam Formwork', qty: 780, unit: 'm2', rate: '290', total: 226200, type: 'mep' },
      { el: '6. Ultrasonic Weld NDT Inspections', qty: 48, unit: 'tests', rate: '3,150', total: 151200, type: 'column' }
    ]
  },
  {
    id: 'M-301',
    fileName: 'M-301_LEVEL-02_HVAC-LAYOUT.pdf',
    title: 'Level 02 HVAC Ducting & Mechanical Layout',
    project: 'Al Wasl Commercial High-Rise',
    scale: 'Scale 1:100',
    image: '/cad_blueprint_floorplan.jpg',
    detectionScore: 89,
    subtotal: '612,400.00',
    layers: [
      { key: 'mep', color: '#E11D48', label: 'VAV BOXES — 84 UNITS' },
      { key: 'wall', color: '#059669', label: 'GI DUCTWORK — 140 M' },
      { key: 'door', color: '#D97706', label: 'CHW FAN COILS — 68 UNITS' }
    ],
    elements: [
      { id: 'm-vav-1', plan: 'HVAC Layout', type: 'mep', name: 'Pressure Independent VAV Terminal Box', grid: 'Zone 1 North', top: '46.5%', left: '27.8%', width: '6.6%', height: '9.5%', qty: 6, rate: 2200, spec: 'DDC Controller with electric reheat coil' },
      { id: 'm-duct-1', plan: 'HVAC Layout', type: 'wall', name: 'Primary Supply Air Duct (800x400mm)', grid: 'Main Corridor', top: '56.0%', left: '30.8%', width: '12.0%', height: '3.0%', qty: '140 m', rate: 420, spec: 'Galvanized steel Class B with 50mm acoustic liner' },
    ],
    takeoffTable: [
      { el: '1. VAV Terminal Units with DDC', qty: 84, unit: 'nos', rate: '2,200', total: 184800, type: 'mep' },
      { el: '2. Galvanized Sheet Metal Ductwork', qty: 140, unit: 'm', rate: '420', total: 58800, type: 'wall' },
      { el: '3. Chilled Water 4-Pipe FCUs', qty: 68, unit: 'nos', rate: '3,800', total: 258400, type: 'door' },
      { el: '4. Motorized Fire & Smoke Dampers', qty: 32, unit: 'nos', rate: '1,450', total: 46400, type: 'mep' },
      { el: '5. Linear Slot Diffusers 3-Slot', qty: 110, unit: 'nos', rate: '580', total: 63800, type: 'window' }
    ]
  },
  {
    id: 'A-102',
    fileName: 'A-102_SUBSTRUCTURE_PILES-PLAN.pdf',
    title: 'Substructure Basement & Foundation Piling Layout',
    project: 'Al Wasl Commercial High-Rise',
    scale: 'Scale 1:200',
    image: '/cad_structural_blueprint.jpg',
    detectionScore: 98,
    subtotal: '2,190,000.00',
    layers: [
      { key: 'column', color: '#4F46E5', label: 'CAST PILES — 120 NOS' },
      { key: 'wall', color: '#059669', label: 'WATERPROOFING — 850 M²' },
      { key: 'mep', color: '#E11D48', label: 'RAFT CONCRETE — 1,450 M³' }
    ],
    elements: [
      { id: 'p-1', plan: 'Piling Schedule', type: 'column', name: 'Bored Cast-in-Place Pile Ø1000mm', grid: 'Tower Core Pit', top: '47.5%', left: '22.8%', width: '22.0%', height: '20.0%', qty: 120, rate: 8500, spec: 'Depth 28m into limestone bedrock, C40/50 microsilica' },
    ],
    takeoffTable: [
      { el: '1. Bored Cast-in-Place Piles Ø1000mm', qty: 120, unit: 'nos', rate: '8,500', total: 1020000, type: 'column' },
      { el: '2. Heavy Duty Waterproofing Membrane', qty: 850, unit: 'm2', rate: '220', total: 187000, type: 'wall' },
      { el: '3. Raft Concrete C40/50 Marine Grade', qty: 1450, unit: 'm3', rate: '440', total: 638000, type: 'mep' },
      { el: '4. Sonic Logging Integrity Testing', qty: 120, unit: 'tests', rate: '1,450', total: 174000, type: 'column' },
      { el: '5. Cathodic Protection Sacrificial Anodes', qty: 85, unit: 'sets', rate: '2,010', total: 170850, type: 'window' }
    ]
  }
];

export const DrawingScanner = () => {
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const currentPlan = floorPlansDataset[activePlanIndex];

  const [zoom, setZoom] = useState(70);
  const [activeTab, setActiveTab] = useState('summary');
  const [detectionProgress, setDetectionProgress] = useState(currentPlan.detectionScore);
  const [activeTool, setActiveTool] = useState('select');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    column: true, wall: true, door: true, window: true, mep: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Smooth detection progress animation when switching plans
  useEffect(() => {
    setDetectionProgress(0);
    let startTimestamp = null;
    const duration = 600;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDetectionProgress(Math.floor(easeProgress * currentPlan.detectionScore));

      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    setSelectedElement(null);
  }, [activePlanIndex]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleExport = () => {
    setIsExporting(true);
    triggerToast(`Exporting BOQ for ${currentPlan.id}...`);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`BOQ-${currentPlan.id}-Rev04.xlsx downloaded`);
    }, 1600);
  };

  const handlePush = () => {
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      triggerToast(`Successfully pushed ${currentPlan.id} takeoff to Oracle Aconex ERP`);
    }, 1400);
  };

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const AnimatedNumber = ({ value }) => {
    const [displayVal, setDisplayVal] = useState(0);
    useEffect(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 500, 1);
        setDisplayVal(Math.floor(p * value));
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }, [value]);
    return <span>{displayVal.toLocaleString()}</span>;
  };

  const layerColors = {
    column: { border: '#4F46E5', fill: 'rgba(79, 70, 229, 0.25)', glow: 'rgba(79, 70, 229, 0.6)' },
    wall: { border: '#059669', fill: 'rgba(5, 150, 105, 0.25)', glow: 'rgba(5, 150, 105, 0.6)' },
    door: { border: '#D97706', fill: 'rgba(217, 119, 6, 0.28)', glow: 'rgba(217, 119, 6, 0.6)' },
    window: { border: '#00A9C5', fill: 'rgba(0, 169, 197, 0.25)', glow: 'rgba(0, 169, 197, 0.6)' },
    mep: { border: '#E11D48', fill: 'rgba(225, 29, 72, 0.25)', glow: 'rgba(225, 29, 72, 0.6)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', padding: '16px 20px', background: '#F8FAFC', boxSizing: 'border-box' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            style={{
              position: 'fixed', top: 80, right: 24, zIndex: 100,
              background: 'white', padding: '12px 20px', borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #CBD5E1',
              display: 'flex', alignItems: 'center', gap: 12
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#081E3C' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ProcessFlowStepper 
        steps={['Drawing Ingestion', 'Element Detection', 'Quantity Calc', 'Rate Mapping', 'BOQ + Export']} 
        currentStepIndex={4} 
      />

      <div style={{ display: 'flex', gap: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* Panel A: Interactive CAD Drawing Canvas (Takes remaining flexible space) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            {/* Multiple Floor Plans Tab Bar */}
            <div style={{ padding: '6px 12px 0 12px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#F1F5F9', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                {floorPlansDataset.map((plan, idx) => {
                  const isActive = activePlanIndex === idx;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setActivePlanIndex(idx)}
                      style={{
                        padding: '8px 12px',
                        background: isActive ? 'white' : 'transparent',
                        color: isActive ? '#004753' : '#64748B',
                        borderRadius: '8px 8px 0 0',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: 11.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        border: isActive ? '1px solid #E2E8F0' : 'none',
                        borderBottom: isActive ? '2px solid #004753' : 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s'
                      }}
                    >
                      <FileText size={12} color={isActive ? '#00A9C5' : '#94A3B8'} />
                      {plan.fileName}
                    </button>
                  );
                })}
              </div>

              <div style={{ paddingBottom: 6, fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>
                WCS Metric Coordinates
              </div>
            </div>

            {/* Interactive Toolbar Row */}
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button 
                  onClick={() => setActiveTool('select')}
                  title="Select & Inspect Element"
                  style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: activeTool === 'select' ? 'rgba(0, 71, 83, 0.12)' : 'transparent', color: activeTool === 'select' ? '#004753' : '#64748B', cursor: 'pointer' }}
                >
                  <MousePointer2 size={16} />
                </button>
                <button 
                  onClick={() => setActiveTool('pan')}
                  title="Pan Viewport"
                  style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: activeTool === 'pan' ? 'rgba(0, 71, 83, 0.12)' : 'transparent', color: activeTool === 'pan' ? '#004753' : '#64748B', cursor: 'pointer' }}
                >
                  <Hand size={16} />
                </button>
                <button 
                  onClick={() => setActiveTool('measure')}
                  title="Measure Distance Caliper"
                  style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: activeTool === 'measure' ? 'rgba(0, 71, 83, 0.12)' : 'transparent', color: activeTool === 'measure' ? '#004753' : '#64748B', cursor: 'pointer' }}
                >
                  <Ruler size={16} />
                </button>
                <div style={{ width: 1, height: 18, background: '#E2E8F0', margin: '0 4px' }} />
                <button onClick={() => setZoom(100)} title="Fit to Screen" style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer' }}>
                  <Maximize2 size={16} />
                </button>
                <button onClick={() => setZoom(70)} title="Reset Viewport" style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer' }}>
                  <RotateCcw size={15} />
                </button>
              </div>
              
              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '3px 6px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
                <button onClick={() => setZoom(Math.max(40, zoom - 10))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}><ZoomOut size={14} /></button>
                <span style={{ width: 38, textAlign: 'center', fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{zoom}%</span>
                <button onClick={() => setZoom(Math.min(150, zoom + 10))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}><ZoomIn size={14} /></button>
              </div>

              {/* AI Detection Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 200 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', whiteSpace: 'nowrap' }}>
                  Detection {detectionProgress}% complete
                </span>
                <div style={{ flex: 1, height: 5, background: 'rgba(0, 71, 83, 0.12)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    style={{ height: '100%', background: '#004753', width: `${detectionProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Drawing Canvas Area */}
            <div 
              style={{ 
                flex: 1, 
                position: 'relative', 
                overflow: 'auto', 
                background: '#0B132B', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 20,
                cursor: activeTool === 'pan' ? 'grab' : activeTool === 'measure' ? 'crosshair' : 'default'
              }}
            >
              {/* Interactive Layer Filter Pills (Floating Top Legend) */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, background: 'rgba(8, 30, 60, 0.90)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 20 }}>
                {currentPlan.layers.map(item => (
                  <button
                    key={item.key} 
                    onClick={() => toggleLayer(item.key)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', 
                      background: 'none', border: 'none', padding: '2px 4px',
                      opacity: activeLayers[item.key] ? 1 : 0.35, 
                      transition: 'opacity 0.15s' 
                    }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Realistic CAD Blueprint Container */}
              <motion.div 
                key={currentPlan.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  width: 780, 
                  height: 470, 
                  position: 'relative',
                  transform: `scale(${zoom / 100})`, 
                  transformOrigin: 'center center',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#041B2D',
                  border: '2px solid #00A9C5'
                }}
              >
                {/* Real CAD Blueprint Image */}
                <img 
                  src={currentPlan.image}
                  alt={currentPlan.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    pointerEvents: 'none'
                  }}
                />

                {/* Accurate AI Detection Bounding Boxes */}
                {currentPlan.elements.map((el) => {
                  if (!activeLayers[el.type]) return null;
                  const isHovered = hoveredElement?.id === el.id;
                  const isSelected = selectedElement?.id === el.id;
                  const colors = layerColors[el.type] || layerColors.column;

                  return (
                    <motion.div
                      key={el.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement(el);
                      }}
                      onMouseEnter={() => setHoveredElement(el)}
                      onMouseLeave={() => setHoveredElement(null)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: el.top,
                        left: el.left,
                        width: el.width,
                        height: el.height,
                        border: `2px solid ${colors.border}`,
                        background: colors.fill,
                        cursor: 'pointer',
                        zIndex: isSelected ? 15 : isHovered ? 14 : 10,
                        boxShadow: isSelected || isHovered ? `0 0 14px ${colors.glow}` : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      {/* Bounding Box Corner Reticles */}
                      <span style={{ position: 'absolute', top: -3, left: -3, width: 4, height: 4, background: colors.border, borderRadius: 1 }} />
                      <span style={{ position: 'absolute', top: -3, right: -3, width: 4, height: 4, background: colors.border, borderRadius: 1 }} />
                      <span style={{ position: 'absolute', bottom: -3, left: -3, width: 4, height: 4, background: colors.border, borderRadius: 1 }} />
                      <span style={{ position: 'absolute', bottom: -3, right: -3, width: 4, height: 4, background: colors.border, borderRadius: 1 }} />
                    </motion.div>
                  );
                })}

                {/* Interactive Inspection Tooltip on Hover */}
                {hoveredElement && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: `calc(${hoveredElement.top} - 64px)`,
                      left: hoveredElement.left,
                      background: 'rgba(8, 30, 60, 0.96)',
                      color: 'white',
                      padding: '7px 11px',
                      borderRadius: 8,
                      fontSize: 10.5,
                      zIndex: 30,
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(0, 169, 197, 0.4)'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#00A9C5' }}>{hoveredElement.name}</div>
                    <div style={{ color: '#CBD5E1', fontSize: 9.5 }}>{hoveredElement.plan} • {hoveredElement.grid} • Unit Rate: AED {hoveredElement.rate?.toLocaleString()}</div>
                    <div style={{ color: '#94A3B8', fontSize: 9 }}>{hoveredElement.spec}</div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Bottom Status Ribbon */}
            <div style={{ padding: '7px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11.5, color: '#004753', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} color="#00A9C5" /> 
                {selectedElement ? `Selected: ${selectedElement.name} (${selectedElement.grid})` : 'Click any CAD element or bounding box to cross-inspect Takeoff rates'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                {currentPlan.scale} • {currentPlan.project}
              </div>
            </div>

          </div>
        </div>

        {/* Panel B: Quantity Take-Off & Cost Estimator (Fixed Width to prevent cutting off) */}
        <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', padding: '18px 20px', gap: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 14.5, fontWeight: 900, color: '#081E3C' }}>
                QUANTITY TAKE-OFF & ESTIMATION
              </h3>
              <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>
                Automated geometric volume calculation & UAE unit rate mapping
              </p>
            </div>
            
            <TabGroup 
              tabs={[
                { id: 'summary', label: 'Summary' },
                { id: 'category', label: 'By Category' },
                { id: 'level', label: 'By Level' }
              ]} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />

            {/* Takeoff Table */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '8px 10px' }}>Element</th>
                    <th style={{ padding: '8px 6px' }}>Qty</th>
                    <th style={{ padding: '8px 6px' }}>Unit</th>
                    <th style={{ padding: '8px 6px' }}>Rate (AED)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlan.takeoffTable.map((row, i) => {
                    const isSelected = selectedElement && selectedElement.type === row.type;

                    return (
                      <tr 
                        key={i} 
                        style={{ 
                          borderBottom: '1px solid #F1F5F9', 
                          background: isSelected ? 'rgba(0, 71, 83, 0.06)' : 'transparent',
                          transition: 'background 0.15s',
                          cursor: 'pointer'
                        }}
                        className="hover-bg-gray-50"
                      >
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: isSelected ? '#004753' : '#081E3C' }}>{row.el}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700 }}>{row.qty}</td>
                        <td style={{ padding: '8px 6px', color: '#64748B', fontSize: 11 }}>{row.unit}</td>
                        <td style={{ padding: '8px 6px', color: '#081E3C' }}>{row.rate}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#004753' }}>
                          <AnimatedNumber value={row.total} />
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1' }}>
                    <td colSpan={4} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>Subtotal AED</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: 14.5, fontWeight: 900, color: '#004753' }}>{currentPlan.subtotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Revision Variance Impact */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                REVISION COMPARISON — REV 03 → REV 04
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                  <span style={{ fontWeight: 600 }}>Walls & Partitions</span>
                </div>
                <span style={{ color: '#64748B' }}>+18 m²</span>
                <span style={{ color: '#059669', fontWeight: 800 }}>+AED 2,970</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} />
                  <span style={{ fontWeight: 600 }}>Door Openings</span>
                </div>
                <span style={{ color: '#64748B' }}>-2 units</span>
                <span style={{ color: '#DC2626', fontWeight: 800 }}>-AED 2,500</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F46E5' }} />
                  <span style={{ fontWeight: 600 }}>Reinforced Columns</span>
                </div>
                <span style={{ color: '#64748B' }}>+3 nos</span>
                <span style={{ color: '#059669', fontWeight: 800 }}>+AED 5,550</span>
              </div>

              <div style={{ background: '#FEF3C7', padding: '5px 8px', borderRadius: 6, fontSize: 11, color: '#92400E', fontWeight: 700, marginTop: 2 }}>
                Net BOQ impact: +AED 6,020 (+1.4%) — 3 changed elements flagged.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <Button 
                variant="primary" 
                style={{ flex: 1, background: 'var(--gradient-brand)', color: 'white', fontWeight: 800, fontSize: 12, padding: '9px 0', border: 'none', borderRadius: 8, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export BOQ to Excel'}
              </Button>
              <Button 
                variant="secondary" 
                style={{ flex: 1, background: 'white', border: '1px solid #CBD5E1', color: '#081E3C', fontWeight: 800, fontSize: 12, padding: '9px 0', borderRadius: 8 }}
                onClick={handlePush}
                disabled={isPushing}
              >
                {isPushing ? 'Pushing...' : 'Push to ERP'}
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
