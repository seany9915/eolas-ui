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
 * - Component sizes: 'default' | 'sm' | 'xs'.
 * - Media variants: 'default' (file-type icons or container wash) and 'image' (aspect-square thumbnails).
 * - Stretched interactive overlay (AttachmentTrigger) with isolated action button stacking (AttachmentActions).
 * - Horizontally scrollable, snapping container (AttachmentGroup) with smooth edge fades.
 * - Base UI polymorphic useRender support across all subcomponents.
 * - Strict compliance with DESIGN.md high-contrast tokens, WCAG AA, and floating focus rings.
 */

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';

// ============================================================================
// Types & Context
// ============================================================================

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
export type AttachmentOrientation = 'horizontal' | 'vertical';
export type AttachmentSize = 'default' | 'sm' | 'xs';

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
            ? 'overflow-x-auto px-1 py-1 pr-4 scrollbar-none snap-x snap-mandatory scroll-smooth [mask-image:linear-gradient(to_right,black_calc(100%-12px),transparent)]'
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
   * Upload and processing lifecycle state:
   * 'idle' | 'uploading' | 'processing' | 'error' | 'done'.
   */
  state?: AttachmentState;
  /** Layout orientation: 'horizontal' (row/chip) or 'vertical' (stacked card). */
  orientation?: AttachmentOrientation;
  /** Component size scale: 'default' | 'sm' | 'xs'. */
  size?: AttachmentSize;
}

export const AttachmentRoot = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      render,
      children,
      state = 'done',
      orientation = 'horizontal',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const isCompact = size === 'sm' || size === 'xs';
    const isError = state === 'error';
    const isUploading = state === 'uploading';
    const isProcessing = state === 'processing';

    const contextValue = React.useMemo<AttachmentContextValue>(
      () => ({
        state,
        orientation,
        size,
      }),
      [state, orientation, size]
    );

    // Root styling conforming to DESIGN.md tokens & WCAG AA requirements
    // Note: Do NOT add `@container` here. In CSS Containment Level 3, `container-type: inline-size`
    // enforces inline-size containment, which causes intrinsically sized containers (`w-fit`, `inline-flex`)
    // to calculate their width as if they have no children (collapsing down to just padding/border).
    const rootClasses = cn(
      'group relative rounded-lg border text-on-surface transition-[border-color,background-color] duration-quick ease-standard motion-reduce:transition-none',
      isError
        ? 'border-error bg-surface hover:border-error has-[:focus-visible]:border-error'
        : isUploading || isProcessing
        ? 'border-primary bg-surface hover:border-primary has-[:focus-visible]:border-primary'
        : 'border-outline-variant hover:border-outline bg-surface has-[:focus-visible]:border-outline',
      orientation === 'horizontal'
        ? isCompact
          ? size === 'xs'
            ? 'inline-flex items-center gap-1.5 px-2 py-0.5 min-h-[28px] w-fit max-w-[240px] shrink-0 self-start'
            : 'inline-flex items-center gap-2 px-2.5 py-1 min-h-[36px] w-fit max-w-[280px] shrink-0 self-start'
          : 'flex items-center gap-3 p-3 w-full max-w-md shrink-0'
        : 'flex flex-col gap-2.5 p-3 w-48 shrink-0',
      className
    );

    return (
      <AttachmentContext.Provider value={contextValue}>
        {useRender({
          render,
          ref,
          defaultTagName: 'div',
          props: {
            'data-slot': 'attachment',
            'data-state': state,
            'data-orientation': orientation,
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
    const { size } = useAttachment();
    const isImage = variant === 'image';
    const isMicro = size === 'xs';
    const isCompact = size === 'sm';

    const sizeClasses = isMicro
      ? 'size-5 rounded'
      : isCompact
      ? 'size-7 rounded'
      : 'size-10 rounded-md';

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
          sizeClasses,
          isImage
            ? 'bg-surface-container object-cover [&>img]:size-full [&>img]:object-cover [&>img]:rounded-[inherit]'
            : 'bg-surface-container text-on-surface-variant',
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
        className: cn('flex min-w-0 flex-1 basis-auto flex-col justify-center gap-0.5 overflow-hidden', className),
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
    const { size } = useAttachment();
    const isCompact = size === 'sm' || size === 'xs';

    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'attachment-title',
        className: cn(
          'truncate font-medium font-sans text-on-surface',
          isCompact ? 'text-xs' : 'text-sm',
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
    const { size } = useAttachment();
    const isCompact = size === 'sm' || size === 'xs';

    return useRender({
      render,
      ref,
      defaultTagName: 'span',
      props: {
        'data-slot': 'attachment-description',
        className: cn(
          'truncate font-sans text-on-surface-variant flex items-center gap-1.5',
          isCompact ? 'text-[10px]' : 'text-xs',
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
    const { orientation } = useAttachment();
    const isVertical = orientation === 'vertical';

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: {
        'data-slot': 'attachment-actions',
        className: cn(
          'relative z-10 flex items-center gap-1 shrink-0',
          isVertical ? 'absolute top-2.5 right-2.5' : 'ml-auto',
          className
        ),
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
    const { size: attachmentSize } = useAttachment();
    const isMicro = attachmentSize === 'xs';

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
          'p-0 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70 shrink-0 inline-flex items-center justify-center',
          isMicro ? 'size-5 min-h-[20px] min-w-[20px]' : 'size-7 min-h-[28px] min-w-[28px]',
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

export default Attachment;
