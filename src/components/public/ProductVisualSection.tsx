import React from 'react';
import { 
  Terminal, 
  Sparkles, 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  Clock, 
  FlaskConical, 
  CheckCircle2, 
  Users,
  Send,
  Workflow
} from 'lucide-react';

export const ProductVisualSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#070707] border-t border-white/5 relative overflow-hidden" id="workspace-preview">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF5F1F]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Integrated Studio Interface</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Satu Workspace untuk Membangun AI Employee
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Semua modul saling terhubung secara terpusat: dari Training, Skills, SOP, Memory, Authority, hingga Test Lab dan Deployment.
          </p>
        </div>

        {/* Studio Workspace Multi-Panel UI Preview Container */}
        <div className="bg-[#0D0D0D] border border-white/15 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(255,95,31,0.1)] relative">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs font-mono text-gray-400 ml-2 hidden sm:inline">
                hermes-studio.internal // workspace_v2
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Hermes Runtime: ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Grid Layout representing the Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Assistant Navigation & Profile */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                  CURRENT ASSISTANT
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5F1F]/30 to-[#FF5F1F]/10 border border-[#FF5F1F]/40 flex items-center justify-center font-bold text-white text-sm">
                    MK
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Marketing Officer</div>
                    <div className="text-[11px] text-gray-400 font-mono">Autonomous Grade</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between text-gray-400">
                    <span>Readiness:</span>
                    <span className="text-green-400 font-bold">96% Passed</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>SOP Steps:</span>
                    <span className="text-white">8 Active</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Authority:</span>
                    <span className="text-[#FF5F1F]">Protected</span>
                  </div>
                </div>
              </div>

              {/* Module Nav Links */}
              <div className="p-3 rounded-2xl bg-[#141414] border border-white/10 space-y-1 text-xs font-mono">
                {[
                  { name: 'Training Center', active: true, icon: Terminal },
                  { name: 'SOP Builder', active: false, icon: Workflow },
                  { name: 'Memory Store', active: false, icon: Database },
                  { name: 'Authority Rules', active: false, icon: ShieldCheck },
                  { name: 'Test Lab Sandbox', active: false, icon: FlaskConical },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                        item.active 
                          ? 'bg-[#FF5F1F]/15 text-white border border-[#FF5F1F]/30' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.active ? 'text-[#FF5F1F]' : 'text-gray-500'}`} />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center Column: Training & SOP Blueprint */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
                    <span>Behavior Matrix & Persona Configuration</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF5F1F] bg-[#FF5F1F]/10 px-2 py-0.5 rounded border border-[#FF5F1F]/20">
                    LIVE
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">System Prompt Preview</div>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    &ldquo;You are an autonomous Marketing Assistant for Hermes AI Studio. Follow all verified SOP protocols. You never publish ads with budget &gt; Rp500.000 without Yellow Gate confirmation.&rdquo;
                  </p>
                </div>

                {/* SOP Steps preview */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Attached SOP Sequence</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 text-gray-300">
                      <span className="w-5 h-5 rounded bg-white/10 text-center font-bold text-[10px] flex items-center justify-center">1</span>
                      <span>Riset Kompetitor Meta Ads</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 text-gray-300">
                      <span className="w-5 h-5 rounded bg-white/10 text-center font-bold text-[10px] flex items-center justify-center">2</span>
                      <span>Draft Copywriting PAS/AIDA</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 text-gray-300">
                      <span className="w-5 h-5 rounded bg-white/10 text-center font-bold text-[10px] flex items-center justify-center">3</span>
                      <span>Audit Quality & Tone Voice</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2 text-gray-300">
                      <span className="w-5 h-5 rounded bg-white/10 text-center font-bold text-[10px] flex items-center justify-center">4</span>
                      <span>Kirim ke Approval Webhook</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Authority Guardrails & Integrations */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                  AUTHORITY RULES
                </div>
                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300">
                    <strong>[GREEN]</strong> Auto draft ad & copy
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <strong>[YELLOW]</strong> Publish campaign &gt; 500k
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                    <strong>[RED]</strong> Delete customer database
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                  DEPLOYMENT EXPORT
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300">Hermes YAML Format</span>
                  <span className="text-green-400">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
