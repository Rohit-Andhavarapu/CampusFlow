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
    default: 'bg-slate-100/80 text-slate-700 border-slate-200/80',
    brand: 'bg-teal-50 text-teal-800 border-teal-200/90',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/90',
    error: 'bg-red-50 text-red-800 border-red-200/90',
    info: 'bg-blue-50 text-blue-800 border-blue-200/90',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200/70',
  };

  const dotColors = {
    default: 'bg-slate-400',
    brand: 'bg-teal-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-600',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded gap-1 font-medium',
    md: 'text-xs px-2.5 py-0.5 rounded-md gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border transition-colors select-none tabular-nums',
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
