import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { MetLogo } from './MetLogo';
import { COMPANY_CONFIG } from '../content/landingPage';

interface HeaderProps {
  onRequestQuoteClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestQuoteClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: 'Serviços', href: '#servicos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'Dúvidas', href: '#duvidas' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1933]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single clean Brand lockup */}
        <a
          href="#topo"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFD21A] rounded-md"
        >
          <MetLogo className="w-8 h-8 shrink-0" variant="badge" />
          <span className="font-display">{COMPANY_CONFIG.brandName}</span>
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#FFD21A] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#FFD21A] focus-visible:outline-2 focus-visible:outline-[#FFD21A] rounded-xs"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRequestQuoteClick}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD21A]"
          >
            Pedir orçamento
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-white hover:text-[#FFD21A] rounded-lg border border-white/15 focus-visible:outline-2 focus-visible:outline-[#FFD21A]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#0B1933] border-b border-white/15 px-6 py-4 space-y-3"
        >
          <nav aria-label="Navegação móvel" className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-100 hover:text-[#FFD21A] py-2 border-b border-white/5 transition-colors"
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
            className="w-full py-2.5 px-4 text-sm font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-lg transition-colors text-center"
          >
            Pedir orçamento
          </button>
        </div>
      )}
    </header>
  );
};
