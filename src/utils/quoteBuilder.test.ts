import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppQuoteUrl,
  estimateProjectTimeline,
  isValidContact,
  validateQuoteForm,
} from './quoteBuilder';

test('isValidContact accepts emails and international phone numbers', () => {
  assert.equal(isValidContact('cliente@estudio.es'), true);
  assert.equal(isValidContact('+34 618 514 254'), true);
  assert.equal(isValidContact('618514254'), true);
  assert.equal(isValidContact('abc'), false);
  assert.equal(isValidContact(''), false);
});

test('validateQuoteForm returns specific Spanish error messages for missing fields', () => {
  const errors = validateQuoteForm({
    name: 'A',
    contact: 'invalido',
    figureType: 'Persona',
    style: 'Realista',
    finish: 'Yeso Mate',
    hasPhoto: false,
  });

  assert.ok(errors.name);
  assert.ok(errors.contact);
  assert.ok(errors.photo);
});

test('validateQuoteForm passes with valid inputs', () => {
  const errors = validateQuoteForm({
    name: 'Elena Martínez',
    contact: '+34 618 514 254',
    figureType: 'Persona',
    style: 'Bustos',
    finish: 'Pintado a Mano',
    hasPhoto: true,
    fileName: 'abuela_1968.jpg',
  });

  assert.deepEqual(errors, {});
});

test('estimateProjectTimeline computes realistic studio turnaround', () => {
  const handPainted = estimateProjectTimeline('Persona', 'Realista', 'Pintado a Mano');
  const plaster = estimateProjectTimeline('Mascota', 'Caricatura', 'Yeso Mate');

  assert.equal(handPainted.totalBusinessDays, 9);
  assert.equal(plaster.totalBusinessDays, 5);
  assert.match(handPainted.craftNotes, /policromía artesanal/i);
});

test('buildWhatsAppQuoteUrl encodes target number and selection parameters', () => {
  const url = buildWhatsAppQuoteUrl({
    name: 'Carlos Ruiz',
    contact: 'carlos@correo.es',
    figureType: 'Mascota',
    style: 'Realista',
    finish: 'Mármol',
    fileName: 'toby.png',
    notes: 'Incluir collar en la base',
    hasPhoto: true,
  });

  assert.ok(url.startsWith('https://wa.me/34618514254?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.match(decoded, /Hola, quiero un regalo personalizado en 3D/);
  assert.match(decoded, /Tipo de figura: Mascota/);
  assert.match(decoded, /Acabado: Mármol/);
  assert.match(decoded, /Incluir collar en la base/);
});
