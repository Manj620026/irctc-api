import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { googleLogout } from '@react-oauth/google';
import { API_URL, getAuthToken } from '../lib/api';

type AuthContextType = {
  user: any;
  authLoading: boolean;
  setUser: (user: any) => void;
  loginWithGoogle: (idToken: string) => Promise<{ ok: boolean; token?: string; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return Boolean(localStorage.getItem('irctc_api_token'));
    } catch {
      return false;
    }
  });

  const fetchUser = (token: string) => {
    return fetch(`${API_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        if (localStorage.getItem('irctc_api_token') === token) {
          localStorage.removeItem('irctc_api_token');
          setUser(null);
        }
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && localStorage.getItem('irctc_api_token') === token) setUser(data.user);
    })
    .catch(err => {
      if (import.meta.env.DEV) {
        console.error('Network error during auth check, skipping logout to preserve session', err);
      }
    })
    .finally(() => setAuthLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('irctc_api_token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'irctc_api_token') {
        if (!e.newValue) {
          setUser(null);
        } else {
          fetchUser(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/google/native`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.token) {
      return { ok: false, message: data.message || 'Sign in failed' };
    }
    localStorage.setItem('irctc_api_token', data.token);
    setUser(data.user);
    return { ok: true, token: data.token };
  };

  const logout = useCallback(() => {
    const token = getAuthToken();
    if (token) {
      // Revoke on the server too; otherwise a copied token stays valid for the rest of its 24 h
      fetch(`${API_URL}/api/v1/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
    googleLogout();
    setUser(null);
    localStorage.removeItem('irctc_api_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, setUser, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

