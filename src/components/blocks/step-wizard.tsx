/**
 * StepWizard composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from Base UI primitives and design tokens:
 *             - `Button`, `UnstyledButton` (`src/components/ui/button.tsx`)
 *             - `Icon` (`src/components/ui/icon.tsx`)
 *
 * TAXONOMY & USAGE:
 * - Controlled multi-step workflow container for guided intake, onboarding,
 *   assessment flows, and multi-stage form sequences.
 * - Pure UI: receives step data via props, manages directional slide transitions,
 *   and emits progression intents via callbacks (`onStepChange`, `onComplete`).
 * - Accessible: WCAG 2.2 SC 2.5.8 compliant (44x44px minimum touch targets on all interactive step markers and buttons),
 *   floating 2px focus indicators (`outline-offset: 2px`), and live regions (`aria-live="polite"`).
 * - Modern HTML integration: supports `hiddenUntilFound` with `hidden="until-found"` and `beforematch`
 *   event listener so browser search (<kbd>Ctrl+F</kbd>) finds inactive step content.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, UnstyledButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

export interface StepWizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

export interface StepWizardProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepWizardStep[];
  currentStepIndex: number;
  onStepChange?: (index: number) => void;
  onComplete?: () => void;
  completeLabel?: string;
  nextLabel?: string;
  previousLabel?: string;
  showNavigationButtons?: boolean;
  variant?: 'card' | 'embedded';
  /** "numbered" shows a clickable circle per step. "progress" shows a slim progress bar, which suits longer flows. */
  indicator?: 'numbered' | 'progress';
  /** Lets users jump to upcoming steps from the step indicators. Completed steps are always clickable. */
  allowStepClick?: boolean;
  /** When true, keeps wizard steps in the DOM with hidden="until-found" so browser search (Ctrl+F) can find them. Only completed steps (or all steps when llowStepClick is set) are searchable, so find-in-page cannot skip guarded progression. */
  hiddenUntilFound?: boolean;
}

interface StepPanelProps {
  step: StepWizardStep;
  isSelected: boolean;
  canReveal: boolean;
  direction: 'forward' | 'backward';
  onSelect: () => void;
}

const StepPanel: React.FC<StepPanelProps> = ({ step, isSelected, canReveal, direction, onSelect }) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (isSelected) {
      el.removeAttribute('hidden');
    } else {
      el.setAttribute('hidden', canReveal ? 'until-found' : '');
    }

    const handleBeforeMatch = () => {
      onSelect();
    };

    el.addEventListener('beforematch', handleBeforeMatch);
    return () => {
      el.removeEventListener('beforematch', handleBeforeMatch);
    };
  }, [isSelected, canReveal, onSelect]);

  return (
    <div
      ref={panelRef}
      className={cn(
        'w-full [&[hidden]:not([hidden="until-found"])]:hidden',
        isSelected
          ? direction === 'forward'
            ? 'animate-step-forward'
            : 'animate-step-backward'
          : '',
        'motion-reduce:animate-none'
      )}
    >
      {step.content}
    </div>
  );
};

