import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Search, Plus, MapPin, Calendar, LayoutGrid, List, 
  ArrowUpRight, CheckCircle2, RefreshCw, Filter, Layers, Zap, 
  AlertTriangle, FileText, Download, X, Eye, ChevronRight, Building, 
  HardHat, Check, UploadCloud, Tag, ExternalLink
} from 'lucide-react';

const realProjects = [
  { 
    id: 'PRJ-DXB-001', 
    name: 'Al Wasl Commercial High-Rise', 
    location: 'Sheikh Zayed Road, Dubai', 
    category: 'Commercial High-Rise',
    status: 'Active', 
    scanned: 480, 
    total: 520, 
    lastUpdate: '2 hours ago', 
    progress: 92,
    elements: { walls: '1,240m', doors: 380, columns: 240, fixtures: 180 },
    disciplines: { arch: 98, struct: 92, mep: 86 },
    lead: 'KEO International',
    sheets: [
      { code: 'A-101', name: 'Ground Floor Arch Layout', status: 'Verified', elements: 142 },
      { code: 'S-201', name: 'Level 04 Rebar Schedule', status: 'Verified', elements: 88 },
      { code: 'M-301', name: 'HVAC Mechanical Core', status: 'Scanning', elements: 64 },
    ]
  },
  { 
    id: 'PRJ-AUH-002', 
    name: 'Etihad Rail Logistics & Depot Hub', 
    location: 'ICAD Industrial City, Abu Dhabi', 
    category: 'Infrastructure & Rail',
    status: 'Active', 
    scanned: 920, 
    total: 1180, 
    lastUpdate: '30 mins ago', 
    progress: 78,
    elements: { walls: '3,450m', doors: 190, columns: 620, fixtures: 95 },
    disciplines: { arch: 85, struct: 82, mep: 68 },
    lead: 'Parsons Overseas',
    sheets: [
      { code: 'C-001', name: 'Site Alignment & Track Grading', status: 'Verified', elements: 210 },
      { code: 'S-104', name: 'Depot Structural Steel Framing', status: 'Verified', elements: 340 },
      { code: 'E-202', name: 'High-Voltage Traction Power', status: 'Ambiguity Flagged', elements: 52 },
    ]
  },
  { 
    id: 'PRJ-DXB-003', 
    name: 'Dubai Creek Harbour Towers', 
    location: 'Ras Al Khor, Dubai', 
    category: 'Residential Mega-Tower',
    status: 'Active', 
    scanned: 748, 
    total: 890, 
    lastUpdate: '3 hours ago', 
    progress: 84,
    elements: { walls: '2,100m', doors: 620, columns: 410, fixtures: 340 },
    disciplines: { arch: 94, struct: 88, mep: 72 },
    lead: 'Emaar Properties PJSC',
    sheets: [
      { code: 'A-204', name: 'Podium Level 02 Residential', status: 'Verified', elements: 180 },
      { code: 'A-301', name: 'Typical Tower Floor (Levels 10-30)', status: 'Verified', elements: 310 },
      { code: 'P-101', name: 'Public Health Drainage Stack', status: 'Verified', elements: 115 },
    ]
  },
  { 
    id: 'PRJ-AUH-004', 
    name: 'Zayed National Museum Extension', 
    location: 'Saadiyat Cultural District, Abu Dhabi', 
    category: 'Cultural & Heritage',
    status: 'Completed', 
    scanned: 640, 
    total: 640, 
    lastUpdate: 'Yesterday', 
    progress: 100,
    elements: { walls: '1,890m', doors: 145, columns: 195, fixtures: 160 },
    disciplines: { arch: 100, struct: 100, mep: 100 },
    lead: 'Foster + Partners / DCT',
    sheets: [
      { code: 'A-001', name: 'Galleries Wing Ground Plan', status: 'Verified', elements: 240 },
      { code: 'S-101', name: 'Falcon Wing Curved Steel Trusses', status: 'Verified', elements: 195 },
      { code: 'M-401', name: 'Specialist Climate Control HVAC', status: 'Verified', elements: 180 },
    ]
  },
  { 
    id: 'PRJ-DXB-005', 
    name: 'Business Bay HQ Commercial Tower', 
    location: 'Business Bay, Dubai', 
    category: 'Commercial Grade-A',
    status: 'Scanning', 
    scanned: 140, 
    total: 410, 
    lastUpdate: 'Live Processing', 
    progress: 34,
    elements: { walls: '620m', doors: 110, columns: 140, fixtures: 75 },
    disciplines: { arch: 45, struct: 32, mep: 25 },
    lead: 'Al Habtoor Engineering',
    sheets: [
      { code: 'A-101', name: 'Main Lobby & Atrium', status: 'Verified', elements: 95 },
      { code: 'S-201', name: 'Basement B1-B3 Raft Slab', status: 'Scanning', elements: 45 },
    ]
  },
  { 
    id: 'PRJ-SHJ-006', 
    name: 'Sharjah Sustainable City Phase 3', 
    location: 'Al Rahmaniya, Sharjah', 
    category: 'Eco-Urban Masterplan',
    status: 'Active', 
    scanned: 510, 
    total: 750, 
    lastUpdate: '4 hours ago', 
    progress: 68,
    elements: { walls: '4,120m', doors: 420, columns: 280, fixtures: 310 },
    disciplines: { arch: 78, struct: 72, mep: 55 },
    lead: 'Diamond Developers',
    sheets: [
      { code: 'A-VIL-1', name: 'Type A 4-Bed Villa Layout', status: 'Verified', elements: 165 },
      { code: 'S-VIL-1', name: 'Villa Structural Foundations', status: 'Verified', elements: 120 },
      { code: 'E-SOLAR', name: 'Rooftop Solar PV Array', status: 'Verified', elements: 85 },
    ]
  },
  { 
    id: 'PRJ-DXB-007', 
    name: 'Jumeirah Islands Waterfront Mansions', 
    location: 'Jumeirah Islands, Dubai', 
    category: 'Ultra-Luxury Residential',
    status: 'Completed', 
    scanned: 320, 
    total: 320, 
    lastUpdate: '2 days ago', 
    progress: 100,
    elements: { walls: '980m', doors: 185, columns: 120, fixtures: 140 },
    disciplines: { arch: 100, struct: 100, mep: 100 },
    lead: 'Nakheel PJSC',
    sheets: [
      { code: 'A-101', name: 'Mansion Level 01 Living Plan', status: 'Verified', elements: 140 },
      { code: 'S-101', name: 'Cantilever Terrace Structure', status: 'Verified', elements: 95 },
    ]
  },
  { 
    id: 'PRJ-DWC-008', 
    name: 'Al Maktoum Int Airport Logistics Park', 
    location: 'Dubai South (DWC), Dubai', 
    category: 'Aviation & Logistics',
    status: 'Active', 
    scanned: 1305, 
    total: 1450, 
    lastUpdate: '1 hour ago', 
    progress: 90,
    elements: { walls: '6,400m', doors: 540, columns: 880, fixtures: 210 },
    disciplines: { arch: 95, struct: 92, mep: 84 },
    lead: 'Dubai Aviation Engineering Projects',
    sheets: [
      { code: 'C-01', name: 'Airside Apron Pavement Details', status: 'Verified', elements: 420 },
      { code: 'S-01', name: 'Cargo Terminal Pre-Engineered Steel', status: 'Verified', elements: 510 },
      { code: 'M-01', name: 'Automated Sorting Cold Storage', status: 'Verified', elements: 375 },
    ]
  },
  { 
    id: 'PRJ-RAK-009', 
    name: 'Al Marjan Island Luxury Resort', 
    location: 'Al Marjan Island, Ras Al Khaimah', 
    category: 'Hospitality & Marine',
    status: 'Scanning', 
    scanned: 270, 
    total: 560, 
    lastUpdate: 'Live Processing', 
    progress: 48,
    elements: { walls: '1,150m', doors: 310, columns: 220, fixtures: 290 },
    disciplines: { arch: 60, struct: 50, mep: 35 },
    lead: 'Wynn Resorts / Marjan',
    sheets: [
      { code: 'A-100', name: 'Beachfront Hotel Main Podia', status: 'Verified', elements: 180 },
      { code: 'M-200', name: 'Central Chiller Marine Cooling', status: 'Scanning', elements: 90 },
    ]
  }
];

