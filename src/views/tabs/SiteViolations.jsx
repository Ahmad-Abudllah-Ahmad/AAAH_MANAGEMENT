import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, AlertTriangle, ShieldAlert, CheckCircle2, Video, 
  HardHat, Camera, XCircle, MoreVertical, Maximize2, User, Eye, Download, Check
} from 'lucide-react';

const uaeViolations = [
  { 
    id: 'V-1042', 
    type: 'Missing PPE (Hard Hat & High-Vis)', 
    location: 'Zone A — East Tower Level 24 Edge', 
    time: '10:42 AM Today', 
    severity: 'Critical', 
    status: 'Unresolved', 
    contractor: 'Arabtec Structural',
    assignee: 'Eng. Tareq (Lead HSE)', 
    fineAED: 'AED 2,500',
    confidence: '98.4%',
    details: 'Worker observed 1.2m from slab edge without chin-strap hard hat and EN 471 high-visibility vest.'
  },
  { 
    id: 'V-1041', 
    type: 'Suspended Load Zone Intrusion', 
    location: 'Zone C — Crane 01 Hook Radius', 
    time: '09:15 AM Today', 
    severity: 'Critical', 
    status: 'Resolved', 
    contractor: 'Dutco MEP',
    assignee: 'Site Safety Officer', 
    fineAED: 'AED 5,000',
    confidence: '99.1%',
    details: '2 workers entered active 15m radius geo-fence during 4.2-ton chiller hoist operation.'
  },
  { 
    id: 'V-1040', 
    type: 'Vehicle Overspeeding in Site Lane', 
    location: 'Zone D — Concrete Batching Bay', 
    time: '08:30 AM Today', 
    severity: 'Medium', 
    status: 'Resolved', 
    contractor: 'Unimix Concrete',
    assignee: 'Gate Marshall', 
    fineAED: 'AED 1,000',
    confidence: '96.2%',
    details: 'Transit Mixer plate DXB-8921 recorded at 28 km/h in designated 15 km/h pedestrian crossing corridor.'
  },
  { 
    id: 'V-1039', 
    type: 'Working at Height Lanyard Unlatched', 
    location: 'Zone A — Facade Hanging Cradle 03', 
    time: '07:45 AM Today', 
    severity: 'Critical', 
    status: 'Unresolved', 
    contractor: 'Schüco Facade JV',
    assignee: 'HSE Manager', 
    fineAED: 'AED 5,000',
    confidence: '97.8%',
    details: 'Facade installer full-body harness lifeline not connected to anchor lifeline rope grab.'
  },
  { 
    id: 'V-1038', 
    type: 'Hot Works Fire Watch Deficit', 
    location: 'Zone B — Basement 01 Rebar Shop', 
    time: 'Yesterday 04:15 PM', 
    severity: 'High', 
    status: 'Resolved', 
    contractor: 'Six Construct',
    assignee: 'Safety Officer 2', 
    fineAED: 'AED 3,000',
    confidence: '95.5%',
    details: 'Oxy-acetylene cutting performed with CO2 fire extinguisher located >10m away from spark zone.'
  },
  { 
    id: 'V-1037', 
    type: 'Emergency Egress Corridor Blockage', 
    location: 'Zone C — Logistics Stairwell S-02', 
    time: 'Yesterday 02:10 PM', 
    severity: 'Medium', 
    status: 'Resolved', 
    contractor: 'Al Naboodah MEP',
    assignee: 'Logistics Lead', 
    fineAED: 'AED 1,500',
    confidence: '94.0%',
    details: '3 pallets of AAC blocks stacked obstructing fire escape doorway width.'
  },
];

