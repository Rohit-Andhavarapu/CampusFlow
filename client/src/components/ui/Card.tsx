import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  interactive?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, interactive = false, elevation = 0, children, ...props }, ref) => {
    const isInteractive = hoverable || interactive;

    const elevationStyles = {
      0: 'shadow-none border-slate-200/80',
      1: 'shadow-xs border-slate-200/90',
      2: 'shadow-sm border-slate-200',
      3: 'shadow-md border-slate-200',
      4: 'shadow-lg border-slate-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface border rounded-card overflow-hidden',
          elevationStyles[elevation],
          isInteractive ? 'card-lift cursor-pointer hover:border-slate-300' : 'transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-5 sm:p-6 border-b border-border/60 flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base sm:text-lg font-bold text-ink-950 tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-ink-500 font-normal leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 sm:p-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 sm:p-5 border-t border-border/60 bg-surface-subtle/50 flex items-center justify-between', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
