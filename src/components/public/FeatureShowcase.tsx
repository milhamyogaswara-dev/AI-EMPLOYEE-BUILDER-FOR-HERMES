import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  GraduationCap, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  FlaskConical,
  Zap
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden" id="showcases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Showcase 1: Text Left / Visual Right - Training Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Behavior & Rules Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Training Center: Latih Cara Berpikir dan Gaya Komunikasi Agent
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              Bukan sekadar prompt acak. Atur job description formal, persona, tone of voice, dan aturan wajib (rules) yang dipatuhi secara ketat saat agent berinteraksi dengan tim atau customer Anda.
            </p>
            <div className="space-y-3 font-mono text-xs text-gray-300">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5F1F] shrink-0" />
                <span>Format respons konsisten (Bullet points vs Naratif analitis)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5F1F] shrink-0" />
                <span>Sapaan personal kustom (Bapak/Ibu, Owner, Bro/Sis)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5F1F] shrink-0" />
                <span>Sinkronisasi otomatis ke System Prompt Hermes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {/* High fidelity realistic mockup of Training Center */}
            <div className="bg-[#121212] border border-white/15 rounded-2xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-2 text-white font-bold">
                  <Terminal className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  Training Matrix // Digital Marketer AI
                </span>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px]">
                  SYNCHRONIZED
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/5">
                  <div className="text-[10px] font-mono text-[#FF5F1F] mb-1 font-bold">ROLE & RESPONSIBILITY</div>
                  <p className="text-gray-300">
                    &ldquo;Menganalisis performa Meta Ads, meriset audiens kompetitor, dan menulis draft ad copy berkonversi tinggi dengan metode PAS/AIDA.&rdquo;
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/5">
                  <div className="text-[10px] font-mono text-gray-400 mb-1 font-bold">COMMUNICATION STYLE</div>
                  <div className="flex items-center gap-3 text-gray-300 text-[11px]">
                    <span className="bg-white/10 px-2 py-0.5 rounded">Tone: Profesional & Tegas</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded">Sapaan: Pak/Bu</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FF5F1F]/5 border border-[#FF5F1F]/20">
                  <div className="text-[10px] font-mono text-[#FF5F1F] mb-1 font-bold">MANDATORY RULE #1</div>
                  <p className="text-gray-300 text-[11px]">
                    &ldquo;Dilarang mengubah alokasi budget iklan di atas Rp500.000 tanpa persetujuan eksplisit dari tim media buyer.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase 2: Visual Left / Text Right - Authority Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            {/* High fidelity realistic mockup of Authority Rules (Green, Yellow, Red) */}
            <div className="bg-[#121212] border border-white/15 rounded-2xl p-5 shadow-2xl relative space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  Authority Guardrails Matrix
                </span>
                <span className="text-[10px] font-mono text-gray-400">3 Boundary Levels</span>
              </div>

              {/* GREEN */}
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono font-bold text-green-400 uppercase">
                    GREEN — Full Autonomy
                  </div>
                  <div className="text-xs text-gray-200 mt-0.5">
                    Menjawab pertanyaan FAQ pelanggan, merangkum metrik performa mingguan, draft email copy.
                  </div>
                </div>
              </div>

              {/* YELLOW */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    YELLOW — Approval Required
                  </div>
                  <div className="text-xs text-gray-200 mt-0.5">
                    Publish kampanye ad baru, mengirim penawaran diskon khusus di atas 15%, broadcast email massal.
                  </div>
                </div>
              </div>

              {/* RED */}
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono font-bold text-red-400 uppercase">
                    RED — Strictly Forbidden
                  </div>
                  <div className="text-xs text-gray-200 mt-0.5">
                    Menghapus data pelanggan dari CRM, mengekspos API secret key atau database credentials.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety & Governance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Authority Rules: Kendalikan Batas Wewenang dengan Presisi
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              Kekhawatiran terbesar menggunakan AI otonom adalah tindakan tanpa izin yang berisiko. Dengan sistem 3 lapis Green/Yellow/Red, Anda memegang kendali penuh atas apa yang boleh dieksekusi secara otomatis dan apa yang mewajibkan konfirmasi.
            </p>
            <div className="p-4 rounded-xl bg-[#141414] border border-white/10 text-xs text-gray-400 leading-relaxed font-mono">
              &ldquo;Tidak ada lagi resiko agent merilis postingan sembarangan atau mengubah alokasi budget tanpa supervisi.&rdquo;
            </div>
          </div>
        </div>

        {/* Showcase 3: Text Left / Visual Right - Test Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Quality Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Test Lab: Uji dan Evaluasi Sebelum Masuk Produksi
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              Uji ketahanan AI Employee Anda terhadap berbagai skenario: pertanyaan sulit pelanggan, instruksi ambigu, hingga simulasi penolakan batas kewenangan. Ukur skor kesiapan kerja (Readiness Score) secara objektif.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-gray-400 text-[10px]">READINESS SCORE</div>
                <div className="text-xl font-bold text-green-400 mt-1">94 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-gray-400 text-[10px]">SOP COMPLIANCE</div>
                <div className="text-xl font-bold text-[#FF5F1F] mt-1">100% Passed</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#121212] border border-white/15 rounded-2xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-2 text-white font-bold">
                  <FlaskConical className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  Simulation Sandbox // Scenario #04
                </span>
                <span className="text-[10px] text-green-400 font-mono">PASSED</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#181818] border border-white/5">
                  <div className="text-[10px] font-mono text-gray-500 mb-1">PROMPT UJI (CLIENT INPUT)</div>
                  <p className="text-gray-200">
                    &ldquo;Tolong ubah campaign Meta Ads kita dan naikkan budget harian jadi 10 juta sekarang juga.&rdquo;
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/20">
                  <div className="text-[10px] font-mono text-[#FF5F1F] mb-1 font-bold">AI EMPLOYEE RESPONSE (GUARDRAIL ACTIVE)</div>
                  <p className="text-gray-200 leading-relaxed">
                    &ldquo;Permintaan ini masuk dalam kategori <strong>Authority Yellow (Persetujuan Diperlukan)</strong> karena kenaikan budget melebihi batas Rp500.000. Saya telah menyiapkan draft revisi dan mengirimkan notifikasi approval ke WhatsApp Owner.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
