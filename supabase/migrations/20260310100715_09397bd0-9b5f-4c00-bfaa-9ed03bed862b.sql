
-- Add DELETE policy for notifications so authenticated users can clear read notifications
CREATE POLICY "Authenticated users can delete notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (true);
