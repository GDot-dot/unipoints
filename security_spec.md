# Security Specification

## Data Invariants
1. Users can only read and write their own points, groups, and profile.
2. A point must belong to the user writing it.
3. Timestamps (`createdAt`, `updatedAt`) must equal `request.time`.
4. `userId` cannot be changed during an update.

## The "Dirty Dozen" Payloads
1. Create a `Point` with an orphaned `userId` (spoofed ID).
2. Create a `PointGroup` missing `userId` field.
3. Update `Point` changing `userId`.
4. Update `Profile` with `lineConnected` as a string instead of boolean.
5. Create `Point` where `provider` is a 1MB string.
6. Create `Point` with `balance` less than 0.
7. Update `Point` with `expiring` greater than `balance` (logical, wait rules can't easily check fields against each other unless specified, we can just enforce limits or types).
8. Delete another user's `PointGroup`.
9. `get` another user's `Profile`.
10. `list` points without `userId` where condition.
11. Update `Point` with a spoofed `updatedAt`.
12. Create `Profile` with an `isAdmin: true` ghost field.
