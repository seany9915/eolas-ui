/**
 * Trace primitive suite.
 *
 * Base UI Integration: Consumes `@base-ui/react/collapsible` for headless accessible disclosures.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/components/base/trace
 * - https://ui.shadcn.com/docs/ai-elements
 *
 * TAXONOMY & USAGE:
 * - Universal primitive for AI agent execution lifecycle: step-by-step reasoning,
 *   tool calls, multi-stage task plans, error stack traces, and agent activity logs.
 * - Replaces monolithic steppers with a flexible, composable compound architecture.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.
 * - Strictly follows DESIGN.md tokens: floating 2px focus ring (outline-offset: 2px),
 *   concentric radius, and semantic high-contrast colors without monochrome triple-tints.
 */
import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Icon } from './icon';
import { Button } from './button';
import { cn } from '@/lib/utils';

export type TraceStatus = 'default' | 'running' | 'error' | 'complete' | 'pending';

/* -------------------------------------------------------------------------------------------------
 * Trace (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'embedded' | 'timeline';
  children?: React.ReactNode;
  className?: string;
}

export const TraceRoot = React.forwardRef<HTMLDivElement, TraceRootProps>(
  ({ variant = 'default', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        data-slot="trace"
        aria-label="Agent execution trace"
        className={cn(
          '@container w-full transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          variant === 'default' &&
            'rounded-lg border border-outline-variant bg-surface overflow-hidden divide-y divide-outline-variant/40',
          variant === 'card' &&
            'rounded-xl bg-surface overflow-hidden shadow-ambient divide-y divide-outline-variant/40',
          variant === 'embedded' &&
            'rounded-lg border border-outline-variant/60 bg-surface-container/30 overflow-hidden divide-y divide-outline-variant/30',
          variant === 'timeline' &&
            'relative flex flex-col space-y-2.5 pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TraceRoot.displayName = 'Trace.Root';

/* -------------------------------------------------------------------------------------------------
 * TraceLine (Single execution line)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceLineProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TraceStatus;
  children?: React.ReactNode;
  className?: string;
}

export const TraceLine = React.forwardRef<HTMLDivElement, TraceLineProps>(
  ({ status = 'default', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="trace-line"
        data-status={status}
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] text-xs font-sans text-on-surface transition-colors w-full',
          '[[data-slot=trace-collapsible-trigger]_&]:px-0 [[data-slot=trace-collapsible-trigger]_&]:py-0 [[data-slot=trace-collapsible-trigger]_&]:min-h-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TraceLine.displayName = 'Trace.Line';

/* -------------------------------------------------------------------------------------------------
 * TraceIcon
 * -----------------------------------------------------------------------------------------------*/
export interface TraceIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  status?: TraceStatus;
  children?: React.ReactNode;
  className?: string;
}

export const TraceIcon: React.FC<TraceIconProps> = ({
  name,
  status = 'default',
  children,
  className,
  ...props
}) => {
  return (
    <span
      data-slot="trace-icon"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors select-none',
        status === 'complete' && 'bg-primary-container text-on-primary-container font-bold',
        status === 'running' && 'bg-secondary-container text-on-secondary-container',
        status === 'error' && 'bg-error-container text-on-error-container font-bold',
        status === 'pending' && 'bg-surface-variant/50 text-on-surface-variant border border-outline',
        status === 'default' && 'bg-surface-container text-on-surface-variant',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children ? (
        children
      ) : status === 'running' ? (
        <Icon name="progress_activity" size="xs" className="animate-spin text-xs" />
      ) : status === 'complete' ? (
        <Icon name="check" size="xs" className="text-xs" />
      ) : status === 'error' ? (
        <Icon name="error" size="xs" className="text-xs" />
      ) : name ? (
        <Icon name={name} size="xs" className="text-xs" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" />
      )}
    </span>
  );
};
TraceIcon.displayName = 'Trace.Icon';

/* -------------------------------------------------------------------------------------------------
 * TraceTitle
 * -----------------------------------------------------------------------------------------------*/
