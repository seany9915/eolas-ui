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
    const toggleButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const asideRef = React.useRef<HTMLElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [isWideContainer, setIsWideContainer] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const assignRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Match DOM and visual reading order at the @3xl (768px) breakpoint when side="left"
    // so desktop Tab order flows left-to-right while compact layouts keep canvas first.
    React.useEffect(() => {
      if (side !== 'left') {
        setIsWideContainer(false);
        return;
      }
      const node = rootRef.current;
      if (!node) return;
      const updateWidth = (width: number) => {
        setIsWideContainer(width >= 768);
      };
      updateWidth(node.getBoundingClientRect().width);
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateWidth(entry.contentRect.width);
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    }, [side]);

    React.useEffect(() => {
      if (asideRef.current) {
        asideRef.current.inert = !isOpen;
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

    const handleCloseFromPane = () => {
      // Return focus to the header toggle before the pane becomes inert/hidden.
      toggleButtonRef.current?.focus();
      updateOpen(false);
    };

    const SupportingHeadingTag = title ? 'h3' : 'h2';
    const shouldRenderAsideFirst = side === 'left' && isWideContainer;

    const primaryCanvas = (
      <section
        key="primary-canvas"
        data-slot="primary-canvas"
        aria-label={typeof title === 'string' ? title : 'Workspace'}
        className="flex-1 flex flex-col min-w-0 min-h-0 bg-surface"
      >
        {canvasToolbar && (
          <div className="px-4 @md:px-6 py-2.5 border-b border-outline-variant/60 flex items-center justify-between gap-3 bg-surface shrink-0 min-w-0">
            {canvasToolbar}
          </div>
        )}
        <div className="flex-1 p-4 @md:p-6 overflow-y-auto min-h-0">
          {children}
        </div>
      </section>
    );

    const supportingAside = (
      <aside
        key="supporting-pane"
        ref={asideRef}
        id={paneId}
        data-slot="supporting-pane"
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden={!isOpen}
        aria-labelledby={supportingTitle ? supportingHeadingId : undefined}
        aria-label={!supportingTitle ? 'Supporting details' : undefined}
        className={cn(
          'flex flex-col bg-surface-container shrink-0 min-w-0 overflow-hidden transition-opacity duration-quick ease-standard motion-reduce:transition-none',
          isOpen
            ? cn(
                // Compact (<768px) stacked panel sizes naturally so content is not truncated in a fixed mini-drawer
                'w-full h-auto border-t border-outline-variant opacity-100',
                // Wide (@3xl+) full-height side panel
                paneWidthClassName,
                '@3xl:h-full @3xl:border-t-0',
                side === 'left'
                  ? '@3xl:border-r @3xl:border-outline-variant'
                  : '@3xl:border-l @3xl:border-outline-variant'
              )
            : 'w-full h-0 border-t-0 @3xl:w-0 @3xl:h-full @3xl:border-0 opacity-0 invisible pointer-events-none'
        )}
      >
        <div className={cn(paneWidthClassName, 'w-full flex flex-col flex-1 min-h-0 shrink-0 min-w-0')}>
          {/* Supporting Pane Header */}
          <div className="px-4 pt-4 pb-3 border-b border-outline-variant/60 flex items-center justify-between gap-2 bg-surface-container shrink-0">
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

            {(supportingActions || isOpen) && (
              <div
                className={cn(
                  'flex items-center gap-1 shrink-0',
                  !supportingActions && '@3xl:hidden'
                )}
              >
                {supportingActions}
                <div className="@3xl:hidden">
                  <Button
                    variant="text"
                    colorRole="neutral"
                    size="icon"
                    onClick={handleCloseFromPane}
                    aria-label="Close details"
                  >
                    <Icon name="close" size="sm" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Supporting Pane Body */}
          <div className="flex-1 p-4 overflow-y-auto min-w-0 min-h-0">
            {supportingContent}
          </div>
        </div>
      </aside>
    );

    return (
      <div
        ref={assignRootRef}
        data-slot="supporting-pane-block"
        className={cn(
          '@container w-full h-full bg-surface flex flex-col min-w-0',
          className
        )}
        {...props}
      >
        {/* Top Application Header Bar */}
        <div className="min-h-14 h-14 short:min-h-13 short:h-13 px-4 @md:px-6 border-b border-outline-variant flex items-center justify-between gap-3 bg-surface shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h2 className="font-heading text-base @md:text-headline-sm font-semibold text-on-surface truncate">
                {title}
              </h2>
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
              aria-label={isOpen ? 'Hide details' : 'Show details'}
            >
              <Icon.Toggle
                active={isOpen}
                onName={side === 'left' ? 'left_panel_close' : 'right_panel_close'}
                offName={side === 'left' ? 'left_panel_open' : 'right_panel_open'}
                size="sm"
              />
              <span className="hidden @sm:inline">
                {isOpen ? 'Hide details' : 'Show details'}
              </span>
            </Button>
          </div>
        </div>

        {/* Main Container Split: Primary Canvas + Supporting Pane */}
        <div className="flex-1 flex flex-col @3xl:flex-row min-h-0 overflow-hidden relative">
          {shouldRenderAsideFirst ? [supportingAside, primaryCanvas] : [primaryCanvas, supportingAside]}
        </div>
      </div>
    );
  }
);
SupportingPaneBlock.displayName = 'SupportingPaneBlock';

export default SupportingPaneBlock;
