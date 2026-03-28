import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Shield, TrendingUp, Mail, MapPin, Clock, ChevronRight, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminPanel } from '../lib/api';
import { useAuth } from '../lib/auth';
import LoadingScreen from './LoadingScreen';

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
    return <LoadingScreen message="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border border-red-100"
      >
        <p className="text-red-600 mb-6 font-medium">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadAdminData}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold shadow-lg"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  const totalPredictions = Object.values(userDiagnostics).reduce((sum, diags) => sum + diags.length, 0);
  const totalUsers = users.length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      color: 'text-blue-600'
    },
    {
      title: 'Total Predictions',
      value: totalPredictions,
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
      color: 'text-purple-600'
    },
    {
      title: 'Admin User',
      value: user?.name?.split(' ')[0] || 'N/A',
      icon: Shield,
      gradient: 'from-emerald-500 to-emerald-600',
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.title === 'Admin User' && (
                  <TrendingUp className="w-5 h-5 text-white/60" />
                )}
              </div>
              <div className="text-sm opacity-80 font-medium">{stat.title}</div>
              <div className="text-4xl font-bold mt-1">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Registered Users</h3>
              <p className="text-white/80 text-sm">Click on a user to view their prediction history</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Address</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Login
                </th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Predictions</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => {
                const userPreds = userDiagnostics[u.id]?.length || 0;
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {u.address || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                        userPreds > 0
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {userPreds}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors inline-block group-hover:translate-x-1 transform" />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">All Predictions</h3>
              <p className="text-white/80 text-sm">Overview of all disease predictions</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {Object.entries(userDiagnostics).length === 0 ? (
            <p className="text-gray-500 text-center py-12">No predictions recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(userDiagnostics).map(([uid, diags], groupIndex) => {
                const userInfo = users.find(u => u.id == uid);
                return (
                  <motion.div
                    key={uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.05 }}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {userInfo?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{userInfo?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {userInfo?.email || ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">{diags.length} predictions</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {diags.map((d, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all"
                        >
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 mb-2">
                              {d.disease}
                            </span>
                            <div className="text-sm text-gray-600">{d.symptoms}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-700">{d.accuracy}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(d.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
