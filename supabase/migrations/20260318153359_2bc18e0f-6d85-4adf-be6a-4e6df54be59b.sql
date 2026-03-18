CREATE OR REPLACE FUNCTION public.handle_new_event()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  actor_name TEXT;
BEGIN
  -- Get the actor name from profiles
  SELECT COALESCE(full_name || COALESCE(' ' || surname, ''), 'System')
  INTO actor_name
  FROM public.profiles
  WHERE id = NEW.created_by;

  IF actor_name IS NULL THEN
    actor_name := 'System';
  END IF;

  INSERT INTO public.notifications (
    event_code,
    title,
    description,
    notification_type
  ) VALUES (
    NEW.event_code,
    'New Event Created',
    actor_name || ' created "' || NEW.name || '"',
    'event_created'
  );
  RETURN NEW;
END;
$function$;