# Outfitly - Product Requirements Document (PRD) v1.0

**Status:** Initial Planning | **Timeline:** 6-8 weeks MVP | **Target Launch:** Public Beta

---

## 1. Executive Summary

### Vision
Outfitly is an AI-powered virtual wardrobe platform that lets users upload photos, automatically extract clothing items via AI segmentation, and interactively mix them to create outfits. The platform enables personal style exploration while building infrastructure for future B2B partnerships with fashion retailers.

### Problem Statement
Users struggle to:
- Visualize how different clothing combinations look together
- Organize and manage their physical wardrobe digitally
- Get personalized outfit suggestions without manual effort
- Share and monetize their style

### Solution
A mobile-first web app that:
1. Extracts clothing items from user photos using AI vision
2. Categorizes items (tops, bottoms, shoes, accessories)
3. Enables interactive outfit mixing and preview
4. Provides outfit history and recommendations
5. Creates a scalable platform for future monetization

### Market Positioning
- **Primary Users:** Style-conscious individuals (18-45), fashion enthusiasts
- **Secondary Market:** Fashion retailers (B2B) for virtual try-on
- **Competitive Advantage:** Simple UX + AI efficiency + future enterprise capabilities

---

## 2. Product Scope & User Flow

### Core User Journey

```
1. User Signs Up → 2. Uploads Photo → 3. AI Segments Clothing →
4. Adds to Wardrobe → 5. Mixes Outfits → 6. Saves/Shares
```

### MVP Feature Set

#### Phase 1: Core Wardrobe Management
- **User Authentication** - Email/password signup, OAuth (Google)
- **Photo Upload** - Camera or gallery, image optimization
- **AI Segmentation** - Extract 1-5 items per photo using Claude/OpenAI Vision API
- **Item Classification** - Auto-suggest categories (top/mid/bottom/shoes/accessories)
- **Wardrobe Storage** - Save extracted items with metadata
- **Item Management** - View, edit category, delete items

#### Phase 2: Outfit Mixing & Preview
- **Outfit Canvas** - Interactive interface to combine items
- **Live Mixing** - Drag-and-drop items onto outfit preview
- **Outfit Templates** - Pre-defined outfit structures (casual, formal, athletic)
- **Save Outfits** - Store outfit combinations with timestamps
- **Outfit History** - View previously created outfits

#### Phase 3: Social & Monetization Layer (Post-MVP)
- **Share Outfits** - Public/private outfit sharing
- **Affiliate Links** - Link items to retailer products
- **Trend Analysis** - AI-powered styling recommendations
- **Enterprise API** - B2B integration for retailers

---

## 3. Technical Architecture

### Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Vue 3.5 + TypeScript + Vite | Type-safe, fast, already established |
| **State Mgmt** | Pinia | Scalable store architecture |
| **Backend** | Supabase (Firebase alternative) | BaaS, fast MVP development |
| **Database** | PostgreSQL (via Supabase) | Relational data, powerful queries |
| **Storage** | Supabase Storage + CDN | Optimized image delivery |
| **AI Service** | Claude Vision API + OpenAI Vision | High-quality segmentation |
| **Auth** | Supabase Auth + OAuth2 | User management built-in |
| **Hosting** | Vercel/Netlify | CI/CD, auto-scaling, edge functions |
| **Monitoring** | Sentry + PostHog | Error tracking + analytics |

### Database Schema (PostgreSQL)

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email STRING UNIQUE,
  username STRING,
  created_at TIMESTAMP,
  subscription_tier STRING (free/premium/enterprise)
)

-- Clothing Items
clothing_items (
  id UUID PRIMARY KEY,
  user_id UUID (FK → users),
  image_url STRING,
  category STRING (top/mid/bottom/shoes/accessories),
  color STRING,
  extracted_from_photo_id UUID,
  ai_confidence FLOAT,
  manual_review BOOLEAN,
  created_at TIMESTAMP
)

