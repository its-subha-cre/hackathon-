import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DocumentProcessingModal } from '../documents/DocumentProcessingModal';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Search,
  Network,
  FileCheck2,
  BarChart3,
  Settings,
  Bell,
  HardDrive,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [systemMode, setSystemMode] = useState({ demo_mode: false });
  const [storage, setStorage] = useState({ formatted_used: '0 B', formatted_limit: '500 GB', percentage: 0 });
  const [uploading, setUploading] = useState(false);

  // Real-Time Processing Modal State
  const [activeProcessingDocId, setActiveProcessingDocId] = useState<string | null>(null);

  const [neo4jStatus, setNeo4jStatus] = useState<{
    connected: boolean;
    status: string;
    loading: boolean;
  }>({
    connected: false,
    status: 'checking',
    loading: true
  });

  const fetchSystemMode = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/system/mode');
      const data = await res.json();
      setSystemMode(data);
    } catch (e) {
      setSystemMode({ demo_mode: false });
    }
  };

  const checkNeo4jHealth = async () => {
    setNeo4jStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('http://localhost:8000/api/v1/health/neo4j');
      const data = await res.json();
      setNeo4jStatus({
        connected: !!data.connected,
        status: data.status || (data.connected ? 'healthy' : 'unavailable'),
        loading: false
      });
    } catch (e) {
      setNeo4jStatus({ connected: false, status: 'unavailable', loading: false });
    }
  };

  const fetchStorageUsage = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:8000/api/v1/storage/usage', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStorage(data);
      }
    } catch (e) {}
  };

  const fetchNotifications = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:8000/api/v1/notifications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSystemMode();
    checkNeo4jHealth();
    fetchStorageUsage();
    fetchNotifications();

    const interval = setInterval(() => {
      checkNeo4jHealth();
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // NATIVE OPERATING SYSTEM FILE PICKER UPLOAD HANDLER
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF document (.pdf).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        if (result.document_id) {
          setActiveProcessingDocId(result.document_id);
        }
      } else {
        const errData = await res.json().catch(() => ({ detail: 'Upload failed' }));
        alert(`Upload error: ${errData.detail}`);
      }
    } catch (err: any) {
      alert('Upload failed: Unable to connect to backend server.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProcessingModalComplete = () => {
    setActiveProcessingDocId(null);
    fetchStorageUsage();
    fetchNotifications();
    if (location.pathname === '/documents' || location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/documents');
    }
  };

  const markNotificationAsRead = async (id: string) => {
    if (!user?.token) return;
    try {
      await fetch(`http://localhost:8000/api/v1/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const allNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Knowledge Graph', path: '/graph', icon: Network },
    { label: 'Policy Notes', path: '/policy-notes', icon: FileCheck2 },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Admin', path: '/admin', icon: Settings, adminOnly: true },
  ];

  const navItems = allNavItems.filter((item) => !item.adminOnly || user?.role === 'ADMIN');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* REAL-TIME DOCUMENT PROCESSING PIPELINE MODAL */}
      <DocumentProcessingModal
        documentId={activeProcessingDocId}
        onClose={() => setActiveProcessingDocId(null)}
        onComplete={handleProcessingModalComplete}
      />

      {/* HIDDEN NATIVE FILE INPUT FOR OS FILE BROWSER PICKER */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* LEFT NAVY SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl z-20 flex-shrink-0">
        <div>
          {/* LOGO & BRANDING */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wider text-white">K-FIN INTELLIGENCE</h1>
              <p className="text-[11px] text-slate-400 leading-tight">Kerala Finance Knowledge Platform</p>
            </div>
          </div>

          {/* NAV NAVIGATION LINKS */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SIDEBAR FOOTER */}
        <div className="p-4 space-y-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              🏛️
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{user?.department || 'Finance Department'}</p>
              <p className="text-[10px] text-slate-400">Government of Kerala</p>
            </div>
          </div>

          {/* STORAGE USAGE WIDGET */}
          <div className="space-y-1.5 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <HardDrive className="w-3 h-3 text-blue-400" /> Storage Usage
              </span>
              <span className="text-slate-200 font-bold">{storage.formatted_used} / {storage.formatted_limit}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.max(storage.percentage, 0)}%` }}></div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            © 2025 K-Fin Intelligence Platform
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP STICKY HEADER */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white flex-shrink-0 z-10">
          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, orders, clauses, topics..."
              className="w-full bg-slate-800 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </form>

          {/* UTILITIES & REAL NOTIFICATIONS & USER PROFILE */}
          <div className="flex items-center space-x-4">
            {/* REAL NEO4J INFRASTRUCTURE HEALTH BADGE */}
            <div
              onClick={checkNeo4jHealth}
              title="Click to re-check Neo4j connectivity health"
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                neo4jStatus.loading
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                  : neo4jStatus.connected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : neo4jStatus.status === 'not_configured'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                  : 'bg-red-950/40 text-red-300 border-red-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  neo4jStatus.loading
                    ? 'bg-amber-400 animate-spin'
                    : neo4jStatus.connected
                    ? 'bg-emerald-400'
                    : 'bg-red-400'
                }`}
              ></span>
              <span>
                {neo4jStatus.loading
                  ? 'Neo4j Checking...'
                  : neo4jStatus.connected
                  ? 'Neo4j Connected'
                  : neo4jStatus.status === 'not_configured'
                  ? 'Neo4j Not Configured'
                  : 'Neo4j Offline'}
              </span>
            </div>

            {/* BELL NOTIFICATION BUTTON & DROPDOWN PANEL */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                )}
              </button>

              {/* NOTIFICATION PANEL DROPDOWN */}
              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs text-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-400" /> Notifications
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                      No new notifications.
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                              : 'bg-slate-800/90 border-blue-800/80 text-slate-100 shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-blue-400">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-slate-500 block mt-1">{n.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-800"></div>

            {/* USER PROFILE */}
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-3 cursor-pointer p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow">
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'U'}
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-slate-100">{user?.name || 'Standard User'}</p>
                  <p className="text-slate-400">{user?.department || 'Finance Dept.'} • <span className="text-blue-400 font-extrabold">{user?.role || 'USER'}</span></p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-2 z-50 text-xs">
                  <div className="p-2 border-b border-slate-800">
                    <p className="font-bold text-white">{user?.name}</p>
                    <p className="text-slate-400 text-[10px]">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left p-2 text-red-400 hover:bg-slate-800 rounded-lg font-semibold flex items-center space-x-2 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/60">
          {children}
        </main>
      </div>
    </div>
  );
};
