import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, FileText, User, Activity, Thermometer, Shield, Stethoscope, AlertTriangle, CheckCircle, Home } from 'lucide-react';
import { downloadReport } from '../lib/api';
import Navbar from '../components/Navbar';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const symptoms = location.state?.symptoms;
  const [downloading, setDownloading] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600 mb-4">No result to display</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/predict')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
          >
            Go to Prediction
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport({
        user_name: result.user_name || 'User',
        symptoms: symptoms || '',
        disease: result.disease,
        description: result.description,
        causes: result.causes,
        precautions: result.precautions,
        accuracy: result.accuracy
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen pb-12 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50"></div>
      
      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[30px] overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-white/40"
          >
            {/* Animated Header */}
            <motion.div
              variants={itemVariants}
              className="text-white text-center py-12 px-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4"
              >
                <CheckCircle className="w-4 h-4" />
                Analysis Complete
              </motion.div>
              <h1 className="text-2xl font-bold mb-4 opacity-90">Predicted Condition</h1>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block px-10 py-4 rounded-[50px] font-bold text-2xl bg-white/25 backdrop-blur-sm border-2 border-white/30 shadow-xl"
              >
                {result.disease}
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image & About */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                  {/* Image */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl overflow-hidden shadow-xl aspect-video"
                  >
                    <img
                      src={`/images/${result.image || 'default.jpg'}`}
                      alt={result.disease}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </motion.div>

                  {/* About Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-lg"
                  >
                    <h4 className="font-bold text-lg mb-3 text-blue-800 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      About This Condition
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">{result.description}</p>
                  </motion.div>
                </motion.div>

                {/* Right Column - Details */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                  {/* Causes */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="rounded-2xl p-6 bg-white border border-gray-100 shadow-lg"
                  >
                    <h4 className="font-bold text-lg mb-3 text-purple-800 flex items-center gap-2">
                      <Thermometer className="w-5 h-5" />
                      Common Causes
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{result.causes}</p>
                  </motion.div>

                  {/* Precautions */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 shadow-lg"
                  >
                    <h4 className="font-bold text-lg mb-3 text-emerald-800 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Recommended Precautions
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{result.precautions}</p>
                  </motion.div>

                  {/* Doctor */}
                  {result.doctor && (
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 shadow-lg"
                    >
                      <h4 className="font-bold text-lg mb-3 text-purple-800 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        Recommended Specialist
                      </h4>
                      <div className="mb-2">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          {result.doctor}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{result.doctor_description}</p>
                    </motion.div>
                  )}

                  {/* Download Section */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 shadow-lg mt-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-800">Medical Report</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="rounded-xl p-4 bg-white border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500 uppercase">Patient</span>
                        </div>
                        <div className="text-gray-800 font-medium">{result.user_name || 'N/A'}</div>
                      </div>
                      <div className="rounded-xl p-4 bg-white border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500 uppercase">Accuracy</span>
                        </div>
                        <div className="text-gray-800 font-medium">{result.accuracy || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/')}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Home className="w-5 h-5" />
                        Home
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/predict')}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Activity className="w-5 h-5" />
                        New Diagnosis
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                          background: downloading
                            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        }}
                      >
                        {downloading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Download Report
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Disclaimer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-2xl p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-inner"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-800 mb-2">⚠️ Medical Disclaimer</div>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          This prediction is for informational purposes only and does NOT replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions you may have regarding medical conditions.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
