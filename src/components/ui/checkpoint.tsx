'use client';

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
import { Badge } from './badge';
import { Separator } from './separator';
import { cn } from '@/lib/utils';

export type CheckpointVariant = 'default' | 'separator' | 'border';
export type MarkerVariant = CheckpointVariant;

export interface CheckpointRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CheckpointVariant;
  children?: React.ReactNode;
  className?: string;
}

const CheckpointRoot = React.forwardRef<HTMLDivElement, CheckpointRootProps>(
  ({ variant = 'separator', children, className, role, ...props }, ref) => {
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          role={role}
          data-slot="marker"
          data-variant="default"
          className={cn(
            'flex flex-wrap items-center justify-center gap-2 w-full py-2 px-3 text-xs text-on-surface-variant select-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (variant === 'border') {
      return (
        <div
          ref={ref}
          role={role}
          data-slot="marker"
          data-variant="border"
          className={cn(
            'flex flex-wrap items-center gap-2 w-full py-2.5 px-3 border-b border-outline-variant/60 text-xs text-on-surface-variant select-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role={role ?? 'region'}
        aria-label={props['aria-label'] ?? 'Conversation checkpoint'}
        data-slot="checkpoint-root"
        data-variant="separator"
        className={cn(
          'relative flex items-center justify-center w-full py-4 my-2 select-none',
          className
        )}
        {...props}
      >
        <Separator orientation="horizontal" className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-outline-variant/60 my-0" />
        <div className="relative flex max-w-full flex-wrap items-center justify-center gap-2 px-3 py-1 bg-surface border border-outline-variant/80 rounded-full text-xs text-on-surface-variant">
          {children}
        </div>
      </div>
    );
  }
);
CheckpointRoot.displayName = 'Checkpoint.Root';

export interface CheckpointIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

const CheckpointIcon: React.FC<CheckpointIconProps> = ({
  name = 'bookmark',
  children,
  className,
  ...props
}) => {
  return (
    <span
      data-slot="marker-icon"
      className={cn('flex items-center justify-center text-primary shrink-0 [&>svg]:size-3.5', className)}
      aria-hidden="true"
      {...props}
    >
      {children ?? <Icon name={name} size="xs" />}
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
      data-slot="marker-content"
      className={cn('font-sans font-medium text-xs text-on-surface min-w-0 truncate', className)}
      {...props}
    >
      {children}
    </span>
  );
};
CheckpointTitle.displayName = 'Checkpoint.Title';

export interface CheckpointDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

const CheckpointDescription: React.FC<CheckpointDescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn('font-sans text-xs text-on-surface-variant truncate', className)}
      {...props}
    >
      {children}
    </span>
  );
};
CheckpointDescription.displayName = 'Checkpoint.Description';

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
      className={cn('font-mono text-xs tabular-nums text-on-surface-variant/80', className)}
      {...props}
    >
      {formatted}
    </span>
  );
};
CheckpointTimestamp.displayName = 'Checkpoint.Timestamp';

export interface CheckpointTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onRestore?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CheckpointTrigger: React.FC<CheckpointTriggerProps> = ({
  onRestore,
  onClick,
  label = 'Restore',
  disabled = false,
  className,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onRestore?.();
  };

  return (
    <Button
      variant="ghost"
      colorRole="primary"
      size="sm"
      disabled={disabled}
      onClick={handleClick}
      expandedTouchTarget
      aria-label={typeof children === 'string' ? children : `${label} conversation to this checkpoint`}
      className={cn('h-6 px-2 text-xs font-semibold gap-1 rounded-full', className)}
      {...props}
    >
      <Icon name="history" size="xs" aria-hidden="true" />
      <span>{children || label}</span>
    </Button>
  );
};
CheckpointTrigger.displayName = 'Checkpoint.Trigger';

/* -------------------------------------------------------------------------------------------------
 * Full Checkpoint Composition Component
 * -----------------------------------------------------------------------------------------------*/
export interface CheckpointProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  turn?: number;
  timestamp?: number | string;
  onRestore?: () => void;
  restoreLabel?: string;
  tag?: string;
  variant?: CheckpointVariant;
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
      variant = 'separator',
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
      <CheckpointRoot ref={ref} variant={variant} className={className} {...props}>
        {children ? (
          children
        ) : (
          <>
            <CheckpointIcon />
            <CheckpointTitle>{displayLabel}</CheckpointTitle>
            {tag && (
              <Badge size="sm" variant="outline" colorRole="neutral" className="text-xs py-0 px-1.5 h-5 font-mono">
                {tag}
              </Badge>
            )}
            {timestamp && <CheckpointTimestamp timestamp={timestamp} />}
            {onRestore && (
              <>
                <Separator orientation="vertical" className="h-3 my-0 mx-0.5 bg-outline-variant/80" />
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
 * Marker (shadcn AI Elements Marker primitive, defaulting to plain row)
 * -----------------------------------------------------------------------------------------------*/
export interface MarkerProps extends CheckpointRootProps {}

const MarkerRoot = React.forwardRef<HTMLDivElement, MarkerProps>(
  ({ variant = 'default', ...props }, ref) => {
    return <CheckpointRoot ref={ref} variant={variant} {...props} />;
  }
);
MarkerRoot.displayName = 'Marker';

const Marker = Object.assign(MarkerRoot, {
  Icon: CheckpointIcon,
  Content: CheckpointTitle,
  Button: CheckpointTrigger,
  Timestamp: CheckpointTimestamp,
  Separator,
});

/* -------------------------------------------------------------------------------------------------
 * Compound Export
 * -----------------------------------------------------------------------------------------------*/
export const Checkpoint = Object.assign(CheckpointComponent, {
  Root: CheckpointRoot,
  Icon: CheckpointIcon,
  Title: CheckpointTitle,
  Content: CheckpointTitle,
  Description: CheckpointDescription,
  Timestamp: CheckpointTimestamp,
  Trigger: CheckpointTrigger,
  Button: CheckpointTrigger,
  Tag: Badge,
  Separator,
});

export {
  CheckpointRoot,
  CheckpointIcon,
  CheckpointTitle,
  CheckpointDescription,
  CheckpointTimestamp,
  CheckpointTrigger,
  Separator as CheckpointSeparator,
  // shadcn AI Elements direct aliases
  Marker,
  CheckpointTitle as MarkerContent,
  CheckpointTrigger as MarkerButton,
  CheckpointIcon as MarkerIcon,
  CheckpointTimestamp as MarkerTimestamp,
  Separator as MarkerSeparator,
};

export default Checkpoint;
