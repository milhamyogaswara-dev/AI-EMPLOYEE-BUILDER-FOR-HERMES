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
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5F1F]/10 text-[#FF5F1F] text-xs font-mono font-medium mb-2 border border-[#FF5F1F]/20">
            <Link2 className="w-3.5 h-3.5" />
            <span>Multi-Channel Integration Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#F0F0F0]">
            Integrations & Hermes Core Runtime
          </h2>
          <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-xl font-light">
            Connect <span className="text-[#F0F0F0] font-medium">{assistant.name}</span> directly to OpenRouter, Hermes execution runtime, Telegram bot channels, or custom webhooks.
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right shrink-0">
          <span className="text-[10px] text-[#888] uppercase font-mono tracking-wider font-semibold">Hermes Runtime</span>
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span>{assistant.hermesConfig.isConnected ? 'VERIFIED ACTIVE' : 'STANDBY MODE'}</span>
          </div>
          {latencyMs !== null && assistant.hermesConfig.isConnected && (
            <div className="text-[10px] text-[#666] font-mono mt-0.5">
              Latency: {latencyMs}ms
            </div>
          )}
        </div>
      </div>

      {/* Hermes Core Connection Card */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/20 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F0F0F0]">Hermes Core Runtime Connection</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#888] border border-white/10 font-mono">
                  Direct Client Fetch
                </span>
              </div>
              <p className="text-xs text-[#888] font-light mt-0.5">
                Real-time API connector for OpenRouter, LLM inference endpoints, and autonomous execution runners
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border transition ${
              assistant.hermesConfig.isConnected
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
            }`}
          >
            {assistant.hermesConfig.isConnected ? '● CONNECTED' : '○ DISCONNECTED'}
          </span>
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#888] mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#FF5F1F]" />
            <span>Quick Endpoint Presets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_ENDPOINTS.map((preset) => {
              const isSelected = hermesEndpoint.trim() === preset.url;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setHermesEndpoint(preset.url);
                    setTestStatus('IDLE');
                    setStatusMessage('');
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs transition border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FF5F1F]/10 border-[#FF5F1F]/50 text-[#F0F0F0] shadow-sm'
                      : 'bg-[#181818] border-white/5 text-[#888] hover:text-[#F0F0F0] hover:border-white/20'
                  }`}
                >
                  <span className="font-semibold text-xs text-[#F0F0F0]">{preset.name}</span>
                  <span className="text-[10px] text-[#777] truncate mt-0.5 font-mono">{preset.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Endpoint & Key Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CCC]">
                Endpoint URL <span className="text-[#FF5F1F]">*</span>
              </label>
              {hermesEndpoint.includes('openrouter.ai') && (
                <span className="text-[10px] text-[#FF5F1F] font-mono">OpenRouter Compatible</span>
              )}
            </div>
            <input
              type="text"
              value={hermesEndpoint}
              placeholder="https://openrouter.ai/api/v1"
              onChange={(e) => {
                setHermesEndpoint(e.target.value);
                setTestStatus('IDLE');
                setStatusMessage('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/15 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition"
            />
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              Directly queried via client fetch (e.g. GET /models or POST /chat/completions)
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CCC]">
                API Key / Bearer Secret
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
                placeholder="sk-or-v1-xxxxxxxxxxxxxxxx"
                onChange={(e) => {
                  setHermesApiKey(e.target.value);
                  setTestStatus('IDLE');
                  setStatusMessage('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/15 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition"
              />
            </div>
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              Sent as <code className="text-[#888]">Authorization: Bearer &lt;key&gt;</code> in request headers
            </p>
          </div>
        </div>

        {/* Status Feedback and Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="flex-1 min-w-0">
            {testStatus === 'SUCCESS' && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-300">
                  <div className="font-semibold text-emerald-200">Connection Verified</div>
                  <div className="font-mono text-[11px] text-emerald-400/90 mt-0.5 break-words">
                    {statusMessage}
                  </div>
                </div>
              </div>
            )}

            {testStatus === 'ERROR' && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-300 min-w-0">
                  <div className="font-semibold text-red-200">Connection Failed</div>
                  <div className="font-mono text-[11px] text-red-400/90 mt-0.5 break-words">
                    {statusMessage}
                  </div>
                </div>
              </div>
            )}

            {testStatus === 'IDLE' && (
              <div className="text-xs text-[#777] font-light flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#555]" />
                <span>Ready to verify connectivity directly to the endpoint.</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTestingHermes}
            className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#E54F13] disabled:opacity-50 text-white font-mono font-bold text-xs shadow-lg shadow-[#FF5F1F]/20 transition flex items-center justify-center gap-2 shrink-0"
          >
            {isTestingHermes ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isTestingHermes ? 'Testing Connection...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Communication Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Telegram Channel */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-4">
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
            {telegramSaved && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1">
                Bot Token
              </label>
              <input
                type="password"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="7182938491:AAHk..."
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1">
                Owner Chat ID
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="91827461"
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveTelegram}
            className="w-full py-2.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/10 text-[#F0F0F0] text-xs font-mono font-semibold transition"
          >
            Save Telegram Settings
          </button>
        </div>

        {/* Webhooks Channel */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-5 sm:p-6 space-y-4">
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
            {webhookSaved && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1">
                Webhook Target URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.mybusiness.com/webhooks/hermes"
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA] mb-1">
                HMAC Signature Secret
              </label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="whsec_..."
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] placeholder-[#555] font-mono text-xs focus:outline-none focus:border-[#FF5F1F]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveWebhook}
            className="w-full py-2.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/10 text-[#F0F0F0] text-xs font-mono font-semibold transition"
          >
            Save Webhook Config
          </button>
        </div>
      </div>
    </div>
  );
};

