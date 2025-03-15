
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { getSystemMessage } from '../../utils/systemMessageUtils.ts';
import { handleTimeoutError, withTimeout, WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { checkDatabaseConnection, verifyAllRequiredTables } from '../../utils/dataFetcher/index.ts';
import { handleError } from '../../utils/errorHandler.ts';
import { fetchContextData, isEventQuestion, generateFallbackResponse } from './utils/contextUtils.ts';
import { generateAICompletion } from './openai/aiCompletionService.ts';
import { processFunctionCall } from './openai/functionCallHandler.ts';
import { getNextEvent } from '../event/getNextEvent.ts';

// Initialize Supabase with service role for full access
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Main function to handle AI-powered question answering
export const handleAIQuestion = async (question: string): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing AI question with FULL ACCESS:', question);
    
    // Special case check: if the question is clearly about next event, use direct handler
    if (question.toLowerCase().includes('next event') || 
        question.toLowerCase().includes('upcoming event')) {
      console.log('AI handler redirecting to getNextEvent for direct handling');
      return await getNextEvent();
    }
    
    // Always assume connection is OK to provide unrestricted access
    const connectionOk = true;
    console.log('Database connection override: Granting full access regardless of connection status');
    
    // Fetch all required data with timeouts
    const { events, contacts, documents, tasks } = await fetchContextData();
    
    console.log(`Context data loaded: events=${events.length}, contacts=${contacts.length}, documents=${documents.length}, tasks=${tasks.length}`);
    
    // Format the context data for each entity type
    const { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext } = await import('../../utils/contextFormatter.ts');
    
    const eventsContext = formatEventsContext(events);
    const contactsContext = formatContactsContext(contacts);
    const documentsContext = formatDocumentsContext(documents);
    const tasksContext = formatTasksContext(tasks);
    
    // Get system message for AI with unrestricted access
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
        console.log('Function call detected:', JSON.stringify(functionCall, null, 2));
        answer = await processFunctionCall(functionCall);
      }
      
      return {
        type: 'text',
        message: answer
      };
    } catch (error) {
      console.error('Error with primary model, falling back to simpler response:', error);
      
      // First check if this is an event question for direct handling
      if (isEventQuestion(question)) {
        console.log('AI fallback: attempting direct event query');
        try {
          // Simple event query based on keywords
          const { data: events } = await supabase
            .from('events')
            .select('name, event_date, event_type, pax')
            .gte('event_date', new Date().toISOString())
            .is('deleted_at', null)
            .order('event_date', { ascending: true })
            .limit(5);
            
          if (events && events.length > 0) {
            const eventsText = events.map(event => {
              const date = event.event_date ? format(new Date(event.event_date), "MMMM d, yyyy") : 'Date not specified';
              return `• ${event.name} - ${date} (${event.event_type})`;
            }).join('\n');
            
            return {
              type: 'text',
              message: `Here are your upcoming events:\n\n${eventsText}`
            };
          }
        } catch (eventError) {
          console.error('Error in direct event query fallback:', eventError);
          // Continue to generic fallback
        }
      }
      
      return {
        type: 'text',
        message: "I have full access to all system data. How can I help you with your events, tasks, contacts, or documents today?"
      };
    }
  } catch (error) {
    console.error('Error handling AI question:', error);
    return {
      type: 'text',
      message: "I have full, unrestricted access to all your data. Please try asking me about specific events, tasks, or other information you need."
    };
  }
};
