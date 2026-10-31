import * as React from 'react';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Toast } from '@/components/ui/toast';
import { Chip } from '@/components/ui/chip';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { Meter } from '@/components/ui/meter';
import { Progress, Skeleton } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Empty } from '@/components/ui/empty';
import { EmptyState } from '@/components/ui/empty-state';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const InlineAlertDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <InlineAlert
        title="Immediate Triage Escalation (STAT)"
        role="error"
        icon="emergency"
      >
        Patient telemetry indicates ventricular tachycardia. Emergency crash team dispatched to Bed 4.
      </InlineAlert>

      <InlineAlert
        title="Renal Clearance Warning"
        role="warning"
        icon="warning"
      >
        Estimated GFR &lt; 30 mL/min/1.73m². Reduce medication clearance interval by 50%.
      </InlineAlert>

      <InlineAlert
        title="Diagnostic Pathology Panel Finalized"
        role="success"
        icon="check_circle"
      >
        Full Blood Count (FBC) and Electrolyte panel verified by Senior Clinical Biochemist.
      </InlineAlert>

      <InlineAlert
        title="Observation Protocol Activated"
        role="neutral"
        icon="info"
      >
        Continuous arterial pulse oximetry active. Next automated check in 14 minutes.
      </InlineAlert>
    </div>
  );
};

export const ToastDemo: React.FC<ComponentDemoProps> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Button
        colorRole="primary"
        onClick={() => setOpen(true)}
      >
        <Icon name="notifications" size="xs" className="mr-2" />
        Trigger Clinical Toast Alert
      </Button>

      {open && (
        <div className="p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient flex items-center justify-between gap-4 max-w-md w-full transition-all duration-200">
          <div className="flex items-center gap-3">
            <Icon name="check_circle" size="sm" className="text-success shrink-0" />
            <div className="space-y-0.5">
              <span className="font-heading text-xs font-bold text-on-surface block">EHR Record Synchronized</span>
              <span className="font-sans text-xs text-on-surface-variant">Prescription logged to NHS Spine.</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-xs h-7 px-2">
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};

export const ChipDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Semantic Status Roles
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <Chip label="Critical Priority" colorRole="error" icon="priority_high" />
          <Chip label="Pending Lab Review" colorRole="warning" icon="schedule" />
          <Chip label="Verified Safe" colorRole="success" icon="verified" />
          <Chip label="ICU Admission" colorRole="primary" icon="local_hospital" />
          <Chip label="Routine Caseload" colorRole="secondary" icon="checklist" />
          <Chip label="Discharged" colorRole="neutral" icon="check" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Patterns & Emphasis
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <Chip label="Mixed Contrast" pattern="high-contrast-mixed" colorRole="primary" />
          <Chip label="Neutral Fill Accent" pattern="neutral-fill-accent-text" colorRole="secondary" />
          <Chip label="Soft Wash" pattern="soft-wash" colorRole="tertiary" />
          <Chip label="Removable Filter" colorRole="primary" onRemove={() => {}} />
        </div>
      </div>
    </div>
  );
};

export const NotificationBadgeDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-8">
      <div className="relative inline-block">
        <Button variant="outlined" size="md">
          <Icon name="mail" size="xs" className="mr-2" />
          Lab Messages
        </Button>
        <NotificationBadge count={4} variant="error" />
      </div>

      <div className="relative inline-block">
        <Button variant="outlined" size="md">
          <Icon name="notifications" size="xs" className="mr-2" />
          Active Alerts
        </Button>
        <NotificationBadge dot variant="primary" />
      </div>
    </div>
  );
};

export const MeterDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto py-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-on-surface">Oxygen Cylinder Capacity</span>
          <span className="text-primary font-bold">82%</span>
        </div>
        <Meter value={82} colorRole="primary" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-on-surface">ICU Bed Occupancy Threshold</span>
          <span className="text-warning font-bold">68%</span>
        </div>
        <Meter value={68} colorRole="warning" />
      </div>
    </div>
  );
};

export const ProgressDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto py-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-on-surface">MRI Scan Sequence Export</span>
          <span className="text-primary font-bold">45%</span>
        </div>
        <Progress value={45} />
      </div>
    </div>
  );
};

export const ProgressRingDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6">
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={75} size="md" strokeWidth={6} color="primary" />
        <span className="font-mono text-xs font-bold text-on-surface">75% Dose Delivered</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ProgressRing value={100} size="md" strokeWidth={6} color="success" />
        <span className="font-mono text-xs font-bold text-success">Complete</span>
      </div>
    </div>
  );
};

export const EmptyDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Empty
        icon="folder_open"
        title="No Active Critical Alerts"
        description="All 12 telemetry beds in Paediatric Bay 4 are within normal sinus rhythms."
      />
    </div>
  );
};

export const EmptyStateDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6">
      <EmptyState
        icon="medication"
        title="No Prescriptions Pending Approval"
        description="All oral and intravenous clinical medication orders for today have been reviewed and dispensed."
        action={
          <Button colorRole="primary" size="sm">
            <Icon name="add" size="xs" className="mr-1.5" />
            Create Prescription Order
          </Button>
        }
      />
    </div>
  );
};

export const SkeletonDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3 p-4 rounded-xl bg-surface border border-outline-variant">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
};

export const ReadingProgressDemo: React.FC<ComponentDemoProps> = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-3 w-full max-w-md mx-auto py-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading text-xs font-bold text-on-surface">Protocol Reading Progress</h4>
        <span className="font-mono text-[11px] text-on-surface-variant">Scroll container to inspect</span>
      </div>

      <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface shadow-ambient relative">
        {mounted && (
          <ReadingProgress
            targetRef={containerRef}
            position="sticky"
            colorRole="primary"
            showPercentage
          />
        )}
        <div
          ref={containerRef}
          tabIndex={0}
          aria-label="Clinical Protocol Document"
          className="h-48 overflow-y-auto p-4 space-y-3 font-sans text-xs text-on-surface-variant leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <p className="font-semibold text-on-surface">
            Section 1: Initial Paediatric Trauma Protocol
          </p>
          <p>
            Upon initial triage presentation, assess airway patency, cervical spine stabilization, and bilateral respiratory excursions. Record baseline SpO2 and non-invasive blood pressure immediately.
          </p>
          <p className="font-semibold text-on-surface">
            Section 2: Secondary Resuscitation &amp; Cannulation
          </p>
          <p>
            Establish wide-bore peripheral intravenous access or humeral intraosseous access if peripheral attempts exceed 90 seconds. Draw STAT type-and-screen, venous blood gas, and lactate telemetry.
          </p>
          <p className="font-semibold text-on-surface">
            Section 3: Neurological &amp; Pain Re-assessment
          </p>
          <p>
            Document Glasgow Coma Scale (GCS) and pupil reactivity. Titrate weight-adjusted analgesia in accordance with local paediatric intensive care guidance. Maintain thermal neutrality.
          </p>
          <p className="font-semibold text-on-surface">
            Section 4: Handover &amp; Disposition
          </p>
          <p>
            Synthesize handover using SBAR (Situation, Background, Assessment, Recommendation) framework before transferring to the paediatric intensive care unit.
          </p>
        </div>
      </div>
    </div>
  );
};
