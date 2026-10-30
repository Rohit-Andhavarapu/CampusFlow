import React from 'react';
import { Calendar, Video, Clock, User, ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/formatters';

export const RecruiterInterviews: React.FC = () => {
  const { interviews } = useApp();

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evaluation Calendar</span>
        </div>
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight mt-1">
          Scheduled Candidate Interviews
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Manage upcoming video conferences and track panel scoring across recruitment rounds.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.map((int) => (
          <Card key={int.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={int.mode === 'Virtual' ? 'brand' : 'neutral'} size="sm">
                  {int.mode}
                </Badge>
                <span className="text-xs font-semibold text-secondary-text">{int.jobTitle}</span>
              </div>
              <h3 className="text-base font-bold text-primary-text mt-1">{int.round}</h3>
              <p className="text-xs text-secondary-text mt-1">
                Candidate: <strong>{int.studentName}</strong> ({int.studentRollNo})
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-text mt-2">
                <span className="flex items-center gap-1 font-semibold text-primary-text">
                  <Calendar className="w-3.5 h-3.5 text-brand" />
                  {formatDateTime(int.dateTime)}
                </span>
                <span>Panel: {int.interviewer}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {int.locationOrLink && (
                <a
                  href={int.locationOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-brand text-white text-xs font-semibold hover:bg-brand-hover shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Room
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
