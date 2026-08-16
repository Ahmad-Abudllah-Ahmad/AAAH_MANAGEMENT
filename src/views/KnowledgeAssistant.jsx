import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, ChevronRight, FileText, Lock, CheckCircle2, 
  User, Paperclip, Mic, Send, ShieldCheck, Activity, ShieldAlert, 
  File, Sparkles, Database, ExternalLink, Bookmark, Check, Copy, ArrowUpRight
} from 'lucide-react';

const mockChatHistory = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'What is the mandatory concrete cover requirement for underground foundation piles exposed to coastal saline groundwater according to Dubai Building Code 2021 and Project Specification AWT-STR-SPEC-004?',
    time: '10:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: `Based on the Dubai Building Code (DBC 2021) Section 5.4.2 [Durability Requirements in Marine Environments] and Project Specification AWT-STR-SPEC-004 Section 3.2.1:

1. Cast-in-Place Bored Piles & Raft Foundations:
   - Minimum Clear Cover: 75 mm [1] when cast directly against soil with primary waterproofing membrane.
   - Saline Soil Direct Exposure (without membrane): Increase to 100 mm [2].
   - Concrete Durability Class: Minimum C40/50 with 8% Microsilica (Silica Fume) and water-binder ratio ≤ 0.38 [3].

2. Corrosion Inhibitor & Rebar Protection:
   - High-yield deformed rebar grade Fe500D epoxy-coated according to ASTM A775 with mandatory cathodic protection monitoring.

