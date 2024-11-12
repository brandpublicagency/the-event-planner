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
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('event_code', eventCode);

  if (error) {
    throw new Error("Failed to delete event");
  }
};

export const createEvent = async (data: EventCreate, userId: string) => {
  const { data: eventData, error } = await supabase
    .from('events')
    .insert({
      event_code: data.event_code,
      name: data.name,
      description: data.description,
      event_type: data.event_type,
      event_date: data.event_date,
      pax: data.pax,
      package_id: data.package_id,
      client_address: data.client_address,
      created_by: userId
    })
    .select()
    .single();

  if (error || !eventData) {
    throw new Error("Failed to create event");
  }

  return eventData.event_code;
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