
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
  console.log('============ PROCESS FORM DATA START ============');
  console.log('Raw form data received:', JSON.stringify(formData, null, 2));
  
  try {
    // Normalize the form data
    const normalizedData = normalizeFormData(formData);
    
    console.log('Normalized data returned from normalizer:', {
      name: normalizedData.name,
      event_type: normalizedData.event_type,
      company: normalizedData.company,
      primary_email: normalizedData.primary_email
    });
    
    // PHASE 2: VALIDATE AND FIX NAME FIELD
    // Validate event_type first (required for fallback name generation)
    if (!normalizedData.event_type || normalizedData.event_type.trim() === '') {
      console.error('CRITICAL: event_type is missing!');
      throw new Error('Missing required field: event_type is required');
    }
    
    // Generate event code early so we can use it in name fallback
    const eventCode = await generateEventCode(normalizedData.event_type);
    console.log('Generated event code:', eventCode);
    
    // Validate and fix name field with ultimate fallback
    if (!normalizedData.name || normalizedData.name.trim() === '') {
      console.warn('WARNING: Name is empty after normalization! Applying fallback...');
      
      // Last resort fallback: Use event type + event code
      normalizedData.name = `${normalizedData.event_type} Event - ${eventCode}`;
      console.log('Applied ultimate fallback name:', normalizedData.name);
    }
    
    // Final validation
    if (!normalizedData.name || normalizedData.name.trim() === '') {
      console.error('CRITICAL ERROR: Unable to generate event name!');
      throw new Error('Unable to generate event name from form data');
    }
    
    console.log('Final validated name:', normalizedData.name);
    
    // Check for duplicate submissions
    // Look for an event with the same name, email, and timestamp within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: existingEvents, error: searchError } = await supabase
      .from('events')
      .select('event_code, name, primary_email, created_at')
      .eq('name', normalizedData.name)
      .eq('primary_email', normalizedData.primary_email)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false });
    
    if (searchError) {
      console.error('Error checking for duplicates:', searchError);
      // Continue with event creation even if duplicate check fails
    } else if (existingEvents && existingEvents.length > 0) {
      console.log('Duplicate submission detected:', {
        existing_event: existingEvents[0],
        submitted_name: normalizedData.name,
        submitted_email: normalizedData.primary_email
      });
      
      // Return the existing event code instead of creating a new one
      return {
        success: true,
        event_code: existingEvents[0].event_code,
        message: `Event already exists with code ${existingEvents[0].event_code}`,
        isDuplicate: true
      };
    }
    
    // Event code already generated above for name fallback
    
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
      
      console.log('Pre-normalized venues:', venues);
      
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
      console.log('Post-normalized venues:', venues);
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
    
    console.log('============ FINAL EVENT DATA TO INSERT ============');
    console.log('Event data:', JSON.stringify(eventData, null, 2));
    console.log('Venues:', eventData.venues);
    console.log('====================================================');
    
    // PHASE 4: INSERT WITH VALIDATION
    // Final check before insert
    if (!eventData.name || eventData.name.trim() === '') {
      console.error('CRITICAL: Event data name is empty before insert!');
      throw new Error('Event name cannot be empty');
    }
    
    // Insert event into database
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      console.error('============ DATABASE INSERT ERROR ============');
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Event data that failed:', JSON.stringify(eventData, null, 2));
      console.error('==============================================');
      throw error;
    }
    
    console.log('✅ Event successfully inserted:', event.event_code);
    
    // Create initial task for new event
    await createInitialTask(event);
    
    console.log('============ PROCESS FORM DATA SUCCESS ============');
    console.log('Created event code:', eventCode);
    console.log('Event name:', event.name);
    console.log('===================================================');
    
    return {
      success: true,
      event_code: eventCode,
      message: `Event created successfully with code ${eventCode}`,
      event_name: event.name
    };
  } catch (error) {
    console.error('============ PROCESS FORM DATA ERROR ============');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('================================================');
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
