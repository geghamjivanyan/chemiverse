import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  nickname: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
}

interface AuthValue {
  user: User | null;
  loading: boolean;
  loginGuest: () => Promise<void>;
  register: (nickname: string, password: string) => Promise<void>;
  login: (nickname: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

async function post(url: string, body?: unknown): Promise<User> {
  const r = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `error_${r.status}`);
  return data.user as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value: AuthValue = {
    user,
    loading,
    loginGuest: async () => setUser(await post('/api/auth/guest')),
    register: async (nickname, password) => setUser(await post('/api/auth/register', { nickname, password })),
    login: async (nickname, password) => setUser(await post('/api/auth/login', { nickname, password })),
    logout: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен быть внутри <AuthProvider>');
  return ctx;
}
