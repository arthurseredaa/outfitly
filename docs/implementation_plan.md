# Outfitly Implementation Plan - 8-Week MVP Roadmap

**Timeline:** 6-8 weeks to MVP launch
**Status:** Ready to Begin
**Last Updated:** 2025-10-21

---

## Overview

This document breaks down the PRD into actionable sprints, mapping tech stack installation to feature development. Each phase includes specific deliverables, testing requirements, and go/no-go criteria.

---

## Phase 0: Pre-Launch Setup (Days 1-2)

### ✓ Goal
Verify existing codebase health and prepare development environment.

### Tasks

#### 0.1 Project Health Audit
- [ ] Run `npm install` and verify all dependencies install cleanly
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run test:unit` - should pass existing test suite
- [ ] Run `npm run lint` - should pass linting with no errors
- [ ] Verify Vue DevTools working in browser
- [ ] Check Node version: `node --version` (should be ^20.19.0 or >=22.12.0)

#### 0.2 Repository Setup
- [ ] Create `.env.local` from template (see section below)
- [ ] Create `.env.example` for other developers
- [ ] Update `README.md` with development setup instructions
- [ ] Setup git hooks for pre-commit linting (optional)

#### 0.3 Environment Configuration
Create `.env.local` with placeholders:
```env
# Backend (Supabase - to be filled after project creation)
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# AI APIs (backend-only, to be filled)
ANTHROPIC_API_KEY=sk-[pending]
OPENAI_API_KEY=sk-[pending]

# Monitoring (optional for MVP)
VITE_SENTRY_DSN=https://[pending]@sentry.io/[pending]
VITE_POSTHOG_API_KEY=phc_[pending]

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

#### 0.4 Documentation Updates
- [ ] Create `CONTRIBUTING.md` with git conventions
- [ ] Update `CLAUDE.md` with new tech stack changes
- [ ] Create `DEVELOPMENT.md` with local setup steps

### Deliverables
- ✅ Clean build with no errors
- ✅ All tests passing
- ✅ Development environment ready
- ✅ Team alignment on tech stack

**Estimated Duration:** 4 hours
**Owner:** DevOps / Lead Developer
**Dependencies:** None

---

## Phase 1: Backend Infrastructure & AI Integration Setup (Week 1-2)

### 🎯 Goal
Build production-ready backend infrastructure with Supabase, configure AI APIs, establish database schema.

### Sprints

#### Sprint 1.1: Supabase Project Setup (Days 1-3)

**Tech:** Supabase, PostgreSQL

##### Tasks

1. **Create Supabase Project**
   - [ ] Create account at supabase.com
   - [ ] Create new project (region: closest to target users)
   - [ ] Copy project URL and anon key to `.env.local`
   - [ ] Enable multi-factor authentication for admin
   - [ ] Setup automated backups (daily)

2. **Database Schema Setup**
   - [ ] Create migration files in `supabase/migrations/`
   - [ ] Create `users` table with auth relationship
   - [ ] Create `clothing_items` table with proper indexes
   - [ ] Create `outfits` table with JSON support
   - [ ] Create `photo_uploads` table for tracking
   - [ ] Create `usage_metrics` table for freemium tracking
   - [ ] Create `Row-Level Security (RLS)` policies for all tables

3. **Supabase Auth Configuration**
   - [ ] Enable Email/Password auth
   - [ ] Configure OAuth (Google)
   - [ ] Set JWT expiry to 1 hour + 7-day refresh
   - [ ] Configure email templates (reset password, verify email)
   - [ ] Setup email sender domain

4. **Supabase Storage Configuration**
   - [ ] Create `wardrobe-images` bucket (private)
   - [ ] Create `outfit-previews` bucket (private)
   - [ ] Create `temp-uploads` bucket (auto-expiry in 24h)
   - [ ] Configure CDN for image delivery
   - [ ] Setup lifecycle rules (delete old temp files)

5. **Test Database Connection**
   - [ ] Write test script to verify connection
   - [ ] Create test user via Auth UI
   - [ ] Verify RLS policies work correctly
   - [ ] Test storage upload/download

**Deliverables:**
- Database schema deployed to production
- Auth configured (email + OAuth)
- Storage buckets created with CDN
- Connection verified from local dev environment

**Testing:**
```typescript
// test-supabase-connection.ts
import { supabase } from '@/services/supabaseClient'
console.log('Connected:', supabase.auth.session() !== null)
```

**Go/No-Go Criteria:**
- ✅ Can connect to Supabase from Vue app
- ✅ Can authenticate user
- ✅ Can write/read from database
- ✅ Can upload/download files from storage

---

#### Sprint 1.2: AI Integration Setup (Days 4-5)

**Tech:** @anthropic-ai/sdk, OpenAI API

##### Tasks

1. **Claude Vision API Setup**
   - [ ] Create Anthropic account and get API key
   - [ ] Create billing method on Anthropic Console
   - [ ] Test Claude Vision with sample clothing image
   - [ ] Document expected response format

2. **OpenAI Vision API Setup (Fallback)**
   - [ ] Create OpenAI account and get API key
   - [ ] Enable Vision API in account
   - [ ] Setup billing
   - [ ] Test Vision API with sample image

3. **Create Supabase Edge Function for Photo Processing**
   - [ ] Create `supabase/functions/process-photo/index.ts`
   - [ ] Implement Claude API call with image base64
   - [ ] Implement OpenAI fallback logic
   - [ ] Add error handling and retry logic
   - [ ] Add request validation
   - [ ] Test locally with `supabase functions serve`

4. **Edge Function Handler**
   ```typescript
   // supabase/functions/process-photo/index.ts
   import Anthropic from "@anthropic-ai/sdk"

   Deno.serve(async (req) => {
     const { imageBase64 } = await req.json()
     // Call Claude Vision API
     // Parse response
     // Store items in database
     // Return results
   })
   ```

5. **Create AI Service Layer**
   - [ ] Create `src/services/aiService.ts`
   - [ ] Implement client-side wrapper around Edge Function
   - [ ] Add TypeScript types for AI responses
   - [ ] Add error handling and timeouts

