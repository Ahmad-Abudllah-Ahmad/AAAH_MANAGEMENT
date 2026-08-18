import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext(null);

const STORAGE_KEY_INVOICES = 'ocr_invoices_data_v1';
const STORAGE_KEY_MATCHING = 'ocr_matching_queue_v1';
const STORAGE_KEY_EXCEPTIONS = 'ocr_exceptions_data_v1';
const STORAGE_KEY_INBOX = 'ocr_inbox_data_v1';

export const initialInvoicesData = [
  { 
    id: 'INV-24817', 
    vendor: 'Al Noor Building Materials LLC', 
    date: '2026-08-12', 
    amount: '227,167.50 AED', 
    status: 'Pending Review', 
    confidence: 96, 
    poMatch: 'PO-99128', 
    project: 'Al Barsha Tower — Plot 4', 
    lines: 5,
    grnNumber: 'GRN-8812',
    supplierAddress: 'P.O. Box 12345, Industrial Area 2, Sharjah, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Ready-mix concrete C40', unit: 'm³', qty: 120, rate: 340, amount: 40800, poQty: 120, grnQty: 120, status: 'Matched' },
      { id: 2, desc: 'Reinforcement bar 16mm', unit: 'MT', qty: 15, rate: 3250, amount: 48750, poQty: 15, grnQty: 15, status: 'Matched', needsRateReview: true },
      { id: 3, desc: 'Formwork plywood 18mm', unit: 'm²', qty: 500, rate: 85, amount: 42500, poQty: 500, grnQty: 500, status: 'Matched' },
      { id: 4, desc: 'Structural steel section', unit: 'MT', qty: 8, rate: 6800, amount: 54400, poQty: 8, grnQty: 8, status: 'Matched' },
      { id: 5, desc: 'Cement Type I 50kg', unit: 'bags', qty: 260, rate: 115, amount: 29900, poQty: 240, grnQty: 240, status: 'Qty Variance', hasDiscrepancy: true },
    ],
    subtotal: 216350,
    vat: 10817.50,
    total: 227167.50,
    hasVariance: true
  },
  { 
    id: 'INV-24815', 
    vendor: 'Gulf Ready Mix Concrete LLC', 
    date: '2026-08-12', 
    amount: '62,370.00 AED', 
    status: 'Approved', 
    confidence: 99, 
    poMatch: 'PO-88102', 
    project: 'Al Barsha Tower — Substructure', 
    lines: 2,
    grnNumber: 'GRN-7731',
    supplierAddress: 'P.O. Box 45120, Al Quoz Industrial 3, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Business Bay, Dubai, UAE',
    items: [
      { id: 1, desc: 'Ready-mix concrete C50', unit: 'm³', qty: 150, rate: 360, amount: 54000, poQty: 150, grnQty: 150, status: 'Matched' },
      { id: 2, desc: 'Pump hire 42m boom', unit: 'hrs', qty: 12, rate: 450, amount: 5400, poQty: 12, grnQty: 12, status: 'Matched' },
    ],
    subtotal: 59400,
    vat: 2970,
    total: 62370,
    hasVariance: false
  },
  { 
    id: 'INV-24819', 
    vendor: 'Emirates Steel Industries PJSC', 
    date: '2026-08-11', 
    amount: '156,555.00 AED', 
    status: 'Approved', 
    confidence: 99, 
    poMatch: 'PO-99150', 
    project: 'Dubai Marina Residences', 
    lines: 2,
    grnNumber: 'GRN-8840',
    supplierAddress: 'ICAD 1, Musaffah, Abu Dhabi, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'High-yield Rebar 25mm Grade 60', unit: 'MT', qty: 45, rate: 3100, amount: 139500, poQty: 45, grnQty: 45, status: 'Matched' },
      { id: 2, desc: 'Binding wire 18 gauge', unit: 'coils', qty: 80, rate: 120, amount: 9600, poQty: 80, grnQty: 80, status: 'Matched' },
    ],
    subtotal: 149100,
    vat: 7455,
    total: 156555,
    hasVariance: false
  },
  { 
    id: 'INV-9021', 
    vendor: 'Fast Fixings Ltd', 
    date: '2026-08-12', 
    amount: '14,910.00 AED', 
    status: 'Exception', 
    confidence: 45, 
    poMatch: 'Missing', 
    project: 'Al Barsha Tower — Plot 4', 
    lines: 4,
    grnNumber: 'GRN-Pending',
    supplierAddress: 'Al Qusais Industrial Area, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'M16 Chemical Anchor Bolts Grade 8.8', unit: 'pcs', qty: 300, rate: 22, amount: 6600, poQty: 0, grnQty: 0, status: 'Unmatched' },
      { id: 2, desc: 'Galvanized Strut Channels 41x41mm', unit: 'm', qty: 150, rate: 38, amount: 5700, poQty: 0, grnQty: 0, status: 'Unmatched' },
      { id: 3, desc: 'Drop-in anchors 12mm', unit: 'boxes', qty: 20, rate: 95, amount: 1900, poQty: 0, grnQty: 0, status: 'Unmatched' },
    ],
    subtotal: 14200,
    vat: 710,
    total: 14910,
    hasVariance: true
  },
  { 
    id: 'INV-21044', 
    vendor: 'Dutco Formwork Solutions', 
    date: '2026-08-10', 
    amount: '118,400.00 AED', 
    status: 'Approved', 
    confidence: 98, 
    poMatch: 'PO-77412', 
    project: 'Al Barsha Tower — Superstructure', 
    lines: 3,
    grnNumber: 'GRN-6519',
    supplierAddress: 'Jebel Ali Industrial Area 1, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Doka Table Formwork Monthly Lease', unit: 'sets', qty: 8, rate: 8500, amount: 68000, poQty: 8, grnQty: 8, status: 'Matched' },
      { id: 2, desc: 'Heavy duty shoring props 4.0m', unit: 'pcs', qty: 240, rate: 145, amount: 34800, poQty: 240, grnQty: 240, status: 'Matched' },
      { id: 3, desc: 'Transport and site handling fee', unit: 'lot', qty: 1, rate: 10000, amount: 10000, poQty: 1, grnQty: 1, status: 'Matched' },
    ],
    subtotal: 112800,
    vat: 5600,
    total: 118400,
    hasVariance: false
  },
  { 
    id: 'INV-19042', 
    vendor: 'Logistics Pro Haulage', 
    date: '2026-08-09', 
    amount: '24,500.00 AED', 
    status: 'Pending Review', 
    confidence: 88, 
    poMatch: 'PO-66109', 
    project: 'Al Barsha Tower — Logistics', 
    lines: 2,
    grnNumber: 'GRN-5510',
    supplierAddress: 'Ras Al Khor Industrial 2, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Lowbed heavy transport trailer trips', unit: 'trips', qty: 6, rate: 3200, amount: 19200, poQty: 6, grnQty: 6, status: 'Matched' },
      { id: 2, desc: 'Site mobilization crane assist', unit: 'hrs', qty: 8, rate: 520, amount: 4160, poQty: 8, grnQty: 8, status: 'Matched' },
    ],
    subtotal: 23360,
    vat: 1140,
    total: 24500,
    hasVariance: false
  },
  { 
    id: 'INV-18011', 
    vendor: 'BuildMat Corp LLC', 
    date: '2026-08-08', 
    amount: '32,500.00 AED', 
    status: 'Exception', 
    confidence: 75, 
    poMatch: 'PO-55102', 
    project: 'Downtown Commercial Hub', 
    lines: 1,
    grnNumber: 'GRN-4421',
    supplierAddress: 'Al Quoz 4, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'AAC Thermal Insulation Blocks 200mm', unit: 'm³', qty: 110, rate: 280, amount: 30800, poQty: 110, grnQty: 110, status: 'Matched' },
    ],
    subtotal: 30800,
    vat: 1700,
    total: 32500,
    hasVariance: true
  },
  { 
    id: 'INV-17024', 
    vendor: 'Al Quoz MEP Engineering LLC', 
    date: '2026-08-07', 
    amount: '89,400.00 AED', 
    status: 'Approved', 
    confidence: 97, 
    poMatch: 'PO-99180', 
    project: 'Al Barsha Tower — Plot 4', 
    lines: 6,
    grnNumber: 'GRN-3392',
    supplierAddress: 'Al Quoz Industrial 1, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Galvanized GI Ducting 1.2mm Sheet', unit: 'm²', qty: 420, rate: 140, amount: 58800, poQty: 420, grnQty: 420, status: 'Matched' },
      { id: 2, desc: 'Fire dampers motorized 24V', unit: 'pcs', qty: 18, rate: 950, amount: 17100, poQty: 18, grnQty: 18, status: 'Matched' },
      { id: 3, desc: 'Flexible duct connectors 10"', unit: 'm', qty: 60, rate: 155, amount: 9300, poQty: 60, grnQty: 60, status: 'Matched' },
    ],
    subtotal: 85200,
    vat: 4200,
    total: 89400,
    hasVariance: false
  },
  { 
    id: 'INV-16055', 
    vendor: 'National Cleaning Services', 
    date: '2026-08-06', 
    amount: '18,000.00 AED', 
    status: 'Exception', 
    confidence: 92, 
    poMatch: 'PO-44102', 
    project: 'Corporate Facilities', 
    lines: 1,
    grnNumber: 'GRN-2281',
    supplierAddress: 'Deira, Dubai, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Post-construction deep facade cleaning', unit: 'lot', qty: 1, rate: 17142.85, amount: 17142.85, poQty: 1, grnQty: 1, status: 'Matched' },
    ],
    subtotal: 17142.85,
    vat: 857.15,
    total: 18000,
    hasVariance: true
  },
  { 
    id: 'INV-15099', 
    vendor: 'Security & Safety Systems LLC', 
    date: '2026-08-05', 
    amount: '38,200.00 AED', 
    status: 'Approved', 
    confidence: 99, 
    poMatch: 'PO-33109', 
    project: 'Site Operations', 
    lines: 3,
    grnNumber: 'GRN-1190',
    supplierAddress: 'Sharjah Media City, UAE',
    billTo: 'ABC Construction LLC',
    billToAddress: 'Dubai, United Arab Emirates',
    items: [
      { id: 1, desc: 'Biometric Turnstile Gate Lease & Maintenance', unit: 'units', qty: 4, rate: 5500, amount: 22000, poQty: 4, grnQty: 4, status: 'Matched' },
      { id: 2, desc: 'CCTV Solar Wireless Towers (Level 1-4)', unit: 'units', qty: 2, rate: 6200, amount: 12400, poQty: 2, grnQty: 2, status: 'Matched' },
      { id: 3, desc: 'RFID Site Badges 500 pack', unit: 'pack', qty: 1, rate: 2000, amount: 2000, poQty: 1, grnQty: 1, status: 'Matched' },
    ],
    subtotal: 36400,
    vat: 1800,
    total: 38200,
    hasVariance: false
  },
];

