import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('aarav.sharma@campus.edu');
  const [password, setPassword] = useState('CampusFlow2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your institutional email and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success && res.role) {
      navigate(`/${res.role}/dashboard`);
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string, role: UserRole) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 selection:bg-[#0F766E]/40 selection:text-[#72F4D1] relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

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

      {/* Main Login Card with High-End Material Finish */}
      <div className="w-full max-w-md bg-[#0B111B] border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Access your verified recruitment portal and real-time dossiers.
          </p>
        </div>

        {/* Quick Demo Switcher for Hackathon Evaluators */}
        <div className="mb-6 p-3 rounded-2xl bg-[#060B12] border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#72F4D1] font-bold block mb-2 text-center">
            ⚡ Quick Demo Fill (Judges & Evaluators)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('aarav.sharma@campus.edu', 'CampusFlow2026!', 'student')}
              className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                email.includes('aarav')
                  ? 'bg-[#0F766E] text-white border-[#72F4D1]/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="block text-[11px]">Student</span>
              <span className="text-[9px] opacity-75 font-mono">Aarav</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('priya.nair@novatech.io', 'CampusFlow2026!', 'recruiter')}
              className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                email.includes('priya')
                  ? 'bg-[#0F766E] text-white border-[#72F4D1]/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="block text-[11px]">Recruiter</span>
              <span className="text-[9px] opacity-75 font-mono">Priya</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('placements@campus.edu', 'CampusFlow2026!', 'admin')}
              className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                email.includes('placements')
                  ? 'bg-[#0F766E] text-white border-[#72F4D1]/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="block text-[11px]">Admin</span>
              <span className="text-[9px] opacity-75 font-mono">Dr. Rao</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
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
                placeholder="name@campus.edu or name@company.io"
                className="w-full bg-[#060B12] border border-white/15 focus:border-[#72F4D1] focus:ring-1 focus:ring-[#72F4D1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors font-sans"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo account credentials: Password is "CampusFlow2026!"')}
                className="text-[11px] text-[#72F4D1] hover:underline font-mono"
              >
                Forgot Password?
              </button>
            </div>
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

          {/* Submit Button with Emil Kowalski Button Physics */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#115E59] hover:from-[#115E59] hover:to-[#0F766E] text-white text-xs font-bold border border-[#72F4D1]/40 shadow-xl shadow-[#0F766E]/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#72F4D1] font-semibold hover:underline">
              Create Student Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
