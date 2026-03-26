---
name: content-verification-maintenance
description: 'Verify content integrity, comment visibility, broken external links, gallery/article presentation, and mobile content regressions in Sysmex & Friends. Use when published content looks wrong, comments seem missing, gallery pages behave unexpectedly, external links may be broken, or before validating content-heavy releases.'
argument-hint: 'Optional scope, e.g. "broken links only", "comments and gallery", or "full content verification"'
user-invocable: true
---

# Content Verification And Maintenance

Use this skill for repeatable verification of published content and public-facing content surfaces in the Sysmex & Friends workspace.

This skill is for diagnosing and validating content quality, not for broad release review or unrelated feature implementation. It helps isolate whether the issue is in published post content, comment rendering, gallery content, mobile layout, or broken outbound links.

## When to Use

Use this skill when the request involves any of the following:

- suspected broken external links in published posts
- comments not appearing under articles or gallery items
- gallery or article content looking incomplete or inconsistent
- mobile presentation regressions on content-heavy pages
- preflight checks before a content-focused release
- verifying whether public content pages still render correctly after content or query changes

Do not use this skill for:

- broad build, lint, or typecheck validation across the repo
- admin CRUD implementation
- auth/session debugging
- Supabase operational health triage unless the content issue is clearly caused by DB/runtime availability

## Load These Resources First

Load this reference file for the decision matrix and expected outcomes:

- [Content verification checklist](./references/checklist.md)

Then inspect the repo surfaces that match the user's scope:

- `app/api/cron/link-medic/route.ts`
- `components/team/CommentSection.tsx`
- `app/(public)/galerie/page.tsx`
- `scripts/verify-mobile.ts`
- `verification/verify_comments.py`

## Procedure

1. Classify the request before running checks.

Choose the smallest useful scope:

- Broken-link verification
- Comment visibility verification
- Gallery/article content presentation
- Mobile content verification
- Full content verification pass

2. Start with the content surface closest to the user-reported problem.

Prefer the smallest direct check first instead of running every verification path.

Examples:

- link complaints -> inspect `app/api/cron/link-medic/route.ts`
- missing comments -> inspect `components/team/CommentSection.tsx` and `verification/verify_comments.py`
- gallery regression -> inspect `app/(public)/galerie/page.tsx`
- mobile layout issue -> inspect `scripts/verify-mobile.ts`

3. Verify broken-link workflow when external links are the suspected problem.

Inspect `app/api/cron/link-medic/route.ts` and confirm:

- bearer auth via `CRON_SECRET`
- bounded execution with `maxDuration`
- batching for remote requests
- timeout handling for HEAD checks
- optional Discord notification behavior for detected failures

Treat this workflow as the source of truth for published-link verification, not as a public endpoint.

4. Verify comment visibility when article or gallery discussion appears broken.

Inspect `components/team/CommentSection.tsx` and confirm:

- comments render from `initialComments`
- login gating behaves as expected
- entity routing uses the correct `entityId` and `entityType`
- successful submission expects server-side revalidation plus page refresh

If interactive browser verification is needed, use the existing helper:

- `verification/verify_comments.py`

Summarize only the content-relevant result, not raw noisy output.

5. Verify gallery or content-list presentation when public content pages seem wrong.

Inspect `app/(public)/galerie/page.tsx` and confirm:

- album query output is mapped safely
- fallback states exist when content is empty
- cover image selection is optional-safe
- page-level revalidation expectations are still intact

If the issue is broader than gallery alone, inspect the related public page or query helper before proposing any code change.

6. Verify mobile presentation when the issue is device-specific.

Use the existing verification script when relevant:

- `scripts/verify-mobile.ts`

Interpretation:

- success means no obvious horizontal overflow on the checked public routes
- failure means content or layout regression on the tested mobile viewport

Do not over-generalize beyond the exact routes the script verifies.

7. Map the issue to a root-cause zone.

Use one of these categories in the final report:

- Broken-link verification problem
- Comment rendering or interaction problem
- Public content presentation problem
- Mobile layout regression
- Content data gap or empty-state issue
- No content verification issue found

8. Return a findings-first report.

Always include:

- Findings ordered by severity
- Root-cause zone
- Checks performed
- Checks skipped and why
- Smallest safe next action
- Verification steps for the affected content surface

## Expected Output

Use a concise report with these sections:

- Findings
- Root cause zone
- Checks performed
- Open questions or assumptions
- Recommended next step
- How to verify

## Safety Rules

- Do not expose secrets, webhook URLs, or authorization headers.
- Do not treat debug or cron endpoints as public content features.
- Do not broaden a local content issue into an auth or infra redesign without evidence.
- Prefer minimal verification tied to the affected surface.
- When scripts or browser checks are noisy, summarize only the result that changes diagnosis.

## Repo-Specific Notes

This repo already has verification assets for mobile and comments and a cron-based broken-link workflow. Use those before inventing new verification logic.

Use this skill when the real question is content quality, presentation, or maintenance on public-facing surfaces.
