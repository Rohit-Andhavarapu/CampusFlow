import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  Layers,
  FileText,
  TrendingUp,
  Award,
  ArrowRight,
  Download,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { syntheticStudents } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { jobs, applications } = useApp();
  const navigate = useNavigate();

  const totalStudents = syntheticStudents.length;
  const placedStudents = syntheticStudents.filter((s) => s.status === 'Placed').length;
  const inProcessStudents = syntheticStudents.filter((s) => s.status === 'In Process').length;
  const unplacedStudents = syntheticStudents.filter((s) => s.status === 'Unplaced').length;
  const placementRate = Math.round((placedStudents / totalStudents) * 100);

  const departmentStats = [
    { name: 'Computer Science & Engineering', total: 10, placed: 8, rate: 80 },
    { name: 'Information Technology', total: 5, placed: 3, rate: 60 },
    { name: 'Artificial Intelligence & Data Science', total: 3, placed: 2, rate: 67 },
    { name: 'Electronics & Communication', total: 2, placed: 0, rate: 0 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
            Placement Administration Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Class of 2026 • Campus-wide recruitment drive analytics, company empanelment, and student placement progression.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/reports')}
          >
            Export NAAC / NIRF Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/students')}
          >
            Student Directory ({totalStudents})
          </Button>
        </div>
      </div>

      {/* Connected Performance Ribbon (Breaking Card-on-Card) */}
      <Card elevation={1} className="divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface">
        <div className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Placement Rate</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              +12% vs 2025
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-700 tabular-nums">
              {placementRate}%
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {placedStudents} of {totalStudents} graduating students placed
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/students')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Registered Batch</span>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
              Class 2026
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              {totalStudents}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {inProcessStudents} currently interviewing in drives
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/companies')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Empanelled Partners</span>
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
              Tier-1 & Core
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              6
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Active corporate hiring partners
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/drives')}
          className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Drive Phases</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              On Schedule
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
              3
            </span>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Super-Dream, AI, & Mass hiring tracks
            </p>
          </div>
        </div>
      </Card>

      {/* Department Analytics & Recent Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Placement Breakdown */}
        <Card elevation={1} className="lg:col-span-2 p-6 bg-surface border-slate-200/80">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-sm font-bold text-ink-950 tracking-tight">
                Department-Wise Placement Conversion
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Class of 2026 verified placement achievement across disciplines
              </p>
            </div>
            <Badge variant="brand" size="sm">
              Batch 2026
            </Badge>
          </div>

          <div className="space-y-5">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink-950">{dept.name}</span>
                  <span className="font-mono text-slate-600">
                    {dept.placed} / {dept.total} placed ({dept.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-teal-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-slate-500 font-medium">Highest Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5 tabular-nums">₹28.0 LPA</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Average Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5 tabular-nums">₹14.2 LPA</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Median Package</p>
              <p className="text-base font-extrabold text-ink-950 font-sans mt-0.5 tabular-nums">₹12.0 LPA</p>
            </div>
          </div>
        </Card>

        {/* Latest Offers Extended List */}
        <Card elevation={1} className="p-6 bg-surface border-slate-200/80">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <h2 className="text-xs font-bold text-ink-950 uppercase tracking-wide">
              Recent Offers Released
            </h2>
            <span
              className="text-[11px] font-medium text-teal-700 hover:underline cursor-pointer"
              onClick={() => navigate('/admin/students')}
            >
              All Students
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-1">
            {syntheticStudents
              .filter((s) => s.status === 'Placed')
              .slice(0, 5)
              .map((st) => (
                <div key={st.id} className="py-3 first:pt-2 last:pb-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink-950">{st.name}</p>
                    <p className="text-[11px] text-slate-500">{st.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-700 tabular-nums">{st.package}</span>
                    <p className="text-[10px] text-slate-400 font-mono">{st.branch.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
