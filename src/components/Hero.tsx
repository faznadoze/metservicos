import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MessageCircle, Sun, Sparkles, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG, HERO_CONTENT, ServiceInterest } from '../content/landingPage';
import { buildServiceWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroProps {
  selectedInterest: ServiceInterest;
  onSelectInterest: (interest: ServiceInterest, scrollToForm?: boolean) => void;
}

export const Hero: React.FC<HeroProps> = ({ selectedInterest, onSelectInterest }) => {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [visualMode, setVisualMode] = useState<'instalacao' | 'limpeza'>('instalacao');

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    heroRef.current.style.setProperty('--glow-x', `${xPct}%`);
    heroRef.current.style.setProperty('--glow-y', `${yPct}%`);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(
        '.hero-animate-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: 'power3.out',
        }
      );
    },
    { scope: heroRef, dependencies: [prefersReducedMotion] }
  );

  const activeInterestForWhatsApp: ServiceInterest =
    selectedInterest === 'limpeza' || visualMode === 'limpeza' ? 'limpeza' : 'instalacao';

  const whatsappHref = buildServiceWhatsAppUrl(activeInterestForWhatsApp);

  return (
    <section
      id="topo"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#0B1933] text-white overflow-hidden solar-radial-glow roof-grid-pattern border-b border-white/10"
    >
      {/* Subtle diagonal roof lines inspired by the MT symbol */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          d="M80 520L340 260L580 500"
          stroke="#FFD21A"
          strokeWidth="2"
        />
        <path
          d="M140 560L340 360L540 560"
          stroke="#0582E8"
          strokeWidth="1.5"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column (7 cols): Brand Identity, Headline, Subheadline, CTAs, Trust Markers */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Quiet unboxed text kicker with typographic separators */}
              <p className="hero-animate-item text-xs font-medium tracking-wide text-[#FFD21A]">
                {COMPANY_CONFIG.legalDescriptor} <span aria-hidden="true">·</span>{' '}
                {HERO_CONTENT.kicker}
              </p>

              <h1
                className="hero-animate-item font-display font-extrabold text-white tracking-tight leading-[1.1]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)' }}
              >
                {HERO_CONTENT.headline}
              </h1>

              <p className="hero-animate-item text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                {HERO_CONTENT.subheadline}
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="hero-animate-item space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('click_whatsapp_hero', {
                      interest: activeInterestForWhatsApp,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-xl shadow-lg transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD21A]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{HERO_CONTENT.primaryCta}</span>
                </a>

                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFD21A]"
                >
                  <span>{HERO_CONTENT.secondaryCta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              </div>

              {/* Clean unboxed regional & operational trust markers */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-300">
                {HERO_CONTENT.trustMarkers.map((marker, idx) => (
                  <React.Fragment key={marker}>
                    <span>{marker}</span>
                    {idx < HERO_CONTENT.trustMarkers.length - 1 && (
                      <span aria-hidden="true" className="text-[#FFD21A]">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Architectural Solar Composition */}
          <div className="hero-animate-item lg:col-span-5 flex flex-col">
            <div className="h-full rounded-2xl bg-[#172D55]/90 border border-white/15 p-6 flex flex-col justify-between space-y-6">
              {/* Top Header with Institutional Logo & Interactive Mode Switcher */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 shrink-0 border border-slate-200">
                    <img
                      src={COMPANY_CONFIG.logoPath}
                      alt="Símbolo oficial da MeT Serviços"
                      width={40}
                      height={40}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-display">
                      Diagnóstico por Serviço
                    </p>
                    <p className="text-xs text-slate-300">
                      Selecione sua necessidade atual
                    </p>
                  </div>
                </div>

                {/* Interactive Segmented Control (Functional Buttons) */}
                <div
                  role="group"
                  aria-label="Alternar visualização de serviço"
                  className="flex items-center gap-1 p-1 bg-[#0B1933] rounded-lg border border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setVisualMode('instalacao');
                      onSelectInterest('instalacao', false);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      visualMode === 'instalacao'
                        ? 'bg-[#FFD21A] text-[#0B1933]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    01. Instalação
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisualMode('limpeza');
                      onSelectInterest('limpeza', false);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      visualMode === 'limpeza'
                        ? 'bg-[#FFD21A] text-[#0B1933]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    02. Limpeza
                  </button>
                </div>
              </div>

              {/* Architectural Solar Roof SVG Illustration */}
              <div className="relative rounded-xl bg-[#0B1933] border border-white/10 p-4 overflow-hidden">
                <svg
                  viewBox="0 0 440 220"
                  className="w-full h-44 object-contain"
                  role="img"
                  aria-label={
                    visualMode === 'instalacao'
                      ? 'Ilustração técnica de telhado com projeto de instalação de painéis solares'
                      : 'Ilustração técnica de limpeza e conservação de módulos fotovoltaicos'
                  }
                >
                  {/* Sun & Light Rays */}
                  <circle cx="88" cy="54" r="28" fill="#FBAE17" fillOpacity="0.92" />
                  <circle cx="88" cy="54" r="42" fill="#FFD21A" fillOpacity="0.16" />
                  <g stroke="#FFD21A" strokeWidth="2" strokeLinecap="round" opacity="0.65">
                    <line x1="136" y1="68" x2="195" y2="95" strokeDasharray="4 4" />
                    <line x1="128" y1="86" x2="180" y2="118" strokeDasharray="4 4" />
                    <line x1="142" y1="50" x2="225" y2="78" strokeDasharray="4 4" />
                  </g>

                  {/* Architectural Roof Structure */}
                  <path
                    d="M110 170 L255 62 L405 170 Z"
                    fill="#172D55"
                    stroke="#FFFFFF"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                  <path
                    d="M135 170 L135 205 L380 205 L380 170"
                    fill="#112242"
                    stroke="#FFFFFF"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                  />

                  {/* Solar Array Mounted on Roof Slope */}
                  <g transform="translate(190, 88) skewX(-22)">
                    <rect
                      x="0"
                      y="0"
                      width="136"
                      height="68"
                      rx="4"
                      fill="#0582E8"
                      stroke="#93C5FD"
                      strokeWidth="1.5"
                    />
                    {/* Grid lines */}
                    <line x1="34" y1="0" x2="34" y2="68" stroke="#E0F2FE" strokeOpacity="0.45" />
                    <line x1="68" y1="0" x2="68" y2="68" stroke="#E0F2FE" strokeOpacity="0.45" />
                    <line x1="102" y1="0" x2="102" y2="68" stroke="#E0F2FE" strokeOpacity="0.45" />
                    <line x1="0" y1="22" x2="136" y2="22" stroke="#E0F2FE" strokeOpacity="0.45" />
                    <line x1="0" y1="45" x2="136" y2="45" stroke="#E0F2FE" strokeOpacity="0.45" />

                    {/* Mode-specific overlay */}
                    {visualMode === 'limpeza' ? (
                      <>
                        {/* Cleaning water/brush pass line */}
                        <rect
                          x="68"
                          y="0"
                          width="68"
                          height="68"
                          fill="#38BDF8"
                          fillOpacity="0.32"
                        />
                        <line
                          x1="68"
                          y1="-4"
                          x2="68"
                          y2="72"
                          stroke="#FFD21A"
                          strokeWidth="3"
                        />
                      </>
                    ) : (
                      <>
                        {/* Dimensioning / Energy flow indicators */}
                        <circle cx="34" cy="22" r="3.5" fill="#FFD21A" />
                        <circle cx="102" cy="45" r="3.5" fill="#FFD21A" />
                      </>
                    )}
                  </g>

                  {/* Caption inside diagram */}
                  <text
                    x="18"
                    y="202"
                    fill="#CBD5E1"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {visualMode === 'instalacao'
                      ? 'PROJETO SOB MEDIDA · DIMENSIONAMENTO E FIXAÇÃO'
                      : 'LIMPEZA ÓPTICA · REMOÇÃO DE RESÍDUOS E INSPEÇÃO'}
                  </text>
                </svg>
              </div>

              {/* Dynamic Technical Context & Direct Action */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#FFD21A]">
                    {visualMode === 'instalacao' ? (
                      <Sun className="w-4 h-4 shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {visualMode === 'instalacao'
                        ? 'Para quem quer instalar energia solar'
                        : 'Para quem já possui painéis instalados'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {visualMode === 'instalacao'
                      ? 'Avaliamos o consumo da sua conta, a estrutura do telhado e orientamos todo o projeto sem complicação.'
                      : 'Removemos poeira, fuligem e resíduos com técnica segura para vidro fotovoltaico e inspeção visual.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFD21A] shrink-0" />
                    Atendimento técnico direto
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectInterest(visualMode, true)}
                    className="text-xs font-bold text-[#FFD21A] hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {visualMode === 'instalacao'
                      ? 'Avaliar instalação →'
                      : 'Agendar limpeza →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
