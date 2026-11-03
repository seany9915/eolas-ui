import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Collapsible } from '@/components/ui/collapsible';
import { Toolbar } from '@/components/ui/toolbar';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Attachment } from '@/components/ui/attachment';
import { StickyContainer } from '@/components/ui/sticky-container';
import { DeferredView } from '@/components/ui/deferred-view';
import { SwipeReveal } from '@/components/ui/swipe-reveal';
import { TextHighlight } from '@/components/ui/text-highlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemSeparator } from '@/components/ui/item';
import { BlockDemoShell } from '../BlockDemoShell';
import { ComponentDemoProps } from '../types';

export const CardDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto text-left">
      {/* Standard Compound Card */}
      <Card>
        <Card.Header>
          <Card.Title>Sound Practice Plan</Card.Title>
          <Card.Description>Daily articulation exercises</Card.Description>
          <Card.Action>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
              Active
            </span>
          </Card.Action>
        </Card.Header>
        <Card.Content>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            Target blends: /sl/, /st/, /sp/. 15 minutes scheduled daily with therapist feedback.
          </p>
        </Card.Content>
        <Card.Footer>
          <Button size="sm" colorRole="primary">Start Session</Button>
        </Card.Footer>
      </Card>

      {/* Compact Card */}
      <Card size="sm">
        <Card.Header>
          <Card.Title>Weekly Milestone</Card.Title>
          <Card.Description>Accuracy target met</Card.Description>
          <Card.Action>
            <Icon name="verified" size="sm" className="text-secondary" />
          </Card.Action>
        </Card.Header>
        <Card.Content>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
            92% average pronunciation score across 45 drills completed this week.
          </p>
        </Card.Content>
        <Card.Footer>
          <Button size="sm" variant="outlined" colorRole="neutral">View Progress</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const TableDemo: React.FC<ComponentDemoProps> = () => {
  interface LearnerRow {
    id: string;
    name: string;
    group: string;
    status: string;
    accuracy: number;
    streak: number;
  }

  const columns = [
    { header: 'Learner Name', accessor: (row: LearnerRow) => row.name },
    { header: 'Group', accessor: (row: LearnerRow) => row.group },
    { header: 'Status', accessor: (row: LearnerRow) => row.status },
    { header: 'Accuracy', accessor: (row: LearnerRow) => `${row.accuracy}%`, numeric: true },
    { header: 'Practice Streak', accessor: (row: LearnerRow) => `${row.streak} days`, numeric: true },
  ];

  const data: LearnerRow[] = [
    { id: '1', name: 'Eleanor Vance', group: 'Morning Sound Drills', status: 'Completed', accuracy: 94, streak: 5 },
    { id: '2', name: 'Arthur Pendelton', group: 'Morning Sound Drills', status: 'In Progress', accuracy: 88, streak: 3 },
    { id: '3', name: 'Marcus Brody', group: 'Afternoon Practice', status: 'Needs Review', accuracy: 76, streak: 1 },
  ];

  return (
    <div className="w-full py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
        <span className="font-heading font-bold text-on-surface">Practice Group Table</span>
        <span className="font-mono text-[11px]">Supports responsive stack &amp; tabular-nums</span>
      </div>
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} responsive="scroll" />
    </div>
  );
};

