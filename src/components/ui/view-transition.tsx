'use client';

/**
 * ViewTransition primitive (@base-ui/react/button).
 *
 * Platform Reference: Modern Web Guidance (MWG: same-document-transitions)
 *
 * TAXONOMY & USAGE:
 * - Declarative container and trigger components for the View Transitions API (document.startViewTransition).
 * - Enables smooth, GPU-accelerated morphing between states (thumbnail to hero, tab switches, list expansions).
 * - Degrades gracefully on unsupported browsers (feature-detected) by running the state update immediately without errors.
 * - Bypasses the animation under prefers-reduced-motion and offers opt-in focus routing (focusTarget) to prevent screen reader disorientation.
 * - Follows DESIGN.md Tier B interactive controls: concentric radius, 44px minimum hit targets, and floating 2px focus ring.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import {
  useViewTransition,
  startScopedViewTransition,
  type TransitionOptions,
} from '@/lib/view-transitions';
import { cn } from '@/lib/utils';

type NativeViewTransitionProps = React.ViewTransitionProps;

export interface ViewTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique view-transition-name CSS identifier for morphing pair */
  name?: string;
  /** Optional React 19 ViewTransition class override for default transitions */
  defaultTransition?: NativeViewTransitionProps['default'];
  /** Optional React 19 ViewTransition class override on enter */
  enter?: NativeViewTransitionProps['enter'];
  /** Optional React 19 ViewTransition class override on exit */
  exit?: NativeViewTransitionProps['exit'];
  /** Optional React 19 ViewTransition class override on update */
  update?: NativeViewTransitionProps['update'];
  /** Optional React 19 ViewTransition class override on shared element transitions */
  share?: NativeViewTransitionProps['share'];
  /** Optional React 19 ViewTransition lifecycle callbacks */
  onEnter?: NativeViewTransitionProps['onEnter'];
  onExit?: NativeViewTransitionProps['onExit'];
  onUpdate?: NativeViewTransitionProps['onUpdate'];
  onShare?: NativeViewTransitionProps['onShare'];
  children: React.ReactNode;
  className?: string;
}

const NativeViewTransition = React.ViewTransition;

/**
 * Container marking an element for shared View Transition morphing.
 * Leverages React 19's native `<React.ViewTransition>` when available while
 * preserving block/flex/grid layout semantics (no forced `inline-block`) and
 * full backward compatibility with imperative `document.startViewTransition`.
 */
export const ViewTransition = React.forwardRef<HTMLDivElement, ViewTransitionProps>(
  (
    {
      name,
      defaultTransition,
      enter,
      exit,
      update,
      share,
      onEnter,
      onExit,
      onUpdate,
      onShare,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const dynamicStyle: React.CSSProperties | undefined =
      style || name
        ? {
            ...style,
            ...(name ? { viewTransitionName: name } : {}),
          }
        : undefined;

    const wrapped = (
      <div
        ref={ref}
        style={dynamicStyle}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    );

    if (NativeViewTransition) {
      return (
        <NativeViewTransition
          name={name}
          default={defaultTransition}
          enter={enter}
          exit={exit}
          update={update}
          share={share}
          onEnter={onEnter}
          onExit={onExit}
          onUpdate={onUpdate}
          onShare={onShare}
        >
          {wrapped}
        </NativeViewTransition>
      );
    }

    return wrapped;
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
 * Interactive button executing updates inside a View Transition.
 */
export const ViewTransitionTrigger = React.forwardRef<HTMLButtonElement, ViewTransitionTriggerProps>(
  (
    {
      onTransition,
      transitionOptions,
      onClick,
      disabled,
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
        startTransition(onTransition, transitionOptions).catch((error) => {
          console.error('View transition update failed:', error);
        });
      }
    };

    return (
      <BaseButton
        ref={ref}
        {...props}
        onClick={handleClick}
        disabled={disabled || isTransitioning}
        focusableWhenDisabled
        aria-busy={isTransitioning || undefined}
        className={cn(
          'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded font-label text-sm font-semibold transition-colors cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className
        )}
      >
        {children}
      </BaseButton>
    );
  }
);
ViewTransitionTrigger.displayName = 'ViewTransitionTrigger';

export { useViewTransition, startScopedViewTransition };

export default ViewTransition;
