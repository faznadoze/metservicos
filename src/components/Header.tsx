import React, { useState, useEffect } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { MetLogo } from './MetLogo';
import { COMPANY_CONFIG, ServiceInterest } from '../content/landingPage';
import { buildServiceWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';

interface HeaderProps {
  selectedInterest: ServiceInterest;
  onRequestQuoteClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedInterest,
  onRequestQuoteClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string>('#topo');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Início', href: '#topo', isHome: true },
    { label: 'Serviços', href: '#servicos', isHome: false },
    { label: 'Como funciona', href: '#como-funciona', isHome: false },
    { label: 'Benefícios', href: '#beneficios', isHome: false },
    { label: 'Dúvidas', href: '#duvidas', isHome: false },
  ];

  const whatsappHref = buildServiceWhatsAppUrl(selectedInterest);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
        {/* Left: Brand Lockup */}
        <a
          href="#topo"
          onClick={() => setActiveNav('#topo')}
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-[#0B1933] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0582E8] rounded-md"
        >
          <MetLogo className="w-8 h-8 shrink-0" variant="transparent" />
          <span className="font-display">{COMPANY_CONFIG.brandName}</span>
        </a>

        {/* Center: Dark Segmented Capsule Navigation (matching reference image) */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-1 p-1.5 bg-[#0B1933] rounded-full shadow-xs"
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveNav(item.href)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFD21A] ${
                  isActive
                    ? 'bg-white text-[#0B1933] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.isHome && <Home className="w-3.5 h-3.5 shrink-0" />}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Secondary Link + Bordered Pill CTA (matching reference image) */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('click_whatsapp_hero', { source: 'header_link' })}
            className="hidden sm:inline-block text-xs font-semibold text-slate-700 hover:text-[#0B1933] transition-colors whitespace-nowrap shrink-0"
          >
            WhatsApp Direto
          </a>

          <button
            type="button"
            onClick={onRequestQuoteClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-[#0B1933] bg-white hover:bg-[#0B1933] hover:text-white border border-slate-300 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1933]"
          >
            Pedir orçamento
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#0B1933] hover:bg-slate-100 rounded-full border border-slate-200 focus-visible:outline-2 focus-visible:outline-[#0B1933]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3"
        >
          <nav aria-label="Navegação móvel" className="flex flex-col space-y-1.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveNav(item.href);
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-semibold text-[#0B1933] hover:text-[#0582E8] py-2 border-b border-slate-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onRequestQuoteClick();
            }}
            className="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#0B1933] hover:bg-[#172D55] rounded-full transition-colors text-center"
          >
            Pedir orçamento
          </button>
        </div>
      )}
    </header>
  );
};
