---
trigger: always_on
description: Core workspace contract — Base UI architecture, 3-layer separation, direct tag ban, always-on guardrails, and routing index.
---

# Core Contract — Read This First, Every Turn

## 1. Component Library: Base UI (`@base-ui/react`)
- Default headless foundation is **Base UI** (`@base-ui/react`), not Radix. Never import `@radix-ui/*` in new code; migrate legacy Radix/custom primitives when touched.
- Full conventions: [component-library.md](./component-library.md).

## 2. The 3 Architectural Layers & Direct Tag Ban
1. **Primitives (`src/components/ui/`):** Pure Base UI wrappers, design tokens, and controlled AI primitives (`PromptInput`, `ChatMessage`, `MessageScroller`, `ModelSelector`, `Trace`, `Tool`). Zero network/DB/auth logic; never import from `blocks` or `features`.
2. **Composite Blocks (`src/components/blocks/`):** Pure controlled UI assemblies built from `ui/` and tokens (props in, callbacks out; zero network/auth coupling). Never import from `features/` or `views/`.
3. **Feature Views (`src/features/` or `src/views/`):** Owns state, queries, auth, and routing; composes `blocks/` and `ui/`.
- **Direct Tag Ban:** Raw `<button>`, `<input>`, `<select>`, `<textarea>`, and `<dialog>` outside `src/components/ui/` are banned (ESLint `no-restricted-syntax`). Always use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, `<Dialog>`, or `<UnstyledButton>` / `<Button variant="unstyled">` from `@/components/ui/`.
- **Pre-Creation Workflow:** Inventory `src/components/ui/` and `src/components/blocks/` first → reuse or extend with props → only build new in `ui/` or `blocks/` if nothing fits.

## 3. API Preservation
Never erode component APIs, strip `ref` / Base UI `render` props, drop compound subcomponents, or downgrade primitives to `<div>`/`<button>` during styling or bug fixes. Make surgical diffs only.

## 4. Always-On Guardrails (Full List: [anti-patterns.md](./anti-patterns.md))
- **No triple-tint chips/badges:** Use Filled, Colored Outline + neutral `surface`, or Soft Wash (`*-container` + ultra-dark `on-*-container` on pills; `#1a1c1e` on callouts/cards).
- **Focus vs. selection:** Floating `outline-offset: 2px` for focus; flush `2px` border + surface wash for selection.
- **No child-margin hacks:** Never use `space-y-*` / `space-x-*`; use `flex gap-*` or `grid gap-*`.
- **No manual `<Icon>` margins:** Never add `mr-*`/`ml-*` inside buttons/menus/badges (`gap-2` handles spacing).
- **Shorthands:** Enforce `size-*` over `w-* h-*` and `truncate` over multi-class ellipsis.
- **Forms:** Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>`; use `<InputGroup>` + `<InputGroupAddon>` instead of absolute-positioned buttons.
- **Overlays:** Always render an accessible title (`<DialogTitle>`, `<DrawerTitle>`, `<SheetTitle>`, or `sr-only`); never add manual `z-index`.
- **Triggers:** Never downgrade triggers with `render={<span />}` ("Behavior Wraps the Line").
- **Motion:** Never use `transition-all` or ad-hoc `@keyframes` sweeps (use `<ShimmerText>` / `<Skeleton>`).
- **Copy:** Plain everyday English, 1–2 nouns max per label; never expose dev/DB/CSS jargon (`committed`, `synchronized`, `affordance`, `telemetry`, `workflow`, `protocol`).
- **No registry bloat:** Never place domain-specific views or auth/SSE flows in `src/components/blocks/`.

## 5. Routing Index

| Task | Go here |
|---|---|
| UI/component/styling & WCAG 2.2 AA rules | [design-system.md](./design-system.md) |
| Component architecture, Base UI, navigation taxonomy | [component-library.md](./component-library.md) |
| Banned visual/code/copy patterns | [anti-patterns.md](./anti-patterns.md) |
| Color/type/spacing/motion tokens & component specs | project-root `DESIGN.md` |
| Converting Stitch designs / writing `DESIGN.md` / prompts | `react-components` / `taste-design` / `enhance-prompt` skills |
| Motion implementation / tuning | `DESIGN.md` Motion section + `transitions-dev` / `transitions-polish` skills |
| Live a11y/browser debugging | `a11y-debugging` / `chrome-devtools` skills + Chrome DevTools MCP |
| Plain-English / patient / Easy Read / GDPR copy | `govuk-style` / `patient-communication` / `easy-read` / `gdpr-data-handling` skills |
| Firebase / Firestore / GCP project lookup | `firebase-*` skills + `firebase-mcp-server` (not `google-cloud-firestore`); `google-cloud-resource-manager` `search_projects` |
| Google/Firebase/Cloud docs | `google-developer-knowledge` MCP (`search_documents` fallback on 429) |
| Complex planning | `sequential-thinking` MCP |

Precedence: explicit user prompt > `DESIGN.md` > `.agents/rules/` > general conventions.
