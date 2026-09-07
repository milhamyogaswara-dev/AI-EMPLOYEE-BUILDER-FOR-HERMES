import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Compass } from 'lucide-react';
import { NavView } from '../Sidebar';

export interface TourStep {
  targetView: NavView;
  title: string;
  subtitle: string;
  tooltip: string;
  badge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetView: 'assistants',
    title: '1. My Assistants',
    subtitle: 'Manajemen Profil AI Employee',
    tooltip: 'Mulai di sini untuk membuat AI Employee pertama Anda, memilih role, dan menentukan misi utama.',
    badge: 'LANGKAH 1',
  },
  {
    targetView: 'training',
    title: '2. Training Center',
    subtitle: 'Pusat Pelatihan Aturan & Behavior',
    tooltip: 'Ajarkan cara kerja, aturan operasional, dan respon perilaku standar yang harus dipatuhi asisten.',
    badge: 'LANGKAH 2',
  },
  {
    targetView: 'skills',
    title: '3. Skills',
    subtitle: 'Pustaka Keahlian Praktis',
    tooltip: 'Bekali asisten dengan kompetensi spesifik seperti analisis iklan, riset kompetitor, atau copywriting.',
    badge: 'LANGKAH 3',
  },
  {
    targetView: 'sop',
    title: '4. SOP Builder',
    subtitle: 'Standar Operasional Prosedur',
    tooltip: 'Petakan urutan langkah demi langkah baku agar setiap tugas dieksekusi tuntas tanpa melewatkan tahap krusial.',
    badge: 'LANGKAH 4',
  },
  {
    targetView: 'memory',
    title: '5. Memory Store',
    subtitle: 'Basis Pengetahuan Bisnis Permanen',
    tooltip: 'Simpan fakta bisnis, katalog produk, harga, dan preferensi pemilik yang wajib selalu diingat asisten.',
    badge: 'LANGKAH 5',
  },
  {
    targetView: 'authority',
    title: '6. Authority Rules',
    subtitle: 'Matriks Keamanan Tiga Tingkat',
    tooltip: 'Atur batas wewenang aman: Hijau (Mandiri), Kuning (Butuh Approval), dan Merah (Dilarang Keras).',
    badge: 'LANGKAH 6',
  },
  {
    targetView: 'automation',
    title: '7. Automation',
    subtitle: 'Alur Trigger & Action Terjadwal',
    tooltip: 'Bangun pemicu otomatisasi agar asisten bekerja proaktif saat ada tiket baru, jadwal harian, atau webhook.',
    badge: 'LANGKAH 7',
  },
  {
    targetView: 'testlab',
    title: '8. Test Lab',
    subtitle: 'Simulasi & Kalibrasi Performa',
    tooltip: 'Uji respon asisten dalam skenario nyata, verifikasi kepatuhan SOP, dan perbaiki kesalahan sebelum deploy.',
    badge: 'LANGKAH 8',
  },
  {
    targetView: 'integrations',
    title: '9. Integrations',
    subtitle: 'Koneksi Server-Side Aman',
    tooltip: 'Hubungkan ke OpenRouter, Telegram Bot, dan Webhook melalui server proxy tanpa membocorkan API key di browser.',
    badge: 'LANGKAH 9',
  },
  {
    targetView: 'deploy',
    title: '10. Deploy Hermes',
    subtitle: 'Review Kesiapan & Ekspor Runtime',
    tooltip: 'Tinjau checklist kelayakan 9 pilar agen dan ekspor manifest untuk dijalankan pada Hermes runtime.',
    badge: 'LANGKAH 10',
  },
];

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavView) => void;
  onCompleteTour: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onCompleteTour,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onCompleteTour();
      onClose();
    } else {
      const next = currentStep + 1;
      setCurrentStep(next);
      onNavigate(TOUR_STEPS[next].targetView);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onNavigate(TOUR_STEPS[prev].targetView);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-end sm:items-center justify-center p-4">
      {/* Dim overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Tour Card */}
      <div className="relative z-10 w-full max-w-md bg-[#131313] border border-[#FF5F1F]/40 rounded-2xl shadow-[0_0_35px_rgba(255,95,31,0.2)] p-6 space-y-4 text-white animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FF5F1F]/15 text-[#FF5F1F] border border-[#FF5F1F]/30">
                {step.badge}
              </span>
              <span className="text-xs font-mono text-[#888]">
                {currentStep + 1} dari {TOUR_STEPS.length}
              </span>
            </div>
            <h4 className="text-lg font-serif italic text-white pt-1">
              {step.title}
            </h4>
            <div className="text-[11px] font-mono text-[#AAA]">
              {step.subtitle}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-white bg-white/5 hover:bg-white/10 transition"
            title="Lewati Tur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tooltip Content */}
        <div className="bg-[#181818] p-4 rounded-xl border border-white/5 text-xs text-[#CCC] leading-relaxed font-light">
          {step.tooltip}
        </div>

        {/* Navigation Step Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 bg-[#FF5F1F]'
                  : i < currentStep
                  ? 'w-2 bg-emerald-500/70'
                  : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-xs font-mono text-[#777] hover:text-[#BBB] transition py-1.5 px-2"
          >
            Lewati Tur
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-[#222] hover:bg-[#2B2B2B] text-xs font-mono text-[#DDD] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-xs font-mono text-white transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,95,31,0.3)]"
            >
              <span>{isLast ? 'Selesai' : 'Lanjut'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
