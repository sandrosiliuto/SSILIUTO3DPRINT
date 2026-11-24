import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { X, Layers, Sparkles } from 'lucide-react';
import { buildSculptedBust } from '../three/bustSculpture';
import { afterDraw, createStudioEnvironment, detectSoftwareGl, disposeObject3D } from '../three/webglUtils';
import type { FinishOption } from '../utils/quoteBuilder';

export interface InteractiveModalSubject {
  title: string;
  category: string;
  subjectVariant: 'classic' | 'pet' | 'character';
  defaultFinish: FinishOption;
}

interface InteractiveBustModalProps {
  subject: InteractiveModalSubject | null;
  onClose: () => void;
  onSelectFinishForQuote: (finish: FinishOption) => void;
}

const FINISH_OPTIONS: FinishOption[] = ['Yeso Mate', 'Mármol', 'Madera', 'Pintado a Mano'];

export default function InteractiveBustModal({
  subject,
  onClose,
  onSelectFinishForQuote,
}: InteractiveBustModalProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [finish, setFinish] = useState<FinishOption>(subject?.defaultFinish ?? 'Yeso Mate');
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    if (subject) {
      setFinish(subject.defaultFinish);
      setWireframe(false);
    }
  }, [subject]);

  useEffect(() => {
    if (!subject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subject, onClose]);

  useEffect(() => {
    if (!subject) return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.domElement.className = 'w-full h-full block';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07080d);
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;
    scene.environmentIntensity = 0.45;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 30);
    camera.position.set(0.85, 1.55, 3.25);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.22, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 5.2;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.update();

    const hemi = new THREE.HemisphereLight(0x8bc7f5, 0x161022, 0.46);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe9cf, 1.38);
    key.position.set(3.6, 3.8, 1.9);
    key.castShadow = !isSoftwareGl;
    scene.add(key);

    const cyanRim = new THREE.PointLight(0x00f5ff, 3.1, 8, 1.8);
    cyanRim.position.set(-2.3, 2.0, -1.4);
    scene.add(cyanRim);

    const magentaRim = new THREE.PointLight(0xff00aa, 2.3, 8, 1.8);
    magentaRim.position.set(2.1, 1.1, -1.5);
    scene.add(magentaRim);

    const { group } = buildSculptedBust({
      finish,
      showWireframe: wireframe,
      lowPoly: false,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
      subjectVariant: subject.subjectVariant,
    });
    scene.add(group);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    let renderBusy = false;
    let renderDirty = false;

    const registerTimer = (id: number) => {
      timerId = id;
    };

    // On-demand render scheduler (frameloop="demand" discipline)
    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      rafId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) {
          afterDraw(renderer, done, registerTimer);
        } else {
          done();
        }
      });
    };

    controls.addEventListener('change', requestRender);

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      controls.removeEventListener('change', requestRender);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      disposeObject3D(scene);
      envTex.dispose();
      renderer.dispose();
    };
  }, [subject, finish, wireframe]);

  if (!subject) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-3d-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
    >
      <div className="relative w-full max-w-4xl rounded-xl border border-white/15 bg-[#0A0A0F] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <p className="font-tech-mono text-xs text-[#00F5FF] tracking-wider uppercase">
              {subject.category}
            </p>
            <h3 id="modal-3d-title" className="font-display-mono text-lg md:text-xl font-bold text-white">
              {subject.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visor 3D"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:border-[#00F5FF] hover:text-[#00F5FF] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[380px] md:h-[440px] w-full bg-[#07080D]">
          <div
            ref={mountRef}
            data-testid="modal-3d-canvas"
            className="w-full h-full cursor-crosshair-tech"
            aria-label="Modelo 3D interactivo con rotación de 360 grados"
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/75 px-3 py-1.5 font-tech-mono text-xs text-slate-300">
            Arrastra para rotar 360° · Rueda para zoom
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/10 bg-[#0A0A0F] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-tech-mono text-xs text-slate-400 mr-1">Acabado:</span>
            {FINISH_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFinish(option)}
                className={`px-3 py-1.5 rounded-md font-tech-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                  finish === option
                    ? 'bg-[#00F5FF] text-[#050508] font-bold'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setWireframe((prev) => !prev)}
              aria-pressed={wireframe}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-tech-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                wireframe
                  ? 'bg-[#FF00AA]/20 text-[#FF00AA] border border-[#FF00AA]/60'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/30'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{wireframe ? 'Ocultar Malla' : 'Ver Malla 3D'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectFinishForQuote(finish);
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4FF39] px-4 py-2.5 font-tech-mono text-xs font-bold text-[#050508] hover:bg-[#c5ff61] transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Encargar en {finish}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
