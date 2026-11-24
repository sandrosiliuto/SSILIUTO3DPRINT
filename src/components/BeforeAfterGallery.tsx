import { useState } from 'react';
import { Box, MoveHorizontal, Sparkles } from 'lucide-react';
import { GALLERY_CASES, STUDIO_REAL_IMAGES, type GalleryCaseItem } from '../data/studioShowcase';
import type { InteractiveModalSubject } from './InteractiveBustModal';

interface BeforeAfterGalleryProps {
  onOpenModal: (subject: InteractiveModalSubject) => void;
}

export default function BeforeAfterGallery({ onOpenModal }: BeforeAfterGalleryProps) {
  const [sliderPos, setSliderPos] = useState(52);

  return (
    <section
      id="galeria"
      className="relative py-20 md:py-28 border-t border-white/10 bg-[#07070C]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 gsap-reveal">
          <div className="max-w-2xl">
            <p className="font-tech-mono text-xs tracking-[0.22em] text-[#FF00AA] uppercase mb-3">
              Casos Reales · Antes y Después
            </p>
            <h2 className="font-display-mono text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
              De un recuerdo desgastado a una escultura física con alma
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-300 max-w-md leading-relaxed">
            Desliza para comparar la restauración digital previa al esculpido o abre cualquier proyecto en el visor 3D interactivo.
          </p>
        </div>

        {/* Flagship 3-part Transformation Showcase: Vintage Photo -> 3D Bust -> Interactive Restoration */}
        <div className="rounded-xl border border-white/10 bg-[#0A0A0F] p-6 md:p-8 mb-12 gsap-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Before/After Photo Restoration Comparator */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-tech-mono text-xs text-slate-300">
                  Comparador de Restauración
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSliderPos(12)}
                    className="px-2.5 py-1 rounded text-xs font-tech-mono bg-white/5 text-slate-300 hover:text-white border border-white/10"
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(50)}
                    className="px-2.5 py-1 rounded text-xs font-tech-mono bg-white/5 text-slate-300 hover:text-white border border-white/10"
                  >
                    50/50
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(88)}
                    className="px-2.5 py-1 rounded text-xs font-tech-mono bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40"
                  >
                    Restaurada
                  </button>
                </div>
              </div>

              <div className="relative aspect-[3/4] max-h-[430px] w-full overflow-hidden rounded-xl border border-white/15 bg-black select-none">
                {/* Base layer: Restored color image */}
                <img
                  src={STUDIO_REAL_IMAGES.restoredPortrait}
                  alt="Fotografía restaurada a todo color y alta definición"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Clipped top layer: Vintage original image */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img
                    src={STUDIO_REAL_IMAGES.vintageOriginal}
                    alt="Fotografía antigua original en blanco y negro"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Vertical divider handle */}
                <div
                  className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#00F5FF] shadow-[0_0_12px_#00F5FF]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[#00F5FF] bg-[#050508] text-[#00F5FF]">
                    <MoveHorizontal className="h-4 w-4" />
                  </div>
                </div>

                {/* Subtle bottom scrim labels */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 py-3 font-tech-mono text-xs">
                  <span className="text-slate-200">Foto Antigua</span>
                  <span className="text-[#00F5FF]">Foto Restaurada</span>
                </div>

                {/* Accessible full-overlay range input */}
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  aria-label="Comparar fotografía antigua y restaurada"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            </div>

            {/* Right: Real Physical Result Triptych + Description */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div>
                <p className="font-tech-mono text-xs text-[#B4FF39] mb-2">
                  Proyecto Real · Foto Antigua → Restauración → Busto Impreso en 3D
                </p>
                <h3 className="font-display-mono text-xl md:text-2xl font-bold text-white mb-3">
                  El resultado real entregado al cliente
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  A la izquierda, el retrato restaurado en alta definición; en el centro, el busto modelado manualmente e impreso en 3D acabado en yeso blanco mate con pendientes y collar reales; a la derecha, la fotografía original en su marco.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#050508]">
                  <img
                    src={STUDIO_REAL_IMAGES.triptychFront}
                    alt="Busto blanco impreso en 3D en el centro entre la foto restaurada y la foto antigua"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#050508]">
                  <img
                    src={STUDIO_REAL_IMAGES.bustCloseUp}
                    alt="Detalle frontal del busto escultórico con perlas y textura artesanal"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-tech-mono text-slate-400">
                  <span>Altura 22 cm</span>
                  <span aria-hidden="true">·</span>
                  <span>Lijado e Imprimación Mate</span>
                  <span aria-hidden="true">·</span>
                  <span>Parecido Verificado</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenModal({
                      title: 'Homenaje Familiar desde Foto de 1968',
                      category: 'Busto Realista · Yeso Mate',
                      subjectVariant: 'classic',
                      defaultFinish: 'Yeso Mate',
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-4 py-2.5 font-tech-mono text-xs font-bold text-[#050508] hover:bg-[#4ff8ff] transition-colors whitespace-nowrap shrink-0"
                >
                  <Box className="h-4 w-4" />
                  <span>Ver en 3D</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Card Interactive Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gsap-reveal">
          {GALLERY_CASES.map((item: GalleryCaseItem) => (
            <article
              key={item.id}
              className="flex flex-col rounded-xl border border-white/10 bg-[#0A0A0F] overflow-hidden hover:border-white/25 transition-colors"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050508]">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 font-tech-mono text-xs text-slate-400 mb-2">
                    <span className="text-[#00F5FF]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.scaleSpec}</span>
                  </div>
                  <h3 className="font-display-mono text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.summary}</p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <span className="font-tech-mono text-xs text-slate-400">
                    Acabado: {item.defaultFinish}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenModal({
                        title: item.title,
                        category: item.category,
                        subjectVariant: item.subjectVariant,
                        defaultFinish: item.defaultFinish,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 font-tech-mono text-xs font-semibold text-white hover:border-[#00F5FF] hover:text-[#00F5FF] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Ver en 3D</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
