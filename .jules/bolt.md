# Bolt's Journal

## 2025-01-28 - Optimizing Relation Counts in Prisma
**Learning:** When you only need the count of a relation (e.g., `photos.length`), fetching the entire relation array is wasteful. Prisma's `_count` aggregation allows fetching just the count directly from the database, significantly reducing data transfer and memory usage.
**Action:** Always check if a relation is only used for its length. If so, use `_count` or `include: { _count: true }` instead of `include: { relation: true }`.

## 2025-01-29 - Explicit Field Selection in Supabase
**Learning:** Fetching all columns via `.select('*')` (or implicit selection) retrieves heavy fields like `content` (Markdown/HTML) even for list views, causing unnecessary data transfer.
**Action:** Always explicitly define the required fields in `.select('id, title, ...')` for list queries, ensuring heavy columns are excluded unless needed.
