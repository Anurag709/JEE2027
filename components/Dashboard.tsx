
import React, { useState, useEffect } from 'react';
import { Clock, PieChart, Award, FileText, Layers, MessageSquare, Sigma, ClipboardCheck, Lightbulb } from 'lucide-react';
import { View, Task } from '../types';

interface DashboardProps {
  setActiveView: (view: View) => void;
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, tasks }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: Jan 20, 2027
    const target = new Date("2027-01-20T09:00:00").getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const dist = target - now;
      
      if (dist < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dist % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = tasks.filter(t => !t.completed).length;

  const cards = [
    { id: View.Tracker, icon: PieChart, label: 'Syllabus Tracker', desc: 'Track your chapter-wise preparation status.' },
    { id: View.JEE, icon: Award, label: 'JEE Mock Test', desc: 'Professional level Mains & Advanced mocks.' },
    { id: View.KVTest, icon: FileText, label: 'KV Exam Mode', desc: 'Printable school-level question papers.' },
    { id: View.Flashcards, icon: Layers, label: 'Flashcards', desc: 'Active recall for high-yield formulas.' },
    { id: View.Chat, icon: MessageSquare, label: 'Ask AI Doubt', desc: 'Immediate scientific explanations.' },
    { id: View.Formulas, icon: Sigma, label: 'Formula Sheets', desc: 'Generate digital cheat sheets instantly.' },
    { id: View.Grader, icon: ClipboardCheck, label: 'AI Grader', desc: 'Expert evaluation of subjective answers.' },
    { id: View.Mnemonics, icon: Lightbulb, label: 'Memory Boost', desc: 'Generate unique mnemonics for revision.' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="bg-[#121212] rounded-[3rem] p-10 border border-[#333] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-[#222] pb-10">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter italic mb-2">JEE MAIN 2027</h2>
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Mission Engineering Excellence</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{pendingCount} PENDING TASKS</p>
              <p className="text-[10px] text-gray-500 font-bold">Execution Planner Active</p>
            </div>
            <Clock className="text-amber-500 w-12 h-12 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black rounded-3xl p-8 border border-[#222] shadow-inner transition-all hover:border-amber-500/50">
            <div className="text-5xl md:text-7xl font-black font-mono text-white mb-2 tracking-tighter">{timeLeft.days}</div>
            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600">Days</div>
          </div>
          <div className="bg-black rounded-3xl p-8 border border-[#222] shadow-inner transition-all hover:border-amber-500/50">
            <div className="text-5xl md:text-7xl font-black font-mono text-white mb-2 tracking-tighter">{timeLeft.hours}</div>
            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600">Hours</div>
          </div>
          <div className="bg-black rounded-3xl p-8 border border-[#222] shadow-inner transition-all hover:border-amber-500/50">
            <div className="text-5xl md:text-7xl font-black font-mono text-white mb-2 tracking-tighter">{timeLeft.minutes}</div>
            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-600">Mins</div>
          </div>
          <div className="bg-black rounded-3xl p-8 border border-[#222] shadow-inner transition-all border-amber-500/20">
            <div className="text-5xl md:text-7xl font-black font-mono text-amber-500 mb-2 tracking-tighter">{timeLeft.seconds}</div>
            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-600">Secs</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id)} 
            className="p-8 bg-[#121212] border border-[#333] rounded-[2.5rem] hover:border-amber-500 transition-all group flex flex-col items-start text-left relative overflow-hidden hover:shadow-2xl"
          >
            <div className="bg-black p-5 rounded-2xl text-gray-400 group-hover:bg-amber-500 group-hover:text-black mb-8 transition-all shadow-lg">
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-100 mb-2 group-hover:text-amber-500 transition-colors uppercase tracking-tighter">{item.label}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
