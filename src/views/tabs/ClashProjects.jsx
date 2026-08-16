import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, MapPin, LayoutGrid, List, ArrowUpRight, CheckCircle2, 
  ShieldAlert, Users, Layers, Activity, Building, Calendar, Box, HardDrive, Check
} from 'lucide-react';

const uaeBimProjects = [
  { 
    id: 'PRJ-101', 
    name: 'Al Wasl Commercial High-Rise (64 Stories)', 
    location: 'Sheikh Zayed Road, Dubai, UAE', 
    status: 'Critical Clashes', 
    totalClashes: 1240, 
    resolvedClashes: 890, 
    models: 14, 
    teams: 6,
    leadConsultant: 'KEO International',
    contractor: 'Arabtec / Dutco JV',
    bimProtocol: 'ISO 19650 Level 2',
    lastSync: '10 mins ago'
  },
  { 
    id: 'PRJ-102', 
    name: 'Etihad Rail Freight Depot & Operations Hub', 
    location: 'Al Faya Logistics Park, Abu Dhabi, UAE', 
    status: 'Coordinating', 
    totalClashes: 450, 
    resolvedClashes: 420, 
    models: 18, 
    teams: 5,
    leadConsultant: 'Parsons Infrastructure',
    contractor: 'China State / Wade Adams',
    bimProtocol: 'Aconex CDE IFC 4.3',
    lastSync: '25 mins ago'
  },
  { 
    id: 'PRJ-103', 
    name: 'Dubai Creek Harbour Residential Towers (T3 & T4)', 
    location: 'Dubai Creek Harbour, Dubai, UAE', 
    status: 'Coordinating', 
    totalClashes: 3200, 
    resolvedClashes: 1500, 
    models: 26, 
    teams: 8,
    leadConsultant: 'WSP Middle East',
    contractor: 'Al Naboodah Construction',
    bimProtocol: 'Autodesk ACC / BIM 360',
    lastSync: '1 hour ago'
  },
  { 
    id: 'PRJ-104', 
    name: 'Zayed National Museum Cultural Extension', 
    location: 'Saadiyat Cultural District, Abu Dhabi, UAE', 
    status: 'Sign-off Ready', 
    totalClashes: 5400, 
    resolvedClashes: 5395, 
    models: 32, 
    teams: 9,
    leadConsultant: 'Foster + Partners / Buro Happold',
    contractor: 'Six Construct',
    bimProtocol: 'ISO 19650 CDE',
    lastSync: '4 hours ago'
  },
  { 
    id: 'PRJ-105', 
    name: 'Sharjah Sustainable City - Phase 03 Villas', 
    location: 'Al Rahmaniya, Sharjah, UAE', 
    status: 'Coordinating', 
    totalClashes: 890, 
    resolvedClashes: 600, 
    models: 12, 
    teams: 4,
    leadConsultant: 'AtkinsRéalis',
    contractor: 'Shurooq / Diamond Dev',
    bimProtocol: 'Revit Cloud Worksharing',
    lastSync: 'Yesterday'
  },
  { 
    id: 'PRJ-106', 
    name: 'Dubai Metro Blue Line Extension (Station 04)', 
    location: 'Academic City / International City, Dubai', 
    status: 'Setup Phase', 
    totalClashes: 120, 
    resolvedClashes: 110, 
    models: 8, 
    teams: 3,
    leadConsultant: 'Systra / RTA Engineering',
    contractor: 'JV Consortium',
    bimProtocol: 'OpenBIM IFC 4.3 Rail',
    lastSync: 'Just now'
  }
];

