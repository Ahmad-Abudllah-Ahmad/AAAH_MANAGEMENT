import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, Legend, 
  RadialBarChart, RadialBar 
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, Clock, TrendingDown, Layers, Box, Filter, 
  ChevronRight, Activity, ShieldCheck, Flame, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MULTI-TRADE 5x5 INTERSECTION MATRIX DATASET ---
const tradesList = ['Structural', 'HVAC Ducting', 'Plumbing/Piping', 'Electrical Cable', 'Facade Envelope'];
const tradeIntersectionMatrix = [
  [0, 48, 34, 28, 12], // Structural
  [48, 0, 56, 42, 8],  // HVAC (Highest overlap with Structure/Plumbing)
  [34, 56, 0, 38, 4],  // Plumbing
  [28, 42, 38, 0, 6],  // Electrical
  [12, 8, 4, 6, 0],    // Facade
];

// --- STEP-STAIRCASE CUMULATIVE BURNDOWN WATERFALL DATASET ---
const staircaseBurndownData = [
  { sprint: 'Sprint 1', identified: 420, resolved: 180, netOpen: 240 },
  { sprint: 'Sprint 2', identified: 680, resolved: 410, netOpen: 270 },
  { sprint: 'Sprint 3', identified: 890, resolved: 680, netOpen: 210 },
  { sprint: 'Sprint 4', identified: 1040, resolved: 890, netOpen: 150 },
  { sprint: 'Sprint 5 (Curr)', identified: 1180, resolved: 1038, netOpen: 142 },
];

// --- TRADE RESOLUTION VELOCITY ---
const tradeVelocityData = [
  { trade: 'MEP vs Structure', avgDays: 2.8, target: 4.0, volume: 82 },
  { trade: 'HVAC vs Plumbing', avgDays: 3.4, target: 4.0, volume: 56 },
  { trade: 'Electrical vs Beams', avgDays: 2.1, target: 3.5, volume: 48 },
  { trade: 'Facade vs Slab Edge', avgDays: 4.2, target: 5.0, volume: 24 },
  { trade: 'Fire Sprinkler Risers', avgDays: 1.8, target: 3.0, volume: 18 },
];

// --- RADIAL SPEEDOMETER GAUGES ---
const clashGaugeData = [
  { name: 'Resolution SLA', value: 92.4, fill: '#004753', desc: 'Average turnaround SLA benchmark compliance' },
  { name: 'BCF OpenBIM Sync', value: 98.6, fill: '#00A9C5', desc: 'Real-time synchronization across BIM authoring tools' },
  { name: 'Clash Clearance %', value: 86.8, fill: '#D97706', desc: 'Spatial tolerance buffer validation score' },
];

const priorityClashQueue = [
  { id: 'CLSH-0412', pair: 'HVAC Supply Duct 800x400 vs Main Transfer Girder G-04', level: 'Level 04 Podia', discipline: 'Structure / HVAC', severity: 'Critical Hard Clash', tolerance: '-180 mm', assignee: 'Arabtec / Voltas MEP' },
  { id: 'CLSH-0418', pair: 'Chilled Water Return Pipe DN150 vs Fire Damper Frame', level: 'Level 06 Core', discipline: 'Plumbing / HVAC', severity: 'Major Overlap', tolerance: '-65 mm', assignee: 'BK Gulf MEP' },
  { id: 'CLSH-0422', pair: 'Cable Tray 400mm vs Steel Truss Diagonal Member', level: 'Roof Plantroom', discipline: 'Electrical / Steel', severity: 'Clearance Deficit', tolerance: '+20 mm (<50 req)', assignee: 'Apex Steel' },
  { id: 'CLSH-0430', pair: 'Curtain Wall Anchor Bracket vs Perimeter Column Rebar', level: 'Level 14 Facade', discipline: 'Facade / Structure', severity: 'Critical Hard Clash', tolerance: '-45 mm', assignee: 'Alumco / Doka' },
];

