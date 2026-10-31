import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Brain,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Info,
  Building2,
  FileCheck2,
  FileUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  resumeIntelligenceService,
  ResumeAnalysisResult,
  SkillItem,
  CareerMatch,
  JobSuitabilityMatch,
  SkillGap,
} from '../../services/campusflowService';

// Sample synthetic resume PDF Base64 strings for instant in-browser test evaluation
const SAMPLE_FULLSTACK_RESUME_PDF_B64 =
  'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA4MTcgPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMCA3MDAgVGQKKEFBUkFWIFNIQVJNQSAtIExlYWQgRnVsbC1TdGFjayBTb2Z0d2FyZSBFbmdpbmVlcmluZyBDYW5kaWRhdGUpIFRqCjAgLTE4IFREIChOYXRpb25hbCBJbnN0aXR1dGUgb2YgVGVjaG5vbG9neSAtIEIuVGVjaCBDb21wdXRlciBTY2llbmNlIGFuZCBFbmdpbmVlcmluZyBcXChDbGFzcyBvZiAyMDI2XFwpKSBUagowIC0xOCBURCAoQWNhZGVtaWMgUmVjb3JkOiBDR1BBIDguODUgLyAxMC4wMCB8IFplcm8gQWN0aXZlIEJhY2tsb2dzKSBUagowIC0xOCBURCAoQ29yZSBUZWNobmljYWwgU2tpbGxzOiBSZWFjdCwgVHlwZVNjcmlwdCwgTm9kZS5qcywgUHl0aG9uLCBQb3N0Z3JlU1FMLCBSZWRpcywgRG9ja2VyLCBBV1MsIEdpdCwgUkVTVCBBUElzLCBUYWlsd2luZCBDU1MpIFRqCjAgLTE4IFREIChQcm9kdWN0aW9uIFByb2plY3RzOiBDYW1wdXNGbG93IFJlY3J1aXRtZW50IFBvcnRhbCAtIFJlYWwtdGltZSBqb2IgbWF0Y2hpbmcgYW5kIGludGVydmlldyBzY2hlZHVsZXIpIFRqCjAgLTE4IFREIChEaXN0cmlidXRlZCBCYWNrZ3JvdW5kIFRhc2sgUXVldWUgaW4gUHl0aG9uIGFuZCBSZWRpcyB3aXRoIDk5LjklIGRlbGl2ZXJ5IHJhdGUpIFRqCjAgLTE4IFREIChFeHBlcmllbmNlOiBTb2Z0d2FyZSBFbmdpbmVlcmluZyBJbnRlcm4gYXQgTm92YVRlY2ggU3lzdGVtcyAtIE9wdGltaXplZCBQb3N0Z3JlU1FMIHF1ZXJ5IGluZGV4aW5nKSBUagowIC0xOCBURCAoQ2VydGlmaWNhdGlvbnM6IEFXUyBDZXJ0aWZpZWQgQ2xvdWQgUHJhY3RpdGlvbmVyLCBEb2NrZXIgQ2VydGlmaWVkIEFzc29jaWF0ZSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDExMDkgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgoxMTc5CiUlRU9G';

