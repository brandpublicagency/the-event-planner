import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";
import { createEvent as createEventService } from "@/services/eventService";

export const groupEventsByMonth = (events: Record<string, Event[]>) => {
  return events.reduce((groups: Record<string, Event[]>, event) => {
    const date = new Date(event.event_date || new Date());
    const monthYear = date.toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(event);
    return groups;
  }, {});
};

export const deleteEvent = async (eventCode: string) => {
  try {
    // Check if there are related menu selections
    const { count, error: countError } = await supabase
      .from('menu_selections')
      .select('event_code', { count: 'exact', head: true })
      .eq('event_code', eventCode);
    
    if (!countError && count && count > 0) {
      const { error: menuError } = await supabase
        .from('menu_selections')
        .delete()
        .eq('event_code', eventCode);
      
      if (menuError) {
        console.error('Error deleting menu selections:', menuError);
        throw menuError;
      }
    }
    
    // Permanently delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_code', eventCode);

    if (error) {
      console.error('Error deleting event:', error);
      throw new Error("Failed to delete event");
    }
    
    return true;
  } catch (error: any) {
    console.error('Delete event error:', error);
    throw error;
  }
};

export const createEvent = async (data: EventCreate, userId: string) => {
  try {
    console.log('Creating event with data:', data);
    
    // Remove client_address field if it exists
    const { client_address, ...cleanedData } = data;
    
    const eventData = {
      ...cleanedData,
      completed: false
    };

    const createdEvent = await createEventService(eventData);
    
    if (!createdEvent) {
      throw new Error("Failed to create event");
    }

    // Log successful creation to help with debugging
    console.log('Event created successfully with event_code:', createdEvent.event_code);

    return createdEvent.event_code;
  } catch (error: any) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const ensureUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking profile:', error);
      throw error;
    }

    if (!data) {
      console.log('Creating new profile for user:', userId);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({ id: userId });
        
      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
};

export const checkEventStatus = async (eventCode: string): Promise<boolean | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('completed')
    .eq('event_code', eventCode)
    .single();

  if (error) {
    console.error('Error checking event status:', error);
    return null;
  }

  return data?.completed || false;
};

export const markEventAsCompleted = async (eventCode: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .update({ completed: true })
    .eq('event_code', eventCode)
    .select();

  if (error) {
    console.error('Error marking event as completed:', error);
    throw new Error(`Failed to mark event as completed: ${error.message}`);
  }
};
