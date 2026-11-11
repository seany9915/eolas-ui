import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupButton, InputGroupText } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldContent,
  FieldSeparator,
} from '@/components/ui/field';
import { Fieldset, FieldsetLegend, FieldsetDescription } from '@/components/ui/fieldset';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { NumberField } from '@/components/ui/number-field';
import { OTPField } from '@/components/ui/otp-field';
import { Icon } from '@/components/ui/icon';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Calendar, DateRange } from '@/components/ui/calendar';
import { BlockDemoShell } from '../BlockDemoShell';
import { StateMatrix } from '../StateMatrix';
import { ComponentDemoProps } from '../types';

export const ButtonDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <BlockDemoShell
      name="Button"
      badge="Base UI Atom"
      description="Interactive trigger for actions, submissions, modal reveals, and workflow progression. Standardized with 48px touch floors, Atkinson Hyperlegible Next typography, and floating 2px focus rings."
      whenToUse="Executing actions within the current screen (saving records, opening modals, initiating drills). Never use for page-level navigation — use NavigationMenu or semantic links."
      typicalExample={
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="filled" colorRole="primary">
            <Icon name="check_circle" size="xs" />
            <span>Save Consultation Notes</span>
          </Button>
          <Button variant="outline" colorRole="neutral">
            Cancel
          </Button>
          <Button variant="tonal" colorRole="secondary">
            <Icon name="ios_share" size="xs" />
            <span>Export Summary</span>
          </Button>
        </div>
      }
      variantsSection={
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="filled" colorRole="primary">Filled (High Emphasis)</Button>
          <Button variant="outlined" colorRole="primary">Outlined (Secondary)</Button>
          <Button variant="tonal" colorRole="primary">Tonal (Medium)</Button>
          <Button variant="soft" colorRole="primary">Soft Wash</Button>
          <Button variant="text" colorRole="primary">Text (Low Emphasis)</Button>
        </div>
      }
      sizeLadderSection={
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <Button size="sm" colorRole="primary">Small (44px min)</Button>
            <span className="font-mono text-[10px] text-on-surface-variant">sm: 44px</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button size="md" colorRole="primary">Medium (48px floor)</Button>
            <span className="font-mono text-[10px] text-on-surface-variant">md: 48px</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button size="lg" colorRole="primary">Large (56px)</Button>
            <span className="font-mono text-[10px] text-on-surface-variant">lg: 56px</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button size="icon" colorRole="primary" aria-label="Search records">
              <Icon name="search" size="sm" />
            </Button>
            <span className="font-mono text-[10px] text-on-surface-variant">icon: 48px</span>
          </div>
        </div>
      }
      iconPermutationsSection={
        <div className="flex flex-wrap items-center gap-3">
          <Button colorRole="primary">
            <Icon name="add" size="xs" />
            <span>Leading Icon</span>
          </Button>
          <Button variant="outline" colorRole="neutral">
            <span>Trailing Icon</span>
            <Icon name="arrow_forward" size="xs" />
          </Button>
          <Button size="icon" variant="tonal" colorRole="primary" aria-label="Record Audio">
            <Icon name="mic" size="sm" />
          </Button>
        </div>
      }
      pinnedStatesSection={
        <StateMatrix
          items={[
            {
              label: 'Default',
              element: <Button colorRole="primary">Default</Button>,
            },
            {
              label: 'Hover',
              element: <Button colorRole="primary" data-preview="hover">Hover</Button>,
              note: 'data-preview="hover"',
            },
            {
              label: 'Focus',
              element: <Button colorRole="primary" data-preview="focus">Focused</Button>,
              note: 'data-preview="focus"',
            },
            {
              label: 'Active',
              element: <Button colorRole="primary" data-preview="active">Active</Button>,
              note: 'data-preview="active"',
            },
            {
              label: 'Disabled',
              element: <Button colorRole="primary" disabled>Disabled</Button>,
              note: 'disabled',
            },
          ]}
        />
      }
      edgeCasesSection={
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-xs font-bold text-on-surface">Label Truncation with Maximum Width</span>
            <p className="font-sans text-xs text-on-surface-variant">Button labels with max-w-[220px] truncate gracefully without line breaks</p>
            <div className="pt-1">
              <Button colorRole="primary" className="max-w-[220px] truncate">
                Very Long Clinical Action Label That Truncates Safely
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-2 border-t border-outline-variant/40">
            <span className="font-heading text-xs font-bold text-on-surface">Full-Width Responsive Button</span>
            <p className="font-sans text-xs text-on-surface-variant">Stretches to container bounds for mobile action sheets or primary form submits</p>
            <div className="pt-1 w-full max-w-sm">
              <Button colorRole="primary" className="w-full">
                Full Width Action
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export const InputDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('P-2024-819');
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <Field>
        <FieldLabel>Patient ID</FieldLabel>
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          leadingIcon={<Icon name="badge" size="xs" />}
          clearable
          onClear={() => setVal('')}
        />
        <FieldDescription>Assigned patient identification number</FieldDescription>
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          placeholder="Enter your account password"
          leadingIcon={<Icon name="lock" size="xs" />}
        />
        <FieldDescription>Must be at least 8 characters long</FieldDescription>
      </Field>

      <Field invalid>
        <FieldLabel>Session Duration</FieldLabel>
        <Input
          value="180 minutes"
          readOnly
          error="Duration exceeds recommended 45-minute limit"
          leadingIcon={<Icon name="timer" size="xs" />}
        />
        <FieldError>Duration exceeds recommended 45-minute limit</FieldError>
      </Field>
    </div>
  );
};

