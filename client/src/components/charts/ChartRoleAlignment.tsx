import React from 'react';
import { Target, ChevronRight, Sparkles } from 'lucide-react';

export interface RoleAlignment {
  role: string;
  alignment: 'Strong' | 'Good' | 'Developing';
  scorePct: number;
  matchingSkills: string[];
  missingSkills?: string[];
}

interface ChartRoleAlignmentProps {
  title?: string;
  description?: string;
  roles: RoleAlignment[];
  onExploreRole?: (role: string) => void;
}

export const ChartRoleAlignment: React.FC<ChartRoleAlignmentProps> = ({
  title = 'AI Career Role Compatibility',
  description = 'Derived from verified resume competencies matched against industry benchmark profiles.',
  roles,
  onExploreRole,
}) => {
  if (!roles || roles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-stone-700">Resume not analyzed yet</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Upload and analyze your PDF resume with Groq AI to calculate career role compatibility.</p>
        </div>
      </div>
    );
  }

  const badgeStyles = {
    Strong: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
    Good: 'bg-teal-100/70 text-teal-800 border-teal-200',
    Developing: 'bg-amber-100/70 text-amber-800 border-amber-200',
  };

  const barStyles = {
    Strong: 'bg-emerald-600',
    Good: 'bg-teal-600',
    Developing: 'bg-amber-500',
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Groq AI Intelligence
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
          {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {roles.map((item) => (
          <div key={item.role} className="space-y-1.5 p-3 rounded-xl bg-stone-50/70 border border-stone-200/60">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900">{item.role}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[item.alignment] || badgeStyles.Good}`}>
                  {item.alignment} Alignment
                </span>
              </div>
              <span className="font-mono font-bold text-stone-700">{item.scorePct}% Match</span>
            </div>

            {/* Horizontal Alignment Bar */}
            <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barStyles[item.alignment] || barStyles.Good}`}
                style={{ width: `${item.scorePct}%` }}
              />
            </div>

            {/* Supporting Skills Chips */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[10px] text-stone-400 font-mono">Verified:</span>
              {item.matchingSkills.slice(0, 4).map((s) => (
                <span key={s} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-stone-700 border border-stone-200">
                  {s}
                </span>
              ))}
              {item.matchingSkills.length > 4 && (
                <span className="text-[10px] text-stone-400 font-mono">+{item.matchingSkills.length - 4} more</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
