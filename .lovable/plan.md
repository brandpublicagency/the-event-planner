

## Sidebar Redesign: Route-Based Gradient + Liquid Glass Effect

### Concept
Inspired by the YOCO sidebar screenshots and macOS liquid glass aesthetic, the sidebar will have:
1. A **soft gradient background** that changes color based on the active route (warm peach/salmon for Hub-like pages, cool blue for dashboard, sage green for events, etc.)
2. A **liquid glass overlay** on top — a frosted, semi-transparent layer with `backdrop-blur`, subtle white overlays, and soft inner borders that create the glassy, translucent feel

### Visual Design

The reference images show these gradient palettes per route context:
- **Dashboard** (`/`): Soft blue-to-sky gradient (image 4 — cool blue tones)
- **Events** (`/events`): Sage green-to-teal gradient (image 3 — green/olive tones)
- **Calendar** (`/calendar`): Warm peach-to-salmon gradient (image 2 — warm orange/peach)
- **Tasks** (`/tasks`): Amber-to-warm-orange gradient (image 1 — peachy/salmon)
- **Documents** (`/documents`): Cool cyan-to-blue
- **Contacts** (`/contacts`): Warm orange-to-amber
- **Past Events**: Violet-to-purple
- **Schedule pages**: Purple-to-indigo
- **Default**: Neutral warm beige

### Implementation

**1. Update `useSidebarGradient.ts`**
- Return just the base gradient colors (no backdrop-blur or border — those go on the glass layer)
- Gradients will be warm, soft, and muted — matching the YOCO palette

**2. Update `Sidebar.tsx`**
- Apply the route-based gradient as the sidebar's base background
- Add a **glass overlay div** absolutely positioned over the entire sidebar:
  - `backdrop-blur-xl` (strong blur for the frosted effect)
  - Semi-transparent white overlay (`bg-white/30`)
  - Subtle inner border using `ring-1 ring-white/40 ring-inset` or a `border border-white/20`
  - Optional subtle `shadow-inner` for depth
- All sidebar content sits above the glass layer via `relative z-10`

**3. Update sidebar CSS tokens**
- The `--sidebar-bg`, `--sidebar-border` tokens will be overridden inline or via the gradient classes
- Nav items, profile, and actions keep their existing token-based styling but with slight transparency adjustments so the glass effect shows through (e.g., active state uses `bg-white/20` instead of opaque)

**4. Update `SidebarNavItem.tsx`**
- Active state: `bg-white/25 text-foreground shadow-sm` (glass-on-glass feel)
- Hover state: `bg-white/15`
- This lets the gradient peek through interactive states

**5. Update `SidebarProfile.tsx` and `SidebarActions.tsx`**
- Border dividers use `border-white/20` instead of opaque sidebar-border tokens
- Text colors remain dark for readability against the light gradients

### Files to modify
- `src/hooks/useSidebarGradient.ts` — refined gradient palettes
- `src/components/Sidebar.tsx` — gradient background + glass overlay layer
- `src/components/sidebar/SidebarNavItem.tsx` — translucent active/hover states
- `src/components/sidebar/SidebarProfile.tsx` — translucent border styling
- `src/components/sidebar/SidebarActions.tsx` — translucent border styling

