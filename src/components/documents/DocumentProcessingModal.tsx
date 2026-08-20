import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  X
} from 'lucide-react';

interface DocumentProcessingModalProps {
  documentId: string | null;
  onClose: () => void;
  onComplete: () => void;
}

export const DocumentProcessingModal: React.FC<DocumentProcessingModalProps> = ({
  documentId,
  onClose,
  onComplete
}) => {
  const { user } = useAuth();
  const [jobState, setJobState] = useState<any>(null);

  useEffect(() => {
    if (!documentId || !user?.token) return;

    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/documents/${documentId}/processing-status`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setJobState(data);
          }
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            clearInterval(intervalId);
          }
        }
      } catch (e) {}
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [documentId, user]);

  if (!documentId) return null;

  const isCompleted = jobState?.status === 'COMPLETED';
  const isFailed = jobState?.status === 'FAILED';
  const stages = jobState?.stages || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[85vh] p-6 flex flex-col shadow-2xl text-white text-left space-y-4">
        {/* MODAL HEADER (FIXED TOP) */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide text-white">Processing Document</h2>
              <p className="text-xs text-slate-400 font-semibold truncate max-w-xs">{jobState?.filename || 'PDF Document'}</p>
            </div>
          </div>

          {(isCompleted || isFailed) && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STATUS BANNER (FIXED) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 flex-shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : isFailed ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-extrabold text-slate-200">
              {isCompleted
                ? 'Document Processing Complete'
                : isFailed
                ? 'Document Processing Failed'
                : jobState?.message || 'Processing document and building knowledge base...'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Document ID: <span className="font-mono text-slate-300">{documentId}</span>
            </p>
          </div>
        </div>

        {/* PIPELINE STAGES SCROLLABLE CONTAINER */}
        <div className="flex-1 overflow-y-auto max-h-[40vh] pr-1 space-y-2 my-1">
          {stages.map((stage: any, idx: number) => {
            const isStageDone = stage.status === 'COMPLETED';
            const isStageActive = stage.status === 'IN_PROGRESS';
            const isStageFailed = stage.status === 'FAILED';

            return (
              <div
                key={stage.id || idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  isStageDone
                    ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                    : isStageActive
                    ? 'bg-blue-950/50 border-blue-600/80 text-white shadow-md'
                    : isStageFailed
                    ? 'bg-red-950/40 border-red-800 text-red-200'
                    : 'bg-slate-950/20 border-slate-800/50 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2.5 text-xs">
                  {isStageDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isStageActive ? (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                  ) : isStageFailed ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`font-bold ${isStageActive ? 'text-blue-300' : ''}`}>{stage.name}</span>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isStageDone
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : isStageActive
                      ? 'bg-blue-600 text-white animate-pulse'
                      : isStageFailed
                      ? 'bg-red-950/60 text-red-300 border border-red-800/60'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isStageDone
                    ? 'Completed'
                    : isStageActive
                    ? 'Processing...'
                    : isStageFailed
                    ? 'Failed'
                    : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* METRICS SUMMARY (FIXED) */}
        {jobState?.metrics && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs flex-shrink-0">
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold block">PAGES</span>
              <span className="font-extrabold text-slate-200">{jobState.metrics.page_count}</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold block">CLAUSES</span>
              <span className="font-extrabold text-slate-200">{jobState.metrics.clauses_count}</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] font-bold block">GRAPH NODES</span>
              <span className="font-extrabold text-slate-200">{jobState.metrics.nodes_created}</span>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR (ALWAYS VISIBLE & PINNED AT BOTTOM) */}
        <div className="pt-3 border-t border-slate-800 flex justify-end flex-shrink-0">
          {isCompleted ? (
            <button
              onClick={onComplete}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-extrabold text-xs text-white rounded-xl shadow-lg shadow-blue-900/50 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isFailed ? (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white rounded-xl shadow cursor-pointer"
            >
              Close
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 flex items-center space-x-2 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Document processing in progress...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
