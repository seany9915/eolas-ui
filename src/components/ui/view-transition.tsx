/**
 * ViewTransition primitive (@base-ui/react/button).
 *
 * Platform Reference: Modern Web Guidance (MWG: same-document-transitions)
 *
 * TAXONOMY & USAGE:
 * - Declarative container and trigger components for the View Transitions API (document.startViewTransition).
 * - Enables smooth, GPU-accelerated morphing between states (thumbnail to hero, tab switches, list expansions).
 * - Degrades gracefully on unsupported browsers (Safari/Firefox) by running the state update immediately without errors.
 * - Enforces mandatory reduced-motion bypass and accessible focus routing to prevent screen reader disorientation.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, 44px minimum hit targets, and floating 2px focus ring.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useViewTransition, type TransitionOptions } from '@/lib/view-transitions';
import { cn } from '@/lib/utils';

export interface ViewTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique view-transition-name CSS identifier for morphing pair */
  name?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Container marking an element for shared View Transition morphing.
 */
export const ViewTransition = React.forwardRef<HTMLDivElement, ViewTransitionProps>(
  ({ name, className, style, children, ...props }, ref) => {
    const dynamicStyle: React.CSSProperties = {
      ...style,
      ...(name ? { viewTransitionName: name } : {}),
    };

    return (
      <div
        ref={ref}
        style={dynamicStyle}
        className={cn('inline-block', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ViewTransition.displayName = 'ViewTransition';

export interface ViewTransitionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  /** The state update callback to execute within document.startViewTransition */
  onTransition?: () => void | Promise<void>;
  /** Optional focus routing options once the transition completes */
  transitionOptions?: TransitionOptions;
  children: React.ReactNode;
  className?: string;
}

/**
 * Interactive trigger button/anchor wrapper executing updates inside a View Transition.
 */
export const ViewTransitionTrigger = React.forwardRef<HTMLButtonElement, ViewTransitionTriggerProps>(
  (
    {
      onTransition,
      transitionOptions,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { startTransition, isTransitioning } = useViewTransition();

    const handleClick: React.ComponentPropsWithoutRef<typeof BaseButton>['onClick'] = (e) => {
      onClick?.(e);
      if (onTransition && !e.defaultPrevented) {
        startTransition(onTransition, transitionOptions);
      }
    };

    return (
      <BaseButton
        ref={ref}
        onClick={handleClick}
        disabled={isTransitioning || props.disabled}
        className={cn(
          'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md font-label text-sm font-semibold transition-colors cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className
        )}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);
ViewTransitionTrigger.displayName = 'ViewTransitionTrigger';

export { useViewTransition };

export default ViewTransition;
