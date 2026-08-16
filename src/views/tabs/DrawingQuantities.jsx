import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, ComposedChart, Line 
} from 'recharts';
import { 
  Calculator, Download, Filter, Search, ChevronDown, CheckCircle2, 
  AlertTriangle, Layers, ArrowUpRight, ArrowDownRight, RefreshCw, FileText, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const uaeMaterialTakeoff = [
  { id: 'CON-001', category: 'Concrete', item: 'C40/50 Ready-Mix Reinforced Concrete (Columns & Core)', quantity: 2450, unit: 'm³', status: 'Verified', variance: '+1.8%', source: 'DWG-DXB-101 / 102', costCode: '03 30 00' },
  { id: 'STL-002', category: 'Structural Steel', item: 'High-Yield Deformed Steel Rebar Fe500D (12mm-32mm)', quantity: 680, unit: 'Tons', status: 'Verified', variance: '0.0%', source: 'DWG-AUH-201', costCode: '05 12 00' },
  { id: 'GLZ-003', category: 'Facade & Glazing', item: 'Unitized Double-Glazed Low-E Curtain Wall Panels', quantity: 3850, unit: 'm²', status: 'Verified', variance: '+0.5%', source: 'DWG-DXB-201', costCode: '08 44 00' },
  { id: 'MSN-004', category: 'Masonry', item: '200mm Solid Precast Concrete Partition Blockwork', quantity: 8400, unit: 'm²', status: 'Verified', variance: '-1.2%', source: 'DWG-DXB-101', costCode: '04 20 00' },
  { id: 'DOR-005', category: 'Doors & Windows', item: 'Fire-Rated Hollow Metal Double Doors (120 min rating)', quantity: 184, unit: 'EA', status: 'Verified', variance: '0.0%', source: 'DWG-DXB-101 / 102', costCode: '08 11 13' },
  { id: 'MEP-006', category: 'MEP & HVAC', item: 'Galvanized Iron Sheet Metal Rectangular Ducting (1.2mm)', quantity: 14200, unit: 'kg', status: 'Review Required', variance: '+8.4%', source: 'DWG-DXB-301', costCode: '23 31 13' },
  { id: 'PIP-007', category: 'Plumbing', item: 'PPR-C Hot & Cold Water Distribution Piping (PN20)', quantity: 4200, unit: 'LM', status: 'Verified', variance: '+2.1%', source: 'DWG-DXB-301', costCode: '22 11 16' },
  { id: 'FIN-008', category: 'Finishes', item: 'Heavy-Duty Anti-Skid Ceramic Floor Tiles (600x600mm)', quantity: 5600, unit: 'm²', status: 'Pending', variance: '-0.8%', source: 'DWG-DXB-101', costCode: '09 30 00' },
  { id: 'CIV-009', category: 'Civil & Earthworks', item: 'Sub-base Crushed Aggregate Road Base (300mm depth)', quantity: 3100, unit: 'm³', status: 'Verified', variance: '+0.2%', source: 'DWG-DWC-105', costCode: '31 23 00' },
];

const levelDistributionData = [
  { level: 'Basement B1-B3', Concrete: 850, Steel: 240, Blockwork: 1200, Facade: 0 },
  { level: 'Ground Podium', Concrete: 620, Steel: 160, Blockwork: 2800, Facade: 950 },
  { level: 'Tower L01-L15', Concrete: 540, Steel: 150, Blockwork: 2400, Facade: 1600 },
  { level: 'Tower L16-L30', Concrete: 440, Steel: 130, Blockwork: 2000, Facade: 1300 },
];

export const DrawingQuantities = () => {
  const [materialData, setMaterialData] = useState(uaeMaterialTakeoff);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredData = materialData.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesSearch = d.item.toLowerCase().includes(search.toLowerCase()) || 
                          d.category.toLowerCase().includes(search.toLowerCase()) ||
                          d.id.toLowerCase().includes(search.toLowerCase()) ||
                          d.costCode.includes(search);
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      alert("AI Takeoff Recalculation Complete: Quantities verified across latest revision CAD layers.");
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Material Takeoff (MTO) & Quantities
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            AI-extracted bill quantities, volumetric floor distributions, and cost-code mapping from verified drawings
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1.5px solid #004753', color: '#004753', borderRadius: 8, background: 'white', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
          >
            <Calculator size={14} className={isRecalculating ? 'spin' : ''} /> 
            {isRecalculating ? 'Re-calculating...' : 'Recalculate MTO'}
          </button>
          <button 
            onClick={() => setShowTakeoffModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Calculator size={14} /> Calculate Concrete & Rebar Takeoff
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(0,71,83,0.08)', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C' }}>9 Core Categories</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>CSI MasterFormat Mapped</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>
              {materialData.filter(d => d.status === 'Verified').length} Verified
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>100% Geometry Matched</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#D97706' }}>1 Flagged Item</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Ducting +8.4% Variance</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(0,169,197,0.1)', color: '#00A9C5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={18} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#081E3C' }}>4 Levels</div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Volumetric WBS Structure</div>
          </div>
        </div>
      </div>

      {/* Row 2: Chart Section (Stacked Volume Distribution by Floor Level) */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, height: 290, minHeight: 290, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Material Takeoff Distribution by Vertical Zone
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Multi-material volumetric breakdown per construction floor stage
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#004753' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#004753' }} /> Concrete (m³)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00A9C5' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#00A9C5' }} /> Rebar (Tons)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00556A' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#00556A' }} /> Blockwork (m²)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#D97706' }} /> Glazing (m²)
            </span>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelDistributionData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B', fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: '#64748B' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.98)' }}
                  itemStyle={{ fontSize: 12, fontWeight: 700 }}
                />
                <Bar dataKey="Concrete" stackId="a" fill="#004753" barSize={34} />
                <Bar dataKey="Steel" stackId="a" fill="#00A9C5" barSize={34} />
                <Bar dataKey="Blockwork" stackId="a" fill="#00556A" barSize={34} />
                <Bar dataKey="Facade" stackId="a" fill="#D97706" radius={[4, 4, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Material Takeoff Data Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 280, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search item, category, cost code..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Categories</option>
              <option value="Concrete">Concrete</option>
              <option value="Structural Steel">Structural Steel</option>
              <option value="Facade & Glazing">Facade & Glazing</option>
              <option value="Masonry">Masonry</option>
              <option value="MEP & HVAC">MEP & HVAC</option>
              <option value="Finishes">Finishes</option>
            </select>

            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Review Required">Review Required</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {filteredData.length} Material Line Items
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>Cost Code</th>
                <th style={{ padding: '12px 16px' }}>Material Item Description</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Calculated Qty</th>
                <th style={{ padding: '12px 16px' }}>Unit</th>
                <th style={{ padding: '12px 16px' }}>CAD Sources</th>
                <th style={{ padding: '12px 16px' }}>Variance</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr 
                  key={row.id}
                  onClick={() => setSelectedItem(row)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {row.costCode}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{row.item}</div>
                    <div style={{ fontSize: 11, color: '#00A9C5', fontWeight: 700 }}>{row.id}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>{row.category}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 900, color: '#081E3C', fontSize: 14 }}>
                    {row.quantity.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#64748B' }}>{row.unit}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11.5, color: '#004753', fontWeight: 700 }}>{row.source}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      fontSize: 11.5, fontWeight: 800,
                      color: row.variance.startsWith('+') && parseFloat(row.variance) > 5 ? '#DC2626' : row.variance === '0.0%' ? '#059669' : '#004753'
                    }}>
                      {row.variance}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: row.status === 'Verified' ? '#ECFDF5' : row.status === 'Review Required' ? '#FEE2E2' : '#FEF3C7',
                      color: row.status === 'Verified' ? '#059669' : row.status === 'Review Required' ? '#DC2626' : '#D97706'
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(row); }}
                      style={{ padding: '4px 10px', background: 'rgba(0, 71, 83, 0.06)', border: 'none', borderRadius: 6, color: '#004753', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
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

      {/* Item Audit Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 500, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {selectedItem.costCode} • {selectedItem.id}
                  </span>
                  <h3 style={{ margin: '4px 0 2px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                    {selectedItem.item}
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{selectedItem.category}</div>
                </div>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>AI Extracted Takeoff</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#004753', marginTop: 2 }}>
                    {selectedItem.quantity.toLocaleString()} {selectedItem.unit}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Variance vs Schedule</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: selectedItem.variance === '0.0%' ? '#059669' : '#081E3C', marginTop: 2 }}>
                    {selectedItem.variance}
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}>
                <div style={{ fontWeight: 800, color: '#081E3C', marginBottom: 4 }}>Source Blueprint Link:</div>
                <div style={{ color: '#004753', fontWeight: 700 }}>{selectedItem.source}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button onClick={() => setSelectedItem(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <button 
                  onClick={() => {
                    setMaterialData(prev => prev.map(m => m.id === selectedItem.id ? { ...m, status: 'Verified', variance: '0.0%' } : m));
                    setSelectedItem(null);
                  }}
                  style={{ padding: '7px 16px', background: '#004753', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={14} /> Approve & Verify Line Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
