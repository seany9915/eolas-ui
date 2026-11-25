# Eolas UI — Base UI Component Registry CLI

`eolas-ui` is a CLI distributor for the Eolas UI clinical Base UI component library and design system. It works completely offline from the bundled registry snapshot and stays in exact parity with the public GitHub Pages registry (`https://seany9915.github.io/eolas-ui/r/`).

## Setup in a Consuming Project

### 1. Configure `.npmrc` (GitHub Packages)
Ensure your project can install `@seany9915/eolas-ui` from GitHub Packages:

```ini
@seany9915:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Add Components, Theme, Rules & Lint
Run `eolas-ui` to install components and their dependencies into your project (respects `components.json` `aliases`, `tsconfig.json` / `jsconfig.json` path mappings, and `tailwind.css`):

```bash
# Print CLI version
npx @seany9915/eolas-ui --version

# List all available primitives, composite blocks, presets, rules, and utilities
npx @seany9915/eolas-ui list

# Add the design system theme, rules, lint preset, and brand logos
npx @seany9915/eolas-ui add theme design-md agent-rules lint logos

# Add specific components (auto-fetches internal dependencies and utils; accepts @eolas/ prefixes)
npx @seany9915/eolas-ui add dialog select tabs
npx @seany9915/eolas-ui add @eolas/button

# Install all primitives, composite blocks, and utilities
npx @seany9915/eolas-ui add --all

# Preview changes without writing files
npx @seany9915/eolas-ui add data-table --dry-run
npx @seany9915/eolas-ui sync --dry-run

# Update only already-installed items (components, blocks, utilities, theme, design-md, agent-rules, lint, logos)
npx @seany9915/eolas-ui sync

# Update specific items (and their dependencies) in place
npx @seany9915/eolas-ui sync button dialog

# Explicitly sync the full catalog
npx @seany9915/eolas-ui sync --all

# Overwrite specific existing files to update to the latest version
npx @seany9915/eolas-ui add tabs --overwrite
```

### 3. Fonts & Material Symbols Icons
Installing `theme` writes the Tailwind CSS v4 stylesheet to `src/eolas-theme.css` without overwriting an existing non-Eolas `src/index.css`. Import it inside your main Tailwind CSS entry file (`@import "./eolas-theme.css";` in your `components.json` `tailwind.css` file) — or point `components.json`'s `tailwind.css` directly to `src/eolas-theme.css` — so both Tailwind v4 `@theme` resolution and `@shadcn/lint` (`shadcn/no-unknown-classes`) discover all Eolas tokens.

Fonts (`Atkinson Hyperlegible Next`, `Lexend`, `Roboto Mono`) and `Material Symbols Outlined` are loaded non-blocking via `<link>` tags rather than render-blocking CSS `@import` rules. Add these to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400..700&family=Lexend:wght@400..700&family=Roboto+Mono:wght@400..700&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL,GRAD,opsz,wght@0..1,-25..0,20..40,400&display=block"
  rel="stylesheet"
/>
```

### 4. Required Dependencies
The CLI prints the exact `npm install` command for all items you add. Core primitives require:

```bash
npm install @base-ui/react clsx tailwind-merge
```

Specialized primitives/blocks also declare their optional packages (such as `recharts`, `react-day-picker`, `@tanstack/react-table`, `cmdk`, `react-resizable-panels`, `embla-carousel-react`, or `@dnd-kit/react`).

### 5. Agent Guardrails with `@shadcn/lint` & Oxlint
Prevent AI coding agents and developers from eroding design tokens, overriding touch target floors (44px min), or introducing anti-patterns. Requires Node `>=20.19.0` and `oxlint >=1.80.0`.

**Option A (Standalone files via CLI):**

```bash
npm install -D @shadcn/lint oxlint
npx @seany9915/eolas-ui add lint
```

**Option B (Extend directly from `node_modules`):**

Install `@seany9915/eolas-ui` as a devDependency alongside `@shadcn/lint` and `oxlint`:

```bash
npm install -D @seany9915/eolas-ui @shadcn/lint oxlint
```

Then extend the preset in `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@seany9915/eolas-ui/lint/oxlintrc.json"]
}
```

This preset enforces:
- **21 `eolas/*` AST guardrails**: `no-raw-html-controls`, `no-radix-imports`, `wrapped-libraries`, `one-way-imports`, `no-reach-in-selectors`, `no-positive-tabindex`, `require-iscomposing-on-enter`, `no-static-clickable-elements`, `icon-button-label`, `no-rebuilt-overlay`, `no-nested-card`, `no-sparkle-icons`, `no-triple-tint`, `no-light-surface-tertiary`, `no-dark-variant`, `no-important`, `prefer-shorthand`, `no-transition-all`, `no-spring-easing`, `no-uppercase`, `no-unsafe-type-cast`, plus **`typescript/ban-ts-comment`**
- **6 `shadcn/*` rules**:
  - `shadcn/no-raw-colors` — enforces Eolas semantic tokens (`bg-primary`, `bg-surface-container-low`, `bg-surface-container-high`, `text-on-surface`, etc.)
  - `shadcn/no-arbitrary-values` — bans arbitrary bracket classes (`p-[13px]`), while allowing explicit `transition-[...]` motion properties
  - `shadcn/no-inline-styles` — bans ad-hoc `style={{ ... }}` overrides
  - `shadcn/no-unknown-classes` — flags unrecognized utility classes
  - `shadcn/require-static-classes` — enforces statically analyzable Tailwind classes
  - `shadcn/no-restyle` — enforces component contracts on `Button`, `UnstyledButton`, `Icon`, `Badge`, `Chip`, `Card`, `InlineAlert`, `Toast`, `Tabs`, dialogs, drawers, popups, form controls, `Skeleton`, motion primitives, and table cells
