# Security Specification & Test Payloads

## 1. Data Invariants
- Public users can read `settings`, `broadcasts`, `lectures`, `interviews`, `quizzes`, `events`, and `registrations`.
- Public users can submit `quiz_responses` and `inquiries`, but cannot alter or delete them once submitted.
- Only authenticated admins and authorized supervisors can create, update, or delete content (`broadcasts`, `lectures`, `interviews`, `quizzes`, `events`, `registrations`, `settings`).
- The bootstrapped super admin (`onlak2030@gmail.com`) has unconditional full administrative privileges.
- Supervisors cannot modify supervisor permissions or create admin accounts; only Admin can manage supervisors and roles.
- `quiz_responses` are only listable/readable by Admins and Supervisors to protect survey privacy.

## 2. The Dirty Dozen Payloads (Designed to Fail Security Rules)
1. **Unauthenticated Content Injection**: Anonymous client attempting to write to `/broadcasts/broadcast1` with arbitrary data. (Expected: PERMISSION_DENIED)
2. **Unauthenticated Settings Tamper**: Anonymous client attempting to overwrite `/settings/general`. (Expected: PERMISSION_DENIED)
3. **Editor Escalation**: Non-admin editor attempting to create or modify an admin in `/supervisors/user1` setting `role: "admin"`. (Expected: PERMISSION_DENIED)
4. **ID Poisoning Attack**: Writing to `/broadcasts` with a 2KB garbage document ID exceeding length bounds. (Expected: PERMISSION_DENIED)
5. **Ghost Field Injection**: Adding an unauthorized field `super_bypass: true` during update of `/events/event1`. (Expected: PERMISSION_DENIED)
6. **Quiz Tamper by Public**: Public user attempting to delete a quiz or rewrite question answers. (Expected: PERMISSION_DENIED)
7. **Response Scrape Attack**: Unauthenticated user attempting to list `/quiz_responses` collection to extract participant data. (Expected: PERMISSION_DENIED)
8. **Inquiry Hijack**: Public visitor attempting to delete or overwrite incoming contact messages. (Expected: PERMISSION_DENIED)
9. **Email Spoofing Attack**: Client supplying spoofed unverified email claim `admin@domain.com` without valid Firebase credentials. (Expected: PERMISSION_DENIED)
10. **Unbounded Payload Injection**: Sending a lecture description exceeding size bounds (1MB). (Expected: PERMISSION_DENIED)
11. **Negative Score Injection**: Visitor submitting a quiz response with a negative score or invalid ratio. (Expected: PERMISSION_DENIED)
12. **Supervisor Privilege Bypass**: Supervisor without `registrations` permission attempting to delete an activity registration. (Expected: PERMISSION_DENIED)
