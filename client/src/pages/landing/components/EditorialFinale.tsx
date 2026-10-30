import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

export const EditorialFinale: React.FC = () => {
  return (
    <section className="py-24 md:py-36 bg-[#FAF8F5] border-t linen-rule text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
        
        {/* Subtle Crest Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-4 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
          <GraduationCap className="w-3.5 h-3.5 text-[#14432A]" />
          <span>The New Standard in University Recruitment</span>
        </div>

        {/* Grand Headline */}
        <h2 className="font-serif-prestige text-4xl sm:text-6xl text-[#14432A] leading-[1.08] tracking-[-0.025em] font-semibold">
          Where academic achievement <span className="italic font-normal">becomes career opportunity.</span>
        </h2>

        {/* Narrative Paragraph */}
        <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-normal">
          Join thousands of students and leading engineering recruiters on the recruitment platform built for transparency, deterministic qualification, and verified career momentum.
        </p>

        {/* Action Gateways */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#14432A] hover:bg-[#0F3521] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 border border-[#0F3521]"
          >
            <span>Register as Student</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880]" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#FFFDF9] hover:bg-[#F4F1EA] text-[#14432A] parchment-border font-semibold text-sm transition-all flex items-center justify-center active:scale-98 shadow-sm"
          >
            Sign In to Portal
          </Link>
        </div>

        {/* Stately Micro-Proof */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            Pre-Screened Academic Cutoffs
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            Explainable Eligibility Logic
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            Direct Recruiter Video Dispatch
          </span>
        </div>

      </div>
    </section>
  );
};
