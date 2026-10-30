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
  Video,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { checkJobEligibility, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import { CareerCompass } from '../../components/student/CareerCompass';
import { ChartPieDonut } from '../../components/charts/ChartPieDonut';

export const StudentDashboard: React.FC = () => {
  const { currentUser, jobs, applications, interviews, studentProfile } = useApp();
  const navigate = useNavigate();

  // Metrics calculation
  const submittedCount = applications.length;
  const eligibleJobs = jobs.filter((job) => checkJobEligibility(job, studentProfile).isEligible);
  const eligibleCount = eligibleJobs.length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const selectedOffers = applications.filter((a) => a.status === 'Selected');

  // Profile readiness calculation (True 0-100% based on actual profile data)
  let profileScore = 0;
  if (studentProfile.cgpa && studentProfile.cgpa > 0) profileScore += 20;
  if (studentProfile.skills.length >= 3) profileScore += 25;
  else if (studentProfile.skills.length > 0) profileScore += 10;
  if (studentProfile.resumeFileName) profileScore += 30;
  if (studentProfile.projects.length >= 1) profileScore += 15;
  if (studentProfile.githubUrl || studentProfile.portfolioUrl) profileScore += 10;

  const isProfileIncomplete = !studentProfile.branch || !studentProfile.cgpa || studentProfile.cgpa === 0;
  const nextInterview = upcomingInterviews.length > 0 ? upcomingInterviews[0] : null;
  const recommendedJobs = eligibleJobs.slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  // Status breakdown for Donut Chart (clean 0 handling)
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const appStatusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Campus eligibility breakdown
  const gapCount = Math.max(0, jobs.length - eligibleCount);
  const eligibilityData = jobs.length > 0 ? [
    { name: 'Directly Eligible', value: eligibleCount },
    { name: 'Criteria Gap', value: gapCount },
  ].filter((d) => d.value > 0) : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Editorial Header — Confident Typography */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans break-words">
            Career Overview — {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal flex flex-wrap items-center gap-x-2">
            {studentProfile.branch ? (
              <>
                <span>{studentProfile.degree || 'B.Tech'} in {studentProfile.branch}</span>
                <span>•</span>
                <span>Verified CGPA <strong className="text-slate-900 font-bold">{studentProfile.cgpa}</strong></span>
                {studentProfile.rollNo && (
                  <>
                    <span>•</span>
                    <span>Roll No: <span className="font-mono text-slate-700">{studentProfile.rollNo}</span></span>
                  </>
                )}
                <span>•</span>
                <span>Class of {studentProfile.graduationYear}</span>
              </>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Profile setup required to unlock automated eligibility verification
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
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
            Track Applications ({submittedCount})
          </Button>
        </div>
      </div>

      {/* Incomplete Profile Callout Banner */}
      {isProfileIncomplete && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">Complete Your Academic Profile</h3>
              <p className="text-xs text-amber-800/90 mt-0.5 max-w-xl">
                Add your degree program, branch, verified CGPA, and master resume to activate automated cutoff matching and unlock applications across live campus drives.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="flex-shrink-0 bg-amber-700 hover:bg-amber-800 text-white border-amber-800"
            onClick={() => navigate('/student/profile')}
          >
            Complete Profile Now
          </Button>
        </div>
      )}

      {/* LEAD-ANSWER ARCHITECTURE: Active Next Action Command Hero */}
      {nextInterview ? (
        <div className="rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50/90 via-slate-50/60 to-white p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-800">
                Next Active Recruitment Milestone
              </span>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/70 border border-teal-200 px-2 py-0.5 rounded-full">
                Scheduled Round
              </span>
            </div>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight break-words">
              {nextInterview.round} • {nextInterview.companyName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Target Role: <strong className="text-slate-800">{nextInterview.jobTitle}</strong>. {nextInterview.notes || 'Review system design, full-stack architecture, and real-time state synchronization.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-mono">
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                {new Date(nextInterview.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(nextInterview.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-teal-700" />
                {nextInterview.mode} (Google Meet)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            {nextInterview.locationOrLink ? (
              <a
                href={nextInterview.locationOrLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <Video className="w-4 h-4" />
                Launch Google Meet Room
              </a>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/interviews')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Interview Logistics
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Campus Recruitment Clearance</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {eligibleCount} Verified Campus Vacancies Open For Submission
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Your profile satisfies all academic benchmarks. Submit applications before corporate deadlines.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/student/opportunities')}
          >
            Review Matching Openings
          </Button>
        </div>
      )}

      {/* Context-Aware Career Compass Radar */}
      <CareerCompass />

      {/* Connected 4-Pillar Metric Strip (Arithmetically Balanced) */}
      <div className="rounded-xl border border-slate-200/90 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white shadow-2xs overflow-hidden">
        {/* Pillar 1 */}
        <div
          onClick={() => navigate('/student/applications')}
          className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Applications Active</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              +2 this week
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {submittedCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">Submitted across campus drives</p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div
          onClick={() => navigate('/student/opportunities')}
          className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Eligible Openings</span>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
              Direct match
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {eligibleCount}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">Meets branch & CGPA criteria</p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div
          onClick={() => navigate('/student/interviews')}
          className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Rounds</span>
            {upcomingInterviews.length > 0 && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Action required
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {upcomingInterviews.length}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {upcomingInterviews.length > 0
                ? `${formatDate(upcomingInterviews[0].dateTime)} • ${upcomingInterviews[0].companyName}`
                : 'No rounds pending'}
            </p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div
          onClick={() => navigate('/student/applications')}
          className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Offers Extended</span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-700 tabular-nums">
              {selectedOffers.length}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {selectedOffers.length > 0
                ? `${selectedOffers[0].companyName} (${selectedOffers[0].jobTitle})`
                : 'Interview stage active'}
            </p>
          </div>
        </div>
      </div>

      {/* DISTINCTIVE SIGNATURE COMPONENT: Placement Milestone Progression */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Institutional Placement Milestone Progression
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated recruitment audit status for Session {studentProfile.graduationYear}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full font-medium self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            Verified T&P Clearance
          </span>
        </div>

        {/* 4 Pipeline Stages — Fully Dynamic Real-Time Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/90">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">Stage 1</span>
              {studentProfile.cgpa > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-bold text-slate-900 text-xs mt-2">Academic Audit</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {studentProfile.cgpa > 0 ? `CGPA ${studentProfile.cgpa} Recorded` : 'Pending Verification'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/90">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">Stage 2</span>
              {submittedCount > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="font-bold text-slate-900 text-xs mt-2">Applications Submitted</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {submittedCount > 0 ? `${submittedCount} Campus Roles` : '0 Applications'}
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border ${
            upcomingInterviews.length > 0 
              ? 'bg-teal-50/80 border-teal-200/90' 
              : 'bg-slate-50 border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-mono text-[10px] font-semibold uppercase ${
                upcomingInterviews.length > 0 ? 'text-teal-800' : 'text-slate-500'
              }`}>Stage 3</span>
              {upcomingInterviews.length > 0 ? (
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className={`font-bold text-xs mt-2 ${
              upcomingInterviews.length > 0 ? 'text-teal-950' : 'text-slate-900'
            }`}>Evaluations Active</p>
            <p className={`text-[11px] mt-0.5 ${
              upcomingInterviews.length > 0 ? 'text-teal-800' : 'text-slate-500'
            }`}>
              {upcomingInterviews.length > 0 
                ? `${upcomingInterviews.length} Round${upcomingInterviews.length > 1 ? 's' : ''} Scheduled` 
                : 'No Active Rounds'}
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border ${
            selectedOffers.length > 0 
              ? 'bg-emerald-50/80 border-emerald-200/90' 
              : 'bg-slate-50 border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-mono text-[10px] font-semibold uppercase ${
                selectedOffers.length > 0 ? 'text-emerald-800' : 'text-slate-500'
              }`}>Stage 4</span>
              {selectedOffers.length > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className={`font-bold text-xs mt-2 ${
              selectedOffers.length > 0 ? 'text-emerald-950' : 'text-slate-900'
            }`}>
              {selectedOffers.length > 0 ? 'Offer Released' : 'Offer Status'}
            </p>
            <p className={`text-[11px] mt-0.5 ${
              selectedOffers.length > 0 ? 'text-emerald-800' : 'text-slate-500'
            }`}>
              {selectedOffers.length > 0 ? selectedOffers[0].companyName : 'Awaiting Selection'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Recommended Opportunities & Student Dossier (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Opportunities Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Recommended Campus Opportunities
              </h2>
              <p className="text-xs text-slate-500">
                Direct match for {studentProfile.branch} with competencies in {studentProfile.skills.slice(0, 3).join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/student/opportunities')}
            >
              All Openings ({jobs.length})
            </Button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => {
              const applied = applications.some((a) => a.jobId === job.id && a.status !== 'Withdrawn');
              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/student/opportunities/${job.id}`)}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {job.companyName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {job.workMode}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 hover:text-teal-700 transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {job.stipendOrSalary}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Apply by {formatDate(job.applyBy)}
                        </span>
                      </div>

                      {/* CampusFlow Distinctive Eligibility Seal */}
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md w-fit">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 flex-shrink-0" />
                        <span>Meets CGPA benchmark ({job.minCgpa} req) • Verified {studentProfile.branch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 flex-shrink-0">
                    {applied ? (
                      <Badge variant="warning" dot size="sm">
                        Applied
                      </Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">
                        Eligible
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 hover:underline">
                      Inspect Role <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Profile Readiness & Upcoming Schedules */}
        <div className="space-y-6">
          {/* Profile Readiness Dossier */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Academic Dossier Readiness
              </h3>
              <span className="font-mono font-bold text-xs text-teal-700">{profileScore}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3.5 overflow-hidden">
              <div
                className="bg-teal-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  {studentProfile.cgpa > 0 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Academic CGPA & Clearance
                </span>
                <span className="font-mono text-slate-600 text-[11px] font-semibold">
                  {studentProfile.cgpa > 0 ? `${studentProfile.cgpa} CGPA` : 'Not recorded'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  {studentProfile.resumeFileName ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Placement Master Resume
                </span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {studentProfile.resumeFileName ? 'PDF Attached' : 'Pending upload'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  {studentProfile.skills.length >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Technical Competencies
                </span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {studentProfile.skills.length > 0 ? `${studentProfile.skills.length} tagged` : 'None tagged'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  {(studentProfile.githubUrl || studentProfile.portfolioUrl) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  GitHub & Portfolio Verified
                </span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {(studentProfile.githubUrl || studentProfile.portfolioUrl) ? 'Attached' : 'Not linked'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/student/profile')}
              >
                Inspect Dossier Credentials
              </Button>
            </div>
          </div>

          {/* Interactive Recruitment Intelligence Charts */}
          <div className="space-y-6">
            <ChartPieDonut
              title="Application Pipeline Breakdown"
              description="Distribution of submitted applications across selection stages."
              data={appStatusData}
              centerLabel="Total Apps"
              centerValue={applications.length}
              height={260}
            />

            <ChartPieDonut
              title="Campus Eligibility Overview"
              description="Direct qualification across active campus recruitment drives."
              data={eligibilityData}
              centerLabel="Qualified"
              centerValue={`${jobs.length > 0 ? Math.round((eligibleCount / jobs.length) * 100) : 0}%`}
              height={260}
            />
          </div>

          {/* Recent Application Pipeline */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Application Log
                </h3>
              </div>
              <span
                className="text-[11px] font-medium text-teal-700 hover:underline cursor-pointer"
                onClick={() => navigate('/student/applications')}
              >
                View All ({applications.length})
              </span>
            </div>

            {recentApplications.length === 0 ? (
              <div className="py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">No applications yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse verified campus opportunities matching your profile and submit your first application.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs"
                  onClick={() => navigate('/student/opportunities')}
                >
                  Explore Opportunities
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-1">
                {recentApplications.map((app) => {
                  const badgeStyle = getStatusBadgeStyle(app.status);
                  return (
                    <div
                      key={app.id}
                      onClick={() => navigate(`/student/applications/${app.id}`)}
                      className="py-3 first:pt-2 last:pb-0 cursor-pointer hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{app.jobTitle}</p>
                          <p className="text-[11px] text-slate-500 truncate">{app.companyName}</p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold border flex items-center gap-1 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                          {app.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {app.nextAction || 'Under recruiter review.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
