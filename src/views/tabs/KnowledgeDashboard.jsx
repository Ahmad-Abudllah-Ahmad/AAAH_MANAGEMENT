import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Search, MessageSquare, BrainCircuit, ShieldCheck, Zap, 
  ArrowUpRight, Download, Filter, ChevronRight, FileText, Globe, Cpu, Share2
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadialBarChart, RadialBar, Legend, ScatterChart, Scatter, ZAxis, Cell,
  LineChart, Line
} from 'recharts';

// --- 2D t-SNE / UMAP VECTOR EMBEDDING CLUSTER MAP DATASET ---
const vectorEmbeddingClusters = [
  // Cluster 1: Dubai Building Code (Teal #004753)
  { x: 22, y: 78, z: 80, name: 'DBC 2021 Structural Foundations', cluster: 'Dubai Building Code', citations: 420, spec: 'DBC Section 4.2 Foundations & Piles' },
  { x: 28, y: 82, z: 65, name: 'DBC Fire & Life Safety Specs', cluster: 'Dubai Building Code', citations: 310, spec: 'UAE Fire & Life Safety Code 2018' },
  { x: 25, y: 72, z: 90, name: 'DBC Wind Loading & Seismic Design', cluster: 'Dubai Building Code', citations: 540, spec: 'ASCE 7-16 & DBC Wind Criteria' },
  { x: 32, y: 75, z: 60, name: 'DBC HVAC Energy Conservation', cluster: 'Dubai Building Code', citations: 280, spec: 'Al Sa\'fat Green Building Rating' },

  // Cluster 2: FIDIC Standard Contracts (Cyan #00A9C5)
  { x: 75, y: 80, z: 95, name: 'FIDIC Red Book Cl 20.1 Notice', cluster: 'FIDIC Contracts', citations: 610, spec: 'Contractor\'s Claims & 28-day bar' },
  { x: 82, y: 76, z: 75, name: 'FIDIC Cl 13 Variations & Adjustments', cluster: 'FIDIC Contracts', citations: 390, spec: 'Engineer\'s Instruction & Valuation' },
  { x: 78, y: 86, z: 85, name: 'FIDIC Cl 8.4 Extension of Time', cluster: 'FIDIC Contracts', citations: 490, spec: 'Delay Event & Concurrent Delays' },
  { x: 86, y: 82, z: 70, name: 'FIDIC Yellow Book EPC Terms', cluster: 'FIDIC Contracts', citations: 340, spec: 'Plant & Design-Build Conditions' },

  // Cluster 3: Structural & Concrete Specs (Petrol #00556A)
  { x: 45, y: 35, z: 85, name: 'ASTM A615 Grade 60 Rebar Spec', cluster: 'Structural Specs', citations: 460, spec: 'High-yield deformed steel standard' },
  { x: 50, y: 40, z: 90, name: 'BS 8110 Concrete Design Manual', cluster: 'Structural Specs', citations: 520, spec: 'Structural use of concrete code' },
  { x: 42, y: 28, z: 60, name: 'ACI 318 Structural Concrete Code', cluster: 'Structural Specs', citations: 290, spec: 'Building code requirements for concrete' },

  // Cluster 4: HSE & OSHAD Safety (Amber #D97706)
  { x: 80, y: 25, z: 75, name: 'UAE OSHAD CoP 2.0 Scaffold Safety', cluster: 'HSE Regulations', citations: 380, spec: 'Abu Dhabi Occupational Safety Standard' },
  { x: 85, y: 32, z: 85, name: 'Dubai Municipality Crane Safety', cluster: 'HSE Regulations', citations: 450, spec: 'DM Technical Guideline TG-08' },
  { x: 76, y: 20, z: 60, name: 'MOHRE Midday Sun Heat Regulation', cluster: 'HSE Regulations', citations: 310, spec: 'UAE Summer Work Ban Compliance' },
];

// --- P50 / P95 / P99 MULTI-BAND VECTOR RETRIEVAL LATENCY ---
const vectorLatencyRibbonData = [
  { hour: '00:00', p50: 95, p95: 145, p99: 185 },
  { hour: '04:00', p50: 88, p95: 135, p99: 170 },
  { hour: '08:00', p50: 120, p95: 180, p99: 245 },
  { hour: '12:00', p50: 140, p95: 210, p99: 290 },
  { hour: '16:00', p50: 130, p95: 195, p99: 260 },
  { hour: '20:00', p50: 105, p95: 160, p99: 210 },
];

