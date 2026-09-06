import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// Users & Subscription table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase Auth UID or normalized key
  uid: text('uid').notNull().unique(), // Firebase UID
  email: text('email').notNull(),
  name: text('name').default(''),
  avatarUrl: text('avatar_url').default(''),
  role: text('role').default('user').notNull(),
  accountStatus: text('account_status').default('pending').notNull(),
  subscription: jsonb('subscription'),
  company: text('company').default(''),
  industry: text('industry').default(''),
  products: text('products').default(''),
  targetMarket: text('target_market').default(''),
  website: text('website').default(''),
  primaryWork: text('primary_work').default(''),
  addressStyle: text('address_style').default('Bapak/Ibu'),
  communicationPref: text('communication_pref').default('BALANCED'),
  responseStyles: jsonb('response_styles').$type<string[]>().default([]),
  appLanguage: text('app_language').default('ID'),
  appTheme: text('app_theme').default('dark'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at').defaultNow(),
});

// Assistants Table
export const assistants = pgTable('assistants', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  role: text('role').default(''),
  mission: text('mission').default(''),
  worksFor: text('works_for').default('ME'),
  language: text('language').default('INDONESIAN'),
  avatar: text('avatar').default(''),
  status: text('status').default('DRAFT'),
  trainingProgress: integer('training_progress').default(0),
  testScore: integer('test_score').default(0),
  workingStyle: jsonb('working_style'),
  authorityLevel: text('authority_level').default('ASSIST_MODE'),
  responsibilities: jsonb('responsibilities').$type<string[]>().default([]),
  hermesConfig: jsonb('hermes_config'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Training Rules Table
export const trainingRules = pgTable('training_rules', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  title: text('title').notNull(),
  rule: text('rule').notNull(),
  type: text('type').default('BEHAVIOR RULE'),
  destination: text('destination').default(''),
  source: text('source').default('MANUAL'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Skills Table
export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  name: text('name').notNull(),
  description: text('description').default(''),
  trigger: text('trigger').default(''),
  requiredInputs: jsonb('required_inputs').$type<string[]>().default([]),
  instructions: jsonb('instructions').$type<string[]>().default([]),
  toolsNeeded: jsonb('tools_needed').$type<string[]>().default([]),
  outputFormat: text('output_format').default(''),
  relatedSopId: text('related_sop_id'),
  testScore: integer('test_score').default(0),
  version: text('version').default('v1.0'),
  status: text('status').default('ACTIVE'),
  usedCount: integer('used_count').default(0),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Standard Operating Procedures (SOPs) Table
export const sops = pgTable('sops', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  name: text('name').notNull(),
  purpose: text('purpose').default(''),
  trigger: text('trigger').default(''),
  requiredInput: jsonb('required_input').$type<string[]>().default([]),
  workflowSteps: jsonb('workflow_steps').$type<string[]>().default([]),
  decisionRules: jsonb('decision_rules').$type<string[]>().default([]),
  outputFormat: text('output_format').default(''),
  approvalRequirement: text('approval_requirement').default(''),
  errorHandling: text('error_handling').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Memory Engine Table
export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  category: text('category').default('ABOUT_ME'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  isArchived: boolean('is_archived').default(false),
  conflictFlag: jsonb('conflict_flag'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Automations Table
export const automations = pgTable('automations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  name: text('name').notNull(),
  naturalLanguagePrompt: text('natural_language_prompt'),
  description: text('description').default(''),
  schedule: text('schedule').default(''),
  time: text('time').default(''),
  cronExpression: text('cron_expression').default(''),
  workflowSteps: jsonb('workflow_steps').$type<string[]>().default([]),
  deliveryChannel: text('delivery_channel').default(''),
  channel: text('channel').default(''),
  action: text('action').default(''),
  riskLevel: text('risk_level').default('LOW RISK'),
  riskExplanation: text('risk_explanation'),
  requiresApproval: boolean('requires_approval').default(false),
  status: text('status').default('ACTIVE'),
  lastRun: text('last_run'),
  nextRun: text('next_run'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Test Cases Table
export const testCases = pgTable('test_cases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id').notNull(),
  title: text('title').notNull(),
  type: text('type').default('QUICK'),
  skillId: text('skill_id'),
  sopId: text('sop_id'),
  prompt: text('prompt').notNull(),
  sampleData: text('sample_data'),
  lastRunAt: text('last_run_at'),
  lastScores: jsonb('last_scores'),
  lastResponse: text('last_response'),
  lastFeedback: text('last_feedback'),
  lastVerdict: text('last_verdict'),
});

// Activity Logs Table
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assistantId: text('assistant_id'),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  target: text('target').default(''),
  status: text('status').default('COMPLETED'),
  timestamp: text('timestamp').notNull(),
  metadata: jsonb('metadata'),
});

// Tools Integration Config Table
export const toolsConfig = pgTable('tools_config', {
  id: text('id').primaryKey(), // userId_toolKey
  userId: text('user_id').notNull(),
  toolKey: text('tool_key').notNull(),
  status: text('status').default('NOT_CONNECTED'),
  config: jsonb('config'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
