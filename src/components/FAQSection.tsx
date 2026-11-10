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
    <section id="duvidas" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#0582E8] tracking-wide">
              Perguntas Frequentes <span aria-hidden="true">·</span> Esclareça Suas Dúvidas
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#17202F] tracking-tight">
              Respostas diretas antes de solicitar sua avaliação
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="group"
            aria-label="Filtrar perguntas por tema"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#172D55] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
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
                    <span className="font-display text-base sm:text-lg font-bold text-[#17202F] group-hover:text-[#0582E8] transition-colors">
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
    </section>
  );
};