**Deliverables:**
- Edge Function deployed to Supabase
- AI service layer in frontend code
- Documentation on API costs and rate limits

**Testing:**
- [ ] Test Edge Function with sample image locally
- [ ] Verify JSON parsing of AI response
- [ ] Test error handling (API failure, invalid image)
- [ ] Measure response time (<5s target)

**Go/No-Go Criteria:**
- ✅ Edge Function returns valid clothing segmentation
- ✅ Fallback to OpenAI works when Claude fails
- ✅ Response time < 5 seconds
- ✅ Error handling works (malformed input, API errors)

---

#### Sprint 1.3: Dependency Installation & Configuration (Day 6)

**Tech:** npm packages

##### Tasks

1. **Install Production Dependencies (Phase 1)**
   ```bash
   npm install \
     @supabase/supabase-js \
     @anthropic-ai/sdk \
     openai \
     sharp
   ```
   - [ ] Verify all packages install without conflicts
   - [ ] Check for security vulnerabilities (`npm audit`)
   - [ ] Update `package-lock.json`

2. **Install Dev Dependencies (Phase 1)**
   ```bash
   npm install -D @types/sharp
   ```

3. **Create Service Layer Structure**
   - [ ] Create `src/services/supabaseClient.ts` - Supabase singleton
   - [ ] Create `src/services/aiService.ts` - AI orchestration
   - [ ] Create `src/services/imageService.ts` - Image handling
   - [ ] Create `src/types/database.ts` - Generated types from Supabase

4. **Generate Supabase Types**
   ```bash
   npx supabase gen types typescript --project-id xxx > src/types/database.ts
   ```

5. **Create Constants & Configuration**
   - [ ] Create `src/utils/constants.ts` with API endpoints
   - [ ] Create `src/config/ai.ts` with model settings

**Deliverables:**
- All dependencies installed
- Service layer structure created
- Types generated from Supabase schema

**Testing:**
- [ ] Run `npm run build` - should compile without errors
- [ ] Verify imports work: `import { useCounterStore } from '@/stores/counter'`
- [ ] Type-check: `npm run type-check`

**Go/No-Go Criteria:**
- ✅ Clean `npm install` with no security vulnerabilities
- ✅ No TypeScript compilation errors
- ✅ Service files created and imported correctly

---

#### Sprint 1.4: Authentication Store & API Wrapper (Day 7)

**Tech:** Pinia, Supabase Auth

##### Tasks

1. **Implement Auth Store**
   - [ ] Create `src/stores/authStore.ts` using Pinia Composition API
   - [ ] Add `user` reactive state (ref)
   - [ ] Add `isLoading` and `error` state
   - [ ] Implement `signUp(email, password)` action
   - [ ] Implement `signIn(email, password)` action
   - [ ] Implement `signInWithGoogle()` action
   - [ ] Implement `signOut()` action
   - [ ] Implement `checkAuth()` action (on app init)
   - [ ] Add `isAuthenticated` computed property

2. **Auth Store Code Example**
   ```typescript
   // src/stores/authStore.ts
   export const useAuthStore = defineStore('auth', () => {
     const user = ref<User | null>(null)
     const isLoading = ref(false)
     const error = ref<string | null>(null)

     async function signUp(email: string, password: string) {
       // Implementation
     }

     const isAuthenticated = computed(() => user.value !== null)

     return { user, isLoading, error, signUp, isAuthenticated }
   })
   ```

3. **Create API Wrapper**
   - [ ] Create `src/services/api.ts` with typed API calls
   - [ ] Implement `uploadPhoto(file: File)` wrapper
   - [ ] Implement `getWardrobe()` wrapper
   - [ ] Implement `getOutfits()` wrapper
   - [ ] Add error handling and logging
   - [ ] Add request timeout (30s default)

4. **Write Unit Tests for Auth Store**
   - [ ] Test `signUp()` with valid/invalid email
   - [ ] Test `signIn()` with valid/invalid credentials
   - [ ] Test `signOut()`
   - [ ] Test `checkAuth()` on app init
   - [ ] Mock Supabase Auth responses

5. **Create Auth Middleware**
   - [ ] Create `src/router/middleware/authMiddleware.ts`
   - [ ] Implement route protection logic
   - [ ] Redirect unauthenticated users to login

**Deliverables:**
- Auth store fully functional
- API wrapper with typed endpoints
- Unit tests for auth logic
- Route middleware for protection

**Testing:**
- [ ] Unit tests pass: `npm run test:unit`
- [ ] Manual testing: Sign up → verify email → sign in
- [ ] OAuth flow works (Google login)

**Go/No-Go Criteria:**
- ✅ Auth store tests pass
- ✅ Can sign up and sign in via UI
- ✅ User state persists across page reload
- ✅ OAuth (Google) login works

---

### Phase 1 Summary

**Total Duration:** 7 days
**Team Size:** 1-2 engineers
**Key Metrics:**
- Database queries: <100ms p95
- API responses: <200ms p95
- Error rate: <0.1%

**Go/No-Go Decision:**
- ✅ Proceed to Phase 2 if backend is stable and auth works
- ❌ Fix issues if any tests fail or rate limits are exceeded

---

## Phase 2: Frontend Auth & User Management (Week 2-3)

### 🎯 Goal
Build complete authentication UI with login, signup, password reset, user profile.

### Sprints

#### Sprint 2.1: UI Component Library Setup (Days 1-2)

**Tech:** TailwindCSS, @heroicons/vue

##### Tasks

1. **Install & Configure TailwindCSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   - [ ] Update `tailwind.config.ts` with Outfitly brand colors
   - [ ] Create `src/main.css` with Tailwind directives
   - [ ] Import CSS in `src/main.ts`
   - [ ] Create custom Tailwind theme (fonts, spacing)

2. **Install Heroicons**
   ```bash
   npm install @heroicons/vue
   ```
   - [ ] Test icon import in a component
   - [ ] Document icon usage

