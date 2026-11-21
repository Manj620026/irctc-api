import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Trash2,
  Radio,
  Play,
  Pause,
  Eye,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import ChartDayPanel from './ChartDayPanel';
import { formatAgo, formatDateLabel, formatIstAt, formatIstTime, type ChartTodaySummary } from './chartDay';
import { exportCsv } from '../../lib/csv';
import { API_URL, getAuthToken } from '../../lib/api';

type Tab = 'overview' | 'traffic' | 'users' | 'billing' | 'ops';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isDestructive?: boolean;
  showBanReasonInput?: boolean;
  onConfirm: (banReason?: string) => Promise<void> | void;
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

  // FE-SEC-03: Verify exact HTTPS hostname allowlist to prevent tracking pixel / URL substring bypass
  const isSafeAvatar = (() => {
    if (!avatar || typeof avatar !== 'string') return false;
    try {
      const u = new URL(avatar);
      if (u.protocol !== 'https:') return false;
      const h = u.hostname.toLowerCase();
      return (
        h === 'ui-avatars.com' ||
        h === 'gravatar.com' ||
        h.endsWith('.gravatar.com') ||
        h.endsWith('.googleusercontent.com')
      );
    } catch {
      return false;
    }
  })();

  if (isSafeAvatar && !imgError) {
    return (
      <img
        src={avatar}
        alt=""
        referrerPolicy="no-referrer"
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
  if (plan === 'PAID') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gradient-to-r from-brand/15 to-amber-500/10 text-amber-300 border border-brand/20 shadow-[0_0_10px_rgba(255,85,0,0.12)] select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(255,85,0,0.8)]" />
        <span>Pro</span>
      </span>
    );
  }
  const label = plan && plan !== 'FREE' ? plan : 'Free';
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] text-textMuted/70 border border-white/[0.06] select-none">
      {label}
    </span>
  );
}

