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
      setError('Please enter your registered university email address.');
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#14432A]/15 selection:text-[#14432A]">
      <div className="w-full max-w-md bg-[#FFFDF9] parchment-border rounded-xl p-8 shadow-folio">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#14432A] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#14432A]/10 text-[#14432A] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#14432A]" />
            </div>
            <h2 className="font-serif-prestige text-2xl font-bold text-[#14432A]">
              Check Your Inbox
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              We have dispatched password reset instructions to <strong className="text-[#14432A]">{email}</strong>.
            </p>
            <p className="text-xs text-[#6B7280]">
              Please check your email and follow the enclosed link to choose a new password. The link will expire in 60 minutes.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs font-semibold transition-all active:scale-[0.98] mt-2 shadow-sm"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="font-serif-prestige text-2xl sm:text-3xl font-bold text-[#14432A] tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-[#6B7280] mt-1.5 mb-6">
              Enter your registered official email address and we will dispatch password recovery instructions.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2 text-xs text-[#991B1B]">
                <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#14432A] block mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.name@campus.edu"
                    required
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Reset Link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Instructions</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