export const ChartDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { day: 'Mon', minutes: 24, target: 20 },
    { day: 'Tue', minutes: 32, target: 20 },
    { day: 'Wed', minutes: 18, target: 20 },
    { day: 'Thu', minutes: 28, target: 20 },
    { day: 'Fri', minutes: 40, target: 20 },
    { day: 'Sat', minutes: 35, target: 20 },
    { day: 'Sun', minutes: 22, target: 20 },
  ];

  const chartConfig = {
    minutes: {
      label: 'Practice minutes',
      color: 'var(--color-primary)',
    },
    target: {
      label: 'Target goal',
      color: 'var(--color-secondary)',
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full max-w-xl mx-auto">
      <Card.Header className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-0.5">
          <Card.Title>Weekly Articulation Activity</Card.Title>
          <Card.Description>Daily recorded practice time versus baseline</Card.Description>
        </div>
        <Card.Action>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2.5 rounded-full bg-primary" />
            <span className="font-sans text-xs text-on-surface-variant">Actual</span>
            <span className="inline-block size-2.5 rounded-full bg-secondary ml-2" />
            <span className="font-sans text-xs text-on-surface-variant">Target</span>
          </div>
        </Card.Action>
      </Card.Header>

      <Card.Content>
        <ChartContainer
          role="img"
          aria-label="Weekly articulation activity bar chart comparing actual practice minutes against a 20-minute daily target"
          config={chartConfig}
          className="h-56 w-full aspect-auto"
        >
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-outline-variant/40" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="font-sans text-xs text-on-surface-variant"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}m`}
              className="font-mono text-xs text-on-surface-variant"
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-surface-container)' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" fill="var(--color-target)" radius={[6, 6, 0, 0]} opacity={0.6} />
          </BarChart>
        </ChartContainer>
      </Card.Content>
    </Card>
  );
};

export const SeparatorDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 flex flex-col gap-4 text-center text-xs font-sans text-on-surface-variant">
      <div>Section 1: Sound Drills</div>
      <Separator />
      <div>Section 2: Syllable Repetition</div>
      <Separator />
      <div>Section 3: Weekly Review</div>
    </div>
  );
};

export const ResizableDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full py-4 flex flex-col gap-2">
      <div className="text-xs text-on-surface-variant px-1 font-mono">
        Draggable split pane layout. Drag center handle to resize panes:
      </div>
      <div className="h-48 rounded-xl border border-outline-variant overflow-hidden bg-surface">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={25} className="p-4 bg-surface-container/30 text-xs font-sans">
            <span className="font-bold text-on-surface block mb-1">Left Pane: Practice History</span>
            <span className="text-on-surface-variant">Learner ID: P-2024-819</span>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30} className="p-4 bg-surface text-xs font-sans">
            <span className="font-bold text-on-surface block mb-1">Right Pane: Session Notes</span>
            <span className="text-on-surface-variant">Target sound sets and recorded audio clips</span>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export const CollapsibleDemo: React.FC<ComponentDemoProps> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <Collapsible.Root open={open} onOpenChange={setOpen} className="rounded-xl border border-outline-variant bg-surface p-4 flex flex-col gap-3">
        <Collapsible.Trigger>
          <span>Articulation Exercise Instructions</span>
        </Collapsible.Trigger>
        <Collapsible.Panel contentClassName="text-xs font-sans text-on-surface-variant pt-2 border-t border-outline-variant/60 leading-relaxed">
          Repeat each word three times with audio feedback. Pause 2 seconds between repetitions.
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
};

export const ToolbarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4 flex justify-center">
      <Toolbar className="p-1 rounded-xl bg-surface border border-outline-variant flex items-center gap-1 shadow-sm">
        <Button size="sm" variant="ghost"><Icon name="edit" size="xs" /></Button>
        <Button size="sm" variant="ghost"><Icon name="content_copy" size="xs" /></Button>
        <Button size="sm" variant="ghost"><Icon name="share" size="xs" /></Button>
        <div className="w-px h-5 bg-outline-variant my-auto" />
        <Button size="sm" variant="ghost" colorRole="error"><Icon name="delete" size="xs" /></Button>
      </Toolbar>
    </div>
  );
};

export const CarouselDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem className="p-4">
            <div className="h-32 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              Exercise 1: Initial /s/ Sounds
            </div>
          </CarouselItem>
          <CarouselItem className="p-4">
            <div className="h-32 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
              Exercise 2: Medial /s/ Sounds
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export const AvatarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" fallback="SJ" />
      <Avatar fallback="DR" />
      <Avatar fallback="EP" />
    </div>
  );
};

export const IconDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6">
      <Icon name="record_voice_over" size="lg" className="text-primary" />
      <Icon name="hearing" size="lg" className="text-secondary" />
      <Icon name="mic" size="lg" className="text-error" />
      <Icon name="assignment" size="lg" className="text-warning" />
      <Icon name="verified" size="lg" className="text-success" />
    </div>
  );
};

