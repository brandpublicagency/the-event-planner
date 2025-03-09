
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { getSystemMessage } from '../../utils/systemMessageUtils.ts';
import { handleTimeoutError, withTimeout, WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { fetchEvents, fetchContacts, fetchDocuments, fetchTasks, checkDatabaseConnection } from '../../utils/dataFetcher.ts';
import { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext } from '../../utils/contextFormatter.ts';
import { handleError } from '../../utils/errorHandler.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

// Main function to handle AI-powered question answering
export const handleAIQuestion = async (question: string): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing AI question:', question);
    
    // First check database connection
    const connectionOk = await checkDatabaseConnection();
    if (!connectionOk) {
      return {
        type: 'text',
        message: "I'm having trouble connecting to our system. Please try again in a few moments."
      };
    }
    
    // Fetch all required data with timeouts
    const { events, contacts, documents, tasks } = await fetchContextData();
    
    console.log(`Context data loaded: events=${events.length}, contacts=${contacts.length}, documents=${documents.length}, tasks=${tasks.length}`);
    
    if (events.length === 0 && contacts.length === 0 && documents.length === 0 && tasks.length === 0) {
      // If all data fetching failed, return a connection error
      return {
        type: 'text',
        message: "I'm having trouble accessing our database right now. Please try again shortly."
      };
    }
    
    // Check if we have no events but the question is about events
    if (isEventQuestion(question) && events.length === 0) {
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
    
    // Get system message for AI
    const systemMessage = getSystemMessage(
      eventsContext,
      contactsContext,
      documentsContext,
      "", // No PDF content in WhatsApp context
      tasksContext
    );
    
    console.log('System message length:', systemMessage.length);
    
    // Generate AI completion
    try {
      const completion = await generateAICompletion(question, systemMessage);
      
      // Handle function calls if any
      const functionCall = completion.choices[0]?.message?.function_call;
      let answer = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process your question. Please try again.";
      
      if (functionCall) {
        answer = await processFunctionCall(functionCall);
      }
      
      return {
        type: 'text',
        message: answer
      };
    } catch (error) {
      console.error('Error with primary model, falling back to simpler response:', error);
      return generateFallbackResponse(question);
    }
  } catch (error) {
    console.error('Error handling AI question:', error);
    return handleTimeoutError(error);
  }
};

// Helper function to fetch all context data in parallel
async function fetchContextData() {
  const eventsPromise = withTimeout(fetchEvents(), 'fetchEvents', 10000);
  const contactsPromise = withTimeout(fetchContacts(), 'fetchContacts', 10000);
  const documentsPromise = withTimeout(fetchDocuments(), 'fetchDocuments', 10000);
  const tasksPromise = withTimeout(fetchTasks(), 'fetchTasks', 10000);
  
  const [events, contacts, documents, tasks] = await Promise.all([
    eventsPromise.catch(err => {
      console.error('Error fetching events:', err);
      return [];
    }),
    contactsPromise.catch(err => {
      console.error('Error fetching contacts:', err);
      return [];
    }),
    documentsPromise.catch(err => {
      console.error('Error fetching documents:', err);
      return [];
    }),
    tasksPromise.catch(err => {
      console.error('Error fetching tasks:', err);
      return [];
    })
  ]);
  
  return { events, contacts, documents, tasks };
}

// Helper function to check if a question is event-related
function isEventQuestion(question: string): boolean {
  const eventRelatedTerms = ['event', 'party', 'wedding', 'function', 'gathering', 'ceremony'];
  return eventRelatedTerms.some(term => question.toLowerCase().includes(term));
}

// Helper function to generate AI completion
async function generateAICompletion(question: string, systemMessage: string) {
  return await withTimeout(
    openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the same model as web interface
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: question }
      ],
      temperature: 0.5,
      max_tokens: 800,
      function_call: "auto",
      functions: getFunctionDefinitions()
    }),
    "OpenAI completion",
    25000
  );
}

// Helper function to get function definitions for OpenAI
function getFunctionDefinitions() {
  return [
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
  ];
}

// Helper function to process function calls from OpenAI
async function processFunctionCall(functionCall: any): Promise<string> {
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

// Generate a fallback response when AI fails
function generateFallbackResponse(question: string): WhatsAppResponse {
  let fallbackResponse = "I apologize, but I'm having trouble generating a detailed response at the moment.";
  
  if (question.toLowerCase().includes('event')) {
    fallbackResponse += " You can use commands like 'next event' or 'events' to see upcoming events.";
  } else if (question.toLowerCase().includes('task')) {
    fallbackResponse += " You can use commands like 'tasks' or 'next task' to see your pending tasks.";
  } else {
    fallbackResponse += " Please try specific commands like 'help', 'events', or 'tasks'.";
  }
  
  return {
    type: 'text',
    message: fallbackResponse
  };
}
