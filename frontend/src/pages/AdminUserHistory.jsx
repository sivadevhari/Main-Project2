import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Clock, Download, FileText, Activity, UserCircle, Calendar, TrendingUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { downloadReport } from '../lib/api';
import LoadingScreen from '../components/LoadingScreen';

export default function AdminUserHistory() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    loadUserHistory();
  }, [userId]);

  const loadUserHistory = async () => {
    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setDiagnostics(data.diagnostics || []);
      } else {
        setError(data.message || 'Failed to load user history');
      }
    } catch (err) {
      console.error('User history error:', err);
      setError('Failed to load user history');
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <LoadingScreen message="Loading user history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border border-red-100"
          >
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold shadow-lg"
            >
              Back to Admin Panel
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin Panel
        </motion.button>

        {/* User Info Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-20 -mb-20"></div>
            
            <div className="relative z-10 flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30"
              >
                {user.name?.charAt(0) || 'U'}
              </motion.div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {user.address && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {user.address}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-white/80 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Last Login</span>
                </div>
                <div className="font-medium">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Total Predictions</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{diagnostics.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">First Prediction</span>
            </div>
            <div className="text-lg font-medium text-gray-700">
              {diagnostics.length > 0
                ? new Date(diagnostics[diagnostics.length - 1].timestamp).toLocaleDateString()
                : 'N/A'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Latest Prediction</span>
            </div>
            <div className="text-lg font-medium text-gray-700">
              {diagnostics.length > 0
                ? new Date(diagnostics[0].timestamp).toLocaleDateString()
                : 'N/A'}
            </div>
          </motion.div>
        </div>

        {/* Predictions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Prediction History</h2>
                <p className="text-white/80 text-sm">All predictions made by this user</p>
              </div>
            </div>
          </div>

          {diagnostics.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No predictions found for this user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Symptoms
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Disease</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Accuracy</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-gray-700 max-w-xs truncate text-sm">
                        {item.symptoms}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200">
                          {item.disease}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm font-medium">
                        {item.accuracy}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(item)}
                          disabled={downloading === item.id}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
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
          )}
        </motion.div>
      </div>
    </div>
  );
}
