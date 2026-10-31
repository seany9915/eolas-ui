import { Button } from '@/components/ui/button';
import * as React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { NavigationMenu, NavigationMenuItemData } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scrollspy } from '@/components/ui/scrollspy';
import { StepWizard } from '@/components/ui/step-wizard';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const TabsDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* 1. Primary Line Underline Variant */}
      <div className="space-y-3">
        <div className="space-y-0.5">
          <h4 className="font-heading text-sm font-semibold text-on-surface">
            Session Notes Tabs (Line Variant)
          </h4>
          <p className="font-sans text-xs text-on-surface-variant">
            In-page section navigation with primary underline indicator
          </p>
        </div>
        <Tabs.Root defaultValue="assessment" variant="line">
          <Tabs.List className="w-full border-b border-outline-variant">
            <Tabs.Tab value="assessment" icon="assignment">
              Assessment
            </Tabs.Tab>
            <Tabs.Tab value="observations" icon="record_voice_over">
              Practice Goals
            </Tabs.Tab>
            <Tabs.Tab value="care-plan" icon="health_and_safety">
              Weekly Plan
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="assessment" className="pt-4 font-sans text-base text-on-surface leading-relaxed">
            The learner made clear progress in word-sound practice today. Accuracy reached 85% across all 20 practice words.
          </Tabs.Panel>
          <Tabs.Panel value="observations" className="pt-4 font-sans text-base text-on-surface leading-relaxed">
            Completed 3 sound repetition sets with audio feedback. Pronunciation of initial /s/ blends was steady throughout.
          </Tabs.Panel>
          <Tabs.Panel value="care-plan" className="pt-4 font-sans text-base text-on-surface leading-relaxed">
            Practice 10 minutes daily using the syllable flashcards. Next review session is scheduled for Tuesday morning.
          </Tabs.Panel>
        </Tabs.Root>
      </div>

      {/* 2. Segmented Pill Tabs Variant */}
      <div className="space-y-3">
        <div className="space-y-0.5">
          <h4 className="font-heading text-sm font-semibold text-on-surface">
            Activity View Switcher (Segmented Variant)
          </h4>
          <p className="font-sans text-xs text-on-surface-variant">
            Elevated surface pill indicator against container track
          </p>
        </div>
        <Tabs.Root defaultValue="summary" variant="segmented">
          <Tabs.List variant="segmented">
            <Tabs.Tab value="summary" icon="table_chart">
              Summary
            </Tabs.Tab>
            <Tabs.Tab value="activity" icon="show_chart">
              Activity
            </Tabs.Tab>
            <Tabs.Tab value="history" icon="history">
              History
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="summary" className="pt-3 font-sans text-base text-on-surface-variant leading-relaxed">
            Summary of practice sessions over the past 7 days. Daily practice goals were completed on 6 of 7 days.
          </Tabs.Panel>
          <Tabs.Panel value="activity" className="pt-3 font-sans text-base text-on-surface-variant leading-relaxed">
            Sound clarity and rhythm feedback from today's recorded practice session.
          </Tabs.Panel>
          <Tabs.Panel value="history" className="pt-3 font-sans text-base text-on-surface-variant leading-relaxed">
            Sound recognition scores improved by 12% over the last two weeks of practice.
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
};

