
import React, { useState, useEffect } from 'react';
import { 
  Clock, Award, MessageSquare, PieChart, FileText, Layers, Sigma, 
  ClipboardCheck, Lightbulb, CheckSquare, Settings, Menu, GraduationCap, 
  PanelLeftClose, Wifi, WifiOff
} from 'lucide-react';
import { View, Task } from './types';
import Dashboard from './components/Dashboard';
import JEEExamGenerator from './components/JEEExamGenerator';
import AIChat from './components/AIChat';
import SyllabusTracker from './components/SyllabusTracker';
import Flashcards from './components/Flashcards';
import FormulaGenerator from './components/FormulaGenerator';
import AnswerGrader from './components/AnswerGrader';
import MnemonicsGenerator from './components/MnemonicsGenerator';
import Planner from './components/Planner';
import SettingsPanel from './components/SettingsPanel';
import KVExamGenerator from './components/KVExamGenerator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('jee_tasks');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('jee_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const navItems = [
    { id: View.Dashboard, icon: Clock, label: 'Dashboard' },
    { id: View.JEE, icon: Award, label: 'JEE Mock Test' },
    { id: View.Chat, icon: MessageSquare, label: 'AI Tutor' },
    { id: View.Tracker, icon: PieChart, label: 'Syllabus' },
    { id: View.KVTest, icon: FileText, label: 'KV Exams' },
    { id: View.Flashcards, icon: Layers, label: 'Flashcards' },
    { id: View.Formulas, icon: Sigma, label: 'Formulas' },
    { id: View.Grader, icon: ClipboardCheck, label: 'AI Grader' },
    { id: View.Mnemonics, icon: Lightbulb, label: 'Mnemonics' },
    { id: View.Todo, icon: CheckSquare, label: 'Planner' },
    { id: View.Settings, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`transition-all duration-300 ease-in-out bg-[#0a0a0a] border-r border-[#222] flex flex-col ${
          isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-none'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-amber-500" size={32} />
              <div className="text-2xl font-black tracking-tighter">JEE<span className="text-amber-500">27</span></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-[#222]">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {isOnline ? 'Network Online' : 'Offline Mode'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeView === item.id 
                  ? 'bg-amber-600 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="p-6 flex items-center gap-3 text-gray-500 hover:text-white transition-colors border-t border-[#222]"
        >
          <PanelLeftClose size={20} />
          <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Contract Sidebar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-black p-4 md:p-8 no-scrollbar">
        {!isSidebarOpen && (
          <div className="fixed top-6 left-6 z-50 flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-amber-600 rounded-xl text-black hover:bg-amber-500 shadow-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur border border-[#222] shadow-xl`}>
               <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">
                 {isOnline ? 'Online' : 'Offline'}
               </span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto pb-32">
          {activeView === View.Dashboard && <Dashboard setActiveView={setActiveView} tasks={tasks} />}
          {activeView === View.JEE && <JEEExamGenerator />}
          {activeView === View.Chat && <AIChat />}
          {activeView === View.Tracker && <SyllabusTracker />}
          {activeView === View.KVTest && <KVExamGenerator />}
          {activeView === View.Flashcards && <Flashcards />}
          {activeView === View.Formulas && <FormulaGenerator />}
          {activeView === View.Grader && <AnswerGrader />}
          {activeView === View.Mnemonics && <MnemonicsGenerator />}
          {activeView === View.Todo && <Planner tasks={tasks} setTasks={setTasks} />}
          {activeView === View.Settings && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
};

export default App;
