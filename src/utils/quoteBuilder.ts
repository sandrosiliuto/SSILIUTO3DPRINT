export type FigureType = 'Mascota' | 'Persona' | 'Personaje';
export type SculptStyle = 'Realista' | 'Caricatura' | 'Bustos';
export type FinishOption = 'Yeso Mate' | 'Mármol' | 'Madera' | 'Pintado a Mano';

export interface QuoteFormInput {
  name: string;
  contact: string;
  figureType: FigureType;
  style: SculptStyle;
  finish: FinishOption;
  notes?: string;
  fileName?: string;
  hasPhoto: boolean;
}

export interface QuoteValidationErrors {
  name?: string;
  contact?: string;
  photo?: string;
}

export interface ProjectTimelineEstimate {
  restorationHours: string;
  sculptingDays: number;
  printAndFinishDays: number;
  totalBusinessDays: number;
  craftNotes: string;
}

export const WHATSAPP_NUMBER = '34618514254';

export function isValidContact(contact: string): boolean {
  const trimmed = contact.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneDigits = trimmed.replace(/[\s\-().+]/g, '');
  const phoneRegex = /^\d{7,15}$/;
  return emailRegex.test(trimmed) || phoneRegex.test(phoneDigits);
}

export function validateQuoteForm(input: QuoteFormInput): QuoteValidationErrors {
  const errors: QuoteValidationErrors = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Indica tu nombre (mínimo 2 caracteres) para personalizar el presupuesto.';
  }

  if (!isValidContact(input.contact)) {
    errors.contact = 'Introduce un email válido o un número de teléfono/WhatsApp correcto.';
  }

  if (!input.hasPhoto) {
    errors.photo = 'Sube una fotografía (puede ser antigua, en B/N o de baja resolución) o usa la foto de muestra.';
  }

  return errors;
}

export function estimateProjectTimeline(
  figureType: FigureType,
  style: SculptStyle,
  finish: FinishOption,
): ProjectTimelineEstimate {
  const sculptingDays = style === 'Realista' ? 4 : style === 'Bustos' ? 3 : 2;
  const printAndFinishDays = finish === 'Pintado a Mano' ? 4 : finish === 'Mármol' || finish === 'Madera' ? 3 : 2;
  const figureBonus = figureType === 'Personaje' ? 1 : 0;

  const craftNotesMap: Record<FinishOption, string> = {
    'Yeso Mate': 'Impresión de alta densidad con imprimación mineral y acabado escultórico clásico.',
    'Mármol': 'Resina técnica pulida con veteado mineral y sellado satinado.',
    'Madera': 'Acabado cálido con textura orgánica tallada y barniz protector mate.',
    'Pintado a Mano': 'Lijado fino multigrano, imprimación y policromía artesanal a pincel.',
  };

  return {
    restorationHours: '24h',
    sculptingDays: sculptingDays + figureBonus,
    printAndFinishDays,
    totalBusinessDays: sculptingDays + figureBonus + printAndFinishDays + 1,
    craftNotes: craftNotesMap[finish],
  };
}

export function buildWhatsAppQuoteUrl(input: QuoteFormInput): string {
  const baseGreeting = 'Hola, quiero un regalo personalizado en 3D, adjunto mi foto.';
  const details = [
    baseGreeting,
    `Nombre: ${input.name.trim()}`,
    `Contacto: ${input.contact.trim()}`,
    `Tipo de figura: ${input.figureType}`,
    `Estilo: ${input.style}`,
    `Acabado: ${input.finish}`,
  ];

  if (input.fileName) {
    details.push(`Archivo de referencia: ${input.fileName}`);
  }
  if (input.notes && input.notes.trim().length > 0) {
    details.push(`Detalles adicionales: ${input.notes.trim()}`);
  }

  const text = encodeURIComponent(details.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
