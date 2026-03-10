

## Notification System Analysis and Improvement Plan

### Current State Summary

The notification system has a layered architecture: a Supabase `notifications` table, a React context provider with realtime subscriptions, and multiple UI surfaces (header dropdown, dashboard section, dashboard-2 drawer, and full `/notifications` page).

### Issues Found

**1. Database schema is too simple — no user scoping**
The `notifications` table has no `user_id` column. All authenticated users see ALL notifications. The RLS policy is `USING (true)` for SELECT. This means every user sees every notification, and "mark as read" affects all users globally (single `read` boolean column).

**2. `markAsCompleted` is a no-op**
`markAsCompleted` just calls `markAsRead` — there's no actual "completed" status in the database. The `status` field doesn't even exist in the DB; it's computed client-side from the `read` boolean.

**3. Duplicate `formatTitleFromType` function**
The same function exists in `notificationFormatters.ts` and `notificationErrors.ts` with identical logic — a maintenance risk.

**4. Sonner import in realtime hook violates toast convention**
`useRealtimeNotifications.ts` imports directly from `sonner` (`import { toast } from 'sonner'`) instead of the unified `@/hooks/use-toast` wrapper, violating the project's toast consolidation rule.

**5. Excessive console logging**
Nearly every action logs verbose messages — `NotificationsList handleView`, `NotificationAction view clicked`, `Dropdown viewing notification`, `Dropdown navigating to related ID`, etc. This clutters production console output.

**6. Navigation logic duplicated across 3 locations**
The event-code pattern matching and navigation logic (regex checks for event codes, task routing) is copy-pasted in:
- `useNotificationPage.ts` (lines 70-88)
- `NotificationDropdown.tsx` (lines 80-107)
- `useDashboardNotifications.tsx` (lines 53-72)

**7. `lastFilterRefresh` doesn't trigger re-renders**
In `NotificationProvider`, `lastFilterRefresh` is passed as `lastFilterRefreshRef.current` (a ref value), which doesn't cause context consumers to re-render. The `NotificationFilters` component tries to react to it via `useEffect` but this is fragile.

**8. Mock notifications in production path**
When no data is returned from Supabase in development, mock notifications are shown. The `formatNotifications.ts` file in `src/api/notification/` is entirely unused dead code.

**9. No delete capability**
RLS doesn't allow DELETE on notifications, and `clearNotifications` only clears client state without touching the database. Old notifications accumulate forever.

**10. No pagination**
All notifications are fetched at once with no limit. As notifications grow, this will hit the 1000-row Supabase default limit silently.

---

### Improvement Plan

#### Phase 1: Critical Fixes

**A. Extract shared navigation helper**
Create a single `navigateToNotificationTarget(notification, navigate)` utility and use it in all 3 locations (dropdown, dashboard, notifications page).

**B. Fix sonner import**
Replace `import { toast } from 'sonner'` in `useRealtimeNotifications.ts` with the unified `@/hooks/use-toast` import.

**C. Remove duplicate `formatTitleFromType`**
Keep it in `notificationFormatters.ts` and import from there in `notificationErrors.ts`.

**D. Clean up dead code**
Remove unused `formatNotifications.ts` in `src/api/notification/`.

#### Phase 2: Data Model Improvements

**E. Add per-user read tracking (DB migration)**
Create a `notification_reads` table:
```sql
CREATE TABLE notification_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  UNIQUE(notification_id, user_id)
);
```
Update the fetching logic to LEFT JOIN on this table, so each user has independent read state. Remove the `read` column from `notifications` over time.

**F. Add query limit and pagination**
Add `.limit(50)` to the notifications query and implement "load more" on the full page.

#### Phase 3: UX Polish

**G. Convert `lastFilterRefresh` from ref to state**
Make it a proper state value so context consumers re-render when mutations occur.

**H. Reduce console noise**
Remove or guard verbose `console.log` calls behind `process.env.NODE_ENV === 'development'`.

**I. Make `clearNotifications` functional or remove it**
Either add a DELETE RLS policy and implement DB deletion, or remove the misleading function.

---

### Recommended Priority

Start with **Phase 1** (A-D) as these are pure code quality fixes with no DB changes. Phase 2 requires a migration and is higher risk. Phase 3 is polish.

Shall I proceed with implementing Phase 1 first?