// --- SUNBURST / TIERED KNOWLEDGE CORPUS RINGS ---
const tieredCorpusRings = [
  { name: 'Regulatory (DBC/OSHAD)', value: 96.8, fill: '#004753', desc: '5,420 pages indexed with 100% semantic verification' },
  { name: 'FIDIC Legal Corpus', value: 92.4, fill: '#00A9C5', desc: '14 Standard Books & 320 Precedent Rulings' },
  { name: 'Project Engineering Specs', value: 88.6, fill: '#00556A', desc: 'Structural calculations & CSI 50-division guidelines' },
  { name: 'Cost Benchmarks & BOQs', value: 84.2, fill: '#D97706', desc: 'UAE market unit rates & historic tender records' },
];

// --- INTENT RETRIEVAL ACCURACY BY DOMAIN ---
const intentAccuracyData = [
  { domain: 'Codes & Standards', accuracy: 99.2, queries: 620 },
  { domain: 'FIDIC Contract Clauses', accuracy: 98.6, queries: 480 },
  { domain: 'Structural Calculations', accuracy: 97.4, queries: 390 },
  { domain: 'Cost Benchmarks', accuracy: 96.1, queries: 280 },
  { domain: 'Site HSE Procedures', accuracy: 99.4, queries: 210 },
];

const highValueQueries = [
  { query: 'What is the minimum concrete curing duration under Dubai Municipality Circular 221?', domain: 'Dubai Building Code', citations: 'DBC 2021 Sec 4.2.1 • DM-221', time: '5m ago', confidence: '99.4%' },
  { query: 'Does the contractor forfeit delay damages if 28-day notice is missed under FIDIC Red Book 20.1?', domain: 'FIDIC Contracts', citations: 'FIDIC 1999 Cl 20.1 • UAE Civil Code 246', time: '18m ago', confidence: '98.8%' },
  { query: 'Maximum allowable deflection for 18m cantilevered transfer truss under BS 8110?', domain: 'Structural Specs', citations: 'BS 8110 Part 1 • Structural Calc Rev 04', time: '42m ago', confidence: '97.6%' },
];

