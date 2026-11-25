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
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const SuggestionChipsRoot = React.forwardRef<HTMLDivElement, SuggestionChipsRootProps>(
  ({ children, label, align = 'start', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          '@container flex flex-col gap-2 w-full',
          align === 'center' && 'items-center',
          align === 'end' && 'items-end',
          className
        )}
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

export type SuggestionChipsLayout = 'wrap' | 'scroll' | 'stack' | 'responsive';

const SuggestionChipsListContext = React.createContext<SuggestionChipsLayout>('wrap');

export interface SuggestionChipsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  layout?: SuggestionChipsLayout;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const SuggestionChipsList = React.forwardRef<HTMLDivElement, SuggestionChipsListProps>(
  ({ children, layout = 'wrap', align = 'start', className, onKeyDown, ...props }, ref) => {
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
      const isRtl = getComputedStyle(root).direction === 'rtl';
      if (e.key === 'ArrowRight') {
        nextIndex = isRtl
          ? (currentIndex - 1 + items.length) % items.length
          : (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = isRtl
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowUp') {
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
      <SuggestionChipsListContext.Provider value={layout}>
        <div
          ref={setCombinedRef}
          data-slot="suggestion-chips-list"
          data-layout={layout}
          onKeyDown={handleKeyDown}
          className={cn(
            layout === 'wrap' && 'flex flex-wrap gap-x-2 gap-y-3',
            layout === 'scroll' && 'flex overflow-x-auto gap-2 py-1.5 -my-1.5 px-1 -mx-1 scrollbar-none max-w-full',
            layout === 'responsive' &&
              'flex overflow-x-auto gap-x-2 gap-y-3 py-1.5 -my-1.5 px-1 -mx-1 scrollbar-none max-w-full @sm:flex-wrap @sm:overflow-visible @sm:py-0 @sm:my-0 @sm:px-0 @sm:mx-0',
            layout === 'stack' && 'flex flex-col gap-2',
            layout !== 'stack' && align === 'center' && 'justify-center',
            layout !== 'stack' && align === 'end' && 'justify-end',
            layout === 'stack' && align === 'center' && 'items-center',
            layout === 'stack' && align === 'end' && 'items-end',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SuggestionChipsListContext.Provider>
    );
  }
);
SuggestionChipsList.displayName = 'SuggestionChips.List';

export interface SuggestionChipProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onSelect' | 'onClick' | 'variant' | 'children'> {
  suggestion?: SuggestionItem | string;
  onSelect?: (prompt: string) => void;
  onClick?: (prompt: string) => void;
  variant?: 'compact' | 'card' | 'ghost';
  showArrow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SuggestionChip = React.forwardRef<HTMLButtonElement, SuggestionChipProps>(
  (
    {
      suggestion = '',
      onSelect,
      onClick,
      variant = 'compact',
      showArrow = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
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

    const listLayout = React.useContext(SuggestionChipsListContext);
    const isScrollLayout = listLayout === 'scroll';
    const isResponsiveLayout = listLayout === 'responsive';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const listContainer = e.currentTarget.closest('[data-slot="suggestion-chips-list"]');
      if (listContainer) {
        const items = listContainer.querySelectorAll<HTMLButtonElement>(
          '[data-slot="suggestion-chip"]:not(:disabled)'
        );
        items.forEach((el) => el.setAttribute('tabindex', el === e.currentTarget ? '0' : '-1'));
      }
      onSelect?.(itemPrompt);
      onClick?.(itemPrompt);
    };

    if (variant === 'card') {
      return (
        <Button
          ref={ref}
          variant="unstyled"
          data-slot="suggestion-chip"
          onClick={handleClick}
          className={cn(
            'group flex items-center justify-between gap-3 w-full p-3 min-h-[44px] rounded-lg',
            isScrollLayout && 'shrink-0 w-max max-w-full',
            isResponsiveLayout && '@max-sm:shrink-0 @max-sm:w-max max-w-full',
            'bg-surface border border-outline-variant hover:border-primary hover:bg-state-hover text-start',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
            className
          )}
          aria-label={accessibleLabel}
          {...props}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            {itemIcon && (
              <Icon
                name={itemIcon}
                size="sm"
                className="text-secondary group-hover:scale-105 transition-transform motion-reduce:transform-none motion-reduce:transition-none shrink-0"
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-sans font-medium text-on-surface truncate leading-snug">
              {children || itemLabel}
            </span>
          </span>
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
          ref={ref}
          variant="unstyled"
          data-slot="suggestion-chip"
          onClick={handleClick}
          expandedTouchTarget
          className={cn(
            'group inline-flex items-center gap-2 px-3 py-1.5 min-h-8 h-auto rounded-full',
            isScrollLayout
              ? 'shrink-0 whitespace-nowrap'
              : isResponsiveLayout
                ? '@max-sm:shrink-0 @max-sm:whitespace-nowrap @sm:max-w-full'
                : 'max-w-full',
            'bg-transparent border-0 hover:bg-state-hover text-start',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'transition-colors duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
            className
          )}
          aria-label={accessibleLabel}
          {...props}
        >
          {itemIcon && (
            <Icon
              name={itemIcon}
              size="xs"
              className="text-primary group-hover:scale-105 transition-transform motion-reduce:transform-none motion-reduce:transition-none shrink-0"
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              'text-xs font-sans font-medium text-on-surface group-hover:text-primary transition-colors motion-reduce:transition-none',
              !isScrollLayout && (isResponsiveLayout ? '@sm:min-w-0 @sm:break-words' : 'min-w-0 break-words')
            )}
          >
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
        ref={ref}
        variant="unstyled"
        data-slot="suggestion-chip"
        onClick={handleClick}
        expandedTouchTarget
        className={cn(
          'group inline-flex items-center gap-2 px-3.5 py-1.5 min-h-8 h-auto rounded-full',
          isScrollLayout
            ? 'shrink-0 whitespace-nowrap'
            : isResponsiveLayout
              ? '@max-sm:shrink-0 @max-sm:whitespace-nowrap @sm:max-w-full'
              : 'max-w-full',
          'bg-surface border border-outline-variant hover:border-primary hover:bg-state-hover text-start',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          className
        )}
        aria-label={accessibleLabel}
        {...props}
      >
        {itemIcon && (
          <Icon
            name={itemIcon}
            size="xs"
            className="text-primary group-hover:scale-105 transition-transform motion-reduce:transform-none motion-reduce:transition-none shrink-0"
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            'text-xs font-sans font-medium text-on-surface group-hover:text-primary transition-colors motion-reduce:transition-none',
            !isScrollLayout && (isResponsiveLayout ? '@sm:min-w-0 @sm:break-words' : 'min-w-0 break-words')
          )}
        >
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
);
SuggestionChip.displayName = 'SuggestionChip';

export interface SuggestionChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  suggestions?: (SuggestionItem | string)[];
  onSelect?: (prompt: string) => void;
  label?: string;
  layout?: SuggestionChipsLayout;
  align?: 'start' | 'center' | 'end';
  variant?: 'compact' | 'card' | 'ghost';
  className?: string;
  children?: React.ReactNode;
}

const SuggestionChipsComponent = React.forwardRef<HTMLDivElement, SuggestionChipsProps>(
  (
    {
      suggestions,
      onSelect = () => {},
      label = 'Suggested prompts',
      layout = 'wrap',
      align = 'start',
      variant = 'compact',
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (!children && (!suggestions || suggestions.length === 0)) return null;

    return (
      <SuggestionChipsRoot ref={ref} label={label} align={align} className={className} {...props}>
        <SuggestionChipsList layout={layout} align={align}>
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
  }
);
SuggestionChipsComponent.displayName = 'SuggestionChips';

export interface SuggestionChipsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
}

const SuggestionChipsGroup = React.forwardRef<HTMLDivElement, SuggestionChipsGroupProps>(
  ({ label, children, className, ...props }, ref) => (
    <div ref={ref} data-slot="suggestion-chips-group" className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
      {label && (
        <span className="font-heading text-xs font-semibold text-on-surface-variant select-none px-0.5">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-x-2 gap-y-3">{children}</div>
    </div>
  )
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
