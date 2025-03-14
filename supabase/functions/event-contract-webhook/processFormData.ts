
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
    
    // Format the date correctly if it exists
    let formattedDate = null;
    if (normalizedData.event_date) {
      // Parse the date string and convert to ISO format
      try {
        // Check if date is in format DD.MM.YYYY
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalizedData.event_date)) {
          const [day, month, year] = normalizedData.event_date.split('.');
          formattedDate = `${year}-${month}-${day}`;
        } 
        // Check if date is in format MM/DD/YYYY
        else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(normalizedData.event_date)) {
          const [month, day, year] = normalizedData.event_date.split('/');
          formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        // Already in YYYY-MM-DD format
        else if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedData.event_date)) {
          formattedDate = normalizedData.event_date;
        }
        else {
          // Try to parse with Date and format
          const date = new Date(normalizedData.event_date);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          } else {
            console.error('Invalid date format:', normalizedData.event_date);
            formattedDate = null;
          }
        }
      } catch (error) {
        console.error('Error parsing date:', error);
        formattedDate = null;
      }
      
      console.log('Original date:', normalizedData.event_date);
      console.log('Formatted date:', formattedDate);
    }
    
    // Validate and normalize venues
    let venues = normalizedData.venues || [];
    if (venues.length > 0) {
      // Check if all venues are valid
      const validVenues = [
        'The Kitchen', 'The Gallery', 'The Grand Hall', 
        'The Lawn', 'The Avenue',
        'Package 1', 'Package 2', 'Package 3'
      ];
      
      // Normalize venue names (first character uppercase, rest lowercase)
      venues = venues.map(venue => {
        if (typeof venue === 'string') {
          // Remove any leading/trailing whitespace
          venue = venue.trim();
          
          // Normalize venue names based on specific patterns
          if (venue.toLowerCase().includes('kitchen')) return 'The Kitchen';
          if (venue.toLowerCase().includes('gallery')) return 'The Gallery';
          if (venue.toLowerCase().includes('grand hall')) return 'The Grand Hall';
          if (venue.toLowerCase().includes('lawn')) return 'The Lawn';
          if (venue.toLowerCase().includes('avenue')) return 'The Avenue';
          if (venue.toLowerCase().match(/\bpackage\s*1\b/i)) return 'Package 1';
          if (venue.toLowerCase().match(/\bpackage\s*2\b/i)) return 'Package 2';
          if (venue.toLowerCase().match(/\bpackage\s*3\b/i)) return 'Package 3';
          
          return venue;
        }
        return venue;
      });
      
      // Filter to only include valid venues
      venues = venues.filter(venue => validVenues.includes(venue));
      console.log('Validated and normalized venues:', venues);
    }
    
    // Ensure address is set for non-wedding events
    let address = normalizedData.address || null;
    if (normalizedData.event_type !== 'Wedding' && !address) {
      // Try to get address from any available field
      address = normalizedData.client_address || 
               normalizedData.company_address || 
               (normalizedData.user_inputs && normalizedData.user_inputs.address_1) || 
               null;
      
      console.log('Setting address for non-wedding event:', address);
    }
    
    // Extract core event data
    const eventData = {
      name: normalizedData.name,
      event_type: normalizedData.event_type,
      event_code: eventCode,
      event_date: formattedDate,
      start_time: normalizedData.start_time || null,
      end_time: normalizedData.end_time || null,
      pax: normalizedData.pax ? parseInt(normalizedData.pax) : null,
      description: normalizedData.description || null,
      venues: venues.length > 0 ? venues : null,
      event_notes: normalizedData.event_notes || null,
      
      // Contact details
      primary_name: normalizedData.primary_name || null,
      primary_phone: normalizedData.primary_phone || null,
      primary_email: normalizedData.primary_email || null,
      secondary_name: normalizedData.secondary_name || null,
      secondary_phone: normalizedData.secondary_phone || null,
      secondary_email: normalizedData.secondary_email || null,
      
      // Company details - ensure these are set for non-wedding events
      company: normalizedData.company || null,
      address: address,
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
