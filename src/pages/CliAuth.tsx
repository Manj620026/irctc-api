import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, ArrowRight, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { API_URL, getAuthToken } from '../lib/api';

export default function CliAuth() {
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();
  const { user, authLoading, loginWithGoogle, logout } = useAuth();

  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCode, setUserCode] = useState('');

  const isValidToken = /^[a-f0-9]{48}$/.test(token);

  const handleApprove = async (authToken?: string) => {
    const jwt = authToken || getAuthToken();
    if (!jwt) {
      toast.error('Please sign in to approve terminal access.');
      return;
    }

    if (!isValidToken) {
      setErrorMessage('Invalid authorization token format.');
      return;
    }

    setIsApproving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/cli-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ token, userCode }),
      });

      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        // Expired, revoked or banned dashboard session: drop it so the page falls back to Google sign-in
        logout();
        toast.error(data.message || 'Your session has expired. Please sign in again.');
        return;
      }
      if (data.code === 'INVALID_CODE') {
        toast.error(data.message);
        return;
      }

      if (res.ok && data.success) {
        setIsApproved(true);
        toast.success('Terminal CLI successfully authorized!');
      } else {
        const msg = data.message || 'Authorization failed or session has expired.';
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Network error while authorizing terminal.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      toast.error('Google authorization failed');
      return;
    }

    try {
      const out = await loginWithGoogle(credentialResponse.credential);
      if (out.ok) {
        toast.success('Signed in with Google!');
      } else {
        toast.error(out.message || 'Sign in failed');
      }
    } catch {
      toast.error('Network error during Google sign in');
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center px-4 py-12 sm:py-20 relative">
      <div className="absolute inset-0 bg-radial from-brand/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-1 ring-white/5 text-center relative z-10"
      >
        {/* State 1: Invalid Token */}
        {!isValidToken ? (
          <div>
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
              <AlertTriangle size={30} />
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Invalid Authorization Link</h1>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              This terminal authorization link is invalid or incomplete. Please check that you copied the complete URL from your terminal.
            </p>
            <div className="bg-[#121212] border border-borderRoot rounded-xl p-3.5 mb-6 text-left">
              <span className="text-[11px] font-mono text-textMuted block mb-1">RUN COMMAND IN TERMINAL:</span>
              <code className="text-xs font-mono text-brand font-semibold select-all">npx irctc-api login</code>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-textMain rounded-xl text-sm font-medium border border-borderRoot transition-colors"
            >
              Go to Developer Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        ) : isApproved ? (
          /* State 2: Approval Succeeded */
          <div>
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Terminal CLI Authorized!</h1>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              Your terminal picks up the key within a few seconds, and the <code className="text-brand font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">irctc-api</code> CLI stores it in <code className="text-brand font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">~/.irctc/config.json</code>.
            </p>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
              <Laptop size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-textMuted leading-relaxed">
                <span className="text-emerald-400 font-semibold block mb-0.5">Switch back to your terminal window.</span>
                Your CLI session resumes on its own. Calls from it use your account's credit balance.
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand hover:bg-brand/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-brand/20"
            >
              Open Developer Console <ArrowRight size={14} />
            </Link>
          </div>
        ) : errorMessage ? (
          /* State 3: Error Encountered */
          <div>
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-amber-500/30">
              <AlertTriangle size={30} />
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Session Expired</h1>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              {errorMessage}
            </p>
            <div className="bg-[#121212] border border-borderRoot rounded-xl p-3.5 mb-6 text-left">
              <span className="text-[11px] font-mono text-textMuted block mb-1">START A NEW SESSION IN TERMINAL:</span>
              <code className="text-xs font-mono text-brand font-semibold select-all">npx irctc-api login</code>
            </div>
            <button
              type="button"
              disabled={isApproving}
              onClick={() => handleApprove()}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-textMain rounded-xl text-sm font-medium border border-borderRoot transition-colors disabled:opacity-50"
            >
              Retry Authorization
            </button>
          </div>
        ) : !user ? (
          /* State 4: User Needs to Sign in with Google */
          <div>
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-brand/30 shadow-[inset_0_0_20px_rgba(255,77,0,0.2)]">
              <Terminal size={30} />
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Authorize Terminal CLI</h1>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              Sign in with Google to link your developer account to this terminal session.
            </p>

            <div className="bg-[#121212] border border-borderRoot rounded-2xl p-3.5 mb-6 text-left flex items-center gap-3">
              <ShieldCheck size={18} className="text-brand shrink-0" />
              <div className="text-xs text-textMuted">
                Session Token: <code className="font-mono text-textMain font-semibold">{token.slice(0, 8)}...{token.slice(-6)}</code>
              </div>
            </div>

            <div className="w-full flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign In failed')}
                theme="filled_black"
                size="large"
                width="300px"
              />
            </div>

            <p className="text-[11px] text-textMuted mt-4">
              Zero credit card required. Instant 1-click developer authorization.
            </p>
          </div>
        ) : (
          /* State 5: User Already Signed in - 1-Click Approve */
          <div>
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-brand/30 shadow-[inset_0_0_20px_rgba(255,77,0,0.2)]">
              <Terminal size={30} />
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Authorize Terminal CLI</h1>
            <p className="text-textMuted text-sm mb-6 leading-relaxed">
              Grant your local terminal session access to your IRCTC API developer account.
            </p>

            <div className="bg-[#121212] border border-borderRoot rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-textMuted">Account:</span>
                <span className="text-textMain font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-textMuted">Plan:</span>
                <span className="text-brand font-semibold">{user.plan || 'Free'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-textMuted">Session Token:</span>
                <span className="font-mono text-textMuted">{token.slice(0, 8)}...{token.slice(-6)}</span>
              </div>
            </div>

            <label htmlFor="cli-user-code" className="block text-left text-xs text-textMuted mb-1.5">
              Code shown in your terminal. Only continue if you ran <code className="font-mono">npx irctc-api login</code> yourself.
            </label>
            <input
              id="cli-user-code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value.trim().toUpperCase())}
              maxLength={8}
              autoComplete="off"
              spellCheck={false}
              className="w-full mb-4 px-3 py-2.5 rounded-xl bg-[#121212] border border-borderRoot text-center font-mono tracking-[0.3em] text-textMain"
            />

            <button
              type="button"
              disabled={isApproving || userCode.length !== 8}
              onClick={() => handleApprove()}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand/20 cursor-pointer"
            >
              {isApproving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authorizing Terminal...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authorize Terminal</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-textMuted mt-4">
              The CLI stores its key in <code className="text-textMain font-mono">~/.irctc/config.json</code>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
