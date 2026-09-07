import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as yaml from 'js-yaml';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Sparkles,
  Terminal,
  MessageSquare,
  Send,
  Zap,
  Layers,
  FileCode,
  CheckCheck,
  ShieldAlert,
  Bot,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import {
  Assistant,
  Memory,
  Skill,
  SOP,
  ToolItem,
  UserProfile,
  AutomationItem,
  TrainingRule,
} from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface DeployViewProps {
  assistant: Assistant;
  userProfile: UserProfile;
  trainingRules?: TrainingRule[];
  skills: Skill[];
  sops: SOP[];
  memories: Memory[];
  automations: AutomationItem[];
  tools: ToolItem[];
  onDeploy: () => void;
}

export const DeployView: React.FC<DeployViewProps> = ({
  assistant,
  userProfile,
  trainingRules = [],
  skills,
  sops,
  memories,
  automations,
  tools,
  onDeploy,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'CHAT_INSTANT' | 'CLI_MANUAL'>('CHAT_INSTANT');
  const [isCopiedChat, setIsCopiedChat] = useState<boolean>(false);
  const [isCopiedCli, setIsCopiedCli] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('deepseek/deepseek-chat');

  const asstSkills = skills.filter((s) => s.assistantId === assistant.id && s.status === 'ACTIVE');
  const asstSops = sops.filter((s) => s.assistantId === assistant.id);
  const asstMems = memories.filter((m) => m.assistantId === assistant.id && !m.isArchived);
  const asstRules = trainingRules.filter((r) => r.assistantId === assistant.id);
  const connectedTools = tools.filter((t) => t.status === 'CONNECTED');
  const asstAutomations = automations.filter((a) => a.assistantId === assistant.id);

  const assistantSlug = assistant.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'hermes_agent';

  // Environment variable reference for Telegram Bot Token in production
  const savedTelegramToken = '$TELEGRAM_BOT_TOKEN';

  // 1. Structured Markdown Prompt for Chat Deployment
  const chatDeploymentPrompt = `# 🚀 HERMES AGENT DEPLOYMENT MANIFEST
Silakan adopsi profil dan konfigurasi agent berikut sebagai persona, identitas, dan sistem kerja aktif Anda:

## 👤 PROFIL & IDENTITAS AGENT
- **Nama Asisten**: ${assistant.name}
- **Role**: ${assistant.role}
- **Misi Utama**: ${assistant.mission}
- **Bahasa Utama**: ${assistant.language}
- **Level Otoritas**: ${assistant.authorityLevel}
- **Model Rekomendasi**: ${selectedModel}

## 🏢 INFORMASI PEMILIK (OWNER PROFILE)
- **Nama Pemilik**: ${userProfile.name || 'Owner'}
- **Panggilan / Sapaan**: ${userProfile.addressStyle || 'Bapak/Ibu'}
- **Perusahaan / Bisnis**: ${userProfile.company || '-'}
- **Bidang Industri**: ${userProfile.industry || '-'}
- **Target Pasar**: ${userProfile.targetMarket || '-'}
- **Gaya Komunikasi Disukai**: ${userProfile.communicationPref}

## 🎯 TANGGUNG JAWAB UTAMA
${
  assistant.responsibilities && assistant.responsibilities.length > 0
    ? assistant.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')
    : '1. Memberikan respons profesional dan bantuan operasional harian.'
}

## 🧠 MEMORY & FAKTA BISNIS (${asstMems.length} Records)
${
  asstMems.length > 0
    ? asstMems
        .map(
          (m, i) => `### ${i + 1}. [${m.category}] ${m.title}
${m.content}`
        )
        .join('\n\n')
    : '- Tidak ada memory khusus terdaftar.'
}

## 🛠️ ACTIVE SKILLS (${asstSkills.length} Skills)
${
  asstSkills.length > 0
    ? asstSkills
        .map(
          (s, i) => `### Skill ${i + 1}: ${s.name} (v${s.version})
- **Deskripsi**: ${s.description}
- **Trigger**: ${s.trigger || 'Dipanggil sesuai kebutuhan'}
- **Instruksi Kerja**:
${
  s.instructions && s.instructions.length > 0
    ? s.instructions.map((inst, idx) => `  ${idx + 1}. ${inst}`).join('\n')
    : `  ${s.content}`
}`
        )
        .join('\n\n')
    : '- Tidak ada skill kustom terdaftar.'
}

## 📋 STANDAR OPERASIONAL PROSEDUR / SOP (${asstSops.length} Playbooks)
${
  asstSops.length > 0
    ? asstSops
        .map(
          (sp, i) => `### SOP ${i + 1}: ${sp.name}
- **Tujuan**: ${sp.purpose}
- **Pemicu (Trigger)**: ${sp.trigger}
- **Tahapan Prosedur**:
${
  sp.workflowSteps && sp.workflowSteps.length > 0
    ? sp.workflowSteps.map((step, idx) => `  ${idx + 1}. ${step}`).join('\n')
    : '  1. Jalankan langkah standar sesuai panduan.'
}
- **Format Output**: ${sp.outputFormat || 'Format terstruktur rapi'}`
        )
        .join('\n\n')
    : '- Tidak ada SOP khusus terdaftar.'
}

## 🛡️ ATURAN PERILAKU & BATASAN OTORITAS
${
  asstRules.length > 0
    ? asstRules.map((r, i) => `${i + 1}. [${r.type}] ${r.title}: ${r.rule}`).join('\n')
    : '1. Patuhi batasan otorisasi dan jangan membuat komitmen finansial di luar wewenang.'
}

## ⏰ JADWAL OTOMASI & RUTINITAS
${
  asstAutomations.length > 0
    ? asstAutomations
        .map(
          (a, i) =>
            `${i + 1}. **${a.name}** | Jadwal: ${a.schedule || a.cron} | Kanal: ${
              a.channel || 'Telegram'
            } | Tugas: ${a.description}`
        )
        .join('\n')
    : '- Tidak ada jadwal otomasi aktif.'
}

---
**Instruksi Eksekusi untuk Hermes:**
Mohon konfirmasi aktivasi profil ini dengan menyapa ${
    userProfile.addressStyle || 'pemilik'
  } (${userProfile.name}) dan sebutkan 3 kapabilitas utama Anda yang siap melayani hari ini.`;

  // 2. Sequential CLI Bash Script
  const cliCommandsString = `hermes profile create ${assistantSlug}
hermes --profile ${assistantSlug} config set model "${selectedModel}"
hermes --profile ${assistantSlug} config set gateway.platforms.telegram.token "${savedTelegramToken}"
hermes --profile ${assistantSlug} config set gateway.platforms.telegram.enabled true
hermes --profile ${assistantSlug} gateway run`;

  // Handle Copy Actions
  const handleCopyChatPrompt = () => {
    navigator.clipboard.writeText(chatDeploymentPrompt);
    setIsCopiedChat(true);
    setTimeout(() => setIsCopiedChat(false), 2500);
  };

  const handleCopyCliCommands = () => {
    navigator.clipboard.writeText(cliCommandsString);
    setIsCopiedCli(true);
    setTimeout(() => setIsCopiedCli(false), 2500);
  };

  // Generate & Download ZIP Bundle
  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // 1. SOUL.md
      const soulContent = `# SOUL OF ${assistant.name.toUpperCase()}
# Role: ${assistant.role}
# Generated: ${new Date().toISOString()}

## Identity & Mission
- **Name**: ${assistant.name}
- **Role**: ${assistant.role}
- **Mission**: ${assistant.mission}
- **Language**: ${assistant.language}
- **Authority Tier**: ${assistant.authorityLevel}

## Owner Context
- **Name**: ${userProfile.name}
- **Salutation**: ${userProfile.addressStyle}
- **Company**: ${userProfile.company}
- **Industry**: ${userProfile.industry}

## Responsibilities
${assistant.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Directives & Training Rules
${asstRules.map((r, i) => `${i + 1}. [${r.type}] ${r.title}: ${r.rule}`).join('\n')}
`;
      zip.file('SOUL.md', soulContent);

      // 2. config.yaml
      const configYamlData = {
        agent: {
          id: assistant.id,
          name: assistant.name,
          slug: assistantSlug,
          role: assistant.role,
          mission: assistant.mission,
          language: assistant.language,
          authority_level: assistant.authorityLevel,
          model: selectedModel,
        },
        gateway: {
          platforms: {
            telegram: {
              enabled: true,
              token: savedTelegramToken,
            },
          },
        },
        owner: {
          name: userProfile.name,
          address_style: userProfile.addressStyle,
          company: userProfile.company,
        },
        tools: connectedTools.map((t) => ({ key: t.key, name: t.name })),
      };
      zip.file('config.yaml', yaml.dump(configYamlData));

      // 3. skills/ folder
      const skillsFolder = zip.folder('skills');
      asstSkills.forEach((s) => {
        const folderName = s.name.replace(/\s+/g, '_').toLowerCase();
        skillsFolder?.file(
          `${folderName}/SKILL.md`,
          `---
name: "${s.name}"
description: "${s.description}"
version: "${s.version}"
trigger: "${s.trigger || ''}"
---

# ${s.name}

${s.content || s.description}

## Step-by-Step Instructions
${s.instructions?.map((inst, i) => `${i + 1}. ${inst}`).join('\n') || '-'}
`
        );
      });

      // 4. memory.json
      zip.file('memory.json', JSON.stringify(asstMems, null, 2));

      // 5. sops.json
      zip.file('sops.json', JSON.stringify(asstSops, null, 2));

      // 6. cron/routines.json
      const cronFolder = zip.folder('cron');
      cronFolder?.file('routines.json', JSON.stringify(asstAutomations, null, 2));

      // 7. deploy.sh
      zip.file(
        'deploy.sh',
        `#!/usr/bin/env bash
# Deploy script for ${assistant.name}
echo "🚀 Initializing Hermes Profile for ${assistant.name}..."
${cliCommandsString}
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${assistantSlug}_hermes_bundle.zip`);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleRunDeployment = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      onDeploy();
    }, 1000);
  };

  // Deployment Checklist
  const checks = [
    { label: 'Identitas & Misi terkonfigurasi', passed: Boolean(assistant.name && assistant.mission) },
    { label: 'Tanggung jawab utama terdefinisi (min 3)', passed: assistant.responsibilities.length >= 3 },
    { label: 'Fakta memori bisnis tersimpan (min 1)', passed: asstMems.length >= 1 },
    { label: 'Skills operasional aktif (min 1)', passed: asstSkills.length >= 1 },
    { label: 'Standar Operasional (SOP) terdaftar', passed: asstSops.length >= 1 },
    { label: 'Matriks wewenang & aturan terkalibrasi', passed: Boolean(assistant.authorityLevel) },
    { label: 'Skor Test Lab tervalidasi (>80)', passed: assistant.testScore >= 80 },
  ];

  const allPassed = checks.every((c) => c.passed);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[11px] font-mono tracking-widest uppercase mb-2.5 border border-[#FF5F1F]/30">
            <Rocket className="w-3.5 h-3.5" />
            <span>Hermes Production Deployment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F0F0F0] tracking-tight">
            Deploy {assistant.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-xl font-light">
            Pilih metode deployment termudah untuk mengaktifkan asisten AI Anda ke server Hermes atau bot Telegram.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#F0F0F0] border border-white/10 hover:border-[#FF5F1F]/50 font-mono text-xs transition flex items-center justify-center gap-2 active:scale-98"
          >
            <Download className="w-4 h-4 text-[#FF5F1F]" />
            <span>{isDownloadingZip ? 'Zipping...' : 'Unduh Bundle (.ZIP)'}</span>
          </button>

          <button
            type="button"
            onClick={handleRunDeployment}
            disabled={isDeploying || deploySuccess}
            id="btn-deploy-to-hermes"
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#E54F13] disabled:opacity-50 text-white font-mono font-bold text-xs shadow-lg shadow-[#FF5F1F]/20 transition flex items-center justify-center gap-2 active:scale-98"
          >
            {deploySuccess ? (
              <>
                <CheckCheck className="w-4 h-4 text-emerald-300" />
                <span>AKTIF DI HERMES</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>{isDeploying ? 'Mengaktifkan...' : 'Aktivasi Status'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Model Selection Selector */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/20 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-[#F0F0F0]">Target LLM Model Runtime</div>
            <div className="text-[11px] text-[#888] font-light">
              Model yang akan dieksekusi oleh Hermes untuk asisten ini
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#0F0F0F] border border-white/15 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-[#FF5F1F]"
          >
            <option value="deepseek/deepseek-chat">deepseek/deepseek-chat (Direkomendasikan)</option>
            <option value="meta-llama/llama-3.3-70b-instruct">meta-llama/llama-3.3-70b-instruct</option>
            <option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>
            <option value="anthropic/claude-3-5-sonnet">anthropic/claude-3-5-sonnet</option>
            <option value="google/gemini-2.5-flash">google/gemini-2.5-flash</option>
            <option value="qwen/qwen-2.5-72b-instruct">qwen/qwen-2.5-72b-instruct</option>
          </select>
        </div>
      </div>

      {/* TWO PRIMARY DEPLOYMENT TABS */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 bg-[#0D0D0D] rounded-2xl border border-white/10">
          {/* TAB 1 Button */}
          <button
            type="button"
            onClick={() => setActiveTab('CHAT_INSTANT')}
            className={`p-4 rounded-xl text-left transition flex items-start justify-between relative ${
              activeTab === 'CHAT_INSTANT'
                ? 'bg-[#181818] border border-[#FF5F1F]/40 shadow-lg text-[#F0F0F0]'
                : 'bg-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'CHAT_INSTANT'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-[#888]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#F0F0F0]">
                    Opsi Instan: Copy ke Chat Hermes
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                    Paling Direkomendasikan
                  </span>
                </div>
                <p className="text-xs text-[#888] font-light mt-1">
                  1-Click Deploy via chat bot Telegram tanpa perlu buka terminal/server.
                </p>
              </div>
            </div>
          </button>

          {/* TAB 2 Button */}
          <button
            type="button"
            onClick={() => setActiveTab('CLI_MANUAL')}
            className={`p-4 rounded-xl text-left transition flex items-start justify-between relative ${
              activeTab === 'CLI_MANUAL'
                ? 'bg-[#181818] border border-[#FF5F1F]/40 shadow-lg text-[#F0F0F0]'
                : 'bg-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'CLI_MANUAL'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-[#888]'
                }`}
              >
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#F0F0F0]">
                    Opsi Manual: Jalankan di Terminal (CLI)
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold uppercase">
                    VPS / Self-Hosted
                  </span>
                </div>
                <p className="text-xs text-[#888] font-light mt-1">
                  Eksekusi perintah terminal berurutan di server Linux/macOS.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* TAB 1 CONTENT: INSTANT CHAT DEPLOYMENT */}
        {activeTab === 'CHAT_INSTANT' && (
          <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-bold text-base text-[#F0F0F0]">
                    1-Click Deploy via Chat Assistant (Hermes)
                  </h3>
                </div>
                <p className="text-xs text-[#888] mt-1 font-light max-w-2xl">
                  Cukup copy prompt konfigurasi lengkap di bawah ini, lalu kirimkan langsung ke chat asisten Hermes Anda di Telegram. Asisten Anda akan otomatis memproses, membuat profil, dan mengaktifkan bot ini di server.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyChatPrompt}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                    isCopiedChat
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-[#FF5F1F] hover:bg-[#E54F13] text-white shadow-[#FF5F1F]/20'
                  }`}
                >
                  {isCopiedChat ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Prompt Deployment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step Guide Mini */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-[#FF5F1F] font-bold uppercase">Langkah 1</div>
                <div className="font-semibold text-[#F0F0F0]">Klik Copy Prompt</div>
                <div className="text-[11px] text-[#777]">Salin seluruh spesifikasi markdown di bawah.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-[#FF5F1F] font-bold uppercase">Langkah 2</div>
                <div className="font-semibold text-[#F0F0F0]">Buka Chat Telegram Hermes</div>
                <div className="text-[11px] text-[#777]">Buka obrolan dengan bot asisten Hermes Anda.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-[#FF5F1F] font-bold uppercase">Langkah 3</div>
                <div className="font-semibold text-[#F0F0F0]">Paste &amp; Kirim</div>
                <div className="text-[11px] text-[#777]">Hermes akan memuat profil dan aktif seketika.</div>
              </div>
            </div>

            {/* Prompt Preview Box */}
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={handleCopyChatPrompt}
                  className="px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/10 text-xs text-[#CCC] font-mono flex items-center gap-1.5 transition"
                >
                  {isCopiedChat ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{isCopiedChat ? 'Tersalin' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 max-h-96 overflow-y-auto font-mono text-xs text-[#CCC] bg-[#0A0A0A] border border-white/10 rounded-xl leading-relaxed scrollbar-thin whitespace-pre-wrap selection:bg-[#FF5F1F]/30 selection:text-white">
                {chatDeploymentPrompt}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: CLI TERMINAL MANUAL */}
        {activeTab === 'CLI_MANUAL' && (
          <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-base text-[#F0F0F0]">
                    Langkah Manual CLI Terminal
                  </h3>
                </div>
                <p className="text-xs text-[#888] mt-1 font-light max-w-2xl">
                  Jalankan rangkaian perintah berikut di terminal Linux/macOS tempat Hermes terpasang:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCliCommands}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                    isCopiedCli
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                  }`}
                >
                  {isCopiedCli ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Perintah Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Terminal Commands</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step-by-Step Code Instructions */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    1. Buat Profil Agent
                  </div>
                  <code className="text-xs font-mono text-emerald-400 font-semibold">
                    hermes profile create {assistantSlug}
                  </code>
                </div>
                <span className="text-[11px] text-[#777] font-mono">Inisialisasi workspace</span>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    2. Konfigurasi Model LLM
                  </div>
                  <code className="text-xs font-mono text-emerald-400 font-semibold">
                    hermes --profile {assistantSlug} config set model "{selectedModel}"
                  </code>
                </div>
                <span className="text-[11px] text-[#777] font-mono">Target model runtime</span>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    3. Set Token Bot Telegram
                  </div>
                  <code className="text-xs font-mono text-emerald-400 font-semibold break-all">
                    hermes --profile {assistantSlug} config set gateway.platforms.telegram.token "{savedTelegramToken}"
                  </code>
                </div>
                <span className="text-[11px] text-[#777] font-mono shrink-0">Bot authentication</span>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    4. Aktifkan Gateway Telegram
                  </div>
                  <code className="text-xs font-mono text-emerald-400 font-semibold">
                    hermes --profile {assistantSlug} config set gateway.platforms.telegram.enabled true
                  </code>
                </div>
                <span className="text-[11px] text-[#777] font-mono">Enable channel</span>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    5. Jalankan Gateway Runtime
                  </div>
                  <code className="text-xs font-mono text-emerald-400 font-semibold">
                    hermes --profile {assistantSlug} gateway run
                  </code>
                </div>
                <span className="text-[11px] text-[#777] font-mono">Start daemon</span>
              </div>
            </div>

            {/* Full Script Block */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#888] uppercase tracking-wider">
                  Script Lengkap (All-in-One Execution)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCliCommands}
                  className="text-xs font-mono text-[#FF5F1F] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Semua Perintah</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 font-mono text-xs text-[#CCC] overflow-x-auto leading-relaxed">
                <pre>{cliCommandsString}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deployment Readiness Checklist */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#FF5F1F]" />
            <h3 className="font-serif font-bold text-base text-[#F0F0F0]">
              {t('deploy.checklist')}
            </h3>
          </div>
          <span
            className={`text-xs font-mono px-3 py-1 rounded-full border ${
              allPassed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                : 'bg-[#1F1410] text-[#FF5F1F] border-[#FF5F1F]/30'
            }`}
          >
            {checks.filter((c) => c.passed).length} of {checks.length} Passed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {checks.map((check, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                check.passed
                  ? 'bg-[#0E1712] border-emerald-500/20 text-[#DDD]'
                  : 'bg-[#181410] border-[#FF5F1F]/20 text-[#DDD]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#FF5F1F] shrink-0" />
                )}
                <span className="font-light">{check.label}</span>
              </div>
              <span
                className={`text-[9px] uppercase font-mono tracking-widest ${
                  check.passed ? 'text-emerald-400 font-bold' : 'text-[#FF5F1F]'
                }`}
              >
                {check.passed ? 'PASS' : 'WARN'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
