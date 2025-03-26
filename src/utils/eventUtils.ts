import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";
import { createEvent as createEventService, deleteEvent as deleteEventService, permanentlyDeleteEvent as permanentlyDeleteEventService } from "@/services/eventService";

export const groupEventsByMonth = (events: Event[]) => {
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
    console.log('Soft deleting event with code:', eventCode);
    return await deleteEventService(eventCode);
  } catch (error: any) {
    console.error('Delete event error:', error);
    throw error;
  }
};

export const permanentlyDeleteEvent = async (eventCode: string) => {
  try {
    console.log('Permanently deleting event with code:', eventCode);
    return await permanentlyDeleteEventService(eventCode);
  } catch (error: any) {
    console.error('Permanent delete event error:', error);
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
