---
name: Modern Clinical High-Contrast
colors:
  background: '#F6F7FB'
  on-background: '#1a1c1e'
  surface: '#ffffff'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434656'
  surface-container: '#EEF3FF'
  surface-variant: '#DCE6FA'
  outline: '#737688'
  outline-variant: '#C4D5F8'
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
  neutral-container: '#DCE6FA'
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
    fontWeight: '700'
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
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  full: 9999px
shadows:
  ambient: 0 4px 12px rgba(26, 28, 30, 0.08)
  ambient-hover: 0 6px 16px rgba(26, 28, 30, 0.12)
  modal: 0 12px 32px rgba(26, 28, 30, 0.18)
motion:
  durations:
    stagger: 40ms
    quick: 150ms
    fast: 250ms
    medium: 350ms
    slow: 400ms
    emphasis: 500ms
    very-slow: 500ms
  easing:
    standard: cubic-bezier(0.22, 1, 0.36, 1)
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
     * *Role:* A warm, high-salience accent. Used for high-contrast spotlight cards (`variant="spotlight"`), focal badge highlights, and progress landmarks.
     * *Contrast Constraint:* **Never use Sunny Amber `#F9A825` for text (e.g. `text-tertiary`) or borders/outlines on white or light backgrounds.** It fails WCAG AA contrast (1.99:1).
     * *Approved Amber Patterns:*
       1. **Soft fill:** `tertiary-container` (`#fff0c2`) wash with neutral charcoal text (`on-tertiary-container`, `#1a1c1e`).
       2. **Solid badge:** Solid `tertiary` fill with neutral charcoal text (`#1a1c1e`), or an icon inside a solid-amber badge.
       3. **Dark card (Spotlight):** On dark `on-surface` (`#1a1c1e`) Inverted Cards, amber foreground text passes AAA contrast (8.55:1).
3. **Charcoal Text on Soft Washes:** All `*-container` tokens (`primary-container`, `secondary-container`, `tertiary-container`, `error-container`, `warning-container`, `success-container`) must use neutral charcoal (`#1a1c1e`) text ink. Never use chromatic or pastel font colors on container washes.

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
    *   *Tokens:* `on-surface` (`#1a1c1e`) solid accent bar / icon | `surface` (`#ffffff`) background.
    *   *Usage:* Non-critical operational conditions and background system status (e.g. offline mode active, sync pending, read-only session). Used in `InlineAlert` (`role="neutral"`) to present informative system feedback without the urgency of a warning or the severity of an error.

### 3. Surface Hierarchy

Surfaces establish visual depth and guide attention. Instead of treating every container as a card, choose the surface prominence based on the element's priority and role in the interface:

1.  **Low Prominence (Canvas & Dividers — default layout):**
    *   *Tokens:* `background` (`#F6F7FB`), `outline-variant` (`#C4D5F8`) dividers.
    *   *Role:* Page canvas, full-width sections, and dense data displays (tables, lists). Relies on whitespace, typography, and subtle hairline dividers rather than container boxes. This should form the vast majority of any view.
2.  **Medium Prominence (Grouping & Content Containers):**
    *   *Grouped Fill:* `surface-container` (`#EEF3FF`), borderless, flat. Used to visually cluster related form fields or secondary controls without creating an elevated object.
    *   *Standard Cards:* White `surface` (`#ffffff`) with ambient elevation (`shadow-ambient`). Used to bundle a discrete, coherent entity (e.g. an exercise, a patient summary, a metric group).
    *   *Accent Cards:* White `surface` with a `2px` solid border in `secondary` (`#00796B`, Rich Emerald). Used to denote a specific thematic category or workflow track (e.g. clinical guide, reference protocol).
3.  **High Prominence (Spotlight & Hero Containers):**
    *   *Inverted Card (`prominence="inverted"`):* Solid dark charcoal `on-surface` (`#1a1c1e`) fill paired with high-contrast text (`spotlightAccent="tertiary"` Sunny Amber or pure white). Used for primary callouts, hero milestones, or focal active drills.
    *   *Filled Card (`prominence="filled"`):* Saturated brand fill (`primary`, `secondary`, or `tertiary`) with high-contrast text. Used for solitary celebratory achievements or focal hero highlights. (For navigation choice sets or mode pickers, use Medium-Prominence Selectable Cards or a `ToggleGroup` instead).
    *   *Focal Discipline:* High-Prominence containers command maximum visual weight. They should be used intentionally for focal anchors rather than scattered across a grid. When multiple items compete for attention, downgrading secondary items to Medium-Prominence Standard Cards or Low-Prominence canvas groupings preserves visual hierarchy and prevents cognitive fatigue.

