import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FileText, Search, Plus, HardDrive, RefreshCw, CheckCircle2, 
  Clock, MoreVertical, Cloud, Database, File, ArrowUpRight, Upload, 
  Layers, Check, ShieldCheck, Download, Trash2
} from 'lucide-react';

const uaeCdeIntegrations = [
  { name: 'Autodesk Construction Cloud (ACC)', status: 'Connected', docs: '18,450', size: '14.2 GB', color: '#0EA5E9', sync: '5 mins ago' },
  { name: 'Oracle Aconex Enterprise CDE', status: 'Connected', docs: '14,200', size: '9.8 GB', color: '#10B981', sync: '12 mins ago' },
  { name: 'SharePoint Document Server', status: 'Connected', docs: '12,300', size: '6.4 GB', color: '#004753', sync: '25 mins ago' },
  { name: 'Local PDF & CAD Vault', status: 'Synced', docs: '7,890', size: '4.1 GB', color: '#D97706', sync: 'Just now' },
];

const uaeRepoData = [
  { id: 'KB-01', name: 'Dubai Building Code 2021 (DBC) Full Regulatory Corpus', type: 'folder', items: 450, size: '1.2 GB', syncStatus: 'synced', lastSync: '10 mins ago', source: 'Oracle Aconex', category: 'Regulatory Standards' },
  { id: 'KB-02', name: 'Al Wasl Tower - Structural Specifications & Mill Test Certs', type: 'folder', items: 1280, size: '3.4 GB', syncStatus: 'synced', lastSync: '15 mins ago', source: 'Autodesk ACC', category: 'Project Submittals' },
  { id: 'KB-03', name: 'Etihad Rail Logistics Hub - Civil Earthworks & Track Standards', type: 'folder', items: 920, size: '2.1 GB', syncStatus: 'synced', lastSync: '1 hour ago', source: 'Oracle Aconex', category: 'Civil Specifications' },
  { id: 'KB-04', name: 'Dubai Creek Harbour - Curtain Wall Acoustic Test Reports', type: 'folder', items: 640, size: '1.8 GB', syncStatus: 'synced', lastSync: '2 hours ago', source: 'SharePoint', category: 'QA/QC Lab Reports' },
  { id: 'KB-05', name: 'FIDIC Red Book 1999/2017 Contract Clause Reference Guide.pdf', type: 'file', ext: 'pdf', size: '14.5 MB', syncStatus: 'synced', lastSync: 'Just now', source: 'Local Vault', category: 'Legal & Contracts' },
  { id: 'KB-06', name: 'UAE Fire & Life Safety Code of Practice 2024.pdf', type: 'file', ext: 'pdf', size: '88.2 MB', syncStatus: 'synced', lastSync: 'Yesterday', source: 'Local Vault', category: 'HSE & Safety' },
  { id: 'KB-07', name: 'Zayed National Museum - Heritage Masonry Conservation Spec.pdf', type: 'file', ext: 'pdf', size: '24.1 MB', syncStatus: 'synced', lastSync: '3 days ago', source: 'SharePoint', category: 'Architectural Spec' },
];

export const KnowledgeRepository = () => {
  const [repoList, setRepoList] = useState(uaeRepoData);
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('Project Submittals');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredData = repoList.filter(item => {
    const matchesSource = selectedSource === 'All' || item.source === selectedSource;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.category.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newFileName) return;
    const created = {
      id: `KB-0${repoList.length + 1}`,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      type: 'file',
      ext: 'pdf',
      size: '6.4 MB',
      syncStatus: 'synced',
      lastSync: 'Just now',
      source: 'Local Vault',
      category: newFileCategory
    };
    setRepoList([created, ...repoList]);
    setShowUploadModal(false);
    setNewFileName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Knowledge Base Repository & CDE Integrations
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Connected Autodesk ACC, Oracle Aconex, and SharePoint repositories feeding AI vector embeddings
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Initiating real-time vector re-indexing for all connected CDE data sources...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, color: '#081E3C', cursor: 'pointer' }}
          >
            <RefreshCw size={14} /> Trigger Re-Index
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Upload size={14} /> Ingest New Technical Specification
          </button>
        </div>
      </div>

      {/* Row 1: CDE Integration Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {uaeCdeIntegrations.map((cde, i) => (
          <div 
            key={i}
            style={{ 
              background: 'white', 
              padding: '14px 18px', 
              borderRadius: 14, 
              border: '1px solid var(--color-gray-200)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#081E3C' }} className="truncate">
                {cde.name}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
                <CheckCircle2 size={11} /> {cde.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#004753', lineHeight: 1.1 }}>{cde.docs}</div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Vectorized Docs ({cde.size})</div>
              </div>
              <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                Synced {cde.sync}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Repository File Explorer */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search knowledge repository..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Connected Sources</option>
              <option value="Autodesk ACC">Autodesk ACC</option>
              <option value="Oracle Aconex">Oracle Aconex</option>
              <option value="SharePoint">SharePoint</option>
              <option value="Local Vault">Local Vault</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredData.length} Indexed Repositories
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Repository ID & Name</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Connected Source</th>
                <th style={{ padding: '12px 16px' }}>Payload Size</th>
                <th style={{ padding: '12px 16px' }}>Sync State</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr 
                  key={item.id}
                  onClick={() => setSelectedDoc(item)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 6, 
                        background: item.type === 'folder' ? 'rgba(0, 169, 197, 0.1)' : 'rgba(0, 71, 83, 0.1)', 
                        color: item.type === 'folder' ? '#00A9C5' : '#004753',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                      }}>
                        {item.type === 'folder' ? <Folder size={16} /> : <FileText size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#081E3C' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{item.id} {item.items && `• ${item.items} Sub-documents`}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 700 }}>{item.source}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>{item.size}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: '#ECFDF5', color: '#059669'
                    }}>
                      <CheckCircle2 size={11} /> Synced ({item.lastSync})
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedDoc(item); }}
                      style={{ padding: '4px 10px', background: 'rgba(0, 71, 83, 0.06)', border: 'none', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload to Knowledge Base Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleUploadSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Upload Document to Knowledge Base
                </h3>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Document Title / File Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dubai Municipality Geotechnical Standard Spec.pdf" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Domain Classification</label>
                <select 
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option value="Regulatory Standards">Regulatory Standards (DBC / ADIBC)</option>
                  <option value="Project Submittals">Project Submittals & Shop Drawings</option>
                  <option value="Civil Specifications">Civil Specifications</option>
                  <option value="QA/QC Lab Reports">QA/QC Lab Reports & Mill Certs</option>
                  <option value="Legal & Contracts">Legal & Contracts (FIDIC)</option>
                  <option value="HSE & Safety">HSE & Safety Manuals (OSHAD)</option>
                </select>
              </div>

              <div style={{ border: '2px dashed #00A9C5', borderRadius: 8, padding: 20, textAlign: 'center', background: '#F0F9FF' }}>
                <Upload size={24} color="#004753" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>Drag & Drop PDF or CAD XML Files</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Files will be vectorized and embedded with OpenAI / Gecko embeddings</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Start Embedding Ingestion
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
