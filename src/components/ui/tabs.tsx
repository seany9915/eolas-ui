/**
 * Tabs primitive (@base-ui/react/tabs).
 *
 * TAXONOMY & USAGE:
 * - Use Tabs for switching between mutually exclusive views/panels within the SAME page or context (role="tablist", role="tab", role="tabpanel").
 * - Do NOT use Tabs for site-wide navigation or URL page routing (use NavigationMenu or standard link anchors `<nav>` instead).
 * - Do NOT use Tabs for state/mode option toggles that don't switch separate DOM content panels (use ToggleGroup instead).
 * - Segmented container uses `rounded` (0.5rem / 8px) and segmented tabs use `rounded-sm` (0.25rem / 4px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).
 * - Line tabs use `rounded-t-sm` (0.25rem / 4px).
 */
import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

export interface TabItemData {
  id?: string;
  value?: string;
  label: string;
  icon?: string;
  content?: React.ReactNode;
  disabled?: boolean;
}

export type TabItem = TabItemData;

export type TabsVariant = 'line' | 'underline' | 'segmented' | 'segment' | 'pills' | 'pill' | 'unstyled' | string;

interface TabsContextValue {
  variant: TabsVariant;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = React.createContext<TabsContextValue>({ variant: 'line' });

export interface TabsRootProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Root> {
  variant?: TabsVariant;
}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  ({ variant = 'line', orientation = 'horizontal', children, className, ...props }, ref) => {
    return (
      <TabsContext.Provider value={{ variant, orientation }}>
        <BaseTabs.Root
          ref={ref}
          orientation={orientation}
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-row gap-6 items-start' : 'flex-col',
            className
          )}
          {...props}
        >
          {children}
        </BaseTabs.Root>
      </TabsContext.Provider>
    );
  }
);
TabsRoot.displayName = 'TabsRoot';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  variant?: TabsVariant;
  showIndicator?: boolean;
  className?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, activateOnFocus, loopFocus, variant, showIndicator = false, className, ...props }, ref) => {
    const parentContext = React.useContext(TabsContext);
    const effectiveVariant = variant ?? parentContext.variant ?? 'line';
    const isSegmented = effectiveVariant === 'segmented' || effectiveVariant === 'segment' || effectiveVariant === 'pills' || effectiveVariant === 'pill';

    return (
      <TabsContext.Provider value={{ variant: effectiveVariant, orientation: parentContext.orientation }}>
        <BaseTabs.List
          ref={ref}
          activateOnFocus={activateOnFocus}
          loopFocus={loopFocus}
          className={cn(
            'relative flex items-center',
            effectiveVariant === 'unstyled'
              ? ''
              : isSegmented
                ? 'p-1 rounded bg-surface-container border border-outline-variant w-max gap-1'
                : cn(
                    'gap-2 border-outline-variant overflow-x-auto overflow-y-hidden scrollbar-none',
                    'data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:border-b data-[orientation=horizontal]:w-full',
                    'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:w-max data-[orientation=vertical]:items-stretch'
                  ),
            className
          )}
          {...props}
        >
          {children}
          {showIndicator && !isSegmented && effectiveVariant !== 'unstyled' && (
            <BaseTabs.Indicator
              className={cn(
                'absolute bg-primary rounded-none z-10 transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                'data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:h-[2.5px]',
                'data-[orientation=vertical]:right-0 data-[orientation=vertical]:w-[2.5px]'
              )}
            />
          )}
        </BaseTabs.List>
      </TabsContext.Provider>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>, 'children'> {
  value: string;
  children: React.ReactNode;
  icon?: string;
  disabled?: boolean;
  variant?: TabsVariant;
  className?: string;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, children, icon, disabled, variant, className, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const effectiveVariant = variant ?? context.variant ?? 'line';
    const isSegmented = effectiveVariant === 'segmented' || effectiveVariant === 'segment' || effectiveVariant === 'pills' || effectiveVariant === 'pill';

    return (
      <BaseTabs.Tab
        ref={ref}
        value={value}
        disabled={disabled}
        render={(renderProps, state) => (
          <button
            {...renderProps}
            data-state={state.active ? 'active' : 'inactive'}
            data-selected={state.active ? '' : undefined}
          />
        )}
        className={cn(
          'inline-flex items-center gap-2 font-label text-sm font-semibold transition-all duration-[var(--duration-quick)] ease-[var(--ease-standard)] relative cursor-pointer select-none',
          isSegmented
            ? cn(
                'py-2 px-3.5 min-h-[40px] rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 z-10',
                'data-[active]:bg-primary data-[active]:text-on-primary data-[active]:shadow-xs data-[active]:font-bold',
                'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:shadow-xs data-[selected]:font-bold',
                'data-[state=active]:bg-primary data-[state=active]:text-on-primary data-[state=active]:shadow-xs data-[state=active]:font-bold',
                'aria-selected:bg-primary aria-selected:text-on-primary aria-selected:shadow-xs aria-selected:font-bold'
              )
            : cn(
                'py-3 px-4 min-h-[48px] rounded-t-sm rounded-b-none text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40 border-b-[2.5px] border-transparent',
                'data-[active]:text-primary data-[active]:font-bold data-[active]:border-primary -mb-px',
                'data-[selected]:text-primary data-[selected]:font-bold data-[selected]:border-primary',
                'data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-primary',
                'aria-selected:text-primary aria-selected:font-bold aria-selected:border-primary'
              ),
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary focus-visible:z-10',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </BaseTabs.Tab>
    );
  }
);
Tab.displayName = 'Tab';

export interface TabsPanelProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Panel> {
  value: string;
  keepMounted?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, keepMounted, children, className, ...props }, ref) => (
    <BaseTabs.Panel
      ref={ref}
      value={value}
      keepMounted={keepMounted}
      className={cn(
        'py-6 font-sans transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
        className
      )}
      {...props}
    >
      {children}
    </BaseTabs.Panel>
  )
);
TabsPanel.displayName = 'TabsPanel';

export interface TabsProps {
  items?: TabItemData[];
  /** Legacy alias for items */
  tabs?: TabItemData[];
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  orientation?: 'horizontal' | 'vertical';
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  variant?: TabsVariant;
  /** When true, shrink-wraps the tabs container rather than stretching across full width */
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const TabsComponent = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      tabs,
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      activateOnFocus,
      loopFocus,
      variant = 'line',
      inline = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const tabList = items || tabs;
    const initialValue = defaultValue ?? (value === undefined && tabList ? (tabList[0]?.value ?? tabList[0]?.id) : undefined);
    const hasContent = Boolean(tabList?.some((t) => t.content !== undefined));
    const isSegmented = variant === 'segmented' || variant === 'segment' || variant === 'pills' || variant === 'pill';

    return (
      <TabsRoot
        ref={ref}
        value={value}
        defaultValue={initialValue}
        onValueChange={onValueChange}
        orientation={orientation}
        variant={variant}
        className={cn(
          inline || isSegmented ? 'w-max items-start' : 'w-full',
          className
        )}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            <TabsList activateOnFocus={activateOnFocus} loopFocus={loopFocus} variant={variant}>
              {tabList?.map((tab) => {
                const tabKey = (tab.value ?? tab.id) as string;
                return (
                  <Tab key={tabKey} value={tabKey} icon={tab.icon} disabled={tab.disabled} variant={variant}>
                    {tab.label}
                  </Tab>
                );
              })}
            </TabsList>
            {hasContent &&
              tabList?.map((tab) => {
                const tabKey = (tab.value ?? tab.id) as string;
                if (!tab.content) return null;
                return (
                  <TabsPanel key={tabKey} value={tabKey}>
                    {tab.content}
                  </TabsPanel>
                );
              })}
          </>
        )}
      </TabsRoot>
    );
  }
);
TabsComponent.displayName = 'Tabs';

// Compound export mapping Base UI primitives & wrappers
export const Tabs = Object.assign(TabsComponent, {
  Root: TabsRoot,
  List: TabsList,
  Tab: Tab,
  Trigger: Tab,
  Panel: TabsPanel,
  Content: TabsPanel,
  Indicator: BaseTabs.Indicator,
});

// Re-export Base UI primitives for compound composition
export { BaseTabs };
export const TabsListPrimitive = BaseTabs.List;
export const TabsTabPrimitive = BaseTabs.Tab;
export const TabsTriggerPrimitive = BaseTabs.Tab;
export const TabsPanelPrimitive = BaseTabs.Panel;
export const TabsIndicator = BaseTabs.Indicator;

// Backward-compatible named exports matching radix/shadcn conventions
export const TabsTrigger = Tab;
export const TabsContent = TabsPanel;
export default Tabs;
