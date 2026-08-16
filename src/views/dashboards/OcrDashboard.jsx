import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight, 
  ChevronRight, ExternalLink, Zap, ShieldCheck, Eye, Layers, TrendingUp, Activity, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- CANDLESTICK / FINANCIAL BATCH VOLATILITY DATASET ---
const candlestickBatchData = [
  { time: '08:00', open: 1.4, high: 2.1, low: 1.1, close: 1.8, volume: 140, isBullish: true, autoRate: 92 },
  { time: '10:00', open: 1.8, high: 2.6, low: 1.5, close: 2.4, volume: 320, isBullish: true, autoRate: 94 },
  { time: '12:00', open: 2.4, high: 2.8, low: 1.9, close: 2.1, volume: 480, isBullish: false, autoRate: 89 },
  { time: '14:00', open: 2.1, high: 3.2, low: 1.8, close: 2.9, volume: 560, isBullish: true, autoRate: 95 },
  { time: '16:00', open: 2.9, high: 3.0, low: 2.2, close: 2.3, volume: 410, isBullish: false, autoRate: 91 },
  { time: '18:00', open: 2.3, high: 2.5, low: 1.4, close: 1.6, volume: 220, isBullish: false, autoRate: 96 },
  { time: '20:00', open: 1.6, high: 1.9, low: 1.0, close: 1.2, volume: 90, isBullish: false, autoRate: 98 },
];

// --- 24-HOUR INGESTION HEATMAP DATASET ---
const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapTimes = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
const heatmapMatrix = [
  [8, 24, 180, 240, 140, 32],  // Mon
  [12, 38, 220, 310, 190, 45], // Tue
  [15, 45, 290, 380, 210, 52], // Wed
  [10, 32, 240, 330, 180, 40], // Thu
  [18, 50, 340, 420, 260, 68], // Fri (Peak)
  [4, 12, 65, 80, 45, 14],     // Sat
  [2, 8, 40, 55, 30, 10],      // Sun
];

// --- CONCENTRIC RADIAL GAUGE METRICS ---
const radialGaugeData = [
  { name: 'FTA Checksum', value: 99.2, fill: '#004753', description: 'Tax Registration TRN cryptographic checksum' },
  { name: 'AI Vision OCR', value: 98.4, fill: '#00A9C5', description: 'Neural boundary & table extraction score' },
  { name: '3-Way Match', value: 92.6, fill: '#00556A', description: 'Invoice vs PO vs GRN automatic reconciliation' },
  { name: 'Auto-Approved', value: 88.5, fill: '#D97706', description: 'Straight-through ERP export without triage' },
];

// --- MULTI-STREAM DOCUMENT FLOW DATASET ---
const streamWaveData = [
  { period: 'W1', invoices: 840, grn: 420, pos: 310, certs: 140 },
  { period: 'W2', invoices: 980, grn: 490, pos: 380, certs: 165 },
  { period: 'W3', invoices: 1240, grn: 610, pos: 440, certs: 210 },
  { period: 'W4', invoices: 1110, grn: 540, pos: 390, certs: 180 },
  { period: 'W5', invoices: 1380, grn: 720, pos: 510, certs: 245 },
  { period: 'W6', invoices: 1520, grn: 790, pos: 560, certs: 280 },
];

const recentExceptions = [
  { id: 'INV-24817', vendor: 'Al Noor Building Materials LLC', error: 'Qty Variance (GRN 240 vs Inv 260)', time: '10m ago', severity: 'Critical', val: 'AED 184,200' },
  { id: 'EXC-001', vendor: 'Fast Fixings Ltd', error: 'Blurry Image Scan (<150 DPI)', time: '45m ago', severity: 'High', val: 'AED 34,500' },
  { id: 'EXC-002', vendor: 'Unknown Vendor (No TRN)', error: 'Missing PO Reference Number', time: '1h ago', severity: 'Critical', val: 'AED 512,000' },
  { id: 'EXC-003', vendor: 'Steel & Co Trading PJSC', error: 'Rate Variance (3,450 vs 3,100 AED)', time: '2h ago', severity: 'High', val: 'AED 94,800' },
  { id: 'EXC-004', vendor: 'BuildMat Corp LLC', error: 'FTA TRN Checksum Failed', time: '4h ago', severity: 'Medium', val: 'AED 18,200' },
];

