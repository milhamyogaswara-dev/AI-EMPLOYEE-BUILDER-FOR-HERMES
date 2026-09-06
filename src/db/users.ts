import { db } from './index.ts';
import { users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoURL?: string) {
  try {
    const isSuperAdmin = email?.toLowerCase() === 'milhamyogaswara@gmail.com';
    const existing = await db.select().from(users).where(eq(users.uid, uid));

    if (existing.length > 0) {
      const user = existing[0];
      if (isSuperAdmin && (user.role !== 'admin' || user.accountStatus !== 'active')) {
        const updated = await db.update(users).set({
          role: 'admin',
          accountStatus: 'active',
          updatedAt: new Date(),
        }).where(eq(users.uid, uid)).returning();
        return updated[0];
      }
      return user;
    }

    const defaultSub = {
      plan: isSuperAdmin ? 'ENTERPRISE' : 'FREE',
      status: isSuperAdmin ? 'ACTIVE' : 'PENDING',
      maxAgents: isSuperAdmin ? 100 : 1,
      maxTokens: isSuperAdmin ? 10000000 : 10000,
      tokensUsed: 0,
      features: {
        customEndpoints: true,
        priorityTraining: isSuperAdmin,
        unlimitedMemory: isSuperAdmin,
        exportIntegration: true,
      },
      startDate: new Date().toISOString(),
      expiresAt: null,
      notes: isSuperAdmin ? 'Primary Project Admin' : 'Self-registered user pending admin authorization.',
    };

    const inserted = await db.insert(users).values({
      id: uid,
      uid,
      email: email.toLowerCase(),
      name: displayName || email.split('@')[0] || 'User',
      avatarUrl: photoURL || '',
      role: isSuperAdmin ? 'admin' : 'user',
      accountStatus: isSuperAdmin ? 'active' : 'pending',
      subscription: defaultSub,
      company: '',
      industry: '',
      products: '',
      targetMarket: '',
      website: '',
      primaryWork: '',
      addressStyle: 'Bapak/Ibu',
      communicationPref: 'BALANCED',
      responseStyles: [],
      appLanguage: 'ID',
      appTheme: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email: email.toLowerCase(),
        name: displayName || email.split('@')[0] || 'User',
        lastLoginAt: new Date(),
      }
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database getOrCreateUser failed', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('Database getAllUsers failed:', error);
    throw new Error('Database getAllUsers failed', { cause: error });
  }
}

export async function getUserByIdOrUid(uid: string) {
  try {
    const res = await db.select().from(users).where(eq(users.uid, uid));
    return res[0] || null;
  } catch (error) {
    console.error('Database getUserByIdOrUid failed:', error);
    throw new Error('Database getUserByIdOrUid failed', { cause: error });
  }
}

export async function updateUserProfile(uid: string, updates: Partial<typeof users.$inferInsert>) {
  try {
    const res = await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Database updateUserProfile failed:', error);
    throw new Error('Database updateUserProfile failed', { cause: error });
  }
}

export async function adminUpsertUser(payload: typeof users.$inferInsert) {
  try {
    const res = await db.insert(users)
      .values(payload)
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name: payload.name,
          role: payload.role,
          accountStatus: payload.accountStatus,
          subscription: payload.subscription,
          updatedAt: new Date(),
        }
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('Database adminUpsertUser failed:', error);
    throw new Error('Database adminUpsertUser failed', { cause: error });
  }
}

export async function deleteUserByUid(uid: string) {
  try {
    return await db.delete(users).where(eq(users.uid, uid)).returning();
  } catch (error) {
    console.error('Database deleteUserByUid failed:', error);
    throw new Error('Database deleteUserByUid failed', { cause: error });
  }
}
