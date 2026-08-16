import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { FolderTree, FileText, CheckCircle2, Search, ArrowRight, ShieldCheck, Sparkles, Filter, Check, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const classificationConfidence = [
  { name: 'High Confidence (>95%)', value: 44200, percentage: '84%', color: '#059669' },
  { name: 'Medium Confidence (80-95%)', value: 6840, percentage: '13%', color: '#D97706' },
  { name: 'Manual Triage Needed', value: 1800, percentage: '3%', color: '#DC2626' },
];

const categoryVolumes = [
  { name: 'Structural Framing & Rebar', count: 16400 },
  { name: 'Architectural & Facade Specs', count: 12800 },
  { name: 'MEP & HVAC Schematics', count: 9400 },
  { name: 'Civil & Infrastructure', count: 7200 },
  { name: 'FIDIC Legal & Contracts', count: 4800 },
  { name: 'HSE & OSHAD Safety Logs', count: 2240 },
];

const pendingClassificationQueue = [
  { id: 'CLS-901', file: 'KEO-AWT-DWG-STRUCT-0402.pdf', detectedType: 'Structural Detail Schedule', suggestedDiscipline: 'Structural Rebar', confidence: 99.2, status: 'Auto-Classified' },
  { id: 'CLS-902', file: 'DBC-2021-AMEND-PART4.pdf', detectedType: 'Regulatory Code Amendment', suggestedDiscipline: 'Dubai Building Code', confidence: 98.4, status: 'Auto-Classified' },
  { id: 'CLS-903', file: 'ERH-CIV-SOIL-LAB-REP.xlsx', detectedType: 'Geotechnical Soil Test', suggestedDiscipline: 'Civil Infrastructure', confidence: 88.5, status: 'Needs Review' },
  { id: 'CLS-904', file: 'ZNM-STONE-CLADDING-MTC.pdf', detectedType: 'Material Mill Certificate', suggestedDiscipline: 'QA/QC Lab Reports', confidence: 96.1, status: 'Auto-Classified' },
];

export const KnowledgeClassification = () => {
  const [queue, setQueue] = useState(pendingClassificationQueue);
  const [search, setSearch] = useState('');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const handleApproveClassification = (id) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Verified' } : item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            AI Document Classification & Tagging
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Automatic discipline assignment, CSI MasterFormat taxonomy mapping, and confidence scoring
          </p>
        </div>
      </div>

      {/* Row 1: Visual Analytics (60% / 40%) */}
      <div style={{ display: 'flex', gap: 20, minHeight: 320 }}>
        
        {/* Horizontal Bar: Category Volumes */}
        <div style={{ flex: '0 0 60%', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Classified Corpus by Discipline
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Total documents auto-tagged into engineering taxonomy
            </p>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryVolumes} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#081E3C', fontWeight: 700 }} width={160} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0, 71, 83, 0.04)' }}
                    formatter={(val) => [`${val.toLocaleString()} Documents`, 'Count']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontWeight: 700 }}
                  />
                  <Bar dataKey="count" fill="#004753" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Confidence Donut */}
        <div style={{ flex: '0 0 calc(40% - 20px)', background: 'linear-gradient(135deg, rgba(0, 71, 83, 0.05) 0%, rgba(0, 169, 197, 0.12) 100%)', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: 6 }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Classification Confidence Breakdown
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Model certainty across 52,840 ingested assets
            </p>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, bottom: 0, left: 0, right: 0 }}>
                  <Pie
                    data={classificationConfidence}
                    cx="50%"
                    cy="44%"
                    innerRadius={55}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, index) => setHoveredSlice(classificationConfidence[index])}
                    onMouseLeave={() => setHoveredSlice(null)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    {classificationConfidence.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: 10.5, fontWeight: 700 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: hoveredSlice ? hoveredSlice.color : '#081E3C', lineHeight: 1.1 }}>
                {hoveredSlice ? hoveredSlice.percentage : '84%'}
              </div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, marginTop: 2 }}>
                {hoveredSlice ? hoveredSlice.name.split(' ')[0] : 'High Conf.'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Live Ingestion & Tagging Queue */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: 15, fontWeight: 800, color: '#081E3C' }}>
              Recent AI Ingestion & Tagging Triage
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Verify automated metadata taxonomy tags assigned by the neural classifier
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#004753', background: 'rgba(0,71,83,0.08)', padding: '4px 10px', borderRadius: 14 }}>
            Neural Classifier v4.2
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 18px' }}>File Identifier</th>
                <th style={{ padding: '12px 16px' }}>Detected Document Type</th>
                <th style={{ padding: '12px 16px' }}>Assigned Discipline</th>
                <th style={{ padding: '12px 16px' }}>Model Confidence</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 800, color: '#081E3C' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={15} color="#004753" />
                      {item.file}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#081E3C', fontWeight: 700 }}>{item.detectedType}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                      {item.suggestedDiscipline}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: item.confidence > 95 ? '#059669' : '#D97706' }}>
                      {item.confidence}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: item.status === 'Verified' || item.status === 'Auto-Classified' ? '#ECFDF5' : '#FEF3C7',
                      color: item.status === 'Verified' || item.status === 'Auto-Classified' ? '#059669' : '#D97706'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    {item.status !== 'Verified' && (
                      <button 
                        onClick={() => handleApproveClassification(item.id)}
                        style={{ padding: '6px 14px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                      >
                        Confirm Tag
                      </button>
                    )}
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
