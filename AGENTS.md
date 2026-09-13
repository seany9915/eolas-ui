# AGENTS.md

> **Cross-tool Compatibility:** Antigravity 2.0 auto-loads `AGENTS.md` as a root directory rule, and also indexes modular rules with YAML frontmatter in `.agents/rules/*.md`. This root file mirrors `00-core-contract.md` for tools following the [agents.md](https://agents.md) open standard (Cursor, Copilot, Codex CLI). Keep `00-core-contract.md` as the single source of truth.

## Core contract (mirrors `.agents/rules/00-core-contract.md`)

1. **Component library:** Base UI (`@base-ui/react`), not Radix. Full detail: `.agents/rules/component-library.md`.
2. **Primitive-check-first:** Before writing any new interactive component, search the shared primitive directory (e.g. `src/components/ui/`) for an existing one first. Never hand-roll a duplicate.
3. **Anti-pattern gate:** Re-check `.agents/rules/anti-patterns.md` before finishing any UI task. Highest priority: no triple-tint monochrome chips, and no focus vs. selection ambiguity.
4. **Design law:** Full structural/color/typography/a11y rules live in `.agents/rules/design-system.md` and the project root `DESIGN.md` — treat `DESIGN.md` as the single source of truth for tokens, never invent hex codes.
5. **Routing index:** See the table in `.agents/rules/00-core-contract.md` for which skill/rule/MCP to use for design, components, copywriting, accessibility auditing, and Firebase work.

---

<!-- BEGIN:nextjs-agent-rules -->
# Next.js Framework Customizations (Breaking Changes)

This version of Next.js has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

