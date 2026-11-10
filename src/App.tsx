/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { X } from 'lucide-react';
import { COMPANY_CONFIG, ServiceInterest } from './content/landingPage';
import { shouldSkipIntroLoader } from './hooks/useReducedMotion';
import { trackEvent } from './lib/analytics';
import { buildServiceWhatsAppUrl } from './lib/whatsapp';
import { computeSheetDragOffset, shouldDismissSheetByGesture } from './lib/validation';
import { LogoLoader } from './components/LogoLoader';
import { SiteHeader } from './components/landing/SiteHeader';
import { HeroSection, PartnerLogos } from './components/landing/HeroSection';
import { ValueProposition } from './components/landing/ValueProposition';
import { OfferingsCarousel, ProcessSection } from './components/landing/OfferingsAndProcess';
import { CtaFormSection, MainFooter } from './components/landing/CtaFormAndFooter';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startY: number;
    startTime: number;
    currentDeltaY: number;
  }>({
    active: false,
    pointerId: null,
    startY: 0,
    startTime: 0,
    currentDeltaY: 0,
  });

  const [showLoader, setShowLoader] = useState<boolean>(() => !shouldSkipIntroLoader());
  const [selectedInterest, setSelectedInterest] = useState<ServiceInterest>('instalacao');
  const [, setPrefillNote] = useState<string>('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    trackEvent('view_page');
  }, []);

  useEffect(() => {
    if (!showLoader) {
      const id = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [showLoader]);

  const { contextSafe } = useGSAP(
    () => {
      if (!privacyModalOpen) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isMobileSheet = window.matchMedia('(max-width: 639px)').matches;

      gsap.fromTo(
        modalBackdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.22, ease: 'power2.out' }
      );

      if (isMobileSheet) {
        gsap.fromTo(
          modalCardRef.current,
          { yPercent: 100, autoAlpha: 1 },
          { yPercent: 0, duration: 0.38, ease: 'cubic-bezier(0.32, 0.72, 0, 1)' }
        );
      } else {
        gsap.fromTo(
          modalCardRef.current,
          { y: 12, scale: 0.95, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power3.out' }
        );
      }
    },
    { scope: appRef, dependencies: [privacyModalOpen] }
  );

  const closeModal = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrivacyModalOpen(false);
      return;
    }

    const isMobileSheet = window.matchMedia('(max-width: 639px)').matches;

    if (isMobileSheet) {
      gsap.to(modalCardRef.current, {
        yPercent: 100,
        duration: 0.22,
        ease: 'power3.in',
      });
    } else {
      gsap.to(modalCardRef.current, {
        y: 8,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.16,
        ease: 'power2.in',
      });
    }

    gsap.to(modalBackdropRef.current, {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => setPrivacyModalOpen(false),
    });
  });

  // 1:1 Pointer Gesture Tracking + Momentum Dismissal on Mobile Sheet (Emil Kowalski gestures skill)
  const onSheetPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(max-width: 639px)').matches) return;
    if ((e.target as HTMLElement).closest('button')) return;
    if (dragStateRef.current.active) return; // Multi-touch protection

    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startY: e.clientY,
      startTime: performance.now(),
      currentDeltaY: 0,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    gsap.killTweensOf(modalCardRef.current);
  };

  const onSheetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active || state.pointerId !== e.pointerId || !modalCardRef.current) return;

    const rawDelta = e.clientY - state.startY;
    const dampedY = computeSheetDragOffset(rawDelta, 0.22);
    state.currentDeltaY = rawDelta;

    // Direct transform write on element (never CSS variable on parent)
    modalCardRef.current.style.transform = `translate3d(0, ${dampedY}px, 0)`;

    if (modalBackdropRef.current && rawDelta > 0) {
      const progress = Math.min(rawDelta / 260, 1);
      modalBackdropRef.current.style.opacity = String(1 - progress * 0.75);
    }
  };

  const onSheetPointerUp = contextSafe((e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active || state.pointerId !== e.pointerId) return;
    state.active = false;
    state.pointerId = null;

    const elapsed = performance.now() - state.startTime;
    const shouldDismiss = shouldDismissSheetByGesture(state.currentDeltaY, elapsed);

    if (shouldDismiss) {
      closeModal();
    } else {
      gsap.to(modalCardRef.current, {
        y: 0,
        duration: 0.24,
        ease: 'power3.out',
      });
      if (modalBackdropRef.current) {
        gsap.to(modalBackdropRef.current, {
          autoAlpha: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    }
  });

  const scrollToSection = contextSafe((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(window, {
      duration: reduceMotion ? 0 : 0.72,
      scrollTo: { y: el, offsetY: id === 'inicio' ? 0 : 72, autoKill: true },
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

      <SiteHeader isReady={!showLoader} onQuoteClick={() => scrollToSection('orcamento')} />

      <main className="flex-1">
        <HeroSection isReady={!showLoader} onCtaClick={() => scrollToSection('orcamento')} />
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

      {/* Floating WhatsApp Button (Bottom-Right Corner) */}
      <a
        href={buildServiceWhatsAppUrl('duvida')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com a ${COMPANY_CONFIG.brandName} pelo WhatsApp`}
        onClick={() => trackEvent('click_whatsapp_hero', { source: 'floating_button' })}
        style={{
          bottom: 'max(1.25rem, calc(1rem + env(safe-area-inset-bottom, 0px)))',
        }}
        className="fixed right-5 md:right-7 z-40 flex size-14 md:size-15 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-4px_rgba(37,211,102,0.55)] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#20bd5a] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_14px_30px_-4px_rgba(37,211,102,0.68)] active:scale-95 transition-[transform,background-color,box-shadow] duration-150 ease-emil-out"
      >
        <img
          src="/assets/figma/social-3.svg"
          alt="WhatsApp"
          width={28}
          height={28}
          className="size-7 md:size-7.5 select-none pointer-events-none"
        />
      </a>

      {/* Accessible Privacy Policy Dialog / Mobile Bottom Sheet */}
      {privacyModalOpen && (
        <div
          ref={modalBackdropRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        >
          <div
            ref={modalCardRef}
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerUp}
            onPointerCancel={onSheetPointerUp}
            style={{
              paddingBottom: 'max(1.5rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))',
            }}
            className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full px-6 pt-3 sm:pt-6 space-y-4 shadow-2xl border-t sm:border border-slate-200 touch-pan-x sm:touch-auto overscroll-contain will-change-transform"
          >
            {/* Mobile Bottom Sheet Grab Handle */}
            <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300 sm:hidden" />

            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2
                id="privacy-modal-title"
                className="font-display text-base sm:text-lg font-bold text-[#17202F]"
              >
                Política de Privacidade e Uso de Dados
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar Política de Privacidade"
                className="flex min-h-[44px] min-w-[44px] -mr-2 items-center justify-center rounded-lg text-slate-500 [@media(hover:hover)_and_(pointer:fine)]:hover:text-slate-900 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-slate-100 active:scale-95 transition-[transform,background-color,color] duration-150 ease-emil-out cursor-pointer"
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
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#172D55] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#0B1933] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-emil-out rounded-xl sm:rounded-lg cursor-pointer shadow-sm"
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
