# Architecture Quality Gate

### Component reuse
- [ ] Shared component directory (e.g. `src/components/ui/`) was audited before drafting anything new.
- [ ] No new component duplicates an existing primitive's functionality.
- [ ] New primitives are built on Base UI (`@base-ui/react`), not Radix, and placed in the shared directory.

### Structural integrity
- [ ] Logic extracted to custom hooks in `src/hooks/`.
- [ ] No monolithic files; strictly Atomic/Composite modularity.
- [ ] All static text/URLs moved to `src/data/mockData.ts`.

### Type safety and syntax
- [ ] Props use `Readonly<T>` interfaces.
- [ ] File is syntactically valid TypeScript (no red squiggles).
- [ ] Placeholders from templates (e.g., `StitchComponent`) have been replaced with actual names.

### Styling and theming
- [ ] Dark mode (`dark:`) applied to all color classes.
- [ ] No hardcoded hex values; use theme-mapped Tailwind classes.