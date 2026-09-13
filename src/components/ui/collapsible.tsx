import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  className?: string;
}

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
      className={cn('w-full rounded-[0.75rem] bg-surface border border-outline-variant p-4 space-y-2', className)}
    >
      <BaseCollapsible.Trigger className="flex items-center justify-between w-full min-h-[44px] font-heading text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md">
        <span>{title}</span>
        <span className="material-symbols-outlined text-xl text-on-surface-variant group-data-[panel-open]:rotate-180 transition-transform duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)]" aria-hidden="true">
          keyboard_arrow_down
        </span>
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        hiddenUntilFound={hiddenUntilFound}
        keepMounted={keepMounted}
        className="font-sans text-xs text-on-surface-variant leading-relaxed pt-2 border-t border-outline-variant/40 overflow-hidden h-[var(--collapsible-panel-height)] transition-[height,opacity] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] ease-[var(--ease-standard)] data-[starting-style]:h-0 data-[ending-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
      >
        {children}
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
};

// Compound export mapping Base UI primitives
export const Collapsible = Object.assign(CollapsibleComponent, {
  Root: BaseCollapsible.Root,
  Trigger: BaseCollapsible.Trigger,
  Panel: BaseCollapsible.Panel,
});

// Re-export Base UI primitives for compound composition
export { BaseCollapsible };
export const CollapsibleRoot = BaseCollapsible.Root;
export const CollapsibleTrigger = BaseCollapsible.Trigger;
export const CollapsiblePanel = BaseCollapsible.Panel;

