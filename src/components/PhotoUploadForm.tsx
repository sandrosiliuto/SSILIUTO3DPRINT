import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { Check, ExternalLink, ImagePlus, RotateCcw, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import {
  buildWhatsAppQuoteUrl,
  estimateProjectTimeline,
  validateQuoteForm,
  type FigureType,
  type FinishOption,
  type QuoteValidationErrors,
  type SculptStyle,
} from '../utils/quoteBuilder';
import { STUDIO_REAL_IMAGES } from '../data/studioShowcase';

interface PhotoUploadFormProps {
  selectedFinishFromModal?: FinishOption | null;
}

const FIGURE_TYPES: FigureType[] = ['Mascota', 'Persona', 'Personaje'];
const SCULPT_STYLES: SculptStyle[] = ['Realista', 'Caricatura', 'Bustos'];
const FINISH_OPTIONS: FinishOption[] = ['Yeso Mate', 'Mármol', 'Madera', 'Pintado a Mano'];

export default function PhotoUploadForm({ selectedFinishFromModal }: PhotoUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [figureType, setFigureType] = useState<FigureType>('Persona');
  const [style, setStyle] = useState<SculptStyle>('Bustos');
  const [finish, setFinish] = useState<FinishOption>('Yeso Mate');
  const [notes, setNotes] = useState('');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [simulateRestorePreview, setSimulateRestorePreview] = useState(false);

  const [errors, setErrors] = useState<QuoteValidationErrors>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (selectedFinishFromModal) {
      setFinish(selectedFinishFromModal);
    }
  }, [selectedFinishFromModal]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        photo: 'El archivo debe ser una imagen (JPG, PNG, WEBP o HEIC).',
      }));
      return;
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setSubmittedUrl(null);
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUseSamplePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(STUDIO_REAL_IMAGES.vintageOriginal);
    setFileName('retrato_antiguo_muestra.jpeg');
    setSubmittedUrl(null);
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName('');
    setSimulateRestorePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formPayload = {
      name,
      contact,
      figureType,
      style,
      finish,
      notes,
      fileName,
      hasPhoto: Boolean(previewUrl),
    };
    const nextErrors = validateQuoteForm(formPayload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const whatsappUrl = buildWhatsAppQuoteUrl(formPayload);
    setSubmittedUrl(whatsappUrl);
  };

  const timeline = estimateProjectTimeline(figureType, style, finish);

  return (
    <section
      id="sube-tu-foto"
      className="relative py-20 md:py-28 border-t border-white/10 bg-[#050508]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-12 gsap-reveal">
          <p className="font-tech-mono text-xs tracking-[0.22em] text-[#B4FF39] uppercase mb-3">
            Encarga tu Escultura Personalizada
          </p>
          <h2 className="font-display-mono text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance mb-4">
            Sube tu foto y recibe tu presupuesto por WhatsApp
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Aceptamos fotos antiguas, en blanco y negro o de baja calidad. ¡Nosotros las restauramos antes de empezar el modelado 3D!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left column: Neon Drag & Drop + Preview */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-6 transition-colors ${
                isDragging
                  ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                  : errors.photo
                    ? 'border-[#FF00AA] bg-[#FF00AA]/5'
                    : 'border-[#00F5FF]/45 bg-[#0A0A0F] hover:border-[#00F5FF]'
              }`}
            >
              <input
                ref={fileInputRef}
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />

              {previewUrl ? (
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/15 bg-black">
                    <img
                      src={previewUrl}
                      alt={`Previsualización de ${fileName || 'foto subida'}`}
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        simulateRestorePreview ? 'contrast-125 saturate-150 brightness-105' : ''
                      }`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-tech-mono text-xs text-slate-300 truncate max-w-[180px]">
                      {fileName}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulateRestorePreview((v) => !v)}
                        aria-pressed={simulateRestorePreview}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-tech-mono text-xs transition-colors ${
                          simulateRestorePreview
                            ? 'bg-[#00F5FF] text-[#050508] font-bold'
                            : 'bg-white/5 text-slate-200 border border-white/15 hover:border-[#00F5FF]'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{simulateRestorePreview ? 'Filtro HD Activo' : 'Simular Mejora'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        aria-label="Eliminar fotografía subida"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/5 text-slate-300 hover:border-[#FF00AA] hover:text-[#FF00AA] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-display-mono text-base font-bold text-white mb-1">
                      Arrastra tu fotografía aquí
                    </p>
                    <p className="text-xs text-slate-400">
                      JPG, PNG o foto escaneada de álbum familiar
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <label
                      htmlFor="photo-upload-input"
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#00F5FF] px-4 py-2.5 font-tech-mono text-xs font-bold text-[#050508] hover:bg-[#4ff8ff] transition-colors"
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span>Elegir Archivo</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseSamplePhoto}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 font-tech-mono text-xs text-slate-200 hover:border-white/35 transition-colors"
                    >
                      <span>Probar con Foto Antigua</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {errors.photo && (
              <p role="alert" className="font-tech-mono text-xs text-[#FF00AA]">
                {errors.photo}
              </p>
            )}

            <div className="rounded-xl border border-white/10 bg-[#0A0A0F] p-5">
              <p className="font-tech-mono text-xs text-[#00F5FF] mb-2">
                Estimación de Taller ({finish})
              </p>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="rounded-lg bg-white/5 p-2.5">
                  <p className="font-tech-mono text-sm font-bold text-white tabular-nums">
                    {timeline.restorationHours}
                  </p>
                  <p className="text-xs text-slate-400">Restauración</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2.5">
                  <p className="font-tech-mono text-sm font-bold text-white tabular-nums">
                    {timeline.sculptingDays} días
                  </p>
                  <p className="text-xs text-slate-400">Esculpido 3D</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2.5">
                  <p className="font-tech-mono text-sm font-bold text-[#B4FF39] tabular-nums">
                    ~{timeline.totalBusinessDays} días
                  </p>
                  <p className="text-xs text-slate-400">Entrega Total</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{timeline.craftNotes}</p>
            </div>
          </div>

          {/* Right column: Fields & Direct WhatsApp Conversion */}
          <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#0A0A0F] p-6 md:p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="quote-name"
                  className="block font-tech-mono text-xs text-slate-300 mb-2"
                >
                  Nombre completo
                </label>
                <input
                  id="quote-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Ej. Elena Martínez"
                  className="w-full rounded-lg border border-white/15 bg-[#050508] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#00F5FF] focus:outline-none"
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 font-tech-mono text-xs text-[#FF00AA]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quote-contact"
                  className="block font-tech-mono text-xs text-slate-300 mb-2"
                >
                  Email o Teléfono / WhatsApp
                </label>
                <input
                  id="quote-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
                  }}
                  placeholder="Ej. +34 618 514 254 o correo@..."
                  className="w-full rounded-lg border border-white/15 bg-[#050508] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#00F5FF] focus:outline-none"
                />
                {errors.contact && (
                  <p role="alert" className="mt-1.5 font-tech-mono text-xs text-[#FF00AA]">
                    {errors.contact}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block font-tech-mono text-xs text-slate-300 mb-2">
                Tipo de figura
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {FIGURE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFigureType(type)}
                    aria-pressed={figureType === type}
                    className={`py-2.5 px-3 rounded-lg font-tech-mono text-xs transition-colors whitespace-nowrap ${
                      figureType === type
                        ? 'bg-[#00F5FF] text-[#050508] font-bold'
                        : 'bg-[#050508] text-slate-300 border border-white/15 hover:border-white/35'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block font-tech-mono text-xs text-slate-300 mb-2">
                Estilo de escultura
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {SCULPT_STYLES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    aria-pressed={style === item}
                    className={`py-2.5 px-3 rounded-lg font-tech-mono text-xs transition-colors whitespace-nowrap ${
                      style === item
                        ? 'bg-[#FF00AA] text-white font-bold'
                        : 'bg-[#050508] text-slate-300 border border-white/15 hover:border-white/35'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block font-tech-mono text-xs text-slate-300 mb-2">
                Material y acabado artesanal
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FINISH_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFinish(option)}
                    aria-pressed={finish === option}
                    className={`py-2.5 px-3 rounded-lg font-tech-mono text-xs transition-colors whitespace-nowrap ${
                      finish === option
                        ? 'bg-[#B4FF39] text-[#050508] font-bold'
                        : 'bg-[#050508] text-slate-300 border border-white/15 hover:border-white/35'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-notes"
                className="block font-tech-mono text-xs text-slate-300 mb-2"
              >
                Detalles especiales (opcional: tamaño, dedicatoria en peana, accesorios)
              </label>
              <textarea
                id="quote-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Queremos conservar el collar de perlas y grabar una fecha en la base..."
                className="w-full rounded-lg border border-white/15 bg-[#050508] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#00F5FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#00F5FF] px-6 py-4 font-display-mono text-sm font-bold text-[#050508] hover:bg-[#4ff8ff] transition-colors"
            >
              <span>SOLICITAR PRESUPUESTO Y ENVIAR FOTO</span>
            </button>

            {submittedUrl && (
              <div
                role="status"
                data-testid="quote-success-panel"
                className="rounded-xl border border-[#B4FF39]/60 bg-[#B4FF39]/10 p-5 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B4FF39] text-[#050508]">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display-mono text-sm font-bold text-white">
                      ¡Solicitud lista para enviar al taller!
                    </h3>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      Pulsa el botón inferior para abrir WhatsApp con tus datos pre-rellenados y adjuntar directamente tu foto ({fileName || 'imagen seleccionada'}).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B4FF39] px-4 py-2.5 font-tech-mono text-xs font-bold text-[#050508] hover:bg-[#c5ff61] transition-colors"
                  >
                    <span>Abrir WhatsApp (+34 618 514 254)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(decodeURIComponent(submittedUrl.split('?text=')[1] ?? ''));
                      setCopiedSummary(true);
                      setTimeout(() => setCopiedSummary(false), 2500);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2.5 font-tech-mono text-xs text-white hover:border-white/40 transition-colors"
                  >
                    <span>{copiedSummary ? 'Resumen Copiado' : 'Copiar Resumen'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedUrl(null)}
                    className="inline-flex items-center gap-1.5 font-tech-mono text-xs text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
