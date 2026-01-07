
import React, { useState } from 'react';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { generateExamContent } from '../services/geminiService';

const MnemonicsGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic) return;
    setLoading(true);
    const prompt = `Create a creative, easy-to-remember mnemonic for the topic: "${topic}". 
    Format with **Mnemonic Phrase** and **Explanation of each word**. NO LATEX.`;
    
    try {
      const res = await generateExamContent(prompt);
      setResult(res || "");
    } catch (e) {
      alert("Mnemonic generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Lightbulb className="text-amber-500" size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-white">Mnemonics Generator</h2>
        <p className="text-sm text-gray-500">Struggling to remember a list or formula? Let AI create a memory aid for you.</p>

        <div className="relative">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Electromagnetic Spectrum, Periodic Table G17"
            className="w-full p-5 bg-black border border-[#222] rounded-2xl outline-none focus:border-amber-500 transition-all text-sm"
          />
        </div>

        <button 
          onClick={generate}
          disabled={loading || !topic}
          className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-black font-black text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-30"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? 'Thinking Creatively...' : 'Generate Mnemonic'}
        </button>
      </div>

      {result && (
        <div className="bg-black p-8 rounded-3xl border border-amber-500/20 shadow-2xl animate-in slide-in-from-bottom-4">
           <div className="text-gray-200 text-lg font-medium leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<b class="text-amber-500">$1</b>') }} />
        </div>
      )}
    </div>
  );
};

export default MnemonicsGenerator;
