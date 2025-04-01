
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EventFormData } from '@/types/eventForm';
import { useQueryClient } from '@tanstack/react-query';

export const generateEventCode = (type: string) => {
  const prefix = type ? type.substring(0, 3).toUpperCase() : 'EVT';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${uuidv4().substring(0, 8)}-${randomDigits}`;
};

export const createNewEvent = async (data: EventFormData) => {
  try {
    console.log("Creating new event with data:", data);
    const eventCode = generateEventCode(data.event_type || 'Event');
    
    // Normalize empty strings to null for database storage
    const normalizeField = (value: any) => {
      if (value === '') return null;
      return value;
    };
    
    // Create the event with normalized fields
    const eventData = {
      event_code: eventCode,
      name: data.name,
      event_type: data.event_type,
      event_date: normalizeField(data.event_date),
      start_time: normalizeField(data.start_time),
      end_time: normalizeField(data.end_time),
      description: normalizeField(data.description),
      primary_name: normalizeField(data.primary_name),
      primary_email: normalizeField(data.primary_email),
      primary_phone: normalizeField(data.primary_phone),
      secondary_name: normalizeField(data.secondary_name),
      secondary_email: normalizeField(data.secondary_email),
      secondary_phone: normalizeField(data.secondary_phone),
      pax: data.pax || null,
      venues: Array.isArray(data.venues) ? data.venues : [],
      company: normalizeField(data.company),
      vat_number: normalizeField(data.vat_number),
      address: normalizeField(data.address),
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
