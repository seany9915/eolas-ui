/**
 * DeferredView primitive.
 *
 * Platform Reference: Modern Web Guidance (MWG: defer-rendering-heavy-content)
 *
 * TAXONOMY & USAGE:
 * - Defers layout and paint computations for offscreen or below-the-fold content using CSS `content-visibility: auto`.
 * - Pairs with `contain-intrinsic-size` to prevent layout shifts and scrollbar jumping.
 * - Supports 'hidden' mode for instantaneous view toggling without destroying component DOM state.
 * - Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type DeferredViewMode = 'auto' | 'hidden' | 'visible';

export interface DeferredViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optimization mode.
   * - 'auto': Skips layout and paint when scrolled offscreen.
   * - 'hidden': Keeps component in DOM with zero rendering cost (instant switching).
   * - 'visible': Standard layout rendering without deferral.
   */
  mode?: DeferredViewMode;
  /** Estimated element height for layout placeholder calculations (e.g. 200, '300px', '20rem'). Default: 200px */
  estimatedHeight?: number | string;
  /** Estimated element width for horizontal scroll calculations (optional) */
  estimatedWidth?: number | string;
  children: React.ReactNode;
  className?: string;
}

export const DeferredView = React.forwardRef<HTMLDivElement, DeferredViewProps>(
  (
    {
      mode = 'auto',
      estimatedHeight,
      estimatedWidth,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const intrinsicHeight = typeof estimatedHeight === 'number' ? `${estimatedHeight}px` : estimatedHeight;
    const intrinsicWidth = typeof estimatedWidth === 'number' ? `${estimatedWidth}px` : estimatedWidth;

    const dynamicStyle: React.CSSProperties = {
      ...style,
      ...(intrinsicHeight
        ? { containIntrinsicSize: `auto ${intrinsicWidth ?? 'none'} auto ${intrinsicHeight}` }
        : {}),
    };

    return (
      <div
        ref={ref}
        style={dynamicStyle}
        className={cn(
          mode === 'auto' && 'content-visibility-auto',
          mode === 'hidden' && 'content-visibility-hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DeferredView.displayName = 'DeferredView';

export default DeferredView;
