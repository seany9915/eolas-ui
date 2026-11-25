---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.ts, **/*.js"
description: Component library conventions — Base UI foundation, the 3 architectural layers, primitive-check-first workflow, and navigation taxonomy.
---

# Component Library — Base UI & Architecture

Standardizes on **Base UI** (`@base-ui/react`) across 3 strict one-way layers: `src/components/ui/` (primitives & controlled AI primitives) → `src/components/blocks/` (pure controlled compositions) → `src/features/` / `src/views/` (state, queries, auth, routing). Retains all compound subcomponents, `ref`, `render` props, `composeClassName` / `cn`, and prop aliases via surgical diffs.

## Form & Card Composition
- Wrap every form control in `<FieldGroup className="gap-4">` + `<Field>` + `<FieldLabel>` (plus `<FieldDescription>`/`<FieldError>`). Never use placeholder-only labels.
- Compose leading/trailing addons or inline input buttons with `<InputGroup>` + `<InputGroupAddon>` + `<InputGroupInput>` + `<InputGroupButton>`.
- Structure informational `<Card>`s with `<Card.Header>`, `<Card.Title>`, `<Card.Description>`, `<Card.Action>`, `<Card.Content>`, and `<Card.Footer>` (media/game canvases exempt). Use plain layout `<div>`s (`flex`/`grid`), never `<Box>`/`<Flex>`/`<Spacer>`.

## Primitive-Check-First Workflow (Mandatory)
- **Button `colorRole` vs `variant`:** `Button` separates emphasis (`variant="filled" | "soft" | "outline" | "text"`) from palette role (`colorRole`); Emerald (`#00796B`) needs explicit `colorRole="secondary"`, while secondary exit actions ("Cancel", "Back") use `colorRole="neutral"`.
- **Base UI primitives:** Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip.
- **Custom `ui/` primitives:** Card, Badge, Chip, InlineAlert, Icon, ClinicianTip, ThinkingOrb, BotAvatar, Avatar.Button, Breadcrumb, Pagination, Empty, Resizable, Attachment, Trace, InputGroup, Confirmation, and motion primitives (`Skeleton`, `TextSwap`, `NotificationBadge`, `TextsReveal`, `NumberPopIn`, `SpinningCounter`, `ShimmerText`, `ErrorShake`, `SuccessCheck`).

1. **Inventory** `src/components/ui/` and `src/components/blocks/` first.
2. **Reuse or extend** existing primitives with props before adding anything new.
3. **Build new** in `ui/` (Base UI wrapper) or `blocks/` (controlled composition) only if nothing fits.

## Upstream Synchronization
```bash
npx @seany9915/eolas-ui sync --dry-run
npx @seany9915/eolas-ui sync
npx @seany9915/eolas-ui add dialog combobox data-table --overwrite
```

## Navigation & Action Taxonomy

| Primitive | Base UI Package | WAI-ARIA Role | Primary Purpose | When to Use | When NOT to Use |
|---|---|---|---|---|---|
| **`NavigationMenu`** | `@base-ui/react/navigation-menu` | `<nav>` / `navigation` | Site & app routing | Top-level header with page routes & sub-nav | Executing commands (Save, Delete), form controls, or toolbars |
| **`Menu`** | `@base-ui/react/menu` | `role="menu"` / `menuitem` | Single-button action dropdown | Isolated action menus, `...` overflow menus | Multi-menu desktop bars (`Menubar`), global nav (`NavigationMenu`), right-click (`ContextMenu`) |
| **`Menubar`** | `@base-ui/react/menubar` + `menu` | `role="menubar"` / `menu` | Desktop app command bar | Document/IDE bars (File/Edit/View) with arrow hopping | Website page routing (`NavigationMenu`) or standalone dropdown (`Menu`) |
| **`ContextMenu`** | `@base-ui/react/context-menu` | `role="menu"` | Pointer-anchored secondary actions | Right-click / long-press shortcuts on rows/nodes | **Never** as the sole way to trigger an action (pair with visible `Menu`/button) |
| **`Toolbar`** | `@base-ui/react/toolbar` | `role="toolbar"` | Persistent action strip | Formatting bars, playback controls (single tab stop) | Hierarchical dropdown menus (`Menubar`) or page nav (`NavigationMenu`) |
| **`Tabs`** | `@base-ui/react/tabs` | `role="tablist"` / `tab` / `tabpanel` | Mutually exclusive views on same page | Switching card/dashboard/profile panels | Executing commands or multi-select filters (`ToggleGroup`) |
| **`ToggleGroup`** | `@base-ui/react/toggle-group` | `role="group"` + `aria-pressed` | Mode/filter selection without panels | Segmented controls, filter bars, Grid/List toggles | Switching entire DOM content panels (`Tabs`) or URL routing (`NavigationMenu`) |

## AI Chat & Base UI Authoring Notes
- **Pending approvals outside `<Trace>`:** Render `[Approve] / [Deny]` as standalone `<Confirmation>` (or `<Questionnaire>`) blocks in the stream, collapsing into `<Trace>` only after resolution.
- **"Behavior Wraps the Line":** Keep disclosure triggers as real `<button>`s — never pass `render={<span />}` or `render={<div />}`.
- **Styling Base UI state:** Drive visuals via Base UI `data-*` attributes (`data-open`, `data-disabled`, `data-starting-style`, `data-ending-style`), wrap `*Item`s in `*Group`, always include `<DialogTitle>`/`<DrawerTitle>`, and let `ui/` portal primitives handle overlay `z-index`.

## The 6-Tier Functional Component Taxonomy
In the Eolas UI authoring repo, see `src/components/playground/registry/registry-manifest.ts`; in consuming apps, inspect `src/components/ui/` and `src/components/blocks/` directly.

| Tier | Category | Directory | Representative Components |
|---|---|---|---|
| **Tier 1** | **Primitives** | `src/components/ui/` | `Button`, `Badge`, `Chip`, `Toggle`, `ToggleGroup`, `Input`, `Select`, `Switch`, `Slider`, `Tabs`, `Icon`, `Spinner` |
| **Tier 2** | **Fields** | `src/components/ui/` | `Field`, `Fieldset`, `InputGroup`, `Combobox`, `Autocomplete`, `OTPField`, `NumberField`, `Calendar` |
| **Tier 3** | **Composed** | `src/components/ui/` & `blocks/` | `Card`, `Table`, `Avatar`, `InlineAlert`, `Empty`, `Accordion`, `Collapsible`, `Toast`, `Chart`, `ClinicianTip` |
| **Tier 4** | **Overlays** | `src/components/ui/` | `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `PreviewCard` |
| **Tier 5** | **Shell** | `src/components/ui/` | `Sidebar`, `Breadcrumb`, `Pagination`, `NavigationMenu`, `Toolbar` |
| **Tier 6** | **Clinical AI & Conversation** | `src/components/ui/` & `blocks/` | `ChatMessage`, `Trace`, `Reasoning`, `ThinkingOrb`, `Confirmation`, `Attachment`, `Sources`, `Checkpoint` |

## Known Component Traps & Edge-Case Guardrails
1. **Command Inline Mount Scroll-Jump:** Pass controlled `value` + `onValueChange` to `cmdk` so initial render doesn't jump the page.
2. **Sidebar Preview Isolation:** Wrap embedded sidebars in `<SidebarProvider className="min-h-0">` with `<Sidebar collapsible="none">`.
3. **DirectionProvider RTL Sync:** Mirror `dir={direction}` onto the container DOM element alongside `<DirectionProvider>`.
4. **Resizable Panels v4:** Use `orientation="horizontal"` and percentage strings (`defaultSize="40%"`), not `direction` or numbers.
5. **Control Height Synchrony:** Keep the outer bounding-box tiers (`sm` 44px, `md` 48px, `lg` 56px) across bordered wrappers (`h-*`/`min-h-*` + `items-stretch`) rather than inner inputs.
6. **WebKit IME Composition Timing:** Beyond checking `isComposing`, guard against WebKit firing `compositionend` on the same tick just before `Enter` `keydown`.
7. **Focus Recovery & Move Stability:** Move focus to next sibling, previous sibling, or container/add trigger when deleting list items; never use array index `key`s on reorderable lists (`Sortable`, `Queue`).
8. **Single Tab-Stop Roving Focus:** Expose a single `Tab` stop with Arrow-key navigation (`Toolbar` or roving `tabIndex`) on chip bars and action strips.
9. **Collapsed Panel Accessibility:** Use `hidden="until-found"` (with `beforematch` auto-expand) or `hidden`/`inert` — never `opacity-0` or `max-h-0` alone.
10. **Keyboard Parity for Reorder & Multi-Select:** Support keyboard reordering (`Space`/`Enter` + Arrows or Move Up/Down buttons) with `aria-live` announcements.

## Reference
- Base UI docs: https://base-ui.com/react/overview/quick-start
- Base UI llms.txt: https://base-ui.com/llms.txt
- Base UI animation guide: https://base-ui.com/react/handbook/animation
