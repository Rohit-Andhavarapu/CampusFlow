import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Calendar, Video, FileText, ChevronRight, Sparkles } from 'lucide-react';

interface OpportunityRecord {
  company: string;
  role: string;
  packageLPA: string;
  status: 'SHORTLISTED FOR INTERVIEW' | 'OFFER EXTENDED' | 'UNDER EVALUATION';
  cutoffRequired: string;
  roundTitle: string;
  scheduledTime: string;
  meetLink: string;
  tagColor: string;
}

const OPPORTUNITIES: OpportunityRecord[] = [
  {
    company: 'NovaTech Systems',
    role: 'Software Engineer Trainee',
    packageLPA: '₹18.0 LPA',
    status: 'SHORTLISTED FOR INTERVIEW',
    cutoffRequired: '≥ 8.00 CGPA',
    roundTitle: 'Technical Evaluation Round',
    scheduledTime: 'Nov 02, 2026 • 2:00 PM IST',
    meetLink: 'meet.google.com/novatech-cf-0325',
    tagColor: 'text-[#047857] bg-[#ECFDF5] border-[#A7F3D0]',
  },
  {
    company: 'CloudScale Systems',
    role: 'Backend Infrastructure Engineer',
    packageLPA: '₹16.5 LPA',
    status: 'SHORTLISTED FOR INTERVIEW',
    cutoffRequired: '≥ 7.50 CGPA',
    roundTitle: 'System Design Interview',
    scheduledTime: 'Nov 04, 2026 • 11:30 AM IST',
    meetLink: 'meet.google.com/cloudscale-cf-0325',
    tagColor: 'text-[#1E40AF] bg-[#EFF6FF] border-[#BFDBFE]',
  },
  {
    company: 'Apex Global Labs',
    role: 'Distributed Systems Associate',
    packageLPA: '₹14.0 LPA',
    status: 'OFFER EXTENDED',
    cutoffRequired: '≥ 7.00 CGPA',
    roundTitle: 'Executive Partner Interview',
    scheduledTime: 'Completed • Offer Dispatched',
    meetLink: 'meet.google.com/apex-cf-0325',
    tagColor: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
  },
];

