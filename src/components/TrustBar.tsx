import React from 'react';
import { Sun, ShieldCheck, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { TRUST_BAR_ITEMS } from '../content/landingPage';

export const TrustBar: React.FC = () => {
  const icons = [Sun, Compass, Sparkles, ShieldCheck, CheckCircle2];

  return (
    <section
      aria-label="Diferenciais de confiança"
      className="bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-6 py-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Caption (matching reference "Trusted by thousand..." block) */}
          <p className="text-xs text-slate-400 font-medium leading-snug max-w-[220px] shrink-0">
            Atendimento técnico de confiança para residências, comércios e áreas rurais
          </p>

          {/* Right Horizontal Trust Marks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
            {TRUST_BAR_ITEMS.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={item.index}
                  className="flex items-center gap-2.5 text-slate-500 hover:text-[#0B1933] transition-colors"
                >
                  <Icon aria-hidden="true" className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <h2 className="font-display text-sm font-bold text-slate-700 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
