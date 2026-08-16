import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, CheckCircle2, Clock, 
  AlertTriangle, Eye, Upload, Check, X, ArrowRight, ShieldCheck, 
  ExternalLink, Layers, Send
} from 'lucide-react';
import { Button, StatusPill, ConfidenceBadge } from '../../components/ui';

const initialInvoices = [
  { id: 'INV-24817', vendor: 'Al Noor Building Materials LLC', date: '2026-08-12', amount: '227,167.50 AED', status: 'Pending Review', confidence: 96, poMatch: 'PO-99128', project: 'Al Barsha Tower — Plot 4', lines: 5 },
  { id: 'INV-24815', vendor: 'Gulf Ready Mix Concrete LLC', date: '2026-08-12', amount: '62,370.00 AED', status: 'Approved', confidence: 99, poMatch: 'PO-88102', project: 'Al Barsha Tower — Substructure', lines: 2 },
  { id: 'INV-24819', vendor: 'Emirates Steel Industries PJSC', date: '2026-08-11', amount: '156,555.00 AED', status: 'Approved', confidence: 99, poMatch: 'PO-99150', project: 'Dubai Marina Residences', lines: 2 },
  { id: 'INV-9021', vendor: 'Fast Fixings Ltd', date: '2026-08-12', amount: '14,910.00 AED', status: 'Exception', confidence: 45, poMatch: 'Missing', project: 'Al Barsha Tower — Plot 4', lines: 4 },
  { id: 'INV-21044', vendor: 'Dutco Formwork Solutions', date: '2026-08-10', amount: '118,400.00 AED', status: 'Approved', confidence: 98, poMatch: 'PO-77412', project: 'Al Barsha Tower — Superstructure', lines: 3 },
  { id: 'INV-19042', vendor: 'Logistics Pro Haulage', date: '2026-08-09', amount: '24,500.00 AED', status: 'Pending Review', confidence: 88, poMatch: 'PO-66109', project: 'Al Barsha Tower — Logistics', lines: 2 },
  { id: 'INV-18011', vendor: 'BuildMat Corp LLC', date: '2026-08-08', amount: '32,500.00 AED', status: 'Exception', confidence: 75, poMatch: 'PO-55102', project: 'Downtown Commercial Hub', lines: 1 },
  { id: 'INV-17024', vendor: 'Al Quoz MEP Engineering LLC', date: '2026-08-07', amount: '89,400.00 AED', status: 'Approved', confidence: 97, poMatch: 'PO-99180', project: 'Al Barsha Tower — Plot 4', lines: 6 },
  { id: 'INV-16055', vendor: 'National Cleaning Services', date: '2026-08-06', amount: '18,000.00 AED', status: 'Exception', confidence: 92, poMatch: 'PO-44102', project: 'Corporate Facilities', lines: 1 },
  { id: 'INV-15099', vendor: 'Security & Safety Systems LLC', date: '2026-08-05', amount: '38,200.00 AED', status: 'Approved', confidence: 99, poMatch: 'PO-33109', project: 'Site Operations', lines: 3 },
];

