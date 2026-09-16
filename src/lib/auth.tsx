'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type User = { id: string; name: string; email: string };

const STORAGE_USER = 'invensight_user';
const STORAGE_USERS = 'inv_users';
const DEFAULT_USER: User = { id: 'default', name: 'Admin', email: 'admin@invensight.local' };

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    const u = JSON.parse(raw) as User;
    if (u && u.id && u.email) return u;
    return null;
  } catch { return null; }
}

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [DEFAULT_USER];
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) return [DEFAULT_USER];
    const arr = JSON.parse(raw) as User[];
    if (Array.isArray(arr) && arr.length) return arr;
    return [DEFAULT_USER];
  } catch { return [DEFAULT_USER]; }
}

function setStoredUser(u: User | null) {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem(STORAGE_USER, JSON.stringify(u));
  else localStorage.removeItem(STORAGE_USER);
}

function setStoredUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function signUp(name: string, email: string, password: string): User | null {
  if (!name.trim()) return null;
  if (!email.trim() || !email.includes('@')) return null;
  if (!password || password.length < 6) return null;
  const users = getStoredUsers();
  if (users.find(u => u.email === email)) return null;
  const user: User = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase() };
  users.push(user);
  setStoredUsers(users);
  setStoredUser(user);
  return user;
}

function signIn(email: string, password: string): User | null {
  if (!email || !password) return null;
  const users = getStoredUsers();
  return users.find(u => u.email === email.toLowerCase()) ?? null;
}

function signOut() {
  setStoredUser(null);
}

type AuthContextType = {
  user: User | null;
  signUp: (name: string, email: string, password: string) => User | null;
  signIn: (email: string, password: string) => User | null;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
