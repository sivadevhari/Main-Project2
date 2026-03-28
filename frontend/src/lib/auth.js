import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, logout as apiLogout } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    console.log('=== checkSession called ===');
    try {
      const res = await getSession();
      console.log('checkSession result:', res);
      if (res.logged_in && res.user) {
        setUser(res.user);
        sessionStorage.setItem('user', JSON.stringify(res.user));
        console.log('✓ Session valid, user set:', res.user);
        return true;
      } else {
        setUser(null);
        sessionStorage.removeItem('user');
        console.log('✗ No valid session');
        return false;
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
      sessionStorage.removeItem('user');
      return false;
    }
  }, []);

  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, [checkSession]);

  const login = async (userData) => {
    console.log('=== auth.login called ===');
    console.log('User data to store:', userData);
    
    // Test if sessionStorage is available
    try {
      sessionStorage.setItem('test_key', 'test_value');
      console.log('✓ sessionStorage test succeeded');
      console.log('✓ sessionStorage test read:', sessionStorage.getItem('test_key'));
      sessionStorage.removeItem('test_key');
    } catch (e) {
      console.error('sessionStorage not available:', e);
    }
    
    // Set user in state
    setUser(userData);
    // Store in sessionStorage
    const userDataString = JSON.stringify(userData);
    console.log('Setting sessionStorage.user to:', userDataString);
    sessionStorage.setItem('user', userDataString);
    console.log('✓ User stored in sessionStorage and state');
    console.log('Current sessionStorage.user:', sessionStorage.getItem('user'));
  };

  const logout = async () => {
    console.log('=== auth.logout called ===');
    console.log('Current user before logout:', user);
    console.log('Current sessionStorage.user:', sessionStorage.getItem('user'));
    try {
      await apiLogout();
    } catch (e) {
      console.error('Logout API error:', e);
    }
    // Clear user state immediately
    setUser(null);
    // Clear ALL sessionStorage
    sessionStorage.clear();
    // Clear all cookies for current domain
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log('✓ All storage cleared');
    console.log('User after logout:', user);
    console.log('sessionStorage.user after logout:', sessionStorage.getItem('user'));
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
