import { useLayoutEffect, useRef, useState } from 'react';
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
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const interactiveBlockRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabResidenciasRef = useRef<HTMLButtonElement>(null);
  const tabComercioRef = useRef<HTMLButtonElement>(null);
  const tabPillRef = useRef<HTMLSpanElement>(null);
  const panelResidenciasRef = useRef<HTMLDivElement>(null);
  const panelComercioRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [audience, setAudience] = useState<Audience>('residencias');
  const [openByAudience, setOpenByAudience] = useState<Record<Audience, number>>({
    residencias: 0,
    comercio: 0,
  });

  const audienceRef = useRef<Audience>(audience);
  audienceRef.current = audience;

  const pendingAccordionFlipRef = useRef<{
    state: Flip.FlipState | null;
    audienceKey: Audience | null;
  }>({
    state: null,
    audienceKey: null,
  });

  const handleOpenChange = (audienceKey: Audience, index: number) => {
    if (openByAudience[audienceKey] === index) return;
    const panelEl = audienceKey === 'residencias' ? panelResidenciasRef.current : panelComercioRef.current;
    if (panelEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const targets = panelEl.querySelectorAll('.vp-accordion-item');
      pendingAccordionFlipRef.current = {
        state: targets.length > 0 ? Flip.getState(targets) : null,
        audienceKey,
      };
    }
    setOpenByAudience((prev) => ({ ...prev, [audienceKey]: index }));
  };

  useLayoutEffect(() => {
    const { state, audienceKey } = pendingAccordionFlipRef.current;
    if (!state || !audienceKey) return;
    pendingAccordionFlipRef.current = { state: null, audienceKey: null };

    const panelEl = audienceKey === 'residencias' ? panelResidenciasRef.current : panelComercioRef.current;
    if (!panelEl) return;

    const updatedTargets = panelEl.querySelectorAll('.vp-accordion-item');
    if (updatedTargets.length > 0) {
      Flip.from(state, {
        targets: updatedTargets,
        duration: 0.36,
        ease: 'power3.inOut',
        simple: true,
      });
    }

    const expandedBody = panelEl.querySelector('.vp-active-body');
    if (expandedBody) {
      gsap.fromTo(
        expandedBody,
        { autoAlpha: 0, y: 6, filter: 'blur(2px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.24, ease: 'power2.out' }
      );
    }
  }, [openByAudience]);

  const handleTabClick = (targetAudience: Audience) => {
    const st = scrollTriggerRef.current;
    if (st && st.vars.pin) {
      const targetScroll = targetAudience === 'residencias' ? st.start + 6 : st.end - 6;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    audienceRef.current = targetAudience;
    setAudience(targetAudience);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isAny: 'all',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (!reduceMotion) {
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

            gsap.from('.vp-reveal', {
              y: 24,
              autoAlpha: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: interactiveBlockRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            });
          }

          if (
            pinWrapperRef.current &&
            tabResidenciasRef.current &&
            tabComercioRef.current &&
            tabPillRef.current &&
            panelResidenciasRef.current &&
            panelComercioRef.current
          ) {
            const resItems = gsap.utils.toArray<HTMLElement>(
              '.vp-item-residencias',
              panelResidenciasRef.current
            );
            const comItems = gsap.utils.toArray<HTMLElement>(
              '.vp-item-comercio',
              panelComercioRef.current
            );

            if (reduceMotion) {
              gsap.set(panelResidenciasRef.current, { autoAlpha: 1 });
              gsap.set(panelComercioRef.current, { autoAlpha: 0 });
              return;
            }

            gsap.set(resItems, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
            gsap.set(comItems, { autoAlpha: 0, y: 20, filter: 'blur(4px)' });
            gsap.set(panelComercioRef.current, { autoAlpha: 1 });

            const syncPillGeometry = () => {
              const t0 = tabResidenciasRef.current;
              const pill = tabPillRef.current;
              if (!t0 || !pill) return;
              gsap.set(pill, {
                width: t0.offsetWidth,
                height: t0.offsetHeight,
                left: t0.offsetLeft,
                top: t0.offsetTop,
              });
            };

            syncPillGeometry();
            ScrollTrigger.addEventListener('refreshInit', syncPillGeometry);

            const tl = gsap.timeline({
              defaults: { ease: 'power2.inOut' },
              scrollTrigger: {
                trigger: pinWrapperRef.current,
                start: 'center center',
                end: '+=680',
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                scrub: 0.35,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const next: Audience = self.progress >= 0.5 ? 'comercio' : 'residencias';
                  if (audienceRef.current !== next) {
                    audienceRef.current = next;
                    setAudience(next);
                  }
                },
              },
            });

            scrollTriggerRef.current = tl.scrollTrigger ?? null;

            // Brief initial hold so user sees '01. Para Residências' centered before transition starts
            tl.to({}, { duration: 0.14 }, 0);

            // Scrub active pill smoothly from tab 01 to tab 02
            tl.fromTo(
              tabPillRef.current,
              {
                x: 0,
                y: 0,
                width: () => tabResidenciasRef.current?.offsetWidth ?? 0,
                height: () => tabResidenciasRef.current?.offsetHeight ?? 0,
              },
              {
                x: () =>
                  (tabComercioRef.current?.offsetLeft ?? 0) -
                  (tabResidenciasRef.current?.offsetLeft ?? 0),
                y: () =>
                  (tabComercioRef.current?.offsetTop ?? 0) -
                  (tabResidenciasRef.current?.offsetTop ?? 0),
                width: () => tabComercioRef.current?.offsetWidth ?? 0,
                height: () => tabComercioRef.current?.offsetHeight ?? 0,
                duration: 0.72,
              },
              0.14
            );

            // Scrub '01. Para Residências' items out
            tl.fromTo(
              resItems,
              {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
              },
              {
                autoAlpha: 0,
                y: -18,
                filter: 'blur(4px)',
                stagger: 0.045,
                duration: 0.38,
              },
              0.14
            );

            // Scrub '02. Comércios e Rural' items in smoothly as scroll continues
            tl.fromTo(
              comItems,
              {
                autoAlpha: 0,
                y: 18,
                filter: 'blur(4px)',
              },
              {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
                stagger: 0.045,
                duration: 0.42,
              },
              0.42
            );

            // Brief end hold so '02. Comércios e Rural' settles cleanly before unpinning
            tl.to({}, { duration: 0.14 }, 0.86);

            return () => {
              ScrollTrigger.removeEventListener('refreshInit', syncPillGeometry);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const renderAudienceItems = (audienceKey: Audience) => {
    const items = ITEMS[audienceKey];
    const openIdx = openByAudience[audienceKey];
    const itemClass = audienceKey === 'residencias' ? 'vp-item-residencias' : 'vp-item-comercio';

    return items.map((item, i) => {
      const isOpen = openIdx === i;
      const n = String(i + 1).padStart(2, '0');
      return isOpen ? (
        <div
          key={`${audienceKey}-${item.title}`}
          data-flip-id={`vp-${audienceKey}-item-${i}`}
          className={`vp-accordion-item ${itemClass} flex flex-col gap-2 rounded-2xl bg-[#b7dcfb] px-5 sm:px-7 py-5 sm:py-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-200 ease-emil-out will-change-transform`}
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
          key={`${audienceKey}-${item.title}`}
          data-flip-id={`vp-${audienceKey}-item-${i}`}
          type="button"
          aria-expanded={false}
          onClick={() => handleOpenChange(audienceKey, i)}
          className={`vp-accordion-item ${itemClass} group flex min-h-[54px] cursor-pointer items-center justify-between gap-3 border-b border-[#e5e7eb] pt-4 pb-4 text-left [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#9ca3af] active:scale-[0.985] transition-[border-color,transform] duration-150 ease-emil-out will-change-transform`}
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

        <div ref={pinWrapperRef} className="w-full py-2">
          <div ref={interactiveBlockRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Perfil de imóvel"
              className="vp-reveal relative md:col-span-3 grid grid-cols-2 md:flex md:flex-col items-stretch md:items-start gap-1.5 md:gap-3 rounded-xl bg-slate-100/90 p-1 md:bg-transparent md:p-0 md:pt-2"
            >
              <span
                ref={tabPillRef}
                aria-hidden="true"
                className="vp-tab-active-pill pointer-events-none absolute rounded-lg bg-white md:bg-slate-100/90 shadow-xs md:shadow-none will-change-transform"
              />
              <button
                ref={tabResidenciasRef}
                role="tab"
                type="button"
                aria-selected={audience === 'residencias'}
                onClick={() => handleTabClick('residencias')}
                className={`relative z-10 flex min-h-[44px] md:min-h-0 cursor-pointer items-center justify-center md:justify-start text-center md:text-left font-mono text-[11px] sm:text-xs md:text-sm leading-5 py-2 md:py-1.5 px-2.5 sm:px-3 md:px-2.5 rounded-lg active:scale-[0.97] transition-[color,transform] duration-200 ease-emil-out whitespace-nowrap ${
                  audience === 'residencias'
                    ? 'font-bold text-[#111827]'
                    : 'text-[#6b7280] md:text-[#9ca3af] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#374151]'
                }`}
              >
                01. Para Residências
              </button>
              <button
                ref={tabComercioRef}
                role="tab"
                type="button"
                aria-selected={audience === 'comercio'}
                onClick={() => handleTabClick('comercio')}
                className={`relative z-10 flex min-h-[44px] md:min-h-0 cursor-pointer items-center justify-center md:justify-start text-center md:text-left font-mono text-[11px] sm:text-xs md:text-sm leading-5 py-2 md:py-1.5 px-2.5 sm:px-3 md:px-2.5 rounded-lg active:scale-[0.97] transition-[color,transform] duration-200 ease-emil-out whitespace-nowrap ${
                  audience === 'comercio'
                    ? 'font-bold text-[#111827]'
                    : 'text-[#6b7280] md:text-[#9ca3af] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#374151]'
                }`}
              >
                02. Comércios e Rural
              </button>
            </div>

            <div className="vp-reveal md:col-span-9 flex flex-col gap-4 md:gap-6">
              <h3 className="text-lg sm:text-xl font-bold leading-7 text-[#111827]">
                Por que cuidar do sistema fotovoltaico?
              </h3>

              <div className="grid grid-cols-1">
                <div
                  ref={panelResidenciasRef}
                  role="tabpanel"
                  aria-hidden={audience !== 'residencias'}
                  className={`col-start-1 row-start-1 flex flex-col gap-4 md:gap-6 ${
                    audience === 'residencias' ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                  }`}
                >
                  {renderAudienceItems('residencias')}
                </div>

                <div
                  ref={panelComercioRef}
                  role="tabpanel"
                  aria-hidden={audience !== 'comercio'}
                  className={`col-start-1 row-start-1 flex flex-col gap-4 md:gap-6 ${
                    audience === 'comercio' ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                  }`}
                >
                  {renderAudienceItems('comercio')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
