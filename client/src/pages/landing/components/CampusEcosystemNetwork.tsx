import React from 'react';
import { ShieldCheck, Database, Award, ArrowUpRight, Cpu } from 'lucide-react';

export const CampusEcosystemNetwork: React.FC = () => {
  return (
    <div data-ui="ecosystem-network" className="w-full max-w-5xl mx-auto bg-[#0B111B] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Architectural Pillars */}
        <div className="lg:col-span-5 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-[#72F4D1] bg-[#72F4D1]/10 border border-[#72F4D1]/30 font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            Security Architecture
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Trust Across Every Role.
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            CampusFlow operates on strict PostgreSQL Row Level Security. Recruiters can only access candidates who explicitly applied to their empanelled openings, students view only their own dossiers, and administrators maintain comprehensive audit custody.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#72F4D1] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white">Row Level Security Enforced</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">14 PostgreSQL tables protected by non-bypassable row-level policies.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Database className="w-5 h-5 text-[#59D9FF] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white">Atomic State Transitions</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Status changes execute in isolated PL/pgSQL transactions with immutable audit trails.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Award className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-white">One-Click Regulatory Compliance</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">NIRF and NAAC placement metrics compute directly without manual spreadsheets.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Network Diagram */}
        <div className="lg:col-span-7 bg-[#060B12] border border-white/10 rounded-2xl p-6 sm:p-8 relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-semibold">
            <span className="text-[#72F4D1]">NETWORK TOPOLOGY</span>
            <span className="text-slate-400">STATUS: AUTHORITATIVE</span>
          </div>

          {/* Connected Network Diagram */}
          <div className="py-8 relative flex flex-col items-center justify-center space-y-8">
            {/* Top Node: Institutional Admin */}
            <div className="p-4 rounded-xl bg-[#0B111B] border border-purple-500/40 text-center shadow-lg w-64 z-10">
              <span className="text-[10px] text-purple-400 uppercase font-bold block">Regulatory Authority</span>
              <span className="text-xs font-bold text-white block mt-0.5">Placement Directorate (T&P)</span>
              <span className="text-[10px] text-slate-400">Class 2026 NIRF Audit Custody</span>
            </div>

            {/* Connecting Vertical Energy Conduits */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-teal-500 animate-pulse" />

            {/* Middle Node: Central Transaction Hub */}
            <div className="p-4 rounded-2xl bg-[#0F766E]/20 border border-[#72F4D1]/40 text-center shadow-xl w-72 z-10">
              <span className="text-[10px] text-[#72F4D1] uppercase font-bold block">CampusFlow Core Hub</span>
              <span className="text-sm font-extrabold text-white block mt-0.5">PostgreSQL Engine & RLS Boundary</span>
              <span className="text-[10px] text-teal-200">6 Companies • 7 Postings • 20 Students</span>
            </div>

            {/* Connecting Vertical Energy Conduits */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 animate-pulse" />

            {/* Bottom Row: Students & Recruiters */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-3.5 rounded-xl bg-[#0B111B] border border-[#72F4D1]/30 text-center shadow">
                <span className="text-[10px] text-[#72F4D1] uppercase font-bold block">Candidate Persona</span>
                <span className="text-xs font-bold text-white block mt-0.5">Student Portal</span>
                <span className="text-[10px] text-slate-400">Aarav Sharma • CSE</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B111B] border border-[#59D9FF]/30 text-center shadow">
                <span className="text-[10px] text-[#59D9FF] uppercase font-bold block">Employer Persona</span>
                <span className="text-xs font-bold text-white block mt-0.5">Recruiter Workstation</span>
                <span className="text-[10px] text-slate-400">Priya Nair • NovaTech</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>ISOLATION: SECURE</span>
            <span>TOKEN: JWT GO-TRUE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
