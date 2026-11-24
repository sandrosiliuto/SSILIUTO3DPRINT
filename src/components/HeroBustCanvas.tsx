import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildSculptedBust } from '../three/bustSculpture';
import { afterDraw, createStudioEnvironment, detectSoftwareGl, disposeObject3D } from '../three/webglUtils';
import { STUDIO_REAL_IMAGES } from '../data/studioShowcase';

interface HeroBustCanvasProps {
  showWireframe?: boolean;
}

export default function HeroBustCanvas({ showWireframe = false }: HeroBustCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const showWireframeRef = useRef(showWireframe);
  const [contextLost, setContextLost] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    showWireframeRef.current = showWireframe;
    if (wireframeRef.current) {
      wireframeRef.current.visible = showWireframe;
      const mat = wireframeRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = showWireframe ? 0.36 : 0;
    }
  }, [showWireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.className = 'w-full h-full block';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleRestored);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.085);

    const envTexture = createStudioEnvironment(renderer);
    scene.environment = envTexture;
    scene.environmentIntensity = 0.45;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(isMobile ? 0 : -0.35, isMobile ? 1.45 : 1.38, isMobile ? 5.1 : 3.9);
    camera.lookAt(isMobile ? 0 : -0.1, isMobile ? 1.0 : 1.26, 0);

    // Three-point warm/cool chiaroscuro studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0x8bc7f5, 0x161022, 0.48);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe9cf, 1.45);
    keyLight.position.set(3.8, 3.6, 1.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 2.6;
    keyLight.shadow.camera.bottom = -1.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Subtle neon cyan and magenta rim highlights for Digital Alchemy signature
    const cyanRim = new THREE.PointLight(0x00f5ff, 3.4, 9, 1.8);
    cyanRim.position.set(-2.5, 2.2, -1.1);
    scene.add(cyanRim);

    const magentaRim = new THREE.PointLight(0xff00aa, 2.6, 8, 1.8);
    magentaRim.position.set(2.4, 1.1, -1.6);
    scene.add(magentaRim);

    // Sculpted bust assembly positioned gracefully on right half on desktop, centered upper on mobile
    const { group: bustGroup, wireframeMesh } = buildSculptedBust({
      finish: 'Yeso Mate',
      showWireframe: showWireframeRef.current,
      lowPoly: isMobile,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
    });
    wireframeRef.current = wireframeMesh;
    bustGroup.position.set(isMobile ? 0 : 0.78, isMobile ? 0.42 : 0.05, 0);
    bustGroup.rotation.y = -0.32;
    scene.add(bustGroup);

    // Subtle calibration orbital ring behind sculpture
    const ringGeo = new THREE.TorusGeometry(1.18, 0.006, 8, isMobile ? 48 : 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.28,
    });
    const calibrationRing = new THREE.Mesh(ringGeo, ringMat);
    calibrationRing.position.set(bustGroup.position.x, bustGroup.position.y + 1.3, -0.35);
    calibrationRing.rotation.set(0.32, -0.25, 0);
    scene.add(calibrationRing);

    // Instanced floating alchemy particles (reduced on mobile)
    const particleCount = isMobile ? 28 : 64;
    const particleGeo = new THREE.OctahedronGeometry(0.016, 0);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const particleSeeds: Array<{ x: number; y: number; z: number; speed: number; phase: number }> = [];
    const dummy = new THREE.Object3D();
    const paletteColors = [new THREE.Color(0x00f5ff), new THREE.Color(0xff00aa), new THREE.Color(0xb4ff39)];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.95 + ((i * 37) % 100) / 70;
      const x = bustGroup.position.x + Math.cos(angle) * radius;
      const y = bustGroup.position.y + 0.2 + ((i * 53) % 100) / 45;
      const z = Math.sin(angle) * radius * 0.7 - 0.1;
      particleSeeds.push({
        x,
        y,
        z,
        speed: 0.3 + ((i * 17) % 10) * 0.05,
        phase: i * 0.6,
      });
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.6 + ((i * 13) % 10) * 0.07);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
      particles.setColorAt(i, paletteColors[i % paletteColors.length]);
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    particles.computeBoundingSphere();
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Immediate first frame draw so hero is never empty on initial paint
    renderer.render(scene, camera);
    setWebglReady(true);

    // Pointer parallax state
    let pointerX = 0;
    let pointerY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w < 768;
      camera.aspect = w / h;
      camera.position.x = mobile ? 0 : -0.35;
      camera.position.y = mobile ? 1.45 : 1.38;
      camera.position.z = mobile ? 5.1 : 3.9;
      camera.lookAt(mobile ? 0 : -0.1, mobile ? 1.0 : 1.26, 0);
      camera.updateProjectionMatrix();
      bustGroup.position.x = mobile ? 0 : 0.78;
      bustGroup.position.y = mobile ? 0.42 : 0.05;
      calibrationRing.position.x = bustGroup.position.x;
      calibrationRing.position.y = bustGroup.position.y + 1.3;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    let prevTime = performance.now();
    let elapsed = 0;
    let baseYaw = -0.28;

    const registerTimer = (id: number) => {
      timerId = id;
    };

    const renderFrame = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      if (!prefersReducedMotion) {
        elapsed += dt;
        baseYaw += dt * 0.22;
        const targetYaw = baseYaw + pointerX * 0.24;
        const targetPitch = pointerY * 0.08;
        bustGroup.rotation.y = THREE.MathUtils.damp(bustGroup.rotation.y, targetYaw, 4, dt);
        bustGroup.rotation.x = THREE.MathUtils.damp(bustGroup.rotation.x, targetPitch, 4, dt);
        calibrationRing.rotation.z = elapsed * 0.14;

        for (let i = 0; i < particleCount; i++) {
          const seed = particleSeeds[i];
          dummy.position.set(
            seed.x + Math.sin(elapsed * seed.speed + seed.phase) * 0.05,
            seed.y + Math.cos(elapsed * seed.speed + seed.phase) * 0.07,
            seed.z,
          );
          dummy.rotation.y = elapsed * seed.speed;
          dummy.scale.setScalar(0.75);
          dummy.updateMatrix();
          particles.setMatrixAt(i, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (!webglReady) {
        setWebglReady(true);
      }

      if (prefersReducedMotion) {
        return;
      }

      if (isSoftwareGl) {
        afterDraw(
          renderer,
          () => {
            if (!disposed) {
              rafId = requestAnimationFrame(renderFrame);
            }
          },
          registerTimer,
        );
      } else {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleRestored);
      disposeObject3D(scene);
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  if (contextLost) {
    return (
      <div
        data-testid="hero-3d-fallback"
        className="relative w-full h-full flex items-center justify-end pr-6 md:pr-16"
      >
        <img
          src={STUDIO_REAL_IMAGES.bustCloseUp}
          alt="Escultura de busto impreso en 3D en acabado yeso blanco"
          className="w-72 md:w-96 rounded-xl object-cover border border-white/10 opacity-85"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      data-webgl-ready={webglReady ? 'true' : 'false'}
      className="w-full h-full cursor-crosshair-tech"
      aria-label="Visor 3D interactivo de busto escultórico en yeso mate"
    />
  );
}
