---
name: Eolas High-Contrast Accessible
colors:
  background: '#EFF2F7'
  on-background: '#1a1c1e'
  surface: '#ffffff'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434656'
  surface-container: '#EBF0F8'
  surface-variant: '#DDE1EB'
  outline: '#6B6E80'
  outline-variant: '#BEC6D6'
  primary: '#0052FF'
  on-primary: '#ffffff'
  primary-container: '#dce6ff'
  on-primary-container: '#001849'
  secondary: '#00796B'
  on-secondary: '#ffffff'
  secondary-container: '#D5F0EE'
  on-secondary-container: '#00201c'
  tertiary: '#F9A825'
  on-tertiary: '#1a1c1e'
  tertiary-container: '#fff0c2'
  on-tertiary-container: '#261900'
  error: '#C4161C'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#450a0a'
  warning: '#A64B00'
  on-warning: '#ffffff'
  warning-container: '#FDE3B8'
  on-warning-container: '#331400'
  success: '#157331'
  on-success: '#ffffff'
  success-container: '#c8f5ce'
  on-success-container: '#052e16'
  neutral: '#1a1c1e'
  on-neutral: '#ffffff'
  neutral-container: '#D1D5DF'
  on-neutral-container: '#1a1c1e'
borderWidth:
  default: 1px
  emphasis: 2px
  accent: 4px
typography:
  display-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 1.25
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 1.25
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 1.25
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 1.35
  headline-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.4
  body-lg:
    fontFamily: Lexend
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.55
  body-md:
    fontFamily: Lexend
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5
  body-sm:
    fontFamily: Lexend
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45
  label-lg:
    fontFamily: Lexend
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.45
    letterSpacing: 0.01em
  label-md:
    fontFamily: Lexend
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Lexend
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1.35
    letterSpacing: 0.03em
  caption:
    fontFamily: Lexend
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45
  code-md:
    fontFamily: Roboto Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  full: 9999px
shadows:
  ambient: 0 1px 3px rgba(26, 28, 30, 0.04), 0 4px 12px rgba(26, 28, 30, 0.06)
  ambient-hover: 0 2px 4px rgba(26, 28, 30, 0.04), 0 8px 20px rgba(26, 28, 30, 0.08)
  modal: 0 2px 6px rgba(26, 28, 30, 0.04), 0 8px 20px rgba(26, 28, 30, 0.06), 0 20px 48px rgba(26, 28, 30, 0.12)
motion:
  durations:
    stagger: 40ms
    micro: 80ms
    quick: 150ms
    fast: 250ms
    medium: 350ms
    slow: 400ms
    emphasis: 500ms # semantic intent alias matching very-slow
    very-slow: 500ms
  easing:
    standard: cubic-bezier(0.22, 1, 0.36, 1)
    smooth-out: cubic-bezier(0.22, 1, 0.36, 1) # semantic alias for standard easing
    exit: cubic-bezier(0.4, 0, 1, 1)
    in-out: ease-in-out
    bounce: cubic-bezier(0.34, 1.36, 0.64, 1)
  scales:
    large: 0.96
    medium: 0.97
    small: 0.98
    tiny: 0.99
  distances:
    micro: 4px
    small: 6px
    base: 8px
    medium: 12px
    roomy: 16px
  blurs:
    small: 2px
    medium: 3px
spacing:
  base: 0.5rem
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 4rem
  container-max: 80rem
  measure: 40rem
---

## Brand & Style

**Eolas** is an everyday speech therapy app for pronunciation and communication practice at home, school, or with a therapist. UI copy must stay simple, human, and direct in plain, everyday English. The visual style pairs **Minimalism** (generous whitespace, clear grid) with **High-Contrast** colors meeting WCAG 2.2 AA (or AAA) for low-vision, dyslexic, and cognitive accessibility.

## Colors

### 1. Visual Hierarchy & Palette Roles

1. **Interactive Driver (`primary`, `#0052FF`):** `primary` / `on-primary` (`#ffffff`, solid); `primary-container` (`#dce6ff`) / `on-primary-container` (`#001849`, soft). Core interactive anchor: primary CTAs, active selections, focus rings, active nav, and brand ID.
2. **Supporting Accents (`secondary` & `tertiary`, optional):**
   * **Secondary (`#00796B`, Rich Emerald):** `secondary` / `on-secondary` (`#ffffff`, solid); `secondary-container` (`#D5F0EE`) / `on-secondary-container` (`#00201c`, soft). High-contrast supporting accent (`5.32:1` on white; `4.74:1` on `#EFF2F7` canvas) for auxiliary actions, category badges (`<Badge colorRole="secondary">`), `<ClinicianTip />`, and multi-series charts. Distinct from `success` (`#157331`). Usable at all emphasis tiers (Filled, Outline, Text).
   * **Tertiary (`#F9A825`, Sunny Amber):** `tertiary` / `on-tertiary` (`#1a1c1e`, solid); `tertiary-container` (`#fff0c2`) / `on-tertiary-container` (`#261900`, soft). Warm highlight accent for spotlight cards (`prominence="inverted"`), badge highlights, and milestones.
     * *Contrast Constraint:* **Never use `#F9A825` for text (`text-tertiary`) or borders on light backgrounds** (`1.97:1`, fails AA). Approved uses: (1) `tertiary-container` wash + `on-tertiary-container`; (2) solid `tertiary` fill + `#1a1c1e` ink; (3) foreground on dark `on-surface` (`#1a1c1e`) Inverted Cards (`8.67:1` AAA).
3. **Container Text (Split by Component Size):**
   * **Callouts, InlineAlerts & Tinted Cards:** Keep multi-line body copy in neutral charcoal (`#1a1c1e`, `text-on-surface`) and omit colored perimeter borders.
   * **Small `<Badge />` & `<Chip />` Pills (`variant="soft"`):** Drop the border (`border-transparent`) to avoid triple-tint, and pair `*-container` fills with ultra-dark semantic `on-*-container` tokens (`#001849`, `#00201c`, `#261900`, `#450a0a`, `#331400`, `#052e16`, `#1a1c1e`).

### 2. State & Status Colors (Error / Warning / Success / Neutral)

Reserved strictly for system, operational, and task state (including exercise correct/incorrect feedback and offline/sync status)—never substitute brand accents (`primary`/`secondary`/`tertiary`):

* **Error (`#C4161C`, Red):** `error` / `on-error` (`#ffffff`); `error-container` (`#ffdad6`) / `on-error-container` (`#450a0a`). Validation errors, destructive actions, failed states, and incorrect-answer exercise feedback.
* **Warning (`#A64B00`, Burnt Orange):** `warning` / `on-warning` (`#ffffff`); `warning-container` (`#FDE3B8`) / `on-warning-container` (`#331400`). Non-blocking cautions ("session expiring soon", "unsaved changes")—distinct from `tertiary` amber.
* **Success (`#157331`, Deep Green):** `success` / `on-success` (`#ffffff`); `success-container` (`#c8f5ce`) / `on-success-container` (`#052e16`). Completed actions, saved confirmations, passed checks, and correct-answer exercise feedback (use `success`, not `secondary`).
* **Neutral (`#1a1c1e`, Charcoal):** `neutral` / `on-neutral` (`#ffffff`); `neutral-container` (`#D1D5DF`, `11.63:1` AAA vs `#1a1c1e`) / `on-neutral-container` (`#1a1c1e`). Non-critical operational status (offline mode, sync pending, read-only) in `InlineAlert` (`role="neutral"`) and `Chip` (`colorRole="neutral"`). `on-surface` (`#1a1c1e`) and `surface` (`#ffffff`) may also be used directly for `InlineAlert` bars/icons.

### 3. Surface Hierarchy

1. **Low Prominence (Canvas & Dividers — default):** `background` (`#EFF2F7`) with `outline-variant` (`#BEC6D6`) 1px dividers, typography, and whitespace. Forms the majority of any view (tables, lists, full-width sections).
2. **Medium Prominence (Grouping & Cards):**
   * *Grouped Fill:* `surface-container` (`#EBF0F8`, flat, desaturated slate) to cluster fields/controls inside white cards without competing with saturated `primary-container` (`#dce6ff`). If placed directly on `#EFF2F7` canvas, pair with a `1px` `outline-variant` border.
   * *Standard Cards:* White `surface` (`#ffffff`) with `border border-transparent` + ambient elevation (`shadow-[0_1px_3px_rgba(26,28,30,0.06),0_1px_2px_rgba(26,28,30,0.04)]`).
   * *Accent Cards (Deprecated):* Use Standard Cards with internal `<Badge colorRole="secondary">` or `<ClinicianTip />`.
3. **High Prominence (Spotlight & Hero):**
   * *Inverted Card (`prominence="inverted"`):* Solid `on-surface` (`#1a1c1e`) with `invertedAccent="tertiary"` or pure white.
   * *Filled Card (`prominence="filled"`):* Saturated brand fill (`primary`, `secondary`, `tertiary`) with `on-*` text for solitary milestones/highlights (use Selectable Cards or `ToggleGroup` for choice sets).
   * Reserve High Prominence for primary focal points; never nest a Card inside another Card.

* **Borders & Chrome:** `outline-variant` (`#BEC6D6`) for `1px` structural dividers and passive overlay borders (Menus, Popovers, Dialogs); `outline` (`#6B6E80`) for interactive form-control boundaries. Top nav bar uses `surface` + `1px` `outline-variant` bottom border. Tooltips use solid dark `on-surface` (`#1a1c1e`) with white text.
* **`surface-variant` (`#DDE1EB`) — internal neutral fill:** Paired with `on-surface-variant` (`#434656`, `7.13:1` AAA) for single-component internals (avatar fallbacks, progress tracks, skeletons, selected menu rows). Pair with `outline` (`#6B6E80`, `3.85:1+`) for interactive borders (`Switch`, `Slider`), or `outline-variant` for passive perimeters.
* **`<ClinicianTip />`:** Unboxed inline lockup inside cards/forms (`20px` `secondary` icon + `text-base text-on-surface-variant` + optional bold lead-in); on canvas outside cards, use `bg-surface-container rounded-md px-3.5 py-2.5 border border-outline-variant`.

