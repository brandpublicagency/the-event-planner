

## Fix: Align All Header Actions to Far Right with Consistent Heights

### Problem
The action buttons (category, save, print, export, delete) aren't fully right-aligned opposite the Library button, and the DocumentActions icon buttons are shorter (`h-7 w-7`) than the category selector and save button (`h-9`).

### Changes

**`src/components/documents/DocumentEditor.tsx`** (lines 130-153)
- The actions div already has `ml-auto` which should work, but the Header component also has its own `ml-auto` div (line 123 of Header.tsx). Need to ensure proper flex spacing. Change the structure so the back button and actions are in a single flex row using `flex-1 justify-between` pattern, or keep `ml-auto` which already works with the Header's flex layout.
- Verify `ml-auto` is present and gap/height is consistent.

**`src/components/documents/DocumentActions.tsx`**
- Change all icon buttons from `h-7 w-7` to `h-9 w-9` to match the category selector and save button height.
- Adjust icon sizes slightly if needed for visual balance.

### Summary
| File | Change |
|------|--------|
| `DocumentActions.tsx` | Icon buttons `h-7 w-7` → `h-9 w-9` |
| `DocumentEditor.tsx` | Ensure `ml-auto` on actions container; all items `h-9` |

