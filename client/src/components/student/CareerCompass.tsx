import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { checkJobEligibility } from '../../utils/formatters';
import {
  Compass,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface CompassAction {
  id: string;
  type: 'urgent' | 'recommended' | 'opportunity' | 'lab';
  title: string;
  subtitle: string;
  actionText: string;
  actionRoute: string;
  badge: string;
}

export const CareerCompass: React.FC = () => {
  const { studentProfile, applications, interviews, jobs } = useApp();
  const navigate = useNavigate();

  const actions: CompassAction[] = [];

  // 1. Check for upcoming scheduled interviews
  const upcomingInterview = interviews.find((i) => i.status === 'Scheduled');
  if (upcomingInterview) {
    const intDate = new Date(upcomingInterview.dateTime);
    const timeStr = intDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    actions.push({
      id: 'interview_urgent',
      type: 'urgent',
      badge: 'Urgent Action',
      title: `${upcomingInterview.round} with ${upcomingInterview.companyName}`,
      subtitle: `Scheduled for ${timeStr} (${upcomingInterview.mode}). Review your project portfolio and technical notes.`,
      actionText: 'Open Interview Details',
      actionRoute: '/student/interviews',
    });
  }

  // 2. Profile completeness check
  const hasSkills = studentProfile.skills && studentProfile.skills.length > 0;
  const hasCgpa = studentProfile.cgpa && studentProfile.cgpa > 0;
  const hasBranch = !!studentProfile.branch;
  const hasGithub = !!studentProfile.githubUrl;

  if (!hasSkills || !hasCgpa || !hasBranch) {
    actions.push({
      id: 'profile_gap',
      type: 'urgent',
      badge: 'Profile Readiness',
      title: 'Complete Your Academic Profile',
      subtitle: 'Verified recruiters filter candidates by CGPA, branch, and technical skillsets. Fill in missing details to unlock eligibility.',
      actionText: 'Edit Profile Now',
      actionRoute: '/student/profile',
    });
  } else if (!hasGithub) {
    actions.push({
      id: 'github_recommended',
      type: 'recommended',
      badge: 'Recruiter Signal',
      title: 'Link GitHub / Portfolio Repository',
      subtitle: 'Candidates with verified GitHub profiles receive 2.4x higher shortlist rates in technical screening rounds.',
      actionText: 'Add Project Links',
      actionRoute: '/student/profile',
    });
  }

  // 3. Urgent upcoming deadlines for eligible unapplied jobs
  const appliedJobIds = new Set(applications.map((a) => a.jobId));
  const unappliedJobs = jobs.filter((j) => !appliedJobIds.has(j.id) && j.status === 'active');

  const now = new Date();
  const closingSoonJob = unappliedJobs
    .filter((j) => {
      const deadline = new Date(j.applyBy);
      const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 168; // within 7 days
    })
    .sort((a, b) => new Date(a.applyBy).getTime() - new Date(b.applyBy).getTime())[0];

  if (closingSoonJob) {
    const daysLeft = Math.max(1, Math.ceil((new Date(closingSoonJob.applyBy).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    actions.push({
      id: 'deadline_alert',
      type: 'urgent',
      badge: `Closes in ${daysLeft}d`,
      title: `${closingSoonJob.companyName} — ${closingSoonJob.title}`,
      subtitle: `Application window closes on ${new Date(closingSoonJob.applyBy).toLocaleDateString()}. Package: ${closingSoonJob.stipendOrSalary}.`,
      actionText: 'Review & Apply',
      actionRoute: `/student/opportunities/${closingSoonJob.id}`,
    });
  }

  // 4. Recommended high-match opportunity
  const recommendedJob = unappliedJobs.find((j) => {
    const elig = checkJobEligibility(j, studentProfile);
    return elig.isEligible;
  });

  if (recommendedJob && recommendedJob.id !== closingSoonJob?.id) {
    actions.push({
      id: 'high_match',
      type: 'opportunity',
      badge: 'High Match',
      title: `${recommendedJob.companyName} — ${recommendedJob.title}`,
      subtitle: `Your profile meets 100% of the academic criteria (${recommendedJob.minCgpa}+ CGPA, ${studentProfile.branch}).`,
      actionText: 'View Opportunity',
      actionRoute: `/student/opportunities/${recommendedJob.id}`,
    });
  }

  // 5. Always offer What-If Lab simulation
  actions.push({
    id: 'what_if_lab',
    type: 'lab',
    badge: 'Simulation',
    title: 'What-If Eligibility Lab',
    subtitle: 'Simulate how target CGPA upgrades, clearing backlogs, or learning new stacks expands your qualified opportunities.',
    actionText: 'Launch Simulation Sandbox',
    actionRoute: '/student/eligibility-lab',
  });

  // Limit to top 3 prioritized cards
  const prioritized = actions.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 mb-8 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 shadow-sm">
            <Compass className="w-5 h-5 text-teal-700 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-stone-900 tracking-tight">Career Compass</h3>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-100/70 text-teal-900 border border-teal-200">
                Action Radar
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Context-aware next steps derived from your verified profile, applications, and upcoming deadlines.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/eligibility-lab')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>What-If Lab</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {prioritized.map((item) => {
          let badgeClass = 'bg-stone-100 text-stone-700 border-stone-200';
          let icon = <Sparkles className="w-3.5 h-3.5 text-teal-700" />;

          if (item.type === 'urgent') {
            badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
            icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
          } else if (item.type === 'recommended') {
            badgeClass = 'bg-amber-50 text-amber-900 border-amber-200';
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />;
          } else if (item.type === 'opportunity') {
            badgeClass = 'bg-teal-50 text-teal-900 border-teal-200';
            icon = <Sparkles className="w-3.5 h-3.5 text-teal-700" />;
          } else if (item.type === 'lab') {
            badgeClass = 'bg-indigo-50 text-indigo-900 border-indigo-200';
            icon = <Sliders className="w-3.5 h-3.5 text-indigo-700" />;
          }

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-stone-200/90 bg-stone-50/40 hover:bg-white hover:border-teal-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeClass}`}
                  >
                    {icon}
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-teal-900 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <button
                onClick={() => navigate(item.actionRoute)}
                className="mt-4 inline-flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-stone-200 text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all shadow-xs"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
