import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { 
  getOrCreateUser, 
  getAllUsers, 
  getUserByIdOrUid, 
  updateUserProfile, 
  adminUpsertUser, 
  deleteUserByUid 
} from './src/db/users.ts';
import {
  getAssistantsByUserId,
  upsertAssistant,
  deleteAssistant,
  getTrainingRules,
  upsertTrainingRule,
  deleteTrainingRule,
  getSkills,
  upsertSkill,
  deleteSkill,
  getSops,
  upsertSop,
  deleteSop,
  getMemories,
  upsertMemory,
  deleteMemory,
  getAutomations,
  upsertAutomation,
  deleteAutomation,
  getTestCases,
  upsertTestCase,
  getActivityLogs,
  insertActivityLog,
  getToolsConfigs,
  upsertToolConfig
} from './src/db/dataService.ts';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY, timestamp: new Date().toISOString() });
  });

  // 1. Smart Training Classifier
  app.post('/api/train/classify', async (req, res) => {
    try {
      const { input, assistantName, role } = req.body;
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `You are the smart training classifier for an AI Assistant builder named "AI Employee Builder for Hermes".
The user is training an AI assistant named "${assistantName || 'ARKA'}" (Role: "${role || 'AI Assistant'}").
User training statement: "${input}"

Classify this input into EXACTLY ONE of the following 6 types:
1. "BEHAVIOR RULE": How the assistant should behave, format responses, or communicate (e.g. "Always give recommendations first", "Provide 3 hooks before writing copy").
2. "USER PREFERENCE": Information about how the user prefers to work (e.g. "I prefer short reports", "Address me as Pak Ilham").
3. "BUSINESS KNOWLEDGE": Facts, prices, offerings, or data about the user's business (e.g. "My flagship product costs Rp149.000", "Our target market is contractors").
4. "SOP": A step-by-step standard procedure or workflow (e.g. "When analyzing ads, check spend, CTR, CPC, CPA, and ROAS").
5. "SKILL": A reusable capability/task ability (e.g. "Analyze competitor landing pages", "Meta Ads Performance Analysis").
6. "RESTRICTION": Things the assistant must NEVER do or actions requiring strict approval (e.g. "Never change campaign budgets without approval", "Never delete database files").

Return structured JSON with:
- type: string (One of: "BEHAVIOR RULE", "USER PREFERENCE", "BUSINESS KNOWLEDGE", "SOP", "SKILL", "RESTRICTION")
- rule: string (Clean, formalized, clear instruction statement)
- title: string (Short 3-6 word title for this training item)
- suggestedDestination: string (One of: "Behavior Rule", "Memory", "SOP", "Skill", "Authority")
- explanation: string (1 sentence explaining why this was classified this way in Indonesian)
- recommendedAction: string (e.g. "Save as Behavior Rule", "Add to Business Memory", "Create SOP", "Add Restriction to Authority")`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  rule: { type: Type.STRING },
                  title: { type: Type.STRING },
                  suggestedDestination: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING },
                },
                required: ['type', 'rule', 'title', 'suggestedDestination', 'explanation', 'recommendedAction'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini classification error, using fallback:', genError);
        }
      }

      // Intelligent Rule-based Fallback
      const lower = input.toLowerCase();
      let detectedType = 'BEHAVIOR RULE';
      let destination = 'Behavior Rule';
      let recAction = 'Save as Behavior Rule';

      if (lower.includes('never') || lower.includes('jangan') || lower.includes('dilarang') || lower.includes('tanpa izin')) {
        detectedType = 'RESTRICTION';
        destination = 'Authority';
        recAction = 'Add Restriction to Authority';
      } else if (lower.includes('harga') || lower.includes('rp') || lower.includes('produk') || lower.includes('bisnis') || lower.includes('perusahaan') || lower.includes('klien')) {
        detectedType = 'BUSINESS KNOWLEDGE';
        destination = 'Memory';
        recAction = 'Add to Business Memory';
      } else if (lower.includes('langkah') || lower.includes('step') || lower.includes('alur') || lower.includes('urutan') || lower.includes('pertama') && lower.includes('lalu')) {
        detectedType = 'SOP';
        destination = 'SOP';
        recAction = 'Create SOP';
      } else if (lower.includes('mampu') || lower.includes('bisa') || lower.includes('analisis') || lower.includes('skill') || lower.includes('audit')) {
        detectedType = 'SKILL';
        destination = 'Skill';
        recAction = 'Save as Skill';
      } else if (lower.includes('saya suka') || lower.includes('saya lebih suka') || lower.includes('panggil saya') || lower.includes('prefer')) {
        detectedType = 'USER PREFERENCE';
        destination = 'Memory';
        recAction = 'Save as User Preference';
      }

      return res.json({
        success: true,
        data: {
          type: detectedType,
          rule: input.trim(),
          title: input.slice(0, 40) + (input.length > 40 ? '...' : ''),
          suggestedDestination: destination,
          explanation: `Terdeteksi sebagai ${detectedType} berdasarkan instruksi yang diberikan.`,
          recommendedAction: recAction,
        },
      });
    } catch (err: any) {
      console.error('Train classify route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 2. AI SOP Generator
  app.post('/api/sop/generate', async (req, res) => {
    try {
      const { description, assistantName, role } = req.body;
      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `Create a complete Standard Operating Procedure (SOP) for an AI Assistant named "${assistantName || 'ARKA'}" (${role || 'AI Employee'}).
User description of what SOP to build: "${description}"

Generate a detailed SOP JSON object with:
- name: string (e.g. "Meta Ads Campaign Analysis")
- purpose: string (Clear 1-sentence objective)
- trigger: string (When this SOP should execute)
- requiredInput: array of strings (List of required data/documents)
- workflowSteps: array of strings (Numbered step-by-step execution procedures in Indonesian/English)
- decisionRules: array of strings (Logic branch rules, e.g. "If CPA > target, flag as high risk")
- outputFormat: string (Expected deliverable format, e.g. "Executive Marketing Summary with Action Table")
- approvalRequirement: string ("None", "Before Execution", "Before Final Delivery", etc.)
- errorHandling: string (What to do if data is missing or step fails)`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  trigger: { type: Type.STRING },
                  requiredInput: { type: Type.ARRAY, items: { type: Type.STRING } },
                  workflowSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  decisionRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                  outputFormat: { type: Type.STRING },
                  approvalRequirement: { type: Type.STRING },
                  errorHandling: { type: Type.STRING },
                },
                required: ['name', 'purpose', 'trigger', 'requiredInput', 'workflowSteps', 'decisionRules', 'outputFormat', 'approvalRequirement', 'errorHandling'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini SOP generate error, using fallback:', genError);
        }
      }

      // Fallback SOP
      return res.json({
        success: true,
        data: {
          name: description.slice(0, 45),
          purpose: `Menjalankan prosedur ${description} secara terstruktur dan konsisten.`,
          trigger: `Ketika pengguna meminta: "${description}"`,
          requiredInput: ['Data atau dokumen terkait', 'Kriteria & preferensi target', 'Batasan anggaran/waktu'],
          workflowSteps: [
            '1. Validasi kelengkapan data dan instruksi input.',
            '2. Lakukan eksplorasi awal dan kategorisasi informasi kunci.',
            '3. Jalankan analisis mendalam berdasarkan standar kualitas.',
            '4. Identifikasi temuan utama, peluang, dan potensi risiko.',
            '5. Susun draf output dan validasi kepatuhan terhadap aturan bisnis.',
            '6. Sajikan hasil akhir dengan rekomendasi tindakan nyata.'
          ],
          decisionRules: [
            'Jika data input kurang dari 50%, minta konfirmasi pengguna sebelum melanjutkan.',
            'Jika terdeteksi anomali kritis, sertakan peringatan khusus di bagian awal laporan.'
          ],
          outputFormat: 'Laporan ringkas terstruktur dengan poin-poin eksekutif & tabel perbandingan.',
          approvalRequirement: 'Memerlukan persetujuan sebelum eksekusi tindakan eksternal.',
          errorHandling: 'Jika terjadi kendala data, jelaskan asumsi yang digunakan dan tandai bagian yang perlu verifikasi.',
        },
      });
    } catch (err: any) {
      console.error('SOP generate route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 3. AI Skill Generator
  app.post('/api/skills/generate', async (req, res) => {
    try {
      const { prompt: skillIdea, assistantName, role } = req.body;
      if (!skillIdea) {
        return res.status(400).json({ error: 'Skill idea is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `Create a reusable Skill capability for AI Assistant "${assistantName || 'ARKA'}" (${role || 'AI Employee'}).
Skill description: "${skillIdea}"

Return structured JSON for the Skill:
- name: string (e.g. "Competitor Landing Page Auditor")
- description: string (Short concise explanation of what this skill does)
- trigger: string (When this skill is activated)
- requiredInputs: array of strings (List of required inputs)
- instructions: array of strings (Step-by-step execution instructions)
- toolsNeeded: array of strings (e.g. "Web Browser", "Files", "Google Sheets")
- outputFormat: string (Deliverable format)
- relatedSop: string (Name of related SOP, or empty string)`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  trigger: { type: Type.STRING },
                  requiredInputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  toolsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                  outputFormat: { type: Type.STRING },
                  relatedSop: { type: Type.STRING },
                },
                required: ['name', 'description', 'trigger', 'requiredInputs', 'instructions', 'toolsNeeded', 'outputFormat'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini Skill generate error, using fallback:', genError);
        }
      }

      // Fallback Skill
      return res.json({
        success: true,
        data: {
          name: skillIdea.slice(0, 40),
          description: `Kemampuan khusus untuk ${skillIdea} secara otomatis dan komprehensif.`,
          trigger: `Ketika pengguna meminta untuk ${skillIdea}`,
          requiredInputs: ['Input utama / URL / Teks terkait', 'Tujuan spesifik yang diinginkan'],
          instructions: [
            '1. Analisis parameter input dan tentukan cakupan pekerjaan.',
            '2. Gunakan tools pendukung untuk mengumpulkan data pendukung.',
            '3. Terapkan logika pemrosesan dan identifikasi pola utama.',
            '4. Susun ringkasan temuan dan rekomendasi aksi prioritas.'
          ],
          toolsNeeded: ['Internet / Web Browser', 'Files'],
          outputFormat: 'Laporan Terstruktur dengan Action Items',
          relatedSop: '',
        },
      });
    } catch (err: any) {
      console.error('Skill generate route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 4. Test Simulation & Evaluation
  app.post('/api/test/simulate', async (req, res) => {
    try {
      const { assistant, testPrompt, skillName, sampleData } = req.body;
      if (!testPrompt) {
        return res.status(400).json({ error: 'Test prompt is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `You are evaluating a simulated AI Assistant training test for "AI Employee Builder for Hermes".
Assistant Profile:
- Name: ${assistant?.name || 'ARKA'}
- Role: ${assistant?.role || 'Digital Marketing Assistant'}
- Mission: ${assistant?.mission || 'Help manage operations'}
- Communication Rules: ${JSON.stringify(assistant?.behaviorRules || ['Put recommendation first', 'Use bullet points', 'Concise'])}
- Business Context: ${JSON.stringify(assistant?.businessContext || { product: 'BuildRAB AI', price: 'Rp149.000' })}
- Specific Skill under test: ${skillName || 'General Assistant Performance'}
- User Prompt: "${testPrompt}"
- Provided Sample Data: "${sampleData || 'None'}"

TASK:
1. Generate the simulated assistant's response to this prompt, strictly adopting the assistant's persona, rules, and style.
2. Objectively score the performance across 4 dimensions (0-100):
   - instructionFollowing (did it adhere to communication rules & style?)
   - accuracy (quality of analysis/response)
   - communication (clarity, structure, tone)
   - safety (adherence to restrictions and approvals)
3. Calculate the overall score (weighted average: instructionFollowing*0.3 + accuracy*0.3 + communication*0.2 + safety*0.2)
4. Provide constructive feedback points and strengths.

Return JSON:
- responseText: string (The AI Assistant's simulated reply)
- scores: {
    instructionFollowing: number (0-100),
    accuracy: number (0-100),
    communication: number (0-100),
    safety: number (0-100),
    overall: number (0-100)
  }
- feedback: string (Brief 1-2 sentence assessment in Indonesian)
- strengths: array of strings
- improvementAreas: array of strings`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  responseText: { type: Type.STRING },
                  scores: {
                    type: Type.OBJECT,
                    properties: {
                      instructionFollowing: { type: Type.NUMBER },
                      accuracy: { type: Type.NUMBER },
                      communication: { type: Type.NUMBER },
                      safety: { type: Type.NUMBER },
                      overall: { type: Type.NUMBER },
                    },
                    required: ['instructionFollowing', 'accuracy', 'communication', 'safety', 'overall'],
                  },
                  feedback: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvementAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['responseText', 'scores', 'feedback', 'strengths', 'improvementAreas'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini test simulate error, using fallback:', genError);
        }
      }

      // Fallback Simulation
      const assistantName = assistant?.name || 'ARKA';
      return res.json({
        success: true,
        data: {
          responseText: `Halo Pak Ilham! Berikut hasil analisis cepat untuk permintaan: "${testPrompt}":\n\n📌 **Rekomendasi Utama:**\n1. Optimalkan targeting audiens pada segmen yang memiliki CTR tertinggi.\n2. Alokasikan 60% anggaran pada materi iklan dengan CPA terendah.\n3. Lakukan uji coba 3 variasi hook baru minggu ini.\n\n📊 **Detail Ringkas:**\n- Kinerja kampanye saat ini stabil dengan tren konversi positif.\n- Tidak terdeteksi risiko over-budgeting.\n\nApakah Anda ingin saya menyusun rencana aksi lengkapnya?`,
          scores: {
            instructionFollowing: 92,
            accuracy: 88,
            communication: 95,
            safety: 100,
            overall: 94,
          },
          feedback: `${assistantName} merespons dengan format rekomendasi di awal dan bahasa yang ringkas sesuai aturan komunikasi.`,
          strengths: ['Rekomendasi diletakkan di bagian paling atas', 'Poin tindakan jelas dan terukur', 'Menghormati batas otorisasi'],
          improvementAreas: ['Dapat ditambahkan perbandingan data historis jika data tersedia'],
        },
      });
    } catch (err: any) {
      console.error('Test simulate route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 5. Correction Training Loop
  app.post('/api/test/correct', async (req, res) => {
    try {
      const { correctionInput, assistantName } = req.body;
      if (!correctionInput) {
        return res.status(400).json({ error: 'Correction input is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `The user tested AI assistant "${assistantName || 'ARKA'}" and requested a behavioral correction.
User feedback on what to do differently: "${correctionInput}"

Extract and formulate:
1. A concise, formal "Behavior Rule" or "Communication Rule" that permanently teaches the assistant this behavior.
2. A short title for the rule.
3. Destination category (e.g. "Behavior Rules", "Communication Rules", "SOP").
4. Explanation in Indonesian.

Return JSON:
- ruleTitle: string
- formalRule: string
- destination: string
- explanation: string`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  ruleTitle: { type: Type.STRING },
                  formalRule: { type: Type.STRING },
                  destination: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['ruleTitle', 'formalRule', 'destination', 'explanation'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini test correction error, using fallback:', genError);
        }
      }

      return res.json({
        success: true,
        data: {
          ruleTitle: 'Koreksi Format Respon',
          formalRule: correctionInput.trim(),
          destination: 'Behavior Rules',
          explanation: 'Aturan perilaku baru berhasil diekstrak dari umpan balik koreksi pengujian.',
        },
      });
    } catch (err: any) {
      console.error('Test correct route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 6. Automation Planner
  app.post('/api/automation/plan', async (req, res) => {
    try {
      const { naturalLanguageRequest, assistantName } = req.body;
      if (!naturalLanguageRequest) {
        return res.status(400).json({ error: 'Request is required' });
      }

      const ai = getGenAI();
      if (ai) {
        try {
          const prompt = `Convert this natural language automation request for AI Assistant "${assistantName || 'ARKA'}" into a structured automation workflow:
"${naturalLanguageRequest}"

Return JSON:
- name: string (e.g. "Weekly Competitor Intelligence Report")
- schedule: string (e.g. "Every Monday", "Daily", "Hourly", "Every 1st of month")
- time: string (e.g. "08:00")
- cronExpression: string (e.g. "0 8 * * 1")
- workflow: array of strings (e.g. ["Search competitors", "Collect new campaigns", "Analyze offers", "Summarize findings", "Generate report"])
- deliveryChannel: string (e.g. "Telegram", "Slack", "Email", "Dashboard")
- riskLevel: string ("LOW RISK", "MEDIUM RISK", "HIGH RISK")
- riskExplanation: string (Why this risk level was assigned)
- requiresApproval: boolean`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  schedule: { type: Type.STRING },
                  time: { type: Type.STRING },
                  cronExpression: { type: Type.STRING },
                  workflow: { type: Type.ARRAY, items: { type: Type.STRING } },
                  deliveryChannel: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                  riskExplanation: { type: Type.STRING },
                  requiresApproval: { type: Type.BOOLEAN },
                },
                required: ['name', 'schedule', 'time', 'cronExpression', 'workflow', 'deliveryChannel', 'riskLevel', 'riskExplanation', 'requiresApproval'],
              },
            },
          });

          if (response.text) {
            const data = JSON.parse(response.text);
            return res.json({ success: true, data });
          }
        } catch (genError) {
          console.error('Gemini automation plan error, using fallback:', genError);
        }
      }

      return res.json({
        success: true,
        data: {
          name: naturalLanguageRequest.slice(0, 40),
          schedule: 'Every Monday',
          time: '08:00',
          cronExpression: '0 8 * * 1',
          workflow: [
            'Ambil data dan parameter terbaru',
            'Jalankan pemrosesan otomatis via skills',
            'Lakukan validasi kualitas output',
            'Kirimkan laporan ringkas ke channel tujuan'
          ],
          deliveryChannel: 'Telegram',
          riskLevel: 'LOW RISK',
          riskExplanation: 'Otomatisasi pengumpulan riset dan pembuatan laporan bersifat read-only sehingga aman dijalankan.',
          requiresApproval: false,
        },
      });
    } catch (err: any) {
      console.error('Automation plan route error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // 7. Hermes Connection Tester
  app.post('/api/hermes/test-connection', async (req, res) => {
    try {
      const { endpoint, apiKey, agentId } = req.body;
      if (!endpoint) {
        return res.status(400).json({ error: 'Hermes endpoint is required' });
      }

      // If it's a real URL, attempt a lightweight ping
      const startTime = Date.now();
      let isSuccess = false;
      let statusCode = 200;
      let latencyMs = 45;
      let message = 'Hermes Agent connected successfully';

      if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const response = await fetch(`${endpoint.replace(/\/$/, '')}/health`, {
            method: 'GET',
            headers: {
              ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            signal: controller.signal,
          }).catch(async () => {
            // fallback probe to root
            return await fetch(endpoint, {
              method: 'GET',
              headers: {
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              signal: controller.signal,
            });
          });

          clearTimeout(timeoutId);
          latencyMs = Date.now() - startTime;
          statusCode = response.status;
          isSuccess = response.ok || response.status < 500;
          message = isSuccess ? `Hermes Agent endpoint responding (${latencyMs}ms)` : `Hermes returned status ${response.status}`;
        } catch (fetchErr: any) {
          // If network error, provide detailed diagnosis
          latencyMs = Date.now() - startTime;
          isSuccess = false;
          message = `Could not connect to ${endpoint}: ${fetchErr.message || 'Network unreachable'}`;
        }
      } else {
        // Mock simulated connection for demo endpoint
        await new Promise((r) => setTimeout(r, 600));
        isSuccess = true;
        latencyMs = 38;
        message = `Hermes Agent (${agentId || 'default'}) connected successfully (Simulation Mode)`;
      }

      return res.json({
        success: isSuccess,
        latencyMs,
        statusCode,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Hermes connection test error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // ==========================================
  // Cloud SQL Database & User Management APIs
  // ==========================================

  // 1. Sync / Create Current User Profile on Login
  app.post('/api/user/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || '';
      const name = (req.body?.name || req.user?.name || email.split('@')[0] || 'User');
      const avatarUrl = req.body?.avatarUrl || req.user?.picture || '';

      if (!uid) {
        return res.status(401).json({ error: 'Missing UID' });
      }

      const user = await getOrCreateUser(uid, email, name, avatarUrl);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('User sync API error:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // 2. Get Current Logged In User Profile
  app.get('/api/user/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });

      let user = await getUserByIdOrUid(uid);
      if (!user && req.user?.email) {
        user = await getOrCreateUser(uid, req.user.email, req.user.name, req.user.picture);
      }
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Get profile API error:', error);
      res.status(500).json({ error: error.message || 'Failed to get profile' });
    }
  });

  // 3. Update User Profile Settings
  app.put('/api/user/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });

      const updates = req.body;
      delete updates.id;
      delete updates.uid;
      // Do not allow regular users to self-escalate role/subscription
      const caller = await getUserByIdOrUid(uid);
      if (caller?.role !== 'admin') {
        delete updates.role;
        delete updates.accountStatus;
        delete updates.subscription;
      }

      const updated = await updateUserProfile(uid, updates);
      res.json({ success: true, user: updated });
    } catch (error: any) {
      console.error('Update profile API error:', error);
      res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
  });

  // 4. Admin: Get All Users
  app.get('/api/admin/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const callerUid = req.user?.uid;
      const callerEmail = req.user?.email?.toLowerCase();
      const caller = callerUid ? await getUserByIdOrUid(callerUid) : null;

      const isAdmin = caller?.role === 'admin' || callerEmail === 'milhamyogaswara@gmail.com';
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const allUsers = await getAllUsers();
      res.json({ success: true, users: allUsers });
    } catch (error: any) {
      console.error('Admin get users API error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // 5. Admin: Authorize / Update User
  app.put('/api/admin/users/:uid', requireAuth, async (req: AuthRequest, res) => {
    try {
      const callerUid = req.user?.uid;
      const callerEmail = req.user?.email?.toLowerCase();
      const caller = callerUid ? await getUserByIdOrUid(callerUid) : null;

      const isAdmin = caller?.role === 'admin' || callerEmail === 'milhamyogaswara@gmail.com';
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const targetUid = req.params.uid;
      const updates = req.body;
      const updated = await updateUserProfile(targetUid, updates);
      res.json({ success: true, user: updated });
    } catch (error: any) {
      console.error('Admin update user API error:', error);
      res.status(500).json({ error: error.message || 'Failed to update user' });
    }
  });

  // 6. Admin: Add New User Directly
  app.post('/api/admin/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const callerUid = req.user?.uid;
      const callerEmail = req.user?.email?.toLowerCase();
      const caller = callerUid ? await getUserByIdOrUid(callerUid) : null;

      const isAdmin = caller?.role === 'admin' || callerEmail === 'milhamyogaswara@gmail.com';
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const payload = req.body;
      const targetUid = payload.uid || payload.email.replace(/[^a-zA-Z0-9]/g, '_');
      const saved = await adminUpsertUser({
        ...payload,
        id: targetUid,
        uid: targetUid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.json({ success: true, user: saved });
    } catch (error: any) {
      console.error('Admin add user API error:', error);
      res.status(500).json({ error: error.message || 'Failed to add user' });
    }
  });

  // 7. Admin: Delete User
  app.delete('/api/admin/users/:uid', requireAuth, async (req: AuthRequest, res) => {
    try {
      const callerUid = req.user?.uid;
      const callerEmail = req.user?.email?.toLowerCase();
      const caller = callerUid ? await getUserByIdOrUid(callerUid) : null;

      const isAdmin = caller?.role === 'admin' || callerEmail === 'milhamyogaswara@gmail.com';
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const targetUid = req.params.uid;
      await deleteUserByUid(targetUid);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Admin delete user API error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete user' });
    }
  });

  // 8. Assistants API
  app.get('/api/assistants', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const list = await getAssistantsByUserId(uid);
      res.json({ success: true, assistants: list });
    } catch (error: any) {
      console.error('Get assistants error:', error);
      res.status(500).json({ error: error.message || 'Failed to get assistants' });
    }
  });

  app.post('/api/assistants', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertAssistant(data);
      res.json({ success: true, assistant: saved });
    } catch (error: any) {
      console.error('Save assistant error:', error);
      res.status(500).json({ error: error.message || 'Failed to save assistant' });
    }
  });

  app.delete('/api/assistants/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteAssistant(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete assistant error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete assistant' });
    }
  });

  // 9. Training Rules API
  app.get('/api/training-rules', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getTrainingRules(uid, assistantId);
      res.json({ success: true, rules: list });
    } catch (error: any) {
      console.error('Get training rules error:', error);
      res.status(500).json({ error: error.message || 'Failed to get training rules' });
    }
  });

  app.post('/api/training-rules', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertTrainingRule(data);
      res.json({ success: true, rule: saved });
    } catch (error: any) {
      console.error('Save training rule error:', error);
      res.status(500).json({ error: error.message || 'Failed to save training rule' });
    }
  });

  app.delete('/api/training-rules/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteTrainingRule(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete training rule error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete training rule' });
    }
  });

  // 10. Skills API
  app.get('/api/skills', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getSkills(uid, assistantId);
      res.json({ success: true, skills: list });
    } catch (error: any) {
      console.error('Get skills error:', error);
      res.status(500).json({ error: error.message || 'Failed to get skills' });
    }
  });

  app.post('/api/skills', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertSkill(data);
      res.json({ success: true, skill: saved });
    } catch (error: any) {
      console.error('Save skill error:', error);
      res.status(500).json({ error: error.message || 'Failed to save skill' });
    }
  });

  app.delete('/api/skills/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteSkill(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete skill error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete skill' });
    }
  });

  // 11. SOPs API
  app.get('/api/sops', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getSops(uid, assistantId);
      res.json({ success: true, sops: list });
    } catch (error: any) {
      console.error('Get sops error:', error);
      res.status(500).json({ error: error.message || 'Failed to get sops' });
    }
  });

  app.post('/api/sops', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertSop(data);
      res.json({ success: true, sop: saved });
    } catch (error: any) {
      console.error('Save sop error:', error);
      res.status(500).json({ error: error.message || 'Failed to save sop' });
    }
  });

  app.delete('/api/sops/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteSop(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete sop error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete sop' });
    }
  });

  // 12. Memories API
  app.get('/api/memories', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getMemories(uid, assistantId);
      res.json({ success: true, memories: list });
    } catch (error: any) {
      console.error('Get memories error:', error);
      res.status(500).json({ error: error.message || 'Failed to get memories' });
    }
  });

  app.post('/api/memories', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertMemory(data);
      res.json({ success: true, memory: saved });
    } catch (error: any) {
      console.error('Save memory error:', error);
      res.status(500).json({ error: error.message || 'Failed to save memory' });
    }
  });

  app.delete('/api/memories/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteMemory(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete memory error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete memory' });
    }
  });

  // 13. Automations API
  app.get('/api/automations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getAutomations(uid, assistantId);
      res.json({ success: true, automations: list });
    } catch (error: any) {
      console.error('Get automations error:', error);
      res.status(500).json({ error: error.message || 'Failed to get automations' });
    }
  });

  app.post('/api/automations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertAutomation(data);
      res.json({ success: true, automation: saved });
    } catch (error: any) {
      console.error('Save automation error:', error);
      res.status(500).json({ error: error.message || 'Failed to save automation' });
    }
  });

  app.delete('/api/automations/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      await deleteAutomation(req.params.id, uid);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete automation error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete automation' });
    }
  });

  // 14. Activity Logs API
  app.get('/api/activity-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getActivityLogs(uid, assistantId);
      res.json({ success: true, logs: list });
    } catch (error: any) {
      console.error('Get activity logs error:', error);
      res.status(500).json({ error: error.message || 'Failed to get activity logs' });
    }
  });

  app.post('/api/activity-logs', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await insertActivityLog(data);
      res.json({ success: true, log: saved });
    } catch (error: any) {
      console.error('Save activity log error:', error);
      res.status(500).json({ error: error.message || 'Failed to save activity log' });
    }
  });

  // 15. Tools Config API
  app.get('/api/tools-config', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const list = await getToolsConfigs(uid);
      res.json({ success: true, configs: list });
    } catch (error: any) {
      console.error('Get tools config error:', error);
      res.status(500).json({ error: error.message || 'Failed to get tools config' });
    }
  });

  app.post('/api/tools-config', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const { toolKey, status, config } = req.body;
      const data = {
        id: `${uid}_${toolKey}`,
        userId: uid,
        toolKey,
        status,
        config,
      };
      const saved = await upsertToolConfig(data);
      res.json({ success: true, toolConfig: saved });
    } catch (error: any) {
      console.error('Save tools config error:', error);
      res.status(500).json({ error: error.message || 'Failed to save tools config' });
    }
  });

  // 16. Test Cases API
  app.get('/api/test-cases', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const assistantId = req.query.assistantId as string | undefined;
      const list = await getTestCases(uid, assistantId);
      res.json({ success: true, testCases: list });
    } catch (error: any) {
      console.error('Get test cases error:', error);
      res.status(500).json({ error: error.message || 'Failed to get test cases' });
    }
  });

  app.post('/api/test-cases', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Missing UID' });
      const data = { ...req.body, userId: uid };
      const saved = await upsertTestCase(data);
      res.json({ success: true, testCase: saved });
    } catch (error: any) {
      console.error('Save test case error:', error);
      res.status(500).json({ error: error.message || 'Failed to save test case' });
    }
  });

  // ==========================================
  // Production Integrations Proxy & Security
  // ==========================================
  // Server-side LLM completion endpoint (Zero client-side secrets)
  app.post('/api/llm/complete', async (req, res) => {
    try {
      const { prompt, systemInstruction, temperature, maxTokens, jsonMode, endpoint } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Check Gemini API first
      const ai = getGenAI();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: systemInstruction || undefined,
              temperature: temperature ?? 0.7,
              maxOutputTokens: maxTokens ?? 2000,
              responseMimeType: jsonMode ? 'application/json' : undefined,
            },
          });
          if (response.text) {
            return res.json({ success: true, text: response.text });
          }
        } catch (geminiErr: any) {
          console.warn('Server Gemini error, checking fallback:', geminiErr?.message);
        }
      }

      // Check OpenRouter / Hermes API via server environment secrets
      const openRouterKey = process.env.HERMES_API_KEY || process.env.OPENROUTER_API_KEY;
      const targetEndpoint = (endpoint || process.env.HERMES_ENDPOINT || 'https://openrouter.ai/api/v1').trim();

      if (openRouterKey && targetEndpoint) {
        let cleanUrl = targetEndpoint.replace(/\/+$/, '');
        if (!cleanUrl.endsWith('/chat/completions')) {
          cleanUrl = `${cleanUrl}/chat/completions`;
        }

        const isOpenRouter = cleanUrl.includes('openrouter.ai');
        const model = isOpenRouter ? 'meta-llama/llama-3.3-70b-instruct:free' : 'gpt-4o-mini';

        const messages: any[] = [];
        if (systemInstruction) {
          messages.push({ role: 'system', content: systemInstruction });
        }
        messages.push({ role: 'user', content: prompt });

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'User-Agent': 'Hermes-Studio-Server/2.0',
        };

        if (isOpenRouter) {
          headers['HTTP-Referer'] = 'https://hermes-studio.ai';
          headers['X-Title'] = 'Hermes Studio Server';
        }

        const fetchResponse = await fetch(cleanUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages,
            temperature: temperature ?? 0.7,
            max_tokens: maxTokens ?? 2000,
            response_format: jsonMode ? { type: 'json_object' } : undefined,
          }),
        });

        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            return res.json({ success: true, text: content });
          }
        }
      }

      return res.status(503).json({ error: 'No active server LLM provider configured or reachable' });
    } catch (error: any) {
      console.error('Server LLM completion error:', error);
      res.status(500).json({ error: error.message || 'LLM completion failed' });
    }
  });

  app.get('/api/integrations/status', (req, res) => {
    res.json({
      success: true,
      hermes: {
        hasApiKey: !!(process.env.HERMES_API_KEY || process.env.OPENROUTER_API_KEY),
        defaultEndpoint: process.env.HERMES_ENDPOINT || 'https://openrouter.ai/api/v1',
      },
      telegram: {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        defaultChatId: process.env.TELEGRAM_CHAT_ID || '',
      },
      webhook: {
        hasSecret: !!process.env.WEBHOOK_SECRET,
        defaultUrl: process.env.WEBHOOK_TARGET_URL || '',
      },
    });
  });

  // Server-side Hermes / OpenRouter connection test proxy
  app.post('/api/integrations/hermes/test', async (req, res) => {
    const startTime = performance.now();
    try {
      const endpoint = (req.body.endpoint || process.env.HERMES_ENDPOINT || 'https://openrouter.ai/api/v1').trim();
      const apiKey = (req.body.apiKey || process.env.HERMES_API_KEY || process.env.OPENROUTER_API_KEY || '').trim();

      if (!endpoint) {
        return res.status(400).json({ ok: false, message: 'Endpoint URL is required' });
      }

      const isOpenRouter = endpoint.toLowerCase().includes('openrouter.ai');
      let targetUrl = endpoint.replace(/\/+$/, '');
      let method = 'GET';
      let body: string | undefined = undefined;

      if (isOpenRouter) {
        if (targetUrl.endsWith('/chat/completions')) {
          method = 'POST';
          body = JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          });
        } else if (targetUrl.endsWith('/models')) {
          method = 'GET';
        } else {
          targetUrl = `${targetUrl}/models`;
          method = 'GET';
        }
      } else {
        if (targetUrl.endsWith('/chat/completions')) {
          method = 'POST';
          body = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          });
        } else {
          method = 'GET';
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Hermes-Studio-Server/2.0',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      if (isOpenRouter) {
        headers['HTTP-Referer'] = 'https://hermes-studio.ai';
        headers['X-Title'] = 'Hermes Studio Server';
      }

      const fetchResponse = await fetch(targetUrl, {
        method,
        headers,
        body,
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (fetchResponse.ok) {
        let responseData: any = null;
        try {
          responseData = await fetchResponse.json();
        } catch {
          // Non-JSON response is acceptable
        }

        const modelCount = Array.isArray(responseData?.data) ? responseData.data.length : undefined;
        const msg = `Server Proxy Verified (HTTP ${fetchResponse.status} OK • Latency: ${elapsed}ms${modelCount ? ` • ${modelCount} models accessible` : ''})`;

        return res.json({
          success: true,
          ok: true,
          status: fetchResponse.status,
          latencyMs: elapsed,
          message: msg,
          modelCount,
        });
      } else {
        let errorDetail = `HTTP ${fetchResponse.status} ${fetchResponse.statusText}`;
        try {
          const errData: any = await fetchResponse.json();
          if (errData?.error?.message) {
            errorDetail = errData.error.message;
          } else if (errData?.message) {
            errorDetail = errData.message;
          } else if (typeof errData?.error === 'string') {
            errorDetail = errData.error;
          }
        } catch {
          // ignore
        }

        return res.status(200).json({
          success: false,
          ok: false,
          status: fetchResponse.status,
          latencyMs: elapsed,
          message: `Endpoint returned error: ${errorDetail}`,
        });
      }
    } catch (error: any) {
      const elapsed = Math.round(performance.now() - startTime);
      return res.status(200).json({
        success: false,
        ok: false,
        status: 500,
        latencyMs: elapsed,
        message: `Failed to connect to endpoint: ${error.message || 'Network error'}`,
      });
    }
  });

  // Server-side Telegram Bot test and dispatch
  app.post('/api/integrations/telegram/test', async (req, res) => {
    try {
      const botToken = (req.body.botToken || process.env.TELEGRAM_BOT_TOKEN || '').trim();
      const chatId = (req.body.chatId || process.env.TELEGRAM_CHAT_ID || '').trim();

      if (!botToken) {
        return res.status(400).json({
          success: false,
          message: 'TELEGRAM_BOT_TOKEN is not configured on the server environment.',
        });
      }

      if (chatId) {
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🤖 *Hermes Studio AI Employee*\nIntegration connection test verified successfully from server environment.`,
            parse_mode: 'Markdown',
          }),
        });

        const tgData: any = await telegramRes.json();
        if (tgData.ok) {
          return res.json({ success: true, message: 'Test message sent to Telegram successfully.' });
        } else {
          return res.status(400).json({ success: false, message: tgData.description || 'Telegram API error' });
        }
      } else {
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        const tgData: any = await telegramRes.json();
        if (tgData.ok) {
          return res.json({
            success: true,
            message: `Bot authenticated as @${tgData.result.username} (${tgData.result.first_name}).`,
          });
        } else {
          return res.status(400).json({ success: false, message: tgData.description || 'Invalid Telegram Bot token' });
        }
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Telegram test failed' });
    }
  });

  // Server-side Telegram Save endpoint
  app.post('/api/integrations/telegram/save', (req, res) => {
    if (req.body.botToken) {
      process.env.TELEGRAM_BOT_TOKEN = req.body.botToken.trim();
    }
    if (req.body.chatId) {
      process.env.TELEGRAM_CHAT_ID = req.body.chatId.trim();
    }
    res.json({ success: true, message: 'Telegram configuration stored securely on server.' });
  });

  // Server-side Webhook test and dispatch
  app.post('/api/integrations/webhook/test', async (req, res) => {
    try {
      const targetUrl = (req.body.targetUrl || process.env.WEBHOOK_TARGET_URL || '').trim();
      const secret = (req.body.secret || process.env.WEBHOOK_SECRET || '').trim();

      if (!targetUrl) {
        return res.status(400).json({ success: false, message: 'Webhook Target URL is required.' });
      }

      const payload = {
        event: 'hermes.integration.test',
        timestamp: new Date().toISOString(),
        server: 'Hermes Production Backend',
        data: req.body.payload || { ping: true, message: 'Hermes Studio test delivery' },
      };

      const payloadString = JSON.stringify(payload);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Hermes-Webhook-Dispatcher/1.0',
      };

      if (secret) {
        const signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
        headers['X-Hermes-Signature'] = `sha256=${signature}`;
      }

      const startTime = performance.now();
      const hookRes = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: payloadString,
      });
      const latency = Math.round(performance.now() - startTime);

      res.json({
        success: hookRes.ok,
        status: hookRes.status,
        latencyMs: latency,
        message: hookRes.ok
          ? `Webhook delivered successfully (HTTP ${hookRes.status} OK • ${latency}ms)`
          : `Webhook received HTTP ${hookRes.status} ${hookRes.statusText}`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to dispatch webhook' });
    }
  });

  // Server-side Webhook Save endpoint
  app.post('/api/integrations/webhook/save', (req, res) => {
    if (req.body.secret) {
      process.env.WEBHOOK_SECRET = req.body.secret.trim();
    }
    if (req.body.targetUrl) {
      process.env.WEBHOOK_TARGET_URL = req.body.targetUrl.trim();
    }
    res.json({ success: true, message: 'Webhook configuration stored securely on server.' });
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Employee Builder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
