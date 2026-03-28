import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, LogOut, User, Shield, Home, FileText } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { logout } from '../lib/api';

export default function Navbar() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    authLogout();
    navigate('/logout_confirm');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Link to="/" className="flex items-center gap-2 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-2xl no-underline hover:opacity-80 transition-opacity">
        <Activity className="w-7 h-7 text-blue-600" />
        <span className="hidden sm:inline">Disease Predictor</span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 text-gray-700 font-medium no-underline hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          to="/predict"
          className="flex items-center gap-1.5 px-3 py-2 text-gray-700 font-medium no-underline hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
        >
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Predict</span>
        </Link>
        {user ? (
          <>
            <Link
              to="/history"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-700 font-medium no-underline hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </Link>
            {user.is_admin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-medium no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-gray-700 font-medium no-underline hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-medium no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
