# Eolas UI

Eolas UI is an accessible, production-grade clinical design system built on **Base UI (@base-ui/react)** and **Tailwind CSS v4**.

## 🚀 Quick Start — Add Components to Any Project

You can add components directly to any React codebase using standard registry tooling:

```bash
# Example: Adding Dialog (automatically installs dependencies and utilities)
npx shadcn add https://seany9915.github.io/eolas-ui/r/dialog.json
```

Or configure `components.json` once in your project:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@eolas": "https://seany9915.github.io/eolas-ui/r/{name}.json"
  }
}
```

Then add any of the components on demand:
```bash
npx shadcn add @eolas/button
npx shadcn add @eolas/dialog
npx shadcn add @eolas/select
npx shadcn add @eolas/tabs
npx shadcn add @eolas/navigation-menu
```

---

## 🛡️ Agent-First Guardrails with `@shadcn/lint`

AI coding agents (Cursor, Claude Code, Antigravity, Copilot) often erode design systems by writing ad-hoc inline styles or raw Tailwind palette classes (e.g. `bg-emerald-600 px-6 py-2`).

Eolas UI provides pre-configured `@shadcn/lint` rules to enforce design tokens and component contracts with near-100% 1-shot agent self-correction:

```bash
npm install -D @shadcn/lint oxlint
```

In your project's `.oxlintrc.json`:
```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@seany9915/eolas-ui/lint/oxlintrc.json"]
}
```

Or install the standalone `.oxlintrc.json` and `lint/index.mjs` directly via the registry:
```bash
npx shadcn add @eolas/lint
```

If you are consuming via the URL registry without `@eolas/lint`, configure `@shadcn/lint` in `.oxlintrc.json`:
```json
{
  "jsPlugins": ["@shadcn/lint"],
  "rules": {
    "shadcn/no-raw-colors": "error",
    "shadcn/no-arbitrary-values": "error",
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

## 📦 What is Included?

140 installable registry items covering Base UI primitives, clinical composite blocks, utility modules, theme tokens, agent rules, and lint enforcement:
* **UI Primitives (106):** Layout & navigation (`navigation-menu`, `tabs`, `menubar`, `toolbar`, `scroll-area`, `separator`, `sidebar`), overlays (`dialog`, `alert-dialog`, `drawer`, `popover`, `tooltip`, `preview-card`, `command`), form & selection (`select`, `combobox`, `autocomplete`, `checkbox`, `radio`, `switch`, `slider`, `number-field`, `otp-field`, `input`, `input-group`, `field`, `fieldset`, `form`), feedback & status (`toast`, `inline-alert`, `progress`, `meter`, `skeleton`, `badge`, `chip`), motion primitives, and clinical AI UI (`chat-message`, `trace`, `reasoning`, `tool`, `confirmation`, `sources`, `attachment`).
* **Composite Blocks (18):** `app-shell`, `chart-card` suite (`area-chart-card`, `bar-chart-card`, `line-chart-card`, `pie-chart-card`, `radar-chart-card`, `radial-chart-card`), `chat`, `data-table`, `filter-toolbar`, `list-detail-block`, `questionnaire`, `step-wizard`, `supporting-pane-block`, plus legacy compatibility blocks.
* **Utilities & Hooks (12):** `utils` (Base UI prop composition & headless render hooks, `cn()`, `sanitizeUrl()`, `assetUrl()`), `sanitize`, `scheduler`, `built-in-ai`, `scroll-completion`, `format-duration`, plus internal UI helper modules (`announce`, `contrast`, `use-horizontal-scroll-fade`, `use-text-highlight`, `use-web-otp`, `view-transitions`).
* **Design Tokens, Rules & Linter (4):** `theme`, `design-md`, `agent-rules`, and `lint`.
