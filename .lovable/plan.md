

# Global Font Size Reduction and UI Cleanup

## Overview
Reduce font sizes, tighten spacing, and create a cleaner, more minimal UI across the entire application. The goal is a Vercel/Notion-inspired aesthetic -- compact, quiet, and functional.

## Design Principles
- Base body text: 13px (currently ~14-16px in many places)
- Section headings: 14-15px (currently 18px `text-lg`)
- Page headers stay at current size (already clean)
- Reduce vertical padding/margins by ~25%
- Icons: consistently 3.5-4px (`h-3.5 w-3.5` or `h-4 w-4`)

---

## Changes by Area

### 1. Global CSS (`src/index.css`)
- Reduce `.document-content` base font from 13px to 12.5px
- Reduce heading sizes (h1: 20px, h2: 16px, h3: 14px -- down from 24/18/15)
- Tighten paragraph margins

### 2. Dashboard Message (`DashboardMessage.tsx`)
- Reduce inline `fontSize: '1.05rem'` to `0.875rem` (14px) for both greeting lines
- Reduce outer margins (`mb-6 mt-4` to `mb-4 mt-2`)

### 3. Dashboard Section Headers (`UpcomingEventsSection.tsx`, `DashboardTasksSection.tsx`, `DashboardNotificationsSection.tsx`)
- Section title: `text-lg` (18px) down to `text-sm` (14px)
- Icon size: `h-5 w-5` down to `h-4 w-4`
- Header padding: `p-4 py-5` down to `p-3 py-3`

### 4. Event Month Group (`EventMonthGroup.tsx`)
- Month heading: `text-lg` down to `text-sm font-medium`

### 5. Sidebar (`SidebarNavItem.tsx`, `SidebarProfile.tsx`, `SidebarActions.tsx`)
- Already using `text-xs` -- no change needed, these are clean
- Profile name is `text-xs`, email is `text-[10px]` -- already compact

### 6. Header (`src/components/layout/Header.tsx`)
- Header height: `h-16` down to `h-12`
- Padding: `px-6` down to `px-4`

### 7. Documents Section (`DocumentsSidebar.tsx`, `DocumentEditorHeader.tsx`, `EditorToolbar.tsx`)
- Toolbar buttons: `h-9 w-9` down to `h-7 w-7`
- Toolbar icon size: `h-4 w-4` down to `h-3.5 w-3.5`
- Toolbar wrapper padding and margin reduced
- Document list items: already `text-sm`, keep as-is

### 8. Events Page (`Events.tsx`, `EventCard.tsx`)
- Event card padding: `p-3` to `p-2.5`
- Consistent `text-sm` for event names, `text-xs` for metadata

### 9. Tasks Page (`Tasks.tsx`, `TaskList.tsx`)
- Task list spacing adjustments to match tighter layout

### 10. Toast Styles (`toast.css`)
- Title: already `0.875rem` -- no change
- Description: already `0.8125rem` -- no change

---

## Files to Modify (11 files)

| File | Change |
|------|--------|
| `src/index.css` | Reduce document heading sizes, tighten margins |
| `src/components/layout/Header.tsx` | Reduce header height and padding |
| `src/components/dashboard/DashboardMessage.tsx` | Reduce greeting font size and margins |
| `src/components/dashboard/UpcomingEventsSection.tsx` | Smaller section header |
| `src/components/dashboard/DashboardTasksSection.tsx` | Smaller section header |
| `src/components/dashboard/DashboardContent.tsx` | Reduce gap/margin |
| `src/components/events/EventMonthGroup.tsx` | Smaller month heading |
| `src/components/events/EventCard.tsx` | Tighter card padding |
| `src/components/documents/EditorToolbar.tsx` | Smaller toolbar buttons |
| `src/components/documents/DocumentEditorHeader.tsx` | Tighter header spacing |
| `src/components/documents/DocumentContent.tsx` | Adjust content padding |

## What stays unchanged
- Sidebar (already compact with `text-xs`)
- Toast styles (already well-sized)
- Document list items (already `text-sm`)
- All business logic, hooks, types, and backend code