export const SiteViolations = () => {
  const [violationsList, setViolationsList] = useState(uaeViolations);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedViolation, setSelectedViolation] = useState(null);

  const filteredViolations = violationsList.filter(v => 
    (filterSeverity === 'All' || v.severity === filterSeverity) &&
    (v.type.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase()) || v.contractor.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id) => {
    setViolationsList(violationsList.map(v => v.id === id ? { ...v, status: v.status === 'Resolved' ? 'Unresolved' : 'Resolved' } : v));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            AI Safety Violations & Regulatory Incident Log
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Automated neural detection of PPE infractions, geo-fencing breaches, OSHAD citations, and contractor fines
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Broadcasting site-wide emergency safety alert to all 342 mobile devices...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#FEF2F2', color: '#DC2626', borderRadius: 8, border: '1px solid #FECACA', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
          >
            <ShieldAlert size={15} /> Broadcast Safety Tannoy
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
                placeholder="Search by incident ID, contractor, type..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Fines</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredViolations.length} Detected Incidents
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Incident ID & Type</th>
                <th style={{ padding: '12px 16px' }}>Site Zone & Time</th>
                <th style={{ padding: '12px 16px' }}>Subcontractor</th>
                <th style={{ padding: '12px 14px' }}>Fine Amount</th>
                <th style={{ padding: '12px 14px' }}>AI Confidence</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Evidence & Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((v) => (
                <tr 
                  key={v.id} 
                  onClick={() => setSelectedViolation(v)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: v.severity === 'Critical' ? '#FEF2F2' : '#FFFBEB', color: v.severity === 'Critical' ? '#DC2626' : '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {v.type.includes('PPE') ? <HardHat size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#081E3C' }}>{v.type}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{v.id} • {v.severity}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#081E3C', fontWeight: 600 }}>{v.location}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{v.time}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 700 }}>{v.contractor}</td>
                  <td style={{ padding: '12px 14px', color: '#DC2626', fontWeight: 900 }}>{v.fineAED}</td>
                  <td style={{ padding: '12px 14px', color: '#004753', fontWeight: 800 }}>{v.confidence}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span 
                      onClick={(e) => { e.stopPropagation(); toggleStatus(v.id); }}
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                        background: v.status === 'Resolved' ? '#ECFDF5' : '#FEF2F2',
                        color: v.status === 'Resolved' ? '#059669' : '#DC2626'
                      }}
                    >
                      {v.status === 'Resolved' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedViolation(v); }}
                      style={{ padding: '4px 10px', background: 'rgba(0, 71, 83, 0.06)', border: 'none', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <Camera size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Evidence Inspection Modal */}
      <AnimatePresence>
        {selectedViolation && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 520, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>{selectedViolation.id} • AI Neural Evidence</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {selectedViolation.type}
                  </h3>
                </div>
                <button onClick={() => setSelectedViolation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              {/* Simulated Camera Snapshot with Bounding Box */}
              <div style={{ height: 200, background: '#081E3C', borderRadius: 10, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ width: 140, height: 120, border: '2px solid #DC2626', background: 'rgba(220, 38, 38, 0.15)', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 4 }}>
                  <span style={{ background: '#DC2626', color: 'white', fontSize: 9.5, fontWeight: 800, padding: '2px 4px', borderRadius: 2, alignSelf: 'flex-start' }}>
                    {selectedViolation.type.split(' ')[0]} ({selectedViolation.confidence})
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: 4, color: 'white', fontSize: 10 }}>
                  {selectedViolation.time} • 4K CCTV Frame
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5, color: '#081E3C' }}>
                <div><strong>Location:</strong> {selectedViolation.location}</div>
                <div><strong>Subcontractor:</strong> {selectedViolation.contractor}</div>
                <div><strong>Statutory Fine:</strong> <span style={{ color: '#DC2626', fontWeight: 800 }}>{selectedViolation.fineAED} (OSHAD Regulation)</span></div>
                <div style={{ marginTop: 4, color: '#64748B', fontSize: 12 }}>{selectedViolation.details}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button 
                  onClick={() => { toggleStatus(selectedViolation.id); setSelectedViolation(null); }}
                  style={{ padding: '7px 14px', background: selectedViolation.status === 'Resolved' ? '#FEF2F2' : '#ECFDF5', color: selectedViolation.status === 'Resolved' ? '#DC2626' : '#059669', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  {selectedViolation.status === 'Resolved' ? 'Re-open Incident' : 'Mark as Remediated'}
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setSelectedViolation(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Close
                  </button>
                  <button onClick={() => { alert(`Dispatched formal OSHAD Safety Citation to ${selectedViolation.contractor}`); setSelectedViolation(null); }} style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                    Dispatch Citation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
