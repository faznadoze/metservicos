import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  PROCESS_STEPS,
  COMMITMENT_ITEMS,
  ServiceInterest,
} from '../content/landingPage';

interface BenefitsAndProcessProps {
  onSelectInterest?: (interest: ServiceInterest) => void;
}

export const BenefitsAndProcess: React.FC<BenefitsAndProcessProps> = ({
  onSelectInterest,
}) => {
  const [cleanPassPct, setCleanPassPct] = useState<number>(65);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);

  return (
    <section
      id="como-funciona"
      className="py-24 bg-[#050A14] text-white border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Centered Header (matching the dark "AGRICULTURAL ARTICLES / Stay informed..." section in reference) */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#4ADE80]">
            COMO FUNCIONA E COMPROMISSO TÉCNICO
          </p>
          <h2
            className="font-display font-bold text-white tracking-tight leading-[1.12]"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)' }}
          >
            Acompanhe cada etapa do atendimento com transparência e cuidado técnico na M&amp;T Serviços.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Do primeiro chamado pelo WhatsApp até a execução no seu telhado, você sabe exatamente o
            que será feito, sem promessas irreais e com respeito total ao seu imóvel.
          </p>
        </div>

        {/* 3-Column Dark Visual Cards Grid (matching the 3 cards in the dark section of the reference) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMMITMENT_ITEMS.map((item, idx) => (
            <article
              key={item.code}
              onMouseEnter={() => setActiveCardIdx(idx)}
              className="group flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* 16:9 Rounded Visual Scene Header */}
                <div className="relative h-52 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1933]">
                  {idx === 0 && (
                    <svg
                      viewBox="0 0 360 220"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      role="img"
                      aria-label="Análise de irradiação solar e perfil de consumo"
                    >
                      <rect width="360" height="220" fill="#0B1933" />
                      <circle cx="290" cy="50" r="65" fill="#FBAE17" fillOpacity="0.22" />
                      <circle cx="290" cy="50" r="32" fill="#FFD21A" />
                      <path
                        d="M25 180 Q110 95 190 130 T335 70"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="3.5"
                      />
                      <g fill="#0582E8" opacity="0.45">
                        <rect x="45" y="145" width="32" height="50" rx="4" />
                        <rect x="95" y="120" width="32" height="75" rx="4" />
                        <rect x="145" y="105" width="32" height="90" rx="4" />
                        <rect x="195" y="88" width="32" height="107" rx="4" />
                        <rect x="245" y="72" width="32" height="123" rx="4" />
                      </g>
                    </svg>
                  )}

                  {idx === 1 && (
                    <svg
                      viewBox="0 0 360 220"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      role="img"
                      aria-label="Procedimento técnico de cuidado com telhado e fixação"
                    >
                      <rect width="360" height="220" fill="#112240" />
                      <polygon
                        points="30,185 180,55 330,185"
                        fill="#172D55"
                        stroke="#93C5FD"
                        strokeWidth="2"
                      />
                      <polygon
                        points="95,140 245,140 265,180 75,180"
                        fill="#0582E8"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <circle cx="180" cy="110" r="22" fill="#1E9B68" />
                      <path
                        d="M171 110 L177 116 L190 103"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    </svg>
                  )}

                  {idx === 2 && (
                    <svg
                      viewBox="0 0 360 220"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      role="img"
                      aria-label="Registro visual antes e depois da limpeza dos módulos"
                    >
                      <rect width="360" height="220" fill="#0F172A" />
                      <rect
                        x="35"
                        y="35"
                        width="290"
                        height="150"
                        rx="12"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                      <rect x="45" y="45" width="140" height="130" rx="6" fill="#0582E8" />
                      <rect x="190" y="45" width="125" height="130" rx="6" fill="#475569" />
                      <line x1="187" y1="28" x2="187" y2="192" stroke="#FFD21A" strokeWidth="3.5" />
                    </svg>
                  )}
                </div>

                {/* Metadata & Content */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-mono-tabular">
                    {item.code} <span aria-hidden="true">·</span> {item.verificationPoint}
                  </p>
                  <h3 className="font-display text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* White Pill Button (matching reference "Read More ->" pill buttons) */}
              <div className="pt-2">
                <a
                  href="#orcamento"
                  onClick={() =>
                    onSelectInterest?.(idx === 2 ? 'limpeza' : 'instalacao')
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#050A14] bg-white hover:bg-[#FFD21A] rounded-full transition-colors whitespace-nowrap"
                >
                  <span>Solicitar Orientação</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Progress Indicator Dashes (matching bottom-right of dark section in reference) */}
        <div className="flex items-center justify-between border-t border-white/10 pt-8">
          <p className="text-xs text-slate-400">
            Fluxo de atendimento em 4 etapas claras
          </p>
          <div className="flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`h-0.5 w-8 rounded-full transition-colors ${
                  activeCardIdx === idx ? 'bg-white' : 'bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4 Process Steps + Interactive Module Surface Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* 4 Process Steps (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-2xl bg-[#0B1933] border border-white/10 p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="font-mono-tabular text-xs font-bold text-[#FFD21A]">
                    ETAPA {step.stepNumber}
                  </span>
                  <h3 className="font-display text-base font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  {step.deliverable}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Surface Inspection Slider (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0B1933] border border-white/15 p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white font-display">
                Inspeção Visual da Superfície do Módulo
              </span>
              <span className="font-mono-tabular text-xs font-semibold text-[#FFD21A]">
                {cleanPassPct}% superfície limpa
              </span>
            </div>

            <div className="relative h-32 rounded-xl overflow-hidden border border-white/15 bg-[#050A14]">
              <div className="absolute inset-0 bg-[#1E293B] p-3">
                <div className="grid grid-cols-4 gap-1.5 h-full opacity-55">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xs bg-amber-900/45 border border-amber-200/20"
                    />
                  ))}
                </div>
              </div>

              <div
                className="absolute inset-y-0 left-0 bg-[#0582E8] p-3 overflow-hidden transition-all duration-75"
                style={{ width: `${cleanPassPct}%` }}
              >
                <div className="grid grid-cols-4 gap-1.5 h-full">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xs bg-[#026AA7] border border-sky-200/45"
                    />
                  ))}
                </div>
              </div>

              <div
                className="absolute inset-y-0 w-1 bg-[#FFD21A]"
                style={{ left: `calc(${cleanPassPct}% - 2px)` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] font-mono-tabular">
              <span className="text-sky-300 font-semibold">
                ← Vidro solar limpo e inspecionado
              </span>
              <span className="text-amber-300 font-medium text-right">
                Poeira e resíduos nas bordas →
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="surface-slider" className="block text-xs text-slate-300">
                Arraste o controle para comparar o módulo com resíduos vs. superfície limpa:
              </label>
              <input
                id="surface-slider"
                type="range"
                min={10}
                max={95}
                value={cleanPassPct}
                onChange={(e) => setCleanPassPct(Number(e.target.value))}
                className="w-full accent-[#FFD21A] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
