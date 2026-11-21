'use client';

/**
 * PromptInput primitive.
 *
 * Base UI Integration: Composes InputGroup (InputGroup, InputGroupTextarea, InputGroupAddon,
 * InputGroupButton, InputGroupText), Attachment, Menu, Tooltip, and Button primitives.
 *
 * Conforms to shadcn AI Elements specification:
 * https://ui.shadcn.com/docs/ai-elements/base/prompt-input
 *
 * TAXONOMY & USAGE:
 * - Use PromptInput for conversational AI prompts, multi-turn clinical query inputs,
 *   and structured message composition.
 * - Supports Model Selection (PromptInputModelSelect) and Reasoning Effort (PromptInputEffort)
 *   in the bottom-left action bar, alongside file attachments and tool toggles.
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
import { Tooltip } from './tooltip';
import {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  type AttachmentProps,
  type AttachmentGroupProps,
  type AttachmentMediaProps,
  type AttachmentContentProps,
  type AttachmentTitleProps,
  type AttachmentDescriptionProps,
  type AttachmentActionsProps,
  type AttachmentActionProps,
  type AttachmentTriggerProps,
  type AttachmentState,
  type AttachmentOrientation,
  type AttachmentSize,
} from './attachment';
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
} from './menu';
import { Badge } from './badge';
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  type InputGroupProps,
  type InputGroupButtonProps,
} from './input-group';
import { cn } from '@/lib/utils';

export interface PromptInputRootProps extends Omit<InputGroupProps, 'onSubmit'> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'card' | 'ghost' | 'unboxed' | 'floating';
  floating?: boolean;
  asForm?: boolean;
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PromptInputRoot = React.forwardRef<HTMLDivElement, PromptInputRootProps>(
  ({ children, className, disabled, variant = 'default', floating = false, asForm = false, onFormSubmit, render, ...props }, ref) => {
    const isGhost = variant === 'ghost' || variant === 'unboxed';
    const isFloating = floating || variant === 'floating';

    return (
      <InputGroup
        ref={ref}
        variant={variant}
        floating={isFloating}
        disabled={disabled}
        render={
          render ??
          (asForm ? <form onSubmit={onFormSubmit} /> : undefined)
        }
        data-slot="prompt-input"
        className={cn(!isGhost && 'p-2.5 rounded-md', className)}
        {...props}
      >
        {children}
      </InputGroup>
    );
  }
);
PromptInputRoot.displayName = 'PromptInput.Root';

export interface PromptInputAttachmentsProps extends AttachmentGroupProps {
  children?: React.ReactNode;
  className?: string;
}

const PromptInputAttachments = React.forwardRef<HTMLDivElement, PromptInputAttachmentsProps>(
  ({ children, className, scrollable = true, ...props }, ref) => {
    if (!children) return null;
    return (
      <InputGroupAddon align="block-start" className="p-0 border-b-0 pb-1.5">
        <AttachmentGroup
          ref={ref}
          scrollable={scrollable}
          data-slot="prompt-input-attachments"
          className={cn('w-full px-1', className)}
          {...props}
        >
          {children}
        </AttachmentGroup>
      </InputGroupAddon>
    );
  }
);
PromptInputAttachments.displayName = 'PromptInput.Attachments';

export interface PromptInputTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: () => void;
  onFilesPasted?: (files: File[]) => void;
  /** Optional list of previously submitted prompts (oldest-to-newest) for ArrowUp/ArrowDown history navigation. */
  history?: string[];
  /** Callback invoked when the user steps through prompt history via ArrowUp/ArrowDown. */
  onHistoryChange?: (value: string) => void;
  minRows?: number;
  maxHeight?: number | string;
}

/**
 * Textarea field built on InputGroupTextarea so it shares InputGroupContext,
 * auto-growing behavior, paste handling, and IME-safe Enter submission.
 */
