import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Box, CheckCircle2, Clock, AlertTriangle, MessageSquare, 
  Plus, Filter, Video, ArrowUpRight, Check, ShieldCheck, MapPin, Sparkles,
  Layers, ChevronRight, Activity, Globe
} from 'lucide-react';

const uaeCoordinationMeetings = [
  { 
    id: 1, 
    title: 'MEP Chilled Water vs Structural Beam Clash Workshop (Level 03)', 
    date: '16 Aug 2026 • 10:00 AM', 
    status: 'Upcoming', 
    attendees: ['Eng. Tareq (KEO)', 'Rashid Khan (Dutco MEP)', 'Sarah (Arabtec PMO)', 'WSP Lead'],
    models: ['AWT_STRUC_Framing.rvt', 'AWT_MEP_HVAC.nwd'], 
    issues: '14 Critical BCF Clashes',
    location: 'Meeting Room 4B & Teams BIM Sync'
  },
  { 
    id: 2, 
    title: 'Facade Bracket & Column C1 Rebar Clearance Review', 
    date: '15 Aug 2026 • 02:30 PM', 
    status: 'In Progress', 
    attendees: ['Foster Architectural', 'Schüco Facade Lead', 'Parsons Structural'],
    models: ['AWT_ARCH_Facade.ifc', 'AWT_STRUC_Framing.rvt'], 
    issues: '8 Clashes Under Review',
    location: 'Saadiyat BIM Lab & WebGL'
  },
  { 
    id: 3, 
    title: 'Etihad Rail Depot - Civil Ground Piles & Track Drainage Sign-off', 
    date: '14 Aug 2026 • 11:00 AM', 
    status: 'Completed', 
    attendees: ['Parsons Infrastructure', 'China State JV', 'RTA Technical Rep'],
    models: ['ERH_CIVIL_Site.ifc', 'ERH_TRACK_Drainage.dwg'], 
    issues: '22 BCF Issues Resolved & Signed',
    location: 'Al Faya Depot Conference'
  },
  { 
    id: 4, 
    title: 'Weekly Core Mechanical & Electrical Shaft Coordination', 
    date: '12 Aug 2026 • 09:00 AM', 
    status: 'Completed', 
    attendees: ['12 Multi-Disciplinary Leads'],
    models: ['All 7 Federated Models'], 
    issues: '45 Clashes Cleared',
    location: 'Aconex Virtual CDE'
  },
];

const timelineEvents = [
  { 
    day: 'Mon 10', 
    tasks: [
      { 
        id: 'EVT-01',
        name: 'Weekly Multi-Trade Core Sync', 
        type: 'meeting', 
        duration: 2.5, 
        start: 9.0,
        time: '09:00 - 11:30 GST',
        attendees: 'KEO, Arabtec, Dutco MEP, WSP',
        disciplines: 'Architecture × Structure × MEP',
        clashes: '45 Active BCF Topics Reviewed',
        location: 'Meeting Room 4B & Teams BIM',
        action: 'Approve Level 03 concrete sleeve cutouts'
      }
    ] 
  },
  { 
    day: 'Tue 11', 
    tasks: [
      { 
        id: 'EVT-02',
        name: 'Navisworks 2026 Model Federation Merge', 
        type: 'system', 
        duration: 1.5, 
        start: 13.5,
        time: '13:30 - 15:00 GST',
        attendees: 'Automated Batch Engine',
        disciplines: 'All 7 Federated Trade Models',
        clashes: '142 Hard Clashes Tagged',
        location: 'Autodesk Cloud CDE',
        action: 'Spatial tolerance check Level 01–04'
      }
    ] 
  },
  { 
    day: 'Wed 12', 
    tasks: [
      { 
        id: 'EVT-03',
        name: 'Arch Facade vs MEP Clash Resolution', 
        type: 'meeting', 
        duration: 3.0, 
        start: 10.0,
        time: '10:00 - 13:00 GST',
        attendees: 'Foster, Schüco, Dutco MEP',
        disciplines: 'Curtain Wall × HVAC Ducts',
        clashes: '28 Clearances Re-baselined',
        location: 'Saadiyat BIM Lab Room 2',
        action: 'Offset perimeter diffusers 150mm'
      }
    ] 
  },
  { 
    day: 'Thu 13', 
    tasks: [
      { 
        id: 'EVT-04',
        name: 'BCF 2.1 Issue Report Generation & Dispatch', 
        type: 'system', 
        duration: 2.0, 
        start: 8.5,
        time: '08:30 - 10:30 GST',
        attendees: 'BIM PMO Team',
        disciplines: 'Full Issue Register',
        clashes: 'Weekly BCF Archive Dispatched',
        location: 'Aconex Sync Pipeline',
        action: 'Assign priority tasks to MEP leads'
      }
    ] 
  },
  { 
    day: 'Fri 14', 
    tasks: [
      { 
        id: 'EVT-05',
        name: 'MEP Chilled Water vs Structural Workshop', 
        type: 'meeting', 
        duration: 3.5, 
        start: 11.0,
        time: '11:00 - 14:30 GST',
        attendees: 'KEO Structural, Dutco MEP, PMO',
        disciplines: 'Chilled Water × UB 305 Beams',
        clashes: '14 Penetrations Sleeved',
        location: 'Main Conference Hall 01',
        action: 'Sign off sleeve layout drawings'
      }
    ] 
  },
];

