import React from 'react';
import { Sparkles, ArrowRight, AlertTriangle, Wrench, FlaskConical, Brain } from 'lucide-react';
import { Assistant, Memory, Skill, ToolItem } from '../types';
import { NavView } from './Sidebar';

interface AICoachBarProps {
  assistant: Assistant | null;
  skills: Skill[];
  memories: Memory[];
  tools: ToolItem[];
  onNavigate: (view: NavView) => void;
}

export const AICoachBar: React.FC<AICoachBarProps> = ({
  assistant,
  skills,
  memories,
  tools,
  onNavigate,
}) => {
  if (!assistant) return null;

  const asstSkills = skills.filter((s) => s.assistantId === assistant.id && s.status === 'ACTIVE');
  const asstMems = memories.filter((m) => m.assistantId === assistant.id && !m.isArchived);
  const connectedTools = tools.filter((t) => t.status === 'CONNECTED');

  // Check 1: Memory Conflict
  const conflictMemory = asstMems.find((m) => m.conflictFlag?.hasConflict);
  if (conflictMemory) {
    return (
      <div className="bg-[#16120E] border-b border-[#FF5F1F]/30 px-4 md:px-8 py-2.5 flex items-center justify-between text-xs text-[#E0E0E0] animate-fadeIn">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-[#FF5F1F] shrink-0" />
          <span className="font-serif italic font-semibold text-[#FF5F1F]">Memory Health:</span>
          <span className="truncate text-[#CCC] font-light">
            {conflictMemory.conflictFlag?.note || 'Two memories contain conflicting information.'}
          </span>
        </div>
        <button
          onClick={() => onNavigate('memory')}
          className="ml-3 px-3 py-1 rounded-lg bg-[#FF5F1F]/15 hover:bg-[#FF5F1F]/30 text-[#FF5F1F] border border-[#FF5F1F]/40 font-mono text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1.5 transition"
          id="btn-coach-review-memory"
        >
          <span>Review</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Check 2: Competitor research without internet tool
  const hasResearchJob = assistant.responsibilities.some((r) =>
    r.toLowerCase().includes('competitor') || r.toLowerCase().includes('research')
  );
  const hasInternet = connectedTools.some((t) => t.key === 'internet' || t.key === 'browser');
  if (hasResearchJob && !hasInternet) {
    return (
      <div className="bg-[#121212] border-b border-white/10 px-4 md:px-8 py-2.5 flex items-center justify-between text-xs text-[#E0E0E0]">
        <div className="flex items-center gap-2 min-w-0">
          <Wrench className="w-4 h-4 text-[#FF5F1F] shrink-0" />
          <span className="font-serif italic font-semibold text-[#F0F0F0]">Studio Advisory:</span>
          <span className="truncate text-[#AAA] font-light">
            Competitor Research assigned, but {assistant.name} lacks active web browsing tools.
          </span>
        </div>
        <button
          onClick={() => onNavigate('toolbox')}
          className="ml-3 px-3 py-1 rounded-lg bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1.5 transition shadow-[0_0_10px_rgba(255,95,31,0.3)]"
          id="btn-coach-add-tool"
        >
          <span>Connect Web</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Check 3: Untested Skill
  const untestedSkill = asstSkills.find((s) => s.testScore === 0 || s.usedCount === 0);
  if (untestedSkill) {
    return (
      <div className="bg-[#121212] border-b border-white/10 px-4 md:px-8 py-2.5 flex items-center justify-between text-xs text-[#E0E0E0]">
        <div className="flex items-center gap-2 min-w-0">
          <FlaskConical className="w-4 h-4 text-[#FF5F1F] shrink-0" />
          <span className="font-serif italic font-semibold text-[#F0F0F0]">Verification Pending:</span>
          <span className="truncate text-[#AAA] font-light">
            {assistant.name} has not been benchmarked for &ldquo;{untestedSkill.name}&rdquo;.
          </span>
        </div>
        <button
          onClick={() => onNavigate('testlab')}
          className="ml-3 px-3 py-1 rounded-lg bg-[#1F1F1F] hover:bg-[#282828] text-[#FF5F1F] border border-[#FF5F1F]/40 font-mono text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1.5 transition"
          id="btn-coach-run-test"
        >
          <span>Run Lab Test</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Default Positive Readiness Indicator
  return (
    <div className="bg-[#0F0F0F] border-b border-white/5 px-4 md:px-8 py-2 flex items-center justify-between text-xs text-[#888]">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full shadow-[0_0_6px_#FF5F1F]" />
        <span className="text-[#AAA] font-light">
          <strong className="font-serif italic text-[#F0F0F0] font-normal">Active Exhibition:</strong> {assistant.name} is in <span className="font-mono text-[#FF5F1F] text-[10px]">{assistant.status}</span> with {asstSkills.length} skills &amp; {asstMems.length} memory facts.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('training')}
          className="text-[11px] font-mono tracking-wider uppercase text-[#FF5F1F] hover:text-[#ff814d] flex items-center gap-1"
        >
          <span>Teach Rule</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
