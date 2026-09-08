import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenAuth }) => {
  return (
    <section className="py-24 bg-[#080808] border-t border-white/5 relative overflow-hidden" id="final-cta">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#FF5F1F]/20 via-[#FF5F1F]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 lg:p-16 rounded-3xl bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-[#FF5F1F]/30 shadow-[0_0_50px_rgba(255,95,31,0.15)] relative overflow-hidden">
          {/* Subtle decorative badges */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5F1F]/15 border border-[#FF5F1F]/30 text-[#FF5F1F] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Workforce Studio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-2xl mx-auto">
            Hermes Agent Anda Siap Naik Level?
          </h2>

          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mb-10 max-w-xl mx-auto">
            Mulai bangun AI Employee yang punya role, SOP, skill, memory, authority, dan workflow yang lebih jelas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
            <button
              type="button"
              id="btn-final-cta-signup"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-semibold text-sm sm:text-base shadow-[0_0_30px_rgba(255,95,31,0.4)] transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              id="btn-final-cta-signin"
              onClick={() => onOpenAuth('signin')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-gray-200 hover:text-white font-medium text-sm sm:text-base border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              Sudah Punya Akun? Masuk
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#FF5F1F]" />
            <span>Setup terpandu • Siap integrasi Hermes • Template gratis disertakan</span>
          </div>
        </div>
      </div>
    </section>
  );
};
