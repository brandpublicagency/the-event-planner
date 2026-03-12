

## Make the Glass Overlay Lighter and Brighter

The current glass overlay on line 54 uses `bg-white/30 backdrop-blur-xl` which creates a fairly heavy frosted effect that mutes the gradient colours underneath.

### Change
In `src/components/Sidebar.tsx` line 54, update the glass overlay to be more translucent and use a softer blur:

- `bg-white/30` → `bg-white/15` (less opaque — lets more gradient colour through)
- `backdrop-blur-xl` → `backdrop-blur-md` (softer blur — less frosting, brighter feel)
- `ring-white/40` → `ring-white/30` (subtler border ring)
- Keep `shadow-inner` and `pointer-events-none`

This will make the sidebar feel airier and let the route-based gradient colours come through more vibrantly while still maintaining the liquid glass aesthetic.

