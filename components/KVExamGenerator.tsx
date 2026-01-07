
import React, { useState } from 'react';
import { School, Printer, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { generateJSONContent, ExamSchema } from '../services/geminiService';
import { SUBJECTS } from '../constants';
import { TestData } from '../types';

const KVExamGenerator: React.FC = () => {
  const [config, setConfig] = useState({ 
    grade: '12', 
    subject: 'Physics', 
    chapter: 'Electrostatics', 
    type: 'Periodic Test' 
  });
  
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewPaper, setViewPaper] = useState(false);

  const generate = async () => {
    setLoading(true);
    setViewPaper(false);
    
    const totalMarks = (config.type === 'Periodic Test') ? 40 : 80;
    const duration = (config.type === 'Periodic Test') ? '90 Minutes' : '3 Hours';

    const prompt = `Act as a senior Kendriya Vidyalaya (KV) PGT Faculty. Generate a formal Class ${config.grade} ${config.subject} question paper for the chapter: "${config.chapter}". 
    Assessment Type: ${config.type} (Max Marks: ${totalMarks}).
    Time Allowed: ${duration}.
    Structure:
    - Section A: MCQs (1 mark each).
    - Section B: Short Answer Type I (2 marks each).
    - Section C: Short Answer Type II (3 marks each).
    - Section D: Case Based Questions (CBQ) (4 marks each - include a formal Case passage).
    - Section E: Long Answer Type (5 marks each).
    
    IMPORTANT: Provide the content as a formal school paper. Use actual mathematical symbols: Δ, ρ, φ, θ, ×, ±, Σ, π, √, ∞, λ. 
    Use <sup> and <sub> tags. DO NOT use LaTeX codes.`;
    
    try {
      const data = await generateJSONContent(prompt, ExamSchema, 'gemini-3-pro-preview');
      data.totalMaxMarks = totalMarks;
      setTestData(data);
      setViewPaper(true);
    } catch (e) {
      console.error(e);
      alert("Exam generation failed. Please check your network or API key.");
    } finally {
      setLoading(false);
    }
  };

  if (viewPaper && testData) {
    return (
      <div className="animate-in fade-in duration-700 min-h-screen pb-20 print:p-0">
        <style>
          {`
            @media print {
              body { background-color: white !important; overflow: visible !important; }
              aside, button, .print-hide { display: none !important; }
              main { padding: 0 !important; margin: 0 !important; width: 100% !important; overflow: visible !important; }
              .paper-sheet { border: none !important; box-shadow: none !important; margin: 0 !important; padding: 1cm !important; width: 100% !important; }
            }
          `}
        </style>

        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center bg-[#121212] p-4 rounded-2xl border border-[#333] print-hide">
          <button 
            onClick={() => setViewPaper(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} /> Back to Setup
          </button>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-amber-600 text-black font-bold rounded-xl flex items-center gap-2 hover:bg-amber-500 transition-all shadow-xl"
          >
            <Printer size={18} /> Print Question Paper
          </button>
        </div>

        <div className="paper-sheet max-w-4xl mx-auto bg-white text-black p-12 md:p-16 shadow-2xl min-h-[1100px] font-serif overflow-hidden">
          <div className="text-center space-y-2 border-b-2 border-black pb-6 mb-8">
            <h1 className="text-2xl font-bold uppercase">KENDRIYA VIDYALAYA SANGATHAN</h1>
            <h2 className="text-xl font-semibold uppercase">{config.type} (2024-25)</h2>
            <div className="flex justify-between font-bold pt-4 text-sm">
              <span>CLASS: {config.grade}</span>
              <span>SUBJECT: {config.subject.toUpperCase()}</span>
            </div>
            <div className="flex justify-between font-bold text-sm">
              <span>TIME: {(config.type === 'Periodic Test') ? '1.5 HOURS' : '3 HOURS'}</span>
              <span>MAX MARKS: {testData.totalMaxMarks}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="font-bold underline mb-2 italic text-sm">General Instructions:</p>
            <ul className="text-[11px] list-disc pl-5 space-y-1 leading-tight">
              <li>All questions are compulsory. Internal choices may be provided within questions.</li>
              <li>Section A contains Multiple Choice Questions of 1 mark each.</li>
              <li>Section B contains Short Answer Type I questions of 2 marks each.</li>
              <li>Section C contains Short Answer Type II questions of 3 marks each.</li>
              <li>Section D contains Case Based Questions of 4 marks each.</li>
              <li>Section E contains Long Answer Type questions of 5 marks each.</li>
            </ul>
          </div>

          <div className="space-y-12">
            {testData.sections.map((section, si) => (
              <div key={si} className="space-y-6">
                <div className="text-center">
                  <span className="font-bold border-y border-black py-1 px-8 uppercase tracking-widest text-sm">{section.name}</span>
                </div>
                <div className="space-y-8">
                  {section.questions.map((q, qi) => (
                    <div key={q.id} className="relative">
                      <div className="flex gap-4">
                        <span className="font-bold min-w-[24px]">{qi + 1}.</span>
                        <div className="flex-1 space-y-4">
                          {q.caseText && (
                            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 text-sm italic leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: q.caseText }}></div>
                          )}
                          <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: q.text }}></div>
                          
                          {q.type === 'mcq' && q.options && (
                            <div className="grid grid-cols-2 gap-y-2 mt-4 text-[13px]">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex gap-2">
                                  <span className="font-bold">({String.fromCharCode(97 + oi)})</span>
                                  <span dangerouslySetInnerHTML={{ __html: opt }}></span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-sm whitespace-nowrap ml-4">[{q.marks || (si === 0 ? 1 : si === 1 ? 2 : si === 2 ? 3 : si === 3 ? 4 : 5)}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center border-t border-gray-300 pt-8 text-xs italic text-gray-400">
            --- END OF QUESTION PAPER ---
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="bg-[#121212] p-12 rounded-[3rem] border border-[#333] shadow-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="flex items-center gap-8 border-b border-[#222] pb-12">
          <div className="bg-amber-500 text-black p-6 rounded-[2.5rem] shadow-xl">
            <School size={48} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-3">KV Print Studio</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.5em] opacity-70">Create academic grade printable papers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Grade Level</label>
            <select 
              value={config.grade} 
              onChange={(e) => setConfig({...config, grade: e.target.value})}
              className="w-full p-6 bg-black border-2 border-[#222] rounded-[2rem] outline-none focus:border-amber-500 text-white font-black text-sm cursor-pointer"
            >
              <option value="11">CLASS 11</option>
              <option value="12">CLASS 12</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Subject</label>
            <select 
              value={config.subject} 
              onChange={(e) => {
                const val = e.target.value;
                setConfig({...config, subject: val, chapter: (SUBJECTS[val]?.[config.grade]?.[0] || '')});
              }}
              className="w-full p-6 bg-black border-2 border-[#222] rounded-[2rem] outline-none focus:border-amber-500 text-white font-black text-sm cursor-pointer"
            >
              {Object.keys(SUBJECTS).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Target Chapter</label>
            <select 
              value={config.chapter} 
              onChange={(e) => setConfig({...config, chapter: e.target.value})}
              className="w-full p-6 bg-black border-2 border-[#222] rounded-[2rem] outline-none focus:border-amber-500 text-white font-black text-xs transition-all cursor-pointer"
            >
              {(SUBJECTS[config.subject]?.[config.grade] || []).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Assessment Mode</label>
            <select 
              value={config.type} 
              onChange={(e) => setConfig({...config, type: e.target.value})}
              className="w-full p-6 bg-black border-2 border-[#222] rounded-[2rem] outline-none focus:border-amber-500 text-white font-black text-sm transition-all cursor-pointer"
            >
              <option>Periodic Test</option>
              <option>Half Yearly</option>
              <option>Preboards</option>
              <option>Final Examination</option>
            </select>
          </div>
        </div>

        <button 
          onClick={generate} 
          disabled={loading}
          className="w-full py-8 bg-amber-600 hover:bg-amber-700 text-black font-black text-2xl rounded-[2.5rem] shadow-2xl transition-all flex items-center justify-center gap-5 hover:-translate-y-2 active:translate-y-0"
        >
          {loading ? <Loader2 className="animate-spin" size={32} /> : <Sparkles size={32} />}
          {loading ? 'DRAFTING QUESTIONS...' : 'GENERATE PRINTABLE PAPER'}
        </button>
      </div>
    </div>
  );
};

export default KVExamGenerator;
