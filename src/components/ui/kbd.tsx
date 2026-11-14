/**
 * Keyboard key primitive (Kbd).
 *
 * Aligned with shadcn/ui and Base UI ecosystem patterns:
 * https://ui.shadcn.com/docs/components/base/kbd
 *
 * TAXONOMY & USAGE:
 * - Use Kbd to visually represent keyboard keys, hotkeys, and shortcut combinations (e.g. ⌘K, Ctrl+B).
 * - Use KbdGroup to compose multiple keycaps together without line breaks.
 * - Ideal for embedding in buttons, command palettes, menus, and tooltips.
 * - Follows DESIGN.md tokens: Roboto Mono font (font-mono), surface-container wash,
 *   subtle outline-variant border, and strict semantic tokens.
 */
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';

export type KbdVariant = 'default' | 'outline' | 'ghost';
export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdVariantsProps {
  variant?: KbdVariant;
  size?: KbdSize;
  className?: string;
}

const variantStyles: Record<KbdVariant, string> = {
  default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant shadow-ambient',
  outline: 'bg-surface text-on-surface border border-outline shadow-ambient',
  ghost: 'bg-transparent text-on-surface-variant border-transparent',
};

const sizeStyles: Record<KbdSize, string> = {
  sm: 'h-4 min-w-4 px-1 text-xs rounded-sm',
  md: 'h-5 min-w-5 px-1.5 text-xs rounded-sm',
  lg: 'h-6 min-w-6 px-2 text-sm rounded-md',
};

export function kbdVariants({
  variant = 'default',
  size = 'md',
  className,
}: KbdVariantsProps = {}): string {
  return cn(
    'pointer-events-none inline-flex items-center justify-center gap-1 select-none font-mono font-medium leading-none align-middle',
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.md,
    className
  );
}

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    KbdVariantsProps {
  /**
   * Base UI polymorphic render slot or custom JSX element.
   */
  render?: useRender.RenderProp;
}

const KbdComponent = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant = 'default', size = 'md', render, children, ...props }, ref) => {
    const computedClass = kbdVariants({ variant, size, className });

    return useRender({
      render,
      ref,
      defaultTagName: 'kbd',
      props: {
        'data-slot': 'kbd',
        className: computedClass,
        children,
        ...props,
      },
    });
  }
);
KbdComponent.displayName = 'Kbd';

export interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Base UI polymorphic render slot.
   */
  render?: useRender.RenderProp;
}

export const KbdGroup = React.forwardRef<HTMLDivElement, KbdGroupProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'kbd-group',
        className: cn('inline-flex items-center gap-1', className),
        children,
        ...props,
      },
    });
  }
);
KbdGroup.displayName = 'KbdGroup';

export const Kbd = Object.assign(KbdComponent, {
  Group: KbdGroup,
});

export default Kbd;
