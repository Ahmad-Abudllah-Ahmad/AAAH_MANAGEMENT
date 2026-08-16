import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Filter, Search, Calendar, ChevronDown, 
  CheckCircle2, Clock, Plus, BarChart2, Check, ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const uaeSiteReports = [
  { id: 'SREP-001', name: 'Daily Site HSE & Weather Diary (Al Wasl Tower)', type: 'PDF', generatedBy: 'Eng. Tareq (KEO)', date: '14 Aug 2026', size: '2.4 MB', status: 'Generated' },
  { id: 'SREP-002', name: 'UAE MOHRE Midday Break Thermal Audit Certificate', type: 'PDF', generatedBy: 'Automated AI Auditor', date: '14 Aug 2026', size: '1.8 MB', status: 'Generated' },
  { id: 'SREP-003', name: 'Weekly Subcontractor Biometric Timesheet & Muster', type: 'Excel', generatedBy: 'Turnstile Cloud', date: '13 Aug 2026', size: '0.8 MB', status: 'Generated' },
  { id: 'SREP-004', name: 'Drone Volumetric Stockpile Rebar & Aggregate Audit', type: 'CSV', generatedBy: 'DJI Matrice Drone', date: '12 Aug 2026', size: '3.2 MB', status: 'Generated' },
  { id: 'SREP-005', name: 'Monthly Dubai Municipality Safety Compliance Filing', type: 'PDF', generatedBy: 'Project HSE Director', date: '01 Aug 2026', size: '14.6 MB', status: 'Generated' },
];

const exportData = [
  { date: '01 Aug', reports: 6 },
  { date: '03 Aug', reports: 14 },
  { date: '05 Aug', reports: 18 },
  { date: '07 Aug', reports: 12 },
  { date: '09 Aug', reports: 25 },
  { date: '11 Aug', reports: 19 },
  { date: '14 Aug', reports: 38 },
];

export const SiteReports = () => {
  const [reportList, setReportList] = useState(uaeSiteReports);
  const [search, setSearch] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('PDF');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!reportTitle) return;
    const newRpt = {
      id: `SREP-00${reportList.length + 1}`,
      name: reportTitle,
      type: reportType,
      generatedBy: 'Current User',
      date: 'Just now',
      size: '2.1 MB',
      status: 'Generated'
    };
    setReportList([newRpt, ...reportList]);
    setShowGenModal(false);
    setReportTitle('');
  };

  const filteredLogs = reportList.filter(log => 
    log.name.toLowerCase().includes(search.toLowerCase()) || 
    log.generatedBy.toLowerCase().includes(search.toLowerCase()) ||
    log.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Site Safety Reporting & Regulatory Archives
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Generate statutory Dubai Municipality compliance filings, daily HSE logs, and biometric headcount audits
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowGenModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={15} /> Generate New Site Report
          </button>
        </div>
      </div>

      {/* Row 1: Generation Volume & Templates (60% / 40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 280 }}>
        
        {/* Area Chart (60%) */}
        <div style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                HSE & Regulatory Report Volume (Last 14 Days)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Daily automated safety audit certificates and timesheet exports
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={exportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="siteExpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004753" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    formatter={(val) => [`${val} Reports`, 'Dispatched']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontWeight: 700 }} 
                  />
                  <Area type="monotone" dataKey="reports" stroke="#004753" strokeWidth={2.5} fillOpacity={1} fill="url(#siteExpGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Templates (40%) */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
            Instant HSE Templates
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            
            <div 
              onClick={() => alert("Downloading Daily PMO Site Safety Log PDF...")}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', background: '#F8FAFC' }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(0, 71, 83, 0.1)', color: '#004753', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Daily Site HSE Diary</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Weather, incidents & headcount</div>
                </div>
              </div>
              <Download size={15} color="#004753" />
            </div>

            <div 
              onClick={() => alert("Downloading MOHRE Midday Break Compliance PDF...")}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', background: '#F8FAFC' }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: '#ECFDF5', color: '#059669', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>MOHRE Midday Audit</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Thermal AI rest hours verification</div>
                </div>
              </div>
              <Download size={15} color="#059669" />
            </div>

            <div 
              onClick={() => alert("Downloading Biometric Timesheet Excel Matrix...")}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', background: '#F8FAFC' }}
              className="hover-bg-gray-50"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(0, 169, 197, 0.1)', color: '#00A9C5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Turnstile Timesheet</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Excel timesheet with gate timestamps</div>
                </div>
              </div>
              <Download size={15} color="#00A9C5" />
            </div>

          </div>
        </div>

      </div>

      {/* Row 2: Generated Reports Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search reports by title, ID, author..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredLogs.length} Archival Reports & Audit Certificates
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Document Name & ID</th>
                <th style={{ padding: '12px 16px' }}>Format</th>
                <th style={{ padding: '12px 16px' }}>Generated By</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>File Size</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{log.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{log.id}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800,
                      background: log.type === 'PDF' ? '#FEE2E2' : log.type === 'Excel' ? '#ECFDF5' : 'rgba(0, 71, 83, 0.08)',
                      color: log.type === 'PDF' ? '#DC2626' : log.type === 'Excel' ? '#059669' : '#004753'
                    }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 700 }}>{log.generatedBy}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>{log.date}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>{log.size}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800, background: '#ECFDF5', color: '#059669' }}>
                      <CheckCircle2 size={11} /> {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={() => alert(`Downloading "${log.name}"...`)}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showGenModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleGenerate}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Generate Site Safety Report
                </h3>
                <button type="button" onClick={() => setShowGenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Report Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Al Wasl Tower - Weekly HSE Executive Summary" 
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Format</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option value="PDF">PDF Document (with CCTV Snapshot Evidence)</option>
                  <option value="Excel">Excel Spreadsheet (.xlsx)</option>
                  <option value="CSV">CSV Data File</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowGenModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Generate Report
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