export const AttachmentDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <BlockDemoShell
      name="File Attachment"
      badge="Tier A Compound Primitive"
      description="Composable file and media preview primitive supporting upload lifecycle states, image thumbnails, horizontal chips, vertical cards, and scrollable groups."
      whenToUse="Displaying uploaded clinical documents, speech audio recordings, radiology scans, or pending uploads with progress feedback, download actions, and removal triggers."
      typicalExample={
        <div className="w-full max-w-md">
          <Attachment state="done">
            <Attachment.Media className="bg-primary-container text-on-primary-container">
              <Icon name="description" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Clinical_Summary_Q3.pdf</Attachment.Title>
              <Attachment.Description>PDF · 3.4 MB · Ready</Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Action aria-label="Download document">
                <Icon name="download" size="sm" aria-hidden="true" />
              </Attachment.Action>
              <Attachment.Action aria-label="Remove document">
                <Icon name="close" size="sm" aria-hidden="true" />
              </Attachment.Action>
            </Attachment.Actions>
            <Attachment.Trigger href="#preview" aria-label="Open Clinical Summary preview" />
          </Attachment>
        </div>
      }
      variantsSection={
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* Ready / Done state */}
          <Attachment state="done">
            <Attachment.Media className="bg-primary-container text-on-primary-container">
              <Icon name="description" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Care_Plan_V2.pdf</Attachment.Title>
              <Attachment.Description>PDF · 2.1 MB · Synced</Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Action aria-label="Download Care Plan">
                <Icon name="download" size="sm" aria-hidden="true" />
              </Attachment.Action>
              <Attachment.Action aria-label="Remove Care Plan">
                <Icon name="close" size="sm" aria-hidden="true" />
              </Attachment.Action>
            </Attachment.Actions>
          </Attachment>

          {/* Uploading state with progress */}
          <Attachment state="uploading">
            <Attachment.Media className="bg-secondary-container text-on-secondary-container">
              <Icon name="mic" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Vocalic_Drill_Session.wav</Attachment.Title>
              <Attachment.Description className="text-primary font-medium">
                Uploading (68%)
              </Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Action aria-label="Cancel upload">
                <Icon name="close" size="sm" aria-hidden="true" />
              </Attachment.Action>
            </Attachment.Actions>
          </Attachment>

          {/* Processing state */}
          <Attachment state="processing">
            <Attachment.Media className="bg-surface-container text-on-surface-variant">
              <Icon name="hourglass_empty" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Acoustic_Formant_Analysis.csv</Attachment.Title>
              <Attachment.Description className="text-secondary font-medium">
                Extracting pitch contours...
              </Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Action aria-label="Cancel processing">
                <Icon name="close" size="sm" aria-hidden="true" />
              </Attachment.Action>
            </Attachment.Actions>
          </Attachment>

          {/* Error state */}
          <Attachment state="error">
            <Attachment.Media className="bg-error-container text-on-error-container">
              <Icon name="error" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Corrupted_Audio_Log.raw</Attachment.Title>
              <Attachment.Description className="text-error font-medium">
                File format not recognized
              </Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
              <Attachment.Action aria-label="Dismiss error">
                <Icon name="close" size="sm" aria-hidden="true" />
              </Attachment.Action>
            </Attachment.Actions>
          </Attachment>
        </div>
      }
      sizeLadderSection={
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Default / standard */}
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-xs font-bold text-on-surface">Standard Tier (48px Floor)</span>
            <Attachment size="default" state="done">
              <Attachment.Media className="bg-primary-container text-on-primary-container">
                <Icon name="description" size="md" aria-hidden="true" />
              </Attachment.Media>
              <Attachment.Content>
                <Attachment.Title>Diagnostic_Report.pdf</Attachment.Title>
                <Attachment.Description>PDF · 3.4 MB</Attachment.Description>
              </Attachment.Content>
              <Attachment.Actions>
                <Attachment.Action aria-label="Download">
                  <Icon name="download" size="sm" aria-hidden="true" />
                </Attachment.Action>
              </Attachment.Actions>
            </Attachment>
          </div>

          {/* Compact sm */}
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-xs font-bold text-on-surface">Compact Tier (36px Chip)</span>
            <Attachment size="sm" state="done">
              <Attachment.Media className="bg-secondary-container text-on-secondary-container">
                <Icon name="mic" size="xs" aria-hidden="true" />
              </Attachment.Media>
              <Attachment.Content>
                <Attachment.Title className="text-xs">Syllable_Drill.wav</Attachment.Title>
                <Attachment.Description className="text-[10px]">Audio · 480 KB</Attachment.Description>
              </Attachment.Content>
              <Attachment.Actions>
                <Attachment.Action aria-label="Remove">
                  <Icon name="close" size="xs" aria-hidden="true" />
                </Attachment.Action>
              </Attachment.Actions>
            </Attachment>
          </div>

          {/* Micro xs */}
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-xs font-bold text-on-surface">Micro Tier (28px Inline Citation)</span>
            <Attachment size="xs" state="done">
              <Attachment.Media className="bg-surface-container text-on-surface">
                <Icon name="attach_file" size="xs" className="text-[12px]" aria-hidden="true" />
              </Attachment.Media>
              <Attachment.Content>
                <Attachment.Title className="text-[11px]">Consent_Form.pdf</Attachment.Title>
              </Attachment.Content>
              <Attachment.Actions>
                <Attachment.Action aria-label="Download">
                  <Icon name="download" size="xs" className="text-[11px]" aria-hidden="true" />
                </Attachment.Action>
              </Attachment.Actions>
            </Attachment>
          </div>
        </div>
      }
      iconPermutationsSection={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {/* Document attachment */}
          <Attachment state="done" className="w-full">
            <Attachment.Media className="bg-primary-container text-on-primary-container">
              <Icon name="description" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Therapist_Notes.pdf</Attachment.Title>
              <Attachment.Description>Document</Attachment.Description>
            </Attachment.Content>
          </Attachment>

          {/* Image thumbnail preview */}
          <Attachment state="done" className="w-full">
            <Attachment.Media variant="image">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=80"
                alt="Radiology scan thumbnail"
              />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Chest_XRay.jpg</Attachment.Title>
              <Attachment.Description>Image · 1.8 MB</Attachment.Description>
            </Attachment.Content>
          </Attachment>
        </div>
      }
      pinnedStatesSection={
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* Normal State */}
          <Attachment state="done">
            <Attachment.Media className="bg-surface-container text-on-surface">
              <Icon name="description" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Default Resting State</Attachment.Title>
              <Attachment.Description>border-outline-variant</Attachment.Description>
            </Attachment.Content>
          </Attachment>

          {/* Active Uploading State */}
          <Attachment state="uploading">
            <Attachment.Media className="bg-primary-container text-on-primary-container">
              <Icon name="upload" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Active Upload State</Attachment.Title>
              <Attachment.Description className="text-primary font-medium">border-primary wash</Attachment.Description>
            </Attachment.Content>
          </Attachment>

          {/* Error State */}
          <Attachment state="error">
            <Attachment.Media className="bg-error-container text-on-error-container">
              <Icon name="error" size="md" aria-hidden="true" />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>Error State</Attachment.Title>
              <Attachment.Description className="text-error font-medium">border-error</Attachment.Description>
            </Attachment.Content>
          </Attachment>
        </div>
      }
      edgeCasesSection={
        <div className="flex flex-col gap-6 w-full max-w-lg">
          {/* Edge Case 1: Long Filename Truncation */}
          <div className="flex flex-col gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">
              1. Extreme Filename Truncation (60+ characters)
            </span>
            <Attachment state="done" className="w-full max-w-md">
              <Attachment.Media className="bg-primary-container text-on-primary-container">
                <Icon name="description" size="md" aria-hidden="true" />
              </Attachment.Media>
              <Attachment.Content>
                <Attachment.Title>
                  Pediatric_Speech_Evaluation_Comprehensive_Session_Record_Final_Signed_2026_Q3_V2.pdf
                </Attachment.Title>
                <Attachment.Description>PDF · 12.8 MB</Attachment.Description>
              </Attachment.Content>
              <Attachment.Actions>
                <Attachment.Action aria-label="Download">
                  <Icon name="download" size="sm" aria-hidden="true" />
                </Attachment.Action>
                <Attachment.Action aria-label="Remove">
                  <Icon name="close" size="sm" aria-hidden="true" />
                </Attachment.Action>
              </Attachment.Actions>
            </Attachment>
          </div>

          {/* Edge Case 2: Vertical Card with Pinned Top-Right Action */}
          <div className="flex flex-col gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">
              2. Vertical Card Anatomy (`orientation="vertical"`)
            </span>
            <div className="flex gap-4">
              <Attachment orientation="vertical" state="done" className="w-48">
                <Attachment.Media className="bg-secondary-container text-on-secondary-container">
                  <Icon name="mic" size="md" aria-hidden="true" />
                </Attachment.Media>
                <Attachment.Content>
                  <Attachment.Title>Session_Audio.wav</Attachment.Title>
                  <Attachment.Description>Audio · 2.4 MB</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                  <Attachment.Action aria-label="Remove audio">
                    <Icon name="close" size="sm" aria-hidden="true" />
                  </Attachment.Action>
                </Attachment.Actions>
              </Attachment>

              <Attachment orientation="vertical" state="uploading" className="w-48">
                <Attachment.Media variant="image" className="w-full h-24">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=240&auto=format&fit=crop&q=80"
                    alt="Radiology preview"
                  />
                </Attachment.Media>
                <Attachment.Content>
                  <Attachment.Title>XRay_Lateral.jpg</Attachment.Title>
                  <Attachment.Description className="text-primary font-medium">Uploading (45%)</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                  <Attachment.Action aria-label="Cancel upload">
                    <Icon name="close" size="sm" aria-hidden="true" />
                  </Attachment.Action>
                </Attachment.Actions>
              </Attachment>
            </div>
          </div>

          {/* Edge Case 3: Horizontally Scrollable Snapping Group */}
          <div className="flex flex-col gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">
              3. Horizontal Snapping Attachment Group (`Attachment.Group`)
            </span>
            <Attachment.Group className="max-w-md">
              <Attachment state="done" className="w-64">
                <Attachment.Media className="bg-primary-container text-on-primary-container">
                  <Icon name="description" size="md" aria-hidden="true" />
                </Attachment.Media>
                <Attachment.Content>
                  <Attachment.Title>Chart_1.pdf</Attachment.Title>
                  <Attachment.Description>PDF · 1.1 MB</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                  <Attachment.Action aria-label="Remove">
                    <Icon name="close" size="sm" aria-hidden="true" />
                  </Attachment.Action>
                </Attachment.Actions>
              </Attachment>

              <Attachment state="uploading" className="w-64">
                <Attachment.Media className="bg-secondary-container text-on-secondary-container">
                  <Icon name="mic" size="md" aria-hidden="true" />
                </Attachment.Media>
                <Attachment.Content>
                  <Attachment.Title>Recording_2.wav</Attachment.Title>
                  <Attachment.Description className="text-primary font-medium">Uploading (72%)</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                  <Attachment.Action aria-label="Cancel">
                    <Icon name="close" size="sm" aria-hidden="true" />
                  </Attachment.Action>
                </Attachment.Actions>
              </Attachment>

              <Attachment state="done" className="w-64">
                <Attachment.Media className="bg-surface-container text-on-surface">
                  <Icon name="analytics" size="md" aria-hidden="true" />
                </Attachment.Media>
                <Attachment.Content>
                  <Attachment.Title>Metrics_3.csv</Attachment.Title>
                  <Attachment.Description>Data · 340 KB</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                  <Attachment.Action aria-label="Remove">
                    <Icon name="close" size="sm" aria-hidden="true" />
                  </Attachment.Action>
                </Attachment.Actions>
              </Attachment>
            </Attachment.Group>
          </div>
        </div>
      }
    />
  );
};

