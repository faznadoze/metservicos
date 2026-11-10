import React from 'react';
import { MessageCircle } from 'lucide-react';
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
      <footer className="bg-[#050A14] text-slate-400 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <MetLogo className="w-6 h-6 shrink-0" variant="badge" />
            <p>
              Todos os direitos reservados © {COMPANY_CONFIG.brandName} {currentYear} —{' '}
              {COMPANY_CONFIG.legalDescriptor}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Política de Privacidade
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <a href="#topo" className="hover:text-white transition-colors">
              Topo ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Compact Floating WhatsApp Button */}
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
