import * as React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/input';
import { Checkbox, Radio, RadioGroup, Switch } from '@/components/ui/selection-controls';
import { Toggle, ToggleGroup } from '@/components/ui/toggles';
import { Slider } from '@/components/ui/slider';
import { NumberField } from '@/components/ui/number-field';
import { OTPField } from '@/components/ui/otp-field';
import { Select } from '@/components/ui/select';
import { Menu } from '@/components/ui/menu';
import { Popover } from '@/components/ui/popover';
import { Dialog } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import { Accordion } from '@/components/ui/accordion';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { Progress, Skeleton } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Toast } from '@/components/ui/toast';
import { Card } from '@/components/ui/card';
import { InlineAlert } from '@/components/ui/inline-alert';
import { Chip } from '@/components/ui/chip';
import { Table } from '@/components/ui/table';
import { DataVisChart } from '@/components/ui/chart';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Autocomplete } from '@/components/ui/autocomplete';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Collapsible } from '@/components/ui/collapsible';
import { Combobox } from '@/components/ui/combobox';
import { ContextMenu } from '@/components/ui/context-menu';
import { Fieldset } from '@/components/ui/fieldset';
import { Form } from '@/components/ui/form';
import { Menubar } from '@/components/ui/menubar';
import { Meter } from '@/components/ui/meter';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { PreviewCard } from '@/components/ui/preview-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toolbar } from '@/components/ui/toolbar';
import { DirectionProvider, type TextDirection } from '@/components/ui/direction-provider';

