# Security Specification - UniPoints

## Data Invariants
1. A Point document must belong to a user.
2. A PointGroup must belong to a user.
3. Access to Points and Groups is restricted to the owner of the user profile.
4. Timestamps (createdAt, updatedAt) must be valid intervals.
5. All IDs must be valid strings.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create a point for another user.
2. **State Shortcutting**: Attempt to update `balance` without proper ownership.
3. **Resource Poisoning**: Use a 1MB string for `provider` name.
4. **Invalid Timestamps**: Pass a future or very old timestamp for `createdAt`.
5. **Unauthorized Read**: Attempt to list points of another user.
6. **Shadow Fields**: Attempt to save an undocumented field like `isAdmin: true`.
7. **Bypass ID validation**: Use special characters in document IDs.
8. **Null Values**: Pass `null` for required fields like `provider`.
9. **Negative Balance**: Set `balance` to -100.
10. **Type Mismatch**: Pass a string for `balance`.
11. **Excessive Group ID**: Use a string > 128 chars for `groupId`.
12. **Insecure Profile Update**: Attempt to change `userId` in existing profile.

## Verification
- Firestore rules implement `isValidPoint`, `isValidGroup`, and `isValidProfile`.
- Ownership is checked via `isOwner(userId)`.
- Keys are restricted via `hasOnly(allowedKeys)`.
- Timestamps are enforced via `request.time`.
