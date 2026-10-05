/**
 * Tabs primitive (@base-ui/react/tabs).
 *
 * Base UI Documentation: https://base-ui.com/react/components/tabs
 *
 * TAXONOMY & USAGE:
 * - Use Tabs for switching between mutually exclusive views/panels within the SAME page or context (role="tablist", role="tab", role="tabpanel").
 * - Do NOT use Tabs for site-wide navigation or URL page routing (use NavigationMenu or standard link anchors `<nav>` instead).
 * - Do NOT use Tabs for state/mode option toggles that don't switch separate DOM content panels (use ToggleGroup instead).
 * - Segmented container uses `rounded` (0.5rem / 8px) and segmented tabs use `rounded-sm` (0.25rem / 4px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).
 * - Line tabs use `rounded-t-sm` (0.25rem / 4px) with bottom underline or floating active indicator.
 * - Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive tabs.
 */
import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

export type TabValue = string | number | null;

export interface TabItemData<Value extends TabValue = string> {
  id?: string;
  value?: Value;
  label: React.ReactNode;
  icon?: string;
  content?: React.ReactNode;
  disabled?: boolean;
}

export type TabItem<Value extends TabValue = string> = TabItemData<Value>;

export type TabsVariant = 'line' | 'underline' | 'segmented' | 'segment' | 'pills' | 'pill' | 'unstyled';
export type TabsSize = 'sm' | 'md' | 'lg';

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
  orientation: 'horizontal' | 'vertical';
  showIndicator: boolean;
}

const TabsContext = React.createContext<TabsContextValue>({
  variant: 'line',
  size: 'md',
  orientation: 'horizontal',
  showIndicator: true,
});

