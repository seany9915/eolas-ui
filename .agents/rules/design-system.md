---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.css, **/*.ts, **/*.js"
description: Project-level design system and accessibility rules — structural tokens, color rules, typography, layout, and WCAG 2.2 AA requirements. Full detail behind the short core contract.
---

# Design System & Accessibility Rules

Whenever generating or modifying UI in this workspace, adhere to the following. The goal is accessibility, cognitive ease, and professional consistency — see [anti-patterns.md](../rules/anti-patterns.md) for the specific list of banned shortcuts this is designed to prevent.

**Source of truth:** @/DESIGN.md — this is mentioned (not just linked) so its full token set is pulled into context automatically whenever this rule fires. It is canonical over anything below; this file only summarizes the *rules*, not the token values themselves.

## Core Directives

- **Structural tokens:** Strictly follow the structural tokens defined in the project root `DESIGN.md` (typography, spacing, borders, radii).
- **Color rules:** Use the semantic colors defined in `DESIGN.md`, mapped as CSS variables in `globals.css`. **Never invent custom hex codes.** If a project has no `DESIGN.md`, fall back to Radix Colors scales purely as a *contrast-ratio reference* (step 3 for soft backgrounds, step 9 for solid components, step 11/12 for text) — this is about borrowing a proven contrast scale, not about adopting Radix as the component library.
- **Component library:** Base UI (`@base-ui/react`) — see [component-library.md](../rules/component-library.md) for the full workflow. Check for an existing primitive before writing a new component.
- **Tailwind v4:** Theme configuration (colors, fonts, radii) lives in `globals.css` under `@theme`. Never create or expect a `tailwind.config.js`/`.ts` file.
- **Tailwind v4 Shorthands:** Enforce `size-*` (`size-4`, `size-10`) for square dimensions instead of `w-* h-*`. Enforce `truncate` for single-line text truncation with ellipsis.
- **Centralized Shimmer & Motion Sweeps:** Never author ad-hoc `@keyframes` or inline gradient sweeps (`animate-pulse bg-gradient-to-r ...`). Always use `<ShimmerText />` for text/reasoning activity and `<Skeleton />` / `<SkeletonReveal />` for container loading states.
- **No Child-Margin Utilities:** Never use `space-y-*` or `space-x-*` child margin hacks. Use `flex flex-col gap-*` or `grid gap-*`.
- **Icon Alignment:** Never apply manual margins (`mr-*`, `ml-*`) on `<Icon>` inside buttons or flex containers. Button gaps are governed by `gap-2`.
- **Iconography:** Material Symbols only, via `material-symbols-outlined`. Always use the `<Icon />` component primitive (`src/components/ui/icon.tsx`) with canonical sizes: `xs` (14px / 0.875rem, metadata/triggers), `sm` (16px / 1rem, compact chips / inline 1rem body readability floor), `md` (20px / 1.25rem, buttons/inputs on 48px touch targets), `lg` (24px / 1.5rem, headers/callouts), `xl` (32px / 2rem, milestone cards). Use `aria-hidden="true"` for decorative icons; `aria-label` or `.sr-only` text for interactive/standalone icons. For dual-state action transitions (e.g. copy $\rightarrow$ check, mute $\rightarrow$ unmute), always use `<Icon.Toggle />` or `<Icon.CrossFade />` rather than raw unmount/mount swaps. Never mix icon libraries or use ad-hoc font-size utilities that drop icons below the 16px readability floor.
- **Design tokens:** Never hardcode pixel values, magic numbers, or ad-hoc colors for spacing, sizing, or color. Always use the project's semantic tokens.

## Descendant-Scoped Dark Surfaces (&:is(.dark *))

When using high-prominence inverted surfaces (such as `<Card prominence="inverted">` with charcoal background `#1a1c1e`), scope child component styling via `.dark` or `&:is(.dark *)`. Child buttons, chips, icons, and text inside inverted cards automatically resolve inverted high-contrast tokens without manual prop drilling.

## Charcoal Container Text

All soft container washes (`primary-container`, `secondary-container`, `tertiary-container`, `error-container`, `warning-container`, `success-container`, `neutral-container`) MUST use neutral charcoal (`#1a1c1e`, `on-*-container`) text ink. Never use chromatic pastel or mid-tone font colors on container washes—dark charcoal guarantees 7:1+ AAA text contrast across all soft callouts and chips.

## Typography & Layout

