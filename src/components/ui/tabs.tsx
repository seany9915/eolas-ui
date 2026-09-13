import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

export interface TabItemData {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export type TabItem = TabItemData;

export interface TabsListProps {
  children: React.ReactNode;
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  variant?: 'line' | 'segmented';
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  activateOnFocus,
  loopFocus,
  variant = 'line',
  className,
}) => (
  <BaseTabs.List
    activateOnFocus={activateOnFocus}
    loopFocus={loopFocus}
    className={cn(
      'relative flex items-center',
      variant === 'segmented'
        ? 'p-1 rounded-[0.5rem] bg-surface-container border border-outline-variant w-max gap-1'
        : cn(
            'gap-2 border-outline-variant overflow-x-auto',
            'data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:border-b data-[orientation=horizontal]:w-full',
            'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:w-max data-[orientation=vertical]:items-stretch'
          ),
      className
    )}
  >
    {children}
    <BaseTabs.Indicator
      className={cn(
        'absolute transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        variant === 'segmented'
          ? 'bg-primary text-on-primary rounded-[0.375rem] shadow-xs data-[orientation=horizontal]:bottom-1 data-[orientation=horizontal]:top-1 data-[orientation=horizontal]:left-[var(--active-tab-left)] data-[orientation=horizontal]:w-[var(--active-tab-width)] data-[orientation=horizontal]:h-auto z-0'
          : cn(
              'bg-primary rounded-full z-10',
              'data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:left-[var(--active-tab-left)] data-[orientation=horizontal]:w-[var(--active-tab-width)] data-[orientation=horizontal]:h-[2.5px]',
              'data-[orientation=vertical]:right-0 data-[orientation=vertical]:top-[var(--active-tab-top)] data-[orientation=vertical]:h-[var(--active-tab-height)] data-[orientation=vertical]:w-[2.5px]'
            )
      )}
    />
  </BaseTabs.List>
);

export interface TabProps {
  value: string;
  children: React.ReactNode;
  icon?: string;
  disabled?: boolean;
  variant?: 'line' | 'segmented';
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ value, children, icon, disabled, variant = 'line', className }) => (
  <BaseTabs.Tab
    value={value}
    disabled={disabled}
    className={cn(
      'inline-flex items-center gap-2 font-label text-sm font-semibold transition-[color,background-color] duration-[var(--duration-quick)] ease-[var(--ease-standard)] relative cursor-pointer select-none',
      variant === 'segmented'
        ? 'py-2 px-3.5 min-h-[40px] rounded-[0.375rem] text-on-surface-variant hover:text-on-surface z-10 data-[selected]:text-on-primary data-[selected]:font-bold data-[selected]:bg-transparent'
        : 'py-3 px-4 min-h-[48px] rounded-[0.375rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40 data-[selected]:text-primary data-[selected]:font-bold data-[selected]:bg-transparent',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
  >
    {icon && (
      <span className="material-symbols-outlined text-lg" aria-hidden="true">
        {icon}
      </span>
    )}
    <span>{children}</span>
  </BaseTabs.Tab>
);

export interface TabsPanelProps {
  value: string;
  keepMounted?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({ value, keepMounted, children, className }) => (
  <BaseTabs.Panel
    value={value}
    keepMounted={keepMounted}
    className={cn('py-6 font-sans transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0', className)}
  >
    {children}
  </BaseTabs.Panel>
);

export interface TabsProps {
  items?: TabItemData[];
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  orientation?: 'horizontal' | 'vertical';
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  variant?: 'line' | 'segmented';
  /** When true, shrink-wraps the tabs container rather than stretching across full width */
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const TabsComponent: React.FC<TabsProps> = ({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation,
  activateOnFocus,
  loopFocus,
  variant = 'line',
  inline = false,
  children,
  className,
}) => {
  const initialValue = defaultValue ?? (value === undefined && items ? items[0]?.id : undefined);

  return (
    <BaseTabs.Root
      value={value}
      defaultValue={initialValue}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn(
        'flex',
        inline || variant === 'segmented' ? 'w-max items-start' : 'w-full',
        orientation === 'vertical' ? 'flex-row gap-6 items-start' : 'flex-col',
        className
      )}
    >
      {children
        ? children
        : (
          <>
            <TabsList activateOnFocus={activateOnFocus} loopFocus={loopFocus} variant={variant}>
              {items?.map((tab) => (
                <Tab key={tab.id} value={tab.id} icon={tab.icon} disabled={tab.disabled} variant={variant}>
                  {tab.label}
                </Tab>
              ))}
            </TabsList>
            {items?.map((tab) => (
              <TabsPanel key={tab.id} value={tab.id}>
                {tab.content}
              </TabsPanel>
            ))}
          </>
        )}
    </BaseTabs.Root>
  );
};

// Compound export mapping Base UI primitives & wrappers
export const Tabs = Object.assign(TabsComponent, {
  Root: BaseTabs.Root,
  List: BaseTabs.List,
  Tab: BaseTabs.Tab,
  Panel: BaseTabs.Panel,
  Indicator: BaseTabs.Indicator,
});

// Re-export Base UI primitives for compound composition
export { BaseTabs };
export const TabsRoot = BaseTabs.Root;
export const TabsListPrimitive = BaseTabs.List;
export const TabsTabPrimitive = BaseTabs.Tab;
export const TabsPanelPrimitive = BaseTabs.Panel;
export const TabsIndicator = BaseTabs.Indicator;


