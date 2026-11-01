import * as React from 'react';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Toast, toast, Toaster } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/ui/chip';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { Meter } from '@/components/ui/meter';
import { Progress, Skeleton } from '@/components/ui/progress';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Empty } from '@/components/ui/empty';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const InlineAlertDemo: React.FC<ComponentDemoProps> = () => {
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <div className="space-y-4 w-full max-w-xl mx-auto text-left">
      {/* Compound composition with action slot */}
      <InlineAlert role="warning">
        <InlineAlert.Title>Session Expiring Soon</InlineAlert.Title>
        <InlineAlert.Description>
          Your speech consultation has 5 minutes remaining. Please save any drill observations before the room closes.
        </InlineAlert.Description>
        <InlineAlert.Action>
          <Button size="sm" variant="filled" colorRole="primary">
            Extend Session (10m)
          </Button>
          <Button size="sm" variant="outlined" colorRole="neutral">
            Save Notes
          </Button>
        </InlineAlert.Action>
      </InlineAlert>

      {/* Dismissible alert */}
      {!dismissed && (
        <InlineAlert
          title="Microphone Access Blocked"
          role="error"
          icon="mic_off"
          onClose={() => setDismissed(true)}
        >
          Enable microphone permissions in your browser to record articulation drills.
        </InlineAlert>
      )}

      {dismissed && (
        <div className="text-center py-2">
          <Button size="sm" variant="outlined" colorRole="neutral" onClick={() => setDismissed(false)}>
            Reset Microphone Alert
          </Button>
        </div>
      )}

      {/* Monolithic usage with success role */}
      <InlineAlert
        title="Practice Goal Reached"
        role="success"
        icon="check_circle"
      >
        You completed all 15 daily articulation exercises with an average accuracy of 94%.
      </InlineAlert>

      {/* Neutral informative alert */}
      <InlineAlert
        title="Offline Mode Active"
        role="neutral"
        icon="info"
      >
        Practice drills are saved locally and will upload automatically when you reconnect.
      </InlineAlert>
    </div>
  );
};

