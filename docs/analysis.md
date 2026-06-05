# Voglio — Project Analysis & Improvement Roadmap

## What Is Voglio?

**Voglio** ("I want" in Italian) is a personal wishlist / collection management web app. Users create emoji-tagged categories (e.g., "Books", "Gadgets") and populate them with items called "voglios" — each with a name, price, quantity, reference link, description, and image. It's mobile-first with a bottom nav bar and responsive dialogs/drawers.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 |
| Language | TypeScript 5.6.2 |
| Build Tool | Vite 6.0.5 |
| Styling | Tailwind CSS 3.4.17 + tailwindcss-animate |
| UI Library | shadcn/ui (New York style) |
| Routing | React Router 7.1.1 |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage) |
| Image Hosting | Supabase Storage |
| Icons | Lucide React, Heroicons |
| State Mgmt | React useState / useEffect (local only) |
| Auth | Supabase Auth (email/password) |

### Project Structure

```
voglio-web-app/
├── .env                        # Supabase credentials
├── .idx/                       # Google IDX cloud IDE config
├── components.json             # shadcn/ui config
├── lib/utils.ts                # cn() utility
├── public/
├── src/
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # Entry point
│   ├── supabase-client.ts      # Supabase init
│   ├── components/
│   │   ├── ui/                 # shadcn/ui (15 components)
│   │   ├── category/           # CategoryForm, CategoryPreview
│   │   ├── voglio/             # VoglioForm (2-step), VoglioPreview
│   │   ├── Navbar.tsx          # Bottom nav
│   │   ├── ImageUploader.tsx   # Image upload + preview
│   │   └── VoglioDialog.tsx    # Responsive dialog/drawer
│   └── pages/
│       ├── Login.tsx, Register.tsx
│       ├── Collections.tsx     # Home — list of categories
│       ├── Category.tsx        # Category detail + voglios
│       ├── Account.tsx         # User profile
│       └── Wrapper.tsx         # Auth guard + layout
```

### Routes

| Route | Page | Auth Required |
|---|---|---|
| `/login` | Login | No |
| `/register` | Register | No |
| `/` | Collections (home) | Yes |
| `/category/:id` | Category detail | Yes |
| `/voglio/:id` | (unused) | Yes |
| `/account` | Account | Yes |

---

## Improvement Roadmap

### 1. Dead Code Cleanup

- Remove `credentials.js` (unused Firebase config)
- Remove `Friends.tsx` (stub page, not routed)
- Remove `Voglio.tsx` page (unused standalone page)
- Remove `VoglioView.tsx` component (unused dialog)
- Remove duplicate `src/lib/utils.ts` (identical to `lib/utils.ts`)
- Remove unused `axios` dependency from `package.json`

### 2. State Management

- Introduce React Context for auth/session state (remove raw `localStorage` reads)
- Add Zustand or React Context for shared category/voglio data to eliminate prop drilling
- Each page currently fetches data independently with no caching — add a lightweight caching layer

### 3. Data Fetching Abstraction

- Create `src/services/categoryService.ts` and `voglioService.ts` to centralize Supabase queries
- Encapsulate all `supabase.from(...)` calls in service functions
- Add proper TypeScript interfaces for `Category`, `Voglio`, `Size` in a shared types file

### 4. Error Handling

- Most Supabase calls lack try/catch — add consistent error handling
- Add error boundaries at route level
- Add toast notifications for success/error feedback
- Add loading/skeleton states for all async operations

### 5. Type Safety

- Define shared TypeScript interfaces/interfaces for all DB entities
- Replace ad-hoc inline types throughout components
- Add proper typing for Supabase query responses

### 6. Testing Infrastructure

- Add Vitest + React Testing Library
- No tests exist anywhere in the project
- Start with unit tests for services, then component tests
- Add test scripts to `package.json`

### 7. ESLint & Code Quality

- Add stricter `@typescript-eslint` rules
- Add `eslint-plugin-react` and `eslint-plugin-react-hooks` best practices
- Enable `strict` mode in TypeScript

### 8. Social / Multi-User Features

- `Friends.tsx` stub hints at sharing intentions
- Implement wishlist sharing between users
- Proper Supabase RLS policies for shared access

### 9. Search & Filter

- No search across voglios or categories
- Add full-text search on title/description
- Add category filtering on home page

### 10. Image Handling

- No lazy loading, placeholders, or optimization
- Consider Supabase image transformation API for thumbnails
- Add loading skeleton for images
- Handle broken image URLs gracefully

### 11. Pagination / Virtualization

- No limit on displayed voglios — could degrade with large datasets
- Add pagination or infinite scroll for category detail page
- Use react-window or similar for large lists

### 12. Optimistic Updates

- Mutations currently wait for server response
- Add optimistic updates with rollback on error for create/edit/delete

### 13. Dark Mode Toggle

- CSS variables for both light/dark themes exist in `index.css`
- No UI toggle to switch between them
- Add toggle in Navbar or Account page

### 14. Production Deployment

- No hosting configuration (no Vercel, Netlify, Dockerfile, CI/CD)
- Add GitHub Actions workflow for lint + test + build
- Add Dockerfile for containerized deployment
- Configure environment variables on hosting platform

### 15. Documentation

- README is still the default Vite template
- Update with project purpose, setup instructions, architecture overview
- Document environment variable requirements

### 16. Environment Variable Validation

- No runtime check that required env vars exist
- Add startup validation that `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` are set

### 17. Database Migrations

- Schema is managed manually (inferred from code)
- Add Supabase migrations or a migration tool for version-controlled schema changes

### 18. Row Level Security (RLS)

- Verify Supabase RLS policies ensure users can only access their own data
- Audit for any potential data leakage between users

### 19. Input Validation

- Forms lack client-side validation (required fields, URL format, price format, quantity limits)
- Add validation with readable error messages

### 20. Bundle Optimization

- All pages eagerly loaded — add code splitting with `React.lazy()` per route
- Analyze bundle with `vite-plugin-visualizer`
- Remove unused icon imports (prefer tree-shakeable imports)

### 21. Database & Performance

- Add appropriate indexes on foreign keys (`category_id`) and frequently queried columns
- Consider materialized views or denormalization for dashboard counts
- Use Supabase's `count` estimate for large tables

---

### Quick Wins (can be done in <1 hour)

1–4 (dead code cleanup), 4 (error boundaries), 15 (README update), 16 (env validation), 19 (form validation)

### High Impact / Medium Effort

2 (state management), 3 (service layer), 5 (types), 6 (testing), 9 (search), 13 (dark mode toggle), 20 (code splitting)

### Long-term / Complex

8 (social features), 10 (image pipeline), 11 (pagination), 12 (optimistic updates), 14 (full CI/CD), 17 (migrations), 21 (DB perf)
