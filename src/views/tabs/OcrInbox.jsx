import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Paperclip, Clock, CheckCircle2, AlertTriangle, FileText, 
  Download, Play, Search, Filter, UploadCloud, RefreshCw, Eye, 
  ArrowRight, ShieldCheck, Check, Sparkles, X, Plus
} from 'lucide-react';
import { Button, StatusPill, ConfidenceBadge, InvoiceUploadModal } from '../../components/ui';
import { useInvoiceContext } from '../../context/InvoiceContext';

export const OcrInbox = () => {
  const { inboxList, setInboxList } = useInvoiceContext();
  const [activeMsgId, setActiveMsgId] = useState(inboxList[0]?.id || 'msg-001');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isScanning, setIsScanning] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const activeItem = inboxList.find(i => i.id === activeMsgId) || inboxList[0];

  const handleForceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setInboxList(prev => prev.map(item => {
        if (item.id === activeItem.id) {
          return {
            ...item,
            status: 'Completed',
            confidence: 99
          };
        }
        return item;
      }));
    }, 1600);
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          const newDoc = {
            id: `msg-${Date.now()}`,
            sender: 'invoicing@alquoz-mep.ae',
            senderName: 'Al Quoz MEP Engineering LLC',
            subject: 'HVAC Ducting Material Delivery INV-33901',
            date: 'Just now',
            attachments: 1,
            status: 'Completed',
            invoiceNumber: `INV-${Math.floor(30000 + Math.random() * 9999)}`,
            totalAmount: '47,250.00 AED',
            confidence: 98,
            poMatch: 'PO-99180',
            linesExtracted: 3
          };
          setInboxList([newDoc, ...inboxList]);
          setActiveMsgId(newDoc.id);
          return 0;
        }
        return p + 25;
      });
    }, 300);
  };

  const filteredList = inboxList.filter(item => {
    const matchesSearch = item.senderName.toLowerCase().includes(search.toLowerCase()) ||
                          item.subject.toLowerCase().includes(search.toLowerCase()) ||
                          item.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      
      {/* Left List Pane */}
      <div style={{ flex: '0 0 380px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--color-gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
              Document Intake Queue
            </h2>
            <button 
              onClick={() => setShowUploadModal(true)}
              style={{ padding: '5px 10px', background: '#004753', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Intake File
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 10 }}>
            <Search size={15} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search sender, invoice, PO..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#081E3C', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Processing', 'Completed', 'Failed'].map(st => (
              <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: statusFilter === st ? '#004753' : '#F1F5F9',
                  color: statusFilter === st ? 'white' : '#64748B',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Items */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {filteredList.map((item) => {
            const isSelected = activeMsgId === item.id;
            return (
              <div 
                key={item.id} 
                onClick={() => setActiveMsgId(item.id)}
                style={{ 
                  padding: '14px 16px', 
                  borderBottom: '1px solid #F1F5F9', 
                  cursor: 'pointer', 
                  transition: 'all 0.15s',
                  background: isSelected ? '#F0F8FA' : 'white',
                  borderLeft: isSelected ? '4px solid #00A9C5' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#004753' : '#081E3C' }} className="truncate">
                    {item.senderName}
                  </span>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{item.date}</span>
                </div>

                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 8 }} className="truncate">
                  {item.subject}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, color: '#081E3C', fontWeight: 700 }}>
                    {item.totalAmount}
                  </span>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12,
                    background: item.status === 'Completed' ? '#DCFCE7' : item.status === 'Processing' ? '#E0F2FE' : item.status === 'Failed' ? '#FEE2E2' : '#FEF3C7',
                    color: item.status === 'Completed' ? '#15803D' : item.status === 'Processing' ? '#0369A1' : item.status === 'Failed' ? '#B91C1C' : '#B45309'
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Preview Pane */}
      <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div 
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-gray-200)', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 900, color: '#081E3C' }}>
                      {activeItem.subject}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#475569' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={14} color="#004753" /> Sender: <strong>{activeItem.sender}</strong>
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} color="#64748B" /> Received: <strong>{activeItem.date}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      onClick={handleForceScan}
                      disabled={isScanning}
                      style={{ padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: isScanning ? 'not-allowed' : 'pointer', boxShadow: '0 2px 6px rgba(0,71,83,0.2)' }}
                    >
                      <motion.div animate={isScanning ? { rotate: 360 } : {}} transition={isScanning ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}>
                        <RefreshCw size={15} />
                      </motion.div>
                      {isScanning ? 'Extracting OCR Fields...' : 'Force Neural OCR Scan'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Extraction Metrics Bar */}
              <div style={{ display: 'flex', gap: 16, padding: '16px 24px', borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                <div style={{ flex: 1, padding: 12, background: '#F0F8FA', borderRadius: 8, border: '1px solid #D9EEF1' }}>
                  <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>INVOICE NUMBER</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#081E3C' }}>{activeItem.invoiceNumber}</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: '#F0F8FA', borderRadius: 8, border: '1px solid #D9EEF1' }}>
                  <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>TOTAL BILLED (AED)</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#081E3C' }}>{activeItem.totalAmount}</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: '#F0F8FA', borderRadius: 8, border: '1px solid #D9EEF1' }}>
                  <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>PO REFERENCE MATCH</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: activeItem.poMatch === 'Missing' ? '#DC2626' : '#004753' }}>
                    {activeItem.poMatch}
                  </div>
                </div>
                <div style={{ flex: 1, padding: 12, background: '#F0F8FA', borderRadius: 8, border: '1px solid #D9EEF1' }}>
                  <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>AI CONFIDENCE</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: activeItem.confidence > 90 ? '#00A86B' : activeItem.confidence > 70 ? '#D97706' : '#DC2626' }}>
                    {activeItem.confidence}%
                  </div>
                </div>
              </div>

              {/* Attachments & Document Visualizer */}
              <div style={{ padding: 24, flex: 1, overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Paperclip size={16} color="#004753" /> Attachments Payload ({activeItem.attachments} PDF)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                  {Array.from({ length: activeItem.attachments }).map((_, i) => (
                    <div key={i} style={{ background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 10, padding: 16, display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ width: 44, height: 44, background: '#E6F4F7', color: '#004753', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }} className="truncate">
                          {activeItem.invoiceNumber}_Document_0{i+1}.pdf
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          {activeItem.status === 'Completed' ? <CheckCircle2 size={13} color="#00A86B" /> : activeItem.status === 'Failed' ? <AlertTriangle size={13} color="#DC2626" /> : <Clock size={13} color="#00A9C5" />}
                          {activeItem.status === 'Completed' ? 'Extracted (3-Way Ready)' : activeItem.status === 'Failed' ? 'Extraction Error' : 'In AI Pipeline'}
                        </div>
                      </div>
                      <button style={{ padding: 8, background: '#F1F5F9', color: '#475569', borderRadius: 6, border: 'none', cursor: 'pointer' }} title="Download Original">
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Scanned Document Preview Box */}
                <div style={{ marginTop: 12, background: 'white', borderRadius: 10, border: '1px solid #CBD5E1', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>Live OCR Extraction Feed</span>
                    <span style={{ fontSize: 11, background: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                      Engine Status: Online
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Supplier Entity:</span>
                      <strong style={{ color: '#081E3C' }}>{activeItem.senderName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Extracted Line Items:</span>
                      <strong style={{ color: '#081E3C' }}>{activeItem.linesExtracted} Items Verified</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Total Value:</span>
                      <strong style={{ color: '#004753', fontSize: 13 }}>{activeItem.totalAmount}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <InvoiceUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUploaded={(newInv) => {
          setActiveMsgId(newInv.id);
        }} 
      />

    </div>
  );
};
