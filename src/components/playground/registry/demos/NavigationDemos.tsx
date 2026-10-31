import { Button } from '@/components/ui/button';
import * as React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scrollspy } from '@/components/ui/scrollspy';
import { StepWizard } from '@/components/ui/step-wizard';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const TabsDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <span className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
          Segmented Tabs Variant
        </span>
        <Tabs.Root defaultValue="triage">
          <Tabs.List variant="segmented" className="w-full">
            <Tabs.Tab value="triage">Emergency Triage</Tabs.Tab>
            <Tabs.Tab value="labs">Lab Diagnostics</Tabs.Tab>
            <Tabs.Tab value="imaging">Radiology Scans</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="triage" className="p-4 rounded-xl bg-surface-container border border-outline-variant mt-2 text-xs font-sans">
            Triage Level 2: Immediate physician examination required. Vitals telemetry active.
          </Tabs.Panel>
          <Tabs.Panel value="labs" className="p-4 rounded-xl bg-surface-container border border-outline-variant mt-2 text-xs font-sans">
            Complete metabolic profile & blood gas panel reported normal.
          </Tabs.Panel>
          <Tabs.Panel value="imaging" className="p-4 rounded-xl bg-surface-container border border-outline-variant mt-2 text-xs font-sans">
            Chest CT angiogram with contrast scheduled at 14:30.
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
              Longitudinal Clinical History
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="px-4 pb-3 pt-1 text-xs font-sans text-on-surface-variant leading-relaxed">
            Patient has documented history of pediatric asthma and seasonal atopic dermatitis. No prior surgical interventions.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="allergies">
          <AccordionHeader>
            <AccordionTrigger className="font-heading text-xs font-bold text-on-surface py-3 px-4">
              Adverse Drug Reactions & Allergies
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="px-4 pb-3 pt-1 text-xs font-sans text-on-surface-variant leading-relaxed">
            Severe anaphylactic allergy to Penicillin and Beta-lactam antibiotics. Documented 2021.
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
            <BreadcrumbLink href="#hospitals">Royal Victoria Hospital</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#paediatrics">Paediatrics Ward</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bay 3 - Bed 04</BreadcrumbPage>
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
  return (
    <div className="w-full max-w-xl mx-auto py-6 flex justify-center">
      <NavigationMenu.Root className="bg-surface rounded-xl border border-outline-variant p-1">
        <NavigationMenu.List className="flex items-center gap-2">
          <NavigationMenu.Item value="clinical">
            <NavigationMenu.Link href="#clinical" className="px-3 py-1.5 text-xs font-heading font-bold text-primary">
              Clinical Caseload
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="protocols">
            <NavigationMenu.Link href="#protocols" className="px-3 py-1.5 text-xs font-heading font-medium text-on-surface hover:text-primary">
              NICE Protocols
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="telemetry">
            <NavigationMenu.Link href="#telemetry" className="px-3 py-1.5 text-xs font-heading font-medium text-on-surface hover:text-primary">
              Ward Telemetry
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
};

export const SidebarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border border-outline-variant bg-surface space-y-3">
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <Icon name="local_hospital" size="sm" className="text-primary" />
        <span className="font-heading text-xs font-bold text-on-surface">Eolas Ward Management Sidebar</span>
      </div>
      <div className="space-y-1 text-xs font-sans text-on-surface-variant">
        <div className="p-2 rounded-lg bg-primary-container text-on-primary-container font-semibold flex items-center gap-2">
          <Icon name="emergency" size="sm" />
          <span>Active Resuscitation Bays (3)</span>
        </div>
        <div className="p-2 rounded-lg hover:bg-surface-container flex items-center gap-2">
          <Icon name="hotel" size="sm" />
          <span>Inpatient Floor 2 (18 beds)</span>
        </div>
        <div className="p-2 rounded-lg hover:bg-surface-container flex items-center gap-2">
          <Icon name="medication" size="sm" />
          <span>Pharmacy Dispensing Queue</span>
        </div>
      </div>
    </div>
  );
};

export const StepWizardDemo: React.FC<ComponentDemoProps> = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    {
      id: 'step-1',
      title: 'Triage Assessment',
      description: 'Record vitals',
      content: <div className="text-xs p-2">Vitals record form</div>,
    },
    {
      id: 'step-2',
      title: 'Physician Review',
      description: 'Diagnosis check',
      content: <div className="text-xs p-2">Review diagnosis notes</div>,
    },
    {
      id: 'step-3',
      title: 'Prescription Order',
      description: 'Pharmacy delivery',
      content: <div className="text-xs p-2">Confirm medication orders</div>,
    },
  ];
  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <StepWizard
        steps={steps}
        currentStepIndex={currentStep}
        onStepChange={setCurrentStep}
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
          <h4 className="font-heading text-xs font-bold text-on-surface mb-2">Longitudinal Telemetry Events</h4>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-2 rounded bg-surface-container border border-outline-variant/50 font-mono text-[11px]">
              14:{String(10 + i).padStart(2, '0')}:22 - SpO2: {97 + (i % 3)}% | HR: {72 + (i % 5)} bpm
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
    { id: 'sec-1', label: '1. Admission & Inclusion Criteria' },
    { id: 'sec-2', label: '2. Rapid Triage Acuity Assessment' },
    { id: 'sec-3', label: '3. Emergency Interventions & Resuscitation' },
    { id: 'sec-4', label: '4. Continuous Monitoring & Handover' },
  ];

  return (
    <div className="w-full max-w-md mx-auto py-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <span className="font-heading font-bold text-on-surface">Clinical Protocol Table of Contents</span>
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
