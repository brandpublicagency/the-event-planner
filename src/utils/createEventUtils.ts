
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EventFormData } from '@/types/eventForm';

export const generateEventCode = (type: string) => {
  const prefix = type ? type.substring(0, 3).toUpperCase() : 'EVT';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${uuidv4().substring(0, 8)}-${randomDigits}`;
};

export const createNewEvent = async (data: EventFormData) => {
  try {
    console.log("Creating new event with data:", data);
    const eventCode = generateEventCode(data.event_type || 'Event');
    
    // Create the event with required fields
    const eventData = {
      event_code: eventCode,
      name: data.name,
      event_type: data.event_type,
      event_date: data.event_date || null,
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      description: data.description || null,
      primary_name: data.primary_name || null,
      primary_email: data.primary_email || null,
      primary_phone: data.primary_phone || null,
      secondary_name: data.secondary_name || null,
      secondary_email: data.secondary_email || null,
      secondary_phone: data.secondary_phone || null,
      pax: data.pax || null,
      venues: Array.isArray(data.venues) ? data.venues : [],
      company: data.company || null,
      vat_number: data.vat_number || null,
      address: data.address || null,
      // Log the actual data structure being sent to the database
      created_by: null, // Add proper user ID when authentication is implemented
    };

    console.log("Sending to database:", JSON.stringify(eventData, null, 2));
    
    const { data: result, error: eventError } = await supabase
      .from('events')
      .insert(eventData)
      .select('event_code')
      .single();

    if (eventError) {
      console.error("Database error:", eventError);
      throw new Error(`Error creating event: ${eventError.message}`);
    }
    
    console.log("Event created successfully:", result);
    return eventCode;
  } catch (error) {
    console.error("Error in createNewEvent:", error);
    throw error;
  }
};