-- Outfits
outfits (
  id UUID PRIMARY KEY,
  user_id UUID (FK → users),
  name STRING,
  description TEXT,
  items JSON (array of clothing_item IDs),
  preview_image_url STRING (generated thumbnail),
  is_public BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Upload History
photo_uploads (
  id UUID PRIMARY KEY,
  user_id UUID (FK → users),
  original_image_url STRING,
  items_extracted INT,
  ai_service_used STRING (claude/openai),
  processing_status STRING (pending/completed/failed),
  created_at TIMESTAMP
)

-- Usage Tracking (for freemium)
usage_metrics (
  id UUID PRIMARY KEY,
  user_id UUID (FK → users),
  items_uploaded INT,
  outfits_created INT,
  current_month STRING,
  created_at TIMESTAMP
)
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Vue 3)                      │
│  - Auth pages, Upload, Wardrobe, Outfit Mixer, History │
└─────────────────────────────────────────────────────────┘
                          ↓
                    Vercel/Netlify
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase (Backend-as-a-Service)            │
├─────────────────────────────────────────────────────────┤
│ • Auth Layer (JWT, OAuth)                               │
│ • PostgreSQL Database (users, items, outfits)           │
│ • Storage (S3-compatible for images)                    │
│ • Edge Functions (image processing, AI orchestration)   │
└─────────────────────────────────────────────────────────┘
                          ↓
            ┌─────────────┴─────────────┐
            ↓                           ↓
     ┌────────────────┐        ┌──────────────────┐
     │ Claude API     │        │ OpenAI Vision    │
     │ (Primary)      │        │ (Fallback)       │
     │ 1-2s response  │        │ ~1-2s response   │
     └────────────────┘        └──────────────────┘
```

### Image Processing Pipeline

```
Upload Image
    ↓
Client-side validation & compression (1-5MB)
    ↓
Upload to Supabase Storage
    ↓
Trigger Supabase Edge Function
    ↓
Send to AI API (Claude/OpenAI)
    ↓
Parse AI Response (bounding boxes, category, confidence)
    ↓
For each detected item:
    - Crop sub-image
    - Optimize (WEBP, ~200KB)
    - Store in Supabase Storage
    - Create clothing_item record
    ↓
