import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSignature, Search, Filter, Plus, Clock, CheckCircle2, User, 
  MoreHorizontal, Mail, ShieldCheck, Check, Download, ExternalLink, 
  AlertTriangle, Building, Send, GripVertical
} from 'lucide-react';

const initialSignatures = [
  { id: 'SIG-DXB-100', title: 'Subcontractor Trade Agreement - Structural Steel', project: 'Al Wasl Commercial High-Rise', requester: 'Legal Counsel (KEO)', date: 'Yesterday', urgency: 'Critical', value: 'AED 8,900,000', column: 'pendingMySignature' },
  { id: 'SIG-AUH-101', title: 'Site Variation Order #04 - Track Alignment', project: 'Etihad Rail Logistics & Depot Hub', requester: 'Parsons Commercial', date: '2 hours ago', urgency: 'High', value: 'AED 420,000', column: 'pendingMySignature' },
  
  { id: 'SIG-DXB-102', title: 'Curtain Wall Facade Supplier Execution Agreement', project: 'Dubai Creek Harbour Towers', signers: '2 of 3 Completed', date: '12 Aug 2026', nextSigner: 'Emaar Legal Counsel', column: 'outForSignature' },
  { id: 'SIG-AUH-103', title: 'Cultural Heritage Compliance Inspection Certificate', project: 'Zayed National Museum Extension', signers: '0 of 1 Completed', date: 'Yesterday', nextSigner: 'DCT Senior Inspector', column: 'outForSignature' },
  { id: 'SIG-SHJ-104', title: 'Solar PV Equipment Long-Term Lease Agreement', project: 'Sharjah Sustainable City Phase 3', signers: '1 of 2 Completed', date: '10 Aug 2026', nextSigner: 'Commercial Finance Director', column: 'outForSignature' },
  
  { id: 'SIG-DXB-105', title: 'Phase 1 Substructure Raft Sign-off Package', project: 'Al Wasl Commercial High-Rise', date: '14 Aug 2026', file: 'Signed_AWT_Raft_IFC.pdf', hash: 'UAE-PASS-0982-SHA256', column: 'completed' },
  { id: 'SIG-AUH-106', title: 'Site Variation Order #02 (Drainage Upgrade)', project: 'Etihad Rail Logistics Hub', date: '12 Aug 2026', file: 'Signed_ER_VO_02.pdf', hash: 'UAE-PASS-1420-SHA256', column: 'completed' },
  { id: 'SIG-DXB-107', title: 'Chilled Water MEP Subcontract Package', project: 'Dubai Creek Harbour Towers', date: '10 Aug 2026', file: 'Signed_DCH_MEP_Sub.pdf', hash: 'UAE-PASS-3190-SHA256', column: 'completed' },
  { id: 'SIG-SHJ-108', title: 'Interim Payment Certificate IPC-07 (AED 2.8M)', project: 'Sharjah Sustainable City Phase 3', date: '05 Aug 2026', file: 'Signed_SSC_IPC_07.pdf', hash: 'UAE-PASS-8840-SHA256', column: 'completed' },
];