export const AccordionDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Accordion className="rounded-xl border border-outline-variant bg-surface overflow-hidden">
        <AccordionItem value="history">
          <AccordionHeader>
            <AccordionTrigger className="font-heading text-xs font-bold text-on-surface py-3 px-4">
              Practice History
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="px-4 pb-3 pt-1 text-xs font-sans text-on-surface-variant leading-relaxed">
            Started speech practice in September 2024. Primary focus is clear articulation of /r/ and /s/ blends.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="allergies">
          <AccordionHeader>
            <AccordionTrigger className="font-heading text-xs font-bold text-on-surface py-3 px-4">
              Session Preferences
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="px-4 pb-3 pt-1 text-xs font-sans text-on-surface-variant leading-relaxed">
            Prefers picture card prompts over audio-only cues. 15-minute practice intervals.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const BreadcrumbDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#hospitals">Speech Therapy</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#paediatrics">Word Sound Drills</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Initial /s/ Blends</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export const PaginationDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export const NavigationMenuDemo: React.FC<ComponentDemoProps> = () => {
  const [activeId, setActiveId] = React.useState('caseload-active');

  const navigationItems: NavigationMenuItemData[] = [
    {
      id: 'caseload',
      label: 'Learners',
      icon: 'groups',
      children: [
        {
          id: 'caseload-active',
          label: 'Active Learners',
          description: 'Learners currently enrolled in speech practice programs',
          icon: 'face',
          onClick: () => setActiveId('caseload-active'),
        },
        {
          id: 'caseload-discharged',
          label: 'Completed Programs',
          description: 'Summaries for learners who completed their plan',
          icon: 'inventory_2',
          onClick: () => setActiveId('caseload-discharged'),
        },
        {
          id: 'caseload-referrals',
          label: 'New Requests',
          description: 'New referrals and assessment requests',
          icon: 'outgoing_mail',
          onClick: () => setActiveId('caseload-referrals'),
        },
      ],
    },
    {
      id: 'protocols',
      label: 'Practice Guides',
      icon: 'menu_book',
      children: [
        {
          id: 'protocols-nice',
          label: 'Pronunciation Guide',
          description: 'Step-by-step articulation exercises and sound cues',
          icon: 'verified',
          onClick: () => setActiveId('protocols-nice'),
        },
        {
          id: 'protocols-drills',
          label: 'Syllable Drills',
          description: 'Daily repetition exercises for consonant blends',
          icon: 'record_voice_over',
          onClick: () => setActiveId('protocols-drills'),
        },
      ],
    },
    {
      id: 'reports',
      label: 'Progress Reports',
      icon: 'insights',
      onClick: () => setActiveId('reports'),
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-outline-variant bg-surface overflow-visible">
      {/* Navigation Header Chrome */}
      <div className="bg-surface px-4 border-b border-outline-variant">
        <NavigationMenu
          items={navigationItems}
          activeId={activeId}
          className="justify-start"
        />
      </div>

      {/* Destination Content View */}
      <div className="p-6 bg-surface min-h-[140px] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-primary">
            Active Section
          </span>
          <span className="text-xs font-mono text-on-surface-variant">/</span>
          <span className="text-xs font-mono font-bold text-on-surface">{activeId}</span>
        </div>
        <h5 className="font-heading text-headline-sm font-semibold text-on-surface">
          {activeId === 'caseload-active'
            ? 'Active Learners'
            : activeId === 'caseload-discharged'
            ? 'Completed Programs'
            : activeId === 'caseload-referrals'
            ? 'Specialist Requests'
            : activeId === 'protocols-nice'
            ? 'Pronunciation Guide'
            : activeId === 'protocols-drills'
            ? 'Syllable Drills'
            : 'Progress Reports'}
        </h5>
        <p className="font-sans text-base text-on-surface-variant leading-relaxed">
          Hover or focus with Tab/Arrow keys on "Learners" or "Practice Guides" to reveal Base UI sliding mega-menu popups with directional viewport animations.
        </p>
      </div>
    </div>
  );
};

export const SidebarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border border-outline-variant bg-surface space-y-3">
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <Icon name="record_voice_over" size="sm" className="text-primary" />
        <span className="font-heading text-xs font-bold text-on-surface">Practice Navigation</span>
      </div>
      <div className="space-y-1 text-xs font-sans text-on-surface-variant">
        <div className="p-2 rounded-lg bg-primary-container text-on-primary-container font-semibold flex items-center gap-2">
          <Icon name="groups" size="sm" />
          <span>Active Practice Groups (3)</span>
        </div>
        <div className="p-2 rounded-lg hover:bg-surface-container flex items-center gap-2">
          <Icon name="volume_up" size="sm" />
          <span>Morning Sound Drills (18)</span>
        </div>
        <div className="p-2 rounded-lg hover:bg-surface-container flex items-center gap-2">
          <Icon name="checklist" size="sm" />
          <span>Weekly Review List</span>
        </div>
      </div>
    </div>
  );
};

