import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, ShieldCheck, AlertTriangle, UserPlus, 
  CheckCircle2, ChevronRight, BarChart2, FileCheck, Phone, Mail, 
  MapPin, Shield, Check, X, Award, ExternalLink, Calendar
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { StatusPill } from '../../components/ui';

const initialSuppliers = [
  { 
    id: 'V-1001', 
    name: 'Al Noor Building Materials LLC', 
    trn: '100492817200003',
    contact: 'billing@alnoor-materials.ae', 
    phone: '+971 6 534 8812',
    location: 'Industrial Area 2, Sharjah, UAE',
    invoices: 142, 
    trustScore: 98, 
    status: 'Verified',
    tradeLicenseExpiry: '2027-04-15',
    activePoCount: 4,
    ytdSpend: '4,850,200 AED'
  },
  { 
    id: 'V-1002', 
    name: 'Gulf Ready Mix Concrete LLC', 
    trn: '100293847500003',
    contact: 'accounts@gulfreadymix.com', 
    phone: '+971 4 340 1290',
    location: 'Al Quoz Industrial 3, Dubai, UAE',
    invoices: 86, 
    trustScore: 99, 
    status: 'Verified',
    tradeLicenseExpiry: '2026-11-30',
    activePoCount: 6,
    ytdSpend: '8,240,000 AED'
  },
  { 
    id: 'V-1003', 
    name: 'Emirates Steel Industries PJSC', 
    trn: '100918273600003',
    contact: 'finance@emirates-steel.ae', 
    phone: '+971 2 550 0000',
    location: 'ICAD 1, Musaffah, Abu Dhabi, UAE',
    invoices: 210, 
    trustScore: 99, 
    status: 'Verified',
    tradeLicenseExpiry: '2028-01-01',
    activePoCount: 8,
    ytdSpend: '16,900,000 AED'
  },
  { 
    id: 'V-1004', 
    name: 'Fast Fixings Ltd', 
    trn: '100827364500003',
    contact: 'finance@fastfixings.ae', 
    phone: '+971 4 884 1920',
    location: 'Jebel Ali Free Zone, Dubai, UAE',
    invoices: 34, 
    trustScore: 68, 
    status: 'Probation',
    tradeLicenseExpiry: '2026-09-15',
    activePoCount: 2,
    ytdSpend: '480,000 AED'
  },
  { 
    id: 'V-1005', 
    name: 'Dutco Formwork Solutions', 
    trn: '100736452800003',
    contact: 'billing@dutco-formwork.com', 
    phone: '+971 4 338 5544',
    location: 'Ras Al Khor, Dubai, UAE',
    invoices: 45, 
    trustScore: 94, 
    status: 'Verified',
    tradeLicenseExpiry: '2027-08-20',
    activePoCount: 3,
    ytdSpend: '3,120,000 AED'
  },
  { 
    id: 'V-1006', 
    name: 'Logistics Pro Haulage LLC', 
    trn: '100645281900003',
    contact: 'accounts@logistics-pro.ae', 
    phone: '+971 4 285 9931',
    location: 'Al Aweer, Dubai, UAE',
    invoices: 56, 
    trustScore: 88, 
    status: 'Verified',
    tradeLicenseExpiry: '2026-12-10',
    activePoCount: 2,
    ytdSpend: '950,000 AED'
  },
  { 
    id: 'V-1007', 
    name: 'Unmatched Vendor TRN', 
    trn: 'Pending Verification',
    contact: 'N/A', 
    phone: 'N/A',
    location: 'Pending Address',
    invoices: 2, 
    trustScore: 24, 
    status: 'Flagged',
    tradeLicenseExpiry: 'Expired',
    activePoCount: 0,
    ytdSpend: '0 AED'
  }
];

const chartData = [
  { name: 'Jan', processed: 45, exceptions: 2 },
  { name: 'Feb', processed: 52, exceptions: 1 },
  { name: 'Mar', processed: 38, exceptions: 4 },
  { name: 'Apr', processed: 65, exceptions: 2 },
  { name: 'May', processed: 48, exceptions: 1 },
  { name: 'Jun', processed: 72, exceptions: 3 },
];