export const ClashProjects = () => {
  const [projectList, setProjectList] = useState(uaeBimProjects);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('Dubai, UAE');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    const newProj = {
      id: `PRJ-${100 + projectList.length + 1}`,
      name: newProjectName,
      location: newProjectLocation,
      status: 'Setup Phase',
      totalClashes: 0,
      resolvedClashes: 0,
      models: 1,
      teams: 1,
      leadConsultant: 'KEO BIM Team',
      contractor: 'Main Contractor',
      bimProtocol: 'ISO 19650 Level 2',
      lastSync: 'Just now'
    };
    setProjectList([newProj, ...projectList]);
    setShowCreateModal(false);
    setNewProjectName('');
  };

  const filteredProjects = projectList.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.location.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 900, color: '#081E3C', letterSpacing: '-0.02em' }}>
            BIM Coordination Portfolio & Projects
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
            Manage federated models, multi-disciplinary clash burndown, and BCF resolution across UAE mega projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}
          >
            <Plus size={16} /> Link New Federated BIM Model
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 18px', borderRadius: 14, border: '1px solid var(--color-gray-200)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, width: 340, border: '1px solid #CBD5E1' }}>
            <Search size={15} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search by project name, ID, or UAE location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, width: '100%', fontWeight: 600, color: '#081E3C' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: 12, fontWeight: 700, background: 'white', color: '#081E3C' }}
          >
            <option value="All">All Project Statuses</option>
            <option value="Critical Clashes">Critical Clashes</option>
            <option value="Coordinating">Coordinating</option>
            <option value="Sign-off Ready">Sign-off Ready</option>
            <option value="Setup Phase">Setup Phase</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          <button 
            onClick={() => setView('grid')} 
            style={{ padding: '6px 10px', background: view === 'grid' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: view === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: view === 'grid' ? '#004753' : '#64748B' }}
          >
            <LayoutGrid size={15} />
          </button>
          <button 
            onClick={() => setView('list')} 
            style={{ padding: '6px 10px', background: view === 'list' ? 'white' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: view === 'list' ? '#004753' : '#64748B' }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Projects Grid / List */}
      <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(360px, 1fr))' : '1fr', gap: 18 }}>
        {filteredProjects.map((project, i) => {
          const resolutionRate = project.totalClashes === 0 ? 100 : Math.round((project.resolvedClashes / project.totalClashes) * 100);
          
          return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ 
                background: 'white', 
                borderRadius: 14, 
                border: '1px solid var(--color-gray-200)', 
                padding: '20px 22px', 
                display: 'flex', 
                flexDirection: 'column', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'transform 0.15s, box-shadow 0.15s' 
              }}
              className="hover-card-elevation"
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#00A9C5', marginBottom: 2 }}>{project.id} • {project.bimProtocol}</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 900, color: '#081E3C' }}>{project.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    <MapPin size={13} color="#94A3B8" /> {project.location}
                  </div>
                </div>
                <span style={{ 
                  padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4,
                  background: project.status === 'Sign-off Ready' ? '#ECFDF5' : project.status === 'Critical Clashes' ? '#FEF2F2' : 'rgba(0, 71, 83, 0.08)',
                  color: project.status === 'Sign-off Ready' ? '#059669' : project.status === 'Critical Clashes' ? '#DC2626' : '#004753'
                }}>
                  {project.status === 'Sign-off Ready' && <CheckCircle2 size={11} />}
                  {project.status === 'Critical Clashes' && <ShieldAlert size={11} />}
                  {project.status === 'Coordinating' && <Activity size={11} />}
                  {project.status}
                </span>
              </div>

              {/* Stat Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, margin: '8px 0 16px 0' }}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0, 71, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#004753' }}>
                    <Layers size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#081E3C' }}>{project.models}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Federated Models</div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0, 169, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A9C5' }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#081E3C' }}>{project.teams}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Trade Contractors</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Clash Burndown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ color: '#081E3C' }}>Clash Resolution Burndown</span>
                  <span style={{ color: resolutionRate > 90 ? '#059669' : resolutionRate > 50 ? '#D97706' : '#DC2626' }}>
                    {resolutionRate}% Resolved
                  </span>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resolutionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    style={{ height: '100%', background: resolutionRate > 90 ? '#059669' : resolutionRate > 50 ? '#004753' : '#DC2626' }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  <span>{project.resolvedClashes.toLocaleString()} BCF Issues Closed</span>
                  <span>{project.totalClashes.toLocaleString()} Total Ingested</span>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>
                  Synced {project.lastSync}
                </div>
                <a 
                  href="/clash-detection"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', background: 'var(--gradient-brand)', color: 'white', borderRadius: 6, textDecoration: 'none', fontSize: 12, fontWeight: 800, boxShadow: '0 2px 8px rgba(0, 71, 83, 0.2)' }}
                >
                  Open 3D Viewer <ArrowUpRight size={13} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* New BIM Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                  Create New BIM Coordination Project
                </h3>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>✕</button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Project Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dubai Islands Marina Residences" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#081E3C', marginBottom: 4 }}>Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Deira Waterfront, Dubai, UAE" 
                  value={newProjectLocation}
                  onChange={(e) => setNewProjectLocation(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '7px 14px', background: 'white', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '7px 18px', background: 'var(--gradient-brand)', color: 'white', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 71, 83, 0.25)' }}>
                  Create Project
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
