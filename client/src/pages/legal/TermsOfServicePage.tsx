import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Scale,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Building,
  ShieldAlert,
  HelpCircle,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
} from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] selection:bg-[#14432A]/15 selection:text-[#14432A] font-sans antialiased">
      {/* 1. Academic Legal Folio Masthead */}
      <header className="w-full bg-[#FAF8F5] border-b border-[#E8E4DC] sticky top-0 z-40 backdrop-blur-md bg-[#FAF8F5]/90">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 rounded-md bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-semibold text-lg shadow-sm border border-[#0F3521] transition-transform group-hover:scale-105">
              CF
            </div>
            <div>
              <span className="font-serif-prestige font-semibold text-xl tracking-tight text-[#14432A] block leading-none">
                CampusFlow
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold block mt-1">
                Institutional Terms Folio
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/privacy"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#4B5563] hover:text-[#14432A] font-medium transition-colors"
            >
              <span>Privacy Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#E8E4DC] hover:border-[#14432A] text-[#14432A] font-semibold transition-colors bg-[#FFFDF9]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Header Banner */}
      <section className="border-b border-[#E8E4DC] bg-[#FFFDF9] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15 mb-4">
            <Scale className="w-3.5 h-3.5 text-[#14432A]" />
            <span>Campus Placement Terms of Service</span>
          </div>

          <h1 className="font-serif-prestige text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14432A] tracking-tight leading-tight">
            Terms of Service
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B7280] font-mono">
            <span>Effective Date: October 31, 2026</span>
            <span>•</span>
            <span>Revision: Version 6.0 (Production Release)</span>
            <span>•</span>
            <span className="text-[#047857] font-semibold">Institutional Governance Framework</span>
          </div>

          <p className="mt-6 text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-3xl">
            These Terms of Service govern your access to and use of CampusFlow—the institutional campus recruitment, candidate credential verification, and placement intelligence platform. By creating an account or accessing the portal, you agree to comply with these terms and applicable university honor codes.
          </p>
        </div>
      </section>

      {/* 3. Main Terms Folio Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <div className="space-y-12 text-[#2D3748] text-sm leading-relaxed">

          {/* Section 1 */}
          <section id="acceptance" className="space-y-3 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">01</span>
              Acceptance of Terms & Authorized User Classes
            </h2>
            <p>
              By accessing, browsing, or signing into <strong>https://campusflow-sand.vercel.app</strong> (or any affiliated CampusFlow domain), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and our accompanying Privacy Policy.
            </p>
            <p>CampusFlow establishes three distinct authorized user classes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4B5563]">
              <li>
                <strong>Student Candidates:</strong> Bona fide registered students authorized to participate in institutional placement activities, explore campus opportunities, and submit verified dossiers.
              </li>
              <li>
                <strong>Corporate Recruiters:</strong> Authorized talent acquisition representatives of vetted corporate partners formally participating in campus placement drives.
              </li>
              <li>
                <strong>Placement Directorate Administrators:</strong> Institutional university officials tasked with drive coordination, eligibility rule enforcement, and regulatory accreditation reporting.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="academic-honor" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">02</span>
              Academic Integrity, Truth in Credentials & User Obligations
            </h2>
            <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-3">
              <div className="flex items-center gap-2.5 font-semibold text-[#14432A] text-sm">
                <GraduationCap className="w-4 h-4 text-[#14432A]" />
                <span>Strict Academic Veracity Requirement</span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Campus recruitment relies upon uncompromising academic integrity. As a student user, you warrant that all information submitted through your profile—including your <strong>Cumulative Grade Point Average (CGPA), department, graduation year, active backlogs, project contributions, and resume PDF content</strong>—is completely accurate, authentic, and free from misrepresentation.
              </p>
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <strong>Disciplinary Penalty:</strong> Falsifying academic transcripts, manipulating CGPA metrics, presenting plagiarized projects as original work, or submitting forged documentation constitutes an immediate violation of university honor codes. Discovered misrepresentations will result in immediate permanent disqualification from all campus recruitment drives and administrative referral to the University Disciplinary Committee.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="prohibited-conduct" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">03</span>
              System Security & Prohibited Activities
            </h2>
            <p>Users must not engage in any activity that compromises the integrity, availability, or security of the platform. Prohibited conduct includes, without limitation:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-[#4B5563]">
              <li>
                Attempting to circumvent, tamper with, or probe PostgreSQL Row Level Security (RLS) policies, storage access tokens, or API gateway endpoints.
              </li>
              <li>
                Uploading corrupted PDF files, password-protected archives, or documents containing executable macros, embedded malware, or exploits designed to compromise text-parsing microservices.
              </li>
              <li>
                Scraping candidate personal information, corporate job openings, or placement compensation statistics using automated scripts, bots, or unauthorized crawlers.
              </li>
              <li>
                Impersonating other candidates, recruiters, or placement officials, or sharing account credentials with third parties.
              </li>
              <li>
                Disrupting, overloading, or launching denial-of-service attacks against CampusFlow serverless edge functions or cloud hosting nodes.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="recruitment-limitations" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">04</span>
              Institutional Recruitment Scope & Limitations
            </h2>
            <p>
              CampusFlow functions strictly as an <strong>institutional enablement and workflow technology platform</strong> connecting candidates, employers, and the university placement office.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-1.5">
                <span className="font-semibold text-xs text-[#14432A] block uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  No Guarantee of Employment
                </span>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  CampusFlow does <strong>not</strong> guarantee that any student will receive interview invitations, written test clearances, shortlists, or employment offers. Meeting mathematical academic cutoff thresholds indicates eligibility to apply, not an entitlement to selection.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-1.5">
                <span className="font-semibold text-xs text-[#14432A] block uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  Independent Employer Discretion
                </span>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  All shortlisting choices, assessment test standards, compensation terms, interview schedules, and final hiring selections are decided exclusively and independently by participating corporate employers and the University Placement Directorate.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="ai-disclaimers" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">05</span>
              AI Resume Intelligence & Recommendations Disclaimer
            </h2>
            <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-3">
              <div className="flex items-center gap-2 font-semibold text-[#14432A] text-sm">
                <Sparkles className="w-4 h-4 text-[#047857]" />
                <span>Advisory Nature of Groq-Powered AI Insights</span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                CampusFlow provides AI-powered resume parsing, competency extraction, career recommendations, and job suitability ratings utilizing Groq Cloud LPU™ inference (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">openai/gpt-oss-120b</code>).
              </p>
              <div className="space-y-2 text-xs text-[#4B5563]">
                <p>
                  <strong>You expressly acknowledge and agree that:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    AI recommendations are <strong>advisory, assistive heuristic tools</strong> designed for candidate self-reflection and preparation. They do not constitute certified human career counseling, formal recruitment evaluation, or guaranteed hiring predictions.
                  </li>
                  <li>
                    Automated parsing may misclassify, omit, or misinterpret specific skills or formatting choices depending on the candidate's PDF layout.
                  </li>
                  <li>
                    Suitability percentages reflect semantic keyword and competency alignments with active job descriptions; they do not dictate corporate shortlisting decisions.
                  </li>
                  <li>
                    Candidates remain entirely responsible for reviewing, confirming, and updating their profile information and application submissions.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="intellectual-property" className="space-y-3 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">06</span>
              Intellectual Property Rights & Limited License
            </h2>
            <p className="text-xs text-[#4B5563]">
              <strong>Candidate Ownership:</strong> You retain complete intellectual property ownership over your original resume PDFs, project source code, written portfolio narratives, and personal creative works uploaded to CampusFlow.
            </p>
            <p className="text-xs text-[#4B5563]">
              <strong>Limited Operational License:</strong> By uploading documentation to CampusFlow, you grant CampusFlow and the University Placement Directorate a limited, non-exclusive, royalty-free license to store, parse, display, and transmit your resume and dossier strictly to authorized corporate recruiters for the purpose of facilitating your campus placement applications.
            </p>
            <p className="text-xs text-[#4B5563]">
              <strong>Platform Ownership:</strong> The CampusFlow platform, brand identity, Editorial Prestige visual layouts, typography systems, database architectures, and source code are the proprietary intellectual property of the project maintainers.
            </p>
          </section>

          {/* Section 7 */}
          <section id="disclaimer-liability" className="space-y-3 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">07</span>
              Warranty Disclaimer & Limitation of Liability
            </h2>
            <p className="text-xs text-[#4B5563]">
              THE CAMPUSFLOW PLATFORM IS PROVIDED ON AN <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR ENTIRELY IMMUNE TO INFRASTRUCTURE SERVICE INTERRUPTIONS BY UPSTREAM CLOUD PROVIDERS.
            </p>
            <p className="text-xs text-[#4B5563]">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAMPUSFLOW, ITS DEVELOPERS, AND INSTITUTIONAL OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR ACCESS TO, INABILITY TO ACCESS, OR RELIANCE UPON THE PLATFORM, INCLUDING LOSS OF OPPORTUNITY, DATA LOSS, OR RECRUITMENT DECISION OUTCOMES.
            </p>
          </section>

          {/* Section 8 */}
          <section id="operator-info" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">08</span>
              Governance, Operator Details & Contact Inquiries
            </h2>
            <div className="p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B7280] block font-medium">Platform Title:</span>
                  <span className="font-semibold text-[#14432A]">CampusFlow Institutional Architecture</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Lead Developer:</span>
                  <span className="font-semibold text-[#14432A]">Rohit Andhavarapu</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Verified Source Code:</span>
                  <a
                    href="https://github.com/Rohit-Andhavarapu/CampusFlow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#14432A] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Rohit-Andhavarapu/CampusFlow</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Public Production Deployment:</span>
                  <a
                    href="https://campusflow-sand.vercel.app"
                    className="text-[#14432A] font-semibold hover:underline"
                  >
                    campusflow-sand.vercel.app
                  </a>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Official Inquiries:</span>
                  <span className="font-semibold text-[#14432A]">placements@campus.edu</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Technical Support:</span>
                  <span className="font-semibold text-[#14432A]">rohit.student.test@campus.edu</span>
                </div>
              </div>

              {/* Review Flag */}
              <div className="mt-4 pt-4 border-t border-[#E8E4DC] p-3 rounded bg-amber-50/60 border-amber-200/60 flex items-start gap-2.5 text-[#92400E]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Notice for Legal Operator Review:</strong> If CampusFlow is subsequently deployed as a chartered university office entity or independent commercial software enterprise, the operator must formally designate: (a) governing state/provincial jurisdiction and dispute arbitration venue, (b) registered physical office address, and (c) official institutional chartering references.
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* 4. Dignified Institutional Footer */}
      <footer className="w-full border-t border-[#E8E4DC] bg-[#F4F1EA] py-10 text-[#6B7280] text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#14432A] flex items-center justify-center text-[#EBE5D8] font-serif-prestige font-bold text-xs">
              CF
            </div>
            <span>© {new Date().getFullYear()} CampusFlow Architecture. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <Link to="/privacy" className="hover:text-[#14432A] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="text-[#14432A] font-semibold underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-[#14432A] transition-colors">
              Public Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
