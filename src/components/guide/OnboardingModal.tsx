import React from 'react';
import { X, Bot, BookOpen, LayoutTemplate, ArrowRight, Sparkles } from 'lucide-react';
import { NavView } from '../Sidebar';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: NavView) => void;
  onOpenWizard?: () => void;
  onDismissForever?: () => void;
  onStartTour?: () => void;
  onSkip?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenWizard,
  onDismissForever,
  onStartTour,
  onSkip,
}) => {
  if (!isOpen) return null;

  const handleAction = (action: 'wizard' | 'guide' | 'templates') => {
    if (typeof onDismissForever === 'function') {
      try {
        onDismissForever();
      } catch (err) {
        console.error('Error in onDismissForever:', err);
      }
    }
    if (action === 'wizard') {
      if (typeof onOpenWizard === 'function') {
        onOpenWizard();
      } else if (typeof onNavigate === 'function') {
        onNavigate('wizard');
      }
    } else if (action === 'guide') {
      if (typeof onStartTour === 'function') {
        onStartTour();
      } else if (typeof onNavigate === 'function') {
        onNavigate('guide');
      }
    } else if (action === 'templates') {
      if (typeof onNavigate === 'function') {
        onNavigate('templates');
      }
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleSkip = () => {
    if (typeof onDismissForever === 'function') {
      try {
        onDismissForever();
      } catch (err) {
        console.error('Error in onDismissForever:', err);
      }
    }
    if (typeof onSkip === 'function') {
      onSkip();
    } else if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleSkip}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#EDEDED] animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-2">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 text-[#FF5F1F] text-[10px] font-mono uppercase tracking-wider border border-[#FF5F1F]/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selamat Datang</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
              Selamat datang di AI Employee Builder
            </h3>
            <p className="text-xs sm:text-sm text-[#AAA] font-light leading-relaxed">
              Anda belum perlu memahami semua menu sekaligus. Pilih salah satu jalur awal yang paling nyaman untuk Anda:
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="p-1.5 rounded-lg text-[#777] hover:text-white bg-white/5 hover:bg-white/10 transition shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Starting Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Action 1 */}
          <div
            onClick={() => handleAction('wizard')}
            className="bg-[#161616] hover:bg-[#1C1C1C] border border-white/5 hover:border-[#FF5F1F]/40 p-4 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white group-hover:text-[#FF5F1F] transition">
                1. Buat AI Employee Pertama
              </h4>
              <p className="text-[11px] text-[#888] font-light leading-relaxed">
                Mulai dengan merancang profil, nama, dan tanggung jawab asisten dari nol.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#FF5F1F] flex items-center gap-1 mt-auto pt-2">
              <span>Buat Assistant</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Action 2 */}
          <div
            onClick={() => handleAction('guide')}
            className="bg-[#181411] hover:bg-[#201813] border border-[#FF5F1F]/30 hover:border-[#FF5F1F] p-4 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 group shadow-[0_0_15px_rgba(255,95,31,0.08)]"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#FF5F1F]/20 border border-[#FF5F1F]/30 text-[#FF5F1F] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white group-hover:text-[#FF5F1F] transition">
                2. Ikuti Panduan 10 Langkah
              </h4>
              <p className="text-[11px] text-[#999] font-light leading-relaxed">
                Pelajari urutan kerja praktis langkah demi langkah sebelum mulai mengkonfigurasi.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#FF5F1F] flex items-center gap-1 mt-auto pt-2">
              <span>Mulai Panduan</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Action 3 */}
          <div
            onClick={() => handleAction('templates')}
            className="bg-[#161616] hover:bg-[#1C1C1C] border border-white/5 hover:border-white/20 p-4 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-[#BBB] flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white group-hover:text-[#FF5F1F] transition">
                3. Gunakan Template
              </h4>
              <p className="text-[11px] text-[#888] font-light leading-relaxed">
                Pilih dari profil asisten siap pakai (Marketing, CS, Copywriter, dll).
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#BBB] group-hover:text-white flex items-center gap-1 mt-auto pt-2">
              <span>Lihat Templates</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-[11px] text-[#777] font-mono">
            Panduan ini dapat diakses kapan saja di sidebar &quot;Panduan Pengguna&quot;.
          </span>
          <button
            onClick={handleSkip}
            className="text-xs font-mono text-[#888] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Lewati untuk sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