Update UI with extracted items
```

---

## 4. MVP Implementation Plan (6-8 Weeks)

### Week 1-2: Backend Setup & Infrastructure
- **Duration:** 10 days
- **Tasks:**
  - Set up Supabase project (database, auth, storage)
  - Create PostgreSQL schema and migrations
  - Configure Supabase Storage with CDN
  - Setup Vercel/Netlify deployment pipeline
  - Integrate Sentry for error tracking
- **Deliverable:** Production-ready backend infrastructure

### Week 2-3: Frontend Auth & User Management
- **Duration:** 10 days
- **Tasks:**
  - Implement Supabase Auth in Vue
  - Build signup/login/logout flows
  - Add OAuth (Google) integration
  - Create user profile page
  - Setup protected routes with middleware
- **Deliverable:** Full authentication system

### Week 3-4: Photo Upload & AI Integration
- **Duration:** 10 days
- **Tasks:**
  - Build file upload component with image preview
  - Implement image compression (client-side)
  - Integrate Claude Vision API for segmentation
  - Create fallback to OpenAI Vision API
  - Build processing status UI (loading states)
  - Store extracted items to database
- **Deliverable:** Working photo-to-wardrobe conversion

### Week 4-5: Wardrobe Management UI
- **Duration:** 8 days
- **Tasks:**
  - Build wardrobe gallery with filter/search
  - Implement item editing (category, notes, delete)
  - Add item preview modal
  - Create tagging system (color, style, season)
  - Setup pagination/lazy loading
- **Deliverable:** Full wardrobe browsing experience

### Week 5-6: Outfit Mixing & Creation
- **Duration:** 8 days
- **Tasks:**
  - Build outfit canvas interface
  - Implement drag-and-drop item placement
  - Create outfit templates (casual, formal, etc.)
  - Add live preview generation
  - Build outfit save/load functionality
  - Create outfit history view
- **Deliverable:** Core outfit mixing feature

### Week 6-7: Polish & Freemium Limits
- **Duration:** 8 days
- **Tasks:**
  - Add freemium usage limits (5 items/month free)
  - Implement upgrade prompts
  - UI/UX polish and refinement
  - Performance optimization
  - Mobile responsiveness testing
  - Add analytics tracking (PostHog)
- **Deliverable:** Launch-ready product

### Week 7-8: Testing, Docs & Public Beta Launch
- **Duration:** 8 days
- **Tasks:**
  - Comprehensive testing (unit + integration + E2E)
  - Write API documentation for future B2B
  - Create user onboarding flow
  - Setup beta testing program (50-100 users)
  - Create landing page and documentation
  - Monitor and fix bugs from beta feedback
- **Deliverable:** Public beta launch

---

## 5. Freemium Model & Monetization Strategy

### Phase 1: Freemium (MVP Launch)
- **Free Tier:**
  - 5 items/month from photos
  - Up to 10 outfits
  - No sharing
  - No export
- **Premium Tier ($4.99/month or $49/year):**
  - Unlimited items
  - Unlimited outfits
  - Public outfit sharing
  - Export as image/PDF
  - Advanced filters and search

### Phase 2: Affiliate & Retail Integration (3 months post-launch)
- **Link items to retailers** (H&M, Zara, Amazon Fashion)
- **Earn 5-10% commission** on referred purchases
- **Track which items drive sales**
- **Requires:** Product matching system, affiliate API integration

### Phase 3: Premium AI Features (6 months post-launch)
- **AI Stylist ($2.99/month add-on)**
  - Personalized outfit recommendations
  - Trend analysis for user's wardrobe
  - Weekly style inspiration
- **Requires:** ML models for style prediction, user preference training

### Phase 4: B2B/Enterprise (12+ months post-launch)
- **White-label Virtual Try-On for Fashion Retailers**
  - Custom-branded wardrobe app
  - Integration with retailer's product catalog
  - Advanced analytics on item popularity
  - Pricing: $5K-50K/month per retailer
- **Requires:** Multi-tenancy architecture, API, custom integrations

### Revenue Projection (Conservative)
```
Month 1-3 (Beta):     10K users,    $0 (beta only)
Month 4-6:            50K users,    $15K MRR (25% premium)
Month 12:             500K users,   $200K MRR (affiliate + premium)
Month 24:             2M users,     $1M MRR (+ 1-2 enterprise customers)
```

---

## 6. Technical Requirements & Constraints

### Performance Requirements
- **Photo Upload:** < 5 seconds end-to-end (upload + AI processing + storage)
- **Wardrobe Load:** < 1 second for 1000 items (pagination)
- **Outfit Mix:** < 500ms for interactions (drag-drop, canvas update)
- **API Response Time:** < 200ms p95 for all endpoints

### Security & Privacy
- **Encryption:** TLS for all traffic, at-rest encryption for images
- **Data Privacy:** GDPR compliant, user data never shared with AI vendors
- **Authentication:** JWT with secure refresh tokens
- **Image Processing:** Delete temporary AI processing files immediately
- **User Control:** Easy delete all data option

### Scalability
- **User Growth:** Handle 1M+ users with current architecture
- **Storage:** Supabase Storage auto-scales, optimize images at upload
- **AI Requests:** Implement request queuing to handle traffic spikes
- **Database:** Use connection pooling, optimize queries for large datasets

### Accessibility & Browser Support
- **Mobile-first design** - responsive from 320px width
- **A11y:** WCAG 2.1 AA compliance
- **Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Offline:** Cache wardrobe locally (IndexedDB)

### Cost Optimization
- **Image Optimization:** Compress to WEBP, resize intelligently
- **AI API Costs:** ~$0.01-0.05 per photo (batch requests to reduce calls)
- **Database:** Use indexed queries, archive old photos after 1 year
- **CDN:** Leverage Supabase CDN for image delivery (~$5/50GB)
- **Estimated monthly costs at 100K users:** ~$3-5K (scales to ~$20K at 1M users)

---

## 7. Success Metrics & KPIs

### Product Metrics (Month 1-3)
| Metric | Target | Notes |
|--------|--------|-------|
| Beta Users Acquired | 500-1000 | Via referral + social |
| Item Extraction Accuracy | >90% | User manual review rate |
| AI Processing Time | <5s | End-to-end |
| Daily Active Users (DAU) | >20% | Of total users |
| Outfit Created per User | >3 | Average |

### Business Metrics (Post-MVP)
| Metric | Target | Notes |
|--------|--------|-------|
| Premium Conversion | 20-30% | Standard SaaS benchmark |
| Monthly Churn | <5% | SaaS average: 5-7% |
| Customer Lifetime Value | >$200 | For premium users |
| Affiliate Revenue | 10-20% of MRR | By month 6 |

### Technical Metrics
| Metric | Target | Notes |
|--------|--------|-------|
| Uptime | >99.9% | SLA with Supabase |
| API Error Rate | <0.1% | Monitor with Sentry |
| Core Web Vitals | Green (Lighthouse) | Mobile performance |
| Database Query P95 | <100ms | Monitor with Supabase Logs |

---

## 8. Codebase Structure & Maintainability

### Frontend Directory Structure (Vue 3)
```
src/
├── components/
│   ├── Auth/              # Login, signup, profile
│   ├── Upload/            # Photo upload, progress
│   ├── Wardrobe/          # Gallery, item list, filters
│   ├── Outfit/            # Mixer, canvas, templates
│   ├── Common/            # Navbar, footer, modals
│   └── UI/                # Reusable: Button, Input, Card
├── views/
│   ├── AuthPage.vue
│   ├── WardrobePage.vue
│   ├── OutfitMixerPage.vue
│   ├── HistoryPage.vue
│   └── SettingsPage.vue
├── stores/                # Pinia stores
│   ├── authStore.ts       # User state, login/logout
│   ├── wardrobeStore.ts   # Items, wardrobe state
│   ├── outfitStore.ts     # Outfits, mixing state
│   └── uiStore.ts         # UI state, modals
├── services/
│   ├── supabaseClient.ts  # Supabase config
│   ├── aiService.ts       # Claude/OpenAI API calls
│   ├── imageService.ts    # Upload, compress, crop
│   └── api.ts             # API wrapper functions
├── types/
│   ├── database.ts        # DB schema interfaces
│   ├── models.ts          # Domain models
│   └── api.ts             # API response types
├── utils/
│   ├── imageProcessing.ts # Client-side image ops
│   ├── validators.ts      # Form validation
│   └── constants.ts       # App constants
├── router/
│   └── index.ts           # Route definitions
├── styles/
│   └── globals.css        # Tailwind or CSS-in-JS
└── main.ts                # App entry point
```

### Backend Architecture (Supabase Edge Functions)
```
supabase/
├── migrations/            # Database schema migrations
│   ├── 001_users.sql
│   ├── 002_clothing_items.sql
│   ├── 003_outfits.sql
│   └── 004_usage_metrics.sql
├── functions/
│   ├── process-photo/     # Main segmentation handler
│   │   └── index.ts       # Claude API orchestration
│   ├── generate-outfit-preview/
│   │   └── index.ts       # Create outfit thumbnails
│   └── sync-user-tier/    # Check subscription status
├── rls/                   # Row-Level Security policies
│   └── policies.sql       # Data access rules
└── seeds/
    └── development.sql    # Sample data for testing