function PaginationBar({
  label,
  page,
  totalPages,
  onPage,
}: {
  label: string;
  page: number;
  totalPages: number;
  onPage: (nextPage: number) => void;
}) {
  return (
    <div className="px-5 py-3 border-t border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs text-textMuted font-mono">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          Previous
        </button>
        <span className="tabular-nums">{page} / {totalPages}</span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function formatUptime(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Record<Tab, boolean>>({
    overview: false,
    traffic: false,
    users: false,
    billing: false,
    ops: false,
  });
  const [tabErrors, setTabErrors] = useState<Partial<Record<Tab, string>>>({});

  // Overview stats state
  const [overview, setOverview] = useState<any>(null);

  // Live Traffic SSE State
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState<{ rps: number; activeUsers: number; uptimeSeconds?: number }>({ rps: 0, activeUsers: 0 });
  const [isTrafficPaused, setIsTrafficPaused] = useState(false);
  const isPausedRef = useRef(isTrafficPaused);
  useEffect(() => {
    isPausedRef.current = isTrafficPaused;
  }, [isTrafficPaused]);
  const [trafficFilter, setTrafficFilter] = useState<'all' | '2xx' | '4xx' | '5xx' | '429'>('all');
  const [trafficSearch, setTrafficSearch] = useState('');
  const [selectedLiveLog, setSelectedLiveLog] = useState<any | null>(null);
  const [sseConnected, setSseConnected] = useState(false);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const lastUsersFilterKeyRef = useRef<string | null>(null);

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
  const userLogsAbortRef = useRef<AbortController | null>(null);
  const [userLogsLoading, setUserLogsLoading] = useState(false);
  const [logPathFilter, setLogPathFilter] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('');

  // Ops & Workers state
  const [workerData, setWorkerData] = useState<any>(null);
  const [cachePattern, setCachePattern] = useState('pnr:*');
  const [flushLoading, setFlushLoading] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<Record<string, string>>({});
  const [switchingCategory, setSwitchingCategory] = useState<string | null>(null);
  const [refreshingOps, setRefreshingOps] = useState(false);
  const [chartPanelOpen, setChartPanelOpen] = useState(false);
  const closeChartPanel = useCallback(() => setChartPanelOpen(false), []);

  // Universal Custom Apple-grade Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });
  const [banReasonInput, setBanReasonInput] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
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

  const adminRequest = useCallback(async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const res = await adminFetch(url, options);
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      throw new Error('Invalid JSON response from server');
    }
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
    }
    return data as T;
  }, [adminFetch]);

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
      const data = await adminRequest(`${API_URL}/api/v1/admin/overview`);
      setOverview(data.stats);
      setTabErrors(prev => ({ ...prev, overview: undefined }));
      setLoadedTabs(prev => ({ ...prev, overview: true }));
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        const msg = err.message || 'Network error loading admin stats';
        setTabErrors(prev => ({ ...prev, overview: msg }));
        toast.error(msg);
      }
    }
  }, [adminRequest]);

  const fetchTrafficHistory = useCallback(async () => {
    try {
      const data = await adminRequest(`${API_URL}/api/v1/admin/traffic/history?limit=100`);
      if (Array.isArray(data.logs)) {
        setLiveLogs(prev => {
          const seen = new Set(prev.map(x => x.id).filter(Boolean));
          return [...prev, ...data.logs.filter((x: any) => !x.id || !seen.has(x.id))].slice(0, 250);
        });
        setTabErrors(prev => ({ ...prev, traffic: undefined }));
        setLoadedTabs(prev => ({ ...prev, traffic: true }));
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        const msg = err.message || 'Failed to load traffic history';
        setTabErrors(prev => ({ ...prev, traffic: msg }));
        toast.error(msg);
      }
    }
  }, [adminRequest]);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (debouncedQuery) params.append('q', debouncedQuery);
      if (userPlanFilter) params.append('plan', userPlanFilter);
      if (userStatusFilter) params.append('status', userStatusFilter);

      const data = await adminRequest(`${API_URL}/api/v1/admin/users?${params.toString()}`);
      // Exclude administrative accounts from developer management table
      const developersOnly = (data.users || []).filter((u: any) => u.role !== 'admin');
      setUsers(developersOnly);
      setUsersPagination(data.pagination);
      setTabErrors(prev => ({ ...prev, users: undefined }));
      setLoadedTabs(prev => ({ ...prev, users: true }));
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        const msg = err.message || 'Failed to load users list';
        setTabErrors(prev => ({ ...prev, users: msg }));
        toast.error(msg);
      }
    }
  }, [adminRequest, debouncedQuery, userPlanFilter, userStatusFilter]);

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      const data = await adminRequest(`${API_URL}/api/v1/admin/billing/transactions?page=${page}&limit=15`);
      setTransactions(data.transactions);
      setTransactionsPagination(data.pagination);
      setTabErrors(prev => ({ ...prev, billing: undefined }));
      setLoadedTabs(prev => ({ ...prev, billing: true }));
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        const msg = err.message || 'Failed to load transactions';
        setTabErrors(prev => ({ ...prev, billing: msg }));
        toast.error(msg);
      }
    }
  }, [adminRequest]);

  const fetchWorkerStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshingOps(true);
    try {
      const data = await adminRequest(`${API_URL}/api/v1/admin/ops/workers`);
      setWorkerData(data);
      setTabErrors(prev => ({ ...prev, ops: undefined }));
      setLoadedTabs(prev => ({ ...prev, ops: true }));
      if (data.engines) {
        setSelectedProviders(prev => {
          const next = { ...prev };
          for (const [cat, eng] of Object.entries<any>(data.engines)) {
            if (!next[cat] && eng?.activeProvider) {
              next[cat] = eng.activeProvider;
            }
          }
          return next;
        });
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        const msg = err.message || 'Failed to query scraper status';
        setTabErrors(prev => ({ ...prev, ops: msg }));
        toast.error(msg);
      }
    } finally {
      if (isManual) setRefreshingOps(false);
    }
  }, [adminRequest]);

  const fetchUserLogs = useCallback(async (userId: string, pathF = '', statusF = '') => {
    userLogsAbortRef.current?.abort();
    const ctrl = new AbortController();
    userLogsAbortRef.current = ctrl;
    setUserLogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (pathF) params.append('path', pathF);
      if (statusF) params.append('status', statusF);

      const res = await adminFetch(`${API_URL}/api/v1/admin/users/${userId}/logs?${params.toString()}`, {
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const data = await res.json();
      if (data.success) {
        setUserLogs(data.logs || []);
      } else {
        toast.error(data.error || 'Failed to fetch user logs');
      }
    } catch (err: any) {
      if (ctrl.signal.aborted) return;
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Network error loading user logs');
      }
    } finally {
      if (!ctrl.signal.aborted) setUserLogsLoading(false);
    }
  }, [adminFetch]);

  const openUserLogs = (targetUser: any) => {
    setSelectedUserForLogs(targetUser);
    setUserLogs([]);
    setLogPathFilter('');
    setLogStatusFilter('');
    fetchUserLogs(targetUser._id, '', '');
  };

  const exportUserLogsCSV = () => {
    const logsToExport = filteredUserLogs.length > 0 ? filteredUserLogs : userLogs;
    if (!logsToExport.length || !selectedUserForLogs) return;
    exportCsv(
      `${selectedUserForLogs.email.replace(/[@.]/g, '_')}_api_logs.csv`,
      ['Timestamp', 'Path', 'Status', 'Duration (ms)', 'Client IP'],
      logsToExport.map((l: any) => [new Date(l.time).toISOString(), l.path, l.status, l.duration || 0, l.ip])
    );
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
    } else if (activeTab === 'traffic') {
      if (force || !loadedTabs.traffic) await fetchTrafficHistory();
    } else if (activeTab === 'users') {
      if (force || !loadedTabs.users) await fetchUsers(usersPagination.page);
    } else if (activeTab === 'billing') {
      if (force || !loadedTabs.billing) await fetchTransactions(transactionsPagination.page);
    } else if (activeTab === 'ops') {
      if (force || !loadedTabs.ops) await fetchWorkerStatus();
    }
    setIsSyncing(false);
  }, [activeTab, fetchOverview, fetchTrafficHistory, fetchUsers, fetchTransactions, fetchWorkerStatus, usersPagination.page, transactionsPagination.page, loadedTabs]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (activeTab === 'overview' && !loadedTabs.overview) await fetchOverview();
      else if (activeTab === 'traffic' && !loadedTabs.traffic) await fetchTrafficHistory();
      else if (activeTab === 'users' && !loadedTabs.users) await fetchUsers(1);
      else if (activeTab === 'billing' && !loadedTabs.billing) await fetchTransactions(1);
      else if (activeTab === 'ops' && !loadedTabs.ops) await fetchWorkerStatus();
    };
    if (active) load();
    return () => { active = false; };
  }, [activeTab, loadedTabs, fetchOverview, fetchTrafficHistory, fetchUsers, fetchTransactions, fetchWorkerStatus]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (confirmDialog.isOpen && !confirmLoading) setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      else if (selectedLiveLog) setSelectedLiveLog(null);
      else if (selectedUserForLogs) {
        userLogsAbortRef.current?.abort();
        setSelectedUserForLogs(null);
      } else if (selectedUserForCredit) setSelectedUserForCredit(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmDialog.isOpen, confirmLoading, selectedLiveLog, selectedUserForLogs, selectedUserForCredit]);

  useEffect(() => {
    return () => {
      userLogsAbortRef.current?.abort();
    };
  }, []);

  // Live Traffic SSE Connection Lifecycle
  useEffect(() => {
    if (activeTab !== 'traffic') return;

    const token = getAuthToken();
    if (!token) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/admin/traffic/stream`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: ctrl.signal,
        });
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        if (!res.ok || !res.body) {
          setSseConnected(false);
          return;
        }
        setSseConnected(true);
        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buf = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += value;
          const frames = buf.split('\n\n');
          buf = frames.pop() || '';
          if (isPausedRef.current) continue;
          for (const frame of frames) {
            const dataLine = frame.split('\n').find((l) => l.startsWith('data: '));
            if (!dataLine) continue;
            try {
              const data = JSON.parse(dataLine.slice(6));
              if (data.type === 'stats') {
                setLiveStats({
                  rps: data.rps ?? 0,
                  activeUsers: data.activeUsers ?? 0,
                  uptimeSeconds: data.uptimeSeconds,
                });
              } else if (data.path) {
                setLiveLogs((prev) =>
                  data.id && prev.some((x) => x.id === data.id) ? prev : [data, ...prev.slice(0, 249)]
                );
              }
            } catch {
              // Ignore malformed SSE keepalive/partial event frame
            }
          }
        }
        if (!ctrl.signal.aborted) setSseConnected(false);
      } catch {
        if (!ctrl.signal.aborted) setSseConnected(false);
      }
    })();

    return () => {
      ctrl.abort();
      setSseConnected(false);
    };
  }, [activeTab, logout]);

  useEffect(() => {
    const filterKey = `${debouncedQuery}|${userPlanFilter}|${userStatusFilter}`;
    if (!loadedTabs.users) {
      lastUsersFilterKeyRef.current = filterKey;
      return;
    }
    if (activeTab !== 'users') return;
    if (lastUsersFilterKeyRef.current === filterKey) return;
    lastUsersFilterKeyRef.current = filterKey;
    const id = setTimeout(() => {
      void fetchUsers(1);
    }, 0);
    return () => clearTimeout(id);
  }, [activeTab, loadedTabs.users, debouncedQuery, userPlanFilter, userStatusFilter, fetchUsers]);

  // ─── Actions with Apple Dialog ──────────────────────────────────────────
  const requestToggleUserStatus = (targetUser: any) => {
    const newStatus = targetUser.isActive === false;
    const actionLabel = newStatus ? 'Reactivate' : 'Deactivate & Ban';

    setBanReasonInput(targetUser.banReason || 'Rate limit abuse / Excessive scraping');

    setConfirmDialog({
      isOpen: true,
      title: `${actionLabel} Developer Account`,
      description: newStatus
        ? `Are you sure you want to reactivate access for ${targetUser.email}? Their API keys will be permitted immediately.`
        : `Are you sure you want to ban ${targetUser.email}? All active API keys will be immediately purged from Redis cache and forbidden.`,
      confirmLabel: actionLabel,
      isDestructive: !newStatus,
      showBanReasonInput: !newStatus,
      onConfirm: async (customReason?: string) => {
        try {
          const payload: { isActive: boolean; banReason?: string } = { isActive: newStatus };
          if (!newStatus) {
            payload.banReason = customReason?.trim() || 'Violation of IRCTC Developer Terms of Service';
          }
          const res = await adminFetch(`${API_URL}/api/v1/admin/users/${targetUser._id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
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
    const cleanPattern = cachePattern.trim();
    if (!cleanPattern) return;
    const isWipeAll = cleanPattern === '*';

    setConfirmDialog({
      isOpen: true,
      title: isWipeAll ? 'Wipe Entire Engine Redis Cache?' : `Purge Matching Cache Keys (${cleanPattern})`,
      description: isWipeAll
        ? 'WARNING: This runs FLUSHDB and wipes ALL cached routes, active train positions, charts, and warm API key cache across Redis.'
        : `Dispatches a non-blocking scan stream to invalidate all cached keys matching the pattern "${cleanPattern}".`,
      confirmLabel: isWipeAll ? 'Flush Entire Database' : 'Purge Pattern',
      isDestructive: true,
      onConfirm: async () => {
        if (isWipeAll && window.prompt('Type FLUSH_ALL to confirm wiping the entire Redis cache:') !== 'FLUSH_ALL') {
          toast.error('Full Redis wipe cancelled');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          return;
        }
        setFlushLoading(true);
        try {
          const res = await adminFetch(`${API_URL}/api/v1/admin/ops/cache/flush`, {
            method: 'POST',
            body: JSON.stringify({ pattern: cleanPattern, confirm: isWipeAll }),
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

  const executeSwitchProvider = async (category: string) => {
    const targetProvider = selectedProviders[category];
    if (!targetProvider) return;

    setSwitchingCategory(category);
    try {
      const res = await adminFetch(`${API_URL}/api/v1/admin/ops/providers/switch`, {
        method: 'POST',
        body: JSON.stringify({ category, provider: targetProvider }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || `Switched ${category} provider to ${targetProvider}`);
        // Optimistically update local activeProvider in state (instant 0ms UI update)
        setWorkerData((prev: any) => prev ? {
          ...prev,
          engines: {
            ...prev.engines,
            [category]: { ...prev.engines?.[category], activeProvider: targetProvider }
          }
        } : prev);
        setSelectedProviders(prev => ({ ...prev, [category]: targetProvider }));
        // Instant background sync across all cluster workers via Redis
        setTimeout(() => {
          fetchWorkerStatus().catch(() => {});
        }, 500);
      } else {
        toast.error(data.error || 'Failed to switch provider');
      }
    } catch (err: any) {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error(err.message || 'Error executing provider switch');
      }
    } finally {
      setSwitchingCategory(null);
    }
  };

  const requestSwitchProvider = (category: string) => {
    const targetProvider = selectedProviders[category];
    if (!targetProvider) return;
    setConfirmDialog({
      isOpen: true,
      title: `Switch ${category} Provider?`,
      description: `Live production traffic across cluster workers will immediately switch to "${targetProvider}".`,
      confirmLabel: `Switch to ${targetProvider}`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          await executeSwitchProvider(category);
        } finally {
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
    return (selectedUserForCredit.apiCredits || 0) + delta;
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
  const filteredUserLogs = (() => {
    let logs = userLogs;
    if (logPathFilter.trim()) {
      const q = logPathFilter.toLowerCase();
      logs = logs.filter((l: any) => l.path && l.path.toLowerCase().includes(q));
    }
    if (logStatusFilter) {
      logs = logs.filter((l: any) => {
        if (logStatusFilter === '402') return l.status === 401 || l.status === 402;
        if (logStatusFilter === '500') return l.status >= 500;
        return String(l.status) === logStatusFilter;
      });
    }
    return logs;
  })();

  // Live Traffic calculations & filtering
  const avgLatency = useMemo(() => {
    if (liveLogs.length === 0) return 0;
    const slice = liveLogs.slice(0, 50);
    const sum = slice.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);
    return Math.round(sum / slice.length);
  }, [liveLogs]);

  const trafficStatusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: liveLogs.length, '2xx': 0, '4xx': 0, '5xx': 0, '429': 0 };
    liveLogs.forEach((l) => {
      const s = Number(l.status);
      if (s >= 200 && s < 300) counts['2xx']++;
      else if (s === 429) counts['429']++;
      else if (s >= 400 && s < 500) counts['4xx']++;
      else if (s >= 500) counts['5xx']++;
    });
    return counts;
  }, [liveLogs]);

  const adminEmail = user?.email ? String(user.email).toLowerCase() : '';
  const filteredLiveLogs = useMemo(() => {
    return liveLogs.filter((log) => {
      const s = Number(log.status);
      if (trafficFilter === '2xx' && (s < 200 || s >= 300)) return false;
      if (trafficFilter === '429' && s !== 429) return false;
      if (trafficFilter === '4xx' && (s < 400 || s >= 500 || s === 429)) return false;
      if (trafficFilter === '5xx' && s < 500) return false;

      if (trafficSearch.trim()) {
        const q = trafficSearch.toLowerCase();
        const p = (log.path || '').toLowerCase();
        const email = (log.user?.email || '').toLowerCase();
        const name = (log.user?.name || '').toLowerCase();
        const ip = (log.ip || '').toLowerCase();
        const isCallerAdmin = Boolean((adminEmail && email === adminEmail) || log.user?.role === 'admin' || log.user?.plan === 'ADMIN');
        return p.includes(q) || email.includes(q) || name.includes(q) || ip.includes(q) || (isCallerAdmin && 'admin'.includes(q));
      }
      return true;
    });
  }, [liveLogs, trafficFilter, trafficSearch, adminEmail]);

  const liveErrorCount = trafficStatusCounts['4xx'] + trafficStatusCounts['429'] + trafficStatusCounts['5xx'];
  const liveErrorRate = trafficStatusCounts.all > 0
    ? ((liveErrorCount / trafficStatusCounts.all) * 100).toFixed(1)
    : '0.0';

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
          { id: 'traffic', label: 'Live Traffic', icon: <Radio size={14} /> },
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
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-textMuted mb-2.5">
                  <span className="text-xs font-medium">In-Memory Railway Corpus</span>
                  <Database size={16} className="text-cyan-400" />
                </div>
                <div className="text-3xl font-semibold font-mono tracking-tight text-textMain tabular-nums">
                  {overview?.system?.engineDataset?.trains?.toLocaleString() ?? '—'}
                </div>
                <div className="text-[11px] text-textMuted mt-1.5 font-mono">
                  Indexing {overview?.system?.engineDataset?.stations?.toLocaleString() ?? '—'} station nodes
                </div>
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
                  <button
                    type="button"
                    key={u._id}
                    onClick={() => openUserLogs(u)}
                    className="w-full text-left py-3 px-3 -mx-3 rounded-xl flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer group"
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
                  </button>
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
                    <button
                      type="button"
                      key={t._id}
                      onClick={() => setActiveTab('billing')}
                      className="w-full text-left py-3 px-3 -mx-3 rounded-xl flex items-center justify-between gap-4 text-xs hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer group"
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
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: LIVE TRAFFIC STREAM (ZERO-DATABASE SSE OBSERVABILITY) ─── */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors">
              <div className="flex items-center justify-between text-textMuted mb-2">
                <span className="text-xs font-medium">Throughput</span>
                <span className="flex items-center gap-1.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <Activity size={15} className="text-emerald-400" />
                </span>
              </div>
              <div className="text-3xl font-semibold font-mono tracking-tight text-emerald-400 tabular-nums flex items-baseline gap-2">
                <span>{liveStats.rps}</span>
                <span className="text-xs font-sans text-textMuted font-normal">req / s</span>
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors">
              <div className="flex items-center justify-between text-textMuted mb-2">
                <span className="text-xs font-medium">Active Developers</span>
                <Users size={15} className="text-brand/90" />
              </div>
              <div className="text-3xl font-semibold font-mono tracking-tight text-textMain tabular-nums flex items-baseline gap-2">
                <span>{liveStats.activeUsers}</span>
                <span className="text-xs font-sans text-textMuted font-normal">online</span>
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors">
              <div className="flex items-center justify-between text-textMuted mb-2">
                <span className="text-xs font-medium">Avg Latency</span>
                <Cpu size={15} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-semibold font-mono tracking-tight text-cyan-400 tabular-nums flex items-baseline gap-2">
                <span>{avgLatency}</span>
                <span className="text-xs font-sans text-textMuted font-normal">ms</span>
              </div>
            </div>

            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/[0.14] transition-colors">
              <div className="flex items-center justify-between text-textMuted mb-2">
                <span className="text-xs font-medium">Error Rate</span>
                {liveErrorCount > 0 ? (
                  <AlertTriangle size={15} className="text-rose-400" />
                ) : (
                  <ShieldCheck size={15} className="text-emerald-400/80" />
                )}
              </div>
              <div className="text-3xl font-semibold font-mono tracking-tight tabular-nums flex items-baseline gap-2">
                <span className={liveErrorCount > 0 ? 'text-rose-400' : 'text-emerald-400'}>{liveErrorRate}</span>
                <span className="text-xs font-sans text-textMuted font-normal">%</span>
              </div>
            </div>
          </div>

          {/* Filter & Stream Controls Strip */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by endpoint, developer email, name, or IP..."
                  value={trafficSearch}
                  onChange={(e) => setTrafficSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-brand/60 transition-colors"
                />
                {trafficSearch && (
                  <button
                    type="button"
                    onClick={() => setTrafficSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'all', label: 'All', count: trafficStatusCounts.all, color: 'text-textMain' },
                  { id: '2xx', label: '2xx OK', count: trafficStatusCounts['2xx'], color: 'text-emerald-400' },
                  { id: '4xx', label: '4xx Warn', count: trafficStatusCounts['4xx'], color: 'text-amber-400' },
                  { id: '429', label: '429 Rate', count: trafficStatusCounts['429'], color: 'text-orange-400' },
                  { id: '5xx', label: '5xx Error', count: trafficStatusCounts['5xx'], color: 'text-red-400' },
                ].map((filter) => {
                  const isSelected = trafficFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setTrafficFilter(filter.id as any)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer border active:scale-95 ${
                        isSelected
                          ? 'bg-[#1e2026] border-white/20 text-white font-semibold shadow-sm'
                          : 'bg-[#08080a] hover:bg-white/5 border-white/[0.06] text-textMuted hover:text-textMain'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] ${filter.color} font-medium tabular-nums`}>
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls: Pause/Play, Clear */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsTrafficPaused((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                  isTrafficPaused
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}
              >
                {isTrafficPaused ? <Play size={13} /> : <Pause size={13} />}
                <span>{isTrafficPaused ? 'Resume Stream' : 'Pause Stream'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLiveLogs([])}
                title="Clear in-memory buffer"
                className="p-1.5 text-textMuted hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Live Streaming Table */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0b0e] border-b border-white/[0.06] text-textMuted font-mono text-[10px] uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-3 py-3">Method</th>
                    <th className="px-4 py-3">Route Endpoint</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Latency</th>
                    <th className="px-4 py-3">Developer / Caller</th>
                    <th className="px-3 py-3">Plan</th>
                    <th className="px-4 py-3">Client IP</th>
                    <th className="px-3 py-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono">
                  {filteredLiveLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center text-textMuted">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Radio size={24} className={sseConnected ? 'text-emerald-400 animate-pulse' : 'text-textMuted'} />
                          <p className="text-sm font-sans font-medium text-textMain">
                            {sseConnected ? 'Listening for live API requests...' : 'Connecting to Live Telemetry Stream...'}
                          </p>
                          <p className="text-xs text-textMuted font-mono">
                            {sseConnected
                              ? 'Traffic from all rail-engine instances will stream here in real time.'
                              : 'Ensure rail-engine is running and admin JWT session is active.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLiveLogs.map((log, idx) => {
                      const is2xx = log.status >= 200 && log.status < 300;
                      const is429 = log.status === 429;
                      const is4xx = log.status >= 400 && log.status < 500 && !is429;
                      const timeStr = log.time ? new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
                      const isMethodGet = log.method === 'GET';
                      const isCallerAdmin = Boolean(
                        (user?.email && log.user?.email && log.user.email.toLowerCase() === user.email.toLowerCase()) ||
                        log.user?.role === 'admin' ||
                        log.user?.plan === 'ADMIN'
                      );

                      return (
                        <tr key={log.id || idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 text-textMuted text-[11px] whitespace-nowrap tabular-nums">
                            {timeStr}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isMethodGet ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {log.method}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-textMain font-medium max-w-[240px] truncate" title={log.path}>
                            {log.path}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider ${
                              is2xx
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : is429
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : is4xx
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-textMuted text-[11px] tabular-nums">
                            <span className={log.duration > 500 ? 'text-amber-400 font-semibold' : ''}>
                              {log.duration ?? 0}ms
                            </span>
                          </td>
                          <td className="px-4 py-3 max-w-[220px] truncate" title={log.user?.email || (isCallerAdmin ? 'Admin' : 'Anonymous')}>
                            {isCallerAdmin ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand/15 text-brand border border-brand/25 font-mono">
                                Admin
                              </span>
                            ) : (
                              <span className="text-textMain font-mono text-xs truncate block">
                                {log.user?.email || 'unauthenticated'}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <PlanBadge plan={log.user?.plan || 'FREE'} />
                          </td>
                          <td className="px-4 py-3 text-textMuted text-[11px] whitespace-nowrap">
                            {log.ip || '127.0.0.1'}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedLiveLog(log)}
                              className="p-1 rounded-lg text-textMuted hover:text-brand hover:bg-white/5 transition-all cursor-pointer"
                              title="Inspect Raw JSON"
                            >
                              <Eye size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs text-textMuted font-mono">
              <span>Showing {filteredLiveLogs.length} events (Buffer: {liveLogs.length}/250)</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{sseConnected ? 'SSE Connected (channel:api_live_traffic)' : 'Disconnected'}</span>
              </span>
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
                  {tabErrors.users && !loadedTabs.users ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center font-mono text-xs text-red-400">
                        <p className="mb-3">{tabErrors.users}</p>
                        <button type="button" onClick={() => fetchUsers(1)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-textMain">Retry</button>
                      </td>
                    </tr>
                  ) : !loadedTabs.users ? (
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
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-medium">
                                  <XCircle size={13} /> Deactivated
                                </span>
                                {u.banReason && (
                                  <span
                                    title={`Ban Reason: ${u.banReason}`}
                                    className="text-[10px] text-textMuted max-w-[170px] truncate block cursor-help"
                                  >
                                    {u.banReason}
                                  </span>
                                )}
                              </div>
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
                                onClick={() => {
                                  setCreditAdjustmentAmount('10000');
                                  setCreditAdjustmentReason('Customer Support Bonus');
                                  setSelectedUserForCredit(u);
                                }}
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

            <PaginationBar
              label={`Showing ${users.length} of ${usersPagination.total} accounts`}
              page={usersPagination.page}
              totalPages={usersPagination.totalPages}
              onPage={fetchUsers}
            />
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
                  {tabErrors.billing && !loadedTabs.billing ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center font-mono text-xs text-red-400">
                        <p className="mb-3">{tabErrors.billing}</p>
                        <button type="button" onClick={() => fetchTransactions(1)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-textMain">Retry</button>
                      </td>
                    </tr>
                  ) : !loadedTabs.billing ? (
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

            <PaginationBar
              label={`Total Transactions: ${transactionsPagination.total}`}
              page={transactionsPagination.page}
              totalPages={transactionsPagination.totalPages}
              onPage={fetchTransactions}
            />
          </div>
        </div>
      )}

      {/* ─── TAB 4: WORKERS & SCRAPERS ─────────────────────────────────── */}
      {activeTab === 'ops' && (
        <div className="space-y-4">
          {/* Minimal Telemetry Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 py-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-textMain tracking-tight">Scraper Fleet & Infrastructure</h2>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-mono text-textMuted">PID <span className="text-textMain font-medium">{workerData?.server?.pid || '—'}</span></span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-mono text-textMuted">Node <span className="text-textMain font-medium">{workerData?.server?.nodeVersion || '—'}</span></span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-mono text-textMuted">Up <span className="text-emerald-400 font-medium">{formatUptime(workerData?.server?.uptimeSeconds)}</span></span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-mono text-textMuted">RSS <span className="text-textMain font-medium">{formatBytes(workerData?.server?.memory?.rss)}</span></span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-mono text-textMuted">Heap <span className="text-textMain font-medium">{formatBytes(workerData?.server?.memory?.heapUsed)}</span></span>
            </div>

            <button
              type="button"
              disabled={refreshingOps}
              onClick={() => fetchWorkerStatus(true)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 text-xs font-mono text-textMuted hover:text-textMain flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={11} className={refreshingOps ? 'animate-spin text-brand' : ''} />
              <span>{refreshingOps ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* Unified High-Density Fleet Control Table */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-semibold text-textMain tracking-wider uppercase">Scraper Engines</span>
              <span className="text-[11px] font-mono text-textMuted">Hot-Swap · 0ms In-Memory + PM2 Cluster Sync</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {[
                { key: 'live_status', label: 'Live Train Status', env: 'LIVE_STATUS_PROVIDER', Icon: Activity, tone: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { key: 'pnr', label: 'PNR Status Scraper', env: 'PNR_STATUS_PROVIDER', Icon: Cpu, tone: 'bg-brand/10 text-brand border-brand/20' },
                { key: 'fare', label: 'Train Fare Matrix', env: 'FARE_PROVIDER', Icon: CreditCard, tone: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              ].map(({ key, label, env, Icon, tone }) => {
                const eng = workerData?.engines?.[key];
                const activeProv = eng?.activeProvider || '';
                const rawOptions: Array<string | { id?: string; label?: string }> =
                  Array.isArray(eng?.availableProviders) ? eng.availableProviders : [];
                const options = rawOptions.map((opt) =>
                  typeof opt === 'string'
                    ? { id: opt, label: opt }
                    : { id: String(opt?.id ?? ''), label: String(opt?.label ?? opt?.id ?? '') }
                );
                const currentSelected = selectedProviders[key] || activeProv;
                const isModified = Boolean(currentSelected) && currentSelected !== activeProv;
                const isSwitching = switchingCategory === key;

                return (
                  <div key={key} className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${tone}`}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-textMain flex items-center gap-2">
                          {label}
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${tone}`}>{env}</span>
                        </div>
                        <div className="text-[11px] font-mono text-textMuted mt-0.5">
                          {eng?.activeJobs ?? 0} active {eng?.queueLength ? `(${eng.queueLength} queued)` : ''} · {eng?.last60mRequests?.toLocaleString() ?? 0} req/60m
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto">
                      <select
                        aria-label={`${label} provider`}
                        value={currentSelected}
                        disabled={options.length === 0}
                        onChange={(e) => setSelectedProviders(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 md:w-64 px-3 py-1.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain focus:outline-none focus:border-brand/60 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {options.length === 0 ? (
                          <option value="">Loading providers...</option>
                        ) : (
                          options.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))
                        )}
                      </select>
                      {isModified && (
                        <button
                          type="button"
                          disabled={isSwitching}
                          onClick={() => requestSwitchProvider(key)}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-brand hover:bg-brand/90 text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm shadow-brand/20 shrink-0"
                        >
                          {isSwitching ? <RefreshCw size={11} className="animate-spin" /> : <Zap size={11} />}
                          <span>{isSwitching ? 'Reloading...' : 'Apply'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsystems: BullMQ Chart Pre-Warming & In-Memory Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reservation Charts Card: today's per-train first/final chart progress */}
            {(() => {
              const chart = workerData?.engines?.chart;
              const feed = chart?.feed;
              const today: ChartTodaySummary | null = chart?.today ?? null;
              const counts = chart?.queue?.counts || {};
              const scheduled = (counts.delayed ?? 0) + (counts.waiting ?? 0);
              const isFeeder = feed?.mode === 'feeder';
              const badge = isFeeder
                ? feed.connected
                  ? { tone: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500 animate-pulse', label: `Feeder online · ${formatAgo(feed.ageSec)} ago` }
                  : { tone: 'bg-red-500/10 text-red-400 border-red-500/30', dot: 'bg-red-400', label: feed.lastSeen ? `Feeder offline · seen ${formatAgo(feed.ageSec)} ago` : 'Feeder offline' }
                : chart?.session?.isWarm
                  ? { tone: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500 animate-pulse', label: 'Session Ready' }
                  : { tone: 'bg-blue-500/10 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', label: 'Session Standby' };
              const badgeTitle = isFeeder && feed.lastSeen
                ? `Last push ${formatIstTime(feed.lastSeen)} IST${feed.feeder?.host ? ` from ${feed.feeder.host}` : ''}`
                : undefined;
              const tiles = [
                { label: 'Trains', value: today?.total, color: 'text-textMain' },
                { label: 'Completed', value: today?.both, color: 'text-emerald-400' },
                { label: 'Remaining', value: today ? today.pending + today.firstOnly : undefined, color: 'text-cyan-400' },
                { label: 'Missed', value: today?.missed, color: today?.missed ? 'text-red-400' : 'text-textMuted' },
              ];

              return (
                <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                        <Radio size={16} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-textMain">Reservation Charts</h3>
                        <p className="text-[11px] font-mono text-textMuted truncate">
                          {today ? `Today · ${formatDateLabel(today.date)}` : 'Today'}
                        </p>
                      </div>
                    </div>
                    <span title={badgeTitle} className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${badge.tone}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 p-3 bg-[#08080a] border border-white/[0.04] rounded-xl mb-3 text-center font-mono">
                    {tiles.map((t) => (
                      <div key={t.label}>
                        <div className="text-[10px] text-textMuted uppercase tracking-wider">{t.label}</div>
                        <div className={`${t.color} font-semibold text-sm tabular-nums mt-0.5`}>{t.value?.toLocaleString() ?? '—'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-textMuted px-1 mb-2">
                    <span>First chart ✓ <span className="text-textMain font-medium tabular-nums">{today?.firstDone.toLocaleString() ?? '—'}</span></span>
                    <span>Final chart ✓ <span className="text-textMain font-medium tabular-nums">{today?.finalDone.toLocaleString() ?? '—'}</span></span>
                    <span>Due now <span className={`font-medium tabular-nums ${today?.due ? 'text-amber-400' : 'text-textMain'}`}>{today?.due.toLocaleString() ?? '—'}</span></span>
                  </div>

                  {today && today.nextUp.length > 0 && (
                    <div className="flex items-center gap-1.5 px-1 mb-3 overflow-hidden">
                      <span className="text-[10px] text-textMuted uppercase tracking-wider font-mono shrink-0">Next</span>
                      {today.nextUp.slice(0, 3).map((n) => (
                        <span
                          key={`${n.trainNo}-${n.kind}`}
                          title={n.trainName}
                          className="shrink-0 px-2 py-0.5 rounded-lg bg-[#08080a] border border-white/[0.06] text-[11px] font-mono text-textMain"
                        >
                          {n.trainNo} <span className="text-textMuted">{n.kind}</span> {formatIstAt(n.at, today.date)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-textMuted pt-3 px-1 border-t border-white/[0.06]">
                    <span>
                      Queue <span className="text-textMain font-medium tabular-nums">{scheduled.toLocaleString()}</span> scheduled
                      {' · '}<span className="text-brand font-medium tabular-nums">{counts.active ?? 0}</span> active
                      {' · '}<span className={`font-medium tabular-nums ${counts.failed ? 'text-red-400' : 'text-textMain'}`}>{counts.failed ?? 0}</span> failed
                      {' · '}<span className="text-textMain font-medium tabular-nums">{chart?.last60mRequests ?? 0}</span> API calls/60m
                    </span>
                    <button
                      type="button"
                      onClick={() => setChartPanelOpen(true)}
                      className="inline-flex items-center gap-1 text-brand hover:text-white font-semibold transition-colors cursor-pointer active:scale-95"
                    >
                      View all trains <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* In-Memory Railway Topology Graph Card */}
            <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Database size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-textMain">Railway Graph Engine</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In-Memory
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 p-3 bg-[#08080a] border border-white/[0.04] rounded-xl mb-3 text-center font-mono">
                <div>
                  <div className="text-[10px] text-textMuted uppercase tracking-wider">Trains</div>
                  <div className="text-cyan-400 font-semibold text-sm tabular-nums mt-0.5">
                    {workerData?.engines?.offline_search?.trains?.toLocaleString() ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-textMuted uppercase tracking-wider">Stations</div>
                  <div className="text-textMain font-semibold text-sm tabular-nums mt-0.5">
                    {workerData?.engines?.offline_search?.stations?.toLocaleString() ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-textMuted uppercase tracking-wider">Lookups</div>
                  <div className="text-emerald-400 font-semibold text-sm tabular-nums mt-0.5">
                    {workerData?.engines?.offline_search?.searchCount?.toLocaleString() ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-textMuted uppercase tracking-wider">Hit Rate</div>
                  <div className="text-brand font-semibold text-sm tabular-nums mt-0.5">
                    {workerData?.engines?.offline_search?.searchCount ? `${Math.round(((workerData.engines.offline_search.offlineHits || 0) / workerData.engines.offline_search.searchCount) * 100)}%` : '—'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-textMuted pt-1 px-1">
                <span>Topology: <span className="text-textMain font-medium">Direct O(1) Pair</span></span>
                <span>Warm-Up: <span className="text-emerald-400 font-medium">{workerData?.engines?.offline_search?.startupDurationMs != null ? `${workerData.engines.offline_search.startupDurationMs}ms` : '—'}</span></span>
                <span>Status: <span className="text-emerald-400 font-medium">Synchronized</span></span>
              </div>
            </div>
          </div>

          {/* Redis Cache Key Management */}
          <div className="bg-[#0e0f13] border border-white/[0.08] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                <Database size={15} />
              </div>
              <h3 className="text-sm font-semibold text-textMain">Redis Cache Eviction</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                placeholder="Key pattern (e.g., pnr:*, live-status:*, cache:chart:*, apikey:*)"
                value={cachePattern}
                onChange={(e) => setCachePattern(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain placeholder:text-textMuted/40 focus:outline-none focus:border-brand/60 transition-colors"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCachePattern('pnr:*')}
                  className="px-2.5 py-1.5 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  pnr:*
                </button>
                <button
                  type="button"
                  onClick={() => setCachePattern('live-status:*')}
                  className="px-2.5 py-1.5 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  live-status:*
                </button>
                <button
                  type="button"
                  onClick={() => setCachePattern('cache:chart:*')}
                  className="px-2.5 py-1.5 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  cache:chart:*
                </button>
                <button
                  type="button"
                  onClick={() => setCachePattern('apikey:*')}
                  className="px-2.5 py-1.5 text-[11px] bg-[#14151a] hover:bg-[#1e2026] active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain font-mono transition-all cursor-pointer"
                >
                  apikey:*
                </button>
                <button
                  type="button"
                  disabled={flushLoading}
                  onClick={requestFlushCache}
                  className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 active:scale-[0.97] text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
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
          <div role="dialog" aria-modal="true" aria-label="Adjust Developer Credits" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
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
                  aria-label="Close credit adjustment dialog"
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
                  <span className={`${projectedBalance < 0 ? 'text-red-400' : 'text-emerald-400'} font-bold tabular-nums flex items-center gap-1`}>
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
          <div role="dialog" aria-modal="true" aria-label="Developer Request Telemetry" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
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
                    onClick={() => fetchUserLogs(selectedUserForLogs._id, '', '')}
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
                    aria-label="Close telemetry logs dialog"
                    onClick={() => {
                      userLogsAbortRef.current?.abort();
                      setSelectedUserForLogs(null);
                    }}
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
                          <span className={`px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] ${pill.color} font-medium tabular-nums`}>
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
          <div role="dialog" aria-modal="true" aria-label={confirmDialog.title} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
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

              <p className="text-xs text-textMuted leading-relaxed mb-4">
                {confirmDialog.description}
              </p>

              {/* Ban Reason Input & Quick Presets */}
              {confirmDialog.showBanReasonInput && (
                <div className="mb-5 space-y-2.5 text-left bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-textMain uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={12} className="text-red-400" />
                      Custom Ban Reason (Returned in API Error)
                    </label>
                    <span className="text-[10px] text-textMuted font-mono">
                      {banReasonInput.length}/500
                    </span>
                  </div>

                  {/* 1-Click Quick Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Rate limit abuse / Excessive scraping',
                      'Commercial redistribution without license',
                      'Payment chargeback / Overdue invoice',
                      'Violation of IRCTC Developer Terms of Service',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBanReasonInput(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                          banReasonInput === preset
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
                            : 'bg-white/[0.04] text-textMuted hover:text-textMain hover:bg-white/[0.08] border-white/[0.08]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={banReasonInput}
                    onChange={(e) => setBanReasonInput(e.target.value.slice(0, 500))}
                    placeholder="Enter custom ban reason that will be displayed to the developer in API error responses..."
                    className="w-full bg-[#16171d] border border-white/[0.12] focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3 py-2 text-xs text-textMain placeholder:text-textMuted/50 resize-none outline-none transition-all font-sans leading-relaxed"
                  />

                  <p className="text-[10px] text-textMuted/80 italic flex items-center gap-1">
                    <span>💡</span>
                    <span>This reason will be returned in HTTP 403 <code className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded font-mono">ACCOUNT_SUSPENDED</code> responses.</span>
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  disabled={confirmLoading}
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmLoading}
                  onClick={async () => {
                    if (confirmLoading) return;
                    setConfirmLoading(true);
                    try {
                      await confirmDialog.onConfirm(banReasonInput);
                    } finally {
                      setConfirmLoading(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 ${
                    confirmDialog.isDestructive
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                      : 'bg-brand hover:bg-brand/90 text-white shadow-brand/20'
                  }`}
                >
                  {confirmLoading ? 'Working...' : confirmDialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPLE MODAL: INSPECT LIVE REQUEST LOG ──────────────────────── */}
      <AnimatePresence>
        {selectedLiveLog && (
          <div role="dialog" aria-modal="true" aria-label="Inspect Live Request Log" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="w-full max-w-lg bg-[#111216] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative font-sans"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    selectedLiveLog.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {selectedLiveLog.method}
                  </span>
                  <h3 className="text-sm font-mono font-semibold text-textMain truncate max-w-[280px]">
                    {selectedLiveLog.path}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Close live log inspector"
                  onClick={() => setSelectedLiveLog(null)}
                  className="p-1 rounded-lg text-textMuted hover:text-textMain hover:bg-white/5 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 bg-[#090a0d] border border-white/[0.06] rounded-2xl p-3.5">
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Status</span>
                  <span className={`font-semibold ${selectedLiveLog.status < 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedLiveLog.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Duration</span>
                  <span className="text-textMain font-semibold">{selectedLiveLog.duration}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Caller Identity</span>
                  <span className="text-textMain font-semibold">
                    {(
                      (user?.email && selectedLiveLog.user?.email && selectedLiveLog.user.email.toLowerCase() === user.email.toLowerCase()) ||
                      selectedLiveLog.user?.role === 'admin' ||
                      selectedLiveLog.user?.plan === 'ADMIN'
                    ) ? (
                      <span className="text-brand font-mono font-bold">Admin</span>
                    ) : (
                      selectedLiveLog.user?.email || 'Anonymous'
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Plan / Tier</span>
                  <span className="text-brand font-semibold">{selectedLiveLog.user?.plan || 'FREE'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Email</span>
                  <span className="text-textMuted truncate block">{selectedLiveLog.user?.email || 'none'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-textMuted uppercase block">Client IP</span>
                  <span className="text-textMuted">{selectedLiveLog.ip}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-textMuted font-mono">
                  <span>Raw Event Payload:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedLiveLog, null, 2));
                      toast.success('Event JSON copied to clipboard');
                    }}
                    className="text-[11px] text-brand hover:underline cursor-pointer"
                  >
                    Copy JSON
                  </button>
                </div>
                <pre className="p-3 bg-[#08080a] border border-white/10 rounded-xl text-[11px] font-mono text-textMuted overflow-x-auto max-h-48 scrollbar-thin">
                  {JSON.stringify(selectedLiveLog, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedLiveLog(null)}
                  className="px-4 py-2 bg-[#181920] hover:bg-white/5 border border-white/10 rounded-xl text-textMain text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RESERVATION CHARTS: PER-TRAIN DAY VIEW ─────────────────────── */}
      <AnimatePresence>
        {chartPanelOpen && (
          <ChartDayPanel key="chart-day-panel" apiUrl={API_URL} adminFetch={adminFetch} onClose={closeChartPanel} />
        )}
      </AnimatePresence>
    </div>
  );
}