export const ComponentLibraryShowcase: React.FC = () => {
  const [toastState, setToastState] = React.useState<{
    title: string;
    description?: string;
    type?: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    setToastState({ title, description, type });
  };

  // Interactive state hooks
  const [checkboxVal, setCheckboxVal] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState('daily');
  const [switchVal, setSwitchVal] = React.useState(true);
  const [toggleVal, setToggleVal] = React.useState(true);
  const [toggleGroupVal, setToggleGroupVal] = React.useState<string[]>(['grid']);
  const [sliderVal, setSliderVal] = React.useState(65);
  const [rangeSliderVal, setRangeSliderVal] = React.useState<number[]>([25, 75]);
  const [numVal, setNumVal] = React.useState<number | null>(4);
  const [selectVal, setSelectVal] = React.useState<string | null>('daily');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertDialogOptionsOpen, setAlertDialogOptionsOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState('card-1');
  const [autocompleteVal, setAutocompleteVal] = React.useState<string | null>('Vowel Prolongation');
  const [comboboxVal, setComboboxVal] = React.useState<string | null>('daily');
  const [checkboxGroupVal, setCheckboxGroupVal] = React.useState<string[]>(['audio', 'visual']);
  const [meterVal, setMeterVal] = React.useState(82);
  const [toolbarActive, setToolbarActive] = React.useState('bold');
  const [showcaseDirection, setShowcaseDirection] = React.useState<TextDirection>('ltr');

  // Sample Table Data
  interface PatientSession {
    id: string;
    patientName: string;
    exercise: string;
    accuracy: string;
    status: string;
  }

  const tableData: PatientSession[] = [
    { id: '1', patientName: 'Arthur Dent', exercise: 'Vowel Prolongation', accuracy: '92%', status: 'Completed' },
    { id: '2', patientName: 'Trillian Astra', exercise: 'Consonant Drills', accuracy: '88%', status: 'Completed' },
    { id: '3', patientName: 'Ford Prefect', exercise: 'Pitch Glide', accuracy: '76%', status: 'In Progress' },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Buttons Comparative Matrix */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">1. Buttons Matrix & Size Comparison</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Emphasis tiers (Filled, Outlined, Text) aligned side-by-side across color roles, with explicit touch floor verification.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="rounded-[1rem] bg-surface border-none shadow-ambient overflow-x-auto p-6 space-y-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant font-label text-xs font-bold text-on-surface-variant">
                <th className="pb-3 pr-4">Color role</th>
                <th className="pb-3 px-4">Filled tier (highest)</th>
                <th className="pb-3 px-4">Outlined tier (medium)</th>
                <th className="pb-3 pl-4">Text tier (lowest)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-primary">Primary</td>
                <td className="py-4 px-4"><Button colorRole="primary">Primary Action</Button></td>
                <td className="py-4 px-4"><Button variant="outlined" colorRole="primary">Outlined Primary</Button></td>
                <td className="py-4 pl-4"><Button variant="text" colorRole="primary">Text Action</Button></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-secondary">Secondary</td>
                <td className="py-4 px-4"><Button colorRole="secondary">View Guide</Button></td>
                <td className="py-4 px-4"><Button variant="outlined" colorRole="secondary">Outlined Guide</Button></td>
                <td className="py-4 pl-4"><Button variant="text" colorRole="secondary">Learn More</Button></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-on-surface">Tertiary</td>
                <td className="py-4 px-4"><Button colorRole="tertiary">Milestone Highlight</Button></td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button colorRole="tertiary">Milestone Highlight</Button>
                    <span className="text-[10px] text-on-surface-variant italic">(Filled Only for Contrast)</span>
                  </div>
                </td>
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-2">
                    <Button colorRole="tertiary">Milestone Highlight</Button>
                    <span className="text-[10px] text-on-surface-variant italic">(Filled Only for Contrast)</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-error">Error</td>
                <td className="py-4 px-4"><Button colorRole="error">Destructive Action</Button></td>
                <td className="py-4 px-4"><Button variant="outlined" colorRole="error">Outlined Destructive</Button></td>
                <td className="py-4 pl-4"><Button variant="text" colorRole="error">Cancel Task</Button></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-warning">Warning</td>
                <td className="py-4 px-4"><Button colorRole="warning">Caution Action</Button></td>
                <td className="py-4 px-4"><Button variant="outlined" colorRole="warning">Outlined Caution</Button></td>
                <td className="py-4 pl-4"><Button variant="text" colorRole="warning">Warning Link</Button></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-success">Success</td>
                <td className="py-4 px-4"><Button colorRole="success">Confirm Task</Button></td>
                <td className="py-4 px-4"><Button variant="outlined" colorRole="success">Outlined Success</Button></td>
                <td className="py-4 pl-4"><Button variant="text" colorRole="success">Success Link</Button></td>
              </tr>
            </tbody>
          </table>

          {/* Size Comparison Bar */}
          <div className="pt-4 border-t border-outline-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <span className="font-label text-xs font-bold text-on-surface-variant">Button size & touch target comparison</span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Button size="sm" colorRole="primary">Small (44px min)</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="md" colorRole="primary">Medium Floor (48px)</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="lg" colorRole="primary">Large Target (56px)</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Inputs & Form Fields */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">2. Input Fields & Form Controls (Base UI `Field`, `Input`, `Fieldset`, `OTPField`)</h3>
          <p className="font-sans text-sm text-on-surface-variant">
            Flush inset focus rings (<code>outline-offset: 0</code>), 14px typography floor for helper/error text, leading error icons, and borderless fieldsets.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-surface border-none shadow-ambient">
          <div className="space-y-4">
            <FormField
              label="Patient Full Name"
              description="Enter patient name as registered on clinical portal"
              placeholder="e.g. Eleanor Vance"
              required
            />
            <FormField
              label="Clinical Record Search"
              description="Search by NHS number, diagnosis, or patient identifier"
              placeholder="Search caseload..."
              leadingIcon={<span className="material-symbols-outlined text-lg" aria-hidden="true">search</span>}
              trailingAction={
                <button
                  type="button"
                  aria-label="Clear search"
                  className="p-1 rounded hover:bg-surface-variant/40 text-on-surface-variant transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              }
            />
          </div>
          <div className="space-y-4">
            <FormField
              label="Therapy Session Passcode"
              description="Format: 6-digit clinical security passcode"
              error="Passcode must contain at least 6 characters"
              defaultValue="123"
            />
            <Fieldset legend="Contact Preferences" description="Select preferred communication methods" variant="default">
              <div className="grid grid-cols-2 gap-3 pt-1">
                <FormField
                  label="Secure Email"
                  placeholder="name@nhs.net"
                  type="email"
                />
                <FormField
                  label="Direct Extension"
                  placeholder="+44 20 7946 0192"
                  type="tel"
                />
              </div>
            </Fieldset>
          </div>
        </div>

        {/* OTP Field Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-surface border-none shadow-ambient">
          <div>
            <h4 className="font-label text-sm font-bold text-on-surface-variant mb-2">
              Clinical MFA / 6-Digit Code (with 3-3 grouping separator)
            </h4>
            <OTPField
              label="One-Time Clinical Authorization Code"
              description="Enter the 6-digit verification code sent to your authenticated device"
              length={6}
              showSeparator
              required
            />
          </div>
          <div>
            <h4 className="font-label text-sm font-bold text-on-surface-variant mb-2">
              Invalid OTP Passcode (Error State with Icon)
            </h4>
            <OTPField
              label="Session Re-Authentication"
              description="Verification code expired after 5 minutes"
              error="The verification code entered is invalid or expired. Please try again."
              length={6}
              showSeparator
              defaultValue="849201"
            />
          </div>
        </div>
      </section>

      {/* 3. Selection Controls & Toggles */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">3. Selection Controls & Toggles (Base UI Primitives)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Touch targets strictly meet 44px minimum hit area with clear focus ring indicators.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Binary controls (Checkbox & Switch)
            </h4>
            <div className="space-y-4">
              <Checkbox
                label="Enable audio recording"
                checked={checkboxVal}
                onCheckedChange={setCheckboxVal}
              />
              <Switch
                label="Real-time visual feedback"
                checked={switchVal}
                onCheckedChange={setSwitchVal}
              />
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              44px Hit Target Verified
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Radio options (Single Select)
            </h4>
            <RadioGroup value={radioVal} onValueChange={setRadioVal}>
              <Radio
                label="Daily therapy cadence"
                description="20 minutes guided daily practice"
                value="daily"
                id="r1"
              />
              <Radio
                label="Weekly therapy cadence"
                description="60 minutes weekly clinician review"
                value="weekly"
                id="r2"
              />
              <Radio
                label="Monthly milestone review (Disabled)"
                description="Available after 4 active weeks"
                value="monthly"
                id="r3"
                disabled
              />
            </RadioGroup>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Base UI RadioGroup & Radio (Active: <code className="text-primary font-bold">{radioVal}</code>)
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Action toggles (Toggle & ToggleGroup)
            </h4>
            <div className="space-y-4">
              <Toggle
                pressed={toggleVal}
                onPressedChange={setToggleVal}
                ariaLabel="High contrast view toggle"
              >
                High Contrast Mode
              </Toggle>
              <div>
                <span className="font-label text-xs text-on-surface-variant block mb-1">Layout Mode</span>
                <ToggleGroup
                  value={toggleGroupVal}
                  onValueChange={setToggleGroupVal}
                  ariaLabel="View mode"
                  items={[
                    { value: 'grid', label: 'Grid', icon: 'grid_view' },
                    { value: 'list', label: 'List', icon: 'format_list_bulleted' },
                  ]}
                />
              </div>
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Segmented Control State
            </span>
          </Card>
        </div>
      </section>

      {/* 4. Sliders & Steppers */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl font-bold text-on-surface">4. Sliders & Stepped Inputs (Base UI `Slider`, `NumberField`)</h3>
            <p className="font-sans text-sm text-on-surface-variant">
              Standardized label headers, numeric controls, and bidirectional RTL support via Base UI `DirectionProvider`.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant shrink-0">
            <span className="font-label text-xs font-semibold text-on-surface-variant">Direction:</span>
            <button
              type="button"
              onClick={() => setShowcaseDirection('ltr')}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                showcaseDirection === 'ltr'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              LTR
            </button>
            <button
              type="button"
              onClick={() => setShowcaseDirection('rtl')}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                showcaseDirection === 'rtl'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              RTL
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DirectionProvider direction={showcaseDirection}>
            <div dir={showcaseDirection} className="h-full">
              <Card variant="default" className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label text-[10px] uppercase font-bold text-secondary tracking-wider">
                      DirectionProvider ({showcaseDirection.toUpperCase()})
                    </span>
                    <span className="font-label text-xs text-on-surface-variant">
                      Track auto-mirrors
                    </span>
                  </div>
                  <Slider
                    label="Audio Pitch Threshold"
                    description="44px touch targets with RTL auto-mirroring"
                    value={sliderVal}
                    onValueChange={setSliderVal}
                  />
                  <div className="mt-4 pt-4 border-t border-outline-variant/40">
                    <Slider
                      label="Frequency Passband (Range)"
                      description="Dual 44px thumbs with minimum/maximum values"
                      value={rangeSliderVal}
                      onValueChange={setRangeSliderVal}
                    />
                  </div>
                </div>
                <span className="font-label text-[11px] text-on-surface-variant/80 block pt-3 border-t border-outline-variant/40 mt-4">
                  Slider coordinate calculations invert automatically in RTL mode.
                </span>
              </Card>
            </div>
          </DirectionProvider>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between">
            <NumberField
              label="Repetition Count"
              description="Clinical trials target range: 1–20 reps"
              value={numVal ?? 4}
              onValueChange={setNumVal}
              min={1}
              max={20}
              step={1}
            />
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between">
            <OTPField
              label="Security Verification Code"
              length={4}
              onComplete={(code) => showToast('Passcode Verified', `Verified security passcode: ${code}`, 'success')}
            />
          </Card>
        </div>
      </section>

      {/* 5. Dropdowns & Menus */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">5. Menus, Selects & Popovers (Base UI Primitives)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Tier B floating surfaces (1px border, 10% ambient shadow) with aligned trigger controls.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-[1rem] bg-surface border-none shadow-ambient items-end">
          <Select
            label="Cadence Frequency Select"
            value={selectVal ?? ''}
            onValueChange={setSelectVal}
            options={[
              { value: 'daily', label: 'Daily Session' },
              { value: 'weekly', label: 'Weekly Review' },
              { value: 'monthly', label: 'Monthly Milestone' },
            ]}
          />

          <Menu
            label="Session Action Menu"
            triggerLabel="Session Options"
            items={[
              { id: '1', label: 'Export Progress Report', icon: 'download' },
              { id: '2', label: 'Share with Therapist', icon: 'share' },
              { id: '3', label: 'Delete History Record', icon: 'delete', destructive: true },
            ]}
          />

          <Popover
            label="Therapy Guidance Popover"
            trigger={
              <Button variant="outlined" colorRole="tertiary" size="md" className="w-full">
                View Guidance Tip
              </Button>
            }
            title="Therapy Guidance Tip"
          >
            Ensure the patient maintains a comfortable posture during pitch glides. Encourage steady diaphragmatic breathing.
          </Popover>
        </div>
      </section>

      {/* 6. Overlays & Dialogs */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">6. Dialogs & Side Drawers (Base UI `Dialog`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Tier A modal overlays (2px border, backdrop scrim, modal shadow) with aligned trigger controls.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <div>
              <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Modal confirmation tier</span>
              <h4 className="font-heading text-base font-bold text-on-surface">Modal Action Dialog</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Centred focus-trap overlay with backdrop scrim for destructive or critical confirmations.
              </p>
            </div>
            <Button colorRole="primary" onClick={() => setDialogOpen(true)}>
              Open Confirmation Dialog
            </Button>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <div>
              <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Side drawer tier</span>
              <h4 className="font-heading text-base font-bold text-on-surface">Patient History Drawer</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Full-height side panel slide-in for deep clinical inspection without losing page context.
              </p>
            </div>
            <Button variant="outlined" colorRole="tertiary" onClick={() => setDrawerOpen(true)}>
              Open Side Drawer Panel
            </Button>
          </Card>

          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Save Exercise Progress?"
            description="Your current exercise attempt will be recorded in your clinical milestone history."
            confirmLabel="Save Record"
            onConfirm={() => showToast('Progress Saved', 'Exercise attempt recorded in clinical milestone history.', 'success')}
          />

          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="Patient Clinical History"
            description="Detailed review of speech therapy sessions recorded over the last 30 days."
          >
            <div className="space-y-4 font-sans text-sm">
              <InlineAlert title="Recent Progress Milestone" role="success" icon="emoji_events">
                Patient completed 5 consecutive days of vowel prolongation drills.
              </InlineAlert>
              <div className="p-4 rounded-[0.5rem] bg-surface-container border border-outline-variant">
                <h5 className="font-bold text-on-surface mb-1">Therapist Notes</h5>
                <p className="text-on-surface-variant">
                  Exhibited strong pitch stability during vocal warmups. Ready to advance to consonant cluster exercises.
                </p>
              </div>
            </div>
          </Drawer>
        </div>
      </section>

      {/* 7. Cards & Banners */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">7. Cards & Callout Banners</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Level 3 containment variants aligned to uniform height with matched comparison structure.
          </p>
        </div>

        {/* Level 3 Archetypes Grid: Selection & Accent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            variant="selectable"
            selected={selectedCard === 'card-1'}
            onClick={() => setSelectedCard('card-1')}
            className="cursor-pointer h-full flex flex-col justify-between p-5 space-y-4"
          >
            <div>
              <span className="font-label text-[10px] font-bold text-primary block mb-1">Selectable (Tab to Focus)</span>
              <h4 className="font-heading text-base font-bold mb-1">Active Selection Card</h4>
              <p className="font-sans text-xs text-on-surface-variant">
                Displays a 2px offset focus ring when focused, and a flush 2px border with soft wash when selected.
              </p>
            </div>
            <div className="border-t border-outline-variant/60 pt-2 text-[11px] font-label text-primary font-semibold flex items-center justify-between">
              <span>{selectedCard === 'card-1' ? 'Selected' : 'Press Space to Select'}</span>
              {selectedCard === 'card-1' && (
                <span className="material-symbols-outlined text-base text-primary" aria-hidden="true">check_circle</span>
              )}
            </div>
          </Card>

          <Card variant="accent" colorRole="secondary" className="h-full flex flex-col justify-between p-5 space-y-4">
            <div>
              <span className="font-label text-[10px] font-bold text-secondary block mb-1">Accent Border (Secondary Emerald)</span>
              <h4 className="font-heading text-base font-bold text-secondary mb-1">Accent Card</h4>
              <p className="font-sans text-xs text-on-surface-variant">2px solid Rich Emerald border for therapy guide categories.</p>
            </div>
            <div className="border-t border-outline-variant/60 pt-2 text-[11px] font-label text-secondary font-semibold">
              Category Highlight
            </div>
          </Card>
        </div>

        {/* Inverted Cards (Charcoal Container) Matrix */}
        <div className="pt-2">
          <span className="font-label text-xs font-bold text-on-surface-variant block mb-3">
            Inverted Card (<code className="text-primary font-bold">variant="inverted"</code>) — Charcoal Inverted Fill Accent Matrix
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="inverted" invertedAccent="tertiary" className="h-full flex flex-col justify-between p-5 space-y-4">
              <div>
                <span className="font-label text-[10px] font-bold text-tertiary block mb-1">Inverted (Amber Title + White Body)</span>
                <h4 className="font-heading text-base font-bold text-tertiary mb-1">Strategy Tip Callout</h4>
                <p className="font-sans text-xs font-medium text-surface">Sunny Amber title (8.55:1 AAA) with pure white body copy (15.3:1 AAA) to prevent chromatic glare.</p>
              </div>
              <div className="border-t border-surface/20 pt-2 text-[11px] font-label text-tertiary font-semibold">
                Strategy & Guidance Callout
              </div>
            </Card>

            <Card variant="inverted" invertedAccent="neutral" className="h-full flex flex-col justify-between p-5 space-y-4">
              <div>
                <span className="font-label text-[10px] font-bold text-surface block mb-1">Inverted (Pure White Neutral)</span>
                <h4 className="font-heading text-base font-bold text-surface mb-1">Monochrome Inverted Card</h4>
                <p className="font-sans text-xs font-medium text-surface">Pure white title and body copy on charcoal for high-contrast announcements (15.3:1 AAA).</p>
              </div>
              <div className="border-t border-surface/20 pt-2 text-[11px] font-label text-surface font-semibold">
                High-Contrast Announcement
              </div>
            </Card>
          </div>
        </div>

        {/* Highlight Cards Color Roles Matrix */}
        <div className="pt-2">
          <span className="font-label text-xs font-bold text-on-surface-variant block mb-3">
            Highlight Card (<code className="text-primary font-bold">variant="filled"</code>) — Color Roles & High-Contrast Text Pairings
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="filled" colorRole="primary" className="h-full flex flex-col justify-between p-5 space-y-4">
              <div>
                <span className="font-label text-[10px] font-bold text-on-primary block mb-1">Highlight (Primary Blue)</span>
                <h4 className="font-heading text-base font-bold text-on-primary mb-1">Primary Highlight Card</h4>
                <p className="font-sans text-xs font-medium text-on-primary">Solid Electric Blue fill paired with 100% pure white text (<code>on-primary</code>, 4.6:1 AA pass).</p>
              </div>
              <div className="border-t border-on-primary/30 pt-2 text-[11px] font-label text-on-primary font-semibold">
                Brand Core Fill
              </div>
            </Card>

            <Card variant="filled" colorRole="secondary" className="h-full flex flex-col justify-between p-5 space-y-4">
              <div>
                <span className="font-label text-[10px] font-bold text-on-secondary block mb-1">Highlight (Secondary Emerald)</span>
                <h4 className="font-heading text-base font-bold text-on-secondary mb-1">Secondary Highlight Card</h4>
                <p className="font-sans text-xs font-medium text-on-secondary">Solid Rich Emerald fill paired with 100% pure white text (<code>on-secondary</code>, 4.6:1 AA pass).</p>
              </div>
              <div className="border-t border-on-secondary/30 pt-2 text-[11px] font-label text-on-secondary font-semibold">
                Knowledge & Guidance Fill
              </div>
            </Card>

            <Card variant="filled" colorRole="tertiary" className="h-full flex flex-col justify-between p-5 space-y-4">
              <div>
                <span className="font-label text-[10px] font-bold text-on-tertiary block mb-1">Highlight (Tertiary Amber)</span>
                <h4 className="font-heading text-base font-bold text-on-tertiary mb-1">Tertiary Highlight Card</h4>
                <p className="font-sans text-xs font-medium text-on-tertiary">Solid Sunny Amber fill paired with 100% dark charcoal text (<code>on-tertiary</code>, 10.7:1 AAA pass).</p>
              </div>
              <div className="border-t border-on-tertiary/30 pt-2 text-[11px] font-label text-on-tertiary font-semibold">
                Celebratory Highlight Fill
              </div>
            </Card>
          </div>
        </div>

        <InlineAlert title="Inline Alert Archetype" role="neutral">
          Features an unrounded white surface, borderless body, and a straight 4px vertical left accent bar for high-salience system and status notices.
        </InlineAlert>
      </section>

      {/* 8. Chips Comparative Matrix */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">8. Chips & Badges Comparative Matrix</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Direct side-by-side comparison of the 3 allowed non-triple-tint patterns across color roles (zero monochrome tint fills).
          </p>
        </div>

        <div className="rounded-[1rem] bg-surface border border-outline-variant overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant font-label text-xs font-bold text-on-surface-variant">
                <th className="pb-3 pr-4">Color role</th>
                <th className="pb-3 px-4">Pattern 1: Saturated Mixed (High Emphasis)</th>
                <th className="pb-3 px-4">Pattern 2: Outline + Surface (Everyday Default)</th>
                <th className="pb-3 pl-4">Pattern 3: Soft Container Wash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-primary">Primary</td>
                <td className="py-4 px-4"><Chip label="Primary Solid" pattern="high-contrast-mixed" colorRole="primary" icon="record_voice_over" /></td>
                <td className="py-4 px-4"><Chip label="Phonetics" pattern="outline-neutral-fill" colorRole="primary" icon="record_voice_over" /></td>
                <td className="py-4 pl-4"><Chip label="Metadata Tag" pattern="neutral-fill-accent-text" colorRole="primary" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-secondary">Secondary</td>
                <td className="py-4 px-4"><Chip label="Guide Solid" pattern="high-contrast-mixed" colorRole="secondary" icon="lightbulb" /></td>
                <td className="py-4 px-4"><Chip label="Guide Tip" pattern="outline-neutral-fill" colorRole="secondary" icon="lightbulb" /></td>
                <td className="py-4 pl-4"><Chip label="Informational" pattern="neutral-fill-accent-text" colorRole="secondary" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-on-surface">Tertiary</td>
                <td className="py-4 px-4"><Chip label="Milestone Solid" pattern="high-contrast-mixed" colorRole="tertiary" icon="emoji_events" /></td>
                <td className="py-4 px-4"><Chip label="Milestone Badge" pattern="high-contrast-mixed" colorRole="tertiary" icon="emoji_events" /></td>
                <td className="py-4 pl-4"><Chip label="Milestone Tag" pattern="neutral-fill-accent-text" colorRole="tertiary" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-success">Success</td>
                <td className="py-4 px-4"><Chip label="Completed" pattern="high-contrast-mixed" colorRole="success" icon="check" /></td>
                <td className="py-4 px-4"><Chip label="Verified Outline" pattern="outline-neutral-fill" colorRole="success" icon="check" /></td>
                <td className="py-4 pl-4"><Chip label="Success Tag" pattern="neutral-fill-accent-text" colorRole="success" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-error">Error</td>
                <td className="py-4 px-4"><Chip label="Session Failed" pattern="high-contrast-mixed" colorRole="error" icon="error" /></td>
                <td className="py-4 px-4"><Chip label="Failed Outline" pattern="outline-neutral-fill" colorRole="error" icon="error" /></td>
                <td className="py-4 pl-4"><Chip label="Error Tag" pattern="neutral-fill-accent-text" colorRole="error" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-warning">Warning</td>
                <td className="py-4 px-4"><Chip label="Caution" pattern="high-contrast-mixed" colorRole="warning" icon="warning" /></td>
                <td className="py-4 px-4"><Chip label="Caution Outline" pattern="outline-neutral-fill" colorRole="warning" icon="warning" /></td>
                <td className="py-4 pl-4"><Chip label="Warning Tag" pattern="neutral-fill-accent-text" colorRole="warning" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Accordion & Tabs */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">9. Accordions & Tabs (Base UI `Accordion`, `Tabs`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Collapsible hierarchy vs multi-view panel layout comparison.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-heading text-base font-bold mb-4">Accordion (Level 1 Layout)</h4>
              <Accordion
                items={[
                  { id: '1', title: 'What is the 3-level containment model?', content: 'Every screen uses Level 1 (Canvas), Level 2 (Grouped Fill), and Level 3 (Surface/Card) in strict decision order to reduce visual noise.' },
                  { id: '2', title: 'Why is Base UI the primitive foundation?', content: 'Base UI ships as unstyled, accessible primitives with superior maintenance velocity and tree-shakable architecture.' },
                ]}
              />
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Accessible WAI-ARIA Accordion
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-heading text-base font-bold mb-2">Tabs Component</h4>
              <Tabs
                items={[
                  { id: 't1', label: 'Vocal Warmups', icon: 'graphic_eq', content: <p className="text-xs text-on-surface-variant">Sustained vowel exercises designed to stabilize vocal fold vibration.</p> },
                  { id: 't2', label: 'Fluency Drills', icon: 'speed', content: <p className="text-xs text-on-surface-variant">Rhythmic syllable pacing exercises to improve articulation smooth flow.</p> },
                ]}
              />
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Keyboard Tablist Navigation
            </span>
          </Card>
        </div>
      </section>

      {/* 10. Progress, Skeleton & Avatars */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">10. Progress, Skeleton & Avatars (Base UI `Progress`, `Avatar`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Equalized column heights with centered avatar fallbacks and indicator states.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Progress & Skeletons
            </h4>
            <div className="space-y-4">
              <Progress value={78} label="Session Mastery Goal" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Animated Shimmer Loading
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Avatars (surface-variant fallback)
            </h4>
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex flex-col items-center gap-1">
                <Avatar fallback="ED" size="sm" />
                <span className="text-[10px] font-mono text-on-surface-variant">SM (32px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Avatar fallback="TA" size="md" />
                <span className="text-[10px] font-mono text-on-surface-variant">MD (40px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Avatar fallback="FP" size="lg" />
                <span className="text-[10px] font-mono text-on-surface-variant">LG (48px)</span>
              </div>
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              High Contrast Initials
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Tooltip & Toast
            </h4>
            <div className="flex flex-col gap-3">
              <Tooltip content="Provides instant clinical assessment feedback">
                <Button variant="outlined" colorRole="primary" size="sm" className="w-full">Hover for Tooltip</Button>
              </Tooltip>
              <Toast title="Session Saved" description="Therapy drill results persisted to Cloud Firestore." type="success" />
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Non-Disruptive Notifications
            </span>
          </Card>
        </div>
      </section>

      {/* 11. Tables & Data Visualization */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">11. Data Tables & Visualization</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Structured tabular records with status chip indicators and trend charts.
          </p>
        </div>
        <div className="space-y-6">
          <Table
            columns={[
              { header: 'Patient Name', accessor: 'patientName' },
              { header: 'Assigned Drill', accessor: 'exercise' },
              { header: 'Accuracy Rate', accessor: 'accuracy' },
              {
                header: 'Status',
                accessor: (row) => (
                  <Chip
                    label={row.status}
                    pattern={row.status === 'Completed' ? 'high-contrast-mixed' : 'outline-neutral-fill'}
                    colorRole={row.status === 'Completed' ? 'success' : 'primary'}
                  />
                ),
              },
            ]}
            data={tableData}
            keyExtractor={(row) => row.id}
          />
          <DataVisChart />
        </div>
      </section>

      {/* 12. Forms, Fieldsets & Checkbox Groups */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">12. Form Groupings & Fieldsets (Base UI `Form`, `Fieldset`, `CheckboxGroup`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Semantic form boundaries and multi-select checkbox group controls.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Fieldset legend="Clinical Session Configuration" description="Set telemetry and recording parameters for patient practice">
            <Form onSubmit={() => showToast('Configuration Saved', 'Active telemetry parameters persisted to patient profile.', 'info')}>
              <CheckboxGroup
                label="Active Telemetry Features"
                description="Select required data streams for therapist analysis"
                value={checkboxGroupVal}
                onValueChange={setCheckboxGroupVal}
                options={[
                  { value: 'audio', label: 'High-Fidelity Audio Stream', description: '24-bit 48kHz uncompressed audio capture' },
                  { value: 'visual', label: 'Real-time Waveform Visualizer', description: 'Renders pitch glide frequencies on canvas' },
                  { value: 'spectrogram', label: 'Spectrogram Density Analysis', description: 'Advanced resonance harmonics mapping' },
                ]}
              />
              <div className="pt-2">
                <Button colorRole="primary" size="sm" type="submit">Save Configuration</Button>
              </div>
            </Form>
          </Fieldset>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <div>
              <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Semantic Form Section</span>
              <h4 className="font-heading text-base font-bold text-on-surface">Fieldset & Legend Architecture</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                Base UI <code className="text-primary font-mono">Fieldset</code> provides standard WAI-ARIA group binding, associating legend titles and description text directly with enclosed input controls.
              </p>
            </div>
            <div className="p-3 rounded-[0.5rem] bg-surface-container border border-outline-variant/60 font-mono text-xs text-on-surface-variant">
              Selected: {JSON.stringify(checkboxGroupVal)}
            </div>
          </Card>
        </div>
      </section>

      {/* 13. Search, Autocomplete & Comboboxes */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">13. Autocomplete & Search Comboboxes (Base UI `Autocomplete`, `Combobox`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Filtered search suggestions and dropdown selection primitives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[1rem] bg-surface border-none shadow-ambient">
          <Autocomplete
            label="Assigned Speech Drill Autocomplete"
            description="Search with leading icon, clear button, and flush focus ring"
            placeholder="Type drill name (e.g. Vowel, Pitch)..."
            value={autocompleteVal}
            onValueChange={setAutocompleteVal}
            options={[
              { value: 'Vowel Prolongation', label: 'Vowel Prolongation (A/E/I/O/U)' },
              { value: 'Pitch Glide', label: 'Pitch Glide (Low-to-High Spectrum)' },
              { value: 'Consonant Drills', label: 'Consonant Drills (Plosive /b/ /p/)' },
              { value: 'Resonance Hold', label: 'Resonance Hold (Nasal /m/ /n/)' },
            ]}
          />

          <Combobox
            label="Therapy Frequency Combobox"
            placeholder="Select cadence frequency..."
            value={comboboxVal}
            onValueChange={setComboboxVal}
            options={[
              { value: 'daily', label: 'Daily Session (20 mins)' },
              { value: 'weekly', label: 'Weekly Review (60 mins)' },
              { value: 'biweekly', label: 'Bi-weekly Check-in' },
              { value: 'monthly', label: 'Monthly Milestone Audit' },
            ]}
          />
        </div>
      </section>

      {/* 14. Context Menu, Menubar & Navigation */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">14. Menubar, Context Menu & Navigation (Base UI Primitives)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Desktop application header menubars, contextual right-click popups, and site navigation headers.
          </p>
        </div>
        <div className="space-y-6">
          {/* Menubar */}
          <Menubar
            menus={[
              {
                triggerLabel: 'File',
                items: [
                  { id: 'f1', label: 'New Patient Record', icon: 'person_add', shortcut: '⌘N' },
                  { id: 'f2', label: 'Export Telemetry Data', icon: 'download', shortcut: '⌘E' },
                  { id: 'f3', label: 'Close Active Session', icon: 'close', destructive: true },
                ],
              },
              {
                triggerLabel: 'Edit',
                items: [
                  { id: 'e1', label: 'Undo Last Scoring', icon: 'undo', shortcut: '⌘Z' },
                  { id: 'e2', label: 'Redo Scoring', icon: 'redo', shortcut: '⌘Y' },
                ],
              },
              {
                triggerLabel: 'View',
                items: [
                  { id: 'v1', label: 'Toggle Waveform Graph', icon: 'show_chart' },
                  { id: 'v2', label: 'Full Screen Mode', icon: 'fullscreen', shortcut: 'F11' },
                ],
              },
            ]}
          />

          {/* Context Menu Trigger Area & Navigation Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContextMenu
              items={[
                { id: 'c1', label: 'Inspect Patient Profile', icon: 'visibility', action: () => showToast('Patient Profile Inspected', 'Opening clinical profile overview...', 'info') },
                { id: 'c2', label: 'Duplicate Session Notes', icon: 'content_copy', action: () => showToast('Session Notes Duplicated', 'Copied latest therapist session notes.', 'success') },
                { id: 'c3', label: 'Archive Record', icon: 'archive', destructive: true, action: () => showToast('Record Archived', 'Patient record moved to archive storage.', 'warning') },
              ]}
            >
              <div className="p-6 rounded-[0.75rem] bg-surface-container border border-dashed border-outline-variant flex flex-col items-center justify-center text-center cursor-context-menu hover:bg-surface-variant/50 transition-colors h-36">
                <span className="material-symbols-outlined text-primary text-3xl mb-2" aria-hidden="true">
                  mouse
                </span>
                <span className="font-label text-sm font-bold text-on-surface">Right-Click Anywhere Here</span>
                <span className="font-sans text-xs text-on-surface-variant mt-1">Triggers Base UI `ContextMenu` popup</span>
              </div>
            </ContextMenu>

            <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-2">Base UI `NavigationMenu`</span>
                <NavigationMenu
                  activeId="n1"
                  items={[
                    { id: 'n1', label: 'Dashboard', icon: 'dashboard', href: '#dashboard' },
                    {
                      id: 'n2',
                      label: 'Analytics',
                      icon: 'analytics',
                      children: [
                        { id: 'n2-1', label: 'Progress Reports', icon: 'bar_chart', description: 'Patient accuracy rates & pitch telemetry logs' },
                        { id: 'n2-2', label: 'Resonance Metrics', icon: 'graphic_eq', description: 'Spectrogram harmonics density analysis' },
                      ],
                    },
                    { id: 'n3', label: 'Settings', icon: 'settings', href: '#settings' },
                  ]}
                />
              </div>
              <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Accessible Header Navigation Bar with 2px Primary Active Underline & Submenus
              </span>
            </Card>
          </div>
        </div>
      </section>

      {/* 15. Utility & Gauge Primitives */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">15. Utility, Scalar Gauge & Layout Primitives (Meter, Toolbar, PreviewCard, Collapsible, ScrollArea, Separator)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Quantitative meters, action toolbars, rich preview cards, collapsible disclosures, and custom scroll areas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Meter (Scalar Gauge) & Separator
            </h4>
            <div className="space-y-4">
              <Meter
                label="Vocal Pitch Stability Meter"
                description="Real-time acoustic stability scoring"
                value={meterVal}
                colorRole="secondary"
              />
              <Separator />
              <Meter
                label="Storage Quota Utilization"
                description="Encrypted clinical telemetry records"
                value={45}
                colorRole="primary"
              />
              <Separator />
              <Meter
                label="Therapy Latency Ceiling"
                description="Threshold warning indicator"
                value={88}
                colorRole="warning"
              />
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/40">
              <Button size="sm" variant="outlined" colorRole="secondary" onClick={() => setMeterVal((v) => (v >= 100 ? 20 : Math.min(100, v + 20)))}>
                Bump Pitch Stability ({meterVal}%)
              </Button>
            </div>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Action Toolbar & PreviewCard
            </h4>
            <div className="space-y-4">
              <div>
                <span className="font-label text-xs text-on-surface-variant block mb-1">Editor Action Toolbar</span>
                <Toolbar
                  actions={[
                    { id: 'bold', label: 'Bold Text', icon: 'format_bold', active: toolbarActive === 'bold', action: () => setToolbarActive('bold') },
                    { id: 'italic', label: 'Italic Text', icon: 'format_italic', active: toolbarActive === 'italic', action: () => setToolbarActive('italic') },
                    { id: 'underline', label: 'Underline Text', icon: 'format_underlined', active: toolbarActive === 'underline', action: () => setToolbarActive('underline') },
                    { id: 'mic', label: 'Record Audio', icon: 'mic', active: toolbarActive === 'mic', action: () => setToolbarActive('mic') },
                  ]}
                />
              </div>
              <Separator />
              <div>
                <span className="font-label text-xs text-on-surface-variant block mb-1">Hover Preview Card</span>
                <p className="font-sans text-sm text-on-surface-variant">
                  Patient registered under{' '}
                  <PreviewCard
                    trigger="Protocol #74-Beta"
                    title="Protocol #74-Beta Guidance"
                    description="Standardized 12-week vocal resonance strengthening routine for pitch range expansion."
                    icon="clinical_notes"
                  />
                  .
                </p>
              </div>
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Rich Context Popovers
            </span>
          </Card>

          <Card variant="default" className="p-6 h-full flex flex-col justify-between space-y-4">
            <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
              Collapsible & Custom ScrollArea
            </h4>
            <div className="space-y-3">
              <Collapsible title="View Clinical Guidelines">
                Keep room noise level under 35dB. Maintain 12-inch distance from unidirectional condenser microphone.
              </Collapsible>
              <ScrollArea maxHeight="120px" className="rounded-md bg-surface-container/40 p-3">
                <div className="space-y-2 text-sm font-sans text-on-surface-variant">
                  <p><strong className="text-on-surface">Log 1:</strong> Audio calibrated at 48kHz.</p>
                  <p><strong className="text-on-surface">Log 2:</strong> Vowel duration test passed (14.2s sustain).</p>
                  <p><strong className="text-on-surface">Log 3:</strong> Pitch stability variance &lt; 2.1 Hz.</p>
                  <p><strong className="text-on-surface">Log 4:</strong> Session metrics saved to storage.</p>
                  <p><strong className="text-on-surface">Log 5:</strong> Articulation accuracy evaluated at 96%.</p>
                </div>
              </ScrollArea>
            </div>
            <span className="font-label text-[11px] text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
              Custom Scrollbars & Panels
            </span>
          </Card>
        </div>
      </section>

      {/* 16. Alert Dialog (Destructive & High Consequence) */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">16. Alert Dialog (Base UI `AlertDialog`)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Urgent modal dialog layer designed for high-consequence destructive actions with explicit accessibility alert roles.
          </p>
        </div>
        <Card variant="default" className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading text-base font-bold text-on-surface">Purge Patient Telemetry Logs</h4>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              Triggers the Base UI <code className="text-error font-mono">AlertDialog</code> with warning icon and destructive primary trigger button.
            </p>
          </div>
          <Button colorRole="error" onClick={() => setAlertDialogOptionsOpen(true)}>
            Trigger Alert Dialog
          </Button>

          <AlertDialog
            open={alertDialogOptionsOpen}
            onOpenChange={setAlertDialogOptionsOpen}
            title="Permanently Delete Patient Telemetry Logs?"
            description="This action cannot be undone. All 48kHz audio recordings and pitch glide harmonic logs for this patient will be permanently removed from Cloud Firestore."
            confirmLabel="Delete Telemetry Records"
            onConfirm={() => showToast('Telemetry Records Purged', 'All 48kHz audio recordings and pitch glide logs were permanently removed from Cloud Firestore.', 'error')}
          />
        </Card>
      </section>

      {/* Floating Design System Toast Notification Layer */}
      {toastState && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in-50 max-w-md">
          <Toast
            title={toastState.title}
            description={toastState.description}
            type={toastState.type}
            onClose={() => setToastState(null)}
          />
        </div>
      )}
    </div>
  );
};

