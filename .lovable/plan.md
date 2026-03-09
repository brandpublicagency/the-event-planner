

## Team Chat Widget for Dashboard 2

### Overview
Add a real-time team chat widget to Dashboard 2's right sidebar where the 4 employees can communicate. Messages persist in Supabase and update in real-time using Supabase Realtime subscriptions.

### Database Changes
Create a new `team_chat_messages` table:

```sql
CREATE TABLE public.team_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_chat_messages ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read messages
CREATE POLICY "Authenticated users can read chat" ON public.team_chat_messages
  FOR SELECT TO authenticated USING (true);

-- Users can insert their own messages
CREATE POLICY "Users can send messages" ON public.team_chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
```

Enable Realtime on the table so messages appear instantly for all users.

### New Component: `Dashboard2TeamChat.tsx`
- Compact card widget matching the existing sidebar style (border, bg-card, rounded-lg)
- Shows the latest ~20 messages, with a `ScrollArea` that auto-scrolls to bottom
- Each message shows: avatar/initials (from `profiles` table), name, timestamp, message text
- Input bar at the bottom with send button
- Uses Supabase Realtime channel subscription to listen for `INSERT` events on `team_chat_messages`
- Joins with `profiles` to display sender name and avatar
- Hover border effect consistent with other widgets (`hover:border-foreground/30`)

### Layout Integration
Add `<Dashboard2TeamChat />` to the right sidebar column in `Dashboard2Layout.tsx`, placed between Tasks and the Latest Updates button.

### Technical Details
- **Realtime**: Subscribe to `team_chat_messages` inserts via `supabase.channel().on('postgres_changes', ...)` 
- **Query**: Fetch recent messages with profile join using `useQuery`, invalidate on realtime event
- **Send**: `useMutation` to insert message with current `auth.uid()`
- **Auto-scroll**: `useEffect` + `ref.scrollIntoView()` when messages change
- **Compact UI**: Max height ~300px with scroll, messages use small text (text-xs/text-sm)

