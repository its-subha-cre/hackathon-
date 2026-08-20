import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, ShieldCheck, Cpu, Lock, Save, RefreshCw, CheckCircle2, XCircle, Check, AlertTriangle, X } from 'lucide-react';

const PROVIDER_MODELS: Record<string, { label: string; value: string }[]> = {
  groq: [
    { label: 'Llama 3.1 8B Instant (llama-3.1-8b-instant)', value: 'llama-3.1-8b-instant' },
    { label: 'Llama 3.3 70B Versatile (llama-3.3-70b-versatile)', value: 'llama-3.3-70b-versatile' },
    { label: 'Mixtral 8x7B (mixtral-8x7b-32768)', value: 'mixtral-8x7b-32768' }
  ],
  gemini: [
    { label: 'Gemini 2.5 Flash (gemini-2.5-flash)', value: 'gemini-2.5-flash' },
    { label: 'Gemini 2.5 Pro (gemini-2.5-pro)', value: 'gemini-2.5-pro' },
    { label: 'Gemini 1.5 Flash (gemini-1.5-flash)', value: 'gemini-1.5-flash' }
  ],
  openai: [
    { label: 'GPT-4o (gpt-4o)', value: 'gpt-4o' },
    { label: 'GPT-4o Mini (gpt-4o-mini)', value: 'gpt-4o-mini' },
    { label: 'GPT-3.5 Turbo (gpt-3.5-turbo)', value: 'gpt-3.5-turbo' }
  ],
  azure: [
    { label: 'Azure GPT-4o Deployment', value: 'azure-gpt-4o' },
    { label: 'Azure GPT-35-Turbo Deployment', value: 'azure-gpt-35-turbo' }
  ]
};

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();

  const [provider, setProvider] = useState('groq');
  const [model, setModel] = useState('llama-3.1-8b-instant');
  const [apiKey, setApiKey] = useState('');
  
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  // Popup Modal States
  const [verifyModal, setVerifyModal] = useState<{ open: boolean; success: boolean; message: string; providerName: string; modelName: string } | null>(null);
  const [saveModal, setSaveModal] = useState<{ open: boolean; success: boolean; message: string } | null>(null);

  const [healthServices, setHealthServices] = useState<Record<string, string>>({
    api_gateway: 'ONLINE',
    neo4j_graph: 'OFFLINE',
    postgresql: 'OFFLINE',
    redis_cache: 'OFFLINE',
    minio_s3: 'OFFLINE',
    poc_auth: 'ONLINE'
  });
  const [healthLoading, setHealthLoading] = useState<boolean>(true);

  const fetchHealthMatrix = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/health');
      if (res.ok) {
        const data = await res.json();
        setHealthServices(data.services || {});
      }
    } catch (e) {
      setHealthServices({
        api_gateway: 'ONLINE',
        neo4j_graph: 'OFFLINE',
        postgresql: 'OFFLINE',
        redis_cache: 'OFFLINE',
        minio_s3: 'OFFLINE',
        poc_auth: 'ONLINE'
      });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthMatrix();
    const interval = setInterval(fetchHealthMatrix, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const modelsForProvider = PROVIDER_MODELS[newProvider] || [];
    if (modelsForProvider.length > 0) {
      setModel(modelsForProvider[0].value);
    }
  };

  // ACTION BUTTON 1: CHECK CONFIGURATION
  const handleCheckConfiguration = async () => {
    setVerifying(true);
    setVerifyModal(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/ai-config/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({ provider, model, api_key: apiKey })
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setVerifyModal({
          open: true,
          success: true,
          providerName: data.provider || provider,
          modelName: data.model || model,
          message: data.message || 'API key and model configuration are working correctly.'
        });
      } else {
        setVerifyModal({
          open: true,
          success: false,
          providerName: provider,
          modelName: model,
          message: data.detail || 'Unable to verify the selected provider, API key, and model.'
        });
      }
    } catch (err: any) {
      setVerifyModal({
        open: true,
        success: false,
        providerName: provider,
        modelName: model,
        message: 'Unable to connect to backend server for configuration check.'
      });
    } finally {
      setVerifying(false);
    }
  };

  // ACTION BUTTON 2: SAVE CONFIGURATION
  const handleSaveConfiguration = async () => {
    if (!apiKey.trim()) {
      setSaveModal({
        open: true,
        success: false,
        message: 'Cannot save configuration: Please enter a valid API key in the input box before saving.'
      });
      return;
    }

    setSaving(true);
    setSaveModal(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/ai-config/web-app-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({ provider, model, api_key: apiKey })
      });

      const data = await res.json();

      if (res.ok) {
        setSaveModal({
          open: true,
          success: true,
          message: data.message || 'AI configuration has been saved successfully to environment configuration.'
        });
      } else {
        setSaveModal({
          open: true,
          success: false,
          message: data.detail || 'Failed to save configuration.'
        });
      }
    } catch (err: any) {
      setSaveModal({
        open: true,
        success: false,
        message: 'Unable to connect to backend server for saving configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  const availableModels = PROVIDER_MODELS[provider] || PROVIDER_MODELS['groq'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> Admin & System Security Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Local POC RBAC Management • Infrastructure Health Monitor • Multi-Model AI Wizard
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> Role: ADMIN
        </div>
      </div>

      {/* MULTI-MODEL AI ARCHITECTURE WIZARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" /> Multi-Model AI Wizard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Web-App LLM while preserving fixed system services for Translation & Embeddings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: WEB-APP LLM (EDITABLE) */}
          <div className="p-5 bg-blue-50/40 rounded-2xl border-2 border-blue-500/80 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                1. Web-App / Chat LLM
              </span>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                CONFIGURABLE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                >
                  <option value="groq">Groq</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="azure">Azure OpenAI</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                >
                  {availableModels.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Provider API Key (gsk_..., AIza..., sk-...)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckConfiguration}
                  disabled={verifying}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg shadow transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  {verifying ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>Check Configuration</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfiguration}
                  disabled={saving}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: TRANSLATION AGENT (FIXED READ-ONLY) */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                2. Translation Agent
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> READ-ONLY
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">PROVIDER</span>
                <span className="font-extrabold text-slate-900">Groq</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">PERMANENT MODEL</span>
                <span className="font-extrabold text-slate-900">llama-3.1-8b-instant</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">CREDENTIAL ISOLATION</span>
                <span className="font-semibold text-emerald-600">TRANSLATION_GROQ_API_KEY</span>
              </div>
            </div>
          </div>

          {/* CARD 3: EMBEDDING ENGINE (FIXED READ-ONLY) */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                3. Embedding Engine
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> READ-ONLY
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">PROVIDER</span>
                <span className="font-extrabold text-slate-900">Google Gemini</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">EMBEDDING MODEL</span>
                <span className="font-extrabold text-slate-900">text-embedding-004 (768-dim)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">CREDENTIAL ISOLATION</span>
                <span className="font-semibold text-emerald-600">EMBEDDING_GEMINI_API_KEY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM INFRASTRUCTURE HEALTH MATRIX */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-sm font-extrabold text-slate-900">
            Infrastructure Services Health Matrix
          </h3>
          <button
            onClick={fetchHealthMatrix}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Health</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          {[
            { key: 'api_gateway', name: 'API Gateway' },
            { key: 'neo4j_graph', name: 'Neo4j Graph' },
            { key: 'postgresql', name: 'PostgreSQL' },
            { key: 'redis_cache', name: 'Redis Cache' },
            { key: 'minio_s3', name: 'MinIO S3' },
            { key: 'poc_auth', name: 'POC Local Auth' }
          ].map((svc) => {
            const rawStatus = (healthServices[svc.key] || 'OFFLINE').toUpperCase();
            const isOnline = rawStatus === 'ONLINE' || rawStatus === 'CONNECTED' || rawStatus === 'HEALTHY';
            const isNotConfigured = rawStatus === 'NOT_CONFIGURED';

            return (
              <div key={svc.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="font-bold text-slate-700 block">{svc.name}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isOnline
                      ? 'text-emerald-700 bg-emerald-100'
                      : isNotConfigured
                      ? 'text-amber-700 bg-amber-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {isOnline ? '✓ ONLINE' : isNotConfigured ? '! NOT CONFIG' : '✕ OFFLINE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFY RESULT POPUP MODAL */}
      {verifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white text-left">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    verifyModal.success
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                      : 'bg-red-950/60 border-red-800/80 text-red-400'
                  }`}
                >
                  {verifyModal.success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {verifyModal.success ? '✓ AI Configuration Verified' : '✕ Verification Failed'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Provider: <span className="font-bold text-slate-200">{verifyModal.providerName}</span> • Model:{' '}
                    <span className="font-mono text-slate-300">{verifyModal.modelName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVerifyModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {verifyModal.message}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setVerifyModal(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE CONFIRMATION / ERROR POPUP MODAL */}
      {saveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white text-left">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    saveModal.success
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                      : 'bg-red-950/60 border-red-800/80 text-red-400'
                  }`}
                >
                  {saveModal.success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {saveModal.success ? '✓ Configuration Saved' : '✕ Save Failed'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {saveModal.success ? 'Environment configuration updated' : 'Validation Error'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSaveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {saveModal.message}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSaveModal(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
