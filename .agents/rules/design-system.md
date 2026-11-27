---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.css"
description: Project-level design system and WCAG 2.2 AA implementation rules for UI and CSS files.
---

# Design System & Accessibility Rules

**Source of truth:** [DESIGN.md](../../DESIGN.md). *(Oxlint already enforces raw colors, arbitrary values, `size-*`/`gap-*`/`h-dvh` shorthands, `dark:*`, `!`, `uppercase`, `transition-all`, spring easing, triple-tint, light-surface `*-tertiary`, icon margins/labels, and component restyle contracts.)* Check [anti-patterns.md](../rules/anti-patterns.md) before finishing.

## Styling & Surface Judgment
- **Tailwind v4:** Theme tokens live in `src/globals.css` (or `src/eolas-theme.css`). Never create `tailwind.config.js`/`.ts` or invent custom hex codes.
- **Icons & Loading:** Material Symbols only via `<Icon size="..." />` (`src/components/ui/icon.tsx`); use `<Icon.Toggle />` / `<Icon.CrossFade />` for state swaps, `<ShimmerText />` for text shimmer, and `<Skeleton />` / `<Skeleton.Reveal />` for placeholders.
- **Inverted Surfaces (`<Card prominence="inverted">`):** Scope styling via `[data-surface="inverted"]` / `inverted:*`, not `.dark`.
- **Container Text Split:** Callouts, `InlineAlert`s, and tinted cards keep `#1C1A18` (`text-on-surface`) body copy without colored perimeter borders; `<Badge />`/`<Chip />` `variant="soft"` pills drop borders and use semantic `on-*-container` ink.

## Layout, Typography & Responsive Structure
- **Units & Type:** Relative units (`rem`/`em`) only. Body copy starts at `1rem` (`body-md`); dense tables/sidebars/metadata use `body-sm`/`caption` (`0.875rem`). Headings use `font-heading` + `text-wrap: balance`; prose uses `font-sans` + `text-wrap: pretty`. Never justify text.
- **Data Tables:** End-align (`text-end`) numeric `<th>`/`<td>` cells with `tabular-nums font-mono` (or `numeric: true` on `<Table />`).
- **Control Height Synchrony:** Match outer bounding-box tiers (`sm` 44px, `md` 48px, `lg` 56px per `DESIGN.md` 3-family matrix) across row/grid siblings. Use `Select`/`Radio` when `ToggleGroup` labels would wrap in narrow columns, and keep `shrink-0 whitespace-nowrap` on row buttons.
- **Concentric Radii:** Tight `p-1` segmented shells (`ToggleGroup`) step down to `rounded-sm` (`4px`); nested cards/media follow $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$ (clamped to `rounded` / `8px`).
- **Container vs. Viewport Queries:** Declare `@container` (`w-full` or grid cell — never `<table>`, `<tr>`, or auto-sized flex) + `@sm:`/`@md:`/`@lg:` inside reusable components/blocks; reserve viewport breakpoints (`sm:`, `md:`, `lg:`) for page shells and the 12/8/4 grid.

## WCAG 2.2 AA & Verification
- **Contrast & Tap Targets:** Never convey state by color alone. Maintain `24×24px` minimum everywhere and `44×44px` (`2.75rem`) for standalone controls/dismiss actions without horizontal hit-target overlap in dense grids.
- **Forms, Auth & Focus:** Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>` (never placeholder-only), auto-focus invalid controls (`<Form focusFirstInvalid />`), never block paste/autofill on auth inputs, keep `scroll-padding-block-start`/`end` for sticky bars, set `enterKeyHint`/`inputMode`/`autoComplete`, use semantic landmarks, never hide `:focus-visible` outlines, and never convey meaningful text solely via CSS `content`.
- **Touch, Tablet & Scroll Discipline:** Give each shell a single scroll owner (`h-dvh overflow-hidden` + `overscroll-contain` `<main>` with `AppShell`-scoped root lock, or document scroll — never both). Never infer touch from width (`md:opacity-0`) or branch React on primary `(pointer: coarse)` (which breaks hybrid Magic Keyboard iPads); gate hover/mouse affordances with `[@media(hover:hover)_and_(pointer:fine)]` or `[@media(any-hover:hover)_and_(any-pointer:fine)]` and keep `<Tooltip>` mounted for `:focus-visible`. Never set `touch-pan-*` on generic `ScrollArea` (use cross-axis `overflow-*-hidden`), pair single-axis JS carousels with `touch-pinch-zoom`, scope `touch-none` strictly to dedicated drag handles, provide `:active` feedback + `touch-manipulation` on touch controls, keep `-webkit-touch-callout: none` off `<a>`, and pad fixed edge chrome with vertical + horizontal `env(safe-area-inset-*, 0px)`.
- **Composers, Shortcuts & Motion:** Handle mobile virtual keyboards (`visualViewport`/safe bottom insets) on docked composers, format `mod+` per OS in `<Kbd>` with `aria-keyshortcuts`, restrict `--blur-*` to micro-primitives (`<TextSwap />`, `<Skeleton.Reveal />`, `<Icon.Toggle />`), include `motion-reduce:transition-none`, use plain everyday English UI copy, and verify live Desktop (top + scrolled), Tablet (`744×1133` iPad Mini / `820×1180` iPad), and Mobile (`390×844`) views via Chrome DevTools MCP + `a11y-debugging` (plus physical iPad/iPhone hardware for WebKit/Safari `dvh`, short-container `overscroll`, and `:active`).
