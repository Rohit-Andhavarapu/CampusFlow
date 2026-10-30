import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, Briefcase, Layers, ArrowRight, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

export const DemoLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'student' as const,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      sub: 'B.Tech CSE • 8.85 CGPA • 3 Applications',
      icon: GraduationCap,
      color: '#72F4D1',
      bg: 'bg-teal-950/40 border-teal-500/30',
      badge: 'Student Persona',
    },
    {
      role: 'recruiter' as const,
      name: 'Priya Nair',
      email: 'priya.nair@novatech.io',
      sub: 'NovaTech Systems • 7 Job Postings • 16 Applicants',
      icon: Briefcase,
      color: '#59D9FF',
      bg: 'bg-cyan-950/40 border-cyan-500/30',
      badge: 'Recruiter Persona',
    },
    {
      role: 'admin' as const,
      name: 'Dr. K. R. Rao',
      email: 'placements@campus.edu',
      sub: 'Director of T&P • 55% Batch Placed • NAAC Audit',
      icon: Layers,
      color: '#A78BFA',
      bg: 'bg-purple-950/40 border-purple-500/30',
      badge: 'Placement Dean',
    },
  ];

  const handleDemoSignIn = async (account: typeof demoAccounts[0]) => {
    setLoadingRole(account.role);
    try {
      const res = await login(account.email, 'CampusFlow2026!');
      if (res.success) {
        navigate(`/${account.role}/dashboard`);
      } else {
        showToast('error', 'Sign In Failed', res.error || 'Authentication error');
      }
    } catch (err: any) {
      showToast('error', 'Authentication Error', err.message);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B12] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-2xl bg-[#0B111B] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Landing Page
        </Link>

        {/* Warning Badge */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/50 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Hackathon Evaluation Environment Only
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              This controlled test console is isolated from the public website for jury inspection. Selecting a persona creates an authentic Supabase session backed by Row Level Security policies.
            </p>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select Evaluation Persona
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-8">
          One-click cryptographic authentication into verified recruitment roles:
        </p>

        <div className="space-y-4">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            const isLoading = loadingRole === account.role;

            return (
              <button
                key={account.role}
                onClick={() => handleDemoSignIn(account)}
                disabled={loadingRole !== null}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 active:scale-[0.98] flex items-center justify-between gap-4 ${
                  account.bg
                } hover:border-white/30`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${account.color}15`, border: `1px solid ${account.color}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: account.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">{account.name}</span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: account.color, backgroundColor: `${account.color}15` }}
                      >
                        {account.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{account.email}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{account.sub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-white flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#72F4D1]" />
                  ) : (
                    <>
                      <span>Launch</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-slate-500">
          <span>Protected by Supabase Row Level Security</span>
          <Link to="/login" className="text-teal-400 hover:underline">
            Use standard email/password login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
