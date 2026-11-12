---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.css"
description: Banned UI/code/copy anti-patterns and required alternatives. Self-check every finished component against this list.
---

# Anti-Patterns (Banned) → Required Alternatives

## Chips, Badges & Color Roles
- **Banned: Triple-Tint Monochrome** (pastel fill + matching-hue border + matching-hue text) → **Use one of:**
  1. **Filled (`variant="filled"`):** Solid `primary`/`secondary`/`tertiary` fill + `on-*` text, no border.
  2. **Outline (`variant="outline"`):** `1px` `primary`/`secondary` border (never `tertiary` Amber) + neutral `surface` fill (or `on-surface` on inverted surfaces) + matching text.
  3. **Soft Wash (`variant="soft"`):** `*-container` fill + ultra-dark semantic `on-*-container` ink (`#001849`, `#00201c`, `#261900`, `#052e16`, `#450a0a`, `#331400`, `#1a1c1e`) + `border-transparent` on `<Badge/>`/`<Chip/>` pills. (Callouts, `InlineAlert`s, and tinted cards keep `#1a1c1e` body text with no colored perimeter borders.)
- **Banned: All-caps chips/badges or static status dots** → **Use:** Sentence case and plain text, `<Badge/>`, or functional icons (dots are strictly for live/real-time presence/recording paired with text).

## Accessibility & Interaction
- **Banned: Raw unlabelled inputs / placeholder-only labels** → **Use:** `<FieldGroup className="gap-4">` + `<Field>` + `<FieldLabel>` (plus `<FieldDescription>` / `<FieldError>`).
- **Banned: Hover-only actions** → **Use:** `:focus-within` support and persistent visible controls for touch.
- **Banned: Pointer-only drag-and-drop** → **Use:** Visible up/down reorder buttons or keyboard move mode.
- **Banned: Low-contrast focus rings or placeholders** → **Use:** 3:1+ focus ring contrast against adjacent backgrounds (WCAG 2.4.11) and AA-contrast supplementary placeholder text.
- **Banned: Focus vs. selection ambiguity** (`outline-offset: 0` on borderless/selectable containers) → **Use:** Floating `outline-offset: 2px` for focus; flush `2px` border + surface wash for selection.

## Structural & Layout
- **Banned: `space-y-*` / `space-x-*` child-margin hacks** → **Use:** `flex flex-col gap-*` or `grid gap-*`.
- **Banned: Verbose `w-* h-*` or multi-class truncation** → **Use:** `size-*` (`size-4`, `size-10`) and `truncate`.
- **Banned: Unstructured cards** (raw `<h3>`/`<p>` dumped in `<Card>`) → **Use:** `<Card.Header>`, `<Card.Title>`, `<Card.Description>`, `<Card.Action>`, `<Card.Content>`, `<Card.Footer>` (media/game canvases exempt).
- **Banned: Hardcoded Lorem Ipsum / missing zero-state** → **Use:** Loading, empty, and realistic populated states.
- **Banned: Stacked vertical icon-over-text utility buttons** → **Use:** Inline icon left of label.
- **Banned: Card Soup / Metric Card Grids ("Card Grid Rain") / nested cards** → **Use:** Low-prominence typography/dividers, tables, definition lists, or accordions; never nest `<Card>` inside `<Card>`.
- **Banned: `InlineAlert` for routine tips** → **Use:** `<ClinicianTip />` (unboxed inside cards; `bg-surface-container border border-outline-variant` on canvas).
- **Banned: `surface-variant` fill + `outline-variant` border** (1.31:1 contrast) → **Use:** `outline` (`#6B6E80`) border when a neutral fill needs a boundary.
- **Banned: Single-sided accent borders on rounded cards** → **Use:** Borderless `border border-transparent` standard cards; reserve `rounded-s-none rounded-e` + `border-s-4` strictly for `<InlineAlert />` and `<Toast />`.
- **Banned: Div Soup / toxic wrapper-itis** (`<Box>`, `<Flex>`, `<Spacer>`, redundant `<div>`/`<>`) → **Use:** Direct classes on semantic elements or plain layout `<div>`s (`flex`/`grid`).
- **Banned: Desktop FABs** → **Use:** Inline actions, side-drawers, or page headers.
- **Banned: Viewport breakpoints (`sm:`, `md:`, `lg:`) inside reusable components** → **Use:** `@container` on a defined-width wrapper `<div>` (`w-full` or grid cell, never `<table>`/`<tr>`/auto-sized flex) + `@sm:`/`@md:`/`@lg:`. Reserve viewport queries for page shells.
- **Banned: Left-aligned numeric table columns** → **Use:** `text-right` + `tabular-nums` / `font-mono` on numeric `<th>` and `<td>` (or `numeric: true` on `<Table />`).
- **Banned: Arbitrary or `0px` clamped nested radii in padded cards** → **Use:** $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$ for nested media/panels (clamping to `rounded` / `8px`; tight `p-1` segmented shells still use `rounded-sm` / `4px`).
- **Banned: Mismatched input + button heights or asymmetric icon insets** → **Use:** Identical height tiers (`sm`: 44px, `md`: 48px, `lg`: 56px), `shrink-0 whitespace-nowrap` on buttons, and symmetric icon padding.

