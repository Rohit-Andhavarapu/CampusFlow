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
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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

  // Profile readiness calculation
  let profileScore = 20;
  if (studentProfile.skills.length >= 3) profileScore += 25;
  if (studentProfile.resumeFileName) profileScore += 30;
  if (studentProfile.projects.length >= 1) profileScore += 15;
  if (studentProfile.githubUrl || studentProfile.portfolioUrl) profileScore += 10;

  const recommendedJobs = eligibleJobs.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="space-y-7 pb-12">
      {/* Editorial Header — Confident Typography Without Banned Kickers */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
            Career Overview — {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            {studentProfile.degree} in {studentProfile.branch} • Verified CGPA{' '}
            <strong className="text-ink-950 font-bold">{studentProfile.cgpa}</strong> • Class of{' '}
            {studentProfile.graduationYear}
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

      {/* Connected Performance Ribbon (Breaking the Card-on-Card Pattern) */}
      <Card elevation={1} className="divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface">
        {/* Pillar 1: Applications Active */}
        <div
          onClick={() => navigate('/student/applications')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Applications Active</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              +2 this week
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {submittedCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">Submitted across campus drives</p>
          </div>
        </div>

        {/* Pillar 2: Eligible Openings */}
        <div
          onClick={() => navigate('/student/opportunities')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Eligible Openings</span>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
              Direct match
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {eligibleCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Meets branch and CGPA cutoffs
            </p>
          </div>
        </div>

        {/* Pillar 3: Upcoming Interview Rounds */}
        <div
          onClick={() => navigate('/student/interviews')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Rounds</span>
            {upcomingInterviews.length > 0 && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Action required
              </span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {upcomingInterviews.length}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {upcomingInterviews.length > 0
                ? `${formatDate(upcomingInterviews[0].dateTime)} • ${upcomingInterviews[0].companyName}`
                : 'No rounds pending'}
            </p>
          </div>
        </div>

        {/* Pillar 4: Hiring Offers Extended */}
        <div
          onClick={() => navigate('/student/applications')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Offers Extended</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-700 tabular-nums">
              {selectedOffers.length}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {selectedOffers.length > 0
                ? `${selectedOffers[0].companyName} (${selectedOffers[0].jobTitle})`
                : 'Interview stage active'}
            </p>
          </div>
        </div>
      </Card>

      {/* Placement Journey & Career Readiness Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Journey Pipeline */}
        <Card elevation={1} className="lg:col-span-2 p-6 flex flex-col justify-between bg-surface border-slate-200/80">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-ink-950 tracking-tight">
                  Placement Milestone Progression
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actual progress across campus recruitment stages
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Session {studentProfile.graduationYear}
              </Badge>
            </div>

            {/* Stage Progress Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-slate-50/90 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase">Stage 1</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="font-bold text-ink-950 text-xs mt-1.5">Academic Audit</p>
                <p className="text-[11px] text-slate-500 mt-0.5">CGPA {studentProfile.cgpa} Verified</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50/90 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase">Stage 2</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="font-bold text-ink-950 text-xs mt-1.5">Applications</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{submittedCount} Roles Submitted</p>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200/90">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-teal-800 font-semibold uppercase">Stage 3</span>
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                </div>
                <p className="font-bold text-teal-900 text-xs mt-1.5">Interviews</p>
                <p className="text-[11px] text-teal-700 mt-0.5">1 Round Scheduled</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/90">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-emerald-800 font-semibold uppercase">Stage 4</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="font-bold text-emerald-950 text-xs mt-1.5">Offer Extended</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">AgNext Technologies</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Automated eligibility rules evaluated across all live vacancies.
            </span>
            <button
              onClick={() => navigate('/student/applications')}
              className="text-teal-700 font-medium hover:underline flex items-center gap-1"
            >
              Detailed Pipeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Profile Readiness & Dossier Checklist */}
        <Card elevation={1} className="p-6 flex flex-col justify-between bg-surface border-slate-200/80">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-ink-950 tracking-tight">
                Profile Readiness
              </h2>
              <span className="font-mono font-bold text-xs text-teal-700">{profileScore}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-teal-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Academic CGPA & Branch
                </span>
                <span className="font-mono text-slate-500 text-[11px]">{studentProfile.cgpa} CGPA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Placement Master Resume
                </span>
                <span className="font-mono text-slate-500 text-[11px]">PDF Attached</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Technical Skills Tagged
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {studentProfile.skills.length} skills
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  GitHub & Portfolio Attached
                </span>
                <span className="font-mono text-slate-500 text-[11px]">Verified</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
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
              <p className="text-xs text-slate-500">
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
                  elevation={1}
                  hoverable
                  onClick={() => navigate(`/student/opportunities/${job.id}`)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border-slate-200/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">
                          {job.companyName}
                        </span>
                        <Badge variant="neutral" size="sm">
                          {job.workMode}
                        </Badge>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-ink-950 mt-0.5 hover:text-teal-700 transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="font-semibold text-ink-950 tabular-nums">
                          {job.stipendOrSalary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Apply by {formatDate(job.applyBy)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {applied ? (
                      <Badge variant="warning" dot size="sm">
                        Applied
                      </Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">
                        Eligible
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
          <Card elevation={1} className="p-5 bg-surface border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-ink-950 tracking-tight">
                  Upcoming Interviews
                </h3>
              </div>
              <span
                className="text-[11px] font-medium text-teal-700 hover:underline cursor-pointer"
                onClick={() => navigate('/student/interviews')}
              >
                Schedule ({interviews.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {upcomingInterviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No pending interview rounds.
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="py-3 first:pt-2 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-ink-950">{interview.jobTitle}</p>
                        <p className="text-[11px] text-slate-600">{interview.companyName}</p>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {interview.mode}
                      </Badge>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{new Date(interview.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {interview.locationOrLink && (
                      <div className="mt-2.5">
                        <a
                          href={interview.locationOrLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
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
          <Card elevation={1} className="p-5 bg-surface border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-bold text-ink-950 tracking-tight">
                  Application Log
                </h3>
              </div>
              <span
                className="text-[11px] font-medium text-teal-700 hover:underline cursor-pointer"
                onClick={() => navigate('/student/applications')}
              >
                All ({applications.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {recentApplications.map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/student/applications/${app.id}`)}
                    className="py-3 first:pt-2 last:pb-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink-950 truncate">{app.jobTitle}</p>
                        <p className="text-[11px] text-slate-500 truncate">{app.companyName}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border flex items-center gap-1 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {app.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 truncate">
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
