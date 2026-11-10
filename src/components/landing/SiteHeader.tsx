import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Flip);

const NAV = [
  { label: 'Início', href: '#inicio', isHome: true },
  { label: 'Benefícios', href: '#beneficios', isHome: false },
  { label: 'Serviços', href: '#servicos', isHome: false },
  { label: 'Funcionamento', href: '#funcionamento', isHome: false },
];

export function SiteHeader({ onQuoteClick }: { onQuoteClick: () => void }) {
  const headerRef = useRef<HTMLElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const exteriorLogoRef = useRef<HTMLDivElement>(null);
  const exteriorActionsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillLogoRef = useRef<HTMLDivElement>(null);
  const pillActionsRef = useRef<HTMLDivElement>(null);

  const [activeHref, setActiveHref] = useState<string>('#inicio');

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduceMotion, isDesktop } = ctx.conditions ?? {};

          // Initial entrance animation
          if (!reduceMotion) {
            gsap.from(headerRef.current, {
              yPercent: -100,
              autoAlpha: 0,
              duration: 0.5,
              ease: 'power3.out',
            });
          }

          // Floating Island Morph Timeline on Scroll
          const morphTl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.out' },
          });

          // 1. Fade out header full-width backdrop
          morphTl.to(
            headerBgRef.current,
            {
              autoAlpha: 0,
              duration: 0.25,
            },
            0
          );

          if (isDesktop) {
            // Initial state of pill extra items on desktop
            gsap.set([pillLogoRef.current, pillActionsRef.current], {
              autoAlpha: 0,
              width: 0,
              paddingLeft: 0,
              paddingRight: 0,
              overflow: 'hidden',
            });

            // 2. Fade & scale out the exterior brand logo and right actions
            morphTl.to(
              [exteriorLogoRef.current, exteriorActionsRef.current],
              {
                autoAlpha: 0,
                y: -8,
                scale: 0.92,
                duration: 0.22,
                stagger: 0.03,
              },
              0
            );

            // 3. Smoothly bring the logo INTO the floating pill on the left
            morphTl.fromTo(
              pillLogoRef.current,
              { width: 0, autoAlpha: 0, x: -12 },
              {
                width: 'auto',
                autoAlpha: 1,
                x: 0,
                duration: 0.36,
                ease: 'back.out(1.25)',
              },
              0.1
            );

            // 4. Smoothly bring "Orçamento" INTO the floating pill on the right
            morphTl.fromTo(
              pillActionsRef.current,
              { width: 0, autoAlpha: 0, x: 12 },
              {
                width: 'auto',
                autoAlpha: 1,
                x: 0,
                duration: 0.36,
                ease: 'back.out(1.25)',
              },
              0.1
            );

            // 5. Enhance floating pill border when detached
            morphTl.to(
              navRef.current,
              {
                borderColor: 'rgba(255, 255, 255, 0.18)',
                duration: 0.25,
              },
              0.08
            );
          } else {
            // Mobile: keep pill logo visible inside the compact island with zero width layout thrashing
            gsap.set(pillLogoRef.current, {
              autoAlpha: 1,
              width: 'auto',
              clearProps: 'paddingLeft,paddingRight',
            });
            gsap.set(pillActionsRef.current, {
              autoAlpha: 0,
              width: 0,
              overflow: 'hidden',
            });

            morphTl.to(
              navRef.current,
              {
                y: -2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                duration: 0.22,
              },
              0
            );
          }

          // Trigger the floating transformation smoothly based on scroll distance
          ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
              const scrolled = self.scroll() > 50;
              if (scrolled) {
                if (reduceMotion) {
                  morphTl.progress(1);
                } else {
                  morphTl.play();
                }
              } else {
                if (reduceMotion) {
                  morphTl.progress(0);
                } else {
                  morphTl.reverse();
                }
              }
            },
          });

          // Ensure proper state if loaded with pre-scroll
          if (window.scrollY > 50) {
            morphTl.progress(1);
          }

          // Track active section in page order for the active pill
          NAV.forEach((item, index) => {
            const sectionEl = document.querySelector(item.href);
            if (!sectionEl) return;

            ScrollTrigger.create({
              trigger: sectionEl,
              start: 'top 45%',
              end: 'bottom 45%',
              refreshPriority: 100 - index,
              onEnter: () => setActiveHref(item.href),
              onEnterBack: () => setActiveHref(item.href),
            });
          });
        }
      );

      return () => mm.revert();
    },
    { scope: headerRef }
  );

  const handleNavClick = contextSafe((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    const pillEl = navRef.current?.querySelector('.nav-active-pill');
    const flipState = pillEl ? Flip.getState(pillEl) : null;

    setActiveHref(href);

    if (flipState) {
      requestAnimationFrame(() => {
        const nextPill = navRef.current?.querySelector('.nav-active-pill');
        if (nextPill) {
          Flip.from(flipState, {
            targets: nextPill,
            duration: 0.26,
            ease: 'power3.out',
            absolute: true,
          });
        }
      });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(window, {
      duration: reduceMotion ? 0 : 0.75,
      scrollTo: { y: targetEl, offsetY: href === '#inicio' ? 0 : 72 },
      ease: 'power3.inOut',
      overwrite: 'auto',
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
        className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 pointer-events-none transition-opacity duration-200 ease-emil-out"
      />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-center md:justify-between gap-2">
        {/* Exterior Left Brand Logo (present on desktop at the top of the page) */}
        <div ref={exteriorLogoRef} className="pointer-events-auto hidden md:flex items-center shrink-0">
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            aria-label="MeT Serviços — início"
            className="flex items-center gap-2 group active:scale-[0.97] transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105"
          >
            <img src="/assets/figma/logo-header.svg" alt="MeT Serviços" width={32} height={29.285} />
            <span className="font-extrabold uppercase text-sm tracking-tight text-[#1b2e51] whitespace-nowrap">
              MeT Serviços
            </span>
          </a>
        </div>

        {/* Central Floating Pill Menu */}
        <nav
          ref={navRef}
          aria-label="Principal"
          className="pointer-events-auto flex h-[44px] max-w-full items-center rounded-full border border-white/10 bg-[rgba(31,41,55,0.95)] px-1.5 md:px-[7px] py-[5px] backdrop-blur-md transition-[border-color,background-color,transform] duration-200 ease-emil-out"
        >
          {/* Integrated Pill Brand Logo (always visible on mobile; animated into the pill on desktop scroll) */}
          <div ref={pillLogoRef} className="flex items-center overflow-hidden shrink-0">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="flex items-center pl-2 pr-2 md:pr-2.5 py-1 active:scale-[0.95] transition-transform duration-150 ease-emil-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105"
              aria-label="MeT Serviços — início"
            >
              <img src="/assets/figma/logo-header-pill.svg" alt="MeT Serviços" width={24} height={22} className="md:w-[26px] md:h-[24px]" />
            </a>
            <div className="h-4 w-px bg-white/20 mr-1.5 md:mr-2 shrink-0" />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5">
            {NAV.map((n) => {
              const isActive = activeHref === n.href;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => handleNavClick(e, n.href)}
                  className={`relative flex h-8 md:h-7 items-center gap-1 md:gap-1.5 rounded-full px-2.5 sm:px-3 md:px-3.5 text-[11px] sm:text-xs leading-4 active:scale-[0.96] transition-[color,transform] duration-150 ease-emil-out whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'font-semibold text-[#111827]'
                      : 'font-medium text-[#d1d5db] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span
                      data-flip-id="header-active-pill"
                      className="nav-active-pill absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1 md:gap-1.5 whitespace-nowrap">
                    {n.isHome && (
                      <img
                        src="/assets/figma/home.svg"
                        alt=""
                        width={12}
                        height={12}
                        className={`md:w-[13px] md:h-[13px] ${isActive ? '' : 'invert brightness-200'}`}
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
