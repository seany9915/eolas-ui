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
 *   concentric radius (rounded-2xl containers), and semantic high-contrast colors without monochrome triple-tints.
 */
import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { Icon } from './icon';
import { Button } from './button';
import { ShimmerText } from './shimmer-text';
import { useChatMessageContext } from './chat-message-context';
import { cn } from '@/lib/utils';

export type TraceStatus =
  | 'default'
  | 'running'
  | 'error'
  | 'complete'
  | 'completed'
  | 'success'
  | 'pending'
  | 'warning'
  | 'cancelled';

/* -------------------------------------------------------------------------------------------------
 * Contexts
 * -----------------------------------------------------------------------------------------------*/
interface TraceContextValue {
  isNested: boolean;
  variant?: 'default' | 'card' | 'embedded' | 'timeline' | 'ghost' | 'unboxed';
}

const TraceContext = React.createContext<TraceContextValue>({
  isNested: false,
});

export const useTraceContext = () => React.useContext(TraceContext);

interface TraceLineContextValue {
  status: TraceStatus;
}

const TraceLineContext = React.createContext<TraceLineContextValue>({
  status: 'default',
});

export const useTraceLineContext = () => React.useContext(TraceLineContext);

/* -------------------------------------------------------------------------------------------------
 * Trace (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual presentation variant of the trace container.
   * - `default`: Standard contained surface with 1px outline-variant border.
   * - `embedded`: Subtle surface-container wash for grouped field contexts.
   * - `timeline`: Vertical connected-rail timeline layout.
   * - `ghost`: Transparent unboxed container for chat message turns and nested traces.
   * @deprecated Use `variant="ghost"` instead of `unboxed`.
   */
  variant?: 'default' | 'card' | 'embedded' | 'timeline' | 'ghost' | 'unboxed';
  children?: React.ReactNode;
  className?: string;
}

