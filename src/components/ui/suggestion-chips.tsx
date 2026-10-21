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
  ({ children, layout = 'wrap', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
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
  suggestion: SuggestionItem;
  onSelect: (prompt: string) => void;
  variant?: 'compact' | 'card';
  className?: string;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({
  suggestion,
  onSelect,
  variant = 'compact',
  className,
}) => {
  const handleClick = () => {
    onSelect(suggestion.prompt || suggestion.label);
  };

  if (variant === 'card') {
    return (
      <Button
        variant="unstyled"
        onClick={handleClick}
        className={cn(
          'group flex items-center justify-between gap-3 w-full p-3 min-h-[44px] rounded-lg',
          'bg-surface border border-outline-variant hover:border-secondary hover:bg-secondary-container/30 text-left',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
          className
        )}
        aria-label={`Ask: ${suggestion.label}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {suggestion.icon && (
            <Icon
              name={suggestion.icon}
              size="sm"
              className="text-secondary group-hover:scale-105 transition-transform shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="text-xs font-sans font-medium text-on-surface truncate leading-snug">
            {suggestion.label}
          </span>
        </div>
        <Icon
          name="arrow_forward"
          size="xs"
          className="text-on-surface-variant/60 group-hover:text-secondary group-hover:translate-x-0.5 transition-[color,transform] shrink-0"
          aria-hidden="true"
        />
      </Button>
    );
  }

  return (
    <Button
      variant="unstyled"
      onClick={handleClick}
      className={cn(
        'group inline-flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-md',
        'bg-surface border border-outline-variant hover:border-primary hover:bg-surface-container/60 text-left',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none cursor-pointer',
        className
      )}
      aria-label={`Ask: ${suggestion.label}`}
    >
      {suggestion.icon && (
        <Icon
          name={suggestion.icon}
          size="xs"
          className="text-primary group-hover:scale-105 transition-transform shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="text-xs font-sans font-medium text-on-surface group-hover:text-primary transition-colors">
        {suggestion.label}
      </span>
      <Icon
        name="arrow_forward"
        size="xs"
        className="text-on-surface-variant/50 group-hover:text-primary group-hover:translate-x-0.5 transition-[color,transform] shrink-0"
        aria-hidden="true"
      />
    </Button>
  );
};
SuggestionChip.displayName = 'SuggestionChip';

export interface SuggestionChipsProps {
  suggestions: SuggestionItem[];
  onSelect: (prompt: string) => void;
  label?: string;
  layout?: 'wrap' | 'scroll' | 'stack';
  variant?: 'compact' | 'card';
  className?: string;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSelect,
  label = 'Suggested Clinical Questions',
  layout = 'wrap',
  variant = 'compact',
  className,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <SuggestionChipsRoot label={label} className={className}>
      <SuggestionChipsList layout={layout}>
        {suggestions.map((item, idx) => (
          <SuggestionChip
            key={item.id || idx}
            suggestion={item}
            onSelect={onSelect}
            variant={variant}
          />
        ))}
      </SuggestionChipsList>
    </SuggestionChipsRoot>
  );
};
SuggestionChips.displayName = 'SuggestionChips';

export {
  SuggestionChipsRoot,
  SuggestionChipsList,
  SuggestionChip,
  // shadcn AI Elements direct aliases
  SuggestionChips as Suggestions,
  SuggestionChip as Suggestion,
  SuggestionChipsList as SuggestionList,
};
