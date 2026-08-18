import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Clock, ShieldAlert, Image as ImageIcon, Search, 
  ChevronRight, XCircle, RefreshCw, Layers, CheckCircle2, FileText, 
  Eye, Check, Edit3, ArrowRight, ShieldCheck, Sparkles, Filter, ExternalLink, HelpCircle, X
} from 'lucide-react';
import { Button, StatusPill, ConfidenceBadge } from '../../components/ui';
import { useInvoiceContext } from '../../context/InvoiceContext';

export const OcrExceptions = () => {
  const { exceptionsList, setExceptionsList } = useInvoiceContext();
  const [activeExceptionId, setActiveExceptionId] = useState(exceptionsList[0]?.id || 'EXC-002');
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  
  // Triage Action States
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Invalid PO Reference');
  
  // Manual Entry Form State
  const [formVendor, setFormVendor] = useState('Al Noor Building Materials LLC');
  const [formPo, setFormPo] = useState('PO-99128');
  const [formAmount, setFormAmount] = useState('84,200.00');
  const [formTax, setFormTax] = useState('4,210.00');

  const activeItem = exceptionsList.find(e => e.id === activeExceptionId) || exceptionsList[0];

  // Handler for Re-running AI OCR
  const handleRerunOcr = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
      setExceptionsList(prev => prev.map(item => {
        if (item.id === activeItem.id) {
          return {
            ...item,
            confidence: 99,
            resolved: true,
            resolutionNote: 'AI Neural Enhancement recovered high-res text vector. Matched to PO-99128 with 99% accuracy.'
          };
        }
        return item;
      }));
    }, 1800);
  };

  // Handler for Manual Override
  const handleSaveManualEntry = () => {
    setExceptionsList(prev => prev.map(item => {
      if (item.id === activeItem.id) {
        return {
          ...item,
          vendor: formVendor,
          confidence: 100,
          resolved: true,
          resolutionNote: `Manually verified & linked to ${formPo} by Auditor.`
        };
      }
      return item;
    }));
    setIsManualEntryOpen(false);
  };

  // Handler for Reject Document
  const handleConfirmReject = () => {
    setExceptionsList(prev => prev.map(item => {
      if (item.id === activeItem.id) {
        return {
          ...item,
          resolved: true,
          rejected: true,
          resolutionNote: `Document Rejected: ${rejectReason}. Dispute notice dispatched to vendor.`
        };
      }
      return item;
    }));
    setShowRejectModal(false);
  };

  const filteredItems = exceptionsList.filter(e => {
    const matchesSearch = e.vendor.toLowerCase().includes(search.toLowerCase()) || 
                          e.type.toLowerCase().includes(search.toLowerCase()) ||
                          e.invNo.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' ? true : 
                            filterSeverity === 'Resolved' ? e.resolved :
                            filterSeverity === 'Open' ? !e.resolved :
                            e.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const openCount = exceptionsList.filter(e => !e.resolved).length;

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      
      {/* ======================================================== */}
      {/* LEFT PANE: EXCEPTION QUEUE (380px) */}
      {/* ======================================================== */}
      <div style={{ flex: '0 0 380px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--color-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
              Exception Triage 
              <span style={{ fontSize: 12, background: openCount > 0 ? '#FEE2E2' : '#DCFCE7', color: openCount > 0 ? '#DC2626' : '#16A34A', padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>
                {openCount} Open
              </span>
            </h2>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 12 }}>
            <Search size={15} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search vendor, invoice, or issue..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#081E3C', fontWeight: 500 }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Open', 'Critical', 'Resolved'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilterSeverity(tab)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: filterSeverity === tab ? 'var(--gradient-brand)' : '#F1F5F9',
                  color: filterSeverity === tab ? 'white' : '#64748B',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: filterSeverity === tab ? '0 2px 8px rgba(0, 71, 83, 0.25)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Items */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              No exceptions match your search filter.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = activeExceptionId === item.id;
              return (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setActiveExceptionId(item.id);
                    setIsManualEntryOpen(false);
                  }}
                  style={{ 
                    padding: '14px 16px', 
                    borderBottom: '1px solid #F1F5F9', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s',
                    background: item.resolved 
                      ? '#F0FDF4'
                      : isSelected 
                      ? '#FEF2F2' 
                      : 'white',
                    borderLeft: isSelected 
                      ? (item.resolved ? '4px solid #00A86B' : '4px solid #DC2626')
                      : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#081E3C' : '#334155' }} className="truncate">
                      {item.vendor}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{item.date}</span>
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: item.resolved ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.resolved ? (
                      <>
                        <CheckCircle2 size={14} color="#059669" /> {item.rejected ? 'Rejected' : 'Resolved & Verified'}
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} color="#DC2626" /> {item.type}
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
                      {item.invNo} • {item.totalAmount}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: item.confidence > 80 ? '#00A86B' : item.confidence > 60 ? '#D97706' : '#DC2626' }}>
                        {item.confidence}%
                      </span>
                      <ChevronRight size={14} color="#94A3B8" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT PANE: ACTIVE EXCEPTION RESOLUTION WORKSTATION */}
      {/* ======================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}
            >
              {/* Alert & Action Header */}
              <div style={{ 
                background: activeItem.resolved ? '#ECFDF5' : '#FEF2F2', 
                border: activeItem.resolved ? '1px solid #A7F3D0' : '1px solid #FECACA', 
                borderRadius: 14, 
                padding: 20, 
                display: 'flex', 
                gap: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ 
                  padding: 12, 
                  borderRadius: 12, 
                  background: activeItem.resolved ? '#D1FAE5' : '#FEE2E2', 
                  color: activeItem.resolved ? '#059669' : '#DC2626', 
                  height: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeItem.resolved ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: activeItem.resolved ? '#065F46' : '#991B1B' }}>
                          {activeItem.type}
                        </h2>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: activeItem.resolved ? '#10B981' : '#DC2626', color: 'white' }}>
                          {activeItem.resolved ? 'RESOLVED' : `${activeItem.severity.toUpperCase()} PRIORITY`}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 14px 0', fontSize: 13, color: activeItem.resolved ? '#047857' : '#7F1D1D', lineHeight: 1.5 }}>
                        {activeItem.resolved ? activeItem.resolutionNote : activeItem.issueDesc}
                      </p>
                    </div>
                  </div>

                  {/* Triage Action Buttons */}
                  {!activeItem.resolved ? (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setIsManualEntryOpen(true)}
                        style={{ padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                      >
                        <Edit3 size={15} /> Force Manual Data Entry
                      </button>

                      <button 
                        onClick={handleRerunOcr}
                        disabled={isAiScanning}
                        style={{ padding: '8px 16px', background: 'rgba(0, 71, 83, 0.08)', color: '#004753', border: '1.5px solid rgba(0, 71, 83, 0.3)', borderRadius: 8, fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: isAiScanning ? 'not-allowed' : 'pointer' }}
                      >
                        <motion.div animate={isAiScanning ? { rotate: 360 } : {}} transition={isAiScanning ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}>
                          <RefreshCw size={15} />
                        </motion.div>
                        {isAiScanning ? 'Running Deep OCR Pass...' : 'Re-run AI OCR'}
                      </button>

                      <button 
                        onClick={() => setShowRejectModal(true)}
                        style={{ padding: '8px 16px', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5', borderRadius: 8, fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                      >
                        <XCircle size={15} /> Reject Document
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ background: '#D1FAE5', color: '#065F46', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={14} strokeWidth={3} /> Ready for ERP Posting
                      </div>
                      <button 
                        onClick={() => {
                          setExceptionsList(prev => prev.map(item => item.id === activeItem.id ? { ...item, resolved: false } : item));
                        }}
                        style={{ background: 'white', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
                      >
                        Re-open Exception
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Interactive Work Area */}
              <div style={{ flex: 1, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 14, display: 'flex', overflow: 'hidden', minHeight: 460, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                
                {/* Left Half: Scanned Document Visualizer */}
                <div style={{ flex: '0 0 52%', borderRight: '1px solid #E2E8F0', padding: 24, background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={16} color="#004753" /> Scanned Document Optical Render
                    </div>
                    <div style={{ fontSize: 11.5, background: '#E6F4F7', color: '#004753', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                      {activeItem.invNo} • {activeItem.itemsCount}
                    </div>
                  </div>

                  {/* Document Render Sheet */}
                  <div style={{ flex: 1, background: 'white', borderRadius: 8, border: '1px solid #CBD5E1', padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Visual AI Scanning Beam */}
                    {isAiScanning && (
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        style={{ position: 'absolute', left: 0, right: 0, height: 3, background: '#00A9C5', boxShadow: '0 0 15px 4px rgba(0,169,197,0.6)', zIndex: 30 }}
                      />
                    )}

                    {/* Invoice Header Mock */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #081E3C', paddingBottom: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#081E3C' }}>{activeItem.vendor}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>Commercial Tax Invoice • Date: {activeItem.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#004753' }}>{activeItem.invNo}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>UAE VAT COMPLIANT</div>
                      </div>
                    </div>

                    {/* Highlighted Discrepancy Box on Document */}
                    <div style={{ 
                      border: activeItem.resolved ? '2px solid #10B981' : '2px dashed #DC2626', 
                      background: activeItem.resolved ? '#ECFDF5' : '#FEF2F2', 
                      padding: 12, 
                      borderRadius: 6, 
                      marginBottom: 16,
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: activeItem.resolved ? '#065F46' : '#991B1B', textTransform: 'uppercase' }}>
                          Target Field: {activeItem.missingField}
                        </span>
                        <ConfidenceBadge value={activeItem.confidence} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#081E3C', marginTop: 4 }}>
                        {activeItem.id === 'EXC-002' && (
                          <span>PO Number: <strong style={{ color: activeItem.resolved ? '#004753' : '#DC2626' }}>{activeItem.resolved ? formPo : '[NOT DETECTED / MISSING]'}</strong></span>
                        )}
                        {activeItem.id === 'EXC-001' && (
                          <span>OCR Confidence: <strong style={{ color: activeItem.resolved ? '#004753' : '#DC2626' }}>{activeItem.resolved ? '99% (Enhanced)' : '45% (Blurry scan)'}</strong></span>
                        )}
                        {activeItem.id === 'EXC-003' && (
                          <span>Unit Price: <strong style={{ color: activeItem.resolved ? '#004753' : '#DC2626' }}>{activeItem.resolved ? '3,100.00 AED/MT' : '3,450.00 AED/MT (+350 AED variance)'}</strong></span>
                        )}
                        {activeItem.id === 'EXC-004' && (
                          <span>FTA TRN: <strong style={{ color: activeItem.resolved ? '#004753' : '#DC2626' }}>{activeItem.resolved ? '100293847500003 (Verified Active)' : '100293847500003 (Checksum Failed)'}</strong></span>
                        )}
                        {activeItem.id === 'EXC-006' && (
                          <span>Currency: <strong style={{ color: activeItem.resolved ? '#004753' : '#DC2626' }}>{activeItem.resolved ? 'AED (Converted @ 3.6725)' : '$12,400.00 USD'}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Table Mock Lines */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: 700 }}>
                        <span>Item Description</span>
                        <span>Amount</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#334155' }}>
                        <span>Primary Scope Deliverables</span>
                        <span>{activeItem.totalAmount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748B' }}>
                        <span>VAT (5%)</span>
                        <span>Included</span>
                      </div>
                    </div>

                    {/* Bottom Status Ribbon */}
                    <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>OCR Engine: Google Vision Deep v4.2</span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: activeItem.resolved ? '#059669' : '#D97706' }}>
                        {activeItem.resolved ? 'STATUS: VERIFIED' : 'STATUS: REQUIRES REVIEW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Half: Resolution Workstation & Form */}
                <div style={{ flex: '0 0 48%', padding: 24, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  
                  {!isManualEntryOpen ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                          AI Automated Diagnosis & Suggested Actions
                        </h3>
                        <p style={{ margin: 0, fontSize: 12.5, color: '#64748B', lineHeight: 1.4 }}>
                          Select one of the system-suggested resolutions or trigger manual keying to reconcile this document against ERP subcontracts.
                        </p>
                      </div>

                      {/* Quick Auto-Link Box */}
                      {activeItem.suggestedPo && !activeItem.resolved && (
                        <div style={{ background: '#F0F8FA', border: '1.5px solid #004753', borderRadius: 10, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#004753', marginBottom: 4 }}>
                            <Sparkles size={15} color="#00A9C5" /> AI Recommended Match Found
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C', marginBottom: 4 }}>
                            Link to {activeItem.suggestedPo}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#475569', marginBottom: 12 }}>
                            Vendor match probability 94% based on delivery location (Plot 4) and line scope.
                          </div>
                          <button 
                            onClick={() => {
                              setFormPo(activeItem.suggestedPo.split(' ')[0]);
                              setExceptionsList(prev => prev.map(item => item.id === activeItem.id ? { ...item, confidence: 98, resolved: true, resolutionNote: `Auto-linked to ${activeItem.suggestedPo} with 98% confidence.` } : item));
                            }}
                            style={{ background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                          >
                            <Check size={14} /> Accept Suggested PO & Resolve
                          </button>
                        </div>
                      )}

                      {/* Resolution Audit Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#081E3C', textTransform: 'uppercase' }}>
                          Validation Checklist
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', background: '#F8FAFC', padding: 10, borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          <CheckCircle2 size={16} color="#00A86B" />
                          <span>Vendor Registered in Master Vendor File</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', background: '#F8FAFC', padding: 10, borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          <CheckCircle2 size={16} color="#00A86B" />
                          <span>Tax Registration Number (TRN) Validated</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: activeItem.resolved ? '#334155' : '#DC2626', background: activeItem.resolved ? '#F8FAFC' : '#FEF2F2', padding: 10, borderRadius: 6, border: activeItem.resolved ? '1px solid #E2E8F0' : '1px solid #FECACA' }}>
                          {activeItem.resolved ? <CheckCircle2 size={16} color="#00A86B" /> : <XCircle size={16} color="#DC2626" />}
                          <span>{activeItem.missingField} — {activeItem.resolved ? 'Resolved' : 'Requires Auditor Action'}</span>
                        </div>
                      </div>

                      {/* Fast Action Card */}
                      <div style={{ marginTop: 'auto', background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>Need to correct extracted figures directly?</div>
                        <button 
                          onClick={() => setIsManualEntryOpen(true)}
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                        >
                          <Edit3 size={15} /> Open Side-by-Side Keying Editor
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Manual Entry Form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#081E3C' }}>
                          Manual Keying & PO Linker
                        </h3>
                        <button onClick={() => setIsManualEntryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={18} /></button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Vendor Legal Entity</label>
                          <input 
                            type="text" 
                            value={formVendor} 
                            onChange={(e) => setFormVendor(e.target.value)} 
                            style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 600 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Assign Purchase Order (PO)</label>
                          <select 
                            value={formPo} 
                            onChange={(e) => setFormPo(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1.5px solid #004753', borderRadius: 6, fontWeight: 700, background: 'white' }}
                          >
                            <option value="PO-99128">PO-99128 — Al Barsha Superstructure (Al Noor)</option>
                            <option value="PO-88102">PO-88102 — Substructure Ready Mix (Gulf)</option>
                            <option value="PO-99150">PO-99150 — Rebar & Steel Supply (Emirates Steel)</option>
                            <option value="PO-77412">PO-77412 — Formwork Rental (Dutco)</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Subtotal Amount (AED)</label>
                            <input 
                              type="text" 
                              value={formAmount} 
                              onChange={(e) => setFormAmount(e.target.value)} 
                              style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700 }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>VAT 5% (AED)</label>
                            <input 
                              type="text" 
                              value={formTax} 
                              onChange={(e) => setFormTax(e.target.value)} 
                              style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700 }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid #E2E8F0' }}>
                        <button 
                          onClick={handleSaveManualEntry}
                          style={{ flex: 1, padding: '10px 16px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                        >
                          <Check size={16} /> Save & Mark Resolved
                        </button>
                        <button 
                          onClick={() => setIsManualEntryOpen(false)}
                          style={{ padding: '10px 16px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* REJECT DOCUMENT MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showRejectModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 440, background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: 17, fontWeight: 900, color: '#991B1B' }}>
                Reject Document & Issue Dispute Notice
              </h3>
              <p style={{ fontSize: 12.5, color: '#64748B', marginBottom: 16 }}>
                This will reject <strong>{activeItem.invNo}</strong> from {activeItem.vendor} and dispatch an official rejection letter.
              </p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Select Rejection Reason:
                </label>
                <select 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 600 }}
                >
                  <option value="Invalid PO Reference">Invalid or Missing Purchase Order Reference</option>
                  <option value="Unapproved Price Escalation">Unapproved Price / Rate Escalation</option>
                  <option value="Duplicate Invoice Detected">Duplicate Invoice Detected</option>
                  <option value="Illegible Document Scan">Illegible Document Scan Quality</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  onClick={() => setShowRejectModal(false)}
                  style={{ padding: '8px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmReject}
                  style={{ padding: '8px 16px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