*   **Borders & Dividers:** Use `outline-variant` (`#C4D5F8`) for subtle `1px` structural dividers and passive component borders (Menus, Popovers), and `outline` (`#737688`) for default interactive form-control boundaries. Standard content cards remain borderless.
*   **Rule of thumb:** If content can be structured using typography, whitespace, and list dividers (Low Prominence), do that first. Elevate to a Standard Card (Medium Prominence) only when the content forms a distinct, self-contained unit. Reserve Inverted and Filled Cards (High Prominence) for the primary focal point of the screen.
*   **Card nesting:** Never nest a Card inside another Card. A Card may sit within a `surface-container` section if separated by generous padding, but nesting identical elevation levels causes visual noise.
*   **Pedagogical & Clinician Tips (Instructional Guidance):** When presenting clinician guidance, articulation cues, or exercise tips within a Card or form, avoid nesting additional cards or alert banners. Instead, use a **Low-Prominence unboxed typographic lockup** (`<ClinicianTip />`): an inline icon (`lightbulb` or `info` in `secondary`, `#00796B`) or an inline micro-badge paired directly with `text-base text-on-surface-variant` and an optional bold lead-in (`<span className="font-semibold text-on-surface">Clinician tip:</span>`). It adds zero container weight inside an already-contained card. For multi-field form canvas groupings outside cards, an unbordered flat `surface-container` (`#EEF3FF`, `rounded-md p-3`) wash may be used.
*   **Overlays are a separate axis, not a prominence tier:** Dialog, Popover, Menu, and Drawer chrome renders using a surface treatment with dedicated scrims, elevation, and focus-traps governed by Base UI portal setups (`component-library.md`).
*   **Page-frame chrome (Navigation):** The top navigation bar's `surface` background sits outside this containment ranking, distinguished from canvas only by a single `1px` `outline-variant` bottom border.
*   **Tooltips:** Tooltips intentionally invert this pattern (a solid high-contrast dark fill, no border — see Tooltips in Components) as a transient hint layer distinct from in-page surfaces.
*   **`surface-variant` (`#DCE6FA`) — component-internal neutral fill:** Paired with `on-surface-variant` (`#434656`) text. Use this token for neutral fills inside a single component (avatar fallbacks, progress tracks, loading skeletons, and selected menu rows). In contrast, `surface-container` is reserved for grouping multiple items together.
*   **Border pairing rule for `surface-variant`:** Never pair a `surface-variant` fill with an `outline-variant` border on the same element (contrast is too low, ~1.08:1). If a component requires both a neutral fill and a visible border, use `outline` (`#737688`) for the border.

### 4. Tonal & Callout Backdrops

To make layouts feel colorful, premium, and lively while maintaining perfect contrast:
*   Avoid placing saturated brand colors under small body text unless pairing with appropriate high-contrast text: white text (`on-primary` / `on-secondary` / `on-error` / `on-warning` / `on-success`) or charcoal text (`on-tertiary`, `#1a1c1e` — never white text on Sunny Amber).
*   For urgent alerts, warnings, and system feedback, use the unrounded **Inline Alert** archetype (flat white `surface`, `rounded-none`, borderless on top/right/bottom with a straight vertical 4px left accent bar). Do not use this archetype for routine instructional prose, clinician guidance, or static advice—use Low-Prominence typographic lockups (`<ClinicianTip />`) instead.
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
  * **Body and prose text** starts at a strict minimum of `1rem` (16px, `body-md`) to ensure effortless reading for users with low vision and cognitive load considerations. Never set primary instructions or body paragraphs below `1rem`.
  * **Secondary metadata, timestamps, and form helper text** may use the regular-weight `caption` token (`0.875rem` / 14px, `font-sans`, 400 weight, `leading-normal`). This token is strictly limited to secondary annotations and helper text, preventing visual competition with 600-weight field labels. It must NEVER be used for primary instructions, clinical guidance, or body paragraphs (which must remain at or above the mandatory 1rem floor).
  * **Compact UI metadata, badges, and timestamps** may scale down to `label-md` (`0.8125rem` / 13px) and `label-sm` (`0.75rem` / 12px), provided they use heavy weights (600/700 semibold/bold) and are strictly limited to non-body metadata.
- **Weight:** Bold weights are used intentionally for headlines to create a strong visual anchor on the page.
- **Accessibility:** Avoid using light font weights (below 400) for any critical information.
- **Casing Restrictions:** All-caps text styling (`text-transform: uppercase`) is strictly prohibited. This applies to eyebrow labels, category tags, utility badges, table headers, and button labels. Visual hierarchy must be achieved through relative size, font weight (semibold/bold), and letter spacing adjustments instead. Sentence case is the default for body copy; Title Case is permitted for headings, buttons, and nav labels. Standard acronyms (WCAG, UI, SLT, ADHD, FAB) stay fully capitalized — the uppercase ban is about styling whole labels/phrases, not established acronyms.
- **Emphasis (no decorative italics):** Bold weight is the only sanctioned emphasis mechanism. Italic styling degrades legibility for dyslexic and low-vision readers and is prohibited for emphasis in UI copy and long-form content alike — this includes rendered markdown (`*em*`/`<em>`), not just component styling.
- **Alignment (never justify):** Body and prose text is always ragged-right (left-aligned, natural line breaks). Justified text creates uneven word-spacing "rivers" that are a known dyslexia readability failure — never apply `text-align: justify` to paragraph or long-form content, even where the anchor-left rule in Layout & Spacing is already followed for block-level alignment.
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
  * Standard Size Scale Matrix:
    - **`sm` (16px / `text-sm`):** Compact chips, dense metadata badges, inline close triggers.
    - **`md` (20px / `text-base`):** Form field leading icons, standard button icons, menu row icons.
    - **`lg` (24px / `text-xl`):** Inline alert headers, toast indicators, section titles.
    - **`xl` (32px / `text-2xl`):** Hero cards, milestone achievements, victory dialog headers.
  * Accessibility: Use `aria-hidden="true"` on decorative icons. For standalone/interactive icons, provide descriptive text inside a `.sr-only` element or an `aria-label`. Use the `<Icon />` component primitive (`src/components/ui/icon.tsx`). Never mix icon libraries.

