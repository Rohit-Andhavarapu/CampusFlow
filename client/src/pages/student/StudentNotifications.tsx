import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, Calendar, Briefcase, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDateTime } from '../../utils/formatters';

export const StudentNotifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-border/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
            Notifications Center
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Real-time updates regarding your drive eligibility, interview calls, and placement announcements.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
          Mark All As Read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center bg-white border border-slate-200/90 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            You are completely up to date. Updates regarding application status, upcoming interview rounds, and campus drive alerts will arrive here in real-time.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              hoverable
              onClick={() => {
                markNotificationRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-4 transition-all flex items-start gap-3.5 ${
                !n.read ? 'bg-brand-surface/30 border-brand/20' : ''
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                {n.type === 'interview' ? (
                  <div className="p-2 rounded-lg bg-warning-surface text-warning-text">
                    <Calendar className="w-4 h-4" />
                  </div>
                ) : n.type === 'application' ? (
                  <div className="p-2 rounded-lg bg-brand-surface text-brand">
                    <Briefcase className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-info-surface text-info-text">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-primary-text">{n.title}</h4>
                  <span className="text-[11px] text-muted-text">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-secondary-text mt-1 leading-relaxed">{n.message}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
