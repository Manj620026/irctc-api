import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';

type AuthContextType = {
  user: any;
  authLoading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = (token: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
    return fetch(`${API_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('irctc_api_token');
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.success) setUser(data.user);
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
    } else {
      setAuthLoading(false);
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

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('irctc_api_token');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

