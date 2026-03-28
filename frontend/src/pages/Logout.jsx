import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { logout } from '../lib/api';

export default function Logout() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (e) {
        // Ignore errors
      }
      authLogout();
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => navigate('/login'), 1000);
    };
    performLogout();
  }, [navigate, authLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] w-full max-w-md text-center" style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Logged Out Successfully</h2>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
