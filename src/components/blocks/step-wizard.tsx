/**
 * StepWizard composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from Base UI primitives and design tokens:
 *             - `Card` (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`) (`src/components/ui/card.tsx`)
 *             - `Button`, `UnstyledButton` (`src/components/ui/button.tsx`)
 *             - `Separator` (`src/components/ui/separator.tsx`)
 *             - `Progress` (`src/components/ui/progress.tsx`)
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
import { Card } from '@/components/ui/card';
import { Button, UnstyledButton } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  /** When true, keeps wizard steps in the DOM with hidden="until-found" so browser search (Ctrl+F) can find them. Only completed steps (or all steps when allowStepClick is set) are searchable, so find-in-page cannot skip guarded progression. */
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
        'w-full px-1 [&[hidden]:not([hidden="until-found"])]:hidden',
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
    const totalSteps = steps.length;
    const safeIndex = totalSteps > 0 ? Math.min(Math.max(0, currentStepIndex), totalSteps - 1) : 0;

    const prevStepRef = React.useRef(safeIndex);
    const direction = safeIndex >= prevStepRef.current ? 'forward' : 'backward';

    React.useEffect(() => {
      prevStepRef.current = safeIndex;
    }, [safeIndex]);

    if (totalSteps === 0) {
      return null;
    }

    const isFirstStep = safeIndex === 0;
    const isLastStep = safeIndex === totalSteps - 1;
    const currentStep = steps[safeIndex];

    const handleNext = () => {
      if (isLastStep) {
        onComplete?.();
      } else {
        onStepChange?.(safeIndex + 1);
      }
    };

    const handlePrevious = () => {
      if (!isFirstStep) {
        onStepChange?.(safeIndex - 1);
      }
    };

    const wizardContent = (
      <>
        {/* Step Wizard Header / Navigation Indicator */}
        <Card.Header>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                Step {safeIndex + 1} of {totalSteps}
              </span>
              <Card.Title as="h3">
                {currentStep.title}
              </Card.Title>
            </div>
            {indicator === 'numbered' && (
              <nav aria-label="Wizard Steps Progress" className="flex flex-wrap items-center gap-1">
                {steps.map((s, idx) => {
                  const isSelected = idx === safeIndex;
                  const isPast = idx < safeIndex;
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
                          <Icon name="check" size="xs" aria-hidden="true" />
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
              value={safeIndex + 1}
              max={totalSteps}
              size="sm"
              aria-label="Wizard progress"
              aria-valuetext={`Step ${safeIndex + 1} of ${totalSteps}`}
            />
          )}
          {currentStep.description && (
            <Card.Description>
              {currentStep.description}
            </Card.Description>
          )}
        </Card.Header>

        <Separator className="mt-4 mb-0" />

        {/* Directional Sliding Step Viewport */}
        <Card.Content
          className="relative min-h-50 pt-4 pb-1 overflow-x-clip"
          aria-live="polite"
        >
          {hiddenUntilFound ? (
            steps.map((s, idx) => (
              <StepPanel
                key={s.id}
                step={s}
                isSelected={idx === safeIndex}
                canReveal={idx < safeIndex || allowStepClick}
                direction={direction}
                onSelect={() => onStepChange?.(idx)}
              />
            ))
          ) : (
            <div
              key={currentStep.id || safeIndex}
              className={cn(
                'w-full px-1',
                direction === 'forward'
                  ? 'animate-step-forward'
                  : 'animate-step-backward',
                'motion-reduce:animate-none'
              )}
            >
              {currentStep.content}
            </div>
          )}
        </Card.Content>

        {/* Footer Navigation Controls */}
        {showNavigationButtons && (
          <>
            <Separator className="mt-4 mb-0" />
            <Card.Footer className="justify-between">
              <div className={cn('flex items-center', isFirstStep && 'invisible')}>
                <Button
                  type="button"
                  variant="outline"
                  colorRole="neutral"
                  size="md"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                >
                  <Icon name="chevron_left" size="sm" aria-hidden="true" />
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
                {!isLastStep && <Icon name="chevron_right" size="sm" aria-hidden="true" />}
              </Button>
            </Card.Footer>
          </>
        )}
      </>
    );

    if (variant === 'embedded') {
      return (
        <div
          ref={ref}
          role="region"
          aria-label={`Step ${safeIndex + 1} of ${totalSteps}: ${currentStep.title}`}
          className={cn('@container flex flex-col w-full mx-auto bg-transparent', className)}
          {...props}
        >
          {wizardContent}
        </div>
      );
    }

    return (
      <Card
        ref={ref}
        role="region"
        aria-label={`Step ${safeIndex + 1} of ${totalSteps}: ${currentStep.title}`}
        className={cn('@container flex flex-col w-full mx-auto', className)}
        {...props}
      >
        {wizardContent}
      </Card>
    );
  }
);

StepWizard.displayName = 'StepWizard';
