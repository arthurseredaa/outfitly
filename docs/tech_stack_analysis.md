# Outfitly Tech Stack Analysis & Implementation Plan

**Date:** 2025-10-21
**Status:** Ready for Implementation
**Version:** 1.0

---

## 1. Executive Summary

### Thesis
The current project has a **solid foundational tech stack** aligned with PRD Phase 1 requirements. Strategic dependencies are missing for backend integration, AI vision processing, and monitoring. This document provides a complete dependency roadmap and phased implementation plan to reach MVP launch.

### Key Findings
- ✅ **Frontend foundation:** Vue 3.5 + TypeScript + Vite fully optimized
- ✅ **State management:** Pinia (modern composition API) properly configured
- ✅ **Testing infrastructure:** Vitest + @vue/test-utils ready
- ✅ **Code quality:** ESLint + Oxlint + Prettier comprehensive
- ⚠️ **Missing:** Supabase, AI APIs, image processing, monitoring
- ⚠️ **Missing:** UI framework, form validation, HTTP utilities

---

## 2. Current Tech Stack vs. PRD Requirements

### ✅ Already Implemented

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Vue 3 | 3.5.22 | ✅ |
| Language | TypeScript | 5.9 | ✅ |
| Build Tool | Vite | 7.1.7 | ✅ |
| State Mgmt | Pinia | 3.0.3 | ✅ |
| Router | Vue Router | 4.5.1 | ✅ |
| Testing | Vitest | 3.2.4 | ✅ |
| Test Utils | @vue/test-utils | 2.4.6 | ✅ |
| Linting | ESLint + Oxlint | 9.33.0 + 1.11.0 | ✅ |
| Formatting | Prettier | 3.6.2 | ✅ |
| Dev Tools | Vite Vue DevTools | 8.0.2 | ✅ |

### ⚠️ Missing from PRD Specification

| Layer | Technology | Purpose | Priority |
|-------|-----------|---------|----------|
| **Backend/Database** | Supabase Client | Auth, DB, Storage, Functions | 🔴 Critical |
| **AI Vision** | @anthropic-ai/sdk | Claude Vision API | 🔴 Critical |
| **AI Fallback** | openai | OpenAI Vision API fallback | 🔴 Critical |
| **Image Processing** | canvas/sharp | Image manipulation, compression | 🔴 Critical |
| **UI Components** | TailwindCSS | Styling framework | 🟠 High |
| **Form Validation** | vee-validate / zod | Input validation | 🟠 High |
| **HTTP Client** | axios/fetch wrapper | API communication utility | 🟠 High |
| **Monitoring** | @sentry/vue | Error tracking | 🟠 High |
| **Analytics** | posthog-js | Product analytics | 🟠 High |
| **Date Utilities** | date-fns | Date manipulation | 🟡 Medium |
| **Utilities** | lodash-es | Functional utilities | 🟡 Medium |
| **Type Safety** | @vueuse/core | Composition utilities | 🟡 Medium |
| **Icons** | @heroicons/vue | Icon library | 🟡 Medium |
| **Notifications** | @vueuse/notification | Toast/alerts | 🟡 Medium |

---

## 3. Detailed Dependency Recommendations

### Phase 1: Critical Backend & AI Integration (Week 1-2)

#### 3.1 Supabase Integration
```bash
npm install @supabase/supabase-js
```
**Why:** Complete BaaS solution for auth, database, storage, and edge functions
**Size:** ~200KB (gzipped)
**Integration Points:**
- `src/services/supabaseClient.ts` - Configuration and client initialization
- `src/stores/authStore.ts` - User authentication via Supabase Auth
- Database queries through RLS-enabled tables

