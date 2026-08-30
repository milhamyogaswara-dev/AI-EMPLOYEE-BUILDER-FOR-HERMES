import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Folder,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  Archive,
  RefreshCw,
  GitMerge,
  ArrowRight,
} from 'lucide-react';
import { Assistant, Memory, MemoryCategory } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MemoryViewProps {
  assistant: Assistant;
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

const CATEGORIES: { id: MemoryCategory; label: string; desc: string }[] = [
  { id: 'ABOUT_ME', label: 'About Me', desc: 'User persona, preferences, role' },
  { id: 'BUSINESS', label: 'Business', desc: 'Company history, mission, value prop' },
  { id: 'PRODUCTS', label: 'Products & Pricing', desc: 'Product specs, pricing, target buyer' },
  { id: 'PROJECTS', label: 'Projects', desc: 'Active campaigns, initiatives, milestones' },
  { id: 'DECISIONS', label: 'Decisions', desc: 'Prior business choices and rationales' },
  { id: 'RULES', label: 'Rules & Guardrails', desc: 'Strict operational constraints' },
  { id: 'CUSTOM', label: 'Custom Facts', desc: 'Miscellaneous specialized facts' },
];

export const MemoryView: React.FC<MemoryViewProps> = ({
  assistant,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // New Memory Form
  const [formCategory, setFormCategory] = useState<MemoryCategory>('BUSINESS');
  const [formKey, setFormKey] = useState<string>('');
  const [formValue, setFormValue] = useState<string>('');
  const [formImportance, setFormImportance] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  // Conflict Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [activeConflict, setActiveConflict] = useState<Memory | null>(null);

  const assistantMemories = memories.filter((m) => m.assistantId === assistant.id && !m.isArchived);
  const conflictMemories = assistantMemories.filter((m) => m.conflictFlag?.hasConflict);

  const handleCreateOrUpdateMemory = () => {
    if (!formKey.trim() || !formValue.trim()) return;

    if (editingMemory) {
      onUpdateMemory({
        ...editingMemory,
        category: formCategory,
        key: formKey.trim(),
        value: formValue.trim(),
        importance: formImportance,
        conflictFlag: undefined, // Clears conflict on manual edit
        updatedAt: new Date().toISOString(),
      });
      setEditingMemory(null);
    } else {
      onAddMemory({
        assistantId: assistant.id,
        category: formCategory,
        key: formKey.trim(),
        value: formValue.trim(),
        importance: formImportance,
        source: 'MANUAL',
      });
    }

    setFormKey('');
    setFormValue('');
    setIsAddModalOpen(false);
  };

  const openReviewModal = (conflict: Memory) => {
    setActiveConflict(conflict);
    setIsReviewModalOpen(true);
  };

  const handleResolveKeepNew = () => {
    if (activeConflict) {
      onUpdateMemory({
        ...activeConflict,
        value: 'Rp149.000 / month',
        conflictFlag: undefined,
        updatedAt: new Date().toISOString(),
      });
      setIsReviewModalOpen(false);
      setActiveConflict(null);
    }
  };

  const handleResolveKeepLegacy = () => {
    if (activeConflict) {
      onUpdateMemory({
        ...activeConflict,
        value: 'Rp199.000 / month',
        conflictFlag: undefined,
        updatedAt: new Date().toISOString(),
      });
      setIsReviewModalOpen(false);
      setActiveConflict(null);
    }
  };

  const handleResolveEditCustom = () => {
    if (activeConflict) {
      setEditingMemory(activeConflict);
      setFormCategory(activeConflict.category);
      setFormKey(activeConflict.key);
      setFormValue(activeConflict.value);
      setFormImportance(activeConflict.importance);
      setIsReviewModalOpen(false);
      setActiveConflict(null);
      setIsAddModalOpen(true);
    }
  };

  const filteredMemories = assistantMemories.filter((m) => {
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      (m.key || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (m.value || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Brain className="w-3.5 h-3.5" />
            <span>{'Persistent Cognitive Vault'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {`${assistant.name}'s Memory Repository`}
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            {'Your assistant references these persistent facts, pricing models, and business parameters in every conversation and task execution.'}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMemory(null);
            setFormKey('');
            setFormValue('');
            setIsAddModalOpen(true);
          }}
          id="btn-add-memory"
          className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 shrink-0 active:scale-98 uppercase tracking-wider relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>{'Add Fact'}</span>
        </button>
      </div>

      {/* Memory Health Scanner Widget */}
      <div
        className={`p-5 rounded-2xl border transition ${
          conflictMemories.length > 0
            ? 'bg-[#18130E] border-amber-500/30 shadow-sm'
            : 'bg-[#0E1712] border-emerald-500/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {conflictMemories.length > 0 ? (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}

            <div>
              <h4 className="font-serif italic text-base text-[#F0F0F0]">
                {conflictMemories.length > 0
                  ? `${`Memory Integrity Notice: ${conflictMemories.length} Discrepancy Found`}`
                  : 'Cognitive Health: 100% Coherent'}
              </h4>
              <p className="text-xs text-[#888] mt-0.5 font-light">
                {conflictMemories.length > 0
                  ? 'There are conflicting facts in your assistant memory store. Please resolve to maintain high execution accuracy.'
                  : 'No duplicate facts, outdated contradictions, or conflicting parameters found.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {conflictMemories.length > 0 && (
              <button
                onClick={() => openReviewModal(conflictMemories[0])}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-mono text-xs transition uppercase tracking-wider flex items-center gap-1.5"
              >
                <GitMerge className="w-4 h-4" /> {'REVIEW'}
              </button>
            )}
            <span className="text-xs font-mono text-[#888]">{assistantMemories.length} {'facts indexed'}</span>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={'Search memory facts or keywords...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition uppercase ${
              selectedCategory === 'ALL'
                ? 'bg-[#FF5F1F] text-white shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                : 'bg-[#141414] text-[#888] hover:text-[#CCC] border border-white/5'
            }`}
          >
            {'All Folders'} ({assistantMemories.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = assistantMemories.filter((m) => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition uppercase \${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5F1F] text-white shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                    : 'bg-[#141414] text-[#888] hover:text-[#CCC] border border-white/5'
            }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory Cards Grid */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className={`bg-[#141414] rounded-2xl border hover:border-[#FF5F1F]/40 shadow-sm p-5 flex flex-col justify-between transition group \${mem.conflictFlag?.hasConflict ? 'border-amber-500/50 relative overflow-hidden' : 'border-white/10'}`}
              id={`memory-card-\${mem.id}`}
            >
              {mem.conflictFlag?.hasConflict && (
                <div className="absolute top-0 right-0 p-1 bg-amber-500/20 text-amber-500 rounded-bl-lg border-b border-l border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pr-4">
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#AAA] border border-white/5">
                    {mem.category.replace(/_/g, ' ')}
                  </span>

                  <span
                    className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full border \${
                      mem.importance === 'CRITICAL'
                        ? 'bg-[#1F1210] text-[#FF5F1F] border-[#FF5F1F]/30'
                        : mem.importance === 'HIGH'
                        ? 'bg-[#181420] text-violet-400 border-violet-500/30'
                        : 'bg-[#141414] text-[#666] border-white/5'
                    }`}
                  >
                    {mem.importance}
                  </span>
                </div>

                <h4 className="font-serif italic text-sm text-[#F0F0F0] mb-2 group-hover:text-[#FF5F1F] transition">{mem.key}</h4>
                <p className="text-xs text-[#AAA] font-light leading-relaxed bg-[#0F0F0F] p-3 rounded-xl border border-white/5">
                  {mem.value}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#666]">
                <span>Source: {mem.source}</span>
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditingMemory(mem);
                      setFormCategory(mem.category);
                      setFormKey(mem.key);
                      setFormValue(mem.value);
                      setFormImportance(mem.importance);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1 rounded text-[#666] hover:text-[#FF5F1F] transition"
                    title="Edit memory"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1 rounded text-[#666] hover:text-[#FF5F1F] transition"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl p-12 border border-white/10 text-center space-y-3">
          <Brain className="w-10 h-10 mx-auto text-[#FF5F1F]" />
          <h3 className="text-xl font-serif italic text-[#F0F0F0]">
            No facts match this category.
          </h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto font-light">
            Add key facts, prices, user preferences, and business parameters to ground your assistant in accurate data.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory Fact</span>
          </button>
        </div>
      )}

      {/* Review Conflict Modal */}
      {isReviewModalOpen && activeConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-serif italic text-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Memory Integrity Conflict</span>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs font-light text-[#AAA]">
              <strong className="text-amber-400">Context: </strong>
              {activeConflict.conflictFlag?.note}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#18130E] rounded-xl border border-white/10 relative">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#888] block mb-2">Legacy Memory</span>
                <p className="text-sm font-mono text-[#DDD]">Rp199.000 / month</p>
              </div>

              <div className="p-4 bg-[#0E1712] rounded-xl border border-emerald-500/30 relative">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 block mb-2">New Fact Extracted</span>
                <p className="text-sm font-mono text-emerald-300">Rp149.000 / month</p>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0E1712] border border-emerald-500/30 rounded-full flex items-center justify-center hidden sm:flex">
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleResolveEditCustom}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-[#AAA] hover:bg-[#1A1A1A] font-mono text-xs transition uppercase"
              >
                Edit Custom
              </button>
              <button
                onClick={handleResolveKeepLegacy}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs transition uppercase"
              >
                Keep Legacy
              </button>
              <button
                onClick={handleResolveKeepNew}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Check className="w-4 h-4" />
                <span>Keep New</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F0F0F0] font-serif italic text-lg">
                <Brain className="w-5 h-5 text-[#FF5F1F]" />
                <span>{editingMemory ? 'Edit Memory Fact' : 'Add Memory Fact'}</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                  Category Folder
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs font-mono text-[#F0F0F0] focus:border-[#FF5F1F]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({cat.desc})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                  Key / Topic
                </label>
                <input
                  type="text"
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value)}
                  placeholder="e.g. Flagship Product Pricing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                  Fact / Content
                </label>
                <textarea
                  rows={3}
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="e.g. BuildRAB AI costs Rp149.000 / month with 14-day free trial."
                  className="w-full p-3.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F] font-light leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                  Priority Tier
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormImportance(lvl as any)}
                      className={`py-2 text-[10px] font-mono rounded-xl border text-center transition uppercase tracking-wider ${
                        formImportance === lvl
                          ? 'bg-[#FF5F1F] text-white border-[#FF5F1F] shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                          : 'bg-[#0F0F0F] text-[#888] border-white/10 hover:text-[#CCC]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateMemory}
                disabled={!formKey.trim() || !formValue.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] disabled:opacity-40 text-white font-mono text-xs shadow-md transition uppercase tracking-wider"
              >
                {editingMemory ? 'Update Fact' : 'Save Fact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
