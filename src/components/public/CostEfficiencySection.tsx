import React from 'react';
import { Calculator, ArrowUpRight, Check, TrendingUp, Users } from 'lucide-react';

export const CostEfficiencySection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080808] border-t border-white/5 relative overflow-hidden" id="cost-efficiency">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5F1F]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Calculator className="w-80 h-80 text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/15 border border-[#FF5F1F]/30 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-5">
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulasi Efisiensi Bisnis</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-5">
                Sebelum Tambah Headcount, Optimalkan AI yang Sudah Anda Punya
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                AI bukan selalu pengganti manusia. Tetapi pekerjaan repetitif sebaiknya tidak selalu membutuhkan tambahan headcount.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5F1F]/20 text-[#FF5F1F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    Otomatisasi perakitan SOP rutin tanpa perlu micro-management harian.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5F1F]/20 text-[#FF5F1F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    Karyawan manusia Anda dapat fokus pada closing, relasi klien, dan inovasi strategis.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5F1F]/20 text-[#FF5F1F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    AI Employee bekerja 24/7 dengan konsistensi SOP yang tidak pernah lelah.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Cost Comparison Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#1A1A1A] border border-[#FF5F1F]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(255,95,31,0.15)] relative">
                <div className="text-[11px] font-mono text-[#FF5F1F] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Contoh Simulasi Biaya</span>
                  <span className="text-gray-400">1 Orang Staf</span>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                  Rp5 JUTA <span className="text-sm font-normal text-gray-400">/ BULAN</span>
                </div>

                <div className="text-xs font-mono text-gray-400 mb-6 flex items-center gap-2">
                  <span>Setara dengan</span>
                  <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                    Rp60 Juta / Tahun
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 leading-relaxed mb-4">
                  <em>&ldquo;Jika tambahan satu staf operasional membutuhkan sekitar Rp5 juta per bulan, nilainya bisa mencapai Rp60 juta per tahun.&rdquo;</em>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  *Catatan: Angka di atas merupakan contoh simulasi ilustratif untuk pekerjaan repetitif dan dapat berbeda sesuai skala masing-masing bisnis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