export const ClashCoordination = () => {
  const [filter, setFilter] = useState('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null); // { task, x, y }
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('18 Aug 2026 • 10:00 AM');

  const filteredMeetings = uaeCoordinationMeetings.filter(m => filter === 'All' || m.status === filter);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            BIM Coordination Workshops & Timeline
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Schedule multi-disciplinary clash resolution meetings, manage trade sign-offs, and track federated merges
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowScheduleModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={15} /> Schedule BIM Workshop
          </button>
        </div>
      </div>

      {/* Row 1: Timeline Gantt & Live Meeting List (65% / 35%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 480 }}>
        
        {/* Timeline Gantt (65%) */}
        <div style={{ flex: '0 0 65%', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="#004753" /> Weekly Coordination & Model Merge Schedule
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>Hover over individual workshop bars to inspect meeting agenda & participants</p>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.08)', padding: '4px 10px', borderRadius: 6 }}>
              Current Week: ISO 19650 Sprint 14
            </span>
          </div>
          
          {/* Custom Timeline / Gantt */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Timeline Header (Hours) */}
            <div style={{ display: 'flex', paddingLeft: 80, borderBottom: '1px solid #E2E8F0', paddingBottom: 8, color: '#64748B', fontSize: 11, fontWeight: 800 }}>
              {[8, 10, 12, 14, 16, 18].map(h => (
                <div key={h} style={{ flex: 1, textAlign: 'center' }}>{h}:00 GST</div>
              ))}
            </div>
            
            {/* Timeline Rows */}
            {timelineEvents.map((day, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{ width: 80, fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>{day.day}</div>
                <div style={{ flex: 1, height: 46, background: '#F8FAFC', borderRadius: 8, position: 'relative', border: '1px solid #E2E8F0' }}>
                  {/* Grid vertical lines */}
                  {[0, 1, 2, 3, 4, 5].map(idx => (
                    <div key={idx} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(idx / 6) * 100}%`, borderLeft: '1px dashed #E2E8F0' }} />
                  ))}
                  
                  {/* Task Bars */}
                  {day.tasks.map((task, tIdx) => {
                    const leftPos = ((task.start - 8) / 10) * 100;
                    const widthPct = (task.duration / 10) * 100;
                    const isMeeting = task.type === 'meeting';
                    const isHovered = hoveredBar && hoveredBar.task.id === task.id;

                    return (
                      <motion.div 
                        key={tIdx}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${widthPct}%`, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        onMouseEnter={(e) => handleBarMouseEnter(task, e)}
                        onMouseMove={handleBarMouseMove}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{ 
                          position: 'absolute', left: `${leftPos}%`, top: 7, height: 32, borderRadius: 6,
                          background: isMeeting ? '#004753' : 'rgba(0, 169, 197, 0.15)',
                          border: `1.5px solid ${isMeeting ? '#00333D' : '#00A9C5'}`,
                          color: isMeeting ? 'white' : '#004753',
                          display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 11, fontWeight: 800, overflow: 'hidden', whiteSpace: 'nowrap', cursor: 'pointer', 
                          boxShadow: isHovered ? '0 6px 16px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                          transform: isHovered ? 'scaleY(1.12) scaleX(1.01)' : 'scaleY(1) scaleX(1)',
                          zIndex: isHovered ? 25 : 5,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {task.name}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Meetings & Action Items (35%) */}
        <div style={{ flex: '0 0 calc(35% - 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#081E3C' }}>
                Workshops ({filteredMeetings.length})
              </h3>
              <div style={{ display: 'flex', gap: 4 }}>
                {['All', 'Upcoming', 'Completed'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: filter === f ? 'var(--gradient-brand)' : '#F1F5F9', color: filter === f ? 'white' : '#64748B', fontSize: 11, fontWeight: 700, cursor: 'pointer', boxShadow: filter === f ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Meetings List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
              {filteredMeetings.map(m => (
                <div 
                  key={m.id} 
                  style={{ padding: 14, border: '1px solid #E2E8F0', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'background 0.15s' }} 
                  className="hover-bg-gray-50"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#081E3C', lineHeight: 1.3 }}>{m.title}</div>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: 10, fontSize: 10.5, fontWeight: 800, whiteSpace: 'nowrap',
                      background: m.status === 'Completed' ? '#ECFDF5' : m.status === 'Upcoming' ? 'rgba(0, 71, 83, 0.08)' : '#FEF3C7',
                      color: m.status === 'Completed' ? '#059669' : m.status === 'Upcoming' ? '#004753' : '#D97706'
                    }}>
                      {m.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#00A9C5', fontWeight: 700 }}>
                    {m.issues}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, color: '#64748B', fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} /> {m.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} /> {m.location}</div>
                  </div>

                  {m.status === 'Upcoming' && (
                    <div style={{ paddingTop: 6, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => alert(`Launching live WebGL 3D Model Sync room for "${m.title}"...`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                      >
                        <Video size={12} /> Launch BIM Sync
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC ATTACHED HOVER WINDOW (Sits directly near the hovered bar) */}
      <AnimatePresence>
        {hoveredBar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed',
              left: Math.min(Math.max(hoveredBar.x - 145, 20), window.innerWidth - 320),
              top: hoveredBar.y > 220 ? hoveredBar.y - 180 : hoveredBar.y + 36,
              zIndex: 9999,
              width: 300,
              background: 'rgba(8, 30, 60, 0.96)',
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
                <div style={{ fontSize: 10, fontWeight: 800, color: '#00A9C5', letterSpacing: '0.03em' }}>
                  {hoveredBar.task.id} • {hoveredBar.task.type === 'meeting' ? 'BIM WORKSHOP' : 'SYSTEM MERGE'}
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
                background: hoveredBar.task.type === 'meeting' ? '#004753' : 'rgba(0, 169, 197, 0.3)',
                color: 'white'
              }}>
                {hoveredBar.task.duration}h
              </span>
            </div>

            {/* Time & Trades */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: '#94A3B8' }}>Time:</span>
              <span style={{ color: '#F1F5F9', fontWeight: 700 }}>{hoveredBar.task.time}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: '#94A3B8' }}>Trades:</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }} className="truncate">{hoveredBar.task.disciplines}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 5 }}>
              <span style={{ color: '#94A3B8' }}>Issues:</span>
              <span style={{ fontWeight: 800, color: '#34D399' }}>{hoveredBar.task.clashes}</span>
            </div>

            {hoveredBar.task.action && (
              <div style={{ fontSize: 10.5, color: '#CBD5E1', fontStyle: 'italic', background: 'rgba(0, 169, 197, 0.12)', padding: '5px 8px', borderRadius: 4 }}>
                🎯 {hoveredBar.task.action}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Workshop Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Schedule BIM Coordination Workshop
                </h3>
                <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Workshop Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Level 05 MEP vs Post-Tensioned Slab Clash Review" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Scheduled Date & Time</label>
                <input 
                  type="text" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setShowScheduleModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => { setShowScheduleModal(false); alert("Coordination workshop invite dispatched with synced BCF topics!"); }} style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Dispatch Invites
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