export const initialExceptionsData = [
  { 
    id: 'EXC-001', 
    invNo: 'INV-9021',
    vendor: 'Fast Fixings Ltd', 
    date: '2026-08-12', 
    type: 'Blurry Scan / Low Contrast', 
    confidence: 45, 
    severity: 'High',
    itemsCount: '4 Lines',
    totalAmount: '14,910.00 AED',
    issueDesc: 'Thermal scan resolution below 150 DPI. Optical OCR engine could not recognize character glyphs in table totals with high certainty.',
    missingField: 'Subtotal & Tax Figures',
    resolved: false
  },
  { 
    id: 'EXC-002', 
    invNo: 'INV-8834',
    vendor: 'Unknown Vendor (Unmatched TRN)', 
    date: '2026-08-12', 
    type: 'Missing PO Number', 
    confidence: 52, 
    severity: 'Critical',
    itemsCount: '12 Lines',
    totalAmount: '84,200.00 AED',
    issueDesc: 'No Purchase Order reference found on document header. Vendor TRN 100492817200003 is not linked to an active subcontract PO.',
    missingField: 'PO Number Reference',
    suggestedPo: 'PO-99128 (Al Barsha Tower Superstructure)',
    resolved: false
  },
  { 
    id: 'EXC-003', 
    invNo: 'INV-7721',
    vendor: 'Steel & Co Trading PJSC', 
    date: '2026-08-11', 
    type: 'Amount Mismatch (PO vs Inv)', 
    confidence: 82, 
    severity: 'High',
    itemsCount: '3 Lines',
    totalAmount: '145,200.00 AED',
    issueDesc: 'Unit rate on Line 2 billed at 3,450 AED/MT vs contract rate agreed on PO-99150 at 3,100 AED/MT (+11.3% variance).',
    missingField: 'Rate Discrepancy',
    resolved: false
  },
  { 
    id: 'EXC-004', 
    invNo: 'INV-6612',
    vendor: 'BuildMat Corp LLC', 
    date: '2026-08-10', 
    type: 'Unrecognized Tax ID (FTA)', 
    confidence: 75, 
    severity: 'Medium',
    itemsCount: '1 Line',
    totalAmount: '32,500.00 AED',
    issueDesc: 'VAT TRN 100293847500003 failed automated Luhn checksum verification against UAE Federal Tax Authority registry.',
    missingField: 'Tax Registration Number (TRN)',
    resolved: false
  },
  { 
    id: 'EXC-005', 
    invNo: 'INV-5519',
    vendor: 'Office Supplies & Stationers', 
    date: '2026-08-08', 
    type: 'Missing Authorized Signature', 
    confidence: 60, 
    severity: 'Medium',
    itemsCount: '2 Lines',
    totalAmount: '4,850.00 AED',
    issueDesc: 'Invoice exceeds 3,000 AED threshold but lacks required receiving engineer stamp & signature block.',
    missingField: 'Site Receiving Stamp',
    resolved: false
  },
  { 
    id: 'EXC-006', 
    invNo: 'INV-4410',
    vendor: 'Tech Hardware Solutions FZ', 
    date: '2026-08-08', 
    type: 'Incorrect Currency Format', 
    confidence: 85, 
    severity: 'Low',
    itemsCount: '4 Lines',
    totalAmount: '$12,400.00 USD',
    issueDesc: 'Invoice currency stated in USD ($) while project accounting ledger requires AED at fixed central bank parity 3.6725.',
    missingField: 'Currency Normalization (AED)',
    resolved: false
  },
  { 
    id: 'EXC-007', 
    invNo: 'INV-3301',
    vendor: 'National Cleaning Services', 
    date: '2026-08-07', 
    type: 'Duplicate Invoice Hash', 
    confidence: 92, 
    severity: 'Critical',
    itemsCount: '1 Line',
    totalAmount: '18,000.00 AED',
    issueDesc: 'Identical invoice number INV-3301 and amount was already settled on Voucher AP-2026-0412 on July 24.',
    missingField: 'Duplicate Audit Flag',
    resolved: false
  }
];

