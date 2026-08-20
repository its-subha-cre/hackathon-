import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AIChat } from './pages/AIChat';
import { DocumentExplorer } from './pages/DocumentExplorer';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { PolicyNotes } from './pages/PolicyNotes';
import { AnalyticsEvaluation } from './pages/AnalyticsEvaluation';
import { AdminSettings } from './pages/AdminSettings';
import { RefreshCw, ShieldCheck } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg border border-blue-400 mx-auto">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
          <p className="font-bold text-xs text-slate-300">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentExplorer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <DocumentExplorer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/graph"
        element={
          <ProtectedRoute>
            <KnowledgeGraph />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policy-notes"
        element={
          <ProtectedRoute>
            <PolicyNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsEvaluation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute adminOnly>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
