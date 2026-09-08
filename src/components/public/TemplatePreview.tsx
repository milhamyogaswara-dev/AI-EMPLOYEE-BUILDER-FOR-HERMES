import React from 'react';
import { ArrowRight, LayoutTemplate, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface TemplatePreviewProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ onOpenAuth }) => {
  const templates = [
    {
      title: 'Digital Marketing Assistant',
      category: 'Marketing',
      desc: 'SOP riset audiens Facebook & Google Ads, copywriting teruji, dan pembuatan laporan mingguan.',
      modulesReady: 'SOP + 4 Skills + Rules',
    },
    {
      title: 'Executive Assistant',
      category: 'Operations',
      desc: 'Ringkasan briefing pagi, sortir prioritas email, koordinasi agenda, dan riset cepat sebelum meeting.',
      modulesReady: 'SOP + Memory + 3 Skills',
    },
    {
      title: 'Content Creator Assistant',
      category: 'Creative',
      desc: 'Perencana kalender konten 30 hari, penulisan hook viral, script TikTok, dan repurposing ke LinkedIn/Twitter.',
      modulesReady: 'SOP + 5 Skills + Voice',
    },
    {
      title: 'Research Analyst',
      category: 'Analysis',
      desc: 'Framework sintesis data industri, pemantauan pergerakan kompetitor, dan pembuatan executive brief.',
      modulesReady: 'SOP + Memory Vault',
    },
    {
      title: 'Customer Success Specialist',
      category: 'Support',
      desc: 'Template SOP penanganan komplain, klasifikasi tiket kendala, dan template balasan ramah standar perusahaan.',
      modulesReady: 'Authority Gate + SOP',
    },
    {
      title: 'E-Commerce Operator',
      category: 'Commerce',
      desc: 'Audit deskripsi produk marketplace, riset kata kunci pencarian, dan strategi bundling promo berkala.',
      modulesReady: 'SOP + 3 Skills + Automation',
    },
  ];

  return (
    <section className="py-20 bg-[#080808] border-t border-white/5 relative" id="templates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Ready-to-Deploy Templates</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Tidak Mau Mulai dari Nol?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Gunakan template AI Employee sebagai titik awal. Langsung kloning role, SOP, dan konfigurasi siap pakai ke workspace Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((tpl) => (
            <div
              key={tpl.title}
              className="bg-[#121212] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl flex flex-col justify-between group transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#FF5F1F] px-2 py-0.5 rounded bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-white">
                  {tpl.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-5">
                  {tpl.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">{tpl.modulesReady}</span>
                <span className="text-[#FF5F1F] group-hover:underline flex items-center gap-1 font-semibold">
                  1-Click Clone
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            id="btn-template-preview-signup"
            onClick={() => onOpenAuth('signup')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#FF5F1F]/40 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
            <span>Lihat Seluruh Template di Dalam Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
