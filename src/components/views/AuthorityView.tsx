import React, { useState } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Assistant, AuthorityAction, AuthorityLevel, AuthorityTier } from '../../types';

interface AuthorityViewProps {
  assistant: Assistant;
  onUpdateAssistant: (assistant: Assistant) => void;
}

export const AuthorityView: React.FC<AuthorityViewProps> = ({
  assistant,
  onUpdateAssistant,
}) => {
  const { t } = useLanguage();
  const [actions, setActions] = useState<AuthorityAction[]>([
    {
      id: 'act_1',
      title: 'Web & Competitor Research',
      description: 'Browsing public websites, extracting pricing, and summarizing articles.',
      tier: 'GREEN',
      category: 'Research',
    },
    {
      id: 'act_2',
      title: 'Generate Ad Copy & Hook Variations',
      description: 'Creating headlines, body copy, and creative angle suggestions in chat.',
      tier: 'GREEN',
      category: 'Content',
    },
    {
      id: 'act_3',
      title: 'Analyze Ad Performance Data',
      description: 'Calculating CTR, CPC, CPA, ROAS, and conversion trends from reports.',
      tier: 'GREEN',
      category: 'Analytics',
    },
    {
      id: 'act_4',
      title: 'Send Scheduled Telegram Morning Briefing',
      description: 'Pushing summarized daily reports to the connected owner chat.',
      tier: 'GREEN',
      category: 'Communication',
    },
    {
      id: 'act_5',
      title: 'Queue Email Drafts to External Clients',
      description: 'Drafting emails and placing them in drafts folder for review.',
      tier: 'YELLOW',
      category: 'Communication',
    },
    {
      id: 'act_6',
      title: 'Create Draft Ad Campaigns in Meta Ads Manager',
      description: 'Configuring campaigns in draft mode without turning on active billing.',
      tier: 'YELLOW',
      category: 'Marketing',
    },
    {
      id: 'act_7',
      title: 'Update Master Business SOP Playbooks',
      description: 'Modifying official company procedure documentation.',
      tier: 'YELLOW',
      category: 'Operations',
    },
    {
      id: 'act_8',
      title: 'Directly Increase Ad Spend or Billing Budgets',
      description: 'Authorizing live monetary transactions or scaling budget limits.',
      tier: 'RED',
      category: 'Financial',
    },
    {
      id: 'act_9',
      title: 'Permanently Delete Customer Leads or History',
      description: 'Purging historical customer database entries or campaign logs.',
      tier: 'RED',
      category: 'Data Management',
    },
    {
      id: 'act_10',
      title: 'Expose or Modify Workspace API Keys',
      description: 'Changing environment secrets or sending tokens to third parties.',
      tier: 'RED',
      category: 'Security',
    },
  ]);

  const [newActionTitle, setNewActionTitle] = useState<string>('');
  const [newActionTier, setNewActionTier] = useState<AuthorityTier>('YELLOW');

  const handleTierChange = (id: string, newTier: AuthorityTier) => {
    setActions(
      actions.map((act) => (act.id === id ? { ...act, tier: newTier } : act))
    );
  };

  const handleAddAction = () => {
    if (!newActionTitle.trim()) return;
    const newAct: AuthorityAction = {
      id: `act_${Date.now()}`,
      title: newActionTitle.trim(),
      description: 'Custom configured operational action.',
      tier: newActionTier,
      category: 'Custom',
    };
    setActions([...actions, newAct]);
    setNewActionTitle('');
  };

  const handleDeleteAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleSetGlobalLevel = (lvl: AuthorityLevel) => {
    onUpdateAssistant({
      ...assistant,
      authorityLevel: lvl,
    });
  };

  const greenActions = actions.filter((a) => a.tier === 'GREEN');
  const yellowActions = actions.filter((a) => a.tier === 'YELLOW');
  const redActions = actions.filter((a) => a.tier === 'RED');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Governance Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {assistant.name}&apos;s Authority &amp; Approval Gates
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Define with mathematical certainty what your AI assistant can execute automatically vs what strictly requires human confirmation.
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right shrink-0 relative z-10">
          <span className="text-[9px] text-[#888] font-mono uppercase tracking-wider block">Active Mode</span>
          <div className="text-sm font-serif italic text-[#FF5F1F]">
            {assistant.authorityLevel.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* Global Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            id: 'ASSIST_MODE',
            title: 'ASSIST MODE',
            desc: 'Drafts only. Never executes external changes.',
            icon: Shield,
            color: 'border-blue-500/60 bg-[#161B22] text-[#F0F0F0]',
          },
          {
            id: 'SEMI_AUTONOMOUS',
            title: 'SEMI-AUTONOMOUS (Default)',
            desc: 'Executes routine tasks. Asks approval on sensitive operations.',
            icon: ShieldCheck,
            color: 'border-[#FF5F1F] bg-[#1A1412] text-[#F0F0F0] shadow-[0_0_15px_rgba(255,95,31,0.2)]',
          },
          {
            id: 'AUTONOMOUS',
            title: 'AUTONOMOUS',
            desc: 'Executes approved workflows automatically.',
            icon: ShieldAlert,
            color: 'border-amber-500/60 bg-[#1F1912] text-[#F0F0F0]',
          },
        ].map((preset) => {
          const isSelected = assistant.authorityLevel === preset.id;
          const Icon = preset.icon;
          return (
            <div
              key={preset.id}
              onClick={() => handleSetGlobalLevel(preset.id as any)}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                isSelected ? preset.color : 'border-white/10 bg-[#141414] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-[#FF5F1F]' : 'text-[#666]'}`} />
              <div>
                <h4 className="font-serif italic text-xs text-[#F0F0F0]">{preset.title}</h4>
                <p className="text-[11px] text-[#888] mt-0.5 font-light">{preset.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Action Row */}
      <div className="bg-[#141414] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={newActionTitle}
          onChange={(e) => setNewActionTitle(e.target.value)}
          placeholder="Add custom action rule (e.g. Publish post directly to LinkedIn)..."
          className="flex-1 w-full px-3.5 py-2 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F]"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newActionTier}
            onChange={(e) => setNewActionTier(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-white/10 text-xs font-mono bg-[#0F0F0F] text-[#F0F0F0] focus:border-[#FF5F1F]"
          >
            <option value="GREEN">GREEN (Autonomous)</option>
            <option value="YELLOW">YELLOW (Needs Approval)</option>
            <option value="RED">RED (Never Allowed)</option>
          </select>

          <button
            onClick={handleAddAction}
            className="px-4 py-2 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-sm transition shrink-0 flex items-center gap-1 uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* 3-Tier Traffic-Light Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* GREEN COLUMN */}
        <div className="bg-[#141414] rounded-2xl border border-emerald-500/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
                <h3 className="font-serif italic text-sm text-emerald-400">GREEN &mdash; Autonomous</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-[#0F0F0F] px-2 py-0.5 rounded-full border border-emerald-500/30">
                {greenActions.length} Actions
              </span>
            </div>
            <div className="p-3 text-[11px] text-[#888] font-light bg-[#0E0E0E] border-b border-white/5">
              Assistant executes these actions immediately without asking for confirmation.
            </div>

            <div className="p-3 space-y-2.5">
              {greenActions.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[#0F0F0F] border border-white/5 text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-serif italic text-[#F0F0F0]">{act.title}</strong>
                    <button
                      onClick={() => handleDeleteAction(act.id)}
                      className="text-[#666] hover:text-[#FF5F1F] p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed font-light">{act.description}</p>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => handleTierChange(act.id, 'YELLOW')}
                      className="text-[10px] font-mono text-amber-400 bg-[#1A1812] hover:bg-[#252015] px-2 py-0.5 rounded border border-amber-500/20"
                    >
                      Move to Yellow &rarr;
                    </button>
                    <button
                      onClick={() => handleTierChange(act.id, 'RED')}
                      className="text-[10px] font-mono text-[#FF5F1F] bg-[#1A1210] hover:bg-[#251512] px-2 py-0.5 rounded border border-[#FF5F1F]/20"
                    >
                      Move to Red &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YELLOW COLUMN */}
        <div className="bg-[#141414] rounded-2xl border border-amber-500/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 bg-amber-950/20 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/30" />
                <h3 className="font-serif italic text-sm text-amber-400">YELLOW &mdash; Needs Approval</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-[#0F0F0F] px-2 py-0.5 rounded-full border border-amber-500/30">
                {yellowActions.length} Actions
              </span>
            </div>
            <div className="p-3 text-[11px] text-[#888] font-light bg-[#0E0E0E] border-b border-white/5">
              Assistant will prepare the draft, explain the rationale, and wait for your confirmation.
            </div>

            <div className="p-3 space-y-2.5">
              {yellowActions.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[#0F0F0F] border border-white/5 text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-serif italic text-[#F0F0F0]">{act.title}</strong>
                    <button
                      onClick={() => handleDeleteAction(act.id)}
                      className="text-[#666] hover:text-[#FF5F1F] p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed font-light">{act.description}</p>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => handleTierChange(act.id, 'GREEN')}
                      className="text-[10px] font-mono text-emerald-400 bg-[#121A15] hover:bg-[#152518] px-2 py-0.5 rounded border border-emerald-500/20"
                    >
                      &larr; Move to Green
                    </button>
                    <button
                      onClick={() => handleTierChange(act.id, 'RED')}
                      className="text-[10px] font-mono text-[#FF5F1F] bg-[#1A1210] hover:bg-[#251512] px-2 py-0.5 rounded border border-[#FF5F1F]/20"
                    >
                      Move to Red &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RED COLUMN */}
        <div className="bg-[#141414] rounded-2xl border border-[#FF5F1F]/20 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 bg-red-950/20 border-b border-[#FF5F1F]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F1F] ring-2 ring-[#FF5F1F]/30" />
                <h3 className="font-serif italic text-sm text-[#FF5F1F]">RED &mdash; Strictly Forbidden</h3>
              </div>
              <span className="text-[10px] font-mono text-[#FF5F1F] bg-[#0F0F0F] px-2 py-0.5 rounded-full border border-[#FF5F1F]/30">
                {redActions.length} Actions
              </span>
            </div>
            <div className="p-3 text-[11px] text-[#888] font-light bg-[#0E0E0E] border-b border-white/5">
              Assistant will outright refuse to execute these actions regardless of prompting.
            </div>

            <div className="p-3 space-y-2.5">
              {redActions.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[#0F0F0F] border border-white/5 text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-serif italic text-[#F0F0F0]">{act.title}</strong>
                    <button
                      onClick={() => handleDeleteAction(act.id)}
                      className="text-[#666] hover:text-[#FF5F1F] p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed font-light">{act.description}</p>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => handleTierChange(act.id, 'GREEN')}
                      className="text-[10px] font-mono text-emerald-400 bg-[#121A15] hover:bg-[#152518] px-2 py-0.5 rounded border border-emerald-500/20"
                    >
                      &larr; Move to Green
                    </button>
                    <button
                      onClick={() => handleTierChange(act.id, 'YELLOW')}
                      className="text-[10px] font-mono text-amber-400 bg-[#1A1812] hover:bg-[#252015] px-2 py-0.5 rounded border border-amber-500/20"
                    >
                      &larr; Move to Yellow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
