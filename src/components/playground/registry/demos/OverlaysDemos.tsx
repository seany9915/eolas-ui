import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Drawer } from '@/components/ui/drawer';
import { Popover } from '@/components/ui/popover';
import { Menu } from '@/components/ui/menu';
import { Menubar } from '@/components/ui/menubar';
import { ContextMenu } from '@/components/ui/context-menu';
import { Tooltip } from '@/components/ui/tooltip';
import { PreviewCard } from '@/components/ui/preview-card';
import { Confirmation } from '@/components/ui/confirmation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { ComponentDemoProps } from '../types';

export const DialogDemo: React.FC<ComponentDemoProps> = () => {
  const [bgClicks, setBgClicks] = React.useState(0);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-8">
      <Button
        variant="text"
        colorRole="neutral"
        size="sm"
        onClick={() => setBgClicks((c) => c + 1)}
      >
        Test page click ({bgClicks})
      </Button>

      <Dialog
        title="Schedule Practice Session"
        description="Configure session time, assigned therapist, and practice goals."
        trigger={
          <Button colorRole="primary">
            <Icon name="event" size="sm" />
            Open Consultation Dialog
          </Button>
        }
        confirmLabel="Confirm Session"
        cancelLabel="Discard"
      >
        <div className="flex flex-col gap-3 py-2 text-base font-sans text-on-surface-variant">
          <p>
            Learner P-2024-819 has been scheduled for sound practice evaluation under Sarah Jenkins, Speech-Language Pathologist.
          </p>
          <div className="p-3 rounded-md bg-surface-container-low border border-outline-variant text-sm text-on-surface">
            Room: Studio B · Focus: /r/ Blends · Format: Individual
          </div>
        </div>
      </Dialog>

      <Dialog
        modal={false}
        disablePointerDismissal
        containerClassName="items-end justify-end p-6"
        size="sm"
        title="Quick Session Note"
        description="Non-modal dialogs leave the workspace interactive behind them."
        trigger={
          <Button variant="outline" colorRole="neutral">
            <Icon name="dock_to_bottom" size="sm" />
            Non-Modal Dialog
          </Button>
        }
      >
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          Background page clicks recorded while open: <span className="font-semibold text-on-surface">{bgClicks}</span>
        </p>
      </Dialog>
    </div>
  );
};

