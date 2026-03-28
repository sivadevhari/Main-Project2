import React from 'react';
import Navbar from '../components/Navbar';
import HistoryTable from '../components/HistoryTable';

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <HistoryTable />
      </div>
    </div>
  );
}
