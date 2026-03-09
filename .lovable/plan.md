

## Spacing and Color Consistency Fix — Event Components

### Problem

Multiple spacing inconsistencies and remaining hardcoded colors across event components:

1. **EventMonthGroup heading** uses arbitrary pixel values (`ml-[5px]`, `py-[5px]`, `mb-[10px]`) instead of Tailwind spacing scale
2. **EventsTable** uses different spacing for dashboard (`space-y-2.5 pt-2`) vs events page (`space-y-4 pb-4`) with no clear rationale
3. **EventsList** still has hardcoded colors: `text-zinc-400`, `text-slate-900`, `bg-white`, `border-primary-400`

### Plan

**Standardize on these spacing tokens:**
- Gap between month groups: `space-y-6` (both dashboard and events page)
- Gap between cards within a group: `space-y-2` (consistent)
- Month heading: `text-lg font-semibold mb-2` (clean, no arbitrary values)

**Files to change:**

| File | Change |
|------|--------|
| `EventMonthGroup.tsx` (line 65) | Replace `text-2xl mt-0 ml-[5px] py-[5px] pb-0 mb-[10px]` with `text-lg font-semibold mb-2` |
| `EventMonthGroup.tsx` (line 66) | Normalize card gap to `space-y-2` |
| `EventsTable.tsx` (line 71) | Dashboard wrapper: `space-y-6 pt-2` → `space-y-6` |
| `EventsTable.tsx` (line 94) | Events page wrapper: `space-y-4 pb-4` → `space-y-6 pb-4` |
| `EventsList.tsx` (line 38) | `text-zinc-400` → `text-muted-foreground` |
| `EventsList.tsx` (line 53) | `text-slate-900 bg-white border-primary-400` → `text-foreground bg-background border-border` |

This ensures both pages use identical spacing rhythm and all hardcoded colors are removed.

