import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminPanel } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function AdminPanelContent() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userDiagnostics, setUserDiagnostics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const data = await getAdminPanel();
      if (data.success) {
        setUsers(data.users || []);
        setUserDiagnostics(data.user_diagnostics || {});
      } else {
        setError(data.message || 'Failed to load admin data');
      }
    } catch (err) {
      console.error('Admin panel error:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadAdminData}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalPredictions = Object.values(userDiagnostics).reduce((sum, diags) => sum + diags.length, 0);
  const totalUsers = users.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm opacity-80">Total Users</div>
          <div className="text-4xl font-bold">{totalUsers}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm opacity-80">Total Predictions</div>
          <div className="text-4xl font-bold">{totalPredictions}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm opacity-80">Admin User</div>
          <div className="text-lg font-bold truncate">{user?.name || 'N/A'}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden mb-8" style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">👥 Registered Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Address</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Login</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Predictions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => {
                const userPreds = userDiagnostics[u.id]?.length || 0;
                return (
                  <tr
                    key={u.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      <span className="text-blue-600 hover:underline">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{u.email}</td>
                    <td className="py-4 px-6 text-gray-600">{u.address || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        userPreds > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {userPreds}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="bg-white rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden" style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">📊 All Predictions</h3>
        </div>
        <div className="p-6">
          {Object.entries(userDiagnostics).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No predictions recorded yet.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(userDiagnostics).map(([uid, diags]) => {
                const userInfo = users.find(u => u.id == uid);
                return (
                  <div key={uid} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {userInfo?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{userInfo?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{userInfo?.email || ''}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {diags.map((d, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-1">
                              {d.disease}
                            </span>
                            <div className="text-sm text-gray-600 mt-1">{d.symptoms}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">{d.accuracy}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(d.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
