// Strongly-typed API Services for DiplomaPrep.AI

import { apiClient, setToken, clearToken } from './client';
import { Subject, Question, UserStats, ChatMessage } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  branch?: string;
  year?: string;
  targetScore?: number;
  targetExamDate?: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

export interface SyllabusBlueprint {
  subjectName: string;
  subjectCode: string;
  totalMarks: number;
  timeDuration: string;
  examScheme: {
    mcqCount: number;
    mcqMarks: number;
    theoryCount: number;
    theoryMarks: number;
  };
  bloomWeightage: Array<{
    level: string;
    percentage: number;
    description: string;
    color: string;
  }>;
  units: Array<{
    unitNo: number;
    title: string;
    weightageMarks: number;
    mcqCount: number;
  }>;
}

export interface StartSessionResponse {
  sessionId: string;
  subjectId?: string;
  unitId?: number;
  mode: string;
  totalQuestions: number;
  questions: Question[];
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: Question['explanation'];
  userStats: UserStats;
}

export interface FinishSessionResponse {
  sessionId: string;
  finalScore: number;
  totalQuestions: number;
  accuracy: number;
  timeTakenSeconds: number;
  weakAreas: string[];
  aiRecommendation: string;
}

export interface MomentumPoint {
  day: string;
  accuracyPct: number;
  attempted: number;
}

export interface WeakTopic {
  topic: string;
  unitName: string;
  accuracyPct: number;
  totalAttempted: number;
  priority: 'High' | 'Medium' | 'Low';
}

