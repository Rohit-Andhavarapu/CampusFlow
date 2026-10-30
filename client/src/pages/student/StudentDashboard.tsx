import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Compass,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Building2,
  ChevronRight,
  Briefcase,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { checkJobEligibility, formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export const StudentDashboard: React.FC = () => {
  const { currentUser, jobs, applications, interviews, studentProfile } = useApp();
  const navigate = useNavigate();

  // Metrics calculation
  const submittedCount = applications.length;
  const eligibleJobs = jobs.filter((job) => checkJobEligibility(job, studentProfile).isEligible);
  const eligibleCount = eligibleJobs.length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const selectedOffers = applications.filter((a) => a.status === 'Selected');
  const inProgressApps = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview'
  );

  // Profile readiness calculation
  let profileScore = 20;
  if (studentProfile.skills.length >= 3) profileScore += 25;
  if (studentProfile.resumeFileName) profileScore += 30;
  if (studentProfile.projects.length >= 1) profileScore += 15;
  if (studentProfile.githubUrl || studentProfile.portfolioUrl) profileScore += 10;

  const recommendedJobs = eligibleJobs.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Welcome Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
            <span>Class of {studentProfile.graduationYear}</span>
            <span>•</span>
            <span className="text-brand font-semibold">Campus Placement Session Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight mt-1.5 font-sans">
            Career Overview — {currentUser.name}
          </h1>

          <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-2xl leading-relaxed">
            {studentProfile.degree} in {studentProfile.branch} • Verified CGPA{' '}
            <strong className="text-ink-950 font-semibold">{studentProfile.cgpa}</strong> •{' '}
            <span className="text-success font-semibold">{selectedOffers.length} Offer Extended</span>
            {upcomingInterviews.length > 0 && (
              <>
                {' '}
                •{' '}
                <span className="text-warning font-semibold">
                  {upcomingInterviews.length} Interview Upcoming
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Compass className="w-3.5 h-3.5" />}
            onClick={() => navigate('/student/opportunities')}
          >
            Explore Openings
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => navigate('/student/applications')}
          >
            Track Applications
          </Button>
        </div>
      </div>

      {/* KPI Metric Strip: Typographic Focus, No Cluttered Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Applications Active"
          value={submittedCount}
          subtext="Submitted across campus drives"
          trend={{ value: '2 this week', isPositive: true }}
          onClick={() => navigate('/student/applications')}
        />
        <MetricCard
          label="Eligible Openings"
          value={eligibleCount}
          subtext={`Matched to ${studentProfile.branch.split(' ')[0]} (Min CGPA criteria met)`}
          variant="brand"
          onClick={() => navigate('/student/opportunities')}
        />
        <MetricCard
          label="Interview Rounds"
          value={upcomingInterviews.length}
          subtext={
            upcomingInterviews.length > 0
              ? `Next: ${formatDate(upcomingInterviews[0].dateTime)} (${upcomingInterviews[0].companyName})`
              : 'No rounds pending'
          }
          variant="warning"
          onClick={() => navigate('/student/interviews')}
        />
        <MetricCard
          label="Hiring Offers Extended"
          value={selectedOffers.length}
          subtext={
            selectedOffers.length > 0
              ? `${selectedOffers[0].companyName} (${selectedOffers[0].jobTitle})`
              : 'In interview progression'
          }
          variant="success"
          onClick={() => navigate('/student/applications')}
        />
      </div>

      {/* Placement Journey & Career Readiness Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Journey Pipeline */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between border border-border shadow-subtle">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wide">
                  Placement Milestone Progression
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Actual progress across campus recruitment stages
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Session 2026
              </Badge>
            </div>

            {/* Stage Progress Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-ink-400 font-semibold uppercase">Stage 01</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
                <p className="font-bold text-ink-950 text-xs mt-1.5">Academic Audit</p>
                <p className="text-[11px] text-ink-500 mt-0.5">CGPA 8.85 Verified</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-ink-400 font-semibold uppercase">Stage 02</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
                <p className="font-bold text-ink-950 text-xs mt-1.5">Applications</p>
                <p className="text-[11px] text-ink-500 mt-0.5">{submittedCount} Roles Submitted</p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-brand font-semibold uppercase">Stage 03</span>
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                </div>
                <p className="font-bold text-brand text-xs mt-1.5">Interviews</p>
                <p className="text-[11px] text-ink-600 mt-0.5">1 Round Scheduled</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-success font-semibold uppercase">Stage 04</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
                <p className="font-bold text-emerald-900 text-xs mt-1.5">Offer Extended</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">AgNext Technologies</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand" />
              Automated eligibility rules evaluated across all live vacancies.
            </span>
            <button
              onClick={() => navigate('/student/applications')}
              className="text-brand font-medium hover:underline flex items-center gap-1"
            >
              Detailed Pipeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Profile Readiness & Dossier Checklist */}
        <Card className="p-6 flex flex-col justify-between border border-border shadow-subtle">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wide">
                Profile Readiness
              </h3>
              <span className="font-mono font-bold text-xs text-brand">{profileScore}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-brand h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Academic CGPA & Branch
                </span>
                <span className="font-mono text-ink-400 text-[11px]">8.85 CGPA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Placement Master Resume
                </span>
                <span className="font-mono text-ink-400 text-[11px]">PDF Attached</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Technical Skills Tagged
                </span>
                <span className="font-mono text-ink-400 text-[11px]">
                  {studentProfile.skills.length} skills
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  GitHub & Portfolio Attached
                </span>
                <span className="font-mono text-ink-400 text-[11px]">Verified</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/student/profile')}
            >
              Update Dossier Credentials
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recommended Openings & Live Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink-950 tracking-tight">
                Recommended Opportunities
              </h2>
              <p className="text-xs text-ink-500">
                Direct match for your competencies in {studentProfile.skills.slice(0, 3).join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3 h-3" />}
              onClick={() => navigate('/student/opportunities')}
            >
              All Openings ({jobs.length})
            </Button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => {
              const applied = applications.some((a) => a.jobId === job.id && a.status !== 'Withdrawn');
              return (
                <Card
                  key={job.id}
                  hoverable
                  onClick={() => navigate(`/student/opportunities/${job.id}`)}
                  className="card-lift p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border shadow-subtle hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-11 h-11 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink-600">
                          {job.companyName}
                        </span>
                        <Badge variant="brand" size="sm">
                          {job.workMode}
                        </Badge>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-ink-950 mt-0.5 hover:text-brand transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ink-400" />
                          {job.location}
                        </span>
                        <span className="font-semibold text-ink-950">
                          {job.stipendOrSalary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-ink-400" />
                          Apply by {formatDate(job.applyBy)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    {applied ? (
                      <Badge variant="warning" dot size="sm">
                        Applied
                      </Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">
                        Eligible
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Schedule & Pipeline Activity */}
        <div className="space-y-6">
          {/* Upcoming Interviews Box */}
          <Card className="p-5 border border-border shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-warning" />
                <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
                  Upcoming Interviews
                </h3>
              </div>
              <span
                className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
                onClick={() => navigate('/student/interviews')}
              >
                Schedule ({interviews.length})
              </span>
            </div>

            <div className="divide-y divide-border mt-1">
              {upcomingInterviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-ink-400">
                  No pending interview rounds.
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="py-3 first:pt-2 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-ink-950">{interview.jobTitle}</p>
                        <p className="text-[11px] text-ink-600">{interview.companyName}</p>
                      </div>
                      <Badge variant="warning" size="sm">
                        {interview.mode}
                      </Badge>
                    </div>

                    <div className="mt-2 text-[11px] text-ink-500 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3 h-3 text-warning" />
                      <span>{new Date(interview.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {interview.locationOrLink && (
                      <div className="mt-2.5">
                        <a
                          href={interview.locationOrLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                        >
                          Join Google Meet <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Application Pipeline */}
          <Card className="p-5 border border-border shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
                  Application Log
                </h3>
              </div>
              <span
                className="text-[11px] font-medium text-brand hover:underline cursor-pointer"
                onClick={() => navigate('/student/applications')}
              >
                All ({applications.length})
              </span>
            </div>

            <div className="divide-y divide-border mt-1">
              {recentApplications.map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/student/applications/${app.id}`)}
                    className="py-3 first:pt-2 last:pb-0 cursor-pointer hover:bg-surface-secondary/50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink-950 truncate">{app.jobTitle}</p>
                        <p className="text-[11px] text-ink-500 truncate">{app.companyName}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-badge font-semibold border flex items-center gap-1 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {app.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-400 mt-1 truncate">
                      {app.nextAction || 'Under recruiter review.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
