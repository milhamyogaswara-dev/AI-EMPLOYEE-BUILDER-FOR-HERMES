import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { ROADMAP_STEPS, RoadmapStep, GuideTopic, GUIDE_TOPICS } from '../../data/userGuide';
import { NavView } from '../Sidebar';

interface GuideRoadmapProps {
  completedSteps: string[];
  currentStepIndex: number;
  onSelectTopic: (topic: GuideTopic) => void;
  onNavigate: (view: NavView) => void;
  onToggleStep: (stepId: string) => void;
}

export const GuideRoadmap: React.FC<GuideRoadmapProps> = ({
  completedSteps,
  currentStepIndex,
  onSelectTopic,
  onNavigate,
  onToggleStep,
}) => {
  const totalSteps = ROADMAP_STEPS.length;
  // Calculate real progress based on actual completed steps
  const completedCount = ROADMAP_STEPS.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleStepClick = (step: RoadmapStep) => {
    const topic = GUIDE_TOPICS.find((t) => t.id === step.guideTopicId);
    if (topic) {
      onSelectTopic(topic);
    } else {
      onNavigate(step.moduleView);
    }
  };

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 sm:p-7 space-y-6">
      {/* Header & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/30 tracking-wider">
              Peta Jalan 10 Langkah
            </span>
            <span className="text-xs font-mono text-[#AAA]">
              {completedCount} / {totalSteps} Langkah Selesai
            </span>
          </div>
          <h3 className="text-xl font-serif italic text-white mt-1">
            Quick Start Roadmap
          </h3>
          <p className="text-xs text-[#888] font-light">
            Ikuti urutan langkah kerja terstruktur berikut untuk memastikan AI Employee siap bekerja tanpa celah.
          </p>
        </div>

        {/* Real Progress Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-36 bg-[#1A1A1A] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#FF5F1F] to-amber-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-sm font-semibold text-[#FF5F1F]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {ROADMAP_STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = idx + 1 === currentStepIndex && !isDone;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between gap-3 ${
                isDone
                  ? 'bg-[#141814] border-emerald-500/25 hover:border-emerald-500/40'
                  : isCurrent
                  ? 'bg-[#181310] border-[#FF5F1F]/40 shadow-[0_0_15px_rgba(255,95,31,0.08)]'
                  : 'bg-[#151515] border-white/5 hover:border-white/15'
              }`}
            >
              {/* Step Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleStep(step.id)}
                    className="shrink-0 transition-transform active:scale-95"
                    title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className={`w-5 h-5 ${isCurrent ? 'text-[#FF5F1F]' : 'text-[#555]'}`} />
                    )}
                  </button>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888] block">
                      LANGKAH {step.stepNumber}
                    </span>
                    <h4
                      onClick={() => handleStepClick(step)}
                      className={`text-sm font-medium cursor-pointer transition ${
                        isDone
                          ? 'text-emerald-300 hover:text-white'
                          : isCurrent
                          ? 'text-[#FF5F1F] hover:text-white'
                          : 'text-[#E0E0E0] hover:text-[#FF5F1F]'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isDone ? (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Selesai
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FF5F1F]/15 text-[#FF5F1F] border border-[#FF5F1F]/30 animate-pulse">
                      Langkah Aktif
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Step Description */}
              <p className="text-xs text-[#999] font-light leading-relaxed pl-7">
                {step.shortDesc}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 pl-7">
                <button
                  onClick={() => handleStepClick(step)}
                  className="text-[11px] font-mono text-[#AAA] hover:text-white flex items-center gap-1.5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  <span>Buka Panduan</span>
                </button>

                <button
                  onClick={() => onNavigate(step.moduleView)}
                  className="text-[11px] font-mono text-[#FF5F1F] hover:text-[#FFA07A] flex items-center gap-1 transition"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
