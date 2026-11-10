import React, { useState } from 'react';
import { Check, MessageCircle, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { SERVICES_CONTENT, ServiceInterest } from '../content/landingPage';
import { buildServiceWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import {
  evaluateSolarScenario,
  SolarScenarioInput,
} from '../lib/validation';

interface ServicesSectionProps {
  selectedInterest: ServiceInterest;
  onSelectServiceForForm: (interest: ServiceInterest, prefillNote?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedInterest,
  onSelectServiceForForm,
}) => {
  const [scenarioInput, setScenarioInput] = useState<SolarScenarioInput>({
    goal: 'instalar',
    propertyType: 'residencial',
    conditionOrBill: 'medio',
  });

  const recommendation = evaluateSolarScenario(scenarioInput);

  const handleServiceCardClick = (serviceId: 'instalacao' | 'limpeza') => {
    if (serviceId === 'instalacao') {
      trackEvent('click_service_installation');
    } else {
      trackEvent('click_service_cleaning');
    }
    onSelectServiceForForm(serviceId);
  };

  return (
    <section id="servicos" className="py-20 bg-[#F7F9FC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-14">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
            Soluções Fotovoltaicas <span aria-hidden="true">·</span> Instalação e Conservação
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#17202F] tracking-tight">
            Dois serviços essenciais para quem quer gerar energia ou proteger o sistema atual.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Escolha a frente ideal para o momento do seu imóvel. Atendemos desde o projeto inicial
            até a limpeza periódica dos módulos com orientação transparente.
          </p>
        </div>

        {/* Two Main Service Cards (Asymmetric Split Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {SERVICES_CONTENT.map((service) => {
            const isInstallation = service.id === 'instalacao';
            const isSelected = selectedInterest === service.id;
            const whatsappUrl = buildServiceWhatsAppUrl(service.whatsappPreset);

            return (
              <article
                key={service.id}
                className={`lg:col-span-6 rounded-2xl p-8 flex flex-col justify-between transition-all border ${
                  isInstallation
                    ? 'bg-[#172D55] text-white border-[#172D55]'
                    : 'bg-white text-[#17202F] border-slate-200'
                } ${isSelected ? 'ring-2 ring-[#F5A900]' : ''}`}
              >
                <div className="space-y-6">
                  {/* Editorial Index & Unboxed Metadata */}
                  <div className="flex items-center justify-between gap-4 border-b pb-4 border-current/10">
                    <span
                      className={`font-mono-tabular text-xs font-semibold ${
                        isInstallation ? 'text-[#FFD21A]' : 'text-[#0582E8]'
                      }`}
                    >
                      {service.indexNumber}. {service.title}
                    </span>
                    <span
                      className={`text-xs ${
                        isInstallation ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {service.tagLabel}
                    </span>
                  </div>

                  {/* Headline & Copy */}
                  <div className="space-y-3">
                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold leading-snug ${
                        isInstallation ? 'text-white' : 'text-[#17202F]'
                      }`}
                    >
                      {service.headline}
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        isInstallation ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2.5 pt-2">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isInstallation ? 'text-[#FFD21A]' : 'text-[#1E9B68]'
                          }`}
                        />
                        <span className={isInstallation ? 'text-slate-100' : 'text-slate-700'}>
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Technical Highlights Strip */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t ${
                      isInstallation ? 'border-white/10' : 'border-slate-200'
                    }`}
                  >
                    {service.technicalHighlights.map((hl) => (
                      <div key={hl.label} className="space-y-0.5">
                        <p
                          className={`text-[11px] ${
                            isInstallation ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {hl.label}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            isInstallation ? 'text-white' : 'text-[#17202F]'
                          }`}
                        >
                          {hl.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-8 mt-8 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleServiceCardClick(service.id)}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isInstallation
                        ? 'bg-[#FFD21A] text-[#0B1933] hover:bg-[#F5A900]'
                        : 'bg-[#172D55] text-white hover:bg-[#0B1933]'
                    }`}
                  >
                    <span>{service.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent(
                        isInstallation
                          ? 'click_service_installation'
                          : 'click_service_cleaning',
                        { channel: 'whatsapp_direct' }
                      )
                    }
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 whitespace-nowrap shrink-0 ${
                      isInstallation
                        ? 'text-slate-200 hover:text-[#FFD21A]'
                        : 'text-[#172D55] hover:text-[#0582E8]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Scenario Configurator ("Avaliador Rápido de Cenário") */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0582E8]">
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>Orientação Rápida por Cenário</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#17202F]">
                  Configure o perfil do seu imóvel para ver a recomendação técnica
                </h3>
              </div>

              {/* Step 1: Goal */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  1. Qual é a sua necessidade principal hoje?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setScenarioInput((prev) => ({ ...prev, goal: 'instalar' }))
                    }
                    className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg border text-left transition-colors cursor-pointer ${
                      scenarioInput.goal === 'instalar'
                        ? 'bg-[#172D55] text-white border-[#172D55]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Instalar painéis solares do zero
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setScenarioInput((prev) => ({ ...prev, goal: 'limpar' }))
                    }
                    className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg border text-left transition-colors cursor-pointer ${
                      scenarioInput.goal === 'limpar'
                        ? 'bg-[#172D55] text-white border-[#172D55]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Limpar / avaliar sistema já instalado
                  </button>
                </div>
              </div>

              {/* Step 2: Property Type */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  2. Tipo de imóvel:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['residencial', 'comercial', 'rural'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setScenarioInput((prev) => ({ ...prev, propertyType: type }))
                      }
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer whitespace-nowrap ${
                        scenarioInput.propertyType === type
                          ? 'bg-[#FFD21A] text-[#0B1933] border-[#F5A900]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Intensity / Condition */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  {scenarioInput.goal === 'instalar'
                    ? '3. Perfil de uso de energia no local:'
                    : '3. Condição visual atual das placas:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        key: 'baixo',
                        label:
                          scenarioInput.goal === 'instalar'
                            ? 'Consumo leve'
                            : 'Pouca poeira',
                      },
                      {
                        key: 'medio',
                        label:
                          scenarioInput.goal === 'instalar'
                            ? 'Consumo médio'
                            : 'Sujeira visível',
                      },
                      {
                        key: 'alto',
                        label:
                          scenarioInput.goal === 'instalar'
                            ? 'Uso intenso'
                            : 'Acúmulo forte',
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setScenarioInput((prev) => ({
                          ...prev,
                          conditionOrBill: item.key,
                        }))
                      }
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        scenarioInput.conditionOrBill === item.key
                          ? 'bg-[#172D55] text-white border-[#172D55]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Output Box */}
            <div className="lg:col-span-6 rounded-xl bg-[#F7F9FC] border border-slate-200 p-6 space-y-4">
              <p className="text-xs font-semibold text-[#0582E8]">
                {recommendation.badgeText}
              </p>
              <h4 className="font-display text-lg font-bold text-[#17202F]">
                {recommendation.headline}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {recommendation.summary}
              </p>
              <ul className="space-y-1.5 pt-1">
                {recommendation.nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-[#1E9B68] mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() =>
                    onSelectServiceForForm(
                      recommendation.recommendedInterest,
                      `${recommendation.badgeText} — ${recommendation.headline}`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{recommendation.ctaLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
