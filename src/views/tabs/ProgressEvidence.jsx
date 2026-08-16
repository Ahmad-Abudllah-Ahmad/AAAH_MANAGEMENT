import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Image as ImageIcon, Search, 
  MapPin, Download, Maximize2, CornerUpRight, 
  CheckCircle2, ShieldAlert, X
} from 'lucide-react';

// Real high-resolution site photography assets
import cam09Img from '../../assets/cameras/cam-09.jpg';
import cam04Img from '../../assets/cameras/cam-04.jpg';
import cam07Img from '../../assets/cameras/cam-07.jpg';
import cam11Img from '../../assets/cameras/cam-11.jpg';
import cam02Img from '../../assets/cameras/cam-02.jpg';

const delayEvidenceMedia = [
  {
    id: 'EVID-01.102',
    title: 'Putzmeister Boom Pump Hydraulic Seal Failure',
    type: '4K CCTV Snap',
    category: 'Equipment Breakdown',
    date: 'May 14, 2026 14:22:18 GST',
    location: 'Level 03 East Deck (Grid C-4)',
    uploadedBy: 'AI Site Vision CAM-01',
    linkedTask: 'ACT-03.20 (L03 Pour)',
    wbsCode: 'WBS 03.30.01',
    delayImpact: '14 Hours (180 m³ cold joint risk)',
    costImpact: '$18,400',
    fidicNotice: 'Sub-Clause 20.1 Registered',
    img: '/cctv_tower_crane.jpg',
    tags: ['Concrete Pump', 'Equipment Failure', 'Active Pour', 'Critical Path'],
    description: 'Sudden hydraulic burst on 42m boom line during active Bay 3B pour. Standby pump redirected within 90 minutes to prevent cold joint formation.'
  },
  {
    id: 'EVID-01.103',
    title: 'Tower Crane 1 Slewing Radius High Wind Stoppage',
    type: 'Drone / Aerial',
    category: 'Adverse Weather',
    date: 'May 08, 2026 11:05:42 GST',
    location: 'Superstructure Core (+52.0m)',
    uploadedBy: 'DJI M300 Drone DRN-01',
    linkedTask: 'ACT-03.10 (Core Jump #11)',
    wbsCode: 'WBS 03.20.04',
    delayImpact: '8.5 Hours Site Standstill',
    costImpact: '$12,600',
    fidicNotice: 'Sub-Clause 8.4 Exception Registered',
    img: '/cctv_aerial_drone.jpg',
    tags: ['High Winds', 'Tower Crane', 'Safety Standdown', 'Potain MDT'],
    description: 'Gusting winds recorded at 48.2 km/h exceeding 38 km/h safe slewing envelope. Automatic crane lockdown triggered by safety telemetry system.'
  },
  {
    id: 'EVID-01.104',
    title: 'Curtain Wall Unitized Panel Anchor Alignment Deficit',
    type: 'Facade Photo',
    category: 'Design Change',
    date: 'Apr 28, 2026 09:14:05 GST',
    location: 'Level 24 Suspended Scaffolding Deck',
    uploadedBy: 'Alumco Facade Supervisor',
    linkedTask: 'ACT-05.10 (Glazing)',
    wbsCode: 'WBS 05.10.01',
    delayImpact: '4 Days Schedule Variance',
    costImpact: '$34,500',
    fidicNotice: 'Commercial Claim Submitted',
    img: '/cctv_scaffold_facade.jpg',
    tags: ['Facade Glazing', 'Curtain Wall', 'Anchor Channel'],
    description: 'Cast-in Halfen channel tolerance deviation requires custom shimming brackets cleared with Foster + Partners.'
  },
  {
    id: 'EVID-01.105',
    title: 'Deep Shoring Pit Excavation Groundwater Remediation',
    type: 'Site Photo',
    category: 'Site Condition',
    date: 'Mar 18, 2026 16:40:22 GST',
    location: 'North Foundation Pit (-14.2m)',
    uploadedBy: 'Geotechnical Lead Sarah L.',
    linkedTask: 'ACT-02.20 (Raft Prep)',
    wbsCode: 'WBS 02.20.01',
    delayImpact: '5 Days Dewatering Remediation',
    costImpact: '$24,800',
    fidicNotice: 'Unforeseen Physical Conditions',
    img: '/cctv_excavation_pit.jpg',
    tags: ['Groundwater', 'Dewatering', 'Foundation Pit', 'Geotech'],
    description: 'Uncharted sub-surface water table rise in north corner. 3 additional submersible dewatering pumps installed and perimeter sump lines cleared.'
  },
  {
    id: 'EVID-01.106',
    title: 'Batching Plant Slump Verification Queue at Gate 1',
    type: '4K CCTV Snap',
    category: 'Logistics Bottleneck',
    date: 'Apr 12, 2026 08:30:10 GST',
    location: 'Gate 1 Access & Weighbridge',
    uploadedBy: 'AI Site Vision CAM-03',
    linkedTask: 'ACT-02.30 (Raft Pour)',
    wbsCode: 'WBS 02.30.03',
    delayImpact: '2.5 Hours Mixer Slump Degradation',
    costImpact: '$8,200',
    fidicNotice: 'Traffic Management Review',
    img: '/cctv_entrance_gate.jpg',
    tags: ['Gate Access', 'Transit Queue', 'Concrete Mixer', 'Slump Test'],
    description: 'External municipal road diversion caused 6 transit mixers to exceed 90-minute batch-to-pour window. Strict slump testing enforced before discharge.'
  },
  {
    id: 'EVID-01.107',
    title: 'Concrete Batching Plant Silo Refill Operation',
    type: '4K CCTV Snap',
    category: 'Supply Chain Delay',
    date: 'Apr 04, 2026 10:15:00 GST',
    location: 'Zone D Concrete Depot',
    uploadedBy: 'AI Site Vision CAM-05',
    linkedTask: 'ACT-02.30 (C40 Concrete)',
    wbsCode: 'WBS 02.30.04',
    delayImpact: '3 Hours Transit Staging',
    costImpact: '$6,400',
    fidicNotice: 'Sub-Clause 20.1 Registered',
    img: '/cctv_batching_plant.jpg',
    tags: ['Batching Plant', 'C40 Concrete', 'Silo Refill'],
    description: 'Bulk cement tanker discharge into Silo 2 completed with calibrated load cell certification.'
  }
];

