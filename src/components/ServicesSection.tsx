import React, { useState } from 'react';
import {
  Check,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import {
  SERVICES_CONTENT,
  WHY_CARE_ITEMS,
  ServiceInterest,
} from '../content/landingPage';
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
  const [audienceFilter, setAudienceFilter] = useState<'todos' | 'empresas'>('todos');
  const [openBenefitIndex, setOpenBenefitIndex] = useState<number>(0);

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

  const visualShowcaseCards = [
    {
      id: 'card-instalacao',
      serviceId: 'instalacao' as const,
      title: 'Instalação de Painéis Solares',
      description:
        'Avaliamos o local, entendemos o seu consumo e orientamos a solução mais adequada para o seu imóvel.',
      ctaLabel: 'Quero avaliar meu projeto solar',
      sceneType: 'instalacao',
    },
    {
      id: 'card-limpeza',
      serviceId: 'limpeza' as const,
      title: 'Limpeza de Sistemas Fotovoltaicos',
      description:
        'Remoção cuidadosa de poeira, folhas e poluição para manter a superfície pronta para receber o sol.',
      ctaLabel: 'Agendar limpeza do meu sistema',
      sceneType: 'limpeza',
    },
    {
      id: 'card-inspecao',
      serviceId: 'limpeza' as const,
      title: 'Conservação e Inspeção Visual',
      description:
        'Identificação visual de possíveis anormalidades, sombreamentos novos e estado de conservação dos módulos.',
      ctaLabel: 'Solicitar avaliação visual',
      sceneType: 'inspecao',
    },
    {
      id: 'card-dimensionamento',
      serviceId: 'instalacao' as const,
      title: 'Projetos Residenciais e Comerciais',
      description:
        'Dimensionamento conforme a necessidade do cliente com orientação clara sobre equipamentos e etapas.',
      ctaLabel: 'Avaliar viabilidade do imóvel',
      sceneType: 'dimensionamento',
    },
  ];

  return (
    <section id="servicos" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Part 1: Reference Dual-Tone Editorial Statement */}
        <div className="max-w-5xl">
          <h2
            className="font-display font-bold tracking-tight leading-[1.18]"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)' }}
          >
            <span className="text-[#0B1933]">
              Entregamos soluções de energia solar e conservação adaptadas ao seu imóvel, garantindo{' '}
            </span>
            <span className="text-slate-300">
              um processo explicado sem complicação, segurança técnica e cuidado real com o seu patrimônio.
            </span>
          </h2>
        </div>

        {/* Part 2: Reference Asymmetric Left Filter + Right Highlight Accordion */}
        <div id="beneficios" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Filter Column (3 cols) */}
          <div className="lg:col-span-3 flex lg:flex-col gap-3">
            <button
              type="button"
              onClick={() => setAudienceFilter('todos')}
              className={`text-left text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                audienceFilter === 'todos'
                  ? 'text-[#0B1933] bg-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Para Residências
            </button>
            <button
              type="button"
              onClick={() => setAudienceFilter('empresas')}
              className={`text-left text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                audienceFilter === 'empresas'
                  ? 'text-[#0B1933] bg-slate-100'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Comércios e Área Rural
            </button>
          </div>

          {/* Right Accordion Column (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            <div className="pb-2">
              <h3 className="font-display text-base font-bold text-[#0B1933]">
                {audienceFilter === 'todos'
                  ? 'Por que cuidar do sistema e planejar com quem entende'
                  : 'Cuidado técnico para comércios, galpões e propriedades rurais'}
              </h3>
            </div>

            <div className="divide-y divide-slate-200 border-b border-slate-200">
              {WHY_CARE_ITEMS.map((item, idx) => {
                const isExpanded = openBenefitIndex === idx;
                return (
                  <div key={item.number} className="py-3">
                    {isExpanded ? (
                      <div className="rounded-2xl bg-[#EEF6C8] border border-[#D9E895] p-6 space-y-2 transition-all">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-display text-sm font-bold text-[#17202F]">
                            {item.number} · {item.title}
                          </span>
                          <span className="text-xs font-medium text-slate-600">
                            {audienceFilter === 'todos' ? 'Residencial & Urbano' : 'Comercial & Rural'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#17202F]">
                          {item.description}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenBenefitIndex(idx)}
                        className="w-full py-3.5 px-2 flex items-center justify-between gap-4 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono-tabular text-sm font-bold text-slate-500">
                            {item.number}
                          </span>
                          <span className="font-display text-base font-bold text-[#0B1933]">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Part 3: Reference Horizontal Row of 4 Rounded Visual Cards */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
                Nossas Frentes de Atuação
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1933] tracking-tight mt-1">
                Escolha o serviço ideal para o momento do seu sistema
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visualShowcaseCards.map((card) => (
              <article
                key={card.id}
                className="group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Rounded 4:3 Visual Artwork Container (matching reference image cards) */}
                  <div className="relative h-52 rounded-2xl overflow-hidden border border-slate-200/80 bg-[#0B1933]">
                    {card.sceneType === 'instalacao' && (
                      <svg
                        viewBox="0 0 320 220"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        role="img"
                        aria-label="Ilustração de instalação de painéis solares em telhado"
                      >
                        <defs>
                          <linearGradient id="c1Sky" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1E56A0" />
                            <stop offset="100%" stopColor="#76A5DF" />
                          </linearGradient>
                        </defs>
                        <rect width="320" height="220" fill="url(#c1Sky)" />
                        <circle cx="250" cy="52" r="32" fill="#FFD21A" />
                        <circle cx="250" cy="52" r="48" fill="#FFD21A" fillOpacity="0.22" />
                        <polygon points="10,220 140,85 300,220" fill="#172D55" />
                        <polygon
                          points="75,135 215,135 245,205 55,205"
                          fill="#0582E8"
                          stroke="#E0F2FE"
                          strokeWidth="2"
                        />
                        <line x1="122" y1="135" x2="118" y2="205" stroke="#BAE6FD" strokeOpacity="0.6" />
                        <line x1="168" y1="135" x2="180" y2="205" stroke="#BAE6FD" strokeOpacity="0.6" />
                        <line x1="65" y1="170" x2="230" y2="170" stroke="#BAE6FD" strokeOpacity="0.6" />
                      </svg>
                    )}

                    {card.sceneType === 'limpeza' && (
                      <svg
                        viewBox="0 0 320 220"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        role="img"
                        aria-label="Ilustração de limpeza cuidadosa de módulos fotovoltaicos"
                      >
                        <defs>
                          <linearGradient id="c2Sky" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#0C4A6E" />
                            <stop offset="100%" stopColor="#0284C7" />
                          </linearGradient>
                        </defs>
                        <rect width="320" height="220" fill="url(#c2Sky)" />
                        <rect
                          x="28"
                          y="42"
                          width="264"
                          height="145"
                          rx="10"
                          fill="#0B1933"
                          stroke="#7DD3FC"
                          strokeWidth="2"
                        />
                        <rect x="36" y="50" width="132" height="129" fill="#0582E8" />
                        <rect x="168" y="50" width="116" height="129" fill="#334155" />
                        <line x1="168" y1="36" x2="168" y2="195" stroke="#FFD21A" strokeWidth="4" />
                        <circle cx="95" cy="95" r="4" fill="#E0F2FE" />
                        <circle cx="125" cy="120" r="3" fill="#E0F2FE" />
                        <circle cx="75" cy="140" r="3.5" fill="#E0F2FE" />
                      </svg>
                    )}

                    {card.sceneType === 'inspecao' && (
                      <svg
                        viewBox="0 0 320 220"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        role="img"
                        aria-label="Ilustração de inspeção visual de conservação dos módulos"
                      >
                        <rect width="320" height="220" fill="#132A20" />
                        <circle cx="80" cy="60" r="95" fill="#1E4631" />
                        <polygon
                          points="45,175 115,65 275,65 225,175"
                          fill="#0582E8"
                          stroke="#93C5FD"
                          strokeWidth="2"
                        />
                        <circle
                          cx="165"
                          cy="118"
                          r="28"
                          fill="none"
                          stroke="#FFD21A"
                          strokeWidth="3"
                        />
                        <path
                          d="M155 118 L162 125 L177 110"
                          stroke="#FFD21A"
                          strokeWidth="3"
                          fill="none"
                        />
                      </svg>
                    )}

                    {card.sceneType === 'dimensionamento' && (
                      <svg
                        viewBox="0 0 320 220"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        role="img"
                        aria-label="Ilustração de projeto sob medida e dimensionamento solar"
                      >
                        <rect width="320" height="220" fill="#172D55" />
                        <g stroke="#334155" strokeWidth="1">
                          <line x1="0" y1="55" x2="320" y2="55" />
                          <line x1="0" y1="110" x2="320" y2="110" />
                          <line x1="0" y1="165" x2="320" y2="165" />
                          <line x1="80" y1="0" x2="80" y2="220" />
                          <line x1="160" y1="0" x2="160" y2="220" />
                          <line x1="240" y1="0" x2="240" y2="220" />
                        </g>
                        <path
                          d="M40 165 L160 55 L280 165 Z"
                          fill="#0582E8"
                          fillOpacity="0.35"
                          stroke="#38BDF8"
                          strokeWidth="2.5"
                        />
                        <circle cx="160" cy="55" r="6" fill="#FFD21A" />
                        <circle cx="40" cy="165" r="5" fill="#FFD21A" />
                        <circle cx="280" cy="165" r="5" fill="#FFD21A" />
                      </svg>
                    )}
                  </div>

                  {/* Card Title & Copy */}
                  <div className="space-y-1.5">
                    <h4 className="font-display text-lg font-bold text-[#0B1933]">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Reference-Style Outlined Pill Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleServiceCardClick(card.serviceId)}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-[#0B1933] bg-white hover:bg-[#0B1933] hover:text-white border border-slate-300 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{card.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Part 4: Detailed Specifications for Service 01 & Service 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          {SERVICES_CONTENT.map((service) => {
            const isInstallation = service.id === 'instalacao';
            const isSelected = selectedInterest === service.id;
            const whatsappUrl = buildServiceWhatsAppUrl(service.whatsappPreset);

            return (
              <article
                key={service.id}
                className={`lg:col-span-6 rounded-3xl p-8 flex flex-col justify-between transition-all border ${
                  isInstallation
                    ? 'bg-[#F7F9FC] text-[#17202F] border-slate-200'
                    : 'bg-[#F7F9FC] text-[#17202F] border-slate-200'
                } ${isSelected ? 'ring-2 ring-[#0B1933]' : ''}`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <span className="font-mono-tabular text-xs font-bold text-[#0582E8]">
                      {service.indexNumber}. {service.title}
                    </span>
                    <span className="text-xs text-slate-500">{service.tagLabel}</span>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-display text-xl font-bold text-[#0B1933] leading-snug">
                      {service.headline}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="w-4 h-4 mt-0.5 text-[#1E9B68] shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleServiceCardClick(service.id)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0B1933] hover:bg-[#172D55] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1933] hover:text-[#0582E8] underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Part 5: Interactive Scenario Configurator */}
        <div className="rounded-3xl bg-[#F7F9FC] border border-slate-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0582E8]">
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>Orientação Rápida por Cenário</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B1933]">
                  Configure o perfil do seu imóvel para ver a recomendação técnica
                </h3>
              </div>

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
                    className={`px-4 py-2.5 text-xs font-semibold rounded-full border text-left transition-colors cursor-pointer ${
                      scenarioInput.goal === 'instalar'
                        ? 'bg-[#0B1933] text-white border-[#0B1933]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Instalar painéis solares do zero
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setScenarioInput((prev) => ({ ...prev, goal: 'limpar' }))
                    }
                    className={`px-4 py-2.5 text-xs font-semibold rounded-full border text-left transition-colors cursor-pointer ${
                      scenarioInput.goal === 'limpar'
                        ? 'bg-[#0B1933] text-white border-[#0B1933]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Limpar / avaliar sistema já instalado
                  </button>
                </div>
              </div>

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
                      className={`px-3 py-2 text-xs font-semibold rounded-full border capitalize transition-colors cursor-pointer whitespace-nowrap ${
                        scenarioInput.propertyType === type
                          ? 'bg-[#EEF6C8] text-[#0B1933] border-[#C5D86D]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

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
                      className={`px-3 py-2 text-xs font-semibold rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                        scenarioInput.conditionOrBill === item.key
                          ? 'bg-[#0B1933] text-white border-[#0B1933]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <p className="text-xs font-semibold text-[#0582E8]">
                {recommendation.badgeText}
              </p>
              <h4 className="font-display text-lg font-bold text-[#0B1933]">
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{recommendation.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