**Configuration:**
```typescript
// .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

#### 3.2 Claude Vision API
```bash
npm install @anthropic-ai/sdk dotenv
```
**Why:** Primary AI segmentation engine (superior accuracy for clothing detection)
**Size:** ~250KB (gzipped)
**Note:** Backend-only, called from Supabase Edge Functions

**Integration:**
```typescript
// supabase/functions/process-photo/index.ts
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY")
})
```

---

#### 3.3 OpenAI SDK (Fallback)
```bash
npm install openai
```
**Why:** Fallback segmentation if Claude API fails
**Size:** ~180KB (gzipped)
**Strategy:** Implement graceful fallback in Edge Function with retry logic

---

### Phase 2: Image Processing & UI Framework (Week 2-3)

#### 3.4 Canvas/Sharp for Image Processing
```bash
npm install canvas sharp
# For server-side: npm install sharp --save-optional
```
**Why:** Client-side crop/compress, server-side optimization
**Size:** Canvas ~150KB; Sharp ~2MB (native bindings)

**Use Cases:**
- Client: Compress images before upload (target <5MB)
- Client: Generate thumbnail previews
- Server: Crop extracted clothing items to 200x200px

**Implementation:**
```typescript
// src/utils/imageProcessing.ts
export async function compressImage(file: File): Promise<Blob> {
  // Compress to WebP, target size <500KB
}
```

---

#### 3.5 TailwindCSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
**Why:** Utility-first CSS, mobile-first, WCAG A11y compliance built-in
**Size:** ~50KB (gzipped, tree-shaken)
**Configuration:**
- Mobile-first responsive design (320px+)
- Custom color palette for Outfitly brand
- Dark mode support (future feature)

**Tailwind Config:**
```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        accent: '#ec4899'   // Pink
      }
    }
  }
}
```

---

#### 3.6 Heroicons Vue
```bash
npm install @heroicons/vue
```
**Why:** Beautiful, accessible icons matching TailwindCSS aesthetic
**Size:** ~150KB (tree-shaken)

---

### Phase 3: Form & Input Management (Week 3)

#### 3.7 Vee-Validate + Zod
```bash
npm install vee-validate zod
```
**Why:** Type-safe form validation with Zod schema integration
**Replaces:** Manual form state management

**Example Schema:**
```typescript
// src/schemas/clothingItem.ts
import { z } from 'zod'

export const clothingItemSchema = z.object({
  category: z.enum(['top', 'mid', 'bottom', 'shoes', 'accessories']),
  color: z.string().min(1),
  notes: z.string().optional()
})
```

---

### Phase 4: Monitoring & Analytics (Week 4)

#### 3.8 Sentry Vue
```bash
npm install @sentry/vue @sentry/tracing
```
**Why:** Production error tracking and performance monitoring
**Size:** ~280KB (gzipped)

**Integration:**
```typescript
// src/main.ts
import * as Sentry from "@sentry/vue"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0
})
```

---

#### 3.9 PostHog Analytics
```bash
npm install posthog-js
```
**Why:** Product analytics (track DAU, feature usage, conversion funnels)
**Size:** ~180KB (gzipped)

**Events to Track:**
- `user_signup` - Conversion
- `photo_uploaded` - Feature usage
- `items_extracted` - Core metric
- `outfit_created` - Engagement
- `premium_signup` - Monetization

---

### Phase 5: Utilities & Quality of Life (Week 4-5)

#### 3.10 Utility Libraries

**@vueuse/core** - Vue composition utilities
```bash
npm install @vueuse/core
```
Benefits: `useTitle()`, `useStorage()`, `useFetch()`, `useAsyncState()`, etc.

**date-fns** - Date manipulation
```bash
npm install date-fns
```
Better than Moment.js (smaller, tree-shakeable)

**lodash-es** - Functional utilities
```bash
npm install lodash-es
# Tree-shakeable: only import what you use
import { debounce, throttle } from 'lodash-es'
```

---

## 4. Complete Dependency List

### Production Dependencies (Final)
```json
{
  "dependencies": {
    "pinia": "^3.0.3",
    "vue": "^3.5.22",
    "vue-router": "^4.5.1",
    "@supabase/supabase-js": "^2.40.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "openai": "^4.67.0",
    "sharp": "^0.33.0",
    "canvas": "^2.11.2",
    "zod": "^3.23.8",
    "vee-validate": "^4.13.0",
    "date-fns": "^3.3.1",
    "lodash-es": "^4.17.21",
    "@vueuse/core": "^11.0.0",
    "@heroicons/vue": "^2.1.1",
    "@sentry/vue": "^8.38.0",
    "@sentry/tracing": "^8.38.0",
    "posthog-js": "^1.181.0"
  }
}
```

### Dev Dependencies (New)
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.17",
    "@types/sharp": "^0.32.0"
  }
}
```

---

## 5. Build Size Impact Analysis

### Current Bundle Size
```
Frontend (Vue 3 + Pinia + Router): ~180KB (gzipped)
```

### With All New Dependencies (Optimized Tree-Shaking)
```
Supabase Client:       ~200KB
TailwindCSS:           ~50KB  (utility CSS)
Zod + Vee-Validate:    ~80KB
@vueuse/core:          ~30KB
date-fns:              ~15KB  (tree-shaken)
lodash-es:             ~10KB  (tree-shaken)
Sentry:                ~280KB (+ sourcemaps)
PostHog:               ~180KB
Icon library:          ~15KB  (tree-shaken)
Canvas/Sharp:          ~0KB   (optional, used client-side)

Total Impact:          ~860KB → **~1.2MB gzipped**
```