export const ProgressEvidence = () => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredMedia = delayEvidenceMedia.filter(m => {
    const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.location.toLowerCase().includes(search.toLowerCase()) ||
                          m.wbsCode.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      <div style={{ background: 'white', padding: '16px 22px', borderRadius: 14, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
            <Camera size={22} color="#4F46E5" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Visual Delay Evidence & Audit Gallery
              </h1>
              <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10.5, fontWeight: 800, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>
                FIDIC SUB-CLAUSE 20.1 AUDIT
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: 12.5, margin: '2px 0 0 0' }}>
              Time-Stamped 4K Site Imagery • AI Defect Detection • Forensic Delay Claim Dossiers
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => showToast('Compiling FIDIC Extension of Time (EOT) Evidence Dossier...')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Download size={15} /> Export Evidence Dossier
          </button>
        </div>
      </div>

      {/* Top 4 Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Stored Site Evidence</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>1,420 Items</div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>100% Geotagged & Encrypted</div>
          </div>
          <div style={{ padding: 10, background: '#F1F5F9', borderRadius: 8, color: '#475569' }}>
            <ImageIcon size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>Active Delay Claims</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626', marginTop: 2 }}>5 Dossiers</div>
            <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>Total Impact: $98,500</div>
          </div>
          <div style={{ padding: 10, background: '#FEF2F2', borderRadius: 8, color: '#DC2626' }}>
            <ShieldAlert size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #FED7AA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>Drone Flights</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706', marginTop: 2 }}>18 Missions</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>LiDAR Point Cloud Synced</div>
          </div>
          <div style={{ padding: 10, background: '#FFFBEB', borderRadius: 8, color: '#D97706' }}>
            <Camera size={20} />
          </div>
        </div>

        <div style={{ background: 'white', padding: '14px 18px', borderRadius: 12, border: '1px solid #C7D2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>Consultant Review</span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#4F46E5', marginTop: 2 }}>4 Approved</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>1 Pending Evaluation</div>
          </div>
          <div style={{ padding: 10, background: '#EEF2FF', borderRadius: 8, color: '#4F46E5' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{ background: 'white', padding: '12px 18px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '7px 12px', borderRadius: 8, border: '1px solid #CBD5E1', width: '100%', maxWidth: 380 }}>
          <Search size={16} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search by event, location, or WBS activity..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#0F172A' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', 'Equipment Breakdown', 'Adverse Weather', 'Supply Chain Delay', 'Site Condition', 'Logistics Bottleneck'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: filterCategory === cat ? 'none' : '1px solid #E2E8F0',
                background: filterCategory === cat ? 'var(--gradient-brand)' : 'white',
                color: filterCategory === cat ? 'white' : '#64748B',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: filterCategory === cat ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filteredMedia.map((media) => (
          <div 
            key={media.id}
            onClick={() => setSelectedEvidence(media)}
            style={{
              background: 'white',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            {/* Image Preview with Badges */}
            <div style={{ height: 210, position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
              <img 
                src={media.img} 
                alt={media.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Top Tags */}
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#38BDF8', fontSize: 10, fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)' }}>
                  {media.type}
                </span>
                <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(220, 38, 38, 0.85)', backdropFilter: 'blur(4px)', color: 'white', fontSize: 10, fontWeight: 800 }}>
                  {media.category}
                </span>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvidence(media);
                }}
                style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F172A' }}
              >
                <Maximize2 size={15} />
              </button>

              {/* Bottom Timestamp overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: 'white', fontSize: 11, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{media.date}</span>
                <span style={{ color: '#FCD34D' }}>{media.uploadedBy}</span>
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.35 }}>
                {media.title}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                <MapPin size={13} color="#4F46E5" />
                <span>{media.location}</span>
              </div>

              <p style={{ fontSize: 11.5, color: '#475569', margin: '8px 0 12px 0', lineHeight: 1.45 }}>
                {media.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto', background: '#F8FAFC', padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 700 }}>SCHEDULE IMPACT</div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#DC2626' }}>{media.delayImpact}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 700 }}>COST EXPOSURE</div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A' }}>{media.costImpact}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 4 }}>
                  <CornerUpRight size={12} /> {media.wbsCode}
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669' }}>
                  {media.fidicNotice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forensic Lightbox Modal */}
      <AnimatePresence>
        {selectedEvidence && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', borderRadius: 16, maxWidth: 840, width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
            >
              {/* Modal Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: 4 }}>
                    FIDIC SUB-CLAUSE 20.1 FORENSIC DOSSIER
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
                    {selectedEvidence.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedEvidence(null)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderRadius: 10, overflow: 'hidden', maxHeight: 380, background: '#0F172A' }}>
                  <img 
                    src={selectedEvidence.img} 
                    alt={selectedEvidence.title}
                    style={{ width: '100%', height: '100%', maxHeight: 380, objectFit: 'contain' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>TIMESTAMP & SENSOR</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedEvidence.date}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>LINKED P6 ACTIVITY</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', marginTop: 2 }}>{selectedEvidence.linkedTask}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>DELAY IMPACT</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', marginTop: 2 }}>{selectedEvidence.delayImpact}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>COST EXPOSURE</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedEvidence.costImpact}</div>
                  </div>
                </div>

                <div style={{ background: '#EFF6FF', padding: '12px 14px', borderRadius: 8, border: '1px solid #BFDBFE', fontSize: 12, color: '#1E40AF', lineHeight: 1.5 }}>
                  <strong>Forensic Observation Log:</strong> {selectedEvidence.description}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#F8FAFC' }}>
                <button 
                  onClick={() => {
                    showToast('Attaching high-resolution image to EOT Claim Package...');
                    setSelectedEvidence(null);
                  }}
                  style={{ padding: '8px 16px', background: '#4F46E5', color: 'white', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  Attach to EOT Claim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
