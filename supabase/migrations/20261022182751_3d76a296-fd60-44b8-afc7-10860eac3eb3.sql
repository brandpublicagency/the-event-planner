DROP POLICY IF EXISTS "taskmanager-files-policies mj1ss2_1" ON storage.objects;
DROP POLICY IF EXISTS "taskmanager-files-policies mj1ss2_2" ON storage.objects;
DROP POLICY IF EXISTS "taskmanager-files-policies mj1ss2_3" ON storage.objects;
DROP POLICY IF EXISTS "Give users public access to all files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

CREATE OR REPLACE FUNCTION public.check_email_domain()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT'
     AND NEW.email NOT LIKE '%@warmkaroo.com'
     AND NEW.confirmed_at IS NULL
     AND NEW.raw_app_meta_data->>'provider' = 'email'
     AND NOT EXISTS (
       SELECT 1 FROM auth.users
       WHERE email = NEW.email
     )
  THEN
    RAISE EXCEPTION 'Only @warmkaroo.com email addresses are allowed to register';
  END IF;
  RETURN NEW;
END;
$function$;