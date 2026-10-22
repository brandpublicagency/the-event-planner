CREATE TABLE public.event_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_code text NOT NULL REFERENCES public.events(event_code) ON DELETE CASCADE ON UPDATE CASCADE,
  actor text NOT NULL DEFAULT 'System',
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_activity_log TO authenticated;
GRANT ALL ON public.event_activity_log TO service_role;
ALTER TABLE public.event_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to activity log" ON public.event_activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX event_activity_log_event_code_idx ON public.event_activity_log (event_code, created_at DESC);
CREATE INDEX event_activity_log_search_idx ON public.event_activity_log USING gin (to_tsvector('simple', actor || ' ' || action));

INSERT INTO public.event_activity_log (event_code, actor, action, created_at)
SELECT e.event_code,
       coalesce(nullif(x->>'actor',''),'System'),
       coalesce(x->>'action',''),
       coalesce((x->>'timestamp')::timestamptz, e.created_at)
FROM public.events e
CROSS JOIN LATERAL jsonb_array_elements(coalesce(e.activity_log,'[]'::jsonb)) x
WHERE jsonb_typeof(e.activity_log) = 'array';