export const TextareaDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
      <Field>
        <FieldLabel>Session Notes</FieldLabel>
        <Textarea
          placeholder="Enter session notes..."
          rows={4}
          autoGrow
        />
        <FieldDescription>Record practice notes and speech clarity observations</FieldDescription>
      </Field>
    </div>
  );
};

export const FieldDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <FieldGroup>
        <Field name="ward-code">
          <FieldLabel>Practice Group</FieldLabel>
          <Input placeholder="e.g. MORNING-GRP-A" />
          <FieldDescription>Group code assigned for scheduled practice sessions</FieldDescription>
        </Field>

        <FieldSeparator />

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Emergency Alerts</FieldLabel>
            <FieldDescription>Receive instant push notifications for urgent triage updates</FieldDescription>
          </FieldContent>
          <Switch defaultChecked aria-label="Toggle emergency alerts" />
        </Field>
      </FieldGroup>
    </div>
  );
};

export const FieldsetDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Fieldset variant="card">
        <FieldsetLegend>Emergency Contact Details</FieldsetLegend>
        <FieldsetDescription>Designated individuals authorized to receive clinical updates</FieldsetDescription>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <Input placeholder="Enter contact full name" />
          </Field>
          <Field>
            <FieldLabel>Relationship</FieldLabel>
            <Input placeholder="e.g. Parent, Guardian" />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel>Phone Number</FieldLabel>
            <Input placeholder="e.g. +353 87 123 4567" type="tel" />
          </Field>
        </FieldGroup>
      </Fieldset>
    </div>
  );
};

export const FormDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <Form className="flex flex-col gap-4 w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-1">
        <h4 className="font-heading text-sm font-bold text-on-surface">Base UI Form Root</h4>
        <p className="font-sans text-xs text-on-surface-variant">Built on @base-ui/react/form with native validation context.</p>
      </div>
      <FieldGroup className="flex flex-col gap-3">
        <Field>
          <FieldLabel>Therapist Name</FieldLabel>
          <Input placeholder="e.g. Dr. Sarah Jenkins" required />
        </Field>
        <Field>
          <FieldLabel>Email Address</FieldLabel>
          <Input placeholder="sarah.jenkins@eolas.health" type="email" required />
        </Field>
      </FieldGroup>
      <Button colorRole="primary" className="w-full">Save Consultation Notes</Button>
    </Form>
  );
};

