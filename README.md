# SSILIUTOIMPRESION3D · Digital Alchemy

Landing page inmersiva para **SSILIUTOIMPRESION3D**, estudio de arte digital especializado en:
1. **Restauración y mejora de fotografías antiguas o de baja calidad**.
2. **Modelado 3D manual en ZBrush / Blender** (sin depender únicamente de IA automática).
3. **Impresión 3D de alta precisión**, lijado artesanal, imprimación y acabados en **Yeso Mate, Mármol, Madera o Pintado a Mano**.

---

## Estructura del Proyecto

- `src/App.tsx`: Orquestación principal de secciones, barra de navegación superior, animaciones GSAP ScrollTrigger y visor 3D diferido.
- `src/three/bustSculpture.ts`: Escultura 3D procedural compuesta (pedestal, torso drapeado, cuello, cabeza esculpida, cabello, collar de perlas instanciado y malla topológica) con texturas PBR procedurales para los 4 acabados.
- `src/three/webglUtils.ts`: Detección de WebGL por software (`SwiftShader`), iluminación `RoomEnvironment`, renderizado bajo demanda y limpieza de recursos GPU (`disposeObject3D`).
- `src/components/HeroBustCanvas.tsx`: Escena 3D del Hero con rotación suave y parallax al cursor.
- `src/components/InteractiveBustModal.tsx`: Modal accesible de inspección 360° con `OrbitControls`, selector de acabados y vista de malla topológica.
- `src/components/ProcessSection.tsx`: Flujo de 4 pasos (Restauración, Modelado 3D, Impresión 3D, Lijado y Pintado a Mano).
- `src/components/BeforeAfterGallery.tsx`: Comparador interactivo *Antes y Después* (foto antigua vs. restaurada) + tríptico real de entrega + tarjetas de proyectos con botón **Ver en 3D**.
- `src/components/PhotoUploadForm.tsx`: Zona Drag & Drop con previsualización, simulación de mejora, validación y generación automática de enlace a WhatsApp (`+34 618 514 254`).
- `src/utils/quoteBuilder.ts`: Lógica pura de validación, estimación de plazos de taller y construcción de URL de WhatsApp (con tests unitarios en `src/utils/quoteBuilder.test.ts`).

---

## Cómo sustituir los bustos procedurales por modelos `.glb` (con Draco)

El proyecto utiliza actualmente geometría procedural en `src/three/bustSculpture.ts` para garantizar carga instantánea sin archivos externos. Para cargar tus propios modelos exportados de ZBrush/Blender en formato `.glb` comprimido con Draco:

1. Coloca tus archivos `.glb` en `public/models/` (por ejemplo `public/models/busto-abuela.glb`) y los decodificadores Draco en `public/draco/`.
2. Usa `GLTFLoader` + `DRACOLoader` de `three/addons/`:

```ts
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('/models/busto-abuela.glb', (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
});
```

---

## Cómo conectar el formulario a un backend propio (opcional)

Actualmente `PhotoUploadForm.tsx` valida los campos mediante `validateQuoteForm` y genera un enlace directo a WhatsApp (`https://wa.me/34618514254?text=...`) con todos los parámetros seleccionados.

Si deseas almacenar además el archivo subido y el presupuesto en un servidor propio o en Cloudflare R2 / S3 / Express:

1. En `PhotoUploadForm.tsx`, dentro de `handleSubmit`, envía un `FormData` con el archivo `fileInputRef.current?.files?.[0]` y los campos JSON a tu endpoint `POST /api/presupuestos`.
2. Mantén la generación de `buildWhatsAppQuoteUrl` como respuesta inmediata tras el `200 OK` para conservar la alta tasa de conversión por WhatsApp.

---

## Scripts disponibles

- `npm run dev` — Inicia el servidor de desarrollo en el puerto 3000.
- `npm run build` — Compila la aplicación optimizada para producción.
- `npm run lint` — Verifica tipos TypeScript (`tsc --noEmit`).
- `npx --yes tsx --test src/utils/quoteBuilder.test.ts` — Ejecuta los tests unitarios de lógica de presupuesto y validación.
