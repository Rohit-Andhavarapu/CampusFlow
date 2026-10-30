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
    <div className={cn('flex items-center space-x-1 border-b border-border overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative py-2.5 px-3.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 -mb-px outline-none',
              isActive
                ? 'border-brand text-brand font-semibold'
                : 'border-transparent text-secondary-text hover:text-primary-text hover:border-slate-300'
            )}
          >
            <span>{tab.label}</span>
            {tab.badgeDot && <span className="w-2 h-2 rounded-full bg-error" />}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  isActive
                    ? 'bg-brand-surface text-brand'
                    : 'bg-surface-secondary text-secondary-text'
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