- Relative units (`rem`/`em`) only. Minimum `line-height` 1.5 body / 1.2 headings. Avoid tight tracking.
- **Font mapping & Type Scale:** Headlines → `font-heading` (`display-lg` 3rem, `display-sm` 2.5rem for tablet/compact hero headers, `headline-lg` 2rem, `headline-md` 1.5rem, `headline-sm` 1.25rem); body, UI controls, labels & metadata → `font-sans` (`font-label` is supported as a legacy alias).
- **Scale Floors & Scoping:** Reading copy, practice tips, and body paragraphs strictly start at a minimum of `1rem` (`16px`, `body-md`). Dense data tables and compact sidebars may use `body-sm` (`0.875rem` / `14px`, `font-sans`, 400 weight) to avoid horizontal blowout; `caption` (`14px`) is strictly reserved for secondary metadata, timestamps, and form helper text.
- **Data Tables & Numeric Alignment:** Never left-align numeric columns in data tables. Columns representing quantities, scores, accuracy rates, durations, timestamps, or currency must be right-aligned (`text-right`) for both column headers (`<th>`) and data cells (`<td>`), paired with tabular figures (`tabular-nums font-mono`). Text and descriptive identifiers remain left-aligned (`text-left`); status tags, chips, and single actions may be center-aligned (`text-center`). When using `<Table />`, pass `numeric: true` on numeric column definitions.
- **Matching Input and Button Heights:** When `<Input />`, `<Select />`, or `<Textarea />` sit side-by-side with a `<Button />` in a horizontal row (search bars, filter toolbars, prompt bars), both controls must share identical computed heights across size tiers (`sm`: 44px, `md`: 48px, `lg`: 56px). Buttons in flex rows must declare `shrink-0 whitespace-nowrap` to prevent label wrapping or crushing when inputs expand. Input icon insets must maintain equal padding on both sides of the icon ($\text{gap}_{\text{edge}\to\text{icon}} = \text{gap}_{\text{icon}\to\text{text}}$), preventing text from hugging leading icons.
- **Semantic Spacing Ladder:** Adhere strictly to the 4-tier vertical rhythm ladder:
  - *Tier 1 (Internal component gaps):* 4px–8px (`gap-1` to `gap-2`).
  - *Tier 2 (Closely related items):* 8px–12px (`gap-2` to `gap-3`).
  - *Tier 3 (Distinct content groups):* 16px–24px (`gap-4` to `gap-6`).
  - *Tier 4 (Major page sections):* 48px–64px (`gap-12` to `gap-16`).
- **Concentric Radii Alignment:** When nesting inner controls inside outer containers, inner corner radius follows $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$.
  - Segmented control (`ToggleGroup`): outer container `rounded` (8px) + `p-1` (4px) $\implies$ inner items use `rounded-sm` (4px).
  - Cards (`rounded-lg` 16px): child elements with $\text{padding} \ge 16\text{px}$ strictly use `rounded-none` (0px) to prevent bubble distortion.
- **Nested Corner Radii:** When nesting an element (media thumbnail, inner card, drill canvas, button) inside a padded container, the inner corner radius must follow the formula $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$.
  - *Inner Radius Floor (0px):* If $\text{padding} \ge R_{\text{outer}}$, use square corners (`rounded-none` / 0px) so the inner corner doesn't bubble ($R_{\text{inner}} = 0$). Never guess or naively duplicate the outer radius.
