

## Dashboard 2 — Redesigned Dashboard Page

### Overview
Create a new `/dashboard-2` route with a redesigned dashboard that reuses all existing data sources (events, tasks, notifications, weather, profile) but presents them in a modern, card-based layout inspired by Linear/Vercel aesthetics. The original dashboard remains untouched.

### New Files to Create

1. **`src/pages/Dashboard2.tsx`** — Page wrapper, renders `Dashboard2Layout`

2. **`src/components/dashboard2/Dashboard2Layout.tsx`** — Main layout with Header, greeting strip, KPI row, and content grid

3. **`src/components/dashboard2/Dashboard2Greeting.tsx`** — Warm greeting with date/time display and summary stat line ("5 events this month · 3 tasks pending · 2 high priority"). Reuses `useProfile`, `useTaskContext`, and the events query.

4. **`src/components/dashboard2/Dashboard2KPIStrip.tsx`** — Row of 4 stat cards: Total Events This Month, Total Guests, Pending Tasks, Next Event Countdown. Each card has icon, value, label, and a subtle trend/context indicator. Uses `framer-motion` fade-in.

5. **`src/components/dashboard2/Dashboard2WeatherCard.tsx`** — Compact card version of weather widget. Current conditions prominent on left, scrollable 7-day forecast row below. Reuses existing `useWeatherDataManager` and `useTimeManager` hooks. Styled as a bordered card (not full-width dark banner).

6. **`src/components/dashboard2/Dashboard2EventsSection.tsx`** — Interactive event cards in a 2-column grid (1-col mobile). Each card shows: event name, date, event type badge (colour-coded: Wedding=gold, Private=purple, Celebration=blue, Corporate=slate), pax count, venue. Includes list/calendar toggle (list default, calendar shows mini month view). Events grouped by month with sticky headers. "+ New Event" as primary CTA button. Reuses existing events query from `UpcomingEventsSection`.

7. **`src/components/dashboard2/Dashboard2EventCard.tsx`** — Individual event card with colour-coded type badge, status indicator dot, and hover elevation effect.

8. **`src/components/dashboard2/Dashboard2TasksSection.tsx`** — Tasks grouped by priority (High/Medium/Normal) with count summary at top ("3 tasks · 2 high priority"). Each task has checkbox, priority badge, hover states. Completion triggers strikethrough + fade animation. Proper styled input for adding tasks. Reuses `useTaskContext`.

9. **`src/components/dashboard2/Dashboard2NotificationsDrawer.tsx`** — Sheet/drawer that slides out from right. Triggered by a "Latest Updates" card or the bell icon. Shows notifications with icon, message, timestamp, "View" action. "Mark all read" button at top. Reuses `useDashboardNotifications`.

### Files to Modify

1. **`src/routes/AppRoutes.tsx`** — Add route: `<Route path="/dashboard-2" element={<Dashboard2 />} />`

2. **`src/components/sidebar/sidebarNavItems.ts`** — Add nav item: `{ icon: LayoutGrid, path: "/dashboard-2", label: "Dashboard 2" }` after Dashboard

### Layout Structure

```text
┌─────────────────────────────────────────────┐
│ Header (reuse existing)                     │
├─────────────────────────────────────────────┤
│ Greeting + date/time + stat summary line    │
├──────────┬──────────┬──────────┬────────────┤
│ Events   │ Guests   │ Pending  │ Next Event │
│ This Mo  │ This Mo  │ Tasks    │ Countdown  │
├──────────┴──────────┴──────────┴────────────┤
│                                             │
│  ┌─ Events (2-col grid) ──┐ ┌─ Weather ──┐ │
│  │  Event Card  Event Card│ │ Compact    │ │
│  │  Event Card  Event Card│ │ card       │ │
│  └────────────────────────┘ ├────────────┤ │
│                             │ Tasks by   │ │
│                             │ priority   │ │
│                             │ + add task │ │
│                             └────────────┘ │
│                                             │
│  [Latest Updates card → opens drawer]       │
└─────────────────────────────────────────────┘
```

Desktop: 3-column grid (events span 2, right sidebar for weather + tasks). Mobile: single column stack.

### Technical Details

- All data hooks reused as-is: `useProfile`, `useTaskContext`, `useDashboardMessage`, `useDashboardNotifications`, `useWeatherDataManager`, `useTimeManager`, existing events Supabase query
- Animations via `framer-motion` (already installed): staggered card fade-ins, task completion strikethrough
- Notifications drawer uses `Sheet` from `@/components/ui/sheet`
- Event type badges use `Badge` component with custom colour classes via `cn()`
- Loading states use `Skeleton` components
- KPI cards use semantic tokens (`bg-card`, `border-border`, `text-foreground`)
- Responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- Dark mode works automatically via existing theme tokens
- ~10 new files, 2 modified files

