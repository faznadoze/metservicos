import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ServiceInterest } from '../../content/landingPage';
import { computeCarouselActiveIndex } from '../../lib/validation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OFFERINGS: {
  title: string;
  desc: string;
  cta: string;
  img: string;
  alt: string;
  interest: ServiceInterest;
}[] = [
  {
    title: 'Instalação de painéis solares',
    desc: 'Comece a gerar sua própria energia com um projeto pensado para o seu imóvel.',
    cta: 'Quero avaliar meu projeto solar →',
    img: '/assets/figma/card-instalacao.png',
    alt: 'Instalação técnica de módulos solares em telhado',
    interest: 'instalacao',
  },
  {
    title: 'Limpeza de sistemas fotovoltaicos',
    desc: 'Seu sistema trabalha com o sol. Mantenha a superfície pronta para recebê-lo.',
    cta: 'Agendar limpeza do meu sistema →',
    img: '/assets/figma/card-limpeza.png',
    alt: 'Limpeza especializada de painel solar fotovoltaico',
    interest: 'limpeza',
  },
  {
    title: 'Inspeção Visual e Conservação',
    desc: 'Verificamos visualmente o acúmulo de detritos sob as placas, enviando registro fotográfico.',
    cta: 'Solicitar avaliação visual →',
    img: '/assets/figma/card-inspecao.png',
    alt: 'Técnico realizando inspeção visual de placas solares',
    interest: 'limpeza',
  },
  {
    title: 'Atendimento Residencial, Comercial e Rural',
    desc: 'Soluções dimensionadas para residências, comércios e propriedades rurais, sempre respeitando as características estruturais de cada telhado.',
    cta: 'Conferir atendimento na região →',
    img: '/assets/figma/card-residencial.png',
    alt: 'Instalação fotovoltaica em telhado residencial e comercial',
    interest: 'duvida',
  },
];

