import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { COMPANY_CONFIG } from '../content/landingPage';

interface LogoLoaderProps {
  onComplete: () => void;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoBadgeRef = useRef<HTMLDivElement>(null);
  const brandTitleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const finishLoader = () => {
    try {
      sessionStorage.setItem('met_intro_seen', '1');
    } catch {
      // Ignore storage error
    }
    onComplete();
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: finishLoader,
      });

      tl.fromTo(
        logoBadgeRef.current,
        { opacity: 0, scale: 0.88, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      )
        .fromTo(
          brandTitleRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
          '-=0.15'
        )
        .fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.42, ease: 'power2.inOut' },
          '-=0.1'
        )
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.inOut',
        });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Carregando MeT Serviços"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1933] px-6 text-white"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        <div
          ref={logoBadgeRef}
          className="w-24 h-24 rounded-2xl bg-white p-2.5 shadow-xl border border-white/15 flex items-center justify-center mb-5"
        >
          <img
            src={COMPANY_CONFIG.logoPath}
            alt="Logotipo MeT Serviços — Energia Solar e Reformas"
            width={84}
            height={84}
            className="w-full h-full object-contain"
          />
        </div>

        <div ref={brandTitleRef} className="space-y-1 mb-6">
          <p className="font-display text-xl font-bold tracking-tight text-white">
            {COMPANY_CONFIG.brandName}
          </p>
          <p className="text-xs text-slate-300 tracking-wide">
            {COMPANY_CONFIG.legalDescriptor}
          </p>
        </div>

        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#FFD21A] origin-left"
          />
        </div>

        <button
          type="button"
          onClick={finishLoader}
          className="text-xs text-slate-300 hover:text-white underline underline-offset-4 transition-colors py-1.5 px-3 focus-visible:outline-2 focus-visible:outline-[#FFD21A] rounded"
        >
          Acessar conteúdo agora
        </button>
      </div>
    </div>
  );
};