export const ClashDetectionDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [hoveredMatrixCell, setHoveredMatrixCell] = useState(null);
  const [matrixCardPos, setMatrixCardPos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Floating Hover Card for 5x5 Clash Matrix */}
      {hoveredMatrixCell && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, matrixCardPos.y - 75), 
          left: Math.max(10, Math.min(window.innerWidth - 260, matrixCardPos.x - 110)), 
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
          <div style={{ fontWeight: 800, color: '#00A9C5' }}>{hoveredMatrixCell.trade1} ⇄ {hoveredMatrixCell.trade2}</div>
          <div style={{ marginTop: 2 }}>Spatial Interferences: <strong style={{ color: hoveredMatrixCell.val >= 40 ? '#F87171' : '#10B981' }}>{hoveredMatrixCell.val} Hard Clashes</strong></div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            BIM Clash Coordination & Cross-Discipline Matrix
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Multi-trade interference heatmap, step-staircase burndown velocity, and automated BCF issue triage
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a 
            href="/clash-detection/models"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 800, fontSize: 12.5, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            Launch 3D BIM Viewer <ChevronRight size={14} />
          </a>
          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', outline: 'none', background: 'white', fontWeight: 700, fontSize: 12.5, color: '#081E3C' }}
          >
            <option value="All Projects">All UAE BIM Models</option>
            <option value="Al Wasl Commercial High-Rise">Al Wasl Commercial High-Rise</option>
            <option value="Etihad Rail Freight Depot">Etihad Rail Freight Depot</option>
            <option value="Dubai Creek Harbour Towers">Dubai Creek Harbour Towers</option>
          </select>
        </div>
      </div>

      {/* Top KPI Cards with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Critical Clashes', value: '142 Open', trend: '-8.5%', sub: 'Level 04 MEP / Structure', color: '#DC2626', bg: '#FEF2F2', icon: <AlertTriangle size={20} />, sparkline: [{d: 'W1', v: 185}, {d: 'W2', v: 172}, {d: 'W3', v: 168}, {d: 'W4', v: 154}, {d: 'W5', v: 148}, {d: 'W6', v: 142}] },
          { label: 'Sprint Burndown Velocity', value: '1,038 Resolved', trend: '+142 Clashes', sub: '92% Closeout Target', color: '#059669', bg: '#ECFDF5', icon: <CheckCircle size={20} />, sparkline: [{d: 'W1', v: 620}, {d: 'W2', v: 740}, {d: 'W3', v: 820}, {d: 'W4', v: 910}, {d: 'W5', v: 980}, {d: 'W6', v: 1038}] },
          { label: 'Mean Turnaround Time', value: '2.8 Days', trend: '-0.6 Days', sub: 'ISO 19650 SLA Target', color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', icon: <Clock size={20} />, sparkline: [{d: 'W1', v: 4.2}, {d: 'W2', v: 3.8}, {d: 'W3', v: 3.5}, {d: 'W4', v: 3.1}, {d: 'W5', v: 2.9}, {d: 'W6', v: 2.8}] },
          { label: 'ISO 19650 Compliance', value: '+34% Velocity', trend: '+5.2%', sub: 'Model Integrity Rating', color: '#00A9C5', bg: 'rgba(0, 169, 197, 0.1)', icon: <TrendingDown size={20} />, sparkline: [{d: 'W1', v: 22}, {d: 'W2', v: 25}, {d: 'W3', v: 28}, {d: 'W4', v: 30}, {d: 'W5', v: 32}, {d: 'W6', v: 34}] },
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

      {/* Row 2: 5x5 Cross-Discipline Matrix Heatmap (58%) + Step-Staircase Burndown (42%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 340 }}>
        
        {/* Chart 1: Cross-Discipline Clash Intersection Matrix */}
        <div onMouseLeave={() => setHoveredMatrixCell(null)} style={{ flex: '0 0 58%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  Multi-Trade Cross-Discipline Clash Matrix
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  5x5 INTERSECTION
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Spatial interferences detected across IFC4 trade models
              </p>
            </div>
          </div>

          <div onMouseLeave={() => setHoveredMatrixCell(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Column Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '130px repeat(5, 1fr)', gap: 6, fontSize: 11, fontWeight: 800, color: '#64748B', textAlign: 'center' }}>
              <span />
              {tradesList.map((t, idx) => (
                <span key={idx} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.split(' ')[0]}
                </span>
              ))}
            </div>

            {/* Matrix Rows */}
            {tradesList.map((rowTrade, rIdx) => (
              <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '130px repeat(5, 1fr)', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rowTrade}
                </span>
                {tradeIntersectionMatrix[rIdx].map((val, cIdx) => {
                  const isSelf = rIdx === cIdx;
                  const isHigh = val >= 40;
                  const isMed = val >= 20 && val < 40;
                  return (
                    <div
                      key={cIdx}
                      onMouseEnter={(e) => {
                        if (!isSelf) {
                          setHoveredMatrixCell({ trade1: rowTrade, trade2: tradesList[cIdx], val });
                          setMatrixCardPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (!isSelf) {
                          setMatrixCardPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => setHoveredMatrixCell(null)}
                      style={{
                        height: 30,
                        borderRadius: 6,
                        background: isSelf ? '#F1F5F9' : isHigh ? '#FEE2E2' : isMed ? '#FEF3C7' : val > 0 ? 'rgba(0, 71, 83, 0.08)' : '#F8FAFC',
                        border: isSelf ? '1px dashed #CBD5E1' : isHigh ? '1px solid #FECACA' : isMed ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                        color: isSelf ? '#94A3B8' : isHigh ? '#DC2626' : isMed ? '#D97706' : '#004753',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: isSelf ? 'default' : 'pointer'
                      }}
                    >
                      {isSelf ? '—' : val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Step-Staircase Burndown Waterfall */}
        <div style={{ flex: '0 0 calc(42% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Cumulative Burndown Waterfall
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Weekly identified vs resolved clashes and net balance
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staircaseBurndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004753" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Area type="stepAfter" dataKey="resolved" name="Resolved Clashes" stroke="#004753" fill="url(#resGrad)" />
                  <Area type="stepAfter" dataKey="netOpen" name="Net Open Remaining" stroke="#DC2626" fill="url(#openGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Trade Turnaround Velocity (55%) + Radial Speedometer Gauges (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 300 }}>
        
        {/* Chart 3: Trade Resolution Velocity Bar Chart */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Resolution Velocity by Trade Intersection (Days)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Actual resolution days vs ISO coordination SLA target
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradeVelocityData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" unit="d" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis dataKey="trade" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#081E3C', fontWeight: 700 }} width={130} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Bar dataKey="avgDays" name="Actual Avg Days" fill="#004753" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: Radial Speedometer Rings */}
        <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Multi-Trade Coordination Index
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              OpenBIM standard compliance & clash tolerance
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="45%" 
                  innerRadius="25%" 
                  outerRadius="75%" 
                  data={clashGaugeData} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RechartsTooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(8, 30, 60, 0.95)', color: 'white', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{d.name}: {d.value}%</div>
                          <div style={{ color: '#CBD5E1', fontSize: 11, marginTop: 2 }}>{d.desc}</div>
                        </div>
                      );
                    }}
                  />
                  <RadialBar 
                    minAngle={15} 
                    background={{ fill: 'rgba(0, 71, 83, 0.06)' }} 
                    clockWise 
                    dataKey="value" 
                    cornerRadius={8}
                  />
                  <Legend 
                    iconSize={8} 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ bottom: 0, left: 0, right: 0, fontSize: 11, fontWeight: 700, color: '#081E3C' }} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Priority Clashes Triage Queue */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Priority Clashes Requiring Trade Workshop Triage
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              High-severity multi-trade interferences on critical structural elements
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 12 }}>
            142 Critical Clashes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {priorityClashQueue.map((clsh, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 20px', 
                borderBottom: idx < priorityClashQueue.length - 1 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 34, height: 34, borderRadius: 8, 
                  background: clsh.severity.includes('Critical') ? '#FEF2F2' : '#FFFBEB',
                  color: clsh.severity.includes('Critical') ? '#DC2626' : '#D97706',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    {clsh.id} • <span style={{ color: '#004753' }}>{clsh.level}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#64748B', background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>
                      {clsh.discipline}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 600, marginTop: 2 }}>
                    {clsh.pair} ({clsh.tolerance})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                  {clsh.assignee}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Open BCF <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ClashDetectionDashboard;
