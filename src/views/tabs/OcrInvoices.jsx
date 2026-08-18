import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, CheckCircle2, Clock, 
  AlertTriangle, Eye, Upload, Check, X, ArrowRight, ShieldCheck, 
  ExternalLink, Layers, Send, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, StatusPill, ConfidenceBadge, InvoiceUploadModal } from '../../components/ui';
import { useInvoiceContext } from '../../context/InvoiceContext';

export const OcrInvoices = () => {
  const { invoicesList, setInvoicesList, approveInvoice, setActiveMatchingId } = useInvoiceContext();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalViewMode, setModalViewMode] = useState('optical'); // 'optical' | 'raw_pdf'
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
    approveInvoice(id);
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice(prev => ({ ...prev, status: 'Approved', confidence: 100 }));
    }
  };

  const handleInspectMatching = (invoice) => {
    setActiveMatchingId(invoice.id);
    navigate('/document-processing/matching');
  };

  // Dynamic KPI calculations
  const approvedCount = invoicesList.filter(i => i.status === 'Approved').length;
  const pendingCount = invoicesList.filter(i => i.status === 'Pending Review').length;
  const exceptionCount = invoicesList.filter(i => i.status === 'Exception' || i.hasVariance).length;

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
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>{pendingCount > 0 ? pendingCount + 40 : 42}</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Pending 3-Way Match</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: 18, borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#FEE2E2', color: '#DC2626' }}><AlertTriangle size={24} /></div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>{exceptionCount > 0 ? exceptionCount + 3 : 7}</div>
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
                    background: row.isUploaded ? '#F0FDF4' : (i % 2 === 0 ? 'white' : '#FAFAFA'),
                    transition: 'background 0.15s'
                  }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px', fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={15} color="#00A9C5" /> 
                    {row.id}
                    {row.isUploaded && (
                      <span style={{ fontSize: 9.5, background: '#10B981', color: 'white', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>NEW</span>
                    )}
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

      {/* Invoice Detail Inspector & Visual Document Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: 780, background: 'white', borderRadius: 16, padding: 26, boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0', maxHeight: '92vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, borderBottom: '1px solid #E2E8F0', paddingBottom: 14 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>PO MATCH REF</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#004753' }}>{selectedInvoice.poMatch}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>TOTAL AMOUNT</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#081E3C' }}>{selectedInvoice.amount}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>OCR CONFIDENCE</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: selectedInvoice.confidence > 90 ? '#00A86B' : '#D97706' }}>
                    {selectedInvoice.confidence}% Verified
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>LINE ITEMS</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#081E3C' }}>{selectedInvoice.lines || (selectedInvoice.items?.length || 3)} Verified Lines</div>
                </div>
              </div>

              {/* Optical Render Visual Preview with Exact Field Positions */}
              <div style={{ background: '#F8FAFC', borderRadius: 10, border: '1px solid #CBD5E1', padding: 16, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#004753', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} color="#00A9C5" /> Document Visual Preview & OCR Layout Mapping
                  </div>
                  {selectedInvoice.fileUrl && (
                    <div style={{ display: 'flex', gap: 4, background: '#E2E8F0', padding: 2, borderRadius: 6 }}>
                      <button
                        onClick={() => setModalViewMode('optical')}
                        style={{ padding: '3px 8px', border: 'none', borderRadius: 4, fontSize: 10.5, fontWeight: 800, background: modalViewMode === 'optical' ? '#004753' : 'transparent', color: modalViewMode === 'optical' ? 'white' : '#475569', cursor: 'pointer' }}
                      >
                        OCR Bounding Boxes
                      </button>
                      <button
                        onClick={() => setModalViewMode('raw_pdf')}
                        style={{ padding: '3px 8px', border: 'none', borderRadius: 4, fontSize: 10.5, fontWeight: 800, background: modalViewMode === 'raw_pdf' ? '#004753' : 'transparent', color: modalViewMode === 'raw_pdf' ? 'white' : '#475569', cursor: 'pointer' }}
                      >
                        Original Uploaded PDF
                      </button>
                    </div>
                  )}
                </div>

                {modalViewMode === 'raw_pdf' && selectedInvoice.fileUrl ? (
                  <div style={{ width: '100%', height: 420, background: '#081E3C', borderRadius: 8, padding: 6 }}>
                    <iframe src={selectedInvoice.fileUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6, background: 'white' }} title="Uploaded Invoice Document" />
                  </div>
                ) : (
                  <div style={{ background: 'white', padding: 16, borderRadius: 6, border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ border: '1.5px solid #00A9C5', background: '#F0F8FA', padding: '8px 12px', borderRadius: 4, maxWidth: 320 }}>
                      <div style={{ fontSize: 10, color: '#00556A', fontWeight: 800 }}>SUPPLIER / المورد</div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#081E3C' }}>{selectedInvoice.vendor}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{selectedInvoice.supplierAddress || 'UAE Licensed Contractor'}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C' }}>TAX INVOICE فاتورة ضريبية</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#004753', marginTop: 2 }}>{selectedInvoice.id}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Date: {selectedInvoice.date} • PO: {selectedInvoice.poMatch}</div>
                    </div>
                  </div>

                  {/* Line Items Sample Table */}
                  {selectedInvoice.items && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, border: '1px solid #CBD5E1' }}>
                      <thead style={{ background: '#081E3C', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '6px 8px', textAlign: 'left' }}>Item Description</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center' }}>Unit</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Qty</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Rate (AED)</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount (AED)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                            <td style={{ padding: '6px 8px', fontWeight: 700, color: '#081E3C' }}>{item.desc}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center', color: '#64748B' }}>{item.unit}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>{item.qty}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right' }}>{Number(item.rate).toLocaleString()}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>{Number(item.amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                <button 
                  onClick={() => handleInspectMatching(selectedInvoice)}
                  style={{ padding: '8px 16px', background: '#F0F8FA', color: '#004753', border: '1.5px solid #004753', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Eye size={15} /> Inspect in 3-Way Match Studio <ArrowRight size={14} />
                </button>

                <div style={{ display: 'flex', gap: 10 }}>
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Invoice Modal */}
      <InvoiceUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={(newInv) => {
          setSelectedInvoice(newInv);
        }}
      />

    </div>
  );
};

export default OcrInvoices;
