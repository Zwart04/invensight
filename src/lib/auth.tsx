'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/lib/types';

const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
}>({ user: null, login: () => false, logout: () => {}, register: () => false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('invensight_user');
    if (stored) {
      try { setUser(JSON.parse(stored) as User); } catch {}
    }
    setLoaded(true);
  }, []);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('inv_users') || '[]');
    const u = users.find((x: User) => x.email === email.toLowerCase());
    if (u) { setUser(u); localStorage.setItem('invensight_user', JSON.stringify(u)); return true; }
    return false;
  };

  const logout = () => { setUser(null); localStorage.removeItem('invensight_user'); };

  const register = (name: string, email: string, password: string) => {
    if (!name.trim() || !email.includes('@') || !password || password.length < 6) return false;
    const users = JSON.parse(localStorage.getItem('inv_users') || '[]');
    if (users.find((x: User) => x.email === email.toLowerCase())) return false;
    const u: User = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase() };
    users.push(u);
    localStorage.setItem('inv_users', JSON.stringify(users));
    setUser(u);
    localStorage.setItem('invensight_user', JSON.stringify(u));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