// ----------------------------------------------------
// Auth Service
// ----------------------------------------------------
export const authService = {
  async signup(data: {
    name: string;
    email?: string;
    emailOrEnrollment?: string;
    password?: string;
    enrollmentNo?: string;
    branch?: string;
    year?: string;
  }): Promise<AuthResponseData> {
    const payload = {
      name: data.name,
      emailOrEnrollment: data.emailOrEnrollment || data.email || data.enrollmentNo || 'student@msbte.edu.in',
      password: data.password || 'password123',
      branch: data.branch || 'Computer / IT Engineering',
      year: data.year || 'TY Diploma',
      authProvider: 'email',
    };
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/signup', payload);
    if (res.data?.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  async signin(data: { identifier?: string; emailOrEnrollment?: string; password?: string }): Promise<AuthResponseData> {
    const payload = {
      emailOrEnrollment: data.emailOrEnrollment || data.identifier || 'MSBTE-2023-IT-0482',
      password: data.password || 'demoPassword123',
    };
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/signin', payload);
    if (res.data?.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  async googleAuth(data: {
    mode: 'signin' | 'signup';
    email: string;
    name: string;
    googleId?: string;
    avatarUrl?: string;
    branch?: string;
    year?: string;
  }): Promise<AuthResponseData> {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/google', data);
    if (res.data?.token) {
      setToken(res.data.token);
    }
    return res.data;
  },


  async getMe(): Promise<{ user: AuthUser; stats: UserStats }> {
    const res = await apiClient.get<ApiResponse<any>>('/user/me');
    const data = res.data;
    if (!data) {
      throw new Error('Empty profile data returned');
    }
    const user: AuthUser = {
      id: data.id || data.user?.id,
      name: data.name || data.user?.name || 'MSBTE Student',
      email: data.emailOrEnrollment || data.email || data.user?.email,
      enrollmentNo: data.emailOrEnrollment || data.user?.enrollmentNo,
      branch: data.branch || data.user?.branch,
      year: data.year || data.user?.year,
    };
    const rawStats = data.userStats || data.stats || {};
    const stats: UserStats = {
      name: user.name,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=2563eb&textColor=ffffff`,
      branch: user.branch || 'Computer / IT Engineering',
      year: user.year || 'TY Diploma',
      streakDays: rawStats.streakDays || 1,
      solvedMCQs: rawStats.solvedMCQs || 0,
      attemptedMCQs: rawStats.attemptedMCQs || 0,
      targetMCQs: rawStats.targetMCQs || 1000,
      correctAnswers: rawStats.correctAnswers || 0,
      overallAccuracy: rawStats.overallAccuracy || 0,
      weeklyGrowth: rawStats.weeklyGrowth || 0,
      targetExam: rawStats.targetExam || 'Summer 2025',
      email: user.email,
    };
    return { user, stats };
  },

  logout(): void {
    clearToken();
  },
};

// ----------------------------------------------------
// Curriculum Service
// ----------------------------------------------------
export const curriculumService = {
  async getSubjects(): Promise<Subject[]> {
    const res = await apiClient.get<ApiResponse<Subject[]>>('/subjects');
    return res.data;
  },

  async getSubjectById(subjectId: string): Promise<Subject> {
    const res = await apiClient.get<ApiResponse<Subject>>(`/subjects/${subjectId}`);
    return res.data;
  },

  async getSyllabusBlueprint(): Promise<SyllabusBlueprint> {
    const res = await apiClient.get<ApiResponse<SyllabusBlueprint>>('/syllabus/blueprint');
    return res.data;
  },
};

// ----------------------------------------------------
// Questions Service
// ----------------------------------------------------
export const questionsService = {
  async getQuestions(params?: { subjectId?: string; unitId?: number; limit?: number }): Promise<Question[]> {
    const query = new URLSearchParams();
    if (params?.subjectId) query.append('subjectId', params.subjectId);
    if (params?.unitId !== undefined) query.append('unitId', params.unitId.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<ApiResponse<Question[]>>(`/questions${queryString}`);
    return res.data;
  },

  async toggleBookmark(questionId: string): Promise<{ questionId: string; isBookmarked: boolean }> {
    const res = await apiClient.post<ApiResponse<{ questionId: string; isBookmarked: boolean }>>(
      `/questions/${questionId}/bookmark`
    );
    return res.data;
  },

  async flagQuestion(questionId: string, reason?: string): Promise<{ questionId: string; isFlagged: boolean }> {
    const res = await apiClient.post<ApiResponse<{ questionId: string; isFlagged: boolean }>>(
      `/questions/${questionId}/flag`,
      { reason }
    );
    return res.data;
  },
};

// ----------------------------------------------------
// Session Service
// ----------------------------------------------------
export const sessionService = {
  async startSession(params: {
    subjectId?: string;
    unitId?: number;
    mode?: string;
    totalQuestions?: number;
  }): Promise<StartSessionResponse> {
    const res = await apiClient.post<ApiResponse<StartSessionResponse>>('/sessions/start', params);
    return res.data;
  },

  async submitAnswer(
    sessionId: string,
    body: { questionId: string; selectedOption: 'A' | 'B' | 'C' | 'D'; timeSpentSeconds?: number }
  ): Promise<SubmitAnswerResponse> {
    const res = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
      `/sessions/${sessionId}/answers`,
      body
    );
    return res.data;
  },

  async toggleReviewFlag(
    sessionId: string,
    body: { questionId: string; isFlagged: boolean }
  ): Promise<{ questionId: string; isFlagged: boolean }> {
    const payload = {
      questionId: body.questionId,
      markedForReview: body.isFlagged,
    };
    const res = await apiClient.patch<ApiResponse<{ questionId: string; isFlagged: boolean }>>(
      `/sessions/${sessionId}/review-flag`,
      payload
    );
    return res.data;
  },

  async finishSession(sessionId: string): Promise<FinishSessionResponse> {
    const res = await apiClient.post<ApiResponse<FinishSessionResponse>>(`/sessions/${sessionId}/finish`);
    return res.data;
  },
};

// ----------------------------------------------------
// Analytics Service
// ----------------------------------------------------
export const analyticsService = {
  async getProgress(): Promise<{ userStats: UserStats; subjects: Subject[] }> {
    const res = await apiClient.get<ApiResponse<{ userStats: UserStats; subjects: Subject[] }>>('/analytics/progress');
    return res.data;
  },

  async getMomentum(): Promise<MomentumPoint[]> {
    const res = await apiClient.get<ApiResponse<MomentumPoint[]>>('/analytics/momentum');
    return res.data;
  },

  async getWeakTopics(): Promise<WeakTopic[]> {
    const res = await apiClient.get<ApiResponse<WeakTopic[]>>('/analytics/weak-topics');
    return res.data;
  },
};

// ----------------------------------------------------
// AI Tutor Service
// ----------------------------------------------------
export const aiTutorService = {
  async sendMessage(
    prompt: string,
    context?: { subjectId?: string; questionId?: string }
  ): Promise<{ responseText: string; suggestions: string[] }> {
    const payload = {
      message: prompt,
      subjectCode: context?.subjectId || '22509',
      questionId: context?.questionId,
    };
    const res = await apiClient.post<ApiResponse<{ responseText: string; suggestions: string[] }>>(
      '/ai-tutor/chat',
      payload
    );
    return res.data;
  },

  async getHistory(): Promise<ChatMessage[]> {
    const res = await apiClient.get<ApiResponse<ChatMessage[]>>('/ai-tutor/history');
    return res.data;
  },

  async resetHistory(): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>('/ai-tutor/reset');
  },
};