export const KnowledgeDashboard = () => {
  const [hoveredClusterPoint, setHoveredClusterPoint] = useState(null);
  const [scatterCardPos, setScatterCardPos] = useState({ x: 300, y: 300 });

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Knowledge Assistant & Vector Semantic Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            2D t-SNE embedding cluster topology, multi-band RAG latency ribbon, and semantic intent precision
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a 
            href="/knowledge-assistant/assistant"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 800, fontSize: 12.5, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            Launch AI Chat Assistant <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Row 1: KPI Stats with Dynamic Sparklines & Hover Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Semantic Queries Executed', value: '1,428', trend: '+18%', sub: '24h RAG Invocations', icon: <MessageSquare size={20} />, color: '#004753', bg: 'rgba(0, 71, 83, 0.08)', sparkline: [{d: 'W1', v: 950}, {d: 'W2', v: 1080}, {d: 'W3', v: 1190}, {d: 'W4', v: 1280}, {d: 'W5', v: 1360}, {d: 'W6', v: 1428}] },
          { label: 'Mean Vector Latency (P50)', value: '118 ms', trend: '-24ms', sub: 'Qdrant HNSW Index', icon: <Zap size={20} />, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', sparkline: [{d: 'W1', v: 148}, {d: 'W2', v: 142}, {d: 'W3', v: 135}, {d: 'W4', v: 128}, {d: 'W5', v: 122}, {d: 'W6', v: 118}] },
          { label: 'Indexed Technical Docs', value: '52,840', trend: '+1,450', sub: '128M Token Embeddings', icon: <Database size={20} />, color: '#00A9C5', bg: 'rgba(0, 169, 197, 0.1)', sparkline: [{d: 'W1', v: 48000}, {d: 'W2', v: 49200}, {d: 'W3', v: 50400}, {d: 'W4', v: 51200}, {d: 'W5', v: 52100}, {d: 'W6', v: 52840}] },
          { label: 'Citations Precision Score', value: '98.4%', trend: '+1.2%', sub: 'Verified Source Backlinks', icon: <BrainCircuit size={20} />, color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', sparkline: [{d: 'W1', v: 96.0}, {d: 'W2', v: 96.8}, {d: 'W3', v: 97.2}, {d: 'W4', v: 97.8}, {d: 'W5', v: 98.1}, {d: 'W6', v: 98.4}] },
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

      {/* Row 2: 2D Vector Embedding Cluster Map (60%) + Tiered Corpus Rings (40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 350 }}>
        
        {/* Chart 1: Interactive 2D t-SNE / UMAP Vector Cluster Map */}
        <div style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  2D Semantic Vector Embedding Clusters
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 800, background: '#004753', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                  t-SNE / HNSW
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                Cosine similarity clusters across DBC, FIDIC, HSE, and structural standards
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#004753' }}>● DBC Code</span>
              <span style={{ color: '#00A9C5' }}>● FIDIC</span>
              <span style={{ color: '#D97706' }}>● HSE</span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="x" type="number" domain={[10, 95]} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <YAxis dataKey="y" type="number" domain={[10, 95]} tick={{ fontSize: 10.5, fill: '#64748B' }} />
                  <ZAxis dataKey="z" range={[80, 240]} />
                  <RechartsTooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: 'rgba(8, 30, 60, 0.96)', color: 'white', padding: '10px 14px', borderRadius: 10, fontSize: 12, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', minWidth: 200, pointerEvents: 'none' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>{d.name}</div>
                          <div style={{ fontSize: 11.5 }}>Cluster: <strong>{d.cluster}</strong></div>
                          <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 11, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{d.spec}</span>
                            <span style={{ color: '#10B981', fontWeight: 700 }}>{d.citations} citations</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={vectorEmbeddingClusters} 
                    fill="#004753" 
                    style={{ cursor: 'pointer' }}
                  >
                    {vectorEmbeddingClusters.map((entry, index) => {
                      const color = entry.cluster === 'Dubai Building Code' ? '#004753' :
                                    entry.cluster === 'FIDIC Contracts' ? '#00A9C5' :
                                    entry.cluster === 'Structural Specs' ? '#00556A' : '#D97706';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 2: Sunburst / Tiered Knowledge Corpus Rings with Tooltip */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Knowledge Corpus Density Rings
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Token density & embedding index completeness
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
                  data={tieredCorpusRings} 
                  startAngle={90} 
                  endAngle={-270}
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

      {/* Row 3: Multi-Band P50/P95/P99 Latency Ribbon (55%) + Intent Accuracy Columns (45%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 310 }}>
        
        {/* Chart 3: P50/P95/P99 Multi-Band Vector Retrieval Latency Ribbon */}
        <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Vector Retrieval Latency SLA Bands (P50 / P95 / P99)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Network & embedding query response times in milliseconds
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#004753' }}>— P50 (Median)</span>
              <span style={{ color: '#00A9C5' }}>— P95 SLA</span>
              <span style={{ color: '#D97706' }}>— P99 Max</span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vectorLatencyRibbonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00A9C5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis unit="ms" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="p99" name="P99 Max Latency" stroke="#D97706" strokeWidth={2} fill="url(#p99Grad)" />
                  <Area type="monotone" dataKey="p95" name="P95 SLA" stroke="#00A9C5" strokeWidth={2.5} fill="transparent" />
                  <Area type="monotone" dataKey="p50" name="P50 Median" stroke="#004753" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 4: Intent Retrieval Accuracy by Domain */}
        <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Semantic Intent Precision (%)
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Accuracy of retrieved citations across engineering domains
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentAccuracyData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" domain={[90, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#081E3C', fontWeight: 700 }} width={120} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: 'rgba(8, 30, 60, 0.95)', color: 'white', fontWeight: 700 }}
                    itemStyle={{ color: '#00A9C5', fontWeight: 700 }}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                  />
                  <Bar dataKey="accuracy" name="Retrieval Precision" fill="#004753" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Recent High-Value Verified Queries */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Recent AI-Verified Technical Inquiries
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Semantic questions synthesized with exact clause and building code citations
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', background: 'rgba(0, 71, 83, 0.08)', padding: '4px 10px', borderRadius: 14 }}>
            100% Backlink Verified
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {highValueQueries.map((q, idx) => (
            <div 
              key={idx}
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
                  background: 'rgba(0, 71, 83, 0.08)', 
                  color: '#004753', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <Search size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    "{q.query}"
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    Source: <strong style={{ color: '#004753' }}>{q.citations}</strong> • Domain: {q.domain}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ 
                  fontSize: 11.5, fontWeight: 800, color: '#059669', background: '#ECFDF5', 
                  padding: '3px 8px', borderRadius: 12 
                }}>
                  {q.confidence} Match
                </span>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  {q.time}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Inspect <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default KnowledgeDashboard;