export const AlertDialogDemo: React.FC<ComponentDemoProps> = () => {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <AlertDialog
        title="Reset Security Access Key"
        description="Are you sure you want to reset the security access key for this account? This will require signing in again on all devices."
        trigger={
          <Button colorRole="error">
            <Icon name="warning" size="xs" />
            Reset Key (Alert Dialog)
          </Button>
        }
        confirmLabel="Reset Key Now"
        cancelLabel="Keep Active"
      />

      <Button variant="outline" colorRole="error" onClick={() => setDeleteOpen(true)}>
        <Icon name="delete" size="xs" />
        Delete Session Notes
      </Button>

      <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialog.Content size="md">
          <div className="flex items-start gap-3.5">
            <div className="flex items-center justify-center size-11 rounded-full bg-error-container text-on-error-container shrink-0">
              <Icon name="delete" size="lg" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 pt-1 text-left">
              <AlertDialog.Title>Delete note</AlertDialog.Title>
              <AlertDialog.Description>
                Delete &ldquo;Session Notes (Draft)&rdquo;? This cannot be undone.
              </AlertDialog.Description>
            </div>
          </div>
          <AlertDialog.Footer className="mt-4">
            <Button
              variant="outline"
              colorRole="neutral"
              size="md"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              colorRole="error"
              size="md"
              onClick={() => setDeleteOpen(false)}
            >
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export const DrawerDemo: React.FC<ComponentDemoProps> = () => {
  const [pageClicks, setPageClicks] = React.useState(0);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-8">
      <Button
        variant="text"
        colorRole="neutral"
        size="sm"
        onClick={() => setPageClicks((c) => c + 1)}
      >
        Test page click ({pageClicks})
      </Button>

      <Drawer
        title="Learner Profile Drawer"
        description="Practice history and recent audio recordings."
        swipeDirection="right"
        trigger={
          <Button variant="outline" colorRole="secondary">
            <Icon name="menu_open" size="sm" />
            Side Drawer
          </Button>
        }
      >
        <div className="flex flex-col gap-3 py-2 text-sm font-sans text-on-surface-variant">
          <div className="p-3.5 rounded-md bg-surface-container-low border border-outline-variant flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Practice Status: Active</span>
            <span>Accuracy: 92% · Streak: 5 days · Weekly Goal: Met</span>
          </div>
          <div className="p-3.5 rounded-md bg-surface-container-low border border-outline-variant flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Recent Practice Sessions</span>
            <span>Session 12: 95% · Session 11: 88% · Session 10: 91%</span>
          </div>
        </div>
      </Drawer>

      <Drawer
        title="Session cues"
        description="Drag up or down to switch between peek height and full sheet view."
        swipeDirection="down"
        snapPoints={['280px', 0.85]}
        trigger={
          <Button variant="outline" colorRole="primary">
            <Icon name="drag_handle" size="sm" />
            Snap Points Sheet
          </Button>
        }
      >
        <div className="flex flex-col gap-3 py-2 text-sm font-sans text-on-surface-variant">
          <div className="p-3.5 rounded-md bg-surface-container-low flex items-center justify-between gap-2">
            <span className="font-heading font-semibold text-on-surface">Vocalic /r/ cue</span>
            <Badge variant="soft" colorRole="primary" size="sm">Level 2</Badge>
          </div>
          <p className="text-base text-on-surface leading-relaxed">
            Ask the learner to pull the tongue blade back slightly while keeping both sides braced against the upper molars.
          </p>
          <div className="p-3.5 rounded-md bg-surface-container-low flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Practice words</span>
            <span>Rabbit · Road · River · Car · Star · Door</span>
          </div>
          <div className="p-3.5 rounded-md bg-surface-container-low flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Listening prompt</span>
            <span>Keep vowel onset steady for 2 seconds before releasing into the word.</span>
          </div>
        </div>
      </Drawer>

      <Drawer
        title="Quick reference"
        description="This non-modal drawer leaves the page interactive and stays open on outside clicks."
        swipeDirection="right"
        modal={false}
        disablePointerDismissal
        trigger={
          <Button variant="soft" colorRole="neutral">
            <Icon name="dock_to_right" size="sm" />
            Non-Modal Inspector
          </Button>
        }
      >
        <div className="flex flex-col gap-3 py-2 text-sm font-sans text-on-surface-variant">
          <div className="p-3.5 rounded-md bg-surface-container-low border border-outline-variant flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Interactive workspace</span>
            <span>Try clicking “Test page click” in the preview behind this panel without dismissing it.</span>
          </div>
          <div className="p-3.5 rounded-md bg-surface-container-low border border-outline-variant flex flex-col gap-1">
            <span className="font-heading font-semibold text-on-surface">Live counter check</span>
            <span>Current background click count: {pageClicks}</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const PopoverDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline">Practice Scoring Rules</Button>} />
        <Popover.Content side="bottom" sideOffset={8}>
          <Popover.Title>Scoring Rubric</Popover.Title>
          <Popover.Description className="mb-0">
            Pronunciation scoring evaluates initial consonant clarity and sustained vowel duration. Accuracy scores reflect therapist-verified target sounds.
          </Popover.Description>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const MenuDemo: React.FC<ComponentDemoProps> = () => {
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button variant="soft">
                <span>Actions Menu</span>
                <Icon name="expand_more" size="sm" />
              </Button>
            }
          />
          <Menu.Content align="start">
            <Menu.Group>
              <Menu.GroupLabel>Learner record</Menu.GroupLabel>
              <Menu.Item icon="download" onClick={() => setLastAction('Exported progress report')}>
                Export Progress Report
              </Menu.Item>
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger icon="group_add">Assign Practice Group</Menu.SubmenuTrigger>
                <Menu.Content>
                  <Menu.Item onClick={() => setLastAction('Assigned to Morning Blends')}>
                    Morning Blends
                  </Menu.Item>
                  <Menu.Item onClick={() => setLastAction('Assigned to Vocalic /r/ Cohort')}>
                    Vocalic /r/ Cohort
                  </Menu.Item>
                </Menu.Content>
              </Menu.SubmenuRoot>
              <Menu.CheckboxItem
                checked={notifyEmail}
                onCheckedChange={(checked) => setNotifyEmail(Boolean(checked))}
                icon="notifications"
              >
                Email Guardian Summary
              </Menu.CheckboxItem>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.Item
                destructive
                icon="archive"
                onClick={() => setLastAction('Archived learner profile')}
              >
                Archive Learner Profile
              </Menu.Item>
            </Menu.Group>
          </Menu.Content>
        </Menu.Root>

        <Menu.FilterProvider>
          <Menu.Root>
            <Menu.Trigger
              render={
                <Button variant="outline" colorRole="neutral">
                  <Icon name="search" size="sm" />
                  <span>Filterable Menu</span>
                </Button>
              }
            />
            <Menu.Content align="start">
              <Menu.Input showClear aria-label="Filter actions" placeholder="Filter actions..." />
              <Menu.Empty>No matching actions found.</Menu.Empty>
              <Menu.List>
                <Menu.Group>
                  <Menu.GroupLabel>Session tools</Menu.GroupLabel>
                  <Menu.Item icon="record_voice_over" onClick={() => setLastAction('Started sound drill')}>
                    Start Sound Drill
                  </Menu.Item>
                  <Menu.Item icon="mic" onClick={() => setLastAction('Recorded baseline audio')}>
                    Record Baseline Audio
                  </Menu.Item>
                  <Menu.Item icon="schedule" onClick={() => setLastAction('Scheduled next check-in')}>
                    Schedule Next Check-in
                  </Menu.Item>
                  <Menu.Item icon="summarize" onClick={() => setLastAction('Drafted session note')}>
                    Draft Session Note
                  </Menu.Item>
                </Menu.Group>
              </Menu.List>
            </Menu.Content>
          </Menu.Root>
        </Menu.FilterProvider>
      </div>

      {lastAction && (
        <span className="font-sans text-sm text-on-surface-variant">
          Last selected: <span className="font-medium text-on-surface">{lastAction}</span>
        </span>
      )}
    </div>
  );
};

