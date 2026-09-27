import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Icon } from './icon';
import { RadioGroup, Radio } from './radio';

export interface ApprovalCardOption {
  id: string;
  label: string;
  description?: string;
}

export interface ApprovalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  options?: ApprovalCardOption[];
  selectedOptionId?: string;
  onSelectOption?: (id: string) => void;
  allowCustomInput?: boolean;
  customInputValue?: string;
  onCustomInputChange?: (val: string) => void;
  customInputPlaceholder?: string;
  stepCurrent?: number;
  stepTotal?: number;
  onPreviousStep?: () => void;
  onNextStep?: () => void;
  onSkip?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  skipLabel?: string;
  isConfirmDisabled?: boolean;
}

export const ApprovalCard = React.forwardRef<HTMLDivElement, ApprovalCardProps>(
  (
    {
      className,
      title,
      description,
      options = [],
      selectedOptionId,
      onSelectOption,
      allowCustomInput = true,
      customInputValue = '',
      onCustomInputChange,
      customInputPlaceholder = 'Something else…',
      stepCurrent,
      stepTotal,
      onPreviousStep,
      onNextStep,
      onSkip,
      onConfirm,
      confirmLabel = 'Continue',
      skipLabel = 'Skip',
      isConfirmDisabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={`AI agent approval: ${title}`}
        className={cn(
          '@container relative flex flex-col rounded-lg bg-surface border border-outline-variant shadow-ambient overflow-hidden max-w-md w-full',
          className
        )}
        {...props}
      >
        {/* Card Header & Body */}
        <div className="p-5 @sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 pr-2">
            <h4
              className="font-heading text-headline-sm font-semibold text-on-surface"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h4>
            {description && (
              <p
                className="font-sans text-body-md text-on-surface-variant"
                style={{ textWrap: 'pretty' }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Options Choice Set using shared RadioGroup primitive */}
          {options.length > 0 && (
            <RadioGroup
              value={selectedOptionId}
              onValueChange={(val) => onSelectOption?.(val)}
              ariaLabel={title}
              className="gap-2 mt-1"
            >
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-md border text-left transition-all duration-[var(--duration-quick)] ease-[var(--ease-standard)] cursor-pointer select-none',
                      'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-2',
                      isSelected
                        ? 'border-primary bg-primary-container/20 text-on-surface'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    )}
                  >
                    <Radio value={opt.id} className="mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-sm font-medium leading-tight">
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="font-sans text-xs text-on-surface-variant mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}

              {allowCustomInput && (
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-[var(--duration-quick)] ease-[var(--ease-standard)]',
                    selectedOptionId === '__custom__'
                      ? 'border-primary bg-primary-container/20'
                      : 'border-outline-variant hover:bg-surface-container'
                  )}
                >
                  <Icon name="edit" size="sm" className="text-on-surface-variant shrink-0" />
                  <input
                    type="text"
                    value={customInputValue}
                    onChange={(e) => {
                      onSelectOption?.('__custom__');
                      onCustomInputChange?.(e.target.value);
                    }}
                    onFocus={() => onSelectOption?.('__custom__')}
                    placeholder={customInputPlaceholder}
                    aria-label="Custom answer"
                    className="w-full bg-transparent font-sans text-sm text-on-surface placeholder:text-outline focus:outline-none"
                  />
                </div>
              )}
            </RadioGroup>
          )}
        </div>

        {/* Card Footer with Multi-step Pagination & Action Triggers */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-surface-container border-t border-outline-variant">
          {stepCurrent && stepTotal ? (
            <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-xs tabular-nums select-none">
              {onPreviousStep && (
                <button
                  type="button"
                  onClick={onPreviousStep}
                  disabled={stepCurrent <= 1}
                  aria-label="Previous question"
                  className="flex size-11 items-center justify-center rounded-sm hover:bg-surface disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer"
                >
                  <Icon name="chevron_left" size="sm" />
                </button>
              )}
              <span>
                {stepCurrent} / {stepTotal}
              </span>
              {onNextStep && (
                <button
                  type="button"
                  onClick={onNextStep}
                  disabled={stepCurrent >= stepTotal}
                  aria-label="Next question"
                  className="flex size-11 items-center justify-center rounded-sm hover:bg-surface disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors cursor-pointer"
                >
                  <Icon name="chevron_right" size="sm" />
                </button>
              )}
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {onSkip && (
              <Button type="button" variant="outlined" size="sm" onClick={onSkip}>
                {skipLabel}
              </Button>
            )}
            {onConfirm && (
              <Button
                type="button"
                variant="filled"
                size="sm"
                onClick={onConfirm}
                disabled={isConfirmDisabled}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ApprovalCard.displayName = 'ApprovalCard';
