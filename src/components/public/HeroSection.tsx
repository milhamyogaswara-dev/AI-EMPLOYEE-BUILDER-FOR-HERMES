import React from 'react';
import { ArrowRight, Sparkles, Play, ShieldCheck, CheckCircle2, Cpu, Terminal, Zap } from 'lucide-react';
import heroImage from '../../assets/images/hero_ai_employee_1788859845741.jpg';

interface HeroSectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#070707]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5F1F]/15 via-[#FF5F1F]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#FF5F1F]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle background tech grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF5F1F] font-mono text-[11px] font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(255,95,31,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-pulse" />
              <span>AI EMPLOYEE BUILDER FOR HERMES</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
              Ubah Hermes Agent Jadi{' '}
              <span className="text-[#FF5F1F] drop-shadow-[0_0_25px_rgba(255,95,31,0.35)]">
                AI Employee
              </span>{' '}
              yang Benar-Benar Bekerja
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mb-8 max-w-2xl">
              Bukan sekadar memakai Hermes Agent untuk chat. Bangun role, SOP, skill, memory, 
              authority, tools, dan automation agar Agent lebih siap membantu pekerjaan nyata 
              dalam bisnis Anda.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <button
                type="button"
                id="btn-hero-cta-primary"
                onClick={() => onOpenAuth('signup')}
                className="px-7 py-4 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(255,95,31,0.35)] transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
              >
                <span>Mulai Bangun AI Employee</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                id="btn-hero-cta-secondary"
                onClick={scrollToHowItWorks}
                className="px-6 py-4 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] text-gray-200 hover:text-white font-medium text-sm sm:text-base border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#FF5F1F] fill-[#FF5F1F]" />
                <span>Lihat Cara Kerja</span>
              </button>
            </div>

            {/* Small Trust/Support Text */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 max-w-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF5F1F] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Cocok untuk owner bisnis, agency, freelancer, marketer, dan pengguna Hermes Agent 
                yang ingin mengoptimalkan AI untuk pekerjaan nyata.
              </p>
            </div>
          </div>

          {/* Right Column: Hero Visual with Holographic UI Overlays */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame glow */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-b from-[#FF5F1F]/40 to-white/5 opacity-60 blur-lg" />

              {/* Main Visual Container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#121212] shadow-2xl">
                <img
                  src={heroImage}
                  alt="Human business operator collaborating with holographic AI Employee"
                  className="w-full h-auto object-cover aspect-square"
                  loading="eager"
                />

                {/* Gradient vignette for futuristic depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Holographic Badge 1: Top Right */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[#FF5F1F]/40 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-white">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-ping" />
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-[#FF5F1F]">
                    AUTONOMOUS WORKFORCE
                  </span>
                </div>

                {/* Floating Holographic Card: Bottom Left */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#FF5F1F]" />
                      <span className="text-xs font-mono font-bold text-white">Agent Matrix Loaded</span>
                    </div>
                    <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      Readiness 98%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10 text-[10px] font-mono">
                    <div className="bg-white/5 rounded p-1">
                      <div className="text-gray-400">SOP</div>
                      <div className="text-[#FF5F1F] font-bold">12 Steps</div>
                    </div>
                    <div className="bg-white/5 rounded p-1">
                      <div className="text-gray-400">MEMORY</div>
                      <div className="text-[#FF5F1F] font-bold">Encrypted</div>
                    </div>
                    <div className="bg-white/5 rounded p-1">
                      <div className="text-gray-400">AUTONOMY</div>
                      <div className="text-[#FF5F1F] font-bold">Gated (Safe)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Accent Tag: Bottom Right */}
              <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-[#141414] border border-[#FF5F1F]/40 p-3 rounded-xl shadow-2xl items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF5F1F]/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#FF5F1F]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Hermes Runtime Ready</div>
                  <div className="text-[10px] text-gray-400 font-mono">Export to YAML & JSON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
