import React, { useState, useEffect } from 'react';
import { Question, Subject } from '../types';
import { 
  Clock, 
  Flag, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Keyboard, 
  HelpCircle
} from 'lucide-react';

interface PracticeViewProps {
  subject?: Subject;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  markedForReview: Record<string, boolean>;
  onSelectOption: (questionId: string, option: 'A' | 'B' | 'C' | 'D') => void;
  onToggleMarkReview: (questionId: string) => void;
  onNavigateQuestion: (index: number) => void;
  onSubmitAnswer: () => void;
  onFinishTest: () => void;
  onExit: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  subject,
  questions,
  currentQuestionIndex,
  selectedAnswers,
  markedForReview,
  onSelectOption,
  onToggleMarkReview,
  onNavigateQuestion,
  onSubmitAnswer,
  onFinishTest,
  onExit,
}) => {
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = selectedAnswers[currentQ.id];
  const isMarked = markedForReview[currentQ.id];

  // Timer state: 15 minutes (900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(859); // 14:19 as in screenshot

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcut listener for A, B, C, D, 1, 2, 3, 4, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        onSelectOption(currentQ.id, key as 'A' | 'B' | 'C' | 'D');
      } else if (key === '1') onSelectOption(currentQ.id, 'A');
      else if (key === '2') onSelectOption(currentQ.id, 'B');
      else if (key === '3') onSelectOption(currentQ.id, 'C');
      else if (key === '4') onSelectOption(currentQ.id, 'D');
      else if (e.key === 'Enter' && selectedOption) {
        onSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ.id, selectedOption, onSelectOption, onSubmitAnswer]);

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Test Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                MSBTE {subject?.code || (currentQ.code.includes('22447') ? '22447' : '22509')} • {subject?.title || (currentQ.code.includes('22447') ? 'Environmental Studies' : 'Management')}
              </span>
              <span>&gt;</span>
              <span className="text-blue-600 font-medium">{currentQ.unitName}</span>
            </div>

            {/* Status indicators & Exit */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Timer Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{formatTimer(secondsRemaining)} remaining</span>
              </div>

              {/* Mark for review */}
              <button
                onClick={() => onToggleMarkReview(currentQ.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  isMarked
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                <span>{isMarked ? 'Marked' : 'Mark for Review'}</span>
              </button>

              {/* Exit Practice */}
              <button
                onClick={onExit}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Exit Practice"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Q {currentQuestionIndex + 1} / {questions.length} ({progressPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                Question {String(currentQuestionIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Topic: <strong className="text-slate-700">{currentQ.topic}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                +{currentQ.marks} Marks
              </span>
              <span>•</span>
              <span className="text-slate-400">{currentQ.sourcePaper}</span>
            </div>
          </div>

          {/* Question Stem */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-display mb-6">
            {currentQ.question}
          </h2>

          {/* Options List */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectOption(currentQ.id, opt.id)}
                  className={`cursor-pointer rounded-xl p-4 transition-all duration-150 border flex items-start gap-4 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Option Letter Tag */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </div>

                  {/* Option Text & Description */}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {opt.text}
                    </div>
                    {opt.description && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions inside Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts: <strong>1-4</strong> or <strong>A-D</strong>, <strong>Enter</strong> to submit</span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigateQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button
                onClick={onSubmitAnswer}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-sm shadow-blue-500/20 disabled:shadow-none hover:shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Strip: Question Navigator & Concept Radar */}
      <div className="bg-white border-t border-slate-200 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Question Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-600 shrink-0 mr-1">Questions:</span>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const hasAnswered = !!selectedAnswers[q.id];
              const isMarkedReview = !!markedForReview[q.id];

              let bgClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
              if (isCurrent) {
                bgClass = 'bg-blue-600 text-white ring-2 ring-blue-400 font-bold';
              } else if (isMarkedReview) {
                bgClass = 'bg-amber-100 text-amber-800 border border-amber-300';
              } else if (hasAnswered) {
                bgClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onNavigateQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center shrink-0 transition-all ${bgClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* AI Concept Radar */}
          <div className="hidden lg:flex items-center gap-3 bg-blue-50/70 border border-blue-200/80 px-4 py-2 rounded-xl text-xs text-blue-900 shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-semibold">AI Concept Radar: </span>
              <span>Pooja, your accuracy on Unit 2 Planning is <strong>82%</strong>. Solid work! Avg. Speed: 24s/MCQ</span>
            </div>
          </div>

          {/* Finish Test Button */}
          <button
            onClick={onFinishTest}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            Finish &amp; View Summary
          </button>
        </div>
      </div>
    </div>
  );
};
