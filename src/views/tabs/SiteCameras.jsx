import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Search, Plus, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, 
  Battery, Settings, Power, Wifi, Maximize2, RefreshCw, Eye, Sliders, Check, Radio, X
} from 'lucide-react';

const uaeCameraFleet = [
  { 
    id: 'CAM-01', 
    name: 'Tower Crane 01 — 360° Hook Top Cam', 
    location: 'Zone A — Main Core High-Rise (Level 42)', 
    type: '4K AI PTZ', 
    status: 'Online', 
    resolution: '4K UltraHD', 
    fps: 30, 
    connection: 'Strong', 
    activeDetections: 'PPE + Hook Radius Exclusion Zone',
    image: '/cctv_tower_crane.jpg',
    aiBoxes: [
      { top: '35%', left: '30%', width: '18%', height: '28%', label: 'Worker (Hard Hat + Vest)', conf: '99.2%', color: '#10B981' },
      { top: '55%', left: '46%', width: '14%', height: '32%', label: 'Rebar Steel Fixer (PPE OK)', conf: '98.7%', color: '#10B981' }
    ]
  },
  { 
    id: 'CAM-02', 
    name: 'Deep Excavation Pit Shoring Cam', 
    location: 'Zone B — Foundation North Pit', 
    type: 'Fixed 4K Optical', 
    status: 'Online', 
    resolution: '1080p 60fps', 
    fps: 60, 
    connection: 'Strong', 
    activeDetections: 'Trench Slope & Excavator Exclusion',
    image: '/cctv_excavation_pit.jpg',
    aiBoxes: [
      { top: '58%', left: '26%', width: '22%', height: '32%', label: 'CAT 336 Excavator (Moving)', conf: '99.5%', color: '#00A9C5' },
      { top: '62%', left: '56%', width: '20%', height: '30%', label: 'Komatsu Digger (Operating)', conf: '99.1%', color: '#00A9C5' }
    ]
  },
  { 
    id: 'DRN-01', 
    name: 'Site Perimeter Patrol Drone (DJI M300)', 
    location: 'Aerial Patrol Sector 4 — Perimeter Yard', 
    type: 'Thermal AI Drone', 
    status: 'Active (Patrol)', 
    resolution: '4K Optical + FLIR', 
    fps: 30, 
    battery: '82%', 
    connection: 'Strong', 
    activeDetections: 'Perimeter Intrusion + Heat Stress',
    image: '/cctv_aerial_drone.jpg',
    aiBoxes: [
      { top: '22%', left: '32%', width: '30%', height: '38%', label: 'Substructure Zone (34 Workers)', conf: '98.9%', color: '#004753' }
    ]
  },
  { 
    id: 'CAM-03', 
    name: 'East Gate Main Logistics Entry', 
    location: 'Zone C — Logistics & Speed-Gates', 
    type: 'ANPR + Biometric', 
    status: 'Online', 
    resolution: '4K 30fps', 
    fps: 30, 
    connection: 'Strong', 
    activeDetections: 'License Plate + Biometric Face ID',
    image: '/cctv_entrance_gate.jpg',
    aiBoxes: [
      { top: '60%', left: '27%', width: '12%', height: '34%', label: 'Worker ID Verified (Arabtec)', conf: '99.8%', color: '#10B981' },
      { top: '42%', left: '53%', width: '22%', height: '32%', label: 'ALEC Logistics Truck (Cleared)', conf: '99.4%', color: '#00A9C5' }
    ]
  },
  { 
    id: 'CAM-04', 
    name: 'Suspended Scaffold Level 24', 
    location: 'Zone A — South Facade Glazing Deck', 
    type: 'Fixed AI CCTV', 
    status: 'Online', 
    resolution: '1080p 30fps', 
    fps: 30, 
    connection: 'Medium', 
    activeDetections: 'Safety Harness + Lanyard Latch',
    image: '/cctv_scaffold_facade.jpg',
    aiBoxes: [
      { top: '40%', left: '42%', width: '14%', height: '34%', label: 'Glass Installer (Harness Latch OK)', conf: '99.0%', color: '#10B981' },
      { top: '39%', left: '56%', width: '13%', height: '35%', label: 'Curtain Wall Tech (PPE OK)', conf: '98.5%', color: '#10B981' }
    ]
  },
  { 
    id: 'CAM-05', 
    name: 'Batching Plant & Concrete Delivery Bay', 
    location: 'Zone D — Concrete Batching Depot', 
    type: 'Fixed AI CCTV', 
    status: 'Online', 
    resolution: '1080p 30fps', 
    fps: 30, 
    connection: 'Strong', 
    activeDetections: 'Transit Mixer Slump & Speed Radar',
    image: '/cctv_batching_plant.jpg',
    aiBoxes: [
      { top: '56%', left: '31%', width: '24%', height: '36%', label: 'Transit Mixer 08 (Discharging C40)', conf: '99.6%', color: '#004753' },
      { top: '56%', left: '66%', width: '26%', height: '34%', label: 'Transit Mixer 14 (Waiting Bay)', conf: '99.2%', color: '#00A9C5' }
    ]
  },
  { 
    id: 'DRN-02', 
    name: 'Facade Inspection Drone (DJI Matrice)', 
    location: 'Roof Helipad Dock — Autonomous Hub', 
    type: 'Autonomous Drone', 
    status: 'Charging', 
    resolution: '8K Photogrammetry', 
    battery: '100%', 
    connection: 'Strong', 
    activeDetections: 'Crack & Defect Photogrammetry',
    image: '/cctv_aerial_drone.jpg',
    aiBoxes: []
  },
  { 
    id: 'CAM-06', 
    name: 'Excavation Shoring Anchor Point Cam', 
    location: 'Zone B — Shoring Retaining Wall', 
    type: 'ATEX Explosion-Proof', 
    status: 'Online', 
    resolution: '1080p 30fps', 
    fps: 30, 
    connection: 'Strong', 
    activeDetections: 'Soil Inclinometer Displacement',
    image: '/cctv_excavation_pit.jpg',
    aiBoxes: [
      { top: '44%', left: '28%', width: '16%', height: '24%', label: 'Secant Shoring Pile (Stable)', conf: '98.1%', color: '#10B981' }
    ]
  },
];

