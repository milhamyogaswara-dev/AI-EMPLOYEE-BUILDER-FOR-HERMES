import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, Shield } from 'lucide-react';

interface PublicHeaderProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Fitur', href: '#features' },
    { label: 'Cara Kerja', href: '#how-it-works' },
    { label: 'Use Case', href: '#use-cases' },
    { label: 'Bonus', href: '#bonus' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-white/5'
      }`}
      id="public-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group"
          id="brand-logo-link"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F1F1F] to-[#121212] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,95,31,0.2)] group-hover:border-[#FF5F1F]/50 transition-colors">
            <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-white transition-colors">
                AI Employee Builder
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30 uppercase">
                Hermes
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-mono tracking-wider">
              Autonomous Agent Studio
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" id="desktop-navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors py-1 hover:border-b hover:border-[#FF5F1F]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            id="btn-header-signin"
            onClick={() => onOpenAuth('signin')}
            className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            Masuk
          </button>
          <button
            type="button"
            id="btn-header-signup"
            onClick={() => onOpenAuth('signup')}
            className="px-5 py-2.5 text-xs font-semibold bg-[#FF5F1F] hover:bg-[#e04f14] text-white rounded-xl shadow-[0_0_20px_rgba(255,95,31,0.3)] transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            id="btn-mobile-signin-fast"
            onClick={() => onOpenAuth('signin')}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white border border-white/10 rounded-lg bg-white/5"
          >
            Masuk
          </button>
          <button
            type="button"
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3 mb-5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              id="btn-mobile-drawer-signin"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('signin');
              }}
              className="w-full py-2.5 text-xs font-medium text-center text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              id="btn-mobile-drawer-signup"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('signup');
              }}
              className="w-full py-3 text-xs font-semibold text-center text-white bg-[#FF5F1F] hover:bg-[#e04f14] rounded-xl shadow-lg shadow-[#FF5F1F]/20 flex items-center justify-center gap-2"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
