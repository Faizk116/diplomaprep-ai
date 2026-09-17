import React from 'react';
import { Subject, UserStats, AppScreen } from '../types';
import { 
  ArrowRight, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  BookMarked, 
  Layers, 
  Zap, 
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface DashboardViewProps {
  subjects: Subject[];
  userStats: UserStats;
  onNavigate: (screen: AppScreen) => void;
  onStartPractice: (subjectId: string, unitId?: number) => void;
  onOpenSyllabusModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subjects,
  userStats,
  onNavigate,
  onStartPractice,
  onOpenSyllabusModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                MSBTE 'I' Scheme Curriculum AI Platform
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display">
                Hi, {userStats.name} 👋 Ready to ace your upcoming TY Diploma exams?
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100/90 max-w-2xl">
                Practice verified MSBTE question sets, review high-yield concepts with your 24/7 AI tutor, and track topic-level board exam readiness.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-xs text-white">
                <span>Target Exam: <strong className="text-amber-300">Summer 2025</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Quick Notification / Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Targeted MCQs Engineered for High MSBTE GPAs
              </p>
              <p className="text-xs text-slate-500">
                Based on winter/summer question trends, model answer schemes, and Bloom's cognitive taxonomy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenSyllabusModal}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              View Syllabus Map
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className="px-3.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section: What do you want to study today? */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">What do you want to study today?</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {subjects.length} Active Enrolled Modules
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Targeted MCQs engineered from the latest MSBTE model answer papers and pattern rubrics.
            </p>
          </div>
        </div>

        {/* Enrolled Modules Grid (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-sm font-display">
                      {subj.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Sub: {subj.code}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {subj.branch}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-display hover:text-blue-600 transition-colors">
                        {subj.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                    {subj.unitsCount} Units • {subj.totalMCQs} MCQs
                  </span>
                </div>

                {/* Interactive Syllabus Units List */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Units &amp; Chapters ({subj.units.length})
                    </span>
                    <span className="text-[11px] text-blue-600 font-normal">Click unit to launch</span>
                  </div>
                  <div className="space-y-1.5">
                    {subj.units.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartPractice(subj.id, u.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-between group ${
                          u.status === 'Needs Practice'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100 hover:border-rose-300'
                            : 'bg-slate-50/70 border-slate-200/90 text-slate-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900'
                        }`}
                        title={`Start Unit ${u.number}: ${u.title}`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 group-hover:border-blue-300 group-hover:text-blue-600 shrink-0">
                            U{u.number}
                          </span>
                          <span className="truncate">{u.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-600">
                            {u.accuracyPercentage}%
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar & Stats */}
                <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 mb-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      Module Mastery
                    </span>
                    <span className="font-bold text-slate-800">
                      {subj.completedCount} / 250 mastered ({subj.accuracyPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subj.accuracyPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Units on track: {subj.units.filter(u => u.status !== 'Needs Practice').length} / {subj.units.length}</span>
                    <span className="text-emerald-700 font-semibold">{subj.statusBadge}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-500 gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last active {subj.lastActive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartPractice(subj.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <span>All Units</span>
                  </button>
                  <button
                    onClick={() => onStartPractice(subj.id, subj.units[0]?.id || 1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Learning Performance Matrix */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">Learning Performance Matrix</h2>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Stat 1 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Questions Attempted</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-display">
                  {userStats.attemptedMCQs}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Across 10 distinct units
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookMarked className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Correct Answers</p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-1 font-display">
                  {userStats.correctAnswers}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  First-attempt accuracy
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Overall Accuracy</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-display">
                  {userStats.overallAccuracy}%
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">+{userStats.weeklyGrowth}% this week</span>
                  <span className="text-slate-300">•</span>
                  <span>MSBTE target: &gt;70%</span>
                </p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Topics Needing Attention Diagnostic */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Topics Needing Attention
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted review based on your recent MCQ mistake patterns in MSBTE papers.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              High Yield for Board Exam
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Management (22509)</span>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    52% Accuracy
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Unit 2: Planning & Decision Making</h4>
                <p className="text-xs text-slate-500 mt-1">
                  18 questions missed in past sessions. Tricky distinctions between Strategic vs Operational plans.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Est. 8 mins (15 MCQs)
                </span>
                <button
                  onClick={() => onStartPractice('man-22509', 2)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Practice Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Topic 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Environmental Studies (22447)</span>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    59% Accuracy
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Unit 3: Environmental Pollution</h4>
                <p className="text-xs text-slate-500 mt-1">
                  14 questions missed. Needs recall on Air & Water Act penalty standards and E-waste rules.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Est. 10 mins (20 MCQs)
                </span>
                <button
                  onClick={() => onStartPractice('est-22447', 3)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Practice Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Step-by-Step AI Breakdown</h4>
              <p className="text-xs text-slate-500 mt-1">
                Learn why options are right or wrong with contextual engineering examples and high-yield board exam tips.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Exam Mode Simulation</h4>
              <p className="text-xs text-slate-500 mt-1">
                Timed tests that mirror actual MSBTE online exam software interface, keyboard shortcuts, and question grids.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>DiplomaPrep AI • Dedicated exam preparation portal for Maharashtra State Board of Technical Education (MSBTE) students.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2 font-medium text-slate-600">
          <button onClick={onOpenSyllabusModal} className="hover:text-blue-600">Syllabus Map</button>
          <span>•</span>
          <button onClick={() => onNavigate('units')} className="hover:text-blue-600">Management (22509)</button>
          <span>•</span>
          <button onClick={() => onNavigate('units')} className="hover:text-blue-600">Environmental Studies (22447)</button>
          <span>•</span>
          <button onClick={() => onNavigate('ai-tutor')} className="hover:text-blue-600">AI Tutor Assistant</button>
        </div>
      </footer>
    </div>
  );
};
