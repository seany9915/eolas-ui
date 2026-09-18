import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';

export interface CollapsibleProps {
  title?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  className?: string;
}

export interface CollapsiblePanelProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> {
  children?: React.ReactNode;
  className?: string;
}

export const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  ({ children, className, ...props }, ref) => (
    <BaseCollapsible.Panel
      ref={ref}
      className="flex flex-col justify-end overflow-hidden h-[var(--collapsible-panel-height)] transition-[height] duration-150 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
      {...props}
    >
      <div className={cn('pt-3 border-t border-outline-variant/40 font-sans text-xs text-on-surface-variant leading-relaxed', className)}>
        {children}
      </div>
    </BaseCollapsible.Panel>
  )
);
CollapsiblePanel.displayName = 'CollapsiblePanel';

export const CollapsibleContent = CollapsiblePanel;
export type CollapsibleContentProps = CollapsiblePanelProps;

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <BaseCollapsible.Trigger
      ref={ref}
      className={cn(
        'flex items-center justify-between w-full min-h-[44px] font-heading text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md',
        className
      )}
      {...props}
    >
      {children}
      <span className="material-symbols-outlined text-xl text-on-surface-variant group-data-[panel-open]:rotate-180 group-data-[state=open]:rotate-180 transition-transform duration-150 ease-out" aria-hidden="true">
        keyboard_arrow_down
      </span>
    </BaseCollapsible.Trigger>
  )
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleComponent: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled,
  hiddenUntilFound,
  keepMounted,
  className,
}) => {
  return (
    <BaseCollapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      disabled={disabled}
      className={cn('w-full rounded-[0.75rem] bg-surface border border-outline-variant p-4', className)}
    >
      {title ? (
        <>
          <CollapsibleTrigger>
            <span>{title}</span>
          </CollapsibleTrigger>
          <CollapsiblePanel
            hiddenUntilFound={hiddenUntilFound}
            keepMounted={keepMounted}
          >
            {children}
          </CollapsiblePanel>
        </>
      ) : (
        children
      )}
    </BaseCollapsible.Root>
  );
};

// Compound export mapping Base UI primitives
export const Collapsible = Object.assign(CollapsibleComponent, {
  Root: BaseCollapsible.Root,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  Content: CollapsibleContent,
});

// Re-export Base UI primitives for compound composition
export { BaseCollapsible };
export const CollapsibleRoot = BaseCollapsible.Root;
export const CollapsibleTriggerPrimitive = BaseCollapsible.Trigger;
export const CollapsiblePanelPrimitive = BaseCollapsible.Panel;
export default Collapsible;
