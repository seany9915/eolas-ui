# Eolas UI — Private Base UI Component Registry

eolas-ui is a private CLI distributor for the clinical Base UI component library and design system.

## Setup in a Consuming Project

### 1. Configure .npmrc
Ensure your project has access to GitHub Packages:

`ini
@seany9915:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=
`

### 2. Add Components to Any Project
Run eolas-ui to fetch components and their dependencies directly into your project's src/components/ui/ and src/lib/:

`ash
# List all 50 available components
npx @seany9915/eolas-ui list

# Add specific components (auto-fetches button and utils if needed)
npx @seany9915/eolas-ui add dialog select tabs

# Overwrite existing components to update to the latest version
npx @seany9915/eolas-ui add dialog --overwrite
`

### 3. Required Peer Dependencies
Ensure the consuming project has the peer dependencies installed:
`ash
npm install @base-ui/react clsx tailwind-merge
`
