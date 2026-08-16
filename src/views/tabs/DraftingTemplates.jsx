import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, FileText, Layers, ShieldCheck, Star, Clock, 
  MoreVertical, Eye, Download, CheckCircle2, Copy, Sparkles, BookOpen, 
  ArrowUpRight, Tag, Check, ExternalLink
} from 'lucide-react';

const uaeTemplateCategories = [
  'All Templates', 
  'Legal & Contracts (FIDIC)', 
  'Engineering RFIs & VOs', 
  'Commercial & Payment', 
  'Compliance & QA/QC', 
  'Site Administration'
];

const uaeTemplatesList = [
  { 
    id: 'TPL-FIDIC-001', 
    title: 'FIDIC Red Book Subcontractor Agreement', 
    category: 'Legal & Contracts (FIDIC)', 
    author: 'Legal Counsel (KEO)', 
    date: 'Updated 2 days ago', 
    stars: 128, 
    used: 1420, 
    type: 'Contract Document',
    clauses: ['Clause 4.4 Subcontracting', 'Clause 14 Payment Terms', 'Clause 20 Claims & Disputes'],
    description: 'Standard UAE FIDIC Red Book 1999/2017 compliant trade contractor terms with mandatory UAE Civil Code alignment.'
  },
  { 
    id: 'TPL-ENG-002', 
    title: 'Technical Request for Information (RFI) Form', 
    category: 'Engineering RFIs & VOs', 
    author: 'Chief Resident Engineer', 
    date: 'Updated 1 day ago', 
    stars: 94, 
    used: 2840, 
    type: 'Form Template',
    clauses: ['Specification Reference', 'Proposed Solution', 'Cost / Schedule Impact Confirmation'],
    description: 'Formal RFI engineering submission form mapped to CAD drawing sheet references and 48-hour response SLA.'
  },
  { 
    id: 'TPL-ENG-003', 
    title: 'Site Variation Order Request (VOR)', 
    category: 'Engineering RFIs & VOs', 
    author: 'Senior Quantity Surveyor', 
    date: 'Updated 3 days ago', 
    stars: 86, 
    used: 980, 
    type: 'Commercial Form',
    clauses: ['Scope of Change', 'Bill of Quantities Pricing Delta', 'Time Impact Assessment (TIA)'],
    description: 'Formal variation claim template including rate breakdown, schedule delay justification, and engineer verification.'
  },
  { 
    id: 'TPL-COM-004', 
    title: 'Interim Payment Certificate (IPC) Application', 
    category: 'Commercial & Payment', 
    author: 'Finance & Commercial PMO', 
    date: 'Updated 1 week ago', 
    stars: 112, 
    used: 1650, 
    type: 'Financial Schedule',
    clauses: ['Work Executed to Date', 'Material on Site (MOS)', 'Retention 10% Withholding', 'Advance Amortization'],
    description: 'Monthly contractor payment application template with automated cumulative billing and VAT compliance.'
  },
  { 
    id: 'TPL-LEG-005', 
    title: 'Notice of Delay & Extension of Time (EOT)', 
    category: 'Legal & Contracts (FIDIC)', 
    author: 'Contracts Director', 
    date: 'Updated 4 days ago', 
    stars: 145, 
    used: 620, 
    type: 'Legal Notice',
    clauses: ['Clause 8.4 Extension of Time', 'Clause 20.1 Contractor Claims (28-day notice rule)'],
    description: 'Time-critical FIDIC Clause 20.1 delay notification letter template preserving full contractor claim rights.'
  },
  { 
    id: 'TPL-QAQC-006', 
    title: 'Material Inspection Request (MIR) Form', 
    category: 'Compliance & QA/QC', 
    author: 'QA/QC Lead Consultant', 
    date: 'Updated 5 days ago', 
    stars: 76, 
    used: 2100, 
    type: 'Inspection Form',
    clauses: ['Delivery Note Reference', 'Mill Test Certificate (MTC)', 'Site Storage Verification'],
    description: 'Standard material approval submission for rebar, concrete mix, MEP equipment, and facade panels.'
  },
  { 
    id: 'TPL-QAQC-007', 
    title: 'Method Statement & Risk Assessment (RAMS)', 
    category: 'Compliance & QA/QC', 
    author: 'HSE Directorate', 
    date: 'Updated 2 weeks ago', 
    stars: 64, 
    used: 890, 
    type: 'Safety Document',
    clauses: ['Step-by-Step Methodology', 'Hazard Identification', 'PPE & Environmental Controls'],
    description: 'Dubai Municipality & Abu Dhabi OSHAD compliant construction sequence safety documentation.'
  },
  { 
    id: 'TPL-ADM-008', 
    title: 'Consultant Site Instruction (CSI) Form', 
    category: 'Site Administration', 
    author: 'Supervising Consultant', 
    date: 'Updated 3 days ago', 
    stars: 58, 
    used: 1340, 
    type: 'Administrative Order',
    clauses: ['Immediate Action Required', 'Contractor Sign-off', 'Cost Implications Statement'],
    description: 'Direct field directive issued by the engineer for non-disruptive site adjustments and corrections.'
  }
];

