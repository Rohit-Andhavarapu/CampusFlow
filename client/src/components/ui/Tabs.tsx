import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badgeDot?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center space-x-1 border-b border-border/80 overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative py-2.5 px-3 text-[13px] font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 -mb-px outline-none',
              isActive
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            )}
          >
            <span>{tab.label}</span>
            {tab.badgeDot && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.2 rounded font-mono font-medium',
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/70'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
