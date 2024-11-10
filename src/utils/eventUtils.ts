import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const ensureUserProfile = async (userId: string) => {
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle(); // Using maybeSingle() instead of single()

  if (!profile) {
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        updated_at: new Date().toISOString(),
      });

    if (createError) throw createError;
  }
};

export const createEvent = async (data: any, userId: string) => {
  const eventCode = `EVENT-${format(new Date(data.event_date), 'ddMMyy')}`;
  
  const { error: eventError } = await supabase
    .from('events')
    .insert({
      event_code: eventCode,
      name: data.name,
      event_type: data.event_type,
      event_date: data.event_date,
      pax: data.pax,
      package_id: data.package_id, // This should be a UUID from the packages table
      created_by: userId,
    });

  if (eventError) throw eventError;
  return eventCode;
};