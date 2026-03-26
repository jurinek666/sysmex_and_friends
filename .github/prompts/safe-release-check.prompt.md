---
description: "Run a focused pre-release safety check for this Next.js + Supabase project (lint, tests, typecheck/build, and risk summary)."
name: "Safe Release Check"
argument-hint: "Scope or branch focus (optional), e.g. 'only members area changes'"
agent: "agent"
---
Run a pre-release safety check for this workspace.

Optional focus from user: ${input:Scope or branch focus}

Goals:
- Identify regressions and deployment risks before merge/release.
- Prefer findings-first output with concrete file references.

Checklist:
1. Inspect git diff/status and summarize impacted areas.
2. Run project checks in this order unless scope suggests narrower checks:
   - `npm run lint`
   - `npm run test`
   - `npm run check`
3. If a command fails, capture the key failure lines and map them to likely root cause.
4. Include security and config checks relevant to this repo:
   - auth/redirect behavior (`proxy.ts`, `lib/admin/auth.ts`)
   - env handling (`lib/env.ts`, `.env.example`)
   - API route safety for cron/debug endpoints
5. Output format:
   - Findings (ordered by severity, each with path and why it matters)
   - Open questions/assumptions
   - Suggested fixes with smallest safe change strategy
   - Final go/no-go recommendation

Constraints:
- Do not modify files unless explicitly asked.
- Keep recommendations consistent with AGENTS.md conventions.
