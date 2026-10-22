import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CreditCard,
  Activity,
  Cpu,
  Search,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Database,
  TrendingUp,
  Server,
  X,
  AlertTriangle,
  ArrowRight,
  FileText,
  Download,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

type Tab = 'overview' | 'users' | 'billing' | 'ops';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isDestructive?: boolean;
  onConfirm: () => Promise<void> | void;
}

function Sparkline({ points, color, height = 30 }: { points: number[]; color: string; height?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points) || 1;
  const range = max - min || 1;
  const width = 120;
  const pts = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${pts.join(' L ')}`;
  const areaD = `M 0,${height} L ${pts.join(' L ')} L ${width},${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TableSkeleton({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse border-b border-white/[0.02]">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-5 py-4">
              <div
                className="h-3.5 bg-white/[0.04] rounded-md"
                style={{ width: `${Math.max(40, 95 - ((cIdx * 13 + rIdx * 7) % 55))}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function DeveloperAvatar({ avatar, name, size = 32 }: { avatar?: string; name?: string; email?: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1a1a1a&color=fff`;

  // FE-SEC-03: Verify safe avatar URL to prevent non-HTTPS mixed content and internal IP fingerprinting
  const isSafeAvatar = Boolean(
    avatar &&
    typeof avatar === 'string' &&
    avatar.startsWith('https://') &&
    (avatar.includes('googleusercontent.com') || avatar.includes('ui-avatars.com') || avatar.includes('gravatar.com'))
  );

  if (isSafeAvatar && !imgError) {
    return (
      <img
        src={avatar}
        alt=""
        onError={() => setImgError(true)}
        style={{ width: size, height: size }}
        className="rounded-full shrink-0 border border-white/10 ring-1 ring-white/10 object-cover select-none"
      />
    );
  }

  return (
    <img
      src={fallbackUrl}
      alt=""
      style={{ width: size, height: size }}
      className="rounded-full shrink-0 border border-white/10 ring-1 ring-white/10 object-cover select-none"
    />
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const isPaid = plan === 'PAID';
  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gradient-to-r from-brand/15 to-amber-500/10 text-amber-300 border border-brand/20 shadow-[0_0_10px_rgba(255,85,0,0.12)] select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(255,85,0,0.8)]" />
        <span>Pro</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] text-textMuted/70 border border-white/[0.06] select-none">
      Free
    </span>
  );
}

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Record<Tab, boolean>>({
    overview: false,
    users: false,
    billing: false,
    ops: false,
  });

  // Overview stats state
  const [overview, setOverview] = useState<any>(null);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Credit adjustment modal state
  const [selectedUserForCredit, setSelectedUserForCredit] = useState<any | null>(null);
  const [creditAdjustmentAmount, setCreditAdjustmentAmount] = useState('10000');
  const [creditAdjustmentReason, setCreditAdjustmentReason] = useState('Customer Support Bonus');
  const [creditActionLoading, setCreditActionLoading] = useState(false);

  // Billing & Transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsPagination, setTransactionsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  // Per-user API logs state
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<any | null>(null);
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [userLogsLoading, setUserLogsLoading] = useState(false);
  const [logPathFilter, setLogPathFilter] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('');

  // Ops & Workers state
  const [workerData, setWorkerData] = useState<any>(null);
  const [cachePattern, setCachePattern] = useState('pnr:*');
  const [flushLoading, setFlushLoading] = useState(false);

  // Universal Custom Apple-grade Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('irctc_api_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // FE-SEC-02: Centralized admin fetch with automatic 401/403 session revocation & redirect
  const adminFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
    if (res.status === 401 || res.status === 403) {
      logout();
      toast.error('Session expired or administrative privileges revoked. Please sign in again.');
      throw new Error('UNAUTHORIZED');
    }
    return res;
  }, [getAuthHeaders, logout]);

  // Debounce search query by 250ms for instantaneous responsive search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(userQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [userQuery]);

  // ─── Fetchers ─────────────────────────────────────────────────────────────
  const fetchOverview = useCallback(async () => {
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/overview`);
      const data = await res.json();
      if (data.success) {
        setOverview(data.stats);
        setLoadedTabs(prev => ({ ...prev, overview: true }));
      } else {
        toast.error(data.error || 'Failed to fetch admin overview');
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Network error loading admin stats');
      }
    }
  }, [API_URL, adminFetch]);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (debouncedQuery) params.append('q', debouncedQuery);
      if (userPlanFilter) params.append('plan', userPlanFilter);
      if (userStatusFilter) params.append('status', userStatusFilter);

      const res = await adminFetch(`${API_URL}/api/v1/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        // Exclude administrative accounts from developer management table
        const developersOnly = (data.users || []).filter((u: any) => u.role !== 'admin');
        setUsers(developersOnly);
        setUsersPagination(data.pagination);
        setLoadedTabs(prev => ({ ...prev, users: true }));
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Failed to load users list');
      }
    }
  }, [API_URL, adminFetch, debouncedQuery, userPlanFilter, userStatusFilter]);

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/billing/transactions?page=${page}&limit=15`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setTransactionsPagination(data.pagination);
        setLoadedTabs(prev => ({ ...prev, billing: true }));
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Failed to load transactions');
      }
    }
  }, [API_URL, adminFetch]);

  const fetchWorkerStatus = useCallback(async () => {
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/ops/workers`);
      const data = await res.json();
      if (data.success) {
        setWorkerData(data);
        setLoadedTabs(prev => ({ ...prev, ops: true }));
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Failed to query scraper status');
      }
    }
  }, [API_URL, adminFetch]);

  const fetchUserLogs = useCallback(async (userId: string, pathF = '', statusF = '') => {
    setUserLogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (pathF) params.append('path', pathF);
      if (statusF) params.append('status', statusF);

      const res = await adminFetch(`${API_URL}/api/v1/admin/users/${userId}/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUserLogs(data.logs || []);
      } else {
        toast.error(data.error || 'Failed to fetch user logs');
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Network error loading user logs');
      }
    } finally {
      setUserLogsLoading(false);
    }
  }, [API_URL, adminFetch]);

  const openUserLogs = (targetUser: any) => {
    setSelectedUserForLogs(targetUser);
    setLogPathFilter('');
    setLogStatusFilter('');
    fetchUserLogs(targetUser._id, '', '');
  };

  // FE-SEC-01: Formula injection mitigation including leading whitespace, tabs, and DDE pipe/percent triggers
  const sanitizeCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (/^\s*[=+\-@|%]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const exportUserLogsCSV = () => {
    const logsToExport = filteredUserLogs.length > 0 ? filteredUserLogs : userLogs;
    if (!logsToExport.length || !selectedUserForLogs) return;
    const headers = ['Timestamp', 'Path', 'Status', 'Duration (ms)', 'Client IP'].map(sanitizeCsvCell).join(',');
    const rows = logsToExport.map((l: any) => [
      sanitizeCsvCell(new Date(l.time).toISOString()),
      sanitizeCsvCell(l.path),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.duration || 0),
      sanitizeCsvCell(l.ip),
    ].join(','));
    const csvContent = [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedUserForLogs.email.replace(/[@.]/g, '_')}_api_logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Downloaded API logs CSV');
  };

  const requestClearUserLogs = (targetUser: any) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Purge Developer API Logs?',
      description: `Are you sure you want to completely erase all live API request logs stored in Redis for ${targetUser.email}? This action is immediate and cannot be undone.`,
      confirmLabel: 'Purge Logs',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await adminFetch(`${API_URL}/api/v1/admin/users/${targetUser._id}/logs`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message);
            setUserLogs([]);
          } else {
            toast.error(data.error || 'Failed to clear logs');
          }
        } catch (err: any) {
          if (err.message !== 'UNAUTHORIZED') {
            toast.error('Network error clearing logs');
          }
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const refreshActiveTab = useCallback(async (force = false) => {
    setIsSyncing(true);
    if (activeTab === 'overview') {
      if (force || !loadedTabs.overview) await fetchOverview();
    } else if (activeTab === 'users') {
      if (force || !loadedTabs.users) await fetchUsers(usersPagination.page);
    } else if (activeTab === 'billing') {
      if (force || !loadedTabs.billing) await fetchTransactions(transactionsPagination.page);
    } else if (activeTab === 'ops') {
      if (force || !loadedTabs.ops) await fetchWorkerStatus();
    }
    setIsSyncing(false);
  }, [activeTab, fetchOverview, fetchUsers, fetchTransactions, fetchWorkerStatus, usersPagination.page, transactionsPagination.page, loadedTabs]);

  useEffect(() => {
    refreshActiveTab();
  }, [activeTab, refreshActiveTab]);

  useEffect(() => {
    if (activeTab === 'users' && loadedTabs.users) {
      fetchUsers(1);
    }
  }, [debouncedQuery, userPlanFilter, userStatusFilter]);

  // ─── Actions with Apple Dialog ──────────────────────────────────────────
  const requestToggleUserStatus = (targetUser: any) => {
    const newStatus = targetUser.isActive === false;
    const actionLabel = newStatus ? 'Reactivate' : 'Deactivate & Ban';

    setConfirmDialog({
      isOpen: true,
      title: `${actionLabel} Developer Account`,
      description: newStatus
        ? `Are you sure you want to reactivate access for ${targetUser.email}? Their API keys will be permitted immediately.`
        : `Are you sure you want to ban ${targetUser.email}? All active API keys will be immediately purged from Redis cache and forbidden.`,
      confirmLabel: actionLabel,
      isDestructive: !newStatus,
      onConfirm: async () => {
        try {
          const res = await adminFetch(`${API_URL}/api/v1/admin/users/${targetUser._id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive: newStatus }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message);
            fetchUsers(usersPagination.page);
          } else {
            toast.error(data.error || 'Failed to update user status');
          }
        } catch (err: any) {
          if (err.message !== 'UNAUTHORIZED') {
            toast.error('Network error updating user');
          }
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleAdjustCreditsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForCredit) return;

    const amount = parseInt(creditAdjustmentAmount, 10);
    if (isNaN(amount) || amount === 0) {
      toast.error('Please enter a valid non-zero credit amount');
      return;
    }

    setCreditActionLoading(true);
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/users/${selectedUserForCredit._id}/credits`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason: creditAdjustmentReason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setSelectedUserForCredit(null);
        fetchUsers(usersPagination.page);
      } else {
        toast.error(data.error || 'Failed to adjust credits');
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Network error during credit adjustment');
      }
    } finally {
      setCreditActionLoading(false);
    }
  };

  const requestReconcile = (transactionId: string, orderId: string, userEmail: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Force Reconcile Payment',
      description: `Grant 100,000 API credits to ${userEmail} for Order ${orderId}? This will atomically set transaction status to credited and upgrade account to Pro.`,
      confirmLabel: 'Grant 100,000 Credits',
      isDestructive: false,
      onConfirm: async () => {
        setReconcilingId(transactionId);
        try {
          const res = await adminFetch(`${API_URL}/api/v1/admin/billing/reconcile/${transactionId}`, {
            method: 'POST',
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message);
            fetchTransactions(transactionsPagination.page);
          } else {
            toast.error(data.error || 'Failed to reconcile payment');
          }
        } catch (err: any) {
          if (err.message !== 'UNAUTHORIZED') {
            toast.error('Network error reconciling payment');
          }
        } finally {
          setReconcilingId(null);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const requestFlushCache = () => {
    if (!cachePattern) return;
    const isWipeAll = cachePattern === '*';

    setConfirmDialog({
      isOpen: true,
      title: isWipeAll ? 'Wipe Entire Engine Redis Cache?' : `Purge Matching Cache Keys (${cachePattern})`,
      description: isWipeAll
        ? 'WARNING: This will completely flush all cached route lookups, active train positions, and API key warm cache across the whole platform.'
        : `Dispatches a non-blocking scan stream to invalidate all cached keys matching the pattern "${cachePattern}".`,
      confirmLabel: isWipeAll ? 'Flush Entire Database' : 'Purge Pattern',
      isDestructive: true,
      onConfirm: async () => {
        setFlushLoading(true);
        try {
          const res = await adminFetch(`${API_URL}/api/v1/admin/ops/cache/flush`, {
            method: 'POST',
            body: JSON.stringify({ pattern: cachePattern, confirm: isWipeAll }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error(data.error || 'Failed to flush cache');
          }
        } catch (err: any) {
          if (err.message !== 'UNAUTHORIZED') {
            toast.error('Network error flushing cache');
          }
        } finally {
          setFlushLoading(false);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Projected credit calculation for modal
  const projectedBalance = useMemo(() => {
    if (!selectedUserForCredit) return 0;
    const delta = parseInt(creditAdjustmentAmount, 10);
    if (isNaN(delta)) return selectedUserForCredit.apiCredits || 0;
    return Math.max(0, (selectedUserForCredit.apiCredits || 0) + delta);
  }, [selectedUserForCredit, creditAdjustmentAmount]);

  // Status counts calculation for per-user telemetry filter chips (UX-FLAW-03)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: userLogs.length,
      '200': 0,
      '400': 0,
      '401': 0,
      '402': 0,
      '429': 0,
      '500': 0,
    };
    userLogs.forEach((l) => {
      const s = String(l.status);
      if (counts[s] !== undefined) counts[s]++;
      else if (l.status >= 500) counts['500']++;
    });
    return counts;
  }, [userLogs]);

  // FE-SEC-06: Instant in-memory client filtering preventing per-keystroke network flooding
  const filteredUserLogs = useMemo(() => {
    let logs = userLogs;
    if (logPathFilter.trim()) {
      const q = logPathFilter.toLowerCase();
      logs = logs.filter((l: any) => l.path && l.path.toLowerCase().includes(q));
    }
    if (logStatusFilter) {
      logs = logs.filter((l: any) => {
        if (logStatusFilter === '402') return l.status === 401 || l.status === 402;
        return String(l.status) === logStatusFilter;
      });
    }
    return logs;
  }, [userLogs, logPathFilter, logStatusFilter]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none sm:select-auto">
      {/* ─── Top Header Bar (Apple Minimal Chrome) ───────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1a1a1f] to-[#0f0f12] border border-white/10 flex items-center justify-center text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-textMain" style={{ textWrap: 'balance' }}>
                  Admin Console
                </h1>
              </div>
              <p className="text-xs text-textMuted mt-0.5">
                <span className="text-textMain/90 font-mono font-medium">{user?.email}</span> • Production Gateway Operational
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refreshActiveTab(true)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#131418] hover:bg-[#1c1d22] active:scale-[0.97] transition-all duration-150 border border-white/10 rounded-xl text-textMuted hover:text-textMain shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-brand' : ''} />
            <span>Sync Live State</span>
          </button>
        </div>
      </div>

      {/* ─── Segmented Control Sub-Tabs (Apple Glass Pill) ────────────── */}
      <div className="inline-flex p-1 bg-[#0c0d10] border border-white/[0.08] rounded-2xl mb-8 shadow-inner overflow-x-auto max-w-full">
        {[
          { id: 'overview', label: 'Overview & Telemetry', icon: <Activity size={14} /> },
          { id: 'users', label: 'Developer Accounts', icon: <Users size={14} /> },
          { id: 'billing', label: 'Transactions & Ledger', icon: <CreditCard size={14} /> },
          { id: 'ops', label: 'Workers & Infrastructure', icon: <Cpu size={14} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive ? 'text-white' : 'text-textMuted hover:text-textMain/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-tab-pill"
                  className="absolute inset-0 bg-[#1e2026] border border-white/[0.12] rounded-xl shadow-md"
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {React.cloneElement(tab.icon, {
                  className: isActive ? 'text-brand' : 'text-textMuted',
                })}
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT (STABILIZED MIN-HEIGHT PREVENTS CLS) ───────── */}
      <div className="min-h-[620px]">
        {/* ─── TAB 1: OVERVIEW & TELEMETRY ──────────────────────────────── */}
        {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics with Micro-Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-textMuted mb-2.5">
                  <span className="text-xs font-medium">Developer Accounts</span>
                  <Users size={16} className="text-brand/90" />
                </div>
                <div className="text-3xl font-semibold font-mono tracking-tight text-textMain tabular-nums">
                  {overview?.users?.total?.toLocaleString() ?? '—'}
                </div>
                <div className="text-[11px] text-textMuted mt-1.5 flex items-center gap-1.5 font-mono">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">+{overview?.users?.newToday ?? 0}</span> onboarded today
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/[0.04]">
                <Sparkline points={[2, 3, 5, 8, 12, 17, Math.max(18, overview?.users?.total || 20)]} color="#FF5500" height={28} />
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-textMuted mb-2.5">
                  <span className="text-xs font-medium">Captured Revenue</span>
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <div className="text-3xl font-semibold font-mono tracking-tight text-emerald-400 tabular-nums">
                  ₹{overview?.financials?.totalRevenueInr?.toLocaleString() ?? 0}
                </div>
                <div className="text-[11px] text-textMuted mt-1.5 font-mono">
                  {overview?.financials?.totalTransactions ?? 0} credit pack payments settled
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/[0.04]">
                <Sparkline points={[0, 99, 198, 297, 495, 693, Math.max(792, overview?.financials?.totalRevenueInr || 891)]} color="#10B981" height={28} />
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-textMuted mb-2.5">
                  <span className="text-xs font-medium">In-Memory Railway Corpus</span>
                  <Database size={16} className="text-cyan-400" />
                </div>
                <div className="text-3xl font-semibold font-mono tracking-tight text-textMain tabular-nums">
                  {overview?.system?.engineDataset?.trains?.toLocaleString() ?? '10,647'}
                </div>
                <div className="text-[11px] text-textMuted mt-1.5 font-mono">
                  Indexing {overview?.system?.engineDataset?.stations?.toLocaleString() ?? '9,538'} station nodes
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/[0.04]">
                <Sparkline points={[10647, 10647, 10647, 10647, 10647, 10647, 10647]} color="#06B6D4" height={28} />
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-textMuted mb-2.5">
                  <span className="text-xs font-medium">Runtime Node Memory</span>
                  <Server size={16} className="text-amber-400" />
                </div>
                <div className="text-3xl font-semibold font-mono tracking-tight text-textMain tabular-nums">
                  {overview?.system?.memory?.heapUsedMb ?? 0} <span className="text-sm font-normal text-textMuted font-sans">MB</span>
                </div>
                <div className="text-[11px] text-textMuted mt-1.5 font-mono">
                  Uptime: {Math.floor((overview?.system?.uptimeSeconds ?? 0) / 3600)}h {Math.floor(((overview?.system?.uptimeSeconds ?? 0) % 3600) / 60)}m
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/[0.04]">
                <Sparkline points={[68, 82, 75, 89, 81, 79, Math.max(60, overview?.system?.memory?.heapUsedMb || 85)]} color="#F59E0B" height={28} />
              </div>
            </div>
          </div>

          {/* Quick Dual Ledger Feed (Linear & Stripe Precision Standard) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-textMain tracking-tight">Recent Signups</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-textMuted font-medium">
                    {overview?.recentSignups?.length || 0}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="text-xs text-textMuted hover:text-textMain font-mono transition-colors inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {(overview?.recentSignups || []).map((u: any) => (
                  <div
                    key={u._id}
                    onClick={() => openUserLogs(u)}
                    className="py-3 px-3 -mx-3 rounded-xl flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer group"
                  >
                    {/* Profile Picture & Identity */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <DeveloperAvatar avatar={u.avatar} name={u.name} email={u.email} size={32} />
                      <div className="truncate min-w-0">
                        <p className="font-medium text-textMain text-xs truncate group-hover:text-brand transition-colors">{u.name}</p>
                        <p className="text-[11px] text-textMuted/70 font-mono truncate">{u.email}</p>
                      </div>
                    </div>

                    {/* Plan Status Pill */}
                    <div className="shrink-0">
                      <PlanBadge plan={u.plan} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-textMain tracking-tight">Recent Transactions</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-textMuted font-medium">
                    {overview?.recentTransactions?.length || 0}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className="text-xs text-textMuted hover:text-textMain font-mono transition-colors inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {(overview?.recentTransactions || []).length === 0 ? (
                  <p className="text-xs text-textMuted py-8 text-center font-mono">No payment transactions recorded yet.</p>
                ) : (
                  (overview?.recentTransactions || []).map((t: any) => (
                    <div
                      key={t._id}
                      onClick={() => setActiveTab('billing')}
                      className="py-3 px-3 -mx-3 rounded-xl flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer group"
                    >
                      <div className="truncate min-w-0 flex-1">
                        <p className="font-mono text-textMain text-xs truncate group-hover:text-brand transition-colors tracking-wide">{t.paymentId}</p>
                        <p className="text-[11px] text-textMuted/70 font-mono truncate">{t.userId?.email || 'Developer'}</p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-400 text-right shrink-0 tabular-nums">
                        ₹{Math.round(t.amount / 100)}
                      </span>
                      <div className="shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider uppercase ${
                          t.credited
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {t.credited ? 'Settled' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: DEVELOPER ACCOUNTS ─────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Instant Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
              <input
                type="text"
                placeholder="Instant search by developer name or email..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#08080a] border border-white/10 rounded-xl text-xs text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-brand/60 transition-colors"
              />
              {userQuery && (
                <button
                  type="button"
                  onClick={() => setUserQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain p-0.5 rounded cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userPlanFilter}
                onChange={(e) => setUserPlanFilter(e.target.value)}
                className="px-3 py-2 bg-[#08080a] border border-white/10 rounded-xl text-xs text-textMain focus:outline-none focus:border-brand/60 cursor-pointer"
              >
                <option value="">All Plans</option>
                <option value="FREE">Free Tier</option>
                <option value="PAID">Pro Tier</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#08080a] border border-white/10 rounded-xl text-xs text-textMain focus:outline-none focus:border-brand/60 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="disabled">Banned Only</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#08080a] border-b border-white/[0.06] text-textMuted font-mono text-[10px] tracking-widest uppercase">
                  <tr>
                    <th className="px-5 py-3.5">Developer Identity</th>
                    <th className="px-4 py-3.5">Subscription</th>
                    <th className="px-4 py-3.5">Credit Quota</th>
                    <th className="px-4 py-3.5">Requests Served</th>
                    <th className="px-4 py-3.5">Key Inventory</th>
                    <th className="px-4 py-3.5">Account State</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {!loadedTabs.users ? (
                    <TableSkeleton rows={6} cols={7} />
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-textMuted font-mono">
                        No developer accounts matched the active filters.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isBanned = u.isActive === false;
                      const isCurrentAdmin = u._id === user?._id;
                      return (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <DeveloperAvatar avatar={u.avatar} name={u.name} email={u.email} size={30} />
                              <div className="min-w-0">
                                <p className="font-medium text-textMain truncate">{u.name}</p>
                                <p className="text-[11px] text-textMuted/70 font-mono truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <PlanBadge plan={u.plan} />
                          </td>
                          <td className="px-4 py-3.5 font-mono font-semibold text-textMain tabular-nums">
                            {u.apiCredits?.toLocaleString() ?? 0}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-textMuted text-[11px] tabular-nums">
                            {(u.totalRequests ?? 0).toLocaleString()} reqs
                          </td>
                          <td className="px-4 py-3.5 font-mono text-textMuted text-[11px] tabular-nums">
                            {u.keyCount || 0} active keys
                          </td>
                          <td className="px-4 py-3.5">
                            {isBanned ? (
                              <span className="inline-flex items-center gap-1.5 text-red-400 font-mono text-[11px]">
                                <XCircle size={13} /> Deactivated
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                                <CheckCircle2 size={13} /> Operational
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openUserLogs(u)}
                                className="px-2.5 py-1 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-[0.97] transition-all border border-white/10 rounded-lg text-brand hover:text-brand/90 shadow-sm cursor-pointer inline-flex items-center gap-1 font-medium"
                              >
                                <FileText size={12} />
                                <span>Logs</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedUserForCredit(u)}
                                className="px-2.5 py-1 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-[0.97] transition-all border border-white/10 rounded-lg text-textMain shadow-sm cursor-pointer"
                              >
                                Adjust Credits
                              </button>
                              {!isCurrentAdmin && (
                                <button
                                  type="button"
                                  onClick={() => requestToggleUserStatus(u)}
                                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all active:scale-[0.97] shadow-sm cursor-pointer ${
                                    isBanned
                                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                                  }`}
                                >
                                  {isBanned ? 'Unban' : 'Ban'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs text-textMuted font-mono">
              <span>Showing {users.length} of {usersPagination.total} accounts</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={usersPagination.page <= 1}
                  onClick={() => fetchUsers(usersPagination.page - 1)}
                  className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  Previous
                </button>
                <span className="tabular-nums">{usersPagination.page} / {usersPagination.totalPages}</span>
                <button
                  type="button"
                  disabled={usersPagination.page >= usersPagination.totalPages}
                  onClick={() => fetchUsers(usersPagination.page + 1)}
                  className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: TRANSACTIONS & REVENUE ─────────────────────────────── */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#08080a] border-b border-white/[0.06] text-textMuted font-mono text-[10px] tracking-widest uppercase">
                  <tr>
                    <th className="px-5 py-3.5">Settlement Timestamp</th>
                    <th className="px-4 py-3.5">Developer</th>
                    <th className="px-4 py-3.5">Settled Amount</th>
                    <th className="px-4 py-3.5">Payment Reference</th>
                    <th className="px-4 py-3.5">Order Reference</th>
                    <th className="px-4 py-3.5">Gateway Status</th>
                    <th className="px-5 py-3.5 text-right">Quota Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {!loadedTabs.billing ? (
                    <TableSkeleton rows={6} cols={7} />
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-textMuted font-mono">
                        No transactions recorded in database.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5 font-mono text-[11px] text-textMuted tabular-nums">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-textMain">{tx.userId?.name || 'Developer'}</p>
                          <p className="font-mono text-[11px] text-textMuted">{tx.userId?.email || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-semibold text-emerald-400 tabular-nums">
                          ₹{Math.round(tx.amount / 100)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-textMuted text-[11px] tracking-wide">
                          {tx.paymentId}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-textMuted text-[11px] tracking-wide">
                          {tx.orderId}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {tx.credited ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                              <CheckCircle2 size={13} /> 100,000 Granted
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={reconcilingId === tx._id}
                              onClick={() => requestReconcile(tx._id, tx.orderId, tx.userId?.email || 'Developer')}
                              className="px-3 py-1 text-[11px] bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-500/30 text-amber-400 rounded-lg transition-all font-mono shadow-sm cursor-pointer"
                            >
                              {reconcilingId === tx._id ? 'Allocating...' : 'Force Reconcile'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs text-textMuted font-mono">
              <span>Total Transactions: {transactionsPagination.total}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={transactionsPagination.page <= 1}
                  onClick={() => fetchTransactions(transactionsPagination.page - 1)}
                  className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  Previous
                </button>
                <span className="tabular-nums">{transactionsPagination.page} / {transactionsPagination.totalPages}</span>
                <button
                  type="button"
                  disabled={transactionsPagination.page >= transactionsPagination.totalPages}
                  onClick={() => fetchTransactions(transactionsPagination.page + 1)}
                  className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: WORKERS & SCRAPERS ─────────────────────────────────── */}
      {activeTab === 'ops' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PNR Worker Card */}
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-textMain">PNR Scraper Headless Worker</h3>
                    <p className="text-[11px] text-textMuted">Single-browser multi-tab persistent pool</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
                  workerData?.workers?.pnrWorker?.isRunning
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${workerData?.workers?.pnrWorker?.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {workerData?.workers?.pnrWorker?.isRunning ? 'Active' : 'Offline'}
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-textMuted">Chromium Instance Hook:</span>
                  <span className="text-textMain font-semibold">{workerData?.workers?.pnrWorker?.activeBrowser ? 'Alive & Connected' : 'Disconnected'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-textMuted">Pending Job Queue:</span>
                  <span className="text-textMain tabular-nums">{workerData?.workers?.pnrWorker?.queueLength ?? 0} jobs in memory</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-textMuted">Auto-Restart Status:</span>
                  <span className="text-textMain">{workerData?.workers?.pnrWorker?.isRestarting ? 'Restarting...' : 'Idle / Stable'}</span>
                </div>
              </div>
            </div>

            {/* Live Status Worker Card */}
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-textMain">Live Train Status Pipeline</h3>
                    <p className="text-[11px] text-textMuted">Sub-200ms Direct Gateway Scraper</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {workerData?.workers?.liveWorker?.provider || 'confirmtkt-fetch'}
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-textMuted">Engine Mode:</span>
                  <span className="text-emerald-400 font-semibold">Zero-Browser Direct HTTP Fetch</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-textMuted">Concurrent Pipeline Jobs:</span>
                  <span className="text-textMain tabular-nums">{workerData?.workers?.liveWorker?.activeJobs ?? 0} active</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-textMuted">Execution Timeout Ceiling:</span>
                  <span className="text-textMain tabular-nums">{workerData?.workers?.liveWorker?.jobTimeoutMs ?? 30000} ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Redis Cache Key Management */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                <Database size={16} />
              </div>
              <h3 className="text-sm font-semibold text-textMain">Redis Key Management & Eviction</h3>
            </div>
            <p className="text-xs text-textMuted mb-5 leading-relaxed">
              Dispatches a non-blocking stream scan over Redis keys matching a key pattern and invalidates them instantly without stopping the event loop.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="Key pattern (e.g., pnr:*, train:live:*, apikey:*)"
                value={cachePattern}
                onChange={(e) => setCachePattern(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-brand/60 transition-colors"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCachePattern('pnr:*')}
                  className="px-3 py-2 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  pnr:*
                </button>
                <button
                  type="button"
                  onClick={() => setCachePattern('train:live:*')}
                  className="px-3 py-2 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  train:live:*
                </button>
                <button
                  type="button"
                  onClick={() => setCachePattern('apikey:*')}
                  className="px-3 py-2 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  apikey:*
                </button>
                <button
                  type="button"
                  disabled={flushLoading}
                  onClick={requestFlushCache}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 active:scale-[0.97] text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {flushLoading ? 'Purging...' : 'Purge Matching'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ─── APPLE MODAL: ADJUST USER CREDITS ─────────────────────────── */}
      <AnimatePresence>
        {selectedUserForCredit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="w-full max-w-md bg-[#111216] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative"
            >
              {/* Apple Mobile Bottom Sheet Grab Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-semibold text-textMain tracking-tight">
                  Adjust Developer Credits
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedUserForCredit(null)}
                  className="p-1 rounded-lg text-textMuted hover:text-textMain hover:bg-white/5 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-[#090a0d] border border-white/[0.06] rounded-2xl p-3.5 mb-5 space-y-1.5 text-xs">
                <div className="flex justify-between text-textMuted font-mono">
                  <span>Account:</span>
                  <span className="text-textMain font-medium">{selectedUserForCredit.email}</span>
                </div>
                <div className="flex justify-between text-textMuted font-mono">
                  <span>Current Balance:</span>
                  <span className="text-textMain font-semibold tabular-nums">{selectedUserForCredit.apiCredits?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between text-textMuted font-mono pt-1.5 border-t border-white/[0.04]">
                  <span>Projected Balance:</span>
                  <span className="text-emerald-400 font-bold tabular-nums flex items-center gap-1">
                    {projectedBalance.toLocaleString()} cr <ArrowRight size={11} />
                  </span>
                </div>
              </div>

              <form onSubmit={handleAdjustCreditsSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-textMuted font-medium mb-1.5">
                    Credit Delta (Positive to add, Negative to deduct)
                  </label>
                  <input
                    type="number"
                    required
                    value={creditAdjustmentAmount}
                    onChange={(e) => setCreditAdjustmentAmount(e.target.value)}
                    placeholder="+10000 or -5000"
                    className="w-full px-3.5 py-2.5 bg-[#08080a] border border-white/10 rounded-xl font-mono text-sm text-textMain focus:outline-none focus:border-brand/60"
                  />
                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {['+10000', '+50000', '+100000', '-5000', '-10000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCreditAdjustmentAmount(preset.replace('+', ''))}
                        className="px-2.5 py-1 text-[10px] bg-[#1a1b22] hover:bg-white/10 border border-white/10 rounded-lg font-mono text-textMuted hover:text-textMain active:scale-95 transition-all cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-textMuted font-medium mb-1.5">Reason / Audit Trail</label>
                  <input
                    type="text"
                    required
                    value={creditAdjustmentReason}
                    onChange={(e) => setCreditAdjustmentReason(e.target.value)}
                    placeholder="Audit rationale"
                    className="w-full px-3.5 py-2 bg-[#08080a] border border-white/10 rounded-xl text-textMain focus:outline-none focus:border-brand/60"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setSelectedUserForCredit(null)}
                    className="px-4 py-2 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-medium transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creditActionLoading}
                    className="px-5 py-2 bg-brand hover:bg-brand/90 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand/20 disabled:opacity-50 cursor-pointer"
                  >
                    {creditActionLoading ? 'Saving...' : 'Apply Credit Change'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPLE MODAL: DEVELOPER API LOGS VIEWER ───────────────────── */}
      <AnimatePresence>
        {selectedUserForLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="w-full max-w-5xl bg-[#0f1014] border border-white/[0.12] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden relative"
            >
              {/* Apple Mobile Bottom Sheet Grab Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-textMain tracking-tight">
                        Developer Request Telemetry
                      </h3>
                      <PlanBadge plan={selectedUserForLogs.plan} />
                    </div>
                    <p className="text-xs text-textMuted font-mono mt-0.5">
                      Target: <span className="text-textMain font-medium">{selectedUserForLogs.email}</span> ({selectedUserForLogs.name})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fetchUserLogs(selectedUserForLogs._id, logPathFilter, logStatusFilter)}
                    disabled={userLogsLoading}
                    className="p-2 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain transition-all cursor-pointer"
                    title="Refresh logs"
                  >
                    <RefreshCw size={14} className={userLogsLoading ? 'animate-spin text-brand' : ''} />
                  </button>
                  <button
                    type="button"
                    disabled={!userLogs.length}
                    onClick={exportUserLogsCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMain text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>CSV</span>
                  </button>
                  <button
                    type="button"
                    disabled={!userLogs.length}
                    onClick={() => requestClearUserLogs(selectedUserForLogs)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 active:scale-95 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Purge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUserForLogs(null)}
                    className="p-1.5 rounded-xl text-textMuted hover:text-textMain hover:bg-white/5 cursor-pointer ml-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Quick Telemetry KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 shrink-0 font-mono text-xs">
                <div className="bg-[#090a0d] border border-white/[0.06] rounded-xl p-3">
                  <span className="text-[10px] text-textMuted uppercase tracking-wider block mb-1">Total Hits</span>
                  <span className="text-lg font-bold text-textMain tabular-nums">{userLogs.length}</span>
                </div>
                <div className="bg-[#090a0d] border border-white/[0.06] rounded-xl p-3">
                  <span className="text-[10px] text-textMuted uppercase tracking-wider block mb-1">Success Rate</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {userLogs.length
                      ? `${Math.round((userLogs.filter((l) => l.status >= 200 && l.status < 300).length / userLogs.length) * 100)}%`
                      : '—'}
                  </span>
                </div>
                <div className="bg-[#090a0d] border border-white/[0.06] rounded-xl p-3">
                  <span className="text-[10px] text-textMuted uppercase tracking-wider block mb-1">Errors (4xx/5xx)</span>
                  <span className="text-lg font-bold text-amber-400 tabular-nums">
                    {userLogs.filter((l) => l.status >= 400).length}
                  </span>
                </div>
                <div className="bg-[#090a0d] border border-white/[0.06] rounded-xl p-3">
                  <span className="text-[10px] text-textMuted uppercase tracking-wider block mb-1">Avg Latency</span>
                  <span className="text-lg font-bold text-cyan-400 tabular-nums">
                    {userLogs.length
                      ? `${Math.round(userLogs.reduce((acc, l) => acc + (l.duration || 0), 0) / userLogs.length)}ms`
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Logs Search & Filter Strip with Dynamic Status Chips (UX-FLAW-03) */}
              <div className="flex flex-col gap-2.5 pb-3 shrink-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter by endpoint path (e.g. /api/v1/live)..."
                      value={logPathFilter}
                      onChange={(e) => setLogPathFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-brand/60 transition-colors"
                    />
                  </div>

                  {/* Horizontal Tactile Status Filter Chips with Live Badge Counts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                    {[
                      { label: 'All', value: '', count: statusCounts.all, color: 'text-textMain' },
                      { label: '200 OK', value: '200', count: statusCounts['200'], color: 'text-emerald-400' },
                      { label: '400 Bad', value: '400', count: statusCounts['400'], color: 'text-amber-400' },
                      { label: '401/402 Auth', value: '402', count: (statusCounts['401'] || 0) + (statusCounts['402'] || 0), color: 'text-amber-400' },
                      { label: '429 Rate', value: '429', count: statusCounts['429'], color: 'text-amber-400' },
                      { label: '500 Err', value: '500', count: statusCounts['500'], color: 'text-red-400' },
                    ].map((pill) => {
                      const isSelected = logStatusFilter === pill.value;
                      return (
                        <button
                          key={pill.label}
                          type="button"
                          onClick={() => setLogStatusFilter(pill.value)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer border active:scale-95 ${
                            isSelected
                              ? 'bg-[#1e2026] border-white/20 text-white font-semibold shadow-sm'
                              : 'bg-[#08080a] hover:bg-white/5 border-white/[0.06] text-textMuted hover:text-textMain'
                          }`}
                        >
                          <span>{pill.label}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] bg-white/[0.04] ${pill.color} font-medium tabular-nums`}>
                            {pill.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Logs Table Container with Zero CLS Skeleton (UX-FLAW-01) */}
              <div className="flex-1 overflow-y-auto border border-white/[0.08] rounded-2xl bg-[#0a0b0e] shadow-inner scrollbar-thin">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#08080a] border-b border-white/[0.06] text-textMuted font-mono text-[10px] uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2.5">Timestamp</th>
                      <th className="px-3 py-2.5">Endpoint Route</th>
                      <th className="px-3 py-2.5">HTTP Status</th>
                      <th className="px-3 py-2.5">Latency</th>
                      <th className="px-4 py-2.5 text-right">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-mono">
                    {userLogsLoading ? (
                      <TableSkeleton rows={6} cols={5} />
                    ) : filteredUserLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-textMuted">
                          No API calls recorded for this user matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUserLogs.map((log, idx) => {
                        const is2xx = log.status >= 200 && log.status < 300;
                        const is4xx = log.status >= 400 && log.status < 500;
                        const timeStr = new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                        return (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-2 text-textMuted text-[11px] whitespace-nowrap tabular-nums">
                              {timeStr}
                            </td>
                            <td className="px-3 py-2 text-textMain font-medium max-w-[280px] truncate" title={log.path}>
                              {log.path}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider ${
                                is2xx
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : is4xx
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-textMuted text-[11px] tabular-nums">
                              {log.duration ?? 0}ms
                            </td>
                            <td className="px-4 py-2 text-right text-textMuted/70 text-[11px]">
                              {log.ip || '127.0.0.1'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPLE MODAL: UNIVERSAL CONFIRMATION DIALOG ───────────────── */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="w-full max-w-md bg-[#111216] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative"
            >
              {/* Apple Mobile Bottom Sheet Grab Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                  confirmDialog.isDestructive
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-brand/10 border-brand/20 text-brand'
                }`}>
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-base font-semibold text-textMain tracking-tight">
                  {confirmDialog.title}
                </h3>
              </div>

              <p className="text-xs text-textMuted leading-relaxed mb-6">
                {confirmDialog.description}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmDialog.onConfirm()}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer ${
                    confirmDialog.isDestructive
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                      : 'bg-brand hover:bg-brand/90 text-white shadow-brand/20'
                  }`}
                >
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