export const DrawingProjects = () => {
  const [projectsList, setProjectsList] = useState(realProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState('grid');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', location: '', category: 'Commercial High-Rise', totalSheets: 250 });

  // Filter projects
  const filteredProjects = projectsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.location.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectData.name) return;
    const newProj = {
      id: `PRJ-UAE-${String(projectsList.length + 1).padStart(3, '0')}`,
      name: newProjectData.name,
      location: newProjectData.location || 'Dubai, UAE',
      category: newProjectData.category,
      status: 'Scanning',
      scanned: 12,
      total: Number(newProjectData.totalSheets) || 250,
      lastUpdate: 'Just now',
      progress: 5,
      elements: { walls: '120m', doors: 15, columns: 20, fixtures: 8 },
      disciplines: { arch: 10, struct: 5, mep: 0 },
      lead: 'In-House BIM Team',
      sheets: [
        { code: 'A-001', name: 'Cover Sheet & Drawing Index', status: 'Verified', elements: 12 },
        { code: 'A-101', name: 'Ground Floor Level Plan', status: 'Scanning', elements: 0 }
      ]
    };
    setProjectsList([newProj, ...projectsList]);
    setShowNewModal(false);
    setNewProjectData({ name: '', location: '', category: 'Commercial High-Rise', totalSheets: 250 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            Project Portfolio
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Manage drawing sets, automated takeoff progress, and BIM element quantities across all UAE projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowNewModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> New Project Takeoff
          </button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(0, 71, 83, 0.08)', color: '#004753', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>{projectsList.length}</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Active Portfolios</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(0, 169, 197, 0.1)', color: '#00A9C5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>
              {projectsList.reduce((acc, p) => acc + p.scanned, 0).toLocaleString()} <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>/ {projectsList.reduce((acc, p) => acc + p.total, 0).toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Sheets Scanned (93.3%)</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#081E3C' }}>17,870</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Quantified Elements</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#059669' }}>98.6%</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Average AI Confidence</div>
          </div>
        </div>
      </div>

      {/* Filter & View Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 14px', borderRadius: 8, width: 340, border: '1px solid #E2E8F0' }}>
            <Search size={15} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search projects, location, or project ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', color: '#081E3C', fontWeight: 600 }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
            {['All', 'Active', 'Scanning', 'Completed'].map(st => (
              <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: 6, 
                  border: 'none', 
                  background: statusFilter === st ? 'var(--gradient-brand)' : 'transparent', 
                  color: statusFilter === st ? 'white' : '#64748B', 
                  fontWeight: statusFilter === st ? 800 : 600, 
                  fontSize: 11.5, 
                  cursor: 'pointer',
                  boxShadow: statusFilter === st ? '0 2px 8px rgba(0, 71, 83, 0.2)' : 'none'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setView('grid')} 
            style={{ padding: '6px 10px', background: view === 'grid' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: view === 'grid' ? '#004753' : '#64748B', boxShadow: view === 'grid' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setView('list')} 
            style={{ padding: '6px 10px', background: view === 'list' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: view === 'list' ? '#004753' : '#64748B', boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
          {filteredProjects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              onClick={() => setSelectedProject(project)}
              style={{ 
                background: 'white', 
                borderRadius: 14, 
                border: '1px solid var(--color-gray-200)', 
                padding: '20px 22px', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                gap: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0, 169, 197, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      {project.id}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                      {project.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 900, color: '#081E3C', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                    {project.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    <MapPin size={13} color="#94A3B8" /> {project.location}
                  </div>
                </div>

                <span style={{ 
                  padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4,
                  background: project.status === 'Completed' ? '#ECFDF5' : project.status === 'Scanning' ? '#FEF3C7' : 'rgba(0, 71, 83, 0.08)',
                  color: project.status === 'Completed' ? '#059669' : project.status === 'Scanning' ? '#D97706' : '#004753'
                }}>
                  {project.status === 'Scanning' && <RefreshCw size={11} className="spin" />}
                  {project.status === 'Completed' && <CheckCircle2 size={11} />}
                  {project.status}
                </span>
              </div>

              {/* Takeoff Quantities Mini Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, background: '#F8FAFC', padding: 8, borderRadius: 8, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{project.elements.walls}</div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>Walls</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{project.elements.doors}</div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>Doors</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{project.elements.columns}</div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>Columns</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{project.elements.fixtures}</div>
                  <div style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>Fixtures</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#081E3C' }}>
                  <span>Scanning & Takeoff</span>
                  <span style={{ color: project.progress === 100 ? '#059669' : '#004753' }}>{project.progress}%</span>
                </div>
                <div style={{ height: 7, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ 
                      height: '100%', 
                      background: project.progress === 100 ? '#059669' : 'linear-gradient(90deg, #004753, #00A9C5)' 
                    }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  <span>{project.scanned} sheets parsed</span>
                  <span>{project.total} total CAD sheets</span>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} /> {project.lastUpdate}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                  style={{ padding: '5px 12px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                >
                  Inspect Takeoff <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--color-gray-200)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>Project Name</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Location</th>
                <th style={{ padding: '14px 16px' }}>Takeoff Progress</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Last Activity</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, idx) => (
                <tr 
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  className="hover-bg-gray-50"
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#081E3C' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#00A9C5', fontWeight: 700 }}>{p.id} • {p.lead}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>{p.category}</td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>{p.location}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 140 }}>
                      <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress === 100 ? '#059669' : '#004753' }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#081E3C' }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                      background: p.status === 'Completed' ? '#ECFDF5' : p.status === 'Scanning' ? '#FEF3C7' : 'rgba(0, 71, 83, 0.08)',
                      color: p.status === 'Completed' ? '#059669' : p.status === 'Scanning' ? '#D97706' : '#004753'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>{p.lastUpdate}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                      style={{ padding: '6px 14px', background: 'var(--gradient-brand)', border: 'none', borderRadius: 6, color: 'white', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Inspection Drawer Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 620, maxHeight: '90vh', background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}
            >
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', background: 'rgba(0,169,197,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {selectedProject.id}
                  </span>
                  <h2 style={{ margin: '4px 0 2px 0', fontSize: 18, fontWeight: 900, color: '#081E3C' }}>
                    {selectedProject.name}
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {selectedProject.location} • Lead: {selectedProject.lead}
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}>✕</button>
              </div>

              {/* Progress & Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Sheets Processed</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#004753', marginTop: 2 }}>
                    {selectedProject.scanned} / {selectedProject.total}
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Overall Accuracy</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#059669', marginTop: 2 }}>98.8%</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Active Ambiguities</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626', marginTop: 2 }}>2 Flags</div>
                </div>
              </div>

              {/* Discipline Breakdown */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Discipline Takeoff Completion</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700 }}>
                      <span>Architectural Sheets</span>
                      <span>{selectedProject.disciplines.arch}%</span>
                    </div>
                    <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, marginTop: 3 }}>
                      <div style={{ width: `${selectedProject.disciplines.arch}%`, height: '100%', background: '#004753' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700 }}>
                      <span>Structural Rebar & Columns</span>
                      <span>{selectedProject.disciplines.struct}%</span>
                    </div>
                    <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, marginTop: 3 }}>
                      <div style={{ width: `${selectedProject.disciplines.struct}%`, height: '100%', background: '#00A9C5' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700 }}>
                      <span>MEP Core & Ducting</span>
                      <span>{selectedProject.disciplines.mep}%</span>
                    </div>
                    <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, marginTop: 3 }}>
                      <div style={{ width: `${selectedProject.disciplines.mep}%`, height: '100%', background: '#D97706' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheet Register Sample */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: '#081E3C' }}>Verified Drawing Sheets Sample</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedProject.sheets.map((sheet, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: '#004753' }}>{sheet.code}</span>
                        <span style={{ color: '#081E3C', fontWeight: 600 }}>{sheet.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>{sheet.elements} elements</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: sheet.status === 'Verified' ? '#059669' : '#D97706', background: sheet.status === 'Verified' ? '#ECFDF5' : '#FEF3C7', padding: '2px 6px', borderRadius: 4 }}>
                          {sheet.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 14, marginTop: 'auto' }}>
                <button onClick={() => setSelectedProject(null)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Close
                </button>
                <button 
                  onClick={() => alert(`Exporting BOQ takeoff quantities for ${selectedProject.name}...`)}
                  style={{ padding: '7px 14px', background: 'white', color: '#004753', border: '1.5px solid #004753', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={13} /> Export BOQ (Excel)
                </button>
                <a 
                  href="/drawing-scanner/dashboard"
                  style={{ padding: '7px 16px', background: '#004753', color: 'white', borderRadius: 6, fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Open in CAD Takeoff Viewer <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Project Registration Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,30,60,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.form 
              onSubmit={handleCreateProject}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: 480, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#081E3C' }}>
                  Register New Project Takeoff
                </h3>
                <button type="button" onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Project Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Marina Horizon Luxury Towers" 
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Location *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dubai Marina, UAE" 
                    value={newProjectData.location}
                    onChange={(e) => setNewProjectData({ ...newProjectData, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Total CAD Sheets</label>
                  <input 
                    type="number" 
                    value={newProjectData.totalSheets}
                    onChange={(e) => setNewProjectData({ ...newProjectData, totalSheets: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Project Category</label>
                <select 
                  value={newProjectData.category}
                  onChange={(e) => setNewProjectData({ ...newProjectData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: 'white' }}
                >
                  <option value="Commercial High-Rise">Commercial High-Rise</option>
                  <option value="Residential Mega-Tower">Residential Mega-Tower</option>
                  <option value="Infrastructure & Rail">Infrastructure & Rail</option>
                  <option value="Hospitality & Marine">Hospitality & Marine</option>
                  <option value="Cultural & Heritage">Cultural & Heritage</option>
                </select>
              </div>

              <div style={{ background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: 16, textAlign: 'center', cursor: 'pointer' }}>
                <UploadCloud size={24} color="#004753" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#081E3C' }}>Drag & drop CAD drawing sets (.DWG, .PDF)</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Supports multi-page architectural batches up to 500MB</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowNewModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Create Project & Start Scan
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
