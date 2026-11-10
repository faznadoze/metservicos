import { COMPANY_CONFIG, ServiceInterest } from '../content/landingPage';

export interface LeadSubmissionPayload {
  name: string;
  whatsapp: string;
  city: string;
  interest: ServiceInterest;
  message?: string;
}

export const WHATSAPP_PRESET_MESSAGES: Record<ServiceInterest, string> = {
  instalacao: 'Olá! Quero solicitar um orçamento para instalação de energia solar.',
  limpeza: 'Olá! Quero agendar uma avaliação/limpeza do meu sistema fotovoltaico.',
  duvida:
    'Olá! Gostaria de receber orientação sobre energia solar e manutenção para o meu imóvel.',
};

export function getPresetWhatsAppMessage(interest: ServiceInterest): string {
  return WHATSAPP_PRESET_MESSAGES[interest] || WHATSAPP_PRESET_MESSAGES.duvida;
}

export function composeLeadWhatsAppMessage(payload: LeadSubmissionPayload): string {
  const interestLabelMap: Record<ServiceInterest, string> = {
    instalacao: 'Instalação de painéis solares',
    limpeza: 'Limpeza de sistema fotovoltaico',
    duvida: 'Ainda não sei / Quero orientação',
  };

  const baseIntro =
    payload.interest === 'instalacao'
      ? 'Olá! Quero solicitar um orçamento para instalação de energia solar.'
      : payload.interest === 'limpeza'
        ? 'Olá! Quero agendar uma avaliação/limpeza do meu sistema fotovoltaico.'
        : 'Olá! Gostaria de receber orientação da MeT Serviços.';

  const lines = [
    baseIntro,
    '',
    `*Nome:* ${payload.name.trim()}`,
    `*WhatsApp:* ${payload.whatsapp.trim()}`,
    `*Cidade/Região:* ${payload.city.trim()}`,
    `*Interesse:* ${interestLabelMap[payload.interest]}`,
  ];

  if (payload.message && payload.message.trim().length > 0) {
    lines.push(`*Observações:* ${payload.message.trim()}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(
  message: string,
  phone: string = COMPANY_CONFIG.whatsappNumber
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function buildServiceWhatsAppUrl(
  interest: ServiceInterest,
  phone: string = COMPANY_CONFIG.whatsappNumber
): string {
  return buildWhatsAppUrl(getPresetWhatsAppMessage(interest), phone);
}
