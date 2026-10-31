import React from 'react';
import { Link } from 'react-router-dom';

export const EditorialFooter: React.FC = () => {
  return (
    <footer className="w-full border-t linen-rule bg-[#F4F1EA] py-12 text-[#6B7280] text-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b linen-rule">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-semibold text-base shadow-sm">
                CF
              </div>
              <span className="font-serif-prestige font-semibold text-lg text-[#14432A]">
                CampusFlow
              </span>
            </div>
            <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed">
              The unified university recruitment platform connecting ambitious candidates, high-growth engineering recruiters, and placement administration with mathematical cutoff transparency.
            </p>
            <p className="text-[11px] text-[#9CA3AF]">
              Designed with academic prestige, clear typography, and complete explainability.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-2.5">
            <span className="font-semibold text-xs text-[#14432A] uppercase tracking-wider block">
              The Platform
            </span>
            <ul className="space-y-1.5">
              <li><a href="#platform" className="hover:text-[#14432A] transition-colors">Overview</a></li>
              <li><a href="#dossier" className="hover:text-[#14432A] transition-colors">Credential Dossier</a></li>
              <li><a href="#cutoff" className="hover:text-[#14432A] transition-colors">Cutoff Engine</a></li>
              <li><a href="#journey" className="hover:text-[#14432A] transition-colors">Career Timeline</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <span className="font-semibold text-xs text-[#14432A] uppercase tracking-wider block">
              Portals & Gateways
            </span>
            <ul className="space-y-1.5">
              <li><Link to="/login" className="hover:text-[#14432A] transition-colors">Student Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-[#14432A] transition-colors">Student Registration</Link></li>
              <li><Link to="/login" className="hover:text-[#14432A] transition-colors">Recruiter Studio</Link></li>
              <li><Link to="/login" className="hover:text-[#14432A] transition-colors">Placement Directorate</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <span className="font-semibold text-xs text-[#14432A] uppercase tracking-wider block">
              Security & Architecture
            </span>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Row-Level Security (RLS) enforced at the database level. Direct OAuth integration with Google authentication. Zero demo bypasses on public endpoints.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#047857] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#047857]"></span>
              <span>PostgreSQL RLS Active</span>
            </div>
          </div>

        </div>

        {/* Bottom Rights Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
          <div>
            © {new Date().getFullYear()} CampusFlow Architecture. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#14432A] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#14432A] transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/demo" className="hover:text-[#14432A] transition-colors">Evaluation Sandbox</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
