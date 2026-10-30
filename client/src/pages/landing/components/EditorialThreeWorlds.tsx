import React, { useState } from 'react';
import { GraduationCap, Briefcase, Building2, CheckCircle2, ArrowRight, ShieldCheck, Calendar, TrendingUp } from 'lucide-react';

type WorldKey = 'student' | 'recruiter' | 'admin';

interface WorldData {
  key: WorldKey;
  badge: string;
  tabLabel: string;
  icon: React.ReactNode;
  heading: string;
  serifItalic: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  preview: {
    title: string;
    tag: string;
    columns: { header: string; val: string; sub?: string }[];
    actions: { label: string; primary?: boolean }[];
    stat: { label: string; value: string };
  };
}

const WORLDS: Record<WorldKey, WorldData> = {
  student: {
    key: 'student',
    badge: 'Undergraduate & Postgraduate Talent',
    tabLabel: 'Candidate Experience',
    icon: <GraduationCap className="w-4 h-4" />,
    heading: 'Know your eligibility before applying,',
    serifItalic: 'with zero guesswork.',
    description:
      'CampusFlow empowers students with transparent cutoff diagnostics. See your exact academic margin against every visiting company, apply with one click, and access confirmed interview schedules directly.',
    features: [
      'Pre-screened academic credentials matched directly against company cutoffs',
      'Explainable qualification margins showing exactly how criteria are met',
      'One-click verified applications with zero repetitive data re-entry',
      'Direct interview calendar integration with encrypted video conference rooms',
    ],
    ctaLabel: 'Register as Student',
    ctaLink: '/signup',
    preview: {
      title: 'Aarav Sharma — Student Portal Preview',
      tag: 'B.Tech CSE • CGPA 8.85',
      columns: [
        { header: 'NovaTech Systems', val: 'Shortlisted', sub: 'Technical Round: Nov 02, 2:00 PM' },
        { header: 'CloudScale Systems', val: 'Interview Confirmed', sub: 'System Design: Nov 04, 11:30 AM' },
        { header: 'Apex Global Labs', val: 'Offer Extended', sub: '₹14.0 LPA Package Sealed' },
      ],
      actions: [
        { label: 'View Application Folio', primary: true },
        { label: 'Download Transcript' },
      ],
      stat: { label: 'Eligible Opportunities', value: '18 Companies' },
    },
  },
  recruiter: {
    key: 'recruiter',
    badge: 'Talent Acquisition & Engineering Leads',
    tabLabel: 'Recruiter Studio',
    icon: <Briefcase className="w-4 h-4" />,
    heading: 'Filter top campus talent with,',
    serifItalic: 'mathematical precision.',
    description:
      'Stop sifting through unverified resumes and scattered Excel files. Define your minimum CGPA, allowed backlogs, and target departments to instantly view a 100% pre-screened candidate queue.',
    features: [
      'Automated eligibility filtration enforced at the database layer',
      'Batch candidate shortlisting with zero spreadsheet reconciliation',
      'Instant interview round creation and Google Meet link dispatch',
      'Digital offer letter issuance with transparent candidate acceptance',
    ],
    ctaLabel: 'Recruiter Access',
    ctaLink: '/login',
    preview: {
      title: 'NovaTech Systems — Talent Acquisition Queue',
      tag: 'Software Engineer Trainee • ₹18.0 LPA',
      columns: [
        { header: 'Aarav Sharma', val: 'CGPA 8.85', sub: 'Technical Round Dispatched' },
        { header: 'Diya Patel', val: 'CGPA 9.12', sub: 'Coding Assessment Cleared' },
        { header: 'Rohan Iyer', val: 'CGPA 8.40', sub: 'Under Evaluation (+0.40 Margin)' },
      ],
      actions: [
        { label: 'Dispatch Shortlist', primary: true },
        { label: 'Adjust Cutoff Criteria' },
      ],
      stat: { label: 'Pre-Screened Candidates', value: '42 Qualified' },
    },
  },
  admin: {
    key: 'admin',
    badge: 'University Placement Directorate',
    tabLabel: 'Placement Cell',
    icon: <Building2 className="w-4 h-4" />,
    heading: 'Coordinate multi-company drives with,',
    serifItalic: 'total administrative clarity.',
    description:
      'Give university leadership, department deans, and placement officers an authoritative command center to manage campus recruitment drives, verify student eligibility, and export audit-ready reports.',
    features: [
      'Real-time batch placement percentage and salary package distribution',
      'Centralized company registration, drive scheduling, and job postings',
      'Department-level performance analytics for academic accreditation reviews',
      'Complete transparency and accountability across every recruitment round',
    ],
    ctaLabel: 'Placement Cell Sign In',
    ctaLink: '/login',
    preview: {
      title: 'Directorate of Training & Placements — Annual Drive 2026',
      tag: 'Class of 2026 • Live Monitoring',
      columns: [
        { header: 'Total Registered Batch', val: '320 Students', sub: '100% Academic Data Verified' },
        { header: 'Active Visiting Companies', val: '24 Enterprises', sub: '8 Drives in Progress' },
        { header: 'Average Compensation', val: '₹12.4 LPA', sub: 'Highest: ₹18.0 LPA' },
      ],
      actions: [
        { label: 'Export Placement Report', primary: true },
        { label: 'Publish Drive Notice' },
      ],
      stat: { label: 'Placement Ratio', value: '78.5% Placed' },
    },
  },
};