3. **Create Base UI Components**
   - [ ] Create `src/components/UI/Button.vue` - styled button
   - [ ] Create `src/components/UI/Input.vue` - text input with validation
   - [ ] Create `src/components/UI/Card.vue` - reusable card
   - [ ] Create `src/components/UI/Modal.vue` - modal dialog
   - [ ] Create `src/components/UI/Loading.vue` - loading spinner
   - [ ] Create `src/components/UI/Alert.vue` - alert/notification

4. **Write Storybook Documentation (Optional)**
   - [ ] Document Button variants (primary, secondary, danger)
   - [ ] Document Input states (focused, error, disabled)
   - [ ] Document responsive behavior

**Deliverables:**
- TailwindCSS configured
- Base UI components created
- Brand colors defined

**Testing:**
- [ ] Run `npm run build` - CSS should be properly processed
- [ ] Visual check: components render correctly with colors
- [ ] Responsive check: components work on mobile (320px)

---

#### Sprint 2.2: Auth Pages (Days 3-5)

**Tech:** Vue Router, Pinia, Vee-Validate + Zod

##### Tasks

1. **Install Form Validation**
   ```bash
   npm install vee-validate zod
   ```

2. **Create Validation Schemas**
   - [ ] Create `src/schemas/auth.ts`
   - [ ] Implement `signUpSchema` (email, password, confirm password)
   - [ ] Implement `signInSchema` (email, password)
   - [ ] Implement `resetPasswordSchema` (email)

   ```typescript
   // src/schemas/auth.ts
   import { z } from 'zod'

   export const signUpSchema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Min 8 characters'),
     confirmPassword: z.string()
   }).refine(
     data => data.password === data.confirmPassword,
     { message: "Passwords don't match", path: ["confirmPassword"] }
   )
   ```

3. **Create Sign Up Page**
   - [ ] Create `src/views/AuthPage.vue`
   - [ ] Implement form with email, password, confirm password
   - [ ] Implement Vee-Validate form handling
   - [ ] Add error messages
   - [ ] Add loading state
   - [ ] Implement auto-redirect on success
   - [ ] Add link to sign in page

4. **Create Sign In Page**
   - [ ] Create `src/views/SignInPage.vue`
   - [ ] Implement email + password form
   - [ ] Implement "Sign in with Google" button
   - [ ] Add "Forgot password?" link
   - [ ] Add loading state
   - [ ] Remember me checkbox (optional)

5. **Create Password Reset Flow**
   - [ ] Create `src/views/ForgotPasswordPage.vue`
   - [ ] Implement email input
   - [ ] Implement reset password confirmation
   - [ ] Create email reset confirmation page

6. **Create User Profile Page**
   - [ ] Create `src/views/ProfilePage.vue`
   - [ ] Display user info (email, username)
   - [ ] Implement change password form
   - [ ] Implement account deletion option
   - [ ] Add sign out button

7. **Setup Routes**
   - [ ] Update `src/router/index.ts` with auth routes
   - [ ] Add route protection middleware
   - [ ] Implement redirect logic for unauthenticated users

**Deliverables:**
- All auth pages complete
- Form validation with Zod
- Routes configured and protected

**Testing:**
- [ ] Unit tests for Zod schemas
- [ ] E2E test: Sign up flow
- [ ] E2E test: Sign in flow
- [ ] E2E test: Password reset flow
- [ ] Manual: Try invalid inputs (should show error)

**Go/No-Go Criteria:**
- ✅ Sign up creates user in Supabase
- ✅ Email verification works
- ✅ Sign in redirects to dashboard
- ✅ Protected routes block unauthenticated access
- ✅ Password reset email received

---

#### Sprint 2.3: Navigation & App Shell (Days 6-7)

**Tech:** Vue Router

##### Tasks

1. **Create App Shell Component**
   - [ ] Create `src/components/Common/AppShell.vue`
   - [ ] Add navbar with logo, nav links
   - [ ] Add user menu (profile, settings, logout)
   - [ ] Add mobile hamburger menu
   - [ ] Style with TailwindCSS

2. **Create Navigation Component**
   - [ ] Create `src/components/Common/Navbar.vue`
   - [ ] Add links: Dashboard, Wardrobe, Outfits, Settings
   - [ ] Show active route highlight
   - [ ] Mobile-responsive

3. **Create Footer (Optional)**
   - [ ] Create `src/components/Common/Footer.vue`
   - [ ] Add links to docs, privacy, terms
   - [ ] Add copyright

4. **Create Dashboard Placeholder**
   - [ ] Create `src/views/DashboardPage.vue`
   - [ ] Welcome message with user's name
   - [ ] Quick stats (items in wardrobe, outfits created)
   - [ ] Links to main features

5. **Update App.vue**
   - [ ] Wrap router-view with AppShell
   - [ ] Add global error boundary (optional)
   - [ ] Add Sentry error tracking (optional)

**Deliverables:**
- Complete app navigation structure
- Dashboard placeholder ready
- Mobile-responsive layout

**Testing:**
- [ ] All routes navigate correctly
- [ ] Mobile view responsive (test at 320px)
- [ ] Navbar active states work
- [ ] User menu shows/hides correctly

---

### Phase 2 Summary

**Total Duration:** 7 days
**Team Size:** 1-2 engineers

**Go/No-Go Decision:**
- ✅ Proceed to Phase 3 if auth system is solid
- ❌ Fix if sign up/sign in have bugs

---

## Phase 3: Photo Upload & AI Integration (Week 3-4)

### 🎯 Goal
Implement photo upload pipeline with image compression, AI segmentation, and item storage.

### Sprints

#### Sprint 3.1: Image Processing Utilities (Days 1-2)

**Tech:** Canvas API, Sharp

##### Tasks

1. **Create Client-Side Image Utils**
   - [ ] Create `src/utils/imageProcessing.ts`
   - [ ] Implement `compressImage()` - resize to max 2000px, quality 0.8, target <5MB
   - [ ] Implement `getImageDimensions()` - detect original size
   - [ ] Implement `canvasToBlob()` - convert canvas to Blob
   - [ ] Add error handling for unsupported formats

   ```typescript
   // src/utils/imageProcessing.ts
   export async function compressImage(file: File): Promise<Blob> {
     return new Promise((resolve, reject) => {
       const reader = new FileReader()
       reader.onload = (e) => {
         const img = new Image()
         img.onload = () => {
           const canvas = document.createElement('canvas')
           // Resize logic
           canvas.toBlob(resolve, 'image/webp', 0.8)
         }
         img.src = e.target?.result as string
       }
       reader.readAsDataURL(file)
     })
   }
   ```