export const DraftingTemplates = () => {
  const [templatesList, setTemplatesList] = useState(uaeTemplatesList);
  const [activeCategory, setActiveCategory] = useState('All Templates');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: '', category: 'Engineering RFIs & VOs', description: '', type: 'Contract Document' });

  const filteredTemplates = templatesList.filter(t => {
    const matchesCategory = activeCategory === 'All Templates' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.title) return;
    const created = {
      id: `TPL-CUSTOM-${String(templatesList.length + 1).padStart(3, '0')}`,
      title: newTemplate.title,
      category: newTemplate.category,
      author: 'Current User',
      date: 'Just now',
      stars: 1,
      used: 0,
      type: newTemplate.type,
      clauses: ['Custom Clause 1', 'General Terms & Conditions'],
      description: newTemplate.description || 'Custom organizational document structure.'
    };
    setTemplatesList([created, ...templatesList]);
    setShowCreateModal(false);
    setNewTemplate({ title: '', category: 'Engineering RFIs & VOs', description: '', type: 'Contract Document' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Document Template Library
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Standardized FIDIC contracts, RFI forms, variation orders, and UAE compliance templates
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Create FIDIC Contract Template
          </button>
        </div>
      </div>

      {/* Main Split Layout: Category Nav + Templates Grid */}
      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* Left Category Sidebar */}
        <div style={{ flex: '0 0 260px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 8px', marginBottom: 4 }}>
            Template Categories
          </div>

          {uaeTemplateCategories.map(cat => {
            const count = cat === 'All Templates' ? templatesList.length : templatesList.filter(t => t.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <div 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '9px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                  background: isSelected ? 'rgba(0, 71, 83, 0.08)' : 'transparent',
                  color: isSelected ? '#004753' : '#64748B',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 12.5
                }}
                className="hover-bg-gray-50"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <span style={{ color: isSelected ? '#004753' : '#94A3B8' }}>
                    {cat.includes('Legal') ? <ShieldCheck size={16} /> : cat.includes('Engineering') ? <FileText size={16} /> : <Layers size={16} />}
                  </span>
                  <span className="truncate">{cat}</span>
                </div>
                <span style={{ 
                  fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 10,
                  background: isSelected ? '#004753' : '#E2E8F0',
                  color: isSelected ? 'white' : '#64748B'
                }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Templates Grid Container */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'hidden' }}>
          
          {/* Search & Filter Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #E2E8F0' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder={`Search ${activeCategory}...`} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
              Showing {filteredTemplates.length} templates
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, paddingRight: 2 }}>
            {filteredTemplates.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                onClick={() => setSelectedTemplate(item)}
                style={{ 
                  background: 'white', 
                  borderRadius: 14, 
                  border: '1px solid var(--color-gray-200)', 
                  padding: '18px 20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      {item.id}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={12} fill="#D97706" color="#D97706" /> {item.stars}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 900, color: '#081E3C', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: 12, color: '#64748B', lineHeight: 1.4 }} className="line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                    Used {item.used.toLocaleString()} times • {item.date}
                  </div>
                  <a 
                    href="/document-drafting"
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '5px 12px', background: 'rgba(0, 71, 83, 0.06)', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    Draft <ArrowUpRight size={12} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* Template Details Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 540, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {selectedTemplate.id} • {selectedTemplate.type}
                  </span>
                  <h2 style={{ margin: '4px 0 2px 0', fontSize: 17, fontWeight: 900, color: '#081E3C' }}>
                    {selectedTemplate.title}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    Author: {selectedTemplate.author} • Category: {selectedTemplate.category}
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12.5, color: '#081E3C', lineHeight: 1.5 }}>
                {selectedTemplate.description}
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                  Pre-Configured Legal & Technical Clauses
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedTemplate.clauses.map((clause, cIdx) => (
                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 700, color: '#004753' }}>
                      <Check size={14} color="#059669" /> {clause}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                <button onClick={() => setSelectedTemplate(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <a 
                  href="/document-drafting"
                  style={{ padding: '7px 18px', background: '#004753', color: 'white', borderRadius: 6, fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Use Template in AI Drafts <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleCreateTemplate}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Create New Document Template
                </h3>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Template Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Subcontractor Concrete Pour Agreement" 
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Category</label>
                <select 
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option value="Legal & Contracts (FIDIC)">Legal & Contracts (FIDIC)</option>
                  <option value="Engineering RFIs & VOs">Engineering RFIs & VOs</option>
                  <option value="Commercial & Payment">Commercial & Payment</option>
                  <option value="Compliance & QA/QC">Compliance & QA/QC</option>
                  <option value="Site Administration">Site Administration</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Description & Purpose</label>
                <textarea 
                  rows={3}
                  placeholder="Summarize the legal and contractual intent of this template..." 
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Save Template
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
