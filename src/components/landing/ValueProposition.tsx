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

  const animateAccordionLayout = contextSafe((nextAction: () => void) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const listEl = accordionListRef.current;

    if (reduceMotion || !listEl) {
      nextAction();
      return;
    }

    const targets = listEl.querySelectorAll('.vp-accordion-item');
    const state = Flip.getState(targets);

    nextAction();

    requestAnimationFrame(() => {
      const updatedTargets = listEl.querySelectorAll('.vp-accordion-item');
      Flip.from(state, {
        targets: updatedTargets,
        duration: 0.38,
        ease: 'power2.out',
        simple: true,
      });

      const expandedBody = listEl.querySelector('.vp-active-body');
      if (expandedBody) {
        gsap.fromTo(
          expandedBody,
          { autoAlpha: 0, y: 6, filter: 'blur(1.5px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.26, ease: 'power2.out' }
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
    <section id="beneficios" ref={sectionRef} className="bg-white px-0 py-16 md:p-16">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-16 md:gap-24 px-6">
        <h2 className="vp-reveal max-w-[896px] text-[30px] md:text-[48px] font-semibold leading-[1.1] md:leading-[48px] tracking-[-1.2px] text-[#111827]">
          Entregamos soluções de energia solar e conservação adaptadas ao seu imóvel, garantindo{' '}
          <span ref={statementHighlightRef} className="text-[#9ca3af]">
            um processo explicado sem complicação, segurança técnica e cuidado real com o seu patrimônio.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div role="tablist" className="vp-reveal md:col-span-3 flex flex-col items-start gap-3 pt-2">
            {(
              [
                ['residencias', '// Para Residências'],
                ['comercio', '// Comércios e Área Rural'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={audience === key}
                onClick={() => handleAudienceChange(key)}
                className={`cursor-pointer text-left font-mono text-sm leading-5 py-1 px-2 rounded-lg active:scale-[0.98] transition-[color,background-color,transform] duration-150 ease-out ${
                  audience === key ? 'font-bold text-[#111827] bg-slate-100/80' : 'text-[#9ca3af] hover:text-[#4b5563]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div ref={accordionListRef} className="vp-reveal md:col-span-9 flex flex-col gap-6">
            <h3 className="text-xl font-bold leading-7 text-[#111827]">Por que cuidar do sistema fotovoltaico?</h3>
            {items.map((item, i) => {
              const isOpen = open === i;
              const n = String(i + 1).padStart(2, '0');
              return isOpen ? (
                <div
                  key={`${audience}-${item.title}`}
                  data-flip-id={`vp-item-${i}`}
                  className="vp-accordion-item flex flex-col gap-[7px] rounded-2xl bg-[#b7dcfb] px-7 py-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-200"
                >
                  <div className="flex items-center justify-between text-base font-bold leading-6 text-[#111827]">
                    <div className="flex items-center gap-3">
                      <span>{n}</span>
                      <span>{item.title}</span>
                    </div>
                    <img src="/assets/figma/chevron.svg" alt="" width={20} height={20} className="rotate-180 opacity-70 transition-transform duration-200" />
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
                  className="vp-accordion-item group flex cursor-pointer items-center justify-between border-b border-[#e5e7eb] pt-5 pb-[21px] text-left hover:border-[#9ca3af] active:scale-[0.99] transition-[border-color,transform] duration-150 ease-out"
                >
                  <span className="flex items-center gap-4 text-base font-bold leading-6 text-[#111827]">
                    <span>{n}</span>
                    <span>{item.title}</span>
                  </span>
                  <img src="/assets/figma/chevron.svg" alt="" width={20} height={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
