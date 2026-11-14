/**
 * InlineAlert primitive.
 *
 * Aligned with shadcn/ui and Base UI ecosystem patterns:
 * https://ui.shadcn.com/docs/components/base/alert
 *
 * TAXONOMY & USAGE:
 * - Use InlineAlert for high-visibility system event or validation banners (neutral, warning, error, success).
 * - Implements a mathematically straight 4px vertical accent bar, ambient elevation, and accessible live regions.
 * - Supports both monolithic props (title, action, onClose) and compound subcomponents (InlineAlert.Title, InlineAlert.Description, InlineAlert.Action, InlineAlert.Close).
 * - Distinct from ClinicianTip (which is low-prominence instructional micro-guidance) and AlertDialog (modal interrupt).
 * - Follows DESIGN.md tokens: Atkinson Hyperlegible Next headings (font-heading), Lexend body (font-sans), and semantic color roles.
 */
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

export type InlineAlertRole = 'neutral' | 'warning' | 'error' | 'success';
export type InlineAlertVariant = 'default' | 'destructive' | InlineAlertRole;
export type InlineAlertAppearance = 'wash' | 'surface';

export interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional title for monolithic usage. Omit when using `<InlineAlert.Title>` */
  title?: string;
  /** Semantic heading tag for title. Defaults to 'h3' */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'div';
  children?: React.ReactNode;
  /** Primary semantic role according to DESIGN.md */
  role?: InlineAlertRole;
  /** Ergonomic alias matching shadcn alert API ('default' -> 'neutral', 'destructive' -> 'error') */
  variant?: InlineAlertVariant;
  /** Visual backdrop style: 'wash' (default, best inside white cards) or 'surface' (white card fill for alerts on the page canvas) */
  appearance?: InlineAlertAppearance;
  /** Material Symbol icon name, React icon element, or null/'none' to omit */
  icon?: React.ReactNode;
  /** Action slot for buttons/links in monolithic usage */
  action?: React.ReactNode;
  /** Dismiss callback in monolithic usage */
  onClose?: () => void;
  className?: string;
}

export interface InlineAlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'div';
}

export const InlineAlertTitle = React.forwardRef<HTMLHeadingElement, InlineAlertTitleProps>(
  ({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag
      ref={ref}
      data-slot="inline-alert-title"
      className={cn('font-heading text-base font-bold text-on-surface mb-1 text-balance', className)}
      {...props}
    />
  )
);
InlineAlertTitle.displayName = 'InlineAlertTitle';

export interface InlineAlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InlineAlertDescription = React.forwardRef<HTMLDivElement, InlineAlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="inline-alert-description"
      className={cn('font-sans text-sm text-on-surface-variant leading-relaxed text-pretty', className)}
      {...props}
    />
  )
);
InlineAlertDescription.displayName = 'InlineAlertDescription';

export interface InlineAlertActionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InlineAlertAction = React.forwardRef<HTMLDivElement, InlineAlertActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="inline-alert-action"
      className={cn('mt-3 flex items-center gap-3', className)}
      {...props}
    />
  )
);
InlineAlertAction.displayName = 'InlineAlertAction';

export interface InlineAlertCloseProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {}

export const InlineAlertClose = React.forwardRef<HTMLButtonElement, InlineAlertCloseProps>(
  ({ className, children, ...props }, ref) => (
    <BaseButton
      ref={ref}
      type="button"
      data-slot="inline-alert-close"
      aria-label="Dismiss alert"
      className={cn(
        'shrink-0 min-h-[44px] min-w-[44px] size-11 -mr-2 -mt-2 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm cursor-pointer select-none',
        className
      )}
      {...props}
    >
      {children ?? <Icon name="close" size="md" aria-hidden="true" />}
    </BaseButton>
  )
);
InlineAlertClose.displayName = 'InlineAlertClose';

const InlineAlertComponent = React.forwardRef<HTMLDivElement, InlineAlertProps>(({
  title,
  titleAs = 'h3',
  children,
  role,
  variant,
  appearance = 'wash',
  icon,
  action,
  onClose,
  className,
  ...props
}, ref) => {
  // Resolve role: explicit role takes priority, fallback to variant, default to 'neutral'
  const resolvedRole: InlineAlertRole = role ?? (
    variant === 'destructive' ? 'error' : variant === 'default' ? 'neutral' : (variant ?? 'neutral')
  );

  const accentBarBg: Record<InlineAlertRole, string> = {
    neutral: 'bg-on-surface',
    warning: 'bg-warning',
    error: 'bg-error',
    success: 'bg-success',
  };

  const surfaceWashBg: Record<InlineAlertRole, string> = {
    neutral: 'bg-surface-container',
    warning: 'bg-warning-container/60',
    error: 'bg-error-container/60',
    success: 'bg-success-container/60',
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

  const hasIcon = icon !== null && icon !== 'none' && icon !== false && icon !== '';
  const ariaRole = resolvedRole === 'error' ? 'alert' : 'status';
  const ariaLive = resolvedRole === 'error' ? 'assertive' : 'polite';

  const renderIcon = () => {
    if (!hasIcon) return null;
    if (React.isValidElement(icon)) {
      return (
        <div className={cn('mt-0.5 shrink-0', iconColorClasses[resolvedRole])} aria-hidden="true">
          {icon}
        </div>
      );
    }
    const iconName = typeof icon === 'string' && icon !== 'none' ? icon : defaultIcons[resolvedRole];
    return (
      <Icon
        name={iconName}
        size="lg"
        className={cn('mt-0.5 shrink-0', iconColorClasses[resolvedRole])}
        aria-hidden="true"
      />
    );
  };

  return (
    <div
      ref={ref}
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic="true"
      data-slot="inline-alert"
      data-variant={variant ?? resolvedRole}
      data-role={resolvedRole}
      data-appearance={appearance}
      className={cn(
        'relative flex items-start gap-4 p-5 pl-6 rounded-l-none rounded-r-default overflow-hidden text-left',
        appearance === 'surface'
          ? 'bg-surface border border-outline-variant shadow-card'
          : cn('border-none', surfaceWashBg[resolvedRole]),
        className
      )}
      {...props}
    >
      {/* Mathematically straight 4px vertical accent bar */}
      <div
        className={cn('absolute left-0 top-0 bottom-0 w-1', accentBarBg[resolvedRole])}
        aria-hidden="true"
      />
      {renderIcon()}
      <div className="flex-1 min-w-0">
        {title && (
          <InlineAlertTitle as={titleAs}>
            {title}
          </InlineAlertTitle>
        )}
        {typeof children === 'string' ? (
          <InlineAlertDescription>{children}</InlineAlertDescription>
        ) : (
          children
        )}
        {action && (
          <InlineAlertAction>
            {action}
          </InlineAlertAction>
        )}
      </div>
      {onClose && (
        <InlineAlertClose onClick={onClose} />
      )}
    </div>
  );
});

InlineAlertComponent.displayName = 'InlineAlert';

export const InlineAlert = Object.assign(InlineAlertComponent, {
  Title: InlineAlertTitle,
  Description: InlineAlertDescription,
  Action: InlineAlertAction,
  Close: InlineAlertClose,
});

export { InlineAlertComponent };

export default InlineAlert;
