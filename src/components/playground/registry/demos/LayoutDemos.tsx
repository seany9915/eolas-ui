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
          High-contrast clinical surface card for telemetry monitoring and critical patient alerts.
        </p>
      </Card>
    </div>
  );
};

export const TableDemo: React.FC<ComponentDemoProps> = () => {
  interface PatientRow {
    id: string;
    name: string;
    bed: string;
    status: string;
    spo2: number;
    hr: number;
  }

  const columns = [
    { header: 'Patient Name', accessor: (row: PatientRow) => row.name },
    { header: 'Bed Assignment', accessor: (row: PatientRow) => row.bed },
    { header: 'Clinical Status', accessor: (row: PatientRow) => row.status },
    { header: 'SpO2 (%)', accessor: (row: PatientRow) => `${row.spo2}%`, numeric: true },
    { header: 'Heart Rate (bpm)', accessor: (row: PatientRow) => `${row.hr} bpm`, numeric: true },
  ];

  const data: PatientRow[] = [
    { id: '1', name: 'Eleanor Vance', bed: 'Bay 03 - Bed 01', status: 'Stable', spo2: 98, hr: 72 },
    { id: '2', name: 'Arthur Pendelton', bed: 'Bay 03 - Bed 02', status: 'Observation', spo2: 95, hr: 84 },
    { id: '3', name: 'Marcus Brody', bed: 'Bay 03 - Bed 03', status: 'STAT Review', spo2: 89, hr: 118 },
  ];

  return (
    <div className="w-full py-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
        <span className="font-heading font-bold text-on-surface">Unconstrained Clinical Caseload Table</span>
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
        <span className="font-heading text-xs font-bold text-on-surface">Telemetry SpO2 Trend (24h)</span>
        <span className="font-mono text-xs font-bold text-primary">Normal Range 95-100%</span>
      </div>
      <div className="h-44 rounded-lg bg-surface-container/60 border border-outline-variant/60 flex items-center justify-center text-xs font-mono text-on-surface-variant">
        Recharts Clinical Visualization Primitive
      </div>
    </div>
  );
};

export const SeparatorDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4 text-center text-xs font-sans text-on-surface-variant">
      <div>Section 1: Admission Criteria</div>
      <Separator />
      <div>Section 2: Pharmacological Protocol</div>
      <Separator />
      <div>Section 3: Discharge Clearance</div>
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
            <span className="font-bold text-on-surface block mb-1">Left Pane: Patient Longitudinal Chart</span>
            <span className="text-on-surface-variant">NHS Patient Record #992-019-281</span>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30} className="p-4 bg-surface text-xs font-sans">
            <span className="font-bold text-on-surface block mb-1">Right Pane: Active Vitals Stream</span>
            <span className="text-on-surface-variant">Continuous 12-lead telemetry channel 1</span>
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
          <span>Emergency Resuscitation Protocol</span>
        </Collapsible.Trigger>
        <Collapsible.Panel className="text-xs font-sans text-on-surface-variant pt-2 border-t border-outline-variant/60 leading-relaxed">
          Administer 1mg Adrenaline (1:10,000) IV every 3-5 minutes during cardiopulmonary resuscitation.
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
              Clinical Slide 1: Primary Assessment
            </div>
          </CarouselItem>
          <CarouselItem className="p-4">
            <div className="h-32 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
              Clinical Slide 2: Airway &amp; Breathing
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
      <Avatar fallback="ICU" />
    </div>
  );
};

export const IconDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6">
      <Icon name="local_hospital" size="lg" className="text-primary" />
      <Icon name="vital_signs" size="lg" className="text-secondary" />
      <Icon name="emergency" size="lg" className="text-error" />
      <Icon name="clinical_notes" size="lg" className="text-warning" />
      <Icon name="verified" size="lg" className="text-success" />
    </div>
  );
};

export const AttachmentDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4 space-y-3">
      <Attachment
        fileName="Chest_XRay_AP_Bed04.pdf"
        fileSize="4.2 MB"
        fileType="pdf"
        status="completed"
      />
      <Attachment
        fileName="Longitudinal_ECHO_Telemetry.dcm"
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
        Sticky Floating Clinical Banner: Active Code Blue in ICU 3
      </StickyContainer>
    </div>
  );
};

export const DeferredViewDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <DeferredView estimatedHeight={80}>
        <div className="p-4 rounded-xl bg-surface border border-outline-variant text-xs font-sans">
          Deferred telemetry module mounted safely without blocking main hydration.
        </div>
      </DeferredView>
    </div>
  );
};

export const SwipeRevealDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <SwipeReveal
        leadingActions={<Button colorRole="error" size="sm">Dismiss</Button>}
        actions={<Button colorRole="success" size="sm">Acknowledge</Button>}
      >
        <div className="p-4 rounded-xl bg-surface border border-outline-variant text-xs font-sans">
          Swipe left or right on mobile devices to trigger clinical triage gestures.
        </div>
      </SwipeReveal>
    </div>
  );
};

export const TextHighlightDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4 text-xs font-sans text-on-surface leading-relaxed">
      <p>
        Patient was administered <TextHighlight query="Paracetamol">Paracetamol 1000mg</TextHighlight> intravenously following high-grade pyrexia.
      </p>
    </div>
  );
};
