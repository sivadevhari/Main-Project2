import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, AlertCircle, Inbox, Clock, Activity } from 'lucide-react';
import { getHistory, downloadReport } from '../lib/api';
import { useAuth } from '../lib/auth';
import LoadingScreen from './LoadingScreen';

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const { user, checkSession } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const sessionValid = await checkSession();
      if (!sessionValid) {
        setError('Please login to view history');
        setLoading(false);
        return;
      }

      const data = await getHistory();
      if (data.success) {
        setHistory(data.diagnostics || []);
      } else {
        setError(data.message || 'Failed to load history');
      }
    } catch (err) {
      console.error('History error:', err);
      setError('Failed to load history. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item) => {
    setDownloading(item.id);
    try {
      await downloadReport({
        user_name: item.user_name,
        symptoms: item.symptoms,
        disease: item.disease,
        description: '',
        causes: '',
        precautions: '',
        accuracy: item.accuracy
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your history..." />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border border-red-100"
      >
        <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600 mb-6 font-medium">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/login'}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold shadow-lg"
        >
          Go to Login
        </motion.button>
      </motion.div>
    );
  }

  if (!history.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto border border-gray-100"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <Inbox className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No History Yet</h3>
        <p className="text-gray-600 mb-8">You haven't made any predictions. Start by analyzing your symptoms!</p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/predict"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg no-underline"
        >
          Make Your First Prediction
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Prediction History</h2>
            <p className="text-white/80 text-sm">View all your previous disease predictions</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Date & Time
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Symptoms
                </div>
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                Disease
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                Accuracy
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
              >
                <td className="py-4 px-6 text-gray-600 text-sm align-middle">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm align-middle">
                  <div className="max-w-xs truncate" title={item.symptoms}>
                    {item.symptoms}
                  </div>
                </td>
                <td className="py-4 px-6 align-middle">
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200">
                    {item.disease}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm font-medium align-middle">
                  {item.accuracy}
                </td>
                <td className="py-4 px-6 text-center align-middle">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                    disabled={downloading === item.id}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg"
                  >
                    {downloading === item.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    )}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
