/**
 * Attachment component system.
 *
 * Full API and feature parity with shadcn/ui Base Attachment specification:
 * https://ui.shadcn.com/docs/components/base/attachment
 *
 * ANATOMY:
 * AttachmentGroup
 * └── Attachment
 *     ├── AttachmentMedia
 *     ├── AttachmentContent
 *     │   ├── AttachmentTitle
 *     │   └── AttachmentDescription
 *     ├── AttachmentActions
 *     │   └── AttachmentAction
 *     └── AttachmentTrigger
 *
 * FEATURES & CAPABILITIES:
 * - Full compound composition with subcomponents for flexible media, layout, and metadata display.
 * - Upload lifecycle states: 'idle' | 'uploading' | 'processing' | 'error' | 'done'.
 * - Layout orientations: 'horizontal' (compact row/chip) and 'vertical' (stacked card).
 * - Media variants: 'default' (file-type icons with semantic washes) and 'image' (aspect-square thumbnails).
 * - Stretched interactive overlay (`AttachmentTrigger`) with isolated action button stacking (`AttachmentActions`).
 * - Horizontally scrollable, snapping container (`AttachmentGroup`) with smooth edge fades.
 * - 100% backwards-compatible convenience props for legacy callers (`fileName`, `fileSize`, `status`, etc.).
 * - Base UI polymorphic `useRender` support across all components.
 * - Strict compliance with DESIGN.md high-contrast tokens, WCAG AA, and floating focus rings.
 */

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { Icon } from './icon';
import { Progress } from './progress';
import { Tooltip } from './tooltip';

// ============================================================================
// Types & Context
// ============================================================================

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
/** Backwards-compatible legacy status type */
export type AttachmentStatus = 'idle' | 'uploading' | 'completed' | 'error';

export type AttachmentOrientation = 'horizontal' | 'vertical';
export type AttachmentSize = 'default' | 'sm' | 'xs';
export type AttachmentVariant = 'card' | 'chip' | 'compact' | 'default';
export type AttachmentType = 'audio' | 'pdf' | 'image' | 'video' | 'document' | 'generic';

export interface AttachmentContextValue {
  state: AttachmentState;
  orientation: AttachmentOrientation;
  size: AttachmentSize;
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: 'done',
  orientation: 'horizontal',
  size: 'default',
});

export const useAttachment = () => React.useContext(AttachmentContext);

const fileTypeIcons: Record<AttachmentType, { icon: string; wash: string; text: string }> = {
  audio: {
    icon: 'mic',
    wash: 'bg-primary-container',
    text: 'text-on-primary-container',
  },
  pdf: {
    icon: 'description',
    wash: 'bg-error-container',
    text: 'text-on-error-container',
  },
  image: {
    icon: 'image',
    wash: 'bg-secondary-container',
    text: 'text-on-secondary-container',
  },
  video: {
    icon: 'movie',
    wash: 'bg-tertiary-container',
    text: 'text-on-tertiary-container',
  },
  document: {
    icon: 'article',
    wash: 'bg-surface-container',
    text: 'text-on-surface-variant',
  },
  generic: {
    icon: 'attach_file',
    wash: 'bg-surface-container',
    text: 'text-on-surface-variant',
  },
};

// ============================================================================
// AttachmentGroup
// ============================================================================

export interface AttachmentGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  /** Whether items scroll horizontally in a snapping row. Defaults to true. */
  scrollable?: boolean;
}

