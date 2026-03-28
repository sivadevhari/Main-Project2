import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, logout as apiLogout } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await getSession();
      if (res.logged_in && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        return true;
      } else {
        setUser(null);
        localStorage.removeItem('user');
        return false;
      }
    } catch (err) {
      console.error('Session check failed:', err);
      // Fallback to localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          return true;
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      return false;
    }
  }, []);

  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, [checkSession]);

  const login = async (userData) => {
    // After login, verify session was created
    await checkSession();
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // Ignore logout errors
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
