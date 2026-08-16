import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, UploadCloud, Layers, CheckCircle2, Clock, 
  Zap, FileText, File, MoreVertical, Maximize2, AlertTriangle, Eye, 
  Download, RefreshCw, Trash2, ChevronRight, Check, ExternalLink, ShieldCheck
} from 'lucide-react';

const uaeDrawingsList = [
  { 
    id: 'DWG-DXB-101', 
    name: 'A-101 Ground Floor Architectural Layout.pdf', 
    project: 'Al Wasl Commercial High-Rise',
    set: 'Issued for Construction (IFC)', 
    rev: 'Rev 03', 
    date: '14 Aug 2026', 
    status: 'Processed', 
    elements: 342,
    size: '18.4 MB',
    scale: '1:100',
    layers: ['Walls', 'Doors', 'Windows', 'Grid Lines', 'Room Tags'],
    discipline: 'Architectural'
  },
  { 
    id: 'DWG-DXB-102', 
    name: 'A-102 Level 02-08 Typical Tower Plan.pdf', 
    project: 'Al Wasl Commercial High-Rise',
    set: 'Issued for Construction (IFC)', 
    rev: 'Rev 03', 
    date: '14 Aug 2026', 
    status: 'Processed', 
    elements: 280,
    size: '22.1 MB',
    scale: '1:100',
    layers: ['Partition Walls', 'Glazed Curtain', 'Fire Doors', 'Columns'],
    discipline: 'Architectural'
  },
  { 
    id: 'DWG-AUH-201', 
    name: 'S-201 Foundation Raft & Piling Details.dwg', 
    project: 'Etihad Rail Logistics & Depot Hub',
    set: 'Structural Package A', 
    rev: 'Rev 02', 
    date: '12 Aug 2026', 
    status: 'Processing', 
    elements: 0,
    size: '45.8 MB',
    scale: '1:50',
    layers: ['Piles', 'Rebar Mesh', 'Ground Beams', 'Waterproofing'],
    discipline: 'Structural'
  },
  { 
    id: 'DWG-DXB-301', 
    name: 'M-301 Central HVAC Chilled Water Schematics.pdf', 
    project: 'Dubai Creek Harbour Towers',
    set: 'MEP Coordination Set', 
    rev: 'Rev 01', 
    date: '08 Aug 2026', 
    status: 'Processed', 
    elements: 156,
    size: '14.2 MB',
    scale: '1:200',
    layers: ['Ducting', 'VAV Boxes', 'FCU Units', 'Pipe Runs'],
    discipline: 'MEP'
  },
  { 
    id: 'DWG-AUH-401', 
    name: 'E-401 High-Voltage Substation Electrical Plan.pdf', 
    project: 'Zayed National Museum Extension',
    set: 'Specialist Works', 
    rev: 'Rev 01', 
    date: '05 Aug 2026', 
    status: 'Failed', 
    elements: 0,
    size: '9.6 MB',
    scale: '1:100',
    layers: ['Cable Trays', 'Switchgear', 'Emergency Gen'],
    discipline: 'Electrical',
    error: 'OCR Scale Ambiguity: Missing Title Block Reference'
  },
  { 
    id: 'DWG-DXB-201', 
    name: 'A-201 Podium South & East Elevations.pdf', 
    project: 'Al Wasl Commercial High-Rise',
    set: 'Issued for Construction (IFC)', 
    rev: 'Rev 03', 
    date: '14 Aug 2026', 
    status: 'Processed', 
    elements: 89,
    size: '16.7 MB',
    scale: '1:100',
    layers: ['Facade Cladding', 'Louvers', 'Terrace Railings'],
    discipline: 'Architectural'
  },
  { 
    id: 'DWG-DWC-105', 
    name: 'C-105 Apron Heavy Aircraft Pavement Grading.dwg', 
    project: 'Al Maktoum Int Airport Logistics Park',
    set: 'Civil Works Package', 
    rev: 'Rev 04', 
    date: '02 Aug 2026', 
    status: 'Processed', 
    elements: 412,
    size: '62.0 MB',
    scale: '1:500',
    layers: ['Runway Contours', 'Drainage Culverts', 'Fuel Hydrants'],
    discipline: 'Civil'
  },
  { 
    id: 'DWG-SHJ-302', 
    name: 'S-302 Villa Type A Structural Framing & Roof.pdf', 
    project: 'Sharjah Sustainable City Phase 3',
    set: 'Residential Package', 
    rev: 'Rev 02', 
    date: '28 Jul 2026', 
    status: 'Processed', 
    elements: 198,
    size: '12.8 MB',
    scale: '1:50',
    layers: ['Precast Slabs', 'Tie Beams', 'Parapet Walls'],
    discipline: 'Structural'
  },
  { 
    id: 'DWG-RAK-501', 
    name: 'P-501 Beachfront Marine Drainage & Outfall.pdf', 
    project: 'Al Marjan Island Luxury Resort',
    set: 'Marine & Infrastructure', 
    rev: 'Rev 01', 
    date: '20 Jul 2026', 
    status: 'Processing', 
    elements: 0,
    size: '19.4 MB',
    scale: '1:250',
    layers: ['Stormwater Mains', 'Tide Gates', 'Pumping Pit'],
    discipline: 'Civil'
  }
];

