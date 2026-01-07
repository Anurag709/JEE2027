
import React, { useState } from 'react';
import { ClipboardCheck, Loader2, GraduationCap, AlertCircle } from 'lucide-react';
import { generateExamContent } from '../services/geminiService';

const AnswerGrader: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const grade = async () => {
    if (!question || !answer) return;
    setLoading(true);
    const prompt = `Act as a strict CBSE / JEE examiner. Question: "${question}" Student Answer: "${answer}". 
    Evaluate out of 5 marks. Provide detailed feedback, point out missing points, and provide a model answer. Use plain text / simple HTML. NO LATEX.`;
    
    try {
      const res = await generateExamContent(prompt, 'gemini-3-pro-preview');
      setFeedback(res || "");
    } catch (e) {
      alert("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="text-amber-500" size={32} />
          <h2 className="text-2xl font-black text-white">AI Answer Grader</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Question</label>
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 bg-black border border-[#222] rounded-xl min-h-[100px] outline-none focus:border-amber-500"
              placeholder="Paste the question here..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Your Answer</label>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 bg-black border border-[#222] rounded-xl min-h-[200px] outline-none focus:border-amber-500"
              placeholder="Type or paste your complete answer here..."
            />
          </div>
        </div>

        <button 
          onClick={grade}
          disabled={loading || !question || !answer}
          className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-black font-black text-lg rounded-2xl disabled:opacity-30 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <GraduationCap />}
          {loading ? 'Evaluating Quality...' : 'Grade My Answer'}
        </button>
      </div>

      {feedback && (
        <div className="bg-[#121212] p-8 rounded-3xl border border-[#333] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
            <AlertCircle size={18} /> Examiner's Report
          </h3>
          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: feedback }} />
        </div>
      )}
    </div>
  );
};

export default AnswerGrader;
