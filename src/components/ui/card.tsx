import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Prominence tiers for Card containers:
 * - 'default': Medium Prominence standard white card with ambient elevation (canonical).
 * - 'inverted': High Prominence dark charcoal container with high-contrast text.
 * - 'filled': High Prominence saturated brand container for solitary milestone achievements.
 * - 'accent': @deprecated Use 'default' with an internal <Badge colorRole="secondary"> or <ClinicianTip />.
 * - 'spotlight': @deprecated Use 'inverted' instead.
 */
export type CardProminence = 'default' | 'inverted' | 'filled' | 'accent' | 'spotlight';

/**
 * Affordance tiers for Card containers:
 * - 'static': Passive grouping container (no hover/press).
 * - 'actionable': Interactive click destination with hover elevation lift and focus ring (canonical).
 * - 'selectable': Accessible choice card with selection border and pressed state.
 * - 'link': Whole card clickable via an inner CardLink / [data-card-trigger] anchor (Good CSS #28).
 * - 'interactive': @deprecated Use 'actionable' instead.
 */
export type CardAffordance = 'static' | 'actionable' | 'selectable' | 'interactive' | 'link';

export type CardSize = 'default' | 'sm';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  prominence?: CardProminence;
  affordance?: CardAffordance;
  variant?: 'default' | 'standard' | 'selectable' | 'filled' | 'spotlight' | 'inverted' | 'accent';
  selected?: boolean;
  colorRole?: 'primary' | 'secondary' | 'tertiary';
  size?: CardSize;
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

const sizeStyles: Record<CardSize, string> = {
  default: 'p-6',
  sm: 'p-4',
};

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(({
  prominence,
  affordance,
  variant,
  selected = false,
  colorRole = 'primary',
  size = 'default',
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

  const baseStyles = cn(
    sizeStyles[size] ?? sizeStyles.default,
    'rounded-[1rem] transition-[box-shadow,border-color,background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] relative motion-reduce:transition-none'
  );

  // Body copy remains pure white (text-surface) to avoid chromatic glare/fatigue; tertiary accents apply to headlines/icons
  const invertedStyles = 'bg-on-surface text-surface border-none shadow-ambient';

  const prominenceStyles: Record<CardProminence, string> = {
    default: 'bg-surface border border-transparent text-on-surface shadow-card',
    accent: 'bg-surface border border-transparent text-on-surface shadow-card', // @deprecated: falls back to default borderless card
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
    // Static cards are passive: no hover lift, cursor or focus ring.
    affordanceStyles = '';
  }

  const { onKeyDown, ...restProps } = props;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.target !== e.currentTarget) return;
    if (isSelectable && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  const isRadio = props.role === 'radio';
  const role = isSelectable ? (props.role ?? 'button') : props.role;
  const ariaPressed = isSelectable && !isRadio ? (props['aria-pressed'] ?? selected) : props['aria-pressed'];
  const ariaChecked = isRadio ? (props['aria-checked'] ?? selected) : props['aria-checked'];
  const tabIndex = props.tabIndex !== undefined ? props.tabIndex : (isSelectable ? 0 : undefined);

  return (
    <div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      data-slot="card"
      data-size={size}
      aria-pressed={ariaPressed}
      aria-checked={ariaChecked}
      style={{
        '--card-spacing': size === 'sm' ? '1rem' : '1.5rem',
        ...props.style,
      } as React.CSSProperties}
      className={cn(
        baseStyles,
        prominenceStyles[resolvedProminence],
        affordanceStyles,
        subgrid && 'card-subgrid',
        className
      )}
      {...restProps}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
});

CardComponent.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag
      ref={ref}
      data-slot="card-title"
      className={cn(
        'font-heading text-lg font-semibold text-on-surface leading-snug tracking-tight text-balance',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(
        'font-sans text-sm text-on-surface-variant leading-relaxed text-pretty',
        className
      )}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn('col-start-2 row-start-1 row-span-2 self-start justify-self-end', className)}
      {...props}
    />
  )
);
CardAction.displayName = 'CardAction';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('pt-4', className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex items-center pt-4 mt-auto gap-3', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

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
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
  Link: CardLink,
});

export { CardComponent };

export default Card;
