import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS, FAQItem } from '../content/landingPage';
import { trackEvent } from '../lib/analytics';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todas' | FAQItem['category']>('todas');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const filteredFaqs =
    activeCategory === 'todas'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const handleToggle = (id: string, question: string) => {
    const nextState = openId === id ? null : id;
    setOpenId(nextState);
    if (nextState) {
      trackEvent('faq_open', { id, question });
    }
  };

  const categories: { id: 'todas' | FAQItem['category']; label: string }[] = [
    { id: 'todas', label: 'Todas as dúvidas' },
    { id: 'instalacao', label: 'Instalação' },
    { id: 'limpeza', label: 'Limpeza' },
    { id: 'atendimento', label: 'Atendimento e Região' },
  ];

  return (
    <section id="duvidas" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* FAQ Container */}
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
                Perguntas Frequentes <span aria-hidden="true">·</span> Esclareça Suas Dúvidas
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1933] tracking-tight">
                Respostas diretas antes de solicitar sua avaliação
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filtrar perguntas por tema"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-full"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#0B1933] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-btn-${item.id}`;

              return (
                <div key={item.id} className="py-5">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => handleToggle(item.id, item.question)}
                      className="w-full flex items-center justify-between gap-4 text-left py-1 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0582E8] rounded"
                    >
                      <span className="font-display text-base sm:text-lg font-bold text-[#0B1933] group-hover:text-[#0582E8] transition-colors">
                        <span className="font-mono-tabular text-xs text-slate-400 mr-2.5">
                          0{idx + 1}.
                        </span>
                        {item.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#0582E8]' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="pt-3 pl-7 pr-4 text-sm sm:text-base text-slate-600 leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reference Panoramic Rounded Banner ("Be part of the new wave...") */}
        <div className="relative rounded-3xl overflow-hidden min-h-[290px] sm:min-h-[340px] flex items-center justify-center text-center px-6 py-16 shadow-lg">
          {/* Warm Golden-Hour Solar Close-Up Artwork Backdrop */}
          <svg
            viewBox="0 0 1280 380"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <defs>
              <linearGradient id="goldenBannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B5B1E" />
                <stop offset="45%" stopColor="#8F7828" />
                <stop offset="100%" stopColor="#1B2E51" />
              </linearGradient>
              <radialGradient id="goldenFlare" cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#FFD21A" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0B1933" stopOpacity="0.35" />
              </radialGradient>
            </defs>
            <rect width="1280" height="380" fill="url(#goldenBannerGrad)" />
            <rect width="1280" height="380" fill="url(#goldenFlare)" />
            {/* Diagonal organic solar blades / golden light rays */}
            <g fill="#D4AF37" fillOpacity="0.24" stroke="#FDE047" strokeOpacity="0.25" strokeWidth="2">
              <ellipse cx="260" cy="240" rx="180" ry="52" transform="rotate(-28 260 240)" />
              <ellipse cx="480" cy="190" rx="210" ry="58" transform="rotate(-28 480 190)" />
              <ellipse cx="720" cy="175" rx="220" ry="60" transform="rotate(-28 720 175)" />
              <ellipse cx="960" cy="210" rx="200" ry="55" transform="rotate(-28 960 210)" />
              <ellipse cx="1140" cy="250" rx="180" ry="50" transform="rotate(-28 1140 250)" />
            </g>
            <rect width="1280" height="380" fill="#0B1933" fillOpacity="0.32" />
          </svg>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2
              className="font-display font-extrabold text-white tracking-tight leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.5rem)' }}
            >
              Faça parte da nova geração de energia bem cuidada
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};
