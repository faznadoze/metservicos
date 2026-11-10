import React from 'react';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { MetLogo } from './MetLogo';
import { COMPANY_CONFIG, ServiceInterest } from '../content/landingPage';
import { buildServiceWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';

interface FooterProps {
  selectedInterest: ServiceInterest;
  onOpenPrivacyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ selectedInterest, onOpenPrivacyModal }) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildServiceWhatsAppUrl(selectedInterest);

  return (
    <>
      <footer className="bg-[#0B1933] text-slate-300 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-14 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <MetLogo className="w-10 h-10 shrink-0" variant="badge" />
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {COMPANY_CONFIG.brandName}
                  </p>
                  <p className="text-xs text-slate-400">{COMPANY_CONFIG.legalDescriptor}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                {COMPANY_CONFIG.essence}
              </p>
            </div>

            {/* Services Column */}
            <div className="md:col-span-3 space-y-3">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Serviços e Navegação
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#servicos" className="hover:text-[#FFD21A] transition-colors">
                    Instalação de painéis solares
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="hover:text-[#FFD21A] transition-colors">
                    Limpeza de sistemas fotovoltaicos
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="hover:text-[#FFD21A] transition-colors">
                    Por que cuidar do sistema
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-[#FFD21A] transition-colors">
                    Como funciona o atendimento
                  </a>
                </li>
                <li>
                  <a href="#duvidas" className="hover:text-[#FFD21A] transition-colors">
                    Perguntas frequentes
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="md:col-span-4 space-y-3">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Contato e Atendimento
              </p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#FFD21A] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FFD21A] shrink-0" />
                    <span>WhatsApp: {COMPANY_CONFIG.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+${COMPANY_CONFIG.whatsappNumber}`}
                    onClick={() => trackEvent('click_phone')}
                    className="inline-flex items-center gap-2 hover:text-[#FFD21A] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#FFD21A] shrink-0" />
                    <span>Telefone: {COMPANY_CONFIG.phoneDisplay}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFD21A] shrink-0" />
                  <a
                    href={`mailto:${COMPANY_CONFIG.email}`}
                    className="hover:text-[#FFD21A] transition-colors"
                  >
                    {COMPANY_CONFIG.email}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                  <MapPin className="w-4 h-4 text-[#FFD21A] shrink-0 mt-0.5" />
                  <span>{COMPANY_CONFIG.serviceArea}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {currentYear} {COMPANY_CONFIG.brandName} — {COMPANY_CONFIG.legalDescriptor}. Todos
              os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenPrivacyModal}
                className="hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Política de Privacidade
              </button>
              <span aria-hidden="true">·</span>
              <a href="#topo" className="hover:text-white">
                Voltar ao topo ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Compact Floating WhatsApp Button (respects 15% mobile sticky cap) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Solicitar atendimento pelo WhatsApp"
        onClick={() => trackEvent('click_whatsapp_hero', { source: 'floating_cta' })}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFD21A] hover:bg-[#F5A900] text-[#0B1933] font-bold text-xs shadow-lg border border-[#0B1933]/15 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD21A]"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span>WhatsApp</span>
      </a>
    </>
  );
};
