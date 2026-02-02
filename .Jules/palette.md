# Palette's Journal

## 2025-01-28 - Mobile Navigation Space
**Learning:** On small screens, fixed navbars with large logos and CTA buttons can consume too much vertical and horizontal space, obscuring content and causing layout shifts.
**Action:** Prioritize core navigation links over secondary CTAs on mobile. Use `hidden sm:block` to gracefully remove elements that are redundant or secondary when space is at a premium.

## 2024-05-24 - Async Action Feedback
**Learning:** Users in admin interfaces often click submit buttons multiple times if there is no immediate visual feedback, causing duplicate entries or race conditions.
**Action:** Always wrap submit buttons in forms with `useFormStatus` (or similar) to provide a loading spinner and disable the button during processing. This simple "micro-interaction" significantly improves perceived performance and data integrity.

## 2025-01-29 - Admin Form Accessibility
**Learning:** Inconsistent form patterns (some using labels, others placeholders) create accessibility gaps and cognitive load. Placeholders are not a substitute for labels.
**Action:** Standardize all admin forms to use explicit `<label>` elements linked via `htmlFor/id`, ensuring screen reader support and visual consistency across the admin panel.

## 2025-01-29 - Mobile Header Overlap
**Learning:** Centered logos with absolute positioning can silently overlap with other centered elements (like mobile menu toggles) when the screen size reduces and surrounding elements disappear.
**Action:** Always verify mobile layouts with real content overlap checks. Use `justify-end` or explicit spacing to ensure interactive elements like menu toggles are not obscured by centered decorative elements.
