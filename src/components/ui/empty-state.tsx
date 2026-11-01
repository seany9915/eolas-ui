/**
 * EmptyState primitive (backward-compatibility alias for Empty).
 * Canonical primitive resides at @/components/ui/empty.
 * Conforms to https://ui.shadcn.com/docs/components/base/empty
 */
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from './empty';

export {
  Empty as EmptyState,
  EmptyHeader as EmptyStateHeader,
  EmptyMedia as EmptyStateIcon,
  EmptyTitle as EmptyStateTitle,
  EmptyDescription as EmptyStateDescription,
  EmptyContent as EmptyStateActions,
};

export type {
  EmptyProps as EmptyStateProps,
  EmptyHeaderProps as EmptyStateHeaderProps,
  EmptyMediaProps as EmptyStateIconProps,
  EmptyTitleProps as EmptyStateTitleProps,
  EmptyDescriptionProps as EmptyStateDescriptionProps,
  EmptyContentProps as EmptyStateActionsProps,
} from './empty';

export default Empty;
