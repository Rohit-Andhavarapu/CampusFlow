import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-secondary text-secondary-text border-border',
    brand: 'bg-brand-surface text-brand border-brand/20',
    success: 'bg-success-surface text-success-text border-success-border',
    warning: 'bg-warning-surface text-warning-text border-warning-border',
    error: 'bg-error-surface text-error-text border-error-border',
    info: 'bg-info-surface text-info-text border-info-border',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    default: 'bg-muted-text',
    brand: 'bg-brand',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-badge gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-badge gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
