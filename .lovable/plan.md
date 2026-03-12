

## Problem

The Dashboard header has three issues:

1. **Old SearchBar on the left** — The `Header` component renders the old `<SearchBar />` (a text input) on the left side. On the dashboard, you want only the ⌘K command palette trigger, not the old search input.
2. **Dark mode toggle doesn't work** — The dark mode and notification buttons are passed as `children` to `Header`, but `Header` has its own `ml-auto` on the right-side `div` (UserMenu area). Both the children's `ml-auto` and the Header's `ml-auto` compete, causing layout/click issues.
3. **Notification bell doesn't work** — Same root cause as above.

## Plan

### 1. `src/components/layout/Header.tsx`
- Add a new prop `hideSearchBar?: boolean` to the `HeaderProps` interface.
- Use it to conditionally hide `<SearchBar />`: render only when `!isDocumentsPage && !hideSearchBar`.

### 2. `src/components/dashboard/DashboardLayout.tsx`
- Pass `hideSearchBar` to `Header`.
- Move the dark mode toggle, notification bell, and ⌘K search button out of `children` and into the Header's right-side area using the `secondaryAction` prop instead. This places them alongside UserMenu in the correct flex container.
- Wrap all three buttons (⌘K trigger, dark mode toggle, notification bell) in a fragment and pass as `secondaryAction`.
- Remove the `children` block entirely.

This keeps the Header layout consistent — all action buttons live in the right-side `ml-auto` container next to UserMenu, and the old search bar is hidden on the dashboard.

### Scope
Two files changed: `Header.tsx` (add `hideSearchBar` prop) and `DashboardLayout.tsx` (restructure button placement).

