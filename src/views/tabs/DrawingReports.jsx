import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Filter, Search, Calendar, ChevronDown, CheckCircle2, 
  Clock, Image as ImageIcon, Plus, Zap, AlertCircle, FileSpreadsheet, 
  FileCheck, Printer, Check
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const uaeReportLogs = [
  { id: 'REP-DXB-001', name: 'Al Wasl Tower - Complete BOQ & Material Takeoff', project: 'Al Wasl Commercial High-Rise', type: 'Excel (.xlsx)', generatedBy: 'Rashid Al Nuaimi', date: '14 Aug 2026', size: '4.8 MB', status: 'Generated' },
  { id: 'REP-AUH-002', name: 'Etihad Rail Hub - Structural Rebar Schedule', project: 'Etihad Rail Logistics & Depot Hub', type: 'PDF Report', generatedBy: 'Zaid Mansoor', date: '12 Aug 2026', size: '6.2 MB', status: 'Generated' },
  { id: 'REP-DXB-003', name: 'Dubai Creek Towers - Facade & Glazing Takeoff', project: 'Dubai Creek Harbour Towers', type: 'Excel (.xlsx)', generatedBy: 'Sarah Al Qasimi', date: '10 Aug 2026', size: '3.1 MB', status: 'Generated' },
  { id: 'REP-AUH-004', name: 'Zayed Museum - Visual Redline Revision Log', project: 'Zayed National Museum Extension', type: 'PDF Report', generatedBy: 'System Auto-Audit', date: '08 Aug 2026', size: '14.5 MB', status: 'Generated' },
  { id: 'REP-DWC-005', name: 'Al Maktoum Airport - Civil Earthworks MTO', project: 'Al Maktoum Int Airport Logistics Park', type: 'CSV Data', generatedBy: 'Omar Farooq', date: '05 Aug 2026', size: '1.4 MB', status: 'Generated' },
  { id: 'REP-SHJ-006', name: 'Sharjah Sustainable City - MEP Schedule Export', project: 'Sharjah Sustainable City Phase 3', type: 'Excel (.xlsx)', generatedBy: 'System Auto-Audit', date: '01 Aug 2026', size: '2.8 MB', status: 'Generated' },
];

const exportVolumeData = [
  { date: '01 Aug', exports: 14, sheets: 120 },
  { date: '03 Aug', exports: 22, sheets: 210 },
  { date: '05 Aug', exports: 18, sheets: 180 },
  { date: '07 Aug', exports: 31, sheets: 340 },
  { date: '09 Aug', exports: 42, sheets: 450 },
  { date: '11 Aug', exports: 35, sheets: 390 },
  { date: '14 Aug', exports: 54, sheets: 580 },
];

