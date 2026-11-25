'use client';

/**
 * SupportingPaneBlock composite block.
 *
 * Layer: Composite Block (`src/components/blocks/`)
 * Foundation: Built strictly from primitives and design tokens:
 * - `Button` (`src/components/ui/button.tsx`)
 * - `Icon` (`src/components/ui/icon.tsx`)
 * - `Badge` (`src/components/ui/badge.tsx`)
 *
 * TAXONOMY & USAGE:
 * - Canonical supporting pane layout for focused tasks (audio drill canvas, exercise workspace)
 *   paired with an auxiliary side inspector (clinician tips, phonetic targets, session notes).
 * - Implements responsive container queries (`@container`):
 *   - On large containers (`@3xl:` / `>=768px`): Side-by-side layout with docked pane (left or right).
 *   - On compact containers (`<768px`): Full-width stacked layout below the primary workspace.
 *   - On compact height (`short:`): Tightens top bar height while preserving 44px touch target focus rings.
 * - Targeted opacity transition (`duration-quick`, zero `transition-all`) with reduced-motion fallback.
 * - Restores keyboard focus cleanly when closed from inside the pane and marks closed panes inert.
 * - Zero direct `<button>` tags outside primitives.
 */
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge, type BadgeColorRole } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface SupportingPaneBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Main primary workspace or canvas content */
  children: React.ReactNode;
  /** Auxiliary supporting content (notes, clinician tips, inspector details) */
  supportingContent: React.ReactNode;
  /** Title of the main workspace */
  title?: React.ReactNode;
  /** Title of the supporting pane */
  supportingTitle?: React.ReactNode;
  /** Heading tag used for the workspace title (supporting heading auto-steps down by 1). Defaults to `'h2'`. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  /** Custom accessible/visible label for opening the supporting pane. */
  showLabel?: string;
  /** Custom accessible/visible label for closing the supporting pane. */
  hideLabel?: string;
  /** Optional badge for the supporting pane (e.g. "Tips", "Notes", "3 Items") */
  supportingBadge?: string;
  /** Color role for the supporting badge */
  supportingBadgeColorRole?: BadgeColorRole;
  /** Side where the supporting pane docks on large screens ('right' default, 'left' supported) */
  side?: 'left' | 'right';
  /** Controlled open state for the supporting pane */
  open?: boolean;
  /** Default open state if uncontrolled */
  defaultOpen?: boolean;
  /** Callback fired when the supporting pane open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Header actions slot for the main workspace */
  actions?: React.ReactNode;
  /** Secondary action/status bar for the primary canvas matching the supporting pane toolbar height */
  canvasToolbar?: React.ReactNode;
  /** Header actions slot for the supporting pane */
  supportingActions?: React.ReactNode;
  /** Width class for the docked supporting pane on desktop */
  paneWidthClassName?: string;
  className?: string;
}

