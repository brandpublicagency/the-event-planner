

# Fix Documents Page Layout — Remove Duplicate Search & Tighten Spacing

## Problem
The global `Header` renders a full-width `SearchBar` on every page, including Documents. The Documents sidebar already has its own search input, creating a duplicate. This makes the top section feel bloated and broken.

## Changes

### 1. `src/components/layout/Header.tsx`
- Use `useLocation` (already imported) to detect `/documents` route
- **Hide the `SearchBar`** when on `/documents` — the sidebar already has search
- This immediately removes the large duplicate search bar from the screenshot

### 2. `src/components/documents/DocumentsContainer.tsx`
- No structural changes needed — the layout with `Header` + sidebar + editor flex is correct

### 3. `src/components/documents/DocumentsSidebar.tsx`
- No changes — the sidebar search, collapse toggle, and document list are already clean

## Result
- Single search in the sidebar only (no duplication)
- Compact header with just notifications + user menu on the documents page
- Clean, Notion-like layout with sidebar and full-width editor

## Files to modify
| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Conditionally hide SearchBar on `/documents` |

One file, one targeted fix.

