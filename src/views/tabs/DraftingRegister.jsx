import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, BookOpen, Clock, FileText, CheckCircle2, 
  History, AlertTriangle, Layers, Maximize2, Check, ExternalLink, RefreshCw
} from 'lucide-react';

const uaeMdrData = [
  { id: 'MDR-DXB-001', docNo: 'AWT-STR-DWG-0012', title: 'Level 04 Structural Rebar & Column Schedule', project: 'Al Wasl Commercial High-Rise', rev: 'Rev C', status: 'Approved for Construction (IFC)', date: '14 Aug 2026', discipline: 'Structural' },
  { id: 'MDR-DXB-002', docNo: 'AWT-ARC-SPEC-0992', title: 'Curtain Wall Facade & Glazing Technical Spec', project: 'Al Wasl Commercial High-Rise', rev: 'Rev B', status: 'Under Review', date: '12 Aug 2026', discipline: 'Architectural' },
  { id: 'MDR-AUH-003', docNo: 'ERH-MEP-SCH-0044', title: 'Central Chiller Plant Mechanical Equipment Schedule', project: 'Etihad Rail Logistics Hub', rev: 'Rev A', status: 'Issued for Review', date: '10 Aug 2026', discipline: 'Mechanical' },
  { id: 'MDR-AUH-004', docNo: 'ERH-CIV-PLN-0100', title: 'Track Alignment Stormwater Drainage & Grading', project: 'Etihad Rail Logistics Hub', rev: 'Rev D', status: 'Approved for Construction (IFC)', date: '08 Aug 2026', discipline: 'Civil' },
  { id: 'MDR-DXB-005', docNo: 'DCH-ELE-DWG-0402', title: 'High-Voltage Transformer Substation Layout', project: 'Dubai Creek Harbour Towers', rev: 'Rev B', status: 'Approved for Construction (IFC)', date: '05 Aug 2026', discipline: 'Electrical' },
  { id: 'MDR-AUH-006', docNo: 'ZNM-ARC-DWG-0220', title: 'Curved Falcon Wing Facade Cladding Elevations', project: 'Zayed National Museum Extension', rev: 'Rev C', status: 'Approved for Construction (IFC)', date: '01 Aug 2026', discipline: 'Architectural' },
  { id: 'MDR-SHJ-007', docNo: 'SSC-PLM-DWG-0311', title: 'Solar PV Hot Water Distribution Isometrics', project: 'Sharjah Sustainable City Phase 3', rev: 'Rev B', status: 'Under Review', date: '28 Jul 2026', discipline: 'Plumbing' },
];

export const DraftingRegister = () => {
  const [mdrList, setMdrList] = useState(uaeMdrData);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredData = mdrList.filter(doc => {
    const matchesDiscipline = filter === 'All' || doc.discipline === filter;
    const matchesSearch = doc.docNo.toLowerCase().includes(search.toLowerCase()) || 
                          doc.title.toLowerCase().includes(search.toLowerCase()) ||
                          doc.project.toLowerCase().includes(search.toLowerCase());
    return matchesDiscipline && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Master Document Register (MDR)
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Centralized project register indexing drawings, specifications, calculations, and revision history
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Exporting Master Document Register to Excel spreadsheet...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export MDR (Excel)
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search Document No, Title, or Project..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Disciplines</option>
              <option value="Architectural">Architectural</option>
              <option value="Structural">Structural</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Civil">Civil</option>
              <option value="Plumbing">Plumbing</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredData.length} Controlled MDR Items
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>MDR ID</th>
                <th style={{ padding: '12px 16px' }}>Document Number</th>
                <th style={{ padding: '12px 16px' }}>Document Title</th>
                <th style={{ padding: '12px 16px' }}>Project</th>
                <th style={{ padding: '12px 16px' }}>Discipline</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Rev</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((doc) => (
                <tr 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {doc.id}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#081E3C' }}>
                    {doc.docNo}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#081E3C' }}>
                    {doc.title}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>{doc.project}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
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
                      padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: doc.status.includes('Approved') ? '#ECFDF5' : '#FEF3C7',
                      color: doc.status.includes('Approved') ? '#059669' : '#D97706'
                    }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
