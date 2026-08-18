import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import { Layout } from './components/layout';
import { Home } from './views/Home';
import { InvoiceMatching } from './views/InvoiceMatching';
import { DrawingScanner } from './views/DrawingScanner';
import { SiteMonitoring } from './views/SiteMonitoring';
import { ClashDetection } from './views/ClashDetection';
import { DocumentDrafting } from './views/DocumentDrafting';
import { KnowledgeAssistant } from './views/KnowledgeAssistant';
import { ProgressMonitoring } from './views/ProgressMonitoring';
import { OcrDashboard } from './views/dashboards/OcrDashboard';
import { SiteMonitoringDashboard } from './views/dashboards/SiteMonitoringDashboard';
import { ClashDetectionDashboard } from './views/dashboards/ClashDetectionDashboard';
import { ProgressDashboard } from './views/dashboards/ProgressDashboard';
import { DrawingQuantities } from './views/tabs/DrawingQuantities';
import { ClashCoordination } from './views/tabs/ClashCoordination';
import { KnowledgeClassification } from './views/tabs/KnowledgeClassification';
import { OcrReports } from './views/tabs/OcrReports';
import { OcrInbox } from './views/tabs/OcrInbox';
import { OcrInvoices } from './views/tabs/OcrInvoices';
import { OcrExceptions } from './views/tabs/OcrExceptions';
import { OcrSuppliers } from './views/tabs/OcrSuppliers';
import { GlobalSettings } from './views/tabs/GlobalSettings';
import { DraftingDashboard } from './views/tabs/DraftingDashboard';
import { DraftingTemplates } from './views/tabs/DraftingTemplates';
import { DraftingApprovals } from './views/tabs/DraftingApprovals';
import { DraftingIssued } from './views/tabs/DraftingIssued';
import { DraftingRegister } from './views/tabs/DraftingRegister';
import { DraftingSignatures } from './views/tabs/DraftingSignatures';
import { KnowledgeDashboard } from './views/tabs/KnowledgeDashboard';
import { KnowledgeRepository } from './views/tabs/KnowledgeRepository';
import { KnowledgeSearch } from './views/tabs/KnowledgeSearch';
import { KnowledgePermissions } from './views/tabs/KnowledgePermissions';
import { KnowledgeAuditLog } from './views/tabs/KnowledgeAuditLog';
import { DrawingDashboard } from './views/tabs/DrawingDashboard';
import { DrawingProjects } from './views/tabs/DrawingProjects';
import { DrawingDrawings } from './views/tabs/DrawingDrawings';
import { DrawingBOQ } from './views/tabs/DrawingBOQ';
import { DrawingRevisions } from './views/tabs/DrawingRevisions';
import { DrawingReports } from './views/tabs/DrawingReports';
import { ClashProjects } from './views/tabs/ClashProjects';
import { ClashModels } from './views/tabs/ClashModels';
import { ClashDisciplines } from './views/tabs/ClashDisciplines';
import { ClashReports } from './views/tabs/ClashReports';
import { SiteCameras } from './views/tabs/SiteCameras';
import { SiteViolations } from './views/tabs/SiteViolations';
import { SiteZones } from './views/tabs/SiteZones';
import { SiteMaterials } from './views/tabs/SiteMaterials';
import { SitePersonnel } from './views/tabs/SitePersonnel';
import { SiteReports } from './views/tabs/SiteReports';
import { ProgressSchedule } from './views/tabs/ProgressSchedule';
import { Progress4D } from './views/tabs/Progress4D';
import { ProgressEvidence } from './views/tabs/ProgressEvidence';
import { ProgressEarnedValue } from './views/tabs/ProgressEarnedValue';
import { ProgressReports } from './views/tabs/ProgressReports';
import { 
  LayoutDashboard, 
  Inbox, 
  Receipt, 
  CheckCheck, 
  FileWarning, 
  Building2, 
  BarChart3, 
  FolderKanban, 
  DraftingCompass, 
  Crosshair, 
  Calculator, 
  TableProperties, 
  History, 
  Cctv, 
  Radio, 
  ShieldAlert, 
  Grid3X3, 
  Boxes, 
  Users2, 
  ClipboardCheck, 
  Cuboid, 
  GitMerge, 
  AlertTriangle, 
  Layers3, 
  FileSpreadsheet, 
  FileStack, 
  PenLine, 
  Stamp, 
  Send, 
  BookMarked, 
  FileSignature, 
  Database, 
  BotMessageSquare, 
  SearchCheck, 
  Tags, 
  ShieldCheck, 
  ScrollText, 
  GanttChartSquare, 
  CalendarClock, 
  Camera, 
  TrendingUp, 
  FilePieChart, 
  UserCircle2, 
  SlidersHorizontal, 
  ScanText, 
  Compass, 
  BrainCircuit, 
  Activity, 
  KeyRound 
} from 'lucide-react';

