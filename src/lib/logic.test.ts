import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildServiceWhatsAppUrl,
  composeLeadWhatsAppMessage,
  getPresetWhatsAppMessage,
} from './whatsapp';
import {
  computeCarouselActiveIndex,
  computeSheetDragOffset,
  evaluateSolarScenario,
  formatPhoneBR,
  shouldDismissSheetByGesture,
  validateLeadForm,
} from './validation';
import { trackEvent, getTrackedEvents } from './analytics';

test('WhatsApp preset messages match the exact plan specifications', () => {
  const instalacaoMsg = getPresetWhatsAppMessage('instalacao');
  assert.equal(
    instalacaoMsg,
    'Olá! Quero solicitar um orçamento para instalação de energia solar.'
  );

  const limpezaMsg = getPresetWhatsAppMessage('limpeza');
  assert.equal(
    limpezaMsg,
    'Olá! Quero agendar uma avaliação/limpeza do meu sistema fotovoltaico.'
  );

  const url = buildServiceWhatsAppUrl('instalacao');
  assert.ok(url.startsWith('https://wa.me/5548999698995?text='));
  assert.ok(decodeURIComponent(url).includes('instalação de energia solar'));
});

test('composeLeadWhatsAppMessage includes all lead fields cleanly', () => {
  const msg = composeLeadWhatsAppMessage({
    name: 'Mariana Costa',
    whatsapp: '(11) 98765-4321',
    city: 'Campinas - SP',
    interest: 'limpeza',
    message: 'Sistema com 14 placas em telhado cerâmico.',
  });

  assert.ok(msg.includes('Olá! Quero agendar uma avaliação/limpeza do meu sistema fotovoltaico.'));
  assert.ok(msg.includes('*Nome:* Mariana Costa'));
  assert.ok(msg.includes('*Cidade/Região:* Campinas - SP'));
  assert.ok(msg.includes('*Interesse:* Limpeza de sistema fotovoltaico'));
  assert.ok(msg.includes('*Observações:* Sistema com 14 placas em telhado cerâmico.'));
});

test('formatPhoneBR formats 10 and 11 digit Brazilian numbers accurately', () => {
  assert.equal(formatPhoneBR('11987654321'), '(11) 98765-4321');
  assert.equal(formatPhoneBR('1134567890'), '(11) 3456-7890');
  assert.equal(formatPhoneBR(''), '');
});

test('validateLeadForm rejects empty or invalid inputs and accepts valid submission', () => {
  const emptyCheck = validateLeadForm({
    name: '',
    whatsapp: '123',
    city: '',
    interest: 'instalacao',
    message: '',
    consent: false,
  });

  assert.equal(emptyCheck.isValid, false);
  assert.ok(emptyCheck.errors.name);
  assert.ok(emptyCheck.errors.whatsapp);
  assert.ok(emptyCheck.errors.city);
  assert.ok(emptyCheck.errors.consent);

  const validCheck = validateLeadForm({
    name: 'Carlos Eduardo',
    whatsapp: '(11) 99876-5432',
    city: 'Jundiaí',
    interest: 'instalacao',
    message: 'Orçamento para residência',
    consent: true,
  });

  assert.equal(validCheck.isValid, true);
  assert.equal(Object.keys(validCheck.errors).length, 0);
});

test('evaluateSolarScenario returns tailored technical guidance without unverified percentage promises', () => {
  const installRec = evaluateSolarScenario({
    goal: 'instalar',
    propertyType: 'comercial',
    conditionOrBill: 'alto',
  });
  assert.equal(installRec.recommendedInterest, 'instalacao');
  assert.ok(installRec.summary.includes('comercial'));

  const cleanRec = evaluateSolarScenario({
    goal: 'limpar',
    propertyType: 'residencial',
    conditionOrBill: 'medio',
  });
  assert.equal(cleanRec.recommendedInterest, 'limpeza');
  assert.equal(cleanRec.ctaLabel, 'Agendar limpeza do meu sistema');
});

test('trackEvent records conversion events in sequence', () => {
  trackEvent('view_page', { source: 'test' });
  trackEvent('click_whatsapp_hero');
  const events = getTrackedEvents();
  assert.ok(events.length >= 2);
  assert.equal(events[events.length - 1].name, 'click_whatsapp_hero');
});

test('mobile gesture helpers apply rubber-band damping and velocity dismissal', () => {
  assert.equal(computeSheetDragOffset(120), 120);
  assert.equal(computeSheetDragOffset(-100, 0.25), -25);

  // Fast flick over short distance dismisses (velocity = 45 / 120 = 0.375 > 0.11)
  assert.equal(shouldDismissSheetByGesture(45, 120), true);
  // Slow drag past distance threshold dismisses
  assert.equal(shouldDismissSheetByGesture(110, 2000), true);
  // Slow short drag snaps back
  assert.equal(shouldDismissSheetByGesture(40, 600), false);
  // Upward drag never dismisses
  assert.equal(shouldDismissSheetByGesture(-80, 100), false);
});

test('computeCarouselActiveIndex maps scroll progress to card index accurately', () => {
  assert.equal(computeCarouselActiveIndex(0, 1200, 300, 4), 0);
  assert.equal(computeCarouselActiveIndex(300, 1200, 300, 4), 1);
  assert.equal(computeCarouselActiveIndex(600, 1200, 300, 4), 2);
  assert.equal(computeCarouselActiveIndex(900, 1200, 300, 4), 3);
});