export const SelectDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('r-sound');
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-1.5">
        <label className="font-label text-xs font-bold text-on-surface block">Practice Module</label>
        <Select.Root value={val} onValueChange={(v) => v && setVal(v)}>
          <Select.Trigger className="w-full">
            <Select.Value placeholder="Select practice module..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4}>
              <Select.Popup>
                <Select.List>
                  <Select.Group>
                    <Select.GroupLabel className="px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Target Sound Modules
                    </Select.GroupLabel>
                    <Select.Item value="r-sound">Vocalic /r/ Practice</Select.Item>
                    <Select.Item value="s-blend">S-Blend Syllables</Select.Item>
                    <Select.Item value="vowels">Vowel Prolongation</Select.Item>
                    <Select.Item value="consonants">Consonant Repetition</Select.Item>
                  </Select.Group>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      <p className="font-mono text-xs text-on-surface-variant">Selected module: {val}</p>
    </div>
  );
};

export const ComboboxDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <label htmlFor="sound-library-search" className="font-label text-xs font-bold text-on-surface block">Sound Library Search</label>
      <Combobox.Root items={['/r/ Vocalic Sounds', '/s/ Initial Blends', '/th/ Voiced Pairs', '/ch/ Affricates']}>
        <Combobox.InputGroup className="w-full">
          <Combobox.Input id="sound-library-search" placeholder="Search target sounds..." />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Empty>No matching sounds found</Combobox.Empty>
              <Combobox.List>
                {(item: string) => <Combobox.Item key={item} value={item}>{item}</Combobox.Item>}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};

export const AutocompleteDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <label htmlFor="practice-exercise-search" className="font-label text-xs font-bold text-on-surface block">Practice Exercise Search</label>
      <Autocomplete.Root openOnInputClick items={['Word Repetition', 'Picture Naming', 'Minimal Pairs', 'Sentence Reading']}>
        <Autocomplete.Input id="practice-exercise-search" placeholder="Type exercise name..." className="w-full" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={4}>
            <Autocomplete.Popup>
              <Autocomplete.Empty>No matching suggestions found</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: string) => <Autocomplete.Item key={item} value={item}>{item}</Autocomplete.Item>}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </div>
  );
};

export const CheckboxDemo: React.FC<ComponentDemoProps> = () => {
  const [checked, setChecked] = React.useState(true);
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} onCheckedChange={setChecked} id="allergy-check" />
        <label htmlFor="allergy-check" className="font-label text-sm font-medium text-on-surface cursor-pointer select-none">
          Practice notifications enabled
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox checked={false} id="fasting-check" />
        <label htmlFor="fasting-check" className="font-label text-sm font-medium text-on-surface cursor-pointer select-none">
          Audio recording permission granted
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox checked="indeterminate" id="consent-check" />
        <label htmlFor="consent-check" className="font-label text-sm font-medium text-on-surface cursor-pointer select-none">
          Include weekly summary reports
        </label>
      </div>
    </div>
  );
};

export const CheckboxGroupDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState<string[]>(['daily']);

  const protocolOptions = [
    {
      value: 'daily',
      label: 'Daily Practice Reminder',
      description: 'Morning prompt to begin daily word drills',
    },
    {
      value: 'weekly',
      label: 'Weekly Progress Summary',
      description: 'Email summary of session scores and milestones',
    },
    {
      value: 'milestones',
      label: 'Streak Milestone Alerts',
      description: 'Notification when a 5-day practice streak is reached',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <CheckboxGroup
        label="Practice Reminders"
        description="Choose which reminders to send before practice sessions"
        value={val}
        onValueChange={setVal}
        options={protocolOptions}
      />
    </div>
  );
};

export const RadioDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('high');
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <h4 className="font-heading text-xs font-bold text-on-surface-variant">
        Priority Level
      </h4>
      <RadioGroup value={val} onValueChange={setVal} className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <Radio value="high" id="high-opt" />
          <label htmlFor="high-opt" className="font-label text-xs font-medium text-error cursor-pointer">
            High - Immediate review
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Radio value="medium" id="medium-opt" />
          <label htmlFor="medium-opt" className="font-label text-xs font-medium text-warning cursor-pointer">
            Medium - Within 24 hours
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Radio value="standard" id="standard-opt" />
          <label htmlFor="standard-opt" className="font-label text-xs font-medium text-on-surface cursor-pointer">
            Standard - Routine review
          </label>
        </div>
      </RadioGroup>
    </div>
  );
};

