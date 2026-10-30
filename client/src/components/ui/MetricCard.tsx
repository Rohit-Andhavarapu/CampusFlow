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
}) => {
  return (
    <Card
      hoverable={Boolean(onClick)}
      onClick={onClick}
      className={cn(
        'p-5 flex flex-col justify-between transition-colors bg-surface border border-border shadow-subtle',
        onClick && 'cursor-pointer hover:border-border-strong hover:bg-surface-subtle',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-ink-500 tracking-tight">{label}</p>
          {icon && <div className="text-ink-400">{icon}</div>}
        </div>

        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-950 font-sans">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-[11px] font-semibold px-1.5 py-0.5 rounded-badge border',
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : trend.isPositive
                  ? 'bg-success-surface text-success border-success-border'
                  : 'bg-error-surface text-error border-error-border'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {subtext && (
        <div className="mt-3.5 pt-3 border-t border-border/70 text-[11px] text-ink-500">
          {subtext}
        </div>
      )}
    </Card>
  );
};
