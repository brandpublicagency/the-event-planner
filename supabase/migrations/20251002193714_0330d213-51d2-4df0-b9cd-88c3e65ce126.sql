-- ============================================
-- CRITICAL SECURITY FIXES
-- ============================================

-- 1. Enable RLS on critical tables
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 2. Fix profiles public access - remove public policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 3. Add search_path to security definer functions
CREATE OR REPLACE FUNCTION public.delete_event_venues(event_code_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'event_venues'
  ) THEN
    DELETE FROM public.event_venues WHERE event_code = event_code_param;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id uuid, 
  p_user_name text, 
  p_action text, 
  p_entity_type text, 
  p_entity_id text, 
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.user_activities (
    user_id,
    user_name,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    p_user_id,
    p_user_name,
    p_action,
    p_entity_type,
    p_entity_id,
    p_details
  ) RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_pdf_content()
RETURNS TABLE(
  id uuid, 
  pdf_id uuid, 
  content text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT pc.id, pc.pdf_id, pc.content, pc.created_at, pc.updated_at
    FROM pdf_processed_content pc
    WHERE EXISTS (
        SELECT 1 FROM event_documents ed
        JOIN events e ON e.event_code = ed.event_code
        WHERE ed.id = pc.pdf_id
        AND e.created_by = auth.uid()
    );
END;
$$;

-- 4. Make storage buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('pdfs', 'taskmanager-files', 'avatars');

-- 5. Add proper storage policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own avatar"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Add proper storage policies for pdfs bucket
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can view PDFs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can update PDFs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can delete PDFs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pdfs');

-- 7. Add proper storage policies for taskmanager-files bucket
CREATE POLICY "Authenticated users can upload task files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'taskmanager-files');

CREATE POLICY "Authenticated users can view task files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'taskmanager-files');

CREATE POLICY "Authenticated users can update task files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'taskmanager-files');

CREATE POLICY "Authenticated users can delete task files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'taskmanager-files');