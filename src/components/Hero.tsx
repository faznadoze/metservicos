import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
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

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(
        '.hero-animate-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
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
      className="relative min-h-[620px] lg:min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#1D3E6E] text-white"
    >
      {/* Full-Bleed Atmospheric Sky-to-Solar-Field Backdrop (matching reference composition) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg
          viewBox="0 0 1440 760"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full object-cover"
          role="img"
          aria-label={
            visualMode === 'instalacao'
              ? 'Panorama de usina e telhado solar sob céu aberto ao entardecer'
              : 'Panorama de módulos fotovoltaicos recebendo limpeza técnica sob céu claro'
          }
        >
          <defs>
            {/* Atmospheric sky gradient matching the reference image */}
            <linearGradient id="heroSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#355C96" />
              <stop offset="42%" stopColor="#567DB5" />
              <stop offset="68%" stopColor="#8AA8D0" />
              <stop offset="100%" stopColor="#0B1933" />
            </linearGradient>

            {/* Warm golden horizon sun glow */}
            <radialGradient id="sunHorizonGlow" cx="50%" cy="62%" r="48%">
              <stop offset="0%" stopColor="#FFD21A" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#F5A900" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#172D55" stopOpacity="0" />
            </radialGradient>

            {/* Solar field ground gradient */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1B3A2B" />
              <stop offset="35%" stopColor="#132A20" />
              <stop offset="100%" stopColor="#091526" />
            </linearGradient>

            {/* Photovoltaic panel surface gradient */}
            <linearGradient id="pvGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0582E8" />
              <stop offset="50%" stopColor="#174885" />
              <stop offset="100%" stopColor="#0B1933" />
            </linearGradient>
          </defs>

          {/* Sky Canvas */}
          <rect width="1440" height="760" fill="url(#heroSkyGrad)" />
          <rect width="1440" height="760" fill="url(#sunHorizonGlow)" />

          {/* Soft atmospheric clouds */}
          <ellipse cx="260" cy="210" rx="220" ry="38" fill="#FFFFFF" fillOpacity="0.08" />
          <ellipse cx="1180" cy="180" rx="260" ry="44" fill="#FFFFFF" fillOpacity="0.1" />
          <ellipse cx="820" cy="290" rx="310" ry="32" fill="#FFFFFF" fillOpacity="0.07" />

          {/* Reference-style subtle calibration '+' crosshairs in the sky */}
          <g stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.2">
            <path d="M160 120 H172 M166 114 V126" />
            <path d="M1274 120 H1286 M1280 114 V126" />
            <path d="M310 250 H322 M316 244 V256" />
            <path d="M1120 250 H1132 M1126 244 V256" />
          </g>

          {/* Distant Horizon Landscape */}
          <path
            d="M0 455 Q360 442 720 450 T1440 455 L1440 760 L0 760 Z"
            fill="url(#groundGrad)"
          />

          {/* Perspective rows of solar arrays / architectural roof lines converging toward center */}
          <g stroke="#29523E" strokeWidth="1.5" opacity="0.65">
            <line x1="720" y1="450" x2="-120" y2="760" />
            <line x1="720" y1="450" x2="120" y2="760" />
            <line x1="720" y1="450" x2="360" y2="760" />
            <line x1="720" y1="450" x2="600" y2="760" />
            <line x1="720" y1="450" x2="840" y2="760" />
            <line x1="720" y1="450" x2="1080" y2="760" />
            <line x1="720" y1="450" x2="1320" y2="760" />
            <line x1="720" y1="450" x2="1560" y2="760" />
          </g>

          {/* Left Wing Solar Array Wing */}
          <g transform="translate(80, 515)">
            <polygon
              points="40,0 540,0 510,95 0,95"
              fill="url(#pvGlassGrad)"
              stroke="#93C5FD"
              strokeWidth="2"
            />
            <line x1="140" y1="0" x2="115" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="240" y1="0" x2="220" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="340" y1="0" x2="325" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="440" y1="0" x2="430" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="20" y1="47" x2="525" y2="47" stroke="#E0F2FE" strokeOpacity="0.4" />
          </g>

          {/* Right Wing Solar Array Wing */}
          <g transform="translate(820, 515)">
            <polygon
              points="0,0 500,0 540,95 30,95"
              fill="url(#pvGlassGrad)"
              stroke="#93C5FD"
              strokeWidth="2"
            />
            <line x1="100" y1="0" x2="115" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="200" y1="0" x2="220" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="300" y1="0" x2="325" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="400" y1="0" x2="430" y2="95" stroke="#E0F2FE" strokeOpacity="0.4" />
            <line x1="15" y1="47" x2="520" y2="47" stroke="#E0F2FE" strokeOpacity="0.4" />
          </g>

          {/* Central Architectural Solar Structure / Cleaning Boom Hub (focal point like reference) */}
          <g transform="translate(575, 395)">
            {/* Rising Sun Behind Roof Peak */}
            <circle cx="145" cy="48" r="56" fill="#FFD21A" fillOpacity="0.88" />
            <circle cx="145" cy="48" r="78" fill="#FBAE17" fillOpacity="0.25" />

            {/* Architectural Roof Peak */}
            <polygon
              points="15,155 145,42 275,155"
              fill="#0B1933"
              stroke="#FFD21A"
              strokeWidth="3"
            />
            <rect
              x="38"
              y="155"
              width="214"
              height="125"
              rx="8"
              fill="#172D55"
              stroke="#93C5FD"
              strokeOpacity="0.5"
              strokeWidth="2"
            />

            {/* High-Efficiency Center Solar Module Matrix */}
            <polygon
              points="52,168 238,168 254,262 36,262"
              fill="#0582E8"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <line x1="98" y1="168" x2="90" y2="262" stroke="#E0F2FE" strokeOpacity="0.55" />
            <line x1="145" y1="168" x2="145" y2="262" stroke="#E0F2FE" strokeOpacity="0.55" />
            <line x1="192" y1="168" x2="200" y2="262" stroke="#E0F2FE" strokeOpacity="0.55" />
            <line x1="44" y1="215" x2="246" y2="215" stroke="#E0F2FE" strokeOpacity="0.55" />

            {/* Active Horizontal Solar / Cleaning Bar Spanning Outward */}
            <rect x="-460" y="206" width="1210" height="8" rx="4" fill="#FBAE17" />
            <rect x="-460" y="209" width="1210" height="2" fill="#FFFBEB" />

            {visualMode === 'limpeza' && (
              <g opacity="0.85">
                {/* Water / Optical Cleaning Jets along the boom */}
                <path
                  d="M-280 214 L-295 260 M-140 214 L-150 260 M0 214 L-5 260 M145 214 L145 260 M290 214 L295 260 M430 214 L445 260 M570 214 L585 260"
                  stroke="#7DD3FC"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              </g>
            )}
          </g>

          {/* Bottom Scrim for Clean Readability of Overlay Controls */}
          <rect
            y="590"
            width="1440"
            height="170"
            fill="url(#groundGrad)"
            fillOpacity="0.78"
          />
        </svg>
      </div>

      {/* Centered Editorial Content Overlay (matching reference typography & CTA layout) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-10 text-center flex flex-col items-center space-y-6">
        <p className="hero-animate-item text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          {COMPANY_CONFIG.legalDescriptor} · {HERO_CONTENT.kicker}
        </p>

        <h1
          className="hero-animate-item font-display font-bold text-white tracking-tight leading-[1.08] max-w-4xl"
          style={{ fontSize: 'clamp(2.35rem, 4.6vw, 4.1rem)' }}
        >
          {HERO_CONTENT.headline}
        </h1>

        <p className="hero-animate-item text-sm sm:text-base text-slate-100/95 max-w-2xl leading-relaxed">
          {HERO_CONTENT.subheadline}
        </p>

        {/* Centered White Pill CTA + Secondary Service Link */}
        <div className="hero-animate-item pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('click_whatsapp_hero', {
                interest: activeInterestForWhatsApp,
              })
            }
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-[#0B1933] bg-white hover:bg-[#FFD21A] rounded-full shadow-xl transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>{HERO_CONTENT.primaryCta}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>

          <a
            href="#servicos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0B1933]/55 hover:bg-[#0B1933]/80 backdrop-blur-xs border border-white/25 rounded-full transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>{HERO_CONTENT.secondaryCta}</span>
          </a>
        </div>
      </div>

      {/* Bottom Docked Interactive Mode Bar inside Hero Horizon */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-8 pt-24">
        <div className="rounded-2xl bg-[#0B1933]/85 backdrop-blur-md border border-white/15 px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0">
              <img
                src={COMPANY_CONFIG.logoPath}
                alt="Símbolo oficial da M&T Serviços"
                width={36}
                height={36}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white font-display">
                Diagnóstico por Serviço · {visualMode === 'instalacao' ? 'Projeto Solar' : 'Limpeza Técnica'}
              </p>
              <p className="text-xs text-slate-300">
                {visualMode === 'instalacao'
                  ? 'Avaliamos sua conta de luz e estrutura de telhado para novos projetos.'
                  : 'Remoção segura de poeira, fuligem e resíduos para painéis já instalados.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Alternar visualização de serviço"
              className="flex items-center gap-1 p-1 bg-white/10 rounded-full border border-white/10"
            >
              <button
                type="button"
                onClick={() => {
                  setVisualMode('instalacao');
                  onSelectInterest('instalacao', false);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  visualMode === 'instalacao'
                    ? 'bg-[#FFD21A] text-[#0B1933]'
                    : 'text-slate-200 hover:text-white'
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
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  visualMode === 'limpeza'
                    ? 'bg-[#FFD21A] text-[#0B1933]'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                02. Limpeza
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSelectInterest(visualMode, true)}
              className="text-xs font-bold text-[#FFD21A] hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer px-2 py-1"
            >
              {visualMode === 'instalacao' ? 'Avaliar instalação →' : 'Agendar limpeza →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
