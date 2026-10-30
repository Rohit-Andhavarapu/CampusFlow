import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Compass,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { checkJobEligibility, formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export const StudentDashboard: React.FC = () => {
  const { currentUser, jobs, applications, interviews, studentProfile } = useApp();
  const navigate = useNavigate();

  // Metrics
  const submittedCount = applications.length;
  const eligibleJobs = jobs.filter((job) => checkJobEligibility(job, studentProfile).isEligible);
  const eligibleCount = eligibleJobs.length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
  ).length;

  // Profile completeness score
  let profileScore = 20; // Base info
  if (studentProfile.skills.length >= 3) profileScore += 25;
  if (studentProfile.resumeFileName) profileScore += 30;
  if (studentProfile.projects.length >= 1) profileScore += 15;
  if (studentProfile.githubUrl || studentProfile.portfolioUrl) profileScore += 10;

  // Recommended opportunities (top 3 eligible active jobs)
  const recommendedJobs = eligibleJobs.slice(0, 3);

  // Recent applications (top 3)
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Session 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Let's take the next step in your career journey. You have{' '}
            <span className="font-semibold text-primary-text">{upcomingInterviews.length}</span> upcoming
            interview and <span className="font-semibold text-primary-text">{eligibleCount}</span> eligible
            roles available today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Compass className="w-4 h-4" />}
            onClick={() => navigate('/student/opportunities')}
          >
            Explore Opportunities
          </Button>
          <Button
            variant="primary"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => navigate('/student/applications')}
          >
            Track Applications
          </Button>
        </div>
      </div>

      {/* Section A — Summary Metrics (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          label="Applications Submitted"
          value={submittedCount}
          subtext="Active in recruitment drives"
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: '2 this week', isPositive: true }}
          onClick={() => navigate('/student/applications')}
        />
        <MetricCard
          label="Eligible Opportunities"
          value={eligibleCount}
          subtext={`Based on CGPA ${studentProfile.cgpa} & ${studentProfile.branch}`}
          icon={<Compass className="w-5 h-5 text-brand" />}
          variant="brand"
          onClick={() => navigate('/student/opportunities')}
        />
        <MetricCard
          label="Upcoming Interviews"
          value={upcomingInterviews.length}
          subtext={
            upcomingInterviews.length > 0
              ? `Next: ${formatDate(upcomingInterviews[0].dateTime)}`
              : 'No upcoming rounds'
          }
          icon={<Calendar className="w-5 h-5 text-warning" />}
          variant="warning"
          onClick={() => navigate('/student/interviews')}
        />
        <MetricCard
          label="Shortlisted / In Progress"
          value={shortlistedCount}
          subtext="Screened by employer panels"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          variant="success"
          onClick={() => navigate('/student/applications')}
        />
      </div>

      {/* Placement Journey & Profile Completeness Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Journey Stepper */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-primary-text">Placement Milestone Journey</h3>
                <p className="text-xs text-secondary-text">
                  Campus recruitment pipeline progression for Class of 2026
                </p>
              </div>
              <Badge variant="brand" dot>
                Drive Active
              </Badge>
            </div>

            {/* Stepper visualization */}
            <div className="grid grid-cols-4 gap-2 pt-2 pb-4">
              {[
                { stage: '1. Verified', status: 'completed', desc: 'Profile & CGPA verified' },
                { stage: '2. Applied', status: 'completed', desc: `${submittedCount} roles submitted` },
                { stage: '3. Interviewing', status: 'current', desc: `${upcomingInterviews.length} rounds scheduled` },
                { stage: '4. Offer Letter', status: shortlistedCount > 1 ? 'achieved' : 'pending', desc: 'Final hiring decision' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === 'completed' || step.status === 'achieved'
                          ? 'bg-success text-white'
                          : step.status === 'current'
                          ? 'bg-brand text-white ring-4 ring-brand-surface'
                          : 'bg-surface-secondary text-secondary-text'
                      }`}
                    >
                      {step.status === 'completed' || step.status === 'achieved' ? '✓' : idx + 1}
                    </div>
                    {idx < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded ${
                          step.status === 'completed' ? 'bg-success' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-primary-text mt-2">{step.stage}</p>
                  <p className="text-[11px] text-muted-text mt-0.5 hidden sm:block">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-secondary-text">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand" />
              Your application conversion rate is <strong>75%</strong> higher than campus average.
            </span>
          </div>
        </Card>

        {/* Profile Completion Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-primary-text">Profile Readiness</h3>
              <span className="text-sm font-bold text-brand">{profileScore}%</span>
            </div>
            <p className="text-xs text-secondary-text mt-1">
              Complete your placement credentials to unlock automated shortlisting.
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-secondary-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Academic CGPA & Branch Verified
                </span>
                <span className="text-muted-text font-medium">100%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-secondary-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Placement Resume Uploaded
                </span>
                <span className="text-muted-text font-medium">PDF</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-secondary-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Key Technical Skills Tagged
                </span>
                <span className="text-muted-text font-medium">{studentProfile.skills.length} skills</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/student/profile')}
            >
              Update Credentials & Projects
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Grid: Section B (Recommended Opportunities) + Section C & D (Activity & Upcoming Interviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Section B — Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-primary-text tracking-tight">
                Recommended Opportunities
              </h2>
              <p className="text-xs text-secondary-text">
                Matched against your skills in {studentProfile.skills.slice(0, 3).join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/student/opportunities')}
            >
              View All ({jobs.length})
            </Button>
          </div>

          <div className="space-y-4">
            {recommendedJobs.map((job) => {
              const applied = applications.some((a) => a.jobId === job.id && a.status !== 'Withdrawn');
              return (
                <Card
                  key={job.id}
                  hoverable
                  onClick={() => navigate(`/student/opportunities/${job.id}`)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-secondary-text">
                          {job.companyName}
                        </span>
                        <Badge variant="brand" size="sm">
                          {job.workMode}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-primary-text hover:text-brand transition-colors mt-0.5">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-text mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="font-semibold text-primary-text">
                          {job.stipendOrSalary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Deadline: {formatDate(job.applyBy)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
                    {applied ? (
                      <Badge variant="warning" dot size="sm">
                        Applied
                      </Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">
                        Eligible
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-brand flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Section C (Recent Activity) & Section D (Upcoming Interviews) */}
        <div className="space-y-6">
          {/* Section D: Upcoming Interviews */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-bold text-primary-text">Upcoming Interviews</h3>
              </div>
              <span className="text-[11px] font-semibold text-brand hover:underline cursor-pointer" onClick={() => navigate('/student/interviews')}>
                View All
              </span>
            </div>

            <div className="divide-y divide-border/50 mt-2">
              {upcomingInterviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-text">
                  No interviews scheduled right now.
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="py-3.5 first:pt-2 last:pb-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-primary-text">{interview.jobTitle}</p>
                        <p className="text-[11px] text-secondary-text">{interview.companyName}</p>
                      </div>
                      <Badge variant="warning" size="sm">
                        {interview.mode}
                      </Badge>
                    </div>

                    <div className="mt-2 text-[11px] text-muted-text flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-warning" />
                      <span>{new Date(interview.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {interview.locationOrLink && (
                      <div className="mt-2.5">
                        <a
                          href={interview.locationOrLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
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

          {/* Section C: Recent Application Activity */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-bold text-primary-text">Application Pipeline</h3>
              </div>
              <span className="text-[11px] font-semibold text-brand hover:underline cursor-pointer" onClick={() => navigate('/student/applications')}>
                All ({applications.length})
              </span>
            </div>

            <div className="divide-y divide-border/50 mt-2">
              {recentApplications.map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/student/applications/${app.id}`)}
                    className="py-3.5 first:pt-2 last:pb-1 cursor-pointer hover:bg-surface-secondary/40 rounded-lg px-2 transition-colors -mx-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary-text truncate">{app.jobTitle}</p>
                        <p className="text-[11px] text-secondary-text truncate">{app.companyName}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {app.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-text mt-1.5 truncate">
                      {app.nextAction || 'Awaiting update from recruitment team.'}
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