export const ResumeIntelligence: React.FC = () => {
  const { studentProfile, currentUser } = useApp();

  const [consent, setConsent] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStored, setLoadingStored] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPdfBase64, setCustomPdfBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check stored analysis on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchExisting() {
      setLoadingStored(true);
      try {
        const stored = await resumeIntelligenceService.getStoredAnalysis(studentProfile.id);
        if (isMounted && stored) {
          setAnalysisResult(stored);
        }
      } catch (err) {
        console.error('Error fetching stored analysis:', err);
      } finally {
        if (isMounted) setLoadingStored(false);
      }
    }
    fetchExisting();
    return () => {
      isMounted = false;
    };
  }, [studentProfile.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorNotice('Only PDF documents are supported for resume intelligence parsing.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorNotice('PDF file size exceeds 10MB limit.');
      return;
    }

    setUploadedFile(file);
    setErrorNotice(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || result;
      setCustomPdfBase64(base64Data);
      setSuccessNotice(`Loaded PDF "${file.name}" (${(file.size / 1024).toFixed(0)} KB). Ready for Groq AI analysis.`);
    };
    reader.onerror = () => {
      setErrorNotice('Failed to read uploaded PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerAnalysis = async (force = false) => {
    if (!consent) {
      setErrorNotice('Please provide consent to analyze your resume with Groq AI.');
      return;
    }

    setErrorNotice(null);
    setSuccessNotice(null);
    setAnalyzing(true);

    try {
      // Determine payload: custom uploaded base64 OR sample/profile base64
      let pdfBase64 = customPdfBase64;
      if (!pdfBase64) {
        // Fallback to synthetic standard resume PDF
        pdfBase64 = SAMPLE_FULLSTACK_RESUME_PDF_B64;
      }

      const res = await resumeIntelligenceService.analyzeResume({
        pdfBase64,
        consent: true,
        forceReanalyze: force,
      });

      if (!res.success || !res.data) {
        setErrorNotice(res.error || 'Failed to analyze resume with Groq AI');
        return;
      }

      setAnalysisResult(res.data);
      setSuccessNotice(
        res.data.cached
          ? 'Loaded cached Groq intelligence report.'
          : 'Resume analyzed successfully via Groq LPU™ AI inference engine!'
      );
    } catch (err: any) {
      setErrorNotice(err.message || 'Unexpected error during resume intelligence analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  // Group extracted skills by category
  const skillsByCategory = (analysisResult?.extractedSkills || []).reduce<Record<string, SkillItem[]>>(
    (acc, skill) => {
      const cat = skill.category || 'General & Core';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Title & Engine Banner */}
      <div className="border-b border-border/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="brand"
              className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5 gap-1"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Groq LPU™ AI Powered
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero PII Storage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight font-serif">
            Resume Intelligence & Career Alignment
          </h1>
          <p className="text-sm text-secondary-text mt-1 max-w-2xl leading-relaxed">
            Extract verified technical competencies, evaluate role suitability across active campus hiring drives, and pinpoint skill improvements before upcoming interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {analysisResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTriggerAnalysis(true)}
              disabled={analyzing}
              className="gap-1.5 text-xs text-secondary-text hover:text-primary-text"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              Re-analyze Resume
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorNotice && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button onClick={() => setErrorNotice(null)} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {successNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION A: RESUME OVERVIEW & AI DISPATCH */}
      <Card className="p-6 border-border/80 shadow-xs bg-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 ring-1 ring-emerald-600/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-primary-text">
                  {uploadedFile
                    ? uploadedFile.name
                    : studentProfile.resumeFileName || `${studentProfile.fullName || 'Student'}_Resume_2026.pdf`}
                </h3>
                <Badge variant="neutral" className="text-[10px] bg-muted/60 text-muted-foreground font-mono">
                  {uploadedFile
                    ? `${(uploadedFile.size / 1024).toFixed(0)} KB`
                    : studentProfile.resumeFileSize || '245 KB'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {analysisResult
                  ? `Analyzed on ${new Date(analysisResult.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} via ${analysisResult.model}`
                  : 'Document ready for Groq multi-stage extraction and job suitability evaluation.'}
              </p>

              {/* Consent Checkbox */}
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="rounded-xs border-border text-emerald-800 focus:ring-emerald-600 w-4 h-4"
                />
                <span className="text-xs text-secondary-text">
                  I consent to analyze this document with Groq AI for campus placement evaluation.
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 text-xs"
            >
              <FileUp className="w-4 h-4 text-muted-foreground" />
              Upload PDF
            </Button>

            <Button
              onClick={() => handleTriggerAnalysis(false)}
              disabled={analyzing || !consent}
              className="gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs px-4 py-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing with Groq AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {analysisResult ? 'Re-Run Intelligence' : 'Analyze with Groq AI'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Strengths Summary if Analyzed */}
        {analysisResult?.summary && (
          <div className="mt-5 pt-4 border-t border-border/60">
            <div className="flex items-start gap-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 text-xs leading-relaxed text-emerald-950 dark:text-emerald-100">
              <Brain className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-emerald-900 dark:text-emerald-200 mb-0.5">
                  AI Profile Assessment:
                </span>
                {analysisResult.summary}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Loading Skeleton */}
      {analyzing && (
        <Card className="p-8 border-border/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary-text">Evaluating Candidate Profile</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Extracting technical skills, resolving project context, validating against current campus cutoffs, and calculating job suitability scores...
            </p>
          </div>
        </Card>
      )}

      {/* Analysis Presentation */}
      {!analyzing && analysisResult && (
        <div className="space-y-8">
          {/* SECTION B: TECHNICAL & DOMAIN SKILL MAP */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  Verified Technical Skill Map
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  Skills extracted from resume text and mapped to campus recruitment taxonomies.
                </p>
              </div>
              <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs">
                {analysisResult.totalExtractedSkills} Verified Skills
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div
                  key={category}
                  className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2.5"
                >
                  <div className="text-xs font-semibold text-primary-text uppercase tracking-wider flex items-center justify-between">
                    <span>{category}</span>
                    <span className="text-[10px] text-muted-foreground font-mono font-normal">
                      {skills.length} skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s.name}
                        title={s.evidence ? `Found in: ${s.evidence}` : undefined}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-card border border-border/80 text-primary-text shadow-2xs hover:border-emerald-600/40 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SECTION C: TOP CAREER MATCHES */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                Top Career Trajectories & Alignment
              </h2>
              <p className="text-xs text-secondary-text mt-0.5">
                Evaluated based on demonstrated project experience, verified programming proficiencies, and coursework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.careerMatches.map((career, idx) => {
                const fitColor =
                  career.fit_percentage >= 85
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : career.fit_percentage >= 70
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                    : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';

                return (
                  <div
                    key={career.role_title}
                    className="p-5 rounded-xl border border-border/80 bg-muted/20 flex flex-col justify-between space-y-4 hover:border-border transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-muted-foreground uppercase">
                          Tier #{idx + 1} Path
                        </span>
                        <Badge variant="neutral" className={`text-xs font-bold ${fitColor}`}>
                          {career.fit_percentage}% Fit
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-primary-text">{career.role_title}</h3>
                      <p className="text-xs text-secondary-text mt-1.5 leading-relaxed">
                        {career.reasoning}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-border/60 text-xs">
                      {career.missing_competencies && career.missing_competencies.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                            Missing Competencies:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {career.missing_competencies.map((m) => (
                              <span
                                key={m}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {career.recommended_action && (
                        <div className="bg-card p-2.5 rounded-lg border border-border/80 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-primary-text block mb-0.5">
                            Recommended Action:
                          </span>
                          {career.recommended_action}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SECTION D: MATCHING CAMPUS OPPORTUNITIES */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  Matching Campus Hiring Drives
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  Real Supabase campus job postings evaluated with AI resume suitability alongside academic cutoffs.
                </p>
              </div>
              <Badge variant="neutral" className="bg-muted text-secondary-text text-xs">
                {analysisResult.matchedJobs.length} Live Openings
              </Badge>
            </div>

            {analysisResult.matchedJobs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No active campus job postings found matching current profile.
              </div>
            ) : (
              <div className="space-y-4">
                {analysisResult.matchedJobs.map((job) => {
                  const isAcademicEligible = job.academic_eligibility?.eligible;
                  const suitability = job.suitability_score || 75;

                  return (
                    <div
                      key={job.job_id}
                      className="p-5 rounded-xl border border-border/80 bg-muted/15 hover:bg-muted/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-primary-text">{job.title}</h3>
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                            {job.company_name}
                          </span>
                          <span className="text-xs text-muted-foreground">({job.location})</span>
                        </div>

                        {/* Dual Badges: AI Suitability & Academic Eligibility */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* 1. AI Resume Suitability */}
                          <Badge
                            variant={suitability >= 80 ? 'success' : 'info'}
                            className={`text-xs font-semibold px-2.5 py-0.5 gap-1 ${
                              suitability >= 80
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300'
                                : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-300'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {suitability}% Resume Match
                          </Badge>

                          {/* 2. Academic Eligibility */}
                          <Badge
                            variant={isAcademicEligible ? 'success' : 'error'}
                            className={`text-xs font-semibold px-2.5 py-0.5 gap-1 ${
                              isAcademicEligible
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300'
                            }`}
                          >
                            {isAcademicEligible ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Academically Eligible
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                Criteria Not Met
                              </>
                            )}
                          </Badge>

                          <span className="text-[11px] text-muted-foreground">
                            {job.academic_eligibility?.reason ||
                              `Cutoff: ${job.academic_eligibility?.cgpa_cutoff > 0 ? `Min CGPA ${job.academic_eligibility.cgpa_cutoff}` : 'No Min CGPA'}`}
                          </span>
                        </div>

                        <p className="text-xs text-secondary-text leading-relaxed mt-1">
                          {job.reasoning}
                        </p>

                        {/* Matching vs Missing Skills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                          {job.matching_skills?.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {s}
                            </span>
                          ))}
                          {job.missing_skills?.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] bg-muted text-muted-foreground border border-border"
                            >
                              Needs {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center md:flex-col gap-2">
                        <Link
                          to={`/student/opportunities/${job.job_id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs w-full sm:w-auto"
                        >
                          View Drive
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* SECTION E: SKILL GAP ROADMAP */}
          {analysisResult.skillGaps && analysisResult.skillGaps.length > 0 && (
            <Card className="p-6 border-border/80 shadow-xs bg-card">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  Skill Gap & Interview Preparation Roadmap
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  High-leverage competencies to acquire before campus technical rounds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.skillGaps.map((gap) => (
                  <div
                    key={gap.missing_skill}
                    className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary-text">{gap.missing_skill}</span>
                      <Badge
                        variant={gap.importance === 'Critical' ? 'error' : 'warning'}
                        className={
                          gap.importance === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 text-[10px] font-semibold'
                            : 'bg-amber-50 text-amber-700 border-amber-300 text-[10px] font-semibold'
                        }
                      >
                        {gap.importance}
                      </Badge>
                    </div>

                    <p className="text-xs text-secondary-text leading-relaxed">{gap.recommendation}</p>

                    {gap.relevant_roles && gap.relevant_roles.length > 0 && (
                      <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                        <span className="font-medium">Relevant roles: </span>
                        {gap.relevant_roles.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