export function OfferingsCarousel({ onSelect }: { onSelect: (i: ServiceInterest) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      setActiveIndex(
        computeCarouselActiveIndex(el.scrollLeft, el.scrollWidth, el.clientWidth, OFFERINGS.length)
      );
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.offering-card');
    const targetCard = cards[index];
    if (!targetCard) return;
    const targetLeft = targetCard.offsetLeft - (el.clientWidth - targetCard.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setActiveIndex(index);
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
          if (ctx.conditions?.reduceMotion) return;

          const cards = gsap.utils.toArray<HTMLElement>('.offering-card', sectionRef.current);
          gsap.set(cards, { y: 32, autoAlpha: 0 });

          ScrollTrigger.batch(cards, {
            interval: 0.1,
            batchMax: 4,
            start: 'top 85%',
            onEnter: (batch) => {
              gsap.to(batch, {
                y: 0,
                autoAlpha: (i, target) => {
                  const isEdge = target.getAttribute('data-edge') === 'true';
                  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
                  return isEdge && isDesktop ? 0.65 : 1;
                },
                duration: 0.55,
                stagger: 0.08,
                ease: 'power3.out',
                overwrite: true,
                clearProps: 'opacity,visibility',
              });
            },
          });

          // Subtle window parallax on card images
          const cardImgs = gsap.utils.toArray<HTMLElement>('.offering-card-img', sectionRef.current);
          gsap.fromTo(
            cardImgs,
            { yPercent: -4, scale: 1.05 },
            {
              yPercent: 4,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="servicos" ref={sectionRef} className="overflow-hidden bg-white px-5 sm:px-6 pt-4 pb-16 md:pt-6 md:pb-24">
      <div
        ref={trackRef}
        className="-mx-5 sm:-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-6 pb-3 md:justify-center touch-pan-y [scrollbar-width:none]"
      >
        {OFFERINGS.map((o, i) => {
          const edge = i === 0 || i === OFFERINGS.length - 1;
          return (
            <article
              key={o.title}
              data-edge={edge ? 'true' : 'false'}
              className={`offering-card group flex w-[84vw] max-w-[320px] sm:w-[330px] md:w-[395px] md:max-w-none shrink-0 snap-center flex-col gap-2 rounded-3xl border border-slate-100 md:border-transparent bg-[rgba(249,250,251,0.75)] md:bg-[rgba(249,250,251,0.5)] p-[17px] transition-opacity duration-200 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100 will-change-transform ${
                edge ? 'md:opacity-65' : ''
              }`}
            >
              <div className="h-[220px] sm:h-[240px] overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <img
                  src={o.img}
                  alt={o.alt}
                  loading="lazy"
                  className="offering-card-img size-full object-cover transition-transform duration-500 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 will-change-transform"
                />
              </div>
              <h4 className="min-h-[48px] md:min-h-[52px] pt-1 pb-0.5 text-base font-bold leading-6 text-[#111827]">
                {o.title}
              </h4>
              <p className="min-h-[60px] md:min-h-[64px] py-1.5 text-xs font-semibold leading-4 text-[#374151]">
                {o.desc}
              </p>
              <div className="mt-auto flex min-h-[44px] items-end pt-1">
                <button
                  type="button"
                  onClick={() => onSelect(o.interest)}
                  className="min-h-[44px] cursor-pointer rounded-full border border-[#1f2937] px-[18px] py-2.5 text-xs font-semibold leading-4 text-[#1f2937] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#1f2937] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white active:scale-[0.96] active:bg-[#1f2937] active:text-white transition-[transform,background-color,color] duration-150 ease-emil-out"
                >
                  {o.cta}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile swipe progress indicators */}
      <div className="mt-2 flex md:hidden items-center justify-between px-1">
        <span className="font-mono-tabular text-xs font-medium text-[#6b7280]">
          0{activeIndex + 1} / 0{OFFERINGS.length}
        </span>
        <div className="flex items-center gap-1" role="group" aria-label="Navegação de serviços">
          {OFFERINGS.map((item, idx) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Ver serviço ${idx + 1}: ${item.title}`}
              onClick={() => scrollToCard(idx)}
              className="flex min-h-[44px] items-center px-1 cursor-pointer active:scale-95 transition-transform duration-150 ease-emil-out"
            >
              <span
                className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-emil-out ${
                  idx === activeIndex ? 'w-7 bg-[#111827]' : 'w-2 bg-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    tag: 'Etapa 01 e 02 · Diagnóstico inicial',
    title: 'Você chama e nós entendemos o cenário',
    desc: 'Entre em contato pelo WhatsApp ou formulário. Avaliamos seu perfil de consumo (para novos projetos) ou a condição atual dos módulos e tipo de telhado (para limpeza).',
    cta: 'Iniciar atendimento →',
    img: '/assets/figma/etapa-diagnostico.png',
    alt: 'Diagnóstico e contato inicial para projeto solar',
  },
  {
    tag: 'Etapa 03 · Proposta transparente',
    title: 'Indicamos o serviço e explicamos o processo',
    desc: 'Apresentamos a orientação técnica ideal para o seu imóvel, sem promessas irreais de geração fixa e com explicação clara sobre equipamentos, prazos e métodos.',
    cta: 'Pedir avaliação →',
    img: '/assets/figma/etapa-proposta.png',
    alt: 'Equipe apresentando proposta solar detalhada',
  },
  {
    tag: 'Etapa 04 · Execução cuidadosa',
    title: 'Executamos com cuidado e mantemos você informado',
    desc: 'Realizamos a instalação organizada ou a limpeza segura dos módulos preservando telhas e calhas, com acompanhamento próximo e registro visual antes e depois.',
    cta: 'Falar com a equipe →',
    img: '/assets/figma/card-inspecao.png',
    alt: 'Equipe técnica executando serviço fotovoltaico com segurança',
  },
];

export function ProcessSection({ onCta }: { onCta: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      setActive(computeCarouselActiveIndex(el.scrollLeft, el.scrollWidth, el.clientWidth, STEPS.length));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToStep = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('.process-step-card');
    const targetCard = cards[index];
    if (!targetCard) return;
    const targetLeft = targetCard.offsetLeft - (el.clientWidth - targetCard.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setActive(index);
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
          if (ctx.conditions?.reduceMotion) return;

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          });

          tl.from('.process-header-item', {
            y: 20,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.08,
          }).from(
            '.process-step-card',
            {
              y: 30,
              autoAlpha: 0,
              duration: 0.55,
              stagger: 0.1,
            },
            '-=0.25'
          );

          // Subtle window parallax on process step images
          const stepImgs = gsap.utils.toArray<HTMLElement>('.process-step-img', sectionRef.current);
          gsap.fromTo(
            stepImgs,
            { yPercent: -4, scale: 1.04 },
            {
              yPercent: 4,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="funcionamento" ref={sectionRef} className="bg-[#0a0a0a] py-14 md:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 md:gap-12 px-5 sm:px-6">
        <header className="flex max-w-[768px] flex-col items-center gap-3.5 md:gap-4 text-center">
          <p className="process-header-item text-xs font-bold uppercase leading-4 tracking-[1.2px] text-[#227cc5]">
            Como funciona o atendimento
          </p>
          <h2 className="process-header-item text-[28px] sm:text-[34px] md:text-[48px] font-extrabold leading-[1.12] md:leading-[48px] tracking-[-1px] md:tracking-[-1.2px] text-white">
            Do primeiro contato à execução no seu imóvel, um processo simples e transparente.
          </h2>
          <p className="process-header-item max-w-[672px] pt-1 text-sm leading-5 text-[#9ca3af]">
            Conheça as etapas do nosso trabalho e o nosso compromisso técnico com a segurança do seu telhado e do seu
            investimento.
          </p>
        </header>

        <div
          ref={trackRef}
          className="-mx-5 sm:-mx-6 md:mx-0 flex w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] md:w-full snap-x snap-mandatory gap-4 md:gap-8 overflow-x-auto px-5 sm:px-6 md:px-0 pt-2 md:pt-4 md:overflow-visible touch-pan-y [scrollbar-width:none]"
        >
          {STEPS.map((s, idx) => (
            <article
              key={s.tag}
              onMouseEnter={() => setActive(idx)}
              className="process-step-card group flex w-[84vw] max-w-[330px] md:w-auto md:max-w-none md:flex-1 shrink-0 snap-center flex-col rounded-3xl border border-white/10 bg-white/[0.03] md:border-transparent md:bg-transparent p-5 sm:p-6 transition-colors duration-200 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.03] will-change-transform"
            >
              <div className="mb-5 h-44 sm:h-48 overflow-hidden rounded-2xl bg-[#1c1c1c]">
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  className="process-step-img size-full object-cover transition-transform duration-500 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 will-change-transform"
                />
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.275px] text-[#78b6e9]">
                {s.tag}
              </p>
              <h3 className="mb-3 min-h-[49.5px] text-lg font-bold leading-[24.75px] text-white">{s.title}</h3>
              <p className="mb-6 text-xs leading-[19.5px] text-[#9ca3af]">{s.desc}</p>
              <button
                type="button"
                onClick={onCta}
                className="mt-auto self-start min-h-[44px] cursor-pointer rounded-full bg-white px-5 py-2.5 text-xs font-semibold leading-4 text-black [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-200 active:scale-[0.96] active:bg-gray-200 transition-[transform,background-color] duration-150 ease-emil-out"
              >
                {s.cta}
              </button>
            </article>
          ))}
        </div>

        <div className="flex w-full items-center justify-between md:justify-end gap-1.5 pt-1 md:pt-4">
          <span className="font-mono-tabular text-xs font-medium text-[#9ca3af] md:hidden">
            Etapa 0{active + 1} de 0{STEPS.length}
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Etapas do atendimento">
            {STEPS.map((step, i) => (
              <button
                key={step.tag}
                type="button"
                aria-label={`Ver ${step.tag}`}
                onClick={() => scrollToStep(i)}
                className="flex min-h-[44px] items-center py-2 cursor-pointer active:scale-95 transition-transform duration-150 ease-emil-out"
              >
                <span
                  className={`h-1 md:h-0.5 w-10 rounded-full transition-colors duration-200 ease-emil-out ${
                    i === active ? 'bg-[#78b6e9]' : 'bg-white/20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
