import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input, FormField } from '@/components/ui/input';
import { Textarea, TextareaField } from '@/components/ui/textarea';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '@/components/ui/field';
import { Fieldset, FieldsetLegend } from '@/components/ui/fieldset';
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
import { ComponentDemoProps } from '../types';

export const ButtonDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-8 w-full">
      {/* Primary Actions & Variants */}
      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Button Variants & Emphasis
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="filled" colorRole="primary">Filled Primary</Button>
          <Button variant="outlined" colorRole="primary">Outlined Primary</Button>
          <Button variant="text" colorRole="primary">Text Primary</Button>
          <Button variant="tonal" colorRole="primary">Tonal Primary</Button>
        </div>
      </div>

      {/* Color Roles Matrix */}
      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Color Roles (WCAG AA Contrast)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Button colorRole="primary" className="w-full">Primary</Button>
          <Button colorRole="secondary" className="w-full">Secondary</Button>
          <Button colorRole="tertiary" className="w-full">Tertiary</Button>
          <Button colorRole="error" className="w-full">Error</Button>
          <Button colorRole="warning" className="w-full">Warning</Button>
          <Button colorRole="success" className="w-full">Success</Button>
        </div>
      </div>

      {/* Size Floors & Touch Targets */}
      <div className="space-y-3">
        <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Touch Floors (WCAG 2.2 SC 2.5.8 Compliant)
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="sm" colorRole="primary">Small (44px min)</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="md" colorRole="primary">Medium (48px floor)</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="lg" colorRole="primary">Large (56px)</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" colorRole="primary" aria-label="Add item">
              <Icon name="add" size="sm" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InputDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('P-2024-819');
  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      <FormField
        label="Patient ID"
        description="Assigned patient identification number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        leadingIcon={<Icon name="badge" size="xs" />}
        clearable
        onClear={() => setVal('')}
      />
      <FormField
        label="Password"
        type="password"
        description="Must be at least 8 characters long"
        placeholder="Enter your account password"
        leadingIcon={<Icon name="lock" size="xs" />}
      />
      <FormField
        label="Session Duration"
        value="180 minutes"
        readOnly
        error="Duration exceeds recommended 45-minute limit"
        leadingIcon={<Icon name="timer" size="xs" />}
      />
    </div>
  );
};

export const TextareaDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <TextareaField
        label="Session Notes"
        description="Record practice notes and speech clarity observations"
        placeholder="Enter session notes..."
        rows={4}
      />
    </div>
  );
};

export const FieldDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <Field name="ward-code">
        <FieldLabel>Practice Group</FieldLabel>
          <Input placeholder="e.g. MORNING-GRP-A" />
        <FieldDescription>Group code assigned for scheduled practice sessions</FieldDescription>
      </Field>
    </div>
  );
};

export const FieldsetDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Fieldset className="space-y-3">
        <FieldsetLegend className="font-heading text-sm font-bold text-on-surface">
          Emergency Contact Details
        </FieldsetLegend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Full Name" />
          <Input placeholder="Relationship" />
          <Input placeholder="Phone Number" type="tel" className="sm:col-span-2" />
        </div>
      </Fieldset>
    </div>
  );
};

export const FormDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <Form className="space-y-4 w-full max-w-xl mx-auto">
      <div className="space-y-1">
        <h4 className="font-heading text-sm font-bold text-on-surface">Base UI Form Root</h4>
        <p className="font-sans text-xs text-on-surface-variant">Built on @base-ui/react/form with native validation context.</p>
      </div>
      <Input placeholder="Therapist Name" required />
      <Input placeholder="Email Address" type="email" required />
      <Button colorRole="primary" className="w-full">Save Consultation Notes</Button>
    </Form>
  );
};

export const SelectDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('r-sound');
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-1.5">
        <label className="font-label text-xs font-bold text-on-surface block">Practice Module</label>
        <Select.Root value={val} onValueChange={(v) => v && setVal(v)}>
          <Select.Trigger className="w-full">
            <Select.Value placeholder="Select practice module..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4}>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="r-sound">Vocalic /r/ Practice</Select.Item>
                  <Select.Item value="s-blend">S-Blend Syllables</Select.Item>
                  <Select.Item value="vowels">Vowel Prolongation</Select.Item>
                  <Select.Item value="consonants">Consonant Repetition</Select.Item>
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
    <div className="space-y-3 w-full max-w-md mx-auto">
      <label className="font-label text-xs font-bold text-on-surface block">Sound Library Search</label>
      <Combobox.Root items={['/r/ Vocalic Sounds', '/s/ Initial Blends', '/th/ Voiced Pairs', '/ch/ Affricates']}>
        <Combobox.InputGroup className="w-full">
          <Combobox.Input placeholder="Search target sounds..." />
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
    <div className="space-y-3 w-full max-w-md mx-auto">
      <label className="font-label text-xs font-bold text-on-surface block">Practice Exercise Search</label>
      <Autocomplete.Root openOnInputClick items={['Word Repetition', 'Picture Naming', 'Minimal Pairs', 'Sentence Reading']}>
        <Autocomplete.Input placeholder="Type exercise name..." className="w-full" />
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
    <div className="space-y-4 w-full max-w-md mx-auto">
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
    <div className="space-y-3 w-full max-w-md mx-auto">
      <h4 className="font-heading text-xs font-bold text-on-surface-variant">
        Priority Level
      </h4>
      <RadioGroup value={val} onValueChange={setVal} className="space-y-2.5">
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
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant">
        <div className="space-y-0.5">
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
    <div className="space-y-4 w-full max-w-md mx-auto text-center">
      <div className="space-y-1">
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
    <div className="space-y-6 w-full max-w-md mx-auto text-center">
      <div className="space-y-2">
        <div className="space-y-0.5">
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

      <div className="space-y-2">
        <div className="space-y-0.5">
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
    <div className="space-y-3 w-full max-w-md mx-auto">
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
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <NumberField
        label="Session Duration (minutes)"
        description="Recommended practice session: 10–30 minutes"
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
    <div className="w-full max-w-md mx-auto space-y-4">
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
    <div className="space-y-4 max-w-md mx-auto">
      <InlineAlert
        role="warning"
        title="Legacy Re-Export Barrel"
      >
        selection-controls.tsx re-exports Checkbox, Radio, and Switch. New code should import directly from @/components/ui/checkbox, @/components/ui/radio, or @/components/ui/switch.
      </InlineAlert>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2 text-xs font-mono">
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
    <div className="space-y-4 max-w-md mx-auto">
      <InlineAlert
        role="warning"
        title="Legacy Re-Export Barrel"
      >
        toggles.tsx re-exports Toggle and ToggleGroup. New code should import directly from @/components/ui/toggle or @/components/ui/toggle-group.
      </InlineAlert>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-2 text-xs font-mono">
        <p className="text-on-surface">Modern replacement imports:</p>
        <p className="text-primary font-bold">import &#123; Toggle &#125; from '@/components/ui/toggle';</p>
        <p className="text-primary font-bold">import &#123; ToggleGroup &#125; from '@/components/ui/toggle-group';</p>
      </div>
    </div>
  );
};
