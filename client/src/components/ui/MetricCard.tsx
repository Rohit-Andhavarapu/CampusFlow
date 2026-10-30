import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
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
  const iconBg = {
    default: 'bg-surface-secondary text-secondary-text',
    brand: 'bg-brand-surface text-brand',
    success: 'bg-success-surface text-success-text',
    warning: 'bg-warning-surface text-warning-text',
  };

  return (
    <Card
      hoverable={Boolean(onClick)}
      onClick={onClick}
      className={cn('p-5 flex flex-col justify-between transition-all duration-200', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-secondary-text tracking-wide uppercase">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-text font-sans">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-badge',
                  trend.isNeutral
                    ? 'bg-slate-100 text-slate-600'
                    : trend.isPositive
                    ? 'bg-success-surface text-success-text'
                    : 'bg-error-surface text-error-text'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
            )}
          </div>
        </div>
        <div className={cn('p-2.5 rounded-lg flex items-center justify-center flex-shrink-0', iconBg[variant])}>
          {icon}
        </div>
      </div>

      {subtext && (
        <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-text flex items-center gap-1.5">
          <span>{subtext}</span>
        </div>
      )}
    </Card>
  );
};
