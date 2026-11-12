# AGENTS.md

> Mirrors `.agents/rules/00-core-contract.md` (single source of truth) for tools following the [agents.md](https://agents.md) standard.

## Core Contract

1. **Component library:** Base UI (`@base-ui/react`), not Radix. Full detail: `.agents/rules/component-library.md`.
2. **Architectural Layers & Direct Tag Ban:**
   - **Primitives (`src/components/ui/`):** Pure Base UI wrappers, tokens, and controlled AI primitives (`PromptInput`, `ChatMessage`, `MessageScroller`, `ModelSelector`, `Trace`, `Tool`). Zero network/DB/auth logic; never import from `blocks` or `features`.
   - **Composite Blocks (`src/components/blocks/`):** Controlled UI compositions built from `ui/` and tokens (props/callbacks only; zero network/auth coupling). Never import from `features/` or `views/`.
   - **Feature Views (`src/features/` or `src/views/`):** Owns state, queries, auth, and routing.
   - **Direct Tag Ban:** Raw `<button>`, `<input>`, `<select>`, `<textarea>`, and `<dialog>` outside `components/ui/` are banned (ESLint `no-restricted-syntax`). Use `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, `<Dialog>`, or `<UnstyledButton>` / `<Button variant="unstyled">`.
3. **API preservation:** Never erode component APIs, strip `ref` / `render` props, drop compound subcomponents, or downgrade primitives to `<div>`/`<button>`.
4. **Always-on guardrails (see `.agents/rules/anti-patterns.md`):**
   - No triple-tint chips; use `*-container` + ultra-dark `on-*-container` on pills, `#1a1c1e` on callouts/cards.
   - Focus (`outline-offset: 2px`) vs. selection (flush `2px` border + surface wash).
   - No `space-y-*`/`space-x-*` (use `flex gap-*` / `grid gap-*`); no `mr-*`/`ml-*` on `<Icon>`; use `size-*` and `truncate`.
   - Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>`; use `<InputGroup>` instead of absolute input buttons.
   - Always include accessible overlay titles (`DialogTitle`/`DrawerTitle`/`SheetTitle`); no manual `z-index`.
   - Never downgrade triggers (`render={<span />}`), never use `transition-all` or ad-hoc shimmer keyframes (`<ShimmerText>`/`<Skeleton>`), no registry bloat, and plain-English UI copy only (1–2 nouns; no dev/DB/CSS jargon).
5. **Design system & routing:** See `DESIGN.md`, `.agents/rules/design-system.md`, and `.agents/rules/00-core-contract.md`.

## Framework Architecture: Vite + React SPA
Client-side **Vite + React 18** SPA with Tailwind CSS v4 and Base UI. Never generate Next.js server components, App Router files (`page.tsx`, `layout.tsx`, `route.ts`), or `next/*` imports.
