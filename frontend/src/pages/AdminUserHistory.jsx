import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { downloadReport } from '../lib/api';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Back to Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin Panel
        </button>

        {/* User Info Card */}
        {user && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-white/80">{user.email}</p>
                {user.address && <p className="text-white/60 text-sm mt-1">📍 {user.address}</p>}
              </div>
              <div className="text-right">
                <div className="text-white/80 text-sm">Last Login</div>
                <div className="font-medium">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Predictions</div>
            <div className="text-3xl font-bold text-blue-600">{diagnostics.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">First Prediction</div>
            <div className="text-lg font-medium text-gray-700">
              {diagnostics.length > 0 
                ? new Date(diagnostics[diagnostics.length - 1].timestamp).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Latest Prediction</div>
            <div className="text-lg font-medium text-gray-700">
              {diagnostics.length > 0 
                ? new Date(diagnostics[0].timestamp).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Predictions Table */}
        <div className="bg-white rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden" style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">📊 Prediction History</h2>
          </div>

          {diagnostics.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No predictions found for this user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Symptoms</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Disease</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Accuracy</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-gray-700 max-w-xs truncate">
                        {item.symptoms}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {item.disease}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {item.accuracy}
                      </td>
                      <td className="py-4 px-6 text-center">
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
          )}
        </div>
      </div>
    </div>
  );
}
