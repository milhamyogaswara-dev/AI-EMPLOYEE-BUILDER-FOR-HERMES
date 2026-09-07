import React, { useState } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Zap,
  Sparkles,
  Plus,
  Clock,
  Play,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
  Send,
  Loader2,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
} from 'lucide-react';
import { Assistant, AutomationItem } from '../../types';
import { planAutomationClient } from '../../utils/aiClient';

interface AutomationViewProps {
  assistant: Assistant;
  automations: AutomationItem[];
  onAddAutomation: (auto: Omit<AutomationItem, 'id'>) => void;
  onToggleAutomation: (id: string) => void;
  onDeleteAutomation: (id: string) => void;
  onOpenGuide?: (topicId: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  assistant,
  automations,
  onAddAutomation,
  onToggleAutomation,
  onDeleteAutomation,
  onOpenGuide,
}) => {
  const { t } = useLanguage();
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [promptText, setPromptText] = useState<string>('');
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [plannedPlan, setPlannedPlan] = useState<any | null>(null);

  const assistantAutomations = automations.filter((a) => a.assistantId === assistant.id);

  const handlePlanAutomation = async () => {
    if (!promptText.trim()) return;
    setIsPlanning(true);

    try {
      const plan = await planAutomationClient(promptText, assistant);
      setPlannedPlan(plan);
    } catch (err) {
      console.error('Automation planning error:', err);
      setPlannedPlan({
        name: promptText.slice(0, 35),
        description: `Otomasi rutin untuk: ${promptText}`,
        cron: '0 8 * * *',
        humanSchedule: 'Setiap hari pukul 08:00 AM',
        actionType: 'GENERATE_REPORT',
        channel: 'Telegram',
        workflowSteps: [
          'Jalankan pembacaan data performa.',
          'Format ringkasan eksekutif.',
          'Kirim pesan notifikasi ke Telegram.',
        ],
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const handleSavePlannedAutomation = () => {
    if (!plannedPlan) return;

    onAddAutomation({
      assistantId: assistant.id,
      name: plannedPlan.name,
      description: plannedPlan.description,
      schedule: plannedPlan.humanSchedule || 'Setiap hari pukul 08:00 AM',
      cronExpression: plannedPlan.cron || '0 8 * * *',
      action: plannedPlan.actionType || 'SEND_SUMMARY',
      channel: plannedPlan.channel || 'Telegram',
      status: 'ACTIVE',
      lastRun: 'Never',
      nextRun: 'Tomorrow at 08:00 AM',
    });

    setPlannedPlan(null);
    setPromptText('');
    setIsAiModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Cron Orchestrator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {assistant.name}&apos;s Automations &amp; Routines
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Convert natural language instructions into scheduled routines, daily reports, competitor monitoring, and Telegram notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          {onOpenGuide && (
            <button
              onClick={() => onOpenGuide('guide_automation')}
              id="btn-automation-guide"
              className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 hover:border-[#FF5F1F]/40 text-white font-mono text-xs transition flex items-center gap-2 shadow-sm"
              title="Pelajari bagaimana automation & scheduled routines bekerja"
            >
              <HelpCircle className="w-4 h-4 text-[#FF5F1F]" />
              <span>Bagaimana automation bekerja?</span>
            </button>
          )}

          <button
            onClick={() => setIsAiModalOpen(true)}
            id="btn-add-automation-ai"
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 active:scale-98 uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Routine</span>
          </button>
        </div>
      </div>

      {/* Automations Grid */}
      {assistantAutomations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assistantAutomations.map((auto) => {
            const isActive = auto.status === 'ACTIVE';
            return (
              <div
                key={auto.id}
                className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 shadow-sm p-5 flex flex-col justify-between transition group"
                id={`automation-card-${auto.id}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                          isActive
                            ? 'bg-[#1F1410] text-[#FF5F1F] border-[#FF5F1F]/30'
                            : 'bg-[#1C1C1C] text-[#666] border-white/5'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">{auto.name}</h4>
                        <span className="text-[10px] text-[#888] font-mono">
                          {auto.cronExpression}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleAutomation(auto.id)}
                      className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full transition border ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#1C1C1C] text-[#666] border-white/5'
                      }`}
                    >
                      {isActive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  <p className="text-xs text-[#AAA] font-light leading-relaxed mb-3">
                    {auto.description}
                  </p>

                  <div className="space-y-2 py-2.5 border-y border-white/10 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#888] font-mono text-[10px] uppercase">Schedule:</span>
                      <strong className="text-[#DDD] font-mono text-[11px]">{auto.schedule}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#888] font-mono text-[10px] uppercase">Notification:</span>
                      <span className="text-[#FF5F1F] font-mono text-[11px]">{auto.channel}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#888] font-mono text-[10px] uppercase">Next run:</span>
                      <span className="text-[#AAA] font-mono text-[11px]">{auto.nextRun}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#666]">
                  <span>Last run: {auto.lastRun}</span>
                  <button
                    onClick={() => onDeleteAutomation(auto.id)}
                    className="p-1 rounded text-[#666] hover:text-[#FF5F1F] transition"
                    title="Delete automation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl p-12 border border-white/10 text-center space-y-3">
          <Zap className="w-10 h-10 mx-auto text-[#FF5F1F]" />
          <h3 className="text-xl font-serif italic text-[#F0F0F0]">
            No active automations configured.
          </h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto font-light">
            Schedule recurring tasks like daily morning briefings, weekly performance digests, or hourly competitor price monitoring.
          </p>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Create Automation</span>
          </button>
        </div>
      )}

      {/* AI Automation Planner Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F0F0F0] font-serif italic text-lg">
                <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
                <span>Create Automation with AI</span>
              </div>
              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setPlannedPlan(null);
                }}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {!plannedPlan ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                    What routine should your assistant perform on schedule?
                  </label>
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Example: Send me a Telegram message every morning at 8:00 AM with a 3-bullet marketing priority checklist."
                    className="w-full p-3.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F] font-light leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlanAutomation}
                    disabled={isPlanning || !promptText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] disabled:opacity-40 text-white font-mono text-xs shadow-md transition flex items-center gap-2 uppercase tracking-wider"
                  >
                    {isPlanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Synthesize Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="bg-[#181410] p-5 rounded-xl border border-[#FF5F1F]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF5F1F] bg-[#1F1410] px-2 py-0.5 rounded border border-[#FF5F1F]/30">
                      Generated Routine Plan
                    </span>
                    <span className="text-sm font-serif italic text-[#F0F0F0]">{plannedPlan.name}</span>
                  </div>

                  <p className="text-[#AAA] font-light">{plannedPlan.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block mb-0.5">Cron Schedule:</span>
                      <div className="font-mono text-[#F0F0F0]">{plannedPlan.cron}</div>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block mb-0.5">Channel:</span>
                      <div className="font-mono text-[#FF5F1F]">{plannedPlan.channel}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPlannedPlan(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
                  >
                    Back / Redo
                  </button>
                  <button
                    onClick={handleSavePlannedAutomation}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Schedule Automation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
