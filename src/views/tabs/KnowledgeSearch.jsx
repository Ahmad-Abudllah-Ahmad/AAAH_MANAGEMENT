import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, SlidersHorizontal, FileText, ChevronRight, MessageSquare, 
  ExternalLink, Zap, CornerDownRight, Copy, Check, Sparkles, BookOpen, Database
} from 'lucide-react';

const uaeSearchResults = [
  { 
    id: 'RES-01', 
    title: 'Dubai Building Code (DBC 2021) Section 5.4.2: Structural Steel Deflection Limits', 
    doc: 'DBC-2021-Structural-Corpus.pdf', 
    source: 'Oracle Aconex', 
    score: 99.2, 
    highlight: '...the maximum allowable cantilever deflection for structural steel transfer members under full superimposed dead and live load shall not exceed L/500, with column plumbness deviation capped at 1/500th of total story height...', 
    date: '14 Aug 2026', 
    tags: ['Regulatory Code', 'Structural Steel', 'DBC 2021'] 
  },
  { 
    id: 'RES-02', 
    title: 'RFI #442 Approved Response - Cantilever Transfer Beam Depth Variance', 
    doc: 'AWT-RFI-RES-442.pdf', 
    source: 'Autodesk ACC', 
    score: 96.4, 
    highlight: '...approved the substitution of W24x68 rolled steel sections in lieu of W24x76 on Level 03 at Column Grid 4B, provided negative moment rebar camber is pre-stressed to 18mm prior to concrete pour...', 
    date: '12 Aug 2026', 
    tags: ['RFI Response', 'Al Wasl Tower', 'Approved Variance'] 
  },
  { 
    id: 'RES-03', 
    title: 'Al Wasl Tower - Structural & MEP Coordination Workshop Minutes (Week 14)', 
    doc: 'MOM-COORDINATION-WK14.pdf', 
    source: 'SharePoint', 
    score: 91.8, 
    highlight: '...noted a potential physical clash between structural diagonal cross-bracing and the primary 800x400mm chilled water supply trunk line on Level 03 vestibule. Resolved via 150mm soffit drop...', 
    date: '08 Aug 2026', 
    tags: ['Meeting Minutes', 'Clash Resolution', 'MEP'] 
  },
  { 
    id: 'RES-04', 
    title: 'Drawing Sheet S-201: Level 04 Rebar Schedule & Beam-Column Moment Details', 
    doc: 'AWT-STR-DWG-0012-RevC.dwg', 
    source: 'Autodesk ACC', 
    score: 88.5, 
    highlight: '...reference Detail 4/S5.0 for column C1 moment connection splice welds. All welded connections must undergo 100% Ultrasonic Non-Destructive Testing (NDT)...', 
    date: '05 Aug 2026', 
    tags: ['CAD Drawing', 'Structural Rebar', 'IFC'] 
  },
  { 
    id: 'RES-05', 
    title: 'FIDIC Red Book Clause 20.1: Contractor Claims & Mandatory 28-Day Notice Rule', 
    doc: 'FIDIC-Red-Book-1999.pdf', 
    source: 'Legal Vault', 
    score: 85.0, 
    highlight: '...if the Contractor fails to give notice of a claim within such period of 28 days, the Time for Completion shall not be extended, the Contractor shall not be entitled to additional payment...', 
    date: '01 Aug 2026', 
    tags: ['Contracts & Claims', 'FIDIC Clause 20.1', 'Legal'] 
  }
];

export const KnowledgeSearch = () => {
  const [query, setQuery] = useState('structural steel deflection limits DBC 2021');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Types');
  const [copiedId, setCopiedId] = useState(null);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleCopyQuote = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredResults = uaeSearchResults.filter(item => {
    if (activeFilter === 'Regulatory Codes') return item.tags.some(t => t.includes('Code'));
    if (activeFilter === 'RFIs & VOs') return item.tags.some(t => t.includes('RFI'));
    if (activeFilter === 'CAD Drawings') return item.tags.some(t => t.includes('Drawing'));
    if (activeFilter === 'Contracts') return item.tags.some(t => t.includes('Contracts') || t.includes('Legal'));
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Search Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Semantic Knowledge & Technical Search
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Search across 52,840+ indexed engineering specifications, FIDIC contracts, drawing schedules, and RFI submittals
          </p>
        </div>

        {/* Big Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'white', border: '1.5px solid #004753', borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.08)' }}>
            <Search size={18} color="#004753" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search specifications, tolerances, FIDIC clauses, drawing numbers..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%', color: '#081E3C', fontWeight: 600 }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16 }}>✕</button>
            )}
          </div>
          <button 
            onClick={handleSearch}
            style={{ padding: '12px 24px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Sparkles size={15} /> Search AI Vector Index
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, marginRight: 4 }}>Filter by:</span>
          {['All Types', 'Regulatory Codes', 'RFIs & VOs', 'CAD Drawings', 'Contracts'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{ 
                padding: '4px 12px', borderRadius: 14, border: 'none', 
                background: activeFilter === f ? 'var(--gradient-brand)' : 'white', 
                color: activeFilter === f ? 'white' : '#64748B', 
                fontWeight: 700, fontSize: 11.5, cursor: 'pointer',
                boxShadow: activeFilter === f ? '0 2px 8px rgba(0, 71, 83, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                border: activeFilter === f ? 'none' : '1px solid #CBD5E1'
              }}
            >
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#00A9C5' }}>
            Found {filteredResults.length} high-confidence matches
          </span>
        </div>
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 24 }}>
        {filteredResults.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{ 
              background: 'white', 
              borderRadius: 14, 
              border: '1px solid var(--color-gray-200)', 
              padding: '18px 20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#004753', background: 'rgba(0, 71, 83, 0.08)', padding: '2px 8px', borderRadius: 4 }}>
                  {item.id}
                </span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#081E3C' }}>
                  {item.title}
                </h3>
              </div>
              <span style={{ 
                fontSize: 11.5, fontWeight: 900, color: '#059669', background: '#ECFDF5', 
                padding: '3px 8px', borderRadius: 6, border: '1px solid #A7F3D0' 
              }}>
                Match: {item.score}%
              </span>
            </div>

            {/* Document Context Metadata */}
            <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span>Document: <strong style={{ color: '#081E3C' }}>{item.doc}</strong></span>
              <span>Source: <strong>{item.source}</strong></span>
              <span>Indexed: {item.date}</span>
            </div>

            {/* Highlighted Snippet Box */}
            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#081E3C', lineHeight: 1.6 }}>
              {item.highlight}
            </div>

            {/* Tags & Copy Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {item.tags.map((t, tIdx) => (
                  <span key={tIdx} style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => handleCopyQuote(item.id, item.highlight)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(0, 71, 83, 0.06)', border: 'none', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
                >
                  {copiedId === item.id ? <><Check size={12} color="#059669" /> Copied!</> : <><Copy size={12} /> Copy Excerpt</>}
                </button>
                <a 
                  href="/knowledge-assistant"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 14px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 6, textDecoration: 'none', fontSize: 11.5, fontWeight: 800, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                >
                  Ask AI About This <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