## Layout & Spacing

The design system utilizes a **Fluid Grid** with a strict 0.5rem (8px) baseline rhythm to ensure consistency across all components.

- **Desktop (80rem / 1280px max):** 12-column grid with 1.5rem (24px) gutters (`gutter`) and 4rem (64px) side margins (`margin-desktop`). 
- **Tablet (48rem - 79.9375rem / 768px - 1279px):** 8-column grid with 1.5rem (24px) gutters (`gutter`) and 2rem (32px) side margins (`margin-tablet`).
- **Mobile (0rem - 47.9375rem / 0px - 767px):** 4-column grid with 1rem (16px) gutters (`gutter-mobile`) and 1rem (16px) side margins (`margin-mobile`).

Content is organized into clear vertical stacks. Vertical spacing between logical sections should be generous (typically 4rem/64px or 5rem/80px) to prevent cognitive overload and maintain an uncluttered, calm feeling.

- **Anchor left:** Don't center everything — F-pattern scanning means left-alignment is the anchor for body content, forms, and lists. Reserve centering for short, celebratory, or standalone confirmation messages (e.g. an empty state, a completion screen).
- **Touch targets:** Minimum 2.75rem × 2.75rem (44×44px) for any interactive element, as a general floor (WCAG 2.2 SC 2.5.8). Individual components in this file set stricter minimums where warranted (standalone action Buttons: 3rem/48px; Lists: 3.5rem/56px row height; compact controls like Steppers/Accordion triggers: 2.75rem/44px). Where the visual control is inherently smaller than 44px (e.g. 20px Checkboxes/Radios, or 32px/40px Avatars acting as buttons), the clickable/tappable hit area must still be expanded to at least the 2.75rem floor via padding or wrapper containers. *(Exception: On small mobile screens $\le 320\text{px}$, OTP digit boxes scale down to 40px width with 48px height to satisfy 320px reflow without horizontal scrolling under WCAG 1.4.10, comfortably surpassing the official WCAG 2.2 AA SC 2.5.8 24×24px target floor).*

## Elevation & Depth

To maintain high contrast and visual clarity while avoiding heavy visual clutter, this design system uses **Borderless Cards**, **Ambient Elevation**, and **High-Visibility Focus Indicators**.

- **Borderless Cards:** Standard content cards are **borderless by default** (`border-none`), using flat white `surface` (`#ffffff`) on a light `background` canvas (`#F6F7FB`) paired with crisp ambient elevation (`shadows.ambient` / `shadow-ambient`). This provides natural 3D layer separation without heavy outline ink.
- **Structural Controls (Forms):** Form fields (inputs, selects, textareas) retain crisp 1px `outline` borders (`#737688`) to guarantee WCAG 2.2 SC 1.4.11 3:1 non-text contrast for interactive affordances (`outline-variant` `#C4D5F8` is reserved for passive structural dividers and disabled states).
- **Interaction Elevation & Selection (Cards):** On hover/interaction, cards lift with enhanced ambient elevation (`hover:shadow-ambient-hover`). For **Selectable Cards**, active selection transitions from borderless to a 2px `primary` border (`borderWidth.emphasis`) paired with a subtle background wash (`bg-primary-container/15`) and an active indicator.
- **Floating Containers:** Dialog, Drawer, Popover, Menu/Select/Dropdown, and Toast are elevated above page content with dedicated permanent shadows and consistent tier-based geometry:
  - **Tier A — Modal, blocking (Dialog, Drawer):** Dialog uses `rounded.lg` (1rem / 16px) with a `2px` border (`borderWidth.emphasis`). Full-height Drawers anchor flush against viewport edges using `rounded-none` and a single dividing border (`border-l` / `border-r`), preventing corner-miter distortion and bezel notches. Both share modal elevation (`shadows.modal` / `shadow-modal`) and backdrop scrims.
  - **Tier B — Anchored, non-modal (Popover, Menu/Select/Dropdown, Combobox):** `rounded.DEFAULT` (0.5rem / 8px), `1px` border (`borderWidth.default`) + ambient shadow. (Unifies Popovers and Menus under a single 8px overlay radius).
  - **Tier C — Ambient notification (Toast):** `rounded-none` (0px, flat rectangular), borderless on top/right/bottom with a `4px` vertical left accent bar (`border-l-4`, `borderWidth.accent`) for state roles + ambient shadow.
