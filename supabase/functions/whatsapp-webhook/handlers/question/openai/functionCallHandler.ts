
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
      
      // Handle venue specifically - make sure it's an array
      if (updates && updates.venues) {
        if (!Array.isArray(updates.venues)) {
          if (typeof updates.venues === 'string') {
            updates.venues = [updates.venues];
            console.log('Converted venues string to array:', updates.venues);
          }
        }
      }

      // Perform the update
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('event_code', eventCode);
      
      if (error) {
        throw error;
      }
      
      return `I've updated the event ${eventCode} with the following changes: ${JSON.stringify(updates)}.\n\nThe changes have been saved successfully.`;
    } catch (error) {
      console.error('Error processing function call from WhatsApp:', error);
      return `I encountered an error while trying to update the event. Please try again with more specific instructions.`;
    }
  }
  
  if (functionCall.name === 'update_menu') {
    try {
      const args = JSON.parse(functionCall.arguments || '{}');
      
      // Check if menu selection exists
      const { data: existingMenu } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', args.event_code)
        .maybeSingle();
      
      if (existingMenu) {
        // Update existing menu
        const { error } = await supabase
          .from('menu_selections')
          .update(args.menu_updates)
          .eq('event_code', args.event_code);
          
        if (error) throw error;
      } else {
        // Create new menu selection
        const { error } = await supabase
          .from('menu_selections')
          .insert({
            event_code: args.event_code,
            ...args.menu_updates
          });
          
        if (error) throw error;
      }
      
      return `I've updated the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\nThe menu has been saved successfully.`;
    } catch (error) {
      console.error('Error updating menu from WhatsApp:', error);
      return `I encountered an error while trying to update the menu. Please try again with more specific instructions.`;
    }
  }
  
  return "I processed your request, but couldn't complete the specific action you requested.";
}
