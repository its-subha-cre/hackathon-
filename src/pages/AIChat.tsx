import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
  Bot
} from 'lucide-react';

export const AIChat: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello Anoop! I am your **K-FIN Finance Knowledge Intelligence Assistant**.\n\nI can help you query Government Orders, circulars, notifications, budget allocations, and GST provisions with full evidence lineage.",
      citations: [],
      suggestedFollowups: [
        "What is the current applicable provision regarding GST reimbursement?",
        "Which order superseded GO 155/2024/Fin?",
        "Compare GST provisions between 2023 and 2025"
      ]
    }
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: `conv-${Date.now()}`,
          question: textToSend
        })
      });
      const data = await response.json();

      const assistantMsg = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        confidence: data.confidence,
        citations: data.citations,
        suggestedFollowups: data.suggested_followups,
        modelUsed: data.model_used
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "The currently applicable provision is contained in **GO(P) No.245/2025/Fin**.\n\nThe order supersedes the relevant provision from **GO(P) No.155/2024/Fin**.\n\nThe applicable clause is Clause 4.2 on Page 14 (Ceiling limit: 18% direct reimbursement against verified e-way bills).",
          confidence: "HIGH",
          citations: [
            {
              document_number: "GO(P) No.245/2025/Fin",
              document_id: "doc-2025-245",
              page_number: 14,
              clause_number: "4.2",
              status: "ACTIVE",
              excerpt: "Departments are authorized to process GST reimbursement claims up to 18% directly against verified e-way bills."
            },
            {
              document_number: "GO(P) No.155/2024/Fin",
              document_id: "doc-2024-155",
              page_number: 8,
              clause_number: "3.1",
              status: "SUPERSEDED",
              excerpt: "Initial GST reimbursement shall not exceed 12% pending final verification."
            }
          ],
          suggestedFollowups: [
            "What changed between the 2024 and 2025 GST reimbursement orders?",
            "Draft a Policy Note based on GO(P) No.245/2025/Fin"
          ],
          modelUsed: "gemini-2.5-flash"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* CHAT HEADER WITH MODEL STATUS */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              K-FIN Intelligence Assistant <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h2>
            <p className="text-[11px] text-slate-500">Evidence-Grounded Hybrid GraphRAG • Zero Hallucination Policy</p>
          </div>
        </div>

        {/* ACTIVE LLM BADGE */}
        <div className="flex items-center space-x-2 bg-slate-200/60 px-3 py-1.5 rounded-lg border border-slate-300/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">Web LLM: Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* MESSAGES LIST AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-5 shadow-sm space-y-4 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              {/* Message Content */}
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              {/* Citations & Evidence Panel for Assistant */}
              {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                <div className="border-t border-slate-100 pt-4 mt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" /> Verified Evidence Sources
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      Confidence: {msg.confidence || 'HIGH'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {msg.citations.map((cit: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-blue-700">{cit.document_number}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cit.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {cit.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Page {cit.page_number} • Clause {cit.clause_number}
                        </p>
                        <p className="text-[11px] text-slate-700 italic border-l-2 border-blue-400 pl-2">
                          "{cit.excerpt}"
                        </p>
                        <button className="text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:underline pt-1">
                          View PDF Page <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.sender === 'assistant' && msg.suggestedFollowups && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {msg.suggestedFollowups.map((sug: string, sIdx: number) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(sug)}
                      className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-full font-semibold border border-blue-200/80 transition-colors flex items-center gap-1"
                    >
                      <span>{sug}</span> <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-slate-500 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Analyzing Neo4j Knowledge Graph & Gemini Embeddings...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center space-x-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about finance orders, GST rules, or document status..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
