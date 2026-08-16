import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, AreaChart, Area, 
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ReferenceLine, ReferenceArea, Cell
} from 'recharts';
import { 
  TrendingUp, DollarSign, Clock, CheckCircle2, 
  ShieldAlert, ArrowUpRight, ArrowDownRight, 
  Building2, Download, X, Target, Zap
} from 'lucide-react';

// --- EVM S-CURVE WITH MONTE CARLO PREDICTIVE CONE DATASET ---
const evmWithMonteCarloData = [
  { month: 'Jan', pv: 1000, ev: 950, ac: 980, p50: null, p90: null, p10: null },
  { month: 'Feb', pv: 2500, ev: 2300, ac: 2450, p50: null, p90: null, p10: null },
  { month: 'Mar', pv: 4200, ev: 3800, ac: 4100, p50: null, p90: null, p10: null },
  { month: 'Apr', pv: 6000, ev: 5400, ac: 5900, p50: null, p90: null, p10: null },
  { month: 'May (Curr)', pv: 8500, ev: 7200, ac: 7800, p50: 7800, p90: 7800, p10: 7800 },
  // Monte Carlo Forecast Fan Cone (Future Months)
  { month: 'Jun', pv: 11000, ev: null, ac: null, p50: 9900, p90: 10800, p10: 9200 },
  { month: 'Jul', pv: 14500, ev: null, ac: null, p50: 13200, p90: 14800, p10: 12100 },
  { month: 'Aug (Top-out)', pv: 19000, ev: null, ac: null, p50: 17800, p90: 20400, p10: 16200 },
  { month: 'Dec (Target)', pv: 40000, ev: null, ac: null, p50: 42550, p90: 46200, p10: 40500 },
];

// --- 4-QUADRANT DELAY RISK MATRIX DATASET ---
const delayQuadrantData = [
  { name: 'Level 03 Post-Tension Pour', likelihood: 85, costImpact: 420, delayDays: 16, category: 'Structural Concrete' },
  { name: 'Core Climbing Formwork Hydraulic Seal', likelihood: 70, costImpact: 260, delayDays: 7, category: 'Formwork' },
  { name: 'Curtain Wall Bracket Port Clearance', likelihood: 45, costImpact: 190, delayDays: 7, category: 'Facade' },
  { name: 'Tower Crane 1 Slewing Load Test', likelihood: 25, costImpact: 85, delayDays: 4, category: 'Equipment' },
  { name: 'MEP Slab Penetration Redesign', likelihood: 60, costImpact: 340, delayDays: 12, category: 'Design Change' },
  { name: 'High Wind Crane Stoppage', likelihood: 90, costImpact: 120, delayDays: 4, category: 'Weather' },
];

// --- FLOATING MILESTONE DURATION GANTT BARS ---
const milestoneGanttData = [
  { milestone: 'Substructure Handover', start: 1, duration: 8, status: 'Completed', onTime: true, details: 'Poured & Backfilled' },
  { milestone: 'Level 03 Slab Pour', start: 9, duration: 16, status: 'Critical Delay (-16d)', onTime: false, details: 'PT Tendon Stressing' },
  { milestone: 'Tower Core Top-out (L24)', start: 25, duration: 22, status: 'Forecast (-22d)', onTime: false, details: 'Hydraulic Climbing Core' },
  { milestone: 'Façade Weathertight Envelope', start: 47, duration: 14, status: 'Pending Start', onTime: true, details: 'Curtain Wall Units' },
  { milestone: 'Civil Handover & Testing', start: 61, duration: 12, status: 'Contract Rev 03', onTime: true, details: 'DEWA / Civil Defense' },
];