const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  (
    {
      className,
      style,
      onSubmit,
      onFilesPasted,
      history,
      onHistoryChange,
      onKeyDown,
      onChange,
      minRows = 3,
      maxHeight = '12rem',
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const historyIndexRef = React.useRef<number>(-1);
    const draftBeforeHistoryRef = React.useRef<string>('');

    const handleSubmit = React.useCallback(() => {
      historyIndexRef.current = -1;
      onSubmit?.();
    }, [onSubmit]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      historyIndexRef.current = -1;
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const isImeComposing = e.nativeEvent.isComposing || e.keyCode === 229;
      if (history && history.length > 0 && onHistoryChange && !isImeComposing) {
        const target = e.currentTarget;
        if (
          historyIndexRef.current >= 0 &&
          (historyIndexRef.current >= history.length ||
            target.value !== (history[historyIndexRef.current] ?? ''))
        ) {
          historyIndexRef.current = -1;
        }

        const atStart = target.selectionStart === 0 && target.selectionEnd === 0;
        const atEnd =
          target.selectionStart === target.value.length &&
          target.selectionEnd === target.value.length;

        if (
          e.key === 'ArrowUp' &&
          (historyIndexRef.current >= 0 || target.value === '' || atStart)
        ) {
          e.preventDefault();
          if (historyIndexRef.current === -1) {
            draftBeforeHistoryRef.current = target.value;
            historyIndexRef.current = history.length - 1;
            onHistoryChange(history[historyIndexRef.current] ?? '');
          } else if (historyIndexRef.current > 0) {
            historyIndexRef.current -= 1;
            onHistoryChange(history[historyIndexRef.current] ?? '');
          }
        } else if (
          e.key === 'ArrowDown' &&
          historyIndexRef.current >= 0 &&
          (atEnd || target.value === history[historyIndexRef.current])
        ) {
          e.preventDefault();
          if (historyIndexRef.current < history.length - 1) {
            historyIndexRef.current += 1;
            onHistoryChange(history[historyIndexRef.current] ?? '');
          } else {
            historyIndexRef.current = -1;
            onHistoryChange(draftBeforeHistoryRef.current);
          }
        }
      }
    };

    return (
      <InputGroupTextarea
        ref={ref}
        id={props.id || generatedId}
        name={props.name || 'prompt'}
        data-slot="prompt-input-textarea"
        minRows={minRows}
        maxHeight={maxHeight}
        onSubmit={onSubmit ? handleSubmit : undefined}
        onFilesPasted={onFilesPasted}
        className={cn('px-1.5 py-1 min-w-0', className)}
        style={{
          minHeight: minRows ? `calc(${minRows}lh + 0.5rem)` : undefined,
          ...style,
        }}
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    );
  }
);
PromptInputTextarea.displayName = 'PromptInput.Textarea';

export interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  align?: 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
  className?: string;
}

const PromptInputActions = React.forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ children, align = 'block-end', className, ...props }, ref) => {
    return (
      <InputGroupAddon
        ref={ref}
        align={align}
        data-slot="prompt-input-actions"
        className={cn(
          align === 'block-end' && 'px-0.5 pb-0 pt-1.5',
          align === 'block-start' && 'px-0.5 pt-0 pb-1.5 mb-auto',
          align === 'inline-start' && 'px-0.5',
          align === 'inline-end' && 'px-0.5',
          className
        )}
        {...props}
      >
        {children}
      </InputGroupAddon>
    );
  }
);
PromptInputActions.displayName = 'PromptInput.Actions';

export interface PromptInputActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const PromptInputAction = React.forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="prompt-input-action"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {children}
    </div>
  )
);
PromptInputAction.displayName = 'PromptInput.Action';

export interface PromptInputTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

const PromptInputText = React.forwardRef<HTMLSpanElement, PromptInputTextProps>(
  ({ children, className, ...props }, ref) => (
    <InputGroupText
      ref={ref}
      data-slot="prompt-input-text"
      className={cn('truncate', className)}
      {...props}
    >
      {children}
    </InputGroupText>
  )
);
PromptInputText.displayName = 'PromptInput.Text';