export const EditorialHero: React.FC = () => {
  const [selectedOppIndex, setSelectedOppIndex] = useState(0);
  const [isDossierFoldOpen, setIsDossierFoldOpen] = useState(true);

  const activeOpp = OPPORTUNITIES[selectedOppIndex];

  return (
    <section id="platform" className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 md:pt-14 pb-16 md:pb-24 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Narrative Column: Stately Editorial Essay */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Institutional Ecosystem Pill */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            <span>Verified University Placement Ecosystem</span>
          </div>

          {/* Stately Serif Headline */}
          <h1 className="font-serif-prestige text-4xl sm:text-5xl lg:text-[54px] text-[#14432A] leading-[1.10] tracking-[-0.02em] font-semibold">
            Where academic achievement <span className="italic font-normal">becomes career opportunity.</span>
          </h1>

          {/* Narrative Subtitle */}
          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed font-normal">
            CampusFlow replaces fragmented spreadsheets with an authoritative student dossier—connecting verified academic standing directly to transparent recruiter cutoffs and verified interview scheduling.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="#dossier"
              className="px-6 py-3.5 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 border border-[#0F3521]"
            >
              <span>Explore Credential Folio</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </a>
            <a
              href="#cutoff"
              className="px-6 py-3.5 rounded-md bg-[#F2EFE8] hover:bg-[#EBE6DC] text-[#14432A] parchment-border font-semibold text-sm transition-all flex items-center justify-center active:scale-98"
            >
              View Cutoff Diagnostics
            </a>
          </div>

          {/* Verified Placement Metrics Strip */}
          <div className="pt-6 border-t linen-rule grid grid-cols-3 gap-4 text-left">
            <div>
              <span className="font-serif-prestige text-2xl font-bold text-[#14432A] block">100%</span>
              <span className="text-xs text-[#6B7280] font-medium">Verified CGPA Data</span>
            </div>
            <div>
              <span className="font-serif-prestige text-2xl font-bold text-[#14432A] block">0 Backlogs</span>
              <span className="text-xs text-[#6B7280] font-medium">Active Clearance</span>
            </div>
            <div>
              <span className="font-serif-prestige text-2xl font-bold text-[#14432A] block">₹18.0 LPA</span>
              <span className="text-xs text-[#6B7280] font-medium">Top Tier Shortlist</span>
            </div>
          </div>

        </div>

        {/* Right Visual Centerpiece: The Student Credential Folio & Unfolding Opportunity Layer */}
        <div id="dossier" className="lg:col-span-7">
          <div className="bg-[#FFFDF9] parchment-border rounded-xl p-6 sm:p-8 shadow-folio relative transition-all duration-300">
            
            {/* Folio Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b linen-rule gap-2.5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
                  Official Student Dossier
                </span>
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF] hidden sm:inline-block"></span>
                <span className="text-xs font-serif-prestige italic text-[#14432A]">
                  Record Folio #2026-CSE-0325
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#14432A] bg-[#14432A]/10 border border-[#14432A]/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#14432A]" />
                  Verified Profile
                </span>
              </div>
            </div>

            {/* Student Core Credentials Section */}
            <div className="pt-6 pb-5 border-b linen-rule">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#EFECE4] border border-[#E2DDD3] flex items-center justify-center font-serif-prestige font-bold text-lg text-[#14432A] shadow-sm">
                    AS
                  </div>
                  <div>
                    <h3 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] leading-tight">
                      Aarav Sharma
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
                      B.Tech Computer Science & Engineering • Roll N25H02A0325
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif-prestige text-2xl font-bold text-[#14432A] block leading-none">
                    8.85 <span className="text-xs font-sans font-normal text-[#6B7280]">/ 10.00</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#047857] mt-1 block">
                    0 Active Backlogs Cleared
                  </span>
                </div>
              </div>

              {/* Academic Disciplines & Tags */}
              <div className="mt-4 pt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-[#F4F1EA] border border-[#E5E1D7] text-[#4B5563]">
                  Full-Stack Systems
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F4F1EA] border border-[#E5E1D7] text-[#4B5563]">
                  TypeScript & React
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F4F1EA] border border-[#E5E1D7] text-[#4B5563]">
                  PostgreSQL & Systems
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F4F1EA] border border-[#E5E1D7] text-[#4B5563]">
                  Distributed Architecture
                </span>
              </div>
            </div>

            {/* Document-to-Opportunity Layer Header */}
            <div className="pt-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#14432A] uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#14432A]" />
                    Cutoff Verification & Interview Dispatch
                  </span>
                  <button
                    onClick={() => setIsDossierFoldOpen(!isDossierFoldOpen)}
                    className="text-[11px] text-[#14432A] underline underline-offset-2 hover:opacity-80 transition-opacity ml-2"
                  >
                    {isDossierFoldOpen ? 'Collapse Fold' : 'Unfold Layer'}
                  </button>
                </div>
                <span className="text-[11px] text-[#047857] font-semibold">
                  Matched (Requirement: {activeOpp.cutoffRequired})
                </span>
              </div>

              {/* Unfolding Mechanical Opportunity Card */}
              {isDossierFoldOpen && (
                <div className="bg-[#FAF8F5] parchment-border rounded-lg p-4 sm:p-5 shadow-subsheet transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b linen-rule">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#14432A]">
                          {activeOpp.company}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeOpp.tagColor}`}>
                          {activeOpp.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
                        {activeOpp.role} • <span className="font-semibold text-[#14432A]">{activeOpp.packageLPA}</span> Package
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-[#14432A] block">
                        {activeOpp.roundTitle}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        {activeOpp.scheduledTime}
                      </span>
                    </div>
                  </div>

                  {/* Dispatch Room & Confirmation Trigger */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#4B5563] font-mono text-[11px] w-full sm:w-auto">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                      <span>{activeOpp.meetLink}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className="px-3 py-1.5 rounded bg-[#14432A] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Interview Confirmed</span>
                      </span>
                    </div>
                  </div>

                  {/* Multi-Opportunity Switcher Pills */}
                  <div className="mt-3 pt-3 border-t linen-rule flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6B7280]">
                      Matching Opportunities:
                    </span>
                    <div className="flex gap-1.5">
                      {OPPORTUNITIES.map((opp, idx) => (
                        <button
                          key={opp.company}
                          onClick={() => setSelectedOppIndex(idx)}
                          className={`text-[11px] px-2.5 py-1 rounded transition-colors font-medium ${
                            selectedOppIndex === idx
                              ? 'bg-[#14432A] text-white'
                              : 'bg-[#EFECE4] text-[#4B5563] hover:bg-[#E5E0D5]'
                          }`}
                        >
                          {opp.company.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Folio Stately Footer Strip */}
            <div className="mt-5 pt-3 border-t linen-rule flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B7280] gap-2">
              <span>Continuous Synchronization via CampusFlow Platform</span>
              <span>Audited Placement Record</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
