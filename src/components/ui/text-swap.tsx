import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextSwapProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The current text or string value to display */
  children: React.ReactNode;
  /** Custom duration in milliseconds. Defaults to 150ms (--duration-quick). */
  duration?: number;
  className?: string;
}

/**
 * TextSwap
 *
 * Micro-transition for in-place text state changes based on transitions.dev.
 * When children/text changes (e.g. "Save" -> "Saved", "Syncing..." -> "Synced"),
 * the departing text slides upward 4px with a 2px micro-blur and fades,
 * while incoming text rises seamlessly into place.
 *
 * Prevents layout-width thrash inside buttons, chips, and status badges.
 * Automatically falls back to an instant swap when prefers-reduced-motion is active.
 */
export const TextSwap = React.forwardRef<HTMLSpanElement, TextSwapProps>(
  ({ children, duration = 150, className, ...props }, ref) => {
    const [currentText, setCurrentText] = React.useState(children);
    const [prevText, setPrevText] = React.useState<React.ReactNode | null>(null);
    const [isExiting, setIsExiting] = React.useState(false);
    const currentRef = React.useRef(children);

    React.useEffect(() => {
      if (children !== currentRef.current) {
        setPrevText(currentRef.current);
        setCurrentText(children);
        currentRef.current = children;
        setIsExiting(true);

        const timer = window.setTimeout(() => {
          setIsExiting(false);
          setPrevText(null);
        }, duration);

        return () => window.clearTimeout(timer);
      }
    }, [children, duration]);

    return (
      <span
        ref={ref}
        className={cn(
          'inline-grid grid-cols-1 grid-rows-1 place-items-center align-middle overflow-hidden select-none',
          className
        )}
        {...props}
      >
        {isExiting && prevText !== null && (
          <span
            aria-hidden="true"
            className="col-start-1 row-start-1 opacity-0 -translate-y-2 blur-[var(--blur-small,2px)] transition-[opacity,transform,filter] ease-[var(--ease-standard)] motion-reduce:transition-none pointer-events-none"
            style={{ transitionDuration: `${duration}ms` }}
          >
            {prevText}
          </span>
        )}
        <span
          className={cn(
            'col-start-1 row-start-1 transition-[opacity,transform] ease-[var(--ease-standard)] motion-reduce:transition-none',
            isExiting
              ? 'opacity-0 translate-y-1'
              : 'opacity-100 translate-y-0'
          )}
          style={{ transitionDuration: `${duration}ms` }}
        >
          {currentText}
        </span>
      </span>
    );
  }
);

TextSwap.displayName = 'TextSwap';

export default TextSwap;