export interface TraceTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const TraceTitle = React.forwardRef<HTMLSpanElement, TraceTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="trace-title"
        className={cn('font-sans text-xs font-semibold text-on-surface truncate leading-tight', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TraceTitle.displayName = 'Trace.Title';

/* -------------------------------------------------------------------------------------------------
 * TraceDescription
 * -----------------------------------------------------------------------------------------------*/
export interface TraceDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const TraceDescription = React.forwardRef<HTMLSpanElement, TraceDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="trace-description"
        className={cn(
          'ml-auto font-sans text-xs text-on-surface-variant flex items-center gap-1.5 shrink-0 leading-tight',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TraceDescription.displayName = 'Trace.Description';

/* -------------------------------------------------------------------------------------------------
 * TraceCollapsible & Trigger & Content (Base UI headless primitives)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceCollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TraceCollapsible: React.FC<TraceCollapsibleProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  children,
  className,
}) => {
  return (
    <BaseCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      data-slot="trace-collapsible"
      className={cn('group/trace-item w-full', className)}
    >
      {children}
    </BaseCollapsible.Root>
  );
};
TraceCollapsible.displayName = 'Trace.Collapsible';

export interface TraceCollapsibleTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  children: React.ReactNode;
  className?: string;
  hideChevron?: boolean;
}

export const TraceCollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  TraceCollapsibleTriggerProps
>(({ children, className, hideChevron = false, ...props }, ref) => {
  return (
    <BaseCollapsible.Trigger
      ref={ref}
      data-slot="trace-collapsible-trigger"
      className={cn(
        'group flex items-center justify-between w-full min-h-[44px] px-3.5 py-2.5 cursor-pointer text-left',
        'hover:bg-surface-container/40 transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2.5">{children}</div>
      {!hideChevron && (
        <span
          className="pl-2 text-on-surface-variant shrink-0 group-data-[panel-open]:rotate-180 transition-transform duration-quick ease-standard motion-reduce:transition-none"
          aria-hidden="true"
        >
          <Icon name="expand_more" size="xs" />
        </span>
      )}
    </BaseCollapsible.Trigger>
  );
});
TraceCollapsibleTrigger.displayName = 'Trace.CollapsibleTrigger';

export interface TraceCollapsibleContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> {
  children?: React.ReactNode;
  className?: string;
  unstyled?: boolean;
}

export const TraceCollapsibleContent = React.forwardRef<
  HTMLDivElement,
  TraceCollapsibleContentProps
>(({ children, className, unstyled = false, ...props }, ref) => {
  return (
    <BaseCollapsible.Panel
      ref={ref}
      data-slot="trace-collapsible-content"
      className="overflow-hidden h-[var(--collapsible-panel-height)] transition-[height] duration-quick ease-standard motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
      {...props}
    >
      <div
        className={cn(
          unstyled
            ? ''
            : 'px-4 py-3 border-t border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed',
          className
        )}
      >
        {children}
      </div>
    </BaseCollapsible.Panel>
  );
});
TraceCollapsibleContent.displayName = 'Trace.CollapsibleContent';

/* -------------------------------------------------------------------------------------------------
 * TraceActions & Action
 * -----------------------------------------------------------------------------------------------*/
export interface TraceActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const TraceActions = React.forwardRef<HTMLDivElement, TraceActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="trace-actions"
        className={cn('flex items-center gap-1.5 shrink-0 pl-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TraceActions.displayName = 'Trace.Actions';

export interface TraceActionProps {
  label: string;
  icon?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const TraceAction: React.FC<TraceActionProps> = ({
  label,
  icon,
  onClick,
  disabled,
  className,
}) => {
  return (
    <Button
      type="button"
      data-slot="trace-action"
      variant="ghost"
      colorRole="neutral"
      size="sm"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      expandedTouchTarget
      aria-label={label}
      className={cn('size-7 min-h-[28px] min-w-[28px] p-0 text-on-surface-variant hover:text-on-surface', className)}
    >
      {icon && <Icon name={icon} size="xs" aria-hidden="true" />}
    </Button>
  );
};
TraceAction.displayName = 'Trace.Action';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Trace = Object.assign(TraceRoot, {
  Line: TraceLine,
  Icon: TraceIcon,
  Title: TraceTitle,
  Description: TraceDescription,
  Collapsible: TraceCollapsible,
  CollapsibleTrigger: TraceCollapsibleTrigger,
  CollapsibleContent: TraceCollapsibleContent,
  Actions: TraceActions,
  Action: TraceAction,
});

export default Trace;
