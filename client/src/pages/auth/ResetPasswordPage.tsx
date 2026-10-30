import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/campusflowService';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await authService.updatePassword(newPassword);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#14432A]/15 selection:text-[#14432A]">
      <div className="w-full max-w-md bg-[#FFFDF9] parchment-border rounded-xl p-8 shadow-folio">
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#14432A]/10 text-[#14432A] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#14432A]" />
            </div>
            <h2 className="font-serif-prestige text-2xl font-bold text-[#14432A]">Password Updated</h2>
            <p className="text-xs text-[#4B5563]">
              Your password has been successfully updated. Redirecting to sign in...
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-serif-prestige text-2xl sm:text-3xl font-bold text-[#14432A] tracking-tight">
              Create New Password
            </h1>
            <p className="text-xs text-[#6B7280] mt-1.5 mb-6">
              Enter your new security credentials below to regain account access.
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
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (8+ chars)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
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

              <div>
                <label className="text-xs font-semibold text-[#14432A] block mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#FAF8F5] parchment-border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#14432A] focus:ring-1 focus:ring-[#14432A] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
