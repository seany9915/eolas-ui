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
 * - 'link': Whole card clickable via an inner CardLink / [data-card-trigger] anchor (Good CSS #28).
 * - 'interactive': @deprecated Use 'actionable' instead.
 */
export type CardAffordance = 'static' | 'actionable' | 'selectable' | 'interactive' | 'link';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  prominence?: CardProminence;
  affordance?: CardAffordance;
  variant?: 'default' | 'standard' | 'selectable' | 'filled' | 'spotlight' | 'inverted' | 'accent';
  selected?: boolean;
  colorRole?: 'primary' | 'secondary' | 'tertiary';
  /**
   * When true, adopts CSS Subgrid row tracks (grid-row: span 3; grid-template-rows: subgrid)
   * to align header, content body, and action footer rows across cards in a grid.
   * Platform Reference: Good CSS #09.
   */
  subgrid?: boolean;
  /**
   * When true, uses compositor-only opacity shadow crossfade (card-lift) on hover lift
   * rather than repainting box-shadow on every frame.
   * Platform Reference: Good CSS #35.
   */
  lift?: boolean;
  /** Accent configuration for Inverted Cards ('tertiary' Sunny Amber headline/badge or 'neutral' pure white) */
  invertedAccent?: 'tertiary' | 'neutral';
  /** @deprecated Use 'invertedAccent' instead */
  spotlightAccent?: 'tertiary' | 'tertiary-full' | 'neutral';
  children: React.ReactNode;
}

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(({
  prominence,
  affordance,
  variant,
  selected = false,
  colorRole = 'primary',
  subgrid = false,
  lift = false,
  invertedAccent,
  spotlightAccent,
  className,
  children,
  ...props
}, ref) => {
  // Resolve resolvedProminence: prominence prop takes priority, else infer from variant, default to 'default'
  const resolvedProminence: CardProminence = prominence ?? (
    variant === 'selectable' || variant === 'standard' ? 'default' : (variant ?? 'default')
  );

  // Resolve resolvedAffordance: affordance prop takes priority, else infer from variant or selectable
  const resolvedAffordance: CardAffordance = affordance ?? (
    variant === 'selectable' ? 'selectable' : 'static'
  );

  // Resolve accent: invertedAccent takes priority, fallback to deprecated spotlightAccent, default to 'tertiary'
  const resolvedAccent = invertedAccent ?? (spotlightAccent === 'neutral' ? 'neutral' : 'tertiary');

  const baseStyles = 'p-6 rounded-[1rem] transition-[box-shadow,border-color,background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] relative motion-reduce:transition-none';

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
  const isLink = resolvedAffordance === 'link';

  let affordanceStyles = '';
  if (isSelectable) {
    affordanceStyles = cn(
      'cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary',
      selected
        ? 'bg-primary-container border-[2px] border-primary text-on-surface shadow-ambient'
        : 'bg-surface border-[2px] border-transparent text-on-surface shadow-ambient hover:shadow-ambient-hover hover:border-outline-variant/50'
    );
  } else if (isActionable) {
    affordanceStyles = cn(
      'cursor-pointer active:scale-[0.99] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary',
      lift ? 'card-lift shadow-none' : 'hover:shadow-ambient-hover'
    );
  } else if (isLink) {
    affordanceStyles = cn(
      'cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary',
      lift ? 'card-lift shadow-none' : 'hover:shadow-ambient-hover'
    );
  } else {
    // Static: retains standard ambient hover if default, but no pointer cursor or focus ring
    affordanceStyles = resolvedProminence === 'default'
      ? (lift ? 'card-lift shadow-none' : 'hover:shadow-ambient-hover')
      : '';
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isSelectable && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      e.currentTarget.click();
    }
    props.onKeyDown?.(e);
  };

  const isRadio = props.role === 'radio';
  const role = isSelectable ? (props.role ?? 'button') : props.role;
  const ariaPressed = isSelectable && !isRadio ? (props['aria-pressed'] ?? selected) : props['aria-pressed'];
  const ariaChecked = isRadio ? (props['aria-checked'] ?? selected) : props['aria-checked'];
  const tabIndex = props.tabIndex !== undefined ? props.tabIndex : (isSelectable || isActionable ? 0 : undefined);

  return (
    <div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      aria-pressed={ariaPressed}
      aria-checked={ariaChecked}
      onKeyDown={handleKeyDown}
      className={cn(
        baseStyles,
        prominenceStyles[resolvedProminence],
        affordanceStyles,
        subgrid && 'card-subgrid',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardComponent.displayName = 'Card';

export interface CardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

/**
 * CardLink primitive implementing the Heydon Pickering Inclusive Card pattern (Good CSS #28).
 * Expands the clickable hit area of an anchor to cover the entire Card container via ::after,
 * while ensuring screen readers announce only the link text and nested buttons remain clickable.
 */
export const CardLink = React.forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      data-card-trigger=""
      className={cn('card-link focus:outline-none', className)}
      {...props}
    />
  )
);
CardLink.displayName = 'CardLink';

export const Card = Object.assign(CardComponent, {
  Link: CardLink,
});
