import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const NAV = [
  { label: 'Início', href: '#inicio', isHome: true },
  { label: 'Benefícios', href: '#beneficios', isHome: false },
  { label: 'Serviços', href: '#servicos', isHome: false },
  { label: 'Funcionamento', href: '#funcionamento', isHome: false },
];

export function SiteHeader({
  onQuoteClick,
  isReady = true,
}: {
  onQuoteClick: () => void;
  isReady?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const exteriorLogoRef = useRef<HTMLDivElement>(null);
  const exteriorActionsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLSpanElement>(null);
  const pillLogoRef = useRef<HTMLDivElement>(null);
  const pillActionsRef = useRef<HTMLDivElement>(null);

  const [activeHref, setActiveHref] = useState<string>('#inicio');
  const isProgrammaticScrollRef = useRef(false);
  const hasInitializedPillRef = useRef(false);

  // Smoothly position & glide the single persistent active pill on both scroll and click
  useLayoutEffect(() => {
    const syncActivePill = (animate: boolean) => {
      const container = navLinksRef.current;
      const pill = activePillRef.current;
      if (!container || !pill) return;

      const activeLink = container.querySelector<HTMLElement>(`a[data-href="${activeHref}"]`);
      if (!activeLink) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const targetProps = {
        x: activeLink.offsetLeft,
        y: activeLink.offsetTop,
        width: activeLink.offsetWidth,
        height: activeLink.offsetHeight,
      };

      if (!animate || reduceMotion || !hasInitializedPillRef.current) {
        gsap.set(pill, targetProps);
        hasInitializedPillRef.current = true;
      } else {
        gsap.to(pill, {
          ...targetProps,
          duration: 0.28,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    syncActivePill(true);

    const onResize = () => syncActivePill(false);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [activeHref]);

  const { contextSafe } = useGSAP(
    () => {
      if (!isReady) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduceMotion, isDesktop } = ctx.conditions ?? {};

          // Initial entrance animation once loader is done
          if (!reduceMotion) {
            gsap.fromTo(
              headerRef.current,
              { yPercent: -100, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.48,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
              }
            );
          }

          let isCompact = window.scrollY > 50;

          if (isDesktop) {
            gsap.set([pillLogoRef.current, pillActionsRef.current], {
              autoAlpha: isCompact ? 1 : 0,
              width: isCompact ? 'auto' : 0,
              x: 0,
              overflow: 'hidden',
            });
            gsap.set([exteriorLogoRef.current, exteriorActionsRef.current], {
              autoAlpha: isCompact ? 0 : 1,
              y: isCompact ? -8 : 0,
              scale: isCompact ? 0.94 : 1,
            });
            gsap.set(headerBgRef.current, { autoAlpha: isCompact ? 0 : 1 });
            gsap.set(navRef.current, {
              borderColor: isCompact ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)',
            });
          } else {
            gsap.set(pillLogoRef.current, {
              autoAlpha: 1,
              width: 'auto',
              x: 0,
              clearProps: 'paddingLeft,paddingRight',
            });
            gsap.set(pillActionsRef.current, {
              autoAlpha: 0,
              width: 0,
              overflow: 'hidden',
            });
            gsap.set(headerBgRef.current, { autoAlpha: isCompact ? 0 : 1 });
            gsap.set(navRef.current, {
              y: isCompact ? -2 : 0,
              borderColor: isCompact ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            });
          }

          const applyCompactState = (nextCompact: boolean) => {
            if (nextCompact === isCompact) return;
            isCompact = nextCompact;
            const dur = reduceMotion ? 0 : 0.28;

            gsap.to(headerBgRef.current, {
              autoAlpha: nextCompact ? 0 : 1,
              duration: dur,
              ease: 'power3.out',
              overwrite: 'auto',
            });

            if (isDesktop) {
              gsap.to([exteriorLogoRef.current, exteriorActionsRef.current], {
                autoAlpha: nextCompact ? 0 : 1,
                y: nextCompact ? -8 : 0,
                scale: nextCompact ? 0.94 : 1,
                duration: dur * 0.85,
                ease: 'power3.out',
                overwrite: 'auto',
              });

              if (nextCompact) {
                gsap.to([pillLogoRef.current, pillActionsRef.current], {
                  width: 'auto',
                  autoAlpha: 1,
                  x: 0,
                  duration: dur,
                  ease: 'power3.out',
                  overwrite: 'auto',
                });
              } else {
                gsap.to([pillLogoRef.current, pillActionsRef.current], {
                  autoAlpha: 0,
                  duration: dur * 0.55,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
                gsap.to([pillLogoRef.current, pillActionsRef.current], {
                  width: 0,
                  duration: dur,
                  ease: 'power3.out',
                });
              }

              gsap.to(navRef.current, {
                borderColor: nextCompact ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)',
                duration: dur,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            } else {
              gsap.to(navRef.current, {
                y: nextCompact ? -2 : 0,
                borderColor: nextCompact ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                duration: dur,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            }
          };

          ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
              applyCompactState(self.scroll() > 50);
            },
          });

          // Track active section in page order with lower refreshPriority (-1)
          // so section offsets are computed AFTER pinned sections (#beneficios) insert their pin-spacers
          NAV.forEach((item) => {
            const sectionEl = document.querySelector(item.href);
            if (!sectionEl) return;

            ScrollTrigger.create({
              trigger: sectionEl,
              start: 'top 45%',
              end: 'bottom 45%',
              refreshPriority: -1,
              onEnter: () => {
                if (!isProgrammaticScrollRef.current) setActiveHref(item.href);
              },
              onEnterBack: () => {
                if (!isProgrammaticScrollRef.current) setActiveHref(item.href);
              },
            });
          });
        }
      );

      return () => mm.revert();
    },
    { scope: headerRef, dependencies: [isReady] }
  );

  const handleNavClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    setActiveHref(href);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isProgrammaticScrollRef.current = true;

    gsap.to(window, {
      duration: reduceMotion ? 0 : 0.72,
      scrollTo: { y: targetEl, offsetY: href === '#inicio' ? 0 : 72, autoKill: true },
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isProgrammaticScrollRef.current = false;
      },
      onInterrupt: () => {
        isProgrammaticScrollRef.current = false;
      },
    });
  });

  return (
    <header
      ref={headerRef}
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
      className="fixed inset-x-0 top-0 z-40 pointer-events-none px-3 pb-2 md:px-10 md:pt-3.5 will-change-transform"
    >
      {/* Full-width subtle background bar at the very top (dissolves when scrolling) */}
      <div
        ref={headerBgRef}
        className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 pointer-events-none"
      />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-center md:justify-between gap-2">
        {/* Exterior Left Brand Logo (present on desktop at the top of the page) */}
        <div ref={exteriorLogoRef} className="pointer-events-auto hidden md:flex items-center shrink-0">
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            aria-label="M&T Serviços — início"
            className="flex items-center gap-2 group active:scale-[0.97] transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105"
          >
            <img src="/assets/figma/logo-header.svg" alt="M&T Serviços" width={32} height={29.285} />
            <span className="font-extrabold uppercase text-sm tracking-tight text-[#1b2e51] whitespace-nowrap">
              M&amp;T Serviços
            </span>
          </a>
        </div>

        {/* Central Floating Pill Menu */}
        <nav
          ref={navRef}
          aria-label="Principal"
          className="pointer-events-auto flex h-[44px] max-w-full items-center rounded-full border border-white/10 bg-[rgba(31,41,55,0.95)] px-1.5 md:px-[7px] py-[5px] backdrop-blur-md"
        >
          {/* Integrated Pill Brand Logo (always visible on mobile; animated into the pill on desktop scroll) */}
          <div ref={pillLogoRef} className="flex items-center overflow-hidden shrink-0">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="flex items-center pl-2 pr-2 md:pr-2.5 py-1 active:scale-[0.95] transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105"
              aria-label="M&T Serviços — início"
            >
              <img src="/assets/figma/logo-header-pill.svg" alt="M&T Serviços" width={24} height={22} className="md:w-[26px] md:h-[24px]" />
            </a>
            <div className="h-4 w-px bg-white/20 mr-1.5 md:mr-2 shrink-0" />
          </div>

          {/* Navigation Links with Single Persistent Sliding Active Pill */}
          <div ref={navLinksRef} className="relative flex items-center gap-0.5">
            <span
              ref={activePillRef}
              aria-hidden="true"
              className="nav-active-pill pointer-events-none absolute top-0 left-0 rounded-full bg-white will-change-transform"
            />
            {NAV.map((n) => {
              const isActive = activeHref === n.href;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  data-href={n.href}
                  onClick={(e) => handleNavClick(e, n.href)}
                  className={`relative z-10 flex h-8 md:h-7 items-center gap-1 md:gap-1.5 rounded-full px-2.5 sm:px-3 md:px-3.5 text-[11px] sm:text-xs leading-4 active:scale-[0.96] transition-[color,transform] duration-150 ease-emil-out whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'font-semibold text-[#111827]'
                      : 'font-medium text-[#d1d5db] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1 md:gap-1.5 whitespace-nowrap">
                    {n.isHome && (
                      <img
                        src="/assets/figma/home.svg"
                        alt=""
                        width={12}
                        height={12}
                        className={`md:w-[13px] md:h-[13px] transition-[filter] duration-150 ${
                          isActive ? '' : 'invert brightness-200'
                        }`}
                      />
                    )}
                    {n.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Integrated Pill Actions (Orçamento animated into the pill on desktop scroll) */}
          <div ref={pillActionsRef} className="hidden md:flex items-center overflow-hidden shrink-0">
            <div className="h-4 w-px bg-white/20 ml-1.5 mr-2 shrink-0" />
            <button
              type="button"
              onClick={onQuoteClick}
              className="cursor-pointer rounded-full bg-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#b7dcfb] active:scale-[0.96] px-3.5 h-7 flex items-center justify-center text-xs font-semibold text-[#111827] transition-[transform,background-color] duration-150 ease-emil-out whitespace-nowrap"
            >
              Orçamento
            </button>
          </div>
        </nav>

        {/* Exterior Right Actions (present on desktop at the top of the page) */}
        <div ref={exteriorActionsRef} className="pointer-events-auto hidden md:flex items-center justify-self-end shrink-0">
          <button
            type="button"
            onClick={onQuoteClick}
            className="cursor-pointer rounded-full border border-[#e5e7eb] bg-white px-[17px] py-[9px] text-sm font-semibold text-[#111827] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray-50 active:scale-[0.96] transition-[transform,background-color,box-shadow] duration-150 ease-emil-out whitespace-nowrap"
          >
            Orçamento
          </button>
        </div>
      </div>
    </header>
  );
}
