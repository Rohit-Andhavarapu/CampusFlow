import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

export const AdminReports: React.FC = () => {
  const { showToast } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (reportName: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('success', 'Report Exported', `${reportName} downloaded as CSV/PDF.`);
    }, 600);
  };

  const reports = [
    {
      title: 'NIRF 2026 Placement Metrics Compliance Report',
      desc: 'Standardized median salary, higher education ratio, and graduate placement documentation.',
      format: 'PDF & CSV',
    },
    {
      title: 'Company-Wise Recruiter Hiring & CTC Summary',
      desc: 'Complete audit of every offer letter extended, designation, stipend, and final compensation.',
      format: 'Excel & CSV',
    },
    {
      title: 'Department-Wise Placement Statistics (NAAC Criteria 5.2)',
      desc: 'Student progression records, eligibility logs, and branch-specific placement records.',
      format: 'PDF Document',
    },
    {
      title: 'Unplaced Student Remedial Counseling Report',
      desc: 'Identifies candidates with low CGPA or missing skills for supplementary training bootcamps.',
      format: 'CSV Export',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Accreditation & Compliance Reports
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Generate official university placement reports for NIRF, NAAC, NBA, and AICTE audits.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <Card key={r.title} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-brand-surface text-brand flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-text">{r.title}</h3>
                <p className="text-xs text-secondary-text mt-1">{r.desc}</p>
                <span className="text-[10px] font-semibold text-muted-text mt-2 block">
                  Format: {r.format}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              isLoading={isExporting}
              onClick={() => handleExport(r.title)}
            >
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
