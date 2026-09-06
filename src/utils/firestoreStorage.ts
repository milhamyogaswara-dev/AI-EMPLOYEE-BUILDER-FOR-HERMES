import {
  Assistant,
  AutomationItem,
  Memory,
  Skill,
  SOP,
  ToolItem,
  TrainingRule,
  ActivityLog,
  UserProfile,
} from '../types';
import {
  loadAssistants,
  saveAssistants,
  loadTrainingRules,
  saveTrainingRules,
  loadSkills,
  saveSkills,
  loadSOPs,
  saveSOPs,
  loadMemories,
  saveMemories,
  loadAutomations,
  saveAutomations,
  loadTools,
  saveTools,
  loadActivityLogs,
  saveActivityLogs,
  saveUserProfile,
} from './storage';
import { apiClient } from '../services/apiClient';

// In-memory debounce timers and dirty check hashes
const debounceTimers: Record<string, NodeJS.Timeout> = {};
const lastSavedHashes: Record<string, string> = {};

export const checkQuotaStatus = (): boolean => false;
export const markQuotaExhausted = () => {};
export const isQuotaError = (_err: any): boolean => false;

export function sanitizeForFirestore<T>(data: T): T {
  return data;
}

// 1. ASSISTANTS
export const fsLoadAssistants = async (uid: string): Promise<Assistant[]> => {
  try {
    const list = await apiClient.getAssistants();
    if (list && list.length > 0) {
      saveAssistants(list);
      return list;
    }
  } catch (err) {
    console.warn('API getAssistants fallback to local storage:', err);
  }
  return loadAssistants();
};

export const fsSaveAssistants = async (uid: string, assistants: Assistant[]) => {
  if (!assistants || assistants.length === 0) return;
  saveAssistants(assistants);

  const hashKey = `assts_${uid}`;
  const currentHash = JSON.stringify(assistants.map(a => ({ id: a.id, name: a.name, status: a.status, role: a.role })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const assistant of assistants) {
        await apiClient.saveAssistant(assistant);
      }
    } catch (err) {
      console.warn('API saveAssistant notice:', err);
    }
  }, 1000);
};

// 2. TRAINING RULES
export const fsLoadTrainingRules = async (uid: string): Promise<TrainingRule[]> => {
  try {
    const list = await apiClient.getTrainingRules();
    if (list && list.length > 0) {
      saveTrainingRules(list);
      return list;
    }
  } catch (err) {
    console.warn('API getTrainingRules fallback to local storage:', err);
  }
  return loadTrainingRules();
};

export const fsSaveTrainingRules = async (uid: string, rules: TrainingRule[]) => {
  saveTrainingRules(rules);
  const hashKey = `rules_${uid}`;
  const currentHash = JSON.stringify(rules.map(r => ({ id: r.id, title: r.title, rule: r.rule, type: r.type })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const rule of rules) {
        await apiClient.saveTrainingRule(rule);
      }
    } catch (err) {
      console.warn('API saveTrainingRule notice:', err);
    }
  }, 1000);
};

// 3. SKILLS
export const fsLoadSkills = async (uid: string): Promise<Skill[]> => {
  try {
    const list = await apiClient.getSkills();
    if (list && list.length > 0) {
      saveSkills(list);
      return list;
    }
  } catch (err) {
    console.warn('API getSkills fallback to local storage:', err);
  }
  return loadSkills();
};

export const fsSaveSkills = async (uid: string, skills: Skill[]) => {
  saveSkills(skills);
  const hashKey = `skills_${uid}`;
  const currentHash = JSON.stringify(skills.map(s => ({ id: s.id, name: s.name, status: s.status, version: s.version })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const skill of skills) {
        await apiClient.saveSkill(skill);
      }
    } catch (err) {
      console.warn('API saveSkill notice:', err);
    }
  }, 1000);
};

// 4. SOPS
export const fsLoadSOPs = async (uid: string): Promise<SOP[]> => {
  try {
    const list = await apiClient.getSops();
    if (list && list.length > 0) {
      saveSOPs(list);
      return list;
    }
  } catch (err) {
    console.warn('API getSops fallback to local storage:', err);
  }
  return loadSOPs();
};

export const fsSaveSOPs = async (uid: string, sops: SOP[]) => {
  saveSOPs(sops);
  const hashKey = `sops_${uid}`;
  const currentHash = JSON.stringify(sops.map(s => ({ id: s.id, name: s.name, purpose: s.purpose })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const sop of sops) {
        await apiClient.saveSop(sop);
      }
    } catch (err) {
      console.warn('API saveSop notice:', err);
    }
  }, 1000);
};

// 5. MEMORIES
export const fsLoadMemories = async (uid: string): Promise<Memory[]> => {
  try {
    const list = await apiClient.getMemories();
    if (list && list.length > 0) {
      saveMemories(list);
      return list;
    }
  } catch (err) {
    console.warn('API getMemories fallback to local storage:', err);
  }
  return loadMemories();
};

