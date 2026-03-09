

# Fix Sidebar Collapse/Expand Glitch

## Problem
Two competing width animations run simultaneously:
1. **RootLayout** (line 41-43): CSS `transition-all duration-300` on the wrapper div toggling between `w-[70px]` and `w-64`
2. **Sidebar** (line 35-48): Framer Motion spring animation on `motion.div` toggling between `width: 70` and `width: 256`

These fight each other, causing visible glitching/juddering during collapse and expand.

## Fix

### `src/layouts/RootLayout.tsx`
- Remove the CSS transition and fixed widths from the sidebar wrapper. Let framer-motion be the single source of truth for the width animation.
- Change the wrapper from fixed `w-[70px]`/`w-64` with `transition-all` to simply `w-auto` (or remove width classes entirely), so it naturally wraps the motion.div's animated width.

### `src/components/Sidebar.tsx`
- Remove the redundant `transition-all duration-300 ease-in-out` from the `motion.div` className — framer-motion handles the transition, CSS transition on the same property conflicts.

## Files to modify
| File | Change |
|------|--------|
| `src/layouts/RootLayout.tsx` | Remove `transition-all`, `w-[70px]`/`w-64` from sidebar wrapper; use `flex-shrink-0` only |
| `src/components/Sidebar.tsx` | Remove `transition-all duration-300 ease-in-out` from motion.div className |

