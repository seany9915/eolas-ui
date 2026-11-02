/**
 * Collapsible primitive (@base-ui/react/collapsible).
 *
 * Base UI Documentation: https://base-ui.com/react/components/collapsible
 *
 * TAXONOMY & USAGE:
 * - Use Collapsible for an interactive disclosure element that shows or hides a single panel.
 * - Supports browser in-page search (hiddenUntilFound / hidden="until-found").
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring,
 *   WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint.
 */
import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';

interface CollapsibleContextValue {
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({});
export const useCollapsibleContext = () => React.useContext(CollapsibleContext);

export interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root> {
  title?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: BaseCollapsible.Root.ChangeEventDetails) => void;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  variant?: 'card' | 'unstyled';
  className?: string;
}

export interface CollapsiblePanelProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  unstyled?: boolean;
}

export const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  ({ children, className, contentClassName, unstyled = false, hiddenUntilFound, keepMounted, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    const resolvedHiddenUntilFound = hiddenUntilFound ?? context.hiddenUntilFound;
    const resolvedKeepMounted = keepMounted ?? context.keepMounted;

    return (
      <BaseCollapsible.Panel
        ref={ref}
        hiddenUntilFound={resolvedHiddenUntilFound}
        keepMounted={resolvedKeepMounted}
        className={cn(
          "overflow-hidden h-[var(--collapsible-panel-height)] transition-[height] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            unstyled
              ? ''
              : 'pt-3 border-t border-outline-variant/40 font-sans text-sm text-on-surface-variant leading-relaxed',
            contentClassName
          )}
        >
          {children}
        </div>
      </BaseCollapsible.Panel>
    );
  }
);
CollapsiblePanel.displayName = 'CollapsiblePanel';

export const CollapsibleContent = CollapsiblePanel;
export type CollapsibleContentProps = CollapsiblePanelProps;

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  children: React.ReactNode;
  className?: string;
  hideChevron?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, className, hideChevron = false, ...props }, ref) => (
    <BaseCollapsible.Trigger
      ref={ref}
      className={cn(
        'flex items-center justify-between w-full min-h-[44px] font-heading text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group rounded-md',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {!hideChevron && (
        <span
          className="material-symbols-outlined text-xl text-on-surface-variant group-data-[panel-open]:rotate-180 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none select-none shrink-0"
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      )}
    </BaseCollapsible.Trigger>
  )
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleComponent = React.forwardRef<HTMLDivElement, CollapsibleProps>(({
  title,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled,
  hiddenUntilFound,
  keepMounted,
  variant,
  className,
  ...props
}, ref) => {
  const isCard = variant === 'card' || (variant === undefined && Boolean(title));

  return (
    <CollapsibleContext.Provider value={{ hiddenUntilFound, keepMounted }}>
      <BaseCollapsible.Root
        ref={ref}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        disabled={disabled}
        className={cn(
          'w-full',
          isCard && 'rounded-xl bg-surface border border-outline-variant p-4 shadow-ambient',
          className
        )}
        {...props}
      >
        {title ? (
          <>
            <CollapsibleTrigger>
              <span>{title}</span>
            </CollapsibleTrigger>
            <CollapsiblePanel>
              {children}
            </CollapsiblePanel>
          </>
        ) : (
          children
        )}
      </BaseCollapsible.Root>
    </CollapsibleContext.Provider>
  );
});
CollapsibleComponent.displayName = 'Collapsible';

// Compound export mapping Base UI primitives
export const Collapsible = Object.assign(CollapsibleComponent, {
  Root: CollapsibleComponent,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  Content: CollapsibleContent,
});

// Re-export Base UI primitives for compound composition
export { BaseCollapsible };
export const CollapsibleRoot = CollapsibleComponent;
export const CollapsiblePrimitive = BaseCollapsible.Root;
export const CollapsibleTriggerPrimitive = BaseCollapsible.Trigger;
export const CollapsiblePanelPrimitive = BaseCollapsible.Panel;
export default Collapsible;
