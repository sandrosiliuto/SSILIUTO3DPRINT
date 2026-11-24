import { useState } from 'react';
import { PROCESS_STEPS } from '../data/studioShowcase';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProcessSectionProps {
  onOpen3DPreview: () => void;
}

export default function ProcessSection({ onOpen3DPreview }: ProcessSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = PROCESS_STEPS[activeIndex];

  return (
    <section
      id="proceso"
      className="relative py-20 md:py-28 border-t border-white/10 bg-[#050508]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 gsap-reveal">
          <div className="max-w-2xl">
            <p className="font-tech-mono text-xs tracking-[0.22em] text-[#00F5FF] uppercase mb-3">
              Alquimia Digital &amp; Artesanía Física
            </p>
            <h2 className="font-display-mono text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
              Nuestro Proceso Único: de una foto borrosa a una escultura eterna
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-300 max-w-md leading-relaxed">
            No automatizamos recuerdos con resultados genéricos. Cada pieza combina restauración fotográfica, escultura manual en ZBrush/Blender y acabado artesanal a mano.
          </p>
        </div>

        {/* Interactive step selector tabs + 2-column showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-3">
            {PROCESS_STEPS.map((step, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                  className={`text-left p-5 rounded-xl border transition-colors ${
                    isActive
                      ? 'bg-[#10121C] border-[#00F5FF]/70 shadow-[0_0_24px_rgba(0,245,255,0.08)]'
                      : 'bg-[#0A0A0F] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="font-display-mono text-base md:text-lg font-bold text-white">
                      {step.stepNumber}. {step.title}
                    </span>
                    <span
                      className="font-tech-mono text-xs tabular-nums shrink-0"
                      style={{ color: isActive ? step.accentColor : '#94a3b8' }}
                    >
                      {step.shortTitle}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 flex flex-col rounded-xl border border-white/10 bg-[#0A0A0F] overflow-hidden">
            <div className="relative flex-1 min-h-[300px] md:min-h-[360px] bg-[#07080D] overflow-hidden">
              {activeStep.secondaryImage ? (
                <div className="grid grid-cols-2 h-full w-full gap-px bg-white/10">
                  <div className="relative h-full overflow-hidden bg-[#07080D]">
                    <img
                      src={activeStep.secondaryImage}
                      alt={activeStep.secondaryAlt ?? activeStep.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-3">
                      <span className="font-tech-mono text-xs text-slate-200">
                        {activeStep.id === 'restauracion' ? 'Original Antigua' : 'Pintado a Mano'}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-full overflow-hidden bg-[#07080D]">
                    <img
                      src={activeStep.image}
                      alt={activeStep.imageAlt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-3">
                      <span className="font-tech-mono text-xs text-[#00F5FF]">
                        {activeStep.id === 'restauracion' ? 'Restaurada HD' : 'Lijado Manual'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={activeStep.image}
                  alt={activeStep.imageAlt}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
            </div>

            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-tech-mono text-xs text-[#00F5FF] mb-1">
                  Paso {activeStep.stepNumber} · Control de Taller
                </p>
                <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                  {activeStep.craftDetail}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpen3DPreview}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00F5FF]/50 bg-[#00F5FF]/10 px-4 py-2.5 font-tech-mono text-xs font-bold text-[#00F5FF] hover:bg-[#00F5FF] hover:text-[#050508] transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                <span>Inspeccionar Busto 3D</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Strip showing all 4 tangible workshop phases at a glance */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 gsap-reveal">
          {PROCESS_STEPS.map((step, idx) => (
            <button
              key={`thumb-${step.id}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group text-left rounded-xl border overflow-hidden transition-colors ${
                idx === activeIndex
                  ? 'border-[#00F5FF]/70 bg-[#10121C]'
                  : 'border-white/10 bg-[#0A0A0F] hover:border-white/25'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#07080D]">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3.5">
                <p className="font-tech-mono text-xs text-slate-400">
                  Paso {step.stepNumber} · {step.shortTitle}
                </p>
                <p className="text-sm font-semibold text-white mt-0.5 truncate">{step.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
