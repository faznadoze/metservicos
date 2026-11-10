import { FormEvent, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPANY_CONFIG, ServiceInterest } from '../../content/landingPage';
import { buildServiceWhatsAppUrl, buildWhatsAppUrl } from '../../lib/whatsapp';
import { trackEvent } from '../../lib/analytics';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const INTEREST_LABELS: Record<ServiceInterest, string> = {
  instalacao: 'Instalação de painéis solares',
  limpeza: 'Limpeza de sistema fotovoltaico',
  duvida: 'Ainda não sei / Quero orientação',
};

const inputCls =
  'w-full min-h-[48px] md:min-h-0 rounded-xl border border-[#e5e7eb] bg-white px-[17px] pt-[13px] pb-[14px] text-base md:text-xs text-[#1f2937] placeholder:text-[#9ca3af] outline-none shadow-xs focus:border-[#227cc5] focus:ring-2 focus:ring-[#b7dcfb] transition-[border-color,box-shadow] duration-150 ease-emil-out';

interface Props {
  selectedInterest: ServiceInterest;
  onOpenPrivacyModal: () => void;
}

export function CtaFormSection({ selectedInterest, onOpenPrivacyModal }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);
  const nameFieldRef = useRef<HTMLLabelElement>(null);
  const cityFieldRef = useRef<HTMLLabelElement>(null);
  const consentFieldRef = useRef<HTMLLabelElement>(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [interest, setInterest] = useState<ServiceInterest>(selectedInterest);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setInterest(selectedInterest), [selectedInterest]);

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

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          tl.from('.cta-banner-card', {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
          })
            .fromTo(
              bannerImgRef.current,
              { scale: 1.1 },
              { scale: 1, duration: 1.0, ease: 'power2.out' },
              0
            )
            .from(
              '.cta-form-col',
              {
                y: 20,
                autoAlpha: 0,
                duration: 0.6,
              },
              0.1
            );

          // Subtle window parallax on the solar banner image
          gsap.fromTo(
            bannerImgRef.current,
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 6,
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

  const shakeInvalidFields = contextSafe((invalidKeys: Record<string, string>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets: HTMLElement[] = [];
    if (invalidKeys.name && nameFieldRef.current) targets.push(nameFieldRef.current);
    if (invalidKeys.city && cityFieldRef.current) targets.push(cityFieldRef.current);
    if (invalidKeys.consent && consentFieldRef.current) targets.push(consentFieldRef.current);

    if (targets.length > 0) {
      gsap.fromTo(
        targets,
        { x: -6 },
        {
          x: 0,
          duration: 0.3,
          ease: 'elastic.out(1.2, 0.3)',
          clearProps: 'x',
        }
      );
    }
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Informe seu nome.';
    if (city.trim().length < 2) next.city = 'Informe sua cidade.';
    if (!consent) next.consent = 'É necessário concordar para continuar.';
    setErrors(next);
    if (Object.keys(next).length) {
      shakeInvalidFields(next);
      return;
    }

    const msg = [
      'Olá! Gostaria de receber orientação da MeT Serviços.',
      '',
      `*Nome:* ${name.trim()}`,
      `*Cidade/Estado:* ${city.trim()}`,
      `*Interesse:* ${INTEREST_LABELS[interest]}`,
    ].join('\n');
    trackEvent('submit_lead_form' as never);
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="orcamento"
      ref={sectionRef}
      className="bg-white px-5 sm:px-6 py-14 md:py-24 overflow-hidden"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:flex-row items-stretch justify-center gap-8">
        {/* Banner Card */}
        <div className="cta-banner-card relative flex w-full lg:flex-1 min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] items-center justify-center overflow-hidden rounded-[24px] will-change-transform shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <img
            ref={bannerImgRef}
            src="/assets/figma/banner-cta.png"
            alt="Painéis solares ao pôr do sol"
            loading="lazy"
            className="absolute inset-0 size-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.65)] via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.1)]" />
          <h2 className="relative max-w-[620px] px-6 sm:px-8 text-center text-[26px] sm:text-[36px] md:text-[44px] lg:text-[46px] font-bold leading-[1.15] tracking-[-0.8px] md:tracking-[-1px] text-white">
            Transforme a luz do sol em mais controle sobre a sua conta de energia
          </h2>
        </div>

        {/* Form Column */}
        <div className="cta-form-col flex w-full max-w-[512px] flex-col gap-2 self-start will-change-transform shrink-0">
          <h3 className="font-extrabold uppercase leading-tight tracking-[-0.5px] text-[#111827] text-lg sm:text-[20px]">
            Pronto para dar o próximo passo com mais segurança?
          </h3>
          <p className="text-xs leading-[19.5px] text-[#6b7280]">
            Conte brevemente o que você precisa. A equipe da MeT Serviços entra em contato para entender o cenário e
            indicar o caminho mais adequado.
          </p>

          <form
            noValidate
            onSubmit={submit}
            className="flex flex-col gap-4 rounded-[24px] border border-[rgba(229,231,235,0.8)] bg-[#f9fafb] p-5 sm:p-7 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row gap-3.5">
              <label ref={nameFieldRef} className="flex flex-col gap-1 sm:w-[260px] flex-[1.4]">
                <span className="text-[11px] font-semibold leading-[16.5px] text-[#374151]">Nome completo</span>
                <input
                  className={inputCls}
                  placeholder="Ex.: Carlos Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  enterKeyHint="next"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className="text-[11px] text-red-600">{errors.name}</span>}
              </label>
              <label ref={cityFieldRef} className="flex flex-1 flex-col gap-1">
                <span className="text-[11px] font-semibold leading-[16.5px] text-[#374151]">Cidade / Estado</span>
                <input
                  className={inputCls}
                  placeholder="Ex: Criciúma / SC"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  enterKeyHint="done"
                  aria-invalid={!!errors.city}
                />
                {errors.city && <span className="text-[11px] text-red-600">{errors.city}</span>}
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold leading-[16.5px] text-[#374151]">Interesse principal</span>
              <span className="relative">
                <select
                  className={`${inputCls} appearance-none py-[13px] pr-10 leading-5 md:leading-4`}
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as ServiceInterest)}
                >
                  {(Object.keys(INTEREST_LABELS) as ServiceInterest[]).map((k) => (
                    <option key={k} value={k}>
                      {INTEREST_LABELS[k]}
                    </option>
                  ))}
                </select>
                <img
                  src="/assets/figma/select-chevron.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2"
                />
              </span>
            </label>

            <label ref={consentFieldRef} className="flex min-h-[44px] items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 size-4.5 md:size-4 shrink-0 rounded border-[#767676] accent-[#227cc5] cursor-pointer active:scale-90 transition-transform duration-100 ease-emil-out"
              />
              <span className="text-xs md:text-[11px] leading-[16px] md:leading-[14px] text-[#6b7280]">
                Concordo em receber contato da MeT Serviços pelo WhatsApp ou telefone conforme a{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  className="cursor-pointer font-semibold underline underline-offset-2 [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#111827] active:text-[#111827] transition-colors"
                >
                  Política de Privacidade
                </button>
                .
                {errors.consent && <span className="block pt-0.5 text-red-600">{errors.consent}</span>}
              </span>
            </label>

            <button
              type="submit"
              className="w-full sm:w-auto sm:self-start min-h-[48px] flex items-center justify-center cursor-pointer rounded-full bg-[#b7dcfb] px-9 py-3.5 text-xs font-bold leading-4 text-[#111827] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#9fcff8] active:scale-[0.97] active:bg-[#8cc4f5] transition-[transform,background-color,box-shadow] duration-150 ease-emil-out shadow-xs"
            >
              Quero receber orientação
            </button>
          </form>
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

          gsap.from('.footer-reveal-block', {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          });
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
