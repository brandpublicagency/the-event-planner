

## Problem

The dark mode colour scheme is too harsh and high-contrast. Looking at the screenshot and the CSS variables, the issues are:

1. **Background too saturated/dark** — `222.2 84% 4.9%` has 84% saturation, creating a deep navy that feels intense
2. **Card/border colours too close to background** — borders at `217.2 32.6% 17.5%` create stark lines against the dark bg
3. **Foreground too bright** — `210 40% 98%` (near-white) against the deep navy is jarring
4. **Toast CSS uses hardcoded light-mode colours** — `#f8f8f8` bg, `#333` text, `#1a202c` title — these don't adapt to dark mode
5. **Hardcoded `border-black/10`** in several components doesn't adapt well in dark mode

## Solution

Soften the dark mode palette to be more muted and complementary, and add dark-mode-aware toast styles.

## Changes

### 1. `src/index.css` — Soften dark mode CSS variables (lines 40-67)

Replace the `.dark` block with a softer, lower-saturation palette:

```css
.dark {
    --background: 220 20% 7%;        /* softer dark, less saturated */
    --foreground: 210 20% 88%;       /* slightly muted white, less glaring */
    --card: 220 18% 10%;             /* slightly lifted from bg */
    --card-foreground: 210 20% 88%;
    --popover: 220 18% 10%;
    --popover-foreground: 210 20% 88%;
    --primary: 210 30% 80%;          /* softer primary */
    --primary-foreground: 220 20% 10%;
    --secondary: 220 16% 15%;        /* gentle secondary */
    --secondary-foreground: 210 20% 88%;
    --muted: 220 14% 14%;            /* subtle muted */
    --muted-foreground: 215 15% 55%; /* softer muted text */
    --accent: 220 14% 16%;           /* gentle accent */
    --accent-foreground: 210 20% 88%;
    --destructive: 0 50% 35%;        /* softer red */
    --destructive-foreground: 210 20% 90%;
    --border: 220 12% 18%;           /* softer borders */
    --input: 220 14% 16%;            /* slightly lifted inputs */
    --ring: 210 20% 60%;             /* muted ring */

    --sidebar-bg: 220 20% 9%;
    --sidebar-fg: 210 18% 72%;
    --sidebar-border: 220 14% 16%;
    --sidebar-active: 210 25% 85%;
    --sidebar-active-fg: 220 20% 10%;
    --sidebar-hover: 220 14% 14%;
}
```

Key adjustments: saturation dropped from 84% → 20% on backgrounds, foreground lightness dropped from 98% → 88%, borders lifted slightly for softer contrast.

### 2. `src/toast.css` — Add dark mode support

Add `.dark` scoped overrides so toasts adapt to the dark theme instead of using hardcoded light colours:

```css
.dark [data-sonner-toast] {
  background-color: hsl(220 18% 12%) !important;
  color: hsl(210 20% 85%) !important;
  border: 1px solid hsl(220 12% 20%) !important;
}

.dark [data-sonner-toast] [data-title] {
  color: hsl(210 20% 90%) !important;
}

.dark [data-sonner-toast] [data-description] {
  color: hsl(215 15% 60%) !important;
}

.dark [data-sonner-toast] [data-close-button] {
  color: hsl(210 15% 50%) !important;
}

.dark [data-sonner-toast] [data-close-button]:hover {
  color: hsl(210 15% 70%) !important;
}

.dark [data-sonner-toast]::after {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
```

### 3. `src/hooks/useSidebarGradient.ts` — Soften dark sidebar gradients

Reduce saturation and slightly increase lightness across all dark-mode gradient stops (the `isDark` block) so gradients blend smoothly with the new softer background.

### 4. Hardcoded `border-black/10` → `border-border`

Update the few components using hardcoded `border-black/10` to use `border-border` so they adapt properly:
- `DocumentEditorHeader.tsx`
- `ContactsTable.tsx`
- `ProfileAvatar.tsx`
- `EnhancedWeatherCard.tsx`

This is a 4-file CSS variable + toast + border token update — no structural changes.

