/**
 * Plan composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from `Trace` primitives (`src/components/ui/trace.tsx`)
 *             and `Progress` primitive (`src/components/ui/progress.tsx`).
 *
 * Specification & Reference:
 * - https://ui.shadcn.com/docs/ai-elements
 * - https://ui.shadcn.com/docs/ai-elements/plan
 *
 * TAXONOMY & USAGE:
 * - Displays an AI agent's multi-step plan determined up-front before execution
 *   (e.g., a 4-stage minimal pair therapy drill, clinical phonological assessment plan).
 * - Tracks progress with a progress bar and completion counter (e.g. "2 of 4 done").
 * - Supports both prop-driven array usage:
 *     <Plan title="..." steps={[...]} />
 *   and declarative compound composition:
 *     <Plan defaultOpen>
 *       <PlanHeader>
 *         <PlanTitle>Assessment Plan</PlanTitle>
 *         <PlanDescription>2 of 4 done</PlanDescription>
 *         <PlanTrigger />
 *       </PlanHeader>
 *       <PlanContent>...</PlanContent>
 *     </Plan>
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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface PlanStepItem {
  id: string;
  title: string;
  description?: string;
  status: 'complete' | 'running' | 'pending';
  duration?: string | number;
  details?: React.ReactNode;
  content?: React.ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export interface PlanContextValue {
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  overallStatus: TraceStatus;
}

const PlanContext = React.createContext<PlanContextValue | null>(null);

export function usePlan() {
  const ctx = React.useContext(PlanContext);
  if (!ctx) {
    throw new Error('Plan compound subcomponents must be used within a <Plan> parent.');
  }
  return ctx;
}

/* -------------------------------------------------------------------------------------------------
 * PlanTitle, PlanDescription, PlanTrigger, PlanHeader, PlanContent
 * -----------------------------------------------------------------------------------------------*/
export interface PlanTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const PlanTitle = React.forwardRef<HTMLSpanElement, PlanTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TraceTitle ref={ref} className={className} {...props}>
        {children}
      </TraceTitle>
    );
  }
);
PlanTitle.displayName = 'PlanTitle';

export interface PlanDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const PlanDescription = React.forwardRef<HTMLSpanElement, PlanDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TraceDescription ref={ref} className={className} {...props}>
        {children}
      </TraceDescription>
    );
  }
);
PlanDescription.displayName = 'PlanDescription';

