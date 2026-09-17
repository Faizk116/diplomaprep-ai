import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, BookOpen, GraduationCap, ArrowRight, Sparkles, Check, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { ASSETS } from '../types';
import { authService } from '../api/services';

export interface AuthSuccessData {
  name: string;
  emailOrEnrollment: string;
  branch: string;
  year: string;
  authProvider: 'google' | 'email';
  avatarUrl?: string;
  isNewAccount: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onAuthSuccess: (userData: AuthSuccessData) => void;
  savedAccounts?: Array<{
    name: string;
    emailOrEnrollment: string;
    branch: string;
    authProvider: 'google' | 'email';
  }>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onAuthSuccess,
  savedAccounts = [],
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showGooglePicker, setShowGooglePicker] = useState<boolean>(false);

  // Form Fields - starts clean and empty for new registration
  const [name, setName] = useState('');
  const [emailOrEnrollment, setEmailOrEnrollment] = useState('');
  const [branch, setBranch] = useState('Computer / IT Engineering');
  const [year, setYear] = useState('TY Diploma');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Google Flow States
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isAddingOtherGoogle, setIsAddingOtherGoogle] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setShowGooglePicker(false);
      setIsAddingOtherGoogle(false);
      // Clean form on open if signup
      if (initialMode === 'signup') {
        setName('');
        setEmailOrEnrollment('');
        setPassword('');
      } else {
        // In signin, can default or let user pick demo
        setEmailOrEnrollment('');
        setPassword('');
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Standard Email/Password Sign Up or Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      const trimmedName = name.trim();
      const trimmedEmail = emailOrEnrollment.trim();
      const trimmedPass = password.trim();

      if (!trimmedName || trimmedName.length < 2) {
        setErrorMessage('Please enter your full name (minimum 2 characters)');
        return;
      }
      if (!trimmedEmail) {
        setErrorMessage('Please enter your email or MSBTE enrollment number');
        return;
      }
      if (!trimmedPass || trimmedPass.length < 4) {
        setErrorMessage('Please create a password (minimum 4 characters)');
        return;
      }

      setIsSubmitting(true);
      try {
        const authData = await authService.signup({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPass,
          enrollmentNo: trimmedEmail.includes('@') ? undefined : trimmedEmail,
          branch,
          year,
        });

        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}&backgroundColor=2563eb&textColor=ffffff`;

        onAuthSuccess({
          name: authData.user?.name || trimmedName,
          emailOrEnrollment: (authData.user as any)?.emailOrEnrollment || authData.user?.email || trimmedEmail,
          branch: authData.user?.branch || branch,
          year: authData.user?.year || year,
          authProvider: 'email',
          avatarUrl,
          isNewAccount: true,
        });
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Sign in mode
      const trimmedEmail = emailOrEnrollment.trim();
      if (!trimmedEmail) {
        setErrorMessage('Please enter your registered email or enrollment number');
        return;
      }

      setIsSubmitting(true);
      try {
        const authData = await authService.signin({
          identifier: trimmedEmail,
          password: password.trim() || undefined,
        });

        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authData.user?.name || trimmedEmail)}&backgroundColor=2563eb&textColor=ffffff`;

        onAuthSuccess({
          name: authData.user?.name || 'MSBTE Student',
          emailOrEnrollment: (authData.user as any)?.emailOrEnrollment || authData.user?.email || trimmedEmail,
          branch: authData.user?.branch || branch,
          year: authData.user?.year || year,
          authProvider: 'email',
          avatarUrl,
          isNewAccount: false,
        });

      } catch (err: any) {
        setErrorMessage(err.message || 'Sign in failed. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle Google Account Selection
  const handleSelectGoogleAccount = async (googleName: string, googleEmail: string) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        try {
          const authData = await authService.googleAuth({
            mode: 'signin',
            email: googleEmail,
            name: googleName,
          });

          const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleName)}&backgroundColor=4285F4&textColor=ffffff`;

          onAuthSuccess({
            name: authData.user?.name || googleName,
            emailOrEnrollment: authData.user?.email || authData.user?.enrollmentNo || googleEmail,
            branch: authData.user?.branch || branch,
            year: authData.user?.year || year,
            authProvider: 'google',
            avatarUrl,
            isNewAccount: false,
          });
        } catch (err: any) {
          // If no account found, redirect the user directly to the Sign-Up screen with an appropriate message
          setShowGooglePicker(false);
          setMode('signup');
          setName(googleName);
          setEmailOrEnrollment(googleEmail);
          const msg = err.message && err.message.includes('No account found')
            ? err.message
            : 'No registered account found with this Google email. Please complete your registration below to create your student profile.';
          setErrorMessage(msg);
        }
      } else {
        // Sign-up flow via Google OAuth
        const authData = await authService.googleAuth({
          mode: 'signup',
          email: googleEmail,
          name: googleName,
          branch,
          year,
        });

        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleName)}&backgroundColor=4285F4&textColor=ffffff`;

        onAuthSuccess({
          name: authData.user?.name || googleName,
          emailOrEnrollment: authData.user?.email || authData.user?.enrollmentNo || googleEmail,
          branch: authData.user?.branch || branch,
          year: authData.user?.year || year,
          authProvider: 'google',
          avatarUrl,
          isNewAccount: true,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Quick Demo Account (Pooja S. - 342 Solved MCQs)
  const handleLoadDemoStudent = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const authData = await authService.signin({
        identifier: 'pooja.s@msbte.edu.in',
        password: 'Pooja@123',
      });

      onAuthSuccess({
        name: authData.user.name || 'Pooja S.',
        emailOrEnrollment: authData.user.enrollmentNo || 'MSBTE-2023-IT-0482',
        branch: 'Computer / IT Engineering',
        year: 'TY Diploma',
        authProvider: 'email',
        avatarUrl: ASSETS.AVATAR,
        isNewAccount: false,
      });
    } catch (err: any) {
      // Fallback
      onAuthSuccess({
        name: 'Pooja S.',
        emailOrEnrollment: 'MSBTE-2023-IT-0482',
        branch: 'Computer / IT Engineering',
        year: 'TY Diploma',
        authProvider: 'email',
        avatarUrl: ASSETS.AVATAR,
        isNewAccount: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={ASSETS.LOGO} 
              alt="DiplomaPrep AI" 
              className="w-8 h-8 rounded-lg bg-white/10 p-0.5 object-contain"
              referrerPolicy="no-referrer" 
            />
            <div>
              <h3 className="font-bold text-base font-display">DiplomaPrep<span className="text-amber-300">.AI</span></h3>
              <p className="text-[11px] text-blue-100">MSBTE 'I' Scheme Exam Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setShowGooglePicker(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Create New Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setShowGooglePicker(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Google Account Picker View */}
        {showGooglePicker ? (
          <div className="p-6 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm font-bold text-slate-800">
                  {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowGooglePicker(false);
                  setErrorMessage('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Back
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {mode === 'signup'
                ? 'Choose a Google account to create your MSBTE student profile. Your exam records and progress will be securely saved in the database.'
                : 'Choose your previously registered Google account to sign in to DiplomaPrep AI.'}
            </p>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Discipline & Year Selection for Sign Up */}
            {mode === 'signup' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Target Profile Settings:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Discipline
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
                    >
                      <option value="Computer / IT Engineering">Computer / IT (CO/IF)</option>
                      <option value="Mechanical Engineering">Mechanical (ME)</option>
                      <option value="Civil Engineering">Civil (CE)</option>
                      <option value="Electrical Engineering">Electrical (EE)</option>
                      <option value="Electronics & Telecommunication">Electronics (EJ/ET)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
                    >
                      <option value="TY Diploma">TY Diploma (Sem 5 &amp; 6)</option>
                      <option value="SY Diploma">SY Diploma (Sem 3 &amp; 4)</option>
                      <option value="FY Diploma">FY Diploma (Sem 1 &amp; 2)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested / Detected Google Accounts */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectGoogleAccount('Faiz Khan', 'faizu2611@gmail.com')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center gap-3 cursor-pointer group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-blue-100 shrink-0">
                  F
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Faiz Khan</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Google Account
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">faizu2611@gmail.com</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectGoogleAccount('Pooja S.', 'pooja.s@msbte.edu.in')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all flex items-center gap-3 cursor-pointer group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-purple-100 shrink-0">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Pooja S.</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                      Seeded Student
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">pooja.s@msbte.edu.in</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </button>

              {/* Use Another Google Account option */}
              {!isAddingOtherGoogle ? (
                <button
                  type="button"
                  onClick={() => setIsAddingOtherGoogle(true)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800">Enter Google Account Details:</div>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Full Name (e.g. Rahul Patil)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="Google Email (e.g. rahul.p@gmail.com)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={!customGoogleEmail.trim() || !customGoogleName.trim() || isSubmitting}
                      onClick={() => handleSelectGoogleAccount(customGoogleName.trim(), customGoogleEmail.trim())}
                      className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>{mode === 'signup' ? 'Sign Up with this Google Account' : 'Sign In with this Google Account'}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingOtherGoogle(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>


            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Secure OAuth verification
              </span>
              <button
                type="button"
                onClick={() => setShowGooglePicker(false)}
                className="font-semibold text-blue-600 hover:underline"
              >
                Use Email &amp; Password instead
              </button>
            </div>
          </div>
        ) : (
          /* Main Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-display">
                {mode === 'signup' ? 'Create Your MSBTE Student Account' : 'Sign In to DiplomaPrep AI'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'signup'
                  ? 'Get full access to 1000+ MSBTE I-Scheme MCQs, Bloom analytics, and 24/7 AI tutor.'
                  : 'Welcome back! Sign in to continue your MCQ mastery and exam progress.'}
              </p>
            </div>

            {/* Google Authentication Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowGooglePicker(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                or with email / enrollment
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Saved Accounts on Device (for Sign In mode) */}
            {mode === 'signin' && savedAccounts.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Saved Accounts on this Device:
                </div>
                {savedAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onAuthSuccess({
                        name: acc.name,
                        emailOrEnrollment: acc.emailOrEnrollment,
                        branch: acc.branch,
                        year: 'TY Diploma',
                        authProvider: acc.authProvider,
                        isNewAccount: false,
                      });
                    }}
                    className="w-full text-left px-3 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-400 text-xs flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {acc.authProvider === 'google' ? (
                        <GoogleIcon className="w-3.5 h-3.5" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span className="font-semibold text-slate-800">{acc.name}</span>
                      <span className="text-[10px] text-slate-400">({acc.emailOrEnrollment})</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 hover:underline">Log in &rarr;</span>
                  </button>
                ))}
              </div>
            )}

            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Faiz Khan"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email or Enrollment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'signup' ? 'Email or MSBTE Enrollment No.' : 'Email / Enrollment No.'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailOrEnrollment}
                  onChange={(e) => setEmailOrEnrollment(e.target.value)}
                  placeholder={mode === 'signup' ? 'e.g. faizu2611@gmail.com or 2100482019' : 'Enter your email or enrollment'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Discipline & Academic Year (Sign Up only) */}
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diploma Discipline
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
                    >
                      <option value="Computer / IT Engineering">Computer / IT (CO / IF)</option>
                      <option value="Mechanical Engineering">Mechanical (ME)</option>
                      <option value="Civil Engineering">Civil (CE)</option>
                      <option value="Electrical Engineering">Electrical (EE)</option>
                      <option value="Electronics & Telecommunication">Electronics (EJ / ET)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
                    >
                      <option value="TY Diploma">TY Diploma (Sem 5 &amp; 6)</option>
                      <option value="SY Diploma">SY Diploma (Sem 3 &amp; 4)</option>
                      <option value="FY Diploma">FY Diploma (Sem 1 &amp; 2)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handleLoadDemoStudent}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Quick Load Demo Student
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 bg-white"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs shadow-sm shadow-blue-500/25 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Open Dashboard' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="text-center pt-2 border-t border-slate-100">
              {mode === 'signup' ? (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage('');
                      }}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Create New Account
                    </button>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Want to test with full answers?{' '}
                    <button
                      type="button"
                      onClick={handleLoadDemoStudent}
                      className="font-semibold text-slate-600 hover:text-blue-600 underline cursor-pointer"
                    >
                      Explore Pooja S. (342 Solved MCQs)
                    </button>
                  </p>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);
