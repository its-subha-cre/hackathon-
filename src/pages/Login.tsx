import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, UserCheck, ArrowLeft, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSelectRole = (role: 'ADMIN' | 'USER') => {
    setSelectedRole(role);
    setUsername(role === 'ADMIN' ? 'admin' : 'user');
    setPassword(role === 'ADMIN' ? 'admin' : 'user');
    setErrorMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login(selectedRole, username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials for selected role.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3 text-slate-300">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="font-bold text-sm">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-white text-center">
        {/* LOGO & SEAL */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg border border-blue-400">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-wider">K-FIN INTELLIGENCE</h1>
          <p className="text-xs text-slate-400 mt-1">Kerala Finance Knowledge Intelligence Platform</p>
          <p className="text-[11px] text-blue-400 font-semibold mt-0.5">Finance Department • Government of Kerala</p>
        </div>

        {/* ROLE SELECTION SCREEN (SCREEN 1) */}
        {selectedRole === null ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choose how you want to continue
            </p>

            <div className="space-y-3">
              {/* ADMIN ROLE SELECTION CARD */}
              <button
                onClick={() => handleSelectRole('ADMIN')}
                className="w-full p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500 rounded-2xl text-left flex items-center space-x-4 transition-all group cursor-pointer shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                      Continue as Admin
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Administrative access & system configuration
                  </p>
                </div>
              </button>

              {/* USER ROLE SELECTION CARD */}
              <button
                onClick={() => handleSelectRole('USER')}
                className="w-full p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500 rounded-2xl text-left flex items-center space-x-4 transition-all group cursor-pointer shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                      Continue as User
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Knowledge intelligence & chatbot access
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN FORM SCREEN (SCREEN 2 / SCREEN 3) */
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                {selectedRole === 'ADMIN' ? 'Admin Sign In' : 'User Sign In'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start space-x-2 text-red-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-extrabold text-xs text-white rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-900 space-y-0.5">
          <p className="font-bold text-slate-200">Secure Government Access</p>
          <p className="text-[10px] text-slate-500">Enterprise authentication • Role-based access control</p>
        </div>
      </div>
    </div>
  );
};
