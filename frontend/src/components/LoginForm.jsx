import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { login } from '../lib/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, checkSession } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        // Set user in localStorage immediately
        localStorage.setItem('user', JSON.stringify(res.user));
        // Then verify session and update context
        await checkSession();
        navigate('/');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] w-full max-w-md relative" style={{
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      {error && <div className="mb-4 text-red-600 text-center bg-red-50 py-2 rounded-lg">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button type="button" onClick={() => navigate('/signup')} className="text-blue-600 hover:underline font-medium">
          Sign up
        </button>
      </p>
    </form>
  );
}
