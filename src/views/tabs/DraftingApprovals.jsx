import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Clock, Search, Filter, MessageSquare, AlertCircle, Eye, 
  MoreHorizontal, User, ShieldCheck, CheckCircle2, ArrowRight, FileText, 
  Send, DollarSign, Calendar
} from 'lucide-react';

const uaeApprovalsList = [
  { 
    id: 'APP-DXB-1029', 
    title: 'Site Variation Order #04 - Foundation Raft Obstruction', 
    project: 'Al Wasl Commercial High-Rise',
    type: 'Variation Order', 
    requester: 'Rashid Al Nuaimi', 
    submitted: '2 hours ago', 
    amount: 'AED 420,000',
    urgency: 'Critical',
    steps: [
      { label: 'Resident Engineer', status: 'approved', by: 'Eng. Tareq Mansoor', date: '1 hour ago' },
      { label: 'Lead Consultant (KEO)', status: 'pending', by: 'Pending Review', date: null },
      { label: 'Employer Commercial Director', status: 'upcoming', by: null, date: null }
    ]
  },
  { 
    id: 'APP-AUH-1030', 
    title: 'Subcontractor Trade Agreement - Precast Concrete', 
    project: 'Etihad Rail Logistics & Depot Hub',
    type: 'Subcontract', 
    requester: 'Zaid Mansoor', 
    submitted: '1 day ago', 
    amount: 'AED 8,900,000',
    urgency: 'High',
    steps: [
      { label: 'Procurement Specialist', status: 'approved', by: 'Sarah Al Qasimi', date: 'Yesterday' },
      { label: 'Legal Counsel Review', status: 'approved', by: 'Adv. Humaid Al Zaabi', date: 'Yesterday' },
      { label: 'Managing Director Signature', status: 'pending', by: 'Pending Signature', date: null }
    ]
  },
  { 
    id: 'APP-DXB-1031', 
    title: 'Material Inspection Request (MIR) - Low-E Double Glazing', 
    project: 'Dubai Creek Harbour Towers',
    type: 'Compliance', 
    requester: 'Emaar Properties PJSC', 
    submitted: '3 hours ago', 
    amount: 'N/A',
    urgency: 'Medium',
    steps: [
      { label: 'QA/QC Materials Inspector', status: 'approved', by: 'Eng. John Smith', date: '2 hours ago' },
      { label: 'Facade Engineering Lead', status: 'pending', by: 'Pending Verification', date: null }
    ]
  },
  { 
    id: 'APP-AUH-1032', 
    title: 'Notice of Delay & Extension of Time (EOT) Claim', 
    project: 'Zayed National Museum Extension',
    type: 'Legal Claim', 
    requester: 'Foster + Partners PMO', 
    submitted: '4 days ago', 
    amount: '14 Calendar Days',
    urgency: 'Critical',
    steps: [
      { label: 'Claims Consultant', status: 'approved', by: 'Dr. Arthur Pendelton', date: '3 days ago' },
      { label: 'Client Representative Sign-off', status: 'rejected', by: 'DCT Director', date: '2 days ago', note: 'Requires additional contemporary weather station logs to substantiate concurrent delay.' }
    ]
  },
  { 
    id: 'APP-SHJ-1033', 
    title: 'Interim Payment Certificate IPC-08 (Milestone Foundation)', 
    project: 'Sharjah Sustainable City Phase 3',
    type: 'Payment Cert', 
    requester: 'Commercial Directorate', 
    submitted: '5 hours ago', 
    amount: 'AED 3,450,000',
    urgency: 'High',
    steps: [
      { label: 'Senior Quantity Surveyor', status: 'approved', by: 'Omar Farooq', date: '4 hours ago' },
      { label: 'Commercial Director', status: 'pending', by: 'Pending Approval', date: null },
      { label: 'Finance Disbursal', status: 'upcoming', by: null, date: null }
    ]
  }
];

