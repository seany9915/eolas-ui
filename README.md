# Eolas UI

Eolas UI is an accessible, production-grade design system built on **Base UI (@base-ui/react)** and Tailwind CSS.

## 🚀 Quick Start — Add Components to Any Project

You can add components directly to any React codebase using standard registry tooling:

`ash
# Example: Adding Dialog (automatically installs dependencies and utilities)
npx shadcn add https://seany9915.github.io/eolas-ui/r/dialog.json
`

Or configure components.json once in your project:
`json
{
  ": https://ui.shadcn.com/schema.json,
 registries: {
 @eolas: https://seany9915.github.io/eolas-ui/r/{name}.json
 }
}
`

Then add any of the 50 components on demand:
`ash
npx shadcn add @eolas/button
npx shadcn add @eolas/dialog
npx shadcn add @eolas/select
npx shadcn add @eolas/tabs
npx shadcn add @eolas/navigation-menu
`

---

## 📦 What is Included?

All 37 official Base UI primitives + clinical UI components:
* **Layout & Navigation:** 
avigation-menu, abs, menubar, oolbar, scroll-area, separator, direction-provider
* **Overlays & Dialogs:** dialog, lert-dialog, drawer, popover, ooltip, preview-card
* **Form & Selection:** select, combobox, utocomplete, checkbox, checkbox-group, adio, switch, slider, 
umber-field, otp-field, input, ield, ieldset, orm
* **Feedback & Status:** oast, inline-alert, progress, meter, skeleton, chip
* **Utilities:** utils (re-exporting Base UI prop composition & headless render hooks)