export const initialInboxData = [
  { 
    id: 'msg-001', 
    sender: 'ap-billing@alnoor-materials.ae', 
    senderName: 'Al Noor Building Materials LLC',
    subject: 'Tax Invoice #INV-24817 — Al Barsha Tower Plot 4', 
    date: '10:42 AM', 
    attachments: 1, 
    status: 'Processing',
    invoiceNumber: 'INV-24817',
    totalAmount: '227,167.50 AED',
    confidence: 96,
    poMatch: 'PO-99128',
    linesExtracted: 5
  },
  { 
    id: 'msg-002', 
    sender: 'invoices@gulfreadymix.com', 
    senderName: 'Gulf Ready Mix Concrete LLC',
    subject: 'Substructure Pouring Delivery Batch #442', 
    date: '09:15 AM', 
    attachments: 2, 
    status: 'Completed',
    invoiceNumber: 'INV-24815',
    totalAmount: '62,370.00 AED',
    confidence: 99,
    poMatch: 'PO-88102',
    linesExtracted: 2
  },
  { 
    id: 'msg-003', 
    sender: 'accounts@emirates-steel.ae', 
    senderName: 'Emirates Steel Industries PJSC',
    subject: 'Monthly Rebar Deliveries June 2026', 
    date: 'Yesterday', 
    attachments: 1, 
    status: 'Completed',
    invoiceNumber: 'INV-24819',
    totalAmount: '156,555.00 AED',
    confidence: 99,
    poMatch: 'PO-99150',
    linesExtracted: 2
  },
  { 
    id: 'msg-004', 
    sender: 'finance@fastfixings.ae', 
    senderName: 'Fast Fixings Ltd',
    subject: 'Site Fasteners & Anchors Supply', 
    date: 'Yesterday', 
    attachments: 1, 
    status: 'Failed',
    invoiceNumber: 'INV-9021',
    totalAmount: '14,910.00 AED',
    confidence: 45,
    poMatch: 'Missing',
    linesExtracted: 4,
    failReason: 'Low scan DPI (110 DPI) — Blurred table totals'
  },
  { 
    id: 'msg-005', 
    sender: 'billing@dutco-formwork.com', 
    senderName: 'Dutco Formwork Solutions',
    subject: 'Doka Climbing Rig Jump #11 Lease', 
    date: 'Aug 10', 
    attachments: 2, 
    status: 'Completed',
    invoiceNumber: 'INV-21044',
    totalAmount: '118,400.00 AED',
    confidence: 98,
    poMatch: 'PO-77412',
    linesExtracted: 3
  },
  { 
    id: 'msg-006', 
    sender: 'accounts@logistics-pro.ae', 
    senderName: 'Logistics Pro Haulage',
    subject: 'Tower Crane 1 Logistics Delivery Fees', 
    date: 'Aug 09', 
    attachments: 1, 
    status: 'Pending',
    invoiceNumber: 'INV-19042',
    totalAmount: '24,500.00 AED',
    confidence: 88,
    poMatch: 'PO-66109',
    linesExtracted: 2
  },
];

