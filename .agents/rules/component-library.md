---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.ts, **/*.js"
description: Component library conventions — Base UI foundation, the 3 architectural layers, primitive-check-first workflow, and navigation taxonomy.
---

# Component Library — Base UI & Component Architecture

## Why Base UI (and not Radix)
This project standardizes on **Base UI** (`@base-ui/react`) as its headless primitive foundation:
- Actively maintained, single tree-shakable package (`npm i @base-ui/react`), and aligned with modern shadcn/ui Base UI patterns.
- **Never import `@radix-ui/*` in new code.** Treat existing Radix imports as migration debt and migrate to Base UI when touched.

## The 3 Architectural Layers

| Layer | Directory | Responsibilities & Contract | Import Rules |
|---|---|---|---|
| **Primitives** | `src/components/ui/` | Headless Base UI wrappers, design tokens, and controlled AI primitives. Zero business logic. | May import other `ui/` primitives & utils. **Never** imports `blocks/` or `features/`. |
| **Composite Blocks** | `src/components/blocks/` | Pure controlled UI compositions (props in, callbacks out). Zero DB, auth, or SSE/WebSocket coupling. | May import `ui/`. **Never** imports `features/` or `views/`. |
| **Feature Views** | `src/features/` or `src/views/` | Domain-specific screens, state, queries, routing, auth, and streaming recipes. | May import `blocks/`, `ui/`, and shared `lib/` utilities. |

### Form Composition (<FieldGroup>, <Field>, <InputGroup>)
- Wrap every form control in `<Field>` + `<FieldLabel>` (plus `<FieldDescription>` / `<FieldError>`) from `@/components/ui/field`. Never use placeholder text as the sole label.
- Group multiple fields with `<FieldGroup className="gap-4">` (or `gap-6`). Never use `space-y-*`.
- Compose leading/trailing icons, clear triggers, or inline buttons using `<InputGroup>` + `<InputGroupAddon>` + `<InputGroupInput>` + `<InputGroupButton>`. Never use manual `absolute` positioning inside inputs.

### Card Anatomy & Pragmatic `<div>`s
- Informational cards must use `<Card.Header>`, `<Card.Title>`, `<Card.Description>`, `<Card.Action>`, `<Card.Content>`, and `<Card.Footer>` (pure visual/media canvases exempt).
- Standard layout `<div className="flex flex-col gap-4">` / `<div className="grid ...">` containers are encouraged (never create `<Box>`, `<Flex>`, `<Spacer>`).
- Direct `<button>`, `<input>`, `<select>`, `<textarea>`, and `<dialog>` tags outside `src/components/ui/` are banned (ESLint `no-restricted-syntax`). Use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, `<Dialog>`, or `<UnstyledButton>` / `<Button variant="unstyled">`.

## Primitive-Check-First Workflow (Mandatory)
- **Button `colorRole` vs `variant`:** `Button` decouples emphasis (`variant="filled" | "outline" | "soft" | "text"`) from M3 color role (`colorRole`); Emerald (`#00796B`) requires an explicit `colorRole="secondary"`, while secondary exit actions ("Cancel", "Back") use `colorRole="neutral"`.
- **Base UI ships primitives for:** Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip (`https://base-ui.com/llms.txt`).
- **Custom primitives in `src/components/ui/`:** Card, Badge, Chip, InlineAlert, Icon, ClinicianTip, ThinkingOrb, BotAvatar, Avatar.Button, Breadcrumb, Pagination, EmptyState, Resizable, Attachment, ThinkingTrace, InputGroup, Field, Fieldset, Confirmation, and motion primitives (`Skeleton`, `TextSwap`, `NotificationBadge`, `TextsReveal`, `NumberRoll`, `NumberPopIn`, `SpinningCounter`, `ShimmerText`, `ErrorShake`, `SuccessCheck`).

1. **Inventory first** in `src/components/ui/` and `src/components/blocks/`.
2. **Reuse or extend** existing primitives with props before building new ones.
3. **Only build new** in `ui/` (Base UI wrapper) or `blocks/` (controlled composition) if nothing fits.
4. **Verify** no raw interactive HTML elements or duplicate primitives were introduced.

## Upstream Synchronization Policy
```bash
npx @seany9915/eolas-ui sync --dry-run
npx @seany9915/eolas-ui sync
# Or targeted overwrite:
npx @seany9915/eolas-ui add dialog combobox delete-confirmation-dialog --overwrite
```

## Navigation & Action Taxonomy (Choosing the Right Primitive)

| Primitive | Base UI Package | WAI-ARIA Role | Primary Purpose | When to Use | When NOT to Use |
|---|---|---|---|---|---|
| **`NavigationMenu`** | `@base-ui/react/navigation-menu` | `<nav>` / `navigation` | Site & app routing | Top-level header with page routes & sub-nav | Executing commands (Save, Delete), form controls, or toolbars |
| **`Menu`** | `@base-ui/react/menu` | `role="menu"` / `menuitem` | Single-button action dropdown | Isolated action menus, `...` overflow menus | Multi-menu desktop bars (`Menubar`), global nav (`NavigationMenu`), right-click (`ContextMenu`) |
| **`Menubar`** | `@base-ui/react/menubar` + `menu` | `role="menubar"` / `menu` | Desktop app command bar | Document/IDE bars (File/Edit/View) with arrow hopping | Website page routing (`NavigationMenu`) or standalone dropdown (`Menu`) |
| **`ContextMenu`** | `@base-ui/react/context-menu` | `role="menu"` | Pointer-anchored secondary actions | Right-click / long-press shortcuts on rows/nodes | **Never** as the sole way to trigger an action (always pair with visible `Menu`/button) |
| **`Toolbar`** | `@base-ui/react/toolbar` | `role="toolbar"` | Persistent action strip | Formatting bars, playback controls (single tab stop) | Hierarchical dropdown menus (`Menubar`) or page nav (`NavigationMenu`) |
| **`Tabs`** | `@base-ui/react/tabs` | `role="tablist"` / `tab` / `tabpanel` | Mutually exclusive views on same page | Switching card/dashboard/profile panels | Executing commands or multi-select filters (`ToggleGroup`) |
| **`ToggleGroup`** | `@base-ui/react/toggle-group` | `role="group"` + `aria-pressed` | Mode/filter selection without panels | Segmented controls, filter bars, Grid/List toggles | Switching entire DOM content panels (`Tabs`) or URL routing (`NavigationMenu`) |

### AI Chat & Agent UX (<Trace>, <Confirmation>)
- **Pending approvals outside `<Trace>`:** Never nest `[Approve] / [Deny]` inside an expandable `<Trace>`. Render pending decisions as standalone `<Confirmation>` (or `<Questionnaire>`) blocks in the chat stream, collapsing into the trace only after resolution.
- **"Behavior Wraps the Line":** Keep disclosure triggers (`Collapsible.Trigger`, `TraceCollapsibleTrigger`, `Accordion.Trigger`, `Dialog.Trigger`) as real `<button>` elements. Never pass `render={<span />}` or `render={<div />}`.

## Styling & Animating Base UI Primitives
- Apply Tailwind v4 `@theme` tokens directly; style via Base UI `data-*` attributes (`data-open`, `data-disabled`, `data-starting-style`, `data-ending-style`) rather than duplicating state in React. Respect the root portal/`isolation: isolate` setup and never add manual `z-50` to overlays.
- **`className` for Layout & Structural Integration:** Call sites may pass `className` for layout/positioning (`w-full`, `max-w-md`, `mt-4`, `grid-cols-2`, `shrink-0`) and structural boundary resets when docking into a parent container (`rounded-none`, `border-0`, `bg-transparent`). Never pass arbitrary theme, color, or font overrides (`bg-red-500`, `text-gray-400`, `font-serif`)—use `variant`, `colorRole`, `prominence`, and `size` props.
- **Popup grouping & overlay titles:** Wrap `*Item` in `*Group` (`Select.Group`, `Menu.Group`, `ContextMenu.Group`). Every modal overlay must render `<DialogTitle>`, `<DrawerTitle>`, or `<SheetTitle>` (with `className="sr-only"` if visually hidden).
- **Motion:** Follow `DESIGN.md`'s 5 Motion Rules, explicit `transition-[...]` (no `transition-all`), and mandatory `motion-reduce:transition-none` / `prefers-reduced-motion`.

## API Preservation & Non-Destructive Refactoring
Retain all compound subcomponents, `ref`, Base UI `render` props, `cn(...)` merging, and existing prop aliases. Make surgical class diffs rather than full-file rewrites.

## The 6-Tier Functional Component Taxonomy
All components in Eolas UI are classified into 6 functional tiers (see `src/components/playground/registry/registry-manifest.ts` for the live inventory):

| Tier | Category | Directory | Representative Components |
|---|---|---|---|
| **Tier 1** | **Primitives** | `src/components/ui/` | `Button`, `Badge`, `Chip`, `Toggle`, `ToggleGroup`, `Input`, `Select`, `Switch`, `Slider`, `Tabs`, `Icon`, `Spinner` |
| **Tier 2** | **Fields** | `src/components/ui/` | `Field`, `Fieldset`, `InputGroup`, `Combobox`, `Autocomplete`, `OTPField`, `NumberField`, `Calendar` |
| **Tier 3** | **Composed** | `src/components/ui/` & `blocks/` | `Card`, `Table`, `Avatar`, `InlineAlert`, `EmptyState`, `Accordion`, `Collapsible`, `Toast`, `Chart`, `ClinicianTip` |
| **Tier 4** | **Overlays** | `src/components/ui/` | `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `PreviewCard` |
| **Tier 5** | **Shell** | `src/components/ui/` | `Sidebar`, `Breadcrumb`, `Pagination`, `NavigationMenu`, `Toolbar` |
| **Tier 6** | **Clinical AI & Conversation** | `src/components/ui/` & `blocks/` | `ChatMessage`, `Trace`, `Reasoning`, `ThinkingOrb`, `Confirmation`, `Attachment`, `Sources`, `Checkpoint` |

## Known Component Traps & Edge-Case Guardrails
1. **Command Inline Mount Scroll-Jump:** Pass controlled `value={value}` + `onValueChange={setValue}` to `cmdk` so initial render doesn't jump the page.
2. **Sidebar Preview Container Isolation:** Wrap embedded sidebars in `<SidebarProvider className="min-h-0">` with `<Sidebar collapsible="none">`.
3. **DirectionProvider RTL Synchronization:** Mirror `dir={direction}` onto the container DOM element (`<div dir={direction}>`) alongside Base UI `<DirectionProvider>`.
4. **Resizable Panels v4:** Use `orientation="horizontal"` and percentage strings (`defaultSize="40%"`), not `direction` or numeric sizes.
5. **Control Height Synchrony:** Multi-control action rows (`Button`, `Input`, `InputGroup`, `Select`, `Toggle`, `ToggleGroup`, `Combobox`, `OTPField`, `Tabs`) must share identical height tiers (`sm`: 44px, `md`: 48px, `lg`: 56px).

## Reference
- Base UI docs: https://base-ui.com/react/overview/quick-start
- Base UI llms.txt: https://base-ui.com/llms.txt
- Base UI animation guide: https://base-ui.com/react/handbook/animation