export const OcrSuppliers = () => {
  const [suppliersList, setSuppliersList] = useState(initialSuppliers);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeSupplier, setActiveSupplier] = useState(suppliersList[0]);
  
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorTrn, setNewVendorTrn] = useState('');
  const [newVendorContact, setNewVendorContact] = useState('');

  const filteredSuppliers = suppliersList.filter(s => 
    (filter === 'All' || s.status === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.trn.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;
    const newVendor = {
      id: `V-${1000 + suppliersList.length + 1}`,
      name: newVendorName.trim(),
      trn: newVendorTrn.trim() || '100881928300003',
      contact: newVendorContact.trim() || 'accounts@newvendor.ae',
      phone: '+971 4 990 0000',
      location: 'Dubai, UAE',
      invoices: 1,
      trustScore: 90,
      status: 'Verified',
      tradeLicenseExpiry: '2027-12-31',
      activePoCount: 1,
      ytdSpend: '0 AED'
    };
    setSuppliersList([newVendor, ...suppliersList]);
    setActiveSupplier(newVendor);
    setShowOnboardModal(false);
    setNewVendorName('');
    setNewVendorTrn('');
    setNewVendorContact('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C' }}>
            Supplier Directory & Trust Intelligence
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Vendor compliance scoring, UAE FTA TRN validation, and historical OCR extraction accuracy tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowOnboardModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <UserPlus size={15} /> Onboard New Supplier
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 560 }}>
        
        {/* Left List Pane */}
        <div style={{ flex: '0 0 380px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '8px 12px', borderRadius: 8, marginBottom: 10, border: '1px solid #E2E8F0' }}>
              <Search size={15} color="#64748B" />
              <input 
                type="text" 
                placeholder="Search supplier, TRN..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#081E3C', fontWeight: 500 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Verified', 'Probation', 'Flagged'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: filter === f ? 'var(--gradient-brand)' : '#F1F5F9',
                    color: filter === f ? 'white' : '#64748B',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: filter === f ? '0 2px 8px rgba(0, 71, 83, 0.25)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {filteredSuppliers.map((item) => {
              const isSelected = activeSupplier.id === item.id;
              return (
                <div 
                  key={item.id} 
                  onClick={() => setActiveSupplier(item)}
                  style={{ 
                    padding: '14px 16px', 
                    borderBottom: '1px solid #F1F5F9', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s',
                    background: isSelected ? '#F0F8FA' : 'white',
                    borderLeft: isSelected ? '4px solid #00A9C5' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#004753' : '#081E3C' }}>{item.name}</div>
                    <span style={{ 
                      fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12,
                      background: item.status === 'Verified' ? '#DCFCE7' : item.status === 'Flagged' ? '#FEE2E2' : '#FEF3C7',
                      color: item.status === 'Verified' ? '#15803D' : item.status === 'Flagged' ? '#B91C1C' : '#B45309'
                    }}>
                      {item.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 8 }}>
                    TRN: {item.trn}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>{item.invoices} Invoices Processed</span>
                    <span style={{ fontWeight: 800, color: item.trustScore > 90 ? '#00A86B' : item.trustScore > 70 ? '#D97706' : '#DC2626' }}>
                      Trust: {item.trustScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          
          {/* Supplier Profile Card */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, background: '#E6F4F7', color: '#004753', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#081E3C' }}>{activeSupplier.name}</h2>
                    <span style={{ fontSize: 11, background: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>
                      FTA COMPLIANT
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 4 }}>
                    Supplier ID: <strong>{activeSupplier.id}</strong> • TRN: <strong>{activeSupplier.trn}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: activeSupplier.trustScore > 90 ? '#00A86B' : activeSupplier.trustScore > 70 ? '#D97706' : '#DC2626', lineHeight: 1 }}>
                  {activeSupplier.trustScore}%
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, marginTop: 4 }}>AI Optical Trust Score</div>
              </div>
            </div>

            {/* Quick Contact & License Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
                <Mail size={14} color="#004753" /> {activeSupplier.contact}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
                <Phone size={14} color="#004753" /> {activeSupplier.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
                <Calendar size={14} color="#004753" /> License Expiry: <strong>{activeSupplier.tradeLicenseExpiry}</strong>
              </div>
            </div>

            {/* Spend & Volume Stats */}
            <div style={{ display: 'flex', gap: 14, borderTop: '1px solid #E2E8F0', paddingTop: 20, marginTop: 20 }}>
              <div style={{ flex: 1, background: '#F0F8FA', padding: 14, borderRadius: 10, border: '1px solid #D9EEF1' }}>
                <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>YTD PROJECT SPEND</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{activeSupplier.ytdSpend}</div>
              </div>
              <div style={{ flex: 1, background: '#F0F8FA', padding: 14, borderRadius: 10, border: '1px solid #D9EEF1' }}>
                <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>ACTIVE SUBCONTRACT POs</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#081E3C', marginTop: 2 }}>{activeSupplier.activePoCount} Purchase Orders</div>
              </div>
              <div style={{ flex: 1, background: '#F0F8FA', padding: 14, borderRadius: 10, border: '1px solid #D9EEF1' }}>
                <div style={{ fontSize: 11, color: '#00556A', fontWeight: 700 }}>FIRST-PASS MATCH RATE</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#00A86B', marginTop: 2 }}>{(activeSupplier.trustScore * 0.98).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Volume vs Exceptions Chart */}
          <div style={{ background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 280, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#081E3C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={16} color="#004753" /> Monthly Invoice Throughput & Audit Exceptions (6 Months)
              </h3>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700 }}>
                <span style={{ color: '#004753' }}>■ Matched Invoices</span>
                <span style={{ color: '#DC2626' }}>■ Exceptions</span>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 200, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="processed" name="Successfully Processed" stackId="a" fill="#004753" radius={[0, 0, 4, 4]} animationDuration={1000} />
                    <Bar dataKey="exceptions" name="Exceptions" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Onboard Modal */}
      <AnimatePresence>
        {showOnboardModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 14, padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#081E3C' }}>
                  Onboard Vendor to Master Supplier File
                </h3>
                <button onClick={() => setShowOnboardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Vendor Legal Trade Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Al Habtoor Concrete Solutions LLC" 
                    value={newVendorName} 
                    onChange={(e) => setNewVendorName(e.target.value)} 
                    required
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>UAE FTA Tax Registration Number (15 Digits)</label>
                  <input 
                    type="text" 
                    placeholder="100XXXXXXXXXXXX" 
                    value={newVendorTrn} 
                    onChange={(e) => setNewVendorTrn(e.target.value)} 
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Accounts Payable Contact Email</label>
                  <input 
                    type="email" 
                    placeholder="billing@vendor.ae" 
                    value={newVendorContact} 
                    onChange={(e) => setNewVendorContact(e.target.value)} 
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowOnboardModal(false)} style={{ padding: '8px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '8px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                    Register & Activate Vendor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
