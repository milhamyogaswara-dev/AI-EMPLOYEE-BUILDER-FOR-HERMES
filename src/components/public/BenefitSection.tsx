import React from 'react';
import { 
  GitMerge, 
  Compass, 
  FlaskConical, 
  TrendingUp, 
  Plug, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface BenefitSectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const BenefitSection: React.FC<BenefitSectionProps> = ({ onOpenAuth }) => {
  const benefits = [
    {
      title: 'Lebih Terstruktur',
      desc: 'Role, SOP, skill, memory, dan authority berada dalam satu workflow visual yang kohesif.',
      icon: GitMerge,
    },
    {
      title: 'Lebih Mudah untuk Pemula',
      desc: 'Ikuti alur visual langkah demi langkah tanpa harus pusing memahami format konfigurasi teknis Hermes dari awal.',
      icon: Compass,
    },
    {
      title: 'Lebih Mudah Diuji',
      desc: 'Gunakan Test Lab untuk menyimulasikan percakapan nyata dan evaluasi skor kesiapan sebelum live.',
      icon: FlaskConical,
    },
    {
      title: 'Lebih Mudah Dikembangkan',
      desc: 'Assistant dapat terus dilatih, ditambahkan SOP baru, dan ditingkatkan kapabilitasnya seiring pertumbuhan bisnis.',
      icon: TrendingUp,
    },
    {
      title: 'Lebih Siap Diintegrasikan',
      desc: 'Siapkan koneksi tools, API, webhook, dan runtime Hermes melalui modul Integrations terpadu.',
      icon: Plug,
    },
  ];

  return (
    <section className="py-20 bg-[#0B0B0B] border-t border-white/5 relative" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Nilai Tambah
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Apa yang Anda Dapatkan?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Membangun sistem kerja AI dengan fondasi kokoh untuk produktivitas tim jangka panjang.
          </p>
        </div>

        {/* 5 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 18: User Guide Promo Banner */}
        <div className="bg-gradient-to-r from-[#171717] via-[#141414] to-[#1A110D] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/15 border border-[#FF5F1F]/30 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Onboarding Terpandu</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Tidak Tahu Mulai dari Mana? Panduan Langkah demi Langkah
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                Ikuti interactive roadmap lengkap di dalam aplikasi: mulai dari membuat AI Employee pertama, menambahkan skill, menyusun SOP dan memory, hingga pengujian keamanan dan deployment.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Interactive Tour
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Contextual Help Drawer
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Next Step Action Cards
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                type="button"
                id="btn-guide-promo-signup"
                onClick={() => onOpenAuth('signup')}
                className="px-6 py-4 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,95,31,0.3)] transition-all flex items-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <span>Mulai Setelah Daftar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
