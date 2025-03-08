
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
  // First, handle related records in a transaction
  const { error: transactionError } = await supabase.rpc('delete_event_cascade', {
    p_event_code: eventCode
  });

  // If the RPC function fails, try deleting related records manually
  if (transactionError) {
    console.error('RPC deletion failed, attempting manual cascade delete:', transactionError);
    
    // Delete menu_selections first (child table)
    const { error: menuError } = await supabase
      .from('menu_selections')
      .delete()
      .eq('event_code', eventCode);
    
    if (menuError) throw menuError;
    
    // Delete wedding_details if exists
    const { error: weddingError } = await supabase
      .from('wedding_details')
      .delete()
      .eq('event_code', eventCode);
    
    if (weddingError) throw weddingError;
    
    // Delete corporate_details if exists
    const { error: corporateError } = await supabase
      .from('corporate_details')
      .delete()
      .eq('event_code', eventCode);
    
    if (corporateError) throw corporateError;
    
    // Delete event_venues associations
    const { error: venuesError } = await supabase
      .from('event_venues')
      .delete()
      .eq('event_code', eventCode);
    
    if (venuesError) throw venuesError;
    
    // Finally delete the event itself
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_code', eventCode);
    
    if (error) throw error;
  }
};
