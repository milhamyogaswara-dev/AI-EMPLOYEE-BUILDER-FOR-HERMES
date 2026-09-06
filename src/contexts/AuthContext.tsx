import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChanged, browserLocalPersistence, setPersistence } from '../lib/firebase';
import { UserProfile, UserSubscription } from '../types';
import { getLocalUser, upsertLocalUser } from '../utils/storage';
import { apiClient } from '../services/apiClient';

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
      maxAgents: isSuperAdmin ? 100 : (data?.subscription?.maxAgents || 1),
      maxTokens: isSuperAdmin ? 10000000 : (data?.subscription?.maxTokens || 10000),
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
      name: data?.name || data?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatarUrl: data?.avatarUrl || data?.photoURL || user.photoURL || '',
      role,
      accountStatus,
      subscription: data?.subscription || defaultSubscription,
      createdAt: data?.createdAt,
      lastLoginAt: data?.lastLoginAt,
      company: data?.company || '',
      industry: data?.industry || '',
      products: data?.products || '',
      targetMarket: data?.targetMarket || '',
      website: data?.website || '',
      primaryWork: data?.primaryWork || '',
      addressStyle: data?.addressStyle || 'Bapak/Ibu',
      communicationPref: data?.communicationPref || 'BALANCED',
      responseStyles: data?.responseStyles || [],
      appLanguage: data?.appLanguage || 'ID',
      appTheme: data?.appTheme || 'dark',
    };
  };

  const syncUserProfile = async (user: User) => {
    const isSuperAdmin = user.email?.toLowerCase() === 'milhamyogaswara@gmail.com';
    const localCached = getLocalUser(user.uid) || (user.email ? getLocalUser(user.email) : null);
    if (localCached) {
      setUserProfile(normalizeProfile(user, localCached));
    }

    try {
      // Call PostgreSQL backend via apiClient
      const dbProfile = await apiClient.syncUser(
        user.displayName || user.email?.split('@')[0] || 'User',
        user.photoURL || ''
      );

      if (dbProfile) {
        const normalized = normalizeProfile(user, dbProfile);
        setUserProfile(normalized);
        upsertLocalUser(normalized);
      }
    } catch (err) {
      console.warn('PostgreSQL sync notice (using local cache fallback):', err);
      if (!localCached) {
        const fallback = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatarUrl: user.photoURL || '',
          role: isSuperAdmin ? 'admin' : 'user',
          accountStatus: isSuperAdmin ? 'active' : 'pending',
        };
        const normalized = normalizeProfile(user, fallback);
        upsertLocalUser(normalized);
        setUserProfile(normalized);
      }
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const profile = await apiClient.getUserProfile();
        if (profile) {
          const normalized = normalizeProfile(currentUser, profile);
          setUserProfile(normalized);
          upsertLocalUser(normalized);
        }
      } catch (e) {
        console.warn('refreshProfile error:', e);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (mounted) setCurrentUser(user);
        await syncUserProfile(user);
      } else {
        if (mounted) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
