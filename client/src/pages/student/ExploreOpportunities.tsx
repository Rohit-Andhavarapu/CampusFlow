import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  Building2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { checkJobEligibility, formatDate } from '../../utils/formatters';
import { Tabs } from '../../components/ui/Tabs';

export const ExploreOpportunities: React.FC = () => {
  const { jobs, applications, studentProfile } = useApp();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Opportunities', count: jobs.length },
    {
      id: 'open_to_apply',
      label: 'Open To Apply',
      count: jobs.filter((j) => !applications.some((a) => a.jobId === j.id && a.status !== 'Withdrawn')).length,
    },
    {
      id: 'applied',
      label: 'Applied',
      count: applications.filter((a) => a.status !== 'Withdrawn').length,
    },
    {
      id: 'eligible_only',
      label: 'Eligible Only',
      count: jobs.filter((j) => checkJobEligibility(j, studentProfile).isEligible).length,
    },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const eligibility = checkJobEligibility(job, studentProfile);
      const isApplied = applications.some((a) => a.jobId === job.id && a.status !== 'Withdrawn');

      if (activeTab === 'open_to_apply' && isApplied) return false;
      if (activeTab === 'applied' && !isApplied) return false;
      if (activeTab === 'eligible_only' && !eligibility.isEligible) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkills = job.skillsRequired.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) return false;
      }

      if (selectedWorkMode !== 'all' && job.workMode !== selectedWorkMode) return false;
      if (selectedType !== 'all' && job.type !== selectedType) return false;
      if (selectedEligibility === 'eligible' && !eligibility.isEligible) return false;
      if (selectedEligibility === 'ineligible' && eligibility.isEligible) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.applyBy).getTime() - new Date(b.applyBy).getTime();
      }
      if (sortBy === 'openings') {
        return b.openings - a.openings;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    jobs,
    applications,
    studentProfile,
    activeTab,
    searchQuery,
    selectedWorkMode,
    selectedType,
    selectedEligibility,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedWorkMode('all');
    setSelectedType('all');
    setSelectedEligibility('all');
    setSortBy('newest');
    setActiveTab('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedWorkMode !== 'all' ||
    selectedType !== 'all' ||
    selectedEligibility !== 'all' ||
    activeTab !== 'all';

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
              Explore Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct campus hiring drives and internships. Transparent criteria audits matching your verified academic profile.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-button shadow-elevation-1">
            <span>Verified CGPA: <strong>{studentProfile.cgpa}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Batch: <strong>{studentProfile.graduationYear}</strong></span>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="mt-5">
          <Tabs tabs={filterTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card elevation={1} className="bg-surface border-slate-200/80 p-3.5 space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="w-full lg:flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by role, company, or target skill (e.g. Agentic AI, TypeScript)..."
              className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-button text-ink-950 placeholder:text-slate-400 focus-ring-refined"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-950"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
            >
              <option value="all">Mode: All Arrangements</option>
              <option value="Remote">Remote / WFH</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
            >
              <option value="all">Type: All Positions</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
            </select>

            <select
              value={selectedEligibility}
              onChange={(e) => setSelectedEligibility(e.target.value)}
              className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
            >
              <option value="all">Eligibility: All</option>
              <option value="eligible">Eligible Only</option>
              <option value="ineligible">Needs Review</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-surface border border-slate-200 rounded-button px-2.5 py-2 text-slate-700 font-medium focus-ring-refined cursor-pointer"
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="deadline">Sort: Deadline Soonest</option>
              <option value="openings">Sort: Most Vacancies</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-3 h-3" />}
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:bg-red-50"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-ink-950 font-semibold">{filteredJobs.length}</strong> of{' '}
            {jobs.length} campus opportunities
          </span>
          <span>Verified recruitment partners</span>
        </div>
      </Card>

      {/* Grid of Redesigned Job Cards — No Text Clipping, Clean Hierarchy */}
      {filteredJobs.length === 0 ? (
        <Card elevation={1} className="p-12 text-center flex flex-col items-center justify-center border-slate-200/80">
          <Briefcase className="w-8 h-8 text-slate-400 mb-2.5" />
          <h3 className="text-sm font-bold text-ink-950">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Adjust your keyword query, broaden work mode criteria, or clear filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-4">
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const eligibility = checkJobEligibility(job, studentProfile);
            const appliedApp = applications.find(
              (a) => a.jobId === job.id && a.status !== 'Withdrawn'
            );

            return (
              <Card
                key={job.id}
                elevation={1}
                hoverable
                onClick={() => navigate(`/student/opportunities/${job.id}`)}
                className="p-5 flex flex-col justify-between bg-surface border-slate-200/80 card-lift transition-colors"
              >
                <div>
                  {/* Row 1: Company Logo + Title + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-600">
                            {job.companyName}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {job.workMode}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-ink-950 hover:text-teal-700 transition-colors mt-0.5 line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {appliedApp ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Applied
                      </span>
                    ) : eligibility.isEligible ? (
                      <Badge variant="success" dot size="sm" className="flex-shrink-0">
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="neutral" dot size="sm" className="flex-shrink-0">
                        Ineligible
                      </Badge>
                    )}
                  </div>

                  {/* Row 2: Compensation & Metadata Strip (NO TRUNCATION) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-ink-950 font-sans tracking-tight tabular-nums">
                        {job.stipendOrSalary}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {job.openings} Openings
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Apply by {formatDate(job.applyBy)}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Skill Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {job.skillsRequired.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 4 && (
                      <span className="text-[11px] font-medium text-slate-400">
                        +{job.skillsRequired.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Applied count and CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {job.applicantsCount || 0} candidates applied
                  </span>

                  <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Role <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
