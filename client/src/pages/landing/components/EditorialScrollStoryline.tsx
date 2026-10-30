import React, { useState } from 'react';
import { CheckCircle2, Shield, Calendar, ArrowRight, FileCheck, Layers, Users, Award } from 'lucide-react';

interface StoryStage {
  step: string;
  badge: string;
  title: string;
  serifItalic: string;
  description: string;
  visualTag: string;
  metrics: { label: string; value: string }[];
  cardContent: {
    heading: string;
    subheading: string;
    details: { k: string; v: string }[];
    status: string;
  };
}

const STORY_STAGES: StoryStage[] = [
  {
    step: '01',
    badge: 'Stage 01 • Academic Foundation',
    title: 'The authoritative academic record,',
    serifItalic: 'pre-screened at the source.',
    description:
      'Rather than unverified candidate claims, CampusFlow anchors each profile to official department transcript data—guaranteeing authentic CGPA, credit milestones, and verified backlog status.',
    visualTag: 'STUDENT DOSSIER LAYER',
    metrics: [
      { label: 'CGPA Scale', value: '8.85 / 10.0' },
      { label: 'Active Backlogs', value: '0 Cleared' },
      { label: 'Verification Latency', value: '< 100 ms' },
    ],
    cardContent: {
      heading: 'Aarav Sharma — B.Tech CSE',
      subheading: 'Roll N25H02A0325 • Department of Computer Science',
      details: [
        { k: 'Core Discipline:', v: 'Computer Science & Engineering' },
        { k: 'Completed Credits:', v: '142 / 160 Credits' },
        { k: 'Academic Standing:', v: 'Top 5% Department Percentile' },
      ],
      status: 'ACADEMIC RECORD VERIFIED',
    },
  },
  {
    step: '02',
    badge: 'Stage 02 • Transparent Cutoffs',
    title: 'Explainable qualification logic,',
    serifItalic: 'with zero arbitrary rejections.',
    description:
      'Company cutoffs are evaluated transparently against student credentials. Candidates see exactly why they qualify with mathematical delta margins, eliminating silent resume black holes.',
    visualTag: 'CUTOFF ENGINE LAYER',
    metrics: [
      { label: 'NovaTech Cutoff', value: '≥ 8.00 CGPA' },
      { label: 'Qualification Margin', value: '+0.85 CGPA' },
      { label: 'Explainability', value: '100% Deterministic' },
    ],
    cardContent: {
      heading: 'NovaTech Systems Eligibility Check',
      subheading: 'Software Engineer Trainee • Drive ID #AUTUMN-2026',
      details: [
        { k: 'Minimum Required CGPA:', v: '8.00 (Student: 8.85 ✓)' },
        { k: 'Allowed Backlogs:', v: '0 (Student: 0 ✓)' },
        { k: 'Eligible Departments:', v: 'CSE, IT, ECE (Student: CSE ✓)' },
      ],
      status: 'QUALIFICATION CLEARED',
    },
  },
  {
    step: '03',
    badge: 'Stage 03 • Recruiter Dispatch',
    title: 'High-density recruiter review,',
    serifItalic: 'and instant interview scheduling.',
    description:
      'Talent acquisition leads review filtered, pre-screened talent pools without manual spreadsheet sorting. Shortlisted applicants receive scheduled interview slots with integrated video rooms.',
    visualTag: 'RECRUITER REVIEW LAYER',
    metrics: [
      { label: 'Review Speed', value: 'Instant Queue' },
      { label: 'Room Dispatch', value: 'Google Meet' },
      { label: 'Round Type', value: 'Technical Evaluation' },
    ],
    cardContent: {
      heading: 'Technical Evaluation Round Confirmed',
      subheading: 'NovaTech Systems Recruitment Desk',
      details: [
        { k: 'Scheduled Date:', v: 'November 02, 2026 • 2:00 PM IST' },
        { k: 'Video Channel:', v: 'meet.google.com/novatech-cf-0325' },
        { k: 'Lead Interviewer:', v: 'Priya Nair (Engineering Lead)' },
      ],
      status: 'INTERVIEW DISPATCHED',
    },
  },
  {
    step: '04',
    badge: 'Stage 04 • Offer Confirmation',
    title: 'From interview clearance,',
    serifItalic: 'to signed employment offer.',
    description:
      'Successful candidates receive official job offers through the platform. Placement administrators track real-time hiring metrics, average packages, and department placement percentages.',
    visualTag: 'OFFER CONFIRMATION LAYER',
    metrics: [
      { label: 'Annual Package', value: '₹18.0 LPA' },
      { label: 'Designation', value: 'Software Engineer' },
      { label: 'Offer Audit', value: 'Digitally Recorded' },
    ],
    cardContent: {
      heading: 'Official Offer of Employment',
      subheading: 'NovaTech Systems — Bangalore Campus',
      details: [
        { k: 'Designation:', v: 'Software Engineer Trainee' },
        { k: 'Fixed Annual CTC:', v: '₹18,00,000 per annum' },
        { k: 'Commencement Date:', v: 'July 15, 2027' },
      ],
      status: 'OFFER EXTENDED & ACCEPTED',
    },
  },
];

