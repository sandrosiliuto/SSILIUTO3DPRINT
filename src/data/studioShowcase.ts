import type { FinishOption } from '../utils/quoteBuilder';

export interface ProcessStepItem {
  id: string;
  stepNumber: string;
  title: string;
  shortTitle: string;
  description: string;
  craftDetail: string;
  image: string;
  imageAlt: string;
  secondaryImage?: string;
  secondaryAlt?: string;
  accentColor: string;
}

export interface GalleryCaseItem {
  id: string;
  title: string;
  category: string;
  subjectVariant: 'classic' | 'pet' | 'character';
  defaultFinish: FinishOption;
  summary: string;
  scaleSpec: string;
  image: string;
  imageAlt: string;
  beforeImage?: string;
  afterImage?: string;
}

export const STUDIO_REAL_IMAGES = {
  vintageOriginal: '/assets/aistudio/WhatsApp_Image_2026-11-23_at_19.54.57_244ac823.jpeg',
  restoredPortrait: '/assets/aistudio/WhatsApp_Image_2026-11-23_at_19.54.57__1__cdc6133b.jpeg',
  triptychFront: '/assets/aistudio/WhatsApp_Image_2026-11-23_at_19.54.57__4__533edb74.jpeg',
  triptychAngle: '/assets/aistudio/WhatsApp_Image_2026-11-23_at_19.54.57__2__be9fa12b.jpeg',
  bustCloseUp: '/assets/aistudio/WhatsApp_Image_2026-11-23_at_19.54.58_c7db4880.jpeg',
  sculptingZbrush: '/src/assets/images/process_digital_sculpting_1795483947832.jpg',
  printingSla: '/src/assets/images/process_3d_printing_1795483947349.jpg',
  sandingCraft: '/src/assets/images/process_sanding_craft_1795483949911.jpg',
  handPainting: '/src/assets/images/process_hand_painting_1795483949004.jpg',
} as const;

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    id: 'restauracion',
    stepNumber: '01',
    title: 'Restauración Fotográfica',
    shortTitle: 'Restauración',
    description:
      'Mejoramos la definición de tus fotos antiguas, dañadas o borrosas para recuperar rasgos, textura de piel, mirada y joyería antes de esculpir.',
    craftDetail:
      'Reconstrucción de micro-detalle, corrección tonal y limpieza de ruido para que el escultor trabaje sobre una referencia nítida.',
    image: STUDIO_REAL_IMAGES.restoredPortrait,
    imageAlt: 'Retrato antiguo restaurado a color con alta definición para modelado 3D',
    secondaryImage: STUDIO_REAL_IMAGES.vintageOriginal,
    secondaryAlt: 'Fotografía original antigua en blanco y negro antes de la restauración',
    accentColor: '#00F5FF',
  },
  {
    id: 'modelado',
    stepNumber: '02',
    title: 'Modelado 3D Profesional',
    shortTitle: 'Escultura 3D',
    description:
      'No dependemos de IA automática. Esculpimos manualmente en ZBrush y Blender cuidando proporciones, expresión y parecido exacto o estilo caricatura.',
    craftDetail:
      'Topología limpia, revisión de perfiles de 360° y aprobación previa por captura antes de enviar a máquina.',
    image: STUDIO_REAL_IMAGES.sculptingZbrush,
    imageAlt: 'Escultura digital de busto en ZBrush con mitad arcilla y mitad malla topológica',
    accentColor: '#FF00AA',
  },
  {
    id: 'impresion',
    stepNumber: '03',
    title: 'Impresión 3D de Alta Precisión',
    shortTitle: 'Impresión 3D',
    description:
      'Fabricamos cada pieza en resina fotopolimérica 8K o filamento técnico de alta densidad, conservando desde mechones de cabello hasta relieves mínimos.',
    craftDetail:
      'Soportes optimizados en zonas ocultas, curado UV controlado y base estable lista para exposición.',
    image: STUDIO_REAL_IMAGES.printingSla,
    imageAlt: 'Impresora 3D SLA imprimiendo un busto blanco bajo luz UV cian',
    accentColor: '#B4FF39',
  },
  {
    id: 'acabado',
    stepNumber: '04',
    title: 'Lijado, Imprimación y Pintado a Mano',
    shortTitle: 'Lijado y Pintado',
    description:
      'Eliminamos marcas de capa mediante lijado multigrano, aplicamos imprimación mineral y terminamos en yeso mate, mármol, madera o pintado a mano.',
    craftDetail:
      'Cada busto se lija manualmente pieza a pieza y puede incorporar detalles físicos reales como perlas o pátinas artísticas.',
    image: STUDIO_REAL_IMAGES.sandingCraft,
    imageAlt: 'Manos de artesano lijando cuidadosamente un busto impreso en 3D',
    secondaryImage: STUDIO_REAL_IMAGES.handPainting,
    secondaryAlt: 'Artista pintando a mano detalles realistas y bronce sobre figuras 3D',
    accentColor: '#00F5FF',
  },
];

