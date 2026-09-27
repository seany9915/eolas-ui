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
    <div className={cn('@container my-2 w-full max-w-xl', className)}>
      <Collapsible defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger hideChevron className="min-h-[44px] px-3.5 py-2 rounded-md border border-outline-variant bg-surface-container/40 hover:bg-surface-container font-sans text-xs font-medium text-on-surface-variant transition-colors flex items-center justify-between w-full">
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
            className="text-outline transition-transform duration-[var(--duration-quick)] ease-[var(--ease-standard)] group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>

        <CollapsiblePanel className="pt-2">
          <div className="relative pl-6 py-2">
            {/* Vertical Timeline Track */}
            <div className="absolute left-2.5 top-3 bottom-3 w-px bg-outline-variant" aria-hidden="true" />

            {/* Steps Sequence */}
            <div className="flex flex-col gap-3 font-sans text-xs text-on-surface-variant">
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-start gap-2.5">
                  <div
                    className={cn(
                      'absolute -left-6 mt-0.5 flex size-4 items-center justify-center rounded-full bg-surface border',
                      step.isComplete
                        ? 'border-primary text-primary'
                        : 'border-outline text-outline'
                    )}
                  >
                    <Icon
                      name={step.icon || (step.isComplete ? 'check' : 'radio_button_unchecked')}
                      size="sm"
                      className="text-[10px]"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-4 w-full">
                    <span className="text-on-surface font-medium leading-tight">{step.label}</span>
                    {step.duration && (
                      <span className="font-mono text-[11px] text-outline tabular-nums shrink-0">
                        {step.duration}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {children}
            </div>
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  );
};

ThinkingTrace.displayName = 'ThinkingTrace';
