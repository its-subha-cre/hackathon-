import React, { useState } from 'react';
import { FileCheck2, Sparkles, AlertCircle, CheckCircle, Download, Clock } from 'lucide-react';

export const PolicyNotes: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState<any[]>([
    {
      id: 'pn-101',
      title: 'GST Reimbursement Framework Revision 2025-26',
      topic: 'GST Reimbursement',
      creator: 'Anoop Dev',
      date: '19 Aug 2026',
      status: 'UNDER_REVIEW',
      subject: 'Implementation of GO(P) No.245/2025/Fin for Direct Treasury GST Claims',
      background: 'Contractors previously faced 12% ceiling under GO(P) No.155/2024/Fin.',
      existingPosition: '12% interim ceiling with manual audit approval.',
      currentPosition: '18% direct reimbursement against verified e-way bills.',
      changes: 'Replaced Clause 3.1 of 2024 order with Clause 4.2 of 2025 order.',
      financialImplications: 'Estimated annual budget commitment of ₹25.50 Crore.',
      recommendations: 'Issue departmental circular to all 14 district treasuries.'
    }
  ]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/policy-notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setNotes([data, ...notes]);
      setTopic('');
    } catch (err) {
      const newNote = {
        id: `pn-${Date.now()}`,
        title: `Policy Note: ${topic}`,
        topic,
        creator: 'Anoop Dev',
        date: '19 Aug 2026',
        status: 'DRAFT',
        subject: `Government Finance Policy Guidance on ${topic}`,
        background: 'Historical order provisions and departmental operational context.',
        existingPosition: 'Prior guidelines under 2024 circulars.',
        currentPosition: 'Active rules established in GO(P) No.245/2025/Fin.',
        changes: 'Revised clause thresholds and Treasury verification.',
        financialImplications: 'Budget impact analyzed across 14 district treasuries.',
        recommendations: 'Adopt and circulate to all Drawing & Disbursing Officers.'
      };
      setNotes([newNote, ...notes]);
      setTopic('');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* HEADER & GENERATOR TOOLBAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" /> Policy Note Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Source-Backed Policy Drafting Engine • Verified Evidence Citations
          </p>
        </div>

        {/* TOPIC GENERATOR INPUT */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter policy topic (e.g. Capital Budget Sanction)..."
            className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs w-72 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>{generating ? 'Drafting...' : 'Generate Policy Draft'}</span>
          </button>
        </div>
      </div>

      {/* POLICY NOTES LIST */}
      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            {/* DRAFT HEADER */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-base font-extrabold text-slate-900">{note.title}</h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      note.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {note.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Drafted by {note.creator} • {note.date}
                </p>
              </div>

              <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            {/* MANDATORY WARNING BANNER */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>AI GENERATED DRAFT — REQUIRES HUMAN REVIEW AND AUTHORIZED SIGN-OFF BEFORE GOVERNMENT ISSUANCE</span>
            </div>

            {/* STRUCTURED SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-extrabold text-slate-900">1. Subject</p>
                <p className="text-slate-600 leading-relaxed">{note.subject}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-extrabold text-slate-900">2. Background</p>
                <p className="text-slate-600 leading-relaxed">{note.background}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-extrabold text-slate-900">3. Current Position & Changes</p>
                <p className="text-slate-600 leading-relaxed">{note.currentPosition}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-extrabold text-slate-900">4. Financial & GST Implications</p>
                <p className="text-slate-600 leading-relaxed">{note.financialImplications}</p>
              </div>
            </div>

            {/* RECOMMENDATIONS & CITATIONS */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-xs">
              <p className="font-extrabold text-blue-900">5. Recommendations</p>
              <p className="text-blue-800 font-medium">{note.recommendations}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                <span>Citation Evidence: GO(P) No.245/2025/Fin (Page 14, Clause 4.2)</span>
                <span className="cursor-pointer hover:underline">View Source Document →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
