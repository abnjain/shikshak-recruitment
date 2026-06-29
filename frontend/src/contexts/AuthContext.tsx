import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { JwtResponse, User } from '../types';
import { authApi } from '../api';
import { tokenManager } from '../api/tokenManager';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: JwtResponse) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const newToken = await tokenManager.refresh('/api/v1/auth/refresh');
        if (newToken) {
          setToken(newToken);
          const response = await authApi.getCurrentUser();
          setUser(response.data.data);
        }
      } catch {
        // No valid refresh token — user is not logged in
        tokenManager.clear();
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback((newToken: string, userData: JwtResponse) => {
    // Store access token ONLY in memory
    tokenManager.setAccessToken(newToken);
    setToken(newToken);

    // Fetch full user profile
    authApi.getCurrentUser().then((res) => {
      setUser(res.data.data);
    }).catch(() => {
      // Fallback: set basic info from JWT response
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: '',
        active: true,
        emailVerified: false,
        profilePictureUrl: '',
        roles: userData.roles,
        createdAt: '',
        updatedAt: '',
      });
    });
  }, []);

  const logout = useCallback(() => {
    // Clear in-memory token
    tokenManager.clear();
    setToken(null);
    setUser(null);

    // Tell backend to clear the httpOnly cookie
    fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});

    window.location.href = '/login';
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    return user.roles.some((r) => r === `ROLE_${role.toUpperCase()}` || r === role.toUpperCase());
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
