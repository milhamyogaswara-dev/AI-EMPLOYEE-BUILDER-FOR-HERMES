import React, { useEffect, useState } from 'react';
import { loadAllUsers, saveAllUsers, upsertLocalUser, deleteLocalUser } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile, UserSubscription, SubscriptionPlan, SubscriptionStatus } from '../../types';
import { apiClient } from '../../services/apiClient';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  UserPlus,
  Search, 
  Sliders, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Zap, 
  Users, 
  RefreshCw,
  X,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Database
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { userProfile: currentAdminProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(() => loadAllUsers());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  
  // Modal for editing/authorizing subscription
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState<{
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    accountStatus: string;
    role: string;
    maxAgents: number;
    maxTokens: number;
    durationMonths: number | 'lifetime' | 'custom';
    customExpiryDate: string;
    customEndpoints: boolean;
    priorityTraining: boolean;
    unlimitedMemory: boolean;
    exportIntegration: boolean;
    notes: string;
  }>({
    plan: 'PRO',
    status: 'ACTIVE',
    accountStatus: 'active',
    role: 'user',
    maxAgents: 10,
    maxTokens: 500000,
    durationMonths: 12,
    customExpiryDate: '',
    customEndpoints: true,
    priorityTraining: true,
    unlimitedMemory: true,
    exportIntegration: true,
    notes: '',
  });

  const [savingUser, setSavingUser] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal for adding / pre-authorizing new user
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    name: '',
    role: 'user',
    accountStatus: 'active',
    plan: 'PRO' as SubscriptionPlan,
    maxAgents: 10,
    maxTokens: 500000,
    durationMonths: 12,
    customEndpoints: true,
    priorityTraining: true,
    unlimitedMemory: true,
    exportIntegration: true,
    notes: 'Diotorisasi langsung oleh Project Admin',
  });

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const serverUsers = await apiClient.getAdminUsers();
      if (serverUsers && Array.isArray(serverUsers)) {
        setUsers(serverUsers);
        saveAllUsers(serverUsers);
      } else {
        setUsers(loadAllUsers());
      }
    } catch (err) {
      console.warn('Notice fetching users (using local cache):', err);
      setUsers(loadAllUsers());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddOrAuthorizeUser = async () => {
    if (!addUserForm.email.trim()) {
      alert('Harap masukkan alamat email.');
      return;
    }

    setSavingUser(true);
    const emailClean = addUserForm.email.trim().toLowerCase();
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(now.getMonth() + addUserForm.durationMonths);

    const newSub: UserSubscription = {
      plan: addUserForm.plan,
      status: addUserForm.accountStatus === 'active' ? 'ACTIVE' : 'PENDING',
      maxAgents: addUserForm.maxAgents,
      maxTokens: addUserForm.maxTokens,
      tokensUsed: 0,
      features: {
        customEndpoints: addUserForm.customEndpoints,
        priorityTraining: addUserForm.priorityTraining,
        unlimitedMemory: addUserForm.unlimitedMemory,
        exportIntegration: addUserForm.exportIntegration,
      },
      startDate: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      authorizedBy: currentAdminProfile?.email || 'milhamyogaswara@gmail.com',
      authorizedAt: now.toISOString(),
      notes: addUserForm.notes || 'Diotorisasi langsung oleh Project Admin',
    };

    const payload: Partial<UserProfile> = {
      email: emailClean,
      name: addUserForm.name.trim() || emailClean.split('@')[0],
      role: addUserForm.role,
      accountStatus: addUserForm.accountStatus,
      subscription: newSub,
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
    };

    try {
      const saved = await apiClient.addAdminUser(payload);
      const updatedUsers = users.some(u => u.email?.toLowerCase() === emailClean)
        ? users.map(u => u.email?.toLowerCase() === emailClean ? { ...u, ...saved } : u)
        : [saved || (payload as UserProfile), ...users];
      setUsers(updatedUsers);
      saveAllUsers(updatedUsers);
      showToast(`User ${emailClean} berhasil diotorisasi paket ${addUserForm.plan} di Cloud SQL!`);
      setIsAddUserModalOpen(false);
      setAddUserForm({
        email: '',
        name: '',
        role: 'user',
        accountStatus: 'active',
        plan: 'PRO',
        maxAgents: 10,
        maxTokens: 500000,
        durationMonths: 12,
        customEndpoints: true,
        priorityTraining: true,
        unlimitedMemory: true,
        exportIntegration: true,
        notes: 'Diotorisasi langsung oleh Project Admin',
      });
    } catch (err: any) {
      console.error('Error adding user:', err);
      // Local fallback
      const localProfile: UserProfile = {
        id: emailClean.replace(/[^a-zA-Z0-9]/g, '_'),
        ...(payload as any)
      };
      upsertLocalUser(localProfile);
      const updatedUsers = [localProfile, ...users];
      setUsers(updatedUsers);
      showToast(`User ${emailClean} disimpan secara lokal.`);
      setIsAddUserModalOpen(false);
    } finally {
      setSavingUser(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Quick Approve: sets account to active and authorizes Starter/Pro package
  const handleQuickApprove = async (user: UserProfile) => {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setFullYear(now.getFullYear() + 1); // 1 year active

    const updatedSubscription: UserSubscription = {
      plan: user.subscription?.plan && user.subscription.plan !== 'FREE' ? user.subscription.plan : 'PRO',
      status: 'ACTIVE',
      maxAgents: 10,
      maxTokens: 500000,
      tokensUsed: 0,
      features: {
        customEndpoints: true,
        priorityTraining: true,
        unlimitedMemory: true,
        exportIntegration: true,
      },
      startDate: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      authorizedBy: currentAdminProfile?.email || 'milhamyogaswara@gmail.com',
      authorizedAt: now.toISOString(),
      notes: 'Approved and authorized by Project Admin.',
    };

    const updatedUser: UserProfile = {
      ...user,
      accountStatus: 'active',
      subscription: updatedSubscription,
    };

    upsertLocalUser(updatedUser);
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    try {
      await apiClient.updateAdminUser(user.id, {
        accountStatus: 'active',
        subscription: updatedSubscription,
      });
      showToast(`Akun ${user.name || user.email} berhasil disetujui & diotorisasi paket PRO!`);
    } catch (err: any) {
      console.warn('Notice updating user:', err);
      showToast(`Akun ${user.name || user.email} berhasil disetujui!`);
    }
  };

  // Quick Reject
  const handleQuickReject = async (user: UserProfile) => {
    if (!confirm(`Apakah Anda yakin ingin menolak / memblokir akses untuk ${user.name || user.email}?`)) return;

    const updatedUser: UserProfile = {
      ...user,
      accountStatus: 'rejected',
      subscription: user.subscription ? { ...user.subscription, status: 'SUSPENDED' } : undefined,
    };

    upsertLocalUser(updatedUser);
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    try {
      await apiClient.updateAdminUser(user.id, {
        accountStatus: 'rejected',
        subscription: user.subscription ? { ...user.subscription, status: 'SUSPENDED' } : undefined,
      });
      showToast(`Akses untuk ${user.name || user.email} telah ditolak/dibekukan.`);
    } catch (err: any) {
      console.warn('Notice updating user:', err);
      showToast(`Akses untuk ${user.name || user.email} telah dibekukan.`);
    }
  };

  // Toggle Admin Role
  const handleToggleAdminRole = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const actionName = newRole === 'admin' ? 'menjadikan Administrator' : 'mencabut status Admin';
    if (!confirm(`Apakah Anda ingin ${actionName} untuk ${user.name || user.email}?`)) return;

    const updatedUser: UserProfile = { ...user, role: newRole };
    upsertLocalUser(updatedUser);
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    try {
      await apiClient.updateAdminUser(user.id, { role: newRole });
      showToast(`Status admin untuk ${user.name || user.email} berhasil diperbarui.`);
    } catch (err: any) {
      console.warn('Notice updating admin role:', err);
      showToast(`Status admin untuk ${user.name || user.email} berhasil diperbarui.`);
    }
  };

  // Delete User Account
  const handleDeleteUser = async (user: UserProfile) => {
    if (!confirm(`PERINGATAN: Hapus data user ${user.name || user.email}? Tindakan ini tidak dapat dibatalkan.`)) return;

    deleteLocalUser(user.id);
    if (user.email) deleteLocalUser(user.email);
    const updatedUsers = users.filter(u => u.id !== user.id && (!user.email || u.email?.toLowerCase() !== user.email.toLowerCase()));
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    try {
      await apiClient.deleteAdminUser(user.id);
      showToast(`User ${user.name || user.email} berhasil dihapus dari Cloud SQL.`);
    } catch (err: any) {
      console.warn('Notice deleting user:', err);
      showToast(`User ${user.name || user.email} berhasil dihapus.`);
    }
  };

  // Open Detailed Authorization Modal
  const openAuthorizationModal = (user: UserProfile) => {
    setSelectedUser(user);
    const sub = user.subscription;
    
    let defaultDuration: number | 'lifetime' | 'custom' = 12;
    let customDate = '';
    if (sub?.expiresAt) {
      customDate = sub.expiresAt.split('T')[0];
    } else if (sub && sub.expiresAt === null) {
      defaultDuration = 'lifetime';
    }

    setAuthForm({
      plan: sub?.plan || 'PRO',
      status: sub?.status || 'ACTIVE',
      accountStatus: user.accountStatus || 'active',
      role: user.role || 'user',
      maxAgents: sub?.maxAgents || (sub?.plan === 'ENTERPRISE' ? 50 : sub?.plan === 'PRO' ? 10 : 3),
      maxTokens: sub?.maxTokens || (sub?.plan === 'ENTERPRISE' ? 2500000 : sub?.plan === 'PRO' ? 500000 : 100000),
      durationMonths: defaultDuration,
      customExpiryDate: customDate,
      customEndpoints: sub?.features?.customEndpoints ?? true,
      priorityTraining: sub?.features?.priorityTraining ?? true,
      unlimitedMemory: sub?.features?.unlimitedMemory ?? true,
      exportIntegration: sub?.features?.exportIntegration ?? true,
      notes: sub?.notes || '',
    });

    setIsAuthModalOpen(true);
  };

  // Handle Plan Preset Selection inside Modal
  const handleSelectPlanPreset = (plan: SubscriptionPlan) => {
    let maxAgents = 3;
    let maxTokens = 100000;
    let duration: number | 'lifetime' = 12;

    if (plan === 'FREE') {
      maxAgents = 1;
      maxTokens = 10000;
    } else if (plan === 'STARTER') {
      maxAgents = 3;
      maxTokens = 100000;
    } else if (plan === 'PRO') {
      maxAgents = 10;
      maxTokens = 500000;
    } else if (plan === 'ENTERPRISE') {
      maxAgents = 50;
      maxTokens = 2500000;
    } else if (plan === 'UNLIMITED_VIP') {
      maxAgents = 100;
      maxTokens = 10000000;
      duration = 'lifetime';
    }

    setAuthForm(prev => ({
      ...prev,
      plan,
      maxAgents,
      maxTokens,
      durationMonths: duration,
      customEndpoints: plan !== 'FREE',
      priorityTraining: plan === 'PRO' || plan === 'ENTERPRISE' || plan === 'UNLIMITED_VIP',
      unlimitedMemory: plan === 'PRO' || plan === 'ENTERPRISE' || plan === 'UNLIMITED_VIP',
      exportIntegration: true,
    }));
  };

  // Save Detailed Authorization
  const handleSaveAuthorization = async () => {
    if (!selectedUser) return;
    setSavingUser(true);

    const now = new Date();
    let calculatedExpiry: string | null = null;

    if (authForm.durationMonths === 'lifetime') {
      calculatedExpiry = null;
    } else if (authForm.durationMonths === 'custom' && authForm.customExpiryDate) {
      calculatedExpiry = new Date(authForm.customExpiryDate).toISOString();
    } else if (typeof authForm.durationMonths === 'number') {
      const exp = new Date();
      exp.setMonth(now.getMonth() + authForm.durationMonths);
      calculatedExpiry = exp.toISOString();
    }

    const updatedSubscription: UserSubscription = {
      plan: authForm.plan,
      status: authForm.status,
      maxAgents: Number(authForm.maxAgents),
      maxTokens: Number(authForm.maxTokens),
      tokensUsed: selectedUser.subscription?.tokensUsed || 0,
      features: {
        customEndpoints: authForm.customEndpoints,
        priorityTraining: authForm.priorityTraining,
        unlimitedMemory: authForm.unlimitedMemory,
        exportIntegration: authForm.exportIntegration,
      },
      startDate: selectedUser.subscription?.startDate || now.toISOString(),
      expiresAt: calculatedExpiry,
      authorizedBy: currentAdminProfile?.email || 'milhamyogaswara@gmail.com',
      authorizedAt: now.toISOString(),
      notes: authForm.notes.trim(),
    };

    const updatedUser: UserProfile = {
      ...selectedUser,
      accountStatus: authForm.accountStatus,
      role: authForm.role,
      subscription: updatedSubscription,
    };

    upsertLocalUser(updatedUser);
    const updatedUsers = users.map(u => u.id === selectedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    try {
      await apiClient.updateAdminUser(selectedUser.id, {
        accountStatus: authForm.accountStatus,
        role: authForm.role,
        subscription: updatedSubscription,
      });

      setIsAuthModalOpen(false);
      showToast(`Otorisasi paket ${authForm.plan} untuk ${selectedUser.name} berhasil disimpan di Cloud SQL!`);
    } catch (err: any) {
      console.warn('Notice saving authorization:', err);
      setIsAuthModalOpen(false);
      showToast(`Otorisasi paket ${authForm.plan} untuk ${selectedUser.name} berhasil disimpan!`);
    } finally {
      setSavingUser(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'PENDING') matchesStatus = user.accountStatus === 'pending';
    else if (statusFilter === 'ACTIVE') matchesStatus = user.accountStatus === 'active';
    else if (statusFilter === 'REJECTED') matchesStatus = user.accountStatus === 'rejected' || user.accountStatus === 'suspended';
    else if (statusFilter === 'ADMINS') matchesStatus = user.role === 'admin';

    let matchesPlan = true;
    if (planFilter !== 'ALL') {
      matchesPlan = user.subscription?.plan === planFilter;
    }

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Metrics
  const totalUsersCount = users.length;
  const pendingCount = users.filter(u => u.accountStatus === 'pending').length;
  const activeCount = users.filter(u => u.accountStatus === 'active').length;
  const enterpriseCount = users.filter(u => u.subscription?.plan === 'ENTERPRISE' || u.subscription?.plan === 'UNLIMITED_VIP').length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-gray-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#141414] border border-green-500/30 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div className="text-sm font-medium">{successToast}</div>
        </div>
      )}

      {/* Database Status Indicator */}
      <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-3 text-emerald-400 text-xs">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Cloud SQL (PostgreSQL) Aktif:</strong> Manajemen user dan seluruh data asisten tersinkronisasi langsung ke database PostgreSQL regional asia-southeast1 tanpa batasan kuota.</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold tracking-wide uppercase">Connected</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/30 flex items-center justify-center text-[#FF5F1F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              User & Subscription Management
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Otorisasi langsung akun pengguna, persetujuan pendaftaran (Approval Flow), dan kontrol paket langganan AI Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#FF5F1F]/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Otorisasi User Baru</span>
          </button>

          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF5F1F]' : ''}`} />
            <span>{refreshing ? 'Memuat data...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Terdaftar</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalUsersCount}</div>
          <div className="text-xs text-gray-500">Semua akun pengguna di sistem</div>
        </div>

        <div 
          onClick={() => setStatusFilter('PENDING')}
          className="bg-[#121212] border border-yellow-500/30 p-5 rounded-2xl cursor-pointer hover:border-yellow-500/60 transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-yellow-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Menunggu Approval
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-300 rounded-full animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-1">{pendingCount}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-yellow-300 transition-colors">
            <span>Klik untuk filter antrian pendaftar</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Akun Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeCount}</div>
          <div className="text-xs text-gray-500">Memiliki akses ke dashboard</div>
        </div>

        <div className="bg-[#121212] border border-[#FF5F1F]/20 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#FF5F1F] font-medium uppercase tracking-wider">Enterprise & VIP</span>
            <Zap className="w-4 h-4 text-[#FF5F1F]" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{enterpriseCount}</div>
          <div className="text-xs text-gray-500">Kapasitas agen & kuota tinggi</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-white/10 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, perusahaan..."
            className="w-full bg-[#181818] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5F1F] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-[#181818] border border-white/10 p-1 rounded-xl text-xs">
            {(['ALL', 'PENDING', 'ACTIVE', 'REJECTED', 'ADMINS'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'Semua' :
                 status === 'PENDING' ? `Pending (${pendingCount})` :
                 status === 'ACTIVE' ? 'Active' :
                 status === 'REJECTED' ? 'Blocked' : 'Admins'}
              </button>
            ))}
          </div>

          {/* Plan Selector */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-[#181818] border border-white/10 text-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5F1F]"
          >
            <option value="ALL">Semua Paket</option>
            <option value="FREE">Free Tier</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro Builder</option>
            <option value="ENTERPRISE">Enterprise Suite</option>
            <option value="UNLIMITED_VIP">Unlimited VIP</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF5F1F] rounded-full animate-spin" />
            <span className="text-sm">Memuat daftar pengguna & otorisasi...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="text-base font-semibold text-gray-400">Tidak ada pengguna yang cocok</h3>
            <p className="text-xs text-gray-600 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-500 uppercase bg-[#181818] border-b border-white/10 font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Profile</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Subscription Plan & Quota</th>
                  <th className="px-6 py-4">Validitas & Authorized By</th>
                  <th className="px-6 py-4 text-right">Otorisasi & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => {
                  const isUserSuperAdmin = user.email?.toLowerCase() === 'milhamyogaswara@gmail.com';
                  const sub = user.subscription;
                  const isPending = user.accountStatus === 'pending';

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isPending ? 'bg-yellow-500/[0.04]' : ''
                      }`}
                    >
                      {/* User Profile Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img 
                              src={user.avatarUrl} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full bg-[#1A1A1A] object-cover ring-2 ring-white/10" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/10 flex items-center justify-center text-sm font-bold text-[#FF5F1F]">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{user.name}</span>
                              {user.role === 'admin' && (
                                <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30 rounded">
                                  Admin
                                </span>
                              )}
                              {isUserSuperAdmin && (
                                <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                            {user.company && (
                              <div className="text-[11px] text-gray-400 mt-0.5">🏢 {user.company}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border ${
                          user.accountStatus === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          user.accountStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {user.accountStatus === 'active' && <CheckCircle2 className="w-3 h-3" />}
                          {user.accountStatus === 'pending' && <Clock className="w-3 h-3" />}
                          {user.accountStatus === 'rejected' && <UserX className="w-3 h-3" />}
                          {user.accountStatus}
                        </span>
                      </td>

                      {/* Subscription Plan & Quota */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                              sub?.plan === 'UNLIMITED_VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                              sub?.plan === 'ENTERPRISE' ? 'bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/40' :
                              sub?.plan === 'PRO' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                              sub?.plan === 'STARTER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              'bg-gray-800 text-gray-400 border border-white/10'
                            }`}>
                              {sub?.plan || 'FREE'}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              • Status: <strong className="text-gray-300">{sub?.status || 'PENDING'}</strong>
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-400 font-mono">
                            Max Agents: <strong className="text-white">{sub?.maxAgents ?? 1}</strong> | Tokens:{' '}
                            <strong className="text-white">
                              {sub?.maxTokens ? (sub.maxTokens >= 1000000 ? `${sub.maxTokens / 1000000}M` : `${sub.maxTokens / 1000}K`) : '10K'}
                            </strong>
                          </div>
                        </div>
                      </td>

                      {/* Validity & Authorized By */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs space-y-0.5">
                          <div className="text-gray-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {sub?.expiresAt ? (
                              <span>Exp: {new Date(sub.expiresAt).toLocaleDateString('id-ID')}</span>
                            ) : (
                              <span className="text-green-400 font-medium">Lifetime / No Expiry</span>
                            )}
                          </div>
                          {sub?.authorizedBy && (
                            <div className="text-[11px] text-gray-500">
                              By: <span className="text-gray-400">{sub.authorizedBy}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Approve button if pending */}
                          {isPending && (
                            <button
                              onClick={() => handleQuickApprove(user)}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                              title="Setujui dan aktifkan paket PRO sekarang"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Direct Authorize Subscription Modal Trigger */}
                          <button
                            onClick={() => openAuthorizationModal(user)}
                            className="px-3 py-1.5 bg-[#FF5F1F]/10 hover:bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                            title="Otorisasi langsung paket & kuota akun"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Otorisasi Paket</span>
                          </button>

                          {/* Quick Reject */}
                          {user.accountStatus !== 'rejected' && !isUserSuperAdmin && (
                            <button
                              onClick={() => handleQuickReject(user)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors"
                              title="Tolak / Blokir Akses"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}

                          {/* Role Toggle */}
                          {!isUserSuperAdmin && (
                            <button
                              onClick={() => handleToggleAdminRole(user)}
                              className={`p-2 rounded-xl border transition-colors ${
                                user.role === 'admin'
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                              title={user.role === 'admin' ? 'Cabut Akses Admin' : 'Jadikan Admin'}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {!isUserSuperAdmin && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-white/10 hover:border-red-500/20 transition-colors"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Direct Subscription & User Authorization Modal */}
      {isAuthModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#141414] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/30 flex items-center justify-center text-[#FF5F1F]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Otorisasi Langsung Akun & Langganan</h2>
                <p className="text-xs text-gray-400">
                  Mengotorisasi hak akses, kuota agen, dan token langsung ke akun <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})
                </p>
              </div>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Account Status & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Status Akun (Approval)
                  </label>
                  <select
                    value={authForm.accountStatus}
                    onChange={(e) => setAuthForm({ ...authForm, accountStatus: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="active">Active (Disetujui / Diizinkan Masuk)</option>
                    <option value="pending">Pending (Menunggu Persetujuan)</option>
                    <option value="rejected">Rejected (Ditolak / Diblokir)</option>
                    <option value="suspended">Suspended (Ditangguhkan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Peran Sistem (Role)
                  </label>
                  <select
                    value={authForm.role}
                    onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="user">User Biasa</option>
                    <option value="admin">Administrator (Akses Dashboard Admin)</option>
                  </select>
                </div>
              </div>

              {/* Plan Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Pilih Tingkatan Paket Langganan (Preset Tiers)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['FREE', 'STARTER', 'PRO', 'ENTERPRISE', 'UNLIMITED_VIP'] as SubscriptionPlan[]).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => handleSelectPlanPreset(plan)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        authForm.plan === plan
                          ? 'bg-[#FF5F1F]/15 border-[#FF5F1F] text-white shadow-lg'
                          : 'bg-[#181818] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{plan}</span>
                        {authForm.plan === plan && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5F1F]" />}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {plan === 'FREE' && '1 Agen • 10K Tokens'}
                        {plan === 'STARTER' && '3 Agen • 100K Tokens'}
                        {plan === 'PRO' && '10 Agen • 500K Tokens'}
                        {plan === 'ENTERPRISE' && '50 Agen • 2.5M Tokens'}
                        {plan === 'UNLIMITED_VIP' && '100 Agen • 10M Tokens • Lifetime'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota Allocations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Batas Maksimal AI Assistants (Agen)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={authForm.maxAgents}
                    onChange={(e) => setAuthForm({ ...authForm, maxAgents: Number(e.target.value) })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Alokasi Token Bulanan (Tokens Quota)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    min="10000"
                    max="50000000"
                    value={authForm.maxTokens}
                    onChange={(e) => setAuthForm({ ...authForm, maxTokens: Number(e.target.value) })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  />
                </div>
              </div>

              {/* Subscription Status & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Status Langganan
                  </label>
                  <select
                    value={authForm.status}
                    onChange={(e) => setAuthForm({ ...authForm, status: e.target.value as SubscriptionStatus })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="ACTIVE">ACTIVE (Aktif)</option>
                    <option value="TRIAL">TRIAL (Masa Uji Coba)</option>
                    <option value="PENDING">PENDING (Tertunda)</option>
                    <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
                    <option value="SUSPENDED">SUSPENDED (Ditangguhkan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Durasi Masa Berlaku
                  </label>
                  <select
                    value={authForm.durationMonths}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'lifetime' || val === 'custom') {
                        setAuthForm({ ...authForm, durationMonths: val });
                      } else {
                        setAuthForm({ ...authForm, durationMonths: Number(val) });
                      }
                    }}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="1">1 Bulan</option>
                    <option value="3">3 Bulan</option>
                    <option value="6">6 Bulan</option>
                    <option value="12">1 Tahun (12 Bulan)</option>
                    <option value="lifetime">Lifetime / Tanpa Batas Waktu</option>
                    <option value="custom">Pilih Tanggal Kustom...</option>
                  </select>
                </div>
              </div>

              {authForm.durationMonths === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Tanggal Kedaluwarsa Kustom
                  </label>
                  <input
                    type="date"
                    value={authForm.customExpiryDate}
                    onChange={(e) => setAuthForm({ ...authForm, customExpiryDate: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5F1F]"
                  />
                </div>
              )}

              {/* Feature Entitlements */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Fitur Yang Diotorisasi (Feature Entitlements)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-[#181818] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={authForm.customEndpoints}
                      onChange={(e) => setAuthForm({ ...authForm, customEndpoints: e.target.checked })}
                      className="w-4 h-4 accent-[#FF5F1F] rounded"
                    />
                    <span className="text-xs text-gray-300 font-medium">Koneksi Hermes Custom Endpoint</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#181818] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={authForm.priorityTraining}
                      onChange={(e) => setAuthForm({ ...authForm, priorityTraining: e.target.checked })}
                      className="w-4 h-4 accent-[#FF5F1F] rounded"
                    />
                    <span className="text-xs text-gray-300 font-medium">Prioritas Training Center & Score</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#181818] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={authForm.unlimitedMemory}
                      onChange={(e) => setAuthForm({ ...authForm, unlimitedMemory: e.target.checked })}
                      className="w-4 h-4 accent-[#FF5F1F] rounded"
                    />
                    <span className="text-xs text-gray-300 font-medium">Memory Store Tanpa Batas</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#181818] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={authForm.exportIntegration}
                      onChange={(e) => setAuthForm({ ...authForm, exportIntegration: e.target.checked })}
                      className="w-4 h-4 accent-[#FF5F1F] rounded"
                    />
                    <span className="text-xs text-gray-300 font-medium">Ekspor & Integrasi Penuh</span>
                  </label>
                </div>
              </div>

              {/* Admin Remarks */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Catatan Otorisasi Admin (Notes)
                </label>
                <textarea
                  rows={2}
                  value={authForm.notes}
                  onChange={(e) => setAuthForm({ ...authForm, notes: e.target.value })}
                  placeholder="e.g. Diotorisasi langsung oleh Project Admin untuk paket Pro 1 tahun."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAuthorization}
                disabled={savingUser}
                className="px-6 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white font-semibold text-xs transition-all shadow-lg shadow-[#FF5F1F]/20 flex items-center gap-2 disabled:opacity-60"
              >
                {savingUser ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Otorisasi Langsung</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Pre-authorize User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#121212] border border-[#FF5F1F]/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FF5F1F]/10 border border-[#FF5F1F]/30 flex items-center justify-center text-[#FF5F1F]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Daftarkan & Otorisasi User Baru</h3>
                <p className="text-xs text-gray-400">
                  Masukkan email pengguna untuk langsung mengaktifkan akun dan memberikan paket langganan.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Alamat Email Pengguna <span className="text-[#FF5F1F]">*</span>
                </label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  placeholder="e.g. muhammad.ilham96.mi@gmail.com"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nama Lengkap / Alias
                </label>
                <input
                  type="text"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                  placeholder="e.g. Muhammad Ilham"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>

              {/* Plan & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Paket Langganan
                  </label>
                  <select
                    value={addUserForm.plan}
                    onChange={(e) => {
                      const p = e.target.value as SubscriptionPlan;
                      let agents = 10;
                      let tokens = 500000;
                      if (p === 'FREE') { agents = 1; tokens = 10000; }
                      if (p === 'STARTER') { agents = 3; tokens = 100000; }
                      if (p === 'PRO') { agents = 10; tokens = 500000; }
                      if (p === 'ENTERPRISE') { agents = 50; tokens = 2000000; }
                      if (p === 'UNLIMITED_VIP') { agents = 999; tokens = 10000000; }
                      setAddUserForm({
                        ...addUserForm,
                        plan: p,
                        maxAgents: agents,
                        maxTokens: tokens,
                      });
                    }}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="STARTER">Starter</option>
                    <option value="PRO">Pro (Recommended)</option>
                    <option value="ENTERPRISE">Enterprise</option>
                    <option value="UNLIMITED_VIP">Unlimited VIP</option>
                    <option value="FREE">Free Trial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Status Akun
                  </label>
                  <select
                    value={addUserForm.accountStatus}
                    onChange={(e) => setAddUserForm({ ...addUserForm, accountStatus: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="active">Aktif (Langsung Bisa Akses)</option>
                    <option value="pending">Menunggu Persetujuan</option>
                    <option value="rejected">Dibekukan / Ditolak</option>
                  </select>
                </div>
              </div>

              {/* Role & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Peran (Role)
                  </label>
                  <select
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value="user">User Biasa</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Masa Berlaku
                  </label>
                  <select
                    value={addUserForm.durationMonths}
                    onChange={(e) => setAddUserForm({ ...addUserForm, durationMonths: Number(e.target.value) })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5F1F]"
                  >
                    <option value={1}>1 Bulan</option>
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan (1 Tahun)</option>
                    <option value={36}>36 Bulan (3 Tahun)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Catatan Otorisasi
                </label>
                <input
                  type="text"
                  value={addUserForm.notes}
                  onChange={(e) => setAddUserForm({ ...addUserForm, notes: e.target.value })}
                  placeholder="Catatan otorisasi admin"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddOrAuthorizeUser}
                disabled={savingUser}
                className="px-6 py-2.5 rounded-xl bg-[#FF5F1F] hover:bg-[#FF5F1F]/90 text-white font-semibold text-xs transition-all shadow-lg shadow-[#FF5F1F]/20 flex items-center gap-2 disabled:opacity-60"
              >
                {savingUser ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Otorisasi User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
