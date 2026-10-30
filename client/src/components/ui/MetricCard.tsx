import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'brand' | 'success' | 'warning';
  elevation?: 0 | 1 | 2;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  onClick,
  className,
  variant = 'default',
  elevation = 1,
}) => {
  return (
    <Card
      elevation={elevation}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      className={cn(
        'p-5 flex flex-col justify-between transition-all bg-surface border border-slate-200/80',
        onClick && 'cursor-pointer hover:border-slate-300 card-lift',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-slate-500 tracking-tight">{label}</p>
          {icon && <div className="text-slate-400">{icon}</div>}
        </div>

        <div className="mt-2.5 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold tracking-tight text-ink-950 tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-[11px] font-semibold px-1.5 py-0.5 rounded border tabular-nums',
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">{subtext}</p>
        </div>
      )}
    </Card>
  );
};
