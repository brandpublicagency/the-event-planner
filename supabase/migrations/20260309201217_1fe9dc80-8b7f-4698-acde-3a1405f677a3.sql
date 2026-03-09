
CREATE POLICY "Users can delete own messages" ON public.team_chat_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