export const StepWizard = React.forwardRef<HTMLDivElement, StepWizardProps>(
  (
    {
      className,
      steps,
      currentStepIndex,
      onStepChange,
      onComplete,
      completeLabel = 'Finish',
      nextLabel = 'Next step',
      previousLabel = 'Back',
      showNavigationButtons = true,
      variant = 'card',
      indicator = 'numbered',
      allowStepClick = false,
      hiddenUntilFound = false,
      ...props
    },
    ref
  ) => {
    const prevStepRef = React.useRef(currentStepIndex);
    const direction = currentStepIndex >= prevStepRef.current ? 'forward' : 'backward';

    React.useEffect(() => {
      prevStepRef.current = currentStepIndex;
    }, [currentStepIndex]);

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;
    const currentStep = steps[currentStepIndex];

    const handleNext = () => {
      if (isLastStep) {
        onComplete?.();
      } else {
        onStepChange?.(currentStepIndex + 1);
      }
    };

    const handlePrevious = () => {
      if (!isFirstStep) {
        onStepChange?.(currentStepIndex - 1);
      }
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label={`Step ${currentStepIndex + 1} of ${steps.length}: ${currentStep?.title}`}
        className={cn(
          '@container flex flex-col w-full mx-auto',
          variant === 'card'
            ? 'rounded-lg bg-surface shadow-ambient overflow-hidden'
            : 'bg-transparent overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Step Wizard Header / Navigation Indicator */}
        <div
          className={cn(
            'flex flex-col gap-3 p-5 @sm:p-6 border-b border-outline-variant',
            variant === 'card' ? 'bg-surface-container/50' : 'bg-surface-container/20 rounded-t-lg'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <h3 className="font-heading text-headline-sm font-semibold text-on-surface truncate text-balance">
                {currentStep?.title}
              </h3>
            </div>
            {indicator === 'numbered' && (
            <nav aria-label="Wizard Steps Progress" className="flex flex-wrap items-center gap-1 -mr-2">
              {steps.map((s, idx) => {
                const isSelected = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;
                const canNavigate = allowStepClick || isPast;

                return (
                  <UnstyledButton
                    key={s.id}
                    type="button"
                    onClick={() => canNavigate && onStepChange?.(idx)}
                    disabled={!canNavigate && !isSelected}
                    aria-label={`Step ${idx + 1}: ${s.title}${isPast ? ' (completed)' : isSelected ? ' (current)' : ''}`}
                    aria-current={isSelected ? 'step' : undefined}
                    className="flex min-w-11 min-h-11 items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    <span
                      className={cn(
                        'size-7 rounded-full flex items-center justify-center font-mono text-xs font-bold tabular-nums transition-colors duration-quick ease-standard select-none',
                        isSelected
                          ? 'bg-primary text-on-primary shadow-ambient'
                          : isPast
                          ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                          : 'border border-outline-variant text-on-surface-variant/60 bg-surface'
                      )}
                    >
                      {isPast ? (
                        <Icon name="check" size="xs" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                  </UnstyledButton>
                );
              })}
            </nav>
            )}
          </div>
          {indicator === 'progress' && (
            <Progress
              value={currentStepIndex + 1}
              max={steps.length}
              size="sm"
              aria-label="Wizard progress"
              aria-valuetext={`Step ${currentStepIndex + 1} of ${steps.length}`}
            />
          )}
          {currentStep?.description && (
            <p className="font-sans text-body-md text-on-surface-variant text-pretty">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Directional Sliding Step Viewport */}
        <div
          className="relative min-h-50 overflow-hidden p-5 @sm:p-6"
          aria-live="polite"
        >
          {hiddenUntilFound ? (
            steps.map((s, idx) => (
              <StepPanel
                key={s.id}
                step={s}
                isSelected={idx === currentStepIndex}
                canReveal={idx < currentStepIndex || allowStepClick}
                direction={direction}
                onSelect={() => onStepChange?.(idx)}
              />
            ))
          ) : (
            <div
              key={currentStep?.id || currentStepIndex}
              className={cn(
                'w-full',
                direction === 'forward'
                  ? 'animate-step-forward'
                  : 'animate-step-backward',
                'motion-reduce:animate-none'
              )}
            >
              {currentStep?.content}
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        {showNavigationButtons && (
          <div
            className={cn(
              'flex items-center justify-between gap-4 px-5 py-4 border-t border-outline-variant',
              variant === 'card' ? 'bg-surface-container' : 'bg-surface-container/20 rounded-b-lg'
            )}
          >
            <div className={cn('flex items-center', isFirstStep && 'invisible')}>
              <Button
                type="button"
                variant="outlined"
                colorRole="neutral"
                size="md"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                <Icon name="chevron_left" size="sm" />
                <span>{previousLabel}</span>
              </Button>
            </div>
            <Button
              type="button"
              variant="filled"
              size="md"
              onClick={handleNext}
            >
              <span>{isLastStep ? completeLabel : nextLabel}</span>
              {!isLastStep && <Icon name="chevron_right" size="sm" />}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

StepWizard.displayName = 'StepWizard';
