
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Globe, GraduationCap, Trash2, History } from 'lucide-react';
import { generateExamContent } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('jee_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: "Hello! I'm your dedicated JEE AI Tutor. How can I help you today? You can ask me to solve a problem, explain a concept, or even research latest trends!", timestamp: Date.now() }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [researchMode, setResearchMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('jee_chat_history', JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMsg, timestamp: Date.now() }];
    setMessages(newMessages as any);
    setInput('');
    setLoading(true);

    try {
      const prompt = researchMode 
        ? `Act as an expert researcher for JEE. Answer accurately with latest info: ${userMsg}`
        : `Act as a senior JEE physics, chemistry, and maths tutor. Answer this query: ${userMsg}. Keep it educational and concise. Use plain text and simple HTML tags like <b> or <br>. No LaTeX.`;
      
      const response = await generateExamContent(prompt, 'gemini-3-flash-preview');
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that request.", timestamp: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: Connection lost. Check your API key or internet.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Delete all chat history?")) {
      setMessages([{ role: 'ai', text: "History cleared. How can I help you now?", timestamp: Date.now() }]);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-[#0c0c0c] border border-[#333] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-[#222] bg-black/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner">
            <GraduationCap className="text-amber-500" size={24} />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight">AI Tutor</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Intelligent Core Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearHistory}
            className="p-3 text-gray-500 hover:text-red-500 transition-colors bg-[#1a1a1a] rounded-xl border border-[#333]"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => setResearchMode(!researchMode)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${
              researchMode ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/20' : 'bg-[#1a1a1a] text-gray-400 border-[#333]'
            }`}
          >
            <Globe size={14} /> {researchMode ? 'Research Active' : 'Basic Mode'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-[#050505]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-6 py-5 rounded-[2rem] relative group ${
              msg.role === 'user' 
                ? 'bg-amber-600 text-black font-bold shadow-xl rounded-tr-none' 
                : 'bg-[#121212] text-gray-200 border border-[#222] rounded-tl-none'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
              <div className={`mt-2 text-[9px] font-bold uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-black' : 'text-gray-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#121212] border border-[#222] rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl">
              <Loader2 className="animate-spin text-amber-500" size={18} />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tutor is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-black border-t border-[#222]">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={researchMode ? "Research complex concepts..." : "Solve a problem or explain a concept..."}
            className="flex-1 bg-[#121212] border border-[#222] rounded-2xl px-6 py-5 outline-none focus:border-amber-500 transition-all text-sm font-medium shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:hover:bg-amber-600 text-black p-5 rounded-2xl transition-all shadow-xl flex items-center justify-center"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
