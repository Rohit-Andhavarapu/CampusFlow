import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { authService } from '../../services/campusflowService';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data?.session) {
          const user = await authService.getCurrentUser();
          if (user) {
            showToast('success', `Welcome, ${user.name}`, `Signed in as ${user.role.toUpperCase()}`);
            navigate(`/${user.role}/dashboard`, { replace: true });
          } else {
            navigate('/student/dashboard', { replace: true });
          }
        } else {
          // No active session found
          setErrorMessage('No authentication session detected in the callback URL.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
      }
    };

    handleAuthCallback();
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen bg-[#060B12] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0B111B] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        {errorMessage ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
            <p className="text-sm text-slate-400">{errorMessage}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white text-sm font-semibold transition-all active:scale-[0.98]"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-[#72F4D1]/30 flex items-center justify-center mx-auto text-[#72F4D1] animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Verifying Credentials</h2>
            <p className="text-sm text-slate-400">
              Establishing cryptographic session and loading your verified recruitment workspace...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
