import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';


export interface ChipProps {
  label: string;
  pattern?: 'high-contrast-mixed' | 'outline-neutral-fill' | 'neutral-fill-accent-text';
  /** Legacy alias for pattern */
  emphasis?: 'high' | 'default' | 'medium' | 'low' | 'high-contrast-mixed' | 'outline-neutral-fill' | 'neutral-fill-accent-text';
  colorRole?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success';
  /** Legacy alias for colorRole */
  role?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success';
  icon?: string;
  onRemove?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  pattern,
  emphasis,
  colorRole,
  role,
  icon,
  onRemove,
  className,
}) => {
  // Backward compatibility resolution
  const resolvedColorRole = colorRole ?? role ?? 'primary';
  let resolvedPattern: 'high-contrast-mixed' | 'outline-neutral-fill' | 'neutral-fill-accent-text' = 'outline-neutral-fill';

  const rawPattern = pattern ?? emphasis;
  if (rawPattern === 'high' || rawPattern === 'high-contrast-mixed') {
    resolvedPattern = 'high-contrast-mixed';
  } else if (rawPattern === 'low' || rawPattern === 'neutral-fill-accent-text') {
    resolvedPattern = 'neutral-fill-accent-text';
  } else {
    resolvedPattern = 'outline-neutral-fill';
  }
  // Pattern 1: High-Contrast Mixed Palette (Solid fill + on-color text) - High Emphasis
  const mixedStyles = {
    primary: 'bg-primary text-on-primary border-none',
    secondary: 'bg-secondary text-on-secondary border-none',
    tertiary: 'bg-tertiary text-on-tertiary border-none',
    error: 'bg-error text-on-error border-none',
    warning: 'bg-warning text-on-warning border-none',
    success: 'bg-success text-on-success border-none',
  };

  // Pattern 2: Colored Outline + Neutral Surface Fill + Colored Text - Everyday Default
  const outlineStyles = {
    primary: 'bg-surface text-primary border-[1px] border-primary',
    secondary: 'bg-surface text-secondary border-[1px] border-secondary',
    tertiary: 'bg-tertiary text-on-tertiary border-[1px] border-tertiary', // solid fallback for Sunny Amber
    error: 'bg-surface text-error border-[1px] border-error',
    warning: 'bg-surface text-warning border-[1px] border-warning',
    success: 'bg-surface text-success border-[1px] border-success',
  };

  // Pattern 3: Soft Container Wash (bg-*-container + on-*-container) - Low/Medium Emphasis
  const neutralFillStyles = {
    primary: 'bg-primary-container text-on-primary-container border-none',
    secondary: 'bg-secondary-container text-on-secondary-container border-none',
    tertiary: 'bg-tertiary-container text-on-tertiary-container border-none',
    error: 'bg-error-container text-on-error-container border-none',
    warning: 'bg-warning-container text-on-warning-container border-none',
    success: 'bg-success-container text-on-success-container border-none',
  };

  const patternClass = resolvedPattern === 'high-contrast-mixed'
    ? mixedStyles[resolvedColorRole]
    : resolvedPattern === 'outline-neutral-fill'
      ? outlineStyles[resolvedColorRole]
      : neutralFillStyles[resolvedColorRole];

  // WCAG 2.2 SC 2.5.8 Target Size: Expand to 44px (min-h-[44px]) when interactive (onRemove)
  const touchTargetClass = onRemove ? 'min-h-[44px]' : 'min-h-[36px]';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-xs font-semibold select-none transition-[color,background-color,border-color,transform] duration-[var(--duration-quick)] ease-[var(--ease-standard)] active:scale-[0.97]',
        touchTargetClass,
        patternClass,
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
      {onRemove && (
        <BaseButton
          onClick={onRemove}
          className="ml-1 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer inline-flex items-center justify-center p-0.5 rounded-full"
          aria-label={`Remove ${label}`}
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
        </BaseButton>
      )}
    </div>
  );
};
