import React from 'react';
import { ASSETS, AppScreen } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Bot, 
  Award, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, onNavigate, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Landing Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={ASSETS.LOGO} 
              alt="DiplomaPrep AI Logo" 
              className="w-9 h-9 rounded-lg object-contain shadow-xs" 
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                  DiplomaPrep<span className="text-blue-600">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                  MSBTE 'I'
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Third Year Diploma Exam Engine</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600">
              Syllabus Map
            </button>
            <button onClick={() => onNavigate('units')} className="hover:text-blue-600">
              Management (22509)
            </button>
            <button onClick={() => onNavigate('progress')} className="hover:text-blue-600">
              Analytics
            </button>
            <button onClick={() => onNavigate('ai-tutor')} className="hover:text-purple-600 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              AI Doubt Solver
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signin') : onStart())}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onStart())}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ENGINEERED FOR MSBTE DIPLOMA STUDENTS
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display max-w-4xl mx-auto leading-tight sm:leading-none">
            Master MSBTE 'I' Scheme MCQs with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Targeted multiple choice practice, unit-wise weightage analytics, and instant doubt clarification trained directly on MSBTE model answer papers and curriculum rubrics.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onStart())}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Practicing for Free (Sign Up)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('units')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Explore 22509 Management Demo</span>
            </button>
          </div>

          {/* Proof Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>10,000+ MSBTE MCQs Mapped</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>94% Student Distinction Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Winter 2024 Model Answer Aligned</span>
            </div>
          </div>
        </div>

        {/* Live App Showcase Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[11px] text-slate-300">diplomaprep.ai/practice/msbte-22509</span>
              </div>
              <span className="text-[11px] text-blue-400 font-medium">Summer 2025 Board Edition</span>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Enrolled Subject</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Management (22509)</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">TY Diploma • 5 Units</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Board Readiness</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">80% Accuracy (16/20)</p>
                  <p className="text-xs text-slate-500 mt-1">Distinction Target: &gt;70%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">AI Diagnosis</span>
                  <p className="text-sm font-bold text-purple-700 mt-0.5">Strategic vs Tactical Plans</p>
                  <p className="text-xs text-slate-500 mt-1">Unit 2 Review Recommended</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    Q7
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      "Which of the following describes planning as the primary function of management?"
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      ✓ Option A (Planning) • MSBTE Model Answer Paper Winter 2022
                    </p>
                  </div>
                </div>
                <button
                  onClick={onStart}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow-xs"
                >
                  Try Interactive MCQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Triad Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Engineered specifically for the MSBTE Board Exam structure
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Unlike generic exam portals, every question and explanation is mapped to Maharashtra State Board syllabi and marking rubrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Syllabus-Aligned Question Sets
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every question is tagged with its official MSBTE unit number, Bloom's cognitive level (R/U/A), and past exam session (Winter 2019 to Winter 2024).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Step-by-Step AI Explanations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Don't just memorize answer keys. Learn why distractors are traps, review real-world engineering analogies, and read high-yield board exam tips.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Exam Mode Simulation &amp; Diagnostics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulate official MSBTE time constraints, analyze your peer percentile, and target specific units needing attention before exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diploma Branches Covered */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
            Supported MSBTE Diploma Disciplines
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'Computer Engineering (CO)',
              'Information Technology (IF)',
              'Mechanical Engineering (ME)',
              'Civil Engineering (CE)',
              'Electrical Engineering (EE)',
              'Electronics & Telecommunication (EJ/ET)',
              'Environmental Studies (Common 22447)',
              'Management (Common 22509)',
            ].map((branch, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img src={ASSETS.LOGO} alt="DiplomaPrep AI" className="w-6 h-6 rounded" referrerPolicy="no-referrer" />
            <span className="font-bold text-slate-800">DiplomaPrep AI</span>
            <span>•</span>
            <span>MSBTE 'I' Scheme Preparation Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onStart} className="text-blue-600 font-semibold hover:underline">
              Launch App
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('units')} className="hover:text-slate-800">
              Syllabus
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('ai-tutor')} className="hover:text-slate-800">
              AI Tutor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
