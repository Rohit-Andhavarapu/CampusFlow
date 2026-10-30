import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Building2,
  CheckCircle2,
  User,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { formatDateTime } from '../../utils/formatters';

export const StudentInterviews: React.FC = () => {
  const { interviews } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const pastInterviews = interviews.filter((i) => i.status !== 'Scheduled');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Schedule', count: upcomingInterviews.length },
    { id: 'past', label: 'Completed Rounds', count: pastInterviews.length },
    { id: 'all', label: 'All Interviews', count: interviews.length },
  ];

  const displayedInterviews =
    activeTab === 'upcoming'
      ? upcomingInterviews
      : activeTab === 'past'
      ? pastInterviews
      : interviews;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Without Banned Kickers */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 tracking-tight font-sans">
              Interview Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage virtual meeting rooms, panel assignments, and scheduled rounds for campus hiring drives.
            </p>
          </div>
        </div>

        {/* Tab row */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Interview Cards List */}
      {displayedInterviews.length === 0 ? (
        <Card elevation={1} className="p-12 text-center flex flex-col items-center justify-center border-slate-200/80">
          <Calendar className="w-10 h-10 text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-ink-950">No interviews in this view</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            When recruiters shortlist your profile for technical discussions or campus hiring rounds, your calendar invites and virtual rooms will appear here.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/student/applications')}
          >
            Check Application Status
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedInterviews.map((interview) => (
            <Card key={interview.id} elevation={1} className="p-6 bg-surface border-slate-200/80 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={interview.companyLogo}
                    alt={interview.companyName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {interview.companyName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <Badge
                        variant="neutral"
                        size="sm"
                      >
                        {interview.mode === 'Virtual' ? (
                          <Video className="w-3 h-3 inline mr-1 text-teal-700" />
                        ) : (
                          <MapPin className="w-3 h-3 inline mr-1 text-slate-500" />
                        )}
                        {interview.mode}
                      </Badge>
                      <Badge
                        variant={interview.status === 'Scheduled' ? 'warning' : 'success'}
                        dot
                        size="sm"
                      >
                        {interview.status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-ink-950 mt-1">
                      {interview.round}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Role: {interview.jobTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 mt-3 font-mono">
                      <span className="flex items-center gap-1.5 font-semibold text-ink-950">
                        <Calendar className="w-4 h-4 text-teal-700" />
                        {formatDateTime(interview.dateTime)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        Panel: {interview.interviewer}
                      </span>
                    </div>

                    {interview.notes && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                        <p className="font-semibold text-ink-950 mb-0.5">Candidate Preparation Instructions:</p>
                        <p>{interview.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  {interview.locationOrLink && interview.status === 'Scheduled' ? (
                    <a
                      href={interview.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-button bg-teal-700 text-white text-xs font-semibold hover:bg-teal-600 shadow-xs border border-teal-800/40 transition-all btn-press"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Video Conference</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-xs"
                    >
                      Round Completed
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500 hover:text-ink-950"
                    onClick={() => navigate(`/student/applications/${interview.applicationId}`)}
                  >
                    View Application Dossier
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
