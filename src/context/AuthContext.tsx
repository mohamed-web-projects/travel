"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  name: string;
  email: string;
  initials: string;
  plan: string;
  memberSince: string;
}

interface AuthValue {
  user: AuthUser | null;
  signIn: (input: { name: string; email: string }) => void;
  signOut: () => void;
}

const AUTH_KEY = "reaori.user";

const AuthContext = createContext<AuthValue | null>(null);

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "R";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } catch {
        /* ignore corrupted storage */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, [user]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      signIn: ({ name, email }) =>
        setUser({
          name,
          email,
          initials: initialsOf(name),
          plan: "REAORI Gold",
          memberSince: new Date().getFullYear().toString(),
        }),
      signOut: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}