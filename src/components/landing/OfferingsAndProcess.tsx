import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ServiceInterest } from '../../content/landingPage';

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
          gsap.set(cards, { y: 36, autoAlpha: 0 });

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
                duration: 0.65,
                stagger: 0.12,
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
    <section id="servicos" ref={sectionRef} className="overflow-hidden bg-white px-6 pt-6 pb-24">
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:justify-center [scrollbar-width:none]">
        {OFFERINGS.map((o, i) => {
          const edge = i === 0 || i === OFFERINGS.length - 1;
          return (
            <article
              key={o.title}
              data-edge={edge ? 'true' : 'false'}
              className={`offering-card group flex w-[300px] md:w-[395px] shrink-0 snap-center flex-col gap-2 rounded-3xl bg-[rgba(249,250,251,0.5)] p-[17px] transition-opacity hover:opacity-100 will-change-transform ${
                edge ? 'md:opacity-65' : ''
              }`}
            >
              <div className="h-[240px] overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <img
                  src={o.img}
                  alt={o.alt}
                  loading="lazy"
                  className="offering-card-img size-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
                />
              </div>
              <h4 className="min-h-[52px] pb-1 text-base font-bold leading-6 text-[#111827]">{o.title}</h4>
              <p className="min-h-[64px] py-2 text-xs font-semibold leading-4 text-[#374151]">{o.desc}</p>
              <div className="flex min-h-[34px] items-end">
                <button
                  type="button"
                  onClick={() => onSelect(o.interest)}
                  className="cursor-pointer rounded-full border border-[#1f2937] px-[17px] py-[9px] text-xs font-semibold leading-4 text-[#1f2937] hover:bg-[#1f2937] hover:text-white active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-out"
                >
                  {o.cta}
                </button>
              </div>
            </article>
          );
        })}
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
      const max = el.scrollWidth - el.clientWidth;
      setActive(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (STEPS.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

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
            y: 24,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.1,
          }).from(
            '.process-step-card',
            {
              y: 36,
              autoAlpha: 0,
              duration: 0.65,
              stagger: 0.15,
            },
            '-=0.3'
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
    <section id="funcionamento" ref={sectionRef} className="bg-[#0a0a0a] py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6">
        <header className="flex max-w-[768px] flex-col items-center gap-4 text-center">
          <p className="process-header-item text-xs font-bold uppercase leading-4 tracking-[1.2px] text-[#227cc5]">
            Como funciona o atendimento
          </p>
          <h2 className="process-header-item text-[30px] md:text-[48px] font-extrabold leading-[1.1] md:leading-[48px] tracking-[-1.2px] text-white">
            Do primeiro contato à execução no seu imóvel, um processo simples e transparente.
          </h2>
          <p className="process-header-item max-w-[672px] pt-1 text-sm leading-5 text-[#9ca3af]">
            Conheça as etapas do nosso trabalho e o nosso compromisso técnico com a segurança do seu telhado e do seu
            investimento.
          </p>
        </header>

        <div
          ref={trackRef}
          className="flex w-full snap-x snap-mandatory gap-8 overflow-x-auto pt-4 md:overflow-visible [scrollbar-width:none]"
        >
          {STEPS.map((s, idx) => (
            <article
              key={s.tag}
              onMouseEnter={() => setActive(idx)}
              className="process-step-card group flex w-[85%] md:w-auto md:flex-1 shrink-0 snap-center flex-col rounded-3xl p-6 transition-colors hover:bg-white/[0.03] will-change-transform"
            >
              <div className="mb-5 h-48 overflow-hidden rounded-2xl bg-[#1c1c1c]">
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  className="process-step-img size-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
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
                className="mt-auto self-start cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-semibold leading-4 text-black hover:-translate-y-0.5 hover:bg-gray-200 active:scale-[0.96] transition-[transform,background-color] duration-150 ease-out"
              >
                {s.cta}
              </button>
            </article>
          ))}
        </div>

        <div aria-hidden className="flex w-full justify-end gap-1.5 pt-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-0.5 w-10 rounded-full transition-colors duration-300 ${
                i === active ? 'bg-[#78b6e9]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