export const EditorialThreeWorlds: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<WorldKey>('student');
  const world = WORLDS[activeWorld];

  return (
    <section id="three-worlds" className="py-20 md:py-32 bg-[#FFFDF9] border-t linen-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <Building2 className="w-3.5 h-3.5 text-[#14432A]" />
            <span>Three Synchronized Workstations</span>
          </div>

          <h2 className="font-serif-prestige text-3xl sm:text-5xl text-[#14432A] leading-tight font-semibold">
            One platform. <span className="italic font-normal">Three distinct perspectives.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
            CampusFlow connects candidates, enterprise recruiters, and placement officers on a unified architecture where every action is synchronized and transparent.
          </p>

          {/* Stately Editorial Tab Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1.5 rounded-lg bg-[#FAF8F5] parchment-border">
              {(['student', 'recruiter', 'admin'] as WorldKey[]).map((k) => {
                const w = WORLDS[k];
                const isActive = activeWorld === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActiveWorld(k)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#14432A] text-white shadow-sm border border-[#0F3521]'
                        : 'text-[#4B5563] hover:text-[#14432A] hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <span>{w.icon}</span>
                    <span>{w.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Workstation Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5A880] block">
              {world.badge}
            </span>

            <h3 className="font-serif-prestige text-3xl sm:text-4xl text-[#14432A] leading-snug font-semibold">
              {world.heading} <span className="italic font-normal">{world.serifItalic}</span>
            </h3>

            <p className="text-base text-[#4B5563] leading-relaxed font-normal">
              {world.description}
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {world.features.map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#14432A]/10 text-[#14432A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-[#4B5563] font-medium leading-relaxed">
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href={world.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white font-semibold text-sm transition-all shadow-sm active:scale-98 border border-[#0F3521]"
              >
                <span>{world.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </a>
            </div>
          </div>

          {/* Stately Interactive UI Preview Folio */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] parchment-border rounded-xl p-6 sm:p-8 shadow-folio space-y-6">
              
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b linen-rule gap-2">
                <div>
                  <h4 className="font-serif-prestige text-lg font-bold text-[#14432A]">
                    {world.preview.title}
                  </h4>
                  <span className="text-xs text-[#6B7280] font-medium">
                    {world.preview.tag}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif-prestige text-xl font-bold text-[#14432A] block leading-none">
                    {world.preview.stat.value}
                  </span>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                    {world.preview.stat.label}
                  </span>
                </div>
              </div>

              {/* Data Rows Preview */}
              <div className="space-y-3">
                {world.preview.columns.map((col, idx) => (
                  <div
                    key={col.header}
                    className="p-3.5 bg-[#FFFDF9] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-subsheet"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#14432A] block">
                        {col.header}
                      </span>
                      {col.sub && (
                        <span className="text-[11px] text-[#6B7280] block mt-0.5">
                          {col.sub}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-semibold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] self-start sm:self-center">
                      {col.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {world.preview.actions.map((act) => (
                  <button
                    key={act.label}
                    className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                      act.primary
                        ? 'bg-[#14432A] text-white hover:bg-[#0F3521] shadow-sm'
                        : 'bg-[#FFFDF9] parchment-border text-[#4B5563] hover:bg-[#EFECE4]'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
