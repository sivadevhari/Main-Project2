import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, AlertCircle } from 'lucide-react';
import { predict } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function PredictForm() {
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await predict(symptoms);
      if (res.success) {
        navigate('/result', { state: { result: res, symptoms } });
      } else {
        setError(res.message || 'Prediction failed');
      }
    } catch (err) {
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-[30px] p-12 max-w-[600px] w-full shadow-2xl relative overflow-hidden border border-white/20">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl">
            <Activity className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Intelligent Disease
        </h1>
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Prediction System
        </h2>
        
        <p className="text-center text-gray-600 text-sm mb-8 font-medium max-w-md mx-auto">
          Enter your symptoms below. Our AI-powered system will analyze the patterns to provide a preliminary assessment.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-left">
            <label className="block mb-3 font-semibold text-gray-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Describe Your Symptoms
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. high fever, joint pain, skin rash, fatigue..."
              required
              className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all border-2 border-gray-200 focus:border-blue-500 focus:bg-white bg-gray-50"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-600 text-sm">{error}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: loading
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              boxShadow: loading ? 'none' : '0 10px 40px rgba(6, 182, 212, 0.4)'
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Analyze Symptoms
              </>
            )}
          </motion.button>
        </form>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          For informational purposes only. Not a medical diagnosis.
        </motion.div>
      </div>
    </motion.div>
  );
}
