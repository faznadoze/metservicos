import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Shield, Eye, Compass, CheckCircle2 } from 'lucide-react';
import {
  WHY_CARE_ITEMS,
  PROCESS_STEPS,
  COMMITMENT_ITEMS,
} from '../content/landingPage';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const BenefitsAndProcess: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Interactive optical inspection comparison slider (0 to 100%)
  const [cleanPassPct, setCleanPassPct] = useState<number>(65);

  useGSAP(
    () => {
      if (prefersReducedMotion || !progressLineRef.current) return;

      gsap.fromTo(
        progressLineRef.current,
        { scaleX: 0.15 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#como-funciona',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const benefitIcons = [Shield, Eye, Compass, CheckCircle2];

  return (
    <div ref={sectionRef}>
      {/* Section 3.6: Por que cuidar do sistema? */}
      <section id="beneficios" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Intro + Interactive Surface Inspection Comparison */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
                  Patrimônio e Eficiência <span aria-hidden="true">·</span> Cuidado Técnico
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#17202F] tracking-tight">
                  Por que cuidar do sistema fotovoltaico com regularidade?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Painéis solares ficam expostos 365 dias por ano a poeira, fuligem, folhas e
                  umidade. Manter a superfície limpa e inspecionada preserva a captação de luz e
                  ajuda a detectar pequenos pontos de atenção antes que virem problemas.
                </p>
              </div>

              {/* Interactive Before/After Surface Inspection Simulator */}
              <div className="rounded-2xl bg-[#F7F9FC] border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#17202F] font-display">
                    Inspeção Visual da Superfície do Módulo
                  </span>
                  <span className="font-mono-tabular text-xs font-semibold text-[#0582E8]">
                    {cleanPassPct}% superfície limpa
                  </span>
                </div>

                {/* Visual Diagram of Solar Module Surface */}
                <div className="relative h-32 rounded-xl overflow-hidden border border-slate-300 bg-[#0B1933]">
                  {/* Base Layer: Dirty / Soiled Module Surface */}
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

                  {/* Clipped Layer: Cleaned Optical Glass Surface */}
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

                  {/* Divider Bar */}
                  <div
                    className="absolute inset-y-0 w-1 bg-[#FFD21A]"
                    style={{ left: `calc(${cleanPassPct}% - 2px)` }}
                  />
                </div>

                {/* Unclipped Legend Row */}
                <div className="flex items-center justify-between gap-4 text-[11px] font-mono-tabular">
                  <span className="text-[#0582E8] font-semibold">
                    ← Vidro solar limpo e inspecionado
                  </span>
                  <span className="text-amber-800 font-medium text-right">
                    Poeira e resíduos nas bordas →
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="surface-slider"
                    className="block text-xs text-slate-600"
                  >
                    Arraste o controle para comparar o módulo com resíduos vs. superfície limpa:
                  </label>
                  <input
                    id="surface-slider"
                    type="range"
                    min={10}
                    max={95}
                    value={cleanPassPct}
                    onChange={(e) => setCleanPassPct(Number(e.target.value))}
                    className="w-full accent-[#172D55] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right 4 Narrative Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_CARE_ITEMS.map((item, idx) => {
                const IconComponent = benefitIcons[idx % benefitIcons.length];
                return (
                  <article
                    key={item.number}
                    className="rounded-2xl bg-[#F7F9FC] border border-slate-200 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-xs font-semibold text-[#0582E8]">
                          {item.number}.
                        </span>
                        <IconComponent
                          aria-hidden="true"
                          className="w-4 h-4 text-[#172D55]"
                        />
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#17202F]">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-800">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3.7: Como funciona */}
      <section
        id="como-funciona"
        className="py-20 bg-[#0B1933] text-white border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold text-[#FFD21A] tracking-wide">
              Processo Simples em 4 Etapas
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como funciona o atendimento da MeT Serviços
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Do primeiro contato no WhatsApp até a conclusão no seu imóvel, você acompanha cada
              passo com clareza.
            </p>
          </div>

          {/* Animated Connection Line on Desktop */}
          <div className="hidden lg:block relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressLineRef}
              className="h-full w-full bg-[#FFD21A] origin-left"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-2xl bg-[#172D55] border border-white/10 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="font-mono-tabular text-xs font-bold text-[#FFD21A]">
                    ETAPA {step.stepNumber}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-300">{step.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3.8: Nosso Compromisso (Transparência e Confiança Técnica) */}
      <section className="py-20 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
              Nosso Compromisso Técnico <span aria-hidden="true">·</span> Transparência Comercial
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#17202F] tracking-tight">
              Orientação séria, respeito ao seu imóvel e zero promessas artificiais.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Energia solar é um investimento de longo prazo. Por isso, trabalhamos apenas com
              avaliações reais de cada telhado e histórico de consumo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMITMENT_ITEMS.map((item) => (
              <article
                key={item.code}
                className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                    {item.code}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#17202F]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-[#172D55]">
                  {item.verificationPoint}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
