import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Maximize, Pause, Settings, ChevronDown, CheckCircle2, 
  ChevronRight, AlertTriangle, Play, Layers, ShieldCheck, Eye, EyeOff, 
  Download, Bell, Share2, Filter, UserCheck, Truck, RefreshCw, X, Radio
} from 'lucide-react';
import { Button, ProcessFlowStepper } from '../components/ui';

import cam07Img from '../assets/cameras/cam-07.jpg';
import cam02Img from '../assets/cameras/cam-02.jpg';
import cam04Img from '../assets/cameras/cam-04.jpg';
import cam09Img from '../assets/cameras/cam-09.jpg';
import cam11Img from '../assets/cameras/cam-11.jpg';

export const SiteMonitoring = () => {
  const [activeCamera, setActiveCamera] = useState('cam-07');
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOverlays, setShowOverlays] = useState(true);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [hoveredDetection, setHoveredDetection] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [timeFilter, setTimeFilter] = useState('Today');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Live seconds ticker
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Alert Routing Toggles
  const [routingToggles, setRoutingToggles] = useState({ 
    dashboard: true, 
    email: true, 
    teams: true, 
    whatsapp: true 
  });

  // Violations log
  const [violations, setViolations] = useState([
    { 
      id: 1, 
      camId: 'cam-07',
      time: '14:32', 
      desc: 'Missing hard hat — CAM-07 Level 3', 
      detail: 'Worker spotted on Level 3 East slab pouring concrete without certified safety helmet.',
      status: 'danger', 
      unacked: true,
      badge: 'NO HARD HAT',
      thumb: cam07Img
    },
    { 
      id: 2, 
      camId: 'cam-11',
      time: '14:19', 
      desc: 'Restricted zone intrusion — CAM-11', 
      detail: 'Personnel entered 15m radius directly below active tower crane suspended steel load.',
      status: 'danger', 
      unacked: true,
      badge: 'ZONE INTRUSION',
      thumb: cam11Img
    },
    { 
      id: 3, 
      camId: 'cam-07',
      time: '13:54', 
      desc: 'Fall harness not detected — CAM-07', 
      detail: 'Worker operating near perimeter formwork edge without anchored fall arrest lanyard.',
      status: 'warning', 
      unacked: false,
      badge: 'NO HARNESS',
      thumb: cam07Img
    },
    { 
      id: 4, 
      camId: 'cam-04',
      time: '13:11', 
      desc: 'Housekeeping obstruction — CAM-04', 
      detail: 'Temporary timber barricade left blocking active forklift access aisle in stockyard.',
      status: 'warning', 
      unacked: false,
      badge: 'AISLE BLOCKED',
      thumb: cam04Img
    },
    { 
      id: 5, 
      camId: 'cam-02',
      time: '12:40', 
      desc: 'Resolved — hard hat compliance CAM-02', 
      detail: 'All incoming subcontractor personnel cleared at security turnstile with full PPE.',
      status: 'success', 
      unacked: false,
      badge: 'RESOLVED',
      thumb: cam02Img
    }
  ]);

  // Camera Feeds Database with exact pixel-accurate spatial detections for each camera image
  const cameraFeeds = {
    'cam-07': {
      id: 'cam-07',
      label: 'CAM-07 — Level 3 Slab (East)',
      location: 'Zone A - East Tower Deck',
      image: cam07Img,
      stats: { persons: 8, vehicles: 1, violations: 2 },
      fps: 30,
      bitrate: '4.8 Mbps',
      resolution: '4K UHD (3840x2160)',
      detections: [
        {
          id: 'det-07-1',
          type: 'zone',
          label: 'RESTRICTED ZONE — CRANE & PUMP SWING',
          sub: 'Active concrete boom swing sector',
          style: { top: '8.0%', left: '50.0%', width: '44.0%', height: '38.0%' },
          polygon: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)',
          color: 'var(--color-danger-600)',
          confidence: 'Active (1 Alert)'
        },
        {
          id: 'det-07-2',
          type: 'person',
          label: 'PPE OK — 0.98',
          trackId: '#TRK-491',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '38.4%', left: '25.0%', width: '4.9%', height: '16.1%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-3',
          type: 'person',
          label: 'PPE OK — 0.97',
          trackId: '#TRK-502',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '43.9%', left: '43.0%', width: '6.0%', height: '20.3%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-4',
          type: 'person',
          label: 'NO HARD HAT — 0.95',
          trackId: '#TRK-498',
          items: 'Red/Orange Baseball Cap • Safety Helmet: MISSING',
          style: { top: '46.0%', left: '49.0%', width: '6.9%', height: '23.0%' },
          color: 'var(--color-danger-600)',
          isViolation: true
        },
        {
          id: 'det-07-5',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-505',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '43.0%', left: '52.0%', width: '4.9%', height: '20.8%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-6',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-509',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '45.1%', left: '54.9%', width: '7.0%', height: '20.1%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-7',
          type: 'person',
          label: 'PPE OK — 0.97',
          trackId: '#TRK-514',
          items: 'Hard Hat: Yes • Orange Vest: Yes • Boots: Yes',
          style: { top: '46.9%', left: '61.0%', width: '6.9%', height: '24.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-8',
          type: 'person',
          label: 'PPE OK — 0.94',
          trackId: '#TRK-480',
          items: 'Formwork Gangway • Vest: Yes • Boots: Yes',
          style: { top: '34.0%', left: '4.9%', width: '4.9%', height: '10.8%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-07-9',
          type: 'person',
          label: 'NO HARNESS — 0.89',
          trackId: '#TRK-533',
          items: 'Warning: Edge Proximity < 1.5m • Lanyard Not Detected',
          style: { top: '38.9%', left: '84.7%', width: '5.0%', height: '6.5%' },
          color: 'var(--color-warning-600)',
          isViolation: true
        }
      ]
    },

    'cam-02': {
      id: 'cam-02',
      label: 'CAM-02 — Gate 1 Entrance & Logistics',
      location: 'Main Site Access Checkpoint',
      image: cam02Img,
      stats: { persons: 11, vehicles: 2, violations: 0 },
      fps: 30,
      bitrate: '3.6 Mbps',
      resolution: '1080p Full HD',
      detections: [
        {
          id: 'det-02-1',
          type: 'vehicle',
          label: 'VEHICLE: CONCRETE MIXER — 0.99',
          trackId: '#VEH-082',
          items: 'Speed: 8 MPH (Compliant) • Plate: DXB-59821 • Security Cleared',
          style: { top: '18.0%', left: '54.0%', width: '31.9%', height: '37.9%' },
          color: 'var(--color-info-600)'
        },
        {
          id: 'det-02-2',
          type: 'person',
          label: 'SECURITY OFFICER — 0.98',
          trackId: '#SEC-01',
          items: 'Authorized Guard • Station: Gate 1 Booth Door',
          style: { top: '59.0%', left: '15.0%', width: '10.0%', height: '28.8%' },
          color: 'var(--color-brand-600)'
        },
        {
          id: 'det-02-3',
          type: 'person',
          label: 'PPE COMPLIANT (BADGE #482) — 0.98',
          trackId: '#TRK-102',
          items: 'Badge Scanned • Hard Hat: Yes • High-Vis Vest: Yes',
          style: { top: '54.9%', left: '28.0%', width: '8.9%', height: '28.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-02-4',
          type: 'person',
          label: 'PPE OK — 0.97',
          trackId: '#TRK-108',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '53.9%', left: '41.9%', width: '8.0%', height: '27.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-02-5',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-112',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '59.9%', left: '49.0%', width: '7.9%', height: '27.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-02-6',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-115',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '63.9%', left: '57.0%', width: '6.9%', height: '27.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-02-7',
          type: 'person',
          label: 'PPE OK — 0.97',
          trackId: '#TRK-119',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '69.9%', left: '62.0%', width: '7.9%', height: '27.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-02-8',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-123',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Boots: Yes',
          style: { top: '75.9%', left: '68.0%', width: '8.9%', height: '24.0%' },
          color: 'var(--color-success-600)'
        }
      ]
    },

    'cam-04': {
      id: 'cam-04',
      label: 'CAM-04 — Stockyard & Materials Staging',
      location: 'Zone C - Logistics Yard',
      image: cam04Img,
      stats: { persons: 4, vehicles: 1, violations: 1 },
      fps: 25,
      bitrate: '4.2 Mbps',
      resolution: '4K UHD (3840x2160)',
      detections: [
        {
          id: 'det-04-1',
          type: 'vehicle',
          label: 'FORKLIFT IN MOTION — 0.98',
          trackId: '#FL-02',
          items: 'Driver: Certified • Beacons: Active • Speed: 5km/h',
          style: { top: '31.9%', left: '46.9%', width: '15.9%', height: '32.9%' },
          color: 'var(--color-info-600)'
        },
        {
          id: 'det-04-2',
          type: 'person',
          label: 'SPOTTER (PPE OK) — 0.97',
          trackId: '#TRK-881',
          items: 'High-Vis Vest: Yes • Helmet: Yes • Clear of Load',
          style: { top: '43.0%', left: '61.0%', width: '7.9%', height: '21.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-04-3',
          type: 'person',
          label: 'PPE OK — 0.96',
          trackId: '#TRK-874',
          items: 'Hard Hat: Yes • High-Vis Vest: Yes • Route: Clear',
          style: { top: '40.0%', left: '27.0%', width: '6.9%', height: '18.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-04-4',
          type: 'material',
          label: 'MATERIAL: REBAR #16 (128 BUNDLES) — 0.96',
          trackId: '#MAT-REB-16',
          items: 'Stacked Height: Safe (1.1m) • Count: 128 Bundles',
          style: { top: '50.0%', left: '3.0%', width: '36.9%', height: '45.8%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-04-5',
          type: 'material',
          label: 'MATERIAL: CMU PALLETS (46 BLOCKS) — 0.94',
          trackId: '#MAT-CMU-01',
          items: 'Stock: Below Reorder Threshold • Pallets: 46 units',
          style: { top: '46.9%', left: '32.0%', width: '39.9%', height: '50.9%' },
          color: 'var(--color-warning-600)'
        }
      ]
    },

    'cam-09': {
      id: 'cam-09',
      label: 'CAM-09 — Basement Excavation & Piling',
      location: 'Zone B - Deep Foundation Pit',
      image: cam09Img,
      stats: { persons: 9, vehicles: 2, violations: 1 },
      fps: 30,
      bitrate: '4.5 Mbps',
      resolution: '4K UHD (3840x2160)',
      detections: [
        {
          id: 'det-09-1',
          type: 'vehicle',
          label: 'EXCAVATOR CAT 340 — 0.99',
          trackId: '#EXC-01',
          items: 'Engine: Active • Dig Depth: -12.4m • Shoring: Monitored',
          style: { top: '50.0%', left: '52.0%', width: '29.9%', height: '33.9%' },
          color: 'var(--color-info-600)'
        },
        {
          id: 'det-09-2',
          type: 'vehicle',
          label: 'HAUL TRUCK IN LOADING ZONE — 0.97',
          trackId: '#TRK-DMP-03',
          items: 'Loading Active • Spotter: Present',
          style: { top: '56.9%', left: '69.0%', width: '14.0%', height: '19.9%' },
          color: 'var(--color-info-600)'
        },
        {
          id: 'det-09-3',
          type: 'person',
          label: 'EDGE CREW: WORKER 1 (PPE OK) — 0.98',
          trackId: '#TRK-911',
          items: 'Guardrail: Installed • Helmet: Yes • Vest: Yes',
          style: { top: '25.9%', left: '4.9%', width: '7.0%', height: '31.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-09-4',
          type: 'person',
          label: 'EDGE CREW: WORKER 2 (PPE OK) — 0.97',
          trackId: '#TRK-912',
          items: 'Helmet: Yes • Vest: Yes • Guardrail Compliant',
          style: { top: '24.0%', left: '12.0%', width: '5.9%', height: '27.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-09-5',
          type: 'person',
          label: 'EDGE CREW: WORKER 3 (PPE OK) — 0.98',
          trackId: '#TRK-913',
          items: 'Helmet: Yes • Vest: Yes',
          style: { top: '21.9%', left: '16.9%', width: '6.0%', height: '27.0%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-09-6',
          type: 'person',
          label: 'EDGE CREW: WORKER 4 (PPE OK) — 0.97',
          trackId: '#TRK-914',
          items: 'Helmet: Yes • Vest: Yes',
          style: { top: '19.9%', left: '20.0%', width: '5.9%', height: '22.9%' },
          color: 'var(--color-success-600)'
        },
        {
          id: 'det-09-7',
          type: 'hazard',
          label: 'TRENCH SAFETY: PROXIMITY ALERT — 0.91',
          trackId: '#HAZ-092',
          items: 'Worker spotted inside un-shored slope buffer zone',
          style: { top: '47.9%', left: '73.0%', width: '3.9%', height: '5.9%' },
          color: 'var(--color-warning-600)',
          isViolation: true
        }
      ]
    },

    'cam-11': {
      id: 'cam-11',
      label: 'CAM-11 — Tower Crane 4 Aerial View',
      location: 'Zone A - Tower Core Deck',
      image: cam11Img,
      stats: { persons: 6, vehicles: 0, violations: 1 },
      fps: 30,
      bitrate: '5.2 Mbps',
      resolution: '4K UHD (3840x2160)',
      detections: [
        {
          id: 'det-11-1',
          type: 'hazard',
          label: 'SUSPENDED LOAD: 2.8 TONNES — 0.99',
          trackId: '#CRN-LOAD-04',
          items: 'Steel Bundles • Rigging: Dual Wire Sling • Altitude: +64m',
          style: { top: '18.0%', left: '31.0%', width: '37.9%', height: '61.8%' },
          color: 'var(--color-danger-600)'
        },
        {
          id: 'det-11-2',
          type: 'zone',
          label: 'RESTRICTED DROP RADIUS — 15M DANGER ZONE',
          sub: 'Active load transit corridor',
          style: { top: '44.0%', left: '24.0%', width: '54.0%', height: '42.0%' },
          polygon: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          color: 'var(--color-danger-600)',
          confidence: 'Violation Detected'
        },
        {
          id: 'det-11-3',
          type: 'person',
          label: 'CRITICAL: WORKER UNDER LOAD — 0.96',
          trackId: '#TRK-902',
          items: 'Immediate Evacuation Triggered • Siren Active',
          style: { top: '81.0%', left: '41.0%', width: '3.9%', height: '6.8%' },
          color: 'var(--color-danger-600)',
          isViolation: true
        }
      ]
    }
  };

  const currentFeed = cameraFeeds[activeCamera] || cameraFeeds['cam-07'];
  const unackedCount = violations.filter(v => v.unacked).length;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcknowledge = () => {
    setViolations(prev => prev.map(v => ({ ...v, unacked: false })));
    triggerToast('All active violations acknowledged. Incident report dispatched to HSE.');
  };

  const handleExportEvidence = () => {
    triggerToast(`Exporting high-resolution CCTV evidence packet for ${currentFeed.label} (${currentTime.toLocaleTimeString()})...`);
  };

  const toggleRouting = (key) => {
    setRoutingToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      triggerToast(`Alert routing via ${key.toUpperCase()} ${updated[key] ? 'ENABLED' : 'DISABLED'}`);
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            style={{ 
              position: 'fixed', 
              top: 80, 
              right: 24, 
              zIndex: 100, 
              background: 'white', 
              padding: '14px 20px', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-lg)', 
              border: '1px solid var(--color-brand-200)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12 
            }}
          >
            <CheckCircle2 size={20} color="var(--color-success-600)" />
            <span className="text-body-m" style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <ProcessFlowStepper 
        steps={['Image Capture', 'Detection Models', 'Zone & Rule Check', 'Alerting', 'Evidence Log']} 
        currentStepIndex={3} 
      />

      <div style={{ display: 'flex', gap: 20, flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Panel A: Real-Time CCTV Feed (63%) */}
        <div style={{ flex: '0 0 63%', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div className="surface-glass" style={{ flex: 1, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-gray-200)', minHeight: 0 }}>
            
            {/* Topbar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', zIndex: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Project Selector */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--color-gray-200)', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'white', cursor: 'pointer' }}
                  >
                    PROJECT: AL BARSHA TOWER — PLOT 4 <ChevronDown size={14} />
                  </button>
                  {showProjectDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 30, minWidth: 260 }}>
                      {['AL BARSHA TOWER — PLOT 4', 'DOWNTOWN RESIDENCES — PHASE 2', 'MARINA GATEWAY — TOWER B'].map(p => (
                        <div key={p} onClick={() => { setShowProjectDropdown(false); triggerToast(`Connected to ${p}`); }} style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: p.includes('PLOT 4') ? 600 : 400 }} className="hover-bg-gray-50">
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Camera Selector Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowCameraDropdown(!showCameraDropdown)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--color-brand-300)', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--color-brand-50)', color: 'var(--color-brand-700)', cursor: 'pointer' }}
                  >
                    <Radio size={14} className="animate-pulse" />
                    {currentFeed.label} <ChevronDown size={14} />
                  </button>
                  {showCameraDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 30, minWidth: 280 }}>
                      {Object.keys(cameraFeeds).map(cKey => {
                        const cam = cameraFeeds[cKey];
                        return (
                          <div 
                            key={cam.id} 
                            onClick={() => { setActiveCamera(cam.id); setShowCameraDropdown(false); }} 
                            style={{ padding: '8px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: activeCamera === cam.id ? 700 : 500, color: activeCamera === cam.id ? 'var(--color-brand-700)' : 'var(--color-gray-800)' }} 
                            className="hover-bg-gray-50"
                          >
                            {cam.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* CCTV Live Controls & Stream Health */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                  <motion.div 
                    animate={isLive ? { scale: [1, 1.25, 1], opacity: [1, 0.4, 1] } : { opacity: 0.4 }} 
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: isLive ? 'var(--color-danger-600)' : 'var(--color-gray-400)' }} 
                  />
                  <span style={{ color: isLive ? 'var(--color-danger-600)' : 'var(--color-gray-500)', letterSpacing: 0.5 }}>
                    {isLive ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>

                <div className="text-body-m" style={{ color: 'var(--color-gray-700)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                  18/06/2026 {currentTime.toTimeString().split(' ')[0]}
                </div>

                <div style={{ width: 1, height: 20, background: 'var(--color-gray-200)' }} />

                {/* AI Overlays Toggle */}
                <button 
                  onClick={() => setShowOverlays(!showOverlays)}
                  title={showOverlays ? 'Hide AI Detection Bounding Boxes' : 'Show AI Detection Bounding Boxes'}
                  style={{ background: showOverlays ? 'var(--color-brand-100)' : 'white', border: '1px solid var(--color-gray-200)', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: showOverlays ? 'var(--color-brand-700)' : 'var(--color-gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {showOverlays ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>AI Detections</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isLive ? (
                    <button onClick={() => setIsLive(false)} title="Pause Stream" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}>
                      <Pause size={18} color="var(--color-gray-600)" />
                    </button>
                  ) : (
                    <button onClick={() => setIsLive(true)} title="Resume Stream" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}>
                      <Play size={18} color="var(--color-success-600)" />
                    </button>
                  )}
                  <button onClick={handleExportEvidence} title="Capture Snapshot" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}>
                    <Camera size={18} color="var(--color-gray-600)" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Camera Video Canvas with Real Photos & AI Bounding Boxes */}
            <div style={{ flex: 1, background: '#0B0F19', position: 'relative', overflow: 'hidden', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Authentic Camera Photographic Image Stream */}
                <img 
                  key={currentFeed.id}
                  src={currentFeed.image} 
                  alt={currentFeed.label}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'fill', 
                    display: 'block' 
                  }}
                />

                {/* CCTV Vignette & Scanlines Effect Overlay */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.55) 100%)',
                  pointerEvents: 'none' 
                }} />

              {/* Stream Telemetry Watermark (Top-Right) */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(6px)',
                padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                color: '#E2E8F0', fontSize: 11, fontWeight: 600,
                display: 'flex', gap: 12, alignItems: 'center'
              }}>
                <span style={{ color: '#38BDF8' }}>{currentFeed.resolution.split(' ')[0]}</span>
                <span>{currentFeed.fps} FPS</span>
                <span style={{ color: '#10B981' }}>{currentFeed.bitrate}</span>
                <span style={{ color: '#F59E0B' }}>42ms Latency</span>
              </div>

              {/* Live Overlay Stat Chips (Top-Left) */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, zIndex: 10 }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="text-caption" style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>Persons</div>
                  <div className="text-h2" style={{ fontSize: 18, color: '#38BDF8' }}>{currentFeed.stats.persons}</div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="text-caption" style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>Vehicles</div>
                  <div className="text-h2" style={{ fontSize: 18, color: '#FCD34D' }}>{currentFeed.stats.vehicles}</div>
                </div>

                <motion.div 
                  animate={currentFeed.stats.violations > 0 ? { scale: [1, 1.04, 1], borderColor: ['rgba(255,255,255,0.15)', 'rgba(239,68,68,0.8)', 'rgba(255,255,255,0.15)'] } : {}} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div className="text-caption" style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600 }}>Violations</div>
                  <div className="text-h2" style={{ fontSize: 18, color: currentFeed.stats.violations > 0 ? '#EF4444' : '#10B981' }}>
                    {currentFeed.stats.violations}
                  </div>
                </motion.div>
              </div>

              {/* Accurate AI Detection Bounding Boxes & Zones */}
              <AnimatePresence>
                {showOverlays && currentFeed.detections?.map((det) => {
                  if (det.type === 'zone') {
                    return (
                      <motion.div 
                        key={det.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ 
                          position: 'absolute', 
                          ...det.style,
                          background: 'rgba(239, 68, 68, 0.22)', 
                          border: '2px dashed #EF4444', 
                          clipPath: det.polygon,
                          pointerEvents: 'none',
                          zIndex: 5
                        }}
                      >
                        <div style={{ 
                          position: 'absolute', top: '40%', left: '30%', 
                          background: '#EF4444', color: 'white', 
                          padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          whiteSpace: 'nowrap'
                        }}>
                          {det.label}
                          <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.9 }}>{det.sub}</div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div 
                      key={det.id}
                      initial={{ scale: 0.92, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      onMouseEnter={() => setHoveredDetection(det)}
                      onMouseLeave={() => setHoveredDetection(null)}
                      style={{ 
                        position: 'absolute', 
                        ...det.style,
                        border: `2px solid ${det.color}`,
                        borderRadius: 4,
                        boxShadow: det.isViolation ? `0 0 16px ${det.color}` : 'none',
                        cursor: 'pointer',
                        zIndex: 6,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Detection Label Badge */}
                      <div style={{ 
                        position: 'absolute', 
                        top: -24, 
                        left: -2, 
                        background: det.color, 
                        color: 'white', 
                        padding: '2px 8px', 
                        fontSize: 10, 
                        fontWeight: 800, 
                        borderRadius: 4, 
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        letterSpacing: 0.3
                      }}>
                        {det.label}
                      </div>

                      {/* Precise Corner Brackets (BIM/CCTV style) */}
                      <div style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderTop: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}` }} />
                      <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderTop: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}` }} />
                      <div style={{ position: 'absolute', bottom: -2, left: -2, width: 8, height: 8, borderBottom: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}` }} />
                      <div style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, borderBottom: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}` }} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Hover Inspection Breakdown Card */}
              <AnimatePresence>
                {hoveredDetection && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${hoveredDetection.color}`,
                      borderRadius: 8,
                      padding: '8px 14px',
                      color: 'white',
                      fontSize: 11,
                      zIndex: 20,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16
                    }}
                  >
                    <div>
                      <span style={{ color: '#94A3B8' }}>Detection: </span>
                      <strong style={{ color: hoveredDetection.color }}>{hoveredDetection.label}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Track ID: </span>
                      <strong>{hoveredDetection.trackId}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Analysis: </span>
                      <strong style={{ color: '#E2E8F0' }}>{hoveredDetection.items}</strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>

            {/* Thumbnail Strip with Real Camera Image Feeds */}
            <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid var(--color-gray-200)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { id: 'cam-02', label: 'CAM-02 Gate', status: 'success', img: cam02Img },
                { id: 'cam-04', label: 'CAM-04 Stockyard', status: 'warning', img: cam04Img },
                { id: 'cam-09', label: 'CAM-09 Basement', status: 'warning', img: cam09Img },
                { id: 'cam-11', label: 'CAM-11 Tower Crane', status: 'danger', img: cam11Img }
              ].map(cam => {
                const isActive = activeCamera === cam.id;
                return (
                  <div 
                    key={cam.id} 
                    onClick={() => setActiveCamera(cam.id)}
                    style={{ 
                      height: 84, 
                      borderRadius: 8, 
                      overflow: 'hidden', 
                      position: 'relative', 
                      cursor: 'pointer',
                      border: isActive ? '2.5px solid var(--color-brand-600)' : '1px solid var(--color-gray-300)',
                      boxShadow: isActive ? '0 4px 12px rgba(108,92,231,0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={cam.img} 
                      alt={cam.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 6, left: 8, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--color-${cam.status}-500)` }} />
                      <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{cam.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel B: Violation Feed & Live Logistics (37%) */}
        <div style={{ flex: '0 0 37%', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 }}>
          <div className="surface-glass" style={{ flex: 1, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', padding: 20, gap: 18, overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
            
            {/* Violation Header & Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="text-overline" style={{ color: 'var(--color-gray-500)', letterSpacing: 1 }}>VIOLATION FEED</h3>
                <span style={{ 
                  background: unackedCount > 0 ? 'var(--color-danger-50)' : 'var(--color-success-50)', 
                  color: unackedCount > 0 ? 'var(--color-danger-600)' : 'var(--color-success-700)',
                  fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6 
                }}>
                  {unackedCount} NEW
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => triggerToast('Showing all historical incident logs')}
                  style={{ color: 'var(--color-brand-600)', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  View all
                </button>
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    style={{ padding: '4px 8px', border: '1px solid var(--color-gray-200)', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'white' }}
                  >
                    {timeFilter} <ChevronDown size={14} />
                  </div>
                  {showTimeDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 4, zIndex: 30, minWidth: 120 }}>
                      {['Today', 'Yesterday', 'Past 7 Days'].map(t => (
                        <div key={t} onClick={() => { setTimeFilter(t); setShowTimeDropdown(false); }} style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: timeFilter === t ? 700 : 400 }} className="hover-bg-gray-50">
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Violation List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4, minHeight: 180 }}>
              <AnimatePresence>
                {violations.map((v, i) => (
                  <motion.div 
                    key={v.id}
                    layout
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      setActiveCamera(v.camId);
                      triggerToast(`Switched to ${v.camId.toUpperCase()} for incident #${v.id}`);
                    }}
                    style={{ 
                      display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', 
                      background: v.unacked ? 'var(--color-danger-50)' : 'white', 
                      borderRadius: 10, cursor: 'pointer',
                      border: v.unacked ? '1.5px solid var(--color-danger-300)' : '1px solid var(--color-gray-200)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: 4, height: 38, borderRadius: 2, background: `var(--color-${v.status}-500)` }} />
                    
                    {/* Realistic Snapshot Thumbnail */}
                    <div style={{ width: 46, height: 46, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid var(--color-gray-300)' }}>
                      <img src={v.thumb} alt={v.desc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span className="text-caption" style={{ fontWeight: 700, color: 'var(--color-gray-900)', fontSize: 11 }}>{v.time}</span>
                        <span style={{ 
                          fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4,
                          background: v.status === 'danger' ? 'var(--color-danger-100)' : v.status === 'warning' ? 'var(--color-warning-100)' : 'var(--color-success-100)',
                          color: v.status === 'danger' ? 'var(--color-danger-700)' : v.status === 'warning' ? 'var(--color-warning-700)' : 'var(--color-success-700)'
                        }}>
                          {v.badge}
                        </span>
                      </div>
                      <div className="text-body-s" style={{ color: 'var(--color-gray-800)', fontWeight: v.unacked ? 700 : 500, fontSize: 12 }}>
                        {v.desc}
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--color-gray-400)" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Materials & Alert Routing Cards */}
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Materials & Stock Card */}
              <div style={{ flex: 1, border: '1px solid var(--color-gray-200)', borderRadius: 10, padding: 12, background: 'white' }}>
                <h4 className="text-caption" style={{ color: 'var(--color-gray-500)', marginBottom: 10, fontWeight: 700, fontSize: 11 }}>MATERIALS & STOCK</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--color-gray-100)', padding: 4, borderRadius: 6 }}><Layers size={13} color="var(--color-gray-600)" /></div>
                    <div style={{ flex: 1 }}>
                      <div className="text-body-s" style={{ fontWeight: 600, fontSize: 11 }}>Rebar bundles</div>
                      <div className="text-caption" style={{ color: 'var(--color-gray-500)', fontSize: 10 }}>est. 128 units</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success-500)' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--color-gray-100)', padding: 4, borderRadius: 6 }}><Layers size={13} color="var(--color-gray-600)" /></div>
                    <div style={{ flex: 1 }}>
                      <div className="text-body-s" style={{ fontWeight: 600, fontSize: 11 }}>Block pallets</div>
                      <div className="text-caption" style={{ color: 'var(--color-warning-600)', fontSize: 10, fontWeight: 600 }}>46 • below reorder</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-warning-500)' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--color-danger-50)', padding: 4, borderRadius: 6 }}><AlertTriangle size={13} color="var(--color-danger-600)" /></div>
                    <div style={{ flex: 1 }}>
                      <div className="text-body-s" style={{ fontWeight: 600, fontSize: 11 }}>Damaged items</div>
                      <div className="text-caption" style={{ color: 'var(--color-danger-600)', fontSize: 10, fontWeight: 600 }}>3 flagged</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-danger-500)' }} />
                  </div>
                </div>
              </div>

              {/* Alert Routing Card */}
              <div style={{ flex: 1, border: '1px solid var(--color-gray-200)', borderRadius: 10, padding: 12, background: 'white' }}>
                <h4 className="text-caption" style={{ color: 'var(--color-gray-500)', marginBottom: 10, fontWeight: 700, fontSize: 11 }}>ALERT ROUTING</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'email', label: 'Email' },
                    { id: 'teams', label: 'Teams' },
                    { id: 'whatsapp', label: 'WhatsApp' }
                  ].map(method => (
                    <div 
                      key={method.id} 
                      onClick={() => toggleRouting(method.id)}
                      style={{ 
                        border: routingToggles[method.id] ? '1.5px solid var(--color-success-500)' : '1px solid var(--color-gray-200)', 
                        borderRadius: 6, padding: '8px 4px', 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, 
                        cursor: 'pointer', background: routingToggles[method.id] ? 'var(--color-success-50)' : 'var(--color-gray-50)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <CheckCircle2 size={13} color={routingToggles[method.id] ? 'var(--color-success-600)' : 'var(--color-gray-400)'} />
                      </div>
                      <span className="text-caption" style={{ color: routingToggles[method.id] ? 'var(--color-gray-900)' : 'var(--color-gray-400)', fontWeight: 600, fontSize: 10 }}>{method.label}</span>
                    </div>
                  ))}
                </div>
                <div className="text-caption" style={{ color: 'var(--color-gray-500)', marginTop: 8, textAlign: 'center', fontSize: 9 }}>
                  Routed by site, zone & severity
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <Button 
                variant="primary" 
                style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                onClick={handleAcknowledge}
                disabled={unackedCount === 0}
              >
                Acknowledge ({unackedCount})
              </Button>
              <Button 
                variant="secondary" 
                style={{ flex: 1, background: 'white', padding: '10px 14px', fontSize: 13 }}
                onClick={handleExportEvidence}
              >
                Export Evidence
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
