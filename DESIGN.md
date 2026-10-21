---
name: Modern Clinical High-Contrast
colors:
  background: '#F6F7FB'
  on-background: '#1a1c1e'
  surface: '#ffffff'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434656'
  surface-container: '#EEF1F8'
  surface-variant: '#E1E6F0'
  outline: '#737688'
  outline-variant: '#C8D0E0'
  primary: '#0052FF'
  on-primary: '#ffffff'
  primary-container: '#dce6ff'
  on-primary-container: '#1a1c1e'
  secondary: '#00796B'
  on-secondary: '#ffffff'
  secondary-container: '#e0f2f1'
  on-secondary-container: '#1a1c1e'
  tertiary: '#F9A825'
  on-tertiary: '#1a1c1e'
  tertiary-container: '#fff0c2'
  on-tertiary-container: '#1a1c1e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#1a1c1e'
  warning: '#8a5200'
  on-warning: '#ffffff'
  warning-container: '#ffe0b3'
  on-warning-container: '#1a1c1e'
  success: '#146c2e'
  on-success: '#ffffff'
  success-container: '#c8f5ce'
  on-success-container: '#1a1c1e'
  neutral: '#1a1c1e'
  on-neutral: '#ffffff'
  neutral-container: '#D5DCEB'
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

This design system establishes the "Modern Clinical" aesthetic for **Eolas**, an accessible speech therapy platform where clarity is a functional requirement, not just a visual preference. In this system, "Clinical" refers strictly to visual cleanliness, high contrast, and uncluttered layout — **never to dense medical jargon, institutional coldness, or faux-academic complexity.** UI copy must always remain simple, human, and direct.

The style utilizes **Minimalism** as its foundation—relying on generous whitespace and a clear grid—paired with **High-Contrast** elements to create an encouraging, bright atmosphere. The goal is to move away from the cold, sterile feel of traditional healthcare apps and toward a supportive environment that encourages patient engagement. Every visual decision is filtered through a lens of WCAG AA compliance to ensure that users with varying degrees of visual and cognitive ability can navigate the interface with confidence.

## Colors

The color system is organized into functional roles governed by visual hierarchy and interactive affordance, not topic buckets or decorative quotas.

### Visual Hierarchy & Palette Roles

1. **Interactive Driver (`primary`, `#0052FF`):**
   * *Tokens:* `primary` (`#0052FF`) | `on-primary` (`#ffffff`) — solid fill. `primary-container` (`#dce6ff`) | `on-primary-container` (`#1a1c1e`, neutral charcoal) — soft fill.
   * *Role:* The system's core interactive anchor. Used for primary calls-to-action, active selections, keyboard focus rings, active navigation indicators, and brand identification.
2. **Supporting Accents (`secondary` & `tertiary`):**
   Optional supporting palette accents used for visual pacing, category separation, and focal emphasis. They are never mandatory:
   * **Secondary (`#00796B`, Rich Emerald):**
     * *Tokens:* `secondary` (`#00796B`) | `on-secondary` (`#ffffff`) — solid fill. `secondary-container` (`#e0f2f1`) | `on-secondary-container` (`#1a1c1e`, neutral charcoal) — soft fill.
     * *Role:* A cool, high-contrast supporting accent. Used for secondary action tiers, Category / Accent Card borders (`border-secondary`), and multi-series data differentiation. Distinct from `success` (`#146c2e`), which is reserved strictly for completed actions and positive outcomes.
     * *Contrast:* Passes WCAG AA contrast (~4.6:1) as text and borders on light backgrounds. Usable across all button and chip emphasis tiers (Filled, Outlined, Text).
   * **Tertiary (`#F9A825`, Sunny Amber):**
     * *Tokens:* `tertiary` (`#F9A825`) | `on-tertiary` (`#1a1c1e`) — solid fill. `tertiary-container` (`#fff0c2`) | `on-tertiary-container` (`#1a1c1e`, neutral charcoal) — soft fill.
     * *Role:* A warm, high-salience accent. Used for high-contrast spotlight cards (`prominence="inverted"`), focal badge highlights, and progress landmarks.
     * *Contrast Constraint:* **Never use Sunny Amber `#F9A825` for text (e.g. `text-tertiary`) or borders/outlines on white or light backgrounds.** It fails WCAG AA contrast (1.99:1).
     * *Approved Amber Patterns:*
       1. **Soft fill:** `tertiary-container` (`#fff0c2`) wash with neutral charcoal text (`on-tertiary-container`, `#1a1c1e`).
       2. **Solid badge:** Solid `tertiary` fill with neutral charcoal text (`#1a1c1e`), or an icon inside a solid-amber badge.
       3. **Dark card (Spotlight):** On dark `on-surface` (`#1a1c1e`) Inverted Cards, amber foreground text passes AAA contrast (8.55:1).
3. **Charcoal Text on Soft Washes:** All `*-container` tokens (`primary-container`, `secondary-container`, `tertiary-container`, `error-container`, `warning-container`, `success-container`, `neutral-container`) must use neutral charcoal (`#1a1c1e`) text ink. Never use chromatic or pastel font colors on container washes.

### 2. State & Status Colors (Error / Warning / Success / Neutral)

These four roles exist specifically to carry *system, operational, and task state* meaning — including domain-specific outcome feedback (correct/incorrect exercise responses) and operational conditions (offline, sync) — and must never be substituted with brand accents (`primary`/`secondary`/`tertiary`) or with each other.

*   **Error (Red): Destructive & Invalid States**
    *   *Tokens:* `error` (`#ba1a1a`) | `on-error` (`#ffffff`) — solid fill use (buttons, icons). `error-container` (`#ffdad6`) | `on-error-container` (`#1a1c1e`, neutral charcoal) — soft-fill use (banners, field error backgrounds).
    *   *Usage:* Validation errors, destructive confirmations, failed states, and incorrect-answer feedback in therapy exercises (e.g. a wrong-response indicator) — the same token covers both app-level failure states and domain-level "incorrect" outcomes; don't invent a separate color for exercise feedback.
*   **Warning (Burnt Orange): Caution States**
    *   *Tokens:* `warning` (`#8a5200`) | `on-warning` (`#ffffff`) — solid fill use. `warning-container` (`#ffe0b3`) | `on-warning-container` (`#1a1c1e`, neutral charcoal) — soft-fill use.
    *   *Usage:* Non-blocking caution states (e.g. "session expiring soon", "unsaved changes"). Deliberately a distinct orange, not `tertiary`'s amber — `tertiary` carries brand-highlight meaning (milestones, positive emphasis) and reusing that hue for warnings would make the same color mean two contradictory things.
*   **Success (Deep Green): Confirmation States**
    *   *Tokens:* `success` (`#146c2e`) | `on-success` (`#ffffff`) — solid fill use. `success-container` (`#c8f5ce`) | `on-success-container` (`#1a1c1e`, neutral charcoal) — soft-fill use.
    *   *Usage:* Completed actions, saved confirmations, passed checks, and correct-answer feedback in therapy exercises (e.g. a correct-response indicator) — the same token covers both app-level completion states and domain-level "correct" outcomes; don't invent a separate color for exercise feedback. Distinct from `secondary` (Rich Emerald), which is for informational/auxiliary content, not a confirmation state — a completed-state chip should use `success`, not `secondary`, even though both are in the green family.
*   **Neutral (Charcoal): Operational & Ambient System Status**
    *   *Tokens:* `neutral` (`#1a1c1e`) | `on-neutral` (`#ffffff`) — solid fill use. `neutral-container` (`#D5DCEB`) | `on-neutral-container` (`#1a1c1e`, neutral charcoal) — soft-fill use. For `InlineAlert` accent bars and icons, `on-surface` (`#1a1c1e`) and `surface` (`#ffffff`) may also be used directly.
    *   *Usage:* Non-critical operational conditions and background system status (e.g. offline mode active, sync pending, read-only session). Used in `InlineAlert` (`role="neutral"`) and `Chip` (`colorRole="neutral"`) to present informative system feedback without the urgency of a warning or the severity of an error. Stepping `neutral-container` (`#D5DCEB`, 87.8% lightness) one rung darker than `surface-variant` (`#E1E6F0`, 91.2% lightness) guarantees that neutral status tags remain distinctly visible even when placed inside highlighted table rows or menu headers (12.6:1 AAA contrast against `#1a1c1e` text).

### 3. Surface Hierarchy

Surfaces establish visual depth and guide attention. Instead of treating every container as a card, choose the surface prominence based on the element's priority and role in the interface:

1.  **Low Prominence (Canvas & Dividers — default layout):**
    *   *Tokens:* `background` (`#F6F7FB`), `outline-variant` (`#C8D0E0`) dividers.
    *   *Role:* Page canvas, full-width sections, and dense data displays (tables, lists). Relies on whitespace, typography, and subtle hairline dividers rather than container boxes. This should form the vast majority of any view.
2.  **Medium Prominence (Grouping & Content Containers):**
    *   *Grouped Fill:* `surface-container` (`#EEF1F8`), borderless, flat. A cool desaturated slate wash (42% saturation, Blue channel 248) used to visually cluster related form fields or secondary controls inside white cards without creating an elevated object. Because saturation is capped at 42%, it never competes with active 100% saturated blue selections (`primary-container`, `#dce6ff`).
    *   *Standard Cards:* White `surface` (`#ffffff`) with ambient elevation (`shadow-ambient`). Used to bundle a discrete, coherent entity (e.g. an exercise, a patient summary, a metric group).
    *   *Accent Cards:* White `surface` with a `2px` solid border in `secondary` (`#00796B`, Rich Emerald). Used to denote a specific thematic category or workflow track (e.g. clinical guide, reference protocol).
3.  **High Prominence (Spotlight & Hero Containers):**
    *   *Inverted Card (`prominence="inverted"`):* Solid dark charcoal `on-surface` (`#1a1c1e`) fill paired with high-contrast text (`invertedAccent="tertiary"` Sunny Amber or pure white). Used for primary callouts, hero milestones, or focal active drills.
    *   *Filled Card (`prominence="filled"`):* Saturated brand fill (`primary`, `secondary`, or `tertiary`) with high-contrast text. Used for solitary celebratory achievements or focal hero highlights. (For navigation choice sets or mode pickers, use Medium-Prominence Selectable Cards or a `ToggleGroup` instead).
    *   *Focal Discipline:* High-Prominence containers command maximum visual weight. They should be used intentionally for focal anchors rather than scattered across a grid. When multiple items compete for attention, downgrading secondary items to Medium-Prominence Standard Cards or Low-Prominence canvas groupings preserves visual hierarchy and prevents cognitive fatigue.

