'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
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
 * - 'selectable': Accessible choice card container with selection border, surface wash, and internal [data-card-trigger] focus ring.
 * - 'link': Whole card clickable via an inner CardLink / [data-card-trigger] anchor (Good CSS #28).
 * - 'interactive': @deprecated Use 'actionable' instead.
 */
export type CardAffordance = 'static' | 'actionable' | 'selectable' | 'interactive' | 'link';

export type CardSize = 'default' | 'sm';
export type CardDensity = 'compact' | 'comfortable' | 'spacious';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  prominence?: CardProminence;
  affordance?: CardAffordance;
  variant?: 'default' | 'standard' | 'selectable' | 'filled' | 'spotlight' | 'inverted' | 'accent';
  selected?: boolean;
  colorRole?: 'primary' | 'secondary' | 'tertiary';
  size?: CardSize;
  /** Density mode ('compact' | 'comfortable' | 'spacious'). Also inherits `--density` via CSS container style queries. */
  density?: CardDensity;
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

interface CardContextValue {
  prominence: CardProminence;
  invertedAccent: 'tertiary' | 'neutral';
  isSelectable: boolean;
  selected: boolean;
}

const CardContext = React.createContext<CardContextValue>({
  prominence: 'default',
  invertedAccent: 'tertiary',
  isSelectable: false,
  selected: false,
});

const sizeStyles: Record<CardSize, string> = {
  default: 'p-[var(--density-card-padding,1.5rem)]',
  sm: 'p-4',
};

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(({
  prominence,
  affordance,
  variant,
  selected = false,
  colorRole = 'primary',
  size = 'default',
  density,
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
    'rounded-[1rem] transition-[box-shadow,border-color,background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] relative motion-reduce:transition-none has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary'
  );

  // Body copy uses warm off-white (text-on-neutral) on dark stone (bg-neutral) to avoid glare; tertiary accents apply to headlines/icons
  const invertedStyles = 'bg-neutral text-on-neutral border-0 forced-colors:border forced-colors:border-[CanvasText] shadow-ambient';

  const prominenceStyles: Record<CardProminence, string> = {
    default: 'bg-surface border-0 forced-colors:border forced-colors:border-[CanvasText] text-on-surface shadow-card',
    accent: 'bg-surface border-0 forced-colors:border forced-colors:border-[CanvasText] text-on-surface shadow-card', // @deprecated: falls back to default borderless card
    filled: colorRole === 'secondary'
      ? 'bg-secondary text-on-secondary border-0 forced-colors:border forced-colors:border-[CanvasText] shadow-ambient'
      : colorRole === 'tertiary'
        ? 'bg-tertiary text-on-tertiary border-0 forced-colors:border forced-colors:border-[CanvasText] shadow-ambient'
        : 'bg-primary text-on-primary border-0 forced-colors:border forced-colors:border-[CanvasText] shadow-ambient',
    spotlight: invertedStyles,
    inverted: invertedStyles,
  };

  const isSelectable = resolvedAffordance === 'selectable';
  const isActionable = resolvedAffordance === 'actionable' || resolvedAffordance === 'interactive';
  const isLink = resolvedAffordance === 'link';
  // Selectable cards override surface to light bg-surface/bg-primary-container, so children inherit light-surface text roles.
  const effectiveProminence: CardProminence = isSelectable ? 'default' : resolvedProminence;
  const isInverted = effectiveProminence === 'inverted' || effectiveProminence === 'spotlight';

  let affordanceStyles = '';
  if (isSelectable) {
    affordanceStyles = cn(
      'cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary',
      selected
        ? 'bg-primary-container border-[2px] border-primary forced-colors:border-[2px] forced-colors:border-[Highlight] text-on-surface shadow-card'
        : 'bg-surface border-[2px] border-transparent forced-colors:border-[2px] forced-colors:border-[CanvasText] text-on-surface shadow-card hover:shadow-ambient-hover hover:border-outline-variant/50'
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

  return (
    <CardContext.Provider
      value={{
        prominence: effectiveProminence,
        invertedAccent: resolvedAccent,
        isSelectable,
        selected,
      }}
    >
      <div
        ref={ref}
        data-slot="card"
        data-size={size}
        data-density={density}
        data-prominence={isInverted ? 'inverted' : effectiveProminence}
        data-surface={isInverted ? 'inverted' : undefined}
        data-accent={isInverted ? resolvedAccent : undefined}
        data-selected={isSelectable ? selected : undefined}
        {...props}
        style={{
          '--card-spacing': size === 'sm' ? '1rem' : '1.5rem',
          ...(density ? { '--density': density } : {}),
          ...props.style,
        } as React.CSSProperties}
        className={cn(
          baseStyles,
          prominenceStyles[resolvedProminence],
          affordanceStyles,
          subgrid && 'card-subgrid',
          className
        )}
      >
        {children}
      </div>
    </CardContext.Provider>
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
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-[[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto]',
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
  ({ className, as: Tag = 'h3', ...props }, ref) => {
    const { prominence, invertedAccent } = React.useContext(CardContext);
    const isInverted = prominence === 'inverted' || prominence === 'spotlight';
    const textTone = isInverted
      ? invertedAccent === 'neutral'
        ? 'text-surface'
        : 'text-tertiary'
      : prominence === 'filled'
        ? 'text-current'
        : 'text-on-surface';

    return (
      <Tag
        ref={ref}
        data-slot="card-title"
        className={cn(
          'min-w-0 font-heading text-lg font-semibold leading-snug tracking-tight text-balance',
          textTone,
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { prominence } = React.useContext(CardContext);
    const isInverted = prominence === 'inverted' || prominence === 'spotlight';
    const textTone = isInverted
      ? 'text-surface'
      : prominence === 'filled'
        ? 'text-current'
        : 'text-on-surface-variant';

    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn(
          'min-w-0 font-sans text-sm leading-relaxed text-pretty',
          textTone,
          className
        )}
        {...props}
      />
    );
  }
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
      className={cn('flex flex-wrap items-center pt-4 mt-auto gap-3', className)}
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

export interface CardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  children: React.ReactNode;
}

/**
 * CardTrigger primitive built on Base UI Button (@base-ui/react/button).
 * Expands the interactive button hit area to cover the entire Card container via `card-link` (::after),
 * keeping the outer `<Card>` semantic so internal headings and lists stay intact for screen readers.
 */
export const CardTrigger = React.forwardRef<HTMLButtonElement, CardTriggerProps>(
  ({ className, ...props }, ref) => {
    const { prominence, isSelectable, selected } = React.useContext(CardContext);
    const isRadio = props.role === 'radio';
    const isLightSurface = prominence === 'default' || prominence === 'accent';

    return (
      <BaseButton
        ref={ref}
        data-slot="card-trigger"
        data-card-trigger=""
        className={cn(
          'card-link text-start cursor-pointer transition-colors duration-[var(--duration-quick)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          isLightSurface ? 'hover:text-primary' : 'hover:underline underline-offset-4',
          className
        )}
        {...props}
        aria-pressed={isSelectable && !isRadio ? (props['aria-pressed'] ?? selected) : props['aria-pressed']}
        aria-checked={isRadio ? (props['aria-checked'] ?? selected) : props['aria-checked']}
      />
    );
  }
);
CardTrigger.displayName = 'CardTrigger';

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
  Link: CardLink,
  Trigger: CardTrigger,
});

export { CardComponent };

export default Card;
