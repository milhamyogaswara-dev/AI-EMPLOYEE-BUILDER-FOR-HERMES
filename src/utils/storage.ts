import {
  Assistant,
  AuthorityPermission,
  AutomationItem,
  Memory,
  Skill,
  SOP,
  TestCase,
  ToolItem,
  TrainingRule,
  UserProfile,
  ActivityLog,
} from '../types';
import {
  initialAssistant,
  initialAuthorityPermissions,
  initialAutomations,
  initialMemories,
  initialSkills,
  initialSOPs,
  initialTestCases,
  initialTools,
  initialTrainingRules,
  initialUserProfile,
  initialActivityLogs,
} from '../data/initialData';

const STORAGE_KEYS = {
  USER_PROFILE: 'hermes_user_profile',
  ASSISTANTS: 'hermes_assistants',
  ACTIVE_ASSISTANT_ID: 'hermes_active_assistant_id',
  TRAINING_RULES: 'hermes_training_rules',
  SKILLS: 'hermes_skills',
  SOPS: 'hermes_sops',
  MEMORIES: 'hermes_memories',
  AUTHORITY: 'hermes_authority',
  TOOLS: 'hermes_tools',
  AUTOMATIONS: 'hermes_automations',
  TEST_CASES: 'hermes_test_cases',
  ACTIVITY_LOGS: 'hermes_activity_logs',
  ADVANCED_MODE: 'hermes_advanced_mode',
  ALL_USERS: 'hermes_all_registered_users',
};

// Safe LocalStorage helpers
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

// Getters & Setters
export function loadAssistants(): Assistant[] {
  return loadFromStorage<Assistant[]>(STORAGE_KEYS.ASSISTANTS, [initialAssistant]);
}

export function saveAssistants(assistants: Assistant[]): void {
  saveToStorage(STORAGE_KEYS.ASSISTANTS, assistants);
}

export function loadUserProfile(): UserProfile {
  return loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, initialUserProfile);
}

export function saveUserProfile(profile: UserProfile): void {
  saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
  upsertLocalUser(profile);
}

export function loadAllUsers(): UserProfile[] {
  const users = loadFromStorage<UserProfile[]>(STORAGE_KEYS.ALL_USERS, []);
  // Make sure superadmin always exists in list
  const superAdminEmail = 'milhamyogaswara@gmail.com';
  const hasSuperAdmin = users.some(u => u.email?.toLowerCase() === superAdminEmail);
  if (!hasSuperAdmin) {
    users.unshift({
      id: 'superadmin_master',
      name: 'Super Admin (Master)',
      email: superAdminEmail,
      avatarUrl: '',
      role: 'admin',
      accountStatus: 'active',
      subscription: {
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        maxAgents: 50,
        maxTokens: 2000000,
        tokensUsed: 0,
        features: {
          customEndpoints: true,
          priorityTraining: true,
          unlimitedMemory: true,
          exportIntegration: true,
        },
        startDate: new Date().toISOString(),
        expiresAt: null,
        authorizedBy: 'System Master',
        authorizedAt: new Date().toISOString(),
        notes: 'Master Superadmin Account',
      },
      createdAt: new Date().toISOString(),
      company: 'Hermes AI',
      industry: 'Artificial Intelligence',
      products: '',
      targetMarket: '',
      website: '',
      primaryWork: '',
      addressStyle: 'Bapak/Ibu',
      communicationPref: 'BALANCED',
      responseStyles: [],
      appLanguage: 'ID',
      appTheme: 'dark',
    });
  }
  return users;
}

export function saveAllUsers(users: UserProfile[]): void {
  saveToStorage(STORAGE_KEYS.ALL_USERS, users);
}

export function upsertLocalUser(user: Partial<UserProfile> & { email?: string; id?: string }): void {
  if (!user.email && !user.id) return;
  const current = loadAllUsers();
  const emailClean = user.email?.toLowerCase().trim();
  const id = user.id;

  const idx = current.findIndex(u => (emailClean && u.email?.toLowerCase().trim() === emailClean) || (id && u.id === id));
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...user } as UserProfile;
  } else {
    current.push(user as UserProfile);
  }
  saveAllUsers(current);
}

export function getLocalUser(idOrEmail: string): UserProfile | null {
  const users = loadAllUsers();
  const search = idOrEmail.toLowerCase().trim();
  return users.find(u => u.id === idOrEmail || u.email?.toLowerCase().trim() === search) || null;
}

export function deleteLocalUser(idOrEmail: string): void {
  const users = loadAllUsers();
  const search = idOrEmail.toLowerCase().trim();
  const filtered = users.filter(u => u.id !== idOrEmail && u.email?.toLowerCase().trim() !== search);
  saveAllUsers(filtered);
}

export function loadTrainingRules(): TrainingRule[] {
  return loadFromStorage<TrainingRule[]>(STORAGE_KEYS.TRAINING_RULES, initialTrainingRules);
}

export function saveTrainingRules(rules: TrainingRule[]): void {
  saveToStorage(STORAGE_KEYS.TRAINING_RULES, rules);
}

export function loadSkills(): Skill[] {
  return loadFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
}

export function saveSkills(skills: Skill[]): void {
  saveToStorage(STORAGE_KEYS.SKILLS, skills);
}

