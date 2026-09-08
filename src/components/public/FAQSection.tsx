import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa bedanya AI Employee Builder dengan memakai Hermes Agent biasa?',
      a: 'Hermes Agent biasa sering kali hanya dipakai untuk instruksi percakapan umum. AI Employee Builder membantu Anda menyusun identitas role, SOP kerja, skill teknis, memory bisnis, aturan batasan wewenang (authority rules), hingga jadwal otomasi agar agent bekerja konsisten selayaknya karyawan operasional.',
    },
    {
      q: 'Apakah saya harus paham coding untuk menggunakannya?',
      a: 'Tidak. Seluruh konfigurasi disediakan dalam antarmuka visual terstruktur: form role, editor SOP, selector skill, memory store, dan pengatur batasan wewenang yang mudah dipahami oleh pemilik bisnis, marketer, maupun pemula.',
    },
    {
      q: 'Apakah aplikasi ini menggantikan seluruh karyawan manusia?',
      a: 'Tidak. AI Employee dirancang untuk mengotomatisasi pekerjaan rutin, repetitif, dan memakan waktu (seperti riset, draft penulisan, monitoring, dan klasifikasi) sehingga tim Anda dapat berfokus pada strategi dan keputusan penting bernilai tinggi.',
    },
    {
      q: 'Apakah AI Employee bisa dikonfigurasi untuk beberapa role berbeda?',
      a: 'Ya. Anda dapat membuat beberapa assistant dengan spesialisasi berbeda, misalnya Digital Marketing Assistant, Content Creator, Research Analyst, hingga Executive Assistant, masing-masing dengan SOP dan memory terpisah.',
    },
    {
      q: 'Bagaimana cara menguji assistant sebelum benar-benar dipakai?',
      a: 'Anda dapat menggunakan modul Test Lab di dalam aplikasi untuk menyimulasikan berbagai skenario percakapan, menguji kepatuhan terhadap SOP, mengevaluasi guardrail wewenang, dan melihat skor kesiapan kerja (readiness score).',
    },
    {
      q: 'Apakah akun baru langsung aktif setelah mendaftar?',
      a: 'Pendaftaran akun baru akan diverifikasi dan disetujui statusnya oleh Project Admin untuk memastikan alokasi kuota dan lingkungan kerja berjalan optimal.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Jawaban lengkap untuk pertanyaan yang paling sering diajukan seputar AI Employee Builder.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  id={`btn-faq-item-${index}`}
                  onClick={() => toggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF5F1F] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
