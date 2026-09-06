import { auth } from '../lib/firebase';
import { UserProfile, Assistant, TrainingRule, Skill, SOP, Memory, AutomationItem, TestCase, ToolItem } from '../types';

async function getAuthHeader(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  // USER / AUTH
  async syncUser(name?: string, avatarUrl?: string): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, avatarUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sync user');
    return data.user;
  },

  async getUserProfile(): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/profile', { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user profile');
    return data.user;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data.user;
  },

  // ADMIN USERS MANAGEMENT
  async getAdminUsers(): Promise<UserProfile[]> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/users', { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data.users;
  },

  async addAdminUser(user: Partial<UserProfile>): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add user');
    return data.user;
  },

  async updateAdminUser(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/users/${uid}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data.user;
  },

  async deleteAdminUser(uid: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/users/${uid}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
  },

  // ASSISTANTS
  async getAssistants(): Promise<Assistant[]> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/assistants', { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch assistants');
    return data.assistants;
  },

  async saveAssistant(assistant: Assistant): Promise<Assistant> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/assistants', {
      method: 'POST',
      headers,
      body: JSON.stringify(assistant),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save assistant');
    return data.assistant;
  },

  async deleteAssistant(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/assistants/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete assistant');
  },

  // TRAINING RULES
  async getTrainingRules(assistantId?: string): Promise<TrainingRule[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/training-rules?assistantId=${assistantId}` : '/api/training-rules';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch training rules');
    return data.rules;
  },

  async saveTrainingRule(rule: TrainingRule): Promise<TrainingRule> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/training-rules', {
      method: 'POST',
      headers,
      body: JSON.stringify(rule),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save training rule');
    return data.rule;
  },

  async deleteTrainingRule(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/training-rules/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete training rule');
  },

  // SKILLS
  async getSkills(assistantId?: string): Promise<Skill[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/skills?assistantId=${assistantId}` : '/api/skills';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch skills');
    return data.skills;
  },

  async saveSkill(skill: Skill): Promise<Skill> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers,
      body: JSON.stringify(skill),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save skill');
    return data.skill;
  },

  async deleteSkill(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete skill');
  },

  // SOPS
  async getSops(assistantId?: string): Promise<SOP[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/sops?assistantId=${assistantId}` : '/api/sops';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch sops');
    return data.sops;
  },

  async saveSop(sop: SOP): Promise<SOP> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/sops', {
      method: 'POST',
      headers,
      body: JSON.stringify(sop),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save sop');
    return data.sop;
  },

  async deleteSop(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/sops/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete sop');
  },

  // MEMORIES
  async getMemories(assistantId?: string): Promise<Memory[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/memories?assistantId=${assistantId}` : '/api/memories';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch memories');
    return data.memories;
  },

  async saveMemory(memory: Memory): Promise<Memory> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers,
      body: JSON.stringify(memory),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save memory');
    return data.memory;
  },

  async deleteMemory(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/memories/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete memory');
  },

  // AUTOMATIONS
  async getAutomations(assistantId?: string): Promise<AutomationItem[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/automations?assistantId=${assistantId}` : '/api/automations';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch automations');
    return data.automations;
  },

  async saveAutomation(automation: AutomationItem): Promise<AutomationItem> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers,
      body: JSON.stringify(automation),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save automation');
    return data.automation;
  },

  async deleteAutomation(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/automations/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete automation');
  },

  // TEST CASES
  async getTestCases(assistantId?: string): Promise<TestCase[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/test-cases?assistantId=${assistantId}` : '/api/test-cases';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch test cases');
    return data.testCases;
  },

  async saveTestCase(testCase: TestCase): Promise<TestCase> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/test-cases', {
      method: 'POST',
      headers,
      body: JSON.stringify(testCase),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save test case');
    return data.testCase;
  },

  // ACTIVITY LOGS
  async getActivityLogs(assistantId?: string): Promise<any[]> {
    const headers = await getAuthHeader();
    const url = assistantId ? `/api/activity-logs?assistantId=${assistantId}` : '/api/activity-logs';
    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch activity logs');
    return data.logs;
  },

  async addActivityLog(log: any): Promise<any> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/activity-logs', {
      method: 'POST',
      headers,
      body: JSON.stringify(log),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save activity log');
    return data.log;
  },

  // TOOLS CONFIG
  async getToolsConfigs(): Promise<any[]> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/tools-config', { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch tools configs');
    return data.configs;
  },

  async saveToolConfig(toolKey: string, status: string, config?: any): Promise<any> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/tools-config', {
      method: 'POST',
      headers,
      body: JSON.stringify({ toolKey, status, config }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save tool config');
    return data.toolConfig;
  },
};
