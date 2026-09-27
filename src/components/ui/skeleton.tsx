import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML element to render. Use 'span' for inline text placeholders. Defaults to 'div'. */
  as?: 'div' | 'span';
  className?: string;
}

/**
 * Skeleton
 *
 * Accessible loading placeholder styled with the design system's surface-variant token.
 * Uses a calm, subtle opacity pulse to communicate asynchronous state without jarring flicker.
 *
 * Complies with DESIGN.md line 566 (surface-variant toned pulse, never generic gray).
 */
export const Skeleton = React.forwardRef<HTMLElement, SkeletonProps>(
  ({ as: Component = 'div', className, ...props }, ref) => {
    return (
      <Component
        ref={ref as never}
        data-slot="skeleton"
        aria-hidden="true"
        className={cn(
          'animate-pulse rounded bg-surface-variant/70 motion-reduce:animate-none',
          Component === 'span' && 'inline-block align-middle',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether data is still loading. When true, skeleton is shown. When false, content is revealed. */
  loading: boolean;
  /** The skeleton placeholder node to show while loading */
  skeleton: React.ReactNode;
  /** Real loaded content to reveal */
  children: React.ReactNode;
  /** Duration of the cross-blur reveal in milliseconds. Defaults to 400ms (--duration-slow). */
  duration?: number;
  className?: string;
}

/**
 * SkeletonReveal
 *
 * Dual-layer cross-fade container based on transitions.dev.
 * Stacks placeholder skeleton and loaded content in the same slot.
 * When loading completes, smoothly cross-fades the skeleton to content with a 2px
 * micro-blur to eliminate layout snap.
 */
export const SkeletonReveal = React.forwardRef<HTMLDivElement, SkeletonRevealProps>(
  (
    {
      loading,
      skeleton,
      children,
      duration = 400,
      className,
      ...props
    },
    ref
  ) => {
    const id = React.useId().replace(/:/g, '');
    const containerClass = `skel-reveal-${id}`;

    return (
      <div
        ref={ref}
        data-slot="skeleton-reveal"
        className={cn('relative w-full', containerClass, className)}
        {...props}
      >
        {/* Skeleton Layer */}
        <div
          aria-hidden={!loading}
          className={cn(
            'w-full transition-[opacity,filter] duration-[var(--duration-slow)] ease-[var(--ease-in-out)] motion-reduce:transition-none',
            loading
              ? 'opacity-100 filter-none pointer-events-auto'
              : 'absolute inset-0 opacity-0 blur-[var(--blur-small,2px)] pointer-events-none'
          )}
        >
          {skeleton}
        </div>

        {/* Content Layer */}
        <div
          aria-hidden={loading}
          className={cn(
            'w-full transition-[opacity,filter] duration-[var(--duration-slow)] ease-[var(--ease-in-out)] motion-reduce:transition-none',
            loading
              ? 'absolute inset-0 opacity-0 blur-[var(--blur-small,2px)] pointer-events-none'
              : 'opacity-100 filter-none pointer-events-auto'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

SkeletonReveal.displayName = 'SkeletonReveal';

export default Object.assign(Skeleton, {
  Reveal: SkeletonReveal,
});