export const TraceRoot = React.forwardRef<HTMLDivElement, TraceRootProps>(
  ({ variant, children, className, role, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const parentTrace = useTraceContext();
    const isNested = parentTrace.isNested;

    // If explicitly provided, respect it; if inside another trace or collapsible content, default to 'ghost';
    // if inside chat message, default to 'ghost'; otherwise default to 'default'.
    const resolvedVariant =
      variant ??
      (isNested
        ? 'ghost'
        : chatContext?.inMessage
        ? 'ghost'
        : 'default');

    // Only emit landmark region and label when explicitly requested or at top-level with an explicit role;
    // avoids landmark bloat and orphaned aria-label on generic containers.
    const computedRole = isNested ? undefined : role;
    const accessibleLabel =
      !isNested && computedRole
        ? props['aria-label'] ?? (props['aria-labelledby'] ? undefined : 'Execution trace')
        : undefined;

    return (
      <TraceContext.Provider value={{ isNested: true, variant: resolvedVariant }}>
        <div
          ref={ref}
          role={computedRole}
          data-slot="trace"
          aria-label={accessibleLabel}
          className={cn(
            '@container w-full transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
            (resolvedVariant === 'default' || resolvedVariant === 'card') &&
              'rounded-2xl border border-outline-variant bg-surface overflow-hidden divide-y divide-outline-variant/40 shadow-sm',
            resolvedVariant === 'embedded' &&
              'rounded-2xl border border-outline-variant/60 bg-surface-container/30 overflow-hidden divide-y divide-outline-variant/30',
            (resolvedVariant === 'ghost' || resolvedVariant === 'unboxed') &&
              'rounded-none border-none bg-transparent divide-y divide-outline-variant/30',
            resolvedVariant === 'timeline' &&
              'relative flex flex-col gap-2.5 pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TraceContext.Provider>
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
      <TraceLineContext.Provider value={{ status }}>
        <div
          ref={ref}
          data-slot="trace-line"
          data-status={status}
          className={cn(
            'flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] text-xs font-sans text-on-surface transition-colors w-full',
            '[[data-slot=trace-collapsible-trigger]_&]:px-0 [[data-slot=trace-collapsible-trigger]_&]:py-0 [[data-slot=trace-collapsible-trigger]_&]:min-h-0',
            status === 'pending' && 'opacity-70 text-on-surface-variant',
            status === 'error' && 'text-error',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TraceLineContext.Provider>
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
  stepNumber?: number | string;
  variant?: 'ghost' | 'badge';
  children?: React.ReactNode;
  className?: string;
}

export const TraceIcon = React.forwardRef<HTMLSpanElement, TraceIconProps>(
  (
    {
      name,
      status: explicitStatus,
      stepNumber,
      variant,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const lineCtx = useTraceLineContext();
    const rawStatus = explicitStatus ?? lineCtx.status ?? 'default';
    const isComplete =
      rawStatus === 'complete' ||
      rawStatus === 'completed' ||
      rawStatus === 'success';
    const resolvedStatus = isComplete ? 'complete' : rawStatus;

    // If stepNumber is provided or caller explicitly requested badge, use the circular container;
    // otherwise default to sleek unboxed 'ghost' glyph
    const resolvedVariant = variant ?? (stepNumber !== undefined ? 'badge' : 'ghost');
    const isBadge = resolvedVariant === 'badge';

    return (
      <span
        ref={ref}
        data-slot="trace-icon"
        data-variant={resolvedVariant}
        data-status={resolvedStatus}
        className={cn(
          'shrink-0 items-center justify-center select-none transition-colors inline-flex leading-none [&_.material-symbols-outlined]:text-[16px] [&_.material-symbols-outlined]:leading-none [&>svg]:size-4 [&>svg]:shrink-0',
          isBadge
            ? cn(
                'size-6 rounded-full text-xs font-medium',
                stepNumber !== undefined &&
                  'border border-outline-variant/60 bg-surface-container text-on-surface font-mono text-xs font-semibold leading-none',
                stepNumber === undefined && isComplete && 'bg-success-container text-on-success-container font-bold',
                stepNumber === undefined && resolvedStatus === 'running' && 'bg-surface-container text-on-surface-variant',
                stepNumber === undefined && resolvedStatus === 'warning' && 'bg-warning-container text-on-warning-container font-bold',
                stepNumber === undefined && resolvedStatus === 'error' && 'bg-error-container text-on-error-container font-bold',
                stepNumber === undefined && resolvedStatus === 'pending' && 'bg-surface-container text-on-surface-variant/90 border border-outline/40',
                stepNumber === undefined && resolvedStatus === 'cancelled' && 'bg-surface-container text-on-surface-variant/70 border border-outline-variant',
                stepNumber === undefined && resolvedStatus === 'default' && 'bg-surface-container text-on-surface-variant'
              )
            : cn(
                'size-5 text-xs',
                isComplete && 'text-success',
                resolvedStatus === 'running' && 'text-on-surface-variant',
                resolvedStatus === 'warning' && 'text-warning',
                resolvedStatus === 'error' && 'text-error',
                resolvedStatus === 'pending' && 'text-outline/70',
                resolvedStatus === 'cancelled' && 'text-on-surface-variant/70',
                resolvedStatus === 'default' && 'text-on-surface-variant'
              ),
          className
        )}
        aria-hidden="true"
        {...props}
      >
        {children ? (
          children
        ) : stepNumber !== undefined ? (
          <span className="font-mono text-xs font-semibold tabular-nums leading-none">
            {stepNumber}
          </span>
        ) : resolvedStatus === 'running' ? (
          <Icon name="progress_activity" size="xs" className="animate-spin motion-reduce:animate-none inline-flex items-center justify-center" />
        ) : name ? (
          <Icon name={name} size="xs" className="inline-flex items-center justify-center" />
        ) : isComplete ? (
          <Icon name="check_circle" size="xs" className="inline-flex items-center justify-center" />
        ) : resolvedStatus === 'warning' ? (
          <Icon name="warning" size="xs" className="inline-flex items-center justify-center" />
        ) : resolvedStatus === 'error' ? (
          <Icon name="error" size="xs" className="inline-flex items-center justify-center" />
        ) : resolvedStatus === 'cancelled' ? (
          <Icon name="close" size="xs" className="inline-flex items-center justify-center" />
        ) : resolvedStatus === 'pending' ? (
          <Icon name="radio_button_unchecked" size="xs" className="inline-flex items-center justify-center" />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
    );
  }
);
TraceIcon.displayName = 'Trace.Icon';

/* -------------------------------------------------------------------------------------------------
 * TraceBadge (Status chip / counter tag)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: TraceStatus;
  children?: React.ReactNode;
  className?: string;
}

export const TraceBadge = React.forwardRef<HTMLSpanElement, TraceBadgeProps>(
  ({ status: explicitStatus, children, className, ...props }, ref) => {
    const lineCtx = useTraceLineContext();
    const rawStatus = explicitStatus ?? lineCtx.status ?? 'default';
    const isComplete =
      rawStatus === 'complete' ||
      rawStatus === 'completed' ||
      rawStatus === 'success';
    const resolvedStatus = isComplete ? 'complete' : rawStatus;

    return (
      <span
        ref={ref}
        data-slot="trace-badge"
        data-status={resolvedStatus}
        className={cn(
          'font-mono text-xs tabular-nums px-2 py-0.5 rounded-full select-none shrink-0 font-medium inline-flex items-center justify-center min-h-[20px]',
          isComplete && 'bg-success-container text-on-success-container',
          resolvedStatus === 'running' && 'bg-secondary-container text-on-secondary-container',
          resolvedStatus === 'warning' && 'bg-warning-container text-on-warning-container',
          resolvedStatus === 'error' && 'bg-error-container text-on-error-container',
          resolvedStatus === 'pending' && 'bg-surface-container text-on-surface-variant/90 border border-outline/40',
          resolvedStatus === 'cancelled' && 'bg-surface-container text-on-surface-variant/70 line-through',
          resolvedStatus === 'default' && 'bg-surface-container text-on-surface-variant',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TraceBadge.displayName = 'Trace.Badge';

/* -------------------------------------------------------------------------------------------------
 * TraceTitle
 * -----------------------------------------------------------------------------------------------*/
export interface TraceTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  shimmer?: boolean;
}

export const TraceTitle = React.forwardRef<HTMLSpanElement, TraceTitleProps>(
  ({ children, className, shimmer, ...props }, ref) => {
    const lineCtx = useTraceLineContext();
    const shouldShimmer = shimmer ?? (lineCtx.status === 'running');
    const isError = lineCtx.status === 'error';
    const isPending = lineCtx.status === 'pending';

    // If shimmer is active and children is a string or number, wrap in ShimmerText automatically
    const content =
      shouldShimmer && typeof children === 'string' ? (
        <ShimmerText variant="secondary" active={true}>
          {children}
        </ShimmerText>
      ) : (
        children
      );

    return (
      <span
        ref={ref}
        data-slot="trace-title"
        className={cn(
          'flex-1 min-w-0 font-sans text-xs font-semibold text-on-surface truncate leading-normal',
          isError && 'text-error',
          isPending && 'text-on-surface-variant font-normal',
          className
        )}
        {...props}
      >
        {content}
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
  duration?: string | number;
  className?: string;
}

export const TraceDescription = React.forwardRef<HTMLSpanElement, TraceDescriptionProps>(
  ({ children, duration, className, ...props }, ref) => {
    const formattedDuration = typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;
    const content =
      children ??
      (formattedDuration ? (
        <span className="font-mono tabular-nums">{formattedDuration}</span>
      ) : null);

    return (
      <span
        ref={ref}
        data-slot="trace-description"
        className={cn(
          'font-sans text-xs text-on-surface-variant flex items-center gap-1.5 shrink-0 leading-normal tabular-nums ml-auto',
          className
        )}
        {...props}
      >
        {content}
      </span>
    );
  }
);
TraceDescription.displayName = 'Trace.Description';

/* -------------------------------------------------------------------------------------------------
 * TraceCollapsible & Trigger & Content (Base UI headless primitives)
 * -----------------------------------------------------------------------------------------------*/
export interface TraceCollapsibleProps
  extends React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root> {
  children?: React.ReactNode;
  className?: string;
}

export const TraceCollapsible = React.forwardRef<HTMLDivElement, TraceCollapsibleProps>(
  ({ open, defaultOpen = false, onOpenChange, disabled, children, className, ...props }, ref) => {
    return (
      <BaseCollapsible.Root
        ref={ref}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
        data-slot="trace-collapsible"
        className={cn('group/trace-item w-full', className)}
        {...props}
      >
        {children}
      </BaseCollapsible.Root>
    );
  }
);
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
          className="flex items-center justify-center size-5 ml-2 text-on-surface-variant/80 shrink-0 group-hover:text-on-surface group-data-[panel-open]:rotate-180 group-data-[open]:rotate-180 group-data-[state=open]:rotate-180 transition-transform duration-quick ease-standard motion-reduce:transition-none"
          aria-hidden="true"
        >
          <Icon name="expand_more" size="xs" className="inline-flex items-center justify-center" />
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
  variant?: 'default' | 'flush' | 'unboxed';
}

export const TraceCollapsibleContent = React.forwardRef<
  HTMLDivElement,
  TraceCollapsibleContentProps
>(({ children, className, unstyled = false, variant = 'default', ...props }, ref) => {
  const isFlush = variant === 'flush';
  const isUnboxed = variant === 'unboxed';

  return (
    <TraceContext.Provider value={{ isNested: true }}>
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
              : isFlush
              ? 'p-0 border-t border-outline-variant/30 text-sm font-sans text-on-surface-variant leading-relaxed'
              : isUnboxed
              ? 'p-0 text-sm font-sans text-on-surface-variant leading-relaxed'
              : 'px-3.5 py-2.5 border-t border-outline-variant/30 text-sm font-sans text-on-surface-variant leading-relaxed',
            className
          )}
        >
          {children}
        </div>
      </BaseCollapsible.Panel>
    </TraceContext.Provider>
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
        className={cn('flex items-center gap-1.5 shrink-0 pl-2 ml-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TraceActions.displayName = 'Trace.Actions';

export interface TraceActionProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'size' | 'variant' | 'colorRole'> {
  label: string;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TraceAction = React.forwardRef<HTMLButtonElement, TraceActionProps>(
  ({ label, icon, children, onClick, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
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
        className={cn(
          'size-7 min-h-[28px] min-w-[28px] p-0 text-on-surface-variant hover:text-on-surface',
          className
        )}
        {...props}
      >
        {children ?? (icon ? <Icon name={icon} size="xs" aria-hidden="true" /> : null)}
      </Button>
    );
  }
);
TraceAction.displayName = 'Trace.Action';

/* -------------------------------------------------------------------------------------------------
 * TraceSeparator
 * -----------------------------------------------------------------------------------------------*/
export interface TraceSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TraceSeparator = React.forwardRef<HTMLDivElement, TraceSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      data-slot="trace-separator"
      className={cn('h-px w-full bg-outline-variant/40 my-1', className)}
      {...props}
    />
  )
);
TraceSeparator.displayName = 'Trace.Separator';

export const TraceHeader = TraceCollapsibleTrigger;
export const TraceBody = TraceCollapsibleContent;

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Trace = Object.assign(TraceRoot, {
  Line: TraceLine,
  Step: TraceLine,
  Icon: TraceIcon,
  Title: TraceTitle,
  Description: TraceDescription,
  Badge: TraceBadge,
  Tag: TraceBadge,
  Status: TraceBadge,
  Collapsible: TraceCollapsible,
  CollapsibleTrigger: TraceCollapsibleTrigger,
  CollapsibleContent: TraceCollapsibleContent,
  Header: TraceCollapsibleTrigger,
  Body: TraceCollapsibleContent,
  Trigger: TraceCollapsibleTrigger,
  Content: TraceCollapsibleContent,
  Actions: TraceActions,
  Action: TraceAction,
  Separator: TraceSeparator,
});

export {
  // Direct shadcn AI Elements aliases
  TraceLine as TraceStep,
  TraceBadge as TraceStatusIndicator,
  TraceCollapsibleTrigger as TraceTrigger,
  TraceCollapsibleContent as TraceContent,
};

export default Trace;
