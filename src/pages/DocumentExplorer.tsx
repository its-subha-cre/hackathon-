import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocumentProcessingModal } from '../components/documents/DocumentProcessingModal';
import {
  FileText,
  Layers,
  IndianRupee,
  Network,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Globe,
  Upload,
  RefreshCw,
  Trash2
} from 'lucide-react';

export const DocumentExplorer: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Real-Time Processing Modal State
  const [activeProcessingDocId, setActiveProcessingDocId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/documents', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
        if (data.length > 0) {
          if (!selectedDoc || !data.some((d: any) => d.document_id === selectedDoc.document_id)) {
            setSelectedDoc(data[0]);
          }
        } else {
          setSelectedDoc(null);
        }
      } else {
        setError(`Failed to fetch documents (${res.status})`);
      }
    } catch (err: any) {
      setError('Unable to connect to document service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files (.pdf) are supported.');
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
    fetchDocuments();
  };

  const handleDeleteDocument = async (docId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete document '${title}'? This will remove it from K-FIN knowledge base and Neo4j database.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token || ''}` }
      });
      if (res.ok) {
        setSelectedDoc(null);
        await fetchDocuments();
      } else {
        const errData = await res.json().catch(() => ({ detail: 'Failed to delete document' }));
        alert(`Delete error: ${errData.detail}`);
      }
    } catch (e) {
      alert('Unable to connect to backend server to delete document.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* REAL-TIME DOCUMENT PROCESSING PIPELINE MODAL */}
      <DocumentProcessingModal
        documentId={activeProcessingDocId}
        onClose={() => setActiveProcessingDocId(null)}
        onComplete={handleProcessingComplete}
      />

      {/* HIDDEN NATIVE FILE INPUT FOR PDF UPLOAD */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Document Repository Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real Live Kerala Finance Government Orders, Circulars, and Policy Notifications
          </p>
        </div>

        <button
          onClick={handleUploadButtonClick}
          disabled={uploading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-extrabold text-xs text-white rounded-xl shadow transition-all flex items-center space-x-2 cursor-pointer"
        >
          {uploading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Upload className="w-4 h-4 text-white" />
          )}
          <span>{uploading ? 'Uploading...' : '+ Upload Document'}</span>
        </button>
      </div>

      {loading && documents.length === 0 ? (
        <div className="h-64 flex items-center justify-center space-x-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-bold">Loading real document repository...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">No Documents Uploaded</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your knowledge base has no PDF documents. Use "+ Upload Document" to add official files.
            </p>
          </div>
          <button
            onClick={handleUploadButtonClick}
            disabled={uploading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer inline-flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT LIST OF DOCUMENTS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-2">
              Repository List ({documents.length})
            </h2>

            <div className="space-y-2">
              {documents.map((doc) => {
                const isSelected = selectedDoc?.document_id === doc.document_id;
                return (
                  <div
                    key={doc.document_id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-xs text-blue-700">{doc.document_number}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        ✓ {doc.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{doc.title}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-medium">
                      <span>{doc.formatted_size || 'PDF'}</span>
                      <span>{doc.issue_date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SELECTED DOCUMENT DETAILS */}
          {selectedDoc && (
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {selectedDoc.document_number}
                    </span>
                    <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {selectedDoc.document_type}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-2">{selectedDoc.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedDoc.subject}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                    Status: Processed & Indexed
                  </span>

                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteDocument(selectedDoc.document_id, selectedDoc.title)}
                      disabled={deleting}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Admin: Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* METADATA GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">ISSUING AUTHORITY</span>
                  <span className="font-extrabold text-slate-900">{selectedDoc.issuing_authority}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">DEPARTMENT</span>
                  <span className="font-extrabold text-slate-900">{selectedDoc.department}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">ISSUE DATE</span>
                  <span className="font-extrabold text-slate-900">{selectedDoc.issue_date}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">FILE SIZE</span>
                  <span className="font-extrabold text-slate-900">{selectedDoc.formatted_size}</span>
                </div>
              </div>

              {/* SECTIONS & CLAUSES */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Document Sections & Clauses ({selectedDoc.sections?.length || 0})
                </h3>

                {selectedDoc.sections && selectedDoc.sections.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDoc.sections.map((sec: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-900">{sec.section_number}: {sec.title}</span>
                        </div>
                        {sec.clauses && sec.clauses.map((c: any, j: number) => (
                          <p key={j} className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-blue-600">Clause {c.clause_number}: </span>
                            {c.content}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                    PDF document uploaded and indexed into GraphRAG & vector database.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
