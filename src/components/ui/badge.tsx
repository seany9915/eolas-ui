/**
 * Badge primitive.
 *
 * Aligned with shadcn/ui and Base UI ecosystem patterns:
 * https://ui.shadcn.com/docs/components/base/badge
 *
 * TAXONOMY & USAGE:
 * - Use Badge for PASSIVE, non-interactive status indicators, counts, categories, or labels.
 * - Do NOT use Badge for interactive filters, toggles, or removable tags (use Chip instead).
 * - Implements DESIGN.md High-Contrast Accessible standards:
 *   - Pattern 1 (filled): Solid brand fill + high-contrast on-color text.
 *   - Pattern 2 (outline): 1px border in color role + neutral white surface fill + colored text.
 *   - Pattern 3 (soft): Soft container wash (bg-*-container) + dark neutral charcoal text (on-*-container).
 * - Never uses the banned triple-tint monochrome pattern (light tint + same-hue border + same-hue text).
 * - Full WCAG 2.2 AA contrast compliance.
 * - Polymorphic composition powered by Base UI's `useRender` hook.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'filled'
  | 'outline'
  | 'soft'
  | 'tonal' // backwards-compatible alias for soft
  | 'default' // shadcn alias for filled
  | 'secondary' // shadcn alias for outline
  | 'destructive'; // shadcn alias for error

export type BadgeColorRole =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'warning'
  | 'success'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'pill' | 'rounded';

export interface BadgeVariantsProps {
  variant?: BadgeVariant;
  colorRole?: BadgeColorRole;
  size?: BadgeSize;
  shape?: BadgeShape;
  className?: string;
}

const filledStyles: Record<BadgeColorRole, string> = {
  primary: 'bg-primary text-on-primary border-transparent',
  secondary: 'bg-secondary text-on-secondary border-transparent',
  tertiary: 'bg-tertiary text-on-tertiary border-transparent', // Charcoal text on Sunny Amber (AAA 8.55:1)
  error: 'bg-error text-on-error border-transparent',
  warning: 'bg-warning text-on-warning border-transparent',
  success: 'bg-success text-on-success border-transparent',
  neutral: 'bg-neutral text-on-neutral border-transparent',
};

const outlineStyles: Record<BadgeColorRole, string> = {
  primary: 'bg-surface text-primary border border-primary',
  secondary: 'bg-surface text-secondary border border-secondary',
  tertiary: 'bg-tertiary text-on-tertiary border border-tertiary', // Fallback to filled for contrast
  error: 'bg-surface text-error border border-error',
  warning: 'bg-surface text-warning border border-warning',
  success: 'bg-surface text-success border border-success',
  neutral: 'bg-surface text-on-surface border border-outline',
};

const softStyles: Record<BadgeColorRole, string> = {
  primary: 'bg-primary-container text-on-primary-container border-transparent',
  secondary: 'bg-secondary-container text-on-secondary-container border-transparent',
  tertiary: 'bg-tertiary-container text-on-tertiary-container border-transparent',
  error: 'bg-error-container text-on-error-container border-transparent',
  warning: 'bg-warning-container text-on-warning-container border-transparent',
  success: 'bg-success-container text-on-success-container border-transparent',
  neutral: 'bg-neutral-container text-on-neutral-container border-transparent',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-[11px] leading-none gap-1 [&>svg]:size-3 [&>[data-icon]]:size-3 [&_.material-symbols-outlined]:!text-[13px] [&_.material-symbols-outlined]:!leading-none',
  md: 'h-6 px-2.5 text-xs leading-none gap-1.5 [&>svg]:size-3.5 [&>[data-icon]]:size-3.5 [&_.material-symbols-outlined]:!text-[15px] [&_.material-symbols-outlined]:!leading-none',
  lg: 'h-7 px-3 text-sm leading-none gap-2 [&>svg]:size-4 [&>[data-icon]]:size-4 [&_.material-symbols-outlined]:!text-[17px] [&_.material-symbols-outlined]:!leading-none',
};

export function badgeVariants({
  variant = 'outline',
  colorRole = 'primary',
  size = 'md',
  shape = 'pill',
  className,
}: BadgeVariantsProps = {}): string {
  // Normalize shadcn and legacy aliases
  let resolvedColorRole: BadgeColorRole = colorRole;
  let normalizedVariant: 'filled' | 'outline' | 'soft' = 'outline';

  if (variant === 'destructive') {
    resolvedColorRole = 'error';
    normalizedVariant = 'filled';
  } else if (variant === 'default' || variant === 'filled') {
    normalizedVariant = 'filled';
  } else if (variant === 'soft' || variant === 'tonal') {
    normalizedVariant = 'soft';
  } else {
    normalizedVariant = 'outline';
  }

  // Tertiary amber cannot outline on light backgrounds
  if (resolvedColorRole === 'tertiary' && normalizedVariant === 'outline') {
    normalizedVariant = 'filled';
  }

  const variantClass =
    normalizedVariant === 'filled'
      ? filledStyles[resolvedColorRole]
      : normalizedVariant === 'soft'
        ? softStyles[resolvedColorRole]
        : outlineStyles[resolvedColorRole];

  return cn(
    'inline-flex items-center justify-center font-label font-semibold select-none shrink-0 whitespace-nowrap',
    '[&_.material-symbols-outlined]:leading-none [&_.material-symbols-outlined]:shrink-0',
    shape === 'pill' ? 'rounded-full' : 'rounded-sm',
    sizeStyles[size],
    variantClass,
    className
  );
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  colorRole?: BadgeColorRole;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: string | React.ReactNode;
  dot?: boolean;
  /**
   * Base UI composition prop. Replaces the component's HTML element
   * with another tag or component (e.g. `<Badge render={<a href="..." />} />`).
   */
  render?: useRender.RenderProp;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'outline',
      colorRole = 'primary',
      size = 'md',
      shape = 'pill',
      icon,
      dot = false,
      render,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const computedClass = badgeVariants({
      variant,
      colorRole,
      size,
      shape,
      className,
    });

    const content = (
      <>
        {dot && (
          <span
            data-icon="dot"
            className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              variant === 'filled' ? 'bg-current opacity-80' : 'bg-current'
            )}
            aria-hidden="true"
          />
        )}
        {typeof icon === 'string' ? (
          <span
            data-icon="inline-start"
            className="material-symbols-outlined !text-[1.15em] !leading-none inline-flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : (
          icon && (
            <span
              data-icon="inline-start"
              className="inline-flex items-center justify-center shrink-0"
            >
              {icon}
            </span>
          )
        )}
        <span>{children}</span>
      </>
    );

    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'badge',
        className: computedClass,
        children: content,
        ...props,
      },
    });
  }
);
Badge.displayName = 'Badge';

export default Badge;
