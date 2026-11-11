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
import { ChartCard } from '@/components/blocks/chart-card';
import { AreaChartCard } from '@/components/blocks/area-chart-card';
import { BarChartCard } from '@/components/blocks/bar-chart-card';
import { LineChartCard } from '@/components/blocks/line-chart-card';
import { PieChartCard } from '@/components/blocks/pie-chart-card';
import { RadialChartCard } from '@/components/blocks/radial-chart-card';
import { RadarChartCard } from '@/components/blocks/radar-chart-card';
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
import { ListDetailBlock, type ListDetailItem } from '@/components/blocks/list-detail-block';
import { SupportingPaneBlock } from '@/components/blocks/supporting-pane-block';
import { AppShell } from '@/components/blocks/app-shell';
import { Chat, type ChatMessageData } from '@/components/blocks/chat';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Empty } from '@/components/ui/empty';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { Item } from '@/components/ui/item';
import { ClinicianTip } from '@/components/ui/clinician-tip';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Sidebar } from '@/components/ui/sidebar';
import { ComponentDemoProps } from '../types';
import { cn } from '@/lib/utils';

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
        onReset={() => setQ('')}
        searchPlaceholder="Filter learners by name or ID..."
        filterGroups={[
          {
            id: 'status',
            label: 'Status',
            value: 'all',
            defaultValue: 'all',
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

          <QuestionnaireInput label="Another direction" placeholder="Type another direction or specific request…" />
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

const INITIAL_DEMO_MESSAGES: ChatMessageData[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Can you summarize Marcus Chen’s progress over the last 4 speech therapy sessions?',
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Marcus has shown steady progress across all targeted phonemes. In session 4, his /r/ articulation accuracy reached 88%, up from 72% in baseline testing. Clinician notes indicate high engagement when using auditory feedback cues.',
    timestamp: '10:15 AM',
    reasoning: 'Reviewing session transcripts REC-101 through REC-104 for target phoneme milestones and clinician notes.',
    reasoningDuration: '1.2s',
  },
];

export const ChatBlockDemo: React.FC<ComponentDemoProps> = () => {
  const [messages, setMessages] = React.useState<ChatMessageData[]>(INITIAL_DEMO_MESSAGES);
  const [inputValue, setInputValue] = React.useState('');
  const [isFloating, setIsFloating] = React.useState(false);
  const [model, setModel] = React.useState('gemini-pro');

  const handleSend = (text: string) => {
    const userMsg: ChatMessageData = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };
    const botReply: ChatMessageData = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: `Received query: "${text}". Analysis generated according to current clinical guidelines.`,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg, botReply]);
    setInputValue('');
  };

  const handleReset = () => {
    setMessages(INITIAL_DEMO_MESSAGES);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icon name="chat" size="sm" className="text-primary" />
          <span className="font-heading text-sm font-semibold text-on-surface">Interactive Chat Block</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            colorRole="neutral"
            size="sm"
            onClick={() => setIsFloating((f) => !f)}
          >
            {isFloating ? 'Switch to Docked' : 'Switch to Floating'}
          </Button>
          <Button
            variant="ghost"
            colorRole="neutral"
            size="sm"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="h-[520px] w-full rounded-2xl shadow-ambient overflow-hidden">
        <Chat
          variant="unboxed"
          className="h-full"
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmitMessage={handleSend}
          position={isFloating ? 'floating' : 'docked'}
          model={model}
          onModelChange={setModel}
          models={[
            { id: 'gemini-pro', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-exp', name: 'Gemini 3.8 Pro' },
          ]}
          suggestions={[
            'Review Marcus’s homework completion',
            'Compare session 3 and session 4 accuracy',
            'Draft next week’s target exercise plan',
          ]}
          suggestionsLabel="Suggested Follow-ups"
          header={
            <Chat.Header
              title="Marcus Chen • Session Review"
              subtitle="Dr. Sarah Jenkins • Speech & Language Pathology"
              actions={
                <Badge variant="soft" colorRole="secondary" size="sm">
                  Active Thread
                </Badge>
              }
            />
          }
        />
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

export const ChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const [viewState, setViewState] = React.useState<'ready' | 'loading' | 'empty'>('ready');

  const chartData = [
    { day: 'Mon', sessions: 28 },
    { day: 'Tue', sessions: 34 },
    { day: 'Wed', sessions: 31 },
    { day: 'Thu', sessions: 42 },
    { day: 'Fri', sessions: 38 },
  ];

  const chartConfig = {
    sessions: {
      label: 'Sessions',
      color: 'var(--color-primary)',
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <ToggleGroup
          type="single"
          size="sm"
          value={viewState}
          onValueChange={(val) => {
            if (val === 'ready' || val === 'loading' || val === 'empty') {
              setViewState(val);
            }
          }}
          aria-label="Chart card state"
        >
          <ToggleGroup.Item value="ready">Ready</ToggleGroup.Item>
          <ToggleGroup.Item value="loading">Loading</ToggleGroup.Item>
          <ToggleGroup.Item value="empty">Empty</ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <ChartCard
        title="Weekly Practice"
        titleBadge={
          <Badge variant="outline" colorRole="secondary" size="sm">
            5 days
          </Badge>
        }
        description="Completed speech drills per day"
        loading={viewState === 'loading'}
        isEmpty={viewState === 'empty'}
        emptyTitle="No sessions recorded"
        emptyDescription="Completed drills will show up here."
        contentClassName="h-64 w-full"
        trend={{ value: '+12%', positive: true, label: 'vs last week' }}
        footer="Updated today"
      >
        <ChartContainer
          role="img"
          aria-label="Weekly Practice"
          config={chartConfig}
          className="aspect-auto h-full w-full"
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-on-surface-variant"
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              fill="var(--color-sessions)"
              fillOpacity={0.18}
            />
          </AreaChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
};

export const AreaChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { month: 'Jan', intake: 186 },
    { month: 'Feb', intake: 305 },
    { month: 'Mar', intake: 237 },
    { month: 'Apr', intake: 273 },
    { month: 'May', intake: 309 },
    { month: 'Jun', intake: 414 },
  ];

  const chartConfig = {
    intake: {
      label: 'Patient Intake',
      color: 'var(--color-primary)',
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <AreaChartCard
        title="Monthly Patient Intake"
        description="Showing total intake admissions over the past 6 months"
        data={chartData}
        xAxisKey="month"
        series={[{ dataKey: 'intake', label: 'Intake' }]}
        config={chartConfig}
        trend={{ value: '+14.2%', positive: true, label: 'vs previous period' }}
        footer="Updated today at 09:00"
      />
    </div>
  );
};

export const BarChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { department: 'Speech', target: 80, actual: 95 },
    { department: 'Occupational', target: 70, actual: 85 },
    { department: 'Physical', target: 90, actual: 88 },
    { department: 'Psychology', target: 65, actual: 72 },
  ];

  const chartConfig = {
    target: {
      label: 'Target',
      color: 'var(--color-outline)',
    },
    actual: {
      label: 'Actual',
      color: 'var(--color-secondary)',
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <BarChartCard
        title="Department Throughput"
        description="Target versus actual session completions by therapy domain"
        data={chartData}
        xAxisKey="department"
        series={[
          { dataKey: 'target', label: 'Target' },
          { dataKey: 'actual', label: 'Actual' },
        ]}
        config={chartConfig}
        trend={{ value: '+8.4%', positive: true, label: 'above target' }}
        footer="Q2 performance review"
      />
    </div>
  );
};

export const LineChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { week: 'W1', current: 62, benchmark: 70 },
    { week: 'W2', current: 68, benchmark: 70 },
    { week: 'W3', current: 74, benchmark: 71 },
    { week: 'W4', current: 79, benchmark: 72 },
    { week: 'W5', current: 85, benchmark: 72 },
  ];

  const chartConfig = {
    current: {
      label: 'Current Progress',
      color: 'var(--color-primary)',
    },
    benchmark: {
      label: 'Clinical Target',
      color: 'var(--color-outline)',
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <LineChartCard
        title="Clinical Recovery Benchmark"
        description="Patient functional improvement tracked against benchmark target"
        data={chartData}
        xAxisKey="week"
        series={[
          { dataKey: 'current', label: 'Current Progress' },
          { dataKey: 'benchmark', label: 'Clinical Target', strokeDasharray: '4 4' },
        ]}
        config={chartConfig}
        trend={{ value: '+13 pts', positive: true, label: 'exceeding benchmark' }}
        footer="Evaluated over 5 weeks"
      />
    </div>
  );
};

