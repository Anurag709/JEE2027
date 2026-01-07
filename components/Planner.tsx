
import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, List, Loader2, Sparkles, Clock, X } from 'lucide-react';
import { Task } from '../types';
import { generateExamContent } from '../services/geminiService';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [schedule, setSchedule] = useState(() => {
    return localStorage.getItem('jee_last_schedule') || '';
  });
  const [generatingSchedule, setGeneratingSchedule] = useState(false);

  useEffect(() => {
    localStorage.setItem('jee_last_schedule', schedule);
  }, [schedule]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string | number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string | number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const breakDown = async (task: Task) => {
    setLoadingId(task.id);
    try {
      const prompt = `Break down this study task into 3 actionable sub-tasks for a student: "${task.text}". Return only the tasks as a simple list. No symbols or formatting.`;
      const res = await generateExamContent(prompt);
      const subTasks = (res || "").split('\n').filter(s => s.trim().length > 0).slice(0, 3);
      
      const newTasks = subTasks.map((s, i) => ({
        id: `sub-${task.id}-${i}`,
        text: `↳ ${s.replace(/^[0-9.-]+\s*/, '').trim()}`,
        completed: false
      }));

      setTasks(prev => {
        const index = prev.findIndex(t => t.id === task.id);
        const updated = [...prev];
        updated.splice(index + 1, 0, ...newTasks);
        return updated;
      });
    } catch (e) {
      alert("Breakdown service unavailable. Check connection.");
    } finally {
      setLoadingId(null);
    }
  };

  const planDay = async () => {
    if (tasks.filter(t => !t.completed).length === 0) {
      alert("Please add at least one pending task to generate a schedule.");
      return;
    }
    setGeneratingSchedule(true);
    try {
      const active = tasks.filter(t => !t.completed).map(t => t.text).join(', ');
      const prompt = `Create a high-performance 6-hour study timeline (09:00 to 15:00) using Pomodoro technique for: ${active}. 
      Format as clean HTML. Use <b> for times, <div> for blocks, and <li> for tasks. Focus on deep work and rest. No CSS or Style tags.`;
      const res = await generateExamContent(prompt);
      setSchedule(res || "");
    } catch (e) {
      alert("Schedule generation failed. Try again.");
    } finally {
      setGeneratingSchedule(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-10 rounded-[2.5rem] border border-[#333] shadow-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-[#222] pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
              <CheckSquare className="text-amber-500" size={28} />
            </div>
            <h2 className="text-2xl font-black text-white">Execution Planner</h2>
          </div>
          <button 
            onClick={planDay}
            disabled={generatingSchedule}
            className="px-6 py-3 bg-amber-600 text-black font-black rounded-2xl text-xs flex items-center gap-3 hover:bg-amber-500 transition-all shadow-xl disabled:opacity-30"
          >
            {generatingSchedule ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            PLAN MY DAY
          </button>
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add target (e.g., Solve 20 Physics PYQs)"
            className="flex-1 bg-black border border-[#222] rounded-2xl p-5 outline-none focus:border-amber-500 transition-all text-sm font-medium"
          />
          <button onClick={addTask} className="bg-white text-black p-5 rounded-2xl transition-all hover:bg-gray-200 shadow-xl">
            <Plus size={24} />
          </button>
        </div>

        {schedule && (
          <div className="bg-[#0c0c0c] border-2 border-amber-500/30 p-8 rounded-[2rem] relative animate-in slide-in-from-top-6 shadow-2xl overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 rounded-l-full"></div>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-amber-500 font-black flex items-center gap-3 text-lg">
                  <Clock size={22} /> AI STUDY TIMELINE
                </h3>
                <button onClick={() => setSchedule('')} className="text-gray-600 hover:text-white transition-colors">
                  <X size={20} />
                </button>
             </div>
             <div className="text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: schedule }} />
          </div>
        )}

        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-5 p-5 rounded-2xl border transition-all ${
                task.completed ? 'bg-black/50 border-[#222] opacity-60' : 'bg-[#1a1a1a] border-[#333] hover:border-amber-500/20'
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'bg-amber-600 border-amber-600' : 'border-gray-600 group-hover:border-amber-500'
                }`}
              >
                {task.completed && <CheckSquare size={16} className="text-black" />}
              </button>
              
              <span className={`flex-1 text-sm font-bold tracking-tight ${task.completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                {task.text}
              </span>

              {!task.completed && !String(task.id).startsWith('sub-') && (
                <button 
                  onClick={() => breakDown(task)}
                  disabled={loadingId === task.id}
                  className="p-2.5 bg-black/50 rounded-xl border border-[#222] text-gray-500 hover:text-amber-500 hover:border-amber-500/50 transition-all"
                  title="Break Down"
                >
                  {loadingId === task.id ? <Loader2 size={16} className="animate-spin" /> : <List size={20} />}
                </button>
              )}

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-[#222] rounded-[2rem]">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Ready for Assignments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