### Optimization Strategies
- ✅ Tree-shake unused utilities (lodash-es, date-fns)
- ✅ Lazy-load analytics (PostHog/Sentry after app load)
- ✅ Code-split main pages (wardrobe, outfit mixer) with `defineAsyncComponent`
- ✅ Keep Canvas/Sharp off main bundle (dynamic import)

---

## 6. Implementation Roadmap (Phase Timeline)

### Timeline Mapping to PRD (Week 1-8)

| Week | Phase | Dependencies | Tasks | Status |
|------|-------|--------------|-------|--------|
| **1-2** | Backend Setup | Supabase, @anthropic-ai/sdk, openai | Install Supabase, setup database schema, configure Edge Functions | 📋 Todo |
| **2-3** | Frontend Auth | (none - already have Supabase) | Build auth pages, implement Supabase Auth in Pinia | 📋 Todo |
| **3-4** | Photo Upload + AI | sharp, canvas | Build upload component, integrate Claude/OpenAI, process images | 📋 Todo |
| **4-5** | Wardrobe UI | TailwindCSS, @heroicons/vue | Build gallery, filters, item management | 📋 Todo |
| **5-6** | Outfit Mixing | TailwindCSS, @heroicons/vue | Build outfit canvas, drag-drop, save logic | 📋 Todo |
| **6-7** | Polish + Freemium | zod, vee-validate | Add usage limits, upgrade prompts, form validation | 📋 Todo |
| **7-8** | Monitoring + Launch | @sentry/vue, posthog-js | Error tracking, analytics, beta launch | 📋 Todo |

---

## 7. Setup Instructions

### 7.1 Phase 1 Installation (Week 1-2)

```bash
# Core backend integration
npm install @supabase/supabase-js @anthropic-ai/sdk openai dotenv

# Image processing (optional for Phase 1)
npm install sharp canvas

# Dev dependencies
npm install -D @types/sharp

# Verify installation
npm list | grep supabase
npm list | grep anthropic
```

### 7.2 Environment Variables (.env.local)

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# API Keys (backend only - via Edge Functions)
ANTHROPIC_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx

# Monitoring
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_POSTHOG_API_KEY=phc_xxx
```

### 7.3 Phase 2 Installation (Week 2-3)

```bash
# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npm install @heroicons/vue

# Setup Tailwind
npx tailwindcss init -p

# Add to src/main.css (create if needed)
@tailwind base;
@tailwind components;
@tailwind utilities;

# Import in src/main.ts
import './main.css'
```

### 7.4 Phase 3 Installation (Week 3)

```bash
# Form validation
npm install vee-validate zod

# Utilities
npm install date-fns lodash-es @vueuse/core
```

### 7.5 Phase 4 Installation (Week 4)

```bash
# Monitoring
npm install @sentry/vue @sentry/tracing posthog-js
```

---

## 8. Code Structure for New Dependencies

### 8.1 Supabase Client Service
```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 8.2 AI Service Layer
```typescript
// src/services/aiService.ts
import Anthropic from '@anthropic-ai/sdk'
import { OpenAI } from 'openai'

export async function segmentClothingItems(imageBase64: string) {
  // Try Claude first, fallback to OpenAI
}
```

### 8.3 Image Processing Utils
```typescript
// src/utils/imageProcessing.ts
import sharp from 'sharp'

export async function compressImage(file: File): Promise<Blob> {
  // Client-side compression using Canvas API
}
```

### 8.4 Validation Schemas
```typescript
// src/schemas/clothing.ts
import { z } from 'zod'

export const clothingItemSchema = z.object({
  category: z.enum(['top', 'mid', 'bottom', 'shoes', 'accessories']),
  color: z.string(),
  notes: z.string().optional()
})
```

### 8.5 Monitoring Setup
```typescript
// src/main.ts
import * as Sentry from '@sentry/vue'
import posthog from 'posthog-js'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE
})

posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
  api_host: 'https://us.posthog.com'
})
```

---

## 9. Performance Checklist

### Build Performance
- [ ] Tree-shaking enabled for lodash-es, date-fns
- [ ] PostHog and Sentry loaded async after app init
- [ ] Code-split major pages (wardrobe, outfit mixer)
- [ ] Target total bundle: <1.2MB gzipped

