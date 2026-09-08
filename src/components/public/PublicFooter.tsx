import React from 'react';
import { Sparkles } from 'lucide-react';

interface PublicFooterProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenAuth }) => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 py-14" id="public-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">
                  AI Employee Builder
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30 uppercase">
                  Hermes
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Latih dan optimalkan Hermes Agent untuk produktivitas operasional bisnis.
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => scrollTo('#hero')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Fitur
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cara Kerja
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#bonus')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Bonus
            </button>
            <button
              type="button"
              onClick={() => scrollTo('#faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              id="btn-footer-signin"
              onClick={() => onOpenAuth('signin')}
              className="text-[#FF5F1F] hover:underline font-medium cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} AI Employee Builder for Hermes. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Built for Hermes Autonomous Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
