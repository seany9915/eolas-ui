'use client';

/**
 * Command primitive (cmdk + Base UI Dialog).
 *
 * Base UI Documentation: https://base-ui.com/react/components/dialog
 * cmdk Documentation: https://cmdk.paco.me
 *
 * TAXONOMY & USAGE:
 * - Use Command for fast, accessible command palettes, spotlight search, and quick action menus.
 * - Powered by cmdk for fuzzy searching, keyboard scoring, and grouped item filtering.
 * - CommandDialog integrates Base UI Dialog (with screen-reader accessible DialogTitle and
 *   DialogDescription) while retaining complete shadcn Command API compatibility.
 * - Follows DESIGN.md tokens: Lexend body font (font-sans), Atkinson Hyperlegible Next headings,
 *   surface-container-low wash for item selection, and strict semantic tokens.
 */
import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn, composeClassName } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog';
import { Icon } from './icon';

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {}

const CommandRoot = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      'flex size-full flex-col overflow-hidden rounded-lg bg-surface text-on-surface',
      className
    )}
    {...props}
  />
));
CommandRoot.displayName = CommandPrimitive.displayName;

export interface CommandDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  className?: React.ComponentPropsWithoutRef<typeof DialogContent>['className'];
  containerClassName?: React.ComponentPropsWithoutRef<typeof DialogContent>['containerClassName'];
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  initialFocus?: React.ComponentPropsWithoutRef<typeof DialogContent>['initialFocus'];
  finalFocus?: React.ComponentPropsWithoutRef<typeof DialogContent>['finalFocus'];
}

export function CommandDialog({
  open,
  defaultOpen,
  onOpenChange,
  title = 'Command menu',
  description,
  showCloseButton = false,
  children,
  className,
  containerClassName,
  modal = true,
  disablePointerDismissal = false,
  initialFocus,
  finalFocus,
}: CommandDialogProps): React.JSX.Element {
  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogContent
        size="xl"
        showCloseButton={false}
        data-slot="command-dialog"
        containerClassName={containerClassName}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        className={composeClassName('relative overflow-hidden p-0', className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {description && (
          <DialogDescription className="sr-only">{description}</DialogDescription>
        )}
        {showCloseButton && (
          <DialogClose
            aria-label="Close command menu"
            className="absolute top-1 end-1 z-10"
          >
            <Icon name="close" size="sm" aria-hidden="true" />
          </DialogClose>
        )}
        <CommandRoot className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-label [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-on-surface-variant [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]]:px-3 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:min-h-[44px]">
          {children}
        </CommandRoot>
      </DialogContent>
    </Dialog>
  );
}

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, icon, wrapperClassName, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className={cn('flex items-center gap-2 border-b border-outline-variant px-3 transition-colors duration-[var(--duration-quick)] focus-within:border-b-primary', wrapperClassName)}
    cmdk-input-wrapper=""
  >
    {icon ?? (
      <span
        className="material-symbols-outlined shrink-0 text-lg text-on-surface-variant select-none"
        aria-hidden="true"
      >
        search
      </span>
    )}
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        'flex h-11 w-full bg-transparent py-3 text-sm font-sans text-on-surface outline-none placeholder:text-on-surface-variant focus:outline-none focus-visible:outline-none focus:ring-0 border-none shadow-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn(
      'max-h-[min(300px,60dvh)] overflow-y-auto overflow-x-hidden p-1 overscroll-contain scroll-py-1',
      className
    )}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn('py-6 text-center text-sm font-sans text-on-surface-variant', className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      'text-on-surface [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-label [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-on-surface-variant',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn('-mx-1 my-1 h-px bg-outline-variant', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {}

export const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded px-3 py-2 min-h-[44px] text-sm font-sans outline-none transition-colors duration-[var(--duration-micro)] ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[disabled=true]:pointer-events-none data-[selected=true]:bg-primary-container data-[selected=true]:text-on-primary-container aria-selected:bg-primary-container aria-selected:text-on-primary-container data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_.material-symbols-outlined]:pointer-events-none [&_.material-symbols-outlined]:text-lg [&_.material-symbols-outlined]:shrink-0',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="command-shortcut"
    className={cn(
      'ms-auto font-mono text-xs tracking-widest text-on-surface-variant',
      className
    )}
    {...props}
  />
));
CommandShortcut.displayName = 'CommandShortcut';

export const CommandLoading = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Loading>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Loading
    ref={ref}
    data-slot="command-loading"
    className={cn('py-6 text-center text-sm font-sans text-on-surface-variant', className)}
    {...props}
  />
));
CommandLoading.displayName = CommandPrimitive.Loading.displayName;

export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator,
  Loading: CommandLoading,
});

export default Command;
