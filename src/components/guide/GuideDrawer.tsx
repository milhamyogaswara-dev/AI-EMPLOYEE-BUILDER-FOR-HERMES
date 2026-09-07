import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { GuideTopic } from '../../data/userGuide';
import { NavView } from '../Sidebar';

interface GuideDrawerProps {
  isOpen: boolean;
  topic: GuideTopic | null;
  onClose: () => void;
  onNavigate?: (view: NavView) => void;
  onMarkStepComplete?: (topicId: string) => void;
  isCompleted?: boolean;
}

export const GuideDrawer: React.FC<GuideDrawerProps> = ({
  isOpen,
  topic,
  onClose,
  onNavigate,
  onMarkStepComplete,
  isCompleted = false,
}) => {
  if (!isOpen || !topic) return null;

  const difficultyColors = {
    Pemula: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Menengah: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Lanjutan: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#111111] border-l border-white/10 text-[#EDEDED] flex flex-col shadow-2xl relative">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#141414]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/30 tracking-wider">
                  {topic.badge || 'Panduan Modul'}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyColors[topic.difficulty]}`}
                >
                  {topic.difficulty}
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Selesai
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight pt-1">
                {topic.title}
              </h3>
              <p className="text-xs text-[#AAA] font-light leading-relaxed">
                {topic.shortDescription}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-[#888] hover:text-white transition shrink-0"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-[#CCC] leading-relaxed">
            {/* Overview */}
            <div className="space-y-2 bg-[#161616] p-4 rounded-xl border border-white/5">
              <div className="text-[11px] font-mono uppercase text-[#FF5F1F] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ringkasan Konsep</span>
              </div>
              <p className="text-[#DDD] font-light leading-relaxed whitespace-pre-line">
                {topic.content.overview}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#AAA] tracking-wider">
                Mengapa Ini Penting?
              </div>
              <p className="text-[#BBB] font-light">
                {topic.content.whyItMatters}
              </p>
            </div>

            {/* Key Points */}
            {topic.content.keyPoints && topic.content.keyPoints.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-[#AAA] tracking-wider">
                  Poin Kunci yang Harus Dipahami
                </div>
                <div className="space-y-2">
                  {topic.content.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-[#141414] p-3 rounded-lg border border-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] mt-1.5 shrink-0" />
                      <span className="text-[#DDD] text-xs leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps if available */}
            {topic.content.steps && topic.content.steps.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase text-[#FF5F1F] tracking-wider">
                  Langkah Pelaksanaan Praktis
                </div>
                <div className="space-y-2.5">
                  {topic.content.steps.map((st) => (
                    <div
                      key={st.number}
                      className="flex items-start gap-3 bg-[#141414] p-3.5 rounded-xl border border-white/5"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-xs flex items-center justify-center shrink-0 border border-[#FF5F1F]/30">
                        {st.number}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-medium text-white text-xs">{st.title}</div>
                        <div className="text-[#AAA] text-[11px] leading-relaxed">
                          {st.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Good vs Bad Examples */}
            {(topic.content.goodExample || topic.content.badExample) && (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase text-[#AAA] tracking-wider">
                  Contoh Perbandingan
                </div>
                {topic.content.badExample && (
                  <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{topic.content.badExample.title}</span>
                    </div>
                    <p className="text-rose-200/90 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-rose-500/10">
                      {topic.content.badExample.description}
                    </p>
                    <p className="text-[11px] text-rose-300/70 italic">
                      Alasan: {topic.content.badExample.reason}
                    </p>
                  </div>
                )}
                {topic.content.goodExample && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{topic.content.goodExample.title}</span>
                    </div>
                    <p className="text-emerald-200/90 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-emerald-500/10 whitespace-pre-line">
                      {topic.content.goodExample.description}
                    </p>
                    <p className="text-[11px] text-emerald-300/70 italic">
                      Alasan: {topic.content.goodExample.reason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Best Practice List */}
            {topic.content.bestPractice && topic.content.bestPractice.length > 0 && (
              <div className="space-y-2 bg-[#141414] p-4 rounded-xl border border-white/5">
                <div className="text-[11px] font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Best Practice Hermes Studio</span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {topic.content.bestPractice.map((bp, i) => (
                    <li key={i} className="text-[#CCC] text-[11px] flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security Warning if any */}
            {topic.content.securityWarning && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Pedoman Keamanan Kredensial</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  {topic.content.securityWarning}
                </p>
              </div>
            )}

            {/* Readiness Note if any */}
            {topic.content.readinessNote && (
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl space-y-1">
                <div className="text-[11px] font-mono uppercase text-blue-400 tracking-wider">
                  Catatan Kesiapan
                </div>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  {topic.content.readinessNote}
                </p>
              </div>
            )}

            {/* Checklist */}
            {topic.content.checklist && topic.content.checklist.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-[#AAA] tracking-wider">
                  Checklist Verifikasi
                </div>
                <div className="space-y-1.5">
                  {topic.content.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[#DDD] bg-[#141414] px-3 py-2 rounded-lg border border-white/5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141414] flex items-center justify-between gap-3">
            {onMarkStepComplete && (
              <button
                onClick={() => onMarkStepComplete(topic.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#1E1E1E] hover:bg-[#252525] text-[#AAA] hover:text-white border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Tandai Belum' : 'Tandai Selesai'}</span>
              </button>
            )}

            {topic.relatedAction && onNavigate ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigate(topic.relatedAction!.targetView);
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white text-xs font-mono shadow-[0_0_15px_rgba(255,95,31,0.25)] transition flex items-center gap-2 ml-auto"
              >
                <span>{topic.relatedAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-mono transition ml-auto"
              >
                Tutup Panduan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
