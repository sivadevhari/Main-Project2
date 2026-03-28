import React from 'react';
import Navbar from '../components/Navbar';
import AdminPanelContent from '../components/AdminPanelContent';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <AdminPanelContent />
      </div>
    </div>
  );
}
