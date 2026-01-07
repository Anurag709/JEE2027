
import React from 'react';
import { Settings, Lock, AlertCircle, CheckCircle, Database, Trash2 } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const clearAllData = () => {
    if (confirm("WARNING: This will delete all syllabus progress, chat history, and tasks. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 animate-in fade-in duration-500 space-y-8">
      <div className="bg-[#121212] p-10 rounded-[3rem] border border-[#333] shadow-2xl">
        <div className="flex items-center gap-4 mb-10 border-b border-[#222] pb-6">
          <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
            <Settings className="text-amber-500" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">System Configuration</h2>
        </div>

        <div className="space-y-10">
          <div className="p-8 bg-black border border-[#222] rounded-[2.5rem] space-y-6 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-300 flex items-center gap-3 uppercase tracking-tighter">
                <Lock size={20} className="text-amber-500" /> API Gateway
              </h3>
              {process.env.API_KEY ? (
                <span className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                  <CheckCircle size={14} /> ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                  <AlertCircle size={14} /> ERROR
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Intelligence core is powered by Google Gemini 2.5/3.0. The system uses your institutional or personal API key to maintain context and high-fidelity responses.
            </p>

            <div className="pt-2">
              <div className="text-[10px] text-gray-600 font-mono bg-[#0c0c0c] p-4 rounded-xl border border-[#1a1a1a] shadow-inner">
                SYSTEM_NODE: {process.env.API_KEY ? 'READY_AND_STABLE' : 'INTELLIGENCE_DISCONNECTED'}
              </div>
            </div>
          </div>

          <div className="p-8 bg-black border border-[#222] rounded-[2.5rem] space-y-6 shadow-inner">
            <h3 className="font-black text-gray-300 flex items-center gap-3 uppercase tracking-tighter">
              <Database size={20} className="text-amber-500" /> Local Repository
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Syllabus progress, planner tasks, and tutoring history are stored locally in your browser to ensure zero latency and offline availability.
            </p>
            <button 
              onClick={clearAllData}
              className="w-full py-4 bg-red-900/10 border border-red-500/30 text-red-500 font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 text-xs tracking-widest uppercase"
            >
              <Trash2 size={16} /> Purge Local Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
