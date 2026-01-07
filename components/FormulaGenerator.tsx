
import React, { useState } from 'react';
import { Sigma, Loader2, Sparkles } from 'lucide-react';
import { generateExamContent } from '../services/geminiService';
import { SUBJECTS } from '../constants';

const FormulaGenerator: React.FC = () => {
  const [config, setConfig] = useState({ grade: '12', subject: 'Physics', chapter: 'Electrostatics' });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSheet = async () => {
    setLoading(true);
    setContent('');
    const prompt = `Generate a concise, tabular formula sheet for Class ${config.grade} ${config.subject} chapter "${config.chapter}". 
    Include columns for Formula, Variables, and Key Conditions. 
    IMPORTANT: Use actual mathematical symbols: Δ (delta), ρ (rho), φ (phi), θ (theta), × (multiplication), Σ (sigma), π (pi), ± (plus-minus), √ (square root), ∞ (infinity). 
    DO NOT use LaTeX codes like \\delta or letters like 'delta' or 'rho'. 
    Use <sup> for exponents and <sub> for subscripts. 
    Use <table>, <tr>, <th>, <td> tags for layout. Style tables with border-collapse and padding.`;
    
    try {
      const res = await generateExamContent(prompt);
      setContent(res || "");
    } catch (e) {
      alert("Failed to generate formula sheet.");
    } finally {
      setLoading(false);
    }
  };

  const availableChapters = SUBJECTS[config.subject]?.[config.grade] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Sigma className="text-amber-500" size={32} />
          <h2 className="text-2xl font-black text-white">Formula Sheet Generator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <select 
            className="p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
            value={config.grade}
            onChange={(e) => {
              const newGrade = e.target.value;
              const chapters = SUBJECTS[config.subject]?.[newGrade] || [];
              setConfig({...config, grade: newGrade, chapter: chapters[0] || ''});
            }}
          >
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select 
            className="p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
            value={config.subject}
            onChange={(e) => {
              const newSubj = e.target.value;
              const chapters = SUBJECTS[newSubj]?.[config.grade] || [];
              setConfig({...config, subject: newSubj, chapter: chapters[0] || ''});
            }}
          >
            {Object.keys(SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
            value={config.chapter}
            onChange={(e) => setConfig({...config, chapter: e.target.value})}
          >
            {availableChapters.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          onClick={generateSheet}
          disabled={loading || !config.chapter}
          className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-black font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? 'Processing Equations...' : 'Generate Cheat Sheet'}
        </button>
      </div>

      {content && (
        <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl overflow-x-auto">
          <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
};

export default FormulaGenerator;
