import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Filter, Plus, UserCheck, ShieldAlert, Lock, 
  Unlock, Eye, Edit3, Trash2, Key, Check, Info, ChevronDown
} from 'lucide-react';

const uaeRoles = [
  'Project Director / PMO', 
  'Lead Resident Engineer (KEO)', 
  'Commercial Director & QS', 
  'Trade Subcontractor (Dutco)', 
  'Employer Representative (Emaar)', 
  'QA/QC Lead Inspector', 
  'HSE Safety Directorate'
];

const uaeDocCategories = [
  'FIDIC Contracts & Claims', 
  'Dubai Building Code Specs', 
  'IFC CAD & BIM Models', 
  'Variation Orders & Pricing', 
  'Interim Payment Certs', 
  'QA/QC Mill Test Reports'
];

const initialAccessMatrix = {
  'Project Director / PMO': { 'FIDIC Contracts & Claims': 2, 'Dubai Building Code Specs': 2, 'IFC CAD & BIM Models': 2, 'Variation Orders & Pricing': 2, 'Interim Payment Certs': 2, 'QA/QC Mill Test Reports': 2 },
  'Lead Resident Engineer (KEO)': { 'FIDIC Contracts & Claims': 1, 'Dubai Building Code Specs': 2, 'IFC CAD & BIM Models': 2, 'Variation Orders & Pricing': 2, 'Interim Payment Certs': 1, 'QA/QC Mill Test Reports': 2 },
  'Commercial Director & QS': { 'FIDIC Contracts & Claims': 2, 'Dubai Building Code Specs': 1, 'IFC CAD & BIM Models': 1, 'Variation Orders & Pricing': 2, 'Interim Payment Certs': 2, 'QA/QC Mill Test Reports': 1 },
  'Trade Subcontractor (Dutco)': { 'FIDIC Contracts & Claims': 0, 'Dubai Building Code Specs': 1, 'IFC CAD & BIM Models': 1, 'Variation Orders & Pricing': 0, 'Interim Payment Certs': 0, 'QA/QC Mill Test Reports': 1 },
  'Employer Representative (Emaar)': { 'FIDIC Contracts & Claims': 2, 'Dubai Building Code Specs': 1, 'IFC CAD & BIM Models': 2, 'Variation Orders & Pricing': 2, 'Interim Payment Certs': 2, 'QA/QC Mill Test Reports': 1 },
  'QA/QC Lead Inspector': { 'FIDIC Contracts & Claims': 0, 'Dubai Building Code Specs': 2, 'IFC CAD & BIM Models': 2, 'Variation Orders & Pricing': 0, 'Interim Payment Certs': 0, 'QA/QC Mill Test Reports': 2 },
  'HSE Safety Directorate': { 'FIDIC Contracts & Claims': 0, 'Dubai Building Code Specs': 1, 'IFC CAD & BIM Models': 1, 'Variation Orders & Pricing': 0, 'Interim Payment Certs': 0, 'QA/QC Mill Test Reports': 2 },
};

const permissionOptions = [
  { level: 2, label: 'Full Access (Edit & Vectorize)', icon: <Edit3 size={13} color="#004753" />, color: '#004753', bg: 'rgba(0, 71, 83, 0.1)' },
  { level: 1, label: 'Query & View Only', icon: <Eye size={13} color="#059669" />, color: '#059669', bg: '#ECFDF5' },
  { level: 0, label: 'Restricted (No Access)', icon: <Lock size={13} color="#DC2626" />, color: '#DC2626', bg: '#FEF2F2' },
];

export const KnowledgePermissions = () => {
  const [matrix, setMatrix] = useState(initialAccessMatrix);
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null); // { role, docType }

  const handleSelectPermission = (role, docType, level) => {
    setMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [docType]: level }
    }));
    setOpenDropdown(null);
  };

  const getBadge = (level, isOpen) => {
    if (level === 2) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 6, background: 'rgba(0, 71, 83, 0.1)', color: '#004753', fontSize: 11, fontWeight: 800, border: isOpen ? '1.5px solid #004753' : '1px solid transparent' }}>
          <Edit3 size={12} /> Full Access <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </span>
      );
    }
    if (level === 1) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 6, background: '#ECFDF5', color: '#059669', fontSize: 11, fontWeight: 800, border: isOpen ? '1.5px solid #059669' : '1px solid transparent' }}>
          <Eye size={12} /> Query & View <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 6, background: '#FEF2F2', color: '#DC2626', fontSize: 11, fontWeight: 800, border: isOpen ? '1.5px solid #DC2626' : '1px solid transparent' }}>
        <Lock size={12} /> Restricted <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </span>
    );
  };

  const filteredRoles = uaeRoles.filter(r => r.toLowerCase().includes(search.toLowerCase()));

  return (
    <div 
      onClick={() => setOpenDropdown(null)}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Knowledge Base RBAC & Security Permissions
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Role-Based Access Control matrix dictating which engineering stakeholders can query or modify vector datasets
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Grant User Policy
          </button>
        </div>
      </div>

      {/* Main Access Matrix Card */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', borderRadius: '14px 14px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, width: 320, border: '1px solid #CBD5E1' }}>
            <Search size={15} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search user roles or contractors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
            />
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={14} color="#004753" /> Click any cell to open dropdown menu and select permission level
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto', paddingBottom: openDropdown ? 80 : 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px', width: 240 }}>Engineering Persona / Role</th>
                {uaeDocCategories.map(cat => (
                  <th key={cat} style={{ padding: '14px 12px', textAlign: 'center', fontSize: 11 }}>
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#081E3C', borderRight: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Key size={14} color="#004753" />
                      {role}
                    </div>
                  </td>
                  {uaeDocCategories.map(cat => {
                    const level = matrix[role][cat];
                    const isOpen = openDropdown?.role === role && openDropdown?.docType === cat;

                    return (
                      <td 
                        key={cat}
                        style={{ padding: '10px 12px', textAlign: 'center', position: 'relative' }}
                      >
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(isOpen ? null : { role, docType: cat });
                          }}
                          style={{ display: 'inline-block', cursor: 'pointer' }}
                        >
                          {getBadge(level, isOpen)}
                        </div>

                        {/* Interactive Dropdown Menu on Click */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 4 }}
                              transition={{ duration: 0.15 }}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 2px)',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'white',
                                borderRadius: 10,
                                border: '1px solid #CBD5E1',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                                padding: 6,
                                zIndex: 60,
                                minWidth: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                textAlign: 'left'
                              }}
                            >
                              <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Select Permission
                              </div>
                              {permissionOptions.map((opt) => {
                                const isSelected = level === opt.level;

                                return (
                                  <div
                                    key={opt.level}
                                    onClick={() => handleSelectPermission(role, cat, opt.level)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '8px 10px',
                                      borderRadius: 6,
                                      cursor: 'pointer',
                                      background: isSelected ? 'rgba(0, 71, 83, 0.08)' : 'transparent',
                                      transition: 'background 0.15s'
                                    }}
                                    className="hover-bg-gray-50"
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      {opt.icon}
                                      <span style={{ fontSize: 11.5, fontWeight: isSelected ? 800 : 600, color: isSelected ? opt.color : '#081E3C' }}>
                                        {opt.label}
                                      </span>
                                    </div>
                                    {isSelected && <Check size={13} color="#004753" />}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
