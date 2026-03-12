

## Plan: Clean up header notifications and fix spacing

### Problem
The Header component always renders the old `NotificationButton` (dropdown-based), causing duplicate notification bells on the dashboard (which has its own drawer-based bell). The notification badge on the dashboard bell also has conflicting size classes.

### Changes

1. **`src/components/layout/Header.tsx`** — Remove `NotificationButton` import and usage from the right-side actions. This eliminates the old dropdown notification system from all pages. Users can still access notifications via the `/notifications` page and the dashboard drawer.

2. **`src/components/dashboard2/Dashboard2Layout.tsx`** — Fix the notification badge: the `variant="notification"` badge defines `min-w-[24px] h-[24px]` but the inline classes override with `h-4 min-w-[16px]`, causing a broken bubble. Fix by using consistent small sizing directly (remove variant conflict, use simple inline classes for a clean small badge). Also clean up spacing between the dashboard's custom header children and the Header's default right-side items (UserMenu, action buttons) so they don't double up `ml-auto`.

3. **`src/components/layout/NotificationButton.tsx`** and **`src/components/layout/NotificationDropdown.tsx`** — Delete these files since they're no longer used.

4. **Badge fix** — Update the dashboard bell badge to use `variant="destructive"` or raw classes that don't conflict, producing a clean small red circle with count.

