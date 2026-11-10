import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function HeroSection({
  onCtaClick,
  isReady = true,
}: {
  onCtaClick: () => void;
  isReady?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!isReady) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          isAny: 'all',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions ?? {};
          if (reduceMotion) return;

          // Subtle initial scale & entrance + SplitText line reveal
          const introTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
          });

          introTl.fromTo(
            bgImgRef.current,
            { scale: 1.18 },
            { scale: 1.1, duration: 1.35, ease: 'power2.out' },
            0
          );

          if (headingRef.current) {
            SplitText.create(headingRef.current, {
              type: 'lines,words',
              mask: 'lines',
              autoSplit: true,
              onSplit(self) {
                gsap.set(self.lines, {
                  paddingBottom: '0.15em',
                  marginBottom: '-0.15em',
                });
                return gsap.from(self.words, {
                  yPercent: 115,
                  autoAlpha: 0,
                  duration: 0.72,
                  stagger: 0.045,
                  ease: 'power3.out',
                  onComplete: () => {
                    if (self.masks?.length) {
                      gsap.set(self.masks, { overflow: 'visible' });
                    }
                  },
                });
              },
            });
          }

          introTl.fromTo(
            ctaBtnRef.current,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              clearProps: 'transform,opacity,visibility',
            },
            0.35
          );

          // Scroll-linked parallax on wrapper (decoupled from bgImgRef scale so they never fight or expose edges)
          gsap.fromTo(
            bgParallaxRef.current,
            { yPercent: -4 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isReady] }
  );

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex min-h-[100svh] md:min-h-[736px] md:h-[865px] items-start justify-center overflow-hidden pt-[132px] sm:pt-[160px] md:pt-[192px] pb-20 md:pb-[120px]"
    >
      <div ref={bgParallaxRef} className="absolute inset-0 size-full will-change-transform">
        <img
          ref={bgImgRef}
          src="/assets/figma/hero.png"
          alt="Sistema fotovoltaico instalado em telhado"
          className="size-full scale-110 object-cover object-[center_60%] will-change-transform"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 140% 66% at 50% 16.5%, rgba(17,24,39,0.75) 12%, rgba(17,24,39,0) 100%)',
        }}
      />
      <div className="relative flex w-full max-w-[896px] flex-col items-center gap-6 px-5 sm:px-6">
        <h1
          ref={headingRef}
          className="text-center text-[34px] sm:text-[42px] md:text-[60px] font-medium leading-[1.15] md:leading-[68px] tracking-[-1.2px] md:tracking-[-1.5px] text-white"
        >
          Quem tem controle sobre a energia <strong className="font-bold">não teme apagões.</strong>
        </h1>
        <button
          ref={ctaBtnRef}
          type="button"
          onClick={onCtaClick}
          className="group flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold leading-5 text-[#111827] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 active:scale-[0.97] active:shadow-md transition-[transform,box-shadow,background-color] duration-150 ease-emil-out will-change-transform"
        >
          <span>Precavenha-se</span>
          <img
            src="/assets/figma/arrow.svg"
            alt=""
            width={16}
            height={16}
            className="transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>
  );
}

const PARTNER_LOGOS_DATA = [
  { id: 'mana', src: '/assets/figma/logo-mana.svg', alt: 'Maná', className: 'h-7 w-[81px]' },
  { id: 'megainox', src: '/assets/figma/logo-megainox.svg', alt: 'Mega Inox', className: 'h-7 w-[149px]' },
  { id: 'styl', src: '/assets/figma/logo-styl.svg', alt: 'Styl', className: 'h-7 w-[90px]' },
  { id: 'saodefende', src: '/assets/figma/logo-saodefende.svg', alt: 'São Defende', className: 'h-7 w-[101px]' },
];

export function PartnerLogos() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isAny: 'all',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions ?? {};
          if (!trackRef.current) return;

          if (reduceMotion) {
            gsap.set(trackRef.current, { x: 0 });
            return;
          }

          // Smooth seamless infinite marquee
          const marqueeTween = gsap.to(trackRef.current, {
            xPercent: -50,
            duration: 24,
            ease: 'none',
            repeat: -1,
          });

          // Subtle momentum response to scroll: smoothly accelerates with scroll impulse and glides back
          const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              const velocity = Math.abs(self.getVelocity());
              if (velocity > 80) {
                const boost = Math.min(velocity / 400, 2.2);
                gsap.to(marqueeTween, {
                  timeScale: 1 + boost,
                  duration: 0.25,
                  overwrite: 'auto',
                });
                gsap.to(marqueeTween, {
                  timeScale: 1,
                  duration: 1.1,
                  delay: 0.25,
                  ease: 'power2.out',
                  overwrite: false,
                });
              }
            },
          });

          // Elegant slow-down on hover
          const trackEl = trackRef.current;
          const onEnter = () => gsap.to(marqueeTween, { timeScale: 0.35, duration: 0.5, ease: 'power2.out' });
          const onLeave = () => gsap.to(marqueeTween, { timeScale: 1, duration: 0.5, ease: 'power2.out' });

          trackEl.addEventListener('mouseenter', onEnter);
          trackEl.addEventListener('mouseleave', onLeave);

          return () => {
            trackEl.removeEventListener('mouseenter', onEnter);
            trackEl.removeEventListener('mouseleave', onLeave);
            marqueeTween.kill();
            st.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-label="Clientes e Parceiros"
      className="relative overflow-hidden border-b border-[#f3f4f6] bg-white py-5 sm:py-6"
    >
      <div className="mx-auto flex max-w-[1280px] items-center pl-4 sm:pl-6 pr-0 sm:pr-1">
        {/* Left static caption block with gradient mask so logos disappear behind it */}
        <div className="relative z-20 flex items-center shrink-0 bg-white pr-4 sm:pr-8 py-1">
          <p className="max-w-[125px] sm:max-w-[155px] text-[11px] sm:text-xs font-semibold leading-[15px] sm:leading-[17px] tracking-[0.2px] text-[#737a85]">
            Quem já se beneficia dos nossos serviços:
          </p>
          {/* Subtle fade-out gradient to the right of the caption */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-full top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent"
          />
        </div>

        {/* Infinite marquee viewport with right-edge fade */}
        <div className="relative flex-1 overflow-hidden py-1">
          {/* Right edge fade-in gradient: thin and right at the margin */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 sm:w-10 bg-gradient-to-l from-white to-transparent"
          />

          {/* Marquee track containing two cloned sequences for a seamless 360 loop */}
          <div
            ref={trackRef}
            className="flex items-center gap-10 sm:gap-16 w-max opacity-85 md:opacity-75 md:grayscale [@media(hover:hover)_and_(pointer:fine)]:hover:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100 transition-[opacity,filter] duration-200 ease-emil-out will-change-transform select-none"
          >
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex items-center gap-10 sm:gap-16 shrink-0">
                {PARTNER_LOGOS_DATA.map((logo) => (
                  <img
                    key={`${copyIndex}-${logo.id}`}
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.className} object-contain shrink-0`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
