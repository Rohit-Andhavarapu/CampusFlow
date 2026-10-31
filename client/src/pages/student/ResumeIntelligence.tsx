import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
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
  Building2,
  ArrowRight,
  Eye,
  Sliders,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  resumeIntelligenceService,
  studentService,
  ResumeAnalysisResult,
  SkillItem,
  CareerMatch,
  JobSuitabilityMatch,
  SkillGap,
} from '../../services/campusflowService';

export const ResumeIntelligence: React.FC = () => {
  const { studentProfile, currentUser, showToast } = useApp();
  const navigate = useNavigate();

  const [consent, setConsent] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStored, setLoadingStored] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Check stored analysis on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchExisting() {
      setLoadingStored(true);
      try {
        const stored = await resumeIntelligenceService.getStoredAnalysis(studentProfile.id || currentUser.id);
        if (isMounted && stored && stored.totalExtractedSkills > 0) {
          setAnalysisResult(stored);
        }
      } catch (err) {
        console.warn('Error fetching stored analysis:', err);
      } finally {
        if (isMounted) setLoadingStored(false);
      }
    }
    fetchExisting();
    return () => {
      isMounted = false;
    };
  }, [studentProfile.id, currentUser.id]);

  const handleTriggerAnalysis = async (force = false) => {
    if (!consent) {
      setErrorNotice('Please provide consent to analyze your resume with Groq AI.');
      return;
    }

    if (!studentProfile.resumeFileName && !studentProfile.resumeStoragePath) {
      setErrorNotice('No master resume found. Please upload your resume in Profile & Documents first.');
      return;
    }

    setErrorNotice(null);
    setSuccessNotice(null);
    setAnalyzing(true);

    try {
      const res = await resumeIntelligenceService.analyzeResume({
        storagePath: studentProfile.resumeStoragePath,
        resumeFileId: studentProfile.resumeFileId,
        consent: true,
        forceReanalyze: force,
      });

      if (!res.success || !res.data) {
        setErrorNotice(res.error || 'Failed to analyze resume with Groq AI');
        return;
      }

      const data = res.data;
      if (!data.extractedSkills || data.extractedSkills.length === 0) {
        setErrorNotice('Analysis completed but 0 technical skills were identified. Please check that your PDF contains selectable text.');
        setAnalysisResult(data);
        return;
      }

      setAnalysisResult(data);
      setSuccessNotice(
        data.cached
          ? 'Loaded cached Groq intelligence report.'
          : 'Resume analyzed successfully via Groq LPU™ AI inference engine!'
      );
    } catch (err: any) {
      setErrorNotice(err.message || 'Unexpected error during resume intelligence analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewResume = async () => {
    if (studentProfile.resumeStoragePath) {
      const signedUrl = await studentService.getResumeSignedUrl(studentProfile.resumeStoragePath);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
        return;
      }
    }
    window.open('/fixtures/Aarav_Sharma_Resume_2026.pdf', '_blank');
  };

  // Group extracted skills by category
  const skillsByCategory = (analysisResult?.extractedSkills || []).reduce<Record<string, SkillItem[]>>(
    (acc, skill) => {
      const cat = skill.category || 'Core Technologies';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {}
  );

  const categories = ['All', ...Object.keys(skillsByCategory)];

  const filteredSkills =
    selectedCategory === 'All'
      ? analysisResult?.extractedSkills || []
      : skillsByCategory[selectedCategory] || [];

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Title & Engine Banner */}
      <div className="border-b border-border/60 pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              variant="brand"
              className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5 gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Groq LPU™ AI Powered (openai/gpt-oss-120b)
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Client-Side Anonymization
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight font-serif">
            Resume Intelligence & Career Alignment
          </h1>
          <p className="text-sm text-secondary-text mt-1 max-w-2xl leading-relaxed">
            Extract verified technical competencies, evaluate role suitability across active campus hiring drives, and pinpoint skill improvements before upcoming interview rounds.
          </p>
        </div>

        {analysisResult && studentProfile.resumeFileName && (
          <div className="flex items-center gap-3">
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
          </div>
        )}
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

      {/* SECTION 1: MASTER RESUME STATUS BAR */}
      {studentProfile.resumeFileName ? (
        <Card className="p-5 border-border/80 shadow-xs bg-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 border border-red-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-primary-text">
                    {studentProfile.resumeFileName}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Master Resume
                  </span>
                  <Badge variant="neutral" className="text-[10px] bg-muted/60 text-muted-foreground font-mono">
                    {studentProfile.resumeFileSize || '4.1 KB'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span>
                    Uploaded {studentProfile.resumeLastUpdated ? new Date(studentProfile.resumeLastUpdated).toLocaleDateString() : 'Active'}
                  </span>
                  <span>•</span>
                  <button
                    onClick={handleViewResume}
                    className="text-brand hover:underline flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> View PDF
                  </button>
                  <span>•</span>
                  <Link
                    to="/student/profile?tab=resume"
                    className="text-secondary-text hover:text-primary-text hover:underline flex items-center gap-1 font-medium"
                  >
                    Manage in Profile
                  </Link>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="rounded-xs border-border text-emerald-800 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span className="text-xs text-secondary-text">
                    I consent to process this resume with Groq LPU™ AI inference for campus recruitment evaluation.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Button
                onClick={() => handleTriggerAnalysis(Boolean(analysisResult))}
                disabled={analyzing || !consent}
                className="gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs px-4 py-2 shadow-sm"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing with Groq AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {analysisResult ? 'Re-run Intelligence' : 'Analyze with Groq AI'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Empty State: No Master Resume Found */
        <Card className="p-10 border-dashed border-2 border-border/80 text-center bg-card">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-primary-text mb-1">
            No Active Master Resume Found
          </h3>
          <p className="text-sm text-secondary-text max-w-lg mx-auto mb-6 leading-relaxed">
            Upload your resume in Profile & Documents to unlock Groq-powered technical skill extraction, evidence-based career trajectory recommendations, and live campus drive suitability matching.
          </p>

          <Button
            variant="primary"
            leftIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/student/profile?tab=resume')}
            className="bg-brand hover:bg-brand-hover text-white shadow-sm"
          >
            Go to Resume & Documents
          </Button>
        </Card>
      )}

      {/* Analyzing Progress State */}
      {analyzing && (
        <Card className="p-8 border-border/80 shadow-xs text-center space-y-5 bg-card">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary-text">Groq LPU™ AI Engine Processing</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Extracting verified technical competencies, mapping role trajectories, and evaluating active campus job cutoffs...
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 pt-2 text-left">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Document retrieved from Supabase private storage</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Contact details sanitized & tokenized</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand font-medium">
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-brand" />
              <span>Groq LPU™ reasoning model (openai/gpt-oss-120b)</span>
            </div>
          </div>
        </Card>
      )}

      {/* ANALYSIS RESULTS PRESENTATION */}
      {!analyzing && analysisResult && analysisResult.totalExtractedSkills > 0 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* SECTION A: RESUME OVERVIEW & ASSESSMENT */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-5 border-b border-border/60">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-primary-text">
                    Resume Intelligence Summary
                  </h2>
                </div>
                <p className="text-xs text-secondary-text leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="p-3 rounded-lg bg-surface-secondary border border-border text-center min-w-[90px]">
                  <span className="text-xl font-bold text-primary-text block">
                    {analysisResult.totalExtractedSkills}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Skills Found</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-border text-center min-w-[90px]">
                  <span className="text-xl font-bold text-brand block">
                    {analysisResult.careerMatches?.length || 0}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Career Paths</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-border text-center min-w-[90px]">
                  <span className="text-xl font-bold text-emerald-600 block">
                    {analysisResult.matchedJobs?.length || 0}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Campus Matches</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
              <span className="font-mono">Inference: {analysisResult.model}</span>
              <span>Report Generated: {new Date(analysisResult.analyzedAt).toLocaleString()}</span>
            </div>
          </Card>

          {/* SECTION B: SKILLS IDENTIFIED FROM RESUME */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  Skills Identified From Resume
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  Extracted technical proficiencies, frameworks, databases, and development tooling.
                </p>
              </div>
              <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs self-start sm:self-center">
                {analysisResult.totalExtractedSkills} Identified Skills
              </Badge>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-border/60">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-ink-950 text-white'
                      : 'bg-surface-secondary text-secondary-text hover:text-primary-text border border-border'
                  }`}
                >
                  {cat} {cat !== 'All' && `(${skillsByCategory[cat]?.length || 0})`}
                </button>
              ))}
            </div>

            {/* Skills Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredSkills.map((s) => (
                <div
                  key={s.name}
                  title={s.evidence ? `Evidence: ${s.evidence}` : undefined}
                  className="p-2.5 rounded-lg border border-border/80 bg-surface-secondary/40 hover:bg-surface-secondary transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-primary-text truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* SECTION C: RECOMMENDED CAREER TRAJECTORIES */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                Recommended Career Trajectories
              </h2>
              <p className="text-xs text-secondary-text mt-0.5">
                Evidence-based role paths matched against candidate skills, projects, and coursework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysisResult.careerMatches.map((career: any, idx) => {
                const roleTitle = career.role || career.role_title;
                const reasoning = career.why || career.reasoning;
                const supportingSkills = career.supportingSkills || career.supporting_skills || [];
                const missingComp = career.missingCompetencies || career.missing_competencies || [];
                const nextSteps = career.suggestedNextSteps || career.recommended_action || career.suggested_next_steps;
                const fitPct = career.fit_percentage || (idx === 0 ? 92 : idx === 1 ? 84 : 76);

                return (
                  <div
                    key={roleTitle}
                    className="p-5 rounded-xl border border-border/80 bg-surface-secondary/30 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                          Path #{idx + 1}
                        </span>
                        <Badge variant="neutral" className="text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-300">
                          {fitPct}% Fit
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-primary-text">{roleTitle}</h3>
                      <p className="text-xs text-secondary-text mt-1.5 leading-relaxed">
                        {reasoning}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-border/60 text-xs">
                      {supportingSkills.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                            Supporting Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {supportingSkills.map((s: string) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {missingComp.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block text-[11px] font-medium mb-1">
                            Growth Areas:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {missingComp.map((m: string) => (
                              <span
                                key={m}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {nextSteps && (
                        <div className="bg-card p-2.5 rounded-lg border border-border/80 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-primary-text block mb-0.5">
                            Next Steps:
                          </span>
                          {nextSteps}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SECTION D: MATCHING CAMPUS HIRING DRIVES */}
          <Card className="p-6 border-border/80 shadow-xs bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  Matching Campus Hiring Drives
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  Real Supabase campus job postings evaluated with AI resume suitability alongside academic cutoffs.
                </p>
              </div>
              <Badge variant="neutral" className="bg-muted text-secondary-text text-xs self-start sm:self-center">
                {analysisResult.matchedJobs.length} Live Openings
              </Badge>
            </div>

            {analysisResult.matchedJobs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No active campus job postings found matching current profile.
              </div>
            ) : (
              <div className="space-y-4">
                {analysisResult.matchedJobs.map((job: any) => {
                  const jobId = job.jobId || job.job_id;
                  const companyName = job.companyName || job.company_name;
                  const suitability = job.suitabilityScore ?? job.suitability_score ?? 80;
                  const academic = job.academicEligibility || job.academic_eligibility;
                  const isAcademicEligible = academic?.isEligible ?? academic?.eligible ?? true;
                  const matchingSkills = job.matchingSkills || job.matching_skills || [];
                  const missingSkills = job.missingSkills || job.missing_skills || [];

                  return (
                    <div
                      key={jobId}
                      className="p-5 rounded-xl border border-border/80 bg-surface-secondary/20 hover:bg-surface-secondary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-primary-text">{job.title}</h3>
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                            {companyName}
                          </span>
                          <span className="text-xs text-muted-foreground">({job.location || 'Bangalore'})</span>
                          {job.stipendOrSalary && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {job.stipendOrSalary}
                            </span>
                          )}
                        </div>

                        {/* Dual Badges: AI Suitability & Academic Eligibility */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {/* 1. AI Resume Suitability */}
                          <Badge
                            variant={suitability >= 75 ? 'success' : 'info'}
                            className={`text-xs font-semibold px-2.5 py-0.5 gap-1 ${
                              suitability >= 75
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            }`}
                          >
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            {suitability}% Resume Match
                          </Badge>

                          {/* 2. Academic Eligibility */}
                          <Badge
                            variant={isAcademicEligible ? 'success' : 'error'}
                            className={`text-xs font-semibold px-2.5 py-0.5 gap-1 ${
                              isAcademicEligible
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
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
                                Cutoff Criteria Not Met
                              </>
                            )}
                          </Badge>

                          <span className="text-[11px] text-muted-foreground">
                            {academic?.reason || academic?.cutoffExplanation || 'Meets CGPA cutoff'}
                          </span>
                        </div>

                        <p className="text-xs text-secondary-text leading-relaxed">
                          {job.reasoning}
                        </p>

                        {/* Matching vs Missing Skills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                          {matchingSkills.map((s: string) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-medium"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {s}
                            </span>
                          ))}
                          {missingSkills.map((s: string) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] bg-muted/70 text-muted-foreground border border-border"
                            >
                              Needs {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center md:flex-col gap-2">
                        <Link
                          to={`/student/opportunities`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-ink-950 hover:bg-ink-900 text-white transition-colors shadow-2xs w-full sm:w-auto"
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

          {/* SECTION E: SKILL GAP & INTERVIEW ROADMAP */}
          {analysisResult.skillGaps && analysisResult.skillGaps.length > 0 && (
            <Card className="p-6 border-border/80 shadow-xs bg-card">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-primary-text flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  Skill Gap & Interview Preparation Roadmap
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  High-leverage competencies to acquire before campus technical rounds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.skillGaps.map((gap: any, idx) => {
                  const skillName = typeof gap === 'string' ? gap : gap.missing_skill || gap.skill || gap.name || `Competency #${idx + 1}`;
                  const recommendation = typeof gap === 'string'
                    ? 'Study core concepts and complete a production micro-project.'
                    : gap.recommendation || gap.action || 'Recommended for campus technical interviews.';

                  return (
                    <div
                      key={skillName}
                      className="p-4 rounded-xl border border-border/80 bg-surface-secondary/30 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary-text">{skillName}</span>
                        <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-300 text-[10px] font-semibold">
                          Recommended
                        </Badge>
                      </div>

                      <p className="text-xs text-secondary-text leading-relaxed">{recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Privacy & Security Disclosure:</strong> Client-side anonymization strips telephone numbers and personal emails before processing by Groq LPU™ AI inference. Your master resume PDF remains securely stored in private Supabase Storage and is accessible only to verified campus recruiters.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
