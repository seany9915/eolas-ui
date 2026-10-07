# AGENTS.md

> **Cross-tool Compatibility:** Antigravity 2.0 auto-loads `AGENTS.md` as a root directory rule, and also indexes modular rules with YAML frontmatter in `.agents/rules/*.md`. This root file mirrors `00-core-contract.md` for tools following the [agents.md](https://agents.md) open standard (Cursor, Copilot, Codex CLI). Keep `00-core-contract.md` as the single source of truth.

## Core contract (mirrors `.agents/rules/00-core-contract.md`)

1. **Component library:** Base UI (`@base-ui/react`), not Radix. Full detail: `.agents/rules/component-library.md`.
2. **Architectural Layers & Primitive-Check-First:**
   - **Primitives (`src/components/ui/`):** Pure Base UI wrappers and design tokens. Zero business logic. Never import from blocks or features.
   - **Composite Blocks (`src/components/blocks/`):** Reusable, controlled UI compositions built strictly from primitives and design tokens. Pure UI assemblies (receive props, emit callbacks, zero network or auth coupling). Never import from features.
   - **Feature Views (`src/features/` or `src/views/`):** Domain-specific screens & workflows. Owns state, queries, and auth. Decoupled from the shared component registry.
   - **Direct Tag Ban:** Direct `<button>`, `<input>`, and `<select>` tags outside `components/ui/` are strictly banned (enforced via ESLint AST selectors). Always use `<Button>`, `<Input>`, `<Select>` from `@/components/ui/`.
3. **API preservation:** Visual styling, bug fixes, or token updates must NEVER erode component API surface, strip Base UI polymorphic `render` / slot props, drop compound subcomponents, or downgrade primitives to plain HTML `<div>`s or `<button>`s.
4. **Anti-pattern gate:** Re-check `.agents/rules/anti-patterns.md` before finishing any UI task. Highest priority: no triple-tint monochrome chips, no focus vs. selection ambiguity, no raw interactive HTML tags, and no registry bloat.
5. **Design law:** Full structural/color/typography/a11y rules live in `.agents/rules/design-system.md` and the project root `DESIGN.md` — treat `DESIGN.md` as the single source of truth for tokens, never invent hex codes.
6. **Routing index:** See the table in `.agents/rules/00-core-contract.md` for which skill/rule/MCP to use for design, components, copywriting, accessibility auditing, and Firebase work.

---

<!-- BEGIN:nextjs-agent-rules -->
# Next.js Framework Customizations (Breaking Changes)

This version of Next.js has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
