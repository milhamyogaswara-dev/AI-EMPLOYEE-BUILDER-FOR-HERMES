import React, { useState, useEffect, useRef } from 'react';
import {
  Assistant,
  AutomationItem,
  Memory,
  Skill,
  SOP,
  ToolItem,
  TrainingRule,
  UserProfile,
  ActivityLog,
  UserGuideProgress,
} from './types';
import {
  loadAssistants,
  loadUserProfile,
  loadTrainingRules,
  loadSkills,
  loadSOPs,
  loadMemories,
  loadAutomations,
  loadTools,
  loadActivityLogs,
  resetToInitialData,
  calculateTrainingProgress,
} from './utils/storage';
import {
  fsLoadAssistants,
  fsSaveAssistants,
  fsLoadTrainingRules,
  fsSaveTrainingRules,
  fsLoadSkills,
  fsSaveSkills,
  fsLoadSOPs,
  fsSaveSOPs,
  fsLoadMemories,
  fsSaveMemories,
  fsLoadAutomations,
  fsSaveAutomations,
  fsLoadTools,
  fsSaveTools,
  fsLoadActivityLogs,
  fsSaveActivityLogs,
  fsSaveUserProfilePreferences,
  sanitizeForFirestore,
  checkQuotaStatus,
  markQuotaExhausted,
  isQuotaError,
} from './utils/firestoreStorage';
import { upsertLocalUser } from './utils/storage';
import { useAuth } from './contexts/AuthContext';
import { LoginView } from './components/views/LoginView';
import { Sidebar, NavView } from './components/Sidebar';
import { Header } from './components/Header';
import { AICoachBar } from './components/AICoachBar';
import { DashboardView } from './components/views/DashboardView';
import { MyAssistantsView } from './components/views/MyAssistantsView';
import { CreateAssistantWizard } from './components/views/CreateAssistantWizard';
import { TrainingCenterView } from './components/views/TrainingCenterView';
import { SkillsView } from './components/views/SkillsView';
import { SOPView } from './components/views/SOPView';
import { MemoryView } from './components/views/MemoryView';
import { ToolboxView } from './components/views/ToolboxView';
import { AuthorityView } from './components/views/AuthorityView';
import { AutomationView } from './components/views/AutomationView';
import { TestLabView } from './components/views/TestLabView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { DeployView } from './components/views/DeployView';
import { TemplatesView } from './components/views/TemplatesView';
import { SettingsView } from './components/views/SettingsView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { AssistantWorkspaceView } from './components/views/AssistantWorkspaceView';
import { UserGuideView } from './components/views/UserGuideView';
import { GuideDrawer } from './components/guide/GuideDrawer';
import { OnboardingModal } from './components/guide/OnboardingModal';
import { NextStepCard } from './components/guide/NextStepCard';
import {
  loadGuideProgress,
  saveGuideProgress,
  resetGuideProgress,
  DEFAULT_GUIDE_PROGRESS,
} from './services/guideService';
import { GUIDE_TOPICS, GuideTopic } from './data/userGuide';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { currentUser, userProfile: authProfile, loading: authLoading, refreshProfile } = useAuth();
  const [checkingApproval, setCheckingApproval] = useState(false);
  
  // State Initialization
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [activeAssistantId, setActiveAssistantId] = useState<string>('asst_arka');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  const [trainingRules, setTrainingRules] = useState<TrainingRule[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const isId = userProfile.appLanguage === 'ID';
  const [automations, setAutomations] = useState<AutomationItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Navigation & UI state
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User Guide state
  const [guideProgress, setGuideProgress] = useState<UserGuideProgress>(DEFAULT_GUIDE_PROGRESS);
  const [contextualTopic, setContextualTopic] = useState<GuideTopic | null>(null);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState<boolean>(false);

  // Guide handlers
  const handleOpenContextualGuide = (topicId: string) => {
    const topic = GUIDE_TOPICS.find((t) => t.id === topicId);
    if (topic) {
      setContextualTopic(topic);
    }
  };

  const handleUpdateGuideProgress = async (updates: Partial<UserGuideProgress>) => {
    const updated = await saveGuideProgress(currentUser?.uid, updates);
    setGuideProgress(updated);
  };

  const handleResetGuideProgress = async () => {
    const reset = await resetGuideProgress(currentUser?.uid);
    setGuideProgress(reset);
  };

  // Initial Data Load on User Sign In
  useEffect(() => {
    if (!currentUser) {
      setIsDataLoaded(false);
      return;
    }

    const loadData = async () => {
      try {
        const uid = currentUser.uid;
        const [
          loadedAssistants,
          loadedRules,
          loadedSkills,
          loadedSOPs,
          loadedMemories,
          loadedAutomations,
          loadedTools,
          loadedLogs
        ] = await Promise.all([
          fsLoadAssistants(uid),
          fsLoadTrainingRules(uid),
          fsLoadSkills(uid),
          fsLoadSOPs(uid),
          fsLoadMemories(uid),
          fsLoadAutomations(uid),
          fsLoadTools(uid),
          fsLoadActivityLogs(uid),
        ]);

        if (loadedAssistants.length > 0) {
          setAssistants(loadedAssistants);
          if (!loadedAssistants.find((a) => a.id === activeAssistantId)) {
            setActiveAssistantId(loadedAssistants[0].id);
          }
        }
        
        if (loadedRules.length > 0) setTrainingRules(loadedRules);
        if (loadedSkills.length > 0) setSkills(loadedSkills);
        if (loadedSOPs.length > 0) setSOPs(loadedSOPs);
        if (loadedMemories.length > 0) setMemories(loadedMemories);
        if (loadedAutomations.length > 0) setAutomations(loadedAutomations);
        if (loadedTools.length > 0) setTools(loadedTools);
        if (loadedLogs.length > 0) setLogs(loadedLogs);
        
        // Load User Guide Progress
        const loadedGuideProgress = await loadGuideProgress(uid);
        setGuideProgress(loadedGuideProgress);
        if (!loadedGuideProgress.onboardingGuideShown) {
          setShowOnboardingGuide(true);
        }

        if (authProfile) {
          setUserProfile(authProfile);
        }
      } catch (err) {
        console.warn("User data loading fallback:", err);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, [currentUser?.uid]);

  // Sync auth profile updates (e.g. role or accountStatus change) without infinite loop
  useEffect(() => {
    if (authProfile) {
      setUserProfile((prev) => {
        if (
          prev.role === authProfile.role &&
          prev.accountStatus === authProfile.accountStatus &&
          prev.subscription?.plan === authProfile.subscription?.plan &&
          prev.name === authProfile.name
        ) {
          return prev;
        }
        return { ...prev, ...authProfile };
      });
    }
  }, [authProfile]);

  // Sync theme
  useEffect(() => {
    if (userProfile?.appTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [userProfile?.appTheme]);

  const isInitialLoadRef = useRef(true);

  // Save changes to persistent storage
  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    if (assistants.length > 0) fsSaveAssistants(currentUser.uid, assistants);
  }, [assistants, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveUserProfilePreferences(currentUser.uid, userProfile);
  }, [userProfile, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveTrainingRules(currentUser.uid, trainingRules);
  }, [trainingRules, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveSkills(currentUser.uid, skills);
  }, [skills, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveSOPs(currentUser.uid, sops);
  }, [sops, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveMemories(currentUser.uid, memories);
  }, [memories, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveAutomations(currentUser.uid, automations);
  }, [automations, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveTools(currentUser.uid, tools);
  }, [tools, currentUser?.uid, isDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    if (isInitialLoadRef.current) return;
    fsSaveActivityLogs(currentUser.uid, logs);
  }, [logs, currentUser?.uid, isDataLoaded]);

  // Turn off initial load guard after first data load settlement
  useEffect(() => {
    if (isDataLoaded) {
      const timer = setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDataLoaded]);

  // Active assistant resolution
  const activeAssistant =
    assistants.find((a) => a.id === activeAssistantId) || assistants[0] || null;

  // Add Log Helper
  const addLog = (text: string, type: 'TRAINING' | 'SKILL' | 'SOP' | 'TEST' | 'AUTOMATION' | 'DEPLOY') => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Handlers for Assistants
  const handleSelectAssistant = (id: string) => {
    setActiveAssistantId(id);
  };

  const handleSaveAssistant = (newAssistant: Assistant, updatedProfile?: Partial<UserProfile>) => {
    const updatedList = [newAssistant, ...assistants];
    setAssistants(updatedList);
    setActiveAssistantId(newAssistant.id);

    if (updatedProfile) {
      setUserProfile((prev) => ({ ...prev, ...updatedProfile }));
    }

    addLog(`Hired and configured new AI Employee: ${newAssistant.name} (${newAssistant.role})`, 'TRAINING');
  };

  const handleUpdateAssistant = (updated: Assistant) => {
    const updatedList = assistants.map((a) => (a.id === updated.id ? updated : a));
    setAssistants(updatedList);
  };

  const handleDeleteAssistant = (id: string) => {
    if (assistants.length <= 1) return;
    const filtered = assistants.filter((a) => a.id !== id);
    setAssistants(filtered);
    if (activeAssistantId === id && filtered.length > 0) {
      setActiveAssistantId(filtered[0].id);
    }
  };

  // Handlers for Rules & Training
  const handleAddRule = (rule: Omit<TrainingRule, 'id' | 'createdAt'>) => {
    const newRule: TrainingRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTrainingRules((prev) => [newRule, ...prev]);

    // Recalculate progress
    if (activeAssistant) {
      const newProgress = Math.min(100, activeAssistant.trainingProgress + 4);
      handleUpdateAssistant({
        ...activeAssistant,
        trainingProgress: newProgress,
      });
    }

    addLog(`Taught rule: "${newRule.title}" (${newRule.type})`, 'TRAINING');
  };

  const handleDeleteRule = (id: string) => {
    setTrainingRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRule = (rule: TrainingRule) => {
    setTrainingRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
  };

  // Handlers for Skills
  const handleAddSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: `skill_${Date.now()}`,
    };
    setSkills((prev) => [newSkill, ...prev]);
    addLog(`Equipped skill: "${newSkill.name}"`, 'SKILL');
  };

  const handleUpdateSkill = (skill: Skill) => {
    setSkills((prev) => prev.map((s) => (s.id === skill.id ? skill : s)));
  };

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for SOPs
  const handleAddSOP = (sop: Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSop: SOP = {
      ...sop,
      id: `sop_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSOPs((prev) => [newSop, ...prev]);
    addLog(`Standardized SOP Playbook: "${newSop.name}"`, 'SOP');
  };

  const handleUpdateSOP = (sop: SOP) => {
    setSOPs((prev) => prev.map((s) => (s.id === sop.id ? sop : s)));
  };

  const handleDeleteSOP = (id: string) => {
    setSOPs((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Memories
  const handleAddMemory = (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMemory: Memory = {
      ...memory,
      id: `mem_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMemory, ...prev]);
    addLog(`Indexed memory fact: "${newMemory.title}"`, 'TRAINING');
  };

  const handleUpdateMemory = (memory: Memory) => {
    setMemories((prev) => prev.map((m) => (m.id === memory.id ? memory : m)));
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers for Automations
  const handleAddAutomation = (auto: Omit<AutomationItem, 'id'>) => {
    const newAuto: AutomationItem = {
      ...auto,
      id: `auto_${Date.now()}`,
    };
    setAutomations((prev) => [newAuto, ...prev]);
    addLog(`Scheduled routine automation: "${newAuto.name}"`, 'AUTOMATION');
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a
      )
    );
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  // Handlers for Tools
  const handleToggleTool = (key: string) => {
    setTools((prev) =>
      prev.map((t) =>
        t.key === key
          ? { ...t, status: t.status === 'CONNECTED' ? 'NOT_CONNECTED' : 'CONNECTED' }
          : t
      )
    );
  };

  const handleUpdateToolConfig = (key: string, config: any) => {
    setTools((prev) =>
      prev.map((t) => (t.key === key ? { ...t, config: { ...t.config, ...config } } : t))
    );
  };

  // Test Score Update
  const handleUpdateAssistantScore = (assistantId: string, score: number) => {
    setAssistants((prev) =>
      prev.map((a) => (a.id === assistantId ? { ...a, testScore: score } : a))
    );
    addLog(`Ran Test Lab benchmark. Score: ${score}/100`, 'TEST');
  };

  // Deploy Handler
  const handleDeploySuccess = () => {
    if (activeAssistant) {
      handleUpdateAssistant({
        ...activeAssistant,
        status: 'DEPLOYED',
        hermesConfig: {
          ...activeAssistant.hermesConfig,
          isConnected: true,
        },
      });
      addLog(`Successfully deployed ${activeAssistant.name} to Hermes Runtime!`, 'DEPLOY');
    }
  };

  // Reset Data Handler
  const handleResetData = () => {
    if (window.confirm('Reset all assistant data to initial factory state?')) {
      resetToInitialData();
      window.location.reload();
    }
  };

  if (authLoading || (currentUser && !isDataLoaded)) {
    return (
      <div className="flex h-screen w-screen bg-[#0A0A0A] text-[#F0F0F0] items-center justify-center flex-col gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <div className="text-sm font-mono text-[#888]">Checking your account...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  if (userProfile.accountStatus === 'pending') {
    return <PendingApprovalScreen currentUser={currentUser} refreshProfile={refreshProfile} />;
  }

  if (userProfile.accountStatus === 'rejected') {
    return (
      <div className="flex h-screen w-screen bg-[#050505] text-[#F0F0F0] items-center justify-center font-sans p-6">
        <div className="max-w-md w-full bg-[#111] p-8 rounded-2xl border border-red-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <div className="w-16 h-16 mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Akses Ditolak / Ditangguhkan</h2>
          <p className="text-xs text-red-400 font-mono uppercase tracking-widest mb-4">Access Restricted</p>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Akun <strong className="text-white">{currentUser.email}</strong> tidak memiliki otorisasi aktif untuk mengakses Hermes AI Studio saat ini. Silakan hubungi Administrator.
          </p>
          <button 
            onClick={() => {
              import('./lib/firebase').then(({ auth, signOut }) => signOut(auth));
            }}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors font-medium text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-[#F0F0F0] font-sans antialiased relative selection:bg-[#FF5F1F]/30 selection:text-white">
      {/* Subtle Architectural Grid Lines */}
      <div className="fixed top-0 right-1/4 w-[1px] h-full bg-white/[0.03] pointer-events-none z-0" />
      <div className="fixed top-1/3 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        activeAssistant={activeAssistant}
        assistants={assistants}
        userProfile={userProfile}
        onSelectAssistant={handleSelectAssistant}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        onOpenWizard={() => {
          setCurrentView('wizard');
          setIsMobileMenuOpen(false);
        }}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A0A0A] relative z-10">
        {/* App Header */}
        <Header
          currentView={currentView}
          activeAssistant={activeAssistant}
          userProfile={userProfile}
          advancedMode={advancedMode}
          onToggleAdvancedMode={() => setAdvancedMode(!advancedMode)}
          onUpdateUserProfile={setUserProfile}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenWizard={() => setCurrentView('wizard')}
          onNavigate={(view) => setCurrentView(view)}
          totalAssistants={assistants.length}
        />

        {/* Contextual AI Coach Notification Banner */}
        <AICoachBar
          assistant={activeAssistant}
          skills={skills}
          memories={memories}
          tools={tools}
          onNavigate={(view) => setCurrentView(view)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin">
          <ErrorBoundary>
            {currentView === 'dashboard' && (
              <DashboardView

              userProfile={userProfile}
              assistants={assistants}
              skills={skills}
              memories={memories}
              automations={automations}
              tools={tools}
              logs={logs}
              onSelectAssistant={handleSelectAssistant}
              onNavigate={(view) => setCurrentView(view)}
              onOpenWizard={() => setCurrentView('wizard')}
            />
          )}

          {currentView === 'assistants' && (
            <MyAssistantsView
              assistants={assistants}
              skills={skills}
              memories={memories}
              onSelectAssistant={handleSelectAssistant}
              onDeleteAssistant={handleDeleteAssistant}
              onOpenWizard={() => setCurrentView('wizard')}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'workspace' && activeAssistant && (
            <AssistantWorkspaceView

              assistant={activeAssistant}
              rules={trainingRules}
              skills={skills}
              sops={sops}
              memories={memories}
              automations={automations}
              tools={tools}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'wizard' && (
            <CreateAssistantWizard

              userProfile={userProfile}
              onSaveAssistant={handleSaveAssistant}
              onCancel={() => setCurrentView('dashboard')}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'training' && activeAssistant && (
            <TrainingCenterView

              assistant={activeAssistant}
              rules={trainingRules}
              onAddRule={handleAddRule}
              onDeleteRule={handleDeleteRule}
              onUpdateRule={handleUpdateRule}
            />
          )}

          {currentView === 'skills' && activeAssistant && (
            <SkillsView

              assistant={activeAssistant}
              skills={skills}
              sops={sops}
              onAddSkill={handleAddSkill}
              onUpdateSkill={handleUpdateSkill}
              onDeleteSkill={handleDeleteSkill}
              onNavigate={(view) => setCurrentView(view)}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'sop' && activeAssistant && (
            <SOPView

              assistant={activeAssistant}
              sops={sops}
              onAddSOP={handleAddSOP}
              onUpdateSOP={handleUpdateSOP}
              onDeleteSOP={handleDeleteSOP}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'memory' && activeAssistant && (
            <MemoryView

              assistant={activeAssistant}
              memories={memories}
              onAddMemory={handleAddMemory}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'toolbox' && activeAssistant && (
            <ToolboxView

              assistant={activeAssistant}
              tools={tools}
              onToggleTool={handleToggleTool}
              onUpdateToolConfig={handleUpdateToolConfig}
            />
          )}

          {currentView === 'authority' && activeAssistant && (
            <AuthorityView

              assistant={activeAssistant}
              onUpdateAssistant={handleUpdateAssistant}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'automation' && activeAssistant && (
            <AutomationView

              assistant={activeAssistant}
              automations={automations}
              onAddAutomation={handleAddAutomation}
              onToggleAutomation={handleToggleAutomation}
              onDeleteAutomation={handleDeleteAutomation}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'testlab' && activeAssistant && (
            <TestLabView

              assistant={activeAssistant}
              onAddRule={handleAddRule}
              onUpdateAssistantScore={handleUpdateAssistantScore}
              onOpenGuide={handleOpenContextualGuide}
            />
          )}

          {currentView === 'integrations' && activeAssistant && (
            <IntegrationsView

              assistant={activeAssistant}
              onUpdateAssistant={handleUpdateAssistant}
            />
          )}

          {currentView === 'deploy' && activeAssistant && (
            <DeployView
              assistant={activeAssistant}
              userProfile={userProfile}
              trainingRules={trainingRules}
              skills={skills}
              sops={sops}
              memories={memories}
              automations={automations}
              tools={tools}
              onDeploy={handleDeploySuccess}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView

              onCloneTemplate={(asst) => {
                handleSaveAssistant(asst);
                setCurrentView('workspace');
              }}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'guide' && (
            <UserGuideView
              guideProgress={guideProgress}
              onUpdateGuideProgress={handleUpdateGuideProgress}
              onResetGuideProgress={handleResetGuideProgress}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView

              userProfile={userProfile}
              onUpdateProfile={(p) => setUserProfile(p)}
              onResetData={handleResetData}
            />
          )}

          {currentView === 'admin' && (userProfile.role === 'admin' || userProfile.email?.toLowerCase() === 'milhamyogaswara@gmail.com') && (
            <AdminDashboardView />
          )}
          </ErrorBoundary>

          {/* Contextual Next Step Guidance for Beginner Mode */}
          {guideProgress.beginnerMode && currentView !== 'guide' && (
            <div className="mt-8 max-w-6xl mx-auto">
              <NextStepCard
                guideProgress={guideProgress}
                currentView={currentView}
                onNavigate={(view) => setCurrentView(view)}
                onOpenGuide={handleOpenContextualGuide}
              />
            </div>
          )}
        </main>
      </div>

      {/* Contextual Guide Drawer */}
      <GuideDrawer
        isOpen={Boolean(contextualTopic)}
        topic={contextualTopic}
        onClose={() => setContextualTopic(null)}
        onNavigate={(view) => {
          setContextualTopic(null);
          setCurrentView(view);
        }}
      />

      {/* First Login Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingGuide}
        onClose={() => setShowOnboardingGuide(false)}
        onStartTour={() => {
          setShowOnboardingGuide(false);
          handleUpdateGuideProgress({ onboardingGuideShown: true });
          setCurrentView('guide');
        }}
        onSkip={() => {
          setShowOnboardingGuide(false);
          handleUpdateGuideProgress({ onboardingGuideShown: true });
        }}
      />
    </div>
  );
}

function PendingApprovalScreen({ currentUser, refreshProfile }: { currentUser: any; refreshProfile: () => Promise<void> }) {
  const [checkingApproval, setCheckingApproval] = useState(false);
  const [syncedInDatabase, setSyncedInDatabase] = useState(false);

  // Guarantee user document existence in Firestore / local storage
  useEffect(() => {
    let isMounted = true;
    if (currentUser?.uid) {
      const profileData = {
        uid: currentUser.uid,
        id: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        photoURL: currentUser.photoURL || '',
        role: 'user' as const,
        accountStatus: 'pending' as const,
        subscription: {
          plan: 'FREE' as const,
          status: 'PENDING' as const,
          maxAgents: 1,
          maxTokens: 10000,
          tokensUsed: 0,
          features: {
            customEndpoints: true,
            priorityTraining: false,
            unlimitedMemory: false,
            exportIntegration: true,
          },
          startDate: new Date().toISOString(),
          expiresAt: null,
          authorizedBy: '',
          authorizedAt: '',
          notes: 'Self-registered user pending admin authorization.',
        }
      };

      upsertLocalUser(profileData);
      if (isMounted) setSyncedInDatabase(true);

      if (!checkQuotaStatus()) {
        import('./lib/firebase').then(async ({ db, doc, setDoc, getDoc, serverTimestamp }) => {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const snap = await getDoc(userRef).catch(() => null);
            
            const payload = {
              ...profileData,
              createdAt: (snap && snap.exists && snap.exists()) ? (snap.data().createdAt || serverTimestamp()) : serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              subscription: (snap && snap.exists && snap.exists() && snap.data().subscription) ? snap.data().subscription : profileData.subscription
            };

            const sanitized = sanitizeForFirestore(payload);
            await setDoc(userRef, sanitized, { merge: true }).catch(err => {
              if (isQuotaError(err)) markQuotaExhausted();
            });

            if (currentUser.email) {
              const emailKey = currentUser.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
              if (emailKey !== currentUser.uid) {
                await setDoc(doc(db, 'users', emailKey), sanitized, { merge: true }).catch(err => {
                  if (isQuotaError(err)) markQuotaExhausted();
                });
              }
            }
          } catch (e) {
            if (isQuotaError(e)) markQuotaExhausted();
            console.warn('Pending sync notice:', e);
          }
        });
      }
    }
    return () => { isMounted = false; };
  }, [currentUser?.uid, currentUser?.email]);

  const handleCheckStatus = async () => {
    setCheckingApproval(true);
    try {
      await refreshProfile();
    } catch (e) {
      console.error('Check status error:', e);
    } finally {
      setTimeout(() => setCheckingApproval(false), 600);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#F0F0F0] items-center justify-center font-sans p-6">
      <div className="max-w-md w-full bg-[#111] p-8 rounded-2xl border border-yellow-500/30 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
        <div className="w-16 h-16 mx-auto bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-white">Pendaftaran Menunggu Persetujuan</h2>
        <p className="text-xs text-yellow-400 font-mono uppercase tracking-widest mb-4">Account Pending Approval</p>
        
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Akun Anda (<strong className="text-white">{currentUser?.email}</strong>) telah terdaftar di database dan saat ini sedang menunggu otorisasi paket langganan oleh Project Admin.
        </p>

        <div className="p-3 bg-[#181818] border border-white/10 rounded-xl text-xs text-gray-400 mb-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-2">
            <span>🛡️ Assigned Admin:</span>
            <span className="text-[#FF5F1F] font-mono font-medium">milhamyogaswara@gmail.com</span>
          </div>
          {syncedInDatabase && (
            <div className="text-[11px] text-green-400 flex items-center justify-center gap-1">
              <span>● Status database: Terhubung & Menunggu Approval Admin</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => {
              import('./lib/firebase').then(({ auth, signOut }) => signOut(auth));
            }}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors font-medium text-xs"
          >
            Sign Out (Keluar)
          </button>
          <button 
            onClick={handleCheckStatus}
            disabled={checkingApproval}
            className="w-full py-3 bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white rounded-xl transition-all font-semibold text-xs shadow-lg shadow-[#FF5F1F]/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {checkingApproval ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memeriksa...</span>
              </>
            ) : (
              <span>Cek Status Akun</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

