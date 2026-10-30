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
      setErrorMessage('Please enter your official university email.');
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
      setErrorMessage('Please acknowledge the Placement Rules and Privacy Terms to continue.');
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
      setErrorMessage(res.error || 'Failed to create student account. Please verify your information.');
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

  if (isConfirmationRequired) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex items-center justify-center p-6 selection:bg-[#14432A]/15 selection:text-[#14432A]">
        <div className="w-full max-w-md bg-[#FFFDF9] parchment-border rounded-xl p-8 shadow-folio text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#14432A]/10 text-[#14432A] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#14432A]" />
          </div>
          <h2 className="font-serif-prestige text-2xl font-bold text-[#14432A]">
            Verification Link Sent
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            We have dispatched a verification link to <span className="font-semibold text-[#14432A]">{email}</span>. Please click the link in your inbox to activate your student placement account.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block px-5 py-2.5 rounded-md bg-[#14432A] text-white text-xs font-semibold hover:bg-[#0F3521] transition-colors shadow-sm"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col lg:flex-row selection:bg-[#14432A]/15 selection:text-[#14432A]">
      {/* Left Column: Brand & Editorial Visual (Desktop) */}
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
                Student Enrollment
              </span>
            </div>
          </Link>
        </div>

        {/* Central Visual Presentation */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            <span>Student Registration</span>
          </div>

          <h2 className="font-serif-prestige text-3xl xl:text-4xl font-semibold text-[#14432A] tracking-tight leading-tight">
            Take control of your <span className="italic font-normal">campus recruitment story.</span>
          </h2>

          <p className="text-sm text-[#4B5563] leading-relaxed">
            Register your verified student profile to unlock automated cutoff eligibility checks, real-time application tracking, and direct interview scheduling with top employers.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>100% transparent qualification margins against all visiting companies.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>One-click verified apply with no manual resume reformatting.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#4B5563]">
              <div className="w-6 h-6 rounded-md bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Encrypted Google Meet room links dispatched automatically for interview rounds.</span>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#6B7280]">
          <span>CampusFlow Platform v4.0</span>
          <span>PostgreSQL Row-Level Security Protected</span>
        </div>
      </div>

      {/* Right Column: High-Craft Student Registration Form */}
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

          <div className="mb-6">
            <h1 className="font-serif-prestige text-2xl sm:text-3xl font-bold text-[#14432A] tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-normal">
              Register as a student to access live campus recruitment drives.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs text-[#991B1B]">
              <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 rounded-md bg-[#FFFDF9] parchment-border hover:bg-[#F2EFE8] text-xs sm:text-sm font-semibold text-[#1A1A1A] transition-colors flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 mb-5"
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
            <span>Register with Google</span>
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t linen-rule"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#FAF8F5] px-3 text-[#6B7280]">
                Or enter your official details
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#14432A] mb-1">
                Full Official Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
                <UserIcon className="absolute right-3.5 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14432A] mb-1">
                University Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.name@campus.edu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#14432A] mb-1">
                  Password (8+ chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    className="w-full px-3 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-xs sm:text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#9CA3AF] hover:text-[#14432A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14432A] mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full px-3 py-2.5 rounded-md bg-[#FFFDF9] parchment-border text-xs sm:text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E8E4DC] text-[#14432A] focus:ring-[#14432A]"
                />
                <span>
                  I agree to the <Link to="/" className="text-[#14432A] underline">Campus Placement Guidelines</Link> and <Link to="/" className="text-[#14432A] underline">Privacy Principles</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 border border-[#0F3521] mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t linen-rule text-center text-xs text-[#6B7280]">
            <span>Already have a verified account? </span>
            <Link
              to="/login"
              className="font-semibold text-[#14432A] hover:underline ml-1"
            >
              Sign In to Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
