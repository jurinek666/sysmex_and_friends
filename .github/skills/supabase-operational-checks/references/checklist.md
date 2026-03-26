# Supabase Ops Checklist

## Scope Selector

Choose the smallest scope that can confirm or eliminate the suspected failure zone.

- Health and connectivity:
  - use when DB reachability or Supabase uptime is in doubt
  - primary surfaces: `scripts/verify-supabase.ts`, `app/api/health/route.ts`
- Environment wiring:
  - use when `.env`, deployment config, or runtime startup changed
  - primary surface: `lib/env.ts`
- Auth/session preflight:
  - use when login, redirect, or protected routes behave unexpectedly
  - primary surfaces: `proxy.ts`, `lib/admin/auth.ts`
- Admin capability and service role:
  - use when admin user operations or user seeding fail
  - primary surfaces: `scripts/create-test-users.ts`, `app/admin/_actions.ts`
- Full operational preflight:
  - use when the exact failure zone is unclear and Supabase is the main suspect

## Expected Outcomes

### Connectivity check

Command:

- `npx ts-node scripts/verify-supabase.ts`

Interpretation:

- success:
  - env is present for anon client access
  - Supabase URL/key pair is usable
  - at least one lightweight table query works
- failure:
  - missing env
  - invalid or mismatched keys
  - wrong project URL
  - network reachability issue
  - query/table mismatch in current environment

### Health endpoint

Expected responses:

- healthy: HTTP 200, `ok: true`
- unhealthy: HTTP 503, `DB unreachable`

Interpretation:

- script fails and health fails: likely Supabase/env problem
- script succeeds and health fails: likely app wiring problem

### Auth/session preflight

Check these assumptions:

- `proxy.ts` calls Supabase auth `getUser`
- admin routes redirect unauthenticated users to `/admin-login`
- member routes redirect unauthenticated users to `/login`
- `requireAuth()` still checks `profiles.role === "admin"`

Likely failure zones:

- session refresh regression
- route matching bug
- redirect bug
- role lookup failure
- env/config issue affecting auth client setup

### Service-role and seeding

Use only when relevant.

- `scripts/create-test-users.ts` requires:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- command:
  - `npm run seed:users`

Interpretation:

- success: local auth/member testing can proceed
- already exists: setup is usable, no further seeding needed
- failure: service-role capability or env issue

## Root-Cause Zones

Map every outcome into exactly one primary bucket:

- Env configuration problem
- Supabase connectivity problem
- App health route problem
- Auth/session refresh problem
- Admin role or service-role capability problem
- Local test data/setup gap
- No operational issue found

## Reporting Rules

- Findings first, ordered by severity
- Mention performed checks before speculative fixes
- Mention skipped checks and why they were skipped
- Recommend the smallest safe next step
- Never print secrets, keys, cookies, or raw tokens
