# Eolas UI

Eolas UI is an accessible, production-grade clinical design system built on **Base UI (`@base-ui/react`)** and **Tailwind CSS v4**.

## Quick Start — Add Components to Any Project

Configure `components.json` once in your project:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@eolas": "https://seany9915.github.io/eolas-ui/r/{name}.json"
  }
}
```

### 1. Install the Theme First

Install `@eolas/theme` before adding components so semantic color roles, surface tokens, typography, and motion tokens are defined:

```bash
npx shadcn@latest add @eolas/theme
```

This writes the complete Tailwind CSS v4 theme to `src/eolas-theme.css` without overwriting your existing stylesheet. Import it in your application entry point (for example, `import './eolas-theme.css'` in `src/main.tsx`) or main CSS file.

### 2. Add Components on Demand

```bash
# Add via configured @eolas namespace (automatically installs dependencies and utilities)
npx shadcn@latest add @eolas/button
npx shadcn@latest add @eolas/dialog
npx shadcn@latest add @eolas/select
npx shadcn@latest add @eolas/tabs
npx shadcn@latest add @eolas/navigation-menu

# Or install directly by URL without configuring components.json
npx shadcn@latest add https://seany9915.github.io/eolas-ui/r/dialog.json
```

---

## Agent-First Guardrails with `@shadcn/lint` & Oxlint

AI coding agents (Cursor, Claude Code, Antigravity, Copilot) often erode design systems by writing ad-hoc inline styles or raw Tailwind palette classes (e.g. `bg-emerald-600 px-6 py-2`).

Eolas UI ships a pre-configured Oxlint setup enforcing all **6 active `shadcn/*` rules** and **13 `eolas/*` AST guardrails** (plus `typescript/ban-ts-comment`).

### Option A (Recommended): Install via Registry

```bash
npm install -D @shadcn/lint oxlint
npx shadcn@latest add @eolas/lint
```

This writes `lint/index.mjs` and a ready-to-run `.oxlintrc.json` to your project root. Run `npx oxlint .` to verify.

### Option B: Extend the Package Preset from `node_modules`

If you consume the `@seany9915/eolas-ui` package from GitHub Packages, add `@seany9915:registry=https://npm.pkg.github.com` to `.npmrc` and install `@seany9915/eolas-ui` alongside `@shadcn/lint` and `oxlint`:

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

### Active Lint Rules

- **6 `shadcn/*` rules**: `shadcn/no-raw-colors`, `shadcn/no-arbitrary-values`, `shadcn/no-inline-styles`, `shadcn/no-unknown-classes`, `shadcn/require-static-classes`, and `shadcn/no-restyle` (with Eolas contracts for `Button`, `UnstyledButton`, `Icon`, `Badge`, `Chip`, `Card`, `InlineAlert`, `Toast`, `Tabs`, inputs, `Field`, dialogs/drawers, popups, `Skeleton`, motion primitives, and table cells).
- **13 `eolas/*` AST rules**: `eolas/no-positive-tabindex`, `eolas/require-iscomposing-on-enter`, `eolas/no-static-clickable-elements`, `eolas/no-raw-html-controls`, `eolas/no-radix-imports`, `eolas/no-nested-card`, `eolas/no-sparkle-icons`, `eolas/no-triple-tint`, `eolas/no-light-surface-tertiary`, `eolas/no-transition-all`, `eolas/no-spring-easing`, `eolas/no-uppercase`, and `eolas/no-unsafe-type-cast`.

If you only want minimal `@shadcn/lint` rules without `@eolas/lint`:

```json
{
  "jsPlugins": ["@shadcn/lint"],
  "rules": {
    "shadcn/no-raw-colors": ["error", { "scanAllStrings": true }],
    "shadcn/no-arbitrary-values": ["error", { "scanAllStrings": true }],
    "shadcn/no-inline-styles": "error",
    "shadcn/no-unknown-classes": "error",
    "shadcn/require-static-classes": "error",
    "shadcn/no-restyle": ["error", {
      "allow": ["layout"],
      "contracts": [
        { "pattern": "^Button$", "allow": ["w-full", "mt-*", "mb-*", "mx-*", "my-*", "shrink-*", "self-*"] },
        { "pattern": "^Chip$", "allow": ["layout"], "deny": ["bg-*", "text-*", "border-*"] }
      ]
    }]
  }
}
```

---

## What is Included?

140 installable registry items covering Base UI primitives, clinical composite blocks, utility modules, theme tokens, agent rules, and lint enforcement:

- **UI Primitives (106):** Layout & navigation (`navigation-menu`, `tabs`, `menubar`, `toolbar`, `scroll-area`, `separator`, `sidebar`), overlays (`dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `preview-card`, `command`), form & selection (`select`, `combobox`, `autocomplete`, `checkbox`, `radio`, `switch`, `slider`, `number-field`, `otp-field`, `input`, `input-group`, `field`, `fieldset`, `form`), feedback & status (`toast`, `inline-alert`, `progress`, `meter`, `skeleton`, `badge`, `chip`), motion primitives, and clinical AI UI (`chat-message`, `trace`, `reasoning`, `tool`, `confirmation`, `sources`, `attachment`).
- **Composite Blocks (18):** `app-shell`, `chart-card` suite (`area-chart-card`, `bar-chart-card`, `line-chart-card`, `pie-chart-card`, `radar-chart-card`, `radial-chart-card`), `chat`, `data-table`, `filter-toolbar`, `list-detail-block`, `questionnaire`, `step-wizard`, `supporting-pane-block`, plus legacy compatibility blocks.
- **Utilities & Hooks (12):** `utils` (Base UI prop composition & headless render hooks, `cn()`, `sanitizeUrl()`, `assetUrl()`, `composeClassName()`, `resolveNativeButton()`), `sanitize`, `scheduler`, `built-in-ai`, `scroll-completion`, `format-duration`, plus internal UI helper modules (`announce`, `contrast`, `use-horizontal-scroll-fade`, `use-text-highlight`, `use-web-otp`, `view-transitions`).
- **Design Tokens, Rules & Linter (4):** `theme`, `design-md`, `agent-rules`, and `lint`.
