// API utility for backend integration
// Use proxy path for development - Vite will forward to backend
const API_BASE = '/api';

export async function getSession() {
  const res = await fetch(`${API_BASE}/session`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function signup(name, address, email, password) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ name, address, email, password })
  });
  return res.json();
}

export async function predict(symptoms) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ symptoms })
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to load history' }));
    throw new Error(error.message || 'Failed to load history');
  }
  return res.json();
}

export async function getAdminPanel() {
  const res = await fetch(`${API_BASE}/admin_panel`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });
  return res.json();
}

export async function logout() {
  await fetch(`${API_BASE}/logout_confirm`, {
    credentials: 'include'
  });
}

export async function downloadReport(data) {
  const res = await fetch(`${API_BASE}/download_report`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    throw new Error('Download failed');
  }
  
  // Create blob and download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `diagnosis_report_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
