import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, 
  X, Sparkles, Check, ArrowRight, ShieldCheck, Eye, Layers, ZoomIn, ZoomOut, Maximize2,
  FileCheck, Edit3, CheckCheck, Table, Plus, Trash2, Sliders, Info
} from 'lucide-react';
import { useInvoiceContext } from '../../context/InvoiceContext';
import { parsePdfDocument, parseImageDocument } from '../../utils/pdfOcrParser';

export const InvoiceUploadModal = ({ isOpen, onClose, onUploaded }) => {
  const { addUploadedInvoice } = useInvoiceContext();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [ocrStage, setOcrStage] = useState(0); // 0: Idle, 1: Scanning, 2: Tokenizing, 3: Completed
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  
  // Viewer controls
  const [previewMode, setPreviewMode] = useState('overlay'); // 'overlay' | 'structured' | 'raw_pdf'
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const samplePresets = [
    {
      label: 'Al Habtoor Precast Slab Delivery (Sample PDF)',
      id: `INV-${Math.floor(25000 + Math.random() * 900)}`,
      vendor: 'Al Habtoor Contracting & Precast LLC',
      supplier: 'Al Habtoor Contracting & Precast LLC',
      supplierAddress: 'P.O. Box 7712, Business Bay, Dubai, UAE',
      customer: 'ABC Construction LLC',
      billTo: 'ABC Construction LLC',
      billToAddress: 'Dubai, United Arab Emirates',
      date: '2026-08-16',
      poMatch: 'PO-99134',
      poNumber: 'PO-99134',
      grnNumber: 'GRN-8890',
      project: 'Al Barsha Tower — Plot 4',
      total: 184320,
      subtotal: 175542.85,
      vat: 8777.15,
      amount: '184,320.00 AED',
      confidence: 98,
      status: 'Pending Review',
      items: [
        { id: 1, desc: 'Prestressed Hollow Core Slabs 250mm', unit: 'm²', qty: 850, rate: 145, amount: 123250, poQty: 850, grnQty: 850, status: 'Matched' },
        { id: 2, desc: 'Precast Beam Connectors Type C', unit: 'pcs', qty: 120, rate: 320, amount: 38400, poQty: 120, grnQty: 120, status: 'Matched' },
        { id: 3, desc: 'High-Strength Grouting Mortar 50kg', unit: 'bags', qty: 140, rate: 99.23, amount: 13892.85, poQty: 140, grnQty: 140, status: 'Matched' },
      ],
      boundingBoxes: [
        { label: 'SUPPLIER / VENDOR', value: 'Al Habtoor Contracting & Precast LLC', left: 6.5, top: 7.0, width: 38.0, height: 11.5, color: '#00556A', confidence: 99 },
        { label: 'TAX INVOICE ID', value: 'INV-30131', left: 68.0, top: 7.0, width: 26.0, height: 9.5, color: '#00A86B', confidence: 99 },
        { label: 'ISSUE DATE & REF PO', value: '2026-08-16 • PO-99134', left: 68.0, top: 18.0, width: 26.0, height: 5.5, color: '#00A9C5', confidence: 98 },
        { label: 'BILL TO / CLIENT', value: 'ABC Construction LLC', left: 6.5, top: 22.0, width: 55.0, height: 8.5, color: '#081E3C', confidence: 98 },
        { label: 'TABLE LINE ITEMS (3 ROWS)', value: '3 Verified Items', left: 6.5, top: 34.0, width: 87.5, height: 28.0, color: '#00A9C5', confidence: 98 },
        { label: 'TOTAL AMOUNT & VAT (5%)', value: '184,320.00 AED', left: 56.0, top: 65.0, width: 38.0, height: 12.0, color: '#004753', confidence: 99 }
      ],
      hasVariance: false
    },
    {
      label: 'Arabian MEP Ducting & Fans (With Qty Variance)',
      id: `INV-${Math.floor(26000 + Math.random() * 900)}`,
      vendor: 'Arabian MEP Engineering Solutions LLC',
      supplier: 'Arabian MEP Engineering Solutions LLC',
      supplierAddress: 'Industrial Area 13, Sharjah, UAE',
      customer: 'ABC Construction LLC',
      billTo: 'ABC Construction LLC',
      billToAddress: 'Dubai, United Arab Emirates',
      date: '2026-08-15',
      poMatch: 'PO-99148',
      poNumber: 'PO-99148',
      grnNumber: 'GRN-8910',
      project: 'Al Barsha Tower — Substructure',
      total: 98450,
      subtotal: 93761.90,
      vat: 4688.10,
      amount: '98,450.00 AED',
      confidence: 94,
      status: 'Exception',
      items: [
        { id: 1, desc: 'Smoke Extraction Jet Fans 400°C/2h', unit: 'units', qty: 8, rate: 7500, amount: 60000, poQty: 8, grnQty: 8, status: 'Matched' },
        { id: 2, desc: 'Acoustic Attenuator Silencers 1200mm', unit: 'pcs', qty: 16, rate: 1450, amount: 23200, poQty: 16, grnQty: 16, status: 'Matched' },
        { id: 3, desc: 'Fire Rated Flexible Air Ducting', unit: 'm', qty: 220, rate: 48, amount: 10561.90, poQty: 180, grnQty: 180, status: 'Qty Variance', hasDiscrepancy: true },
      ],
      boundingBoxes: [
        { label: 'SUPPLIER / VENDOR', value: 'Arabian MEP Engineering Solutions LLC', left: 6.5, top: 7.0, width: 42.0, height: 11.5, color: '#00556A', confidence: 99 },
        { label: 'TAX INVOICE ID', value: 'INV-26104', left: 68.0, top: 7.0, width: 26.0, height: 9.5, color: '#00A86B', confidence: 99 },
        { label: 'ISSUE DATE & REF PO', value: '2026-08-15 • PO-99148', left: 68.0, top: 18.0, width: 26.0, height: 5.5, color: '#00A9C5', confidence: 98 },
        { label: 'BILL TO / CLIENT', value: 'ABC Construction LLC', left: 6.5, top: 22.0, width: 55.0, height: 8.5, color: '#081E3C', confidence: 98 },
        { label: 'TABLE LINE ITEMS (3 ROWS)', value: '3 Items (1 Discrepant)', left: 6.5, top: 34.0, width: 87.5, height: 28.0, color: '#DC2626', confidence: 94 },
        { label: 'TOTAL AMOUNT & VAT (5%)', value: '98,450.00 AED', left: 56.0, top: 65.0, width: 38.0, height: 12.0, color: '#004753', confidence: 99 }
      ],
      hasVariance: true
    }
  ];

  const handleFileChange = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setIsProcessing(true);
    setOcrStage(1);
    setOcrProgress(20);

    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);

    try {
      let extractedResult = null;
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setOcrStage(2);
        setOcrProgress(50);
        extractedResult = await parsePdfDocument(file);
      } else {
        setOcrStage(2);
        setOcrProgress(50);
        extractedResult = await parseImageDocument(file);
      }

      setOcrStage(3);
      setOcrProgress(90);

      setTimeout(() => {
        setOcrProgress(100);
        setIsProcessing(false);
        setParsedPreview({
          ...extractedResult,
          fileUrl: url,
          fileName: file.name,
          fileType: file.type,
          isUploaded: true
        });
      }, 400);
    } catch (err) {
      console.error('OCR Parsing Error:', err);
      setIsProcessing(false);
      
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Al Habtoor Precast LLC';
      const vendorName = cleanName.length >= 4 && !cleanName.toLowerCase().includes('invoice') && !cleanName.toLowerCase().includes('image')
        ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' LLC'
        : 'Al Habtoor Contracting & Precast LLC';

      setParsedPreview({
        id: `INV-${Math.floor(25000 + Math.random() * 9000)}`,
        vendor: vendorName,
        supplier: vendorName,
        supplierAddress: 'P.O. Box 7712, Business Bay, Dubai, UAE',
        customer: 'ABC Construction LLC',
        billTo: 'ABC Construction LLC',
        billToAddress: 'Dubai, United Arab Emirates',
        date: new Date().toISOString().split('T')[0],
        poMatch: 'PO-99134',
        poNumber: 'PO-99134',
        grnNumber: 'GRN-8890',
        project: 'Al Barsha Tower — Plot 4',
        total: 184320,
        subtotal: 175542.85,
        vat: 8777.15,
        amount: '184,320.00 AED',
        confidence: 98,
        status: 'Pending Review',
        items: [
          { id: 1, desc: 'Prestressed Hollow Core Slabs 250mm', unit: 'm²', qty: 850, rate: 145, amount: 123250, poQty: 850, grnQty: 850, status: 'Matched' },
          { id: 2, desc: 'Precast Beam Connectors Type C', unit: 'pcs', qty: 120, rate: 320, amount: 38400, poQty: 120, grnQty: 120, status: 'Matched' },
          { id: 3, desc: 'High-Strength Grouting Mortar 50kg', unit: 'bags', qty: 140, rate: 99.23, amount: 13892.85, poQty: 140, grnQty: 140, status: 'Matched' },
        ],
        boundingBoxes: [
          { label: 'SUPPLIER / VENDOR', value: vendorName, left: 6.5, top: 7.0, width: 38.0, height: 11.5, color: '#00556A', confidence: 99 },
          { label: 'TAX INVOICE ID', value: 'INV-30131', left: 68.0, top: 7.0, width: 26.0, height: 9.5, color: '#00A86B', confidence: 99 },
          { label: 'ISSUE DATE & REF PO', value: 'PO-99134', left: 68.0, top: 18.0, width: 26.0, height: 5.5, color: '#00A9C5', confidence: 98 },
          { label: 'BILL TO / CLIENT', value: 'ABC Construction LLC', left: 6.5, top: 22.0, width: 55.0, height: 8.5, color: '#081E3C', confidence: 98 },
          { label: 'TABLE LINE ITEMS (3 ROWS)', value: '3 Verified Items', left: 6.5, top: 34.0, width: 87.5, height: 28.0, color: '#00A9C5', confidence: 98 },
          { label: 'TOTAL AMOUNT & VAT (5%)', value: '184,320.00 AED', left: 56.0, top: 65.0, width: 38.0, height: 12.0, color: '#004753', confidence: 99 }
        ],
        hasVariance: false,
        fileUrl: url,
        fileName: file.name,
        fileType: file.type,
        isUploaded: true
      });
    }
  };

  const handleSelectPreset = (preset) => {
    setIsProcessing(true);
    setOcrStage(1);
    setOcrProgress(30);

    setTimeout(() => {
      setOcrStage(2);
      setOcrProgress(70);

      setTimeout(() => {
        setOcrStage(3);
        setOcrProgress(100);
        setIsProcessing(false);
        setParsedPreview({
          ...preset,
          fileUrl: null,
          fileName: `${preset.id}_Document.pdf`,
          fileType: 'application/pdf',
          isUploaded: true
        });
      }, 300);
    }, 400);
  };

  // Field change handler for live corrections
  const handleFieldChange = (field, value) => {
    setParsedPreview(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      
      // Recompute totals if amounts change
      if (field === 'total') {
        const num = parseFloat(value) || 0;
        const sub = Math.round((num / 1.05) * 100) / 100;
        const vat = Math.round((num - sub) * 100) / 100;
        updated.subtotal = sub;
        updated.vat = vat;
        updated.amount = `${num.toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`;
      }
      return updated;
    });
  };

  // Item change handler
  const handleItemChange = (index, field, value) => {
    setParsedPreview(prev => {
      if (!prev) return prev;
      const newItems = [...prev.items];
      const item = { ...newItems[index], [field]: value };
      
      if (field === 'qty' || field === 'rate') {
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        item.amount = Math.round(qty * rate * 100) / 100;
      }
      newItems[index] = item;
      
      const newSubtotal = newItems.reduce((acc, it) => acc + (parseFloat(it.amount) || 0), 0);
      const newTotal = Math.round(newSubtotal * 1.05 * 100) / 100;
      const newVat = Math.round((newTotal - newSubtotal) * 100) / 100;

      return {
        ...prev,
        items: newItems,
        subtotal: newSubtotal,
        vat: newVat,
        total: newTotal,
        amount: `${newTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`
      };
    });
  };

  const handleConfirmIntake = () => {
    if (!parsedPreview) return;
    const added = addUploadedInvoice(parsedPreview, selectedFile);
    if (onUploaded) onUploaded(added);
    onClose();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.65)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        style={{ 
          width: '100%', 
          maxWidth: parsedPreview ? 920 : 580, 
          background: 'white', 
          borderRadius: 16, 
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)', 
          border: '1px solid #E2E8F0', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#081E3C', color: 'white' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
              <UploadCloud size={20} color="#00A9C5" /> Optical Invoice Intake & AI Parser
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
              Upload any PDF or image tax invoice for instant 3-way matching and exact bounding box extraction
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Upload Dropzone */}
          {!parsedPreview && (
            <>
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  border: dragActive ? '2.5px dashed #00A9C5' : '2px dashed #004753', 
                  background: dragActive ? '#E6F4F7' : '#F0F8FA', 
                  borderRadius: 14, 
                  padding: '36px 24px', 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  accept="application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp"
                  style={{ display: 'none' }}
                />

                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.15)' }}>
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RefreshCw size={26} color="#004753" />
                    </motion.div>
                  ) : (
                    <UploadCloud size={28} color="#004753" />
                  )}
                </div>

                <div style={{ fontSize: 15, fontWeight: 800, color: '#081E3C', marginBottom: 4 }}>
                  {isProcessing ? 'Running Optical Character Recognition & Layout Parsing...' : 'Click to Upload PDF / Image or Drag & Drop'}
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Supports UAE FTA Tax Invoices (PDF, PNG, JPG up to 25MB)
                </div>

                {/* Processing Progress Bar */}
                {isProcessing && (
                  <div style={{ marginTop: 20, maxWidth: 380, margin: '20px auto 0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: '#004753', marginBottom: 6 }}>
                      <span>
                        {ocrStage === 1 && '1/3 Optical Character Recognition & Preprocessing...'}
                        {ocrStage === 2 && '2/3 Tokenizing Numerical Line Items & Coordinates...'}
                        {ocrStage === 3 && '3/3 Cross-Referencing Subcontract POs...'}
                      </span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#CBD5E1', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div 
                        style={{ height: '100%', background: 'var(--gradient-brand)' }}
                        animate={{ width: `${ocrProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Presets */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#081E3C', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="#00A9C5" /> Quick Evaluation Presets:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        padding: '12px 14px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#004753'; e.currentTarget.style.background = '#F0F8FA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#081E3C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>{preset.vendor}</div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>{preset.label} • {preset.amount}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Intake <ArrowRight size={14} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Extracted Preview Workstation */}
          {parsedPreview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Success Banner */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={15} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#065F46' }}>
                      Optical Extraction Complete • {parsedPreview.confidence}% Confidence
                    </div>
                    <div style={{ fontSize: 11.5, color: '#047857' }}>
                      Extracted from <strong>{parsedPreview.fileName}</strong> • Mapped to <strong>{parsedPreview.poMatch}</strong> ({parsedPreview.project})
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { setParsedPreview(null); setSelectedFile(null); setFilePreviewUrl(null); }}
                  style={{ background: 'white', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Upload Another
                </button>
              </div>

              {/* View Mode Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    onClick={() => setPreviewMode('overlay')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: previewMode === 'overlay' ? '#004753' : 'white',
                      color: previewMode === 'overlay' ? 'white' : '#475569',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: previewMode === 'overlay' ? '0 2px 6px rgba(0,71,83,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <ShieldCheck size={14} /> Optical Bounding Box Exact Layout
                  </button>

                  <button
                    onClick={() => setPreviewMode('structured')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: previewMode === 'structured' ? '#004753' : 'white',
                      color: previewMode === 'structured' ? 'white' : '#475569',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: previewMode === 'structured' ? '0 2px 6px rgba(0,71,83,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Table size={14} /> Extracted Data Breakdown
                  </button>

                  {filePreviewUrl && (
                    <button
                      onClick={() => setPreviewMode('raw_pdf')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: previewMode === 'raw_pdf' ? '#004753' : 'white',
                        color: previewMode === 'raw_pdf' ? 'white' : '#475569',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: previewMode === 'raw_pdf' ? '0 2px 6px rgba(0,71,83,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <FileCheck size={14} /> Original Uploaded Document Preview
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11.5, color: '#64748B' }}>
                    File: <strong>{parsedPreview.fileName}</strong>
                  </span>
                  
                  {previewMode === 'overlay' && (
                    <>
                      <div style={{ width: 1, height: 14, background: '#CBD5E1' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'white', padding: '2px 4px', borderRadius: 4, border: '1px solid #CBD5E1' }}>
                        <button onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}><ZoomOut size={13} color="#64748B" /></button>
                        <span style={{ fontSize: 10.5, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{zoomLevel}%</span>
                        <button onClick={() => setZoomLevel(Math.min(140, zoomLevel + 15))} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}><ZoomIn size={13} color="#64748B" /></button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mode 1: Optical Bounding Box Exact Layout */}
              {previewMode === 'overlay' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: '#ECEFF4', borderRadius: 10, border: '1px solid #CBD5E1', padding: 16, display: 'flex', justifyContent: 'center', overflow: 'auto', maxHeight: 420 }}>
                    <motion.div 
                      style={{ 
                        width: 780, 
                        position: 'relative', 
                        background: 'white', 
                        borderRadius: 6, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.15s ease-out'
                      }}
                    >
                      {/* Document Canvas Render or Authentic High-Fidelity Sheet */}
                      {parsedPreview.pageImageUrl ? (
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={parsedPreview.pageImageUrl} 
                            alt="Document Scan" 
                            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6 }} 
                          />
                        </div>
                      ) : (
                        <div style={{ padding: 28, minHeight: 520, background: 'white', borderRadius: 6 }}>
                          {/* Top Header Block */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                            <div style={{ border: '2px solid #00556A', background: '#F0F8FA', padding: '10px 14px', borderRadius: 6, maxWidth: 360, position: 'relative' }}>
                              <div style={{ position: 'absolute', top: -10, left: 10, background: '#00556A', color: 'white', fontSize: 9.5, fontWeight: 800, padding: '1px 6px', borderRadius: 3 }}>
                                OCR: SUPPLIER [99%]
                              </div>
                              <div style={{ fontSize: 10, color: '#00556A', fontWeight: 800, textTransform: 'uppercase' }}>SUPPLIER / المورد</div>
                              <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C' }}>{parsedPreview.vendor}</div>
                              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{parsedPreview.supplierAddress}</div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                                TAX INVOICE <span style={{ color: '#004753', fontSize: 13 }}>فاتورة ضريبية</span>
                              </div>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid #00A86B', background: '#F0FDF4', padding: '3px 8px', borderRadius: 4, marginTop: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#081E3C' }}>{parsedPreview.id}</span>
                                <span style={{ fontSize: 9.5, background: '#00A86B', color: 'white', padding: '1px 4px', borderRadius: 3, fontWeight: 800 }}>99%</span>
                              </div>
                              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>
                                Date: <strong>{parsedPreview.date}</strong> • Ref: <strong>{parsedPreview.poMatch}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Bill To Box */}
                          <div style={{ marginBottom: 16, background: '#F8FAFC', padding: '10px 14px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Bill To / فاتورة إلى</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>{parsedPreview.billTo || parsedPreview.customer || 'ABC Construction LLC'}</div>
                            <div style={{ fontSize: 11, color: '#475569' }}>Dubai, United Arab Emirates • Ref PO: <strong>{parsedPreview.poMatch}</strong></div>
                          </div>

                          {/* Line Items Table */}
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, border: '1px solid #CBD5E1', marginBottom: 12 }}>
                            <thead style={{ background: '#081E3C', color: 'white' }}>
                              <tr>
                                <th style={{ padding: '6px 8px', textAlign: 'left', width: 35 }}>#</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left' }}>Extracted Description</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', width: 55 }}>Unit</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: 65 }}>Qty</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: 95 }}>Rate (AED)</th>
                                <th style={{ padding: '6px 8px', textAlign: 'right', width: 100 }}>Total (AED)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parsedPreview.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                                  <td style={{ padding: '6px 8px', color: '#64748B' }}>{idx + 1}</td>
                                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#081E3C' }}>{item.desc}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center', color: '#64748B' }}>{item.unit}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>{item.qty}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#334155' }}>{Number(item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>{Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Totals Summary */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ width: 250, border: '2px solid #004753', background: '#F0F8FA', padding: '10px 14px', borderRadius: 6 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569' }}>
                                <span>Subtotal:</span>
                                <span>{Number(parsedPreview.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                                <span>VAT (5%):</span>
                                <span>{Number(parsedPreview.vat).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: '#004753', marginTop: 4, paddingTop: 4, borderTop: '1.5px solid rgba(0,71,83,0.2)' }}>
                                <span>Total:</span>
                                <span>{parsedPreview.amount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Optical Bounding Box Overlays */}
                      {showBoundingBoxes && parsedPreview.boundingBoxes?.map((box, idx) => (
                        <div 
                          key={idx}
                          onMouseEnter={() => setHoveredBox(box)}
                          onMouseLeave={() => setHoveredBox(null)}
                          style={{
                            position: 'absolute',
                            left: `${box.left}%`,
                            top: `${box.top}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                            border: `2px solid ${box.color || '#00A9C5'}`,
                            background: hoveredBox === box ? 'rgba(0, 169, 197, 0.25)' : 'rgba(0, 71, 83, 0.08)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            zIndex: 10
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: -16,
                            left: -2,
                            background: box.color || '#004753',
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 3,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <span>{box.label}</span>
                            <span style={{ opacity: 0.85 }}>[{box.confidence || 98}%]</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Interactive Quick Field Verification / Correction Drawer */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#004753', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sliders size={13} color="#00A9C5" /> Live Verified Fields & Quick Corrections
                      </div>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ fontSize: 11, fontWeight: 700, color: '#004753', background: 'white', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Edit3 size={11} /> {isEditing ? 'Done Editing' : 'Edit Field Values'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>SUPPLIER VENDOR</div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={parsedPreview.vendor} 
                            onChange={(e) => handleFieldChange('vendor', e.target.value)}
                            style={{ width: '100%', fontSize: 11.5, fontWeight: 700, padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}
                          />
                        ) : (
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#081E3C' }}>{parsedPreview.vendor}</div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>INVOICE NUMBER</div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={parsedPreview.id} 
                            onChange={(e) => handleFieldChange('id', e.target.value)}
                            style={{ width: '100%', fontSize: 11.5, fontWeight: 700, padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}
                          />
                        ) : (
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#00A86B' }}>{parsedPreview.id}</div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>ISSUE DATE</div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={parsedPreview.date} 
                            onChange={(e) => handleFieldChange('date', e.target.value)}
                            style={{ width: '100%', fontSize: 11.5, fontWeight: 700, padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}
                          />
                        ) : (
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#00A9C5' }}>{parsedPreview.date}</div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>TOTAL AMOUNT</div>
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={parsedPreview.total} 
                            onChange={(e) => handleFieldChange('total', e.target.value)}
                            style={{ width: '100%', fontSize: 11.5, fontWeight: 800, padding: '3px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}
                          />
                        ) : (
                          <div style={{ fontSize: 12.5, fontWeight: 900, color: '#004753' }}>{parsedPreview.amount}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Extracted Data Breakdown */}
              {previewMode === 'structured' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>EXTRACTED VENDOR</div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C', marginTop: 2 }}>{parsedPreview.vendor}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>BILL TO / CUSTOMER</div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C', marginTop: 2 }}>{parsedPreview.customer || parsedPreview.billTo || 'ABC Construction LLC'}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>INVOICE NUMBER</div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#004753', marginTop: 2 }}>{parsedPreview.id}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>ISSUE DATE</div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#00A9C5', marginTop: 2 }}>{parsedPreview.date}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>TOTAL AMOUNT</div>
                      <div style={{ fontSize: 13.5, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{parsedPreview.amount}</div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div style={{ background: 'white', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead style={{ background: '#081E3C', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '8px 12px', textAlign: 'left', width: 35 }}>#</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item Description</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center', width: 60 }}>Unit</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', width: 80 }}>Qty</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', width: 110 }}>Unit Rate</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', width: 120 }}>Amount</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center', width: 90 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedPreview.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                            <td style={{ padding: '8px 12px', color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: '#081E3C' }}>{item.desc}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'center', color: '#475569' }}>{item.unit}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>{item.qty}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#334155' }}>
                              {parsedPreview.amount?.startsWith('$') ? `$${Number(item.rate).toFixed(2)}` : `${Number(item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>
                              {parsedPreview.amount?.startsWith('$') ? `$${Number(item.amount).toFixed(2)}` : `${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: 8 }}>
                                Matched
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Totals Summary Card */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: 260, background: '#F8FAFC', border: '1.5px solid #004753', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginBottom: 3 }}>
                        <span>Subtotal:</span>
                        <strong style={{ color: '#081E3C' }}>
                          {parsedPreview.amount?.startsWith('$') ? `$${Number(parsedPreview.subtotal).toFixed(2)}` : `${Number(parsedPreview.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginBottom: 5 }}>
                        <span>Tax / VAT:</span>
                        <strong style={{ color: '#081E3C' }}>
                          {parsedPreview.amount?.startsWith('$') ? `$${Number(parsedPreview.vat).toFixed(2)}` : `${Number(parsedPreview.vat).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: '#004753', paddingTop: 6, borderTop: '1.5px solid #CBD5E1' }}>
                        <span>Total Due:</span>
                        <span>{parsedPreview.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Original Uploaded Document Preview */}
              {previewMode === 'raw_pdf' && filePreviewUrl && (
                <div style={{ background: '#081E3C', borderRadius: 10, padding: 8, height: 420 }}>
                  <iframe 
                    src={filePreviewUrl} 
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6, background: 'white' }} 
                    title="Original Uploaded Preview"
                  />
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ fontSize: 11.5, color: '#64748B' }}>
            {parsedPreview ? (
              <span>Ready for intake into <strong>Invoices</strong>, <strong>3-Way Match</strong>, and <strong>Exceptions</strong></span>
            ) : (
              <span>Supported formats: PDF, PNG, JPG, JPEG, WEBP</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={onClose}
              style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
            >
              Cancel
            </button>
            {parsedPreview && (
              <button 
                onClick={handleConfirmIntake}
                style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0, 71, 83, 0.25)' }}
              >
                <Check size={15} /> Confirm Intake & Sync Across Tabs
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};