// --- SUBCONTRACTOR PERFORMANCE RADAR ---
const subPerformanceRadar = [
  { metric: 'Schedule SPI', Arabtec: 78, Doka: 94, Apex: 88 },
  { metric: 'Cost CPI', Arabtec: 84, Doka: 96, Apex: 92 },
  { metric: 'QC Tolerance', Arabtec: 98, Doka: 100, Apex: 99 },
  { metric: 'HSE Safety', Arabtec: 100, Doka: 100, Apex: 97 },
  { metric: 'Labor Density', Arabtec: 89, Doka: 100, Apex: 95 },
  { metric: 'RFI Turnaround', Arabtec: 75, Doka: 92, Apex: 86 },
];

export const ProgressDashboard = () => {
  const [hoveredDelayPoint, setHoveredDelayPoint] = useState(null);
  const [delayCardPos, setDelayCardPos] = useState({ x: 300, y: 300 });
  const [hoveredGantt, setHoveredGantt] = useState(null);
  const [ganttCardPos, setGanttCardPos] = useState({ x: 300, y: 300 });

  return (
    <div 
      onMouseMove={(e) => {
        setDelayCardPos({ x: e.clientX, y: e.clientY });
        setGanttCardPos({ x: e.clientX, y: e.clientY });
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      
      {/* Floating Hover Card for Delay Scatter Point */}
      {hoveredDelayPoint && (
        <div style={{ 
          position: 'fixed', 
          top: (delayCardPos.y || 300) - 110, 
          left: (delayCardPos.x || 300) - 110, 
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
          <div style={{ fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{hoveredDelayPoint.name}</div>
          <div style={{ fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{hoveredDelayPoint.trade}</div>
          <div style={{ fontSize: 11.5 }}>Likelihood: <strong>{hoveredDelayPoint.likelihood}%</strong> • Impact: <strong>${hoveredDelayPoint.costImpact}k</strong></div>
          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 11, color: '#F87171', fontWeight: 700 }}>
            Estimated Critical Delay: +{hoveredDelayPoint.delayDays} Days
          </div>
        </div>
      )}

      {/* Floating Hover Card for Gantt Milestone */}
      {hoveredGantt && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, (ganttCardPos.y || 300) - 95), 
          left: Math.max(10, Math.min(window.innerWidth - 240, (ganttCardPos.x || 300) - 110)), 
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
          minWidth: 200
        }}>
          <div style={{ fontWeight: 800, color: '#00A9C5' }}>{hoveredGantt.milestone}</div>
          <div style={{ fontSize: 11, marginTop: 2 }}>Duration: <strong>{hoveredGantt.duration} Days</strong> • {hoveredGantt.details}</div>
          <div style={{ color: hoveredGantt.onTime ? '#10B981' : '#F87171', fontWeight: 700, marginTop: 2 }}>{hoveredGantt.status}</div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 22px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Building2 size={22} color="#004753" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#081E3C', margin: 0 }}>Executive Progress & EVM Monte Carlo Intelligence</h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
                CRITICAL PATH: -27 DAYS
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12.5, margin: '2px 0 0 0' }}>
              Plot 4 Al Barsha Commercial Tower (3B+G+24F) • W21 Cutoff • Monte Carlo Probabilistic Forecast (P10-P90)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none',
              fontWeight: 700, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)'
            }}
          >
            <Download size={14} /> Export EVM Report (.XER)
          </button>
        </div>
      </div>

      {/* Top 4 Executive KPI Metric Cards with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { label: 'Schedule Performance (SPI)', value: '0.86', trend: '-14%', sub: 'Earned W17.4 vs W21.0 Planned', color: '#DC2626', bg: '#FEF2F2', icon: <Clock size={20} />, sparkline: [{d: 'W1', v: 0.98}, {d: 'W2', v: 0.95}, {d: 'W3', v: 0.91}, {d: 'W4', v: 0.89}, {d: 'W5', v: 0.87}, {d: 'W6', v: 0.86}] },
          { label: 'Cost Performance (CPI)', value: '0.94', trend: '-6%', sub: 'Cost Variance: -$600k', color: '#D97706', bg: '#FFFBEB', icon: <DollarSign size={20} />, sparkline: [{d: 'W1', v: 0.99}, {d: 'W2', v: 0.98}, {d: 'W3', v: 0.96}, {d: 'W4', v: 0.95}, {d: 'W5', v: 0.94}, {d: 'W6', v: 0.94}] },
          { label: 'Estimate at Completion', value: '$42.55M', trend: '+$2.55M', sub: 'Baseline Budget: $40.00M', color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', icon: <TrendingUp size={20} />, sparkline: [{d: 'W1', v: 40.0}, {d: 'W2', v: 40.5}, {d: 'W3', v: 41.2}, {d: 'W4', v: 41.8}, {d: 'W5', v: 42.2}, {d: 'W6', v: 42.55}] },
          { label: 'Critical Path Variance', value: '27 Days', trend: 'ACTION REQ.', sub: 'Forecast: Dec 14, 2026', color: '#DC2626', bg: '#FEF2F2', icon: <ShieldAlert size={20} />, sparkline: [{d: 'W1', v: 6}, {d: 'W2', v: 11}, {d: 'W3', v: 16}, {d: 'W4', v: 20}, {d: 'W5', v: 24}, {d: 'W6', v: 27}] },
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
                <span style={{ fontSize: 24, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{kpi.value}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: kpi.trend.includes('-') || kpi.trend.includes('ACTION') ? '#DC2626' : '#059669', background: kpi.trend.includes('-') || kpi.trend.includes('ACTION') ? '#FEF2F2' : '#ECFDF5', padding: '1px 6px', borderRadius: 10 }}>{kpi.trend}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#081E3C', marginTop: 3 }}>{kpi.label}</div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{kpi.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: EVM S-Curve with Monte Carlo Confidence Cone (60%) + 4-Quadrant Delay Scatter Map (40%) */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', minHeight: 350 }}>
        
        {/* Left: EVM S-Curve with Monte Carlo Cone of Uncertainty */}
        <div style={{ flex: '1 1 560px', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#081E3C', margin: 0 }}>
                  EVM S-Curve & Monte Carlo Probabilistic Completion Cone
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  P10-P90 CONFIDENCE
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Planned Value (PV), Earned Value (EV), Actual Cost (AC) with fan cone</span>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#004753' }}>● PV</span>
              <span style={{ color: '#00A9C5' }}>● EV</span>
              <span style={{ color: '#DC2626' }}>● AC</span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evmWithMonteCarloData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="coneGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00A9C5" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <YAxis unit="M" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <ReferenceLine x="W21" stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Current Cutoff (W21)', fill: '#DC2626', fontSize: 10.5, fontWeight: 800, position: 'top' }} />
                  <Area type="monotone" dataKey="p90Cone" stroke="transparent" fill="url(#coneGradient)" name="P90 Pessimistic Fan" />
                  <Area type="monotone" dataKey="p10Cone" stroke="transparent" fill="#ffffff" name="P10 Optimistic Fan" />
                  <Line type="monotone" dataKey="pv" stroke="#004753" strokeWidth={2.5} dot={false} name="Planned Value (PV)" />
                  <Line type="monotone" dataKey="ev" stroke="#00A9C5" strokeWidth={2.5} dot={false} name="Earned Value (EV)" />
                  <Line type="monotone" dataKey="ac" stroke="#DC2626" strokeWidth={2.5} dot={false} name="Actual Cost (AC)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: 4-Quadrant Delay Risk Scatter Matrix */}
        <div style={{ flex: '1 1 380px', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#081E3C', margin: 0 }}>
                  4-Quadrant Delay Risk Matrix
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#DC2626', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  IMPACT VS LIKELIHOOD
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Trade delay days vs cost impact ($k)</span>
            </div>
          </div>

          <div onMouseLeave={() => setHoveredDelayPoint(null)} style={{ flex: 1, position: 'relative' }}>
            <div onMouseLeave={() => setHoveredDelayPoint(null)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart onMouseLeave={() => setHoveredDelayPoint(null)} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="likelihood" type="number" name="Likelihood %" unit="%" domain={[0, 100]} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <YAxis dataKey="costImpact" type="number" name="Cost Impact ($k)" unit="k" domain={[0, 500]} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <ZAxis dataKey="delayDays" type="number" range={[70, 320]} name="Delay Days" />
                  <ReferenceLine x={50} stroke="#CBD5E1" strokeDasharray="3 3" />
                  <ReferenceLine y={250} stroke="#CBD5E1" strokeDasharray="3 3" />
                  <RechartsTooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(8, 30, 60, 0.96)', color: 'white', padding: '10px 14px', borderRadius: 10, fontSize: 12, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', minWidth: 200, pointerEvents: 'none' }}>
                          <div style={{ fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{d.trade}</div>
                          <div style={{ fontSize: 11.5 }}>Likelihood: <strong>{d.likelihood}%</strong> • Impact: <strong>${d.costImpact}k</strong></div>
                          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 11, color: '#F87171', fontWeight: 700 }}>
                            Estimated Critical Delay: +{d.delayDays} Days
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={delayQuadrantData} 
                    fill="#004753" 
                    onMouseEnter={(data) => {
                      if (data) setHoveredDelayPoint(data);
                    }}
                    onMouseLeave={() => setHoveredDelayPoint(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {delayQuadrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.likelihood > 50 && entry.costImpact > 200 ? '#DC2626' : '#004753'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Floating Milestone Gantt (55%) + Subcontractor Performance Radar (45%) */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', minHeight: 310 }}>
        
        {/* Left: Floating Milestone Gantt Duration Bars */}
        <div onMouseLeave={() => setHoveredGantt(null)} style={{ flex: '1 1 560px', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#081E3C', margin: 0 }}>
                Milestone Critical Path Schedule Gantt
              </h3>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Primavera P6 schedule duration & variance tracking</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, background: '#EEF2FF', color: '#004753', padding: '3px 8px', borderRadius: 6 }}>
              P6 REV 03
            </span>
          </div>

          <div onMouseLeave={() => setHoveredGantt(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {milestoneGanttData.map((m, idx) => {
              const maxDuration = 75;
              const leftPct = (m.start / maxDuration) * 100;
              const widthPct = (m.duration / maxDuration) * 100;

              return (
                <div 
                  key={idx} 
                  onMouseEnter={(e) => {
                    setHoveredGantt(m);
                    setGanttCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setGanttCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredGantt(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  <span style={{ width: 170, fontSize: 12, fontWeight: 800, color: '#081E3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.milestone}
                  </span>
                  <div style={{ flex: 1, height: 22, position: 'relative', background: 'rgba(0, 71, 83, 0.04)', borderRadius: 6 }}>
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${leftPct}%`, 
                        width: `${widthPct}%`, 
                        height: '100%', 
                        background: m.onTime ? '#004753' : '#DC2626',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 800
                      }} 
                    >
                      {m.duration}d
                    </div>
                  </div>
                  <span style={{ width: 110, textAlign: 'right', fontSize: 10.5, fontWeight: 800, color: m.onTime ? '#059669' : '#DC2626' }}>
                    {m.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Subcontractor SPI/CPI Performance Hexagon Radar */}
        <div style={{ flex: '1 1 380px', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#081E3C', margin: 0 }}>
              Trade Subcontractor Multi-Metric Benchmark
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B' }}>Arabtec vs Doka vs Apex multi-criteria rating</span>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="72%" data={subPerformanceRadar}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#081E3C', fontSize: 10, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[60, 100]} tick={false} axisLine={false} />
                  <Radar name="Arabtec Concreting" dataKey="Arabtec" stroke="#DC2626" fill="#DC2626" fillOpacity={0.2} />
                  <Radar name="Doka Formwork" dataKey="Doka" stroke="#004753" fill="#004753" fillOpacity={0.3} />
                  <Radar name="Apex Steel" dataKey="Apex" stroke="#00A9C5" fill="#00A9C5" fillOpacity={0.2} />
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

    </div>
  );
};

export default ProgressDashboard;
