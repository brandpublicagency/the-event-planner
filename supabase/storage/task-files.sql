-- Update bucket policies
CREATE POLICY "Users can upload files to their tasks"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'task-files' AND
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE id = (SELECT task_id FROM public.task_files WHERE file_path = storage.objects.name)
    AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can view files on their tasks"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'task-files' AND
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE id = (SELECT task_id FROM public.task_files WHERE file_path = storage.objects.name)
    AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can delete files on their tasks"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'task-files' AND
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE id = (SELECT task_id FROM public.task_files WHERE file_path = storage.objects.name)
    AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);