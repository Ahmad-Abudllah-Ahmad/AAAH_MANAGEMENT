import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, HardHat, AlertTriangle, ShieldCheck, 
  Download, Plus, Clock, TrendingUp, CheckCircle2, UserCheck, Sun, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const uaeSubcontractors = [
  { id: 'T-01', trade: 'Structural Concrete & Rebar', contractor: 'Arabtec Construction', activeWorkers: 140, maxAllowed: 150, status: 'Optimal', supervisor: 'Eng. Tareq (Site Eng)', mohreCompliant: '100% Verified', badgeId: 'ARB-882' },
  { id: 'T-02', trade: 'Mechanical & Plumbing MEP', contractor: 'Dutco Balfour Beatty MEP', activeWorkers: 85, maxAllowed: 90, status: 'Optimal', supervisor: 'Rashid Khan (MEP Lead)', mohreCompliant: '100% Verified', badgeId: 'DBB-104' },
  { id: 'T-03', trade: 'Substructure & Piling', contractor: 'Six Construct JV', activeWorkers: 42, maxAllowed: 40, status: 'Overcrowded', supervisor: 'Jean-Luc (Civil Lead)', mohreCompliant: '100% Verified', badgeId: 'SIX-049' },
  { id: 'T-04', trade: 'Unitized Facade & Glazing', contractor: 'Schüco Middle East', activeWorkers: 35, maxAllowed: 50, status: 'Optimal', supervisor: 'F. Al Mansoori', mohreCompliant: '100% Verified', badgeId: 'SCH-301' },
  { id: 'T-05', trade: 'Electrical & HV Substations', contractor: 'Al Naboodah Electrical', activeWorkers: 28, maxAllowed: 35, status: 'Optimal', supervisor: 'S. O\'Connor', mohreCompliant: '100% Verified', badgeId: 'NAB-192' },
  { id: 'T-06', trade: 'Client PMO & Supervision', contractor: 'KEO International Consultants', activeWorkers: 12, maxAllowed: 15, status: 'Optimal', supervisor: 'Project Director', mohreCompliant: '100% Verified', badgeId: 'KEO-001' },
];

const headcountCurve = [
  { time: '05:30 GST', workers: 35 },
  { time: '07:00 GST', workers: 180 },
  { time: '09:00 GST', workers: 320 },
  { time: '11:30 GST', workers: 342 },
  { time: '12:30 GST', workers: 0 }, // Midday Break
  { time: '15:00 GST', workers: 335 },
  { time: '17:30 GST', workers: 190 },
  { time: '19:00 GST', workers: 45 },
];

export const SitePersonnel = () => {
  const [search, setSearch] = useState('');
  const [personnelList, setPersonnelList] = useState(uaeSubcontractors);

  const filteredPersonnel = personnelList.filter(p => 
    p.trade.toLowerCase().includes(search.toLowerCase()) || 
    p.contractor.toLowerCase().includes(search.toLowerCase()) ||
    p.supervisor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Workforce Biometrics & Density Tracking
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Real-time turnstile headcount, trade crowd density, and UAE MOHRE Midday Break compliance verification
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Register Site Personnel
          </button>
        </div>
      </div>

      {/* UAE MOHRE Midday Break Compliance Banner */}
      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sun size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#065F46' }}>
              UAE MOHRE Midday Break Regulation Active (12:30 PM – 03:00 PM GST)
            </div>
            <div style={{ fontSize: 11.5, color: '#047857' }}>
              AI thermal cameras verify 0 outdoor workers during mandated summer shaded rest hours. 100% Compliant today.
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 900, background: '#065F46', color: 'white', padding: '4px 10px', borderRadius: 6 }}>
          OSHAD AUDIT PASSED
        </span>
      </div>

      {/* Row 1: Headcount Curve & Trade Breakdown (60% / 40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 280 }}>
        
        {/* Headcount Ingress/Egress Chart (60%) */}
        <div style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Live Biometric Headcount Curve (Today)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Gate 01 & Gate 02 speed-gate turnstile entries with midday break drop
              </p>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: '#004753', background: 'rgba(0, 71, 83, 0.08)', padding: '4px 10px', borderRadius: 6 }}>
              342 Active On-Site
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={headcountCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="workerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004753" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#004753" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10.5, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    formatter={(val) => [`${val} Workers`, 'On Site']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontWeight: 700 }} 
                  />
                  <Area type="monotone" dataKey="workers" stroke="#004753" strokeWidth={2.5} fillOpacity={1} fill="url(#workerGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trade Density Bars (40%) */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
            Trade Density Capacity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            {personnelList.slice(0, 4).map((p) => {
              const pct = Math.round((p.activeWorkers / p.maxAllowed) * 100);
              const isOver = pct > 100;
              return (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#081E3C' }}>
                    <span>{p.contractor}</span>
                    <span style={{ color: isOver ? '#DC2626' : '#004753' }}>{p.activeWorkers} / {p.maxAllowed}</span>
                  </div>
                  <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: isOver ? '#DC2626' : '#004753' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 2: Subcontractor Muster & Biometrics Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search contractor, trade, supervisor..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredPersonnel.length} Subcontractor Trade Packages Active
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Trade Package & Contractor</th>
                <th style={{ padding: '12px 16px' }}>On-Site Headcount</th>
                <th style={{ padding: '12px 14px' }}>Max Density Limit</th>
                <th style={{ padding: '12px 16px' }}>Lead Site Supervisor</th>
                <th style={{ padding: '12px 16px' }}>MOHRE Status</th>
                <th style={{ padding: '12px 16px' }}>Density Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonnel.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{p.contractor}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{p.trade} • {p.badgeId}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 900, color: '#081E3C', fontSize: 14 }}>{p.activeWorkers} Workers</td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{p.maxAllowed} Max</td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 700 }}>{p.supervisor}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                      {p.mohreCompliant}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: p.status === 'Optimal' ? '#ECFDF5' : '#FEF2F2',
                      color: p.status === 'Optimal' ? '#059669' : '#DC2626'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={() => alert(`Conducting digital muster roll for ${p.contractor}...`)}
                      style={{ padding: '4px 10px', background: 'rgba(0, 71, 83, 0.06)', border: 'none', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Muster Check
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
