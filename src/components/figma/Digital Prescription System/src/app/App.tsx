import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { PatientListPage } from './pages/PatientListPage';
import { SettingsPage } from './pages/SettingsPage';
import { Layout } from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
