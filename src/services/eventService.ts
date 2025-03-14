
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
  // First check if there are any related menu selections
  const { data: menuSelections, error: menuCheckError } = await supabase
    .from('menu_selections')
    .select('id')
    .eq('event_code', eventCode);
  
  if (menuCheckError) {
    console.error('Error checking menu selections:', menuCheckError);
    throw menuCheckError;
  }
  
  // If there are menu selections, delete them first
  if (menuSelections && menuSelections.length > 0) {
    const { error: deleteMenuError } = await supabase
      .from('menu_selections')
      .delete()
      .eq('event_code', eventCode);
    
    if (deleteMenuError) {
      console.error('Error deleting menu selections:', deleteMenuError);
      throw deleteMenuError;
    }
  }
  
  // Permanently delete the event
  const { error: deleteEventError } = await supabase
    .from('events')
    .delete()
    .eq('event_code', eventCode);
  
  if (deleteEventError) {
    console.error('Error deleting event:', deleteEventError);
    throw deleteEventError;
  }
  
  return true;
};
