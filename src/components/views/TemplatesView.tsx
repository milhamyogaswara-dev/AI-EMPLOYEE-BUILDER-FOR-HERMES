import React from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Megaphone,
  Briefcase,
  Search,
  PenTool,
  Cpu,
  Layers,
  Code,
  ShoppingBag,
} from 'lucide-react';
import { assistantTemplates } from '../../data/initialData';
import { Assistant, AssistantTemplate } from '../../types';
import { NavView } from '../Sidebar';

interface TemplatesViewProps {
  onCloneTemplate: (assistant: Assistant) => void;
  onNavigate: (view: NavView) => void;
}

const templateAvatars: Record<string, string> = {
  template_marketing: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  template_executive: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  template_content: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  template_research: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  template_developer: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  template_ecommerce: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  template_custom: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
};

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onCloneTemplate,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const handleClone = (tpl: AssistantTemplate) => {
    const avatar = templateAvatars[tpl.id] || templateAvatars.template_custom;

    const newAssistant: Assistant = {
      id: `asst_${Date.now()}`,
      name: tpl.name.replace(' Assistant', '').replace(' Creator', '').toUpperCase(),
      role: tpl.role,
      mission: tpl.defaultMission || tpl.description,
      worksFor: 'ME',
      language: tpl.defaultLanguage || 'INDONESIAN',
      avatar,
      status: 'TRAINING',
      trainingProgress: 75,
      testScore: 85,
      workingStyle: {
        incompleteInfo: 'ASK_FIRST',
        recommendationStyle: 'THREE_OPTIONS',
        riskBehavior: 'ALWAYS_ASK_APPROVAL',
        confidenceBehavior: 'EXPLAIN_UNCERTAINTY',
      },
      authorityLevel: 'SEMI_AUTONOMOUS',
      responsibilities: tpl.defaultResponsibilities || [],
      hermesConfig: {
        endpoint: 'http://localhost:8080/v1/agents',
        hasApiKey: false,
        isConnected: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCloneTemplate(newAssistant);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready-to-Use Assistant Blueprints</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            Curated Starter Archetypes
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Instantly clone pre-configured AI employee roles with built-in skills, responsibilities, and operational guidelines.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assistantTemplates.map((tpl) => {
          const avatar = templateAvatars[tpl.id] || templateAvatars.template_custom;
          return (
            <div
              key={tpl.id}
              className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#FF5F1F]/40 shadow-sm p-5 sm:p-6 flex flex-col justify-between transition group"
              id={`template-card-${tpl.id}`}
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={avatar}
                    alt={tpl.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#FF5F1F]/30 shadow-md grayscale group-hover:grayscale-0 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-serif italic text-lg text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
                      {tpl.name}
                    </h4>
                    <p className="text-xs text-[#FF5F1F] font-mono">{tpl.role}</p>
                  </div>
                </div>

                <p className="text-xs text-[#AAA] italic bg-[#0D0D0D] p-3 rounded-xl border border-white/5 mb-4 font-light leading-relaxed">
                  &ldquo;{tpl.defaultMission || tpl.description}&rdquo;
                </p>

                {/* Responsibilities */}
                <div className="space-y-2 py-3 border-t border-white/10 text-xs">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#888] block mb-1">
                    Core Mandates:
                  </span>
                  {(tpl.defaultResponsibilities || []).slice(0, 4).map((resp, idx) => (
                    <div key={idx} className="text-[#DDD] flex items-center gap-2 text-[11px] font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] shrink-0" />
                      <span className="truncate">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10">
                <button
                  onClick={() => handleClone(tpl)}
                  id={`btn-clone-template-${tpl.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Clone {tpl.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
