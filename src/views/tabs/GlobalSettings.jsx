import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Bell, Shield, Key, Users, User, Save, CheckCircle2, Sliders, Database, EyeOff,
  FileText, Scaling, Video, AlertTriangle, FileSignature, BookOpen, BarChart2,
  Lock, Globe, Cpu, RefreshCw, Check, Sparkles, Camera, MapPin, Mail, Phone, Building2
} from 'lucide-react';

export const GlobalSettings = ({ tab = 'General' }) => {
  const [activeTab, setActiveTab] = useState(tab);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const tabsMeta = {
    'Profile': { label: 'User Profile', icon: <User size={20} color="#004753" /> },
    'General': { label: 'General System', icon: <Settings size={20} color="#004753" /> },
    'Document OCR': { label: 'Document OCR', icon: <FileText size={20} color="#004753" /> },
    'Drawing Scanner': { label: 'Drawing Scanner', icon: <Scaling size={20} color="#004753" /> },
    'Site Monitoring': { label: 'Site Monitoring', icon: <Video size={20} color="#004753" /> },
    'Clash Detection': { label: 'Clash & BIM', icon: <AlertTriangle size={20} color="#004753" /> },
    'Document Drafting': { label: 'Document Drafting', icon: <FileSignature size={20} color="#004753" /> },
    'Knowledge Assistant': { label: 'Knowledge Assistant', icon: <BookOpen size={20} color="#004753" /> },
    'Progress Monitoring': { label: 'Progress Monitoring', icon: <BarChart2 size={20} color="#004753" /> },
    'API Keys': { label: 'API & Integrations', icon: <Key size={20} color="#004753" /> },
    'Security': { label: 'Security & Access', icon: <Shield size={20} color="#004753" /> },
  };

  const currentMeta = tabsMeta[activeTab] || tabsMeta['Profile'];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ label, desc, defaultChecked = false }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
        <div style={{ maxWidth: '82%' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#081E3C', marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{desc}</div>
        </div>
        <div 
          onClick={() => setChecked(!checked)}
          style={{ width: 44, height: 24, borderRadius: 12, background: checked ? '#004753' : '#CBD5E1', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}
        >
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
        </div>
      </div>
    );
  };

  const InputRow = ({ label, type = 'text', defaultValue, placeholder, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
      <label style={{ fontWeight: 700, fontSize: 12.5, color: '#081E3C' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          type={type} 
          defaultValue={defaultValue} 
          placeholder={placeholder}
          style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none', background: 'white', color: '#081E3C', fontWeight: 600 }}
        />
        {type === 'password' && <EyeOff size={16} color="#94A3B8" style={{ position: 'absolute', right: 12, top: 11, cursor: 'pointer' }} />}
      </div>
      {hint && <span style={{ fontSize: 11, color: '#64748B' }}>{hint}</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#081E3C', margin: '0 0 4px 0' }}>
            Enterprise Settings — {currentMeta.label}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Manage your personal profile, credentials, system parameters, and module configurations
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handleSave} 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: saved ? '#059669' : 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', width: 145, justifyContent: 'center', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            {saved ? <><CheckCircle2 size={16} /> Saved</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Main Content Form Card */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', maxWidth: 880 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#081E3C', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                {currentMeta.icon} {currentMeta.label} Configuration
              </h2>
              <span style={{ fontSize: 11, color: '#00A9C5', fontWeight: 800, background: 'rgba(0, 169, 197, 0.1)', padding: '3px 8px', borderRadius: 6 }}>
                PRODUCTION INSTANCE
              </span>
            </div>

            {/* 0. User Profile (Top of Settings Sidebar) */}
            {activeTab === 'Profile' && (
              <div style={{ maxWidth: 640 }}>
                {/* Profile Avatar Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#F8FAFC', padding: 18, borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#004753', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, position: 'relative', boxShadow: '0 4px 10px rgba(0,71,83,0.25)' }}>
                    RK
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: '#059669', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="white" />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#081E3C' }}>Eng. Rashid Khan</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Senior Project Director & Lead BIM Manager</div>
                    <div style={{ fontSize: 11, color: '#00A9C5', fontWeight: 700, marginTop: 4 }}>Al Wasl Construction Group • Level 1 Clearance</div>
                  </div>
                  <button 
                    onClick={() => alert("Avatar updated successfully!")}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 11.5, fontWeight: 700, color: '#081E3C', cursor: 'pointer' }}
                  >
                    <Camera size={14} /> Change Photo
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <InputRow label="First Name" defaultValue="Rashid" />
                  <InputRow label="Last Name" defaultValue="Khan" />
                </div>

                <InputRow label="Official Work Email" defaultValue="rashid.khan@alwasl-group.ae" />
                <InputRow label="UAE Contact Mobile" defaultValue="+971 50 892 4153" />
                <InputRow label="Primary Project Office" defaultValue="Saadiyat Cultural District PMO, Abu Dhabi, UAE" />
                <InputRow label="Role & Statutory Permissions" defaultValue="Project Director (Full Financial & Model Approval Authority)" />

                <div style={{ marginTop: 10, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#081E3C', marginBottom: 12 }}>Security Credentials</h3>
                  <InputRow label="Change Account Password" type="password" placeholder="Enter new master password..." />
                  <Toggle label="Two-Factor SMS / Authenticator App (2FA)" desc="Require biometric or TOTP authentication on every login." defaultChecked={true} />
                </div>
              </div>
            )}

            {/* 1. General System */}
            {activeTab === 'General' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Enterprise Tenant Name" defaultValue="Al Wasl Construction Group LLC" />
                <InputRow label="Regional Timezone" defaultValue="Asia/Dubai (GST UTC+4)" />
                <InputRow label="Measurement Units" defaultValue="Metric (SI: mm, m, m², m³, kg, MT)" />
                <Toggle label="Automated Daily Cloud Sync" desc="Backup all OCR, CAD, and BCF logs nightly to regional cloud." defaultChecked={true} />
                <Toggle label="Strict Audit Trail (ISO 9001)" desc="Log all user actions, document approvals, and model modifications." defaultChecked={true} />
                <Toggle label="High-Contrast Dark Mode" desc="Enable darkened UI accents for field inspection tablets." defaultChecked={false} />
              </div>
            )}

            {/* 2. Document OCR */}
            {activeTab === 'Document OCR' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="OCR Confidence Score Threshold (%)" defaultValue="92" hint="Invoices with lower confidence will be flagged for manual human verification." />
                <InputRow label="Default Currency Format" defaultValue="AED (United Arab Emirates Dirham)" />
                <Toggle label="3-Way PO & Delivery Note Auto-Matching" desc="Automatically reconcile Tax Invoices with ERP Purchase Orders and GRNs." defaultChecked={true} />
                <Toggle label="FTA Compliant QR Code Validation" desc="Enforce UAE Federal Tax Authority compliant TRN and VAT verification." defaultChecked={true} />
                <Toggle label="Duplicate Invoice Sentinel" desc="Instantly block duplicate invoice reference numbers across subcontractors." defaultChecked={true} />
              </div>
            )}

            {/* 3. Drawing Scanner */}
            {activeTab === 'Drawing Scanner' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="CAD Vector Snapping Tolerance (mm)" defaultValue="5" hint="Precision limit when measuring floor plan areas and polyline perimeters." />
                <InputRow label="Default BOQ Standard" defaultValue="POMI / NRM2 Standard Method of Measurement" />
                <Toggle label="Neural Architectural Symbol Recognition" desc="Detect doors, windows, rebar bar marks, and sanitary fixtures via YOLOv8." defaultChecked={true} />
                <Toggle label="Multi-Sheet Batch OCR Ingestion" desc="Process multi-page PDF blueprint packages simultaneously in the background." defaultChecked={true} />
                <Toggle label="Automated BOQ Excel Sync" desc="Auto-export tabulated takeoffs directly into Primavera P6 & CostX format." defaultChecked={true} />
              </div>
            )}

            {/* 4. Site Monitoring */}
            {activeTab === 'Site Monitoring' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="RTSP Camera Ingest Gateway" defaultValue="rtsp://cctv.alwasl-tower.ae:554/live" />
                <InputRow label="Drone Mission Auto-Sync Frequency" defaultValue="Every 4 Hours (Autonomous Dock)" />
                <Toggle label="OSHAD Safety Fine Citation Engine" desc="Automatically generate statutory fine notices in AED for missing PPE or zone intrusions." defaultChecked={true} />
                <Toggle label="MOHRE Midday Summer Break Enforcement" desc="Trigger site alerts during statutory 12:30 PM – 03:00 PM GST heat protocols." defaultChecked={true} />
                <Toggle label="Biometric Gate Headcount Live Telemetry" desc="Sync turnstile ingress/egress records with site safety muster roll." defaultChecked={true} />
              </div>
            )}

            {/* 5. Clash Detection & BIM */}
            {activeTab === 'Clash Detection' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Clash Hard Penetration Tolerance (mm)" defaultValue="10" hint="Interferences smaller than 10mm are treated as minor clearance issues." />
                <InputRow label="OpenBIM BCF Protocol Version" defaultValue="BCF-XML 2.1 / BCF-API 3.0" />
                <Toggle label="Auto-Generate Weekly Coordination Dossiers" desc="Compile weekly unresolved multi-trade clashes into PDF/BCF packages every Friday." defaultChecked={true} />
                <Toggle label="Autodesk Construction Cloud (ACC) Webhook Sync" desc="Synchronize federated Revit .RVT and IFC4 models automatically on commit." defaultChecked={true} />
                <Toggle label="ISO 19650 Health Score Guardrails" desc="Enforce minimum 80% model health score before issuing construction IFC packages." defaultChecked={true} />
              </div>
            )}

            {/* 6. Document Drafting */}
            {activeTab === 'Document Drafting' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Default Contract Framework" defaultValue="FIDIC Red Book 1999 / 2017 Conditions of Contract" />
                <InputRow label="RFI Auto-Numbering Prefix" defaultValue="AWT-RFI-2026-" />
                <Toggle label="Automated Statutory Delay Clause Linking" desc="Auto-reference Sub-Clause 20.1 and 8.4 in delay notice drafts." defaultChecked={true} />
                <Toggle label="Digital PKI Signature Enforcement" desc="Enforce cryptographic digital signatures for all Issued for Construction packages." defaultChecked={true} />
              </div>
            )}

            {/* 7. Knowledge Assistant */}
            {activeTab === 'Knowledge Assistant' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Vector Embedding Engine" defaultValue="Titan Semantic Embeddings v2 (1536-dim)" />
                <InputRow label="Connected Project Repositories" defaultValue="Aconex CDE, Dubai Municipality Codes, Abu Dhabi DCR 2024" />
                <Toggle label="Contextual Drawing Citation Anchors" desc="Include direct page and grid-reference citations in AI assistant answers." defaultChecked={true} />
                <Toggle label="Confidential Financial Redaction" desc="Hide contract prices and commercial claims from non-executive team roles." defaultChecked={true} />
              </div>
            )}

            {/* 8. Progress Monitoring */}
            {activeTab === 'Progress Monitoring' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Primavera P6 Server Connection" defaultValue="https://p6.alwasl-pmo.ae/p6ws/services" />
                <InputRow label="EVM Standard Calculation Model" defaultValue="ISO 21508 / PMBOK 7th Edition" />
                <Toggle label="Critical Path Negative Float Sentinel" desc="Instantly alert project managers if critical float drops below -10 days." defaultChecked={true} />
                <Toggle label="4D BIM Weekly Time-lapse Auto-Playback" desc="Interpolate 4D structural completion models against current weekly drone scans." defaultChecked={true} />
              </div>
            )}

            {/* 9. API Keys & Integrations */}
            {activeTab === 'API Keys' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Firecrawl Web Scraping API Key" type="password" defaultValue="9ca24dfb337e46d192c08e01c11cb8db" />
                <InputRow label="Autodesk Construction Cloud Client ID" type="password" defaultValue="acc_client_sec_9942a781b" />
                <InputRow label="Aconex Integration Key" type="password" defaultValue="acx_prod_live_88421b" />
                <InputRow label="Enterprise Webhook Endpoint" defaultValue="https://api.aaah-platform.com/v1/webhook" />
              </div>
            )}

            {/* 10. Security & Access */}
            {activeTab === 'Security' && (
              <div style={{ maxWidth: 640 }}>
                <InputRow label="Session Timeout (Minutes)" defaultValue="60" />
                <InputRow label="Password Expiry Policy" defaultValue="90 Days with 2FA Mandatory" />
                <Toggle label="Role-Based Subcontractor Isolation" desc="Restrict trade subcontractors to viewing only their assigned WBS packages." defaultChecked={true} />
                <Toggle label="Biometric Turnstile Access Revocation" desc="Immediately deactivate site access badges for safety blacklisted personnel." defaultChecked={true} />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
