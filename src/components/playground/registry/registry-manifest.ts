// AUTO-GENERATED REGISTRY MANIFEST
import { RegistryEntry } from './types';

export const REGISTRY_ENTRIES: RegistryEntry[] = [
  {
    "id": "utils",
    "name": "utils",
    "title": "Eolas UI Utilities",
    "description": "Core utility library exporting cn(), assetUrl(), sanitizeUrl(), composeClassName(), resolveNativeButton(), and Base UI authoring hooks: mergeProps(), mergePropsN(), mergeClassNames(), makeEventPreventable(), and useRender().",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/utils.ts",
    "dependencies": [
      "@base-ui/react",
      "clsx",
      "tailwind-merge"
    ],
    "importStatement": "import { cn, sanitizeUrl, mergeProps, useRender } from '@/lib/utils';",
    "shadcnCommand": "npx shadcn@latest add @eolas/utils",
    "eolasCommand": "npx @seany9915/eolas-ui add utils"
  },
  {
    "id": "built-in-ai",
    "name": "built-in-ai",
    "title": "Built-in AI",
    "description": "On-device Built-in AI Hooks (Prompt API, Language Detector, Summarizer & Translator).",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/built-in-ai.ts",
    "importStatement": "import { useLanguageModel, useSummarizer, useTranslator } from '@/lib/built-in-ai';",
    "shadcnCommand": "npx shadcn@latest add @eolas/built-in-ai",
    "eolasCommand": "npx @seany9915/eolas-ui add built-in-ai"
  },
  {
    "id": "format-duration",
    "name": "format-duration",
    "title": "Format Duration",
    "description": "Locale-safe duration formatter and hook converting seconds or milliseconds into concise human-readable clinical labels.",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/format-duration.ts",
    "importStatement": "import { formatDuration, useDurationFormat } from '@/lib/format-duration';",
    "shadcnCommand": "npx shadcn@latest add @eolas/format-duration",
    "eolasCommand": "npx @seany9915/eolas-ui add format-duration"
  },
  {
    "id": "sanitize",
    "name": "sanitize",
    "title": "Sanitize",
    "description": "DOMParser-based HTML sanitizer utility and React component blocking unsafe scripts, handlers, and dangerous URLs.",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/sanitize.ts",
    "importStatement": "import { sanitizeHtml, SanitizedHtml } from '@/lib/sanitize';",
    "shadcnCommand": "npx shadcn@latest add @eolas/sanitize",
    "eolasCommand": "npx @seany9915/eolas-ui add sanitize"
  },
  {
    "id": "scheduler",
    "name": "scheduler",
    "title": "Scheduler",
    "description": "Cooperative task scheduling and yielding helpers keeping main-thread interactions responsive during heavy updates.",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/scheduler.ts",
    "importStatement": "import { yieldToMain, processChunked, useYieldingFilter } from '@/lib/scheduler';",
    "shadcnCommand": "npx shadcn@latest add @eolas/scheduler",
    "eolasCommand": "npx @seany9915/eolas-ui add scheduler"
  },
  {
    "id": "scroll-completion",
    "name": "scroll-completion",
    "title": "Scroll Completion",
    "description": "Programmatic smooth-scroll helper resolving cleanly when animated scrolling reaches its target or is cancelled.",
    "category": "system",
    "tier": "utility",
    "basePrimitive": "Eolas Utility Module",
    "sourcePath": "src/lib/scroll-completion.ts",
    "importStatement": "import { scrollIntoViewAsync, scrollToAsync } from '@/lib/scroll-completion';",
    "shadcnCommand": "npx shadcn@latest add @eolas/scroll-completion",
    "eolasCommand": "npx @seany9915/eolas-ui add scroll-completion"
  },
  {
    "id": "accordion",
    "name": "accordion",
    "title": "Accordion",
    "description": "Expandable and collapsible content sections supporting single or multiple open panels and keyboard navigation on Base UI Accordion.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Accordion } from '@/components/ui/accordion';",
    "shadcnCommand": "npx shadcn@latest add @eolas/accordion",
    "eolasCommand": "npx @seany9915/eolas-ui add accordion"
  },
  {
    "id": "alert-dialog",
    "name": "alert-dialog",
    "title": "Alert Dialog",
    "description": "Modal confirmation dialog requiring explicit user acknowledgment for destructive or irreversible actions, built on Base UI AlertDialog.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/alert-dialog",
    "sourcePath": "src/components/ui/alert-dialog.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { AlertDialog } from '@/components/ui/alert-dialog';",
    "shadcnCommand": "npx shadcn@latest add @eolas/alert-dialog",
    "eolasCommand": "npx @seany9915/eolas-ui add alert-dialog"
  },
  {
    "id": "attachment",
    "name": "attachment",
    "title": "Attachment",
    "description": "File attachment display and management primitive with file-type metadata, previews, upload progress, and remove actions.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/attachment.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Attachment } from '@/components/ui/attachment';",
    "shadcnCommand": "npx shadcn@latest add @eolas/attachment",
    "eolasCommand": "npx @seany9915/eolas-ui add attachment"
  },
  {
    "id": "autocomplete",
    "name": "autocomplete",
    "title": "Autocomplete",
    "description": "Filterable text input with live popup suggestions, clear button, and grouped results built on Base UI Autocomplete.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Autocomplete } from '@/components/ui/autocomplete';",
    "shadcnCommand": "npx shadcn@latest add @eolas/autocomplete",
    "eolasCommand": "npx @seany9915/eolas-ui add autocomplete"
  },
  {
    "id": "avatar",
    "name": "avatar",
    "title": "Avatar",
    "description": "Circular user or clinician identity badge displaying photography with automatic initials or icon fallback on Base UI Avatar.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Avatar } from '@/components/ui/avatar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/avatar",
    "eolasCommand": "npx @seany9915/eolas-ui add avatar"
  },
  {
    "id": "badge",
    "name": "badge",
    "title": "Badge",
    "description": "Compact high-contrast status and category pill enforcing filled, outline, and soft-wash clinical palette rules.",
    "category": "feedback",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Badge } from '@/components/ui/badge';",
    "shadcnCommand": "npx shadcn@latest add @eolas/badge",
    "eolasCommand": "npx @seany9915/eolas-ui add badge"
  },
  {
    "id": "bot-avatar",
    "name": "bot-avatar",
    "title": "Bot Avatar",
    "description": "Animated geometric avatar primitive for clinical AI assistants, supporting calm and active states with reduced-motion fallbacks.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/bot-avatar.tsx",
    "dependencies": [
      "bot-avatars"
    ],
    "importStatement": "import { BotAvatar } from '@/components/ui/bot-avatar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/bot-avatar",
    "eolasCommand": "npx @seany9915/eolas-ui add bot-avatar"
  },
  {
    "id": "breadcrumb",
    "name": "breadcrumb",
    "title": "Breadcrumb",
    "description": "Hierarchical trail navigation primitive showing current location with accessible landmarks and responsive separators.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/breadcrumb.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Breadcrumb } from '@/components/ui/breadcrumb';",
    "shadcnCommand": "npx shadcn@latest add @eolas/breadcrumb",
    "eolasCommand": "npx @seany9915/eolas-ui add breadcrumb"
  },
  {
    "id": "button-group",
    "name": "button-group",
    "title": "Button Group",
    "description": "Segmented horizontal or vertical container joining adjacent buttons, inputs, and addons with shared borders and focus layering.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/button-group.tsx",
    "taxonomy": [
      "A container to group related buttons, segmented actions, and inputs with fused borders and shared geometry.",
      "Resolves double-border artifacts via child border-overlap selectors while ensuring focus rings stay visible with proper stacking context (focus-visible:z-20).",
      "Fuses concentric border radii: rounds outer corners while flattening adjacent internal edges.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { ButtonGroup } from '@/components/ui/button-group';",
    "shadcnCommand": "npx shadcn@latest add @eolas/button-group",
    "eolasCommand": "npx @seany9915/eolas-ui add button-group"
  },
  {
    "id": "button",
    "name": "button",
    "title": "Button",
    "description": "Interactive push button with filled, soft, outline, and text variants, 44px minimum touch targets, and reduced-motion loading feedback on Base UI Button.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Button } from '@/components/ui/button';",
    "shadcnCommand": "npx shadcn@latest add @eolas/button",
    "eolasCommand": "npx @seany9915/eolas-ui add button"
  },
  {
    "id": "calendar",
    "name": "calendar",
    "title": "Calendar",
    "description": "Single-date and date-range month calendar built on React DayPicker with 44px day cells, month selectors, and keyboard navigation.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/calendar.tsx",
    "taxonomy": [
      "Use Calendar for date, multiple date, and date range selections.",
      "Integrates with React DayPicker v9/v10 while maintaining complete shadcn/ui API compatibility.",
      "Commonly paired with Popover and Button to form a DatePicker.",
      "Follows DESIGN.md tokens: Lexend body/cell font (font-sans), Atkinson Hyperlegible Next headings, primary brand selection, surface-container-high range fills, and WCAG 2.2 AA contrast."
    ],
    "dependencies": [
      "react-day-picker@^10.0.0"
    ],
    "importStatement": "import { Calendar } from '@/components/ui/calendar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/calendar",
    "eolasCommand": "npx @seany9915/eolas-ui add calendar"
  },
  {
    "id": "card",
    "name": "card",
    "title": "Card",
    "description": "Elevated containment primitive with Header, Title, Description, Action, Content, and Footer slots following DESIGN.md surface hierarchy.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/button",
    "sourcePath": "src/components/ui/card.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Card } from '@/components/ui/card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/card",
    "eolasCommand": "npx @seany9915/eolas-ui add card"
  },
  {
    "id": "carousel",
    "name": "carousel",
    "title": "Carousel",
    "description": "Carousel primitive built on embla-carousel-react and Base UI.",
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
      "embla-carousel-react"
    ],
    "importStatement": "import { Carousel } from '@/components/ui/carousel';",
    "shadcnCommand": "npx shadcn@latest add @eolas/carousel",
    "eolasCommand": "npx @seany9915/eolas-ui add carousel"
  },
  {
    "id": "chain-of-thought",
    "name": "chain-of-thought",
    "title": "Chain Of Thought",
    "description": "Collapsible multi-step AI reasoning trace showing step status, search results, sources, and elapsed timings.",
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
    "importStatement": "import { ChainOfThought } from '@/components/ui/chain-of-thought';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chain-of-thought",
    "eolasCommand": "npx @seany9915/eolas-ui add chain-of-thought"
  },
  {
    "id": "chart",
    "name": "chart",
    "title": "Chart",
    "description": "Recharts wrapper providing responsive containers, design-token color scales, accessible tooltips, and formatted legends.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chart.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { Chart } from '@/components/ui/chart';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chart",
    "eolasCommand": "npx @seany9915/eolas-ui add chart"
  },
  {
    "id": "chat-message-context",
    "name": "chat-message-context",
    "title": "Chat Message Context",
    "description": "React context provider sharing message role, alignment, and display metadata across ChatMessage subcomponents.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chat-message-context.tsx",
    "importStatement": "import { ChatMessageContext } from '@/components/ui/chat-message-context';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chat-message-context",
    "eolasCommand": "npx @seany9915/eolas-ui add chat-message-context"
  },
  {
    "id": "chat-message",
    "name": "chat-message",
    "title": "Chat Message",
    "description": "Structured conversation message row supporting user, assistant, and system alignments, markdown prose, actions, and status metadata.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/chat-message.tsx",
    "taxonomy": [
      "Use ChatMessage to display conversational turns (user, assistant, system).",
      "Follows DESIGN.md:",
      "Assistant messages use neutral surface fill (`bg-surface`), outline-variant border, calibrated card elevation (`shadow-card`), and `rounded-lg rounded-es-sm`.",
      "User messages use role container fill (`bg-primary-container text-on-primary-container`), `rounded-lg rounded-ee-sm`, and right alignment.",
      "Actions (copy, bookmark, retry) maintain accessible 44x44px touch targets.",
      "Numeric timestamps use `tabular-nums` and `font-mono`."
    ],
    "importStatement": "import { ChatMessage } from '@/components/ui/chat-message';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chat-message",
    "eolasCommand": "npx @seany9915/eolas-ui add chat-message"
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
      "@base-ui/react"
    ],
    "importStatement": "import { CheckboxGroup } from '@/components/ui/checkbox-group';",
    "shadcnCommand": "npx shadcn@latest add @eolas/checkbox-group",
    "eolasCommand": "npx @seany9915/eolas-ui add checkbox-group"
  },
  {
    "id": "checkbox",
    "name": "checkbox",
    "title": "Checkbox",
    "description": "Accessible binary and indeterminate selection control with 44px touch target, error state, and keyboard toggle on Base UI Checkbox.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Checkbox } from '@/components/ui/checkbox';",
    "shadcnCommand": "npx shadcn@latest add @eolas/checkbox",
    "eolasCommand": "npx @seany9915/eolas-ui add checkbox"
  },
  {
    "id": "checkpoint",
    "name": "checkpoint",
    "title": "Checkpoint",
    "description": "Inline conversation milestone divider marking saved thread states with a one-click restore trigger.",
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
    "importStatement": "import { Checkpoint } from '@/components/ui/checkpoint';",
    "shadcnCommand": "npx shadcn@latest add @eolas/checkpoint",
    "eolasCommand": "npx @seany9915/eolas-ui add checkpoint"
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
      "Full WCAG 2.2 SC 2.5.8 touch target compliance (expands to 44px when interactive or removable). For wrapped multi-row interactive chip groups, use `gap-y-3` (12px) or `gap-y-4` (16px) so expanded vertical hit areas do not overlap.",
      "Floating 2px focus ring (outline-offset: 2px) on keyboard focus."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Chip } from '@/components/ui/chip';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chip",
    "eolasCommand": "npx @seany9915/eolas-ui add chip"
  },
  {
    "id": "clinician-tip",
    "name": "clinician-tip",
    "title": "Clinician Tip",
    "description": "Clinical guidance callout displaying contextual tips and practice notes with subtle elevation and accessible high-contrast typography.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/clinician-tip.tsx",
    "importStatement": "import { ClinicianTip } from '@/components/ui/clinician-tip';",
    "shadcnCommand": "npx shadcn@latest add @eolas/clinician-tip",
    "eolasCommand": "npx @seany9915/eolas-ui add clinician-tip"
  },
  {
    "id": "code-block",
    "name": "code-block",
    "title": "Code Block",
    "description": "Syntax-styled code viewer supporting language labels, optional line numbers, copy button, and scrollable horizontal overflow.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/code-block.tsx",
    "taxonomy": [
      "Displays source code, JSON parameters, database query outputs, and formatted clinical data structures inside agent execution traces or messages.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px touch targets on copy buttons.",
      "Follows DESIGN.md tokens: Roboto Mono typography, high-contrast text, concentric radius, and floating 2px focus ring."
    ],
    "importStatement": "import { CodeBlock } from '@/components/ui/code-block';",
    "shadcnCommand": "npx shadcn@latest add @eolas/code-block",
    "eolasCommand": "npx @seany9915/eolas-ui add code-block"
  },
  {
    "id": "collapsible",
    "name": "collapsible",
    "title": "Collapsible",
    "description": "Accessible disclosure container with animated panel height and reduced-motion fallback built on Base UI Collapsible.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Collapsible } from '@/components/ui/collapsible';",
    "shadcnCommand": "npx shadcn@latest add @eolas/collapsible",
    "eolasCommand": "npx @seany9915/eolas-ui add collapsible"
  },
  {
    "id": "combobox",
    "name": "combobox",
    "title": "Combobox",
    "description": "Searchable single- and multi-select dropdown with chips, grouped options, and clear control built on Base UI Combobox.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Combobox } from '@/components/ui/combobox';",
    "shadcnCommand": "npx shadcn@latest add @eolas/combobox",
    "eolasCommand": "npx @seany9915/eolas-ui add combobox"
  },
  {
    "id": "command",
    "name": "command",
    "title": "Command",
    "description": "Modal keyboard command palette and fuzzy filter list combining cmdk search with accessible Base UI Dialog focus management.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/command.tsx",
    "taxonomy": [
      "Use Command for fast, accessible command palettes, spotlight search, and quick action menus.",
      "Powered by cmdk for fuzzy searching, keyboard scoring, and grouped item filtering.",
      "CommandDialog integrates Base UI Dialog (with screen-reader accessible DialogTitle and DialogDescription) while retaining complete shadcn Command API compatibility.",
      "Follows DESIGN.md tokens: Lexend body font (font-sans), Atkinson Hyperlegible Next headings, surface-container-low wash for item selection, and strict semantic tokens."
    ],
    "dependencies": [
      "cmdk"
    ],
    "importStatement": "import { Command } from '@/components/ui/command';",
    "shadcnCommand": "npx shadcn@latest add @eolas/command",
    "eolasCommand": "npx @seany9915/eolas-ui add command"
  },
  {
    "id": "confirmation",
    "name": "confirmation",
    "title": "Confirmation",
    "description": "Inline clinical or tool approval prompt requesting explicit accept or reject confirmation with outcome feedback.",
    "category": "overlays",
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
    "importStatement": "import { Confirmation } from '@/components/ui/confirmation';",
    "shadcnCommand": "npx shadcn@latest add @eolas/confirmation",
    "eolasCommand": "npx @seany9915/eolas-ui add confirmation"
  },
  {
    "id": "context-menu",
    "name": "context-menu",
    "title": "Context Menu",
    "description": "Pointer-anchored secondary action menu triggered by right-click or long-press, built on Base UI ContextMenu.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/context-menu",
    "sourcePath": "src/components/ui/context-menu.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { ContextMenu } from '@/components/ui/context-menu';",
    "shadcnCommand": "npx shadcn@latest add @eolas/context-menu",
    "eolasCommand": "npx @seany9915/eolas-ui add context-menu"
  },
  {
    "id": "csp-provider",
    "name": "csp-provider",
    "title": "CSP Provider",
    "description": "Content Security Policy provider forwarding a cryptographic nonce to Base UI portals and dynamic style elements.",
    "category": "system",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/csp-provider",
    "sourcePath": "src/components/ui/csp-provider.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { CSPProvider } from '@/components/ui/csp-provider';",
    "shadcnCommand": "npx shadcn@latest add @eolas/csp-provider",
    "eolasCommand": "npx @seany9915/eolas-ui add csp-provider"
  },
  {
    "id": "deferred-view",
    "name": "deferred-view",
    "title": "Deferred View",
    "description": "Progressive rendering wrapper deferring heavy offscreen subtrees until idle or visible in the viewport.",
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
    "importStatement": "import { DeferredView } from '@/components/ui/deferred-view';",
    "shadcnCommand": "npx shadcn@latest add @eolas/deferred-view",
    "eolasCommand": "npx @seany9915/eolas-ui add deferred-view"
  },
  {
    "id": "dialog",
    "name": "dialog",
    "title": "Dialog",
    "description": "Accessible modal overlay with backdrop blur, focus trapping, scroll locking, and required DialogTitle semantics on Base UI Dialog.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/dialog",
    "sourcePath": "src/components/ui/dialog.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Dialog } from '@/components/ui/dialog';",
    "shadcnCommand": "npx shadcn@latest add @eolas/dialog",
    "eolasCommand": "npx @seany9915/eolas-ui add dialog"
  },
  {
    "id": "direction-provider",
    "name": "direction-provider",
    "title": "Direction Provider",
    "description": "Reading direction (LTR/RTL) context provider synchronizing Base UI layout and keyboard behavior across descendant controls.",
    "category": "system",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/direction-provider",
    "sourcePath": "src/components/ui/direction-provider.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { DirectionProvider } from '@/components/ui/direction-provider';",
    "shadcnCommand": "npx shadcn@latest add @eolas/direction-provider",
    "eolasCommand": "npx @seany9915/eolas-ui add direction-provider"
  },
  {
    "id": "drawer",
    "name": "drawer",
    "title": "Drawer",
    "description": "Viewport-edge slide-over panel with backdrop blur, focus trapping, and logical RTL-aware anchoring on Base UI Drawer.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Drawer } from '@/components/ui/drawer';",
    "shadcnCommand": "npx shadcn@latest add @eolas/drawer",
    "eolasCommand": "npx @seany9915/eolas-ui add drawer"
  },
  {
    "id": "empty",
    "name": "empty",
    "title": "Empty",
    "description": "Centered empty and zero-data placeholder displaying a functional icon, plain-English heading, guidance text, and optional action.",
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
    "importStatement": "import { Empty } from '@/components/ui/empty';",
    "shadcnCommand": "npx shadcn@latest add @eolas/empty",
    "eolasCommand": "npx @seany9915/eolas-ui add empty"
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
    "importStatement": "import { ErrorShake } from '@/components/ui/error-shake';",
    "shadcnCommand": "npx shadcn@latest add @eolas/error-shake",
    "eolasCommand": "npx @seany9915/eolas-ui add error-shake"
  },
  {
    "id": "field",
    "name": "field",
    "title": "Field",
    "description": "Form field wrapper binding accessible labels, descriptions, validation errors, and invalid state via Base UI Field.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Field } from '@/components/ui/field';",
    "shadcnCommand": "npx shadcn@latest add @eolas/field",
    "eolasCommand": "npx @seany9915/eolas-ui add field"
  },
  {
    "id": "fieldset",
    "name": "fieldset",
    "title": "Fieldset",
    "description": "Accessible group container with semantic legend and shared description styling on Base UI Fieldset.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Fieldset } from '@/components/ui/fieldset';",
    "shadcnCommand": "npx shadcn@latest add @eolas/fieldset",
    "eolasCommand": "npx @seany9915/eolas-ui add fieldset"
  },
  {
    "id": "form",
    "name": "form",
    "title": "Form",
    "description": "Client and schema validation form root coordinating field submission state and error summaries via Base UI Form.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/form",
    "sourcePath": "src/components/ui/form.tsx",
    "taxonomy": [
      "A native form element with consolidated error handling, field registration, imperative validate actions, and external error state integration.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, and WCAG 2.2 SC 2.5.8 touch target compliance."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Form } from '@/components/ui/form';",
    "shadcnCommand": "npx shadcn@latest add @eolas/form",
    "eolasCommand": "npx @seany9915/eolas-ui add form"
  },
  {
    "id": "icon",
    "name": "icon",
    "title": "Icon",
    "description": "Material Symbols Outlined icon wrapper with standardized size tokens, fill control, ToggleIcon, and CrossFadeIcon helpers.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/icon.tsx",
    "importStatement": "import { Icon } from '@/components/ui/icon';",
    "shadcnCommand": "npx shadcn@latest add @eolas/icon",
    "eolasCommand": "npx @seany9915/eolas-ui add icon"
  },
  {
    "id": "inline-alert",
    "name": "inline-alert",
    "title": "Inline Alert",
    "description": "Rectangular in-flow feedback banner with a 4px semantic start accent bar, functional icon, description, and optional dismiss control.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { InlineAlert } from '@/components/ui/inline-alert';",
    "shadcnCommand": "npx shadcn@latest add @eolas/inline-alert",
    "eolasCommand": "npx @seany9915/eolas-ui add inline-alert"
  },
  {
    "id": "inline-citation",
    "name": "inline-citation",
    "title": "Inline Citation",
    "description": "Superscript inline source marker and hoverable citation card linking generated claims to verified references.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { InlineCitation } from '@/components/ui/inline-citation';",
    "shadcnCommand": "npx shadcn@latest add @eolas/inline-citation",
    "eolasCommand": "npx @seany9915/eolas-ui add inline-citation"
  },
  {
    "id": "input-group",
    "name": "input-group",
    "title": "Input Group",
    "description": "Compound input container uniting text fields with leading or trailing addons, icons, badges, and inline action buttons without absolute positioning.",
    "category": "inputs",
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
      "@base-ui/react"
    ],
    "importStatement": "import { InputGroup } from '@/components/ui/input-group';",
    "shadcnCommand": "npx shadcn@latest add @eolas/input-group",
    "eolasCommand": "npx @seany9915/eolas-ui add input-group"
  },
  {
    "id": "input",
    "name": "input",
    "title": "Input",
    "description": "Single-line text input supporting 44px/48px touch floors, error borders, and clear invalid messaging on Base UI Input.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/input",
    "sourcePath": "src/components/ui/input.tsx",
    "taxonomy": [
      "A native input element that automatically works with Base UI Field context (<Field.Root>).",
      "Implements Modern Web Guidance (MWG: html) tri-token contract for autocomplete, inputMode, enterKeyHint.",
      "Follows DESIGN.md Tier B interactive controls:",
      "0.5rem corner radius (rounded) matching Buttons as the primary form control.",
      "Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary) for WCAG 2.4.13 contrast and Windows High Contrast Mode (forced-colors: active) compatibility.",
      "WCAG 2.2 SC 2.5.8 compliant hit target sizes: sm (44px), md (48px), lg (56px).",
      "For complex input layouts with toolbars, prefixes, suffixes, or multiple buttons, compose with <InputGroup> (@/components/ui/input-group)."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Input } from '@/components/ui/input';",
    "shadcnCommand": "npx shadcn@latest add @eolas/input",
    "eolasCommand": "npx @seany9915/eolas-ui add input"
  },
  {
    "id": "item",
    "name": "item",
    "title": "Item",
    "description": "Flexible content row and media object primitive composing leading media, title, description, metadata, and trailing actions in lists and cards.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Item } from '@/components/ui/item';",
    "shadcnCommand": "npx shadcn@latest add @eolas/item",
    "eolasCommand": "npx @seany9915/eolas-ui add item"
  },
  {
    "id": "kbd",
    "name": "kbd",
    "title": "Kbd",
    "description": "Compact monospace keycap indicator for displaying keyboard shortcuts inside menus, tooltips, and action buttons.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/use-render",
    "sourcePath": "src/components/ui/kbd.tsx",
    "taxonomy": [
      "Use Kbd to visually represent keyboard keys, hotkeys, and shortcut combinations (e.g. ⌘K, Ctrl+B).",
      "Use KbdGroup to compose multiple keycaps together without line breaks.",
      "Ideal for embedding in buttons, command palettes, menus, and tooltips.",
      "Follows DESIGN.md tokens: Roboto Mono font (font-mono), surface-container-high wash, subtle outline-variant border, and strict semantic tokens."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Kbd } from '@/components/ui/kbd';",
    "shadcnCommand": "npx shadcn@latest add @eolas/kbd",
    "eolasCommand": "npx @seany9915/eolas-ui add kbd"
  },
  {
    "id": "menu",
    "name": "menu",
    "title": "Menu",
    "description": "Single-button dropdown action menu with grouped items, radio/checkbox choices, submenus, and keyboard navigation on Base UI Menu.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/menu",
    "sourcePath": "src/components/ui/menu.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Menu } from '@/components/ui/menu';",
    "shadcnCommand": "npx shadcn@latest add @eolas/menu",
    "eolasCommand": "npx @seany9915/eolas-ui add menu"
  },
  {
    "id": "menubar",
    "name": "menubar",
    "title": "Menubar",
    "description": "Horizontal desktop command bar grouping multiple menus with left/right arrow roving focus on Base UI Menubar.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/menubar",
    "sourcePath": "src/components/ui/menubar.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Menubar } from '@/components/ui/menubar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/menubar",
    "eolasCommand": "npx @seany9915/eolas-ui add menubar"
  },
  {
    "id": "message-scroller",
    "name": "message-scroller",
    "title": "Message Scroller",
    "description": "Auto-pinning conversation scroll viewport with smooth stick-to-bottom behavior and a jump-to-latest button when scrolled up.",
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
    "importStatement": "import { MessageScroller } from '@/components/ui/message-scroller';",
    "shadcnCommand": "npx shadcn@latest add @eolas/message-scroller",
    "eolasCommand": "npx @seany9915/eolas-ui add message-scroller"
  },
  {
    "id": "meter",
    "name": "meter",
    "title": "Meter",
    "description": "Accessible scalar measurement bar showing current values within a bounded range and high-contrast fill on Base UI Meter.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Meter } from '@/components/ui/meter';",
    "shadcnCommand": "npx shadcn@latest add @eolas/meter",
    "eolasCommand": "npx @seany9915/eolas-ui add meter"
  },
  {
    "id": "model-selector",
    "name": "model-selector",
    "title": "Model Selector",
    "description": "Popover-backed AI model picker with capability badges, search filtering, and keyboard selection.",
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
    "importStatement": "import { ModelSelector } from '@/components/ui/model-selector';",
    "shadcnCommand": "npx shadcn@latest add @eolas/model-selector",
    "eolasCommand": "npx @seany9915/eolas-ui add model-selector"
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
      "@base-ui/react"
    ],
    "importStatement": "import { NavigationBar } from '@/components/ui/navigation-bar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/navigation-bar",
    "eolasCommand": "npx @seany9915/eolas-ui add navigation-bar"
  },
  {
    "id": "navigation-menu",
    "name": "navigation-menu",
    "title": "Navigation Menu",
    "description": "Top-level site and application navigation bar supporting rich flyout viewports and accessible landmarks on Base UI NavigationMenu.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/navigation-menu",
    "sourcePath": "src/components/ui/navigation-menu.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { NavigationMenu } from '@/components/ui/navigation-menu';",
    "shadcnCommand": "npx shadcn@latest add @eolas/navigation-menu",
    "eolasCommand": "npx @seany9915/eolas-ui add navigation-menu"
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
    "importStatement": "import { NotificationBadge } from '@/components/ui/notification-badge';",
    "shadcnCommand": "npx shadcn@latest add @eolas/notification-badge",
    "eolasCommand": "npx @seany9915/eolas-ui add notification-badge"
  },
  {
    "id": "number-field",
    "name": "number-field",
    "title": "Number Field",
    "description": "Numeric stepper input with increment/decrement buttons, scrub area, and keyboard step controls on Base UI NumberField.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/number-field",
    "sourcePath": "src/components/ui/number-field.tsx",
    "taxonomy": [
      "Use NumberField for numerical inputs with step buttons, keyboard scrubbing, wheel scrubbing, and localized formatting.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring, WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets, and motion restraint."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { NumberField } from '@/components/ui/number-field';",
    "shadcnCommand": "npx shadcn@latest add @eolas/number-field",
    "eolasCommand": "npx @seany9915/eolas-ui add number-field"
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
    "importStatement": "import { NumberPopIn } from '@/components/ui/number-pop-in';",
    "shadcnCommand": "npx shadcn@latest add @eolas/number-pop-in",
    "eolasCommand": "npx @seany9915/eolas-ui add number-pop-in"
  },
  {
    "id": "otp-field",
    "name": "otp-field",
    "title": "OTP Field",
    "description": "Segmented one-time passcode input supporting paste splitting, arrow navigation, and WebOTP autocomplete on Base UI OTPField.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { OTPField } from '@/components/ui/otp-field';",
    "shadcnCommand": "npx shadcn@latest add @eolas/otp-field",
    "eolasCommand": "npx @seany9915/eolas-ui add otp-field"
  },
  {
    "id": "pagination",
    "name": "pagination",
    "title": "Pagination",
    "description": "Multi-page navigation control with previous/next buttons, numbered page links, and ellipsis indicators meeting 44px touch floors.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/pagination.tsx",
    "importStatement": "import { Pagination } from '@/components/ui/pagination';",
    "shadcnCommand": "npx shadcn@latest add @eolas/pagination",
    "eolasCommand": "npx @seany9915/eolas-ui add pagination"
  },
  {
    "id": "plan",
    "name": "plan",
    "title": "Plan",
    "description": "Structured multi-step clinical or agent plan primitive with collapsible overview, step status indicators, and action footer.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/plan.tsx",
    "taxonomy": [
      "Displays an AI agent's multi-step plan determined up-front before execution (e.g., a 4-stage minimal pair therapy drill, clinical phonological assessment plan).",
      "Tracks progress with a progress bar and completion counter (e.g. \"2 of 4 done\"). <Plan title=\"...\" steps={[...]} /> and declarative compound composition: <Plan defaultOpen> <PlanHeader> <PlanTitle>Assessment Plan</PlanTitle> <PlanDescription>2 of 4 done</PlanDescription> <PlanTrigger /> </PlanHeader> <PlanContent>...</PlanContent> </Plan>",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers."
    ],
    "importStatement": "import { Plan } from '@/components/ui/plan';",
    "shadcnCommand": "npx shadcn@latest add @eolas/plan",
    "eolasCommand": "npx @seany9915/eolas-ui add plan"
  },
  {
    "id": "popover",
    "name": "popover",
    "title": "Popover",
    "description": "Non-modal anchored floating panel for contextual forms, filters, or rich details, built on Base UI Popover.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/popover",
    "sourcePath": "src/components/ui/popover.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Popover } from '@/components/ui/popover';",
    "shadcnCommand": "npx shadcn@latest add @eolas/popover",
    "eolasCommand": "npx @seany9915/eolas-ui add popover"
  },
  {
    "id": "preview-card",
    "name": "preview-card",
    "title": "Preview Card",
    "description": "Hover- and focus-triggered floating card previewing linked content without navigating away, built on Base UI PreviewCard.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/preview-card",
    "sourcePath": "src/components/ui/preview-card.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { PreviewCard } from '@/components/ui/preview-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/preview-card",
    "eolasCommand": "npx @seany9915/eolas-ui add preview-card"
  },
  {
    "id": "progress-ring",
    "name": "progress-ring",
    "title": "Progress Ring",
    "description": "Circular SVG progress gauge displaying task completion percentage with tabular center numerals on Base UI Progress.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { ProgressRing } from '@/components/ui/progress-ring';",
    "shadcnCommand": "npx shadcn@latest add @eolas/progress-ring",
    "eolasCommand": "npx @seany9915/eolas-ui add progress-ring"
  },
  {
    "id": "progress",
    "name": "progress",
    "title": "Progress",
    "description": "Linear task progress bar supporting determinate percentages and reduced-motion indeterminate sweeps on Base UI Progress.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Progress } from '@/components/ui/progress';",
    "shadcnCommand": "npx shadcn@latest add @eolas/progress",
    "eolasCommand": "npx @seany9915/eolas-ui add progress"
  },
  {
    "id": "prompt-input",
    "name": "prompt-input",
    "title": "Prompt Input",
    "description": "Composer bar for AI prompts with auto-sizing textarea, file attachments, IME-safe Enter submission, character limits, and action controls.",
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
    "importStatement": "import { PromptInput } from '@/components/ui/prompt-input';",
    "shadcnCommand": "npx shadcn@latest add @eolas/prompt-input",
    "eolasCommand": "npx @seany9915/eolas-ui add prompt-input"
  },
  {
    "id": "queue",
    "name": "queue",
    "title": "Queue",
    "description": "Ordered task and review queue primitive displaying pending, active, and completed items with keyboard-accessible row actions.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/queue.tsx",
    "taxonomy": [
      "Displays an AI agent's dynamic queue / to-do list, cleanly partitioned into remaining tasks ('To do') and finished tasks ('Completed').",
      "As the agent works, tasks transition across sections. <Queue items={[...]} /> and declarative compound composition: <Queue> <Queue.Section title=\"2 to do\" status=\"pending\"> <Queue.Item title=\"Task 1\" status=\"pending\" /> </Queue.Section> </Queue>",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers."
    ],
    "importStatement": "import { Queue } from '@/components/ui/queue';",
    "shadcnCommand": "npx shadcn@latest add @eolas/queue",
    "eolasCommand": "npx @seany9915/eolas-ui add queue"
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
      "@base-ui/react"
    ],
    "importStatement": "import { Radio } from '@/components/ui/radio';",
    "shadcnCommand": "npx shadcn@latest add @eolas/radio",
    "eolasCommand": "npx @seany9915/eolas-ui add radio"
  },
  {
    "id": "reading-progress",
    "name": "reading-progress",
    "title": "Reading Progress",
    "description": "Fixed viewport progress indicator tracking scroll depth through long clinical notes or documents.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { ReadingProgress } from '@/components/ui/reading-progress';",
    "shadcnCommand": "npx shadcn@latest add @eolas/reading-progress",
    "eolasCommand": "npx @seany9915/eolas-ui add reading-progress"
  },
  {
    "id": "reasoning",
    "name": "reasoning",
    "title": "Reasoning",
    "description": "Expandable AI thought-process container displaying streaming durations and collapsible reasoning text.",
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
    "importStatement": "import { Reasoning } from '@/components/ui/reasoning';",
    "shadcnCommand": "npx shadcn@latest add @eolas/reasoning",
    "eolasCommand": "npx @seany9915/eolas-ui add reasoning"
  },
  {
    "id": "resizable",
    "name": "resizable",
    "title": "Resizable",
    "description": "Resizable component primitive built on react-resizable-panels.",
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
      "react-resizable-panels@^4.0.0"
    ],
    "importStatement": "import { Resizable } from '@/components/ui/resizable';",
    "shadcnCommand": "npx shadcn@latest add @eolas/resizable",
    "eolasCommand": "npx @seany9915/eolas-ui add resizable"
  },
  {
    "id": "scroll-area",
    "name": "scroll-area",
    "title": "Scroll Area",
    "description": "Custom-styled scrollable container with unobtrusive auto-hiding scrollbars and focus-safe viewport padding on Base UI ScrollArea.",
    "category": "navigation",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/scroll-area",
    "sourcePath": "src/components/ui/scroll-area.tsx",
    "taxonomy": [
      "Augments native browser scrolling with custom-styled, accessible scrollbars.",
      "Supports vertical, horizontal, or dual-axis scrolling with optional overflow fade masks.",
      "Follows DESIGN.md Tier B interactive controls: concentric radius, floating 2px focus ring (scoped to direct-child viewport so nested ScrollAreas never double-highlight), slim 6px passive overlay thumb that expands to 8px with >=3:1 contrast on track hover/active drag, high-contrast / forced-colors overrides, inverted surface support, and calibrated motion restraint.",
      "Place internal padding on `contentClassName` (or `viewportClassName`), not on `Root`, so scrolling content reaches the container edges cleanly without detaching the scrollbar.",
      "When using `scrollbarVisibility=\"always\"`, add matching end-padding (e.g. `pe-3`) on `contentClassName` because overlay scrollbars do not reserve layout gutter space."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { ScrollArea } from '@/components/ui/scroll-area';",
    "shadcnCommand": "npx shadcn@latest add @eolas/scroll-area",
    "eolasCommand": "npx @seany9915/eolas-ui add scroll-area"
  },
  {
    "id": "scrollspy",
    "name": "scrollspy",
    "title": "Scrollspy",
    "description": "Intersection-driven section tracker highlighting active navigation links and syncing hash navigation.",
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
    "importStatement": "import { Scrollspy } from '@/components/ui/scrollspy';",
    "shadcnCommand": "npx shadcn@latest add @eolas/scrollspy",
    "eolasCommand": "npx @seany9915/eolas-ui add scrollspy"
  },
  {
    "id": "select",
    "name": "select",
    "title": "Select",
    "description": "Accessible dropdown selector with grouped items, scroll arrows, and 44px/48px touch floors on Base UI Select.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/select",
    "sourcePath": "src/components/ui/select.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Select } from '@/components/ui/select';",
    "shadcnCommand": "npx shadcn@latest add @eolas/select",
    "eolasCommand": "npx @seany9915/eolas-ui add select"
  },
  {
    "id": "separator",
    "name": "separator",
    "title": "Separator",
    "description": "Horizontal or vertical hairline divider with accessible orientation semantics on Base UI Separator.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Separator } from '@/components/ui/separator';",
    "shadcnCommand": "npx shadcn@latest add @eolas/separator",
    "eolasCommand": "npx @seany9915/eolas-ui add separator"
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
    "importStatement": "import { ShimmerText } from '@/components/ui/shimmer-text';",
    "shadcnCommand": "npx shadcn@latest add @eolas/shimmer-text",
    "eolasCommand": "npx @seany9915/eolas-ui add shimmer-text"
  },
  {
    "id": "sidebar",
    "name": "sidebar",
    "title": "Sidebar",
    "description": "Sidebar primitive (@base-ui/react/drawer + Base UI compound architecture).",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Sidebar } from '@/components/ui/sidebar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/sidebar",
    "eolasCommand": "npx @seany9915/eolas-ui add sidebar"
  },
  {
    "id": "skeleton",
    "name": "skeleton",
    "title": "Skeleton",
    "description": "Loading placeholder with reduced-motion-safe shimmer and SkeletonReveal cross-fade into hydrated content.",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "transitions.dev (@jakubantalik)",
    "platformReference": "https://transitions.dev/library.html",
    "sourcePath": "src/components/ui/skeleton.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Skeleton } from '@/components/ui/skeleton';",
    "shadcnCommand": "npx shadcn@latest add @eolas/skeleton",
    "eolasCommand": "npx @seany9915/eolas-ui add skeleton"
  },
  {
    "id": "slider",
    "name": "slider",
    "title": "Slider",
    "description": "Single-thumb and range value slider with keyboard steps, tick marks, and tabular value readouts on Base UI Slider.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Slider } from '@/components/ui/slider';",
    "shadcnCommand": "npx shadcn@latest add @eolas/slider",
    "eolasCommand": "npx @seany9915/eolas-ui add slider"
  },
  {
    "id": "sortable",
    "name": "sortable",
    "title": "Sortable",
    "description": "Accessible drag-and-drop and keyboard-reorderable list primitive powered by @dnd-kit/react with focus preservation.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/sortable.tsx",
    "dependencies": [
      "@dnd-kit/helpers",
      "@dnd-kit/react"
    ],
    "importStatement": "import { Sortable } from '@/components/ui/sortable';",
    "shadcnCommand": "npx shadcn@latest add @eolas/sortable",
    "eolasCommand": "npx @seany9915/eolas-ui add sortable"
  },
  {
    "id": "sources",
    "name": "sources",
    "title": "Sources",
    "description": "Collapsible footnote and reference tray listing retrieved clinical documents, favicons, and external links.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
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
    "importStatement": "import { Sources } from '@/components/ui/sources';",
    "shadcnCommand": "npx shadcn@latest add @eolas/sources",
    "eolasCommand": "npx @seany9915/eolas-ui add sources"
  },
  {
    "id": "spinner",
    "name": "spinner",
    "title": "Spinner",
    "description": "Minimal SVG loading indicator with slowed reduced-motion fallback and screen-reader status text.",
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
    "importStatement": "import { Spinner } from '@/components/ui/spinner';",
    "shadcnCommand": "npx shadcn@latest add @eolas/spinner",
    "eolasCommand": "npx @seany9915/eolas-ui add spinner"
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
    "importStatement": "import { SpinningCounter } from '@/components/ui/spinning-counter';",
    "shadcnCommand": "npx shadcn@latest add @eolas/spinning-counter",
    "eolasCommand": "npx @seany9915/eolas-ui add spinning-counter"
  },
  {
    "id": "sticky-container",
    "name": "sticky-container",
    "title": "Sticky Container",
    "description": "IntersectionObserver-backed sticky header wrapper applying ambient elevation once content scrolls beneath it.",
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
    "importStatement": "import { StickyContainer } from '@/components/ui/sticky-container';",
    "shadcnCommand": "npx shadcn@latest add @eolas/sticky-container",
    "eolasCommand": "npx @seany9915/eolas-ui add sticky-container"
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
    "importStatement": "import { SuccessCheck } from '@/components/ui/success-check';",
    "shadcnCommand": "npx shadcn@latest add @eolas/success-check",
    "eolasCommand": "npx @seany9915/eolas-ui add success-check"
  },
  {
    "id": "suggestion-chips",
    "name": "suggestion-chips",
    "title": "Suggestion Chips",
    "description": "Keyboard-navigable prompt suggestion list supporting horizontal scrolling, wrapping rows, and single-click submission.",
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
    "importStatement": "import { SuggestionChips } from '@/components/ui/suggestion-chips';",
    "shadcnCommand": "npx shadcn@latest add @eolas/suggestion-chips",
    "eolasCommand": "npx @seany9915/eolas-ui add suggestion-chips"
  },
  {
    "id": "swipe-reveal",
    "name": "swipe-reveal",
    "title": "Swipe Reveal",
    "description": "Touch swipeable row revealing trailing actions alongside an accessible toggle button for pointer and keyboard users.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { SwipeReveal } from '@/components/ui/swipe-reveal';",
    "shadcnCommand": "npx shadcn@latest add @eolas/swipe-reveal",
    "eolasCommand": "npx @seany9915/eolas-ui add swipe-reveal"
  },
  {
    "id": "switch",
    "name": "switch",
    "title": "Switch",
    "description": "Accessible two-state toggle switch with 44px hit target, labels, and reduced-motion thumb slide on Base UI Switch.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Switch } from '@/components/ui/switch';",
    "shadcnCommand": "npx shadcn@latest add @eolas/switch",
    "eolasCommand": "npx @seany9915/eolas-ui add switch"
  },
  {
    "id": "table",
    "name": "table",
    "title": "Table",
    "description": "Semantic data table primitives with tabular numeric alignment, hover states, selected rows, and responsive horizontal overflow.",
    "category": "layout",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/table.tsx",
    "taxonomy": [
      "Dual-mode data table primitive supporting: 1. Atomic compound composition (<Table>, <Table.Header>, <Table.Body>, <Table.Row>, <Table.Head>, <Table.Cell>, <Table.Footer>, <Table.Caption>). 2. Declarative data-driven mode (<Table columns={...} data={...} keyExtractor={...} responsive=\"stack\" />) with automatic container-query card stacking (@container).",
      "Implements explicit column header semantics (scope=\"col\"), 56px minimum row heights for OS text zoom adaptability, and automatic tabular-nums on numeric columns.",
      "Follows DESIGN.md Tier B interactive controls: semantic tokens, concentric geometry, and motion restraint."
    ],
    "importStatement": "import { Table } from '@/components/ui/table';",
    "shadcnCommand": "npx shadcn@latest add @eolas/table",
    "eolasCommand": "npx @seany9915/eolas-ui add table"
  },
  {
    "id": "tabs",
    "name": "tabs",
    "title": "Tabs",
    "description": "Tabbed view switcher in line, pills, and contained styles with animated selection indicator on Base UI Tabs.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Tabs } from '@/components/ui/tabs';",
    "shadcnCommand": "npx shadcn@latest add @eolas/tabs",
    "eolasCommand": "npx @seany9915/eolas-ui add tabs"
  },
  {
    "id": "task",
    "name": "task",
    "title": "Task",
    "description": "Expandable task execution item displaying step label, completion badge, and nested subtask trace.",
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
    "importStatement": "import { Task } from '@/components/ui/task';",
    "shadcnCommand": "npx shadcn@latest add @eolas/task",
    "eolasCommand": "npx @seany9915/eolas-ui add task"
  },
  {
    "id": "text-highlight",
    "name": "text-highlight",
    "title": "Text Highlight",
    "description": "Inline text highlighter wrapping matched search terms with accessible <mark> contrast.",
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
    "importStatement": "import { TextHighlight } from '@/components/ui/text-highlight';",
    "shadcnCommand": "npx shadcn@latest add @eolas/text-highlight",
    "eolasCommand": "npx @seany9915/eolas-ui add text-highlight"
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
    "importStatement": "import { TextSwap } from '@/components/ui/text-swap';",
    "shadcnCommand": "npx shadcn@latest add @eolas/text-swap",
    "eolasCommand": "npx @seany9915/eolas-ui add text-swap"
  },
  {
    "id": "textarea",
    "name": "textarea",
    "title": "Textarea",
    "description": "Multi-line text input with clean focus rings, error states, and consistent clinical typography tokens.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/field",
    "sourcePath": "src/components/ui/textarea.tsx",
    "taxonomy": [
      "Use Textarea for multi-line freeform text input and notes.",
      "Supports modern CSS `field-sizing: content` via `autoGrow` prop for zero-layout-shift auto-expansion.",
      "Follows DESIGN.md Tier B interactive controls:",
      "0.5rem corner radius (rounded) matching Button and Input as primary form controls.",
      "Flush 2px focus indicator with negative 1px offset (focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary).",
      "WCAG 2.2 SC 2.5.8 touch target compliance.",
      "For complex multi-line prompt composers with attachment toolbars, compose with <InputGroup> (@/components/ui/input-group) or <PromptInput> (@/components/ui/prompt-input)."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Textarea } from '@/components/ui/textarea';",
    "shadcnCommand": "npx shadcn@latest add @eolas/textarea",
    "eolasCommand": "npx @seany9915/eolas-ui add textarea"
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
    "importStatement": "import { TextsReveal } from '@/components/ui/texts-reveal';",
    "shadcnCommand": "npx shadcn@latest add @eolas/texts-reveal",
    "eolasCommand": "npx @seany9915/eolas-ui add texts-reveal"
  },
  {
    "id": "thinking-orb",
    "name": "thinking-orb",
    "title": "Thinking Orb",
    "description": "Animated visual indicator representing active AI reasoning and streaming state, with accessible reduced-motion fallback.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/thinking-orb.tsx",
    "dependencies": [
      "thinking-orbs"
    ],
    "importStatement": "import { ThinkingOrb } from '@/components/ui/thinking-orb';",
    "shadcnCommand": "npx shadcn@latest add @eolas/thinking-orb",
    "eolasCommand": "npx @seany9915/eolas-ui add thinking-orb"
  },
  {
    "id": "toast",
    "name": "toast",
    "title": "Toast",
    "description": "Transient notification banner with 4px semantic accent bar, 44x44px dismiss button, and imperative toast queue on Base UI Toast.",
    "category": "feedback",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toast",
    "sourcePath": "src/components/ui/toast.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Toast } from '@/components/ui/toast';",
    "shadcnCommand": "npx shadcn@latest add @eolas/toast",
    "eolasCommand": "npx @seany9915/eolas-ui add toast"
  },
  {
    "id": "toggle-group",
    "name": "toggle-group",
    "title": "Toggle Group",
    "description": "Single- or multi-select grouped toggle control in segmented and outline styles on Base UI ToggleGroup.",
    "category": "inputs",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/toggle-group",
    "sourcePath": "src/components/ui/toggle-group.tsx",
    "taxonomy": [
      "Use ToggleGroup for mutually exclusive or multi-select option switches (e.g. text align, view mode grid/list, filter tags) where selection updates state/data in-place without switching or hiding full views or panels.",
      "Do NOT use ToggleGroup for switching tabs/panels (use Tabs instead, role=\"tablist\").",
      "Do NOT use ToggleGroup for persistent command action bars (use Toolbar instead, role=\"toolbar\").",
      "Inner items use `rounded-sm` (0.25rem / 4px) and outer container uses `rounded` (0.5rem / 8px) per concentric radius law ($R_{outer} = R_{inner} + padding = 4px + 4px = 8px$).",
      "Outer track uses `bg-surface-container-high` with `border-outline-variant`. Pressed items adapt by mode: single-select uses `bg-surface text-on-surface border-outline`, multi-select uses `bg-primary-container text-on-primary-container border-primary`.",
      "Enforces WCAG 2.2 SC 2.5.8 compliant 44x44px touch targets on interactive items."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { ToggleGroup } from '@/components/ui/toggle-group';",
    "shadcnCommand": "npx shadcn@latest add @eolas/toggle-group",
    "eolasCommand": "npx @seany9915/eolas-ui add toggle-group"
  },
  {
    "id": "toggle",
    "name": "toggle",
    "title": "Toggle",
    "description": "Stateful two-state pressed button for toolbar formatting and filter switches on Base UI Toggle.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Toggle } from '@/components/ui/toggle';",
    "shadcnCommand": "npx shadcn@latest add @eolas/toggle",
    "eolasCommand": "npx @seany9915/eolas-ui add toggle"
  },
  {
    "id": "tool",
    "name": "tool",
    "title": "Tool",
    "description": "Collapsible AI tool call inspector showing invocation status, formatted input parameters, output payloads, and errors.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "DESIGN.md Token Primitive",
    "sourcePath": "src/components/ui/tool.tsx",
    "taxonomy": [
      "Use Tool to represent an agent tool invocation from input parameters to returned output, supporting live execution states ('calling', 'complete', 'error').",
      "Conforms to shadcn AI Elements Tool specification and DESIGN.md:",
      "High-contrast visual hierarchy with calm neutral container fill.",
      "Monospace font for tool function names and JSON argument inspection.",
      "Accessible Collapsible disclosure with rotation chevron and keyboard navigation.",
      "Integrates seamlessly with CodeBlock for syntax-highlighted parameters."
    ],
    "importStatement": "import { Tool } from '@/components/ui/tool';",
    "shadcnCommand": "npx shadcn@latest add @eolas/tool",
    "eolasCommand": "npx @seany9915/eolas-ui add tool"
  },
  {
    "id": "toolbar",
    "name": "toolbar",
    "title": "Toolbar",
    "description": "Roving-focus horizontal action strip grouping buttons, toggles, and separators on Base UI Toolbar.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { Toolbar } from '@/components/ui/toolbar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/toolbar",
    "eolasCommand": "npx @seany9915/eolas-ui add toolbar"
  },
  {
    "id": "tooltip",
    "name": "tooltip",
    "title": "Tooltip",
    "description": "Accessible hover- and focus-triggered label explaining icon buttons or truncated controls, built on Base UI Tooltip.",
    "category": "overlays",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/tooltip",
    "sourcePath": "src/components/ui/tooltip.tsx",
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Tooltip } from '@/components/ui/tooltip';",
    "shadcnCommand": "npx shadcn@latest add @eolas/tooltip",
    "eolasCommand": "npx @seany9915/eolas-ui add tooltip"
  },
  {
    "id": "trace",
    "name": "trace",
    "title": "Trace",
    "description": "Compact execution trace container summarizing AI agent tool calls, timing, and expandable step details.",
    "category": "clinical-ai",
    "tier": "primitive",
    "basePrimitive": "@base-ui/react/collapsible",
    "sourcePath": "src/components/ui/trace.tsx",
    "taxonomy": [
      "Universal primitive for AI agent execution lifecycle: step-by-step reasoning, tool calls, multi-stage task plans, error stack traces, and agent activity logs.",
      "Replaces monolithic steppers with a flexible, composable compound architecture.",
      "WCAG 2.2 SC 2.5.8 compliant: 44px minimum touch targets on all interactive triggers.",
      "Strictly follows DESIGN.md tokens: floating 2px focus ring (outline-offset: 2px), concentric radius (rounded-2xl containers), and semantic high-contrast colors without monochrome triple-tints."
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "importStatement": "import { Trace } from '@/components/ui/trace';",
    "shadcnCommand": "npx shadcn@latest add @eolas/trace",
    "eolasCommand": "npx @seany9915/eolas-ui add trace"
  },
  {
    "id": "view-transition",
    "name": "view-transition",
    "title": "View Transition",
    "description": "Declarative React 19 view-transition wrapper and trigger applying temporary transition names during updates.",
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
      "@base-ui/react"
    ],
    "importStatement": "import { ViewTransition } from '@/components/ui/view-transition';",
    "shadcnCommand": "npx shadcn@latest add @eolas/view-transition",
    "eolasCommand": "npx @seany9915/eolas-ui add view-transition"
  },
  {
    "id": "app-shell",
    "name": "app-shell",
    "title": "App Shell",
    "description": "Controlled responsive workspace shell composing collapsible sidebar navigation, mobile drawer, header bar, and main viewport.",
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
    "importStatement": "import { AppShell } from '@/components/blocks/app-shell';",
    "shadcnCommand": "npx shadcn@latest add @eolas/app-shell",
    "eolasCommand": "npx @seany9915/eolas-ui add app-shell"
  },
  {
    "id": "area-chart-card",
    "name": "area-chart-card",
    "title": "Area Chart Card",
    "description": "AreaChartCard block. Controlled presentational card for volume trends and intake velocity over time. Composes ChartCard and Chart primitives with smooth gradient fills and accessible tooltips.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/area-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { AreaChartCard } from '@/components/blocks/area-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/area-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add area-chart-card"
  },
  {
    "id": "bar-chart-card",
    "name": "bar-chart-card",
    "title": "Bar Chart Card",
    "description": "BarChartCard block. Controlled presentational card for categorical throughput, comparative performance, and multi-metric distribution. Composes ChartCard and Chart primitives with rounded bars, accessible tooltips, and legends.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/bar-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { BarChartCard } from '@/components/blocks/bar-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/bar-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add bar-chart-card"
  },
  {
    "id": "chart-card",
    "name": "chart-card",
    "title": "Chart Card",
    "description": "Presentational shell for data visualization cards composing Card, Badge, Skeleton, and Empty with container-query responsiveness and loading/empty states.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/chart-card.tsx",
    "importStatement": "import { ChartCard } from '@/components/blocks/chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add chart-card"
  },
  {
    "id": "chat",
    "name": "chat",
    "title": "Chat",
    "description": "Controlled clinical AI conversation block uniting MessageScroller, ChatMessage, Sources, Trace, Confirmation, and PromptInput.",
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
    "importStatement": "import { Chat } from '@/components/blocks/chat';",
    "shadcnCommand": "npx shadcn@latest add @eolas/chat",
    "eolasCommand": "npx @seany9915/eolas-ui add chat"
  },
  {
    "id": "data-table",
    "name": "data-table",
    "title": "Data Table",
    "description": "Controlled sortable, filterable, and selectable data table block powered by @tanstack/react-table with pagination and bulk actions.",
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
      "@tanstack/react-table@^9.0.0"
    ],
    "importStatement": "import { DataTable } from '@/components/blocks/data-table';",
    "shadcnCommand": "npx shadcn@latest add @eolas/data-table",
    "eolasCommand": "npx @seany9915/eolas-ui add data-table"
  },
  {
    "id": "filter-toolbar",
    "name": "filter-toolbar",
    "title": "Filter Toolbar",
    "description": "Controlled composite toolbar for tables and caseload lists composing Field, Input, Select, Button, and Chip with container queries and 44px touch targets.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/filter-toolbar.tsx",
    "importStatement": "import { FilterToolbar } from '@/components/blocks/filter-toolbar';",
    "shadcnCommand": "npx shadcn@latest add @eolas/filter-toolbar",
    "eolasCommand": "npx @seany9915/eolas-ui add filter-toolbar"
  },
  {
    "id": "line-chart-card",
    "name": "line-chart-card",
    "title": "Line Chart Card",
    "description": "LineChartCard block. Controlled presentational card for multi-series trajectories, baseline targets, and historical benchmark tracking. Composes ChartCard and Chart primitives with high-contrast lines, accessible tooltips, and legends.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/line-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { LineChartCard } from '@/components/blocks/line-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/line-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add line-chart-card"
  },
  {
    "id": "list-detail-block",
    "name": "list-detail-block",
    "title": "List Detail Block",
    "description": "Controlled two-pane master-detail workspace adapting between side-by-side split panes and mobile drill-down navigation.",
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
    "importStatement": "import { ListDetailBlock } from '@/components/blocks/list-detail-block';",
    "shadcnCommand": "npx shadcn@latest add @eolas/list-detail-block",
    "eolasCommand": "npx @seany9915/eolas-ui add list-detail-block"
  },
  {
    "id": "pie-chart-card",
    "name": "pie-chart-card",
    "title": "Pie Chart Card",
    "description": "PieChartCard block. Controlled presentational card for category distributions, status proportions, and caseload composition breakdowns. Composes ChartCard and Chart primitives with a centered aggregate KPI and accessible tooltips.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/pie-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { PieChartCard } from '@/components/blocks/pie-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/pie-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add pie-chart-card"
  },
  {
    "id": "questionnaire",
    "name": "questionnaire",
    "title": "Questionnaire",
    "description": "Controlled multi-question assessment block with choice controls, validation summaries, and conditional step progression.",
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
    "importStatement": "import { Questionnaire } from '@/components/blocks/questionnaire';",
    "shadcnCommand": "npx shadcn@latest add @eolas/questionnaire",
    "eolasCommand": "npx @seany9915/eolas-ui add questionnaire"
  },
  {
    "id": "radar-chart-card",
    "name": "radar-chart-card",
    "title": "Radar Chart Card",
    "description": "Controlled radar chart card for multi-factor profile assessments and benchmark overlays, composing ChartCard and Chart with polar grids and legends.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/radar-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { RadarChartCard } from '@/components/blocks/radar-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/radar-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add radar-chart-card"
  },
  {
    "id": "radial-chart-card",
    "name": "radial-chart-card",
    "title": "Radial Chart Card",
    "description": "Controlled semicircle gauge card for capacity monitoring and target achievement, composing ChartCard and Chart with semantic arc colors.",
    "category": "blocks",
    "tier": "block",
    "basePrimitive": "Composite Block",
    "sourcePath": "src/components/blocks/radial-chart-card.tsx",
    "dependencies": [
      "react-is",
      "recharts@^3.0.0"
    ],
    "importStatement": "import { RadialChartCard } from '@/components/blocks/radial-chart-card';",
    "shadcnCommand": "npx shadcn@latest add @eolas/radial-chart-card",
    "eolasCommand": "npx @seany9915/eolas-ui add radial-chart-card"
  },
  {
    "id": "step-wizard",
    "name": "step-wizard",
    "title": "Step Wizard",
    "description": "Controlled multi-step workflow block with step sidebar, validation gates, hidden until-found preservation, and review actions.",
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
    "importStatement": "import { StepWizard } from '@/components/blocks/step-wizard';",
    "shadcnCommand": "npx shadcn@latest add @eolas/step-wizard",
    "eolasCommand": "npx @seany9915/eolas-ui add step-wizard"
  },
  {
    "id": "supporting-pane-block",
    "name": "supporting-pane-block",
    "title": "Supporting Pane Block",
    "description": "Controlled main workspace plus collapsible right-hand context pane for clinical references, notes, or AI assistance.",
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
    "importStatement": "import { SupportingPaneBlock } from '@/components/blocks/supporting-pane-block';",
    "shadcnCommand": "npx shadcn@latest add @eolas/supporting-pane-block",
    "eolasCommand": "npx @seany9915/eolas-ui add supporting-pane-block"
  }
];

export const REGISTRY_MAP: Record<string, RegistryEntry> = Object.fromEntries(
  REGISTRY_ENTRIES.map((entry) => [entry.id, entry])
);