2. **Create Image Validation**
   - [ ] Create `src/utils/validators.ts`
   - [ ] Implement `validateImageFile()` - check format, size, dimensions
   - [ ] Add supported formats check (JPG, PNG, WebP)
   - [ ] Add max size check (10MB)
   - [ ] Add minimum dimensions check (500x500px)

3. **Write Unit Tests**
   - [ ] Test image compression reduces size
   - [ ] Test invalid formats are rejected
   - [ ] Test oversized files are rejected
   - [ ] Test dimensions extracted correctly

**Deliverables:**
- Image processing utilities complete
- Validation logic working
- Unit tests pass

---

#### Sprint 3.2: Photo Upload Component (Days 3-4)

**Tech:** Vue 3, Pinia

##### Tasks

1. **Create Upload Component**
   - [ ] Create `src/components/Upload/PhotoUploader.vue`
   - [ ] Implement file input (accept images)
   - [ ] Implement drag-and-drop zone
   - [ ] Implement image preview
   - [ ] Show file size and dimensions
   - [ ] Add loading indicator

2. **Create Upload State Store**
   - [ ] Create `src/stores/uploadStore.ts`
   - [ ] Track `uploadProgress` (0-100)
   - [ ] Track `currentFile` being processed
   - [ ] Track `uploadHistory` (recent uploads)
   - [ ] Implement `uploadPhoto()` action
   - [ ] Implement error handling with retry

3. **Implement Upload Flow**
   - [ ] Validate image client-side
   - [ ] Show preview to user
   - [ ] Compress image
   - [ ] Send to Supabase Storage
   - [ ] Trigger Edge Function for AI processing
   - [ ] Poll for results (or use webhook)
   - [ ] Show extracted items to user

4. **Create Upload Page**
   - [ ] Create `src/views/UploadPage.vue`
   - [ ] Integrate PhotoUploader component
   - [ ] Show upload history
   - [ ] Add "Upload Another" button
   - [ ] Display extracted items when ready

5. **Handle Processing Status**
   - [ ] Create `src/components/Upload/ProcessingStatus.vue`
   - [ ] Show spinner while AI is processing
   - [ ] Show estimated time remaining
   - [ ] Allow cancel operation
   - [ ] Show success/error messages

**Deliverables:**
- Upload component with drag-and-drop
- Upload store with state management
- Processing status display
- Error handling and retry logic

**Testing:**
- [ ] Upload JPG file - should compress and upload
- [ ] Try oversized file - should reject
- [ ] Drag-and-drop works
- [ ] Progress bar updates
- [ ] Can cancel upload

**Go/No-Go Criteria:**
- ✅ Can upload image from file input
- ✅ Can drag-and-drop image
- ✅ Image compressed successfully
- ✅ File uploaded to Supabase Storage
- ✅ Upload progress visible to user

---

#### Sprint 3.3: AI Segmentation & Item Storage (Days 5-7)

**Tech:** Claude Vision API, Edge Functions, Supabase

##### Tasks

1. **Implement Complete Edge Function**
   - [ ] Update `supabase/functions/process-photo/index.ts`
   - [ ] Receive image from frontend
   - [ ] Call Claude Vision API with prompt:
     ```
     "Segment all clothing items in this image. For each item, provide:
     - Category (top, mid, bottom, shoes, accessories)
     - Color(s)
     - Description
     - Confidence score (0-1)
     Return as JSON array"
     ```
   - [ ] Parse Claude response
   - [ ] For each item: crop sub-image, compress to WebP
   - [ ] Upload cropped images to Supabase Storage
   - [ ] Create `clothing_item` records in database
   - [ ] Handle errors and fallback to OpenAI

2. **Create Clothing Item Model**
   - [ ] Create `src/types/models.ts`
   - [ ] Define `ClothingItem` interface matching database schema
   - [ ] Define `SegmentationResult` interface

3. **Create Wardrobe Store**
   - [ ] Create `src/stores/wardrobeStore.ts`
   - [ ] Track `items` array
   - [ ] Implement `fetchItems()` action
   - [ ] Implement `addItem()` action
   - [ ] Implement `deleteItem()` action
   - [ ] Implement `updateItem()` action (edit category, notes)
   - [ ] Add filtering by category

4. **Create Item Preview**
   - [ ] Create `src/components/Wardrobe/ItemCard.vue`
   - [ ] Display item image thumbnail
   - [ ] Show category, color, AI confidence
   - [ ] Add edit/delete buttons
   - [ ] Show manual review prompt if confidence < 0.8

5. **Create Item Editor Modal**
   - [ ] Create `src/components/Wardrobe/ItemEditor.vue`
   - [ ] Allow changing category
   - [ ] Allow changing color
   - [ ] Allow adding notes
   - [ ] Show original image + extracted image

6. **Test AI Integration**
   - [ ] Upload test image (clothing photo)
   - [ ] Verify Claude correctly identifies items
   - [ ] Verify items stored in database
   - [ ] Verify cropped images uploaded to storage
   - [ ] Test fallback to OpenAI

7. **Monitor API Costs**
   - [ ] Document Claude pricing: ~$0.003/image
   - [ ] Document OpenAI pricing: ~$0.006/image
   - [ ] Add usage tracking to database

**Deliverables:**
- Complete photo upload to wardrobe pipeline
- Edge Function handling segmentation
- Items stored in database with metadata
- UI for reviewing extracted items

**Testing:**
- [ ] Upload 5-10 test images with different clothing
- [ ] Verify segmentation accuracy >85%
- [ ] Verify all items stored in database
- [ ] Verify images accessible from storage
- [ ] Test error handling (invalid image, API failure)
- [ ] Performance: full pipeline <5 seconds

