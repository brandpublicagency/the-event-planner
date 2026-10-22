## App-Wide Audit and Improvement Pass

Work page by page across all 19 pages (Dashboard, Events, Passed Events, Event Details/New/Edit, Calendar, Tasks, Task Details/New, Contacts, Documents, Document Detail/Whiteboard, Notifications, Profile, Settings, Schedule Meeting/Site Visit, Login). No data, permissions or business logic changes. Every authenticated user keeps full access.

### Phase 1 — Safe fixes, done directly

**Accessibility**
- Add `aria-label` to about 32 icon-only buttons that have none.
- Add `alt` text to 5 images that have none (profile avatar, link previews, task file thumbnails, rich text card).
- Make sure every form field has a label. Check headings run in order, there is one `<main>` per page, and focus rings show on clickable elements.
- Make tap targets at least 44px on mobile, mainly the sidebar, toolbars and card actions.

**Visual consistency (design tokens)**
- Swap fixed colours (`bg-white`, `text-gray-*`, hex values) for theme colours in DocumentActions, SidebarProfile, SidebarNavItem, ProfileAvatar, ProfileFrontContent, DayCard, PasswordAuth and ResetPasswordAuth. This fixes dark mode in those places.
- Whiteboard: keep its own colour values on purpose, because PNG export needs fixed colours.
- Make page headers, card padding and section spacing match across list pages (Events, Tasks, Contacts, Documents).

**Responsiveness and layout shift**
- Swap `h-screen` for `h-dvh` in RootLayout, Login, ProtectedRoute, DocumentLibrary, EventDetails and the Schedule and Profile pages. This fixes clipping on mobile browsers.
- Use skeleton loaders shaped like the real content on list and detail pages so the page doesn't jump while loading.
- Check each page at 375px, 768px and 1280px.

**States and feedback**
- Make sure every list has a loading state, an empty state with a clear next action, and an error state.
- Make sure every form shows field errors, disables Submit while saving, and shows a success or error toast.
- Rewrite unclear button and label text. No change to meaning.

**Resilience**
- Add a page-level error boundary in RootLayout, so one crashing page shows a fallback instead of a blank app. It reuses the pattern already in NotificationErrorFallback.

### Phase 2 — Verification
- Sign in to the preview and click through each page at mobile and desktop sizes. Take screenshots and check console errors.
- Re-test key flows: create, edit and delete an event; open a notification and land on its event; activity log entries; tasks; documents and whiteboard.
- Confirm the build log is clean.

### Phase 3 — Final report
Areas reviewed, improvements made, issues found, recommendations awaiting approval, and risks.

### Recommendations needing approval (not done in this pass)
1. Replace `any` types in EditEventForm and WeatherWidgetContent with proper schema types.
2. Move activity logs from a list stored on each event to their own table, so they scale and can be queried.
3. Merge the Events and Passed Events pages into one page with tabs.
4. Sort out the two task file storage buckets (`task-files` and `taskmanager-files`).
5. Load pages only when they're opened, to speed up the first load.

### Technical notes
- Edits stay inside the components each fix needs, following the project rule to only touch the area under review.
- No new dependencies. Use shadcn primitives (Radix handles focus and keyboard behaviour).
