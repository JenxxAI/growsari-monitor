import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { DEMO_USERS, CREDENTIALS } from '../lib/data';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = sessionStorage.getItem('qa_monitor_user');
    if (stored) {
      return { user: JSON.parse(stored), isAuthenticated: true };
    }
    return { user: null, isAuthenticated: false };
  });

  const login = (username: string, password: string): boolean => {
    const cred = CREDENTIALS[username];
    if (!cred || cred.password !== password) return false;
    const user = DEMO_USERS.find(u => u.id === cred.userId);
    if (!user) return false;
    sessionStorage.setItem('qa_monitor_user', JSON.stringify(user));
    setAuth({ user, isAuthenticated: true });
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem('qa_monitor_user');
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