export const MenubarDemo: React.FC<ComponentDemoProps> = () => {
  const [showVitals, setShowVitals] = React.useState(true);
  const [showWaveform, setShowWaveform] = React.useState(false);
  const [density, setDensity] = React.useState('normal');

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-outline-variant bg-surface overflow-hidden">
      {/* Top Application Menubar Chrome */}
      <Menubar variant="flush" className="bg-surface-container-low px-2 py-1">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item icon="person_add" shortcut="⌘N">
              New Learner Profile
            </Menubar.Item>
            <Menubar.Item icon="file_download" shortcut="⌘E">
              Export Practice Summary
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item icon="logout" destructive>
              Close Session
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item icon="undo" shortcut="⌘Z">
              Undo Session Note
            </Menubar.Item>
            <Menubar.Item icon="redo" shortcut="⇧⌘Z">
              Redo Entry
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item icon="content_copy">
              Copy Practice Notes
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem
              checked={showVitals}
              onCheckedChange={(c) => setShowVitals(Boolean(c))}
              icon="monitor_heart"
            >
              Show Live Waveform
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem
              checked={showWaveform}
              onCheckedChange={(c) => setShowWaveform(Boolean(c))}
              icon="show_chart"
            >
              Show Accuracy Chart
            </Menubar.CheckboxItem>
            <Menubar.Separator />
            <Menubar.Submenu>
              <Menubar.SubmenuTrigger icon="density_medium">
                Interface Density
              </Menubar.SubmenuTrigger>
              <Menubar.Content>
                <Menubar.RadioGroup value={density} onValueChange={setDensity}>
                  <Menubar.RadioItem value="compact">
                    Compact (36px rows)
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="normal">
                    Standard (44px rows)
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="roomy">
                    Comfortable (52px rows)
                  </Menubar.RadioItem>
                </Menubar.RadioGroup>
              </Menubar.Content>
            </Menubar.Submenu>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Clinical</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item icon="mic">
              Phonetic Transcription
            </Menubar.Item>
            <Menubar.Item icon="record_voice_over">
              Articulation Drill
            </Menubar.Item>
            <Menubar.Item icon="summarize">
              Synthesize Diagnostic Report
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>

      {/* Mock Workspace Content Area */}
      <div className="p-6 bg-surface flex flex-col gap-3 min-h-[140px]">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
          <div>
            <h5 className="font-heading text-sm font-semibold text-on-surface">Practice Session: Learner #4892</h5>
            <p className="font-sans text-xs text-on-surface-variant">Speech Therapy — Morning Studio Group</p>
          </div>
          <div className="flex items-center gap-2">
            {showVitals && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-success-container text-on-success-container">
                <Icon name="favorite" size="xs" className="text-success" />
                <span>92% Accuracy</span>
              </span>
            )}
            {showWaveform && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-primary-container text-on-primary-container">
                <Icon name="wifi_tethering" size="xs" className="text-primary" />
                <span>Live Audio</span>
              </span>
            )}
          </div>
        </div>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          Use the menubar above to toggle views, adjust density, or export session notes. Fully operable with keyboard shortcuts.
        </p>
      </div>
    </div>
  );
};