All foundation elements at Column Grid 4B-8E must adhere to Table 5.4 of the Substructure Geotechnical Submittal.`,
    time: '10:43 AM',
    isTypingEffect: false,
    citations: [
      { id: 1, title: 'Dubai Building Code 2021 - Sec 5.4.2', doc: 'DBC-2021-Structural.pdf', page: 'p. 142', snippet: 'For reinforced concrete cast in direct contact with saline groundwater or aggressive sabkha soil, minimum nominal cover shall be not less than 75mm with approved membrane.' },
      { id: 2, title: 'Al Wasl Tower Foundation Specification', doc: 'AWT-STR-SPEC-004.pdf', page: 'p. 28', snippet: 'In the absence of a continuous elastomeric tanking membrane, concrete cover to rebar cage outer links shall be 100mm minimum.' },
      { id: 3, title: 'Mix Design Submittal - C40/50 Self-Compacting', doc: 'MIX-SUB-C40-50.pdf', page: 'p. 4', snippet: 'Water-cementitious ratio shall not exceed 0.38 with 8% condensed silica fume to mitigate chloride ion diffusion.' }
    ]
  }
];

// Typewriter Text Streaming Component
const TypewriterMessage = ({ text, onComplete, speed = 12, citations, setActiveCitation }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index += 3; // Streams 3 characters per tick for crisp, natural reading pace
      if (index >= text.length) {
        setDisplayedText(text);
        setIsDone(true);
        clearInterval(timer);
        if (onComplete) onComplete();
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <div>
      <div style={{ whiteSpace: 'pre-line' }}>
        {displayedText}
        {!isDone && (
          <span style={{ 
            display: 'inline-block', 
            width: 7, 
            height: 14, 
            background: '#00A9C5', 
            marginLeft: 4, 
            verticalAlign: 'middle',
            borderRadius: 1,
            animation: 'pulse 0.6s infinite'
          }} />
        )}
      </div>

      {/* Citations appear once typewriter completes */}
      <AnimatePresence>
        {isDone && citations && (
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}
          >
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Database size={13} color="#00A9C5" /> Verified Ground-Truth Citations:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {citations.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setActiveCitation(c)}
                  style={{ 
                    padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, 
                    border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.15s' 
                  }}
                  className="hover-bg-gray-50"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#004753' }}>
                      [{c.id}] {c.title}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5' }}>
                      {c.doc} ({c.page})
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11.5, color: '#64748B', fontStyle: 'italic' }}>
                    "{c.snippet}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const KnowledgeAssistant = () => {
  const [messages, setMessages] = useState(mockChatHistory);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedDocTitle, setSelectedDocTitle] = useState('');

  const handleSend = (overrideText) => {
    const textToSend = (typeof overrideText === 'string' ? overrideText : inputText).trim();
    if (!textToSend) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let answerText = '';
      let answerCitations = [];

      if (textToSend.toLowerCase().includes('fidic') || textToSend.toLowerCase().includes('notice') || textToSend.toLowerCase().includes('20.1')) {
        answerText = `Under FIDIC Red Book (1999/2017) Clause 20.1 [Contractor's Claims] and UAE Civil Code (Federal Law No. 5 of 1985):\n\n1. 28-Day Notice of Claim Rule:\n   - The contractor must submit formal written notice of claim to the Engineer within 28 calendar days [1] of becoming aware of the delay event.\n   - Failure to serve notice strictly within 28 days discharges the Employer from all liability, subject to UAE Civil Code Article 246 (Good Faith doctrine) [2].\n\n2. Contemporary Records & Substantiation:\n   - Full detailed particulars, critical path Primavera P6 schedules, and daily weather logs must be submitted within 42 days of the initial notice [3].`;
        answerCitations = [
          { id: 1, title: 'FIDIC Red Book 1999 - Clause 20.1', doc: 'FIDIC-Red-Book-1999.pdf', page: 'p. 62', snippet: 'If the Contractor fails to give notice of a claim within such period of 28 days, the Time for Completion shall not be extended.' },
          { id: 2, title: 'UAE Civil Code (Federal Law No. 5 of 1985)', doc: 'UAE-Civil-Code-Article246.pdf', page: 'p. 89', snippet: 'Contracts must be performed in a manner consistent with the requirements of good faith.' },
          { id: 3, title: 'Al Wasl Tower Contract Particular Conditions', doc: 'AWT-PCC-CLAIMS.pdf', page: 'Sec 20', snippet: 'All EOT claims must include Time Impact Analysis (TIA) submittals using Primavera P6 XML.' }
        ];
      } else if (textToSend.toLowerCase().includes('deflection') || textToSend.toLowerCase().includes('cantilever')) {
        answerText = `According to Dubai Building Code (DBC 2021) Section 5.3.4 and BS EN 1992-1-1 Structural Concrete:\n\n1. Cantilever Member Deflection Limits:\n   - Total maximum cantilever deflection under permanent dead load + live load is strictly capped at L/250 [1].\n   - Deflections affecting brittle partition walls or stone cladding shall not exceed L/500 [2].\n\n2. Cambering Specification:\n   - For cantilevers exceeding 2.5 meters projection, a pre-camber of 15 mm to 20 mm must be cast into the formwork prior to rebar placement [3].`;
        answerCitations = [
          { id: 1, title: 'Dubai Building Code 2021 - Sec 5.3.4', doc: 'DBC-2021-Structural.pdf', page: 'p. 138', snippet: 'Deflection of cantilever beams under serviceability limit state shall not exceed length/250.' },
          { id: 2, title: 'Al Wasl Tower Facade Interface Spec', doc: 'AWT-FAC-TOL-002.pdf', page: 'p. 15', snippet: 'Slab edge deflection at perimeter curtain wall joints is limited to L/500 or 10mm maximum.' },
          { id: 3, title: 'Structural Standard Detail Schedule S-04', doc: 'AWT-STR-DWG-0012.dwg', page: 'Detail 8', snippet: 'Provide 18mm upward pre-camber for all Level 03-05 cantilever balconies.' }
        ];
      } else {
        answerText = `Cross-referenced against UAE Technical Specifications and indexed project datasets for "${textToSend}":\n\n1. Regulatory Compliance:\n   - Verified compliant with Dubai Building Code (DBC 2021) and Abu Dhabi ADIBC standards [1].\n   - Technical requirements match latest approved IFC drawing set revisions as of 14 August 2026 [2].\n\n2. Quality & Verification:\n   - Mill Test Certificates (MTC) and QA/QC inspection submittals are verified in the Common Data Environment [3].`;
        answerCitations = [
          { id: 1, title: 'DBC 2021 Regulatory Framework', doc: 'DBC-2021-Corpus.pdf', page: 'Sec 5.2', snippet: 'Standard engineering tolerances and mandatory quality thresholds.' },
          { id: 2, title: 'Project Specification Register', doc: 'AWT-MDR-2026.pdf', page: 'p. 12', snippet: 'Active specifications approved for construction.' },
          { id: 3, title: 'QA/QC Material Approval Submittal', doc: 'QAQC-SUB-2026.pdf', page: 'p. 5', snippet: 'Independent laboratory test certificates verified.' }
        ];
      }

      const aiReply = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        time: 'Just now',
        isTypingEffect: true,
        citations: answerCitations
      };

      setMessages(prev => [...prev, aiReply]);
    }, 1400);
  };

  const handleQuickPrompt = (promptText) => {
    handleSend(promptText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 0, height: '100%', background: '#F8FAFC', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
      
      {/* Left Sidebar: Knowledge Hierarchy Explorer (260px) */}
      <div style={{ width: 260, borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', background: 'white' }}>
        
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
            Knowledge Corpus Index
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 10px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <Search size={14} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search indexed corpus..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, width: '100%', fontWeight: 600, color: '#081E3C' }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#081E3C', marginBottom: 6 }}>
              <ChevronDown size={14} color="#004753" /> Regulatory Codes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 16 }}>
              {['Dubai Building Code 2021 (DBC)', 'UAE Fire & Life Safety Code', 'Abu Dhabi ADIBC 2020'].map((doc, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setSelectedDocTitle(doc); setShowDocModal(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 11.5, color: '#004753', cursor: 'pointer', fontWeight: 600 }}
                  className="hover-bg-gray-50"
                >
                  <FileText size={13} color="#00A9C5" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#081E3C', marginBottom: 6 }}>
              <ChevronDown size={14} color="#004753" /> Active Project Specs
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 16 }}>
              {['AWT-STR-SPEC-004 Concrete', 'ERH-CIV-SPEC-010 Earthworks', 'DCH-FAC-SPEC-008 Curtain Wall'].map((doc, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setSelectedDocTitle(doc); setShowDocModal(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 11.5, color: '#004753', cursor: 'pointer', fontWeight: 600 }}
                  className="hover-bg-gray-50"
                >
                  <FileText size={13} color="#00A9C5" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#081E3C', marginBottom: 6 }}>
              <ChevronDown size={14} color="#004753" /> Contracts & Claims
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 16 }}>
              {['FIDIC Red Book Clause 20.1', 'UAE Civil Code (Law 5/1985)'].map((doc, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setSelectedDocTitle(doc); setShowDocModal(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 6, fontSize: 11.5, color: '#004753', cursor: 'pointer', fontWeight: 600 }}
                  className="hover-bg-gray-50"
                >
                  <ShieldCheck size={13} color="#D97706" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div style={{ padding: 12, borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Vector Index: 52,840 docs
          </div>
        </div>

      </div>

      {/* Center & Right: Chat Stream & Citations Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        
        {/* Chat Stream Header */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#004753', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 900, color: '#081E3C' }}>
                Antigravity Engineering RAG Assistant
              </h3>
              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                Multi-document reasoning with cryptographically grounded citations
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.08)', padding: '3px 8px', borderRadius: 12 }}>
              Gecko Embeddings v3 • Temp 0.1
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.sender === 'user' ? '75%' : '88%'
              }}
            >
              <div style={{ 
                background: msg.sender === 'user' ? '#004753' : 'white', 
                color: msg.sender === 'user' ? 'white' : '#081E3C',
                padding: '14px 18px',
                borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(0,71,83,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                fontSize: 13.5,
                lineHeight: 1.6
              }}>
                {msg.sender === 'assistant' && msg.isTypingEffect ? (
                  <TypewriterMessage 
                    text={msg.text} 
                    citations={msg.citations}
                    setActiveCitation={setActiveCitation}
                  />
                ) : (
                  <div>
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    
                    {/* Static citations for initial mock messages */}
                    {msg.citations && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Database size={13} color="#00A9C5" /> Verified Ground-Truth Citations:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {msg.citations.map((c) => (
                            <div 
                              key={c.id}
                              onClick={() => setActiveCitation(c)}
                              style={{ 
                                padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, 
                                border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.15s' 
                              }}
                              className="hover-bg-gray-50"
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#004753' }}>
                                  [{c.id}] {c.title}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5' }}>
                                  {c.doc} ({c.page})
                                </span>
                              </div>
                              <p style={{ margin: '4px 0 0 0', fontSize: 11.5, color: '#64748B', fontStyle: 'italic' }}>
                                "{c.snippet}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 4, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.time}
              </span>
            </motion.div>
          ))}

          {/* Pure Smooth Animated Wave Bubble (No Text) */}
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 20px',
                  background: 'white',
                  borderRadius: '14px 14px 14px 2px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  width: 'fit-content'
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.35, 1, 0.35],
                      scale: [0.9, 1.15, 0.9]
                    }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #004753, #00A9C5)',
                      display: 'inline-block'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Engineering Action Prompts */}
        <div style={{ padding: '8px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            'Check FIDIC 20.1 28-day notice rule',
            'Verify DBC Cantilever Beam Deflection',
            'Minimum Rebar Cover for Raft Piles',
            'Get C40/50 Concrete Mix Requirements',
          ].map((q, qIdx) => (
            <button 
              key={qIdx}
              onClick={() => handleQuickPrompt(q)}
              style={{ padding: '4px 10px', borderRadius: 6, background: 'white', border: '1px solid #CBD5E1', fontSize: 11.5, fontWeight: 700, color: '#004753', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              + {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 20px', background: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#F8FAFC', padding: '8px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}>
            <input 
              type="text" 
              placeholder="Ask anything about DBC 2021, FIDIC contracts, shop drawings, or specs..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', fontWeight: 600, color: '#081E3C' }}
            />
          </div>
          <button 
            onClick={() => handleSend()}
            style={{ padding: '10px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Send size={14} /> Send
          </button>
        </div>

      </div>

      {/* Document Snippet Preview Modal */}
      <AnimatePresence>
        {(showDocModal || activeCitation) && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 520, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>
                    {activeCitation ? `Citation [${activeCitation.id}] • ${activeCitation.doc}` : 'Verified Corpus Document'}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {activeCitation ? activeCitation.title : selectedDocTitle}
                  </h3>
                </div>
                <button onClick={() => { setShowDocModal(false); setActiveCitation(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12.5, color: '#081E3C', lineHeight: 1.6 }}>
                {activeCitation ? (
                  <>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#004753' }}>
                      Excerpt on {activeCitation.page}:
                    </p>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#475569' }}>
                      "{activeCitation.snippet}"
                    </p>
                  </>
                ) : (
                  <p style={{ margin: 0 }}>
                    Full PDF text and vector embeddings are active for <strong>{selectedDocTitle}</strong>. All semantic search queries automatically cross-reference this document with 99.2% confidence.
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => { setShowDocModal(false); setActiveCitation(null); }} style={{ padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
