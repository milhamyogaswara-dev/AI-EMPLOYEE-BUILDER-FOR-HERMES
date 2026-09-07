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
  Check,
  Zap,
  ShieldCheck,
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

  // Non-sensitive endpoint state
  const [hermesEndpoint, setHermesEndpoint] = useState<string>(() => {
    return (
      localStorage.getItem('hermes_endpoint') ||
      assistant.hermesConfig.endpoint ||
      'https://openrouter.ai/api/v1'
    );
  });

  // Ephemeral in-memory key override (NEVER persisted to localStorage or source code)
  const [hermesApiKey, setHermesApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingHermes, setIsTestingHermes] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(assistant.hermesConfig.lastLatencyMs || null);

  // Server backend secrets status
  const [serverStatus, setServerStatus] = useState<{
    hermes: { hasApiKey: boolean; defaultEndpoint: string };
    telegram: { hasToken: boolean; defaultChatId: string };
    webhook: { hasSecret: boolean; defaultUrl: string };
  } | null>(null);

  // Telegram state (chat ID is non-sensitive)
  const [telegramBotToken, setTelegramBotToken] = useState<string>('');
  const [showTelegramToken, setShowTelegramToken] = useState<boolean>(false);
  const [telegramChatId, setTelegramChatId] = useState<string>(() => {
    return localStorage.getItem('hermes_telegram_chat_id') || '91827461';
  });
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);
  const [telegramFeedback, setTelegramFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Webhook state (target URL is non-sensitive)
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('hermes_webhook_url') || 'https://api.mybusiness.com/webhooks/hermes';
  });
  const [webhookSecret, setWebhookSecret] = useState<string>('');
  const [showWebhookSecret, setShowWebhookSecret] = useState<boolean>(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [webhookFeedback, setWebhookFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Clean legacy client-side credentials on mount & fetch server integration status
  useEffect(() => {
    // Purge any legacy secrets mistakenly stored in browser localStorage
    localStorage.removeItem('hermes_api_key');
    localStorage.removeItem('hermes_telegram_token');
    localStorage.removeItem('hermes_webhook_secret');

    fetch('/api/integrations/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServerStatus(data);
          if (data.telegram?.defaultChatId && !localStorage.getItem('hermes_telegram_chat_id')) {
            setTelegramChatId(data.telegram.defaultChatId);
          }
          if (data.webhook?.defaultUrl && !localStorage.getItem('hermes_webhook_url')) {
            setWebhookUrl(data.webhook.defaultUrl);
          }
        }
      })
      .catch((err) => {
        console.warn('Unable to query integrations status:', err);
      });
  }, []);

  // Server-side proxied connection test for Hermes / LLM Runtime
  const handleTestConnection = async () => {
    const trimmedEndpoint = hermesEndpoint.trim();
    if (!trimmedEndpoint) {
      setTestStatus('ERROR');
      setStatusMessage('Endpoint URL is required.');
      return;
    }

    setIsTestingHermes(true);
    setTestStatus('IDLE');
    setStatusMessage('');

    try {
      const response = await fetch('/api/integrations/hermes/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: trimmedEndpoint,
          apiKey: hermesApiKey.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setTestStatus('SUCCESS');
        setStatusMessage(data.message || `Connected successfully • ${data.latencyMs}ms`);
        setLatencyMs(data.latencyMs);

        // Store non-sensitive configuration only
        localStorage.setItem('hermes_is_connected', 'true');
        localStorage.setItem('hermes_endpoint', trimmedEndpoint);
        localStorage.setItem('hermes_last_connected', new Date().toISOString());

        onUpdateAssistant({
          ...assistant,
          hermesConfig: {
            ...assistant.hermesConfig,
            endpoint: trimmedEndpoint,
            hasApiKey: true,
            isConnected: true,
            lastConnectedAt: new Date().toISOString(),
            lastLatencyMs: data.latencyMs,
          },
        });
      } else {
        setTestStatus('ERROR');
        setStatusMessage(data.message || 'Server proxy failed to connect to endpoint.');

        localStorage.setItem('hermes_is_connected', 'false');
        onUpdateAssistant({
          ...assistant,
          hermesConfig: {
            ...assistant.hermesConfig,
            endpoint: trimmedEndpoint,
            isConnected: false,
          },
        });
      }
    } catch (err: any) {
      setTestStatus('ERROR');
      setStatusMessage(`Backend request error: ${err.message || 'Connection failed'}`);
    } finally {
      setIsTestingHermes(false);
    }
  };

  // Server-side Telegram Bot test & save
  const handleSaveAndTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramFeedback({ type: 'idle', message: '' });

    try {
      // Save configuration on server
      await fetch('/api/integrations/telegram/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegramChatId.trim(),
          botToken: telegramBotToken.trim() || undefined,
        }),
      });

      // Save non-sensitive chat ID to local preferences
      localStorage.setItem('hermes_telegram_chat_id', telegramChatId.trim());

      // Test server-side Telegram connection
      const testRes = await fetch('/api/integrations/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegramChatId.trim() || undefined,
          botToken: telegramBotToken.trim() || undefined,
        }),
      });

      const testData = await testRes.json();
      if (testRes.ok && testData.success) {
        setTelegramFeedback({
          type: 'success',
          message: testData.message || 'Telegram connection verified successfully via server.',
        });
      } else {
        setTelegramFeedback({
          type: 'error',
          message: testData.message || 'Telegram server verification failed.',
        });
      }
    } catch (err: any) {
      setTelegramFeedback({
        type: 'error',
        message: err.message || 'Failed to dispatch Telegram request to backend.',
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Server-side Webhook test & save
  const handleSaveAndTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookFeedback({ type: 'idle', message: '' });

    try {
      // Save configuration on server
      await fetch('/api/integrations/webhook/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: webhookUrl.trim(),
          secret: webhookSecret.trim() || undefined,
        }),
      });

      // Save non-sensitive target URL to local preferences
      localStorage.setItem('hermes_webhook_url', webhookUrl.trim());

      // Dispatch test payload with server-side HMAC signature
      const testRes = await fetch('/api/integrations/webhook/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: webhookUrl.trim(),
          secret: webhookSecret.trim() || undefined,
        }),
      });

      const testData = await testRes.json();
      if (testRes.ok && testData.success) {
        setWebhookFeedback({
          type: 'success',
          message: testData.message || 'Webhook delivered with server HMAC signature.',
        });
      } else {
        setWebhookFeedback({
          type: 'error',
          message: testData.message || 'Webhook delivery failed.',
        });
      }
    } catch (err: any) {
      setWebhookFeedback({
        type: 'error',
        message: err.message || 'Failed to dispatch Webhook request to backend.',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Production Server Proxy Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#F0F0F0]">
            Integrations & Hermes Core Runtime
          </h2>
          <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-xl font-light">
            Konfigurasi koneksi aman untuk <span className="text-[#F0F0F0] font-medium">{assistant.name}</span> ke OpenRouter, Hermes execution runtime, Telegram bot, dan webhook melalui backend server.
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right shrink-0">
          <span className="text-[10px] text-[#888] uppercase font-mono tracking-wider font-semibold">Security Model</span>
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server-Side Proxied</span>
          </div>
          <div className="text-[10px] text-[#666] font-mono mt-0.5">
            Zero Frontend Secret Leaks
          </div>
        </div>
      </div>

      {/* Hermes Core Connection Card */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 shadow-xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#F0F0F0]">Hermes Core Runtime Connection</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#888] border border-white/10 font-mono">
                  v2.4-agentic
                </span>
              </div>
              <p className="text-xs text-[#888] font-light mt-0.5">
                Konektor API inference LLM dan autonomous execution runner melalui server-side proxy
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              assistant.hermesConfig.isConnected
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-[#888] border-white/10'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                assistant.hermesConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-[#666]'
              }`}
            />
            {assistant.hermesConfig.isConnected ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#888] mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
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
                      ? 'bg-purple-500/10 border-purple-500/40 text-[#F0F0F0]'
                      : 'bg-[#181818] border-white/5 text-[#888] hover:bg-[#1E1E1E] hover:text-[#CCC] hover:border-white/15'
                  }`}
                >
                  <span className="font-semibold text-xs text-[#E0E0E0] flex items-center justify-between">
                    {preset.name}
                    {isSelected && <Check className="w-3 h-3 text-purple-400" />}
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
              <label className="block text-xs font-mono uppercase tracking-wider text-[#AAA]">
                Endpoint URL
              </label>
              {hermesEndpoint.includes('openrouter.ai') && (
                <span className="text-[10px] text-purple-400 font-mono">OpenRouter Compatible</span>
              )}
            </div>
            <input
              type="text"
              value={hermesEndpoint}
              onChange={(e) => {
                setHermesEndpoint(e.target.value);
                setTestStatus('IDLE');
              }}
              placeholder="https://openrouter.ai/api/v1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-purple-500/50 transition placeholder-[#555]"
            />
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              Target endpoint LLM yang akan dihubungi oleh backend server.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#AAA]">
                API Key / Bearer Secret
              </label>
              <div className="flex items-center gap-2">
                {serverStatus?.hermes.hasApiKey && (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> ENV Configured
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-[10px] text-[#888] hover:text-[#F0F0F0] flex items-center gap-1 font-mono transition"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showApiKey ? 'Hide' : 'Show'}</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={hermesApiKey}
                onChange={(e) => {
                  setHermesApiKey(e.target.value);
                  setTestStatus('IDLE');
                }}
                placeholder={
                  serverStatus?.hermes.hasApiKey
                    ? '•••••••••••••••• (Configured via Server HERMES_API_KEY)'
                    : 'sk-or-v1-xxxxxxxxxxxxxxxx'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-purple-500/50 transition placeholder-[#555]"
              />
            </div>
            <p className="text-[10px] text-[#666] mt-1 font-mono">
              {serverStatus?.hermes.hasApiKey
                ? 'Kredensial tersimpan aman di environment server. Kosongkan untuk menggunakan server secret.'
                : 'Kredensial diproses server-side dan tidak pernah disimpan di localStorage browser.'}
            </p>
          </div>
        </div>

        {/* Status Feedback and Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="flex-1 min-w-0">
            {testStatus === 'SUCCESS' && (
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="truncate">{statusMessage}</span>
              </div>
            )}
            {testStatus === 'ERROR' && (
              <div className="text-xs text-rose-400 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="truncate">{statusMessage}</span>
              </div>
            )}
            {testStatus === 'IDLE' && (
              <div className="text-xs text-[#666] font-mono flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400/70 shrink-0" />
                <span>
                  {latencyMs !== null
                    ? `Last latency: ${latencyMs}ms • Endpoint verified via server`
                    : 'Pengujian endpoint diproxy aman melalui server backend.'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTestingHermes}
            className="px-5 py-2.5 rounded-xl bg-[#F0F0F0] hover:bg-white text-black font-mono font-bold text-xs transition shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isTestingHermes ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Testing via Proxy...</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5" />
                <span>Test Connection</span>
              </>
            )}
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
            {serverStatus?.telegram.hasToken ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5" /> ENV Ready
              </span>
            ) : (
              <span className="text-[10px] text-[#888] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                Standby
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA]">
                  Bot Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowTelegramToken(!showTelegramToken)}
                  className="text-[10px] text-[#888] hover:text-[#CCC] font-mono"
                >
                  {showTelegramToken ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showTelegramToken ? 'text' : 'password'}
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder={
                  serverStatus?.telegram.hasToken
                    ? '•••••••••••••••• (Configured via Server TELEGRAM_BOT_TOKEN)'
                    : '7182938491:AAHk_SAMPLE_BOT_TOKEN'
                }
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-blue-500/50"
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
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {telegramFeedback.message && (
            <div
              className={`text-xs font-mono p-2 rounded-lg border ${
                telegramFeedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {telegramFeedback.message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveAndTestTelegram}
            disabled={isTestingTelegram}
            className="w-full py-2.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-white/10 text-[#E0E0E0] text-xs font-mono font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isTestingTelegram ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying via Server...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>Save & Test Telegram Bot</span>
              </>
            )}
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
            {serverStatus?.webhook.hasSecret ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5" /> HMAC Secret Set
              </span>
            ) : (
              <span className="text-[10px] text-[#888] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                Standby
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
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#AAA]">
                  HMAC Signature Secret
                </label>
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="text-[10px] text-[#888] hover:text-[#CCC] font-mono"
                >
                  {showWebhookSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showWebhookSecret ? 'text' : 'password'}
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder={
                  serverStatus?.webhook.hasSecret
                    ? '•••••••••••••••• (Configured via Server WEBHOOK_SECRET)'
                    : 'whsec_89324023940294'
                }
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F0F0F0] font-mono text-xs focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {webhookFeedback.message && (
            <div
              className={`text-xs font-mono p-2 rounded-lg border ${
                webhookFeedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {webhookFeedback.message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveAndTestWebhook}
            disabled={isTestingWebhook}
            className="w-full py-2.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-white/10 text-[#E0E0E0] text-xs font-mono font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isTestingWebhook ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Testing via Server HMAC...</span>
              </>
            ) : (
              <>
                <Webhook className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save & Test Webhook</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
