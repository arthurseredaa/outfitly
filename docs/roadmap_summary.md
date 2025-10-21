# Outfitly MVP Roadmap - Quick Reference

**Timeline:** 6-8 weeks | **Status:** Ready to Begin | **Last Updated:** 2025-10-21

---

## At a Glance

### Current State
- ✅ Vue 3.5 + TypeScript + Vite configured
- ✅ Pinia state management ready
- ✅ Testing infrastructure (Vitest) ready
- ✅ Linting & formatting configured
- ⏳ Backend, AI APIs, UI framework **NOT YET INSTALLED**

### MVP Destination
```
Phase 0 (2d) → Phase 1 (7d) → Phase 2 (7d) → Phase 3 (7d) →
Phase 4 (7d) → Phase 5 (7d) → Phase 6 (7d) → Phase 7 (7d) = ~8 weeks
```

---

## Phase Overview

| Phase | Duration | Focus | Key Dependencies |
|-------|----------|-------|------------------|
| **0** | 2 days | Project setup, health check | None (already done) |
| **1** | 7 days | Backend infrastructure, AI APIs | Supabase, Claude/OpenAI, Sharp |
| **2** | 7 days | Authentication UI, navigation | Vue Router, Zod |
| **3** | 7 days | Photo upload, AI segmentation | Canvas, Supabase Edge Functions |
| **4** | 7 days | Wardrobe management, gallery | Vue, TailwindCSS, Heroicons |
| **5** | 7 days | Outfit mixer, creation & saving | Drag-drop, Canvas |
| **6** | 7 days | Freemium limits, monetization | Zod, usage tracking |
| **7** | 7 days | Testing, polish, beta launch | Sentry, PostHog, E2E tests |

---

## NPM Install Timeline

### Week 1 (Critical)
```bash
npm install @supabase/supabase-js @anthropic-ai/sdk openai sharp
npm install -D @types/sharp
```
**Impact:** Enables backend, AI, image processing

### Week 2 (High Priority)
```bash
npm install -D tailwindcss postcss autoprefixer
npm install @heroicons/vue
```
**Impact:** Enables UI development

### Week 3 (Medium Priority)
```bash
npm install vee-validate zod date-fns lodash-es @vueuse/core
```
**Impact:** Form validation, utilities

### Week 4 (Monitoring)
```bash
npm install @sentry/vue @sentry/tracing posthog-js
```
**Impact:** Production observability

---

## Key Architecture Decisions

### Frontend Stack
- **Framework:** Vue 3.5 (Composition API + `<script setup>`)
- **State:** Pinia (modern, simpler than Vuex)
- **Styling:** TailwindCSS (utility-first)
- **Build:** Vite (fast HMR, optimized builds)

### Backend Stack
- **BaaS:** Supabase (PostgreSQL + Auth + Storage)
- **Functions:** Edge Functions (for AI processing)
- **Database:** PostgreSQL (relational, powerful)

### AI Stack
- **Primary:** Claude Vision API (~$0.003/image)
- **Fallback:** OpenAI Vision API (~$0.006/image)
- **Model:** Vision (image segmentation)

### Image Processing
- **Client:** Canvas API (compress, preview)
- **Server:** Sharp (optimize, crop)

---

## Feature Rollout Order

```
Week 1-2: Backend + Auth ← FOUNDATION
  ↓
Week 2-3: Auth UI ← USER ACCOUNTS
  ↓
Week 3-4: Photo Upload + AI ← CORE VALUE
  ↓
Week 4-5: Wardrobe Gallery ← ORGANIZE
  ↓
Week 5-6: Outfit Mixer ← MAIN FEATURE
  ↓
Week 6-7: Freemium + Monetization ← SUSTAINABILITY
  ↓
Week 7-8: Testing + Launch ← GO PUBLIC
```

---

## Critical Milestones