## Iconography & Copy
- **Banned: `mr-*` / `ml-*` on `<Icon>` inside flex containers** → **Use:** Parent `gap-*` (e.g. `<Button>`'s `gap-2`).
- **Banned: Sparkle/magic icons (`stars`, `auto_awesome`) or emojis** → **Use:** Functional task icons (`translate`, `summarize`, `spellcheck`, `tune`, `bolt`).
- **Banned: AI clichés, inflated nouns, or 3+ noun labels** ("Elevate", "Seamless", "Hub", "Matrix", "Repository", "Engine") → **Use:** Plain everyday terms, 1–2 nouns max ("Caseload", "Patients", "Notes", "Saved").
- **Banned: Dev/DB/CSS jargon in UI copy** (`committed`, `synchronized`, `hydrated`, `unconstrained`, `affordance`, `telemetry`, `workflow`, `protocol`) → **Use:** User-outcome phrasing ("Patient added", "Preview: Full width").
- **Banned: Fabricated compliance/security claims, invented metrics, or `LABEL // YEAR`** → **Use:** Verifiable app states ("Saved", "Synced", "Offline") and `[metric]` placeholders.
- **Banned: "Click here" or identical generic links** → **Use:** Descriptive action text or unique `aria-label` per link.

## Code Quality, Overlays & Component Library
- **Banned: Placeholder stubs (`// TODO`) or `any` / `@ts-ignore` / `as unknown as T`** → **Use:** Complete runnable code (or `throw new Error('Not implemented: ...')`) and strict types / `zod`.
- **Banned: Titleless overlays or manual `z-index` (`z-50`, `z-9999`)** → **Use:** `<DialogTitle>` / `<DrawerTitle>` / `<SheetTitle>` (or `sr-only`) and Base UI portal stacking.
- **Banned: Heavy blurs for simple inputs or bloated multi-tier headers** → **Use:** Inline editing / side panels and consolidated top navigation.
- **Banned: Manual `relative`/`absolute` buttons inside inputs** → **Use:** `<InputGroup>` + `<InputGroupAddon>` + `<InputGroupButton>`.
- **Banned: Looped `<Button>` arrays for mode/filter bars** → **Use:** `<ToggleGroup>` (`role="radiogroup"` or `role="group"`).
- **Banned: Ungrouped `*Item` in `Select` / `Menu` / `ContextMenu`** → **Use:** `<Select.Group>`, `<Menu.Group>`, `<ContextMenu.Group>`.
- **Banned: Arbitrary theme/color/font overrides via `className` at call sites** (`bg-red-500`, `font-serif`) → **Use:** `variant`, `colorRole`, `prominence`, `size` props. (Layout classes and structural docking resets like `rounded-none`, `border-0`, `bg-transparent` are allowed.)
- **Banned: Pending approvals inside `<Trace>`** → **Use:** Standalone `<Confirmation>` blocks in the chat stream.
- **Banned: Ad-hoc `@keyframes` / gradient sweeps** → **Use:** `<ShimmerText>` or `<Skeleton>` / `<Skeleton.Reveal>`.
- **Banned: Trigger downgrades (`render={<span />}`)** → **Use:** Semantic `<button>` triggers ("Behavior Wraps the Line").
- **Banned: `@radix-ui/*` imports, raw `<button>`/`<input>`/`<select>`/`<textarea>`/`<dialog>` outside `ui/`, or hand-rolled duplicates** → **Use:** Base UI primitives from `@/components/ui/` (or `<UnstyledButton>`).
- **Banned: Registry bloat** (domain views or auth/SSE flows in `components/blocks/`) → **Use:** `src/features/` or `src/views/`.

## Shadows & Motion
- **Banned: Single-layer muddy shadows, pure black shadows, `shadow-xs`..`2xl` slop, faux `box-shadow` border rings, or shadows on flat controls** → **Use:** `shadow-ambient`, `shadow-ambient-hover`, `shadow-modal` (ink-tinted `rgba(26,28,30,...)`), and real CSS borders for `forced-colors` safety.
- **Banned: `transition-all` on containers** → **Use:** Explicit `transition-[box-shadow,border-color,background-color,transform]`, `transition-[opacity,transform]` (overlays), or `transition-[height]` (accordions).
- **Banned: `filter: blur()` on large text overlays** → **Use:** `opacity` + `transform` on overlays; reserve `--blur-*` for micro-primitives.
- **Banned: Bounce/spring easing on standard UI chrome or double-bounce on checkboxes/switches** → **Use:** `--ease-standard` (`150ms` micro-transitions on high-frequency controls); reserve bounce for celebratory `SuccessCheck`.
- **Banned: Uncapped staggers (> 5 items / > 200ms), missing `prefers-reduced-motion`, or sub-44px dismiss buttons** → **Use:** 40ms stagger capped at 5 items, `motion-reduce:transition-none`, and `min-w-[44px] min-h-[44px]` dismiss targets.