```

### Code Quality Standards
- **Language:** TypeScript with strict mode
- **Linting:** ESLint + Oxlint (already configured)
- **Formatting:** Prettier (already configured)
- **Testing:** Vitest for unit tests, Playwright for E2E
- **Type Coverage:** Target 90%+
- **Comments:** JSDoc for public APIs, complex logic
- **Git Conventions:**
  - Branch naming: `feature/`, `fix/`, `docs/`
  - Commits: Conventional Commits (feat:, fix:, docs:)
  - PRs required before merge to main

### Documentation Requirements
- **API Documentation:** OpenAPI/Swagger for Supabase functions
- **Component Storybook:** Interactive component library
- **Architecture ADRs:** Decision records for major choices
- **Setup Guide:** New developer onboarding (< 15 min setup)
- **Deployment Guide:** One-click deployment to staging/production

---

## 9. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI Segmentation Accuracy < 80% | User frustration, churn | Add manual refinement tool, hybrid AI approach |
| High AI API Costs | Unsustainable at scale | Implement rate limiting, batch processing, move to self-hosted |
| Supabase Downtime | Data access issues | Multi-region backups, database replication |
| User Data Privacy Concerns | Regulatory/PR risk | Clear privacy policy, no 3rd party tracking, transparent AI usage |
| Competitive Threats (Pinterest, etc.) | Market share loss | Focus on simplicity + unique monetization, move fast |
| Slow Onboarding | Low DAU/retention | Simplified UI, tutorial flow, sample wardrobe for new users |

---

## 10. Future Roadmap (Beyond MVP)

### Q2 (Months 3-6 post-launch)
- Mobile app (React Native)
- Social features (follow, share, trends)
- Affiliate integration (product links)
- Advanced tagging (style, body shape, occasion)

### Q3-Q4 (Months 6-12)
- AI Stylist feature (recommendations)
- Size/fit tracking
- B2B pilot program (1-2 retailers)
- Browser extension for shopping

### Year 2
- Expand B2B partnerships
- Marketplace for stylists
- Advanced analytics for retailers
- AI-generated outfit suggestions

---

## 11. Success Criteria for MVP

- ✅ 500+ beta users with 50%+ DAU
- ✅ AI segmentation > 85% accuracy (user rated)
- ✅ < 5 second upload-to-wardrobe time
- ✅ 20%+ users create 3+ outfits
- ✅ Positive NPS (>30) from beta feedback
- ✅ Infrastructure supports 100K users without changes
- ✅ Clear path to freemium monetization (5%+ conversion expected)

---

## Appendix: Glossary

- **Segmentation:** AI process to identify and extract clothing items from photos
- **Wardrobe:** User's collection of extracted clothing items
- **Outfit:** Combination of multiple wardrobe items saved together
- **Freemium:** Free tier with limited features, paid premium tier for unlimited access
- **DAU:** Daily Active Users
- **NPS:** Net Promoter Score (customer satisfaction metric)
- **B2B:** Business-to-Business (selling to other companies)
- **BaaS:** Backend-as-a-Service (Supabase, Firebase, etc.)
- **Edge Functions:** Serverless functions running on CDN edge servers

---

**Document Version:** 1.0
**Last Updated:** 2025-10-19
**Next Review:** After MVP launch (6-8 weeks)
