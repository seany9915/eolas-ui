/**
 * DeleteConfirmationDialog block.
 *
 * @deprecated Use `AlertDialog` from `@/components/ui/alert-dialog` directly (`closeOnConfirm={false}`
 * with controlled `open` state for async deletion flows).
 *
 * Presentational composite modal for destructive confirmation workflows.
 * Composes Dialog and Button primitives with WCAG 2.2 AA accessible focus trapping,
 * 44px minimum touch targets, and high-contrast error styling.
 */
import * as React from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

/**
 * @deprecated Use `AlertDialogProps` from `@/components/ui/alert-dialog` directly instead.
 */
export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** If this rejects, the dialog stays open and shows errorMessage so the user can retry. */
  onConfirm: () => void | Promise<void>;
  errorMessage?: string;
  /** Called with the rejection reason when onConfirm fails */
  onError?: (error: unknown) => void;
  isLoading?: boolean;
}

/**
 * @deprecated Use `AlertDialog` from `@/components/ui/alert-dialog` directly instead.
 */
export const DeleteConfirmationDialog = React.forwardRef<
  HTMLDivElement,
  DeleteConfirmationDialogProps
>(({
  open,
  onOpenChange,
  title = 'Delete item',
  description,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  errorMessage = 'Something went wrong. Try again.',
  onError,
  isLoading = false,
}, ref) => {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!open) setFailed(false);
  }, [open]);

  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content ref={ref} size="md">
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center size-11 rounded-full bg-error-container text-on-error-container shrink-0">
            <Icon name="delete" size="lg" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1 pt-1 text-left">
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{description ?? defaultDescription}</AlertDialog.Description>
            {failed && (
              <p role="alert" className="font-sans text-sm font-medium text-error">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <AlertDialog.Footer className="mt-6">
          <Button
            variant="outline"
            colorRole="neutral"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="filled"
            colorRole="error"
            loading={isLoading}
            onClick={async () => {
              setFailed(false);
              try {
                await onConfirm();
              } catch (error) {
                setFailed(true);
                onError?.(error);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
});

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog';

export default DeleteConfirmationDialog;
