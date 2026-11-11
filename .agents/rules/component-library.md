---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.ts, **/*.js"
description: Component library conventions — Base UI foundation, the 3 architectural layers (primitives, blocks, views), and the mandatory primitive-check-first workflow.
---

# Component Library — Base UI & Component Architecture

## Why Base UI (and not Radix)

This project standardizes on **Base UI** (`@base-ui/react`) as its headless/unstyled component foundation. It replaced Radix UI as the default. Reasons this matters in practice:
- Base UI is the actively developed, better-supported option at present — Radix Primitives has slowed in maintenance velocity relative to Base UI's release cadence.
- Base UI ships as a single tree-shakable package (`npm i @base-ui/react`) rather than one package per component.
- Popular styled component sets (e.g. shadcn/ui) have migrated to using Base UI as their unstyled foundation, so patterns and community examples increasingly assume it.

**Do not import from `@radix-ui/*` in new code.** If you encounter existing Radix-based components while working in this codebase, do not treat them as the pattern to copy — treat them as migration debt. When you touch a file that uses Radix, prefer migrating that component to Base UI as part of the change, and say so explicitly rather than silently leaving it mixed.

## The 3 Architectural Layers

To prevent AI hallucination, circular dependencies, and directory pollution, code is organized into three strictly separated layers:

| Layer | Directory | Responsibilities & Contract | Import Rules |
|---|---|---|---|
| **Primitives** | `src/components/ui/` | Headless Base UI wrappers & design system tokens (`Button`, `Dialog`, `Input`, `Select`, `Card`). Zero business logic. Unopinionated atoms. | Can import other primitives & utils. **Never** imports from blocks or features. |
| **Composite Blocks** | `src/components/blocks/` | Reusable presentational or controlled UI compositions built strictly from primitives and tokens. Zero network/auth coupling. Receives props, renders layouts, emits callbacks. | Can import from `ui/`. **Never** imports from features or views. |
| **Feature Views** | `src/features/` or `src/views/` | Domain-specific application views and user workflows. Owns state, queries, routing, auth, and network transport. | Can import from `blocks/`, `ui/`, and shared lib utilities. |

### Presentational Blocks vs. Stateful Workflows & Recipes

- **Composite Blocks (`components/blocks/` in the shared registry):** Pure UI assemblies. They receive controlled props and emit callbacks (`open`, `onOpenChange`, `onConfirm`, `searchQuery`, `onSearchChange`, `isLoading`). They have zero knowledge of databases, authentication providers (Firebase, Supabase, Auth0), router redirects, or streaming network protocols (SSE, WebSockets).
- **Stateful Workflows & Recipes (`src/features/` in consumer apps):** Patterns deeply coupled to authentication sessions (Login screens, OAuth redirects) or protocol transport (streaming AI chatbots, persistent chat logs) belong in `src/features/` as application code or starter recipes, **never** as unopinionated UI blocks in the shared registry.

### Form Composition Architecture (<FieldGroup>, <Field>, <InputGroup>)

- **Accessible Field Encapsulation:** Every form control must be wrapped in `<Field>` paired with `<FieldLabel>` (and optionally `<FieldDescription>` / `<FieldError>`) from `@/components/ui/field`. Never rely on placeholder text as the sole identifier.
- **Form Stacks and Rhythms:** Group multiple fields using `<FieldGroup className="gap-4">` (or `gap-6` for roomy sections). Do not use child-margin hacks (`space-y-*`) or arbitrary margins.
- **Attached Addons & Actions:** When an input requires leading/trailing icons, clear triggers, submit buttons, or text prefixes, always compose with `<InputGroup>` + `<InputGroupAddon>` + `<InputGroupInput>` + `<InputGroupButton>`. Never use manual absolute positioning inside inputs.

### Card Anatomy Standard

- Informational cards containing titles, descriptions, and actions must use standard subcomponents: `<Card.Header>`, `<Card.Title>`, `<Card.Description>`, `<Card.Action>`, `<Card.Content>`, and `<Card.Footer>`. This standardizes container query padding and token hierarchy.
- **Pragmatic Scope Exception:** Pure visual canvas containers (e.g., speech waveform visualizers, audio player canvases, interactive games, or media cards) are exempt from requiring empty or dummy `<Card.Header>` blocks.

### Pragmatic `<div>`s vs. Toxic Hand-Rolled Controls

- **Standard Layout `<div>`s (Healthy & Encouraged):** Using standard HTML `<div className="flex flex-col gap-4">` or `<div className="grid grid-cols-12">` for layout is standard, efficient, and expected. Do not create artificial wrapper abstractions (`<Box>`, `<Flex>`, `<Spacer>`), which bloat the DOM tree and obscure Tailwind utility classes.
- **Hand-Rolled Interactive Controls (Toxic & Banned):** Using a `<div>` or raw `<button>` to build an interactive control (`<div onClick={...}>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`) bypasses Base UI focus management, floating focus rings, keyboard traps, and ARIA state machines. Direct `<button>`, `<input>`, `<select>`, `<textarea>`, and native `<dialog>` tags outside `components/ui/` are prohibited and flagged by automated ESLint AST selectors (`no-restricted-syntax`). Always use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, and `<Dialog>` from `@/components/ui/`.

## The primitive-check-first workflow (mandatory)

The most common failure mode in this workspace is an agent writing a bespoke component instead of checking whether one already exists. Follow this sequence every time before writing a new interactive UI element:

- **Base UI ships as primitives for:** Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip. Check https://base-ui.com/llms.txt for updates.
- **Custom primitives built on Base UI or accessible HTML in `src/components/ui/`:** Card, Badge, Chip, InlineAlert, Icon, ClinicianTip, ThinkingOrb, BotAvatar, AvatarButton (Avatar.Button), Breadcrumb, Pagination, EmptyState, Resizable, Attachment, ThinkingTrace, InputGroup, Field, Fieldset, Confirmation, and shared motion primitives (Skeleton, TextSwap, NotificationBadge, TextsReveal, NumberRoll, NumberPopIn, SpinningCounter, ShimmerText, ErrorShake, SuccessCheck).

1. **Inventory first.** List `src/components/ui/` and `src/components/blocks/` before writing anything.
2. **Match against the inventory.** If a component or block already covers this need, use it directly or extend it with props.
3. **Only build new if nothing fits.** Build it as a wrapped Base UI primitive (in `ui/`) or a controlled composite block (in `blocks/`).
4. **Self-check before finishing.** Verify no raw interactive HTML elements were written and no duplicates were left behind.

## Upstream Synchronization Policy

In compliance-heavy environments (WCAG 2.2 AA audits, keyboard navigation, focus trap compliance), upstream bug fixes must propagate to consumer projects:
- Consumer repositories maintain upstream parity using the CLI sync command:
  ```bash
  # Run with --dry-run first to preview changes
  npx @seany9915/eolas-ui sync --dry-run
  # Review git diffs before finalizing to protect custom 48px heights and Base UI adaptations
  npx @seany9915/eolas-ui sync
  ```
- Or update specific components/blocks with explicit overwrite:
  ```bash
  npx @seany9915/eolas-ui add dialog combobox delete-confirmation-dialog --overwrite
  ```

## Navigation & Action Taxonomy (Choosing the Right Primitive)

Never guess between navigation, action, and selection components. Strictly follow this decision matrix:

| Primitive | Base UI Package | WAI-ARIA Role | Primary Purpose | Interaction & Triggers | When to Use | When NOT to Use |
|---|---|---|---|---|---|---|
| **`NavigationMenu`** | `@base-ui/react/navigation-menu` | `<nav>` / `navigation` | Site & application routing | Hover/click delay; morphing viewport/positioner across content panels | Top-level application header with page routes and sub-navigation links | **Not** for executing commands/actions (e.g. Save, Delete), form controls, or desktop toolbars |
| **`Menu`** | `@base-ui/react/menu` | `role="menu"` / `menuitem` | Single-button action dropdown | Click/press trigger button; opens popup list of commands | Isolated action menus, "..." overflow menus, record action buttons | **Not** for multi-menu desktop bars (use `Menubar`), global site nav (use `NavigationMenu`), or right-click (use `ContextMenu`) |
| **`Menubar`** | `@base-ui/react/menubar` + `menu` | `role="menubar"` / `menu` | Desktop application command system | Persistent horizontal bar; arrow-key hopping between menus; keyboard shortcuts (`⌘N`, `Ctrl+Z`) | Desktop workspaces, document editors, IDEs with File/Edit/View/Tools | **Not** for website page routing links (use `NavigationMenu`) or a standalone dropdown button (use `Menu`) |
| **`ContextMenu`** | `@base-ui/react/context-menu` | `role="menu"` | Secondary pointer-anchored actions | Right-click, long-press, or `Shift+F10`; opens at pointer coordinates | Power-user shortcuts on table rows, canvas nodes, card surfaces | **Never** as the sole way to trigger an action (mobile/touch users cannot right-click reliably; always provide a visible `Menu` or button) |
| **`Toolbar`** | `@base-ui/react/toolbar` | `role="toolbar"` | Persistent action strip / formatting tools | Arrow key navigation with **single tab stop**; buttons stay visible and don't dismiss on click | Rich text formatting bars, media audio/playback controls, canvas tool palettes | **Not** for hierarchical dropdown menus (use `Menubar`) or page navigation (use `NavigationMenu`) |
| **`Tabs`** | `@base-ui/react/tabs` | `role="tablist"` / `tab` / `tabpanel` | Mutually exclusive content views on same page | Tab click unhides paired `tabpanel`; 1 active panel at a time | Switching between views/sections of a card, dashboard, or profile | **Not** for executing commands (e.g. "Export" is not a tab) or multi-select filters (use `ToggleGroup`) |
| **`ToggleGroup`** | `@base-ui/react/toggle-group` | `role="group"` with `aria-pressed` | Mode/filter selection without view panels | Toggles boolean states (single 1-of-N or multi N-of-M) | Segmented controls, filter bars, layout toggles (Grid/List), text formatting buttons inside a Toolbar | **Not** for switching entire DOM content panels (use `Tabs`) or routing to new URLs (use `NavigationMenu`) |

### AI Chat & Agent UX (<Trace>, <Confirmation>)

- **Pending Approvals Outside <Trace>:** Interactive confirmation controls (`[Approve] / [Deny]`) must never be nested inside an expandable or collapsed <Trace> row. Render actionable decisions as standalone prominent `<Confirmation>` blocks in the chat stream (and use `<Questionnaire>` for clarification choice prompts), and transition them into collapsed audit lines inside the trace only after the user resolves them.
- **"Behavior Wraps the Line":** Triggers must always retain semantic button behaviors and ARIA roles (e.g. `<TraceCollapsibleTrigger>` renders a true `<button>`). Never use Base UI `render` props to replace interactive elements with non-focusable `<span>` or `<div>` elements.

## Styling Base UI primitives

- Base UI components are unstyled by default — apply the project's Tailwind v4 theme tokens (from `globals.css` `@theme`) directly to the parts you render. Never introduce a second styling system alongside Tailwind.
- Do not strip or override ARIA attributes, `data-*` state attributes, or focus management that Base UI provides. Style based on the `data-*` state attributes it exposes (e.g. `data-open`, `data-disabled`) rather than reimplementing state tracking in React state.
- Respect the portal setup Base UI expects for popups (Dialog, Popover, Menu, Tooltip, Select) — see the project's root layout for the portal container/`isolation: isolate` setup before adding a new popup-based component.

### className for Layout Only

- Call sites must pass `className` strictly for layout and positioning dimensions (`w-full`, `max-w-md`, `mx-auto`, `mt-4`, `shrink-0`).
- Never override background colors, borders, font weights, or radii at call sites via `className`. All component aesthetics are governed via dedicated component props (`variant`, `colorRole`, `prominence`, `size`).

### Popup Item Grouping (*Item in *Group)

- In `Select`, `Menu`, and `ContextMenu`, all items must be nested inside a group container (`<Select.Group>`, `<Menu.Group>`, `<ContextMenu.Group>`) with optional group headers (`<Select.GroupLabel>`). This preserves assistive list counts and grouping boundaries for screen readers.

### Overlay Accessibility & Mandatory Titles

- Every modal overlay (`<Dialog>`, `<Drawer>`, `<Sheet>`, `<AlertDialog>`) must render an accessible title subcomponent (`<DialogTitle>`, `<DrawerTitle>`, `<SheetTitle>`). If no visible title is desired in the design, render `<DialogTitle className="sr-only">Title</DialogTitle>`.
- Never add manual `z-index` utilities (`z-50`) to overlays. Stacking is governed by Base UI portal layers.

## Animating primitives

Base UI exposes `[data-starting-style]`/`[data-ending-style]` for CSS transitions and `[data-open]`/`[data-closed]` for CSS keyframe animations on its popup-style components (Dialog, Popover, Menu, Tooltip, Select, Toast). Prefer transition attributes — transitions can be smoothly cancelled mid-way.

Always follow the 5 Rules for Motion Polish from `DESIGN.md`:
1. **Open / Close Timing Asymmetry:** Exit transitions are always $\le$ entrance duration (e.g., Dialog open 250ms / close 150ms).
2. **Intent Delays:** 100–150ms delay on hovercards/tooltips to prevent phantom flashes.
3. **Calibrated Travel Distances:** Use physical distance tokens (`--distance-micro`: 4px, `--distance-small`: 6px, `--distance-base`: 8px, `--distance-roomy`: 16px).
4. **Blur-Coupled Micro-Primitives Only (Never on Overlays):** Pair transforms with `--blur-small` (2px) or `--blur-medium` (3px) strictly for in-place micro-primitives (`<Icon.Toggle />`, `<TextSwap />`, `<Skeleton.Reveal />`). Never animate `filter: blur()` on overlays (Dialog, Popover, Menu, Drawer, Select) or form step panels to avoid texture re-rasterization and text anti-aliasing flicker.
5. **The Stagger Cap:** Multi-item stagger animations must use `--duration-stagger: 40ms` and strictly cap at **5 items maximum** (200ms max cumulative delay).

**Explicit Property Targeting:** Never use `transition-all` on cards, layout containers, or dialogs. Always target explicit CSS properties (`transition-[box-shadow,border-color,background-color,transform]`).

**Mandatory Reduced-Motion:** Every transition must ship a `motion-reduce:transition-none` / `prefers-reduced-motion` override.

## API Preservation & Non-Destructive Refactoring

When modifying existing components for styling polish, bug fixes, or `DESIGN.md` alignment:
1. **Preserve Compound Anatomy:** Retain all subcomponents (`Primitive.Root`, `Primitive.Trigger`, `Primitive.Portal`, `Primitive.Backdrop`, etc.).
2. **Maintain Headless Primitives:** Never downgrade an accessible primitive to an unstyled HTML tag.
3. **Preserve Polymorphic & Prop Surface:** Ensure `ref`, Base UI's `render` prop, `className` merging (`cn(...)`), and standard HTML attributes are retained.
4. **Backward Compatibility Guarantee:** Retain existing prop interfaces and export aliases.
5. **Surgical Diffing:** Make targeted CSS class updates rather than full-file replacements.

## The 6-Tier Functional Component Taxonomy

To maintain modularity and avoid sprawling unorganized registries, all 112 components in Eolas UI are classified into 6 functional tiers:

| Tier | Category | Package / Directory | Responsibilities & Included Components |
|---|---|---|---|
| **Tier 1** | **Primitives** | `src/components/ui/` | Atomic controls: `Button`, `Badge`, `Chip`, `Toggle`, `ToggleGroup`, `Input`, `Select`, `Switch`, `Slider`, `Tabs`, `Icon`, `Spinner`. |
| **Tier 2** | **Fields** | `src/components/ui/` | Compound form encapsulations: `Field`, `Fieldset`, `InputGroup`, `Combobox`, `Autocomplete`, `OTPField`, `NumberField`, `Calendar`. |
| **Tier 3** | **Composed** | `src/components/ui/` & `blocks/` | Structural containers & data displays: `Card`, `Table`, `Avatar`, `InlineAlert`, `EmptyState`, `Accordion`, `Collapsible`, `Toast`, `Chart`, `ClinicianTip`. |
| **Tier 4** | **Overlays** | `src/components/ui/` | Layered top-layer popups: `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `PreviewCard`. |
| **Tier 5** | **Shell** | `src/components/ui/` | Application layout chrome: `Sidebar`, `Breadcrumb`, `Pagination`, `NavigationMenu`, `Toolbar`. |
| **Tier 6** | **Clinical AI & Conversation** | `src/components/ui/` & `blocks/` | Conversational & diagnostic primitives: `ChatMessage`, `Trace`, `Reasoning`, `ThinkingOrb`, `Confirmation`, `Attachment`, `Sources`, `Checkpoint`. |

## Known Component Traps & Edge-Case Guardrails

Hard-won engineering rules to prevent recurring bugs in modern Base UI and headless primitives:

1. **Command Inline Mount Scroll-Jump:**
   - *Trap:* Under the hood, `cmdk` automatically scrolls its first item into view upon initial render. When embedded inside a long page or modal, this can trigger an abrupt viewport jump.
   - *Fix:* Explicitly control the value on initial mount: pass `value={value}` paired with `onValueChange={setValue}`, defaulting to a safe initial identifier.
2. **Sidebar Preview Container Isolation:**
   - *Trap:* Default sidebars employ fixed positioning or absolute viewport assumptions, escaping embedded preview frames or documentation cards.
   - *Fix:* Always isolate embedded sidebars using `<SidebarProvider className="min-h-0">` paired with `<Sidebar collapsible="none">`.
3. **DirectionProvider RTL Synchronization:**
   - *Trap:* Wrapping a subtree in Base UI's `<DirectionProvider dir="rtl">` updates React context, but the native browser rendering engine will not flip flex/text flow unless the DOM attribute is also present.
   - *Fix:* Always mirror the `dir="rtl"` attribute onto the container DOM element: `<div dir={direction}>`.
4. **Resizable Panels v4 Breaking Syntax:**
   - *Trap:* `react-resizable-panels` v4 dropped `direction="horizontal"` and numeric size props.
   - *Fix:* Use `orientation="horizontal"` and explicit percentage strings (`defaultSize="40%"`).
5. **Control Height Synchrony Checklist:**
   - *Audit Target:* When building multi-control action rows, verify that all participating controls strictly adhere to identical height tiers: `Button`, `Input`, `InputGroup`, `Select`, `Toggle`, `ToggleGroup`, `Combobox`, `OTPField`, and `Tabs` must all share `sm` (44px), `md` (48px standard floor), or `lg` (56px).

## Reference

- Base UI docs: https://base-ui.com/react/overview/quick-start
- Base UI llms.txt: https://base-ui.com/llms.txt
- Base UI animation guide: https://base-ui.com/react/handbook/animation
