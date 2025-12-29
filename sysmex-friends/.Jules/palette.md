## 2025-05-23 - [Navigation Accessibility]
**Learning:** Standard Tailwind utility classes (`focus-visible:ring-*`) are excellent for ensuring keyboard accessibility without disrupting mouse users. Adding these to custom navigation components is a quick win.
**Action:** Always check interactive elements (Links, Buttons) for focus states, especially when using custom styling or `outline-none`.

## 2025-05-23 - [Server Action Types]
**Learning:** When using `form action={serverAction}` in Next.js, the server action type must match what the form expects (void/Promise<void>). If the action returns a value (e.g. for useFormState), it can cause type errors if used directly in `action`.
**Action:** Use an inline wrapper `action={async (d) => { "use server"; await act(d) }}` for simple cases where the return value is ignored.
