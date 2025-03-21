
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const createEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEvent = async (eventCode) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        menu_selections (*)
      `)
      .eq('event_code', eventCode)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getUpcomingEvents = async (limit = 5) => {
  try {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', formattedDate)
      .is('deleted_at', null)
      .order('event_date', { ascending: true })
      .limit(limit);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export const updateEvent = async (eventCode, updateData) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('event_code', eventCode)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventCode) => {
  try {
    // Soft delete by setting deleted_at
    const { data, error } = await supabase
      .from('events')
      .update({ deleted_at: new Date().toISOString() })
      .eq('event_code', eventCode);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const createEventNotification = async (eventCode, notificationType) => {
  // This is now a mock function that doesn't actually access the database
  console.log(`Mock: Creating ${notificationType} notification for event ${eventCode}`);
  
  // Return mock data
  return {
    id: `mock-notification-${Date.now()}`,
    event_code: eventCode,
    notification_type: notificationType,
    created_at: new Date().toISOString()
  };
};
