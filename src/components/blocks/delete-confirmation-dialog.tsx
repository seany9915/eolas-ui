/**
 * DeleteConfirmationDialog block.
 *
 * Presentational composite modal for destructive confirmation workflows.
 * Composes Dialog and Button primitives with WCAG 2.2 AA accessible focus trapping,
 * 44px minimum touch targets, and high-contrast error styling.
 */
import * as React from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title = 'Delete item',
  description,
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content size="sm" className="max-w-md">
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 min-w-11 min-h-11 rounded-full bg-error-container text-on-error-container shrink-0">
            <Icon name="delete" size="lg" aria-hidden="true" />
          </div>
          <div className="space-y-1 pt-1 text-left">
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{description ?? defaultDescription}</AlertDialog.Description>
          </div>
        </div>

        <AlertDialog.Footer className="mt-6">
          <Button
            variant="outlined"
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
              await onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default DeleteConfirmationDialog;