export const ToastDemo: React.FC<ComponentDemoProps> = () => {
  const triggerPromiseToast = () => {
    const fakeAsyncOperation = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve('Practice audio uploaded to chart.');
        } else {
          reject(new Error('Network timeout'));
        }
      }, 1500);
    });

    toast.promise(fakeAsyncOperation, {
      loading: 'Uploading practice audio...',
      success: (msg) => ({
        title: 'Upload Finished',
        description: msg,
        type: 'success',
      }),
      error: () => ({
        title: 'Upload Failed',
        description: 'Unable to reach the clinical sync server.',
        type: 'error',
      }),
    });
  };

  const triggerActionToast = () => {
    toast({
      title: 'Practice Goal Removed',
      description: 'Daily vowel repetition removed from plan.',
      type: 'neutral',
      action: {
        label: 'Undo',
        onClick: () => {
          toast.success('Goal Restored', 'Daily vowel repetition restored.');
        },
      },
    });
  };

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto py-4 text-left">
      {/* Toaster Viewport Mounting */}
      <Toaster position="bottom-right" limit={4} />

      <div className="space-y-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          Notification Toasts
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Trigger interactive Base UI toasts with stacked deck physics, swipe dismissal gestures, and action buttons.
        </p>
      </div>

      {/* Semantic Variant Triggers */}
      <div className="p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-3">
        <span className="font-label text-xs font-semibold text-on-surface-variant block">
          Semantic Alerts
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="filled"
            colorRole="primary"
            onClick={() =>
              toast.success('Notes Saved', 'Observation notes were added to the chart.')
            }
          >
            <Icon name="check_circle" size="xs" className="mr-1.5 text-success" />
            Success Toast
          </Button>

          <Button
            size="sm"
            variant="outlined"
            colorRole="neutral"
            onClick={() =>
              toast.warning('Audio Level Low', 'Please verify your microphone before recording.')
            }
          >
            <Icon name="warning" size="xs" className="mr-1.5 text-warning" />
            Warning Toast
          </Button>

          <Button
            size="sm"
            variant="outlined"
            colorRole="neutral"
            onClick={() =>
              toast.error('Sync Interrupted', 'Could not establish connection to the care portal.')
            }
          >
            <Icon name="error" size="xs" className="mr-1.5 text-error" />
            Error Toast
          </Button>

          <Button
            size="sm"
            variant="outlined"
            colorRole="neutral"
            onClick={() =>
              toast.neutral('New Update', 'Clinical guideline v3 is now active.')
            }
          >
            <Icon name="info" size="xs" className="mr-1.5 text-on-surface-variant" />
            Neutral Toast
          </Button>
        </div>
      </div>

      {/* Advanced Workflows: Actions & Promises */}
      <div className="p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-3">
        <span className="font-label text-xs font-semibold text-on-surface-variant block">
          Async Promise & Action Callbacks
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="tonal"
            colorRole="primary"
            onClick={triggerPromiseToast}
          >
            <Icon name="cloud_upload" size="xs" className="mr-1.5" />
            Async Promise Toast
          </Button>

          <Button
            size="sm"
            variant="outlined"
            colorRole="neutral"
            onClick={triggerActionToast}
          >
            <Icon name="undo" size="xs" className="mr-1.5" />
            Toast with Action (Undo)
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ChipDemo: React.FC<ComponentDemoProps> = () => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>('drill');
  const [activeTags, setActiveTags] = React.useState<string[]>(['Pediatrics', 'Articulation', 'Speech']);

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto py-2 text-left">
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          Interactive Chips
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Compact interactive elements for filtering, dismissible tags, and action triggers. For passive status labels, use Badge instead.
        </p>
      </div>

      {/* Filter Selection Chips */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Filter selection chips (with leading icon & active check)
        </span>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient">
          <Chip
            icon="checklist"
            colorRole="primary"
            selected={selectedFilter === 'drill'}
            onSelect={() => setSelectedFilter('drill')}
          >
            Daily Drill
          </Chip>
          <Chip
            icon="mic"
            colorRole="secondary"
            selected={selectedFilter === 'audio'}
            onSelect={() => setSelectedFilter('audio')}
          >
            Audio Drills
          </Chip>
          <Chip
            icon="schedule"
            colorRole="neutral"
            selected={selectedFilter === 'scheduled'}
            onSelect={() => setSelectedFilter('scheduled')}
          >
            Scheduled
          </Chip>
        </div>
      </div>

      {/* Removable Input Tags */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Dismissible input chips (with remove button)
        </span>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient">
          {activeTags.map((tag) => (
            <Chip
              key={tag}
              variant="soft"
              colorRole="primary"
              onRemove={() => removeTag(tag)}
            >
              {tag}
            </Chip>
          ))}
          {activeTags.length === 0 && (
            <span className="text-xs text-on-surface-variant italic">All tags removed</span>
          )}
        </div>
      </div>

      {/* Design System Patterns & Sizes */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Approved patterns & sizes
        </span>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-surface-container">
          <Chip size="sm" variant="filled" colorRole="primary" icon="flag">
            Small Filled
          </Chip>
          <Chip size="md" variant="outline" colorRole="secondary" icon="tune">
            Medium Outline
          </Chip>
          <Chip size="lg" variant="soft" colorRole="neutral" icon="folder">
            Large Soft
          </Chip>
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
    <div className="w-full max-w-lg mx-auto py-6">
      <Empty>
        <Empty.Header>
          <Empty.Media variant="icon">
            <Icon name="folder_open" size="xl" />
          </Empty.Media>
          <Empty.Title>No Active Consultations</Empty.Title>
          <Empty.Description>
            You have completed all scheduled appointments for today. You can create a new session or check patient records.
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button colorRole="primary" size="sm">
            <Icon name="add" size="xs" />
            <span>New Appointment</span>
          </Button>
          <Button variant="outlined" colorRole="neutral" size="sm">
            <span>Review Records</span>
          </Button>
        </Empty.Content>
      </Empty>
    </div>
  );
};

export const EmptyStateDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-lg mx-auto py-6">
      <EmptyState
        icon="assignment"
        title="No Practice Sessions Scheduled"
        description="There are no upcoming practice sessions scheduled for today."
        action={
          <Button colorRole="primary" size="sm">
            <Icon name="add" size="xs" />
            <span>Schedule Session</span>
          </Button>
        }
      />
    </div>
  );
};

