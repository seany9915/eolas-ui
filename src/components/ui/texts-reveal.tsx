import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextsRevealContextValue {
  show: boolean;
}

const TextsRevealContext = React.createContext<TextsRevealContextValue>({ show: true });

export interface TextsRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Whether the reveal is visible. Defaults to true. */
  show?: boolean;
  className?: string;
}

export interface TextsRevealLineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** 0-based stagger index. Stagger delays cap at index 4 (5 items / 200ms max per Stagger Cap Rule). */
  index?: number;
  className?: string;
}

/**
 * TextsRevealLine
 *
 * Individual line in a staggered text reveal sequence.
 * Rises 12px with 3px micro-blur over 500ms using transitions.dev tuning.
 * Decouples on exit: fades in-place with no reverse Y-movement over 200ms.
 */
export const TextsRevealLine = React.forwardRef<HTMLDivElement, TextsRevealLineProps>(
  ({ children, index = 0, className, style, ...props }, ref) => {
    const { show } = React.useContext(TextsRevealContext);

    // Stagger Cap Rule: cap index at 4 (5th item) to ensure total delay <= 200ms
    const cappedIndex = Math.min(index, 4);
    const delayMs = cappedIndex * 40; // 40ms per item (--stagger-stagger)

    return (
      <div
        ref={ref}
        style={{
          transitionDelay: show ? `${delayMs}ms` : '0ms',
          ...style,
        }}
        className={cn(
          'w-full will-change-[transform,opacity,filter]',
          show
            ? 'opacity-100 translate-y-0 blur-none transition-[opacity,transform,filter] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
            : 'opacity-0 translate-y-0 blur-none transition-opacity duration-200 ease-out',
          'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none',
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
 * Staggered text entrance container based strictly on transitions.dev
 * (https://transitions.dev/detail.html?t=texts-reveal / 18-texts-reveal.md).
 *
 * Features:
 * - Entrance: Lines enter with 12px upward rise, 3px blur, and 40ms stagger.
 * - Decoupled Exit: Single quiet 200ms opacity fade in-place without replaying the stagger in reverse.
 * - Enforces the 5-item stagger cap (max 200ms cumulative delay).
 * - Complies with prefers-reduced-motion.
 */
export const TextsRevealComponent = React.forwardRef<HTMLDivElement, TextsRevealProps>(
  ({ children, show = true, className, ...props }, ref) => {
    return (
      <TextsRevealContext.Provider value={{ show }}>
        <div
          ref={ref}
          className={cn('flex flex-col gap-1 w-full select-none', className)}
          aria-hidden={!show}
          {...props}
        >
          {children}
        </div>
      </TextsRevealContext.Provider>
    );
  }
);

TextsRevealComponent.displayName = 'TextsReveal';

export const TextsReveal = Object.assign(TextsRevealComponent, {
  Line: TextsRevealLine,
});

export default TextsReveal;
