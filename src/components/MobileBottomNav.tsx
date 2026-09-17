import React from 'react';
import { AppScreen } from '../types';
import { BookOpen, Layers, BarChart3, Bot, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Hide bottom nav during focused practice test mode or landing view
  if (currentScreen === 'practice' || currentScreen === 'landing') {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard' as AppScreen,
      label: 'Home',
      icon: BookOpen,
      isActive: currentScreen === 'dashboard',
    },
    {
      id: 'units' as AppScreen,
      label: 'Units',
      icon: Layers,
      isActive: currentScreen === 'units',
    },
    {
      id: 'progress' as AppScreen,
      label: 'Progress',
      icon: BarChart3,
      isActive: currentScreen === 'progress',
    },
    {
      id: 'ai-tutor' as AppScreen,
      label: 'AI Tutor',
      icon: Bot,
      isActive: currentScreen === 'ai-tutor',
      highlightBadge: true,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0.5rem), 0.5rem)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                item.isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80 scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                {item.highlightBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
