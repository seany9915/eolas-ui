---
trigger: glob
globs: "**/*.tsx, **/*.jsx, **/*.css"
description: Banned UI/code/copy anti-patterns and required alternatives. Self-check every finished component against this list.
---

# Anti-Patterns (Banned) → Required Alternatives

## Linter- & Hook-Enforced Bans (Quick Steer)
- **Controls, Imports & Architecture:** Never write raw `<button>`/`<input>`/`<select>`/`<textarea>`/`<dialog>`, hand-rolled `fixed inset-0` overlays, unlabeled icon-only buttons, upward imports (`ui/` → `blocks/`/`features/`, `blocks/` → `features/`/`views/`), or runtime `@base-ui/react*` / `@radix-ui/*` / other headless imports outside `ui/`.
- **Styling & Selectors:** Pass `className` for layout only — no component restyling, `[&_...]` reach-in selectors, `!` modifiers, `dark:*` (`inverted:*` only), inline styles, raw color hex/palette classes, or arbitrary spacing/sizing (`p-[13px]`).
- **Shorthands & Motion:** Use `size-*` (not `w-X h-X`), `gap-*` (not `space-x/y-*`), `h-dvh` (not `h-screen`), sentence case (not `uppercase`), explicit `transition-[...]` (not `transition-all`), and `--ease-standard` (reserve spring/bounce for `SuccessCheck`).
- **Color, Cards & Icons:** Never use triple-tint pills (pick Filled, Outline + neutral `surface`, or Soft Wash), light-surface `*-tertiary` accents, nested `<Card>`, sparkle icons (`stars`, `auto_awesome`, `auto_fix_high`), decorative emojis, or `<Icon>` `mr-*`/`ml-*`.
- **Code & Copy Safety:** Never leave `// TODO` stubs, `any` / `as unknown as T` / `@ts-ignore`, unguarded `Enter` submission without `isComposing`, positive `tabIndex > 0`, AI cliché buzzwords, dev/DB/CSS jargon, or hardcoded secrets.

## Non-Lintable Design, UX & Accessibility Anti-Patterns

### Color, Badges & Surfaces
- **Banned: Static status dots or text-less indicators** → **Use:** Plain text, `<Badge />`, or functional icons (dots are strictly for live/recording presence paired with text).
- **Banned: `surface-container-low`/`high` fill + `outline-variant` border** → **Use:** `outline` (`#706E6B`) when a neutral tinted surface needs a boundary.
- **Banned: Single-sided accent borders on rounded cards** → **Use:** `border border-transparent` cards; reserve `rounded-s-none rounded-e` + `border-s-4` for `<InlineAlert />` and `<Toast />`.
- **Banned: `InlineAlert` for routine tips** → **Use:** `<ClinicianTip />` (`unboxed` in cards; `surface`/`inset` on canvas).

### Interaction, Focus & Accessibility
- **Banned: Hover-only actions or pointer-only drag-and-drop** → **Use:** `:focus-within`, persistent visible touch controls, and keyboard move actions.
- **Banned: Focus vs. selection ambiguity** (`outline-offset: 0` on selectable containers) → **Use:** Floating `outline-offset: 2px` for focus; flush `2px` border + surface wash for selection.
- **Banned: Unlabelled inputs or placeholder-only labels** → **Use:** `<FieldGroup>` + `<Field>` + `<FieldLabel>` (and `<FieldDescription>`/`<FieldError>`).
- **Banned: Trigger downgrades (`render={<span />}`)** → **Use:** Real `<button>` triggers ("Behavior Wraps the Line").
- **Banned: Titleless overlays or manual overlay `z-index` outside `ui/`** → **Use:** `<DialogTitle>`/`<DrawerTitle>` (or `sr-only`) and let `ui/` portals handle stacking.
- **Banned: Ungrouped `*Item`s in `Select`/`Menu`/`ContextMenu`** → **Use:** `Select.Group`, `Menu.Group`, `ContextMenu.Group`.

### Layout, Structure & Component Discipline
- **Banned: `1fr`/`flex` overflow traps or `order-*` on interactive controls** → **Use:** `minmax(0, 1fr)` / `min-w-0`, and match DOM order to tab order.
- **Banned: Unstructured cards, Card Soup ("Card Grid Rain"), or Div Soup wrappers** (`<Box>`, `<Flex>`, `<Spacer>`) → **Use:** `<Card.Header>`/`<Card.Title>`/`<Card.Description>`/`<Card.Action>`/`<Card.Content>`/`<Card.Footer>`, typography/dividers/tables/accordions, and plain semantic elements or `flex`/`grid` `<div>`s.
- **Banned: Desktop FABs, marketing hero banners on workspace views, or empty/Lorem Ipsum mocks** → **Use:** Inline actions, side drawers, page headers, and realistic populated + loading + empty states.
- **Banned: Viewport breakpoints inside reusable components** → **Use:** `@container` on a defined-width wrapper + `@sm:`/`@md:`/`@lg:`.
- **Banned: Start-aligned numeric table columns, stacked vertical icon-over-text buttons, or `<Button>` loops for mode bars** → **Use:** `text-end tabular-nums font-mono`, inline icon + label, and `<ToggleGroup>`.
- **Banned: Arbitrary `0px`-clamped nested radii, sibling height drift, wrapping `ToggleGroup` labels, or asymmetric icon insets** → **Use:** $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$ (clean `p-1` segmented shells keep `rounded-sm`), matching `sm`/`md`/`lg` height tiers, `Select`/`Radio` in narrow columns, `shrink-0 whitespace-nowrap`, and symmetric icon padding.
- **Banned: Manual `relative`/`absolute` input buttons, heavy blurs on inputs/overlays, or pending approvals inside `<Trace>`** → **Use:** `<InputGroup>`, inline editing / `opacity` + `transform` (keep `--blur-*` on micro-primitives), and standalone `<Confirmation>` blocks.
- **Banned: Ad-hoc `@keyframes` shimmer sweeps, single-layer/black/faux shadows, uncapped staggers (>5 items / >200ms), or missing reduced-motion fallbacks** → **Use:** `<ShimmerText>`/`<Skeleton>`, `shadow-ambient`/`shadow-ambient-hover`/`shadow-modal` + real CSS borders, `40ms` stagger capped at 5 items, and `motion-reduce:transition-none`.
- **Banned: Registry bloat** (`blocks/` containing auth/DB/SSE views) → **Use:** `src/features/` or `src/views/`.

### Editorial Copy
- **Banned: Pre-heading eyebrow kickers, decorative `01`/Roman prefixes, `LABEL // YEAR`, invented metrics, or "Click here"/identical links** → **Use:** Direct headings, `[metric]` placeholders, plain everyday 1–2 noun labels, and descriptive unique link text.
