
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { normalizeFormData } from './formNormalizer.ts';
import { generateEventCode } from './utils.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Process form data and create an event in the database
 */
export const processFormData = async (formData: any) => {
  console.log('Processing contract form data:', formData);
  
  try {
    // Normalize the form data
    const normalizedData = normalizeFormData(formData);
    
    // Validate required fields
    if (!normalizedData.name || !normalizedData.event_type) {
      throw new Error('Missing required fields: name and event_type are required');
    }
    
    // Generate a unique event code
    const eventCode = await generateEventCode(normalizedData.event_type);
    
    // Extract core event data
    const eventData = {
      name: normalizedData.name,
      event_type: normalizedData.event_type,
      event_code: eventCode,
      event_date: normalizedData.event_date || null,
      start_time: normalizedData.start_time || null,
      end_time: normalizedData.end_time || null,
      pax: normalizedData.pax ? parseInt(normalizedData.pax) : null,
      description: normalizedData.description || null,
      venues: normalizedData.venues || null,
      event_notes: normalizedData.event_notes || null,
      
      // Contact details
      primary_name: normalizedData.primary_name || null,
      primary_phone: normalizedData.primary_phone || null,
      primary_email: normalizedData.primary_email || null,
      secondary_name: normalizedData.secondary_name || null,
      secondary_phone: normalizedData.secondary_phone || null,
      secondary_email: normalizedData.secondary_email || null,
      
      // Company details
      company: normalizedData.company || null,
      address: normalizedData.address || null,
      vat_number: normalizedData.vat_number || null,
    };
    
    console.log('Inserting event data:', eventData);
    
    // Insert event into database
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting event:', error);
      throw error;
    }
    
    // Create initial task for new event
    await createInitialTask(event);
    
    return {
      success: true,
      event_code: eventCode,
      message: `Event created successfully with code ${eventCode}`
    };
  } catch (error) {
    console.error('Error processing form data:', error);
    throw error;
  }
};

/**
 * Create an initial task for a newly created event
 */
const createInitialTask = async (event: any) => {
  try {
    await supabase
      .from('tasks')
      .insert({
        title: `Initial contact for ${event.name}`,
        user_id: '00000000-0000-0000-0000-000000000000', // System user or will be assigned later
        status: 'todo',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 1 week
        notes: [`New ${event.event_type} event created from contract form`],
      });
      
    return true;
  } catch (error) {
    console.error('Error creating initial task:', error);
    // Don't throw here, as we still want to return the event even if task creation fails
    return false;
  }
};
