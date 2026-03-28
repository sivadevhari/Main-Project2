import React from 'react';
import Navbar from '../components/Navbar';
import PredictForm from '../components/PredictForm';

export default function Predict() {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <PredictForm />
      </div>
    </div>
  );
}
