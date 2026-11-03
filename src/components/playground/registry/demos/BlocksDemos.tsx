import * as React from 'react';
import {
  DataTable,
  DataTableColumnHeader,
  createSelectColumn,
  createActionsColumn,
  type ColumnDef,
} from '@/components/blocks/data-table';
import { Badge } from '@/components/ui/badge';
import { ApprovalCard } from '@/components/blocks/approval-card';
import {
  Questionnaire,
  QuestionnaireProgress,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireInput,
  QuestionnaireError,
  QuestionnaireActions,
  QuestionnairePrevious,
  QuestionnaireSkip,
  QuestionnaireNext,
  QuestionnaireSubmit,
} from '@/components/blocks/questionnaire';
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
        <Icon name="delete" size="xs" />
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

export const QuestionnaireDemo: React.FC<ComponentDemoProps> = () => {
  const [completedData, setCompletedData] = React.useState<Record<string, any> | null>(null);

  if (completedData) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8">
        <div className="bg-surface rounded-lg p-6 @md:p-8 border border-outline-variant shadow-ambient text-center flex flex-col gap-4">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary-container text-on-primary-container">
            <Icon name="check" size="md" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading font-semibold text-xl text-on-surface">Questionnaire submitted</h3>
            <p className="font-sans text-sm text-on-surface-variant">
              Your responses have been recorded successfully.
            </p>
          </div>
          <div className="bg-surface-container rounded-md p-4 text-left font-mono text-xs text-on-surface-variant border border-outline-variant overflow-x-auto">
            {JSON.stringify(completedData, null, 2)}
          </div>
          <Button
            variant="outline"
            colorRole="neutral"
            onClick={() => setCompletedData(null)}
          >
            Start again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <Questionnaire
        shortcuts="letters"
        defaultItem="direction"
        onComplete={(data) => setCompletedData(data)}
      >
        <QuestionnaireProgress />

        {/* Step 1: Single-choice with freeform input and shortcuts */}
        <QuestionnaireItem name="direction" required>
          <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Choose a direction or write your own. Use keys A–C to choose quickly.
          </QuestionnaireDescription>

          <QuestionnaireChoices>
            <QuestionnaireChoice
              value="delegation"
              label="Delegation"
              description="Show how work moves to a specialist agent."
            />
            <QuestionnaireChoice
              value="questions"
              label="Question prompts"
              description="Show interactive choices while the interface waits."
            />
            <QuestionnaireChoice
              value="both"
              label="Both together"
              description="Demonstrate collaborative handoff and guided clarifying questions."
            />
          </QuestionnaireChoices>

          <QuestionnaireInput placeholder="Type another direction or specific request…" />
          <QuestionnaireError />
        </QuestionnaireItem>

        {/* Step 2: Skippable question */}
        <QuestionnaireItem name="detail">
          <QuestionnaireTitle>How much detail should it include?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Skip this question if you are not sure yet.
          </QuestionnaireDescription>

          <QuestionnaireChoices>
            <QuestionnaireChoice
              value="overview"
              label="Quick summary"
              description="High-level highlights and key decisions."
            />
            <QuestionnaireChoice
              value="standard"
              label="Standard walkthrough"
              description="Balanced balance of context and actions."
            />
            <QuestionnaireChoice
              value="deep"
              label="Comprehensive audit"
              description="Full step-by-step trace with diagnostic logs."
            />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        {/* Step 3: Multiple choice */}
        <QuestionnaireItem name="platforms" type="multiple" required>
          <QuestionnaireTitle>Which platforms should be supported?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Select all that apply for this prototype sequence.
          </QuestionnaireDescription>

          <QuestionnaireChoices columns={2}>
            <QuestionnaireChoice
              value="web"
              label="Web application"
              description="Responsive desktop and mobile web."
            />
            <QuestionnaireChoice
              value="mobile"
              label="Mobile device"
              description="Optimized touch viewports."
            />
            <QuestionnaireChoice
              value="agent"
              label="Agent workspace"
              description="Antigravity interactive side-panel."
            />
            <QuestionnaireChoice
              value="embedded"
              label="Embedded widget"
              description="Self-contained micro-frontend block."
            />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnairePrevious />
          <div className="flex items-center gap-2">
            <QuestionnaireSkip />
            <QuestionnaireNext />
            <QuestionnaireSubmit />
          </div>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
};

export const ChatBlockDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="p-4 rounded-xl border border-outline-variant bg-surface flex flex-col gap-4">
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


