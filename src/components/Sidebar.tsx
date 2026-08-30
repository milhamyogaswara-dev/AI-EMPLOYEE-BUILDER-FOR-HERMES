import { useLanguage } from '../contexts/LanguageContext';
import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Sparkles,
  FileCheck2,
  Brain,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  Zap,
  FlaskConical,
  Puzzle,
  Rocket,
  LayoutTemplate,
  Settings,
  ChevronRight,
  Plus,
  Bot,
  X,
} from 'lucide-react';
import { Assistant, UserProfile } from '../types';

export type NavView =
  | 'dashboard'
  | 'assistants'
  | 'workspace'
  | 'wizard'
  | 'training'
  | 'skills'
  | 'sop'
  | 'memory'
  | 'toolbox'
  | 'authority'
  | 'automation'
  | 'testlab'
  | 'integrations'
  | 'deploy'
  | 'templates'
  | 'settings'
  | 'admin';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  assistants: Assistant[];
  activeAssistant: Assistant | null;
  userProfile?: UserProfile;
  onSelectAssistant: (id: string) => void;
  onOpenWizard: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({

  currentView,
  onNavigate,
  assistants,
  activeAssistant,
  userProfile,
  onSelectAssistant,
  onOpenWizard,
  mobileOpen,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const isId = userProfile?.appLanguage === 'ID';

  const isAdminUser = userProfile?.role === 'admin' || userProfile?.email?.toLowerCase() === 'milhamyogaswara@gmail.com';

  const navItems = [
    { id: 'dashboard' as NavView, label: t('nav.dashboard'), icon: LayoutDashboard, badge: undefined },
    { id: 'assistants' as NavView, label: 'My Assistants', icon: Users, badge: assistants.length.toString() },
    { id: 'training' as NavView, label: 'Training Center', icon: GraduationCap, badge: undefined },
    { id: 'skills' as NavView, label: 'Skills', icon: Sparkles, badge: undefined },
    { id: 'sop' as NavView, label: 'SOP Builder', icon: FileCheck2, badge: undefined },
    { id: 'memory' as NavView, label: 'Memory Store', icon: Brain, badge: undefined },
    { id: 'toolbox' as NavView, label: t('nav.toolbox'), icon: Wrench, badge: undefined },
    { id: 'authority' as NavView, label: 'Authority Rules', icon: ShieldAlert, badge: undefined },
    { id: 'automation' as NavView, label: 'Automation', icon: Zap, badge: undefined },
    { id: 'testlab' as NavView, label: 'Test Lab', icon: FlaskConical, badge: 'MAJOR' },
    { id: 'integrations' as NavView, label: 'Integrations', icon: Puzzle, badge: undefined },
    { id: 'deploy' as NavView, label: 'Deploy Hermes', icon: Rocket, badge: undefined },
    { id: 'templates' as NavView, label: 'Templates', icon: LayoutTemplate, badge: undefined },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings, badge: undefined },
  ];

  if (isAdminUser) {
    navItems.push({ id: 'admin' as NavView, label: 'User & Subscription', icon: ShieldCheck, badge: 'ADMIN' });
  }

  const handleNavClick = (view: NavView) => {
    if (typeof onNavigate === 'function') onNavigate(view);
    if (typeof onCloseMobile === 'function') onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0D0D0D] text-[#E0E0E0] border-r border-white/10 relative">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick('dashboard')}
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-[#161616] border border-white/15 flex items-center justify-center text-[#FF5F1F] group-hover:border-[#FF5F1F]/60 group-hover:shadow-[0_0_15px_rgba(255,95,31,0.3)] transition">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif italic font-bold text-[#F0F0F0] tracking-tight text-sm leading-tight group-hover:text-[#FF5F1F] transition">
              HERMES STUDIO
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#666] uppercase">
              ARTISTIC FLAIR v2
            </div>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-[#1A1A1A] md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Assistant Quick Switcher */}
      <div className="p-3 border-b border-white/10 bg-[#0A0A0A]/60">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666] mb-2 px-1 flex items-center justify-between">
          <span>AI EMPLOYEE</span>
          <button
            onClick={() => typeof onOpenWizard === 'function' && onOpenWizard()}
            className="text-[#FF5F1F] hover:text-[#ff7d47] flex items-center gap-0.5 text-[10px] font-mono tracking-wider"
            title="Create Assistant"
            id="btn-quick-create-asst"
          >
            <Plus className="w-3 h-3" />
            <span>NEW</span>
          </button>
        </div>

        {activeAssistant ? (
          <div className="relative group">
            <button
              onClick={() => handleNavClick('workspace')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#FF5F1F]/40 transition text-left"
              id="active-assistant-card-sidebar"
            >
              <img
                src={activeAssistant.avatar}
                alt={activeAssistant.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#FF5F1F]/40"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-serif italic text-xs text-[#F0F0F0] truncate">
                    {activeAssistant.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FF5F1F]/15 text-[#FF5F1F] border border-[#FF5F1F]/30">
                    {activeAssistant.trainingProgress}%
                  </span>
                </div>
                <div className="text-[10px] text-[#888] truncate font-light">
                  {activeAssistant.role}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#FF5F1F] transition shrink-0" />
            </button>

            {/* Quick dropdown if multiple assistants */}
            {assistants.length > 1 && (
              <div className="mt-1.5 flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {assistants.map((asst) => (
                  <button
                    key={asst.id}
                    onClick={() => typeof onSelectAssistant === 'function' && onSelectAssistant(asst.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition shrink-0 border ${
                      asst.id === activeAssistant.id
                        ? 'bg-[#FF5F1F] text-white border-[#FF5F1F] shadow-[0_0_10px_rgba(255,95,31,0.3)]'
                        : 'bg-[#141414] text-[#888] border-white/5 hover:text-[#F0F0F0] hover:border-white/20'
                    }`}
                  >
                    {asst.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => typeof onOpenWizard === 'function' && onOpenWizard()}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-[#FF5F1F] text-xs text-[#888] hover:text-[#FF5F1F] transition flex items-center justify-center gap-1.5 font-mono text-[11px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ {t('dash.createAssistant').toUpperCase()}</span>
          </button>
        )}
      </div>

      {/* Primary Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 scrollbar-thin">
        <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#555] px-3 py-1 mb-1">
          NAVIGATION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              id={`nav-item-${item.id}`}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition text-left relative ${
                isActive
                  ? 'bg-[#181818] text-[#F0F0F0] font-medium border-l-2 border-[#FF5F1F] shadow-sm'
                  : 'text-[#999] hover:text-[#F0F0F0] hover:bg-[#141414]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF5F1F]' : 'text-[#666]'}`} />
              <span className="flex-1 truncate tracking-wide">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded tracking-widest ${
                    item.badge === 'MAJOR'
                      ? 'bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30'
                      : 'bg-[#181818] text-[#888] border border-white/5'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Hermes Status */}
      <div className="p-3.5 border-t border-white/10 bg-[#0A0A0A] text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-[#888] flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                activeAssistant?.hermesConfig.isConnected
                  ? 'bg-[#FF5F1F] shadow-[0_0_8px_#FF5F1F] animate-pulse'
                  : 'bg-[#555]'
              }`}
            />
            <span className="font-mono text-[10px] tracking-wider uppercase">HERMES RUNTIME</span>
          </span>
          <span className="text-[10px] font-mono text-[#FF5F1F]">
            {activeAssistant?.hermesConfig.isConnected ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>
        <div className="text-[10px] font-light text-[#555] italic">
          Curating digital autonomous intelligence.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onCloseMobile} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0A0A0A] shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
