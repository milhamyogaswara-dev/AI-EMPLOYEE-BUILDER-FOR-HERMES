import React from 'react';
import { Assistant, UserProfile } from '../types';
import { NavView } from './Sidebar';
import { 
  Menu,
  Plus,
  ArrowUpRight,
  Sun,
  Moon,
  SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  currentView: NavView;
  activeAssistant: Assistant | null;
  userProfile: UserProfile;
  advancedMode: boolean;
  onToggleAdvancedMode: () => void;
  onUpdateUserProfile?: (profile: UserProfile) => void;
  onOpenMobileMenu: () => void;
  onOpenWizard: () => void;
  onNavigate: (view: NavView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeAssistant,
  userProfile,
  advancedMode,
  onToggleAdvancedMode,
  onUpdateUserProfile,
  onOpenMobileMenu,
  onOpenWizard,
  onNavigate,
}) => {
  const { t } = useLanguage();

  const getViewTitles = (): Record<string, { title: string; subtitle: string }> => ({
    dashboard: {
      title: 'Home Office & Command Center',
      subtitle: 'Operational overview of your AI assistant fleet.',
    },
    workspace: {
      title: 'Agent Workspace',
      subtitle: 'Real-time metrics, activity logs, and central rule calibration.',
    },
    create: {
      title: 'Assistant Architecture Builder',
      subtitle: 'Define purpose, role structure, and baseline memory.',
    },
    training: {
      title: 'Prime Directives & Custom Rules',
      subtitle: 'Inflexible rules, tonal guidelines, and guardrails.',
    },
    skills: {
      title: 'Core Skills & APIs',
      subtitle: 'Give your assistant advanced reasoning or processing abilities.',
    },
    sop: {
      title: 'Operational SOP Builder',
      subtitle: 'Define step-by-step macro processes for complex multi-step tasks.',
    },
    memory: {
      title: 'Memory Store & Health',
      subtitle: 'Persistent business facts, user preferences, and conflict detection.',
    },
    toolbox: {
      title: 'Give Your Assistant Tools',
      subtitle: 'Connect internet, files, Telegram, Google Sheets, MCP, and automations.',
    },
    authority: {
      title: 'Authority & Approval Matrix',
      subtitle: 'Define what your assistant executes automatically vs what requires approval.',
    },
    automation: {
      title: 'Automation & Scheduled Workflows',
      subtitle: 'Convert natural language tasks into recurring scheduled routines.',
    },
    testlab: {
      title: 'Test Lab & Performance Scorer',
      subtitle: 'Simulate real prompts, evaluate metrics, and loop corrections into rules.',
    },
    integrations: {
      title: 'Integrations Hub',
      subtitle: 'Connect with Hermes Core runtime, Telegram, Slack, and cloud tools.',
    },
    deploy: {
      title: 'Hermes Deployment Package',
      subtitle: 'Validate deployment readiness and export production runtime bundles.',
    },
    templates: {
      title: 'Assistant Starter Templates',
      subtitle: 'Instantly clone pre-configured marketing, executive, and research roles.',
    },
    settings: {
      title: 'Settings & Workspace Preferences',
      subtitle: 'Configure user profile, language options, backup, and advanced settings.',
    },
  });

  const currentInfo = getViewTitles()[currentView] || {
    title: 'Hermes Assistant Builder',
    subtitle: 'Train. Equip. Test. Deploy Your AI Assistant.',
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-[#888] hover:text-[#F0F0F0] hover:bg-[#181818] md:hidden border border-white/5"
          aria-label="Open mobile menu"
          id="btn-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-serif italic text-[#F0F0F0] tracking-tight truncate">
              {currentInfo.title}
            </h1>
            <span className="hidden md:inline-block w-1.5 h-1.5 bg-[#FF5F1F] rounded-full shadow-[0_0_8px_#FF5F1F]" />
          </div>
          <p className="text-xs text-[#888] font-light hidden sm:block truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions & Active Assistant Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        <button
          onClick={onToggleAdvancedMode}
          id="toggle-advanced-mode"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition border ${
            advancedMode
              ? 'bg-[#1A1A1A] text-[#FF5F1F] border-[#FF5F1F]/40 shadow-[0_0_12px_rgba(255,95,31,0.2)]'
              : 'bg-[#121212] text-[#888] border-white/10 hover:text-[#F0F0F0] hover:border-white/20'
          }`}
          title={advancedMode ? 'Switch to Simple Mode' : 'Switch to Advanced Mode'}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5F1F]" />
          <span className="hidden sm:inline">
            {advancedMode ? 'ADVANCED' : 'SIMPLE'}
          </span>
        </button>

        {activeAssistant && (
          <div
            onClick={() => onNavigate('workspace')}
            className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#FF5F1F]/40 cursor-pointer transition group"
            id="header-active-assistant"
          >
            <img
              src={activeAssistant.avatar}
              alt={activeAssistant.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-[#FF5F1F]/50"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#F0F0F0] group-hover:text-[#FF5F1F] transition">
                {activeAssistant.name}
              </span>
              <span className="text-[#FF5F1F] font-mono ml-2 text-[10px] tracking-wider">
                {activeAssistant.trainingProgress}%
              </span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-[#666] group-hover:text-[#FF5F1F] transition ml-0.5" />
          </div>
        )}

        <button
          onClick={onOpenWizard}
          id="btn-header-create-assistant"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-medium text-xs shadow-[0_0_15px_rgba(255,95,31,0.25)] transition active:scale-98 tracking-wide"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline font-sans">{'New Assistant'}</span>
          <span className="xs:hidden">New</span>
        </button>

        <button
          onClick={() => {
            if (onUpdateUserProfile) {
              onUpdateUserProfile({
                ...userProfile,
                appTheme: userProfile.appTheme === 'light' ? 'dark' : 'light'
              });
            }
          }}
          className="p-1.5 rounded-lg text-[#888] hover:text-[#F0F0F0] hover:bg-[#181818] border border-white/5 transition ml-1"
          title="Toggle Light/Dark Theme"
        >
          {userProfile.appTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-2 border-l border-white/10 cursor-pointer group"
          id="header-user-profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#181818] border border-white/15 text-[#F0F0F0] flex items-center justify-center font-serif italic text-xs group-hover:border-[#FF5F1F] transition">
            {userProfile.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-[#F0F0F0] leading-tight group-hover:text-[#FF5F1F] transition">
              {userProfile.addressStyle || userProfile.name}
            </div>
            <div className="text-[10px] text-[#666] font-mono tracking-wider truncate max-w-[110px]">
              {userProfile.company}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