export const DrawingDrawings = () => {
  const [drawingsList, setDrawingsList] = useState(uaeDrawingsList);
  const [search, setSearch] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtered dataset
  const filteredDrawings = drawingsList.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.project.toLowerCase().includes(search.toLowerCase()) ||
                          d.id.toLowerCase().includes(search.toLowerCase());
    const matchesDiscipline = disciplineFilter === 'All' || d.discipline === disciplineFilter;
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesDiscipline && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDrawings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDrawings.map(d => d.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleScanTrigger = (id) => {
    setDrawingsList(prev => prev.map(d => d.id === id ? { ...d, status: 'Processing' } : d));
    setTimeout(() => {
      setDrawingsList(prev => prev.map(d => d.id === id ? { ...d, status: 'Processed', elements: 215 } : d));
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Drawing Sets & CAD Files
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Manage blueprint sheets, multi-layer CAD DWG/PDF sets, revisions, and automated AI extraction pipelines
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => {
                alert(`Triggering batch AI Takeoff extraction for ${selectedIds.length} drawing sheets...`);
                setSelectedIds([]);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#00A9C5', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
            >
              <Zap size={14} /> Batch AI Scan ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <UploadCloud size={16} /> Upload New Drawings
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(0,71,83,0.08)', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C' }}>{drawingsList.length} Sheets</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Total Drawing Register</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
              {drawingsList.filter(d => d.status === 'Processed').length} Processed
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Ready for Takeoff BOQ</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#D97706' }}>
              {drawingsList.filter(d => d.status === 'Processing').length} In Queue
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Active Neural Parsing</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#DC2626' }}>
              {drawingsList.filter(d => d.status === 'Failed').length} Ambiguities
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Require Scale Setting</div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 300, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search drawings, project, sheet code..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            {/* Discipline Dropdown */}
            <select 
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Disciplines</option>
              <option value="Architectural">Architectural</option>
              <option value="Structural">Structural</option>
              <option value="MEP">MEP & HVAC</option>
              <option value="Civil">Civil & Site</option>
              <option value="Electrical">Electrical</option>
            </select>

            {/* Status Dropdown */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Statuses</option>
              <option value="Processed">Processed</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed / Ambiguity</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            Showing {filteredDrawings.length} of {drawingsList.length} sheets
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px', width: 36 }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredDrawings.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 16px' }}>Sheet Name & Code</th>
                <th style={{ padding: '12px 16px' }}>Project Development</th>
                <th style={{ padding: '12px 16px' }}>Discipline</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Revision</th>
                <th style={{ padding: '12px 16px' }}>AI Status</th>
                <th style={{ padding: '12px 16px' }}>Elements Parsed</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrawings.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <tr 
                    key={doc.id}
                    onClick={() => setSelectedDrawing(doc)}
                    style={{ 
                      borderBottom: '1px solid #F1F5F9', 
                      background: isSelected ? 'rgba(0, 169, 197, 0.04)' : 'transparent',
                      cursor: 'pointer', 
                      transition: 'background 0.15s' 
                    }}
                    className="hover-bg-gray-50"
                  >
                    <td style={{ padding: '12px 18px' }} onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectOne(doc.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: doc.name.endsWith('.pdf') ? '#FEF2F2' : '#EFF6FF', color: doc.name.endsWith('.pdf') ? '#DC2626' : '#00A9C5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {doc.name.endsWith('.pdf') ? <FileText size={14} /> : <File size={14} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#081E3C' }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: '#004753', fontWeight: 700 }}>{doc.id} • {doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#081E3C' }}>{doc.project}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{doc.set}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                        {doc.discipline}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 6px', background: '#E2E8F0', borderRadius: 4, fontWeight: 800, fontSize: 11, color: '#081E3C' }}>
                        {doc.rev}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800,
                        background: doc.status === 'Processed' ? '#ECFDF5' : doc.status === 'Failed' ? '#FEE2E2' : '#FEF3C7',
                        color: doc.status === 'Processed' ? '#059669' : doc.status === 'Failed' ? '#DC2626' : '#D97706'
                      }}>
                        {doc.status === 'Processed' && <CheckCircle2 size={12} />}
                        {doc.status === 'Failed' && <AlertTriangle size={12} />}
                        {doc.status === 'Processing' && <RefreshCw size={12} className="spin" />}
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {doc.status === 'Processed' ? (
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Zap size={13} color="#00A9C5" /> {doc.elements} items
                        </span>
                      ) : (
                        <span style={{ fontSize: 11.5, color: '#94A3B8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        {doc.status === 'Failed' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleScanTrigger(doc.id); }}
                            style={{ padding: '4px 8px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                          >
                            Re-Scan
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedDrawing(doc); }}
                          style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawing Inspection Drawer */}
      <AnimatePresence>
        {selectedDrawing && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 560, maxHeight: '90vh', background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {selectedDrawing.id} • {selectedDrawing.rev}
                  </span>
                  <h2 style={{ margin: '4px 0 2px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {selectedDrawing.name}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    {selectedDrawing.project} ({selectedDrawing.discipline})
                  </div>
                </div>
                <button onClick={() => setSelectedDrawing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              {/* Sheet Properties */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Drawing Scale</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{selectedDrawing.scale}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Elements Quantified</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#004753', marginTop: 2 }}>{selectedDrawing.elements} items</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>File Size</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{selectedDrawing.size}</div>
                </div>
              </div>

              {/* Detected CAD Layers */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Detected CAD Blueprint Layers</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedDrawing.layers.map((layer, lIdx) => (
                    <span key={lIdx} style={{ fontSize: 11.5, fontWeight: 700, color: '#004753', background: '#E6F4F7', padding: '4px 10px', borderRadius: 6, border: '1px solid #B3E0E8' }}>
                      ✓ {layer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status or Error Banner */}
              {selectedDrawing.error && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: 12, borderRadius: 8, color: '#DC2626', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} /> {selectedDrawing.error}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                <button onClick={() => setSelectedDrawing(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <a 
                  href="/drawing-scanner"
                  style={{ padding: '7px 16px', background: '#004753', color: 'white', borderRadius: 6, fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Open in AI Detect Workspace <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Drawing Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Upload Drawing Blueprint Sets
                </h3>
                <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Target Project</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}>
                  <option>Al Wasl Commercial High-Rise</option>
                  <option>Etihad Rail Logistics & Depot Hub</option>
                  <option>Dubai Creek Harbour Towers</option>
                  <option>Zayed National Museum Extension</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Discipline Package</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}>
                  <option>Architectural (IFC)</option>
                  <option>Structural Reinforcement</option>
                  <option>MEP & HVAC Core</option>
                  <option>Civil & Infrastructure</option>
                </select>
              </div>

              <div style={{ background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                <UploadCloud size={28} color="#004753" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Drop DWG, DXF, or Vector PDFs here</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Automatic scale detection (1:50, 1:100, 1:200)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setShowUploadModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Drawings uploaded successfully! Queued for AI element extraction.");
                    setShowUploadModal(false);
                  }} 
                  style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                >
                  Upload & Start AI Scan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
