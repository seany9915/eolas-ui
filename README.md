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
npm install -D @shadcn/lint eslint @typescript-eslint/parser
```

In your project's `eslint.config.mjs`:
```javascript
import eolasLint from "@seany9915/eolas-ui/lint";

export default [
  ...eolasLint,
];
```

If you are consuming via the URL registry without `@seany9915/eolas-ui`, configure `@shadcn/lint` in `eslint.config.mjs`:
```javascript
import { plugin as shadcn } from "@shadcn/lint";

export default [
  {
    plugins: { shadcn },
    rules: {
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-restyle": ["error", {
        allow: ["layout"],
        contracts: [
          { pattern: "^Button$", allow: ["w-full", "mt-*", "mb-*", "mx-*", "my-*", "shrink-*", "self-*"] },
          { pattern: "^Chip$", allow: ["layout"], deny: ["bg-*", "text-*", "border-*"] },
        ]
      }],
    },
  },
];
```

---

## 📦 What is Included?

All official Base UI primitives + clinical UI components:
* **Layout & Navigation:** navigation-menu, tabs, menubar, toolbar, scroll-area, separator, direction-provider
* **Overlays & Dialogs:** dialog, alert-dialog, drawer, popover, tooltip, preview-card
* **Form & Selection:** select, combobox, autocomplete, checkbox, checkbox-group, radio, switch, slider, number-field, otp-field, input, field, fieldset, form
* **Feedback & Status:** toast, inline-alert, progress, meter, skeleton, chip
* **Utilities:** utils (re-exporting Base UI prop composition & headless render hooks)