export const SwitchDemo: React.FC<ComponentDemoProps> = () => {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant">
        <div className="flex flex-col gap-0.5">
          <span className="font-label text-sm font-bold text-on-surface block">Audio Feedback</span>
          <span className="font-sans text-xs text-on-surface-variant">Play audio cues during pronunciation drills</span>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle audio feedback" />
      </div>
    </div>
  );
};

export const ToggleDemo: React.FC<ComponentDemoProps> = () => {
  const [isPinned, setIsPinned] = React.useState(true);
  const [isStarred, setIsStarred] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto text-center">
      <div className="flex flex-col gap-1">
        <h4 className="font-heading text-sm font-semibold text-on-surface">Action Controls</h4>
        <p className="font-sans text-xs text-on-surface-variant">Standalone two-state actions using aria-pressed</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <Toggle pressed={isPinned} onPressedChange={setIsPinned} variant="default" size="md">
          <Icon name="bookmark" size="sm" />
          <span>Pin to Top</span>
        </Toggle>
        <Toggle
          pressed={isStarred}
          onPressedChange={setIsStarred}
          variant="outline"
          size="md"
          aria-label="Flag for review"
        >
          <Icon name="flag" size="sm" />
        </Toggle>
        <Toggle pressed={isMuted} onPressedChange={setIsMuted} variant="subtle" size="md">
          <Icon name={isMuted ? 'volume_off' : 'volume_up'} size="sm" />
          <span>{isMuted ? 'Alerts Muted' : 'Mute Alerts'}</span>
        </Toggle>
      </div>
    </div>
  );
};

export const ToggleGroupDemo: React.FC<ComponentDemoProps> = () => {
  const [viewMode, setViewMode] = React.useState('grid');
  const [activeFilters, setActiveFilters] = React.useState<string[]>(['words']);

  const filterItems = [
    { value: 'words', label: 'Word Drills', icon: 'record_voice_over' },
    { value: 'phrases', label: 'Phrases', icon: 'forum' },
    { value: 'sentences', label: 'Sentences', icon: 'menu_book' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto text-center">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-label text-sm font-semibold text-on-surface block">View Mode</span>
          <span className="font-sans text-xs text-on-surface-variant block">Single-select segmented switch</span>
        </div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v)}
          aria-label="Layout view mode"
          variant="segmented"
          className="inline-flex justify-center"
        >
          <ToggleGroup.Item value="grid" icon="grid_view">
            Grid View
          </ToggleGroup.Item>
          <ToggleGroup.Item value="list" icon="view_list">
            List View
          </ToggleGroup.Item>
          <ToggleGroup.Item value="summary" icon="table_chart">
            Summary
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-label text-sm font-semibold text-on-surface block">Exercise Type Filters</span>
          <span className="font-sans text-xs text-on-surface-variant block">Multi-select filter tags</span>
        </div>
        <ToggleGroup
          type="multiple"
          value={activeFilters}
          onValueChange={setActiveFilters}
          aria-label="Filter exercise types"
          items={filterItems}
          variant="outline"
          className="inline-flex justify-center"
        />
      </div>
    </div>
  );
};

export const SliderDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(20);
  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <label className="font-label text-xs font-bold text-on-surface">Daily Practice Goal</label>
        <span className="font-mono text-xs font-bold text-primary">{Math.round(val)} minutes</span>
      </div>
      <Slider value={val} onValueChange={setVal} min={5} max={60} step={5} />
    </div>
  );
};

