import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Play,
  Share2,
  CheckCircle2,
  Wrench,
  FileCheck2,
  Loader2,
  Layers,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { Assistant, Skill, SOP } from '../../types';
import { NavView } from '../Sidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateSkillClient } from '../../utils/aiClient';

interface SkillsViewProps {
  assistant: Assistant;
  skills: Skill[];
  sops: SOP[];
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  onUpdateSkill: (skill: Skill) => void;
  onDeleteSkill: (id: string) => void;
  onNavigate: (view: NavView) => void;
  onOpenGuide?: (topicId: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  assistant,
  skills,
  sops,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onNavigate,
  onOpenGuide,
}) => {
  const { t } = useLanguage();
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSkill, setGeneratedSkill] = useState<any | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const assistantSkills = skills.filter((s) => s.assistantId === assistant.id);

  const handleGenerateSkill = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      const skill = await generateSkillClient(aiPrompt, assistant);
      setGeneratedSkill(skill);
    } catch (err) {
      console.error('Skill generation error:', err);
      setGeneratedSkill({
        name: aiPrompt.slice(0, 35),
        description: `Kemampuan khusus untuk ${aiPrompt}`,
        trigger: `Ketika pengguna meminta: ${aiPrompt}`,
        requiredInputs: ['Data utama atau URL', 'Kriteria hasil spesifik'],
        instructions: [
          '1. Analisis input dan tentukan prioritas.',
          '2. Jalankan pemrosesan otomatis.',
          '3. Validasi hasil terhadap standar kualitas.',
          '4. Susun laporan ringkas dengan rekomendasi.',
        ],
        toolsNeeded: ['Internet / Web Browser', 'Files'],
        outputFormat: 'Laporan Terstruktur dengan Action Items',
        relatedSop: '',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedSkill = () => {
    if (!generatedSkill) return;

    onAddSkill({
      assistantId: assistant.id,
      name: generatedSkill.name,
      description: generatedSkill.description,
      trigger: generatedSkill.trigger,
      requiredInputs: generatedSkill.requiredInputs || ['Data input'],
      instructions: generatedSkill.instructions || ['Jalankan pemrosesan'],
      toolsNeeded: generatedSkill.toolsNeeded || ['Internet'],
      outputFormat: generatedSkill.outputFormat || 'Structured Markdown Summary',
      testScore: 88,
      version: '1.0.0',
      status: 'ACTIVE',
      usedCount: 0,
      lastUpdated: 'Just now',
    });

    setGeneratedSkill(null);
    setAiPrompt('');
    setIsAiModalOpen(false);
  };

  const filteredSkills = assistantSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modular Capability Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {assistant.name}&apos;s Skills Atelier
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Skills are modular, executable abilities your AI employee can trigger autonomously or upon receiving complex executive directives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          {onOpenGuide && (
            <button
              onClick={() => onOpenGuide('guide_skills')}
              id="btn-skills-guide"
              className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 hover:border-[#FF5F1F]/40 text-white font-mono text-xs transition flex items-center gap-2 shadow-sm"
              title="Pelajari bagaimana Skills bekerja"
            >
              <HelpCircle className="w-4 h-4 text-[#FF5F1F]" />
              <span>Apa itu Skills?</span>
            </button>
          )}

          <button
            onClick={() => setIsAiModalOpen(true)}
            id="btn-build-skill-ai"
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 active:scale-98 tracking-wider uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('skills.synthesize')}</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs text-[#F0F0F0] placeholder-[#555] focus:outline-none focus:border-[#FF5F1F]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#888]">
          <span>
            Total Skills: <strong className="text-[#F0F0F0]">{assistantSkills.length}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Active: <strong className="text-[#FF5F1F]">{assistantSkills.filter((s) => s.status === 'ACTIVE').length}</strong>
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => {
            const isExpanded = expandedSkillId === skill.id;
            return (
              <div
                key={skill.id}
                className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 shadow-sm transition flex flex-col justify-between overflow-hidden group"
                id={`skill-card-${skill.id}`}
              >
                <div className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#1F1F1F] text-[#FF5F1F] border border-[#FF5F1F]/30">
                          v{skill.version}
                        </span>
                        <span className="text-[9px] uppercase font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{skill.status}</span>
                        </span>
                      </div>
                      <h4 className="font-serif italic text-base text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
                        {skill.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[9px] text-[#666] uppercase font-mono">Test Score</div>
                      <div className="text-sm font-serif italic text-[#FF5F1F]">{skill.testScore}/100</div>
                    </div>
                  </div>

                  <p className="text-xs text-[#AAA] mb-3 leading-relaxed font-light">
                    {skill.description}
                  </p>

                  {/* Trigger & Tools Pills */}
                  <div className="space-y-2 py-2.5 border-y border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#666] block mb-0.5">
                        Trigger:
                      </span>
                      <p className="text-[11px] text-[#CCC] italic bg-[#0F0F0F] p-2 rounded-lg border border-white/5 font-light">
                        {skill.trigger}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] uppercase font-mono text-[#666] shrink-0">
                        Tools Needed:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skill.toolsNeeded.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#1C1C1C] text-[#AAA] font-mono text-[10px] border border-white/5"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Step-by-step Instructions */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-3 text-xs animate-fadeIn">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#888] block mb-1">
                          Step-by-step Execution Protocol:
                        </span>
                        <div className="space-y-1">
                          {skill.instructions.map((step, idx) => (
                            <div key={idx} className="text-[11px] text-[#AAA] font-light pl-2 border-l border-[#FF5F1F]/40">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#888] block mb-0.5">
                          Output Archetype:
                        </span>
                        <p className="text-[11px] text-[#FF5F1F] font-mono bg-[#0D0D0D] p-2 rounded-lg border border-[#FF5F1F]/20">
                          {skill.outputFormat}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer CTAs */}
                <div className="px-5 py-3 bg-[#0E0E0E] border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="text-[10px] font-mono text-[#666]">
                    Used {skill.usedCount} times &bull; {skill.lastUpdated}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                      className="px-2 py-1 rounded text-[#888] hover:text-[#F0F0F0] font-mono text-[11px] flex items-center gap-1 uppercase"
                    >
                      <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => onNavigate('testlab')}
                      className="px-3 py-1 rounded-lg bg-[#1F1F1F] hover:bg-[#FF5F1F] text-[#F0F0F0] hover:text-white font-mono text-[11px] flex items-center gap-1 transition uppercase"
                      title="Run skill in Test Lab"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test</span>
                    </button>

                    <button
                      onClick={() => onDeleteSkill(skill.id)}
                      className="p-1 rounded text-[#666] hover:text-[#FF5F1F] hover:bg-[#1A1A1A] transition"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl p-12 border border-white/10 text-center space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-[#FF5F1F]" />
          <h3 className="text-xl font-serif italic text-[#F0F0F0]">
            {assistant.name} has no acquired capabilities yet.
          </h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto font-light">
            Skills codify procedural excellence into repeatable execution blocks. Use the Atelier generator to construct the first skill.
          </p>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Skill</span>
          </button>
        </div>
      )}

      {/* AI Skill Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F0F0F0] font-serif italic text-lg">
                <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
                <span>Skill Synthesis Engine</span>
              </div>
              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setGeneratedSkill(null);
                }}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {!generatedSkill ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#888] mb-1.5">
                    What autonomous execution should {assistant.name} master?
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Example: Analyze competitor landing pages, detect pricing changes, and output a SWOT battle-card."
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
                    onClick={handleGenerateSkill}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] disabled:opacity-40 text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 uppercase tracking-wider"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Skill</span>
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
                      Synthesized Blueprint
                    </span>
                    <span className="font-serif italic text-sm text-[#F0F0F0]">{generatedSkill.name}</span>
                  </div>

                  <p className="text-[#AAA] font-light italic leading-relaxed">&ldquo;{generatedSkill.description}&rdquo;</p>

                  <div className="space-y-1 pt-1">
                    <strong className="text-[#888] font-mono text-[10px] uppercase block">Workflow Steps:</strong>
                    {generatedSkill.instructions?.map((step: string, idx: number) => (
                      <div key={idx} className="text-[#CCC] font-light pl-2 border-l border-[#FF5F1F]/40 text-[11px]">
                        {step}
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <strong className="text-[#888] font-mono text-[10px] uppercase block mb-1">Output Archetype:</strong>
                    <p className="text-[#FF5F1F] font-mono text-[11px] bg-[#141414] p-2 rounded-lg border border-white/5">{generatedSkill.outputFormat}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setGeneratedSkill(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
                  >
                    Redo
                  </button>
                  <button
                    onClick={handleSaveGeneratedSkill}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save to Atelier</span>
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
