# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Install dependencies
yarn install

# Development with hot-reload
yarn dev

# Build for production (type-check + minify)
yarn build

# Run unit tests
yarn test:unit

# Run a single test file
yarn test:unit src/__tests__/App.spec.ts

# Lint and auto-fix code
yarn lint

# Format code with Prettier
yarn format
```

## Project Overview

**Outfitly** is a Vue 3 + TypeScript wardrobe/outfit management application. It's currently in early stages with a solid foundation but minimal feature implementation.

### Key Tech Stack
- **Framework:** Vue 3.5.22 with Composition API (`<script setup>` syntax)
- **State Management:** Pinia (composition API style)
- **Router:** Vue Router 4.5.1
- **Build Tool:** Vite 7.1.7 (with hot-module reloading)
- **Language:** TypeScript 5.9
- **Testing:** Vitest 3.2.4 + @vue/test-utils
- **Linting:** ESLint 9.33.0 + Oxlint 1.11.0
- **Formatting:** Prettier 3.6.2

### Node Version
Requires Node.js `^20.19.0` or `>=22.12.0`

## Architecture & Data Flow

### Entry Point
`src/main.ts` - Bootstraps the Vue app, initializes Pinia store and Vue Router

### Key Directories
```
src/
├── main.ts                 # App initialization
├── App.vue                 # Root component (currently a placeholder)
├── router/index.ts         # Route definitions (currently empty)
├── stores/                 # Pinia stores
│   └── counter.ts         # Demo store (composition API pattern)
├── __tests__/             # Unit tests (Vitest)
└── (Ready for expansion)
    ├── views/             # Page-level components
    ├── components/        # Reusable components
    ├── types/             # TypeScript interfaces
    └── utils/             # Helper functions
```

### State Management Pattern
The project uses **Pinia with Composition API style** (modern approach):
- `ref()` for reactive state
- `computed()` for derived state
- Regular functions for actions

**Example from `src/stores/counter.ts`:**
```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})
```

### Data Flow
```
Component → Dispatch Store Action → Store Mutation (ref update)
→ Computed Properties → Template Re-render → DOM Update
```

Component communication follows Vue conventions:
- **Props down** from parent to child
- **Events up** from child to parent
- **Global state** accessed via `useXxxStore()` from any component

### Router Structure
Currently has empty routes array in `src/router/index.ts`. Expected future routes for outfit viewing, wardrobe management, outfit creation, etc.

## Important Patterns & Conventions

### Script Syntax
All components use modern `<script setup>` syntax (no separate script block):
```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
```

### Type Safety
- Full TypeScript coverage expected
- Use `vue-tsc --build` for type checking (run by `yarn build`)
- Volar extension recommended in VS Code for `.vue` file type support

### Testing
- Use Vitest for unit tests
- Place tests in `src/__tests__/` directory following the pattern in `App.spec.ts`
- Use `@vue/test-utils` to mount and test components

### Code Quality
- **ESLint** checks TypeScript/Vue files (flat config in `eslint.config.ts`)
- **Oxlint** runs as secondary linter for additional correctness checks
- **Prettier** formats code automatically
- Run `yarn lint` to auto-fix all issues, then `yarn format` to format

## Module Path Alias
`@` is aliased to `./src` for cleaner imports:
```typescript
// Instead of: import Counter from '../../../stores/counter'
// Use: import { useCounterStore } from '@/stores/counter'
```

## Development Notes

### Hot Module Reloading
`yarn dev` provides HMR during development. Changes to Vue components, stores, and styles reflect immediately without page reload.

### Vue DevTools
- Debugging in browser: Install Vue.js DevTools extension (Chrome/Firefox)
- Inspect component hierarchy, store state, emitted events
- Configuration available via `vite-plugin-vue-devtools` in `vite.config.ts`

### Build Output
- Development: Served by Vite dev server on `http://localhost:5173` (default)
- Production: Built to `dist/` directory, minified and optimized
- Type checking is part of the build process (`yarn build` runs `vue-tsc` first)

## Future Development Guidance

1. **Create feature stores** in `src/stores/` (e.g., `wardrobe.ts`, `outfit.ts`) following the composition API pattern
2. **Add page components** in `src/views/` and define routes in `src/router/index.ts`
3. **Build reusable components** in `src/components/` with proper TypeScript typing
4. **Create type definitions** in `src/types/` for domain models (Clothing, Outfit, etc.)
5. **Test every store and component** - tests go in `src/__tests__/` mirroring the source structure
6. **Use props and emits** for component communication; Pinia for cross-component state

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vite.dev/)
- [Vitest Documentation](https://vitest.dev/)