**Go/No-Go Criteria:**
- ✅ AI correctly identifies 3+ items per photo
- ✅ Items stored with correct category
- ✅ Full pipeline completes in <5 seconds
- ✅ Error handling works (API fails gracefully)
- ✅ Cost per photo reasonable (<$0.01)

---

### Phase 3 Summary

**Total Duration:** 7 days
**Team Size:** 1-2 engineers
**Deliverables:** Complete photo-to-wardrobe conversion pipeline

**Go/No-Go Decision:**
- ✅ Proceed to Phase 4 if segmentation accuracy good
- ❌ Iterate on AI prompts if accuracy <80%

---

## Phase 4: Wardrobe Management UI (Week 4-5)

### 🎯 Goal
Build wardrobe gallery with filtering, search, and item management.

### Sprints

#### Sprint 4.1: Wardrobe Gallery (Days 1-4)

**Tech:** Vue 3, Pinia, TailwindCSS

##### Tasks

1. **Create Wardrobe Gallery Component**
   - [ ] Create `src/components/Wardrobe/Gallery.vue`
   - [ ] Display items in grid (3-4 columns on desktop, 1-2 on mobile)
   - [ ] Use ItemCard sub-component for each item
   - [ ] Implement lazy loading (pagination)
   - [ ] Show "No items" state with upload link

2. **Implement Filtering**
   - [ ] Create filter sidebar/header:
     - Category filter (top/mid/bottom/shoes/accessories)
     - Color filter (multiple select)
     - Date range filter
   - [ ] Filter updates items in real-time
   - [ ] Store filter state in Pinia

3. **Implement Search**
   - [ ] Add search input (by color, notes, date)
   - [ ] Debounce search (300ms)
   - [ ] Update results in real-time
   - [ ] Show match highlighting

4. **Implement Sorting**
   - [ ] Sort by: Date Added (default), Confidence Score, Category
   - [ ] Ascending/Descending toggle

5. **Create Wardrobe Page**
   - [ ] Create `src/views/WardrobePage.vue`
   - [ ] Combine Gallery, Filters, Search
   - [ ] Show stats: Total items, items by category
   - [ ] Add "Upload Photo" button
   - [ ] Layout: Sidebar filters + main gallery

6. **Add Pagination/Infinite Scroll**
   - [ ] Load 20 items initially
   - [ ] Load more on scroll/pagination click
   - [ ] Show loading indicator

**Deliverables:**
- Full-featured wardrobe gallery
- Filtering, search, sort working
- Responsive layout (mobile-first)

**Testing:**
- [ ] Upload 50+ items, all visible
- [ ] Filter by category - only shows selected
- [ ] Search by color - finds items
- [ ] Sort by date works correctly
- [ ] Mobile layout responsive

**Go/No-Go Criteria:**
- ✅ Can browse 100+ items without performance issues
- ✅ Filters work correctly
- ✅ Search is responsive (<300ms)
- ✅ Layout responsive on mobile

---

#### Sprint 4.2: Item Management (Days 5-7)

**Tech:** Vue 3, Vee-Validate

##### Tasks

1. **Create Item Edit Modal**
   - [ ] Create `src/components/Wardrobe/ItemEditModal.vue`
   - [ ] Show original + extracted image side-by-side
   - [ ] Form to edit: category, color, notes, tags
   - [ ] Save changes to database
   - [ ] Cancel/Discard changes

2. **Implement Item Delete**
   - [ ] Add delete button to ItemCard
   - [ ] Confirm deletion dialog
   - [ ] Delete from database + storage
   - [ ] Update gallery in real-time

3. **Implement Bulk Actions**
   - [ ] Select multiple items (checkboxes)
   - [ ] Bulk delete
   - [ ] Bulk change category

4. **Create Item Detail View (Optional)**
   - [ ] Create `src/views/ItemDetailPage.vue`
   - [ ] Show full-size image
   - [ ] Show metadata: category, color, confidence, date added
   - [ ] Show which outfits use this item
   - [ ] Edit/delete buttons

5. **Add Image Management**
   - [ ] Show original uploaded image
   - [ ] Show AI-extracted image
   - [ ] Manual crop/adjust tool (optional, post-MVP)

6. **Implement Undo/Redo (Optional)**
   - [ ] Track edit history
   - [ ] Undo last edit
   - [ ] Redo

**Deliverables:**
- Complete item management features
- Edit, delete, bulk operations working
- Item detail view available

**Testing:**
- [ ] Edit item category - saves to DB
- [ ] Delete item - removes from gallery
- [ ] Bulk delete 10 items - all deleted
- [ ] Edit modal shows correct data
- [ ] Cancel discards changes

---

### Phase 4 Summary

**Total Duration:** 7 days
**Team Size:** 1-2 engineers

**Go/No-Go Decision:**
- ✅ Proceed to Phase 5 if wardrobe management is stable
- ❌ Fix UI bugs if wardrobe is slow or unresponsive

---

## Phase 5: Outfit Mixing & Creation (Week 5-6)

### 🎯 Goal
Implement interactive outfit builder with drag-and-drop, templates, and saving.

### Sprints

#### Sprint 5.1: Outfit Canvas & Drag-Drop (Days 1-4)

**Tech:** Vue 3, Pinia, drag-and-drop library

##### Tasks

1. **Install Drag-and-Drop Library**
   ```bash
   npm install vue-dnd
   ```

2. **Create Outfit Canvas Component**
   - [ ] Create `src/components/Outfit/OutfitCanvas.vue`
   - [ ] Layout: Left sidebar (item categories), center (canvas), right (preview)
   - [ ] Canvas shows slot for: tops, midlayers, bottoms, shoes, accessories
   - [ ] Drag items from sidebar to slots
   - [ ] Show live preview of outfit

3. **Create Outfit Store**
   - [ ] Create `src/stores/outfitStore.ts`
   - [ ] Track `currentOutfit` (id, name, items, createdAt)
   - [ ] Implement `createOutfit()` action
   - [ ] Implement `saveOutfit()` action
   - [ ] Implement `loadOutfit()` action
   - [ ] Implement `deleteOutfit()` action
   - [ ] Implement `updateOutfitSlot()` action (add/remove item)