interface PatientSessionRecord {
  id: string;
  patientName: string;
  clinician: string;
  status: 'active' | 'completed' | 'scheduled' | 'cancelled';
  accuracy: number;
  sessionDate: string;
}

const SAMPLE_PATIENT_SESSIONS: PatientSessionRecord[] = [
  { id: 'REC-101', patientName: 'Eleanor Vance', clinician: 'Dr. Sarah Jenkins', status: 'completed', accuracy: 94, sessionDate: '2026-11-01' },
  { id: 'REC-102', patientName: 'Marcus Chen', clinician: 'Dr. Sarah Jenkins', status: 'active', accuracy: 88, sessionDate: '2026-11-01' },
  { id: 'REC-103', patientName: 'Aria Montgomery', clinician: 'Alex Mercer, SLP', status: 'scheduled', accuracy: 91, sessionDate: '2026-11-02' },
  { id: 'REC-104', patientName: 'Lucas Scott', clinician: 'Alex Mercer, SLP', status: 'completed', accuracy: 76, sessionDate: '2026-10-30' },
  { id: 'REC-105', patientName: 'Sophia Patel', clinician: 'Dr. Sarah Jenkins', status: 'cancelled', accuracy: 0, sessionDate: '2026-10-29' },
  { id: 'REC-106', patientName: 'Benjamin Hayes', clinician: 'Alex Mercer, SLP', status: 'completed', accuracy: 98, sessionDate: '2026-10-28' },
  { id: 'REC-107', patientName: 'Chloe Bennett', clinician: 'Dr. Sarah Jenkins', status: 'active', accuracy: 84, sessionDate: '2026-11-01' },
  { id: 'REC-108', patientName: 'David Kim', clinician: 'Alex Mercer, SLP', status: 'completed', accuracy: 92, sessionDate: '2026-10-27' },
];

export const DataTableDemo: React.FC<ComponentDemoProps> = () => {
  const columns = React.useMemo<ColumnDef<PatientSessionRecord>[]>(
    () => [
      createSelectColumn<PatientSessionRecord>(),
      {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Record" />,
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-on-surface">
            {row.getValue('id')}
          </span>
        ),
      },
      {
        accessorKey: 'patientName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient Name" />,
        cell: ({ row }) => (
          <span className="font-medium text-on-surface">{row.getValue('patientName')}</span>
        ),
      },
      {
        accessorKey: 'clinician',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Clinician" />,
        cell: ({ row }) => (
          <span className="text-on-surface-variant text-xs">{row.getValue('clinician')}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue('status') as PatientSessionRecord['status'];
          switch (status) {
            case 'completed':
              return <Badge variant="outline" colorRole="success" size="sm">Completed</Badge>;
            case 'active':
              return <Badge variant="outline" colorRole="primary" size="sm">Active</Badge>;
            case 'scheduled':
              return <Badge variant="outline" colorRole="neutral" size="sm">Scheduled</Badge>;
            case 'cancelled':
              return <Badge variant="outline" colorRole="error" size="sm">Cancelled</Badge>;
            default:
              return null;
          }
        },
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'accuracy',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Accuracy" numeric />
        ),
        cell: ({ row }) => {
          const acc = row.getValue('accuracy') as number;
          return <span>{acc}%</span>;
        },
        meta: {
          numeric: true,
          align: 'right',
        },
      },
      {
        accessorKey: 'sessionDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-on-surface-variant">
            {row.getValue('sessionDate')}
          </span>
        ),
      },
      createActionsColumn<PatientSessionRecord>([
        {
          label: 'View details',
          icon: 'visibility',
          onClick: () => {},
        },
        {
          label: 'Export notes',
          icon: 'download',
          shortcut: '⌘E',
          onClick: () => {},
        },
        {
          label: 'Archive session',
          icon: 'archive',
          destructive: true,
          onClick: () => {},
        },
      ]),
    ],
    []
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <DataTable
        columns={columns}
        data={SAMPLE_PATIENT_SESSIONS}
        searchKey="patientName"
        searchPlaceholder="Search patients…"
        facetedFilters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active', icon: 'play_circle' },
              { label: 'Completed', value: 'completed', icon: 'check_circle' },
              { label: 'Scheduled', value: 'scheduled', icon: 'event' },
              { label: 'Cancelled', value: 'cancelled', icon: 'cancel' },
            ],
          },
        ]}
        pageSizeOptions={[5, 10, 20]}
        showSelectedCount
      />
    </div>
  );
};
