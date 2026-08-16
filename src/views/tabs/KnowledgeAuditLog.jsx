import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Activity, ShieldAlert, Database, User, 
  Clock, FileText, CheckCircle2, ShieldCheck, XCircle, AlertTriangle, 
  Eye, RefreshCw, Lock
} from 'lucide-react';

const uaeAuditEvents = [
  { id: 'AUD-2026-901', type: 'AI Query', user: 'Eng. Tareq Mansoor', role: 'Lead Engineer (KEO)', action: 'Executed RAG query: "DBC 2021 Cantilever Beam Deflection Limits"', resource: 'Dubai Building Code (DBC)', status: 'Success', ip: '192.168.10.42', date: '14 Aug 2026 14:15' },
  { id: 'AUD-2026-902', type: 'Security Alert', user: 'External Subcontractor', role: 'Trade Subcontractor', action: 'Blocked unauthorized query on confidential BOQ Unit Rates', resource: 'Commercial Pricing Vault', status: 'Blocked', ip: '86.98.112.5', date: '14 Aug 2026 11:30' },
  { id: 'AUD-2026-903', type: 'CDE Sync', user: 'System CDE Service', role: 'System Daemon', action: 'Vector ingestion completed for Autodesk ACC Level 04 drawings (1,280 vectors)', resource: 'Autodesk ACC', status: 'Success', ip: 'Internal Cloud', date: '14 Aug 2026 08:00' },
  { id: 'AUD-2026-904', type: 'AI Query', user: 'Sarah Al Qasimi', role: 'Legal Counsel', action: 'Queried contemporary delay records under FIDIC Clause 20.1', resource: 'FIDIC Red Book Corpus', status: 'Success', ip: '192.168.10.88', date: '13 Aug 2026 16:40' },
  { id: 'AUD-2026-905', type: 'Permission Change', user: 'Project Director', role: 'PMO Admin', action: 'Updated RBAC policy: Granted QA/QC Lead Edit Access to Mill Test Certs', resource: 'RBAC Policy Matrix', status: 'Success', ip: '192.168.10.12', date: '13 Aug 2026 10:20' },
  { id: 'AUD-2026-906', type: 'AI Query', user: 'John Smith', role: 'QA/QC Inspector', action: 'Retrieved concrete cover standards for coastal marine piles (EN 206)', resource: 'AWT Concrete Specs', status: 'Success', ip: '192.168.10.55', date: '12 Aug 2026 15:10' },
];

export const KnowledgeAuditLog = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = uaeAuditEvents.filter(evt => {
    const matchesFilter = filter === 'All' || evt.type === filter || evt.status === filter;
    const matchesSearch = evt.action.toLowerCase().includes(search.toLowerCase()) || 
                          evt.user.toLowerCase().includes(search.toLowerCase()) ||
                          evt.resource.toLowerCase().includes(search.toLowerCase()) ||
                          evt.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Knowledge Base System & AI Audit Log
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Immutable cryptographic audit trail recording all RAG queries, security blocks, CDE sync events, and permission modifications
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => alert("Exporting Audit Trail to CSV file...")}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export Audit CSV
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
                placeholder="Search audit ID, user, action, resource..." 
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
              <option value="All">All Audit Events</option>
              <option value="AI Query">AI RAG Queries</option>
              <option value="Security Alert">Security Alerts</option>
              <option value="CDE Sync">CDE Syncs</option>
              <option value="Permission Change">Permission Changes</option>
              <option value="Blocked">Blocked Attempts</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredEvents.length} Immutable Log Entries
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Audit ID</th>
                <th style={{ padding: '12px 16px' }}>Event Type</th>
                <th style={{ padding: '12px 16px' }}>User & Persona</th>
                <th style={{ padding: '12px 16px' }}>Action & Description</th>
                <th style={{ padding: '12px 16px' }}>Target Resource</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr 
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {evt.id}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10,
                      background: evt.type === 'Security Alert' ? '#FEE2E2' : evt.type === 'AI Query' ? 'rgba(0, 169, 197, 0.1)' : '#F1F5F9',
                      color: evt.type === 'Security Alert' ? '#DC2626' : evt.type === 'AI Query' ? '#00A9C5' : '#081E3C'
                    }}>
                      {evt.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{evt.user}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{evt.role}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#081E3C', maxWidth: 320 }} className="truncate">
                    {evt.action}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#004753', fontWeight: 700 }}>
                    {evt.resource}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12 }}>
                    <div>{evt.date}</div>
                    <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{evt.ip}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: evt.status === 'Success' ? '#ECFDF5' : '#FEF2F2',
                      color: evt.status === 'Success' ? '#059669' : '#DC2626'
                    }}>
                      {evt.status === 'Success' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 520, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>{selectedEvent.id} • {selectedEvent.type}</span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>Audit Event Details</h3>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#081E3C' }}>
                <div><strong>Action:</strong> {selectedEvent.action}</div>
                <div><strong>Signatory / User:</strong> {selectedEvent.user} ({selectedEvent.role})</div>
                <div><strong>Target Knowledge Resource:</strong> {selectedEvent.resource}</div>
                <div><strong>Origin IP & Host:</strong> {selectedEvent.ip}</div>
                <div><strong>Timestamp:</strong> {selectedEvent.date}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setSelectedEvent(null)} style={{ padding: '7px 16px', background: '#004753', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
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
