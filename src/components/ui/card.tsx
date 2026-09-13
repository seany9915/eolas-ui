import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Prominence tiers for Card containers:
 * - 'default': Medium Prominence standard white card with ambient elevation.
 * - 'accent': Medium Prominence with 2px Rich Emerald border.
 * - 'inverted': High Prominence dark charcoal container with high-contrast text (canonical).
 * - 'filled': High Prominence saturated brand container for solitary milestone achievements.
 * - 'spotlight': @deprecated Use 'inverted' instead.
 */
export type CardProminence = 'default' | 'accent' | 'inverted' | 'filled' | 'spotlight';

/**
 * Affordance tiers for Card containers:
 * - 'static': Passive grouping container (no hover/press).
 * - 'actionable': Interactive click destination with hover elevation lift and focus ring (canonical).
 * - 'selectable': Accessible choice card with selection border and pressed state.
 * - 'interactive': @deprecated Use 'actionable' instead.
 */
export type CardAffordance = 'static' | 'actionable' | 'selectable' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  prominence?: CardProminence;
  affordance?: CardAffordance;
  variant?: 'default' | 'selectable' | 'filled' | 'spotlight' | 'inverted' | 'accent';
  selected?: boolean;
  colorRole?: 'primary' | 'secondary' | 'tertiary';
  /** Accent configuration for Inverted Cards ('tertiary' Sunny Amber headline/badge or 'neutral' pure white) */
  invertedAccent?: 'tertiary' | 'neutral';
  /** @deprecated Use 'invertedAccent' instead */
  spotlightAccent?: 'tertiary' | 'tertiary-full' | 'neutral';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  prominence,
  affordance,
  variant,
  selected = false,
  colorRole = 'primary',
  invertedAccent,
  spotlightAccent,
  className,
  children,
  ...props
}, ref) => {
  // Resolve resolvedProminence: prominence prop takes priority, else infer from variant, default to 'default'
  const resolvedProminence: CardProminence = prominence ?? (
    variant === 'selectable' ? 'default' : (variant ?? 'default')
  );

  // Resolve resolvedAffordance: affordance prop takes priority, else infer from variant or selectable
  const resolvedAffordance: CardAffordance = affordance ?? (
    variant === 'selectable' ? 'selectable' : 'static'
  );

  // Resolve accent: invertedAccent takes priority, fallback to deprecated spotlightAccent, default to 'tertiary'
  const resolvedAccent = invertedAccent ?? (spotlightAccent === 'neutral' ? 'neutral' : 'tertiary');

  const baseStyles = 'p-6 rounded-[1rem] transition-all relative';

  // Body copy remains pure white (text-surface) to avoid chromatic glare/fatigue; tertiary accents apply to headlines/icons
  const invertedStyles = 'bg-on-surface text-surface border-none shadow-ambient';

  const prominenceStyles: Record<CardProminence, string> = {
    default: 'bg-surface border-none text-on-surface shadow-ambient',
    accent: 'bg-surface border-[2px] border-secondary text-on-surface shadow-ambient',
    filled: colorRole === 'secondary'
      ? 'bg-secondary text-on-secondary border-none shadow-ambient'
      : colorRole === 'tertiary'
        ? 'bg-tertiary text-on-tertiary border-none shadow-ambient'
        : 'bg-primary text-on-primary border-none shadow-ambient',
    spotlight: invertedStyles,
    inverted: invertedStyles,
  };

  const isSelectable = resolvedAffordance === 'selectable';
  const isActionable = resolvedAffordance === 'actionable' || resolvedAffordance === 'interactive';

  let affordanceStyles = '';
  if (isSelectable) {
    affordanceStyles = cn(
      'cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      selected
        ? 'bg-primary-container/15 border-[2px] border-primary text-on-surface shadow-ambient'
        : 'bg-surface border-[2px] border-transparent text-on-surface shadow-ambient hover:shadow-ambient-hover hover:border-outline-variant/50'
    );
  } else if (isActionable) {
    affordanceStyles = 'cursor-pointer hover:shadow-ambient-hover active:scale-[0.99] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  } else {
    // Static: retains standard ambient hover if default, but no pointer cursor or focus ring
    affordanceStyles = resolvedProminence === 'default' ? 'hover:shadow-ambient-hover' : '';
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isSelectable && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      props.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
    props.onKeyDown?.(e);
  };

  return (
    <div
      ref={ref}
      role={isSelectable ? (props.role ?? 'button') : props.role}
      tabIndex={isSelectable || isActionable ? (props.tabIndex ?? 0) : props.tabIndex}
      aria-pressed={isSelectable ? selected : undefined}
      onKeyDown={handleKeyDown}
      className={cn(baseStyles, prominenceStyles[resolvedProminence], affordanceStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
