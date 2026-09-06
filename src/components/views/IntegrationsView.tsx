import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Link2,
  Send,
  Webhook,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';
import { Assistant } from '../../types';

interface IntegrationsViewProps {
  assistant: Assistant;
  onUpdateAssistant: (assistant: Assistant) => void;
}

const PRESET_ENDPOINTS = [
  { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1', hint: 'Multi-model aggregator' },
  { name: 'Hermes Runtime', url: 'http://localhost:8080/v1/agents', hint: 'Local orchestrator' },
  { name: 'OpenAI API', url: 'https://api.openai.com/v1', hint: 'Direct OpenAI endpoint' },
  { name: 'Ollama Local', url: 'http://localhost:11434/v1', hint: 'Local self-hosted' },
];

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  assistant,
  onUpdateAssistant,
}) => {
  const { t } = useLanguage();

  const [hermesEndpoint, setHermesEndpoint] = useState<string>(() => {
    return (
      localStorage.getItem('hermes_endpoint') ||
      assistant.hermesConfig.endpoint ||
      'https://openrouter.ai/api/v1'
    );
  });

  const [hermesApiKey, setHermesApiKey] = useState<string>(() => {
    return localStorage.getItem('hermes_api_key') || '';
  });

  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingHermes, setIsTestingHermes] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(assistant.hermesConfig.lastLatencyMs || null);

  // Telegram state
  const [telegramBotToken, setTelegramBotToken] = useState<string>(() => {
    return localStorage.getItem('hermes_telegram_token') || '7182938491:AAHk_SAMPLE_BOT_TOKEN';
  });
  const [telegramChatId, setTelegramChatId] = useState<string>(() => {
    return localStorage.getItem('hermes_telegram_chat_id') || '91827461';
  });
  const [telegramSaved, setTelegramSaved] = useState<boolean>(false);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('hermes_webhook_url') || 'https://api.mybusiness.com/webhooks/hermes';
  });
  const [webhookSecret, setWebhookSecret] = useState<string>(() => {
    return localStorage.getItem('hermes_webhook_secret') || 'whsec_89324023940294';
  });
  const [webhookSaved, setWebhookSaved] = useState<boolean>(false);

  // Direct client-side connection test
  const handleTestConnection = async () => {
    const trimmedEndpoint = hermesEndpoint.trim();
    const trimmedApiKey = hermesApiKey.trim();

    if (!trimmedEndpoint) {
      setTestStatus('ERROR');
      setStatusMessage('Endpoint URL is required.');
      return;
    }

    setIsTestingHermes(true);
    setTestStatus('IDLE');
    setStatusMessage('');

    try {
      let targetUrl = trimmedEndpoint;
      const isOpenRouter = targetUrl.toLowerCase().includes('openrouter.ai');

      let method = 'GET';
      let body: string | undefined = undefined;

      if (isOpenRouter) {
        // Support OpenRouter endpoint normalization
        const cleanUrl = targetUrl.replace(/\/+$/, '');
        if (cleanUrl.endsWith('/chat/completions')) {
          targetUrl = cleanUrl;
          method = 'POST';
          body = JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          });
        } else if (cleanUrl.endsWith('/models')) {
          targetUrl = cleanUrl;
          method = 'GET';
        } else {
          // If user specified base https://openrouter.ai/api/v1 or https://openrouter.ai
          targetUrl = `${cleanUrl}/models`;
          method = 'GET';
        }
      } else {
        const cleanUrl = targetUrl.replace(/\/+$/, '');
        if (cleanUrl.endsWith('/chat/completions')) {
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
      };

      if (trimmedApiKey) {
        headers['Authorization'] = `Bearer ${trimmedApiKey}`;
      }

      if (isOpenRouter) {
        headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://hermes-studio.ai';
        headers['X-Title'] = 'Hermes AI Studio';
      }

      const startTime = performance.now();
      const response = await fetch(targetUrl, {
        method,
        headers,
        body,
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (response.ok) {
        let responseData: any = null;
        try {
          responseData = await response.json();
        } catch {
          // Text response is fine
        }

        const modelCount = Array.isArray(responseData?.data)
          ? ` • ${responseData.data.length} models accessible`
          : '';
        const successMsg = `Connection Verified (HTTP ${response.status} OK • Latency: ${elapsed}ms${modelCount})`;

        setTestStatus('SUCCESS');
        setStatusMessage(successMsg);
        setLatencyMs(elapsed);

        // Store connected state and credentials in localStorage
        localStorage.setItem('hermes_is_connected', 'true');
        localStorage.setItem('hermes_endpoint', trimmedEndpoint);
        if (trimmedApiKey) {
          localStorage.setItem('hermes_api_key', trimmedApiKey);
        }
        localStorage.setItem('hermes_last_connected', new Date().toISOString());

        // Update assistant config
        onUpdateAssistant({
          ...assistant,
          hermesConfig: {
            ...assistant.hermesConfig,
            endpoint: trimmedEndpoint,
            hasApiKey: Boolean(trimmedApiKey),
            isConnected: true,
            lastConnectedAt: new Date().toISOString(),
            lastLatencyMs: elapsed,
          },
        });
      } else {
        // Parse specific error from API response
        let errorDetail = `HTTP ${response.status} (${response.statusText || 'Error'})`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errorDetail = errData.error.message;
          } else if (errData?.message) {
            errorDetail = errData.message;
          } else if (typeof errData?.error === 'string') {
            errorDetail = errData.error;
          } else if (errData?.detail) {
            errorDetail = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
          }
        } catch {
          try {
            const text = await response.text();
            if (text) {
              errorDetail = text.length > 250 ? text.slice(0, 250) + '...' : text;
            }
          } catch {}
        }

        if (response.status === 401) {
          errorDetail = `Authentication Failed (401): ${errorDetail}. Please check your API key.`;
        } else if (response.status === 403) {
          errorDetail = `Access Forbidden (403): ${errorDetail}`;
        } else if (response.status === 404) {
          errorDetail = `Route Not Found (404): ${errorDetail}. Please check your endpoint URL.`;
        } else if (response.status === 429) {
          errorDetail = `Rate Limited (429): ${errorDetail}`;
        }

        setTestStatus('ERROR');
        setStatusMessage(errorDetail);

        // Store disconnected in localStorage
        localStorage.setItem('hermes_is_connected', 'false');
        onUpdateAssistant({
          ...assistant,
          hermesConfig: {
            ...assistant.hermesConfig,
            endpoint: trimmedEndpoint,
            hasApiKey: Boolean(trimmedApiKey),
            isConnected: false,
          },
        });
      }
    } catch (err: any) {
      let msg = err?.message || 'Network request failed';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        msg = `Unable to connect to "${trimmedEndpoint}". Network/CORS error or unreachable server. Ensure the endpoint is reachable from the browser and supports CORS.`;
      }
      setTestStatus('ERROR');
      setStatusMessage(msg);

      localStorage.setItem('hermes_is_connected', 'false');
      onUpdateAssistant({
        ...assistant,
        hermesConfig: {
          ...assistant.hermesConfig,
          endpoint: trimmedEndpoint,
          hasApiKey: Boolean(trimmedApiKey),
          isConnected: false,
        },
      });
    } finally {
      setIsTestingHermes(false);
    }
  };

  const handleSaveTelegram = () => {
    localStorage.setItem('hermes_telegram_token', telegramBotToken);
    localStorage.setItem('hermes_telegram_chat_id', telegramChatId);
    setTelegramSaved(true);
    setTimeout(() => setTelegramSaved(false), 3000);
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('hermes_webhook_url', webhookUrl);
    localStorage.setItem('hermes_webhook_secret', webhookSecret);
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Temporarily Locked Alert Banner */}
      <div className="bg-[#1C160C] border border-amber-500/40 rounded-2xl p-5 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start sm:items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-amber-300">Fitur Integrasi Sedang Dikunci Sementara</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                LOCKED / PROTECTED
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1 font-light max-w-2xl">
              Integrasi multi-channel (Hermes Core Runtime, Telegram Bot, dan Outbound Webhook) saat ini dinonaktifkan sementara untuk pemeliharaan sistem & pengamanan data. Seluruh formulir dan aksi pengujian berada dalam mode proteksi baca saja.
            </p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold flex items-center gap-2 shrink-0 relative z-10">
          <Lock className="w-3.5 h-3.5" />
          <span>Status: Terkunci</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-medium mb-2 border border-amber-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Integrations Hub (Locked Mode)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#F0F0F0]">
            Integrations & Hermes Core Runtime
          </h2>
          <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-xl font-light">
            Konfigurasi koneksi langsung untuk <span className="text-[#F0F0F0] font-medium">{assistant.name}</span> ke OpenRouter, Hermes execution runtime, Telegram bot, dan webhook.
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right shrink-0">
          <span className="text-[10px] text-[#888] uppercase font-mono tracking-wider font-semibold">Status Fitur</span>
          <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-end gap-1.5 mt-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>TERKUNCI SEMENTARA</span>
          </div>
          <div className="text-[10px] text-[#666] font-mono mt-0.5">
            Maintenance Mode
          </div>
        </div>
      </div>

      {/* Hermes Core Connection Card */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-7 space-y-6 opacity-90">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F0F0F0]">Hermes Core Runtime Connection</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              </div>
              <p className="text-xs text-[#888] font-light mt-0.5">
                Konektor API inference LLM dan autonomous execution runner (dikunci sementara)
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full border bg-amber-950/40 text-amber-400 border-amber-500/30 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>○ LOCKED</span>
          </span>
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#888] mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Quick Endpoint Presets (Nonaktif)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_ENDPOINTS.map((preset) => {
              const isSelected = hermesEndpoint.trim() === preset.url;
              return (
                <button
                  key={preset.name}
                  type="button"
                  disabled={true}
                  className={`p-2.5 rounded-xl text-left text-xs transition border flex flex-col justify-between opacity-50 cursor-not-allowed ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/30 text-[#F0F0F0]'
                      : 'bg-[#181818] border-white/5 text-[#888]'
                  }`}
                >
                  <span className="font-semibold text-xs text-[#AAA] flex items-center justify-between">
                    {preset.name}
                    <Lock className="w-2.5 h-2.5 text-amber-400/70" />
                  </span>
                  <span className="text-[10px] text-[#666] truncate mt-0.5 font-mono">{preset.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Endpoint & Key Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#AAA] flex items-center gap-1.5">
                <span>Endpoint URL</span>
                <Lock className="w-3 h-3 text-amber-400/80" />
              </label>
              {hermesEndpoint.includes('openrouter.ai') && (
                <span className="text-[10px] text-amber-400/80 font-mono">OpenRouter Compatible</span>
              )}
            </div>
            <input
              type="text"
              value={hermesEndpoint}
              disabled={true}
              readOnly={true}
              placeholder="https://openrouter.ai/api/v1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-[#888] font-mono text-xs cursor-not-allowed opacity-70"
            />
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              Input endpoint dikunci sementara untuk mencegah perubahan konfigurasi tak terduga.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#AAA] flex items-center gap-1.5">
                <span>API Key / Bearer Secret</span>
                <Lock className="w-3 h-3 text-amber-400/80" />
              </label>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[10px] text-[#888] hover:text-[#F0F0F0] flex items-center gap-1 font-mono transition"
              >
                {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showApiKey ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={hermesApiKey}
                disabled={true}
                readOnly={true}
                placeholder="sk-or-v1-xxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-[#888] font-mono text-xs cursor-not-allowed opacity-70"
              />
            </div>
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              Kunci API disimpan secara aman dan diproteksi.
            </p>
          </div>
        </div>

        {/* Status Feedback and Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-amber-300/80 font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pengujian koneksi dan pengiriman permintaan sementara ini dikunci.</span>
            </div>
          </div>

          <button
            type="button"
            disabled={true}
            className="px-5 py-2.5 rounded-xl bg-[#1D1D1D] border border-white/10 text-[#777] font-mono font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 shrink-0 opacity-60"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Fitur Terkunci (Locked)</span>
          </button>
        </div>
      </div>

      {/* Communication Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Telegram Channel */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-4 opacity-90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#F0F0F0]">Telegram Bot Integration</h4>
                <p className="text-[11px] text-[#888]">Deliver briefings & bidirectional command dispatch</p>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1 flex items-center gap-1.5">
                <span>Bot Token</span>
                <Lock className="w-2.5 h-2.5 text-amber-400/80" />
              </label>
              <input
                type="password"
                value={telegramBotToken}
                disabled={true}
                readOnly={true}
                placeholder="7182938491:AAHk..."
                className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/10 text-[#777] font-mono text-xs cursor-not-allowed opacity-70"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1 flex items-center gap-1.5">
                <span>Owner Chat ID</span>
                <Lock className="w-2.5 h-2.5 text-amber-400/80" />
              </label>
              <input
                type="text"
                value={telegramChatId}
                disabled={true}
                readOnly={true}
                placeholder="91827461"
                className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/10 text-[#777] font-mono text-xs cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={true}
            className="w-full py-2.5 rounded-lg bg-[#181818] border border-white/5 text-[#666] text-xs font-mono font-semibold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengaturan Telegram Terkunci</span>
          </button>
        </div>

        {/* Webhooks Channel */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-4 opacity-90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Webhook className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#F0F0F0]">Outbound Webhooks</h4>
                <p className="text-[11px] text-[#888]">Push execution payloads to external APIs</p>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1 flex items-center gap-1.5">
                <span>Webhook Target URL</span>
                <Lock className="w-2.5 h-2.5 text-amber-400/80" />
              </label>
              <input
                type="text"
                value={webhookUrl}
                disabled={true}
                readOnly={true}
                placeholder="https://api.mybusiness.com/webhooks/hermes"
                className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/10 text-[#777] font-mono text-xs cursor-not-allowed opacity-70"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1 flex items-center gap-1.5">
                <span>HMAC Signature Secret</span>
                <Lock className="w-2.5 h-2.5 text-amber-400/80" />
              </label>
              <input
                type="password"
                value={webhookSecret}
                disabled={true}
                readOnly={true}
                placeholder="whsec_..."
                className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/10 text-[#777] font-mono text-xs cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={true}
            className="w-full py-2.5 rounded-lg bg-[#181818] border border-white/5 text-[#666] text-xs font-mono font-semibold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pengaturan Webhook Terkunci</span>
          </button>
        </div>
      </div>
    </div>
  );
};

