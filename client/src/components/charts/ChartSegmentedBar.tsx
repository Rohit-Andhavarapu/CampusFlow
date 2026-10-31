import React from 'react';

export interface Segment {
  name: string;
  count: number;
  color: string;
}

interface ChartSegmentedBarProps {
  title: string;
  description?: string;
  segments: Segment[];
  totalLabel?: string;
}

export const ChartSegmentedBar: React.FC<ChartSegmentedBarProps> = ({
  title,
  description,
  segments,
  totalLabel = 'Total Applications',
}) => {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-2">
            📊
          </div>
          <p className="text-xs font-semibold text-stone-700">No active applications in pipeline</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Explore opportunities and submit applications to view stage progression.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight">{title}</h3>
          {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-stone-800">{total}</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">{totalLabel}</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex p-0.5 gap-0.5">
        {segments.map((seg, idx) => {
          if (seg.count === 0) return null;
          const pct = Math.max(2, (seg.count / total) * 100);
          return (
            <div
              key={seg.name}
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: seg.color }}
              title={`${seg.name}: ${seg.count} (${Math.round((seg.count / total) * 100)}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Count Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-100">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
          return (
            <div key={seg.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <div className="min-w-0">
                <span className="text-xs font-medium text-stone-700 truncate block">{seg.name}</span>
                <span className="text-[11px] font-mono text-stone-400">
                  {seg.count} <span className="text-stone-300">({pct}%)</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
