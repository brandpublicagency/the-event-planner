

## Plan: Fix Attribution for Website-Created Events

### Problem
The previous data migration set `created_by` to LeRoux's ID for ALL events where it was NULL. However, events created via the website forms (fluent-forms-webhook / event-contract-webhook) should have `created_by = NULL` and show "System" in activity logs and notifications — identifiable by having `event_notes` populated (terms and conditions).

### Changes

**1. Data fix (using insert tool) — Revert website-created events**

For all events where `event_notes IS NOT NULL AND event_notes != ''`:
- Set `created_by` back to `NULL`
- Replace `"LeRoux"` with `"System"` in `activity_log` entries
- Update corresponding notification descriptions from `"LeRoux created"` back to `"System created"`

**2. Update DB trigger `handle_new_event`** — already correct
The trigger already falls back to "System" when `created_by` is NULL, so no trigger change needed.

**3. No code changes needed**
The webhook edge functions correctly omit `created_by` (leaving it NULL), which the trigger handles as "System". The client-side `createEventUtils.ts` correctly sets `created_by` to the logged-in user for app-created events.

### Summary
This is a data-only fix — reverting the over-broad migration for ~20+ website-created events.

