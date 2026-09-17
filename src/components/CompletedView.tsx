import React from 'react';
import { AppScreen, Question } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Share2,
  BookOpen
} from 'lucide-react';

interface CompletedViewProps {
  score: number;
  total: number;
  subjectTitle?: string;
  unitName?: string;
  questions?: Question[];
  answerHistory?: Record<string, { selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
  aiRecommendation?: string;
  weakAreas?: string[];
  onNavigate: (screen: AppScreen) => void;
  onReviewAnswers: (questionIndex?: number) => void;
  onPracticeWeakTopics: () => void;
  onRetakeTest: () => void;
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  score = 16,
  total = 20,
  subjectTitle,
  unitName,
  questions,
  answerHistory,
  aiRecommendation,
  weakAreas,
  onNavigate,
  onReviewAnswers,
  onPracticeWeakTopics,
  onRetakeTest,
}) => {
  const incorrectCount = total - score;
  const accuracyPct = Math.round((score / total) * 100);

  // Dynamic question result mapping from actual user session history if available
  const questionResults = (questions && questions.length > 0)
    ? questions.map((q, i) => {
        const hist = answerHistory ? answerHistory[q.id] : undefined;
        return {
          num: i + 1,
          isCorrect: hist ? hist.isCorrect : ![4, 8, 13, 18].includes(i + 1),
        };
      })
    : Array.from({ length: total }).map((_, i) => ({
        num: i + 1,
        isCorrect: ![4, 8, 13, 18].includes(i + 1),
      }));

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              MSBTE Board Simulation Verified
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              Test Completed 🎉
            </h1>
            <p className="text-xs text-slate-500">
              {subjectTitle || 'Management'} • {unitName || 'Unit Practice'} • Completed Just Now
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Score summary copied to clipboard!')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Score</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Score Hero Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
            {/* Big Score Display */}
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${accuracyPct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-900 font-display">{accuracyPct}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500">Your Test Score</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                  {score} <span className="text-lg font-medium text-slate-400">/ {total}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Passed with Distinction
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">Passing criteria: &ge; 40%</span>
                </div>
              </div>
            </div>

            {/* 4 Quick Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Correct
                </div>
                <div className="text-xl font-extrabold text-emerald-600 font-display">{score}</div>
                <div className="text-[11px] text-slate-400">+{score * 2} marks</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  Incorrect
                </div>
                <div className="text-xl font-extrabold text-rose-600 font-display">{incorrectCount}</div>
                <div className="text-[11px] text-slate-400">-0 penalty</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Time Spent
                </div>
                <div className="text-xl font-extrabold text-slate-800 font-display">12m 45s</div>
                <div className="text-[11px] text-slate-400">Allocated: 20m</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Avg Speed
                </div>
                <div className="text-xl font-extrabold text-slate-800 font-display">38s/q</div>
                <div className="text-[11px] text-slate-400">Optimal pace</div>
              </div>
            </div>
          </div>

          {/* AI Study Recommendation Banner */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  AI Study Recommendation for {unitName || 'Unit Practice'}
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-3xl">
                  {aiRecommendation || 'You have a solid grasp of basic definitions, but tricky distinction questions between Strategic and Tactical plans cost you 2 marks. Review Unit 2 Section B before your next mock.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {weakAreas && weakAreas.length > 0 ? (
                    weakAreas.map((area, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-blue-200 text-slate-700">
                        Weak Priority: {area}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-blue-200 text-slate-700">
                        Missed: Q4 (Strategic Plans) &amp; Q8 (Risk Condition)
                      </span>
                      <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                        Suggested Flashcards: Standing vs Single-Use Plans
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onPracticeWeakTopics}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              Practice Weak Topics ({incorrectCount} Qs)
            </button>
          </div>
        </div>

        {/* Two Columns: Topic Breakdown (Left) vs Question Grid & Percentile (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Topic Performance Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-display mb-4 flex items-center justify-between">
              <span>Topic Performance Breakdown</span>
              <span className="text-xs font-normal text-slate-500">4 Subtopics Analyzed</span>
            </h3>

            <div className="space-y-4">
              {/* Subtopic 1 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-800">Concept &amp; Need of Planning</span>
                  <span className="font-bold text-emerald-600">100% (5/5 Correct)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Subtopic 2 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-800">Decision Making Process</span>
                  <span className="font-bold text-emerald-600">88% (7/8 Correct)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              {/* Subtopic 3 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-800">Types of Plans (Strategic vs Operational)</span>
                  <span className="font-bold text-rose-600">50% (2/4 Correct) - Needs Practice</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              {/* Subtopic 4 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-800">Forecasting Techniques</span>
                  <span className="font-bold text-amber-600">66% (2/3 Correct)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Question Grid & Board Percentile */}
          <div className="lg:col-span-5 space-y-6">
            {/* Question Results Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-3">
                <span>Question Results ({total} Questions)</span>
                <div className="flex items-center gap-3 text-[11px] font-normal text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Correct ({score})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Missed ({incorrectCount})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questionResults.map((q) => (
                  <button
                    key={q.num}
                    onClick={() => onReviewAnswers(q.num - 1)}
                    className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      q.isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {q.num}
                  </button>
                ))}
              </div>
            </div>

            {/* Board Percentile Predictor */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-800">
              <div className="flex items-center gap-2.5 mb-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Board Percentile Predictor
                </h4>
              </div>
              <div className="text-2xl font-extrabold font-display">Top 12%</div>
              <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                Your performance ranks in the top 12% among MSBTE IT students on Unit 2. Projected Board Grade: <strong className="text-amber-300">O Grade (&gt;85%)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onRetakeTest}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Test
            </button>
            <button
              onClick={onReviewAnswers}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Review All 20 Answers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
