---
description: "Use when working in admin pages, admin server actions, or admin components. Covers auth checks, validation, revalidation, and safe CRUD patterns."
name: "Admin Area Guidelines"
applyTo: "app/admin/**, components/admin/**"
---
# Admin Area Guidelines

- Every admin page and admin action must enforce authorization through `requireAuth()` from `lib/admin/auth.ts`.
- Keep write operations in `app/admin/_actions.ts` and preserve the current unified error-handling pattern.
- Use Zod schemas from `lib/schemas.ts` for input validation. Add or update schemas there instead of local ad-hoc parsing.
- After successful mutations, keep cache invalidation explicit (for example via `revalidatePath`) for affected admin and public/member views.
- Avoid moving admin CRUD logic into client components. Prefer server components + server actions.
- For admin forms, follow existing component patterns in `components/admin` and `components/ui/PendingButton.tsx`.

## Safety Checks

- Never log secrets, tokens, or service-role values.
- When changing auth or redirects, verify behavior for:
  - unauthenticated user
  - authenticated non-admin user
  - authenticated admin user
- Keep backwards compatibility for DB-related changes and avoid destructive migrations without a safe transition.

## Reference Files

- `app/admin/_actions.ts`
- `lib/admin/auth.ts`
- `lib/schemas.ts`
- `components/admin/ActionForm.tsx`
- `components/ui/PendingButton.tsx`