export const ContextMenuDemo: React.FC<ComponentDemoProps> = () => {
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-md mx-auto py-8 flex flex-col gap-3">
      <ContextMenu.Root>
        <ContextMenu.Trigger className="w-full min-h-36 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-1.5 text-center p-6 cursor-context-menu select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Icon name="touch_app" size="md" className="text-primary" />
          <span className="font-heading text-sm font-semibold text-on-surface">
            Right-click or long-press this area
          </span>
          <span className="font-sans text-sm text-on-surface-variant">
            Opens the pointer-anchored context menu
          </span>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Group>
            <ContextMenu.Item icon="history" shortcut="⌘H" onClick={() => setSelectedAction('Viewed session history')}>
              View Session History
            </ContextMenu.Item>
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger icon="person">Assign Clinician</ContextMenu.SubmenuTrigger>
              <ContextMenu.Content>
                <ContextMenu.Item onClick={() => setSelectedAction('Assigned Dr. Sarah Adams')}>
                  Dr. Sarah Adams
                </ContextMenu.Item>
                <ContextMenu.Item onClick={() => setSelectedAction('Assigned Dr. Michael Ryan')}>
                  Dr. Michael Ryan
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.SubmenuRoot>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item destructive icon="delete" onClick={() => setSelectedAction('Removed note')}>
              Remove Session Note
            </ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu.Root>

      {selectedAction && (
        <span className="font-sans text-sm text-center text-on-surface-variant">
          Last action: <span className="font-medium text-on-surface">{selectedAction}</span>
        </span>
      )}
    </div>
  );
};

export const TooltipDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-8">
      {/* 1. Canonical Compound Base UI Tooltip with explicit Tooltip.Arrow */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="outline" size="sm">Compound Tooltip (with Arrow)</Button>} />
          <Tooltip.Portal>
            <Tooltip.Positioner side="top" sideOffset={8}>
              <Tooltip.Popup>
                <Tooltip.Arrow />
                Pronunciation Guide: Section 2.1 Sound Blends
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* 2. Shorthand Tooltip with showArrow prop */}
      <Tooltip
        content="Shorthand Tooltip with built-in arrow and portal"
        showArrow
        side="bottom"
      >
        <Button variant="soft" size="sm">
          Shorthand Tooltip
        </Button>
      </Tooltip>
    </div>
  );
};

export const PreviewCardDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#clinician-alex-rivera">
          Hover over Alex Rivera (Therapist Card)
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="bottom" sideOffset={8}>
            <PreviewCard.Popup>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-semibold shrink-0">
                  AR
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-semibold text-on-surface">Dr. Alex Rivera</h4>
                  <span className="font-sans text-sm text-on-surface-variant">Speech-Language Pathologist</span>
                </div>
              </div>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                Specializes in child speech and language development. Outpatient Clinic Team.
              </p>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
    </div>
  );
};

export const ConfirmationDemo: React.FC<ComponentDemoProps> = () => {
  const [status, setStatus] = React.useState<'pending' | 'approved' | 'denied'>('pending');

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Confirmation.Root status={status} variant="card">
        <Confirmation.Header>
          <div>
            <Confirmation.Title>Confirm Weekly Goal Update</Confirmation.Title>
            <Confirmation.Description>
              The practice assistant recommends increasing the daily goal from 15 minutes to 20 minutes based on recent accuracy scores.
            </Confirmation.Description>
          </div>
        </Confirmation.Header>
        <Confirmation.Details>
          Proposed Action: Set daily practice target to 20 minutes
        </Confirmation.Details>
        <Confirmation.Actions>
          <Confirmation.Deny
            onDeny={() => setStatus('denied')}
            disabled={status !== 'pending'}
            label="Keep Current Goal"
          />
          <Confirmation.Approve
            onApprove={() => setStatus('approved')}
            disabled={status !== 'pending'}
            label="Update Goal"
          />
        </Confirmation.Actions>
      </Confirmation.Root>
    </div>
  );
};

