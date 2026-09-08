import React from 'react';
import { MessageSquareOff, Repeat, BrainCircuit, TrendingDown } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: MessageSquareOff,
      title: 'Masih Cuma Buat Chat',
      description:
        'Hermes Agent sudah tersedia tetapi belum memiliki role, SOP, dan workflow yang jelas.',
      badge: 'PROBLEM #1',
    },
    {
      icon: Repeat,
      title: 'Tugas Rutin Tetap Manual',
      description:
        'AI sudah ada tetapi pekerjaan operasional masih dikerjakan satu per satu oleh manusia.',
      badge: 'PROBLEM #2',
    },
    {
      icon: BrainCircuit,
      title: 'Bingung Melatih Agent',
      description:
        'Tidak tahu bagaimana menyusun skill, memory, authority, maupun automation yang aman.',
      badge: 'PROBLEM #3',
    },
    {
      icon: TrendingDown,
      title: 'Sulit Mendapat Value Nyata',
      description:
        'Tools AI sudah digunakan tetapi belum terasa dampaknya terhadap produktivitas bisnis Anda.',
      badge: 'PROBLEM #4',
    },
  ];

  return (
    <section className="py-20 bg-[#0B0B0B] border-t border-white/5 relative" id="problems">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Tantangan Pengguna AI Saat Ini
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
            Punya Hermes Agent, Tapi Masih Belum Tahu Mau Diapakan?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Banyak pebisnis dan profesional memiliki akses ke AI canggih, tetapi terjebak pada penggunaan dangkal yang tidak menghasilkan efisiensi operasional terukur.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.title}
                className="group relative bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {prob.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-white transition-colors">
                    {prob.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-red-400/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                  <span>Bottleneck Operasional</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
