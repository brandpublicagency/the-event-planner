import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to process function calls from OpenAI
export async function processFunctionCall(functionCall: any): Promise<string> {
  console.log('Function call detected in WhatsApp:', functionCall.name);
  
  if (functionCall.name === 'update_event') {
    try {
      const args = JSON.parse(functionCall.arguments || '{}');
      console.log('Update event arguments from WhatsApp:', args);
      
      // Ensure we have a clean event_code and updates
      const eventCode = args.event_code;
      let updates = args.updates;
      
      if (!eventCode || !updates) {
        console.error('Missing required parameters for update_event:', args);
        return "I couldn't update the event because some required information was missing. Please provide both an event code and the values to update.";
      }
      
      // Handle venue formatting specifically
      if (updates && updates.venues) {
        // Always ensure venues is an array
        if (!Array.isArray(updates.venues)) {
          if (typeof updates.venues === 'string') {
            updates.venues = [updates.venues];
            console.log('Converted venues string to array:', updates.venues);
          } else {
            console.error('Invalid venues format:', updates.venues);
            return "I couldn't update the venue information because it was in an invalid format. Venues should be provided as a list.";
          }
        }
        
        // Validate venue values against allowed options
        const allowedVenues = [
          'The Kitchen', 'The Gallery', 'The Grand Hall', 
          'The Lawn', 'The Avenue',
          'Package 1', 'Package 2', 'Package 3'
        ];
        const validVenues = updates.venues.filter((venue: string) => allowedVenues.includes(venue));
        
        if (validVenues.length !== updates.venues.length) {
          console.warn('Some venues were invalid and filtered out:', 
            updates.venues.filter((v: string) => !allowedVenues.includes(v)));
          updates.venues = validVenues;
          
          if (validVenues.length === 0) {
            return "I couldn't update the venue because none of the specified venues are valid. Valid options are: The Kitchen, The Gallery, The Grand Hall, The Lawn, The Avenue, Package 1, Package 2, or Package 3.";
          }
        }
      }

      // First check if the event exists
      const { data: eventExists, error: checkError } = await supabase
        .from('events')
        .select('name')
        .eq('event_code', eventCode)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking event existence:', checkError);
        throw checkError;
      }
      
      if (!eventExists) {
        return `I couldn't find an event with code ${eventCode}. Please check the event code and try again.`;
      }
      
      console.log('Performing update on event', eventCode, 'with values:', updates);
      
      // Perform the update
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('event_code', eventCode);
      
      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }
      
      // Format the updates for the response
      const updateDescription = Object.entries(updates)
        .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      return `I've updated the event ${eventCode} with the following changes:\n${updateDescription}\n\nThe changes have been saved successfully.`;
    } catch (error) {
      console.error('Error processing function call from WhatsApp:', error);
      return `I encountered an error while trying to update the event: ${error.message || 'Unknown error'}. Please try again with more specific instructions.`;
    }
  }
  
  if (functionCall.name === 'update_menu') {
    try {
      const args = JSON.parse(functionCall.arguments || '{}');
      console.log('Update menu arguments from WhatsApp:', args);
      
      const eventCode = args.event_code;
      const menuUpdates = args.menu_updates;
      
      if (!eventCode || !menuUpdates) {
        console.error('Missing required parameters for update_menu:', args);
        return "I couldn't update the menu because some required information was missing. Please provide both an event code and the menu details to update.";
      }
      
      // Check if menu selection exists
      const { data: existingMenu } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .maybeSingle();
      
      let updateResult;
      
      if (existingMenu) {
        // Update existing menu
        console.log('Updating existing menu for event', eventCode);
        updateResult = await supabase
          .from('menu_selections')
          .update(menuUpdates)
          .eq('event_code', eventCode);
      } else {
        // Create new menu selection
        console.log('Creating new menu for event', eventCode);
        updateResult = await supabase
          .from('menu_selections')
          .insert({
            event_code: eventCode,
            ...menuUpdates
          });
      }
      
      if (updateResult.error) {
        console.error('Error updating menu:', updateResult.error);
        throw updateResult.error;
      }
      
      // Format the updates for the response
      const menuDescription = Object.entries(menuUpdates)
        .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      return `I've updated the menu for event ${eventCode} with the following changes:\n${menuDescription}\n\nThe menu has been saved successfully.`;
    } catch (error) {
      console.error('Error updating menu from WhatsApp:', error);
      return `I encountered an error while trying to update the menu: ${error.message || 'Unknown error'}. Please try again with more specific instructions.`;
    }
  }
  
  return "I processed your request, but couldn't complete the specific action you requested.";
}
