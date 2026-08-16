import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const BimClashViewer = ({
  activeClashId,
  onSelectClash,
  disciplines,
  xrayMode,
  measureMode,
  zoomLevel,
  activeTool,
  onHoverObject,
  onResetViewRef
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const reqIdRef = useRef(null);
  const clashMarkersRef = useRef({});
  const disciplineGroupsRef = useRef({});
  const targetCamPosRef = useRef(null);
  const targetControlsTargetRef = useRef(null);
  const [clashScreenPos, setClashScreenPos] = useState({ x: 0, y: 0, visible: true });
  const [autoRotate, setAutoRotate] = useState(false);
  const [hovered3D, setHovered3D] = useState(null);

  // Clash 3D spatial coordinates within the building
  const clashPositions = {
    'CL-0142': new THREE.Vector3(2.5, 2.9, 1.2),   // Duct x Steel Beam
    'CL-0138': new THREE.Vector3(-4.0, 3.1, -4.0),  // Cable Tray x Column
    'CL-0131': new THREE.Vector3(6.5, 3.3, -2.5),   // Fire Sprinkler x Duct
    'CL-0125': new THREE.Vector3(-7.5, 1.8, 4.0),   // Soil Pipe x Wall
    'CL-0119': new THREE.Vector3(8.0, 2.7, 5.5),    // Duct x Ceiling Grid
    'CL-0104': new THREE.Vector3(-3.0, 2.2, 2.0),   // Elec Busbar x Chilled Water
  };

  // Focus camera on specific 3D clash
  const focusOnClash = useCallback((clashId) => {
    const pos = clashPositions[clashId];
    if (!pos || !controlsRef.current || !cameraRef.current) return;

    targetControlsTargetRef.current = pos.clone();
    targetCamPosRef.current = new THREE.Vector3(pos.x + 5.5, pos.y + 3.8, pos.z + 5.5);
  }, []);

  // Reset to full building isometric view
  const resetToBuildingView = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    targetControlsTargetRef.current = new THREE.Vector3(0, 2.0, 0);
    targetCamPosRef.current = new THREE.Vector3(24, 18, 24);
  }, []);

  // Expose reset to parent
  useEffect(() => {
    if (onResetViewRef) {
      onResetViewRef.current = resetToBuildingView;
    }
  }, [onResetViewRef, resetToBuildingView]);

  // Handle active clash change
  useEffect(() => {
    focusOnClash(activeClashId);
  }, [activeClashId, focusOnClash]);

  // Update discipline visibility and X-Ray ghosting
  useEffect(() => {
    const groups = disciplineGroupsRef.current;
    if (!groups) return;

    Object.keys(disciplines).forEach((disc) => {
      const group = groups[disc];
      if (group) {
        group.visible = disciplines[disc];
        group.traverse((child) => {
          if (child.isMesh && child.userData?.originalMaterial) {
            if (xrayMode) {
              // Ghost non-clashing items
              const isClashingElement = child.userData.clashId === activeClashId;
              child.material = isClashingElement 
                ? child.userData.originalMaterial 
                : child.userData.ghostMaterial || child.userData.originalMaterial;
            } else {
              child.material = child.userData.originalMaterial;
            }
          }
        });
      }
    });
  }, [disciplines, xrayMode, activeClashId]);

  // Setup Three.js 3D Building Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(22, 16, 22);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Full 360° Rotation from every angle)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.screenSpacePanning = true;
    controls.minDistance = 2.0;
    controls.maxDistance = 75.0;
    controls.target.set(0, 2.0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(25, 35, 20);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.camera.near = 0.5;
    dirLight1.shadow.camera.far = 80;
    dirLight1.shadow.camera.left = -20;
    dirLight1.shadow.camera.right = 20;
    dirLight1.shadow.camera.top = 20;
    dirLight1.shadow.camera.bottom = -20;
    dirLight1.shadow.bias = -0.0005;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.6);
    dirLight2.position.set(-20, 15, -20);
    scene.add(dirLight2);

    const floorLight = new THREE.DirectionalLight(0x10b981, 0.2);
    floorLight.position.set(0, -10, 0);
    scene.add(floorLight);

    // 6. Floor Grid & Building Ground Plane
    const gridHelper = new THREE.GridHelper(36, 36, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Coordinate Grid Pillars & Floor Markers
    const gridLabels = ['D-1', 'D-2', 'D-3', 'D-4', 'E-1', 'E-2', 'E-3', 'E-4', 'F-1', 'F-2', 'F-3', 'F-4'];
    const gridPositions = [
      [-12, -8], [-4, -8], [4, -8], [12, -8],
      [-12, 0], [-4, 0], [4, 0], [12, 0],
      [-12, 8], [-4, 8], [4, 8], [12, 8]
    ];

    // Discipline Groups
    const archGroup = new THREE.Group();
    const structGroup = new THREE.Group();
    const mechGroup = new THREE.Group();
    const elecGroup = new THREE.Group();
    const plumbGroup = new THREE.Group();
    const fireGroup = new THREE.Group();
    const clashGroup = new THREE.Group();

    disciplineGroupsRef.current = {
      ARCHITECTURAL: archGroup,
      STRUCTURAL: structGroup,
      MECHANICAL: mechGroup,
      ELECTRICAL: elecGroup,
      PLUMBING: plumbGroup,
      'FIRE PROTECTION': fireGroup
    };

    scene.add(archGroup);
    scene.add(structGroup);
    scene.add(mechGroup);
    scene.add(elecGroup);
    scene.add(plumbGroup);
    scene.add(fireGroup);
    scene.add(clashGroup);

    // Materials Palette
    const concreteFloorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.1 });
    const concreteCeilingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.15, transparent: true, opacity: 0.85 });
    const glassFacadeMat = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.85, opacity: 0.4, transparent: true, roughness: 0.1, metalness: 0.1, ior: 1.5 });
    const aluminiumMullionMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const drywallWallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9, metalness: 0.05 });
    
    // PBR Discipline Materials
    const structSteelMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.7 });
    const mechGalvDuctMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.25, metalness: 0.8 });
    const elecTrayMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.6 });
    const plumbPvcMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.4 });
    const fireRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.5 });
    const clashRedGlowMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0044, emissiveIntensity: 0.8, roughness: 0.2, transparent: true, opacity: 0.7 });

    // Ghost Wireframe Material for X-Ray
    const ghostMat = new THREE.MeshStandardMaterial({ color: 0x64748b, transparent: true, opacity: 0.15, wireframe: false });

    const tagBimObject = (mesh, name, id, category, size, elevation, clashId = null) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        name, id, category, size, elevation, clashId,
        originalMaterial: mesh.material,
        ghostMaterial: ghostMat
      };
      return mesh;
    };

    // ==========================================
    // 1. ARCHITECTURAL DISCIPLINE (Level 03 Shell)
    // ==========================================
    // Lower Concrete Floor Slab
    const floorSlab = new THREE.Mesh(new THREE.BoxGeometry(32, 0.4, 22), concreteFloorMat);
    floorSlab.position.set(0, -0.2, 0);
    floorSlab.receiveShadow = true;
    archGroup.add(tagBimObject(floorSlab, 'Level 03 Structural Floor Slab', '#ARC-SLAB-03', 'Architecture', '32m x 22m x 400mm', '+10.000m'));

    // Upper Ceiling Slab (Cutaway Section so we can see inside ceiling void)
    const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 20), concreteCeilingMat);
    ceilingSlab.position.set(-4, 4.4, 0);
    archGroup.add(tagBimObject(ceilingSlab, 'Level 04 Soffit Slab (Ceiling Void Top)', '#ARC-SOFFIT-04', 'Architecture', '22m x 20m x 300mm', '+14.250m'));

    // Perimeter Glass Curtain Wall Facades
    const curtainWall1 = new THREE.Mesh(new THREE.BoxGeometry(32, 4.4, 0.1), glassFacadeMat);
    curtainWall1.position.set(0, 2.2, -11);
    archGroup.add(curtainWall1);

    const curtainWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.4, 22), glassFacadeMat);
    curtainWall2.position.set(16, 2.2, 0);
    archGroup.add(curtainWall2);

    // Aluminium Mullions
    for (let x = -16; x <= 16; x += 4) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4.4, 0.2), aluminiumMullionMat);
      mullion.position.set(x, 2.2, -11);
      archGroup.add(mullion);
    }

    // Interior Drywall Partitions (Corridor & Meeting Rooms)
    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 0.2), drywallWallMat);
    wall1.position.set(-6, 1.6, 4);
    archGroup.add(tagBimObject(wall1, '2HR Fire Partition Wall', '#ARC-WALL-102', 'Architecture', '16m x 3.2m x 150mm', '+10.000m', 'CL-0125'));

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 10), drywallWallMat);
    wall2.position.set(2, 1.6, -1);
    archGroup.add(tagBimObject(wall2, 'Meeting Room Partition', '#ARC-WALL-104', 'Architecture', '10m x 3.2m x 150mm', '+10.000m'));

    // Suspended Ceiling Grid Tees
    for (let x = -14; x <= 14; x += 2) {
      const tee = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 20), aluminiumMullionMat);
      tee.position.set(x, 3.5, 0);
      archGroup.add(tee);
    }

    // ==========================================
    // 2. STRUCTURAL STEEL FRAMING (Blue UB & UC)
    // ==========================================
    // Columns UC 254 at Grid Intersections
    gridPositions.forEach(([gx, gz], idx) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.4, 0.5), structSteelMat);
      col.position.set(gx, 2.2, gz);
      
      const baseplate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.9), structSteelMat);
      baseplate.position.set(gx, 0.04, gz);
      structGroup.add(baseplate);

      const isClashColumn = (gx === -4 && gz === -4);
      structGroup.add(tagBimObject(col, `Structural Column UC 254 (${gridLabels[idx]})`, `#STR-COL-${idx}`, 'Structural', 'UC 254x254x73kg', '+10.000m', isClashColumn ? 'CL-0138' : null));
    });

    // Primary Universal Beams UB 305 spanning X-axis
    [-8, 0, 8].forEach((bz, rowIdx) => {
      // Beam Web & Flanges
      const beam = new THREE.Mesh(new THREE.BoxGeometry(32, 0.45, 0.25), structSteelMat);
      beam.position.set(0, 3.9, bz);
      
      const isClashBeam = (bz === 0);
      structGroup.add(tagBimObject(beam, `Primary Universal Beam UB 305 (Grid ${rowIdx === 0 ? 'D' : rowIdx === 1 ? 'E' : 'F'})`, `#STR-UB-${rowIdx}`, 'Structural', 'UB 305x165x46kg', '+13.920m', isClashBeam ? 'CL-0142' : null));
    });

    // Secondary Cross Beams spanning Z-axis
    [-12, -4, 4, 12].forEach((bx, colIdx) => {
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 20), structSteelMat);
      crossBeam.position.set(bx, 3.9, 0);
      structGroup.add(tagBimObject(crossBeam, `Secondary Beam UB 254 (Grid ${colIdx + 1})`, `#STR-XB-${colIdx}`, 'Structural', 'UB 254x146x37kg', '+13.920m'));
    });

    // ==========================================
    // 3. MECHANICAL HVAC DUCTWORK (Cyan / Galvanized)
    // ==========================================
    // Main Supply Trunk Duct (800x500mm) running along X-axis
    const mainDuct = new THREE.Mesh(new THREE.BoxGeometry(28, 0.5, 0.8), mechGalvDuctMat);
    mainDuct.position.set(0, 3.2, -3.0);
    mechGroup.add(tagBimObject(mainDuct, 'Main Supply Air Trunk Duct', '#MCH-DUCT-TRUNK-01', 'Mechanical', '800x500mm (SA-01)', '+13.200m', 'CL-0131'));

    // Clashing Diagonal Supply Branch Duct (600x400mm)
    const clashBranchDuct = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 0.6), mechGalvDuctMat);
    clashBranchDuct.position.set(2.5, 3.1, 0.5);
    clashBranchDuct.rotation.y = THREE.MathUtils.degToRad(35);
    mechGroup.add(tagBimObject(clashBranchDuct, 'Supply Air Branch Duct 600x400', '#MCH-DUCT-BR-04', 'Mechanical', '600x400mm (SA-03)', '+13.100m', 'CL-0142'));

    // Additional HVAC Branch Ducts into Rooms
    const branchDuct1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 8), mechGalvDuctMat);
    branchDuct1.position.set(-8, 3.1, 2);
    mechGroup.add(tagBimObject(branchDuct1, 'Zone 1 Branch Duct', '#MCH-DUCT-BR-01', 'Mechanical', '500x350mm', '+13.100m'));

    const branchDuct2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 9), mechGalvDuctMat);
    branchDuct2.position.set(8, 2.8, 4);
    mechGroup.add(tagBimObject(branchDuct2, 'Meeting Room Extract Duct', '#MCH-DUCT-EXT-02', 'Mechanical', '450x300mm', '+12.800m', 'CL-0119'));

    // Ceiling Air Diffusers & Droppers
    [[-8, 4], [-8, -1], [8, 4], [8, -2], [0, 4]].forEach(([dx, dz], i) => {
      const dropFlex = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), mechGalvDuctMat);
      dropFlex.position.set(dx, 3.4, dz);
      mechGroup.add(dropFlex);

      const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.6), aluminiumMullionMat);
      diffuser.position.set(dx, 3.1, dz);
      mechGroup.add(tagBimObject(diffuser, `4-Way Supply Diffuser (${i + 1})`, `#MCH-DIFF-${i}`, 'Mechanical', '600x600mm Face', '+13.100m'));
    });

    // ==========================================
    // 4. ELECTRICAL CONTAINMENT (Amber / Yellow)
    // ==========================================
    // Heavy Duty Cable Tray (300x50mm)
    const cableTrayMain = new THREE.Mesh(new THREE.BoxGeometry(26, 0.06, 0.35), elecTrayMat);
    cableTrayMain.position.set(-1, 3.6, -4.0);
    elecGroup.add(tagBimObject(cableTrayMain, 'LV Power & Data Cable Tray', '#ELC-TRAY-LV01', 'Electrical', '300x50mm Ladder', '+13.600m', 'CL-0138'));

    // Cable Tray Branch
    const cableTrayBranch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 12), elecTrayMat);
    cableTrayBranch.position.set(-3, 3.6, 2);
    elecGroup.add(tagBimObject(cableTrayBranch, 'Riser Busbar Feeder Tray', '#ELC-BUS-01', 'Electrical', '200x50mm Tray', '+13.600m', 'CL-0104'));

    // Lighting fixtures
    [[-4, 2], [4, 2], [-4, -4], [4, -4]].forEach(([lx, lz], i) => {
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9 }));
      fixture.position.set(lx, 3.48, lz);
      elecGroup.add(fixture);
    });

    // ==========================================
    // 5. FIRE PROTECTION SPRINKLER SYSTEM (Red)
    // ==========================================
    // Sprinkler Distribution Main Pipe (Ø100mm)
    const fireMain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 28, 16), fireRedMat);
    fireMain.rotation.z = Math.PI / 2;
    fireMain.position.set(0, 3.55, -2.5);
    fireGroup.add(tagBimObject(fireMain, 'Fire Sprinkler Main Ø100', '#FP-PIPE-MAIN-01', 'Fire Protection', 'Ø100mm Sch 40 Red', '+13.550m', 'CL-0131'));

    // Sprinkler Cross Branches & Droppers
    [-8, 0, 8].forEach((fx, i) => {
      const branchPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 16, 12), fireRedMat);
      branchPipe.rotation.x = Math.PI / 2;
      branchPipe.position.set(fx, 3.55, 0);
      fireGroup.add(branchPipe);

      [-6, 0, 6].forEach((fz) => {
        const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), fireRedMat);
        drop.position.set(fx, 3.4, fz);
        fireGroup.add(drop);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 }));
        head.position.set(fx, 3.25, fz);
        fireGroup.add(tagBimObject(head, 'Pendant Sprinkler Head (K-Factor 5.6)', `#FP-HEAD-${i}`, 'Fire Protection', '15mm Quick Response', '+13.250m'));
      });
    });

    // ==========================================
    // 6. PLUMBING & DRAINAGE PIPES (Green PVC/Copper)
    // ==========================================
    // Soil & Waste Drainage Pipe (Ø110mm)
    const soilPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 24, 16), plumbPvcMat);
    soilPipe.rotation.z = Math.PI / 2;
    soilPipe.position.set(0, 1.8, 4.0);
    plumbGroup.add(tagBimObject(soilPipe, 'Sanitary Soil Pipe Ø110', '#PLB-SOIL-110', 'Plumbing', 'Ø110mm PVC-U', '+11.800m', 'CL-0125'));

    // Domestic Cold Water Pipe
    const waterPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 24, 16), plumbPvcMat);
    waterPipe.rotation.z = Math.PI / 2;
    waterPipe.position.set(0, 2.0, 4.0);
    plumbGroup.add(tagBimObject(waterPipe, 'Domestic Cold Water Pipe Ø50', '#PLB-CW-50', 'Plumbing', 'Ø50mm Copper/PEX', '+12.000m'));

    // Chilled Water Pipe
    const chilledPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 14, 16), plumbPvcMat);
    chilledPipe.rotation.x = Math.PI / 2;
    chilledPipe.position.set(-3.0, 2.2, 2.0);
    plumbGroup.add(tagBimObject(chilledPipe, 'Chilled Water Return Ø80', '#PLB-CHW-80', 'Plumbing', 'Ø80mm Pre-Insulated', '+12.200m', 'CL-0104'));

    // ==========================================
    // 7. 3D VOLUMETRIC CLASH INTERSECTION MARKERS
    // ==========================================
    Object.keys(clashPositions).forEach((cId) => {
      const cPos = clashPositions[cId];
      const isResolved = cId === 'CL-0104';

      const markerMesh = new THREE.Mesh(
        new THREE.SphereGeometry(isResolved ? 0.35 : 0.6, 24, 24),
        isResolved 
          ? new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.6, transparent: true, opacity: 0.75 })
          : clashRedGlowMat
      );
      markerMesh.position.copy(cPos);

      // Collision Wireframe Box
      const clashBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.9, 0.9),
        new THREE.MeshBasicMaterial({ 
          color: isResolved ? 0x10b981 : 0xff0055, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.8 
        })
      );
      markerMesh.add(clashBox);

      clashGroup.add(markerMesh);
      clashMarkersRef.current[cId] = markerMesh;
    });

    // 8. Raycasting Mouse Hover Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let found = null;
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj.userData?.name) {
          found = obj.userData;
          break;
        }
      }

      setHovered3D(found);
      if (onHoverObject) {
        onHoverObject(found);
      }
    };

    const onCanvasClick = () => {
      if (hovered3D?.clashId && onSelectClash) {
        onSelectClash(hovered3D.clashId);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onCanvasClick);

    // Initial Focus
    focusOnClash(activeClashId);

    // 9. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Camera Animation to Target
      if (targetCamPosRef.current && targetControlsTargetRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.08);
        controls.target.lerp(targetControlsTargetRef.current, 0.08);

        if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
          targetControlsTargetRef.current = null;
        }
      }

      // Auto-Orbit Tour
      if (autoRotate) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;
      } else {
        controls.autoRotate = false;
      }

      controls.update();

      // Pulse Active Clash Marker
      Object.keys(clashMarkersRef.current).forEach((cId) => {
        const marker = clashMarkersRef.current[cId];
        if (marker) {
          const isActive = cId === activeClashId;
          const scale = isActive ? 1.0 + Math.sin(time * 4) * 0.25 : 0.8;
          marker.scale.set(scale, scale, scale);
        }
      });

      // Project Active Clash 3D position to 2D Screen Space
      const pos = clashPositions[activeClashId];
      if (pos) {
        const screenVec = pos.clone().project(camera);
        const hw = container.clientWidth / 2;
        const hh = container.clientHeight / 2;
        const sx = screenVec.x * hw + hw;
        const sy = -(screenVec.y * hh) + hh;
        const isBehind = screenVec.z > 1;

        setClashScreenPos({
          x: sx,
          y: sy,
          visible: !isBehind && sx > 0 && sx < container.clientWidth && sy > 0 && sy < container.clientHeight
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Three.js Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: activeTool === 'orbit' ? 'grab' : 'crosshair' }} />

      {/* Floating 3D Clash Diagnostic Overlay Pin */}
      {clashScreenPos.visible && (
        <div
          style={{
            position: 'absolute',
            left: clashScreenPos.x,
            top: clashScreenPos.y,
            transform: 'translate(-50%, -100%) translateY(-24px)',
            pointerEvents: 'none',
            zIndex: 15
          }}
        >
          {/* Animated Glow Target */}
          <div style={{
            position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.4)', border: '2px solid #EF4444',
            boxShadow: '0 0 20px #EF4444',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }} />

          {/* Leader Line Pin */}
          <div style={{
            position: 'absolute', bottom: -20, left: '50%', width: 2, height: 20,
            background: '#EF4444', transform: 'translateX(-50%)'
          }} />
        </div>
      )}

      {/* Camera View Presets Bar */}
      <div style={{
        position: 'absolute', top: 56, right: 16,
        display: 'flex', gap: 6, zIndex: 20,
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
        padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {[
          { label: '3D ISO', fn: () => resetToBuildingView() },
          { label: 'TOP', fn: () => { if (controlsRef.current && cameraRef.current) { targetControlsTargetRef.current = new THREE.Vector3(0, 0, 0); targetCamPosRef.current = new THREE.Vector3(0, 32, 0.1); } } },
          { label: 'FRONT', fn: () => { if (controlsRef.current && cameraRef.current) { targetControlsTargetRef.current = new THREE.Vector3(0, 2, 0); targetCamPosRef.current = new THREE.Vector3(0, 2, 30); } } },
          { label: 'CLASH FOCUS', fn: () => focusOnClash(activeClashId) },
        ].map(preset => (
          <button
            key={preset.label}
            onClick={preset.fn}
            style={{
              background: 'transparent', border: 'none', color: '#E2E8F0',
              padding: '4px 8px', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s'
            }}
            className="hover-bg-gray-800"
          >
            {preset.label}
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)', margin: 'auto 2px' }} />
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: autoRotate ? 'var(--color-brand-600)' : 'transparent',
            border: 'none', color: autoRotate ? 'white' : '#94A3B8',
            padding: '4px 8px', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s'
          }}
        >
          {autoRotate ? 'Orbiting...' : 'Auto-Orbit'}
        </button>
      </div>

      {/* BIM Element Hover Info Card */}
      {hovered3D && (
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 20,
          background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10,
          padding: '10px 16px', color: 'white', fontSize: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          display: 'flex', gap: 16, alignItems: 'center'
        }}>
          <div>
            <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: 13 }}>{hovered3D.name}</div>
            <div style={{ color: '#94A3B8', fontSize: 11 }}>{hovered3D.category} • {hovered3D.id}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ color: '#E2E8F0', fontWeight: 600 }}>{hovered3D.size}</div>
            <div style={{ color: '#F59E0B', fontSize: 11 }}>Elev: {hovered3D.elevation}</div>
          </div>
        </div>
      )}

      {/* 3D Navigation Gizmo Helper Text */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 20,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
        padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
        color: '#94A3B8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span>Left Drag: <strong>Orbit 360°</strong></span>
        <span>•</span>
        <span>Right Drag: <strong>Pan</strong></span>
        <span>•</span>
        <span>Scroll: <strong>Zoom</strong></span>
      </div>
    </div>
  );
};
