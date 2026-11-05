import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Eye, Sparkles, Activity, Layers, Play, Pause } from 'lucide-react';

interface HospitalCampus3DProps {
  className?: string;
  onExploreWing?: (wingName: string) => void;
}

export const HospitalCampus3D: React.FC<HospitalCampus3DProps> = ({
  className = 'h-96',
  onExploreWing
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFloor, setActiveFloor] = useState<'all' | 'roof' | 'icu' | 'ot' | 'opd'>('all');
  const [autoRotate, setAutoRotate] = useState(true);
  const [activePreset, setActivePreset] = useState<'front' | 'angled' | 'top'>('angled');
  const [hoveredWing, setHoveredWing] = useState<string | null>(null);

  // References to communicate with Three.js loop
  const sceneStateRef = useRef({
    activeFloor: 'all',
    targetCameraPos: new THREE.Vector3(14, 11, 15),
    targetLookAt: new THREE.Vector3(0, 2.5, 0),
    autoRotate: true,
    rotationSpeed: 0.003,
    floorSeparation: 0,
    targetSeparation: 0
  });

  useEffect(() => {
    sceneStateRef.current.activeFloor = activeFloor;
    if (activeFloor === 'all') {
      sceneStateRef.current.targetSeparation = 0;
    } else {
      sceneStateRef.current.targetSeparation = 1.2;
    }
  }, [activeFloor]);

  useEffect(() => {
    sceneStateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (activePreset === 'front') {
      sceneStateRef.current.targetCameraPos.set(0, 5, 20);
      sceneStateRef.current.targetLookAt.set(0, 3, 0);
    } else if (activePreset === 'top') {
      sceneStateRef.current.targetCameraPos.set(0, 22, 10);
      sceneStateRef.current.targetLookAt.set(0, 0, 0);
    } else {
      sceneStateRef.current.targetCameraPos.set(14, 11, 15);
      sceneStateRef.current.targetLookAt.set(0, 2.5, 0);
    }
  }, [activePreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A1A2F');
    scene.fog = new THREE.FogExp2('#0A1A2F', 0.025);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(14, 11, 15);
    camera.lookAt(0, 2.5, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via PMREMGenerator & RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // LIGHTING RIG
    // Key Light (warm medical cyan-white)
    const keyLight = new THREE.DirectionalLight('#e0f7f6', 2.8);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 40;
      keyLight.shadow.camera.left = -12;
      keyLight.shadow.camera.right = 12;
      keyLight.shadow.camera.top = 12;
      keyLight.shadow.camera.bottom = -12;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Fill Light (cool navy)
    const fillLight = new THREE.DirectionalLight('#4287f5', 1.2);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    // Cool ground / sky hemisphere
    const hemiLight = new THREE.HemisphereLight('#80e5ff', '#0d2238', 0.8);
    scene.add(hemiLight);

    // Emergency Accent Light (subtle red glow on the casualty wing)
    const casualtyLight = new THREE.PointLight('#ff3344', 3.0, 8);
    casualtyLight.position.set(-4.5, 1.2, 3.5);
    scene.add(casualtyLight);

    // Cyan Neon Accent Light for Main Entrance
    const entranceLight = new THREE.PointLight('#14e5d4', 3.5, 10);
    entranceLight.position.set(0, 1.2, 4.5);
    scene.add(entranceLight);

    // MASTER ROOT GROUP
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // GROUND PLAZA & ROADWAYS
    const groundGeo = new THREE.CylinderGeometry(14, 14.5, 0.6, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#0e243a',
      roughness: 0.85,
      metalness: 0.2
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.3;
    groundMesh.receiveShadow = !isSoftwareGl;
    campusGroup.add(groundMesh);

    // Circular glowing perimeter ring
    const ringGeo = new THREE.RingGeometry(13.8, 14.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#168C8C',
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    campusGroup.add(ringMesh);

    // Soft Radial Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 5, 15, 0.85)');
      grad.addColorStop(0.5, 'rgba(0, 5, 15, 0.35)');
      grad.addColorStop(1, 'rgba(0, 5, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.03;
    campusGroup.add(shadowMesh);

    // MATERIALS
    const buildingBodyMat = new THREE.MeshStandardMaterial({
      color: '#1a3b5c',
      roughness: 0.3,
      metalness: 0.4
    });

    const emergencyWingMat = new THREE.MeshStandardMaterial({
      color: '#243b55',
      roughness: 0.35,
      metalness: 0.3
    });

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#7eeded',
      roughness: 0.1,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      opacity: 0.85,
      transparent: true,
      ior: 1.5
    });

    const accentTealMat = new THREE.MeshStandardMaterial({
      color: '#168C8C',
      roughness: 0.2,
      metalness: 0.7,
      emissive: '#0b4a4a',
      emissiveIntensity: 0.4
    });

    const heliRedMat = new THREE.MeshStandardMaterial({
      color: '#e63946',
      roughness: 0.4,
      metalness: 0.3,
      emissive: '#590d13',
      emissiveIntensity: 0.4
    });

    const whiteLineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });

    // HIERARCHICAL HOSPITAL FLOORS (Allows 3D Exploded / Layered view)
    const floorGroups: { [key: string]: THREE.Group } = {
      ground: new THREE.Group(),
      second: new THREE.Group(),
      third: new THREE.Group(),
      roof: new THREE.Group()
    };

    // --- FLOOR 1: GROUND FLOOR (Casualty, Emergency, OPD Entry) ---
    const groundFloorGroup = floorGroups.ground;

    // Main central block base
    const baseGeo = new THREE.BoxGeometry(6.5, 1.8, 5.5);
    const baseMesh = new THREE.Mesh(baseGeo, buildingBodyMat);
    baseMesh.position.set(0, 0.9, 0);
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    groundFloorGroup.add(baseMesh);

    // Emergency Casualty West Wing
    const emergencyGeo = new THREE.BoxGeometry(3.5, 1.6, 4.5);
    const emergencyMesh = new THREE.Mesh(emergencyGeo, emergencyWingMat);
    emergencyMesh.position.set(-4.5, 0.8, 0.5);
    emergencyMesh.castShadow = !isSoftwareGl;
    groundFloorGroup.add(emergencyMesh);

    // Emergency Red Cross Embellishment on Wing
    const crossBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.1), heliRedMat);
    crossBar1.position.set(-4.5, 1.0, 2.8);
    const crossBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.8, 0.1), heliRedMat);
    crossBar2.position.set(-4.5, 1.0, 2.8);
    groundFloorGroup.add(crossBar1, crossBar2);

    // Emergency Ambulance Dock / Portico
    const porticoGeo = new THREE.BoxGeometry(3.2, 0.15, 2.2);
    const porticoMesh = new THREE.Mesh(porticoGeo, accentTealMat);
    porticoMesh.position.set(-4.5, 1.5, 3.6);
    groundFloorGroup.add(porticoMesh);

    // Portico Support Pillars
    const pillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), accentTealMat);
    pillar1.position.set(-3.2, 0.75, 4.4);
    const pillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), accentTealMat);
    pillar2.position.set(-5.8, 0.75, 4.4);
    groundFloorGroup.add(pillar1, pillar2);

    // Ambulances parked
    const ambuBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 1.8), new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 }));
    ambuBody.position.set(-4.5, 0.4, 3.6);
    ambuBody.castShadow = !isSoftwareGl;
    const ambuSiren = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.2), heliRedMat);
    ambuSiren.position.set(-4.5, 0.9, 3.6);
    groundFloorGroup.add(ambuBody, ambuSiren);

    // Main Entrance Canopy (Glass & Curved Teal Arch)
    const canopyGeo = new THREE.BoxGeometry(3.2, 0.15, 1.8);
    const canopyMesh = new THREE.Mesh(canopyGeo, accentTealMat);
    canopyMesh.position.set(0, 1.4, 3.4);
    groundFloorGroup.add(canopyMesh);

    // Glass Entrance Doors
    const doorGeo = new THREE.BoxGeometry(2.2, 1.2, 0.1);
    const doorMesh = new THREE.Mesh(doorGeo, windowGlassMat);
    doorMesh.position.set(0, 0.6, 2.8);
    groundFloorGroup.add(doorMesh);

    // Neon Hospital Entrance Letters Sign
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.4, 0.1),
      new THREE.MeshStandardMaterial({ color: '#12304A', emissive: '#0a6464', emissiveIntensity: 0.6 })
    );
    signBoard.position.set(0, 1.8, 3.4);
    groundFloorGroup.add(signBoard);

    campusGroup.add(groundFloorGroup);

    // --- FLOOR 2: FIRST FLOOR (Operation Theatres & Surgical Suites) ---
    const secondFloorGroup = floorGroups.second;
    const f2Body = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.6, 5.2), buildingBodyMat);
    f2Body.position.set(0, 2.6, 0);
    f2Body.castShadow = !isSoftwareGl;
    secondFloorGroup.add(f2Body);

    // East Wing (Diagnostic & Cath Lab)
    const eastWingGeo = new THREE.BoxGeometry(3.2, 1.5, 4.2);
    const eastWingMesh = new THREE.Mesh(eastWingGeo, buildingBodyMat);
    eastWingMesh.position.set(4.2, 2.5, 0);
    secondFloorGroup.add(eastWingMesh);

    // Continuous Glass Ribbon Windows for OT Floor
    const glassRibbonGeo = new THREE.BoxGeometry(6.3, 0.6, 5.3);
    const glassRibbonMesh = new THREE.Mesh(glassRibbonGeo, windowGlassMat);
    glassRibbonMesh.position.set(0, 2.6, 0);
    secondFloorGroup.add(glassRibbonMesh);

    campusGroup.add(secondFloorGroup);

    // --- FLOOR 3: SECOND FLOOR (Critical Care, MICU, SICU, NICU) ---
    const thirdFloorGroup = floorGroups.third;
    const f3Body = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.5, 4.8), buildingBodyMat);
    f3Body.position.set(0, 4.15, 0);
    f3Body.castShadow = !isSoftwareGl;
    thirdFloorGroup.add(f3Body);

    const f3GlassGeo = new THREE.BoxGeometry(5.9, 0.55, 4.9);
    const f3Glass = new THREE.Mesh(f3GlassGeo, windowGlassMat);
    f3Glass.position.set(0, 4.15, 0);
    thirdFloorGroup.add(f3Glass);

    campusGroup.add(thirdFloorGroup);

    // --- ROOF & HELIPAD STRUCTURE ---
    const roofGroup = floorGroups.roof;
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 4.4), accentTealMat);
    roofSlab.position.set(0, 5.0, 0);
    roofGroup.add(roofSlab);

    // Modern Solar Panels array on roof
    for (let r = -1; r <= 1; r++) {
      const solarPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.8),
        new THREE.MeshStandardMaterial({ color: '#092342', roughness: 0.1, metalness: 0.9 })
      );
      solarPanel.position.set(-1.4, 5.15, r * 1.1);
      solarPanel.rotation.z = 0.15;
      roofGroup.add(solarPanel);
    }

    // Elevated Helipad Platform (Emergency Air Ambulance)
    const helipadLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), accentTealMat);
    helipadLeg1.position.set(1.2, 5.3, 0.8);
    const helipadLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), accentTealMat);
    helipadLeg2.position.set(2.4, 5.3, 0.8);
    const helipadLeg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), accentTealMat);
    helipadLeg3.position.set(1.8, 5.3, -0.6);
    roofGroup.add(helipadLeg1, helipadLeg2, helipadLeg3);

    const helipadDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: '#16283d', roughness: 0.5 })
    );
    helipadDeck.position.set(1.8, 5.6, 0.1);
    roofGroup.add(helipadDeck);

    // Helipad Red Circle & "H" Marking
    const heliRing = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.3, 32),
      new THREE.MeshBasicMaterial({ color: '#ff3b3b', side: THREE.DoubleSide })
    );
    heliRing.rotation.x = -Math.PI / 2;
    heliRing.position.set(1.8, 5.66, 0.1);
    roofGroup.add(heliRing);

    // "H" bar
    const hBar1 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.8), whiteLineMat);
    hBar1.rotation.x = -Math.PI / 2;
    hBar1.position.set(1.55, 5.67, 0.1);
    const hBar2 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.8), whiteLineMat);
    hBar2.rotation.x = -Math.PI / 2;
    hBar2.position.set(2.05, 5.67, 0.1);
    const hBar3 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.18), whiteLineMat);
    hBar3.rotation.x = -Math.PI / 2;
    hBar3.position.set(1.8, 5.67, 0.1);
    roofGroup.add(hBar1, hBar2, hBar3);

    // Rooftop illuminated Medical Cross
    const roofCross1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.28, 0.28), accentTealMat);
    roofCross1.position.set(0, 5.6, -1.8);
    const roofCross2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), accentTealMat);
    roofCross2.position.set(0, 5.6, -1.8);
    roofGroup.add(roofCross1, roofCross2);

    campusGroup.add(roofGroup);

    // PROCEDURAL TREES & GREENERY (Instanced for high performance)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    const treeFoliageGeo = new THREE.DodecahedronGeometry(0.6, 1);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#4a3525', roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: '#105646', roughness: 0.6, metalness: 0.1 });

    const treePositions = [
      [3.5, 3.5], [5.0, 3.2], [6.2, 2.0], [7.0, 0.5],
      [-2.5, 4.2], [2.5, 4.2], [-7.0, 2.0], [-7.5, 0.0],
      [-6.5, -2.5], [6.0, -2.5], [0, -4.5], [2.5, -4.0]
    ];

    treePositions.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 0.4;
      trunk.castShadow = !isSoftwareGl;

      const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
      foliage.position.y = 1.0;
      foliage.scale.set(0.9 + Math.random() * 0.3, 1.1 + Math.random() * 0.4, 0.9 + Math.random() * 0.3);
      foliage.castShadow = !isSoftwareGl;

      treeGroup.add(trunk, foliage);
      campusGroup.add(treeGroup);
    });

    // FLOATING MEDICAL ENERGY PARTICLES
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 7 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#44f2e0',
      size: 0.22,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    campusGroup.add(particles);

    // INTERACTION (Mouse drag & hover)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let userRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      userRotationY += deltaX * 0.008;
      campusGroup.rotation.y = userRotationY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // TOUCH SUPPORT FOR MOBILE
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      userRotationY += deltaX * 0.008;
      campusGroup.rotation.y = userRotationY;
      prevMouseX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    domElement.addEventListener('touchend', onTouchEnd);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    // ANIMATION & RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto rotation if not dragged
      if (sceneStateRef.current.autoRotate && !isDragging) {
        userRotationY += sceneStateRef.current.rotationSpeed;
        campusGroup.rotation.y = userRotationY;
      }

      // Smooth camera interpolation
      camera.position.lerp(sceneStateRef.current.targetCameraPos, 0.05);
      camera.lookAt(sceneStateRef.current.targetLookAt);

      // Smooth Exploded-view floor layer animation
      const targetSep = sceneStateRef.current.targetSeparation;
      sceneStateRef.current.floorSeparation = THREE.MathUtils.lerp(
        sceneStateRef.current.floorSeparation,
        targetSep,
        0.08
      );

      const sep = sceneStateRef.current.floorSeparation;
      floorGroups.ground.position.y = 0;
      floorGroups.second.position.y = sep * 0.8;
      floorGroups.third.position.y = sep * 1.6;
      floorGroups.roof.position.y = sep * 2.4;

      // Pulse Casualty Beacon
      casualtyLight.intensity = 2.0 + Math.sin(time * 6) * 1.8;

      // Animate floating particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(time + i) * 0.005;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071322] via-[#0c223a] to-[#12384a] shadow-xl border border-teal-500/30 flex flex-col justify-between ${className}`}>
      
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

      {/* Top Floating Badge Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12304A]/90 backdrop-blur-md rounded-xl text-xs font-bold text-teal-300 border border-teal-500/30 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Interactive 3D Campus</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            Drag to Rotate 360°
          </span>
        </div>

        {/* Rotation & Play/Pause controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs backdrop-blur-md border transition-all ${
              autoRotate
                ? 'bg-teal-500/20 text-teal-300 border-teal-400/40 shadow-sm'
                : 'bg-black/40 text-slate-300 border-white/10'
            }`}
            title={autoRotate ? 'Pause 360° Orbit' : 'Resume 360° Orbit'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Wing Highlights (Hover pills) */}
      <div className="relative z-10 px-4 pointer-events-none">
        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
          {[
            { id: 'casualty', label: 'Casualty & Trauma', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
            { id: 'ot', label: 'OT Surgical Block', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
            { id: 'icu', label: 'ICU (MICU/NICU)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
            { id: 'heli', label: 'Helipad Deck', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
          ].map(wing => (
            <button
              key={wing.id}
              onClick={() => onExploreWing?.(wing.label)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md border transition-transform hover:scale-105 active:scale-95 ${wing.color}`}
            >
              {wing.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sleek Bottom Control Dock (Consolidated zero-occlusion dock) */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-[#06111f] via-[#06111f]/80 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0c223a]/80 backdrop-blur-md p-2 rounded-xl border border-teal-500/20">
          
          {/* Camera Angles */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 hidden sm:inline">Camera:</span>
            {(['angled', 'front', 'top'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => setActivePreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                  activePreset === preset
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* 3D Exploded-View Layers Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFloor(activeFloor === 'all' ? 'icu' : 'all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeFloor !== 'all'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-[#071322] shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-teal-300 border border-teal-500/30'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{activeFloor === 'all' ? 'Explode Floors 3D' : 'Collapse Campus'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