4. **Create Item Slot Components**
   - [ ] Create `src/components/Outfit/ItemSlot.vue`
   - [ ] Show placeholder if empty
   - [ ] Show selected item image if filled
   - [ ] Drag-drop enabled
   - [ ] Click to open item selector

5. **Create Item Selector Modal**
   - [ ] Create `src/components/Outfit/ItemSelector.vue`
   - [ ] Show items for target category (e.g., all tops)
   - [ ] Filter/search within category
   - [ ] Click to select
   - [ ] Show selected item in slot

6. **Create Outfit Preview**
   - [ ] Create `src/components/Outfit/OutfitPreview.vue`
   - [ ] Stack selected items vertically (realistic outfit view)
   - [ ] Generate thumbnail (collage of all items)
   - [ ] Export as image (optional)

**Deliverables:**
- Interactive outfit canvas with drag-drop
- Live preview updating
- Item selection working

**Testing:**
- [ ] Drag top from sidebar to top slot
- [ ] Click bottom slot to select bottom
- [ ] Preview updates when items added
- [ ] Can remove items from slots
- [ ] Mobile: swipe to change items (optional)

---

#### Sprint 5.2: Outfit Templates & Saving (Days 5-7)

**Tech:** Vue 3

##### Tasks

1. **Create Outfit Templates**
   - [ ] Define template schemas in `src/config/outfitTemplates.ts`:
     - Casual: top + bottom + shoes
     - Formal: dress + shoes + accessories
     - Athletic: sport top + leggings + shoes
     - Business: blouse + pants + shoes + bag

2. **Create Template Selector**
   - [ ] Create `src/components/Outfit/TemplateSelector.vue`
   - [ ] Show template cards with icons
   - [ ] Click to load template
   - [ ] Update canvas with template slots

3. **Implement Outfit Saving**
   - [ ] Create save button on canvas
   - [ ] Show outfit name input modal
   - [ ] Save to database with items list (JSON)
   - [ ] Generate thumbnail image
   - [ ] Store outfit metadata (created_at, occasion, etc.)

4. **Create Outfit History**
   - [ ] Create `src/views/OutfitHistoryPage.vue`
   - [ ] Show all saved outfits as cards
   - [ ] Show preview thumbnail
   - [ ] Show date created
   - [ ] Click to edit outfit
   - [ ] Delete outfit button

5. **Create Outfit Detail View**
   - [ ] Create `src/components/Outfit/OutfitDetail.vue`
   - [ ] Show full outfit preview
   - [ ] List all items with images
   - [ ] Edit button (go back to canvas)
   - [ ] Delete button
   - [ ] Share button (optional, phase 2)

6. **Create Outfit Mixer Page**
   - [ ] Create `src/views/OutfitMixerPage.vue`
   - [ ] Integrate Canvas, Template selector
   - [ ] New/Load outfit buttons
   - [ ] Save functionality

**Deliverables:**
- Complete outfit creation and saving
- Outfit history view
- Templates working

**Testing:**
- [ ] Create outfit with 5 items - saves correctly
- [ ] Load outfit from history - all items restored
- [ ] Use template - slots pre-populated
- [ ] Edit saved outfit - changes saved
- [ ] Delete outfit - removed from history

**Go/No-Go Criteria:**
- ✅ Can create outfit with 3+ items
- ✅ Outfit saves to database
- ✅ Can load and edit saved outfit
- ✅ Preview generates correctly

---

### Phase 5 Summary

**Total Duration:** 7 days
**Team Size:** 1-2 engineers

**Deliverables:** Complete outfit mixing feature

---

## Phase 6: Freemium Limits & Monetization (Week 6-7)

### 🎯 Goal
Implement usage limits, upgrade prompts, and freemium business logic.

### Sprints

#### Sprint 6.1: Usage Tracking & Limits (Days 1-3)

**Tech:** Supabase, Pinia

##### Tasks

1. **Create Usage Metrics Table**
   - [ ] Schema already planned (see Phase 1)
   - [ ] Track: items_uploaded, outfits_created, current_month

2. **Implement Usage Tracking**
   - [ ] Update `wardrobeStore.ts` to track uploads
   - [ ] Update `outfitStore.ts` to track outfit creation
   - [ ] Call `recordUsage()` action after each action
   - [ ] Check limits before allowing action

3. **Create Usage Rules**
   ```typescript
   // src/config/freemium.ts
   const LIMITS = {
     free: {
       itemsPerMonth: 5,
       outfitsPerMonth: 10,
       shareOutfits: false,
       exportImage: false
     },
     premium: {
       itemsPerMonth: Infinity,
       outfitsPerMonth: Infinity,
       shareOutfits: true,
       exportImage: true
     }
   }
   ```

4. **Implement Limit Checking**
   - [ ] Create `src/utils/freemium.ts`
   - [ ] Function `canUploadItem()` - check limit
   - [ ] Function `canCreateOutfit()` - check limit
   - [ ] Function `getRemainingQuota()` - calculate remaining
   - [ ] Show "Limit reached" warning before action

**Deliverables:**
- Usage tracking working
- Limits enforced in UI

---

#### Sprint 6.2: Upgrade Prompts & UI (Days 4-7)

**Tech:** Vue 3, Pinia

##### Tasks

1. **Create Upgrade Modal**
   - [ ] Create `src/components/Freemium/UpgradeModal.vue`
   - [ ] Show pricing table: Free vs Premium
   - [ ] Features comparison matrix
   - [ ] "Upgrade Now" button
   - [ ] Can dismiss modal

2. **Create Limit Reached Banner**
   - [ ] Create `src/components/Freemium/LimitReachedBanner.vue`
   - [ ] Show current usage: "5/5 items used this month"
   - [ ] Show upgrade link
   - [ ] When does limit reset?

3. **Implement Upgrade Flow**
   - [ ] Create `src/views/PricingPage.vue`
   - [ ] Show Free and Premium tiers
   - [ ] "Subscribe" button triggers Stripe checkout (phase 2)
   - [ ] For MVP: show "Coming Soon" or mock payment

