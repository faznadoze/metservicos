import React from 'react';
import { TRUST_BAR_ITEMS } from '../content/landingPage';

export const TrustBar: React.FC = () => {
  return (
    <section
      aria-label="Diferenciais de confiança"
      className="bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_BAR_ITEMS.map((item) => (
            <div
              key={item.index}
              className="flex flex-col justify-between space-y-2 border-t border-slate-200 pt-4 sm:border-t-0 sm:pt-0"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-tabular text-xs font-semibold text-[#0582E8]">
                  {item.index}.
                </span>
                <h2 className="font-display text-sm font-bold text-[#17202F]">
                  {item.title}
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