export const CommandDemo: React.FC<ComponentDemoProps> = () => {
  const [open, setOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (actionName: string) => {
    setLastAction(actionName);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-4">
      {/* Trigger bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-surface border border-outline-variant shadow-ambient">
        <div className="flex flex-col gap-0.5 text-left">
          <p className="font-heading text-sm font-semibold text-on-surface">
            Quick Actions & Patient Search
          </p>
          <p className="font-sans text-xs text-on-surface-variant">
            Press the shortcut or click the button to open the command palette.
          </p>
        </div>
        <Button
          colorRole="primary"
          variant="outline"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          <Icon name="search" size="xs" aria-hidden="true" />
          <span>Open Menu</span>
          <Kbd size="sm">⌘K</Kbd>
        </Button>
      </div>

      {lastAction && (
        <div className="p-3 rounded-lg bg-surface-container-low text-xs font-sans text-on-surface flex items-center justify-between">
          <span>Selected action: <strong>{lastAction}</strong></span>
          <Button variant="unstyled" onClick={() => setLastAction(null)} className="text-on-surface-variant hover:text-on-surface text-xs underline">
            Clear
          </Button>
        </div>
      )}

      {/* Embedded inline command preview */}
      <div className="flex flex-col gap-2 text-left">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Embedded Command Menu
        </span>
        <Command className="rounded-lg border border-outline-variant shadow-card bg-surface focus-within:border-primary focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary transition-colors">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="max-h-[260px]">
            <CommandEmpty>No matching results found.</CommandEmpty>
            <CommandGroup heading="Patients">
              <CommandItem onSelect={() => setLastAction('Patient: Jane Doe')}>
                <Icon name="person" size="sm" aria-hidden="true" />
                <span>Jane Doe</span>
                <CommandShortcut>
                  <Kbd size="sm">P1</Kbd>
                </CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setLastAction('Patient: Liam Smith')}>
                <Icon name="person" size="sm" aria-hidden="true" />
                <span>Liam Smith</span>
                <CommandShortcut>
                  <Kbd size="sm">P2</Kbd>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => setLastAction('New Consultation')}>
                <Icon name="add" size="sm" aria-hidden="true" />
                <span>New Consultation</span>
                <CommandShortcut>
                  <Kbd size="sm">⌘N</Kbd>
                </CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setLastAction('Record Audio Drill')}>
                <Icon name="mic" size="sm" aria-hidden="true" />
                <span>Record Audio Drill</span>
                <CommandShortcut>
                  <Kbd size="sm">⌘R</Kbd>
                </CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setLastAction('Download Care Plan')}>
                <Icon name="download" size="sm" aria-hidden="true" />
                <span>Download Care Plan</span>
                <CommandShortcut>
                  <Kbd size="sm">⌘D</Kbd>
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {/* Modal Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No matching results found.</CommandEmpty>
          <CommandGroup heading="Patients">
            <CommandItem onSelect={() => handleSelect('Patient: Jane Doe')}>
              <Icon name="person" size="sm" aria-hidden="true" />
              <span>Jane Doe</span>
              <CommandShortcut><Kbd size="sm">P1</Kbd></CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('Patient: Liam Smith')}>
              <Icon name="person" size="sm" aria-hidden="true" />
              <span>Liam Smith</span>
              <CommandShortcut><Kbd size="sm">P2</Kbd></CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect('New Consultation')}>
              <Icon name="add" size="sm" aria-hidden="true" />
              <span>New Consultation</span>
              <CommandShortcut><Kbd size="sm">⌘N</Kbd></CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('Record Audio Drill')}>
              <Icon name="mic" size="sm" aria-hidden="true" />
              <span>Record Audio Drill</span>
              <CommandShortcut><Kbd size="sm">⌘R</Kbd></CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
