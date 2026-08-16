import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Plus, Save, DollarSign, Calculator, 
  Layers, Maximize2, FileText, CheckCircle2, TrendingUp, AlertCircle, 
  Sparkles, Check, Edit2
} from 'lucide-react';

const uaeBoqItems = [
  { id: '1', code: '03 30 00', desc: 'Cast-in-Place C40/50 Reinforced Concrete for Slabs & Beams', qty: 2450, unit: 'm³', rate: 420.00, source: 'DWG-DXB-101 / 102', division: 'Division 03 - Concrete' },
  { id: '2', code: '03 20 00', desc: 'High Yield Deformed Steel Rebar (Grade 500D) cut & bent', qty: 680, unit: 'Tons', rate: 3650.00, source: 'DWG-AUH-201', division: 'Division 03 - Concrete' },
  { id: '3', code: '08 44 00', desc: 'Unitized Low-E Double Glazed Curtain Wall Facade System', qty: 3850, unit: 'm²', rate: 1250.00, source: 'DWG-DXB-201', division: 'Division 08 - Openings' },
  { id: '4', code: '08 11 13', desc: 'Hollow Metal Fire-Rated Double Door Sets (120 min rating)', qty: 184, unit: 'EA', rate: 2850.00, source: 'DWG-DXB-101', division: 'Division 08 - Openings' },
  { id: '5', code: '04 20 00', desc: '200mm Autoclaved Aerated Lightweight Partition Blockwork', qty: 8400, unit: 'm²', rate: 95.00, source: 'DWG-DXB-101', division: 'Division 04 - Masonry' },
  { id: '6', code: '23 31 13', desc: 'Galvanized Sheet Metal HVAC Ductwork with Acoustic Lining', qty: 14200, unit: 'kg', rate: 38.50, source: 'DWG-DXB-301', division: 'Division 23 - HVAC' },
  { id: '7', code: '22 11 16', desc: 'PPR Hot & Cold Domestic Water Distribution Pipework (PN20)', qty: 4200, unit: 'LM', rate: 75.00, source: 'DWG-DXB-301', division: 'Division 22 - Plumbing' },
  { id: '8', code: '09 30 00', desc: 'Non-Slip Vitrified Ceramic Floor Tile Finishes (600x600mm)', qty: 5600, unit: 'm²', rate: 145.00, source: 'DWG-DXB-101', division: 'Division 09 - Finishes' },
  { id: '9', code: '31 23 00', desc: 'Sub-base Crushed Aggregate Road Base (300mm depth)', qty: 3100, unit: 'm³', rate: 85.00, source: 'DWG-DWC-105', division: 'Division 31 - Earthwork' },
];

export const DrawingBOQ = () => {
  const [boqList, setBoqList] = useState(uaeBoqItems);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ code: '', desc: '', qty: 100, unit: 'm²', rate: 150, division: 'Division 03 - Concrete', source: 'DWG-NEW-001' });
  const [editingId, setEditingId] = useState(null);

  const handleRateChange = (id, newRate) => {
    setBoqList(prev => prev.map(item => item.id === id ? { ...item, rate: parseFloat(newRate) || 0 } : item));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.desc) return;
    const item = {
      ...newItem,
      id: String(boqList.length + 1),
      qty: Number(newItem.qty) || 0,
      rate: Number(newItem.rate) || 0
    };
    setBoqList([...boqList, item]);
    setShowAddModal(false);
    setNewItem({ code: '', desc: '', qty: 100, unit: 'm²', rate: 150, division: 'Division 03 - Concrete', source: 'DWG-NEW-001' });
  };

  const filteredBoq = boqList.filter(item => {
    const matchesSearch = item.desc.toLowerCase().includes(search.toLowerCase()) || 
                          item.code.includes(search) || 
                          item.division.toLowerCase().includes(search.toLowerCase());
    const matchesDivision = divisionFilter === 'All' || item.division.includes(divisionFilter);
    return matchesSearch && matchesDivision;
  });

  const totalEstimateAED = boqList.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Bill of Quantities (BOQ) & Cost Estimation
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Map AI takeoff quantities directly to CSI MasterFormat cost codes with live market unit rate adjustments
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1.5px solid #CBD5E1', color: '#081E3C', borderRadius: 8, background: 'white', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
          >
            <Plus size={14} /> Add Line Item
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={14} /> Export Cost-Loaded BOQ
          </button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 14 }}>
        <div style={{ background: 'linear-gradient(135deg, #004753 0%, #00556A 100%)', borderRadius: 14, padding: '18px 22px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,71,83,0.15)' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Estimated BOQ Cost
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, letterSpacing: '-0.02em' }}>
              AED {totalEstimateAED.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#00A9C5" />
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(0,169,197,0.1)', color: '#00A9C5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C' }}>{boqList.length} Items</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>100% Rate Covered</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>98.4%</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>AI Drawing Match</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#D97706' }}>Dubai CSI-04</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Standard Cost Index</div>
          </div>
        </div>
      </div>

      {/* Main BOQ Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 300, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search CSI code or description..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Divisions</option>
              <option value="Concrete">Division 03 - Concrete</option>
              <option value="Masonry">Division 04 - Masonry</option>
              <option value="Openings">Division 08 - Openings</option>
              <option value="Finishes">Division 09 - Finishes</option>
              <option value="HVAC">Division 23 - HVAC</option>
              <option value="Plumbing">Division 22 - Plumbing</option>
              <option value="Earthwork">Division 31 - Earthwork</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredBoq.length} Bill Line Items
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px', width: 100 }}>CSI Code</th>
                <th style={{ padding: '12px 16px' }}>Item Description</th>
                <th style={{ padding: '12px 16px' }}>Source Drawings</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Takeoff Qty</th>
                <th style={{ padding: '12px 16px' }}>Unit</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: 140 }}>Unit Rate (AED)</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Total Amount (AED)</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoq.map((row) => {
                const rowTotal = row.qty * row.rate;
                return (
                  <tr 
                    key={row.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                    className="hover-bg-gray-50"
                  >
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                        {row.code}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#081E3C' }}>{row.desc}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{row.division}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 11.5, color: '#00A9C5', fontWeight: 700 }}>
                      {row.source}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#081E3C' }}>
                      {row.qty.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#64748B' }}>{row.unit}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>AED</span>
                        <input 
                          type="number"
                          value={row.rate}
                          onChange={(e) => handleRateChange(row.id, e.target.value)}
                          style={{ 
                            width: 80, padding: '4px 6px', textAlign: 'right', borderRadius: 6, 
                            border: '1px solid #CBD5E1', fontSize: 12.5, fontWeight: 800, color: '#081E3C', outline: 'none' 
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 900, color: '#004753', fontSize: 14 }}>
                      AED {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Line Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleAddItem}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Add BOQ Line Item
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>CSI Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 03 30 00" 
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Item Description *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Precast Hollow Core Slabs 250mm" 
                    value={newItem.desc}
                    onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Quantity</label>
                  <input 
                    type="number" 
                    value={newItem.qty}
                    onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Unit</label>
                  <select 
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', background: 'white' }}
                  >
                    <option value="m³">m³</option>
                    <option value="m²">m²</option>
                    <option value="LM">LM</option>
                    <option value="Tons">Tons</option>
                    <option value="EA">EA</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Unit Rate (AED)</label>
                  <input 
                    type="number" 
                    value={newItem.rate}
                    onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Save Line Item
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
