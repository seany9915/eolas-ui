# Eolas UI — Private Base UI Component Registry

`eolas-ui` is a CLI distributor for the clinical Base UI component library and design system.

## Setup in a Consuming Project

### 1. Configure `.npmrc`
Ensure your project has access to GitHub Packages:

```ini
@seany9915:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Add Components, Theme, Rules & Lint
Run `eolas-ui` to install components and their dependencies into your project (respects `components.json` `aliases` and `tailwind.css`):

```bash
# List all available primitives, composite blocks, presets, rules, and utilities
npx @seany9915/eolas-ui list

# Add the design system theme, rules, and lint preset
npx @seany9915/eolas-ui add theme design-md agent-rules lint

# Add specific components (auto-fetches internal dependencies and utils)
npx @seany9915/eolas-ui add dialog select tabs

# Preview changes without writing files
npx @seany9915/eolas-ui add data-table --dry-run
npx @seany9915/eolas-ui sync --dry-run

# Overwrite existing files to update to latest version
npx @seany9915/eolas-ui add tabs --overwrite
npx @seany9915/eolas-ui sync
```

### 3. Fonts & Material Symbols Icons
Installing `theme` adds `@import url(...)` rules to your stylesheet for `Atkinson Hyperlegible Next`, `Lexend`, `Roboto Mono`, and the `Material Symbols Outlined` icon subset used by all Eolas UI primitives and blocks.

For faster initial font discovery in production apps, you may optionally add preconnect links in your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### 4. Required Dependencies
The CLI prints the exact `npm install` command for all items you add. Core primitives require:

```bash
npm install @base-ui/react clsx tailwind-merge
```

Specialized primitives/blocks also declare their optional packages (such as `recharts`, `react-day-picker`, `@tanstack/react-table`, `cmdk`, `react-resizable-panels`, `embla-carousel-react`, or `@dnd-kit/react`).

### 5. Agent Guardrails with `@shadcn/lint` & Oxlint
Prevent AI coding agents and developers from eroding design tokens, overriding touch target floors (44px min), or introducing anti-patterns:

```bash
npm install -D @shadcn/lint oxlint
npx @seany9915/eolas-ui add lint
```

Or extend the preset directly from `node_modules` in your `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@seany9915/eolas-ui/lint/oxlintrc.json"]
}
```

This preset enforces:
- **`eolas/no-raw-html-controls`**, **`eolas/no-radix-imports`**, **`eolas/no-positive-tabindex`**, **`eolas/require-iscomposing-on-enter`**, **`eolas/no-static-clickable-elements`**
- **`shadcn/no-raw-colors`**: Enforces Eolas semantic tokens (`bg-primary`, `bg-surface-container`, `text-on-surface`, etc.).
- **`shadcn/no-arbitrary-values`**: Bans arbitrary bracket classes (`p-[13px]`).
- **`shadcn/no-restyle`**: Enforces component contracts on `Button`, `Chip`, `Card`, `InlineAlert`, `Toast`, dialogs, drawers, and form controls.
