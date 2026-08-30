import React from 'react';
import {
  Sparkles,
  GraduationCap,
  FileCheck2,
  Brain,
  Wrench,
  ShieldCheck,
  Zap,
  FlaskConical,
  Rocket,
  ArrowRight,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  Assistant,
  AutomationItem,
  Memory,
  Skill,
  SOP,
  ToolItem,
  TrainingRule,
} from '../../types';
import { NavView } from '../Sidebar';
import { useLanguage } from '../../contexts/LanguageContext';

interface AssistantWorkspaceViewProps {
  assistant: Assistant;
  rules: TrainingRule[];
  skills: Skill[];
  sops: SOP[];
  memories: Memory[];
  automations: AutomationItem[];
  tools: ToolItem[];
  onNavigate: (view: NavView) => void;
}

export const AssistantWorkspaceView: React.FC<AssistantWorkspaceViewProps> = ({
  assistant,
  rules,
  skills,
  sops,
  memories,
  automations,
  tools,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const asstRules = rules.filter((r) => r.assistantId === assistant.id);
  const asstSkills = skills.filter((s) => s.assistantId === assistant.id);
  const asstSops = sops.filter((s) => s.assistantId === assistant.id);
  const asstMems = memories.filter((m) => m.assistantId === assistant.id && !m.isArchived);
  const asstAutos = automations.filter((a) => a.assistantId === assistant.id);
  const connectedTools = tools.filter((t) => t.status === 'CONNECTED');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Workspace Header Card */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={assistant.avatar}
              alt={assistant.name}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-[#FF5F1F]/40 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
                  {assistant.name}
                </h2>
                <span className="text-[9px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30">
                  {assistant.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[9px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#AAA] border border-white/10">
                  {assistant.authorityLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#AAA] font-mono tracking-wide">
                {assistant.role} &bull; Language: {assistant.language}
              </p>
              <p className="text-xs text-[#CCC] mt-2 italic max-w-2xl font-light">
                &ldquo;{assistant.mission}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('training')}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#FF5F1F] border border-[#FF5F1F]/40 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>Teach Rule</span>
            </button>
            <button
              onClick={() => onNavigate('testlab')}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#E0E0E0] font-mono text-xs border border-white/10 hover:border-white/30 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>Test Lab</span>
            </button>
            <button
              onClick={() => onNavigate('deploy')}
              className="px-4 py-2 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-medium text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#666]">Training Progress</span>
            <div className="text-2xl font-serif italic text-[#F0F0F0] mt-1">{assistant.trainingProgress}%</div>
          </div>
          <div className="w-full bg-[#1C1C1C] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#FF5F1F] rounded-full shadow-[0_0_8px_#FF5F1F]"
              style={{ width: `${assistant.trainingProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#666]">Test Lab Score</span>
            <div className="text-2xl font-serif italic text-[#FF5F1F] mt-1">{assistant.testScore}<span className="text-xs font-sans text-[#888]">/100</span></div>
          </div>
          <span className="text-[10px] font-mono text-[#888] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F]" /> Ready for Exhibition
          </span>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#666]">Active Playbooks</span>
            <div className="text-2xl font-serif italic text-[#F0F0F0] mt-1">
              {asstSkills.length + asstSops.length} Modules
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#888]">{asstSkills.length} Skills &bull; {asstSops.length} SOPs</span>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#666]">Connected Tools</span>
            <div className="text-2xl font-serif italic text-[#FF5F1F] mt-1">{connectedTools.length} Active</div>
          </div>
          <span className="text-[10px] font-mono text-[#888]">Web, Docs, Telegram</span>
        </div>
      </div>

      {/* Deep Dive Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Skills Hub */}
        <div
          onClick={() => onNavigate('skills')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{asstSkills.length} SKILLS</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              Skills Atelier
            </h4>
            <p className="text-xs text-[#888] mt-1 leading-relaxed font-light">
              Equip modular capabilities like Meta Ads analysis, copywriting, and market research.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>CONFIGURE SKILLS</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* SOP Hub */}
        <div
          onClick={() => onNavigate('sop')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{asstSops.length} SOPS</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              SOP Playbooks
            </h4>
            <p className="text-xs text-[#888] mt-1 leading-relaxed font-light">
              Standardize complex step-by-step procedures with approval gates and decision logic.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>EDIT PLAYBOOKS</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Memory Hub */}
        <div
          onClick={() => onNavigate('memory')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{asstMems.length} FACTS</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              Memory Archive
            </h4>
            <p className="text-xs text-[#888] mt-1 leading-relaxed font-light">
              Business parameters, product prices, customer profiles, and conflict detection.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>AUDIT MEMORY</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Toolbox */}
        <div
          onClick={() => onNavigate('toolbox')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{connectedTools.length} TOOLS</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              Toolbox &amp; MCP
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">
              Connect external tools: Web browser, Document parser, Telegram bot, and MCP.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>CONNECT CAPABILITIES</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Authority */}
        <div
          onClick={() => onNavigate('authority')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{assistant.authorityLevel}</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              Governance Matrix
            </h4>
            <p className="text-xs text-[#888] mt-1 leading-relaxed font-light">
              Traffic-light matrix defining green, yellow, and red execution boundaries.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>CALIBRATE BOUNDARIES</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Automations */}
        <div
          onClick={() => onNavigate('automation')}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.12)] transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/10 text-[#FF5F1F] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#AAA] tracking-wider">{asstAutos.length} ROUTINES</span>
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
              Autonomous Routines
            </h4>
            <p className="text-xs text-[#888] mt-1 leading-relaxed font-light">
              Recurring cron jobs, morning briefings, and automated analytical reporting.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#FF5F1F]">
            <span>SCHEDULE ROUTINES</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
