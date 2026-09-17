import React, { useState, useEffect } from 'react';
import { AppScreen, Subject, Question, UserStats, UserAccount, ASSETS } from './types';
import { MOCK_SUBJECTS, MOCK_QUESTIONS, MOCK_USER_STATS, createFreshSubjects } from './data/mockData';
import { authService, curriculumService, sessionService, questionsService, FinishSessionResponse } from './api/services';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UnitsView } from './components/UnitsView';
import { PracticeView } from './components/PracticeView';
import { ReviewView } from './components/ReviewView';
import { CompletedView } from './components/CompletedView';
import { ProgressView } from './components/ProgressView';
import { AITutorView } from './components/AITutorView';
import { LandingView } from './components/LandingView';
import { SyllabusModal } from './components/SyllabusModal';
import { AuthModal, AuthSuccessData } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sparkles, X, Loader2 } from 'lucide-react';


const INITIAL_USER_STATS: UserStats = {
  name: 'MSBTE Student',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Student&backgroundColor=2563eb&textColor=ffffff',
  branch: 'Computer / IT Engineering',
  year: 'TY Diploma',
  streakDays: 1,
  solvedMCQs: 0,
  attemptedMCQs: 0,
  targetMCQs: 1000,
  correctAnswers: 0,
  overallAccuracy: 0,
  weeklyGrowth: 0,
  targetExam: 'Summer 2025',
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled React Render Error Caught by Boundary:', error, errorInfo);
  }

  render() {
    const instance = this as any;
    if (instance.state?.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Dashboard Navigation Recovery</h3>
            <p className="text-xs text-slate-300 mb-6">
              A temporary UI error occurred during screen transition. Click below to safely restore your dashboard view.
            </p>
            <button
              onClick={() => {
                instance.setState({ hasError: false, error: null });
                instance.props.onReset();
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return instance.props.children;
  }
}



export default function App() {
  // Saved accounts and active user
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  // Authentication & Navigation State
  const initialToken = Boolean(localStorage.getItem('diplomaprep_token'));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialToken);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(initialToken ? 'dashboard' : 'landing');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [welcomeNotification, setWelcomeNotification] = useState<{
    name: string;
    email: string;
    authProvider: 'google' | 'email';
    isNew: boolean;
  } | null>(null);

  // Subject and Unit Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('man-22509');
  const [selectedUnitId, setSelectedUnitId] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Practice & Session State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionFinishData, setSessionFinishData] = useState<FinishSessionResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [answerHistory, setAnswerHistory] = useState<Record<string, { selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>>({});

  // Modal State
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(false);

  // Boot initialization: fetch real subjects & authenticated user from SQLite API
  useEffect(() => {
    async function bootApp() {
      try {
        setIsAppLoading(true);

        // 1. Fetch subjects from SQLite backend database
        try {
          const fetchedSubjects = await curriculumService.getSubjects();
          if (fetchedSubjects && fetchedSubjects.length > 0) {
            setSubjects(fetchedSubjects);
          } else {
            setSubjects(MOCK_SUBJECTS);
          }
        } catch (subjErr) {
          console.error('Failed to fetch subjects from backend API:', subjErr);
          setSubjects(MOCK_SUBJECTS);
        }

        // 2. Check authenticated user via JWT token
        const token = localStorage.getItem('diplomaprep_token');
        if (token) {
          const me = await authService.getMe();
          if (me && me.stats) {
            setUserStats(me.stats);
            setIsLoggedIn(true);
            setCurrentScreen('dashboard');
          } else {
            authService.logout();
            setIsLoggedIn(false);
            setCurrentScreen('landing');
          }
        } else {
          setIsLoggedIn(false);
          setCurrentScreen('landing');
        }
      } catch (err) {
        console.warn('Boot authentication check error:', err);
        authService.logout();
        setIsLoggedIn(false);
        setCurrentScreen('landing');
      } finally {
        setIsAppLoading(false);
      }
    }
    bootApp();
  }, []);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0] || MOCK_SUBJECTS[0];
  const activeQuestion = questions[currentQuestionIndex] || questions[0] || MOCK_QUESTIONS[0];


  // Handlers
  const handleStartPractice = async (subjectId: string, unitId?: number, count = 20) => {
    setSelectedSubjectId(subjectId);
    if (unitId !== undefined && unitId !== 0) {
      setSelectedUnitId(unitId);
    } else {
      setSelectedUnitId(0);
    }
    setQuestionCount(count);

    try {
      // Call backend API to initialize session
      const session = await sessionService.startSession({
        subjectId,
        unitId: unitId !== 0 ? unitId : undefined,
        mode: 'practice',
        totalQuestions: count,
      });

      if (session && session.questions && session.questions.length > 0) {
        setActiveSessionId(session.sessionId);
        setQuestions(session.questions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setMarkedForReview({});
        setAnswerHistory({});
        setCurrentScreen('practice');
        return;
      }
    } catch (err) {
      console.error('Failed to start session via API, querying backend database directly:', err);
    }

    // Direct Database Query Fallback
    try {
      const fetchedQuestions = await questionsService.getQuestions({
        subjectId,
        unitId: unitId !== 0 ? unitId : undefined,
        limit: count,
      });
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setMarkedForReview({});
        setAnswerHistory({});
        setCurrentScreen('practice');
        return;
      }
    } catch (qErr) {
      console.error('Failed to fetch questions from database API:', qErr);
    }
  };


  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleToggleMarkReview = (questionId: string) => {
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Sync accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('diplomaprep_accounts_v2', JSON.stringify(accounts));
    } catch (e) {}
  }, [accounts]);

  // Sync active user state to active account in accounts list
  useEffect(() => {
    if (activeAccountId && activeAccountId !== 'demo-pooja') {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === activeAccountId) {
          return {
            ...acc,
            userStats,
            subjects,
            answerHistory,
          };
        }
        return acc;
      }));
    }
  }, [userStats, subjects, answerHistory, activeAccountId]);

  const handleSubmitAnswer = async () => {
    const q = questions[currentQuestionIndex];
    const answer = selectedAnswers[q.id];
    if (!answer) return;

    if (activeSessionId) {
      try {
        const res = await sessionService.submitAnswer(activeSessionId, {
          questionId: q.id,
          selectedOption: answer,
        });

        if (res && res.userStats) {
          setUserStats(res.userStats);
        }

        const newHistory = {
          ...answerHistory,
          [q.id]: { selected: answer, isCorrect: res.isCorrect },
        };
        setAnswerHistory(newHistory);
        setCurrentScreen('review');
        return;
      } catch (err) {
        console.error('Failed to submit answer via API:', err);
      }
    }

    // Local fallback logic
    const isCorrect = answer === q.correctOption;
    const newHistory = {
      ...answerHistory,
      [q.id]: { selected: answer, isCorrect },
    };
    setAnswerHistory(newHistory);

    const newAttempted = userStats.attemptedMCQs + 1;
    const newCorrect = isCorrect ? userStats.correctAnswers + 1 : userStats.correctAnswers;
    const newSolved = userStats.solvedMCQs + 1;
    const newAccuracy = Math.round((newCorrect / newAttempted) * 100);

    const updatedUserStats: UserStats = {
      ...userStats,
      correctAnswers: newCorrect,
      attemptedMCQs: newAttempted,
      solvedMCQs: newSolved,
      overallAccuracy: newAccuracy,
    };
    setUserStats(updatedUserStats);
    setCurrentScreen('review');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentScreen('practice');
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = async () => {
    if (activeSessionId) {
      try {
        const summary = await sessionService.finishSession(activeSessionId);
        setSessionFinishData(summary);
      } catch (err) {
        console.error('Failed to finish session via API:', err);
      }
    }
    setCurrentScreen('completed');
  };

  const handleReviewAnswers = (questionIndex?: number) => {
    if (questionIndex !== undefined) {
      setCurrentQuestionIndex(questionIndex);
    } else {
      setCurrentQuestionIndex(6); // Default to Question 7 if no index provided
    }
    setCurrentScreen('review');
  };

  const handlePracticeWeakTopics = () => {
    // Filter questions that were incorrect
    const weakQuestions = questions.filter(q => {
      const hist = answerHistory[q.id];
      return hist && !hist.isCorrect;
    });
    setQuestions(weakQuestions.length > 0 ? weakQuestions : questions.slice(0, 4));
    setCurrentQuestionIndex(0);
    setCurrentScreen('practice');
  };

  const handleRetakeTest = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setCurrentScreen('practice');
  };

  // Auth Handlers
  const handleSignOut = () => {
    authService.logout();
    setIsLoggedIn(false);
    setIsAuthModalOpen(false);
    setCurrentScreen('landing');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = async (userData: AuthSuccessData) => {
    // Reset local practice and answer session state
    setSelectedAnswers({});
    setMarkedForReview({});
    setAnswerHistory({});
    setCurrentQuestionIndex(0);

    try {
      // Sync user profile & statistics directly from backend DB
      const me = await authService.getMe();
      if (me && me.stats) {
        setUserStats(me.stats);
      }
      const fetchedSubjects = await curriculumService.getSubjects();
      if (fetchedSubjects && fetchedSubjects.length > 0) {
        setSubjects(fetchedSubjects);
      }
    } catch (err) {
      console.warn('Could not sync user profile from API after auth, using payload:', err);
      const freshUserStats: UserStats = {
        name: userData.name,
        avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=2563eb&textColor=ffffff`,
        branch: userData.branch,
        year: userData.year,
        streakDays: 1,
        solvedMCQs: 0,
        attemptedMCQs: 0,
        targetMCQs: 1000,
        correctAnswers: 0,
        overallAccuracy: 0,
        weeklyGrowth: 0,
        targetExam: 'Summer 2025',
        email: userData.emailOrEnrollment,
        authProvider: userData.authProvider,
      };
      setUserStats(freshUserStats);
    }

    if (userData.isNewAccount) {
      setWelcomeNotification({
        name: userData.name,
        email: userData.emailOrEnrollment,
        authProvider: userData.authProvider,
        isNew: true,
      });
    }

    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    setCurrentScreen('dashboard');
  };

  // If on landing screen, show clean dedicated landing page without app header
  if (currentScreen === 'landing') {
    return (
      <>
        <LandingView
          onStart={() => {
            if (!isLoggedIn) {
              handleOpenAuth('signup');
            } else {
              setCurrentScreen('dashboard');
            }
          }}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenAuth={handleOpenAuth}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          savedAccounts={accounts.map(a => ({
            name: a.name,
            emailOrEnrollment: a.emailOrEnrollment,
            branch: a.branch,
            authProvider: a.authProvider,
          }))}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Calculate session score for review view
  const answersList = Object.values(answerHistory) as Array<{ selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
  const correctCount = answersList.filter(a => a.isCorrect).length;
  const sessionScore = {
    correct: correctCount,
    totalAnswered: answersList.length,
  };

  return (
    <ErrorBoundary onReset={() => setCurrentScreen('dashboard')}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
        {/* Universal App Header (except for practice mode to maximize focus, or include lightweight bar) */}
        {currentScreen !== 'practice' && (
          <Header
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            userStats={userStats}
            isLoggedIn={isLoggedIn}
            onSignOut={handleSignOut}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* Account Created or Logged In Welcome Banner */}
        {welcomeNotification && currentScreen === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2">
                    <span>Welcome, {welcomeNotification.name}!</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-semibold">
                      {welcomeNotification.authProvider === 'google' ? 'Google Account Connected' : 'MSBTE Student Account Created'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    Your new student profile is ready with 0 solved MCQs. Select a subject unit below to start practicing!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWelcomeNotification(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen Views */}
        <main>
          {currentScreen === 'dashboard' && (
            <DashboardView
              subjects={subjects}
              userStats={userStats}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onStartPractice={(subjectId, unitId) => {
                if (unitId) {
                  handleStartPractice(subjectId, unitId);
                } else {
                  setSelectedSubjectId(subjectId);
                  setCurrentScreen('units');
                }
              }}
              onOpenSyllabusModal={() => setIsSyllabusOpen(true)}
            />
          )}

          {currentScreen === 'units' && (
            <UnitsView
              subject={selectedSubject}
              initialUnitId={selectedUnitId !== 0 ? selectedUnitId : undefined}
              onBack={() => setCurrentScreen('dashboard')}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onStartPractice={(unitId, count) => handleStartPractice(selectedSubject.id, unitId, count)}
            />
          )}

          {currentScreen === 'practice' && (
            <PracticeView
              subject={selectedSubject}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              selectedAnswers={selectedAnswers}
              markedForReview={markedForReview}
              onSelectOption={handleSelectOption}
              onToggleMarkReview={handleToggleMarkReview}
              onNavigateQuestion={(idx) => setCurrentQuestionIndex(idx)}
              onSubmitAnswer={handleSubmitAnswer}
              onFinishTest={handleFinishTest}
              onExit={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'review' && (
            <ReviewView
              subject={selectedSubject}
              question={activeQuestion}
              userAnswer={selectedAnswers[activeQuestion.id] || answerHistory[activeQuestion.id]?.selected || 'B'}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              sessionScore={sessionScore}
              onNextQuestion={handleNextQuestion}
              onAskAITutor={() => setCurrentScreen('ai-tutor')}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectQuestionIndex={(idx) => {
                setCurrentQuestionIndex(idx);
              }}
              answerHistory={answerHistory}
            />
          )}

          {currentScreen === 'completed' && (
            <CompletedView
              score={sessionFinishData?.finalScore ?? sessionScore.correct}
              total={sessionFinishData?.totalQuestions ?? (questions.length || 20)}
              subjectTitle={selectedSubject.title}
              unitName={selectedSubject.units?.find(u => u.id === selectedUnitId)?.title || activeQuestion?.unitName}
              questions={questions}
              answerHistory={answerHistory}
              aiRecommendation={sessionFinishData?.aiRecommendation}
              weakAreas={sessionFinishData?.weakAreas}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onReviewAnswers={handleReviewAnswers}
              onPracticeWeakTopics={handlePracticeWeakTopics}
              onRetakeTest={handleRetakeTest}
            />
          )}

          {currentScreen === 'progress' && (
            <ProgressView
              subjects={subjects}
              userStats={userStats}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onStartPractice={(subjectId, unitId) => handleStartPractice(subjectId, unitId)}
              onSelectSubject={(subjectId) => {
                setSelectedSubjectId(subjectId);
                setCurrentScreen('units');
              }}
            />
          )}

          {currentScreen === 'ai-tutor' && (
            <AITutorView
              subject={selectedSubject}
              activeQuestion={activeQuestion}
              onReturnToMCQ={() => setCurrentScreen('review')}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}
        </main>

        {/* Syllabus Blueprint Modal */}
        <SyllabusModal
          isOpen={isSyllabusOpen}
          onClose={() => setIsSyllabusOpen(false)}
          subjects={subjects}
        />

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />

        {/* Authentication Modal (Sign In / Sign Up) */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          savedAccounts={accounts.map(a => ({
            name: a.name,
            emailOrEnrollment: a.emailOrEnrollment,
            branch: a.branch,
            authProvider: a.authProvider,
          }))}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </ErrorBoundary>
  );
}

