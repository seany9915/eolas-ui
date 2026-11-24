'use client';

/**
 * ApprovalCard block.
 *
 * @deprecated Use `Confirmation` (`@/components/ui/confirmation`) for `[Approve] / [Deny]`
 * AI tool approval gates and clinical decision sign-offs, or `Questionnaire` (`@/components/blocks/questionnaire`
 * with declarative `items`) for single-step or multi-step choice and free-text clarification prompts.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { RadioGroup, Radio } from '@/components/ui/radio';
import { Input } from '@/components/ui/input';

/**
 * Reserved id for the built-in free-text option. Options using it are ignored.
 * @deprecated Use `Confirmation` or `Questionnaire` instead.
 */
export const APPROVAL_CARD_CUSTOM_OPTION_ID = '__custom__';

/**
 * @deprecated Use `Confirmation` or `QuestionnaireItemDef` instead.
 */
export interface ApprovalCardOption {
  id: string;
  label: string;
  description?: string;
}

/**
 * @deprecated Use `ConfirmationProps` (`@/components/ui/confirmation`) or `QuestionnaireProps` (`@/components/blocks/questionnaire`) instead.
 */
export interface ApprovalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  options?: ApprovalCardOption[];
  /** Controlled selection. When omitted, the card tracks the selection itself. */
  selectedOptionId?: string;
  onSelectOption?: (id: string) => void;
  /** Adds a free-text answer. With no options, only the text input is shown. */
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

/**
 * @deprecated Use `Confirmation` (`@/components/ui/confirmation`) or `Questionnaire` (`@/components/blocks/questionnaire`) instead.
 */
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
      customInputValue,
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
    const [internalSelectedId, setInternalSelectedId] = React.useState<string | undefined>();
    const [internalCustomInput, setInternalCustomInput] = React.useState('');
    const selectedId = selectedOptionId ?? internalSelectedId;
    const resolvedCustomInput = customInputValue ?? internalCustomInput;
    const choices = options.filter((opt) => opt.id !== APPROVAL_CARD_CUSTOM_OPTION_ID);
    const customInput = (
      <Field.Root>
        <Field.Label className="sr-only">Custom answer</Field.Label>
        <Input
          type="text"
          value={resolvedCustomInput}
          onChange={(e) => {
            if (customInputValue === undefined) {
              setInternalCustomInput(e.target.value);
            }
            onCustomInputChange?.(e.target.value);
          }}
          placeholder={customInputPlaceholder}
          className="w-full"
        />
      </Field.Root>
    );

    return (
      <Card
        ref={ref}
        role="region"
        aria-label={`Approval: ${title}`}
        className={cn('@container flex flex-col w-full', className)}
        {...props}
      >
        <Card.Header>
          <Card.Title as="h4">{title}</Card.Title>
          {description && <Card.Description>{description}</Card.Description>}
        </Card.Header>

        {(choices.length > 0 || allowCustomInput) && (
          <Card.Content className="flex flex-col gap-4">
            {/* Options Choice Set using shared RadioGroup primitive */}
            {choices.length === 0 && allowCustomInput && <div className="mt-1">{customInput}</div>}
            {choices.length > 0 && (
              <RadioGroup
                value={selectedId ?? ''}
                onValueChange={(val) => {
                  setInternalSelectedId(val);
                  onSelectOption?.(val);
                }}
                ariaLabel={title}
                className="mt-1"
              >
                {choices.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-md border-2 text-start transition-colors duration-quick motion-reduce:transition-none cursor-pointer select-none',
                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-2',
                        isSelected
                          ? 'border-primary bg-primary-container text-on-surface'
                          : 'border-transparent bg-surface hover:border-outline-variant/50 hover:bg-state-hover text-on-surface'
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
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-md border-2 transition-colors duration-quick motion-reduce:transition-none cursor-pointer',
                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-2',
                        selectedId === APPROVAL_CARD_CUSTOM_OPTION_ID
                          ? 'border-primary bg-primary-container text-on-surface'
                          : 'border-transparent bg-surface hover:border-outline-variant/50 hover:bg-state-hover text-on-surface'
                      )}
                    >
                      <Radio value={APPROVAL_CARD_CUSTOM_OPTION_ID} className="shrink-0" />
                      <span className="font-sans text-sm font-medium leading-tight text-on-surface">
                        {customInputPlaceholder || 'Other (specify)'}
                      </span>
                    </label>
                    {selectedId === APPROVAL_CARD_CUSTOM_OPTION_ID && <div className="ps-7">{customInput}</div>}
                  </div>
                )}
              </RadioGroup>
            )}
          </Card.Content>
        )}

        {/* Card Footer with Multi-step Pagination & Action Triggers */}
        <Card.Footer className="flex-wrap justify-between gap-3">
          {stepCurrent && stepTotal ? (
            <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-xs tabular-nums select-none">
              {onPreviousStep && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onPreviousStep}
                  disabled={stepCurrent <= 1}
                  aria-label="Previous step"
                >
                  <Icon name="chevron_left" size="sm" directional />
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
                  aria-label="Next step"
                >
                  <Icon name="chevron_right" size="sm" directional />
                </Button>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2 ms-auto">
            {onSkip && (
              <Button type="button" variant="outline" colorRole="neutral" size="sm" onClick={onSkip}>
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
        </Card.Footer>
      </Card>
    );
  }
);

ApprovalCard.displayName = 'ApprovalCard';
export default ApprovalCard;
