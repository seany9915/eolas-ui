import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconProps } from './icon';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  iconProps?: Partial<IconProps>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, iconProps, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={title || 'No data available'}
        className={cn(
          '@container flex flex-col items-center justify-center text-center p-8 @sm:p-12 rounded-lg bg-surface border border-dashed border-outline-variant max-w-2xl mx-auto my-4',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
            <Icon name={icon} size="xl" {...iconProps} />
          </div>
        )}
        {title && (
          <h3 className="font-heading text-headline-sm font-semibold text-on-surface mb-2" style={{ textWrap: 'balance' }}>
            {title}
          </h3>
        )}
        {description && (
          <p className="font-sans text-body-md text-on-surface-variant max-w-md mb-6" style={{ textWrap: 'pretty' }}>
            {description}
          </p>
        )}
        {action && <div className="flex flex-wrap items-center justify-center gap-3">{action}</div>}
        {children}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export const EmptyStateIcon = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container text-on-surface-variant',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
EmptyStateIcon.displayName = 'EmptyStateIcon';

export const EmptyStateTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn('font-heading text-headline-sm font-semibold text-on-surface mb-2', className)}
    style={{ textWrap: 'balance' }}
    {...props}
  >
    {children}
  </h3>
);
EmptyStateTitle.displayName = 'EmptyStateTitle';

export const EmptyStateDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('font-sans text-body-md text-on-surface-variant max-w-md mb-6', className)}
    style={{ textWrap: 'pretty' }}
    {...props}
  >
    {children}
  </p>
);
EmptyStateDescription.displayName = 'EmptyStateDescription';

export const EmptyStateActions = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-wrap items-center justify-center gap-3', className)} {...props}>
    {children}
  </div>
);
EmptyStateActions.displayName = 'EmptyStateActions';