export const AttachmentGroup = React.forwardRef<HTMLDivElement, AttachmentGroupProps>(
  ({ className, scrollable = true, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'attachment-group',
        role: 'group',
        'aria-label': 'File attachments',
        className: cn(
          'flex gap-2 max-w-full',
          scrollable
            ? 'overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory scroll-smooth [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)]'
            : 'flex-wrap items-center',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
AttachmentGroup.displayName = 'AttachmentGroup';

// ============================================================================
// Attachment Root
// ============================================================================

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  /**
   * Upload and processing lifecycle state.
   * Aligned with shadcn specification: 'idle' | 'uploading' | 'processing' | 'error' | 'done'.
   */
  state?: AttachmentState;
  /** Layout orientation. 'horizontal' (row/chip) or 'vertical' (stacked card). */
  orientation?: AttachmentOrientation;
  /** Component size scale. */
  size?: AttachmentSize;

  // --------------------------------------------------------------------------
  // Backwards-Compatible Convenience Props
  // --------------------------------------------------------------------------
  /** Legacy status prop ('completed' is normalized to 'done') */
  status?: AttachmentStatus;
  /** Legacy variant prop ('chip' | 'compact' | 'card' | 'default') */
  variant?: AttachmentVariant;
  fileName?: string;
  fileSize?: string;
  fileType?: AttachmentType;
  uploadProgress?: number;
  errorMessage?: string;
  onRemove?: () => void;
  onDownload?: () => void;
}

export const AttachmentRoot = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      render,
      children,
      state: stateProp,
      status: legacyStatus,
      orientation: orientationProp,
      variant: legacyVariant = 'default',
      size = 'default',
      fileName,
      fileSize,
      fileType = 'generic',
      uploadProgress = 0,
      errorMessage,
      onRemove,
      onDownload,
      ...props
    },
    ref
  ) => {
    // Normalize state: prefer modern `state`, fallback to legacy `status`
    const resolvedState: AttachmentState = React.useMemo(() => {
      if (stateProp) return stateProp;
      if (legacyStatus === 'completed') return 'done';
      if (legacyStatus) return legacyStatus;
      return 'done';
    }, [stateProp, legacyStatus]);

    // Normalize orientation: if legacy chip/compact was requested, default to horizontal
    const resolvedOrientation: AttachmentOrientation = React.useMemo(() => {
      if (orientationProp) return orientationProp;
      if (legacyVariant === 'chip' || legacyVariant === 'compact') return 'horizontal';
      if (legacyVariant === 'card') return 'vertical';
      return 'horizontal';
    }, [orientationProp, legacyVariant]);

    const isCompact = legacyVariant === 'chip' || legacyVariant === 'compact' || size === 'sm' || size === 'xs';
    const isError = resolvedState === 'error';
    const isUploading = resolvedState === 'uploading';
    const isProcessing = resolvedState === 'processing';

    const contextValue = React.useMemo<AttachmentContextValue>(
      () => ({
        state: resolvedState,
        orientation: resolvedOrientation,
        size,
      }),
      [resolvedState, resolvedOrientation, size]
    );

    // Root styling conforming to DESIGN.md tokens & WCAG AA requirements
    const rootClasses = cn(
      '@container group relative flex rounded-lg border text-on-surface transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
      isError
        ? 'border-error bg-surface hover:border-error has-[:focus-visible]:border-error'
        : isUploading || isProcessing
        ? 'border-primary bg-surface hover:border-primary has-[:focus-visible]:border-primary'
        : 'border-outline-variant hover:border-outline bg-surface has-[:focus-visible]:border-outline',
      resolvedOrientation === 'horizontal'
        ? isCompact
          ? 'items-center gap-2 px-2.5 py-1 min-h-[36px] max-w-[280px] shrink-0'
          : 'items-center gap-3 p-3 w-full max-w-md shrink-0'
        : 'flex-col gap-2.5 p-3 w-48 shrink-0',
      className
    );

    // If explicit compound children are provided, render them within context
    if (children) {
      return (
        <AttachmentContext.Provider value={contextValue}>
          {useRender({
            render,
            ref,
            defaultTagName: 'div',
            props: {
              'data-slot': 'attachment',
              'data-state': resolvedState,
              'data-orientation': resolvedOrientation,
              'data-size': size,
              role: 'group',
              className: rootClasses,
              children,
              ...props,
            },
          })}
        </AttachmentContext.Provider>
      );
    }

    // ------------------------------------------------------------------------
    // Convenience Shorthand Mode (Matches existing props without boilerplate)
    // ------------------------------------------------------------------------
    const config = fileTypeIcons[fileType] || fileTypeIcons.generic;
    const computedName = fileName || 'Attachment';

    return (
      <AttachmentContext.Provider value={contextValue}>
        {useRender({
          render,
          ref,
          defaultTagName: 'div',
          props: {
            'data-slot': 'attachment',
            'data-state': resolvedState,
            'data-orientation': resolvedOrientation,
            'data-size': size,
            role: 'group',
            'aria-label': `File attachment: ${computedName}`,
            className: rootClasses,
            children: (
              <>
                {/* Media Element */}
                <AttachmentMedia
                  className={cn(
                    config.wash,
                    config.text,
                    isCompact ? 'size-6 rounded' : 'size-10 rounded-md'
                  )}
                >
                  <Icon name={config.icon} size={isCompact ? 'xs' : 'md'} aria-hidden="true" />
                </AttachmentMedia>

                {/* Content & Metadata */}
                <AttachmentContent className={resolvedOrientation === 'vertical' ? 'w-full' : undefined}>
                  <Tooltip content={computedName}>
                    <AttachmentTitle className={isCompact ? 'text-xs' : 'text-sm'}>
                      {computedName}
                    </AttachmentTitle>
                  </Tooltip>
                  <AttachmentDescription className={isCompact ? 'text-[10px]' : 'text-xs'}>
                    {fileSize && <span>{fileSize}</span>}
                    {isUploading && (
                      <span className="text-primary font-medium">
                        Uploading ({Math.round(uploadProgress)}%)
                      </span>
                    )}
                    {isProcessing && (
                      <span className="text-secondary font-medium">Processing...</span>
                    )}
                    {isError && (
                      <span className="text-error font-medium">{errorMessage || 'Upload failed'}</span>
                    )}
                  </AttachmentDescription>
                </AttachmentContent>

                {/* Actions Layer */}
                {(onDownload || onRemove) && (
                  <AttachmentActions>
                    {onDownload && !isUploading && (
                      <AttachmentAction
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload();
                        }}
                        aria-label={`Download ${computedName}`}
                      >
                        <Icon name="download" size="sm" aria-hidden="true" />
                      </AttachmentAction>
                    )}
                    {onRemove && (
                      <AttachmentAction
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove();
                        }}
                        aria-label={`Remove ${computedName}`}
                        className="hover:text-error"
                      >
                        <Icon name="close" size={isCompact ? 'xs' : 'sm'} aria-hidden="true" />
                      </AttachmentAction>
                    )}
                  </AttachmentActions>
                )}

                {/* Upload Progress Track */}
                {isUploading && resolvedOrientation !== 'horizontal' && (
                  <Progress
                    value={uploadProgress}
                    showValue={false}
                    size="sm"
                    aria-label={`Upload progress for ${computedName}`}
                    className="w-full mt-1"
                  />
                )}
                {isUploading && resolvedOrientation === 'horizontal' && !isCompact && (
                  <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-lg">
                    <Progress
                      value={uploadProgress}
                      showValue={false}
                      size="sm"
                      aria-label={`Upload progress for ${computedName}`}
                      className="w-full rounded-none"
                    />
                  </div>
                )}
              </>
            ),
            ...props,
          },
        })}
      </AttachmentContext.Provider>
    );
  }
);
AttachmentRoot.displayName = 'Attachment';

