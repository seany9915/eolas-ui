/**
 * Confirmation primitive.
 *
 * Base UI Integration: Consumes Base UI Button primitive and Icon primitive.
 *
 * TAXONOMY & USAGE:
 * - Use Confirmation to present a human-in-the-loop consent or approval gate before
 *   an agentic tool executes a sensitive clinical or system action (e.g. updating a patient
 *   record, finalizing an assessment, or running an external write operation).
 * - Conforms to shadcn AI Elements Confirmation specification and DESIGN.md:
 *   - High-contrast visual structure with calm clinical amber/neutral tokens.
 *   - Clear distinction between pending, approved, and denied states.
 *   - WCAG 2.2 compliant 44x44px touch targets on decision buttons.
 *   - Floating 2px focus rings (`outline-offset: 2px`).
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Chip } from './chip';
import { cn } from '@/lib/utils';

export type ConfirmationStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-denied';

export interface ConfirmationRootProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ConfirmationStatus;
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationRoot = React.forwardRef<HTMLDivElement, ConfirmationRootProps>(
  ({ status = 'pending', children, className, ...props }, ref) => {
    const isApproved = status === 'approved' || status === 'approval-responded' || status === 'output-available';
    const isDenied = status === 'denied' || status === 'output-denied';

    return (
      <div
        ref={ref}
        data-slot="confirmation-root"
        data-status={status}
        className={cn(
          'w-full rounded-xl border p-4 transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          !isApproved && !isDenied && 'bg-surface border-outline-variant',
          isApproved && 'bg-surface-container/30 border-outline-variant/80',
          isDenied && 'bg-surface-container/40 border-outline-variant/60 opacity-80',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ConfirmationRoot.displayName = 'Confirmation.Root';

export interface ConfirmationMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ConfirmationStatus;
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationMedia: React.FC<ConfirmationMediaProps> = ({
  status = 'pending',
  children,
  className,
  ...props
}) => {
  const isApproved = status === 'approved' || status === 'approval-responded' || status === 'output-available';
  const isDenied = status === 'denied' || status === 'output-denied';

  return (
    <div
      data-slot="confirmation-media"
      className={cn(
        'size-7 rounded-md flex items-center justify-center shrink-0 select-none mt-0.5',
        isApproved && 'bg-success text-on-success',
        isDenied && 'bg-surface-container text-on-surface-variant',
        !isApproved && !isDenied && 'bg-warning-container text-on-warning-container',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children || (
        <Icon
          name={
            isApproved
              ? 'check'
              : isDenied
              ? 'block'
              : 'shield'
          }
          size="xs"
        />
      )}
    </div>
  );
};
ConfirmationMedia.displayName = 'Confirmation.Media';

export interface ConfirmationHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationHeader: React.FC<ConfirmationHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-start justify-between gap-3 mb-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};
ConfirmationHeader.displayName = 'Confirmation.Header';

export interface ConfirmationTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationTitle: React.FC<ConfirmationTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h4
      className={cn('font-heading text-sm font-semibold text-on-surface leading-snug', className)}
      {...props}
    >
      {children}
    </h4>
  );
};
ConfirmationTitle.displayName = 'Confirmation.Title';

export interface ConfirmationDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationDescription: React.FC<ConfirmationDescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn('font-sans text-xs text-on-surface-variant leading-relaxed mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
};
ConfirmationDescription.displayName = 'Confirmation.Description';

export interface ConfirmationDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationDetails: React.FC<ConfirmationDetailsProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mt-2.5 p-2.5 rounded-lg bg-surface-container/60 border border-outline-variant/50 font-mono text-xs text-on-surface-variant overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
ConfirmationDetails.displayName = 'Confirmation.Details';

export interface ConfirmationActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationActions: React.FC<ConfirmationActionsProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center justify-end gap-2.5 mt-3 pt-2.5 border-t border-outline-variant/40', className)}
      {...props}
    >
      {children}
    </div>
  );
};
ConfirmationActions.displayName = 'Confirmation.Actions';

export interface ConfirmationApproveProps {
  onApprove?: () => void;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ConfirmationApprove: React.FC<ConfirmationApproveProps> = ({
  onApprove,
  label = 'Approve',
  disabled = false,
  isLoading = false,
  className,
}) => {
  return (
    <Button
      variant="filled"
      colorRole="primary"
      size="sm"
      disabled={disabled || isLoading}
      onClick={onApprove}
      expandedTouchTarget
      aria-label={label}
      className={cn('min-h-[44px] px-3.5 text-xs font-semibold gap-1.5', className)}
    >
      {isLoading ? (
        <Icon name="progress_activity" size="xs" className="animate-spin" aria-hidden="true" />
      ) : (
        <Icon name="check" size="xs" aria-hidden="true" />
      )}
      <span>{label}</span>
    </Button>
  );
};
ConfirmationApprove.displayName = 'Confirmation.Approve';

export interface ConfirmationDenyProps {
  onDeny?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const ConfirmationDeny: React.FC<ConfirmationDenyProps> = ({
  onDeny,
  label = 'Deny',
  disabled = false,
  className,
}) => {
  return (
    <Button
      variant="outlined"
      colorRole="neutral"
      size="sm"
      disabled={disabled}
      onClick={onDeny}
      expandedTouchTarget
      aria-label={label}
      className={cn('min-h-[44px] px-3.5 text-xs font-semibold gap-1.5', className)}
    >
      <Icon name="close" size="xs" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
};
ConfirmationDeny.displayName = 'Confirmation.Deny';

/* -------------------------------------------------------------------------------------------------
 * Full Confirmation Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface ConfirmationProps {
  title: string;
  description?: string;
  details?: React.ReactNode;
  riskLevel?: 'low' | 'medium' | 'high';
  status?: ConfirmationStatus;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: string;
  denyLabel?: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ConfirmationComponent = React.forwardRef<HTMLDivElement, ConfirmationProps>(
  (
    {
      title,
      description,
      details,
      riskLevel = 'medium',
      status = 'pending',
      onApprove,
      onDeny,
      approveLabel = 'Approve',
      denyLabel = 'Deny',
      isLoading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isApproved = status === 'approved' || status === 'approval-responded' || status === 'output-available';
    const isDenied = status === 'denied' || status === 'output-denied';
    const isPending = !isApproved && !isDenied;

    return (
      <ConfirmationRoot ref={ref} status={status} className={className} {...props}>
        {children ? (
          children
        ) : (
          <>
            <ConfirmationHeader>
              <div className="flex items-start gap-2.5 min-w-0">
                <ConfirmationMedia status={status} />
                <div className="min-w-0">
                  <ConfirmationTitle>{title}</ConfirmationTitle>
                  {description && <ConfirmationDescription>{description}</ConfirmationDescription>}
                </div>
              </div>

              {/* Status or Risk Badge */}
              <div className="shrink-0">
                {isApproved ? (
                  <Chip size="sm" pattern="high-contrast-mixed" colorRole="success">
                    Approved
                  </Chip>
                ) : isDenied ? (
                  <Chip size="sm" pattern="outline-neutral-fill" colorRole="neutral">
                    Denied
                  </Chip>
                ) : riskLevel === 'high' ? (
                  <Chip size="sm" pattern="high-contrast-mixed" colorRole="warning">
                    Action Required
                  </Chip>
                ) : (
                  <Chip size="sm" pattern="outline-neutral-fill" colorRole="neutral">
                    Confirmation
                  </Chip>
                )}
              </div>
            </ConfirmationHeader>

            {details && <ConfirmationDetails>{details}</ConfirmationDetails>}

            {isPending && (onApprove || onDeny) && (
              <ConfirmationActions>
                {onDeny && (
                  <ConfirmationDeny
                    onDeny={onDeny}
                    label={denyLabel}
                    disabled={isLoading}
                  />
                )}
                {onApprove && (
                  <ConfirmationApprove
                    onApprove={onApprove}
                    label={approveLabel}
                    isLoading={isLoading}
                  />
                )}
              </ConfirmationActions>
            )}
          </>
        )}
      </ConfirmationRoot>
    );
  }
);
ConfirmationComponent.displayName = 'Confirmation';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Confirmation = Object.assign(ConfirmationComponent, {
  Root: ConfirmationRoot,
  Header: ConfirmationHeader,
  Media: ConfirmationMedia,
  Title: ConfirmationTitle,
  Description: ConfirmationDescription,
  Details: ConfirmationDetails,
  Actions: ConfirmationActions,
  Approve: ConfirmationApprove,
  Deny: ConfirmationDeny,
});

export {
  ConfirmationRoot,
  ConfirmationHeader,
  ConfirmationMedia,
  ConfirmationTitle,
  ConfirmationDescription,
  ConfirmationDetails,
  ConfirmationActions,
  ConfirmationApprove,
  ConfirmationDeny,
};

export default Confirmation;
