import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export interface BarDataPoint {
  name: string;
  value: number;
  total?: number;
  percentage?: number;
  color?: string;
  benchmark?: string;
}

interface ChartBarHorizontalProps {
  data: BarDataPoint[];
  title?: string;
  subtitle?: string;
  description?: string;
  barColor?: string;
  benchmarkValue?: number;
  valueFormatter?: (val: number) => string;
  height?: number;
  emptyMessage?: string;
  className?: string;
  onBarClick?: (entry: BarDataPoint) => void;
  selectedBar?: string | null;
}

const DEFAULT_COLOR = '#0F766E';

export const ChartBarHorizontal: React.FC<ChartBarHorizontalProps> = ({
  data,
  title,
  subtitle,
  description,
  barColor,
  benchmarkValue,
  valueFormatter = (v) => `${v}`,
  height = 240,
  emptyMessage = 'No comparative benchmark records available',
  className = '',
  onBarClick,
  selectedBar,
}) => {
  const displaySubtitle = subtitle || description;
  const hasData = data && data.length > 0 && data.some((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as BarDataPoint;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xs text-white px-3.5 py-2.5 rounded-lg shadow-lg border border-slate-800 text-xs z-50">
          <p className="font-semibold text-slate-100 mb-1">{entry.name}</p>
          <div className="flex items-baseline justify-between gap-4 font-mono">
            <span className="text-slate-400">Value:</span>
            <span className="font-bold text-white tabular-nums">{valueFormatter(entry.value)}</span>
          </div>
          {entry.percentage !== undefined && (
            <div className="flex items-baseline justify-between gap-4 font-mono">
              <span className="text-slate-400">Rate:</span>
              <span className="font-bold text-teal-400 tabular-nums">{entry.percentage}%</span>
            </div>
          )}
          {entry.benchmark && (
            <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] text-slate-300 mt-1 pt-1 border-t border-slate-800">
              <span className="text-slate-400">Benchmark:</span>
              <span>{entry.benchmark}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between ${className}`}>
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
            Institutional aggregates update in real-time as placement drives conclude.
          </p>
        </div>
      ) : (
        <div className="pt-2" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                onClick={(entry) => onBarClick?.(entry)}
                cursor={onBarClick ? 'pointer' : 'default'}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || barColor || DEFAULT_COLOR}
                    opacity={selectedBar === entry.name ? 1 : selectedBar ? 0.4 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
