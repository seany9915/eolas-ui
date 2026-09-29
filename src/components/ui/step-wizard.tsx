import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Icon } from './icon';

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
}

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
          '@container flex flex-col rounded-lg bg-surface border border-outline-variant shadow-ambient overflow-hidden w-full max-w-2xl mx-auto',
          className
        )}
        {...props}
      >
        {/* Step Wizard Header / Navigation Indicator */}
        <div className="flex flex-col gap-3 p-5 @sm:p-6 border-b border-outline-variant bg-surface-container/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <h3
                className="font-heading text-headline-sm font-semibold text-on-surface truncate"
                style={{ textWrap: 'balance' }}
              >
                {currentStep?.title}
              </h3>
            </div>
            <div className="flex items-center -mr-2 font-mono text-xs text-on-surface-variant tabular-nums shrink-0">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStepChange?.(idx)}
                  disabled={idx > currentStepIndex}
                  aria-label={`Jump to step ${idx + 1}: ${s.title}`}
                  aria-current={idx === currentStepIndex ? 'step' : undefined}
                  className="flex min-w-[44px] min-h-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span
                    className={cn(
                      'size-2.5 rounded-full transition-[width,background-color] duration-[var(--duration-quick)]',
                      idx === currentStepIndex
                        ? 'w-6 bg-primary'
                        : idx < currentStepIndex
                        ? 'bg-outline hover:bg-on-surface'
                        : 'bg-outline-variant opacity-60'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          {currentStep?.description && (
            <p className="font-sans text-body-md text-on-surface-variant" style={{ textWrap: 'pretty' }}>
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Directional Sliding Step Viewport */}
        <div
          className="relative min-h-[200px] overflow-hidden p-5 @sm:p-6"
          aria-live="polite"
        >
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
        </div>

        {/* Footer Navigation Controls */}
        {showNavigationButtons && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 bg-surface-container border-t border-outline-variant">
            <Button
              type="button"
              variant="outlined"
              size="md"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={cn(isFirstStep && 'invisible')}
            >
              <Icon name="chevron_left" size="sm" />
              <span>{previousLabel}</span>
            </Button>
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
