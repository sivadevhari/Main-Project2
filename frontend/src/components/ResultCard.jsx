import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadReport } from '../lib/api';

export default function ResultCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const symptoms = location.state?.symptoms;

  const [downloading, setDownloading] = useState(false);

  if (!result) {
    return (
      <div className="text-center text-gray-700 mt-20">
        <p className="text-xl">No result to display.</p>
        <button
          onClick={() => navigate('/predict')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Prediction
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport({
        user_name: result.user_name || 'User',
        symptoms: symptoms || '',
        disease: result.disease,
        description: result.description,
        causes: result.causes,
        precautions: result.precautions,
        accuracy: result.accuracy
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Result Container */}
      <div className="rounded-[30px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        {/* Animated Header */}
        <div className="text-white text-center py-12 px-6 relative" style={{
          background: 'linear-gradient(-45deg, #4158D0, #C850C0, #FFCC70, #4158D0)',
          backgroundSize: '300% 300%',
          animation: 'gradientBG 12s ease infinite',
          borderBottom: '2px solid rgba(255,255,255,0.2)'
        }}>
          <p className="text-xs uppercase mb-4 font-semibold tracking-[3px] opacity-90">Analysis Complete</p>
          <h1 className="text-3xl font-bold mb-4">Predicted Condition</h1>
          <div className="inline-block px-10 py-3 rounded-[50px] font-bold text-2xl uppercase tracking-wide" style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
          }}>
            {result.disease}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Image & About */}
            <div className="lg:col-span-2">
              <div className="text-center mb-6">
                <img
                  src={`/images/${result.image || 'default.jpg'}`}
                  alt={result.disease}
                  className="w-full max-w-[400px] rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-4 border-white transition-transform duration-300 hover:scale-[1.02]"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              <div className="rounded-[24px] p-6 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
              }}>
                <h4 className="font-bold text-lg mb-4" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💡 About this Condition
                </h4>
                <p className="text-gray-600 leading-relaxed">{result.description}</p>
              </div>
            </div>

            {/* Right Column - Causes & Precautions */}
            <div className="lg:col-span-3 space-y-6">
              {/* Causes Card */}
              <div className="rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
              }}>
                <h4 className="font-bold text-lg mb-4" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔍 Common Causes
                </h4>
                <p className="text-gray-600 leading-relaxed mb-0">{result.causes}</p>
              </div>

              {/* Precautions Card */}
              <div className="rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
              }}>
                <div className="absolute left-0 top-0 h-full w-[5px]" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}></div>
                <h4 className="font-bold text-lg mb-4" style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🛡️ Recommended Precautions
                </h4>
                <p className="text-gray-600 leading-relaxed mb-0">{result.precautions}</p>
              </div>

              {/* Doctor Recommendation Card */}
              {result.doctor && (
                <div className="rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]" style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
                }}>
                  <div className="absolute left-0 top-0 h-full w-[5px]" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                  <h4 className="font-bold text-lg mb-4" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🩺 Recommended Doctor
                  </h4>
                  <div className="mb-3">
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {result.doctor}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{result.doctor_description}</p>
                </div>
              )}

              {/* Report Section */}
              <div className="rounded-[24px] p-8 mt-8 relative" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}>
                <div className="absolute left-0 top-0 h-full w-2 rounded-l-[24px]" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8 flex-wrap">
                  <button
                    onClick={() => navigate('/predict')}
                    className="flex-1 min-w-[200px] py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 hover:bg-[#e2e8f0] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
                    style={{
                      background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f6fe 100%)',
                      color: '#4a5568',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                      textDecoration: 'none'
                    }}
                  >
                    ← Back to Diagnosis
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex-1 min-w-[200px] py-4 px-6 rounded-xl font-bold text-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,114,255,0.3)]"
                    style={{
                      background: downloading ? '#ccc' : 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                      border: 'none',
                      boxShadow: downloading ? 'none' : '0 10px 20px rgba(0, 114, 255, 0.2)',
                      cursor: downloading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {downloading ? '⏳ Downloading...' : '📥 Download Report'}
                  </button>
                </div>

                {/* Report Title */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#edf2f7]">
                  <h3 className="text-xl font-bold" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '1px'
                  }}>
                    📋 MEDICAL ANALYSIS REPORT
                  </h3>
                </div>

                {/* Report Items */}
                <div className="space-y-4">
                  <div className="rounded-xl p-5 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:translate-x-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]" style={{
                    background: 'white',
                    border: '1px solid #f0f4f8'
                  }}>
                    <div className="text-xs font-bold text-[#718096] uppercase tracking-[1.5px] mb-2">👤 Patient Name</div>
                    <div className="text-base leading-relaxed font-medium" style={{ color: '#2d3436' }}>{result.user_name || 'N/A'}</div>
                  </div>

                  <div className="rounded-xl p-5 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:translate-x-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]" style={{
                    background: 'white',
                    border: '1px solid #f0f4f8'
                  }}>
                    <div className="text-xs font-bold text-[#718096] uppercase tracking-[1.5px] mb-2">🩹 Reported Symptoms</div>
                    <div className="text-base leading-relaxed font-medium" style={{ color: '#2d3436' }}>{symptoms || 'N/A'}</div>
                  </div>

                  <div className="rounded-xl p-5 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:translate-x-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]" style={{
                    background: 'white',
                    border: '1px solid #f0f4f8'
                  }}>
                    <div className="text-xs font-bold text-[#718096] uppercase tracking-[1.5px] mb-2">🔬 Predicted Disease</div>
                    <div className="text-xl leading-relaxed font-bold" style={{ color: '#2d3436' }}>{result.disease}</div>
                  </div>

                  <div className="rounded-xl p-5 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:translate-x-2 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]" style={{
                    background: 'white',
                    border: '1px solid #f0f4f8'
                  }}>
                    <div className="text-xs font-bold text-[#718096] uppercase tracking-[1.5px] mb-2">📊 Model Accuracy</div>
                    <div className="text-base leading-relaxed font-medium" style={{ color: '#2d3436' }}>{result.accuracy || 'N/A'}</div>
                  </div>
                </div>

                {/* Warning Box */}
                <div className="rounded-xl p-6 mt-6" style={{
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  boxShadow: '0 10px 25px rgba(246, 211, 101, 0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#854d0e'
                }}>
                  <div className="font-bold mb-3 text-base" style={{ color: '#713f12', letterSpacing: '0.5px' }}>
                    ⚠️ DISCLAIMER & MODEL ACCURACY
                  </div>
                  <p className="mb-2 text-sm font-medium" style={{ color: '#854d0e' }}>
                    This prediction is based on machine learning analysis and does NOT replace professional medical advice.
                  </p>
                  <p className="text-sm font-bold" style={{ color: '#854d0e' }}>
                    Please consult a qualified healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation for gradient */}
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
