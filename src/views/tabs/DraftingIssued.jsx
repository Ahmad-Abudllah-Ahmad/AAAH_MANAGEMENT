import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, CheckCircle2, FileSignature, 
  Send, Copy, Eye, Lock, ShieldCheck, ExternalLink, Calendar, Building
} from 'lucide-react';

const uaeIssuedDocuments = [
  { id: 'DOC-DXB-2026-0891', title: 'Main Package Subcontract Execution Agreement', project: 'Al Wasl Commercial High-Rise', type: 'Contract', recipient: 'Dutco Balfour Beatty LLC', date: '14 Aug 2026 14:30', status: 'Issued', signed: true, size: '4.2 MB', refNo: 'KEO-DBB-CNT-01' },
  { id: 'DOC-AUH-2026-0892', title: 'Technical RFI #441 Response (Track Alignment)', project: 'Etihad Rail Logistics & Depot Hub', type: 'RFI', recipient: 'Parsons Overseas Limited', date: '12 Aug 2026 09:15', status: 'Issued', signed: true, size: '1.8 MB', refNo: 'ER-RFI-RES-441' },
  { id: 'DOC-DXB-2026-0893', title: 'Site Material Inspection Certificate (Curtain Wall Low-E)', project: 'Dubai Creek Harbour Towers', type: 'Certificate', recipient: 'Dubai Municipality Building Dept', date: '10 Aug 2026 11:00', status: 'Issued', signed: true, size: '2.5 MB', refNo: 'DM-MIR-2026-902' },
  { id: 'DOC-AUH-2026-0894', title: 'Site Variation Order VO-11 (HVAC Chilled Water)', project: 'Zayed National Museum Extension', type: 'Variation Order', recipient: 'DCT Abu Dhabi / Foster + Partners', date: '08 Aug 2026 16:45', status: 'Issued', signed: true, size: '3.1 MB', refNo: 'ZNM-VO-011' },
  { id: 'DOC-SHJ-2026-0895', title: 'Interim Payment Certificate IPC-08 (AED 3.45M)', project: 'Sharjah Sustainable City Phase 3', type: 'Payment Cert', recipient: 'Commercial Bank of Dubai / Finance', date: '05 Aug 2026 17:00', status: 'Issued', signed: true, size: '1.2 MB', refNo: 'SSC-IPC-008' },
  { id: 'DOC-DWC-2026-0896', title: 'Civil Works Method Statement & Safety Plan (RAMS)', project: 'Al Maktoum Int Airport Logistics Park', type: 'Compliance', recipient: 'Dubai Aviation Engineering Projects (DAEP)', date: '02 Aug 2026 08:30', status: 'Issued', signed: true, size: '8.4 MB', refNo: 'DAEP-MS-CIV-04' },
];

export const DraftingIssued = () => {
  const [issuedDocsList, setIssuedDocsList] = useState(uaeIssuedDocuments);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredDocs = issuedDocsList.filter(doc => {
    const matchesFilter = filter === 'All' || doc.type === filter;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.id.toLowerCase().includes(search.toLowerCase()) || 
                          doc.recipient.toLowerCase().includes(search.toLowerCase()) ||
                          doc.project.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Issued Documents & Legal Transmittals
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Finalized contracts, approved RFIs, and certificates distributed to stakeholders with cryptographic audit hashes
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Exporting Transmittal Document Log to Excel...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export Transmittal Log
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 320, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search ID, title, recipient, project..." 
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
              <option value="All">All Document Types</option>
              <option value="Contract">Contract</option>
              <option value="RFI">RFI Response</option>
              <option value="Variation Order">Variation Order</option>
              <option value="Certificate">Certificate</option>
              <option value="Payment Cert">Payment Cert</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredDocs.length} Issued Documents
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Document ID & Ref</th>
                <th style={{ padding: '12px 16px' }}>Title</th>
                <th style={{ padding: '12px 16px' }}>Project</th>
                <th style={{ padding: '12px 16px' }}>Recipient Stakeholder</th>
                <th style={{ padding: '12px 16px' }}>Issue Date</th>
                <th style={{ padding: '12px 16px' }}>Verification Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#004753' }}>{doc.id}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{doc.refNo}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{doc.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 600 }}>{doc.project}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>{doc.recipient}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>{doc.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: '#ECFDF5', color: '#059669'
                    }}>
                      <CheckCircle2 size={12} /> Stamped & Signed
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Downloading PDF: ${doc.title} (${doc.size})...`); }}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Transmittal Details Modal */}
      <AnimatePresence>
        {selectedDoc && (
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
                    {selectedDoc.id} • {selectedDoc.type}
                  </span>
                  <h2 style={{ margin: '4px 0 2px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {selectedDoc.title}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    {selectedDoc.project} • Issued {selectedDoc.date}
                  </div>
                </div>
                <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Recipient Entity</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{selectedDoc.recipient}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Official Reference</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#004753', marginTop: 2 }}>{selectedDoc.refNo}</div>
                </div>
              </div>

              <div style={{ background: '#ECFDF5', padding: 12, borderRadius: 8, border: '1px solid #A7F3D0', color: '#065F46', fontSize: 12 }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <ShieldCheck size={16} color="#059669" /> Digital Signature Certificate (UAE PASS Verified)
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#047857' }}>
                  SHA-256: 8f4a2b91c0e3d7491823abf10928374619827364501928374651928374615201
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setSelectedDoc(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <button 
                  onClick={() => alert(`Downloading signed PDF package for ${selectedDoc.title}...`)}
                  style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
                >
                  <Download size={13} /> Download Stamped PDF ({selectedDoc.size})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
