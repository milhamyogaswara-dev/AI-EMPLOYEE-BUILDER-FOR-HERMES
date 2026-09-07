import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { NavView } from '../Sidebar';

interface NextStepCardProps {
  currentModule: NavView;
  onNavigate: (view: NavView) => void;
  beginnerMode?: boolean;
}

const NEXT_STEPS_MAP: Partial<Record<NavView, { message: string; target: NavView; actionLabel: string }>> = {
  assistants: {
    message: 'Profil asisten telah siap. Selanjutnya tentukan aturan cara kerja dan perilaku di Training Center.',
    target: 'training',
    actionLabel: 'Buka Training Center',
  },
  training: {
    message: 'Aturan kerja dasar telah diatur. Selanjutnya tambahkan keahlian teknis (Skills) yang dibutuhkan.',
    target: 'skills',
    actionLabel: 'Buka Skills Manager',
  },
  skills: {
    message: 'Skill sudah dibuat. Selanjutnya buat SOP agar AI Employee mengetahui urutan langkah kerja.',
    target: 'sop',
    actionLabel: 'Buka SOP Builder',
  },
  sop: {
    message: 'SOP telah siap. Isi Memory Store dengan konteks bisnis permanen, profil produk, dan batasan harga.',
    target: 'memory',
    actionLabel: 'Buka Memory Store',
  },
  memory: {
    message: 'Memory terisi. Pastikan keamanan kerja asisten dengan menentukan batas wewenang di Authority Rules.',
    target: 'authority',
    actionLabel: 'Buka Authority Rules',
  },
  authority: {
    message: 'Batas wewenang telah diatur. Rancang alur pemicu proaktif di modul Automation.',
    target: 'automation',
    actionLabel: 'Buka Automation Builder',
  },
  automation: {
    message: 'Alur kerja otomatis selesai dirancang. Penting: Uji respon dan kepatuhan aturan di Test Lab!',
    target: 'testlab',
    actionLabel: 'Uji di Test Lab',
  },
  testlab: {
    message: 'Pengujian berhasil dievaluasi. Hubungkan kanal komunikasi atau ekspor manifest di Deploy Hermes.',
    target: 'deploy',
    actionLabel: 'Buka Deploy Hermes',
  },
};

export const NextStepCard: React.FC<NextStepCardProps> = ({
  currentModule,
  onNavigate,
  beginnerMode = true,
}) => {
  if (!beginnerMode) return null;

  const nextInfo = NEXT_STEPS_MAP[currentModule];
  if (!nextInfo) return null;

  return (
    <div className="bg-[#141414] border border-[#FF5F1F]/25 hover:border-[#FF5F1F]/40 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-[0_0_15px_rgba(255,95,31,0.05)]">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FF5F1F]/15 text-[#FF5F1F] flex items-center justify-center shrink-0 border border-[#FF5F1F]/30">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5F1F] block">
            Rekomendasi Langkah Berikutnya
          </span>
          <p className="text-xs text-[#DDD] font-light leading-relaxed">
            {nextInfo.message}
          </p>
        </div>
      </div>

      <button
        onClick={() => onNavigate(nextInfo.target)}
        className="px-3.5 py-1.5 rounded-lg bg-[#FF5F1F] hover:bg-[#e04f14] text-white text-xs font-mono transition flex items-center gap-1.5 shrink-0 self-end sm:self-center shadow-[0_0_10px_rgba(255,95,31,0.2)]"
      >
        <span>{nextInfo.actionLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