export const StickyContainerDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <StickyContainer className="p-3 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono text-center">
        Banner: Daily practice reminder scheduled for 10:00 AM
      </StickyContainer>
    </div>
  );
};

export const DeferredViewDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <DeferredView estimatedHeight={80}>
        <div className="p-4 rounded-xl bg-surface border border-outline-variant text-xs font-sans">
          Module loaded without blocking page interaction.
        </div>
      </DeferredView>
    </div>
  );
};

export const SwipeRevealDemo: React.FC<ComponentDemoProps> = () => {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const handleRevealLeading = () => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const handleRevealTrailing = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: scrollerRef.current.scrollWidth, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (scrollerRef.current) {
      // Snap back to content pane
      scrollerRef.current.scrollTo({ left: 88, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="font-heading font-bold text-on-surface">Learner Card Actions</span>
        <span className="font-mono text-[11px]">Swipe or tap actions</span>
      </div>

      <SwipeReveal
        ref={scrollerRef}
        leadingActions={
          <SwipeReveal.Action variant="error" className="flex flex-col items-center justify-center gap-1 w-20">
            <Icon name="archive" size="sm" />
            <span>Archive</span>
          </SwipeReveal.Action>
        }
        actions={
          <SwipeReveal.Action variant="primary" className="flex flex-col items-center justify-center gap-1 w-20">
            <Icon name="check_circle" size="sm" />
            <span>Review</span>
          </SwipeReveal.Action>
        }
      >
        <div className="p-4 bg-surface text-on-surface flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-on-surface">Eleanor Vance</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-warning-container text-on-warning-container font-bold">
                Review
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              Morning Drills · Initial /r/ sounds need review
            </p>
          </div>
          <span className="font-label text-[11px] text-on-surface-variant shrink-0 flex items-center gap-1 bg-surface-container/40 px-2 py-1 rounded">
            <Icon name="swipe" size="xs" /> Swipe
          </span>
        </div>
      </SwipeReveal>

      <div className="flex items-center justify-center gap-2 pt-1">
        <Button size="sm" variant="outlined" onClick={handleRevealLeading}>
          Peek Archive (Right)
        </Button>
        <Button size="sm" variant="outlined" onClick={handleRevealTrailing}>
          Peek Review (Left)
        </Button>
        <Button size="sm" variant="tonal" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export const TextHighlightDemo: React.FC<ComponentDemoProps> = () => {
  const [query, setQuery] = React.useState('sound');
  const [caseSensitive, setCaseSensitive] = React.useState(false);

  const sampleKeywords = ['sound', 'articulation', 'practice', 'accuracy'];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-4 text-left">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          GPU Text Search & Highlight
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Highlights search keywords using the W3C CSS Custom Highlight API on the GPU compositor without splitting strings or fragmenting screen reader announcements.
        </p>
      </div>

      {/* Interactive Search Controls */}
      <div className="p-4 rounded-xl bg-surface border border-outline-variant shadow-ambient flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type keyword to highlight..."
              className="h-10 text-xs pl-9"
              aria-label="Search keywords in clinical notes"
            />
            <Icon
              name="search"
              size="xs"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
          </div>

          <Button
            size="sm"
            variant={caseSensitive ? 'tonal' : 'outlined'}
            colorRole="neutral"
            onClick={() => setCaseSensitive((prev) => !prev)}
            className="h-10 text-xs shrink-0"
            title="Toggle case-sensitive matching"
          >
            <Icon name="match_case" size="xs" />
            {caseSensitive ? 'Case Sensitive: On' : 'Case Sensitive: Off'}
          </Button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label text-xs text-on-surface-variant mr-1">Suggested:</span>
          {sampleKeywords.map((kw) => (
            <Button
              key={kw}
              size="sm"
              variant={query.toLowerCase() === kw ? 'filled' : 'outlined'}
              colorRole={query.toLowerCase() === kw ? 'primary' : 'neutral'}
              onClick={() => setQuery(kw)}
              className="h-7 text-xs px-2.5 rounded-full"
            >
              {kw}
            </Button>
          ))}
          {query && (
            <Button
              size="sm"
              variant="ghost"
              colorRole="neutral"
              onClick={() => setQuery('')}
              className="h-7 text-xs px-2 text-on-surface-variant"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Target Content with Live Highlight */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant shadow-ambient flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <Icon name="description" size="xs" className="text-primary" />
            <span className="font-heading text-xs font-bold text-on-surface">
              Speech Therapy Session Notes
            </span>
          </div>
          <Badge variant="soft" colorRole="primary" size="sm">
            {query.trim() ? `Highlighting: "${query}"` : 'No search query'}
          </Badge>
        </div>

        <TextHighlight
          query={query}
          caseSensitive={caseSensitive}
          className="font-sans text-xs text-on-surface leading-relaxed flex flex-col gap-2"
        >
          <p>
            The learner practiced articulation sound drills today with high accuracy. During the initial vowel repetition, accuracy reached ninety-four percent across consonant blends.
          </p>
          <p>
            Ongoing speech practice focuses on initial sound clarity and breath control. Morning sound drills will continue five days a week with guided audio feedback.
          </p>
        </TextHighlight>
      </div>
    </div>
  );
};

export const KbdDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-4 text-left">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          Keyboard Shortcuts & Accessibility Hints
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Semantic kbd elements styled with ambient shadows and monospaced typography.
        </p>
      </div>

      {/* Common Shortcuts Table */}
      <div className="rounded-xl border border-outline-variant bg-surface p-4 shadow-ambient flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60 text-xs">
          <span className="font-sans text-on-surface">Search patient records</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60 text-xs">
          <span className="font-sans text-on-surface">Start recording drill</span>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>R</Kbd>
          </KbdGroup>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60 text-xs">
          <span className="font-sans text-on-surface">Dismiss open dialog</span>
          <Kbd>Esc</Kbd>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans text-on-surface">Submit consultation notes</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>
        </div>
      </div>

      {/* Size comparison */}
      <div className="flex flex-col gap-2">
        <span className="font-label text-xs font-semibold text-on-surface-variant">
          Size comparison
        </span>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-on-surface-variant">Default (md):</span>
            <Kbd>Shift</Kbd>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-on-surface-variant">Small (sm):</span>
            <Kbd size="sm">Shift</Kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ItemDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-4 text-left">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-sm font-semibold text-on-surface">
          Structured List Rows & Activity Feed
        </h3>
        <p className="font-sans text-xs text-on-surface-variant">
          Flat content rows with media, titles, descriptions, and action slots. Replaces nested cards inside cards.
        </p>
      </div>

      {/* Structured list with ItemSeparator in surface container */}
      <div className="rounded-xl border border-outline-variant bg-surface p-2 shadow-ambient">
        <ItemGroup>
          <Item interactive>
            <ItemMedia variant="avatar">
              <Avatar
                fallback="JD"
                className="size-10 bg-primary-container text-on-primary-container font-semibold"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Jane Doe</ItemTitle>
              <ItemDescription>
                Initial /s/ blend drills completed with 94% accuracy score.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outlined" colorRole="neutral">Review</Button>
            </ItemActions>
          </Item>

          <ItemSeparator />

          <Item interactive>
            <ItemMedia variant="icon">
              <Icon name="mic" size="sm" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Liam Smith</ItemTitle>
              <ItemDescription>
                Audio practice session recorded. Awaiting therapist review.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" colorRole="primary">Listen</Button>
            </ItemActions>
          </Item>

          <ItemSeparator />

          <Item interactive>
            <ItemMedia variant="icon">
              <Icon name="event" size="sm" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Upcoming Consultation</ItemTitle>
              <ItemDescription>
                Speech therapy evaluation scheduled for Thursday, 10:00 AM.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outlined" colorRole="neutral">Details</Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>
    </div>
  );
};
