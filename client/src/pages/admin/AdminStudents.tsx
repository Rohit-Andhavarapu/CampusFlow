import React, { useState, useMemo } from 'react';
import { GraduationCap, Search, Filter, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { syntheticStudents } from '../../data/mockData';

export const AdminStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredStudents = useMemo(() => {
    return syntheticStudents.filter((st) => {
      if (selectedBranch !== 'all' && !st.branch.toLowerCase().includes(selectedBranch.toLowerCase())) {
        return false;
      }
      if (selectedStatus !== 'all' && st.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !st.name.toLowerCase().includes(q) &&
          !st.rollNo.toLowerCase().includes(q) &&
          !st.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedBranch, selectedStatus]);

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
            Student Placement Directory
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Complete database of eligible graduates, academic CGPA verification, and placement outcomes.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {syntheticStudents.length} Registered Students
        </Badge>
      </div>

      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-card">
        <div className="w-full md:flex-1 relative">
          <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-secondary/40 border border-border rounded-button text-primary-text focus-ring"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring"
          >
            <option value="all">Branch: All</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">AI & Data Science</option>
            <option value="Electronics">Electronics</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-surface border border-border rounded-button px-3 py-2 text-secondary-text font-medium focus-ring"
          >
            <option value="all">Status: All</option>
            <option value="Placed">Placed</option>
            <option value="In Process">In Process</option>
            <option value="Unplaced">Unplaced</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden border-border shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 border-b border-border/80 text-secondary-text uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4">Offer / Company</th>
                <th className="py-3 px-4">Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-primary-text">{st.name}</td>
                  <td className="py-3.5 px-4 font-mono text-muted-text">{st.rollNo}</td>
                  <td className="py-3.5 px-4 text-secondary-text">{st.branch}</td>
                  <td className="py-3.5 px-4 font-bold text-brand">{st.cgpa}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        st.status === 'Placed'
                          ? 'success'
                          : st.status === 'In Process'
                          ? 'warning'
                          : 'neutral'
                      }
                      dot
                      size="sm"
                    >
                      {st.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-primary-text">{st.company || '—'}</td>
                  <td className="py-3.5 px-4 font-bold text-success-text">{st.package || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