/* -------------------------------------------------------------------------------------------------
 * Model Selector
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputModelOption {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  badge?: string;
  icon?: string;
}

export interface PromptInputModelSelectProps {
  model: string;
  onModelChange: (model: string) => void;
  models?: PromptInputModelOption[];
  disabled?: boolean;
  className?: string;
}

export const PromptInputModelSelect: React.FC<PromptInputModelSelectProps> = ({
  model,
  onModelChange,
  models = [],
  disabled = false,
  className,
}) => {
  const currentModel = models.find((m) => m.id === model);
  const displayName = currentModel?.name || model;

  const grouped = React.useMemo(() => {
    const groups: Record<string, PromptInputModelOption[]> = {};
    for (const m of models) {
      const p = m.provider || '';
      if (!groups[p]) groups[p] = [];
      groups[p].push(m);
    }
    return groups;
  }, [models]);

  if (models.length === 0) {
    return (
      <Button
        variant="ghost"
        colorRole="neutral"
        size="sm"
        disabled={disabled}
        expandedTouchTarget
        aria-label={`Current model: ${displayName}`}
        className={cn(
          'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full text-on-surface hover:bg-state-hover transition-colors',
          className
        )}
      >
        <Icon name={currentModel?.icon || 'smart_toy'} size="xs" className="text-secondary shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[120px]">{displayName}</span>
      </Button>
    );
  }

  return (
    <Menu
      trigger={
        <Button
          variant="ghost"
          colorRole="neutral"
          size="sm"
          disabled={disabled}
          expandedTouchTarget
          aria-label={`Current model: ${displayName}`}
          className={cn(
            'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full text-on-surface hover:bg-state-hover transition-colors',
            className
          )}
        >
          <Icon name={currentModel?.icon || 'smart_toy'} size="xs" className="text-secondary shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[120px]">{displayName}</span>
          <Icon name="expand_more" size="xs" className="text-on-surface-variant/70 shrink-0" aria-hidden="true" />
        </Button>
      }
    >
      <MenuContent side="top" align="start" className="w-68 max-w-[calc(100vw-2rem)] p-1.5">
        <MenuRadioGroup value={model} onValueChange={(val) => onModelChange(val as string)}>
          {Object.entries(grouped).map(([provider, items]) => (
            <MenuGroup key={provider || 'default'}>
              {provider && <MenuGroupLabel>{provider}</MenuGroupLabel>}
              {items.map((item) => (
                <MenuRadioItem key={item.id} value={item.id} className="min-h-11 py-1.5">
                  <div className="flex flex-col min-w-0 pe-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-semibold text-xs text-on-surface">{item.name}</span>
                      {item.badge && (
                        <Badge size="sm" variant="soft" colorRole="secondary" className="text-xs leading-none h-4.5 py-0 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-xs font-sans text-on-surface-variant truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </MenuRadioItem>
              ))}
            </MenuGroup>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
};
PromptInputModelSelect.displayName = 'PromptInput.ModelSelect';

/* -------------------------------------------------------------------------------------------------
 * Reasoning Effort Level
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputEffortOption {
  id: string;
  label: string;
  description?: string;
}

export interface PromptInputEffortProps {
  effort?: string;
  onEffortChange?: (effort: string) => void;
  options?: PromptInputEffortOption[];
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const PromptInputEffort: React.FC<PromptInputEffortProps> = ({
  effort,
  onEffortChange,
  options = [],
  label = 'Thinking',
  disabled = false,
  className,
}) => {
  const isThinkingActive = Boolean(effort && effort !== 'none' && effort !== 'off');
  const activeOption = options.find((o) => o.id === effort);
  const displayValue = activeOption?.label || effort;
  const buttonLabel = isThinkingActive ? `${label}: ${displayValue}` : label;

  if (options.length === 0) {
    return (
      <Button
        variant={isThinkingActive ? 'soft' : 'ghost'}
        colorRole={isThinkingActive ? 'secondary' : 'neutral'}
        size="sm"
        disabled={disabled}
        onClick={() => onEffortChange?.(isThinkingActive ? 'none' : 'active')}
        expandedTouchTarget
        aria-label={buttonLabel}
        aria-pressed={isThinkingActive}
        className={cn(
          'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full transition-colors',
          isThinkingActive
            ? 'bg-secondary-container text-on-secondary-container'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover',
          className
        )}
      >
        <Icon
          name="psychology"
          size="xs"
          className={cn('shrink-0', isThinkingActive ? 'text-secondary' : 'text-on-surface-variant/70')}
          aria-hidden="true"
        />
        <span className="truncate">
          {isThinkingActive ? (
            <>
              <span className="hidden @sm:inline">{label}: </span>
              <span>{displayValue}</span>
            </>
          ) : (
            label
          )}
        </span>
      </Button>
    );
  }

  return (
    <Menu
      trigger={
        <Button
          variant={isThinkingActive ? 'soft' : 'ghost'}
          colorRole={isThinkingActive ? 'secondary' : 'neutral'}
          size="sm"
          disabled={disabled}
          expandedTouchTarget
          aria-label={buttonLabel}
          className={cn(
            'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full transition-colors',
            isThinkingActive
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover',
            className
          )}
        >
          <Icon
            name="psychology"
            size="xs"
            className={cn('shrink-0', isThinkingActive ? 'text-secondary' : 'text-on-surface-variant/70')}
            aria-hidden="true"
          />
          <span className="truncate">
            {isThinkingActive ? (
              <>
                <span className="hidden @sm:inline">{label}: </span>
                <span>{displayValue}</span>
              </>
            ) : (
              label
            )}
          </span>
          <Icon name="expand_more" size="xs" className="shrink-0 opacity-70" aria-hidden="true" />
        </Button>
      }
    >
      <MenuContent side="top" align="start" className="w-56 p-1.5">
        <MenuRadioGroup value={effort || ''} onValueChange={(val) => onEffortChange?.(val as string)}>
          <MenuGroup>
            <MenuGroupLabel>{label}</MenuGroupLabel>
            {options.map((opt) => (
              <MenuRadioItem key={opt.id} value={opt.id} className="min-h-11 py-1 text-xs">
                <div className="flex flex-col min-w-0 pe-2">
                  <span className="font-heading font-semibold text-xs text-on-surface">{opt.label}</span>
                  {opt.description && (
                    <span className="text-xs font-sans text-on-surface-variant truncate">
                      {opt.description}
                    </span>
                  )}
                </div>
              </MenuRadioItem>
            ))}
          </MenuGroup>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
};
PromptInputEffort.displayName = 'PromptInput.Effort';

/* -------------------------------------------------------------------------------------------------
 * File Attachment Trigger Button
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputAttachButtonProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const PromptInputAttachButton: React.FC<PromptInputAttachButtonProps> = ({
  onFilesSelected,
  accept,
  multiple = true,
  disabled = false,
  label = 'Attach files',
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onFilesSelected?.(files);
    }
    // Reset file input so re-selecting same file triggers change
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-label={label}
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
      />
      <Tooltip content={label}>
        <Button
          variant="ghost"
          colorRole="neutral"
          size="sm"
          disabled={disabled}
          onClick={handleClick}
          expandedTouchTarget
          aria-label={label}
          className={cn('size-8 min-h-[32px] min-w-[32px] p-0 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-state-hover', className)}
        >
          <Icon name="attach_file" size="xs" aria-hidden="true" />
        </Button>
      </Tooltip>
    </>
  );
};
PromptInputAttachButton.displayName = 'PromptInput.AttachButton';

/* -------------------------------------------------------------------------------------------------
 * Tool Toggles (e.g. Web search)
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputToolToggleProps {
  active: boolean;
  onToggle: (active: boolean) => void;
  icon?: string;
  label: string;
  activeLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const PromptInputToolToggle: React.FC<PromptInputToolToggleProps> = ({
  active,
  onToggle,
  icon = 'language',
  label,
  activeLabel,
  disabled = false,
  className,
}) => {
  return (
    <Tooltip content={active ? activeLabel || `${label} (Active)` : `Enable ${label}`}>
      <Button
        variant={active ? 'soft' : 'ghost'}
        colorRole={active ? 'primary' : 'neutral'}
        size="sm"
        disabled={disabled}
        onClick={() => onToggle(!active)}
        expandedTouchTarget
        aria-pressed={active}
        aria-label={label}
        className={cn(
          'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full transition-colors',
          active
            ? 'bg-primary-container text-on-primary-container'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover',
          className
        )}
      >
        <Icon name={icon} size="xs" aria-hidden="true" />
        <span className="hidden @sm:inline">{label}</span>
      </Button>
    </Tooltip>
  );
};
PromptInputToolToggle.displayName = 'PromptInput.ToolToggle';

/* -------------------------------------------------------------------------------------------------
 * Voice Input Toggle Button
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputVoiceToggleProps {
  isRecording?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const PromptInputVoiceToggle: React.FC<PromptInputVoiceToggleProps> = ({
  isRecording = false,
  onToggle,
  disabled = false,
  label = 'Voice input',
  className,
}) => {
  return (
    <Tooltip content={isRecording ? 'Stop recording' : label}>
      <Button
        variant={isRecording ? 'soft' : 'ghost'}
        colorRole={isRecording ? 'error' : 'neutral'}
        size="sm"
        disabled={disabled}
        onClick={onToggle}
        expandedTouchTarget
        aria-pressed={isRecording}
        aria-label={isRecording ? 'Stop recording' : label}
        className={cn(
          'h-8 min-h-[32px] px-2.5 text-xs font-semibold gap-1.5 rounded-full transition-colors',
          isRecording
            ? 'bg-error-container text-on-error-container'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover',
          className
        )}
      >
        <Icon
          name={isRecording ? 'mic' : 'mic_none'}
          size="xs"
          className={cn(isRecording && 'text-error animate-pulse motion-reduce:animate-none')}
          aria-hidden="true"
        />
        <span className="hidden @sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
      </Button>
    </Tooltip>
  );
};
PromptInputVoiceToggle.displayName = 'PromptInput.VoiceToggle';

/* -------------------------------------------------------------------------------------------------
 * Submit & Stop Buttons
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputStopProps {
  onStop?: () => void;
  label?: string;
  className?: string;
}

export const PromptInputStop: React.FC<PromptInputStopProps> = ({
  onStop,
  label = 'Stop',
  className,
}) => (
  <Tooltip content={label}>
    <Button
      variant="soft"
      colorRole="neutral"
      size="sm"
      onClick={onStop}
      expandedTouchTarget
      aria-label={label}
      className={cn(
        'size-9 min-h-[36px] min-w-[36px] p-0 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container',
        className
      )}
    >
      <span className="size-3 rounded-[2px] bg-current shrink-0" aria-hidden="true" />
    </Button>
  </Tooltip>
);
PromptInputStop.displayName = 'PromptInput.Stop';

export interface PromptInputCharacterCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  current: number;
  max?: number;
  className?: string;
}

export const PromptInputCharacterCount: React.FC<PromptInputCharacterCountProps> = ({
  current,
  max,
  className,
  ...props
}) => (
  <span
    className={cn('font-mono text-xs tabular-nums text-on-surface-variant/75 select-none', className)}
    {...props}
  >
    {current}{max ? ` / ${max}` : ''}
  </span>
);
PromptInputCharacterCount.displayName = 'PromptInput.CharacterCount';

export interface PromptInputSubmitProps {
  isLoading?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  stopLabel?: string;
  showLabel?: boolean;
  icon?: string;
  className?: string;
}

const PromptInputSubmit: React.FC<PromptInputSubmitProps> = ({
  isLoading = false,
  disabled = false,
  onStop,
  onSubmit,
  submitLabel = 'Send',
  stopLabel = 'Stop',
  showLabel = false,
  icon = 'arrow_upward',
  className,
}) => {
  if (isLoading) {
    return <PromptInputStop onStop={onStop} label={stopLabel} className={className} />;
  }

  return (
    <Tooltip content={submitLabel} disabled={disabled}>
      <Button
        variant="filled"
        colorRole="primary"
        size={showLabel ? 'md' : 'sm'}
        onClick={onSubmit}
        disabled={disabled}
        expandedTouchTarget
        aria-label={submitLabel}
        className={cn(
          showLabel
            ? 'h-9 min-h-[36px] px-3.5 rounded-full font-semibold gap-1.5 shrink-0'
            : 'size-9 min-h-[36px] min-w-[36px] p-0 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100',
          className
        )}
      >
        {showLabel && <span>{submitLabel}</span>}
        <Icon name={icon} size="sm" aria-hidden="true" />
      </Button>
    </Tooltip>
  );
};
PromptInputSubmit.displayName = 'PromptInput.Submit';

/* -------------------------------------------------------------------------------------------------
 * Full PromptInput Composite Component
 * -----------------------------------------------------------------------------------------------*/
