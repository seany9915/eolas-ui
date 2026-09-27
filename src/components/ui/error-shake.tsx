import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ErrorShakeProps extends React.HTMLAttributes<HTMLDivElement> {
  shake?: boolean | number | string;
  onShakeEnd?: () => void;
  children: React.ReactNode;
}

/**
 * ErrorShake
 *
 * Horizontal form micro-shake wrapper based on transitions.dev.
 * Subtly shakes invalid form fields or blocked actions using --distance-small (6px)
 * to draw optical attention without jarring the page or relying on color alone.
 *
 * Complies with WCAG 2.2 and automatically suppresses motion if prefers-reduced-motion is active.
 */
export const ErrorShake = React.forwardRef<HTMLDivElement, ErrorShakeProps>(
  ({ shake, onShakeEnd, className, children, ...props }, ref) => {
    const [isShaking, setIsShaking] = React.useState(false);
    const prevShakeRef = React.useRef(shake);

    React.useEffect(() => {
      if (shake && shake !== prevShakeRef.current) {
        setIsShaking(true);
        prevShakeRef.current = shake;

        const timer = setTimeout(() => {
          setIsShaking(false);
          onShakeEnd?.();
        }, 300);

        return () => clearTimeout(timer);
      }
      prevShakeRef.current = shake;
    }, [shake, onShakeEnd]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full transition-transform motion-reduce:!transform-none motion-reduce:!animation-none',
          isShaking && 'animate-error-shake',
          className
        )}
        {...props}
      >
        {children}

        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes error-shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-6px);
  }
  40%, 80% {
    transform: translateX(6px);
  }
}

.animate-error-shake {
  animation: error-shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-error-shake {
    animation: none !important;
    transform: none !important;
  }
}
`,
          }}
        />
      </div>
    );
  }
);

ErrorShake.displayName = 'ErrorShake';
