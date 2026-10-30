import React, { useState } from 'react';
import { User, Briefcase, Building2, CheckCircle2, Calendar, FileText, ArrowUpRight, Search, Filter } from 'lucide-react';

type PreviewTab = 'student' | 'recruiter' | 'admin';

export const EditorialDashboardTransformation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('student');

  return (
    <section id="preview" className="py-20 md:py-32 bg-[#FAF8F5] border-t linen-rule">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#14432A] py-1 px-3.5 rounded-full bg-[#14432A]/8 border border-[#14432A]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14432A]"></span>
            <span>The Signature Transformation Sequence</span>
          </div>

          <h2 className="font-serif-prestige text-3xl sm:text-5xl text-[#14432A] leading-tight font-semibold">
            From verified credentials into <span className="italic font-normal">the live recruitment dashboard.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
            Witness how static academic documents expand into the fully operational CampusFlow platform. Toggle between student, recruiter, and administration views below.
          </p>

          {/* Perspective Switcher */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 rounded-lg bg-[#EFECE4] parchment-border">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'student'
                    ? 'bg-[#14432A] text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-[#14432A]'
                }`}
              >
                Student Dashboard
              </button>
              <button
                onClick={() => setActiveTab('recruiter')}
                className={`px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'recruiter'
                    ? 'bg-[#14432A] text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-[#14432A]'
                }`}
              >
                Recruiter Studio
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-[#14432A] text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-[#14432A]'
                }`}
              >
                Placement Cell Console
              </button>
            </div>
          </div>
        </div>

        {/* The Live Framed Dashboard Workstation */}
        <div className="max-w-6xl mx-auto bg-[#FFFDF9] parchment-border rounded-2xl shadow-folio overflow-hidden">
          
          {/* Workstation Top Chrome / Title Bar */}
          <div className="bg-[#FAF8F5] border-b linen-rule px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]/80"></span>
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></span>
                <span className="w-3 h-3 rounded-full bg-[#10B981]/80"></span>
              </div>
              <span className="text-xs font-semibold text-[#6B7280] ml-2">
                CampusFlow Production Cluster • Live Workspace
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-pulse"></span>
                Database Synchronized
              </span>
              <span className="text-[#6B7280] hidden sm:inline">PostgreSQL 15</span>
            </div>
          </div>

          {/* Workstation Body Content */}
          <div className="p-6 sm:p-8">
            
            {/* 1. STUDENT PERSPECTIVE */}
            {activeTab === 'student' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Metric Summary Ribbon */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Active Applications</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">3 Drives</span>
                    <span className="text-[11px] text-[#047857] font-semibold mt-1 block">All Criteria Cleared</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Upcoming Interviews</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">1 Scheduled</span>
                    <span className="text-[11px] text-[#1E40AF] font-semibold mt-1 block">NovaTech • Nov 02, 2:00 PM</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Offers Extended</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">1 Confirmed</span>
                    <span className="text-[11px] text-[#C5A880] font-semibold mt-1 block">Apex Global Labs • ₹14.0 LPA</span>
                  </div>
                </div>

                {/* Applications Table View */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-prestige text-lg font-bold text-[#14432A]">
                      Your Applications & Cutoff Status
                    </h4>
                    <span className="text-xs text-[#6B7280]">Showing 3 Active Drives</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-4 bg-[#FAF8F5] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subsheet">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#14432A]">NovaTech Systems</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0]">
                            SHORTLISTED
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">Software Engineer Trainee • Cutoff: ≥ 8.00 CGPA (Your: 8.85 ✓)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#14432A] font-semibold">meet.google.com/novatech-cf-0325</span>
                        <span className="px-3 py-1.5 bg-[#14432A] text-white text-xs font-semibold rounded">Join Call</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subsheet">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#14432A]">CloudScale Systems</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#1E40AF] bg-[#EFF6FF] border border-[#BFDBFE]">
                            UNDER REVIEW
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">Platform Engineer • Cutoff: ≥ 7.50 CGPA (Your: 8.85 ✓)</p>
                      </div>
                      <span className="text-xs text-[#6B7280] font-medium">Coding Round Evaluated</span>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subsheet">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#14432A]">Apex Global Labs</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A]">
                            OFFER RECEIVED
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">Distributed Systems Associate • Package: ₹14.0 LPA</p>
                      </div>
                      <span className="px-3 py-1.5 bg-[#B45309] text-white text-xs font-semibold rounded">View Offer Letter</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. RECRUITER PERSPECTIVE */}
            {activeTab === 'recruiter' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Total Applied Pool</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">128 Candidates</span>
                    <span className="text-[11px] text-[#6B7280] mt-1 block">Drive: Autumn 2026</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Qualified (≥ 8.00 CGPA)</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#047857] mt-1 block">42 Pre-Screened</span>
                    <span className="text-[11px] text-[#047857] font-semibold mt-1 block">0 Active Backlogs</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Interview Pipeline</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">14 Shortlisted</span>
                    <span className="text-[11px] text-[#14432A] font-semibold mt-1 block">Rooms Dispatched</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-prestige text-lg font-bold text-[#14432A]">
                      Pre-Screened Applicant Review Queue
                    </h4>
                    <span className="text-xs text-[#6B7280]">NovaTech Systems • Software Engineer Trainee</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-4 bg-[#FAF8F5] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subsheet">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#14432A]">Aarav Sharma</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0]">
                            CGPA 8.85 / 10.0
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">B.Tech CSE • Skills: React, TypeScript, PostgreSQL, Distributed Systems</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#14432A] text-white text-xs font-semibold rounded shadow-sm">
                          Extend Offer
                        </button>
                        <button className="px-3 py-1.5 bg-white parchment-border text-[#4B5563] text-xs font-semibold rounded">
                          Reschedule
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] parchment-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subsheet">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#14432A]">Diya Patel</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0]">
                            CGPA 9.12 / 10.0
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">B.Tech CSE • Skills: Python, Machine Learning, Docker, SQL</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#14432A] text-white text-xs font-semibold rounded shadow-sm">
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ADMIN PERSPECTIVE */}
            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Total Batch Registered</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">320 Students</span>
                    <span className="text-[11px] text-[#047857] font-semibold mt-1 block">100% Pre-Verified Records</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Current Placement Rate</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#047857] mt-1 block">78.5% Placed</span>
                    <span className="text-[11px] text-[#6B7280] mt-1 block">251 / 320 Students</span>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl">
                    <span className="text-xs text-[#6B7280] font-medium block">Average Annual Package</span>
                    <span className="font-serif-prestige text-3xl font-bold text-[#14432A] mt-1 block">₹12.4 LPA</span>
                    <span className="text-[11px] text-[#C5A880] font-semibold mt-1 block">Highest: ₹18.0 LPA (NovaTech)</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F5] parchment-border rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#14432A] uppercase tracking-wider">
                      Department Placement Distribution
                    </span>
                    <span className="text-xs text-[#047857] font-semibold">Active Drive In Progress</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium text-[#4B5563]">Computer Science & Engineering (120 Students)</span>
                        <span className="font-bold text-[#14432A]">92% Placed</span>
                      </div>
                      <div className="w-full bg-[#EFECE4] rounded-full h-2 overflow-hidden">
                        <div className="bg-[#14432A] h-full rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium text-[#4B5563]">Electronics & Communication (85 Students)</span>
                        <span className="font-bold text-[#14432A]">84% Placed</span>
                      </div>
                      <div className="w-full bg-[#EFECE4] rounded-full h-2 overflow-hidden">
                        <div className="bg-[#14432A] h-full rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Workstation Footer Status */}
          <div className="bg-[#FAF8F5] border-t linen-rule px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
            <span>CampusFlow Unified Recruitment Architecture • Version 4.0</span>
            <div className="flex items-center gap-4">
              <span>Supabase RLS Protected</span>
              <span>•</span>
              <span>0 ms Real-Time Status Latency</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