export function loadSOPs(): SOP[] {
  return loadFromStorage<SOP[]>(STORAGE_KEYS.SOPS, initialSOPs);
}

export function saveSOPs(sops: SOP[]): void {
  saveToStorage(STORAGE_KEYS.SOPS, sops);
}

export function loadMemories(): Memory[] {
  return loadFromStorage<Memory[]>(STORAGE_KEYS.MEMORIES, initialMemories);
}

export function saveMemories(memories: Memory[]): void {
  saveToStorage(STORAGE_KEYS.MEMORIES, memories);
}

export function loadAutomations(): AutomationItem[] {
  return loadFromStorage<AutomationItem[]>(STORAGE_KEYS.AUTOMATIONS, initialAutomations);
}

export function saveAutomations(automations: AutomationItem[]): void {
  saveToStorage(STORAGE_KEYS.AUTOMATIONS, automations);
}

export function loadTools(): ToolItem[] {
  return loadFromStorage<ToolItem[]>(STORAGE_KEYS.TOOLS, initialTools);
}

export function saveTools(tools: ToolItem[]): void {
  saveToStorage(STORAGE_KEYS.TOOLS, tools);
}

export function loadAuthorityPermissions(): AuthorityPermission[] {
  return loadFromStorage<AuthorityPermission[]>(STORAGE_KEYS.AUTHORITY, initialAuthorityPermissions);
}

export function saveAuthorityPermissions(perms: AuthorityPermission[]): void {
  saveToStorage(STORAGE_KEYS.AUTHORITY, perms);
}

export function loadActivityLogs(): ActivityLog[] {
  return loadFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
}

export function saveActivityLogs(logs: ActivityLog[]): void {
  saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, logs);
}

export function resetToInitialData(): void {
  localStorage.clear();
}

export function calculateTrainingProgress(
  assistant: Assistant,
  skills: Skill[],
  sops: SOP[],
  memories: Memory[]
): number {
  const asstSkills = skills.filter((s) => s.assistantId === assistant.id && s.status === 'ACTIVE');
  const asstSops = sops.filter((s) => s.assistantId === assistant.id);
  const asstMems = memories.filter((m) => m.assistantId === assistant.id && !m.isArchived);

  const baseScore = 40;
  const skillsScore = Math.min(25, asstSkills.length * 8);
  const sopsScore = Math.min(20, asstSops.length * 10);
  const memsScore = Math.min(15, asstMems.length * 3);

  return Math.min(100, baseScore + skillsScore + sopsScore + memsScore);
}

export function generateHermesPackage(
  assistant: Assistant,
  userProfile: UserProfile,
  skills: Skill[],
  sops: SOP[],
  memories: Memory[],
  tools: ToolItem[]
) {
  return {
    schemaVersion: 'hermes.ai.v2',
    generatedAt: new Date().toISOString(),
    agent: {
      id: assistant.id,
      name: assistant.name,
      role: assistant.role,
      mission: assistant.mission,
      language: assistant.language,
      authorityLevel: assistant.authorityLevel,
      status: assistant.status,
    },
    userContext: {
      name: userProfile.name,
      addressAs: userProfile.addressStyle,
      company: userProfile.company,
      industry: userProfile.industry,
      targetMarket: userProfile.targetMarket,
    },
    skills: skills.map((s) => ({
      name: s.name,
      description: s.description,
      trigger: s.trigger,
      instructions: s.instructions,
      outputFormat: s.outputFormat,
    })),
    sops: sops.map((sop) => ({
      name: sop.name,
      trigger: sop.trigger,
      steps: sop.workflowSteps,
      decisionRules: sop.decisionRules,
    })),
    memories: memories.map((m) => ({
      title: m.title,
      category: m.category,
      content: m.content,
    })),
    tools: tools.map((t) => ({
      key: t.key,
      name: t.name,
      status: t.status,
    })),
  };
}

export function scanMemoryHealth(memories: Memory[]): {
  conflictCount: number;
  conflicts: Array<{ memA: Memory; memB?: Memory; reason: string }>;
  duplicateCount: number;
  outdatedCount: number;
} {
  const conflicts: Array<{ memA: Memory; memB?: Memory; reason: string }> = [];
  let duplicateCount = 0;
  let outdatedCount = 0;

  for (let i = 0; i < memories.length; i++) {
    const memA = memories[i];
    if (memA.isArchived) continue;

    if (memA.conflictFlag?.hasConflict) {
      const memB = memories.find((m) => m.id === memA.conflictFlag?.conflictingMemoryId);
      conflicts.push({
        memA,
        memB,
        reason: memA.conflictFlag.note,
      });
    }

    // Check for title duplicates
    for (let j = i + 1; j < memories.length; j++) {
      const memB = memories[j];
      if (memB.isArchived) continue;
      if (memA.title.toLowerCase() === memB.title.toLowerCase()) {
        duplicateCount++;
      }
    }

    if (
      memA.title.toLowerCase().includes('old') ||
      memA.title.toLowerCase().includes('legacy') ||
      memA.title.toLowerCase().includes('expired')
    ) {
      outdatedCount++;
    }
  }

  return {
    conflictCount: conflicts.length,
    conflicts,
    duplicateCount,
    outdatedCount,
  };
}