- **Text Wrap Balancing:** Headings (`h1`–`h6`, `.text-display-*`, `.text-headline-*`) must use `text-wrap: balance` to prevent single-word title orphans. Paragraphs, card descriptions, and long-form prose (`.typeset p, li`, `.text-body-*`) must use `text-wrap: pretty` to eliminate dangling end-of-paragraph orphans without layout performance penalties.
- **Casing:** Full rules (uppercase ban, Title Case allowance, acronym exceptions) live in `DESIGN.md`'s Typography & Iconography section — never use all-caps / `uppercase` / `text-transform: uppercase` on eyebrows, badges/tags/labels, button/action text, or table/list headers. Use size/weight/color for hierarchy instead of casing.
- **Anchor left:** Don't center everything — see `DESIGN.md`'s Layout & Spacing section for the full F-pattern rationale and the narrow exceptions (short celebratory/confirmation messages).
- **Grid:** Follow the responsive column grid defined in `DESIGN.md`'s Layout & Spacing section (12/8/4 columns for desktop/tablet/mobile) exactly — it's this system's structural grid, not a default to second-guess. Separately, avoid forcing content into a rigid, equal-width 3-card layout when the content doesn't warrant it (see anti-patterns.md's "Lateral Pattern Matching"/"Card Grid Rain") — that's a content-arrangement anti-pattern about card layouts, not a critique of the underlying grid system.
- **Responsive Architecture (Container vs. Viewport Queries):**
  - **Core Rule:** *Components adapt to their container, pages adapt to the viewport.*
  - **Component Internals:** Reusable components (`Card`, `Drawer` panels, `Dialog` forms, list items, `Table`) must use Tailwind v4 native container queries (`@container` on the container root wrapper, with `@sm:`, `@md:`, `@lg:` variants on internal elements) rather than viewport media queries (`sm:`, `md:`, `lg:`). This prevents horizontal blowouts when components are embedded in narrow drawers, sidebars, or multi-column grids on wide displays.
  - **Container Query Placement:** `@container` (`container-type: inline-size`) must only be placed on block-level wrapper `<div>`s with a defined width (`w-full` or explicit grid cell bounds). Never place `@container` directly on `<table>`, `<tr>`, or auto-sized flex items — `inline-size` containment breaks browser table layout and causes auto-sized elements to collapse to 0px width.
  - **Page-Level Shells:** Viewport breakpoints (`sm:`, `md:`, `lg:`) are reserved strictly for root page chrome (top-level application header, global page gutters, root application grid).

## Plain-English UI Copy

- **Call things what they are:** Write UI labels, buttons, toasts, and demo examples in direct, real-world terms ("Exercises", "Notes", "Progress", "Clients", "Patients", "Caseload", "Settings", "Saved", "Offline") using 1–2 simple nouns maximum. Never append pompous enterprise suffixes (e.g. if "Caseload" will do, never write "Caseload Repository").
- **Speak from the user's perspective:** Describe user outcomes rather than backend, database, or dev layout mechanics ("Patient added", "Saved", "Session notes saved", "Preview: Full width" — see `anti-patterns.md` for banned mechanics).

## Strict Accessibility (WCAG 2.2 AA)

- Background/text/icon pairings must pass WCAG AA. Follow the accessible color pairings defined in `DESIGN.md` exactly — do not substitute a color that "looks close enough."
- **Tonal separation:** Never pair a tinted background with same-hue text without a real lightness shift. Avoid "triple-monochrome" stacking (see anti-patterns.md).
- **Touch targets:** `DESIGN.md`'s Layout & Spacing section sets the general 2.75rem × 2.75rem (44×44px) floor, with stricter per-component minimums (button height, list row height) defined in their own Components entries — the stricter value always wins.
- **Color independence:** Never convey meaning with color alone — pair with an icon, text label, or structural change.
- **Forms:** Explicit `<FieldGroup>` + `<Field>` and `<FieldLabel>` association. Multi-field stacks use `<FieldGroup className="gap-4">` (or `gap-6`). Never rely on placeholder text as the sole label.
- **Focus:** Never remove `:focus-visible` outlines without a highly visible, high-contrast replacement. Visual order must match DOM order.
- **Semantic HTML & Control Encapsulation:** Never hand-roll interactive controls with `<div>` tags (e.g. `<div onClick>`). Direct `<button>`, `<input>`, `<select>`, `<textarea>`, and native `<dialog>` tags outside primitives are strictly banned — always use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, and `<Dialog>` from `@/components/ui/`. For document structure, use semantic native layout landmarks (`<nav>`, `<header>`, `<main>`, `<aside>`, `<section>`).
- **CSS Generated Content Alt Text (WCAG F87):** Never convey meaningful labels, status, or instructions solely through CSS `content` (`::before`/`::after`) without providing alternative speech text (e.g. `content: url(...) / "Label";` or `content: "badge" / ""`). Prefer inline DOM elements or accessible SVG `<Icon>` with `aria-hidden="true"` and companion `.sr-only` text.
- **Motion:** Follow the duration/easing scale and the mandatory `prefers-reduced-motion` fallback defined in `DESIGN.md`'s Motion & Animation section — see the `transitions-dev`/`transitions-polish` skills for implementation. Optical blur (`--blur-*`) is strictly restricted to compact micro-primitives (`<TextSwap />`, `<Skeleton.Reveal />`); never animate `filter: blur()` on large text overlays (Dialog, Drawer, Popover, Menu).

## Verification

For UI you've just built or changed, if a live page is available, use the `a11y-debugging` skill (Chrome DevTools MCP) to check contrast, focus order, and tap targets rather than only reasoning about it statically.
