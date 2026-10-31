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
  TraceBadge,
  type TraceStatus,
} from './trace';
import { UnstyledButton } from './button';
import { useChatMessageContext } from './chat-message-context';
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
        <TraceCollapsible defaultOpen={status === 'running'}>
          <TraceCollapsibleTrigger>
            {itemLine}
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent unstyled className="px-3.5 pb-2.5 pt-1 pl-11 text-sm font-sans text-on-surface-variant leading-relaxed">
            {typeof children === 'string' ? (
              <p>
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
        <UnstyledButton
          render={
            <a
              href={href}
              className="group/task-link block w-full hover:bg-surface-container/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
            />
          }
        >
          {itemLine}
        </UnstyledButton>
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
                <span className="font-mono text-xs tabular-nums text-on-surface-variant/80">
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
      <TraceCollapsibleContent ref={ref} variant="flush" className={className} {...props}>
        <div className="divide-y divide-outline-variant/30">{children}</div>
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
  variant?: 'default' | 'card' | 'embedded' | 'ghost' | 'unboxed';
  children?: React.ReactNode;
  className?: string;
}

export const TaskRoot = React.forwardRef<HTMLDivElement, TaskProps>(
  (
    {
      defaultOpen = true,
      open,
      onOpenChange,
      variant,
      children,
      className,
    },
    ref
  ) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'embedded');

    return (
      <div ref={ref} data-slot="task" className={cn('w-full', className)}>
        <Trace variant={resolvedVariant}>
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

export const TaskHeader = TaskTrigger;
export const TaskTitle = TraceTitle;
export const TaskDescription = TraceDescription;

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Task = Object.assign(TaskRoot, {
  Header: TaskTrigger,
  Trigger: TaskTrigger,
  Title: TraceTitle,
  Description: TraceDescription,
  Content: TaskContent,
  Item: TaskItem,
  Icon: TraceIcon,
  Badge: TraceBadge,
  Status: TraceBadge,
});

export default Task;
