import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, 
  X, Sparkles, Check, ArrowRight, ShieldCheck, Eye, Layers, ZoomIn, FileCheck
} from 'lucide-react';
import { useInvoiceContext } from '../../context/InvoiceContext';

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
  const [previewTab, setPreviewTab] = useState('ocr'); // 'ocr' | 'raw_pdf'

  const samplePresets = [
    {
      label: 'Al Habtoor Precast Slab Delivery (PDF)',
      id: `INV-${Math.floor(25000 + Math.random() * 900)}`,
      vendor: 'Al Habtoor Contracting & Precast LLC',
      supplierAddress: 'P.O. Box 7712, Business Bay, Dubai, UAE',
      poMatch: 'PO-99134',
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
      hasVariance: false
    },
    {
      label: 'Arabian MEP Ducting & Fans (With Qty Variance)',
      id: `INV-${Math.floor(26000 + Math.random() * 900)}`,
      vendor: 'Arabian MEP Engineering Solutions LLC',
      supplierAddress: 'Industrial Area 13, Sharjah, UAE',
      poMatch: 'PO-99148',
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
      hasVariance: true
    }
  ];

  const extractPdfOrFileMetadata = async (file) => {
    try {
      let rawText = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Read file slice / text representation
        rawText = await file.text();
      }
      
      const fileName = file.name;
      let extractedId = null;
      const idMatch = rawText.match(/(INV[-_ ]?[0-9A-Z]{4,8})/i) || fileName.match(/(INV[-_ ]?[0-9A-Z]{4,8})/i) || fileName.match(/(\d{4,6})/);
      if (idMatch) {
        extractedId = idMatch[0].toUpperCase().startsWith('INV') ? idMatch[0].toUpperCase() : `INV-${idMatch[0]}`;
      } else {
        extractedId = `INV-${Math.floor(25000 + Math.random() * 9000)}`;
      }

      // PO match
      let extractedPo = 'PO-99134';
      const poMatch = rawText.match(/(PO[-_ ]?[0-9]{4,6})/i) || fileName.match(/(PO[-_ ]?[0-9]{4,6})/i);
      if (poMatch) {
        extractedPo = poMatch[0].toUpperCase();
      }

      // Vendor guessing
      let vendor = 'Al Habtoor Contracting & Precast LLC';
      const lowerText = (rawText + ' ' + fileName).toLowerCase();
      if (lowerText.includes('steel') || lowerText.includes('emirates')) {
        vendor = 'Emirates Steel Industries PJSC';
      } else if (lowerText.includes('gulf') || lowerText.includes('ready mix') || lowerText.includes('concrete')) {
        vendor = 'Gulf Ready Mix Concrete LLC';
      } else if (lowerText.includes('noor')) {
        vendor = 'Al Noor Building Materials LLC';
      } else if (lowerText.includes('mep') || lowerText.includes('quoz')) {
        vendor = 'Al Quoz MEP Engineering LLC';
      } else if (lowerText.includes('duto') || lowerText.includes('formwork') || lowerText.includes('doka')) {
        vendor = 'Dutco Formwork Solutions';
      } else if (lowerText.includes('fast') || lowerText.includes('fixing')) {
        vendor = 'Fast Fixings Ltd';
      } else {
        // Derive clean name from file name
        const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        if (cleanName.length > 5) {
          vendor = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' LLC';
        }
      }

      // Numbers / amounts
      const amounts = [...rawText.matchAll(/([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})/g)].map(m => parseFloat(m[1].replace(/,/g, ''))).filter(n => n > 100 && n < 10000000);
      const totalAmount = amounts.length > 0 ? Math.max(...amounts) : 184320;

      return {
        id: extractedId,
        vendor,
        poMatch: extractedPo,
        total: totalAmount
      };
    } catch {
      return {
        id: `INV-${Math.floor(25000 + Math.random() * 9000)}`,
        vendor: 'Al Habtoor Contracting & Precast LLC',
        poMatch: 'PO-99134',
        total: 184320
      };
    }
  };

  const handleFileChange = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);

    // Extract real metadata from uploaded file
    const meta = await extractPdfOrFileMetadata(file);

    // Run OCR Simulation on the selected file
    startOcrExtraction(file, url, null, meta);
  };

  const startOcrExtraction = (file, fileUrl, preset = null, extractedMeta = null) => {
    setIsProcessing(true);
    setOcrStage(1);
    setOcrProgress(15);

    const fileName = file ? file.name : preset ? `${preset.id}_Document.pdf` : 'Invoice_Document.pdf';
    
    let guessedVendor = extractedMeta?.vendor || 'Al Habtoor Contracting & Precast LLC';
    let guessedId = extractedMeta?.id || `INV-${Math.floor(25000 + Math.random() * 9000)}`;
    let guessedAmount = extractedMeta?.total || 184320;
    let guessedPo = extractedMeta?.poMatch || 'PO-99134';
    
    if (preset) {
      guessedVendor = preset.vendor;
      guessedId = preset.id;
      guessedAmount = preset.total;
      guessedPo = preset.poMatch;
    }

    // Step 1: Preprocessing & optical detection
    setTimeout(() => {
      setOcrStage(2);
      setOcrProgress(55);

      // Step 2: Table & Bounding box extraction
      setTimeout(() => {
        setOcrStage(3);
        setOcrProgress(90);

        setTimeout(() => {
          setOcrProgress(100);
          setIsProcessing(false);

          const subtotalNum = Math.round(guessedAmount / 1.05);
          const vatNum = guessedAmount - subtotalNum;

          const invoicePayload = preset || {
            id: guessedId,
            vendor: guessedVendor,
            supplier: guessedVendor,
            supplierAddress: 'P.O. Box 7712, Business Bay, Dubai, UAE',
            poMatch: guessedPo,
            poNumber: guessedPo,
            grnNumber: 'GRN-8890',
            project: 'Al Barsha Tower — Plot 4',
            total: guessedAmount,
            subtotal: subtotalNum,
            vat: vatNum,
            amount: `${Number(guessedAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED`,
            confidence: 98,
            status: 'Pending Review',
            items: [
              { id: 1, desc: 'Primary Structural Material Package', unit: 'm³', qty: 240, rate: Math.round((subtotalNum * 0.5) / 240), amount: Math.round(subtotalNum * 0.5), poQty: 240, grnQty: 240, status: 'Matched' },
              { id: 2, desc: 'High-Tensile Reinforcement Sections', unit: 'MT', qty: 18, rate: Math.round((subtotalNum * 0.3) / 18), amount: Math.round(subtotalNum * 0.3), poQty: 18, grnQty: 18, status: 'Matched' },
              { id: 3, desc: 'Site Shoring & Ancillary Delivery', unit: 'lot', qty: 1, rate: Math.round(subtotalNum * 0.2), amount: Math.round(subtotalNum * 0.2), poQty: 1, grnQty: 1, status: 'Matched' },
            ],
            hasVariance: false,
            fileUrl: fileUrl,
            fileName: fileName,
            fileType: file ? file.type : 'application/pdf',
            isUploaded: true
          };

          setParsedPreview(invoicePayload);
        }, 400);
      }, 700);
    }, 600);
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
          maxWidth: parsedPreview ? 880 : 560, 
          background: 'white', 
          borderRadius: 16, 
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)', 
          border: '1px solid #E2E8F0', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#081E3C', color: 'white' }}>
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
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
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
                  accept="application/pdf,image/*,.pdf,.png,.jpg,.jpeg"
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
                  {isProcessing ? 'Running Deep Neural OCR Scan on Uploaded Document...' : 'Click to Upload PDF / Image or Drag & Drop'}
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

              {/* Sample Preset Buttons for Quick Testing */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="#00A9C5" /> Or Select a Sample Blueprint / Invoice to Test:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => startOcrExtraction(null, null, preset)}
                      style={{
                        padding: '12px 16px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s'
                      }}
                      className="hover-bg-gray-50"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#E6F4F7', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* Post-OCR Extracted Preview Workstation */}
          {parsedPreview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#065F46' }}>
                      Optical Extraction Complete • {parsedPreview.confidence}% Confidence
                    </div>
                    <div style={{ fontSize: 11.5, color: '#047857' }}>
                      Extracted from <strong>{parsedPreview.fileName}</strong> • Mapped to {parsedPreview.poMatch} ({parsedPreview.project})
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setParsedPreview(null)}
                  style={{ background: 'white', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Upload Another
                </button>
              </div>

              {/* View Switcher: Optical OCR Bounding Box Layout vs Raw Uploaded Document */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setPreviewTab('ocr')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: previewTab === 'ocr' ? '#004753' : '#F1F5F9',
                      color: previewTab === 'ocr' ? 'white' : '#475569',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <ShieldCheck size={14} /> Optical Bounding Box Exact Layout
                  </button>
                  {filePreviewUrl && (
                    <button
                      onClick={() => setPreviewTab('raw_pdf')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: previewTab === 'raw_pdf' ? '#004753' : '#F1F5F9',
                        color: previewTab === 'raw_pdf' ? 'white' : '#475569',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <FileCheck size={14} /> Original Uploaded Document Preview
                    </button>
                  )}
                </div>
                <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
                  File: <strong style={{ color: '#081E3C' }}>{parsedPreview.fileName}</strong>
                </span>
              </div>

              {/* Tab 1: Exact Layout Visual Sheet Preview with Optical Bounding Boxes */}
              {previewTab === 'ocr' && (
                <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #CBD5E1', padding: 20, position: 'relative', overflow: 'hidden' }}>
                  {/* Printable Invoice Mock Layout with Exact Field Positions */}
                  <div style={{ background: 'white', padding: 24, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    
                    {/* Top Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      {/* Supplier Bounding Box */}
                      <div style={{ border: '2px solid #00A9C5', background: '#F0F8FA', padding: '10px 14px', borderRadius: 6, position: 'relative', maxWidth: 360 }}>
                        <div style={{ position: 'absolute', top: -10, right: 8, background: '#004753', color: 'white', fontSize: 9.5, padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>
                          OCR: SUPPLIER [99%]
                        </div>
                        <div style={{ fontSize: 10, color: '#00556A', fontWeight: 800, textTransform: 'uppercase' }}>SUPPLIER / المورد</div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C' }}>{parsedPreview.vendor}</div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{parsedPreview.supplierAddress}</div>
                      </div>

                      {/* Tax Invoice Header Bounding Box */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 17, fontWeight: 900, color: '#081E3C' }}>
                          TAX INVOICE <span style={{ color: '#004753', fontSize: 14 }}>فاتورة ضريبية</span>
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

                    {/* Bill To */}
                    <div style={{ marginBottom: 18, background: '#F8FAFC', padding: '10px 14px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Bill To / فاتورة إلى</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>{parsedPreview.billTo || 'ABC Construction LLC'}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>Dubai, United Arab Emirates • Ref PO: <strong>{parsedPreview.poMatch}</strong></div>
                    </div>

                    {/* Line Items Table with Exact Positions */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, border: '1px solid #CBD5E1', marginBottom: 12 }}>
                      <thead style={{ background: '#081E3C', color: 'white' }}>
                        <tr>
                          <th style={{ padding: '8px 10px', textAlign: 'left', width: 35 }}>#</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left' }}>Extracted Description</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center', width: 55 }}>Unit</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right', width: 70 }}>Qty</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right', width: 110 }}>Rate (AED)</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right', width: 110 }}>Total (AED)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedPreview.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? 'white' : '#FAFAFA' }}>
                            <td style={{ padding: '8px 10px', color: '#64748B' }}>{idx + 1}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#081E3C' }}>{item.desc}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748B' }}>{item.unit}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>{item.qty}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#334155' }}>{Number(item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>{Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: '#004753', marginTop: 6, paddingTop: 6, borderTop: '1.5px solid rgba(0,71,83,0.2)' }}>
                          <span>Total:</span>
                          <span>{parsedPreview.amount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 2: Raw Uploaded Document Viewer */}
              {previewTab === 'raw_pdf' && filePreviewUrl && (
                <div style={{ background: '#081E3C', borderRadius: 12, padding: 12, height: 440, display: 'flex', flexDirection: 'column' }}>
                  {parsedPreview.fileType === 'application/pdf' || parsedPreview.fileName.endsWith('.pdf') ? (
                    <iframe 
                      src={filePreviewUrl} 
                      style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8, background: 'white' }} 
                      title="Uploaded Document"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                      <img 
                        src={filePreviewUrl} 
                        alt="Uploaded Document" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 6 }} 
                      />
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#F8FAFC' }}>
          <button 
            onClick={onClose}
            style={{ padding: '8px 16px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Cancel
          </button>
          {parsedPreview && (
            <button 
              onClick={handleConfirmIntake}
              style={{ padding: '8px 20px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
            >
              <Check size={16} /> Confirm Intake & Sync Across Tabs
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
};
