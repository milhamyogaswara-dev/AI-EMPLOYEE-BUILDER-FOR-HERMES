import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Lock, User, Building, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
import backgroundImage from '../../assets/images/login_background_1788077173153.jpg';

export const LoginView: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
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
      } catch (err: any) {
        console.error('Sign up error:', err);
        if (err.code === 'auth/email-already-in-use') {
          setError('Email sudah terdaftar. Silakan pilih tab Sign In untuk masuk.');
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
      } catch (err: any) {
        console.error('Sign in error:', err);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Email atau password tidak sesuai. Pastikan Anda sudah mendaftar.');
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
    <div className="min-h-screen bg-[#050505] flex font-sans text-[#F0F0F0] selection:bg-[#FF5F1F]/30 selection:text-white">
      {/* Left Column - Hero Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#111] overflow-hidden items-center justify-center">
        <img 
          src={backgroundImage} 
          alt="Abstract tech background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        <div className="relative z-10 p-16 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
            <Sparkles className="w-8 h-8 text-[#FF5F1F]" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
            Elevate Your <br />
            <span className="text-[#FF5F1F]">Autonomous AI Workforce</span>
          </h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-6">
            Create, train, and manage highly specialized autonomous agents tailored to your exact operational workflows.
          </p>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-[#FF5F1F] shrink-0" />
            <p className="text-xs text-gray-300">
              Admin Protected Environment. User access & subscriptions are authorized directly by Project Admin.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 xl:px-28 py-12 relative overflow-y-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5F1F]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md w-full relative z-10 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#252525] border border-white/10 flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#FF5F1F]" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === 'signin' 
                ? 'Sign in to access your Hermes AI Studio workspace.' 
                : 'Sign up for access. Accounts are verified and approved by the Project Admin.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#151515] border border-white/10 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); resetForm(); }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin' 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In (Masuk)
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); resetForm(); }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup' 
                  ? 'bg-[#FF5F1F] text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up (Daftar Baru)
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] text-xs leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Pemberitahuan Pendaftaran:</strong> Setelah mendaftar, akun Anda akan masuk ke status <em>Pending</em> untuk disetujui & diotorisasi paket langganannya oleh Project Admin (<code>milhamyogaswara@gmail.com</code>).
              </div>
            </div>
          )}

          {/* Google One-Click Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="group relative w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 overflow-hidden shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="relative z-10 flex items-center gap-2">
              {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nama Lengkap <span className="text-[#FF5F1F]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nama Perusahaan / Organisasi <span className="text-gray-500 font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Alamat Email <span className="text-[#FF5F1F]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password <span className="text-[#FF5F1F]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Konfirmasi Password <span className="text-[#FF5F1F]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-[#FF5F1F]/20 mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In ke Hermes Studio' : 'Daftar Akun Baru'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center text-[12px] text-gray-500 font-light leading-relaxed">
            {mode === 'signin' ? (
              <>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); resetForm(); }}
                  className="text-[#FF5F1F] hover:underline font-medium"
                >
                  Daftar Sekarang
                </button>
              </>
            ) : (
              <>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); resetForm(); }}
                  className="text-[#FF5F1F] hover:underline font-medium"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
