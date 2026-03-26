---
name: supabase-operational-checks
description: 'Verify Supabase operational health, environment wiring, auth/session preflight, service-role capability, and local test-user setup in Sysmex & Friends. Use when Supabase looks down, login/session behavior is suspicious, admin user operations fail, health checks fail, environment variables changed, or before validating deployment/runtime readiness.'
argument-hint: 'Optional scope, e.g. "health endpoint only", "service role and admin delete", or "full local preflight"'
user-invocable: true
---

# Supabase Operational Checks

Use this skill for repeatable Supabase runtime verification in the Sysmex & Friends workspace.

This skill is for operational checks and preflight validation, not for implementing new features. It helps determine whether the problem is in environment wiring, database reachability, auth/session refresh, admin-role enforcement, or local test setup.

## When to Use

Use this skill when the request involves any of the following:

- Supabase connectivity or database reachability
- failing or suspicious health checks
- login works inconsistently
- session refresh or redirect behavior seems broken
- admin-only behavior fails unexpectedly
- user deletion or admin auth actions require service-role validation
- environment variables were changed and runtime needs verification
- local development needs seeded test users for auth or members flows
- deployment or pre-release runtime confidence for Supabase-backed features

Do not use this skill for:

- broad release review across the whole repo
- implementing new CRUD flows
- redesigning auth architecture
- generic feature work unrelated to Supabase runtime behavior

## Load These Resources First

Load this reference file for the decision matrix and expected outcomes:

- [Supabase ops checklist](./references/checklist.md)

Then inspect the repo surfaces that match the user's scope:

- `lib/env.ts`
- `app/api/health/route.ts`
- `proxy.ts`
- `lib/admin/auth.ts`
- `scripts/verify-supabase.ts`
- `scripts/create-test-users.ts`
- `app/admin/_actions.ts`

## Procedure

1. Classify the request before running checks.

Choose the smallest useful scope:

- Health and connectivity
- Environment wiring
- Auth/session preflight
- Admin capability and role enforcement
- Local test-user setup
- Full Supabase operational preflight

2. Validate the environment surface.

Inspect `lib/env.ts` and confirm which variables are required at runtime versus optional.

Focus on:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` when admin destructive operations or user seeding are relevant

Do not print secrets, keys, or full token values in output.

3. Run the smallest safe connectivity check first.

If the task is about basic connectivity or DB reachability, use the existing repo script:

- `npx ts-node scripts/verify-supabase.ts`

Interpretation:

- success means anon-key client connectivity and at least one simple table query worked
- failure usually points to missing env, invalid keys, wrong project URL, network reachability, or table/query mismatch

4. Check the application-level health surface.

Inspect `app/api/health/route.ts`.

If the app is running locally or in a test environment, verify the health endpoint response and summarize only the meaningful result:

- expected healthy response: HTTP 200 with `ok: true`
- expected unhealthy response: HTTP 503 with `DB unreachable`

If health fails but the standalone script succeeds, treat this as an app wiring issue, not a Supabase outage.

5. Check auth/session preflight when login, redirects, or protected routes are involved.

Inspect:

- `proxy.ts`
- `lib/admin/auth.ts`

Verify these assumptions:

- `proxy.ts` still refreshes session via Supabase auth `getUser`
- admin routes redirect unauthenticated users to `/admin-login`
- members routes redirect unauthenticated users to `/login`
- admin authorization still depends on role lookup from `profiles`
- there is no accidental shift away from proxy-based protection

If the issue is specifically runtime auth behavior, report whether the failure zone is:

- session refresh
- route matching
- redirect behavior
- profile role lookup
- missing env/config

6. Check service-role dependent admin behavior only when relevant.

If the task mentions user deletion, admin cleanup, or seed/test setup, verify whether `SUPABASE_SERVICE_ROLE_KEY` is required.

Use these repo cues:

- `scripts/create-test-users.ts` requires service role
- admin user deletion paths depend on service-role availability

Do not attempt destructive operations unless the user explicitly asked for them.

7. Seed test users only for local or test verification scenarios.

If the user explicitly wants local auth/member verification and service role is available, the repo supports:

- `npm run seed:users`

Treat this as optional setup, not a default step.

After seeding, summarize:

- whether creation succeeded
- whether users already existed
- which local login path is expected to work

Do not recommend this for production.

8. Map the outcome to a root-cause zone.

Use one of these categories in the final report:

- Env configuration problem
- Supabase connectivity problem
- App health route problem
- Auth/session refresh problem
- Admin role or service-role capability problem
- Local test data/setup gap
- No operational issue found

9. Return a findings-first report.

Always include:

- Findings ordered by severity
- Root-cause zone
- Checks performed
- Checks skipped and why
- Smallest safe next action
- Verification steps for the affected flow

## Expected Output

Use a concise operational report with these sections:

- Findings
- Root cause zone
- Checks performed
- Open questions or assumptions
- Recommended next step
- How to verify

## Safety Rules

- Never expose secrets, service-role keys, cookies, or raw auth tokens.
- Do not weaken auth, redirects, or role checks just to make a test pass.
- Do not replace `proxy.ts` with `middleware.ts`.
- Do not run destructive admin operations unless explicitly requested.
- Prefer the smallest safe operational check that can confirm or eliminate a failure zone.
- When command output is noisy, summarize only the lines that materially change the diagnosis.

## Repo-Specific Notes

This workspace already has a broad release prompt for lint, tests, typecheck, and build. Use that for general release readiness.

Use this skill when the real question is narrower and Supabase-specific: runtime health, environment wiring, auth/session preflight, or service-role capability.
