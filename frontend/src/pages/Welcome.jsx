import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/auth';

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            INTELLIGENT DISEASE<br />PREDICTION SYSTEM
          </h1>
          <p className="text-xl mb-10 opacity-90">
            This platform helps you predict diseases based on your symptoms using advanced machine learning. 
            Get instant insights and recommended precautions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <>
                <Link 
                  to="/predict" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 no-underline"
                >
                  Predict Disease
                </Link>
                <Link 
                  to="/history" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 no-underline"
                >
                  View History
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 no-underline"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-transparent text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 no-underline"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
