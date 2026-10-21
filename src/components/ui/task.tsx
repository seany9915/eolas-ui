/**
 * Task primitive.
 *
 * Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite.
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements
 * - https://ui.shadcn.com/docs/ai-elements/task
 *
 * TAXONOMY & USAGE:
 * - Displays dynamic steps an AI agent takes sequentially as it executes work
 *   (e.g., reading files, running queries, making edits).
 * - Unlike `Plan` (which renders predetermined future steps), `Task` visualizes
 *   real-time execution where each new step is discovered as previous ones finish.
 * - Exports: Task, TaskTrigger, TaskContent, TaskItem.
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on interactive elements.
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
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------------------------------
 * TaskItem
 * -----------------------------------------------------------------------------------------------*/
export interface TaskItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: TraceStatus;
  icon?: string;
  duration?: string | number;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TaskItem = React.forwardRef<HTMLDivElement, TaskItemProps>(
  ({ title, description, status = 'complete', icon, duration, href, children, className, ...props }, ref) => {
    const formattedDuration =
      typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;

    const itemLine = (
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
        <TraceCollapsible defaultOpen={status === 'running'}>
          <TraceCollapsibleTrigger>
            {itemLine}
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

    if (href) {
      return (
        <a
          href={href}
          className="group/task-link block w-full hover:bg-surface-container/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
        >
          {itemLine}
        </a>
      );
    }

    return itemLine;
  }
);
TaskItem.displayName = 'TaskItem';

/* -------------------------------------------------------------------------------------------------
 * TaskTrigger
 * -----------------------------------------------------------------------------------------------*/
export interface TaskTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children'> {
  title?: string;
  status?: TraceStatus;
  duration?: string | number;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

export const TaskTrigger = React.forwardRef<HTMLButtonElement, TaskTriggerProps>(
  (
    {
      title = 'Agent task in progress',
      status = 'complete',
      duration,
      icon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const formattedDuration =
      typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;

    return (
      <TraceCollapsibleTrigger ref={ref} className={className} {...props}>
        {children ?? (
          <TraceLine status={status}>
            <TraceIcon
              name={icon ?? (status === 'running' ? 'progress_activity' : 'checklist')}
              status={status}
            />
            <TraceTitle>{title}</TraceTitle>
            {formattedDuration && (
              <TraceDescription>
                <span className="font-mono text-[11px] tabular-nums text-on-surface-variant/80">
                  {formattedDuration}
                </span>
              </TraceDescription>
            )}
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
    );
  }
);
TaskTrigger.displayName = 'TaskTrigger';

/* -------------------------------------------------------------------------------------------------
 * TaskContent
 * -----------------------------------------------------------------------------------------------*/
export interface TaskContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const TaskContent = React.forwardRef<HTMLDivElement, TaskContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TraceCollapsibleContent ref={ref} className={className} {...props}>
        <div className="pt-1">
          <Trace variant="embedded">{children}</Trace>
        </div>
      </TraceCollapsibleContent>
    );
  }
);
TaskContent.displayName = 'TaskContent';

/* -------------------------------------------------------------------------------------------------
 * Task (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface TaskProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'card' | 'embedded';
  children?: React.ReactNode;
  className?: string;
}

const TaskRoot = React.forwardRef<HTMLDivElement, TaskProps>(
  (
    {
      defaultOpen = true,
      open,
      onOpenChange,
      variant = 'card',
      children,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} data-slot="task" className={cn('w-full', className)}>
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
TaskRoot.displayName = 'Task';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Task = Object.assign(TaskRoot, {
  Trigger: TaskTrigger,
  Content: TaskContent,
  Item: TaskItem,
});

export default Task;
