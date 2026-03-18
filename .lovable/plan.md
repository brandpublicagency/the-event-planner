

## Plan: Fix Actor Names Across Activity Logs and Notifications

### Problem Summary

There are two separate issues causing incorrect names:

1. **`created_by` is null on most events** -- The primary event creation path (`src/utils/createEventUtils.ts`) hardcodes `created_by: null`. This means the DB trigger `handle_new_event` cannot resolve the user's name and falls back to "System" in both notifications and activity logs.

2. **Name format shows full name + surname** -- `getActorName()` returns "Anasha Boshoff" instead of just "Anasha". The DB trigger also concatenates `full_name || ' ' || surname`.

### Changes

**1. Fix `src/utils/createEventUtils.ts` -- Set `created_by` to the logged-in user**

Replace `created_by: null` with the authenticated user's ID from `supabase.auth.getUser()`. This ensures the DB trigger can resolve the creator's name for all future events.

**2. Fix `src/utils/activityLogUtils.ts` -- Return first name only**

Change `getActorName()` to return only `profile.full_name` (e.g. "LeRoux") instead of `full_name + surname`. This affects all client-side activity log entries (create, update, delete, complete).

**3. Update the DB trigger `handle_new_event` -- Use first name only**

Modify the function to select only `full_name` instead of `full_name || ' ' || surname`, so notifications say "LeRoux created..." instead of "LeRoux Germishuizen created...".

**4. Data fix -- Patch existing events and notifications**

- Set `created_by` to LeRoux's user ID (`3e90f521-fc6a-43ca-a23e-83b3d5cb252d`) for events where `created_by IS NULL` (these were all created by LeRoux before the fix).
- Update `activity_log` entries: replace `"System"` actor with `"LeRoux"` for all "Created this event" entries on those events.
- Update `activity_log` entries: replace `"Anasha Boshoff"` with `"Anasha"` on Anasha's events.
- Update notification descriptions: replace `"System created"` with `"LeRoux created"` and `"Anasha Boshoff created"` with `"Anasha created"`.

**5. Simplify notification drawer actor extraction**

The regex parsing in `DashboardNotificationsDrawer.tsx` already works correctly with the description format `"LeRoux created ..."`. No code change needed there -- the data fix will make it show the right names.

### Files Modified

| File | Change |
|------|--------|
| `src/utils/createEventUtils.ts` | Add `supabase.auth.getUser()` call, set `created_by` to user ID |
| `src/utils/activityLogUtils.ts` | Return only `profile.full_name` instead of full name + surname |
| DB migration | Update `handle_new_event` trigger to use `full_name` only |
| DB data fix (insert tool) | Patch `created_by`, `activity_log`, and notification `description` for existing records |

