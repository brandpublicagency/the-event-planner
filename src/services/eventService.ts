import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";

export const updateEvent = async (eventCode: string, updates: Partial<Event>) => {
  // Remove related fields that aren't in the events table
  const { venues, event_venues, wedding_details, corporate_details, menu_selections, ...eventUpdates } = updates;

  const { data, error } = await supabase
    .from('events')
    .update(eventUpdates)
    .eq('event_code', eventCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: EventCreate) => {
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