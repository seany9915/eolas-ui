import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
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
import { ComponentDemoProps } from '../types';

export const CardDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs font-bold text-on-surface">Card Default Elevation</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">
            Ambient
          </span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Follows DESIGN.md surface tokens, border-outline-variant, and 8px concentric inner corner radii.
        </p>
      </Card>
      <Card className="p-6 space-y-3 border-primary/40 bg-surface-container/20">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs font-bold text-primary">Card Highlight Variant</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold">
            Active
          </span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Surface card with primary border accent for highlighted items.
        </p>
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
    <div className="w-full py-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
        <span className="font-heading font-bold text-on-surface">Practice Group Table</span>
        <span className="font-mono text-[11px]">Supports responsive stack &amp; tabular-nums</span>
      </div>
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} responsive="scroll" />
    </div>
  );
};

export const ChartDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-xl bg-surface border border-outline-variant space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-bold text-on-surface">Sound Accuracy Trend (7 Days)</span>
        <span className="font-mono text-xs font-bold text-primary">Target: 80% or Higher</span>
      </div>
      <div className="h-44 rounded-lg bg-surface-container/60 border border-outline-variant/60 flex items-center justify-center text-xs font-mono text-on-surface-variant">
        Practice Accuracy Chart Preview
      </div>
    </div>
  );
};

export const SeparatorDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4 text-center text-xs font-sans text-on-surface-variant">
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
    <div className="w-full py-4 space-y-2">
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
      <Collapsible.Root open={open} onOpenChange={setOpen} className="rounded-xl border border-outline-variant bg-surface p-4 space-y-3">
        <Collapsible.Trigger>
          <span>Articulation Exercise Instructions</span>
        </Collapsible.Trigger>
        <Collapsible.Panel className="text-xs font-sans text-on-surface-variant pt-2 border-t border-outline-variant/60 leading-relaxed">
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
    <div className="w-full max-w-md mx-auto py-4 space-y-3">
      <Attachment
        fileName="Practice_Worksheet_Module2.pdf"
        fileSize="4.2 MB"
        fileType="pdf"
        status="completed"
      />
      <Attachment
        fileName="Session_Audio_Recording.mp3"
        fileSize="18.5 MB"
        fileType="video"
        status="uploading"
        uploadProgress={65}
      />
    </div>
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
    <div className="w-full max-w-md mx-auto py-4 space-y-3">
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
          <div className="space-y-1">
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
  return (
    <div className="w-full max-w-md mx-auto py-4 text-xs font-sans text-on-surface leading-relaxed">
      <div className="leading-relaxed">
        The learner practiced <TextHighlight query="consonant">consonant blends</TextHighlight> during today's sound drills.
      </div>
    </div>
  );
};
