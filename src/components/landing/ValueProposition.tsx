import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText);

type Audience = 'residencias' | 'comercio';

const ITEMS: Record<Audience, { title: string; body: string }[]> = {
  residencias: [
    {
      title: 'Preserve seu investimento',
      body: 'O sistema fotovoltaico merece manutenção compatível com sua importância. Módulos expostos ao tempo acumulam partículas aderentes que a chuva comum não remove por completo, especialmente nas bordas inferiores do quadro.',
    },
    {
      title: 'Acompanhe a condição dos módulos',
      body: 'Com inspeções periódicas e registro fotográfico, você sabe exatamente como estão as placas, a fixação e o cabeamento — sem precisar subir no telhado.',
    },
    {
      title: 'Evite decisões no escuro',
      body: 'Antes de qualquer intervenção, explicamos o que foi observado e o que realmente precisa ser feito, sem promessas irreais de geração.',
    },
    {
      title: 'Tenha orientação de verdade',
      body: 'Uma equipe técnica disponível para tirar dúvidas sobre desempenho, limpeza e ampliação do seu sistema.',
    },
  ],
  comercio: [
    {
      title: 'Reduza custos operacionais',
      body: 'Para comércios e propriedades rurais, cada ponto de eficiência perdido pesa na conta. Sistemas bem conservados mantêm a geração próxima do potencial do projeto.',
    },
    {
      title: 'Planeje manutenções sem parar a operação',
      body: 'Agendamos limpezas e inspeções em horários que respeitam a rotina do seu negócio ou da sua lavoura.',
    },
    {
      title: 'Atenção a ambientes com mais poeira',
      body: 'Áreas rurais e industriais acumulam resíduos mais rápido. Indicamos a frequência adequada para o seu cenário.',
    },
    {
      title: 'Projetos dimensionados para crescer',
      body: 'Avaliamos estrutura e consumo para que o sistema acompanhe a expansão do seu negócio.',
    },
  ],
};

