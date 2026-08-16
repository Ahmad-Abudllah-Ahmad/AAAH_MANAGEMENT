import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ScanText, 
  FileSignature, 
  BrainCircuit, 
  DraftingCompass, 
  Boxes, 
  Cctv, 
  Activity, 
  GitPullRequestDraft, 
  TrendingUp, 
  FileText, 
  BarChart3 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Initial Data
const initialOCR = [
  { time: '08:00', docs: 12 }, { time: '10:00', docs: 45 }, { time: '12:00', docs: 30 },
  { time: '14:00', docs: 60 }, { time: '16:00', docs: 80 }, { time: '18:00', docs: 40 }
];

const initialDrafting = [
  { type: 'Contracts', count: 120 }, { type: 'Letters', count: 85 }, { type: 'Notices', count: 45 }
];

const initialQA = [
  { day: 'Mon', queries: 20 }, { day: 'Tue', queries: 45 }, { day: 'Wed', queries: 30 },
  { day: 'Thu', queries: 80 }, { day: 'Fri', queries: 60 }
];

const initialScanner = [
  { name: 'A', x: 10, y: 30 }, { name: 'B', x: 30, y: 90 }, { name: 'C', x: 45, y: 50 }, 
  { name: 'D', x: 60, y: 70 }, { name: 'E', x: 80, y: 40 }
];

const initialClash = [
  { name: 'Critical', value: 18, color: '#DC2626' }, // Critical Red
  { name: 'High', value: 35, color: '#D97706' },    // Amber
  { name: 'Medium', value: 120, color: '#00A9C5' }   // AAAH Aqua
];

const initialSite = [
  { time: '10:00', head: 100 }, { time: '12:00', head: 150 }, { time: '14:00', head: 140 }, { time: '16:00', head: 80 }
];

const initialProgress = [
  { month: 'Jan', pv: 10, ev: 9 }, { month: 'Feb', pv: 20, ev: 18 }, { month: 'Mar', pv: 35, ev: 30 },
  { month: 'Apr', pv: 50, ev: 48 }, { month: 'May', pv: 65, ev: 59 }
];

const initialRFI = [
  { week: 'W1', open: 12, resolved: 30 },
  { week: 'W2', open: 15, resolved: 35 },
  { week: 'W3', open: 10, resolved: 45 },
  { week: 'W4', open: 18, resolved: 50 },
];

