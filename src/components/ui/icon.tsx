import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  srLabel?: string;
  className?: string;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(({
  name,
  size = 'lg',
  srLabel,
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'text-base text-[16px]',
    md: 'text-lg text-[20px]',
    lg: 'text-xl text-[24px]',
    xl: 'text-2xl text-[32px]',
  };

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

Icon.displayName = 'Icon';
