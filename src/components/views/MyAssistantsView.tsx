import React from 'react';
import {
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Brain,
  Zap,
  Play,
  ChevronRight,
  Trash2,
  Edit,
} from 'lucide-react';
import { Assistant, Memory, Skill } from '../../types';
import { NavView } from '../Sidebar';

interface MyAssistantsViewProps {
  assistants: Assistant[];
  skills: Skill[];
  memories: Memory[];
  onSelectAssistant: (id: string) => void;
  onDeleteAssistant: (id: string) => void;
  onOpenWizard: () => void;
  onNavigate: (view: NavView) => void;
}

export const MyAssistantsView: React.FC<MyAssistantsViewProps> = ({
  assistants,
  skills,
  memories,
  onSelectAssistant,
  onDeleteAssistant,
  onOpenWizard,
  onNavigate,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Users className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            AI Employees Directory ({assistants.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Each employee possesses distinct behavioral parameters, specialized skillsets, memory graphs, and authority boundaries.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-medium text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 shrink-0 active:scale-98 relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Hire AI Employee</span>
        </button>
      </div>

      {/* Grid of Assistants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assistants.map((asst) => {
          const asstSkillsCount = skills.filter((s) => s.assistantId === asst.id).length;
          const asstMemsCount = memories.filter((m) => m.assistantId === asst.id && !m.isArchived).length;

          return (
            <div
              key={asst.id}
              className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 shadow-sm p-5 flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={asst.avatar}
                      alt={asst.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
                        {asst.name}
                      </h4>
                      <p className="text-xs text-[#888] font-light">{asst.role}</p>
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30"
                  >
                    {asst.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-[#AAA] italic bg-[#0F0F0F] p-3 rounded-xl border border-white/5 mb-4 leading-relaxed line-clamp-2 font-light">
                  &ldquo;{asst.mission}&rdquo;
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-[#666] text-[10px] uppercase tracking-wider">Training Progress</span>
                    <span className="font-semibold text-[#FF5F1F]">{asst.trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-[#1C1C1C] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5F1F] to-[#ff9466] rounded-full shadow-[0_0_8px_#FF5F1F]"
                      style={{ width: `${asst.trainingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Micro Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 text-center text-xs">
                  <div>
                    <span className="text-[9px] font-mono text-[#666] uppercase tracking-wider block">Skills</span>
                    <strong className="font-serif italic text-[#F0F0F0]">{asstSkillsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#666] uppercase tracking-wider block">Memory</span>
                    <strong className="font-serif italic text-[#F0F0F0]">{asstMemsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#666] uppercase tracking-wider block">Score</span>
                    <strong className="font-serif italic text-[#FF5F1F]">{asst.testScore}/100</strong>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onSelectAssistant(asst.id);
                    onNavigate('workspace');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1F1F1F] hover:bg-[#FF5F1F] text-[#F0F0F0] hover:text-white font-medium text-xs transition flex items-center justify-center gap-1 group/btn"
                >
                  <span>Open Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#666] group-hover/btn:text-white" />
                </button>

                {assistants.length > 1 && (
                  <button
                    onClick={() => onDeleteAssistant(asst.id)}
                    className="p-2 rounded-xl text-[#666] hover:text-[#FF5F1F] hover:bg-[#1A1A1A] transition"
                    title="Delete Assistant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