// ============================================================================
// AttachmentMedia
// ============================================================================

export type AttachmentMediaVariant = 'default' | 'image' | 'icon';

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
  /**
   * Media presentation variant:
   * - 'default' or 'icon': Styled center container for icons or thumbnails.
   * - 'image': Crops child <img> elements cleanly into a square preview thumbnail.
   */
  variant?: AttachmentMediaVariant;
}

export const AttachmentMedia = React.forwardRef<HTMLDivElement, AttachmentMediaProps>(
  ({ className, variant = 'default', render, children, ...props }, ref) => {
    const isImage = variant === 'image';

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'attachment-media',
        'data-variant': variant,
        'aria-hidden': 'true',
        className: cn(
          'flex shrink-0 items-center justify-center select-none overflow-hidden',
          isImage
            ? 'size-10 rounded-md bg-surface-container object-cover [&>img]:size-full [&>img]:object-cover [&>img]:rounded-md'
            : 'size-10 rounded-md bg-surface-container text-on-surface-variant',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
AttachmentMedia.displayName = 'AttachmentMedia';

// ============================================================================
// AttachmentContent
// ============================================================================

export interface AttachmentContentProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const AttachmentContent = React.forwardRef<HTMLDivElement, AttachmentContentProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'attachment-content',
        className: cn('flex min-w-0 flex-1 flex-col justify-center overflow-hidden pr-1', className),
        children,
        ...props,
      },
    });
  }
);
AttachmentContent.displayName = 'AttachmentContent';

