import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Calendar, 
  Download, CheckCircle2, Calculator
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';

// Full 12-Month S-Curve EVM Data ($'000s)
const evmTimelineData = [
  { month: 'Jan', pv: 1000, ev: 950, ac: 980, sv: -50, cv: -30, spi: 0.95, cpi: 0.97, driver: 'Site Mobilization & Turnstiles' },
  { month: 'Feb', pv: 2500, ev: 2300, ac: 2450, sv: -200, cv: -150, spi: 0.92, cpi: 0.94, driver: 'Excavation & Dewatering -14m' },
  { month: 'Mar', pv: 4200, ev: 3800, ac: 4100, sv: -400, cv: -300, spi: 0.90, cpi: 0.93, driver: '128 Piles & Raft Concrete' },
  { month: 'Apr', pv: 6000, ev: 5400, ac: 5900, sv: -600, cv: -500, spi: 0.90, cpi: 0.92, driver: 'Substructure B1/B2 Retaining Walls' },
  { month: 'May (Curr)', pv: 8500, ev: 7200, ac: 7800, sv: -1300, cv: -600, spi: 0.85, cpi: 0.92, driver: 'L03 Active Pour & Core Jump #11' },
  { month: 'Jun', pv: 11000, ev: 9500, ac: 10100, sv: -1500, cv: -600, spi: 0.86, cpi: 0.94, driver: 'Podium Steel Frame & L04 Slab' },
  { month: 'Jul (F)', pv: 14500, ev: null, ac: null, eacForecast: 15600, driver: 'Curtain Wall Facade L1–L4' },
  { month: 'Aug (F)', pv: 19000, ev: null, ac: null, eacForecast: 20400, driver: 'Superstructure Core Top-out L24' },
  { month: 'Sep (F)', pv: 24500, ev: null, ac: null, eacForecast: 26200, driver: 'MEP Central Plant Installation' },
  { month: 'Oct (F)', pv: 30000, ev: null, ac: null, eacForecast: 32100, driver: 'Interior Drywall & Vertical Lifts' },
  { month: 'Nov (F)', pv: 35500, ev: null, ac: null, eacForecast: 38000, driver: 'Testing, Commissioning & Facade' },
  { month: 'Dec (F)', pv: 40000, ev: null, ac: null, eacForecast: 42550, driver: 'Civil Handover & TOC Certificate' },
];