### 4. Tonal & Callout Backdrops
* Never place saturated fills under small body text without `on-primary`/`on-secondary`/`on-error`/`on-warning`/`on-success` (white) or `on-tertiary` (`#1a1c1e` charcoal—never white on Amber).
* Use `<InlineAlert />` (`rounded-s-none rounded-e`, `4px` start accent bar) for urgent/stateful alerts; use `<ClinicianTip />` for routine tips.
* Reserve `bg-primary-container` (`#dce6ff`) + `2px` `primary` border for active selection on interactive containers (`<Card affordance="selectable" selected />`).

## Voice & Tone

- **Plain English:** Target UK Grade 6–8 (~Flesch-Kincaid 60–70). One idea per sentence (~20 words max), direct second person ("you"), active voice, present tense. Calm and encouraging—never patronizing or hype-heavy.
- **UI Microcopy:** 1–2 simple nouns per label ("Exercises", "Notes", "Progress", "Clients", "Patients", "Caseload", "Settings", "Saved", "Offline"). Describe user outcomes ("Patient added", "Session notes saved", "Preview: Full width"), never dev/DB/CSS jargon. Only show verifiable app states.
- **Links:** Descriptive action text ("Learn more about breathing exercises")—never "click here"; give repeated generic links unique `aria-label`s.
- **Skills:** `govuk-style` (general UI/docs), `patient-communication` (patient letters), `easy-read` (cognitive/learning disabilities).

## Typography & Iconography

- **Tailwind Font Mapping:**
  * **Atkinson Hyperlegible Next** (Headlines & display) → `font-heading`
  * **Lexend** (Body, UI controls, labels, metadata) → `font-sans` (`font-label` supported as alias)
  * **Roboto Mono** (Code, numeric data) → `font-mono`
- **Scale & Floors:**
  * `display-lg` (`3rem`/48px, 700) for desktop/marketing heroes; `display-sm` (`2.5rem`/40px, 700) for compact/tablet heroes; `headline-lg` (`2rem`/32px, 600).
  * **Body & prose floor:** Strict `1rem` (`16px`, `body-md`) minimum for primary instructions, tips, and paragraphs.
  * **Dense tables & secondary metadata:** `body-sm` (`0.875rem`/14px, 400, 1.45 line-height; `caption` is alias). Never use for main prose.
  * **Compact badges/timestamps:** `label-md` (`0.8125rem`/13px) and `label-sm` (`0.75rem`/12px) with `font-semibold` (600 weight, never 700 at 12px). Avoid weights below 400.
- **Formatting Rules:**
  * **No uppercase (`text-transform: uppercase`):** Use size, weight, and tracking for hierarchy. Sentence case for body; Title Case allowed for headings, buttons, nav. Standard acronyms (`WCAG`, `UI`, `SLT`, `ADHD`, `FAB`) stay capitalized.
  * **Emphasis:** Bold weight is primary. Block-level italic paragraphs and decorative italic UI styling are prohibited; inline `<em>` / `*em*` is permitted only for linguistic emphasis, phonetic stress markers, and clinical/bibliographic citations.
  * **Alignment & Wrapping:** Always left-aligned ragged-right (never `text-align: justify`). Enforce `text-wrap: balance` on headings (`h1`–`h6`, `.text-display-*`, `.text-headline-*`) and `text-wrap: pretty` on prose (`p`, `li`, `.text-body-*`).
  * **Underline:** Hyperlinks only.
  * **Heading hierarchy & Measure:** Never skip heading levels (`h1` → `h3`). Cap long-form prose at `measure` (`max-width: 40rem`, ~65–75 chars).

### Long-Form Content Rhythm (`.typeset`)
For rendered long-form content (guides, chat messages, leaflets), map shadcn Typeset variables to Eolas tokens:

```css
.typeset {
  --typeset-font-body: var(--font-sans);
  --typeset-font-heading: var(--font-heading);
  --typeset-font-mono: var(--font-mono);
  --typeset-size: 1em;
  --typeset-leading: 1.5;
  --typeset-flow: 1.25em;
}
.typeset h1 { font-size: 1.875em; }
.typeset h2 { font-size: 1.5em; }
.typeset h3 { font-size: 1.25em; }
.typeset h4 { font-size: 1.125em; }
```

- **Presets & Rules:** Never nest `.typeset` containers. Use `.typeset-chat` (`--typeset-flow: 1em; --typeset-leading: 1.5`), `.typeset-guide` (`--typeset-size: 1.125em; --typeset-leading: 1.55; --typeset-flow: 1.5em`), and a user-facing `.typeset-large` accessibility toggle (`--typeset-size: 1.25em; --typeset-leading: 1.8; --typeset-flow: 1.75em`). Apply `max-width: 40rem` (`measure`) on the wrapper, and mark embedded interactive components with `.not-typeset` / `data-not-typeset`.

### Material Symbols (Iconography)
- Use `<Icon size="..." />` (`src/components/ui/icon.tsx`, `material-symbols-outlined`)—never mix icon libraries or apply raw Tailwind text utilities (`text-xs` = 12px) that drop below the `14px` `xs` floor:
  * `xs` (`14px` / `0.875rem`): Micro triggers, inline metadata, table actions.
  * `sm` (`16px` / `1rem`): Compact chips, metadata badges, inline close triggers.
  * `md` (`20px` / `1.25rem`): Form leading icons, standard buttons, menu rows.
  * `lg` (`24px` / `1.5rem`): Alert headers, toast indicators, section titles.
  * `xl` (`32px` / `2rem`): Hero cards, milestones, victory dialogs.
- **Accessibility, RTL & Swaps:** `aria-hidden="true"` on decorative icons; `.sr-only` or `aria-label` on standalone interactive icons (never convey text solely via CSS `content` without alt text per WCAG F87). Pass `directional` (`icon-directional`) on arrows, chevrons, undo/redo, and speaker waves so RTL layouts mirror them (`scale: -1 1`), while never flipping checkmarks, clocks, or media playback icons. Use `<Icon.Toggle onName="..." offName="..." active={...} />` or `<Icon.CrossFade name={...} />` for dual-state swaps (`150ms` `--duration-quick`, `--ease-standard`, `--blur-small`, instantaneous in `prefers-reduced-motion`).

## Layout & Spacing

