import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Assistant, SOP } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateSOPClient } from '../../utils/aiClient';

interface SOPViewProps {
  assistant: Assistant;
  sops: SOP[];
  onAddSOP: (sop: Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSOP: (sop: SOP) => void;
  onDeleteSOP: (id: string) => void;
}

export const SOPView: React.FC<SOPViewProps> = ({
  assistant,
  sops,
  onAddSOP,
  onUpdateSOP,
  onDeleteSOP,
}) => {
  const { t } = useLanguage();
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSop, setGeneratedSop] = useState<any | null>(null);
  const [expandedSopId, setExpandedSopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const assistantSops = sops.filter((s) => s.assistantId === assistant.id);

  const handleGenerateSOP = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const sop = await generateSOPClient(aiPrompt, assistant);
      setGeneratedSop(sop);
    } catch (err) {
      console.error('SOP generation error:', err);
      setGeneratedSop({
        name: aiPrompt.slice(0, 40),
        purpose: `Menjalankan prosedur ${aiPrompt} secara terstruktur dan terstandarisasi.`,
        trigger: `Ketika pengguna meminta: "${aiPrompt}"`,
        requiredInput: ['Data atau dokumen pendukung', 'Kriteria & batas toleransi'],
        workflowSteps: [
          '1. Validasi kelengkapan data input.',
          '2. Ekstraksi poin-poin data kunci.',
          '3. Terapkan logika pemrosesan SOP.',
          '4. Susun laporan ringkas dengan rekomendasi tindak lanjut.',
        ],
        decisionRules: [
          'Jika data input kurang dari 50%, minta konfirmasi pengguna sebelum melanjutkan.',
        ],
        outputFormat: 'Laporan ringkas terstruktur dengan poin-poin eksekutif.',
        approvalRequirement: 'Memerlukan persetujuan sebelum eksekusi tindakan eksternal.',
        errorHandling: 'Jika terjadi kendala data, dokumentasikan asumsi yang digunakan.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedSop = () => {
    if (!generatedSop) return;

    onAddSOP({
      assistantId: assistant.id,
      name: generatedSop.name,
      purpose: generatedSop.purpose,
      trigger: generatedSop.trigger,
      requiredInput: generatedSop.requiredInput || ['Data input'],
      workflowSteps: generatedSop.workflowSteps || ['Langkah 1'],
      decisionRules: generatedSop.decisionRules || ['Aturan keputusan'],
      outputFormat: generatedSop.outputFormat || 'Laporan Ringkas',
      approvalRequirement: generatedSop.approvalRequirement || 'None',
      errorHandling: generatedSop.errorHandling || 'Log error',
    });

    setGeneratedSop(null);
    setAiPrompt('');
    setIsAiModalOpen(false);
  };

  const filteredSops = assistantSops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Standard Operating Protocols</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {assistant.name}&apos;s Operational Playbooks
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            SOPs codify meticulous, step-by-step procedures, decision trees, and quality gates for critical business operations.
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          id="btn-generate-sop-ai"
          className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 shrink-0 active:scale-98 tracking-wider uppercase relative z-10"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize SOP</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SOP by name or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F]"
          />
        </div>

        <span className="text-xs font-mono text-[#888]">
          Total SOPs: <strong className="text-[#FF5F1F]">{assistantSops.length} Playbooks</strong>
        </span>
      </div>

      {/* SOPs List */}
      {filteredSops.length > 0 ? (
        <div className="space-y-4">
          {filteredSops.map((sop) => {
            const isExpanded = expandedSopId === sop.id;
            return (
              <div
                key={sop.id}
                className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 shadow-sm transition overflow-hidden group"
                id={`sop-card-${sop.id}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30">
                          SOP PLAYBOOK
                        </span>
                        <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">{sop.name}</h4>
                      </div>
                      <p className="text-xs text-[#AAA] leading-relaxed font-light">
                        {sop.purpose}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedSopId(isExpanded ? null : sop.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-[#CCC] font-mono text-xs transition flex items-center gap-1 uppercase"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Protocol'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onDeleteSOP(sop.id)}
                        className="p-1.5 rounded-lg text-[#666] hover:text-[#FF5F1F] hover:bg-[#1C1C1C] transition"
                        title="Delete SOP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block">Trigger:</span>
                      <span className="text-[#DDD] text-[11px] font-light">{sop.trigger}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block">Output Archetype:</span>
                      <span className="text-[#FF5F1F] text-[11px] font-mono">{sop.outputFormat}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block">Approval Gate:</span>
                      <span className="text-amber-400 text-[11px] font-mono">{sop.approvalRequirement}</span>
                    </div>
                  </div>

                  {/* Full Workflow Expansion */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 text-xs animate-fadeIn">
                      {/* Step-by-Step Execution */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#888] block mb-2">
                          Standard Execution Steps:
                        </span>
                        <div className="space-y-1.5 pl-2">
                          {sop.workflowSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#0F0F0F] border border-white/5 text-[#CCC] font-light text-[11px] border-l-2 border-l-[#FF5F1F]"
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Decision Rules */}
                      {sop.decisionRules.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5F1F] block mb-2">
                            Decision &amp; Branching Logic:
                          </span>
                          <div className="space-y-1.5 pl-2">
                            {sop.decisionRules.map((rule, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-[#141210] border border-[#FF5F1F]/20 text-[#DDD] font-light text-[11px]"
                              >
                                &bull; {rule}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error Handling */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#888] block mb-1">
                          Exception Handling &amp; Fallback:
                        </span>
                        <p className="text-[11px] text-[#AAA] italic bg-[#0F0F0F] p-3 rounded-xl border border-white/5 font-light">
                          {sop.errorHandling}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl p-12 border border-white/10 text-center space-y-3">
          <FileCheck2 className="w-10 h-10 mx-auto text-[#FF5F1F]" />
          <h3 className="text-xl font-serif italic text-[#F0F0F0]">
            No SOPs configured for {assistant.name} yet.
          </h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto font-light">
            Create standard operating procedures to guarantee consistent execution quality across every repeated task.
          </p>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Generate SOP</span>
          </button>
        </div>
      )}

      {/* Generate SOP with AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F0F0F0] font-serif italic text-lg">
                <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
                <span>Operational SOP Synthesis</span>
              </div>
              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setGeneratedSop(null);
                }}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {!generatedSop ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                    Describe what workflow you want your assistant to standardize:
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Example: I want my assistant to analyze Meta Ads campaigns weekly, check CTR/ROAS, and generate an executive report."
                    className="w-full p-3.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:border-[#FF5F1F] focus:outline-none font-light leading-relaxed"
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
                    onClick={handleGenerateSOP}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] disabled:opacity-40 text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 uppercase tracking-wider"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing SOP...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate SOP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="bg-[#0F0F0F] p-5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF5F1F]">
                      Synthesized Playbook
                    </span>
                    <span className="font-serif italic text-sm text-[#F0F0F0]">{generatedSop.name}</span>
                  </div>

                  <p className="text-[#AAA] font-light italic leading-relaxed">&ldquo;{generatedSop.purpose}&rdquo;</p>

                  <div className="space-y-1 pt-1">
                    <strong className="text-[#888] font-mono text-[10px] uppercase block">Workflow Steps:</strong>
                    {generatedSop.workflowSteps?.map((step: string, idx: number) => (
                      <div key={idx} className="text-[#CCC] font-light pl-2 border-l border-[#FF5F1F]/40 text-[11px]">
                        {step}
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <strong className="text-[#888] font-mono text-[10px] uppercase block mb-1">Approval Gate:</strong>
                    <p className="text-amber-400 font-mono text-[11px] bg-[#141210] p-2 rounded-lg border border-[#FF5F1F]/20">{generatedSop.approvalRequirement}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setGeneratedSop(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
                  >
                    Redo
                  </button>
                  <button
                    onClick={handleSaveGeneratedSop}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save SOP to Playbook</span>
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
