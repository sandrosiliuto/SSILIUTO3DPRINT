import * as THREE from 'three';
import type { FinishOption } from '../utils/quoteBuilder';

export interface BustBuildOptions {
  finish: FinishOption;
  showWireframe?: boolean;
  lowPoly?: boolean;
  maxAnisotropy?: number;
  subjectVariant?: 'classic' | 'pet' | 'character';
}

function createProceduralSurfaceTextures(
  finish: FinishOption,
  maxAnisotropy: number,
): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  if (finish === 'Yeso Mate') {
    cCtx.fillStyle = '#ddd8cf';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);
    for (let i = 0; i < 4200; i++) {
      const x = (i * 73) % size;
      const y = (i * 137) % size;
      const shade = 208 + ((i * 19) % 28);
      cCtx.fillStyle = `rgb(${shade},${shade - 3},${shade - 8})`;
      cCtx.fillRect(x, y, 2, 2);
      const bShade = 112 + ((i * 31) % 34);
      bCtx.fillStyle = `rgb(${bShade},${bShade},${bShade})`;
      bCtx.fillRect(x, y, 2, 2);
    }
  } else if (finish === 'Mármol') {
    cCtx.fillStyle = '#d8d5cf';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#828282';
    bCtx.fillRect(0, 0, size, size);
    for (let v = 0; v < 18; v++) {
      cCtx.strokeStyle = v % 3 === 0 ? 'rgba(148, 120, 82, 0.52)' : 'rgba(78, 88, 102, 0.48)';
      cCtx.lineWidth = v % 2 === 0 ? 2.6 : 1.3;
      cCtx.beginPath();
      let x = (v * 29) % size;
      let y = 0;
      cCtx.moveTo(x, y);
      for (let step = 1; step <= 16; step++) {
        y = (step / 16) * size;
        x += Math.sin(step * 0.9 + v) * 16;
        cCtx.lineTo(x, y);
      }
      cCtx.stroke();
    }
  } else if (finish === 'Madera') {
    cCtx.fillStyle = '#7c4f2b';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      const wave = Math.sin(y * 0.08) * 14;
      cCtx.fillStyle = y % 6 === 0 ? 'rgba(46, 24, 10, 0.45)' : 'rgba(155, 104, 62, 0.3)';
      cCtx.fillRect(0, y, size, 1.5);
      bCtx.fillStyle = `rgb(${120 + Math.round(wave)},${120 + Math.round(wave)},${120 + Math.round(wave)})`;
      bCtx.fillRect(0, y, size, 2);
    }
  } else {
    cCtx.fillStyle = '#8f6239';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);
    for (let i = 0; i < 650; i++) {
      const x = (i * 53) % size;
      const y = (i * 97) % size;
      cCtx.fillStyle = i % 4 === 0 ? 'rgba(216, 174, 114, 0.42)' : 'rgba(56, 36, 20, 0.35)';
      cCtx.fillRect(x, y, 10, 2);
      bCtx.fillStyle = i % 2 === 0 ? 'rgb(144,144,144)' : 'rgb(110,110,110)';
      bCtx.fillRect(x, y, 8, 2);
    }
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(2, 2);
  colorMap.anisotropy = Math.max(1, maxAnisotropy);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);
  bumpMap.anisotropy = Math.max(1, maxAnisotropy);

  return { colorMap, bumpMap };
}

