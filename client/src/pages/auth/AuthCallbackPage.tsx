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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col items-center justify-center p-6 selection:bg-[#14432A]/15 selection:text-[#14432A]">
      <div className="w-full max-w-md bg-[#FFFDF9] parchment-border rounded-xl p-8 text-center shadow-folio">
        {errorMessage ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto text-[#DC2626]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif-prestige text-xl font-bold text-[#14432A]">Authentication Failed</h2>
            <p className="text-xs text-[#6B7280]">{errorMessage}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white text-xs font-semibold transition-all shadow-sm"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-md bg-[#14432A]/10 border border-[#14432A]/20 flex items-center justify-center mx-auto text-[#14432A] animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif-prestige text-xl font-bold text-[#14432A]">Verifying Credentials</h2>
            <p className="text-xs text-[#6B7280]">
              Establishing authenticated session and loading your verified recruitment workspace...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
