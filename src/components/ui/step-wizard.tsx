import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
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
  variant?: 'card' | 'embedded';
  allowStepClick?: boolean;
  /** When true, keeps all wizard steps in the DOM with hidden="until-found" so browser search (Ctrl+F) can find inactive step content */
  hiddenUntilFound?: boolean;
}

interface StepPanelProps {
  step: StepWizardStep;
  isSelected: boolean;
  direction: 'forward' | 'backward';
  onSelect: () => void;
}

const StepPanel: React.FC<StepPanelProps> = ({ step, isSelected, direction, onSelect }) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (!isSelected) {
      el.setAttribute('hidden', 'until-found');
    } else {
      el.removeAttribute('hidden');
    }

    const handleBeforeMatch = () => {
      onSelect();
    };

    el.addEventListener('beforematch', handleBeforeMatch);
    return () => {
      el.removeEventListener('beforematch', handleBeforeMatch);
    };
  }, [isSelected, onSelect]);

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
            ? 'rounded-lg bg-surface border border-outline-variant shadow-ambient overflow-hidden'
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
            <nav aria-label="Wizard Steps Progress" className="flex items-center gap-1 shrink-0 -mr-2">
              {steps.map((s, idx) => {
                const isSelected = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;
                const canNavigate = allowStepClick || isPast;

                return (
                  <BaseButton
                    key={s.id}
                    type="button"
                    onClick={() => canNavigate && onStepChange?.(idx)}
                    disabled={!canNavigate && !isSelected}
                    aria-label={`Step ${idx + 1}: ${s.title}${isPast ? ' (completed)' : isSelected ? ' (current)' : ''}`}
                    aria-current={isSelected ? 'step' : undefined}
                    className="flex min-w-[44px] min-h-[44px] items-center justify-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    <span
                      className={cn(
                        'size-7 rounded-full flex items-center justify-center font-mono text-xs font-bold tabular-nums transition-[background-color,border-color,color] duration-[var(--duration-quick)] select-none',
                        isSelected
                          ? 'bg-primary text-on-primary shadow-ambient'
                          : isPast
                          ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                          : 'border border-outline-variant text-on-surface-variant/60 bg-surface'
                      )}
                    >
                      {isPast ? (
                        <Icon name="check" size="xs" className="font-bold leading-none" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                  </BaseButton>
                );
              })}
            </nav>
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
          {hiddenUntilFound ? (
            steps.map((s, idx) => (
              <StepPanel
                key={s.id}
                step={s}
                isSelected={idx === currentStepIndex}
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
