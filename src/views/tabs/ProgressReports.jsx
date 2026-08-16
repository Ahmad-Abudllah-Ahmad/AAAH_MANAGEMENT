import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Search, 
  CheckCircle2, Plus, DollarSign, 
  Eye, X, FileSpreadsheet, ShieldCheck, Printer
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Report Archive Data
const masterReportArchive = [
  {
    id: 'REP-IPC-007',
    name: 'Interim Payment Application #07 (IPC)',
    type: 'PDF',
    category: 'Commercial / IPC',
    recipient: 'Dar Al-Handasah (Consultant)',
    generatedBy: 'Rashid Khan (Senior QS)',
    date: 'May 18, 2026 14:00 GST',
    period: 'Apr 16 – May 15, 2026',
    value: '$1,450,000',
    size: '4.8 MB',
    status: 'Approved',
    description: 'Certified EVM progress valuation for Level 01–03 structural slabs, 128 foundation piles, and podium steel erection.'
  },
  {
    id: 'REP-FIDIC-20.1',
    name: 'FIDIC Sub-Clause 20.1 Delay Notice Dossier',
    type: 'PDF',
    category: 'Legal / EOT Claim',
    recipient: 'Al Wasl Tower Holdings (Employer)',
    generatedBy: 'Sarah Lee (Contracts Lead)',
    date: 'May 15, 2026 11:30 GST',
    period: 'Event W20-W21',
    value: '$98,500 Exposure',
    size: '8.2 MB',
    status: 'Pending Review',
    description: 'Formal 28-day notice for Putzmeister concrete boom hydraulic pump failure and high wind crane stoppage.'
  },
  {
    id: 'REP-EXEC-W21',
    name: 'Weekly Executive C-Level Progress Briefing W21',
    type: 'PDF',
    category: 'Executive Summary',
    recipient: 'Board of Directors & Lenders',
    generatedBy: 'System Auto-Engine',
    date: 'May 20, 2026 08:00 GST',
    period: 'Week 21 Live Cutoff',
    value: 'BAC $40.0M',
    size: '2.1 MB',
    status: 'Generated',
    description: 'S-Curve EVM snapshot, critical path variance (-27 days), 4D BIM pour deck status, and safety audit summary.'
  },
  {
    id: 'REP-XER-REV03',
    name: 'Primavera P6 Master CPM Schedule Export',
    type: 'XER',
    category: 'P6 Schedule Data',
    recipient: 'Project Planning PMO',
    generatedBy: 'Tom Wilson (Lead Planner)',
    date: 'May 19, 2026 18:45 GST',
    period: 'Revision 03 Data Date',
    value: '142 Activities',
    size: '1.2 MB',
    status: 'Generated',
    description: 'Raw Primavera P6 schedule baseline with total float calculations, logic relationships, and cost loading.'
  },
  {
    id: 'REP-LIDAR-04',
    name: 'Drone LiDAR Point Cloud As-Built Discrepancy Audit',
    type: 'PDF',
    category: 'BIM 4D Quality',
    recipient: 'BIM Management Team',
    generatedBy: 'Auto-Pilot Drone Ops',
    date: 'May 12, 2026 16:15 GST',
    period: 'Flight Mission #18',
    value: '99.4% Tolerance',
    size: '14.5 MB',
    status: 'Approved',
    description: 'Photogrammetric overlay against IFC4 structural model verifying Level 03 East deck slab camber and formwork alignment.'
  },
  {
    id: 'REP-EVM-XLS-05',
    name: 'Comprehensive EVM ISO 21508 Calculation Workbook',
    type: 'XLSX',
    category: 'Financial Model',
    recipient: 'Internal Audit & Finance',
    generatedBy: 'Rashid Khan (Senior QS)',
    date: 'May 16, 2026 10:20 GST',
    period: 'Cumulative Months 1–5',
    value: 'PV $8.5M / EV $7.2M',
    size: '3.4 MB',
    status: 'Generated',
    description: 'Detailed work package breakdown with CPI, SPI, TCPI, CV, SV, and bottom-up EAC forecasting algorithms.'
  }
];

const reportVolumeHistory = [
  { day: 'May 08', generated: 4, approved: 3 },
  { day: 'May 10', generated: 8, approved: 6 },
  { day: 'May 12', generated: 14, approved: 12 },
  { day: 'May 14', generated: 9, approved: 8 },
  { day: 'May 16', generated: 16, approved: 14 },
  { day: 'May 18', generated: 22, approved: 18 },
  { day: 'May 20', generated: 18, approved: 16 },
];

