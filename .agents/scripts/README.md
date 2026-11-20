# Enforcement hook scripts

These are [Antigravity lifecycle hooks](https://antigravity.google/docs/hooks) wired up in `.agents/hooks.json`. Structural code checks live in Oxlint (`packages/eolas-ui/lint/index.mjs` + `.oxlintrc.json`) so they run identically in editors, CI, and for human contributors, while these hooks provide pre-write text/secret/primitive safety and end-of-turn Oxlint feedback for agents.

## What each script does

- **`check-anti-patterns.mjs`** (`PreToolUse`) — lightweight pre-write guard for patterns that do not require full-file AST parsing or span non-JS copy/CSS: placeholder/truncation stubs (`// TODO: implement`, `// ... rest of`), decorative emojis in UI copy (allowing `©`, `®`, `™`, `★`), banned AI clichés and dev/DB/CSS jargon inside JSX text and UI copy props, and CSS fallbacks (`text-transform: uppercase`, `transition: all`, `--ease-spring`) in standalone `.css` files. Violations return `deny`.
- **`check-primitive-inventory.mjs`** (`PreToolUse`) — fires when a brand-new `.tsx`/`.jsx` file is created, checking two things: (1) duplicate or synonym component names (e.g. `Modal`, `Dropdown`, `Snackbar`) anywhere under `src/` (excluding `blocks/`, `playground/`, `demos/`) that overlap with existing primitives in `src/components/ui/`, and (2) files placed directly under top-level `components/` outside `ui/`, `blocks/`, or `playground/`. Prompts with `force_ask` and names the specific conflicting primitives.
- **`check-secrets.mjs`** (`PreToolUse`) — scans code and config about to be written for production API keys, private keys, and high-entropy credential assignments (including JSON and `.env` files, and confirmed key tokens inside Markdown). Returns `deny` on confirmed key formats and `force_ask` (redacting the value, showing only the key name) on generic credential assignments. Fails safe to `force_ask` if the hook encounters an unexpected error.
- **`check-oxlint-on-stop.mjs`** (`Stop`) — runs local `oxlint` on modified/untracked files at the end of a turn (`NO_TOOL_CALL` when `continuationActive` is false) and returns `decision: "continue"` with lint diagnostics if any errors remain. Safely no-ops in consumer projects that do not have `.oxlintrc.json` and `oxlint` installed.

## Antigravity Decision Model ("deny" vs "ask")

In Antigravity's permission model:
- `decision: "ask"` only prompts when permissions are unset; once write permissions are enabled or cached ("Always allow"), `"ask"` is silently satisfied and skipped.
- `decision: "deny"` halts tool execution unconditionally and feeds the `reason` back into the agent context as an error, ensuring the agent corrects itself without human intervention.
- `decision: "force_ask"` prompts the user every time, ignoring cached permissions.

## Configuration you likely need to change

1. **`DEFAULT_PRIMITIVE_DIRS`** in `check-primitive-inventory.mjs` — automatically reads `aliases.ui` from `components.json` if present, falling back to `src/components/ui`.
2. **Node on `PATH`** — `hooks.json` invokes `node ./scripts/...`. Assumes `node` is available in `PATH`.

## Testing a hook manually

You can pipe a sample payload into any script directly to inspect its JSON response:

```powershell
'{"toolCall":{"name":"write_file","args":{"Path":"src/components/PatientNote.tsx","Content":"<p>Delve into telemetry</p>"}},"workspacePaths":["."]}' | node .agents/scripts/check-anti-patterns.mjs
```

```powershell
'{"toolCall":{"name":"write_file","args":{"Path":"src/components/ui/modal.tsx","Content":"export const Modal = () => null;"}},"workspacePaths":["."]}' | node .agents/scripts/check-primitive-inventory.mjs
```
