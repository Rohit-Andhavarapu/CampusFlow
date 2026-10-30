import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { checkJobEligibility } from '../../utils/formatters';
import {
  Bookmark,
  Calendar,
  Clock,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Search,
} from 'lucide-react';

export const OpportunityWatchlist: React.FC = () => {
  const { jobs, watchlist, toggleWatchlist, applications, studentProfile, applyToJob } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'compensation' | 'eligibility'>('deadline');

  const appliedJobIds = useMemo(() => new Set(applications.map((a) => a.jobId)), [applications]);

  const watchlistedJobs = useMemo(() => {
    return jobs.filter((j) => watchlist.includes(j.id));
  }, [jobs, watchlist]);

  const filteredJobs = useMemo(() => {
    let list = watchlistedJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.companyName.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'deadline') {
      list.sort((a, b) => new Date(a.applyBy).getTime() - new Date(b.applyBy).getTime());
    } else if (sortBy === 'compensation') {
      list.sort((a, b) => b.stipendOrSalary.localeCompare(a.stipendOrSalary));
    } else if (sortBy === 'eligibility') {
      list.sort((a, b) => {
        const aElig = checkJobEligibility(a, studentProfile).isEligible ? 1 : 0;
        const bElig = checkJobEligibility(b, studentProfile).isEligible ? 1 : 0;
        return bElig - aElig;
      });
    }

    return list;
  }, [watchlistedJobs, search, sortBy, studentProfile]);

  const now = new Date();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-900 border border-teal-200">
              <Bookmark className="w-3.5 h-3.5 text-teal-700" />
              Prioritized Drives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Opportunity Watchlist
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track high-priority campus recruitment drives with real-time deadline radars and quick application access.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/opportunities')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 font-medium text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <span>Explore All Opportunities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {watchlistedJobs.length === 0 ? (
        /* Clean Editorial Empty State */
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Bookmark className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Your Opportunity Watchlist is Empty
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto mb-6">
            Bookmark active campus drives from the opportunity catalog to monitor closing dates, inspect academic cutoffs, and prepare your application credentials.
          </p>
          <button
            onClick={() => navigate('/student/opportunities')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 font-semibold text-xs shadow-sm transition-all"
          >
            <span>Browse Active Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved drives..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-medium rounded-lg border border-stone-200 bg-stone-50/60 px-3 py-2 focus:border-teal-700"
              >
                <option value="deadline">Closing Soonest (Radar)</option>
                <option value="compensation">Package / CTC</option>
                <option value="eligibility">Eligibility Match</option>
              </select>
            </div>
          </div>

          {/* Watchlist Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id);
              const elig = checkJobEligibility(job, studentProfile);
              const deadlineDate = new Date(job.applyBy);
              const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              const isUrgent = diffHours > 0 && diffHours <= 48;
              const isClosingWeek = diffHours > 48 && diffHours <= 168;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between p-6 relative group"
                >
                  <div>
                    {/* Top row: Deadline radar pill & Remove button */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Closing in {Math.max(1, Math.round(diffHours))}h
                        </span>
                      ) : isClosingWeek ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Closes in {Math.ceil(diffHours / 24)}d
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}

                      <button
                        onClick={() => toggleWatchlist(job.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Company & Role */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-serif text-lg font-bold text-stone-800 shrink-0">
                        {job.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-stone-900 text-sm truncate group-hover:text-teal-900 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-stone-400" />
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50/60 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Package / CTC:</span>
                        <span className="font-semibold text-stone-900">{job.stipendOrSalary}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Location:</span>
                        <span>{job.location} ({job.workMode})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Min CGPA:</span>
                        <span className="font-mono font-medium">{job.minCgpa} CGPA</span>
                      </div>
                    </div>

                    {/* Eligibility Badge */}
                    <div className="mb-4">
                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                          Application Submitted
                        </span>
                      ) : elig.isEligible ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Eligible to Apply
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Criteria Gap
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => navigate(`/student/opportunities/${job.id}`)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors text-center"
                    >
                      View Details
                    </button>
                    {!isApplied && (
                      <button
                        onClick={async () => {
                          const res = await applyToJob(job.id);
                          if (res.success) {
                            navigate('/student/applications');
                          }
                        }}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-teal-800 text-white hover:bg-teal-900 transition-colors text-center shadow-xs"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
