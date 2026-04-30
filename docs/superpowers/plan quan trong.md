# Sprint 2: Auth + Profile Implementation Plan

This sprint focuses on establishing the end-to-end flow for user authentication, onboarding, and profile management (CRUD), while laying the groundwork for Alumni support, school domain associations, and privacy controls.

## Proposed Changes

---

### Supabase DB Schema & Migrations

- Create new migration `001_sprint2_auth_profile.sql`.

#### [NEW] Supabase Migration
- **Tables**:
  - `profiles` (id [FK auth.users], full_name, avatar_color, bio, contact_email, contact_email_privacy, social_links [JSONB], social_links_privacy, onboarding_completed_at, created_at, updated_at).
  - `schools` (id, domain [UNIQUE], display_name, created_at) - To map domains to readable school/company names.
  - `user_schools` (id, user_id [FK profiles], school_domain [FK schools.domain], school_email, status, is_verified).
  - `categories` (id, name, type).
  - `tags` (id, category_id, name, is_system) with constraint `UNIQUE(category_id, lower(name))` to prevent duplicate user-created tags.
  - `profile_tags` (profile_id, tag_id) with `PRIMARY KEY (profile_id, tag_id)`.
  - `connections` (id, requester_id, recipient_id, status [pending, accepted, rejected], created_at, updated_at) with constraint `UNIQUE(requester_id, recipient_id)` and check `requester_id != recipient_id`.

- **Indexes**:
  - `connections(recipient_id, status)` — for querying "who sent me a request".
  - `profile_tags(tag_id)` — for `COUNT(*)` popular tag queries.

- **Functions & Triggers**:
  - `check_same_school(target_user_id UUID)` returning BOOLEAN. Marked `STABLE` for query performance.
  - `check_is_connected(target_user_id UUID)` returning BOOLEAN. Marked `STABLE` for query performance.
  - `set_updated_at()` — generic `BEFORE UPDATE` trigger function that sets `updated_at = NOW()`. Applied to `profiles` and `connections`.
  - Trigger function `handle_new_user()` `AFTER INSERT ON auth.users`:
    - Inserts into `profiles` (auto-generating avatar color and setting full_name from auth metadata). This is the **critical** part — if it fails, user creation should fail.
    - School association is wrapped in a `BEGIN...EXCEPTION` block so it **cannot block user creation**. On error, it logs a WARNING but the user still gets their profile.
    - Checks the email domain against a blacklist of public providers (e.g., `gmail.com`, `yahoo.com`, `hotmail.com`).
    - If the domain is NOT public, UPSERTs into `schools` (ON CONFLICT DO NOTHING) and then inserts into `user_schools` with `status = 'student'`. If it is public, the user gets a profile but no school association.
  - Trigger function `enforce_identity_limit_and_alumni()` `AFTER INSERT ON auth.identities`:
    - *(Note: Triggering on auth.identities is not officially documented by Supabase and may change in future GoTrue updates. Consider this technical debt for MVP. If it breaks, fallback to an Auth Hook or checking during the callback).*
    - Checks if the user already has >= 2 identities. If so, it silently returns (does nothing) to avoid breaking the Supabase GoTrue flow, relying on the client-side UI to enforce the limit before linking.
    - If valid (< 2 identities) and it's an additional identity, inserts the new email into `user_schools` with `status = 'alumni'` (if not a public domain).

- **RLS Policies**:
  - Profiles: Public read, Owner update. (Note: Data filtering for privacy levels will be handled securely in Next.js Server Components, not via complex read RLS).
  - Contact/Social details: Public read, but Server Components will use `check_same_school` and `check_is_connected` to strip sensitive fields before sending to the client.
  - Connections: Users can read their own connections, create requests, and update requests sent to them.
  - Tags: Authenticated users can insert new tags (user-created tags).

- **Seed Script (`seed.sql`)**: 
  - Insert initial Categories (Skills, Interests, Needs, Study/Major, Topics) and Seed Tags (`is_system = true`).

---

### @vinser/core (Business Logic & Types)