export const Home = () => {
  const navigate = useNavigate();

  // State for real-time data
  const [dataOCR, setDataOCR] = useState(initialOCR);
  const [dataDrafting, setDataDrafting] = useState(initialDrafting);
  const [dataQA, setDataQA] = useState(initialQA);
  const [dataScanner, setDataScanner] = useState(initialScanner);
  const [dataClash, setDataClash] = useState(initialClash);
  const [hoveredClash, setHoveredClash] = useState(null);
  const [dataSite, setDataSite] = useState(initialSite);
  const [dataProgress, setDataProgress] = useState(initialProgress);
  const [dataRFI, setDataRFI] = useState(initialRFI);

  // Real-time animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDataOCR(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], docs: next[next.length - 1].docs + Math.floor(Math.random() * 5) - 2 };
        return next;
      });
      setDataQA(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], queries: next[next.length - 1].queries + Math.floor(Math.random() * 3) };
        return next;
      });
      setDataSite(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], head: next[next.length - 1].head + Math.floor(Math.random() * 5) - 2 };
        return next;
      });
      setDataScanner(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], y: next[next.length - 1].y + Math.floor(Math.random() * 10) - 5 };
        return next;
      });
      setDataRFI(prev => {
        const next = [...prev];
        next[next.length - 1] = { 
          ...next[next.length - 1], 
          open: next[next.length - 1].open + Math.floor(Math.random() * 3) - 1,
          resolved: next[next.length - 1].resolved + Math.floor(Math.random() * 4) 
        };
        return next;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px 12px', borderRadius: 8, color: 'var(--color-gray-900)', fontSize: 12 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
          {payload.map(p => (
            <div key={p.dataKey} style={{ color: p.color || 'var(--color-gray-900)' }}>
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 24, background: 'transparent', color: 'var(--color-gray-900)', overflowY: 'auto' }}>
      
      {/* KPI Top Bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Docs Processed', value: 18, trend: '+4%', color: '#00A9C5', sparkline: [{n: 'Mon', v: 10}, {n: 'Tue', v: 15}, {n: 'Wed', v: 12}, {n: 'Thu', v: 18}, {n: 'Fri', v: 25}, {n: 'Sat', v: 18}] },
          { label: 'Open Exceptions', value: 1, trend: '-2%', color: '#D97706', sparkline: [{n: 'Mon', v: 5}, {n: 'Tue', v: 4}, {n: 'Wed', v: 6}, {n: 'Thu', v: 3}, {n: 'Fri', v: 2}, {n: 'Sat', v: 1}] },
          { label: 'Critical Clashes', value: 18, trend: '-5%', color: '#DC2626', sparkline: [{n: 'Mon', v: 25}, {n: 'Tue', v: 22}, {n: 'Wed', v: 24}, {n: 'Thu', v: 20}, {n: 'Fri', v: 19}, {n: 'Sat', v: 18}] },
          { label: 'Site Violations', value: 2, trend: '-1%', color: '#DC2626', sparkline: [{n: 'Mon', v: 4}, {n: 'Tue', v: 3}, {n: 'Wed', v: 5}, {n: 'Thu', v: 3}, {n: 'Fri', v: 2}, {n: 'Sat', v: 2}] },
          { label: 'Project Progress', value: '59%', trend: '+2.1%', color: '#00875A', sparkline: [{n: 'Jan', v: 50}, {n: 'Feb', v: 52}, {n: 'Mar', v: 54}, {n: 'Apr', v: 55}, {n: 'May', v: 57}, {n: 'Jun', v: 59}] },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-gray-500)', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap' }}>{kpi.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{kpi.value}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: kpi.color }}>{kpi.trend}</span>
              </div>
            </div>
            <div style={{ width: 100, height: 50 , position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.sparkline}>
                  <Tooltip 
                    cursor={false}
                    position={{ y: -28 }}
                    allowEscapeViewBox={{ x: true, y: true }}
                    contentStyle={{ background: 'rgba(8, 30, 60, 0.96)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: 8, fontSize: 11, padding: '3px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: '#FFFFFF', fontWeight: 700 }}
                  />
                  <Line type="monotone" name="Value" dataKey="v" stroke={kpi.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: kpi.color, stroke: 'none' }} isAnimationActive={true} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
          </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        
        {/* ROW 1 */}
        {/* Solution 1: Document OCR */}
        <motion.div 
          onClick={() => navigate('/document-processing')}
          whileHover={{ scale: 0.98, borderColor: '#00A9C5', boxShadow: '0 0 20px rgba(0, 169, 197, 0.25)' }}
          style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: 320 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#004753', marginBottom: 8 }}>
                <ScanText size={20} /> <span style={{ fontWeight: 700, fontSize: 14 }}>Solution 1</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>Document OCR</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 13 }}>Invoices matched & posted</p>
            </div>
            <div style={{ background: 'var(--gradient-brand)', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, height: 'fit-content' }}>
              94% Auto-Validated
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' , position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataOCR} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOcr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#004753" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="docs" stroke="#008EA6" strokeWidth={3} fillOpacity={1} fill="url(#colorOcr)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* Solution 4: Clash Detection */}
        <motion.div 
          onClick={() => navigate('/clash-detection')}
          whileHover={{ scale: 0.98, borderColor: '#004753', boxShadow: '0 0 20px rgba(0, 71, 83, 0.2)' }}
          style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#004753', marginBottom: 8 }}>
            <Boxes size={20} /> <span style={{ fontWeight: 700, fontSize: 14 }}>Solution 4</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Clash Detection</h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={dataClash} 
                    innerRadius={54} 
                    outerRadius={80} 
                    paddingAngle={4} 
                    dataKey="value" 
                    animationDuration={1000}
                    onMouseEnter={(_, index) => setHoveredClash(dataClash[index])}
                    onMouseLeave={() => setHoveredClash(null)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {dataClash.map((entry, index) => {
                      const isHovered = hoveredClash?.name === entry.name;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke={isHovered ? '#081E3C' : 'transparent'}
                          strokeWidth={isHovered ? 2 : 0}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Center Label */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', width: 90 }}>
              <motion.div 
                key={hoveredClash ? hoveredClash.name : 'total'}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <div style={{ fontSize: 18, fontWeight: 900, color: hoveredClash ? hoveredClash.color : '#081E3C', lineHeight: 1.1 }}>
                  {hoveredClash ? `${hoveredClash.value}%` : '100%'}
                </div>
                <div style={{ fontSize: 9.5, color: hoveredClash ? hoveredClash.color : '#64748B', fontWeight: 800, marginTop: 2 }} className="truncate">
                  {hoveredClash ? hoveredClash.name : 'Clash Dist.'}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* RFI Status (Top Right, Spans 1 Row) */}
        <motion.div style={{ gridColumn: '4', gridRow: '1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', height: 320 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitPullRequestDraft size={20} color="#00556A" /> RFI & Submittals
          </h3>
          <div style={{ flex: 1, marginTop: 16 , position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRFI} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-gray-200)" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="open" name="Open" stackId="a" fill="#DC2626" animationDuration={1000} radius={[0, 0, 4, 4]} />
                <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#004753" animationDuration={1000} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* ROW 2 */}
        {/* Solution 7: Progress Monitoring */}
        <motion.div 
          onClick={() => navigate('/progress-monitoring')}
          whileHover={{ scale: 0.98, borderColor: '#00875A', boxShadow: '0 0 20px rgba(0, 135, 90, 0.2)' }}
          style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00875A', marginBottom: 8 }}>
            <Activity size={20} /> <span style={{ fontWeight: 700, fontSize: 14 }}>Solution 7</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Progress Tracking</h2>
          <div style={{ flex: 1, marginTop: 16 , position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataProgress} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-gray-200)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="pv" name="Planned" stroke="var(--color-gray-300)" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={1000} />
                <Line type="monotone" dataKey="ev" name="Earned" stroke="#00A86B" strokeWidth={3} dot={{ r: 4, fill: '#00A86B', strokeWidth: 0 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* Solution 3: Site Monitoring with Live Camera Feed */}
        <motion.div 
          onClick={() => navigate('/site-monitoring')}
          whileHover={{ scale: 0.98, borderColor: '#00556A', boxShadow: '0 0 20px rgba(0, 85, 106, 0.2)' }}
          style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: '20px 22px', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320, overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00556A' }}>
              <Cctv size={18} /> <span style={{ fontWeight: 700, fontSize: 13 }}>Solution 3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, color: '#DC2626' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} />
              LIVE CAM-01
            </div>
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 10px 0' }}>Site Monitoring</h2>
          
          {/* Live Camera Viewport */}
          <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(0,0,0,0.1)', background: '#081E3C' }}>
            <img 
              src="/cctv_tower_crane.jpg" 
              alt="CCTV Site Monitoring Feed" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* AI Bounding Box Tag */}
            <div style={{ position: 'absolute', top: 12, left: 14, border: '1.5px solid #10B981', borderRadius: 6, padding: '2px 6px', background: 'rgba(8, 30, 60, 0.75)', backdropFilter: 'blur(3px)' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                ✓ PPE Verified (98.4%)
              </span>
            </div>

            {/* Bottom Stream Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(8,30,60,0.92) 0%, transparent 100%)', padding: '8px 12px 6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: 10.5 }}>
              <span style={{ fontWeight: 700, color: '#00A9C5' }}>Tower Crane 01</span>
              <span style={{ fontWeight: 700, color: '#CBD5E1' }}>1080P • 30 FPS</span>
            </div>
          </div>
        </motion.div>

        {/* Solution 6: Knowledge Assistant */}
        <motion.div 
          onClick={() => navigate('/knowledge-assistant')}
          whileHover={{ scale: 0.98, borderColor: '#D97706', boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)' }}
          style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D97706', marginBottom: 8 }}>
            <BrainCircuit size={20} /> <span style={{ fontWeight: 700, fontSize: 14 }}>Solution 6</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Knowledge Base</h2>
          <div style={{ flex: 1, marginTop: 16 , position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataQA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-gray-200)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="queries" name="Queries" fill="#D97706" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* ROW 3 */}
        {/* Solution 2: Drawing Scanner with CAD Floor Plan View */}
        <motion.div 
          onClick={() => navigate('/drawing-scanner')}
          whileHover={{ scale: 0.98, borderColor: '#00A9C5', boxShadow: '0 0 20px rgba(0, 169, 197, 0.2)' }}
          style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: '20px 24px', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320, overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, zIndex: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00A9C5', marginBottom: 4 }}>
                <DraftingCompass size={18} /> <span style={{ fontWeight: 700, fontSize: 13 }}>Solution 2</span>
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>Drawing Scanner</h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 12.5, margin: '2px 0 0 0' }}>AI BOQ & Architectural Floor Plan Takeoff</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ background: 'rgba(0, 169, 197, 0.1)', border: '1px solid #00A9C5', color: '#004753', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800 }}>
                98.4% AI Extraction
              </span>
              <span style={{ background: '#004753', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800 }}>
                Level 04 CAD
              </span>
            </div>
          </div>
          
          {/* Interactive CAD Floor Plan Viewport */}
          <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(0, 71, 83, 0.2)', background: '#0D1B2A' }}>
            <img 
              src="/cad_blueprint_floorplan.jpg" 
              alt="CAD Architectural Floor Plan Blueprint" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Blueprint AI Annotation Badges */}
            <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(8, 30, 60, 0.88)', backdropFilter: 'blur(4px)', border: '1px solid #00A9C5', borderRadius: 6, padding: '3px 8px', color: 'white', fontSize: 10.5, fontWeight: 800 }}>
              <span style={{ color: '#00A9C5' }}>Grid 4A-4B</span> • Concrete Slab 200mm
            </div>

            <div style={{ position: 'absolute', bottom: 12, right: 16, background: 'rgba(8, 30, 60, 0.88)', backdropFilter: 'blur(4px)', border: '1px solid #10B981', borderRadius: 6, padding: '3px 8px', color: 'white', fontSize: 10.5, fontWeight: 800 }}>
              <span style={{ color: '#10B981' }}>Div 08</span> • 140 Fire Doors Tagged
            </div>

            <div style={{ position: 'absolute', top: 12, right: 16, background: 'rgba(8, 30, 60, 0.88)', backdropFilter: 'blur(4px)', border: '1px solid #D97706', borderRadius: 6, padding: '3px 8px', color: 'white', fontSize: 10.5, fontWeight: 800 }}>
              <span style={{ color: '#F59E0B' }}>BOQ</span> • 2,230 Entities
            </div>
          </div>
        </motion.div>

        {/* Solution 5: Document Drafting */}
        <motion.div 
          onClick={() => navigate('/document-drafting')}
          whileHover={{ scale: 0.98, borderColor: '#00556A', boxShadow: '0 0 20px rgba(0, 85, 106, 0.2)' }}
          style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00556A', marginBottom: 8 }}>
            <FileSignature size={20} /> <span style={{ fontWeight: 700, fontSize: 14 }}>Solution 5</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Document Drafting</h2>
          <div style={{ flex: 1, marginTop: 16 , position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={dataDrafting} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }} width={70} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" name="Generated" fill="#007A8A" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* Activity Feed (Bottom Right, Spans 2 Rows) */}
        <motion.div style={{ gridColumn: '4', gridRow: '2 / span 2', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="#00556A" /> Live Activity Stream
          </h3>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, flex: 1, overflowY: 'auto', paddingLeft: 4 }}>
            {/* Timeline Vertical Line */}
            <div style={{ position: 'absolute', top: 8, bottom: 8, left: 8, width: 2, background: 'var(--color-gray-200)', zIndex: 0 }} />
            
            {[
              { time: '14:32', desc: 'Missing hard hat — CAM-07', type: '#DC2626' },
              { time: '14:31', desc: 'Query — delay notice period', type: '#00A9C5' },
              { time: '14:26', desc: 'Reviewed — Notice of Delay', type: '#D97706' },
              { time: '14:12', desc: 'Indexed — 6 new documents', type: '#00875A' },
              { time: '13:45', desc: 'New clash detected (Str/MEP)', type: '#DC2626' },
              { time: '13:10', desc: 'S-Curve updated for August', type: '#00875A' },
              { time: '12:30', desc: 'Material delivery: Rebar', type: '#00556A' },
              { time: '11:15', desc: 'Drone flight completed', type: '#004753' },
              { time: '10:05', desc: 'Safety audit passed', type: '#00875A' },
            ].map((act, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: act.type, marginTop: 4, boxShadow: `0 0 12px ${act.type}`, border: '2px solid white' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-gray-500)', fontWeight: 600 }}>{act.time}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-gray-900)', lineHeight: 1.4 }}>{act.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
