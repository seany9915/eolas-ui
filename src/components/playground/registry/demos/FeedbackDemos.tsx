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
        title="Microphone Access Blocked"
        role="error"
        icon="mic_off"
      >
        Enable microphone access in your browser settings to record voice drills.
      </InlineAlert>

      <InlineAlert
        title="Unsaved Session Notes"
        role="warning"
        icon="warning"
      >
        You have unsaved notes from your previous drill. Save them before continuing.
      </InlineAlert>

      <InlineAlert
        title="Practice Goal Reached"
        role="success"
        icon="check_circle"
      >
        You completed all 15 daily articulation exercises.
      </InlineAlert>

      <InlineAlert
        title="Offline Mode Active"
        role="neutral"
        icon="info"
      >
        Practice drills are saved locally and will upload when you reconnect.
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
        Trigger Toast Notification
      </Button>

      {open && (
        <div className="p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient flex items-center justify-between gap-4 max-w-md w-full transition-all duration-200">
          <div className="flex items-center gap-3">
            <Icon name="check_circle" size="sm" className="text-success shrink-0" />
            <div className="space-y-0.5">
              <span className="font-heading text-xs font-bold text-on-surface block">Session Notes Saved</span>
              <span className="font-sans text-xs text-on-surface-variant">Your practice notes were saved to the patient record.</span>
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
        <h4 className="font-heading text-xs font-bold text-on-surface-variant">
          Semantic Status Roles
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <Chip label="High Priority" colorRole="error" icon="priority_high" />
          <Chip label="Needs Review" colorRole="warning" icon="schedule" />
          <Chip label="Completed" colorRole="success" icon="verified" />
          <Chip label="In Progress" colorRole="primary" icon="play_arrow" />
          <Chip label="Daily Drill" colorRole="secondary" icon="checklist" />
          <Chip label="Archived" colorRole="neutral" icon="archive" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant">
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
          Messages
        </Button>
        <NotificationBadge count={4} variant="error" />
      </div>

      <div className="relative inline-block">
        <Button variant="outlined" size="md">
          <Icon name="notifications" size="xs" className="mr-2" />
          Notifications
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
          <span className="font-bold text-on-surface">Weekly Practice Goal</span>
          <span className="text-primary font-bold">82%</span>
        </div>
        <Meter value={82} colorRole="primary" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-on-surface">Storage Used</span>
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
          <span className="font-bold text-on-surface">Downloading Sound Pack</span>
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
        <span className="font-mono text-xs font-bold text-on-surface">75% Completed</span>
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
        title="No Unread Notifications"
        description="You are all caught up for today."
      />
    </div>
  );
};

export const EmptyStateDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6">
      <EmptyState
        icon="assignment"
        title="No Practice Sessions Scheduled"
        description="There are no upcoming practice sessions scheduled for today."
        action={
          <Button colorRole="primary" size="sm">
            <Icon name="add" size="xs" className="mr-1.5" />
            Schedule Practice Session
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
        <h4 className="font-heading text-xs font-bold text-on-surface">Practice Guide Progress</h4>
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
          aria-label="Practice Guide Document"
          className="h-48 overflow-y-auto p-4 space-y-3 font-sans text-xs text-on-surface-variant leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <p className="font-semibold text-on-surface">
            Section 1: Breath Support & Posture
          </p>
          <p>
            Sit upright with shoulders relaxed. Take a slow, gentle breath through the nose before beginning each word exercise.
          </p>
          <p className="font-semibold text-on-surface">
            Section 2: Vowel Prolongation Drills
          </p>
          <p>
            Hold steady vowel sounds (/ah/, /ee/, /oh/) for 5 seconds at a comfortable conversational volume.
          </p>
          <p className="font-semibold text-on-surface">
            Section 3: Consonant Blend Repetition
          </p>
          <p>
            Practice two-syllable word pairs focusing on clear consonant release. Repeat each word three times.
          </p>
          <p className="font-semibold text-on-surface">
            Section 4: Review & Reflection
          </p>
          <p>
            Note which sounds felt easy and which needed extra effort. Save your recorded clips for therapist review.
          </p>
        </div>
      </div>
    </div>
  );
};
