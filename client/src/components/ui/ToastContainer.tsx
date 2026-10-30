import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  // Deduplicate toasts by title + message
  const uniqueToasts = toasts.filter(
    (toast, index, self) =>
      index === self.findIndex((t) => t.title === toast.title && t.message === toast.message)
  );

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-brand flex-shrink-0" />,
  };

  const borders = {
    success: 'border-success-border bg-surface',
    warning: 'border-warning-border bg-surface',
    error: 'border-error-border bg-surface',
    info: 'border-brand-border bg-surface',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {uniqueToasts.slice(-3).map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-3.5 rounded-card border shadow-dropdown animate-in slide-in-from-bottom-2 duration-150',
            borders[toast.type]
          )}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-ink-950 leading-tight">{toast.title}</h4>
            {toast.message && <p className="text-[11px] text-ink-600 mt-0.5">{toast.message}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-ink-400 hover:text-ink-950 transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
