/**
 * Checkpoint primitive.
 *
 * Base UI Integration: Consumes Base UI Button primitive and Icon primitive.
 *
 * TAXONOMY & USAGE:
 * - Use Checkpoint to mark specific points or milestone states in a conversation thread
 *   that a user or clinical agent can return to (e.g. before modifying a clinical plan).
 * - Conforms to shadcn AI Elements Checkpoint specification and DESIGN.md:
 *   - Balanced horizontal divider with neutral surface wash.
 *   - Accessible 44x44px touch target on the Restore trigger.
 *   - Monospace tabular-nums for turn numbering and timestamps.
 *   - Single-ring floating 2px focus indicator.
 */
import * as React from 'react';
import { Button } from './button';
import { Icon } from './icon';
import { Chip } from './chip';
import { cn } from '@/lib/utils';

export interface CheckpointRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const CheckpointRoot = React.forwardRef<HTMLDivElement, CheckpointRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-label="Conversation checkpoint"
        data-slot="checkpoint-root"
        className={cn(
          'relative flex items-center justify-center w-full py-4 my-2 select-none',
          'before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:bg-outline-variant/60',
          className
        )}
        {...props}
      >
        <div className="relative z-10 flex items-center gap-2 px-3 py-1 bg-surface border border-outline-variant/80 rounded-full text-xs text-on-surface-variant">
          {children}
        </div>
      </div>
    );
  }
);
CheckpointRoot.displayName = 'Checkpoint.Root';

export interface CheckpointIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  className?: string;
}

const CheckpointIcon: React.FC<CheckpointIconProps> = ({
  name = 'bookmark',
  className,
  ...props
}) => {
  return (
    <span
      className={cn('flex items-center justify-center text-primary shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      <Icon name={name} size="xs" />
    </span>
  );
};
CheckpointIcon.displayName = 'Checkpoint.Icon';

export interface CheckpointTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

const CheckpointTitle: React.FC<CheckpointTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn('font-sans font-medium text-xs text-on-surface whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </span>
  );
};
CheckpointTitle.displayName = 'Checkpoint.Title';

export interface CheckpointTimestampProps extends React.HTMLAttributes<HTMLSpanElement> {
  timestamp: number | string;
  className?: string;
}

const CheckpointTimestamp: React.FC<CheckpointTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => {
  const formatted = React.useMemo(() => {
    if (typeof timestamp === 'string') return timestamp;
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  }, [timestamp]);

  return (
    <span
      className={cn('font-mono text-[11px] tabular-nums text-on-surface-variant/80', className)}
      {...props}
    >
      {formatted}
    </span>
  );
};
CheckpointTimestamp.displayName = 'Checkpoint.Timestamp';

export interface CheckpointTriggerProps {
  onRestore?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CheckpointTrigger: React.FC<CheckpointTriggerProps> = ({
  onRestore,
  label = 'Restore',
  disabled = false,
  className,
}) => {
  return (
    <Button
      variant="ghost"
      colorRole="primary"
      size="sm"
      disabled={disabled}
      onClick={onRestore}
      expandedTouchTarget
      aria-label={`${label} conversation to this checkpoint`}
      className={cn('h-6 px-2 text-xs font-semibold gap-1 rounded-full', className)}
    >
      <Icon name="history" size="xs" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
};
CheckpointTrigger.displayName = 'Checkpoint.Trigger';

/* -------------------------------------------------------------------------------------------------
 * Full Checkpoint Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface CheckpointProps {
  label?: string;
  turn?: number;
  timestamp?: number | string;
  onRestore?: () => void;
  restoreLabel?: string;
  tag?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CheckpointComponent = React.forwardRef<HTMLDivElement, CheckpointProps>(
  (
    {
      label,
      turn,
      timestamp,
      onRestore,
      restoreLabel = 'Restore',
      tag,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const defaultLabel = turn !== undefined ? `Checkpoint: Turn ${turn}` : 'Checkpoint';
    const displayLabel = label || defaultLabel;

    return (
      <CheckpointRoot ref={ref} className={className} {...props}>
        {children ? (
          children
        ) : (
          <>
            <CheckpointIcon />
            <CheckpointTitle>{displayLabel}</CheckpointTitle>
            {tag && (
              <Chip size="sm" pattern="outline-neutral-fill" colorRole="neutral" className="text-[10px] py-0 px-1.5 h-4">
                {tag}
              </Chip>
            )}
            {timestamp && <CheckpointTimestamp timestamp={timestamp} />}
            {onRestore && (
              <>
                <div className="w-px h-3 bg-outline-variant/80" aria-hidden="true" />
                <CheckpointTrigger
                  onRestore={onRestore}
                  label={restoreLabel}
                  disabled={disabled}
                />
              </>
            )}
          </>
        )}
      </CheckpointRoot>
    );
  }
);
CheckpointComponent.displayName = 'Checkpoint';

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Checkpoint = Object.assign(CheckpointComponent, {
  Root: CheckpointRoot,
  Icon: CheckpointIcon,
  Title: CheckpointTitle,
  Timestamp: CheckpointTimestamp,
  Trigger: CheckpointTrigger,
  Button: CheckpointTrigger,
});

export {
  CheckpointRoot,
  CheckpointIcon,
  CheckpointTitle,
  CheckpointTimestamp,
  CheckpointTrigger,
  // shadcn AI Elements direct aliases
  CheckpointRoot as Marker,
  CheckpointTitle as MarkerContent,
  CheckpointTrigger as MarkerButton,
};

export default Checkpoint;
