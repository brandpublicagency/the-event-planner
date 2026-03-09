

## Dashboard 2 — Functionality & UI Review

After reviewing all 10 components, here is a summary of issues and improvements:

### Bugs / Functional Issues

1. **Notifications Drawer: Eye icon never shows** — The `Eye` icon on each notification uses `group-hover:opacity-100` but the parent `<button>` lacks the `group` class. It is always invisible.

2. **KPI loading skeleton mismatch** — The loading state renders a `lg:grid-cols-3` grid with 3 skeletons, but the actual layout uses `lg:col-span-2` + 1 column (a nested grid). The skeleton should match the real layout structure.

3. **Chat reactions query key instability** — `messageIds` array is recalculated every render, causing the `["chat-reactions", messageIds]` query key to change on every render even when messages haven't changed. Should be memoized or use a stable key (e.g., joined string).

4. **Event card `venues` field** — `Dashboard2EventCard` accesses `event.venues?.[0]` but the events query in `Dashboard2EventsSection` uses `select('*')`. If `venues` is a joined table rather than a column, this will silently be `undefined`. Low risk but worth verifying.

### UI Improvements

5. **KPI strip gap inconsistency** — The KPI strip uses `gap-3` while the main content grid uses `gap-4`. Aligning both to `gap-4` ensures the column gutters match perfectly.

6. **"Latest Updates" card is redundant** — There is already a bell icon in the header that opens the same notifications drawer. The sidebar card duplicates functionality. Consider removing it or repurposing it to show a preview of the latest 2-3 notification titles.

7. **Chat height is fixed at 300px** — On large screens with few events, the chat could use more vertical space. Consider using `min-h-[300px]` with `flex-1` to fill available space, or keep fixed but make it configurable.

8. **Weather card hover state missing** — All other cards use `hover:border-foreground/30` but the weather card only has a static border. Should add the hover class for consistency.

9. **Tasks section hardcoded dark-mode colors** — Priority badges use hardcoded `dark:bg-red-900/30` etc. instead of semantic tokens. This works but diverges from the design system's guidance to use semantic tokens only.

### Plan

| # | Change | File |
|---|--------|------|
| 1 | Add `group` class to notification button | `Dashboard2NotificationsDrawer.tsx` |
| 2 | Fix KPI loading skeleton to match 2+1 layout | `Dashboard2KPIStrip.tsx` |
| 3 | Memoize `messageIds` for stable reaction query key | `Dashboard2TeamChat.tsx` |
| 4 | Align KPI strip gap from `gap-3` to `gap-4` | `Dashboard2KPIStrip.tsx` |
| 5 | Add `hover:border-foreground/30` to weather card | `Dashboard2WeatherCard.tsx` |
| 6 | Make "Latest Updates" card show 2-3 recent notification titles as a preview instead of just a count | `Dashboard2Layout.tsx` |

All changes are small, isolated edits — no structural refactoring needed.

