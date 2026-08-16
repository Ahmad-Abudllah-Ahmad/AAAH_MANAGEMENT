import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, FileSignature, CheckCircle2, Clock, Plus, Filter, Download, 
  ChevronRight, TrendingUp, AlertTriangle, Scale, ShieldCheck, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ComposedChart, Line, LineChart
} from 'recharts';

// --- CONTRACT TURNAROUND RANGE / BOX-PLOT DATASET ---
const contractTurnaroundRanges = [
  { type: 'Variation Orders', min: 1.2, median: 2.8, max: 5.4, volume: 420, sla: '3.0d Target' },
  { type: 'Payment Certificates', min: 0.8, median: 1.6, max: 3.2, volume: 380, sla: '2.0d Target' },
  { type: 'Subcontracts', min: 2.5, median: 4.2, max: 8.0, volume: 290, sla: '5.0d Target' },
  { type: 'FIDIC Delay Claims', min: 3.0, median: 6.5, max: 12.0, volume: 180, sla: '7.0d Target' },
  { type: 'NDAs & Letters', min: 0.4, median: 0.9, max: 1.8, volume: 159, sla: '1.0d Target' },
];

// --- MULTI-STAGE APPROVAL PIPELINE FUNNEL DATASET ---
const draftingFunnelSteps = [
  { stage: '1. AI Draft Generated', count: 1429, color: '#004753', time: '< 2 mins' },
  { stage: '2. Commercial Review', count: 1210, color: '#00556A', time: '4.2 hrs' },
  { stage: '3. Legal Redline Passed', count: 940, color: '#00A9C5', time: '8.5 hrs' },
  { stage: '4. Executive Stamped', count: 820, color: '#059669', time: '1.2 days' },
];

// --- FIDIC CLAUSE RISK RADAR SPECTRUM ---
const fidicClauseRiskRadar = [
  { clause: 'Cl 20.1: Time-bar Claim', risk: 88, benchmark: 70 },
  { clause: 'Cl 13: Variations Scope', risk: 94, benchmark: 85 },
  { clause: 'Cl 8.4: Extension of Time', risk: 82, benchmark: 75 },
  { clause: 'Cl 14.3: Interim Payments', risk: 96, benchmark: 90 },
  { clause: 'Cl 4.4: Subcontractors', risk: 91, benchmark: 80 },
  { clause: 'Cl 17.1: Risk & Indemnity', risk: 85, benchmark: 78 },
];

// --- WEEKLY DRAFTING VELOCITY STACKED AREA ---
const draftingVelocityData = [
  { week: 'W1', approved: 48, inReview: 14, redline: 6 },
  { week: 'W2', approved: 62, inReview: 18, redline: 8 },
  { week: 'W3', approved: 85, inReview: 22, redline: 5 },
  { week: 'W4', approved: 78, inReview: 19, redline: 7 },
  { week: 'W5', approved: 94, inReview: 26, redline: 4 },
];

const pendingUrgentDrafts = [
  { id: 'DFT-DXB-402', title: 'Site Variation Order #04 - High Voltage Cable Reroute', project: 'Al Wasl Commercial High-Rise', type: 'Variation Order', requester: 'Rashid Al Nuaimi', urgency: 'Critical', value: 'AED 420,000' },
  { id: 'DFT-AUH-118', title: 'Interim Payment Certificate IPC-08 (Milestone Foundation)', project: 'Etihad Rail Logistics Hub', type: 'Payment Cert', requester: 'Parsons Overseas', urgency: 'High', value: 'AED 3,450,000' },
  { id: 'DFT-DXB-309', title: 'Subcontractor Trade Agreement - Glass & Glazing', project: 'Dubai Creek Harbour Towers', type: 'Subcontract', requester: 'Emaar Properties', urgency: 'Medium', value: 'AED 12,800,000' },
];

