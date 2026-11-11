---
trigger: always_on
description: Non-negotiable core contract for this workspace — component library choice, the primitive-check-first workflow, architectural layers, and a routing index to detailed rules, skills, and MCP tools. This is intentionally short so it is actually followed every turn.
---

# Core Contract — Read This First, Every Turn

This file is deliberately short. Longer, fuller rules exist below and are loaded automatically when relevant (they trigger on file type via `glob`) — this file's only job is to make sure the handful of rules that get broken most often are never missed, and to tell you where to look for everything else.

## 1. Component library: Base UI

- The default headless/unstyled primitive foundation for this project is **Base UI** (`npm i @base-ui/react`). If you see existing Radix imports in old code, do not copy that pattern into new code — flag it for migration instead. If you see existing primitives that are not Base UI or Radix, prioritize them highest for migration to Base UI.
- Base UI is a single tree-shakable package (`@base-ui/react`). Import only the parts you use.
- Full conventions: [component-library.md](./component-library.md).

## 2. Never hand-roll a component that already exists as a primitive

This is the single most common failure mode in this workspace: writing a bespoke `<div>`-based dropdown/modal/tooltip/tabs implementation instead of reusing or extending the project's existing primitive.

### The 3 Architectural Layers & Import Contract

1. **Primitives (`src/components/ui/`)**: Pure unopinionated Base UI wrappers and design system tokens (`Button`, `Dialog`, `Input`, `Select`, `Card`). Zero business logic. Must **never** import from `blocks` or `features`.
2. **Composite Blocks (`src/components/blocks/`)**: Reusable, presentational or controlled UI compositions built strictly from primitives (`components/ui/`) and design system tokens. Blocks are pure UI assemblies: they receive data via props, render responsive container layouts, and pass actions via callbacks (`onAction`, `onChange`, `onConfirm`). They have zero coupling to data fetching, databases, authentication sessions, or network transport. Can import from `components/ui/`, but can **never** import from `features/` or `views/`.
3. **Feature Views (`src/features/` or `src/views/`)**: Domain-specific screens and workflows. They manage state, queries, auth, and network calls, and compose blocks and primitives to build full application views. Decoupled from the shared component registry.

### Direct Interactive Element Ban
- Direct `<button>`, `<input>`, `<select>`, `<textarea>`, and native `<dialog>` tags outside `components/ui/` are strictly prohibited (enforced via ESLint AST selectors `no-restricted-syntax`). Always use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, and `<Dialog>` from `@/components/ui/`.
- **Unstyled Interactive Triggers & Escape Hatches:** When a composite block or view needs an unstyled semantic button (such as a card heading stretched-link trigger, a table column sort header, or a custom clickable row) that must not inherit the 48px CTA button chrome, use `<UnstyledButton>` or `<Button variant="unstyled">` from `@/components/ui/button`. It provides a clean, zero-chrome semantic button with an accessible `:focus-visible` ring while strictly complying with the Direct Tag Ban.
- **Layout `<div>`s vs. Hand-rolled Controls:** Standard layout `<div className="flex ...">` or `<div className="grid ...">` containers are healthy and encouraged. The ban applies strictly to interactive controls, buttons, dialogs, and form inputs.

### Pre-Creation Workflow
Before writing any new interactive UI element, follow this sequence:
1. Search the project's primitive directory (`src/components/ui/`) or blocks directory (`src/components/blocks/`) for an existing solution.
2. If one exists, use it or extend it with props/variants. Do not create a parallel implementation.
3. Only if nothing suitable exists, build it as a wrapped Base UI primitive (in `src/components/ui/`) or a controlled composite block (in `src/components/blocks/`).
4. If you skipped this check and already wrote a one-off component, stop and migrate it immediately.

## 3. API Preservation & Non-Destructive Refactoring

Visual styling, bug fixes, or design system alignment must NEVER erode component API surface or upstream Base UI parity.
- **Never downgrade primitives:** When restyling or fixing layout, never replace a Base UI primitive (or compound subcomponent) with a plain `<div>`, `<button>`, or naive state toggle. Headless accessibility and state machines take precedence over convenience.
- **Preserve full API surface:** Never strip `ref`, Base UI polymorphic `render` props, slot forwarding, compound subcomponents (e.g. `Select.ItemText`, `Dialog.Backdrop`), or existing prop interfaces during CSS/polish edits.
- **Surgical diffs only:** Style changes must touch classes and layout wrappers only. Do not rewrite component anatomy or delete props to solve a CSS or alignment problem.

## 4. The anti-pattern gate

