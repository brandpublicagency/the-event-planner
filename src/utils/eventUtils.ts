import { supabase } from "@/integrations/supabase/client";
import type { Event, EventCreate } from "@/types/event";

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
    
    groups[monthYear].push({
      ...event,
      venues: event.event_venues?.map(ev => ({
        name: ev.venues?.name,
        id: ev.venues?.id
      })) || []
    });
    return groups;
  }, {});
};

export const deleteEvent = async (eventCode: string) => {
  try {
    const { error: menuError } = await supabase
      .from('menu_selections')
      .delete()
      .eq('event_code', eventCode);
    
    if (menuError) {
      console.error('Error deleting menu selections:', menuError);
      throw menuError;
    }
    
    const { error: weddingError } = await supabase
      .from('wedding_details')
      .delete()
      .eq('event_code', eventCode);
    
    if (weddingError) {
      console.error('Error deleting wedding details:', weddingError);
    }
    
    const { error: corporateError } = await supabase
      .from('corporate_details')
      .delete()
      .eq('event_code', eventCode);
    
    if (corporateError) {
      console.error('Error deleting corporate details:', corporateError);
    }
    
    const { error: venuesError } = await supabase
      .from('event_venues')
      .delete()
      .eq('event_code', eventCode);
    
    if (venuesError) {
      console.error('Error deleting event venues:', venuesError);
    }
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_code', eventCode);

    if (error) {
      throw new Error("Failed to delete event");
    }
  } catch (error: any) {
    console.error('Delete event error:', error);
    throw error;
  }
};

export const createEvent = async (data: EventCreate, userId: string) => {
  const eventData = {
    ...data,
    completed: false
  };

  const { data: eventResponse, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error || !eventResponse) {
    throw new Error("Failed to create event");
  }

  return eventResponse.event_code;
};

export const ensureUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!data || error) {
    throw new Error("User profile not found");
  }

  return data;
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
