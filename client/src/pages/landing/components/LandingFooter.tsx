import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#03070D] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand & Purpose */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F766E] to-[#72F4D1] p-0.5">
              <div className="w-full h-full bg-[#060B12] rounded-[6px] flex items-center justify-center">
                <span className="text-[#72F4D1] font-black text-sm tracking-tighter">CF</span>
              </div>
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight font-sans">
              Campus<span className="text-[#72F4D1]">Flow</span>
            </span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            The next-generation campus recruitment ecosystem. Uniting student potential, enterprise hiring, and institutional accreditation into one synchronized digital workstation.
          </p>

          <div className="pt-2 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#72F4D1]" />
            <span>PostgreSQL RLS • Explainable Eligibility • Zero Slop</span>
          </div>
        </div>

        {/* Directory Links */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h5 className="font-bold text-white text-base mb-3">
              Student Portal
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/student/opportunities" className="hover:text-[#72F4D1] transition-colors">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/student/applications" className="hover:text-[#72F4D1] transition-colors">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link to="/student/interviews" className="hover:text-[#72F4D1] transition-colors">
                  Interview Schedule
                </Link>
              </li>
              <li>
                <Link to="/student/profile" className="hover:text-[#72F4D1] transition-colors">
                  Verified Academic Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-base mb-3">
              Recruiter Suite
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/recruiter/applicants" className="hover:text-[#72F4D1] transition-colors">
                  Ashby Split-Pane Review
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-[#72F4D1] transition-colors">
                  Publish Cutoff Postings
                </Link>
              </li>
              <li>
                <Link to="/recruiter/interviews" className="hover:text-[#72F4D1] transition-colors">
                  Interview Scheduling
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-[#72F4D1] transition-colors">
                  Company Empanelment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-base mb-3">
              Placement Cell
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#72F4D1] transition-colors">
                  Placement Command Center
                </Link>
              </li>
              <li>
                <Link to="/admin/students" className="hover:text-[#72F4D1] transition-colors">
                  Student Directory (20)
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="hover:text-[#72F4D1] transition-colors">
                  NAAC / NIRF Exports
                </Link>
              </li>
              <li>
                <Link to="/admin/drives" className="hover:text-[#72F4D1] transition-colors">
                  Recruitment Drives (3)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 gap-4">
        <p>© 2026 CampusFlow Technologies. Built for Google Antigravity • Hackathon HACK-P410.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic & Enterprise Excellence.
        </p>
      </div>
    </footer>
  );
};
