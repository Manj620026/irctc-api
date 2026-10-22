import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 text-textMuted">
        <Loader2 size={24} className="animate-spin text-brand" />
        <span className="text-xs font-mono tracking-wider uppercase">Verifying Authorization...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-surface border border-borderRoot rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-semibold text-textMain tracking-tight mb-2">
            Administrator Access Required
          </h2>
          <p className="text-xs text-textMuted leading-relaxed mb-6">
            Your account (<span className="font-mono text-textMain/80">{user.email}</span>) does not hold operator privileges. Access to the infrastructure control plane is restricted to authorized engine administrators.
          </p>
          <div className="pt-2 border-t border-borderRoot/60">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-base hover:bg-white/5 border border-borderRoot text-textMain rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft size={14} />
              Return to Developer Console
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