export const PieChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { name: 'Urgent', value: 275, fill: 'var(--color-error)' },
    { name: 'Routine', value: 410, fill: 'var(--color-primary)' },
    { name: 'Follow-up', value: 190, fill: 'var(--color-secondary)' },
    { name: 'Discharged', value: 125, fill: 'var(--color-tertiary)' },
  ];

  const chartConfig = {
    Urgent: {
      label: 'Urgent',
      color: 'var(--color-error)',
    },
    Routine: {
      label: 'Routine',
      color: 'var(--color-primary)',
    },
    'Follow-up': {
      label: 'Follow-up',
      color: 'var(--color-secondary)',
    },
    Discharged: {
      label: 'Discharged',
      color: 'var(--color-tertiary)',
    },
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <PieChartCard
        title="Caseload Distribution"
        description="Active caseload broken down by clinical priority"
        data={chartData}
        config={chartConfig}
        centerLabel={{ label: 'Total Cases', value: 1000 }}
        footer={<span>Showing 1,000 active patient profiles</span>}
      />
    </div>
  );
};

export const RadialChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartConfig = {
    value: {
      label: 'Capacity',
      color: 'var(--color-warning)',
    },
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <RadialChartCard
        title="Ward Bed Capacity"
        description="Real-time occupancy vs safety threshold limit"
        value={84}
        total={100}
        unit="%"
        status="warning"
        statusLabel="84% Utilized"
        caption="of 100% capacity"
        config={chartConfig}
        footer={<span>Alert threshold set at 85% occupancy</span>}
      />
    </div>
  );
};