// ============================================================================
// AttachmentTitle
// ============================================================================

export interface AttachmentTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
  render?: useRender.RenderProp;
}

export const AttachmentTitle = React.forwardRef<HTMLSpanElement, AttachmentTitleProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'attachment-title',
        className: cn(
          'truncate font-sans text-sm font-medium text-on-surface leading-tight cursor-default',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
AttachmentTitle.displayName = 'AttachmentTitle';

// ============================================================================
// AttachmentDescription
// ============================================================================

export interface AttachmentDescriptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  render?: useRender.RenderProp;
}

export const AttachmentDescription = React.forwardRef<HTMLSpanElement, AttachmentDescriptionProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'attachment-description',
        className: cn(
          'truncate font-mono text-xs text-on-surface-variant/90 leading-tight tabular-nums flex items-center gap-1.5',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
AttachmentDescription.displayName = 'AttachmentDescription';

// ============================================================================
// AttachmentActions
// ============================================================================

export interface AttachmentActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: useRender.RenderProp;
}

export const AttachmentActions = React.forwardRef<HTMLDivElement, AttachmentActionsProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'attachment-actions',
        className: cn('relative z-10 flex items-center gap-1 shrink-0 ml-auto', className),
        children,
        ...props,
      },
    });
  }
);
AttachmentActions.displayName = 'AttachmentActions';

// ============================================================================
// AttachmentAction
// ============================================================================

export interface AttachmentActionProps extends Omit<ButtonProps, 'colorRole'> {
  colorRole?: ButtonProps['colorRole'];
}

export const AttachmentAction = React.forwardRef<HTMLButtonElement, AttachmentActionProps>(
  (
    {
      className,
      variant = 'ghost',
      colorRole = 'neutral',
      size = 'icon',
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        colorRole={colorRole}
        size={size}
        data-slot="attachment-action"
        expandedTouchTarget
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        className={cn(
          'size-7 min-h-[28px] min-w-[28px] p-0 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70',
          className
        )}
        {...props}
      />
    );
  }
);
AttachmentAction.displayName = 'AttachmentAction';

// ============================================================================
// AttachmentTrigger
// ============================================================================

export interface AttachmentTriggerProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  render?: useRender.RenderProp;
}

export const AttachmentTrigger = React.forwardRef<HTMLAnchorElement, AttachmentTriggerProps>(
  ({ className, render, children, ...props }, ref) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: {
        'data-slot': 'attachment-trigger',
        tabIndex: 0,
        className: cn(
          'absolute inset-0 z-0 rounded-lg cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className
        ),
        children,
        ...props,
      },
    });
  }
);
AttachmentTrigger.displayName = 'AttachmentTrigger';

// ============================================================================
// Export Compound Component Namespace
// ============================================================================

export const Attachment = Object.assign(AttachmentRoot, {
  Group: AttachmentGroup,
  Media: AttachmentMedia,
  Content: AttachmentContent,
  Title: AttachmentTitle,
  Description: AttachmentDescription,
  Actions: AttachmentActions,
  Action: AttachmentAction,
  Trigger: AttachmentTrigger,
});
