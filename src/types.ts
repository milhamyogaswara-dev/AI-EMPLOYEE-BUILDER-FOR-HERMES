export type AssistantStatus = 'DRAFT' | 'TRAINING' | 'TESTING' | 'READY_TO_DEPLOY' | 'DEPLOYED';

export type AuthorityLevel = 'ASSIST_MODE' | 'SEMI_AUTONOMOUS' | 'AUTONOMOUS';

export type WorkingStyleIncomplete = 'ASK_FIRST' | 'ASSUME_EXPLAIN' | 'RESEARCH_FIRST';
export type WorkingStyleRecommendation = 'BEST_ONE' | 'THREE_OPTIONS' | 'FULL_COMPARISON';

export type RuleType = 
  | 'BEHAVIOR RULE' 
  | 'USER PREFERENCE' 
  | 'BUSINESS KNOWLEDGE' 
  | 'SOP' 
  | 'SKILL' 
  | 'RESTRICTION';

export type MemoryCategory = 
  | 'ABOUT_ME' 
  | 'BUSINESS' 
  | 'PRODUCTS' 
  | 'PROJECTS' 
  | 'DECISIONS' 
  | 'RULES' 
  | 'CUSTOM';

export type PermissionLevel = 'GREEN' | 'YELLOW' | 'RED';
export type AuthorityTier = PermissionLevel;

export type RiskLevel = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';

export type ToolCategory = 'Core' | 'Communication' | 'Productivity' | 'Automation' | 'Development' | 'All';

export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE' | 'UNLIMITED_VIP';
export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxAgents: number;
  maxTokens: number;
  tokensUsed?: number;
  features: {
    customEndpoints: boolean;
    priorityTraining: boolean;
    unlimitedMemory: boolean;
    exportIntegration: boolean;
  };
  startDate?: string;
  expiresAt?: string | null;
  authorizedBy?: string;
  authorizedAt?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: 'admin' | 'user' | string;
  accountStatus?: 'pending' | 'active' | 'rejected' | 'suspended' | string;
  subscription?: UserSubscription;
  createdAt?: any;
  lastLoginAt?: any;
  company: string;
  industry: string;
  products: string;
  targetMarket: string;
  website: string;
  primaryWork: string;
  addressStyle: string; // e.g. "Pak Ilham"
  communicationPref: 'VERY_CONCISE' | 'CONCISE' | 'BALANCED' | 'DETAILED';
  responseStyles: string[];
  appLanguage?: 'EN' | 'ID';
  appTheme?: 'dark' | 'light';
}

export interface AssistantWorkingStyle {
  incompleteInfo: WorkingStyleIncomplete;
  recommendationStyle: WorkingStyleRecommendation;
  riskBehavior: 'ALWAYS_ASK_APPROVAL';
  confidenceBehavior: 'EXPLAIN_UNCERTAINTY';
}

export interface AssistantHermesConfig {
  endpoint: string;
  maskedApiKey?: string;
  hasApiKey: boolean;
  agentId?: string;
  isConnected: boolean;
  lastConnectedAt?: string;
  lastLatencyMs?: number;
}

export interface Assistant {
  id: string;
  name: string;
  role: string;
  mission: string;
  worksFor: 'ME' | 'MY_TEAM' | 'MY_BUSINESS' | 'MY_CLIENTS';
  language: 'INDONESIAN' | 'ENGLISH' | 'MIXED' | 'OTHER';
  avatar: string;
  status: AssistantStatus;
  trainingProgress: number; // 0-100
  testScore: number; // 0-100
  workingStyle: AssistantWorkingStyle;
  authorityLevel: AuthorityLevel;
  responsibilities: string[];
  hermesConfig: AssistantHermesConfig;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingRule {
  id: string;
  assistantId: string;
  title: string;
  rule: string;
  type: RuleType;
  destination: string;
  source: 'MANUAL' | 'TRAINING_CENTER' | 'CORRECTION' | 'WIZARD' | 'TEST_LAB_FEEDBACK';
  createdAt: string;
}

export interface Skill {
  id: string;
  assistantId: string;
  name: string;
  description: string;
  trigger: string;
  requiredInputs: string[];
  instructions: string[];
  toolsNeeded: string[];
  outputFormat: string;
  relatedSopId?: string;
  testScore: number;
  version: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  usedCount: number;
  lastUpdated: string;
}

export interface SOP {
  id: string;
  assistantId: string;
  name: string;
  purpose: string;
  trigger: string;
  requiredInput: string[];
  workflowSteps: string[];
  decisionRules: string[];
  outputFormat: string;
  approvalRequirement: string;
  errorHandling: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  assistantId: string;
  category: MemoryCategory;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  conflictFlag?: {
    hasConflict: boolean;
    conflictingMemoryId?: string;
    note: string;
  };
}

export interface AuthorityPermission {
  id: string;
  assistantId: string;
  actionKey: string;
  actionLabel: string;
  category: 'RESEARCH' | 'FILES' | 'COMMUNICATION' | 'OPERATIONS' | 'FINANCE' | 'SECURITY';
  level: PermissionLevel;
  description: string;
}

export interface AuthorityAction {
  id: string;
  key?: string;
  title: string;
  description: string;
  tier: AuthorityTier;
  category: string;
}

export interface ToolItem {
  id: string;
  key: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  status: 'CONNECTED' | 'NOT_CONNECTED' | 'NEEDS_SETUP' | 'RECOMMENDED';
  isRecommendedForAssistant?: boolean;
  recommendedReason?: string;
  configFields?: Record<string, string>;
  config?: Record<string, any>;
}

export interface AutomationItem {
  id: string;
  assistantId: string;
  name: string;
  naturalLanguagePrompt?: string;
  description?: string;
  schedule: string;
  time?: string;
  cronExpression: string;
  workflowSteps?: string[];
  deliveryChannel?: string;
  channel?: string;
  action?: string;
  riskLevel?: RiskLevel;
  riskExplanation?: string;
  requiresApproval?: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  lastRun?: string;
  nextRun?: string;
}

export interface TestScoreBreakdown {
  instructionFollowing: number;
  accuracy: number;
  communication: number;
  safety: number;
  overall: number;
}

export interface TestCase {
  id: string;
  assistantId: string;
  title: string;
  type: 'QUICK' | 'SKILL' | 'SOP' | 'BEHAVIOR' | 'FULL';
  skillId?: string;
  sopId?: string;
  prompt: string;
  sampleData?: string;
  lastRunAt?: string;
  lastScores?: TestScoreBreakdown;
  lastResponse?: string;
  lastFeedback?: string;
  lastVerdict?: 'GOOD' | 'NEEDS_IMPROVEMENT';
}

export interface ActivityLog {
  id: string;
  assistantId?: string;
  timestamp: string;
  text: string;
  type: 'TRAINING' | 'SKILL' | 'SOP' | 'TEST' | 'AUTOMATION' | 'DEPLOY' | 'AUTHORITY';
}

export interface AssistantTemplate {
  id: string;
  name: string;
  role: string;
  icon: string;
  avatar?: string;
  description: string;
  recommendedSkills: string[];
  defaultResponsibilities: string[];
  defaultMission: string;
  defaultRules: string[];
  defaultLanguage: 'INDONESIAN' | 'ENGLISH' | 'MIXED';
}
