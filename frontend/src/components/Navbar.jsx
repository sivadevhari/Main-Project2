import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { logout } from '../lib/api';

export default function Navbar() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    authLogout();
    navigate('/logout_confirm');
  };

  return (
    <nav className="px-8 py-4 flex justify-between items-center shadow-lg" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <Link to="/" className="text-[#0984e3] font-bold text-xl no-underline hover:opacity-80 transition-opacity">
        Disease Predictor
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-[#2d3436] font-medium no-underline hover:text-[#0984e3] transition-colors">Home</Link>
        <Link to="/predict" className="text-[#2d3436] font-medium no-underline hover:text-[#0984e3] transition-colors">Predict</Link>
        {user ? (
          <>
            <Link to="/history" className="text-[#2d3436] font-medium no-underline hover:text-[#0984e3] transition-colors">History</Link>
            {user.is_admin && (
              <Link 
                to="/admin" 
                className="inline-block px-5 py-2 rounded-[20px] text-white font-medium no-underline transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)]"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                🛡️ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-[20px] text-white font-medium no-underline transition-all duration-300 hover:scale-[1.05] hover:bg-[#0770c9]"
              style={{
                background: '#0984e3',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[#2d3436] font-medium no-underline hover:text-[#0984e3] transition-colors">Login</Link>
            <Link to="/signup" className="text-[#2d3436] font-medium no-underline hover:text-[#0984e3] transition-colors">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
