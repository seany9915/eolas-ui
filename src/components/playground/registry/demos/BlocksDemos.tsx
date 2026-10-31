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
        title="Update Weekly Practice Plan"
        description="Select the target sound set for this week's practice sessions."
        options={[
          { id: 'opt-1', label: 'Vocalic /r/ Sound Practice', description: '15 minutes daily with audio feedback' },
          { id: 'opt-2', label: 'S-Blend Syllables', description: '10 minutes daily with picture cards' },
        ]}
        selectedOptionId={selected}
        onSelectOption={setSelected}
        stepCurrent={1}
        stepTotal={2}
        confirmLabel="Confirm Practice Plan"
        onConfirm={() => {}}
      />
    </div>
  );
};

export const MetricCardDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto py-6">
      <MetricCard
        title="Active Practice Sessions"
        value={142}
        icon="record_voice_over"
        change="+8% vs last week"
        changeType="positive"
        description="Active sessions across groups"
      />
      <MetricCard
        title="Daily Goal Completion"
        value="92%"
        icon="task_alt"
        change="+4% this week"
        changeType="positive"
        description="Learners meeting daily goal"
      />
      <MetricCard
        title="Average Session Time"
        value="14 min"
        icon="timer"
        change="-3 min faster"
        changeType="positive"
        description="Median practice duration"
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
        Open Delete Confirmation
      </Button>
      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        itemName="Session Notes Template (Draft)"
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
        searchPlaceholder="Filter learners by name or ID..."
        filterGroups={[
          {
            id: 'status',
            label: 'Status',
            value: 'all',
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'review', label: 'Needs Review' },
              { value: 'active', label: 'Active' },
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
            <span className="font-heading text-sm font-bold text-on-surface">Assistant Chat Workspace</span>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
            Composite Block
          </span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          The <code>Chat</code> block assembles <code>MessageScroller</code>, <code>ChatMessage</code>, <code>PromptInput</code>, and <code>SuggestionChips</code> into an interactive chat workspace.
        </p>
        <div className="bg-surface-container rounded-lg p-3 font-mono text-xs border border-outline-variant">
          import &#123; Chat &#125; from '@/components/blocks/chat';
        </div>
      </div>
    </div>
  );
};
