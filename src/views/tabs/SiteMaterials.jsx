import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, Box, Truck, BarChart2, CheckCircle2, 
  AlertTriangle, Layers, Calendar, ArrowRight, Check, MapPin, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const uaeMaterials = [
  { id: 'MAT-01', type: 'Emirates Steel Grade 60 Rebar', location: 'Zone B — North Laydown Yard', status: 'Optimal', currentStock: '450 Tons', capacity: '600 Tons', lastDelivery: 'Today 08:30 AM', nextDelivery: '16 Aug 2026', supplier: 'Emirates Steel Arkan', trackingMethod: 'Drone Photogrammetry' },
  { id: 'MAT-02', type: 'C40/50 Ready-Mix Concrete', location: 'Zone A — Pour Pump 02', status: 'In Transit', currentStock: '180 m³ Batch', capacity: '400 m³/day', lastDelivery: 'Today 10:15 AM', nextDelivery: 'Today 02:00 PM', supplier: 'Unimix Dubai', trackingMethod: 'RFID Gates + Slump Cam' },
  { id: 'MAT-03', type: 'AAC Lightweight Blocks (200mm)', location: 'Zone C — Logistics Bay 02', status: 'Low Stock', currentStock: '18 Pallets', capacity: '120 Pallets', lastDelivery: '12 Aug 2026', nextDelivery: 'Tomorrow', supplier: 'Thermal Block Co.', trackingMethod: 'CCTV Pallet AI Count' },
  { id: 'MAT-04', type: 'Post-Tensioning Tendon Strands', location: 'Zone A — Level 04 Deck', status: 'Critical', currentStock: '1,200 LM', capacity: '5,000 LM', lastDelivery: '08 Aug 2026', nextDelivery: '17 Aug 2026', supplier: 'Freyssinet Middle East', trackingMethod: 'Barcoded Drum RFID' },
  { id: 'MAT-05', type: 'Schüco Curtain Wall Glazed Units', location: 'Zone C — Shaded Glass Depot', status: 'Optimal', currentStock: '84 Panels', capacity: '100 Panels', lastDelivery: 'Yesterday', nextDelivery: '18 Aug 2026', supplier: 'Schüco Middle East', trackingMethod: 'QR Coded Rack Scan' },
  { id: 'MAT-06', type: 'Class 0 Fire-Rated Duct Insulation', location: 'Basement 01 HVAC Yard', status: 'Optimal', currentStock: '60 Rolls', capacity: '80 Rolls', lastDelivery: '11 Aug 2026', nextDelivery: '20 Aug 2026', supplier: 'Gulf Olayan MEP', trackingMethod: 'Warehouse AI Cam' },
];

const deliveryData = [
  { day: 'Mon', trucks: 12, volume: 150 },
  { day: 'Tue', trucks: 18, volume: 220 },
  { day: 'Wed', trucks: 15, volume: 180 },
  { day: 'Thu', trucks: 24, volume: 300 },
  { day: 'Fri', trucks: 20, volume: 250 },
  { day: 'Sat', trucks: 8, volume: 100 },
  { day: 'Sun', trucks: 2, volume: 20 },
];

export const SiteMaterials = () => {
  const [materialList, setMaterialList] = useState(uaeMaterials);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatLocation, setNewMatLocation] = useState('Zone B — North Yard');

  const handleRegisterMaterial = (e) => {
    e.preventDefault();
    if (!newMatName) return;
    const newMat = {
      id: `MAT-0${materialList.length + 1}`,
      type: newMatName,
      location: newMatLocation,
      status: 'Optimal',
      currentStock: '100 Units',
      capacity: '200 Units',
      lastDelivery: 'Just now',
      nextDelivery: 'TBD',
      supplier: 'Registered Supplier',
      trackingMethod: 'AI CCTV'
    };
    setMaterialList([...materialList, newMat]);
    setShowAddModal(false);
    setNewMatName('');
  };

  const filteredMaterials = materialList.filter(m => 
    m.type.toLowerCase().includes(search.toLowerCase()) || 
    m.location.toLowerCase().includes(search.toLowerCase()) ||
    m.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Visual Material Tracking & Inventory AI
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Volumetric stockpile computer vision, delivery gate RFID tracking, and bulk concrete logistics for UAE mega projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={15} /> Register Inbound Material
          </button>
        </div>
      </div>

      {/* Row 1: Analytics & KPIs (65% / 35%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 280 }}>
        
        {/* Logistics Chart (65%) */}
        <div style={{ flex: '0 0 65%', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
                Weekly Logistics Deliveries & Material Tonnage
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                Total inbound delivery trucks vs tonnage processed at gate speed-gates
              </p>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} unit=" trucks" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontWeight: 700 }} />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Bar yAxisId="left" dataKey="volume" name="Material Volume (Tons)" fill="#004753" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar yAxisId="right" dataKey="trucks" name="Delivery Trucks" fill="#00A9C5" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick KPI Cards (35%) */}
        <div style={{ flex: '0 0 calc(35% - 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 18, flex: 1, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(0, 71, 83, 0.08)', color: '#004753', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>ARRIVED TODAY</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C', lineHeight: 1.1 }}>14 Transit Mixers</div>
              <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700, marginTop: 2 }}>280 m³ C40 Pour Active</div>
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 18, flex: 1, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 44, height: 44, background: '#FEF2F2', color: '#DC2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>CRITICAL STOCK WARNING</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C', lineHeight: 1.1 }}>2 Packages Low</div>
              <div style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 700, marginTop: 2 }}>PT Tendons & AAC Blocks</div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Live Inventory Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search material type, supplier, zone..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredMaterials.length} Inbound Material Categories Tracked
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Material Package & Supplier</th>
                <th style={{ padding: '12px 16px' }}>Site Laydown Location</th>
                <th style={{ padding: '12px 14px' }}>Current Stock</th>
                <th style={{ padding: '12px 14px' }}>Capacity Limit</th>
                <th style={{ padding: '12px 16px' }}>AI Tracking Method</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0, 71, 83, 0.08)', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Box size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#081E3C' }}>{mat.type}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{mat.id} • {mat.supplier}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 600 }}>{mat.location}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 900, color: '#081E3C' }}>{mat.currentStock}</td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{mat.capacity}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 8px', borderRadius: 4 }}>
                      {mat.trackingMethod}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: mat.status === 'Optimal' ? '#ECFDF5' : mat.status === 'In Transit' ? 'rgba(0, 169, 197, 0.1)' : '#FEF2F2',
                      color: mat.status === 'Optimal' ? '#059669' : mat.status === 'In Transit' ? '#00A9C5' : '#DC2626'
                    }}>
                      {mat.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={() => alert(`Showing AI volumetric mesh for "${mat.type}"...`)}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      Volumetric Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Inbound Material Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleRegisterMaterial}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Register Inbound Material Batch
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Material Description & Grade *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. C50 High-Early Strength Concrete" 
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Storage Laydown Location</label>
                <input 
                  type="text" 
                  value={newMatLocation}
                  onChange={(e) => setNewMatLocation(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Register Batch
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
