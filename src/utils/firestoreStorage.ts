import { db } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import {
  Assistant,
  AutomationItem,
  Memory,
  Skill,
  SOP,
  ToolItem,
  TrainingRule,
  ActivityLog,
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

// In-memory debounce timers and dirty check hashes to avoid write quota spam
const debounceTimers: Record<string, NodeJS.Timeout> = {};
const lastSavedHashes: Record<string, string> = {};

const QUOTA_KEY = 'hermes_fs_quota_exhausted_timestamp';

export const checkQuotaStatus = (): boolean => {
  try {
    const timestampStr = localStorage.getItem(QUOTA_KEY);
    if (!timestampStr) return false;
    const timestamp = parseInt(timestampStr, 10);
    // Cache quota lockout for 4 hours before retrying
    if (Date.now() - timestamp < 4 * 60 * 60 * 1000) {
      return true;
    }
    // Expired, clear it
    localStorage.removeItem(QUOTA_KEY);
    return false;
  } catch {
    return false;
  }
};

export const markQuotaExhausted = () => {
  try {
    localStorage.setItem(QUOTA_KEY, Date.now().toString());
    console.warn('[Hermes Studio] Firestore daily write quota limit reached. Gracefully utilizing local storage mode.');
  } catch {}
};

export const isQuotaError = (err: any): boolean => {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = (err.code || '').toLowerCase();
  return (
    code === 'resource-exhausted' ||
    msg.includes('quota') ||
    msg.includes('resource-exhausted') ||
    msg.includes('write stream exhausted') ||
    msg.includes('quota limit exceeded')
  );
};

export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as any;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as any;
  }
  // Check if it's a Firestore FieldValue (e.g. serverTimestamp())
  if ((data as any)?._methodName || (data as any)?.constructor?.name === 'FieldValue') {
    return data;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

export const fsLoadAssistants = async (uid: string): Promise<Assistant[]> => {
  if (checkQuotaStatus()) {
    const data = loadAssistants();
    lastSavedHashes[`assts_${uid}`] = JSON.stringify(data.map(a => ({ id: a.id, name: a.name, role: a.role, mission: a.mission, status: a.status })));
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/assistants`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as Assistant);
      saveAssistants(data);
      lastSavedHashes[`assts_${uid}`] = JSON.stringify(data.map(a => ({ id: a.id, name: a.name, role: a.role, mission: a.mission, status: a.status })));
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadAssistants fallback to local storage:', err);
  }
  const data = loadAssistants();
  lastSavedHashes[`assts_${uid}`] = JSON.stringify(data.map(a => ({ id: a.id, name: a.name, role: a.role, mission: a.mission, status: a.status })));
  return data;
};

export const fsSaveAssistants = (uid: string, assistants: Assistant[]) => {
  saveAssistants(assistants);
  const hash = JSON.stringify(assistants.map(a => ({ id: a.id, name: a.name, role: a.role, mission: a.mission, status: a.status })));
  if (lastSavedHashes[`assts_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`assts_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`assts_${uid}`]) clearTimeout(debounceTimers[`assts_${uid}`]);
  debounceTimers[`assts_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`assts_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const asst of assistants) {
        const ref = doc(db, `users/${uid}/assistants`, asst.id);
        batch.set(ref, asst, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveAssistants fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadTrainingRules = async (uid: string): Promise<TrainingRule[]> => {
  if (checkQuotaStatus()) {
    const data = loadTrainingRules();
    lastSavedHashes[`rules_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/trainingRules`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as TrainingRule);
      saveTrainingRules(data);
      lastSavedHashes[`rules_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadTrainingRules fallback to local storage:', err);
  }
  const data = loadTrainingRules();
  lastSavedHashes[`rules_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveTrainingRules = (uid: string, rules: TrainingRule[]) => {
  saveTrainingRules(rules);
  const hash = JSON.stringify(rules);
  if (lastSavedHashes[`rules_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`rules_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`rules_${uid}`]) clearTimeout(debounceTimers[`rules_${uid}`]);
  debounceTimers[`rules_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`rules_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const rule of rules) {
        const ref = doc(db, `users/${uid}/trainingRules`, rule.id);
        batch.set(ref, rule, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveTrainingRules fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadSkills = async (uid: string): Promise<Skill[]> => {
  if (checkQuotaStatus()) {
    const data = loadSkills();
    lastSavedHashes[`skills_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/skills`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as Skill);
      saveSkills(data);
      lastSavedHashes[`skills_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadSkills fallback to local storage:', err);
  }
  const data = loadSkills();
  lastSavedHashes[`skills_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveSkills = (uid: string, skills: Skill[]) => {
  saveSkills(skills);
  const hash = JSON.stringify(skills);
  if (lastSavedHashes[`skills_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`skills_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`skills_${uid}`]) clearTimeout(debounceTimers[`skills_${uid}`]);
  debounceTimers[`skills_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`skills_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const skill of skills) {
        const ref = doc(db, `users/${uid}/skills`, skill.id);
        batch.set(ref, skill, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveSkills fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadSOPs = async (uid: string): Promise<SOP[]> => {
  if (checkQuotaStatus()) {
    const data = loadSOPs();
    lastSavedHashes[`sops_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/sops`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as SOP);
      saveSOPs(data);
      lastSavedHashes[`sops_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadSOPs fallback to local storage:', err);
  }
  const data = loadSOPs();
  lastSavedHashes[`sops_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveSOPs = (uid: string, sops: SOP[]) => {
  saveSOPs(sops);
  const hash = JSON.stringify(sops);
  if (lastSavedHashes[`sops_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`sops_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`sops_${uid}`]) clearTimeout(debounceTimers[`sops_${uid}`]);
  debounceTimers[`sops_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`sops_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const sop of sops) {
        const ref = doc(db, `users/${uid}/sops`, sop.id);
        batch.set(ref, sop, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveSOPs fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadMemories = async (uid: string): Promise<Memory[]> => {
  if (checkQuotaStatus()) {
    const data = loadMemories();
    lastSavedHashes[`memories_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/memories`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as Memory);
      saveMemories(data);
      lastSavedHashes[`memories_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadMemories fallback to local storage:', err);
  }
  const data = loadMemories();
  lastSavedHashes[`memories_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveMemories = (uid: string, memories: Memory[]) => {
  saveMemories(memories);
  const hash = JSON.stringify(memories);
  if (lastSavedHashes[`memories_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`memories_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`memories_${uid}`]) clearTimeout(debounceTimers[`memories_${uid}`]);
  debounceTimers[`memories_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`memories_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const memory of memories) {
        const ref = doc(db, `users/${uid}/memories`, memory.id);
        batch.set(ref, memory, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveMemories fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadAutomations = async (uid: string): Promise<AutomationItem[]> => {
  if (checkQuotaStatus()) {
    const data = loadAutomations();
    lastSavedHashes[`automations_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/automations`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as AutomationItem);
      saveAutomations(data);
      lastSavedHashes[`automations_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadAutomations fallback to local storage:', err);
  }
  const data = loadAutomations();
  lastSavedHashes[`automations_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveAutomations = (uid: string, automations: AutomationItem[]) => {
  saveAutomations(automations);
  const hash = JSON.stringify(automations);
  if (lastSavedHashes[`automations_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`automations_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`automations_${uid}`]) clearTimeout(debounceTimers[`automations_${uid}`]);
  debounceTimers[`automations_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`automations_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const auto of automations) {
        const ref = doc(db, `users/${uid}/automations`, auto.id);
        batch.set(ref, auto, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveAutomations fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadTools = async (uid: string): Promise<ToolItem[]> => {
  if (checkQuotaStatus()) {
    const data = loadTools();
    lastSavedHashes[`tools_${uid}`] = JSON.stringify(data);
    return data;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/tools`));
    if (!snapshot.empty) {
      const data = snapshot.docs.map(d => d.data() as ToolItem);
      saveTools(data);
      lastSavedHashes[`tools_${uid}`] = JSON.stringify(data);
      return data;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadTools fallback to local storage:', err);
  }
  const data = loadTools();
  lastSavedHashes[`tools_${uid}`] = JSON.stringify(data);
  return data;
};

