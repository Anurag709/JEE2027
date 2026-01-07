
import React, { useState } from 'react';
import { Award, Loader2, Shuffle, Play, BarChart2, CheckSquare, Square, ClipboardList, Timer, Target } from 'lucide-react';
import { generateJSONContent, ExamSchema, generateExamContent } from '../services/geminiService';
import { SUBJECTS } from '../constants';
import { TestData, ScoreData } from '../types';

const JEEExamGenerator: React.FC = () => {
  const [config, setConfig] = useState({ 
    mode: 'Topic-wise', 
    examType: 'JEE Main', 
    subject: 'Physics'
  });
  
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const toggleChapter = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
    );
  };

  const selectAll = () => {
    const subjData = SUBJECTS[config.subject];
    if (!subjData) return;
    const all = [...(subjData["11"] || []), ...(subjData["12"] || [])];
    setSelectedChapters(all);
  };

  const deselectAll = () => setSelectedChapters([]);

  const generateTest = async () => {
    if (selectedChapters.length === 0) {
      alert("Please tick at least one topic to generate the exam.");
      return;
    }
    
    setLoading(true);
    const topicsStr = selectedChapters.join(', ');
    
    let prompt = "";
    if (config.examType === 'JEE Main') {
      prompt = `Act as a senior NTA Paper Setter. Generate a PROFESSIONAL JEE Main Mock Paper for ${config.subject}. 
      Topics selected: ${topicsStr}. 
      Structure: EXACTLY 25 questions. 
      - 20 Single Correct MCQs.
      - 5 Numerical Type Questions.
      Difficulty: Standard JEE Main level. 
      IMPORTANT: Use actual math symbols: Δ (delta), ρ (rho), φ (phi), θ (theta), × (multiplication cross), ±, Σ, π, √, ∞, λ. 
      DO NOT use LaTeX codes like \\delta. Use <sup> and <sub> tags for exponents and subscripts. 
      Ensure deep research and realistic engineering problems.`;
    } else {
      prompt = `Act as an IIT Professor and JEE Advanced Coordinator. Generate a CHALLENGING JEE Advanced Mock Paper for ${config.subject}. 
      Topics: ${topicsStr}. 
      Structure: Rigorous mix of 18-20 questions:
      - MCQs (Multiple Correct or Single Correct).
      - Numerical Value (Integer/Decimal).
      - Paragraph/Comprehension Type (2-3 questions for one descriptive paragraph context).
      Include actual math symbols: Δ, ρ, φ, θ, × (multiplication cross), ±, Σ, π, √, ∞, λ, ∫, ∂. 
      NO LaTeX. High precision scientific content. Use <sup> and <sub> tags.`;
    }
    
    try {
      const data = await generateJSONContent(prompt, ExamSchema, 'gemini-3-pro-preview');
      setTestData(data);
    } catch (e) {
      console.error(e);
      alert("Error generating exam. Please check your API usage or connection.");
    } finally {
      setLoading(false);
    }
  };

  const submitTest = () => {
    if (!testData) return;
    let correct = 0, wrong = 0, skipped = 0;
    const allQs = testData.sections.flatMap(s => s.questions);
    
    allQs.forEach(q => {
      const ans = userAnswers[q.id];
      if (!ans) skipped++;
      else if (ans.trim().toLowerCase() === q.correctOption.trim().toLowerCase()) correct++;
      else wrong++;
    });

    const totalScore = (correct * 4) - (wrong * 1);
    const maxScore = allQs.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let percentile = 90 + (percentage / 10.1);
    if (percentile > 99.99) percentile = 99.99;
    if (percentage < 0) percentile = 5.2;

    setScoreData({
      correct, wrong, skipped, totalScore, maxScore,
      percentile: percentile
    });
    setSubmitted(true);
    setTestActive(false);
  };

  const currentSubjectData = SUBJECTS[config.subject];
  const availableChapters = currentSubjectData ? [...(currentSubjectData["11"] || []), ...(currentSubjectData["12"] || [])] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {submitted && scoreData ? (
        <div className="bg-[#121212] rounded-[3rem] p-12 border border-[#333] text-center space-y-12 animate-in zoom-in duration-500 shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
           <div className="flex justify-center">
             <div className="w-28 h-28 bg-amber-500 p-1 rounded-[2.5rem] shadow-[0_0_50px_rgba(245,158,11,0.3)]">
               <div className="w-full h-full bg-[#121212] rounded-[2.2rem] flex items-center justify-center">
                 <Award size={48} className="text-amber-500" />
               </div>
             </div>
           </div>
           <div>
             <h2 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-4">SCORE CARD</h2>
             <p className="text-gray-500 uppercase font-black tracking-[0.6em] text-xs">Aspirant Performance Analytics</p>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="p-8 bg-black border border-[#222] rounded-[2rem] shadow-inner">
               <p className="text-4xl font-black text-white mb-2">{scoreData.totalScore}</p>
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Final Score</p>
             </div>
             <div className="p-8 bg-black border border-[#222] rounded-[2rem] shadow-inner">
               <p className="text-4xl font-black text-green-500 mb-2">{scoreData.correct}</p>
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Correct</p>
             </div>
             <div className="p-8 bg-black border border-[#222] rounded-[2rem] shadow-inner">
               <p className="text-4xl font-black text-red-500 mb-2">{scoreData.wrong}</p>
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Wrong</p>
             </div>
             <div className="p-8 bg-amber-500 text-black rounded-[2rem] shadow-[0_15px_35px_rgba(245,158,11,0.2)]">
               <p className="text-4xl font-black mb-2">{scoreData.percentile.toFixed(2)}</p>
               <p className="text-[10px] text-black/60 uppercase font-black tracking-widest">Percentile</p>
             </div>
           </div>
           {!analysis ? (
             <button 
              onClick={async () => {
                setAnalyzing(true);
                const prompt = `Deeply analyze this JEE performance: Correct: ${scoreData.correct}, Wrong: ${scoreData.wrong}, Score: ${scoreData.totalScore}/${scoreData.maxScore}. 
                Provide 3 highly expert strategy tips using symbols like Δ, ρ, φ, θ, ×.`;
                const res = await generateExamContent(prompt);
                setAnalysis(res || "");
                setAnalyzing(false);
              }} 
              disabled={analyzing}
              className="w-full py-6 bg-amber-600 hover:bg-amber-700 text-black font-black text-xl rounded-3xl transition-all flex items-center justify-center group shadow-xl"
             >
               {analyzing ? <Loader2 className="animate-spin mr-3" /> : <BarChart2 size={24} className="mr-4 group-hover:rotate-12 transition-all" />} 
               PERFORMANCE DEBRIEF
             </button>
           ) : (
             <div className="bg-blue-900/10 border border-blue-500/30 p-10 rounded-[2.5rem] text-left animate-in fade-in slide-in-from-top-6">
               <h3 className="text-blue-400 font-black mb-6 flex items-center gap-3 tracking-tight">
                 <ClipboardList size={24} /> AI PERFORMANCE DEBRIEF
               </h3>
               <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">{analysis}</p>
             </div>
           )}
           <button 
            onClick={() => { setSubmitted(false); setTestData(null); setUserAnswers({}); setAnalysis(''); }} 
            className="w-full py-5 bg-[#1a1a1a] border border-[#333] hover:border-amber-500 text-white font-bold rounded-3xl transition-all tracking-widest text-xs uppercase"
           >
             Return to Dashboard
           </button>
        </div>
      ) : testActive && testData ? (
        <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 bg-black">
          <header className="bg-[#121212] border-b border-[#333] p-5 flex justify-between items-center sticky top-0 z-50 shadow-xl">
            <div className="flex items-center gap-4">
              <Target className="text-amber-500" />
              <div>
                <h1 className="text-lg font-black text-white">{config.examType}</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{config.subject} Professional Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-amber-500 font-mono font-bold bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                 <Timer size={18} />
                 <span>60:00</span>
              </div>
              <button onClick={submitTest} className="px-8 py-2.5 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 shadow-lg transform active:scale-95 transition-all">SUBMIT EXAM</button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-12 no-scrollbar pb-32 max-w-5xl mx-auto w-full">
            {testData.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 bg-amber-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-gray-200 uppercase tracking-tighter">{section.name}</h3>
                </div>
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-[#121212] p-10 rounded-[2rem] border border-[#333] shadow-2xl relative overflow-hidden transition-all hover:border-amber-500/30">
                    <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/10 group-hover:bg-amber-500 transition-all"></div>
                    <div className="flex gap-8 mb-8">
                      <span className="text-gray-600 font-black text-3xl font-mono leading-none">Q{qIdx + 1}</span>
                      <div className="space-y-6 flex-1">
                        {q.paragraphText && (
                          <div className="bg-black/40 p-8 rounded-3xl border border-[#222] text-sm italic text-gray-400 leading-relaxed mb-8 border-l-4 border-amber-500/40" dangerouslySetInnerHTML={{ __html: q.paragraphText }}></div>
                        )}
                        <div className="text-gray-100 text-xl md:text-2xl leading-relaxed font-semibold tracking-tight" dangerouslySetInnerHTML={{ __html: q.text }}></div>
                      </div>
                    </div>
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: String.fromCharCode(65 + oIdx) })}
                            className={`p-6 rounded-3xl border text-left text-sm transition-all flex items-center gap-5 group ${
                              userAnswers[q.id] === String.fromCharCode(65 + oIdx) 
                                ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                                : 'bg-black border-[#222] text-gray-400 hover:border-[#444] hover:bg-[#1a1a1a]'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all ${
                              userAnswers[q.id] === String.fromCharCode(65 + oIdx) ? 'border-black bg-black text-amber-500' : 'border-[#333] group-hover:border-amber-500/50'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <span className="leading-tight" dangerouslySetInnerHTML={{ __html: opt }}></span>
                          </button>
                        ))}
                      </div>
                    )}
                    {q.type === 'numerical' && (
                      <div className="ml-16 mt-6">
                        <div className="flex items-center gap-6 bg-black border border-[#222] rounded-3xl p-3 max-w-sm focus-within:border-amber-500 transition-all shadow-inner">
                          <span className="text-[10px] font-black text-gray-600 pl-4 uppercase tracking-widest">Calculated Result:</span>
                          <input 
                            type="text"
                            placeholder="0.00"
                            className="flex-1 p-3 bg-transparent border-none outline-none text-white font-mono font-bold text-lg"
                            onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#121212] p-12 rounded-[3.5rem] border border-[#333] shadow-2xl space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="flex items-center gap-6 border-b border-[#222] pb-10">
            <div className="bg-amber-500 text-black p-5 rounded-3xl shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
              <Award size={40} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">Professional JEE Suite</h2>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.5em] opacity-80">Scientific Performance Benchmarking</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Target Assessment</label>
              <div className="flex gap-3">
                {['JEE Main', 'JEE Advanced'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setConfig({...config, examType: type})}
                    className={`flex-1 py-5 rounded-3xl border-2 font-black text-sm transition-all ${config.examType === type ? 'bg-amber-600 border-amber-500 text-black shadow-lg transform scale-105' : 'bg-black border-[#222] text-gray-500 hover:border-[#333]'}`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Subject Vertical</label>
              <select 
                value={config.subject} 
                onChange={(e) => {
                  setConfig({...config, subject: e.target.value});
                  setSelectedChapters([]);
                }}
                className="w-full p-5 bg-black border-2 border-[#222] rounded-[2rem] outline-none focus:border-amber-500 transition-all text-white font-black text-sm cursor-pointer"
              >
                {Object.keys(SUBJECTS).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between ml-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Topic Palette (Tick to Include)</label>
              <div className="flex gap-6">
                <button onClick={selectAll} className="text-[10px] text-amber-500 font-black hover:underline tracking-widest">SELECT ALL</button>
                <button onClick={deselectAll} className="text-[10px] text-gray-500 font-black hover:underline tracking-widest">CLEAR ALL</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-4 no-scrollbar border-2 border-[#222] p-8 rounded-[2.5rem] bg-black/40 shadow-inner">
              {availableChapters.map((chapter) => (
                <button 
                  key={chapter} 
                  onClick={() => toggleChapter(chapter)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left text-xs transition-all border-2 font-bold ${
                    selectedChapters.includes(chapter) 
                      ? 'bg-amber-500 border-amber-500 text-black shadow-lg' 
                      : 'bg-[#1a1a1a] border-transparent text-gray-500 hover:border-[#333] hover:text-white'
                  }`}
                >
                  {selectedChapters.includes(chapter) ? <CheckSquare size={16} className="text-black shrink-0" /> : <Square size={16} className="text-gray-700 shrink-0" />}
                  <span className="truncate">{chapter}</span>
                </button>
              ))}
              {availableChapters.length === 0 && (
                 <div className="col-span-full py-10 text-center text-gray-500 text-sm">No chapters available.</div>
              )}
            </div>
          </div>
          <button 
            onClick={generateTest} 
            disabled={loading}
            className="w-full py-7 bg-amber-600 hover:bg-amber-700 text-black font-black text-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-5 hover:-translate-y-1 active:translate-y-0"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : <Shuffle size={28} />}
            {loading ? 'DRAFTING RESEARCH PAPERS...' : 'GENERATE PROFESSIONAL EXAM'}
          </button>
          {testData && !testActive && (
            <div className="flex justify-center pt-8 animate-in slide-in-from-top-6">
               <button 
                onClick={() => setTestActive(true)}
                className="px-20 py-6 bg-green-600 hover:bg-green-700 text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(22,163,74,0.3)] transition-all flex items-center gap-5 transform hover:scale-105"
              >
                <Play size={32} /> ENTER EXAMINATION HALL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JEEExamGenerator;
