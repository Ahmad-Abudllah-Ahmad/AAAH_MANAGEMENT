import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, UploadCloud, Layers, CheckCircle2, Clock, AlertTriangle, 
  File, MoreVertical, ShieldCheck, Box, RefreshCw, Eye, Download, Check, X
} from 'lucide-react';

const uaeFederatedModels = [
  { id: 'MOD-001', name: 'AWT_STRUC_Framing_Rev04.rvt', discipline: 'Structural', format: 'Revit 2026', version: 'v4.2', date: '14 Aug 2026', size: '185 MB', author: 'Eng. Tareq (KEO)', status: 'Federated', clashes: 42 },
  { id: 'MOD-002', name: 'AWT_ARCH_Facade_Core_Rev05.ifc', discipline: 'Architectural', format: 'IFC 4.3', version: 'v5.1', date: '13 Aug 2026', size: '320 MB', author: 'A. Davis (Foster)', status: 'Federated', clashes: 88 },
  { id: 'MOD-003', name: 'AWT_MEP_HVAC_Ducting_L01-10.nwd', discipline: 'Mechanical HVAC', format: 'Navisworks 2026', version: 'v3.0', date: '12 Aug 2026', size: '142 MB', author: 'M. Zaid (Dutco MEP)', status: 'Federated', clashes: 124 },
  { id: 'MOD-004', name: 'AWT_PLUMB_Drainage_Riser_Rev2.ifc', discipline: 'Plumbing & Drainage', format: 'IFC 4.3', version: 'v2.4', date: '14 Aug 2026', size: '64 MB', author: 'R. Khan (Al Naboodah)', status: 'Pending Coordination', clashes: 18 },
  { id: 'MOD-005', name: 'AWT_ELEC_HighVoltage_Trays_Rev2.rvt', discipline: 'Electrical & Telecom', format: 'Revit 2026', version: 'v2.1', date: '11 Aug 2026', size: '98 MB', author: 'F. Al Mansoori', status: 'Federated', clashes: 32 },
  { id: 'MOD-006', name: 'AWT_FIRE_Sprinklers_Standpipe_Rev3.nwd', discipline: 'Fire Life Safety', format: 'Navisworks 2026', version: 'v3.2', date: '10 Aug 2026', size: '52 MB', author: 'S. O\'Connor', status: 'Federated', clashes: 14 },
  { id: 'MOD-007', name: 'AWT_CIVIL_Site_Utilities_Rev1.dwg', discipline: 'Civil Infrastructure', format: 'Civil 3D', version: 'v1.0', date: '08 Aug 2026', size: '28 MB', author: 'Parsons Middle East', status: 'Federated', clashes: 6 },
];

export const ClashModels = () => {
  const [modelList, setModelList] = useState(uaeFederatedModels);
  const [search, setSearch] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelDiscipline, setNewModelDiscipline] = useState('Mechanical HVAC');

  const filteredModels = modelList.filter(m => 
    (filterDiscipline === 'All' || m.discipline === filterDiscipline) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()) || m.author.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newModelName) return;
    const newMod = {
      id: `MOD-00${modelList.length + 1}`,
      name: newModelName.endsWith('.rvt') || newModelName.endsWith('.ifc') ? newModelName : `${newModelName}.ifc`,
      discipline: newModelDiscipline,
      format: 'IFC 4.3',
      version: 'v1.0',
      date: 'Just now',
      size: '78 MB',
      author: 'Current User',
      status: 'Federated',
      clashes: 0
    };
    setModelList([newMod, ...modelList]);
    setShowUploadModal(false);
    setNewModelName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            BIM Model Management & Federation
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Upload, version, and federate multi-disciplinary IFC 4.3, Revit (.rvt), and Navisworks (.nwd) models
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Triggering full cloud federation across all 7 trade models...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(0, 71, 83, 0.08)', border: '1.5px solid rgba(0, 71, 83, 0.3)', borderRadius: 8, fontWeight: 800, fontSize: 12.5, color: '#004753', cursor: 'pointer' }}
          >
            <RefreshCw size={14} /> Re-Federate All
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <UploadCloud size={15} /> Upload BIM Model
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search models by filename, author, ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Disciplines</option>
              <option value="Structural">Structural</option>
              <option value="Architectural">Architectural</option>
              <option value="Mechanical HVAC">Mechanical HVAC</option>
              <option value="Plumbing & Drainage">Plumbing & Drainage</option>
              <option value="Electrical & Telecom">Electrical & Telecom</option>
              <option value="Fire Life Safety">Fire Life Safety</option>
              <option value="Civil Infrastructure">Civil Infrastructure</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredModels.length} Federated Models Ingested
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Model Name & ID</th>
                <th style={{ padding: '12px 16px' }}>Trade Discipline</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Version</th>
                <th style={{ padding: '12px 16px' }}>Author / BIM Lead</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Payload</th>
                <th style={{ padding: '12px 16px' }}>Federation Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((mod, i) => (
                <tr 
                  key={mod.id}
                  onClick={() => setSelectedModel(mod)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0, 71, 83, 0.08)', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Box size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#081E3C' }}>{mod.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{mod.id} • {mod.format}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                      {mod.discipline}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', background: '#F1F5F9', borderRadius: 4, fontWeight: 800, fontSize: 11.5, color: '#081E3C' }}>
                      {mod.version}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 600 }}>{mod.author}</td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{mod.date}</td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{mod.size}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: mod.status === 'Federated' ? '#ECFDF5' : '#FEF3C7',
                      color: mod.status === 'Federated' ? '#059669' : '#D97706'
                    }}>
                      {mod.status === 'Federated' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {mod.status} ({mod.clashes} Clashes)
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedModel(mod); }}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
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

      {/* Upload Model Modal */}
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
                  Upload Model to Federated CDE
                </h3>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>BIM Model Filename *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. AWT_MEP_ChilledWater_L03.ifc" 
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Trade Discipline</label>
                <select 
                  value={newModelDiscipline}
                  onChange={(e) => setNewModelDiscipline(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option value="Structural">Structural (Revit / Tekla)</option>
                  <option value="Architectural">Architectural (ArchiCAD / Revit)</option>
                  <option value="Mechanical HVAC">Mechanical HVAC (Navisworks / IFC)</option>
                  <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                  <option value="Electrical & Telecom">Electrical & Telecom</option>
                  <option value="Fire Life Safety">Fire Life Safety</option>
                </select>
              </div>

              <div style={{ border: '2px dashed #00A9C5', borderRadius: 8, padding: 20, textAlign: 'center', background: '#F0F9FF' }}>
                <UploadCloud size={24} color="#004753" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>Drag & Drop IFC 4.3 or RVT Models</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Files will be auto-federated into the coordinate space</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Federate Model
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
