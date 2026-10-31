/**
 * ChainOfThought primitive.
 *
 * Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite
 *                      and `Chip` design tokens.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements
 * - https://ui.shadcn.com/docs/ai-elements/chain-of-thought
 *
 * TAXONOMY & USAGE:
 * - Displays an AI agent's multi-step execution summary (e.g. "Researched in 4 steps")
 *   that smoothly expands to reveal historical reasoning, search, and tool steps.
 * - Follows the shadcn AI Elements migration specification:
 *   Rebuilt natively using Trace and Chip/Badge primitives.
 * - Exports: ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtTrigger,
 *   ChainOfThoughtContent, ChainOfThoughtStep.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on triggers.
 * - Follows DESIGN.md tokens: floating 2px focus ring, semantic tokens, zero triple-tints.
 */
import * as React from 'react';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceBadge,
  type TraceStatus,
} from './trace';
import { Chip } from './chip';
import { useChatMessageContext } from './chat-message-context';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
interface ChainOfThoughtContextValue {
  isStreaming: boolean;
}

const ChainOfThoughtContext = React.createContext<ChainOfThoughtContextValue>({ isStreaming: false });

export function useChainOfThought() {
  return React.useContext(ChainOfThoughtContext);
}

/* -------------------------------------------------------------------------------------------------
 * ChainOfThoughtStep
 * -----------------------------------------------------------------------------------------------*/
export interface ChainOfThoughtStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: TraceStatus;
  icon?: string;
  duration?: string | number;
  children?: React.ReactNode;
  className?: string;
}

export const ChainOfThoughtStep = React.forwardRef<HTMLDivElement, ChainOfThoughtStepProps>(
  ({ title, description, status = 'complete', icon, duration, children, className, ...props }, ref) => {
    const formattedDuration =
      typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;

    const stepLine = (
      <TraceLine
        ref={ref}
        status={status}
        className={cn(description ? 'items-start py-2' : 'items-center', className)}
        {...props}
      >
        <TraceIcon name={icon} status={status} className={description ? 'mt-0.5' : undefined} />
        <div className="flex flex-col min-w-0 flex-1 leading-tight text-left">
          <TraceTitle className="truncate">{title}</TraceTitle>
          {description && (
            <span className="font-sans text-[11px] text-on-surface-variant truncate mt-0.5">
              {description}
            </span>
          )}
        </div>
        {formattedDuration && (
          <TraceDescription className="ml-auto shrink-0 pl-2">
            <span className="font-mono text-xs tabular-nums text-on-surface-variant/80">
              {formattedDuration}
            </span>
          </TraceDescription>
        )}
      </TraceLine>
    );

    if (children) {
      return (
        <TraceCollapsible defaultOpen={false}>
          <TraceCollapsibleTrigger>
            {stepLine}
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent unstyled className="px-3.5 pb-2.5 pt-1 pl-11 text-sm font-sans text-on-surface-variant leading-relaxed">
            {typeof children === 'string' ? (
              <p>{children}</p>
            ) : (
              children
            )}
          </TraceCollapsibleContent>
        </TraceCollapsible>
      );
    }

    return stepLine;
  }
);
ChainOfThoughtStep.displayName = 'ChainOfThoughtStep';

/* -------------------------------------------------------------------------------------------------
 * ChainOfThoughtHeader / ChainOfThoughtTrigger
 * -----------------------------------------------------------------------------------------------*/
export interface ChainOfThoughtHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children'> {
  title?: string;
  stepCount?: number;
  status?: TraceStatus;
  badgeLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ChainOfThoughtHeader = React.forwardRef<HTMLButtonElement, ChainOfThoughtHeaderProps>(
  (
    {
      title = 'Chain of thought',
      stepCount,
      status: propStatus,
      badgeLabel,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const { isStreaming } = useChainOfThought();
    const status = propStatus ?? (isStreaming ? 'running' : 'complete');

    return (
      <TraceCollapsibleTrigger ref={ref} className={className} {...props}>
        {children ?? (
          <TraceLine status={status}>
            <TraceIcon name={isStreaming && !propStatus ? 'progress_activity' : 'hub'} status={status} />
            <TraceTitle>{title}</TraceTitle>
            <TraceDescription>
              <span className="flex items-center gap-2">
                {stepCount !== undefined && (
                  <Chip pattern="outline-neutral-fill" colorRole="neutral" size="sm" className="font-mono text-xs py-0 px-1.5 h-5">
                    {stepCount} {stepCount === 1 ? 'step' : 'steps'}
                  </Chip>
                )}
                {badgeLabel && (
                  <span className="font-mono text-xs tabular-nums text-on-surface-variant/80">
                    {badgeLabel}
                  </span>
                )}
              </span>
            </TraceDescription>
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
    );
  }
);
ChainOfThoughtHeader.displayName = 'ChainOfThoughtHeader';

export const ChainOfThoughtTrigger = ChainOfThoughtHeader;

/* -------------------------------------------------------------------------------------------------
 * ChainOfThoughtContent
 * -----------------------------------------------------------------------------------------------*/
export interface ChainOfThoughtContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const ChainOfThoughtContent = React.forwardRef<HTMLDivElement, ChainOfThoughtContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TraceCollapsibleContent ref={ref} variant="flush" className={className} {...props}>
        <div className="divide-y divide-outline-variant/30">{children}</div>
      </TraceCollapsibleContent>
    );
  }
);
ChainOfThoughtContent.displayName = 'ChainOfThoughtContent';

/* -------------------------------------------------------------------------------------------------
 * ChainOfThought (Root)
 * -----------------------------------------------------------------------------------------------*/
export interface ChainOfThoughtProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isStreaming?: boolean;
  variant?: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
  children?: React.ReactNode;
  className?: string;
}

export const ChainOfThoughtRoot = React.forwardRef<HTMLDivElement, ChainOfThoughtProps>(
  (
    {
      defaultOpen,
      open,
      onOpenChange,
      isStreaming = false,
      variant,
      children,
      className,
    },
    ref
  ) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'embedded');
    const resolvedDefaultOpen = defaultOpen ?? isStreaming;

    return (
      <ChainOfThoughtContext.Provider value={{ isStreaming }}>
        <div ref={ref} data-slot="chain-of-thought" className={cn('w-full', className)}>
          <Trace variant={resolvedVariant}>
            <TraceCollapsible
              defaultOpen={resolvedDefaultOpen}
              open={open}
              onOpenChange={onOpenChange}
            >
              {children}
            </TraceCollapsible>
          </Trace>
        </div>
      </ChainOfThoughtContext.Provider>
    );
  }
);
ChainOfThoughtRoot.displayName = 'ChainOfThought';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const ChainOfThought = Object.assign(ChainOfThoughtRoot, {
  Header: ChainOfThoughtHeader,
  Trigger: ChainOfThoughtTrigger,
  Content: ChainOfThoughtContent,
  Step: ChainOfThoughtStep,
  Badge: TraceBadge,
  Status: TraceBadge,
});

export default ChainOfThought;
