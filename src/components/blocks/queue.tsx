/**
 * Queue composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from `Trace` primitives (`src/components/ui/trace.tsx`).
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements
 * - https://ui.shadcn.com/docs/ai-elements/queue
 *
 * TAXONOMY & USAGE:
 * - Displays an AI agent's dynamic queue / to-do list, cleanly partitioned into
 *   remaining tasks ('To do') and finished tasks ('Completed').
 * - As the agent works, tasks transition across sections.
 * - Supports both prop-driven array usage:
 *     <Queue items={[...]} />
 *   and declarative compound composition:
 *     <Queue>
 *       <Queue.Section title="2 to do" status="pending">
 *         <Queue.Item title="Task 1" status="pending" />
 *       </Queue.Section>
 *     </Queue>
 * - WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.
 */
import * as React from 'react';
import {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  type TraceStatus,
} from '@/components/ui/trace';
import { cn } from '@/lib/utils';

export interface QueueItem {
  id: string;
  title: string;
  description?: string;
  status?: 'complete' | 'running' | 'pending';
  isCompleted?: boolean;
  duration?: string | number;
  content?: React.ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * QueueHeader & QueueTitle
 * -----------------------------------------------------------------------------------------------*/
export interface QueueHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const QueueHeader = React.forwardRef<HTMLDivElement, QueueHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="queue-header"
        className={cn('px-3.5 pt-3 pb-2 border-b border-outline-variant/40', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
QueueHeader.displayName = 'QueueHeader';

export interface QueueTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
}

export const QueueTitle = React.forwardRef<HTMLHeadingElement, QueueTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        data-slot="queue-title"
        className={cn('font-heading text-sm font-bold text-on-surface', className)}
        {...props}
      >
        {children}
      </h5>
    );
  }
);
QueueTitle.displayName = 'QueueTitle';

/* -------------------------------------------------------------------------------------------------
 * QueueItemComponent
 * -----------------------------------------------------------------------------------------------*/
export interface QueueItemComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: TraceStatus;
  duration?: string | number;
  icon?: string;
  className?: string;
}

export const QueueItemComponent = React.forwardRef<HTMLDivElement, QueueItemComponentProps>(
  ({ title, description, status = 'pending', duration, icon, className, ...props }, ref) => {
    const formattedDuration =
      typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;

    return (
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
  }
);
QueueItemComponent.displayName = 'QueueItem';

/* -------------------------------------------------------------------------------------------------
 * QueueSection
 * -----------------------------------------------------------------------------------------------*/
export interface QueueSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  countLabel?: string;
  status?: TraceStatus;
  icon?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export const QueueSection = React.forwardRef<HTMLDivElement, QueueSectionProps>(
  (
    {
      title,
      countLabel,
      status = 'pending',
      icon,
      defaultOpen = true,
      open,
      onOpenChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const defaultIcon = status === 'complete' ? 'task_alt' : 'pending_actions';

    return (
      <div ref={ref} className={className} {...props}>
        <TraceCollapsible
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
        >
          <TraceCollapsibleTrigger>
            <TraceLine status={status}>
              <TraceIcon name={icon ?? defaultIcon} status={status} />
              <TraceTitle>{title}</TraceTitle>
              {countLabel && (
                <TraceDescription>
                  <span className="font-mono tabular-nums">{countLabel}</span>
                </TraceDescription>
              )}
            </TraceLine>
          </TraceCollapsibleTrigger>

          <TraceCollapsibleContent>
            <div className="pt-1">
              <Trace variant="embedded">{children}</Trace>
            </div>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </div>
    );
  }
);
QueueSection.displayName = 'QueueSection';

/* -------------------------------------------------------------------------------------------------
 * Queue (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface QueueProps {
  items?: QueueItem[];
  title?: string;
  description?: string;
  todoTitle?: string;
  completedTitle?: string;
  defaultTodoOpen?: boolean;
  defaultCompletedOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const QueueRoot: React.FC<QueueProps> = ({
  items = [],
  title,
  description,
  todoTitle,
  completedTitle,
  defaultTodoOpen = true,
  defaultCompletedOpen = false,
  children,
  className,
}) => {
  const isItemCompleted = (i: QueueItem) => i.isCompleted === true || i.status === 'complete';
  const pendingItems = items.filter((i) => !isItemCompleted(i));
  const completedItems = items.filter((i) => isItemCompleted(i));

  const resolvedTodoTitle = todoTitle ?? `${pendingItems.length} to do`;
  const resolvedCompletedTitle = completedTitle ?? `${completedItems.length} completed`;

  const isCompound = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === QueueSection ||
        (child.type as { displayName?: string })?.displayName === 'QueueSection')
  );

  return (
    <div data-slot="queue" className={cn('w-full', className)}>
      <Trace variant="card">
        {(title || description) && (
          <div className="px-3.5 pt-3 pb-2 border-b border-outline-variant/40">
            {title && <h5 className="font-heading text-sm font-bold text-on-surface">{title}</h5>}
            {description && <p className="font-sans text-xs text-on-surface-variant mt-0.5">{description}</p>}
          </div>
        )}

        {isCompound ? (
          children
        ) : (
          <>
            {/* Section 1: Pending To-Do Items */}
            {pendingItems.length > 0 && (
              <QueueSection
                title={resolvedTodoTitle}
                countLabel={`${pendingItems.length} remaining`}
                status="pending"
                defaultOpen={defaultTodoOpen}
              >
                {pendingItems.map((item) => {
                  const status = item.status ?? 'pending';
                  return (
                    <QueueItemComponent
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      status={status}
                      duration={item.duration}
                    />
                  );
                })}
              </QueueSection>
            )}

            {/* Section 2: Completed Items */}
            {completedItems.length > 0 && (
              <QueueSection
                title={resolvedCompletedTitle}
                countLabel={`${completedItems.length} finished`}
                status="complete"
                defaultOpen={defaultCompletedOpen}
              >
                {completedItems.map((item) => (
                  <QueueItemComponent
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    status="complete"
                    duration={item.duration}
                  />
                ))}
              </QueueSection>
            )}

            {items.length === 0 && (
              <TraceLine status="default">
                <TraceIcon name="inbox" status="default" />
                <TraceTitle>Queue is empty</TraceTitle>
                <TraceDescription>No active agent tasks</TraceDescription>
              </TraceLine>
            )}
          </>
        )}
      </Trace>
    </div>
  );
};
QueueRoot.displayName = 'Queue';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Queue = Object.assign(QueueRoot, {
  Header: QueueHeader,
  Title: QueueTitle,
  Section: QueueSection,
  Item: QueueItemComponent,
});

export default Queue;
