import * as React from 'react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from './collapsible';
import { Icon } from './icon';

export interface ThinkingTraceStep {
  id: string;
  label: string;
  duration?: string;
  icon?: string;
  isComplete?: boolean;
  isActive?: boolean;
}

export interface ThinkingTraceProps {
  title?: string;
  icon?: string;
  elapsedTime?: string;
  steps?: ThinkingTraceStep[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const ThinkingTrace: React.FC<ThinkingTraceProps> = ({
  title = 'Reasoning trace',
  icon = 'view_timeline',
  elapsedTime,
  steps = [],
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  children,
}) => {
  return (
    <div className={cn('@container w-full rounded-lg border border-outline-variant bg-surface overflow-hidden shadow-ambient', className)}>
      <Collapsible.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} className="w-full">
        <CollapsibleTrigger
          hideChevron
          className="min-h-[44px] px-4 py-3 bg-surface hover:bg-surface-container/40 transition-colors flex items-center justify-between w-full rounded-none"
        >
          <div className="flex items-center gap-2">
            <Icon name={icon} size="sm" className="text-primary text-base" />
            <span className="font-sans text-xs font-semibold text-on-surface">{title}</span>
            {elapsedTime && (
              <span className="font-mono text-[11px] text-outline tabular-nums">
                ({elapsedTime})
              </span>
            )}
          </div>
          <Icon
            name="expand_more"
            size="sm"
            className="text-outline group-data-[panel-open]:rotate-180 transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)]"
          />
        </CollapsibleTrigger>

        <CollapsiblePanel unstyled className="p-4 pt-3 border-t border-outline-variant/50">
          <div className="relative">
            {/* Steps Sequence */}
            <div className="flex flex-col gap-3.5 font-sans text-xs text-on-surface-variant">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const nextStep = steps[index + 1];
                const isActive = step.isActive ?? (!step.isComplete && (step.icon === 'pending' || step.icon === 'progress_activity'));
                const isBothComplete = Boolean(step.isComplete && nextStep?.isComplete);

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    {/* Step Marker Node & Rail */}
                    <div className="relative flex flex-col items-center self-stretch shrink-0">
                      {!isLast && (
                        <div
                          className={cn(
                            'absolute top-5 bottom-[-14px] left-1/2 -translate-x-1/2 w-0.5 z-0',
                            isBothComplete ? 'bg-primary' : 'bg-outline-variant'
                          )}
                          aria-hidden="true"
                        />
                      )}
                      {step.isComplete ? (
                        <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                          <Icon
                            name={step.icon && step.icon !== 'check_circle' && step.icon !== 'check' ? step.icon : 'check'}
                            size="xs"
                            className="text-xs"
                          />
                        </div>
                      ) : isActive ? (
                        <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-primary">
                          {step.icon === 'progress_activity' ? (
                            <Icon name="progress_activity" size="xs" className="animate-spin text-xs" />
                          ) : step.icon && step.icon !== 'pending' ? (
                            <Icon name={step.icon} size="xs" className="text-xs" />
                          ) : (
                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-outline-variant bg-surface text-outline-variant">
                          {step.icon && step.icon !== 'pending' && step.icon !== 'radio_button_unchecked' ? (
                            <Icon name={step.icon} size="xs" className="text-xs" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-outline-variant" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step Label & Duration */}
                    <div className="flex items-baseline justify-between gap-4 w-full min-w-0 pt-0.5">
                      <span className="text-on-surface font-medium leading-tight">{step.label}</span>
                      {step.duration && (
                        <span className="font-mono text-[11px] text-outline tabular-nums shrink-0">
                          {step.duration}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dedicated Reasoning Summary Block */}
            {children && (
              <div className="mt-4 pt-3 border-t border-outline-variant/40 font-sans text-xs text-on-surface-variant leading-relaxed">
                {children}
              </div>
            )}
          </div>
        </CollapsiblePanel>
      </Collapsible.Root>
    </div>
  );
};

ThinkingTrace.displayName = 'ThinkingTrace';