export const OcrInvoices = () => {
  const [invoicesList, setInvoicesList] = useState(initialInvoices);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const filteredInvoices = invoicesList.filter(inv => 
    (filter === 'All' || inv.status === filter) &&
    (inv.vendor.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.poMatch.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  const handleApproveInvoice = (id) => {
    setInvoicesList(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved', confidence: 100 } : item));
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice(prev => ({ ...prev, status: 'Approved', confidence: 100 }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C' }}>
            Invoice Register & Auditing
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Central repository of all processed, matched, and pending invoices across active construction projects.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(0, 71, 83, 0.08)', color: '#004753', border: '1.5px solid rgba(0, 71, 83, 0.3)', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Upload size={15} /> Upload Invoice
          </button>
          <button 
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> {exportNotice ? 'Exporting CSV...' : 'Export Register'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: 16 }}>
        <motion.div whileHover={{ y: -2 }} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: 18, borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#ECFDF5', color: '#059669' }}><CheckCircle2 size={24} /></div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>1,204</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Approved This Month (AED 42.8M)</div>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -2 }} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: 18, borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#FEF3C7', color: '#D97706' }}><Clock size={24} /></div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>42</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Pending 3-Way Match</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: 18, borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#FEE2E2', color: '#DC2626' }}><AlertTriangle size={24} /></div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>7</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Exceptions in Triage</div>
          </div>
        </motion.div>
      </div>

      {/* Main Table Card */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Table Filters */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '6px 12px', borderRadius: 8, width: 280, border: '1px solid #E2E8F0' }}>
            <Search size={15} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search vendor, invoice #, PO..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#081E3C', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Status:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1.5px solid #CBD5E1', outline: 'none', fontSize: 12.5, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Invoices ({invoicesList.length})</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Exception">Exceptions</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#081E3C', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '12px 18px', width: 140 }}>Invoice #</th>
                <th style={{ padding: '12px 14px' }}>Vendor Legal Entity</th>
                <th style={{ padding: '12px 14px' }}>Project Allocation</th>
                <th style={{ padding: '12px 14px' }}>PO Reference</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>AI Confidence</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total (AED)</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((row, i) => (
                <tr 
                  key={row.id}
                  onClick={() => setSelectedInvoice(row)}
                  style={{ 
                    borderBottom: '1px solid #F1F5F9', 
                    cursor: 'pointer',
                    background: i % 2 === 0 ? 'white' : '#FAFAFA',
                    transition: 'background 0.15s'
                  }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px', fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={15} color="#00A9C5" /> {row.id}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#081E3C' }}>{row.vendor}</td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontWeight: 500 }}>{row.project}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: row.poMatch === 'Missing' ? '#DC2626' : '#004753' }}>
                    {row.poMatch}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <ConfidenceBadge value={row.confidence} />
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>
                    {row.amount}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11.5, fontWeight: 700,
                      background: row.status === 'Approved' ? '#DCFCE7' : row.status === 'Exception' ? '#FEE2E2' : '#FEF3C7',
                      color: row.status === 'Approved' ? '#15803D' : row.status === 'Exception' ? '#B91C1C' : '#B45309'
                    }}>
                      {row.status === 'Approved' && <CheckCircle2 size={12} />}
                      {row.status === 'Exception' && <AlertTriangle size={12} />}
                      {row.status === 'Pending Review' && <Clock size={12} />}
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(row);
                      }}
                      style={{ padding: '6px 12px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontWeight: 800, fontSize: 11.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      <Eye size={13} /> View Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Inspector Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: 640, background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#081E3C' }}>
                      Invoice Audit Summary: {selectedInvoice.id}
                    </h3>
                    <StatusPill status={selectedInvoice.status === 'Approved' ? 'success' : selectedInvoice.status === 'Exception' ? 'danger' : 'warning'} label={selectedInvoice.status} />
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748B' }}>
                    {selectedInvoice.vendor} • {selectedInvoice.project}
                  </div>
                </div>
                <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>PO MATCH REF</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#004753' }}>{selectedInvoice.poMatch}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>TOTAL AMOUNT BILLED</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#081E3C' }}>{selectedInvoice.amount}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>OCR CONFIDENCE</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: selectedInvoice.confidence > 90 ? '#00A86B' : '#D97706' }}>
                    {selectedInvoice.confidence}% Verified
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>LINE ITEMS EXTRACTED</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#081E3C' }}>{selectedInvoice.lines} Verified Lines</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                <button onClick={() => setSelectedInvoice(null)} style={{ padding: '8px 16px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Close
                </button>
                {selectedInvoice.status !== 'Approved' && (
                  <button 
                    onClick={() => handleApproveInvoice(selectedInvoice.id)}
                    style={{ padding: '8px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                  >
                    <Check size={16} /> Approve & Authorize ERP Posting
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