function createSculptedHeadGeometry(segW: number, segH: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.41, segW, segH);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Classical oval cranial proportions with tapered jawline
    y *= 1.25;
    if (y < 0) {
      const jawT = Math.min(1, Math.abs(y) / 0.52);
      x *= 1 - jawT * 0.32;
      z *= 1 - jawT * 0.16;
      if (z > 0.06) {
        y -= jawT * 0.05;
      }
    }

    if (z > 0.08) {
      // Cheekbone sculptural relief
      const cheekMask =
        Math.exp(-Math.pow((y + 0.05) / 0.12, 2)) *
        Math.exp(-Math.pow((Math.abs(x) - 0.165) / 0.095, 2));
      z += cheekMask * 0.065;

      // Pronounced brow arch
      const browMask =
        Math.exp(-Math.pow((y - 0.125) / 0.048, 2)) *
        Math.exp(-Math.pow(x / 0.21, 2));
      z += browMask * 0.052;

      // Deep orbital eye cavities for strong chiaroscuro
      const eyeMask =
        Math.exp(-Math.pow((y - 0.045) / 0.048, 2)) *
        Math.exp(-Math.pow((Math.abs(x) - 0.125) / 0.055, 2));
      z -= eyeMask * 0.062;

      // Nasolabial & mouth sculpting (upper & lower lip ridges)
      const upperLip =
        Math.exp(-Math.pow((y + 0.19) / 0.024, 2)) *
        Math.exp(-Math.pow(x / 0.095, 2));
      const lowerLip =
        Math.exp(-Math.pow((y + 0.245) / 0.025, 2)) *
        Math.exp(-Math.pow(x / 0.082, 2));
      const mouthLine =
        Math.exp(-Math.pow((y + 0.218) / 0.012, 2)) *
        Math.exp(-Math.pow(x / 0.09, 2));
      z += upperLip * 0.046 + lowerLip * 0.042 - mouthLine * 0.024;

      // Chin projection
      const chinMask =
        Math.exp(-Math.pow((y + 0.37) / 0.075, 2)) *
        Math.exp(-Math.pow(x / 0.09, 2));
      z += chinMask * 0.055;
    }

    // Temple planar carving
    if (y > -0.02 && y < 0.28) {
      const templeMask = Math.exp(-Math.pow((Math.abs(x) - 0.33) / 0.08, 2));
      x *= 1 - templeMask * 0.09;
    }

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

