import { db } from './index.ts';
import { 
  assistants, 
  trainingRules, 
  skills, 
  sops, 
  memories, 
  automations, 
  testCases, 
  activityLogs, 
  toolsConfig 
} from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

// ASSISTANTS
export async function getAssistantsByUserId(userId: string) {
  try {
    return await db.select().from(assistants).where(eq(assistants.userId, userId)).orderBy(desc(assistants.createdAt));
  } catch (error) {
    console.error('getAssistantsByUserId error:', error);
    throw new Error('Failed to fetch assistants', { cause: error });
  }
}

export async function upsertAssistant(data: typeof assistants.$inferInsert) {
  try {
    const res = await db.insert(assistants)
      .values(data)
      .onConflictDoUpdate({
        target: assistants.id,
        set: {
          name: data.name,
          role: data.role,
          mission: data.mission,
          worksFor: data.worksFor,
          language: data.language,
          avatar: data.avatar,
          status: data.status,
          trainingProgress: data.trainingProgress,
          testScore: data.testScore,
          workingStyle: data.workingStyle,
          authorityLevel: data.authorityLevel,
          responsibilities: data.responsibilities,
          hermesConfig: data.hermesConfig,
          updatedAt: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertAssistant error:', error);
    throw new Error('Failed to save assistant', { cause: error });
  }
}

export async function deleteAssistant(id: string, userId: string) {
  try {
    return await db.delete(assistants).where(and(eq(assistants.id, id), eq(assistants.userId, userId))).returning();
  } catch (error) {
    console.error('deleteAssistant error:', error);
    throw new Error('Failed to delete assistant', { cause: error });
  }
}

// TRAINING RULES
export async function getTrainingRules(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(trainingRules)
        .where(and(eq(trainingRules.userId, userId), eq(trainingRules.assistantId, assistantId)))
        .orderBy(desc(trainingRules.createdAt));
    }
    return await db.select().from(trainingRules).where(eq(trainingRules.userId, userId)).orderBy(desc(trainingRules.createdAt));
  } catch (error) {
    console.error('getTrainingRules error:', error);
    throw new Error('Failed to fetch training rules', { cause: error });
  }
}

export async function upsertTrainingRule(data: typeof trainingRules.$inferInsert) {
  try {
    const res = await db.insert(trainingRules)
      .values(data)
      .onConflictDoUpdate({
        target: trainingRules.id,
        set: {
          title: data.title,
          rule: data.rule,
          type: data.type,
          destination: data.destination,
          source: data.source,
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertTrainingRule error:', error);
    throw new Error('Failed to save training rule', { cause: error });
  }
}

export async function deleteTrainingRule(id: string, userId: string) {
  try {
    return await db.delete(trainingRules).where(and(eq(trainingRules.id, id), eq(trainingRules.userId, userId))).returning();
  } catch (error) {
    console.error('deleteTrainingRule error:', error);
    throw new Error('Failed to delete training rule', { cause: error });
  }
}

// SKILLS
export async function getSkills(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(skills)
        .where(and(eq(skills.userId, userId), eq(skills.assistantId, assistantId)))
        .orderBy(desc(skills.lastUpdated));
    }
    return await db.select().from(skills).where(eq(skills.userId, userId)).orderBy(desc(skills.lastUpdated));
  } catch (error) {
    console.error('getSkills error:', error);
    throw new Error('Failed to fetch skills', { cause: error });
  }
}

export async function upsertSkill(data: typeof skills.$inferInsert) {
  try {
    const res = await db.insert(skills)
      .values(data)
      .onConflictDoUpdate({
        target: skills.id,
        set: {
          name: data.name,
          description: data.description,
          trigger: data.trigger,
          requiredInputs: data.requiredInputs,
          instructions: data.instructions,
          toolsNeeded: data.toolsNeeded,
          outputFormat: data.outputFormat,
          relatedSopId: data.relatedSopId,
          testScore: data.testScore,
          version: data.version,
          status: data.status,
          usedCount: data.usedCount,
          lastUpdated: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertSkill error:', error);
    throw new Error('Failed to save skill', { cause: error });
  }
}

export async function deleteSkill(id: string, userId: string) {
  try {
    return await db.delete(skills).where(and(eq(skills.id, id), eq(skills.userId, userId))).returning();
  } catch (error) {
    console.error('deleteSkill error:', error);
    throw new Error('Failed to delete skill', { cause: error });
  }
}

// SOPS
export async function getSops(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(sops)
        .where(and(eq(sops.userId, userId), eq(sops.assistantId, assistantId)))
        .orderBy(desc(sops.createdAt));
    }
    return await db.select().from(sops).where(eq(sops.userId, userId)).orderBy(desc(sops.createdAt));
  } catch (error) {
    console.error('getSops error:', error);
    throw new Error('Failed to fetch sops', { cause: error });
  }
}

export async function upsertSop(data: typeof sops.$inferInsert) {
  try {
    const res = await db.insert(sops)
      .values(data)
      .onConflictDoUpdate({
        target: sops.id,
        set: {
          name: data.name,
          purpose: data.purpose,
          trigger: data.trigger,
          requiredInput: data.requiredInput,
          workflowSteps: data.workflowSteps,
          decisionRules: data.decisionRules,
          outputFormat: data.outputFormat,
          approvalRequirement: data.approvalRequirement,
          errorHandling: data.errorHandling,
          updatedAt: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertSop error:', error);
    throw new Error('Failed to save sop', { cause: error });
  }
}

export async function deleteSop(id: string, userId: string) {
  try {
    return await db.delete(sops).where(and(eq(sops.id, id), eq(sops.userId, userId))).returning();
  } catch (error) {
    console.error('deleteSop error:', error);
    throw new Error('Failed to delete sop', { cause: error });
  }
}

// MEMORIES
export async function getMemories(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(memories)
        .where(and(eq(memories.userId, userId), eq(memories.assistantId, assistantId)))
        .orderBy(desc(memories.createdAt));
    }
    return await db.select().from(memories).where(eq(memories.userId, userId)).orderBy(desc(memories.createdAt));
  } catch (error) {
    console.error('getMemories error:', error);
    throw new Error('Failed to fetch memories', { cause: error });
  }
}

export async function upsertMemory(data: typeof memories.$inferInsert) {
  try {
    const res = await db.insert(memories)
      .values(data)
      .onConflictDoUpdate({
        target: memories.id,
        set: {
          category: data.category,
          title: data.title,
          content: data.content,
          tags: data.tags,
          isArchived: data.isArchived,
          conflictFlag: data.conflictFlag,
          updatedAt: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertMemory error:', error);
    throw new Error('Failed to save memory', { cause: error });
  }
}

export async function deleteMemory(id: string, userId: string) {
  try {
    return await db.delete(memories).where(and(eq(memories.id, id), eq(memories.userId, userId))).returning();
  } catch (error) {
    console.error('deleteMemory error:', error);
    throw new Error('Failed to delete memory', { cause: error });
  }
}

// AUTOMATIONS
export async function getAutomations(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(automations)
        .where(and(eq(automations.userId, userId), eq(automations.assistantId, assistantId)))
        .orderBy(desc(automations.createdAt));
    }
    return await db.select().from(automations).where(eq(automations.userId, userId)).orderBy(desc(automations.createdAt));
  } catch (error) {
    console.error('getAutomations error:', error);
    throw new Error('Failed to fetch automations', { cause: error });
  }
}

export async function upsertAutomation(data: typeof automations.$inferInsert) {
  try {
    const res = await db.insert(automations)
      .values(data)
      .onConflictDoUpdate({
        target: automations.id,
        set: {
          name: data.name,
          naturalLanguagePrompt: data.naturalLanguagePrompt,
          description: data.description,
          schedule: data.schedule,
          time: data.time,
          cronExpression: data.cronExpression,
          workflowSteps: data.workflowSteps,
          deliveryChannel: data.deliveryChannel,
          channel: data.channel,
          action: data.action,
          riskLevel: data.riskLevel,
          riskExplanation: data.riskExplanation,
          requiresApproval: data.requiresApproval,
          status: data.status,
          lastRun: data.lastRun,
          nextRun: data.nextRun,
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertAutomation error:', error);
    throw new Error('Failed to save automation', { cause: error });
  }
}

export async function deleteAutomation(id: string, userId: string) {
  try {
    return await db.delete(automations).where(and(eq(automations.id, id), eq(automations.userId, userId))).returning();
  } catch (error) {
    console.error('deleteAutomation error:', error);
    throw new Error('Failed to delete automation', { cause: error });
  }
}

// TEST CASES
export async function getTestCases(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(testCases)
        .where(and(eq(testCases.userId, userId), eq(testCases.assistantId, assistantId)));
    }
    return await db.select().from(testCases).where(eq(testCases.userId, userId));
  } catch (error) {
    console.error('getTestCases error:', error);
    throw new Error('Failed to fetch test cases', { cause: error });
  }
}

export async function upsertTestCase(data: typeof testCases.$inferInsert) {
  try {
    const res = await db.insert(testCases)
      .values(data)
      .onConflictDoUpdate({
        target: testCases.id,
        set: {
          title: data.title,
          type: data.type,
          skillId: data.skillId,
          sopId: data.sopId,
          prompt: data.prompt,
          sampleData: data.sampleData,
          lastRunAt: data.lastRunAt,
          lastScores: data.lastScores,
          lastResponse: data.lastResponse,
          lastFeedback: data.lastFeedback,
          lastVerdict: data.lastVerdict,
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertTestCase error:', error);
    throw new Error('Failed to save test case', { cause: error });
  }
}

// ACTIVITY LOGS
export async function getActivityLogs(userId: string, assistantId?: string) {
  try {
    if (assistantId) {
      return await db.select().from(activityLogs)
        .where(and(eq(activityLogs.userId, userId), eq(activityLogs.assistantId, assistantId)))
        .orderBy(desc(activityLogs.timestamp));
    }
    return await db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.timestamp));
  } catch (error) {
    console.error('getActivityLogs error:', error);
    throw new Error('Failed to fetch activity logs', { cause: error });
  }
}

export async function insertActivityLog(data: typeof activityLogs.$inferInsert) {
  try {
    const res = await db.insert(activityLogs).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('insertActivityLog error:', error);
    throw new Error('Failed to save activity log', { cause: error });
  }
}

// TOOLS CONFIG
export async function getToolsConfigs(userId: string) {
  try {
    return await db.select().from(toolsConfig).where(eq(toolsConfig.userId, userId));
  } catch (error) {
    console.error('getToolsConfigs error:', error);
    throw new Error('Failed to fetch tools configs', { cause: error });
  }
}

export async function upsertToolConfig(data: typeof toolsConfig.$inferInsert) {
  try {
    const res = await db.insert(toolsConfig)
      .values(data)
      .onConflictDoUpdate({
        target: toolsConfig.id,
        set: {
          status: data.status,
          config: data.config,
          updatedAt: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('upsertToolConfig error:', error);
    throw new Error('Failed to save tool config', { cause: error });
  }
}
