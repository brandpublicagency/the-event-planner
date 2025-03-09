
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { getSystemMessage } from '../utils/systemMessageUtils.ts';
import { handleTimeoutError } from '../utils/timeoutUtils.ts';
import { fetchEvents, fetchContacts, fetchDocuments, fetchTasks } from '../utils/dataFetcher.ts';
import { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext } from '../utils/contextFormatter.ts';
import { handleError } from '../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

export const handleAIQuestion = async (question: string) => {
  try {
    console.log('Processing AI question:', question);
    
    // Fetch all required data
    const events = await fetchEvents();
    const contacts = await fetchContacts();
    const documents = await fetchDocuments();
    const tasks = await fetchTasks();
    
    console.log(`Context data loaded: events=${events.length}, contacts=${contacts.length}, documents=${documents.length}, tasks=${tasks.length}`);
    
    if (events.length === 0) {
      return {
        type: 'text',
        message: "Currently, there are no events found in the system. If you need assistance with creating an event or anything else, feel free to ask."
      };
    }
    
    // Format the context data for each entity type
    const eventsContext = formatEventsContext(events);
    const contactsContext = formatContactsContext(contacts);
    const documentsContext = formatDocumentsContext(documents);
    const tasksContext = formatTasksContext(tasks);
    
    // Use the shared system message generator used by both web and WhatsApp
    const systemMessage = getSystemMessage(
      eventsContext,
      contactsContext,
      documentsContext,
      "", // No PDF content in WhatsApp context
      tasksContext
    );
    
    console.log('System message length:', systemMessage.length);
    
    // Generate the AI completion using the formatted context
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the same model as web interface
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: question }
      ],
      temperature: 0.5,
      max_tokens: 800,
      function_call: "auto",
      functions: [
        {
          name: "update_event",
          description: "Update an event's details in the system",
          parameters: {
            type: "object",
            properties: {
              event_code: {
                type: "string",
                description: "The unique code identifying the event"
              },
              updates: {
                type: "object",
                description: "The fields to update in the event",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  event_type: { type: "string" },
                  event_date: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  pax: { type: "number" },
                  venues: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Valid values are: The Kitchen, The Gallery, The Grand Hall, Package 1, Package 2, Package 3"
                  },
                  primary_name: { type: "string" },
                  primary_phone: { type: "string" },
                  primary_email: { type: "string" },
                  secondary_name: { type: "string" },
                  secondary_phone: { type: "string" },
                  secondary_email: { type: "string" },
                  address: { type: "string" },
                  company: { type: "string" },
                  vat_number: { type: "string" },
                }
              }
            },
            required: ["event_code", "updates"]
          }
        },
        {
          name: "update_menu",
          description: "Update a menu for an event",
          parameters: {
            type: "object",
            properties: {
              event_code: {
                type: "string",
                description: "The unique code identifying the event"
              },
              menu_updates: {
                type: "object",
                description: "The menu fields to update"
              }
            },
            required: ["event_code", "menu_updates"]
          }
        }
      ]
    });

    // Check if there's a function call in the response
    const functionCall = completion.choices[0]?.message?.function_call;
    let answer = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process your question. Please try again.";
    
    if (functionCall) {
      console.log('Function call detected in WhatsApp:', functionCall.name);
      
      // Process function call and format user-friendly response
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

          // Actually perform the update
          const { error } = await supabase
            .from('events')
            .update(updates)
            .eq('event_code', eventCode);
          
          if (error) {
            throw error;
          }
          
          answer = `I've updated the event ${eventCode} with the following changes: ${JSON.stringify(updates)}.\n\nThe changes have been saved successfully.`;
        } catch (error) {
          console.error('Error processing function call from WhatsApp:', error);
          answer = `I encountered an error while trying to update the event. Please try again with more specific instructions.`;
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
          
          answer = `I've updated the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\nThe menu has been saved successfully.`;
        } catch (error) {
          console.error('Error updating menu from WhatsApp:', error);
          answer = `I encountered an error while trying to update the menu. Please try again with more specific instructions.`;
        }
      }
    }
    
    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling AI question:', error);
    return handleTimeoutError(error);
  }
};
