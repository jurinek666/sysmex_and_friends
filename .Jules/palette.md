# Palette's Journal

## 2025-01-28 - Mobile Navigation Space
**Learning:** On small screens, fixed navbars with large logos and CTA buttons can consume too much vertical and horizontal space, obscuring content and causing layout shifts.
**Action:** Prioritize core navigation links over secondary CTAs on mobile. Use `hidden sm:block` to gracefully remove elements that are redundant or secondary when space is at a premium.

## 2024-05-24 - Async Action Feedback
**Learning:** Users in admin interfaces often click submit buttons multiple times if there is no immediate visual feedback, causing duplicate entries or race conditions.
**Action:** Always wrap submit buttons in forms with `useFormStatus` (or similar) to provide a loading spinner and disable the button during processing. This simple "micro-interaction" significantly improves perceived performance and data integrity.
