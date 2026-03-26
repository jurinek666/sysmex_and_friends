# Content Verification Checklist

## Scope Selector

Choose the smallest scope that can confirm or eliminate the suspected content failure zone.

- Broken-link verification:
  - use when published outbound links may be stale or dead
  - primary surface: `app/api/cron/link-medic/route.ts`
- Comment visibility verification:
  - use when article or gallery comments do not appear or do not submit correctly
  - primary surfaces: `components/team/CommentSection.tsx`, `verification/verify_comments.py`
- Gallery/article presentation:
  - use when public content pages look empty, inconsistent, or visually broken
  - primary surface: `app/(public)/galerie/page.tsx`
- Mobile content verification:
  - use when the bug is viewport-specific
  - primary surface: `scripts/verify-mobile.ts`
- Full content verification:
  - use when the exact failure zone is unclear but the problem is clearly content-facing

## Expected Outcomes

### Broken-link workflow

Check these assumptions:

- `CRON_SECRET` is required
- authorization is bearer-based
- requests are batched
- remote checks are time-bounded
- broken results can be summarized to Discord when configured

Interpretation:

- unauthorized or missing secret: operational config problem
- unexpected broken-link volume: content maintenance problem
- empty result with published content present: inspect parsing assumptions in the route

### Comment verification

Check these assumptions:

- comments render from provided initial data
- login state controls form visibility
- `entityId` and `entityType` match the rendered surface
- success path refreshes the page after server-side revalidation

Interpretation:

- comments missing but page loads: rendering/data issue
- form visible but submit broken: interaction/action issue
- comments present in one surface but not another: entity mapping or query issue

### Gallery/article presentation

Check these assumptions:

- empty-state UI exists
- optional image data is handled safely
- list rendering tolerates partial content
- content revalidation expectations remain intact

Interpretation:

- missing content with safe empty state: likely content data gap
- visual breakage with existing data: presentation or mapping issue

### Mobile verification

Script:

- `scripts/verify-mobile.ts`

Interpretation:

- success: no obvious overflow on checked routes
- failure: viewport-specific layout regression on verified public pages

## Root-Cause Zones

Map every outcome into exactly one primary bucket:

- Broken-link verification problem
- Comment rendering or interaction problem
- Public content presentation problem
- Mobile layout regression
- Content data gap or empty-state issue
- No content verification issue found

## Reporting Rules

- Findings first, ordered by severity
- Mention performed checks before speculative fixes
- Mention skipped checks and why they were skipped
- Recommend the smallest safe next step
- Do not print secrets, webhook URLs, or raw authorization data
