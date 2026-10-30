import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full official name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please acknowledge the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);

    const res = await signup(fullName, email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.confirmationRequired) {
        setIsConfirmationRequired(true);
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Failed to create student account. Please check your information.');
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    const res = await loginWithGoogle();
    if (!res.success) {
      setIsGoogleLoading(false);
      setErrorMessage(res.error || 'Google registration failed. Please try standard email signup.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-white flex flex-col lg:flex-row">
      {/* Left Column: Brand & Product Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#090E17] border-r border-white/10 flex-col justify-between p-12 lg:p-16 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] border border-[#72F4D1]/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <ShieldCheck className="w-5 h-5 text-[#72F4D1]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">CampusFlow</span>
              <span className="text-[10px] text-teal-300 font-semibold uppercase tracking-wider block">
                Student Enrollment
              </span>
            </div>
          </Link>
        </div>

        {/* Central Visual Presentation */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#72F4D1] bg-[#72F4D1]/10 border border-[#72F4D1]/30">
            Official Student Registration
          </span>
          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Take control of your campus placement journey.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Create your verified student profile to unlock automated eligibility checks, real-time application tracking, and direct interview scheduling with top employers.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#72F4D1] flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Algorithmic qualification transparency before you click apply.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#59D9FF] flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Verified resume repository stored in encrypted cloud storage.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Real-time interview alerts and calendar synchronization.</span>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span>CampusFlow Student Portal</span>
          <span>Verified Academic Network</span>
        </div>
      </div>

      {/* Right Column: Accessible Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Brand Link */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] border border-[#72F4D1]/40 flex items-center justify-center text-[#72F4D1]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">CampusFlow</span>
            </Link>
          </div>

          {isConfirmationRequired ? (
            <div className="text-center space-y-4 bg-[#0B111B] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-[#72F4D1]/30 flex items-center justify-center mx-auto text-[#72F4D1]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Email</h2>
              <p className="text-sm text-slate-300">
                We've sent a verification link to <strong className="text-white">{email}</strong>.
              </p>
              <p className="text-xs text-slate-400">
                Please check your inbox and click the confirmation link to activate your student account.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white text-sm font-semibold transition-all active:scale-[0.98] mt-4"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Create student account
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                  Sign up with your academic details to browse campus drives.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 flex items-start gap-3 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-200">Registration error</p>
                    <p className="mt-0.5 text-slate-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Google Social Signup */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                    <span>Sign up with Google</span>
                  </>
                )}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#060B12] text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Or register with email
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#72F4D1] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campusflow.edu"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#72F4D1] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Password (min. 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#72F4D1] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#72F4D1] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded accent-[#72F4D1] cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-slate-300 underline">Terms of Service</span> and acknowledge
                      the verified academic conduct policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register as Student</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#72F4D1] font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
