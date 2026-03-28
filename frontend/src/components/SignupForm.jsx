import React, { useState } from 'react';
import { signup } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await signup(name, address, email, password);
      if (res.success) {
        setSuccess('Signup successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      {error && <div className="mb-4 text-red-600 text-center bg-red-50 py-2 rounded-lg">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-center bg-green-50 py-2 rounded-lg">{success}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Address</label>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          required 
          className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
        />
      </div>
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
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-medium">
          Login
        </button>
      </p>
    </form>
  );
}
