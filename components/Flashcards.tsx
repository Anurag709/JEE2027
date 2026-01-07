
import React, { useState } from 'react';
import { Layers, Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateJSONContent, FlashcardSchema } from '../services/geminiService';
import { SUBJECTS } from '../constants';
import { Flashcard } from '../types';

const Flashcards: React.FC = () => {
  const [config, setConfig] = useState({ grade: '12', subject: 'Physics', chapter: 'Electrostatics' });
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateCards = async () => {
    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    
    const prompt = `Generate 10 advanced flashcards for Class ${config.grade} ${config.subject} chapter "${config.chapter}". 
    Focus on core concepts, tricky formulas, and key definitions for JEE level. 
    IMPORTANT: Use actual mathematical symbols: Δ (delta), ρ (rho), φ (phi), θ (theta), × (multiplication), Σ (sigma), π (pi). 
    DO NOT use LaTeX formatting or words like 'rho' or 'delta'. 
    Fractions should be written as (a/b). Exponents should use a^b notation or <sup> tags.`;
    
    try {
      const data = await generateJSONContent(prompt, FlashcardSchema);
      setCards(data);
    } catch (e) {
      alert("Flashcard generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const availableChapters = SUBJECTS[config.subject]?.[config.grade] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Layers className="text-amber-500" size={32} />
          <h2 className="text-2xl font-black text-white">AI Flashcards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Grade</label>
            <select 
              className="w-full p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
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
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
            <select 
              className="w-full p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
              value={config.subject}
              onChange={(e) => {
                const newSubj = e.target.value;
                const chapters = SUBJECTS[newSubj]?.[config.grade] || [];
                setConfig({...config, subject: newSubj, chapter: chapters[0] || ''});
              }}
            >
              {Object.keys(SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Chapter</label>
            <select 
              className="w-full p-4 bg-black border border-[#222] rounded-xl outline-none focus:border-amber-500 text-white"
              value={config.chapter}
              onChange={(e) => setConfig({...config, chapter: e.target.value})}
            >
              {availableChapters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={generateCards}
          disabled={loading || !config.chapter}
          className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-black font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? 'Generating Cards...' : 'Generate 10 Smart Cards'}
        </button>
      </div>

      {cards.length > 0 && (
        <div className="flex flex-col items-center space-y-10 pb-12">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-xl h-80 perspective-1000 cursor-pointer group"
          >
            <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 bg-[#1a1a1a] border-2 border-[#333] rounded-3xl p-10 flex flex-col items-center justify-center text-center backface-hidden group-hover:border-amber-500/50 shadow-2xl">
                <div className="w-12 h-1 bg-amber-500 rounded-full mb-8"></div>
                <h3 className="text-2xl font-black text-white px-4 leading-tight" dangerouslySetInnerHTML={{ __html: cards[currentIndex].front }}></h3>
                <span className="absolute bottom-8 text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em]">Click to Flip</span>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-black border-2 border-amber-500/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl">
                 <div className="text-xl font-medium text-gray-200 leading-relaxed px-4" dangerouslySetInnerHTML={{ __html: cards[currentIndex].back }}></div>
                 <span className="absolute bottom-8 text-[10px] text-amber-500/50 uppercase font-bold tracking-[0.3em]">Definition / Answer</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); }}
              className="p-4 bg-[#1a1a1a] border border-[#333] rounded-full hover:border-amber-500 transition-all disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-gray-500 font-mono font-bold tracking-widest">{currentIndex + 1} / {cards.length}</div>
            <button 
              onClick={() => { setCurrentIndex(prev => Math.min(cards.length - 1, prev + 1)); setIsFlipped(false); }}
              className="p-4 bg-[#1a1a1a] border border-[#333] rounded-full hover:border-amber-500 transition-all disabled:opacity-30"
              disabled={currentIndex === cards.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
