import React, { useState } from 'react';
import { Subject, Unit, AppScreen } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Play, 
  Award, 
  Sliders, 
  Zap,
  BookOpen
} from 'lucide-react';

interface UnitsViewProps {
  subject: Subject;
  initialUnitId?: number;
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
  onStartPractice: (unitId: number, count: number) => void;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  subject,
  initialUnitId,
  onBack,
  onStartPractice,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(() => {
    if (initialUnitId && subject.units.some(u => u.id === initialUnitId)) {
      return initialUnitId;
    }
    const needsPractice = subject.units.find(u => u.status === 'Needs Practice');
    return needsPractice ? needsPractice.id : (subject.units[0]?.id || 1);
  });
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Sync selectedUnitId if subject changes
  React.useEffect(() => {
    if (initialUnitId && subject.units.some(u => u.id === initialUnitId)) {
      setSelectedUnitId(initialUnitId);
    } else {
      const needsPractice = subject.units.find(u => u.status === 'Needs Practice');
      setSelectedUnitId(needsPractice ? needsPractice.id : (subject.units[0]?.id || 1));
    }
  }, [subject.id, initialUnitId]);

  const selectedUnit = subject.units.find(u => u.id === selectedUnitId) || subject.units[0];

  const getStatusBadge = (status: Unit['status']) => {
    switch (status) {
      case 'Strong':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Strong
          </span>
        );
      case 'Needs Practice':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Needs Practice
          </span>
        );
      case 'On Track':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <TrendingUp className="w-3 h-3" />
            On Track
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-32">
      {/* Top Header Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>MSBTE</span>
            <span>•</span>
            <span>SEM V</span>
            <span>•</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              CODE: {subject.code}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Subject Overview Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Compulsory Theory & MCQ • I-Scheme Syllabus 2024-25
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                {subject.title} ({subject.code})
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {subject.code === '22447'
                  ? '5 curriculum units covering ecosystems, natural resources, environmental pollution control acts, and sustainable development.'
                  : '5 curriculum units covering principles of management, organizational structures, quality standards, and board exam patterns.'}
              </p>
            </div>

            {/* Overall Mastery Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 min-w-[240px]">
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                <span>Overall Mastery</span>
                <strong className="text-emerald-400 text-sm font-extrabold">{subject.accuracyPercentage}%</strong>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 mb-3 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${subject.accuracyPercentage}%` }} />
              </div>

              {/* Unit Mastery distribution */}
              <div className="flex justify-between items-end gap-1.5 h-10 pt-2 border-t border-white/10">
                {subject.units.map((u, i) => (
                  <div key={u.id} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        u.status === 'Strong'
                          ? 'bg-emerald-400'
                          : u.status === 'Needs Practice'
                          ? 'bg-rose-400'
                          : 'bg-blue-400'
                      }`}
                      style={{ height: `${u.accuracyPercentage * 0.3}px` }}
                    />
                    <span className="text-[9px] text-slate-300">U{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Mock Exam Callout */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Comprehensive Mock Exam (All Units 1-5)</h4>
                <p className="text-xs text-slate-300">Simulate official 70-mark MSBTE semester exam with randomized questions.</p>
              </div>
            </div>
            <button
              onClick={() => onStartPractice(0, 20)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Full Test (20 Qs)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Units List Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">Choose a Unit to Practice</h2>
            <p className="text-xs text-slate-500">Pick a specific chapter to target weak concepts or reinforce test recall.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Total: 5 Units</span>
        </div>

        {/* Units Cards Stack */}
        <div className="space-y-4 mb-8">
          {subject.units.map((unit) => {
            const isSelected = unit.id === selectedUnitId;

            return (
              <div
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/15'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Unit Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base font-display shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      U{unit.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500">Unit {unit.number}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-600">Weightage: {unit.weightageMarks} Marks</span>
                        {getStatusBadge(unit.status)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {unit.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {unit.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Progress & Action */}
                  <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-500">Accuracy & Progress</div>
                      <div className="flex items-center gap-2 justify-end mt-0.5">
                        <span className="text-xs font-bold text-slate-800">
                          {unit.accuracyPercentage}% Acc.
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {unit.completedQuestions}/{unit.totalQuestions} Qs
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUnitId(unit.id);
                        onStartPractice(unit.id, questionCount);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                      }`}
                    >
                      <span>Start Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Practice Launch Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Question Count Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Select Count:</span>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              {[10, 20, 50].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    questionCount === cnt
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Unit Indicator & Launch Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <div className="text-xs font-bold text-slate-800">
                Target: Unit {selectedUnit.number} ({selectedUnit.title.slice(0, 22)}...)
              </div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI Explanations & Model Answers Enabled
              </div>
            </div>

            <button
              onClick={() => onStartPractice(selectedUnit.id, questionCount)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <span>Start Practice ({questionCount} Questions)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
