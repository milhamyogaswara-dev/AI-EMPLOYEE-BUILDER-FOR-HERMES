import { db, doc, getDoc, setDoc, serverTimestamp } from '../lib/firebase';
import { UserGuideProgress } from '../types';

const LOCAL_STORAGE_KEY = 'hermes_user_guide_progress';

export const DEFAULT_GUIDE_PROGRESS: UserGuideProgress = {
  started: false,
  completed: false,
  currentStep: 1,
  completedSteps: [],
  tourCompleted: false,
  onboardingGuideShown: false,
  lastGuideSection: 'guide_intro_builder',
  beginnerMode: true,
};

/**
 * Load user guide progress from Firestore with localStorage fallback
 */
export async function loadGuideProgress(userId?: string): Promise<UserGuideProgress> {
  // Check local cache first
  let cached: UserGuideProgress | null = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse cached guide progress:', err);
  }

  if (!userId) {
    return cached || DEFAULT_GUIDE_PROGRESS;
  }

  try {
    const ref = doc(db, 'users', userId, 'guideProgress', 'main');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as UserGuideProgress;
      const merged: UserGuideProgress = {
        ...DEFAULT_GUIDE_PROGRESS,
        ...data,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore loadGuideProgress error, using local fallback:', err);
  }

  return cached || DEFAULT_GUIDE_PROGRESS;
}

/**
 * Save user guide progress to Firestore & sync to local cache
 */
export async function saveGuideProgress(
  userId: string | undefined,
  updates: Partial<UserGuideProgress>
): Promise<UserGuideProgress> {
  let current = await loadGuideProgress(userId);
  const updated: UserGuideProgress = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Always update local cache immediately for responsive UI
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage write failed:', e);
  }

  if (!userId) {
    return updated;
  }

  try {
    const ref = doc(db, 'users', userId, 'guideProgress', 'main');
    await setDoc(
      ref,
      {
        ...updated,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore saveGuideProgress failed, kept in local cache:', err);
  }

  return updated;
}

/**
 * Reset guide progress only (preserves all assistant data)
 */
export async function resetGuideProgress(userId?: string): Promise<UserGuideProgress> {
  const resetState: UserGuideProgress = {
    ...DEFAULT_GUIDE_PROGRESS,
    onboardingGuideShown: true, // Don't re-trigger splash unless requested
    beginnerMode: true,
  };
  return await saveGuideProgress(userId, resetState);
}
