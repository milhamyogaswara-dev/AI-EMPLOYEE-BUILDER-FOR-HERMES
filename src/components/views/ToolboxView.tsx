import React, { useState } from 'react';
import {
  Wrench,
  Globe,
  FileText,
  Send,
  Table,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sliders,
  ExternalLink,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  Cpu,
  Layers,
  Compass,
  Mail,
  Calendar,
  MessageSquare,
  Github,
  Clock,
} from 'lucide-react';
import { Assistant, ToolItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ToolboxViewProps {
  assistant: Assistant;
  tools: ToolItem[];
  onToggleTool: (key: string) => void;
  onUpdateToolConfig: (key: string, config: any) => void;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Tools' },
  { id: 'Core', label: 'Core Tools' },
  { id: 'Communication', label: 'Communication' },
  { id: 'Productivity', label: 'Productivity' },
  { id: 'Automation', label: 'Automation & Routines' },
  { id: 'Development', label: 'Development & Code' },
];

export const ToolboxView: React.FC<ToolboxViewProps> = ({
  assistant,
  tools,
  onToggleTool,
  onUpdateToolConfig,
}) => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [configModalTool, setConfigModalTool] = useState<ToolItem | null>(null);

  const filteredTools = tools.filter(
    (t) => selectedCategory === 'ALL' || t.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Send':
        return <Send className="w-5 h-5" />;
      case 'Table':
        return <Table className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Github':
        return <Github className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>External Instrumentarium &amp; MCP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            Equip {assistant.name} With Tools
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            Empower your assistant with real-world tool capabilities like web browsing, file synthesis, Telegram dispatch, Google Sheets, and custom Model Context Protocol (MCP) servers.
          </p>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 text-right shrink-0 relative z-10">
          <span className="text-[9px] text-[#888] font-mono uppercase tracking-wider block">Active Instruments</span>
          <div className="text-xl font-serif italic text-emerald-400">
            {tools.filter((t) => t.status === 'CONNECTED').length} of {tools.length} Linked
          </div>
        </div>
      </div>

      {/* Role-Specific Recommended Tools Banner */}
      <div className="bg-[#181410] rounded-2xl p-5 border border-[#FF5F1F]/20 flex items-center justify-between gap-3 text-xs text-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF5F1F]/20 text-[#FF5F1F] flex items-center justify-center shrink-0 border border-[#FF5F1F]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif italic text-sm text-[#F0F0F0]">Recommended for {assistant.role}:</span>
            <p className="text-[#AAA] text-xs font-light mt-0.5">
              For optimal performance, enable <strong className="text-[#FF5F1F]">Internet Search</strong>, <strong className="text-[#FF5F1F]">Document Reader</strong>, and <strong className="text-[#FF5F1F]">Telegram Delivery</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition uppercase ${
              selectedCategory.toLowerCase() === cat.id.toLowerCase()
                ? 'bg-[#FF5F1F] text-white shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                : 'bg-[#141414] text-[#888] hover:text-[#CCC] border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isConnected = tool.status === 'CONNECTED';
          return (
            <div
              key={tool.id}
              className={`bg-[#141414] rounded-2xl border transition p-5 flex flex-col justify-between ${
                isConnected
                  ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
              id={`tool-card-${tool.key}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#1C1C1C] text-[#888] border-white/5'
                      }`}
                    >
                      {getToolIcon(tool.icon)}
                    </div>

                    <div>
                      <h4 className="font-serif italic text-base text-[#F0F0F0]">{tool.name}</h4>
                      <span className="text-[9px] text-[#888] uppercase font-mono tracking-wider">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full border ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-[#1A1A1A] text-[#666] border-white/5'
                    }`}
                  >
                    {isConnected ? 'ENABLED' : 'OFF'}
                  </span>
                </div>

                <p className="text-xs text-[#AAA] font-light leading-relaxed mb-4">
                  {tool.description}
                </p>

                {tool.isRecommendedForAssistant && (
                  <div className="p-2.5 rounded-xl bg-[#1C1714] border border-[#FF5F1F]/20 text-[10px] font-mono text-[#FF5F1F] mb-3">
                    ★ {tool.recommendedReason || 'Recommended for this assistant role.'}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setConfigModalTool(tool)}
                  className="text-xs font-mono text-[#888] hover:text-[#CCC] flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>

                <button
                  onClick={() => onToggleTool(tool.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 uppercase tracking-wider ${
                    isConnected
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                      : 'bg-[#FF5F1F] text-white hover:bg-[#e04f14] shadow-sm'
                  }`}
                  id={`btn-toggle-tool-${tool.key}`}
                >
                  {isConnected ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Tool Modal */}
      {configModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F0F0F0] font-serif italic text-lg">
                <Sliders className="w-5 h-5 text-[#FF5F1F]" />
                <span>Configure {configModalTool.name}</span>
              </div>
              <button
                onClick={() => setConfigModalTool(null)}
                className="text-[#666] hover:text-[#AAA] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#AAA] font-light leading-relaxed">{configModalTool.description}</p>

              {configModalTool.key === 'telegram' ? (
                <div>
                  <label className="block text-[10px] font-mono text-[#888] uppercase tracking-widest mb-1.5">
                    Telegram Bot Token
                  </label>
                  <input
                    type="password"
                    defaultValue="7182938491:AAHk...SAMPLE"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
                  />
                  <p className="text-[10px] text-[#666] mt-1 font-mono">
                    Obtained from @BotFather on Telegram.
                  </p>
                </div>
              ) : configModalTool.key === 'mcp' ? (
                <div>
                  <label className="block text-[10px] font-mono text-[#888] uppercase tracking-widest mb-1.5">
                    MCP Server URL / Command
                  </label>
                  <input
                    type="text"
                    defaultValue="npx -y @modelcontextprotocol/server-everything"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
                  />
                </div>
              ) : (
                <div className="p-4 bg-[#0F0F0F] rounded-xl border border-white/5 text-[#AAA] font-light">
                  <span className="font-serif italic text-[#F0F0F0] block mb-1">Built-in Containerized Execution</span>
                  This tool runs natively in the sandboxed runtime with zero extra credentials required.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setConfigModalTool(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#AAA] transition uppercase"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleTool(configModalTool.key);
                  setConfigModalTool(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-md transition uppercase tracking-wider"
              >
                Save &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
