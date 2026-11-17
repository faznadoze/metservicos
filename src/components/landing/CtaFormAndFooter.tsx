import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPANY_CONFIG } from '../../content/landingPage';
import { buildServiceWhatsAppUrl } from '../../lib/whatsapp';
import { trackEvent } from '../../lib/analytics';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CtaFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerParallaxRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);

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
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          tl.fromTo(
            '.cta-banner-card',
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, clearProps: 'transform,opacity,visibility' }
          ).fromTo(
            bannerImgRef.current,
            { scale: 1.18 },
            { scale: 1.1, duration: 1.0, ease: 'power2.out' },
            0
          );

          // Subtle window parallax on wrapper (decoupled from bannerImgRef scale so they never fight or expose edges)
          gsap.fromTo(
            bannerParallaxRef.current,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
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
    <section
      id="orcamento"
      ref={sectionRef}
      className="bg-white px-5 sm:px-6 py-14 md:py-24 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="cta-banner-card relative flex w-full min-h-[340px] sm:min-h-[400px] md:min-h-[440px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[24px] px-6 sm:px-10 py-12 text-center will-change-transform shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <div ref={bannerParallaxRef} className="absolute inset-0 size-full will-change-transform">
            <img
              ref={bannerImgRef}
              src="/assets/figma/banner-cta.png"
              alt="Painéis solares ao pôr do sol"
              loading="lazy"
              className="size-full scale-110 object-cover will-change-transform"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,24,39,0.82)] via-[rgba(17,24,39,0.45)] to-[rgba(17,24,39,0.2)]" />
          <div className="relative flex max-w-[680px] flex-col items-center gap-4">
            <h2 className="text-[26px] sm:text-[36px] md:text-[44px] lg:text-[46px] font-bold leading-[1.15] tracking-[-0.8px] md:tracking-[-1px] text-white">
              Transforme a luz do sol em mais controle sobre a sua conta de energia
            </h2>
            <p className="max-w-[520px] text-sm sm:text-base leading-relaxed text-white/85">
              Fale direto com a equipe da M&amp;T Serviços pelo WhatsApp para tirar dúvidas, agendar limpeza ou avaliar seu
              projeto solar.
            </p>
            <a
              href={buildServiceWhatsAppUrl('duvida')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('click_whatsapp_hero', { source: 'cta_banner' })}
              className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-bold leading-5 text-white shadow-[0_12px_28px_-4px_rgba(37,211,102,0.45)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#20bd5a] active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-150 ease-emil-out"
            >
              <img
                src="/assets/figma/social-3.svg"
                alt=""
                width={18}
                height={18}
                className="size-4.5 select-none pointer-events-none"
              />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const COLS = [
  {
    title: 'Serviços',
    items: ['Instalação de Painéis Solares', 'Limpeza Fotovoltaica', 'Inspeção Visual de Módulos', 'Avaliação de Projeto Solar'],
  },
  {
    title: 'Atendimento',
    items: ['Residências e Condomínios', 'Comércios e Empresas', 'Propriedades Rurais', 'Dúvidas Frequentes'],
  },
];

export function MainFooter() {
  const footerRef = useRef<HTMLElement>(null);

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

          gsap.fromTo(
            '.footer-reveal-block',
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 92%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="flex flex-col items-center gap-12 md:gap-16 border-t border-[#f3f4f6] bg-white pt-12 md:pt-[65px]">
      <div className="grid w-full max-w-[1232px] grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 px-5 sm:px-6 pb-10 md:pb-12 xl:px-0">
        <div className="footer-reveal-block md:col-span-5 flex max-w-[448px] flex-col gap-2">
          <div className="flex items-end gap-2">
            <img src="/assets/figma/logo-footer.svg" alt="" width={32} height={29.285} />
            <span className="text-xl font-extrabold uppercase leading-none tracking-[-0.5px] text-[#1b2e51]">
              M&amp;T Serviços
            </span>
          </div>
          <p className="text-xs leading-[19.5px] text-[#6b7280]">
            Instalação de painéis solares e limpeza de sistemas fotovoltaicos para residências e empresas que querem
            produzir melhor e cuidar do investimento.
          </p>
        </div>

        <div className="footer-reveal-block md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2 md:pt-4">
          {COLS.map((c) => (
            <div key={c.title} className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase leading-4 tracking-[-0.3px] text-[#111827]">{c.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {c.items.map((i) => (
                  <li key={i} className="text-xs leading-4 text-[#6b7280]">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div id="duvidas" className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase leading-4 tracking-[-0.3px] text-[#111827]">Contato</h4>
            <ul className="flex flex-col gap-2.5 text-xs leading-4">
              <li>
                <span className="block font-semibold text-[#1f2937]">WhatsApp:</span>
                <a
                  href={buildServiceWhatsAppUrl('duvida')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-0.5 text-[#6b7280] [@media(hover:hover)_and_(pointer:fine)]:hover:underline"
                >
                  {COMPANY_CONFIG.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block font-semibold text-[#1f2937]">Telefone:</span>
                <a
                  href={`tel:+${COMPANY_CONFIG.whatsappNumber}`}
                  className="inline-block py-0.5 text-[#6b7280] [@media(hover:hover)_and_(pointer:fine)]:hover:underline"
                >
                  {COMPANY_CONFIG.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block font-semibold text-[#1f2937]">Instagram:</span>
                <a
                  href={COMPANY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-0.5 text-[#6b7280] [@media(hover:hover)_and_(pointer:fine)]:hover:underline"
                >
                  @{COMPANY_CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <span className="block font-semibold text-[#1f2937]">E-mail:</span>
                <a
                  href={`mailto:${COMPANY_CONFIG.email}`}
                  className="inline-block py-0.5 text-[#6b7280] [@media(hover:hover)_and_(pointer:fine)]:hover:underline"
                >
                  {COMPANY_CONFIG.email}
                </a>
              </li>
              <li className="pt-1 text-[11px] text-[#9ca3af]">Atendimento regional sob consulta.</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{ paddingBottom: 'max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))' }}
        className="w-full border-t border-[#f3f4f6] bg-[#1f2937] pt-[17px]"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col sm:flex-row items-center justify-between gap-4 px-6">
          <p className="text-center text-xs leading-4 text-[#9ca3af]">
            © 2026 M&amp;T Serviços — Energia Solar e Reformas. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={COMPANY_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram @${COMPANY_CONFIG.instagramHandle}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center opacity-80 transition-opacity [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100"
            >
              <img src="/assets/figma/social-1.svg" alt="Instagram" width={16} height={16} />
            </a>
            <span className="flex min-h-[44px] min-w-[44px] items-center justify-center opacity-80">
              <img src="/assets/figma/social-2.svg" alt="Facebook" width={16} height={16} />
            </span>
            <a
              href={buildServiceWhatsAppUrl('duvida')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${COMPANY_CONFIG.phoneDisplay}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center opacity-80 transition-opacity [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100"
            >
              <img src="/assets/figma/social-3.svg" alt="WhatsApp" width={16} height={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
