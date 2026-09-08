import React from 'react';
import { Gift, Sparkles, Check, FileCode, Layers, ShieldCheck, DollarSign, ListChecks } from 'lucide-react';

export const BonusSection: React.FC = () => {
  const bonuses = [
    {
      num: 'BONUS #1',
      title: '30 Ready-to-Use AI Employee Templates',
      desc: 'Template siap pakai untuk marketing, sales, content creation, riset, customer service, hingga operasional bisnis.',
      icon: Layers,
    },
    {
      num: 'BONUS #2',
      title: '100+ SOP & Workflow Library',
      desc: 'Kumpulan instruksi langkah-demi-langkah standar industri yang dapat langsung Anda pasang ke modul SOP Builder.',
      icon: ListChecks,
    },
    {
      num: 'BONUS #3',
      title: 'Hermes Skill & Integration Starter Pack',
      desc: 'Contoh konfigurasi integrasi tools, webhook event listener, dan format pemanggilan fungsi yang kompatibel.',
      icon: FileCode,
    },
    {
      num: 'BONUS #4',
      title: 'AI Employee Testing & Optimization Kit',
      desc: 'Bank skenario uji coba untuk menguji ketahanan agent, mendeteksi halusinasi, dan mengukur skor kesiapan.',
      icon: ShieldCheck,
    },
    {
      num: 'BONUS #5',
      title: 'AI Employee Monetization Idea Pack',
      desc: 'Ide dan strategi menawarkan jasa perakitan AI Employee untuk klien agency, UMKM, dan profesional lainnya.',
      icon: DollarSign,
    },
    {
      num: 'BONUS #6',
      title: 'AI Employee Readiness Checklist',
      desc: 'Checklist audit sebelum mendeploy AI Employee ke lingkungan operasional nyata atau tim internal.',
      icon: Check,
    },
  ];

  return (
    <section className="py-20 bg-[#080808] border-t border-white/5 relative" id="bonus">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/15 border border-[#FF5F1F]/30 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            <Gift className="w-3.5 h-3.5" />
            <span>Value Bundling</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Termasuk Aplikasi Utama + Bonus Siap Pakai
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Semua yang Anda butuhkan untuk mempercepat implementasi AI Employee tanpa perlu menulis dari nol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bonuses.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm relative overflow-hidden"
              >
                {/* Free Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30 uppercase">
                    INCLUDED FREE
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-3">
                    {b.num}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2.5 group-hover:text-white leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-green-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Langsung Tersedia di Workspace</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
