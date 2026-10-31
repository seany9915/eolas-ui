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
        title="Schedule Clinical Consultation"
        description="Configure patient admission, assigned consultant, and triage priority."
        trigger={
          <Button colorRole="primary">
            <Icon name="event" size="xs" className="mr-2" />
            Open Consultation Dialog
          </Button>
        }
        confirmLabel="Confirm Admission"
        cancelLabel="Discard"
      >
        <div className="space-y-3 py-2 text-xs font-sans text-on-surface-variant">
          <p>
            Patient NHS #882-102-491 has been scheduled for emergency triage evaluation under Dr. Sarah Jenkins (On-Call Consultant).
          </p>
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant font-mono text-xs">
            Ward: ICU-Bay-02 | Priority: High | Bed: #4
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
        title="Revoke Clinician Access Tokens"
        description="Are you certain you wish to revoke all cryptographic signing keys for Dr. Mark Thorne? This action will immediately terminate active clinical sessions."
        trigger={
          <Button colorRole="error">
            <Icon name="warning" size="xs" className="mr-2" />
            Revoke Access (Alert Dialog)
          </Button>
        }
        confirmLabel="Revoke Access Now"
        cancelLabel="Keep Active"
      />
    </div>
  );
};

export const DrawerDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Drawer
        title="Emergency Patient Chart Drawer"
        description="Complete longitudinal health record and active telemetry stream."
        swipeDirection="right"
        trigger={
          <Button variant="outlined" colorRole="secondary">
            <Icon name="menu_open" size="xs" className="mr-2" />
            Open Patient Drawer
          </Button>
        }
      >
        <div className="space-y-4 py-4 text-xs font-sans text-on-surface-variant">
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant">
            <span className="font-bold text-on-surface block mb-1">Telemetry Status: Normal Sinus</span>
            <span>Heart Rate: 72 bpm | SpO2: 98% | BP: 120/80 mmHg</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant">
            <span className="font-bold text-on-surface block mb-1">Recent Lab Panels:</span>
            <span>Potassium: 4.1 mEq/L | Sodium: 139 mEq/L | Creatinine: 0.9 mg/dL</span>
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
        <Popover.Trigger render={<Button variant="outlined">Clinical Dosage Calculation Rules</Button>} />
        <Popover.Portal>
          <Popover.Positioner side="bottom" sideOffset={8}>
            <Popover.Popup className="p-4 max-w-sm rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-2">
              <span className="font-heading text-xs font-bold text-on-surface block">
                Dosage Safety Matrix
              </span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Calculations strictly follow NICE BNF pediatric body surface area (BSA) equations. Maximum daily cumulative threshold is 4,000 mg.
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
                Export Clinical Audit PDF
              </Menu.Item>
              <Menu.Item className="px-3 py-2 text-xs font-sans font-medium text-on-surface hover:bg-surface-container rounded-lg cursor-pointer">
                Transfer Patient to Bay
              </Menu.Item>
              <Menu.Separator className="h-px bg-outline-variant my-1" />
              <Menu.Item className="px-3 py-2 text-xs font-sans font-medium text-error hover:bg-error-container rounded-lg cursor-pointer">
                Discharge Patient
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

export const MenubarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Menubar
        menus={[
          {
            triggerLabel: 'File',
            items: [
              { id: 'new', label: 'New Caseload' },
              { id: 'save', label: 'Save Audit', shortcut: '⌘S' },
            ],
          },
          {
            triggerLabel: 'View',
            items: [
              { id: 'telemetry', label: 'Telemetry Stream' },
              { id: 'vitals', label: 'Patient Vitals' },
            ],
          },
          {
            triggerLabel: 'Help',
            items: [
              { id: 'docs', label: 'Clinical Guidelines' },
            ],
          },
        ]}
      />
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
                View Full Vitals Stream
              </ContextMenu.Item>
              <ContextMenu.Item className="px-3 py-2 rounded-lg hover:bg-surface-container cursor-pointer">
                Assign Primary Nurse
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
                NICE Guidelines: Section 4.2 Triage Metric
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
          Hover over Dr. Alex Rivera (Consultant Card)
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
                  <span className="font-sans text-[11px] text-on-surface-variant">Lead Paediatric Intensivist</span>
                </div>
              </div>
              <p className="font-sans text-xs text-on-surface-variant">
                On duty at Royal Victoria Hospital ICU Bay 3. GMC Registry #7492019.
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
            <Confirmation.Title>Confirm Automated Dose Adjustment</Confirmation.Title>
            <Confirmation.Description>
              The clinical AI agent has proposed lowering the Infusion Rate from 12 mL/hr to 8 mL/hr based on normalized blood pressure.
            </Confirmation.Description>
          </div>
        </Confirmation.Header>
        <Confirmation.Details>
          Proposed Action: TITRATE_INFUSION (rate: 8.0, unit: mL/hr)
        </Confirmation.Details>
        <Confirmation.Actions>
          <Confirmation.Deny
            onDeny={() => setStatus('denied')}
            disabled={status !== 'pending'}
            label="Reject Proposal"
          />
          <Confirmation.Approve
            onApprove={() => setStatus('approved')}
            disabled={status !== 'pending'}
            label="Approve Adjustment"
          />
        </Confirmation.Actions>
      </Confirmation.Root>
    </div>
  );
};