export const ProgressEarnedValue = () => {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const CustomEVMTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0F172A', color: 'white', padding: '10px 14px', borderRadius: 8, fontSize: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #334155' }}>
          <div style={{ fontWeight: 800, color: '#38BDF8', marginBottom: 6 }}>{label} 2026 Status</div>
          {payload.map((p) => (
            <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, color: p.color, fontWeight: 700, margin: '2px 0' }}>
              <span>{p.name}:</span>
              <span>${p.value ? (p.value).toLocaleString() : 0}k</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 20, right: 24, zIndex: 999,
              background: '#0F172A', color: 'white', padding: '12px 20px',
              borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 22px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Calculator size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Earned Value Management (EVM Standard ISO 21508)
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                BASELINE REV 03
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12.5, margin: '2px 0 0 0' }}>
              Planned Value (PV) • Earned Value (EV) • Actual Cost (AC) • Estimate at Completion (EAC)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => showToast('Generating Comprehensive EVM Executive Audit Report (PDF/Excel)...')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export EVM Report
          </button>
        </div>
      </div>

      {/* Top 4 EVM Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        
        {/* Planned Value */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Planned Value (PV / BCWS)</span>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>$8.50M</div>
            </div>
            <div style={{ padding: 8, background: '#F1F5F9', borderRadius: 8, color: '#475569' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
            Budgeted cost of work scheduled
          </div>
        </div>

        {/* Earned Value */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #FED7AA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Earned Value (EV / BCWP)</span>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>$7.20M</div>
            </div>
            <div style={{ padding: 8, background: '#FFFBEB', borderRadius: 8, color: '#D97706' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
            Schedule Variance (SV): -$1.30M (SPI 0.85)
          </div>
        </div>

        {/* Actual Cost */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Actual Cost (AC / ACWP)</span>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>$7.80M</div>
            </div>
            <div style={{ padding: 8, background: '#FEF2F2', borderRadius: 8, color: '#DC2626' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
            Cost Variance (CV): -$600k (CPI 0.92)
          </div>
        </div>

        {/* Forecast at Completion */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', padding: '16px 18px', borderRadius: 12, border: '1px solid #C7D2FE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Estimate at Completion (EAC)</span>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#4F46E5', marginTop: 4 }}>$42.55M</div>
            </div>
            <div style={{ padding: 8, background: '#EEF2FF', borderRadius: 8, color: '#4F46E5' }}>
              <Calculator size={18} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
            Variance at Completion (VAC): -$2.55M
          </div>
        </div>

      </div>

      {/* S-Curve Tracking Chart (Full Width & Responsive) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', minHeight: 380 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cumulative S-Curve Performance & EAC Forecast Curve
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B' }}>Baseline Rev 03 ($40.0M) vs Current Actuals ($7.8M) vs Forecast ($42.55M)</span>
          </div>

          <div style={{ display: 'flex', gap: 14, fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: '#94A3B8' }}>- - Planned Value (PV)</span>
            <span style={{ color: '#00A86B' }}>— Earned Value (EV)</span>
            <span style={{ color: '#DC2626' }}>— Actual Cost (AC)</span>
            <span style={{ color: '#00A9C5' }}>··· EAC Forecast</span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 280, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evmTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}M`} />
              <Tooltip content={<CustomEVMTooltip />} />
              <ReferenceLine x="May (Curr)" stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Data Date W21', fill: '#DC2626', fontSize: 10, position: 'top' }} />

              <Line type="monotone" dataKey="pv" name="Planned Value" stroke="#94A3B8" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="ev" name="Earned Value" stroke="#00A86B" strokeWidth={3} dot={{ r: 4, fill: '#00A86B' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ac" name="Actual Cost" stroke="#DC2626" strokeWidth={3} dot={{ r: 4, fill: '#DC2626' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="eacForecast" name="EAC Forecast" stroke="#00A9C5" strokeWidth={2.5} strokeDasharray="3 3" dot={{ r: 3, fill: '#00A9C5' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month-by-Month EVM Performance Table */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Period EVM Performance Matrix
          </h3>
          <span style={{ fontSize: 11, color: '#64748B' }}>Values in USD Thousands ($'000)</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', fontSize: 10.5, textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 12px' }}>Period</th>
                <th style={{ padding: '8px 10px' }}>PV ($k)</th>
                <th style={{ padding: '8px 10px' }}>EV ($k)</th>
                <th style={{ padding: '8px 10px' }}>AC ($k)</th>
                <th style={{ padding: '8px 10px' }}>Schedule Var (SV)</th>
                <th style={{ padding: '8px 10px' }}>Cost Var (CV)</th>
                <th style={{ padding: '8px 10px' }}>SPI</th>
                <th style={{ padding: '8px 10px' }}>CPI</th>
                <th style={{ padding: '8px 12px' }}>Key Activity Driver</th>
              </tr>
            </thead>
            <tbody>
              {evmTimelineData.filter(d => d.ev !== null).map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', background: row.month.includes('Curr') ? '#F0FDF4' : 'transparent' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0F172A' }}>
                    {row.month}
                  </td>
                  <td style={{ padding: '10px 10px', color: '#64748B', fontWeight: 600 }}>${row.pv}k</td>
                  <td style={{ padding: '10px 10px', color: '#10B981', fontWeight: 700 }}>${row.ev}k</td>
                  <td style={{ padding: '10px 10px', color: '#EF4444', fontWeight: 700 }}>${row.ac}k</td>
                  <td style={{ padding: '10px 10px', color: row.sv < 0 ? '#DC2626' : '#10B981', fontWeight: 700 }}>
                    {row.sv < 0 ? `-$${Math.abs(row.sv)}k` : `+$${row.sv}k`}
                  </td>
                  <td style={{ padding: '10px 10px', color: row.cv < 0 ? '#DC2626' : '#10B981', fontWeight: 700 }}>
                    {row.cv < 0 ? `-$${Math.abs(row.cv)}k` : `+$${row.cv}k`}
                  </td>
                  <td style={{ padding: '10px 10px', fontWeight: 800, color: row.spi < 0.90 ? '#DC2626' : '#D97706' }}>
                    {row.spi}
                  </td>
                  <td style={{ padding: '10px 10px', fontWeight: 800, color: row.cpi < 0.95 ? '#D97706' : '#10B981' }}>
                    {row.cpi}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#475569', fontSize: 11.5 }}>
                    {row.driver}
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
