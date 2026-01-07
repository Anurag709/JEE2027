
import React, { useState, useEffect } from 'react';
import { PieChart, CheckSquare } from 'lucide-react';
import { SUBJECTS } from '../constants';

const SyllabusTracker: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [activeGrade, setActiveGrade] = useState('12');
  const [completed, setCompleted] = useState<string[]>(() => {
    const saved = localStorage.getItem('jee_syllabus');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jee_syllabus', JSON.stringify(completed));
  }, [completed]);

  const toggle = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getSubjProgress = (subj: string) => {
    const subjData = SUBJECTS[subj];
    if (!subjData) return 0;
    
    const total = ((subjData["11"]?.length || 0) + (subjData["12"]?.length || 0));
    if (total === 0) return 0;
    
    const done = completed.filter(id => id.startsWith(subj)).length;
    return Math.round((done / total) * 100);
  };

  const currentChapters = SUBJECTS[activeSubject]?.[activeGrade] || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <PieChart className="text-amber-500" size={32} />
          <h2 className="text-2xl font-black text-white">Syllabus Tracker</h2>
        </div>
        <div className="flex gap-2 bg-black p-1.5 rounded-2xl border border-[#222]">
          <button 
            onClick={() => setActiveGrade('11')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeGrade === '11' ? 'bg-amber-600 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Class 11
          </button>
          <button 
            onClick={() => setActiveGrade('12')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeGrade === '12' ? 'bg-amber-600 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Class 12
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(SUBJECTS).map(subj => {
          const progress = getSubjProgress(subj);
          return (
            <button 
              key={subj} 
              onClick={() => setActiveSubject(subj)}
              className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden ${
                activeSubject === subj ? 'bg-[#1a1a1a] border-amber-500 shadow-xl' : 'bg-[#121212] border-[#333] hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-100">{subj}</span>
                <span className="text-xs font-mono font-bold text-amber-500">{progress}%</span>
              </div>
              <div className="h-1.5 bg-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentChapters.map(chapter => {
          const id = `${activeSubject}-${activeGrade}-${chapter}`;
          const isDone = completed.includes(id);
          return (
            <div 
              key={chapter} 
              onClick={() => toggle(id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                isDone ? 'bg-black border-[#222] opacity-50 shadow-inner' : 'bg-[#121212] border-[#333] hover:border-amber-500/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                isDone ? 'bg-amber-600 border-amber-600' : 'border-gray-600'
              }`}>
                {isDone && <CheckSquare size={14} className="text-black" />}
              </div>
              <span className={`text-sm font-medium transition-all ${isDone ? 'text-gray-600 line-through' : 'text-gray-200'}`}>
                {chapter}
              </span>
            </div>
          );
        })}
        {currentChapters.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500 text-sm">
            No chapters found for this subject/grade selection.
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusTracker;
