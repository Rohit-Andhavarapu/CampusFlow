import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success && res.role) {
      const dest = from || `/${res.role}/dashboard`;
      navigate(dest, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid email or password. Please verify your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    const res = await loginWithGoogle();
    if (!res.success) {
      setIsGoogleLoading(false);
      setErrorMessage(
        res.error || 'Google authentication could not be initiated. Check Supabase OAuth configuration.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col lg:flex-row selection:bg-[#14432A]/15 selection:text-[#14432A]">
      {/* Left Column: Academic Prestige Brand & Editorial Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#FFFDF9] border-r linen-rule flex-col justify-between p-12 lg:p-16 overflow-hidden">
        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-md bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-semibold text-lg shadow-sm border border-[#0F3521] transition-transform group-hover:scale-105">
              CF
            </div>
            <div>
              <span className="font-serif-prestige font-semibold text-xl tracking-tight text-[#14432A] block leading-none">
                CampusFlow
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold block mt-1">
                University Talent Folio
              </span>
            </div>
          </Link>
        </div>

        {/* Central Narrative Block */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            <span>Authoritative Placement Portal</span>
          </div>

          <h2 className="font-serif-prestige text-3xl xl:text-4xl font-semibold text-[#14432A] tracking-tight leading-tight">
            Where academic achievement <span className="italic font-normal">meets transparent opportunity.</span>
          </h2>

          <p className="text-sm text-[#4B5563] leading-relaxed">
            Sign in to access your synchronized recruitment workstation. From pre-screened student eligibility checks to enterprise interview dispatch and offer confirmations.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Pre-screened student credentials matched directly against verified employer cutoffs.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Automated Google Meet room generation for confirmed interview rounds.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Row-Level Security (RLS) ensuring strict cross-role privacy and authentication.</span>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#6B7280]">
          <span>CampusFlow Platform v4.0</span>
          <span>PostgreSQL Row-Level Security Enforced</span>
        </div>
      </div>

      {/* Right Column: Refined Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Brand Link */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-bold text-sm">
                CF
              </div>
              <span className="font-serif-prestige font-semibold text-lg text-[#14432A]">
                CampusFlow
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-serif-prestige text-2xl sm:text-3xl font-bold text-[#14432A] tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-normal">
              Enter your credentials to access your verified portal.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs text-[#991B1B]">
              <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 rounded-md bg-[#FFFDF9] parchment-border hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#1A1A1A] transition-colors flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#14432A]" />
            ) : (
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
            )}
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t linen-rule"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#FAF8F5] px-3 text-[#6B7280]">
                Or continue with institutional email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#14432A] mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@campus.edu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#14432A]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#14432A] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#9CA3AF] hover:text-[#14432A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 border border-[#0F3521] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </>
              )}
            </button>
          </form>

          {/* Student Signup Link */}
          <div className="mt-8 pt-6 border-t linen-rule text-center text-xs text-[#6B7280]">
            <span>Don't have an account yet? </span>
            <Link
              to="/signup"
              className="font-semibold text-[#14432A] hover:underline ml-1"
            >
              Register as Student →
            </Link>
            <div className="mt-4 pt-3 flex items-center justify-center gap-3 text-[11px] text-[#9CA3AF]">
              <Link to="/privacy" className="hover:text-[#14432A] transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-[#14432A] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