export const EditorialScrollStoryline: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStage = STORY_STAGES[activeStepIndex];

  return (
    <section className="py-20 md:py-32 bg-[#FAF8F5] border-t linen-rule relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <Layers className="w-3.5 h-3.5 text-[#14432A]" />
            <span>The Dossier Transformation Lifecycle</span>
          </div>

          <h2 className="font-serif-prestige text-3xl sm:text-5xl text-[#14432A] leading-tight font-semibold">
            How academic credentials <span className="italic font-normal">become active offers.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
            Experience the synchronized lifecycle connecting university department records, transparent cutoff filters, and verified enterprise job offers in one continuous thread.
          </p>

          {/* Interactive Step Switcher Tabs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {STORY_STAGES.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeStepIndex === idx
                    ? 'bg-[#14432A] text-white shadow-sm border border-[#0F3521]'
                    : 'bg-[#FFFDF9] parchment-border text-[#4B5563] hover:text-[#14432A] hover:bg-[#F4F1EA]'
                }`}
              >
                <span>Stage {s.step}</span>
                <span className="hidden sm:inline font-normal opacity-80 ml-1.5">
                  • {s.badge.split('• ')[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Narrative & Visual Stage Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Narrative Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5A880] block">
              {activeStage.badge}
            </span>

            <h3 className="font-serif-prestige text-3xl sm:text-4xl text-[#14432A] leading-snug font-semibold">
              {activeStage.title} <span className="italic font-normal">{activeStage.serifItalic}</span>
            </h3>

            <p className="text-base text-[#4B5563] leading-relaxed font-normal">
              {activeStage.description}
            </p>

            {/* Stage Metrics Grid */}
            <div className="pt-4 border-t linen-rule grid grid-cols-3 gap-3">
              {activeStage.metrics.map((m) => (
                <div key={m.label} className="bg-[#FFFDF9] parchment-border rounded-lg p-3">
                  <span className="font-serif-prestige text-lg font-bold text-[#14432A] block leading-tight">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-[#14432A]">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded parchment-border bg-[#FFFDF9] hover:bg-[#F4F1EA] disabled:opacity-40 transition-colors"
              >
                ← Previous Stage
              </button>
              <button
                disabled={activeStepIndex === STORY_STAGES.length - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(STORY_STAGES.length - 1, prev + 1))}
                className="px-3.5 py-2 rounded bg-[#14432A] text-white hover:bg-[#0F3521] disabled:opacity-40 transition-colors shadow-sm"
              >
                Next Stage →
              </button>
            </div>
          </div>

          {/* Stately Interactive Folio Layer */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFDF9] parchment-border rounded-xl p-6 sm:p-8 shadow-folio relative">
              
              {/* Folio Tag Strip */}
              <div className="flex items-center justify-between pb-4 border-b linen-rule">
                <span className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#6B7280]">
                  {activeStage.visualTag}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0]">
                  {activeStage.cardContent.status}
                </span>
              </div>

              {/* Dynamic Content Spread */}
              <div className="pt-6 space-y-5">
                <div>
                  <h4 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A]">
                    {activeStage.cardContent.heading}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-1 font-medium">
                    {activeStage.cardContent.subheading}
                  </p>
                </div>

                {/* Key-Value Details Paper Strip */}
                <div className="bg-[#FAF8F5] parchment-border rounded-lg p-4 space-y-2.5 text-xs">
                  {activeStage.cardContent.details.map((d) => (
                    <div key={d.k} className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b linen-rule gap-1">
                      <span className="text-[#6B7280] font-medium">{d.k}</span>
                      <span className="font-bold text-[#14432A]">{d.v}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Action Confirmation */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
                    <span>Synchronized with CampusFlow Engine</span>
                  </span>
                  <span className="font-serif-prestige italic text-[#14432A]">
                    Stage {activeStage.step} of 04
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
