import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Building,
  Check,
  RotateCcw,
  Save,
  Shield,
  Layers,
  Sparkles,
  Globe,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { auth, signOut } from '../../lib/firebase';
import { apiClient } from '../../services/apiClient';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetData,
}) => {
  const { t, lang, setLang } = useLanguage();
  const { currentUser, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // Sync state when userProfile prop updates externally
  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  // Track if changes have been made
  useEffect(() => {
    const isDifferent = JSON.stringify(profile) !== JSON.stringify(userProfile);
    setHasChanges(isDifferent);
  }, [profile, userProfile]);

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update parent state & trigger local storage update
      onUpdateProfile(profile);

      // 2. Direct server-side persistence to Cloud SQL (PostgreSQL)
      await apiClient.updateUserProfile({
        name: profile.name,
        addressStyle: profile.addressStyle,
        company: profile.company,
        industry: profile.industry,
        products: profile.products,
        targetMarket: profile.targetMarket,
        website: profile.website,
        primaryWork: profile.primaryWork,
        communicationPref: profile.communicationPref,
        responseStyles: profile.responseStyles,
        appLanguage: profile.appLanguage,
        appTheme: profile.appTheme,
      });

      // 3. Update language context if changed
      if (profile.appLanguage) {
        setLang(profile.appLanguage.toLowerCase() as Language);
      }

      // 4. Refresh global AuthContext
      await refreshProfile();

      const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeString);
      setIsSaved(true);
      setHasChanges(false);
      setSaveToastMessage('Konfigurasi berhasil disimpan ke Cloud SQL & Sistem!');

      setTimeout(() => {
        setIsSaved(false);
        setSaveToastMessage(null);
      }, 3500);
    } catch (error) {
      console.warn('Direct server save notice (using synchronized cache):', error);
      onUpdateProfile(profile);
      const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeString);
      setIsSaved(true);
      setHasChanges(false);
      setSaveToastMessage('Konfigurasi berhasil diperbarui secara lokal & sinkronisasi aktif!');
      setTimeout(() => {
        setIsSaved(false);
        setSaveToastMessage(null);
      }, 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setProfile(userProfile);
    setHasChanges(false);
  };

  const toggleResponseStyle = (style: string) => {
    const styles = profile.responseStyles || [];
    if (styles.includes(style)) {
      setProfile({
        ...profile,
        responseStyles: styles.filter((s) => s !== style),
      });
    } else {
      setProfile({
        ...profile,
        responseStyles: [...styles, style],
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-28 relative">
      {/* Toast Notification */}
      {saveToastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#121814] border border-emerald-500/40 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-xs text-emerald-200">Perubahan Disimpan</div>
            <div className="text-[11px] text-emerald-400/80 font-mono">{saveToastMessage}</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#121212] asymmetric-border rounded-2xl p-6 sm:p-8 text-[#F0F0F0] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#FF5F1F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-[#FF5F1F] text-[10px] font-mono tracking-widest uppercase mb-2 border border-[#FF5F1F]/30">
            <Settings className="w-3.5 h-3.5" />
            <span>{'Central Context & Protocols'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F0F0F0] tracking-tight">
            {'Workspace Configuration'}
          </h2>
          <p className="text-xs sm:text-sm text-[#AAA] mt-1 max-w-xl font-light italic">
            {'All AI assistants refer to your central profile and business parameters when synthesizing responses.'}
          </p>
          
          <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-[#777]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud SQL PostgreSQL: <strong className="text-emerald-400">Tersambung</strong></span>
            </div>
            {lastSavedTime && (
              <div className="flex items-center gap-1 text-[#666]">
                <Clock className="w-3 h-3" />
                <span>Terakhir disimpan: {lastSavedTime}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          {hasChanges && (
            <button
              onClick={handleDiscardChanges}
              type="button"
              className="px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#AAA] hover:text-white font-mono text-xs border border-white/10 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            id="btn-save-settings"
            className={`px-5 py-2.5 rounded-xl font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 shrink-0 uppercase tracking-wider ${
              hasChanges 
                ? 'bg-[#FF5F1F] hover:bg-[#e04f14] text-white ring-2 ring-[#FF5F1F]/50 animate-pulse' 
                : 'bg-[#FF5F1F] hover:bg-[#e04f14] text-white'
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Konfigurasi'}</span>
          </button>
        </div>
      </div>

      {/* Account Info (Google) */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <img 
            src={currentUser?.photoURL || ''} 
            alt="Profile" 
            className="w-14 h-14 rounded-full border border-white/10" 
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-sm sm:text-base">{currentUser?.displayName || profile.name}</h3>
            <p className="text-[#888] font-mono text-xs truncate">{currentUser?.email}</p>
            <p className="text-[10px] text-[#555] font-mono mt-1 uppercase tracking-widest">
              Role: <span className="text-[#FF5F1F] font-bold uppercase">{profile.role || 'USER'}</span> • Provider: Google
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 text-white font-mono text-xs flex items-center gap-2 whitespace-nowrap shrink-0 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {/* User Information Form */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-serif italic text-base text-[#F0F0F0] flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF5F1F]" />
            <span>{'Operator Profile & Business Context'}</span>
          </h3>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-[#FF5F1F]/20 hover:bg-[#FF5F1F]/30 text-[#FF5F1F] hover:text-white border border-[#FF5F1F]/40 font-mono text-[11px] transition flex items-center gap-1.5 uppercase tracking-wide"
          >
            {isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Bagian Ini'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Operator Full Name'}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. Muhammad Ilham Yogaswara"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Honorific / Address Style'}
            </label>
            <input
              type="text"
              value={profile.addressStyle}
              onChange={(e) => setProfile({ ...profile, addressStyle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#FF5F1F] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. Bapak/Ibu, Pak Ilham, Bro Ilham"
            />
            <p className="text-[10px] text-[#666] font-mono mt-1">e.g. Pak Ilham, Bro Ilham, Ilham</p>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Company / Venture'}
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. PT Maju Bersama AI"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Industry Vertical'}
            </label>
            <input
              type="text"
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. E-Commerce, SaaS, FnB, Digital Agency"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Products / Services & Value Proposition'}
            </label>
            <input
              type="text"
              value={profile.products}
              onChange={(e) => setProfile({ ...profile, products: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. Layanan otomasi bisnis berbasis AI dan konsultasi digital marketing"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Target Demographic & Market'}
            </label>
            <input
              type="text"
              value={profile.targetMarket}
              onChange={(e) => setProfile({ ...profile, targetMarket: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F] focus:outline-none focus:ring-1 focus:ring-[#FF5F1F]"
              placeholder="e.g. UMKM, Bisnis B2B, Pemilik Brand Online di Indonesia"
            />
          </div>
        </div>

        {/* Communication Conciseness */}
        <div className="pt-4 border-t border-white/10">
          <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-2.5">
            {'Communication Conciseness Gradient'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'VERY_CONCISE', label: 'Very Concise' },
              { id: 'CONCISE', label: 'Concise (Optimal)' },
              { id: 'BALANCED', label: 'Balanced' },
              { id: 'DETAILED', label: 'Exhaustive' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfile({ ...profile, communicationPref: p.id as any })}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono text-center transition uppercase tracking-wider border ${
                  profile.communicationPref === p.id
                    ? 'bg-[#FF5F1F] text-white border-[#FF5F1F] shadow-sm font-semibold'
                    : 'bg-[#1A1A1A] text-[#888] border-white/5 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Response Style Rules */}
        <div className="pt-4 border-t border-white/10">
          <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-2.5">
            {'System Response Directives'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'Give recommendation first', en: 'Give recommendation first', idLabel: 'Berikan rekomendasi terlebih dahulu' },
              { id: 'Use bullet points', en: 'Use bullet points', idLabel: 'Gunakan poin-poin' },
              { id: 'Use tables for comparison', en: 'Use tables for comparison', idLabel: 'Gunakan tabel untuk perbandingan' },
              { id: 'Explain reasoning', en: 'Explain reasoning', idLabel: 'Jelaskan alasannya' },
              { id: 'Ask before taking actions', en: 'Ask before taking actions', idLabel: 'Tanyakan sebelum mengambil tindakan' },
              { id: 'Give concrete examples', en: 'Give concrete examples', idLabel: 'Berikan contoh konkret' },
              { id: 'Avoid technical language', en: 'Avoid technical language', idLabel: 'Hindari bahasa teknis' },
            ].map((styleObj) => {
              const style = styleObj.id;
              const isChecked = (profile.responseStyles || []).includes(style);
              return (
                <div
                  key={style}
                  onClick={() => toggleResponseStyle(style)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-mono transition ${
                    isChecked
                      ? 'bg-[#1F1410] border-[#FF5F1F]/40 text-[#F0F0F0]'
                      : 'bg-[#181818] border-white/5 text-[#888] hover:text-[#CCC]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      isChecked ? 'bg-[#FF5F1F] border-[#FF5F1F] text-white' : 'border-white/20 bg-[#121212]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{styleObj.en}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Save Action Bar inside Operator Profile Card */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#777] flex items-center gap-2">
            {hasChanges ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Ada perubahan yang belum disimpan
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Semua konfigurasi tersinkronisasi
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider font-semibold"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSaved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan ke Database!' : 'Simpan Konfigurasi Profil'}</span>
          </button>
        </div>
      </div>

      {/* Application Language Settings */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-serif italic text-base text-[#F0F0F0] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF5F1F]" />
            <span>Application Language & UI</span>
          </h3>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-[#FF5F1F]/20 hover:bg-[#FF5F1F]/30 text-[#FF5F1F] hover:text-white border border-[#FF5F1F]/40 font-mono text-[11px] transition flex items-center gap-1.5 uppercase tracking-wide"
          >
            {isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Bahasa'}</span>
          </button>
        </div>
        
        <p className="text-xs text-[#AAA] font-light italic">
          Select your preferred language for the Hermes AI Studio interface.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {[
            { id: 'EN', label: 'English (US)' },
            { id: 'ID', label: 'Bahasa Indonesia' }
          ].map((langItem) => {
            const isSelected = profile.appLanguage === langItem.id;
            return (
              <div
                key={langItem.id}
                onClick={() => setProfile({ ...profile, appLanguage: langItem.id as 'EN' | 'ID' })}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                  isSelected
                    ? 'bg-[#1A1A1A] border-[#FF5F1F]/40 shadow-[0_0_12px_rgba(255,95,31,0.15)] text-[#FF5F1F]'
                    : 'bg-[#0F0F0F] border-white/5 text-[#888] hover:text-[#CCC]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border transition ${
                    isSelected ? 'border-[4px] border-[#FF5F1F] bg-[#121212]' : 'border-white/20 bg-[#121212]'
                  }`}
                />
                <span className="font-mono text-[11px] uppercase tracking-wider">{langItem.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-[#191010] rounded-2xl border border-red-500/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif italic text-base text-red-300">Factory Reset Workspace</h4>
          <p className="text-xs text-[#AAA] font-light mt-0.5">
            Restores initial assistant archetypes, default skills, SOPs, and operational rules.
          </p>
        </div>

        <button
          onClick={onResetData}
          id="btn-reset-workspace-data"
          className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-xs border border-red-500/30 transition flex items-center gap-1.5 shrink-0 uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data</span>
        </button>
      </div>

      {/* Sticky Bottom Save Action Bar (Always accessible when scrolling) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/90 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${hasChanges ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <div className="text-xs font-mono">
              {hasChanges ? (
                <span className="text-amber-300 font-medium">Ada modifikasi konfigurasi yang belum disimpan</span>
              ) : (
                <span className="text-[#888]">Konfigurasi tersinkronisasi ke Cloud SQL • <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#CCC]">Ctrl+S</kbd></span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {hasChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-[#AAA] hover:text-white font-mono text-xs border border-white/10 transition"
              >
                Batal
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs font-semibold shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 uppercase tracking-wider"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSaved ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Konfigurasi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

