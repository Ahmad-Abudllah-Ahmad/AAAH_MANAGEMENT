import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, CheckCircle2, Clock, AlertTriangle, Layers, Download, Calendar, FileSpreadsheet,
  Activity
} from 'lucide-react';

// Primavera P6 Commercial High-Rise Master Schedule Activities
const masterScheduleActivities = [
  {
    id: 'ACT-01.10',
    wbs: '01.10 Mobilization',
    name: 'Site Setup, Logistics Yard & Smart Turnstiles',
    subcontractor: 'Main Contractor JV',
    trade: 'General Preliminaries',
    baselineStart: 'Jan 05, 2026',
    baselineEnd: 'Jan 25, 2026',
    actualStart: 'Jan 05, 2026',
    forecastEnd: 'Jan 22, 2026',
    duration: 20,
    progress: 100,
    totalFloat: 0,
    status: 'Completed',
    critical: false,
    ganttLeft: '2%',
    ganttWidth: '8%'
  },
  {
    id: 'ACT-02.20',
    wbs: '02.20 Substructure',
    name: 'Deep Pit Excavation & Dewatering (-14.2m)',
    subcontractor: 'Solid Foundations Earthworks',
    trade: 'Geotechnical & Earthworks',
    baselineStart: 'Jan 26, 2026',
    baselineEnd: 'Mar 10, 2026',
    actualStart: 'Jan 26, 2026',
    forecastEnd: 'Mar 18, 2026',
    duration: 44,
    progress: 100,
    totalFloat: 0,
    status: 'Completed',
    critical: false,
    ganttLeft: '10%',
    ganttWidth: '15%'
  },
  {
    id: 'ACT-02.30',
    wbs: '02.30 Substructure',
    name: '128 Piles & 2.4m Thick Raft Concrete Pour',
    subcontractor: 'Arabtec Concreting',
    trade: 'Mass Concrete Raft',
    baselineStart: 'Mar 12, 2026',
    baselineEnd: 'Apr 15, 2026',
    actualStart: 'Mar 19, 2026',
    forecastEnd: 'Apr 24, 2026',
    duration: 35,
    progress: 100,
    totalFloat: -9,
    status: 'Completed',
    critical: false,
    ganttLeft: '25%',
    ganttWidth: '14%'
  },
  {
    id: 'ACT-03.10',
    wbs: '03.10 Superstructure',
    name: 'Central Shear Core Climbing Walls (L09–L14 Jump #11)',
    subcontractor: 'Doka Systems / Arabtec',
    trade: 'Hydraulic Climbing Formwork',
    baselineStart: 'Apr 20, 2026',
    baselineEnd: 'Jun 10, 2026',
    actualStart: 'Apr 28, 2026',
    forecastEnd: 'Jun 22, 2026',
    duration: 52,
    progress: 82,
    totalFloat: -12,
    status: 'In Progress',
    critical: true,
    ganttLeft: '39%',
    ganttWidth: '22%'
  },
  {
    id: 'ACT-03.20',
    wbs: '03.20 Superstructure',
    name: 'Level 03 Post-Tensioned Pour (Bay 3B Core Perimeter)',
    subcontractor: 'Arabtec Concreting',
    trade: 'Post-Tensioned Slabs',
    baselineStart: 'May 02, 2026',
    baselineEnd: 'May 16, 2026',
    actualStart: 'May 10, 2026',
    forecastEnd: 'May 28, 2026',
    duration: 18,
    progress: 65,
    totalFloat: -27,
    status: 'Critical Path',
    critical: true,
    ganttLeft: '45%',
    ganttWidth: '12%'
  },
  {
    id: 'ACT-04.10',
    wbs: '04.10 Podium Steel',
    name: 'Multi-Storey Parking Podium Structural Steel Frame',
    subcontractor: 'Apex Structural Steel Corp',
    trade: 'Heavy Steel Framing',
    baselineStart: 'May 10, 2026',
    baselineEnd: 'Jun 30, 2026',
    actualStart: 'May 15, 2026',
    forecastEnd: 'Jul 12, 2026',
    duration: 52,
    progress: 18,
    totalFloat: -12,
    status: 'In Progress',
    critical: false,
    ganttLeft: '47%',
    ganttWidth: '20%'
  },
  {
    id: 'ACT-05.10',
    wbs: '05.10 Envelope',
    name: 'Curtain Wall Unitized Glazing (L01–L04 Bracket Anchors)',
    subcontractor: 'Alumco Facades',
    trade: 'Unitized Glass Facade',
    baselineStart: 'Jun 05, 2026',
    baselineEnd: 'Jul 28, 2026',
    actualStart: '—',
    forecastEnd: 'Aug 14, 2026',
    duration: 53,
    progress: 0,
    totalFloat: -17,
    status: 'Pending',
    critical: true,
    ganttLeft: '56%',
    ganttWidth: '18%'
  },
  {
    id: 'ACT-06.10',
    wbs: '06.10 MEP Services',
    name: 'Basement Central Plant Heavy Chillers & Pumps Rigging',
    subcontractor: 'Flow Systems MEP',
    trade: 'HVAC & Central Plant',
    baselineStart: 'Jun 20, 2026',
    baselineEnd: 'Aug 15, 2026',
    actualStart: '—',
    forecastEnd: 'Aug 30, 2026',
    duration: 56,
    progress: 0,
    totalFloat: -15,
    status: 'Pending',
    critical: false,
    ganttLeft: '62%',
    ganttWidth: '19%'
  }
];

