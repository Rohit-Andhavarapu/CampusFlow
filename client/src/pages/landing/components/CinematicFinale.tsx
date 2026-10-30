import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const CinematicFinale: React.FC = () => {
  return (
    <footer className="w-full bg-[#04080E] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Final Call to Action Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pb-20">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Your next opportunity starts here.
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Join ambitious students, premier enterprise recruiters, and university placement directors transforming the campus recruitment experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white font-semibold text-sm transition-all duration-150 active:scale-[0.98] border border-[#72F4D1]/40 flex items-center justify-center gap-2"
          >
            <span>Register as Student</span>
            <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-150 active:scale-[0.98] border border-white/10 flex items-center justify-center gap-2"
          >
            <span>Sign In to Portal</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#72F4D1]" />
            <span>Pre-screened eligibility algorithm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#72F4D1]" />
            <span>Encrypted cloud resume storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#72F4D1]" />
            <span>Instant NAAC / NIRF compliance reporting</span>
          </div>
        </div>
      </div>

      {/* Directory Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] border border-[#72F4D1]/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#72F4D1]" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Campus<span className="text-[#72F4D1]">Flow</span>
              </span>
            </div>
            <p className="text-base text-slate-400 max-w-sm leading-relaxed">
              The next-generation campus recruitment platform empowering universities, enterprise recruiters, and students with transparent, automated hiring pipelines.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production v4.0 • Live Database Active</span>
            </div>
          </div>

          {/* Column 1: For Students */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">For Students</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#eligibility" className="hover:text-white transition-colors">Cutoff Simulator</a></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Student Registration</Link></li>
              <li><a href="#journey" className="hover:text-white transition-colors">Career Timeline</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          {/* Column 2: For Recruiters */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">For Employers</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#recruiters" className="hover:text-white transition-colors">Split-Pane Queue</a></li>
              <li><a href="#platform" className="hover:text-white transition-colors">Drive Coordination</a></li>
              <li><a href="#journey" className="hover:text-white transition-colors">Google Meet Dispatch</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Corporate Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Administration */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Placement Teams</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#students" className="hover:text-white transition-colors">Institutional Metrics</a></li>
              <li><a href="#platform" className="hover:text-white transition-colors">NIRF & NAAC Audits</a></li>
              <li><a href="#journey" className="hover:text-white transition-colors">Candidate Allocation</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Dean Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Security Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} CampusFlow Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
