import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export type InlineAlertRole = 'neutral' | 'warning' | 'error' | 'success';

export interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  role?: InlineAlertRole;
  icon?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(({
  title,
  children,
  role = 'neutral',
  icon,
  action,
  onClose,
  className,
  ...props
}, ref) => {
  const accentBarBg: Record<InlineAlertRole, string> = {
    neutral: 'bg-on-surface',
    warning: 'bg-warning',
    error: 'bg-error',
    success: 'bg-success',
  };

  const iconColorClasses: Record<InlineAlertRole, string> = {
    neutral: 'text-on-surface',
    warning: 'text-warning',
    error: 'text-error',
    success: 'text-success',
  };

  const defaultIcons: Record<InlineAlertRole, string> = {
    neutral: 'info',
    warning: 'warning',
    error: 'error',
    success: 'check_circle',
  };

  const activeIcon = icon || defaultIcons[role];
  const ariaRole = role === 'error' ? 'alert' : 'status';
  const ariaLive = role === 'error' ? 'assertive' : 'polite';

  return (
    <div
      ref={ref}
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic="true"
      className={cn(
        'relative flex items-start gap-4 p-5 pl-6 rounded-none bg-surface border-none shadow-ambient overflow-hidden text-left',
        className
      )}
      {...props}
    >
      {/* Mathematically straight 4px vertical accent bar */}
      <div
        className={cn('absolute left-0 top-0 bottom-0 w-1', accentBarBg[role])}
        aria-hidden="true"
      />
      <Icon
        name={activeIcon}
        size="lg"
        className={cn('mt-0.5 shrink-0', iconColorClasses[role])}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-heading text-base font-bold text-on-surface mb-1">
          {title}
        </h4>
        <div className="font-sans text-sm text-on-surface-variant leading-relaxed">
          {children}
        </div>
        {action && (
          <div className="mt-3 flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="shrink-0 p-1 -mr-1 -mt-1 text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
        >
          <Icon name="close" size="md" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

InlineAlert.displayName = 'InlineAlert';

