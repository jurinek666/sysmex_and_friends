# Bolt's Journal

## 2025-01-28 - Optimizing Relation Counts in Prisma
**Learning:** When you only need the count of a relation (e.g., `photos.length`), fetching the entire relation array is wasteful. Prisma's `_count` aggregation allows fetching just the count directly from the database, significantly reducing data transfer and memory usage.
**Action:** Always check if a relation is only used for its length. If so, use `_count` or `include: { _count: true }` instead of `include: { relation: true }`.
