# SYSMEX & Friends – Copilot Instructions

## Project Overview
This is a **Next.js 16** quiz team website with a PostgreSQL backend. It's a full-stack app combining public pages (blog, results, gallery) with a protected admin panel for content management.

### Key Tech Stack
- **Frontend**: Next.js App Router, React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Prisma ORM, PostgreSQL, Server Actions
- **Images**: Cloudinary (remote image hosting)
- **Validation**: Zod schemas
- **Auth**: HTTP Basic Auth (admin routes only)

---

## Architecture Overview

### App Structure
```
app/
├── page.tsx                  # Homepage (featured post + latest results)
├── layout.tsx               # Root layout with Navbar/Footer
├── api/health/route.ts      # Health check endpoint
├── admin/                   # Protected routes (HTTP Basic Auth)
│   ├── _actions.ts         # Server actions (all CRUD operations)
│   ├── posts/              # Blog/articles management
│   ├── results/            # Match results management
│   ├── members/            # Team members management
│   └── gallery/            # Photo albums management
├── clanky/                 # Public blog route
├── vysledky/               # Public results + filtering
├── tym/                    # Public team listing
└── galerie/                # Public photo gallery
```

### Database Schema (Prisma)
- **Post** – Blog articles (slug-based routing)
- **Season/Result** – Match results grouped by season
- **Member** – Team members with profiles
- **Album/Photo** – Cloudinary photo storage with Prisma references

---

## Key Patterns & Conventions

### 1. Server Actions Pattern
All admin mutations use Next.js Server Actions in `app/admin/_actions.ts`:
- **Always validate** FormData with Zod schemas before DB operations
- **Always call `revalidatePath()`** to refresh pages after mutations
- Return `{ ok: true/false, message?: string }` for feedback
- Example:
  ```typescript
  const PostCreateSchema = z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/), // lowercase only
  });
  
  export async function adminCreatePost(formData: FormData) {
    const parsed = PostCreateSchema.safeParse(/* ... */);
    if (!parsed.success) return { ok: false, message: /* ... */ };
    await prisma.post.create({ data: /* ... */ });
    revalidatePath("/clanky");
    return { ok: true };
  }
  ```

### 2. Query Organization
Read-only queries live in `lib/queries/`:
- `posts.ts` – getFeaturedPost, getRecentPosts, getPostBySlug
- `results.ts` – getLatestResults, getResultsBySeason
- `members.ts`, `albums.ts`
- **Pattern**: Wrap DB calls in try-catch for graceful degradation in dev

### 3. Environment Validation
All env vars validated in `lib/env.ts` using Zod:
- `DATABASE_URL` (required)
- `CLOUDINARY_*` keys (optional – dev works without them)
- Set defaults; don't assume env is populated

### 4. Slug-Based Routing
Blog posts use `/clanky/[slug]` pattern:
- Slug must be lowercase, alphanumeric + hyphens: `^[a-z0-9-]+$`
- Always validate when creating; prevent duplicates with `@unique` in Prisma

### 5. Admin Auth
Protected via `proxy.ts` (HTTP Basic Auth middleware):
- Set `ADMIN_USER` & `ADMIN_PASSWORD` env vars for production
- Dev mode allows access without credentials (convenient)
- Returns 401 with `WWW-Authenticate` header if creds invalid

### 6. Revalidation Strategy
Use `revalidatePath()` after mutations:
- `/` – Use `"layout"` option for root revalidation
- `/clanky` – For posts
- `/vysledky` – For results
- `/tym` – For members
- `/galerie` – For albums
- Use `force-dynamic` on admin pages to bypass ISR

### 7. Cloudinary Integration
- Upload via `adminUploadPhoto()` in `_actions.ts`
- Store public_id in Prisma Photo model
- Render via Next.js Image component with remote pattern in `next.config.mjs`
- API keys in env vars

---

## Development Workflows

### Local Setup
```bash
npm ci
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed        # Optional: seed with demo data
npm run dev
```

### Database Changes
```bash
npx prisma migrate dev --name <migration_name>
npx prisma db push                               # If no migrations folder
```

### Quality Checks
```bash
npm run lint              # ESLint
npm run check             # Lint + type check + build (catches most issues)
```

### Seed Data
`prisma/seed.ts` runs on `npm ci` (postinstall). Use for demo content (featured posts, team members).

---

## Common Tasks

### Add a Blog Post
1. Go to `/admin/posts`
2. Form validates: title, slug (lowercase), excerpt, content, optional cover image
3. Server action `adminCreatePost` handles creation
4. Page auto-revalidates via `revalidatePath("/clanky")`

### Add Team Member
1. Go to `/admin/members`
2. Form fields: displayName (unique), nickname, gender, role, bio, active status
3. Server action `adminCreateMember`
4. Pages revalidate: `/tym`, `/admin/members`

### Upload Photos to Album
1. Go to `/admin/gallery` → select/create album
2. Upload files → `adminUploadPhoto()` handles Cloudinary
3. Stores public_id in Prisma Photo model
4. Gallery pages revalidate

### Add Match Results
1. Go to `/admin/results`
2. Select season, enter date/venue/team/placement/score/note
3. Server action validates & creates Result linked to Season
4. Revalidates `/vysledky` + `/` (for dashboard)

---

## Important Notes

### Don't
- ❌ Mix client components with direct DB access
- ❌ Forget to validate FormData with Zod before DB mutations
- ❌ Skip `revalidatePath()` after mutations
- ❌ Use low-cardinality slugs or duplicate unique fields

### Do
- ✅ Keep complex queries in `lib/queries/`
- ✅ Use Server Actions for mutations; validate input
- ✅ Return structured responses from server actions
- ✅ Use `force-dynamic` on data-dependent admin pages
- ✅ Wrap fallible DB calls in try-catch (especially in queries)

### Deployment (Render)
- Set env vars: `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, `CLOUDINARY_*`
- Uses PostgreSQL with pgbouncer=true for pooling
- Next.js builds & starts via `npm run build` + `npm start`

---

## Key Files
- **Prisma Schema**: `prisma/schema.prisma` – Database models and relationships
- **Admin Actions**: `app/admin/_actions.ts` – All server-side mutations (CRUD operations)
- **Env Validation**: `lib/env.ts` – Environment variable schema and validation
- **DB Connection**: `lib/prisma.ts` – Prisma client singleton with pooling
- **Auth Middleware**: `proxy.ts` – HTTP Basic Auth for `/admin` routes
