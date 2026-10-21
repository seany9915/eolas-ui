/**
 * PromptInput primitive.
 *
 * Base UI Integration: Consumes Base UI Button, Textarea primitive, and Tooltip primitive.
 *
 * TAXONOMY & USAGE:
 * - Use PromptInput for conversational AI prompts, multi-turn clinical query inputs,
 *   and structured message composition.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring
 *   on the outer container, auto-growing height via modern CSS `field-sizing: content`,
 *   and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.
 * - Strictly avoids double-border / double-focus artifacts by delegating focus styles
 *   exclusively to PromptInput.Root.
 * - Supports Enter to submit and Shift+Enter for newline insertion.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Textarea } from './textarea';
import { Tooltip } from './tooltip';
import { Attachment, type AttachmentProps } from './attachment';
import { cn } from '@/lib/utils';

export interface PromptInputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PromptInputRoot = React.forwardRef<HTMLDivElement, PromptInputRootProps>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          '@container relative flex flex-col w-full bg-surface border border-outline rounded-lg p-2.5',
          'focus-within:border-primary focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
          'transition-[border-color] duration-quick ease-standard motion-reduce:transition-none',
          disabled && 'opacity-60 bg-surface-variant/30 border-outline-variant cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInputRoot.displayName = 'PromptInput.Root';

export interface PromptInputAttachmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const PromptInputAttachments = React.forwardRef<HTMLDivElement, PromptInputAttachmentsProps>(
  ({ children, className, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-2 pb-2 mb-1.5 border-b border-outline-variant/50 px-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInputAttachments.displayName = 'PromptInput.Attachments';

export interface PromptInputAttachmentProps extends AttachmentProps {}

const PromptInputAttachment = Attachment;
PromptInputAttachment.displayName = 'PromptInput.Attachment';

export interface PromptInputTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: () => void;
  minRows?: number;
  maxHeight?: number | string;
}

/**
 * Textarea field that consumes the project's Textarea primitive,
 * suppressing standalone borders to prevent double-border artifacts inside the PromptInput container.
 */
const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, onSubmit, onKeyDown, minRows = 2, maxHeight = '11rem', ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.();
      }
      onKeyDown?.(e);
    };

    return (
      <Textarea
        ref={ref}
        id={props.id || 'prompt-textarea'}
        name={props.name || 'prompt'}
        data-slot="prompt-input-textarea"
        rows={minRows}
        autoGrow={true}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full bg-transparent px-2 py-1 text-base font-sans text-on-surface leading-relaxed',
          'border-0 border-none outline-none ring-0 shadow-none',
          '[outline:none!important] [border:none!important] [box-shadow:none!important]',
          'focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 focus-visible:border-transparent',
          'focus-visible:[outline:none!important] focus-visible:[box-shadow:none!important]',
          'placeholder:text-on-surface-variant/70 resize-none min-h-[52px]',
          'disabled:cursor-not-allowed disabled:text-on-surface-variant/60 disabled:bg-transparent disabled:border-none',
          className
        )}
        style={{
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
PromptInputTextarea.displayName = 'PromptInput.Textarea';

export interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/50 mt-1 px-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PromptInputActions.displayName = 'PromptInput.Actions';

export interface PromptInputSubmitProps {
  isLoading?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  stopLabel?: string;
  className?: string;
}

const PromptInputSubmit: React.FC<PromptInputSubmitProps> = ({
  isLoading = false,
  disabled = false,
  onStop,
  onSubmit,
  submitLabel = 'Send',
  stopLabel = 'Stop',
  className,
}) => {
  if (isLoading) {
    return (
      <Tooltip content={stopLabel}>
        <Button
          variant="tonal"
          colorRole="neutral"
          size="md"
          onClick={onStop}
          className={cn('min-h-[44px] min-w-[44px] px-3.5 font-semibold gap-1.5 shrink-0', className)}
          aria-label={stopLabel}
        >
          <span className="w-2.5 h-2.5 rounded-xs bg-current shrink-0" aria-hidden="true" />
          <span className="hidden @sm:inline">{stopLabel}</span>
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={disabled ? undefined : submitLabel}>
      <Button
        variant="filled"
        colorRole="primary"
        size="md"
        onClick={onSubmit}
        disabled={disabled}
        className={cn('min-h-[44px] min-w-[44px] px-4 font-semibold gap-1.5 shrink-0', className)}
        aria-label={submitLabel}
      >
        <span className="hidden @sm:inline">{submitLabel}</span>
        <Icon name="send" size="sm" aria-hidden="true" />
      </Button>
    </Tooltip>
  );
};
PromptInputSubmit.displayName = 'PromptInput.Submit';

export interface PromptInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  attachments?: React.ReactNode;
  actionsStart?: React.ReactNode;
  actionsEnd?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
  minRows?: number;
  maxHeight?: number | string;
  submitLabel?: string;
  stopLabel?: string;
}

const PromptInputComponent = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      onStop,
      placeholder = 'Type a message or clinical prompt...',
      isLoading = false,
      disabled = false,
      attachments,
      actionsStart,
      actionsEnd,
      hint,
      className,
      minRows = 2,
      maxHeight = '11rem',
      submitLabel = 'Send',
      stopLabel = 'Stop',
    },
    ref
  ) => {
    const isSubmitDisabled = disabled || isLoading || !(value?.trim());

    return (
      <PromptInputRoot disabled={disabled} className={className}>
        {attachments && <PromptInputAttachments>{attachments}</PromptInputAttachments>}
        <PromptInputTextarea
          ref={ref}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          onSubmit={onSubmit}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          minRows={minRows}
          maxHeight={maxHeight}
        />
        <PromptInputActions>
          <div className="flex items-center gap-2 min-w-0">
            {actionsStart}
            {hint ? (
              <span className="text-xs font-sans text-on-surface-variant truncate">
                {hint}
              </span>
            ) : (
              <span className="text-xs font-sans text-on-surface-variant/80 hidden @sm:inline-flex items-center gap-1 select-none">
                <kbd className="font-mono text-[10px] bg-surface-container border border-outline-variant px-1.5 py-0.5 rounded">
                  Shift + Enter
                </kbd>
                <span>for new line</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {actionsEnd}
            <PromptInputSubmit
              isLoading={isLoading}
              disabled={isSubmitDisabled}
              onSubmit={onSubmit}
              onStop={onStop}
              submitLabel={submitLabel}
              stopLabel={stopLabel}
            />
          </div>
        </PromptInputActions>
      </PromptInputRoot>
    );
  }
);
PromptInputComponent.displayName = 'PromptInput';

export const PromptInput = Object.assign(PromptInputComponent, {
  Root: PromptInputRoot,
  Attachments: PromptInputAttachments,
  Attachment: PromptInputAttachment,
  Textarea: PromptInputTextarea,
  Actions: PromptInputActions,
  Submit: PromptInputSubmit,
});

export {
  PromptInputRoot,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputSubmit,
};