export const RadarChartCardDemo: React.FC<ComponentDemoProps> = () => {
  const chartData = [
    { pillar: 'Communication', baseline: 65, current: 85 },
    { pillar: 'Motor Skills', baseline: 50, current: 75 },
    { pillar: 'Independence', baseline: 70, current: 90 },
    { pillar: 'Cognition', baseline: 60, current: 80 },
    { pillar: 'Social Interaction', baseline: 55, current: 70 },
  ];

  const chartConfig = {
    baseline: {
      label: 'Baseline Assessment',
      color: 'var(--color-outline)',
    },
    current: {
      label: 'Current Follow-up',
      color: 'var(--color-secondary)',
    },
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <RadarChartCard
        title="Functional Independence Profile"
        description="Patient evaluation across 5 clinical core domains"
        data={chartData}
        angleKey="pillar"
        series={[
          { dataKey: 'baseline', label: 'Baseline', fillOpacity: 0.2 },
          { dataKey: 'current', label: 'Current', fillOpacity: 0.4 },
        ]}
        config={chartConfig}
        footer={<span>Evaluated over 12 weeks of therapy</span>}
      />
    </div>
  );
};

export const ListDetailBlockDemo: React.FC<ComponentDemoProps> = () => {
  const [selected, setSelected] = React.useState<string | null>('p-1');

  const demoItems: ListDetailItem[] = [
    {
      id: 'p-1',
      title: 'Liam O’Connor',
      subtitle: 'Speech Articulation • Age 7',
      meta: 'Drill 4',
      badge: 'Active',
      badgeColorRole: 'primary',
      icon: 'record_voice_over',
    },
    {
      id: 'p-2',
      title: 'Siobhan Kelly',
      subtitle: 'Phonology & Rhythm • Age 9',
      meta: 'Drill 2',
      badge: 'Review',
      badgeColorRole: 'warning',
      icon: 'spatial_audio',
    },
    {
      id: 'p-3',
      title: 'Ciaran Murphy',
      subtitle: 'Fluency Training • Age 12',
      meta: 'Complete',
      badge: 'Saved',
      badgeColorRole: 'success',
      icon: 'check_circle',
    },
    {
      id: 'p-4',
      title: 'Aoife Walsh',
      subtitle: 'Articulation & Lisps • Age 6',
      meta: 'Drill 1',
      badge: 'Active',
      badgeColorRole: 'primary',
      icon: 'record_voice_over',
    },
    {
      id: 'p-5',
      title: 'Conor Byrne',
      subtitle: 'R-Controlled Vowels • Age 10',
      meta: 'Evaluation',
      badge: 'Scheduled',
      badgeColorRole: 'neutral',
      icon: 'event',
    },
  ];

  const patientDetails: Record<
    string,
    {
      targets: string;
      progress: number;
      nextSession: string;
      clinician: string;
      notes: string;
      sessions: Array<{ date: string; duration: string; accuracy: string; status: string }>;
    }
  > = {
    'p-1': {
      targets: 'Focus on vocalic /r/ and s-blend pronunciation drills with real-time waveform feedback.',
      progress: 78,
      nextSession: 'Tomorrow, 10:00 AM',
      clinician: 'Dr. Sarah Adams',
      notes: 'Responds well to visual mouth shape cues. Focus on tongue tip elevation.',
      sessions: [
        { date: 'Yesterday, 2:30 PM', duration: '15 mins', accuracy: '92%', status: 'Completed' },
        { date: 'Nov 4, 11:00 AM', duration: '20 mins', accuracy: '86%', status: 'Completed' },
        { date: 'Nov 1, 3:15 PM', duration: '15 mins', accuracy: '78%', status: 'Completed' },
      ],
    },
    'p-2': {
      targets: 'Multisyllabic rhythm cadence and front vowel precision drills.',
      progress: 54,
      nextSession: 'Thursday, 2:00 PM',
      clinician: 'Dr. Sarah Adams',
      notes: 'Slight lateralization on final /s/ blends. Slow down pacing tempo.',
      sessions: [
        { date: 'Nov 6, 10:00 AM', duration: '15 mins', accuracy: '84%', status: 'Needs Review' },
        { date: 'Nov 3, 2:00 PM', duration: '15 mins', accuracy: '80%', status: 'Completed' },
      ],
    },
    'p-3': {
      targets: 'Gentle phonatory onset and controlled breath support exercises.',
      progress: 100,
      nextSession: 'Discharged / Maintenance',
      clinician: 'Dr. Michael Ryan',
      notes: 'Met all weekly fluency goals over 6 consecutive sessions.',
      sessions: [
        { date: 'Nov 5, 4:00 PM', duration: '20 mins', accuracy: '98%', status: 'Completed' },
        { date: 'Oct 29, 4:00 PM', duration: '20 mins', accuracy: '95%', status: 'Completed' },
      ],
    },
    'p-4': {
      targets: 'Interdental lisp correction for /s/ and /z/ in syllable-initial positions.',
      progress: 42,
      nextSession: 'Friday, 9:30 AM',
      clinician: 'Dr. Sarah Adams',
      notes: 'Enjoys picture flash cards. Use auditory discrimination audio models.',
      sessions: [
        { date: 'Nov 7, 9:30 AM', duration: '10 mins', accuracy: '74%', status: 'Completed' },
      ],
    },
    'p-5': {
      targets: 'Baseline acoustic evaluation for /ɑr/ (car) and /ɔr/ (door).',
      progress: 15,
      nextSession: 'Monday, 11:30 AM',
      clinician: 'Dr. Michael Ryan',
      notes: 'Initial clinical assessment and sound inventory scheduled.',
      sessions: [],
    },
  };

  return (
    <div className="w-full py-4">
      <ListDetailBlock
          items={demoItems}
          selectedId={selected}
          onSelectId={setSelected}
          title="Patients"
          searchPlaceholder="Search patients by name..."
          detailActions={
            <>
              <Button variant="outline" colorRole="neutral" size="icon" aria-label="Edit plan">
                <Icon name="edit" size="md" />
              </Button>
              <Button variant="soft" colorRole="primary" size="sm">
                <Icon name="calendar_today" size="sm" />
                Schedule
              </Button>
            </>
          }
          renderDetail={(item) => {
            const detail = patientDetails[item.id];
            if (!detail) return null;

            return (
              <Tabs.Root defaultValue="plan" variant="line">
                <Tabs.List>
                  <Tabs.Tab value="plan" icon="assignment">
                    Practice plan
                  </Tabs.Tab>
                  <Tabs.Tab value="history" icon="history">
                    Sessions ({detail.sessions.length})
                  </Tabs.Tab>
                </Tabs.List>

                {/* Plan Panel */}
                <Tabs.Panel value="plan" className="flex flex-col gap-4">
                  {/* Practice Target Summary */}
                  <div className="p-4 rounded-md bg-surface-container flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-heading text-sm font-semibold text-on-surface">
                        Practice target
                      </h4>
                      <span className="text-sm font-sans text-on-surface-variant">
                        Assigned by {detail.clinician}
                      </span>
                    </div>
                    <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                      {detail.targets}
                    </p>
                  </div>

                  {/* Weekly Goal Progress */}
                  <div className="py-3 border-y border-outline-variant/60 flex flex-col gap-2">
                    <Progress
                      value={detail.progress}
                      label="Weekly goal progress"
                      showValue
                      size="md"
                    />
                    <span className="text-sm font-sans text-on-surface-variant">
                      Target: 15 minutes daily practice with audio review
                    </span>
                  </div>

                  {/* Next Check-in */}
                  <div className="flex items-center justify-between gap-3 py-1 text-sm font-sans">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Icon name="event" size="sm" className="text-primary" />
                      <span>Next check-in</span>
                    </div>
                    <span className="font-medium text-on-surface">{detail.nextSession}</span>
                  </div>

                  {/* Clinician Observation */}
                  <ClinicianTip variant="unboxed" icon="lightbulb" label="Clinician note">
                    {detail.notes}
                  </ClinicianTip>
                </Tabs.Panel>

                {/* Session History Panel */}
                <Tabs.Panel value="history" className="flex flex-col gap-3">
                  {detail.sessions.length === 0 ? (
                    <Empty
                      variant="unboxed"
                      icon="history"
                      title="No sessions yet"
                      description="No previous session records found for this patient."
                    />
                  ) : (
                    <Item.Group divided>
                      {detail.sessions.map((sess) => (
                        <Item key={sess.date} variant="ghost" size="md">
                          <Item.Media variant="icon">
                            <Icon name="mic" size="sm" />
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{sess.date}</Item.Title>
                            <Item.Description>{sess.duration}</Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <span className="font-mono text-sm font-medium text-on-surface">
                              {sess.accuracy}
                            </span>
                            <Badge
                              variant="soft"
                              colorRole={sess.status === 'Completed' ? 'success' : 'warning'}
                              size="sm"
                            >
                              {sess.status}
                            </Badge>
                          </Item.Actions>
                        </Item>
                      ))}
                    </Item.Group>
                  )}
                </Tabs.Panel>
              </Tabs.Root>
            );
          }}
        />
    </div>
  );
};

