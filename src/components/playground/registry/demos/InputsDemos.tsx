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
            <Button size="icon" colorRole="primary" aria-label="Add prescription">
              <Icon name="add" size="sm" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InputDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('NHS-992-019-281');
  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      <FormField
        label="Clinical Patient ID"
        description="Assigned 10-digit National Health Service patient identifier"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        leadingIcon={<Icon name="badge" size="xs" />}
        clearable
        onClear={() => setVal('')}
      />
      <FormField
        label="Required Clinician Password"
        type="password"
        description="Single-ring floating 2px focus indicator"
        placeholder="Enter hospital SSO password"
        leadingIcon={<Icon name="lock" size="xs" />}
      />
      <FormField
        label="Invalid Prescription Dosage"
        value="999 mg/kg (Critical Overdose)"
        readOnly
        error="Dosage exceeds max safe threshold (50 mg/kg)"
        leadingIcon={<Icon name="medication" size="xs" />}
      />
    </div>
  );
};

export const TextareaDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <TextareaField
        label="Clinical Observation Notes"
        description="Document subjective and objective findings during patient consultation"
        placeholder="Enter consultation summary notes..."
        rows={4}
      />
    </div>
  );
};

export const FieldDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-4 w-full max-w-xl mx-auto">
      <Field name="ward-code">
        <FieldLabel>Ward Classification</FieldLabel>
          <Input placeholder="e.g. ICU-NORTH-04" />
        <FieldDescription>Base UI Field wrapper providing accessible labeling and aria descriptions</FieldDescription>
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
      <Input placeholder="Consultant Name" required />
      <Input placeholder="Hospital Email" type="email" required />
      <Button colorRole="primary" className="w-full">Submit Consultation Record</Button>
    </Form>
  );
};

export const SelectDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('icu');
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-1.5">
        <label className="font-label text-xs font-bold text-on-surface block">Department Assignment</label>
        <Select.Root value={val} onValueChange={(v) => v && setVal(v)}>
          <Select.Trigger className="w-full">
            <Select.Value placeholder="Select clinical ward..." />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4}>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="icu">Intensive Care Unit (ICU)</Select.Item>
                  <Select.Item value="peds">Paediatrics Ward</Select.Item>
                  <Select.Item value="cardio">Cardiology Care</Select.Item>
                  <Select.Item value="er">Emergency Trauma</Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      <p className="font-mono text-xs text-on-surface-variant">Selected ward value: {val}</p>
    </div>
  );
};

export const ComboboxDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <label className="font-label text-xs font-bold text-on-surface block">ICD-10 Diagnostic Code Search</label>
      <Combobox.Root items={['I10 Essential Hypertension', 'E11 Type 2 Diabetes Mellitus', 'J45 Asthma', 'R05 Cough']}>
        <Combobox.InputGroup className="w-full">
          <Combobox.Input placeholder="Search diagnostic terminology..." />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.Empty>No clinical matches found</Combobox.Empty>
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
      <label className="font-label text-xs font-bold text-on-surface block">Medication Dosage Autocomplete</label>
      <Autocomplete.Root items={['Amoxicillin 500mg', 'Paracetamol 1000mg', 'Ibuprofen 400mg', 'Metformin 500mg']}>
        <Autocomplete.Input placeholder="Type medication name..." className="w-full" />
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
          Patient has confirmed medication allergies
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox checked={false} id="fasting-check" />
        <label htmlFor="fasting-check" className="font-label text-sm font-medium text-on-surface cursor-pointer select-none">
          Patient has been fasting for 12 hours
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox checked="indeterminate" id="consent-check" />
        <label htmlFor="consent-check" className="font-label text-sm font-medium text-on-surface cursor-pointer select-none">
          Partial surgical consent acquired (Indeterminate)
        </label>
      </div>
    </div>
  );
};

export const CheckboxGroupDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState<string[]>(['monitoring']);
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
        Clinical Protocol Group
      </h4>
      <CheckboxGroup value={val} onValueChange={setVal} className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox value="monitoring" id="opt-1" />
          <label htmlFor="opt-1" className="font-label text-xs text-on-surface cursor-pointer">Continuous SpO2 Monitoring</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox value="ecg" id="opt-2" />
          <label htmlFor="opt-2" className="font-label text-xs text-on-surface cursor-pointer">12-Lead ECG Tracking</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox value="temp" id="opt-3" />
          <label htmlFor="opt-3" className="font-label text-xs text-on-surface cursor-pointer">Hourly Temperature Logging</label>
        </div>
      </CheckboxGroup>
    </div>
  );
};

export const RadioDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState('stat');
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
        Triage Priority Level
      </h4>
      <RadioGroup value={val} onValueChange={setVal} className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Radio value="stat" id="stat-opt" />
          <label htmlFor="stat-opt" className="font-label text-xs font-medium text-error cursor-pointer">
            STAT - Immediate Emergency Resuscitation
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Radio value="urgent" id="urgent-opt" />
          <label htmlFor="urgent-opt" className="font-label text-xs font-medium text-warning cursor-pointer">
            Urgent - Within 30 Minutes
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Radio value="routine" id="routine-opt" />
          <label htmlFor="routine-opt" className="font-label text-xs font-medium text-on-surface cursor-pointer">
            Routine - Scheduled Round
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
          <span className="font-label text-sm font-bold text-on-surface block">Auditory Alarm Broadcast</span>
          <span className="font-sans text-xs text-on-surface-variant">Notify ward nurse station on vital signs anomaly</span>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle auditory alarm" />
      </div>
    </div>
  );
};

export const ToggleDemo: React.FC<ComponentDemoProps> = () => {
  const [pressed, setPressed] = React.useState(true);
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        <Icon name="bookmark" size="xs" className="mr-1.5" />
        Pin Patient to Active Caseload
      </Toggle>
    </div>
  );
};

export const ToggleGroupDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState<string[]>(['vitals']);
  return (
    <div className="space-y-3 w-full max-w-md mx-auto text-center">
      <span className="font-label text-xs font-bold text-on-surface-variant block">Caseload Filter Toggles</span>
      <ToggleGroup value={val} onValueChange={setVal} className="inline-flex justify-center">
        <Toggle value="vitals">Vitals</Toggle>
        <Toggle value="labs">Lab Results</Toggle>
        <Toggle value="scans">Radiology</Toggle>
      </ToggleGroup>
    </div>
  );
};

export const SliderDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(37.2);
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <label className="font-label text-xs font-bold text-on-surface">Target Patient Body Temperature</label>
        <span className="font-mono text-xs font-bold text-primary">{val.toFixed(1)} °C</span>
      </div>
      <Slider value={val} onValueChange={setVal} min={35} max={42} step={0.1} />
    </div>
  );
};

export const NumberFieldDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(120);
  return (
    <div className="space-y-2 w-full max-w-xs mx-auto">
      <label className="font-label text-xs font-bold text-on-surface block">Systolic Blood Pressure (mmHg)</label>
      <NumberField value={val} onValueChange={(v) => v !== null && setVal(v)} min={50} max={250} step={5} />
    </div>
  );
};

export const OTPFieldDemo: React.FC<ComponentDemoProps> = () => {
  const [otp, setOtp] = React.useState('');
  return (
    <div className="space-y-3 w-full max-w-xs mx-auto text-center">
      <label className="font-label text-xs font-bold text-on-surface block">Two-Factor Clinician Auth PIN</label>
      <OTPField length={6} value={otp} onValueChange={setOtp} />
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