function createSculptedHairGeometry(segW: number, segH: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.455, segW, segH);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    x *= 1.04;
    y *= 1.18;
    z *= 1.1;

    // Swept sculptural hair wave striations
    const theta = Math.atan2(x, z);
    const wave = Math.sin(theta * 14 + y * 9) * 0.014;
    const radial = 1 + wave;
    x *= radial;
    z *= radial;

    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildSculptedBust(options: BustBuildOptions): {
  group: THREE.Group;
  wireframeMesh: THREE.LineSegments;
} {
  const {
    finish,
    showWireframe = false,
    lowPoly = false,
    maxAnisotropy = 4,
    subjectVariant = 'classic',
  } = options;

  const group = new THREE.Group();
  const seg = lowPoly ? 22 : 40;
  const { colorMap, bumpMap } = createProceduralSurfaceTextures(finish, maxAnisotropy);

  const isMetal = finish === 'Pintado a Mano';
  const mainMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: colorMap,
    bumpMap,
    bumpScale: finish === 'Yeso Mate' ? 0.005 : finish === 'Madera' ? 0.009 : 0.004,
    roughness: finish === 'Yeso Mate' ? 0.82 : finish === 'Mármol' ? 0.3 : finish === 'Madera' ? 0.56 : 0.4,
    metalness: isMetal ? 0.42 : 0.03,
    clearcoat: finish === 'Mármol' ? 0.35 : finish === 'Pintado a Mano' ? 0.22 : 0.04,
    clearcoatRoughness: 0.28,
  });

  const accentMat = new THREE.MeshPhysicalMaterial({
    color: finish === 'Yeso Mate' ? 0xf5f2eb : finish === 'Mármol' ? 0xe8e2d8 : 0xd8bd92,
    roughness: 0.24,
    metalness: 0.14,
    clearcoat: 0.55,
  });

  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x11131d,
    roughness: 0.42,
    metalness: 0.72,
  });

  const trimRingMat = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.48,
    roughness: 0.2,
    metalness: 0.8,
  });

  // 1. Stepped architectural plinth (bottom at y = 0)
  const plinthPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.72, 0),
    new THREE.Vector2(0.72, 0.08),
    new THREE.Vector2(0.64, 0.12),
    new THREE.Vector2(0.56, 0.16),
    new THREE.Vector2(0.52, 0.32),
    new THREE.Vector2(0.58, 0.36),
    new THREE.Vector2(0.46, 0.44),
    new THREE.Vector2(0, 0.44),
  ];
  const plinthGeo = new THREE.LatheGeometry(plinthPoints, seg);
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  group.add(plinthMesh);

  // 2. Subtle neon calibration collar on plinth
  const collarGeo = new THREE.TorusGeometry(0.54, 0.012, 10, seg);
  collarGeo.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeo, trimRingMat);
  collarMesh.position.y = 0.34;
  group.add(collarMesh);

  // 3. Sculpted draped chest / shoulder torso
  const torsoProfile = [
    new THREE.Vector2(0, 0.44),
    new THREE.Vector2(0.54, 0.44),
    new THREE.Vector2(0.68, 0.62),
    new THREE.Vector2(0.74, 0.82),
    new THREE.Vector2(0.54, 1.02),
    new THREE.Vector2(0.26, 1.12),
    new THREE.Vector2(0.18, 1.2),
    new THREE.Vector2(0, 1.2),
  ];
  const torsoGeo = new THREE.LatheGeometry(torsoProfile, seg);
  torsoGeo.scale(1.12, 1, 0.64);
  const torsoMesh = new THREE.Mesh(torsoGeo, mainMat);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  group.add(torsoMesh);

  // 4. Draped fur stole folds across shoulders
  const drapeCurveL = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, 0.72, -0.05),
    new THREE.Vector3(-0.46, 0.96, 0.18),
    new THREE.Vector3(-0.18, 0.86, 0.38),
    new THREE.Vector3(0.05, 0.56, 0.42),
  ]);
  const drapeGeoL = new THREE.TubeGeometry(drapeCurveL, 24, 0.12, 14, false);
  const drapeL = new THREE.Mesh(drapeGeoL, mainMat);
  drapeL.castShadow = true;
  drapeL.receiveShadow = true;
  group.add(drapeL);

  const drapeCurveR = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.62, 0.72, -0.05),
    new THREE.Vector3(0.46, 0.96, 0.18),
    new THREE.Vector3(0.18, 0.86, 0.38),
    new THREE.Vector3(-0.02, 0.54, 0.40),
  ]);
  const drapeGeoR = new THREE.TubeGeometry(drapeCurveR, 24, 0.12, 14, false);
  const drapeR = new THREE.Mesh(drapeGeoR, mainMat);
  drapeR.castShadow = true;
  drapeR.receiveShadow = true;
  group.add(drapeR);

  // 5. Neck column
  const neckGeo = new THREE.CylinderGeometry(0.16, 0.205, 0.34, seg);
  const neckMesh = new THREE.Mesh(neckGeo, mainMat);
  neckMesh.position.set(0, 1.26, 0.02);
  neckMesh.castShadow = true;
  neckMesh.receiveShadow = true;
  group.add(neckMesh);

  // 6. Sculpted Cranial Head
  const headGeo = createSculptedHeadGeometry(seg, Math.max(20, Math.floor(seg * 0.75)));
  const headMesh = new THREE.Mesh(headGeo, mainMat);
  headMesh.position.set(0, 1.72, 0.05);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  group.add(headMesh);

  // 7. Sculpted Nose Bridge & Tip
  const noseGeo = new THREE.ConeGeometry(0.058, 0.21, 14);
  noseGeo.rotateX(Math.PI * 0.32);
  noseGeo.scale(0.85, 1, 1.22);
  const noseMesh = new THREE.Mesh(noseGeo, mainMat);
  noseMesh.position.set(0, 1.69, 0.45);
  noseMesh.castShadow = true;
  group.add(noseMesh);

  // 8. Subject variation: Hair crown / Pet ears / Character crest
  if (subjectVariant === 'pet') {
    const earGeo = new THREE.ConeGeometry(0.15, 0.36, 14);
    const earL = new THREE.Mesh(earGeo, mainMat);
    earL.position.set(-0.28, 2.1, 0.02);
    earL.rotation.set(0.15, 0, 0.35);
    earL.castShadow = true;
    group.add(earL);

    const earR = new THREE.Mesh(earGeo, mainMat);
    earR.position.set(0.28, 2.1, 0.02);
    earR.rotation.set(0.15, 0, -0.35);
    earR.castShadow = true;
    group.add(earR);
  } else {
    const hairGeo = createSculptedHairGeometry(seg, Math.max(18, Math.floor(seg * 0.7)));
    const hairMesh = new THREE.Mesh(hairGeo, mainMat);
    hairMesh.position.set(0, 1.9, -0.07);
    hairMesh.rotation.x = -0.22;
    hairMesh.castShadow = true;
    hairMesh.receiveShadow = true;
    group.add(hairMesh);

    if (subjectVariant === 'character') {
      const crestGeo = new THREE.TorusGeometry(0.32, 0.04, 12, 28, Math.PI);
      const crestMesh = new THREE.Mesh(crestGeo, accentMat);
      crestMesh.position.set(0, 2.18, 0.02);
      group.add(crestMesh);
    }
  }

  // 9. Sculpted Ears + Drop Earrings
  const sideEarGeo = new THREE.SphereGeometry(0.082, 12, 12);
  sideEarGeo.scale(0.45, 1.15, 0.7);
  const leftEar = new THREE.Mesh(sideEarGeo, mainMat);
  leftEar.position.set(-0.39, 1.7, 0.02);
  group.add(leftEar);
  const rightEar = new THREE.Mesh(sideEarGeo, mainMat);
  rightEar.position.set(0.39, 1.7, 0.02);
  group.add(rightEar);

  const dropGeo = new THREE.SphereGeometry(0.028, 10, 10);
  dropGeo.scale(0.85, 1.5, 0.85);
  const earDropL = new THREE.Mesh(dropGeo, accentMat);
  earDropL.position.set(-0.4, 1.57, 0.03);
  group.add(earDropL);
  const earDropR = new THREE.Mesh(dropGeo, accentMat);
  earDropR.position.set(0.4, 1.57, 0.03);
  group.add(earDropR);

  // 10. Pearl Necklace Strand seated cleanly along the collarbones
  const pearlCount = 19;
  const pearlGeo = new THREE.SphereGeometry(0.024, 10, 10);
  const pearlInstanced = new THREE.InstancedMesh(pearlGeo, accentMat, pearlCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < pearlCount; i++) {
    const t = (i / (pearlCount - 1)) * Math.PI - Math.PI / 2;
    const angle = t * 0.88;
    dummy.position.set(
      Math.sin(angle) * 0.22,
      1.16 - Math.cos(angle) * 0.14,
      Math.cos(angle) * 0.26 + 0.06,
    );
    dummy.updateMatrix();
    pearlInstanced.setMatrixAt(i, dummy.matrix);
  }
  pearlInstanced.instanceMatrix.needsUpdate = true;
  pearlInstanced.computeBoundingSphere();
  group.add(pearlInstanced);

  // 11. Subtle Digital Alchemy Topology Wireframe Overlay
  const wireGeo = new THREE.WireframeGeometry(headGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: showWireframe ? 0.45 : 0.0,
  });
  const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
  wireframeMesh.position.copy(headMesh.position);
  wireframeMesh.scale.setScalar(1.012);
  wireframeMesh.visible = showWireframe;
  group.add(wireframeMesh);

  // Ground shadow disc
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
  grad.addColorStop(0, 'rgba(0,0,0,0.65)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(1.15, 32),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.01;
  group.add(shadowPlane);

  return { group, wireframeMesh };
}