export const SupportingPaneBlockDemo: React.FC<ComponentDemoProps> = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingSeconds, setRecordingSeconds] = React.useState(8);
  const [isPlayingExample, setIsPlayingExample] = React.useState(false);
  const [targetWord, setTargetWord] = React.useState('Rabbit');
  const [notes, setNotes] = React.useState('Patient is retracting tongue with good initial effort.');
  const playTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulated live recording timer
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  React.useEffect(() => {
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isRecording) {
      setRecordingSeconds(0);
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  const handlePlayExample = () => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }
    setIsPlayingExample(true);
    playTimerRef.current = setTimeout(() => {
      setIsPlayingExample(false);
      playTimerRef.current = null;
    }, 1800);
  };

  const addObservationTag = (tag: string) => {
    setNotes((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const formattedTime = `00:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}`;

  const targetWords = ['Rabbit', 'Road', 'River'];

  return (
    <div className="w-full rounded-lg border border-outline-variant overflow-hidden bg-surface flex flex-col min-h-136">
      <SupportingPaneBlock
          title="Pronunciation Practice"
          supportingTitle="Guidance"
          supportingBadge="Vocalic /r/"
          supportingBadgeColorRole="primary"
          className="flex-1"
          canvasToolbar={
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <Badge
                  variant={isRecording ? 'filled' : 'soft'}
                  colorRole={isRecording ? 'error' : 'neutral'}
                  size="sm"
                >
                  {isRecording ? 'Recording' : 'Ready'}
                </Badge>
                <span className="text-sm font-sans text-on-surface-variant hidden @sm:inline truncate">
                  Word: {targetWord}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Icon name="timer" size="xs" className="text-on-surface-variant" />
                <span className="text-sm font-mono tabular-nums text-on-surface font-medium">
                  {formattedTime}
                </span>
              </div>
            </div>
          }
          supportingContent={
            <div className="flex flex-col gap-4">
              <Tabs.Root defaultValue="guidance" variant="segmented" size="sm" className="w-full">
                <Tabs.List className="w-full">
                  <Tabs.Tab value="guidance" className="flex-1">
                    Cues
                  </Tabs.Tab>
                  <Tabs.Tab value="targets" className="flex-1">
                    Words
                  </Tabs.Tab>
                  <Tabs.Tab value="notes" className="flex-1">
                    Notes
                  </Tabs.Tab>
                </Tabs.List>

                {/* Tab 1: Clinical Guidance */}
                <Tabs.Panel value="guidance" className="pt-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-heading text-base font-semibold text-on-surface">
                      Tongue placement
                    </h4>
                    <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                      Ask the learner to pull the tongue blade back toward the roof of the mouth while bracing the sides against the upper back teeth.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/60">
                    <ClinicianTip variant="unboxed" icon="hearing" label="Listening cue">
                      Listen for a darker, resonant /r/ sound when the third formant drops below 2,000 Hz.
                    </ClinicianTip>
                  </div>
                </Tabs.Panel>

                {/* Tab 2: Word Selector */}
                <Tabs.Panel value="targets" className="pt-4 flex flex-col gap-3">
                  <span className="text-base font-sans text-on-surface-variant">
                    Choose a practice word:
                  </span>
                  <ToggleGroup
                    type="single"
                    size="sm"
                    ariaLabel="Target words"
                    value={targetWord}
                    onValueChange={(val) => {
                      if (val) setTargetWord(val);
                    }}
                  >
                    {targetWords.map((word) => (
                      <ToggleGroup.Item key={word} value={word}>
                        {word}
                      </ToggleGroup.Item>
                    ))}
                  </ToggleGroup>
                  <div className="p-3 rounded-md bg-surface border border-outline-variant text-base text-on-surface-variant leading-relaxed">
                    Selected prompt:{' '}
                    <span className="font-medium text-on-surface font-heading">
                      “Red {targetWord.toLowerCase()}s run rapidly”
                    </span>
                  </div>
                </Tabs.Panel>

                {/* Tab 3: Session Notes */}
                <Tabs.Panel value="notes" className="pt-4 flex flex-col gap-3">
                  <Field.Root>
                    <Field.Label>Session notes</Field.Label>
                    <Field.Control
                      render={
                        <Textarea
                          autoGrow
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Write quick observations during practice..."
                        />
                      }
                    />
                  </Field.Root>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-base font-sans text-on-surface-variant">
                      Quick tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        colorRole="neutral"
                        onClick={() => addObservationTag('Good tongue elevation')}
                      >
                        Good lift
                      </Chip>
                      <Chip
                        size="sm"
                        variant="soft"
                        colorRole="neutral"
                        onClick={() => addObservationTag('Clear acoustic onset')}
                      >
                        Clear onset
                      </Chip>
                      <Chip
                        size="sm"
                        variant="soft"
                        colorRole="neutral"
                        onClick={() => addObservationTag('Needs slower pacing')}
                      >
                        Slower pace
                      </Chip>
                    </div>
                  </div>
                </Tabs.Panel>
              </Tabs.Root>
            </div>
          }
        >
          {/* Main Primary Task Canvas */}
          <div className="flex flex-col gap-6 items-center justify-center p-4 @md:p-8 text-center my-auto min-h-80">
            {/* Target Phrase Callout */}
            <div className="w-full max-w-lg p-6 rounded-lg bg-surface-container flex flex-col gap-2">
              <span className="text-sm font-sans font-semibold text-primary">
                Practice sentence
              </span>
              <p className="font-heading text-headline-sm @md:text-headline-md font-semibold text-on-surface">
                “Red {targetWord.toLowerCase()}s run rapidly down the rocky road.”
              </p>
              <span className="text-sm font-sans text-on-surface-variant">
                Focus on smooth initial /r/ tongue retraction
              </span>
            </div>

            {/* Simulated Live Audio Waveform */}
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-lg bg-surface-container w-full max-w-xs"
            >
              {[12, 22, 34, 18, 28, 36, 24, 30, 16, 26].map((barHeight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-1.5 rounded-full transition-[height] duration-micro ease-standard motion-reduce:transition-none motion-reduce:animate-none',
                    isRecording
                      ? 'bg-primary animate-pulse'
                      : 'bg-outline/50 h-2'
                  )}
                  style={{
                    height: isRecording ? `${barHeight}px` : undefined,
                    animationDelay: `${(idx % 5) * 40}ms`,
                  }}
                />
              ))}
            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                colorRole="neutral"
                size="md"
                onClick={handlePlayExample}
                disabled={isRecording}
              >
                <Icon name="volume_up" size="sm" />
                <span>{isPlayingExample ? 'Playing example...' : 'Play example'}</span>
              </Button>

              <Button
                variant="filled"
                colorRole={isRecording ? 'error' : 'primary'}
                size="md"
                onClick={toggleRecording}
              >
                <Icon.Toggle
                  active={isRecording}
                  onName="stop"
                  offName="mic"
                  size="sm"
                />
                <span>{isRecording ? 'Stop recording' : 'Start recording'}</span>
              </Button>
            </div>

            {/* Live Audio Feedback Badge */}
            {isRecording ? (
              <Badge variant="soft" colorRole="error" size="md" dot>
                Listening...
              </Badge>
            ) : (
              <Badge variant="soft" colorRole="success" size="md" icon="verified">
                92% accuracy • Clear onset
              </Badge>
            )}
          </div>
        </SupportingPaneBlock>
    </div>
  );
};