export const OcrDashboard = () => {
  const [selectedException, setSelectedException] = useState(null);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [hoverCardPos, setHoverCardPos] = useState({ x: 0, y: 0 });
  const [hoveredHeatCell, setHoveredHeatCell] = useState(null);
  const [heatCardPos, setHeatCardPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Dynamic Floating Hover Card for Candlestick */}
      {hoveredCandle && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, hoverCardPos.y - 120), 
          left: Math.max(10, Math.min(window.innerWidth - 240, hoverCardPos.x - 100)), 
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
          minWidth: 190
        }}>
          <div style={{ fontWeight: 800, color: '#00A9C5', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{hoveredCandle.time} Batch</span>
            <span style={{ color: hoveredCandle.isBullish ? '#10B981' : '#F87171' }}>
              {hoveredCandle.isBullish ? '▲ Bullish' : '▼ High Latency'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px', fontSize: 11.5 }}>
            <div>Open: <strong>{hoveredCandle.open}s</strong></div>
            <div>Close: <strong>{hoveredCandle.close}s</strong></div>
            <div>High: <strong>{hoveredCandle.high}s</strong></div>
            <div>Low: <strong>{hoveredCandle.low}s</strong></div>
          </div>
          <div style={{ marginTop: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span>Volume: <strong>{hoveredCandle.volume} docs</strong></span>
            <span style={{ color: '#10B981' }}>Match: <strong>{hoveredCandle.autoRate}%</strong></span>
          </div>
        </div>
      )}

      {/* Dynamic Floating Hover Card for Heatmap */}
      {hoveredHeatCell && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, heatCardPos.y - 75), 
          left: Math.max(10, Math.min(window.innerWidth - 220, heatCardPos.x - 90)), 
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
          <div style={{ fontWeight: 800, color: '#00A9C5' }}>{hoveredHeatCell.day} • {hoveredHeatCell.time}</div>
          <div style={{ marginTop: 2 }}>Intake Volume: <strong style={{ color: '#10B981' }}>{hoveredHeatCell.val} Documents</strong></div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Document OCR & Financial Processing Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Multi-tier 3-way matching, cryptographic processing candlestick volatility, and automated AP triage
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => navigate('/document-processing/matching')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', 
              background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', 
              fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' 
            }}
          >
            Launch 3-Way Match <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Blocks with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Invoices Processed', value: '1,428', trend: '+14.2%', sub: 'AED 42.8M Total Value', color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', icon: <FileText size={20} />, sparkline: [{d: 'W1', v: 950}, {d: 'W2', v: 1100}, {d: 'W3', v: 1040}, {d: 'W4', v: 1250}, {d: 'W5', v: 1380}, {d: 'W6', v: 1428}] },
          { label: '3-Way Auto Match Rate', value: '92.6%', trend: '+3.8%', sub: 'Straight-Through Processing', color: '#00A9C5', bg: 'rgba(0, 169, 197, 0.1)', icon: <CheckCircle2 size={20} />, sparkline: [{d: 'W1', v: 86}, {d: 'W2', v: 88}, {d: 'W3', v: 87}, {d: 'W4', v: 90}, {d: 'W5', v: 91.5}, {d: 'W6', v: 92.6}] },
          { label: 'Active Exceptions In Triage', value: '18', trend: '-24.0%', sub: 'Avg 4.2h Resolution Time', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', icon: <AlertTriangle size={20} />, sparkline: [{d: 'W1', v: 32}, {d: 'W2', v: 28}, {d: 'W3', v: 29}, {d: 'W4', v: 24}, {d: 'W5', v: 21}, {d: 'W6', v: 18}] },
          { label: 'Mean Neural Latency', value: '0.84s', trend: '-18.5%', sub: 'P99 Vector SLA Benchmark', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', icon: <Zap size={20} />, sparkline: [{d: 'W1', v: 1.2}, {d: 'W2', v: 1.1}, {d: 'W3', v: 0.95}, {d: 'W4', v: 0.9}, {d: 'W5', v: 0.88}, {d: 'W6', v: 0.84}] },
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
                <span style={{ fontSize: 22, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{kpi.value}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: kpi.trend.startsWith('+') ? '#059669' : '#004753', background: kpi.trend.startsWith('+') ? '#ECFDF5' : 'rgba(0,71,83,0.08)', padding: '1px 6px', borderRadius: 10 }}>{kpi.trend}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#081E3C', marginTop: 3 }}>{kpi.label}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{kpi.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Candlestick Volatility (62%) + Radial Concentric Gauges (38%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 350 }}>
        
        {/* Chart 1: Candlestick / Cryptographic Processing Volatility & Volume */}
        <div onMouseLeave={() => setHoveredCandle(null)} style={{ flex: '0 0 62%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  OCR Neural Latency Candlestick & Ingestion Volume
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  OHLC TELEMETRY
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Batch latency spread (Open/High/Low/Close seconds) with transaction volume histogram
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#059669' }} /> Bullish Speed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#DC2626' }} /> Latency Spike
              </span>
            </div>
          </div>

          {/* Non-Jitter Candlestick Canvas */}
          <div onMouseLeave={() => setHoveredCandle(null)} style={{ flex: 1, position: 'relative', minHeight: 220, display: 'flex', flexDirection: 'column' }}>
            <div onMouseLeave={() => setHoveredCandle(null)} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #E2E8F0' }}>
              {candlestickBatchData.map((d, i) => {
                const maxVal = 3.5;
                const minVal = 0.5;
                const range = maxVal - minVal;
                const highY = ((maxVal - d.high) / range) * 140;
                const lowY = ((maxVal - d.low) / range) * 140;
                const topBody = Math.min(d.open, d.close);
                const botBody = Math.max(d.open, d.close);
                const bodyY = ((maxVal - botBody) / range) * 140;
                const bodyH = Math.max(6, ((botBody - topBody) / range) * 140);
                const isHovered = hoveredCandle?.time === d.time;

                return (
                  <div 
                    key={i} 
                    onMouseEnter={(e) => {
                      setHoveredCandle(d);
                      setHoverCardPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setHoverCardPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredCandle(null)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative', width: 44 }}
                  >
                    <svg width="36" height="150" style={{ overflow: 'visible', pointerEvents: 'none' }}>
                      {/* High-Low Wick */}
                      <line 
                        x1="18" y1={highY} 
                        x2="18" y2={lowY} 
                        stroke={d.isBullish ? '#059669' : '#DC2626'} 
                        strokeWidth={isHovered ? 2.5 : 1.5} 
                      />
                      {/* Candle Body */}
                      <rect 
                        x="7" 
                        y={bodyY} 
                        width="22" 
                        height={bodyH} 
                        rx="3"
                        fill={d.isBullish ? '#059669' : '#DC2626'} 
                        stroke={isHovered ? '#081E3C' : 'transparent'}
                        strokeWidth={isHovered ? 2 : 0}
                      />
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isHovered ? '#004753' : '#64748B', marginTop: 4 }}>
                      {d.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Lower Volume Bar Spectrum */}
            <div style={{ height: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', marginTop: 8 }}>
              {candlestickBatchData.map((d, i) => (
                <div key={i} style={{ width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: 22, 
                      height: `${(d.volume / 600) * 40}px`, 
                      background: d.isBullish ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)', 
                      borderRadius: '3px 3px 0 0' 
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Concentric Radial Activity Ring Gauges with Rich Tooltips */}
        <div style={{ flex: '0 0 calc(38% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Multi-Tier AI Compliance Rings
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Concentric validation benchmarks & SLA precision
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
                  data={radialGaugeData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <RechartsTooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(8, 30, 60, 0.95)', color: 'white', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', pointerEvents: 'none' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{d.name}: {d.value}%</div>
                          <div style={{ color: '#CBD5E1', fontSize: 11, marginTop: 2 }}>{d.description}</div>
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

      {/* Row 3: Multi-Stream Flow Wave (55%) + 24-Hour Ingestion Heatmap (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 310 }}>
        
        {/* Chart 3: Multi-Stream Wave Area Flow */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Multi-Stream Construction Payload Flow
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Stacked volume streams across financial classifications
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={streamWaveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004753" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="grnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00A9C5" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="poGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="invoices" name="Tax Invoices" stackId="1" stroke="#004753" fill="url(#invGrad)" />
                  <Area type="monotone" dataKey="grn" name="Delivery GRNs" stackId="1" stroke="#00A9C5" fill="url(#grnGrad)" />
                  <Area type="monotone" dataKey="pos" name="Purchase Orders" stackId="1" stroke="#D97706" fill="url(#poGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: 24-Hour Ingestion Heatmap Matrix Grid (No Layout Shift) */}
        <div onMouseLeave={() => setHoveredHeatCell(null)} style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              24-Hour Document Intake Heatmap
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Day-of-week vs 4-hour batch arrival intensity
            </p>
          </div>

          <div onMouseLeave={() => setHoveredHeatCell(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Column Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '45px repeat(6, 1fr)', gap: 4, textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#64748B' }}>
              <span />
              {heatmapTimes.map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>

            {/* Matrix Rows */}
            {heatmapDays.map((day, rIdx) => (
              <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: '45px repeat(6, 1fr)', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#081E3C' }}>{day}</span>
                {heatmapMatrix[rIdx].map((val, cIdx) => {
                  const intensity = val / 420;
                  return (
                    <div
                      key={cIdx}
                      onMouseEnter={(e) => {
                        setHoveredHeatCell({ day, time: heatmapTimes[cIdx], val });
                        setHeatCardPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        setHeatCardPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredHeatCell(null)}
                      style={{
                        height: 24,
                        borderRadius: 4,
                        background: `rgba(0, 71, 83, ${Math.max(0.1, intensity)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        color: intensity > 0.4 ? 'white' : '#081E3C',
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

      </div>

      {/* Row 4: Priority Exceptions Triage Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Real-Time Document OCR Exceptions Queue
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Invoices requiring human confirmation before SAP / Oracle ERP export
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 12 }}>
            18 Pending Actions
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentExceptions.map((exc, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedException(exc)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 20px', 
                borderBottom: idx < recentExceptions.length - 1 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 34, height: 34, borderRadius: 8, 
                  background: exc.severity === 'Critical' ? '#FEF2F2' : '#FFFBEB',
                  color: exc.severity === 'Critical' ? '#DC2626' : '#D97706',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    {exc.id} • <span style={{ color: '#004753' }}>{exc.vendor}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 600, marginTop: 2 }}>
                    {exc.error}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                  {exc.val}
                </span>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  {exc.time}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Triage <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OcrDashboard;
