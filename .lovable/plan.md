

## Activity Log for Event Detail View

### Approach

Store activity log entries as a JSONB array directly on the `events` table in a new `activity_log` column. This avoids creating a new table and keeps the data co-located with the event.

### 1. Database Migration

Add an `activity_log` JSONB column to the `events` table, defaulting to `'[]'::jsonb`.

```sql
ALTER TABLE public.events ADD COLUMN activity_log jsonb DEFAULT '[]'::jsonb;
```

### 2. Types Update

**`src/types/event.ts`** — Add to `Event` interface:
```ts
activity_log: ActivityLogEntry[] | null;
```

New type:
```ts
export interface ActivityLogEntry {
  actor: string;       // user's full_name or "System"
  action: string;      // plain-English description
  timestamp: string;   // ISO string
}
```

### 3. Activity Log Utility

**New file: `src/utils/activityLogUtils.ts`**

- `addActivityLogEntry(eventCode: string, actor: string, action: string)` — fetches current `activity_log` from the event, prepends a new entry `{ actor, action, timestamp: new Date().toISOString() }`, and updates the event record.
- `getActorName()` — helper that fetches the current user's profile `full_name` (or returns "System").

### 4. Wire Up Logging to Existing Actions

**`src/utils/eventUtils.ts`** — `createEvent`: after creation, call `addActivityLogEntry(eventCode, actorName, "Created this event")`.

**`src/utils/eventUpdateUtils.ts`** — `updateEvent`: compare old vs new data, generate change descriptions (e.g. "Date changed to 12 April 2026", "Pax changed to 150"), call `addActivityLogEntry` for each change.

**`src/hooks/useEvents.ts`** — `confirmDelete`: log "Deleted this event" (soft) or "Permanently deleted this event" before the actual delete.

**`src/utils/eventUtils.ts`** — `markEventAsCompleted`: log "Marked event as completed".

### 5. Notification Text Enhancement

**`src/services/eventService.ts`** — Update the `handle_new_event` trigger (or the notification insertion points) to include actor name in notification text. Since the trigger is a DB function, update it to accept actor context, OR update the client-side notification creation to use format `"[Actor] [action]"`.

More practically: update the `handle_new_event` DB trigger to read `created_by` from the new row and join with `profiles` to get the name. Alternatively, insert notifications client-side after event creation with the actor name included.

### 6. Activity Log UI Component

**New file: `src/components/event-details/EventActivityLog.tsx`**

- Collapsible section using `Collapsible` from shadcn-ui
- Header: "Activity Log" with chevron toggle, consistent with existing section styling
- Timeline rendering:
  - Left border: `border-l-2 border-muted` with relative-positioned dots (`w-2 h-2 rounded-full bg-muted-foreground`)
  - Each entry: actor in `font-medium`, action in regular weight, timestamp in `text-xs text-muted-foreground`
  - "System" entries: actor text uses `text-muted-foreground` instead of `text-foreground`
  - Most recent first
- If > 10 entries: show first 10, "Show all" button expands to full list
- Read-only, no edit/delete controls
- Timestamp format: `18 Mar 2026 at 14:32` using `format(date, "dd MMM yyyy 'at' HH:mm")`

### 7. Integration into Event Details

**`src/components/event-details/EventDetailsContent.tsx`** — Add `EventActivityLog` below the Terms & Conditions section (outside the print container so it doesn't print), passing `event.activity_log`.

### Files Changed

| File | Change |
|------|--------|
| **Migration** | Add `activity_log` JSONB column to `events` |
| `src/types/event.ts` | Add `ActivityLogEntry` interface and `activity_log` field |
| `src/utils/activityLogUtils.ts` | **New** — logging utility functions |
| `src/utils/eventUtils.ts` | Log on create, delete, complete |
| `src/utils/eventUpdateUtils.ts` | Log field-level changes on update |
| `src/hooks/useEvents.ts` | Log on soft/permanent delete |
| `src/components/event-details/EventActivityLog.tsx` | **New** — timeline UI component |
| `src/components/event-details/EventDetailsContent.tsx` | Add activity log section |
| `src/services/eventService.ts` | Include actor name in notification text |

