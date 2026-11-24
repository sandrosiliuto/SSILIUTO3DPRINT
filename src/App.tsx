import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Layers, MessageCircle, Sparkles } from 'lucide-react';
import HeroBustCanvas from './components/HeroBustCanvas';
import ProcessSection from './components/ProcessSection';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import PhotoUploadForm from './components/PhotoUploadForm';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import type { InteractiveModalSubject } from './components/InteractiveBustModal';
import type { FinishOption } from './utils/quoteBuilder';

const InteractiveBustModal = lazy(() => import('./components/InteractiveBustModal'));

gsap.registerPlugin(ScrollTrigger);

const FINISH_SHOWCASE: Array<{
  finish: FinishOption;
  summary: string;
  swatchClass: string;
}> = [
  {
    finish: 'Yeso Mate',
    summary: 'Blanco escultórico mineral de galería, lijado fino e imprimación aterciopelada.',
    swatchClass: 'bg-[#edeae4] border-white/40',
  },
  {
    finish: 'Mármol',
    summary: 'Veteado mineral Carrara con sellado satinado y reflejo suave de museo.',
    swatchClass: 'bg-gradient-to-br from-slate-100 via-slate-300 to-amber-100 border-white/30',
  },
  {
    finish: 'Madera',
    summary: 'Tono nogal cálido con textura orgánica tallada y barniz protector mate.',
    swatchClass: 'bg-gradient-to-br from-[#9e683b] to-[#5a3519] border-amber-200/30',
  },
  {
    finish: 'Pintado a Mano',
    summary: 'Policromía realista a pincel o pátina bronce envejecido capa a capa.',
    swatchClass: 'bg-gradient-to-br from-[#c78f53] via-[#85522c] to-[#2e473f] border-[#B4FF39]/40',
  },
];

