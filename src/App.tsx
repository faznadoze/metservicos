/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { X } from 'lucide-react';
import { COMPANY_CONFIG, ServiceInterest } from './content/landingPage';
import { shouldSkipIntroLoader } from './hooks/useReducedMotion';
import { trackEvent } from './lib/analytics';
import { LogoLoader } from './components/LogoLoader';
import { SiteHeader } from './components/landing/SiteHeader';
import { HeroSection, PartnerLogos } from './components/landing/HeroSection';
import { ValueProposition } from './components/landing/ValueProposition';
import { OfferingsCarousel, ProcessSection } from './components/landing/OfferingsAndProcess';
import { CtaFormSection, MainFooter } from './components/landing/CtaFormAndFooter';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  const [showLoader, setShowLoader] = useState<boolean>(() => !shouldSkipIntroLoader());
  const [selectedInterest, setSelectedInterest] = useState<ServiceInterest>('instalacao');
  const [prefillNote, setPrefillNote] = useState<string>('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    trackEvent('view_page');
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (!privacyModalOpen) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        modalBackdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.22, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalCardRef.current,
        { y: 12, scale: 0.95, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.24, ease: 'power3.out' }
      );
    },
    { scope: appRef, dependencies: [privacyModalOpen] }
  );

  const closeModal = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrivacyModalOpen(false);
      return;
    }

    gsap.to(modalCardRef.current, {
      y: 8,
      scale: 0.97,
      autoAlpha: 0,
      duration: 0.16,
      ease: 'power2.in',
    });

    gsap.to(modalBackdropRef.current, {
      autoAlpha: 0,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => setPrivacyModalOpen(false),
    });
  });

  const scrollToSection = contextSafe((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(window, {
      duration: reduceMotion ? 0 : 0.85,
      scrollTo: { y: el, offsetY: 72 },
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  });

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
    <div ref={appRef} className="min-h-screen flex flex-col bg-white text-[#111827] font-display">
      {showLoader && <LogoLoader onComplete={() => setShowLoader(false)} />}

      <SiteHeader onQuoteClick={() => scrollToSection('orcamento')} />

      <main className="flex-1">
        <HeroSection onCtaClick={() => scrollToSection('orcamento')} />
        <PartnerLogos />
        <ValueProposition />
        <OfferingsCarousel onSelect={(interest) => handleSelectInterest(interest, true)} />
        <ProcessSection onCta={() => scrollToSection('orcamento')} />
        <CtaFormSection
          selectedInterest={selectedInterest}
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        />
      </main>

      <MainFooter />

      {/* Accessible Privacy Policy Dialog */}
      {privacyModalOpen && (
        <div
          ref={modalBackdropRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div
            ref={modalCardRef}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 will-change-transform"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2
                id="privacy-modal-title"
                className="font-display text-lg font-bold text-[#17202F]"
              >
                Política de Privacidade e Uso de Dados
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar Política de Privacidade"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-[transform,background-color,color] duration-150 ease-out cursor-pointer"
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
                onClick={closeModal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#172D55] hover:bg-[#0B1933] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-out rounded-lg cursor-pointer shadow-sm"
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