Fluid grid on an `0.5rem` (8px) baseline:
- **Desktop (`80rem` / 1280px max):** 12-col, `1.5rem` gutter, `4rem` side margin (`margin-desktop`).
- **Tablet (`48rem`–`79.9375rem`):** 8-col, `1.5rem` gutter, `2rem` side margin (`margin-tablet`).
- **Mobile (`0rem`–`47.9375rem`):** 4-col, `1rem` gutter (`gutter-mobile`), `1rem` side margin (`margin-mobile`).
- **Section rhythm & alignment:** `4rem`–`5rem` between major sections. Left-align body content, forms, and lists (reserve centering for short celebratory/empty states).
- **Container vs. Viewport Queries:** *Components adapt to their container, pages adapt to the viewport.* Blocks/components place `@container` on a defined-width wrapper (`w-full` or grid cell, never `<table>`/`<tr>`/auto-sized flex) and use `@sm:`/`@md:`/`@lg:` internally; viewport breakpoints (`sm:`, `md:`, `lg:`, `xl:`) are reserved for page-level shells.
- **Touch targets:** `2.75rem × 2.75rem` (`44×44px`) general floor (WCAG 2.2 SC 2.5.5 Enhanced, exceeding SC 2.5.8's `24×24px` AA floor), with stricter per-component minimums (Buttons `48px`, interactive Lists `56px`). Expand hit areas for smaller visual controls without clipping focus rings (`overflow-hidden` banned on hit-target wrappers). *(Exception: ≤320px OTP boxes scale to `40×48px` under WCAG 1.4.10).*

## Elevation & Depth

- **Borderless Cards (with High-Contrast Fallback):** Standard cards use `border border-transparent` on `surface` (`#ffffff`) over `background` (`#EFF2F7`) + ambient elevation (`shadow-[0_1px_3px_rgba(26,28,30,0.06),0_1px_2px_rgba(26,28,30,0.04)]`), staying visually borderless while rendering a system border in `forced-colors: active`.
- **Elevation Budget (3 Tiers):** All shadows are ink-tinted (`rgba(26, 28, 30, ...)`, never `#000000`):
  - `shadow-ambient`: Standard cards and Tier B overlays.
  - `shadow-ambient-hover`: Interactive card hover lift.
  - `shadow-modal`: Tier A blocking dialogs and drawers over backdrop scrims.
  - *Zero-Shadow Baseline:* Header/Nav (except sticky nav via `@container scroll-state(stuck: top)`), Toolbars, Buttons, Inputs, Chips, and InlineAlerts have zero box-shadow.
- **Physical Borders Over Faux Shadow Rings:** Never use `box-shadow: 0 0 0 1px ...` in place of a real border (stripped in `forced-colors: active`). Overlays keep real `1px` `outline-variant` borders; form controls keep `1px` `outline` (`#6B6E80`) borders for 3:1 non-text contrast (WCAG 1.4.11).
- **Control Height Synchrony & Optical Padding:** Side-by-side `<Input />`, `<Select />`, `<Textarea />`, and `<Button />` must share identical heights (`sm`: `44px` `h-11`, `md`: `48px` `h-12`, `lg`: `56px` `h-14`). Buttons in flex rows declare `shrink-0 whitespace-nowrap`, and icon+text buttons shave `2px–4px` off the icon-side padding (`icon-side = text-side - 2px–4px`) to balance glyph whitespace. Match icon padding on both sides of leading icons (`pl-12` on `md` inputs = `14px` inset + `20px` icon + `14px` gap).
- **Floating Container Tiers:**
  - **Tier A — Modal (Dialog, Drawer):** `shadow-modal` + scrim. `Dialog` uses `rounded.lg` (`16px`) + `1px` `outline-variant` border. Full-height `Drawer` uses `rounded-none` + single dividing `2px` border.
  - **Tier B — Anchored (Popover, Menu, Select, Combobox):** `rounded.DEFAULT` (`8px`), `1px` `outline-variant` border, `shadow-ambient`.
  - **Tier C — Ambient (Toast):** `rounded-s-none rounded-e`, `4px` start accent bar (`border-s-4`), `shadow-ambient`.
- **Focus States vs. Active Selection:**
  - **Hollow form controls** (`Input`, `Select`, `Textarea`, `OTPField`, `Combobox`, `Autocomplete`, `NumberField`): `border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary`.
  - **Buttons, Cards, Checkbox, Switch:** Floating `outline-offset: 2px` (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`). Circular **Radio** uses `focus-visible:outline-offset-[3px]`.
  - **Selectable Cards:** Active selection uses flush `2px` `border-primary` + `bg-primary-container` (`#dce6ff`); when focused, both the flush selection border and floating `2px` outer focus ring are visible.

## Motion & Animation

Motion clarifies state changes—quick, understated, never bouncy on standard chrome. Implementations live in `transitions-dev` / `transitions-polish`.

### The 5 Rules for Motion Polish
1. **Open / Close Asymmetry (Close $\le$ Open):** Dismiss transitions are always as fast or faster than entrances.
2. **Intent Delays:** `100–150ms` (`--duration-quick`) delay before opening hovercards/tooltips.
3. **Physical Travel Distances:** `--distance-micro` (`4px`, text swaps/nudges), `--distance-small` (`6px`, badges/chips), `--distance-base` (`8px`, dropdowns/popovers/wizard slides), `--distance-medium` (`12px`, dialog float), `--distance-roomy` (`16px`, drawers/toasts).
4. **Blur-Coupled Micro-Primitives Only:** `--blur-small` (`2px`) / `--blur-medium` (`3px`) strictly on compact in-place swaps (`<Icon.Toggle/>`, `<TextSwap/>`, `<Skeleton.Reveal/>`). **Never** animate `filter: blur()` on large text overlays (Dialog, Drawer, Popover, Menu, Select)—use `opacity` + `transform` only.
5. **The Stagger Cap:** `--duration-stagger: 40ms` capped at **5 items** (`200ms` max cumulative delay).

### Explicit Property Targeting & Per-Component Pairings
Never use `transition-all`. Target explicit properties:
- Cards: `transition-[box-shadow,border-color,background-color,transform]`
- Overlays (Dialog/Popover/Menu/Drawer): `transition-[opacity,transform]`
- Accordions: `overflow-hidden h-[var(--accordion-panel-height)] transition-[height]`
- Micro-swaps/Skeletons: `transition-[opacity,transform,filter]`

Pairings:
- **Dialog / Popover / Menu / Select / Dropdown:** open `250ms` (`--duration-fast`), close `150ms` (`--duration-quick`). Anchored popups (`Popover`, `Menu`, `Select`, `Combobox`, `Tooltip`) scale from `origin-[var(--transform-origin)]`; centered modals (`Dialog`, `AlertDialog`) scale from center.
- **Hover Gating & Tab Indicators:** Gate hover transforms/lifts behind `@media (hover: hover) and (pointer: fine)` to avoid sticky touch hovers, and guard sliding tab indicators with `transition-none` on first paint before enabling `transition-[left,width,top,height]`.
- **Drawer / Toast:** open `250ms` (`--duration-fast`), close `150ms`–`200ms` (canonical `150ms` / `--duration-quick`) with `--ease-standard` (`cubic-bezier(0.22, 1, 0.36, 1)`). Toast dismiss buttons: `min-w-[44px] min-h-[44px]` (WCAG 2.2 SC 2.5.5).
- **Accordion:** `250ms` (`--duration-fast`) + `--ease-standard` on panel height and chevron.
- **Emphasis-only (`500ms` / `--duration-emphasis`):** Reserved for milestones (`SuccessCheck`); high-frequency controls (Checkbox/Switch) use crisp `150ms` micro-transitions.

### Essential Motion Primitives (`@/components/ui/`)
`Skeleton` & `Skeleton.Reveal` (`skeleton.tsx`, `bg-surface-variant`), `TextSwap` (`text-swap.tsx`), `NotificationBadge` (`notification-badge.tsx`), `TextsReveal` (`texts-reveal.tsx`, ≤5 lines), `NumberRoll` (`number-roll.tsx`, `tabular-nums`), `NumberPopIn` (`number-pop-in.tsx`), `SpinningCounter` (`spinning-counter.tsx`), `ShimmerText` (`shimmer-text.tsx`), `ErrorShake` (`error-shake.tsx`), `SuccessCheck` (`success-check.tsx`).

### Mandatory Accessibility Fallback
Every transition must include `@media (prefers-reduced-motion: reduce)` / `motion-reduce:transition-none`, stripping translation, scale, and blur while keeping opacity/state changes. Base UI components use `[data-starting-style]` and `[data-ending-style]` CSS transitions.

## Shapes

- **Nested Corner Radii:**
  - **Nested Cards, Media & Panels:** $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$ — clamps to `rounded` (`8px` / `rounded.DEFAULT`) on `p-4`/`p-6` cards rather than `0px` sharp corners.
  - **Tight Segmented Shells:** Outer `rounded` (`8px`) + `p-1` (`4px`) $\implies$ inner items `rounded-sm` (`4px`).
- **Radius Roles:** `rounded.sm` (`4px`) for inner segmented/menu rows; `rounded.DEFAULT` (`8px`) for Buttons, Inputs, Menus, Popovers, Comboboxes, outer segmented shells, and clamped nested media; `rounded.md` (`12px`) for intermediate callout panels; `rounded.lg` (`16px`) for Cards and Dialogs; `rounded-none` (`0px`) for edge-docked Drawers/Sheets; `rounded-s-none rounded-e` for Toasts & InlineAlerts; `rounded.full` (`9999px`) for Chips, Badges, Avatars, and Radios.
- **Border Width Roles:** `borderWidth.default` (`1px`) for Dialogs, Menus, Popovers, resting Inputs/Checkboxes/Radios, and segmented shells; `borderWidth.emphasis` (`2px`) for Drawer dividing edges, Selected Cards, Outlined buttons, standalone `Toggle`, and checked Radio ring; `borderWidth.accent` (`4px`) strictly for InlineAlert and Toast start accent bars.

## Navigation, Command & Selection Architecture

To select the correct primitive and maintain strict WAI-ARIA and cognitive accessibility boundaries, follow the **Navigation & Action Taxonomy** decision matrix in [`.agents/rules/component-library.md`](.agents/rules/component-library.md#navigation--action-taxonomy-choosing-the-right-primitive). Never guess between navigation (`NavigationMenu`), action menus (`Menu`, `Menubar`, `ContextMenu`), toolbars (`Toolbar`), view switching (`Tabs`), or state filtering (`ToggleGroup`).


## Components

### Buttons
Buttons are defined by two independent choices — pick each separately, don't conflate them:

*   **Emphasis / Variant (how prominent — unified across Button, Badge, and Chip):**
    *   **Filled (`variant="filled"`, highest):** Solid color-role background + matching `on-*` text (`on-primary`/`on-secondary`/`on-tertiary`/`on-error`/`on-warning`/`on-success`). Reserved for the one or two most important actions on a screen.
    *   **Outline (`variant="outline"`, medium; `variant="outlined"` supported as alias):** `2px` border in the color role + text in the same role, on a neutral `surface` (white) fill — never a tinted fill of the same hue, which collapses into the banned triple-tint pattern.
    *   **Soft (`variant="soft"`, low-to-medium; `variant="tonal"` supported as alias):** Soft container wash fill (`bg-*-container`) + dark neutral charcoal text (`text-on-*-container`). High-contrast resting state for secondary action strips.
    *   **Text (`variant="text"`, lowest):** No border, no fill — colored text only. Use for low-stakes actions like "Cancel", "Skip", or "Learn more".
    *   **Unstyled (`variant="unstyled"` or `<UnstyledButton />`):** Zero-chrome semantic button with accessible focus ring for card stretched-link triggers and table headers.
*   **Color role (what it means) — choose based on the action's actual meaning, not habit:**
    *   **`primary`:** the screen's core/main action. Usable at any emphasis tier.
    *   **`secondary` (Rich Emerald):** informational or auxiliary brand-accent actions (e.g. "View guide", "Learn more"). Passes AA as text on light backgrounds — usable at any emphasis tier (Filled, Outlined, Text). Require the explicit `colorRole="secondary"` prop; secondary exit actions ("Cancel", "Back", "Close") use `colorRole="neutral"`.
    *   **`tertiary` (Sunny Amber):** milestone, celebratory, or highlight actions (e.g. "Claim your reward", "Start challenge"). **Filled only** — per the Tertiary contrast constraint, Sunny Amber cannot be used for text or borders on light backgrounds, excluding it from Outlined and Text buttons.
    *   **`error`:** destructive actions. Filled for the primary confirm action in a destructive dialog; Outlined/Text for a lower-emphasis destructive option alongside it.
    *   **`success`:** confirming a positive or completed action (e.g. "Mark as correct", "Approve", "Confirm completion") — matches the exercise/completion semantics in State Colors. Passes AA as text/border on light backgrounds (`5.95:1` on white) — usable at any emphasis tier, same as `secondary`.
    *   **`warning`:** proceeding with a non-blocking caution, short of destructive (e.g. "End session early", "Continue without saving", "Skip this step"). Passes AA as text/border on light backgrounds (`5.79:1` on white) — usable at any emphasis tier. Don't reach for `error` here just because it's the only other non-`primary` option available; `warning` exists precisely for this "caution, not destruction" middle ground.
    *   **`neutral`:** standard operational actions ("Cancel", "Reset", "Dismiss"). Use with `variant="outline"` or `variant="text"`.

All tiers: standard height 3rem (48px, `size="md"`) for accessible hit targets, with a sanctioned compact 2.75rem (44px, `size="sm"` / `h-11`) density tier for dense desktop views (toolbars, data tables, compact headers), fully compliant with WCAG 2.2 AA's 44×44px floor. Corner radius: `0.5rem`. Component foundation: build on **Base UI** (`@base-ui/react/button`) primitives, styled with these tokens — do not hand-roll button focus/disabled/pressed states that Base UI already provides. Note: Unlike native HTML buttons, Base UI buttons default to `type="button"`; form submit triggers must explicitly declare `type="submit"`. To style navigation links (`<a>`), import the exported `buttonVariants` helper rather than rendering an anchor inside `<Button>`.

### Input Fields
Built on Base UI's `Field`/`Input`/`Fieldset` primitives (see `component-library.md`) — don't hand-roll label/error/description wiring that Base UI's `Field` already provides.

Inputs feature standard 3rem (48px, `size="md"`) height for general forms, and an official 2.75rem (44px, `size="sm"` / `h-11`) compact tier for desktop toolbars, search headers, and dense data views. Inputs must feature a high-contrast label above the field, always an explicit `<label>` association — never placeholder text standing in as the only label. `0.5rem` corner radius (`rounded.DEFAULT`), matching Buttons as the other primary form control. The border should darken to the Primary color when focused, using the same high-visibility focus ring as every other interactive element (see Elevation & Depth).

Error states must use a combination of a border in the `error` token color and a leading icon to ensure accessibility for color-blind users — and the error message text must be programmatically associated with the input (e.g. `aria-describedby`), not just visually adjacent, so it's announced to screen reader users. Required fields get a visible text indicator (e.g. "(required)"), not an asterisk alone. Disabled inputs use reduced-opacity `outline-variant` borders and `on-surface-variant` text (per WCAG 2.2 SC 1.4.11, inactive/disabled controls are explicitly exempt from the 3:1 non-text contrast requirement, though disabled state must remain programmatically exposed via `disabled` / `aria-disabled`). Placeholder text, where used as a supplementary hint (never as a substitute for the `<label>` above), must still pass AA contrast — see "No Low-Contrast Placeholder Text" in `anti-patterns.md`.

### Selection Controls (Checkbox, Radio, Switch)
Built on Base UI's `Checkbox`/`Checkbox Group`/`Radio`/`Switch` primitives (see `component-library.md`) — don't hand-roll checked/indeterminate state tracking that Base UI's `data-state` attributes already expose.

- **Checkbox:** `rounded.DEFAULT` (0.5rem) square control, `1px` `outline` border (a real interactive boundary, not the passive `outline-variant` used for cards/dividers) on a `surface` fill at rest. Checked state fills solid `primary` with a white (`on-primary`) check icon, border removed — the same "solid fill replaces border" logic as a Filled button. Indeterminate state uses the same solid `primary` fill with a dash icon instead of a check. Disabled follows the Input Fields convention: reduced-opacity `outline-variant` border and `on-surface-variant` icon/fill (exempt from 3:1 non-text contrast under WCAG 2.2 SC 1.4.11). Error state borders in `error`, matching Input Fields.
- **Radio:** identical color/state logic to Checkbox, but `rounded.full` (circular) — see Shapes for why this is a third named exception rather than a stylistic one. Checked state shows a `2px` `primary` ring (`borderWidth.emphasis`) with a solid `primary` center dot, rather than a full solid fill — this keeps Radio visually distinct from Checkbox's full-fill check even though both use the same brand color.
- **Switch:** a `rounded.full` track (`surface-variant` fill off / solid `primary` fill on) framed with a `1px` `outline` border (`border border-outline`, guaranteeing 4.4:1 non-text contrast under WCAG 2.2 SC 1.4.11 even when placed inside `surface-container`). When turned on, the border transitions cleanly to `border-primary` (`data-[checked]:border-primary`), matching the solid fill logic of Checkbox and preventing a muddy slate border around the Electric Blue track. Paired with a circular `surface`-colored (white) thumb. Never rely on track color alone to convey state — pair with an on/off text label or an accessible name via Base UI's own labeling.
- **Touch targets:** the visual control (checkbox/radio square or circle, switch thumb) may render smaller than 2.75rem, but the clickable/tappable hit area must still meet the 2.75rem × 2.75rem floor from Layout & Spacing — extend the hit area with padding, don't shrink the target to match the visual size.
- **Focus:** the standard high-visibility Primary focus ring (see Elevation & Depth) applies to all three controls, rendered as a real `outline`, not a `box-shadow`, so it survives `forced-colors` mode.

### Toggle & Toggle Group
Built on Base UI's `Toggle`/`Toggle Group` primitives (see `component-library.md`) — distinct from Switch (a persistent on/off setting) and from Checkbox (a form selection): Toggle is a single pressable button that holds a pressed/unpressed state (e.g. a bold/italic formatting toggle), and Toggle Group is a connected set of Toggles behaving like a segmented control (e.g. a view-mode switcher).

- **Unpressed:** styled like an Outlined button — `2px` `outline` border (`border-2 border-outline`, matching Outlined `<Button>` and preventing layout shift when pressed), neutral `surface` fill, neutral `on-surface` icon/text.
- **Pressed (`data-pressed`):** To avoid visual ambiguity with primary action CTA `<Button>`s, standalone pressed Toggles use a soft `bg-primary-container` fill (`#dce6ff`) paired with neutral charcoal `text-on-primary-container` (`#1a1c1e`) and a `2px` `border-primary` border (`borderWidth.emphasis`). This matches the active selection style of Selectable Cards, distinguishing an active toggle ("On") from a primary action button ("Submit").
- **Toggle Group:** a single `rounded.DEFAULT` `bg-surface-variant/70` tray with a `1px` `outline-variant` (`border-outline-variant`) outer border and zero outer box-shadow, working cleanly on both white `surface` cards and the `#EFF2F7` canvas without background-dependent variants (`variant="outline"` and `variant="segmented"` are deprecated aliases). Inactive segments stay transparent with `border border-transparent` and `text-on-surface-variant` (hover `text-on-surface` + `bg-surface-variant/40`). Active segments (`data-[pressed]`) stay borderless with a `forced-colors:data-[pressed]:border-Highlight` fallback and adapt automatically by selection mode:
  - *Single-select (`type="single"` / `multiple={false}`):* Crisp white `bg-surface` (`#ffffff`) pill paired with `text-on-surface` (`#1a1c1e`, 17.09:1 AAA) and a subtle elevation shadow (`shadow-[0_1px_2px_rgba(26,28,30,0.08)]`).
  - *Multi-select (`type="multiple"` / `multiple={true}`):* Soft `bg-primary-container` fill paired with `text-on-primary-container` (`#041E49`) so multiple simultaneous selections remain unmistakably distinct from single-select.
  All segments maintain a uniform `font-semibold` (600 weight) in both active and inactive states to prevent horizontal layout shift.

### Sliders & Stepped Inputs (Slider, Number Field, OTP Field)
Built on Base UI's `Slider`/`Number Field`/`OTP Field` primitives (see `component-library.md`).

- **Slider:** a `surface-variant` track framed with a `1px` `outline` border (`border-outline`, guaranteeing 3:1 non-text contrast for interactive controls under WCAG 2.2 SC 1.4.11 even when placed on `surface-container`) with the filled portion in solid `primary`, and a circular `rounded.full` thumb in solid `primary` with a `2px` white (`on-primary`) ring for definition against the track. The thumb's *visual* size may be small, but its hit area must still meet the 2.75rem × 2.75rem touch-target floor (Layout & Spacing) — this is a common accessibility failure point for sliders specifically, so treat it as a hard requirement, not a nice-to-have.
- **Number Field:** styled as an integrated horizontal segment `[ - ] [ value ] [ + ]` inside a single `rounded.DEFAULT` container with a `1px` `outline` border. The decrement and increment steppers are positioned on the outer flanks as Text-emphasis icon buttons flanking the centered input value. To prevent vertical height explosion (e.g. stacking two 44px buttons into an 88px control), steppers must be laid out horizontally side-by-side: each stepper button independently meets the 2.75rem × 2.75rem (44×44px) touch target floor in width and height, while the central value field displays centered monospace text (`font-mono`).
- **OTP Field:** a row of individual single-character boxes, each styled like a compact Input Field (`rounded.DEFAULT`, `1px` `outline` border, `primary` flush focus indicator with `-outline-offset-1` matching hollow form controls).
  - *Touch Targets & 320px Mobile Reflow (WCAG 2.2 SC 1.4.10):* On desktop and tablet containers, boxes size to `3rem` (48px, `w-12 h-12`) with `0.5rem` (8px, `gap-2`) gaps. On 320px mobile viewports (288px content width), fixed 44px boxes overflow. The root declares `@container` and boxes scale responsively: use `w-10 @sm:w-12 h-12 min-h-[48px]` (40px wide compact, 48px standard) with `gap-1.5 @sm:gap-2` (6px gaps compact, 8px standard), yielding $6 \times 40\text{px} + 5 \times 6\text{px} = \mathbf{270\text{px}} \le 288\text{px}$. The 40×48px mobile box complies with WCAG SC 2.5.8 (24×24px floor); do not expand hit targets horizontally across the 6px gap. Use `headline-sm` for the digit, and mirror Input Fields' `error` treatment (border + `aria-describedby` message) — never rely on a red border alone.

### Cards

Cards bundle related content into a distinct visual surface. Rather than restricting cards by content topics, cards are defined by two independent props: **Prominence** (how much visual attention the container commands) and **Affordance** (how the container behaves interactively).

#### Prominence Tiers

- **Standard Card (`prominence="default"`, Medium Prominence — primary default):**
  A flat white background (`surface`, `#ffffff`), `1rem` corner radius (`rounded.lg`), padding of at least `1.5rem` (24px), visually borderless (`border border-transparent`, which stays invisible on normal screens while giving Windows High Contrast Mode `forced-colors: active` a crisp system border), with ambient elevation (`shadow-[0_1px_3px_rgba(26,28,30,0.06),0_1px_2px_rgba(26,28,30,0.04)]`). Used for modular content units: user summaries, exercise drills, metric summaries, and session notes.
- **Accent Card (`prominence="accent"`, Deprecated):**
  Deprecated in favor of Standard Cards with internal `<Badge colorRole="secondary">` or `<ClinicianTip />` indicators. All standard cards remain borderless with ambient elevation; 2px colored borders are reserved strictly for active selection (`affordance="selectable"`).
- **Inverted Card (`prominence="inverted"`, High Prominence — canonical; `prominence="spotlight"` is supported as an alias):**
  Solid dark charcoal `on-surface` (`#1a1c1e`) fill paired with high-contrast text. Two contrast-verified accent configurations:
  1. `invertedAccent="tertiary"` (canonical default; `spotlightAccent="tertiary"` supported as legacy alias): Sunny Amber (`#F9A825`) headline/badge/icon (8.67:1 AAA) paired with pure white (`#ffffff`, `text-surface`) body copy (17.09:1 AAA). Keep body text pure white because long yellow paragraphs are hard to read.
  2. `invertedAccent="neutral"` (canonical; `spotlightAccent="neutral"` supported as legacy alias): Pure white headline and body text (17.09:1 AAA) for high-contrast announcements and neutral operational callouts.
  *Contrast Restrictions:* `primary` Electric Blue and `secondary` Rich Emerald text are strictly banned on Inverted Cards due to AA contrast failures.
- **Filled Card (`prominence="filled"`, High Prominence):**
  Solid saturated brand background (`primary`, `secondary`, or `tertiary`) with matching `on-primary`/`on-secondary`/`on-tertiary` high-contrast text. Reserved for milestone celebrations and solitary focal hero highlights. (For navigation choice sets or mode pickers, use Medium-Prominence Selectable Cards or a `ToggleGroup` instead).

#### Affordance Tiers (Prop name only — never use "affordance" in UI copy)

- **Static Container (`affordance="static"` — default):**
  No hover lift, no cursor pointer, no focus ring. Used strictly for grouping content and reading data.
- **Actionable Card (`affordance="actionable"` — canonical; `affordance="interactive"` is supported as an alias):**
  Clickable destination or action launcher. Features pointer cursor, hover elevation lift (`hover:shadow-ambient-hover`), active press feedback, and a standard offset keyboard focus ring (`outline-2 outline-primary outline-offset-2`).
- **Selectable Card (`affordance="selectable"`, choice sets):**
  Represents a selectable option within a choice set. Must follow strict ARIA semantics:
  - *Keep Card Containers Non-Interactive (WAI-ARIA):* Per the WAI-ARIA specification, roles `button`, `radio`, and `checkbox` enforce `childrenPresentational: true`. Placing these roles directly on an outer `<Card>` container strips all internal heading (`<h3>`), list, and formatting semantics for assistive technology, flattening all card content into a single concatenated string. Therefore, **the outer `<Card>` must always remain a semantic container (`<div>` or `<li>`)** with visual state indicators (`data-selected={selected}`), **never the interactive role itself**.
  - *Internal Selection Trigger:* Every Selectable Card must place its interactive selection control inside the card, utilizing the stretched-link overlay pattern (`after:absolute after:inset-0` on the internal trigger element):
    1. *Mutually-Exclusive Choice Sets (1-of-N):* Place an internal Base UI `<Radio>` control or semantic radio button within the card header, linked via `aria-labelledby` to the card heading ID and `aria-describedby` to the card body/metadata ID. The card group is wrapped in a container with `role="radiogroup"` (or Base UI `RadioGroup`).
    2. *Multi-Select Choice Sets (N-of-M):* Place an internal Base UI `<Checkbox>` control or semantic toggle button within the card header, linked via `aria-labelledby` to the card heading ID and `aria-describedby` to the card body ID.
    3. *Nested Secondary Controls:* If the card contains auxiliary interactive controls (e.g. an audio pronunciation preview button, external resource link), elevate them above the stretched-link trigger using `relative z-10`.
  - *Unselected:* Flat white surface with a flush 2px transparent border (`border-2 border-transparent`) to guarantee layout stability against hover/selection shifts, subtle hover border (`hover:border-outline-variant/50`), and hover elevation lift (`hover:shadow-ambient-hover`).
  - *Focus State & Selector Architecture:* In CSS, an `outline` applies strictly to an element's principal layout box, not its `::after` stretched-link pseudo-element. To ensure the blue focus ring draws cleanly outside the entire outer `<Card>` perimeter rather than tightly around the internal heading or radio dot:
    1. The internal stretched-link trigger element carries `data-card-trigger` and `focus-visible:outline-none after:absolute after:inset-0`.
    2. The outer `<Card>` carries `relative has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary`.
    3. Scoping `:has()` specifically to `[data-card-trigger]` ensures that focusing the card's primary selection trigger renders the 2px floating focus ring outside the card boundary, while focusing any nested secondary controls (`relative z-10`, e.g. an audio pronunciation button or menu trigger) renders focus strictly on that secondary control, preventing focus ambiguity (WCAG 2.4.7).
  - *Selected State (Unfocused):* Displays a flush `2px` `primary` border (`border-2 border-primary`) and solid active background wash (`bg-primary-container`, `#dce6ff`) with no external offset ring. Never use opacity modifiers (e.g. `/45`), which make the fill look too similar to `surface-container`.
  - *Selected + Focused State:* Displays both the flush `2px` `primary` border/wash AND the floating outer `2px` offset focus ring separated by a 2px gap.

*Instructional Content inside Cards:* To include practice tips, speech cues, or helpful hints inside a card, use the unboxed `<ClinicianTip />` primitive rather than nested cards or alert banners.

### Practice & Therapist Tips (`<ClinicianTip />`)

Practice tips, pronunciation cues, and helpful advice provide simple, in-context hints during exercises and forms. They are **not** system alerts and must not be rendered as elevated cards.

- **Primary Pattern (Unboxed Typographic Lockup — Low Prominence):**
  Designed specifically for use inside existing cards, exercise drills, and form dialogs without creating "Card Soup":
  - **Structure:** Zero elevation, borderless, transparent background.
  - **Icon / Badge:** Leading `20px` (`size="md"`) icon in `secondary` (`#00796B`, e.g., `lightbulb` or `info`) or an inline passive micro-badge (`<Badge size="sm" variant="soft" colorRole="secondary">Tip</Badge>`).
  - **Copy:** `text-base` (`1rem` / 16px, upholding the 1rem body text floor) in `text-on-surface-variant` (`#434656`), with an optional bold prefix in `text-on-surface` (`#1a1c1e`, e.g., `<span className="font-semibold text-on-surface">Tip: </span>` or `"Clinician tip: "`).
  - **Accessibility:** Ensure the icon has `aria-hidden="true"` when paired with a visible prefix like "Tip:".
- **Canvas / Multi-Field Grouping (Secondary Pattern):**
  When tips appear directly on the `#EFF2F7` page canvas or between separate form groups (outside of cards), they must sit within a `bg-surface-container` (`#EBF0F8`, `rounded-md px-3.5 py-2.5`) wash paired with a `1px` `outline-variant` border (`border border-outline-variant`, `#BEC6D6`) per the neutral surface contrast rule so the grouping remains distinctly visible against the canvas.
- **Component Primitive:** Use `<ClinicianTip />` (`src/components/ui/clinician-tip.tsx`).

### Inline Alerts

Inline alerts communicate urgent, time-sensitive, or state-dependent feedback: system status, operational warnings, blocking issues, or confirmation notices. They are **not** general-purpose text containers for static educational tips or regular body copy.

They feature an asymmetric rectangular shape (`rounded-s-none rounded-e`, using logical start/end properties for RTL parity) with a soft surface background wash (`bg-surface-variant/50` for `neutral`, `bg-*-container/40` for `warning`/`error`/`success`) so the alert's boundary remains clearly defined even inside a white `<Card>`, **completely borderless on top, end, and bottom edges** (`border-t-0 border-e-0 border-b-0`), paired with a solid vertical `4px` (`borderWidth.accent`, `border-s-4`) accent bar in the state role color along the start edge:
- **Straight vertical start accent bar:** A pure vertical `4px` stripe along the start edge (`border-s-4 border-s-[role]`), rendered in the state/status role's solid accent color:
  - `error` (`#C4161C`): Destructive, blocked actions, or critical failures.
  - `warning` (`#A64B00`): Cautionary notices, unsaved changes, expiring sessions.
  - `success` (`#157331`): Confirmation of completed workflows or saved states.
  - `neutral` (`#1a1c1e`, `on-surface`): System and operational status notices (e.g. offline mode, sync status, background connectivity).
  *Role Restriction:* Brand and content roles (`primary` Electric Blue, `secondary` Rich Emerald, `tertiary` Sunny Amber) are **strictly excluded** from Inline Alerts. Operational alerts use state tokens (`error`, `warning`, `success`) or neutral charcoal (`on-surface`), preserving `primary` exclusively for interactive controls and brand hierarchy. Because the container uses asymmetric rounding (`rounded-s-none rounded-e`), the accent bar remains a crisp, perfectly straight vertical edge without corner-miter distortion, while the end corners gently align with surrounding 0.5rem controls.
- **Surface & Text:** Soft surface wash (`bg-surface-variant/50` or `bg-*-container/40`), `on-surface` (`#1a1c1e`) headline text, `on-surface-variant` (`#434656`) body text, and a matching role-colored leading icon for instant visual recognition.
- **Appropriate triggers:**
  - *Warning / Actionable:* "Microphone access blocked — tap to enable."
  - *Time-sensitive alert:* "Session expiring in 2 minutes."
  - *System status:* "Offline mode active — exercises will sync when reconnected."
  - *Stateful prompt:* "You have unsaved notes from earlier today."
- **Accessibility & Interactive Slots:** Implements dynamic ARIA live regions: `role="alert"` (`aria-live="assertive"`) for `error` to immediately announce critical failures, and `role="status"` (`aria-live="polite"`) for `warning`, `success`, and `neutral`. Supports an optional `onClose` dismiss trigger (accessible icon button with floating focus ring) and an optional inline `action` button slot.
- **Anti-pattern guard (Never an Asymmetric Card):** Inline alerts use asymmetric rounding (`rounded-s-none rounded-e`) specifically to keep the 4px start accent border completely straight. Never apply a 4px start accent border to a fully rounded container (`rounded.lg`/`rounded.md`), which distorts corner geometry. For static educational tips, strategy guides, or exercise instructions, use the unboxed `<ClinicianTip />` pattern or Low-Prominence typography instead.

### Semantic Spacing Ladder

To eliminate arbitrary spacing utilities (`py-7`, `gap-5`, `space-y-3`), all layouts strictly adhere to this 4-tier vertical and structural spacing ladder:

| Tier | Scale Range | Class Names | Usage & Purpose |
| :--- | :--- | :--- | :--- |
| **Tier 1: Internal Component Gaps** | 4px–8px | `gap-1` to `gap-2` | Spacing inside atomic controls: icon-to-label in buttons, clear trigger in inputs, badge insets. |
| **Tier 2: Closely Related Items** | 8px–12px | `gap-2` to `gap-3` | Spacing between tightly coupled elements: label to input in `<Field>`, list rows in compact tables. |
| **Tier 3: Distinct Content Groups** | 16px–24px | `gap-4` to `gap-6` | Spacing between modular sections inside a card, field rows in `<FieldGroup>`, toolbar action clusters. |
| **Tier 4: Major Page Sections** | 48px–64px | `gap-12` to `gap-16` / `py-12` | Spacing between major layout regions: hero header to main content grid, footer separation. |

### Component-to-Radius Mapping Table & Concentric Alignment

| Radius Tier | Value | Canonical Components | Concentric Nested Alignment Law |
| :--- | :--- | :--- | :--- |
| **`none`** | 0px | Square corners, docked `Drawer` / `Sheet` viewport-edge panels, table outer cells, drill canvases | Used for edge-docked overlays (`Drawer`/`Sheet`) and flush full-bleed canvases. |
| **`sm`** | 4px (`0.25rem`) | Inner concentric items (`ToggleGroup.Item`), micro-accents, tooltip arrow pins, progress tracks | Follows $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$ for tight `p-1` shells. Inside a `rounded` (8px) container with `p-1` (4px padding), inner items take $8\text{px} - 4\text{px} = 4\text{px}$ (`rounded-sm`). |
| **`DEFAULT`** | 8px (`0.5rem`) | Interactive controls (`Button`, `Input`, `Select` triggers, `Menu` popups, `Popover`), outer segmented control containers (`ToggleGroup`), clamped nested media | The core baseline for all Tier B interactive controls and the `8px` floor for nested elements inside padded cards ($R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$). Concentric end corners match asymmetric alerts (`rounded-e`). |
| **`md`** | 12px (`0.75rem`) | Intermediate standalone cards, medium containers, callout panels (e.g., inset `<ClinicianTip />`) | Used where `0.5rem` is too tight and `1rem` is too large. |
| **`lg`** | 16px (`1rem`) | Standard content cards, `Dialog`, `AlertDialog` modal surfaces | Outer elevation boundaries. Padded child media/containers clamp to the `8px` inner floor (`rounded`, $R_{\text{inner}} = \max(8\text{px}, R_{\text{outer}} - \text{padding})$). |
| **`full`** | 9999px | Badges, pill chips, circular icon buttons, avatars | Complete circular/pill rounding. Passive `<Badge />` and interactive `<Chip />` both share `rounded-full`. |

### Badges, Chips & Tags

This design system draws a strict architectural line between **passive labels** (`<Badge />`) and **interactive controls** (`<Chip />`):
*   **Badges (`<Badge />`):** **PASSIVE, non-interactive** status indicators, metadata tags, counts, and category labels. Built with semantic `<span>` and Base UI polymorphic `render` support. Zero focus states or click listeners.
*   **Chips (`<Chip />`):** **INTERACTIVE** compact controls. Supports toggleable filter selection (`selected` / `onSelect`, `role="button"` with `aria-pressed`), dismissible tags (`onRemove`), and compact action triggers (`onClick`). Built on Base UI interaction foundations and expands to the 44px touch target floor (WCAG 2.2 SC 2.5.5, exceeding SC 2.5.8's 24×24px minimum) when interactive.

Both components share a fully rounded pill radius (`rounded.full`, 9999px) and strictly avoid the monochromatic "triple-tint" anti-pattern (matching colored fill, border, and text of the same hue). Select from three approved patterns based on visual emphasis:
- **High-Contrast Mixed Palette (Pattern 1 / `variant="filled"`):** Saturated brand background (e.g., `primary`, `secondary`, or `tertiary` token) paired with its designated high-contrast text (`on-primary`/`on-secondary`/`on-tertiary`), no border. Use for higher-emphasis, active selections, or status-forward badges/chips (aligns with Filled buttons).
- **Colored Outline + Neutral Fill + Colored Text (Pattern 2 / `variant="outline"`):** A `1px` border in the brand hue (`primary`/`secondary` only; `tertiary` Amber is excluded here due to light-background contrast limits), a genuinely neutral fill (`surface` white — never a tinted version of the hue), and text in that same brand hue. This is the recommended everyday default for multi-badge layouts (aligns with Outlined buttons): it stays vivid and legible without visual clutter.
- **Soft Container Wash (Pattern 3 / `variant="soft"`):** Soft role-specific background (`primary-container`, `secondary-container`, `tertiary-container`, `success-container`, `error-container`, `warning-container`, `neutral-container`) paired with its ultra-dark, near-black semantic `on-*-container` token (`#001849`, `#00201c`, `#261900`, `#052e16`, `#450a0a`, `#331400`, `#1a1c1e`) and `border-transparent` (no border). This delivers color-coded status warmth while ultra-dark M3 ink guarantees 11:1+ AAA contrast on small 12px pills without muddy mid-tone washes. Valid for low-to-medium emphasis status tags.

#### Approved Chip Variant × Color Role Table

| Color Role | Pattern 1: High-Contrast Solid (High Emphasis) | Pattern 2: Colored Outline + Neutral Fill (Everyday Default) | Pattern 3: Soft Container Wash (Low/Medium Status) | Accessibility & Contrast Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`primary`** (Electric Blue, `#0052FF`) | `bg-primary text-on-primary` (Solid blue fill, white text) | `border-primary bg-surface text-primary` (1px blue border, white fill, blue text) | `bg-primary-container text-on-primary-container` (Soft blue fill `#dce6ff`, ultra-dark navy `#001849`) | Solid/outline text achieves 5.75:1 AA on `#ffffff`. Soft wash achieves 13.70:1 AAA. |
| **`secondary`** (Rich Emerald, `#00796B`) | `bg-secondary text-on-secondary` (Solid emerald fill, white text) | `border-secondary bg-surface text-secondary` (1px emerald border, white fill, emerald text) | `bg-secondary-container text-on-secondary-container` (Soft emerald fill, ultra-dark emerald `#00201c`) | Solid/outline text achieves 5.32:1 AA on `#ffffff`. Soft wash achieves 14.33:1 AAA. |
| **`tertiary`** (Sunny Amber, `#F9A825`) | `bg-tertiary text-on-tertiary` (Solid amber fill, **charcoal text** `#1a1c1e`) | **BANNED on white surfaces** (Amber text fails WCAG 1.4.3 AA at 1.97:1; use Pattern 1 or Pattern 3) | `bg-tertiary-container text-on-tertiary-container` (Soft amber fill, ultra-dark amber `#261900`) | Pattern 1 requires dark text (`text-on-tertiary` = `#1a1c1e`, 8.67:1 AAA). White text on `#F9A825` fails at 1.97:1. Soft wash achieves 15.14:1 AAA. |
| **`success`** (Forest Green, `#157331`) | `bg-success text-on-success` (Solid green fill, white text) | `border-success bg-surface text-success` (1px green border, white fill, green text) | `bg-success-container text-on-success-container` (Soft green fill, ultra-dark forest `#052e16`) | Solid/outline text achieves 5.95:1 AA on `#ffffff`. Soft wash achieves 12.36:1 AAA. |
| **`warning`** (Ochre Amber, `#A64B00`) | `bg-warning text-on-warning` (Solid ochre fill, white text) | `border-warning bg-surface text-warning` (1px ochre border, white fill, ochre text) | `bg-warning-container text-on-warning-container` (Soft ochre fill, ultra-dark ochre `#331400`) | Deep ochre `#A64B00` achieves 5.79:1 AA on `#ffffff`. Never substitute with `#F9A825`. Soft wash achieves 13.58:1 AAA. |
| **`error`** (Crimson Red, `#C4161C`) | `bg-error text-on-error` (Solid crimson fill, white text) | `border-error bg-surface text-error` (1px crimson border, white fill, crimson text) | `bg-error-container text-on-error-container` (Soft crimson fill, ultra-dark crimson `#450a0a`) | Solid/outline text achieves 6.04:1 AA on `#ffffff`. Soft wash achieves 12.49:1 AAA. |
| **`neutral`** (Charcoal / Slate) | `bg-neutral text-on-neutral` (Solid charcoal `#1a1c1e` fill, white text) | `border-outline bg-surface text-on-surface` (1px slate border `#6B6E80`, white fill, charcoal text) | `bg-neutral-container text-on-neutral-container` (Soft slate fill `#D1D5DF`, charcoal text `#1a1c1e`) | Solid text achieves 17.09:1 AAA. Outline border meets 3:1 non-text contrast (5.04:1). Soft wash achieves 11.63:1 AAA. |

Tinted pastel backgrounds matching the border/text hue are never permitted for chips. Chips and badges must never use all-caps text or colored status dots for static states — see "No Static Status Dots" in `anti-patterns.md` for the full rule and the live/real-time exception.

### Lists
Lists should have clear dividers or generous vertical spacing between items. Every list item should have a minimum touch target height of 3.5rem (56px) to accommodate users with motor impairments.

### Accordion & Collapsible
Built on Base UI's `Accordion`/`Collapsible` primitives (see `component-library.md`). Apply the same Low vs. Medium Prominence decision as Lists (see 3. Surface Hierarchy): a short accordion embedded in a longer page defaults to Low Prominence (canvas + `outline-variant` dividers between headers, no fill); a self-contained accordion section (e.g. an FAQ block) may use Medium Prominence `surface-container` grouping for the whole set. Each header row is a full-width button (minimum 2.75rem touch target height) with a trailing `expand_more` Material Symbol that rotates 180° on open — use the calibrated Accordion motion pairing (`250ms` open/close, `--duration-fast` with `--ease-standard`) for both the chevron rotation and the panel height reveal, with the mandatory `prefers-reduced-motion` fallback. Never rely on the chevron rotation alone to convey open/closed state — the panel's actual presence/absence in the layout is the primary signal.

### Navigation (Top Bar & Tabs)
Built on Base UI's `Menu`/`Tabs` primitives and semantic `<nav>` elements (see `component-library.md`). The primary desktop navigation bar uses the `surface` background with a single `1px` `outline-variant` bottom border — no shadow; this is page-frame chrome, not an elevated container (see the "Page-frame chrome" note in 3. Surface Hierarchy). Active nav items are marked with `primary` text/icon plus a `2px` solid `primary` underline, never color alone. Tabs (for switching between related panels on the same page) default to an underline indicator (`variant="line"`) on the active tab (`primary` text + `2px` `primary` underline), while segmented tabs (`variant="segmented"`) match single-select `ToggleGroup` (`bg-surface-container` + `border-outline-variant` track with a flat `bg-surface` + `border-outline` active indicator, zero shadow), and must never rely on color contrast alone to indicate the active state.

### Dialogs, Drawers, Popovers & Preview Cards
**Dialog and Drawer (Tier A — modal, blocking):** a `surface` panel with modal elevation (`shadows.modal` / `shadow-modal`) and a backdrop scrim dimming the page behind them (see Elevation & Depth). Dialogs feature `1rem` corner radius (`rounded.lg`) and a `1px` `outline-variant` border (`borderWidth.default`, matching `dialog.tsx`). Over dark modal backdrop scrims, a 1px border provides crisp edge definition without creating a heavy halo around the white dialog surface, while keeping borders visible in Windows High Contrast mode (`forced-colors: active`). Drawers carry the same weight as Dialogs but anchor to a screen edge: full-height side drawers and docked bottom sheets use `rounded-none` with a single dividing border along their open edge (`border-l-[2px]` on right-side drawers, `border-r-[2px]` on left-side drawers, `border-t-[2px]` on bottom sheets) rather than curved corners, sitting flush against the screen edge without gaps.

**Popover & Preview Card (Tier B — anchored, non-modal):** a `surface` panel with `0.5rem` corner radius (`rounded.DEFAULT`, matching Menus, Selects, and Comboboxes), the lighter standard `1px` `outline-variant` border (`borderWidth.default`), and ambient elevation (`shadows.ambient` / `shadow-ambient`) — no backdrop scrim. Lightweight and transient, dismisses on outside click, hover-off, or `Escape`. Never use a Popover or Preview Card to host a primary task's main content — that's what Dialog/Drawer are for.

**Alert Dialog:** Base UI's non-light-dismissible confirmation variant (no outside-click/Escape close, forcing an explicit choice) uses the identical Tier A visual treatment as Dialog above — the difference from Dialog is behavioral only, not visual.

All of these render through Base UI's portal (see `component-library.md`) and must respect `isolation: isolate` stacking.

### Menus, Selects & Dropdowns
Built on Base UI's `Menu`/`Select` primitives (see `component-library.md`). Tier B floating container (see Elevation & Depth) — `surface` background, the standard `1px` `outline-variant` border (`borderWidth.default`), `0.5rem` corner radius (`rounded.DEFAULT`), and permanent ambient elevation (`shadows.ambient` / `shadow-ambient`, no heavy drop shadow). The border stays the primary legible edge; the shadow only reinforces that it's floating above the page. Selected/active items use a `surface-variant` fill plus `primary` text — never color alone. Destructive menu items use `error`/`on-error` styling and should be visually separated (a `Separator`, not just spacing) from neutral actions.

### Combobox & Autocomplete
Built on Base UI's `Combobox`/`Autocomplete` primitives (see `component-library.md`) — a text `Input` (styled per Input Fields) paired with a Tier B floating suggestion list (styled per Menus, Selects & Dropdowns: `surface` background, `1px` `outline-variant` border, `rounded.DEFAULT`, permanent ambient elevation (`shadows.ambient` / `shadow-ambient`)). The highlighted/active suggestion uses the same `surface-variant` fill plus `primary` text as a selected Menu row. No new tokens are needed here; this component is a composition of two already-specified patterns.

### Tooltips
Built on Base UI's `Tooltip` primitive (see `component-library.md`). Tooltips use a solid high-contrast fill (dark charcoal `on-surface`-toned background with white text, inverted from the rest of the light theme) so they read as transient overlays rather than page content. Reserve tooltips for supplementary hints on icon-only controls — never put required information only in a tooltip, since it is not reliably available to touch/keyboard-only users.

### Tables & Data
Prefer a proper data table (clear column headers, `outline-variant` row dividers, generous row height matching the 3.5rem list touch target where rows are interactive) over ad-hoc grids of cards for tabular data. Header row text follows the same casing rule as everything else — sentence case, no uppercase; use weight/size for hierarchy.

- **Column Alignment & Numeric Formatting:**
  - **Text & identifiers:** Left-aligned (`text-left`) for both header `<th>` and cell `<td>`.
  - **Numeric quantities & metrics:** Right-aligned (`text-right`) for both header `<th>` and cell `<td>`, strictly paired with tabular figures (`tabular-nums font-mono`). Right-alignment keeps decimal points and digits lined up vertically so numbers are easy to compare at a glance.
  - **Booleans, status tags, & single actions:** Center-aligned (`text-center`).
- **Data Table Primitive (`<Table />`):** Columns marked with `numeric: true` automatically inherit `align="right"`, `tabular-nums`, and `font-mono`.

### Data Visualization & Charts
Reuse the existing semantic tokens before ever introducing a chart-only color — the six roles already defined cover almost every case:
- **Outcome/accuracy charts** (e.g. correct-vs-incorrect responses, pass-rate trends over time): use `success` (correct) and `error` (incorrect), matching their exercise-feedback meaning above — never a neutral or arbitrary hue for outcome data.
- **Neutral categorical/multi-series charts** (e.g. sessions by category, non-outcome comparisons): use `primary` → `secondary` → `tertiary`, in that fixed order (`#0052FF` Electric Blue → `#00796B` Rich Emerald → `#F9A825` Sunny Amber), for up to 3 simultaneous series. This keeps the state tokens (`error`/`warning`/`success`) reserved for actual outcomes, so a legend never accidentally implies something went wrong.
  - *Non-Text Contrast Compliance (WCAG 2.2 SC 1.4.11):* Sunny Amber (`#F9A825`) on white (`#ffffff`) or canvas (`#EFF2F7`) has a contrast ratio of only `1.97:1` (`1.75:1` on canvas), which is below the mandatory 3:1 graphical object threshold. When Series 3 (`tertiary`) is rendered on light backgrounds, it must either:
    1. Include a `1px` high-contrast boundary stroke (`border border-outline` `#6B6E80` or `border-on-surface` `#1a1c1e`) for filled bars, pie slices, and area shapes,
    2. Use a darkened amber token (`#A64B00`, `5.79:1` contrast, or `#9E5D00`, `4.95:1` contrast) for line chart strokes and point markers, or
    3. Be paired with a distinct graphic texture/pattern (e.g. diagonal hatching).
    In legend text, always render the series name in neutral charcoal (`text-on-surface`), using amber strictly for swatches with a 1px boundary stroke — never use unbordered `text-tertiary` on light backgrounds.
- **`warning`** is reserved for its own meaning (e.g. a threshold or caution annotation line) — not a generic 4th series color.
- **Cap at 3 simultaneous color-coded series.** Beyond that, restructure into small multiples or grouped/faceted charts, or add pattern/dash/marker-shape differentiation — don't keep inventing new ad-hoc hues to fit more series in.
- **Color is never the only cue.** Pair every series/segment with a direct label, legend, or pattern — charts are read by colorblind and low-vision users too, same rule as chips/nav/menus elsewhere in this document.
- Only introduce a dedicated chart-only token if a specific chart genuinely can't be served by the above — state that reasoning explicitly before adding one; the goal is maximizing the existing six roles' clarity before adding new tokens.

### Avatars
Built on Base UI's `Avatar` primitive (see `component-library.md`). Avatars are circular (`rounded-full`), minimum `2rem` (32px) in dense UI and `2.5rem` (40px) in general grids to match the Pictorial Mark sizing rules. Use `surface-variant` as the fallback background for initials-only avatars, with `on-surface-variant` text — never a random hash-generated color per user.
- **Interactive Avatar Touch Targets (WCAG 2.2 SC 2.5.5):** When an Avatar acts as an interactive trigger (e.g. account profile menu in the navigation bar or user selection toggle), the visual avatar (32px or 40px) must never be used as a naked interactive element. Wrap it in a `2.75rem × 2.75rem` (44×44px) minimum hit area (e.g. `<AvatarButton />` or `min-h-[2.75rem] min-w-[2.75rem] inline-flex items-center justify-center p-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`).

### Progress & Loading States
Built on Base UI's `Progress` primitive (see `component-library.md`) for determinate bars/rings; skeleton pulses are plain elements, not a Base UI primitive. Use the `primary` color for determinate progress bars/rings on a `surface-variant` (`#DDE1EB`) track. For loading skeletons, use a subtle `surface-variant`-toned pulse — never a generic grey unrelated to the palette. Every component that can load asynchronously must define its loading and empty states, not just its populated state (see "Design for the Zero-State" in `anti-patterns.md`).

- **Functional Element Guidance & Non-Text Contrast (WCAG 2.2 SC 1.4.11 / SC 1.3.1):**
  - **Progress Bars:** Because passive ambient fills (`surface-variant` `#DDE1EB` and `surface-container` `#EBF0F8`) have low contrast against each other (~1.13:1), determinate progress indicators must **never rely on track fill alone** to communicate progress or state. Determinate progress bars and rings must always pair the visual indicator with:
    1. An accessible, high-contrast visible text readout (rendered in `text-on-surface` or `text-on-surface-variant`, e.g. "Step 3 of 10" or "45% completed"), and
    2. Explicit programmatic state exposure via `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
  - **Loading Skeletons:** Skeletons serve as temporary spatial placeholders, relying on dynamic motion (shimmer/pulse sweep) rather than static 3:1 boundary contrast. Active loading containers must announce state changes using `aria-busy="true"` or an adjacent polite live region (`aria-live="polite"`).
  - **Interactive Form Boundaries:** Form fields (inputs, selects, textareas) and selection controls must strictly maintain a real 1px `outline` border (`#6B6E80`, 3:1+ contrast against adjacent surfaces per SC 1.4.11) and must never rely on passive fills (`surface-variant`, `surface-container`) or `outline-variant` (`#BEC6D6`) to define their boundaries.

### AI Activity Indicators (Thinking Orbs)
Built on `thinking-orbs` via the `<ThinkingOrb />` design system wrapper (`src/components/ui/thinking-orb.tsx`). Used to show active AI work (searching guides, summarizing notes, generating exercises) rather than displaying a plain spinner.
- **Color & Motion Are Never the Only Cue:** A standalone canvas orb communicates nothing to screen readers and violates WCAG 1.4.1. An orb must **always** be accompanied by a visible status label in `font-sans text-on-surface` or an accessible `.sr-only` fallback inside a `role="status"` and `aria-live="polite"` live region.
- **Standard Scale:** `sm` (20px) for inline text/badges, `md` (32px) for card headers, and `lg` (64px) for prominent hero-scale agent states.
- **Mandatory Reduced Motion:** Wrappers automatically query `(prefers-reduced-motion: reduce)` to set `paused={true}` or dampen animation speed.

### Friendly AI Characters (Bot Avatars)
Built on `bot-avatars` via the `<BotAvatar />` design system wrapper (`src/components/ui/bot-avatar.tsx`). Designed to provide friendly, approachable interaction for children, teens, and guided practice workflows.
- **Tone Selection (`tone="calm"` vs `tone="friendly"`):** High-energy bouncing or smiling avatars can feel distracting during focused tasks, assessments, or error states. In focused assessment or serious flows, use `tone="calm"`; this disables spontaneous flips/hops (`jumpEvery={0}`), restricts gaze turns, and reduces speed by 50%.
- **Digital Helper Identity:** Automated characters must never mislead users into thinking they are speaking with a human therapist. Avatars must carry descriptive `role="img"` and `aria-label` tags identifying them as a "Digital Helper", and offer an optional visual `showDisclaimerBadge`.
- **Reduced Motion:** Continuous movement can be distracting or uncomfortable for motion-sensitive users. The component automatically suppresses jumping and rapid rotation when `prefers-reduced-motion` is active.

### Toasts & Notifications
Tier C floating container (see Elevation & Depth) — deliberately distinct from Card rather than matching it: `surface` background, borderless on top/end/bottom (`border-t-0 border-e-0 border-b-0`), asymmetric rounding (`rounded-s-none rounded-e`), relying on a permanent ambient shadow (`shadow-ambient`) as its perimeter edge. Always paired with a leading functional icon and, for `error`/`success`/`warning`/`neutral` states, an `error`/`success`/`warning`/`neutral` (`on-surface` / `#1a1c1e`) colored icon plus a matching `4px` (`borderWidth.accent`, `border-s-4`) start accent bar (`border-s-error`, `border-s-success`, `border-s-warning`, `border-s-neutral`) — the exact asymmetric rectangle and accent-bar treatment as Inline Alerts — never a full-bleed colored background, which reduces text contrast. Note that neutral/info alerts use `border-s-neutral` rather than `border-s-primary` to preserve primary blue strictly for actionable interactive elements. Auto-dismiss non-critical toasts; keep error toasts until manually dismissed. **Dismiss action buttons must strictly maintain a minimum 44×44px touch target (`w-11 h-11 min-w-[44px] min-h-[44px]`) to comply with WCAG 2.2 SC 2.5.5 (exceeding SC 2.5.8).**

## Brand Logos & Usage

This section defines the usage rules for the Eolas brand marks to maintain legibility across layouts.

**Mark type (section 1) and tonal color variant (section 2) are independent choices** — pick a mark type based on layout/context, then pick a tonal variant based on the background it sits on. Don't assume a given mark type is locked to one tonal treatment (e.g. the Horizontal Lockup isn't inherently "Primary Colored" just because its name contains "Primary" — it can render in any of the four tonal variants in section 2, whichever fits the background it's placed on).

### 1. Brand Mark Types & Contexts

*   **Primary Mark (Stacked)**
    *   *Description*: Vertically stacked brand symbol and logotype.
    *   *Usage*: Standalone hero blocks, marketing collateral, portal splash screens, and central welcome states.
    *   *Constraints*: Requires at least 3rem (48px) padding on all sides. Minimum display height is 7.5rem (120px).
*   **Pictorial Mark (Symbol)**
    *   *Description*: Standalone circular brand symbol.
    *   *Usage*: High-density screen headers, favicons, account avatars, inside app shells, and mobile layout headers.
    *   *Constraints*: Minimum size is 2rem (32px) by 2rem (32px) for favicon and 2.5rem (40px) by 2.5rem (40px) in general UI grids to maintain clarity.
*   **Horizontal Lockup (Primary Combination)**
    *   *Description*: Inline brand symbol placed left of the Eolas wordmark.
    *   *Usage*: Main desktop header navigation bar (top-left alignment) and wide banners.
    *   *Constraints*: Bounding container height should be constrained to 2.5rem (40px) to align with the 8px baseline grid and prevent nav-bar clutter.
*   **Wordmark (Logotype Only)**
    *   *Description*: Typographic Eolas branding.
    *   *Usage*: Internal widget footers, clean editorial headers, and co-branding lockups where the pictorial symbol is already present on the page.
    *   *Constraints*: Minimum rendering height of 1.25rem (20px) to preserve character tracking.

### 2. Tonal Color Selection (Surface & Background Contrast)

*   **Primary Colored Assets**
    *   *Usage*: On Light backgrounds (`#FFFFFF` and canvas `background` `#EFF2F7`). Never render the primary color logo on dark primary or charcoal panels, as the contrast ratio fails WCAG AA standards.
*   **White / Reverse Assets**
    *   *Usage*: On Dark backgrounds (Electric Blue primary color `#0052FF` or Charcoal dark panels `on-surface` `#1a1c1e`).
*   **Solid Black Assets**
    *   *Usage*: Print media, utility legal/footer docs, high-contrast monochrome layouts, or secondary light-tint surfaces.
*   **Tertiary Amber Assets**
    *   *Usage*: Limited to interactive highlights, themed dashboards, or as a warm contrasting accent on dark charcoal backgrounds.

## Anti-Patterns (Banned)

The full banned-pattern catalogue — chips/tags, layout/structure, iconography/copy, overlays/navigation, and component-library rules — lives in [.agents/rules/anti-patterns.md](.agents/rules/anti-patterns.md), which is the single source of truth and is enforced automatically on every UI file edit. Check every finished component against it before considering the task done; do not re-derive or duplicate its list here.