export const DraftingApprovals = () => {
  const [approvalsList, setApprovalsList] = useState(uaeApprovalsList);
  const [activeItem, setActiveItem] = useState(uaeApprovalsList[0].id);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const activeApproval = approvalsList.find(a => a.id === activeItem);

  const filteredApprovals = approvalsList.filter(a => {
    const matchesFilter = filter === 'All' || 
      (filter === 'Action Required' && a.steps.some(s => s.status === 'pending')) || 
      (filter === 'Approved' && a.steps.every(s => s.status === 'approved')) ||
      (filter === 'Rejected' && a.steps.some(s => s.status === 'rejected'));
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.id.toLowerCase().includes(search.toLowerCase()) ||
                          a.project.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApproveCurrent = () => {
    if (!activeApproval) return;
    setApprovalsList(prev => prev.map(a => {
      if (a.id === activeApproval.id) {
        const updatedSteps = a.steps.map(s => s.status === 'pending' ? { ...s, status: 'approved', by: 'Current User', date: 'Just now' } : s);
        return { ...a, steps: updatedSteps };
      }
      return a;
    }));
    alert(`Workflow Approved: ${activeApproval.title}`);
  };

  const handleRejectCurrent = () => {
    if (!activeApproval) return;
    setApprovalsList(prev => prev.map(a => {
      if (a.id === activeApproval.id) {
        const updatedSteps = a.steps.map(s => s.status === 'pending' ? { ...s, status: 'rejected', by: 'Current User', date: 'Just now', note: 'Rejected for revision.' } : s);
        return { ...a, steps: updatedSteps };
      }
      return a;
    }));
    alert(`Workflow Returned for Revisions: ${activeApproval.title}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Document Approval Workflows
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Multi-stage digital sign-offs for contracts, variation orders, and payment certificates
          </p>
        </div>
      </div>

      {/* Main Split Layout: Left List + Right Detail */}
      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Workflows List */}
        <div style={{ flex: '0 0 420px', background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text" 
                placeholder="Search workflows, ID, or project..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Action Required', 'Approved', 'Rejected'].map(st => (
                <button 
                  key={st}
                  onClick={() => setFilter(st)}
                  style={{ 
                    padding: '3px 10px', borderRadius: 6, border: 'none', 
                    background: filter === st ? '#004753' : '#E2E8F0', 
                    color: filter === st ? 'white' : '#64748B', 
                    fontWeight: 700, fontSize: 11, cursor: 'pointer' 
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredApprovals.map((item) => {
              const isSelected = activeItem === item.id;
              const hasRejected = item.steps.some(s => s.status === 'rejected');
              const isAllApproved = item.steps.every(s => s.status === 'approved');
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setActiveItem(item.id)}
                  style={{ 
                    padding: '14px 16px', 
                    borderBottom: '1px solid #F1F5F9', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s',
                    background: isSelected ? 'rgba(0, 169, 197, 0.06)' : 'white',
                    borderLeft: isSelected ? '4px solid #004753' : '4px solid transparent'
                  }}
                  className="hover-bg-gray-50"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>{item.id}</span>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: 10, fontSize: 10.5, fontWeight: 800,
                      background: hasRejected ? '#FEE2E2' : isAllApproved ? '#ECFDF5' : '#FEF3C7',
                      color: hasRejected ? '#DC2626' : isAllApproved ? '#059669' : '#D97706'
                    }}>
                      {hasRejected ? 'Rejected' : isAllApproved ? 'Completed' : 'Pending Signature'}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, color: '#081E3C', fontSize: 13, marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 8 }}>
                    {item.project} • Requester: <strong>{item.requester}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#004753', background: 'rgba(0,71,83,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#081E3C' }}>
                      {item.amount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Approval Step Visualizer & Actions */}
        <div style={{ flex: 1, background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          {activeApproval ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#F8FAFC' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {activeApproval.id} • {activeApproval.type}
                  </span>
                  <h2 style={{ margin: '4px 0 2px 0', fontSize: 17, fontWeight: 900, color: '#081E3C' }}>
                    {activeApproval.title}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    {activeApproval.project} • Submitted {activeApproval.submitted}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Total Value / Impact</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#004753', marginTop: 2 }}>{activeApproval.amount}</div>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
                
                <div>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                    Sequential Approval Chain
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {activeApproval.steps.map((step, sIdx) => {
                      const isApproved = step.status === 'approved';
                      const isPending = step.status === 'pending';
                      const isRejected = step.status === 'rejected';

                      return (
                        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '14px 16px', 
                              borderRadius: 10, 
                              background: isApproved ? '#ECFDF5' : isRejected ? '#FEF2F2' : isPending ? '#FFFBEB' : '#F8FAFC',
                              border: `1px solid ${isApproved ? '#A7F3D0' : isRejected ? '#FCA5A5' : isPending ? '#FDE68A' : '#E2E8F0'}`,
                              position: 'relative',
                              zIndex: 2
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ 
                                width: 34, height: 34, borderRadius: '50%', 
                                background: isApproved ? '#059669' : isRejected ? '#DC2626' : isPending ? '#D97706' : '#94A3B8',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13,
                                flexShrink: 0,
                                boxShadow: isApproved ? '0 0 0 3px rgba(5,150,105,0.2)' : isPending ? '0 0 0 3px rgba(217,119,6,0.2)' : 'none',
                                zIndex: 3
                              }}>
                                {isApproved ? <Check size={16} /> : isRejected ? <X size={16} /> : sIdx + 1}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: '#081E3C' }}>
                                  {step.label}
                                </div>
                                <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                                  {step.by ? `Signatory: ${step.by}` : 'Pending assignment'}
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span style={{ 
                                fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 10,
                                background: isApproved ? '#D1FAE5' : isRejected ? '#FEE2E2' : isPending ? '#FEF3C7' : '#E2E8F0',
                                color: isApproved ? '#059669' : isRejected ? '#DC2626' : isPending ? '#D97706' : '#64748B'
                              }}>
                                {isApproved ? `Approved ${step.date}` : isRejected ? 'Rejected' : isPending ? 'Awaiting Signature' : 'Upcoming'}
                              </span>
                            </div>
                          </div>

                          {/* Connecting Checkpoint Line between steps */}
                          {sIdx < activeApproval.steps.length - 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', height: 16, marginLeft: 32, position: 'relative', zIndex: 1 }}>
                              <div style={{ 
                                width: 2, 
                                height: '100%', 
                                background: isApproved ? '#059669' : '#CBD5E1',
                                borderLeft: isApproved ? 'none' : '2px dashed #CBD5E1'
                              }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rejection Note Alert if applicable */}
                {activeApproval.steps.find(s => s.status === 'rejected')?.note && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: 14, borderRadius: 10, color: '#DC2626', fontSize: 12.5, fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <AlertCircle size={16} /> Approver Rejection Remarks:
                    </div>
                    <div>{activeApproval.steps.find(s => s.status === 'rejected').note}</div>
                  </div>
                )}

              </div>

              {/* Action Buttons Footer */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a 
                  href="/document-drafting"
                  style={{ fontSize: 12, fontWeight: 700, color: '#004753', textDecoration: 'none' }}
                >
                  View Full Document Canvas →
                </a>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={handleRejectCurrent}
                    style={{ padding: '8px 16px', background: 'white', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                  >
                    Reject & Request Changes
                  </button>
                  <button 
                    onClick={handleApproveCurrent}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 6px rgba(5,150,105,0.25)' }}
                  >
                    <Check size={15} /> Sign & Approve
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a workflow from the list to review sign-off steps
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