export function ValueProposition() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementHighlightRef = useRef<HTMLSpanElement>(null);
  const accordionListRef = useRef<HTMLDivElement>(null);

  const [audience, setAudience] = useState<Audience>('residencias');
  const [open, setOpen] = useState(0);
  const items = ITEMS[audience];

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isAny: 'all',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          if (ctx.conditions?.reduceMotion) return;

          // Scroll-scrubbed word-by-word highlight on the secondary editorial statement
          if (statementHighlightRef.current) {
            SplitText.create(statementHighlightRef.current, {
              type: 'words',
              autoSplit: true,
              onSplit(self) {
                return gsap.fromTo(
                  self.words,
                  { color: '#9ca3af' },
                  {
                    color: '#374151',
                    stagger: 0.08,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: statementHighlightRef.current,
                      start: 'top 80%',
                      end: 'bottom 45%',
                      scrub: 0.6,
                    },
                  }
                );
              },
            });
          }

          // Reveal the tablist + accordion container when entering viewport
          gsap.from('.vp-reveal', {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: accordionListRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const tabListRef = useRef<HTMLDivElement>(null);

  const animateAccordionLayout = contextSafe((nextAction: () => void) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const listEl = accordionListRef.current;
    const tabPillEl = tabListRef.current?.querySelector('.vp-tab-active-pill');

    if (reduceMotion || !listEl) {
      nextAction();
      return;
    }

    const targets = listEl.querySelectorAll('.vp-accordion-item');
    const state = Flip.getState(targets);
    const tabState = tabPillEl ? Flip.getState(tabPillEl) : null;

    nextAction();

    requestAnimationFrame(() => {
      if (tabState && tabListRef.current) {
        const nextTabPill = tabListRef.current.querySelector('.vp-tab-active-pill');
        if (nextTabPill) {
          Flip.from(tabState, {
            targets: nextTabPill,
            duration: 0.24,
            ease: 'power3.out',
            absolute: true,
          });
        }
      }

      const updatedTargets = listEl.querySelectorAll('.vp-accordion-item');
      Flip.from(state, {
        targets: updatedTargets,
        duration: 0.28,
        ease: 'power3.out',
        simple: true,
      });

      const expandedBody = listEl.querySelector('.vp-active-body');
      if (expandedBody) {
        gsap.fromTo(
          expandedBody,
          { autoAlpha: 0, y: 6, filter: 'blur(2px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' }
        );
      }
    });
  });

  const handleAudienceChange = (nextAudience: Audience) => {
    if (nextAudience === audience) return;
    animateAccordionLayout(() => {
      setAudience(nextAudience);
      setOpen(0);
    });
  };

  const handleOpenChange = (index: number) => {
    if (index === open) return;
    animateAccordionLayout(() => {
      setOpen(index);
    });
  };

  return (
    <section id="beneficios" ref={sectionRef} className="bg-white px-0 py-14 md:p-16">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-12 md:gap-24 px-5 sm:px-6">
        <h2 className="vp-reveal max-w-[896px] text-[28px] sm:text-[32px] md:text-[48px] font-semibold leading-[1.14] md:leading-[48px] tracking-[-1px] md:tracking-[-1.2px] text-[#111827]">
          Entregamos soluções de energia solar e conservação adaptadas ao seu imóvel, garantindo{' '}
          <span ref={statementHighlightRef} className="text-[#9ca3af]">
            um processo explicado sem complicação, segurança técnica e cuidado real com o seu patrimônio.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Perfil de imóvel"
            className="vp-reveal md:col-span-3 grid grid-cols-2 md:flex md:flex-col items-stretch md:items-start gap-1.5 md:gap-3 rounded-xl bg-slate-100/90 p-1 md:bg-transparent md:p-0 md:pt-2"
          >
            {(
              [
                ['residencias', '01 · Para Residências', 'Para Residências'],
                ['comercio', '02 · Comércios e Rural', 'Comércios e Rural'],
              ] as const
            ).map(([key, desktopLabel, mobileLabel]) => {
              const isSelected = audience === key;
              return (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleAudienceChange(key)}
                  className={`relative flex min-h-[44px] md:min-h-0 cursor-pointer items-center justify-center md:justify-start text-center md:text-left font-mono text-xs sm:text-sm leading-5 py-2 md:py-1.5 px-3 md:px-2.5 rounded-lg active:scale-[0.97] transition-[color,transform] duration-150 ease-emil-out whitespace-nowrap ${
                    isSelected
                      ? 'font-bold text-[#111827]'
                      : 'text-[#6b7280] md:text-[#9ca3af] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#374151]'
                  }`}
                >
                  {isSelected && (
                    <span
                      data-flip-id="vp-audience-pill"
                      className="vp-tab-active-pill absolute inset-0 rounded-lg bg-white md:bg-slate-100/90 shadow-xs md:shadow-none"
                    />
                  )}
                  <span className="relative z-10 md:hidden">{mobileLabel}</span>
                  <span className="relative z-10 hidden md:inline">{desktopLabel}</span>
                </button>
              );
            })}
          </div>

          <div ref={accordionListRef} className="vp-reveal md:col-span-9 flex flex-col gap-4 md:gap-6">
            <h3 className="text-lg sm:text-xl font-bold leading-7 text-[#111827]">
              Por que cuidar do sistema fotovoltaico?
            </h3>
            {items.map((item, i) => {
              const isOpen = open === i;
              const n = String(i + 1).padStart(2, '0');
              return isOpen ? (
                <div
                  key={`${audience}-${item.title}`}
                  data-flip-id={`vp-item-${i}`}
                  className="vp-accordion-item flex flex-col gap-2 rounded-2xl bg-[#b7dcfb] px-5 sm:px-7 py-5 sm:py-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-200 ease-emil-out"
                >
                  <div className="flex items-center justify-between gap-3 text-base font-bold leading-6 text-[#111827]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tabular">{n}</span>
                      <span>{item.title}</span>
                    </div>
                    <img
                      src="/assets/figma/chevron.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="rotate-180 opacity-70 shrink-0 transition-transform duration-200 ease-emil-out"
                    />
                  </div>
                  <p className="vp-active-body text-sm leading-[22.75px] text-[#1f2937]">{item.body}</p>
                </div>
              ) : (
                <button
                  key={`${audience}-${item.title}`}
                  data-flip-id={`vp-item-${i}`}
                  type="button"
                  aria-expanded={false}
                  onClick={() => handleOpenChange(i)}
                  className="vp-accordion-item group flex min-h-[54px] cursor-pointer items-center justify-between gap-3 border-b border-[#e5e7eb] pt-4 pb-4 text-left [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#9ca3af] active:scale-[0.985] transition-[border-color,transform] duration-150 ease-emil-out"
                >
                  <span className="flex items-center gap-3 sm:gap-4 text-base font-bold leading-6 text-[#111827]">
                    <span className="font-mono-tabular">{n}</span>
                    <span>{item.title}</span>
                  </span>
                  <img
                    src="/assets/figma/chevron.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0 transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
