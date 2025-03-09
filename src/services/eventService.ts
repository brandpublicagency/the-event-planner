
import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";

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

export const createEvent = async (eventData: EventCreate) => {
  console.log('Creating event with data:', eventData);
  
  // Remove client_address field if it exists in the data as it's not in the schema
  const { client_address, ...validEventData } = eventData;
  
  const { data, error } = await supabase
    .from('events')
    .insert(validEventData)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }
  
  console.log('Event created successfully:', data);
  return data;
};

export const deleteEvent = async (eventCode: string) => {
  // First soft delete by setting deleted_at
  const { error: softDeleteError } = await supabase
    .from('events')
    .update({ deleted_at: new Date().toISOString() })
    .eq('event_code', eventCode);
  
  if (softDeleteError) {
    console.error('Error soft deleting event:', softDeleteError);
    throw softDeleteError;
  }
  
  return true;
};
