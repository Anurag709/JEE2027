
export enum View {
  Dashboard = 'dashboard',
  JEE = 'jee',
  Chat = 'chat',
  Tracker = 'tracker',
  KVTest = 'kvtest',
  Flashcards = 'flashcards',
  Formulas = 'formulas',
  Grader = 'grader',
  Mnemonics = 'mnemonics',
  Todo = 'todo',
  Settings = 'settings'
}

export interface Question {
  id: string;
  type: 'mcq' | 'numerical' | 'text' | 'paragraph' | 'case_based';
  text: string;
  subject?: string;
  options?: string[];
  correctOption: string;
  explanation: string;
  marks?: number;
  caseText?: string; // Descriptive passage for Case Based Questions (CBQ)
  paragraphText?: string; // Context for JEE Advanced Paragraph questions
}

export interface Section {
  name: string;
  context?: string; // Section-level instructions
  questions: Question[];
}

export interface TestData {
  duration_seconds: number;
  sections: Section[];
  totalMaxMarks?: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Task {
  id: string | number;
  text: string;
  completed: boolean;
}

export interface ScoreData {
  correct: number;
  wrong: number;
  skipped: number;
  totalScore: number;
  maxScore: number;
  percentile: number;
}
