import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, FileText, BarChart3, Users, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, doctorSettings, setIsAuthenticated } = useApp();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Doctor Interface', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        } border-b shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Clinic Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg p-2">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {doctorSettings.clinicName}
                  </h1>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {doctorSettings.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 -mb-px">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? isDarkMode
                        ? 'border-cyan-500 text-cyan-400'
                        : 'border-cyan-600 text-cyan-700'
                      : isDarkMode
                      ? 'border-transparent text-slate-400 hover:text-slate-300'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
