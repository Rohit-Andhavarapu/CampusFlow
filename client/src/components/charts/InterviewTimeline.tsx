import React from 'react';
import { Calendar, Clock, Video, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Interview } from '../../types';

interface InterviewTimelineProps {
  title?: string;
  description?: string;
  interviews: Interview[];
  onExportIcs?: (interview: Interview) => void;
}

export const InterviewTimeline: React.FC<InterviewTimelineProps> = ({
  title = 'Interview Schedule Timeline',
  description = 'Confirmed interview evaluations, technical rounds, and calendar synchronizations.',
  interviews,
  onExportIcs,
}) => {
  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-stone-700">No scheduled interviews</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Shortlisted applications will appear here once evaluation slots are issued.</p>
        </div>
      </div>
    );
  }

  const sortedInterviews = [...interviews].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
          {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          {interviews.length} Round{interviews.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {sortedInterviews.map((item, idx) => {
          const dateObj = new Date(item.dateTime);
          const isPast = dateObj.getTime() < Date.now();
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                  isPast ? 'border-stone-400 text-stone-400' : 'border-teal-700 text-teal-700 ring-2 ring-teal-100'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-stone-400' : 'bg-teal-700'}`} />
              </div>

              <div className="bg-stone-50/70 hover:bg-stone-100/60 transition-colors border border-stone-200/70 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-teal-900 bg-teal-100/60 px-2 py-0.5 rounded border border-teal-200">
                      {item.round}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 mt-1">{item.companyName}</h4>
                    <p className="text-[11px] text-stone-500">{item.jobTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-stone-800 block">{formattedDate}</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formattedTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    {item.mode === 'Virtual' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px]">Virtual Video Conference</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[11px]">{item.locationOrLink || 'Campus Placement Office'}</span>
                      </>
                    )}
                  </div>

                  {onExportIcs && (
                    <button
                      onClick={() => onExportIcs(item)}
                      className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 underline decoration-teal-300 underline-offset-2 transition-colors"
                    >
                      Export .ics
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
