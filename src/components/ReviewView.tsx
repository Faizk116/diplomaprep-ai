import React from 'react';
import { Question, AppScreen, Subject } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ArrowRight, 
  Bookmark, 
  HelpCircle, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Flag,
  Share2,
  BookOpen
} from 'lucide-react';

interface ReviewViewProps {
  subject?: Subject;
  question: Question;
  userAnswer?: 'A' | 'B' | 'C' | 'D';
  questionIndex: number;
  totalQuestions: number;
  sessionScore: { correct: number; totalAnswered: number };
  onNextQuestion: () => void;
  onAskAITutor: () => void;
  onNavigate: (screen: AppScreen) => void;
  onSelectQuestionIndex: (idx: number) => void;
  answerHistory: Record<string, { selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  subject,
  question,
  userAnswer = 'B', // Default to B for preview matching screenshot if not chosen
  questionIndex,
  totalQuestions,
  sessionScore,
  onNextQuestion,
  onAskAITutor,
  onNavigate,
  onSelectQuestionIndex,
  answerHistory,
}) => {
  const isCorrect = userAnswer === question.correctOption;

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      {/* Top Breadcrumb & Session Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              <span>MSBTE DIPLOMA</span>
              <span>/</span>
              <span>COMPUTER &amp; IT</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">
                {subject ? `${subject.title.toUpperCase()} (${subject.code})` : (question.code.includes('22447') ? 'ENVIRONMENTAL STUDIES (22447)' : 'MANAGEMENT (22509)')}
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 mt-0.5">
              {question.unitName} • <span className="text-slate-500 font-normal">Topic: {question.topic}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
              Progress: <strong className="text-slate-900">Q {String(questionIndex + 1).padStart(2, '0')} / {totalQuestions}</strong>
            </div>
            <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
              Session Score: <strong>{sessionScore.correct} / {sessionScore.totalAnswered} ({Math.round((sessionScore.correct / Math.max(1, sessionScore.totalAnswered)) * 100)}%)</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Evaluation Banner */}
        <div
          className={`rounded-2xl p-4 sm:p-5 mb-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-sm font-extrabold flex items-center gap-2">
                <span>{isCorrect ? 'Correct! +2 Marks Awarded' : 'Incorrect Submission • 0 Marks Awarded'}</span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                Your response: <strong>Option {userAnswer} ({question.options.find(o => o.id === userAnswer)?.text || 'Selected'})</strong>
                {!isCorrect && (
                  <span> • Correct: <strong className="text-emerald-700">Option {question.correctOption} ({question.options.find(o => o.id === question.correctOption)?.text})</strong></span>
                )}
                <span> • Time: 28s</span>
              </p>
            </div>
          </div>

          <button
            onClick={onAskAITutor}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-500/20 hover:shadow-md transition-all flex items-center gap-2 shrink-0 justify-center"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor Follow-up</span>
          </button>
        </div>

        {/* Two-Column Grid: Question & Options (Left) vs AI Explanation & Stats (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Question & Evaluated Options) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {question.code}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">Bloom: {question.bloomLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <button className="hover:text-slate-700" title="Bookmark Question">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="hover:text-slate-700" title="Report issue">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stem */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-display mb-6">
                {question.question}
              </h2>

              {/* Evaluated Options */}
              <div className="space-y-3">
                {question.options.map((opt) => {
                  const isAnswerSelected = userAnswer === opt.id;
                  const isAnswerCorrect = question.correctOption === opt.id;

                  let borderClass = 'border-slate-200 bg-white text-slate-800';
                  let badge = null;

                  if (isAnswerCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500';
                    badge = (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct Answer
                      </span>
                    );
                  } else if (isAnswerSelected && !isAnswerCorrect) {
                    borderClass = 'border-rose-400 bg-rose-50/70 text-rose-950 font-medium ring-1 ring-rose-400';
                    badge = (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        Your Selection
                      </span>
                    );
                  } else {
                    borderClass = 'border-slate-200 bg-slate-50/50 text-slate-600 opacity-75';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${borderClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAnswerCorrect
                              ? 'bg-emerald-600 text-white'
                              : isAnswerSelected
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{opt.text}</div>
                          {opt.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                          )}
                        </div>
                      </div>
                      {badge}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={onAskAITutor}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>Ask AI Tutor Follow-up</span>
                </button>

                <button
                  onClick={onNextQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (AI Tutor Explanation & Rubric) */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Explanation Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Tutor Explanation</h3>
                  <p className="text-[11px] text-slate-500">MSBTE Model Answer Syllabus Rubric</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Why Option {question.correctOption} is Correct:
                  </h4>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                    {question.explanation.whyCorrect}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    MSBTE Trap to Avoid:
                  </h4>
                  <p className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-amber-900">
                    {question.explanation.trapWarning}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                    High-Yield Exam Tip:
                  </h4>
                  <p className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/80 text-blue-900">
                    {question.explanation.examTip}
                  </p>
                </div>
              </div>

              {/* Peer Statistics */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    MSBTE Peer Accuracy
                  </span>
                  <strong className="text-emerald-600 font-bold">
                    {question.explanation.peerAccuracy.correctPct}% Correct
                  </strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-2"
                    style={{ width: `${question.explanation.peerAccuracy.correctPct}%` }}
                    title={`Correct: ${question.explanation.peerAccuracy.correctPct}%`}
                  />
                  <div
                    className="bg-rose-400 h-2"
                    style={{ width: `${question.explanation.peerAccuracy.distractorStats['B'] || 10}%` }}
                    title="Selected Option B"
                  />
                  <div
                    className="bg-slate-300 h-2"
                    style={{ width: `${question.explanation.peerAccuracy.distractorStats['C'] || 5}%` }}
                    title="Other options"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                  <span>82% Option A</span>
                  <span>11% Option B</span>
                  <span>5% Option C</span>
                  <span>2% Option D</span>
                </div>
              </div>
            </div>

            {/* Test Navigator Grid */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-3">
                <span>Test Navigator ({totalQuestions} Questions)</span>
                <button
                  onClick={() => onNavigate('completed')}
                  className="text-blue-600 hover:text-blue-800 text-[11px]"
                >
                  View Summary
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const isCurrent = idx === questionIndex;
                  const answersList = Object.values(answerHistory) as Array<{ selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
                  const item = answersList[idx];
                  let colorClass = 'bg-slate-100 text-slate-600';

                  if (isCurrent) {
                    colorClass = 'ring-2 ring-blue-500 font-bold bg-blue-100 text-blue-800';
                  } else if (item) {
                    colorClass = item.isCorrect ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-rose-100 text-rose-800 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectQuestionIndex(idx)}
                      className={`h-8 rounded-lg text-xs flex items-center justify-center transition-all ${colorClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
