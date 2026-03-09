

# Full Codebase Audit and Improvement Plan

## 1. Dead Code Removal

The following files/components are **never imported anywhere** and should be deleted:

| File | Reason |
|------|--------|
| `src/components/Header.tsx` | Duplicate of `src/components/layout/Header.tsx`. No imports found. |
| `src/components/PageHeader.tsx` | Thin wrapper around `Header`, never imported. |
| `src/components/ProfileBox.tsx` | Never imported by any file. |
| `src/components/FlipCard.tsx` | Only imported by `ProfileBox.tsx` (also dead). |
| `src/components/MetricCard.tsx` | Never imported. |
| `src/components/layout/HeaderActions.tsx` | Never imported. |
| `src/components/layout/PageTitle.tsx` | Never imported. |
| `src/components/documents/DocumentsHeader.tsx` | Never imported. |
| `src/App.css` | Vite boilerplate CSS, never imported. Contains `#root` styles that conflict with the app. |
| `src/data/mockEvents.ts` | Never imported. |
| `src/hooks/useAvatarUpload.ts` | Never imported. |
| `src/hooks/useBeforeUnload.ts` | Never imported. |
| `src/hooks/useUndoableAction.ts` | Never imported. |
| `src/hooks/useChatContext.ts` | Never imported. |
| `src/hooks/useChatMessageHandler.ts` | Never imported (different from `src/hooks/chat/useChatMessageHandler.ts`). |
| `src/hooks/useConfirmationHandler.ts` | Never imported. |
| `src/services/chatContext.ts` | Never imported. |
| `src/services/chatStream.ts` | Never imported. |
| `src/services/streamingChatService.ts` | Never imported. |
| `src/services/email.ts` | Never imported. |
| `src/services/taskService.ts` | Never imported. |
| `src/utils/chatActionHandler.ts` | Never imported. |
| `src/utils/chatActionParser.ts` | Never imported. |
| `src/utils/chatContextUtils.ts` | Never imported. |
| `src/utils/errorNotifications.ts` | Never imported. |
| `src/utils/chat/` (entire directory) | Never imported. |
| `src/hooks/chat/useChatMessageHandler.ts` | Never imported. |
| `src/providers/NotificationProviders.tsx` | Never imported (wraps contexts already provided in `AppProviders`). |
| `src/assets/event-overview-reference.jpg` | Never imported. |
| `src/contexts/NotificationPreferencesContext.tsx` | Only imported by dead `NotificationProviders.tsx` and one settings component -- needs verification. |

**Total: ~25+ dead files to remove.**

---

## 2. Toast System Consolidation

Currently there are **two toast patterns** used across 37+ files:
- `import { toast } from "sonner"` — direct sonner (15 files)
- `import { useToast } from "@/hooks/use-toast"` — custom wrapper hook (22 files)

Both ultimately call sonner. The `use-toast.ts` wrapper adds queue management but creates confusion about which to use.

**Plan:** Standardise on a single import. The `use-toast.ts` wrapper provides queue management value, so keep it but expose a simpler API. Migrate all `import { toast } from "sonner"` to `import { toast } from "@/hooks/use-toast"` for consistency.

---

## 3. Hardcoded Colors

There are **1,151 matches** of hardcoded colors (`bg-gray-*`, `bg-zinc-*`, `bg-white`, `text-gray-*`, `text-zinc-*`, `border-gray-*`, `border-zinc-*`) across **101 files**. This is a significant audit. 

**Plan:** Tackle the highest-impact pages first — components in `layout/`, `sidebar/`, `dashboard/`, and page-level files. Replace with design system tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.). This will be done in batches across ~15-20 key files per pass.

---

## 4. Sidebar Unused Import

`src/components/Sidebar.tsx` imports `useToast` but the destructured `toast` is never used.

---

## 5. Duplicate Notification Context Wiring

`NotificationPreferencesContext.tsx` and `NotificationProviders.tsx` exist but the latter is never used in `AppProviders`. The notification preferences are either dead or partially wired.

---

## 6. Events Page Hardcoded Background

`src/pages/Events.tsx` line 54: `bg-gray-100` should be `bg-muted` or `bg-background`.

---

## 7. `useEffect` refetch anti-pattern

`src/pages/Events.tsx` has `useEffect(() => { refetch(); }, [refetch])` which is redundant — React Query auto-fetches on mount. This causes an unnecessary double fetch.

---

## Implementation Priority

Given the scope, I will batch this into focused changes:

### Batch 1: Delete dead files (~25 files)
Remove all unused components, hooks, services, utilities, and assets listed above.

### Batch 2: Fix active code issues
- Remove unused `useToast` import from `Sidebar.tsx`
- Remove redundant `useEffect refetch` from `Events.tsx`
- Replace `bg-gray-100` with `bg-muted` on `Events.tsx`

### Batch 3: Hardcoded color migration (top 15 files)
Replace hardcoded zinc/gray/white colors with design system tokens in the most visible components: sidebar, layout, dashboard, events, tasks.

### Batch 4: Toast consolidation
Migrate all 15 files using direct `sonner` imports to use the unified `use-toast` wrapper instead.

---

## Decision Required

**NotificationPreferencesContext:** This context is imported by `src/components/settings/NotificationPreferences.tsx` (a real settings component). Deleting it would break that settings panel. My recommendation: **keep it**, but wire it into `AppProviders` if the notification preferences settings page is intended to work. Please confirm whether the notification preferences settings panel should remain functional.

