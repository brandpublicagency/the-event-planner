import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/types/event";

export const updateEvent = async (eventCode: string, updates: Partial<Event>) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('event_code', eventCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: Partial<Event>) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (eventCode: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('event_code', eventCode);

  if (error) throw error;
};