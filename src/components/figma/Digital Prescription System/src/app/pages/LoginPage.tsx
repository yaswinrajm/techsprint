import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Activity } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl mb-4 shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MediScript</h1>
          <p className="text-slate-600">Digital Prescription System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Demo: Use any email and password to login
          </p>
        </div>
      </div>
    </div>
  );
};
