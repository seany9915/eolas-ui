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
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const DialogDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Dialog
        title="Schedule Practice Session"
        description="Configure session time, assigned therapist, and practice goals."
        trigger={
          <Button colorRole="primary">
            <Icon name="event" size="xs" className="mr-2" />
            Open Consultation Dialog
          </Button>
        }
        confirmLabel="Confirm Session"
        cancelLabel="Discard"
      >
        <div className="space-y-3 py-2 text-xs font-sans text-on-surface-variant">
          <p>
            Learner P-2024-819 has been scheduled for sound practice evaluation under Sarah Jenkins, Speech-Language Pathologist.
          </p>
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant font-mono text-xs">
            Room: Studio B | Focus: /r/ Blends | Format: Individual
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const AlertDialogDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <AlertDialog
        title="Reset Security Access Key"
        description="Are you sure you want to reset the security access key for this account? This will require signing in again on all devices."
        trigger={
          <Button colorRole="error">
            <Icon name="warning" size="xs" className="mr-2" />
            Reset Key (Alert Dialog)
          </Button>
        }
        confirmLabel="Reset Key Now"
        cancelLabel="Keep Active"
      />
    </div>
  );
};

export const DrawerDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Drawer
        title="Learner Profile Drawer"
        description="Practice history and recent audio recordings."
        swipeDirection="right"
        trigger={
          <Button variant="outlined" colorRole="secondary">
            <Icon name="menu_open" size="xs" className="mr-2" />
            Open Profile Drawer
          </Button>
        }
      >
        <div className="space-y-4 py-4 text-xs font-sans text-on-surface-variant">
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant">
            <span className="font-bold text-on-surface block mb-1">Practice Status: Active</span>
            <span>Accuracy: 92% | Streak: 5 days | Weekly Goal: Met</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant">
            <span className="font-bold text-on-surface block mb-1">Recent Practice Sessions:</span>
            <span>Session 12: 95% | Session 11: 88% | Session 10: 91%</span>
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
        <Popover.Trigger render={<Button variant="outlined">Practice Scoring Rules</Button>} />
        <Popover.Portal>
          <Popover.Positioner side="bottom" sideOffset={8}>
            <Popover.Popup className="p-4 max-w-sm rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-2">
              <span className="font-heading text-xs font-bold text-on-surface block">
                Scoring Rubric
              </span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Pronunciation scoring evaluates initial consonant clarity and sustained vowel duration. Accuracy scores reflect therapist-verified target sounds.
              </p>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export const MenuDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Menu.Root>
        <Menu.Trigger render={<Button variant="tonal">Actions Menu <Icon name="expand_more" size="xs" className="ml-1" /></Button>} />
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup className="p-1 min-w-48 rounded-xl bg-surface border border-outline-variant shadow-ambient">
              <Menu.Item className="px-3 py-2 text-xs font-sans font-medium text-on-surface hover:bg-surface-container rounded-lg cursor-pointer">
                Export Progress Report
              </Menu.Item>
              <Menu.Item className="px-3 py-2 text-xs font-sans font-medium text-on-surface hover:bg-surface-container rounded-lg cursor-pointer">
                Assign Practice Group
              </Menu.Item>
              <Menu.Separator className="h-px bg-outline-variant my-1" />
              <Menu.Item className="px-3 py-2 text-xs font-sans font-medium text-error hover:bg-error-container rounded-lg cursor-pointer">
                Archive Learner Profile
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

export const MenubarDemo: React.FC<ComponentDemoProps> = () => {
  const [showVitals, setShowVitals] = React.useState(true);
  const [showWaveform, setShowWaveform] = React.useState(false);
  const [density, setDensity] = React.useState('normal');

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-outline-variant bg-surface overflow-hidden">
      {/* Top Application Menubar Chrome */}
      <Menubar className="border-b border-outline-variant rounded-none bg-surface-container/30 px-2 py-1">
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
      <div className="p-6 bg-surface space-y-3 min-h-[140px]">
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
  return (
    <div className="w-full max-w-md mx-auto py-8">
      <ContextMenu.Root>
        <ContextMenu.Trigger className="w-full h-32 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container/40 flex flex-col items-center justify-center text-center p-4 cursor-context-menu select-none">
          <Icon name="touch_app" size="md" className="text-primary mb-2" />
          <span className="font-heading text-xs font-bold text-on-surface">Right Click or Long Press Here</span>
          <span className="font-sans text-[11px] text-on-surface-variant">Triggers Base UI ContextMenu popup</span>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup className="p-1 min-w-40 rounded-xl bg-surface border border-outline-variant shadow-ambient text-xs">
              <ContextMenu.Item className="px-3 py-2 rounded-lg hover:bg-surface-container cursor-pointer">
                View Session History
              </ContextMenu.Item>
              <ContextMenu.Item className="px-3 py-2 rounded-lg hover:bg-surface-container cursor-pointer">
                Assign Therapist
              </ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  );
};

export const TooltipDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-8">
      {/* 1. Canonical Compound Base UI Tooltip with explicit Tooltip.Arrow */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="outlined" size="sm">Compound Tooltip (with Arrow)</Button>} />
          <Tooltip.Portal>
            <Tooltip.Positioner side="top" sideOffset={8}>
              <Tooltip.Popup className="relative px-3 py-1.5 rounded-md bg-on-surface text-surface font-label text-xs font-medium shadow-ambient">
                <Tooltip.Arrow className="text-on-surface" />
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
        <Button variant="tonal" size="sm">
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
        <PreviewCard.Trigger href="#" className="font-sans text-sm font-bold text-primary underline underline-offset-4">
          Hover over Alex Rivera (Therapist Card)
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner side="bottom" sideOffset={8}>
            <PreviewCard.Popup className="p-4 max-w-xs rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold">
                  AR
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-on-surface">Dr. Alex Rivera</h4>
                  <span className="font-sans text-[11px] text-on-surface-variant">Speech-Language Pathologist</span>
                </div>
              </div>
              <p className="font-sans text-xs text-on-surface-variant">
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