Before you consider any UI task finished, re-read [anti-patterns.md](./anti-patterns.md) and check your output against it. The violations that happen most often are:
- **Emerald Cancel Buttons** — `secondary` is Rich Emerald (`#00796B`). Secondary actions ('Cancel', 'Back', 'Reset') use `variant="outline" colorRole="neutral"`, never `secondary`.
- **Triple-tint monochrome chips/badges/eyebrows/cards** (light tint fill + matching border + matching-hue text, all one color family). Banned — see the required patterns in anti-patterns.md.
- **Focus vs. Selection Ambiguity** — focus rings must float with `outline-offset: 2px` on containers, while active selection uses a flush 2px border + surface wash.
- **Raw interactive tags outside primitives** (`<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`). Banned.
- **Child-Margin Spacing Hacks (`space-y-*` / `space-x-*`)** — banned across the workspace. Use `flex flex-col gap-*` or `grid gap-*`.
- **Manual Margin Classes on `<Icon>` (`mr-*`, `ml-*`)** — banned inside buttons, menu items, and badges. Buttons already define `gap-2`; extra margins create asymmetrical optical alignment bugs.
- **Raw Unlabelled Form Inputs & Containers** — inputs must be wrapped in `<Field>` with an explicit `<FieldLabel>`. Multi-input stacks/rows mandate `<FieldGroup>`.
- **Manual Absolute Buttons in Inputs** — banned. Always use `<InputGroup>` + `<InputGroupAddon>`.
- **Titleless Overlays** — all dialogs, drawers, and sheets mandate accessible title subcomponents (`DialogTitle`, `DrawerTitle`, `SheetTitle` or `<...Title className="sr-only">`).
- **Inflated / Dev-Speak UI Copy** — write UI labels, toasts, and demos in plain, everyday English (max 2 nouns per label; never expose dev/database/CSS terms like `committed`, `synchronized`, `unconstrained`, `affordance`, `telemetry`, `workflow`, or `protocol`).
- **Ad-hoc Shimmer Keyframes** — writing bespoke `@keyframes` or gradient sweeps at call sites is banned. Always use `<ShimmerText>` for text/reasoning and `<Skeleton>` / `<SkeletonReveal>` for containers.
- **Verbose Sizing & Truncation** — mandate `size-*` over `w-* h-*` for square elements and `truncate` over multi-class ellipsis strings.
- **Trigger Downgrades** — never replace trigger primitives with non-interactive elements (`render={<span />}`); behavior must wrap real buttons ("Behavior Wraps the Line").
- **Registry Bloat** — placing domain-specific application views into the shared component registry. Banned.

## 5. Routing index — where to look for what

| Task | Go here |
|---|---|
| Any UI/component/styling work | [design-system.md](./design-system.md) (structural + color + typography + copy + a11y rules) |
| New or edited component files | [component-library.md](./component-library.md) |
| Checking for banned visual/copy patterns | [anti-patterns.md](./anti-patterns.md) |
| Project color/type/spacing tokens | project-root `DESIGN.md` — always defer to this over training-data defaults |
| Converting a Stitch design into React code | `react-components` skill |
| Writing/polishing a new `DESIGN.md` for Stitch | `taste-design` skill |
| Turning a vague idea into a Stitch prompt | `enhance-prompt` skill |
| Adding a UI transition/animation | `DESIGN.md` Motion & Animation section for duration/easing values, then `transitions-dev` skill (new motion) or `transitions-polish` skill (tuning existing motion) |
| Accessibility/contrast/focus/keyboard auditing on a live page | global `a11y-debugging` skill + Chrome DevTools MCP |
| General browser debugging, network/perf inspection | global `chrome-devtools` skill |
| Writing plain-English UI copy, docs, or reports | global `govuk-style` skill |
| Writing patient-facing letters/leaflets | global `patient-communication` skill |
| Content for readers with learning disabilities / cognitive impairments | global `easy-read` skill |
| GDPR compliance, consent tracking, PII handling, user deletion/export | `gdpr-data-handling` skill |
| Firebase (Firestore, Auth, Hosting, Data Connect, security rules) | global `firebase-*` skills + `firebase-mcp-server` MCP. Use its `firestore_*` tools for Firestore CRUD/indexes — don't also reach for the standalone `google-cloud-firestore` MCP in the same task, it's a redundant duplicate that risks inconsistent project context. |
| Finding/confirming a GCP project id before Firebase/Firestore setup | `google-cloud-resource-manager`'s `search_projects` |
| Looking up official Google/Firebase/Android/Cloud developer docs | `google-developer-knowledge` MCP (`search_documents`/`answer_query`/`get_documents`). This is the **same corpus** as `firebase-mcp-server`'s `developerknowledge_*` tools (not Firebase-only despite the name) — don't call both for one query. `answer_query` is quota-limited: on a 429, retry with `search_documents` on the same server rather than switching servers or repeating `answer_query`. |
| Complex multi-step planning before acting | `sequential-thinking` MCP |
| Anything about how Antigravity itself works (skills/rules/hooks/MCP/CLI) | global `antigravity-guide` skill |

If a task spans more than one row, read all the relevant rows — don't guess.

## 6. When rules conflict

Precedence: an explicit instruction in the current user prompt > project `DESIGN.md` > this rules folder > general training-data conventions. If the user's prompt names a specific library, token, or pattern, that wins — but still flag it if it collides with something in `anti-patterns.md`, and ask before proceeding.