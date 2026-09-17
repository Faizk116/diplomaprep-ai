export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  description?: string;
}

export interface Question {
  id: string;
  code: string;
  subjectId?: string;
  unitId: number;
  unitName: string;
  topic: string;
  bloomLevel: string;
  marks: number;
  sourcePaper: string;
  question: string;
  options: Option[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: {
    whyCorrect: string;
    trapWarning: string;
    examTip: string;
    peerAccuracy: {
      correctPct: number;
      distractorStats: { [key: string]: number };
    };
  };
}

export interface Unit {
  id: number;
  number: number;
  title: string;
  topics: string[];
  totalQuestions: number;
  completedQuestions: number;
  masteryPercentage: number;
  accuracyPercentage: number;
  status: 'Strong' | 'Needs Practice' | 'On Track';
  weightageMarks: number;
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  branch: string;
  scheme: string;
  unitsCount: number;
  totalMCQs: number;
  completedCount: number;
  masteredCount: number;
  accuracyPercentage: number;
  statusBadge: string;
  lastActive: string;
  units: Unit[];
}

export interface UserStats {
  name: string;
  avatarUrl: string;
  branch: string;
  year: string;
  streakDays: number;
  solvedMCQs: number;
  attemptedMCQs: number;
  targetMCQs: number;
  correctAnswers: number;
  overallAccuracy: number;
  weeklyGrowth: number;
  targetExam: string;
  email?: string;
  authProvider?: 'google' | 'email';
}

export interface UserAccount {
  id: string;
  name: string;
  emailOrEnrollment: string;
  branch: string;
  year: string;
  avatarUrl: string;
  authProvider: 'google' | 'email';
  createdAt: string;
  userStats: UserStats;
  subjects: Subject[];
  answerHistory: Record<string, { selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  suggestedAction?: string;
  reactions?: { helpful?: boolean; copied?: boolean };
}

export type AppScreen = 
  | 'dashboard'
  | 'units'
  | 'practice'
  | 'review'
  | 'completed'
  | 'progress'
  | 'ai-tutor'
  | 'landing';

export const ASSETS = {
  LOGO: 'https://lh3.googleusercontent.com/aida/AEtjO1V-GHfXSTj9jEg5yvLYMIT7lklqUi8iq4GeyuVlYlvEoWqL_iS-iVzMeTrq_JgQmDmYlIY1cfpvja-0WZ3TLxHE1JKF_0MOh5SKU1e5OUxeWAEOZOYvr9NpprjHCDVSDH2cNKQ1AmBV1wL4ysj2RWHcxuESb6iyWKoNHZYy7oTbJs4KZ-mM8snaOG4gD1s1Qbm_5lpu8Qqb9J_LniR_27_Ag-sVRNkZn1ufkBazfMtFWlguIvaS4PP_Ias',
  AVATAR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTN05U3XOdXsNgEwwzk_BGdgtlCmjVROULRIYiR2hT7tKk2yuDfoQmjSomfpvKZotu6kRNNKEgd0PW2kJmAZtDp2lQN8OpybDMlOhzklY4lgZ-9xVBTjbyVF_7UeWrwqXO-U-TuvLyt7ObVaSAn4BWCJH05R6b6e50mJNLcFaByp_2UYpscuu9lNuAxTdhou1VV0vapnXRhpvwuoR7RWa512SLuYiDYxsIp8TBPEqx8pszpO6Xyqq',
  DIAGRAM: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK-7WomBYUU-hLuFvK2LDdT7w1yF3vDUrHVYJHVJ4u2hjrFoxA0V9YaVmBaOKpCVJ_t6D4smxv-WJZ55x3Xz5JrFN0iTqXCDCYiRpFMRWx3yoxfL0E7Sr03RTAE0I1Qo2ohrRLv3Hg0LGZdbxJwnbR42DKD5onJSPXrxkF9hZAekxAyO5TqiZ8SY84knZken2_kYCx3lSgx0Fr6l3tk3Hfh32s6WUTlnpX3ChMfJ1ntD1DOhhY9ZXy',
};
