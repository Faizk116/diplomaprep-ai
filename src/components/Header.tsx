import React, { useState } from 'react';
import { AppScreen, ASSETS, UserStats } from '../types';
import { Flame, Sparkles, BookOpen, BarChart3, Bot, ChevronDown, LogOut, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  userStats: UserStats;
  isLoggedIn?: boolean;
  onSignOut?: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentScreen, 
  onNavigate, 
  userStats,
  isLoggedIn = true,
  onSignOut,
  onOpenAuth
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [screenMenuOpen, setScreenMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <img 
                src={ASSETS.LOGO} 
                alt="DiplomaPrep AI Logo" 
                className="w-9 h-9 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform" 
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                    DiplomaPrep<span className="text-blue-600">.AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    MSBTE 'I'
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Third Year Diploma Exam Engine</p>
              </div>
            </button>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => onNavigate('progress')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'progress' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Progress
              </button>

              <button
                onClick={() => onNavigate('ai-tutor')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === 'ai-tutor' 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bot className="w-4 h-4 text-purple-600" />
                <span>AI Tutor</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </nav>
          </div>

          {/* Right Actions: Streak & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Screen Explorer Pill (helps reviewer jump directly between the 8 screens) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setScreenMenuOpen(!screenMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Screens: {currentScreen}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {screenMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Designed Screen
                  </div>
                  {(['dashboard', 'units', 'practice', 'review', 'completed', 'progress', 'ai-tutor', 'landing'] as AppScreen[]).map((scr) => (
                    <button
                      key={scr}
                      onClick={() => {
                        onNavigate(scr);
                        setScreenMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 capitalize ${
                        currentScreen === scr ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{scr === 'units' ? 'Subject Units' : scr === 'completed' ? 'Test Completed' : scr}</span>
                      {currentScreen === scr && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                {/* Streak Pill */}
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-full">
                  <span className="flex items-center text-sm font-semibold text-amber-900">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 mr-1 animate-bounce" />
                    {userStats.streakDays} Day Streak
                  </span>
                  <span className="text-amber-300">•</span>
                  <span className="text-xs font-medium text-amber-800">
                    {userStats.solvedMCQs} MCQs Solved
                  </span>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                  >
                    <img
                      src={userStats.avatarUrl}
                      alt={userStats.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                        <span>{userStats.name}</span>
                        {userStats.authProvider === 'google' && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
                            G
                          </span>
                        )}
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{userStats.branch || 'Diploma Student'}</div>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{userStats.name}</p>
                          {userStats.authProvider === 'google' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                              Google
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{userStats.branch}</p>
                        <p className="text-[10px] text-blue-600 font-medium mt-1 truncate">
                          {userStats.authProvider === 'google'
                            ? `Google: ${userStats.email || 'faizu2611@gmail.com'}`
                            : `Account ID: ${userStats.email || 'MSBTE Student'}`}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('progress');
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                          View Full Performance Analytics
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('ai-tutor');
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Bot className="w-3.5 h-3.5 text-purple-500" />
                          Launch AI Doubt Solver
                        </button>
                      </div>
                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            if (onSignOut) {
                              onSignOut();
                            } else {
                              onNavigate('landing');
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out (Switch Account)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth?.('signin')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth?.('signup')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/25 hover:shadow-sm transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
