import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Share2,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { checkJobEligibility, formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, applications, studentProfile, applyToJob, showToast } = useApp();

  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-primary-text">Opportunity Not Found</h2>
        <p className="text-xs text-secondary-text mt-1">This job opening may have expired or been removed.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/student/opportunities')}>
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const eligibility = checkJobEligibility(job, studentProfile);
  const currentApplication = applications.find(
    (a) => a.jobId === job.id && a.status !== 'Withdrawn'
  );
  const isApplied = Boolean(currentApplication);

  const handleApply = () => {
    if (isApplied) {
      showToast('info', 'Already Applied', 'You have already submitted an application for this opportunity.');
      return;
    }

    if (!eligibility.isEligible) {
      setIsEligibilityModalOpen(true);
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      applyToJob(job.id);
      setIsApplying(false);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/opportunities')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-primary-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('success', 'Link Copied', 'Opportunity link copied to clipboard.');
            }}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <Card className="p-6 border-border shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-16 h-16 rounded-2xl object-cover border border-border shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-secondary-text">{job.companyName}</span>
                <span className="text-slate-300">•</span>
                <Badge variant="brand" size="sm">
                  {job.workMode}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {job.type}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary-text mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary-text">
                  <Briefcase className="w-4 h-4 text-brand" />
                  {job.stipendOrSalary}
                </span>
                {job.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Duration: {job.duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Apply By: <strong>{formatDate(job.applyBy)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick status badge in header */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
            {isApplied ? (
              <div className="text-right">
                <Badge variant="warning" dot size="md">
                  Status: {currentApplication?.status}
                </Badge>
                <p className="text-[11px] text-muted-text mt-1">
                  Applied on {formatDate(currentApplication?.appliedAt || '')}
                </p>
              </div>
            ) : eligibility.isEligible ? (
              <Badge variant="success" dot size="md">
                You are Eligible
              </Badge>
            ) : (
              <Badge variant="error" dot size="md">
                Eligibility Check Failed
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Main Content vs Side Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Job Description, Criteria, Responsibilities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transparent Eligibility Breakdown Panel */}
          <Card className="p-5 border-brand/20 bg-brand-surface/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary-text">Transparent Eligibility Evaluation</h3>
                  <p className="text-xs text-secondary-text">
                    Audited in real-time against your verified college academic records.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-surface"
                onClick={() => setIsEligibilityModalOpen(true)}
              >
                Inspect All Checks
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-brand/10 text-xs">
              {eligibility.criteria.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-surface border border-border/60 flex items-start gap-2.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-primary-text">{c.label}</p>
                    <p className="text-secondary-text text-[11px] mt-0.5">
                      Req: {c.requiredValue} | You: {c.studentValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* About The Role */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-primary-text">About The Role</h3>
            <p className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-bold text-primary-text mb-3">Key Responsibilities</h4>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-secondary-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-bold text-primary-text mb-3">Required Qualifications & Skills</h4>
              <ul className="space-y-2">
                {job.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-secondary-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-bold text-primary-text mb-3">Target Skill Stack</h4>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => {
                  const hasSkill = studentProfile.skills.some(
                    (s) => s.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5 ${
                        hasSkill
                          ? 'bg-brand-surface text-brand border-brand/30'
                          : 'bg-surface-secondary text-secondary-text border-border'
                      }`}
                    >
                      {hasSkill && <Check className="w-3 h-3 text-brand" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* About Company & Verified Links */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-primary-text">About {job.companyName}</h3>
            <p className="text-xs text-secondary-text mt-1">
              Verified campus hiring partner participating in placement drive 2026.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              {job.websiteUrl && (
                <a
                  href={job.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  Visit Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {job.linkedinUrl && (
                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  LinkedIn Page <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Action & Update Timeline Panel (Inspired directly by user reference 2!) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Apply Box */}
          <Card className="p-6 border-border shadow-card space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider">
                Application Status
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xl font-bold text-primary-text">{job.stipendOrSalary}</span>
                <span className="text-xs font-medium text-secondary-text">
                  {job.openings} Openings
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Eligibility Verdict</span>
                {eligibility.isEligible ? (
                  <span className="font-semibold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                  </span>
                ) : (
                  <span className="font-semibold text-error flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Criteria Not Met
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Attached Resume</span>
                <span className="font-medium text-primary-text truncate max-w-[150px]">
                  {studentProfile.resumeFileName || 'None uploaded'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Application Deadline</span>
                <span className="font-semibold text-primary-text">{formatDate(job.applyBy)}</span>
              </div>
            </div>

            {/* Application CTA */}
            {isApplied ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => navigate(`/student/applications/${currentApplication?.id}`)}
                >
                  View Application Timeline
                </Button>
                <p className="text-[11px] text-center text-muted-text">
                  You submitted this application on {formatDate(currentApplication?.appliedAt || '')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-md"
                  isLoading={isApplying}
                  disabled={!eligibility.isEligible}
                  onClick={handleApply}
                >
                  {eligibility.isEligible ? 'Apply For Opportunity' : 'Ineligible to Apply'}
                </Button>
                {!eligibility.isEligible && (
                  <p className="text-[11px] text-center text-error font-medium">
                    {eligibility.reasons[0] || 'Requirements not satisfied.'}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Job Updates Timeline Strip (Directly reproducing the user reference 2 workflow!) */}
          <Card className="p-5">
            <h4 className="text-sm font-bold text-primary-text mb-1">Recruitment Updates</h4>
            <p className="text-xs text-secondary-text mb-4">
              Real-time progression status from the employer campus panel.
            </p>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {isApplied ? (
                <>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-brand ring-4 ring-brand-surface" />
                    <p className="text-xs font-bold text-primary-text">Application Submitted</p>
                    <p className="text-[11px] text-muted-text">
                      Forwarded to {job.companyName} recruitment team.
                    </p>
                  </div>

                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-slate-300" />
                    <p className="text-xs font-bold text-secondary-text">Next Update Window</p>
                    <p className="text-[11px] text-muted-text">
                      Waiting for company review. Screening updates expected within 5-7 working days.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-text pl-2">
                  Submit your application to begin receiving real-time interview and shortlist alerts.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Transparent Eligibility Explainer Modal */}
      <Dialog
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        title="Eligibility Criteria Verification"
        description={`Audit details for ${job.title} at ${job.companyName}`}
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsEligibilityModalOpen(false)}>
            Close Inspection
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border/80 text-xs">
            <p className="font-semibold text-primary-text">Why does CampusFlow show this?</p>
            <p className="text-secondary-text mt-0.5">
              To eliminate opaque rejections, every placement opening evaluates candidate credentials transparently against university placement cell guidelines.
            </p>
          </div>

          <div className="space-y-3">
            {eligibility.criteria.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded-card border flex items-start gap-3 ${
                  c.passed ? 'bg-success-surface/40 border-success-border' : 'bg-error-surface/40 border-error-border'
                }`}
              >
                {c.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-primary-text">{c.label}</h4>
                  <p className="text-xs text-secondary-text mt-1">{c.details}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-muted-text">
                    <span>Required: <strong className="text-primary-text">{c.requiredValue}</strong></span>
                    <span>•</span>
                    <span>Your Record: <strong className="text-primary-text">{c.studentValue}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
