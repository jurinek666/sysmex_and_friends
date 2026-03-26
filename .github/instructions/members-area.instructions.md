---
description: "Use when editing members area routes, member server actions, or participation/comment flows. Covers auth flow via proxy, member action patterns, and query usage."
name: "Members Area Guidelines"
applyTo: "app/(members)/**, components/team/**"
---
# Members Area Guidelines

- Keep member write operations in `app/(members)/_actions.ts` and preserve existing action patterns.
- Do not introduce `middleware.ts`; session refresh and route protection are managed in `proxy.ts`.
- For validation, reuse and extend centralized schemas in `lib/schemas.ts`.
- For reads, prefer `lib/queries/*` helpers instead of embedding direct data-fetching logic across pages/components.
- Preserve current UX patterns for member interactions (comments, participation, profile updates) and avoid mixing admin-only concerns.

## Behavior and Data Flow

- Ensure protected routes continue to redirect correctly when user is not authenticated.
- Keep action responses and error handling consistent with existing members/admin action style.
- If changing event participation or comments logic, verify sorting/filtering and role assumptions are unchanged unless intentionally updated.

## Reference Files

- `app/(members)/_actions.ts`
- `proxy.ts`
- `lib/schemas.ts`
- `lib/queries/events.ts`
- `lib/queries/team.ts`
- `components/team/EventParticipation.tsx`
- `components/team/CommentSection.tsx`
