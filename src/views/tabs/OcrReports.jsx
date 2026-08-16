import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Area, Bar, BarChart, PieChart, Pie, Cell
} from 'recharts';
import { 
  Download, Filter, FileText, Activity, Clock, Zap, Target, TrendingUp, 
  DollarSign, CheckCircle2, AlertTriangle, Layers, Building2, Package, ShieldCheck, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATASETS ---

const performanceData = [
  { name: 'Mon', avgConfidence: 94, maxConfidence: 98, minConfidence: 82 },
  { name: 'Tue', avgConfidence: 95, maxConfidence: 99, minConfidence: 85 },
  { name: 'Wed', avgConfidence: 92, maxConfidence: 97, minConfidence: 78 },
  { name: 'Thu', avgConfidence: 96, maxConfidence: 98, minConfidence: 88 },
  { name: 'Fri', avgConfidence: 97, maxConfidence: 99, minConfidence: 89 },
  { name: 'Sat', avgConfidence: 98, maxConfidence: 99, minConfidence: 92 },
  { name: 'Sun', avgConfidence: 97, maxConfidence: 99, minConfidence: 90 },
];

const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const heatmapData = Array.from({ length: 5 }, (_, dayIdx) => 
  Array.from({ length: 11 }, (_, hourIdx) => ({
    day: dayIdx,
    hour: hourIdx + 8,
    value: Math.floor(Math.random() * 100)
  }))
).flat();

const radarData = [
  { metric: 'Speed', modelA: 95, modelB: 80, fullMark: 100 },
  { metric: 'Accuracy', modelA: 98, modelB: 92, fullMark: 100 },
  { metric: 'Uptime', modelA: 99, modelB: 90, fullMark: 100 },
  { metric: 'Formats', modelA: 85, modelB: 95, fullMark: 100 },
  { metric: 'Cost', modelA: 75, modelB: 85, fullMark: 100 },
  { metric: 'Language', modelA: 90, modelB: 70, fullMark: 100 },
];

const composedData = [
  { name: 'W1', volume: 4000, exceptions: 240, processingSpeed: 1400 },
  { name: 'W2', volume: 3000, exceptions: 139, processingSpeed: 1210 },
  { name: 'W3', volume: 5000, exceptions: 980, processingSpeed: 2290 },
  { name: 'W4', volume: 2780, exceptions: 390, processingSpeed: 2000 },
  { name: 'W5', volume: 3890, exceptions: 480, processingSpeed: 2181 },
  { name: 'W6', volume: 2390, exceptions: 380, processingSpeed: 1500 },
];

// --- OCR COLLECTED DATA DETAILS DATASETS ---

const extractedMaterialSpend = [
  { category: 'Structural Steel & Rebar', spendM: 28.4, percentage: 38, count: 320, color: '#004753' },
  { category: 'Ready-Mix Concrete', spendM: 21.6, percentage: 29, count: 410, color: '#00A9C5' },
  { category: 'MEP & HVAC Equipment', spendM: 11.8, percentage: 16, count: 185, color: '#00556A' },
  { category: 'Formwork & Shoring', spendM: 7.2, percentage: 10, count: 162, color: '#4B637F' },
  { category: 'Site Consumables & Plant', spendM: 5.4, percentage: 7, count: 171, color: '#D97706' },
];

const fieldAccuracyData = [
  { field: 'VAT TRN Number', accuracy: 99.6, benchmark: 95 },
  { field: 'Invoice # & Date', accuracy: 99.2, benchmark: 95 },
  { field: 'Subtotal & 5% VAT', accuracy: 99.5, benchmark: 95 },
  { field: 'Unit Rates (AED)', accuracy: 96.8, benchmark: 95 },
  { field: 'Quantities & UoM', accuracy: 97.1, benchmark: 95 },
  { field: 'PO Match Linking', accuracy: 96.4, benchmark: 95 },
  { field: 'Item Descriptions', accuracy: 95.8, benchmark: 95 },
];

const projectSpendDistribution = [
  { project: 'Al Barsha Tower', spendM: 34.2, docs: 460, color: '#004753' },
  { project: 'Dubai Marina Res.', spendM: 22.8, docs: 380, color: '#00A9C5' },
  { project: 'Business Bay HQ', spendM: 12.4, docs: 260, color: '#00556A' },
  { project: 'Downtown Infra', spendM: 5.0, docs: 148, color: '#D97706' },
];

const topExtractedSuppliers = [
  { name: 'Emirates Steel Industries PJSC', trn: '100918273600003', spend: '16.9M AED', invoices: 210, ocrMatchRate: 99.4 },
  { name: 'Gulf Ready Mix Concrete LLC', trn: '100293847500003', spend: '8.24M AED', invoices: 86, ocrMatchRate: 99.1 },
  { name: 'Al Noor Building Materials LLC', trn: '100492817200003', spend: '4.85M AED', invoices: 142, ocrMatchRate: 98.2 },
  { name: 'Dutco Formwork Solutions', trn: '100736452800003', spend: '3.12M AED', invoices: 45, ocrMatchRate: 97.6 },
  { name: 'Logistics Pro Haulage LLC', trn: '100645281900003', spend: '950K AED', invoices: 56, ocrMatchRate: 96.0 },
];

export const OcrReports = () => {
  const [reportType, setReportType] = useState('All Reports');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [exporting, setExporting] = useState(false);

  const getColor = (value) => {
    if (value < 20) return '#E6F4F7'; // Ice aqua
    if (value < 40) return '#B3E0E8';
    if (value < 60) return '#4CB8CB';
    if (value < 80) return '#00A9C5'; // AAAH Cyan
    return '#004753'; // AAAH Deep Teal
  };

  const handleExportPdf = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C' }}>
            OCR Processing Reports & Data Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Comprehensive analytics on AI neural extraction accuracy, hourly throughput, and extracted procurement data.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #CBD5E1', outline: 'none', background: 'white', fontWeight: 700, fontSize: 12.5, color: '#081E3C' }}
          >
            {['All Reports', 'Extracted Data Details', 'Engine Efficiency', 'Vendor Performance'].map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <button 
            onClick={handleExportPdf}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> {exporting ? 'Generating Report...' : 'Export PDF Report'}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: OCR EXTRACTED BUSINESS DATA DETAILS */}
      {/* ======================================================== */}
      {(reportType === 'All Reports' || reportType === 'Extracted Data Details') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={18} color="#004753" /> OCR Collected Data & Procurement Intelligence
            </h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#004753', background: '#E6F4F7', padding: '3px 10px', borderRadius: 12 }}>
              Total Extracted Spend: 74.4M AED (1,248 Docs)
            </span>
          </div>

          {/* Row 1: Extracted Spend by Category & Project Distribution */}
          <div style={{ display: 'flex', gap: 20, minHeight: 340 }}>
            
            {/* Extracted Spend by Material Category (Bar Chart) */}
            <div style={{ flex: '0 0 55%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                    Extracted Spend by Material & Scope Category
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                    Automated line-item classification from verified contractor invoices.
                  </p>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#004753' }}>AED 74.4M</div>
              </div>

              <div style={{ flex: 1, minHeight: 220, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={extractedMaterialSpend} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                      <XAxis type="number" unit="M" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 11.5, fill: '#081E3C', fontWeight: 600 }} />
                      <RechartsTooltip 
                        formatter={(val, name, item) => [`${val}M AED (${item.payload.percentage}%)`, 'Extracted Spend']}
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="spendM" name="Extracted Spend (M AED)" radius={[0, 6, 6, 0]}>
                        {extractedMaterialSpend.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Extracted Spend by Project Allocation (Donut & Breakdown) */}
            <div style={{ flex: '0 0 calc(45% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  Project Invoiced Allocation
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                  Total billed values extracted per construction package.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 16 }}>
                <div style={{ width: 140, height: 140, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={projectSpendDistribution} 
                        dataKey="spendM" 
                        nameKey="project" 
                        innerRadius={45} 
                        outerRadius={65} 
                        paddingAngle={3}
                        onMouseEnter={(_, index) => setHoveredProject(projectSpendDistribution[index])}
                        onMouseLeave={() => setHoveredProject(null)}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        {projectSpendDistribution.map((entry, index) => {
                          const isHovered = hoveredProject?.project === entry.project;
                          return (
                            <Cell 
                              key={`pcell-${index}`} 
                              fill={entry.color} 
                              stroke={isHovered ? '#081E3C' : 'transparent'}
                              strokeWidth={isHovered ? 2 : 0}
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: hoveredProject ? hoveredProject.color : '#081E3C' }}>
                      {hoveredProject ? `${hoveredProject.spendM}M` : '74.4M'}
                    </span>
                    <span style={{ fontSize: 9, color: hoveredProject ? hoveredProject.color : '#64748B', fontWeight: 700 }}>
                      {hoveredProject ? 'AED' : 'Total AED'}
                    </span>
                  </div>
                </div>

                {/* Project List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {projectSpendDistribution.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                        <span style={{ fontWeight: 700, color: '#081E3C' }}>{p.project}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#004753' }}>{p.spendM}M AED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Field-Level Extraction Accuracy & Top Extracted Suppliers */}
          <div style={{ display: 'flex', gap: 20, minHeight: 320 }}>
            
            {/* Field-Level Extraction Accuracy */}
            <div style={{ flex: '0 0 50%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                  Field-Level OCR Extraction Accuracy
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                  Benchmarked against 95% target automated accuracy threshold.
                </p>
              </div>

              <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fieldAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="field" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} angle={-15} textAnchor="end" />
                      <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                      <RechartsTooltip 
                        formatter={(val) => [`${val}%`, 'Extraction Accuracy']}
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="accuracy" name="Accuracy %" fill="#004753" radius={[4, 4, 0, 0]} barSize={26}>
                        {fieldAccuracyData.map((entry, index) => (
                          <Cell key={`acc-${index}`} fill={entry.accuracy >= 98 ? '#004753' : entry.accuracy >= 96 ? '#00A9C5' : '#4B637F'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Invoiced Suppliers Table */}
            <div style={{ flex: '0 0 calc(50% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                    Top Invoiced Suppliers by Verified Data Volume
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                    Highest value vendors extracted via OCR pipeline.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #CBD5E1', color: '#64748B', textAlign: 'left', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '6px 4px' }}>Vendor Entity</th>
                      <th style={{ padding: '6px 4px', textAlign: 'right' }}>Total Extracted</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center' }}>Invoices</th>
                      <th style={{ padding: '6px 4px', textAlign: 'right' }}>Match Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExtractedSuppliers.map((sup, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 4px', fontWeight: 700, color: '#081E3C' }}>
                          <div>{sup.name}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>TRN: {sup.trn}</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 800, color: '#004753' }}>
                          {sup.spend}
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', color: '#475569' }}>
                          {sup.invoices}
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#00A86B' }}>
                            {sup.ocrMatchRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: AI ENGINE PERFORMANCE & EFFICIENCY */}
      {/* ======================================================== */}
      {(reportType === 'All Reports' || reportType === 'Engine Efficiency') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 10 }}>
          
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#004753" /> AI Engine Throughput & Neural Variance
          </h2>

          <div style={{ display: 'flex', gap: 20, height: 380 }}>
            {/* Heatmap Section */}
            <div style={{ flex: '0 0 50%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={16} color="#004753" /> Document Processing Density by Hour
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: 12, color: '#64748B' }}>
                Darker squares indicate higher volume of incoming documents processed.
              </p>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', marginLeft: 36 }}>
                  {hours.map(h => <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#64748B', fontWeight: 600 }}>{h}</div>)}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {days.map((day, dIdx) => (
                    <div key={day} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 34, fontSize: 11, fontWeight: 700, color: '#081E3C' }}>{day}</div>
                      <div style={{ flex: 1, display: 'flex', gap: 4, height: '100%' }}>
                        {heatmapData.filter(d => d.day === dIdx).map((cell, cIdx) => (
                          <motion.div 
                            key={cIdx} 
                            whileHover={{ scale: 1.15, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                            style={{ flex: 1, height: '100%', background: getColor(cell.value), borderRadius: 3, cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                              const rect = e.target.getBoundingClientRect();
                              setHoveredCell({
                                value: cell.value,
                                day: day,
                                hour: hours[cIdx],
                                x: rect.left + rect.width / 2,
                                y: rect.top - 10
                              });
                            }}
                            onMouseLeave={() => setHoveredCell(null)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Line Chart Section */}
            <div style={{ flex: '0 0 calc(50% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} color="#004753" /> AI Confidence Score Variance
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: 12, color: '#64748B' }}>
                Tracking daily fluctuations in optical extraction accuracy across all scans.
              </p>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value}%`]}
                      />
                      <Legend wrapperStyle={{ paddingTop: 16 }} />
                      <Line type="monotone" dataKey="maxConfidence" name="Max Accuracy" stroke="#00A86B" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="avgConfidence" name="Average Accuracy" stroke="#004753" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="minConfidence" name="Min Accuracy" stroke="#DC2626" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, height: 360 }}>
            {/* Radar Chart Section */}
            <div style={{ flex: '0 0 35%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={16} color="#004753" /> Model Capabilities
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: 12, color: '#64748B' }}>
                Primary (Google Vision Deep) vs Fallback AI.
              </p>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <Radar name="Primary AI" dataKey="modelA" stroke="#004753" fill="#004753" fillOpacity={0.6} />
                      <Radar name="Fallback AI" dataKey="modelB" stroke="#00A9C5" fill="#00A9C5" fillOpacity={0.4} />
                      <Legend wrapperStyle={{ fontSize: 11.5 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Composed Chart Section */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="#004753" /> Multi-metric Efficiency Trend
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: 12, color: '#64748B' }}>
                Document volume vs exceptions vs processing speed (ms).
              </p>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={composedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                      <Legend wrapperStyle={{ paddingTop: 16, fontSize: 11.5 }} />
                      <Area type="monotone" dataKey="volume" name="Total Volume" fill="#E6F4F7" stroke="#004753" strokeWidth={2} />
                      <Bar dataKey="processingSpeed" name="Processing Speed (ms)" barSize={18} fill="#00A9C5" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="exceptions" name="Exceptions" stroke="#DC2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Summary Stats Footer */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, background: '#081E3C', color: 'white', padding: '20px 24px', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 14px rgba(8,30,60,0.15)' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'white' }}>Weekly OCR Intelligence Summary</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Generated on {new Date().toLocaleDateString()} for Al Ahmadiah Aker Contracting</div>
          </div>
          <div style={{ display: 'flex', gap: 36 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#A7F3D0' }}>12.4s</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Avg Processing Time</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#FCA5A5' }}>0.04%</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Critical Error Rate</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#67E8F9' }}>1.2M</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Data Fields Extracted</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Heatmap Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: hoveredCell.y,
              left: hoveredCell.x,
              transform: 'translate(-50%, -100%)',
              background: 'white',
              padding: '8px 12px',
              borderRadius: 8,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              border: '1px solid #CBD5E1',
              zIndex: 9999,
              pointerEvents: 'none',
              fontSize: 12,
              color: '#334155'
            }}
          >
            <div style={{ fontWeight: 800, color: '#081E3C', marginBottom: 2 }}>{hoveredCell.day} at {hoveredCell.hour}</div>
            <div><strong style={{ color: '#004753' }}>{hoveredCell.value}</strong> documents processed</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
