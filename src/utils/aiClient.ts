import { GoogleGenAI } from '@google/genai';
import { Assistant } from '../types';

export interface LLMRequestOptions {
  systemInstruction?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

/**
 * Direct Client-Side LLM Caller
 * Attempts in order:
 * 1. OpenRouter or Custom Endpoint from localStorage ('hermes_endpoint' + 'hermes_api_key')
 * 2. Gemini API Key from localStorage ('gemini_api_key')
 * 3. Returns null if no direct endpoint/key available (allowing caller to use intelligent local heuristics)
 */
export async function callDirectLLM(options: LLMRequestOptions): Promise<string | null> {
  const hermesEndpoint = localStorage.getItem('hermes_endpoint');
  const hermesApiKey = localStorage.getItem('hermes_api_key');
  const geminiApiKey = localStorage.getItem('gemini_api_key');

  // Option 1: OpenRouter / Custom OpenAI-compatible endpoint
  if (hermesEndpoint && hermesApiKey) {
    try {
      let targetUrl = hermesEndpoint.trim().replace(/\/+$/, '');
      if (!targetUrl.endsWith('/chat/completions')) {
        targetUrl = `${targetUrl}/chat/completions`;
      }

      const isOpenRouter = targetUrl.includes('openrouter.ai');
      const model = isOpenRouter
        ? 'meta-llama/llama-3.3-70b-instruct:free'
        : 'gpt-4o-mini';

      const messages: any[] = [];
      if (options.systemInstruction) {
        messages.push({ role: 'system', content: options.systemInstruction });
      }
      messages.push({ role: 'user', content: options.prompt });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hermesApiKey.trim()}`,
      };

      if (isOpenRouter) {
        headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://hermes-studio.ai';
        headers['X-Title'] = 'Hermes Studio AI';
      }

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1000,
          response_format: options.jsonMode ? { type: 'json_object' } : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.warn('Direct OpenRouter/Hermes endpoint call error:', err);
    }
  }

  // Option 2: Direct Gemini API via @google/genai SDK
  if (geminiApiKey && geminiApiKey.trim()) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.7,
          responseMimeType: options.jsonMode ? 'application/json' : undefined,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Direct Gemini API call error:', err);
    }
  }

  return null;
}

// ----------------------------------------------------
// 1. Client-Side Automation Planner
// ----------------------------------------------------
export async function planAutomationClient(
  taskDescription: string,
  assistant: Assistant
): Promise<{
  name: string;
  description: string;
  cron: string;
  humanSchedule: string;
  actionType: string;
  channel: string;
  workflowSteps: string[];
}> {
  const systemInstruction = `You are an AI Workflow Automation Planner. The user wants to automate a routine for assistant ${assistant.name} (${assistant.role}).
Output ONLY a JSON object with this exact schema:
{
  "name": "Concise Routine Name (3-6 words)",
  "description": "Clear description of the automated job",
  "cron": "Valid standard 5-part cron expression (e.g. 0 8 * * *)",
  "humanSchedule": "Human readable schedule (e.g. Daily at 08:00 AM)",
  "actionType": "SEND_SUMMARY | MONITOR_PRICES | GENERATE_CONTENT | SYSTEM_AUDIT",
  "channel": "Telegram | Webhook | Slack | Email",
  "workflowSteps": ["Step 1 description", "Step 2 description", "Step 3 description"]
}`;

  const raw = await callDirectLLM({
    systemInstruction,
    prompt: `Automate this task: ${taskDescription}`,
    jsonMode: true,
  });

  if (raw) {
    try {
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      console.warn('Failed to parse AI output for automation plan:', e);
    }
  }

  // Fallback intelligent client-side planner
  const isDaily = /pagi|morning|siang|sore|malam|hari|daily/i.test(taskDescription);
  const isHourly = /jam|hour|menit/i.test(taskDescription);
  const isWeekly = /minggu|week|senin|jumat/i.test(taskDescription);

  let cron = '0 8 * * *';
  let humanSchedule = 'Setiap hari pukul 08:00 AM';

  if (isHourly) {
    cron = '0 * * * *';
    humanSchedule = 'Setiap jam sekali';
  } else if (isWeekly) {
    cron = '0 9 * * 1';
    humanSchedule = 'Setiap Senin pukul 09:00 AM';
  }

  return {
    name: taskDescription.slice(0, 38).trim(),
    description: `Otomasi mandiri: ${taskDescription}`,
    cron,
    humanSchedule,
    actionType: 'GENERATE_REPORT',
    channel: 'Telegram',
    workflowSteps: [
      `1. Baca parameter input dan identifikasi data terbaru.`,
      `2. Jalankan sintesis analisis berdasarkan SOP ${assistant.name}.`,
      `3. Format notifikasi dan kirim langsung ke Telegram.`,
    ],
  };
}

// ----------------------------------------------------
// 2. Client-Side SOP Generator
// ----------------------------------------------------
export async function generateSOPClient(
  description: string,
  assistant: Assistant
): Promise<{
  name: string;
  purpose: string;
  trigger: string;
  requiredInput: string[];
  workflowSteps: string[];
  decisionRules: string[];
  outputFormat: string;
  approvalRequirement: string;
  errorHandling: string;
}> {
  const systemInstruction = `You are a Lead Operations Architect creating Standard Operating Procedures for ${assistant.name} (${assistant.role}).
Output ONLY a JSON object with this exact schema:
{
  "name": "Standard SOP Title (e.g. SOP: Verifikasi Penawaran Klien)",
  "purpose": "Clear explanation of what this SOP ensures",
  "trigger": "When this SOP is triggered",
  "requiredInput": ["Input 1", "Input 2"],
  "workflowSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "decisionRules": ["Condition -> Action 1", "Condition -> Action 2"],
  "outputFormat": "Expected output format description",
  "approvalRequirement": "Approval criteria",
  "errorHandling": "What to do if data is invalid or step fails"
}`;

  const raw = await callDirectLLM({
    systemInstruction,
    prompt: `Create a structured SOP for: ${description}`,
    jsonMode: true,
  });

  if (raw) {
    try {
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      console.warn('Failed to parse AI output for SOP:', e);
    }
  }

  return {
    name: `SOP: ${description.slice(0, 35)}`,
    purpose: `Memastikan prosedur "${description}" dijalankan secara terstandarisasi dengan akurasi tinggi.`,
    trigger: `Ketika pengguna atau sistem memanggil instruksi terkait: "${description}"`,
    requiredInput: ['Dokumen / data mentah', 'Kriteria & batasan operasional'],
    workflowSteps: [
      '1. Verifikasi kelengkapan data masukan sebelum memulai proses.',
      '2. Ekstraksi entitas kunci dan bandingkan dengan panduan acuan.',
      '3. Formulasi draf hasil kerja sesuai aturan gaya komunikasi.',
      '4. Finalisasi output dan laporkan ringkasan eksekutif.',
    ],
    decisionRules: [
      'Jika data tidak lengkap > 40%, hentikan proses dan minta klarifikasi pada pengguna.',
      'Jika terdapat anomali nilai di luar batas toleransi, tandai dengan peringatan khusus.',
    ],
    outputFormat: 'Laporan terstruktur dengan ringkasan eksekutif, tabel data, dan rekomendasi aksi.',
    approvalRequirement: 'Persetujuan manual diperlukan jika ada transaksi bernilai tinggi.',
    errorHandling: 'Jika data gagal diproses, catat log kesalahan dan gunakan nilai fallback yang aman.',
  };
}

// ----------------------------------------------------
// 3. Client-Side Skill Generator
// ----------------------------------------------------
export async function generateSkillClient(
  prompt: string,
  assistant: Assistant
): Promise<{
  name: string;
  description: string;
  trigger: string;
  requiredInputs: string[];
  instructions: string[];
  toolsNeeded: string[];
  outputFormat: string;
  relatedSop: string;
}> {
  const systemInstruction = `You are a Modular AI Skill Architect. Design a specialized tool/skill for ${assistant.name} (${assistant.role}).
Output ONLY a JSON object with this exact schema:
{
  "name": "Skill Name (2-4 words)",
  "description": "Specific capability description",
  "trigger": "When to invoke this skill",
  "requiredInputs": ["Input 1", "Input 2"],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "toolsNeeded": ["Web Browser", "Calculator", "API Connector"],
  "outputFormat": "Expected output format",
  "relatedSop": ""
}`;

  const raw = await callDirectLLM({
    systemInstruction,
    prompt: `Design a skill for: ${prompt}`,
    jsonMode: true,
  });

  if (raw) {
    try {
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      console.warn('Failed to parse AI output for Skill:', e);
    }
  }

  return {
    name: prompt.slice(0, 30),
    description: `Kemampuan khusus untuk ${prompt}`,
    trigger: `Ketika pengguna meminta: "${prompt}"`,
    requiredInputs: ['Parameter masukan atau tautan data', 'Format target yang diinginkan'],
    instructions: [
      '1. Analisis kebutuhan instruksi pengguna secara mendalam.',
      '2. Gunakan integrasi yang relevan untuk mengambil data terkini.',
      '3. Validasi hasil sesuai batasan wewenang dan SOP asisten.',
      '4. Sajikan jawaban yang presisi dan siap dieksekusi.',
    ],
    toolsNeeded: ['Internet / Web Browser', 'Internal Memory Store'],
    outputFormat: 'Format rapi dengan bullet point dan rekomendasi praktis.',
    relatedSop: '',
  };
}

// ----------------------------------------------------
// 4. Client-Side Training Input Classifier
// ----------------------------------------------------
export async function classifyTrainingInputClient(
  input: string,
  assistant: Assistant
): Promise<{
  type: string;
  rule: string;
  title: string;
  suggestedDestination: string;
  explanation: string;
  recommendedAction: string;
}> {
  const systemInstruction = `You are an AI Training Classifier. Categorize the user's natural training instruction for assistant ${assistant.name} into one of:
- BEHAVIOR RULE (communication style, tone, constraints)
- SOP (step-by-step business procedure)
- MEMORY (facts, prices, contacts, company policies)
- AUTHORITY RULE (financial limits, human approvals)

Output ONLY a JSON object:
{
  "type": "BEHAVIOR RULE | SOP | MEMORY | AUTHORITY RULE",
  "rule": "Clean, formulated rule string",
  "title": "Short title",
  "suggestedDestination": "Behavior Rules | SOP Builder | Memory Store | Authority Rules",
  "explanation": "Why this category was selected",
  "recommendedAction": "Save as ..."
}`;

  const raw = await callDirectLLM({
    systemInstruction,
    prompt: input,
    jsonMode: true,
  });

  if (raw) {
    try {
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      console.warn('Failed to parse training classification:', e);
    }
  }

  // Heuristic classification
  const lower = input.toLowerCase();
  let type = 'BEHAVIOR RULE';
  let suggestedDestination = 'Behavior Rules';

  if (/sop|langkah|tahap|prosedur|alur|workflow/i.test(lower)) {
    type = 'SOP';
    suggestedDestination = 'SOP Builder';
  } else if (/harga|kontak|email|rekening|profil|faq|fakta|perusahaan|data/i.test(lower)) {
    type = 'MEMORY';
    suggestedDestination = 'Memory Store';
  } else if (/izin|approval|otoritas|maksimal|nominal|disetujui|wewenang|larangan/i.test(lower)) {
    type = 'AUTHORITY RULE';
    suggestedDestination = 'Authority Rules';
  }

  return {
    type,
    rule: input.trim(),
    title: input.slice(0, 35) + (input.length > 35 ? '...' : ''),
    suggestedDestination,
    explanation: `Instruksi diklasifikasikan sebagai ${type} untuk memandu operasional ${assistant.name}.`,
    recommendedAction: `Save as ${suggestedDestination}`,
  };
}