| Milestone | Target Date | Criteria |
|-----------|-------------|----------|
| Backend ready | Day 7 | Supabase + AI APIs working |
| Auth working | Day 14 | Can sign up and sign in |
| Photo upload working | Day 21 | End-to-end: upload → AI → wardrobe |
| Wardrobe browsable | Day 28 | Gallery with 100+ items |
| Outfit mixer works | Day 35 | Create & save outfits |
| Freemium enforced | Day 42 | Limits checked, upgrade prompts shown |
| Beta ready | Day 56 | All testing done, monitoring live |

---

## Success Criteria for MVP Launch

From PRD Section 11:

- [ ] 50-100 beta users acquired
- [ ] 50%+ DAU (daily active users)
- [ ] AI segmentation accuracy >85% (user-rated)
- [ ] <5 second upload-to-wardrobe pipeline
- [ ] 20%+ of users create 3+ outfits
- [ ] NPS >30 from beta feedback
- [ ] Infrastructure supports 100K users
- [ ] Freemium conversion >5%

---

## File Structure (Final)

```
src/
├── main.ts                           # App entry
├── App.vue                           # Root
├── router/
│   ├── index.ts                      # Routes
│   └── middleware/
│       └── authMiddleware.ts         # Auth guard
├── stores/
│   ├── authStore.ts                  # User auth
│   ├── wardrobeStore.ts              # Items
│   ├── outfitStore.ts                # Outfits
│   └── uploadStore.ts                # Upload state
├── components/
│   ├── UI/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Card.vue
│   │   └── Modal.vue
│   ├── Auth/
│   │   ├── SignUpForm.vue
│   │   ├── SignInForm.vue
│   │   └── PasswordReset.vue
│   ├── Wardrobe/
│   │   ├── Gallery.vue
│   │   ├── ItemCard.vue
│   │   └── ItemEditor.vue
│   ├── Outfit/
│   │   ├── OutfitCanvas.vue
│   │   ├── ItemSlot.vue
│   │   ├── TemplateSelector.vue
│   │   └── OutfitPreview.vue
│   ├── Upload/
│   │   ├── PhotoUploader.vue
│   │   └── ProcessingStatus.vue
│   ├── Freemium/
│   │   ├── UpgradeModal.vue
│   │   └── LimitReachedBanner.vue
│   └── Common/
│       ├── Navbar.vue
│       └── Footer.vue
├── views/
│   ├── AuthPage.vue
│   ├── DashboardPage.vue
│   ├── WardrobePage.vue
│   ├── OutfitMixerPage.vue
│   ├── HistoryPage.vue
│   ├── SettingsPage.vue
│   ├── PricingPage.vue
│   └── LandingPage.vue
├── services/
│   ├── supabaseClient.ts             # Supabase init
│   ├── aiService.ts                  # AI orchestration
│   ├── imageService.ts               # Image handling
│   └── api.ts                        # API wrapper
├── types/
│   ├── database.ts                   # Generated from Supabase
│   ├── models.ts                     # Domain models
│   └── api.ts                        # API responses
├── schemas/
│   ├── auth.ts                       # Zod auth schemas
│   └── clothing.ts                   # Zod clothing schemas
├── utils/
│   ├── imageProcessing.ts            # Image compression
│   ├── validators.ts                 # Custom validators
│   ├── constants.ts                  # App constants
│   ├── freemium.ts                   # Limit checking
│   └── formatting.ts                 # Format helpers
├── config/
│   ├── ai.ts                         # AI settings
│   ├── freemium.ts                   # Freemium tiers
│   └── outfitTemplates.ts            # Outfit templates
├── styles/
│   └── main.css                      # Global + Tailwind
└── __tests__/
    ├── stores/
    ├── components/
    └── utils/
```

---

## Environment Variables