- **Streamlined Focus States vs. Active Selection:** High-visibility focus rings are mandatory in Primary Electric Blue (`#0052FF`). To prevent visual collision between keyboard focus and active selection (WCAG 2.2 SC 2.4.7 & SC 3.2.2), focus indicators are explicitly differentiated by component type:
  - **Single-line form controls (Input, Select, Textarea):** To prevent "concentric double-box" artifacts on bordered resting controls, the resting border transitions to `border-primary` with a flush inset focus ring (`outline-offset: 0`).
  - **Buttons, interactive containers, Cards, and Selection Controls (Checkbox, Radio, Switch):** Focus rings must maintain an explicit external offset (`outline-offset: 2px`).
    - *Selection Controls (Checkbox, Radio, Switch):* A floating 2px ring halos cleanly outside the 1px resting border, avoiding optical collisions and keeping internal checkmarks or radio dots uncramped. On circular Radio controls, using an expanded `3px` offset (`outline-offset: 3px` / `focus-visible:outline-offset-[3px]`) provides comfortable breathing room between the 20px circular boundary and the Electric Blue focus halo, eliminating optical crowding against the 2px checked border. Parent hit-target wrappers (the 44×44px tap containers) must never use `overflow-hidden`, ensuring the external focus halo is never clipped.
    - *Cards (including Selectable Cards):* Tabbing onto an unselected card renders a 2px primary outline separated from the card boundary by a 2px gap, keeping it unmistakably distinct from a selected card's flush 2px border. When a selected card receives focus, both the flush border/tint and the outer offset focus ring are simultaneously visible.
  - All focus indicators use real `outline`/`border` properties for Windows High Contrast / `forced-colors` mode compatibility.

## Motion & Animation

Motion is quick, purposeful, and understated — never bouncy or decorative. It exists to clarify a state change (something opened, failed, or loaded), not to entertain. This section anchors the *values*; full implementation snippets live in the `transitions-dev` skill (new motion) and `transitions-polish` skill (tuning existing motion) — reference the same scale rather than hand-rolling new numbers.