*   **Borders & Dividers:** Use `outline-variant` (`#C8D0E0`, 28% saturation slate) for subtle `1px` structural dividers and passive component borders (Menus, Popovers), and `outline` (`#737688`) for default interactive form-control boundaries. Standard content cards remain borderless.
*   **Rule of thumb:** If content can be structured using typography, whitespace, and list dividers (Low Prominence), do that first. Elevate to a Standard Card (Medium Prominence) only when the content forms a distinct, self-contained unit. Reserve Inverted and Filled Cards (High Prominence) for the primary focal point of the screen.
*   **Card nesting:** Never nest a Card inside another Card. A Card may sit within a `surface-container` section if separated by generous padding, but nesting identical elevation levels causes visual noise.
*   **Pedagogical & Clinician Tips (Instructional Guidance):** When presenting clinician guidance, articulation cues, or exercise tips within a Card or form, avoid nesting additional cards or alert banners. Instead, use a **Low-Prominence unboxed typographic lockup** (`<ClinicianTip />`): an inline icon (`lightbulb` or `info` in `secondary`, `#00796B`) or an inline micro-badge paired directly with `text-base text-on-surface-variant` and an optional bold lead-in (`<span className="font-semibold text-on-surface">Clinician tip:</span>`). It adds zero container weight inside an already-contained card. For multi-field form canvas groupings outside cards, an unbordered flat `surface-container` (`#EEF1F8`, `rounded-md p-3`) wash may be used inside white cards; if placed directly on the `#F6F7FB` page canvas, pair with a `1px` `outline-variant` border.
*   **Overlays are a separate axis, not a prominence tier:** Dialog, Popover, Menu, and Drawer chrome renders using a surface treatment with dedicated scrims, elevation, and focus-traps governed by Base UI portal setups (`component-library.md`).
*   **Page-frame chrome (Navigation):** The top navigation bar's `surface` background sits outside this containment ranking, distinguished from canvas only by a single `1px` `outline-variant` bottom border.
*   **Tooltips:** Tooltips intentionally invert this pattern (a solid high-contrast dark fill, no border — see Tooltips in Components) as a transient hint layer distinct from in-page surfaces.
*   **`surface-variant` (`#E1E6F0`) — component-internal neutral fill:** Paired with `on-surface-variant` (`#434656`) text (6.2:1 contrast, exceeding WCAG AA). Use this token for neutral fills inside a single component (avatar fallbacks, progress tracks, loading skeletons, and selected menu rows). Its cool desaturated slate tone (31% saturation, 91.2% lightness) ensures it never clashes with `primary-container` (`#dce6ff`, 100% saturation Electric Blue), while preserving clear separation between active brand selections and passive component internals. In contrast, `surface-container` (`#EEF1F8`) is reserved for grouping multiple items together.
*   **Border pairing rule for `surface-variant`:** If a component requires both a neutral fill and a visible border, use `outline` (`#737688`, 3.55+:1) for interactive controls (`Switch`, `Slider`), and `outline-variant` (`#C8D0E0`) for passive structural perimeters.
*   **The One-Rung-Skip Nesting Law:** Adjacent rungs on the neutral ladder (`background` `#F6F7FB` $\rightarrow$ `surface-container` `#EEF1F8` $\rightarrow$ `surface-variant` `#E1E6F0` $\rightarrow$ `neutral-container` `#D5DCEB` $\rightarrow$ `outline-variant` `#C8D0E0`) are ~4% lightness apart. Unbordered fills must skip at least one rung from their container background (e.g., inside white `#FFFFFF` surface cards, unbordered `surface-container` or `surface-variant` pops at 1.12:1 to 1.26:1). Directly on the `#F6F7FB` page background, `surface-container` must be paired with a `1px` `outline-variant` border so it doesn't vanish.

### 4. Tonal & Callout Backdrops

To make layouts feel colorful, premium, and lively while maintaining perfect contrast:
*   Avoid placing saturated brand colors under small body text unless pairing with appropriate high-contrast text: white text (`on-primary` / `on-secondary` / `on-error` / `on-warning` / `on-success`) or charcoal text (`on-tertiary`, `#1a1c1e` — never white text on Sunny Amber).
*   For urgent alerts, warnings, and system feedback, use the **Inline Alert** archetype (flat white `surface`, `rounded-l-none rounded-r`, borderless on top/right/bottom with a straight vertical 4px left accent bar). Do not use this archetype for routine instructional prose, clinician guidance, or static advice—use Low-Prominence typographic lockups (`<ClinicianTip />`) instead.
*   **Soft Container Washes (`*-container`/`on-*-container`)** provide soft role-specific fills for Chips & Tags (Pattern 3) and full-bleed modal/feature highlights paired with neutral charcoal text (`#1a1c1e`) — they are not used as standalone card backgrounds.

## Voice & Tone

Copy in the product follows plain-English, cognitive-accessibility-first writing, consistent with the platform's WCAG AA commitment:

- **Reading level:** Target a plain-English reading level (roughly UK Grade 6-8 / Flesch-Kincaid ~60-70). Prefer short, common words over clinical jargon; when a clinical term is unavoidable, plain-English it in the same sentence.
- **Sentence length:** One idea per sentence. Break up any sentence over ~20 words. Avoid nested clauses.
- **Voice:** Direct second person ("you"), active voice, present tense where possible. Avoid passive constructions ("the exercise has been completed by you" → "you completed the exercise").
- **Tone:** Encouraging and calm, never patronizing or clinical-cold. Avoid exclamation-heavy "hype" copy — enthusiasm comes from clarity and specificity, not punctuation, institutional posturing, or AI copywriting clichés (see `anti-patterns.md`).
- **UI Microcopy (Call Things What They Are):** Label navigation items, tabs, cards, and buttons using everyday, natural terms.
  - **Use:** "Caseload", "Patients", "Notes", "Exercises", "Results", "Settings", "Saved", "Offline".
  - **Never use:** "Caseload Repository", "Patient Profiles / Directory", "Clinical Narrative Storage", "Therapeutic Drill Matrix", "Telemetry Data Store". Never append pompous nouns ("Hub", "Matrix", "System", "Engine", "Repository", "Store") to make an ordinary feature sound more complex.
- **Factual Integrity (No Fabricated Capabilities):** Never invent technical, architectural, encryption, or security claims (e.g. "Firebase Enclave Security", "HIPAA Data Vault", "Zero-Knowledge Encryption"). UI badges, chips, and helper text must report verifiable app states only (e.g., "Saved", "Synced", "Offline") or user-provided data.
- **Link and action text:** Never use "click here" as link text, and give repeated generic labels ("Learn more", "Read more") a unique, descriptive accessible name where more than one appears on a page — see "No Ambiguous Link/Action Text" in `anti-patterns.md`.
- **Reference skills:** For longer-form patient-facing content (letters, leaflets, result summaries), use the global `patient-communication` skill. For reports, guidance docs, or internal documentation, use the global `govuk-style` skill. Both enforce this same plain-English, active-voice standard — use them rather than re-deriving tone from scratch. For content specifically aimed at readers with learning disabilities or cognitive impairment (a stricter, image-paired format, not just "simpler prose"), use the global `easy-read` skill instead of stretching the two above.

## Typography & Iconography

The typography strategy focuses on maximum legibility and clear information hierarchy. **Atkinson Hyperlegible Next** provides a modern, high-clarity feel for headlines, specifically designed to improve character recognition for users with low vision. **Lexend** is used for all body text, UI controls, small labels, and metadata; its scientifically designed character spacing reduces visual stress, prevents glyph crowding at small scales, and avoids font bloat.

- **Tailwind Class Mapping:**
  * Atkinson Hyperlegible Next (Headlines & display) -> Use `font-heading`
  * Lexend (All body copy, UI controls, buttons, labels, and metadata) -> Use `font-sans` (`font-label` is supported as a backwards-compatible alias)
  * Roboto Mono (Code/monospace, numeric data) -> Use `font-mono`
- **Scale & Minimum Floors:**
  * **Headlines & Display:** `display-lg` (`3rem` / 48px, 700 weight) is reserved for prominent marketing or desktop portal heroes. For tablet hero sections or compact desktop heroes, use `display-sm` (`2.5rem` / 40px, 700 weight, line-height 1.25), preventing awkward multi-line wrapping while maintaining a clear step above `headline-lg` (`2rem` / 32px, 600 weight).
  * **Body and prose text** starts at a strict minimum of `1rem` (16px, `body-md`) to ensure effortless reading for users with low vision and cognitive load considerations. Never set primary instructions, clinician advice, or body paragraphs below `1rem`.
  * **Dense Data Tables & Secondary Metadata (14px / 0.875rem Floor):** `body-sm` (`0.875rem` / 14px, `font-sans`, 400 weight, line-height 1.45) is the canonical 14px scale step. It is used for tabular data cells, compact secondary list rows, and sidebar metadata to prevent horizontal blowouts. `caption` is maintained as a semantic alias of `body-sm` for secondary annotations, timestamps, and form helper text. Neither token may be used for main prose, patient letters, or primary clinical instructions (which must remain at or above the mandatory 1rem floor).
  * **Compact UI metadata, badges, and timestamps** may scale down to `label-md` (`0.8125rem` / 13px) and `label-sm` (`0.75rem` / 12px), provided they use semibold weight (`font-semibold` / 600 weight, avoiding 700 bold at 12px to keep counter-spaces open and prevent glyph crowding on non-Retina displays) and are strictly limited to non-body metadata.
- **Weight:** Bold weights are used intentionally for headlines to create a strong visual anchor on the page.
- **Accessibility:** Avoid using light font weights (below 400) for any critical information.
- **Casing Restrictions:** All-caps text styling (`text-transform: uppercase`) is strictly prohibited. This applies to eyebrow labels, category tags, utility badges, table headers, and button labels. Visual hierarchy must be achieved through relative size, font weight (semibold/bold), and letter spacing adjustments instead. Sentence case is the default for body copy; Title Case is permitted for headings, buttons, and nav labels. Standard acronyms (WCAG, UI, SLT, ADHD, FAB) stay fully capitalized — the uppercase ban is about styling whole labels/phrases, not established acronyms.
- **Emphasis (no decorative italics):** Bold weight is the only sanctioned emphasis mechanism. Italic styling degrades legibility for dyslexic and low-vision readers and is prohibited for emphasis in UI copy and long-form content alike — this includes rendered markdown (`*em*`/`<em>`), not just component styling.
- **Alignment (never justify):** Body and prose text is always ragged-right (left-aligned, natural line breaks). Justified text creates uneven word-spacing "rivers" that are a known dyslexia readability failure — never apply `text-align: justify` to paragraph or long-form content, even where the anchor-left rule in Layout & Spacing is already followed for block-level alignment.
- **Text Wrap Balancing (`text-wrap: balance` & `text-wrap: pretty`):**
  * **Headings (`h1`–`h6`, `.text-display-*`, `.text-headline-*`):** Enforce `text-wrap: balance`. Balanced wrapping distributes word counts evenly across lines, preventing single-word typographic orphans and awkward rag lines on titles.
  * **Prose, Body, and Descriptions (`p`, `li`, `.text-body-*`, card descriptions, alerts):** Enforce `text-wrap: pretty`. Pretty wrapping prevents trailing single-word orphans on the final line of paragraphs without incurring the performance penalty of calculating balance across long multi-line text blocks.
  * **Integration with shadcn Typeset:** In `.typeset` containers, `text-wrap: balance` automatically applies to `.typeset h1-h4`, while `text-wrap: pretty` applies to `.typeset p, ul, ol, li`. Embedded interactive components (Cards, Forms, Callouts) opt out using `.not-typeset` or `[data-not-typeset]` to retain their component-specific margins and typography.
- **Underline (links only):** Underline styling is reserved exclusively for hyperlinks. Never use underline for emphasis, headings, or decorative styling — it creates ambiguity with actual links and adds visual noise without aiding legibility.
- **Heading hierarchy:** Never skip heading levels (e.g. an `h1` followed directly by an `h3`) to achieve a smaller visual size — pick the correct semantic level for document structure and use the type scale tokens (`headline-lg`/`headline-md`/`headline-sm`) to control its visual size independently. This matters for screen-reader users, who navigate long-form content by heading level.
- **Measure (line length):** Paragraph text must never be allowed to stretch to a container's full width. Long-form/prose copy is capped at the `measure` token (`40rem`, ~65-75 characters at `body-md` size) — apply it as a `max-width` on the prose wrapper, not by shortening the container itself. Lines that run wider than this are a genuine low-vision/dyslexia readability failure, not just an aesthetic preference.

### Long-Form Content Rhythm (Prose/Markdown)

