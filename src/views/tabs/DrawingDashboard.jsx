import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, CheckCircle2, AlertTriangle, Download, Filter, Zap, FileText, 
  ChevronRight, Target, Scaling, Cpu, Compass, Maximize2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Treemap, Cell, RadialBarChart, RadialBar, Legend,
  LineChart, Line
} from 'recharts';

// --- CSI MASTERFORMAT TREEMAP DATASET ---
const csiTreemapData = [
  {
    name: 'Div 03: Concrete & Slabs',
    size: 890,
    color: '#004753',
    pct: '40%',
    items: '420 m³ Cast-in-place, 470 m² Post-Tension Slab'
  },
  {
    name: 'Div 05: Structural Metals',
    size: 450,
    color: '#00556A',
    pct: '20%',
    items: '310 Columns, 140 Tie Beams'
  },
  {
    name: 'Div 08: Openings & Doors',
    size: 380,
    color: '#00A9C5',
    pct: '17%',
    items: '240 Fire Doors, 140 Acoustic Panels'
  },
  {
    name: 'Div 09: Finishes & Partitions',
    size: 320,
    color: '#D97706',
    pct: '14%',
    items: '180 Drywall LF, 140 Marble Tiles'
  },
  {
    name: 'Div 22: MEP Plumbing & Risers',
    size: 190,
    color: '#4B637F',
    pct: '9%',
    items: '110 Waste Risers, 80 Storm Drains'
  },
];

// --- AI CONFIDENCE ENVELOPE / ERROR-BAND CURVE DATASET ---
const confidenceEnvelopeData = [
  { sheetIdx: 'Sh 01-10', mean: 98.4, upper: 99.6, lower: 96.8, density: 42 },
  { sheetIdx: 'Sh 11-20', mean: 97.8, upper: 99.2, lower: 95.4, density: 58 },
  { sheetIdx: 'Sh 21-30', mean: 96.2, upper: 98.5, lower: 93.8, density: 74 },
  { sheetIdx: 'Sh 31-40', mean: 98.9, upper: 99.8, lower: 97.5, density: 36 },
  { sheetIdx: 'Sh 41-50', mean: 97.4, upper: 98.9, lower: 94.6, density: 62 },
  { sheetIdx: 'Sh 51-60', mean: 99.1, upper: 99.9, lower: 98.0, density: 28 },
];

// --- POLAR QUADRANT DISTRIBUTION (Rose Orientation) ---
const polarQuadrantData = [
  { quadrant: 'North Core', value: 84, fill: '#004753', details: '840 Structural Entities' },
  { quadrant: 'East Podia', value: 68, fill: '#00A9C5', details: '680 Structural Entities' },
  { quadrant: 'South Facade', value: 92, fill: '#00556A', details: '920 Structural Entities' },
  { quadrant: 'West Service', value: 54, fill: '#D97706', details: '540 Structural Entities' },
];

// --- AMBIGUITY RESOLUTION FUNNEL PIPELINE ---
const funnelSteps = [
  { stage: '1. CAD Layers Detected', count: 1930, rate: '100%', color: '#004753' },
  { stage: '2. OCR Vector Tokenized', count: 1842, rate: '95.4%', color: '#00556A' },
  { stage: '3. Geometric Validated', count: 1795, rate: '93.0%', color: '#00A9C5' },
  { stage: '4. BOQ Final Takeoff', count: 1746, rate: '90.5%', color: '#059669' },
];

