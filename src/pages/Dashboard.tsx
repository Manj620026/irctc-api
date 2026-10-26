import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Copy, Check, Plus, Zap, Code2, AlertTriangle, Loader2, Trash2, List, RefreshCw, Download, Eye, EyeOff, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

function formatLogTime(timeStr: string) {
  try {
    const d = new Date(timeStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return isToday ? `Today, ${time}` : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
  } catch {
    return timeStr;
  }
}

function formatKeyExpiry(expiresAt?: string) {
  if (!expiresAt) return 'Never expires';
  try {
    const exp = new Date(expiresAt);
    return exp.getTime() < Date.now()
      ? 'Expired'
      : `Expires ${exp.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  } catch {
    return 'Invalid date';
  }
}

export default function Dashboard() {
  const { user, authLoading, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expiryDays, setExpiryDays] = useState('never');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleLogsCount, setVisibleLogsCount] = useState(50);
  const [unmaskedKeys, setUnmaskedKeys] = useState<Record<string, boolean>>({});
  const [integrationTab, setIntegrationTab] = useState<'curl' | 'sdk'>('curl');
  const [logStatusFilter, setLogStatusFilter] = useState<'all' | 'success' | 'error'>('all');
  
  const isPro = user?.plan === 'PAID' && (user?.apiCredits || 0) > 0;

  const sanitizeCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    // Neutralize formula injection including leading spaces, tabs, carriage returns, and pipe/percent operators
    if (/^\s*[=+\-@|%]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const downloadLogsCSV = () => {
    if (!user?.logs || user.logs.length === 0) return;
    const headers = ['Time', 'Path', 'Status', 'Duration (ms)', 'IP'].map(sanitizeCsvCell).join(',');
    const rows = user.logs.map((l: any) => [
      sanitizeCsvCell(new Date(l.time).toISOString()),
      sanitizeCsvCell(l.path),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.duration || 0),
      sanitizeCsvCell(l.ip)
    ].join(','));
    const csvContent = [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'api_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteKey = async (keyId: string, confirmed: boolean = false) => {
    if (!confirmed) return;
    setDeletingId(keyId);
    const token = localStorage.getItem('irctc_api_token');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
      const res = await fetch(`${API_URL}/api/v1/auth/keys/${keyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        toast.error('Session expired. Please sign in again.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        await fetchFreshData();
        toast.success('API key deleted');
      } else {
        toast.error(data.message || 'Failed to delete key');
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete key', err);
      toast.error('Network error while deleting key');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setApiKeys(user.apiKeys || []);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchFreshData = async () => {
    const token = localStorage.getItem('irctc_api_token');
    if (!token) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setApiKeys(data.user.apiKeys || []);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch fresh user data', err);
      }
    }
  };

  const handleCreateKey = async () => {
    setIsCreating(true);
    const token = localStorage.getItem('irctc_api_token');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
      const res = await fetch(`${API_URL}/api/v1/auth/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: 'Production Key', expiresIn: expiryDays })
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        toast.error('Session expired. Please sign in again.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        await fetchFreshData();
        toast.success('API key generated');
      } else {
        toast.error(data.message || 'Failed to create key');
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to create key', err);
      toast.error('Network error while creating key');
    } finally {
      setIsCreating(false);
    }
  };

  const [isToppingUp, setIsToppingUp] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay || document.querySelector('script[src*="checkout.razorpay.com"]')) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleTopUp = async () => {
    setIsToppingUp(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK. Are you online?");
      setIsToppingUp(false);
      return;
    }

    try {
      const token = localStorage.getItem('irctc_api_token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
      
      const orderRes = await fetch(`${API_URL}/api/v1/billing/create-order`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        toast.error(orderData.message || "Could not create order");
        setIsToppingUp(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IRCTC API Engine",
        description: "100,000 API Requests Top-up",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${API_URL}/api/v1/billing/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await fetchFreshData();
              toast.success("Payment Successful! 100,000 credits added & upgraded to PRO.");
            } else {
              toast.error(verifyData.message || "Payment Verification Failed! If debited, credits sync automatically.");
            }
          } catch (err) {
            console.error("Verification network error:", err);
            toast.error("Network issue verifying payment. If debited, backend webhook will auto-credit within 60s.");
            setTimeout(() => { fetchFreshData(); }, 3000);
          } finally {
            setIsToppingUp(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: "#3b82f6"
        },
        modal: {
          ondismiss: function() {
            setIsToppingUp(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setIsToppingUp(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setIsToppingUp(false);
    }
  };

  const [copiedCurl, setCopiedCurl] = useState(false);

  const toggleUnmask = (keyId: string) => {
    setUnmaskedKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard?.writeText(key).then(() => {
      setCopiedKey(id);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy API key');
    });
  };

  const getIntegrationSnippet = () => {
    const activeKey = apiKeys[0]?.key || 'YOUR_API_KEY';
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
    if (integrationTab === 'curl') {
      return `curl -s -X GET "${API_URL}/api/v1/pnr/2265248473" \\\n  -H "x-api-key: ${activeKey}" \\\n  -H "accept: application/json"`;
    }
    return `import { IrctcApi } from 'irctc-api';\n\nconst client = new IrctcApi({ apiKey: '${activeKey}' });\nconst pnr = await client.pnr.check('2265248473');\nconsole.log(pnr.chartStatus);`;
  };

  const copySnippet = () => {
    navigator.clipboard?.writeText(getIntegrationSnippet()).then(() => {
      setCopiedCurl(true);
      toast.success(`${integrationTab === 'curl' ? 'cURL command' : 'SDK snippet'} copied to clipboard`);
      setTimeout(() => setCopiedCurl(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy snippet');
    });
  };

  const formatIp = (ip: string) => {
    if (!ip || ip === '::1' || ip === '127.0.0.1') return 'localhost';
    return ip;
  };

  const containerVariants: any = {
    hidden: { opacity: 0, filter: 'blur(0px)' },
    visible: { 
      opacity: user ? 1 : 0.4,
      filter: user ? 'blur(0px)' : 'blur(12px)',
      transition: { staggerChildren: 0.08, duration: 0.5 }
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative flex-1 w-full flex flex-col pt-6 sm:pt-8 lg:pt-12 pb-12 ${!user ? 'min-h-[calc(100dvh-80px)] overflow-hidden' : ''}`}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://irctc.dev'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Developer Dashboard',
                    item: 'https://irctc.dev/dashboard'
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Ghost UI Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col ${!user ? 'select-none pointer-events-none' : ''}`}
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-1.5 sm:mb-2 text-textMain">Developer Dashboard</h2>
            <p className="text-textMuted text-xs sm:text-sm">Manage your API keys, monitor usage, and access integration guides.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-surface border border-borderRoot rounded-full p-1.5 pr-2.5 shadow-sm w-full sm:w-auto shrink-0">
            <img
              src={user?.avatar || user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff`}
              alt="Avatar"
              className="w-8 h-8 rounded-full bg-base shrink-0 ring-1 ring-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff`;
              }}
            />
            <div className="flex flex-col justify-center px-1 min-w-0 flex-1 sm:flex-initial">
              <span className="text-[13px] font-semibold text-textMain leading-none tracking-tight mb-1 truncate sm:max-w-[200px]">{user?.name || 'Guest Developer'}</span>
              <span className="text-[11px] font-medium text-textMuted leading-none">{user?.email || 'Unauthorized'}</span>
            </div>
            {user && (
              <button 
                onClick={() => {
                  logout();
                }}
                className="ml-auto text-xs font-medium text-textMuted hover:text-red-400 active:scale-[0.96] transition-all bg-base px-3.5 py-1.5 rounded-full border border-borderRoot shadow-sm hover:border-red-400/30 hover:bg-red-400/10 shrink-0"
              >
                Sign Out
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: API Keys */}
          <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
            
            <motion.div variants={itemVariants} className="bg-surface border border-borderRoot rounded-2xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] flex flex-col">
              {/* Header */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-borderRoot flex items-center justify-between gap-3 bg-surface/50 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg text-brand ring-1 ring-brand/20 shrink-0">
                    <Key size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-medium text-textMain">API Keys</h3>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-textMuted">
                      {apiKeys.length}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowCreateForm(prev => !prev)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all shadow-sm ${
                    showCreateForm 
                      ? 'bg-white/10 text-textMain border border-white/20' 
                      : 'bg-brand/10 hover:bg-brand/20 active:scale-[0.98] border border-brand/20 text-brand'
                  }`}
                >
                  <Plus size={13} className={showCreateForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
                  <span>{showCreateForm ? 'Close' : 'New Key'}</span>
                </button>
              </div>

              {/* Expandable New Key Form */}
              {showCreateForm && (
                <div className="p-3.5 sm:p-4 bg-[#0a0a0a] border-b border-borderRoot flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className="text-xs text-textMuted shrink-0 font-medium">Expiration:</span>
                    <select 
                      value={expiryDays} 
                      onChange={(e) => setExpiryDays(e.target.value)}
                      className="bg-base border border-borderRoot text-xs text-textMain px-3 py-1.5 rounded-lg outline-none focus:border-brand/50 transition-colors flex-1 sm:flex-initial"
                    >
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                      <option value="never">Never Expires</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button 
                      onClick={() => setShowCreateForm(false)}
                      className="text-xs px-3 py-1.5 text-textMuted hover:text-textMain transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={async () => {
                        await handleCreateKey();
                        setShowCreateForm(false);
                      }}
                      disabled={isCreating}
                      className="flex items-center gap-1.5 text-xs font-medium bg-brand hover:brightness-110 active:scale-[0.98] text-white px-3.5 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50"
                    >
                      {isCreating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                      Generate Key
                    </button>
                  </div>
                </div>
              )}
              
              {/* Keys List */}
              <div className="divide-y divide-borderRoot overflow-y-auto max-h-[460px]">
                {apiKeys.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <Key size={32} className="text-textMuted/30 mb-3" />
                    <p className="text-textMuted text-sm">No API keys found.</p>
                    <p className="text-textMuted/60 text-xs mt-1 mb-4">Create one to start making requests.</p>
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="flex items-center gap-1.5 text-xs font-medium bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      <Plus size={13} /> Create First Key
                    </button>
                  </div>
                ) : apiKeys.map((keyObj) => {
                  const isUnmasked = Boolean(unmaskedKeys[keyObj._id]);
                  const displayKey = isUnmasked
                    ? keyObj.key
                    : (keyObj.key.length > 12 ? `${keyObj.key.slice(0, 8)}••••••••••••${keyObj.key.slice(-4)}` : keyObj.key);
                  const createdDate = new Date(keyObj.created).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <div key={keyObj._id} className="p-4 sm:p-5 flex flex-col gap-3 hover:bg-white/[0.01] transition-colors">
                      {/* Row 1: Name, Status, Expiry, Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-textMain tracking-tight">{keyObj.name}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                              Live
                            </span>
                          </div>
                          <div className="text-[11px] text-textMuted flex items-center gap-2">
                            <span>{formatKeyExpiry(keyObj.expiresAt)}</span>
                            <span>&bull;</span>
                            <span>Created {createdDate}</span>
                          </div>
                        </div>

                        {/* Safe Delete on Top Right */}
                        <div className="shrink-0">
                          {confirmDeleteId === keyObj._id ? (
                            <div className="flex items-center gap-1 bg-red-500/10 p-0.5 rounded-md border border-red-500/20">
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-[11px] px-2 py-1 text-textMuted hover:text-textMain transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => { setConfirmDeleteId(null); handleDeleteKey(keyObj._id, true); }}
                                disabled={deletingId === keyObj._id}
                                className="text-[11px] font-medium px-2 py-1 bg-red-500 text-white rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                {deletingId === keyObj._id ? <Loader2 size={12} className="animate-spin" /> : 'Delete'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(keyObj._id)}
                              disabled={deletingId === keyObj._id}
                              className="p-1.5 text-textMuted/60 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all disabled:opacity-50"
                              title="Delete key"
                            >
                              {deletingId === keyObj._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Unified Interactive Token Box (Click whole box to copy) */}
                      <div
                        onClick={() => copyKey(keyObj.key, keyObj._id)}
                        className="group relative flex items-center justify-between gap-3 bg-base hover:bg-[#090909] border border-borderRoot hover:border-brand/40 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer shadow-inner"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Key size={13} className="text-textMuted group-hover:text-brand transition-colors shrink-0" />
                          <span className="font-mono text-xs text-textMain/90 truncate tracking-wide selection:bg-none">
                            {displayKey}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUnmask(keyObj._id);
                            }}
                            className="p-1 text-textMuted hover:text-textMain rounded transition-colors"
                            title={isUnmasked ? "Mask API Key" : "Reveal API Key"}
                          >
                            {isUnmasked ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border transition-all shrink-0 shadow-sm ${
                              copiedKey === keyObj._id
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-[#121212] group-hover:bg-brand group-hover:text-white border-borderRoot/80 text-textMuted'
                            }`}
                          >
                            {copiedKey === keyObj._id ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Row 3: Metrics */}
                      <div className="flex items-center justify-between text-[11px] text-textMuted/80 font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                          {keyObj.usageCount ? `${keyObj.usageCount.toLocaleString()} request${keyObj.usageCount === 1 ? '' : 's'} served` : '0 requests served'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Bottom Security Notice Strip */}
              <div className="bg-surface/50 border-t border-borderRoot p-3 px-4 sm:px-6 flex items-center gap-2 shrink-0">
                <AlertTriangle size={13} className="text-amber-400/80 shrink-0" />
                <p className="text-[11px] text-textMuted leading-snug">
                  Never expose production keys in client-side code. Proxy requests through your backend.
                </p>
              </div>
            </motion.div>

          </div>
          
          {/* RIGHT COLUMN: Stats & Quickstart */}
          <div className="flex flex-col gap-6">
            
            <motion.div variants={itemVariants} className="bg-surface border border-borderRoot rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg text-brand ring-1 ring-brand/20">
                    <Zap size={18} />
                  </div>
                  <h3 className="text-lg font-medium text-textMain">Usage</h3>
                </div>
                <button 
                  onClick={fetchFreshData}
                  className="p-1.5 text-textMuted hover:text-brand bg-base rounded-md border border-borderRoot transition-colors"
                  title="Refresh Usage"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="bg-[#050505] border border-borderRoot rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-textMain">Current Plan</div>
                    {isPro ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">PRO</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">FREE</span>
                    )}
                  </div>
                  <div className="text-xs text-textMuted flex items-center gap-2">
                    <Zap size={12} className={isPro ? 'text-amber-400' : ''} />
                    Speed: <span className="font-mono text-textMain">{isPro ? '2000' : '600'} req / 10 min</span>
                  </div>
                  {!isPro && (
                    <button 
                      onClick={handleTopUp}
                      disabled={isToppingUp}
                      className="w-full mt-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-semibold rounded-lg border border-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isToppingUp ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                      Upgrade to PRO (₹99)
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-textMuted">Available Credits</span>
                    <span className="text-textMuted text-[11px] font-mono">
                      {Math.min(100, Math.round(((user?.apiCredits || 0) / (isPro ? 100000 : 10000)) * 100))}% remaining
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-medium text-textMain tracking-tight">{(user?.apiCredits || 0).toLocaleString()}</span>
                      <span className="text-sm text-textMuted mb-1">left</span>
                    </div>
                  </div>
                  <div className="w-full bg-base h-2 rounded-full mt-3 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-brand to-[#ff6a2b] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(3, ((user?.apiCredits || 0) / (isPro ? 100000 : 10000)) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-textMuted mt-2.5 opacity-60">First time signup bonus: 10,000 credits. PRO top-up gives 100,000 credits for ₹99.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-surface border border-borderRoot rounded-2xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-borderRoot flex items-center justify-between bg-surface/50">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg text-brand ring-1 ring-brand/20">
                    <Code2 size={18} />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-textMain">Integration</h3>
                </div>

                {/* Switcher & Copy */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-[#0a0a0a] p-0.5 rounded-lg border border-borderRoot text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setIntegrationTab('curl')}
                      className={`px-2.5 py-1 rounded transition-colors ${integrationTab === 'curl' ? 'bg-white/10 text-white font-semibold' : 'text-textMuted hover:text-textMain'}`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntegrationTab('sdk')}
                      className={`px-2.5 py-1 rounded transition-colors ${integrationTab === 'sdk' ? 'bg-white/10 text-white font-semibold' : 'text-textMuted hover:text-textMain'}`}
                    >
                      SDK
                    </button>
                  </div>
                  <button
                    onClick={copySnippet}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-base hover:bg-[#151515] active:scale-[0.96] border border-borderRoot rounded-md transition-all text-textMain shadow-sm cursor-pointer"
                    title={`Copy ${integrationTab === 'curl' ? 'cURL command' : 'Node.js snippet'}`}
                  >
                    {copiedCurl ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-5 font-mono text-[11px] leading-relaxed text-textMuted overflow-x-auto whitespace-pre">
                {integrationTab === 'curl' ? (
                  <>
                    <span className="opacity-50"># Verified Gateway REST Endpoint</span>{'\n'}
                    <span className="text-brand">curl</span> -s -X GET \{'\n'}
                    &nbsp;&nbsp;<span className="text-stone-300">"{import.meta.env.VITE_API_URL || 'https://api.irctc.dev'}/api/v1/pnr/2265248473"</span> \{'\n'}
                    &nbsp;&nbsp;-H <span className="text-stone-300">"x-api-key: {apiKeys[0]?.key || 'YOUR_API_KEY'}"</span> \{'\n'}
                    &nbsp;&nbsp;-H <span className="text-stone-300">"accept: application/json"</span>
                  </>
                ) : (
                  <>
                    <span className="opacity-50"># Zero-Dependency TypeScript SDK (npm i irctc-api)</span>{'\n'}
                    <span className="text-blue-400">import</span> {'{ IrctcApi }'} <span className="text-blue-400">from</span> <span className="text-emerald-400">'irctc-api'</span>;{'\n\n'}
                    <span className="text-blue-400">const</span> client = <span className="text-blue-400">new</span> <span className="text-amber-400">IrctcApi</span>({'{'} apiKey: <span className="text-emerald-400">'{apiKeys[0]?.key || 'YOUR_API_KEY'}'</span> {'}'});{'\n'}
                    <span className="text-blue-400">const</span> pnr = <span className="text-blue-400">await</span> client.pnr.<span className="text-amber-400">check</span>(<span className="text-emerald-400">'2265248473'</span>);{'\n'}
                    console.<span className="text-amber-400">log</span>(pnr.chartStatus);
                  </>
                )}
              </div>
            </motion.div>

          </div>
        </div>
        
        {/* FULL WIDTH LOGS SECTION */}
        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 bg-surface border border-borderRoot rounded-2xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          {(() => {
            const filteredLogs = (user?.logs || []).filter((log: any) => {
              if (logStatusFilter === 'success') return log.status >= 200 && log.status < 300;
              if (logStatusFilter === 'error') return log.status >= 400;
              return true;
            });

            return (
              <>
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-borderRoot flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="p-2 bg-brand/10 rounded-lg text-brand ring-1 ring-brand/20 shrink-0">
                      <List size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-textMain truncate">Recent API Logs</h3>
                      <p className="text-[11px] sm:text-xs text-textMuted mt-0.5 truncate">
                        Showing {Math.min(visibleLogsCount, filteredLogs.length)} of {filteredLogs.length} entries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Filter Pills */}
                    <div className="flex bg-[#0a0a0a] p-0.5 rounded-lg border border-borderRoot text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('all')}
                        className={`px-2.5 py-1 rounded transition-colors ${logStatusFilter === 'all' ? 'bg-white/10 text-white font-medium' : 'text-textMuted hover:text-textMain'}`}
                      >
                        All ({user?.logs?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('success')}
                        className={`px-2.5 py-1 rounded transition-colors ${logStatusFilter === 'success' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-textMuted hover:text-textMain'}`}
                      >
                        2xx
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogStatusFilter('error')}
                        className={`px-2.5 py-1 rounded transition-colors ${logStatusFilter === 'error' ? 'bg-red-500/20 text-red-400 font-medium' : 'text-textMuted hover:text-textMain'}`}
                      >
                        Errors
                      </button>
                    </div>

                    {user?.logs && user.logs.length > 0 && (
                      <button
                        onClick={downloadLogsCSV}
                        className="flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 bg-base hover:bg-[#151515] active:scale-[0.98] border border-borderRoot rounded-md transition-all text-textMain shrink-0 shadow-sm"
                      >
                        <Download size={13} />
                        <span className="hidden sm:inline">Download CSV</span>
                        <span className="sm:hidden">CSV</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto md:max-h-[500px] md:overflow-y-auto relative">
                  {/* Desktop Table View */}
                  <table className="hidden md:table w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#0a0a0a] text-xs uppercase text-textMuted tracking-wider sticky top-0 z-10 shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                      <tr>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">Time</th>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">Method</th>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">Path</th>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">Status</th>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">Duration</th>
                        <th className="px-6 py-3.5 font-medium bg-[#0a0a0a]">IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderRoot text-textMuted">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-textMuted/60">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <List size={28} className="text-textMuted/30" />
                              <p className="text-sm font-medium text-textMain">
                                {logStatusFilter === 'all' ? 'No API logs recorded yet' : `No ${logStatusFilter} requests found`}
                              </p>
                              <p className="text-xs text-textMuted max-w-sm">
                                {logStatusFilter === 'all'
                                  ? 'Send a request using cURL or test in the interactive sandbox to see real-time telemetry.'
                                  : 'Try switching the filter to "All" to inspect other queries.'}
                              </p>
                              {logStatusFilter === 'all' && (
                                <Link
                                  to="/playground"
                                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-xs font-medium transition-colors cursor-pointer"
                                >
                                  <Terminal size={12} />
                                  <span>Test in Playground →</span>
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.slice(0, visibleLogsCount).map((log: any, i: number) => {
                          const isError = log.status >= 400;
                          const isAuthError = log.status === 401 || log.status === 402;
                          const rowKey = `${log.time}-${log.path}-${i}`;
                          return (
                            <tr key={rowKey} className={`transition-colors ${isAuthError ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-white/[0.01]'}`}>
                              <td className="px-6 py-3.5 text-xs">{formatLogTime(log.time)}</td>
                              <td className="px-6 py-3.5 font-mono text-xs font-semibold text-blue-400">{log.method || 'GET'}</td>
                              <td className="px-6 py-3.5 font-mono text-xs text-textMain">{log.path}</td>
                              <td className="px-6 py-3.5 font-mono text-xs font-medium">
                                <span className={log.status >= 200 && log.status < 300 ? 'text-emerald-400/80' : isError ? 'text-red-400/80' : 'text-amber-400/80'}>{log.status}</span>
                              </td>
                              <td className="px-6 py-3.5 font-mono text-xs text-textMuted">{log.duration ? `${Math.round(log.duration)} ms` : '-'}</td>
                              <td className="px-6 py-3.5 font-mono text-xs opacity-70">{formatIp(log.ip)}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Mobile Touch Card View */}
                  <div className="block md:hidden divide-y divide-borderRoot">
                    {filteredLogs.length === 0 ? (
                      <div className="px-4 py-12 text-center flex flex-col items-center justify-center gap-2">
                        <List size={28} className="text-textMuted/30" />
                        <p className="text-sm font-medium text-textMain">
                          {logStatusFilter === 'all' ? 'No API logs recorded yet' : `No ${logStatusFilter} requests found`}
                        </p>
                        <p className="text-xs text-textMuted max-w-sm">
                          {logStatusFilter === 'all'
                            ? 'Send a request using cURL or test in the interactive sandbox to see real-time telemetry.'
                            : 'Try switching the filter to "All" to inspect other queries.'}
                        </p>
                        {logStatusFilter === 'all' && (
                          <Link
                            to="/playground"
                            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Terminal size={12} />
                            <span>Test in Playground →</span>
                          </Link>
                        )}
                      </div>
                    ) : (
                      filteredLogs.slice(0, visibleLogsCount).map((log: any, i: number) => {
                        const isError = log.status >= 400;
                        const isAuthError = log.status === 401 || log.status === 402;
                        const cardKey = `m-${log.time}-${log.path}-${i}`;
                        return (
                          <div key={cardKey} className={`p-3.5 sm:p-4 flex flex-col gap-1.5 ${isAuthError ? 'bg-red-500/5' : 'hover:bg-white/[0.01]'}`}>
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-blue-400 bg-blue-400/10 border border-blue-400/20 shrink-0">
                                  {log.method || 'GET'}
                                </span>
                                <span className="font-mono text-xs font-medium text-textMain truncate" title={log.path}>
                                  {log.path}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${log.status >= 200 && log.status < 300 ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : isError ? 'text-red-400 bg-red-400/10 border border-red-400/20' : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'}`}>
                                {log.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-textMuted font-mono">
                              <span>{formatLogTime(log.time)}</span>
                              <span className="opacity-80">{log.duration ? `${Math.round(log.duration)} ms` : '-'} &bull; {formatIp(log.ip)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {visibleLogsCount < filteredLogs.length && (
                    <div className="p-4 border-t border-borderRoot flex justify-center bg-surface sticky bottom-0">
                      <button
                        onClick={() => setVisibleLogsCount(prev => prev + 50)}
                        className="text-xs font-medium px-6 py-2 bg-base hover:bg-[#151515] active:scale-[0.98] border border-borderRoot rounded-full transition-all text-textMain cursor-pointer"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </motion.div>
      </motion.div>

      {/* Ghost UI Auth Overlay */}
      {!user && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-[4px] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-3xl rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-1 ring-white/5 flex flex-col items-center text-center max-h-[90dvh] overflow-y-auto"
          >
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 ring-1 ring-brand/30 shadow-[inset_0_0_20px_rgba(var(--brand),0.2)]">
              <Key size={32} strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl font-bold text-textMain tracking-tight mb-2">Access Dashboard</h1>
            <p className="text-textMuted text-sm mb-8 leading-relaxed max-w-xs mx-auto">
              Sign in to manage your API keys, monitor request quotas, and view usage logs.
            </p>

            <div className="w-full flex justify-center mb-4">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
                      const res = await fetch(`${API_URL}/api/v1/auth/google/native`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken: credentialResponse.credential })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setUser(data.user);
                        localStorage.setItem('irctc_api_token', data.token);
                        toast.success('Welcome back!');
                      } else {
                        toast.error(data.message || 'Login Failed');
                      }
                    } catch (err) {
                      console.error('Login failed', err);
                      toast.error('Network error during login.');
                    }
                  }
                }}
                onError={() => toast.error('Google Login Failed')}
                theme="filled_black"
                size="large"
                width="300px"
              />
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