export const fsSaveMemories = async (uid: string, memories: Memory[]) => {
  saveMemories(memories);
  const hashKey = `memories_${uid}`;
  const currentHash = JSON.stringify(memories.map(m => ({ id: m.id, title: m.title, category: m.category })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const memory of memories) {
        await apiClient.saveMemory(memory);
      }
    } catch (err) {
      console.warn('API saveMemory notice:', err);
    }
  }, 1000);
};

// 6. AUTOMATIONS
export const fsLoadAutomations = async (uid: string): Promise<AutomationItem[]> => {
  try {
    const list = await apiClient.getAutomations();
    if (list && list.length > 0) {
      saveAutomations(list);
      return list;
    }
  } catch (err) {
    console.warn('API getAutomations fallback to local storage:', err);
  }
  return loadAutomations();
};

export const fsSaveAutomations = async (uid: string, automations: AutomationItem[]) => {
  saveAutomations(automations);
  const hashKey = `automations_${uid}`;
  const currentHash = JSON.stringify(automations.map(a => ({ id: a.id, name: a.name, status: a.status })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const auto of automations) {
        await apiClient.saveAutomation(auto);
      }
    } catch (err) {
      console.warn('API saveAutomation notice:', err);
    }
  }, 1000);
};

// 7. TOOLS
export const fsLoadTools = async (uid: string): Promise<ToolItem[]> => {
  try {
    const list = await apiClient.getToolsConfigs();
    if (list && list.length > 0) {
      const localTools = loadTools();
      const merged = localTools.map(lt => {
        const found = list.find((c: any) => c.toolKey === lt.key || c.toolKey === lt.id);
        if (found) {
          return {
            ...lt,
            status: found.status as any,
            config: found.config || lt.config,
          };
        }
        return lt;
      });
      saveTools(merged);
      return merged;
    }
  } catch (err) {
    console.warn('API getToolsConfigs fallback to local storage:', err);
  }
  return loadTools();
};

export const fsSaveTools = async (uid: string, tools: ToolItem[]) => {
  saveTools(tools);
  const hashKey = `tools_${uid}`;
  const currentHash = JSON.stringify(tools.map(t => ({ id: t.id, status: t.status })));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      for (const tool of tools) {
        await apiClient.saveToolConfig(tool.key || tool.id, tool.status, tool.config);
      }
    } catch (err) {
      console.warn('API saveToolConfig notice:', err);
    }
  }, 1000);
};

// 8. ACTIVITY LOGS
export const fsLoadActivityLogs = async (uid: string): Promise<ActivityLog[]> => {
  try {
    const list = await apiClient.getActivityLogs();
    if (list && list.length > 0) {
      const mapped: ActivityLog[] = list.map(item => ({
        id: item.id,
        text: item.text,
        timestamp: typeof item.timestamp === 'string' ? item.timestamp : new Date(item.timestamp).toISOString(),
        type: item.type as any,
      }));
      saveActivityLogs(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('API getActivityLogs fallback to local storage:', err);
  }
  return loadActivityLogs();
};

export const fsSaveActivityLogs = async (uid: string, logs: ActivityLog[]) => {
  saveActivityLogs(logs);
  const hashKey = `logs_${uid}`;
  const currentHash = JSON.stringify(logs.slice(0, 10).map(l => l.id));
  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      // Save top newest logs
      for (const log of logs.slice(0, 5)) {
        await apiClient.addActivityLog({
          id: log.id,
          text: log.text,
          type: log.type,
          timestamp: new Date(log.timestamp),
        });
      }
    } catch (err) {
      console.warn('API addActivityLog notice:', err);
    }
  }, 1000);
};

// 9. USER PROFILE PREFERENCES
export const fsSaveUserProfilePreferences = async (uid: string, profile: UserProfile) => {
  saveUserProfile(profile);
  const hashKey = `pref_${uid}`;
  const currentHash = JSON.stringify({
    company: profile.company,
    industry: profile.industry,
    targetMarket: profile.targetMarket,
    appTheme: profile.appTheme,
    appLanguage: profile.appLanguage,
    addressStyle: profile.addressStyle,
    communicationPref: profile.communicationPref,
  });

  if (lastSavedHashes[hashKey] === currentHash) return;

  if (debounceTimers[hashKey]) clearTimeout(debounceTimers[hashKey]);

  debounceTimers[hashKey] = setTimeout(async () => {
    try {
      lastSavedHashes[hashKey] = currentHash;
      await apiClient.updateUserProfile({
        company: profile.company,
        industry: profile.industry,
        targetMarket: profile.targetMarket,
        appTheme: profile.appTheme,
        appLanguage: profile.appLanguage,
        addressStyle: profile.addressStyle,
        communicationPref: profile.communicationPref,
        products: profile.products,
        website: profile.website,
        primaryWork: profile.primaryWork,
        responseStyles: profile.responseStyles,
      });
    } catch (err) {
      console.warn('API updateUserProfile notice:', err);
    }
  }, 1000);
};