export const NumberFieldDemo: React.FC<ComponentDemoProps> = () => {
  const [sessionMinutes, setSessionMinutes] = React.useState<number | null>(20);
  const [targetWpm, setTargetWpm] = React.useState<number | null>(110);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <NumberField
        label="Session Duration (minutes)"
        description="Recommended practice session: 10ΓÇô30 minutes"
        value={sessionMinutes}
        onValueChange={setSessionMinutes}
        min={5}
        max={60}
        step={5}
      />
      <NumberField
        label="Target Speech Rate (words/min)"
        description="Pacing target for conversational reading drills"
        value={targetWpm}
        onValueChange={setTargetWpm}
        min={60}
        max={180}
        step={5}
        smallStep={1}
      />
    </div>
  );
};

export const OTPFieldDemo: React.FC<ComponentDemoProps> = () => {
  const [otp, setOtp] = React.useState('');
  const [completedCode, setCompletedCode] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <OTPField
        center
        showSeparator
        length={6}
        value={otp}
        onValueChange={setOtp}
        onComplete={(code) => setCompletedCode(code)}
        label="Security PIN"
        description="Enter the 6-digit code sent to your phone"
      />
      {completedCode && (
        <div className="p-3 rounded-lg bg-success-container text-on-success-container font-sans text-xs font-medium flex items-center justify-center gap-2">
          <Icon name="check_circle" size="sm" className="text-success shrink-0" />
          <span>Security PIN verified</span>
        </div>
      )}
    </div>
  );
};

export const SelectionControlsLegacyDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <InlineAlert
        role="warning"
        title="Legacy Re-Export Barrel"
      >
        selection-controls.tsx re-exports Checkbox, Radio, and Switch. New code should import directly from @/components/ui/checkbox, @/components/ui/radio, or @/components/ui/switch.
      </InlineAlert>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-2 text-xs font-mono">
        <p className="text-on-surface">Modern replacement imports:</p>
        <p className="text-primary font-bold">import &#123; Checkbox &#125; from '@/components/ui/checkbox';</p>
        <p className="text-primary font-bold">import &#123; Radio, RadioGroup &#125; from '@/components/ui/radio';</p>
        <p className="text-primary font-bold">import &#123; Switch &#125; from '@/components/ui/switch';</p>
      </div>
    </div>
  );
};

export const TogglesLegacyDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <InlineAlert
        role="warning"
        title="Legacy Re-Export Barrel"
      >
        toggles.tsx re-exports Toggle and ToggleGroup. New code should import directly from @/components/ui/toggle or @/components/ui/toggle-group.
      </InlineAlert>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-2 text-xs font-mono">
        <p className="text-on-surface">Modern replacement imports:</p>
        <p className="text-primary font-bold">import &#123; Toggle &#125; from '@/components/ui/toggle';</p>
        <p className="text-primary font-bold">import &#123; ToggleGroup &#125; from '@/components/ui/toggle-group';</p>
      </div>
    </div>
  );
};

