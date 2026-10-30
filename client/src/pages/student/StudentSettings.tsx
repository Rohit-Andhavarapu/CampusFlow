import React, { useState } from 'react';
import { Settings, Bell, Lock, Shield, Eye, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

export const StudentSettings: React.FC = () => {
  const { showToast } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewSms, setInterviewSms] = useState(true);
  const [shareProfileWithRecruiters, setShareProfileWithRecruiters] = useState(true);

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">
          Account & Privacy Settings
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Control your recruitment preferences, notification delivery, and profile visibility.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <h3 className="text-sm font-bold text-primary-text">Notification Preferences</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-primary-text">Email Notifications</p>
              <p className="text-[11px] text-muted-text">
                Receive instant emails when a recruiter shortlists your profile or schedules an interview.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-brand rounded focus:ring-brand"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-border/50">
            <div>
              <p className="text-xs font-semibold text-primary-text">Interview SMS Reminders</p>
              <p className="text-[11px] text-muted-text">
                Get an SMS alert 1 hour prior to your scheduled campus interview rounds.
              </p>
            </div>
            <input
              type="checkbox"
              checked={interviewSms}
              onChange={(e) => setInterviewSms(e.target.checked)}
              className="w-4 h-4 text-brand rounded focus:ring-brand"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-border/50">
            <div>
              <p className="text-xs font-semibold text-primary-text">Auto-Share Resume with Eligible Drives</p>
              <p className="text-[11px] text-muted-text">
                Allows placement administration to propose your candidature for exclusive pool drives.
              </p>
            </div>
            <input
              type="checkbox"
              checked={shareProfileWithRecruiters}
              onChange={(e) => setShareProfileWithRecruiters(e.target.checked)}
              className="w-4 h-4 text-brand rounded focus:ring-brand"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-border/60 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast('success', 'Preferences Saved', 'Your privacy settings have been updated.')}
          >
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};
