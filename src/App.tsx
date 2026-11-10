/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { COMPANY_CONFIG, ServiceInterest } from './content/landingPage';
import { shouldSkipIntroLoader } from './hooks/useReducedMotion';
import { trackEvent } from './lib/analytics';
import { LogoLoader } from './components/LogoLoader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ServicesSection } from './components/ServicesSection';
import { BenefitsAndProcess } from './components/BenefitsAndProcess';
import { FAQSection } from './components/FAQSection';
import { LeadFormSection } from './components/LeadFormSection';
import { Footer } from './components/Footer';

export default function App() {
  const [showLoader, setShowLoader] = useState<boolean>(() => !shouldSkipIntroLoader());
  const [selectedInterest, setSelectedInterest] = useState<ServiceInterest>('instalacao');
  const [prefillNote, setPrefillNote] = useState<string>('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    trackEvent('view_page');
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectInterest = (
    interest: ServiceInterest,
    scrollToForm: boolean = true,
    note?: string
  ) => {
    setSelectedInterest(interest);
    if (note) {
      setPrefillNote(note);
    }
    if (scrollToForm) {
      scrollToSection('orcamento');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#17202F]">
      {showLoader && <LogoLoader onComplete={() => setShowLoader(false)} />}

      <Header onRequestQuoteClick={() => scrollToSection('orcamento')} />

      <main className="flex-1">
        <Hero
          selectedInterest={selectedInterest}
          onSelectInterest={(interest, shouldScroll) =>
            handleSelectInterest(interest, shouldScroll)
          }
        />

        <TrustBar />

        <ServicesSection
          selectedInterest={selectedInterest}
          onSelectServiceForForm={(interest, note) =>
            handleSelectInterest(interest, true, note)
          }
        />

        <BenefitsAndProcess />

        <FAQSection />

        <LeadFormSection
          selectedInterest={selectedInterest}
          prefillNote={prefillNote}
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        />
      </main>

      <Footer
        selectedInterest={selectedInterest}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Accessible Privacy Policy Dialog */}
      {privacyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2
                id="privacy-modal-title"
                className="font-display text-lg font-bold text-[#17202F]"
              >
                Política de Privacidade e Uso de Dados
              </h2>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                aria-label="Fechar Política de Privacidade"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                A <strong>{COMPANY_CONFIG.brandName} ({COMPANY_CONFIG.legalDescriptor})</strong>{' '}
                coleta apenas as informações estritamente necessárias (Nome, WhatsApp, Cidade/Região
                e tipo de interesse) fornecidas voluntariamente por você no formulário de orçamento.
              </p>
              <p>
                <strong>Finalidade:</strong> Os dados são utilizados exclusivamente para que nossa
                equipe técnica e comercial entre em contato para esclarecer dúvidas, avaliar seu
                cenário fotovoltaico e apresentar propostas de instalação ou limpeza.
              </p>
              <p>
                <strong>Compartilhamento:</strong> Não vendemos nem compartilhamos seus dados
                pessoais com terceiros para fins publicitários.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#172D55] hover:bg-[#0B1933] rounded-lg cursor-pointer"
              >
                Entendi e fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
