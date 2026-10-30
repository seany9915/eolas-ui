import * as React from 'react';
import { ApprovalCard } from '@/components/blocks/approval-card';
import { MetricCard } from '@/components/blocks/metric-card';
import { DeleteConfirmationDialog } from '@/components/blocks/delete-confirmation-dialog';
import { FilterToolbar } from '@/components/blocks/filter-toolbar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const ApprovalCardDemo: React.FC<ComponentDemoProps> = () => {
  const [selected, setSelected] = React.useState('opt-1');
  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <ApprovalCard
        title="Approve Antibiotic Step-Down"
        description="Clinical decision support has evaluated blood cultures as negative for 48 hours."
        options={[
          { id: 'opt-1', label: 'Oral Co-Amoxiclav 625mg TDS', description: 'Standard 5-day step-down regime' },
          { id: 'opt-2', label: 'Continue IV Cefotaxime 1g BD', description: 'Extend IV cover for further 24 hours' },
        ]}
        selectedOptionId={selected}
        onSelectOption={setSelected}
        stepCurrent={1}
        stepTotal={2}
        confirmLabel="Confirm Step-Down Plan"
        onConfirm={() => {}}
      />
    </div>
  );
};

export const MetricCardDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto py-6">
      <MetricCard
        title="Total Inpatient Admissions"
        value={142}
        icon="hotel"
        change="+8% vs yesterday"
        changeType="positive"
        description="Active caseload in Ward A & B"
      />
      <MetricCard
        title="ICU Bed Utilization"
        value="92%"
        icon="local_hospital"
        change="Near Capacity"
        changeType="negative"
        description="2 beds remaining in Unit"
      />
      <MetricCard
        title="Average Triage Time"
        value="14 min"
        icon="timer"
        change="-3 min faster"
        changeType="positive"
        description="Median arrival to triage"
      />
    </div>
  );
};

export const DeleteConfirmationDialogDemo: React.FC<ComponentDemoProps> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Button colorRole="error" onClick={() => setOpen(true)}>
        <Icon name="delete" size="xs" className="mr-2" />
        Open Delete Confirmation Block
      </Button>
      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        itemName="Discharge Protocol Template (Draft)"
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
};

export const FilterToolbarDemo: React.FC<ComponentDemoProps> = () => {
  const [q, setQ] = React.useState('');
  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <FilterToolbar
        searchQuery={q}
        onSearchChange={setQ}
        searchPlaceholder="Filter patients by name or NHS number..."
        filterGroups={[
          {
            id: 'status',
            label: 'Triage Status',
            value: 'all',
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'critical', label: 'STAT / Critical' },
              { value: 'routine', label: 'Routine' },
            ],
          },
        ]}
      />
    </div>
  );
};

export const ChatBlockDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="p-4 rounded-xl border border-outline-variant bg-surface space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <Icon name="chat" size="sm" className="text-primary" />
            <span className="font-heading text-sm font-bold text-on-surface">Clinical Assistant Workspace Block</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
            Composite Block
          </span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          The <code>Chat</code> block assembles <code>MessageScroller</code>, <code>ChatMessage</code>, <code>PromptInput</code>, and <code>SuggestionChips</code> into a full clinical AI assistant workspace.
        </p>
        <div className="bg-surface-container rounded-lg p-3 font-mono text-xs border border-outline-variant">
          import &#123; Chat &#125; from '@/components/blocks/chat';
        </div>
      </div>
    </div>
  );
};
