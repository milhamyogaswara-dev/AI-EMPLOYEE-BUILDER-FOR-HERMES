import React, { useState } from 'react';
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
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { auth, signOut } from '../../lib/firebase';

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
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    onUpdateProfile(profile);
    setIsSaved(true);
    setLang(profile.appLanguage.toLowerCase() as Language);
    setTimeout(() => setIsSaved(false), 2000);
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
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
        </div>
        <button
          onClick={handleSave}
          id="btn-save-settings"
          className="px-5 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#e04f14] text-white font-mono text-xs shadow-[0_0_15px_rgba(255,95,31,0.3)] transition flex items-center gap-2 shrink-0 uppercase tracking-wider relative z-10"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? ('Saved!') : ('Save Config')}</span>
        </button>
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
            <h3 className="font-semibold text-white truncate text-sm sm:text-base">{currentUser?.displayName}</h3>
            <p className="text-[#888] font-mono text-xs truncate">{currentUser?.email}</p>
            <p className="text-[10px] text-[#555] font-mono mt-1 uppercase tracking-widest">Provider: Google</p>
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
        <h3 className="font-serif italic text-base text-[#F0F0F0] flex items-center gap-2 pb-3 border-b border-white/10">
          <User className="w-4 h-4 text-[#FF5F1F]" />
          <span>{'Operator Profile & Business Context'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-mono text-[10px] text-[#888] uppercase tracking-widest mb-1.5">
              {'Operator Full Name'}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#FF5F1F] font-mono focus:border-[#FF5F1F]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border border-white/10 text-xs text-[#F0F0F0] font-mono focus:border-[#FF5F1F]"
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
                    ? 'bg-[#FF5F1F] text-white border-[#FF5F1F] shadow-sm'
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
      </div>

      {/* Application Language Settings */}
      <div className="bg-[#141414] rounded-2xl border border-white/10 shadow-sm p-6 sm:p-7 space-y-6">
        <h3 className="font-serif italic text-base text-[#F0F0F0] flex items-center gap-2 pb-3 border-b border-white/10">
          <Globe className="w-4 h-4 text-[#FF5F1F]" />
          <span>Application Language</span>
        </h3>
        
        <p className="text-xs text-[#AAA] font-light italic">
          Select your preferred language for the Hermes AI Studio interface.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {[
            { id: 'EN', label: 'English (US)' },
            { id: 'ID', label: 'Bahasa Indonesia' }
          ].map((lang) => {
            const isSelected = profile.appLanguage === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => setProfile({ ...profile, appLanguage: lang.id as 'EN' })}
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
                <span className="font-mono text-[11px] uppercase tracking-wider">{lang.label}</span>
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
    </div>
  );
};