export interface PlanTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TraceCollapsibleTrigger>, 'children'> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PlanTrigger = React.forwardRef<HTMLButtonElement, PlanTriggerProps>(
  ({ title = 'Execution Plan', description, children, className, ...props }, ref) => {
    const { completedCount, totalCount, overallStatus } = usePlan();

    return (
      <TraceCollapsibleTrigger ref={ref} className={className} {...props}>
        {children ?? (
          <TraceLine status={overallStatus}>
            <TraceIcon name="route" status={overallStatus} />
            <TraceTitle>{title}</TraceTitle>
            <TraceDescription>
              <span className="flex items-center gap-2">
                {description && <span>{description}</span>}
                <span className="font-mono tabular-nums">
                  {completedCount} of {totalCount} done
                </span>
              </span>
            </TraceDescription>
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
    );
  }
);
PlanTrigger.displayName = 'PlanTrigger';

export const PlanHeader = PlanTrigger;

export interface PlanContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const PlanContent = React.forwardRef<HTMLDivElement, PlanContentProps>(
  ({ children, className, ...props }, ref) => {
    const { progressPercent } = usePlan();

    return (
      <TraceCollapsibleContent ref={ref} className={className} {...props}>
        <div className="space-y-3 pt-1">
          {/* Progress Track */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-sans text-on-surface-variant">
              <span>Progress</span>
              <span className="font-mono tabular-nums">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>

          <div className="pt-1 divide-y divide-outline-variant/30">{children}</div>
        </div>
      </TraceCollapsibleContent>
    );
  }
);
PlanContent.displayName = 'PlanContent';

/* -------------------------------------------------------------------------------------------------
 * PlanStep
 * -----------------------------------------------------------------------------------------------*/
export interface PlanStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: TraceStatus;
  duration?: string | number;
  details?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PlanStep = React.forwardRef<HTMLDivElement, PlanStepProps>(
  ({ title, description, status = 'pending', duration, details, children, className, ...props }, ref) => {
    const formattedDuration =
      typeof duration === 'number' ? `${duration.toFixed(1)}s` : duration;

    const stepContent = children ?? details;

    const stepLine = (
      <TraceLine ref={ref} status={status} className={className} {...props}>
        <TraceIcon status={status} />
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

    if (stepContent) {
      return (
        <TraceCollapsible defaultOpen={status === 'running'}>
          <TraceCollapsibleTrigger>
            {stepLine}
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {typeof stepContent === 'string' ? (
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {stepContent}
              </p>
            ) : (
              stepContent
            )}
          </TraceCollapsibleContent>
        </TraceCollapsible>
      );
    }

    return stepLine;
  }
);
PlanStep.displayName = 'PlanStep';

/* -------------------------------------------------------------------------------------------------
 * Plan (Root Container)
 * -----------------------------------------------------------------------------------------------*/
export interface PlanProps {
  title?: string;
  description?: string;
  steps?: PlanStepItem[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'card' | 'embedded';
  children?: React.ReactNode;
  className?: string;
}

const PlanRoot: React.FC<PlanProps> = ({
  title = 'Execution Plan',
  description,
  steps = [],
  defaultOpen = true,
  open,
  onOpenChange,
  variant = 'embedded',
  children,
  className,
}) => {
  const completedCount = steps.filter((s) => s.status === 'complete').length;
  const runningCount = steps.filter((s) => s.status === 'running').length;
  const totalCount = steps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const overallStatus: TraceStatus =
    runningCount > 0 ? 'running' : completedCount === totalCount && totalCount > 0 ? 'complete' : 'default';

  const isCompound = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === PlanTrigger ||
        child.type === PlanContent ||
        (child.type as { displayName?: string })?.displayName === 'PlanTrigger' ||
        (child.type as { displayName?: string })?.displayName === 'PlanContent')
  );

  return (
    <PlanContext.Provider
      value={{
        completedCount,
        totalCount,
        progressPercent,
        overallStatus,
      }}
    >
      <div data-slot="plan" className={cn('w-full', className)}>
        <Trace variant={variant}>
          <TraceCollapsible
            defaultOpen={defaultOpen}
            open={open}
            onOpenChange={onOpenChange}
          >
            {isCompound ? (
              children
            ) : (
              <>
                <PlanTrigger title={title} description={description} />
                <PlanContent>
                  {steps.map((step) => {
                    const stepContent = step.content ?? step.details;
                    const stepDescription = (
                      <span className="flex items-center gap-2">
                        {step.description && <span>{step.description}</span>}
                        {step.duration && (
                          <span className="font-mono text-[11px] tabular-nums text-on-surface-variant/80">
                            {typeof step.duration === 'number' ? `${step.duration}s` : step.duration}
                          </span>
                        )}
                      </span>
                    );

                    if (stepContent) {
                      return (
                        <TraceCollapsible key={step.id} defaultOpen={step.status === 'running'}>
                          <TraceCollapsibleTrigger>
                            <TraceLine status={step.status}>
                              <TraceIcon status={step.status} />
                              <TraceTitle>{step.title}</TraceTitle>
                              {(step.description || step.duration) && (
                                <TraceDescription>{stepDescription}</TraceDescription>
                              )}
                            </TraceLine>
                          </TraceCollapsibleTrigger>
                          <TraceCollapsibleContent>
                            {typeof stepContent === 'string' ? (
                              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                                {stepContent}
                              </p>
                            ) : (
                              stepContent
                            )}
                          </TraceCollapsibleContent>
                        </TraceCollapsible>
                      );
                    }

                    return (
                      <TraceLine key={step.id} status={step.status}>
                        <TraceIcon status={step.status} />
                        <TraceTitle>{step.title}</TraceTitle>
                        {(step.description || step.duration) && (
                          <TraceDescription>{stepDescription}</TraceDescription>
                        )}
                      </TraceLine>
                    );
                  })}
                </PlanContent>
              </>
            )}
          </TraceCollapsible>
        </Trace>
      </div>
    </PlanContext.Provider>
  );
};
PlanRoot.displayName = 'Plan';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Plan = Object.assign(PlanRoot, {
  Header: PlanHeader,
  Title: PlanTitle,
  Description: PlanDescription,
  Trigger: PlanTrigger,
  Content: PlanContent,
  Step: PlanStep,
});

export default Plan;
