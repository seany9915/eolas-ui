import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { RadioGroup, Radio } from '@/components/ui/radio';
import { Input } from '@/components/ui/input';

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
            <h4 className="font-heading text-headline-sm font-semibold text-on-surface text-balance">
              {title}
            </h4>
            {description && (
              <p className="font-sans text-body-md text-on-surface-variant text-pretty">
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
              className="mt-1"
            >
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-md border text-left transition-colors duration-150 cursor-pointer select-none',
                      'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-2',
                      isSelected
                        ? 'border-primary bg-primary-container text-on-surface'
                        : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface'
                    )}
                  >
                    <Radio value={opt.id} className="mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-sm font-medium leading-tight text-on-surface">
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
                <div className="flex flex-col gap-2">
                  <label
                    onClick={() => onSelectOption?.('__custom__')}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-md border transition-colors duration-150 cursor-pointer',
                      'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-2',
                      selectedOptionId === '__custom__'
                        ? 'border-primary bg-primary-container text-on-surface'
                        : 'border-outline-variant bg-surface hover:bg-surface-container text-on-surface'
                    )}
                  >
                    <Radio value="__custom__" className="shrink-0" />
                    <span className="font-sans text-sm font-medium leading-tight text-on-surface">
                      {customInputPlaceholder || 'Other (specify)'}
                    </span>
                  </label>
                  {selectedOptionId === '__custom__' && (
                    <div className="pl-7">
                      <Input
                        type="text"
                        value={customInputValue}
                        onChange={(e) => onCustomInputChange?.(e.target.value)}
                        placeholder={customInputPlaceholder}
                        aria-label="Custom answer"
                        className="w-full"
                      />
                    </div>
                  )}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onPreviousStep}
                  disabled={stepCurrent <= 1}
                  aria-label="Previous question"
                >
                  <Icon name="chevron_left" size="sm" />
                </Button>
              )}
              <span>
                {stepCurrent} / {stepTotal}
              </span>
              {onNextStep && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onNextStep}
                  disabled={stepCurrent >= stepTotal}
                  aria-label="Next question"
                >
                  <Icon name="chevron_right" size="sm" />
                </Button>
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
export default ApprovalCard;
