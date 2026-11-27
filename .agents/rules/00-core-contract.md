---
trigger: always_on
description: Core workspace contract — Base UI architecture, 3-layer separation, direct tag ban, always-on guardrails, and routing index.
---

# Core Contract — Read This First, Every Turn

## 1. Foundation
Client-side **Vite + React 19** SPA with Tailwind CSS v4 and **Base UI** (`@base-ui/react`, never `@radix-ui/*` or `next/*`). Full guide: [component-library.md](./component-library.md).

## 2. The 3 Architectural Layers & Pre-Creation Workflow
1. **Primitives (`src/components/ui/`):** Pure Base UI wrappers, tokens, and controlled AI primitives; never import `blocks/` or `features/`.
2. **Composite Blocks (`src/components/blocks/`):** Controlled UI compositions (props/callbacks only; zero network/DB/auth coupling); never import `features/` or `views/`.
3. **Feature Views (`src/features/` or `src/views/`):** Owns state, queries, auth, and routing.
- **Pre-Creation Workflow:** Inventory `ui/` and `blocks/` first → reuse or extend with props → only build new if nothing fits.

## 3. API Preservation
Never erode component APIs, strip `ref` / `render` props, drop compound subcomponents, or downgrade primitives (`render={<span />}`). Make surgical diffs only.

## 4. Quick Steer (Enforced by Oxlint + Hooks; Full List: [anti-patterns.md](./anti-patterns.md))
- **Controls, Overlays & Imports:** Use Eolas primitives (`<Button>`, `<UnstyledButton>`, `<Input>`, `<Select>`, `<Textarea>`, `<Dialog>`, `<Icon>`) instead of raw HTML controls, unlabelled icon buttons, `fixed inset-0` overlays, or direct `@base-ui/react*`/`@radix-ui/*` imports outside `ui/`.
- **Layout & Shorthands:** `className` is layout-only — no restyling, `[&_...]` reach-in selectors, `!` overrides, `size-*` over `w-X h-X`, `flex/grid gap-*` over `space-x/y-*`, `h-dvh` over `h-screen`, `truncate`, and no `<Icon>` `mr-*`/`ml-*`.
- **Surfaces, Contrast & Motion:** Use Filled / Outline / Soft Wash (no triple-tint), `inverted:*` instead of `dark:*`, `#1C1A18` on callouts/cards, light-surface-safe colors (no `*-tertiary` accents), `outline-offset: 2px` focus vs flush `2px` selection, explicit `transition-[...]` (no `transition-all`, no spring outside `SuccessCheck`), `<ShimmerText>`/`<Skeleton>`, and never nest `<Card>`.
- **Forms, Titles & Copy:** Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>` (`<InputGroup>` for addons), render `<DialogTitle>`/`<DrawerTitle>` without manual `z-index`, guard `Enter` with `isComposing`, use plain everyday English (1–2 nouns; no dev/DB/CSS jargon), and keep domain views out of `blocks/`.

## 5. Routing Index

| Task | Go here |
|---|---|
| UI/component/styling & WCAG 2.2 AA rules | [design-system.md](./design-system.md) |
| Component architecture, Base UI, navigation taxonomy | [component-library.md](./component-library.md) |
| Banned visual/code/copy patterns | [anti-patterns.md](./anti-patterns.md) |
| Color/type/spacing/motion tokens & component specs | project-root `DESIGN.md` |
| Adding/installing registry items via shadcn CLI | `shadcn` CLI (`npx shadcn@latest add @eolas/...`) — **never** use generic shadcn/Lucide styling patterns; always follow `DESIGN.md` + `design-system.md` |
| Responsive layout, RTL/i18n spacing, or worst-case UI stress testing | `better-layout` / `break-ui` skills |
| Mobile/tablet touch feel or drag/swipe gesture primitives | `mobile-native` / `gestures` skills (always obey `DESIGN.md` motion restraint & WCAG 2.5.1 fallbacks) |
| Motion implementation / tuning | `DESIGN.md` Motion section + `src/globals.css` & `src/components/ui/` motion primitives |
| Live a11y/browser debugging | `a11y-debugging` / `chrome-devtools` skills + Chrome DevTools MCP |
| Plain-English / patient / Easy Read / GDPR copy | `govuk-style` / `patient-communication` / `easy-read` / `gdpr-data-handling` skills |
| Firebase / Firestore / GCP project lookup | `firebase-*` skills + `firebase-mcp-server` (not `google-cloud-firestore`); `google-cloud-resource-manager` `search_projects` |
| Google/Firebase/Cloud docs | `google-developer-knowledge` MCP (`search_documents` fallback on 429) |
| Complex planning | `sequential-thinking` MCP |

> Note: Workspace skills and MCP servers listed above apply in the Eolas UI authoring repo (or any workspace where those tools are installed). In consuming projects without them, rely on `DESIGN.md`, `.agents/rules/`, and your local `src/components/ui/` and `src/components/blocks/` directories.

Precedence: explicit user prompt > `DESIGN.md` > `.agents/rules/` > general conventions.