export default function App() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [heroWireframe, setHeroWireframe] = useState(false);
  const [modalSubject, setModalSubject] = useState<InteractiveModalSubject | null>(null);
  const [selectedFinishForQuote, setSelectedFinishForQuote] = useState<FinishOption | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.from(el, {
          y: 22,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const scrollToUpload = () => {
    const el = document.getElementById('sube-tu-foto');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFinishFromModal = (finish: FinishOption) => {
    setSelectedFinishForQuote(finish);
    scrollToUpload();
  };

  return (
    <div ref={pageRef} className="relative min-h-screen bg-[#050508] text-slate-100 overflow-x-hidden">
      {/* Subtle film grain layer */}
      <div className="pointer-events-none fixed inset-0 z-30 alchemy-noise opacity-50" aria-hidden="true" />

      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050508]/95">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#inicio"
            className="font-display-mono text-sm md:text-base font-bold tracking-wider text-white whitespace-nowrap shrink-0"
          >
            SSILIUTOIMPRESION3D
          </a>

          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a
              href="#proceso"
              className="hover:text-[#00F5FF] transition-colors whitespace-nowrap shrink-0"
            >
              Proceso
            </a>
            <a
              href="#galeria"
              className="hover:text-[#00F5FF] transition-colors whitespace-nowrap shrink-0"
            >
              Antes y Después
            </a>
            <a
              href="#acabados"
              className="hover:text-[#00F5FF] transition-colors whitespace-nowrap shrink-0"
            >
              Acabados
            </a>
            <a
              href="#sube-tu-foto"
              className="hover:text-[#00F5FF] transition-colors whitespace-nowrap shrink-0"
            >
              Encargar
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={scrollToUpload}
              className="rounded-lg bg-[#00F5FF] px-4 py-2 font-tech-mono text-xs font-bold text-[#050508] hover:bg-[#4ff8ff] transition-colors whitespace-nowrap shrink-0"
            >
              Sube tu Foto
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO 3D */}
        <section
          id="inicio"
          className="relative bg-alchemy-grid min-h-[680px] lg:min-h-[760px] flex items-end md:items-center overflow-hidden"
        >
          {/* Full-screen Three.js Canvas Layer */}
          <div className="absolute inset-0 z-0">
            <HeroBustCanvas showWireframe={heroWireframe} />
          </div>

          {/* Readability Gradient Scrim (Desktop left-to-right, Mobile bottom-to-top) */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-[#050508]/25 lg:bg-gradient-to-r lg:from-[#050508]/95 lg:via-[#050508]/75 lg:to-transparent"
            aria-hidden="true"
          />

          {/* Foreground Editorial Content */}
          <div className="relative z-20 mx-auto max-w-6xl w-full px-6 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="font-tech-mono text-xs tracking-[0.22em] text-[#00F5FF] uppercase mb-4">
                Digital Alchemy · Estudio de Arte Digital &amp; Escultura 3D
              </p>

              <h1 className="font-display-mono text-[clamp(1.85rem,3.6vw,3.35rem)] font-bold leading-[1.12] tracking-tight text-white text-balance mb-6 glitch-title">
                TUS RECUERDOS EN 3D:{' '}
                <span className="inline-block text-[#00F5FF] glitch-animate">
                  DE UNA FOTO ANTIGUA A UNA ESCULTURA ETERNA
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-xl mb-8">
                Restauramos tu foto, modelamos a medida por ordenador e imprimimos en 3D. Regalos únicos con un parecido exacto.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={scrollToUpload}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#00F5FF] px-6 py-3.5 font-tech-mono text-xs md:text-sm font-bold text-[#050508] hover:bg-[#4ff8ff] transition-colors whitespace-nowrap"
                >
                  <span>SUBE TU FOTO AHORA</span>
                  <ArrowDown className="h-4 w-4" />
                </button>

                <a
                  href="https://wa.me/34618514254?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20una%20escultura%203D%20personalizada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-[#0A0A0F]/90 px-5 py-3.5 font-tech-mono text-xs md:text-sm font-semibold text-white hover:border-[#B4FF39] hover:text-[#B4FF39] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>HABLA POR WHATSAPP</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-tech-mono text-slate-300 border-t border-white/10 pt-5">
                <span>Restauración de Fotos Antiguas</span>
                <span aria-hidden="true">·</span>
                <span>Esculpido Manual ZBrush &amp; Blender</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setHeroWireframe((prev) => !prev)}
                  aria-pressed={heroWireframe}
                  className="inline-flex items-center gap-1.5 text-[#00F5FF] hover:underline"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{heroWireframe ? 'Ocultar Malla 3D' : 'Ver Malla Topológica'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROCESS SECTION */}
        <ProcessSection
          onOpen3DPreview={() =>
            setModalSubject({
              title: 'Busto Escultórico · Visor de Taller',
              category: 'Modelado Manual ZBrush + Resina 8K',
              subjectVariant: 'classic',
              defaultFinish: 'Yeso Mate',
            })
          }
        />

        {/* 3. BEFORE & AFTER GALLERY */}
        <BeforeAfterGallery onOpenModal={(subject) => setModalSubject(subject)} />

        {/* 4. FINISHES & MATERIALS SECTION */}
        <section
          id="acabados"
          className="relative py-20 border-t border-white/10 bg-[#07070C]"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 gsap-reveal">
              <div className="max-w-2xl">
                <p className="font-tech-mono text-xs tracking-[0.22em] text-[#00F5FF] uppercase mb-3">
                  Materiales y Tacto Final
                </p>
                <h2 className="font-display-mono text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                  Elige el acabado de tu escultura y compruébalo en 3D
                </h2>
              </div>
              <p className="text-sm text-slate-300 max-w-md">
                Todas las piezas pasan por curado, lijado manual e imprimación antes de recibir su acabado definitivo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gsap-reveal">
              {FINISH_SHOWCASE.map((item) => (
                <button
                  key={item.finish}
                  type="button"
                  onClick={() =>
                    setModalSubject({
                      title: `Prueba de Acabado: ${item.finish}`,
                      category: 'Inspección de Material en 360°',
                      subjectVariant: 'classic',
                      defaultFinish: item.finish,
                    })
                  }
                  className="text-left rounded-xl border border-white/10 bg-[#0A0A0F] p-5 hover:border-[#00F5FF]/60 transition-colors flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className={`h-10 w-10 rounded-lg border mb-4 ${item.swatchClass}`} />
                    <h3 className="font-display-mono text-base font-bold text-white mb-2">
                      {item.finish}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-tech-mono text-xs text-[#00F5FF]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Probar en visor 3D</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PHOTO UPLOAD & WHATSAPP QUOTE FORM */}
        <PhotoUploadForm selectedFinishFromModal={selectedFinishForQuote} />
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/10 bg-[#050508] pt-12 pb-24 md:py-14">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-display-mono text-sm font-bold text-white tracking-wider">
              SSILIUTOIMPRESION3D
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Digital Alchemy · Restauración fotográfica, modelado manual 3D y escultura personalizada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-tech-mono text-slate-400">
            <a href="#proceso" className="hover:text-white transition-colors">
              Proceso
            </a>
            <a href="#galeria" className="hover:text-white transition-colors">
              Galería
            </a>
            <a href="#sube-tu-foto" className="hover:text-white transition-colors">
              Subir Foto
            </a>
            <a
              href="https://wa.me/34618514254"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F5FF] hover:underline"
            >
              WhatsApp +34 618 514 254
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive 3D Modal */}
      <Suspense fallback={null}>
        <InteractiveBustModal
          subject={modalSubject}
          onClose={() => setModalSubject(null)}
          onSelectFinishForQuote={handleSelectFinishFromModal}
        />
      </Suspense>

      {/* Floating WhatsApp CTA */}
      <WhatsAppFloatingButton />
    </div>
  );
}
