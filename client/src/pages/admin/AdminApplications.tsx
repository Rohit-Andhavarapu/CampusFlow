import React, { useState } from 'react';
import { FileText, Search, Filter, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, getStatusBadgeStyle } from '../../utils/formatters';

export const AdminApplications: React.FC = () => {
  const { applications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = applications.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.studentName.toLowerCase().includes(q) ||
        a.companyName.toLowerCase().includes(q) ||
        a.jobTitle.toLowerCase().includes(q) ||
        a.studentRollNo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
            Central Application Oversight
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Complete college-wide registry of every job application submitted across all departments.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {applications.length} Applications Logged
        </Badge>
      </div>

      <Card className="overflow-hidden border-border shadow-card">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all campus applications..."
            className="w-full max-w-sm pl-3 pr-3 py-2 text-xs bg-surface-secondary/40 border border-border rounded-button text-primary-text focus-ring"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 border-b border-border text-secondary-text uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((app) => {
                const badgeStyle = getStatusBadgeStyle(app.status);
                return (
                  <tr key={app.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-primary-text">{app.studentName}</td>
                    <td className="py-3 px-4 text-secondary-text">{app.companyName}</td>
                    <td className="py-3 px-4 font-semibold text-primary-text">{app.jobTitle}</td>
                    <td className="py-3 px-4 text-secondary-text">{app.studentBranch}</td>
                    <td className="py-3 px-4 font-bold text-brand">{app.studentCgpa}</td>
                    <td className="py-3 px-4 text-muted-text">{formatDate(app.appliedAt)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border text-[11px] ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
