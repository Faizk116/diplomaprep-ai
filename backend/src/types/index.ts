export interface User {
  id: string;
  name: string;
  emailOrEnrollment: string;
  passwordHash?: string;
  googleId?: string;
  branch: string;
  year: string;
  avatarUrl: string;
  authProvider: 'email' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  userId: string;
  streakDays: number;
  solvedMCQs: number;
  attemptedMCQs: number;
  targetMCQs: number;
  correctAnswers: number;
  overallAccuracy: number;
  weeklyGrowth: number;
  targetExam: string;
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  branch: string;
  scheme: string;
  unitsCount: number;
  totalMCQs: number;
}

export interface Unit {
  id: number;
  subjectId: string;
  number: number;
  title: string;
  weightageMarks: number;
  totalQuestions: number;
  topics: string[];
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  description?: string;
}

export interface QuestionExplanation {
  whyCorrect: string;
  trapWarning: string;
  examTip: string;
  peerAccuracy: {
    correctPct: number;
    distractorStats: Record<string, number>;
  };
}

export interface Question {
  id: string;
  code: string;
  subjectId: string;
  unitId: number;
  unitName: string;
  topic: string;
  bloomLevel: string;
  marks: number;
  sourcePaper: string;
  question: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: QuestionExplanation;
}

export interface TestSession {
  id: string;
  userId: string;
  subjectId: string;
  unitId: number;
  totalQuestions: number;
  score: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  timeRemainingSeconds: number;
  startedAt: string;
  completedAt?: string;
}

export interface SessionAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  markedForReview: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}
