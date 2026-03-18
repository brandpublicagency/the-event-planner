
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EventFormData } from '@/types/eventForm';

export const generateEventCode = (type: string) => {
  const prefix = type ? type.substring(0, 3).toUpperCase() : 'EVT';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${uuidv4().substring(0, 8)}-${randomDigits}`;
};

const normalizeField = (value: unknown) => {
  if (value === '') return null;
  return value;
};

export const createNewEvent = async (data: EventFormData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const eventCode = generateEventCode(data.event_type || 'Event');
  
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
    created_by: user?.id || null,
  };

  const { error: eventError } = await supabase
    .from('events')
    .insert([eventData])
    .select('event_code')
    .single();

  if (eventError) {
    throw new Error(`Error creating event: ${eventError.message}`);
  }
  
  return eventCode;
};