export const SpinnerDemo: React.FC<ComponentDemoProps> = () => {
  const [loading, setLoading] = React.useState(false);

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 space-y-6">
      {/* Sizing scale */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant space-y-3">
        <h4 className="font-heading text-sm font-semibold text-on-surface">Size Scale</h4>
        <div className="flex items-center gap-6 text-on-surface-variant">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xs" />
            <span className="font-mono text-xs">xs (12px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="font-mono text-xs">sm (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="font-mono text-xs">md (20px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="font-mono text-xs">lg (24px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" />
            <span className="font-mono text-xs">xl (32px)</span>
          </div>
        </div>
      </div>

      {/* Semantic Color Tokens */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant space-y-3">
        <h4 className="font-heading text-sm font-semibold text-on-surface">Semantic Colors</h4>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Spinner size="md" className="text-primary" />
            <span className="font-sans text-xs text-on-surface">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="md" className="text-secondary" />
            <span className="font-sans text-xs text-on-surface">Secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="md" className="text-success" />
            <span className="font-sans text-xs text-on-surface">Success</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="md" className="text-error" />
            <span className="font-sans text-xs text-on-surface">Error</span>
          </div>
        </div>
      </div>

      {/* Button integration with data-icon */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant space-y-3">
        <h4 className="font-heading text-sm font-semibold text-on-surface">Button Integration</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            colorRole="primary"
            size="md"
            disabled={loading}
            onClick={handleSimulate}
          >
            {loading && <Spinner size="sm" data-icon="inline-start" />}
            <span>{loading ? 'Saving Changes...' : 'Click to Simulate Save'}</span>
          </Button>

          <Button
            variant="outlined"
            colorRole="neutral"
            size="md"
            disabled
          >
            <Spinner size="sm" data-icon="inline-start" />
            <span>Processing</span>
          </Button>
        </div>
      </div>
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

export const BadgeDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 py-4 text-left">
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          Status Badges & Category Labels
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Passive indicators for status counts, clinical categories, and attributes. For interactive filters, use Chip instead.
        </p>
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Badge variants (3 approved design system patterns)
        </span>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient">
          <Badge variant="filled" colorRole="primary">Pattern 1: Filled</Badge>
          <Badge variant="outline" colorRole="primary">Pattern 2: Outline</Badge>
          <Badge variant="soft" colorRole="primary">Pattern 3: Soft</Badge>
        </div>
      </div>

      {/* Color Roles */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Color roles (high contrast)
        </span>
        <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient">
          <Badge colorRole="primary" icon="play_arrow">Primary</Badge>
          <Badge colorRole="secondary" icon="checklist">Secondary</Badge>
          <Badge colorRole="tertiary" icon="star">Tertiary</Badge>
          <Badge colorRole="error" icon="priority_high">Error</Badge>
          <Badge colorRole="warning" icon="schedule">Warning</Badge>
          <Badge colorRole="success" icon="verified">Success</Badge>
          <Badge colorRole="neutral" icon="archive">Neutral</Badge>
        </div>
      </div>

      {/* Shapes & Sizes */}
      <div className="space-y-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Shapes & calibrated size scale
        </span>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-surface-container">
          <Badge size="sm" shape="pill" colorRole="primary" icon="check">Small (20px)</Badge>
          <Badge size="md" shape="pill" colorRole="secondary" icon="check">Medium (24px)</Badge>
          <Badge size="lg" shape="pill" colorRole="success" icon="check">Large (28px)</Badge>
          <Badge size="md" shape="rounded" colorRole="neutral">Rounded Rect</Badge>
        </div>
      </div>
    </div>
  );
};
