import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-brand flex-shrink-0" />,
  };

  const borders = {
    success: 'border-success-border bg-surface',
    warning: 'border-warning-border bg-surface',
    error: 'border-error-border bg-surface',
    info: 'border-brand/20 bg-surface',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-4 rounded-card border shadow-dropdown animate-in slide-in-from-bottom-3 duration-200',
            borders[toast.type]
          )}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-primary-text leading-tight">{toast.title}</h4>
            {toast.message && <p className="text-xs text-secondary-text mt-0.5">{toast.message}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted-text hover:text-primary-text transition-colors p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