export interface PromptInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'card' | 'ghost' | 'unboxed' | 'floating';
  floating?: boolean;
  attachments?: React.ReactNode;
  onFilesSelected?: (files: File[]) => void;
  model?: string;
  onModelChange?: (model: string) => void;
  models?: PromptInputModelOption[];
  effort?: string;
  onEffortChange?: (effort: string) => void;
  effortOptions?: PromptInputEffortOption[];
  webSearchActive?: boolean;
  onWebSearchToggle?: (active: boolean) => void;
  isRecording?: boolean;
  onVoiceToggle?: () => void;
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
      placeholder = 'Type a message...',
      isLoading = false,
      disabled = false,
      variant,
      floating,
      attachments,
      onFilesSelected,
      model,
      onModelChange,
      models,
      effort,
      onEffortChange,
      effortOptions,
      webSearchActive,
      onWebSearchToggle,
      isRecording,
      onVoiceToggle,
      actionsStart,
      actionsEnd,
      hint,
      className,
      minRows = 3,
      maxHeight = '12rem',
      submitLabel = 'Send',
      stopLabel = 'Stop',
    },
    ref
  ) => {
    const isSubmitDisabled = disabled || isLoading || !(value?.trim());
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);
    const dragDepthRef = React.useRef(0);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || isLoading || !onFilesSelected) return;
      dragDepthRef.current += 1;
      setIsDraggingOver(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isLoading && onFilesSelected) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) {
        return;
      }
      if (dragDepthRef.current === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthRef.current = 0;
      setIsDraggingOver(false);
      if (disabled || isLoading || !onFilesSelected) return;
      const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    };

    return (
      <PromptInputRoot
        variant={variant}
        floating={floating}
        disabled={disabled}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          isDraggingOver && 'border-primary outline-2 -outline-offset-1 outline-primary bg-primary-container/10',
          className
        )}
      >
        {attachments && <PromptInputAttachments>{attachments}</PromptInputAttachments>}
        <PromptInputTextarea
          ref={ref}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          onSubmit={isSubmitDisabled ? undefined : onSubmit}
          onFilesPasted={onFilesSelected}
          placeholder={placeholder}
          aria-label={placeholder || 'Message'}
          disabled={disabled || isLoading}
          minRows={minRows}
          maxHeight={maxHeight}
        />
        <PromptInputActions>
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {onFilesSelected && (
              <PromptInputAttachButton onFilesSelected={onFilesSelected} disabled={disabled || isLoading} />
            )}
            {onVoiceToggle && (
              <PromptInputVoiceToggle
                isRecording={isRecording}
                onToggle={onVoiceToggle}
                disabled={disabled || isLoading}
              />
            )}
            {model && onModelChange && (
              <PromptInputModelSelect
                model={model}
                onModelChange={onModelChange}
                models={models}
                disabled={disabled || isLoading}
              />
            )}
            {effort !== undefined && onEffortChange && (
              <PromptInputEffort
                effort={effort}
                onEffortChange={onEffortChange}
                options={effortOptions}
                disabled={disabled || isLoading}
              />
            )}
            {webSearchActive !== undefined && onWebSearchToggle && (
              <PromptInputToolToggle
                active={webSearchActive}
                onToggle={onWebSearchToggle}
                icon="language"
                label="Search"
                disabled={disabled || isLoading}
              />
            )}
            {actionsStart}
            {hint && (
              <span className="text-xs font-sans text-on-surface-variant truncate">
                {hint}
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

const PromptInputBody = PromptInputTextarea;
const PromptInputFooter = PromptInputActions;

export const PromptInput = Object.assign(PromptInputComponent, {
  Root: PromptInputRoot,
  Body: PromptInputBody,
  Footer: PromptInputFooter,
  Attachments: PromptInputAttachments,
  Attachment: Attachment,
  AttachmentGroup: AttachmentGroup,
  AttachmentMedia: AttachmentMedia,
  AttachmentContent: AttachmentContent,
  AttachmentTitle: AttachmentTitle,
  AttachmentDescription: AttachmentDescription,
  AttachmentActions: AttachmentActions,
  AttachmentAction: AttachmentAction,
  AttachmentTrigger: AttachmentTrigger,
  Textarea: PromptInputTextarea,
  Input: InputGroupInput,
  Actions: PromptInputActions,
  Action: PromptInputAction,
  Button: InputGroupButton,
  Text: PromptInputText,
  Submit: PromptInputSubmit,
  Stop: PromptInputStop,
  CharacterCount: PromptInputCharacterCount,
  ModelSelect: PromptInputModelSelect,
  Effort: PromptInputEffort,
  AttachButton: PromptInputAttachButton,
  ToolToggle: PromptInputToolToggle,
  VoiceToggle: PromptInputVoiceToggle,
});

export {
  PromptInputRoot,
  PromptInputBody,
  PromptInputFooter,
  PromptInputAttachments,
  Attachment as PromptInputAttachment,
  AttachmentGroup as PromptInputAttachmentGroup,
  AttachmentMedia as PromptInputAttachmentMedia,
  AttachmentContent as PromptInputAttachmentContent,
  AttachmentTitle as PromptInputAttachmentTitle,
  AttachmentDescription as PromptInputAttachmentDescription,
  AttachmentActions as PromptInputAttachmentActions,
  AttachmentAction as PromptInputAttachmentAction,
  AttachmentTrigger as PromptInputAttachmentTrigger,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
  PromptInputText,
  PromptInputSubmit,
  InputGroupButton as PromptInputButton,
};

export type {
  AttachmentProps as PromptInputAttachmentProps,
  AttachmentMediaProps as PromptInputAttachmentMediaProps,
  AttachmentContentProps as PromptInputAttachmentContentProps,
  AttachmentTitleProps as PromptInputAttachmentTitleProps,
  AttachmentDescriptionProps as PromptInputAttachmentDescriptionProps,
  AttachmentActionsProps as PromptInputAttachmentActionsProps,
  AttachmentActionProps as PromptInputAttachmentActionProps,
  AttachmentTriggerProps as PromptInputAttachmentTriggerProps,
  AttachmentState as PromptInputAttachmentState,
  AttachmentOrientation as PromptInputAttachmentOrientation,
  AttachmentSize as PromptInputAttachmentSize,
  InputGroupProps,
  InputGroupButtonProps as PromptInputButtonProps,
};
