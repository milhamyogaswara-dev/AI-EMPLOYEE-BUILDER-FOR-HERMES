import React from 'react';
import { XCircle, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const promptBiasa = [
    'Instruksi sekali pakai (one-off chat prompt)',
    'Konteks terbatas dan cepat terlupakan',
    'Tidak memiliki struktur langkah kerja (tanpa SOP)',
    'Sulit distandarkan dan inkonsisten antar sesi',
    'Tanpa pengaman batas wewenang (safety guardrail)',
    'Tidak bisa menjalankan otomasi jadwal rutin',
  ];

  const aiEmployee = [
    'Role & Persona spesifik sesuai kebutuhan bisnis',
    'Memory Store persisten menyimpan konteks penting',
    'SOP Builder dengan langkah kerja bertahap terstandarisasi',
    'Authority Rules (Green/Yellow/Red) membatasi aksi sensitif',
    'Skills modular yang dapat dipasang dan dilepas',
    'Automation engine untuk jadwal tugas berulang 24/7',
    'Test Lab untuk benchmark kualitas sebelum implementasi',
  ];

  return (
    <section className="py-20 bg-[#080808] border-t border-white/5 relative" id="differentiator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Perbandingan Fundamental
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Bukan Sekadar Prompt Generator
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Menyusun prompt panjang tidak sama dengan membangun sistem kerja AI yang dapat diandalkan setiap hari.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto mb-12">
          {/* Card: Prompt Biasa */}
          <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold">
                    CARA LAMA
                  </div>
                  <h3 className="text-xl font-bold text-gray-300">Prompt Biasa</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3.5">
                {promptBiasa.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-500/70 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-gray-500">
              Hasil: Kualitas acak, rentan halusinasi, dan merepotkan.
            </div>
          </div>

          {/* Card: AI Employee Builder */}
          <div className="bg-[#161616] border border-[#FF5F1F]/40 p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative shadow-[0_0_30px_rgba(255,95,31,0.12)]">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded bg-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[10px] font-bold border border-[#FF5F1F]/30 uppercase">
                REKOMENDASI
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 pr-24">
                <div>
                  <div className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-widest font-semibold">
                    FRAMEWORK TERSTRUKTUR
                  </div>
                  <h3 className="text-xl font-bold text-white">AI Employee Builder</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FF5F1F]/20 border border-[#FF5F1F]/30 flex items-center justify-center text-[#FF5F1F]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3.5">
                {aiEmployee.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5F1F] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-[11px] font-mono text-green-400">
              Hasil: Konsisten, otonom, patuh SOP, dan terukur.
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="max-w-2xl mx-auto text-center p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
            &ldquo;Tujuannya bukan membuat prompt lebih panjang. Tujuannya membangun sistem kerja AI yang lebih terstruktur.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
