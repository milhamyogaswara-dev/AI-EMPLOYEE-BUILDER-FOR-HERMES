import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Mail, Lock, User, Building, Eye, EyeOff, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '../../lib/firebase';
import { sanitizeForFirestore, checkQuotaStatus, markQuotaExhausted, isQuotaError } from '../../utils/firestoreStorage';
import { upsertLocalUser } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync mode with prop when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const isSuperAdmin = res.user.email?.toLowerCase() === 'milhamyogaswara@gmail.com';
        const userRef = doc(db, 'users', res.user.uid);
        const snap = await getDoc(userRef).catch(() => null);
        
        if (!snap || !snap.exists()) {
          let preAuthData: any = null;
          if (res.user.email) {
            try {
              const emailKey = res.user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
              const emailSnap = await getDoc(doc(db, 'users', emailKey));
              if (emailSnap.exists()) preAuthData = emailSnap.data();
            } catch (e) {
              console.warn('Pre-auth check info:', e);
            }
          }

          const defaultSub = preAuthData?.subscription || {
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
            notes: isSuperAdmin ? 'Superadmin Master Account' : 'Self-registered user pending admin authorization.',
          };

          const profilePayload = sanitizeForFirestore({
            uid: res.user.uid,
            id: res.user.uid,
            email: res.user.email || '',
            displayName: res.user.displayName || preAuthData?.displayName || res.user.email?.split('@')[0] || 'User',
            photoURL: res.user.photoURL || preAuthData?.photoURL || '',
            provider: 'google',
            role: preAuthData?.role || (isSuperAdmin ? 'admin' : 'user'),
            accountStatus: preAuthData?.accountStatus || (isSuperAdmin ? 'active' : 'pending'),
            createdAt: preAuthData?.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            subscription: defaultSub,
            appPreferences: preAuthData?.appPreferences || {
              company: '',
              industry: '',
              addressStyle: 'Bapak/Ibu',
              communicationPref: 'BALANCED',
              theme: 'dark',
              language: 'ID',
            }
          });

          upsertLocalUser({
            id: res.user.uid,
            name: res.user.displayName || preAuthData?.displayName || res.user.email?.split('@')[0] || 'User',
            email: res.user.email || '',
            avatarUrl: res.user.photoURL || preAuthData?.photoURL || '',
            role: preAuthData?.role || (isSuperAdmin ? 'admin' : 'user'),
            accountStatus: preAuthData?.accountStatus || (isSuperAdmin ? 'active' : 'pending'),
            subscription: defaultSub,
            company: preAuthData?.appPreferences?.company || '',
            industry: preAuthData?.appPreferences?.industry || '',
            addressStyle: preAuthData?.appPreferences?.addressStyle || 'Bapak/Ibu',
            communicationPref: preAuthData?.appPreferences?.communicationPref || 'BALANCED',
            appTheme: preAuthData?.appPreferences?.theme || 'dark',
            appLanguage: preAuthData?.appPreferences?.language || 'ID',
          });

          if (!checkQuotaStatus()) {
            await setDoc(userRef, profilePayload, { merge: true }).catch((err) => {
              if (isQuotaError(err)) markQuotaExhausted();
              console.warn('Google user initial sync:', err);
            });

            if (res.user.email) {
              const emailKey = res.user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
              if (emailKey !== res.user.uid) {
                await setDoc(doc(db, 'users', emailKey), profilePayload, { merge: true }).catch((err) => {
                  if (isQuotaError(err)) markQuotaExhausted();
                });
              }
            }
          }
        }
      }
      onClose();
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Autentikasi Google dibatalkan.');
      } else {
        setError(err.message || 'Gagal login dengan Google. Silakan coba beberapa saat lagi.');
      }
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Harap isi alamat email dan password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Nama lengkap wajib diisi untuk pendaftaran.');
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Konfirmasi password tidak cocok.');
        return;
      }

      setIsSubmitting(true);
      try {
        const emailClean = email.trim().toLowerCase();
        const userCredential = await createUserWithEmailAndPassword(auth, emailClean, password);
        if (userCredential.user) {
          const user = userCredential.user;
          const isSuperAdmin = emailClean === 'milhamyogaswara@gmail.com';
          
          await updateProfile(user, {
            displayName: name.trim(),
          }).catch(console.warn);

          // Check pre-auth for email
          let preAuthData: any = null;
          try {
            const emailKey = emailClean.replace(/[^a-zA-Z0-9]/g, '_');
            const emailSnap = await getDoc(doc(db, 'users', emailKey));
            if (emailSnap.exists()) preAuthData = emailSnap.data();
          } catch (e) {
            console.warn('Preauth check info:', e);
          }

          const defaultSub = preAuthData?.subscription || {
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
            notes: isSuperAdmin ? 'Superadmin Master Account' : 'Self-registered user pending admin authorization.',
          };

          const userRef = doc(db, 'users', user.uid);
          const profilePayload = sanitizeForFirestore({
            uid: user.uid,
            id: user.uid,
            email: emailClean,
            displayName: name.trim(),
            company: company.trim(),
            provider: 'password',
            role: preAuthData?.role || (isSuperAdmin ? 'admin' : 'user'),
            accountStatus: preAuthData?.accountStatus || (isSuperAdmin ? 'active' : 'pending'),
            createdAt: preAuthData?.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            subscription: defaultSub,
            appPreferences: preAuthData?.appPreferences || {
              company: company.trim(),
              addressStyle: 'Bapak/Ibu',
              communicationPref: 'BALANCED',
              theme: 'dark',
              language: 'ID',
            }
          });

          upsertLocalUser({
            id: user.uid,
            name: name.trim(),
            email: emailClean,
            company: company.trim(),
            avatarUrl: '',
            role: preAuthData?.role || (isSuperAdmin ? 'admin' : 'user'),
            accountStatus: preAuthData?.accountStatus || (isSuperAdmin ? 'active' : 'pending'),
            subscription: defaultSub,
            industry: '',
            addressStyle: 'Bapak/Ibu',
            communicationPref: 'BALANCED',
            appTheme: 'dark',
            appLanguage: 'ID',
          });

          if (!checkQuotaStatus()) {
            await setDoc(userRef, profilePayload, { merge: true }).catch((err) => {
              if (isQuotaError(err)) markQuotaExhausted();
              console.warn('Email user profile write info:', err);
            });

            const emailKey = emailClean.replace(/[^a-zA-Z0-9]/g, '_');
            if (emailKey !== user.uid) {
              await setDoc(doc(db, 'users', emailKey), profilePayload, { merge: true }).catch((err) => {
                if (isQuotaError(err)) markQuotaExhausted();
              });
            }
          }
        }
        onClose();
      } catch (err: any) {
        console.error('Sign up error:', err);
        if (err.code === 'auth/email-already-in-use') {
          setError('Email sudah terdaftar. Silakan pilih tab Masuk.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Format alamat email tidak valid.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password terlalu lemah. Gunakan minimal 6 karakter.');
        } else {
          setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
        }
        setIsSubmitting(false);
      }
    } else {
      // Sign In mode
      setIsSubmitting(true);
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        onClose();
      } catch (err: any) {
        console.error('Sign in error:', err);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Email atau password tidak sesuai. Pastikan Anda sudah terdaftar.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Format alamat email tidak valid.');
        } else {
          setError(err.message || 'Gagal masuk. Silakan periksa kredensial Anda.');
        }
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      id="auth-modal-overlay"
    >
      <div 
        className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,95,31,0.15)] overflow-hidden my-auto"
        id="auth-modal-container"
      >
        {/* Subtle orange ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF5F1F]/5 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-auth-modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors z-20"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="relative z-10 mb-6 pr-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#2B2B2B] border border-white/10 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-[#FF5F1F]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF5F1F]">
                Hermes Studio Access
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {mode === 'signin' ? 'Masuk ke AI Employee Builder' : 'Daftar Akun Baru'}
              </h2>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {mode === 'signin' 
              ? 'Masuk dan lanjutkan kelola autonomous AI Employee bisnis Anda.' 
              : 'Daftar untuk mulai membangun role, SOP, memory, dan automation Hermes.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="relative z-10 grid grid-cols-2 p-1 bg-[#181818] border border-white/10 rounded-xl mb-5">
          <button
            type="button"
            id="tab-auth-signin"
            onClick={() => { setMode('signin'); resetForm(); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin' 
                ? 'bg-white text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Masuk (Sign In)
          </button>
          <button
            type="button"
            id="tab-auth-signup"
            onClick={() => { setMode('signup'); resetForm(); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup' 
                ? 'bg-[#FF5F1F] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Daftar Baru (Sign Up)
          </button>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="relative z-10 mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed flex items-start gap-2.5">
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="relative z-10 mb-4 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400 mt-0.5" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {mode === 'signup' && (
          <div className="relative z-10 mb-4 p-3 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Pemberitahuan Pendaftaran:</strong> Akun baru mungkin memerlukan persetujuan sebelum dapat mengakses seluruh aplikasi.
            </div>
          </div>
        )}

        {/* Google One-Click Button */}
        <button
          type="button"
          id="btn-google-auth-modal"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="relative z-10 group w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 overflow-hidden shadow-sm"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span className="flex items-center gap-2">
            {mode === 'signin' ? 'Lanjutkan dengan Google' : 'Daftar dengan Google'}
            {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />}
          </span>
        </button>

        {/* Divider */}
        <div className="relative z-10 flex items-center gap-4 my-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
            atau gunakan email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="relative z-10 space-y-3" id="form-auth-modal">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Nama Lengkap <span className="text-[#FF5F1F]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="input-auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Perusahaan / Brand <span className="text-gray-500 font-normal">(opsional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="input-auth-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Nama Bisnis / Brand Anda"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Alamat Email <span className="text-[#FF5F1F]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                id="input-auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@bisnis.com"
                className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Password <span className="text-[#FF5F1F]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="input-auth-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] transition-all"
              />
              <button
                type="button"
                id="btn-toggle-password-modal"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Konfirmasi Password <span className="text-[#FF5F1F]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="input-auth-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="btn-submit-auth-modal"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 shadow-[0_0_20px_rgba(255,95,31,0.25)] mt-3 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Masuk ke Studio' : 'Daftar & Buat Akun'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/5 text-center text-xs text-gray-400">
          {mode === 'signin' ? (
            <>
              Belum punya akun?{' '}
              <button
                type="button"
                id="btn-switch-to-signup"
                onClick={() => { setMode('signup'); resetForm(); }}
                className="text-[#FF5F1F] hover:underline font-medium ml-1"
              >
                Daftar Baru Sekarang
              </button>
            </>
          ) : (
            <>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                id="btn-switch-to-signin"
                onClick={() => { setMode('signin'); resetForm(); }}
                className="text-[#FF5F1F] hover:underline font-medium ml-1"
              >
                Masuk ke akun Anda
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
