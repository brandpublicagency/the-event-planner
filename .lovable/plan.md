

## Plan: Fix chat message sending and increase input height

### Problem
1. **Messages fail to send** — The POST to `team_chat_messages` returns a 401/RLS error. The RLS policies are correct (`auth.uid() = user_id` for INSERT). The issue is the mutation doesn't provide error feedback to the user — it silently fails. Additionally, the `sendMessage` mutation should omit `user_id` from the insert and let Supabase default it from `auth.uid()` via a database default, OR ensure the session is valid before sending. Since the RLS policy and session seem fine (GET requests work, `getUser()` returns data), the real fix is to **not manually set `user_id`** — instead use a default column value. But since we can't change the DB schema here, we should add a toast error so users know when it fails, and also verify the session token is being sent properly by using `supabase.auth.getSession()` to get the fresh JWT.

2. **Input field too short** — The input is `h-7` (28px). Increase to `h-9` (36px) and match the send button.

### Changes

1. **`src/components/dashboard/DashboardTeamChat.tsx`**:
   - Add `toast` import from sonner
   - In `sendMessage` mutation, add `onError` handler that shows a toast with the error message
   - Verify auth session before inserting: use `supabase.auth.getSession()` to ensure the token is fresh, and throw if no session
   - Increase input height from `h-7` to `h-9`, and send button from `h-7 w-7` to `h-9 w-9`
   - Add `p-3` instead of `p-2` on the input container for slightly more breathing room

### Scope
Single file change. The RLS policies in Supabase are correct — the issue is likely a stale/missing auth token. Adding `getSession()` before the insert ensures the client refreshes the token. The toast gives user feedback on failure.