export const DrawingReports = () => {
  const [reportsList, setReportsList] = useState(uaeReportLogs);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReport, setNewReport] = useState({ project: 'Al Wasl Commercial High-Rise', type: 'Excel (.xlsx)', template: 'Complete BOQ & Material Takeoff' });

  const filteredLogs = reportsList.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(search.toLowerCase()) || 
                          log.project.toLowerCase().includes(search.toLowerCase()) ||
                          log.generatedBy.toLowerCase().includes(search.toLowerCase()) ||
                          log.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || log.type.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = (e) => {
    e.preventDefault();
    const created = {
      id: `REP-UAE-${String(reportsList.length + 1).padStart(3, '0')}`,
      name: `${newReport.project} - ${newReport.template}`,
      project: newReport.project,
      type: newReport.type,
      generatedBy: 'Current User',
      date: 'Just now',
      size: '3.4 MB',
      status: 'Generated'
    };
    setReportsList([created, ...reportsList]);
    setShowGenerateModal(false);
    alert(`Report generated: ${created.name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Reporting & Takeoff Exports
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Generate executive takeoff summaries, CSI cost code exports, and visual audit logs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowGenerateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Generate New Report
          </button>
        </div>
      </div>

      {/* Top Section: Export Analytics + Quick Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        
        {/* Area Chart: Report Export Trend */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Takeoff Export Velocity (August 2026)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Daily count of BOQ datasets and PDF takeoff packages exported
              </p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '3px 8px', borderRadius: 6 }}>
              216 Total Exports
            </span>
          </div>

          <div style={{ height: 180, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={exportVolumeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReportGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A9C5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                    formatter={(val) => [`${val} Exports`, 'Export Volume']}
                  />
                  <Area type="monotone" dataKey="exports" stroke="#004753" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReportGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Report Templates */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Standard Report Templates
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              1-click pre-configured export pipelines
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {[
              { title: 'Executive BOQ Cost Estimate', format: 'Excel + PDF', icon: <FileSpreadsheet size={16} color="#059669" />, desc: 'Division-level cost breakdown with markup' },
              { title: 'Material Takeoff (MTO) Schedule', format: 'CSV', icon: <FileText size={16} color="#00A9C5" />, desc: 'Raw quantities mapped by floor level' },
              { title: 'Visual Redline Revision Package', format: 'Vector PDF', icon: <FileCheck size={16} color="#004753" />, desc: 'Side-by-side CAD visual diffs and callouts' },
            ].map((tmpl, tIdx) => (
              <div 
                key={tIdx}
                onClick={() => {
                  setNewReport({ project: 'Al Wasl Commercial High-Rise', type: tmpl.format.includes('Excel') ? 'Excel (.xlsx)' : 'PDF Report', template: tmpl.title });
                  setShowGenerateModal(true);
                }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '10px 12px', borderRadius: 8, background: '#F8FAFC', 
                  border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.15s' 
                }}
                className="hover-bg-gray-50"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tmpl.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>{tmpl.title}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{tmpl.desc}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                  {tmpl.format}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Reports Log Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '6px 12px', borderRadius: 8, width: 300, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search generated reports, user, project..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', color: '#081E3C' }}
            >
              <option value="All">All Formats</option>
              <option value="Excel">Excel (.xlsx)</option>
              <option value="PDF">PDF Report</option>
              <option value="CSV">CSV Data</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredLogs.length} Generated Reports
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Report Name</th>
                <th style={{ padding: '12px 16px' }}>Project</th>
                <th style={{ padding: '12px 16px' }}>Format</th>
                <th style={{ padding: '12px 16px' }}>Generated By</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Size</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id}
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{log.name}</div>
                    <div style={{ fontSize: 11, color: '#00A9C5', fontWeight: 700 }}>{log.id}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#081E3C' }}>{log.project}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                      background: log.type.includes('Excel') ? '#ECFDF5' : log.type.includes('PDF') ? '#FEF2F2' : '#EFF6FF',
                      color: log.type.includes('Excel') ? '#059669' : log.type.includes('PDF') ? '#DC2626' : '#00A9C5'
                    }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>{log.generatedBy}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>{log.date}</td>
                  <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>{log.size}</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={() => alert(`Downloading ${log.name} (${log.size})...`)}
                      style={{ padding: '5px 12px', background: '#004753', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
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
        {showGenerateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleGenerateReport}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Generate New Takeoff Report
                </h3>
                <button type="button" onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Select Project *</label>
                <select 
                  value={newReport.project}
                  onChange={(e) => setNewReport({ ...newReport, project: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option>Al Wasl Commercial High-Rise</option>
                  <option>Etihad Rail Logistics & Depot Hub</option>
                  <option>Dubai Creek Harbour Towers</option>
                  <option>Zayed National Museum Extension</option>
                  <option>Al Maktoum Int Airport Logistics Park</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Report Template</label>
                <select 
                  value={newReport.template}
                  onChange={(e) => setNewReport({ ...newReport, template: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option>Complete BOQ & Material Takeoff</option>
                  <option>Structural Reinforcement Schedule</option>
                  <option>Architectural Openings & Finishes</option>
                  <option>Visual Redline Revision Package</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Output Format</label>
                <select 
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option>Excel (.xlsx)</option>
                  <option>PDF Report</option>
                  <option>CSV Data</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowGenerateModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
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
