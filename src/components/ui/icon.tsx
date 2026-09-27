import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  srLabel?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'text-base text-[16px]',
  md: 'text-lg text-[20px]',
  lg: 'text-xl text-[24px]',
  xl: 'text-2xl text-[32px]',
};

const BaseIcon = React.forwardRef<HTMLSpanElement, IconProps>(({
  name,
  size = 'lg',
  srLabel,
  className,
  ...props
}, ref) => {
  const isDecorative = !srLabel && !props['aria-label'];

  return (
    <>
      <span
        ref={ref}
        className={cn('material-symbols-outlined select-none inline-block align-middle leading-none', sizeClasses[size], className)}
        aria-hidden={isDecorative ? 'true' : undefined}
        aria-label={props['aria-label']}
        {...props}
      >
        {name}
      </span>
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </>
  );
});

BaseIcon.displayName = 'Icon';

export interface ToggleIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  active: boolean;
  onName: string;
  offName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  srLabel?: string;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

/**
 * ToggleIcon seamlessly morphs between two icon states (e.g. copy -> check, mute -> unmute)
 * using an aligned single-cell grid, avoiding layout shift and providing a calibrated cross-fade.
 */
export const ToggleIcon = React.forwardRef<HTMLSpanElement, ToggleIconProps>(({
  active,
  onName,
  offName,
  size = 'lg',
  srLabel,
  onLabel,
  offLabel,
  className,
  ...props
}, ref) => {
  const activeLabel = srLabel ?? (active ? onLabel : offLabel);
  const isDecorative = !activeLabel && !props['aria-label'];

  return (
    <span
      ref={ref}
      className={cn('inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle', className)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      <BaseIcon
        name={offName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          active
            ? 'opacity-0 scale-[0.25] blur-[var(--blur-small)] pointer-events-none'
            : 'opacity-100 scale-100 blur-0'
        )}
      />
      <BaseIcon
        name={onName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          active
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-[0.25] blur-[var(--blur-small)] pointer-events-none'
        )}
      />
      {activeLabel && <span className="sr-only">{activeLabel}</span>}
    </span>
  );
});

ToggleIcon.displayName = 'ToggleIcon';

export interface CrossFadeIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  srLabel?: string;
  className?: string;
}

/**
 * CrossFadeIcon smoothly transitions whenever the icon name changes dynamically,
 * fading out the previous symbol while scaling in the new symbol.
 */
export const CrossFadeIcon = React.forwardRef<HTMLSpanElement, CrossFadeIconProps>(({
  name,
  size = 'lg',
  srLabel,
  className,
  ...props
}, ref) => {
  const [currentName, setCurrentName] = React.useState(name);
  const [prevName, setPrevName] = React.useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (name !== currentName) {
      setPrevName(currentName);
      setCurrentName(name);
      setIsTransitioning(true);
      const timer = window.setTimeout(() => {
        setIsTransitioning(false);
        setPrevName(null);
      }, 250); // Matches --duration-fast (250ms)
      return () => window.clearTimeout(timer);
    }
  }, [name, currentName]);

  const isDecorative = !srLabel && !props['aria-label'];

  return (
    <span
      ref={ref}
      className={cn('inline-grid grid-cols-1 grid-rows-1 place-items-center select-none align-middle', className)}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={props['aria-label']}
      {...props}
    >
      {prevName && isTransitioning && (
        <BaseIcon
          name={prevName}
          size={size}
          className="col-start-1 row-start-1 opacity-0 scale-[0.25] blur-[var(--blur-small)] transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] pointer-events-none motion-reduce:transition-none"
        />
      )}
      <BaseIcon
        name={currentName}
        size={size}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-[var(--duration-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none',
          isTransitioning ? 'opacity-100 scale-100 blur-0' : 'opacity-100 scale-100 blur-0'
        )}
      />
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </span>
  );
});

CrossFadeIcon.displayName = 'CrossFadeIcon';

export const Icon = Object.assign(BaseIcon, {
  Toggle: ToggleIcon,
  CrossFade: CrossFadeIcon,
});

export default Icon;

