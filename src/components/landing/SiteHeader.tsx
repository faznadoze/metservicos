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
              duration: 0.6,
              ease: 'power3.out',
            });
          }

          // Initial state of pill extra items
          gsap.set([pillLogoRef.current, pillActionsRef.current], {
            autoAlpha: 0,
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            overflow: 'hidden',
          });

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
              duration: 0.3,
            },
            0
          );

          if (isDesktop) {
            // 2. Fade & scale out the exterior brand logo and right actions
            morphTl.to(
              [exteriorLogoRef.current, exteriorActionsRef.current],
              {
                autoAlpha: 0,
                y: -8,
                scale: 0.9,
                duration: 0.25,
                stagger: 0.03,
              },
              0
            );

            // 3. Smoothly bring the logo INTO the floating pill on the left
            morphTl.fromTo(
              pillLogoRef.current,
              { width: 0, autoAlpha: 0, x: -14 },
              {
                width: 'auto',
                autoAlpha: 1,
                x: 0,
                duration: 0.42,
                ease: 'back.out(1.3)',
              },
              0.12
            );

            // 4. Smoothly bring "Dúvidas" and "Orçamento" INTO the floating pill on the right
            morphTl.fromTo(
              pillActionsRef.current,
              { width: 0, autoAlpha: 0, x: 14 },
              {
                width: 'auto',
                autoAlpha: 1,
                x: 0,
                duration: 0.42,
                ease: 'back.out(1.3)',
              },
              0.12
            );

            // 5. Enhance floating pill shadow & backdrop when detached
            morphTl.to(
              navRef.current,
              {
                boxShadow:
                  '0px 20px 30px -4px rgba(0,0,0,0.35), 0px 8px 12px -6px rgba(0,0,0,0.25)',
                borderColor: 'rgba(255, 255, 255, 0.18)',
                duration: 0.35,
              },
              0.1
            );
          } else {
            // Mobile adjustments: compact floating pill
            morphTl.to(
              [exteriorLogoRef.current, exteriorActionsRef.current],
              {
                autoAlpha: 0,
                y: -6,
                duration: 0.2,
              },
              0
            );

            morphTl.fromTo(
              pillLogoRef.current,
              { width: 0, autoAlpha: 0 },
              {
                width: 'auto',
                autoAlpha: 1,
                duration: 0.35,
              },
              0.1
            );

            morphTl.fromTo(
              pillActionsRef.current,
              { width: 0, autoAlpha: 0 },
              {
                width: 'auto',
                autoAlpha: 1,
                duration: 0.35,
              },
              0.1
            );
          }

          // Trigger the floating transformation smoothly based on scroll distance
          ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
              const scrolled = self.scroll() > 65;
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
          if (window.scrollY > 65) {
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
            duration: 0.35,
            ease: 'power2.out',
            absolute: true,
          });
        }
      });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(window, {
      duration: reduceMotion ? 0 : 0.85,
      scrollTo: { y: targetEl, offsetY: href === '#inicio' ? 0 : 72 },
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  });

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40 pointer-events-none px-4 pt-3.5 pb-2 md:px-10 will-change-transform"
    >
      {/* Full-width subtle background bar at the very top (dissolves when scrolling) */}
      <div
        ref={headerBgRef}
        className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 pointer-events-none transition-opacity"
      />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between gap-2">
        {/* Exterior Left Brand Logo (present at the top of the page) */}
        <div ref={exteriorLogoRef} className="pointer-events-auto flex items-center shrink-0">
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            aria-label="MeT Serviços — início"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <img src="/assets/figma/logo-header.svg" alt="MeT Serviços" width={32} height={29.285} />
            <span className="hidden sm:inline font-extrabold uppercase text-sm tracking-tight text-[#1b2e51]">
              MeT Serviços
            </span>
          </a>
        </div>

        {/* Central Floating Pill Menu */}
        <nav
          ref={navRef}
          aria-label="Principal"
          className="pointer-events-auto flex h-[44px] items-center rounded-full border border-white/10 bg-[rgba(31,41,55,0.95)] px-[7px] py-[5px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.15),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300"
        >
          {/* Integrated Pill Brand Logo (animated into the pill on scroll) */}
          <div ref={pillLogoRef} className="flex items-center overflow-hidden shrink-0">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="flex items-center pl-2 pr-2.5 py-1 transition-transform hover:scale-105"
              aria-label="MeT Serviços — início"
            >
              <img src="/assets/figma/logo-header-pill.svg" alt="MeT Serviços" width={26} height={24} />
            </a>
            <div className="h-4 w-px bg-white/20 mr-2 shrink-0" />
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
                  className={`relative flex h-7 items-center gap-1.5 rounded-full px-3.5 text-xs leading-4 active:scale-[0.97] transition-[color,transform] duration-150 ease-out ${
                    isActive ? 'font-semibold text-[#111827]' : 'font-medium text-[#d1d5db] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span
                      data-flip-id="header-active-pill"
                      className="nav-active-pill absolute inset-0 rounded-full bg-white shadow-xs"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                    {n.isHome && (
                      <img
                        src="/assets/figma/home.svg"
                        alt=""
                        width={13}
                        height={13}
                        className={isActive ? '' : 'invert brightness-200'}
                      />
                    )}
                    {n.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Integrated Pill Actions (Orçamento animated into the pill on scroll) */}
          <div ref={pillActionsRef} className="flex items-center overflow-hidden shrink-0">
            <div className="h-4 w-px bg-white/20 ml-1.5 mr-2 shrink-0" />
            <button
              type="button"
              onClick={onQuoteClick}
              className="cursor-pointer rounded-full bg-white hover:bg-[#b7dcfb] active:scale-[0.96] px-3.5 h-7 flex items-center justify-center text-xs font-semibold text-[#111827] shadow-sm transition-[transform,background-color] duration-150 ease-out whitespace-nowrap"
            >
              Orçamento
            </button>
          </div>
        </nav>

        {/* Exterior Right Actions (present at the top of the page) */}
        <div ref={exteriorActionsRef} className="pointer-events-auto flex items-center justify-self-end shrink-0">
          <button
            type="button"
            onClick={onQuoteClick}
            className="cursor-pointer rounded-full border border-[#e5e7eb] bg-white px-[17px] py-[9px] text-sm font-semibold text-[#111827] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:bg-gray-50 active:scale-[0.96] transition-[transform,background-color,box-shadow] duration-150 ease-out"
          >
            Orçamento
          </button>
        </div>
      </div>
    </header>
  );
}