const flaggedAmbiguities = [
  { id: 'DWG-A-104', sheet: 'Level 04 Floor Plan', discipline: 'Architectural', issue: 'Clipped dimension text near Column Grid 4B', severity: 'High', status: 'Pending Review' },
  { id: 'DWG-S-201', sheet: 'Beam & Slab Schedule', discipline: 'Structural', issue: 'Overlapping rebar callout on Beam B-12', severity: 'Critical', status: 'In Triage' },
  { id: 'DWG-M-305', sheet: 'HVAC Ducting Layout', discipline: 'MEP', issue: 'Unreferenced diffuser symbol not found in Legend', severity: 'Medium', status: 'Pending Review' },
  { id: 'DWG-C-012', sheet: 'Site Boundary Plan', discipline: 'Civil', issue: 'Boundary setback measurement scale discrepancy (1:100 vs 1:200)', severity: 'High', status: 'Resolved' },
];

export const DrawingDashboard = () => {
  const [selectedAmbiguity, setSelectedAmbiguity] = useState(null);
  const [hoveredTreemap, setHoveredTreemap] = useState(null);
  const [hoverCardPos, setHoverCardPos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Floating Hover Card for Treemap */}
      {hoveredTreemap && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, Math.min(window.innerHeight - 130, hoverCardPos.y - 100)), 
          left: Math.max(10, Math.min(window.innerWidth - 260, hoverCardPos.x + 14)), 
          zIndex: 9999, 
          pointerEvents: 'none',
          background: 'rgba(8, 30, 60, 0.96)', 
          backdropFilter: 'blur(8px)',
          color: 'white', 
          padding: '10px 14px', 
          borderRadius: 10, 
          fontSize: 12, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.15)',
          minWidth: 220
        }}>
          <div style={{ fontWeight: 600, color: '#00A9C5', marginBottom: 2 }}>
            {hoveredTreemap.name}
          </div>
          <div style={{ fontSize: 11.5 }}>
            Quantity: <strong>{hoveredTreemap.size} Entities ({hoveredTreemap.pct})</strong>
          </div>
          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 11, color: '#94A3B8' }}>
            {hoveredTreemap.items}
          </div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Drawing Scanner & CAD Takeoff Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Hierarchical CSI MasterFormat treemap partition, AI neural confidence envelope, and quadrant rose analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a 
            href="/drawing-scanner/projects"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, textDecoration: 'none', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            Launch CAD Takeoff Engine <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Top KPI Stats (4 Cards with Dynamic Sparklines & Hover Info) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Blueprint Sheets', value: '1,215', trend: '+12%', sub: 'DWG / DXF / Vector PDF', icon: <Layers size={20} />, color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', sparkline: [{d: 'W1', v: 900}, {d: 'W2', v: 980}, {d: 'W3', v: 1050}, {d: 'W4', v: 1120}, {d: 'W5', v: 1180}, {d: 'W6', v: 1215}] },
          { label: 'AI Extraction Accuracy', value: '98.4%', trend: '+0.5%', sub: 'Neural Vision Model v4', icon: <CheckCircle2 size={20} />, color: '#00A9C5', bg: 'rgba(0, 169, 197, 0.1)', sparkline: [{d: 'W1', v: 96.5}, {d: 'W2', v: 97.0}, {d: 'W3', v: 97.4}, {d: 'W4', v: 97.9}, {d: 'W5', v: 98.2}, {d: 'W6', v: 98.4}] },
          { label: 'CSI Quantities Parsed', value: '2,230', trend: '+450', sub: 'MasterFormat 50 Divs', icon: <Zap size={20} />, color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', sparkline: [{d: 'W1', v: 1400}, {d: 'W2', v: 1620}, {d: 'W3', v: 1780}, {d: 'W4', v: 1950}, {d: 'W5', v: 2100}, {d: 'W6', v: 2230}] },
          { label: 'Unresolved Ambiguities', value: '49', trend: '-12', sub: 'Human Triage Required', icon: <AlertTriangle size={20} />, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', sparkline: [{d: 'W1', v: 85}, {d: 'W2', v: 72}, {d: 'W3', v: 68}, {d: 'W4', v: 59}, {d: 'W5', v: 54}, {d: 'W6', v: 49}] },
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -3 }} 
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', 
              padding: '16px 18px', 
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
                <span style={{ fontSize: 22, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{kpi.value}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: kpi.trend.startsWith('+') ? '#059669' : '#004753', background: kpi.trend.startsWith('+') ? '#ECFDF5' : 'rgba(0,71,83,0.08)', padding: '1px 6px', borderRadius: 10 }}>
                  {kpi.trend}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#081E3C', fontWeight: 700, marginTop: 3 }}>{kpi.label}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{kpi.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: CSI MasterFormat Treemap (60%) + Polar Quadrant Rose (40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 350 }}>
        
        {/* Chart 1: Interactive CSI MasterFormat Treemap Hierarchy */}
        <div onMouseLeave={() => setHoveredTreemap(null)} style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  CSI MasterFormat Takeoff Treemap Partition
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  DIV 03-22
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Area-scaled material density partition extracted across CAD architectural layers
              </p>
            </div>
          </div>

          <div onMouseLeave={() => setHoveredTreemap(null)} style={{ flex: 1, position: 'relative', minHeight: 220 }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', gap: 6 }}
            >
              {/* Col 1: Div 03: Concrete & Cast-in-Place (40%) */}
              <div 
                onMouseEnter={(e) => {
                  setHoveredTreemap(csiTreemapData[0]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setHoveredTreemap(csiTreemapData[0]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredTreemap(null)}
                style={{ 
                  flex: '38', 
                  background: csiTreemapData[0].color, 
                  borderRadius: 8, 
                  padding: '12px 14px', 
                  color: 'white', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  transition: 'filter 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Div 03: Concrete &...
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 2 }}>
                  890 Items (40%)
                </div>
              </div>

              {/* Col 2: Div 05: Structural Steel & Framing (20%) */}
              <div 
                onMouseEnter={(e) => {
                  setHoveredTreemap(csiTreemapData[1]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setHoveredTreemap(csiTreemapData[1]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredTreemap(null)}
                style={{ 
                  flex: '19', 
                  background: csiTreemapData[1].color, 
                  borderRadius: 8, 
                  padding: '12px 14px', 
                  color: 'white', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  transition: 'filter 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Div 05: Structural...
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 2 }}>
                  450 Items (20%)
                </div>
              </div>

              {/* Col 3: Div 08: Openings & Doors (17%) */}
              <div 
                onMouseEnter={(e) => {
                  setHoveredTreemap(csiTreemapData[2]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setHoveredTreemap(csiTreemapData[2]);
                  setHoverCardPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredTreemap(null)}
                style={{ 
                  flex: '16', 
                  background: csiTreemapData[2].color, 
                  borderRadius: 8, 
                  padding: '12px 14px', 
                  color: 'white', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  transition: 'filter 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Div 08: Openings &...
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 2 }}>
                  380 Items (17%)
                </div>
              </div>

              {/* Col 4: Stacked Div 09 (Top, 14%) and Div 22 (Bottom, 9%) */}
              <div style={{ flex: '27', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Top: Div 09: Finishes & Partitions */}
                <div 
                  onMouseEnter={(e) => {
                    setHoveredTreemap(csiTreemapData[3]);
                    setHoverCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setHoveredTreemap(csiTreemapData[3]);
                    setHoverCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredTreemap(null)}
                  style={{ 
                    flex: '60', 
                    background: csiTreemapData[3].color, 
                    borderRadius: 8, 
                    padding: '12px 14px', 
                    color: 'white', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transition: 'filter 0.15s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Div 09: Finishes &...
                  </div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 2 }}>
                    320 Items (14%)
                  </div>
                </div>

                {/* Bottom: Div 22: MEP Plumbing & Risers */}
                <div 
                  onMouseEnter={(e) => {
                    setHoveredTreemap(csiTreemapData[4]);
                    setHoverCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setHoveredTreemap(csiTreemapData[4]);
                    setHoverCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredTreemap(null)}
                  style={{ 
                    flex: '40', 
                    background: csiTreemapData[4].color, 
                    borderRadius: 8, 
                    padding: '10px 14px', 
                    color: 'white', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transition: 'filter 0.15s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Div 22: MEP Plumbi...
                  </div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 2 }}>
                    190 Items (9%)
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chart 2: Polar Quadrant Rose Orientation with Tooltip */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Building Quadrant Element Density
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Angular distribution per structural wing
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="36%" 
                  innerRadius="20%" 
                  outerRadius="68%" 
                  data={polarQuadrantData} 
                  startAngle={180} 
                  endAngle={-180}
                >
                  <RechartsTooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(8, 30, 60, 0.95)', color: 'white', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{d.quadrant}</div>
                          <div style={{ color: '#CBD5E1', marginTop: 2 }}>{d.details} ({d.value}% capacity)</div>
                        </div>
                      );
                    }}
                  />
                  <RadialBar 
                    minAngle={15} 
                    background={{ fill: 'rgba(0, 71, 83, 0.06)' }} 
                    clockWise 
                    dataKey="value" 
                    cornerRadius={6}
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

      {/* Row 3: Neural Confidence Error-Band Curve (55%) + Ambiguity Resolution Funnel (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 320 }}>
        
        {/* Chart 3: AI Neural Confidence Envelope Curve with Shaded Error Bands */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Neural Vision Confidence Envelope vs Sheet Density
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Mean recognition confidence % with shaded upper/lower Bollinger uncertainty bands
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceEnvelopeData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="sheetIdx" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[90, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                    formatter={(val, name) => [`${val}%`, name === 'mean' ? 'Mean AI Confidence' : name === 'upper' ? 'Upper Bound' : 'Lower Bound']}
                  />
                  <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#bandGrad)" />
                  <Area type="monotone" dataKey="lower" stroke="transparent" fill="#fff" />
                  <Line type="monotone" dataKey="mean" stroke="#004753" strokeWidth={3} dot={{ r: 4, fill: '#004753' }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: Multi-Stage Ambiguity Resolution Pipeline Funnel */}
        <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Takeoff Ingestion Pipeline Funnel
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Conversion from raw CAD entities to verified BOQ line items
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            {funnelSteps.map((step, idx) => {
              const widthPct = 100 - idx * 10;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                    <span>{step.stage}</span>
                    <span style={{ color: step.color }}>{step.count.toLocaleString()} ({step.rate})</span>
                  </div>
                  <div style={{ width: '100%', height: 16, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${widthPct}%`, 
                        height: '100%', 
                        background: step.color, 
                        borderRadius: 6,
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 4: Ambiguities Queue */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Recent Unresolved Ambiguities & Symbol Conflicts
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              CAD sheets requiring human confirmation to complete BOQ takeoff export
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '4px 10px', borderRadius: 14 }}>
            49 Active Flags
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {flaggedAmbiguities.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedAmbiguity(item)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 14px', 
                borderRadius: 10, 
                background: '#F8FAFC', 
                border: '1px solid #E2E8F0', 
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 34, height: 34, borderRadius: 8, 
                  background: item.severity === 'Critical' ? '#FEE2E2' : item.severity === 'High' ? '#FEF3C7' : '#EFF6FF', 
                  color: item.severity === 'Critical' ? '#DC2626' : item.severity === 'High' ? '#D97706' : '#00A9C5', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    {item.id} • <span style={{ color: '#004753' }}>{item.sheet}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#64748B', background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>
                      {item.discipline}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 600, marginTop: 2 }}>
                    {item.issue}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ 
                  fontSize: 11, fontWeight: 800, 
                  color: item.status === 'Resolved' ? '#059669' : '#D97706',
                  background: item.status === 'Resolved' ? '#ECFDF5' : '#FEF3C7',
                  padding: '3px 8px', borderRadius: 12 
                }}>
                  {item.status}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Review <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DrawingDashboard;
