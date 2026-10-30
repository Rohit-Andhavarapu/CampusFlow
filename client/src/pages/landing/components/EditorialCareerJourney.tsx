import React, { useState } from 'react';
import { CheckCircle2, Shield, Calendar, ArrowRight, Award, ChevronRight, FileCheck, ExternalLink } from 'lucide-react';

interface JourneyStep {
  step: string;
  stageName: string;
  badge: string;
  headline: string;
  subheadline: string;
  verificationItem: string;
  details: string[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: '01',
    stageName: 'Academic Qualification',
    badge: 'STAGE 01 • OFFICIAL TRANSCRIPT',
    headline: 'Pre-Screened Academic Standing',
    subheadline: 'Aarav Sharma • B.Tech Computer Science',
    verificationItem: '8.85 / 10.00 CGPA • 0 Backlogs',
    details: [
      'Official student transcript synchronized from university department records',
      'Zero self-reported or unverified GPA claims permitted',
      'Automated backlog check verifies immediate eligibility status',
    ],
  },
  {
    step: '02',
    stageName: 'Cutoff Matching',
    badge: 'STAGE 02 • CRITERIA EVALUATION',
    headline: 'Deterministic Cutoff Clearance',
    subheadline: 'NovaTech Systems • Software Engineer Trainee',
    verificationItem: 'Eligible (+0.85 Margin Cleared)',
    details: [
      'Company criteria: Minimum 8.00 CGPA & 0 active backlogs',
      'Student profile evaluated with mathematical delta margin calculation',
      'Applicant informed of exact eligibility status prior to submitting',
    ],
  },
  {
    step: '03',
    stageName: 'Interview Dispatch',
    badge: 'STAGE 03 • ROUND SCHEDULING',
    headline: 'Live Video Room & Schedule Dispatch',
    subheadline: 'Round 2: Technical Systems Evaluation',
    verificationItem: 'Nov 02, 2026 • 2:00 PM IST',
    details: [
      'Recruiter shortlists qualified candidate with single-click action',
      'Instant calendar integration with confirmed Google Meet room',
      'Both candidate and interviewers receive direct encrypted room links',
    ],
  },
  {
    step: '04',
    stageName: 'Official Offer',
    badge: 'STAGE 04 • PLACEMENT RECORD',
    headline: 'Signed Employment Agreement',
    subheadline: '₹18.0 LPA Annual Compensation Package',
    verificationItem: 'Offer Confirmed & Recorded',
    details: [
      'Official digital offer letter issued through CampusFlow portal',
      'Candidate review, digital acceptance, and milestone confirmation',
      'Placement office records updated for institutional accreditation reports',
    ],
  },
];

export const EditorialCareerJourney: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState(0);
  const activeStep = JOURNEY_STEPS[selectedStep];

  return (
    <section id="journey" className="py-20 md:py-32 bg-[#FFFDF9] border-t linen-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <Award className="w-3.5 h-3.5 text-[#14432A]" />
            <span>The Living Career Pathway</span>
          </div>

          <h2 className="font-serif-prestige text-3xl sm:text-5xl text-[#14432A] leading-tight font-semibold">
            From verified credentials <span className="italic font-normal">to signed employment offer.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
            Borrowing the empowering momentum of the career journey, structured within the dignified aesthetic of an academic institution.
          </p>
        </div>

        {/* 4-Stage Horizontal Journey Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {JOURNEY_STEPS.map((step, idx) => {
            const isSelected = selectedStep === idx;
            return (
              <div
                key={step.step}
                onClick={() => setSelectedStep(idx)}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-2 border-[#14432A] shadow-folio'
                    : 'bg-[#FFFDF9] parchment-border hover:bg-[#FAF8F5] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b linen-rule">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#14432A] text-white'
                        : 'bg-[#EFECE4] text-[#4B5563]'
                    }`}
                  >
                    {step.step}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {step.stageName}
                  </span>
                </div>

                <div className="pt-3.5 space-y-1">
                  <h4 className="font-serif-prestige text-base font-bold text-[#14432A]">
                    {step.headline}
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    {step.subheadline}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-[#047857] pt-1.5">
                    ✓ {step.verificationItem}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Folio */}
        <div className="bg-[#FAF8F5] parchment-border rounded-xl p-6 sm:p-8 shadow-subsheet">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C5A880] block">
                {activeStep.badge}
              </span>
              <h3 className="font-serif-prestige text-2xl sm:text-3xl font-bold text-[#14432A]">
                {activeStep.headline}
              </h3>
              <p className="text-sm text-[#4B5563] font-medium">
                {activeStep.subheadline}
              </p>

              <div className="space-y-2 pt-2">
                {activeStep.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#047857] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 self-start lg:self-center">
              <a
                href="#dossier"
                className="px-5 py-3 rounded-md bg-[#14432A] text-white text-xs sm:text-sm font-semibold hover:bg-[#0F3521] shadow-sm flex items-center justify-center gap-2 border border-[#0F3521]"
              >
                <span>Inspect in Dossier</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </a>
              <a
                href="#cutoff"
                className="px-5 py-3 rounded-md bg-[#FFFDF9] parchment-border text-[#14432A] text-xs sm:text-sm font-semibold hover:bg-[#EFECE4] text-center"
              >
                Simulate Cutoff Margin
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
