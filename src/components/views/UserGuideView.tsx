import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Compass,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Layers,
  ShieldAlert,
  Zap,
  FlaskConical,
  Puzzle,
  Rocket,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  GUIDE_TOPICS,
  PRACTICAL_EXAMPLES,
  ROADMAP_STEPS,
  GuideCategory,
  GuideTopic,
  PracticalExample,
} from '../../data/userGuide';
import { GuideRoadmap } from '../guide/GuideRoadmap';
import { GuideCard } from '../guide/GuideCard';
import { GuideDrawer } from '../guide/GuideDrawer';
import { InteractiveTour } from '../guide/InteractiveTour';
import { NavView } from '../Sidebar';
import { UserGuideProgress } from '../../types';

interface UserGuideViewProps {
  guideProgress: UserGuideProgress;
  onUpdateGuideProgress: (updates: Partial<UserGuideProgress>) => void;
  onResetGuideProgress: () => void;
  onNavigate: (view: NavView) => void;
}

const CATEGORY_TABS: { id: GuideCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua Panduan' },
  { id: 'pengenalan', label: 'Pengenalan' },
  { id: 'membuat_ai', label: 'Membuat AI' },
  { id: 'training', label: 'Training Center' },
  { id: 'skills', label: 'Skills' },
  { id: 'sop', label: 'SOP Builder' },
  { id: 'memory', label: 'Memory Store' },
  { id: 'authority', label: 'Authority Rules' },
  { id: 'automation', label: 'Automation' },
  { id: 'testlab', label: 'Test Lab' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'deploy', label: 'Deploy Hermes' },
];

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  guideProgress,
  onUpdateGuideProgress,
  onResetGuideProgress,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | 'all'>('all');
  const [activeDrawerTopic, setActiveDrawerTopic] = useState<GuideTopic | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [expandedExampleId, setExpandedExampleId] = useState<string | null>(PRACTICAL_EXAMPLES[0].id);

  const completedSteps = guideProgress.completedSteps || [];
  const currentStepIndex = guideProgress.currentStep || 1;
  const isAllComplete = completedSteps.length >= ROADMAP_STEPS.length;

  // Filtered topics based on search & category
  const filteredTopics = useMemo(() => {
    return GUIDE_TOPICS.filter((topic) => {
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.shortDescription.toLowerCase().includes(q) ||
        topic.searchKeywords.some((k) => k.toLowerCase().includes(q)) ||
        topic.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Current roadmap step object
  const currentRoadmapStep = ROADMAP_STEPS[currentStepIndex - 1] || ROADMAP_STEPS[0];

  const handleToggleStep = (stepId: string) => {
    const isDone = completedSteps.includes(stepId);
    let nextDone: string[];
    if (isDone) {
      nextDone = completedSteps.filter((id) => id !== stepId);
    } else {
      nextDone = [...completedSteps, stepId];
    }
    const allDone = nextDone.length >= ROADMAP_STEPS.length;
    onUpdateGuideProgress({
      started: true,
      completedSteps: nextDone,
      completed: allDone,
    });
  };

  const handleToggleTopicComplete = (topicId: string) => {
    // Map topicId to step if applicable or add to completed
    handleToggleStep(topicId);
  };

  const handleStartGuide = () => {
    onUpdateGuideProgress({ started: true });
    // Find first uncompleted step
    const firstUncompleted = ROADMAP_STEPS.find((s) => !completedSteps.includes(s.id));
    if (firstUncompleted) {
      const topic = GUIDE_TOPICS.find((t) => t.id === firstUncompleted.guideTopicId);
      if (topic) {
        setActiveDrawerTopic(topic);
      }
    } else {
      // open step 1
      const topic = GUIDE_TOPICS.find((t) => t.id === ROADMAP_STEPS[0].guideTopicId);
      if (topic) setActiveDrawerTopic(topic);
    }
  };

  const handleResumeGuide = () => {
    const topic = GUIDE_TOPICS.find((t) => t.id === currentRoadmapStep.guideTopicId);
    if (topic) {
      setActiveDrawerTopic(topic);
    }
  };

  const toggleBeginnerMode = () => {
    onUpdateGuideProgress({ beginnerMode: !guideProgress.beginnerMode });
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      {/* Top Breadcrumb / Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FF5F1F]/15 text-[#FF5F1F] border border-[#FF5F1F]/30 tracking-widest font-semibold">
              Hermes Studio Academy
            </span>
            <span className="text-xs font-mono text-[#888]">Dokumentasi Resmi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-white tracking-tight">
            Panduan Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA] font-light max-w-2xl leading-relaxed">
            Pusat panduan terintegrasi untuk membangun, melatih, dan mengevaluasi Hermes Agent menjadi asisten AI otonom yang siap membantu bisnis Anda.
          </p>
        </div>

        {/* Action Controls & Beginner Mode Toggle */}
        <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
          <button
            onClick={toggleBeginnerMode}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono transition flex items-center gap-2 ${
              guideProgress.beginnerMode
                ? 'bg-[#FF5F1F]/10 border-[#FF5F1F]/30 text-[#FF5F1F]'
                : 'bg-[#181818] border-white/10 text-[#888] hover:text-white'
            }`}
            title="Aktifkan untuk melihat rekomendasi langkah berikutnya dan bantuan kontekstual di setiap halaman"
          >
            {guideProgress.beginnerMode ? (
              <ToggleRight className="w-4 h-4 text-[#FF5F1F]" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-[#666]" />
            )}
            <span>Mode Pemula: {guideProgress.beginnerMode ? 'Aktif' : 'Nonaktif'}</span>
          </button>

          <button
            onClick={() => setIsTourOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-white/10 text-white text-xs font-mono transition flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Mulai Tur Interaktif</span>
          </button>
        </div>
      </div>

      {/* Hero: "Mulai dari Sini" & Resume Card */}
      <div className="bg-gradient-to-br from-[#181818] via-[#121212] to-[#0D0D0D] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5F1F]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/15 text-[#FF5F1F] text-xs font-mono border border-[#FF5F1F]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mulai dari Sini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
              Bangun Hermes Agent Menjadi AI Employee
            </h2>
            <p className="text-xs sm:text-sm text-[#BBB] font-light leading-relaxed">
              Ikuti panduan langkah demi langkah untuk membangun Hermes Agent menjadi AI Employee yang siap membantu pekerjaan Anda. Dari menentukan Role, menyusun SOP, menetapkan batasan wewenang, hingga pengujian di Test Lab.
            </p>

            {guideProgress.started && !isAllComplete && (
              <div className="pt-2 text-xs font-mono text-[#AAA] flex items-center gap-2 flex-wrap">
                <span className="text-[#FF5F1F]">Langkah Aktif Anda:</span>
                <span className="text-white font-medium">
                  Langkah {currentStepIndex} — {currentRoadmapStep.title}
                </span>
              </div>
            )}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {!guideProgress.started ? (
              <button
                onClick={handleStartGuide}
                className="px-6 py-3.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white text-xs font-mono font-medium transition shadow-[0_0_20px_rgba(255,95,31,0.3)] flex items-center justify-center gap-2"
              >
                <span>Mulai Panduan 10 Langkah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleResumeGuide}
                className="px-6 py-3.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white text-xs font-mono font-medium transition shadow-[0_0_20px_rgba(255,95,31,0.3)] flex items-center justify-center gap-2"
              >
                <span>Lanjutkan Panduan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {guideProgress.started && (
              <button
                onClick={onResetGuideProgress}
                className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-mono text-[#888] hover:text-white transition flex items-center justify-center gap-1.5"
                title="Reset hanya progres checklist panduan ini, data asisten dan konfigurasi Anda tetap aman"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mulai dari Awal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Banner (Only when all 10 steps completed) */}
      {isAllComplete && (
        <div className="bg-[#121A13] border border-emerald-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pencapaian
              </span>
              <h3 className="text-xl font-serif italic text-white">
                Panduan Dasar Selesai
              </h3>
              <p className="text-xs text-[#BBB] font-light leading-relaxed">
                Anda sudah memahami alur dasar membangun AI Employee.
              </p>
              <p className="text-xs text-emerald-300/80 font-mono pt-1">
                Catatan penting: Assistant Anda masih perlu diuji dan disesuaikan berdasarkan kebutuhan bisnis nyata.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-emerald-500/20 flex-wrap">
            <button
              onClick={() => onNavigate('testlab')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Buka Test Lab</span>
            </button>
            <button
              onClick={() => onNavigate('assistants')}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-xs font-mono text-white transition flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Lihat Daftar Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('integrations')}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-xs font-mono text-white transition flex items-center gap-1.5"
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Pelajari Integrations</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: 10-Step Quick Start Roadmap */}
      <GuideRoadmap
        completedSteps={completedSteps}
        currentStepIndex={currentStepIndex}
        onSelectTopic={(topic) => setActiveDrawerTopic(topic)}
        onNavigate={onNavigate}
        onToggleStep={handleToggleStep}
      />

      {/* SECTION 2: Topic Search & Filter Tabs */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-serif italic text-white tracking-tight">
              Katalog Materi Panduan
            </h3>
            <p className="text-xs text-[#888] font-light">
              Pelajari konsep mendalam setiap modul arsitektur Hermes Studio.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari panduan... (SOP, Memory, Rule)"
              className="w-full bg-[#131313] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-[#666] focus:outline-hidden focus:border-[#FF5F1F]/50 transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#FF5F1F] text-white border-[#FF5F1F] shadow-[0_0_12px_rgba(255,95,31,0.25)]'
                  : 'bg-[#141414] text-[#888] hover:text-white border-white/5 hover:border-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Guide Cards Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredTopics.map((topic) => (
              <GuideCard
                key={topic.id}
                topic={topic}
                isCompleted={completedSteps.includes(topic.id)}
                onSelect={(t) => setActiveDrawerTopic(t)}
                onToggleComplete={handleToggleTopicComplete}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#131313] rounded-2xl border border-white/5 space-y-2">
            <HelpCircle className="w-8 h-8 text-[#555] mx-auto" />
            <div className="text-sm font-medium text-white">Tidak ada materi ditemukan</div>
            <p className="text-xs text-[#777]">
              Coba gunakan kata kunci pencarian yang lain atau pilih kategori &quot;Semua Panduan&quot;.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: Practical Example Library (Contoh Praktis) */}
      <div className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5F1F]/10 text-[#FF5F1F] text-[10px] font-mono uppercase tracking-wider border border-[#FF5F1F]/20">
              <Briefcase className="w-3 h-3" />
              <span>Pustaka Contoh Praktis</span>
            </div>
            <h3 className="text-2xl font-serif italic text-white mt-1">
              Contoh Blueprint AI Employee di Dunia Nyata
            </h3>
            <p className="text-xs text-[#888] font-light">
              Pelajari struktur Role, SOP, Skill, Memory, dan Authority pada berbagai fungsi bisnis. Contoh ini bersifat edukasional dan tidak menimpa asisten aktif Anda.
            </p>
          </div>
        </div>

        {/* Practical Example Accordions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {PRACTICAL_EXAMPLES.map((ex) => {
            const isExpanded = expandedExampleId === ex.id;

            return (
              <div
                key={ex.id}
                className="bg-[#131313] border border-white/10 rounded-2xl p-5 space-y-4 transition-colors hover:border-white/20"
              >
                {/* Example Card Header */}
                <div
                  onClick={() => setExpandedExampleId(isExpanded ? null : ex.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#AAA] border border-white/10">
                      {ex.category}
                    </span>
                    <h4 className="text-lg font-serif italic text-white pt-1">
                      {ex.roleTitle}
                    </h4>
                    <p className="text-xs text-[#999] font-light leading-relaxed">
                      {ex.objective}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-white/5 text-[#888] hover:text-white shrink-0 mt-1"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-white/10 text-xs text-[#CCC] animate-fadeIn">
                    {/* Skills */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase text-[#FF5F1F] tracking-wider">
                        Rekomendasi Skills
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ex.skills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] text-[#DDD] text-[11px] font-mono border border-white/5"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SOP */}
                    <div className="space-y-2 bg-[#171717] p-3.5 rounded-xl border border-white/5">
                      <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                        Contoh SOP: {ex.sop.title}
                      </div>
                      <div className="space-y-1.5">
                        {ex.sop.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-[11px]">
                            <span className="font-mono text-amber-400/80 font-bold shrink-0">
                              {sIdx + 1}.
                            </span>
                            <span className="text-[#CCC] leading-relaxed">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Memory Items */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase text-blue-400 tracking-wider">
                        Contoh Rekaman Memory Store
                      </div>
                      <div className="space-y-1">
                        {ex.memoryItems.map((mem, mIdx) => (
                          <div
                            key={mIdx}
                            className="text-[11px] bg-[#171717] p-2 rounded-lg border border-white/5 font-mono text-[#AAA]"
                          >
                            <span className="text-blue-300 font-bold">[{mem.category}]: </span>
                            <span className="text-[#DDD]">{mem.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Authority Rules Grid */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                        Matriks Authority Rules
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg space-y-1">
                          <span className="text-emerald-400 font-mono text-[10px] font-bold block">
                            GREEN (Mandiri)
                          </span>
                          <ul className="text-emerald-200/80 space-y-1">
                            {ex.authorityRules.green.map((g, i) => (
                              <li key={i}>• {g}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg space-y-1">
                          <span className="text-amber-400 font-mono text-[10px] font-bold block">
                            YELLOW (Approval)
                          </span>
                          <ul className="text-amber-200/80 space-y-1">
                            {ex.authorityRules.yellow.map((y, i) => (
                              <li key={i}>• {y}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-lg space-y-1">
                          <span className="text-rose-400 font-mono text-[10px] font-bold block">
                            RED (Terlarang)
                          </span>
                          <ul className="text-rose-200/80 space-y-1">
                            {ex.authorityRules.red.map((r, i) => (
                              <li key={i}>• {r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Automation Example */}
                    <div className="bg-[#171717] p-3 rounded-xl border border-white/5 space-y-1 text-[11px]">
                      <div className="text-[10px] font-mono uppercase text-[#FF5F1F] tracking-wider">
                        Contoh Alur Automation
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                        <div>
                          <span className="text-[#888]">TRIGGER: </span>
                          <span className="text-[#DDD]">{ex.automation.trigger}</span>
                        </div>
                        <div>
                          <span className="text-[#888]">CONDITION: </span>
                          <span className="text-[#DDD]">{ex.automation.condition}</span>
                        </div>
                        <div>
                          <span className="text-[#888]">ACTION: </span>
                          <span className="text-[#DDD]">{ex.automation.action}</span>
                        </div>
                        <div>
                          <span className="text-[#888]">OUTPUT: </span>
                          <span className="text-[#DDD]">{ex.automation.output}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Guide Drawer for Detail Topic */}
      <GuideDrawer
        isOpen={Boolean(activeDrawerTopic)}
        topic={activeDrawerTopic}
        onClose={() => setActiveDrawerTopic(null)}
        onNavigate={onNavigate}
        onMarkStepComplete={handleToggleTopicComplete}
        isCompleted={activeDrawerTopic ? completedSteps.includes(activeDrawerTopic.id) : false}
      />

      {/* Interactive Walkthrough Tour */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigate={onNavigate}
        onCompleteTour={() => {
          onUpdateGuideProgress({ tourCompleted: true });
        }}
      />
    </div>
  );
};
