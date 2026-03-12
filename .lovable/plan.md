
I investigated the sidebar code and the surrounding runtime flow. The sidebar components themselves are mostly structurally correct, but there is a likely app-level render loop that can make the UI feel frozen and make sidebar clicks appear broken.

## What I found
1. `Sidebar.tsx` and `SidebarNavItem.tsx` do not show an obvious direct click-blocking bug (no invalid nesting, no `pointer-events-none`, links are valid).
2. A likely freeze source exists in notifications refresh flow:
   - `NotificationProvider` creates a non-memoized `refreshNotifications` function each render.
   - `DashboardMessage` runs `useEffect(..., [refreshNotifications])` and calls it.
   - `refreshNotifications` triggers provider state updates (`lastFilterRefresh`), causing rerender and a new function identity.
   - This can create continuous refresh/re-render pressure on `/` (dashboard), making navigation clicks unreliable.

```text
DashboardMessage effect
  -> refreshNotifications()
    -> setLastFilterRefresh(...)
      -> NotificationProvider rerender
        -> new refreshNotifications reference
          -> DashboardMessage effect runs again
```

## Implementation plan
1. Stabilize `refreshNotifications` function identity in `src/contexts/notification/NotificationProvider.tsx`
   - Wrap `wrappedRefreshNotifications` in `useCallback`.
   - Keep dependencies stable (`fetchNotifications`, `triggerFilterRefresh`).
   - Optionally memoize provider value with `useMemo` to reduce unnecessary consumer rerenders.

2. Make dashboard refresh effect one-time safe in `src/components/dashboard/DashboardMessage.tsx`
   - Add a `useRef` guard so refresh runs only once on initial mount.
   - Keep dependency-safe behavior but avoid re-trigger loops if callback identity changes again in future.

3. Harden sidebar interactivity layering (defensive fix) in:
   - `src/components/Sidebar.tsx`
   - `src/layouts/RootLayout.tsx`
   - Add explicit stacking/pointer safety (`relative z-*`, `pointer-events-auto` on sidebar container, `min-w-0` on main).
   - This ensures no main-content overlap steals pointer events from sidebar.

4. Keep `SidebarNavItem.tsx` lightweight
   - Narrow transitions from `transition-all` to targeted transitions (`transition-colors`, icon transform only) to reduce layout work during rapid route changes.
   - Keep Link semantics unchanged unless issue persists, then switch to `NavLink` for cleaner active behavior.

5. Validate after implementation
   - Desktop widths: expanded and collapsed sidebar.
   - Routes: `/`, `/events`, `/calendar`, `/tasks`, `/documents`, `/contacts`.
   - Confirm no freeze while repeatedly clicking different sidebar items.
   - Confirm dark/light token styling remains intact.

## Technical details
- Primary fix is not in `SidebarNavItem` itself; it is in notification refresh lifecycle causing UI churn.
- Sidebar-specific hardening is included to eliminate potential hit-testing/stacking edge cases.
- This combined approach addresses both:
  - root responsiveness problem (freeze),
  - and direct sidebar click reliability.

## Done criteria
- Sidebar items respond immediately on first click.
- Route changes occur without UI lockups/judder.
- No repeated refresh loop on dashboard load.
- No visual regression in sidebar tokens (light/dark).
