

## Plan: Replace Dashboard with Dashboard 2

Make Dashboard 2 the primary (and only) dashboard by updating routes, sidebar, and removing the old dashboard reference.

### Changes

1. **`src/routes/AppRoutes.tsx`** — Change the `/` route to render `Dashboard2` instead of `Index`. Remove the `/dashboard-2` route.

2. **`src/components/sidebar/sidebarNavItems.ts`** — Remove the "Dashboard 2" nav item (path `/dashboard-2`). Keep the "Dashboard" item pointing to `/`.

3. **`src/hooks/useSidebarGradient.ts`** — Remove `/dashboard-2` from the case that matches dashboard routes (keep just `/`).

4. **`src/components/dashboard2/Dashboard2Layout.tsx`** — Update the `pageTitle` from `"Dashboard 2"` to `"Dashboard"`.

No other files need changes — the old `Index` page and `DashboardLayout` remain in the codebase but are simply no longer routed to.