export const ProgressSchedule = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(masterScheduleActivities[4]);
  const [hoveredBar, setHoveredBar] = useState(null); // { task, x, y }
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTasks = masterScheduleActivities.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.id.toLowerCase().includes(search.toLowerCase()) ||
                          t.subcontractor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true :
                          statusFilter === 'Critical' ? t.critical :
                          statusFilter === 'In Progress' ? t.status === 'In Progress' || t.status === 'Critical Path' :
                          t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBarMouseEnter = (task, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredBar({
      task,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const handleBarMouseMove = (e) => {
    if (!hoveredBar) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredBar(prev => prev ? {
      ...prev,
      x: rect.left + rect.width / 2,
      y: rect.top
    } : null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      
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
      <div style={{ background: 'white', padding: '16px 22px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Calendar size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Master CPM Schedule & Gantt Timeline
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                PRIMAVERA P6 REV 03
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12.5, margin: '2px 0 0 0' }}>
              Critical Path Method (CPM) • Early vs Late Dates • Hover individual activity bars for details
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => showToast('Importing Primavera P6 .XER schedule update...')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}
          >
            <FileSpreadsheet size={15} /> Import .XER / .MPP
          </button>

          <button 
            onClick={() => showToast('Exporting CPM Gantt Schedule PDF...')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export Gantt
          </button>
        </div>
      </div>

      {/* Top 4 Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total CPM Activities</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>142 Tasks</div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>88 Completed (62%)</div>
          </div>
          <div style={{ padding: 10, background: '#F1F5F9', borderRadius: 8, color: '#475569' }}>
            <Layers size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>Critical Path Tasks</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626', marginTop: 2 }}>18 Tasks</div>
            <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>Zero or Negative Float</div>
          </div>
          <div style={{ padding: 10, background: '#FEF2F2', borderRadius: 8, color: '#DC2626' }}>
            <AlertTriangle size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Critical Float Variance</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626', marginTop: 2 }}>-27 Days</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Level 03 Post-Tensioned Pour</div>
          </div>
          <div style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, color: '#475569' }}>
            <Clock size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Schedule Performance</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5', marginTop: 2 }}>0.85 SPI</div>
            <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>15% Schedule Deficit</div>
          </div>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 8, color: '#4F46E5' }}>
            <Activity size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ background: 'white', padding: '12px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', flex: 1, maxWidth: 360 }}>
            <Search size={15} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search by activity name, WBS ID, or subcontractor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#0F172A' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            {['All', 'Critical', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: statusFilter === tab ? 'var(--gradient-brand)' : '#F1F5F9',
                  color: statusFilter === tab ? 'white' : '#64748B',
                  cursor: 'pointer',
                  boxShadow: statusFilter === tab ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Gantt Split Container (Left WBS Table 52% + Right Gantt Timeline 48%) */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flex: 1, minHeight: 460 }}>
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT: WBS Activity Table */}
          <div style={{ flex: '0 0 52%', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0, background: '#F8FAFC', zIndex: 10, borderBottom: '1px solid #E2E8F0' }}>
                <tr style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', height: 42 }}>
                  <th style={{ padding: '8px 14px' }}>WBS Activity</th>
                  <th style={{ padding: '8px 10px' }}>Subcontractor</th>
                  <th style={{ padding: '8px 10px' }}>Finish Date</th>
                  <th style={{ padding: '8px 10px' }}>Float</th>
                  <th style={{ padding: '8px 14px', textAlign: 'right' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const isSelected = selectedTask && selectedTask.id === task.id;

                  return (
                    <tr 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      style={{ 
                        borderBottom: '1px solid #F1F5F9', 
                        height: 52, 
                        background: isSelected ? '#F0FDF4' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ fontWeight: 800, color: task.critical ? '#DC2626' : '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {task.critical && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} />}
                          <span>{task.name}</span>
                        </div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>{task.id} • {task.wbs}</div>
                      </td>
                      <td style={{ padding: '8px 10px', color: '#475569', fontWeight: 600 }}>
                        {task.subcontractor}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {task.forecastEnd}
                      </td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: task.totalFloat < 0 ? '#DC2626' : '#10B981', fontSize: 11 }}>
                          {task.totalFloat}d
                        </span>
                      </td>
                      <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 11.5, color: task.progress === 100 ? '#10B981' : '#0F172A' }}>
                            {task.progress}%
                          </span>
                          <div style={{ width: 45, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${task.progress}%`, height: '100%', background: task.progress === 100 ? '#10B981' : task.critical ? '#EF4444' : '#3B82F6' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RIGHT: Gantt Chart View */}
          <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', overflowX: 'auto', background: '#F8FAFC', position: 'relative' }}>
            
            {/* Timescale Header */}
            <div style={{ height: 42, background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', position: 'sticky', top: 0, zIndex: 10, minWidth: 450 }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May (Today)', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                <div key={i} style={{ flex: 1, borderRight: '1px solid #E2E8F0', padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: m.includes('Today') ? '#DC2626' : '#64748B' }}>
                  {m}
                </div>
              ))}
            </div>

            {/* Gantt Bars Canvas */}
            <div style={{ flex: 1, position: 'relative', minWidth: 450 }}>
              
              {/* Today Vertical Line at ~48% (May W21) */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '46%', borderLeft: '2px dashed #EF4444', zIndex: 5, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 4, left: 'calc(46% - 22px)', background: '#EF4444', color: 'white', padding: '1px 5px', borderRadius: 4, fontSize: 9, fontWeight: 800, zIndex: 6 }}>
                W21
              </div>

              {filteredTasks.map((task) => {
                const barColor = task.status === 'Completed' ? '#10B981' :
                                 task.critical ? '#EF4444' : '#3B82F6';
                const isHovered = hoveredBar && hoveredBar.task.id === task.id;

                return (
                  <div 
                    key={task.id} 
                    style={{ 
                      height: 52, 
                      borderBottom: '1px solid #F1F5F9', 
                      position: 'relative', 
                      display: 'flex', 
                      alignItems: 'center'
                    }}
                  >
                    
                    {/* ONLY Hover on this specific small Gantt Bar */}
                    <div
                      onClick={() => setSelectedTask(task)}
                      onMouseEnter={(e) => handleBarMouseEnter(task, e)}
                      onMouseMove={handleBarMouseMove}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{
                        position: 'absolute',
                        left: task.ganttLeft,
                        width: task.ganttWidth,
                        height: 22,
                        background: barColor,
                        borderRadius: 5,
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transform: isHovered ? 'scaleY(1.2) scaleX(1.02)' : 'scaleY(1) scaleX(1)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        zIndex: isHovered ? 20 : 4
                      }}
                    >
                      {task.progress > 0 && (
                        <div style={{ width: `${task.progress}%`, height: '100%', background: 'rgba(255,255,255,0.35)' }} />
                      )}
                    </div>

                    {/* Baseline ghost outline */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: task.ganttLeft,
                        width: `calc(${task.ganttWidth} - 3%)`,
                        height: 22,
                        border: '1px dashed #94A3B8',
                        borderRadius: 5,
                        pointerEvents: 'none'
                      }}
                    />

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </div>

      {/* DYNAMIC ATTACHED TOOLTIP HOVER WINDOW (Follows or sits directly near the hovered bar) */}
      <AnimatePresence>
        {hoveredBar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed',
              left: Math.min(Math.max(hoveredBar.x - 140, 20), window.innerWidth - 310),
              top: hoveredBar.y > 220 ? hoveredBar.y - 190 : hoveredBar.y + 32,
              zIndex: 9999,
              width: 290,
              background: 'rgba(15, 23, 42, 0.96)',
              color: 'white',
              borderRadius: 10,
              padding: '12px 14px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.12)',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#38BDF8', letterSpacing: '0.03em' }}>
                  {hoveredBar.task.id} • {hoveredBar.task.wbs}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'white', marginTop: 2, lineHeight: 1.25 }}>
                  {hoveredBar.task.name}
                </div>
              </div>
              <span style={{
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 9.5,
                fontWeight: 900,
                background: hoveredBar.task.status === 'Completed' ? '#10B981' : hoveredBar.task.critical ? '#EF4444' : '#3B82F6',
                color: 'white'
              }}>
                {hoveredBar.task.status.toUpperCase()}
              </span>
            </div>

            {/* Subcontractor & Float */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: '#94A3B8' }}>Subcontractor:</span>
              <span style={{ color: '#F1F5F9', fontWeight: 700 }}>{hoveredBar.task.subcontractor}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: '#94A3B8' }}>Finish Date:</span>
              <span style={{ color: '#F1F5F9', fontWeight: 700 }}>{hoveredBar.task.forecastEnd}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 5 }}>
              <span style={{ color: '#94A3B8' }}>Total Float:</span>
              <span style={{ fontWeight: 800, color: hoveredBar.task.totalFloat < 0 ? '#F87171' : '#34D399' }}>
                {hoveredBar.task.totalFloat}d {hoveredBar.task.totalFloat < 0 ? '(Critical Path)' : ''}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800 }}>
                <span style={{ color: '#94A3B8' }}>Progress</span>
                <span style={{ color: hoveredBar.task.progress === 100 ? '#34D399' : '#38BDF8' }}>{hoveredBar.task.progress}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${hoveredBar.task.progress}%`, height: '100%', background: hoveredBar.task.progress === 100 ? '#10B981' : hoveredBar.task.critical ? '#EF4444' : '#38BDF8' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Task Inspector Drawer at Bottom */}
      {selectedTask && (
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 4 }}>
              SELECTED CRITICAL ACTIVITY
            </span>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
              {selectedTask.id}: {selectedTask.name} ({selectedTask.subcontractor})
            </h4>
            <p style={{ fontSize: 11.5, color: '#64748B', margin: '2px 0 0 0' }}>
              Baseline: {selectedTask.baselineStart} → {selectedTask.baselineEnd} • Forecast: {selectedTask.forecastEnd} • Total Float: <strong style={{ color: '#DC2626' }}>{selectedTask.totalFloat} Days</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => showToast(`Opening RFI & Submittal log for ${selectedTask.id}...`)}
              style={{ padding: '6px 12px', background: '#F1F5F9', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}
            >
              View RFIs & Submittals
            </button>
            <button
              onClick={() => showToast(`Triggering fast-track crash schedule mitigation for ${selectedTask.id}...`)}
              style={{ padding: '6px 14px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
            >
              Apply Fast-Track Recovery Plan
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
