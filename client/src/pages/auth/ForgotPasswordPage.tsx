import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/campusflowService';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your institutional or corporate email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await authService.resetPasswordForEmail(email);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0B111B] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-[#72F4D1]/30 flex items-center justify-center mx-auto text-[#72F4D1]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Check Your Inbox</h2>
            <p className="text-sm text-slate-300">
              We have dispatched a secure password reset link to <strong className="text-white">{email}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Please click the link in your email to choose a new password. The link will expire in 60 minutes.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white text-sm font-semibold transition-all active:scale-[0.98] mt-2"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campusflow.edu"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#72F4D1] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Password Reset Email'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