- **Per-component open/close durations** (matching `transitions-dev`'s `_root.css` scale exactly, so both stay in sync):
  - **Dialog:** open `250ms` ("fast"), close `150ms` ("quick") — the scale-in/out "modal" pairing.
  - **Popover, Menu/Select/Dropdown:** open `250ms` ("fast"), close `150ms` ("quick") — the same "dropdown" pairing as Dialog; visual weight (border/shadow/scrim, see Elevation & Depth) is what separates Tier A from Tier B here, not speed.
  - **Drawer:** open `400ms` ("slow"), close `350ms` ("medium") — the slower "panel reveal" pairing, since a Drawer physically slides in from an edge rather than scaling in place.
  - **Toast:** open `400ms` ("slow"), close `350ms` ("medium") — the same pairing as Drawer; a toast rising from below is a comparable physical motion, per `transitions-dev`'s own toast reference (`22-toast.md`).
  - **Emphasis-only moments** (success check, milestone badge appear): `500ms` ("emphasis" / "very slow", `--duration-emphasis`) — never use this for routine open/close chrome.
  - **Close is never slower than open.** Every pairing above closes at the same speed as or faster than it opens, so dismissing something always feels at least as light as summoning it.
- **Stagger Cap Rule:** Multi-item stagger animations must use `--duration-stagger: 40ms` and cap at **5 items maximum** ($\text{max cumulative delay} = 5 \times 40\text{ms} = 200\text{ms}$). Items beyond index 5 animate concurrently with item 5 to ensure list renders never produce perceived UI lag.
- **Easing:** a single smooth-out cubic-bezier (`cubic-bezier(0.22, 1, 0.36, 1)`) for anything that opens, closes, or changes position — Dialog, Drawer, Popover, Menu, Toast, page transitions. Reserve bounce/spring easing only for celebratory, non-structural moments (a success check, a milestone badge) — never on overlay/container chrome, which would read as playful rather than calm and focused.
- **`prefers-reduced-motion` is mandatory, not optional**, for every component in this file. Every transition/animation must ship a `@media (prefers-reduced-motion: reduce)` fallback that strips translation/scale/blur movement and keeps only an instant or opacity-only state change — never drop the state change itself, only the motion.
- **Wiring into Base UI:** prefer Base UI's `[data-starting-style]`/`[data-ending-style]` attributes (CSS transitions — these cancel smoothly mid-way if a user closes something before it finishes opening) over `[data-open]`/`[data-closed]` keyframe animations, per Base UI's own animation guidance — see `component-library.md`.

## Shapes

The shape language uses two primary corner radii — compact controls stay square-ish (`rounded.DEFAULT`) while larger containers get a more generous curve (`rounded.lg`) — plus two deliberate, named exceptions. This choice balances structured precision with an approachable feel, ensuring interactive elements look reliable and clean.

Radius and border-width are defined once as scales in the frontmatter (`rounded`/`borderWidth`) — components reference the scale name below rather than each restating its own raw value, so a future change only happens in one place.

- **`rounded.DEFAULT` (0.5rem):** Buttons, Input Fields, Menus/Selects/Dropdowns, Popovers, and Combobox panels (standardizing all Tier B floating anchored chrome to 0.5rem).
- **`rounded.md` (0.75rem):** Intermediate utility containers, segmented controls, or compact cards where 1rem is too large.
- **`rounded.lg` (1rem):** Standard Cards and Dialogs. (Full-height Drawers docking against viewport bezels use `rounded-none` to prevent corner-miter distortion and backdrop crescent gaps).
- **`rounded-none` (0px, flat rectangular):** Toasts & Inline Alerts — sharing the clean, unrounded silhouette and vertical 4px accent bar.
- **`rounded.full` (9999px, fully rounded):** Chips & Tags, Avatars, and Radio controls — three circular exceptions to the rectangular radii above, two stylistic (Chips, Avatars) and one functional (Radio, where circular-vs-square is the actual affordance distinguishing "choose one" from "choose any" — see Selection Controls). Grouping the container-scale pair together is what keeps that silhouette distinct: every *rectangular* container in the system (Buttons, Cards, Dialogs, Menus) stays on `DEFAULT`/`lg`, while Toasts and Inline Alerts use `rounded-none`.
- **`borderWidth.default` (1px):** Menu/Select/Dropdown and Popover structural borders, the Colored Outline chip pattern (Chips & Tags), and resting form-control borders (Input Fields, Checkbox/Radio, Toggle, Toggle Group container). Standard content cards are borderless.
- **`borderWidth.emphasis` (2px):** Dialog/Drawer borders, the Active Selection state and Accent Card variant (Components > Cards), Outlined buttons, and Radio's checked-state ring (Selection Controls).
- **`borderWidth.accent` (4px):** Inline Alert vertical left accent bar, and the matching vertical left accent bar on state-flavored Toasts (error/warning/success) — the only two components that use this accent-bar treatment; every other component sticks to `default`/`emphasis` border widths or no border at all.
- **This list highlights the primary uses of each width, not an exhaustive registry** — as new components are added, default to `borderWidth.default` for any resting structural/form-control border and `borderWidth.emphasis` for any 2px selected/active/outlined treatment, rather than inventing a new width value.

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

All tiers: minimum height 3rem (48px) for an accessible hit target, `0.5rem` corner radius. Component foundation: build on **Base UI** (`@base-ui/react`) primitives, styled with these tokens — do not hand-roll button focus/disabled/pressed states that Base UI already provides.

### Input Fields
Built on Base UI's `Field`/`Input`/`Fieldset` primitives (see `component-library.md`) — don't hand-roll label/error/description wiring that Base UI's `Field` already provides.

Inputs must feature a high-contrast label above the field, always an explicit `<label>` association — never placeholder text standing in as the only label. `0.5rem` corner radius (`rounded.DEFAULT`), matching Buttons as the other primary form control. The border should darken to the Primary color when focused, using the same high-visibility focus ring as every other interactive element (see Elevation & Depth).

Error states must use a combination of a border in the `error` token color and a leading icon to ensure accessibility for color-blind users — and the error message text must be programmatically associated with the input (e.g. `aria-describedby`), not just visually adjacent, so it's announced to screen reader users. Required fields get a visible text indicator (e.g. "(required)"), not an asterisk alone. Disabled inputs use reduced-opacity `outline-variant` borders and `on-surface-variant` text (per WCAG 2.2 SC 1.4.11, inactive/disabled controls are explicitly exempt from the 3:1 non-text contrast requirement, though disabled state must remain programmatically exposed via `disabled` / `aria-disabled`). Placeholder text, where used as a supplementary hint (never as a substitute for the `<label>` above), must still pass AA contrast — see "No Low-Contrast Placeholder Text" in `anti-patterns.md`.

### Selection Controls (Checkbox, Radio, Switch)
Built on Base UI's `Checkbox`/`Checkbox Group`/`Radio`/`Switch` primitives (see `component-library.md`) — don't hand-roll checked/indeterminate state tracking that Base UI's `data-state` attributes already expose.

- **Checkbox:** `rounded.DEFAULT` (0.5rem) square control, `1px` `outline` border (a real interactive boundary, not the passive `outline-variant` used for cards/dividers) on a `surface` fill at rest. Checked state fills solid `primary` with a white (`on-primary`) check icon, border removed — the same "solid fill replaces border" logic as a Filled button. Indeterminate state uses the same solid `primary` fill with a dash icon instead of a check. Disabled follows the Input Fields convention: reduced-opacity `outline-variant` border and `on-surface-variant` icon/fill (exempt from 3:1 non-text contrast under WCAG 2.2 SC 1.4.11). Error state borders in `error`, matching Input Fields.
- **Radio:** identical color/state logic to Checkbox, but `rounded.full` (circular) — see Shapes for why this is a third named exception rather than a stylistic one. Checked state shows a `2px` `primary` ring (`borderWidth.emphasis`) with a solid `primary` center dot, rather than a full solid fill — this keeps Radio visually distinct from Checkbox's full-fill check even though both use the same brand color.
- **Switch:** a `rounded.full` track (`surface-variant` fill off / solid `primary` fill on) with a circular `surface`-colored (white) thumb — the same track-fill logic as Progress & Loading States' `surface-variant` track. Never rely on track color alone to convey state — pair with an on/off text label or an accessible name via Base UI's own labeling.
- **Touch targets:** the visual control (checkbox/radio square or circle, switch thumb) may render smaller than 2.75rem, but the clickable/tappable hit area must still meet the 2.75rem × 2.75rem floor from Layout & Spacing — extend the hit area with padding, don't shrink the target to match the visual size.
- **Focus:** the standard high-visibility Primary focus ring (see Elevation & Depth) applies to all three controls, rendered as a real `outline`, not a `box-shadow`, so it survives `forced-colors` mode.

### Toggle & Toggle Group
Built on Base UI's `Toggle`/`Toggle Group` primitives (see `component-library.md`) — distinct from Switch (a persistent on/off setting) and from Checkbox (a form selection): Toggle is a single pressable button that holds a pressed/unpressed state (e.g. a bold/italic formatting toggle), and Toggle Group is a connected set of Toggles behaving like a segmented control (e.g. a view-mode switcher).

- **Unpressed:** styled like an Outlined button — `1px` `outline` border, neutral `surface` fill, neutral `on-surface` icon/text.
- **Pressed (`data-pressed`):** solid `primary` fill with `on-primary` icon/text, borderless — the same Filled-button visual logic, so "pressed" always reads as unmistakably active.
- **Toggle Group:** a single `rounded.DEFAULT` container with a `1px` `outline-variant` border wrapping its Toggle items — the container itself is the visual boundary, individual Toggles inside it don't each draw their own border. The active segment uses the same solid `primary` fill as a standalone pressed Toggle; inactive segments stay transparent with neutral text/icon.

### Sliders & Stepped Inputs (Slider, Number Field, OTP Field)
Built on Base UI's `Slider`/`Number Field`/`OTP Field` primitives (see `component-library.md`).

- **Slider:** a `surface-variant` track (matching Progress & Loading States) with the filled portion in solid `primary`, and a circular `rounded.full` thumb in solid `primary` with a `2px` white (`on-primary`) ring for definition against the track. The thumb's *visual* size may be small, but its hit area must still meet the 2.75rem × 2.75rem touch-target floor (Layout & Spacing) — this is a common accessibility failure point for sliders specifically, so treat it as a hard requirement, not a nice-to-have.
- **Number Field:** styled as an integrated horizontal segment `[ - ] [ value ] [ + ]` inside a single `rounded.DEFAULT` container with a `1px` `outline` border. The decrement and increment steppers are positioned on the outer flanks as Text-emphasis icon buttons flanking the centered input value. To prevent vertical height explosion (e.g. stacking two 44px buttons into an 88px monstrosity), steppers must be laid out horizontally side-by-side: each stepper button independently meets the 2.75rem × 2.75rem (44×44px) touch target floor in width and height, while the central value field displays centered monospace text (`font-mono`).
- **OTP Field:** a row of individual single-character boxes, each styled like a compact Input Field (`rounded.DEFAULT`, `1px` `outline` border, `primary` focus ring with `outline-offset: 2px`).
  - *Touch Targets & 320px Mobile Reflow (WCAG 2.2 SC 1.4.10):* On desktop and tablet, boxes size to `3rem` (48px, `w-12 h-12`) with `0.5rem` (8px, `gap-2`) gaps. On small mobile screens (320px viewport with 16px margins yields 288px available width), a fixed 44px box with 8px gaps overflows by 16px ($6 \times 44 + 5 \times 8 = 304\text{px}$). To guarantee reflow without horizontal scrolling, boxes scale responsively: use `w-10 sm:w-12 h-12 min-h-[48px]` (40px wide on mobile, 48px on tablet/desktop) with `gap-1.5 sm:gap-2` (6px gaps on mobile, 8px on tablet/desktop). This constrains a 6-digit row to $6 \times 40\text{px} + 5 \times 6\text{px} = \mathbf{270\text{px}}$, comfortably fitting within 288px while maintaining a generous 48px vertical touch target. *(Target Size Compliance: The 40×48px mobile box is an intentional responsive exception to the system's 44px floor, fully compliant with WCAG 2.2 AA SC 2.5.8's 24×24px floor. Hit targets must not be expanded horizontally across the 6px gap to avoid adjacent mis-taps).* Use a larger type size (`headline-sm`) for the digit itself for legibility, and mirror Input Fields' `error` treatment (border + `aria-describedby` message) for an invalid code — never rely on a red border alone.

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
  Represents an option within a mutually-exclusive or multi-select set. Full keyboard accessibility (`role="button"`, `tabIndex={0}`, `aria-pressed={selected}`).
  - *Unselected:* Flat white surface with a flush 2px transparent border (`border-2 border-transparent`) to guarantee layout stability against hover/selection shifts, subtle hover border (`hover:border-outline-variant/50`), and hover elevation lift.
  - *Focus State (Unselected):* Tabbing onto an unselected card renders a `2px` solid `primary` outline with an external `outline-offset: 2px` floating outside the card boundary.
  - *Selected State (Unfocused):* Displays a flush `2px` `primary` border (`border-2 border-primary`) and subtle background wash (`bg-primary-container/15`) with no external offset ring.
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
  When tips appear directly on the page canvas or between separate form groups (outside of cards), they may optionally sit within an unbordered, flat `bg-surface-container` (`#EEF3FF`, `rounded-md px-3.5 py-2.5`) wash to maintain visual coherence without introducing elevation or borders.
- **Component Primitive:** Use `<ClinicianTip />` (`src/components/ui/clinician-tip.tsx`).

### Inline Alerts

Inline alerts communicate urgent, time-sensitive, or state-dependent feedback: system status, operational warnings, blocking issues, or confirmation notices. They are **not** general-purpose text containers for static educational tips or regular body copy.

They feature a flat, unrounded rectangular shape (`rounded-none`, 0px radius) on a neutral white `surface` background (`#ffffff`), **completely borderless on top, right, and bottom edges** (`border-t-0 border-r-0 border-b-0`), paired with a solid vertical `4px` (`borderWidth.accent`, `border-l-4`) accent bar in the state role color along the left edge:
- **Straight vertical left accent bar:** A pure vertical `4px` stripe along the left edge (`border-l-4 border-l-[role]`), rendered in the state/status role's solid accent color:
  - `error` (`#ba1a1a`): Destructive, blocked actions, or critical failures.
  - `warning` (`#8a5200`): Cautionary notices, unsaved changes, expiring sessions.
  - `success` (`#146c2e`): Confirmation of completed workflows or saved states.
  - `neutral` (`#1a1c1e`, `on-surface`): System and operational status notices (e.g. offline mode, sync status, background connectivity).
  *Role Restriction:* Brand and content roles (`primary` Electric Blue, `secondary` Rich Emerald, `tertiary` Sunny Amber) are **strictly excluded** from Inline Alerts. Operational alerts use state tokens (`error`, `warning`, `success`) or neutral charcoal (`on-surface`), preserving `primary` exclusively for interactive affordances and brand hierarchy. Because the container has `rounded-none`, the accent bar remains a crisp, perfectly straight vertical edge without corner-miter distortion.
- **Surface & Text:** White `surface` background (`#ffffff`), `on-surface` (`#1a1c1e`) headline text, `on-surface-variant` (`#434656`) body text, and a matching role-colored leading icon for instant visual recognition.
- **Appropriate triggers:**
  - *Warning / Actionable:* "Microphone access blocked — tap to enable."
  - *Time-sensitive alert:* "Session expiring in 2 minutes."
  - *System status:* "Offline mode active — exercises will sync when reconnected."
  - *Stateful prompt:* "Unsaved clinical notes exist from earlier today."
- **Accessibility & Interactive Slots:** Implements dynamic ARIA live regions: `role="alert"` (`aria-live="assertive"`) for `error` to immediately announce critical failures, and `role="status"` (`aria-live="polite"`) for `warning`, `success`, and `neutral`. Supports an optional `onClose` dismiss trigger (accessible icon button with floating focus ring) and an optional inline `action` button slot.
- **Anti-pattern guard (Never an Asymmetric Card):** Inline alerts are strictly unrounded rectangles (`rounded-none`). Never apply a 4px left accent border to a rounded container (`rounded.lg`/`rounded.md`), which distorts corner geometry. For static educational tips, strategy guides, or exercise instructions, use the unboxed `<ClinicianTip />` pattern or Low-Prominence typography instead.

### Chips & Tags
Use chips for filtering categories or status updates (e.g., "Completed"). Chips use a fully rounded `full` radius (`rounded.full`, 9999px), shared with Avatars as the system's two circular/pill exceptions (see Shapes). Avoid the monochromatic "triple-tint" anti-pattern (matching colored fill, border, and text of the same hue). Instead, select from these three approved patterns based on emphasis:
- **High-Contrast Mixed Palette (Pattern 1):** Saturated brand background (e.g., `primary`, `secondary`, or `tertiary` token) paired with its designated high-contrast text (`on-primary`/`on-secondary`/`on-tertiary`), no border. Use for higher-emphasis, active selections, or status-forward chips (aligns with Filled buttons).
- **Colored Outline + Neutral Fill + Colored Text (Pattern 2):** A `1px` border in the brand hue (`primary`/`secondary` only; `tertiary` Amber is excluded here due to light-background contrast limits), a genuinely neutral fill (`surface` white — never a tinted version of the hue), and text in that same brand hue. This is the recommended everyday default for multi-chip layouts (aligns with Outlined buttons): it stays vivid and legible without visual clutter.
- **Soft Container Wash (Pattern 3):** Soft role-specific background (`primary-container`, `secondary-container`, `tertiary-container`, `success-container`, `error-container`, `warning-container`) paired with high-contrast neutral charcoal text (`on-primary-container`, `on-secondary-container`, etc. — all `#1a1c1e`), no border. This delivers color-coded status warmth while dark charcoal ink guarantees 7:1+ contrast without chromatic pastel washes. Valid for low-to-medium emphasis tags.
Tinted pastel backgrounds matching the border/text hue are never permitted for chips. Chips and badges must never use all-caps text or colored status dots for static states — see "No Static Status Dots" in `anti-patterns.md` for the full rule and the live/real-time exception.

### Lists
Lists should have clear dividers or generous vertical spacing between items. Every list item should have a minimum touch target height of 3.5rem (56px) to accommodate users with motor impairments.

### Accordion & Collapsible
Built on Base UI's `Accordion`/`Collapsible` primitives (see `component-library.md`). Apply the same Low vs. Medium Prominence decision as Lists (see Surface Hierarchy & Prominence Budget): a short accordion embedded in a longer page defaults to Low Prominence (canvas + `outline-variant` dividers between headers, no fill); a self-contained accordion section (e.g. an FAQ block) may use Medium Prominence `surface-container` grouping for the whole set. Each header row is a full-width button (minimum 2.75rem touch target height) with a trailing `expand_more` Material Symbol that rotates 180° on open — use the Popover/Menu "dropdown" motion pairing (`250ms` open / `150ms` close, smooth-out easing) for both the chevron rotation and the panel reveal, with the mandatory `prefers-reduced-motion` fallback. Never rely on the chevron rotation alone to convey open/closed state — the panel's actual presence/absence in the layout is the primary signal.

### Navigation (Top Bar & Tabs)
Built on Base UI's `Menu`/`Tabs` primitives and semantic `<nav>` elements (see `component-library.md`). The primary desktop navigation bar uses the `surface` background with a single `1px` `outline-variant` bottom border — no shadow; this is page-frame chrome, not an elevated container (see the "Page-frame chrome" note in Surface Hierarchy & Prominence Budget). Active nav items are marked with `primary` text/icon plus a `2px` solid `primary` underline, never color alone. Tabs (for switching between related panels on the same page) use an underline indicator on the active tab rather than a filled pill, and must never rely on color contrast alone to indicate the active state.

### Dialogs, Drawers, Popovers & Preview Cards
**Dialog and Drawer (Tier A — modal, blocking):** a `surface` panel with modal elevation (`shadows.modal` / `shadow-modal`) and a backdrop scrim dimming the page behind them (see Elevation & Depth). Dialogs feature `1rem` corner radius (`rounded.lg`) and a `2px` `outline-variant` border (`borderWidth.emphasis`). Drawers carry the same weight as Dialogs but anchor to a screen edge, docking flush against the viewport bezel: full-height side drawers and docked bottom sheets use `rounded-none` with a crisp single dividing border along their open edge (`border-l-[2px]` on right-side drawers, `border-r-[2px]` on left-side drawers, `border-t-[2px]` on bottom sheets) rather than curved corners, eliminating corner-miter tapering and crescent gaps at the screen boundaries.

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
Built on Base UI's `Progress` primitive (see `component-library.md`) for determinate bars/rings; skeleton pulses are plain elements, not a Base UI primitive. Use the `primary` color for determinate progress bars/rings on a `surface-variant` track. For loading skeletons, use a subtle `surface-variant`-toned pulse — never a generic grey unrelated to the palette. Every component that can load asynchronously must define its loading and empty states, not just its populated state (see "Design for the Zero-State" in `anti-patterns.md`).

### Toasts & Notifications
Tier C floating container (see Elevation & Depth) — deliberately distinct from Card rather than matching it: `surface` background, borderless on top/right/bottom (`border-t-0 border-r-0 border-b-0`), flat rectangular shape (`rounded-none`), relying on a permanent ambient shadow as its perimeter edge. Always paired with a leading functional icon and, for error/success/warning states, an `error`/`success`/`warning` colored icon plus a matching `4px` (`borderWidth.accent`, `border-l-4`) left accent bar — the exact flat rectangle and accent-bar treatment as Inline Alerts — never a full-bleed colored background, which reduces text contrast. Auto-dismiss non-critical toasts; keep error toasts until manually dismissed.

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