export const GALLERY_CASES: GalleryCaseItem[] = [
  {
    id: 'homenaje-vintage',
    title: 'Homenaje Familiar desde Foto de 1968',
    category: 'Busto Realista · Yeso Mate',
    subjectVariant: 'classic',
    defaultFinish: 'Yeso Mate',
    summary:
      'Partimos de una fotografía monocroma desenfocada, restauramos el retrato completo a color, esculpimos el busto en ZBrush y añadimos pendientes y collar de perlas tras el lijado.',
    scaleSpec: '22 cm · Resina + Acabado Yeso + Joyería',
    image: STUDIO_REAL_IMAGES.triptychFront,
    imageAlt: 'Tríptico con foto restaurada a la izquierda, busto blanco impreso en 3D en el centro y foto antigua a la derecha',
    beforeImage: STUDIO_REAL_IMAGES.vintageOriginal,
    afterImage: STUDIO_REAL_IMAGES.restoredPortrait,
  },
  {
    id: 'detalle-acabado-yeso',
    title: 'Estudio de Volumen, Lijado y Relieve Facial',
    category: 'Escultura 3D · Acabado Artesanal',
    subjectVariant: 'classic',
    defaultFinish: 'Mármol',
    summary:
      'Vista lateral de la textura final obtenida tras el curado, lijado fino e imprimación mate, replicando la sonrisa, el peinado clásico y la estola drapeada.',
    scaleSpec: '22 cm · Esculpido Manual ZBrush',
    image: STUDIO_REAL_IMAGES.triptychAngle,
    imageAlt: 'Vista en ángulo del busto impreso en 3D junto a los marcos de la foto restaurada y original',
  },
  {
    id: 'taller-pintado-mascotas',
    title: 'Mascotas y Retratos Policromados a Pincel',
    category: 'Pintado a Mano · Pátina Bronce',
    subjectVariant: 'pet',
    defaultFinish: 'Pintado a Mano',
    summary:
      'Figuras de mascotas y bustos en miniatura pintados capa a capa con acrílicos de alta pigmentación, veladuras de piel y efecto bronce envejecido.',
    scaleSpec: '14–18 cm · Policromía Manual',
    image: STUDIO_REAL_IMAGES.handPainting,
    imageAlt: 'Artista pintando a pincel un busto y una figura de perro en acabado bronce',
  },
  {
    id: 'escultura-personajes',
    title: 'Personajes, Cosplay y Ediciones Coleccionista',
    category: 'Escultura Digital · Resina 8K',
    subjectVariant: 'character',
    defaultFinish: 'Madera',
    summary:
      'Modelado completo desde bocetos o capturas para recrear personajes de animación, cosplay o regalos de cumpleaños con acabados en madera, mármol o color.',
    scaleSpec: '20–30 cm · Topología Profesional',
    image: STUDIO_REAL_IMAGES.sculptingZbrush,
    imageAlt: 'Monitor de estudio mostrando modelado 3D de personaje con malla poligonal',
  },
];