export const CalendarDemo: React.FC<ComponentDemoProps> = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  const [mode, setMode] = React.useState<'single' | 'range'>('single');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <BlockDemoShell
      name="Calendar"
      badge="Tier 2 Field Primitive"
      description="Accessible date and range selection calendar powered by React DayPicker. Features high-contrast clinical tokens, distinct neutral today indicators, and floating focus rings."
      whenToUse="Scheduling clinician consultations, selecting speech session date ranges, or reviewing patient milestones. Commonly paired with Popover to build a full DatePicker."
      typicalExample={
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <div className="flex items-center justify-between w-full pb-2 border-b border-outline-variant/60">
            <span className="font-heading text-xs font-bold text-on-surface">Selection Mode</span>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val) => {
                if (val) setMode(val as 'single' | 'range');
              }}
              variant="segmented"
              size="sm"
            >
              <ToggleGroup.Item value="single">Single Date</ToggleGroup.Item>
              <ToggleGroup.Item value="range">Date Range</ToggleGroup.Item>
            </ToggleGroup>
          </div>

          <div className="w-full flex justify-center">
            {mode === 'single' ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg shadow-ambient"
              />
            ) : (
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="rounded-lg shadow-ambient"
              />
            )}
          </div>

          <div className="pt-2 border-t border-outline-variant/60 w-full text-center">
            <p className="font-sans text-xs text-on-surface-variant">
              {mode === 'single' ? (
                selectedDate ? (
                  <span>
                    Selected consultation date:{' '}
                    <strong className="text-on-surface font-semibold">{formatDate(selectedDate)}</strong>
                  </span>
                ) : (
                  <span>Please select a date on the calendar.</span>
                )
              ) : dateRange?.from ? (
                dateRange.to ? (
                  <span>
                    Selected range:{' '}
                    <strong className="text-on-surface font-semibold">{formatDate(dateRange.from)}</strong> to{' '}
                    <strong className="text-on-surface font-semibold">{formatDate(dateRange.to)}</strong>
                  </span>
                ) : (
                  <span>
                    Selected start:{' '}
                    <strong className="text-on-surface font-semibold">{formatDate(dateRange.from)}</strong> (choose end date)
                  </span>
                )
              ) : (
                <span>Please select a start and end date.</span>
              )}
            </p>
          </div>
        </div>
      }
      variantsSection={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Single Date Selection */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">Single Date Selection</span>
            <Calendar
              mode="single"
              selected={new Date(2026, 10, 12)}
              defaultMonth={new Date(2026, 10)}
              className="rounded-lg shadow-ambient"
            />
          </div>

          {/* Date Range Selection */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">Date Range Selection</span>
            <Calendar
              mode="range"
              selected={{
                from: new Date(2026, 10, 9),
                to: new Date(2026, 10, 14),
              }}
              defaultMonth={new Date(2026, 10)}
              className="rounded-lg shadow-ambient"
            />
          </div>
        </div>
      }
      sizeLadderSection={
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-xs font-bold text-on-surface">Multi-Month Range Planning (2 Months)</span>
            <span className="font-sans text-xs text-on-surface-variant">Recommended for scheduling multi-week therapy treatment plans</span>
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={new Date(2026, 10)}
            selected={{
              from: new Date(2026, 10, 20),
              to: new Date(2026, 11, 4),
            }}
            className="rounded-lg shadow-ambient"
          />
        </div>
      }
      iconPermutationsSection={
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="font-heading text-xs font-bold text-on-surface">Month & Year Fast Dropdowns</span>
            <span className="font-sans text-xs text-on-surface-variant">captionLayout="dropdown" for historical charts</span>
          </div>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
            defaultMonth={new Date(2026, 10)}
            className="rounded-lg shadow-ambient"
          />
        </div>
      }
      pinnedStatesSection={
        <div className="flex flex-col gap-3 w-full max-w-md">
          <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container/40 text-xs">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-md bg-surface text-on-surface font-bold relative inline-flex items-center justify-center font-sans border border-outline-variant/60 after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-primary">
                3
              </span>
              <div className="flex flex-col">
                <strong className="text-on-surface font-semibold">Today Indicator (Unselected)</strong>
                <span className="text-on-surface-variant text-[11px]">Bold text + centered blue accent dot below (no blue font, zero selection clash)</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-outline">today</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container/40 text-xs">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-md bg-primary text-on-primary font-semibold inline-flex items-center justify-center font-sans">
                10
              </span>
              <div className="flex flex-col">
                <strong className="text-on-surface font-semibold">Active Selection</strong>
                <span className="text-on-surface-variant text-[11px]">Solid primary fill with hover brightness retention</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-outline">selected</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container/40 text-xs">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-md text-on-surface-variant/30 font-normal inline-flex items-center justify-center font-sans">
                28
              </span>
              <div className="flex flex-col">
                <strong className="text-on-surface font-semibold">Disabled / Outside Days</strong>
                <span className="text-on-surface-variant text-[11px]">Reduced opacity, pointer-events-none, unclickable</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-outline">disabled / outside</span>
          </div>
        </div>
      }
      edgeCasesSection={
        <div className="flex flex-col gap-6 w-full max-w-md">
          {/* Edge Case 1: Today Selected */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">
              1. Today when Selected (Zero Ring Clash)
            </span>
            <span className="font-sans text-xs text-on-surface-variant text-center">
              When today is selected, solid primary overrides the neutral outline border cleanly.
            </span>
            <Calendar
              mode="single"
              selected={new Date()}
              defaultMonth={new Date()}
              className="rounded-lg shadow-ambient"
            />
          </div>

          {/* Edge Case 2: Past Date Disablement */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-heading text-xs font-bold text-on-surface">
              2. Appointment Booking (Past Dates Disabled)
            </span>
            <span className="font-sans text-xs text-on-surface-variant text-center">
              Dates before today are disabled with pointer-events-none and low contrast.
            </span>
            <Calendar
              mode="single"
              disabled={{ before: new Date() }}
              defaultMonth={new Date()}
              className="rounded-lg shadow-ambient"
            />
          </div>
        </div>
      }
    />
  );
};


export const ButtonGroupDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-xl mx-auto py-4">
      {/* 1. Split Button Action */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Split Action Button
        </h4>
        <p className="font-sans text-xs text-on-surface-variant">
          Fused primary action with secondary dropdown trigger and zero double-border artifacts
        </p>
        <ButtonGroup>
          <Button variant="filled" colorRole="primary" size="md">
            Save Consultation Notes
          </Button>
          <Button variant="filled" colorRole="primary" size="md" aria-label="More save options">
            <Icon name="expand_more" size="xs" />
          </Button>
        </ButtonGroup>
      </div>

      {/* 2. Navigation & Segmented Control with Separator */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Segmented Navigation with Hairline Separator
        </h4>
        <ButtonGroup>
          <Button variant="outlined" colorRole="neutral" size="sm">
            <Icon name="chevron_left" size="xs" />
            <span>Previous</span>
          </Button>
          <Button variant="outlined" colorRole="neutral" size="sm">
            <span>Today</span>
          </Button>
          <ButtonGroup.Separator />
          <Button variant="outlined" colorRole="neutral" size="sm">
            <span>Next</span>
            <Icon name="chevron_right" size="xs" />
          </Button>
        </ButtonGroup>
      </div>

      {/* 3. Fused Input and Action Button */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Input Addon &amp; Action
        </h4>
        <ButtonGroup className="w-full max-w-md">
          <ButtonGroup.Text>https://</ButtonGroup.Text>
          <Input placeholder="clinic.example.com" className="flex-1" />
          <Button variant="filled" colorRole="primary" size="md">
            Connect
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export const InputGroupDemo: React.FC<ComponentDemoProps> = () => {
  const [search, setSearch] = React.useState('');
  const [prompt, setPrompt] = React.useState('');

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl mx-auto py-4 text-left">
      {/* 1. Search Bar with Prefix Icon and Clear Button */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Search Input with Addons
        </h4>
        <p className="font-sans text-xs text-on-surface-variant">
          Inline prefix icon and trailing clear trigger with zero double-border artifacts
        </p>
        <InputGroup className="max-w-md">
          <InputGroupAddon align="inline-start">
            <Icon name="search" size="sm" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients or clinical notes..."
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                aria-label="Clear search input"
                onClick={() => setSearch('')}
              >
                <Icon name="close" size="xs" aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {/* 2. URL Prefix Input with Action Button */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Prefix Text and Trailing Action
        </h4>
        <InputGroup className="max-w-md">
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="clinic.eolas.health" defaultValue="telehealth.eolas.health" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" variant="ghost" aria-label="Copy portal link">
              <Icon name="content_copy" size="xs" aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* 3. Multi-line AI Chat Prompt Input (shadcn Pattern) */}
      <div className="flex flex-col gap-2">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Multi-line AI Prompt Composer
        </h4>
        <p className="font-sans text-xs text-on-surface-variant">
          Input group containing auto-growing textarea and a bottom action bar with attachment and submit triggers
        </p>
        <InputGroup className="max-w-md">
          <InputGroupTextarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the clinical AI assistant..."
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-sm" variant="outline" aria-label="Attach clinical documents">
              <Icon name="attach_file" size="xs" aria-hidden="true" />
            </InputGroupButton>
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="filled"
              colorRole="primary"
              disabled={!prompt.trim()}
              className="ml-auto"
              aria-label="Send message"
            >
              <Icon name="arrow_upward" size="xs" aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};
