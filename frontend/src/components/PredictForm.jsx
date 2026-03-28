import React, { useState } from 'react';
import { predict } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function PredictForm() {
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await predict(symptoms);
      if (res.success) {
        navigate('/result', { state: { result: res, symptoms } });
      } else {
        setError(res.message || 'Prediction failed');
      }
    } catch (err) {
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-[24px] p-12 max-w-[600px] w-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1" style={{
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 className="text-4xl font-bold text-center mb-2" style={{ color: '#2d3436', letterSpacing: '-0.5px' }}>
          INTELLIGENT DISEASE
        </h1>
        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#2d3436' }}>
          PREDICTION SYSTEM
        </h2>
        <p className="text-center text-[#636e72] text-sm mb-8 font-medium">
          Enter your symptoms below. Our intelligent system will analyze the patterns to provide a preliminary assessment.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-left">
            <label className="block mb-2 font-semibold" style={{ color: '#2d3436' }}>
              Describe how you feel
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. high fever, joint pain, skin rash"
              required
              className="w-full px-5 py-3 rounded-xl text-base outline-none transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid lightgray',
                color: '#2d3436'
              }}
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              border: 'none',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0, 210, 255, 0.5)'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs opacity-70" style={{ color: '#2d3436' }}>
          * This is for informational purposes and not a medical diagnosis.
        </div>
      </div>
    </div>
  );
}
