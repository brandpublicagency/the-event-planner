

## Problem

1. **Events page spacing**: The `EventCard` has `mb-1.5` built in, but the parent container also uses `divide-y` which conflicts with `space-y-1.5` — the `divide-y` borders visually collapse the spacing. After re-render, the combined effect looks inconsistent.
2. **Dashboard event cards**: `DashboardEventItem` and its sub-components use hardcoded colors (`bg-white`, `bg-gray-50`, `border-gray-100`, `text-gray-700`) instead of design tokens, and the `EventCardWrapper` has `mb-1.5` baked in alongside the parent's `space-y-1.5`, doubling up inconsistently.

## Changes

### 1. `EventMonthGroup.tsx` — Fix spacing conflict
- Remove `divide-y divide-border` from the container (conflicts with `space-y`).
- Increase `space-y-1.5` to `space-y-2.5` for more visible card separation.

### 2. `EventCard.tsx` — Normalize card spacing
- Remove `mb-1.5` from the card itself (parent handles spacing via `space-y`).
- Migrate `bg-white` → `bg-card`, `border-gray-100` → `border-border`.

### 3. `EventCardWrapper.tsx` (Dashboard) — Fix spacing and tokens
- Remove `mb-1.5` from both the today and non-today wrappers (parent handles spacing).
- Migrate `bg-white` → `bg-card`, `border-zinc-100` / `border-black/10` → `border-border`.

### 4. `DashboardEventItem.tsx` — Migrate hardcoded `bg-white`
- Change `bg-white` → `bg-card`.

### 5. `EventDateColumn.tsx` — Migrate hardcoded colors
- `bg-gray-50` → `bg-muted`, `border-gray-100` → `border-border`, `text-gray-700` → `text-foreground`, `text-gray-600` → `text-muted-foreground`.

### 6. `EventsTable.tsx` — Align dashboard spacing
- Change dashboard container `space-y-1.5` to `space-y-2.5` to match the events page.
- Migrate empty state hardcoded colors to tokens.

