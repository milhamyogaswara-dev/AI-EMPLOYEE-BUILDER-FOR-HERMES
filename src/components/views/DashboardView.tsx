import { useLanguage } from '../../contexts/LanguageContext';
import React from 'react';
import {
  Users,
  Sparkles,
  Brain,
  Zap,
  Puzzle,
  Award,
  ArrowRight,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import {
  ActivityLog,
  Assistant,
  AutomationItem,
  Memory,
  Skill,
  ToolItem,
  UserProfile,
} from '../../types';
import { NavView } from '../Sidebar';

interface DashboardViewProps {
  userProfile: UserProfile;
  assistants: Assistant[];
  skills: Skill[];
  memories: Memory[];
  automations: AutomationItem[];
  tools: ToolItem[];
  logs: ActivityLog[];
  onSelectAssistant: (id: string) => void;
  onNavigate: (view: NavView) => void;
  onOpenWizard: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  assistants,
  skills,
  memories,
  automations,
  tools,
  logs,
  onSelectAssistant,
  onNavigate,
  onOpenWizard,
}) => {
  const { t } = useLanguage();
  
  const activeSkillsCount = skills.filter((s) => s.status === 'ACTIVE').length;
  const totalMemoriesCount = memories.filter((m) => !m.isArchived).length;
  const activeAutomationsCount = automations.filter((a) => a.status === 'ACTIVE').length;
  const connectedToolsCount = tools.filter((t) => t.status === 'CONNECTED').length;

  const avgTestScore =
    assistants.length > 0
      ? Math.round(assistants.reduce((acc, a) => acc + a.testScore, 0) / assistants.length)
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Banner with Artistic Flair */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden">
        {/* Subtle orange ambient glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 -right-3 w-16 h-16 border-t border-r border-[#FF5F1F]/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-3 border border-[#FF5F1F]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse" />
              <span>Hermes Atelier v2.4</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[#F0F0F0] tracking-tight">
              {t('dash.welcome')}, {userProfile.addressStyle || userProfile.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#AAA] mt-2 max-w-2xl font-light italic leading-relaxed">
              t('dash.subtitle')
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenWizard}
              id="btn-dash-create-assistant"
              className="px-4 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-medium text-xs sm:text-sm shadow-[0_0_20px_rgba(255,95,31,0.25)] transition flex items-center gap-2 active:scale-98 tracking-wide"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dash.createAssistant')}</span>
            </button>
            <button
              onClick={() => onNavigate('testlab')}
              id="btn-dash-testlab"
              className="px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#E0E0E0] font-mono text-xs sm:text-sm border border-white/10 hover:border-[#FF5F1F]/40 transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-[#FF5F1F]" />
              <span>{t('dash.testLab')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigate('assistants')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-total-assistants"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.employees')}</span>
            <Users className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#F0F0F0]">{assistants.length}</div>
          <div className="text-[10px] text-[#666] font-mono mt-1">
            {t('dash.autonomousAgents')}
          </div>
        </div>

        <div
          onClick={() => onNavigate('skills')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-active-skills"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.activeSkills')}</span>
            <Sparkles className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#F0F0F0]">{activeSkillsCount}</div>
          <div className="text-[10px] text-[#666] font-mono mt-1">
            {t('dash.activeBlueprints')}
          </div>
        </div>

        <div
          onClick={() => onNavigate('memory')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-memories"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.memories')}</span>
            <Brain className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#F0F0F0]">{totalMemoriesCount}</div>
          <div className="text-[10px] text-[#666] font-mono mt-1">
            {t('dash.indexedKnowledge')}
          </div>
        </div>

        <div
          onClick={() => onNavigate('automation')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-automations"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.routines')}</span>
            <Zap className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#F0F0F0]">{activeAutomationsCount}</div>
          <div className="text-[10px] text-[#666] font-mono mt-1">
            {t('dash.cronSchedules')}
          </div>
        </div>

        <div
          onClick={() => onNavigate('toolbox')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-integrations"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.tools')}</span>
            <Puzzle className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#F0F0F0]">{connectedToolsCount}</div>
          <div className="text-[10px] text-[#666] font-mono mt-1">
            {t('dash.mcpConnected')}
          </div>
        </div>

        <div
          onClick={() => onNavigate('testlab')}
          className="bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-[#FF5F1F]/50 transition cursor-pointer group shadow-sm"
          id="kpi-test-score"
        >
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#888]">{t('dash.benchmark')}</span>
            <Award className="w-4 h-4 text-[#FF5F1F] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-serif italic text-[#FF5F1F]">{avgTestScore}<span className="text-xs font-sans text-[#888]">/100</span></div>
          <div className="text-[10px] text-[#888] font-mono mt-1 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3 text-[#FF5F1F]" />
            <span>Optimal</span>
          </div>
        </div>
      </div>

      {/* Main Section: My AI Employees */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h3 className="text-lg font-serif italic font-normal text-[#F0F0F0] tracking-tight">
              {t('dash.gallery')}
            </h3>
            <p className="text-xs text-[#888] font-light">
              {t('dash.galleryDesc')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('assistants')}
            className="text-xs font-mono text-[#FF5F1F] hover:text-[#ff814d] flex items-center gap-1 uppercase tracking-wider"
          >
            <span>{`${t('dash.viewAll')} (${assistants.length})`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assistants.map((asst) => {
            const asstSkillsCount = skills.filter((s) => s.assistantId === asst.id).length;
            const asstMemsCount = memories.filter((m) => m.assistantId === asst.id && !m.isArchived).length;

            return (
              <div
                key={asst.id}
                className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.15)] transition flex flex-col justify-between overflow-hidden group"
                id={`assistant-card-${asst.id}`}
              >
                <div className="p-5">
                  {/* Top: Avatar, Name, Status */}
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
                        <p className="text-xs text-[#888] font-light">
                          {asst.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30"
                    >
                      {asst.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Mission Summary */}
                  <p className="text-xs text-[#AAA] italic line-clamp-2 mb-4 leading-relaxed bg-[#0F0F0F] p-3 rounded-xl border border-white/5 font-light">
                    &ldquo;{asst.mission}&rdquo;
                  </p>

                  {/* Training Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                      <span className="text-[#666] text-[10px] uppercase tracking-wider">Training Accuracy</span>
                      <span className="font-semibold text-[#FF5F1F]">{asst.trainingProgress}%</span>
                    </div>
                    <div className="w-full bg-[#1C1C1C] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF5F1F] to-[#ff9466] rounded-full transition-all duration-500 shadow-[0_0_8px_#FF5F1F]"
                        style={{ width: `${asst.trainingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-white/10 text-center">
                    <div>
                      <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider">Skills</div>
                      <div className="text-sm font-serif italic text-[#F0F0F0]">{asstSkillsCount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider">Memory</div>
                      <div className="text-sm font-serif italic text-[#F0F0F0]">{asstMemsCount}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-[#666] uppercase tracking-wider">Test Score</div>
                      <div className="text-sm font-serif italic text-[#FF5F1F]">{asst.testScore}/100</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTAs */}
                <div className="px-5 py-3 bg-[#0F0F0F] border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectAssistant(asst.id);
                      onNavigate('training');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-mono text-[#888] hover:text-[#F0F0F0] hover:bg-[#181818] border border-white/10 transition uppercase tracking-wider"
                    id={`btn-continue-training-${asst.id}`}
                  >
                    Teach Rules
                  </button>

                  <button
                    onClick={() => {
                      onSelectAssistant(asst.id);
                      onNavigate('workspace');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-[#1F1F1F] hover:bg-[#FF5F1F] hover:text-white text-[#F0F0F0] border border-white/10 hover:border-transparent transition flex items-center justify-center gap-1 group/btn"
                    id={`btn-open-assistant-${asst.id}`}
                  >
                    <span>Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#666] group-hover/btn:text-white" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Assistant Card Placeholder */}
          <div
            onClick={onOpenWizard}
            className="border border-dashed border-white/15 hover:border-[#FF5F1F] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group transition bg-[#101010] hover:bg-[#141414] min-h-[260px]"
            id="card-add-new-assistant-placeholder"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 group-hover:border-[#FF5F1F] text-[#FF5F1F] flex items-center justify-center mb-3 transition shadow-[0_0_12px_rgba(255,95,31,0.2)]">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-serif italic text-base text-[#F0F0F0] mb-1 group-hover:text-[#FF5F1F] transition">
              Create New Employee
            </h4>
            <p className="text-xs text-[#666] font-light max-w-[220px]">
              Step-by-step guided architectural builder for your next AI role.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5F1F]" />
            <h3 className="font-serif italic text-base text-[#F0F0F0]">Studio Execution Log</h3>
          </div>
          <span className="text-[10px] font-mono text-[#666] tracking-wider uppercase">Live Activity Stream</span>
        </div>

        <div className="divide-y divide-white/5 overflow-x-auto">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] shadow-[0_0_6px_#FF5F1F]" />
                <span className="text-[#CCC] font-light">{log.text}</span>
              </div>
              <span className="text-[#666] font-mono text-[10px] tracking-wider shrink-0 ml-2">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
