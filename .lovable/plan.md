

## Plan: Add Sidebar CSS Variables, Tailwind Config, and Fix Build Error

Three changes across three files:

### 1. Fix build error in `SidebarNavItem.tsx` (line 9)
Remove the stray `x;` property from the interface definition. Change:
```ts
icon: React.ElementType;
x;
path: string;
```
to:
```ts
icon: React.ElementType;
path: string;
```

### 2. Update `src/index.css`

**`:root` block** (line 11): Change `--background: 0 0% 100%` to `--background: 0 0% 98.5%` and add six new sidebar variables after `--radius`:
```css
--sidebar-bg: 120 8% 94%;
--sidebar-fg: 220 15% 28%;
--sidebar-border: 120 6% 88%;
--sidebar-active: 220 20% 16%;
--sidebar-active-fg: 0 0% 98%;
--sidebar-hover: 120 6% 89%;
```

**`.dark` block** (after `--ring` on line 53): Add six dark sidebar variables:
```css
--sidebar-bg: 222 30% 12%;
--sidebar-fg: 210 30% 80%;
--sidebar-border: 217 25% 20%;
--sidebar-active: 210 40% 92%;
--sidebar-active-fg: 222 47% 11%;
--sidebar-hover: 217 25% 18%;
```

### 3. Update `tailwind.config.ts`

Add `sidebar` color group after `card` (line 63):
```ts
sidebar: {
  DEFAULT: 'hsl(var(--sidebar-bg))',
  foreground: 'hsl(var(--sidebar-fg))',
  border: 'hsl(var(--sidebar-border))',
  active: 'hsl(var(--sidebar-active))',
  'active-fg': 'hsl(var(--sidebar-active-fg))',
  hover: 'hsl(var(--sidebar-hover))',
},
```

No other changes to any file.

