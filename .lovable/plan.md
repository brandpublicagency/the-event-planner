

## Code Audit & Cleanup Plan

This is a large project (~100+ component files, 42 files with console.logs, multiple dead components). The audit is organized by priority and impact.

---

### Phase 1: Remove Debug Statements (~42 files)

Strip all `console.log` statements from `src/` files. Keep `console.error` and `console.warn` as they serve a purpose. Files with the most logs:

- `src/contexts/task/useTaskQuery.ts` (6 logs)
- `src/contexts/task/useTaskMutations.ts` (9 logs)
- `src/hooks/file-operations/useFileUpload.ts` (4 logs)
- `src/hooks/file-operations/useFileView.ts`
- `src/hooks/useReliableFileUpload.ts`
- `src/hooks/useDocumentState.ts`
- `src/utils/createEventUtils.ts` (4 logs)
- `src/utils/eventUpdateUtils.ts`
- `src/pages/EditEvent.tsx`
- `src/components/notifications/NotificationList.tsx`
- `src/components/notifications/content/NotificationListWrapper.tsx`
- `src/components/notifications/NotificationFilters.tsx`
- `src/components/forms/VenueSelect.tsx`
- `src/components/contacts/ContactsPage.tsx`
- `src/components/profile/ProfileAvatar.tsx`
- `src/components/profile/AddTeamMemberForm.tsx`
- `src/components/tasks/file-actions/FileActions.tsx`
- Plus ~25 more files

---

### Phase 2: Remove Unused Imports & Dead Code

| File | Issue |
|------|-------|
| `src/utils/createEventUtils.ts` | Unused `import { useQueryClient }` — a React hook imported in a non-React utility file |
| `src/components/notifications/EmptyNotifications.tsx` | Dead component — never imported anywhere |
| `src/components/dashboard/weather/WeatherCardDemo.tsx` | Dead component — never imported outside its own barrel export |
| `src/components/dashboard/weather/EnhancedWeatherCard.tsx` | Only imported by dead `WeatherCardDemo` |
| `src/components/dashboard/weather/WeatherCard.tsx` | Only used in barrel export, not imported by any page or layout |
| `src/components/dashboard/weather/CurrentWeather.tsx` | Never imported |
| `src/components/dashboard/weather/WeatherDetails.tsx` | Only imported by dead `CurrentWeather` |
| `src/components/dashboard/weather/WeatherCardHeader.tsx` | Only imported by dead `EnhancedWeatherCard` |
| `src/components/dashboard/weather/index.ts` | Clean up re-exports of dead components |

---

### Phase 3: Simplify Unnecessary Wrapper Components

**`NotificationListWrapper`** — This component does nothing except forward props and add console.logs. After removing the logs, it's a pure pass-through. Replace its usage in `NotificationContent.tsx` with a direct `<NotificationsList>` call and delete the wrapper file.

**`src/components/layout/SearchBar.tsx`** — Just re-exports from `./search`. Inline the import at call sites and remove this file.

---

### Phase 4: Code Quality Fixes

**Inconsistent patterns:**
- `src/components/notifications/NotificationList.tsx`: `handleView` and `handleComplete` call `e.preventDefault()` and `e.stopPropagation()` but then pass `e` to the parent which also calls them — redundant event stopping. Simplify to just forward to parent.
- `src/components/dashboard/DashboardNotificationsDrawer.tsx`: Inline IIFE for actor extraction (lines 89-102) should be extracted to a utility function.

**Type safety:**
- `src/components/forms/EditEventForm.tsx` uses `UseFormReturn<any>` — should use the actual form schema type.
- `src/components/dashboard/weather/WeatherWidgetContent.tsx` uses `any` for `weatherData` and `forecast` props.

**Unused variable in `activityLogUtils.ts`:**
- Still selects `surname` in the profile query even though it's no longer used.

---

### Phase 5: Minor Optimizations

- `src/components/dashboard/DashboardWeatherCard.tsx`: Unused `timeOfDay` destructured from `useTimeManager()`.
- `src/components/events/EventCard.tsx`: Destructures `name` and `event_code` from event but `name` is only used in the delete dialog — could pass `event` directly.

---

### Files Modified (Summary)

| Category | Count | Key files |
|----------|-------|-----------|
| Console.log removal | ~42 files | All `src/` files containing `console.log` |
| Dead component deletion | 6 files | `EmptyNotifications`, `WeatherCardDemo`, `EnhancedWeatherCard`, `WeatherCard`, `CurrentWeather`, `WeatherDetails`, `WeatherCardHeader` |
| Wrapper removal | 2 files | `NotificationListWrapper`, `SearchBar` re-export |
| Unused import cleanup | ~5 files | `createEventUtils`, `activityLogUtils`, `DashboardWeatherCard`, etc. |
| Code quality | ~5 files | Type improvements, extracted utility, redundant event handling |
| Barrel export cleanup | 1 file | `weather/index.ts` |

**Total: ~55 files touched**

---

### Items Requiring Product/Design Decision

1. **Weather module has significant dead code** (7 unused components). The active weather path uses only `WeatherWidget` + `DashboardWeatherCard`. Confirm these demo/legacy cards should be deleted.
2. **Two empty state components for notifications** (`EmptyNotifications.tsx` and `EmptyState.tsx`) — only `EmptyState` is used. Confirm `EmptyNotifications` can be deleted.
3. **`NotificationListWrapper`** adds zero value — confirm it can be inlined.

### Technical Debt Flagged

1. **554 console.logs in src/** — significant noise in production.
2. **`useQueryClient` imported in a plain utility** (`createEventUtils.ts`) — this is a React hook and cannot be used outside a component. Dead import that could cause confusion.
3. **`any` types** throughout form and weather components — reduces TypeScript value.
4. **No error boundaries** on most page-level components (only `NotificationListContainer` has one).
5. **Edge function files** (`supabase/functions/`) also contain extensive console.logs — excluded from this cleanup as they run server-side where logging is appropriate, but worth noting.

