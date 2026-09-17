import React, { useState, useEffect } from 'react';
import { Subject, UserStats, AppScreen } from '../types';
import { analyticsService, WeakTopic, MomentumPoint } from '../api/services';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Clock, 
  Calendar, 
  BarChart2, 
  Award,
  BookOpen,
  Loader2
} from 'lucide-react';

interface ProgressViewProps {
  subjects: Subject[];
  userStats: UserStats;
  onNavigate: (screen: AppScreen) => void;
  onStartPractice: (subjectId: string, unitId: number) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  subjects,
  userStats,
  onNavigate,
  onStartPractice,
}) => {
  const [reportGenerated, setReportGenerated] = useState(false);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [momentum, setMomentum] = useState<MomentumPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const [wt, mom] = await Promise.all([
          analyticsService.getWeakTopics(),
          analyticsService.getMomentum(),
        ]);
        if (isMounted) {
          setWeakTopics(wt);
          setMomentum(mom);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAnalytics();
    return () => { isMounted = false; };
  }, []);

  const coveragePct = userStats.targetMCQs > 0 
    ? Math.min(100, Math.round((userStats.attemptedMCQs / userStats.targetMCQs) * 100))
    : 0;
  const accuracyPct = userStats.attemptedMCQs > 0 
    ? Math.round((userStats.correctAnswers / userStats.attemptedMCQs) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                MSBTE Winter 2025 Analytics Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Learning Progress &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time diagnostic telemetry across all enrolled MSBTE I-Scheme curriculum modules.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-700">Live Sync: Today, 11:42 AM</div>
                <div className="text-[11px] text-emerald-600 font-medium">All sessions recorded</div>
              </div>
              <button
                onClick={() => setReportGenerated(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500">Questions Attempted</span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-display">
              {userStats.attemptedMCQs} <span className="text-sm font-normal text-slate-400">/ {userStats.targetMCQs} Qs</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Curriculum Coverage</span>
                <span className="font-bold">{coveragePct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${coveragePct}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500">Correct Answers</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 font-display">
              {userStats.correctAnswers} <span className="text-sm font-normal text-slate-400">Verified</span>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>First attempt accuracy: <strong>{accuracyPct}%</strong></span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
              <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Target className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-display">
              {accuracyPct}%
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                accuracyPct >= 70
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : accuracyPct >= 50
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                {accuracyPct >= 70 ? 'Distinction Zone' : accuracyPct >= 50 ? 'First Class Zone' : 'Starting Out'}
              </span>
              <span className="text-xs text-slate-500">Target: &gt;70%</span>
            </div>
          </div>
        </div>

        {/* Subject Performance Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Subject Performance Matrix</h2>
              <p className="text-xs text-slate-500">Unit-wise mastery across active semester subjects</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              MSBTE SEM V
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map((subj) => (
              <div key={subj.id} className="p-5 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Code: {subj.code}</div>
                    <h3 className="text-base font-bold text-slate-900 font-display">{subj.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-blue-700 font-display">
                      {subj.accuracyPercentage}%
                    </span>
                    <div className="text-[11px] text-slate-500">{subj.completedCount}/250 Questions</div>
                  </div>
                </div>

                {/* Unit breakdown bars */}
                <div className="space-y-2 mb-4">
                  {subj.units.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onStartPractice(subj.id, u.id)}
                      className="w-full text-left text-xs hover:bg-slate-100 p-1.5 rounded-lg transition-colors group cursor-pointer"
                      title={`Practice ${subj.title} - Unit ${u.number}: ${u.title}`}
                    >
                      <div className="flex justify-between text-slate-600 mb-0.5 group-hover:text-blue-700">
                        <span className="truncate pr-2 font-medium">U{u.number}: {u.title}</span>
                        <span className="font-semibold">{u.accuracyPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            u.accuracyPercentage >= 80
                              ? 'bg-emerald-500'
                              : u.accuracyPercentage >= 65
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${u.accuracyPercentage}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onStartPractice(subj.id)}
                  className="w-full py-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50/50 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Subject Units</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Weak Topics Diagnostic (Left) vs 14-Day Momentum (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weak Topics Diagnostic */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Weak Topics Diagnostic
                    </h3>
                    <p className="text-xs text-slate-500">3 Priority areas with lowest first-attempt accuracy</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {weakTopics.length > 0 ? (
                  weakTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {item.unitName}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-extrabold text-rose-600">
                            {item.accuracyPct}% Acc.
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.topic}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.totalAttempted} attempts recorded • Priority: <strong className="text-rose-700">{item.priority}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => onStartPractice('man-22509', 2)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No weak topics identified yet! Keep practicing.
                  </div>
                )}
              </div>
            </div>

            {/* Sprint Callout */}
            <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-900">
                  Prioritize a <strong>15-question sprint</strong> in Management Unit 2 today to flip it to <em>On Track</em>.
                </p>
              </div>
              <button
                onClick={() => onStartPractice('man-22509', 2)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-xs"
              >
                Launch 12-Min Sprint
              </button>
            </div>
          </div>

          {/* 14-Day Accuracy Momentum Chart */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    14-Day Accuracy Momentum
                  </h3>
                  <p className="text-xs text-slate-500">Continuous growth trajectory towards Summer 2025 Board Exam</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +19% Growth
                </span>
              </div>

              {/* Clean SVG Momentum Curve */}
              <div className="h-44 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Benchmark target line */}
                  <line x1="40" y1="75" x2="480" y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="485" y="78" fill="#94a3b8" fontSize="10" fontWeight="600">70% Target</text>

                  {/* Area fill */}
                  <path
                    d="M 50 115 L 140 85 L 240 68 L 350 55 L 450 50 L 450 140 L 50 140 Z"
                    fill="url(#gradient-blue)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  {/* Trend line */}
                  <path
                    d="M 50 115 L 140 85 L 240 68 L 350 55 L 450 50"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data circles & labels */}
                  {[
                    { x: 50, y: 115, val: '62%', label: 'Day 1' },
                    { x: 140, y: 85, val: '71%', label: 'Day 4' },
                    { x: 240, y: 68, val: '76%', label: 'Day 8' },
                    { x: 350, y: 55, val: '80%', label: 'Day 11' },
                    { x: 450, y: 50, val: '81%', label: 'Today' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                      <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="700">
                        {pt.val}
                      </text>
                      <text x={pt.x} y="145" textAnchor="middle" fill="#64748b" fontSize="10">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Study consistency: <strong>5 days consecutive</strong></span>
              <span className="text-blue-600 font-semibold">Projected Score: 88%</span>
            </div>
          </div>
        </div>

        {/* Download Modal / Banner notification if clicked */}
        {reportGenerated && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold">MSBTE Board Diagnostic Report Generated!</p>
                <p className="text-[11px] text-emerald-800">
                  Ready for printing: Student: {userStats.name} • 342 MCQs Verified • Projected Grade: Distinction.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Report sent to printer dialog.');
                setReportGenerated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              Print Sheet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