export const SupportingPaneBlock = React.forwardRef<HTMLDivElement, SupportingPaneBlockProps>(
  (
    {
      children,
      supportingContent,
      title,
      supportingTitle = 'Supporting Details',
      titleAs = 'h2',
      showLabel,
      hideLabel,
      supportingBadge,
      supportingBadgeColorRole = 'neutral',
      side = 'right',
      open: controlledOpen,
      defaultOpen = true,
      onOpenChange,
      actions,
      canvasToolbar,
      supportingActions,
      paneWidthClassName = '@3xl:w-80 @4xl:w-96',
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const paneId = React.useId();
    const supportingHeadingId = React.useId();
    const asideRef = React.useRef<HTMLElement | null>(null);
    const toggleButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    React.useEffect(() => {
      const aside = asideRef.current;
      if (!aside) return;
      if (!isOpen && aside.contains(document.activeElement)) {
        toggleButtonRef.current?.focus();
      }
    }, [isOpen]);

    const updateOpen = (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    };

    const handleToggle = () => {
      updateOpen(!isOpen);
    };

    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
    const TitleTag = titleAs;
    const SupportingHeadingTag =
      title ? headingLevels[Math.min(headingLevels.indexOf(titleAs) + 1, headingLevels.length - 1)] : titleAs;

    const supportingTitleText =
      typeof supportingTitle === 'string' && supportingTitle.trim() ? supportingTitle.trim() : 'details';
    const resolvedShowLabel = showLabel ?? `Show ${supportingTitleText}`;
    const resolvedHideLabel = hideLabel ?? `Hide ${supportingTitleText}`;

    const primaryCanvas = (
      <section
        key="primary-canvas"
        data-slot="primary-canvas"
        aria-label={typeof title === 'string' ? title : 'Workspace'}
        className="flex-1 flex flex-col min-w-0 min-h-0 bg-surface"
      >
        {canvasToolbar && (
          <div className="px-4 @md:px-6 py-2.5 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 bg-surface shrink-0 min-w-0">
            {canvasToolbar}
          </div>
        )}
        <ScrollArea
          className="flex-1 min-h-0"
          viewportClassName="overscroll-contain"
        >
          <div className="p-4 @md:p-6">{children}</div>
        </ScrollArea>
      </section>
    );

    const supportingAside = (
      <aside
        key="supporting-pane"
        ref={asideRef}
        id={paneId}
        data-slot="supporting-pane"
        data-state={isOpen ? 'open' : 'closed'}
        inert={!isOpen}
        aria-hidden={!isOpen}
        aria-labelledby={supportingTitle ? supportingHeadingId : undefined}
        aria-label={!supportingTitle ? 'Supporting details' : undefined}
        className={cn(
          'flex flex-col bg-surface-container-low shrink-0 min-w-0 overflow-hidden',
          isOpen
            ? cn(
                // Compact (<768px) stacked panel caps height so primary canvas keeps majority height
                'w-full h-auto max-h-64 @sm:max-h-72 short:max-h-40 @3xl:max-h-none opacity-100 transition-opacity duration-quick ease-standard motion-reduce:transition-none',
                paneWidthClassName,
                // Wide (@3xl+) full-height side panel
                '@3xl:h-full',
                side === 'left'
                  ? 'border-b border-outline @3xl:border-b-0 @3xl:border-e'
                  : 'border-t border-outline @3xl:border-t-0 @3xl:border-s'
              )
            : 'w-full h-0 border-0 @3xl:w-0 @3xl:h-full @3xl:border-0 opacity-0 invisible pointer-events-none'
        )}
      >
        <div className={cn('w-full flex flex-col flex-1 min-h-0 shrink-0 min-w-0', paneWidthClassName)}>
          {/* Supporting Pane Header */}
          <div className="px-4 pt-4 pb-3 border-b border-outline-variant/60 flex items-center justify-between gap-2 bg-surface-container-low shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {supportingTitle && (
                <SupportingHeadingTag
                  id={supportingHeadingId}
                  className="font-heading text-base font-semibold text-on-surface truncate"
                >
                  {supportingTitle}
                </SupportingHeadingTag>
              )}
              {supportingBadge && (
                <Badge
                  variant="soft"
                  colorRole={supportingBadgeColorRole}
                  size="sm"
                >
                  {supportingBadge}
                </Badge>
              )}
            </div>

            {supportingActions && (
              <div className="flex items-center gap-1 shrink-0">
                {supportingActions}
              </div>
            )}
          </div>

          {/* Supporting Pane Body */}
          <ScrollArea
            className="flex-1 min-w-0 min-h-0"
            viewportClassName="overscroll-contain"
          >
            <div className="p-4">{supportingContent}</div>
          </ScrollArea>
        </div>
      </aside>
    );

    return (
      <div
        ref={ref}
        data-slot="supporting-pane-block"
        className={cn(
          '@container size-full bg-surface flex flex-col min-w-0',
          className
        )}
        {...props}
      >
        {/* Top Application Header Bar */}
        <div className="min-h-14 short:min-h-14 py-2 px-4 @md:px-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-3 bg-surface shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <TitleTag className="font-heading text-base @md:text-headline-sm font-semibold text-on-surface truncate">
                {title}
              </TitleTag>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <Button
              ref={toggleButtonRef}
              variant={isOpen ? 'soft' : 'outline'}
              colorRole={isOpen ? 'primary' : 'neutral'}
              size="sm"
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-controls={paneId}
              aria-label={isOpen ? resolvedHideLabel : resolvedShowLabel}
              className="min-w-11"
            >
              <Icon.Toggle
                active={isOpen}
                onName={side === 'left' ? 'left_panel_close' : 'right_panel_close'}
                offName={side === 'left' ? 'left_panel_open' : 'right_panel_open'}
                size="sm"
                directional
              />
              <span className="hidden @sm:inline">
                {isOpen ? resolvedHideLabel : resolvedShowLabel}
              </span>
            </Button>
          </div>
        </div>

        {/* Main Container Split: Primary Canvas + Supporting Pane */}
        <div className="flex-1 flex flex-col @3xl:flex-row min-h-0 overflow-hidden relative">
          {side === 'left' ? (
            <>
              {supportingAside}
              {primaryCanvas}
            </>
          ) : (
            <>
              {primaryCanvas}
              {supportingAside}
            </>
          )}
        </div>
      </div>
    );
  }
);
SupportingPaneBlock.displayName = 'SupportingPaneBlock';

export default SupportingPaneBlock;