4. **Add Freemium UI Indicators**
   - [ ] Show tier badge in navbar (Free/Premium)
   - [ ] Show quota in dashboard
   - [ ] Disable premium features for free users

5. **Create Settings Page**
   - [ ] Create `src/views/SettingsPage.vue`
   - [ ] Show current tier
   - [ ] Show subscription details
   - [ ] Change password form
   - [ ] Delete account form
   - [ ] Privacy/terms links

6. **Implement Subscription UI (Mock)**
   - [ ] Create `src/components/Subscription/SubscriptionCard.vue`
   - [ ] Show current plan details
   - [ ] Show renewal date (if premium)
   - [ ] Manage subscription button (post-MVP: integrates with Stripe)

**Deliverables:**
- Freemium limits enforced
- Upgrade prompts shown at right moments
- Pricing page live
- Settings page complete

**Testing:**
- [ ] Upload 5 items as free user - 6th blocked
- [ ] Create 10 outfits as free user - 11th blocked
- [ ] Upgrade prompt shows when limit reached
- [ ] Premium features disabled for free users
- [ ] UI shows correct tier

**Go/No-Go Criteria:**
- ✅ Free users blocked at 5 items/month
- ✅ Upgrade prompt appears at right time
- ✅ Premium tier shows all features unlocked
- ✅ Subscription info displays correctly

---

### Phase 6 Summary

**Total Duration:** 7 days
**Team Size:** 1 engineer

**Go/No-Go Decision:**
- ✅ Proceed to Phase 7 if freemium working
- ❌ Test limits thoroughly before launch

---

## Phase 7: Polish, Testing & Public Beta Launch (Week 7-8)

### 🎯 Goal
Final QA, performance optimization, monitoring setup, beta launch.

### Sprints

#### Sprint 7.1: Code Quality & Testing (Days 1-3)

**Tech:** Vitest, TypeScript, ESLint

##### Tasks

1. **Complete Unit Test Coverage**
   - [ ] Target 80%+ coverage on stores (authStore, wardrobeStore, outfitStore)
   - [ ] Target 50%+ coverage on components
   - [ ] Test critical paths:
     - Auth signup/signin
     - Photo upload
     - AI segmentation
     - Outfit creation
     - Limit checking

2. **Write Integration Tests**
   - [ ] Full signup → upload → wardrobe → create outfit flow
   - [ ] Payment flow (mock)
   - [ ] Error recovery scenarios

3. **E2E Testing (Manual + Playwright)**
   - [ ] Create `e2e/auth.spec.ts` - sign up, sign in, password reset
   - [ ] Create `e2e/upload.spec.ts` - upload photo, verify items
   - [ ] Create `e2e/outfit.spec.ts` - create outfit, save, load
   - [ ] Create `e2e/freemium.spec.ts` - hit limits, upgrade prompt

4. **Type Safety Check**
   - [ ] Run `npm run type-check`
   - [ ] Fix any TypeScript errors
   - [ ] Target 0 `any` types

5. **Linting & Formatting**
   - [ ] Run `npm run lint` - fix all issues
   - [ ] Run `npm run format` - auto-format
   - [ ] Add pre-commit hook to enforce

6. **Performance Testing**
   - [ ] Lighthouse score >90 on all pages (mobile)
   - [ ] Time to interactive (TTI) <3s
   - [ ] First Contentful Paint (FCP) <1.5s
   - [ ] Cumulative Layout Shift (CLS) <0.1

**Deliverables:**
- Test coverage >80% for stores
- Zero TypeScript errors
- Lighthouse scores >90
- All tests passing

---

#### Sprint 7.2: Monitoring & Analytics Setup (Days 4-5)

**Tech:** Sentry, PostHog

##### Tasks

1. **Setup Sentry Error Tracking**
   ```bash
   npm install @sentry/vue @sentry/tracing
   ```
   - [ ] Create Sentry account
   - [ ] Get project DSN
   - [ ] Initialize in `src/main.ts`
   - [ ] Configure error boundaries
   - [ ] Test error reporting

2. **Setup PostHog Analytics**
   ```bash
   npm install posthog-js
   ```
   - [ ] Create PostHog account
   - [ ] Initialize in `src/main.ts`
   - [ ] Add event tracking:
     - `user_signup` - track signups
     - `photo_uploaded` - track uploads
     - `items_extracted` - track extraction
     - `outfit_created` - track engagement
     - `upgrade_clicked` - track monetization
   - [ ] Setup funnels: signup → upload → outfit creation

3. **Create Monitoring Dashboard**
   - [ ] Track uptime (via Sentry)
   - [ ] Track error rate (<0.1% target)
   - [ ] Track API response times
   - [ ] Track user funnel: signup → activation

4. **Setup Alerts**
   - [ ] Alert if error rate >1%
   - [ ] Alert if API response time >500ms
   - [ ] Alert if Supabase down

**Deliverables:**
- Sentry configured and working
- PostHog tracking events
- Monitoring dashboards created

---

#### Sprint 7.3: UI/UX Polish (Days 6)

**Tech:** CSS, Vue animations

##### Tasks

1. **Fix Mobile Responsiveness**
   - [ ] Test all pages on iPhone SE (375px)
   - [ ] Test on iPad (768px)
   - [ ] Fix any layout issues
   - [ ] Ensure touch targets >44px

2. **Add Animations & Transitions**
   - [ ] Page transitions (fade in/out)
   - [ ] Item animations (stagger grid)
   - [ ] Button hover states
   - [ ] Loading spinners with smooth animation

3. **Improve Accessibility**
   - [ ] Add focus indicators on all inputs
   - [ ] Ensure color contrast >4.5:1
   - [ ] Add aria-labels to images
   - [ ] Test with keyboard navigation
   - [ ] Test with screen reader (NVDA/JAWS)

4. **Refine Copy & Messaging**
   - [ ] Review all error messages (clear, helpful)
   - [ ] Review all prompts/buttons (clear CTAs)
   - [ ] Check grammar/spelling
   - [ ] Ensure friendly tone

5. **Fix Known Bugs**
   - [ ] Go through issue tracker
   - [ ] Fix all critical bugs
   - [ ] Triage non-critical for post-MVP

