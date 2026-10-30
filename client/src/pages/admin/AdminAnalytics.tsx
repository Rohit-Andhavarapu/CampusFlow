import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  Building2,
  Users,
  Download,
  Filter,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { syntheticStudents } from '../../data/mockData';
import { adminService } from '../../services/campusflowService';
import { ChartPieDonut } from '../../components/charts/ChartPieDonut';
import { ChartBarHorizontal } from '../../components/charts/ChartBarHorizontal';
import { ChartFunnel } from '../../components/charts/ChartFunnel';

export const AdminAnalytics: React.FC = () => {
  const { jobs, applications } = useApp();
  const navigate = useNavigate();

  // Multi-Filter controls
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  // Supabase RPC live stats
  const [rpcAnalytics, setRpcAnalytics] = useState<any>(null);

  useEffect(() => {
    adminService.getPlacementAnalytics().then((res) => {
      if (res) setRpcAnalytics(res);
    });
  }, []);

  // Filter students based on active selections
  const filteredStudents = useMemo(() => {
    return syntheticStudents.filter((student) => {
      if (selectedBranch !== 'all' && !student.branch.toLowerCase().includes(selectedBranch.toLowerCase())) {
        return false;
      }
      if (selectedBatch !== 'all' && student.graduationYear.toString() !== selectedBatch) {
        return false;
      }
      if (selectedStatus !== 'all' && student.status !== selectedStatus) {
        return false;
      }
      if (selectedCompany !== 'all' && student.company !== selectedCompany) {
        return false;
      }
      return true;
    });
  }, [selectedBranch, selectedBatch, selectedStatus, selectedCompany]);

  const resetFilters = () => {
    setSelectedBranch('all');
    setSelectedBatch('all');
    setSelectedStatus('all');
    setSelectedCompany('all');
  };

  const hasActiveFilters =
    selectedBranch !== 'all' ||
    selectedBatch !== 'all' ||
    selectedStatus !== 'all' ||
    selectedCompany !== 'all';

  // Derived filtered metrics
  const totalStudents = filteredStudents.length;
  const placedCount = filteredStudents.filter((s) => s.status === 'Placed').length;
  const inProcessCount = filteredStudents.filter((s) => s.status === 'In Process').length;
  const unplacedCount = filteredStudents.filter((s) => s.status === 'Unplaced').length;
  const placementRate = totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : '0.0';

  // 1. Placement Status Donut Data
  const statusDonutData = useMemo(() => {
    if (totalStudents === 0) return [];
    return [
      { name: 'Placed', value: placedCount, color: '#059669' },
      { name: 'In Process', value: inProcessCount, color: '#0284C7' },
      { name: 'Unplaced', value: unplacedCount, color: '#E11D48' },
    ].filter((d) => d.value > 0);
  }, [totalStudents, placedCount, inProcessCount, unplacedCount]);

  // 2. Department-wise Placement Comparison
  const departmentChartData = useMemo(() => {
    const deptMap: Record<string, { total: number; placed: number }> = {};
    syntheticStudents.forEach((s) => {
      if (!deptMap[s.branch]) deptMap[s.branch] = { total: 0, placed: 0 };
      deptMap[s.branch].total += 1;
      if (s.status === 'Placed') deptMap[s.branch].placed += 1;
    });

    return Object.entries(deptMap)
      .map(([name, stats]) => ({
        name,
        value: Math.round((stats.placed / stats.total) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // 3. Recruitment Funnel Data
  const recruitmentFunnelData = useMemo(() => {
    const registered = syntheticStudents.length;
    const applied = syntheticStudents.filter((s) => s.applicationsCount > 0).length;
    const shortlisted = syntheticStudents.filter((s) => s.status === 'In Process' || s.status === 'Placed').length;
    const interviewed = Math.max(12, Math.round(shortlisted * 0.8));
    const placed = syntheticStudents.filter((s) => s.status === 'Placed').length;

    return [
      { name: 'Registered Batch', value: registered, color: '#0F766E' },
      { name: 'Applied Candidates', value: applied, color: '#0284C7' },
      { name: 'Shortlisted for Assessment', value: shortlisted, color: '#6366F1' },
      { name: 'Interview Evaluations', value: interviewed, color: '#D97706' },
      { name: 'Verified Placements', value: placed, color: '#059669' },
    ];
  }, []);

  // 4. Salary Tier Distribution
  const salaryTierData = [
    { name: 'Super Dream (> ₹15 LPA)', value: 4 },
    { name: 'Dream (₹10 – ₹15 LPA)', value: 5 },
    { name: 'Core Engineering (₹6 – ₹10 LPA)', value: 3 },
    { name: 'Pre-Placement Internship / PPO', value: 2 },
  ];

  // Distinct company list for filter
  const companyOptions = useMemo(() => {
    const companies = new Set<string>();
    syntheticStudents.forEach((s) => {
      if (s.company) companies.add(s.company);
    });
    return Array.from(companies);
  }, []);

  // CSV Export Function
  const exportPlacementPulseCsv = () => {
    const headers = [
      'Student Name',
      'Roll Number',
      'College Email',
      'Branch',
      'Graduation Year',
      'CGPA',
      'Placement Status',
      'Hiring Company',
      'Package / Stipend',
      'Applications Count',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.name}"`,
      `"${s.rollNo}"`,
      `"${s.email}"`,
      `"${s.branch}"`,
      s.graduationYear,
      s.cgpa,
      `"${s.status}"`,
      `"${s.company || 'N/A'}"`,
      `"${s.package || 'N/A'}"`,
      s.applicationsCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campusflow_placement_pulse_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-900 border border-teal-200">
              <Award className="w-3.5 h-3.5 text-teal-700" />
              CampusFlow Placement Pulse
            </span>
            <span className="text-xs text-stone-400 font-mono">Session 2025–2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Institutional Placement Pulse & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Real-time multi-dimensional placement analytics, department conversion benchmarks, employer hiring performance, and student throughput.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={exportPlacementPulseCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 font-semibold text-xs shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Placement Pulse (CSV)</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 uppercase tracking-wider font-mono">
            <Filter className="w-3.5 h-3.5 text-teal-700" />
            <span>Analytics Filter Matrix</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-stone-200 bg-stone-50/60 p-2 focus:border-teal-700"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Artificial Intelligence">Artificial Intelligence & Data</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Mechanical">Mechanical Engineering</option>
            </select>
          </div>

          {/* Batch Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Graduation Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-stone-200 bg-stone-50/60 p-2 focus:border-teal-700"
            >
              <option value="all">All Batches</option>
              <option value="2026">Class of 2026 (Final Year)</option>
              <option value="2025">Class of 2025 (Graduated)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Placement Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-stone-200 bg-stone-50/60 p-2 focus:border-teal-700"
            >
              <option value="all">All Statuses</option>
              <option value="Placed">Placed / Verified Offer</option>
              <option value="In Process">In Process (Interviewing)</option>
              <option value="Unplaced">Unplaced (Searching)</option>
            </select>
          </div>

          {/* Hiring Company Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Recruiting Partner
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-stone-200 bg-stone-50/60 p-2 focus:border-teal-700"
            >
              <option value="all">All Companies</option>
              {companyOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100 font-mono">
          <span>
            Active Sample: <strong className="text-stone-900 font-semibold">{filteredStudents.length}</strong> of{' '}
            {syntheticStudents.length} institutional students
          </span>
          <span className="text-stone-400">Institutional Placement Cell Clearance Active</span>
        </div>
      </div>

      {/* KPI Ribbon Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Institutional Placement Rate
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-700">{placementRate}%</span>
            <span className="text-xs text-stone-400">
              ({placedCount} of {totalStudents})
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            In Active Rounds
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-teal-800">{inProcessCount}</span>
            <span className="text-xs text-stone-400">students interviewing</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Average Compensation CTC
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-stone-900">₹14.2 LPA</span>
            <span className="text-xs text-stone-400">Highest: ₹24 LPA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Active Placement Drives
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-indigo-700">{jobs.length}</span>
            <span className="text-xs text-stone-400">corporate partners</span>
          </div>
        </div>
      </div>

      {/* Row 1: Placement Donut & Department Comparison Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <ChartPieDonut
            title="Institutional Placement Distribution"
            description="Proportion of students placed, currently interviewing, or seeking placement."
            data={statusDonutData}
            centerLabel="Placement Rate"
            centerValue={`${placementRate}%`}
            height={340}
          />
        </div>

        <div className="lg:col-span-7">
          <ChartBarHorizontal
            title="Department-wise Placement Conversion Rates"
            description="Percentage of registered students securing verified placement offers by branch."
            data={departmentChartData}
            benchmarkValue={60}
            barColor="#0F766E"
            height={340}
          />
        </div>
      </div>

      {/* Row 2: Recruitment Funnel & Salary Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ChartFunnel
            title="Campus-Wide Recruitment Throughput Funnel"
            description="Conversion funnel from batch registration through screening and technical interview rounds to final placement."
            data={recruitmentFunnelData}
            height={320}
          />
        </div>

        <div className="lg:col-span-5">
          <ChartBarHorizontal
            title="Salary Tier CTC Distribution"
            description="Volume of confirmed corporate offers categorized across compensation bands."
            data={salaryTierData}
            barColor="#0284C7"
            height={320}
          />
        </div>
      </div>

      {/* Generated Strategic Observations Callout */}
      <div className="bg-stone-50/80 rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <h3 className="font-serif text-base font-bold text-stone-900 tracking-tight">
            Key Administrative Observations & Placement Trends
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="p-3.5 rounded-xl bg-white border border-stone-200">
            <strong className="block text-stone-900 font-semibold mb-1">
              1. Department Velocity Leader
            </strong>
            Computer Science & Engineering currently records the highest placement conversion at 75%, followed by Artificial Intelligence & Data Science at 66%.
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-stone-200">
            <strong className="block text-stone-900 font-semibold mb-1">
              2. Core Engineering Conversion
            </strong>
            Mechanical & Civil branches show 4 in-process interview evaluations with NovaTech Systems and Vertex Digital Labs, indicating strong second-phase demand.
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-stone-200">
            <strong className="block text-stone-900 font-semibold mb-1">
              3. Corporate Partner Throughput
            </strong>
            NovaTech Systems and AgNext Technologies lead total candidate absorption, accounting for 6 verified pre-placement internships and full-time offers.
          </div>
        </div>
      </div>
    </div>
  );
};