export const DraftingDashboard = () => {
  const [hoveredBox, setHoveredBox] = useState(null);
  const [boxCardPos, setBoxCardPos] = useState({ x: 0, y: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Floating Hover Card for Turnaround Ranges */}
      {hoveredBox && (
        <div style={{ 
          position: 'fixed', 
          top: Math.max(10, boxCardPos.y - 105), 
          left: Math.max(10, Math.min(window.innerWidth - 240, boxCardPos.x - 110)), 
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
          minWidth: 210
        }}>
          <div style={{ fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{hoveredBox.type}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span>Median: <strong style={{ color: '#10B981' }}>{hoveredBox.median} Days</strong></span>
            <span style={{ color: '#94A3B8' }}>{hoveredBox.sla}</span>
          </div>
          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 11, color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
            <span>Min: {hoveredBox.min}d • Max: {hoveredBox.max}d</span>
            <span>{hoveredBox.volume} drafts</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Document Drafting & FIDIC Governance Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Contract turnaround range box-plots, multi-stage approval funnel, and FIDIC legal risk spectrum
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a 
            href="/document-drafting/drafts"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 800, fontSize: 12.5, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Create New Draft
          </a>
        </div>
      </div>

      {/* Row 1: KPI Stats with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Drafts Generated', value: '1,429', trend: '+12%', sub: 'FIDIC Red & Yellow Books', icon: <FileText size={20} />, color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', sparkline: [{d: 'W1', v: 1100}, {d: 'W2', v: 1180}, {d: 'W3', v: 1240}, {d: 'W4', v: 1320}, {d: 'W5', v: 1380}, {d: 'W6', v: 1429}] },
          { label: 'In Approval Pipeline', value: '42', trend: '-5%', sub: 'Mean 1.2d Turnaround', icon: <Clock size={20} />, color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', sparkline: [{d: 'W1', v: 58}, {d: 'W2', v: 52}, {d: 'W3', v: 49}, {d: 'W4', v: 46}, {d: 'W5', v: 44}, {d: 'W6', v: 42}] },
          { label: 'Issued & Stamped (Month)', value: '820', trend: '+24%', sub: 'Digital Signatures Executed', icon: <CheckCircle2 size={20} />, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', sparkline: [{d: 'W1', v: 540}, {d: 'W2', v: 610}, {d: 'W3', v: 690}, {d: 'W4', v: 740}, {d: 'W5', v: 790}, {d: 'W6', v: 820}] },
          { label: 'FIDIC Compliance Score', value: '98.6%', trend: '+1.4%', sub: 'Zero Clause Conflicts', icon: <Scale size={20} />, color: '#00A9C5', bg: 'rgba(0, 169, 197, 0.1)', sparkline: [{d: 'W1', v: 96.2}, {d: 'W2', v: 96.8}, {d: 'W3', v: 97.4}, {d: 'W4', v: 98.0}, {d: 'W5', v: 98.3}, {d: 'W6', v: 98.6}] },
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

      {/* Row 2: Turnaround Box-Plot Ranges (60%) + Approval Funnel Pipeline (40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 340 }}>
        
        {/* Chart 1: Turnaround Box-Plot / Range-Bar Velocity Chart */}
        <div onMouseLeave={() => setHoveredBox(null)} style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  Contract Turnaround Velocity Ranges (Days)
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  BOX PLOT
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Min, Median, and Max cycle days per contract classification
              </p>
            </div>
          </div>

          <div onMouseLeave={() => setHoveredBox(null)} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0' }}>
            {contractTurnaroundRanges.map((item, idx) => {
              const maxScale = 14;
              const leftPct = (item.min / maxScale) * 100;
              const widthPct = ((item.max - item.min) / maxScale) * 100;
              const medianLeft = ((item.median - item.min) / (item.max - item.min)) * 100;

              return (
                <div 
                  key={idx}
                  onMouseEnter={(e) => {
                    setHoveredBox(item);
                    setBoxCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setBoxCardPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredBox(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                >
                  <span style={{ width: 140, fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                    {item.type}
                  </span>
                  <div style={{ flex: 1, height: 26, position: 'relative', background: 'rgba(0, 71, 83, 0.04)', borderRadius: 6 }}>
                    {/* Range Box */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${leftPct}%`, 
                        width: `${widthPct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, rgba(0, 71, 83, 0.2), rgba(0, 169, 197, 0.4))',
                        border: '1px solid #004753',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center'
                      }} 
                    >
                      {/* Median Needle */}
                      <div style={{ position: 'absolute', left: `${medianLeft}%`, width: 3, height: '100%', background: '#004753' }} />
                    </div>
                  </div>
                  <span style={{ width: 60, textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#004753' }}>
                    {item.median}d avg
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Multi-Stage Document Approval Funnel Pipeline */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Multi-Stage Approval Pipeline
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Document conversion throughput and stage turnaround
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            {draftingFunnelSteps.map((step, idx) => {
              const widthPct = 100 - idx * 12;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                    <span>{step.stage}</span>
                    <span style={{ color: step.color }}>{step.count} ({step.time})</span>
                  </div>
                  <div style={{ width: '100%', height: 16, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${widthPct}%`, 
                        height: '100%', 
                        background: step.color, 
                        borderRadius: 6 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3: Stacked Area Drafting Velocity (55%) + FIDIC Risk Radar (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 310 }}>
        
        {/* Chart 3: Weekly Drafting Velocity Stacked Area */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Weekly Document Velocity & Throughput
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Approved vs in-review vs redline drafts per week
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={draftingVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="apprGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004753" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00A9C5" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="approved" name="Approved & Stamped" stackId="1" stroke="#004753" fill="url(#apprGrad)" />
                  <Area type="monotone" dataKey="inReview" name="In Review" stackId="1" stroke="#00A9C5" fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: FIDIC Clause Legal Risk Radar Spectrum */}
        <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 6 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              FIDIC Clause Compliance & Risk Spectrum
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Contractual risk benchmark per FIDIC condition
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={fidicClauseRiskRadar}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="clause" tick={{ fill: '#081E3C', fontSize: 9.5, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[60, 100]} tick={false} axisLine={false} />
                  <Radar name="Draft Compliance" dataKey="risk" stroke="#004753" fill="#004753" fillOpacity={0.4} />
                  <Radar name="FIDIC Baseline" dataKey="benchmark" stroke="#00A9C5" fill="#00A9C5" fillOpacity={0.2} />
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

      {/* Row 4: Urgent Approval Queue */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Priority Drafts Pending Executive Signature
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Contractual variation orders and IPC certificates requiring sign-off
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', background: 'rgba(0, 71, 83, 0.08)', padding: '4px 10px', borderRadius: 14 }}>
            3 Awaiting Signature
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pendingUrgentDrafts.map((draft) => (
            <div 
              key={draft.id}
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
                  background: draft.urgency === 'Critical' ? '#FEE2E2' : '#FEF3C7', 
                  color: draft.urgency === 'Critical' ? '#DC2626' : '#D97706', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <FileSignature size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    {draft.id} • <span style={{ color: '#004753' }}>{draft.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    {draft.project} • Requested by: <strong>{draft.requester}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#081E3C' }}>
                  {draft.value}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Sign Draft <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DraftingDashboard;