**Deliverables:**
- App fully responsive
- Accessibility improved
- Copy refined
- Bugs fixed

---

#### Sprint 7.4: Beta Launch Preparation (Day 7)

**Tech:** Documentation, deployment

##### Tasks

1. **Create Landing Page**
   - [ ] Create `src/views/LandingPage.vue`
   - [ ] Hero section with value prop
   - [ ] Features section (upload, mix, save)
   - [ ] Sign up CTA
   - [ ] Screenshots/demo video (optional)
   - [ ] Footer with links

2. **Write Documentation**
   - [ ] Create `docs/USER_GUIDE.md` - how to use app
   - [ ] Create `docs/TROUBLESHOOTING.md` - common issues
   - [ ] Create `docs/FAQ.md` - frequently asked questions
   - [ ] Create `PRIVACY.md` - privacy policy
   - [ ] Create `TERMS.md` - terms of service

3. **Setup Beta Testing Program**
   - [ ] Create Google Form for beta signup
   - [ ] Define beta tester selection criteria (50-100 users)
   - [ ] Create feedback form/survey
   - [ ] Setup Discord channel for beta feedback (optional)

4. **Deployment to Staging**
   - [ ] Deploy to Vercel staging environment
   - [ ] Run smoke tests on staging
   - [ ] Verify all features work end-to-end
   - [ ] Performance test on staging

5. **Deployment to Production**
   - [ ] Deploy to Vercel production
   - [ ] Setup custom domain (outfitly.app)
   - [ ] Configure SSL certificate
   - [ ] Setup CDN caching
   - [ ] Verify production working

6. **Create Onboarding Flow**
   - [ ] New user tour (optional, post-MVP)
   - [ ] Welcome email
   - [ ] Sample wardrobe for first-time users (optional)

7. **Setup Monitoring**
   - [ ] Verify Sentry capturing errors in production
   - [ ] Verify PostHog tracking events
   - [ ] Monitor server uptime
   - [ ] Setup daily sync of metrics

**Deliverables:**
- Landing page live
- Documentation complete
- Beta signup form ready
- Production deployment ready

---

#### Sprint 7.5: Beta Launch & Support (Optional extra days)

**Tasks**
- [ ] Send beta signup emails to target users
- [ ] Monitor Sentry for production errors
- [ ] Monitor PostHog for user behavior
- [ ] Respond to beta feedback
- [ ] Fix critical bugs immediately
- [ ] Collect NPS feedback from beta users
- [ ] Iterate based on feedback

**Success Criteria (MVPGoal from PRD):**
- ✅ 50-100 beta users acquired
- ✅ 50%+ DAU (daily active users)
- ✅ AI segmentation accuracy >85% (user-rated)
- ✅ <5 second upload-to-wardrobe time
- ✅ 20%+ users create 3+ outfits
- ✅ NPS >30 from beta feedback
- ✅ Infrastructure handles 100K users
- ✅ Freemium conversion 5%+

---

### Phase 7 Summary

**Total Duration:** 7 days
**Team Size:** 2 engineers (1 QA, 1 deployment)

**Go/No-Go Decision:**
- ✅ Launch beta if all success criteria met
- ❌ Extend if critical bugs remain

---

## Critical Path Summary

### Fast Track (6 weeks, full team)
```
Phase 0 (2 days) → Phase 1 (7 days) → Phase 2 (7 days) →
Phase 3 (7 days) → Phase 4 (7 days) → Phase 5 (7 days) →
Phase 6 (7 days) → Phase 7 (5 days) = 6 weeks total
```

### Standard Track (8 weeks, 1-2 developers)
- Same phases, 1 additional buffer week
- More thorough testing
- More polish iterations

---

## Dependency Installation Timeline

### Week 1
```bash
npm install @supabase/supabase-js @anthropic-ai/sdk openai sharp
```

### Week 2
```bash
npm install -D tailwindcss postcss autoprefixer
npm install @heroicons/vue
```

### Week 3
```bash
npm install vee-validate zod date-fns lodash-es @vueuse/core
```

### Week 4
```bash
npm install @sentry/vue @sentry/tracing posthog-js
```

### Week 5-8
- No new major dependencies (only bug fixes/patches)

---

## Risk Mitigation

| Phase | Risk | Mitigation |
|-------|------|-----------|
| 1 | Supabase quota exceeded | Implement rate limiting, caching |
| 2 | Auth bugs | Comprehensive testing, OAuth fallback |
| 3 | AI accuracy poor | Hybrid approach, manual review tool |
| 4 | Gallery slow with 1000+ items | Pagination, virtual scrolling, indexing |
| 5 | Canvas drag-drop bugs | Fallback to click-to-select, cross-browser testing |
| 6 | Freemium leakage | Strict enforcement, audit logs |
| 7 | Production bugs | Sentry alerting, quick hotfix process |

---

## Success Metrics Dashboard

Track these metrics weekly:

```
┌─────────────────────────────────────────┐
│ Development Progress                     │
├─────────────────────────────────────────┤
│ Phase Completion: [████░░░░░░] 40%      │
│ Feature Completion: [██████░░░░] 60%    │
│ Test Coverage: [██████████░░] 84%       │
│ Bug Count: 12 → 6 (50% reduction)       │
│ Performance:                             │
│  - API Response: 150ms ✅                │
│  - Page Load: 1.2s ✅                    │
│  - Lighthouse: 92 ✅                     │
└─────────────────────────────────────────┘
```

---

## Appendix: Command Reference

### Development
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview build locally
npm run type-check    # TypeScript check
npm run lint          # ESLint + Oxlint fixes
npm run format        # Prettier formatting
npm run test:unit     # Run Vitest unit tests
```

### Supabase
```bash
supabase start        # Local development
supabase functions serve      # Local edge functions
supabase db reset     # Reset local database
supabase gen types    # Generate TypeScript types
supabase functions deploy    # Deploy to production
```

### Deployment
```bash
# Vercel (automatic on git push main)
# Manual deployment:
npm run build
vercel --prod
```

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** 2025-10-21
**Next Review:** Weekly during development

