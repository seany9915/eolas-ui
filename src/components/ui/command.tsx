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
 *   surface-container wash for item selection, and strict semantic tokens.
 */
import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '@/lib/utils';
import { Dialog } from './dialog';

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {}

const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface text-on-surface',
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
  className?: string;
  containerClassName?: string;
  modal?: boolean | 'trap-focus';
  disablePointerDismissal?: boolean;
  initialFocus?: React.ComponentPropsWithoutRef<typeof Dialog.Popup>['initialFocus'];
  finalFocus?: React.ComponentPropsWithoutRef<typeof Dialog.Popup>['finalFocus'];
}

export function CommandDialog({
  open,
  defaultOpen,
  onOpenChange,
  title = 'Command menu',
  description,
  children,
  className,
  containerClassName,
  modal = true,
  disablePointerDismissal = false,
  initialFocus,
  finalFocus,
}: CommandDialogProps): React.JSX.Element {
  return (
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
      disablePointerDismissal={disablePointerDismissal}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-on-surface/40 z-50 overflow-hidden overscroll-contain transition-opacity duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ease-[var(--ease-standard)] motion-reduce:transition-none" />
        <Dialog.Viewport className={cn('fixed inset-0 z-50 p-4 flex items-center justify-center', containerClassName)}>
          <Dialog.Popup
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={cn(
              'w-full max-w-xl overflow-hidden p-0 rounded-xl bg-surface border border-outline-variant shadow-modal will-change-[opacity,transform] overscroll-contain transition-[opacity,transform] duration-[var(--duration-fast)] data-[ending-style]:duration-[var(--duration-quick)] data-[starting-style]:opacity-0 data-[starting-style]:scale-[var(--scale-large)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[var(--scale-large)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
              className
            )}
          >
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            {description && (
              <Dialog.Description className="sr-only">{description}</Dialog.Description>
            )}
            <CommandRoot className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-label [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-on-surface-variant [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]]:px-3 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:min-h-[44px]">
              {children}
            </CommandRoot>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, icon, wrapperClassName, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className={cn('flex items-center border-b border-outline-variant px-3', wrapperClassName)}
    cmdk-input-wrapper=""
  >
    {icon ?? (
      <span
        className="material-symbols-outlined mr-2 shrink-0 text-lg text-on-surface-variant select-none"
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
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'max-h-[300px] overflow-y-auto overflow-x-hidden p-1 overscroll-contain scroll-py-1',
      className
    )}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm font-sans text-on-surface-variant"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-on-surface [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-label [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-on-surface-variant',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-outline-variant', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {}

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 min-h-[40px] text-sm font-sans outline-none transition-colors duration-[var(--duration-micro)] ease-[var(--ease-standard)] data-[disabled=true]:pointer-events-none data-[selected=true]:bg-surface-container data-[selected=true]:text-on-surface aria-selected:bg-surface-container aria-selected:text-on-surface data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_.material-symbols-outlined]:pointer-events-none [&_.material-symbols-outlined]:text-lg [&_.material-symbols-outlined]:shrink-0',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element => (
  <span
    className={cn(
      'ml-auto font-mono text-xs tracking-widest text-on-surface-variant',
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = 'CommandShortcut';

export const CommandLoading = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Loading>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Loading
    ref={ref}
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