The scale above governs discrete UI elements (a button label, a card headline). It intentionally does not cover *rendered long-form content* — therapy guides, chat messages, patient letters/leaflets, articles — which needs its own rhythm (spacing between paragraphs/headings/lists) rather than one-off component tokens. For that, use a [shadcn Typeset](https://ui.shadcn.com/docs/typeset)-style system, mapped to this design system's own tokens rather than left at its generic defaults:

```css
.typeset {
  --typeset-font-body: var(--font-sans);      /* Lexend -> body-md/body-lg */
  --typeset-font-heading: var(--font-heading); /* Atkinson Hyperlegible Next -> headline-* */
  --typeset-font-mono: var(--font-mono);
  --typeset-size: 1em;       /* container-relative, not root-relative — see note below */
  --typeset-leading: 1.5;    /* matches body-md lineHeight */
  --typeset-flow: 1.25em;
}

.typeset h1 { font-size: 1.875em; } /* ~30px base, ~37.5px large */
.typeset h2 { font-size: 1.5em; }   /* ~24px base, ~30px large */
.typeset h3 { font-size: 1.25em; }  /* ~20px base, ~25px large */
.typeset h4 { font-size: 1.125em; } /* ~18px base, ~22.5px large */
```

*   **Container-relative sizing:** `--typeset-size` uses `em` so type rhythm scales automatically with its container (e.g. compact in a chat bubble, roomier in an article). Ensure parent containers satisfy the 1rem (16px) body text floor.
*   **Proportional Heading Hierarchy:** Headings inside `.typeset` are explicitly sized in container-relative `em` units (`h1`: 1.875em, `h2`: 1.5em, `h3`: 1.25em, `h4`: 1.125em). When the `.typeset-large` accessibility preset scales `--typeset-size` to `1.25em`, headings scale up proportionally alongside body text, preventing semantic hierarchy collapse.
*   **Anti-Nesting Rule:** Never nest `.typeset` containers inside one another, as container-relative `em` values would compound multiplicatively. Keep `.typeset` on the outermost prose boundary.
*   **Presets, not one global setting.** Keep at least two contexts distinct rather than reusing one preset everywhere:
    *   `.typeset-chat` — tighter rhythm for therapist/patient chat messages: `--typeset-flow: 1em`, `--typeset-leading: 1.5`.
    *   `.typeset-guide` — roomier rhythm for therapy guides, leaflets, and articles: `--typeset-size: 1.125em` (scales relative to container, matching `body-lg` ratio), `--typeset-leading: 1.55`, `--typeset-flow: 1.5em`.
*   **Reader-adjustable size (accessibility, not just a dev preset):** expose a user-facing toggle that swaps in a `.typeset-large` preset (`--typeset-size: 1.25em`, `--typeset-leading: 1.8`, `--typeset-flow: 1.75em`) for readers who need larger type. This is additive to, not a replacement for, the 1rem body-text floor everywhere else.
*   **Measure lives on the wrapper**, using the `measure` token (`max-width: 40rem`) — Typeset itself does not constrain width, matching the guidance above.
*   **Opt out interactive components:** an embedded exercise Card or Callout inside a guide should keep its own component styling, not prose defaults — mark it `not-typeset` (or `data-not-typeset`) rather than letting paragraph/heading rules leak into it.
*   All other rules in this file still apply inside `typeset` content — no uppercase, no emoji, WCAG AA contrast, etc.

- **Material Symbols (Iconography):**
  * Icon font family class: `material-symbols-outlined`
  * Example: `<span className="material-symbols-outlined" aria-hidden="true">home</span>`
  * Standard Size Scale Matrix (Harmonized with Typography & Readability Floors):
    Always prefer the `<Icon size="..." />` primitive (`src/components/ui/icon.tsx`), which guarantees exact optical alignment with the typography scale and prevents sub-baseline rendering:
    - **`xs` (14px / 0.875rem):** Micro action triggers, inline metadata tags, table row actions. Harmonizes with the `caption` (14px) typography floor for secondary metadata.
    - **`sm` (16px / 1rem):** Compact chips, dense metadata badges, inline close triggers. Harmonizes directly with the mandatory 1rem (`body-md`) readability floor.
    - **`md` (20px / 1.25rem):** Form field leading icons, standard button icons, menu row icons. Calibrated to maintain optical balance on 48px touch targets alongside 16px body text.
    - **`lg` (24px / 1.5rem):** Inline alert headers, toast indicators, section titles. Harmonizes with `headline-md` (1.5rem).
    - **`xl` (32px / 2rem):** Hero cards, milestone achievements, victory dialog headers. Harmonizes with `headline-lg` (2rem).
    *(Note on Tailwind utilities: In standard Tailwind, `text-xs` is 12px, `text-sm` is 14px, `text-base` is 16px, `text-xl` is 20px, and `text-2xl` is 24px. To prevent icons from inadvertently falling below the 16px readability baseline floor, always use the `<Icon size="..." />` primitive rather than applying raw font-size utilities).*
  * Accessibility: Use `aria-hidden="true"` on decorative icons. For standalone/interactive icons, provide descriptive text inside a `.sr-only` element or an `aria-label`. Use the `<Icon />` component primitive (`src/components/ui/icon.tsx`). Never mix icon libraries. Never convey meaningful text or labels through CSS `content` pseudo-elements (`::before`/`::after`) without providing alternative speech text (e.g. `content: url(...) / "Alt";` or `content: "badge" / ""`) per WCAG F87; always prefer accessible DOM elements.
  * **Dual-State Icon Transitions (`<Icon.Toggle />` & `<Icon.CrossFade />`):** When swapping action icons (e.g. Copy $\rightarrow$ Check, Mute $\rightarrow$ Unmute, Pin $\rightarrow$ Unpin), do not perform an instantaneous DOM unmount/mount. Use `<Icon.Toggle onName="..." offName="..." active={...} />` or `<Icon.CrossFade name={...} />`. These stack both icons in an identical 1×1 grid cell to prevent 1px layout jitter, morphing opacity, scale (`scale-[0.25] opacity-0 blur-[var(--blur-small)]` $\leftrightarrow$ `scale-100 opacity-100 blur-0`) over 150ms (`--duration-quick`) with `--ease-standard`. Screen readers receive dynamic announcements via `onLabel` / `offLabel` or `srLabel`. In `prefers-reduced-motion: reduce`, the transition resolves instantaneously without transform or blur.

## Layout & Spacing

The design system utilizes a **Fluid Grid** with a strict 0.5rem (8px) baseline rhythm to ensure consistency across all components.

- **Desktop (80rem / 1280px max):** 12-column grid with 1.5rem (24px) gutters (`gutter`) and 4rem (64px) side margins (`margin-desktop`). 
- **Tablet (48rem - 79.9375rem / 768px - 1279px):** 8-column grid with 1.5rem (24px) gutters (`gutter`) and 2rem (32px) side margins (`margin-tablet`).
- **Mobile (0rem - 47.9375rem / 0px - 767px):** 4-column grid with 1rem (16px) gutters (`gutter-mobile`) and 1rem (16px) side margins (`margin-mobile`).

Content is organized into clear vertical stacks. Vertical spacing between logical sections should be generous (typically 4rem/64px or 5rem/80px) to prevent cognitive overload and maintain an uncluttered, calm feeling.

- **Anchor left:** Don't center everything — F-pattern scanning means left-alignment is the anchor for body content, forms, and lists. Reserve centering for short, celebratory, or standalone confirmation messages (e.g. an empty state, a completion screen).
- **Responsive Architecture (Components vs. Viewport):**
  - **Core Contract:** *Components adapt to their container, pages adapt to the viewport.*
  - **Architectural Scope & Composition Layers:**
    - **Primitives (`src/components/ui/`):** Headless Base UI atoms and design system tokens. Zero business logic. Must never import from blocks or features.
    - **Composite Blocks (`src/components/blocks/`):** Reusable, presentational or controlled UI compositions built strictly from primitives and design system tokens. Blocks are pure UI assemblies: they receive data via props, render responsive container layouts, and emit user intents via callbacks (`onAction`, `onChange`, `onConfirm`), with zero coupling to databases, authentication sessions, or network transport. Blocks must declare `@container` on their block-level outer wrapper (with explicit `w-full` or grid column width) and style internals with container query variants (`@md:`, `@lg:`) rather than viewport breakpoints.
    - **Feature Views (`src/features/` or `src/views/`):** Domain-specific screens and application workflows. Owns state, data fetching, routing, and network transport. Decoupled from the shared component registry.
  - **Component-Level Internals (`@container`):** Reusable UI primitives and modular blocks (`Card`, `Drawer` panels, `Dialog` layouts, `Table` wrapper, list rows, `ThinkingOrb` status blocks, `FilterToolbar`, `StatStrip`) must rely on Tailwind v4 native container queries (`@container` on the block-level container wrapper with a defined extrinsic width like `w-full`, paired with `@sm:`, `@md:`, `@lg:` variants on child elements) rather than viewport media queries (`sm:`, `md:`, `lg:`). Never place `@container` directly on native `<table>`, `<tr>`, or unconstrained inline/flex children without explicit width, as inline-size containment breaks table layout algorithms and collapses auto widths to zero. A card or summary block must ask "How wide is my container?" so that when placed in a narrow off-canvas drawer (e.g. 380px) or a 3-column dashboard grid on a 4K display, it stays cleanly stacked rather than exploding into horizontal multi-column layouts.
  - **Page-Level Shells (Viewport Breakpoints):** Viewport breakpoints (`sm:`, `md:`, `lg:`, `xl:`) are reserved strictly for page-level frame chrome: the top navigation header collapse, global page grid margins (`margin-desktop`, `margin-tablet`, `margin-mobile`), and root dashboard column splits.
- **Touch targets:** Minimum 2.75rem × 2.75rem (44×44px) for any interactive element, as a general floor (WCAG 2.2 SC 2.5.8). Individual components in this file set stricter minimums where warranted (standalone action Buttons: 3rem/48px; Lists: 3.5rem/56px row height; compact controls like Steppers/Accordion triggers: 2.75rem/44px). Where the visual control is inherently smaller than 44px (e.g. 20px Checkboxes/Radios, or 32px/40px Avatars acting as buttons), the clickable/tappable hit area must still be expanded to at least the 2.75rem floor via padding or wrapper containers. *(Exception: On small mobile screens $\le 320\text{px}$, OTP digit boxes scale down to 40px width with 48px height to satisfy 320px reflow without horizontal scrolling under WCAG 1.4.10, comfortably surpassing the official WCAG 2.2 AA SC 2.5.8 24×24px target floor).*

## Elevation & Depth

To maintain high contrast and visual clarity while avoiding heavy visual clutter, this design system uses **Borderless Cards**, **Ambient Elevation**, and **High-Visibility Focus Indicators**.

- **Borderless Cards:** Standard content cards are **borderless by default** (`border-none`), using flat white `surface` (`#ffffff`) on a light `background` canvas (`#F6F7FB`) paired with crisp ambient elevation (`shadows.ambient` / `shadow-ambient`). This provides natural 3D layer separation without heavy outline ink.
- **Layered Multi-Stop Ambient Shadows (Umbra + Penumbra):** Shadows in this system are strictly multi-stop compositions rather than muddy single-layer drop shadows. 
  - Standard single-layer CSS shadows (`0 4px 12px rgba(...)`) create a blurry linear smear characteristic of generic AI UI.
  - Our tokens combine a tight, low-opacity contact shadow (the umbra) to ground the container against the canvas, with a diffused, high-radius dispersion layer (the penumbra) to mimic natural light falloff.
  - All shadows are strictly tinted with our neutral ink token (`rgba(26, 28, 30, ...)`) rather than pure carbon black (`#000000`), preserving color harmony with the `#F6F7FB` clinical canvas.
- **Elevation Prominence Budget (Strict 3-Tier Rule):** Avoid sprawling multi-step shadow scales (`shadow-xs` through `shadow-2xl`). All elevation in the application is strictly budgeted into three semantic roles:
  - `shadow-ambient`: Standard modular content cards and Tier B anchored overlays.
  - `shadow-ambient-hover`: Interactive card lift on pointer hover.
  - `shadow-modal`: Tier A blocking dialogs and full-height drawers over backdrop scrims.
  - *Zero-Shadow Baseline:* Page-frame chrome (Header, Navigation Bar), Toolbars, Buttons, Text Inputs, Chips, and Inline Alerts maintain **zero box-shadow**. Never give shadows to flat controls. *(Exception: Sticky Navigation Bar maintains zero box-shadow at rest, but applies `shadow-ambient` dynamically when stuck over scrolled page content via `@container scroll-state(stuck: top)`).*
- **Physical Borders Over Faux Shadow-Rings:** We reject simulated border tricks like `smooth-shadow-ring` (`box-shadow: 0 0 0 1px ...`). In Windows High Contrast Mode (`forced-colors: active`), browsers completely strip all `box-shadow` properties, causing faux-bordered elements to melt invisibly into the canvas. All floating overlays must maintain real physical CSS borders (`border-outline-variant` 1px or 2px) so container perimeters remain fully legible across all assistive technologies.
- **Structural Controls (Forms):** Form fields (inputs, selects, textareas) retain crisp 1px `outline` borders (`#737688`) to guarantee WCAG 2.2 SC 1.4.11 3:1 non-text contrast for interactive affordances (`outline-variant` `#C8D0E0` is reserved for passive structural dividers and disabled states).
- **Input + Action Row Height Equality & Optical Balance:** When an `<Input />`, `<Select />`, or `<Textarea />` sits side-by-side with a `<Button />` in a horizontal row (e.g. search bars, filter toolbars, prompt inputs, subscription boxes), both controls must share identical computed heights across all size tiers:
  - `sm` (Compact Tier): `44px` (`h-11 min-h-[44px]`).
  - `md` (Standard Tier — Default for CTAs & Forms): `48px` (`h-12 min-h-[48px]`).
  - `lg` (Prominent / Hero Tier): `56px` (`h-14 min-h-[56px]`).
  - **Symmetrical Icon Inset Balance:** When an input carries a leading or trailing icon, the gap from the container edge to the icon must equal the gap from the icon to the text ($\text{gap}_{\text{edge}\to\text{icon}} = \text{gap}_{\text{icon}\to\text{text}}$), following $\text{textPaddingStart} = \text{iconInset} + \text{iconWidth} + \text{iconInset}$. For standard `md` inputs with 14px insets and a 20px icon, text starts at 48px (`pl-12`), preventing text from hugging the icon. Buttons in horizontal rows must declare `shrink-0 whitespace-nowrap` to prevent label wrapping or crushing when inputs expand in flex containers.
- **Interaction Elevation & Selection (Cards):** On hover/interaction, cards lift with enhanced ambient elevation (`hover:shadow-ambient-hover`). For **Selectable Cards**, active selection transitions from borderless to a 2px `primary` border (`borderWidth.emphasis`) paired with a clear background wash (`bg-primary-container`, `#dce6ff`) and an active indicator.
- **Floating Containers:** Dialog, Drawer, Popover, Menu/Select/Dropdown, and Toast are elevated above page content with dedicated permanent shadows and consistent tier-based geometry:
  - **Tier A — Modal, blocking (Dialog, Drawer):** Dialog uses `rounded.lg` (1rem / 16px) with a `1px` `outline-variant` border (`borderWidth.default`, matching `dialog.tsx`). Full-height Drawers anchor flush against viewport edges using `rounded-none` and a single dividing border (`border-l` / `border-r`), preventing corner-miter distortion and bezel notches. Both share modal elevation (`shadows.modal` / `shadow-modal`) and backdrop scrims.
  - **Tier B — Anchored, non-modal (Popover, Menu/Select/Dropdown, Combobox):** `rounded.DEFAULT` (0.5rem / 8px), `1px` border (`borderWidth.default`) + ambient shadow. (Unifies Popovers and Menus under a single 8px overlay radius).
  - **Tier C — Ambient notification (Toast):** Asymmetric rounding (`rounded-l-none rounded-r-default`), borderless on top/right/bottom with a `4px` vertical left accent bar (`border-l-4`, `borderWidth.accent`) for state roles + ambient shadow.
- **Streamlined Focus States vs. Active Selection:** High-visibility focus rings are mandatory in Primary Electric Blue (`#0052FF`). To prevent visual collision between keyboard focus and active selection (WCAG 2.2 SC 2.4.7 & SC 3.2.2), keyboard focus indicators float with an explicit external offset (`outline-offset: 2px` / `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`), while active selection uses a flush 2px border plus a subtle surface wash:
  - **Form controls (hollow container inputs: Input, Select, Textarea, OTP Field, Combobox, Autocomplete, NumberField):** Use a flush 2px focus indicator with negative offset (`border-primary focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary`). The negative 1px offset pulls the 2px outline inward to cleanly cover the 1px resting border, while `border-primary` provides subpixel anti-aliasing safety. This eliminates concentric double-ring or "target reticle" artifacts while maintaining flawless 3:1 contrast (WCAG 2.4.13) and Windows High Contrast Mode compatibility.
  - **Buttons, interactive containers, Cards, and Selection Controls (Checkbox, Radio, Switch):** Focus rings maintain the standard floating 2px external offset (`outline-offset: 2px`).
    - *Selection Controls (Checkbox, Radio, Switch):* A floating 2px ring halos cleanly outside the 1px resting border, avoiding optical collisions and keeping internal checkmarks or radio dots uncramped. On circular Radio controls, using an expanded `3px` offset (`outline-offset: 3px` / `focus-visible:outline-offset-[3px]`) provides comfortable breathing room between the 20px circular boundary and the Electric Blue focus halo, eliminating optical crowding against the 2px checked border. Parent hit-target wrappers (the 44×44px tap containers) must never use `overflow-hidden`, ensuring the external focus halo is never clipped.
    - *Cards (including Selectable Cards):* Tabbing onto an unselected card renders a 2px primary outline separated from the card boundary by a 2px gap, keeping it unmistakably distinct from a selected card's flush 2px border. When a selected card receives focus, both the flush border/tint and the outer offset focus ring are simultaneously visible.
  - All focus indicators use real `outline`/`border` properties for Windows High Contrast / `forced-colors` mode compatibility.

## Motion & Animation

Motion is quick, purposeful, and understated — never bouncy or decorative. It exists to clarify a state change (something opened, failed, or loaded), not to entertain. This section anchors the *values*; full implementation snippets live in the `transitions-dev` skill (new motion) and `transitions-polish` skill (tuning existing motion) — reference the same scale rather than hand-rolling new numbers.

### The 5 Rules for Motion Polish
1. **Open / Close Timing Asymmetry (Close $\le$ Open):** Every dismiss or exit transition must be at least as fast as or faster than its entrance. Dismissing a surface should always feel lighter and quicker than summoning it.
2. **Intent Delays on Hover / Tooltips:** Use a calibrated delay (100–150ms, `--duration-quick`) before opening hover cards or tooltips to avoid phantom flashes when a cursor sweeps across a screen.
3. **Calibrated Physical Travel Distances:** Never use large arbitrary 32px or 48px jumps. Motion distances reflect physical scale:
   - `--distance-micro` (4px): In-place text swaps, icon nudges, micro-elevation.
   - `--distance-small` (6px): Compact menus, badges, chip transitions.
   - `--distance-base` (8px): Dropdowns, popovers, step-wizard horizontal panel slides.
   - `--distance-medium` (12px): Dialog scale-float offsets.
   - `--distance-roomy` (16px): Full drawer entry offsets and toast vertical slide-ins.
4. **Blur-Coupled Micro-Primitives Only (Never on Large Text Overlays):** Optical blur (`--blur-small: 2px` or `--blur-medium: 3px`) is strictly reserved for compact in-place micro-primitives (`<Icon.Toggle/>`, `<TextSwap/>`, `<Skeleton.Reveal/>`, badge pops). Never animate `filter: blur()` on large text-bearing containers or overlays (Dialog, Drawer, Popover, Menu, Select). In WebKit/Safari, animating CSS blur across text forces full-subtree GPU re-rasterization on every frame and causes visible subpixel font-rendering flicker/weight snaps as blur reaches 0px; for low-vision and dyslexic readers, moving blurred text induces visual accommodation strain. Overlays must rely exclusively on crisp `opacity` + `transform` transitions.
5. **The Stagger Cap:** Multi-item stagger animations must use `--duration-stagger: 40ms` and strictly cap at **5 items maximum** ($\text{max cumulative delay} = 5 \times 40\text{ms} = 200\text{ms}$). Items beyond index 5 animate concurrently with item 5 to ensure list renders never introduce perceived UI latency.

### Explicit Property Targeting (Never `transition-all`)
Never use `transition-all` on cards, layout containers, or dialogs. Blanket transitions force the browser style engine to recompute layout geometry on unrelated style changes, producing paint thrashing and visible frame drops. Always target explicit CSS properties:
- Cards: `transition-[box-shadow,border-color,background-color,transform]`
- Dropdowns / Popovers / Dialogs / Drawers: `transition-[opacity,transform]` (never `filter` — keeps text rendering crisp and eliminates Safari font-smoothing snaps)
- Accordions / Expandables: `overflow-hidden h-[var(--accordion-panel-height)] transition-[height]` (Base UI dynamically computes `--accordion-panel-height`; `overflow-hidden` is mandatory to prevent content overflow during collapse)
- Icons / In-Place Swaps / Skeletons: `transition-[opacity,transform,filter]` (where optical blur softens in-place micro-motion)

### Per-Component Durations & Motion Pairings
- **Dialog:** open `250ms` ("fast"), close `150ms` ("quick") — scale-in/out modal pairing (`scale-[0.98]` $\leftrightarrow$ `scale-100`).
- **Popover, Menu, Select, Dropdown:** open `250ms` ("fast"), close `150ms` ("quick") — slide-down pairing (`--distance-base: 8px`).
- **Drawer:** open `400ms` ("slow"), close `350ms` ("medium") — physical side-panel slide pairing (`--distance-roomy: 16px`).
- **Toast:** open `400ms` ("slow"), close `350ms` ("medium") — bottom-up rise pairing. Dismiss action buttons must maintain a minimum 44×44px hit-target (`min-w-[44px] min-h-[44px]`) to satisfy WCAG 2.2 SC 2.5.8.
- **Accordion:** open/close `250ms` ("fast", `--duration-fast`) with `--ease-standard` on both the panel height reveal and chevron rotation.
- **Emphasis-only moments:** `500ms` ("emphasis" / "very slow", `--duration-emphasis`) — reserved strictly for celebratory milestones (`SuccessCheck`, badge unlock); never on standard UI chrome.
- **Motion Restraint on High-Frequency Controls:** Checkboxes and switches do not use 350ms stroke-draws or double-bounce springs. Standard chrome uses crisp 150ms micro-transitions.

### Essential Motion Primitives
The design system ships 10 reusable motion primitives in `@/components/ui/` that implement these polish standards:
- **`Skeleton` & `Skeleton.Reveal` (`skeleton.tsx`):** Subtle pulse track on solid `bg-surface-variant` (never generic grey). The companion `Skeleton.Reveal` provides a seamless dual-layer cross-blur transition (`--blur-medium: 3px` over `--duration-fast: 250ms`) from skeleton to real content without layout pop. Supports polymorphic `as="div" | "span"` and `data-slot="skeleton"`.
- **`TextSwap` (`text-swap.tsx`):** In-place vertical slip for status, tab, or metric label swaps (4px travel + 2px blur over 150ms).
- **`NotificationBadge` (`notification-badge.tsx`):** Diagonal slide + scale-pop badge entrance (150ms) that renders isolated from parent layout flow.
- **`TextsReveal` (`texts-reveal.tsx`):** Staggered multi-line text entrance enforcing the 40ms stagger cap ($\le 5$ lines / 200ms max).
- **`NumberRoll` (`number-roll.tsx`):** Tabular vertical digit odometer with `tabular-nums` ensuring fixed character widths.
- **`NumberPopIn` (`number-pop-in.tsx`):** Spring digit pop-in entrance with 70ms stagger on trailing decimals.
- **`SpinningCounter` (`spinning-counter.tsx`):** Vertical clipped reel odometer with 90ms column stagger and gradient edge masks.
- **`ShimmerText` (`shimmer-text.tsx`):** Directional highlight shimmer across active or processing text labels.
- **`ErrorShake` (`error-shake.tsx`):** 3-cycle horizontal error pulse (300ms) on invalid form actions or blocked requests.
- **`SuccessCheck` (`success-check.tsx`):** Calibrated SVG stroke-draw checkmark over 500ms for confirmation dialogs.

### Mandatory Accessibility Fallback
**`prefers-reduced-motion` is mandatory, not optional**, for every component in this system. Every transition must ship a `@media (prefers-reduced-motion: reduce)` / `motion-reduce:transition-none` fallback that strips translation, scale, and blur, preserving instant or opacity-only state changes. Never drop the state change itself, only the motion. Base UI components must use `[data-starting-style]` and `[data-ending-style]` CSS transitions rather than CSS keyframes.

## Shapes

The shape language uses two primary corner radii — compact controls stay square-ish (`rounded.DEFAULT`) while larger containers get a more generous curve (`rounded.lg`) — plus two deliberate, named exceptions. This choice balances structured precision with an approachable feel, ensuring interactive elements look reliable and clean.

Radius and border-width are defined once as scales in the frontmatter (`rounded`/`borderWidth`) — components reference the scale name below rather than each restating its own raw value, so a future change only happens in one place.

- **The Universal Concentric Border Radius Law:** When nesting an element (e.g. an image, media canvas, inner callout block, or button) inside a container with padding, corner radii must be concentric rather than identical. Using identical radii creates optical pinch and uneven concentric margins.
  - **Formula:** $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$.
  - **The Boundary Clamp:** If $\text{padding} \ge R_{\text{outer}}$, then $R_{\text{inner}} = 0$ (`rounded-none` / 0px). When padding meets or exceeds the outer radius, the corner curve has already fully completed within the padding margin; applying an inner curve creates a distorted nested-bubble effect.
  - **Standard Token Combinations:**
    - *Segmented control shells:* Outer `rounded` (8px) with `p-1` (4px padding) $\implies$ Inner items use `rounded-sm` (4px): $8\text{px} - 4\text{px} = 4\text{px}$.
    - *Cards with inset media/drills:* Outer `rounded-lg` (16px) with `p-2` (8px padding) $\implies$ Inset media uses `rounded` (8px): $16\text{px} - 8\text{px} = 8\text{px}$.
    - *Cards with generous padding:* Outer `rounded-lg` (16px) with `p-4` (16px) or `p-6` (24px padding) $\implies$ Inset elements use `rounded-none` (0px) per the boundary clamp.
- **`rounded.sm` (0.25rem / 4px):** Concentric inner interactive items: Menu rows, Context Menu rows, Toggle buttons inside a container, Tab buttons inside segmented lists, and dense action items ($R_{\text{inner}} = R_{\text{outer}} - \text{padding} = 8\text{px} - 4\text{px} = 4\text{px}$).
- **`rounded.DEFAULT` (0.5rem / 8px):** Buttons, Input Fields, Menus/Selects/Dropdowns, Popovers, Combobox panels, and outer segmented control shells (Toolbar shells, Menubar container, Toggle Group shells, Segmented Tab lists). Follows the concentric border radius formula: $R_{\text{outer}} = R_{\text{inner}} + \text{padding} = 4\text{px} + 4\text{px} = 8\text{px}$.
- **`rounded.md` (0.75rem / 12px):** Intermediate standalone cards, medium containers, or callout panels where 1rem is too large.
- **`rounded.lg` (1rem / 16px):** Standard Cards and Dialogs. (Full-height Drawers docking against viewport bezels use `rounded-none` to prevent corner-miter distortion and backdrop crescent gaps).
- **asymmetric rounding (`rounded-l-none rounded-r`):** Toasts & Inline Alerts — keeping the 4px vertical accent bar perfectly straight on the left (0px) while softly harmonizing the right edge (0.5rem / DEFAULT) with surrounding components.
- **`rounded.full` (9999px, fully rounded):** Chips & Tags, Avatars, and Radio controls — three circular exceptions to the rectangular radii above, two stylistic (Chips, Avatars) and one functional (Radio, where circular-vs-square is the actual affordance distinguishing "choose one" from "choose any" — see Selection Controls). Grouping the container-scale pair together is what keeps that silhouette distinct: every *rectangular* container in the system (Buttons, Cards, Dialogs, Menus) stays on `DEFAULT`/`lg`, while Toasts and Inline Alerts use `rounded-l-none rounded-r`.
- **`borderWidth.default` (1px):** Dialog modal borders, Menu/Select/Dropdown and Popover structural borders, the Colored Outline chip pattern (Chips & Tags), and resting form-control borders (Input Fields, Checkbox/Radio, Toggle, Toggle Group container). Standard content cards are borderless.
- **`borderWidth.emphasis` (2px):** Drawer docked dividing borders, the Active Selection state and Accent Card variant (Components > Cards), Outlined buttons, and Radio's checked-state ring (Selection Controls).
- **`borderWidth.accent` (4px):** Inline Alert vertical left accent bar, and the matching vertical left accent bar on state-flavored Toasts (error/warning/success/neutral) — the only two components that use this accent-bar treatment; every other component sticks to `default`/`emphasis` border widths or no border at all.
- **This list highlights the primary uses of each width, not an exhaustive registry** — as new components are added, default to `borderWidth.default` for any resting structural/form-control border and `borderWidth.emphasis` for any 2px selected/active/outlined treatment, rather than inventing a new width value.

## Navigation, Command & Selection Architecture

To ensure agents and engineers select the correct primitive and maintain strict WAI-ARIA and cognitive accessibility boundaries, use the following taxonomy:

| Primitive | Base UI Package | WAI-ARIA Role | Primary Purpose | Interaction & Triggers | When to Use | When NOT to Use |
|---|---|---|---|---|---|---|
| **`NavigationMenu`** | `@base-ui/react/navigation-menu` | `<nav>` / `navigation` | Site & application routing | Hover/click delay; morphing viewport/positioner across content panels | Top-level application header with page routes and sub-navigation links | **Not** for executing commands/actions (e.g. Save, Delete), form controls, or desktop toolbars |
| **`Menu`** | `@base-ui/react/menu` | `role="menu"` / `menuitem` | Single-button action dropdown | Click/press trigger button; opens popup list of commands | Isolated action menus, "..." overflow menus, record action buttons | **Not** for multi-menu desktop bars (use `Menubar`), global site nav (use `NavigationMenu`), or right-click (use `ContextMenu`) |
| **`Menubar`** | `@base-ui/react/menubar` + `menu` | `role="menubar"` / `menu` | Desktop application command system | Persistent horizontal bar; arrow-key hopping between menus; keyboard shortcuts (`⌘N`, `Ctrl+Z`) | Desktop-class workspaces, clinical editor suites, IDEs with File/Edit/View/Tools | **Not** for website page routing links (use `NavigationMenu`) or a standalone dropdown button (use `Menu`) |
| **`ContextMenu`** | `@base-ui/react/context-menu` | `role="menu"` | Secondary pointer-anchored actions | Right-click, long-press, or `Shift+F10`; opens at pointer coordinates | Power-user shortcuts on table rows, canvas nodes, card surfaces | **Never** as the sole way to trigger an action (mobile/touch users cannot right-click reliably; always provide a visible `Menu` or button) |
| **`Toolbar`** | `@base-ui/react/toolbar` | `role="toolbar"` | Persistent action strip / formatting tools | Arrow key navigation with **single tab stop**; buttons stay visible and don't dismiss on click | Rich text formatting bars, media audio/playback controls, canvas tool palettes | **Not** for hierarchical dropdown menus (use `Menubar`) or page navigation (use `NavigationMenu`) |
| **`Tabs`** | `@base-ui/react/tabs` | `role="tablist"` / `tab` / `tabpanel` | Mutually exclusive content views on same page | Tab click unhides paired `tabpanel`; 1 active panel at a time | Switching between views/sections of a card, dashboard, or patient record | **Not** for executing commands (e.g. "Export" is not a tab) or multi-select filters (use `ToggleGroup`) |
| **`ToggleGroup`** | `@base-ui/react/toggle-group` | `role="group"` with `aria-pressed` | Mode/filter selection without view panels | Toggles boolean states (single 1-of-N or multi N-of-M) | Segmented controls, filter bars, layout toggles (Grid/List), text formatting buttons inside a Toolbar | **Not** for switching entire DOM content panels (use `Tabs`) or routing to new URLs (use `NavigationMenu`) |

## Components

### Buttons
Buttons are defined by two independent choices — pick each separately, don't conflate them:

*   **Emphasis (how prominent):**
    *   **Filled (highest):** Solid color-role background + matching `on-*` text (`on-primary`/`on-secondary`/`on-tertiary`/`on-error`/`on-warning`/`on-success`). Reserved for the one or two most important actions on a screen.
    *   **Outlined (medium):** `2px` border in the color role + text in the same role, on a neutral `surface` (white) fill — never a tinted fill of the same hue, which collapses into the banned triple-tint pattern.
    *   **Text (lowest):** No border, no fill — colored text only. Use for low-stakes actions like "Cancel", "Skip", or "Learn more".
*   **Color role (what it means) — choose based on the action's actual meaning, not habit:**
    *   **`primary`:** the screen's core/main action. Usable at any emphasis tier.
    *   **`secondary` (Rich Emerald):** informational or auxiliary actions (e.g. "View guide", "Learn more"). Passes AA as text on light backgrounds — usable at any emphasis tier (Filled, Outlined, Text).
    *   **`tertiary` (Sunny Amber):** milestone, celebratory, or highlight actions (e.g. "Claim your reward", "Start challenge"). **Filled only** — per the Tertiary contrast constraint, Sunny Amber cannot be used for text or borders on light backgrounds, excluding it from Outlined and Text buttons.
    *   **`error`:** destructive actions. Filled for the primary confirm action in a destructive dialog; Outlined/Text for a lower-emphasis destructive option alongside it.
    *   **`success`:** confirming a positive or completed action (e.g. "Mark as correct", "Approve", "Confirm completion") — matches the exercise/completion semantics in State Colors. Passes AA as text/border on light backgrounds (6.5:1) — usable at any emphasis tier, same as `secondary`.
    *   **`warning`:** proceeding with a non-blocking caution, short of destructive (e.g. "End session early", "Continue without saving", "Skip this step"). Passes AA as text/border on light backgrounds (6.4:1) — usable at any emphasis tier. Don't reach for `error` here just because it's the only other non-`primary` option available; `warning` exists precisely for this "caution, not destruction" middle ground.

All tiers: standard height 3rem (48px, `size="md"`) for accessible patient hit targets, with a sanctioned compact 2.75rem (44px, `size="sm"` / `h-11`) density tier for dense desktop clinician workspaces (toolbars, multi-column phoneme tables, context headers), fully compliant with WCAG 2.2 AA's 44×44px floor. Corner radius: `0.5rem`. Component foundation: build on **Base UI** (`@base-ui/react`) primitives, styled with these tokens — do not hand-roll button focus/disabled/pressed states that Base UI already provides.

### Input Fields
Built on Base UI's `Field`/`Input`/`Fieldset` primitives (see `component-library.md`) — don't hand-roll label/error/description wiring that Base UI's `Field` already provides.

Inputs feature standard 3rem (48px, `size="md"`) height for patient-facing forms, and an official 2.75rem (44px, `size="sm"` / `h-11`) compact tier for desktop clinician toolbars, search headers, and dense data views. Inputs must feature a high-contrast label above the field, always an explicit `<label>` association — never placeholder text standing in as the only label. `0.5rem` corner radius (`rounded.DEFAULT`), matching Buttons as the other primary form control. The border should darken to the Primary color when focused, using the same high-visibility focus ring as every other interactive element (see Elevation & Depth).

Error states must use a combination of a border in the `error` token color and a leading icon to ensure accessibility for color-blind users — and the error message text must be programmatically associated with the input (e.g. `aria-describedby`), not just visually adjacent, so it's announced to screen reader users. Required fields get a visible text indicator (e.g. "(required)"), not an asterisk alone. Disabled inputs use reduced-opacity `outline-variant` borders and `on-surface-variant` text (per WCAG 2.2 SC 1.4.11, inactive/disabled controls are explicitly exempt from the 3:1 non-text contrast requirement, though disabled state must remain programmatically exposed via `disabled` / `aria-disabled`). Placeholder text, where used as a supplementary hint (never as a substitute for the `<label>` above), must still pass AA contrast — see "No Low-Contrast Placeholder Text" in `anti-patterns.md`.

### Selection Controls (Checkbox, Radio, Switch)
Built on Base UI's `Checkbox`/`Checkbox Group`/`Radio`/`Switch` primitives (see `component-library.md`) — don't hand-roll checked/indeterminate state tracking that Base UI's `data-state` attributes already expose.

- **Checkbox:** `rounded.DEFAULT` (0.5rem) square control, `1px` `outline` border (a real interactive boundary, not the passive `outline-variant` used for cards/dividers) on a `surface` fill at rest. Checked state fills solid `primary` with a white (`on-primary`) check icon, border removed — the same "solid fill replaces border" logic as a Filled button. Indeterminate state uses the same solid `primary` fill with a dash icon instead of a check. Disabled follows the Input Fields convention: reduced-opacity `outline-variant` border and `on-surface-variant` icon/fill (exempt from 3:1 non-text contrast under WCAG 2.2 SC 1.4.11). Error state borders in `error`, matching Input Fields.
- **Radio:** identical color/state logic to Checkbox, but `rounded.full` (circular) — see Shapes for why this is a third named exception rather than a stylistic one. Checked state shows a `2px` `primary` ring (`borderWidth.emphasis`) with a solid `primary` center dot, rather than a full solid fill — this keeps Radio visually distinct from Checkbox's full-fill check even though both use the same brand color.
- **Switch:** a `rounded.full` track (`surface-variant` fill off / solid `primary` fill on) framed with a `1px` `outline` border (`border border-outline`, guaranteeing 3.55:1 non-text contrast under WCAG 2.2 SC 1.4.11 even when placed inside `surface-container`). When turned on, the border transitions cleanly to `border-primary` (`data-[checked]:border-primary`), matching the solid fill logic of Checkbox and preventing a muddy slate border around the Electric Blue track. Paired with a circular `surface`-colored (white) thumb. Never rely on track color alone to convey state — pair with an on/off text label or an accessible name via Base UI's own labeling.
- **Touch targets:** the visual control (checkbox/radio square or circle, switch thumb) may render smaller than 2.75rem, but the clickable/tappable hit area must still meet the 2.75rem × 2.75rem floor from Layout & Spacing — extend the hit area with padding, don't shrink the target to match the visual size.
- **Focus:** the standard high-visibility Primary focus ring (see Elevation & Depth) applies to all three controls, rendered as a real `outline`, not a `box-shadow`, so it survives `forced-colors` mode.

### Toggle & Toggle Group
Built on Base UI's `Toggle`/`Toggle Group` primitives (see `component-library.md`) — distinct from Switch (a persistent on/off setting) and from Checkbox (a form selection): Toggle is a single pressable button that holds a pressed/unpressed state (e.g. a bold/italic formatting toggle), and Toggle Group is a connected set of Toggles behaving like a segmented control (e.g. a view-mode switcher).

- **Unpressed:** styled like an Outlined button — `1px` `outline` border (`border-outline`), neutral `surface` fill, neutral `on-surface` icon/text.
- **Pressed (`data-pressed`):** To avoid visual ambiguity with primary action CTA `<Button>`s, standalone pressed Toggles use a soft `bg-primary-container` fill (`#dce6ff`) paired with neutral charcoal `text-on-primary-container` (`#1a1c1e`) and a `2px` `border-primary` border (`borderWidth.emphasis`). This mirrors the active selection affordance of Selectable Cards, cleanly distinguishing persistent boolean states ("Currently Toggled On") from one-shot execution triggers ("Submit / Start").
- **Toggle Group:** a single `rounded.DEFAULT` container with a `1px` `outline` border (`#737688`, `border-outline`, guaranteeing 3:1 non-text contrast under WCAG 2.2 SC 1.4.11) wrapping its Toggle items — the container itself is the visual boundary, individual Toggles inside it don't each draw their own border. Inside this segmented shell, the active segment uses a dedicated selection state: `bg-primary-container` fill paired with high-contrast `text-on-primary-container` (and `border-primary` in outline mode), while inactive segments stay transparent with neutral `on-surface-variant` (hover `on-surface`) text/icon. To prevent horizontal layout jitter and text reflow caused by Lexend's variable character advance widths, all segments maintain a uniform `font-semibold` (600 weight) in both active and inactive states. This eliminates visual collision with solid `primary` CTA buttons while adhering to the Zero-Shadow Baseline for flat controls.

### Sliders & Stepped Inputs (Slider, Number Field, OTP Field)
Built on Base UI's `Slider`/`Number Field`/`OTP Field` primitives (see `component-library.md`).

- **Slider:** a `surface-variant` track framed with a `1px` `outline` border (`border-outline`, guaranteeing 3:1 non-text contrast for interactive controls under WCAG 2.2 SC 1.4.11 even when placed on `surface-container`) with the filled portion in solid `primary`, and a circular `rounded.full` thumb in solid `primary` with a `2px` white (`on-primary`) ring for definition against the track. The thumb's *visual* size may be small, but its hit area must still meet the 2.75rem × 2.75rem touch-target floor (Layout & Spacing) — this is a common accessibility failure point for sliders specifically, so treat it as a hard requirement, not a nice-to-have.
- **Number Field:** styled as an integrated horizontal segment `[ - ] [ value ] [ + ]` inside a single `rounded.DEFAULT` container with a `1px` `outline` border. The decrement and increment steppers are positioned on the outer flanks as Text-emphasis icon buttons flanking the centered input value. To prevent vertical height explosion (e.g. stacking two 44px buttons into an 88px monstrosity), steppers must be laid out horizontally side-by-side: each stepper button independently meets the 2.75rem × 2.75rem (44×44px) touch target floor in width and height, while the central value field displays centered monospace text (`font-mono`).
- **OTP Field:** a row of individual single-character boxes, each styled like a compact Input Field (`rounded.DEFAULT`, `1px` `outline` border, `primary` focus ring with `outline-offset: 2px`).
  - *Touch Targets & 320px Mobile Reflow (WCAG 2.2 SC 1.4.10):* On desktop and tablet containers, boxes size to `3rem` (48px, `w-12 h-12`) with `0.5rem` (8px, `gap-2`) gaps. On small mobile containers (320px viewport with 16px margins yields 288px available width), a fixed 44px box with 8px gaps overflows by 16px ($6 \times 44 + 5 \times 8 = 304\text{px}$). To guarantee container-isolated reflow without horizontal scrolling, the root declares `@container` and boxes scale responsively: use `w-10 @sm:w-12 h-12 min-h-[48px]` (40px wide on compact containers, 48px on standard containers) with `gap-1.5 @sm:gap-2` (6px gaps on compact containers, 8px on standard containers). This constrains a 6-digit row to $6 \times 40\text{px} + 5 \times 6\text{px} = \mathbf{270\text{px}}$, comfortably fitting within 288px while maintaining a generous 48px vertical touch target. *(Target Size Compliance: The 40×48px mobile box is an intentional responsive exception to the system's 44px floor, fully compliant with WCAG 2.2 AA SC 2.5.8's 24×24px floor. Hit targets must not be expanded horizontally across the 6px gap to avoid adjacent mis-taps).* Use a larger type size (`headline-sm`) for the digit itself for legibility, and mirror Input Fields' `error` treatment (border + `aria-describedby` message) for an invalid code — never rely on a red border alone.

### Cards

Cards bundle related content into a distinct visual surface. Rather than restricting cards by arbitrary content topics, cards are structured along two orthogonal axes: **Prominence** (how much visual attention the container commands) and **Affordance** (how the container behaves interactively).

#### Prominence Tiers

- **Standard Card (`prominence="default"`, Medium Prominence — primary default):**
  A flat white background (`surface`, `#ffffff`), `1rem` corner radius (`rounded.lg`), padding of at least `1.5rem` (24px), borderless (`border-none`), with crisp ambient elevation (`shadows.ambient` / `shadow-ambient`). Used for modular content units: patient profiles, exercise drills, metric summaries, and clinical notes.
- **Accent Card (`prominence="accent"`, Medium Prominence):**
  Neutral white `surface` fill with a `2px` (`borderWidth.emphasis`) solid border in `secondary` (`#00796B`, Rich Emerald). Used to visually classify a specific track or category (e.g. clinical protocols, guidance materials) without competing with High-Prominence hero containers. `primary` is strictly reserved for active selection affordances, and `tertiary` is excluded because amber fails contrast on white.
- **Inverted Card (`prominence="inverted"`, High Prominence — canonical; `prominence="spotlight"` is supported as an alias):**
  Solid dark charcoal `on-surface` (`#1a1c1e`) fill paired with high-contrast text. Two contrast-verified accent configurations:
  1. `invertedAccent="tertiary"` (canonical default; `spotlightAccent="tertiary"` supported as legacy alias): Sunny Amber (`#F9A825`) headline/badge/icon (8.55:1 AAA) paired with pure white (`#ffffff`, `text-surface`) body copy (15.3:1 AAA). Body text is strictly maintained in pure white to prevent the chromatic glare and visual fatigue associated with reading continuous saturated yellow paragraphs.
  2. `invertedAccent="neutral"` (canonical; `spotlightAccent="neutral"` supported as legacy alias): Pure white headline and body text (15.3:1 AAA) for high-contrast announcements and neutral operational callouts.
  *Contrast Restrictions:* `primary` Electric Blue and `secondary` Rich Emerald text are strictly banned on Inverted Cards due to AA contrast failures.
- **Filled Card (`prominence="filled"`, High Prominence):**
  Solid saturated brand background (`primary`, `secondary`, or `tertiary`) with matching `on-primary`/`on-secondary`/`on-tertiary` high-contrast text. Reserved for milestone celebrations and solitary focal hero highlights. (For navigation choice sets or mode pickers, use Medium-Prominence Selectable Cards or a `ToggleGroup` instead).

#### Affordance Tiers

- **Static Container (`affordance="static"` — default):**
  No hover lift, no cursor pointer, no focus ring. Used strictly for grouping content and reading data.
- **Actionable Card (`affordance="actionable"` — canonical; `affordance="interactive"` is supported as an alias):**
  Clickable destination or action launcher. Features pointer cursor, hover elevation lift (`hover:shadow-ambient-hover`), active press feedback, and a standard offset keyboard focus ring (`outline-2 outline-primary outline-offset-2`).
- **Selectable Card (`affordance="selectable"`, choice sets):**
  Represents a selectable option within a choice set. Must follow strict ARIA semantics:
  - *The WAI-ARIA Container Law (`childrenPresentational: true`):* Per the WAI-ARIA specification, roles `button`, `radio`, and `checkbox` enforce `childrenPresentational: true`. Placing these roles directly on an outer `<Card>` container strips all internal heading (`<h3>`), list, and formatting semantics for assistive technology, flattening all card content into a single concatenated string. Therefore, **the outer `<Card>` must always remain a semantic container (`<div>` or `<li>`)** with visual state indicators (`data-selected={selected}`), **never the interactive role itself**.
  - *Internal Selection Trigger (Mandatory Universal Architecture):* Every Selectable Card must place its interactive selection control inside the card, utilizing the stretched-link overlay pattern (`after:absolute after:inset-0` on the internal trigger element):
    1. *Mutually-Exclusive Choice Sets (1-of-N):* Place an internal Base UI `<Radio>` control or semantic radio button within the card header, linked via `aria-labelledby` to the card heading ID and `aria-describedby` to the card body/metadata ID. The card group is wrapped in a container with `role="radiogroup"` (or Base UI `RadioGroup`).
    2. *Multi-Select Choice Sets (N-of-M):* Place an internal Base UI `<Checkbox>` control or semantic toggle button within the card header, linked via `aria-labelledby` to the card heading ID and `aria-describedby` to the card body ID.
    3. *Nested Secondary Controls:* If the card contains auxiliary interactive controls (e.g. an audio pronunciation preview button, external resource link), elevate them above the stretched-link trigger using `relative z-10`.
  - *Unselected:* Flat white surface with a flush 2px transparent border (`border-2 border-transparent`) to guarantee layout stability against hover/selection shifts, subtle hover border (`hover:border-outline-variant/50`), and hover elevation lift (`hover:shadow-ambient-hover`).
  - *Focus State & Selector Architecture:* In CSS, an `outline` applies strictly to an element's principal layout box, not its `::after` stretched-link pseudo-element. To ensure the blue focus ring draws cleanly outside the entire outer `<Card>` perimeter rather than tightly around the internal heading or radio dot:
    1. The internal stretched-link trigger element carries `data-card-trigger` and `focus-visible:outline-none after:absolute after:inset-0`.
    2. The outer `<Card>` carries `relative has-[[data-card-trigger]:focus-visible]:outline-2 has-[[data-card-trigger]:focus-visible]:outline-offset-2 has-[[data-card-trigger]:focus-visible]:outline-primary`.
    3. Scoping `:has()` specifically to `[data-card-trigger]` ensures that focusing the card's primary selection trigger renders the 2px floating focus ring outside the card boundary, while focusing any nested secondary controls (`relative z-10`, e.g. an audio pronunciation button or menu trigger) renders focus strictly on that secondary control, preventing focus ambiguity (WCAG 2.4.7).
  - *Selected State (Unfocused):* Displays a flush `2px` `primary` border (`border-2 border-primary`) and solid active background wash (`bg-primary-container`, `#dce6ff`) with no external offset ring. Opacity modifiers (e.g. `/45`) are prohibited to eliminate luminance collisions with `surface-container`.
  - *Selected + Focused State:* Displays both the flush `2px` `primary` border/wash AND the floating outer `2px` offset focus ring separated by a 2px gap.

*Instructional Content inside Cards:* To include clinician guidance, speech cues, or tips inside a card, use the unboxed `<ClinicianTip />` primitive rather than nested cards or alert banners.

### Clinician Tips & Pedagogical Guidance

Clinician tips, articulation cues, and instructional advice provide gentle, in-context pedagogical support during exercises, assessments, and patient workflows. They are **not** system alerts and must not be rendered as elevated cards.

- **Primary Pattern (Unboxed Typographic Lockup — Low Prominence):**
  Designed specifically for use inside existing cards, exercise drills, and form dialogs without creating "Card Soup":
  - **Structure:** Zero elevation, borderless, transparent background.
  - **Icon / Badge:** Leading `20px` (`size="md"`) icon in `secondary` (`#00796B`, e.g., `lightbulb` or `psychology`) or an inline micro-badge (`<Chip size="sm" variant="soft" color="secondary">Tip</Chip>`).
  - **Copy:** `text-base` (`1rem` / 16px, upholding the 1rem body text floor) in `text-on-surface-variant` (`#434656`), with an optional bold prefix in `text-on-surface` (`#1a1c1e`, e.g., `<span className="font-semibold text-on-surface">Clinician tip: </span>`).
  - **Accessibility:** Ensure the icon has `aria-hidden="true"` when paired with a visible prefix like "Clinician tip:".
- **Canvas / Multi-Field Grouping (Secondary Pattern):**
  When tips appear directly on the `#F6F7FB` page canvas or between separate form groups (outside of cards), they must sit within a `bg-surface-container` (`#EEF1F8`, `rounded-md px-3.5 py-2.5`) wash paired with a `1px` `outline-variant` border (`border border-outline-variant`, `#C8D0E0`) per the One-Rung-Skip Nesting Law so the grouping remains distinctly visible against the canvas.
- **Component Primitive:** Use `<ClinicianTip />` (`src/components/ui/clinician-tip.tsx`).

### Inline Alerts

Inline alerts communicate urgent, time-sensitive, or state-dependent feedback: system status, operational warnings, blocking issues, or confirmation notices. They are **not** general-purpose text containers for static educational tips or regular body copy.

They feature an asymmetric rectangular shape (`rounded-l-none rounded-r-default`, with `rounded-r` supported as an alias) on a neutral white `surface` background (`#ffffff`), **completely borderless on top, right, and bottom edges** (`border-t-0 border-r-0 border-b-0`), paired with a solid vertical `4px` (`borderWidth.accent`, `border-l-4`) accent bar in the state role color along the left edge:
- **Straight vertical left accent bar:** A pure vertical `4px` stripe along the left edge (`border-l-4 border-l-[role]`), rendered in the state/status role's solid accent color:
  - `error` (`#ba1a1a`): Destructive, blocked actions, or critical failures.
  - `warning` (`#8a5200`): Cautionary notices, unsaved changes, expiring sessions.
  - `success` (`#146c2e`): Confirmation of completed workflows or saved states.
  - `neutral` (`#1a1c1e`, `on-surface`): System and operational status notices (e.g. offline mode, sync status, background connectivity).
  *Role Restriction:* Brand and content roles (`primary` Electric Blue, `secondary` Rich Emerald, `tertiary` Sunny Amber) are **strictly excluded** from Inline Alerts. Operational alerts use state tokens (`error`, `warning`, `success`) or neutral charcoal (`on-surface`), preserving `primary` exclusively for interactive affordances and brand hierarchy. Because the container uses asymmetric rounding (`rounded-l-none rounded-r-default`), the accent bar remains a crisp, perfectly straight vertical edge without corner-miter distortion, while the right corners gently align with surrounding 0.5rem controls.
- **Surface & Text:** White `surface` background (`#ffffff`), `on-surface` (`#1a1c1e`) headline text, `on-surface-variant` (`#434656`) body text, and a matching role-colored leading icon for instant visual recognition.
- **Appropriate triggers:**
  - *Warning / Actionable:* "Microphone access blocked — tap to enable."
  - *Time-sensitive alert:* "Session expiring in 2 minutes."
  - *System status:* "Offline mode active — exercises will sync when reconnected."
  - *Stateful prompt:* "Unsaved clinical notes exist from earlier today."
- **Accessibility & Interactive Slots:** Implements dynamic ARIA live regions: `role="alert"` (`aria-live="assertive"`) for `error` to immediately announce critical failures, and `role="status"` (`aria-live="polite"`) for `warning`, `success`, and `neutral`. Supports an optional `onClose` dismiss trigger (accessible icon button with floating focus ring) and an optional inline `action` button slot.
- **Anti-pattern guard (Never an Asymmetric Card):** Inline alerts use asymmetric rounding (`rounded-l-none rounded-r-default`) specifically to keep the 4px left accent border completely straight. Never apply a 4px left accent border to a fully rounded container (`rounded.lg`/`rounded.md`), which distorts corner geometry. For static educational tips, strategy guides, or exercise instructions, use the unboxed `<ClinicianTip />` pattern or Low-Prominence typography instead.

### Chips & Tags
Use chips for filtering categories or status updates (e.g., "Completed"). Chips use a fully rounded `full` radius (`rounded.full`, 9999px), shared with Avatars as the system's two circular/pill exceptions (see Shapes). Avoid the monochromatic "triple-tint" anti-pattern (matching colored fill, border, and text of the same hue). Instead, select from these three approved patterns based on emphasis:
- **High-Contrast Mixed Palette (Pattern 1):** Saturated brand background (e.g., `primary`, `secondary`, or `tertiary` token) paired with its designated high-contrast text (`on-primary`/`on-secondary`/`on-tertiary`), no border. Use for higher-emphasis, active selections, or status-forward chips (aligns with Filled buttons).
- **Colored Outline + Neutral Fill + Colored Text (Pattern 2):** A `1px` border in the brand hue (`primary`/`secondary` only; `tertiary` Amber is excluded here due to light-background contrast limits), a genuinely neutral fill (`surface` white — never a tinted version of the hue), and text in that same brand hue. This is the recommended everyday default for multi-chip layouts (aligns with Outlined buttons): it stays vivid and legible without visual clutter.
- **Soft Container Wash (Pattern 3):** Soft role-specific background (`primary-container`, `secondary-container`, `tertiary-container`, `success-container`, `error-container`, `warning-container`, `neutral-container`) paired with high-contrast neutral charcoal text (`on-primary-container`, `on-secondary-container`, etc. — all `#1a1c1e`), no border. This delivers color-coded status warmth while dark charcoal ink guarantees 7:1+ contrast without chromatic pastel washes. Valid for low-to-medium emphasis tags.

#### Approved Chip Variant × Color Role Matrix

| Color Role | Pattern 1: High-Contrast Solid (High Emphasis) | Pattern 2: Colored Outline + Neutral Fill (Everyday Default) | Pattern 3: Soft Container Wash (Low/Medium Status) | Accessibility & Contrast Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`primary`** (Electric Blue, `#0052FF`) | `bg-primary text-on-primary` (Solid blue fill, white text) | `border-primary bg-surface text-primary` (1px blue border, white fill, blue text) | `bg-primary-container text-on-primary-container` (Soft blue fill `#dce6ff`, charcoal text `#1a1c1e`) | Solid/outline text achieves 5.59:1 AA on `#ffffff`. Soft wash achieves 12.8:1 AAA. |
| **`secondary`** (Rich Emerald, `#00796B`) | `bg-secondary text-on-secondary` (Solid emerald fill, white text) | `border-secondary bg-surface text-secondary` (1px emerald border, white fill, emerald text) | `bg-secondary-container text-on-secondary-container` (Soft emerald fill, charcoal text `#1a1c1e`) | Solid/outline text achieves 5.05:1 AA on `#ffffff`. Soft wash achieves 13.5:1 AAA. |
| **`tertiary`** (Sunny Amber, `#F9A825`) | `bg-tertiary text-on-tertiary` (Solid amber fill, **charcoal text** `#1a1c1e`) | **BANNED on white surfaces** (Amber text fails WCAG 1.4.3 AA at 1.99:1; use Pattern 1 or Pattern 3) | `bg-tertiary-container text-on-tertiary-container` (Soft amber fill, charcoal text `#1a1c1e`) | Pattern 1 requires dark text (`text-on-tertiary` = `#1a1c1e`, 8.55:1 AAA). White text on `#F9A825` fails at 2.45:1. |
| **`success`** (Forest Green, `#146c2e`) | `bg-success text-on-success` (Solid green fill, white text) | `border-success bg-surface text-success` (1px green border, white fill, green text) | `bg-success-container text-on-success-container` (Soft green fill, charcoal text `#1a1c1e`) | Solid/outline text achieves 6.57:1 AA on `#ffffff`. Soft wash achieves 12.5:1 AAA. |
| **`warning`** (Ochre Amber, `#8a5200`) | `bg-warning text-on-warning` (Solid ochre fill, white text) | `border-warning bg-surface text-warning` (1px ochre border, white fill, ochre text) | `bg-warning-container text-on-warning-container` (Soft ochre fill, charcoal text `#1a1c1e`) | Deep ochre `#8a5200` achieves 5.9:1 AA on `#ffffff`. Never substitute with `#F9A825`. Soft wash achieves 12.2:1 AAA. |
| **`error`** (Crimson Red, `#ba1a1a`) | `bg-error text-on-error` (Solid crimson fill, white text) | `border-error bg-surface text-error` (1px crimson border, white fill, crimson text) | `bg-error-container text-on-error-container` (Soft crimson fill, charcoal text `#1a1c1e`) | Solid/outline text achieves 6.8:1 AA on `#ffffff`. Soft wash achieves 11.9:1 AAA. |
| **`neutral`** (Charcoal / Slate) | `bg-neutral text-on-neutral` (Solid charcoal `#1a1c1e` fill, white text) | `border-outline bg-surface text-on-surface` (1px slate border `#737688`, white fill, charcoal text) | `bg-neutral-container text-on-neutral-container` (Soft slate fill `#D5DCEB`, charcoal text `#1a1c1e`) | Solid text achieves 15.3:1 AAA. Outline border meets 3:1 non-text contrast. Soft wash achieves 12.6:1 AAA. |

Tinted pastel backgrounds matching the border/text hue are never permitted for chips. Chips and badges must never use all-caps text or colored status dots for static states — see "No Static Status Dots" in `anti-patterns.md` for the full rule and the live/real-time exception.

### Lists
Lists should have clear dividers or generous vertical spacing between items. Every list item should have a minimum touch target height of 3.5rem (56px) to accommodate users with motor impairments.

### Accordion & Collapsible
Built on Base UI's `Accordion`/`Collapsible` primitives (see `component-library.md`). Apply the same Low vs. Medium Prominence decision as Lists (see Surface Hierarchy & Prominence Budget): a short accordion embedded in a longer page defaults to Low Prominence (canvas + `outline-variant` dividers between headers, no fill); a self-contained accordion section (e.g. an FAQ block) may use Medium Prominence `surface-container` grouping for the whole set. Each header row is a full-width button (minimum 2.75rem touch target height) with a trailing `expand_more` Material Symbol that rotates 180° on open — use the calibrated Accordion motion pairing (`250ms` open/close, `--duration-fast` with `--ease-standard`) for both the chevron rotation and the panel height reveal, with the mandatory `prefers-reduced-motion` fallback. Never rely on the chevron rotation alone to convey open/closed state — the panel's actual presence/absence in the layout is the primary signal.

### Navigation (Top Bar & Tabs)
Built on Base UI's `Menu`/`Tabs` primitives and semantic `<nav>` elements (see `component-library.md`). The primary desktop navigation bar uses the `surface` background with a single `1px` `outline-variant` bottom border — no shadow; this is page-frame chrome, not an elevated container (see the "Page-frame chrome" note in Surface Hierarchy & Prominence Budget). Active nav items are marked with `primary` text/icon plus a `2px` solid `primary` underline, never color alone. Tabs (for switching between related panels on the same page) use an underline indicator on the active tab rather than a filled pill, and must never rely on color contrast alone to indicate the active state.

### Dialogs, Drawers, Popovers & Preview Cards
**Dialog and Drawer (Tier A — modal, blocking):** a `surface` panel with modal elevation (`shadows.modal` / `shadow-modal`) and a backdrop scrim dimming the page behind them (see Elevation & Depth). Dialogs feature `1rem` corner radius (`rounded.lg`) and a `1px` `outline-variant` border (`borderWidth.default`, matching `dialog.tsx`). Over dark modal backdrop scrims, a 1px border provides crisp geometric definition without creating an exaggerated pastel halo around the white dialog surface, while guaranteeing high-contrast border visibility in Windows High Contrast mode (`forced-colors: active`). Drawers carry the same weight as Dialogs but anchor to a screen edge, docking flush against the viewport bezel: full-height side drawers and docked bottom sheets use `rounded-none` with a crisp single dividing border along their open edge (`border-l-[2px]` on right-side drawers, `border-r-[2px]` on left-side drawers, `border-t-[2px]` on bottom sheets) rather than curved corners, eliminating corner-miter tapering and crescent gaps at the screen boundaries.

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
  - **Numeric quantities & metrics:** Right-aligned (`text-right`) for both header `<th>` and cell `<td>`, strictly paired with tabular figures (`tabular-nums font-mono`). Matching right-alignment ensures decimal points and magnitudes align vertically, allowing clinicians to scan scores, percentages, and session durations effortlessly without saccadic eye fatigue.
  - **Booleans, status tags, & single actions:** Center-aligned (`text-center`).
- **Data Table Primitive (`<Table />`):** Columns marked with `numeric: true` automatically inherit `align="right"`, `tabular-nums`, and `font-mono`.

### Data Visualization & Charts
Reuse the existing semantic tokens before ever introducing a chart-only color — the six roles already defined cover almost every case:
- **Outcome/accuracy charts** (e.g. correct-vs-incorrect responses, pass-rate trends over time): use `success` (correct) and `error` (incorrect), matching their exercise-feedback meaning above — never a neutral or arbitrary hue for outcome data.
- **Neutral categorical/multi-series charts** (e.g. sessions by category, non-outcome comparisons): use `primary` → `secondary` → `tertiary`, in that fixed order (`#0052FF` Electric Blue → `#00796B` Rich Emerald → `#F9A825` Sunny Amber), for up to 3 simultaneous series. This keeps the state tokens (`error`/`warning`/`success`) reserved for actual outcomes, so a legend never accidentally implies something went wrong.
  - *Non-Text Contrast Compliance (WCAG 2.2 SC 1.4.11):* Sunny Amber (`#F9A825`) on white (`#ffffff`) or canvas (`#F6F7FB`) has a contrast ratio of only 1.99:1, which is below the mandatory 3:1 graphical object threshold. When Series 3 (`tertiary`) is rendered on light backgrounds, it must either:
    1. Include a `1px` high-contrast boundary stroke (`border border-outline` `#737688` or `border-on-surface` `#1a1c1e`) for filled bars, pie slices, and area shapes,
    2. Use a darkened amber token (`#8A5200`, 6.4:1 contrast, or `#9E5D00`, 3.6:1 contrast) for line chart strokes and point markers, or
    3. Be paired with a distinct graphic texture/pattern (e.g. diagonal hatching).
    In legend text, always render the series name in neutral charcoal (`text-on-surface`), using amber strictly for swatches with a 1px boundary stroke — never use unbordered `text-tertiary` on light backgrounds.
- **`warning`** is reserved for its own meaning (e.g. a threshold or caution annotation line) — not a generic 4th series color.
- **Cap at 3 simultaneous color-coded series.** Beyond that, restructure into small multiples or grouped/faceted charts, or add pattern/dash/marker-shape differentiation — don't keep inventing new ad-hoc hues to fit more series in.
- **Color is never the only cue.** Pair every series/segment with a direct label, legend, or pattern — charts are read by colorblind and low-vision users too, same rule as chips/nav/menus elsewhere in this document.
- Only introduce a dedicated chart-only token if a specific chart genuinely can't be served by the above — state that reasoning explicitly before adding one; the goal is maximizing the existing six roles' clarity before adding new tokens.

### Avatars
Built on Base UI's `Avatar` primitive (see `component-library.md`). Avatars are circular (`rounded-full`), minimum `2rem` (32px) in dense UI and `2.5rem` (40px) in general grids to match the Pictorial Mark sizing rules. Use `surface-variant` as the fallback background for initials-only avatars, with `on-surface-variant` text — never a random hash-generated color per user.
- **Interactive Avatar Touch Targets (WCAG 2.2 SC 2.5.8):** When an Avatar acts as an interactive trigger (e.g. account profile menu in the navigation bar or user selection toggle), the visual avatar (32px or 40px) must never be used as a naked interactive element. It must be wrapped in a hit-area expansion container meeting the mandatory `2.75rem × 2.75rem` (44×44px) interactive floor (e.g. `<AvatarButton />` or `min-h-[2.75rem] min-w-[2.75rem] inline-flex items-center justify-center p-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`).

### Progress & Loading States
Built on Base UI's `Progress` primitive (see `component-library.md`) for determinate bars/rings; skeleton pulses are plain elements, not a Base UI primitive. Use the `primary` color for determinate progress bars/rings on a `surface-variant` (`#E1E6F0`) track. For loading skeletons, use a subtle `surface-variant`-toned pulse — never a generic grey unrelated to the palette. Every component that can load asynchronously must define its loading and empty states, not just its populated state (see "Design for the Zero-State" in `anti-patterns.md`).

- **Functional Element Guidance & Non-Text Contrast (WCAG 2.2 SC 1.4.11 / SC 1.3.1):**
  - **Progress Bars:** Because passive ambient fills (`surface-variant` `#E1E6F0` and `surface-container` `#EEF1F8`) have low contrast against each other (~1.13:1), determinate progress indicators must **never rely on track fill alone** to communicate progress or state. Determinate progress bars and rings must always pair the visual indicator with:
    1. An accessible, high-contrast visible text readout (rendered in `text-on-surface` or `text-on-surface-variant`, e.g. "Step 3 of 10" or "45% completed"), and
    2. Explicit programmatic state exposure via `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
  - **Loading Skeletons:** Skeletons serve as temporary spatial placeholders, relying on dynamic motion (shimmer/pulse sweep) rather than static 3:1 boundary contrast. Active loading containers must announce state changes using `aria-busy="true"` or an adjacent polite live region (`aria-live="polite"`).
  - **Interactive Form Affordances:** Form fields (inputs, selects, textareas) and selection controls must strictly maintain a real 1px `outline` border (`#737688`, 3:1+ contrast against adjacent surfaces per SC 1.4.11) and must never rely on passive fills (`surface-variant`, `surface-container`) or `outline-variant` (`#C8D0E0`) to define their boundaries.

### AI Activity Indicators (Thinking Orbs)
Built on `thinking-orbs` via the `<ThinkingOrb />` design system wrapper (`src/components/ui/thinking-orb.tsx`). Used to communicate multi-step agentic latency (searching guidelines, synthesizing notes, formulating recommendations) rather than displaying a static, indeterminate spinner.
- **Color & Motion Are Never the Only Cue:** A standalone canvas orb communicates nothing to screen readers and violates WCAG 1.4.1. An orb must **always** be accompanied by a visible status label in `font-sans text-on-surface` or an accessible `.sr-only` fallback inside a `role="status"` and `aria-live="polite"` live region.
- **Standard Scale:** `sm` (20px) for inline text/badges, `md` (32px) for card headers, and `lg` (64px) for prominent hero-scale agent states.
- **Mandatory Reduced Motion:** Wrappers automatically query `(prefers-reduced-motion: reduce)` to set `paused={true}` or dampen animation speed.

### Paediatric AI Characters (Bot Avatars)
Built on `bot-avatars` via the `<BotAvatar />` design system wrapper (`src/components/ui/bot-avatar.tsx`). Designed to provide friendly, approachable interaction for children, adolescents, and supportive healthcare education workflows.
- **Affect & Clinical Tone Gating (`tone="calm"` vs `tone="friendly"`):** High-energy bouncing or smiling avatars during moments of acute patient distress, red-flag triage, or pain evaluation cause jarring tone mismatch. In any clinical assessment or triage pathway, `tone="calm"` is **mandatory**; this disables spontaneous flips/hops (`jumpEvery={0}`), restricts gaze turns, and reduces speed by 50%.
- **Non-Clinical Identity Safeguard:** Automated tools must never mislead patients into believing they are speaking directly with a human paediatrician. Avatars must carry descriptive `role="img"` and `aria-label` tags identifying them as a "Digital Helper", and offer an optional visual `showDisclaimerBadge`.
- **Sensory Sensitivity & Reduced Motion:** Continuous micro-movement can overstimulate neurodivergent patients (ADHD, sensory processing differences). The component automatically suppresses jumping and rapid rotation when `prefers-reduced-motion` is active.

### Toasts & Notifications
Tier C floating container (see Elevation & Depth) — deliberately distinct from Card rather than matching it: `surface` background, borderless on top/right/bottom (`border-t-0 border-r-0 border-b-0`), asymmetric rounding (`rounded-l-none rounded-r`), relying on a permanent ambient shadow (`shadow-ambient`) as its perimeter edge. Always paired with a leading functional icon and, for `error`/`success`/`warning`/`neutral` states, an `error`/`success`/`warning`/`neutral` (`on-surface` / `#1a1c1e`) colored icon plus a matching `4px` (`borderWidth.accent`, `border-l-4`) left accent bar (`border-l-error`, `border-l-success`, `border-l-warning`, `border-l-neutral`) — the exact asymmetric rectangle and accent-bar treatment as Inline Alerts — never a full-bleed colored background, which reduces text contrast. Note that neutral/info alerts use `border-l-neutral` rather than `border-l-primary` to preserve primary blue strictly for actionable interactive elements. Auto-dismiss non-critical toasts; keep error toasts until manually dismissed. **Dismiss action buttons must strictly maintain a minimum 44×44px touch target (`w-11 h-11 min-w-[44px] min-h-[44px]`) to comply with WCAG 2.2 SC 2.5.8.**

## Brand Architecture & Usage Guidelines

This section defines the official usage criteria for the Eolas brand assets to maintain design consistency and legibility across all layouts.

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
    *   *Usage*: On Light backgrounds (`#FFFFFF` and canvas `background` `#F6F7FB`). Never render the primary color logo on dark primary or charcoal panels, as the contrast ratio fails WCAG AA standards.
*   **White / Reverse Assets**
    *   *Usage*: On Dark backgrounds (Electric Blue primary color `#0052FF` or Charcoal dark panels `on-surface` `#1a1c1e`).
*   **Solid Black Assets**
    *   *Usage*: Print media, utility legal/footer docs, high-contrast monochrome layouts, or secondary light-tint surfaces.
*   **Tertiary Amber Assets**
    *   *Usage*: Limited to interactive highlights, themed clinic dashboards, or as a warm contrasting accent on dark charcoal backgrounds.

## Anti-Patterns (Banned)

The full banned-pattern catalogue — chips/tags, layout/structure, iconography/copy, overlays/navigation, and component-library rules — lives in [.agents/rules/anti-patterns.md](.agents/rules/anti-patterns.md), which is the single source of truth and is enforced automatically on every UI file edit. Check every finished component against it before considering the task done; do not re-derive or duplicate its list here.