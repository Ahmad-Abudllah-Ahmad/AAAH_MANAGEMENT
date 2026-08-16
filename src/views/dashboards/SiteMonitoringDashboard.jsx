import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ReferenceLine 
} from 'recharts';
import { 
  Camera, Users, ShieldAlert, HardHat, AlertTriangle, CheckCircle, Clock, 
  TrendingDown, MapPin, Eye, Play, Maximize2, Activity, Zap, Shield, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ECG / INCIDENT TELEMETRY WAVE DATASET ---
const telemetryWaveData = [
  { time: '06:00', incidents: 1, baseline: 0, threatScore: 12 },
  { time: '08:00', incidents: 4, baseline: 0, threatScore: 38 },
  { time: '10:00', incidents: 8, baseline: 0, threatScore: 78 }, // Peak
  { time: '12:00', incidents: 2, baseline: 0, threatScore: 22 },
  { time: '14:00', incidents: 6, baseline: 0, threatScore: 62 },
  { time: '16:00', incidents: 5, baseline: 0, threatScore: 48 },
  { time: '18:00', incidents: 1, baseline: 0, threatScore: 14 },
  { time: '20:00', incidents: 0, baseline: 0, threatScore: 5 },
];

// --- BIOMETRIC INGRESS VS EGRESS DIVERGING FLOW ---
const ingressEgressFlow = [
  { hour: '06:00', ingress: 140, egress: -10 },
  { hour: '08:00', ingress: 210, egress: -15 },
  { hour: '10:00', ingress: 45, egress: -25 },
  { hour: '12:00', ingress: 60, egress: -180 }, // Lunch break
  { hour: '14:00', ingress: 160, egress: -40 },
  { hour: '16:00', ingress: 30, egress: -95 },
  { hour: '18:00', ingress: 10, egress: -280 }, // Shift end
];

// --- 24/7 IOT ZONE THREAT HEATMAP DATASET ---
const siteZonesList = ['Tower Crane 1', 'Excavation Pit', 'Scaffolding L12', 'Loading Dock', 'Batching Plant', 'Gate 01 Biometric'];
const timeSlices = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
const zoneThreatHeatmap = [
  [0, 1, 6, 8, 4, 0], // Tower Crane
  [0, 2, 8, 12, 5, 1], // Excavation (High risk)
  [0, 0, 9, 7, 6, 0], // Scaffolding L12
  [1, 3, 5, 6, 4, 1], // Loading Dock
  [0, 2, 4, 4, 2, 0], // Batching Plant
  [0, 5, 2, 1, 4, 0], // Gate 01
];

// --- UAE OSHAD / MOHRE REGULATORY RADAR ---
const oshadRegulatoryRadar = [
  { subject: 'PPE & Hard Hats', score: 98.5, target: 95 },
  { subject: 'Fall Protection', score: 94.2, target: 92 },
  { subject: 'Crane Exclusion Zone', score: 99.1, target: 98 },
  { subject: 'Scaffold Anchors', score: 96.0, target: 90 },
  { subject: 'Hot Works & Welding', score: 95.8, target: 94 },
  { subject: 'Dust & Environmental', score: 92.4, target: 88 },
];

const liveSafetyAlerts = [
  { id: 'ALT-108', zone: 'Excavation Pit (Bay 3)', violation: 'Unauthorized Entry (No High-Vis Vest)', time: '4m ago', severity: 'Critical', camera: 'CAM-04 4K Dome' },
  { id: 'ALT-109', zone: 'Tower Crane 1 Slewing Radius', violation: 'Personnel inside Boom Exclusion Zone', time: '12m ago', severity: 'Critical', camera: 'CAM-01 4K PTZ' },
  { id: 'ALT-110', zone: 'Scaffolding Facade L12', violation: 'Harness Lanyard Not Clipped to Life-line', time: '28m ago', severity: 'High', camera: 'CAM-08 4K Mast' },
  { id: 'ALT-111', zone: 'Loading Dock Gate 02', violation: 'Forklift Speeding (>15 km/h)', time: '45m ago', severity: 'Medium', camera: 'CAM-11 4K Gate' },
];

export const SiteMonitoringDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [hoveredHeatCell, setHoveredHeatCell] = useState(null);
  const [heatCardPos, setHeatCardPos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Floating Hover Card for Heatmap */}
      {hoveredHeatCell && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, heatCardPos.y - 75), 
          left: Math.max(10, Math.min(window.innerWidth - 220, heatCardPos.x - 100)), 
          zIndex: 9999, 
          pointerEvents: 'none',
          background: 'rgba(8, 30, 60, 0.96)', 
          backdropFilter: 'blur(8px)',
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: 8, 
          fontSize: 11.5, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.15)',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontWeight: 800, color: '#00A9C5' }}>{hoveredHeatCell.zone}</div>
          <div style={{ marginTop: 2 }}>{hoveredHeatCell.time}: <strong style={{ color: hoveredHeatCell.val >= 8 ? '#F87171' : '#10B981' }}>{hoveredHeatCell.val} Infractions</strong></div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Site Safety & Real-Time Computer Vision Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            24/7 IoT zone threat matrix, ECG safety telemetry wave, and biometric ingress/egress diverging flow
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', outline: 'none', background: 'white', fontWeight: 700, fontSize: 12.5, color: '#081E3C' }}
          >
            <option value="All Projects">All Active UAE Sites</option>
            <option value="Al Wasl Commercial High-Rise">Al Wasl High-Rise (Plot 4)</option>
            <option value="Etihad Rail Freight Depot">Etihad Rail Hub</option>
            <option value="Dubai Creek Harbour Towers">Dubai Creek Towers</option>
          </select>
        </div>
      </div>

      {/* Top KPI Cards with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: '4K AI Neural Streams', value: '15/15 Active', trend: '+100%', sub: 'Zero Latency Loss', color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', icon: <Camera size={20} />, sparkline: [{d: 'W1', v: 12}, {d: 'W2', v: 13}, {d: 'W3', v: 14}, {d: 'W4', v: 15}, {d: 'W5', v: 15}, {d: 'W6', v: 15}] },
          { label: 'On-Site Headcount Today', value: '342 Personnel', trend: '+18%', sub: 'Biometric Verified', color: '#059669', bg: '#ECFDF5', icon: <Users size={20} />, sparkline: [{d: 'W1', v: 210}, {d: 'W2', v: 260}, {d: 'W3', v: 310}, {d: 'W4', v: 345}, {d: 'W5', v: 330}, {d: 'W6', v: 342}] },
          { label: 'Immediate Action Required', value: '4 Critical Flags', trend: '-2 Flags', sub: 'In Active Triage', color: '#DC2626', bg: '#FEF2F2', icon: <ShieldAlert size={20} />, sparkline: [{d: 'W1', v: 8}, {d: 'W2', v: 7}, {d: 'W3', v: 9}, {d: 'W4', v: 6}, {d: 'W5', v: 5}, {d: 'W6', v: 4}] },
          { label: 'UAE OSHAD Compliance', value: '96.8% Safety SLA', trend: '+1.4%', sub: 'Audit Target 95%', color: '#D97706', bg: '#FFFBEB', icon: <HardHat size={20} />, sparkline: [{d: 'W1', v: 94.2}, {d: 'W2', v: 94.8}, {d: 'W3', v: 95.5}, {d: 'W4', v: 96.0}, {d: 'W5', v: 96.4}, {d: 'W6', v: 96.8}] },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            style={{
              padding: '16px 18px',
              background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)',
              borderRadius: 14,
              border: '1px solid var(--color-gray-200)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: 8, borderRadius: 10, background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </div>
              <div style={{ width: 80, height: 30, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.sparkline}>
                      <RechartsTooltip 
                        position={{ y: -26 }}
                        allowEscapeViewBox={{ x: true, y: true }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div style={{ background: 'rgba(8, 30, 60, 0.96)', color: 'white', padding: '3px 7px', borderRadius: 6, fontSize: 10.5, fontWeight: 700, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.15)', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                <span style={{ color: '#CBD5E1' }}>{payload[0].payload.d}: </span>
                                <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{payload[0].value}</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2.2} dot={false} isAnimationActive={true} animationDuration={1200} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{kpi.value}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: kpi.trend.startsWith('+') ? '#059669' : '#004753', background: kpi.trend.startsWith('+') ? '#ECFDF5' : 'rgba(0,71,83,0.08)', padding: '1px 6px', borderRadius: 10 }}>{kpi.trend}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#081E3C', marginTop: 3 }}>{kpi.label}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{kpi.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: 24/7 Zone Threat Heatmap (60%) + ECG Pulse Telemetry (40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 340 }}>
        
        {/* Chart 1: 24/7 Geo-Zone Threat Matrix Heatmap */}
        <div onMouseLeave={() => setHoveredHeatCell(null)} style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  24/7 Geo-Fenced Zone Threat Intensity Matrix
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#DC2626', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  LIVE CV
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Computer vision infraction frequency by site zone vs 4-hour monitoring periods
              </p>
            </div>
          </div>

          <div onMouseLeave={() => setHoveredHeatCell(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Header Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(6, 1fr)', gap: 6, fontSize: 11, fontWeight: 800, color: '#64748B', textAlign: 'center' }}>
              <span />
              {timeSlices.map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>

            {/* Matrix Rows */}
            {siteZonesList.map((zone, rIdx) => (
              <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '150px repeat(6, 1fr)', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#081E3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {zone}
                </span>
                {zoneThreatHeatmap[rIdx].map((val, cIdx) => {
                  const isHigh = val >= 8;
                  const isMed = val >= 4 && val < 8;
                  return (
                    <div
                      key={cIdx}
                      onMouseEnter={(e) => {
                        setHoveredHeatCell({ zone, time: timeSlices[cIdx], val });
                        setHeatCardPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        setHeatCardPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredHeatCell(null)}
                      style={{
                        height: 28,
                        borderRadius: 6,
                        background: isHigh ? '#FEE2E2' : isMed ? '#FEF3C7' : val > 0 ? 'rgba(0, 71, 83, 0.08)' : '#F8FAFC',
                        border: isHigh ? '1px solid #FECACA' : isMed ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                        color: isHigh ? '#DC2626' : isMed ? '#D97706' : val > 0 ? '#004753' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: ECG Telemetry Incident Wave Area Chart */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={18} color="#00A9C5" />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Incident ECG Telemetry Wave
              </h3>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
              Real-time pulse waveform with safety threshold alarm line
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryWaveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ecgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <ReferenceLine y={5} label={{ value: 'Critical Threshold', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }} stroke="#DC2626" strokeDasharray="3 3" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }} 
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                    formatter={(val) => [`${val} Incidents`, 'Frequency']}
                  />
                  <Area type="monotone" dataKey="incidents" stroke="#004753" strokeWidth={2.5} fillOpacity={1} fill="url(#ecgGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Biometric Ingress/Egress Diverging Flow (55%) + UAE OSHAD Radar (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 310 }}>
        
        {/* Chart 3: Biometric Ingress vs Egress Diverging Flow Chart */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Biometric Worker Flow: Ingress (+) vs Egress (-)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Turnstile gate entry spikes (+) vs exit departures (-)
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#004753' }}>+ Ingress</span>
              <span style={{ color: '#D97706' }}>- Egress</span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ingressEgressFlow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <ReferenceLine y={0} stroke="#64748B" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }} 
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Bar dataKey="ingress" name="Entering Site (+)" fill="#004753" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="egress" name="Exiting Site (-)" fill="#D97706" radius={[0, 0, 4, 4]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: UAE OSHAD / MOHRE Regulatory Radar */}
        <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              UAE OSHAD & Dubai Municipality Index
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Automated audit rating vs regulatory benchmark
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={oshadRegulatoryRadar}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#081E3C', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[80, 100]} tick={false} axisLine={false} />
                  <Radar name="Site Audit Score" dataKey="score" stroke="#004753" fill="#004753" fillOpacity={0.4} />
                  <Radar name="OSHAD Standard" dataKey="target" stroke="#00A9C5" fill="#00A9C5" fillOpacity={0.2} />
                  <Legend verticalAlign="bottom" height={26} iconType="circle" wrapperStyle={{ fontSize: 10.5, fontWeight: 700 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }} 
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Live Safety Action Queue */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Live AI Safety Alerts & Immediate Action Queue
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Real-time computer vision incidents detected across 4K site cameras
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 12 }}>
            4 High-Priority Alerts
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {liveSafetyAlerts.map((alert, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 20px', 
                borderBottom: idx < liveSafetyAlerts.length - 1 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 34, height: 34, borderRadius: 8, 
                  background: alert.severity === 'Critical' ? '#FEF2F2' : '#FFFBEB',
                  color: alert.severity === 'Critical' ? '#DC2626' : '#D97706',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    {alert.id} • <span style={{ color: '#004753' }}>{alert.zone}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#64748B', background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>
                      {alert.camera}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 600, marginTop: 2 }}>
                    {alert.violation}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  {alert.time}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Dispatch HSE <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SiteMonitoringDashboard;