export const SiteCameras = () => {
  const [cameraList, setCameraList] = useState(uaeCameraFleet);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCamera, setExpandedCamera] = useState(null);
  const [newCamName, setNewCamName] = useState('');
  const [newCamZone, setNewCamZone] = useState('Zone A — Main Core');
  const [showAiBoxes, setShowAiBoxes] = useState(true);

  const filteredCameras = cameraList.filter(c => {
    const matchesType = typeFilter === 'All' || c.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.location.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddCamera = (e) => {
    e.preventDefault();
    if (!newCamName) return;
    const newCam = {
      id: `CAM-0${cameraList.length + 1}`,
      name: newCamName,
      location: newCamZone,
      type: '4K AI Optical',
      status: 'Online',
      resolution: '4K UltraHD',
      fps: 30,
      connection: 'Strong',
      activeDetections: 'PPE Detection',
      image: '/cctv_tower_crane.jpg',
      aiBoxes: []
    };
    setCameraList([...cameraList, newCam]);
    setShowAddModal(false);
    setNewCamName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            AI Camera Fleet & Computer Vision Feeds
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Live photorealistic 4K RTSP optical feeds, autonomous inspection drones, and neural bounding-box tracking
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowAiBoxes(!showAiBoxes)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: showAiBoxes ? 'rgba(0, 71, 83, 0.08)' : 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, color: '#004753', cursor: 'pointer' }}
          >
            <ShieldCheck size={15} color="#004753" /> AI Bounding Boxes: {showAiBoxes ? 'ON' : 'OFF'}
          </button>
          <a 
            href="/site-monitoring"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontWeight: 700, fontSize: 12.5, color: '#081E3C', textDecoration: 'none' }}
          >
            <Video size={14} /> Multi-Feed Live Wall
          </a>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Register New 4K AI Camera
          </button>
        </div>
      </div>

      {/* Toolbar & Live Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 18px', borderRadius: 14, border: '1px solid var(--color-gray-200)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
            <Search size={15} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search cameras by ID, name, or zone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
            />
          </div>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
          >
            <option value="All">All Camera Types</option>
            <option value="4K AI">4K AI PTZ / Fixed</option>
            <option value="Drone">Patrol Drones</option>
            <option value="Biometric">Biometric & ANPR</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 14, color: '#081E3C', fontSize: 12, fontWeight: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} /> 7 Online (100% Ingest)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A9C5' }} /> 2 Drones Deployed
          </div>
        </div>
      </div>

      {/* Cameras Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
        {filteredCameras.map((cam, i) => (
          <motion.div 
            key={cam.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            className="hover-card-elevation"
          >
            {/* Photorealistic Live CCTV Viewport */}
            <div 
              onClick={() => setExpandedCamera(cam)}
              style={{ height: 180, position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#081E3C' }}
            >
              <img 
                src={cam.image} 
                alt={cam.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                className="hover-scale-img"
              />

              {/* Status HUD Header */}
              <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', borderRadius: 4, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, zIndex: 10 }}>
                {cam.status !== 'Charging' ? (
                  <>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', animation: 'pulse 1.5s infinite' }} /> 
                    LIVE 4K • 30 FPS
                  </>
                ) : (
                  <>
                    <Power size={10} color="#F59E0B" /> DOCKED HELIPAD
                  </>
                )}
              </div>

              {/* AI Detection Bounding Boxes Overlay */}
              {showAiBoxes && cam.aiBoxes && cam.aiBoxes.map((box, bIdx) => (
                <div 
                  key={bIdx}
                  style={{
                    position: 'absolute',
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height,
                    border: `1.5px solid ${box.color}`,
                    background: `${box.color}20`,
                    borderRadius: 2,
                    pointerEvents: 'none',
                    zIndex: 5
                  }}
                >
                  <span style={{ 
                    position: 'absolute', 
                    top: -16, 
                    left: -1, 
                    background: box.color, 
                    color: 'white', 
                    fontSize: 8.5, 
                    fontWeight: 800, 
                    padding: '1px 4px', 
                    borderRadius: '2px 2px 0 0',
                    whiteSpace: 'nowrap'
                  }}>
                    {box.label} ({box.conf})
                  </span>
                </div>
              ))}

              {/* Bottom OSD Bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(8,30,60,0.9))', padding: '16px 10px 6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
                <span style={{ color: 'white', fontSize: 10.5, fontWeight: 800, background: 'rgba(0,71,83,0.85)', padding: '2px 6px', borderRadius: 4 }}>
                  AI: {cam.activeDetections}
                </span>
                <span style={{ color: '#E2E8F0', fontSize: 9.5, fontFamily: 'monospace' }}>
                  {cam.id} • 14:38:12 GST
                </span>
              </div>
            </div>

            {/* Camera Details Card */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{cam.id} • {cam.type}</div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#081E3C', lineHeight: 1.3 }}>{cam.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    <MapPin size={12} color="#94A3B8" /> {cam.location}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#F8FAFC', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>STREAM RESOLUTION</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#081E3C' }}>{cam.resolution}</span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>NETWORK LATENCY</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#059669' }}>
                    <Wifi size={12} /> 18ms (Strong)
                  </div>
                </div>

                {cam.battery && (
                  <div style={{ background: '#F8FAFC', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>DRONE BATTERY</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#081E3C' }}>
                      <Battery size={13} color="#059669" /> {cam.battery}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                <button 
                  onClick={() => setExpandedCamera(cam)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 6, border: 'none', fontSize: 11.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                >
                  <Eye size={12} /> Expand 4K Feed
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded 4K Camera Modal */}
      <AnimatePresence>
        {expandedCamera && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.7)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 840, maxWidth: '95vw', background: '#081E3C', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ padding: '14px 20px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5' }}>{expandedCamera.id} • {expandedCamera.type} • 4K ULTRAHD STREAM</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'white' }}>{expandedCamera.name}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ padding: '3px 8px', background: '#DC2626', color: 'white', fontSize: 11, fontWeight: 800, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Radio size={12} /> LIVE BROADCAST
                  </span>
                  <button onClick={() => setExpandedCamera(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
              </div>

              {/* Big 4K Camera View */}
              <div style={{ position: 'relative', width: '100%', height: 440, background: '#000' }}>
                <img 
                  src={expandedCamera.image} 
                  alt={expandedCamera.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {/* AI Bounding Boxes */}
                {showAiBoxes && expandedCamera.aiBoxes && expandedCamera.aiBoxes.map((box, bIdx) => (
                  <div 
                    key={bIdx}
                    style={{
                      position: 'absolute',
                      top: box.top,
                      left: box.left,
                      width: box.width,
                      height: box.height,
                      border: `2px solid ${box.color}`,
                      background: `${box.color}25`,
                      borderRadius: 4,
                      pointerEvents: 'none'
                    }}
                  >
                    <span style={{ 
                      position: 'absolute', 
                      top: -20, 
                      left: -2, 
                      background: box.color, 
                      color: 'white', 
                      fontSize: 10, 
                      fontWeight: 800, 
                      padding: '2px 6px', 
                      borderRadius: '4px 4px 0 0',
                      whiteSpace: 'nowrap'
                    }}>
                      {box.label} ({box.conf})
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Controls */}
              <div style={{ padding: '12px 20px', background: '#0B192C', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#94A3B8', fontSize: 12 }}>
                  <strong style={{ color: 'white' }}>Active Geo-Fence:</strong> {expandedCamera.location}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    onClick={() => setShowAiBoxes(!showAiBoxes)}
                    style={{ padding: '6px 14px', background: showAiBoxes ? 'rgba(0, 169, 197, 0.2)' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                  >
                    AI Detections: {showAiBoxes ? 'Visible' : 'Hidden'}
                  </button>
                  <button 
                    onClick={() => { alert("Snapshot saved to Evidence Archive!"); setExpandedCamera(null); }}
                    style={{ padding: '6px 16px', background: '#004753', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                  >
                    Capture Incident Snapshot
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Camera Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleAddCamera}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Register RTSP Camera Stream
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Camera Stream Label *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Tower Crane 02 Boom Tip Cam" 
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Zone Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Zone B — South Basement Pour" 
                  value={newCamZone}
                  onChange={(e) => setNewCamZone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Add Stream
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