### Development (.env.local)
```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# AI APIs (backend-only)
ANTHROPIC_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx

# Monitoring (optional for MVP)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_POSTHOG_API_KEY=phc_xxx

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

---

## Quick Commands

### Development
```bash
yarn dev              # Start dev server (http://localhost:5173)
yarn build            # Type check + build
yarn test:unit        # Run tests
yarn lint             # Fix linting issues
yarn format           # Format with Prettier
```

### Deployment
```bash
# Automatic on git push to main
# Manual: vercel --prod

# Supabase functions
supabase functions deploy process-photo --no-verify
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Upload to wardrobe | <5s | TBD |
| Wardrobe load (1000 items) | <1s | TBD |
| Outfit mixing (interactions) | <500ms | TBD |
| API response (p95) | <200ms | TBD |
| Lighthouse mobile | >90 | TBD |
| Time to interactive | <3s | TBD |

---

## Risk Top 3

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI accuracy <80% | User frustration | Add manual refinement, hybrid AI |
| High API costs | Unsustainable scale | Rate limiting, caching, batch processing |
| Slow performance | Poor user experience | Virtual scrolling, code-split, optimization |

---

## Weekly Standup Template

```
Week X:
✅ Completed:
   - Phase Y Sprint Z: [feature]

🚧 In Progress:
   - [current task]

⚠️ Blockers:
   - [any blockers]

📊 Metrics:
   - Lines of code: XXX
   - Test coverage: XX%
   - Performance: [metrics]
   - Bugs: [count]

Next week focus:
   - [top priority]
```

---

## Deployment Pipeline

```
Local Dev → GitHub PR → CI/CD Tests → Staging
  ↓
Code Review → Merge to main
  ↓
Automatic deploy to Vercel production
  ↓
Monitor with Sentry + PostHog
```

### Deployment Checklist
- [ ] All tests passing
- [ ] Type checks pass
- [ ] Linting passes
- [ ] Performance acceptable
- [ ] No security vulnerabilities
- [ ] Monitoring configured
- [ ] Environment variables set

---

## Getting Started (Day 1)

1. **Read Core Docs**
   - [ ] This file (roadmap_summary.md)
   - [ ] `tech_stack_analysis.md` (detailed)
   - [ ] `implementation_plan.md` (detailed)
   - [ ] `CLAUDE.md` (project setup)

2. **Setup Environment**
   - [ ] Clone repo
   - [ ] `npm install`
   - [ ] Copy `.env.local` from `.env.example`
   - [ ] `npm run dev` (verify it starts)

3. **Setup Accounts**
   - [ ] Create Supabase project
   - [ ] Create Anthropic account
   - [ ] Create OpenAI account (fallback)
   - [ ] Create Sentry account (monitoring)

4. **First Sprint (Phase 0)**
   - [ ] Complete project health audit
   - [ ] Run `npm run build` ✅
   - [ ] Run `npm run test:unit` ✅
   - [ ] Run `npm run lint` ✅

5. **Begin Phase 1**
   - [ ] Setup Supabase database schema
   - [ ] Configure auth and storage
   - [ ] Test AI APIs with sample images

---

## Team Assignments (Example)

| Role | Phase(s) | Developer |
|------|----------|-----------|
| Backend | 1, 3, 7 | Dev 1 |
| Frontend | 2, 4, 5, 6 | Dev 2 |
| QA/DevOps | 0, 7 | Dev 1/2 |
| Product | All | PM |

---

## Resources

- **Vue 3 Docs:** https://vuejs.org/
- **Pinia:** https://pinia.vuejs.org/
- **Supabase:** https://supabase.com/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/
- **Claude API:** https://anthropic.com/docs

---

## Document Navigation

- 📋 **This file** - Quick reference, overview
- 📊 `tech_stack_analysis.md` - Technical deep dive (17 sections)
- 📅 `implementation_plan.md` - Week-by-week breakdown (detailed tasks)
- 📖 `prd_1.md` - Original product requirements

---

**Status:** ✅ Ready for implementation
**Owner:** Development team
**Last Review:** 2025-10-21
**Next Review:** After Phase 1 completion

