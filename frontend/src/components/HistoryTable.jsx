import React, { useEffect, useState } from 'react';
import { getHistory, downloadReport } from '../lib/api';
import { useAuth } from '../lib/auth';

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
      // First verify session is still valid
      const sessionValid = await checkSession();
      if (!sessionValid) {
        setError('Please login to view history');
        setLoading(false);
        return;
      }

      const data = await getHistory();
      console.log('History response:', data);
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
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md mx-auto">
        <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No History Found</h3>
        <p className="text-gray-600 mb-6">You haven't made any predictions yet.</p>
        <a
          href="/predict"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors no-underline"
        >
          Make Your First Prediction
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden max-w-5xl mx-auto" style={{
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">📋 Your Prediction History</h2>
        <p className="text-white/80 text-sm mt-1">View all your previous disease predictions</p>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Date & Time</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Symptoms</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Disease</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Accuracy</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-gray-600">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-gray-700 max-w-xs truncate">
                  {item.symptoms}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {item.disease}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {item.accuracy}
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={downloading === item.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {downloading === item.id ? '⏳ Downloading...' : '📥 Download'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
