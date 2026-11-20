'use client';

/**
 * SuggestionChips primitive.
 *
 * Base UI Integration: Uses Base UI Button foundation.
 *
 * TAXONOMY & USAGE:
 * - Use SuggestionChips to surface starter queries, recommended clinical questions,
 *   and protocol exploration prompts.
 * - Follows DESIGN.md:
 *   - Pattern 2 chip styling (neutral surface fill, outline-variant border, hover secondary-container/40).
 *   - Never uses triple-tint monochrome styling.
 *   - WCAG 2.2 SC 2.5.8 compliant 44px minimum touch target.
 *   - Floating 2px focus ring with 2px offset.
 *   - Strictly adheres to the 5-item stagger cap if animated.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

export interface SuggestionItem {
  id?: string | number;
  label: string;
  prompt?: string;
  icon?: string;
  category?: string;
}

export interface SuggestionChipsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

const SuggestionChipsRoot = React.forwardRef<HTMLDivElement, SuggestionChipsRootProps>(
  ({ children, label, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('@container flex flex-col gap-2 w-full', className)}
        {...props}
      >
        {label && (
          <span className="text-xs font-label font-semibold text-on-surface-variant px-1 select-none">
            {label}
          </span>
        )}
        {children}
      </div>
    );
  }
);
SuggestionChipsRoot.displayName = 'SuggestionChips.Root';

export interface SuggestionChipsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  layout?: 'wrap' | 'scroll' | 'stack';
  className?: string;
}

const SuggestionChipsList = React.forwardRef<HTMLDivElement, SuggestionChipsListProps>(
  ({ children, layout = 'wrap', className, onKeyDown, ...props }, ref) => {
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const setCombinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // Maintain a single Tab stop across enabled chips via roving tabIndex.
    React.useEffect(() => {
      const root = listRef.current;
      if (!root) return;
      const allItems = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slot="suggestion-chip"]'));
      if (allItems.length === 0) return;
      const isDisabledChip = (el: HTMLButtonElement) =>
        el.disabled || el.getAttribute('aria-disabled') === 'true';

      allItems.forEach((el) => {
        if (isDisabledChip(el)) el.setAttribute('tabindex', '-1');
      });

      const enabledItems = allItems.filter((el) => !isDisabledChip(el));
      if (enabledItems.length === 0) return;

      const hasEnabledZero = enabledItems.some((el) => el.getAttribute('tabindex') === '0');
      if (!hasEnabledZero) {
        enabledItems.forEach((el, idx) => el.setAttribute('tabindex', idx === 0 ? '0' : '-1'));
      }
    }, [children]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      const root = listRef.current;
      if (!root) return;

      const items = Array.from(
        root.querySelectorAll<HTMLButtonElement>(
          '[data-slot="suggestion-chip"]:not(:disabled):not([aria-disabled="true"])'
        )
      );
      if (items.length <= 1) return;

      const active = document.activeElement as HTMLButtonElement | null;
      const currentIndex = active ? items.indexOf(active) : -1;
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = items.length - 1;
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        items.forEach((el, idx) => el.setAttribute('tabindex', idx === nextIndex ? '0' : '-1'));
        items[nextIndex]?.focus();
      }
    };

    return (
      <div
        ref={setCombinedRef}
        data-slot="suggestion-chips-list"
        onKeyDown={handleKeyDown}
        className={cn(
          layout === 'wrap' && 'flex flex-wrap gap-2',
          layout === 'scroll' && 'flex overflow-x-auto gap-2 pb-1 scrollbar-none',
          layout === 'stack' && 'flex flex-col gap-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SuggestionChipsList.displayName = 'SuggestionChips.List';

export interface SuggestionChipProps {
  suggestion?: SuggestionItem | string;
  onSelect?: (prompt: string) => void;
  onClick?: (prompt: string) => void;
  variant?: 'compact' | 'card' | 'ghost';
  showArrow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({
  suggestion = '',
  onSelect,
  onClick,
  variant = 'compact',
  showArrow = false,
  className,
  children,
}) => {
  const item: SuggestionItem =
    typeof suggestion === 'string'
      ? { label: suggestion, prompt: suggestion }
      : suggestion;

  const itemLabel = item.label || (typeof children === 'string' ? children : '');
  const itemPrompt = item.prompt || itemLabel;
  const itemIcon = item.icon;
  const accessibleLabel =
    itemLabel ||
    (typeof children === 'string' ? children : 'Suggested question');

  const handleClick = () => {
    onSelect?.(itemPrompt);
    onClick?.(itemPrompt);
  };

  if (variant === 'card') {
    return (
      <Button
        variant="unstyled"
        data-slot="suggestion-chip"
        onClick={handleClick}
        className={cn(
          'group flex items-center justify-between gap-3 w-full p-3 min-h-[44px] rounded-lg',
          'bg-surface border border-outline-variant hover:border-primary hover:bg-surface-container/60 text-start',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          className
        )}
        aria-label={`Ask: ${accessibleLabel}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {itemIcon && (
            <Icon
              name={itemIcon}
              size="sm"
              className="text-secondary group-hover:scale-105 transition-transform shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="text-sm font-sans font-medium text-on-surface truncate leading-snug">
            {children || itemLabel}
          </span>
        </div>
        <Icon
          name="arrow_forward"
          size="xs"
          directional
          className="text-on-surface-variant/60 group-hover:text-secondary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-[color,transform] motion-reduce:transform-none motion-reduce:transition-none shrink-0"
          aria-hidden="true"
        />
      </Button>
    );
  }

  if (variant === 'ghost') {
    return (
      <Button
        variant="unstyled"
        data-slot="suggestion-chip"
        onClick={handleClick}
        expandedTouchTarget
        className={cn(
          'group inline-flex items-center gap-2 px-3 py-1 h-8 rounded-full',
          'bg-transparent border-0 hover:bg-surface-container/60 text-start',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-colors duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          className
        )}
        aria-label={`Ask: ${accessibleLabel}`}
      >
        {itemIcon && (
          <Icon
            name={itemIcon}
            size="xs"
            className="text-primary group-hover:scale-105 transition-transform shrink-0"
            aria-hidden="true"
          />
        )}
        <span className="text-xs font-sans font-medium text-on-surface group-hover:text-primary transition-colors">
          {children || itemLabel}
        </span>
        {showArrow && (
          <Icon
            name="arrow_forward"
            size="xs"
            directional
            className="text-on-surface-variant/50 group-hover:text-primary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-[color,transform] motion-reduce:transform-none motion-reduce:transition-none shrink-0"
            aria-hidden="true"
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="unstyled"
      data-slot="suggestion-chip"
      onClick={handleClick}
      expandedTouchTarget
      className={cn(
        'group inline-flex items-center gap-2 px-3.5 py-1 h-8 rounded-full',
        'bg-surface border border-outline-variant hover:border-primary hover:bg-surface-container/60 text-start',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
        className
      )}
      aria-label={`Ask: ${accessibleLabel}`}
    >
      {itemIcon && (
        <Icon
          name={itemIcon}
          size="xs"
          className="text-primary group-hover:scale-105 transition-transform motion-reduce:transform-none shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="text-xs font-sans font-medium text-on-surface group-hover:text-primary transition-colors">
        {children || itemLabel}
      </span>
      {showArrow && (
        <Icon
          name="arrow_forward"
          size="xs"
          directional
          className="text-on-surface-variant/50 group-hover:text-primary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-[color,transform] motion-reduce:transform-none motion-reduce:transition-none shrink-0"
          aria-hidden="true"
        />
      )}
    </Button>
  );
};
SuggestionChip.displayName = 'SuggestionChip';

export interface SuggestionChipsProps {
  suggestions?: (SuggestionItem | string)[];
  onSelect?: (prompt: string) => void;
  label?: string;
  layout?: 'wrap' | 'scroll' | 'stack';
  variant?: 'compact' | 'card' | 'ghost';
  className?: string;
  children?: React.ReactNode;
}

const SuggestionChipsComponent: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSelect = () => {},
  label = 'Suggested prompts',
  layout = 'wrap',
  variant = 'compact',
  className,
  children,
}) => {
  if (!children && (!suggestions || suggestions.length === 0)) return null;

  return (
    <SuggestionChipsRoot label={label} className={className}>
      <SuggestionChipsList layout={layout}>
        {children ||
          suggestions?.map((item, idx) => (
            <SuggestionChip
              key={typeof item === 'string' ? item : item.id || idx}
              suggestion={item}
              onSelect={onSelect}
              variant={variant}
            />
          ))}
      </SuggestionChipsList>
    </SuggestionChipsRoot>
  );
};
SuggestionChipsComponent.displayName = 'SuggestionChips';

export interface SuggestionChipsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
}

const SuggestionChipsGroup: React.FC<SuggestionChipsGroupProps> = ({
  label,
  children,
  className,
  ...props
}) => (
  <div className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
    {label && (
      <span className="font-heading text-xs font-semibold text-on-surface-variant select-none px-0.5">
        {label}
      </span>
    )}
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);
SuggestionChipsGroup.displayName = 'SuggestionChips.Group';

export const SuggestionChips = Object.assign(SuggestionChipsComponent, {
  Root: SuggestionChipsRoot,
  List: SuggestionChipsList,
  Item: SuggestionChip,
  Chip: SuggestionChip,
  Group: SuggestionChipsGroup,
});

export {
  SuggestionChipsRoot,
  SuggestionChipsList,
  SuggestionChip,
  SuggestionChipsGroup,
  // shadcn AI Elements direct aliases
  SuggestionChips as Suggestions,
  SuggestionChip as Suggestion,
  SuggestionChipsList as SuggestionList,
  SuggestionChipsGroup as SuggestionGroup,
};
