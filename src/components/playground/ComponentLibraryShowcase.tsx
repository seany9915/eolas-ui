import * as React from 'react';
import { cn } from '@/lib/utils';
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
import { ThinkingOrb, type OrbState } from '@/components/ui/thinking-orb';
import { BotAvatar, botAvatarTypes, type BotAvatarType, type BotAvatarState } from '@/components/ui/bot-avatar';
import { Icon } from '@/components/ui/icon';
import { ThinkingTrace } from '@/components/ui/thinking-trace';
import { ApprovalCard } from '@/components/ui/approval-card';
import { ClinicianTip } from '@/components/ui/clinician-tip';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from '@/components/ui/breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Textarea, TextareaField } from '@/components/ui/textarea';
import { Attachment } from '@/components/ui/attachment';
import { EmptyState } from '@/components/ui/empty-state';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from '@/components/ui/carousel';
import { StepWizard } from '@/components/ui/step-wizard';
import { NumberRoll } from '@/components/ui/number-roll';
import { SuccessCheck } from '@/components/ui/success-check';
import { TextSwap } from '@/components/ui/text-swap';
import { ErrorShake } from '@/components/ui/error-shake';
import { ShimmerText } from '@/components/ui/shimmer-text';
import { TextsReveal, TextsRevealLine } from '@/components/ui/texts-reveal';
import { NotificationBadge } from '@/components/ui/notification-badge';

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
  const [searchVal, setSearchVal] = React.useState('Eleanor Vance');

  // AI Components Interactive State
  const [orbState, setOrbState] = React.useState<OrbState>('searching');
  const [orbSize, setOrbSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [botType, setBotType] = React.useState<BotAvatarType>('clover');
  const [botState, setBotState] = React.useState<BotAvatarState>('default');
  const [botTone, setBotTone] = React.useState<'friendly' | 'calm'>('calm');
  const [showBotDisclaimer, setShowBotDisclaimer] = React.useState(true);

  // New Primitives Interactive State
  const [approvalOption, setApprovalOption] = React.useState('opt-1');
  const [approvalCustomInput, setApprovalCustomInput] = React.useState('');
  const [approvalStepCurrent, setApprovalStepCurrent] = React.useState(2);
  const [currentPage, setCurrentPage] = React.useState(2);
  const [wizardStep, setWizardStep] = React.useState(0);
  const [liveAccuracy, setLiveAccuracy] = React.useState(92.4);
  const [successTrigger, setSuccessTrigger] = React.useState(1);
  const [swapState, setSwapState] = React.useState(false);
  const [shakeTrigger, setShakeTrigger] = React.useState(0);
  const [badgeCount, setBadgeCount] = React.useState(3);
  const [clinicalNotes, setClinicalNotes] = React.useState('Patient demonstrates clear vocal onset with reduced glottal attack across all sustained vowel repetitions.');

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
        <div className="rounded-lg bg-surface border-none shadow-ambient overflow-x-auto p-6 space-y-6">
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
                    <span className="text-xs text-on-surface-variant italic">(Filled Only for Contrast)</span>
                  </div>
                </td>
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-2">
                    <Button colorRole="tertiary">Milestone Highlight</Button>
                    <span className="text-xs text-on-surface-variant italic">(Filled Only for Contrast)</span>
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
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              leadingIcon={<span className="material-symbols-outlined text-lg" aria-hidden="true">search</span>}
              clearable
              onClear={() => setSearchVal('')}
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
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                44px Hit Target Verified
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Base UI RadioGroup & Radio (Active: <code className="text-primary font-bold">{radioVal}</code>)
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
                    mandatory
                    ariaLabel="View mode"
                    items={[
                      { value: 'grid', label: 'Grid', icon: 'grid_view' },
                      { value: 'list', label: 'List', icon: 'format_list_bulleted' },
                    ]}
                  />
                </div>
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Toggle: 2-state button (aria-pressed). ToggleGroup: In-place mode switch.
              </span>
            </div>
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
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant shrink-0">
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
              <Card variant="default" className="h-full">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label text-xs uppercase font-bold text-secondary tracking-wider">
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
                  <span className="font-label text-xs text-on-surface-variant/80 block pt-3 border-t border-outline-variant/40 mt-4">
                    Slider coordinate calculations invert automatically in RTL mode.
                  </span>
                </div>
              </Card>
            </div>
          </DirectionProvider>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <NumberField
                label="Repetition Count"
                description="Clinical trials target range: 1–20 reps"
                value={numVal ?? 4}
                onValueChange={setNumVal}
                min={1}
                max={20}
                step={1}
              />
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <OTPField
                label="Security Verification Code"
                length={4}
                onComplete={(code) => showToast('Passcode Verified', `Verified security passcode: ${code}`, 'success')}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Dropdowns & Menus */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">5. Menus, Selects & Popovers (Base UI Primitives)</h3>
          <p className="font-sans text-sm text-on-surface-variant">
            Menu: Single-button action dropdown (role="menu"). Select: Form value picker (role="combobox"). Popover: Rich floating non-modal content.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-lg bg-surface border-none shadow-ambient items-end">
          <Select
            label="Cadence Frequency Select"
            value={selectVal ?? ''}
            onValueChange={setSelectVal}
            groups={[
              {
                label: 'Active Rehabilitation',
                options: [
                  { value: 'daily', label: 'Daily Session (Intensive)' },
                  { value: 'triweekly', label: '3x Weekly Protocol' },
                  { value: 'weekly', label: 'Weekly Clinical Review' },
                ],
              },
              {
                label: 'Long-term Monitoring',
                options: [
                  { value: 'biweekly', label: 'Bi-Weekly Follow-up' },
                  { value: 'monthly', label: 'Monthly Milestone' },
                  { value: 'quarterly', label: 'Quarterly Evaluation' },
                ],
              },
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
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
            </div>
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
              <div className="p-4 rounded bg-surface-container border border-outline-variant">
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
            className="h-full cursor-pointer"
          >
            <div className="p-5 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-primary block mb-1">Selectable (Tab to Focus)</span>
                <h4 className="font-heading text-base font-bold mb-1">Active Selection Card</h4>
                <p className="font-sans text-xs text-on-surface-variant">
                  Displays a 2px offset focus ring when focused, and a flush 2px border with soft wash when selected.
                </p>
              </div>
              <div className="border-t border-outline-variant/60 pt-2 text-xs font-label text-primary font-semibold flex items-center justify-between">
                <span>{selectedCard === 'card-1' ? 'Selected' : 'Press Space to Select'}</span>
                {selectedCard === 'card-1' && (
                  <span className="material-symbols-outlined text-base text-primary" aria-hidden="true">check_circle</span>
                )}
              </div>
            </div>
          </Card>

          <Card variant="accent" colorRole="secondary" className="h-full">
            <div className="p-5 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-secondary block mb-1">Accent Border (Secondary Emerald)</span>
                <h4 className="font-heading text-base font-bold text-secondary mb-1">Accent Card</h4>
                <p className="font-sans text-xs text-on-surface-variant">2px solid Rich Emerald border for therapy guide categories.</p>
              </div>
              <div className="border-t border-outline-variant/60 pt-2 text-xs font-label text-secondary font-semibold">
                Category Highlight
              </div>
            </div>
          </Card>
        </div>

        {/* Inverted Cards (Charcoal Container) Matrix */}
        <div className="pt-2">
          <span className="font-label text-xs font-bold text-on-surface-variant block mb-3">
            Inverted Card (<code className="text-primary font-bold">variant="inverted"</code>) — Charcoal Inverted Fill Accent Matrix
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="inverted" invertedAccent="tertiary" className="h-full">
              <div className="p-5 h-full flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-label text-xs font-bold text-tertiary block mb-1">Inverted (Amber Title + White Body)</span>
                  <h4 className="font-heading text-base font-bold text-tertiary mb-1">Strategy Tip Callout</h4>
                  <p className="font-sans text-xs font-medium text-surface">Sunny Amber title (8.55:1 AAA) with pure white body copy (15.3:1 AAA) to prevent chromatic glare.</p>
                </div>
                <div className="border-t border-surface/20 pt-2 text-xs font-label text-tertiary font-semibold">
                  Strategy & Guidance Callout
                </div>
              </div>
            </Card>

            <Card variant="inverted" invertedAccent="neutral" className="h-full">
              <div className="p-5 h-full flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-label text-xs font-bold text-surface block mb-1">Inverted (Pure White Neutral)</span>
                  <h4 className="font-heading text-base font-bold text-surface mb-1">Monochrome Inverted Card</h4>
                  <p className="font-sans text-xs font-medium text-surface">Pure white title and body copy on charcoal for high-contrast announcements (15.3:1 AAA).</p>
                </div>
                <div className="border-t border-surface/20 pt-2 text-xs font-label text-surface font-semibold">
                  High-Contrast Announcement
                </div>
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
            <Card variant="filled" colorRole="primary" className="h-full">
              <div className="p-5 h-full flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-label text-xs font-bold text-on-primary block mb-1">Highlight (Primary Blue)</span>
                  <h4 className="font-heading text-base font-bold text-on-primary mb-1">Primary Highlight Card</h4>
                  <p className="font-sans text-xs font-medium text-on-primary">Solid Electric Blue fill paired with 100% pure white text (<code>on-primary</code>, 4.6:1 AA pass).</p>
                </div>
                <div className="border-t border-on-primary/30 pt-2 text-xs font-label text-on-primary font-semibold">
                  Brand Core Fill
                </div>
              </div>
            </Card>

            <Card variant="filled" colorRole="secondary" className="h-full">
              <div className="p-5 h-full flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-label text-xs font-bold text-on-secondary block mb-1">Highlight (Secondary Emerald)</span>
                  <h4 className="font-heading text-base font-bold text-on-secondary mb-1">Secondary Highlight Card</h4>
                  <p className="font-sans text-xs font-medium text-on-secondary">Solid Rich Emerald fill paired with 100% pure white text (<code>on-secondary</code>, 4.6:1 AA pass).</p>
                </div>
                <div className="border-t border-on-secondary/30 pt-2 text-xs font-label text-on-secondary font-semibold">
                  Knowledge & Guidance Fill
                </div>
              </div>
            </Card>

            <Card variant="filled" colorRole="tertiary" className="h-full">
              <div className="p-5 h-full flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-label text-xs font-bold text-on-tertiary block mb-1">Highlight (Tertiary Amber)</span>
                  <h4 className="font-heading text-base font-bold text-on-tertiary mb-1">Tertiary Highlight Card</h4>
                  <p className="font-sans text-xs font-medium text-on-tertiary">Solid Sunny Amber fill paired with 100% dark charcoal text (<code>on-tertiary</code>, 10.7:1 AAA pass).</p>
                </div>
                <div className="border-t border-on-tertiary/30 pt-2 text-xs font-label text-on-tertiary font-semibold">
                  Celebratory Highlight Fill
                </div>
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

        <div className="rounded-lg bg-surface border border-outline-variant overflow-x-auto p-6">
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
                <td className="py-4 px-4"><Chip label="Phonetics" pattern="outline" colorRole="primary" icon="record_voice_over" /></td>
                <td className="py-4 pl-4"><Chip label="Metadata Tag" pattern="neutral-fill-accent-text" colorRole="primary" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-secondary">Secondary</td>
                <td className="py-4 px-4"><Chip label="Guide Solid" pattern="high-contrast-mixed" colorRole="secondary" icon="lightbulb" /></td>
                <td className="py-4 px-4"><Chip label="Guide Tip" pattern="outline" colorRole="secondary" icon="lightbulb" /></td>
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
                <td className="py-4 px-4"><Chip label="Verified Outline" pattern="outline" colorRole="success" icon="check" /></td>
                <td className="py-4 pl-4"><Chip label="Success Tag" pattern="neutral-fill-accent-text" colorRole="success" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-error">Error</td>
                <td className="py-4 px-4"><Chip label="Session Failed" pattern="high-contrast-mixed" colorRole="error" icon="error" /></td>
                <td className="py-4 px-4"><Chip label="Failed Outline" pattern="outline" colorRole="error" icon="error" /></td>
                <td className="py-4 pl-4"><Chip label="Error Tag" pattern="neutral-fill-accent-text" colorRole="error" /></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-label text-xs font-bold text-warning">Warning</td>
                <td className="py-4 px-4"><Chip label="Caution" pattern="high-contrast-mixed" colorRole="warning" icon="warning" /></td>
                <td className="py-4 px-4"><Chip label="Caution Outline" pattern="outline" colorRole="warning" icon="warning" /></td>
                <td className="py-4 pl-4"><Chip label="Warning Tag" pattern="neutral-fill-accent-text" colorRole="warning" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Accordion & Tabs */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">9. Accordions & Tabs (Base UI Primitives)</h3>
          <p className="font-sans text-sm text-on-surface-variant">
            Tabs: Mutually exclusive in-page views/panels (role="tablist"). Accordion: Vertically stacked expandable disclosure panels.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-heading text-base font-bold mb-4">Accordion (Level 1 Layout)</h4>
                <Accordion
                  items={[
                    { id: '1', title: 'What is the 3-level containment model?', content: 'Every screen uses Level 1 (Canvas), Level 2 (Grouped Fill), and Level 3 (Surface/Card) in strict decision order to reduce visual noise.' },
                    { id: '2', title: 'Why is Base UI the primitive foundation?', content: 'Base UI ships as unstyled, accessible primitives with superior maintenance velocity and tree-shakable architecture.' },
                  ]}
                />
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Accessible WAI-ARIA Accordion
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-heading text-base font-bold mb-2">Tabs Component</h4>
                <Tabs
                  items={[
                    { id: 't1', label: 'Vocal Warmups', icon: 'graphic_eq', content: <p className="text-xs text-on-surface-variant">Sustained vowel exercises designed to stabilize vocal fold vibration.</p> },
                    { id: 't2', label: 'Fluency Drills', icon: 'speed', content: <p className="text-xs text-on-surface-variant">Rhythmic syllable pacing exercises to improve articulation smooth flow.</p> },
                  ]}
                />
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Keyboard Tablist Navigation
              </span>
            </div>
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
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Animated Shimmer Loading
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
                Avatars (surface-variant fallback)
              </h4>
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex flex-col items-center gap-1">
                  <Avatar fallback="ED" size="sm" />
                  <span className="text-xs font-mono text-on-surface-variant">SM (32px)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar fallback="TA" size="md" />
                  <span className="text-xs font-mono text-on-surface-variant">MD (40px)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar fallback="FP" size="lg" />
                  <span className="text-xs font-mono text-on-surface-variant">LG (48px)</span>
                </div>
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                High Contrast Initials
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
                Tooltip & Toast
              </h4>
              <div className="flex flex-col gap-3">
                <Tooltip content="Provides instant clinical assessment feedback">
                  <Button variant="outlined" colorRole="primary" size="sm" className="w-full">Hover for Tooltip</Button>
                </Tooltip>
                <Toast title="Session Saved" description="Therapy drill results persisted to Cloud Firestore." type="success" />
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Non-Disruptive Notifications
              </span>
            </div>
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
                    pattern={row.status === 'Completed' ? 'high-contrast-mixed' : 'outline'}
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

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Semantic Form Section</span>
                <h4 className="font-heading text-base font-bold text-on-surface">Fieldset & Legend Architecture</h4>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Base UI <code className="text-primary font-mono">Fieldset</code> provides standard WAI-ARIA group binding, associating legend titles and description text directly with enclosed input controls.
                </p>
              </div>
              <div className="p-3 rounded bg-surface-container border border-outline-variant/60 font-mono text-xs text-on-surface-variant">
                Selected: {JSON.stringify(checkboxGroupVal)}
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-surface border-none shadow-ambient">
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
          <p className="font-sans text-sm text-on-surface-variant">
            Menubar: Desktop app command bar. ContextMenu: Secondary right-click contextual menu. NavigationMenu: Site/app routing hierarchy (&lt;nav&gt;).
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
              <div className="p-6 rounded-md bg-surface-container border border-dashed border-outline-variant flex flex-col items-center justify-center text-center cursor-context-menu hover:bg-surface-variant/50 transition-colors h-36">
                <span className="text-primary mb-2">
                  <Icon name="mouse" size="xl" />
                </span>
                <span className="font-label text-sm font-bold text-on-surface">Right-Click Anywhere Here</span>
                <span className="font-sans text-sm text-on-surface-variant mt-1">Triggers Base UI `ContextMenu` popup</span>
              </div>
            </ContextMenu>

            <Card variant="default" className="h-full">
              <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
                <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                  Accessible Header Navigation Bar with 2px Primary Active Underline & Submenus
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 15. Utility & Gauge Primitives */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">15. Utility, Scalar Gauge & Layout Primitives (Toolbar, Meter, PreviewCard, Collapsible, ScrollArea, Separator)</h3>
          <p className="font-sans text-sm text-on-surface-variant">
            Toolbar: Persistent action strip with single tab-stop arrow navigation (role="toolbar"). Meter: Scalar measurement gauge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
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
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Rich Context Popovers
              </span>
            </div>
          </Card>

          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <h4 className="font-label text-xs font-bold text-on-surface-variant border-b border-outline-variant/60 pb-2">
                Collapsible & Custom ScrollArea
              </h4>
              <div className="space-y-3">
                <Collapsible title="View Clinical Guidelines">
                  Keep room noise level under 35dB. Maintain 12-inch distance from unidirectional condenser microphone.
                </Collapsible>
                <div className="rounded-md bg-surface-container/40 p-3">
                  <ScrollArea maxHeight="120px">
                    <div className="space-y-2 text-sm font-sans text-on-surface-variant">
                      <p><strong className="text-on-surface">Log 1:</strong> Audio calibrated at 48kHz.</p>
                      <p><strong className="text-on-surface">Log 2:</strong> Vowel duration test passed (14.2s sustain).</p>
                      <p><strong className="text-on-surface">Log 3:</strong> Pitch stability variance &lt; 2.1 Hz.</p>
                      <p><strong className="text-on-surface">Log 4:</strong> Session metrics saved to storage.</p>
                      <p><strong className="text-on-surface">Log 5:</strong> Articulation accuracy evaluated at 96%.</p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Custom Scrollbars & Panels
              </span>
            </div>
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
        <Card variant="default" className="w-full">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
          </div>
        </Card>
      </section>

      {/* 17. AI Activity Indicators & Paediatric Characters */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">17. AI Activity Indicators & Paediatric Avatars</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Lightweight 2D canvas primitives for managing perceived latency in clinical AI workflows and delivering approachable, tone-safe paediatric interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thinking Orbs Panel */}
          <div className="rounded-lg bg-surface border border-outline-variant p-6 space-y-5">
            <div>
              <h4 className="font-heading text-base font-bold text-on-surface">Thinking Orb (AI Agent State)</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Visualizes distinct agentic phases with zero runtime dependencies. Paired with visible text and a live region to comply with WCAG 1.4.1 (color is never the only cue).
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Select
                label="State"
                value={orbState}
                onValueChange={(val) => setOrbState(val as OrbState)}
                options={[
                  { value: 'working', label: 'working' },
                  { value: 'searching', label: 'searching' },
                  { value: 'solving', label: 'solving' },
                  { value: 'listening', label: 'listening' },
                  { value: 'connecting', label: 'connecting' },
                  { value: 'weaving', label: 'weaving' },
                  { value: 'composing', label: 'composing' },
                  { value: 'breathing', label: 'breathing' },
                  { value: 'shaping', label: 'shaping' },
                ]}
              />

              <Select
                label="Size"
                value={orbSize}
                onValueChange={(val) => setOrbSize(val as 'sm' | 'md' | 'lg')}
                options={[
                  { value: 'sm', label: 'sm (20px inline)' },
                  { value: 'md', label: 'md (32px badge)' },
                  { value: 'lg', label: 'lg (64px hero)' },
                ]}
              />
            </div>

            {/* Interactive Preview Canvas */}
            <div className="rounded-lg bg-surface-container p-6 flex flex-col items-center justify-center min-h-35 border border-outline-variant/60">
              <ThinkingOrb
                state={orbState}
                size={orbSize}
                label={
                  <span className="font-sans text-sm font-medium text-on-surface">
                    {orbState === 'searching' && 'Searching national clinical guidelines...'}
                    {orbState === 'solving' && 'Calculating paediatric dosage recommendation...'}
                    {orbState === 'working' && 'Processing clinical telemetry data...'}
                    {orbState === 'listening' && 'Listening for speech articulation...'}
                    {orbState === 'connecting' && 'Connecting to electronic health record...'}
                    {orbState === 'weaving' && 'Synthesising consultation notes...'}
                    {orbState === 'composing' && 'Drafting care summary letter...'}
                    {orbState === 'breathing' && 'System standby — ready for prompt'}
                    {orbState === 'shaping' && 'Formatting output tables...'}
                  </span>
                }
              />
            </div>

            <div className="text-xs font-sans text-on-surface-variant bg-surface-variant/40 p-2.5 rounded-md border border-outline-variant/50">
              <strong className="text-on-surface font-semibold">Accessibility Guarantee:</strong> An <code className="font-mono text-primary">aria-live="polite"</code> announcement updates automatically when state transitions occur.
            </div>
          </div>

          {/* Paediatric Bot Avatar Panel */}
          <div className="rounded-lg bg-surface border border-outline-variant p-6 space-y-5">
            <div>
              <h4 className="font-heading text-base font-bold text-on-surface">Paediatric Bot Avatar</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Animated character companion for child-facing consultations. Enforces mandatory calm mode safeguards during acute clinical triage.
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <Select
                label="Character"
                value={botType}
                onValueChange={(val) => setBotType(val as BotAvatarType)}
                options={botAvatarTypes.map((type) => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                }))}
              />

              <Select
                label="Activity"
                value={botState}
                onValueChange={(val) => setBotState(val as BotAvatarState)}
                options={[
                  { value: 'default', label: 'Default (Idle)' },
                  { value: 'working', label: 'Working (Active)' },
                  { value: 'sleeping', label: 'Sleeping' },
                ]}
              />

              <Select
                label="Tone Mode"
                value={botTone}
                onValueChange={(val) => setBotTone(val as 'friendly' | 'calm')}
                options={[
                  { value: 'calm', label: 'Calm (Clinical safe)' },
                  { value: 'friendly', label: 'Friendly (Playful)' },
                ]}
              />
            </div>

            {/* Interactive Preview Canvas */}
            <div className="rounded-lg bg-surface-container p-6 flex flex-col items-center justify-center min-h-35 border border-outline-variant/60">
              <BotAvatar
                type={botType}
                state={botState}
                tone={botTone}
                size="lg"
                showDisclaimerBadge={showBotDisclaimer}
                disclaimerText="Paediatric AI Assistant"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-on-surface-variant bg-surface-variant/40 p-2.5 rounded-md border border-outline-variant/50">
              <span>
                <strong className="text-on-surface font-semibold">
                  {botTone === 'calm' ? 'Calm Mode Active:' : 'Friendly Mode Active:'}
                </strong>{' '}
                {botTone === 'calm'
                  ? 'Spontaneous flips/hops disabled, speed halved to prevent affect mismatch during distress.'
                  : 'Full playful animations enabled for positive reinforcement and casual check-ins.'}
              </span>
              <div className="ml-2 shrink-0">
                <Checkbox
                  checked={showBotDisclaimer}
                  onCheckedChange={(c) => setShowBotDisclaimer(!!c)}
                  label={<span className="font-label text-xs">Disclaimer badge</span>}
                  compact
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complete Bot Archetypes & Thinking Orb States Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All 18 Bot Avatars Gallery */}
          <div className="rounded-lg bg-surface border border-outline-variant p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-base font-bold text-on-surface">All 18 Bot Avatar Archetypes</h4>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  Complete catalogue of 18 3D geometric shapes with living eyes and interactive hover glances.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-primary">
                18 archetypes
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
              {botAvatarTypes.map((arch) => (
                <button
                  key={arch}
                  type="button"
                  onClick={() => setBotType(arch)}
                  className={cn(
                    'flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer text-center group min-h-24',
                    botType === arch
                      ? 'border-primary bg-primary/5 shadow-ambient ring-2 ring-primary/20'
                      : 'border-outline-variant/60 bg-surface hover:bg-surface-container/60 hover:border-outline-variant'
                  )}
                  aria-label={`Select ${arch} avatar archetype`}
                >
                  <BotAvatar
                    type={arch}
                    state={botType === arch ? botState : 'default'}
                    tone={botTone}
                    size="sm"
                    interactive={false}
                  />
                  <span className={cn(
                    'font-mono text-xs mt-1.5 capitalize transition-colors',
                    botType === arch ? 'font-bold text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                  )}>
                    {arch}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* All Thinking Orb States Gallery */}
          <div className="rounded-lg bg-surface border border-outline-variant p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading text-base font-bold text-on-surface">All Thinking Orb States & Phases</h4>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  Agentic activity states with distinct motion signatures, visible text labels, and ARIA live regions.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-primary">
                9 states
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {(
                [
                  { state: 'working', label: 'Working' },
                  { state: 'searching', label: 'Searching' },
                  { state: 'solving', label: 'Solving' },
                  { state: 'listening', label: 'Listening' },
                  { state: 'connecting', label: 'Connecting' },
                  { state: 'weaving', label: 'Weaving' },
                  { state: 'composing', label: 'Composing' },
                  { state: 'breathing', label: 'Breathing' },
                  { state: 'shaping', label: 'Shaping' },
                ] as const
              ).map((item) => (
                <button
                  key={item.state}
                  type="button"
                  onClick={() => setOrbState(item.state)}
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer min-h-13',
                    orbState === item.state
                      ? 'border-primary bg-primary/5 shadow-ambient ring-2 ring-primary/20'
                      : 'border-outline-variant/60 bg-surface hover:bg-surface-container/60 hover:border-outline-variant'
                  )}
                  aria-label={`Select ${item.label} orb state`}
                >
                  <ThinkingOrb state={item.state} size="sm" className="shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className={cn(
                      'font-sans text-xs capitalize',
                      orbState === item.state ? 'font-bold text-primary' : 'font-medium text-on-surface'
                    )}>
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant/70 truncate">
                      {item.state}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 18. AI Agent Workflows & Clinical Decision Support */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">18. AI Agent Workflows & Clinical Guidance (ThinkingTrace, ApprovalCard, ClinicianTip)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Multi-step reasoning disclosure panels, human-in-the-loop decision approval cards, and dual-variant clinical tips (unboxed inside cards, inset with wash).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ThinkingTrace & ClinicianTip */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface">ThinkingTrace (Reasoning Audit Trail)</h4>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    Collapsible agent reasoning disclosure with step-by-step progress duration and elapsed timing.
                  </p>
                </div>

                <ThinkingTrace
                  title="Clinical reasoning & EHR cross-reference"
                  elapsedTime="1.8s"
                  defaultOpen={true}
                  steps={[
                    { id: 's1', label: 'EHR baseline retrieved (NHS No. 948 201 4920)', duration: '0.4s', isComplete: true },
                    { id: 's2', label: 'Acoustic pitch jitter evaluated against clinical normative bands', duration: '0.9s', isComplete: true },
                    { id: 's3', label: 'Synthesising next-stage consonant cluster recommendation', duration: '0.5s', icon: 'pending', isComplete: false },
                  ]}
                >
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Patient completed 5 sustained vowel repetitions with 92% pitch stability. Harmonic jitter fell below the 1.8% pathology threshold. Model recommends advancing to plosive consonants /b/ and /p/.
                  </p>
                </ThinkingTrace>

                {/* ClinicianTip Showcase (Dual Variants) */}
                <div className="pt-4 border-t border-outline-variant/60 space-y-3">
                  <span className="font-label text-xs font-bold text-on-surface-variant block">
                    ClinicianTip Primitives (Dual Presentation Variants)
                  </span>
                  
                  {/* Inset Variant */}
                  <ClinicianTip variant="inset" icon="lightbulb" label="Acoustic cue">
                    Verify background ambient noise remains below 35dB before initiating 48kHz frequency calibration.
                  </ClinicianTip>

                  {/* Unboxed Variant */}
                  <div className="p-4 rounded bg-surface border border-outline-variant">
                    <span className="font-label text-xs font-semibold text-primary block mb-1">Inside Exercise Drill:</span>
                    <ClinicianTip variant="unboxed" icon="info" label="Diaphragmatic tip">
                      Encourage slow diaphragmatic inhalation before beginning sustained vowel phonation.
                    </ClinicianTip>
                  </div>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                WCAG 2.2 compliant agentic reasoning trails and clinical cueing
              </span>
            </div>
          </Card>

          {/* ApprovalCard */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">
                  Human-in-the-Loop Governance
                </span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-4">
                  ApprovalCard (Clinical Decision Checkpoint)
                </h4>

                <ApprovalCard
                  title="Confirm Recommended Articulation Plan"
                  description="The clinical AI evaluated Arthur's vocal stability at 92%. Review the automated recommendation before advancing."
                  options={[
                    {
                      id: 'opt-1',
                      label: 'Advance to Consonant Clusters (/st/, /br/)',
                      description: 'Recommended next clinical tier based on acoustic stability',
                    },
                    {
                      id: 'opt-2',
                      label: 'Repeat Sustained Vowel Drills (Stabilization)',
                      description: 'Consolidate baseline performance for 3 additional sessions',
                    },
                    {
                      id: 'opt-3',
                      label: 'Defer to Weekly Clinic Consultation',
                      description: 'Hold current plan pending direct therapist consultation',
                    },
                  ]}
                  selectedOptionId={approvalOption}
                  onSelectOption={setApprovalOption}
                  allowCustomInput={true}
                  customInputValue={approvalCustomInput}
                  onCustomInputChange={setApprovalCustomInput}
                  stepCurrent={approvalStepCurrent}
                  stepTotal={4}
                  onPreviousStep={() => setApprovalStepCurrent((s) => Math.max(1, s - 1))}
                  onNextStep={() => setApprovalStepCurrent((s) => Math.min(4, s + 1))}
                  onConfirm={() => showToast('Plan Confirmed', 'Advancement to consonant clusters persisted to patient record.', 'success')}
                  onSkip={() => showToast('Step Skipped', 'Patient maintained on current practice schedule.', 'info')}
                />
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Radio selection, optional custom textarea override, and stepped navigation
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 19. Navigation, Pagination & Resizable Layouts */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">19. Navigation, Pagination & Resizable Panes (Breadcrumb, Pagination, Resizable)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Accessible site breadcrumbs, keyboard-navigable pagination bars, and smooth draggable split-pane layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breadcrumb & Pagination */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface">Breadcrumb Navigation</h4>
                  <p className="font-sans text-xs text-on-surface-variant mt-1 mb-3">
                    Semantic <code className="font-mono text-primary">&lt;nav aria-label="Breadcrumb"&gt;</code> hierarchy with separators, interactive ellipsis dropdown, and active leaf page.
                  </p>
                  <div className="py-2">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#patients">Patients</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <Menu
                            fullWidth={false}
                            trigger={
                              <BreadcrumbEllipsis />
                            }
                            items={[
                              {
                                id: 'p-dent',
                                label: 'Arthur Dent (Profile)',
                                icon: 'person',
                                onClick: () => showToast('Navigated', 'Opening Arthur Dent profile', 'info'),
                              },
                              {
                                id: 'p-charts',
                                label: 'Clinical Telemetry Charts',
                                icon: 'analytics',
                                onClick: () => showToast('Navigated', 'Opening Telemetry Charts', 'info'),
                              },
                              {
                                id: 'p-history',
                                label: 'Historical Assessment Log',
                                icon: 'history',
                                onClick: () => showToast('Navigated', 'Opening Assessment Log', 'info'),
                              },
                            ]}
                          />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#voice">Voice Drills</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Session #14 (Vowel Prolongation)</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface">Pagination Bar</h4>
                  <p className="font-sans text-xs text-on-surface-variant mt-1 mb-3">
                    Accessible pagination control with 44px min touch floors and keyboard navigation.
                  </p>
                  <div className="py-2 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? 'pointer-events-none' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)} className="cursor-pointer">
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive={currentPage === 2} onClick={() => setCurrentPage(2)} className="cursor-pointer">
                            2
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive={currentPage === 3} onClick={() => setCurrentPage(3)} className="cursor-pointer">
                            3
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive={currentPage === 8} onClick={() => setCurrentPage(8)} className="cursor-pointer">
                            8
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(8, p + 1))}
                            aria-disabled={currentPage === 8}
                            className={currentPage === 8 ? 'pointer-events-none' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                  <span className="font-label text-xs text-on-surface-variant text-center block mt-2">
                    Active Page: <strong className="text-primary">{currentPage}</strong> of 8
                  </span>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                WAI-ARIA Breadcrumb & Pagination specifications verified
              </span>
            </div>
          </Card>

          {/* Resizable Split Panes */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-heading text-base font-bold text-on-surface">Resizable Split Panels</h4>
                <p className="font-sans text-xs text-on-surface-variant mt-1 mb-4">
                  Draggable split containers supporting multi-pane clinical inspection (e.g. waveform audio vs clinician notes).
                </p>

                <div className="h-64 rounded-lg overflow-hidden border border-outline-variant">
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="h-full p-4 bg-surface-container flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary"><Icon name="graphic_eq" size="sm" /></span>
                            <span className="font-label text-xs font-bold text-on-surface">Acoustic Waveform</span>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant">
                            Live 48kHz audio stream capture. Sampling pitch variance across 14.2s sustained phonation.
                          </p>
                        </div>
                        <div className="p-2 rounded bg-surface border border-outline-variant/60 font-mono text-xs text-primary">
                          Peak: 224 Hz | Jitter: 0.8%
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={50} minSize={30}>
                      <div className="h-full p-4 bg-surface flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-secondary"><Icon name="clinical_notes" size="sm" /></span>
                            <span className="font-label text-xs font-bold text-on-surface">Clinician Observations</span>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                            Patient maintains upright posture and steady diaphragmatic breathing during trial.
                          </p>
                        </div>
                        <span className="text-xs text-on-surface-variant/70 italic">
                          ← Drag the handle to resize
                        </span>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Smooth handle drag with min/max percentage boundary enforcement
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 20. Content Presentation, Uploads & States */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">20. Content Presentation, Uploads & States (Textarea, Attachment, EmptyState, Carousel)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Full-width clinical textareas, file attachment progress rows, empty milestone fallbacks, and multi-slide carousels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Textarea & Attachment */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <TextareaField
                  label="Consultation Clinical Notes (TextareaField)"
                  description="Detailed qualitative notes recorded during speech practice session"
                  placeholder="Record articulation cues, pitch stabilization observations, and patient feedback..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                />

                <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                  <span className="font-label text-xs font-bold text-on-surface-variant block">
                    Clinical Media Attachments (Attachment Primitive)
                  </span>
                  <div className="space-y-2">
                    <Attachment
                      fileName="vocal_prolongation_48khz.wav"
                      fileType="audio"
                      fileSize="3.4 MB"
                      status="completed"
                      onDownload={() => showToast('Download Started', 'Downloading acoustic audio recording...', 'info')}
                      onRemove={() => showToast('Attachment Removed', 'Audio recording removed from session draft.', 'warning')}
                    />
                    <Attachment
                      fileName="milestone_assessment_report.pdf"
                      fileType="pdf"
                      fileSize="640 KB"
                      status="completed"
                      onDownload={() => showToast('Download Started', 'Downloading clinical PDF report...', 'info')}
                      onRemove={() => showToast('Attachment Removed', 'PDF summary removed from session draft.', 'warning')}
                    />
                    <Attachment
                      fileName="spectrogram_harmonics_scan.png"
                      fileType="image"
                      fileSize="1.9 MB"
                      status="uploading"
                      uploadProgress={68}
                      onRemove={() => showToast('Upload Cancelled', 'Image upload cancelled.', 'warning')}
                    />
                  </div>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Semantic file type indicators, live progress bars, and touch-target action buttons
              </span>
            </div>
          </Card>

          {/* Carousel & EmptyState */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-heading text-base font-bold text-on-surface">
                      Clinical Drill Modules (Carousel)
                    </h4>
                    <span className="font-label text-xs text-on-surface-variant">3 Modules</span>
                  </div>
                  <div className="px-5 py-2 relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        <CarouselItem>
                          <div className="p-5 rounded-lg bg-surface-container border border-outline-variant/60 flex flex-col justify-between h-36">
                            <div>
                              <span className="font-label text-xs font-bold text-primary">Module 01</span>
                              <h5 className="font-heading text-sm font-bold text-on-surface">Vowel Prolongation (/a/, /i/, /u/)</h5>
                              <p className="font-sans text-xs text-on-surface-variant mt-1">Sustained steady phonation to evaluate vocal fold vibration stability.</p>
                            </div>
                            <span className="text-xs font-medium text-success">Target: 12.0s sustain</span>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <div className="p-5 rounded-lg bg-surface-container border border-outline-variant/60 flex flex-col justify-between h-36">
                            <div>
                              <span className="font-label text-xs font-bold text-secondary">Module 02</span>
                              <h5 className="font-heading text-sm font-bold text-on-surface">Pitch Glide Dynamics</h5>
                              <p className="font-sans text-xs text-on-surface-variant mt-1">Smooth low-to-high frequency transitions to expand dynamic vocal range.</p>
                            </div>
                            <span className="text-xs font-medium text-primary">Target: 130–260 Hz range</span>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <div className="p-5 rounded-lg bg-surface-container border border-outline-variant/60 flex flex-col justify-between h-36">
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-xs font-bold bg-tertiary text-on-tertiary">Module 03</span>
                              <h5 className="font-heading text-sm font-bold text-on-surface mt-0.5">Plosive Consonant Articulation</h5>
                              <p className="font-sans text-xs text-on-surface-variant mt-1">Rapid intraoral pressure release drills (/b/, /p/, /t/, /d/).</p>
                            </div>
                            <span className="text-xs font-medium text-secondary">Target: 90% acoustic accuracy</span>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                      <div className="mt-3 flex justify-center">
                        <CarouselDots />
                      </div>
                    </Carousel>
                  </div>
                </div>

                <div className="border-t border-outline-variant/40 pt-4">
                  <h4 className="font-heading text-base font-bold text-on-surface mb-2">
                    Empty State Fallback (EmptyState)
                  </h4>
                  <EmptyState
                    icon="mic_off"
                    title="No Recorded Voice Sessions"
                    description="Arthur has not recorded any practice sessions for this milestone yet. Start the first drill to begin telemetry capture."
                    action={
                      <Button
                        colorRole="primary"
                        size="sm"
                        onClick={() => showToast('Session Initialized', 'Microphone calibrated. Starting vowel drill...', 'info')}
                      >
                        Start First Drill
                      </Button>
                    }
                  />
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Accessible carousel with slide indicators and balance-wrapped empty states
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 21. Interactive Polish & Motion Micro-Interactions */}
      <section className="space-y-4">
        <div className="border-b border-outline-variant pb-2">
          <h3 className="font-heading text-xl font-bold text-on-surface">21. Interactive Polish & Motion Micro-Interactions (Motion Primitives Suite)</h3>
          <p className="font-sans text-xs text-on-surface-variant">
            Transitions.dev inspired micro-motion: tabular number counters, celebratory success checks, in-place text swaps, validation shakes, ambient shimmers, staggered reveals, and notification badges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* StepWizard */}
          <Card variant="default" className="h-full md:col-span-2 lg:col-span-1">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Guided Flow</span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-3">StepWizard</h4>
                
                <StepWizard
                  variant="embedded"
                  currentStepIndex={wizardStep}
                  onStepChange={setWizardStep}
                  onComplete={() => showToast('Onboarding Completed', 'Clinical baseline telemetry setup finished.', 'success')}
                  steps={[
                    {
                      id: 'step-1',
                      title: 'Microphone Check',
                      description: 'Calibrate input level',
                      content: (
                        <div className="space-y-2 py-2">
                          <p className="text-xs text-on-surface-variant">Testing ambient audio floor. Speak at normal conversation volume.</p>
                          <div className="p-2 rounded bg-surface-container font-mono text-xs text-success">
                            Calibrated: 48kHz / 24-bit PCM
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: 'step-2',
                      title: 'Pitch Baseline',
                      description: 'Sustain comfortable tone',
                      content: (
                        <div className="space-y-2 py-2">
                          <p className="text-xs text-on-surface-variant">Produce an uninterrupted /a/ sound for 5 seconds.</p>
                          <div className="p-2 rounded bg-surface-container font-mono text-xs text-primary">
                            Fundamental: 182.4 Hz
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: 'step-3',
                      title: 'Confirmation',
                      description: 'Review clinical setup',
                      content: (
                        <div className="space-y-2 py-2">
                          <p className="text-xs text-on-surface-variant">Ready to launch patient exercise plan. Telemetry will sync automatically.</p>
                          <div className="p-2 rounded bg-surface-container font-mono text-xs text-secondary">
                            Profile: Ready for Clinical Use
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Directional slide transitions with keyboard controls
              </span>
            </div>
          </Card>

          {/* NumberRoll & SuccessCheck */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Metrics & Feedback</span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-3">NumberRoll & SuccessCheck</h4>
                
                <div className="p-6 rounded-lg bg-surface-container border border-outline-variant/60 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="flex items-center gap-3">
                    <SuccessCheck trigger={successTrigger} size="md" />
                    <div className="font-heading text-3xl font-bold text-on-surface">
                      <NumberRoll value={liveAccuracy} decimals={1} suffix="%" />
                    </div>
                  </div>
                  <span className="font-sans text-xs text-on-surface-variant">
                    Accuracy Score (Smooth tabular vertical roll with micro-blur)
                  </span>
                  <Button
                    size="sm"
                    variant="outlined"
                    colorRole="primary"
                    onClick={() => {
                      setLiveAccuracy((prev) => (prev > 90 ? 84.6 : 95.8));
                      setSuccessTrigger((s) => s + 1);
                    }}
                  >
                    Simulate Score Update
                  </Button>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Emil Kowalski style tabular number animation & celebratory stroke draw
              </span>
            </div>
          </Card>

          {/* TextSwap & ErrorShake */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Interactive Triggers</span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-3">TextSwap & ErrorShake</h4>
                
                <div className="space-y-4">
                  {/* TextSwap button */}
                  <div>
                    <span className="font-label text-xs text-on-surface-variant block mb-1.5">In-Place TextSwap:</span>
                    <Button
                      colorRole="primary"
                      className="w-full"
                      onClick={() => setSwapState((s) => !s)}
                    >
                      <TextSwap>
                        {swapState ? 'Saved to Patient Record ✓' : 'Save Session Changes'}
                      </TextSwap>
                    </Button>
                  </div>

                  {/* ErrorShake field */}
                  <div className="pt-2 border-t border-outline-variant/40">
                    <span className="font-label text-xs text-on-surface-variant block mb-1.5">Validation ErrorShake:</span>
                    <ErrorShake shake={shakeTrigger}>
                      <FormField
                        label="Security Passcode"
                        placeholder="6-digit code"
                        error={shakeTrigger > 0 ? 'Invalid clinical passcode' : undefined}
                      />
                    </ErrorShake>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        colorRole="error"
                        className="w-full"
                        onClick={() => setShakeTrigger((s) => s + 1)}
                      >
                        Trigger Error Shake
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Layout-stable text rise and 6px non-jarring horizontal shake
              </span>
            </div>
          </Card>

          {/* ShimmerText & TextsReveal */}
          <Card variant="default" className="h-full">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Streaming Indicators</span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-3">ShimmerText & TextsReveal</h4>
                
                <div className="space-y-4">
                  <div className="p-4 rounded bg-surface-container border border-outline-variant/60">
                    <span className="font-label text-xs font-semibold text-primary block mb-1">Live AI Phonation Stream:</span>
                    <div className="text-xs leading-relaxed">
                      <ShimmerText variant="primary">
                        Streaming acoustic telemetry... evaluating vocal tract harmonic ratios in real-time.
                      </ShimmerText>
                    </div>
                  </div>

                  <div className="p-4 rounded bg-surface-container border border-outline-variant/60">
                    <span className="font-label text-xs font-semibold text-secondary block mb-1">Staggered Sequence Reveal:</span>
                    <div className="space-y-1">
                      <TextsReveal show={true}>
                        <TextsRevealLine index={0}>
                          <p className="text-xs font-bold text-on-surface">1. Phonation calibration confirmed</p>
                        </TextsRevealLine>
                        <TextsRevealLine index={1}>
                          <p className="text-xs text-on-surface-variant">2. Patient posture stabilized</p>
                        </TextsRevealLine>
                        <TextsRevealLine index={2}>
                          <p className="text-xs text-primary font-semibold">3. Ready for phonation target capture</p>
                        </TextsRevealLine>
                      </TextsReveal>
                    </div>
                  </div>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Ambient gradient sweeps and staggered 40ms line reveals
              </span>
            </div>
          </Card>

          {/* NotificationBadge */}
          <Card variant="default" className="h-full md:col-span-2 lg:col-span-2">
            <div className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label text-xs font-bold text-on-surface-variant block mb-1">Visual Salience</span>
                <h4 className="font-heading text-base font-bold text-on-surface mb-3">NotificationBadge (Counted & Indicator Dots)</h4>
                
                <div className="p-6 rounded-lg bg-surface-container border border-outline-variant/60 space-y-6">
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Primary Counted Badge */}
                    <div className="relative inline-block">
                      <Button colorRole="primary" variant="outlined">
                        Clinical Reviews
                      </Button>
                      <NotificationBadge count={badgeCount} variant="error" srLabel={`${badgeCount} unread reviews`} />
                    </div>

                    {/* Secondary Counted Badge */}
                    <div className="relative inline-block">
                      <Button colorRole="secondary" variant="outlined">
                        Milestone Drills
                      </Button>
                      <NotificationBadge count={2} variant="secondary" srLabel="2 pending drills" />
                    </div>

                    {/* Dot Badge */}
                    <div className="relative inline-block">
                      <Button colorRole="tertiary" variant="outlined">
                        System Telemetry
                      </Button>
                      <NotificationBadge dot variant="primary" srLabel="Telemetry active" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/40">
                    <Button
                      size="sm"
                      variant="outlined"
                      colorRole="primary"
                      onClick={() => setBadgeCount((c) => c + 1)}
                    >
                      Increment Badge ({badgeCount})
                    </Button>
                    <Button
                      size="sm"
                      variant="outlined"
                      colorRole="neutral"
                      onClick={() => setBadgeCount(0)}
                    >
                      Clear Count
                    </Button>
                  </div>
                </div>
              </div>

              <span className="font-label text-xs text-on-surface-variant/80 block pt-2 border-t border-outline-variant/40">
                Diagonal slide-in and scale-pop badge without layout displacement
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* Floating Design System Toast Notification Layer */}
      {toastState && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out max-w-md">
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

