import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Sparkles,
  Server,
  UserCheck,
  Trash2,
  Mail,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Database,
  Building,
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
                Institutional Legal Folio
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/terms"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#4B5563] hover:text-[#14432A] font-medium transition-colors"
            >
              <span>Terms of Service</span>
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#14432A]" />
            <span>Official Legal Governance Document</span>
          </div>

          <h1 className="font-serif-prestige text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14432A] tracking-tight leading-tight">
            CampusFlow Privacy Policy
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B7280] font-mono">
            <span>Effective Date: October 31, 2026</span>
            <span>•</span>
            <span>Revision: Version 6.0 (Production Release)</span>
            <span>•</span>
            <span className="text-[#047857] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
              PostgreSQL Row Level Security Active
            </span>
          </div>

          <p className="mt-6 text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-3xl">
            CampusFlow is an institutional campus recruitment and career intelligence platform. This Privacy Policy details how we collect, process, isolate, and safeguard candidate, recruiter, and placement administration data across our public web application, Supabase cloud infrastructure, private document storage, and Groq-powered AI inference services.
          </p>
        </div>
      </section>

      {/* 3. Main Policy Folio Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <div className="space-y-12 text-[#2D3748] text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section id="introduction" className="space-y-3 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">01</span>
              Institutional Scope & Principles
            </h2>
            <p>
              CampusFlow operates as an authoritative campus placement and recruitment coordination environment developed to serve institutional candidates, corporate recruiting partners, and university placement directorates (developed under Hackathon Problem Reference <strong>HACK-P410</strong>).
            </p>
            <p>
              We adhere to strict data-minimization, mathematical cutoff explainability, and account-isolation principles. We <strong>do not sell, monetize, or broker</strong> candidate personal data, and we do not expose private resumes or academic transcripts to search engines or unauthorized third parties.
            </p>
          </section>

          {/* Section 2 */}
          <section id="data-collected" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">02</span>
              Information We Collect & Store
            </h2>
            <p>
              To provide role-based workspaces, evaluate eligibility criteria, and facilitate lawful recruitment drives, CampusFlow processes the following categories of information:
            </p>

            <div className="space-y-4 mt-4">
              {/* 2.1 Google OAuth */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-2">
                <div className="flex items-center gap-2.5 font-semibold text-[#14432A] text-sm">
                  <UserCheck className="w-4 h-4 text-[#14432A]" />
                  <span>2.1 Google OAuth Authentication Information</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  When you authenticate via Google Sign-In, we receive strictly standard public identity profile scopes authorized by Google OAuth 2.0 (specifically: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">email</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">profile</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">openid</code>). This includes your <strong>full name, Google email address, and avatar image URL</strong>.
                </p>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  CampusFlow <strong>never</strong> receives, stores, or requests access to your Google password, contacts, Google Drive files, Gmail messages, calendar entries, or any other private Google Workspace data.
                </p>
              </div>

              {/* 2.2 Academic Profile */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-2">
                <div className="flex items-center gap-2.5 font-semibold text-[#14432A] text-sm">
                  <Database className="w-4 h-4 text-[#14432A]" />
                  <span>2.2 Student Academic Dossier & Profile Data</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  To verify your academic qualifications against corporate placement eligibility rules (e.g., minimum CGPA thresholds, allowed departments, and maximum backlog limits), we store your academic profile in our PostgreSQL database hosted on Supabase Cloud. This includes:
                </p>
                <ul className="list-disc pl-5 text-xs text-[#4B5563] space-y-1">
                  <li>University Registration / Roll Number (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">N25H02A0325</code>).</li>
                  <li>Academic Department & Degree (e.g., Computer Science & Engineering, B.Tech).</li>
                  <li>Graduation Batch year, verified Cumulative Grade Point Average (CGPA), and active backlogs.</li>
                  <li>Technical skills declared in your profile or verified through resume intelligence.</li>
                  <li>Project portfolios, code repository URLs, and personal contact telephone numbers.</li>
                </ul>
              </div>

              {/* 2.3 Resumes */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-2">
                <div className="flex items-center gap-2.5 font-semibold text-[#14432A] text-sm">
                  <FileText className="w-4 h-4 text-[#14432A]" />
                  <span>2.3 Private Master PDF Resumes</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  When you upload a master resume, the PDF file is uploaded directly to a <strong>private, non-public Supabase Storage bucket</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">resumes</code>). Files are constrained strictly to the <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">application/pdf</code> MIME type with a maximum allowable file size of 5 MB.
                </p>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  No public HTTP web address is generated for your resume. Resumes are accessed exclusively through time-limited, cryptographically signed URLs verified against database Row Level Security policies.
                </p>
              </div>

              {/* 2.4 Recruiter and Admin Data */}
              <div className="p-4 sm:p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-2">
                <div className="flex items-center gap-2.5 font-semibold text-[#14432A] text-sm">
                  <Building className="w-4 h-4 text-[#14432A]" />
                  <span>2.4 Recruiter & Placement Administration Records</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  For corporate recruiters and institutional placement administrators, we store corporate email addresses, corporate affiliations, job opening specifications, interview schedules, evaluation notes, and application status decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="groq-ai" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">03</span>
              Groq-Powered AI Resume Intelligence & Candidate Consent
            </h2>
            <p>
              CampusFlow features an AI-assisted Resume Intelligence system designed to extract verified technical skills, propose personalized career trajectories, highlight competency gaps, and calculate suitability matches against live campus postings.
            </p>

            <div className="p-5 rounded-lg bg-[#F3F9F5] border border-[#BDE0CE] space-y-3">
              <div className="flex items-center gap-2 font-semibold text-[#14432A] text-sm">
                <Sparkles className="w-4 h-4 text-[#047857]" />
                <span>Strict Explicit Consent Requirement</span>
              </div>
              <p className="text-xs text-[#1F4B34] leading-relaxed">
                <strong>We never analyze resumes automatically upon upload.</strong> AI analysis is executed <em>only</em> when the student actively checks the explicit consent checkbox (affirming: <em>"I authorize CampusFlow to process my uploaded resume text with Groq AI..."</em>) and manually clicks the <strong>Analyze Master Resume</strong> action button.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#4B5563]">
              <h3 className="font-semibold text-sm text-[#14432A]">How Resume AI Processing Functions:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Serverless Text Extraction:</strong> Our secure serverless Edge Function downloads your private PDF from Supabase Storage and parses raw text using standard PDF parsing libraries.
                </li>
                <li>
                  <strong>Pre-Transmission Data Sanitization & Anonymization:</strong> Before transmitting resume text to the AI model, our backend applies regex sanitization to redact phone numbers (replaced with <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">[PHONE REDACTED]</code>) and personal email addresses (replaced with <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">[EMAIL REDACTED]</code>).
                </li>
                <li>
                  <strong>Inference Provider:</strong> Sanitized text is transmitted over TLS 1.3 to Groq Cloud's LPU™ (Language Processing Unit) inference platform via the OpenAI-compatible API using the <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">openai/gpt-oss-120b</code> high-reasoning open-weights model.
                </li>
                <li>
                  <strong>Stateless Processing:</strong> Under Groq Cloud's commercial API terms, customer API requests are processed statelessly in memory and are <strong>not used to train or fine-tune</strong> general public artificial intelligence foundation models.
                </li>
                <li>
                  <strong>Structured Persistence:</strong> Structured outputs (skills, recommended trajectories, matching scores) are returned to your account and cached in your private records so that repeated inference is minimized.
                </li>
              </ol>
            </div>
          </section>

          {/* Section 4 */}
          <section id="information-sharing" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">04</span>
              Information Sharing & Disclosures
            </h2>
            <p>
              Your data is shared strictly within the necessary parameters of campus recruitment operations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-1.5">
                <span className="font-semibold text-xs text-[#14432A] block uppercase tracking-wider">
                  Participating Corporate Recruiters
                </span>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  When you submit an application to an active job posting, your academic dossier, verified CGPA, skills, and resume PDF become visible to verified recruiters representing that specific employer. Recruiters cannot view your applications to other companies.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-1.5">
                <span className="font-semibold text-xs text-[#14432A] block uppercase tracking-wider">
                  Placement Directorate Administration
                </span>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Institutional placement officers have administrative access to monitor drive progress, verify cutoff eligibility, validate student registration rosters, dispatch interview slots, and generate accreditation reports (e.g. NAAC/NIRF).
                </p>
              </div>
            </div>

            <p className="text-xs text-[#4B5563]">
              <strong>Third-Party Infrastructure Sub-Processors:</strong> We utilize trusted, enterprise-grade cloud service providers to operate CampusFlow:
            </p>
            <ul className="list-disc pl-5 text-xs text-[#4B5563] space-y-1">
              <li><strong>Supabase Cloud:</strong> Managed PostgreSQL database, GoTrue authentication, and S3-compatible private object storage.</li>
              <li><strong>Vercel Inc.:</strong> Global edge network hosting our static Single Page Application (SPA).</li>
              <li><strong>Groq Inc.:</strong> High-throughput AI inference hardware hosting resume extraction models.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="security-rls" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">05</span>
              Data Security & PostgreSQL Row Level Security (RLS)
            </h2>
            <p>
              CampusFlow relies on database-level security policies rather than relying solely on client-side frontend code:
            </p>
            <ul className="list-disc pl-5 text-xs text-[#4B5563] space-y-2">
              <li>
                <strong>PostgreSQL Row Level Security (RLS):</strong> Every database table (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">student_profiles</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">applications</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">interviews</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">resume_files</code>, etc.) has strict RLS enabled. A student's JWT token allows them to read and write only rows matching their authenticated user UUID.
              </li>
              <li>
                <strong>Zero Inherited Data:</strong> Newly registered real users are cryptographically isolated from pre-seeded evaluation demo accounts. Real users start with zero applications, zero interviews, zero inherited resumes, and an empty document repository.
              </li>
              <li>
                <strong>Route Authorization Guards:</strong> Non-administrative accounts attempting to navigate to recruiter or placement administrator paths are intercepted and redirected to their authorized dashboard.
              </li>
              <li>
                <strong>Encryption:</strong> All web traffic is strictly served over HTTPS with TLS 1.3. Cloud databases and storage buckets enforce encryption at rest using industry-standard AES-256.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="retention-rights" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">06</span>
              Data Retention, Document Control & Deletion Rights
            </h2>
            <p>
              Candidates retain active control over their recruitment documentation and personal data:
            </p>
            <div className="space-y-3 text-xs text-[#4B5563]">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC]">
                <FileText className="w-4 h-4 text-[#14432A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14432A] block mb-0.5">Resume Replacement & Download</strong>
                  You may download your active master resume via signed URL or replace it with an updated PDF at any time in <em>Profile & Resume → Resume & Documents</em>. Replacing your resume updates the active document for future job applications.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC]">
                <Trash2 className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-900 block mb-0.5">Resume Deletion</strong>
                  You can delete your master resume directly from the application interface. This deletes the physical PDF object from private storage and purges the corresponding database record.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC]">
                <Lock className="w-4 h-4 text-[#14432A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#14432A] block mb-0.5">Full Account & Profile Deletion</strong>
                  Candidates wishing to permanently purge their account, application history, and academic profile from the database may submit a formal erasure request to the Placement Directorate or system administrators.
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="operator-contact" className="space-y-4 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">07</span>
              Platform Operator, Governance & Contact Information
            </h2>
            <p>
              CampusFlow is developed and maintained as a verified institutional recruitment platform. The technical architecture and system governance are managed as follows:
            </p>

            <div className="p-5 rounded-lg bg-[#FFFDF9] border border-[#E8E4DC] space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B7280] block font-medium">Project Designation:</span>
                  <span className="font-semibold text-[#14432A]">CampusFlow Institutional Platform (HACK-P410)</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Lead Developer / Maintainer:</span>
                  <span className="font-semibold text-[#14432A]">Rohit Andhavarapu</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Repository / Source Control:</span>
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
                  <span className="text-[#6B7280] block font-medium">Public Production Domain:</span>
                  <a
                    href="https://campusflow-sand.vercel.app"
                    className="text-[#14432A] font-semibold hover:underline"
                  >
                    campusflow-sand.vercel.app
                  </a>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Placement Directorate Contact:</span>
                  <span className="font-semibold text-[#14432A]">placements@campus.edu</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block font-medium">Technical Support Inquiries:</span>
                  <span className="font-semibold text-[#14432A]">rohit.student.test@campus.edu</span>
                </div>
              </div>

              {/* Operator Legal Entity Notice / Review Flag */}
              <div className="mt-4 pt-4 border-t border-[#E8E4DC] p-3 rounded bg-amber-50/60 border-amber-200/60 flex items-start gap-2.5 text-[#92400E]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Notice for Legal & Operator Review:</strong> CampusFlow is currently operating under institutional hackathon and academic deployment parameters. If deployed as a commercial corporate entity or officially chartered university body, the operator must review and register: (a) the formal incorporated legal entity name, (b) registered physical office headquarters address, (c) local state/provincial jurisdiction, and (d) designated Data Protection Officer (DPO) phone number.
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="policy-updates" className="space-y-3 scroll-mt-24">
            <h2 className="font-serif-prestige text-xl sm:text-2xl font-bold text-[#14432A] flex items-center gap-3 border-b border-[#E8E4DC] pb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#14432A]/10 text-[#14432A]">08</span>
              Policy Updates & Amendments
            </h2>
            <p className="text-xs text-[#4B5563]">
              We may update this Privacy Policy from time to time to reflect operational modifications, regulatory adjustments, or feature enhancements. The effective revision date at the top of this document indicates when changes were last codified. Continued use of CampusFlow following any amendments constitutes acknowledgment of the revised Privacy Policy.
            </p>
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
            <Link to="/privacy" className="text-[#14432A] font-semibold underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#14432A] transition-colors">
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
