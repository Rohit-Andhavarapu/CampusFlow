import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface ChartPieDonutProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  description?: string;
  donut?: boolean;
  centerMetric?: {
    value: string | number;
    label: string;
  };
  centerLabel?: string;
  centerValue?: string | number;
  emptyMessage?: string;
  onSliceClick?: (entry: ChartDataPoint, index: number) => void;
  selectedSlice?: string | null;
  height?: number;
  showTableToggle?: boolean;
  className?: string;
}

// CampusFlow Tailored Palette — restrained, accessible, professional
const CAMPUS_PALETTE = [
  '#0F766E', // Teal 700 (Brand Primary)
  '#0284C7', // Sky 600 (Technical Info)
  '#D97706', // Amber 600 (Warning / Pending)
  '#059669', // Emerald 600 (Selected / Success)
  '#6366F1', // Indigo 500 (Interview / Evaluation)
  '#64748B', // Slate 500 (Secondary / Neutral)
  '#E11D48', // Rose 600 (Rejected / Terminal)
  '#8B5CF6', // Purple 500 (Alternative)
];

export const ChartPieDonut: React.FC<ChartPieDonutProps> = ({
  data,
  title,
  subtitle,
  description,
  donut = true,
  centerMetric,
  centerLabel,
  centerValue,
  emptyMessage = 'No recruitment data available for this criteria',
  onSliceClick,
  selectedSlice,
  height = 260,
  showTableToggle = true,
  className = '',
}) => {
  const [showTable, setShowTable] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displaySubtitle = subtitle || description;
  const activeCenter = centerMetric || (centerValue !== undefined && centerLabel ? { value: centerValue, label: centerLabel } : undefined);

  const totalValue = data.reduce((acc, d) => acc + d.value, 0);
  const hasData = totalValue > 0 && data.some((d) => d.value > 0);

  // Compute normalized percentages
  const enrichedData = data.map((d, i) => ({
    ...d,
    color: d.color || CAMPUS_PALETTE[i % CAMPUS_PALETTE.length],
    percentage: totalValue > 0 ? Number(((d.value / totalValue) * 100).toFixed(1)) : 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as ChartDataPoint & { color: string; percentage: number };
      return (
        <div className="bg-slate-900/95 backdrop-blur-xs text-white px-3.5 py-2.5 rounded-lg shadow-lg border border-slate-800 text-xs z-50">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-semibold text-slate-100">{entry.name}</span>
          </div>
          <div className="flex items-baseline justify-between gap-4 font-mono">
            <span className="text-slate-400">Volume:</span>
            <span className="font-bold text-white tabular-nums">{entry.value}</span>
          </div>
          <div className="flex items-baseline justify-between gap-4 font-mono">
            <span className="text-slate-400">Share:</span>
            <span className="font-bold text-teal-400 tabular-nums">{entry.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between ${className}`}>
      {/* Chart Header */}
      {(title || displaySubtitle) && (
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                {title}
              </h3>
            )}
            {displaySubtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5">{displaySubtitle}</p>
            )}
          </div>
          {showTableToggle && hasData && (
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              title="Toggle accessible data table view"
            >
              {showTable ? 'View Chart' : 'View Data'}
            </button>
          )}
        </div>
      )}

      {/* Main Body */}
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-2">
            <span className="font-mono text-xs font-bold">0</span>
          </div>
          <p className="text-xs font-medium text-slate-700">{emptyMessage}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Metrics will compute automatically as applications, evaluations, and placement decisions are recorded.
          </p>
        </div>
      ) : showTable ? (
        /* Accessible Data Table View */
        <div className="overflow-x-auto py-3 min-h-[200px]">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-2 px-1">Segment</th>
                <th className="py-2 px-1 text-right">Count</th>
                <th className="py-2 px-1 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrichedData.map((d) => (
                <tr
                  key={d.name}
                  onClick={() => onSliceClick?.(d, 0)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedSlice === d.name ? 'bg-teal-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-2 px-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-800">{d.name}</span>
                  </td>
                  <td className="py-2 px-1 text-right font-mono tabular-nums text-slate-900 font-bold">{d.value}</td>
                  <td className="py-2 px-1 text-right font-mono tabular-nums text-teal-700 font-semibold">{d.percentage}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 text-slate-900 font-bold font-mono text-[11px]">
                <td className="py-2 px-1">Total</td>
                <td className="py-2 px-1 text-right tabular-nums">{totalValue}</td>
                <td className="py-2 px-1 text-right tabular-nums">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        /* Interactive Recharts Visualization */
        <div className="relative w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enrichedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                innerRadius={donut ? '52%' : 0}
                outerRadius={donut ? '74%' : '70%'}
                paddingAngle={donut ? 2 : 0}
                onClick={(entry, idx) => onSliceClick?.(entry, idx)}
                onMouseEnter={(_, idx) => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                cursor={onSliceClick ? 'pointer' : 'default'}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              >
                {enrichedData.map((entry, index) => {
                  const isSelected = selectedSlice === entry.name;
                  const isHovered = hoveredIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={isSelected || isHovered ? 1 : selectedSlice ? 0.35 : 0.9}
                      className="transition-all duration-200 outline-none"
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                formatter={(val: string) => {
                  const item = enrichedData.find((d) => d.name === val);
                  return (
                    <span className={`text-[11px] text-slate-600 hover:text-slate-900 transition-colors ${selectedSlice === val ? 'font-bold text-teal-800' : ''}`}>
                      {val} <span className="font-mono text-slate-400">({item?.value || 0})</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Central Metric in Donut Hole */}
          {donut && activeCenter && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums leading-none tracking-tight">
                {activeCenter.value}
              </span>
              <span className="text-[10px] uppercase font-mono font-medium text-slate-500 mt-1 tracking-wider leading-none">
                {activeCenter.label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