### Runtime Performance
- [ ] Image compression: <5s upload-to-wardrobe (PRD spec)
- [ ] Wardrobe load: <1s for 1000 items (pagination)
- [ ] Outfit mixing: <500ms for drag-drop interactions
- [ ] API responses: <200ms p95

### Monitoring
- [ ] Sentry sourcemaps configured
- [ ] PostHog event tracking on critical paths
- [ ] Core Web Vitals tracked and alerting

---

## 10. Risk Assessment & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Supabase API rate limits | Service degradation | Implement request queuing, cache wardrobe locally (IndexedDB) |
| Claude API cost overruns | Financial | Batch image processing, implement request limits |
| Large bundle size | Load time | Tree-shake, lazy-load, dynamic imports |
| Canvas not supported (older browsers) | Feature failure | Fallback to Server-side Sharp (via Edge Function) |
| Monitoring overhead | Performance | Load Sentry/PostHog async, skip in dev mode |

---

## 11. Testing Strategy for New Dependencies

### Unit Tests
```typescript
// src/__tests__/services/aiService.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { segmentClothingItems } from '@/services/aiService'

describe('aiService', () => {
  it('should segment clothing items from image', async () => {
    const result = await segmentClothingItems(imageBase64)
    expect(result).toHaveProperty('items')
    expect(result.items.length).toBeGreaterThan(0)
  })

  it('should fallback to OpenAI on Claude failure', async () => {
    // Mock Anthropic API failure
    const result = await segmentClothingItems(imageBase64)
    expect(result).toBeDefined()
  })
})
```

### Integration Tests
- Test Supabase auth flow end-to-end
- Test photo upload → AI segmentation → database storage
- Test form validation with Zod schemas

---

## 12. Deployment Considerations

### Vercel Deployment
```vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

### Supabase Edge Functions Deployment
```bash
# Deploy to Supabase
supabase functions deploy process-photo --no-verify
```

### Environment Variables by Stage
```
Development:  .env.local (git-ignored)
Staging:      .env.staging (Vercel preview)
Production:   .env.production (Vercel production)
```

---

## 13. Documentation & Onboarding

### New Developer Checklist
- [ ] Clone repo and run `npm install`
- [ ] Copy `.env.example` to `.env.local`, fill Supabase keys
- [ ] Run `npm run dev` (should start on port 5173)
- [ ] Verify Supabase connection in browser console
- [ ] Read `CLAUDE.md` for project conventions
- [ ] Run `npm run test:unit` to verify setup

### API Documentation
- Create OpenAPI spec for Supabase Edge Functions
- Document Claude Vision API response parsing
- Document Supabase RLS policies

---

## 14. Decision Log

### Why Supabase over Firebase?
- ✅ PostgreSQL more powerful than Firestore for queries
- ✅ Better control over database schema
- ✅ Edge Functions for backend logic (vs Cloud Functions)
- ✅ Native OAuth support

### Why Composition API + Pinia?
- ✅ Modern, simpler than Options API
- ✅ Better TypeScript support
- ✅ Less boilerplate

### Why TailwindCSS?
- ✅ Mobile-first, utility-first
- ✅ Built-in A11y, dark mode support
- ✅ Tree-shakeable, small footprint
- ✅ Matches Vue 3 modern philosophy

### Why Zod + Vee-Validate?
- ✅ Type-safe validation (Zod generates TS types)
- ✅ Vue-native form handling (Vee-Validate)
- ✅ Better than hand-written validators

---

## 15. Summary Table: Before vs. After

| Aspect | Before | After | Impact |
|--------|--------|-------|--------|
| **Frontend Stack** | Vue 3 + Pinia | + TailwindCSS + Icons | Better styling, faster development |
| **Backend** | None | Supabase (auth, DB, storage) | Complete BaaS solution |
| **AI Integration** | None | Claude + OpenAI Vision | Core feature enabled |
| **Image Processing** | None | Sharp + Canvas | Photo upload pipeline |
| **Forms** | None | Vee-Validate + Zod | Type-safe validation |
| **Monitoring** | None | Sentry + PostHog | Production observability |
| **Total Packages** | 10 | ~25 | +150% (mostly optional/tree-shaken) |
| **Bundle Size** | ~180KB | ~1.2MB gzipped | Acceptable with optimization |

---

## Next Steps

1. **Review & Approve** this tech stack document
2. **Phase 1 Install** (Week 1): Run dependency installations
3. **Setup Supabase** project with database schema
4. **Configure Environment** variables
5. **Implement** stores and services layer-by-layer

---

**Document Status:** ✅ Ready for Implementation
**Approved By:** [Pending Review]
**Next Review:** After Phase 1 completion
