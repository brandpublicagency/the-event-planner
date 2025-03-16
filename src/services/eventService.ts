
import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";

// These values MUST match exactly what's expected in the database trigger
const ALLOWED_VENUES = [
  "The Kitchen",
  "The Gallery",
  "The Grand Hall",
  "The Lawn",
  "The Avenue",
  "Package 1",
  "Package 2",
  "Package 3"
];

export const updateEvent = async (eventCode: string, updates: Partial<Event>) => {
  // Validate venues if they are being updated
  if (updates.venues) {
    if (Array.isArray(updates.venues)) {
      const validVenues = updates.venues.filter(venue => ALLOWED_VENUES.includes(venue));
      
      if (validVenues.length === 0 && updates.venues.length > 0) {
        throw new Error("Invalid venue values. Allowed values are: " + ALLOWED_VENUES.join(", "));
      }
      
      updates.venues = validVenues;
    } else if (typeof updates.venues === 'string') {
      if (!ALLOWED_VENUES.includes(updates.venues)) {
        throw new Error("Invalid venue value. Allowed values are: " + ALLOWED_VENUES.join(", "));
      }
      updates.venues = [updates.venues];
    }
  }

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
  console.log('Deleting event with code:', eventCode);
  
  try {
    // First delete related event notifications to avoid foreign key constraint errors
    const { error: notificationsError } = await supabase
      .from('event_notifications')
      .delete()
      .eq('event_code', eventCode);
    
    if (notificationsError) {
      console.error('Error deleting event notifications:', notificationsError);
      throw notificationsError;
    }

    // Check if there are any related menu selections
    const { data: menuSelections, error: menuCheckError } = await supabase
      .from('menu_selections')
      .select('event_code')
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
    
    console.log('Event deleted successfully:', eventCode);
    return true;
  } catch (error) {
    console.error('Error in deleteEvent function:', error);
    throw error;
  }
};