export interface TabsRootProps<Value extends TabValue = TabValue>
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Root>, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value, eventDetails: BaseTabs.Root.ChangeEventDetails) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: TabsVariant;
  size?: TabsSize;
  showIndicator?: boolean;
}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps<any>>(
  (
    {
      variant = 'line',
      size = 'md',
      orientation = 'horizontal',
      showIndicator = true,
      children,
      className,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    return (
      <TabsContext.Provider value={{ variant, size, orientation, showIndicator }}>
        <BaseTabs.Root
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
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

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.List> {
  variant?: TabsVariant;
  size?: TabsSize;
  showIndicator?: boolean;
  indicatorClassName?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    {
      children,
      activateOnFocus = false,
      loopFocus = true,
      variant,
      size,
      showIndicator,
      indicatorClassName,
      className,
      ...props
    },
    ref
  ) => {
    const parentContext = React.useContext(TabsContext);
    const effectiveVariant = variant ?? parentContext.variant ?? 'line';
    const effectiveSize = size ?? parentContext.size ?? 'md';
    const effectiveShowIndicator = showIndicator ?? parentContext.showIndicator ?? true;
    const isSegmented =
      effectiveVariant === 'segmented' ||
      effectiveVariant === 'segment' ||
      effectiveVariant === 'pills' ||
      effectiveVariant === 'pill';

    return (
      <TabsContext.Provider
        value={{
          variant: effectiveVariant,
          size: effectiveSize,
          orientation: parentContext.orientation,
          showIndicator: effectiveShowIndicator,
        }}
      >
        <BaseTabs.List
          ref={ref}
          activateOnFocus={activateOnFocus}
          loopFocus={loopFocus}
          className={cn(
            'relative flex items-center',
            effectiveVariant === 'unstyled'
              ? ''
              : isSegmented
                ? 'p-1 rounded bg-surface-container border border-outline-variant w-max gap-1 select-none'
                : cn(
                    'gap-1 border-outline-variant overflow-x-auto overflow-y-hidden scrollbar-none select-none',
                    'data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:border-b data-[orientation=horizontal]:w-full',
                    'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:w-max data-[orientation=vertical]:items-stretch'
                  ),
            className
          )}
          {...props}
        >
          {children}
          {effectiveShowIndicator && effectiveVariant !== 'unstyled' && (
            isSegmented ? (
              <BaseTabs.Indicator
                className={cn(
                  'absolute rounded-sm bg-primary z-0 pointer-events-none transition-[left,width,top,height] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                  'data-[orientation=horizontal]:left-[var(--active-tab-left)] data-[orientation=horizontal]:w-[var(--active-tab-width)] data-[orientation=horizontal]:inset-y-1',
                  'data-[orientation=vertical]:top-[var(--active-tab-top)] data-[orientation=vertical]:h-[var(--active-tab-height)] data-[orientation=vertical]:inset-x-1',
                  indicatorClassName
                )}
              />
            ) : (
              <BaseTabs.Indicator
                className={cn(
                  'absolute bg-primary rounded-none z-10 pointer-events-none transition-[left,width,top,height] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
                  'data-[orientation=horizontal]:left-[var(--active-tab-left)] data-[orientation=horizontal]:w-[var(--active-tab-width)] data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:h-[2.5px]',
                  'data-[orientation=vertical]:top-[var(--active-tab-top)] data-[orientation=vertical]:h-[var(--active-tab-height)] data-[orientation=vertical]:right-0 data-[orientation=vertical]:w-[2.5px]',
                  indicatorClassName
                )}
              />
            )
          )}
        </BaseTabs.List>
      </TabsContext.Provider>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Tab> {
  icon?: string;
  variant?: TabsVariant;
  size?: TabsSize;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, children, icon, disabled, variant, size, className, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const effectiveVariant = variant ?? context.variant ?? 'line';
    const effectiveSize = size ?? context.size ?? 'md';
    const isSegmented =
      effectiveVariant === 'segmented' ||
      effectiveVariant === 'segment' ||
      effectiveVariant === 'pills' ||
      effectiveVariant === 'pill';
    const hasSlidingIndicator = context.showIndicator;

    // Size height tokens (enforcing min 44px hit-target for standard accessibility)
    const sizeClasses = {
      sm: isSegmented ? 'py-1.5 px-3 min-h-[38px] text-xs' : 'py-2 px-3.5 min-h-[44px] text-xs',
      md: isSegmented ? 'py-2 px-3.5 min-h-[44px] text-sm' : 'py-2.5 px-4 min-h-[44px] text-sm',
      lg: isSegmented ? 'py-2.5 px-4.5 min-h-[48px] text-base' : 'py-3.5 px-5 min-h-[48px] text-base',
    }[effectiveSize];

    return (
      <BaseTabs.Tab
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          // Retain font-semibold across both active and inactive to prevent layout shift
          'inline-flex items-center justify-center gap-2 font-label font-semibold transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-standard)] relative cursor-pointer select-none',
          sizeClasses,
          effectiveVariant === 'unstyled'
            ? ''
            : isSegmented
              ? cn(
                  'rounded-sm text-on-surface-variant hover:text-on-surface z-10',
                  hasSlidingIndicator
                    ? cn(
                        'bg-transparent',
                        'data-[active]:text-on-primary',
                        'data-[selected]:text-on-primary',
                        'aria-selected:text-on-primary'
                      )
                    : cn(
                        'hover:bg-surface-variant/30',
                        'data-[active]:bg-primary data-[active]:text-on-primary data-[active]:shadow-ambient',
                        'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:shadow-ambient',
                        'aria-selected:bg-primary aria-selected:text-on-primary aria-selected:shadow-ambient'
                      )
                )
              : cn(
                  'rounded-t-sm rounded-b-none text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 border-b-[2.5px] border-transparent',
                  hasSlidingIndicator
                    ? cn(
                        'data-[active]:text-primary',
                        'data-[selected]:text-primary',
                        'aria-selected:text-primary'
                      )
                    : cn(
                        'data-[active]:text-primary data-[active]:border-primary -mb-px',
                        'data-[selected]:text-primary data-[selected]:border-primary',
                        'aria-selected:text-primary aria-selected:border-primary'
                      )
                ),
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-20',
          'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="material-symbols-outlined text-lg shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </BaseTabs.Tab>
    );
  }
);
Tab.displayName = 'Tab';

export interface TabsPanelProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Panel> {}

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, keepMounted = false, children, className, ...props }, ref) => (
    <BaseTabs.Panel
      ref={ref}
      value={value}
      keepMounted={keepMounted}
      className={cn(
        'py-4 font-sans outline-none transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </BaseTabs.Panel>
  )
);
TabsPanel.displayName = 'TabsPanel';

export interface TabsProps<Value extends TabValue = string> {
  items?: TabItemData<Value>[];
  /** Legacy alias for items */
  tabs?: TabItemData<Value>[];
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value, eventDetails: BaseTabs.Root.ChangeEventDetails) => void;
  orientation?: 'horizontal' | 'vertical';
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  variant?: TabsVariant;
  size?: TabsSize;
  showIndicator?: boolean;
  indicatorClassName?: string;
  /** When true, shrink-wraps the tabs container rather than stretching across full width */
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}

const TabsComponent = React.forwardRef<HTMLDivElement, TabsProps<any>>(
  (
    {
      items,
      tabs,
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      activateOnFocus = false,
      loopFocus = true,
      variant = 'line',
      size = 'md',
      showIndicator = true,
      indicatorClassName,
      inline = false,
      children,
      className,
      listClassName,
      panelClassName,
      ...props
    },
    ref
  ) => {
    const tabList = items || tabs;
    const initialValue =
      defaultValue ??
      (value === undefined && tabList && tabList.length > 0
        ? (tabList[0]?.value ?? tabList[0]?.id)
        : undefined);
    const hasContent = Boolean(tabList?.some((t) => t.content !== undefined));
    const isSegmented =
      variant === 'segmented' ||
      variant === 'segment' ||
      variant === 'pills' ||
      variant === 'pill';

    return (
      <TabsRoot
        ref={ref}
        value={value}
        defaultValue={initialValue}
        onValueChange={onValueChange}
        orientation={orientation}
        variant={variant}
        size={size}
        showIndicator={showIndicator}
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
            <TabsList
              activateOnFocus={activateOnFocus}
              loopFocus={loopFocus}
              variant={variant}
              size={size}
              showIndicator={showIndicator}
              indicatorClassName={indicatorClassName}
              className={listClassName}
            >
              {tabList?.map((tab) => {
                const tabKey = (tab.value ?? tab.id) as string;
                return (
                  <Tab
                    key={tabKey}
                    value={tabKey}
                    icon={tab.icon}
                    disabled={tab.disabled}
                    variant={variant}
                    size={size}
                  >
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
                  <TabsPanel key={tabKey} value={tabKey} className={panelClassName}>
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
