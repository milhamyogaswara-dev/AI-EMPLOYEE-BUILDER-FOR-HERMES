import React from 'react';
import { 
  Megaphone, 
  PenTool, 
  SearchCheck, 
  Briefcase, 
  Headphones, 
  ShoppingBag,
  Check
} from 'lucide-react';

export const UseCaseSection: React.FC = () => {
  const useCases = [
    {
      title: 'Digital Marketing Assistant',
      desc: 'Membantu riset dan optimasi kampanye promosi digital secara terus menerus.',
      icon: Megaphone,
      skills: ['Meta Ads Analysis', 'Competitor Research', 'Campaign Reporting', 'High-Converting Copywriting'],
    },
    {
      title: 'Content Assistant',
      desc: 'Memproduksi pilar konten media sosial, skrip video, dan artikel secara terjadwal.',
      icon: PenTool,
      skills: ['Content Research', 'Content Planning & Editorial', 'Hook & Copywriting', 'Format Repurposing'],
    },
    {
      title: 'Research Assistant',
      desc: 'Mengumpulkan intelijen pasar dan merangkum dokumen kompleks dalam hitungan menit.',
      icon: SearchCheck,
      skills: ['Market Trend Research', 'Competitor Analysis', 'Data Synthesis', 'Executive Summary'],
    },
    {
      title: 'Executive Assistant',
      desc: 'Mendampingi pemilik bisnis dalam mengelola agenda, prioritas, dan ringkasan kerja.',
      icon: Briefcase,
      skills: ['Daily Briefing', 'Task Prioritization', 'Meeting Preparation', 'Operational Reporting'],
    },
    {
      title: 'Customer Support Assistant',
      desc: 'Menangani inquiry pelanggan awal dengan sopan, cepat, dan sesuai SOP perusahaan.',
      icon: Headphones,
      skills: ['FAQ Handling', 'Ticket Classification', 'Response Drafting', 'Escalation Workflow'],
    },
    {
      title: 'E-Commerce Assistant',
      desc: 'Mengoptimalkan katalog produk toko online dan memantau ulasan pembeli.',
      icon: ShoppingBag,
      skills: ['Product Research', 'Listing Optimization', 'Customer Review Analysis', 'Promotion Planning'],
    },
  ];

  return (
    <section className="py-20 bg-[#0B0B0B] border-t border-white/5 relative" id="use-cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Implementasi Nyata
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            AI Employee Bisa Dibentuk Sesuai Kebutuhan Anda
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Pilih satu fokus spesialisasi atau bangun beberapa AI Employee untuk berbagai departemen operasional bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white">
                    {uc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                    {uc.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF5F1F] font-bold mb-2">
                    KAPABILITAS TERMASUK:
                  </div>
                  {uc.skills.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                      <Check className="w-3.5 h-3.5 text-[#FF5F1F] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