export const ProgressReports = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewReport, setPreviewReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredReports = masterReportArchive.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category.includes(selectedCategory);
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase()) ||
                          r.recipient.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 20, right: 24, zIndex: 999,
              background: '#0F172A', color: 'white', padding: '12px 20px',
              borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 22px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <FileText size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Progress Reports & Commercial Exports
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                AUDIT COMPLIANT
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12.5, margin: '2px 0 0 0' }}>
              Interim Payment Certificates (IPC) • FIDIC Delay Notices • P6 XER Exports • Executive Briefings
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => showToast('Compiling custom multi-source project report package...')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={15} /> Generate Custom Report
          </button>
        </div>
      </div>

      {/* Top 4 Quick Generation Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        
        {/* Template 1: IPC Payment Application */}
        <div 
          onClick={() => setPreviewReport(masterReportArchive[0])}
          style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 10, background: '#ECFDF5', borderRadius: 10, color: '#059669' }}>
              <DollarSign size={20} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: 4 }}>
              APPROVED
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>Monthly Payment App #07</h4>
            <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0 0' }}>EVM certified BOQ claim • $1.45M</p>
          </div>
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#4F46E5' }}>
            <span>Preview & Download</span>
            <Download size={13} />
          </div>
        </div>

        {/* Template 2: FIDIC Delay Dossier */}
        <div 
          onClick={() => setPreviewReport(masterReportArchive[1])}
          style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #FECACA', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 10, background: '#FEF2F2', borderRadius: 10, color: '#DC2626' }}>
              <ShieldCheck size={20} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, background: '#FEF2F2', color: '#DC2626', padding: '2px 6px', borderRadius: 4 }}>
              FIDIC 20.1
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>Delay Notice Dossier</h4>
            <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0 0' }}>Forensic CCTV & wind proof</p>
          </div>
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#DC2626' }}>
            <span>Preview & Download</span>
            <Download size={13} />
          </div>
        </div>

        {/* Template 3: Executive C-Level Briefing */}
        <div 
          onClick={() => setPreviewReport(masterReportArchive[2])}
          style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #C7D2FE', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, color: '#4F46E5' }}>
              <FileText size={20} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: 4 }}>
              W21 CUTOFF
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>Executive Progress Briefing</h4>
            <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0 0' }}>C-Level EVM, S-Curve & BIM</p>
          </div>
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#4F46E5' }}>
            <span>Preview & Download</span>
            <Download size={13} />
          </div>
        </div>

        {/* Template 4: Primavera P6 XER Export */}
        <div 
          onClick={() => setPreviewReport(masterReportArchive[3])}
          style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 10, background: '#F8FAFC', borderRadius: 10, color: '#475569' }}>
              <FileSpreadsheet size={20} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>
              P6 .XER
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>Primavera P6 Master File</h4>
            <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0 0' }}>142 Activities • CPM logic data</p>
          </div>
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#4F46E5' }}>
            <span>Export .XER</span>
            <Download size={13} />
          </div>
        </div>

      </div>

      {/* Middle Section: Generation History Analytics (Full Width) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', minHeight: 260 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Report Generation & Approval Velocity (Last 14 Days)
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B' }}>Commercial audits generated vs consultant approved</span>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: '#4F46E5' }}>— Generated Reports</span>
            <span style={{ color: '#10B981' }}>— Consultant Approved</span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 180, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportVolumeHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGenRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004753" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#004753" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAppRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00A9C5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Area type="monotone" dataKey="generated" stroke="#004753" strokeWidth={2.5} fill="url(#colorGenRep)" />
              <Area type="monotone" dataKey="approved" stroke="#00A9C5" strokeWidth={2.5} fill="url(#colorAppRep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Document Archive Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Search and Category Filter Toolbar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', width: '100%', maxWidth: 360 }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search reports by title, code, or recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#0F172A' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', 'Commercial', 'Legal', 'Executive', 'Schedule', 'BIM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: selectedCategory === cat ? 'none' : '1px solid #CBD5E1',
                  background: selectedCategory === cat ? 'var(--gradient-brand)' : 'white',
                  color: selectedCategory === cat ? 'white' : '#64748B',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', fontSize: 10.5, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Document Name</th>
                <th style={{ padding: '12px 12px' }}>Format</th>
                <th style={{ padding: '12px 12px' }}>Recipient & Stakeholder</th>
                <th style={{ padding: '12px 12px' }}>Generated Date</th>
                <th style={{ padding: '12px 12px' }}>Size</th>
                <th style={{ padding: '12px 12px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr 
                  key={report.id}
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.1s' }}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div 
                      onClick={() => setPreviewReport(report)}
                      style={{ fontWeight: 800, color: '#004753', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <FileText size={15} />
                      <span>{report.name}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748B' }}>{report.id} • {report.category}</div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', background: '#F1F5F9', color: '#334155', borderRadius: 4 }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#334155', fontWeight: 600 }}>
                    {report.recipient}
                  </td>
                  <td style={{ padding: '12px 12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {report.date}
                  </td>
                  <td style={{ padding: '12px 12px', color: '#64748B' }}>
                    {report.size}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: report.status === 'Approved' ? '#ECFDF5' : report.status === 'Pending Review' ? '#FEF3C7' : '#F1F5F9',
                      color: report.status === 'Approved' ? '#059669' : report.status === 'Pending Review' ? '#92400E' : '#475569'
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        onClick={() => setPreviewReport(report)}
                        style={{ padding: '5px 10px', background: '#F1F5F9', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => showToast(`Downloading ${report.name} (${report.type})...`)}
                        style={{ padding: '5px 12px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                      >
                        <Download size={12} /> Get
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview & Inspector Modal */}
      <AnimatePresence>
        {previewReport && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: 16, maxWidth: 640, width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}
            >
              {/* Modal Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ padding: 8, background: '#EEF2FF', borderRadius: 8, color: '#4F46E5' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {previewReport.name}
                    </h3>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{previewReport.id} • Format: {previewReport.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewReport(null)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>RECIPIENT & CLIENT</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{previewReport.recipient}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>CERTIFIED VALUE</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#059669', marginTop: 2 }}>{previewReport.value}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>GENERATED BY</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{previewReport.generatedBy}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>AUDIT COMPLIANCE</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#4F46E5', marginTop: 2 }}>{previewReport.status}</div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0F172A' }}>Executive Abstract:</strong> {previewReport.description}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#F8FAFC' }}>
                <button 
                  onClick={() => {
                    showToast(`Sending print command for ${previewReport.name}...`);
                    setPreviewReport(null);
                  }}
                  style={{ padding: '8px 14px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Printer size={14} /> Print Dossier
                </button>
                <button 
                  onClick={() => {
                    showToast(`Downloading verified ${previewReport.name}...`);
                    setPreviewReport(null);
                  }}
                  style={{ padding: '8px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                >
                  <Download size={14} /> Download {previewReport.type}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
