import React, { createContext, useState, useEffect, useMemo } from 'react';
import { User } from '@/types';
import api from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const response = await api.get<User>('/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Auto-login failed', error);
        setUser(null);
      }
      setIsLoading(false);
    };
    attemptAutoLogin();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    }
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, isLoading, login, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}