export const fsSaveTools = (uid: string, tools: ToolItem[]) => {
  saveTools(tools);
  const hash = JSON.stringify(tools);
  if (lastSavedHashes[`tools_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`tools_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`tools_${uid}`]) clearTimeout(debounceTimers[`tools_${uid}`]);
  debounceTimers[`tools_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`tools_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const tool of tools) {
        const ref = doc(db, `users/${uid}/tools`, tool.key);
        batch.set(ref, tool, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveTools fallback (local storage updated):', err);
    }
  }, 2000);
};

export const fsLoadActivityLogs = async (uid: string): Promise<ActivityLog[]> => {
  if (checkQuotaStatus()) {
    const logs = loadActivityLogs();
    lastSavedHashes[`logs_${uid}`] = JSON.stringify(logs.slice(0, 20));
    return logs;
  }
  try {
    const snapshot = await getDocs(collection(db, `users/${uid}/activityLogs`));
    if (!snapshot.empty) {
      const logs = snapshot.docs.map(d => d.data() as ActivityLog);
      const sorted = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      saveActivityLogs(sorted);
      lastSavedHashes[`logs_${uid}`] = JSON.stringify(sorted.slice(0, 20));
      return sorted;
    }
  } catch (err) {
    if (isQuotaError(err)) markQuotaExhausted();
    console.warn('Firestore loadActivityLogs fallback to local storage:', err);
  }
  const logs = loadActivityLogs();
  lastSavedHashes[`logs_${uid}`] = JSON.stringify(logs.slice(0, 20));
  return logs;
};

