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
  ExternalLink,
  Share2,
  ShieldCheck,
  Check,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dialog } from '../../components/ui/Dialog';
import { checkJobEligibility, formatDate } from '../../utils/formatters';

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
        <h2 className="text-xl font-bold text-ink-950">Opportunity Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This job opening may have expired or been removed.</p>
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
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/opportunities')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-ink-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            showToast('success', 'Link Copied', 'Opportunity URL copied to clipboard.');
          }}
        >
          Share
        </Button>
      </div>

      {/* Hero Header Card */}
      <Card elevation={1} className="p-6 bg-surface border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{job.companyName}</span>
                <span className="text-slate-300">•</span>
                <Badge variant="neutral" size="sm">
                  {job.workMode}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {job.type}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight mt-1 font-sans">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 mt-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-ink-950 font-sans tabular-nums">
                  <Briefcase className="w-4 h-4 text-teal-700" />
                  {job.stipendOrSalary}
                </span>
                {job.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Duration: {job.duration}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Apply By: <strong>{formatDate(job.applyBy)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            {isApplied ? (
              <div className="text-right">
                <Badge variant="warning" dot size="md">
                  Status: {currentApplication?.status}
                </Badge>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Applied {formatDate(currentApplication?.appliedAt || '')}
                </p>
              </div>
            ) : eligibility.isEligible ? (
              <Badge variant="success" dot size="md">
                Eligible Candidate
              </Badge>
            ) : (
              <Badge variant="neutral" dot size="md">
                Criteria Not Satisfied
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Main Details vs Sticky Side Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Eligibility Check, Role Overview, Qualifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transparent Eligibility Evaluation Panel */}
          <Card elevation={1} className="p-5 border border-teal-200/90 bg-teal-50/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-950">Eligibility Criteria Evaluation</h3>
                  <p className="text-xs text-slate-600">
                    Transparent rule evaluation based on your registered student academic profile.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-white"
                onClick={() => setIsEligibilityModalOpen(true)}
              >
                Inspect Criteria
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-teal-200/60 text-xs">
              {eligibility.criteria.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-start gap-2.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-950">{c.label}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Target: {c.requiredValue} • Your Record: {c.studentValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Description & Responsibilities */}
          <Card elevation={1} className="p-6 space-y-5 bg-surface border-slate-200/80">
            <div>
              <h3 className="text-base font-bold text-ink-950">About The Position</h3>
              <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-ink-950 mb-3">Key Responsibilities</h4>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-ink-950 mb-3">Required Academic Qualifications</h4>
              <ul className="space-y-2">
                {job.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-ink-950 mb-3">Evaluated Competencies</h4>
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
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {hasSkill && <Check className="w-3 h-3 text-teal-700" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Company Branding & Links */}
          <Card elevation={1} className="p-6 bg-surface border-slate-200/80">
            <h3 className="text-base font-bold text-ink-950">About {job.companyName}</h3>
            <p className="text-xs text-slate-600 mt-1">
              Registered campus hiring partner participating in placement session 2026.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              {job.websiteUrl && (
                <a
                  href={job.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
                >
                  Company Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {job.linkedinUrl && (
                <a
                  href={job.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
                >
                  LinkedIn Profile <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Action & Update Timeline Panel */}
        <div className="space-y-6 lg:sticky lg:top-20">
          {/* Application Action Card */}
          <Card elevation={2} className="p-6 bg-surface border-slate-200/90 space-y-4">
            <div>
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                Opportunity Summary
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-ink-950 font-sans tracking-tight tabular-nums">
                  {job.stipendOrSalary}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {job.openings} Openings
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Eligibility Audit</span>
                {eligibility.isEligible ? (
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                  </span>
                ) : (
                  <span className="font-semibold text-red-700 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Ineligible
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Attached Resume</span>
                <span className="font-medium text-ink-950 truncate max-w-[150px]">
                  {studentProfile.resumeFileName || 'None uploaded'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Application Deadline</span>
                <span className="font-semibold text-ink-950">{formatDate(job.applyBy)}</span>
              </div>
            </div>

            {/* Apply CTA */}
            {isApplied ? (
              <div className="space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => navigate(`/student/applications/${currentApplication?.id}`)}
                >
                  View Application Timeline
                </Button>
                <p className="text-[11px] text-center text-slate-500">
                  Submitted on {formatDate(currentApplication?.appliedAt || '')}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-xs"
                  isLoading={isApplying}
                  disabled={!eligibility.isEligible}
                  onClick={handleApply}
                >
                  {eligibility.isEligible ? 'Apply For Opportunity' : 'Ineligible to Apply'}
                </Button>
                {!eligibility.isEligible && (
                  <p className="text-[11px] text-center text-red-600 font-medium">
                    {eligibility.reasons[0] || 'Requirements not satisfied.'}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Recruitment Updates Timeline */}
          <Card elevation={1} className="p-5 bg-surface border-slate-200/80">
            <h4 className="text-xs font-bold text-ink-950 uppercase tracking-wide mb-1">
              Recruitment Process Updates
            </h4>
            <p className="text-[11px] text-slate-500 mb-4">
              Real-time stage tracking from employer talent partner.
            </p>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {isApplied ? (
                <>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-50" />
                    <p className="text-xs font-bold text-ink-950">Application Forwarded</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Submitted to {job.companyName} candidate screening queue.
                    </p>
                  </div>

                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-slate-300" />
                    <p className="text-xs font-bold text-slate-700">Screening Window</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Employer evaluation in progress. Notifications trigger via email and SMS.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-400 pl-2">
                  Apply to activate candidate tracking and interview scheduling alerts.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Criteria Audit Modal */}
      <Dialog
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        title="Eligibility Criteria Audit"
        description={`Audit details for ${job.title} at ${job.companyName}`}
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsEligibilityModalOpen(false)}>
            Close Inspection
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <p className="font-semibold text-ink-950">Placement Cell Policy</p>
            <p className="text-slate-600 mt-0.5">
              Candidate applications are evaluated deterministically against company cutoff rules to ensure fair access across batches and disciplines.
            </p>
          </div>

          <div className="space-y-2.5">
            {eligibility.criteria.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-card border flex items-start gap-3 ${
                  c.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                }`}
              >
                {c.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-ink-950">{c.label}</h4>
                  <p className="text-slate-600 mt-0.5">{c.details}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Required: {c.requiredValue} • Student: {c.studentValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