const DefaultFallback = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-gray-500)' }}>
    <h2 className="text-h2" style={{ marginBottom: 16 }}>{title}</h2>
    <p>This module is not fully implemented in the v1.0 prototype.</p>
  </div>
);

const App = () => {
  // Define sidebar for Document OCR (Solution 1)
  const docOcrSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/document-processing' },
    { label: 'Inbox', icon: <Inbox size={18} strokeWidth={2.2} />, path: '/document-processing/inbox' },
    { label: 'Invoices', icon: <Receipt size={18} strokeWidth={2.2} />, path: '/document-processing/invoices' },
    { label: 'Matching', icon: <CheckCheck size={18} strokeWidth={2.2} />, path: '/document-processing/matching' },
    { label: 'Exceptions', icon: <FileWarning size={18} strokeWidth={2.2} />, path: '/document-processing/exceptions' },
    { label: 'Suppliers', icon: <Building2 size={18} strokeWidth={2.2} />, path: '/document-processing/suppliers' },
    { label: 'Reports', icon: <BarChart3 size={18} strokeWidth={2.2} />, path: '/document-processing/reports' },
  ];

  // Define sidebar for Drawing Scanner (Solution 2)
  const drawingScannerSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/drawing-scanner' },
    { label: 'Projects', icon: <FolderKanban size={18} strokeWidth={2.2} />, path: '/drawing-scanner/projects' },
    { label: 'Drawings', icon: <DraftingCompass size={18} strokeWidth={2.2} />, path: '/drawing-scanner/drawings' },
    { label: 'AI Detect', icon: <Crosshair size={18} strokeWidth={2.2} />, path: '/drawing-scanner/detect' },
    { label: 'Quantities', icon: <Calculator size={18} strokeWidth={2.2} />, path: '/drawing-scanner/quantities' },
    { label: 'BOQ', icon: <TableProperties size={18} strokeWidth={2.2} />, path: '/drawing-scanner/boq' },
    { label: 'Revisions', icon: <History size={18} strokeWidth={2.2} />, path: '/drawing-scanner/revisions' },
    { label: 'Reports', icon: <FileSpreadsheet size={18} strokeWidth={2.2} />, path: '/drawing-scanner/reports' },
  ];

  // Define sidebar for Site Monitoring (Solution 3)
  const siteMonitoringSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/site-monitoring' },
    { label: 'Cameras', icon: <Cctv size={18} strokeWidth={2.2} />, path: '/site-monitoring/cameras' },
    { label: 'Live View', icon: <Radio size={18} strokeWidth={2.2} />, path: '/site-monitoring/live' },
    { label: 'Violations', icon: <ShieldAlert size={18} strokeWidth={2.2} />, path: '/site-monitoring/violations' },
    { label: 'Zones', icon: <Grid3X3 size={18} strokeWidth={2.2} />, path: '/site-monitoring/zones' },
    { label: 'Materials', icon: <Boxes size={18} strokeWidth={2.2} />, path: '/site-monitoring/materials' },
    { label: 'Personnel', icon: <Users2 size={18} strokeWidth={2.2} />, path: '/site-monitoring/personnel' },
    { label: 'Reports', icon: <ClipboardCheck size={18} strokeWidth={2.2} />, path: '/site-monitoring/reports' },
  ];

  // Define sidebar for Clash Detection (Solution 4)
  const clashDetectionSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/clash-detection' },
    { label: 'Projects', icon: <FolderKanban size={18} strokeWidth={2.2} />, path: '/clash-detection/projects' },
    { label: 'Models', icon: <Cuboid size={18} strokeWidth={2.2} />, path: '/clash-detection/models' },
    { label: 'Coordination', icon: <GitMerge size={18} strokeWidth={2.2} />, path: '/clash-detection/coordination' },
    { label: 'Clashes', icon: <AlertTriangle size={18} strokeWidth={2.2} />, path: '/clash-detection/clashes' },
    { label: 'Disciplines', icon: <Layers3 size={18} strokeWidth={2.2} />, path: '/clash-detection/disciplines' },
    { label: 'Reports', icon: <FileSpreadsheet size={18} strokeWidth={2.2} />, path: '/clash-detection/reports' },
  ];

  // Define sidebar for Document Drafting (Solution 5)
  const documentDraftingSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/document-drafting' },
    { label: 'Templates', icon: <FileStack size={18} strokeWidth={2.2} />, path: '/document-drafting/templates' },
    { label: 'Drafts', icon: <PenLine size={18} strokeWidth={2.2} />, path: '/document-drafting/drafts' },
    { label: 'Approvals', icon: <Stamp size={18} strokeWidth={2.2} />, path: '/document-drafting/approvals' },
    { label: 'Issued', icon: <Send size={18} strokeWidth={2.2} />, path: '/document-drafting/issued' },
    { label: 'Register', icon: <BookMarked size={18} strokeWidth={2.2} />, path: '/document-drafting/register' },
    { label: 'Signatures', icon: <FileSignature size={18} strokeWidth={2.2} />, path: '/document-drafting/signatures' },
  ];

  // Define sidebar for Knowledge Assistant (Solution 6)
  const knowledgeAssistantSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/knowledge-assistant' },
    { label: 'Repository', icon: <Database size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/repository' },
    { label: 'Assistant', icon: <BotMessageSquare size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/assistant' },
    { label: 'Search', icon: <SearchCheck size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/search' },
    { label: 'Classification', icon: <Tags size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/classification' },
    { label: 'Permissions', icon: <ShieldCheck size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/permissions' },
    { label: 'Audit Log', icon: <ScrollText size={18} strokeWidth={2.2} />, path: '/knowledge-assistant/audit-log' },
  ];

  // Define sidebar for Progress Monitoring (Solution 7)
  const progressMonitoringSidebar = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2.2} />, path: '/progress-monitoring' },
    { label: 'Progress Tracking', icon: <GanttChartSquare size={18} strokeWidth={2.2} />, path: '/progress-monitoring/tracking' },
    { label: 'Schedule', icon: <CalendarClock size={18} strokeWidth={2.2} />, path: '/progress-monitoring/schedule' },
    { label: '4D Model', icon: <Boxes size={18} strokeWidth={2.2} />, path: '/progress-monitoring/4d-model' },
    { label: 'Evidence', icon: <Camera size={18} strokeWidth={2.2} />, path: '/progress-monitoring/evidence' },
    { label: 'Earned Value', icon: <TrendingUp size={18} strokeWidth={2.2} />, path: '/progress-monitoring/earned-value' },
    { label: 'Reports', icon: <FilePieChart size={18} strokeWidth={2.2} />, path: '/progress-monitoring/reports' },
  ];

  // Define sidebar for Global & Module Settings (with User Profile at top)
  const settingsSidebar = [
    { label: 'User Profile', icon: <UserCircle2 size={18} strokeWidth={2.2} />, path: '/settings/profile' },
    { label: 'General System', icon: <SlidersHorizontal size={18} strokeWidth={2.2} />, path: '/settings' },
    { label: 'Document OCR', icon: <ScanText size={18} strokeWidth={2.2} />, path: '/settings/document-ocr' },
    { label: 'Drawing Scanner', icon: <Compass size={18} strokeWidth={2.2} />, path: '/settings/drawing-scanner' },
    { label: 'Site Monitoring', icon: <Cctv size={18} strokeWidth={2.2} />, path: '/settings/site-monitoring' },
    { label: 'Clash & BIM', icon: <Boxes size={18} strokeWidth={2.2} />, path: '/settings/clash-detection' },
    { label: 'Document Drafting', icon: <ScrollText size={18} strokeWidth={2.2} />, path: '/settings/document-drafting' },
    { label: 'Knowledge Assistant', icon: <BrainCircuit size={18} strokeWidth={2.2} />, path: '/settings/knowledge-assistant' },
    { label: 'Progress Monitoring', icon: <Activity size={18} strokeWidth={2.2} />, path: '/settings/progress-monitoring' },
    { label: 'API & Integrations', icon: <KeyRound size={18} strokeWidth={2.2} />, path: '/settings/api-keys' },
    { label: 'Security & Access', icon: <ShieldCheck size={18} strokeWidth={2.2} />, path: '/settings/security' },
  ];

  return (
    <BrowserRouter>
      <InvoiceProvider>
        {/* Background gradient blobs */}
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />
        
        <Routes>
          <Route path="/" element={<Layout topbarContent={<span className="text-h3" style={{ fontWeight: 600, color: 'white' }}>Good afternoon, Rashid</span>}><Home /></Layout>} />
          
          {/* Solution 1: Document OCR - Default to Dashboard */}
          <Route path="/document-processing" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrDashboard />
            </Layout>
          } />

          <Route path="/document-processing/dashboard" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrDashboard />
            </Layout>
          } />

          <Route path="/document-processing/matching" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <InvoiceMatching />
            </Layout>
          } />

          <Route path="/document-processing/reports" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrReports />
            </Layout>
          } />

          <Route path="/document-processing/inbox" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrInbox />
            </Layout>
          } />

          <Route path="/document-processing/invoices" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrInvoices />
            </Layout>
          } />

          <Route path="/document-processing/exceptions" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrExceptions />
            </Layout>
          } />

          <Route path="/document-processing/suppliers" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <OcrSuppliers />
            </Layout>
          } />

          <Route path="/document-processing/settings" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <GlobalSettings />
            </Layout>
          } />
          
          <Route path="/document-processing/*" element={
            <Layout sidebarItems={docOcrSidebar} sidebarTitle="Document OCR">
              <DefaultFallback title="Document OCR" />
            </Layout>
          } />
          
          {/* Solution 5: Document Drafting - Default to Dashboard */}
          <Route path="/document-drafting" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingDashboard />
            </Layout>
          } />

          <Route path="/document-drafting/dashboard" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingDashboard />
            </Layout>
          } />

          <Route path="/document-drafting/drafts" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DocumentDrafting />
            </Layout>
          } />

          <Route path="/document-drafting/templates" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingTemplates />
            </Layout>
          } />

          <Route path="/document-drafting/approvals" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingApprovals />
            </Layout>
          } />

          <Route path="/document-drafting/issued" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingIssued />
            </Layout>
          } />

          <Route path="/document-drafting/register" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingRegister />
            </Layout>
          } />

          <Route path="/document-drafting/signatures" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DraftingSignatures />
            </Layout>
          } />

          <Route path="/document-drafting/settings" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/document-drafting/*" element={
            <Layout sidebarItems={documentDraftingSidebar} sidebarTitle="Document Drafting">
              <DefaultFallback title="Document Drafting" />
            </Layout>
          } />
          
          {/* Solution 6: Knowledge Assistant - Default to Dashboard */}
          <Route path="/knowledge-assistant" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeDashboard />
            </Layout>
          } />

          <Route path="/knowledge-assistant/dashboard" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeDashboard />
            </Layout>
          } />

          <Route path="/knowledge-assistant/assistant" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeAssistant />
            </Layout>
          } />

          <Route path="/knowledge-assistant/repository" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeRepository />
            </Layout>
          } />

          <Route path="/knowledge-assistant/search" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeSearch />
            </Layout>
          } />

          <Route path="/knowledge-assistant/classification" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeClassification />
            </Layout>
          } />

          <Route path="/knowledge-assistant/permissions" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgePermissions />
            </Layout>
          } />

          <Route path="/knowledge-assistant/audit-log" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <KnowledgeAuditLog />
            </Layout>
          } />

          <Route path="/knowledge-assistant/settings" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/knowledge-assistant/*" element={
            <Layout sidebarItems={knowledgeAssistantSidebar} sidebarTitle="Knowledge Assistant">
              <DefaultFallback title="Knowledge Assistant" />
            </Layout>
          } />
          
          {/* Solution 2: Drawing Scanner - Default to Dashboard */}
          <Route path="/drawing-scanner" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingDashboard />
            </Layout>
          } />

          <Route path="/drawing-scanner/dashboard" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingDashboard />
            </Layout>
          } />

          <Route path="/drawing-scanner/detect" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingScanner />
            </Layout>
          } />

          <Route path="/drawing-scanner/ai-detect" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingScanner />
            </Layout>
          } />

          <Route path="/drawing-scanner/projects" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingProjects />
            </Layout>
          } />

          <Route path="/drawing-scanner/drawings" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingDrawings />
            </Layout>
          } />

          <Route path="/drawing-scanner/boq" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingBOQ />
            </Layout>
          } />

          <Route path="/drawing-scanner/revisions" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingRevisions />
            </Layout>
          } />

          <Route path="/drawing-scanner/reports" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingReports />
            </Layout>
          } />

          <Route path="/drawing-scanner/quantities" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DrawingQuantities />
            </Layout>
          } />

          <Route path="/drawing-scanner/settings" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/drawing-scanner/*" element={
            <Layout sidebarItems={drawingScannerSidebar} sidebarTitle="Drawing Scanner">
              <DefaultFallback title="Drawing Scanner" />
            </Layout>
          } />
          
          {/* Solution 4: Clash Detection - Default to Dashboard */}
          <Route path="/clash-detection" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashDetectionDashboard />
            </Layout>
          } />

          <Route path="/clash-detection/dashboard" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashDetectionDashboard />
            </Layout>
          } />

          <Route path="/clash-detection/clashes" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashDetection />
            </Layout>
          } />

          <Route path="/clash-detection/projects" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashProjects />
            </Layout>
          } />

          <Route path="/clash-detection/models" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashModels />
            </Layout>
          } />

          <Route path="/clash-detection/coordination" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashCoordination />
            </Layout>
          } />

          <Route path="/clash-detection/disciplines" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashDisciplines />
            </Layout>
          } />

          <Route path="/clash-detection/reports" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <ClashReports />
            </Layout>
          } />

          <Route path="/clash-detection/settings" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/clash-detection/*" element={
            <Layout sidebarItems={clashDetectionSidebar} sidebarTitle="Clash Detection">
              <DefaultFallback title="Clash Detection" />
            </Layout>
          } />
          
          {/* Solution 3: Site Monitoring - Default to Dashboard */}
          <Route path="/site-monitoring" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteMonitoringDashboard />
            </Layout>
          } />

          <Route path="/site-monitoring/dashboard" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteMonitoringDashboard />
            </Layout>
          } />

          <Route path="/site-monitoring/live" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteMonitoring />
            </Layout>
          } />

          <Route path="/site-monitoring/live-view" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteMonitoring />
            </Layout>
          } />

          <Route path="/site-monitoring/cameras" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteCameras />
            </Layout>
          } />

          <Route path="/site-monitoring/violations" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteViolations />
            </Layout>
          } />

          <Route path="/site-monitoring/zones" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteZones />
            </Layout>
          } />

          <Route path="/site-monitoring/materials" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteMaterials />
            </Layout>
          } />

          <Route path="/site-monitoring/personnel" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SitePersonnel />
            </Layout>
          } />

          <Route path="/site-monitoring/reports" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <SiteReports />
            </Layout>
          } />

          <Route path="/site-monitoring/settings" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/site-monitoring/*" element={
            <Layout sidebarItems={siteMonitoringSidebar} sidebarTitle="Site Monitoring">
              <DefaultFallback title="Site Monitoring" />
            </Layout>
          } />
          
          {/* Solution 7: Progress Monitoring - Default to Dashboard */}
          <Route path="/progress-monitoring" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressDashboard />
            </Layout>
          } />

          <Route path="/progress-monitoring/dashboard" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressDashboard />
            </Layout>
          } />

          <Route path="/progress-monitoring/tracking" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressMonitoring />
            </Layout>
          } />

          <Route path="/progress-monitoring/schedule" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressSchedule />
            </Layout>
          } />

          <Route path="/progress-monitoring/4d-model" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <Progress4D />
            </Layout>
          } />

          <Route path="/progress-monitoring/evidence" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressEvidence />
            </Layout>
          } />

          <Route path="/progress-monitoring/earned-value" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressEarnedValue />
            </Layout>
          } />

          <Route path="/progress-monitoring/reports" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <ProgressReports />
            </Layout>
          } />

          <Route path="/progress-monitoring/settings" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <GlobalSettings />
            </Layout>
          } />

          <Route path="/progress-monitoring/*" element={
            <Layout sidebarItems={progressMonitoringSidebar} sidebarTitle="Progress Monitoring">
              <DefaultFallback title="Progress Monitoring" />
            </Layout>
          } />

          {/* Settings Section */}
          <Route path="/settings/profile" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Profile" />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="General" />
            </Layout>
          } />
          <Route path="/settings/document-ocr" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Document OCR" />
            </Layout>
          } />
          <Route path="/settings/drawing-scanner" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Drawing Scanner" />
            </Layout>
          } />
          <Route path="/settings/site-monitoring" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Site Monitoring" />
            </Layout>
          } />
          <Route path="/settings/clash-detection" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Clash Detection" />
            </Layout>
          } />
          <Route path="/settings/document-drafting" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Document Drafting" />
            </Layout>
          } />
          <Route path="/settings/knowledge-assistant" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Knowledge Assistant" />
            </Layout>
          } />
          <Route path="/settings/progress-monitoring" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Progress Monitoring" />
            </Layout>
          } />
          <Route path="/settings/api-keys" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="API Keys" />
            </Layout>
          } />
          <Route path="/settings/security" element={
            <Layout sidebarItems={settingsSidebar} sidebarTitle="Settings">
              <GlobalSettings tab="Security" />
            </Layout>
          } />
        </Routes>
      </InvoiceProvider>
    </BrowserRouter>
  );
};

export default App;
