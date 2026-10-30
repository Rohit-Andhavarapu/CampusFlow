import React from 'react';
import { Calendar, Video, Clock, Building2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/formatters';

export const AdminInterviews: React.FC = () => {
  const { interviews } = useApp();

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Campus Interview Schedule Oversight
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Monitor all scheduled virtual and on-campus interview panels for the placement cell.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.map((int) => (
          <Card key={int.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary-text">{int.companyName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-brand font-semibold">{int.jobTitle}</span>
              </div>
              <h3 className="text-base font-bold text-primary-text mt-1">{int.round}</h3>
              <p className="text-xs text-secondary-text mt-1">
                Student: <strong>{int.studentName}</strong> ({int.studentRollNo})
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-text mt-2">
                <span className="font-semibold text-primary-text flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand" />
                  {formatDateTime(int.dateTime)}
                </span>
                <span>Mode: {int.mode}</span>
                <span>Interviewer: {int.interviewer}</span>
              </div>
            </div>

            <Badge variant={int.status === 'Scheduled' ? 'warning' : 'success'} dot size="md">
              {int.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};
