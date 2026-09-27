import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextsRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether the reveal is visible. Defaults to true. */
  show?: boolean;
  className?: string;
}

export interface TextsRevealLineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** 0-based stagger index. Stagger delays cap at index 4 (5 items / 200ms max). */
  index?: number;
  className?: string;
}

/**
 * TextsRevealLine
 *
 * Individual line in a staggered text reveal sequence.
 * Rises 12px with a 3px micro-blur over 500ms.
 */
export const TextsRevealLine = React.forwardRef<HTMLDivElement, TextsRevealLineProps>(
  ({ children, index = 0, className, style, ...props }, ref) => {
    // Stagger Cap Rule: cap index at 4 (5th item) to ensure total delay <= 200ms
    const cappedIndex = Math.min(index, 4);
    const delayMs = cappedIndex * 40; // 40ms per item (--duration-stagger)

    return (
      <div
        ref={ref}
        style={{
          animationDelay: `${delayMs}ms`,
          ...style,
        }}
        className={cn(
          'w-full animate-text-reveal motion-reduce:animate-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TextsRevealLine.displayName = 'TextsRevealLine';

/**
 * TextsReveal
 *
 * Staggered text entrance container based on transitions.dev.
 * Staggers stacked headline and body copy into view with 3px micro-blur
 * and upward rise for empty states, onboarding steps, and hero summaries.
 *
 * Enforces the Stagger Cap Rule (max 5 items / 200ms max delay) to prevent UI lag.
 * Automatically strips motion under prefers-reduced-motion.
 */
export const TextsRevealComponent = React.forwardRef<HTMLDivElement, TextsRevealProps>(
  ({ children, show = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-1 w-full',
          !show && 'opacity-0 transition-opacity duration-200 ease-out',
          className
        )}
        {...props}
      >
        {children}

        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes text-reveal-rise {
  from {
    opacity: 0;
    transform: translateY(var(--distance-medium, 12px));
    filter: blur(var(--blur-medium, 3px));
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.animate-text-reveal {
  animation: text-reveal-rise var(--duration-very-slow, 500ms) var(--ease-standard, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-text-reveal {
    animation: none !important;
    transform: none !important;
    filter: none !important;
  }
}
`,
          }}
        />
      </div>
    );
  }
);

TextsRevealComponent.displayName = 'TextsReveal';

export const TextsReveal = Object.assign(TextsRevealComponent, {
  Line: TextsRevealLine,
});

export default TextsReveal;
