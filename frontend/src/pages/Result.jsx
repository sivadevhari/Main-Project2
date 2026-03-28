import React from 'react';
import Navbar from '../components/Navbar';
import ResultCard from '../components/ResultCard';

export default function Result() {
  return (
    <div className="min-h-screen pb-12" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <ResultCard />
      </div>
    </div>
  );
}
