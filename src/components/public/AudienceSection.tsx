import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Store, 
  Briefcase, 
  Laptop, 
  LineChart, 
  Palette, 
  Building2, 
  Bot 
} from 'lucide-react';

export const AudienceSection: React.FC = () => {
  const suitableFor = [
    { title: 'Owner Bisnis Online', icon: Store },
    { title: 'Agency Digital', icon: Briefcase },
    { title: 'Freelancer', icon: Laptop },
    { title: 'Marketer & Media Buyer', icon: LineChart },
    { title: 'Creator & Solopreneur', icon: Palette },
    { title: 'UMKM Digital', icon: Building2 },
    { title: 'Pengguna Hermes Agent', icon: Bot },
  ];

  const notFor = [
    'Pengguna yang mengharapkan AI bekerja sempurna 100% tanpa proses training atau arahan bisnis yang jelas.',
    'Pengguna yang tidak bersedia meluangkan waktu sedikit pun untuk menyusun SOP dan aturan workflow.',
    'Pengguna yang menganggap AI adalah pengganti mutlak seluruh tanggung jawab manusia tanpa supervisi.',
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative" id="audience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section: Cocok Untuk Siapa */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
              Kesesuaian Profil
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Cocok untuk Siapa?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Terutama untuk pengguna yang sudah mengenal AI atau Hermes Agent tetapi belum tahu bagaimana mengubahnya menjadi sistem kerja yang lebih produktif.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {suitableFor.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#FF5F1F]/40 transition-colors flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Bukan Untuk Siapa */}
        <div className="max-w-4xl mx-auto bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-semibold">
                EKSPEKTASI YANG REALISTIS
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Produk Ini Bukan Untuk...
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {notFor.map((text, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <XCircle className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
