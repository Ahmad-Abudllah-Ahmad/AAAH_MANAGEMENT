import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronLeft, ChevronRight, Undo, MessageSquare, History, 
  FileText, Database, CheckCircle2, Clock, Circle, File, FileSignature, 
  Lock, Sparkles, Send, Download, Check, ShieldCheck, AlertCircle, 
  Layers, Plus, RefreshCw, Bookmark
} from 'lucide-react';

const draftTemplatesList = [
  { id: 'DFT-01', title: 'Notice of Delay (FIDIC 20.1)', category: 'Contractual', ref: 'Al Wasl Tower' },
  { id: 'DFT-02', title: 'Extension of Time (EOT) Claim', category: 'Contractual', ref: 'Etihad Rail Hub' },
  { id: 'DFT-03', title: 'Site Variation Order #04', category: 'Commercial', ref: 'Dubai Creek Towers' },
  { id: 'DFT-04', title: 'Interim Payment Certificate IPC-08', category: 'Commercial', ref: 'Zayed National Museum' },
  { id: 'DFT-05', title: 'Subcontractor Trade Agreement', category: 'Legal & Risk', ref: 'Sharjah Sustainable City' },
];

export const DocumentDrafting = () => {
  const [selectedDoc, setSelectedDoc] = useState(draftTemplatesList[0]);
  const [activeHover, setActiveHover] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [approvalState, setApprovalState] = useState('Draft'); // Draft | In Review | Approved
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSendApproval = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setApprovalState('In Review');
      triggerToast('Document sent for Lead Engineer & Legal Sign-off.');
    }, 1200);
  };

  const handleAiRefine = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      triggerToast('AI Copilot: Clause refined with FIDIC 1999 Red Book standards.');
      setAiPrompt('');
    }, 1400);
  };

  const BoundField = ({ id, value, tooltip, source }) => (
    <span 
      onMouseEnter={() => setActiveHover(id)}
      onMouseLeave={() => setActiveHover(null)}
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 4, 
        background: 'rgba(0, 169, 197, 0.12)', 
        color: '#004753', 
        padding: '2px 6px', 
        borderBottom: '2px solid #00A9C5',
        cursor: 'pointer',
        borderRadius: '3px 3px 0 0',
        fontWeight: 800
      }}
    >
      {value} <Database size={11} color="#00A9C5" />
      
      <AnimatePresence>
        {activeHover === id && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }}
            style={{ 
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', 
              marginTop: 6, background: 'white', padding: '6px 12px', borderRadius: 6, 
              border: '1px solid #CBD5E1', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
              zIndex: 30, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' 
            }}
          >
            <Database size={13} color="#004753" />
            <span style={{ fontSize: 11, color: '#64748B' }}>
              Bound to ERP: <strong style={{ color: '#081E3C' }}>{tooltip}</strong> ({source})
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', padding: '16px 20px', background: '#F8FAFC', overflowY: 'hidden' }}>
      
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            style={{
              position: 'fixed', top: 75, right: 24, zIndex: 100,
              background: 'white', padding: '12px 20px', borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            <CheckCircle2 size={18} color="#059669" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#081E3C' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '3px 8px', borderRadius: 6 }}>
            {selectedDoc.id} • {selectedDoc.category}
          </span>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
            {selectedDoc.title}
          </h2>
          <span style={{ 
            fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 10,
            background: approvalState === 'Approved' ? '#ECFDF5' : approvalState === 'In Review' ? '#FEF3C7' : '#EFF6FF',
            color: approvalState === 'Approved' ? '#059669' : approvalState === 'In Review' ? '#D97706' : '#004753'
          }}>
            {approvalState}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => triggerToast("Document draft auto-saved to cloud repository.")}
            style={{ padding: '6px 12px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
          >
            Save Draft
          </button>
          <button 
            onClick={handleSendApproval}
            disabled={isSending}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Send size={13} /> {isSending ? 'Routing Workflow...' : 'Send for Approval'}
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Template Quick Selector (220px) */}
        <div style={{ flex: '0 0 220px', background: 'white', borderRadius: 12, border: '1px solid var(--color-gray-200)', padding: 12, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', padding: '4px 6px', marginBottom: 4 }}>
            Active Drafts
          </div>
          {draftTemplatesList.map(tmpl => {
            const isSelected = selectedDoc.id === tmpl.id;
            return (
              <div 
                key={tmpl.id}
                onClick={() => setSelectedDoc(tmpl)}
                style={{ 
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                  background: isSelected ? 'rgba(0, 71, 83, 0.08)' : 'transparent',
                  border: isSelected ? '1px solid #004753' : '1px solid transparent'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? '#004753' : '#081E3C' }}>
                  {tmpl.title}
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>
                  {tmpl.ref}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Column: Interactive Document Canvas (A4 Paper Simulation) */}
        <div style={{ flex: 1, background: '#E2E8F0', borderRadius: 12, padding: '20px 24px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 740, background: 'white', borderRadius: 8, padding: '40px 48px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', minHeight: 720, display: 'flex', flexDirection: 'column', gap: 18, color: '#081E3C', fontSize: 13.5, lineHeight: 1.7 }}>
            
            {/* Document Header Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #081E3C', paddingBottom: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#004753', letterSpacing: '-0.02em' }}>
                  AAAH ENGINEERING CONSULTANCY
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  P.O. Box 48291, Sheikh Zayed Road, Dubai, UAE
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11.5, color: '#64748B' }}>
                <div>Doc Ref: <strong style={{ color: '#081E3C' }}>{selectedDoc.id}-2026</strong></div>
                <div>Date: <strong style={{ color: '#081E3C' }}>15 August 2026</strong></div>
              </div>
            </div>

            {/* Document Subject Title */}
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 6, borderLeft: '4px solid #004753' }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>SUBJECT / NOTICE TYPE:</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C' }}>
                FORMAL NOTICE PURSUANT TO CLAUSE 20.1 & 8.4 — TIME-CRITICAL CLAIM
              </div>
            </div>

            {/* Body Text with ERP Bound Data Fields */}
            <div>
              <p>
                <strong>To:</strong> The Supervising Engineer, <BoundField id="f1" value="KEO International Consultants" tooltip="Lead Consultant" source="Oracle Aconex" /><br />
                <strong>Employer:</strong> <BoundField id="f2" value="Emaar Properties PJSC" tooltip="Client Entity" source="SAP ERP" /><br />
                <strong>Project:</strong> <BoundField id="f3" value={selectedDoc.ref} tooltip="Active Project" source="BIM LOD-350" />
              </p>

              <p>
                Dear Sir / Madam,
              </p>

              <p>
                In accordance with <strong>Clause 20.1 [Contractor's Claims]</strong> of the General Conditions of Contract, we hereby give formal notice of an event giving rise to potential delay in the critical path execution of the Substructure and Tower Superstructure works.
              </p>

              <p>
                On <strong>10 August 2026</strong>, site excavation teams encountered unchartered utility obstructions at Column Grid 4B, necessitating immediate re-engineering of the primary foundation raft as detailed in Drawing Sheet <strong>DWG-DXB-101 (Rev 03)</strong>.
              </p>

              <p>
                The quantified financial and schedule implications are estimated at <BoundField id="f4" value="AED 420,000.00" tooltip="Variation Amount" source="BOQ Schedule" /> with an anticipated critical path delay of <BoundField id="f5" value="14 Calendar Days" tooltip="EOT Duration" source="Primavera P6" />.
              </p>

              <p>
                We reserve all rights under <strong>Clause 8.4 [Extension of Time for Completion]</strong> and <strong>Clause 13.3 [Variation Procedure]</strong>. Detailed contemporary records and delay substantiation schedules are attached herewith.
              </p>
            </div>

            {/* Sign-off Block */}
            <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>PREPARED BY:</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>Rashid Al Nuaimi</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Senior Contracts Engineer</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: 6, border: '1px solid #A7F3D0' }}>
                  ✓ Digitally Verified via UAE PASS
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Drafting Copilot (260px) */}
        <div style={{ flex: '0 0 260px', background: 'white', borderRadius: 12, border: '1px solid var(--color-gray-200)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #E2E8F0', paddingBottom: 8 }}>
            <Sparkles size={16} color="#00A9C5" />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#081E3C' }}>
              AI Clause Copilot
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Quick Refinements
            </div>
            {[
              'Align tone with FIDIC Clause 20.1',
              'Add UAE Civil Code Article 247 clause',
              'Insert 14-day formal response deadline',
              'Reference BIM drawing DWG-DXB-101',
            ].map((q, qIdx) => (
              <button 
                key={qIdx}
                onClick={() => {
                  setAiPrompt(q);
                  handleAiRefine();
                }}
                style={{ 
                  padding: '7px 10px', borderRadius: 6, background: '#F8FAFC', 
                  border: '1px solid #E2E8F0', textAlign: 'left', fontSize: 11.5, 
                  fontWeight: 700, color: '#004753', cursor: 'pointer', transition: 'all 0.15s' 
                }}
                className="hover-bg-gray-50"
              >
                + {q}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea 
              rows={3}
              placeholder="Ask AI to refine, redraft, or check legal compliance..." 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 11.5, outline: 'none', resize: 'none' }}
            />
            <button 
              onClick={handleAiRefine}
              disabled={isAiGenerating}
              style={{ padding: '7px 12px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 11.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
            >
              <Sparkles size={13} /> {isAiGenerating ? 'Refining Text...' : 'Generate with AI'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
