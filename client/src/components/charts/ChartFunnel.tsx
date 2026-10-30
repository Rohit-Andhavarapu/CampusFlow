import React from 'react';
import { ArrowDown, CheckCircle2, Users } from 'lucide-react';

export interface FunnelStage {
  name: string;
  count: number;
  value?: number;
  description?: string;
  color?: string;
}

interface ChartFunnelProps {
  stages?: FunnelStage[];
  data?: Array<{ name: string; value?: number; count?: number; color?: string; description?: string }>;
  title?: string;
  subtitle?: string;
  description?: string;
  height?: number;
  emptyMessage?: string;
  className?: string;
}

export const ChartFunnel: React.FC<ChartFunnelProps> = ({
  stages,
  data,
  title,
  subtitle,
  description,
  height,
  emptyMessage = 'No pipeline stages currently active',
  className = '',
}) => {
  const displaySubtitle = subtitle || description;
  const rawList = stages || data || [];
  const normalizedStages: FunnelStage[] = rawList.map((item) => ({
    name: item.name,
    count: item.count !== undefined ? item.count : (item.value !== undefined ? item.value : 0),
    description: item.description,
    color: item.color,
  }));

  const topCount = normalizedStages.length > 0 ? normalizedStages[0].count : 0;
  const hasData = topCount > 0;

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between ${className}`} style={height ? { minHeight: height } : undefined}>
      {/* Header */}
      {(title || displaySubtitle) && (
        <div className="pb-3 border-b border-slate-100">
          {title && (
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              {title}
            </h3>
          )}
          {displaySubtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5">{displaySubtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[180px]">
          <p className="text-xs font-medium text-slate-700">{emptyMessage}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Stages progress through screening, evaluations, and offer selection.
          </p>
        </div>
      ) : (
        <div className="space-y-3 py-3">
          {normalizedStages.map((stage, idx) => {
            const pctOfTop = topCount > 0 ? Math.round((stage.count / topCount) * 100) : 0;
            const prevCount = idx > 0 ? normalizedStages[idx - 1].count : stage.count;
            const stepConversion = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : 100;

            const bgColors = [
              'bg-teal-700',
              'bg-teal-600',
              'bg-teal-500',
              'bg-emerald-600',
            ];
            const barColor = stage.color || bgColors[idx % bgColors.length];

            return (
              <div key={stage.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{stage.name}</span>
                    {stage.description && (
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        • {stage.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      {stage.count}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-700 tabular-nums">
                      {pctOfTop}%
                    </span>
                  </div>
                </div>

                {/* Progress funnel track */}
                <div className="w-full bg-slate-100 rounded-md h-3 overflow-hidden flex">
                  <div
                    className={`${barColor} h-full rounded-md transition-all duration-500`}
                    style={{ width: `${Math.max(pctOfTop, 4)}%` }}
                  />
                </div>

                {/* Conversion delta indicator */}
                {idx > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 pl-4 font-mono">
                    <ArrowDown className="w-2.5 h-2.5 text-slate-400" />
                    <span>{stepConversion}% step-through from {normalizedStages[idx - 1].name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