export const AppShellDemo: React.FC<ComponentDemoProps> = () => {
  const [activeNav, setActiveNav] = React.useState('exercises');

  const destinations = [
    { id: 'exercises', label: 'Exercises', icon: 'assignment' },
    { id: 'notes', label: 'Notes', icon: 'description', badge: 3 },
    { id: 'progress', label: 'Progress', icon: 'trending_up' },
    { id: 'caseload', label: 'Patients', icon: 'groups' },
  ];
  const activeDestination = destinations.find((d) => d.id === activeNav) ?? destinations[0];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-outline-variant overflow-hidden h-120 flex flex-col relative bg-surface">
      <AppShell
        embedded
        title="Eolas Speech Portal"
        destinations={destinations}
        activeDestinationId={activeNav}
        onDestinationChange={setActiveNav}
        topBarActions={
          <Button variant="outline" colorRole="neutral" size="sm">
            <Icon name="add" size="sm" />
            <span>New</span>
          </Button>
        }
        sidebarHeader={
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <Icon name="record_voice_over" size="sm" />
            </div>
            <span className="font-heading font-bold text-sm text-on-surface group-data-[collapsible=icon]:hidden">
              Eolas Speech
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-headline-sm font-semibold text-on-surface">
            {activeDestination.label}
          </h2>
          <p className="font-sans text-base text-on-surface-variant leading-relaxed">
            Switch sections with the side rail on larger screens or the bottom bar on narrow screens.
          </p>
        </div>
      </AppShell>
    </div>
  );
};
