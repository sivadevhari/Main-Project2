import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { logout } from '../lib/api';

export default function Logout() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  React.useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (e) {
        // Ignore errors
      } finally {
        authLogout();
        setTimeout(() => navigate('/login'), 1000);
      }
    };
    performLogout();
  }, [navigate, authLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"></div>
      
      {/* Animated circles */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [-10, 10, -10], x: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [10, -10, 10], x: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/20">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-xl"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Logged Out Successfully
          </h2>
          
          <p className="text-gray-600 mb-6">
            You have been securely logged out of your account.
          </p>

          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"
            />
            <span>Redirecting to login...</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
