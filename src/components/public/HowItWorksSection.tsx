import React from 'react';
import { ArrowRight, UserCheck, BookOpen, ShieldAlert, Rocket, ChevronRight, Terminal, Cpu, CheckCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const pipelineFlow = [
    'ROLE',
    'TRAINING',
    'SKILLS',
    'SOP',
    'MEMORY',
    'AUTHORITY',
    'TOOLS',
    'AUTOMATION',
    'TEST',
    'DEPLOY',
  ];

  const steps = [
    {
      step: 'STEP 01',
      title: 'Buat AI Employee',
      desc: 'Tentukan identitas dan spesialisasi agent: nama, role, objective bisnis, serta scope tanggung jawab spesifik.',
      icon: UserCheck,
      details: ['Define Role & Persona', 'Business Objective', 'Job Responsibility'],
    },
    {
      step: 'STEP 02',
      title: 'Ajarkan Cara Kerjanya',
      desc: 'Latih agent dengan panduan perilaku, skill teknis, instruksi SOP langkah demi langkah, dan context memory bisnis.',
      icon: BookOpen,
      details: ['Training Center Rules', 'Equip Skills', 'SOP Step-by-step', 'Memory Store Vault'],
    },
    {
      step: 'STEP 03',
      title: 'Atur Batas & Automation',
      desc: 'Terapkan safety guardrail dengan Authority Rules (Green/Yellow/Red) dan jadwalkan tugas repetitif dengan Automation.',
      icon: ShieldAlert,
      details: ['Authority Rules (Safety)', 'External Tools Access', 'Autonomous Automation'],
    },
    {
      step: 'STEP 04',
      title: 'Test & Deploy',
      desc: 'Uji respons agent di Test Lab dengan benchmark skenario nyata, lalu hubungkan ke runtime Hermes atau API eksternal.',
      icon: Rocket,
      details: ['Test Lab Benchmark', 'Webhook & Integrations', 'Deploy to Hermes Agent'],
    },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sub-section: Pipeline Flow Overview */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
            Structured Workflow
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Dari Hermes Agent Menjadi AI Employee
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            AI Employee Builder memberikan workflow terstruktur agar Anda tidak perlu menebak apa yang harus dikonfigurasi berikutnya.
          </p>

          {/* Visual Pipeline Bar */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#121212] border border-white/10 shadow-xl overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] gap-2">
              {pipelineFlow.map((item, idx) => (
                <React.Fragment key={item}>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#FF5F1F] group-hover:bg-[#FF5F1F]/10 flex items-center justify-center font-mono text-xs font-bold text-gray-300 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-gray-400 group-hover:text-[#FF5F1F] transition-colors">
                      {item}
                    </span>
                  </div>
                  {idx < pipelineFlow.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Steps Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px] font-semibold uppercase tracking-wider mb-3">
            Simple 4-Step Process
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Cara Kerjanya
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-[#121212] hover:bg-[#161616] border border-white/10 hover:border-[#FF5F1F]/40 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-[#FF5F1F] px-2.5 py-1 rounded bg-[#FF5F1F]/10 border border-[#FF5F1F]/20">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-[#FF5F1F] group-hover:border-[#FF5F1F]/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2.5">
                    {s.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  {s.details.map((d) => (
                    <div key={d} className="flex items-center gap-2 text-[11px] font-mono text-gray-300">
                      <CheckCircle className="w-3 h-3 text-[#FF5F1F] shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
