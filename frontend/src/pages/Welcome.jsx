import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Stethoscope, FileText, UserPlus, LogIn, Shield, Zap, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/auth';

export default function Welcome() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
          variants={floatVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <Navbar />

      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center text-white max-w-4xl">
          {/* Icon Row */}
          <motion.div
            className="flex justify-center gap-6 mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Activity className="w-10 h-10 text-cyan-400" />
            </motion.div>
            <motion.div
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <Stethoscope className="w-10 h-10 text-purple-400" />
            </motion.div>
            <motion.div
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Shield className="w-10 h-10 text-pink-400" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Intelligent Disease
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
              Prediction System
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl mb-4 opacity-90 font-light"
            variants={itemVariants}
          >
            Advanced AI-powered disease prediction using your symptoms
          </motion.p>

          <motion.p
            className="text-lg mb-12 opacity-75 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Get instant insights, recommended precautions, and connect with the right healthcare professionals
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            variants={itemVariants}
          >
            {['AI-Powered Analysis', 'Instant Results', 'Medical Insights', 'Secure & Private'].map((feature, index) => (
              <motion.div
                key={feature}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {index === 0 && <Zap className="inline w-4 h-4 mr-1 -mt-0.5 text-yellow-400" />}
                {index === 1 && <Heart className="inline w-4 h-4 mr-1 -mt-0.5 text-pink-400" />}
                {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            variants={itemVariants}
          >
            {user ? (
              <>
                <Link
                  to="/predict"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 no-underline overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Predict Disease
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/history"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 no-underline"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    View History
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 no-underline"
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login
                  </span>
                </Link>
                <Link
                  to="/signup"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 no-underline"
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
