import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, AlertTriangle, ArrowRight, FileSignature, Filter, Download, 
  Plus, Search, Eye, CheckCircle2, RefreshCw, Layers, Check, X, ShieldCheck, 
  Zap, ZoomIn, ZoomOut, RotateCcw, Maximize2, Tag, Info, ArrowUpRight
} from 'lucide-react';

const uaeRevisionLogs = [
  { 
    id: 'REV-001', 
    doc: 'A-101 Ground Floor Architectural Layout', 
    project: 'Al Wasl Commercial High-Rise',
    revFrom: 'Rev 02', 
    revTo: 'Rev 03', 
    date: '14 Aug 2026', 
    author: 'KEO BIM Team',
    image: '/cad_blueprint_floorplan.jpg',
    changes: { added: 14, removed: 4, modified: 8 }, 
    status: 'Approved',
    impact: 'BOQ Concrete +45 m³, Blockwork +23.1 m², Glazing -12 m²',
    boxes: [
      {
        id: 'box-1',
        type: 'added',
        tag: '+ Added Partition Wall [200mm AAC]',
        top: '17.2%',
        left: '11.2%',
        width: '12.5%',
        height: '22.8%',
        title: '200mm AAC Acoustic Partition Wall (Office 2 / Security)',
        desc: 'Constructed new 200mm Autoclaved Aerated Concrete partition for Security Ops & Server Room (Grid A-B / 1-2).',
        delta: '+23.1 m² blockwork (AED 2,194.50)',
        spec: '200mm AAC Block, 4hr fire rating, acoustic STC 52'
      },
      {
        id: 'box-2',
        type: 'modified',
        tag: '~ Door D-14 Shifted (+850mm E)',
        top: '49.0%',
        left: '28.8%',
        width: '5.8%',
        height: '8.8%',
        title: 'Fire Exit Core Door D-14 Relocation',
        desc: 'Shifted 120min fire-rated double door by 850mm eastward into elevator core vestibule to ensure mandatory 1800mm clear egress width.',
        delta: '0 Qty change (Wall opening adjusted)',
        spec: 'Hollow Metal Door 120min, Panic Hardware'
      },
      {
        id: 'box-3',
        type: 'added',
        tag: '+ Added Security Reception Pod',
        top: '67.0%',
        left: '24.8%',
        width: '8.8%',
        height: '9.2%',
        title: 'Central Entrance Reception Kiosk',
        desc: 'Integrated automated visitor registration desk and RFID speed-gate turnstile access barriers at main Ground Floor entrance.',
        delta: '1 EA Specialty Joinery Package',
        spec: 'Corian cladding, integrated biometric readers'
      },
      {
        id: 'box-4',
        type: 'removed',
        tag: '- Removed Storage Wall',
        top: '51.5%',
        left: '11.2%',
        width: '12.5%',
        height: '11.0%',
        title: 'Demolished Storage Partition',
        desc: 'Removed non-loadbearing 100mm gypsum wall to expand primary Executive Waiting Lounge area.',
        delta: '-14.5 m² Gypsum Drywall',
        spec: 'Demolition & plaster make-good'
      },
      {
        id: 'box-5',
        type: 'modified',
        tag: '~ Mullion Spacing (1200mm -> 1500mm)',
        top: '74.2%',
        left: '11.2%',
        width: '23.0%',
        height: '4.5%',
        title: 'South Facade Curtain Wall Mullions',
        desc: 'Widened unitized double-glazed panel modules from 1200mm to 1500mm spacing along South Facade entrance elevation.',
        delta: '-12 m² Aluminum Mullion profile',
        spec: 'Low-E Double Glazing, 8mm+16Ar+8mm'
      },
      {
        id: 'box-6',
        type: 'added',
        tag: '+ Balcony Drainage Outflow',
        top: '73.2%',
        left: '60.5%',
        width: '7.0%',
        height: '6.5%',
        title: 'First Floor Balcony Scupper & Drain',
        desc: 'Added 100mm PVC balcony rainwater drainage scupper on southern terrace facade.',
        delta: '+4 EA Drainage Outlets',
        spec: 'Heavy duty UPVC with stainless steel grating'
      }
    ],
    highlights: [
      'Relocated Fire Exit Core Door D-14 by 850mm eastward to satisfy UAE Fire Code egress clear width',
      'Added 200mm acoustic drywall partition for Security Operations Room (Grid A-B / 1-2)',
      'Integrated automated speed-gate turnstiles at main entrance lobby',
      'Adjusted perimeter curtain wall mullion module spacing to 1500mm'
    ]
  },
  { 
    id: 'REV-002', 
    doc: 'S-201 Level 04 Rebar Schedule & Beam Details', 
    project: 'Al Wasl Commercial High-Rise',
    revFrom: 'Rev 01', 
    revTo: 'Rev 02', 
    date: '12 Aug 2026', 
    author: 'Parsons Structural',
    image: '/cad_structural_blueprint.jpg',
    changes: { added: 8, removed: 0, modified: 14 }, 
    status: 'Pending Review',
    impact: 'High-Yield Rebar +18.5 Tons, Steel Grade Fe500D',
    boxes: [
      {
        id: 'sbox-1',
        type: 'added',
        tag: '+ Shear Wall SW-04 Extra T25',
        top: '47.5%',
        left: '42.0%',
        width: '9.5%',
        height: '16.0%',
        title: 'Shear Wall SW-04 Boundary Element',
        desc: 'Added 12x T25 high-yield bars in boundary zone for lateral seismic & wind overturning resistance.',
        delta: '+4.8 Tons Rebar Fe500D',
        spec: 'T25 @ 100mm c/c with T10 confinement links'
      },
      {
        id: 'sbox-2',
        type: 'modified',
        tag: '~ Beam B101 Top (4T20 -> 6T25)',
        top: '33.5%',
        left: '13.0%',
        width: '10.5%',
        height: '14.5%',
        title: 'Transfer Beam B101 Moment Capacity',
        desc: 'Upgraded negative moment reinforcement at column C1 connection under revised tower load envelope.',
        delta: '+2.4 Tons Rebar Fe500D',
        spec: '6T25 Top, 4T25 Bottom, Links T10 @ 100mm'
      },
      {
        id: 'sbox-3',
        type: 'modified',
        tag: '~ Column C1 Ties (T12 @ 100mm)',
        top: '9.5%',
        left: '68.5%',
        width: '12.5%',
        height: '24.5%',
        title: 'Column C1 Detail Confinement Ties',
        desc: 'Reduced tie link pitch from 150mm to 100mm within the plastic hinge zone for seismic confinement.',
        delta: '+0.9 Tons Rebar',
        spec: 'T12 Links @ 100mm c/c with cross-ties'
      },
      {
        id: 'sbox-4',
        type: 'modified',
        tag: '~ Beam B201 Cross-Section Detail',
        top: '9.5%',
        left: '84.0%',
        width: '12.5%',
        height: '26.0%',
        title: 'Beam B201 Cross-Section Rebar Layout',
        desc: 'Updated stirrup arrangement to double closed ties T10 @ 150mm for torsion resistance.',
        delta: '+1.1 Tons Rebar Fe500D',
        spec: '400x700mm RC Beam, Concrete f\'c=35MPa'
      }
    ],
    highlights: [
      'Reinforced Shear Wall SW-04 boundary elements with additional T25 bars',
      'Upgraded Beam B101 top reinforcement from 4T20 to 6T25 at joint C1',
      'Adjusted concrete cover specification from 40mm to 50mm for durability'
    ]
  },
  { 
    id: 'REV-003', 
    doc: 'M-301 Central HVAC Chilled Water Schematics', 
    project: 'Dubai Creek Harbour Towers',
    revFrom: 'Rev 00', 
    revTo: 'Rev 01', 
    date: '08 Aug 2026', 
    author: 'Emaar MEP Div',
    image: '/cad_blueprint_floorplan.jpg',
    changes: { added: 24, removed: 12, modified: 6 }, 
    status: 'Pending Review',
    impact: 'Ductwork +420 kg, 8 Extra VAV units, 12 Motorized Fire Dampers',
    boxes: [
      {
        id: 'mbox-1',
        type: 'added',
        tag: '+ 8 Motorized Smoke Dampers',
        top: '28.0%',
        left: '34.0%',
        width: '11.5%',
        height: '18.0%',
        title: 'Motorized Smoke Fire Dampers (MSFD)',
        desc: 'Installed addressable 24V motorized smoke dampers at 2-hour compartment wall penetrations.',
        delta: '+8 EA MSFD with thermal release',
        spec: 'UL 555S Class I Leakage, 250°F fusible link'
      },
      {
        id: 'mbox-2',
        type: 'modified',
        tag: '~ Primary Supply Duct Rerouted',
        top: '52.0%',
        left: '34.0%',
        width: '11.5%',
        height: '22.0%',
        title: 'Chilled Water Supply Main Rerouting',
        desc: 'Lowered primary 800x400mm supply air duct by 150mm to clear structural transfer beam soffit.',
        delta: '+85 kg GI Sheet Metal (1.2mm)',
        spec: 'Galvanized iron with 25mm fiberglass acoustic wrap'
      }
    ],
    highlights: [
      'Re-routed primary supply duct around structural transfer beam clash',
      'Added 8 motorized smoke dampers at critical fire compartment transitions',
      'Deleted redundant branch line in Basement plant room'
    ]
  },
  { 
    id: 'REV-004', 
    doc: 'C-105 Apron Heavy Aircraft Pavement Grading', 
    project: 'Al Maktoum Int Airport Logistics Park',
    revFrom: 'Rev 03', 
    revTo: 'Rev 04', 
    date: '02 Aug 2026', 
    author: 'DAEP Civil Works',
    image: '/cad_structural_blueprint.jpg',
    changes: { added: 6, removed: 2, modified: 18 }, 
    status: 'Approved',
    impact: 'Crushed Aggregate Base +180 m³, PQC Concrete +95 m³',
    boxes: [
      {
        id: 'cbox-1',
        type: 'modified',
        tag: '~ Slope Adjusted (1.5% -> 1.2%)',
        top: '32.0%',
        left: '12.0%',
        width: '48.0%',
        height: '46.0%',
        title: 'Apron Pavement Cross-Fall Optimization',
        desc: 'Adjusted drainage slope to accommodate Code F wide-body aircraft wheel loads (A380 / B777X).',
        delta: '+180 m³ Crushed Road Base (300mm)',
        spec: 'Pavement Quality Concrete (PQC) 45 N/mm²'
      }
    ],
    highlights: [
      'Smoothed cross-fall slope from 1.5% to 1.2% for wide-body stands',
      'Adjusted stormwater slot drain positions along taxiway centerline'
    ]
  },
  { 
    id: 'REV-005', 
    doc: 'E-401 Substation High-Voltage Lighting Plan', 
    project: 'Zayed National Museum Extension',
    revFrom: 'Rev 00', 
    revTo: 'Rev 01', 
    date: '28 Jul 2026', 
    author: 'Foster + Partners',
    image: '/cad_blueprint_floorplan.jpg',
    changes: { added: 4, removed: 1, modified: 7 }, 
    status: 'Approved',
    impact: 'Cable Tray length +65 LM, 14 Emergency Luminaires',
    boxes: [
      {
        id: 'ebox-1',
        type: 'added',
        tag: '+ 65 LM Heavy Duty Cable Tray',
        top: '17.0%',
        left: '58.0%',
        width: '34.0%',
        height: '24.0%',
        title: 'High-Voltage Containment Tray',
        desc: 'Added 300x50mm hot-dip galvanized perforated cable tray for museum gallery power feeds.',
        delta: '+65 LM GI Cable Tray & brackets',
        spec: 'Hot-Dip Galvanized BS EN 61537'
      }
    ],
    highlights: [
      'Updated emergency luminaire battery backup from 1hr to 3hr rating',
      'Added containment raceway for museum security sensors'
    ]
  }
];