#### [MODIFY] `packages/core/src/types/database.types.ts`
- Run `supabase gen types typescript` to update types after migrations.

#### [NEW] `packages/core/src/auth/index.ts`
- Implement Google OAuth login (`signInWithOAuth({ provider: 'google' })`). 

#### [NEW] `packages/core/src/profile/`
- Zod schemas for Profile Updates, Tag Creation, and Connections.
- Server Actions / Service functions for updating profiles, creating/selecting tags, and managing connections.
- Ensure Server Actions filter out sensitive fields based on `contact_email_privacy` and `social_links_privacy`.
- Tag creation uses `INSERT ... ON CONFLICT DO NOTHING RETURNING id` to safely handle concurrent identical tags.

---

### @vinser/queries (Data Fetching)

#### [NEW] `packages/queries/src/profile.ts`
- TanStack Query hooks to fetch profile details, tags, categories, and connection status.
- Use `COUNT(*)` query on `profile_tags` to fetch popular tags instead of a maintained `usage_count` column.

---

### apps/web (UI & Next.js App Router)

#### [MODIFY] `apps/web/src/proxy.ts`
- Protect routes (`/profile`, `/onboarding`, `/settings`).
- Enforce Onboarding Completion: Check `session.user.app_metadata.onboarding_completed`. If missing or false, redirect to `/onboarding`. (Avoids expensive DB joins in middleware, and using `app_metadata` instead of `user_metadata` prevents client-side bypasses).

#### [NEW] Auth & Onboarding UI
- `/login`: UI with Google OAuth button.
- `/auth/callback`: Handle Supabase auth callback exchange.
- `/onboarding/page.tsx`: 
  - Step 1: Confirm/Edit Full Name (pre-filled from Google) and confirm auto-generated Identity Color.
  - Step 2: Select or Create Tags (Must select at least 1 tag to complete).
  - Upon completion, update `onboarding_completed_at` in DB and `app_metadata.onboarding_completed = true` via Supabase Admin API (requires `service_role` key).

#### [NEW] Profile UI (Based on `user_profile` and `edit_profile` templates)
- `/profile/page.tsx` (Current user) and `/profile/[id]/page.tsx` (View others).
- Add "Connect" button for users who are not connected.
- Edit Profile will include the "Account Transition" section to link identities.
- Remove "Preferred Contact Channel" from UI as it's out of scope.

#### [NEW] Account Transition Flow (Identity Linking)
- User goes to Settings/Edit Profile and clicks "Link personal email".
- The client-side checks if the user already has 2 identities. If so, disables the button.
- If allowed, client calls `supabase.auth.linkIdentity({ provider: 'google' })`.
- A Google login popup/redirect opens, asking the user to sign in to the email they want to link.
- After successful authentication, Supabase automatically merges the new email into the existing account identity.
- Our Postgres trigger on `auth.identities` enforces the limit and logs the new email into `user_schools` as an `alumni` status (if applicable).

---

## Verification Plan

### Automated Tests (Manual Run)
- Execute raw SQL queries in Supabase SQL Editor to verify that:
  - Trigger creates `profiles` correctly on user insertion.
  - Trigger UPSERTs into `schools` and creates `user_schools` (`student`) ONLY for non-public domains.
  - Trigger safely ignores linking beyond 2 identities, and creates `user_schools` (`alumni`) on valid identity linking.
  - `connections` table logic and `check_is_connected` function work.
  - `tags` properly dedupes via `UNIQUE` constraint.
  - RLS policies block unauthorized updates.

### Manual Verification
- Go through the Google OAuth flow with a school email and a public email (e.g., gmail) to verify domain logic.
- Complete Onboarding (verify name extraction, auto-generated color, mandatory tag selection/creation, and `app_metadata` update).
- Test manual identity linking via `supabase.auth.linkIdentity` and verify the `alumni` logic and the 1-personal-email limit.
- Edit Profile (verify privacy updates and Server Component data filtering).
- Send and accept a connection request, then verify that "Connections Only" privacy settings expose data correctly.
