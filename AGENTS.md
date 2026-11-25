# AGENTS.md

> Mirrors `.agents/rules/00-core-contract.md` (single source of truth) and `DESIGN.md` for tools following [agents.md](https://agents.md).

## Foundation & Architecture

- **Stack:** Client-side **Vite + React 19** SPA with Tailwind CSS v4 and **Base UI** (`@base-ui/react`). Never generate Next.js App Router files (`page.tsx`, `layout.tsx`, `route.ts`), `next/*` imports, or `@radix-ui/*`.
- **3 Strict One-Way Layers:** `src/components/ui/` (primitives & controlled AI primitives; zero business/network logic) → `src/components/blocks/` (controlled compositions; props/callbacks only) → `src/features/` or `src/views/` (state, queries, auth, routing). Check `ui/` and `blocks/` before creating components.
- **API Preservation:** Never erode component APIs, strip `ref` / `render` props, drop compound subcomponents, or downgrade primitives during bug fixes or styling tweaks.

## Oxlint-Enforced Steer

- **Primitives & Imports:** Use `<Button>`/`<UnstyledButton>`, `<Input>`, `<Select>`, `<Textarea>`, `<Dialog>`, and `<Icon>` instead of raw HTML controls, unlabelled icon buttons, `fixed inset-0` overlays, or direct `@base-ui/react/*` / `@radix-ui/*` imports outside `ui/`.
- **Styling & Selectors:** Pass `className` for layout only — no component restyling, `[&_...]` reach-in selectors, `!` overrides, `dark:*` (`inverted:*` only), `space-x/y-*` (`gap-*`), `w-X h-X` (`size-X`), `h-screen` (`h-dvh`), `uppercase`, `transition-all`, spring easing outside `SuccessCheck`, triple-tint pills, light-surface `*-tertiary`, nested `<Card>`, sparkle icons, inline styles, or `as any` / `@ts-ignore`.

## Design & Copy

- Follow `DESIGN.md` and `.agents/rules/` (`design-system.md`, `component-library.md`, `anti-patterns.md`).
- Wrap inputs in `<FieldGroup>` + `<Field>` + `<FieldLabel>` (use `<InputGroup>` for addons); include `<DialogTitle>`/`<DrawerTitle>`; write plain everyday English UI copy (1–2 nouns; no dev/DB/CSS jargon).
