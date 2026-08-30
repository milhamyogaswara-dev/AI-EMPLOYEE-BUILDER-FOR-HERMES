import { useLanguage } from "../../contexts/LanguageContext";
import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Brain,
  FileCheck2,
  ShieldAlert,
  Send,
  Check,
  Edit2,
  Trash2,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Assistant, RuleType, TrainingRule } from '../../types';
import { classifyTrainingInputClient } from '../../utils/aiClient';

interface TrainingCenterViewProps {
  assistant: Assistant;
  rules: TrainingRule[];
  onAddRule: (rule: Omit<TrainingRule, 'id' | 'createdAt'>) => void;
  onDeleteRule: (id: string) => void;
  onUpdateRule: (rule: TrainingRule) => void;
}

interface DetectedClassification {
  type: RuleType;
  rule: string;
  title: string;
  suggestedDestination: string;
  explanation: string;
  recommendedAction: string;
}

export const TrainingCenterView: React.FC<TrainingCenterViewProps> = ({
  assistant,
  rules,
  onAddRule,
  onDeleteRule,
  onUpdateRule,
}) => {
  const { lang } = useLanguage();
  const [trainInput, setTrainInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedItem, setDetectedItem] = useState<DetectedClassification | null>(null);
  const [isEditingDetected, setIsEditingDetected] = useState<boolean>(false);
  const [editedRuleText, setEditedRuleText] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const assistantRules = rules.filter((r) => r.assistantId === assistant.id);

  // Quick training prompt chips
  const samplePrompts = [
    `Every time I ask you to create Facebook Ads, give me 3 hook variations before writing the full copy.`,
    `Always present the top 3 actionable recommendations before explaining deep metric calculations.`,
    `My flagship product BuildRAB AI costs Rp149.000 / month.`,
    `Never modify live campaign budgets without my explicit confirmation.`,
    `Address me as Pak Ilham and keep weekly briefings under 2 minutes reading time.`,
  ];

  const handleTrainSubmit = async (textToTrain?: string) => {
    const query = textToTrain || trainInput;
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setDetectedItem(null);

    try {
      const item = await classifyTrainingInputClient(query, assistant);
      setDetectedItem(item);
      setEditedRuleText(item.rule);
    } catch (err) {
      console.error('Training classification error:', err);
      setDetectedItem({
        type: 'BEHAVIOR RULE',
        rule: query.trim(),
        title: query.slice(0, 35) + '...',
        suggestedDestination: 'Behavior Rules',
        explanation: 'Aturan perilaku komunikasi berhasil diformulasikan.',
        recommendedAction: 'Save as Behavior Rules',
      });
      setEditedRuleText(query.trim());
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveDetected = () => {
    if (!detectedItem) return;

    onAddRule({
      assistantId: assistant.id,
      title: detectedItem.title,
      rule: isEditingDetected ? editedRuleText : detectedItem.rule,
      type: detectedItem.type,
      destination: detectedItem.suggestedDestination,
      source: 'TRAINING_CENTER',
    });

    setDetectedItem(null);
    setTrainInput('');
    setIsEditingDetected(false);
  };

  const filteredRules = assistantRules.filter((r) => {
    const matchesCat = selectedCategoryFilter === 'ALL' || r.type === selectedCategoryFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Conversational Neural Training</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
              Train {assistant.name} With Natural Rules
            </h2>
            <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
              Speak naturally as you would to a protege. The intelligence atelier automatically classifies whether it is a Behavior Rule, User Preference, Business Knowledge, SOP, or Restriction.
            </p>
          </div>

          <div className="shrink-0 bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right">
            <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider">Learned Rules</div>
            <div className="text-xl font-serif italic text-[#FF5F1F]">{assistantRules.length} Active</div>
          </div>
        </div>
      </div>

      {/* Main Training Input Box */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 shadow-sm space-y-4">
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888]">
          Conversational Training Terminal
        </label>

        <div className="relative">
          <textarea
            rows={3}
            value={trainInput}
            onChange={(e) => setTrainInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleTrainSubmit();
              }
            }}
            placeholder="Example: Every time I ask you to create Facebook Ads, give me 3 hook variations before writing the full copy."
            id="textarea-train-input"
            className="w-full p-4 rounded-xl bg-[#0F0F0F] border border-white/10 text-sm text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F] font-light leading-relaxed transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-[10px] font-mono text-[#666]">
            Press <kbd className="px-1.5 py-0.5 bg-[#1C1C1C] border border-white/10 rounded text-[10px] text-[#AAA]">Ctrl+Enter</kbd> to submit
          </div>

          <button
            onClick={() => handleTrainSubmit()}
            disabled={isAnalyzing || !trainInput.trim()}
            id="btn-submit-train"
            className="px-6 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] disabled:opacity-40 text-white font-medium text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center justify-center gap-2 active:scale-98 tracking-wide font-mono uppercase"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Classifying Rule...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Teach {assistant.name}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-[10px] uppercase font-mono text-[#666] tracking-widest block mb-2">
            Curated Inspiration Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTrainInput(prompt);
                  handleTrainSubmit(prompt);
                }}
                className="text-[11px] px-3 py-1 rounded-lg bg-[#0D0D0D] hover:bg-[#1C1C1C] hover:text-[#FF5F1F] text-[#888] border border-white/5 transition text-left truncate max-w-full font-light"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Smart Classifier Detection Card */}
      {detectedItem && (
        <div className="bg-[#171412] rounded-2xl p-6 border border-[#FF5F1F]/40 shadow-xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FF5F1F] font-serif italic text-base">
              <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
              <span>Rule Detected by Atelier</span>
            </div>
            <span className="text-[9px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF5F1F] text-white">
              {detectedItem.type}
            </span>
          </div>

          <div className="bg-[#0F0F0F] p-4 rounded-xl border border-white/10 shadow-sm space-y-2">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#666]">
              Formulated Rule
            </div>

            {isEditingDetected ? (
              <textarea
                rows={3}
                value={editedRuleText}
                onChange={(e) => setEditedRuleText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#141414] border border-[#FF5F1F]/50 text-xs text-[#F0F0F0] font-light focus:outline-none"
              />
            ) : (
              <p className="text-xs text-[#E0E0E0] italic leading-relaxed font-light">
                &ldquo;{detectedItem.rule}&rdquo;
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-white/10">
              <div>
                <span className="text-[#666] font-mono uppercase text-[9px] block">Destination:</span>
                <div className="font-mono text-[#FF5F1F]">{detectedItem.suggestedDestination}</div>
              </div>
              <div>
                <span className="text-[#666] font-mono uppercase text-[9px] block">Recommendation:</span>
                <div className="font-mono text-[#AAA]">{detectedItem.recommendedAction}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setDetectedItem(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#666] hover:text-[#AAA] transition uppercase"
              id="btn-ignore-rule"
            >
              Ignore
            </button>
            <button
              onClick={() => setIsEditingDetected(!isEditingDetected)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#AAA] bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 transition uppercase"
              id="btn-edit-detected-rule"
            >
              {isEditingDetected ? 'Done' : 'Edit'}
            </button>
            <button
              onClick={handleSaveDetected}
              className="px-5 py-1.5 rounded-lg bg-[#FF5F1F] hover:bg-[#e04f14] text-white text-xs font-mono tracking-wider shadow-sm transition flex items-center gap-1.5 uppercase"
              id="btn-save-detected-rule"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save as {detectedItem.suggestedDestination}</span>
            </button>
          </div>
        </div>
      )}

      {/* Rules Registry Table & Filter */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-serif italic text-base text-[#F0F0F0]">
              {assistant.name}&apos;s Knowledge &amp; {'Behavioral Rules'} ({assistantRules.length})
            </h3>
            <p className="text-xs text-[#888] font-light">
              Active principles that guide response parameters and operational logic.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="{'Search rules...'}"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:border-[#FF5F1F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: 'All Rules' },
            { id: 'BEHAVIOR RULE', label: 'Behavior Rules' },
            { id: 'USER PREFERENCE', label: 'User Preferences' },
            { id: 'BUSINESS KNOWLEDGE', label: 'Business Knowledge' },
            { id: 'SOP', label: 'SOPs' },
            { id: 'SKILL', label: 'Skills' },
            { id: 'RESTRICTION', label: 'Restrictions' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#FF5F1F] text-white shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                  : 'bg-[#181818] text-[#888] hover:text-[#DDD] border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules List */}
        {filteredRules.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredRules.map((r) => (
              <div
                key={r.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs group hover:bg-[#181818]/60 px-2 rounded-xl transition"
                id={`rule-item-${r.id}`}
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30"
                    >
                      {r.type}
                    </span>
                    <span className="font-serif italic text-sm text-[#F0F0F0]">{r.title}</span>
                    <span className="text-[10px] font-mono text-[#666]">&bull; {r.destination}</span>
                  </div>
                  <p className="text-[#AAA] leading-relaxed font-light">
                    {r.rule}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center opacity-70 group-hover:opacity-100">
                  <button
                    onClick={() => onDeleteRule(r.id)}
                    className="p-1.5 rounded-lg text-[#666] hover:text-[#FF5F1F] hover:bg-[#202020] transition"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#666] text-xs">
            <Brain className="w-8 h-8 mx-auto text-[#444] mb-2" />
            <p className="font-serif italic text-[#888]">No training rules match your filter.</p>
            <p className="text-[11px] font-mono mt-1 text-[#555]">Use the training input above to teach {assistant.name} new rules.</p>
          </div>
        )}
      </div>
    </div>
  );
};
