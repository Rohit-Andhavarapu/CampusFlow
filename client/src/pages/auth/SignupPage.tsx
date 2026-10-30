import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignupPage: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const res = await signup(fullName.trim(), email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      if (res.confirmationRequired) {
        setIsSuccess(true);
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 selection:bg-[#0F766E]/40 selection:text-[#72F4D1] relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F766E] to-[#72F4D1] p-0.5 shadow-lg shadow-[#0F766E]/30 group-hover:shadow-[#72F4D1]/40 transition-shadow">
          <div className="w-full h-full bg-[#060B12] rounded-[10px] flex items-center justify-center">
            <span className="text-[#72F4D1] font-black font-mono text-base tracking-tighter">CF</span>
          </div>
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight font-sans">
          Campus<span className="text-[#72F4D1]">Flow</span>
        </span>
      </Link>

      {/* Main Signup Card */}
      <div className="w-full max-w-md bg-[#0B111B] border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Create Student Account
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Join the verified campus recruitment directory and discover matched opportunities.
          </p>
        </div>

        {/* Security / Role Notice */}
        <div className="mb-6 p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#72F4D1] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-teal-200 leading-snug">
            Self-registration strictly creates <strong>Student</strong> accounts. Recruiter and Placement Administrator credentials require institutional empanelment.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Confirmation State */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verification Email Dispatched</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We have sent an authentication link to <strong className="text-white">{email}</strong>. Please confirm your email to activate your student credentials.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-[#060B12] border border-white/15 focus:border-[#72F4D1] focus:ring-1 focus:ring-[#72F4D1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rollno@campus.edu"
                  className="w-full bg-[#060B12] border border-white/15 focus:border-[#72F4D1] focus:ring-1 focus:ring-[#72F4D1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#060B12] border border-white/15 focus:border-[#72F4D1] focus:ring-1 focus:ring-[#72F4D1] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#060B12] border border-white/15 focus:border-[#72F4D1] focus:ring-1 focus:ring-[#72F4D1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#115E59] hover:from-[#115E59] hover:to-[#0F766E] text-white text-xs font-bold border border-[#72F4D1]/40 shadow-xl shadow-[#0F766E]/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Register Student Credentials</span>
                  <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-[#72F4D1] font-semibold hover:underline">
              Sign In to Workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
