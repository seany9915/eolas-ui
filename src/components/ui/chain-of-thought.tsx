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
  type TraceStatus,
} from './trace';
import { Chip } from './chip';
import { cn } from '@/lib/utils';

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
      <TraceLine ref={ref} status={status} className={className} {...props}>
        <TraceIcon name={icon} status={status} />
        <TraceTitle>{title}</TraceTitle>
        {(description || formattedDuration) && (
          <TraceDescription>
            <span className="flex items-center gap-2">
              {description && <span>{description}</span>}
              {formattedDuration && (
                <span className="font-mono text-[11px] tabular-nums text-on-surface-variant/80">
                  {formattedDuration}
                </span>
              )}
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
          <TraceCollapsibleContent>
            {typeof children === 'string' ? (
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {children}
              </p>
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
      status = 'complete',
      badgeLabel,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <TraceCollapsibleTrigger ref={ref} className={className} {...props}>
        {children ?? (
          <TraceLine status={status}>
            <TraceIcon name="hub" status={status} />
            <TraceTitle>{title}</TraceTitle>
            <TraceDescription>
              <span className="flex items-center gap-2">
                {stepCount !== undefined && (
                  <Chip pattern="outline-neutral-fill" colorRole="neutral" size="sm" className="font-mono text-[10px] py-0 px-1.5 h-5">
                    {stepCount} {stepCount === 1 ? 'step' : 'steps'}
                  </Chip>
                )}
                {badgeLabel && (
                  <span className="font-mono text-[11px] tabular-nums text-on-surface-variant/80">
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
      <TraceCollapsibleContent ref={ref} className={className} {...props}>
        <div className="pt-1 divide-y divide-outline-variant/30">{children}</div>
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
  variant?: 'default' | 'card' | 'embedded';
  children?: React.ReactNode;
  className?: string;
}

const ChainOfThoughtRoot = React.forwardRef<HTMLDivElement, ChainOfThoughtProps>(
  (
    {
      defaultOpen = false,
      open,
      onOpenChange,
      variant = 'embedded',
      children,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} data-slot="chain-of-thought" className={cn('w-full', className)}>
        <Trace variant={variant}>
          <TraceCollapsible
            defaultOpen={defaultOpen}
            open={open}
            onOpenChange={onOpenChange}
          >
            {children}
          </TraceCollapsible>
        </Trace>
      </div>
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
});

export default ChainOfThought;
