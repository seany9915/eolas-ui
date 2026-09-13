import * as React from 'react';
import { Icon } from '@/components/ui/icon';

export interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navTabs = [
    { id: 'tokens', label: 'Color Tokens & Color Law', shortLabel: 'Color Tokens', icon: 'palette' },
    { id: 'components', label: 'Base UI Component Library', shortLabel: 'Components', icon: 'widgets' },
    { id: 'icons', label: 'Icon Styling Rules', shortLabel: 'Icon Rules', icon: 'category' },
    { id: 'brand', label: 'Brand Assets Integration', shortLabel: 'Brand Assets', icon: 'branding_watermark' },
    { id: 'audit', label: 'Anti-Pattern & A11y Audit', shortLabel: 'Audit & A11y', icon: 'verified' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant shadow-xs transition-colors">
      <div className="w-full max-w-[88rem] mx-auto px-3 sm:px-5 lg:px-8 min-h-[4.5rem] py-2 sm:py-0 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Horizontal Lockup Integration */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logos/horizontal-lockup.svg"
            alt="Eolas Brand Logo"
            className="h-8 sm:h-9 w-auto object-contain max-h-[40px]"
          />
          <div className="hidden md:block h-5 w-[1px] bg-outline-variant" />
          <span className="hidden md:inline-block font-label text-xs font-bold text-on-surface-variant whitespace-nowrap">
            Playground & Component Library
          </span>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto min-w-0 py-1 scrollbar-none" aria-label="Main Navigation">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  title={tab.label}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 min-h-[40px] rounded-[0.5rem] font-label text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <Icon name={tab.icon} size="sm" aria-hidden="true" />
                  <span className="hidden xl:inline whitespace-nowrap">{tab.label}</span>
                  <span className="inline xl:hidden whitespace-nowrap">{tab.shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

