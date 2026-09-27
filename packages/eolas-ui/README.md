# Eolas UI — Private Base UI Component Registry

eolas-ui is a private CLI distributor for the clinical Base UI component library and design system.

## Setup in a Consuming Project

### 1. Configure .npmrc
Ensure your project has access to GitHub Packages:

```ini
@seany9915:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Add Components to Any Project
Run eolas-ui to fetch components and their dependencies directly into your project's `src/components/ui/` and `src/lib/`:

```bash
# List all 50 available components
npx @seany9915/eolas-ui list

# Add specific components (auto-fetches dependencies and utils if needed)
npx @seany9915/eolas-ui add dialog select tabs

# Overwrite existing components to update to latest version
npx @seany9915/eolas-ui add dialog --overwrite
```

### 3. Required Peer Dependencies
Ensure the consuming project has peer dependencies installed:

```bash
npm install @base-ui/react clsx tailwind-merge
```

### 4. Agent Guardrails with `@shadcn/lint`
Prevent AI coding agents and human developers from eroding design tokens, overriding touch target floors (44px min), or introducing anti-patterns:

```bash
npm install -D @shadcn/lint eslint @typescript-eslint/parser
```

In your project's `eslint.config.mjs`:
```javascript
import eolasLint from "@seany9915/eolas-ui/lint";

export default [
  ...eolasLint,
  // Your other ESLint configs...
];
```

This preset automatically enforces:
- **`shadcn/no-raw-colors`**: Replaces raw Tailwind palette classes with Eolas semantic tokens (`bg-primary`, `bg-surface-container`, `text-on-surface`, etc.).
- **`shadcn/no-arbitrary-values`**: Bans arbitrary bracket classes (`p-[13px]`).
- **`shadcn/no-restyle`**: Enforces component contracts on `Button`, `Chip`, `Card`, and dialogs so agents use supported variants instead of overriding styles inline.