export const DrawingRevisions = () => {
  const [revisionsList, setRevisionsList] = useState(uaeRevisionLogs);
  const [search, setSearch] = useState('');
  const [selectedRev, setSelectedRev] = useState(uaeRevisionLogs[0]);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Interactive Canvas State
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeLayers, setActiveLayers] = useState({ added: true, modified: true, removed: true, labels: true });
  const [hoveredBox, setHoveredBox] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);

  const filteredRevisions = revisionsList.filter(r => {
    const matchesSearch = r.doc.toLowerCase().includes(search.toLowerCase()) || 
                          r.project.toLowerCase().includes(search.toLowerCase()) ||
                          r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id) => {
    setRevisionsList(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setSelectedRev(prev => prev.id === id ? { ...prev, status: 'Approved' } : prev);
  };

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Revision Control & AI Visual Comparison
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Automated redline comparison, AI bounding box delta tracking, and version approval across drawing revisions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Initiating new automated revision comparison between CAD versions...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={14} /> Compare New Revisions
          </button>
        </div>
      </div>

      {/* Main Split Comparison View */}
      <div style={{ display: 'flex', gap: 18, flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Revision List */}
        <div style={{ flex: '0 0 360px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search revisions by sheet..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Pending Review', 'Approved'].map(st => (
                <button 
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{ 
                    padding: '3px 10px', borderRadius: 6, border: 'none', 
                    background: statusFilter === st ? 'var(--gradient-brand)' : '#E2E8F0', 
                    color: statusFilter === st ? 'white' : '#64748B', 
                    fontWeight: 700, fontSize: 11, cursor: 'pointer',
                    boxShadow: statusFilter === st ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredRevisions.map((rev) => {
              const isSelected = selectedRev?.id === rev.id;
              return (
                <div 
                  key={rev.id}
                  onClick={() => { setSelectedRev(rev); setSelectedBox(null); }}
                  style={{ 
                    padding: '14px 16px', 
                    borderBottom: '1px solid #F1F5F9', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s',
                    background: isSelected ? 'rgba(0, 169, 197, 0.06)' : 'white',
                    borderLeft: isSelected ? '4px solid #004753' : '4px solid transparent'
                  }}
                  className="hover-bg-gray-50"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>{rev.id}</span>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: 10, fontSize: 10.5, fontWeight: 800,
                      background: rev.status === 'Approved' ? '#ECFDF5' : '#FEF3C7',
                      color: rev.status === 'Approved' ? '#059669' : '#D97706'
                    }}>
                      {rev.status}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, color: '#081E3C', fontSize: 13, marginBottom: 4 }}>
                    {rev.doc}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 8 }}>
                    {rev.project}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <span style={{ padding: '2px 6px', background: '#E2E8F0', borderRadius: 4, fontWeight: 800, color: '#64748B' }}>{rev.revFrom}</span>
                      <ArrowRight size={12} color="#004753" />
                      <span style={{ padding: '2px 6px', background: 'rgba(0, 71, 83, 0.1)', color: '#004753', borderRadius: 4, fontWeight: 800 }}>{rev.revTo}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, fontSize: 11, fontWeight: 800 }}>
                      <span style={{ color: '#059669' }}>+{rev.changes.added}</span>
                      <span style={{ color: '#D97706' }}>~{rev.changes.modified}</span>
                      <span style={{ color: '#DC2626' }}>-{rev.changes.removed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Comparison Workspace */}
        <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          {selectedRev ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                      {selectedRev.doc}
                    </h3>
                    <span style={{ padding: '2px 8px', background: 'rgba(0, 71, 83, 0.1)', color: '#004753', borderRadius: 4, fontWeight: 800, fontSize: 11.5 }}>
                      {selectedRev.revFrom} → {selectedRev.revTo}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Author: <strong>{selectedRev.author}</strong> • Compared on {selectedRev.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedRev.status !== 'Approved' && (
                    <button 
                      onClick={() => handleApprove(selectedRev.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#059669', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                    >
                      <Check size={14} /> Approve & Update BOQ
                    </button>
                  )}
                  <button 
                    onClick={() => alert(`Exporting Redline Comparison PDF for ${selectedRev.doc}...`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', color: 'white', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                  >
                    <Download size={13} /> Export Diff
                  </button>
                </div>
              </div>

              {/* Quantities Impact & Delta Layer Filter Strip */}
              <div style={{ padding: '10px 20px', background: '#F0F9FF', borderBottom: '1px solid #BAE6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={15} color="#00A9C5" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0369A1' }}>
                    Takeoff Impact: {selectedRev.impact}
                  </span>
                </div>

                {/* Layer Visibility Toggles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 800 }}>
                  <button 
                    onClick={() => toggleLayer('added')}
                    style={{ 
                      padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: activeLayers.added ? '#059669' : '#E2E8F0',
                      color: activeLayers.added ? 'white' : '#64748B'
                    }}
                  >
                    ● Added ({selectedRev.changes.added})
                  </button>
                  <button 
                    onClick={() => toggleLayer('modified')}
                    style={{ 
                      padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: activeLayers.modified ? '#D97706' : '#E2E8F0',
                      color: activeLayers.modified ? 'white' : '#64748B'
                    }}
                  >
                    ● Modified ({selectedRev.changes.modified})
                  </button>
                  <button 
                    onClick={() => toggleLayer('removed')}
                    style={{ 
                      padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: activeLayers.removed ? '#DC2626' : '#E2E8F0',
                      color: activeLayers.removed ? 'white' : '#64748B'
                    }}
                  >
                    ● Deleted ({selectedRev.changes.removed})
                  </button>
                </div>
              </div>

              {/* Redline CAD View with Pixel-Accurate Image-Locked Coordinates */}
              <div style={{ flex: 1, padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                
                {/* Outer Viewport Box */}
                <div style={{ 
                  height: 420, 
                  minHeight: 420, 
                  background: '#040d1a', 
                  borderRadius: 12, 
                  position: 'relative', 
                  overflow: 'hidden', 
                  border: '1.5px solid #004753',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>

                  {/* Zoom Controls Overlay */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, background: 'rgba(8, 30, 60, 0.85)', backdropFilter: 'blur(4px)', padding: 4, borderRadius: 8, border: '1px solid rgba(0, 169, 197, 0.3)', zIndex: 25 }}>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(prev + 15, 160))}
                      style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: '#00A9C5', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(prev - 15, 75))}
                      style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: '#00A9C5', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <button 
                      onClick={() => setZoomLevel(100)}
                      style={{ padding: '4px 8px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 11 }}
                      title="Reset Zoom"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>

                  {/* 16:9 Aspect-Ratio Locked Container: Boxes lock precisely to the blueprint image */}
                  <div style={{ 
                    position: 'relative', 
                    height: '100%', 
                    aspectRatio: '16 / 9', 
                    maxWidth: '100%',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    
                    {/* The Blueprint Image */}
                    <img 
                      src={selectedRev.image} 
                      alt="CAD Blueprint Layout"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        display: 'block',
                        opacity: 0.92,
                        filter: 'contrast(1.1) brightness(0.95)'
                      }} 
                    />

                    {/* AI Detection Bounding Boxes Overlay (Locked to Image Coordinates) */}
                    {selectedRev.boxes.map((box) => {
                      if (box.type === 'added' && !activeLayers.added) return null;
                      if (box.type === 'modified' && !activeLayers.modified) return null;
                      if (box.type === 'removed' && !activeLayers.removed) return null;

                      const isHovered = hoveredBox?.id === box.id;
                      const isSelected = selectedBox?.id === box.id;

                      const borderColor = box.type === 'added' ? '#10B981' : box.type === 'modified' ? '#F59E0B' : '#EF4444';
                      const bgColor = box.type === 'added' ? 'rgba(16, 185, 129, 0.22)' : box.type === 'modified' ? 'rgba(245, 158, 11, 0.22)' : 'rgba(239, 68, 68, 0.22)';
                      const tagBg = box.type === 'added' ? '#059669' : box.type === 'modified' ? '#D97706' : '#DC2626';

                      return (
                        <motion.div
                          key={box.id}
                          onClick={() => setSelectedBox(box)}
                          onMouseEnter={() => setHoveredBox(box)}
                          onMouseLeave={() => setHoveredBox(null)}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            scale: isHovered || isSelected ? 1.02 : 1,
                            boxShadow: isHovered || isSelected ? `0 0 22px ${borderColor}` : `0 0 8px ${borderColor}88`
                          }}
                          style={{
                            position: 'absolute',
                            top: box.top,
                            left: box.left,
                            width: box.width,
                            height: box.height,
                            border: `2px ${box.type === 'removed' ? 'dashed' : 'solid'} ${borderColor}`,
                            borderRadius: 4,
                            background: bgColor,
                            cursor: 'pointer',
                            zIndex: isHovered || isSelected ? 20 : 10,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {/* Detection Tag Badge */}
                          <div style={{
                            position: 'absolute',
                            top: -11,
                            left: 4,
                            background: tagBg,
                            color: 'white',
                            padding: '1px 6px',
                            borderRadius: 3,
                            fontSize: 9.5,
                            fontWeight: 900,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            letterSpacing: '0.01em'
                          }}>
                            {box.tag}
                          </div>

                          {/* Corner Precision CAD Crosshairs */}
                          <span style={{ position: 'absolute', top: -2, left: -2, width: 5, height: 5, borderLeft: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }} />
                          <span style={{ position: 'absolute', top: -2, right: -2, width: 5, height: 5, borderRight: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }} />
                          <span style={{ position: 'absolute', bottom: -2, left: -2, width: 5, height: 5, borderLeft: `2px solid ${borderColor}`, borderBottom: `2px solid ${borderColor}` }} />
                          <span style={{ position: 'absolute', bottom: -2, right: -2, width: 5, height: 5, borderRight: `2px solid ${borderColor}`, borderBottom: `2px solid ${borderColor}` }} />
                        </motion.div>
                      );
                    })}

                  </div>

                  {/* Dynamic Floating Tooltip */}
                  <AnimatePresence>
                    {(hoveredBox || selectedBox) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          left: 16,
                          right: 16,
                          background: 'rgba(8, 30, 60, 0.95)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 8,
                          border: `1.5px solid ${(hoveredBox || selectedBox).type === 'added' ? '#10B981' : (hoveredBox || selectedBox).type === 'modified' ? '#F59E0B' : '#EF4444'}`,
                          padding: '10px 14px',
                          zIndex: 30,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ 
                              fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4, color: 'white',
                              background: (hoveredBox || selectedBox).type === 'added' ? '#059669' : (hoveredBox || selectedBox).type === 'modified' ? '#D97706' : '#DC2626'
                            }}>
                              {(hoveredBox || selectedBox).type.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 12.5, fontWeight: 900, color: 'white' }}>
                              {(hoveredBox || selectedBox).title}
                            </span>
                          </div>
                          <p style={{ margin: '3px 0 0 0', fontSize: 11.5, color: '#CBD5E1' }}>
                            {(hoveredBox || selectedBox).desc}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 14, marginLeft: 14 }}>
                          <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOQ Delta</div>
                          <div style={{ fontSize: 12, fontWeight: 900, color: '#00A9C5', marginTop: 1 }}>
                            {(hoveredBox || selectedBox).delta}
                          </div>
                          <div style={{ fontSize: 10, color: '#A0AEC0', marginTop: 1 }}>
                            {(hoveredBox || selectedBox).spec}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Detected Modification Callouts List */}
                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: 12.5, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Info size={14} color="#004753" /> AI Detected Blueprint Modification Callouts
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {selectedRev.highlights.map((h, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#081E3C', fontWeight: 600 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00A9C5', flexShrink: 0 }} />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a revision from the left to view visual delta
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