export const DraftingSignatures = () => {
  const [items, setItems] = useState(initialSignatures);
  const [search, setSearch] = useState('');
  const [signingItem, setSigningItem] = useState(null);
  const [signatureName, setSignatureName] = useState('Rashid Al Nuaimi');
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  // Drag and Drop handlers
  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colKey) {
      setDragOverCol(colKey);
    }
  };

  const handleDragLeave = (colKey) => {
    if (dragOverCol === colKey) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = draggedItemId || e.dataTransfer.getData('text/plain');
    if (!id) return;

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          column: targetCol,
          date: targetCol === 'completed' ? 'Just now' : item.date,
          file: targetCol === 'completed' && !item.file ? `Signed_${item.id}.pdf` : item.file,
          hash: targetCol === 'completed' && !item.hash ? 'UAE-PASS-LIVE-SHA256' : item.hash,
        };
      }
      return item;
    }));
    setDraggedItemId(null);
  };

  const handleSignConfirm = () => {
    if (!signingItem) return;
    setItems(prev => prev.map(item => {
      if (item.id === signingItem.id) {
        return {
          ...item,
          column: 'completed',
          date: 'Just now',
          file: `Signed_${item.id}.pdf`,
          hash: 'UAE-PASS-LIVE-SHA256'
        };
      }
      return item;
    }));
    setSigningItem(null);
    alert(`Document signed and verified via UAE PASS: ${signingItem.title}`);
  };

  const columns = [
    {
      key: 'pendingMySignature',
      title: 'Action Required',
      icon: <FileSignature size={17} color="#DC2626" />,
      badgeColor: '#DC2626',
      badgeBg: 'rgba(220, 38, 38, 0.1)',
      items: items.filter(i => i.column === 'pendingMySignature' && (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())))
    },
    {
      key: 'outForSignature',
      title: 'Out for Signature',
      icon: <Clock size={17} color="#D97706" />,
      badgeColor: '#D97706',
      badgeBg: 'rgba(217, 119, 6, 0.1)',
      items: items.filter(i => i.column === 'outForSignature' && (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())))
    },
    {
      key: 'completed',
      title: 'Completed & Stamped',
      icon: <CheckCircle2 size={17} color="#059669" />,
      badgeColor: '#059669',
      badgeBg: 'rgba(5, 150, 105, 0.1)',
      items: items.filter(i => i.column === 'completed' && (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())))
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            E-Signatures & Digital Approvals Board
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Drag and drop contracts across signature checkpoints with live UAE PASS verification
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowSignModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Request New Digital Signature
          </button>
        </div>
      </div>

      {/* Search & Drag Helper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: 8, width: 320 }}>
          <Search size={15} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Search documents or signatories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>
          💡 Tip: Drag and drop cards between stages to update checkpoint progress
        </div>
      </div>

      {/* 3-Column Clean Kanban Board (Neutral Clean Backgrounds) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, flex: 1, minHeight: 0 }}>
        {columns.map(col => {
          const isOver = dragOverCol === col.key;

          return (
            <div 
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={() => handleDragLeave(col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
              style={{ 
                background: isOver ? '#F0F9FF' : '#FFFFFF', 
                borderRadius: 14, 
                border: isOver ? '2px dashed #00A9C5' : '1px solid #E2E8F0', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                boxShadow: isOver ? '0 4px 16px rgba(0,169,197,0.15)' : '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Column Header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {col.icon}
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#081E3C' }}>{col.title}</h3>
                </div>
                <span style={{ background: col.badgeBg, color: col.badgeColor, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                  {col.items.length}
                </span>
              </div>

              {/* Draggable Cards List */}
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
                {col.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    whileHover={{ y: -2 }}
                    style={{ 
                      background: 'white', 
                      borderRadius: 10, 
                      padding: '14px 16px', 
                      border: '1px solid #E2E8F0', 
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 8,
                      cursor: 'grab',
                      userSelect: 'none'
                    }}
                  >
                    {/* Top Row: ID & Status Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <GripVertical size={13} color="#94A3B8" />
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#004753', background: 'rgba(0, 71, 83, 0.08)', padding: '2px 6px', borderRadius: 4 }}>
                          {item.id}
                        </span>
                      </div>
                      {item.urgency ? (
                        <span style={{ fontSize: 11, fontWeight: 800, color: item.urgency === 'Critical' ? '#DC2626' : '#D97706' }}>
                          {item.urgency}
                        </span>
                      ) : item.signers ? (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                          {item.signers}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <ShieldCheck size={12} /> UAE PASS
                        </span>
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C', lineHeight: 1.35 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>
                      {item.project} {item.value && <>• Value: <strong style={{ color: '#004753' }}>{item.value}</strong></>}
                    </div>

                    {/* Action Line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>{item.date}</span>
                      
                      {col.key === 'pendingMySignature' && (
                        <button 
                          onClick={() => setSigningItem(item)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.25)' }}
                        >
                          <FileSignature size={12} /> Sign
                        </button>
                      )}

                      {col.key === 'outForSignature' && (
                        <button 
                          onClick={() => alert(`Sending reminder to ${item.nextSigner}...`)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'rgba(217,119,6,0.1)', border: 'none', borderRadius: 6, fontSize: 10.5, fontWeight: 800, color: '#D97706', cursor: 'pointer' }}
                        >
                          <Send size={11} /> Remind
                        </button>
                      )}

                      {col.key === 'completed' && (
                        <button 
                          onClick={() => alert(`Downloading verified PDF: ${item.file}...`)}
                          style={{ padding: '3px 8px', background: 'rgba(5,150,105,0.1)', border: 'none', borderRadius: 6, fontSize: 10.5, fontWeight: 800, color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                        >
                          <Download size={11} /> PDF
                        </button>
                      )}
                    </div>

                    {/* Dynamic Connecting Checkpoint Line at Bottom of Each Card */}
                    <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid #F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                        
                        {/* Step 1: Draft Prepared */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%',
                            background: '#059669', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8.5, fontWeight: 900
                          }}>
                            ✓
                          </div>
                          <span style={{ fontSize: 8.5, fontWeight: 700, color: '#059669' }}>Drafted</span>
                        </div>

                        {/* Checkpoint Connecting Line 1 */}
                        <div style={{
                          flex: 1, height: 2, margin: '0 4px', marginBottom: 12,
                          background: item.column === 'pendingMySignature' ? '#CBD5E1' : '#059669',
                          borderTop: item.column === 'pendingMySignature' ? '2px dashed #D97706' : 'none'
                        }} />

                        {/* Step 2: Signatures Active */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%',
                            background: item.column === 'completed' ? '#059669' : item.column === 'outForSignature' ? '#D97706' : '#DC2626',
                            color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8.5, fontWeight: 900
                          }}>
                            {item.column === 'completed' ? '✓' : '2'}
                          </div>
                          <span style={{ 
                            fontSize: 8.5, fontWeight: 700, 
                            color: item.column === 'completed' ? '#059669' : item.column === 'outForSignature' ? '#D97706' : '#DC2626' 
                          }}>
                            {item.column === 'pendingMySignature' ? 'My Sign' : item.column === 'outForSignature' ? 'Signers' : 'Signed'}
                          </span>
                        </div>

                        {/* Checkpoint Connecting Line 2 */}
                        <div style={{
                          flex: 1, height: 2, margin: '0 4px', marginBottom: 12,
                          background: item.column === 'completed' ? '#059669' : '#CBD5E1',
                          borderTop: item.column === 'completed' ? 'none' : '2px dashed #CBD5E1'
                        }} />

                        {/* Step 3: Verified & Stamped */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: '50%',
                            background: item.column === 'completed' ? '#059669' : '#94A3B8',
                            color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8.5, fontWeight: 900
                          }}>
                            {item.column === 'completed' ? '✓' : '3'}
                          </div>
                          <span style={{ 
                            fontSize: 8.5, fontWeight: 700, 
                            color: item.column === 'completed' ? '#059669' : '#94A3B8' 
                          }}>
                            {item.column === 'completed' ? 'Stamped' : 'Final Stamp'}
                          </span>
                        </div>

                      </div>
                    </div>

                  </motion.div>
                ))}

                {col.items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8', fontSize: 12, border: '2px dashed #E2E8F0', borderRadius: 8 }}>
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UAE PASS Digital Signature Modal */}
      <AnimatePresence>
        {signingItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {signingItem.id}
                  </span>
                  <h3 style={{ margin: '4px 0 2px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    Sign Document via UAE PASS
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{signingItem.title}</div>
                </div>
                <button onClick={() => setSigningItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, color: '#64748B' }}>Authorized Signatory:</div>
                <input 
                  type="text" 
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 800, color: '#081E3C', outline: 'none' }}
                />
              </div>

              <div style={{ border: '2px dashed #00A9C5', borderRadius: 10, padding: 20, textAlign: 'center', background: '#F0FDF4' }}>
                <ShieldCheck size={28} color="#059669" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: '#065F46' }}>UAE PASS Digital Certificate Ready</div>
                <div style={{ fontSize: 11, color: '#047857', marginTop: 2 }}>Legally binding under UAE Federal Decree Law No. 46 of 2021</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setSigningItem(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button 
                  onClick={handleSignConfirm}
                  style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                >
                  <Check size={14} /> Authorize & Sign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
