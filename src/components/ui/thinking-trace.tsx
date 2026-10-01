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
    <div className={cn('@container my-2 w-full max-w-xl rounded-lg border border-outline-variant bg-surface overflow-hidden shadow-ambient', className)}>
      <Collapsible.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} className="w-full">
        <CollapsibleTrigger hideChevron className="min-h-[44px] px-3.5 py-2.5 bg-surface-container/30 hover:bg-surface-container/60 font-sans text-xs font-medium text-on-surface-variant transition-colors flex items-center justify-between w-full rounded-none">
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

        <CollapsiblePanel unstyled className="p-4 pt-2 border-t border-outline-variant/50">
          <div className="relative pl-7 py-1">
            {/* Vertical Timeline Track */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant" aria-hidden="true" />

            {/* Steps Sequence */}
            <div className="flex flex-col gap-3.5 font-sans text-xs text-on-surface-variant">
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-start gap-3">
                  <div
                    className={cn(
                      'absolute -left-7 mt-0.5 flex size-4 items-center justify-center rounded-full bg-surface border z-10',
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
              {children && (
                <div className="pt-2 text-xs text-on-surface-variant border-t border-outline-variant/30">
                  {children}
                </div>
              )}
            </div>
          </div>
        </CollapsiblePanel>
      </Collapsible.Root>
    </div>
  );
};

ThinkingTrace.displayName = 'ThinkingTrace';
