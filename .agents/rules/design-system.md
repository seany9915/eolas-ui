---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.css"
description: Project-level design system and WCAG 2.2 AA implementation rules for UI and CSS files.
---

# Design System & Accessibility Rules

**Source of truth:** @/DESIGN.md — canonical over anything below for all token values, contrast pairings, motion scales, and component specs. Check [anti-patterns.md](../rules/anti-patterns.md) before finishing any UI task.

## Styling & Token Directives
- **Tailwind v4:** Theme tokens live in `src/globals.css` under `@theme`. Never create a `tailwind.config.js`/`.ts` file or invent custom hex codes.
- **Component library:** Base UI (`@base-ui/react`) — see [component-library.md](../rules/component-library.md).
- **Shorthands:** Enforce `size-*` (`size-4`, `size-10`) over `w-* h-*` for square elements, and `truncate` over multi-class ellipsis strings.
- **Flex/Grid gaps:** Never use `space-y-*` or `space-x-*`; use `flex flex-col gap-*` or `grid gap-*`.
- **Icons:** Material Symbols only via `<Icon size="..." />` (`src/components/ui/icon.tsx`)—never add `mr-*`/`ml-*` inside buttons/flex containers (parent `gap-2` governs spacing). Use `aria-hidden="true"` on decorative icons, `aria-label`/`.sr-only` on standalone interactive icons, and `<Icon.Toggle />` / `<Icon.CrossFade />` for dual-state swaps.
- **Centralized loading/shimmer:** Never write ad-hoc `@keyframes` or gradient sweeps; use `<ShimmerText />` for text/reasoning and `<Skeleton />` / `<Skeleton.Reveal />` for spatial placeholders.
- **Descendant-scoped inverted surfaces:** For `<Card prominence="inverted">` (`#1a1c1e`), scope child styling via `[data-surface="inverted"]` or `&:is([data-surface="inverted"] *)` rather than `.dark` (reserved for a potential app-wide dark theme).
- **Container text split:** Callouts, `InlineAlert`s, and tinted cards keep `#1a1c1e` (`text-on-surface`) body copy with no colored perimeter borders. Small `<Badge />` and `<Chip />` soft pills (`variant="soft"`) drop the border (`border-transparent`) and use their ultra-dark semantic `on-*-container` tokens (`#001849`, `#00201c`, `#261900`, `#450a0a`, `#331400`, `#052e16`, `#1a1c1e`).

## Layout, Typography & Responsive Architecture
- **Units & scales:** Relative units (`rem`/`em`) only. Body copy/tips start at `1rem` (`body-md`); dense tables/sidebars/metadata use `body-sm`/`caption` (`0.875rem`). Headings use `font-heading` + `text-wrap: balance`; paragraphs/prose use `font-sans` + `text-wrap: pretty`.
- **No uppercase or justified text:** Never apply `uppercase` (`text-transform: uppercase`) or `text-align: justify`.
- **Data tables:** Right-align (`text-right`) numeric columns (headers `<th>` and cells `<td>`) with `tabular-nums font-mono` (or `numeric: true` on `<Table />`).
- **Control height synchrony:** Side-by-side `<Input />`, `<Select />`, `<Textarea />`, and `<Button />` must share identical heights (`sm`: 44px, `md`: 48px, `lg`: 56px); buttons in flex rows use `shrink-0 whitespace-nowrap`.
- **Concentric nested radii:** Tight `p-1` segmented shells (`ToggleGroup`) step down to `rounded-sm` (`4px`). Nested media/cards/panels follow $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$ (clamping to `rounded` / `8px` rather than `0px`).
- **Container vs. viewport queries:** Reusable components/blocks declare `@container` on a block-level wrapper with defined width (`w-full` or grid cell) and use `@sm:`/`@md:`/`@lg:` internally—never `<table>`, `<tr>`, or auto-sized flex items. Viewport breakpoints (`sm:`, `md:`, `lg:`) are reserved for page-level shells and the 12/8/4 grid in `DESIGN.md`.

## Strict Accessibility (WCAG 2.2 AA) & Copy
- **Contrast & color independence:** Follow `DESIGN.md` pairings exactly; never convey state by color alone.
- **Touch targets:** `44×44px` (`2.75rem`) floor (WCAG 2.2 SC 2.5.5) with stricter per-component minimums (`48px` buttons, `56px` interactive list rows) in `DESIGN.md`.
- **Forms & landmarks:** Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>` (never placeholder-only labels). Use semantic landmarks (`<nav>`, `<header>`, `<main>`, `<aside>`, `<section>`).
- **Focus & CSS content:** Never remove `:focus-visible` outlines. Never convey meaningful text solely via CSS `content` without alternative speech text (WCAG F87).
- **Motion:** Use `DESIGN.md` durations/easings, explicit `transition-[...]` (never `transition-all`), and mandatory `motion-reduce:transition-none` / `prefers-reduced-motion`. Restrict `--blur-*` to micro-primitives (`<TextSwap />`, `<Skeleton.Reveal />`, `<Icon.Toggle />`), never large text overlays.
- **Plain-English UI copy:** 1–2 simple nouns per label, user-outcome phrasing, zero dev/DB/CSS jargon.
- **Verification:** When a live page is available, audit contrast, focus order, and tap targets with the `a11y-debugging` skill (Chrome DevTools MCP).
