CREATE POLICY "Public can view taskmanager files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'taskmanager-files');