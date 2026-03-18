

## Two Changes: Pulse on Notification Dot + Animated Gradient Border for Today's Events

### 1. Pulse animation on the red unread notification dot

**Files**: `src/components/dashboard/DashboardNotificationsDrawer.tsx`, `src/components/dashboard/DashboardLayout.tsx`

Add `animate-pulse` to the red dot in the notifications drawer (line 66) and to the bell badge in the sidebar (line 54).

```tsx
// Drawer dot (line 66)
<div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />

// Sidebar bell badge (line 54)
<span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground animate-pulse">
```

### 2. Animated gradient border on today's event cards

The existing `AnimatedBorder` component uses JS `setInterval` to rotate a gradient — this works but has issues: it uses `bg-white` hardcoded (breaks dark mode), uses `animate-pulse` on the gradient div which causes fading, and runs a timer every 20ms.

**Rewrite `src/components/ui/animated-border.tsx`** to use pure CSS with `@property` and `conic-gradient`:

- Use a CSS `@keyframes` animation rotating a `conic-gradient` angle via a CSS custom property
- Outer wrapper: `position: relative`, `padding: borderWidth` (2px)
- Pseudo-element approach via an absolutely positioned gradient div behind the content
- Inner content div: `bg-card` (not `bg-white`) to support dark mode, with matching `borderRadius`
- 4-second cycle, smooth continuous rotation
- Colors: yellow → orange → pink/purple → blue → teal → green → back to yellow

**Update `src/components/events/dashboard/EventCardWrapper.tsx`**:
- Already conditionally wraps with `AnimatedBorder` when `eventIsToday` — just update the props: `borderWidth={2}` (per spec)

**Update `src/components/dashboard/DashboardEventCard.tsx`**:
- Import `isToday` from date-fns and `AnimatedBorder`
- Check if event date is today
- Wrap the card button in `AnimatedBorder` when it's today

**Add CSS keyframes** to `src/index.css`:
```css
@keyframes border-rotate {
  from { --border-angle: 0deg; }
  to { --border-angle: 360deg; }
}
```

Since `@property` has limited browser support, the simpler approach is to keep the JS angle rotation from the existing component but fix the issues:
- Replace `bg-white` with `bg-card` 
- Remove the `animate-pulse` class from the gradient div
- Update default colors to the requested spectrum
- Change default `borderWidth` to match usage

### Files Changed

| File | Change |
|------|--------|
| `src/components/dashboard/DashboardNotificationsDrawer.tsx` | Add `animate-pulse` to red dot |
| `src/components/dashboard/DashboardLayout.tsx` | Add `animate-pulse` to bell badge |
| `src/components/ui/animated-border.tsx` | Fix: `bg-card` instead of `bg-white`, remove `animate-pulse` from gradient, update default colors |
| `src/components/events/dashboard/EventCardWrapper.tsx` | Change `borderWidth={2}` |
| `src/components/dashboard/DashboardEventCard.tsx` | Add today-check and wrap in `AnimatedBorder` |

