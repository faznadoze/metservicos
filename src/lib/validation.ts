import { ServiceInterest } from '../content/landingPage';

export interface LeadFormValues {
  name: string;
  whatsapp: string;
  city: string;
  interest: ServiceInterest;
  message: string;
  consent: boolean;
}

export interface LeadFormErrors {
  name?: string;
  whatsapp?: string;
  city?: string;
  interest?: string;
  consent?: string;
}

export function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function validateLeadForm(values: LeadFormValues): {
  isValid: boolean;
  errors: LeadFormErrors;
} {
  const errors: LeadFormErrors = {};

  const trimmedName = values.name.trim();
  if (!trimmedName) {
    errors.name = 'Informe seu nome para identificarmos seu atendimento.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Digite um nome válido com pelo menos 2 caracteres.';
  }

  const digits = values.whatsapp.replace(/\D/g, '');
  if (!digits) {
    errors.whatsapp = 'Informe seu número de WhatsApp com DDD.';
  } else if (digits.length < 10 || digits.length > 11) {
    errors.whatsapp = 'Digite um telefone válido com DDD (10 ou 11 dígitos).';
  }

  const trimmedCity = values.city.trim();
  if (!trimmedCity) {
    errors.city = 'Informe sua cidade ou região para verificarmos o atendimento.';
  } else if (trimmedCity.length < 2) {
    errors.city = 'Informe o nome válido da sua cidade ou bairro.';
  }

  if (!['instalacao', 'limpeza', 'duvida'].includes(values.interest)) {
    errors.interest = 'Selecione o tipo de interesse.';
  }

  if (!values.consent) {
    errors.consent = 'Confirme o consentimento para entrarmos em contato pelo WhatsApp.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface SolarScenarioInput {
  goal: 'instalar' | 'limpar';
  propertyType: 'residencial' | 'comercial' | 'rural';
  conditionOrBill: 'baixo' | 'medio' | 'alto';
}

export interface SolarScenarioRecommendation {
  recommendedInterest: ServiceInterest;
  badgeText: string;
  headline: string;
  summary: string;
  nextSteps: string[];
  ctaLabel: string;
}

export function evaluateSolarScenario(
  input: SolarScenarioInput
): SolarScenarioRecommendation {
  if (input.goal === 'instalar') {
    const propertyLabels: Record<SolarScenarioInput['propertyType'], string> = {
      residencial: 'residencial',
      comercial: 'comercial',
      rural: 'rural',
    };
    const consumptionDescriptions: Record<SolarScenarioInput['conditionOrBill'], string> = {
      baixo: 'rotina diária moderada com potencial de expansão futura',
      medio: 'uso constante de climatização, refrigeração e equipamentos elétricos',
      alto: 'alta demanda energética que exige dimensionamento criterioso de telhado ou solo',
    };

    return {
      recommendedInterest: 'instalacao',
      badgeText: `Projeto Solar · Imóvel ${propertyLabels[input.propertyType]}`,
      headline: 'Avaliação de Viabilidade e Dimensionamento Fotovoltaico',
      summary: `Para um perfil ${propertyLabels[input.propertyType]} com ${consumptionDescriptions[input.conditionOrBill]}, analisamos sua fatura de energia e a orientação do telhado para projetar o sistema ideal sem superdimensionamento.`,
      nextSteps: [
        'Levantamento do histórico de consumo na conta de energia',
        'Verificação de área útil, inclinação e ausência de sombras no telhado',
        'Apresentação de proposta clara com equipamentos e etapas de instalação',
      ],
      ctaLabel: 'Solicitar avaliação de instalação',
    };
  }

  const dirtDescriptions: Record<SolarScenarioInput['conditionOrBill'], string> = {
    baixo: 'manutenção preventiva periódica para conservar a transparência do vidro solar',
    medio: 'remoção de camada visível de poeira, fuligem urbana ou folhas acumuladas nas bordas',
    alto: 'limpeza técnica prioritária para retirar crostas aderentes, dejetos de pássaros ou poeira intensa',
  };

  return {
    recommendedInterest: 'limpeza',
    badgeText: `Conservação Fotovoltaica · Imóvel ${input.propertyType}`,
    headline: 'Limpeza Técnica e Inspeção Visual dos Módulos',
    summary: `Indicada para ${dirtDescriptions[input.conditionOrBill]}. Utilizamos escovação apropriada sem produtos abrasivos e registramos o antes e depois do atendimento.`,
    nextSteps: [
      'Confirmação do número aproximado de placas e tipo de acesso ao telhado',
      'Remoção cuidadosa de sujeira acumulada sem risco de choque térmico',
      'Observação visual de integridade física dos módulos e envio de fotos',
    ],
    ctaLabel: 'Agendar limpeza do meu sistema',
  };
}

/**
 * Pure helper for mobile bottom-sheet drag tracking with upward rubber-band damping (Emil Kowalski gestures skill).
 */
export function computeSheetDragOffset(deltaY: number, upwardDamping: number = 0.22): number {
  if (deltaY < 0) {
    return deltaY * upwardDamping;
  }
  return deltaY;
}

/**
 * Pure helper for momentum-based sheet dismissal: dismisses if distance >= threshold OR velocity > 0.11 px/ms.
 */
export function shouldDismissSheetByGesture(
  deltaY: number,
  elapsedMs: number,
  distanceThreshold: number = 95,
  velocityThreshold: number = 0.11
): boolean {
  if (deltaY <= 0) return false;
  const safeElapsed = Math.max(elapsedMs, 1);
  const velocity = deltaY / safeElapsed;
  return deltaY >= distanceThreshold || velocity > velocityThreshold;
}

/**
 * Pure helper for computing active slide index in horizontal scroll-snap carousels.
 */
export function computeCarouselActiveIndex(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  itemCount: number
): number {
  if (itemCount <= 1) return 0;
  const maxScroll = scrollWidth - clientWidth;
  if (maxScroll <= 0) return 0;
  const ratio = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
  return Math.round(ratio * (itemCount - 1));
}