export const InvoiceProvider = ({ children }) => {
  const [invoicesList, setInvoicesList] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_INVOICES);
      return saved ? JSON.parse(saved) : initialInvoicesData;
    } catch {
      return initialInvoicesData;
    }
  });

  const [exceptionsList, setExceptionsList] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_EXCEPTIONS);
      return saved ? JSON.parse(saved) : initialExceptionsData;
    } catch {
      return initialExceptionsData;
    }
  });

  const [inboxList, setInboxList] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_INBOX);
      return saved ? JSON.parse(saved) : initialInboxData;
    } catch {
      return initialInboxData;
    }
  });

  const [activeMatchingId, setActiveMatchingId] = useState('INV-24817');
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState(null);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoicesList));
    } catch (e) {
      console.error(e);
    }
  }, [invoicesList]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_EXCEPTIONS, JSON.stringify(exceptionsList));
    } catch (e) {
      console.error(e);
    }
  }, [exceptionsList]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_INBOX, JSON.stringify(inboxList));
    } catch (e) {
      console.error(e);
    }
  }, [inboxList]);

  // Add Uploaded Invoice to Invoices, Matching, Exceptions, and Inbox
  const addUploadedInvoice = (invoiceData, rawFile = null) => {
    const invId = invoiceData.id || `INV-${Math.floor(25000 + Math.random() * 9000)}`;
    const vendor = invoiceData.vendor || invoiceData.supplier || 'Al Habtoor Contracting & Precast LLC';
    const amount = invoiceData.amount || (invoiceData.total ? `${Number(invoiceData.total).toLocaleString('en-US', { minimumFractionDigits: 2 })} AED` : '184,320.00 AED');
    const totalNum = invoiceData.total || 184320;
    const subtotalNum = invoiceData.subtotal || Math.round(totalNum / 1.05);
    const vatNum = totalNum - subtotalNum;
    const poMatch = invoiceData.poMatch || invoiceData.poNumber || 'PO-99134';
    const grnNumber = invoiceData.grnNumber || 'GRN-8890';
    const project = invoiceData.project || 'Al Barsha Tower — Plot 4';
    const confidence = invoiceData.confidence || 97;
    const date = invoiceData.date || new Date().toISOString().split('T')[0];
    const items = invoiceData.items || [
      { id: 1, desc: 'Cast-in-place Concrete C50', unit: 'm³', qty: 240, rate: 375, amount: 90000, poQty: 240, grnQty: 240, status: 'Matched' },
      { id: 2, desc: 'High-Tensile Rebar 20mm', unit: 'MT', qty: 18, rate: 3150, amount: 56700, poQty: 18, grnQty: 18, status: 'Matched' },
      { id: 3, desc: 'Modular Alu-Decking Shoring', unit: 'm²', qty: 350, rate: 82, amount: 28700, poQty: 350, grnQty: 350, status: 'Matched' },
    ];

    const newInvoice = {
      id: invId,
      vendor,
      supplier: vendor,
      supplierAddress: invoiceData.supplierAddress || 'P.O. Box 7712, Business Bay, Dubai, UAE',
      supplierConfidence: 99,
      date,
      dateConfidence: 98,
      billTo: 'ABC Construction LLC',
      billToAddress: 'Dubai, United Arab Emirates',
      amount,
      status: invoiceData.status || 'Pending Review',
      confidence,
      poMatch,
      poNumber: poMatch,
      grnNumber,
      project,
      lines: items.length,
      items,
      subtotal: subtotalNum,
      vat: vatNum,
      total: totalNum,
      hasVariance: invoiceData.hasVariance || false,
      fileUrl: invoiceData.fileUrl || null,
      fileName: invoiceData.fileName || (rawFile ? rawFile.name : `${invId}_Document.pdf`),
      fileType: invoiceData.fileType || (rawFile ? rawFile.type : 'application/pdf'),
      isUploaded: true,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Add to Invoices List (top of list)
    setInvoicesList(prev => [newInvoice, ...prev.filter(i => i.id !== invId)]);

    // 2. Add to Exceptions List if flagged or for verification
    if (newInvoice.hasVariance || newInvoice.status === 'Exception' || confidence < 90) {
      const newException = {
        id: `EXC-${Math.floor(100 + Math.random() * 900)}`,
        invNo: invId,
        vendor,
        date,
        type: newInvoice.hasVariance ? 'Quantity / Price Variance' : 'Audit Verification Required',
        confidence,
        severity: confidence < 70 ? 'Critical' : 'High',
        itemsCount: `${items.length} Lines`,
        totalAmount: amount,
        issueDesc: `Uploaded invoice ${invId} processed via OCR. Verification required before ERP authorization.`,
        missingField: '3-Way Discrepancy Review',
        suggestedPo: `${poMatch} (${project})`,
        resolved: false,
        fileUrl: newInvoice.fileUrl,
        fileName: newInvoice.fileName
      };
      setExceptionsList(prev => [newException, ...prev.filter(e => e.invNo !== invId)]);
    }

    // 3. Add to Inbox
    const newInboxMsg = {
      id: `msg-${Date.now()}`,
      sender: `accounts@${vendor.toLowerCase().replace(/[^a-z0-9]/g, '')}.ae`,
      senderName: vendor,
      subject: `Direct Upload: Tax Invoice #${invId} — ${project}`,
      date: 'Just now',
      attachments: 1,
      status: 'Completed',
      invoiceNumber: invId,
      totalAmount: amount,
      confidence,
      poMatch,
      linesExtracted: items.length,
      fileUrl: newInvoice.fileUrl,
      fileName: newInvoice.fileName
    };
    setInboxList(prev => [newInboxMsg, ...prev]);

    // Set active matching
    setActiveMatchingId(invId);

    return newInvoice;
  };

  const approveInvoice = (id) => {
    setInvoicesList(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved', confidence: 100 } : item));
    setExceptionsList(prev => prev.map(item => item.invNo === id ? { ...item, resolved: true, resolutionNote: 'Approved & posted to ERP by Auditor.' } : item));
  };

  return (
    <InvoiceContext.Provider value={{
      invoicesList,
      setInvoicesList,
      exceptionsList,
      setExceptionsList,
      inboxList,
      setInboxList,
      activeMatchingId,
      setActiveMatchingId,
      selectedAuditInvoice,
      setSelectedAuditInvoice,
      addUploadedInvoice,
      approveInvoice
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return context;
};
