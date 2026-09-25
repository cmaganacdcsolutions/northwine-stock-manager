import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { verifyDemoCredentials } from './demoCredentials';

const SESSION_KEY = 'nw:session-user';

interface AuthContextValue {
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() => window.sessionStorage.getItem(SESSION_KEY));

  const login = useCallback((username: string, password: string): boolean => {
    if (!verifyDemoCredentials(username, password)) return false;
    window.sessionStorage.setItem(SESSION_KEY, username);
    setUser(username);
    return true;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem('nw:active-branch');
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
