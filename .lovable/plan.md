

# Fix Header-Sidebar Proportion Mismatch

## Problem
The sidebar profile area is **65px tall** (`h-[65px]`), while the global header is only **48px tall** (`h-12`). This creates a visible misalignment where the header row doesn't line up with the sidebar logo/name section. The screenshot clearly shows the top-right header content sitting at a different height than the left sidebar profile.

## Fix

### 1. `src/components/layout/Header.tsx`
- Change the header height from `h-12` (48px) to `h-[65px]` to match the sidebar profile height exactly.

### 2. `src/components/documents/DocumentsContainer.tsx`  
- Remove the `<Header>` component entirely from the Documents page. The documents page should not render the global header at all — the sidebar profile already provides the top-level context, and the document sidebar has its own search. Notifications and user menu are accessible from the sidebar. This eliminates the redundant top bar and gives documents full vertical space.

**Wait — removing the header removes notifications/user menu access.** Better approach:

### Revised approach — keep header, match heights:

**`src/components/layout/Header.tsx`** (line 68):
- Change `h-12` to `h-[65px]` so the header aligns with the sidebar profile section.

That's it. One line change. The header and sidebar profile will be the same height, fixing the proportion issue across all pages.

## Files to modify
| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Change `h-12` → `h-[65px]` on line 68 |

