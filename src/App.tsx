/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPANY_CONFIG, ServiceInterest } from './content/landingPage';
import { shouldSkipIntroLoader } from './hooks/useReducedMotion';
import { trackEvent } from './lib/analytics';
import { buildServiceWhatsAppUrl } from './lib/whatsapp';
import { LogoLoader } from './components/LogoLoader';
import { SiteHeader } from './components/landing/SiteHeader';
import { HeroSection, PartnerLogos } from './components/landing/HeroSection';
import { ValueProposition } from './components/landing/ValueProposition';
import { OfferingsCarousel, ProcessSection } from './components/landing/OfferingsAndProcess';
import { CtaFormSection, MainFooter } from './components/landing/CtaFormAndFooter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState<boolean>(() => !shouldSkipIntroLoader());

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

  const openWhatsApp = (interest: ServiceInterest = 'duvida', source: string = 'cta') => {
    trackEvent('click_whatsapp_hero', { source, interest });
    window.open(buildServiceWhatsAppUrl(interest), '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={appRef} className="min-h-screen flex flex-col bg-white text-[#111827] font-display">
      {showLoader && <LogoLoader onComplete={() => setShowLoader(false)} />}

      <SiteHeader isReady={!showLoader} onQuoteClick={() => openWhatsApp('duvida', 'header')} />

      <main className="flex-1">
        <HeroSection isReady={!showLoader} onCtaClick={() => openWhatsApp('duvida', 'hero')} />
        <PartnerLogos />
        <ValueProposition />
        <OfferingsCarousel onSelect={(interest) => openWhatsApp(interest, 'offerings')} />
        <ProcessSection onCta={() => openWhatsApp('duvida', 'process')} />
        <CtaFormSection />
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
    </div>
  );
}
