
CREATE TABLE public.team_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read chat" ON public.team_chat_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can send messages" ON public.team_chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.team_chat_messages;
