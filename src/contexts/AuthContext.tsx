import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, browserLocalPersistence, setPersistence, db, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from '../lib/firebase';
import { checkQuotaStatus, markQuotaExhausted, isQuotaError, sanitizeForFirestore } from '../utils/firestoreStorage';
import { UserProfile, UserSubscription } from '../types';
import { getLocalUser, upsertLocalUser } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeProfile = (user: User, data: any): UserProfile => {
    const isSuperAdmin = user.email?.toLowerCase() === 'milhamyogaswara@gmail.com';
    const role = isSuperAdmin ? 'admin' : (data?.role || 'user');
    const accountStatus = isSuperAdmin ? 'active' : (data?.accountStatus || 'pending');

    const defaultSubscription: UserSubscription = {
      plan: isSuperAdmin ? 'ENTERPRISE' : (data?.subscription?.plan || 'FREE'),
      status: isSuperAdmin ? 'ACTIVE' : (data?.subscription?.status || (accountStatus === 'active' ? 'ACTIVE' : 'PENDING')),
      maxAgents: isSuperAdmin ? 50 : (data?.subscription?.maxAgents || 1),
      maxTokens: isSuperAdmin ? 2000000 : (data?.subscription?.maxTokens || 10000),
      tokensUsed: data?.subscription?.tokensUsed || 0,
      features: {
        customEndpoints: true,
        priorityTraining: isSuperAdmin,
        unlimitedMemory: isSuperAdmin,
        exportIntegration: true,
      },
      startDate: data?.subscription?.startDate || new Date().toISOString(),
      expiresAt: data?.subscription?.expiresAt || null,
      authorizedBy: data?.subscription?.authorizedBy || (isSuperAdmin ? 'System Admin' : ''),
      authorizedAt: data?.subscription?.authorizedAt || (isSuperAdmin ? new Date().toISOString() : ''),
      notes: data?.subscription?.notes || '',
    };

    return {
      id: user.uid,
      name: data?.displayName || data?.name || user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatarUrl: data?.photoURL || data?.avatarUrl || user.photoURL || '',
      role,
      accountStatus,
      subscription: data?.subscription || defaultSubscription,
      createdAt: data?.createdAt,
      lastLoginAt: data?.lastLoginAt,
      company: data?.appPreferences?.company || data?.company || '',
      industry: data?.appPreferences?.industry || data?.industry || '',
      products: data?.products || '',
      targetMarket: data?.appPreferences?.targetMarket || data?.targetMarket || '',
      website: data?.website || '',
      primaryWork: data?.primaryWork || '',
      addressStyle: data?.appPreferences?.addressStyle || data?.addressStyle || 'Bapak/Ibu',
      communicationPref: data?.appPreferences?.communicationPref || data?.communicationPref || 'BALANCED',
      responseStyles: data?.responseStyles || [],
      appLanguage: data?.appPreferences?.language || data?.appLanguage || 'ID',
      appTheme: data?.appPreferences?.theme || data?.appTheme || 'dark',
    };
  };

  const syncUserProfile = async (user: User) => {
    const isSuperAdmin = user.email?.toLowerCase() === 'milhamyogaswara@gmail.com';
    const localCached = getLocalUser(user.uid) || (user.email ? getLocalUser(user.email) : null);
    if (localCached) {
      setUserProfile(normalizeProfile(user, localCached));
    }

    const userRef = doc(db, 'users', user.uid);

    try {
      if (checkQuotaStatus()) {
        if (!localCached) {
          const fallback = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatarUrl: user.photoURL || '',
            role: isSuperAdmin ? 'admin' : 'user',
            accountStatus: isSuperAdmin ? 'active' : 'pending',
          };
          upsertLocalUser(fallback);
          setUserProfile(normalizeProfile(user, fallback));
        }
        return;
      }

      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const profile = normalizeProfile(user, data);
        setUserProfile(profile);
        upsertLocalUser(profile);

        // If superadmin needs role or accountStatus synced in Firestore
        if (isSuperAdmin && (data.role !== 'admin' || data.accountStatus !== 'active')) {
          if (!checkQuotaStatus()) {
            await setDoc(userRef, sanitizeForFirestore({ 
              role: 'admin', 
              accountStatus: 'active',
              email: user.email,
              displayName: data.displayName || user.displayName || 'Admin',
              updatedAt: serverTimestamp() 
            }), { merge: true }).catch((err) => {
              if (isQuotaError(err)) markQuotaExhausted();
              console.warn('Superadmin sync warning:', err);
            });
          }
        }
      } else {
        // Check if admin pre-authorized this email
        let preAuthData: any = localCached || null;
        if (user.email) {
          try {
            const emailKey = user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
            const emailRef = doc(db, 'users', emailKey);
            const emailSnap = await getDoc(emailRef);
            if (emailSnap.exists()) {
              preAuthData = emailSnap.data();
            }
          } catch (e) {
            if (isQuotaError(e)) markQuotaExhausted();
          }
        }

        const initialStatus = preAuthData?.accountStatus || (isSuperAdmin ? 'active' : 'pending');
        const initialRole = preAuthData?.role || (isSuperAdmin ? 'admin' : 'user');

        const defaultSubscription = preAuthData?.subscription || {
          plan: isSuperAdmin ? 'ENTERPRISE' : 'FREE',
          status: isSuperAdmin ? 'ACTIVE' : 'PENDING',
          maxAgents: isSuperAdmin ? 50 : 1,
          maxTokens: isSuperAdmin ? 2000000 : 10000,
          tokensUsed: 0,
          features: {
            customEndpoints: true,
            priorityTraining: isSuperAdmin,
            unlimitedMemory: isSuperAdmin,
            exportIntegration: true,
          },
          startDate: new Date().toISOString(),
          expiresAt: null,
          authorizedBy: isSuperAdmin ? 'System Admin' : '',
          authorizedAt: isSuperAdmin ? new Date().toISOString() : '',
          notes: isSuperAdmin ? 'Superadmin Master Account' : 'Self-registered user pending admin authorization.',
        };

        const newProfile = {
          uid: user.uid,
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || preAuthData?.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || preAuthData?.photoURL || '',
          provider: user.providerData?.[0]?.providerId || 'google',
          role: initialRole,
          accountStatus: initialStatus,
          subscription: defaultSubscription,
          createdAt: preAuthData?.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          onboardingCompleted: preAuthData?.onboardingCompleted || false,
          appPreferences: preAuthData?.appPreferences || {
            addressStyle: 'Bapak/Ibu',
            company: '',
            industry: '',
            targetMarket: '',
            communicationPref: 'BALANCED',
            theme: 'dark',
            language: 'ID',
          }
        };

        const normalized = normalizeProfile(user, newProfile);
        setUserProfile(normalized);
        upsertLocalUser(normalized);

        if (!checkQuotaStatus()) {
          const sanitized = sanitizeForFirestore(newProfile);
          await setDoc(userRef, sanitized, { merge: true }).catch(err => {
            if (isQuotaError(err)) markQuotaExhausted();
          });
          if (user.email) {
            const emailKey = user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
            if (emailKey !== user.uid) {
              await setDoc(doc(db, 'users', emailKey), sanitized, { merge: true }).catch(err => {
                if (isQuotaError(err)) markQuotaExhausted();
              });
            }
          }
        }
      }
    } catch (err) {
      if (isQuotaError(err)) markQuotaExhausted();
      console.warn('User profile sync notice:', err);
      // Fallback create write
      const fallbackProfile = localCached || {
        uid: user.uid,
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        provider: user.providerData?.[0]?.providerId || 'google',
        role: isSuperAdmin ? 'admin' : 'user',
        accountStatus: isSuperAdmin ? 'active' : 'pending',
        subscription: {
          plan: isSuperAdmin ? 'ENTERPRISE' : 'FREE',
          status: isSuperAdmin ? 'ACTIVE' : 'PENDING',
          maxAgents: isSuperAdmin ? 50 : 1,
          maxTokens: isSuperAdmin ? 2000000 : 10000,
          tokensUsed: 0,
          features: {
            customEndpoints: true,
            priorityTraining: isSuperAdmin,
            unlimitedMemory: isSuperAdmin,
            exportIntegration: true,
          },
          startDate: new Date().toISOString(),
          expiresAt: null,
          authorizedBy: isSuperAdmin ? 'System Admin' : '',
          authorizedAt: isSuperAdmin ? new Date().toISOString() : '',
          notes: isSuperAdmin ? 'Superadmin Master Account' : 'Self-registered user pending admin authorization.',
        }
      };

      const normalized = normalizeProfile(user, fallbackProfile);
      upsertLocalUser(normalized);
      setUserProfile(normalized);
    }
  };

  const updateLoginTime = async (user: User) => {
    if (checkQuotaStatus()) return;
    try {
      const sessionKey = `hermes_login_synced_${user.uid}`;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, 'true');
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      if (isQuotaError(e)) markQuotaExhausted();
      console.warn("Skipping login timestamp sync (offline or quota mode):", e);
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await syncUserProfile(currentUser);
    }
  };

  useEffect(() => {
    let mounted = true;
    let unsubSnapshot: (() => void) | null = null;
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (mounted) setCurrentUser(user);
        await syncUserProfile(user);
        await updateLoginTime(user);

        // Realtime listener for profile updates (e.g., when Admin approves or changes role/subscription)
        try {
          const userRef = doc(db, 'users', user.uid);
          unsubSnapshot = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists() && mounted) {
              const data = snapshot.data();
              setUserProfile((prev) => {
                const updated = normalizeProfile(user, data);
                // Avoid redundant re-renders if key data is identical
                if (
                  prev &&
                  prev.role === updated.role &&
                  prev.accountStatus === updated.accountStatus &&
                  prev.subscription?.plan === updated.subscription?.plan &&
                  prev.subscription?.status === updated.subscription?.status &&
                  prev.subscription?.maxAgents === updated.subscription?.maxAgents &&
                  prev.subscription?.maxTokens === updated.subscription?.maxTokens &&
                  prev.name === updated.name &&
                  JSON.stringify(prev.company) === JSON.stringify(updated.company)
                ) {
                  return prev;
                }
                return updated;
              });
            }
          }, (err) => {
            console.warn("Profile snapshot listener error (falling back to cached profile):", err);
          });
        } catch (listenerErr) {
          console.warn("Could not attach profile snapshot listener:", listenerErr);
        }
      } else {
        if (unsubSnapshot) unsubSnapshot();
        if (mounted) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      if (unsubSnapshot) unsubSnapshot();
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