export const fsSaveActivityLogs = (uid: string, logs: ActivityLog[]) => {
  saveActivityLogs(logs);
  const hash = JSON.stringify(logs.slice(0, 20));
  if (lastSavedHashes[`logs_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`logs_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`logs_${uid}`]) clearTimeout(debounceTimers[`logs_${uid}`]);
  debounceTimers[`logs_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`logs_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const batch = writeBatch(db);
      for (const log of logs.slice(0, 30)) {
        const ref = doc(db, `users/${uid}/activityLogs`, log.id);
        batch.set(ref, log, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveActivityLogs fallback (local storage updated):', err);
    }
  }, 3000);
};

export const fsSaveUserProfilePreferences = async (uid: string, profile: any) => {
  if (!profile) return;
  saveUserProfile(profile);

  const preferencesPayload = {
    addressStyle: profile.addressStyle || '',
    company: profile.company || '',
    industry: profile.industry || '',
    targetMarket: profile.targetMarket || '',
    communicationPref: profile.communicationPref || 'BALANCED',
    theme: profile.appTheme || 'dark',
    language: profile.appLanguage || 'ID',
    products: profile.products || '',
    website: profile.website || '',
    primaryWork: profile.primaryWork || '',
    responseStyles: profile.responseStyles || [],
    displayName: profile.name || '',
  };

  const hash = JSON.stringify(preferencesPayload);
  if (lastSavedHashes[`pref_${uid}`] === hash) return;

  if (checkQuotaStatus()) {
    lastSavedHashes[`pref_${uid}`] = hash;
    return;
  }

  if (debounceTimers[`pref_${uid}`]) clearTimeout(debounceTimers[`pref_${uid}`]);
  debounceTimers[`pref_${uid}`] = setTimeout(async () => {
    lastSavedHashes[`pref_${uid}`] = hash;
    if (checkQuotaStatus()) return;
    try {
      const ref = doc(db, `users/${uid}`);
      await setDoc(ref, {
        appPreferences: {
          addressStyle: preferencesPayload.addressStyle,
          company: preferencesPayload.company,
          industry: preferencesPayload.industry,
          targetMarket: preferencesPayload.targetMarket,
          communicationPref: preferencesPayload.communicationPref,
          theme: preferencesPayload.theme,
          language: preferencesPayload.language,
        },
        products: preferencesPayload.products,
        website: preferencesPayload.website,
        primaryWork: preferencesPayload.primaryWork,
        responseStyles: preferencesPayload.responseStyles,
        displayName: preferencesPayload.displayName,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('Firestore fsSaveUserProfilePreferences fallback (local storage updated):', err);
    }
  }, 2500);
};

