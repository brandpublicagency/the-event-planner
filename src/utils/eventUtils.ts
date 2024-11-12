import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const groupEventsByMonth = (events: any[]) => {
  return events.reduce((groups: any, event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push({
      ...event,
      venues: event.event_venues?.map((ev: any) => ({
        name: ev.venues?.name
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

export const createEvent = async (data: any, userId: string) => {
  const { data: eventData, error } = await supabase
    .from('events')
    .insert({ ...data, created_by: userId })
    .single();

  if (error) {
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
