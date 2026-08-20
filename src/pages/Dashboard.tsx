import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DocumentProcessingModal } from '../components/documents/DocumentProcessingModal';
import {
  FileText,
  Upload,
  MessageSquare,
  FileCheck2,
  Network,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  HardDrive
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [quickQuestion, setQuickQuestion] = useState<string>('');

  // Real-Time Processing Modal State
  const [activeProcessingDocId, setActiveProcessingDocId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/analytics/dashboard', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Failed to fetch system dashboard analytics');
      }
    } catch (err) {
      setError('Unable to connect to K-FIN API Gateway');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file (.pdf).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token || ''}` },
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
    } catch (err) {
      alert('Unable to upload document to backend.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProcessingComplete = () => {
    setActiveProcessingDocId(null);
    fetchDashboardData();
  };

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      navigate(`/chat?q=${encodeURIComponent(quickQuestion)}`);
    }
  };

  if (loading && !stats) {
    return (
      <div className="h-96 flex items-center justify-center space-x-3 text-slate-600">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="font-bold text-sm">Loading dynamic dashboard analytics...</span>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <div>
          <h3 className="text-base font-extrabold text-slate-900">API Gateway Error</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
        >
          Retry Request
        </button>
      </div>
    );
  }

  const totalDocs = stats?.total_documents || 0;
  const storageFormatted = stats?.used_storage_bytes
    ? stats.used_storage_bytes >= 1024**2
      ? `${(stats.used_storage_bytes / (1024**2)).toFixed(1)} MB`
      : `${(stats.used_storage_bytes / 1024).toFixed(1)} KB`
    : '0 B';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* REAL-TIME DOCUMENT PROCESSING PIPELINE MODAL */}
      <DocumentProcessingModal
        documentId={activeProcessingDocId}
        onClose={() => setActiveProcessingDocId(null)}
        onComplete={handleProcessingComplete}
      />

      {/* HIDDEN NATIVE FILE INPUT FOR BROWSER PDF SELECTION */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* HERO WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300">
            <span>Finance Department • Government of Kerala</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Kerala Finance Knowledge Intelligence Platform
          </h1>
          <p className="text-sm text-slate-300">
            Real-Time GraphRAG Analytics • Official Finance Orders • Policy Notes Generation
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-900/50 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {uploading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Upload className="w-5 h-5 text-white" />
            )}
            <span>{uploading ? 'Uploading...' : '+ Upload Document'}</span>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-extrabold text-sm rounded-2xl text-slate-200 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Documents</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.total_documents || 0}</p>
          <p className="text-[11px] text-slate-500 font-semibold">
            {stats?.government_orders || 0} GOs • {stats?.circulars || 0} Circulars
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Policy Ratio</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.active_percentage || 0}%</p>
          <p className="text-[11px] text-emerald-600 font-bold">✓ Active non-superseded rules</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Clauses Extracted</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.clauses_extracted || 0}</p>
          <p className="text-[11px] text-slate-500 font-semibold">Indexed in Vector Database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Storage Usage</span>
            <HardDrive className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{storageFormatted}</p>
          <p className="text-[11px] text-slate-500 font-semibold">500 GB Total Capacity</p>
        </div>
      </div>

      {/* SEARCH AND QUICK ASK BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" /> Grounded Search & AI Assistant
        </h2>

        <form onSubmit={handleQuickQuestionSubmit} className="flex gap-3">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="Ask a question (e.g. What is the GST reimbursement limit for Government Officers?)"
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Query AI</span>
          </button>
        </form>
      </div>

      {/* REAL DOCUMENT STORAGE STATE NOTICE */}
      {totalDocs === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">Knowledge Base Empty</h3>
            <p className="text-xs text-slate-500">
              No official documents are loaded. Upload your first PDF to generate knowledge graphs and enable AI assistance.
            </p>
          </div>
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition-all inline-flex items-center space-x-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Active System Documents ({totalDocs})
            </h3>
            <button
              onClick={() => navigate('/documents')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All Documents</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-emerald-600 font-extrabold">
            ✓ System active with {totalDocs} user-uploaded PDF documents indexed into knowledge base.
          </p>
        </div>
      )}
    </div>
  );
};
