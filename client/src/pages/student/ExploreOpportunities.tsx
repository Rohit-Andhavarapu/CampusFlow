import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  MapPin,
  Clock,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { checkJobEligibility, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import { Tabs } from '../../components/ui/Tabs';

export const ExploreOpportunities: React.FC = () => {
  const { jobs, applications, studentProfile, applyToJob } = useApp();
  const navigate = useNavigate();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter Tabs matching the user reference screenshot:
  // "Open To Apply", "Applied", "Hiring Done", "Previous Internships"
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Openings', count: jobs.length },
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

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const eligibility = checkJobEligibility(job, studentProfile);
      const isApplied = applications.some((a) => a.jobId === job.id && a.status !== 'Withdrawn');

      // Tab filter
      if (activeTab === 'open_to_apply' && isApplied) return false;
      if (activeTab === 'applied' && !isApplied) return false;
      if (activeTab === 'eligible_only' && !eligibility.isEligible) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesSkills = job.skillsRequired.some((s) => s.toLowerCase().includes(query));
        const matchesLocation = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // Work Mode
      if (selectedWorkMode !== 'all' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // Type
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }

      // Eligibility dropdown
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border/60 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job & Internship Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight mt-1">
              Explore Opportunities
            </h1>
            <p className="text-sm text-secondary-text mt-1">
              Find the right opportunity for your next chapter. Transparent eligibility and direct campus applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-secondary-text bg-surface-secondary px-3 py-1.5 rounded-full border border-border">
              2,000+ Verified Campus Recruiters
            </span>
          </div>
        </div>

        {/* Tab navigation inspired by university portal reference */}
        <div className="mt-5">
          <Tabs tabs={filterTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="w-full md:flex-1 relative">
            <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, company, skills (e.g., AI, Python, React)..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-surface-secondary/40 border border-border rounded-button text-primary-text placeholder:text-muted-text focus-ring transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring cursor-pointer"
            >
              <option value="all">Work Arrangement: All</option>
              <option value="Remote">Remote / WFH</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
            </select>

            <select
              value={selectedEligibility}
              onChange={(e) => setSelectedEligibility(e.target.value)}
              className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring cursor-pointer"
            >
              <option value="all">Eligibility: All</option>
              <option value="eligible">Eligible Only</option>
              <option value="ineligible">Needs Review</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring cursor-pointer"
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="deadline">Sort: Deadline Soonest</option>
              <option value="openings">Sort: Highest Openings</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-3 h-3" />}
                onClick={clearAllFilters}
                className="text-xs text-error hover:bg-error-surface hover:text-error"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips summary */}
        <div className="flex items-center justify-between text-xs text-muted-text pt-2 border-t border-border/50">
          <span>
            Showing <strong className="text-primary-text">{filteredJobs.length}</strong> of {jobs.length} opportunities
          </span>
          <span className="text-[11px] text-secondary-text">
            Profile CGPA: <strong>{studentProfile.cgpa}</strong> • Batch: <strong>{studentProfile.graduationYear}</strong>
          </span>
        </div>
      </div>

      {/* Grid of Job Cards — Polished Linear/Ashby interpretation of the reference */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-surface-secondary text-muted-text flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-primary-text">No matching opportunities found</h3>
          <p className="text-xs text-secondary-text mt-1 max-w-sm">
            Try adjusting your search criteria, widening the work mode filters, or clearing your active filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-4">
            Clear All Filters
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
                hoverable
                onClick={() => navigate(`/student/opportunities/${job.id}`)}
                className="p-5 flex flex-col justify-between transition-all duration-200 border-border hover:border-slate-300"
              >
                <div>
                  {/* Company Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-11 h-11 rounded-xl object-cover border border-border shadow-sm flex-shrink-0"
                      />
                      <div>
                        <span className="text-xs font-semibold text-secondary-text block truncate">
                          {job.companyName}
                        </span>
                        <h3 className="text-base font-bold text-primary-text tracking-tight hover:text-brand transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Eligibility / Applied Badge */}
                    {appliedApp ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-badge text-xs font-semibold bg-warning-surface text-warning-text border border-warning-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                        Applied
                      </span>
                    ) : eligibility.isEligible ? (
                      <Badge variant="success" dot size="sm">
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="neutral" dot size="sm">
                        Ineligible
                      </Badge>
                    )}
                  </div>

                  {/* Key Metadata Matrix (Location, Stipend, Openings, Apply By) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 p-3 rounded-lg bg-surface-secondary/40 border border-border/50 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                      </p>
                      <p className="font-medium text-primary-text mt-0.5 truncate">{job.location}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">
                        Stipend / CTC
                      </p>
                      <p className="font-semibold text-primary-text mt-0.5 truncate">{job.stipendOrSalary}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider">
                        Openings
                      </p>
                      <p className="font-medium text-primary-text mt-0.5">{job.openings} Positions</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Apply By
                      </p>
                      <p className="font-medium text-primary-text mt-0.5 truncate">{formatDate(job.applyBy)}</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                    {job.skillsRequired.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-secondary text-secondary-text border border-border/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 4 && (
                      <span className="text-[11px] text-muted-text font-medium">
                        +{job.skillsRequired.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Action Links */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-text">
                    {job.applicantsCount || 0} candidates applied
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-brand flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
