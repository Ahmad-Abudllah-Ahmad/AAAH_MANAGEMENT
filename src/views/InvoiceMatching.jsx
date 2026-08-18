import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ZoomIn, ZoomOut, Maximize2, Edit3, MessageSquare, Hand, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, 
  FileText, ArrowRight, CornerDownRight, RefreshCw, Layers, Send, X, ExternalLink
} from 'lucide-react';
import { Button, StatusPill, ConfidenceBadge, ProcessFlowStepper, Alert } from '../components/ui';
import { useInvoiceContext } from '../context/InvoiceContext';

export const InvoiceMatching = () => {
  const { invoicesList, activeMatchingId, setActiveMatchingId, approveInvoice } = useInvoiceContext();

  const matchingQueue = invoicesList.map(inv => ({
    id: inv.id,
    project: inv.project || 'Al Barsha Tower — Plot 4',
    supplier: inv.supplier || inv.vendor,
    supplierAddress: inv.supplierAddress || 'Dubai, United Arab Emirates',
    supplierConfidence: inv.confidence || 99,
    date: inv.date || '12/06/2026',
    dateConfidence: 98,
    billTo: inv.billTo || 'ABC Construction LLC',
    billToAddress: inv.billToAddress || 'Dubai, United Arab Emirates',
    poNumber: inv.poNumber || inv.poMatch || 'PO-99128',
    grnNumber: inv.grnNumber || 'GRN-8812',
    items: inv.items || [
      { id: 1, desc: 'Ready-mix concrete C40', unit: 'm³', qty: 120, rate: 340, amount: 40800, poQty: 120, grnQty: 120, status: 'Matched' },
      { id: 2, desc: 'Reinforcement bar 16mm', unit: 'MT', qty: 15, rate: 3250, amount: 48750, poQty: 15, grnQty: 15, status: 'Matched', needsRateReview: true },
      { id: 3, desc: 'Formwork plywood 18mm', unit: 'm²', qty: 500, rate: 85, amount: 42500, poQty: 500, grnQty: 500, status: 'Matched' },
      { id: 4, desc: 'Structural steel section', unit: 'MT', qty: 8, rate: 6800, amount: 54400, poQty: 8, grnQty: 8, status: 'Matched' },
      { id: 5, desc: 'Cement Type I 50kg', unit: 'bags', qty: 260, rate: 115, amount: 29900, poQty: 240, grnQty: 240, status: 'Qty Variance', hasDiscrepancy: true },
    ],
    subtotal: inv.subtotal || 216350,
    vat: inv.vat || 10817.50,
    total: inv.total || 227167.50,
    hasVariance: inv.hasVariance || inv.status === 'Exception',
    fileUrl: inv.fileUrl,
    fileName: inv.fileName,
    isUploaded: inv.isUploaded
  }));

  const initialIdx = Math.max(0, matchingQueue.findIndex(i => i.id === activeMatchingId));
  const [currentQueueIndex, setCurrentQueueIndex] = useState(initialIdx !== -1 ? initialIdx : 0);

  useEffect(() => {
    if (activeMatchingId) {
      const idx = matchingQueue.findIndex(i => i.id === activeMatchingId);
      if (idx !== -1) setCurrentQueueIndex(idx);
    }
  }, [activeMatchingId, invoicesList.length]);

  const currentInvoice = matchingQueue[currentQueueIndex] || matchingQueue[0];

  const [zoom, setZoom] = useState(85);
  const [activeTool, setActiveTool] = useState('hand'); // 'hand' | 'annotate' | 'comment'
  const [docViewMode, setDocViewMode] = useState('optical'); // 'optical' | 'pdf'
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Resolution states for current invoice
  const [varianceResolved, setVarianceResolved] = useState(false);
  const [resolutionType, setResolutionType] = useState(''); // 'accept_grn' | 'routed_approval' | 'credit_note'
  const [rateResolved, setRateResolved] = useState(false);
  const [customRate, setCustomRate] = useState('3250.00');
  
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const [showRatePopover, setShowRatePopover] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([
    { author: 'AI Audit Bot', time: '12m ago', text: 'Auto-flagged item #5: Invoice Qty 260 exceeds Goods Received Note GRN-8812 (240 bags).' }
  ]);
  const [newComment, setNewComment] = useState('');

  const [postingStatus, setPostingStatus] = useState('idle'); // idle | validating | posting | success
  const [erpVoucherNumber, setErpVoucherNumber] = useState('');

  const handlePostERP = () => {
    if (currentInvoice.hasVariance && !varianceResolved) return;
    setPostingStatus('validating');
    setTimeout(() => {
      setPostingStatus('posting');
      setTimeout(() => {
        const vouch = `AP-VOUCH-${Math.floor(100000 + Math.random() * 900000)}`;
        setErpVoucherNumber(vouch);
        setPostingStatus('success');
        approveInvoice(currentInvoice.id);
      }, 1200);
    }, 1000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, { author: 'Commercial Lead', time: 'Just now', text: newComment.trim() }]);
    setNewComment('');
  };

  // Resolved dynamic values for item 5
  const item5Qty = varianceResolved && resolutionType === 'accept_grn' ? 240 : 260;
  const item5Amount = item5Qty * 115;
  const calculatedSubtotal = varianceResolved && resolutionType === 'accept_grn' ? 214050 : currentInvoice.subtotal;
  const calculatedVat = calculatedSubtotal * 0.05;
  const calculatedTotal = calculatedSubtotal + calculatedVat;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Stepper */}
      <ProcessFlowStepper 
        steps={['Document Intake', 'OCR & Extraction', 'Validation', 'Three-Way Match', 'ERP Posting']} 
        currentStepIndex={postingStatus === 'success' ? 4 : 3} 
      />

      {/* Main Container */}
      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 650 }}>
        
        {/* ======================================================== */}
        {/* PANEL A: DOCUMENT VIEWER (56%) */}
        {/* ======================================================== */}
        <div style={{ flex: '0 0 56%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="text-h2" style={{ margin: 0, fontSize: 18, color: '#081E3C', fontWeight: 800 }}>Invoice Document Preview</h2>
              <div style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-700)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid var(--color-brand-200)' }}>
                {currentInvoice.project}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-gray-500)', fontWeight: 600 }}>
              Queue: <span style={{ color: 'var(--color-brand-700)', fontWeight: 800 }}>{currentQueueIndex + 1} of {invoicesQueue.length}</span>
            </div>
          </div>

          <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Document Toolbar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={() => setCurrentQueueIndex(Math.max(0, currentQueueIndex - 1))}
                  disabled={currentQueueIndex === 0}
                  style={{ border: '1px solid #CBD5E1', background: 'white', borderRadius: 6, padding: '4px 8px', cursor: currentQueueIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQueueIndex === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={16} color="#081E3C" />
                </button>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#081E3C' }}>
                  {currentQueueIndex + 1} / {matchingQueue.length}
                </span>
                <button 
                  onClick={() => setCurrentQueueIndex(Math.min(matchingQueue.length - 1, currentQueueIndex + 1))}
                  disabled={currentQueueIndex === matchingQueue.length - 1}
                  style={{ border: '1px solid #CBD5E1', background: 'white', borderRadius: 6, padding: '4px 8px', cursor: currentQueueIndex === matchingQueue.length - 1 ? 'not-allowed' : 'pointer', opacity: currentQueueIndex === matchingQueue.length - 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                >
                  <ChevronRight size={16} color="#081E3C" />
                </button>
                <span style={{ fontSize: 11.5, color: '#64748B', marginLeft: 6 }}>({currentInvoice.id})</span>
              </div>

              {/* View Switcher if fileUrl exists */}
              {currentInvoice.fileUrl && (
                <div style={{ display: 'flex', gap: 4, background: '#E2E8F0', padding: 2, borderRadius: 6 }}>
                  <button 
                    onClick={() => setDocViewMode('optical')}
                    style={{ padding: '3px 8px', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 800, background: docViewMode === 'optical' ? '#004753' : 'transparent', color: docViewMode === 'optical' ? 'white' : '#475569', cursor: 'pointer' }}
                  >
                    OCR Overlay
                  </button>
                  <button 
                    onClick={() => setDocViewMode('pdf')}
                    style={{ padding: '3px 8px', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 800, background: docViewMode === 'pdf' ? '#004753' : 'transparent', color: docViewMode === 'pdf' ? 'white' : '#475569', cursor: 'pointer' }}
                  >
                    Original PDF
                  </button>
                </div>
              )}

              {/* Tools & Zoom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', padding: '3px 8px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}><ZoomOut size={15} color="#475569" /></button>
                  <span style={{ fontSize: 11.5, width: 42, textAlign: 'center', fontWeight: 700, color: '#081E3C' }}>{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(140, zoom + 10))} title="Zoom In" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}><ZoomIn size={15} color="#475569" /></button>
                  <button onClick={() => setZoom(85)} title="Reset" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: '#00A9C5', marginLeft: 4 }}>Fit</button>
                </div>

                <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />

                {/* Tool Selection */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    onClick={() => setActiveTool('hand')}
                    title="Pan View"
                    style={{ padding: 6, borderRadius: 6, border: activeTool === 'hand' ? '1px solid #004753' : '1px solid transparent', background: activeTool === 'hand' ? '#E6F4F7' : 'transparent', color: activeTool === 'hand' ? '#004753' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Hand size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTool('annotate')}
                    title="OCR Bounding Box Inspector"
                    style={{ padding: 6, borderRadius: 6, border: activeTool === 'annotate' ? '1px solid #004753' : '1px solid transparent', background: activeTool === 'annotate' ? '#E6F4F7' : 'transparent', color: activeTool === 'annotate' ? '#004753' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => setShowCommentBox(!showCommentBox)}
                    title="Audit Comments"
                    style={{ padding: 6, borderRadius: 6, border: showCommentBox ? '1px solid #004753' : '1px solid transparent', background: showCommentBox ? '#E6F4F7' : 'transparent', color: showCommentBox ? '#004753' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
                  >
                    <MessageSquare size={16} />
                    {comments.length > 0 && (
                      <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#DC2626', borderRadius: '50%' }} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice Canvas */}
            <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#ECEFF4', position: 'relative' }}>
              
              {/* Optional Comments Overlay Drawer */}
              <AnimatePresence>
                {showCommentBox && (
                  <motion.div 
                    initial={{ opacity: 0, x: 200 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 200 }}
                    style={{ position: 'absolute', top: 12, right: 12, bottom: 12, width: 280, background: 'white', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid #CBD5E1', zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                  >
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#081E3C', color: 'white' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MessageSquare size={14} /> Audit Trail Comments
                      </div>
                      <button onClick={() => setShowCommentBox(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={16} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {comments.map((c, idx) => (
                        <div key={idx} style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11.5 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#004753', marginBottom: 4 }}>
                            <span>{c.author}</span>
                            <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: 10.5 }}>{c.time}</span>
                          </div>
                          <div style={{ color: '#334155', lineHeight: 1.4 }}>{c.text}</div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} style={{ padding: 10, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 6 }}>
                      <input 
                        type="text" 
                        placeholder="Add note..." 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '1px solid #CBD5E1', borderRadius: 6, outline: 'none' }}
                      />
                      <button type="submit" style={{ background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                        <Send size={14} />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Conditional: Raw PDF View vs Printable Invoice Sheet */}
              {docViewMode === 'pdf' && currentInvoice.fileUrl ? (
                <div style={{ width: '100%', height: '100%', minHeight: 580, background: '#081E3C', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column' }}>
                  <iframe 
                    src={currentInvoice.fileUrl} 
                    style={{ width: '100%', height: '100%', minHeight: 560, border: 'none', borderRadius: 6, background: 'white' }} 
                    title="Uploaded PDF Document"
                  />
                </div>
              ) : (
                /* Printable Invoice Sheet with Exact Field Positions */
                <motion.div 
                  style={{ 
                    width: 780, 
                    background: 'white', 
                    padding: 40,
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    scale: zoom / 100,
                    transformOrigin: 'top center',
                    transition: 'scale 0.15s ease-out'
                  }}
                >
                {/* Invoice Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 36, alignItems: 'flex-start' }}>
                  {/* Supplier Box */}
                  <div style={{ border: '2px solid #00A9C5', padding: '14px 18px', borderRadius: 6, background: '#F0F8FA', position: 'relative', maxWidth: 360 }}>
                    <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Supplier / المورد</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#081E3C' }}>{currentInvoice.supplier}</div>
                    <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4, lineHeight: 1.4 }}>{currentInvoice.supplierAddress}</div>
                    <div style={{ position: 'absolute', right: -12, top: -10 }}>
                      <ConfidenceBadge value={currentInvoice.supplierConfidence} />
                    </div>
                  </div>

                  {/* Invoice Meta */}
                  <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: 22, fontWeight: 900, color: '#081E3C' }}>
                      TAX INVOICE <span style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', fontSize: 18, color: '#004753' }}>فاتورة ضريبية</span>
                    </h1>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 6 }}>
                      <div style={{ border: '1.5px solid #00A86B', background: '#F0FDF4', padding: '4px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#081E3C' }}>Invoice No: {currentInvoice.id}</span>
                        <ConfidenceBadge value={99} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <div style={{ border: '1.5px solid #00A86B', background: '#F0FDF4', padding: '4px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#081E3C' }}>Date: {currentInvoice.date}</span>
                        <ConfidenceBadge value={currentInvoice.dateConfidence} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div style={{ marginBottom: 28, background: '#F8FAFC', padding: '12px 16px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Bill To / فاتورة إلى</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#081E3C' }}>{currentInvoice.billTo}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{currentInvoice.billToAddress} • Ref PO: <strong>{currentInvoice.poNumber}</strong></div>
                </div>

                {/* Line Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', fontSize: 12.5 }}>
                  <thead style={{ background: '#081E3C', color: 'white' }}>
                    <tr>
                      <th style={{ padding: '8px 10px', textAlign: 'left', width: 35 }}>#</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Description</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', width: 55 }}>Unit</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', width: 70 }}>Qty</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', width: 115 }}>Unit Rate (AED)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', width: 110 }}>Amount (AED)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, index) => {
                      const isHovered = hoveredItemId === item.id;
                      const isSelected = selectedItemId === item.id;
                      const isDiscrepant = item.hasDiscrepancy && !varianceResolved;

                      // Display values for item 5
                      const displayQty = item.id === 5 ? item5Qty : item.qty;
                      const displayAmount = item.id === 5 ? item5Amount : item.amount;

                      return (
                        <tr 
                          key={item.id}
                          onMouseEnter={() => setHoveredItemId(item.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => setSelectedItemId(item.id)}
                          style={{
                            background: isDiscrepant 
                              ? '#FEF2F2' 
                              : isHovered || isSelected 
                              ? '#F0F8FA' 
                              : index % 2 === 0 ? 'white' : '#FAFAFA',
                            borderBottom: '1px solid #E2E8F0',
                            borderLeft: isDiscrepant 
                              ? '4px solid #DC2626' 
                              : isHovered || isSelected 
                              ? '4px solid #00A9C5' 
                              : '4px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <td style={{ padding: '10px 10px', color: '#64748B', fontWeight: 600 }}>{index + 1}</td>
                          <td style={{ padding: '10px 10px', fontWeight: 700, color: '#081E3C' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {item.desc}
                              {isDiscrepant && (
                                <span style={{ fontSize: 10, background: '#FEE2E2', color: '#B91C1C', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                                  VARIANCE
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center', color: '#475569' }}>{item.unit}</td>
                          
                          {/* Qty Column */}
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: isDiscrepant ? '#DC2626' : '#081E3C' }}>
                            {displayQty.toFixed(2)}
                          </td>
                          
                          {/* Unit Rate Column with Interactive Popover */}
                          <td style={{ padding: '10px 10px', textAlign: 'right', position: 'relative' }}>
                            {item.needsRateReview ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <motion.div 
                                  onClick={(e) => { e.stopPropagation(); setShowRatePopover(true); }}
                                  style={{
                                    border: rateResolved ? '1.5px solid #00A86B' : '1.5px solid #D97706',
                                    background: rateResolved ? '#ECFDF5' : '#FEF3C7',
                                    padding: '3px 6px',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontWeight: 700,
                                    color: rateResolved ? '#065F46' : '#92400E'
                                  }}
                                  animate={!rateResolved ? { scale: [1, 1.03, 1] } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {rateResolved ? customRate : Number(customRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  {!rateResolved ? (
                                    <ConfidenceBadge value={96} label="review" />
                                  ) : (
                                    <Check size={12} color="#059669" strokeWidth={3} />
                                  )}
                                </motion.div>

                                {/* Rate Confirmation Popover */}
                                <AnimatePresence>
                                  {showRatePopover && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        position: 'absolute', top: 38, right: 0, zIndex: 60,
                                        background: 'white', padding: 16, borderRadius: 10,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                        width: 250, border: '1px solid #004753', textAlign: 'left'
                                      }}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 800, color: '#081E3C' }}>Confirm Extracted Rate</span>
                                        <button onClick={() => setShowRatePopover(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
                                      </div>
                                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
                                        OCR extracted <strong>3,250.00 AED</strong> with 96% confidence. PO agreed rate is <strong>3,250.00 AED</strong>.
                                      </div>
                                      <div style={{ marginBottom: 12 }}>
                                        <label style={{ fontSize: 11, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Unit Rate (AED):</label>
                                        <input 
                                          type="text" 
                                          value={customRate} 
                                          onChange={(e) => setCustomRate(e.target.value)}
                                          style={{ width: '100%', padding: '6px 8px', fontSize: 12, fontWeight: 700, border: '1px solid #CBD5E1', borderRadius: 4 }}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <button 
                                          onClick={() => { setRateResolved(true); setShowRatePopover(false); }}
                                          style={{ flex: 1, background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 4, padding: '6px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                                        >
                                          Confirm Rate
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <span style={{ fontWeight: 600, color: '#334155' }}>
                                {item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </td>

                          {/* Amount Column */}
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#081E3C' }}>
                            {displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Totals Summary */}
                    <tr style={{ background: '#F8FAFC', fontWeight: 700, borderTop: '2px solid #CBD5E1' }}>
                      <td colSpan={5} style={{ padding: '8px 10px', textAlign: 'right', color: '#475569' }}>Subtotal</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#081E3C' }}>
                        {calculatedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                      <td colSpan={5} style={{ padding: '8px 10px', textAlign: 'right', color: '#475569' }}>VAT 5%</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#081E3C' }}>
                        {calculatedVat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr style={{ background: '#E6F4F7', fontWeight: 900, fontSize: 14 }}>
                      <td colSpan={5} style={{ padding: '10px 10px', textAlign: 'right', color: '#004753' }}>Total (AED)</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#004753' }}>
                        {calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL B: THREE-WAY MATCH & AUDIT (44%) */}
        {/* ======================================================== */}
        <div style={{ flex: '0 0 44%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Three-Way Match Verification
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
              Ref: <strong style={{ color: '#004753' }}>{currentInvoice.poNumber}</strong> ↔ <strong style={{ color: '#00A9C5' }}>{currentInvoice.grnNumber}</strong>
            </span>
          </div>

          <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', padding: 20, gap: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* Matching Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 6px', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>PO ({currentInvoice.poNumber})</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>GRN ({currentInvoice.grnNumber})</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>Invoice ({currentInvoice.id})</th>
                    <th style={{ padding: '8px 6px', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoice.items.map((item) => {
                    const isHovered = hoveredItemId === item.id;
                    const isSelected = selectedItemId === item.id;
                    const isDiscrepant = item.hasDiscrepancy && !varianceResolved;

                    const displayInvQty = item.id === 5 ? item5Qty : item.qty;
                    const displayInvAmount = item.id === 5 ? item5Amount : item.amount;

                    return (
                      <tr 
                        key={item.id}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          if (isDiscrepant) setShowVarianceModal(true);
                        }}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          background: isDiscrepant 
                            ? '#FEF2F2' 
                            : isHovered || isSelected 
                            ? '#F0F8FA' 
                            : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* Item Name */}
                        <td style={{ padding: '10px 6px', fontWeight: 700, color: '#081E3C', maxWidth: 140 }}>
                          <div>{item.desc}</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 500 }}>{item.unit}</div>
                        </td>

                        {/* PO Column */}
                        <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 700, color: '#081E3C' }}>{item.poQty} {item.unit}</div>
                          <div style={{ fontSize: 10.5, color: '#64748B' }}>{(item.poQty * item.rate).toLocaleString()} AED</div>
                        </td>

                        {/* GRN Column */}
                        <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 700, color: '#081E3C' }}>{item.grnQty} {item.unit}</div>
                          <div style={{ fontSize: 10.5, color: '#64748B' }}>{(item.grnQty * item.rate).toLocaleString()} AED</div>
                        </td>

                        {/* Invoice Column */}
                        <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 700, color: isDiscrepant ? '#DC2626' : '#081E3C' }}>
                            {displayInvQty} {item.unit}
                          </div>
                          <div style={{ fontSize: 10.5, color: isDiscrepant ? '#DC2626' : '#64748B' }}>
                            {displayInvAmount.toLocaleString()} AED
                          </div>
                        </td>

                        {/* Status Column */}
                        <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                          {item.hasDiscrepancy ? (
                            varianceResolved ? (
                              <StatusPill status="success" label="Resolved" />
                            ) : (
                              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                                <StatusPill status="danger" label="Qty Variance" />
                                <span style={{ fontSize: 9.5, color: '#DC2626', fontWeight: 800 }}>Click to Fix</span>
                              </div>
                            )
                          ) : item.needsRateReview && !rateResolved ? (
                            <StatusPill status="warning" label="Rate Check" />
                          ) : (
                            <StatusPill status="success" label="Matched" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Discrepancy Alert Banner */}
            {currentInvoice.hasVariance && !varianceResolved && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: '#FEF2F2', 
                  border: '1px solid #FCA5A5', 
                  borderRadius: 10, 
                  padding: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 12 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#DC2626', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangle size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#991B1B' }}>
                      1 Discrepancy Flagged on Line #5 (Cement Type I)
                    </div>
                    <div style={{ fontSize: 11, color: '#7F1D1D' }}>
                      Billed 260 bags vs GRN-8812 received 240 bags (+20 bags / +2,300 AED).
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowVarianceModal(true)}
                  style={{ background: '#DC2626', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Resolve Now
                </button>
              </motion.div>
            )}

            {/* Resolved Success Banner */}
            {varianceResolved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: '#ECFDF5', 
                  border: '1px solid #6EE7B7', 
                  borderRadius: 10, 
                  padding: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 12 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#059669', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#065F46' }}>
                      Discrepancy Successfully Resolved
                    </div>
                    <div style={{ fontSize: 11, color: '#047857' }}>
                      {resolutionType === 'accept_grn' && 'Accepted GRN received quantity (240 bags). Invoice total adjusted to 224,752.50 AED.'}
                      {resolutionType === 'routed_approval' && 'Routed for secondary site manager sign-off (Approval Ticket #APP-88419).'}
                      {resolutionType === 'credit_note' && 'Automated Credit Note request sent to Al Noor Building Materials LLC.'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowVarianceModal(true)}
                  style={{ background: '#065F46', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  Change
                </button>
              </motion.div>
            )}

            {/* Validation Metrics */}
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1, padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Auto-Validated Match</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#004753' }}>
                    {varianceResolved || !currentInvoice.hasVariance ? '100%' : '94.2%'}
                  </div>
                </div>
                <ShieldCheck size={28} color="#00A9C5" />
              </div>

              <div style={{ flex: 1, padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Exceptions Remaining</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: varianceResolved || !currentInvoice.hasVariance ? '#00A86B' : '#DC2626' }}>
                    {varianceResolved || !currentInvoice.hasVariance ? '0' : '1'}
                  </div>
                </div>
                <AlertTriangle size={26} color={varianceResolved || !currentInvoice.hasVariance ? '#00A86B' : '#DC2626'} />
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 10 }}>
              <button 
                onClick={handlePostERP}
                disabled={(currentInvoice.hasVariance && !varianceResolved) || postingStatus !== 'idle'}
                style={{ 
                  flex: 1.2, 
                  background: (currentInvoice.hasVariance && !varianceResolved) ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)' : 'var(--gradient-brand)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '12px 18px', 
                  fontSize: 13.5, 
                  fontWeight: 800, 
                  cursor: (currentInvoice.hasVariance && !varianceResolved) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: (currentInvoice.hasVariance && !varianceResolved) ? 'none' : '0 4px 14px rgba(0, 71, 83, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                {postingStatus === 'idle' && (
                  <>
                    <Send size={16} /> Post Approved Invoice to ERP
                  </>
                )}
                {postingStatus === 'validating' && (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RefreshCw size={16} />
                    </motion.div>
                    Validating Business Rules...
                  </>
                )}
                {postingStatus === 'posting' && (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RefreshCw size={16} />
                    </motion.div>
                    Posting to Oracle NetSuite / SAP...
                  </>
                )}
                {postingStatus === 'success' && (
                  <>
                    <CheckCircle2 size={18} color="#A7F3D0" /> Posted: {erpVoucherNumber}
                  </>
                )}
              </button>

              <button 
                onClick={() => setShowVarianceModal(true)}
                style={{ 
                  flex: 0.8, 
                  background: 'rgba(0, 71, 83, 0.08)', 
                  color: '#004753', 
                  border: '1.5px solid rgba(0, 71, 83, 0.3)', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  fontSize: 13, 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.2s'
                }}
              >
                <Layers size={15} />
                {varianceResolved ? 'Review Rules' : 'Route for Approval'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RESOLUTION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showVarianceModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.6)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{ width: '100%', maxWidth: 540, background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 900, color: '#081E3C' }}>
                    Resolve Quantity Variance
                  </h3>
                  <div style={{ fontSize: 12.5, color: '#64748B' }}>
                    Item #5: <strong>Portland Cement Type I (50kg)</strong>
                  </div>
                </div>
                <button onClick={() => setShowVarianceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
              </div>

              {/* Comparison Summary Card */}
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', marginBottom: 20, textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Purchase Order</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#081E3C' }}>240 Bags</div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>27,600 AED</div>
                </div>
                <div style={{ width: 1, background: '#CBD5E1' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>GRN-8812 Received</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#00A86B' }}>240 Bags</div>
                  <div style={{ fontSize: 10.5, color: '#00A86B' }}>Site Gate Pass</div>
                </div>
                <div style={{ width: 1, background: '#CBD5E1' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Vendor Invoice</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#DC2626' }}>260 Bags</div>
                  <div style={{ fontSize: 10.5, color: '#DC2626' }}>+20 bags variance</div>
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                
                {/* Option 1 */}
                <div 
                  onClick={() => {
                    setVarianceResolved(true);
                    setResolutionType('accept_grn');
                    setShowVarianceModal(false);
                  }}
                  style={{ 
                    padding: 14, 
                    border: '1.5px solid #004753', 
                    background: '#F0F8FA', 
                    borderRadius: 10, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12
                  }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#004753', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
                    1
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#004753' }}>
                      Accept GRN Quantity (240 Bags) — Recommended
                    </div>
                    <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2, lineHeight: 1.4 }}>
                      Short-pay the invoice based on verified physical site delivery. Adjusts invoice total to 224,752.50 AED.
                    </div>
                  </div>
                </div>

                {/* Option 2 */}
                <div 
                  onClick={() => {
                    setVarianceResolved(true);
                    setResolutionType('routed_approval');
                    setShowVarianceModal(false);
                  }}
                  style={{ 
                    padding: 14, 
                    border: '1px solid #CBD5E1', 
                    borderRadius: 10, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: 'white'
                  }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#64748B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#081E3C' }}>
                      Route to Site Manager for Additional Qty Sign-off
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>
                      Submits an exception ticket to Eng. Tariq (Project Director) to confirm if +20 bags were delivered under supplementary delivery.
                    </div>
                  </div>
                </div>

                {/* Option 3 */}
                <div 
                  onClick={() => {
                    setVarianceResolved(true);
                    setResolutionType('credit_note');
                    setShowVarianceModal(false);
                  }}
                  style={{ 
                    padding: 14, 
                    border: '1px solid #CBD5E1', 
                    borderRadius: 10, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: 'white'
                  }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#64748B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
                    3
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#081E3C' }}>
                      Request Vendor Credit Note (2,300 AED)
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>
                      Automatically generate and dispatch a dispute notice to Al Noor Building Materials LLC.
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="secondary" onClick={() => setShowVarianceModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
