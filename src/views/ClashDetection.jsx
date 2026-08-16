import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer2, Hand, ZoomIn, ZoomOut, Maximize2, Minimize2, EyeOff, Eye, Ruler, 
  ChevronDown, CheckCircle2, ChevronRight, Box as BoxIcon, Download, 
  Share2, AlertTriangle, Layers, Info, Filter, RefreshCw, X, UserCheck
} from 'lucide-react';
import { Button } from '../components/ui';
import { BimClashViewer } from '../components/bim/BimClashViewer';

export const ClashDetection = () => {
  const [activeTab, setActiveTab] = useState('critical'); // 'all' | 'critical' | 'assigned'
  const [activeClash, setActiveClash] = useState('CL-0142');
  const [activeTool, setActiveTool] = useState('orbit'); // 'pointer' | 'orbit' | 'measure'
  const [xrayMode, setXrayMode] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Section — Ceiling Void');
  const resetViewFnRef = useRef(null);

  // Discipline visibility toggles
  const [disciplines, setDisciplines] = useState({
    ARCHITECTURAL: true,
    STRUCTURAL: true,
    MECHANICAL: true,
    ELECTRICAL: true,
    PLUMBING: true,
    'FIRE PROTECTION': true,
  });

  // Assign modal and toast states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('MEP Lead (Eng. Kareem)');
  const [assignNote, setAssignNote] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);

  // Clashes dataset
  const [clashesList, setClashesList] = useState([
    { 
      id: 'CL-0142', 
      types: 'MECH × STRUCT', 
      severity: 'critical', 
      overlap: '180mm', 
      assignee: 'MEP Lead', 
      status: 'open',
      grid: 'Grid D-4',
      detail: { 
        type: 'Hard clash (Physical penetration)', 
        elements: 'Duct 600×400 / UB 305×165×46kg', 
        location: 'Level 03, Grid D-4, Ceiling void', 
        clearance: '50mm required (Deficit: 230mm)',
        coordinates: 'X: 42.85m, Y: 18.20m, Z: +13.92m',
        suggestion: 'Reroute duct 250mm south of beam centreline — maintains 50mm clearance and ceiling void depth.' 
      }
    },
    { 
      id: 'CL-0138', 
      types: 'ELEC × STRUCT', 
      severity: 'critical', 
      overlap: '95mm', 
      assignee: 'Elec Lead', 
      status: 'open',
      grid: 'Grid E-2',
      detail: { 
        type: 'Hard clash (Physical penetration)', 
        elements: 'Cable Tray 300×50 / UC 203×203 Column', 
        location: 'Level 03, Grid E-2, Corridor 301', 
        clearance: '100mm required (Deficit: 195mm)',
        coordinates: 'X: 48.10m, Y: 12.45m, Z: +14.05m',
        suggestion: 'Lower cable tray by 100mm to pass below column bracket or offset 150mm east.' 
      }
    },
    { 
      id: 'CL-0131', 
      types: 'FIRE × MECH', 
      severity: 'critical', 
      overlap: '140mm', 
      assignee: 'MEP Lead', 
      status: 'open',
      grid: 'Grid C-7',
      detail: { 
        type: 'Hard clash (Physical penetration)', 
        elements: 'Sprinkler Main Ø100 / Supply Duct 800×500', 
        location: 'Level 03, Grid C-7, Corridor 302', 
        clearance: '75mm required (Deficit: 215mm)',
        coordinates: 'X: 35.60m, Y: 24.80m, Z: +13.78m',
        suggestion: 'Offset sprinkler pipe with 45° Victaulic grooved elbows over top of duct.' 
      }
    },
    { 
      id: 'CL-0125', 
      types: 'PLUMB × ARCH', 
      severity: 'major', 
      overlap: '40mm', 
      assignee: 'Arch Lead', 
      status: 'open',
      grid: 'Grid B-3',
      detail: { 
        type: 'Clearance clash (No sleeve provided)', 
        elements: 'Soil Pipe Ø110 / 2hr Fire Partition Wall', 
        location: 'Level 03, Grid B-3, Shaft S-04', 
        clearance: '25mm required (Touching framing)',
        coordinates: 'X: 28.40m, Y: 15.30m, Z: +13.60m',
        suggestion: 'Provide 150mm firestop penetration sleeve in drywall framing schedule.' 
      }
    },
    { 
      id: 'CL-0119', 
      types: 'MECH × ARCH', 
      severity: 'major', 
      overlap: '35mm', 
      assignee: 'MEP Lead', 
      status: 'open',
      grid: 'Grid F-5',
      detail: { 
        type: 'Clearance clash (Ceiling intrusion)', 
        elements: 'Extract Duct 450×300 / Suspended Ceiling Grid', 
        location: 'Level 03, Grid F-5, Meeting Rm 312', 
        clearance: '50mm required (Touching furring channel)',
        coordinates: 'X: 54.20m, Y: 29.10m, Z: +13.52m',
        suggestion: 'Transition to flat oval duct 600×225 to preserve 2,700mm ceiling datum.' 
      }
    },
    { 
      id: 'CL-0104', 
      types: 'ELEC × PLUMB', 
      severity: 'resolved', 
      overlap: 'resolved', 
      assignee: 'Closed', 
      status: 'closed',
      grid: 'Grid D-1',
      detail: { 
        type: 'Resolved clash (Offset installed)', 
        elements: 'Busbar Feeder / Chilled Water Return Ø80', 
        location: 'Level 03, Grid D-1, Riser Room', 
        clearance: '120mm achieved (Meets standard)',
        coordinates: 'X: 41.15m, Y: 08.90m, Z: +14.10m',
        suggestion: 'Resolved by Rev B MEP coordinated model with 90° pipe crossover bracket.' 
      }
    }
  ]);

  // Filtered clashes based on active tab
  const filteredClashes = clashesList.filter(clash => {
    if (activeTab === 'critical') return clash.severity === 'critical';
    if (activeTab === 'assigned') return clash.status !== 'closed' && clash.assignee !== 'Unassigned';
    return true; // 'all'
  });

  const currentClash = clashesList.find(c => c.id === activeClash) || clashesList[0];

  const toggleDiscipline = (discName) => {
    setDisciplines(prev => ({ ...prev, [discName]: !prev[discName] }));
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAssignConfirm = () => {
    setIsAssigning(true);
    setTimeout(() => {
      setClashesList(prev => prev.map(c => {
        if (c.id === activeClash) {
          return {
            ...c,
            assignee: selectedAssignee.split(' ')[0] + ' Lead',
            status: 'in_progress',
            detail: {
              ...c.detail,
              status: 'Assigned to ' + selectedAssignee
            }
          };
        }
        return c;
      }));
      setIsAssigning(false);
      setShowAssignModal(false);
      triggerToast(`Clash ${activeClash} assigned to ${selectedAssignee}. Notification dispatched.`);
    }, 800);
  };

  const handleExportReport = () => {
    triggerToast(`Exporting BCF 2.1 Coordination Package & PDF Report for Level 03...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
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

      {/* Assignment Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: 'white', borderRadius: 16, width: 480, padding: 24,
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '1px solid var(--color-gray-200)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-brand-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-700)' }}>
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-h3" style={{ fontSize: 16 }}>Assign Clash {currentClash.id}</h3>
                    <p className="text-caption" style={{ color: 'var(--color-gray-500)' }}>{currentClash.types} — {currentClash.overlap} overlap</p>
                  </div>
                </div>
                <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="text-caption" style={{ fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 6 }}>
                    Select Responsible Lead
                  </label>
                  <select 
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-gray-300)', fontSize: 13, fontWeight: 500 }}
                  >
                    <option value="MEP Lead (Eng. Kareem)">Eng. Kareem (MEP Lead - Al Futtaim)</option>
                    <option value="Structural Lead (Eng. David)">Eng. David (Structural Lead - WSP)</option>
                    <option value="Architectural Lead (Arch. Layla)">Arch. Layla (Architectural Lead - Foster)</option>
                    <option value="Electrical Lead (Eng. Tariq)">Eng. Tariq (Electrical Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="text-caption" style={{ fontWeight: 600, color: 'var(--color-gray-700)', display: 'block', marginBottom: 6 }}>
                    Resolution Notes & Action Item
                  </label>
                  <textarea 
                    rows={3}
                    value={assignNote}
                    onChange={(e) => setAssignNote(e.target.value)}
                    placeholder={currentClash.detail.suggestion}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-gray-300)', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <Button variant="secondary" onClick={() => setShowAssignModal(false)} style={{ flex: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleAssignConfirm} disabled={isAssigning} style={{ flex: 1 }}>
                    {isAssigning ? 'Notifying...' : 'Confirm & Notify'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 20, flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Panel A: 3D BIM Full Building Clash Viewer (68% default, 100% maximized) */}
        <div style={{ 
          flex: isMaximized ? '1 1 100%' : '1 1 68%', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 16, 
          minWidth: 0,
          transition: 'flex 0.3s ease'
        }}>
          
          <div className="surface-glass" style={{ flex: 1, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-gray-200)', minHeight: 0 }}>
            
            {/* Viewer Topbar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', zIndex: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--color-gray-200)', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'white', cursor: 'pointer' }}
                  >
                    AL BARSHA TOWER — LEVEL 03 COORDINATION <ChevronDown size={14} />
                  </button>
                  {showModelDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 30, minWidth: 280 }}>
                      {['AL BARSHA TOWER — LEVEL 03 COORDINATION', 'AL BARSHA TOWER — LEVEL 02 PODIUM', 'AL BARSHA TOWER — BASEMENT 01 PLANT'].map(m => (
                        <div key={m} onClick={() => { setShowModelDropdown(false); triggerToast(`Switched view to ${m}`); }} style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: m.includes('03') ? 600 : 400 }} className="hover-bg-gray-50">
                          {m}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-gray-700)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success-500)' }} />
                  Full 3D Level Model Loaded
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* 3D Tools Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-gray-100)', padding: 3, borderRadius: 8 }}>
                  <button 
                    title="Rotate / Orbit (Left Drag)"
                    onClick={() => setActiveTool('orbit')}
                    style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: activeTool === 'orbit' ? 'white' : 'transparent', color: activeTool === 'orbit' ? 'var(--color-brand-600)' : 'var(--color-gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: activeTool === 'orbit' ? 'var(--shadow-sm)' : 'none', fontSize: 12, fontWeight: 600 }}
                  >
                    <Hand size={15} /> Orbit 360°
                  </button>
                  <button 
                    title="Inspect Element"
                    onClick={() => setActiveTool('pointer')}
                    style={{ padding: '6px 8px', borderRadius: 6, border: 'none', background: activeTool === 'pointer' ? 'white' : 'transparent', color: activeTool === 'pointer' ? 'var(--color-brand-600)' : 'var(--color-gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: activeTool === 'pointer' ? 'var(--shadow-sm)' : 'none', fontSize: 12, fontWeight: 600 }}
                  >
                    <MousePointer2 size={15} /> Select
                  </button>
                  <button 
                    title="Reset to Full Building View"
                    onClick={() => { if (resetViewFnRef.current) resetViewFnRef.current(); }}
                    style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--color-gray-600)', cursor: 'pointer', display: 'flex' }}
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button 
                    title="Toggle X-Ray / Ghost Mode"
                    onClick={() => { setXrayMode(!xrayMode); triggerToast(xrayMode ? 'X-Ray mode disabled' : 'X-Ray Ghost mode enabled — highlighting clash volume'); }}
                    style={{ padding: 6, borderRadius: 6, border: 'none', background: xrayMode ? 'var(--color-brand-100)' : 'transparent', color: xrayMode ? 'var(--color-brand-700)' : 'var(--color-gray-600)', cursor: 'pointer', display: 'flex' }}
                  >
                    {xrayMode ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button 
                    title="Maximize / Expand 3D Viewport"
                    onClick={() => setIsMaximized(!isMaximized)}
                    style={{ padding: 6, borderRadius: 6, border: 'none', background: isMaximized ? 'var(--color-brand-100)' : 'transparent', color: isMaximized ? 'var(--color-brand-700)' : 'var(--color-gray-600)', cursor: 'pointer', display: 'flex' }}
                  >
                    {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>
                </div>

                <div style={{ width: 1, height: 20, background: 'var(--color-gray-200)' }} />

                {/* Section Selector */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--color-gray-200)', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'white', cursor: 'pointer' }}
                  >
                    {selectedSection} <ChevronDown size={14} />
                  </button>
                  {showSectionDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 30, minWidth: 220 }}>
                      {['Section — Ceiling Void', 'Section — Floor Slab + Beams', 'Full Level 03 Floor Plan'].map(sec => (
                        <div key={sec} onClick={() => { setSelectedSection(sec); setShowSectionDropdown(false); }} style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: selectedSection === sec ? 600 : 400 }} className="hover-bg-gray-50">
                          {sec}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disciplines Legend & Toggles Bar */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', gap: 16, padding: '8px 16px', 
              background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', 
              borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 10 
            }}>
              {[
                { label: 'ARCHITECTURAL', color: '#94A3B8' },
                { label: 'STRUCTURAL', color: '#3B82F6' },
                { label: 'MECHANICAL', color: '#06B6D4' },
                { label: 'ELECTRICAL', color: '#F59E0B' },
                { label: 'PLUMBING', color: '#10B981' },
                { label: 'FIRE PROTECTION', color: '#EF4444' }
              ].map(sys => {
                const isVisible = disciplines[sys.label];
                return (
                  <div 
                    key={sys.label} 
                    onClick={() => toggleDiscipline(sys.label)}
                    title={`Click to ${isVisible ? 'hide' : 'show'} ${sys.label}`}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      opacity: isVisible ? 1 : 0.35,
                      padding: '2px 8px', borderRadius: 6,
                      background: isVisible ? 'rgba(255,255,255,0.08)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: sys.color, boxShadow: isVisible ? `0 0 8px ${sys.color}` : 'none' }} />
                    <span className="text-overline" style={{ letterSpacing: 0.5, color: '#E2E8F0', fontSize: 10, fontWeight: 600 }}>{sys.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Full 3D WebGL Three.js Building BIM Coordination Canvas */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
              <BimClashViewer 
                activeClashId={activeClash}
                onSelectClash={(cId) => setActiveClash(cId)}
                disciplines={disciplines}
                xrayMode={xrayMode}
                measureMode={measureMode}
                activeTool={activeTool}
                onHoverObject={(obj) => setHoveredObject(obj)}
                onResetViewRef={resetViewFnRef}
              />
            </div>
          </div>
        </div>

        {/* Panel B: Clash Register & Detail (32% default, collapsible on maximize) */}
        {!isMaximized && (
          <div style={{ flex: '0 0 32%', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
            <div className="surface-glass" style={{ flex: 1, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', padding: 20, gap: 14, overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="text-overline" style={{ color: 'var(--color-gray-500)', letterSpacing: 1 }}>CLASH REGISTER</h3>
                <div className="text-caption" style={{ color: 'var(--color-gray-500)', fontWeight: 600 }}>
                  {clashesList.length} clashes — {clashesList.filter(c => c.severity === 'critical').length} critical
                </div>
              </div>

              {/* Fully Functional Tabs: All | Critical | Assigned */}
              <div style={{ display: 'flex', gap: 6, background: 'var(--color-gray-100)', padding: 4, borderRadius: 8 }}>
                {[
                  { key: 'all', label: 'All', count: clashesList.length },
                  { key: 'critical', label: 'Critical', count: clashesList.filter(c => c.severity === 'critical').length },
                  { key: 'assigned', label: 'Assigned', count: clashesList.filter(c => c.status !== 'closed' && c.assignee !== 'Unassigned').length }
                ].map(tab => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        const newFiltered = clashesList.filter(clash => {
                          if (tab.key === 'critical') return clash.severity === 'critical';
                          if (tab.key === 'assigned') return clash.status !== 'closed' && clash.assignee !== 'Unassigned';
                          return true;
                        });
                        if (newFiltered.length > 0 && !newFiltered.some(c => c.id === activeClash)) {
                          setActiveClash(newFiltered[0].id);
                        }
                      }}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '7px 0',
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        borderRadius: 6,
                        border: 'none',
                        background: isActive ? 'var(--gradient-brand)' : 'transparent',
                        color: isActive ? 'white' : 'var(--color-gray-700)',
                        boxShadow: isActive ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <span>{tab.label}</span>
                      <span style={{ 
                        fontSize: 10, 
                        padding: '1px 5px', 
                        borderRadius: 10, 
                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                        color: isActive ? 'white' : 'var(--color-gray-600)'
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filtered Clashes List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4, minHeight: 160 }}>
                {filteredClashes.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 13 }}>
                    No clashes found for "{activeTab}" filter.
                  </div>
                ) : (
                  filteredClashes.map((c) => {
                    const isSelected = activeClash === c.id;
                    return (
                      <div 
                        key={c.id}
                        onClick={() => setActiveClash(c.id)}
                        style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', 
                          background: isSelected ? 'var(--color-brand-50)' : 'white', 
                          border: isSelected ? '1.5px solid var(--color-brand-500)' : '1px solid var(--color-gray-200)',
                          borderRadius: 8, cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(108,92,231,0.12)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ 
                            width: 8, height: 8, borderRadius: '50%', 
                            background: c.severity === 'critical' ? 'var(--color-danger-500)' : c.severity === 'major' ? 'var(--color-warning-500)' : 'var(--color-success-500)' 
                          }} />
                          <span className="text-body-s" style={{ fontWeight: 700, fontSize: 12, color: isSelected ? 'var(--color-brand-700)' : 'var(--color-gray-900)' }}>
                            {c.id}
                          </span>
                        </div>
                        <div className="text-caption" style={{ fontWeight: 600, fontSize: 11, color: 'var(--color-gray-700)' }}>
                          {c.types}
                        </div>
                        <div className="text-caption" style={{ color: c.severity === 'critical' ? 'var(--color-danger-600)' : 'var(--color-gray-500)', fontWeight: 600, fontSize: 11 }}>
                          {c.overlap}
                        </div>
                        <div style={{ 
                          padding: '2px 6px', 
                          border: `1px solid var(--color-${c.status === 'closed' ? 'success' : 'brand'}-200)`, 
                          color: `var(--color-${c.status === 'closed' ? 'success' : 'brand'}-700)`, 
                          borderRadius: 6, 
                          fontSize: 10, 
                          fontWeight: 600, 
                          background: c.status === 'closed' ? 'var(--color-success-50)' : 'var(--color-brand-50)' 
                        }}>
                          {c.assignee}
                        </div>
                        <ChevronRight size={14} color={isSelected ? 'var(--color-brand-600)' : 'var(--color-gray-400)'} />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Clash Details Panel */}
              {currentClash.detail && (
                <motion.div 
                  key={currentClash.id}
                  initial={{ opacity: 0, y: 6 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    borderTop: '1px solid var(--color-gray-200)', 
                    paddingTop: 12, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 10 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-overline" style={{ color: 'var(--color-gray-500)', letterSpacing: 0.5, fontSize: 10 }}>
                      CLASH DETAIL — {currentClash.id}
                    </h3>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                      background: currentClash.severity === 'critical' ? 'var(--color-danger-50)' : currentClash.severity === 'major' ? 'var(--color-warning-50)' : 'var(--color-success-50)',
                      color: currentClash.severity === 'critical' ? 'var(--color-danger-600)' : currentClash.severity === 'major' ? 'var(--color-warning-700)' : 'var(--color-success-700)'
                    }}>
                      {currentClash.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Type:</span> 
                      <span style={{ fontWeight: 600 }}>{currentClash.detail.type.split(' (')[0]}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Overlap:</span> 
                      <span style={{ fontWeight: 700, color: currentClash.overlap === 'resolved' ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>
                        {currentClash.overlap}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Elements:</span> 
                      <span style={{ fontWeight: 600, color: 'var(--color-brand-700)' }}>{currentClash.detail.elements}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, gridColumn: 'span 2' }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Location:</span> 
                      <span style={{ fontWeight: 500 }}>{currentClash.detail.location}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Clearance:</span> 
                      <span style={{ fontWeight: 500 }}>{currentClash.detail.clearance}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ color: 'var(--color-gray-500)', minWidth: 60 }}>Status:</span> 
                      <span style={{ fontWeight: 700, color: currentClash.status === 'closed' ? 'var(--color-success-600)' : 'var(--color-danger-600)' }}>
                        {currentClash.status === 'closed' ? 'Closed' : 'Open'}
                      </span>
                    </div>
                  </div>

                  {/* Engineering Resolution Box */}
                  <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 8, padding: 10 }}>
                    <div className="text-overline" style={{ color: '#B47800', marginBottom: 2, fontSize: 9 }}>
                      SUGGESTED RESOLUTION
                    </div>
                    <div style={{ color: '#8A5A00', lineHeight: 1.35, fontSize: 11 }}>
                      {currentClash.detail.suggestion}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Severity Counters Summary */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div 
                  onClick={() => setActiveTab('critical')}
                  style={{ 
                    flex: 1, border: activeTab === 'critical' ? '1.5px solid var(--color-danger-500)' : '1px solid var(--color-gray-200)', 
                    borderRadius: 8, padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                    background: activeTab === 'critical' ? 'var(--color-danger-50)' : 'white', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-danger-500)' }} />
                    <span className="text-caption" style={{ color: 'var(--color-gray-600)', fontWeight: 600, fontSize: 10 }}>Critical</span>
                  </div>
                  <div className="text-h2" style={{ fontSize: 16 }}>18</div>
                </div>

                <div 
                  onClick={() => setActiveTab('all')}
                  style={{ 
                    flex: 1, border: '1px solid var(--color-gray-200)', 
                    borderRadius: 8, padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                    background: 'white', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-warning-500)' }} />
                    <span className="text-caption" style={{ color: 'var(--color-gray-600)', fontWeight: 600, fontSize: 10 }}>Major</span>
                  </div>
                  <div className="text-h2" style={{ fontSize: 16 }}>47</div>
                </div>

                <div 
                  onClick={() => setActiveTab('all')}
                  style={{ 
                    flex: 1, border: '1px solid var(--color-gray-200)', 
                    borderRadius: 8, padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                    background: 'white', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gray-400)' }} />
                    <span className="text-caption" style={{ color: 'var(--color-gray-600)', fontWeight: 600, fontSize: 10 }}>Minor</span>
                  </div>
                  <div className="text-h2" style={{ fontSize: 16 }}>77</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                <button 
                  style={{ flex: 1, padding: '9px 12px', fontSize: 12, background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign & Notify
                </button>
                <button 
                  style={{ flex: 1, background: 'rgba(0, 71, 83, 0.08)', border: '1.5px solid rgba(0, 71, 83, 0.3)', color: '#004753', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  onClick={handleExportReport}
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