export const StepWizardDemo: React.FC<ComponentDemoProps> = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const steps = [
    {
      id: 'step-1',
      title: 'Initial Assessment',
      description: 'Record baseline articulation accuracy and target sounds',
      content: (
        <div className="space-y-4 font-sans text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-surface-container/40 border border-outline-variant/60">
            <div>
              <span className="font-mono text-xs text-on-surface-variant block">Sound Accuracy</span>
              <span className="text-base font-bold text-on-surface font-mono tabular-nums">84% Baseline</span>
            </div>
            <div>
              <span className="font-mono text-xs text-on-surface-variant block">Practice Rhythm</span>
              <span className="text-base font-bold text-on-surface font-mono tabular-nums">92% Pace</span>
            </div>
            <div>
              <span className="font-mono text-xs text-on-surface-variant block">Target Sounds</span>
              <span className="text-base font-bold text-on-surface font-mono">/r/ and /s/ blends</span>
            </div>
            <div>
              <span className="font-mono text-xs text-on-surface-variant block">Session Target</span>
              <span className="text-base font-bold text-on-surface font-mono">15 min / day</span>
            </div>
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Baseline scores confirm readiness for standard home sound practice exercises.
          </p>
        </div>
      ),
    },
    {
      id: 'step-2',
      title: 'Therapist Review',
      description: 'Review sound clarity scores and practice recommendations',
      content: (
        <div className="space-y-4 font-sans text-sm">
          <div className="p-4 rounded-lg bg-surface-container/40 border border-outline-variant/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label font-semibold text-on-surface">Articulation Score</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary-container">
                Level 2 Target
              </span>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Pronunciation of vowel sounds is clear and consistent. Maximum sustained sound duration was 18 seconds.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container/30 border border-outline-variant/40">
            <Icon name="verified_user" size="sm" className="text-secondary shrink-0" />
            <span className="text-body-md text-on-surface">Reviewed by C. Doherty, Speech-Language Pathologist</span>
          </div>
        </div>
      ),
    },
    {
      id: 'step-3',
      title: 'Weekly Practice Plan',
      description: 'Confirm practice exercises and session schedule',
      content: (
        <div className="space-y-4 font-sans text-sm">
          <div className="p-4 rounded-lg bg-surface-container/40 border border-outline-variant/60 space-y-2">
            <span className="font-label font-semibold text-on-surface block">Practice Plan Details</span>
            <ul className="space-y-1.5 text-body-md text-on-surface-variant list-disc pl-5">
              <li>Two review sessions each week (Clinic Room 2B)</li>
              <li>Daily 15-minute home practice using interactive word cards</li>
              <li>Progress review at the end of week two</li>
            </ul>
          </div>
          {isCompleted && (
            <div className="p-3 rounded-lg bg-success-container text-on-success-container font-sans text-body-md font-medium flex items-center gap-2">
              <Icon name="check_circle" size="sm" className="text-success shrink-0" />
              <span>Practice plan saved successfully</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <StepWizard
        steps={steps}
        currentStepIndex={currentStep}
        onStepChange={setCurrentStep}
        onComplete={() => setIsCompleted(true)}
        completeLabel="Save Plan"
        allowStepClick
      />
    </div>
  );
};

export const SteppersLegacyDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <InlineAlert
        role="warning"
        title="Legacy Re-Export Alias"
      >
        steppers.tsx is an alias for number-field.tsx. New code should import NumberField directly from @/components/ui/number-field.
      </InlineAlert>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2 text-xs font-mono">
        <p className="text-on-surface">Modern replacement import:</p>
        <p className="text-primary font-bold">import &#123; NumberField &#125; from '@/components/ui/number-field';</p>
      </div>
    </div>
  );
};

export const ScrollAreaDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-4">
      <ScrollArea className="h-44 rounded-xl border border-outline-variant bg-surface p-4">
        <div className="space-y-2 text-xs font-sans text-on-surface-variant">
          <h4 className="font-heading text-xs font-bold text-on-surface mb-2">Recent Practice Sessions</h4>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-2 rounded bg-surface-container border border-outline-variant/50 font-mono text-[11px]">
              Session {i + 1} - Accuracy: {85 + (i % 10)}% | Practice words: {15 + i}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const ScrollspyDemo: React.FC<ComponentDemoProps> = () => {
  const [active, setActive] = React.useState('sec-2');
  const items = [
    { id: 'sec-1', label: '1. Program Overview' },
    { id: 'sec-2', label: '2. Baseline Assessment' },
    { id: 'sec-3', label: '3. Daily Practice Drills' },
    { id: 'sec-4', label: '4. Weekly Progress Review' },
  ];

  return (
    <div className="w-full max-w-md mx-auto py-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="font-heading font-bold text-on-surface">Practice Guide Table of Contents</span>
        <span className="font-mono text-[11px]">Active: {active}</span>
      </div>

      <div className="p-2 rounded-xl bg-surface-container/20 border border-outline-variant/60">
        <Scrollspy
          items={items.map((item) => ({
            ...item,
            label: (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item.id);
                }}
                className="w-full"
              >
                {item.label}
              </span>
            ),
          }))}
          activeId={active}
          onActiveChange={setActive}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span className="font-sans text-xs text-on-surface-variant">Select section:</span>
        <Button size="sm" variant={active === 'sec-1' ? 'filled' : 'outlined'} onClick={() => setActive('sec-1')}>
          Sec 1
        </Button>
        <Button size="sm" variant={active === 'sec-2' ? 'filled' : 'outlined'} onClick={() => setActive('sec-2')}>
          Sec 2
        </Button>
        <Button size="sm" variant={active === 'sec-3' ? 'filled' : 'outlined'} onClick={() => setActive('sec-3')}>
          Sec 3
        </Button>
        <Button size="sm" variant={active === 'sec-4' ? 'filled' : 'outlined'} onClick={() => setActive('sec-4')}>
          Sec 4
        </Button>
      </div>
    </div>
  );
};
