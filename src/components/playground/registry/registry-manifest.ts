// AUTO-GENERATED REGISTRY MANIFEST
import { RegistryEntry } from './types';

export const REGISTRY_ENTRIES: RegistryEntry[] = [
  {
    "id": "utils",
    "name": "utils",
    "title": "Eolas UI Utilities",
    "description": "Core utility library exporting cn() class merger, assetUrl() resolver, and Base UI authoring hooks: mergeProps(), mergePropsN(), mergeClassNames(), makeEventPreventable(), and useRender().",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Base UI Headless Library",
    "sourcePath": "src/lib/utils.ts",
    "dependencies": [
      "clsx",
      "tailwind-merge",
      "@base-ui/react"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/utils"
  },
  {
    "id": "accordion",
    "name": "accordion",
    "title": "Accordion",
    "description": "Accordion primitive (@base-ui/react/accordion).",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/accordion",
    "sourcePath": "src/components/ui/accordion.tsx",
    "taxonomy": [
      "Use Accordion for vertically stacked disclosure panels where one or more sections can be expanded at a time.",
      "Supports browser in-page search (hiddenUntilFound / hidden=\"until-found\").",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/accordion"
  },
  {
    "id": "alert-dialog",
    "name": "alert-dialog",
    "title": "Alert Dialog",
    "description": "Eolas UI Alert Dialog component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/alert-dialog",
    "sourcePath": "src/components/ui/alert-dialog.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/alert-dialog"
  },
  {
    "id": "attachment",
    "name": "attachment",
    "title": "Attachment",
    "description": "Attachment component system. Full API and feature parity with shadcn/ui Base Attachment specification: https://ui.shadcn.com/docs/components/base/attachment ANATOMY: AttachmentGroup └── Attachment ├── AttachmentMedia ├── AttachmentContent │   ├── AttachmentTitle │   └── AttachmentDescription ├── AttachmentActions │   └── AttachmentAction └── AttachmentTrigger FEATURES & CAPABILITIES: - Full compound composition with subcomponents for flexible media, layout, and metadata display. - Upload lifecycle states: 'idle' | 'uploading' | 'processing' | 'error' | 'done'. - Layout orientations: 'horizontal' (compact row/chip) and 'vertical' (stacked card). - Component sizes: 'default' | 'sm' | 'xs'. - Media variants: 'default' (file-type icons or container wash) and 'image' (aspect-square thumbnails). - Stretched interactive overlay (AttachmentTrigger) with isolated action button stacking (AttachmentActions). - Horizontally scrollable, snapping container (AttachmentGroup) with smooth edge fades. - Base UI polymorphic useRender support across all subcomponents. - Strict compliance with DESIGN.md high-contrast tokens, WCAG AA, and floating focus rings.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/attachment.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/attachment"
  },
  {
    "id": "autocomplete",
    "name": "autocomplete",
    "title": "Autocomplete",
    "description": "Autocomplete primitive (@base-ui/react/autocomplete).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/autocomplete",
    "sourcePath": "src/components/ui/autocomplete.tsx",
    "taxonomy": [
      "Use Autocomplete for freeform text search inputs with dynamic completion suggestions where the user can either select a suggestion or type their own custom query.",
      "For selecting one or more values from a closed set where selections submit explicit item keys, use Combobox or Select instead.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, flush selection indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/autocomplete"
  },
  {
    "id": "avatar",
    "name": "avatar",
    "title": "Avatar",
    "description": "Avatar primitive (@base-ui/react/avatar).",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/avatar",
    "sourcePath": "src/components/ui/avatar.tsx",
    "taxonomy": [
      "Displays a user's profile picture, initials, or fallback icon.",
      "Supports image loading states (idle, loading, loaded, error) and delayed fallback rendering to prevent visual flashes during fast network loads.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant touch targets, and sentence case typography."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/avatar"
  },
  {
    "id": "badge",
    "name": "badge",
    "title": "Badge",
    "description": "Badge primitive. Aligned with shadcn/ui and Base UI ecosystem patterns: https://ui.shadcn.com/docs/components/base/badge",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/badge.tsx",
    "taxonomy": [
      "Use Badge for PASSIVE, non-interactive status indicators, counts, categories, or labels.",
      "Do NOT use Badge for interactive filters, toggles, or removable tags (use Chip instead).",
      "Implements DESIGN.md High-Contrast Accessible standards:",
      "Pattern 1 (filled): Solid brand fill + high-contrast on-color text.",
      "Pattern 2 (outline): 1px border in color role + neutral white surface fill + colored text.",
      "Pattern 3 (soft): Soft container wash (bg-*-container) + dark neutral charcoal text (on-*-container).",
      "Never uses the banned triple-tint monochrome pattern (light tint + same-hue border + same-hue text).",
      "Full WCAG 2.2 AA contrast compliance.",
      "Polymorphic composition powered by Base UI's `useRender` hook."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/badge"
  },
  {
    "id": "bot-avatar",
    "name": "bot-avatar",
    "title": "Bot Avatar",
    "description": "Eolas UI Bot Avatar component built on Base UI and DESIGN.md design tokens.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/bot-avatar.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "bot-avatars"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/bot-avatar"
  },
  {
    "id": "breadcrumb",
    "name": "breadcrumb",
    "title": "Breadcrumb",
    "description": "Eolas UI Breadcrumb component built on Base UI and DESIGN.md design tokens.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/breadcrumb.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/breadcrumb"
  },
  {
    "id": "button-group",
    "name": "button-group",
    "title": "Button Group",
    "description": "ButtonGroup primitive. Base UI Integration: Pure design token & Base UI companion primitive. Specification & Reference: https://ui.shadcn.com/docs/components/base/button-group",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/button-group.tsx",
    "taxonomy": [
      "A container to group related buttons, segmented actions, and inputs with fused borders and shared geometry.",
      "Resolves double-border artifacts (-space-x-px / -space-y-px) while ensuring focus rings stay visible with proper stacking context (focus-visible:z-20).",
      "Fuses concentric border radii: rounds outer corners while flattening adjacent internal edges.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/button-group"
  },
  {
    "id": "button",
    "name": "button",
    "title": "Button",
    "description": "Button primitive (@base-ui/react/button).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/button.tsx",
    "taxonomy": [
      "Use Button for triggering immediate page/dialog actions, form submits, or opening popups.",
      "Do NOT use Button for on/off toggles with persistent state (use Toggle instead).",
      "Do NOT use Button for in-page panel navigation (use Tabs instead).",
      "Follows DESIGN.md Tier B interactive controls: concentric radius (rounded 8px / 0.5rem), floating 2px focus ring, active micro-motion scaling, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.",
      "Never uses Sunny Amber (tertiary) text on light surfaces without dark container background."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/button"
  },
  {
    "id": "calendar",
    "name": "calendar",
    "title": "Calendar",
    "description": "Calendar primitive (React DayPicker). Base UI Ecosystem Documentation: https://ui.shadcn.com/docs/components/base/calendar React DayPicker Documentation: https://daypicker.dev",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/calendar.tsx",
    "taxonomy": [
      "Use Calendar for date, multiple date, and date range selections.",
      "Integrates with React DayPicker v9/v10 while maintaining complete shadcn/ui API compatibility.",
      "Commonly paired with Popover and Button to form a DatePicker.",
      "Follows DESIGN.md tokens: Lexend body/cell font (font-sans), Atkinson Hyperlegible Next headings, primary brand selection, surface-container range fills, and WCAG 2.2 AA contrast."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "react-day-picker"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/calendar"
  },
  {
    "id": "card",
    "name": "card",
    "title": "Card",
    "description": "Eolas UI Card component built on Base UI and DESIGN.md design tokens.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/card"
  },
  {
    "id": "carousel",
    "name": "carousel",
    "title": "Carousel",
    "description": "Carousel primitive built on embla-carousel-react and Base UI. Embla Carousel Documentation: https://www.embla-carousel.com/",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/carousel.tsx",
    "taxonomy": [
      "Provides horizontal and vertical cyclic or bounded content carousels and sliders.",
      "Supports touch/drag gestures, physics-based momentum, and keyboard navigation (Arrow keys).",
      "Follows DESIGN.md Tier B tokens: hairline borders (outline-variant), floating 2px focus rings, motion restraint (duration-quick, ease-standard), and accessible 44px touch targets.",
      "Supports Google-style paired bottom controls with progress bars or floating side navigation."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "embla-carousel-react"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/carousel"
  },
  {
    "id": "chain-of-thought",
    "name": "chain-of-thought",
    "title": "Chain Of Thought",
    "description": "ChainOfThought primitive. Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite and `Chip` design tokens. Specification & Reference: - https://ui.shadcn.com/docs/ai-elements - https://ui.shadcn.com/docs/ai-elements/chain-of-thought",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chain-of-thought.tsx",
    "taxonomy": [
      "Displays an AI agent's multi-step execution summary (e.g. \"Researched in 4 steps\") that smoothly expands to reveal historical reasoning, search, and tool steps.",
      "Follows the shadcn AI Elements migration specification: Rebuilt natively using Trace and Chip/Badge primitives.",
      "Exports: ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtTrigger, ChainOfThoughtContent, ChainOfThoughtStep.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on triggers.",
      "Follows DESIGN.md tokens: floating 2px focus ring, semantic tokens, zero triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chain-of-thought"
  },
  {
    "id": "chart",
    "name": "chart",
    "title": "Chart",
    "description": "Eolas UI Chart component built on Base UI and DESIGN.md design tokens.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chart.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chart"
  },
  {
    "id": "chat-message-context",
    "name": "chat-message-context",
    "title": "Chat Message Context",
    "description": "Eolas UI Chat Message Context component built on Base UI and DESIGN.md design tokens.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chat-message-context.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chat-message-context"
  },
  {
    "id": "chat-message",
    "name": "chat-message",
    "title": "Chat Message",
    "description": "ChatMessage primitive. Base UI Integration: Works seamlessly with Base UI Button and Icon primitives.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chat-message.tsx",
    "taxonomy": [
      "Use ChatMessage to display conversational turns (user, assistant, system).",
      "Follows DESIGN.md:",
      "Assistant messages use neutral surface fill (`bg-surface`), outline-variant border, calibrated ambient elevation (`shadow-ambient`), and `rounded-2xl rounded-bl-xs`.",
      "User messages use role container fill (`bg-primary-container text-on-primary-container`), `rounded-2xl rounded-br-xs`, and right alignment.",
      "Actions (copy, bookmark, retry) maintain accessible 44x44px touch targets.",
      "Numeric timestamps use `tabular-nums` and `font-mono`."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chat-message"
  },
  {
    "id": "checkbox-group",
    "name": "checkbox-group",
    "title": "Checkbox Group",
    "description": "CheckboxGroup primitive (@base-ui/react/checkbox-group).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/checkbox-group",
    "sourcePath": "src/components/ui/checkbox-group.tsx",
    "taxonomy": [
      "Provides shared state and keyboard management for a list of related checkboxes.",
      "Supports `allValues` for parent indeterminate checkbox synchronization.",
      "Supports both declarative `options` array and composable `children`.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/checkbox-group"
  },
  {
    "id": "checkbox",
    "name": "checkbox",
    "title": "Checkbox",
    "description": "Checkbox primitive (@base-ui/react/checkbox).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/checkbox",
    "sourcePath": "src/components/ui/checkbox.tsx",
    "taxonomy": [
      "Use Checkbox for multi-selection or binary on/off options within forms or lists.",
      "Supports three states: unchecked, checked, and indeterminate (mixed).",
      "Supports parent-child tree checkboxes via the `parent` prop.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius (rounded-xs / 4px on box, rounded 8px on row), floating 2px focus ring, flush primary fill on check, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/checkbox"
  },
  {
    "id": "checkpoint",
    "name": "checkpoint",
    "title": "Checkpoint",
    "description": "Checkpoint primitive. Base UI Integration: Consumes Base UI Button primitive and Icon primitive.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/checkpoint.tsx",
    "taxonomy": [
      "Use Checkpoint to mark specific points or milestone states in a conversation thread that a user or clinical agent can return to (e.g. before modifying a clinical plan).",
      "Conforms to shadcn AI Elements Checkpoint specification and DESIGN.md:",
      "Balanced horizontal divider with neutral surface wash.",
      "Accessible 44x44px touch target on the Restore trigger.",
      "Monospace tabular-nums for turn numbering and timestamps.",
      "Single-ring floating 2px focus indicator."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/checkpoint"
  },
  {
    "id": "chip",
    "name": "chip",
    "title": "Chip",
    "description": "Chip primitive. Built on Base UI (@base-ui/react) interaction foundations.",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/chip.tsx",
    "taxonomy": [
      "Use Chip for INTERACTIVE compact elements: 1. Filter chips: Toggleable selection filters with keyboard navigation (aria-pressed). 2. Input/Removable chips: Dismissible tags with accessible remove buttons (onRemove). 3. Action chips: Clickable compact triggers (onClick).",
      "For PASSIVE, non-interactive status labels or counts, use Badge instead.",
      "Implements DESIGN.md High-Contrast Accessible standards:",
      "Pattern 1 (filled): Solid brand fill + high-contrast text.",
      "Pattern 2 (outline): 1px border in color role + neutral white surface fill + colored text.",
      "Pattern 3 (soft): Soft container wash (bg-*-container) + dark neutral charcoal text (on-*-container).",
      "Full WCAG 2.2 SC 2.5.8 touch target compliance (expands to 44px when interactive or removable).",
      "Floating 2px focus ring (outline-offset: 2px) on keyboard focus."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chip"
  },
  {
    "id": "clinician-tip",
    "name": "clinician-tip",
    "title": "Clinician Tip",
    "description": "Eolas UI Clinician Tip component built on Base UI and DESIGN.md design tokens.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/clinician-tip.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/clinician-tip"
  },
  {
    "id": "code-block",
    "name": "code-block",
    "title": "Code Block",
    "description": "CodeBlock primitive. Base UI Integration: Consumes Base UI Tooltip and Button primitives. Specification & Reference: - https://ui.shadcn.com/docs/components/base/code-block - https://ui.shadcn.com/docs/ai-elements",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/code-block.tsx",
    "taxonomy": [
      "Displays source code, JSON parameters, database query outputs, and formatted clinical data structures inside agent execution traces or messages.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px touch targets on copy buttons.",
      "Follows DESIGN.md tokens: Roboto Mono typography, high-contrast text, concentric radius, and floating 2px focus ring."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/code-block"
  },
  {
    "id": "collapsible",
    "name": "collapsible",
    "title": "Collapsible",
    "description": "Collapsible primitive (@base-ui/react/collapsible).",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/collapsible",
    "sourcePath": "src/components/ui/collapsible.tsx",
    "taxonomy": [
      "Use Collapsible for an interactive disclosure element that shows or hides a single panel.",
      "Supports browser in-page search (hiddenUntilFound / hidden=\"until-found\").",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/collapsible"
  },
  {
    "id": "combobox",
    "name": "combobox",
    "title": "Combobox",
    "description": "Combobox primitive (@base-ui/react/combobox).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/combobox",
    "sourcePath": "src/components/ui/combobox.tsx",
    "taxonomy": [
      "Use Combobox for selecting one or multiple values from a list of options with text filtering.",
      "Supports multi-selection with inline chips (Combobox.Chips, Combobox.Chip, Combobox.ChipRemove).",
      "For freeform text searches where custom unlisted queries are valid, use Autocomplete instead.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, flush selection indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/combobox"
  },
  {
    "id": "command",
    "name": "command",
    "title": "Command",
    "description": "Command primitive (cmdk + Base UI Dialog). cmdk Documentation: https://cmdk.paco.me",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/command.tsx",
    "taxonomy": [
      "Use Command for fast, accessible command palettes, spotlight search, and quick action menus.",
      "Powered by cmdk for fuzzy searching, keyboard scoring, and grouped item filtering.",
      "CommandDialog integrates Base UI Dialog (with screen-reader accessible DialogTitle and DialogDescription) while retaining complete shadcn Command API compatibility.",
      "Follows DESIGN.md tokens: Lexend body font (font-sans), Atkinson Hyperlegible Next headings, surface-container wash for item selection, and strict semantic tokens."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "cmdk"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/command"
  },
  {
    "id": "confirmation",
    "name": "confirmation",
    "title": "Confirmation",
    "description": "Confirmation primitive. Base UI Integration: Consumes Base UI Button primitive and Icon primitive.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/confirmation.tsx",
    "taxonomy": [
      "Dual-purpose component: 1. AI Tool Approval Gate: Conforms to shadcn AI Elements confirmation lifecycle (approval-requested -> approved / denied) for Human-in-the-Loop tool execution. 2. Clinical Decision Gate: Structured inline consent, prescription verification, order sign-off, or risk acknowledgment card in clinical workflows and dashboards.",
      "Conforms to shadcn AI Elements Confirmation specification and DESIGN.md:",
      "High-contrast visual structure with calm clinical amber/neutral tokens.",
      "Clear distinction between pending, approved, and denied states.",
      "WCAG 2.2 compliant 44x44px touch targets on decision buttons.",
      "Floating 2px focus rings (`outline-offset: 2px`).",
      "Concentric radius hierarchy (`rounded-xl` container with `rounded` buttons)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/confirmation"
  },
  {
    "id": "context-menu",
    "name": "context-menu",
    "title": "Context Menu",
    "description": "Eolas UI Context Menu component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/context-menu",
    "sourcePath": "src/components/ui/context-menu.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/context-menu"
  },
  {
    "id": "csp-provider",
    "name": "csp-provider",
    "title": "Csp Provider",
    "description": "Eolas UI Csp Provider component built on Base UI and DESIGN.md design tokens.",
    "category": "system",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/csp-provider",
    "sourcePath": "src/components/ui/csp-provider.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/csp-provider"
  },
  {
    "id": "deferred-view",
    "name": "deferred-view",
    "title": "Deferred View",
    "description": "DeferredView primitive. Platform Reference: Modern Web Guidance (MWG: defer-rendering-heavy-content)",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/deferred-view.tsx",
    "taxonomy": [
      "Defers layout and paint computations for offscreen or below-the-fold content using CSS `content-visibility: auto`.",
      "Pairs with `contain-intrinsic-size` to prevent layout shifts and scrollbar jumping.",
      "Supports 'hidden' mode for instantaneous view toggling without destroying component DOM state.",
      "Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/deferred-view"
  },
  {
    "id": "dialog",
    "name": "dialog",
    "title": "Dialog",
    "description": "Eolas UI Dialog component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/dialog",
    "sourcePath": "src/components/ui/dialog.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/dialog"
  },
  {
    "id": "direction-provider",
    "name": "direction-provider",
    "title": "Direction Provider",
    "description": "Eolas UI Direction Provider component built on Base UI and DESIGN.md design tokens.",
    "category": "system",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/direction-provider",
    "sourcePath": "src/components/ui/direction-provider.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/direction-provider"
  },
  {
    "id": "drawer",
    "name": "drawer",
    "title": "Drawer",
    "description": "Drawer primitive (@base-ui/react/drawer).",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/drawer",
    "sourcePath": "src/components/ui/drawer.tsx",
    "taxonomy": [
      "Use Drawer for slide-over side panels or bottom sheets with swipe dismissal gestures, snap points, and background indent effects.",
      "For focused modal dialogs without swipe gestures, use Dialog instead.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/drawer"
  },
  {
    "id": "empty-state",
    "name": "empty-state",
    "title": "Empty State",
    "description": "EmptyState primitive (backward-compatibility alias for Empty). Canonical primitive resides at @/components/ui/empty. Conforms to https://ui.shadcn.com/docs/components/base/empty",
    "category": "feedback",
    "tier": "utility",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/empty-state.tsx",
    "isDeprecated": true,
    "deprecatedNote": "Legacy re-export barrel. Prefer importing canonical primitive: @/components/ui/empty.",
    "replacedBy": "empty",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/empty-state"
  },
  {
    "id": "empty",
    "name": "empty",
    "title": "Empty",
    "description": "Empty primitive. Base UI Integration: Pure design token & Base UI companion primitive. Specification & Reference: https://ui.shadcn.com/docs/components/base/empty",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/empty.tsx",
    "taxonomy": [
      "Use Empty to display empty states when collections, search results, or tables have no items.",
      "Composable compound architecture:",
      "Empty (Root container)",
      "EmptyHeader (Group wrapper for media, title, and description)",
      "EmptyMedia (Icon / Avatar / Graphic tile with variant=\"default\" | \"icon\")",
      "EmptyTitle (Headline typography in Atkinson Hyperlegible Next)",
      "EmptyDescription (Body typography in Lexend with accessible link styling)",
      "EmptyContent (Actions and button container)",
      "Also supports monolithic convenience props (icon, title, description, action) for backward compatibility.",
      "Follows DESIGN.md: concentric border radius, semantic high-contrast colors, and text-balance / text-pretty."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/empty"
  },
  {
    "id": "error-shake",
    "name": "error-shake",
    "title": "Error Shake",
    "description": "Horizontal form micro-shake wrapper based on transitions.dev (12-error-state-shake.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/error-shake.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/error-shake"
  },
  {
    "id": "field",
    "name": "field",
    "title": "Field",
    "description": "Field primitive (@base-ui/react/field).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/field",
    "sourcePath": "src/components/ui/field.tsx",
    "taxonomy": [
      "Use Field to group a form control with its label, description, and error message.",
      "Supports automatic validation (onSubmit, onBlur, onChange), validation debouncing, and accessibility attribute wiring (id, aria-labelledby, aria-describedby, aria-invalid).",
      "Supports vertical (default) and horizontal layouts (for Switch, Checkbox, Radio).",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/field"
  },
  {
    "id": "fieldset",
    "name": "fieldset",
    "title": "Fieldset",
    "description": "Fieldset primitive (@base-ui/react/fieldset).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/fieldset",
    "sourcePath": "src/components/ui/fieldset.tsx",
    "taxonomy": [
      "Use Fieldset to group related form controls with a shared legend and description.",
      "Cascades disabled state natively to all nested interactive form controls.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/fieldset"
  },
  {
    "id": "form",
    "name": "form",
    "title": "Form",
    "description": "Form primitive (@base-ui/react/form).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/form",
    "sourcePath": "src/components/ui/form.tsx",
    "taxonomy": [
      "A native form element with consolidated error handling, field registration, imperative validate actions, and external error state integration.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/form"
  },
  {
    "id": "icon",
    "name": "icon",
    "title": "Icon",
    "description": "Eolas UI Icon component built on Base UI and DESIGN.md design tokens.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/icon.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/icon"
  },
  {
    "id": "inline-alert",
    "name": "inline-alert",
    "title": "Inline Alert",
    "description": "InlineAlert primitive. Aligned with shadcn/ui and Base UI ecosystem patterns: https://ui.shadcn.com/docs/components/base/alert",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/inline-alert.tsx",
    "taxonomy": [
      "Use InlineAlert for high-visibility system event or validation banners (neutral, warning, error, success).",
      "Implements a mathematically straight 4px vertical accent bar, ambient elevation, and accessible live regions.",
      "Supports both monolithic props (title, action, onClose) and compound subcomponents (InlineAlert.Title, InlineAlert.Description, InlineAlert.Action, InlineAlert.Close).",
      "Distinct from ClinicianTip (which is low-prominence instructional micro-guidance) and AlertDialog (modal interrupt).",
      "Follows DESIGN.md tokens: Atkinson Hyperlegible Next headings (font-heading), Lexend body (font-sans), and semantic color roles."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/inline-alert"
  },
  {
    "id": "inline-citation",
    "name": "inline-citation",
    "title": "Inline Citation",
    "description": "Inline Citation primitive. Base UI Integration: Built on Base UI PreviewCard (@base-ui/react/preview-card), Button (UnstyledButton), and Carousel primitives. Conforms to shadcn AI Elements specification: https://ui.shadcn.com/docs/ai-elements/base/inline-citation",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/preview-card",
    "sourcePath": "src/components/ui/inline-citation.tsx",
    "taxonomy": [
      "Use InlineCitation to embed source references, RAG grounding passages, and web search literature directly inside prose or assistant messages.",
      "Conforms to DESIGN.md:",
      "Pattern 2 high-contrast citation pill (neutral surface fill, outline-secondary border, Rich Emerald text).",
      "WCAG 2.2 SC 2.5.8 compliant 44x44px touch target on interactive triggers.",
      "Floating 2px focus ring with 2px offset (outline-primary).",
      "Single-source preview or multi-source Carousel with tabular navigation.",
      "Full keyboard accessibility and prefers-reduced-motion safety."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/inline-citation"
  },
  {
    "id": "input-group",
    "name": "input-group",
    "title": "Input Group",
    "description": "InputGroup primitive. Full API reference and feature parity with shadcn/ui Base Input Group specification: https://ui.shadcn.com/docs/components/base/input-group ANATOMY: InputGroup ├── InputGroupInput (or InputGroupTextarea) └── InputGroupAddon (align=\"inline-start\" | \"inline-end\" | \"block-start\" | \"block-end\") ├── InputGroupButton └── InputGroupText",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/input-group.tsx",
    "taxonomy": [
      "Use InputGroup to attach icons, buttons, text prefixes, suffixes, and action toolbars to input fields and textareas.",
      "Bridges single-line search/URL fields and multi-line AI chat prompt inputs under a single visual boundary.",
      "Eliminates double-border and double-focus ring artifacts by delegating focus exclusively to InputGroup.",
      "Integrates seamlessly with Base UI Field (<Field.Control>) for accessible label and error wiring.",
      "Supports polymorphic composition via Base UI's `useRender` hook across all sub-components.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/input-group"
  },
  {
    "id": "input",
    "name": "input",
    "title": "Input",
    "description": "Input primitive (@base-ui/react/input). shadcn Base Input Documentation: https://ui.shadcn.com/docs/components/base/input ANATOMY: Input (or BaseInput / InputPrimitive)",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/input",
    "sourcePath": "src/components/ui/input.tsx",
    "taxonomy": [
      "A native input element that automatically works with Base UI Field context (<Field.Root>).",
      "Implements Modern Web Guidance (MWG: html) tri-token contract for autocomplete, inputMode, enterKeyHint.",
      "Follows DESIGN.md Tier B interactive controls:",
      "0.5rem corner radius (rounded-lg) matching Buttons as the primary form control.",
      "Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary) for WCAG 2.4.13 contrast and Windows High Contrast Mode (forced-colors: active) compatibility.",
      "WCAG 2.2 SC 2.5.8 compliant hit target sizes: sm (44px), md (48px), lg (56px).",
      "For complex input layouts with toolbars, prefixes, suffixes, or multiple buttons, compose with <InputGroup> (@/components/ui/input-group)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/input"
  },
  {
    "id": "item",
    "name": "item",
    "title": "Item",
    "description": "Item layout primitive (Content Row / Media Object). Full API reference and feature parity with shadcn/ui Base Item specification: https://ui.shadcn.com/docs/components/base/item ANATOMY: ItemGroup └── Item ├── ItemHeader ├── ItemMedia ├── ItemContent │   ├── ItemTitle │   └── ItemDescription ├── ItemActions ├── ItemFooter └── ItemSeparator",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/item.tsx",
    "taxonomy": [
      "Use Item and ItemGroup for structured list rows, activity feeds, patient directories, notification trays, and settings rows.",
      "Composes [Media] + [Content (Title, Description)] + [Actions] without custom flex boilerplate.",
      "Directly eliminates the \"Card inside Card\" anti-pattern by providing a clean, non-elevated content row for lists inside cards and dialogs.",
      "Supports polymorphic composition via Base UI's `useRender` hook across ALL subcomponents.",
      "Follows DESIGN.md tokens: Lexend body/description font, Lexend label headers, floating 2px focus ring, and strict semantic tokens with zero artificial elevation on list rows."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/item"
  },
  {
    "id": "kbd",
    "name": "kbd",
    "title": "Kbd",
    "description": "Keyboard key primitive (Kbd). Aligned with shadcn/ui and Base UI ecosystem patterns: https://ui.shadcn.com/docs/components/base/kbd",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/kbd.tsx",
    "taxonomy": [
      "Use Kbd to visually represent keyboard keys, hotkeys, and shortcut combinations (e.g. ⌘K, Ctrl+B).",
      "Use KbdGroup to compose multiple keycaps together without line breaks.",
      "Ideal for embedding in buttons, command palettes, menus, and tooltips.",
      "Follows DESIGN.md tokens: Roboto Mono font (font-mono), surface-container wash, subtle outline-variant border, and strict semantic tokens."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/kbd"
  },
  {
    "id": "menu",
    "name": "menu",
    "title": "Menu",
    "description": "Eolas UI Menu component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/menu",
    "sourcePath": "src/components/ui/menu.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/menu"
  },
  {
    "id": "menubar",
    "name": "menubar",
    "title": "Menubar",
    "description": "Eolas UI Menubar component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/menubar",
    "sourcePath": "src/components/ui/menubar.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/menubar"
  },
  {
    "id": "message-scroller",
    "name": "message-scroller",
    "title": "Message Scroller",
    "description": "MessageScroller primitive suite. Base UI Integration: Consumes Base UI Button and Tooltip primitives. Specification & Reference: - https://ui.shadcn.com/docs/ai-elements/base/chat - https://ui.shadcn.com/docs/components/base/message-scroller",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/message-scroller.tsx",
    "taxonomy": [
      "The foundational viewport engine for conversational AI interfaces, live transcripts, and clinical chat.",
      "Handles smart auto-scrolling: follows incoming streamed tokens when the user is at the live edge, without hijacking the scroll position if the clinician scrolled up to review clinical history.",
      "Turn Anchoring (`scrollAnchor`): Pins new prompt turns near the top with `scrollPreviousItemPeek` visible.",
      "Jump-to-Latest Control: Smooth floating button to return to the live response edge with unread indicators.",
      "Preserves scroll position on historical message prepends (`preserveScrollOnPrepend`).",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.",
      "Strictly follows DESIGN.md tokens: floating 2px focus ring, semantic colors, zero triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/message-scroller"
  },
  {
    "id": "meter",
    "name": "meter",
    "title": "Meter",
    "description": "Meter primitive (@base-ui/react/meter).",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/meter",
    "sourcePath": "src/components/ui/meter.tsx",
    "taxonomy": [
      "Displays a graphical meter representing a scalar value within a known range (e.g. disk space, battery level, audio volume).",
      "For task progress towards completion, use Progress instead.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, semantic tokens, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/meter"
  },
  {
    "id": "model-selector",
    "name": "model-selector",
    "title": "Model Selector",
    "description": "ModelSelector primitive. Base UI Integration: Consumes Base UI Select and Tooltip primitives. Specification & Reference: https://ui.shadcn.com/docs/ai-elements/base/model-selector",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/model-selector.tsx",
    "taxonomy": [
      "Use ModelSelector in chat headers, sidebar toolbars, or prompt input footers to let users dynamically switch the active language model and adjust reasoning/thinking effort.",
      "Conforms to shadcn AI Elements ModelSelector specification and DESIGN.md:",
      "Compact, high-precision layout with 44x44px accessible touch bounds.",
      "Clear separation between consumer-provided model items and thinking depth controls.",
      "Concentric radius, floating 2px focus ring (`outline-offset: 2px`)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/model-selector"
  },
  {
    "id": "navigation-bar",
    "name": "navigation-bar",
    "title": "Navigation Bar",
    "description": "NavigationBar primitive (@base-ui/react/button + semantic `<nav>`).",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/navigation-bar.tsx",
    "taxonomy": [
      "High-frequency mobile bottom navigation bar (3 to 5 primary destinations).",
      "Placed at the bottom edge of mobile and compact viewports for ergonomic thumb reach.",
      "Conforms to DESIGN.md Tier B interactive controls:",
      "44x44px minimum touch target per destination (WCAG 2.2 SC 2.5.8).",
      "Active indicator: soft `bg-primary-container` pill wash with `text-on-primary-container` ink.",
      "Inactive items: `text-on-surface-variant` with hover lift to `text-on-surface`.",
      "Floating 2px focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`).",
      "Semantic navigation status: `aria-current=\"page\"` on the active destination.",
      "Explicit property transitions (never `transition-all`).",
      "Mandatory `prefers-reduced-motion: reduce` dampening."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/navigation-bar"
  },
  {
    "id": "navigation-menu",
    "name": "navigation-menu",
    "title": "Navigation Menu",
    "description": "Eolas UI Navigation Menu component built on Base UI and DESIGN.md design tokens.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/navigation-menu",
    "sourcePath": "src/components/ui/navigation-menu.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/navigation-menu"
  },
  {
    "id": "notification-badge",
    "name": "notification-badge",
    "title": "Notification Badge",
    "description": "Popping notification badge dot and pill based on transitions.dev (03-notification-badge.md).",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/notification-badge.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/notification-badge"
  },
  {
    "id": "number-field",
    "name": "number-field",
    "title": "Number Field",
    "description": "NumberField primitive (@base-ui/react/number-field).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/number-field",
    "sourcePath": "src/components/ui/number-field.tsx",
    "taxonomy": [
      "Use NumberField for numerical inputs with step buttons, keyboard scrubbing, wheel scrubbing, and localized formatting.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/number-field"
  },
  {
    "id": "number-pop-in",
    "name": "number-pop-in",
    "title": "Number Pop In",
    "description": "Digit pop-in animation primitive with spring overshoot and decimal stagger based on transitions.dev (02-number-pop-in.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/number-pop-in.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/number-pop-in"
  },
  {
    "id": "number-roll",
    "name": "number-roll",
    "title": "Number Roll",
    "description": "Tabular number transition primitive combining pop-in and spinning reels based on transitions.dev.",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/number-roll.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/number-roll"
  },
  {
    "id": "otp-field",
    "name": "otp-field",
    "title": "Otp Field",
    "description": "OTPField primitive (@base-ui/react/otp-field).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/otp-field",
    "sourcePath": "src/components/ui/otp-field.tsx",
    "taxonomy": [
      "Use OTPField for one-time passcode inputs, verification pins, and multi-digit authentication codes.",
      "Supports automatic focus advancement, paste distribution, character masking, and validation types.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px/48x48px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/otp-field"
  },
  {
    "id": "pagination",
    "name": "pagination",
    "title": "Pagination",
    "description": "Eolas UI Pagination component built on Base UI and DESIGN.md design tokens.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/pagination.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/pagination"
  },
  {
    "id": "plan",
    "name": "plan",
    "title": "Plan",
    "description": "Plan composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from `Trace` primitives (`src/components/ui/trace.tsx`) and `Progress` primitive (`src/components/ui/progress.tsx`). Specification & Reference: - https://ui.shadcn.com/docs/ai-elements - https://ui.shadcn.com/docs/ai-elements/plan",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/plan.tsx",
    "taxonomy": [
      "Displays an AI agent's multi-step plan determined up-front before execution (e.g., a 4-stage minimal pair therapy drill, clinical phonological assessment plan).",
      "Tracks progress with a progress bar and completion counter (e.g. \"2 of 4 done\"). <Plan title=\"...\" steps={[...]} /> and declarative compound composition: <Plan defaultOpen> <PlanHeader> <PlanTitle>Assessment Plan</PlanTitle> <PlanDescription>2 of 4 done</PlanDescription> <PlanTrigger /> </PlanHeader> <PlanContent>...</PlanContent> </Plan>",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/plan"
  },
  {
    "id": "popover",
    "name": "popover",
    "title": "Popover",
    "description": "Eolas UI Popover component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/popover",
    "sourcePath": "src/components/ui/popover.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/popover"
  },
  {
    "id": "preview-card",
    "name": "preview-card",
    "title": "Preview Card",
    "description": "Eolas UI Preview Card component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/preview-card",
    "sourcePath": "src/components/ui/preview-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/preview-card"
  },
  {
    "id": "progress-ring",
    "name": "progress-ring",
    "title": "Progress Ring",
    "description": "ProgressRing primitive (@base-ui/react/progress).",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/progress",
    "sourcePath": "src/components/ui/progress-ring.tsx",
    "taxonomy": [
      "A circular progress indicator built on Base UI's headless Progress state machine.",
      "Manages accessibility roles (role=\"progressbar\", aria-valuenow, aria-valuemin, aria-valuemax) and internationalized number formatting headlessly.",
      "Renders a hardware-accelerated SVG conic ring with concentric stroke geometry.",
      "Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/progress-ring"
  },
  {
    "id": "progress",
    "name": "progress",
    "title": "Progress",
    "description": "Progress primitive (@base-ui/react/progress).",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/progress",
    "sourcePath": "src/components/ui/progress.tsx",
    "taxonomy": [
      "Displays the completion status of a task or process.",
      "Supports determinate values as well as indeterminate loading state (value=null/undefined).",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, semantic tokens, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/progress"
  },
  {
    "id": "prompt-input",
    "name": "prompt-input",
    "title": "Prompt Input",
    "description": "PromptInput primitive. Base UI Integration: Consumes Base UI Button, Textarea primitive, Menu primitive, and Tooltip primitive. Conforms to shadcn AI Elements specification: https://ui.shadcn.com/docs/ai-elements/base/prompt-input",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/prompt-input.tsx",
    "taxonomy": [
      "Use PromptInput for conversational AI prompts, multi-turn clinical query inputs, and structured message composition.",
      "Supports Model Selection (PromptInputModelSelect) and Reasoning Effort (PromptInputEffort) in the bottom-left action bar, alongside file attachments and tool toggles.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring on the outer container, auto-growing height via modern CSS `field-sizing: content`, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets.",
      "Strictly avoids double-border / double-focus artifacts by delegating focus styles exclusively to PromptInput.Root.",
      "Supports Enter to submit and Shift+Enter for newline insertion."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/prompt-input"
  },
  {
    "id": "queue",
    "name": "queue",
    "title": "Queue",
    "description": "Queue composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from `Trace` primitives (`src/components/ui/trace.tsx`). Specification & Reference: - https://ui.shadcn.com/docs/ai-elements - https://ui.shadcn.com/docs/ai-elements/queue",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/queue.tsx",
    "taxonomy": [
      "Displays an AI agent's dynamic queue / to-do list, cleanly partitioned into remaining tasks ('To do') and finished tasks ('Completed').",
      "As the agent works, tasks transition across sections. <Queue items={[...]} /> and declarative compound composition: <Queue> <Queue.Section title=\"2 to do\" status=\"pending\"> <Queue.Item title=\"Task 1\" status=\"pending\" /> </Queue.Section> </Queue>",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/queue"
  },
  {
    "id": "radio",
    "name": "radio",
    "title": "Radio",
    "description": "Radio & RadioGroup primitives (@base-ui/react/radio, @base-ui/react/radio-group).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/radio",
    "sourcePath": "src/components/ui/radio.tsx",
    "taxonomy": [
      "Use RadioGroup for selecting a single option from a visible list of 2-7 mutually exclusive choices.",
      "Supports roving tabindex arrow key navigation.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, flush primary indicator, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/radio"
  },
  {
    "id": "reading-progress",
    "name": "reading-progress",
    "title": "Reading Progress",
    "description": "ReadingProgress primitive (@base-ui/react/progress). Platform Reference: Modern Web Guidance (MWG: scrollytelling / scroll-driven animations)",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/progress",
    "sourcePath": "src/components/ui/reading-progress.tsx",
    "taxonomy": [
      "Pinned reading/scroll progress indicator built on Base UI's headless Progress state machine.",
      "Manages accessibility roles (role=\"progressbar\", aria-valuenow, aria-valuemin, aria-valuemax) headlessly.",
      "Uses compositor-driven CSS scroll-driven animations (animation-timeline: scroll()) on supported browsers with an automatic, lightweight requestAnimationFrame scroll listener fallback for Safari and Firefox.",
      "Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/reading-progress"
  },
  {
    "id": "reasoning",
    "name": "reasoning",
    "title": "Reasoning",
    "description": "Reasoning primitive. Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite. Specification & Reference: - https://ui.shadcn.com/docs/ai-elements - https://ui.shadcn.com/docs/ai-elements/reasoning",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/reasoning.tsx",
    "taxonomy": [
      "Displays an AI agent's live or historical thinking process as it streams or settles.",
      "Supports both declarative compound composition: <Reasoning isStreaming={isStreaming}> <ReasoningTrigger /> <ReasoningContent>{reasoningText}</ReasoningContent> </Reasoning> and shorthand invocation: <Reasoning duration=\"1.8s\">{reasoningText}</Reasoning>",
      "Manages the dynamic transition:",
      "While streaming: active spinning indicator, \"Thinking...\", auto-expanded to show thought stream.",
      "When complete: psychology icon, \"Thought\", formatted elapsed duration badge, auto-collapsed.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on disclosure triggers.",
      "Follows DESIGN.md tokens: floating 2px focus ring, semantic colors, and zero triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/reasoning"
  },
  {
    "id": "resizable",
    "name": "resizable",
    "title": "Resizable",
    "description": "Resizable component primitive built on react-resizable-panels. React Resizable Panels Documentation: https://github.com/bvaughn/react-resizable-panels",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/resizable.tsx",
    "taxonomy": [
      "Provides accessible, draggable multi-pane layouts (split views, sidebars, inspection panels).",
      "Supports keyboard navigation (Arrow keys, Home, End), touch targets, and min/max constraints.",
      "Follows DESIGN.md Tier B tokens: hairline 1px track (outline-variant), 12px touch-safe hit area, refined capsule pill drag handle (rounded-full, bg-surface, primary hover/active feedback), and floating 2px focus ring."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "react-resizable-panels"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/resizable"
  },
  {
    "id": "scroll-area",
    "name": "scroll-area",
    "title": "Scroll Area",
    "description": "ScrollArea primitive (@base-ui/react/scroll-area).",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/scroll-area",
    "sourcePath": "src/components/ui/scroll-area.tsx",
    "taxonomy": [
      "Augments native browser scrolling with custom-styled, accessible scrollbars.",
      "Supports vertical, horizontal, or dual-axis scrolling with overflow fade masks.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/scroll-area"
  },
  {
    "id": "scrollspy",
    "name": "scrollspy",
    "title": "Scrollspy",
    "description": "Scrollspy primitive. Platform Reference: Modern Web Guidance (MWG: scrollspy)",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/scrollspy.tsx",
    "taxonomy": [
      "In-page table of contents and section navigation primitive.",
      "Synchronizes active reading position in navigation links with visible page sections.",
      "Uses compositor-driven `scroll-target-group: auto` (Chrome/Edge 140+) with an accessible `IntersectionObserver` fallback for Safari and Firefox.",
      "Sets explicit `aria-current=\"true\"` on the active link for screen reader synchronicity.",
      "Adheres to WCAG 2.2 SC 2.5.8 (44x44px minimum touch targets) and WCAG 1.4.1 (non-color active cues).",
      "Complies with DESIGN.md and anti-patterns.md: symmetrical rounded-md geometry without asymmetric single-sided card borders."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/scrollspy"
  },
  {
    "id": "select",
    "name": "select",
    "title": "Select",
    "description": "Eolas UI Select component built on Base UI and DESIGN.md design tokens.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/select",
    "sourcePath": "src/components/ui/select.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/select"
  },
  {
    "id": "selection-controls",
    "name": "selection-controls",
    "title": "Selection Controls",
    "description": "Re-exports selection control primitives for backward compatibility. Dedicated modular files exist at: - @/components/ui/checkbox - @/components/ui/checkbox-group - @/components/ui/radio - @/components/ui/switch",
    "category": "inputs",
    "tier": "utility",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/selection-controls.tsx",
    "isDeprecated": true,
    "deprecatedNote": "Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/checkbox, radio, switch.",
    "replacedBy": "checkbox, radio, switch",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/selection-controls"
  },
  {
    "id": "separator",
    "name": "separator",
    "title": "Separator",
    "description": "Separator primitive (@base-ui/react/separator).",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/separator",
    "sourcePath": "src/components/ui/separator.tsx",
    "taxonomy": [
      "A visual or semantic separator between sections of content.",
      "Supports horizontal and vertical orientations with accessible role/aria-hidden attributes.",
      "Follows DESIGN.md Tier B tokens: border-outline-variant."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/separator"
  },
  {
    "id": "shimmer-text",
    "name": "shimmer-text",
    "title": "Shimmer Text",
    "description": "Continuous sweeping highlight text shimmer based on transitions.dev (15-shimmer-text.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/shimmer-text.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/shimmer-text"
  },
  {
    "id": "sidebar",
    "name": "sidebar",
    "title": "Sidebar",
    "description": "Sidebar primitive (@base-ui/react/drawer + Base UI compound architecture). Shadcn UI Reference: https://ui.shadcn.com/docs/components/base/sidebar",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/drawer",
    "sourcePath": "src/components/ui/sidebar.tsx",
    "taxonomy": [
      "Composable, mobile-responsive application navigation shell and collapsible rail.",
      "On desktop viewports (>= md), renders a stationary or collapsible `<aside>` navigation bar (supporting icon-rail, off-canvas, floating, and inset variants).",
      "On mobile/tablet viewports (< md), automatically delegates to a touch-friendly Base UI modal Drawer with swipe dismissal and backdrop blur.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant touch targets (min 44x44px), and calibrated motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/sidebar"
  },
  {
    "id": "skeleton",
    "name": "skeleton",
    "title": "Skeleton",
    "description": "Eolas UI Skeleton component built on Base UI and DESIGN.md design tokens.",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/skeleton.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/skeleton"
  },
  {
    "id": "slider",
    "name": "slider",
    "title": "Slider",
    "description": "Slider primitive (@base-ui/react/slider).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/slider",
    "sourcePath": "src/components/ui/slider.tsx",
    "taxonomy": [
      "Allows users to make selections from a range of values along a horizontal or vertical track.",
      "Supports single-value or multi-thumb range selections with collision behaviors ('push', 'swap', 'none').",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/slider"
  },
  {
    "id": "sources",
    "name": "sources",
    "title": "Sources",
    "description": "Sources primitive. Base UI Integration: Works with Base UI Collapsible and Tooltip primitives. Conforms to shadcn AI Elements specification: https://ui.shadcn.com/docs/ai-elements/base/sources",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/collapsible",
    "sourcePath": "src/components/ui/sources.tsx",
    "taxonomy": [
      "Use Sources to render grounded clinical citations, evidence base references, and trial literature.",
      "Follows DESIGN.md:",
      "Pattern 2 chip styling (neutral surface fill, outline-variant border, high-contrast text).",
      "Never uses triple-tint monochrome styling.",
      "Prevents Overcontainment & Card-within-card: supports `variant=\"ghost\"` for clean, unbordered display within chat message bubbles, preventing \"pill rain\" or nested boxes.",
      "Never uses hand-rolled native browser tooltips (`title` attribute); all citations and inline footnote markers consume the Base UI Tooltip primitive for full keyboard and touch accessibility.",
      "All clickable citations maintain WCAG 2.2 SC 2.5.8 compliant 44px touch targets.",
      "Floating focus rings on links and triggers."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/sources"
  },
  {
    "id": "spinner",
    "name": "spinner",
    "title": "Spinner",
    "description": "Spinner primitive. Base UI Integration: Companion status & loading indicator. Specification & Reference: https://ui.shadcn.com/docs/components/base/spinner",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/spinner.tsx",
    "taxonomy": [
      "Lightweight, accessible loading indicator showing asynchronous operations.",
      "Suitable for standalone loading states, form submission feedback, and inline button indicators.",
      "Accessible: renders role=\"status\" and aria-label=\"Loading\", with motion-reduce:animate-none for vestibular safety.",
      "Automatically inherits currentColor for flawless integration across buttons, badges, and text."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/spinner"
  },
  {
    "id": "spinning-counter",
    "name": "spinning-counter",
    "title": "Spinning Counter",
    "description": "Slot-machine vertical reel roll counter with soft edge masks based on transitions.dev (26-spinning-counter.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/spinning-counter.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/spinning-counter"
  },
  {
    "id": "steppers",
    "name": "steppers",
    "title": "Steppers",
    "description": "Backward-compatibility alias for NumberField. Canonical primitive resides at @/components/ui/number-field. For OTP Passcode input, import directly from @/components/ui/otp-field.",
    "category": "navigation",
    "tier": "utility",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/steppers.tsx",
    "isDeprecated": true,
    "deprecatedNote": "Legacy re-export barrel. Prefer importing canonical primitive: @/components/ui/number-field.",
    "replacedBy": "number-field",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/steppers"
  },
  {
    "id": "sticky-container",
    "name": "sticky-container",
    "title": "Sticky Container",
    "description": "StickyContainer primitive. Platform Reference: Modern Web Guidance (MWG: state-aware-sticky-headers)",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/sticky-container.tsx",
    "taxonomy": [
      "A state-aware sticky header and toolbar container.",
      "Dynamically elevates (gains ambient box-shadow, surface wash, and border) when stuck to the viewport edge.",
      "Uses compositor-driven CSS Container Scroll-State queries (`container-type: scroll-state`) with zero main-thread scroll listeners in Chrome 133+ and Edge 133+.",
      "Features an accessible zero-height sentinel and IntersectionObserver fallback for Safari and Firefox.",
      "Prevents layout-shift oscillations by strictly constraining state transitions to non-layout-shifting properties (background-color, border-color, box-shadow, and backdrop-blur)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/sticky-container"
  },
  {
    "id": "success-check",
    "name": "success-check",
    "title": "Success Check",
    "description": "Five-layer success checkmark animation based on transitions.dev (10-success-check.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/success-check.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/success-check"
  },
  {
    "id": "suggestion-chips",
    "name": "suggestion-chips",
    "title": "Suggestion Chips",
    "description": "SuggestionChips primitive. Base UI Integration: Uses Base UI Button foundation.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/suggestion-chips.tsx",
    "taxonomy": [
      "Use SuggestionChips to surface starter queries, recommended clinical questions, and protocol exploration prompts.",
      "Follows DESIGN.md:",
      "Pattern 2 chip styling (neutral surface fill, outline-variant border, hover secondary-container/40).",
      "Never uses triple-tint monochrome styling.",
      "WCAG 2.2 SC 2.5.8 compliant 44px minimum touch target.",
      "Floating 2px focus ring with 2px offset.",
      "Strictly adheres to the 5-item stagger cap if animated."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/suggestion-chips"
  },
  {
    "id": "swipe-reveal",
    "name": "swipe-reveal",
    "title": "Swipe Reveal",
    "description": "SwipeReveal primitive. Platform Reference: Modern Web Guidance (MWG: swipe-to-reveal)",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "platformReference": "https://developer.chrome.com",
    "sourcePath": "src/components/ui/swipe-reveal.tsx",
    "taxonomy": [
      "A compositor-driven swipe-to-reveal action row built on CSS scroll-snap and `overscroll-behavior: chain`.",
      "Avoids main-thread pointermove/touchmove JS listener bottlenecks for sub-50ms INP responsiveness.",
      "Handles keyboard focus gracefully by snapping content back when tabbing with :focus-visible.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, 44px minimum hit-targets, and floating 2px focus rings."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/swipe-reveal"
  },
  {
    "id": "switch",
    "name": "switch",
    "title": "Switch",
    "description": "Switch primitive (@base-ui/react/switch).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/switch",
    "sourcePath": "src/components/ui/switch.tsx",
    "taxonomy": [
      "Use Switch for standalone binary settings that take effect immediately (e.g. Dark Mode, Notifications).",
      "Do NOT use Switch for in-group option selections (use Checkbox or ToggleGroup instead).",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, flush primary track fill, smooth thumb sliding, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/switch"
  },
  {
    "id": "table",
    "name": "table",
    "title": "Table",
    "description": "Table primitive. Platform Reference: - Modern Web Guidance (MWG: responsive-table) - Shadcn UI Table: https://ui.shadcn.com/docs/components/base/table",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/table.tsx",
    "taxonomy": [
      "Dual-mode data table primitive supporting: 1. Atomic compound composition (<Table>, <Table.Header>, <Table.Body>, <Table.Row>, <Table.Head>, <Table.Cell>, <Table.Footer>, <Table.Caption>). 2. Declarative data-driven mode (<Table columns={...} data={...} keyExtractor={...} responsive=\"stack\" />) with automatic container-query card stacking (@container).",
      "Implements explicit column header semantics (scope=\"col\"), 56px minimum row heights for OS text zoom adaptability, and automatic tabular-nums on numeric columns.",
      "Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/table"
  },
  {
    "id": "tabs",
    "name": "tabs",
    "title": "Tabs",
    "description": "Tabs primitive (@base-ui/react/tabs).",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/tabs",
    "sourcePath": "src/components/ui/tabs.tsx",
    "taxonomy": [
      "Use Tabs for switching between mutually exclusive views/panels within the SAME page or context (role=\"tablist\", role=\"tab\", role=\"tabpanel\").",
      "Do NOT use Tabs for site-wide navigation or URL page routing (use NavigationMenu or standard link anchors `<nav>` instead).",
      "Do NOT use Tabs for state/mode option toggles that don't switch separate DOM content panels (use ToggleGroup instead).",
      "Segmented container uses `rounded` (0.5rem / 8px) and segmented tabs use `rounded-sm` (0.25rem / 4px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).",
      "Line tabs use `rounded-t-sm` (0.25rem / 4px) with bottom underline or floating active indicator.",
      "Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive tabs."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/tabs"
  },
  {
    "id": "task",
    "name": "task",
    "title": "Task",
    "description": "Task primitive. Base UI Integration: Composed strictly on top of Base UI `Trace` primitive suite. Specification & Reference: - https://ui.shadcn.com/docs/ai-elements - https://ui.shadcn.com/docs/ai-elements/task",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/task.tsx",
    "taxonomy": [
      "Displays dynamic steps an AI agent takes sequentially as it executes work (e.g., reading files, running queries, making edits).",
      "Unlike `Plan` (which renders predetermined future steps), `Task` visualizes real-time execution where each new step is discovered as previous ones finish.",
      "Exports: Task, TaskTrigger, TaskContent, TaskItem.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on interactive elements.",
      "Follows DESIGN.md tokens: floating 2px focus ring, semantic tokens, zero triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/task"
  },
  {
    "id": "text-highlight",
    "name": "text-highlight",
    "title": "Text Highlight",
    "description": "TextHighlight primitive. Platform Reference: Modern Web Guidance (MWG: highlight-text-ranges)",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/text-highlight.tsx",
    "taxonomy": [
      "A declarative text-search and keyword highlight container powered by the CSS Custom Highlight API (`::highlight()`).",
      "Highlights search matches on the GPU compositor without mutating the DOM tree, splitting strings, or fragmenting screen reader announcements.",
      "Adheres to WCAG 4.1.3 (Status Messages) by synchronizing visual highlights with an `aria-live=\"polite\"` screen reader match announcer.",
      "Styles matches using tokenized secondary container palette in globals.css: `::highlight(search-results) { background-color: var(--secondary-container); color: var(--on-secondary-container); }`"
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/text-highlight"
  },
  {
    "id": "text-swap",
    "name": "text-swap",
    "title": "Text Swap",
    "description": "Text state swap with directional slide and micro-blur based on transitions.dev (04-text-states-swap.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/text-swap.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/text-swap"
  },
  {
    "id": "textarea",
    "name": "textarea",
    "title": "Textarea",
    "description": "Textarea primitive. Base UI Integration: Works seamlessly with Base UI Field context (<Field.Control> or <Field>).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/textarea.tsx",
    "taxonomy": [
      "Use Textarea for multi-line freeform text input and notes.",
      "Supports modern CSS `field-sizing: content` via `autoGrow` prop for zero-layout-shift auto-expansion.",
      "Follows DESIGN.md Tier B interactive controls:",
      "0.5rem corner radius (rounded-lg) matching Button and Input as primary form controls.",
      "Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary).",
      "WCAG 2.2 SC 2.5.8 touch target compliance.",
      "For complex multi-line prompt composers with attachment toolbars, compose with <InputGroup> (@/components/ui/input-group) or <PromptInput> (@/components/ui/prompt-input)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/textarea"
  },
  {
    "id": "texts-reveal",
    "name": "texts-reveal",
    "title": "Texts Reveal",
    "description": "Staggered text reveal with decoupled quiet fade exit based on transitions.dev (18-texts-reveal.md).",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/texts-reveal.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/texts-reveal"
  },
  {
    "id": "thinking-orb",
    "name": "thinking-orb",
    "title": "Thinking Orb",
    "description": "Eolas UI Thinking Orb component built on Base UI and DESIGN.md design tokens.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/thinking-orb.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "thinking-orbs"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/thinking-orb"
  },
  {
    "id": "toast",
    "name": "toast",
    "title": "Toast",
    "description": "Eolas UI Toast component built on Base UI and DESIGN.md design tokens.",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toast",
    "sourcePath": "src/components/ui/toast.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/toast"
  },
  {
    "id": "toggle-group",
    "name": "toggle-group",
    "title": "Toggle Group",
    "description": "ToggleGroup primitive (@base-ui/react/toggle-group).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toggle-group",
    "sourcePath": "src/components/ui/toggle-group.tsx",
    "taxonomy": [
      "Use ToggleGroup for mutually exclusive or multi-select option switches (e.g. text align, view mode grid/list, filter tags) where selection updates state/data in-place without switching or hiding full views or panels.",
      "Do NOT use ToggleGroup for switching tabs/panels (use Tabs instead, role=\"tablist\").",
      "Do NOT use ToggleGroup for persistent command action bars (use Toolbar instead, role=\"toolbar\").",
      "Inner items use `rounded-sm` (0.25rem / 4px) and outer container uses `rounded` (0.5rem / 8px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).",
      "Outer track uses `bg-surface-container` with `border-outline-variant`. Pressed items adapt by mode: single-select uses `bg-surface text-on-surface border-outline`, multi-select uses `bg-primary-container text-on-primary-container border-primary`.",
      "Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive items."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/toggle-group"
  },
  {
    "id": "toggle",
    "name": "toggle",
    "title": "Toggle",
    "description": "Toggle primitive (@base-ui/react/toggle).",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toggle",
    "sourcePath": "src/components/ui/toggle.tsx",
    "taxonomy": [
      "Use Toggle for standalone two-state buttons (e.g. Star, Bookmark, Pin, Mute) using `aria-pressed`.",
      "For groups of mutually exclusive or multi-select toggles, use ToggleGroup instead.",
      "For form on/off switches that submit form values, use Switch instead.",
      "Follows DESIGN.md Tier B interactive controls: floating 2px focus ring, 2px `outline` resting border -> 2px `primary` border + `primary-container` pressed state, zero box-shadow, and WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/toggle"
  },
  {
    "id": "toggles",
    "name": "toggles",
    "title": "Toggles",
    "description": "Re-exports toggle primitives for backward compatibility. Dedicated modular files exist at: - @/components/ui/toggle - @/components/ui/toggle-group",
    "category": "inputs",
    "tier": "utility",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/toggles.tsx",
    "isDeprecated": true,
    "deprecatedNote": "Legacy re-export barrel. Prefer importing individual primitives: @/components/ui/toggle, toggle-group.",
    "replacedBy": "toggle, toggle-group",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/toggles"
  },
  {
    "id": "tool",
    "name": "tool",
    "title": "Tool",
    "description": "Tool primitive (ToolCall). Base UI Integration: Consumes Base UI Collapsible primitive, Button primitive, and Icon primitive.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/collapsible",
    "sourcePath": "src/components/ui/tool.tsx",
    "taxonomy": [
      "Use Tool to represent an agent tool invocation from input parameters to returned output, supporting live execution states ('calling', 'complete', 'error').",
      "Conforms to shadcn AI Elements Tool specification and DESIGN.md:",
      "High-contrast visual hierarchy with calm neutral container fill.",
      "Monospace font for tool function names and JSON argument inspection.",
      "Accessible Collapsible disclosure with rotation chevron and keyboard navigation.",
      "Integrates seamlessly with CodeBlock for syntax-highlighted parameters."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/tool"
  },
  {
    "id": "toolbar",
    "name": "toolbar",
    "title": "Toolbar",
    "description": "Toolbar primitive (@base-ui/react/toolbar). WAI-ARIA Role: role=\"toolbar\" Primary Purpose: Group of controls navigable with arrow keys under a SINGLE tab stop.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toolbar",
    "sourcePath": "src/components/ui/toolbar.tsx",
    "taxonomy": [
      "USE THIS: In rich-text formatting strips, media audio/playback bars, or canvas editing palettes where controls remain permanently visible and interactive under roving keyboard focus.",
      "DO NOT USE:",
      "For hierarchical application command menus (File, Edit, View) -> Use <Menubar>.",
      "For site navigation links -> Use <NavigationMenu>.",
      "For standalone action dropdowns -> Use <Menu>.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/toolbar"
  },
  {
    "id": "tooltip",
    "name": "tooltip",
    "title": "Tooltip",
    "description": "Eolas UI Tooltip component built on Base UI and DESIGN.md design tokens.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/tooltip",
    "sourcePath": "src/components/ui/tooltip.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/tooltip"
  },
  {
    "id": "trace",
    "name": "trace",
    "title": "Trace",
    "description": "Trace primitive suite. Base UI Integration: Consumes `@base-ui/react/collapsible` for headless accessible disclosures. Specification & Reference: - https://ui.shadcn.com/docs/components/base/trace - https://ui.shadcn.com/docs/ai-elements",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/collapsible",
    "sourcePath": "src/components/ui/trace.tsx",
    "taxonomy": [
      "Universal primitive for AI agent execution lifecycle: step-by-step reasoning, tool calls, multi-stage task plans, error stack traces, and agent activity logs.",
      "Replaces monolithic steppers with a flexible, composable compound architecture.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.",
      "Strictly follows DESIGN.md tokens: floating 2px focus ring (outline-offset: 2px), concentric radius, and semantic high-contrast colors without monochrome triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/trace"
  },
  {
    "id": "view-transition",
    "name": "view-transition",
    "title": "View Transition",
    "description": "ViewTransition primitive (@base-ui/react/button). Platform Reference: Modern Web Guidance (MWG: same-document-transitions)",
    "category": "motion",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "platformReference": "https://developer.chrome.com/docs/web-platform/view-transitions",
    "sourcePath": "src/components/ui/view-transition.tsx",
    "taxonomy": [
      "Declarative container and trigger components for the View Transitions API (document.startViewTransition).",
      "Enables smooth, GPU-accelerated morphing between states (thumbnail to hero, tab switches, list expansions).",
      "Degrades gracefully on unsupported browsers (feature-detected) by running the state update immediately without errors.",
      "Bypasses the animation under prefers-reduced-motion and offers opt-in focus routing (focusTarget) to prevent screen reader disorientation.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, 44px minimum hit targets, and floating 2px focus ring."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/view-transition"
  },
  {
    "id": "app-shell",
    "name": "app-shell",
    "title": "App Shell",
    "description": "AppShell composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from primitives and design tokens: - `Sidebar` compound primitives (`Sidebar.Provider`, `Sidebar.Header`, `Sidebar.Content`, `Sidebar.Footer`, `Sidebar.Trigger`, `Sidebar.Rail`, `Sidebar.Inset`, `Sidebar.Menu`, `Sidebar.MenuItem`, `Sidebar.MenuButton`, `Sidebar.MenuBadge`) (`src/components/ui/sidebar.tsx`) - `NavigationBar`, `NavigationBar.Item` (`src/components/ui/navigation-bar.tsx`) - `Icon` (`src/components/ui/icon.tsx`)",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/app-shell.tsx",
    "taxonomy": [
      "Coordinated application layout shell managing navigation across breakpoints and height classes.",
      "Morphing Navigation Pipeline:",
      "Mobile (<640px): Thumb-accessible Bottom Navigation Bar + compact top bar.",
      "Tablet / Foldable (640px–1023px): Automatic icon-rail sidebar (56px) preserving reading width; bottom bar hidden.",
      "Desktop (1024px+): Full persistent sidebar (256px) with expandable groups and actions.",
      "Compact Height (`short:` / `<480px`): Top bar compresses to 56px (h-14); bottom bar hides to preserve vertical canvas.",
      "Zero direct `<button>` tags outside primitives."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/app-shell"
  },
  {
    "id": "approval-card",
    "name": "approval-card",
    "title": "Approval Card",
    "description": "Eolas UI Approval Card component built on Base UI and DESIGN.md design tokens.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/approval-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/approval-card"
  },
  {
    "id": "area-chart-card",
    "name": "area-chart-card",
    "title": "Area Chart Card",
    "description": "AreaChartCard block. Controlled presentational card for volume trends and intake velocity over time. Composes Card, Badge, Icon, and Chart primitives with smooth gradient fills and accessible tooltips.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/area-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/area-chart-card"
  },
  {
    "id": "bar-chart-card",
    "name": "bar-chart-card",
    "title": "Bar Chart Card",
    "description": "BarChartCard block. Controlled presentational card for categorical throughput, comparative performance, and multi-metric distribution. Composes Card, Badge, Icon, and Chart primitives with rounded bars, accessible tooltips, and legends.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/bar-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/bar-chart-card"
  },
  {
    "id": "chat",
    "name": "chat",
    "title": "Chat",
    "description": "Chat composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from primitives: - `MessageScroller` (`src/components/ui/message-scroller.tsx`) - `ChatMessage` (`src/components/ui/chat-message.tsx`) - `PromptInput` (`src/components/ui/prompt-input.tsx`) - `SuggestionChips` (`src/components/ui/suggestion-chips.tsx`) - `EmptyState` (`src/components/ui/empty-state.tsx`) Specification & Reference: - https://ui.shadcn.com/docs/ai-elements/base/chat - https://ui.shadcn.com/docs/ai-elements/base/prompt-input",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/chat.tsx",
    "taxonomy": [
      "Controlled presentational chat workspace assembling the streaming viewport engine, assistant/user messages, suggestion prompts, and message composer.",
      "Supports both Docked (pinned bottom) and Floating Island (centered, floating) prompt positioning.",
      "Supports Model Selection, Reasoning Effort, and Tool Toggles.",
      "Pure UI: receives items via props, emits intents via callbacks. Zero direct fetch or auth.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive elements.",
      "Strictly follows DESIGN.md tokens: floating 2px focus ring, semantic high-contrast colors, concentric radius, zero triple-tints."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/chat"
  },
  {
    "id": "data-table",
    "name": "data-table",
    "title": "Data Table",
    "description": "DataTable composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from Base UI primitives, TanStack Table, and design tokens: - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (`src/components/ui/table.tsx`) - `Button` (`src/components/ui/button.tsx`) - `Input` (`src/components/ui/input.tsx`) - `Select` (`src/components/ui/select.tsx`) - `Menu` (`src/components/ui/menu.tsx`) - `Checkbox` (`src/components/ui/checkbox.tsx`) - `Badge` (`src/components/ui/badge.tsx`) - `Icon` (`src/components/ui/icon.tsx`) - `@tanstack/react-table`",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/data-table.tsx",
    "taxonomy": [
      "Enterprise-grade, accessible data table composite block conforming to shadcn/ui Data Table specification.",
      "Powers complex data exploration with column sorting, global & column text filtering, faceted category filtering, row selection, dynamic column visibility toggling, loading/empty states, and accessible pagination.",
      "Conforms to DESIGN.md Table rules: 56px minimum row height, right-aligned numeric columns with tabular-nums and font-mono, concentric geometry, floating focus rings, and container-query responsiveness (@container).",
      "Exports both all-in-one <DataTable /> and composable subcomponents: DataTableColumnHeader, DataTablePagination, DataTableViewOptions, DataTableFacetedFilter, DataTableToolbar, DataTableRowActions, createSelectColumn, createActionsColumn."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "@tanstack/react-table"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/data-table"
  },
  {
    "id": "delete-confirmation-dialog",
    "name": "delete-confirmation-dialog",
    "title": "Delete Confirmation Dialog",
    "description": "DeleteConfirmationDialog block. Presentational composite modal for destructive confirmation workflows. Composes Dialog and Button primitives with WCAG 2.2 AA accessible focus trapping, 44px minimum touch targets, and high-contrast error styling.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/delete-confirmation-dialog.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/delete-confirmation-dialog"
  },
  {
    "id": "filter-toolbar",
    "name": "filter-toolbar",
    "title": "Filter Toolbar",
    "description": "FilterToolbar block. Controlled composite toolbar for data tables, caseload lists, and exercise libraries. Composes Input, Select, Button, and Chip primitives with responsive container queries (@container), 44px minimum touch targets, and accessible filter clearing.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/filter-toolbar.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/filter-toolbar"
  },
  {
    "id": "line-chart-card",
    "name": "line-chart-card",
    "title": "Line Chart Card",
    "description": "LineChartCard block. Controlled presentational card for multi-series trajectories, baseline targets, and historical benchmark tracking. Composes Card, Badge, Icon, and Chart primitives with high-contrast lines, accessible tooltips, and legends.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/line-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/line-chart-card"
  },
  {
    "id": "list-detail-block",
    "name": "list-detail-block",
    "title": "List Detail Block",
    "description": "ListDetailBlock composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from primitives and design tokens: - `Button` (`src/components/ui/button.tsx`) - `Field` (`Field.Root`, `Field.Label`) (`src/components/ui/field.tsx`) - `InputGroup` (`InputGroup.Addon`, `InputGroup.Input`, `InputGroup.Button`) (`src/components/ui/input-group.tsx`) - `Item` (`Item.Group`, `Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`, `Item.Actions`) (`src/components/ui/item.tsx`) - `Badge` (`src/components/ui/badge.tsx`) - `Icon` (`src/components/ui/icon.tsx`) - `Empty` (`src/components/ui/empty.tsx`)",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/list-detail-block.tsx",
    "taxonomy": [
      "Canonical master-detail multi-pane block for data-dense workflows (caseload, exercises, session notes).",
      "Implements responsive container queries (`@container`):",
      "On large containers (`@2xl:` / `>=672px`): Side-by-side two-pane split with selectable list and detail view.",
      "On compact containers (`<672px`): Stack navigation. Renders list full-width; pushes detail view with an accessible back button when an item is selected.",
      "Active selection: 2px flush primary border + primary-container wash (`Item variant=\"selected\"`).",
      "Touch targets: All list items maintain >=56px height (`Item size=\"lg\"`, WCAG 2.2 SC 2.5.8).",
      "Accessible keyboard navigation: Listbox roving focus via ArrowDown / ArrowUp / Home / End, selection via Enter / Space / click, and Escape to return on compact views.",
      "Zero direct `<button>` or `<input>` tags outside primitives."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/list-detail-block"
  },
  {
    "id": "metric-card",
    "name": "metric-card",
    "title": "Metric Card",
    "description": "MetricCard block. Presentational metric card for clinical analytics, caseload overviews, and progress monitoring. Composes Card, Badge, and Icon primitives with tabular numbers, ambient elevation, and high-contrast clinical status tokens.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/metric-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/metric-card"
  },
  {
    "id": "pie-chart-card",
    "name": "pie-chart-card",
    "title": "Pie Chart Card",
    "description": "PieChartCard block. Controlled presentational card for category distributions, status proportions, and caseload composition breakdowns. Composes Card, Chart, and Legend primitives with a centered aggregate KPI and accessible tooltips.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/pie-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/pie-chart-card"
  },
  {
    "id": "questionnaire",
    "name": "questionnaire",
    "title": "Questionnaire",
    "description": "Questionnaire composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from Base UI primitives and design tokens: - `Button` (`src/components/ui/button.tsx`) - `Input` (`src/components/ui/input.tsx`) - `Progress` (`src/components/ui/progress.tsx`) - `Icon` (`src/components/ui/icon.tsx`) - `Kbd` (`src/components/ui/kbd.tsx`)",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/questionnaire.tsx",
    "taxonomy": [
      "Multi-step guided question primitive and flow engine for intake forms, assessments, onboarding sequences, configuration wizards, and conversational agent clarification prompts.",
      "Follows the shadcn/ui Questionnaire part structure and API: Root, Progress, Item, Title, Description, Choices, Choice, ChoiceInput, ChoiceLabel, ChoiceShortcut, Input, Error, Actions, Previous, Skip, Next, and Submit. Items take `multiple` (the legacy `type=\"multiple\"` still works) and answers serialize to FormData with one repeated entry per selected value (`FormData.getAll(name)`). Choices are role-based rather than native radio/checkbox inputs.",
      "Supports single-choice, multiple-choice, freeform text entry, keyboard shortcuts (A-Z, 1-9), roving tabindex arrow key navigation, form validation, draft restoration, and native FormData serialization.",
      "Accessible: WCAG 2.2 SC 2.5.8 compliant (min-h-11 touch targets), floating 2px focus indicators, fieldset/legend semantics, inert inactive items, live error regions, and container-query responsiveness (@container)."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/questionnaire"
  },
  {
    "id": "radar-chart-card",
    "name": "radar-chart-card",
    "title": "Radar Chart Card",
    "description": "RadarChartCard block. Controlled presentational radar / spider card for multi-factor profile assessments, clinical competency pillars, and benchmark polygon overlays. Composes Card, Chart, and Legend primitives with polar grids, high-contrast polygons, and accessible tooltips.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/radar-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/radar-chart-card"
  },
  {
    "id": "radial-chart-card",
    "name": "radial-chart-card",
    "title": "Radial Chart Card",
    "description": "RadialChartCard block. Controlled presentational semicircle gauge card for capacity monitoring, threshold alerts, and target achievement. The arc color comes from the `value` entry in `config`; without one it falls back to the primary color. Composes Card, Badge, Icon, and Chart primitives with a 180° radial arc and high-contrast status tokens.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/radial-chart-card.tsx",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge",
      "recharts"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/radial-chart-card"
  },
  {
    "id": "step-wizard",
    "name": "step-wizard",
    "title": "Step Wizard",
    "description": "StepWizard composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from Base UI primitives and design tokens: - `Button`, `UnstyledButton` (`src/components/ui/button.tsx`) - `Icon` (`src/components/ui/icon.tsx`)",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/step-wizard.tsx",
    "taxonomy": [
      "Controlled multi-step workflow container for guided intake, onboarding, assessment flows, and multi-stage form sequences.",
      "Pure UI: receives step data via props, manages directional slide transitions, and emits progression intents via callbacks (`onStepChange`, `onComplete`).",
      "Accessible: WCAG 2.2 SC 2.5.8 compliant (44x44px minimum touch targets on all interactive step markers and buttons), floating 2px focus indicators (`outline-offset: 2px`), and live regions (`aria-live=\"polite\"`).",
      "Modern HTML integration: supports `hiddenUntilFound` with `hidden=\"until-found\"` and `beforematch` event listener so browser search (<kbd>Ctrl+F</kbd>) finds inactive step content."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/step-wizard"
  },
  {
    "id": "supporting-pane-block",
    "name": "supporting-pane-block",
    "title": "Supporting Pane Block",
    "description": "SupportingPaneBlock composite block. Layer: Composite Block (`src/components/blocks/`) Foundation: Built strictly from primitives and design tokens: - `Button` (`src/components/ui/button.tsx`) - `Icon` (`src/components/ui/icon.tsx`) - `Badge` (`src/components/ui/badge.tsx`)",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/supporting-pane-block.tsx",
    "taxonomy": [
      "Canonical supporting pane layout for focused tasks (audio drill canvas, exercise workspace) paired with an auxiliary side inspector (clinician tips, phonetic targets, session notes).",
      "Implements responsive container queries (`@container`):",
      "On large containers (`@3xl:` / `>=768px`): Side-by-side layout with docked pane (left or right).",
      "On compact containers (`<768px`): Full-width stacked layout below the primary workspace.",
      "On compact height (`short:`): Tightens top bar height while preserving 44px touch target focus rings.",
      "Targeted opacity transition (`duration-quick`, zero `transition-all`) with reduced-motion fallback.",
      "Restores keyboard focus cleanly when closed from inside the pane and marks closed panes inert.",
      "Zero direct `<button>` tags outside primitives."
    ],
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "shadcnCommand": "npx shadcn add @seany9915/eolas-ui/supporting-pane-block"
  }
];

export const REGISTRY_MAP: Record<string, RegistryEntry> = Object.fromEntries(
  REGISTRY_ENTRIES.map((entry) => [entry.id, entry])
);
