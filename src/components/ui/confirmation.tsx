/**
 * Confirmation primitive.
 *
 * Base UI Integration: Consumes Base UI Button primitive and Icon primitive.
 *
 * TAXONOMY & USAGE:
 * - Dual-purpose component:
 *   1. AI Tool Approval Gate: Conforms to shadcn AI Elements confirmation lifecycle
 *      (approval-requested -> approved / denied) for Human-in-the-Loop tool execution.
 *   2. Clinical Decision Gate: Structured inline consent, prescription verification, order
 *      sign-off, or risk acknowledgment card in clinical workflows and dashboards.
 * - Conforms to shadcn AI Elements Confirmation specification and DESIGN.md:
 *   - High-contrast visual structure with calm clinical amber/neutral tokens.
 *   - Clear distinction between pending, approved, and denied states.
 *   - WCAG 2.2 compliant 44x44px touch targets on decision buttons.
 *   - Floating 2px focus rings (`outline-offset: 2px`).
 *   - Concentric radius hierarchy (`rounded-xl` container with `rounded` buttons).
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Chip } from './chip';
import { useChatMessageContext } from './chat-message-context';
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
  variant?: 'card' | 'embedded' | 'ghost' | 'unboxed';
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationRoot = React.forwardRef<HTMLDivElement, ConfirmationRootProps>(
  ({ status = 'pending', variant, children, className, ...props }, ref) => {
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'card');
    const isApproved = status === 'approved' || status === 'approval-responded' || status === 'output-available';
    const isDenied = status === 'denied' || status === 'output-denied';

    return (
      <div
        ref={ref}
        data-slot="confirmation-root"
        data-status={status}
        className={cn(
          'w-full transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
          (resolvedVariant === 'ghost' || resolvedVariant === 'unboxed')
            ? 'rounded-none border-none bg-transparent p-0'
            : cn(
                'rounded-xl border p-4 shadow-xs',
                !isApproved && !isDenied && 'bg-surface border-outline-variant/80',
                isApproved && 'bg-surface-container/30 border-outline-variant/80',
                isDenied && 'bg-surface-container/40 border-outline-variant/60 opacity-80'
              ),
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
  variant?: 'badge' | 'ghost';
  children?: React.ReactNode;
  className?: string;
}

const ConfirmationMedia: React.FC<ConfirmationMediaProps> = ({
  status = 'pending',
  variant = 'badge',
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
        'shrink-0 flex items-center justify-center select-none mt-0.5 transition-colors',
        variant === 'badge'
          ? cn(
              'size-7 rounded-md text-xs',
              isApproved && 'bg-success text-on-success font-bold',
              isDenied && 'bg-surface-container text-on-surface-variant',
              !isApproved && !isDenied && 'bg-warning-container text-on-warning-container'
            )
          : cn(
              'size-5 text-xs',
              isApproved && 'text-success',
              isDenied && 'text-on-surface-variant',
              !isApproved && !isDenied && 'text-warning'
            ),
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children || (
        <Icon
          name={
            isApproved
              ? 'check_circle'
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
        'mt-2.5 p-2.5 rounded-sm bg-surface-container font-mono text-xs text-on-surface-variant overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
ConfirmationDetails.displayName = 'Confirmation.Details';

export interface ConfirmationChangesProps extends React.HTMLAttributes<HTMLDivElement> {
  changes?: Record<string, { from?: unknown; to?: unknown }> | Array<{ label: string; from?: unknown; to?: unknown }>;
  children?: React.ReactNode;
}

const ConfirmationChanges: React.FC<ConfirmationChangesProps> = ({ changes, children, className, ...props }) => {
  if (children) {
    return (
      <div className={cn('mt-2 text-xs font-mono space-y-1', className)} {...props}>
        {children}
      </div>
    );
  }

  if (!changes) return null;

  const items = Array.isArray(changes)
    ? changes
    : Object.entries(changes).map(([key, val]) => ({ label: key, from: val.from, to: val.to }));

  return (
    <div className={cn('mt-2.5 p-2 rounded-md bg-surface-container/60 font-mono text-xs space-y-1.5', className)} {...props}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-2 border-b border-outline-variant/30 last:border-0 pb-1 last:pb-0">
          <span className="text-on-surface-variant font-semibold">{item.label}:</span>
          <div className="flex items-center gap-1.5 truncate">
            {item.from !== undefined && (
              <span className="text-error/80 line-through truncate max-w-[120px]">{String(item.from)}</span>
            )}
            {item.from !== undefined && item.to !== undefined && (
              <Icon name="arrow_forward" size="xs" className="text-on-surface-variant/60 shrink-0" />
            )}
            {item.to !== undefined && (
              <span className="text-success font-semibold truncate max-w-[140px]">{String(item.to)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
ConfirmationChanges.displayName = 'Confirmation.Changes';

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

export interface ConfirmationActionProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
}

export const ConfirmationAction = React.forwardRef<HTMLButtonElement, ConfirmationActionProps>(
  ({ children, className, variant = 'outlined', colorRole = 'neutral', size = 'sm', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        colorRole={colorRole}
        size={size}
        expandedTouchTarget
        className={cn('min-h-[44px] px-3.5 text-xs font-semibold gap-1.5', className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
ConfirmationAction.displayName = 'Confirmation.Action';

export const ConfirmationRequest = ConfirmationHeader;

/* -------------------------------------------------------------------------------------------------
 * Full Confirmation Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface ConfirmationProps {
  title: string;
  description?: string;
  details?: React.ReactNode;
  riskLevel?: 'low' | 'medium' | 'high';
  status?: ConfirmationStatus;
  variant?: 'card' | 'embedded' | 'ghost' | 'unboxed';
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
      variant,
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
    const chatContext = useChatMessageContext();
    const resolvedVariant = variant ?? (chatContext.inMessage ? 'ghost' : 'card');
    const isApproved = status === 'approved' || status === 'approval-responded' || status === 'output-available';
    const isDenied = status === 'denied' || status === 'output-denied';
    const isPending = !isApproved && !isDenied;

    return (
      <ConfirmationRoot ref={ref} status={status} variant={resolvedVariant} className={className} {...props}>
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
  Changes: ConfirmationChanges,
  Diff: ConfirmationChanges,
  Actions: ConfirmationActions,
  Action: ConfirmationAction,
  Approve: ConfirmationApprove,
  Deny: ConfirmationDeny,
  Request: ConfirmationHeader,
  Accepted: ConfirmationMedia,
  Rejected: ConfirmationMedia,
});

export {
  ConfirmationRoot,
  ConfirmationHeader,
  ConfirmationMedia,
  ConfirmationTitle,
  ConfirmationDescription,
  ConfirmationDetails,
  ConfirmationChanges,
  ConfirmationActions,
  ConfirmationApprove,
  ConfirmationDeny,
};

export default Confirmation;
